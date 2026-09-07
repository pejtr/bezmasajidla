// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Deterministic Multilingual Ingredient Normalizer & OMNISHOPPER Dictionary
// ============================================================

import type { NormalizedIngredient, IngredientAlias } from "../types";
import { parseIngredient } from "../../affiliate/grocery/parser";

/**
 * Deterministic multilingual alias database for plant-forward & vegetarian gastronomy.
 * Canonical IDs are standardized for future OMNISHOPPER automated cart/retail sync.
 */
export const INGREDIENT_ALIASES: IngredientAlias[] = [
  // ── Mushrooms ──────────────────────────────────────────────
  { canonicalId: "mushroom", locale: "cs", alias: "žampiony", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "cs", alias: "žampion", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "cs", alias: "žampionů", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "cs", alias: "houby", canonicalCzech: "houby", category: "zelenina" },
  { canonicalId: "mushroom", locale: "cs", alias: "hřiby", canonicalCzech: "houby", category: "zelenina" },
  { canonicalId: "mushroom", locale: "cs", alias: "hlíva", canonicalCzech: "hlíva ústřičná", category: "zelenina" },
  { canonicalId: "mushroom", locale: "cs", alias: "hlíva ústřičná", canonicalCzech: "hlíva ústřičná", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "mushroom", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "mushrooms", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "button mushroom", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "button mushrooms", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "cremini mushrooms", canonicalCzech: "hnědé žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "portobello", canonicalCzech: "portobello", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "shiitake", canonicalCzech: "shiitake", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "oyster mushroom", canonicalCzech: "hlíva ústřičná", category: "zelenina" },
  { canonicalId: "mushroom", locale: "en", alias: "oyster mushrooms", canonicalCzech: "hlíva ústřičná", category: "zelenina" },
  { canonicalId: "mushroom", locale: "fr", alias: "champignon", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "fr", alias: "champignons", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "fr", alias: "champignon de paris", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "de", alias: "champignons", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "de", alias: "pilze", canonicalCzech: "houby", category: "zelenina" },
  { canonicalId: "mushroom", locale: "uk", alias: "печериці", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "uk", alias: "печериця", canonicalCzech: "žampiony", category: "zelenina" },
  { canonicalId: "mushroom", locale: "uk", alias: "гриби", canonicalCzech: "houby", category: "zelenina" },

  // ── Legumes ────────────────────────────────────────────────
  { canonicalId: "chickpea", locale: "cs", alias: "cizrna", canonicalCzech: "cizrna", category: "lusteniny" },
  { canonicalId: "chickpea", locale: "cs", alias: "cizrny", canonicalCzech: "cizrna", category: "lusteniny" },
  { canonicalId: "chickpea", locale: "en", alias: "chickpea", canonicalCzech: "cizrna", category: "lusteniny" },
  { canonicalId: "chickpea", locale: "en", alias: "chickpeas", canonicalCzech: "cizrna", category: "lusteniny" },
  { canonicalId: "chickpea", locale: "en", alias: "garbanzo beans", canonicalCzech: "cizrna", category: "lusteniny" },
  { canonicalId: "chickpea", locale: "uk", alias: "нут", canonicalCzech: "cizrna", category: "lusteniny" },
  { canonicalId: "chickpea", locale: "fr", alias: "pois chiches", canonicalCzech: "cizrna", category: "lusteniny" },
  { canonicalId: "chickpea", locale: "de", alias: "kichererbsen", canonicalCzech: "cizrna", category: "lusteniny" },

  { canonicalId: "red_lentil", locale: "cs", alias: "červená čočka", canonicalCzech: "červená čočka", category: "lusteniny" },
  { canonicalId: "red_lentil", locale: "cs", alias: "červené čočky", canonicalCzech: "červená čočka", category: "lusteniny" },
  { canonicalId: "red_lentil", locale: "en", alias: "red lentil", canonicalCzech: "červená čočka", category: "lusteniny" },
  { canonicalId: "red_lentil", locale: "en", alias: "red lentils", canonicalCzech: "červená čočka", category: "lusteniny" },
  { canonicalId: "red_lentil", locale: "uk", alias: "червона сочевиця", canonicalCzech: "červená čočka", category: "lusteniny" },
  { canonicalId: "red_lentil", locale: "de", alias: "rote linsen", canonicalCzech: "červená čočka", category: "lusteniny" },

  { canonicalId: "lentil", locale: "cs", alias: "čočka", canonicalCzech: "čočka", category: "lusteniny" },
  { canonicalId: "lentil", locale: "en", alias: "lentils", canonicalCzech: "čočka", category: "lusteniny" },
  { canonicalId: "lentil", locale: "en", alias: "brown lentils", canonicalCzech: "hnědá čočka", category: "lusteniny" },
  { canonicalId: "lentil", locale: "en", alias: "beluga lentils", canonicalCzech: "černá čočka beluga", category: "lusteniny" },
  { canonicalId: "lentil", locale: "uk", alias: "сочевиця", canonicalCzech: "čočka", category: "lusteniny" },

  { canonicalId: "black_bean", locale: "cs", alias: "černé fazole", canonicalCzech: "černé fazole", category: "lusteniny" },
  { canonicalId: "black_bean", locale: "en", alias: "black beans", canonicalCzech: "černé fazole", category: "lusteniny" },
  { canonicalId: "bean", locale: "cs", alias: "fazole", canonicalCzech: "fazole", category: "lusteniny" },
  { canonicalId: "bean", locale: "en", alias: "beans", canonicalCzech: "fazole", category: "lusteniny" },
  { canonicalId: "bean", locale: "en", alias: "kidney beans", canonicalCzech: "červené fazole", category: "lusteniny" },
  { canonicalId: "bean", locale: "uk", alias: "квасоля", canonicalCzech: "fazole", category: "lusteniny" },

  // ── Plant Proteins ─────────────────────────────────────────
  { canonicalId: "tofu", locale: "cs", alias: "tofu", canonicalCzech: "tofu", category: "rostlinne_proteiny" },
  { canonicalId: "tofu", locale: "cs", alias: "uzené tofu", canonicalCzech: "uzené tofu", category: "rostlinne_proteiny" },
  { canonicalId: "tofu", locale: "en", alias: "tofu", canonicalCzech: "tofu", category: "rostlinne_proteiny" },
  { canonicalId: "tofu", locale: "en", alias: "smoked tofu", canonicalCzech: "uzené tofu", category: "rostlinne_proteiny" },
  { canonicalId: "tofu", locale: "en", alias: "silken tofu", canonicalCzech: "hedvábné tofu", category: "rostlinne_proteiny" },
  { canonicalId: "tofu", locale: "en", alias: "firm tofu", canonicalCzech: "pevné tofu", category: "rostlinne_proteiny" },
  { canonicalId: "tofu", locale: "uk", alias: "тофу", canonicalCzech: "tofu", category: "rostlinne_proteiny" },

  { canonicalId: "tempeh", locale: "cs", alias: "tempeh", canonicalCzech: "tempeh", category: "rostlinne_proteiny" },
  { canonicalId: "tempeh", locale: "cs", alias: "uzený tempeh", canonicalCzech: "uzený tempeh", category: "rostlinne_proteiny" },
  { canonicalId: "tempeh", locale: "en", alias: "tempeh", canonicalCzech: "tempeh", category: "rostlinne_proteiny" },
  { canonicalId: "tempeh", locale: "uk", alias: "темпе", canonicalCzech: "tempeh", category: "rostlinne_proteiny" },

  { canonicalId: "seitan", locale: "cs", alias: "seitan", canonicalCzech: "seitan", category: "rostlinne_proteiny" },
  { canonicalId: "seitan", locale: "en", alias: "seitan", canonicalCzech: "seitan", category: "rostlinne_proteiny" },
  { canonicalId: "seitan", locale: "uk", alias: "сейтан", canonicalCzech: "seitan", category: "rostlinne_proteiny" },

  // ── Vegetables & Aromatics ─────────────────────────────────
  { canonicalId: "garlic", locale: "cs", alias: "česnek", canonicalCzech: "česnek", category: "zelenina" },
  { canonicalId: "garlic", locale: "cs", alias: "stroužek česneku", canonicalCzech: "česnek", category: "zelenina" },
  { canonicalId: "garlic", locale: "en", alias: "garlic", canonicalCzech: "česnek", category: "zelenina" },
  { canonicalId: "garlic", locale: "en", alias: "garlic cloves", canonicalCzech: "česnek", category: "zelenina" },
  { canonicalId: "garlic", locale: "en", alias: "clove garlic", canonicalCzech: "česnek", category: "zelenina" },
  { canonicalId: "garlic", locale: "uk", alias: "часник", canonicalCzech: "česnek", category: "zelenina" },
  { canonicalId: "garlic", locale: "fr", alias: "ail", canonicalCzech: "česnek", category: "zelenina" },
  { canonicalId: "garlic", locale: "de", alias: "knoblauch", canonicalCzech: "česnek", category: "zelenina" },

  { canonicalId: "onion", locale: "cs", alias: "cibule", canonicalCzech: "cibule", category: "zelenina" },
  { canonicalId: "onion", locale: "cs", alias: "červená cibule", canonicalCzech: "červená cibule", category: "zelenina" },
  { canonicalId: "onion", locale: "cs", alias: "jarní cibulka", canonicalCzech: "jarní cibulka", category: "zelenina" },
  { canonicalId: "onion", locale: "en", alias: "onion", canonicalCzech: "cibule", category: "zelenina" },
  { canonicalId: "onion", locale: "en", alias: "onions", canonicalCzech: "cibule", category: "zelenina" },
  { canonicalId: "onion", locale: "en", alias: "red onion", canonicalCzech: "červená cibule", category: "zelenina" },
  { canonicalId: "onion", locale: "en", alias: "shallot", canonicalCzech: "šalotka", category: "zelenina" },
  { canonicalId: "onion", locale: "en", alias: "green onion", canonicalCzech: "jarní cibulka", category: "zelenina" },
  { canonicalId: "onion", locale: "en", alias: "scallion", canonicalCzech: "jarní cibulka", category: "zelenina" },
  { canonicalId: "onion", locale: "uk", alias: "цибуля", canonicalCzech: "cibule", category: "zelenina" },

  { canonicalId: "tomato", locale: "cs", alias: "rajčata", canonicalCzech: "rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "cs", alias: "rajče", canonicalCzech: "rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "cs", alias: "cherry rajčata", canonicalCzech: "cherry rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "cs", alias: "pasírovaná rajčata", canonicalCzech: "pasírovaná rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "cs", alias: "drcená rajčata", canonicalCzech: "drcená rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "en", alias: "tomato", canonicalCzech: "rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "en", alias: "tomatoes", canonicalCzech: "rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "en", alias: "cherry tomatoes", canonicalCzech: "cherry rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "en", alias: "crushed tomatoes", canonicalCzech: "drcená rajčata", category: "zelenina" },
  { canonicalId: "tomato", locale: "en", alias: "tomato paste", canonicalCzech: "rajčatový protlak", category: "zelenina" },
  { canonicalId: "tomato", locale: "uk", alias: "помідори", canonicalCzech: "rajčata", category: "zelenina" },

  { canonicalId: "avocado", locale: "cs", alias: "avokádo", canonicalCzech: "avokádo", category: "ovoce" },
  { canonicalId: "avocado", locale: "en", alias: "avocado", canonicalCzech: "avokádo", category: "ovoce" },
  { canonicalId: "avocado", locale: "uk", alias: "авокадо", canonicalCzech: "avokádo", category: "ovoce" },

  { canonicalId: "ginger", locale: "cs", alias: "zázvor", canonicalCzech: "zázvor", category: "zelenina" },
  { canonicalId: "ginger", locale: "en", alias: "ginger", canonicalCzech: "zázvor", category: "zelenina" },
  { canonicalId: "ginger", locale: "uk", alias: "імбир", canonicalCzech: "zázvor", category: "zelenina" },

  { canonicalId: "sweet_potato", locale: "cs", alias: "batát", canonicalCzech: "batáty", category: "zelenina" },
  { canonicalId: "sweet_potato", locale: "cs", alias: "batáty", canonicalCzech: "batáty", category: "zelenina" },
  { canonicalId: "sweet_potato", locale: "en", alias: "sweet potato", canonicalCzech: "batáty", category: "zelenina" },
  { canonicalId: "sweet_potato", locale: "en", alias: "sweet potatoes", canonicalCzech: "batáty", category: "zelenina" },

  { canonicalId: "eggplant", locale: "cs", alias: "lilek", canonicalCzech: "lilek", category: "zelenina" },
  { canonicalId: "eggplant", locale: "en", alias: "eggplant", canonicalCzech: "lilek", category: "zelenina" },
  { canonicalId: "eggplant", locale: "en", alias: "aubergine", canonicalCzech: "lilek", category: "zelenina" },
  { canonicalId: "eggplant", locale: "uk", alias: "баклажан", canonicalCzech: "lilek", category: "zelenina" },

  { canonicalId: "zucchini", locale: "cs", alias: "cuketa", canonicalCzech: "cuketa", category: "zelenina" },
  { canonicalId: "zucchini", locale: "en", alias: "zucchini", canonicalCzech: "cuketa", category: "zelenina" },
  { canonicalId: "zucchini", locale: "en", alias: "courgette", canonicalCzech: "cuketa", category: "zelenina" },
  { canonicalId: "zucchini", locale: "uk", alias: "кабачок", canonicalCzech: "cuketa", category: "zelenina" },

  { canonicalId: "spinach", locale: "cs", alias: "špenát", canonicalCzech: "špenát", category: "zelenina" },
  { canonicalId: "spinach", locale: "en", alias: "spinach", canonicalCzech: "špenát", category: "zelenina" },
  { canonicalId: "spinach", locale: "en", alias: "baby spinach", canonicalCzech: "baby špenát", category: "zelenina" },
  { canonicalId: "spinach", locale: "uk", alias: "шпинат", canonicalCzech: "špenát", category: "zelenina" },

  // ── Pantry, Condiments & Pastes ────────────────────────────
  { canonicalId: "tahini", locale: "cs", alias: "tahini", canonicalCzech: "tahini", category: "dochucovadla" },
  { canonicalId: "tahini", locale: "cs", alias: "tahini sezamová pasta", canonicalCzech: "tahini", category: "dochucovadla" },
  { canonicalId: "tahini", locale: "en", alias: "tahini", canonicalCzech: "tahini", category: "dochucovadla" },
  { canonicalId: "tahini", locale: "en", alias: "sesame paste", canonicalCzech: "tahini", category: "dochucovadla" },

  { canonicalId: "miso", locale: "cs", alias: "miso", canonicalCzech: "miso pasta", category: "dochucovadla" },
  { canonicalId: "miso", locale: "cs", alias: "miso pasta", canonicalCzech: "miso pasta", category: "dochucovadla" },
  { canonicalId: "miso", locale: "en", alias: "miso", canonicalCzech: "miso pasta", category: "dochucovadla" },
  { canonicalId: "miso", locale: "en", alias: "miso paste", canonicalCzech: "miso pasta", category: "dochucovadla" },

  { canonicalId: "nutritional_yeast", locale: "cs", alias: "lahůdkové droždí", canonicalCzech: "lahůdkové droždí", category: "dochucovadla" },
  { canonicalId: "nutritional_yeast", locale: "en", alias: "nutritional yeast", canonicalCzech: "lahůdkové droždí", category: "dochucovadla" },
  { canonicalId: "nutritional_yeast", locale: "en", alias: "nooch", canonicalCzech: "lahůdkové droždí", category: "dochucovadla" },

  { canonicalId: "coconut_milk", locale: "cs", alias: "kokosové mléko", canonicalCzech: "kokosové mléko", category: "rostlinne_alternativy" },
  { canonicalId: "coconut_milk", locale: "en", alias: "coconut milk", canonicalCzech: "kokosové mléko", category: "rostlinne_alternativy" },
  { canonicalId: "coconut_milk", locale: "en", alias: "coconut cream", canonicalCzech: "kokosový krém", category: "rostlinne_alternativy" },

  { canonicalId: "soy_sauce", locale: "cs", alias: "sójová omáčka", canonicalCzech: "sójová omáčka", category: "dochucovadla" },
  { canonicalId: "soy_sauce", locale: "cs", alias: "tamari", canonicalCzech: "tamari", category: "dochucovadla" },
  { canonicalId: "soy_sauce", locale: "en", alias: "soy sauce", canonicalCzech: "sójová omáčka", category: "dochucovadla" },
  { canonicalId: "soy_sauce", locale: "en", alias: "tamari", canonicalCzech: "tamari", category: "dochucovadla" },

  { canonicalId: "olive_oil", locale: "cs", alias: "olivový olej", canonicalCzech: "olivový olej", category: "oleje" },
  { canonicalId: "olive_oil", locale: "en", alias: "olive oil", canonicalCzech: "olivový olej", category: "oleje" },
  { canonicalId: "olive_oil", locale: "en", alias: "extra virgin olive oil", canonicalCzech: "extra panenský olivový olej", category: "oleje" },

  // ── Grains & Seeds ─────────────────────────────────────────
  { canonicalId: "quinoa", locale: "cs", alias: "quinoa", canonicalCzech: "quinoa", category: "obiloviny" },
  { canonicalId: "quinoa", locale: "en", alias: "quinoa", canonicalCzech: "quinoa", category: "obiloviny" },

  { canonicalId: "rice", locale: "cs", alias: "rýže", canonicalCzech: "rýže", category: "obiloviny" },
  { canonicalId: "rice", locale: "cs", alias: "jasmínová rýže", canonicalCzech: "jasmínová rýže", category: "obiloviny" },
  { canonicalId: "rice", locale: "cs", alias: "basmati rýže", canonicalCzech: "basmati rýže", category: "obiloviny" },
  { canonicalId: "rice", locale: "en", alias: "rice", canonicalCzech: "rýže", category: "obiloviny" },
  { canonicalId: "rice", locale: "en", alias: "jasmine rice", canonicalCzech: "jasmínová rýže", category: "obiloviny" },
  { canonicalId: "rice", locale: "en", alias: "basmati rice", canonicalCzech: "basmati rýže", category: "obiloviny" },

  { canonicalId: "pasta", locale: "cs", alias: "těstoviny", canonicalCzech: "těstoviny", category: "obiloviny" },
  { canonicalId: "pasta", locale: "en", alias: "pasta", canonicalCzech: "těstoviny", category: "obiloviny" },
  { canonicalId: "pasta", locale: "en", alias: "noodles", canonicalCzech: "nudle", category: "obiloviny" },
];

/**
 * Fast lookup index: normalized alias -> IngredientAlias
 */
const aliasMap = new Map<string, IngredientAlias>();
for (const entry of INGREDIENT_ALIASES) {
  const key = normalizeAliasKey(entry.alias);
  aliasMap.set(key, entry);
}

function normalizeAliasKey(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[,\.;:()\[\]"']/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Normalizes an arbitrary ingredient string (Czech, English, Ukrainian, French, German)
 * into a canonical entity for research and OMNISHOPPER matching.
 */
export function normalizeIngredient(rawIngredient: string, sourceLocale = "cs"): NormalizedIngredient {
  const parsed = parseIngredient(rawIngredient);
  const normalizedKey = normalizeAliasKey(parsed.name || rawIngredient);

  // 1. Direct deterministic match in multilingual alias database
  const directMatch = aliasMap.get(normalizedKey);
  if (directMatch) {
    return {
      canonicalId: directMatch.canonicalId,
      canonicalName: directMatch.canonicalCzech,
      originalName: rawIngredient,
      category: directMatch.category,
    };
  }

  // 2. Substring/token match in alias database
  for (let i = 0; i < INGREDIENT_ALIASES.length; i++) {
    const aliasEntry = INGREDIENT_ALIASES[i];
    const key = normalizeAliasKey(aliasEntry.alias);
    if (key.length >= 4 && normalizedKey.includes(key)) {
      return {
        canonicalId: aliasEntry.canonicalId,
        canonicalName: aliasEntry.canonicalCzech,
        originalName: rawIngredient,
        category: aliasEntry.category,
      };
    }
  }

  // 3. Czech morphological parser result
  if (parsed.name && parsed.name.length > 0) {
    const canonicalId = parsed.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    return {
      canonicalId: canonicalId || "ingredient",
      canonicalName: parsed.name,
      originalName: rawIngredient,
      category: parsed.category,
    };
  }

  // 4. Default clean fallback
  return {
    canonicalId: normalizedKey.replace(/[^a-z0-9]+/g, "_").slice(0, 32) || "ingredient",
    canonicalName: rawIngredient.trim(),
    originalName: rawIngredient,
  };
}
