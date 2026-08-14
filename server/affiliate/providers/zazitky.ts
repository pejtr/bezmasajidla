// ============================================================
// BEZMASAJIDLA.CZ — Zážitky.cz Affiliate Provider (eHUB)
// ============================================================

import { AFFILIATE_CONFIG } from "../config";
import { BaseAffiliateProvider, normalizeText } from "./base";
import { extractXmlBlocks, getTagContent, getAllTagContents, stripHtml, parsePrice } from "../xml-parser";
import type { RawAffiliateProduct, NormalizedAffiliateProduct } from "../types";

// Positive culinary & gastronomy themes
const POSITIVE_KEYWORDS = [
  "kurz var",
  "skola var",
  "vareni",
  "gastronom",
  "degustac",
  "ochutnavk",
  "pecen",
  "chleb",
  "kvask",
  "cukrar",
  "makronk",
  "cokolad",
  "pralink",
  "kav",
  "barist",
  "caj",
  "italsk",
  "indick",
  "thajsk",
  "asijsk",
  "vietnamsk",
  "japonsk",
  "sushi",
  "ramen",
  "mexick",
  "francouzsk",
  "stredomorsk",
  "vegetariansk",
  "vegansk",
  "bezmas",
  "rostlinn",
  "vecer",
  "obed",
  "gurmansk",
  "vino",
  "vinic",
  "sommelier",
  "pivo",
  "pivovar",
  "pivovarn",
  "rum",
  "whisky",
  "gin",
  "koktejl",
  "barmansk",
];

// Negative non-culinary keywords to drop (skydiving, racing, guns, etc.)
const NEGATIVE_KEYWORDS = [
  "tandem",
  "padak",
  "seskok",
  "bungee",
  "ferrari",
  "lamborghini",
  "porsche",
  "jizda",
  "simulator",
  "letadlo",
  "vrtulnik",
  "let balloonem",
  "strelnice",
  "zbran",
  "masaz",
  "wellness pobyt",
  "hotelovy pobyt",
  "unikova hra",
  "laser game",
  "paintball",
  "adrenalin",
  "potapeni",
  "plachteni",
];

const CUISINE_LOOKUP: Record<string, string[]> = {
  indicka: ["indick", "curry", "kari", "indie"],
  italska: ["italsk", "pasta", "pizza", "rizoto", "italie"],
  thajska: ["thajsk", "pad thai", "thajsko"],
  asijska: ["asijsk", "asie", "wok", "dim sum", "vietnamsk", "japonsk", "sushi", "ramen"],
  mexicka: ["mexick", "tacos", "burrito", "mexiko"],
  francouzska: ["francouzsk", "makronk", "croissant", "francie"],
  ceska: ["cesk", "pivovar", "pivo", "moravsk", "knedlik", "tradicni cesk"],
  stredomorska: ["stredomorsk", "tapas", "spanelsk", "recka"],
  vegetarianska: ["vegetariansk", "vegansk", "bezmas", "rostlinn"],
  dezerty: ["cokolad", "pralink", "makronk", "pecen", "cukrar", "dort"],
  napoje: ["kav", "barist", "caj", "vino", "rum", "whisky", "gin", "koktejl", "degustace piva"],
};

export class EhubZazitkyProvider extends BaseAffiliateProvider {
  merchant = "zazitky" as const;
  feedUrl = AFFILIATE_CONFIG.feeds.zazitky;

  buildAffiliateUrl(sourceUrl?: string): string {
    const dest = sourceUrl || "https://www.zazitky.cz/gurmanske-zazitky";
    const aid = AFFILIATE_CONFIG.ehub.aid;
    const bid = AFFILIATE_CONFIG.ehub.zazitkyBid;
    return `${AFFILIATE_CONFIG.ehub.clickScriptUrl}?a_aid=${aid}&a_bid=${bid}&desturl=${encodeURIComponent(dest)}`;
  }

