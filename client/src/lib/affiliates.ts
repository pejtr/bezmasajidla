// ============================================================
// BEZMASAJIDLA.CZ — Affiliate & Partner Configuration
// ============================================================
// Rohlik.cz  → CJ / VIVnetworks (100 Kč za nového zákazníka)
// Košík.cz   → CJ / VIVnetworks (100–150 Kč za nového zákazníka)
// Scuk.cz    → Referral program (50 Kč kredit za nového zákazníka)
// Tesco Online → CJ / VIVnetworks (35–350 Kč za Club členství)
// ============================================================

// ── Rohlik.cz ────────────────────────────────────────────────
// Registrace: https://www.vivnetworks.com → CJ → vyhledat "Rohlik.cz"
// Provize: 100 Kč za první nákup nového zákazníka
// Cookie: 30 dní
// Omezení: Zakázán SEM na brand
export const ROHLIK_AFFILIATE_TAG = "D9ihjTQGenCjkym-B0PRY1FKxg";

export function getRohlikLink(searchQuery?: string, ingredients?: string[]): string {
  // Preferujeme hledat hlavní ingredience, ne jen název receptu
  const query = buildSearchQuery(searchQuery, ingredients);
  const base = "https://www.rohlik.cz/hledat";
  const search = query ? `?search=${encodeURIComponent(query)}` : "";
  const tag = ROHLIK_AFFILIATE_TAG ? `${search ? "&" : "?"}ref=${ROHLIK_AFFILIATE_TAG}` : "";
  return `${base}${search}${tag}`;
}

// ── Košík.cz ─────────────────────────────────────────────────
// Registrace: https://www.vivnetworks.com → CJ → vyhledat "Košík.cz"
// Provize: 100–150 Kč za první nákup nového zákazníka
// Cookie: 30 dní
// Omezení: Zakázán SEM na brand
export const KOSIK_AFFILIATE_TAG = ""; // Vyplnit po registraci v CJ, např. "bezmasajidla"

export function getKosikLink(searchQuery?: string, ingredients?: string[]): string {
  const query = buildSearchQuery(searchQuery, ingredients);
  const base = "https://www.kosik.cz/vyhledavani";
  const search = query ? `?search=${encodeURIComponent(query)}` : "";
  const tag = KOSIK_AFFILIATE_TAG ? `${search ? "&" : "?"}ref=${KOSIK_AFFILIATE_TAG}` : "";
  return `${base}${search}${tag}`;
}

// ── Scuk.cz (Referral program) ───────────────────────────────
// Kontakt: marketing@scuk.cz pro partnerství
// Referral: 50 Kč kredit za každého nového zákazníka
// Zákazník získá 10% slevu na první nákup (max 200 Kč při nákupu 2000+ Kč)
export const SCUK_REFERRAL_CODE = ""; // Vyplnit po domluvě se Scuk, např. "BEZMASAJIDLA"

export function getScukLink(searchQuery?: string, ingredients?: string[]): string {
  const query = buildSearchQuery(searchQuery, ingredients);
  const base = "https://www.scuk.cz/hledani";
  const search = query ? `?q=${encodeURIComponent(query)}` : "";
  const referral = SCUK_REFERRAL_CODE ? `${search ? "&" : "?"}kod=${SCUK_REFERRAL_CODE}` : "";
  return `${base}${search}${referral}`;
}

// ── Tesco Online ─────────────────────────────────────────────
// Registrace: https://www.vivnetworks.com → CJ → vyhledat "Tesco"
// Provize: 35 Kč za zkušební měsíc, 100–350 Kč za placené členství
// Model: Provize za Tesco Online Club členství
export const TESCO_AFFILIATE_TAG = ""; // Vyplnit po registraci v CJ

export function getTescoLink(searchQuery?: string, ingredients?: string[]): string {
  const query = buildSearchQuery(searchQuery, ingredients);
  const base = "https://nakup.itesco.cz/groceries/cs-CZ/search";
  const search = query ? `?query=${encodeURIComponent(query)}` : "";
  const tag = TESCO_AFFILIATE_TAG ? `${search ? "&" : "?"}ref=${TESCO_AFFILIATE_TAG}` : "";
  return `${base}${search}${tag}`;
}

// ── Wolt ─────────────────────────────────────────────────────
// Pro restaurace, ne pro recepty
export const WOLT_AFFILIATE_TAG = "";
export function getWoltLink(restaurantWoltUrl?: string): string {
  const base = restaurantWoltUrl || "https://wolt.com/cs/cze/prague";
  return WOLT_AFFILIATE_TAG ? `${base}${WOLT_AFFILIATE_TAG}` : base;
}

// ── Utilities ────────────────────────────────────────────────

/**
 * Vyextrahuje 3–4 klíčové ingredience z receptu pro lepší search query.
 * Místo "Houbové rizoto" → hledá "houby arborio rýže kešu" = lepší výsledky.
 */
function buildSearchQuery(recipeTitle?: string, ingredients?: string[]): string {
  if (ingredients && ingredients.length > 0) {
    // Vyber max 4 hlavní ingredience, očisti je od gramáží a jednotek
    const cleaned = ingredients
      .slice(0, 4)
      .map(cleanIngredient)
      .filter(Boolean);
    if (cleaned.length > 0) return cleaned.join(" ");
  }
  return recipeTitle || "";
}

/**
 * Očistí ingredienci od gramáží, čísel a jednotek.
 * "200 g tofu" → "tofu"
 * "3 lžíce sójové omáčky" → "sójová omáčka"
 */
function cleanIngredient(ingredient: string): string {
  return ingredient
    // Odstraň čísla na začátku a jednotky
    .replace(/^\d+[\s,/]*\d*\s*(g|kg|ml|l|dl|cl|ks|lžíce?|lžičk[ay]?|hrst[ěi]?|svaz(?:ek|ky)?|stroužk[yůůe]?|plátk[yůůe]?|kousek|kus[yůůe]?)\s*/gi, "")
    // Odstraň závorky
    .replace(/\(.*?\)/g, "")
    // Odstraň přebytečné mezery
    .replace(/\s+/g, " ")
    .trim();
}

// ── Tracking helper ──────────────────────────────────────────

/**
 * Zaznamená klik na affiliate odkaz do LeadOS (losTrack)
 */
type AffiliateEventData = {
  partner?: string;
  source: string;
  recipeSlug?: string;
};

function trackAffiliateEvent(eventName: string, data: AffiliateEventData) {
  if (typeof window === "undefined") return;

  const eventData = {
    ...data,
    partner: data.partner?.toLowerCase(),
    timestamp: new Date().toISOString(),
  };

  (window as any).losTrack?.(eventName, eventData);
  (window as any).umami?.track(eventName, eventData);
}

export function trackAffiliateIntent(source: string, recipeSlug?: string) {
  trackAffiliateEvent("affiliate_intent", { source, recipeSlug });
}

export function trackAffiliateClick(
  partner: string,
  recipeSlug: string,
  source = "recipe_detail",
) {
  trackAffiliateEvent("affiliate_click", {
    partner,
    recipeSlug,
    source,
  });
}

export function trackShoppingListCopy(source = "meal_planner") {
  trackAffiliateEvent("shopping_list_copy", { source });
}
