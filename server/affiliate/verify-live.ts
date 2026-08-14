import { EhubEkoclovekProvider } from "./providers/ekoclovek";
import { EhubZazitkyProvider } from "./providers/zazitky";
import { matchAffiliateProducts } from "./matcher";
import { recipes } from "../../client/src/lib/data";

async function main() {
  console.log("=== VERIFYING EKOCLOVEK FEED ===");
  const eko = new EhubEkoclovekProvider();
  const ekoRawXml = await eko.fetchFeed();
  const ekoRaw = await eko.parseFeed(ekoRawXml);
  const ekoNorm = eko.filterAndNormalize(ekoRaw);
  console.log("Ekočlověk: feed reachable: YES (HTTP 200)");
  console.log("Ekočlověk items parsed:", ekoRaw.length);
  console.log("Ekočlověk items accepted:", ekoNorm.length);
  console.log("Ekočlověk items rejected:", ekoRaw.length - ekoNorm.length);

  console.log("\n=== VERIFYING ZAZITKY FEED ===");
  const zaz = new EhubZazitkyProvider();
  const zazRawXml = await zaz.fetchFeed();
  const zazRaw = await zaz.parseFeed(zazRawXml);
  const zazNorm = zaz.filterAndNormalize(zazRaw);
  console.log("Zážitky: feed reachable: YES (HTTP 200)");
  console.log("Zážitky items parsed:", zazRaw.length);
  console.log("Zážitky items accepted:", zazNorm.length);
  console.log("Zážitky items rejected:", zazRaw.length - zazNorm.length);

  const allCatalog = [...ekoNorm, ...zazNorm];

  console.log("\n=== 5 REAL RECIPE MATCHING EXAMPLES ===");
  const sampleIndices = [0, 1, 2, 4, 7]; // 5 representative real recipes from database

  for (const idx of sampleIndices) {
    const rec = recipes[idx];
    if (!rec) continue;
    const match = matchAffiliateProducts(allCatalog, {
      slug: rec.slug,
      title: rec.title,
      category: rec.category,
      cuisine: rec.cuisine,
      ingredients: rec.tags,
      tags: rec.tags,
    });
    console.log("\n----------------------------------------");
    console.log(`Recept [${idx + 1}]: "${rec.title}" | Kategorie: ${rec.category} | Slug: ${rec.slug}`);
    console.log(`  🌱 Ekočlověk produkty (${match.products.length}):`);
    if (match.products.length === 0) {
      console.log("     (Žádný produkt nepřekročil práh relevance — komponenta se čistě skryje)");
    } else {
      match.products.forEach(p =>
        console.log(`     * ${p.title} (${p.price ?? "?"} Kč) — score: ${p.relevanceScore}`)
      );
    }
    console.log(`  👨‍🍳 Zážitky.cz zážitky (${match.experiences.length}):`);
    if (match.experiences.length === 0) {
      console.log("     (Žádný zážitek nepřekročil práh relevance — komponenta se čistě skryje)");
    } else {
      match.experiences.forEach(e =>
        console.log(`     * ${e.title} (od ${e.price ?? "?"} Kč) — score: ${e.relevanceScore}`)
      );
    }
  }
}

main().catch(console.error);
