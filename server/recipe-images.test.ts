import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { recipes, restaurants } from "../client/src/lib/data";
import { blogPosts } from "../client/src/lib/blogData";
import { isUnavailableLegacyImage } from "../client/src/lib/imageFallbacks";
import {
  isTrustedRecipeImage,
  RECIPE_PLACEHOLDER_IMAGE,
} from "../client/src/lib/recipeImageOverrides";

function duplicates(values: string[]) {
  const seen = new Set<string>();
  const repeated = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }

  return [...repeated];
}

describe("recipe image catalog", () => {
  it("contains no duplicate recipe ids, slugs or thumbnail images", () => {
    expect(duplicates(recipes.map(recipe => recipe.id))).toEqual([]);
    expect(duplicates(recipes.map(recipe => recipe.slug))).toEqual([]);
    expect(
      duplicates(
        recipes
          .map(recipe => recipe.image)
          .filter(image => image !== RECIPE_PLACEHOLDER_IMAGE)
      )
    ).toEqual([]);
  });

  it("does not expose unavailable legacy CDN images anywhere in the catalog", () => {
    const catalogImages = [
      ...recipes.flatMap(recipe => recipe.images.map(image => image.url)),
      ...restaurants.flatMap(restaurant => [
        restaurant.image,
        ...(restaurant.gallery || []),
        ...(restaurant.fastFoodItems || [])
          .map(item => item.image)
          .filter((image): image is string => Boolean(image)),
      ]),
      ...blogPosts.map(post => post.coverImage),
    ];

    expect(
      catalogImages.filter(image => isUnavailableLegacyImage(image))
    ).toEqual([]);
    expect(
      duplicates(
        catalogImages.filter(image => !image.includes("/images/placeholders/"))
      )
    ).toEqual([]);
  });

  it("has a valid image and matching gallery hero for every recipe", () => {
    for (const recipe of recipes) {
      expect(recipe.image, recipe.slug).toBeTruthy();
      expect(isTrustedRecipeImage(recipe.image), recipe.slug).toBe(true);
      if (recipe.images.length > 0) {
        expect(recipe.images[0]?.url, recipe.slug).toBe(recipe.image);
        expect(recipe.images[0]?.alt, recipe.slug).toBeTruthy();
      }
    }
  });

  it("ships every locally referenced recipe image", () => {
    const localImages = recipes
      .map(recipe => recipe.image)
      .filter(image => image.startsWith("/images/"));

    for (const image of localImages) {
      const filePath = path.join(
        process.cwd(),
        "client",
        "public",
        image.replace(/^\//, "")
      );
      expect(existsSync(filePath), image).toBe(true);
      expect(statSync(filePath).size, image).toBeGreaterThan(1_000);
    }
  });
});
