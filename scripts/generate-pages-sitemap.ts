import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { restaurants, recipes, hasVerifiedRecipeImage } from "../client/src/lib/data";
import { blogPosts } from "../client/src/lib/blogData";

const BASE_URL = "https://www.bezmasajidla.cz";
const OUT_FILE = path.resolve("dist/public/sitemap.xml");

type Entry = {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
};

const entries: Entry[] = [];
const seen = new Set<string>();

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function addUrl(
  pathname: string,
  priority = "0.5",
  changefreq = "weekly",
  lastmod?: string,
) {
  const loc = new URL(pathname, BASE_URL).toString();
  if (seen.has(loc)) return;
  seen.add(loc);
  entries.push({ loc, priority, changefreq, ...(lastmod ? { lastmod } : {}) });
}

[
  ["/", "1.0", "daily"],
  ["/restaurace", "0.9", "daily"],
  ["/recepty", "0.9", "daily"],
  ["/tydenni-planovac-receptu", "0.9", "weekly"],
  ["/bezmasy-warrior-vyzva", "0.9", "weekly"],
  ["/mapa", "0.8", "weekly"],
  ["/blog", "0.8", "weekly"],
  ["/catering", "0.9", "weekly"],
  ["/inzerce/pridat-podnik", "0.8", "monthly"],
  ["/restaurace/vegetarianske-restaurace-praha", "0.9", "monthly"],
  ["/restaurace/veganske-restaurace-praha", "0.9", "monthly"],
  ["/restaurace/vegansky-obed-praha", "0.9", "monthly"],
  ["/restaurace/praha/vinohrady", "0.9", "monthly"],
  ["/restaurace/praha/karlin", "0.9", "monthly"],
  ["/restaurace/praha/smichov", "0.9", "monthly"],
  ["/restaurace/praha/stare-mesto", "0.9", "monthly"],
  ["/restaurace/vegetarianske-restaurace-brno", "0.9", "monthly"],
  ["/restaurace/veganske-restaurace-ostrava", "0.9", "monthly"],
  ["/restaurace/bezmase-restaurace-plzen", "0.9", "monthly"],
  ["/recepty/tofu", "0.9", "monthly"],
  ["/recepty/cizrna", "0.9", "monthly"],
  ["/recepty/cocka", "0.9", "monthly"],
  ["/recepty/kvetak", "0.9", "monthly"],
  ["/recepty/tempeh", "0.9", "monthly"],
  ["/recepty/ceska-klasika-bez-masa", "0.9", "monthly"],
  ["/recepty/rychle-bezmase-vecere", "0.9", "monthly"],
  ["/recepty/bezlepkove-recepty", "0.9", "monthly"],
  ["/varianty-nakladaneho-hermelinu", "0.9", "monthly"],
].forEach(([url, priority, changefreq]) => addUrl(url, priority, changefreq));

[
  "Hlavní jídla",
  "Polévky",
  "Saláty a misky",
  "Snídáně",
  "Dezerty",
  "Nápoje",
].forEach((category) =>
  addUrl(`/recepty?category=${encodeURIComponent(category)}`, "0.8", "weekly"),
);

for (const restaurant of restaurants) {
  addUrl(`/restaurace/${restaurant.slug}`, "0.8", "monthly");
}

for (const recipe of recipes) {
  if (!hasVerifiedRecipeImage(recipe)) continue;
  addUrl(`/recepty/${recipe.slug}`, "0.7", "monthly");
}

for (const post of blogPosts) {
  addUrl(`/blog/${post.slug}`, "0.7", "monthly", post.publishedAt);
}

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

await mkdir(path.dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, body, "utf8");
console.log(`[pages-sitemap] wrote ${entries.length} URLs to ${OUT_FILE}`);
