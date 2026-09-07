// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Types, Provider Contracts & Canonical Research Data Models
// ============================================================

/**
 * 14 Crave Signals aligned with BezmasáJídla Visual & Culinary DNA
 */
export type CraveSignal =
  | "CRISPY"
  | "CREAMY"
  | "ROASTED"
  | "CHARRED"
  | "CHEESY"
  | "UMAMI"
  | "SPICY"
  | "GARLICKY"
  | "FRESH"
  | "HERBY"
  | "MELTY"
  | "GLOSSY"
  | "SHARING"
  | "COMFORT";

export const CRAVE_SIGNALS: readonly CraveSignal[] = [
  "CRISPY",
  "CREAMY",
  "ROASTED",
  "CHARRED",
  "CHEESY",
  "UMAMI",
  "SPICY",
  "GARLICKY",
  "FRESH",
  "HERBY",
  "MELTY",
  "GLOSSY",
  "SHARING",
  "COMFORT",
] as const;

/**
 * Normalized ingredient representation for internal analysis and OMNISHOPPER compatibility.
 */
export interface NormalizedIngredient {
  canonicalId: string;
  canonicalName: string;
  originalName?: string;
  category?: string;
}

/**
 * Multilingual deterministic alias mapping.
 */
export interface IngredientAlias {
  canonicalId: string;
  locale: string;
  alias: string;
  canonicalCzech: string;
  category?: string;
}

/**
 * Canonical Internal External Recipe Signal.
 *
 * CRITICAL PRODUCT LAW:
 * External APIs are RESEARCH / INTELLIGENCE providers.
 * They are NOT content importers.
 *
 * publicationPolicy is strictly "INTERNAL_ONLY".
 */
export interface ExternalRecipeSignal {
  provider: string;
  externalId: string;
  sourceUrl?: string;

  sourceLanguage?: string;

  title?: string; // INTERNAL RESEARCH ONLY

  normalizedIngredients: Array<{
    canonicalName: string;
    originalName?: string;
  }>;

  tags: string[];
  techniques: string[];

  category?: string;
  cuisine?: string;
  vegetarian?: boolean;
  vegan?: boolean;

  prepMinutes?: number;
  cookMinutes?: number;

  fetchedAt: string;

  provenance: {
    provider: string;
    sourceUrl?: string;
  };

  publicationPolicy: "INTERNAL_ONLY";
}

/**
 * Guard that strictly forbids treating an ExternalRecipeSignal as a publishable entity.
 * Any attempt to save or expose an ExternalRecipeSignal to the public catalog throws an error.
 */
export function assertNotPublishable(signal: ExternalRecipeSignal): void {
  if (signal.publicationPolicy === "INTERNAL_ONLY") {
    // Expected behavior: signal is locked to internal research only.
    return;
  }
  throw new Error(
    `[EDITORIAL GATE CRITICAL VIOLATION] Signal from provider '${signal.provider}' has invalid publication policy.`
  );
}

/**
 * Guard that verifies whether an object is an external research signal.
 */
export function isExternalRecipeSignal(value: unknown): value is ExternalRecipeSignal {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return (
    s.publicationPolicy === "INTERNAL_ONLY" &&
    typeof s.provider === "string" &&
    typeof s.externalId === "string"
  );
}

/**
 * Existing recipe match item in gap analysis.
 */
export interface ExistingRecipeMatch {
  slug: string;
  title: string;
  similarityScore: number;
  reason: string;
}

/**
 * Action decision for content production
 * 80-100: CREATE (immediate production)
 * 60-79:  REVIEW (requires distinct authorial twist)
 * 0-59:   SKIP (insufficient leverage or high duplication)
 */
export type OpportunityDecision = "CREATE" | "REVIEW" | "SKIP";

/**
 * 6 Commercial Monetization Pillars (War Mode v0.2)
 * Weights:
 * - Search Intent: 20%
 * - Affiliate Potential: 20%
 * - Social Visual: 20%
 * - Catering Relevance: 15%
 * - Cookbook Relevance: 15%
 * - Newsletter Potential: 10%
 */
export interface CommercialScoreBreakdown {
  searchIntent: number; // 20%
  affiliatePotential: number; // 20%
  socialVisual: number; // 20%
  cateringRelevance: number; // 15%
  cookbookRelevance: number; // 15%
  newsletterPotential: number; // 10%
  rawCommercialScore: number; // Weighted average (0-100)
}

/**
 * Multipliers adjusting commercial score based on culinary execution feasibility and catalogue novelty
 */
export interface QualityModifiers {
  contentQualityMultiplier: number; // Crave signals, CZ availability, seasonality (0.75 - 1.15)
  noveltyMultiplier: number; // Inventory duplication penalty (0.30 - 1.05)
  maxCatalogSimilarity: number;
  matchedCatalogSlug?: string;
}

/**
 * Standardized Profit Opportunity Score (HEURISTIC — NOT REVENUE FORECAST)
 */
export interface ProfitOpportunityScore {
  score: number; // 0 - 100
  decision: OpportunityDecision;
  whyNow?: string; // Required for CREATE
  revenueRoutes: string[]; // e.g. ["Affiliate", "Catering", "Social"]
  commercialBreakdown: CommercialScoreBreakdown;
  qualityModifiers: QualityModifiers;
  disclaimer: "HEURISTIC — NOT REVENUE FORECAST";
}

/**
 * Complete Original Content Brief for CREATE opportunities
 */
export interface OriginalContentBrief {
  workingTitle: string;
  craveSignals: CraveSignal[];
  coreIngredients: string[];
  originalAngle: string;
  differentiationFromCatalog: string;
  affiliateOpportunities: string[];
  cateringUsage: string;
  socialHook: string;
  cookbookChapter: string;
  newsletterHook: string;
  seoIntent: string;
  publicationPolicy: "ORIGINAL_CONTENT_REQUIRED";
}

/**
 * Content Gap & Profit Opportunity Result
 */
export interface ContentOpportunity {
  concept: string;
  score: number; // Main profit opportunity score (0 - 100)
  profitScore?: ProfitOpportunityScore;
  decision?: OpportunityDecision;
  whyNow?: string;
  revenueRoutes?: string[];
  originalContentBrief?: OriginalContentBrief;
  reasons: string[];
  ingredients: string[];
  techniques: string[];
  cuisines: string[];
  craveSignals?: CraveSignal[];
  existingRecipeMatches: ExistingRecipeMatch[];
}

/**
 * Recipe Intelligence Provider Interface
 */
export interface RecipeIntelligenceProvider {
  id: string;

  search(input: {
    query: string;
    limit?: number;
    vegetarianOnly?: boolean;
  }): Promise<ExternalRecipeSignal[]>;

  getById?(externalId: string): Promise<ExternalRecipeSignal | null>;
}

/**
 * Translation Provider Interface
 */
export interface TranslationProvider {
  id: string;

  detectLanguage(text: string): Promise<{
    language: string;
    confidence?: number;
  }>;

  translate(input: {
    text: string;
    sourceLanguage?: string;
    targetLanguage: string;
  }): Promise<{
    translatedText: string;
    sourceLanguage?: string;
  }>;
}

/**
 * Provider status for health monitoring & reporting
 */
export interface ProviderStatus {
  id: string;
  type: "recipe" | "translation";
  enabled: boolean;
  configured: boolean;
  healthy: boolean;
  message?: string;
}
