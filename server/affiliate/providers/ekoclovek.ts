// ============================================================
// BEZMASAJIDLA.CZ — Ekočlověk Affiliate Provider (eHUB)
// ============================================================

import { AFFILIATE_CONFIG } from "../config";
import { BaseAffiliateProvider, normalizeText } from "./base";
import { extractXmlBlocks, getTagContent, stripHtml, parsePrice } from "../xml-parser";
import type { RawAffiliateProduct, NormalizedAffiliateProduct } from "../types";

// Positive keyword themes relevant to vegetarian/vegan cooking & growing
const POSITIVE_KEYWORDS = [
  "bylink",
  "bazalk",
  "mat",
  "oregan",
  "tymian",
  "rozmaryn",
  "pazitk",
  "koriandr",
  "majorank",
  "salvej",
  "libecek",
  "rajc",
  "paprik",
  "chilli",
  "jalapeno",
  "habanero",
  "cesnek",
  "cibul",
  "salat",
  "spenat",
  "rukola",
  "mikrogreen",
  "microgreen",
  "klicen",
  "klicky",
  "semink",
  "semen",
  "osiv",
  "pestovan",
  "substrat",
  "kompost",
  "hnojiv",
  "bio ochran",
  "ochrana rostlin",
  "vyvysen",
  "kvetinac",
  "truhlik",
  "sadbov",
  "zahradk",
  "zelenin",
  "ovoce",
  "kapkov",
  "perlit",
  "vermikulit",
  "kokos",
  "jil",
  "rozkvas",
  "kvas",
  "ferment",
];

// Explicit negative keywords that do not belong on a food/recipe site
const NEGATIVE_KEYWORDS = [
  "bazen",
  "odpuzovac krtku",
  "odpuzovac kun",
  "medved",
  "lesni zver",
  "mys",
  "potkan",
  "chemick",
  "stavebn",
  "naradi na stavbu",
  "praci gel",
  "praci prasek",
  "avivaz",
  "kosmetika",
  "pletovy",
  "krem",
  "sampon",
  "mydlo",
  "zubni",
  "deodorant",
];

const INGREDIENT_LOOKUP: Record<string, string[]> = {
  bazalka: ["bazalk"],
  mata: ["mat"],
  oregano: ["oregan"],
  tymian: ["tymian"],
  rozmaryn: ["rozmaryn"],
  pazitka: ["pazitk"],
  koriandr: ["koriandr"],
  majoranka: ["majorank"],
  salvej: ["salvej"],
  libecek: ["libecek"],
  rajcata: ["rajc"],
  papriky: ["paprik"],
  chilli: ["chilli", "jalapeno", "habanero"],
  cesnek: ["cesnek"],
  cibule: ["cibul"],
  salat: ["salat"],
  spenat: ["spenat"],
  rukola: ["rukol"],
  mikrogreens: ["mikrogreen", "microgreen", "klic"],
  bylinky: ["bylink"],
  zelenina: ["zelenin"],
};

export class EhubEkoclovekProvider extends BaseAffiliateProvider {
  merchant = "ekoclovek" as const;
  feedUrl = AFFILIATE_CONFIG.feeds.ekoclovek;

  buildAffiliateUrl(sourceUrl?: string): string {
    const dest = sourceUrl || "https://eshop.ekoclovek.cz/";
    const aid = AFFILIATE_CONFIG.ehub.aid;
    const bid = AFFILIATE_CONFIG.ehub.ekoclovekBid;
    return `${AFFILIATE_CONFIG.ehub.clickScriptUrl}?a_aid=${aid}&a_bid=${bid}&desturl=${encodeURIComponent(dest)}`;
  }

  async parseFeed(xmlContent: string): Promise<RawAffiliateProduct[]> {
    const entries = extractXmlBlocks(xmlContent, "entry");
    const rawProducts: RawAffiliateProduct[] = [];

    for (const entry of entries) {
      try {
        const id = getTagContent(entry, "g:id") || getTagContent(entry, "id");
        const title = getTagContent(entry, "title");
        const descRaw = getTagContent(entry, "description") || getTagContent(entry, "summary") || "";
        const link = getTagContent(entry, "link") || getTagContent(entry, "g:link");
        const imageLink = getTagContent(entry, "g:image_link") || getTagContent(entry, "image_link");
        const priceRaw = getTagContent(entry, "g:price") || getTagContent(entry, "price");
        const productType = getTagContent(entry, "g:product_type") || getTagContent(entry, "product_type");
        const availability = getTagContent(entry, "g:availability") || "in stock";

        if (!id || !title) continue;

        const { price, currency } = parsePrice(priceRaw);

        rawProducts.push({
          externalId: id,
          merchant: this.merchant,
          title,
          description: stripHtml(descRaw),
          sourceUrl: link,
          imageUrl: imageLink,
          price,
          currency,
          category: productType,
          inStock: !/out of stock|vyprodano|nedostupne/i.test(availability),
        });
      } catch (err) {
        // Continue defensively on item-level parse failure
        continue;
      }
    }

    return rawProducts;
  }

  filterAndNormalize(rawProducts: RawAffiliateProduct[]): NormalizedAffiliateProduct[] {
    const normalizedList: NormalizedAffiliateProduct[] = [];

    for (const raw of rawProducts) {
      if (raw.inStock === false) continue;

      const normalizedTitle = normalizeText(raw.title);
      const normalizedDesc = normalizeText(raw.description || "");
      const normalizedCat = normalizeText(raw.category || "");
      const fullText = `${normalizedTitle} ${normalizedCat} ${normalizedDesc}`;

      // Check negative keywords first
      const isNegative = NEGATIVE_KEYWORDS.some(neg => fullText.includes(neg));
      if (isNegative) continue;

      // Check positive keywords
      const matchedPositive = POSITIVE_KEYWORDS.filter(pos => fullText.includes(pos));
      if (matchedPositive.length === 0) continue;

      // Extract matching ingredients
      const matchedIngredients: string[] = [];
      for (const [ingredientName, patterns] of Object.entries(INGREDIENT_LOOKUP)) {
        if (patterns.some(pat => fullText.includes(pat))) {
          matchedIngredients.push(ingredientName);
        }
      }

      // Generate tags
      const tags: string[] = ["ekoclovek", "pestovani", "bio", ...matchedIngredients];
      if (fullText.includes("semink") || fullText.includes("osiv")) tags.push("seminka");
      if (fullText.includes("substrat") || fullText.includes("kompost")) tags.push("substrat");
      if (fullText.includes("hnojiv")) tags.push("hnojivo");
      if (fullText.includes("bylink")) tags.push("bylinky");
      if (fullText.includes("bio ochran") || fullText.includes("ochrana")) tags.push("ochrana_rostlin");

      // Calculate initial baseline relevance
      const relevanceScore = Math.min(
        100,
        30 + matchedPositive.length * 10 + matchedIngredients.length * 15
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
        category: raw.category || "Pěstování a zahrada",
        tags: Array.from(new Set(tags)),
        cuisines: ["ceska", "univerzalni"],
        ingredients: Array.from(new Set(matchedIngredients)),
        intents: ["grow_ingredients", "home_gardening", "kitchen_herbs"],
        active: true,
        relevanceScore,
        lastSeenAt: new Date(),
      });
    }

    return normalizedList;
  }
}
