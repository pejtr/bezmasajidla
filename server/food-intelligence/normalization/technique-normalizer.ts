// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Culinary Technique Normalizer
// ============================================================

export interface TechniqueMapping {
  canonicalId: string;
  canonicalCzech: string;
  patterns: RegExp[];
}

export const TECHNIQUE_MAPPINGS: TechniqueMapping[] = [
  {
    canonicalId: "roast",
    canonicalCzech: "pečení",
    patterns: [/\b(roast|roasted|roasting|bake|baked|baking|pečen[ýéáí]|péct)\b/i],
  },
  {
    canonicalId: "char_grill",
    canonicalCzech: "grilování",
    patterns: [/\b(grill|grilled|grilling|charred|charring|barbecue|bbq|grilovan[ýéáí])\b/i],
  },
  {
    canonicalId: "pan_sear",
    canonicalCzech: "restování",
    patterns: [/\b(saute|sauté|sauteed|sautéed|pan-sear|pan-fry|stir-fry|restovan[ýéáí]|osmahnout)\b/i],
  },
  {
    canonicalId: "deep_fry",
    canonicalCzech: "smažení",
    patterns: [/\b(deep-fry|deep-fried|crispy-fried|tempura|smažen[ýéáí]|usmažit)\b/i],
  },
  {
    canonicalId: "simmer_braise",
    canonicalCzech: "dušení",
    patterns: [/\b(simmer|simmered|braise|braised|slow-cook|stew|dušen[ýéáí]|dusit)\b/i],
  },
  {
    canonicalId: "steam",
    canonicalCzech: "vaření v páře",
    patterns: [/\b(steam|steamed|steaming|v páře)\b/i],
  },
  {
    canonicalId: "blend_puree",
    canonicalCzech: "mixování a pyré",
    patterns: [/\b(blend|blended|puree|pureed|pyré|rozmixovat|emulsify)\b/i],
  },
  {
    canonicalId: "ferment_pickle",
    canonicalCzech: "fermentace a nakládání",
    patterns: [/\b(ferment|fermented|pickle|pickled|nakládan[ýéáí]|kvasit|kvašen[ýéáí])\b/i],
  },
  {
    canonicalId: "caramelize",
    canonicalCzech: "karamelizace",
    patterns: [/\b(caramelize|caramelized|karamelizovan[ýéáí])\b/i],
  },
  {
    canonicalId: "marinate",
    canonicalCzech: "marinování",
    patterns: [/\b(marinate|marinated|marinovan[ýéáí]|naložen[ýéáí])\b/i],
  },
];

/**
 * Extracts normalized techniques from titles, descriptions, and instructions.
 */
export function normalizeTechniques(...textSnippets: string[]): string[] {
  const combined = textSnippets.join(" ").toLowerCase();
  const matchedTechniques = new Set<string>();

  for (const mapping of TECHNIQUE_MAPPINGS) {
    for (const pattern of mapping.patterns) {
      if (pattern.test(combined)) {
        matchedTechniques.add(mapping.canonicalCzech);
        break;
      }
    }
  }

  return Array.from(matchedTechniques);
}
