// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Configuration
// Update these URLs after registering with affiliate programs
// ============================================================

/**
 * Wolt affiliate links
 * Register at: https://wolt.com/cs/cze/prague (partner program)
 * Commission: 3.75–5.25 EUR per new order
 *
 * Usage: use getWoltLink(restaurant.woltUrl) on restaurant detail pages
 */
export const WOLT_AFFILIATE_BASE = "https://wolt.com/cs/cze/prague";
export const WOLT_AFFILIATE_TAG = ""; // Add your affiliate tag after registration, e.g. "?affiliate=bezmasajidla"

export function getWoltLink(restaurantWoltUrl?: string): string {
  const base = restaurantWoltUrl || WOLT_AFFILIATE_BASE;
  return WOLT_AFFILIATE_TAG ? `${base}${WOLT_AFFILIATE_TAG}` : base;
}

/**
 * Rohlík.cz affiliate links
 * Register at: https://www.rohlik.cz/affiliate
 * Commission: 100 Kč per new customer
 *
 * Usage: use getRohlikLink(searchQuery) on recipe detail pages
 */
export const ROHLIK_AFFILIATE_BASE = "https://www.rohlik.cz/hledat";
export const ROHLIK_AFFILIATE_TAG = ""; // Add your affiliate tag after registration

export function getRohlikLink(searchQuery?: string): string {
  const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
  const tag = ROHLIK_AFFILIATE_TAG ? `${query ? "&" : "?"}ref=${ROHLIK_AFFILIATE_TAG}` : "";
  return `${ROHLIK_AFFILIATE_BASE}${query}${tag}`;
}

/**
 * Košík.cz affiliate links
 * Register at: https://www.kosik.cz/affiliate
 * Commission: 8% from first order
 *
 * Usage: use getKosikLink(searchQuery) on recipe detail pages
 */
export const KOSIK_AFFILIATE_BASE = "https://www.kosik.cz/vyhledavani";
export const KOSIK_AFFILIATE_TAG = ""; // Add your affiliate tag after registration

export function getKosikLink(searchQuery?: string): string {
  const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : "";
  const tag = KOSIK_AFFILIATE_TAG ? `${query ? "&" : "?"}ref=${KOSIK_AFFILIATE_TAG}` : "";
  return `${KOSIK_AFFILIATE_BASE}${query}${tag}`;
}
