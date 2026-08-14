// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Commerce Engine v1 Types
// ============================================================

export type AffiliateMerchant = "ekoclovek" | "zazitky";

export type AffiliatePlacement =
  | "related_product"
  | "related_experience"
  | "recipe_ingredient"
  | "article_inline";

export interface RawAffiliateProduct {
  externalId: string;
  merchant: AffiliateMerchant;
  title: string;
  description?: string;
  sourceUrl?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  category?: string;
  rawCategories?: string[];
  rawAttributes?: Record<string, string>;
  inStock?: boolean;
}

export interface NormalizedAffiliateProduct {
  id: string; // e.g. "ekoclovek:52/5-0" or "zazitky:1138"
  externalId: string;
  merchant: AffiliateMerchant;
  title: string;
  description?: string;
  sourceUrl?: string;
  affiliateUrl: string;
  imageUrl?: string;
  price?: number;
  currency: string;
  category?: string;
  tags: string[];
  cuisines: string[];
  ingredients: string[];
  intents: string[];
  active: boolean;
  relevanceScore?: number;
  lastSeenAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecipeMatchContext {
  id?: string;
  slug: string;
  title: string;
  category?: string;
  cuisine?: string;
  ingredients: string[];
  tags: string[];
}

export interface AffiliateMatchResult {
  products: NormalizedAffiliateProduct[];
  experiences: NormalizedAffiliateProduct[];
}

export interface SyncResult {
  merchant: AffiliateMerchant;
  status: "success" | "failed";
  itemsFetched: number;
  itemsAccepted: number;
  itemsRejected: number;
  itemsInserted: number;
  itemsUpdated: number;
  itemsDeactivated: number;
  durationMs: number;
  errorMessage?: string;
}

export interface AffiliateProvider {
  merchant: AffiliateMerchant;
  feedUrl: string;
  fetchFeed(timeoutMs?: number): Promise<string>;
  parseFeed(xmlContent: string): Promise<RawAffiliateProduct[]>;
  filterAndNormalize(rawProducts: RawAffiliateProduct[]): NormalizedAffiliateProduct[];
  buildAffiliateUrl(sourceUrl?: string): string;
}
