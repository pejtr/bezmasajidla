// ============================================================
// BEZMASAJIDLA.CZ — Czech Ingredient Parser & Morphological Normalizer
// Deterministic quantity, unit, modifier and lemmatization pipeline
// ============================================================

import type { ParsedIngredient } from "./types";

// Standard unit mappings to canonical unit name
const UNIT_MAP: Record<string, string> = {
  g: "g",
  gram: "g",
  gramu: "g",
  gramů: "g",
  kg: "kg",
  kilogram: "kg",
  kilogramu: "kg",
  kilogramů: "kg",
  dkg: "dkg",
  dekagram: "dkg",
  ml: "ml",
  mililitr: "ml",
  mililitru: "ml",
  mililitrů: "ml",
  l: "l",
  litr: "l",
  litru: "l",
  litrů: "l",
  dl: "dl",
  decilitr: "dl",
  cl: "cl",
  lžíce: "lžíce",
  lžic: "lžíce",
  lžíci: "lžíce",
  "polévková lžíce": "lžíce",
  "polévkové lžíce": "lžíce",
  "polévkových lžic": "lžíce",
  pl: "lžíce",
  lžička: "lžička",
  lžičky: "lžička",
  lžiček: "lžička",
  "čajová lžička": "lžička",
  "čajové lžičky": "lžička",
  "čajových lžiček": "lžička",
  čl: "lžička",
  ks: "ks",
  kus: "ks",
  kusy: "ks",
  kusů: "ks",
  stroužek: "stroužek",
  stroužky: "stroužek",
  stroužků: "stroužek",
  špetka: "špetka",
  špetky: "špetka",
  špetek: "špetka",
  hrnek: "hrnek",
  hrnku: "hrnek",
  hrnky: "hrnek",
  hrnků: "hrnek",
  plátek: "plátek",
  plátky: "plátek",
  plátků: "plátek",
  plechovka: "plechovka",
  plechovky: "plechovka",
  plechovek: "plechovka",
  balení: "balení",
  balíček: "balení",
  svazek: "svazek",
  snítka: "snítka",
  snítky: "snítka",
  kostka: "kostka",
  kostky: "kostka",
  kapka: "kapka",
  kapek: "kapka",
};

// Modifiers, descriptors, and culinary preparations to strip
const MODIFIER_PATTERNS = [
  /\bdle chuti\b/gi,
  /\bpodle chuti\b/gi,
  /\bdle potřeby\b/gi,
  /\bpodle potřeby\b/gi,
  /\bna ozdobu\b/gi,
  /\bna smažení\b/gi,
  /\bna pečení\b/gi,
  /\bk podávání\b/gi,
  /\bnajemno\b/gi,
  /\bnahrubo\b/gi,
  /\bnasekan[ýéáíého]\b/gi,
  /\bnakrájen[ýéáíého]\b/gi,
  /\bčerstvě mlet[ýéáíého]\b/gi,
  /\bčerstv[ýáéíého]\b/gi,
  /\bsušen[ýáéíého]\b/gi,
  /\bmlet[ýáéíého]\b/gi,
  /\bdrcen[ýáéíého]\b/gi,
  /\blisovan[ýáéíého]\b/gi,
  /\bprolisovan[ýáéíého]\b/gi,
  /\boloupan[ýáéíého]\b/gi,
  /\buvařen[ýáéíého]\b/gi,
  /\bpečen[ýáéíého]\b/gi,
  /\bdušen[ýáéíého]\b/gi,
  /\bmarinovan[ýáéíého]\b/gi,
  /\bvelk[ýáé]\b/gi,
  /\bmal[ýáé]\b/gi,
  /\bstředn[í]\b/gi,
  /\bkvalitn[í]\b/gi,
  /\bextra panensk[ýého]\b/gi,
  /\bstuden[ýáéí]\b/gi,
  /\btepl[ýáéí]\b/gi,
  /\bvlažn[ýáéí]\b/gi,
];

