// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Safe Link & Redirect Service
// Protects against open-redirect vulnerabilities with strict domain whitelisting.
// ============================================================

import { AFFILIATE_CONFIG } from "./config";
import type { AffiliateMerchant } from "./types";
import { getAffiliateProductById } from "./storage";

export function isWhitelistedDomain(urlStr: string): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    return AFFILIATE_CONFIG.whitelistedDomains.some(
      domain => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export function buildEhubTrackingUrl(
  merchant: AffiliateMerchant,
  destinationUrl: string
): string {
  const aid = AFFILIATE_CONFIG.ehub.aid;
  const bid =
    merchant === "ekoclovek"
      ? AFFILIATE_CONFIG.ehub.ekoclovekBid
      : AFFILIATE_CONFIG.ehub.zazitkyBid;

  const validDest = isWhitelistedDomain(destinationUrl)
    ? destinationUrl
    : merchant === "ekoclovek"
    ? "https://eshop.ekoclovek.cz/"
    : "https://www.zazitky.cz/";

  return `${AFFILIATE_CONFIG.ehub.clickScriptUrl}?a_aid=${aid}&a_bid=${bid}&desturl=${encodeURIComponent(validDest)}`;
}

export async function getSafeAffiliateUrl(params: {
  merchant: AffiliateMerchant;
  productId?: string;
  destinationUrl?: string;
}): Promise<string> {
  const { merchant, productId, destinationUrl } = params;

  if (productId) {
    const product = await getAffiliateProductById(productId);
    if (product?.affiliateUrl) {
      return product.affiliateUrl;
    }
    if (product?.sourceUrl && isWhitelistedDomain(product.sourceUrl)) {
      return buildEhubTrackingUrl(merchant, product.sourceUrl);
    }
  }

  if (destinationUrl && isWhitelistedDomain(destinationUrl)) {
    return buildEhubTrackingUrl(merchant, destinationUrl);
  }

  // Fallback to merchant homepage
  const defaultHome =
    merchant === "ekoclovek"
      ? "https://eshop.ekoclovek.cz/"
      : "https://www.zazitky.cz/gurmanske-zazitky";
  return buildEhubTrackingUrl(merchant, defaultHome);
}
