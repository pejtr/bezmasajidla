// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Translation & Provider Research Cache
// ============================================================

import { createHash } from "node:crypto";
import { getCachedTranslation, upsertCachedTranslation } from "../../db";

const DEFAULT_TTL_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface CacheKeyParams {
  provider: string;
  sourceLanguage?: string;
  targetLanguage: string;
  text: string;
}

/**
 * Normalizes input text for consistent SHA-256 cache key hashing.
 */
export function normalizeTextForCache(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Generates canonical SHA-256 hash key:
 * SHA256(provider + sourceLanguage + targetLanguage + normalizedInputText)
 */
export function generateTranslationCacheKey(params: CacheKeyParams): string {
  const normalizedText = normalizeTextForCache(params.text);
  const rawKey = `${params.provider}:${params.sourceLanguage || "auto"}:${params.targetLanguage}:${normalizedText}`;
  return createHash("sha256").update(rawKey, "utf8").digest("hex");
}

export class ProviderCache {
  private ttlMs: number;

  constructor(ttlDays = DEFAULT_TTL_DAYS) {
    this.ttlMs = ttlDays * MS_PER_DAY;
  }

  /**
   * Retrieves cached translation if available and unexpired.
   */
  async getTranslation(params: CacheKeyParams): Promise<{
    translatedText: string;
    sourceLanguage?: string;
  } | null> {
    const cacheKey = generateTranslationCacheKey(params);
    try {
      const record = await getCachedTranslation(cacheKey);
      if (!record) return null;

      // Validate unexpired
      if (new Date(record.expiresAt) <= new Date()) {
        return null;
      }

      return {
        translatedText: record.translatedText,
        sourceLanguage: record.sourceLanguage || params.sourceLanguage,
      };
    } catch (err) {
      console.warn("[ProviderCache] Error reading cache:", err);
      return null;
    }
  }

  /**
   * Persists translation with TTL.
   */
  async setTranslation(
    params: CacheKeyParams,
    translatedText: string,
    detectedSourceLanguage?: string
  ): Promise<void> {
    const cacheKey = generateTranslationCacheKey(params);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.ttlMs);

    try {
      await upsertCachedTranslation({
        cacheKey,
        provider: params.provider,
        sourceLanguage: detectedSourceLanguage || params.sourceLanguage || "auto",
        targetLanguage: params.targetLanguage,
        translatedText,
        expiresAt,
      });
    } catch (err) {
      console.warn("[ProviderCache] Error writing cache:", err);
    }
  }
}

export const defaultProviderCache = new ProviderCache();
