// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Commerce Engine Unit & Integration Tests
// ============================================================

import { describe, expect, it, beforeEach } from "vitest";
import {
  decodeXmlEntities,
  stripHtml,
  parsePrice,
  getTagContent,
  getAllTagContents,
  extractXmlBlocks,
} from "./affiliate/xml-parser";
import { EhubEkoclovekProvider } from "./affiliate/providers/ekoclovek";
import { EhubZazitkyProvider } from "./affiliate/providers/zazitky";
import { scoreProductForRecipe, matchAffiliateProducts } from "./affiliate/matcher";
import { isWhitelistedDomain, buildEhubTrackingUrl, getSafeAffiliateUrl } from "./affiliate/links";
import {
  saveAffiliateProducts,
  getAllActiveAffiliateProducts,
  getAffiliateProductById,
  recordAffiliateEvent,
  getAffiliateDiagnosticStats,
} from "./affiliate/storage";
import type { RawAffiliateProduct, NormalizedAffiliateProduct, RecipeMatchContext } from "./affiliate/types";

describe("Affiliate Engine — XML Parser", () => {
  it("decodes XML and HTML entities and CDATA correctly", () => {
    const raw = "Bylinky &amp; koření &lt;span&gt;&quot;Bio&quot; &amp; čerstvé&#39;s&lt;/span&gt; <![CDATA[v Praze]]>";
    const decoded = decodeXmlEntities(raw);
    expect(decoded).toContain('Bylinky & koření <span>"Bio" & čerstvé\'s</span> v Praze');
  });

  it("strips HTML tags and preserves clean text", () => {
    const html = "<p><strong>Bazalka pravá</strong> je <em>skvělá bylina</em> pro <a href='#'>italskou kuchyni</a>.</p>";
    const text = stripHtml(html);
    expect(text).toBe("Bazalka pravá je skvělá bylina pro italskou kuchyni.");
  });

  it("parses Czech, European and formatted price strings defensively", () => {
    expect(parsePrice("1182 CZK")).toEqual({ price: 1182, currency: "CZK" });
    expect(parsePrice("1 550,00 Kč")).toEqual({ price: 1550, currency: "CZK" });
    expect(parsePrice("249,50")).toEqual({ price: 249.5, currency: "CZK" });
    expect(parsePrice("49.90 EUR")).toEqual({ price: 49.9, currency: "EUR" });
    expect(parsePrice("")).toEqual({ price: undefined, currency: "CZK" });
    expect(parsePrice(null)).toEqual({ price: undefined, currency: "CZK" });
    expect(parsePrice("Cena dohodou")).toEqual({ price: undefined, currency: "CZK" });
  });

  it("extracts namespaced and standard XML tags", () => {
    const block = `
      <entry>
        <g:id>123/4</g:id>
        <title>Sada na pěstování chilli</title>
        <g:price>299 CZK</g:price>
        <link>https://eshop.ekoclovek.cz/chilli</link>
      </entry>
    `;
    expect(getTagContent(block, "g:id")).toBe("123/4");
    expect(getTagContent(block, "title")).toBe("Sada na pěstování chilli");
    expect(getTagContent(block, "g:price")).toBe("299 CZK");
    expect(getTagContent(block, "link")).toBe("https://eshop.ekoclovek.cz/chilli");
  });

  it("extracts multiple repeated tags (e.g. CATEGORYTEXT)", () => {
    const block = `
      <SHOPITEM>
        <CATEGORYTEXT>Gurmánské zážitky</CATEGORYTEXT>
        <CATEGORYTEXT>Kurzy vaření</CATEGORYTEXT>
        <CATEGORYTEXT>Italská kuchyně</CATEGORYTEXT>
      </SHOPITEM>
    `;
    const categories = getAllTagContents(block, "CATEGORYTEXT");
    expect(categories).toEqual([
      "Gurmánské zážitky",
      "Kurzy vaření",
      "Italská kuchyně",
    ]);
  });

  it("handles malformed XML defensively without crashing", () => {
    const malformed = "<feed><entry><title>Nekompletní položka<description>bez uzavření";
    const entries = extractXmlBlocks(malformed, "entry");
    expect(Array.isArray(entries)).toBe(true);
  });
});

