// ============================================================
// BEZMASAJIDLA.CZ — Grocery Readiness Interface & Types (v1.1)
// ============================================================

export interface ParsedIngredient {
  raw: string;
  name: string; // Canonical morphological name (e.g. "cizrna", "olivový olej")
  amount?: number; // e.g. 400, 2.5
  unit?: string; // e.g. "g", "lžíce", "ks", "stroužek"
  category?: string; // e.g. "lusteniny", "oleje", "koreni", "zelenina"
  query: string; // Clean search query for grocery merchant lookup
}

export interface GroceryItemMatch {
  ingredient: ParsedIngredient;
  matchedProduct?: {
    title: string;
    price?: number;
    currency: string;
    affiliateUrl: string;
  };
}

export interface GroceryAffiliateProvider {
  readonly name: string;
  readonly isConfigured: boolean;
  buildCartUrl(ingredients: ParsedIngredient[]): string | null;
  searchProduct(query: string): Promise<GroceryItemMatch | null>;
}
