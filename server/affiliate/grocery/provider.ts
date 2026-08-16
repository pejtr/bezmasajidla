// ============================================================
// BEZMASAJIDLA.CZ — Grocery Affiliate Provider Implementation
// Pure interface abstraction with explicit safe placeholder
// ============================================================

import type { GroceryAffiliateProvider, ParsedIngredient, GroceryItemMatch } from "./types";

/**
 * Explicit safe fallback provider indicating no grocery partner is active.
 * Never generates fake URLs or speculative deeplinks.
 */
export class UnavailableGroceryProvider implements GroceryAffiliateProvider {
  readonly name = "UnavailableGroceryProvider";
  readonly isConfigured = false;

  buildCartUrl(_ingredients: ParsedIngredient[]): string | null {
    return null;
  }

  async searchProduct(_query: string): Promise<GroceryItemMatch | null> {
    return null;
  }
}