describe("Affiliate Engine — Provider Normalization & Relevance", () => {
  const ekoclovekProvider = new EhubEkoclovekProvider();
  const zazitkyProvider = new EhubZazitkyProvider();

  it("normalizes and accepts relevant Ekočlověk gardening & herb products", () => {
    const raw: RawAffiliateProduct[] = [
      {
        externalId: "eko-01",
        merchant: "ekoclovek",
        title: "Bio semínka bazalky a chilli",
        description: "Vypěstujte si vlastní čerstvou bazalku a pálivé chilli papričky na okně.",
        sourceUrl: "https://eshop.ekoclovek.cz/seminka-bazalka-chilli",
        imageUrl: "https://eshop.ekoclovek.cz/img/bazalka.jpg",
        price: 89,
        currency: "CZK",
        category: "Semínka a bylinky",
        inStock: true,
      },
      {
        externalId: "eko-02",
        merchant: "ekoclovek",
        title: "Přípravek na čištění bazénu chlorový",
        description: "Chemický dezinfekční prostředek do venkovního bazénu.",
        sourceUrl: "https://eshop.ekoclovek.cz/bazen-chemie",
        price: 350,
        currency: "CZK",
        category: "Bazénová chemie",
        inStock: true,
      },
    ];

    const normalized = ekoclovekProvider.filterAndNormalize(raw);
    expect(normalized).toHaveLength(1);
    expect(normalized[0].externalId).toBe("eko-01");
    expect(normalized[0].tags).toContain("bazalka");
    expect(normalized[0].tags).toContain("chilli");
    expect(normalized[0].ingredients).toContain("bazalka");
    expect(normalized[0].ingredients).toContain("chilli");
    expect(normalized[0].affiliateUrl).toContain("a_aid=6e1140ca");
    expect(normalized[0].affiliateUrl).toContain("a_bid=7092fff6");
  });

  it("normalizes and accepts culinary courses & gourmet experiences from Zážitky.cz", () => {
    const raw: RawAffiliateProduct[] = [
      {
        externalId: "zaz-01",
        merchant: "zazitky",
        title: "Kurz vaření indické kuchyně s šéfkuchařem",
        description: "Naučte se autentické indické kari, samosy a pečení chleba naan.",
        sourceUrl: "https://www.zazitky.cz/kurz-indicke-kuchyne",
        imageUrl: "https://alis.zazitky.cz/img/indie.jpg",
        price: 2490,
        currency: "CZK",
        category: "Gurmánské zážitky | Kurzy vaření",
        rawCategories: ["Gurmánské zážitky", "Kurzy vaření"],
        rawAttributes: { location: "Praha" },
        inStock: true,
      },
      {
        externalId: "zaz-02",
        merchant: "zazitky",
        title: "Tandemový seskok padákem z 4000 metrů",
        description: "Adrenalinový seskok pro odvážné s instruktorem.",
        sourceUrl: "https://www.zazitky.cz/tandemovy-seskok",
        price: 4200,
        currency: "CZK",
        category: "Adrenalinové zážitky",
        rawCategories: ["Adrenalin"],
        inStock: true,
      },
    ];

    const normalized = zazitkyProvider.filterAndNormalize(raw);
    expect(normalized).toHaveLength(1);
    expect(normalized[0].externalId).toBe("zaz-01");
    expect(normalized[0].cuisines).toContain("indicka");
    expect(normalized[0].tags).toContain("kurz_vareni");
    expect(normalized[0].affiliateUrl).toContain("a_aid=6e1140ca");
    expect(normalized[0].affiliateUrl).toContain("a_bid=c22fc1d9");
  });
});

