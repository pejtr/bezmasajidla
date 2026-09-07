// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Crave Signal Heuristics & Multi-Factor Opportunity Scorer
// ============================================================

import {
  CraveSignal,
  CRAVE_SIGNALS,
  ExistingRecipeMatch,
  CommercialScoreBreakdown,
  QualityModifiers,
  ProfitOpportunityScore,
  OpportunityDecision,
  AffiliateVerificationDetail,
} from "../types";

function stripDiacritics(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Regex heuristics for the 14 Crave Signals aligned with BezmasáJídla visual DNA
 * Evaluated against normalized (diacritics-stripped) text for robust morphological matching.
 */
const CRAVE_PATTERNS: Record<CraveSignal, RegExp> = {
  CRISPY: /\b(crispy|crunchy|krupav\w*|krupn\w*|tempura|chips|panko|fritovan\w*|dozlatova)\b/i,
  CREAMY: /\b(creamy|kremov\w*|smetanov\w*|velvet|silky|risotto|puree|pyre|kase|kokosove mleko|cashew cream)\b/i,
  ROASTED: /\b(roasted|roast\w*|pecen\w*|sheet pan|carameliz\w*|pomale peceni|dozlatova upec\w*)\b/i,
  CHARRED: /\b(charred|grilovan\w*|uzen\w*|barbecue|bbq|kourov\w*|smoky|ohorel\w*|blister\w*)\b/i,
  CHEESY: /\b(cheesy|syrov\w*|zapecen\w*|parmazan|mozzarella|cheddar|parmigiano|vegan cheese|lahudkove drozdi)\b/i,
  UMAMI: /\b(umami|miso|tamari|sojov\w*|houbov\w*|shiitake|susena rajcata|lahudkove drozdi|morske rasy|garlic confit)\b/i,
  SPICY: /\b(spicy|paliv\w*|chilli|jalapeno|pikantn\w*|sriracha|harissa|kari|curry|gochujang|ostr\w*)\b/i,
  GARLICKY: /\b(garlic|cesnekov\w*|cesnek\w*|strouzek cesneku|peceny cesnek|aioli|aglio)\b/i,
  FRESH: /\b(fresh|cerstv\w*|svez\w*|citron\w*|limetk\w*|salat\w*|chladiv\w*|raw|letni|zelenin\w*)\b/i,
  HERBY: /\b(herby|bylinkov\w*|bylink\w*|bazalk\w*|koriandr\w*|petrzelk\w*|kopr\w*|tymian\w*|rozmaryn\w*|mata|pesto|chimichurri)\b/i,
  MELTY: /\b(melty|roztaven\w*|roztekl\w*|fondue|tahnouci|rozpusten\w*|grilled cheese|tekut\w*)\b/i,
  GLOSSY: /\b(glossy|leskl\w*|glazur\w*|glaze|glazed|sirup\w*|teriyaki|balsamico|lepkav\w*|sticky)\b/i,
  SHARING: /\b(sharing|na sdileni|mezze|tapas|platter|raut|prkenko|dip\w*|do misky|finger food|party)\b/i,
  COMFORT: /\b(comfort|utuln\w*|hrejiv\w*|eintopf|gulas\w*|polevk\w*|stew|domaci|babick\w*|nedelni|zasyti|vydatn\w*)\b/i,
};

/**
 * Detects all matching Crave Signals from text and tags
 */
export function detectCraveSignals(text: string, tags: string[] = []): CraveSignal[] {
  const normalized = stripDiacritics(`${text} ${tags.join(" ")}`);
  const matched: CraveSignal[] = [];

  for (const signal of CRAVE_SIGNALS) {
    if (CRAVE_PATTERNS[signal].test(normalized)) {
      matched.push(signal);
    }
  }

  return matched;
}

export interface ScoreCalculationParams {
  concept: string;
  frequency: number;
  craveSignals: CraveSignal[];
  cuisine?: string;
  ingredients: string[];
  techniques: string[];
  existingMatches: ExistingRecipeMatch[];
  isVegetarian: boolean;
  date?: Date;
}

export interface ScoreCalculationResult {
  score: number;
  reasons: string[];
}

/**
 * Calculates Content Gap Score (0 - 100) based on multiple qualitative & commercial factors.
 */
export interface ScoreCalculationResult {
  score: number;
  reasons: string[];
  profitScore?: ProfitOpportunityScore;
  decision?: OpportunityDecision;
  whyNow?: string;
  revenueRoutes?: string[];
}

/**
 * Commercial Pillar 1: Search Intent & Volume (20% weight)
 */
export function evaluateSearchIntent(concept: string, ingredients: string[]): number {
  const text = `${concept} ${ingredients.join(" ")}`.toLowerCase();
  if (/feta|shakshuka|šakšuk|brambor|potat|květák|cauliflower|těstovin|pasta|lilek|eggplant/i.test(text)) {
    return 88;
  }
  if (/čočk|lentil|brunch|lívanc|salát|burger|polévk|houb/i.test(text)) {
    return 76;
  }
  if (/varenyk|pirohy|mezze|sharing|tapas|dahl|curry/i.test(text)) {
    return 68;
  }
  return 55;
}

/**
 * Commercial Pillar 2: Affiliate & Commerce Potential (20% weight)
 * High intent for EVOO, aged balsamic, tahini, premium spices, cast iron pans, blenders.
 */
export function evaluateAffiliatePotential(ingredients: string[], techniques: string[]): number {
  const combined = `${ingredients.join(" ")} ${techniques.join(" ")}`.toLowerCase();
  let score = 40;

  // Premium condiments & oils
  if (/olivový olej|extra panensk|evoo|balsamico|lanýž/i.test(combined)) score += 28;
  if (/tahini|miso|tamari|sójová omáčka/i.test(combined)) score += 18;
  if (/lahůdkové droždí|uzená paprika|sumac|zaatar|koření/i.test(combined)) score += 12;
  if (/feta|sýr|parmazán/i.test(combined)) score += 10;
  // High-ticket cookware match (cast iron skillet, high-speed blender, chef knife)
  if (/mixování|blender|pečení|litin|pánev/i.test(combined)) score += 10;

  return Math.min(100, Math.max(15, score));
}

/**
 * Commercial Pillar 3: Social Visual & Video Potential (20% weight)
 * Aesthetic contrasts, sound (crisp), motion (cheese pull, sauce drizzle, dipping). Sonya Luna formats.
 */
export function evaluateSocialVisualPotential(concept: string, craveSignals: CraveSignal[], ingredients: string[]): number {
  const combined = `${concept} ${ingredients.join(" ")}`.toLowerCase();
  let score = 45;

  // Visual & sound cues
  if (craveSignals.includes("CRISPY")) score += 20; // sound crunch hook
  if (craveSignals.includes("MELTY") || craveSignals.includes("CHEESY")) score += 18; // cheese pull / dip
  if (craveSignals.includes("GLOSSY") || craveSignals.includes("ROASTED") || craveSignals.includes("CHARRED")) score += 14;
  if (craveSignals.includes("CREAMY") || craveSignals.includes("SHARING")) score += 12;

  // Visual color contrast (e.g. red tomato + white feta + green basil)
  if (/feta|rajčat|bylink|avokád|chilli|granátov/i.test(combined)) {
    score += 15;
  }

  return Math.min(100, Math.max(20, score));
}

/**
 * Commercial Pillar 4: Catering Relevance for Matouš (15% weight)
 * Finger food, tapas, mezze sharing boards, dips, skewers, items that hold quality on a buffet.
 */
export function evaluateCateringRelevance(concept: string, ingredients: string[], techniques: string[], craveSignals: CraveSignal[]): number {
  const combined = `${concept} ${ingredients.join(" ")} ${techniques.join(" ")}`.toLowerCase();
  let score = 40;

  // Sharing & finger food formats
  if (craveSignals.includes("SHARING") || /mezze|tapas|dip|platter|prkénk|finger food|raut|focaccia|pita/i.test(combined)) {
    score += 35;
  }
  // Stable warm-holding or room-temp vegetables & cheeses
  if (/feta|lilek|květák|brambor|cizrn|hummus|tartaletk/i.test(combined)) {
    score += 22;
  }
  // Penalize unsuited catering items (soups that cool down, delicate soggy salads, pasta that clumps in chafing)
  if (/polévk|vývar|soup/i.test(combined)) score -= 30;
  if (/těstovin|spaghetti|nudle/i.test(combined) && !/zapečen|salát/i.test(combined)) score -= 15;

  return Math.min(100, Math.max(10, score));
}

/**
 * Commercial Pillar 5: Cookbook Relevance (15% weight)
 * Timeless, repeatable, photogenic full-page recipe value.
 */
export function evaluateCookbookRelevance(concept: string, cuisine: string | undefined, craveSignals: CraveSignal[]): number {
  let score = 55;
  if (craveSignals.includes("COMFORT") || craveSignals.includes("ROASTED")) score += 15;
  if (craveSignals.includes("CREAMY") || craveSignals.includes("CHEESY")) score += 12;
  if (cuisine && /středomořsk|italsk|blízkovýchodn|česká/i.test(cuisine)) score += 12;
  return Math.min(100, Math.max(20, score));
}

/**
 * Commercial Pillar 6: Newsletter Potential (10% weight)
 * Clickable Sunday morning inspiration headline.
 */
export function evaluateNewsletterPotential(concept: string, craveSignals: CraveSignal[]): number {
  let score = 50;
  if (craveSignals.length >= 3) score += 25;
  else if (craveSignals.length >= 1) score += 15;
  if (craveSignals.includes("CRISPY") || craveSignals.includes("CREAMY")) score += 15;
  return Math.min(100, Math.max(25, score));
}

/**
 * Decouples theoretical affiliate fit from active merchant mapping.
 * Unmapped products must strictly remain HYPOTHESIS and not be treated as active revenue capability.
 */
export function buildAffiliateVerificationDetail(
  affiliateFitScore: number,
  candidateItems: string[] = [],
  merchant: string | null = null,
  productMapped: boolean = false,
  commissionKnown: boolean = false
): AffiliateVerificationDetail {
  const affiliateAvailable = Boolean(merchant && productMapped && commissionKnown);
  return {
    affiliateFitScore,
    affiliateAvailable,
    merchant,
    productMapped,
    commissionKnown,
    verificationStatus: affiliateAvailable ? "VERIFIED" : "HYPOTHESIS",
    candidateItems,
  };
}

/**
 * Evaluates the complete Profit Opportunity Score with 6 commercial pillars and quality/novelty multipliers.
 */
export function evaluateProfitableContentScore(params: ScoreCalculationParams): ProfitOpportunityScore {
  const searchIntent = evaluateSearchIntent(params.concept, params.ingredients);
  const affiliatePotential = evaluateAffiliatePotential(params.ingredients, params.techniques);
  const socialVisual = evaluateSocialVisualPotential(params.concept, params.craveSignals, params.ingredients);
  const cateringRelevance = evaluateCateringRelevance(params.concept, params.ingredients, params.techniques, params.craveSignals);
  const cookbookRelevance = evaluateCookbookRelevance(params.concept, params.cuisine, params.craveSignals);
  const newsletterPotential = evaluateNewsletterPotential(params.concept, params.craveSignals);

  // 1. Raw Commercial Score (Weighted Average = 100%)
  const rawCommercialScore = Math.round(
    searchIntent * 0.20 +
    affiliatePotential * 0.20 +
    socialVisual * 0.20 +
    cateringRelevance * 0.15 +
    cookbookRelevance * 0.15 +
    newsletterPotential * 0.10
  );

  // 2. Content Quality Multiplier (Crave, CZ availability, seasonality, cuisine diversity)
  let qualityMultiplier = 1.0;
  if (params.craveSignals.length >= 3) qualityMultiplier += 0.03;
  else if (params.craveSignals.length >= 1) qualityMultiplier += 0.01;

  const now = params.date || new Date();
  const seasonalMatch = checkSeasonalMatch(now.getMonth(), params.ingredients, params.concept);
  if (seasonalMatch.matched) qualityMultiplier += 0.02;

  const availability = checkCzechAvailability(params.ingredients);
  if (availability.isReadilyAvailable) qualityMultiplier += 0.01;
  else if (availability.isHardToFind) qualityMultiplier -= 0.05;

  if (!params.isVegetarian) qualityMultiplier -= 0.25;

  qualityMultiplier = Math.max(0.70, Math.min(1.06, Number(qualityMultiplier.toFixed(2))));

  // 3. Novelty Multiplier (Inventory duplication penalty)
  const maxSimilarity = params.existingMatches.reduce(
    (max, m) => Math.max(max, m.similarityScore),
    0
  );
  let noveltyMultiplier = 1.0;
  if (maxSimilarity < 0.25) {
    noveltyMultiplier = 1.00; // Fresh novel concept: neutral multiplier (no artificial inflation)
  } else if (maxSimilarity < 0.40) {
    noveltyMultiplier = 0.95; // Mild thematic overlap
  } else if (maxSimilarity < 0.60) {
    noveltyMultiplier = 0.82; // Noticeable overlap
  } else if (maxSimilarity < 0.75) {
    noveltyMultiplier = 0.65; // High overlap
  } else {
    noveltyMultiplier = 0.35; // Near duplicate
  }
  noveltyMultiplier = Number(noveltyMultiplier.toFixed(2));

  // 4. Final Profit Opportunity Score (0 - 100, anti-saturated)
  // Heuristic scaling: dampened to prevent artificial collapse to 100
  const rawProduct = rawCommercialScore * qualityMultiplier * noveltyMultiplier;
  const finalProfitOpportunityScore = Math.max(
    0,
    Math.min(95, Math.round(rawProduct))
  );

  // 5. Decision Logic (CREATE: 80-100, REVIEW: 60-79, SKIP: 0-59)
  let decision: OpportunityDecision = "SKIP";
  if (maxSimilarity >= 0.75 || !params.isVegetarian) {
    decision = "SKIP";
  } else if (finalProfitOpportunityScore >= 80) {
    decision = maxSimilarity >= 0.50 ? "REVIEW" : "CREATE";
  } else if (finalProfitOpportunityScore >= 60) {
    decision = "REVIEW";
  } else {
    decision = "SKIP";
  }

  // 6. Revenue Routes (pillars >= 70)
  const revenueRoutes: string[] = [];
  if (affiliatePotential >= 70) revenueRoutes.push("Affiliate");
  if (cateringRelevance >= 70) revenueRoutes.push("Catering");
  if (socialVisual >= 70) revenueRoutes.push("Social");
  if (cookbookRelevance >= 70) revenueRoutes.push("Cookbook");
  if (searchIntent >= 70) revenueRoutes.push("SEO");
  if (newsletterPotential >= 70) revenueRoutes.push("Newsletter");

  // 7. Affiliate Reality Gate Detail
  const candidateAffiliateItems: string[] = [];
  const combinedText = `${params.concept} ${params.ingredients.join(" ")} ${params.techniques.join(" ")}`.toLowerCase();
  if (/olivový olej|evoo/i.test(combinedText)) candidateAffiliateItems.push("Prémiový extra panenský olivový olej");
  if (/tahini/i.test(combinedText)) candidateAffiliateItems.push("Sezamová pasta tahini");
  if (/uzená paprika|la chinata/i.test(combinedText)) candidateAffiliateItems.push("Výběrová uzená paprika La Chinata");
  if (/litin|pánev/i.test(combinedText)) candidateAffiliateItems.push("Litinová pánev");
  if (/blender|mixér|mixování/i.test(combinedText)) candidateAffiliateItems.push("Vysokorychlostní stolní mixér");
  if (/zaatar|za'atar/i.test(combinedText)) candidateAffiliateItems.push("Koření za'atar");

  const affiliateVerification = buildAffiliateVerificationDetail(
    affiliatePotential,
    candidateAffiliateItems,
    null,
    false,
    false
  );

  // 8. WHY NOW justification (strictly hypothesis / pilot language for catering)
  const whyNowParts: string[] = [];
  if (params.craveSignals.length > 0) whyNowParts.push(`Crave signály [${params.craveSignals.slice(0, 3).join(", ")}]`);
  if (affiliatePotential >= 75) whyNowParts.push("silný affiliate fit (hypotéza: prémiová dochucovadla/EVOO)");
  if (cateringRelevance >= 75) whyNowParts.push("vysoký predicted catering fit pro rauty a sharing (kandidát na pilot)");
  if (socialVisual >= 75) whyNowParts.push("vysoká video estetika pro Sonya Luna shorts");
  if (maxSimilarity < 0.35) whyNowParts.push(`nízká duplicita v katalogu (${Math.round(maxSimilarity * 100)} %)`);
  else whyNowParts.push(`podobnost s existujícím receptem (${Math.round(maxSimilarity * 100)} %)`);

  const whyNow = whyNowParts.join(" · ");

  return {
    score: finalProfitOpportunityScore,
    rawCommercialScore,
    qualityMultiplier,
    noveltyMultiplier,
    finalProfitOpportunityScore,
    decision,
    whyNow,
    revenueRoutes,
    commercialBreakdown: {
      searchIntent,
      affiliatePotential,
      socialVisual,
      cateringRelevance,
      cookbookRelevance,
      newsletterPotential,
      rawCommercialScore,
    },
    qualityModifiers: {
      contentQualityMultiplier: qualityMultiplier,
      noveltyMultiplier,
      maxCatalogSimilarity: maxSimilarity,
      matchedCatalogSlug: params.existingMatches[0]?.slug,
    },
    affiliateVerification,
    disclaimer: "HEURISTIC — NOT REVENUE FORECAST",
  };
}

/**
 * Calculates Content Gap Score (0 - 100) combining commercial scoring and qualitative reasons.
 */
export function calculateOpportunityScore(params: ScoreCalculationParams): ScoreCalculationResult {
  const profitScore = evaluateProfitableContentScore(params);
  const reasons: string[] = [];

  // Reasons summary
  reasons.push(
    `Obchodní Commercial Score: ${profitScore.commercialBreakdown.rawCommercialScore}/100 (Hledanost: ${profitScore.commercialBreakdown.searchIntent}, Affiliate: ${profitScore.commercialBreakdown.affiliatePotential}, Social: ${profitScore.commercialBreakdown.socialVisual}, Catering: ${profitScore.commercialBreakdown.cateringRelevance})`
  );

  if (params.craveSignals.length > 0) {
    reasons.push(`Silný senzorický Crave potenciál: ${params.craveSignals.join(", ")}`);
  }

  if (params.cuisine) {
    reasons.push(`Pestrost kuchyně: ${params.cuisine}`);
  }

  if (profitScore.qualityModifiers.contentQualityMultiplier > 1.0) {
    reasons.push(
      `Pozitivní multiplikátor kulinářské kvality (${profitScore.qualityModifiers.contentQualityMultiplier}×): Crave signály & dostupnost v ČR`
    );
  }

  if (profitScore.qualityModifiers.maxCatalogSimilarity >= 0.75) {
    const match = params.existingMatches[0];
    reasons.push(
      `Vysoká duplicita vůči existujícímu receptu "${match?.title || 'katalogu'}" (${Math.round(profitScore.qualityModifiers.maxCatalogSimilarity * 100)}%)`
    );
  } else if (profitScore.qualityModifiers.noveltyMultiplier < 0.85) {
    const match = params.existingMatches[0];
    reasons.push(
      `Střední podobnost s existujícím receptem "${match?.title || 'katalogu'}" (${Math.round(profitScore.qualityModifiers.maxCatalogSimilarity * 100)}%)`
    );
  } else {
    reasons.push(`Originální koncept v našem inventáři (nízká duplicita)`);
  }

  return {
    score: profitScore.score,
    reasons,
    profitScore,
    decision: profitScore.decision,
    whyNow: profitScore.whyNow,
    revenueRoutes: profitScore.revenueRoutes,
  };
}

function checkSeasonalMatch(month: number, ingredients: string[], concept: string): { matched: boolean; label: string } {
  const combined = `${ingredients.join(" ")} ${concept}`.toLowerCase();

  // Autumn (Sep, Oct, Nov: months 8, 9, 10)
  if (month >= 8 && month <= 10) {
    if (/dýně|dýňov|houby|žampiony|hřib|švestk|jablk|ořech|řepa|kořenov|pečen/i.test(combined)) {
      return { matched: true, label: "podzimní suroviny: dýně, houby, ořechy, pečení" };
    }
  }
  // Winter (Dec, Jan, Feb: months 11, 0, 1)
  if (month === 11 || month <= 1) {
    if (/čočka|fazole|cizrna|zelí|brambor|zázvor|polévka|guláš|eintopf/i.test(combined)) {
      return { matched: true, label: "zimní hřejivá jídla & luštěniny" };
    }
  }
  // Spring (Mar, Apr, May: months 2, 3, 4)
  if (month >= 2 && month <= 4) {
    if (/chřest|medvědí česnek|hrášek|ředkvič|bylink|kopřiv|špenát/i.test(combined)) {
      return { matched: true, label: "jarní čerstvé suroviny" };
    }
  }
  // Summer (Jun, Jul, Aug: months 5, 6, 7)
  if (month >= 5 && month <= 7) {
    if (/rajčat|cuketa|lilek|paprik|kukuřic|okurk|meloun|gril/i.test(combined)) {
      return { matched: true, label: "letní zelenina a grilování" };
    }
  }

  return { matched: false, label: "" };
}

function checkCzechAvailability(ingredients: string[]): { isReadilyAvailable: boolean; isHardToFind: boolean } {
  const exoticMarkers = ["curry leaves", "epazote", "banana blossom", "galangal fresh", "black lime", "yuzu fresh"];
  const joined = ingredients.join(" ").toLowerCase();

  const isHard = exoticMarkers.some(m => joined.includes(m));
  if (isHard) return { isReadilyAvailable: false, isHardToFind: true };

  // Common staples in CZ retail
  const commonMarkers = ["tofu", "fazole", "čočka", "cizrna", "žampiony", "česnek", "cibule", "rýže", "brambory", "mrkev", "špenát", "těstoviny"];
  const commonCount = commonMarkers.filter(m => joined.includes(m)).length;

  return {
    isReadilyAvailable: commonCount >= 2,
    isHardToFind: false,
  };
}

function checkCommercialRelevance(ingredients: string[], techniques: string[]): boolean {
  const highIntentPantry = [
    "olivový olej",
    "extra panenský",
    "balsamico",
    "tahini",
    "miso",
    "tamari",
    "uzená paprika",
    "lahůdkové droždí",
    "quinoa",
    "kokosové mléko",
  ];
  const combined = ingredients.join(" ").toLowerCase();
  return highIntentPantry.some(item => combined.includes(item));
}
