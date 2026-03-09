// ============================================================
// BEZMASAJIDLA.CZ — Blog Data
// 5 SEO-optimalizovaných článků o veganských restauracích v Praze
// ============================================================

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string; // ISO date string
  readingTimeMin: number;
  coverImage: string;
  coverImageAlt: string;
  excerpt: string;
  content: string; // Markdown
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "top-10-veganskych-restauraci-praha-2026",
    title: "Top 10 veganských restaurací v Praze 2026",
    metaDescription:
      "Hledáte nejlepší veganské restaurace v Praze? Přinášíme aktuální přehled 10 nejlépe hodnocených podniků pro rok 2026 — od Vinohrad po Holešovice.",
    category: "Průvodce",
    tags: ["vegan", "Praha", "restaurace", "průvodce", "2026"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-02-15",
    readingTimeMin: 7,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-top10-restauraci-2026-GG52nEiDEd32Ak7ZoMrq7b.webp",
    coverImageAlt: "Veganské jídlo v pražské restauraci — barevné misky se zeleninou",
    excerpt:
      "Praha se v posledních letech stala jedním z nejpřívětivějších měst pro vegany ve střední Evropě. Přinášíme vám přehled deseti restaurací, které v roce 2026 zaujímají přední příčky v hodnocení kvality, ceny a atmosféry.",
    content: `## Praha — veganská metropole střední Evropy

Praha se v posledních letech proměnila v jedno z nejpřívětivějších měst pro vegany ve střední Evropě. Zatímco ještě před deseti lety bylo obtížné najít restauraci s více než jedním bezmasým jídlem, dnes nabízí hlavní město přes 150 podniků zaměřených výhradně nebo převážně na rostlinnou stravu.

Tento přehled vychází z hodnocení více než 2 400 uživatelů naší platformy a zohledňuje kvalitu jídla, šíři nabídky, cenu, atmosféru i přístupnost místa.

## 1. Etnosvet (Žižkov)

Etnosvet na Žižkově patří dlouhodobě mezi absolutní špičku pražské veganské scény. Restaurace kombinuje středomořské a asijské vlivy v jídlech připravených výhradně z lokálních a sezónních surovin. Jejich tofu tikka masala a hummusový talíř s domácím chlebem jsou legendární. Průměrná cena hlavního jídla se pohybuje kolem 280 Kč.

## 2. Plevel (Vinohrady)

Plevel na Vinohradech je synonymem pro moderní veganskou kuchyni v příjemném prostředí. Jídelní lístek se mění každý týden podle dostupných surovin, přičemž důraz je kladen na minimální zpracování a maximální chuť. Oblíbené jsou zejména jejich sezónní polévky a dezerty z cashew krému.

## 3. Loving Hut (Centrum)

Mezinárodní síť Loving Hut má v Praze hned dvě pobočky a nabízí jedny z nejdostupnějších veganských jídel ve městě. Asijská kuchyně, rychlá obsluha a ceny od 120 Kč z nich dělají ideální volbu pro každodenní stravování.

## 4. Forrest Bistro (Holešovice)

Forrest Bistro v Holešovicích je oblíbeným místem pro brunch i večeři. Jejich avokádový toast s nakládanou červenou cibulí a veganský cheesecake patří mezi nejfotografovanější jídla na pražském Instagramu. Restaurace klade důraz na estetiku i chuť.

## 5. Dhaba Beas (Centrum)

Dhaba Beas je indická vegetariánská restaurace s bufetovým systémem, kde platíte za gramáž. Díky tomu si každý sestaví talíř přesně podle chuti a rozpočtu. Výběr zahrnuje vždy minimálně 15 různých pokrmů, z nichž většina je veganská.

## 6. Maitrea (Staré Město)

Maitrea v srdci Starého Města je jednou z nejstarších a nejprestižnějších veganských restaurací v Praze. Interiér inspirovaný buddhistickou estetikou, klidná atmosféra a precizně zpracovaná jídla z ní dělají ideální místo pro zvláštní příležitosti.

## 7. Moment (Smíchov)

Moment na Smíchově je komunitní kavárna a restaurace s rotujícím menu, které sestavují místní kuchaři a food aktivisté. Každý týden se zde koná veganský večer s degustačním menu za fixní cenu.

## 8. Café Louvre (Nové Město)

Historická kavárna Café Louvre překvapuje rozsáhlou veganskou nabídkou snídaní a obědů. Jejich veganský štrúdl a bezlepkové palačinky jsou oblíbené i mezi neveganskými hosty.

## 9. Vegan's Prague (Žižkov)

Vegan's Prague je malý rodinný podnik specializující se na českou kuchyni v rostlinném provedení. Svíčková na smetaně z celeru, veganský guláš a smažený sýr z tofu dokazují, že tradiční česká jídla lze připravit bez živočišných produktů.

## 10. Raw & Tasty (Vinohrady)

Raw & Tasty se zaměřuje na raw food — tedy jídla tepelně nezpracovaná nad 42 °C. Jejich raw cheesecaky, zeleninové rolky a smoothie bowls jsou oblíbené zejména v letních měsících.

## Jak vybrat tu správnou restauraci?

Při výběru veganské restaurace v Praze doporučujeme zohlednit několik faktorů: lokalitu a dostupnost MHD, cenovou hladinu, typ kuchyně a možnost rezervace. Naše platforma umožňuje filtrovat restaurace podle všech těchto kritérií a zobrazit aktuální hodnocení od skutečných návštěvníků.`,
  },
  {
    id: "2",
    slug: "pruvodce-veganskou-prahou-ctvrti",
    title: "Průvodce veganskou Prahou: Které čtvrti jsou nejlepší?",
    metaDescription:
      "Vinohrady, Žižkov nebo Holešovice? Porovnáváme pražské čtvrti podle hustoty veganských a vegetariánských restaurací a pomáháme vám vybrat tu správnou destinaci.",
    category: "Průvodce",
    tags: ["Praha", "čtvrti", "Vinohrady", "Žižkov", "Holešovice", "mapa"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-01-28",
    readingTimeMin: 6,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-pruvodce-prahou-ctvrti-CqPYeA7rpXcHnjTFsN6YB8.webp",
    coverImageAlt: "Pohled na Prahu z ptáčí perspektivy — střechy a parky",
    excerpt:
      "Praha má přes 150 veganských a vegetariánských restaurací, ale jejich rozmístění po městě je nerovnoměrné. Vinohrady a Žižkov vévodí nabídce, zatímco některé okrajové čtvrti stále zaostávají. Přinášíme přehled čtvrtí, kde se vyplatí hledat bezmasé jídlo.",
    content: `## Veganská Praha: mapa příležitostí

Praha má přes 150 veganských a vegetariánských restaurací, ale jejich rozmístění po městě je nerovnoměrné. Zatímco některé čtvrti nabízejí na každém rohu bezmasou alternativu, jiné oblasti stále zaostávají. Tento průvodce vám pomůže zorientovat se v tom, kde v Praze hledat nejlepší rostlinnou stravu.

## Vinohrady — veganská Mekka Prahy

Vinohrady jsou bezesporu nejhustěji obsazenou čtvrtí co do počtu veganských a vegetariánských podniků. Na relativně malé ploše zde najdete desítky restaurací, kaváren a bistro, z nichž mnohé se specializují výhradně na rostlinnou stravu. Oblíbenou trasou je procházka od náměstí Míru podél Mánesovy ulice až k Riegrovým sadům, kde se nachází hned několik vynikajících podniků.

Typická cena hlavního jídla na Vinohradech se pohybuje mezi 200 a 350 Kč, což odpovídá pražskému průměru pro tuto kategorii restaurací.

## Žižkov — alternativa s charakterem

Žižkov je tradiční dělnická čtvrť, která se v posledních letech proměnila v centrum alternativní kultury a gastronomie. Veganské restaurace zde mají výrazně osobitější charakter než na Vinohradech — menší, komunitnější, s důrazem na lokální suroviny a experimentální kuchyni. Ceny jsou zpravidla o 20–30 % nižší než na Vinohradech.

## Holešovice — nová gastronomická čtvrť

Holešovice prošly v posledním desetiletí dramatickou proměnou z průmyslové čtvrti na jedno z nejdynamičtějších gastronomických center Prahy. Tržnice Holešovice a okolí Ortenova náměstí jsou dnes domovem desítek restaurací, z nichž mnohé nabízejí veganské menu. Holešovice jsou oblíbené zejména pro brunch a víkendové výlety.

## Centrum — turistické, ale přívětivé

Staré Město a Nové Město jsou přirozeně turisticky orientované, což se odráží i v cenách. Přesto zde najdete několik výjimečných veganských podniků, jako je Maitrea nebo Dhaba Beas, které si udržují vysokou kvalitu navzdory turistickému tlaku. Pro každodenní stravování jsou tyto čtvrti méně vhodné z cenového hlediska.

## Smíchov a Dejvice — rozvíjející se scéna

Smíchov a Dejvice jsou čtvrti, kde veganská scéna teprve nabírá na síle. Nové podniky zde otevírají pravidelně a ceny jsou příznivé. Pokud hledáte méně přeplněné alternativy k Vinohradům, tyto čtvrti stojí za prozkoumání.

## Srovnávací tabulka čtvrtí

| Čtvrť | Počet podniků | Průměrná cena | Dostupnost MHD | Atmosféra |
|---|---|---|---|---|
| Vinohrady | 35+ | 250–350 Kč | Výborná | Elegantní |
| Žižkov | 20+ | 180–280 Kč | Dobrá | Alternativní |
| Holešovice | 18+ | 200–320 Kč | Dobrá | Kreativní |
| Centrum | 15+ | 300–450 Kč | Výborná | Turistická |
| Smíchov | 10+ | 180–260 Kč | Výborná | Rodinná |

## Tip: Využijte naši interaktivní mapu

Na naší platformě najdete interaktivní mapu všech veganských a vegetariánských restaurací v Praze s možností filtrování podle čtvrti, typu kuchyně a cenové hladiny. Mapa se pravidelně aktualizuje o nové podniky.`,
  },
  {
    id: "3",
    slug: "veganske-restaurace-pro-deti-praha",
    title: "Veganské restaurace v Praze vhodné pro rodiny s dětmi",
    metaDescription:
      "Hledáte veganskou restauraci v Praze, kde se budou bavit i děti? Přinášíme přehled podniků s dětským menu, hracím koutkem a přátelskou atmosférou pro celou rodinu.",
    category: "Rodiny",
    tags: ["rodiny", "děti", "Praha", "vegan", "vegetarián", "dětské menu"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-01-10",
    readingTimeMin: 5,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-restaurace-pro-deti-4R54tN9Pg8itEE4N5JASMG.webp",
    coverImageAlt: "Rodina u stolu s barevnými vegetariánskými jídly",
    excerpt:
      "Vzít děti do veganské restaurace může být výzva — ne každý podnik myslí na nejmenší hosty. Přinášíme přehled pražských restaurací, které nabízejí dětské menu, přátelský přístup a prostředí vhodné pro celou rodinu.",
    content: `## Veganské stravování s dětmi v Praze

Vzít děti do veganské restaurace může být výzva — ne každý podnik myslí na nejmenší hosty. Přesto v Praze existuje řada míst, která kombinují kvalitní rostlinnou kuchyni s přátelským přístupem k rodinám. Tento přehled vám pomůže najít ty správné podniky.

## Co hledat při výběru restaurace pro rodiny

Při výběru restaurace s dětmi je důležité zohlednit několik faktorů: dostupnost dětského menu nebo možnost přizpůsobit porce, přítomnost vysokých židliček, přebalovací pult, přívětivý přístup personálu a atmosféru, která toleruje hlučnější hosty.

## Doporučené restaurace

### Dhaba Beas — bufetový systém pro každého

Dhaba Beas je ideální pro rodiny s dětmi díky svému bufetovému systému. Děti si mohou vybrat přesně to, co chtějí, a platí se jen za to, co si vezmou. Výběr zahrnuje vždy sladká i slaná jídla, takže i vybíraví jedlíci najdou něco podle chuti. Personál je zvyklý na rodinné návštěvy a rád pomůže s výběrem.

### Moment — komunitní atmosféra

Moment na Smíchově je komunitní podnik s přátelskou atmosférou, kde jsou děti vítány. Restaurace nabízí jednoduchá jídla, která ocení i méně dobrodružní jedlíci, a má k dispozici vysoké židličky a dětské příbory.

### Café Louvre — historická kavárna s dětským menu

Café Louvre v centru Prahy má speciální dětské menu s veganskými a vegetariánskými možnostmi. Historický interiér a klidná atmosféra z ní dělají ideální místo pro nedělní rodinný oběd.

### Forrest Bistro — víkendový brunch

Forrest Bistro v Holešovicích je oblíbeným místem pro víkendový brunch s rodinou. Jejich brunchové menu zahrnuje dětské porce a personál je vstřícný k rodinám s kočárky.

## Praktické tipy pro rodinné výlety

Při plánování výletu s dětmi do veganské restaurace doporučujeme rezervovat stůl předem, zejména o víkendech. Většina pražských veganských podniků je malých a kapacita bývá omezená. Dále je vhodné zkontrolovat, zda restaurace nabízí možnost přizpůsobit jídla pro alergiky — veganská kuchyně je obecně přívětivější k potravinovým alergiím než tradiční.

## Veganské fast food alternativy pro děti

Pro rychlé a dostupné stravování s dětmi jsou vhodné i fast food řetězce s veganskými možnostmi. McDonald's nabízí McPlant burger a hranolky, Subway má Veggie Delite sendvič a Pizza Hut připraví pizzu s veganským sýrem. Tyto možnosti jsou praktické pro spontánní výlety, kdy není čas na rezervaci.`,
  },
  {
    id: "4",
    slug: "nejlepsi-veganske-brunche-praha",
    title: "Nejlepší veganské brunche v Praze: Kde strávit víkendové dopoledne",
    metaDescription:
      "Víkendový brunch v Praze nemusí být jen vejce a slanina. Přinášíme přehled nejlepších míst pro veganský a vegetariánský brunch v Praze — od avokádového toastu po açaí bowl.",
    category: "Brunch",
    tags: ["brunch", "snídaně", "Praha", "vegan", "víkend", "kavárna"],
    author: "Bezmasájídla.cz",
    publishedAt: "2025-12-20",
    readingTimeMin: 5,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-veganske-brunche-CKfN9994upzJuaRbq9fq7J.webp",
    coverImageAlt: "Veganský brunch — avokádový toast, smoothie bowl a čerstvé ovoce",
    excerpt:
      "Víkendový brunch se stal jedním z nejoblíbenějších gastronomických rituálů Pražanů. Veganská a vegetariánská scéna nabízí stále více podniků, kde si lze dopřát vydatné dopolední jídlo bez živočišných produktů. Přinášíme přehled těch nejlepších.",
    content: `## Veganský brunch v Praze — rostoucí trend

Víkendový brunch se stal jedním z nejoblíbenějších gastronomických rituálů Pražanů. Veganská a vegetariánská scéna nabízí stále více podniků, kde si lze dopřát vydatné dopolední jídlo bez živočišných produktů. Přinášíme přehled těch nejlepších míst pro rok 2026.

## Co tvoří dobrý veganský brunch?

Kvalitní veganský brunch by měl nabídnout kombinaci slaných a sladkých jídel, dostatek bílkovin (tofu scramble, luštěniny, ořechy), čerstvé ovoce a zeleninu, a samozřejmě dobrou kávu nebo čaj. Rostlinné mléko — ovesné, mandlové nebo sójové — by mělo být samozřejmostí.

## Top místa pro veganský brunch

### Forrest Bistro (Holešovice)

Forrest Bistro je bezesporu jedním z nejlepších míst pro veganský brunch v Praze. Jejich avokádový toast s nakládanou červenou cibulí, cherry rajčátky a semínky je ikonickým jídlem pražské brunchové scény. Brunch se podává každý víkend od 10 do 14 hodin, rezervace je doporučena.

### Raw & Tasty (Vinohrady)

Raw & Tasty nabízí brunch zaměřený na raw food — tedy tepelně nezpracovaná jídla. Jejich açaí bowl, granola s kokosovým jogurtem a raw cheesecaky jsou oblíbené zejména v letních měsících. Restaurace má příjemnou zahrádku, která je v teplém počasí vždy plná.

### Café Louvre (Nové Město)

Historická kavárna Café Louvre nabízí jeden z nejelegantnějších brunchů v Praze. Veganské menu zahrnuje tofu scramble s čerstvou zeleninou, domácí müsli s rostlinným mlékem a výběr sezónního ovoce. Atmosféra secesního interiéru z návštěvy dělá zážitek přesahující pouhé jídlo.

### Plevel (Vinohrady)

Plevel na Vinohradech mění brunchové menu každý týden podle dostupných surovin. To zaručuje, že každá návštěva přináší něco nového. Oblíbené jsou jejich sezónní smoothie a teplé kaše s různými toppingy.

## Praktické informace

Většina pražských podniků nabízí brunch o víkendech od 9 nebo 10 hodin do 14 nebo 15 hodin. Rezervace je doporučena, zejména v oblíbených podnicích na Vinohradech a v Holešovicích. Průměrná cena brunchového menu se pohybuje mezi 250 a 400 Kč včetně nápoje.

## Brunch vs. snídaně: co si vybrat?

Brunch je ideální pro pozdní vstávání a delší posezení. Pokud hledáte rychlejší a levnější alternativu, mnohé kavárny nabízejí snídaňové menu od otevření — zpravidla od 8 hodin — za nižší ceny. Veganské snídaně zahrnují typicky ovesnou kaši, toast s různými pomazánkami a čerstvé džusy.`,
  },
  {
    id: "5",
    slug: "ceska-veganska-kuchyne-tradicni-jidla-bez-masa",
    title: "Česká veganská kuchyně: Tradiční jídla bez masa",
    metaDescription:
      "Svíčková, guláš nebo smažený sýr — i tradiční česká jídla lze připravit bez masa. Přinášíme přehled pražských restaurací, kde ochutnáte českou kuchyni v rostlinném provedení.",
    category: "Česká kuchyně",
    tags: ["česká kuchyně", "tradiční", "vegan", "svíčková", "guláš", "Praha"],
    author: "Bezmasájídla.cz",
    publishedAt: "2025-12-05",
    readingTimeMin: 6,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-ceska-veganska-kuchyne-Z3BaSWsmxY2tRDXFpLi6s4.webp",
    coverImageAlt: "Tradiční česká veganská jídla — svíčková z celeru, houbový guláš",
    excerpt:
      "Česká kuchyně je tradičně masová, ale v posledních letech se objevuje stále více podniků, které dokazují, že i svíčková, guláš nebo smažený sýr lze připravit bez živočišných produktů. Přinášíme přehled pražských restaurací, kde ochutnáte Česko v rostlinném provedení.",
    content: `## Česká veganská kuchyně — tradice v novém kabátě

Česká kuchyně je tradičně masová — svíčková na smetaně, vepřo-knedlo-zelo, guláš. Přesto se v posledních letech objevuje stále více podniků, které dokazují, že i tyto ikonické pokrmy lze připravit bez živočišných produktů, aniž by ztratily svůj charakteristický charakter.

## Klíčové ingredience české veganské kuchyně

Úspěšná česká veganská kuchyně stojí na několika klíčových ingrediencích. Celer a pastinák nahrazují hovězí maso ve svíčkové, houby dodávají guláši hloubku chuti, tofu nebo tempeh plní roli masa v mnoha pokrmech a rostlinná smetana umožňuje připravit tradiční omáčky bez mléčných výrobků.

## Svíčková z celeru — veganský hit

Svíčková z celeru je pravděpodobně nejpopulárnějším veganským pokrmem inspirovaným českou tradicí. Celer se marinuje a peče podobně jako hovězí, výsledná textura je překvapivě podobná. Omáčka se připravuje z kořenové zeleniny, rostlinné smetany a koření. Podává se tradičně s knedlíkem, brusinkami a plátkem citronu.

V Praze ji nejlépe připravují v restauraci Vegan's Prague na Žižkově, kde ji vaří podle receptury, která prošla mnoha iteracemi za účelem co nejvěrnějšího přiblížení originálu.

## Houbový guláš — poctivá česká klasika

Houbový guláš je jedním z nejjednodušších a nejchutnějších veganských pokrmů české kuchyně. Kombinace různých druhů hub — typicky žampionů, shiitake a sušených hříbků — vytváří bohatou, sytou chuť. Podává se s chlebem nebo knedlíkem.

## Smažený sýr z tofu

Smažený sýr je jedním z nejoblíbenějších vegetariánských jídel v českých restauracích. Veganská verze z tofu nebo cashew sýru je méně rozšířená, ale v několika pražských podnicích ji najdete. Havelská Koruna na Starém Městě nabízí smaženou tofu verzi s tatarskou omáčkou z cashew.

## Knedlíky — vegansky bez problémů

Tradiční houskové knedlíky jsou ve své základní formě veganské — obsahují pouze chléb, mouku a vodu. Bramborové knedlíky jsou rovněž veganské. Problém nastává pouze u kynutých knedlíků, které obsahují vejce, ale i ty lze připravit s náhražkou.

## Kde ochutnat českou veganskou kuchyni v Praze

| Restaurace | Specialita | Čtvrť | Cena |
|---|---|---|---|
| Vegan's Prague | Svíčková z celeru, guláš | Žižkov | 180–260 Kč |
| Havelská Koruna | Smažený sýr z tofu, koprovka | Staré Město | 120–200 Kč |
| Moment | Česká veganská kuchyně | Smíchov | 160–240 Kč |
| Dhaba Beas | Vegetariánský bufet | Centrum | 100–180 Kč |

## Vaření doma: kde najít recepty

Pokud vás česká veganská kuchyně zaujala natolik, že ji chcete vyzkoušet doma, na naší platformě najdete desítky ověřených receptů. Naši uživatelé sdílejí vlastní verze tradičních pokrmů a hodnotí je — takže vždy víte, které recepty skutečně fungují.`,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((p) => p.tags.includes(tag));
}