describe("Affiliate Engine — Recipe-to-Affiliate Matcher", () => {
  const sampleCatalog: NormalizedAffiliateProduct[] = [
    {
      id: "ekoclovek:1",
      externalId: "1",
      merchant: "ekoclovek",
      title: "Sada pro pěstování chilli papriček Habanero",
      description: "Kompletní pěstební sada s květináčem a substrátem pro domácí chilli.",
      sourceUrl: "https://eshop.ekoclovek.cz/chilli-sada",
      affiliateUrl: "https://ehub.cz/click?id=1",
      price: 199,
      currency: "CZK",
      category: "Pěstování",
      tags: ["chilli", "pestovani", "bylinky"],
      cuisines: ["univerzalni"],
      ingredients: ["chilli", "papriky"],
      intents: ["grow_ingredients"],
      active: true,
      lastSeenAt: new Date(),
    },
    {
      id: "ekoclovek:2",
      externalId: "2",
      merchant: "ekoclovek",
      title: "Bio semínka italské bazalky pravé",
      description: "Voňavá bazalka pro dokonalou pizzu a rajčatové omáčky.",
      sourceUrl: "https://eshop.ekoclovek.cz/bazalka-seminka",
      affiliateUrl: "https://ehub.cz/click?id=2",
      price: 49,
      currency: "CZK",
      category: "Semínka",
      tags: ["bazalka", "bylinky", "seminka"],
      cuisines: ["italska"],
      ingredients: ["bazalka", "rajcata"],
      intents: ["grow_ingredients"],
      active: true,
      lastSeenAt: new Date(),
    },
    {
      id: "zazitky:101",
      externalId: "101",
      merchant: "zazitky",
      title: "Kurz indické kuchyně v Praze",
      description: "Příprava tradičního kari, čočkového dhalu a indických placek.",
      sourceUrl: "https://www.zazitky.cz/kurz-indie",
      affiliateUrl: "https://ehub.cz/click?id=101",
      price: 2600,
      currency: "CZK",
      category: "Kurzy vaření",
      tags: ["kurz_vareni", "indicka"],
      cuisines: ["indicka"],
      ingredients: [],
      intents: ["cooking_course"],
      active: true,
      lastSeenAt: new Date(),
    },
    {
      id: "zazitky:102",
      externalId: "102",
      merchant: "zazitky",
      title: "Kurz pečení kváskového chleba a pečiva",
      description: "Naučte se péct křupavý domácí kváskový chléb od mistra pekaře.",
      sourceUrl: "https://www.zazitky.cz/kurz-chleba",
      affiliateUrl: "https://ehub.cz/click?id=102",
      price: 1950,
      currency: "CZK",
      category: "Kurzy vaření",
      tags: ["peceni", "chleb"],
      cuisines: ["ceska"],
      ingredients: [],
      intents: ["cooking_course"],
      active: true,
      lastSeenAt: new Date(),
    },
  ];

  it("matches Indian recipe with Indian cooking experience and chilli growing product", () => {
    const recipe: RecipeMatchContext = {
      slug: "indicke-cizrnove-kari",
      title: "Indické cizrnové kari s kokosovým mlékem",
      category: "Hlavní jídla",
      cuisine: "Indická",
      ingredients: ["400 g cizrny", "1 plechovka kokosového mléka", "1 lžička chilli", "čerstvý koriandr", "kurkuma"],
      tags: ["indicka", "kari", "chilli", "cizrna", "vegan"],
    };

    const match = matchAffiliateProducts(sampleCatalog, recipe);
    expect(match.experiences).toHaveLength(1);
    expect(match.experiences[0].id).toBe("zazitky:101");
    expect(match.products).toHaveLength(1);
    expect(match.products[0].id).toBe("ekoclovek:1");
  });

  it("matches Italian pizza recipe with Basil seeds and Italian context", () => {
    const recipe: RecipeMatchContext = {
      slug: "domaci-vegetarianska-pizza",
      title: "Domácí vegetariánská pizza s mozzarellou a bazalkou",
      category: "Hlavní jídla",
      cuisine: "Italská",
      ingredients: ["400 g mouky", "200 g drcených rajčat", "150 g mozzarelly", "čerstvá bazalka", "oregano"],
      tags: ["pizza", "italska", "bazalka", "rajcata"],
    };

    const match = matchAffiliateProducts(sampleCatalog, recipe);
    expect(match.products.length).toBeGreaterThanOrEqual(1);
    expect(match.products[0].id).toBe("ekoclovek:2");
  });

  it("rejects unrelated recipe with low relevance and returns 0 products", () => {
    const unrelatedRecipe: RecipeMatchContext = {
      slug: "jednoduchy-ovocny-salat",
      title: "Ovocný salát s banánem a jablkem",
      category: "Svačiny",
      cuisine: "Mezinárodní",
      ingredients: ["1 banán", "1 jablko", "kapka citronu"],
      tags: ["ovoce", "snadne"],
    };

    const match = matchAffiliateProducts(sampleCatalog, unrelatedRecipe);
    expect(match.products).toHaveLength(0);
    expect(match.experiences).toHaveLength(0);
  });
});

