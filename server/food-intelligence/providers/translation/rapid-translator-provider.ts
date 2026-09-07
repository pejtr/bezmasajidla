// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// RapidAPI Translator Adapter with Persistent Research Caching
// ============================================================

import type { TranslationProvider } from "../../types";
import { defaultProviderCache, ProviderCache } from "../../cache/provider-cache";

export interface RapidTranslatorConfig {
  enabled: boolean;
  apiKey: string;
  apiHost: string;
  baseUrl: string;
  timeoutMs?: number;
}

export class RapidTranslatorProvider implements TranslationProvider {
  public readonly id = "rapid";
  private config: RapidTranslatorConfig;
  private cache: ProviderCache;

  constructor(customConfig?: Partial<RapidTranslatorConfig>, cache?: ProviderCache) {
    this.config = {
      enabled: process.env.RAPID_TRANSLATOR_ENABLED === "true",
      apiKey: process.env.RAPIDAPI_KEY || "",
      apiHost: process.env.RAPID_TRANSLATOR_HOST || "rapid-translate-multi-traduction.p.rapidapi.com",
      baseUrl: (process.env.RAPID_TRANSLATOR_BASE_URL || "https://rapid-translate-multi-traduction.p.rapidapi.com").replace(/\/+$/, ""),
      timeoutMs: 8000,
      ...customConfig,
    };
    this.cache = cache || defaultProviderCache;
  }

  public isEnabled(): boolean {
    return this.config.enabled && Boolean(this.config.apiKey);
  }

  /**
   * Detects language of input text
   */
  async detectLanguage(text: string): Promise<{
    language: string;
    confidence?: number;
  }> {
    const trimmed = text.trim();
    if (!trimmed) {
      return { language: "und", confidence: 0 };
    }

    if (!this.isEnabled()) {
      return this.heuristicLanguageDetection(trimmed);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs || 8000);

    try {
      const response = await fetch(`${this.config.baseUrl}/detect/language`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": this.config.apiKey,
          "x-rapidapi-host": this.config.apiHost,
          Accept: "application/json",
        },
        body: JSON.stringify({ text: trimmed }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Detection HTTP error ${response.status}`);
      }

      const data = await response.json();
      const detected =
        data?.language ||
        data?.lang ||
        (Array.isArray(data) && data[0]?.language) ||
        "und";
      const confidence = data?.confidence || data?.score || undefined;

      return { language: String(detected).toLowerCase(), confidence };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn("[RapidTranslatorProvider] Language detection unavailable, using heuristic fallback:", err);
      return this.heuristicLanguageDetection(trimmed);
    }
  }

  /**
   * Translates text with persistent SHA256 caching
   */
  async translate(input: {
    text: string;
    sourceLanguage?: string;
    targetLanguage: string;
  }): Promise<{
    translatedText: string;
    sourceLanguage?: string;
  }> {
    const trimmed = input.text.trim();
    if (!trimmed) {
      return { translatedText: "", sourceLanguage: input.sourceLanguage };
    }

    // 1. Check cache first
    const cached = await this.cache.getTranslation({
      provider: this.id,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      text: trimmed,
    });

    if (cached) {
      return cached;
    }

    // 2. If provider is disabled or missing credentials, return original text gracefully
    if (!this.isEnabled()) {
      return {
        translatedText: trimmed,
        sourceLanguage: input.sourceLanguage || "unknown",
      };
    }

    // 3. Perform network translation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs || 8000);

    try {
      const payloadVariants = {
        text: trimmed,
        from: input.sourceLanguage || "auto",
        to: input.targetLanguage,
        source_language: input.sourceLanguage || "auto",
        target_language: input.targetLanguage,
      };

      const response = await fetch(`${this.config.baseUrl}/translate/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": this.config.apiKey,
          "x-rapidapi-host": this.config.apiHost,
          Accept: "application/json",
        },
        body: JSON.stringify(payloadVariants),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Translation HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const translated =
        data?.translatedText ||
        data?.translation ||
        data?.text ||
        (Array.isArray(data) && data[0]?.translation) ||
        trimmed;

      const detectedSource = data?.sourceLanguage || data?.from || input.sourceLanguage;

      // 4. Store in cache
      await this.cache.setTranslation(
        {
          provider: this.id,
          sourceLanguage: input.sourceLanguage,
          targetLanguage: input.targetLanguage,
          text: trimmed,
        },
        translated,
        detectedSource
      );

      return {
        translatedText: translated,
        sourceLanguage: detectedSource,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn("[RapidTranslatorProvider] Translation failed gracefully:", err?.message || err);
      // Graceful fallback: return original text
      return {
        translatedText: trimmed,
        sourceLanguage: input.sourceLanguage || "unknown",
      };
    }
  }

  /**
   * Deterministic local heuristic for common characters / scripts
   */
  private heuristicLanguageDetection(text: string): { language: string; confidence: number } {
    // Cyrillic (Ukrainian/Russian)
    if (/[\u0400-\u04FF]/.test(text)) {
      if (/[іїєґ]/i.test(text)) return { language: "uk", confidence: 0.9 };
      return { language: "ru", confidence: 0.7 };
    }
    // Czech diacritics
    if (/[ěščřžýáíéůúťďň]/i.test(text)) {
      return { language: "cs", confidence: 0.95 };
    }
    // German specific
    if (/[äöüß]/i.test(text)) {
      return { language: "de", confidence: 0.9 };
    }
    // French specific
    if (/[œçàâêîôû]/i.test(text)) {
      return { language: "fr", confidence: 0.9 };
    }
    // Default to English heuristic for ASCII
    return { language: "en", confidence: 0.6 };
  }
}

export const defaultRapidTranslatorProvider = new RapidTranslatorProvider();
