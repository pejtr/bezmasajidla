// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Central Orchestration Service & Editorial Gate Façade
// ============================================================

import type {
  ExternalRecipeSignal,
  ContentOpportunity,
  RecipeIntelligenceProvider,
  TranslationProvider,
  ProviderStatus,
} from "./types";
import { assertNotPublishable } from "./types";
import { TastyProvider } from "./providers/recipe/tasty-provider";
import { RapidTranslatorProvider } from "./providers/translation/rapid-translator-provider";
import { defaultContentGapEngine, ContentGapEngine } from "./analysis/content-gap-engine";

export interface EditorialBriefDraft {
  conceptTitle: string;
  targetCategory: string;
  suggestedCzechIngredients: string[];
  suggestedTechniques: string[];
  craveSignals: string[];
  gapScore: number;
  editorialNotes: string;
  publicationPolicy: "ORIGINAL_CONTENT_REQUIRED";
}

export class FoodIntelligenceService {
  private recipeProviders: Map<string, RecipeIntelligenceProvider> = new Map();
  private translationProviders: Map<string, TranslationProvider> = new Map();
  private contentGapEngine: ContentGapEngine;

  constructor(options?: {
    recipeProviders?: RecipeIntelligenceProvider[];
    translationProviders?: TranslationProvider[];
    contentGapEngine?: ContentGapEngine;
  }) {
    // Register default providers
    const defaultTasty = new TastyProvider();
    this.registerRecipeProvider(defaultTasty);

    const defaultTranslator = new RapidTranslatorProvider();
    this.registerTranslationProvider(defaultTranslator);

    if (options?.recipeProviders) {
      options.recipeProviders.forEach(p => this.registerRecipeProvider(p));
    }
    if (options?.translationProviders) {
      options.translationProviders.forEach(p => this.registerTranslationProvider(p));
    }

    this.contentGapEngine = options?.contentGapEngine || defaultContentGapEngine;
  }

  public registerRecipeProvider(provider: RecipeIntelligenceProvider): void {
    this.recipeProviders.set(provider.id, provider);
  }

  public registerTranslationProvider(provider: TranslationProvider): void {
    this.translationProviders.set(provider.id, provider);
  }

  /**
   * Search external recipe signals across enabled providers for internal research
   */
  async searchExternalSignals(input: {
    query: string;
    limit?: number;
    vegetarianOnly?: boolean;
    providerId?: string;
  }): Promise<ExternalRecipeSignal[]> {
    const provider = input.providerId
      ? this.recipeProviders.get(input.providerId)
      : this.recipeProviders.get("tasty");

    if (!provider) {
      return [];
    }

    const signals = await provider.search({
      query: input.query,
      limit: input.limit || 15,
      vegetarianOnly: input.vegetarianOnly !== false,
    });

    // Enforce publication policy guard on all retrieved signals
    signals.forEach(s => assertNotPublishable(s));

    return signals;
  }

  /**
   * Detect language of text for research
   */
  async detectLanguage(
    text: string,
    providerId = "rapid"
  ): Promise<{ language: string; confidence?: number }> {
    const provider = this.translationProviders.get(providerId);
    if (!provider) {
      return { language: "und", confidence: 0 };
    }
    return provider.detectLanguage(text);
  }

  /**
   * Translates text for internal editorial research using cached translation provider
   */
  async translateForResearch(input: {
    text: string;
    sourceLanguage?: string;
    targetLanguage?: string;
    providerId?: string;
  }): Promise<{ translatedText: string; sourceLanguage?: string }> {
    const provider = input.providerId
      ? this.translationProviders.get(input.providerId)
      : this.translationProviders.get("rapid");

    if (!provider) {
      return { translatedText: input.text, sourceLanguage: input.sourceLanguage };
    }

    return provider.translate({
      text: input.text,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage || "cs",
    });
  }

  /**
   * Run Content Gap Engine against a list of external signals
   */
  async analyzeContentGaps(signals: ExternalRecipeSignal[]): Promise<ContentOpportunity[]> {
    return this.contentGapEngine.analyzeGaps(signals);
  }

  /**
   * Complete end-to-end research flow:
   * Query external signals -> Normalize & cluster -> Run gap engine vs our catalog
   */
  async discoverOpportunities(
    query: string,
    limit = 15
  ): Promise<ContentOpportunity[]> {
    const signals = await this.searchExternalSignals({ query, limit, vegetarianOnly: true });
    if (signals.length === 0) {
      return [];
    }
    return this.contentGapEngine.analyzeGaps(signals);
  }

  /**
   * Editorial Gate Helper:
   * Transforms an identified ContentOpportunity into an internal editorial draft outline.
   *
   * CRITICAL PRODUCT LAW:
   * Does NOT copy external text, instructions, or images.
   * Mandates original content creation by the BezmasáJídla editorial team / chef.
   */
  createEditorialConceptDraft(opportunity: ContentOpportunity): EditorialBriefDraft {
    return {
      conceptTitle: opportunity.concept,
      targetCategory: opportunity.cuisines[0] || "Hlavní jídla",
      suggestedCzechIngredients: opportunity.ingredients,
      suggestedTechniques: opportunity.techniques,
      craveSignals: opportunity.craveSignals || [],
      gapScore: opportunity.score,
      editorialNotes:
        "Tento koncept vychází z analýzy tržních a kulinářských mezer. Vytvořte originální recept podle standardů BezmasáJídla s vlastní fotodokumentací a autorským postupem.",
      publicationPolicy: "ORIGINAL_CONTENT_REQUIRED",
    };
  }

  /**
   * Returns health and configuration status of all registered providers
   */
  getProvidersStatus(): ProviderStatus[] {
    const statuses: ProviderStatus[] = [];

    // Tasty
    const tasty = this.recipeProviders.get("tasty") as TastyProvider | undefined;
    const tastyEnabled = tasty ? tasty.isEnabled() : false;
    statuses.push({
      id: "tasty",
      type: "recipe",
      enabled: process.env.TASTY_PROVIDER_ENABLED === "true",
      configured: Boolean(process.env.RAPIDAPI_KEY),
      healthy: tastyEnabled,
      message: tastyEnabled
        ? "Tasty RapidAPI provider active and configured"
        : "Disabled or RAPIDAPI_KEY missing (safe fallback active)",
    });

    // Rapid Translator
    const rapid = this.translationProviders.get("rapid") as RapidTranslatorProvider | undefined;
    const rapidEnabled = rapid ? rapid.isEnabled() : false;
    statuses.push({
      id: "rapid",
      type: "translation",
      enabled: process.env.RAPID_TRANSLATOR_ENABLED === "true",
      configured: Boolean(process.env.RAPIDAPI_KEY),
      healthy: rapidEnabled,
      message: rapidEnabled
        ? "Rapid Translator active with persistent caching"
        : "Disabled or RAPIDAPI_KEY missing (heuristic fallback active)",
    });

    return statuses;
  }
}

export const foodIntelligenceService = new FoodIntelligenceService();
