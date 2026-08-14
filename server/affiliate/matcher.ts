// ============================================================
// BEZMASAJIDLA.CZ — Recipe-to-Affiliate Matcher Engine
// Transparent, deterministic multi-factor relevance scoring.
// ============================================================

import { AFFILIATE_CONFIG } from "./config";
import { normalizeText } from "./providers/base";
import type {
  NormalizedAffiliateProduct,
  RecipeMatchContext,
  AffiliateMatchResult,
} from "./types";

export function scoreProductForRecipe(
  product: NormalizedAffiliateProduct,
  recipe: RecipeMatchContext
): number {
  let score = 0;

  const normalizedRecipeTitle = normalizeText(recipe.title);
  const normalizedRecipeCuisine = normalizeText(recipe.cuisine || "");
  const normalizedRecipeCategory = normalizeText(recipe.category || "");
  const normalizedIngredients = recipe.ingredients.map(normalizeText);
  const normalizedRecipeTags = recipe.tags.map(normalizeText);

  const productTitle = normalizeText(product.title);
  const productDesc = normalizeText(product.description || "");
  const productTags = product.tags.map(normalizeText);
  const productCuisines = product.cuisines.map(normalizeText);
  const productIngredients = product.ingredients.map(normalizeText);

  // ── 1. Cuisine Matching (+40 points) ──────────────────────────────
  if (normalizedRecipeCuisine) {
    const isDirectCuisineMatch = productCuisines.some(c =>
      normalizedRecipeCuisine.includes(c) || c.includes(normalizedRecipeCuisine)
    );
    if (isDirectCuisineMatch) {
      score += 40;
    }
  }

  // ── 2. Ingredient Matching (+25 points per match, max 50) ─────────
  let ingredientMatches = 0;
  for (const prodIng of productIngredients) {
    const hasMatch = normalizedIngredients.some(
      recIng => recIng.includes(prodIng) || prodIng.includes(recIng)
    );
    if (hasMatch) {
      ingredientMatches++;
    }
  }
  score += Math.min(50, ingredientMatches * 25);

  // Check for specific herb / garden mentions in ingredients
  const gardenKeywords = ["chilli", "rajc", "paprik", "bazalk", "mat", "oregan", "tymian", "rozmaryn", "cesnek", "cibul", "salat", "koriandr"];
  for (const kw of gardenKeywords) {
    const inRecipe = normalizedIngredients.some(ing => ing.includes(kw)) || normalizedRecipeTitle.includes(kw);
    const inProduct = productTitle.includes(kw) || productTags.some(t => t.includes(kw));
    if (inRecipe && inProduct) {
      score += 20;
      break;
    }
  }

  // ── 3. Category Context Matching (+20 points) ─────────────────────
  if (normalizedRecipeCategory.includes("dezert") || normalizedRecipeCategory.includes("sladk")) {
    if (productTags.includes("dezerty") || productTags.includes("peceni") || productTitle.includes("cokolad") || productTitle.includes("makronk")) {
      score += 25;
    }
  } else if (normalizedRecipeCategory.includes("polevk") || normalizedRecipeCategory.includes("hlavni") || normalizedRecipeCategory.includes("vecere")) {
    if (product.merchant === "ekoclovek" && (productTags.includes("bylinky") || productTags.includes("seminka") || productTags.includes("pestovani"))) {
      score += 15;
    }
  } else if (normalizedRecipeCategory.includes("napoj") || normalizedRecipeCategory.includes("smoothie")) {
    if (productTags.includes("napoje") || productTags.includes("kav") || productTags.includes("caj")) {
      score += 30;
    }
  }

  // ── 4. Specific Culinary Skills (Bread, Pizza, Pasta, Sourdough) ──
  const culinarySkillMap: Record<string, string[]> = {
    chleb: ["chleb", "kvask", "pecen"],
    pizza: ["pizza", "italsk"],
    testovin: ["pasta", "testovin", "italsk"],
    gulas: ["cesk", "pivo", "tradicni"],
    svickov: ["cesk", "kurz", "tradicni"],
    kari: ["indick", "curry", "asijsk"],
    curry: ["indick", "curry", "asijsk"],
    sushi: ["sushi", "japonsk", "asijsk"],
    "pad thai": ["thajsk", "asijsk", "wok"],
  };

  for (const [key, patterns] of Object.entries(culinarySkillMap)) {
    if (normalizedRecipeTitle.includes(key) || normalizedRecipeTags.some(t => t.includes(key))) {
      const matchesProduct = patterns.some(p => productTitle.includes(p) || productTags.some(t => t.includes(p)));
      if (matchesProduct) {
        score += 35;
      }
    }
  }

  // ── 5. Keyword Overlap (+10 points) ───────────────────────────────
  const recipeWords = normalizedRecipeTitle.split(/\s+/).filter(w => w.length > 3);
  for (const word of recipeWords) {
    if (productTitle.includes(word) || productDesc.includes(word)) {
      score += 10;
      break;
    }
  }

  return score;
}

export function matchAffiliateProducts(
  allProducts: NormalizedAffiliateProduct[],
  recipe: RecipeMatchContext
): AffiliateMatchResult {
  const threshold = AFFILIATE_CONFIG.matching.minRelevanceThreshold;
  const maxProducts = AFFILIATE_CONFIG.matching.maxProductsPerRecipe;
  const maxExperiences = AFFILIATE_CONFIG.matching.maxExperiencesPerRecipe;

  const scoredProducts: Array<{ product: NormalizedAffiliateProduct; score: number }> = [];
  const scoredExperiences: Array<{ product: NormalizedAffiliateProduct; score: number }> = [];

  for (const product of allProducts) {
    if (!product.active) continue;

    const score = scoreProductForRecipe(product, recipe);

    if (score >= threshold) {
      const enriched = { ...product, relevanceScore: score };
      if (product.merchant === "ekoclovek") {
        scoredProducts.push({ product: enriched, score });
      } else if (product.merchant === "zazitky") {
        scoredExperiences.push({ product: enriched, score });
      }
    }
  }

  // Sort descending by relevance score
  scoredProducts.sort((a, b) => b.score - a.score);
  scoredExperiences.sort((a, b) => b.score - a.score);

  return {
    products: scoredProducts.slice(0, maxProducts).map(item => item.product),
    experiences: scoredExperiences.slice(0, maxExperiences).map(item => item.product),
  };
}
