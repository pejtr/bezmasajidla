// ============================================================
// BEZMASAJIDLA.CZ — Průvodci (Guides) Data
// SEO-optimized educational articles about vegan/vegetarian Prague
// ============================================================

export interface GuideSection {
  id: string;
  title: string;
  content: string; // Rich HTML-safe markdown text
  restaurantSlugs?: string[]; // Related restaurants to link
  recipeSlugs?: string[]; // Related recipes to link
  image?: string;
  imageAlt?: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string; // Meta description for SEO (max 160 chars)
  category: "mapa" | "zacatecnici" | "sezona" | "kultura" | "zdravi" | "nakupy";
  categoryLabel: string;
  readingTime: number; // minutes
  publishedAt: string; // ISO date
  updatedAt: string;
  author: string;
  heroImage: string;
  heroImageAlt: string;
  thumbnailImage: string;
  tags: string[];
  featured: boolean;
  sections: GuideSection[];
  relatedGuides?: string[]; // slugs of related guides
}

export const guideCategories = [
  { value: "vse", label: "Vše", icon: "📚" },
  { value: "mapa", label: "Mapa Prahy", icon: "🗺️" },
  { value: "zacatecnici", label: "Pro začátečníky", icon: "🌱" },
  { value: "sezona", label: "Sezonní průvodce", icon: "🍂" },
  { value: "kultura", label: "Kultura & Trendy", icon: "🎭" },
  { value: "zdravi", label: "Zdraví & Výživa", icon: "💚" },
  { value: "nakupy", label: "Nákupy & Trhy", icon: "🛒" },
];

