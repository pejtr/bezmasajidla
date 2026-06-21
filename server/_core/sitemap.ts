import { restaurants, recipes } from "../../client/src/lib/data";
import { getApprovedUserRecipes } from "../db";

const BASE_URL = "https://www.bezmasajidla.cz";

export async function generateSitemap(): Promise<string> {
    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

    const addUrl = (path: string, priority = "0.5", changefreq = "weekly") => {
        urls.push({
            loc: `${BASE_URL}${path}`,
            lastmod: new Date().toISOString(),
            changefreq,
            priority,
        });
    };

    // Static Pages
    addUrl("/", "1.0", "daily");
    addUrl("/recepty", "0.9", "daily");
    addUrl("/mapa", "0.8", "weekly");

    // Core Categories
    const categories = ["Hlavní jídla", "Polévky", "Saláty a misky", "Snídáně", "Dezerty", "Nápoje"];
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

    // DB Approved User / AI Recipes
    try {
        const dbRecipes = await getApprovedUserRecipes();
        for (const recipe of dbRecipes) {
            addUrl(`/recepty/${recipe.slug}`, "0.7", "monthly");
        }
    } catch (err) {
        console.error("[Sitemap] Failed to fetch DB recipes", err);
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
            .map(
                (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
            )
            .join("")}
</urlset>`;

    return sitemapXml;
}