// Morphological / Lemmatization dictionary (inflected Czech forms -> canonical lemma + category)
const INGREDIENT_LEMMA_MAP: Record<string, { lemma: string; category: string }> = {
  // Luštěniny
  cizrny: { lemma: "cizrna", category: "lusteniny" },
  cizrna: { lemma: "cizrna", category: "lusteniny" },
  cizrnu: { lemma: "cizrna", category: "lusteniny" },
  "červené čočky": { lemma: "červená čočka", category: "lusteniny" },
  "červená čočka": { lemma: "červená čočka", category: "lusteniny" },
  "čočky": { lemma: "čočka", category: "lusteniny" },
  "čočka": { lemma: "čočka", category: "lusteniny" },
  "černé čočky": { lemma: "černá čočka beluga", category: "lusteniny" },
  "fazolí": { lemma: "fazole", category: "lusteniny" },
  "fazole": { lemma: "fazole", category: "lusteniny" },
  "červených fazolí": { lemma: "červené fazole", category: "lusteniny" },
  "bílých fazolí": { lemma: "bílé fazole", category: "lusteniny" },
  "hrášku": { lemma: "hrášek", category: "zelenina" },
  "hrášek": { lemma: "hrášek", category: "zelenina" },

  // Zelenina & Bylinky
  rajčata: { lemma: "rajče", category: "zelenina" },
  rajčat: { lemma: "rajče", category: "zelenina" },
  rajče: { lemma: "rajče", category: "zelenina" },
  "drcených rajčat": { lemma: "drcená rajčata", category: "zelenina" },
  "krájených rajčat": { lemma: "krájená rajčata", category: "zelenina" },
  "cherry rajčat": { lemma: "cherry rajčata", category: "zelenina" },
  "cherry rajčata": { lemma: "cherry rajčata", category: "zelenina" },
  cibule: { lemma: "cibule", category: "zelenina" },
  cibuli: { lemma: "cibule", category: "zelenina" },
  cibulí: { lemma: "cibule", category: "zelenina" },
  "červené cibule": { lemma: "červená cibule", category: "zelenina" },
  "jarní cibulky": { lemma: "jarní cibulka", category: "zelenina" },
  "jarní cibulka": { lemma: "jarní cibulka", category: "zelenina" },
  česneku: { lemma: "česnek", category: "zelenina" },
  česnek: { lemma: "česnek", category: "zelenina" },
  brambor: { lemma: "brambory", category: "zelenina" },
  brambory: { lemma: "brambory", category: "zelenina" },
  mrkve: { lemma: "mrkev", category: "zelenina" },
  mrkev: { lemma: "mrkev", category: "zelenina" },
  celeru: { lemma: "celer", category: "zelenina" },
  celer: { lemma: "celer", category: "zelenina" },
  petržele: { lemma: "petržel", category: "zelenina" },
  petržel: { lemma: "petržel", category: "zelenina" },
  "petrželky": { lemma: "hladkolistá petrželka", category: "bylinky" },
  cukety: { lemma: "cuketa", category: "zelenina" },
  cuketa: { lemma: "cuketa", category: "zelenina" },
  lilmku: { lemma: "lilek", category: "zelenina" },
  lilek: { lemma: "lilek", category: "zelenina" },
  papriky: { lemma: "paprika", category: "zelenina" },
  paprika: { lemma: "paprika", category: "zelenina" },
  špenátu: { lemma: "špenát", category: "zelenina" },
  špenát: { lemma: "špenát", category: "zelenina" },
  rukoly: { lemma: "rukola", category: "zelenina" },
  rukola: { lemma: "rukola", category: "zelenina" },
  avokáda: { lemma: "avokádo", category: "ovoce" },
  avokádo: { lemma: "avokádo", category: "ovoce" },
  žampionů: { lemma: "žampiony", category: "zelenina" },
  žampiony: { lemma: "žampiony", category: "zelenina" },
  hub: { lemma: "houby", category: "zelenina" },
  houby: { lemma: "houby", category: "zelenina" },
  zázvoru: { lemma: "zázvor", category: "zelenina" },
  zázvor: { lemma: "zázvor", category: "zelenina" },
  bazalky: { lemma: "bazalka", category: "bylinky" },
  bazalka: { lemma: "bazalka", category: "bylinky" },
  oregana: { lemma: "oregano", category: "bylinky" },
  oregano: { lemma: "oregano", category: "bylinky" },
  tymiánu: { lemma: "tymián", category: "bylinky" },
  tymián: { lemma: "tymián", category: "bylinky" },
  rozmarýnu: { lemma: "rozmarýn", category: "bylinky" },
  rozmarýn: { lemma: "rozmarýn", category: "bylinky" },
  koriandru: { lemma: "koriandr", category: "bylinky" },
  koriandr: { lemma: "koriandr", category: "bylinky" },

  // Oleje, Tuky, Dochucovadla
  "olivového oleje": { lemma: "olivový olej", category: "oleje" },
  "olivový olej": { lemma: "olivový olej", category: "oleje" },
  "sezamového oleje": { lemma: "sezamový olej", category: "oleje" },
  "sezamový olej": { lemma: "sezamový olej", category: "oleje" },
  "rostlinného oleje": { lemma: "rostlinný olej", category: "oleje" },
  "kokosového oleje": { lemma: "kokosový olej", category: "oleje" },
  "kokosového mléka": { lemma: "kokosové mléko", category: "rostlinne_alternativy" },
  "kokosové mléko": { lemma: "kokosové mléko", category: "rostlinne_alternativy" },
  "sójové omáčky": { lemma: "sójová omáčka", category: "dochucovadla" },
  "sójová omáčka": { lemma: "sójová omáčka", category: "dochucovadla" },
  "tamari": { lemma: "tamari sójová omáčka", category: "dochucovadla" },
  "jablečného octa": { lemma: "jablečný ocet", category: "dochucovadla" },
  "balsamica": { lemma: "balsamico ocet", category: "dochucovadla" },
  "tahini": { lemma: "tahini sezamová pasta", category: "dochucovadla" },
  "hořčice": { lemma: "dijonská hořčice", category: "dochucovadla" },

  // Koření & Dochucovadla
  soli: { lemma: "sůl", category: "koreni" },
  sůl: { lemma: "sůl", category: "koreni" },
  pepře: { lemma: "černý pepř", category: "koreni" },
  pepř: { lemma: "černý pepř", category: "koreni" },
  "černý pepř": { lemma: "černý pepř", category: "koreni" },
  "černého pepře": { lemma: "černý pepř", category: "koreni" },
  kurkumy: { lemma: "kurkuma", category: "koreni" },
  kurkuma: { lemma: "kurkuma", category: "koreni" },
  "římského kmínu": { lemma: "římský kmín", category: "koreni" },
  "uzené papriky": { lemma: "uzená paprika", category: "koreni" },
  "sladké papriky": { lemma: "sladká paprika", category: "koreni" },
  "chilli": { lemma: "chilli", category: "koreni" },
  "kari koření": { lemma: "kari koření", category: "koreni" },
  "garam masala": { lemma: "garam masala", category: "koreni" },

  // Pečení, Mouky, Obiloviny
  mouky: { lemma: "hladká mouka", category: "peceni" },
  mouka: { lemma: "hladká mouka", category: "peceni" },
  "hladké mouky": { lemma: "hladká mouka", category: "peceni" },
  "špaldové mouky": { lemma: "špaldová mouka", category: "peceni" },
  cukru: { lemma: "cukr", category: "peceni" },
  cukr: { lemma: "cukr", category: "peceni" },
  "třtinového cukru": { lemma: "třtinový cukr", category: "peceni" },
  "kypřicího prášku": { lemma: "kypřicí prášek", category: "peceni" },
  "jedlé sody": { lemma: "jedlá soda", category: "peceni" },
  droždí: { lemma: "droždí", category: "peceni" },
  kvasnic: { lemma: "droždí", category: "peceni" },
  kakaa: { lemma: "kakao", category: "peceni" },
  kakao: { lemma: "kakao", category: "peceni" },
  "hořké čokolády": { lemma: "hořká čokoláda", category: "peceni" },
  "ovesných vloček": { lemma: "ovesné vločky", category: "obiloviny" },
  "ovesné vločky": { lemma: "ovesné vločky", category: "obiloviny" },
  rýže: { lemma: "rýže", category: "obiloviny" },
  "jasmínové rýže": { lemma: "jasmínová rýže", category: "obiloviny" },
  "basmati rýže": { lemma: "basmati rýže", category: "obiloviny" },
  těstovin: { lemma: "těstoviny", category: "obiloviny" },
  těstoviny: { lemma: "těstoviny", category: "obiloviny" },
  quinoi: { lemma: "quinoa", category: "obiloviny" },
  quinoa: { lemma: "quinoa", category: "obiloviny" },

  // Rostlinné proteiny & Ořechy
  tofu: { lemma: "tofu", category: "rostlinne_proteiny" },
  "uzeného tofu": { lemma: "uzené tofu", category: "rostlinne_proteiny" },
  tempehu: { lemma: "tempeh", category: "rostlinne_proteiny" },
  tempeh: { lemma: "tempeh", category: "rostlinne_proteiny" },
  seitanu: { lemma: "seitan", category: "rostlinne_proteiny" },
  seitan: { lemma: "seitan", category: "rostlinne_proteiny" },
  "lahůdkového droždí": { lemma: "lahůdkové droždí", category: "ochucovadla" },
  "vlašských ořechů": { lemma: "vlašské ořechy", category: "orechy" },
  "kešu ořechů": { lemma: "kešu ořechy", category: "orechy" },
  "mandlí": { lemma: "mandle", category: "orechy" },
};

