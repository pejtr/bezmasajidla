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
    readingTime: 12,
    publishedAt: "2026-03-05",
    updatedAt: "2026-03-09",
    author: "Redakce Bezmasá Jídla",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guide-plant-based-hero-2ws7uLpoJDooM6xpuWUHyZ.webp",
    heroImageAlt: "Barevné rostlinné jídlo — zelenina, luštěniny, ořechy na dřevěném stole",
    thumbnailImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guide-plant-based-hero-2ws7uLpoJDooM6xpuWUHyZ.webp",
    tags: [
      "začátečníci",
      "rostlinná strava",
      "veganství",
      "vegetariánství",
      "jak začít",
      "tipy",
      "výživa",
      "zdraví",
    ],
    featured: true,
    sections: [
      {
        id: "uvod",
        title: "Proč přejít na rostlinnou stravu?",
        content: `Přechod na rostlinnou stravu je jedním z nejefektivnějších kroků, které může jednotlivec udělat pro své zdraví i pro planetu. Výzkumy ukazují, že rostlinná strava snižuje riziko kardiovaskulárních chorob, cukrovky 2. typu a některých typů rakoviny. Zároveň má výrazně nižší uhlíkovou stopu než strava bohatá na maso.

Ale začít nemusí být těžké. Tento průvodce vám ukáže, jak postupovat krok za krokem — bez tlaku, bez dogmat a s důrazem na chuť a radost z jídla. Rostlinná strava není o odříkání — je o objevování nových chutí, textur a kulinářských tradic z celého světa.

Česká kuchyně má přitom bohatou tradici bezmasých pokrmů — od čočkové polévky přes bramborové knedlíky až po svíčkovou ze sejtanu. Přechod na rostlinnou stravu neznamená vzdát se tradice, ale obohatit ji.`,
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guide-plant-based-hero-2ws7uLpoJDooM6xpuWUHyZ.webp",
        imageAlt: "Hojnost čerstvé zeleniny, ovoce a luštěnin na dřevěném stole",
      },
      {
        id: "prvni-kroky",
        title: "První kroky — začněte pomalu a bez tlaku",
        content: `Nejčastější chybou začátečníků je snaha změnit vše najednou. Výzkumy ukazují, že postupná změna je udržitelnější než radikální přechod. Zkuste začít s jedním bezmasým dnem v týdnu — třeba "Meatless Monday" — a postupně přidávejte další.

**Praktický plán na první měsíc:**

V prvním týdnu si vyberte jeden den v týdnu jako bezmasý. Uvařte jídlo, které již znáte, jen bez masa — například těstovinovou omáčku s houbami místo bolognese nebo zeleninovou polévku. Cílem je zjistit, že bezmasé vaření není složité.

Ve druhém týdnu přidejte druhý bezmasý den a zkuste jeden nový recept — třeba čočkové curry nebo cizrnový salát. Navštivte obchod se zdravou výživou nebo bio sekci v supermarketu a prozkoumejte nové suroviny.

Ve třetím týdnu navštivte veganskou restauraci v Praze. Nechte se inspirovat profesionálními kuchaři — jejich kreativita vám ukáže, co je s rostlinnou kuchyní možné. Beas Dhaba, KRO Kitchen nebo Maitrea jsou skvělé volby pro první zkušenost.

Ve čtvrtém týdnu zhodnoťte, co vám chutná a co ne. Rostlinná strava je individuální — někdo miluje tofu, jiný preferuje luštěniny. Klíčové je najít suroviny a recepty, které vám skutečně chutnají, ne ty, které jsou "správné".`,
        recipeSlugs: ["buddha-bowl-s-pechenou-zeleninou", "cizrnove-curry-s-kokosovym-mlekem"],
        image: "",
        imageAlt: "Týdenní plán bezmasého stravování",
      },
      {
        id: "zakladni-suroviny",
        title: "Zásobte spíž: základní suroviny rostlinné kuchyně",
        content: `Dobře zásobená spíž je základem úspěšné rostlinné kuchyně. Když máte správné suroviny po ruce, uvařit zdravé a chutné jídlo trvá 20–30 minut. Investice do základního zásobení se vyplatí — tyto suroviny mají dlouhou trvanlivost a jsou základem desítek receptů.

**Luštěniny** jsou základem bílkovin v rostlinné stravě. Červená čočka se uvaří za 15 minut bez namáčení a je ideální pro polévky a dhal. Cizrna v konzervě je hotová okamžitě — přidejte ji do salátů, uvařte z ní hummus nebo ji opečte jako křupavou svačinu. Fazole (černé, bílé, kidney) jsou výborné do chilli, polévek a mexické kuchyně.

**Obiloviny a pseudoobiloviny** tvoří základ každého jídla. Quinoa je kompletní bílkovina — obsahuje všechny esenciální aminokyseliny. Pohanka je bezlepková a výborná do kaší i salátů. Bulgur se připraví za 10 minut přelitím vroucí vodou. Celozrnná rýže a těstoviny jsou spolehlivou základnou.

**Ořechy a semínka** dodávají zdravé tuky, bílkoviny a minerály. Kešu rozmixované s vodou tvoří základ smetanových omáček. Tahini (sezamová pasta) je klíčová surovina pro hummus a dresinky. Dýňová a slunečnicová semínka jsou výborná jako topping na saláty a polévky.

**Konzervy a trvanlivé produkty:** Konzervovaná rajčata jsou základem omáček, polévek a dušených pokrmů. Kokosové mléko dodává krémovost asijským curry. Sójová omáčka nebo tamari přidávají umami chuť. Nutritional yeast (lahůdkové droždí) má sýrovou chuť a je bohaté na vitamín B12.`,
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guide-plant-based-pantry-acXKRtvzDRLNZFn3UEevXB.webp",
        imageAlt: "Dobře zásobená rostlinná spíž s luštěninami, ořechy a obilovinami ve sklenicích",
      },
      {
        id: "bílkoviny",
        title: "Bílkoviny v rostlinné stravě — mýty a fakta",
        content: `"Kde bereš bílkoviny?" — tato otázka provází každého, kdo přechází na rostlinnou stravu. Odpověď je jednoduchá: z luštěnin, tofu, tempehu, sejtanu, ořechů, semínek a obilovin. Průměrný dospělý potřebuje přibližně 0,8–1 g bílkovin na kilogram tělesné hmotnosti denně — a toto množství je na dobře sestavené rostlinné stravě naprosto dosažitelné.

**Nejlepší rostlinné zdroje bílkovin:**

Tofu obsahuje přibližně 8 g bílkovin na 100 g a je neutrální chutí — přijímá chuť marinády a koření. Nejlépe chutná smažené, pečené nebo grilované. Tempeh má 19 g bílkovin na 100 g a pevnější texturu — výborný nakrájený na plátky a opečený s tamari a zázvorem.

Sejtan (pšeničný gluten) je s 25 g bílkovin na 100 g nejbohatším rostlinným zdrojem bílkovin. Má masitou texturu a je výborný jako základ pro veganský guláš, steaky nebo kebab. Pozor — není vhodný pro lidi s celiakií nebo citlivostí na lepek.

Luštěniny v kombinaci s obilovinami tvoří kompletní bílkovinu. Klasická kombinace rýže s fazolemi nebo hummus s pita chlebem je výživově vyvážená a chutná. Nemusíte je kombinovat v jednom jídle — stačí je jíst v průběhu dne.

**Vitamín B12** je jediný nutrient, který v rostlinné stravě chybí — je produkován bakteriemi a nachází se téměř výhradně v živočišných produktech. Pokud jste vegan, doplňujte B12 ve formě suplementu (tablety nebo kapky). Vegetariáni, kteří konzumují vejce a mléčné výrobky, mají obvykle dostatečný příjem.`,
        recipeSlugs: [],
        image: "",
        imageAlt: "Rostlinné zdroje bílkovin — tofu, tempeh, luštěniny",
      },
      {
        id: "meal-prep",
        title: "Meal prep: uvařte jednou, jezte celý týden",
        content: `Největší praktická výhoda rostlinné kuchyně je, že se skvěle hodí pro přípravu jídel dopředu. Luštěniny, obiloviny a pečená zelenina vydrží v lednici 4–5 dní a jsou základem rychlých jídel v průběhu týdne. Věnujte 2–3 hodiny v neděli přípravě základů a celý týden budete mít zdravé jídlo za 15 minut.

**Základní meal prep plán:**

Uvařte velkou dávku obilovin — quinoa, rýže nebo bulgur. Tyto základy jsou neutrální a lze je použít do salátů, Buddha bowlů, polévek nebo jako přílohu. Uložte je do vzduchotěsné nádoby v lednici.

Uvařte nebo upečte luštěniny — velká dávka čočkového dhal, cizrnového curry nebo fazolového chilli vydrží v lednici 5 dní a v mrazáku 3 měsíce. Porce do mrazáku jsou záchranou pro dny, kdy nemáte čas vařit.

Upečte zeleninu — nakrájejte sezónní zeleninu (batáty, brokolice, cuketa, paprika, červená řepa), polijte olivovým olejem, osolte a pečte při 200°C po dobu 25–30 minut. Pečená zelenina je výborná do salátů, wrap sendvičů nebo jako příloha.

Připravte dresinky a omáčky — tahini dresink (tahini, citronová šťáva, česnek, voda), miso dresink nebo avokádová omáčka. Dresinky uložte do sklenic v lednici — vydrží 5–7 dní a promění jednoduchý salát v chutné jídlo.`,
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guide-plant-based-meal-prep-iqEDwWf3LsHpUuFRqiZeNp.webp",
        imageAlt: "Týdenní meal prep — připravené nádoby s quinoou, zeleninou a luštěninami",
      },
      {
        id: "nakupy",
        title: "Kde nakupovat v Praze — obchody a trhy",
        content: `Praha nabízí skvělé možnosti pro nákup rostlinných surovin — od supermarketů přes specializované obchody až po farmářské trhy. Znát správná místa vám ušetří čas i peníze.

**Supermarkety:** Všechny velké řetězce (Albert, Billa, Tesco, Kaufland) mají bio sekce s rostlinnými alternativami. Hledejte tofu, tempeh, rostlinná mléka, veganské sýry a hotové rostlinné produkty. Ceny jsou vyšší než v asijských obchodech, ale dostupnost je skvělá.

**Specializované obchody:** Country Life (Melantrichova 15, Jungmannova 1) je nejstarší a nejznámější bio obchod v Praze — výborný výběr luštěnin, obilovin, ořechů a veganských produktů. Sklizeno (více poboček) nabízí lokální a bio produkty s důrazem na sezónnost. Náš grunt v Holešovicích je výborný pro lokální zeleninu a farmářské produkty.

**Asijské obchody:** Pro tofu, tempeh, miso, sójovou omáčku, rýžové nudle a exotické koření jsou nejlepší asijské obchody. Ty největší najdete v okolí Smíchova, Žižkova a Holešovic. Ceny jsou výrazně nižší než v bio obchodech.

**Farmářské trhy:** Holešovická tržnice (sobota 8:00–14:00) je největší a nejlepší farmářský trh v Praze. Náměstí Jiřího z Poděbrad (středa a sobota) je výborný pro čerstvou zeleninu a lokální produkty. Manifesto Market (léto, různá místa) nabízí food trucky s veganskými možnostmi.

**Online nákupy:** Rohlík.cz a Košík.cz mají výborný výběr bio a veganských produktů s doručením domů. Jsou ideální pro nákup základních surovin — luštěniny, obiloviny, ořechy a trvanlivé produkty.`,
        recipeSlugs: [],
        image: "",
        imageAlt: "Farmářský trh s čerstvou zeleninou a ovocem",
      },
      {
        id: "restaurace-pro-zacatecniky",
        title: "Pražské restaurace pro první zkušenost",
        content: `Navštívit veganskou restauraci je jedním z nejlepších způsobů, jak se inspirovat a překonat počáteční nejistotu. Profesionální kuchaři vám ukáží, co je s rostlinnou kuchyní možné — a možná vás překvapí, jak chutné a sytné bezmasé jídlo může být.

**Pro úplné začátečníky** doporučujeme Beas Dhaba — autentická indická kuchyně za studentské ceny, kde si vyberete z bufetu. Žádné složité objednávání, žádné čekání. Ideální pro první zkušenost s veganskou kuchyní.

**Pro ty, kdo chtějí zažít kvalitu** je skvělou volbou Maitrea nebo Lehká Hlava — elegantní restaurace s mezinárodní kuchyní, kde veganská a vegetariánská jídla jsou hlavní hvězdou, ne jen přílohou. Rezervujte si stůl dopředu.

**Pro rychlé obědy** jsou KRO Kitchen (Vinohrady, Karlín, Libeň) ideální — moderní fast food s veganskými burgery, bowly a saláty. Rychlé, chutné a cenově dostupné.

**Pro romantické večeře nebo speciální příležitosti** je Střecha na střeše Národního muzea nezapomenutelný zážitek — výhled na Prahu, sezónní menu a výborná kuchyně.`,
        restaurantSlugs: ["beas-dhaba-vinohrady", "maitrea", "lehka-hlava", "kro-kitchen-vinohrady", "strecha"],
        image: "",
        imageAlt: "Veganský talíř v pražské restauraci",
      },
      {
        id: "zaver",
        title: "Začněte dnes — jeden krok stačí",
        content: `Přechod na rostlinnou stravu je cesta, ne cíl. Každý bezmasý den je přínosem — pro vaše zdraví, pro zvířata i pro planetu. Nemusíte být dokonalí, nemusíte se vzdát všeho najednou. Stačí začít.

Nejlepší první krok? Vyberte si jeden recept z naší databáze, nakupte suroviny a uvařte. Nebo navštivte jednu z pražských veganských restaurací a nechte se inspirovat. Komunita rostlinné stravy v Praze je přívětivá, různorodá a bez dogmat — vítáme každého, kdo chce jíst trochu méně masa.

**Dobrou chuť a šťastné vaření!**`,
        image: "",
        imageAlt: "Šťastný člověk s barevným veganským jídlem",
      },
    ],
    relatedGuides: ["veganska-praha-po-ctvrtich", "sezonni-pruvodce-bezmase-kuchyne"],
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