export const guides: Guide[] = [
  {
    id: "g1",
    slug: "veganska-praha-po-ctvrtich",
    title: "Veganská Praha po čtvrtích",
    subtitle: "Kompletní průvodce bezmasou gastronomií v každé pražské čtvrti",
    description:
      "Průvodce nejlepšími veganskými a vegetariánský restauracemi v Praze podle čtvrtí — Vinohrady, Žižkov, Holešovice, Smíchov, Malá Strana a centrum.",
    category: "mapa",
    categoryLabel: "Mapa Prahy",
    readingTime: 12,
    publishedAt: "2026-03-01",
    updatedAt: "2026-03-09",
    author: "Redakce Bezmasá Jídla",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guides-hero-prague-vegan-3nubnT5HHdRNasnpPsFKuh.webp",
    heroImageAlt: "Veganské restaurace v Praze — pohled na město",
    thumbnailImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guides-vinohrady-neighborhood-diK6Pv7GSouisUrbG2JATM.webp",
    tags: [
      "Praha",
      "Vinohrady",
      "Žižkov",
      "Holešovice",
      "Smíchov",
      "veganské restaurace",
      "vegetariánské restaurace",
      "průvodce",
    ],
    featured: true,
    sections: [
      {
        id: "uvod",
        title: "Praha — hlavní město bezmasé gastronomie",
        content: `Praha patří v posledních letech k nejrychleji rostoucím veganským metropolím Evropy. Podle průzkumu HappyCow z roku 2025 se Praha umístila na 8. místě v žebříčku nejveganštějších měst světa — před Berlínem, Amsterdamem nebo Barcelonou. Počet čistě veganských a vegetariánských podniků vzrostl za posledních pět let o více než 60 %.

Ale kde přesně v Praze hledat ta nejlepší bezmasá jídla? Každá čtvrť má svůj vlastní charakter a svou vlastní scénu. Vinohrady jsou domovem elegantních bistro s mezinárodní kuchyní, Žižkov nabízí autentické hospůdky s veganskými variantami tradičních pokrmů, Holešovice jsou centrem kreativní gastronomie a Smíchov překvapí dostupnými cenami. Tento průvodce vás provede všemi klíčovými čtvrtěmi a pomůže vám najít to pravé místo pro každou příležitost.`,
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guides-hero-prague-vegan-3nubnT5HHdRNasnpPsFKuh.webp",
        imageAlt: "Pražské panorama s výhledem na Hradčany",
      },
      {
        id: "vinohrady",
        title: "Vinohrady — srdce pražské vegan scény",
        content: `Vinohrady jsou bezpochyby nejrozvinutější čtvrtí pro bezmasou gastronomii v Praze. Tato elegantní čtvrť s krásnou secesní architekturou přitahuje mladé profesionály, expaty a foodie, kteří vyžadují kvalitu a originalitu. Vinohradská třída a okolní ulice jsou doslova lemovány veganskými a vegan-friendly podniky.

**Co zde najdete:** Vinohrady nabízejí nejširší výběr — od rychlých veganských burgerů přes sofistikované bistro až po fine dining. Charakteristické pro tuto čtvrť je důraz na kvalitní suroviny, sezónní menu a mezinárodní inspiraci. Italská, asijská, středomořská i česká kuchyně — vše v bezmasé verzi.

**Nejlepší čas k návštěvě:** Vinohrady jsou živé celý týden. V pracovní dny je ideální polední menu — většina restaurací nabízí výhodné sety za 150–200 Kč. O víkendech jsou populární brunchové menu, které začínají kolem 10:00 a trvají do 14:00.

**Tip redakce:** Procházka od náměstí Míru přes Mánesovu ulici až k Riegrovým sadům vám umožní navštívit hned několik skvělých podniků v jednom odpoledni. Zakončte procházku v Riegrových sadech, kde v létě funguje oblíbená zahradní restaurace s veganskými možnostmi.`,
        restaurantSlugs: ["kro-kitchen-vinohrady", "beas-dhaba-vinohrady"],
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guides-vinohrady-neighborhood-diK6Pv7GSouisUrbG2JATM.webp",
        imageAlt: "Vinohradská třída s kavárnami a restauracemi",
      },
      {
        id: "zizkov",
        title: "Žižkov — autentická čtvrť s překvapením",
        content: `Žižkov je čtvrť kontrastů. Historicky dělnická čtvrť s hustotou hospod na obyvatele, která nemá v Praze obdoby, se v posledních letech proměňuje. Vedle tradičních pivnic přibývají kreativní kavárny, bistra a restaurace, které nabízejí bezmasou kuchyni s autentickým žižkovským charakterem — bez přehnaného hipsterství a za rozumné ceny.

**Co zde najdete:** Žižkov je ideální pro ty, kdo hledají autentičnost a dostupnost. Veganské varianty tradičních českých pokrmů, mezinárodní street food a útulné kavárny s domácím pečivem. Ceny jsou zde obecně nižší než ve Vinohradech nebo v centru.

**Skryté klenoty:** Žižkov skrývá řadu malých podniků, které nejsou v turistických průvodcích — rodinné restaurace s domácí kuchyní, kde veganská varianta vznikla přirozeně z lásky k vaření, ne jako marketingový tah. Hledejte je v bočních ulicích za Televizní věží.

**Tip redakce:** Žižkovský Vítkov park je ideální místo pro piknik s jídlem z místních podniků. V létě zde probíhají různé festivaly a trhy s lokálními producenty.`,
        restaurantSlugs: [],
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guides-zizkov-neighborhood-f9Anu5gK53KprRo2HyUsqd.webp",
        imageAlt: "Žižkovská televizní věž a okolní zástavba",
      },
      {
        id: "holesovice",
        title: "Holešovice — kreativní centrum nové Prahy",
        content: `Holešovice jsou v posledních pěti letech nejdynamičtěji se rozvíjející čtvrtí v Praze. Bývalé průmyslové objekty se proměnily v kreativní huby, galerie, coworkingová centra a — samozřejmě — gastronomické podniky. Holešovice jsou domovem některých nejodvážnějších kulinářských konceptů v Praze.

**Co zde najdete:** Holešovice jsou rájem pro experimentátory. Fermentované nápoje, raw food, zero-waste vaření, pop-up restaurace s měnícím se menu — tato čtvrť neustále překvapuje. Mnoho podniků spolupracuje s lokálními farmáři a výrobci, takže sezónnost a původ surovin jsou zde samozřejmostí.

**Centrum Holešovice (Letná):** Letenské sady jsou oblíbeným místem pro odpočinek a v okolí najdete řadu skvělých podniků. Letenský zámeček a okolní kavárny nabízejí výhledy na Prahu a veganské menu.

**Průmyslové objekty:** Pražská tržnice (Holešovická tržnice) hostí pravidelné farmářské trhy a food festivaly, kde lokální producenti nabízejí veganské produkty, čerstvé ovoce a zeleninu, artisanský chléb a fermentované potraviny.

**Tip redakce:** Navštivte Holešovice v sobotu dopoledne — farmářský trh v Holešovické tržnici je nejlepší v Praze a okolní kavárny jsou plné místních obyvatel, ne turistů.`,
        restaurantSlugs: [],
        image: "",
        imageAlt: "Holešovická tržnice a kreativní čtvrť",
      },
      {
        id: "smichov-andel",
        title: "Smíchov a Anděl — dostupná gastronomie pro každého",
        content: `Smíchov je čtvrť, která bývala přehlížena, ale v posledních letech zažívá gastronomický boom. Oblast kolem Anděla je jedním z nejrušnějších obchodních center v Praze a vedle nákupních center zde vyrostla pestrá gastronomická scéna s velmi dostupnými cenami.

**Co zde najdete:** Smíchov nabízí nejlepší poměr cena/kvalita v Praze. Veganské restaurace zde jsou o 20–30 % levnější než ve Vinohradech nebo v centru, přičemž kvalita je srovnatelná. Silná asijská komunita v okolí přinesla autentické vietnamské, thajské a čínské podniky s výbornými veganskými možnostmi.

**Vietnamská kuchyně:** Smíchov a okolní čtvrti jsou domovem nejlepší vietnamské kuchyně v Praze. Pho bo (hovězí polévka) má vždy veganskou variantu, banh mi sendviče jsou levné a výborné a fresh spring rolls jsou ideální lehký oběd.

**Tip redakce:** Ulice Nádražní a Plzeňská skrývají řadu malých asijských restaurací, které nejsou na žádném turistickém radaru. Hledejte místa, kde sedí místní — to je nejlepší záruka kvality a autenticity.`,
        restaurantSlugs: [],
        image: "",
        imageAlt: "Anděl — obchodní a gastronomické centrum Smíchova",
      },
      {
        id: "centrum-stare-mesto",
        title: "Centrum a Staré Město — turistické pasti a skryté klenoty",
        content: `Centrum Prahy je pro veganské stravování dvojsečné. Na jedné straně zde najdete turistické restaurace s předraženými a průměrnými jídly, na druhé straně jsou zde skutečné gastronomické klenoty, které obstojí i v mezinárodním srovnání.

**Jak se orientovat:** Klíčem k úspěchu v centru je vyhnout se restauracím přímo na Václavském náměstí, Staroměstském náměstí a v turistických uličkách. Odbočte do bočních ulic — Dlouhá, Dušní, Rybná nebo Benediktská skrývají skvělé podniky za rozumné ceny.

**Staré Město:** Kolem Náměstí Republiky a v okolí Palladium najdete moderní podniky zaměřené na místní zákazníky. Ceny jsou zde sice vyšší než v okrajových čtvrtích, ale kvalita tomu odpovídá.

**Malá Strana:** Tato historická čtvrť pod Hradčany je turisticky vytížená, ale skrývá několik autentických podniků. Hledejte restaurace v uličkách mimo hlavní turistické trasy — Nerudova ulice a okolí Malostranského náměstí mají překvapivě dobrou veganskou nabídku.

**Tip redakce:** Pokud jste v centru a hledáte rychlé a levné veganské jídlo, Beas Dhaba na Týnské ulici je nejlepší volba — autentická indická kuchyně za studentské ceny, oblíbená místními i turisty.`,
        restaurantSlugs: ["beas-dhaba-vinohrady"],
        image: "",
        imageAlt: "Staroměstské náměstí v Praze",
      },
      {
        id: "prakticke-tipy",
        title: "Praktické tipy pro veganské cestování po Praze",
        content: `**Aplikace a weby:** Bezmasájídla.cz je váš nejlepší průvodce — filtrujte podle čtvrti, typu kuchyně a dietních preferencí. HappyCow je mezinárodní alternativa s recenzemi od cestovatelů.

**Jazyk:** Čeština má specifické výrazy pro veganskou kuchyni. "Veganský" znamená bez živočišných produktů, "vegetariánský" bez masa ale s vejci a mléčnými výrobky. "Bezmasý" doslova znamená "bez masa" — ale pozor, bezmasé jídlo může obsahovat vejce nebo sýr. Vždy se zeptejte nebo hledejte označení "vegan".

**Ceny a platba:** Praha je ve srovnání se Západní Evropou stále cenově dostupná. Polední menu v restauraci stojí 150–250 Kč (6–10 EUR), večerní hlavní jídlo 250–450 Kč (10–18 EUR). Většina restaurací přijímá karty, ale mějte u sebe i hotovost pro malé kavárny a trhy.

**Sezonnost:** Česká kuchyně je silně sezonní. Jaro přináší chřest a mladou zeleninu, léto jahody a rajčata, podzim houby a dýně, zima kořenovou zeleninu a zelí. Restaurace, které pracují se sezonními surovinami, jsou zpravidla kvalitnější.

**Farmářské trhy:** Praha má několik skvělých farmářských trhů — Holešovická tržnice (sobota), Náměstí Jiřího z Poděbrad (středa a sobota), Manifesto Market (léto). Trhy jsou ideální pro nákup čerstvých surovin a ochutnávky lokálních produktů.`,
        image: "",
        imageAlt: "Farmářský trh v Praze s čerstvou zeleninou",
      },
      {
        id: "zaver",
        title: "Praha vás překvapí",
        content: `Veganská Praha je živá, rozmanitá a neustále se rozvíjí. Ať už hledáte rychlý oběd za 150 Kč nebo slavnostní večeři v elegantním bistru, Praha má co nabídnout. Klíčem je vědět, kde hledat — a právě k tomu slouží tento průvodce.

Náš tým pravidelně aktualizuje databázi restaurací a přidává nové podniky. Pokud znáte skvělou veganskou restauraci, která v naší databázi chybí, dejte nám vědět — společně budujeme nejkomplexnější průvodce bezmasou Prahou.

**Šťastné hledání a dobrou chuť!**`,
        image: "",
        imageAlt: "Veganský talíř s barevnou zeleninou",
      },
    ],
    relatedGuides: [],
  },
  {
    id: "g2",
    slug: "jak-zacit-s-rostlinnou-stravou",
    title: "Jak začít s rostlinnou stravou",
    subtitle: "Praktický průvodce pro začátečníky — bez dogmat, s chutí",
    description:
      "Chcete omezit maso, ale nevíte jak začít? Tento průvodce vám ukáže praktické kroky, tipy na nákup a první recepty pro přechod na rostlinnou stravu.",
    category: "zacatecnici",
    categoryLabel: "Pro začátečníky",
    readingTime: 8,
    publishedAt: "2026-03-05",
    updatedAt: "2026-03-09",
    author: "Redakce Bezmasá Jídla",
    heroImage: "",
    heroImageAlt: "Barevné rostlinné jídlo — zelenina, luštěniny, ořechy",
    thumbnailImage: "",
    tags: [
      "začátečníci",
      "rostlinná strava",
      "veganství",
      "vegetariánství",
      "jak začít",
      "tipy",
    ],
    featured: true,
    sections: [
      {
        id: "uvod",
        title: "Proč přejít na rostlinnou stravu?",
        content: `Přechod na rostlinnou stravu je jedním z nejefektivnějších kroků, které může jednotlivec udělat pro své zdraví i pro planetu. Výzkumy ukazují, že rostlinná strava snižuje riziko kardiovaskulárních chorob, cukrovky 2. typu a některých typů rakoviny. Zároveň má výrazně nižší uhlíkovou stopu než strava bohatá na maso.

Ale začít nemusí být těžké. Tento průvodce vám ukáže, jak postupovat krok za krokem — bez tlaku, bez dogmat a s důrazem na chuť a radost z jídla.`,
        image: "",
        imageAlt: "Zdravá rostlinná snídaně s ovocem a ořechy",
      },
      {
        id: "prvni-kroky",
        title: "První kroky — začněte pomalu",
        content: `Nejčastější chybou začátečníků je snaha změnit vše najednou. Výzkumy ukazují, že postupná změna je udržitelnější než radikální přechod. Zkuste začít s jedním bezmasým dnem v týdnu — třeba "Meatless Monday" — a postupně přidávejte další.

**Praktický plán na první měsíc:**
- Týden 1: Jeden bezmasý den v týdnu
- Týden 2: Dva bezmasé dny, zkuste nový recept
- Týden 3: Tři bezmasé dny, navštivte veganskou restauraci
- Týden 4: Zhodnoťte, co vám chutná, a plánujte dál

Klíčové je zaměřit se na to, co přidáváte (nové chutě, nové suroviny), ne na to, co odebíráte.`,
        recipeSlugs: ["buddha-bowl-s-pechenou-zeleninou", "cizrnove-curry-s-kokosovym-mlekem"],
        image: "",
        imageAlt: "Týdenní plán bezmasého stravování",
      },
      {
        id: "zakladni-suroviny",
        title: "Základní suroviny rostlinné kuchyně",
        content: `Rostlinná kuchyně stojí na několika základních skupinách surovin, které by měly být vždy po ruce:

**Luštěniny** jsou základem bílkovin v rostlinné stravě. Čočka (červená, zelená, beluga), cizrna, fazole (černé, bílé, kidney) a hrách jsou levné, výživné a všestranné. Kupujte je v konzervách pro rychlou přípravu nebo sušené pro ekonomičtější variantu.

**Obiloviny a pseudoobiloviny:** Quinoa, pohanka, jáhly a bulgur jsou výborné alternativy k rýži a těstovinám. Jsou bohaté na bílkoviny a minerály.

**Ořechy a semínka** dodávají zdravé tuky a bílkoviny. Kešu, mandle, vlašské ořechy, dýňová a slunečnicová semínka — přidávejte je do salátů, smoothie nebo jezte jako svačinu.

**Tofu a tempeh** jsou fermentované sójové produkty s vysokým obsahem bílkovin. Tofu je neutrální a přijímá chuť koření, tempeh má oříškovou chuť a pevnější texturu.

**Zelenina a ovoce:** Zaměřte se na sezónní a lokální produkci. Tmavá listová zelenina (špenát, kapusta, mangold) je bohatá na železo a vápník.`,
        image: "",
        imageAlt: "Základní suroviny rostlinné kuchyně — luštěniny, ořechy, zelenina",
      },
    ],
    relatedGuides: ["veganska-praha-po-ctvrtich"],
  },
  {
    id: "g3",
    slug: "sezonni-pruvodce-bezmase-kuchyne",
    title: "Sezonní průvodce bezmasé kuchyně",
    subtitle: "Co vařit v každém ročním období — od jara do zimy",
    description:
      "Sezonní průvodce bezmasou kuchyní — nejlepší suroviny a recepty pro každé roční období. Jaro, léto, podzim a zima v rostlinné kuchyni.",
    category: "sezona",
    categoryLabel: "Sezonní průvodce",
    readingTime: 10,
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-09",
    author: "Redakce Bezmasá Jídla",
    heroImage: "",
    heroImageAlt: "Čtyři roční období — sezonní zelenina a ovoce",
    thumbnailImage: "",
    tags: [
      "sezonní vaření",
      "jaro",
      "léto",
      "podzim",
      "zima",
      "lokální suroviny",
      "česká kuchyně",
    ],
    featured: false,
    sections: [
      {
        id: "jaro",
        title: "Jaro — probuzení chutí",
        content: `Jaro je nejradostnějším obdobím pro kuchaře. Po zimě plné kořenové zeleniny a zelí přicházejí první čerstvé suroviny — a s nimi nová energie v kuchyni.

**Jarní suroviny:** Chřest (duben–červen) je královnou jara — grilovaný s citronem a olivovým olejem je dokonalý. Mladý špenát, ředkvičky, jarní cibulka, hrášek a první jahody. Kopřivy jsou podceňovanou surovinou — kopřivová polévka nebo kopřivové rizoto jsou jarní delikatesy.

**Jarní recepty:** Chřestové risotto, špenátová frittata, hrášková polévka s mátou, kopřivové gnocchi.`,
        recipeSlugs: [],
        image: "",
        imageAlt: "Jarní chřest s citronem",
      },
      {
        id: "leto",
        title: "Léto — hojnost a barvy",
        content: `Léto je obdobím hojnosti. Trhy přetékají rajčaty, paprikami, cuketami, kukuřicí a ovocem. Je to nejlepší čas pro syrovou kuchyni, grilování a lehká jídla.

**Letní suroviny:** Rajčata (cherry, beefsteak, heirloom), papriky, cukety, lilek, kukuřice, borůvky, maliny, broskve, meruňky. Bylinky jsou v létě na vrcholu — bazalka, oregano, tymián, koriandr.

**Letní recepty:** Gazpacho, caprese salát, grilovaná zelenina s hummusem, letní Buddha bowl, rajčatová bruschetta, zeleninové špízy.`,
        recipeSlugs: ["buddha-bowl-s-pechenou-zeleninou"],
        image: "",
        imageAlt: "Letní zelenina — rajčata, papriky, cukety",
      },
      {
        id: "podzim",
        title: "Podzim — hřejivé chutě",
        content: `Podzim přináší nejbohatší paletu chutí — houby, dýně, jablka, hrušky, ořechy a kořenová zelenina. Je to čas pomalého vaření, hřejivých polévek a pečených pokrmů.

**Podzimní suroviny:** Dýně (hokkaido, butternut, muškátová), houby (hříbky, lišky, žampiony), jablka, hrušky, švestky, vlašské ořechy, kaštany, kořenová zelenina (mrkev, petržel, celer, pastinák), kapusta a zelí.

**Podzimní recepty:** Dýňová polévka s zázvorem, houbové rizoto, pečená hokkaido dýně s quinoou, jablečný crumble, zelná polévka s klobásou ze sejtanu.`,
        recipeSlugs: [],
        image: "",
        imageAlt: "Podzimní dýně a houby",
      },
      {
        id: "zima",
        title: "Zima — hloubka a pohodlí",
        content: `Zima je čas pro hluboké, výživné pokrmy. Kořenová zelenina, luštěniny, fermentované potraviny a teplé nápoje jsou základem zimní rostlinné kuchyně.

**Zimní suroviny:** Kořenová zelenina (mrkev, řepa, celer, topinambur), zelí a kysané zelí, luštěniny (čočka, fazole, hrách), citrusy (pomeranče, grapefruity, mandarinky), sušené ovoce a ořechy.

**Zimní recepty:** Čočková polévka s uzenou paprikou, veganský guláš s knedlíky, pečená řepa s kozím sýrem (nebo tofu), zimní Buddha bowl s pečenou kořenovou zeleninou, horká čokoláda s rostlinným mlékem.`,
        recipeSlugs: ["cesnekova-polevka-s-krutonky"],
        image: "",
        imageAlt: "Zimní polévka s kořenovou zeleninou",
      },
    ],
    relatedGuides: ["veganska-praha-po-ctvrtich", "jak-zacit-s-rostlinnou-stravou"],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter((g) => g.featured);
}

export function getGuidesByCategory(category: string): Guide[] {
  if (category === "vse") return guides;
  return guides.filter((g) => g.category === category);
}
