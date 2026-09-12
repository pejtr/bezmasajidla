import { describe, expect, it } from "vitest";
import { recipes, Recipe } from "../client/src/lib/data";
import {
  hasVerifiedRecipeImage,
  selectHomepageRecipes,
  RECIPE_PLACEHOLDER_IMAGE,
} from "../client/src/lib/recipeImageOverrides";

describe("Homepage Recipe Image Quality Gate — Comprehensive Closure Suite", () => {
  // Define all 4 semantic candidate filters as used in Home.tsx
  const sectionFilters = {
    latestRecipes: (r: Recipe) => true,
    czechClassics: (r: Recipe) =>
      Boolean(
        r.editorialCollections?.includes("czech-classics") ||
        r.cuisine?.toLowerCase().includes("česká") ||
        r.tags.some(
          (t) =>
            t.toLowerCase() === "česká kuchyně" ||
            t.toLowerCase() === "česká klasika" ||
            t.toLowerCase() === "česká bezmasá jídla"
        )
      ),
    veganRecipes: (r: Recipe) => r.isVegan,
    quickDinners: (r: Recipe) => r.prepTime + r.cookTime <= 30,
  };

  const candidatePools = {
    latestRecipes: recipes.filter(sectionFilters.latestRecipes),
    czechClassics: recipes.filter(sectionFilters.czechClassics),
    veganRecipes: recipes.filter(sectionFilters.veganRecipes),
    quickDinners: recipes.filter(sectionFilters.quickDinners),
  };

  const renderedSections = {
    latestRecipes: selectHomepageRecipes(candidatePools.latestRecipes, 3),
    czechClassics: selectHomepageRecipes(candidatePools.czechClassics, 3),
    veganRecipes: selectHomepageRecipes(candidatePools.veganRecipes, 3),
    quickDinners: selectHomepageRecipes(candidatePools.quickDinners, 3),
  };

  it("1. enumerates all 4 recipe collections rendered on Home.tsx and selects exactly 3 cards each", () => {
    const sectionNames = Object.keys(renderedSections) as (keyof typeof renderedSections)[];
    expect(sectionNames).toEqual([
      "latestRecipes",
      "czechClassics",
      "veganRecipes",
      "quickDinners",
    ]);

    for (const name of sectionNames) {
      expect(renderedSections[name], `Section ${name} must render 3 cards`).toHaveLength(3);
    }
  });

  it("2. zero placeholders appear across all 4 homepage recipe sections", () => {
    for (const [sectionName, cards] of Object.entries(renderedSections)) {
      for (const card of cards) {
        expect(
          hasVerifiedRecipeImage(card),
          `Card ${card.slug} in ${sectionName} must have verified image`
        ).toBe(true);
        expect(
          card.image,
          `Card ${card.slug} in ${sectionName} must not be placeholder`
        ).not.toBe(RECIPE_PLACEHOLDER_IMAGE);
        expect(card.image).toMatch(/^\/images\/recipes\/.+/);
      }
    }
  });

  it("3. semantic filters are preserved 100% across all 4 sections", () => {
    // 3a. Czech classics: every recipe must be authentic Czech
    for (const r of renderedSections.czechClassics) {
      expect(sectionFilters.czechClassics(r), `Recipe ${r.slug} must satisfy czech filter`).toBe(true);
    }
    expect(renderedSections.czechClassics.map((r) => r.slug)).toEqual([
      "prava-krkonosska-kulajda",
      "bramborovy-salat-s-domaci-sojanezou",
      "bramboracka-s-lesnimi-houbami",
    ]);

    // 3b. Vegan recipes: every recipe must be isVegan === true
    for (const r of renderedSections.veganRecipes) {
      expect(r.isVegan, `Recipe ${r.slug} must be vegan`).toBe(true);
    }
    expect(renderedSections.veganRecipes.map((r) => r.slug)).toEqual([
      "veganska-michana-vajicka-z-tofu",
      "kynute-livance-v-americkem-duchu",
      "pres-noc-namocena-chia-ovesna-kase-s-boruvkami",
    ]);

    // 3c. Quick dinners: every recipe must be prepTime + cookTime <= 30
    for (const r of renderedSections.quickDinners) {
      expect(sectionFilters.quickDinners(r), `Recipe ${r.slug} must be <= 30 min`).toBe(true);
      expect(r.prepTime + r.cookTime).toBeLessThanOrEqual(30);
    }
    expect(renderedSections.quickDinners.map((r) => r.slug)).toEqual([
      "prava-krkonosska-kulajda",
      "veganska-michana-vajicka-z-tofu",
      "pres-noc-namocena-chia-ovesna-kase-s-boruvkami",
    ]);

  });

  it("4. latest ordering invariant: newest-first catalog order is strictly preserved", () => {
    // Invariant A: recipes array order is the canonical editorial catalog sequence.
    // selectHomepageRecipes must preserve the monotonic relative index of candidates in `recipes`.
    const latest = renderedSections.latestRecipes;

    const indices = latest.map((selected) =>
      recipes.findIndex((r) => r.slug === selected.slug)
    );

    // Each consecutive selected recipe must appear strictly after the previous in the master catalog
    expect(indices[0]).toBeLessThan(indices[1]);
    expect(indices[1]).toBeLessThan(indices[2]);

    // First card must be the very head of the catalog (Pravá Krkonošská Kulajda)
    expect(indices[0]).toBe(0);
    expect(latest[0].slug).toBe("prava-krkonosska-kulajda");

    // The second and third cards must be the next verified recipes encountered in catalog sequence
    expect(latest[1].slug).toBe("veganska-michana-vajicka-z-tofu");
    expect(latest[2].slug).toBe("kynute-livance-v-americkem-duchu");
  });

  it("5. helper validation: recognizes verified local images, rejects placeholders and untrusted external URLs", () => {
    // Verified local images
    expect(hasVerifiedRecipeImage({ image: "/images/recipes/kulajda.jpg", slug: "custom-kulajda" })).toBe(true);
    expect(hasVerifiedRecipeImage({ image: "/images/recipes/veganska-kachna-se-spenatem-a-knedlikem.webp", slug: "kachna" })).toBe(true);

    // Curated overrides take precedence over untrusted candidate images
    expect(hasVerifiedRecipeImage({ image: "https://untrusted-host.com/photo.jpg", slug: "veganska-michana-vajicka-z-tofu" })).toBe(true);

    // Explicit placeholder
    expect(hasVerifiedRecipeImage({ image: RECIPE_PLACEHOLDER_IMAGE, slug: "svickova-bez-masa" })).toBe(false);

    // Legacy dead CDN
    expect(hasVerifiedRecipeImage({
      image: "https://d2xsxph8kpxj0f.cloudfront.net/veganska-svickova.webp",
      slug: "svickova-bez-masa",
    })).toBe(false);

    // Generic external Unsplash URL without override
    expect(hasVerifiedRecipeImage({
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      slug: "untrusted-slug",
    })).toBe(false);

    // Nullish & empty
    expect(hasVerifiedRecipeImage(null)).toBe(false);
    expect(hasVerifiedRecipeImage(undefined)).toBe(false);
    expect(hasVerifiedRecipeImage({ image: null, slug: "no-image" })).toBe(false);
    expect(hasVerifiedRecipeImage({ image: "", slug: "empty-image" })).toBe(false);
  });

  it("6. broken/untrusted external URLs are never preferred over verified recipes", () => {
    const syntheticCandidates: Recipe[] = [
      {
        id: "mock_1",
        slug: "untrusted-1",
        title: "Untrusted 1",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/broken.webp",
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
      {
        id: "mock_2",
        slug: "untrusted-2",
        title: "Untrusted 2",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: "https://images.unsplash.com/photo-broken",
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
      {
        id: "mock_3",
        slug: "verified-1",
        title: "Verified 1",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: "/images/recipes/bramboracka-s-lesnimi-houbami.webp",
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
      {
        id: "mock_4",
        slug: "verified-2",
        title: "Verified 2",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: "/images/recipes/kulajda.jpg",
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
      {
        id: "mock_5",
        slug: "verified-3",
        title: "Verified 3",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: "/images/recipes/veganska-kachna-se-spenatem-a-knedlikem.webp",
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
    ];

    const selected = selectHomepageRecipes(syntheticCandidates, 3);
    expect(selected.map((r) => r.slug)).toEqual([
      "verified-1",
      "verified-2",
      "verified-3",
    ]);
  });

  it("7. fallback: falls back to placeholders only if fewer than 3 verified candidates exist", () => {
    const syntheticCandidates: Recipe[] = [
      {
        id: "mock_v1",
        slug: "only-verified",
        title: "Only Verified",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: "/images/recipes/kulajda.jpg",
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
      {
        id: "mock_p1",
        slug: "placeholder-1",
        title: "Placeholder 1",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: RECIPE_PLACEHOLDER_IMAGE,
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
      {
        id: "mock_p2",
        slug: "placeholder-2",
        title: "Placeholder 2",
        category: "Hlavní jídla",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "snadný",
        image: RECIPE_PLACEHOLDER_IMAGE,
        images: [],
        description: "",
        tags: [],
        isVegan: true,
      },
    ];

    const selected = selectHomepageRecipes(syntheticCandidates, 3);
    expect(selected).toHaveLength(3);
    expect(selected[0].slug).toBe("only-verified");
    expect(selected[1].slug).toBe("placeholder-1");
    expect(selected[2].slug).toBe("placeholder-2");
  });
});
