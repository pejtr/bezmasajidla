// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Unit Tests: Models, Normalizers, Crave Signals, Gap Engine & Cache
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  assertNotPublishable,
  isExternalRecipeSignal,
  CRAVE_SIGNALS,
  ExternalRecipeSignal,
} from "./types";
import { normalizeIngredient } from "./normalization/ingredient-normalizer";
import { normalizeTechniques } from "./normalization/technique-normalizer";
import { normalizeTags } from "./normalization/tag-normalizer";
import { detectCraveSignals, calculateOpportunityScore } from "./analysis/signal-scorer";
import { ContentGapEngine } from "./analysis/content-gap-engine";
import {
  generateTranslationCacheKey,
  ProviderCache,
} from "./cache/provider-cache";
import { TastyProvider } from "./providers/recipe/tasty-provider";
import { RapidTranslatorProvider } from "./providers/translation/rapid-translator-provider";
import { FoodIntelligenceService } from "./food-intelligence-service";

describe("Omni Food Intelligence v0.1", () => {
  // ── 1. Critical Product Law & Publication Guard ───────────────
  describe("Editorial Gate & Publication Guard", () => {
    it("accepts valid research signals locked to INTERNAL_ONLY", () => {
      const validSignal: ExternalRecipeSignal = {
        provider: "tasty",
        externalId: "ext-101",
        title: "Creamy Garlic Pasta",
        normalizedIngredients: [{ canonicalName: "česnek" }],
        tags: ["večeře"],
        techniques: ["dušení"],
        fetchedAt: new Date().toISOString(),
        provenance: { provider: "tasty" },
        publicationPolicy: "INTERNAL_ONLY",
      };

      expect(() => assertNotPublishable(validSignal)).not.toThrow();
      expect(isExternalRecipeSignal(validSignal)).toBe(true);
    });

    it("throws critical error if signal attempts invalid publication policy", () => {
      const illegalSignal: any = {
        provider: "tasty",
        externalId: "ext-102",
        title: "Stolen Recipe",
        publicationPolicy: "PUBLIC_RECIPE",
      };

      expect(() => assertNotPublishable(illegalSignal)).toThrow(
        /EDITORIAL GATE CRITICAL VIOLATION/
      );
      expect(isExternalRecipeSignal(illegalSignal)).toBe(false);
    });

    it("creates editorial concept draft requiring original content creation", () => {
      const service = new FoodIntelligenceService();
      const draft = service.createEditorialConceptDraft({
        concept: "Křupavý pečený tempeh s miso glazurou",
        score: 88,
        reasons: ["Silný crave potenciál"],
        ingredients: ["tempeh", "miso pasta"],
        techniques: ["pečení", "glazování"],
        cuisines: ["japonská"],
        existingRecipeMatches: [],
      });

      expect(draft.publicationPolicy).toBe("ORIGINAL_CONTENT_REQUIRED");
      expect(draft.conceptTitle).toBe("Křupavý pečený tempeh s miso glazurou");
      expect(draft.editorialNotes).toContain("originální recept podle standardů BezmasáJídla");
    });
  });

  // ── 2. Multilingual Ingredient Normalizer ─────────────────────
  describe("Deterministic Multilingual Ingredient Normalization", () => {
    it("normalizes canonical mushroom examples across 4 languages into canonicalId 'mushroom'", () => {
      // 1. Czech: "žampiony"
      const cs = normalizeIngredient("žampiony", "cs");
      expect(cs.canonicalId).toBe("mushroom");
      expect(cs.canonicalName).toBe("žampiony");

      // 2. French: "champignons"
      const fr = normalizeIngredient("champignons", "fr");
      expect(fr.canonicalId).toBe("mushroom");

      // 3. English: "button mushrooms"
      const en = normalizeIngredient("200g sliced button mushrooms", "en");
      expect(en.canonicalId).toBe("mushroom");

      // 4. Ukrainian: "печериці"
      const uk = normalizeIngredient("печериці", "uk");
      expect(uk.canonicalId).toBe("mushroom");
      expect(uk.canonicalName).toBe("žampiony");
    });

    it("normalizes common plant proteins and staples with OMNISHOPPER IDs", () => {
      expect(normalizeIngredient("uzené tofu").canonicalId).toBe("tofu");
      expect(normalizeIngredient("chickpeas").canonicalId).toBe("chickpea");
      expect(normalizeIngredient("červená čočka").canonicalId).toBe("red_lentil");
      expect(normalizeIngredient("garlic cloves").canonicalId).toBe("garlic");
      expect(normalizeIngredient("tahini").canonicalId).toBe("tahini");
      expect(normalizeIngredient("nutritional yeast").canonicalId).toBe("nutritional_yeast");
    });

    it("integrates with Czech morphological parsing for inflected forms", () => {
      const parsed = normalizeIngredient("3 stroužky česneku");
      expect(parsed.canonicalName).toBe("česnek");
    });
  });

  // ── 3. Culinary Technique & Tag Normalizers ───────────────────
  describe("Technique & Tag Normalizers", () => {
    it("extracts cooking techniques from text", () => {
      const techniques = normalizeTechniques(
        "Sheet Pan Roasted Cauliflower with Crispy Garlic",
        "Bake in the oven until charred and golden brown."
      );
      expect(techniques).toContain("pečení");
      expect(techniques).toContain("grilování");
    });

    it("normalizes raw provider tags to BezmasáJídla taxonomy", () => {
      const tags = normalizeTags([
        "dinner",
        "under_30_minutes",
        "gluten_free",
        "comfort_food",
      ]);
      expect(tags).toContain("večeře");
      expect(tags).toContain("do 30 minut");
      expect(tags).toContain("bezlepkové");
      expect(tags).toContain("comfort food");
    });
  });

  // ── 4. 14 Crave Signals Detection ─────────────────────────────
  describe("14 Crave Signals (Visual & Culinary DNA)", () => {
    it("has exact 14 defined crave signals", () => {
      expect(CRAVE_SIGNALS).toHaveLength(14);
      expect(CRAVE_SIGNALS).toEqual([
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
      ]);
    });

    it("detects combinations of crave signals in culinary titles and tags", () => {
      const title = "Křupavý pečený květák s krémovou omáčkou a česnekem";
      const detected = detectCraveSignals(title, ["spicy"]);

      expect(detected).toContain("CRISPY");
      expect(detected).toContain("ROASTED");
      expect(detected).toContain("CREAMY");
      expect(detected).toContain("GARLICKY");
      expect(detected).toContain("SPICY");
    });
  });

  // ── 5. Opportunity Scorer & Content Gap Engine ─────────────────
  describe("Content Gap Engine & Opportunity Scorer", () => {
    const mockInventory = [
      {
        slug: "svickova-bez-masa",
        title: "Svíčková na smetaně s domácím seitanem",
        category: "Hlavní jídla",
        cuisine: "Česká bezmasá",
        tags: ["česká kuchyně", "seitan", "omáčky"],
      },
      {
        slug: "cockova-polevka-uzena-paprika",
        title: "Hustá čočková polévka s uzenou paprikou",
        category: "Polévky",
        cuisine: "Česká bezmasá",
        tags: ["polévka", "čočka", "zimní"],
      },
    ];

    it("penalizes duplicate recipe concepts that already exist in our inventory", () => {
      const engine = new ContentGapEngine(mockInventory);

      const duplicateSignal: ExternalRecipeSignal = {
        provider: "tasty",
        externalId: "dup-1",
        title: "Tradiční svíčková na smetaně se seitanem",
        normalizedIngredients: [{ canonicalName: "seitan" }, { canonicalName: "kořenová zelenina" }],
        tags: ["česká kuchyně"],
        techniques: ["dušení"],
        fetchedAt: new Date().toISOString(),
        provenance: { provider: "tasty" },
        publicationPolicy: "INTERNAL_ONLY",
        vegetarian: true,
      };

      const scoreResult = calculateOpportunityScore({
        concept: duplicateSignal.title!,
        frequency: 1,
        craveSignals: ["CREAMY", "COMFORT"],
        cuisine: "Česká bezmasá",
        ingredients: ["seitan", "kořenová zelenina"],
        techniques: ["dušení"],
        existingMatches: [
          {
            slug: "svickova-bez-masa",
            title: "Svíčková na smetaně s domácím seitanem",
            similarityScore: 0.85,
            reason: "Vysoká obsahová a názvová shoda",
          },
        ],
        isVegetarian: true,
      });

      // Score should be reduced due to high duplication
      expect(scoreResult.reasons.some(r => r.includes("Vysoká duplicita"))).toBe(true);
      expect(scoreResult.score).toBeLessThan(50);
    });

    it("awards high score to novel vegetarian concepts with strong crave potential", () => {
      const scoreResult = calculateOpportunityScore({
        concept: "Křupavé korejské květákové nugety s gochujang polevou",
        frequency: 3,
        craveSignals: ["CRISPY", "SPICY", "GLOSSY", "UMAMI"],
        cuisine: "korejská",
        ingredients: ["květák", "gochujang", "sezam", "česnek"],
        techniques: ["pečení", "glazování"],
        existingMatches: [],
        isVegetarian: true,
        date: new Date("2026-09-01"), // Autumn: pečení
      });

      expect(scoreResult.score).toBeGreaterThanOrEqual(75);
      expect(scoreResult.reasons.some(r => r.includes("Crave potenciál"))).toBe(true);
      expect(scoreResult.reasons.some(r => r.includes("korejská"))).toBe(true);
      expect(scoreResult.reasons.some(r => r.includes("nízká duplicita"))).toBe(true);
    });
  });

  // ── 6. SHA-256 Translation Caching ────────────────────────────
  describe("Translation Cache & SHA-256 Keying", () => {
    it("generates deterministic SHA-256 cache key", () => {
      const key1 = generateTranslationCacheKey({
        provider: "rapid",
        sourceLanguage: "en",
        targetLanguage: "cs",
        text: "Roasted mushrooms with garlic",
      });

      const key2 = generateTranslationCacheKey({
        provider: "rapid",
        sourceLanguage: "en",
        targetLanguage: "cs",
        text: "  ROASTED  mushrooms with garlic  ", // whitespace & case invariant
      });

      expect(key1).toHaveLength(64);
      expect(key1).toBe(key2);
    });

    it("stores and retrieves translations with in-memory TTL fallback", async () => {
      const cache = new ProviderCache(30);
      const params = {
        provider: "rapid-test",
        sourceLanguage: "en",
        targetLanguage: "cs",
        text: "Button mushrooms",
      };

      // Initially null
      const before = await cache.getTranslation(params);
      expect(before).toBeNull();

      // Store
      await cache.setTranslation(params, "Žampiony dvouvýtrusné", "en");

      // Retrieve
      const after = await cache.getTranslation(params);
      expect(after).not.toBeNull();
      expect(after?.translatedText).toBe("Žampiony dvouvýtrusné");
      expect(after?.sourceLanguage).toBe("en");
    });
  });

  // ── 7. Providers & Resilience ─────────────────────────────────
  describe("Provider Adapters & Safe Defaults", () => {
    it("TastyProvider is disabled by default without credentials", async () => {
      const tasty = new TastyProvider({ enabled: false, apiKey: "" });
      expect(tasty.isEnabled()).toBe(false);

      const results = await tasty.search({ query: "tofu" });
      expect(results).toEqual([]);
    });

    it("RapidTranslatorProvider fails gracefully and returns original text when disabled", async () => {
      const translator = new RapidTranslatorProvider({ enabled: false, apiKey: "" });
      expect(translator.isEnabled()).toBe(false);

      const detection = await translator.detectLanguage("Česneková polévka");
      expect(detection.language).toBe("cs");

      const translation = await translator.translate({
        text: "Tofu stir-fry",
        targetLanguage: "cs",
      });
      expect(translation.translatedText).toBe("Tofu stir-fry");
    });

    it("FoodIntelligenceService reports correct provider status", () => {
      const service = new FoodIntelligenceService();
      const status = service.getProvidersStatus();

      expect(status.length).toBeGreaterThanOrEqual(2);
      const tastyStatus = status.find(s => s.id === "tasty");
      const rapidStatus = status.find(s => s.id === "rapid");

      expect(tastyStatus).toBeDefined();
      expect(rapidStatus).toBeDefined();
    });
  });
});