describe("Affiliate Engine — Safe Link Generation & Whitelist Security", () => {
  it("validates whitelisted domains and blocks open redirect attempts", () => {
    expect(isWhitelistedDomain("https://eshop.ekoclovek.cz/produkt-123")).toBe(true);
    expect(isWhitelistedDomain("https://www.zazitky.cz/kurz-vareni")).toBe(true);
    expect(isWhitelistedDomain("https://alis.zazitky.cz/data/images/test.jpg")).toBe(true);
    expect(isWhitelistedDomain("https://ehub.cz/system/scripts/click.php")).toBe(true);

    // Malicious or unapproved domains must fail
    expect(isWhitelistedDomain("https://malicious-phishing-site.com/login")).toBe(false);
    expect(isWhitelistedDomain("https://attacker-ekoclovek.cz.evil.com/")).toBe(false);
    expect(isWhitelistedDomain("javascript:alert(1)")).toBe(false);
    expect(isWhitelistedDomain("")).toBe(false);
  });

  it("builds authenticated eHUB click URLs correctly", () => {
    const clickUrl = buildEhubTrackingUrl("ekoclovek", "https://eshop.ekoclovek.cz/seminka");
    expect(clickUrl).toContain("https://ehub.cz/system/scripts/click.php");
    expect(clickUrl).toContain("a_aid=6e1140ca");
    expect(clickUrl).toContain("a_bid=7092fff6");
    expect(clickUrl).toContain(encodeURIComponent("https://eshop.ekoclovek.cz/seminka"));
  });
});

describe("Affiliate Engine — Storage & Idempotent Sync", () => {
  const sampleProducts: NormalizedAffiliateProduct[] = [
    {
      id: "ekoclovek:test-1",
      externalId: "test-1",
      merchant: "ekoclovek",
      title: "Testovací bylinkový substrát",
      sourceUrl: "https://eshop.ekoclovek.cz/substrat",
      affiliateUrl: "https://ehub.cz/click?id=test-1",
      price: 120,
      currency: "CZK",
      tags: ["bylinky", "substrat"],
      cuisines: ["ceska"],
      ingredients: ["bylinky"],
      intents: ["gardening"],
      active: true,
      lastSeenAt: new Date(),
    },
    {
      id: "ekoclovek:test-2",
      externalId: "test-2",
      merchant: "ekoclovek",
      title: "Testovací chilli semínka",
      sourceUrl: "https://eshop.ekoclovek.cz/chilli",
      affiliateUrl: "https://ehub.cz/click?id=test-2",
      price: 80,
      currency: "CZK",
      tags: ["chilli", "seminka"],
      cuisines: ["ceska"],
      ingredients: ["chilli"],
      intents: ["gardening"],
      active: true,
      lastSeenAt: new Date(),
    },
  ];

  it("saves, retrieves, and deactivates missing items idempotently", async () => {
    // 1. Initial insert
    const insertResult = await saveAffiliateProducts("ekoclovek", sampleProducts);
    expect(insertResult.inserted).toBe(2);

    const activeList = await getAllActiveAffiliateProducts();
    expect(activeList.some(p => p.id === "ekoclovek:test-1")).toBe(true);

    // 2. Sync with 1 item dropped from feed -> should deactivate missing item
    const updatedSync = [sampleProducts[0]]; // test-2 is missing
    const updateResult = await saveAffiliateProducts("ekoclovek", updatedSync);
    expect(updateResult.updated).toBe(1);
    expect(updateResult.deactivated).toBe(1);

    const product2 = await getAffiliateProductById("ekoclovek:test-2");
    expect(product2?.active).toBe(false);
  });

  it("records impressions, clicks, and calculates diagnostic stats", async () => {
    await recordAffiliateEvent({
      eventType: "impression",
      merchant: "ekoclovek",
      productId: "ekoclovek:test-1",
      recipeSlug: "indicke-kari",
      placement: "related_product",
    });

    await recordAffiliateEvent({
      eventType: "click",
      merchant: "ekoclovek",
      productId: "ekoclovek:test-1",
      recipeSlug: "indicke-kari",
      placement: "related_product",
    });

    const stats = await getAffiliateDiagnosticStats();
    expect(stats.impressionsCount).toBeGreaterThanOrEqual(1);
    expect(stats.clicksCount).toBeGreaterThanOrEqual(1);
    expect(stats.ctr).toBeDefined();
  });
});
