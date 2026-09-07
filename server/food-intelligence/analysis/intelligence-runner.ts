// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.2
// Local Profitability Run: 10 Strategic Gastronomy Themes
//
// DISCLOSURE: LOCAL PROFITABILITY RUN
// OWN DATA SIGNALS:        ✅ REAL (130+ recipes catalog inventory)
// RULE-BASED SCORE:        ✅ REAL (6 commercial pillars + quality/novelty multipliers)
// TASTY SIGNALS:           ⚪ DISABLED / NO CREDENTIALS
// TRANSLATION SIGNALS:     ⚪ DISABLED / NO CREDENTIALS
// HEURISTIC — NOT REVENUE FORECAST
// ============================================================

import { recipes as staticCatalog } from "../../../client/src/lib/data";
import type {
  ContentOpportunity,
  ExternalRecipeSignal,
  OriginalContentBrief,
  CraveSignal,
} from "../types";
import { ContentGapEngine } from "./content-gap-engine";
import { normalizeIngredient } from "../normalization/ingredient-normalizer";

export interface CanonicalTopicDefinition {
  id: string;
  topic: string;
  workingConcept: string;
  ingredients: string[];
  techniques: string[];
  cuisine: string;
  tags: string[];
  vegetarian: boolean;
  briefTemplate?: {
    originalAngle: string;
    differentiation: string;
    affiliateOpportunities: string[];
    cateringUsage: string;
    socialHook: string;
    cookbookChapter: string;
    newsletterHook: string;
    seoIntent: string;
  };
}

/**
 * 10 Canonical Themes requested for the War Mode evaluation
 */