  async parseFeed(xmlContent: string): Promise<RawAffiliateProduct[]> {
    const shopItems = extractXmlBlocks(xmlContent, "SHOPITEM");
    const rawProducts: RawAffiliateProduct[] = [];

    for (const item of shopItems) {
      try {
        const id = getTagContent(item, "ID");
        const title = getTagContent(item, "PRODUCT") || getTagContent(item, "PRODUCTNAME");
        const descRaw = getTagContent(item, "DESCRIPTION") || "";
        const url = getTagContent(item, "URL");
        const imgUrl = getTagContent(item, "IMGURL") || getTagContent(item, "IMAGE");
        const categories = getAllTagContents(item, "CATEGORYTEXT");
        
        // Extract price from variant if available, otherwise direct price
        const variantBlock = getTagContent(item, "VARIANT");
        const priceVatRaw = variantBlock
          ? getTagContent(variantBlock, "PRICE_VAT") || getTagContent(variantBlock, "PRICE")
          : getTagContent(item, "PRICE_VAT") || getTagContent(item, "PRICE");
        
        const location = variantBlock ? getTagContent(variantBlock, "LOCATION") : undefined;

        if (!id || !title) continue;

        const { price, currency } = parsePrice(priceVatRaw);

        rawProducts.push({
          externalId: id,
          merchant: this.merchant,
          title,
          description: stripHtml(descRaw),
          sourceUrl: url,
          imageUrl: imgUrl,
          price,
          currency,
          category: categories.join(" | "),
          rawCategories: categories,
          rawAttributes: location ? { location } : undefined,
          inStock: true,
        });
      } catch (err) {
        continue;
      }
    }

    return rawProducts;
  }

  filterAndNormalize(rawProducts: RawAffiliateProduct[]): NormalizedAffiliateProduct[] {
    const normalizedList: NormalizedAffiliateProduct[] = [];

    for (const raw of rawProducts) {
      const normalizedTitle = normalizeText(raw.title);
      const normalizedDesc = normalizeText(raw.description || "");
      const normalizedCat = normalizeText(raw.category || "");
      const fullText = `${normalizedTitle} ${normalizedCat} ${normalizedDesc}`;

      // Must belong to Gurmánské zážitky or cooking category
      const isCulinaryCategory =
        normalizedCat.includes("gurman") ||
        normalizedCat.includes("degustac") ||
        normalizedCat.includes("kurz") ||
        normalizedCat.includes("varen") ||
        normalizedCat.includes("ochutnavk") ||
        normalizedTitle.includes("kurz") ||
        normalizedTitle.includes("degustace") ||
        normalizedTitle.includes("ochutnavka");

      if (!isCulinaryCategory) continue;

      // Drop obvious negatives
      const isNegative = NEGATIVE_KEYWORDS.some(neg => normalizedTitle.includes(neg));
      if (isNegative) continue;

      // Positive keyword check
      const matchedPositive = POSITIVE_KEYWORDS.filter(pos => fullText.includes(pos));
      if (matchedPositive.length === 0) continue;

      // Cuisine determination
      const matchedCuisines: string[] = [];
      for (const [cuisineName, patterns] of Object.entries(CUISINE_LOOKUP)) {
        if (patterns.some(pat => fullText.includes(pat))) {
          matchedCuisines.push(cuisineName);
        }
      }

      // Generate tags
      const tags: string[] = ["zazitky", "gastronomie", ...matchedCuisines];
      if (fullText.includes("kurz") || fullText.includes("skola")) tags.push("kurz_vareni");
      if (fullText.includes("degustac") || fullText.includes("ochutnavk")) tags.push("degustace");
      if (fullText.includes("vecer") || fullText.includes("obed")) tags.push("vecere");
      if (fullText.includes("pecen") || fullText.includes("kvask") || fullText.includes("chleb")) tags.push("peceni");

      const location = raw.rawAttributes?.location || "Česká republika";
      if (location) tags.push(normalizeText(location));

      const relevanceScore = Math.min(
        100,
        40 + matchedPositive.length * 8 + matchedCuisines.length * 15
      );

      normalizedList.push({
        id: `${this.merchant}:${raw.externalId}`,
        externalId: raw.externalId,
        merchant: this.merchant,
        title: raw.title,
        description: raw.description?.slice(0, 500),
        sourceUrl: raw.sourceUrl,
        affiliateUrl: this.buildAffiliateUrl(raw.sourceUrl),
        imageUrl: raw.imageUrl,
        price: raw.price,
        currency: raw.currency || "CZK",
        category: raw.rawCategories?.[0] || "Gurmánské zážitky",
        tags: Array.from(new Set(tags)),
        cuisines: Array.from(new Set(matchedCuisines.length > 0 ? matchedCuisines : ["ceska", "mezinarodni"])),
        ingredients: [],
        intents: ["cooking_course", "tasting", "gourmet_gift", "culinary_experience"],
        active: true,
        relevanceScore,
        lastSeenAt: new Date(),
      });
    }

    return normalizedList;
  }
}
