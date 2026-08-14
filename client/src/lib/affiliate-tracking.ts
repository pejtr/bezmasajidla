// ============================================================
// BEZMASAJIDLA.CZ — Client-Side Affiliate Analytics & Tracking
// Dispatches to GA4, Umami, LeadOS, and internal tRPC logger.
// ============================================================

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
    losTrack?: (eventName: string, eventData?: Record<string, any>) => void;
  }
}

export interface AffiliateTrackPayload {
  merchant: "ekoclovek" | "zazitky" | string;
  productId: string;
  productName: string;
  recipeSlug?: string;
  placement: "related_product" | "related_experience" | "recipe_ingredient" | "article_inline" | string;
  category?: string;
  cuisine?: string;
  price?: number;
}

const seenImpressions = new Set<string>();

export function trackClientAffiliateImpression(payload: AffiliateTrackPayload): void {
  const impressionKey = `${payload.merchant}:${payload.productId}:${payload.recipeSlug || ""}:${payload.placement}`;
  if (seenImpressions.has(impressionKey)) return;
  seenImpressions.add(impressionKey);

  // 1. Google Analytics 4 (GA4)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("event", "affiliate_impression", {
        affiliate_merchant: payload.merchant,
        affiliate_product_id: payload.productId,
        affiliate_product_name: payload.productName,
        affiliate_placement: payload.placement,
        recipe_slug: payload.recipeSlug,
        recipe_cuisine: payload.cuisine,
        value: payload.price,
        currency: "CZK",
      });
    } catch (e) {
      /* ignore */
    }
  }

  // 2. Umami Analytics
  if (typeof window !== "undefined" && window.umami?.track) {
    try {
      window.umami.track("affiliate_impression", {
        merchant: payload.merchant,
        product: payload.productName,
        placement: payload.placement,
        recipe: payload.recipeSlug,
      });
    } catch (e) {
      /* ignore */
    }
  }

  // 3. LeadOS Universal Traffic Pixel
  if (typeof window !== "undefined" && typeof window.losTrack === "function") {
    try {
      window.losTrack("affiliate_impression", {
        merchant: payload.merchant,
        productId: payload.productId,
        productName: payload.productName,
        placement: payload.placement,
        recipeSlug: payload.recipeSlug,
      });
    } catch (e) {
      /* ignore */
    }
  }
}

export function trackClientAffiliateClick(payload: AffiliateTrackPayload): void {
  // 1. Google Analytics 4 (GA4)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      window.gtag("event", "affiliate_click", {
        affiliate_merchant: payload.merchant,
        affiliate_product_id: payload.productId,
        affiliate_product_name: payload.productName,
        affiliate_placement: payload.placement,
        recipe_slug: payload.recipeSlug,
        recipe_cuisine: payload.cuisine,
        value: payload.price,
        currency: "CZK",
      });
    } catch (e) {
      /* ignore */
    }
  }

  // 2. Umami Analytics
  if (typeof window !== "undefined" && window.umami?.track) {
    try {
      window.umami.track("affiliate_click", {
        merchant: payload.merchant,
        product: payload.productName,
        placement: payload.placement,
        recipe: payload.recipeSlug,
      });
    } catch (e) {
      /* ignore */
    }
  }

  // 3. LeadOS Universal Traffic Pixel
  if (typeof window !== "undefined" && typeof window.losTrack === "function") {
    try {
      window.losTrack("affiliate_click", {
        merchant: payload.merchant,
        productId: payload.productId,
        productName: payload.productName,
        placement: payload.placement,
        recipeSlug: payload.recipeSlug,
      });
    } catch (e) {
      /* ignore */
    }
  }
}