export const TARGET_10_THEMES: CanonicalTopicDefinition[] = [
  {
    id: "whipped_feta",
    topic: "whipped feta",
    workingConcept: "Našlehaná feta s pečenými cherry rajčaty, česnekem a čerstvou bazalkou",
    ingredients: ["feta", "řecký jogurt", "cherry rajčata", "česnek", "extra panenský olivový olej", "čerstvá bazalka"],
    techniques: ["mixování", "pečení"],
    cuisine: "středomořská",
    tags: ["mezze", "předkrm", "na sdílení", "večeře", "rychlé", "vegetariánské"],
    vegetarian: true,
    briefTemplate: {
      originalAngle: "Teplá pečená rajčata praskající pod vidličkou v kontrastu s ledově hedvábnou, citrónovo-bylinkovou našlehanou fetou.",
      differentiation: "V katalogu máme pečenou dýni s labneh a lilkový dip, ale žádný dedikovaný moderní dip z našlehané fety s konfitovanými rajčaty.",
      affiliateOpportunities: ["Prémiový řecký extra panenský olivový olej (EVOO)", "Vysokorychlostní stolní mixér", "Zámecká keramická zapékací miska"],
      cateringUsage: "Ideální jako středobod finger-food a sharing baru na rauty; servírováno s teplou rozmarýnovou focacciou.",
      socialHook: "Lžíce nořící se do hedvábné fety + prasknutí pečeného rajčátka s vytékající šťávou.",
      cookbookChapter: "Kapitola 1: Předkrmy a sdílené talíře (Středomořský stůl)",
      newsletterHook: "Zapomeňte na nudné pomazánky: Tuhle našlehanou fetu s pečenými rajčaty budete dělat každý víkend.",
      seoIntent: "našlehaná feta recept, whipped feta s rajčaty, rychlý vegetariánský dip",
    },
  },
  {
    id: "crispy_potatoes",
    topic: "crispy potatoes",
    workingConcept: "Křupavé rozbité brambory (Smashed Potatoes) s bylinkovým česnekovým aioli",
    ingredients: ["brambory", "česnek", "extra panenský olivový olej", "rozmarýn", "uzená paprika", "mořská sůl"],
    techniques: ["pečení", "vaření"],
    cuisine: "česká moderní",
    tags: ["příloha", "snack", "vegetariánské", "bezlepkové", "na párty"],
    vegetarian: true,
    briefTemplate: {
      originalAngle: "Dvakrát pečené rozbité brambory s extrémně křupavými skelnými okraji a nadýchaným bramborovým středem.",
      differentiation: "V katalogu jsou brambory pouze v tradičních polévkách a zapékaných mísách. Zcela chybí samostatný virální křupavý bramborový recept.",
      affiliateOpportunities: ["Výběrová uzená paprika La Chinata", "Kvalitní těžký plech na pečení s nepřilnavým povrchem"],
      cateringUsage: "Vynikající teplý finger-food prvek do papírových kornoutků nebo na břidlicové desky s miskou aioli.",
      socialHook: "Zvuk křupnutí skleněného okraje brambory při zmáčknutí vidličkou (ASMR audio hook).",
      cookbookChapter: "Kapitola 4: Křupavá zelenina & Moderní přílohy",
      newsletterHook: "Trik na nejkřupavější brambory vašeho života: Dvakrát pečené smashed potatoes s česnekovým dipem.",
      seoIntent: "smashed potatoes recept, křupavé pečené brambory, rozbité brambory",
    },
  },
  {
    id: "shakshuka",
    topic: "shakshuka",
    workingConcept: "Pikantní šakšuka s pečenou paprikou, rajčaty, římským kmínem a tekutým žloutkem",
    ingredients: ["vejce", "drcená rajčata", "červená paprika", "cibule", "česnek", "římský kmín", "uzená paprika", "chilli", "petrželka"],
    techniques: ["dušení", "restování"],
    cuisine: "blízkovýchodní",
    tags: ["snídaně", "brunch", "večeře", "vegetariánské", "z jednoho hrnce"],
    vegetarian: true,
    briefTemplate: {
      originalAngle: "Hustá kořeněná omáčka z redukovaných paprik a rajčat s vejci pošírovanými přímo v litinové pánvi a bylinkovým finišem.",
      differentiation: "Katalog obsahuje míchaná tofu vajíčka a snídaňové misky, ale šakšuka jako světový bezmasý brunchový král chybí.",
      affiliateOpportunities: ["Litinová pánev Staub / Lodge", "Čerstvě mletý římský kmín a harissa pasta"],
      cateringUsage: "Skvělé pro privátní brunche a živé cooking show (příprava před hosty na velké pánvi).",
      socialHook: "Roztržení křupavého chleba a ponoření do tekutého žloutku obklopeného bublající sytě červenou omáčkou.",
      cookbookChapter: "Kapitola 2: Líná rána & Vydatné víkendové brunche",
      newsletterHook: "Víkendová královna pánve: Pravá pikantní šakšuka, která provoní celý byt.",
      seoIntent: "šakšuka recept, pravá shakshuka s vejci, bezmasá snídaně",
    },
  },
  {
    id: "cauliflower",
    topic: "cauliflower",
    workingConcept: "Křupavý pečený květák s tahini omáčkou, granátovým jablkem a za'atarem",
    ingredients: ["květák", "tahini", "citron", "česnek", "granátové jablko", "zaatar", "olivový olej"],
    techniques: ["pečení", "karamelizace"],
    cuisine: "levantská",
    tags: ["hlavní jídlo", "salát", "veganské", "bezlepkové"],
    vegetarian: true,
    briefTemplate: {
      originalAngle: "Květák pečený do oříškově hnědé barvy v kontrastu s krémovým citrónovým tahini dresinkem a svěžími rubínovými zrníčky granátového jablka.",
      differentiation: "V katalogu je květáková polévka a indické curry aloo gobi, ale schází moderní pečený květák v levantském stylu.",
      affiliateOpportunities: ["Prémiová sezamová pasta tahini", "Koření za'atar z Blízkého východu"],
      cateringUsage: "Bestseller na vegetariánských rautech — drží texturu hodiny, vizuálně ohromující na velkých keramických mísách.",
      socialHook: "Celý karamelizovaný květák polévaný hustou tahini omáčkou a posypaný granátovým jablkem.",
      cookbookChapter: "Kapitola 3: Zelenina jako hlavní hrdina talíře",
      newsletterHook: "Květák už nikdy nebudete vařit ve vodě: Křupavá pečená verze s tahini a granátovým jablkem.",
      seoIntent: "pečený květák recept, pečený květák s tahini, levantský květák",
    },
  },
  {
    id: "mediterranean_sharing",
    topic: "mediterranean sharing",
    workingConcept: "Středomořský sharing talíř s marinovaným lilkem, kalamata olivami a rozmarýnovou focacciou",
    ingredients: ["lilek", "olivy kalamata", "sušená rajčata", "hladká mouka", "extra panenský olivový olej", "rozmarýn", "česnek"],
    techniques: ["pečení", "marinování", "grilování"],
    cuisine: "středomořská",
    tags: ["na sdílení", "raut", "předkrm", "veganské", "párty"],
    vegetarian: true,
    briefTemplate: {
      originalAngle: "Koncept společného stolování (conviviality) — teplé pečivo, marinovaná zelenina plná slunce a intenzivní olivové tóny.",
      differentiation: "Katalog se soustředí na jednotlivé talíře; kompletní sdílený mezze stůl pro party zatím chybí.",
      affiliateOpportunities: ["Pravý italský olivový olej", "Kameninové misky na tapas"],
      cateringUsage: "Klíčový produkt Matoušova cateringu pro uvítací recepce a firemní večírky.",
      socialHook: "Trhání nadýchané pórovité focaccie a namáčení v bylinkovém oleji na sluncem prozářeném stole.",
      cookbookChapter: "Kapitola 6: Hostina pro přátele & Velké stoly",
      newsletterHook: "Jak uspořádat bezmasý večírek pro 10 lidí bez stresu u sporáku: Středomořský mezze stůl.",
      seoIntent: "středomořské předkrmy, mezze talíř recept, pohoštění pro návštěvu",
    },
  },
  {
    id: "eggplant",
    topic: "eggplant",
    workingConcept: "Pečený lilek s česnekovým jogurtem, chilli máslem a piniovými oříšky",
    ingredients: ["lilek", "řecký jogurt", "česnek", "máslo", "chilli vločky", "piniové oříšky", "koriandr"],
    techniques: ["pečení", "karamelizace"],
    cuisine: "blízkovýchodní",
    tags: ["hlavní jídlo", "teplý předkrm", "vegetariánské", "bezlepkové"],
    vegetarian: true,
    briefTemplate: {
      originalAngle: "Rozplývající se dužina pomalu pečeného lilku přelitá pálivým chilli máslem a chlazeným česnekovým jogurtem.",
      differentiation: "V katalogu je lilkový guláš a pečený lilek se sýrem; tato varianta v tureckém stylu (podobná Çılbır) nabízí zcela jiný chuťový profil.",
      affiliateOpportunities: ["Kvalitní piniové oříšky", "Turecké chilli vločky Pul Biber / Aleppo"],
      cateringUsage: "Elegantní teplý chod na svatební a zážitková menu.",
      socialHook: "Lžíce zakrajující do měkkého máslového lilku, po kterém stéká zářivě oranžové chilli máslo.",
      cookbookChapter: "Kapitola 3: Zelenina jako hlavní hrdina talíře",
      newsletterHook: "Jak proměnit obyčejný lilek v nejchutnější jídlo týdne: Pečený lilek s chilli máslem a jogurtem.",
      seoIntent: "pečený lilek recept, lilek s jogurtem a chilli máslem",
    },
  },
  {
    id: "vegetarian_brunch",
    topic: "vegetarian brunch",
    workingConcept: "Kukuřično-bylinkové lívance s avokádem, pošírovaným vejcem a chipotle jogurtem",
    ingredients: ["kukuřice", "hladká mouka", "vejce", "avokádo", "řecký jogurt", "chipotle", "limetka", "koriandr"],
    techniques: ["smažení", "restování"],
    cuisine: "mexická",
    tags: ["brunch", "snídaně", "vegetariánské"],
    vegetarian: true,
    briefTemplate: {
      originalAngle: "Křupavé sladkoslané kukuřičné placky s čerstvou bylinkovou chutí a krémovým avokádovým toppingem.",
      differentiation: "V katalogu máme sladké lívance a kaše; slaný zeleninový brunch je výraznou mezerou.",
      affiliateOpportunities: ["Litinová palačinková pánev", "Chipotle pasta v adobo omáčce"],
      cateringUsage: "Ideální pro brunchové eventy a dopolední konference.",
      socialHook: "Rozkrojení pošírovaného vejce položeného na horkém kukuřičném lívanci.",
      cookbookChapter: "Kapitola 2: Líná rána & Vydatné víkendové brunche",
      newsletterHook: "Slaný víkendový brunch: Kukuřičné placičky s avokádem a ztraceným vejcem.",
      seoIntent: "slané lívance recept, kukuřičné placky se sýrem, vegetariánský brunch",
    },
  },
  {
    id: "mushroom_pasta",
    topic: "mushroom pasta",
    workingConcept: "Těstoviny s krémovou omáčkou z lesních hub, tymiánem a parmazánem",
    ingredients: ["těstoviny", "žampiony", "houby", "česnek", "smetana", "parmazán", "tymián", "máslo"],
    techniques: ["restování", "dušení"],
    cuisine: "italská",
    tags: ["těstoviny", "večeře", "rychlé", "vegetariánské"],
    vegetarian: true,
    // Note: high overlap with existing catalog recipes
  },
  {
    id: "lentils",
    topic: "lentils",
    workingConcept: "Klasická hustá čočková polévka se zeleninou",
    ingredients: ["čočka", "mrkev", "cibule", "česnek", "brambory", "majoránka"],
    techniques: ["vaření"],
    cuisine: "česká bezmasá",
    tags: ["polévka", "oběd", "levné", "vegetariánské"],
    vegetarian: true,
    // Note: very high overlap with "cockova-polevka-uzena-paprika" in catalog
  },
  {
    id: "varenyky",
    topic: "varenyky",
    workingConcept: "Tradiční vareniky s bramborovo-cibulovou náplní a kysanou smetanou",
    ingredients: ["hladká mouka", "brambory", "cibule", "máslo", "zakysaná smetana"],
    techniques: ["vaření", "restování"],
    cuisine: "východoevropská",
    tags: ["hlavní jídlo", "comfort food", "vegetariánské"],
    vegetarian: true,
  },
];

