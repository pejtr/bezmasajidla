import { recipes } from "../../client/src/lib/data";
import { blogPosts } from "../../client/src/lib/blogData";

const BASE_URL = "https://www.bezmasajidla.cz";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedRssXml: string | null = null;
let lastRssGeneratedAt = 0;

export function generateRssFeed(): string {
  const now = Date.now();
  if (cachedRssXml && now - lastRssGeneratedAt < CACHE_TTL_MS) {
    return cachedRssXml;
  }

  const items: {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    category?: string;
  }[] = [];

  // Add blog posts
  for (const post of blogPosts) {
    items.push({
      title: post.title,
      link: `${BASE_URL}/blog/${post.slug}`,
      description: post.excerpt || post.metaDescription,
      pubDate: new Date(post.publishedAt).toUTCString(),
      category: post.category,
    });
  }

  // Add recipes
  for (const recipe of recipes) {
    items.push({
      title: `${recipe.title} (${recipe.category})`,
      link: `${BASE_URL}/recepty/${recipe.slug}`,
      description: recipe.description,
      pubDate: new Date("2026-07-01").toUTCString(), // fallback structured date
      category: recipe.category,
    });
  }

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Bezmasá Jídla — Recepty a Restaurace</title>
    <link>${BASE_URL}</link>
    <description>Průvodce bezmasým jídlem: ověřené veganské a vegetariánské recepty, restaurace a návody.</description>
    <language>cs-cz</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items
      .map(
        item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      ${item.category ? `<category><![CDATA[${item.category}]]></category>` : ""}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  cachedRssXml = rssXml;
  lastRssGeneratedAt = now;
  return rssXml;
}
