import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getApprovedUserRecipes: async () => [],
  getUserRecipeBySlug: async () => undefined,
}));

import { generateSitemap } from "./_core/sitemap";
import { getSeoHttpStatus, injectMetaTags } from "./_core/seo";

const SHELL = `<!doctype html><html><head><title>old</title><meta name="robots" content="index, follow"></head><body><div id="root"></div></body></html>`;

describe("SEO indexability gate", () => {
  it("keeps verified recipes in the sitemap and removes placeholder/unverified recipes", async () => {
    const xml = await generateSitemap();
    expect(xml).toContain("/recepty/veganska-michana-vajicka-z-tofu");
    expect(xml).not.toContain("/recepty/svickova-bez-masa");
  });

  it("returns a real 404 SEO status for unknown routes", async () => {
    expect(await getSeoHttpStatus("/this-route-does-not-exist")).toBe(404);
    const html = await injectMetaTags(SHELL, "/this-route-does-not-exist");
    expect(html).toContain('content="noindex, nofollow"');
    expect(html).toContain("Stránka nenalezena");
  });

  it("keeps public static routes indexable", async () => {
    expect(await getSeoHttpStatus("/catering")).toBe(200);
    const html = await injectMetaTags(SHELL, "/catering");
    expect(html).toContain("Vegetariánský catering Praha");
    expect(html).toContain('content="index, follow"');
  });

  it("resolves percent-encoded unicode recipe slugs to the actual recipe metadata", async () => {
    const html = await injectMetaTags(
      SHELL,
      "/recepty/cockov%C3%A1-polevka-uzena-paprika"
    );
    expect(html).toContain("Čočková polévka");
    expect(html).not.toContain("Bezmasá jídla | Veganské a vegetariánské recepty");
  });

  it("marks unverified recipe pages noindex until imagery passes the quality gate", async () => {
    const html = await injectMetaTags(SHELL, "/recepty/svickova-bez-masa");
    expect(html).toContain('content="noindex, nofollow"');
  });

  it("keeps verified recipe pages indexable", async () => {
    const html = await injectMetaTags(
      SHELL,
      "/recepty/veganska-michana-vajicka-z-tofu"
    );
    expect(html).toContain('content="index, follow"');
  });
});
