import { restaurants, recipes } from "../../client/src/lib/data";
import { blogPosts } from "../../client/src/lib/blogData";
import { getApprovedUserRecipes } from "../db";

const BASE_URL = "https://www.bezmasajidla.cz";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedXml: string | null = null;
let lastGeneratedAt = 0;

export async function generateSitemap(): Promise<string> {
  const now = Date.now();
  if (cachedXml && now - lastGeneratedAt < CACHE_TTL_MS) {
    return cachedXml;
  }

  const urls: {
    loc: string;
    lastmod?: string;
    changefreq: string;
    priority: string;
  }[] = [];

  const addUrl = (
    path: string,
    priority = "0.5",
    changefreq = "weekly",
    lastmod?: Date | string
  ) => {
    urls.push({
      loc: `${BASE_URL}${path}`,
      ...(lastmod
        ? { lastmod: lastmod instanceof Date ? lastmod.toISOString() : lastmod }
        : {}),
      changefreq,
      priority,
    });
  };

  // Static Pages
  addUrl("/", "1.0", "daily");
  addUrl("/restaurace", "0.9", "daily");
  addUrl("/recepty", "0.9", "daily");
  addUrl("/tydenni-planovac-receptu", "0.9", "weekly");
  addUrl("/mapa", "0.8", "weekly");
  addUrl("/blog", "0.8", "weekly");

  // Pillar Pages
  addUrl("/restaurace/vegetarianske-restaurace-praha", "0.9", "monthly");
  addUrl("/restaurace/veganske-restaurace-praha", "0.9", "monthly");
  addUrl("/restaurace/vegansky-obed-praha", "0.9", "monthly");
  addUrl("/recepty/ceska-klasika-bez-masa", "0.9", "monthly");
  addUrl("/recepty/rychle-bezmase-vecere", "0.9", "monthly");
  addUrl("/recepty/bezlepkove-recepty", "0.9", "monthly");

  // Core Categories
  const categories = [
    "Hlavní jídla",
    "Polévky",
    "Saláty a misky",
    "Snídáně",
    "Dezerty",
    "Nápoje",
  ];
  for (const cat of categories) {
    addUrl(`/recepty?category=${encodeURIComponent(cat)}`, "0.8", "weekly");
  }

  // Restaurants
  for (const restaurant of restaurants) {
    addUrl(`/restaurace/${restaurant.slug}`, "0.8", "monthly");
  }

  // Default Recipes
  for (const recipe of recipes) {
    addUrl(`/recepty/${recipe.slug}`, "0.7", "monthly");
  }

  // Editorial guides
  for (const post of blogPosts) {
    addUrl(`/blog/${post.slug}`, "0.7", "monthly", post.publishedAt);
  }

  // DB Approved User / AI Recipes
  try {
    const dbRecipes = await getApprovedUserRecipes();
    for (const recipe of dbRecipes) {
      addUrl(
        `/recepty/${recipe.slug}`,
        "0.7",
        "monthly",
        recipe.updatedAt || recipe.createdAt
      );
    }
  } catch (err) {
    console.error("[Sitemap] Failed to fetch DB recipes", err);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        url => `
  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
      )
      .join("")}
</urlset>`;

  cachedXml = sitemapXml;
  lastGeneratedAt = now;
  return sitemapXml;
}
