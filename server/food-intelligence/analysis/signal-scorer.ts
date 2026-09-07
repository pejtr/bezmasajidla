// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Crave Signal Heuristics & Multi-Factor Opportunity Scorer
// ============================================================

import { CraveSignal, CRAVE_SIGNALS, ExistingRecipeMatch } from "../types";

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
export function calculateOpportunityScore(params: ScoreCalculationParams): ScoreCalculationResult {
  let score = 45; // baseline
  const reasons: string[] = [];

  // 1. External signal frequency
  if (params.frequency > 1) {
    const freqBonus = Math.min(params.frequency * 5, 20);
    score += freqBonus;
    reasons.push(`Vysoká frekvence v kulinářských signálech (${params.frequency}×, +${freqBonus})`);
  }

  // 2. Crave potential (visual & sensory DNA)
  if (params.craveSignals.length > 0) {
    const craveBonus = Math.min(params.craveSignals.length * 3, 15);
    score += craveBonus;
    reasons.push(`Silný senzorický Crave potenciál: ${params.craveSignals.join(", ")} (+${craveBonus})`);
  }

  // 3. Cuisine diversity (boosts underrepresented cuisines in our catalog)
  const underrepresentedCuisines = [
    "korejská",
    "vietnamská",
    "levantská",
    "blízkovýchodní",
    "mexická",
    "japonská",
    "gruzínská",
    "thai",
    "korean",
    "middle eastern",
    "mexican",
    "japanese",
  ];
  if (params.cuisine && underrepresentedCuisines.some(c => params.cuisine?.toLowerCase().includes(c))) {
    score += 12;
    reasons.push(`Zvyšuje pestrost katalogu: kuchyně "${params.cuisine}" (+12)`);
  }

  // 4. Seasonal relevance
  const now = params.date || new Date();
  const month = now.getMonth(); // 0 = Jan, 8 = Sep
  const seasonalMatch = checkSeasonalMatch(month, params.ingredients, params.concept);
  if (seasonalMatch.matched) {
    score += 10;
    reasons.push(`Vysoká sezónní relevance (${seasonalMatch.label}, +10)`);
  }

  // 5. Czech supermarket ingredient availability
  const availability = checkCzechAvailability(params.ingredients);
  if (availability.isReadilyAvailable) {
    score += 8;
    reasons.push(`Vysoká dostupnost surovin v ČR (Rohlík/Košík/Billa, +8)`);
  } else if (availability.isHardToFind) {
    score -= 8;
    reasons.push(`Některé suroviny jsou hůře dostupné na běžném českém trhu (-8)`);
  }

  // 6. Affiliate / Commerce relevance
  const hasCommercialRelevance = checkCommercialRelevance(params.ingredients, params.techniques);
  if (hasCommercialRelevance) {
    score += 7;
    reasons.push(`Komerční vazba na prémiové suroviny a e-shopy (+7)`);
  }

  // 7. Duplicate similarity penalty
  const maxSimilarity = params.existingMatches.reduce(
    (max, m) => Math.max(max, m.similarityScore),
    0
  );
  if (maxSimilarity >= 0.8) {
    score -= 35;
    const match = params.existingMatches.find(m => m.similarityScore === maxSimilarity);
    reasons.push(`Vysoká duplicita vůči existujícímu receptu "${match?.title}" (${Math.round(maxSimilarity * 100)}%, -35)`);
  } else if (maxSimilarity >= 0.5) {
    score -= 15;
    const match = params.existingMatches.find(m => m.similarityScore === maxSimilarity);
    reasons.push(`Střední podobnost s existujícím receptem "${match?.title}" (${Math.round(maxSimilarity * 100)}%, -15)`);
  } else {
    score += 10;
    reasons.push(`Originální koncept v našem inventáři (nízká duplicita, +10)`);
  }

  // 8. Plant-forward / Vegetarian check
  if (!params.isVegetarian) {
    score -= 20;
    reasons.push(`Vyžaduje náročnou konverzi na bezmasou verzi (-20)`);
  }

  // Clamp score to 0 - 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: finalScore,
    reasons,
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
