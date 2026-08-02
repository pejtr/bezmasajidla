import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { blogPosts } from "../client/src/lib/blogData";

describe("blog content", () => {
  it("uses unique IDs and slugs", () => {
    expect(new Set(blogPosts.map(post => post.id)).size).toBe(blogPosts.length);
    expect(new Set(blogPosts.map(post => post.slug)).size).toBe(
      blogPosts.length
    );
  });

  it("ships local cover images referenced by articles", () => {
    const localImages = blogPosts
      .map(post => post.coverImage)
      .filter(image => image.startsWith("/"));

    for (const image of localImages) {
      const publicPath = path.resolve(
        process.cwd(),
        "client/public",
        image.slice(1)
      );
      expect(fs.existsSync(publicPath), publicPath).toBe(true);
    }
  });

  it("publishes the Budapest guide in the travel category", () => {
    const post = blogPosts.find(
      item => item.slug === "bezmasa-budapest-veganske-restaurace-ceny"
    );

    expect(post?.category).toBe("Cestování");
    expect(post?.tags).toContain("Budapešť");
    expect(post?.content).toContain("Aranybástya");
    expect(post?.content).toContain("Krakov a Varšavu");
  });
});