/**
 * Parses fractional or decimal string into a numeric value
 * e.g. "400" -> 400, "1/2" -> 0.5, "1.5" -> 1.5, "2,5" -> 2.5
 */
export function parseQuantity(qtyStr: string): number | undefined {
  if (!qtyStr) return undefined;
  const cleaned = qtyStr.trim().replace(",", ".");
  if (cleaned.includes("/")) {
    const parts = cleaned.split("/");
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  const val = parseFloat(cleaned);
  return isNaN(val) ? undefined : val;
}

/**
 * Parses raw ingredient string into structured, morphologically normalized ingredient
 */
export function parseIngredient(rawIngredient: string): ParsedIngredient {
  if (!rawIngredient || typeof rawIngredient !== "string") {
    return {
      raw: "",
      name: "",
      query: "",
    };
  }

  const raw = rawIngredient.trim();

  // 1. Extract leading quantity if present (fractions like 1/2 prioritized over 1)
  const qtyMatch = raw.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/i);

  let amount: number | undefined;
  let unit: string | undefined;
  let remaining = raw;

  if (qtyMatch) {
    amount = parseQuantity(qtyMatch[1]);
    remaining = qtyMatch[2].trim();

    // Check multi-word units first (e.g. "polévková lžíce", "čajová lžička")
    let matchedUnitStr: string | null = null;
    const words = remaining.split(/\s+/);
    if (words.length >= 2) {
      const twoWords = `${words[0]} ${words[1]}`.toLowerCase();
      if (UNIT_MAP[twoWords]) {
        matchedUnitStr = twoWords;
        unit = UNIT_MAP[twoWords];
        remaining = words.slice(2).join(" ");
      }
    }

    if (!matchedUnitStr && words.length >= 1) {
      const oneWord = words[0].toLowerCase();
      if (UNIT_MAP[oneWord]) {
        matchedUnitStr = oneWord;
        unit = UNIT_MAP[oneWord];
        remaining = words.slice(1).join(" ");
      }
    }

    if (!matchedUnitStr) {
      // No recognized unit after quantity (e.g. "1 velká cibule" or "2 rajčata") -> default unit is "ks"
      unit = "ks";
    }
  }

  // 2. Strip modifiers and preparation descriptors
  let cleanedText = remaining;
  for (const pattern of MODIFIER_PATTERNS) {
    cleanedText = cleanedText.replace(pattern, " ");
  }

  // Remove commas, parentheses, extra whitespace
  cleanedText = cleanedText
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // 3. Morphological lemmatization via dictionary lookup
  let canonicalName = cleanedText;
  let category: string | undefined;

  if (INGREDIENT_LEMMA_MAP[cleanedText]) {
    canonicalName = INGREDIENT_LEMMA_MAP[cleanedText].lemma;
    category = INGREDIENT_LEMMA_MAP[cleanedText].category;
  } else {
    // Check multi-word submatches
    let bestMatch: { lemma: string; category: string } | null = null;
    let longestMatchLen = 0;
    for (const [key, value] of Object.entries(INGREDIENT_LEMMA_MAP)) {
      if (cleanedText.includes(key) && key.length > longestMatchLen) {
        bestMatch = value;
        longestMatchLen = key.length;
      }
    }
    if (bestMatch) {
      canonicalName = bestMatch.lemma;
      category = bestMatch.category;
    }
  }

  // 4. If nothing was stripped or text became empty, fallback to sanitized raw
  if (!canonicalName) {
    canonicalName = raw
      .replace(/[0-9]/g, "")
      .replace(/[(),]/g, "")
      .trim();
  }

  return {
    raw,
    name: canonicalName,
    amount,
    unit,
    category,
    query: canonicalName,
  };
}

/**
 * Batch parses an array of ingredient strings
 */
export function parseRecipeIngredients(rawIngredients: string[]): ParsedIngredient[] {
  if (!Array.isArray(rawIngredients)) return [];
  return rawIngredients
    .map(ing => parseIngredient(ing))
    .filter(p => p.name.length > 0);
}
