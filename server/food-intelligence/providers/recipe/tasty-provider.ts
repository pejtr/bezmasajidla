// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Tasty (RapidAPI) Recipe Intelligence Adapter
// ============================================================

import type { ExternalRecipeSignal, RecipeIntelligenceProvider } from "../../types";
import { normalizeIngredient } from "../../normalization/ingredient-normalizer";
import { normalizeTechniques } from "../../normalization/technique-normalizer";
import { normalizeTags } from "../../normalization/tag-normalizer";

export interface TastyProviderConfig {
  enabled: boolean;
  apiKey: string;
  apiHost: string;
  baseUrl: string;
  timeoutMs?: number;
}

export interface ProviderMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rateLimitHits: number;
  lastRequestAt?: string;
  lastError?: string;
}

export class TastyProvider implements RecipeIntelligenceProvider {
  public readonly id = "tasty";
  private config: TastyProviderConfig;
  private metrics: ProviderMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    rateLimitHits: 0,
  };
  private searchCache = new Map<string, { timestamp: number; signals: ExternalRecipeSignal[] }>();
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  constructor(customConfig?: Partial<TastyProviderConfig>) {
    this.config = {
      enabled: process.env.TASTY_PROVIDER_ENABLED === "true",
      apiKey: process.env.RAPIDAPI_KEY || "",
      apiHost: process.env.TASTY_RAPIDAPI_HOST || "tasty.p.rapidapi.com",
      baseUrl: (process.env.TASTY_RAPIDAPI_BASE_URL || "https://tasty.p.rapidapi.com").replace(/\/+$/, ""),
      timeoutMs: 8000,
      ...customConfig,
    };
  }

  public isEnabled(): boolean {
    return this.config.enabled && Boolean(this.config.apiKey);
  }

  public getMetrics(): ProviderMetrics {
    return { ...this.metrics };
  }

  /**
   * Search external recipe signals from Tasty API for research
   */
  async search(input: {
    query: string;
    limit?: number;
    vegetarianOnly?: boolean;
  }): Promise<ExternalRecipeSignal[]> {
    if (!this.isEnabled()) {
      return [];
    }

    const limit = Math.min(Math.max(input.limit || 10, 1), 40);
    const cacheKey = `${input.query.trim().toLowerCase()}:${limit}:${input.vegetarianOnly !== false}`;

    // Cache lookup
    const cached = this.searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.signals;
    }

    const url = new URL(`${this.config.baseUrl}/recipes/list`);
    url.searchParams.set("from", "0");
    url.searchParams.set("size", String(limit));
    url.searchParams.set("q", input.query.trim());
    if (input.vegetarianOnly !== false) {
      url.searchParams.set("tags", "vegetarian");
    }

    try {
      const responseData = await this.executeFetchWithRetry(url.toString());
      if (!responseData || !Array.isArray(responseData.results)) {
        return [];
      }

      const signals = responseData.results
        .filter((item: any) => item && (item.id || item.name))
        .map((item: any) => this.mapToCanonicalSignal(item));

      this.searchCache.set(cacheKey, { timestamp: Date.now(), signals });
      return signals;
    } catch (err: any) {
      this.metrics.failedRequests++;
      this.metrics.lastError = err?.message || String(err);
      console.warn(`[TastyProvider] Search failed gracefully for query "${input.query}":`, err?.message || err);
      return [];
    }
  }

  /**
   * Retrieve external recipe signal by ID for deep research
   */
  async getById(externalId: string): Promise<ExternalRecipeSignal | null> {
    if (!this.isEnabled() || !externalId) {
      return null;
    }

    const url = new URL(`${this.config.baseUrl}/recipes/get-more-info`);
    url.searchParams.set("id", externalId);

    try {
      const responseData = await this.executeFetchWithRetry(url.toString());
      if (!responseData || !responseData.id) {
        return null;
      }
      return this.mapToCanonicalSignal(responseData);
    } catch (err: any) {
      this.metrics.failedRequests++;
      this.metrics.lastError = err?.message || String(err);
      console.warn(`[TastyProvider] getById failed gracefully for ID "${externalId}":`, err?.message || err);
      return null;
    }
  }

  /**
   * Safe fetch with AbortController timeout, 429 backoff, and 1 transient retry
   */
  private async executeFetchWithRetry(url: string, retries = 1): Promise<any> {
    this.metrics.totalRequests++;
    this.metrics.lastRequestAt = new Date().toISOString();

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs || 8000);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-key": this.config.apiKey,
            "x-rapidapi-host": this.config.apiHost,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
          this.metrics.rateLimitHits++;
          console.warn("[TastyProvider] Rate limit 429 received from RapidAPI");
          if (attempt < retries) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          return null;
        }

        if (response.status >= 500 && attempt < retries) {
          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        if (!response.ok) {
          throw new Error(`Tasty API HTTP error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        this.metrics.successfulRequests++;
        return data;
      } catch (err: any) {
        clearTimeout(timeoutId);
        const isAbort = err?.name === "AbortError" || err?.message?.includes("aborted");
        if (attempt >= retries || isAbort) {
          throw err;
        }
        await new Promise(r => setTimeout(r, 400));
      }
    }
    return null;
  }

  /**
   * Maps raw Tasty API response into canonical ExternalRecipeSignal.
   * Enforces publicationPolicy: "INTERNAL_ONLY".
   */
  private mapToCanonicalSignal(item: any): ExternalRecipeSignal {
    const rawTags: string[] = [];
    if (Array.isArray(item.tags)) {
      item.tags.forEach((t: any) => {
        if (typeof t === "string") rawTags.push(t);
        else if (t?.name) rawTags.push(t.name);
        else if (t?.display_name) rawTags.push(t.display_name);
      });
    }

    // Extract raw ingredients from components/sections
    const extractedIngredients: Array<{ canonicalName: string; originalName?: string }> = [];
    if (Array.isArray(item.sections)) {
      item.sections.forEach((sec: any) => {
        if (Array.isArray(sec.components)) {
          sec.components.forEach((c: any) => {
            const rawName = c.ingredient?.name || c.raw_text || "";
            if (rawName) {
              const normalized = normalizeIngredient(rawName, "en");
              extractedIngredients.push({
                canonicalName: normalized.canonicalName,
                originalName: rawName,
              });
            }
          });
        }
      });
    }

    const prepMinutes = item.prep_time_minutes || undefined;
    const cookMinutes = item.cook_time_minutes || undefined;
    const isVegetarian = rawTags.some(t => /vegetarian/i.test(t)) || Boolean(item.is_vegetarian);
    const isVegan = rawTags.some(t => /vegan/i.test(t)) || Boolean(item.is_vegan);

    const techniques = normalizeTechniques(
      item.name || "",
      item.instructions?.map((i: any) => i.display_text || "").join(" ") || ""
    );

    const normalizedTags = normalizeTags(rawTags);

    return {
      provider: this.id,
      externalId: String(item.id || ""),
      sourceUrl: item.canonical_id ? `https://tasty.co/recipe/${item.canonical_id}` : undefined,
      sourceLanguage: "en",
      title: item.name || "Untitled Tasty Recipe",
      normalizedIngredients: extractedIngredients,
      tags: normalizedTags,
      techniques,
      category: item.topics?.[0]?.name || undefined,
      cuisine: this.extractCuisine(rawTags),
      vegetarian: isVegetarian,
      vegan: isVegan,
      prepMinutes,
      cookMinutes,
      fetchedAt: new Date().toISOString(),
      provenance: {
        provider: this.id,
        sourceUrl: item.canonical_id ? `https://tasty.co/recipe/${item.canonical_id}` : undefined,
      },
      publicationPolicy: "INTERNAL_ONLY",
    };
  }

  private extractCuisine(tags: string[]): string | undefined {
    const cuisineKeywords = [
      "italian",
      "mexican",
      "asian",
      "indian",
      "mediterranean",
      "french",
      "japanese",
      "thai",
      "chinese",
      "middle eastern",
      "greek",
      "vietnamese",
      "korean",
    ];
    for (const tag of tags) {
      const lower = tag.toLowerCase();
      for (const c of cuisineKeywords) {
        if (lower.includes(c)) return c;
      }
    }
    return undefined;
  }
}
