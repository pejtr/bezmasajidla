// ============================================================
// BEZMASAJIDLA.CZ — Base Affiliate Provider
// ============================================================

import { AFFILIATE_CONFIG } from "../config";
import type { AffiliateMerchant, AffiliateProvider, RawAffiliateProduct, NormalizedAffiliateProduct } from "../types";

export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export abstract class BaseAffiliateProvider implements AffiliateProvider {
  abstract merchant: AffiliateMerchant;
  abstract feedUrl: string;

  async fetchFeed(timeoutMs = AFFILIATE_CONFIG.matching.feedTimeoutMs): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(this.feedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "BezmasajidlaAffiliateEngine/1.0 (https://www.bezmasajidla.cz)",
          Accept: "application/xml, text/xml, application/atom+xml, */*",
        },
      });

      if (!response.ok) {
        throw new Error(
          `[AffiliateProvider:${this.merchant}] Feed fetch failed with status ${response.status}: ${response.statusText}`
        );
      }

      return await response.text();
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error(
          `[AffiliateProvider:${this.merchant}] Feed fetch timed out after ${timeoutMs}ms`
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  abstract parseFeed(xmlContent: string): Promise<RawAffiliateProduct[]>;
  abstract filterAndNormalize(rawProducts: RawAffiliateProduct[]): NormalizedAffiliateProduct[];
  abstract buildAffiliateUrl(sourceUrl?: string): string;
}