/**
 * Executes the Local Profitability Intelligence Run against the live catalog
 */
export async function runLocalProfitabilityEvaluation(): Promise<ContentOpportunity[]> {
  const engine = new ContentGapEngine();
  const opportunities: ContentOpportunity[] = [];

  for (const item of TARGET_10_THEMES) {
    // 1. Build canonical research signal
    const normalizedIngredients = item.ingredients.map(ing => {
      const norm = normalizeIngredient(ing, "cs");
      return { canonicalName: norm.canonicalName, originalName: ing };
    });

    const signal: ExternalRecipeSignal = {
      provider: "local-evaluator",
      externalId: item.id,
      title: item.workingConcept,
      normalizedIngredients,
      tags: item.tags,
      techniques: item.techniques,
      cuisine: item.cuisine,
      vegetarian: item.vegetarian,
      fetchedAt: new Date().toISOString(),
      provenance: { provider: "local-evaluator" },
      publicationPolicy: "INTERNAL_ONLY",
    };

    // 2. Run through ContentGapEngine (computes similarity against actual 130+ recipes)
    const resultList = await engine.analyzeGaps([signal]);
    if (resultList.length > 0) {
      const opp = resultList[0];

      // 3. Attach full original content brief for CREATE candidates
      if (opp.decision === "CREATE" && item.briefTemplate) {
        opp.originalContentBrief = {
          workingTitle: item.workingConcept,
          craveSignals: opp.craveSignals || [],
          coreIngredients: item.ingredients,
          originalAngle: item.briefTemplate.originalAngle,
          differentiationFromCatalog: item.briefTemplate.differentiation,
          affiliateOpportunities: item.briefTemplate.affiliateOpportunities,
          cateringUsage: item.briefTemplate.cateringUsage,
          socialHook: item.briefTemplate.socialHook,
          cookbookChapter: item.briefTemplate.cookbookChapter,
          newsletterHook: item.briefTemplate.newsletterHook,
          seoIntent: item.briefTemplate.seoIntent,
          publicationPolicy: "ORIGINAL_CONTENT_REQUIRED",
        };
      }

      opportunities.push(opp);
    }
  }

  // Sort strictly by profit opportunity score descending
  return opportunities.sort((a, b) => (b.profitScore?.score || b.score) - (a.profitScore?.score || a.score));
}
