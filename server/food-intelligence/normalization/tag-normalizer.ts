// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Taxonomic Tag Normalizer
// ============================================================

const TAG_TRANSLATION_MAP: Record<string, string> = {
  // Dietary
  vegan: "veganské",
  vegetarian: "vegetariánské",
  "gluten-free": "bezlepkové",
  gluten_free: "bezlepkové",
  dairy_free: "bez laktózy",
  healthy: "zdravé",

  // Meal types
  dinner: "večeře",
  lunch: "oběd",
  breakfast: "snídaně",
  brunch: "brunch",
  soup: "polévka",
  salad: "salát",
  dessert: "dezert",
  snack: "svačina",
  appetizer: "předkrm",
  side_dish: "příloha",

  // Occasions / Attributes
  easy: "snadné",
  under_30_minutes: "do 30 minut",
  under_45_minutes: "do 45 minut",
  weeknight: "rychlá večeře",
  comfort_food: "comfort food",
  one_pot: "z jednoho hrnce",
  sheet_pan: "z jednoho plechu",
  meal_prep: "meal prep",
  party: "na párty a oslavy",
  kid_friendly: "vhodné pro děti",
  summer: "letní",
  autumn: "podzimní",
  winter: "zimní",
  spring: "jarní",
};

/**
 * Normalizes raw external provider tags into BezmasáJídla taxonomy tags
 */
export function normalizeTags(rawTags: string[]): string[] {
  const normalized = new Set<string>();

  for (const raw of rawTags) {
    const key = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (TAG_TRANSLATION_MAP[key]) {
      normalized.add(TAG_TRANSLATION_MAP[key]);
    } else {
      // Retain clean tag if descriptive
      const clean = raw.trim().toLowerCase();
      if (clean.length >= 3 && clean.length <= 24 && !/^[0-9]+$/.test(clean)) {
        normalized.add(clean);
      }
    }
  }

  return Array.from(normalized);
}
