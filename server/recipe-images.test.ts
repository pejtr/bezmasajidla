import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { recipes } from "../client/src/lib/data";

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
    expect(duplicates(recipes.map(recipe => recipe.image))).toEqual([]);
  });

  it("has a valid image and matching gallery hero for every recipe", () => {
    for (const recipe of recipes) {
      expect(recipe.image, recipe.slug).toBeTruthy();
      if (recipe.images.length > 0) {
        expect(recipe.images[0]?.url, recipe.slug).toBe(recipe.image);
        expect(recipe.images[0]?.alt, recipe.slug).toBeTruthy();
      }
    }
  });

  it("ships every locally referenced recipe image", () => {
    const localImages = recipes
      .map(recipe => recipe.image)
      .filter(image => image.startsWith("/images/recipes/"));

    for (const image of localImages) {
      const filePath = path.join(
        process.cwd(),
        "client",
        "public",
        image.replace(/^\//, ""),
      );
      expect(existsSync(filePath), image).toBe(true);
      expect(statSync(filePath).size, image).toBeGreaterThan(1_000);
    }
  });
});
