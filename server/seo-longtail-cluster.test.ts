import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getApprovedUserRecipes: async () => [],
  getUserRecipeBySlug: async () => undefined,
}));

import { blogPosts } from "../client/src/lib/blogData";
import { injectMetaTags } from "./_core/seo";
import { generateSitemap } from "./_core/sitemap";

const slugs = [
  "bezmasa-jidla-na-obed",
  "bezmasa-jidla-pro-deti",
  "bezmasa-jidla-plna-bilkovin",
  "bezmasa-jidla-z-jednoho-hrnce",
  "bezmasa-jidla-z-testovin",
  "bezmasa-jidla-z-brambor",
  "bezmasy-jidelnicek-na-7-dni",
  "bezmasa-jidla-do-skolni-jidelny",
];

describe("bezmasá jídla long-tail SEO cluster", () => {
  it("publishes all eight approved long-tail guides", () => {
    const posts = slugs.map(slug => blogPosts.find(post => post.slug === slug));
    expect(posts.every(Boolean)).toBe(true);
    expect(new Set(posts.map(post => post?.title)).size).toBe(slugs.length);
  });

  it("uses existing local hero images instead of remote placeholders", () => {
    for (const slug of slugs) {
      const post = blogPosts.find(item => item.slug === slug)!;
      expect(post.coverImage.startsWith("/images/recipes/")).toBe(true);
      expect(
        existsSync(
          join(process.cwd(), "client/public", post.coverImage.replace(/^\//, "")),
        ),
      ).toBe(true);
    }
  });

  it("keeps the guides internally connected to recipes or utility pages", () => {
    for (const slug of slugs) {
      const post = blogPosts.find(item => item.slug === slug)!;
      expect(post.content).toMatch(/\]\(\/(recepty|tydenni-planovac-receptu|blog)\//);
    }
  });

  it("adds every guide to the sitemap", async () => {
    const xml = await generateSitemap();
    for (const slug of slugs) {
      expect(xml).toContain(`/blog/${slug}`);
    }
  });

  it("renders article-specific SEO metadata and the editorial author", async () => {
    const html = await injectMetaTags(
      "<html><head><title>old</title></head><body></body></html>",
      "/blog/bezmasa-jidla-na-obed",
    );
    expect(html).toContain("Bezmasá jídla na oběd");
    expect(html).toContain("Sofie — virtuální food & lifestyle redaktorka");
    expect(html).toContain("index, follow");
  });
});
