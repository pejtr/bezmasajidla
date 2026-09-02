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
    id: "11",
    slug: "bezmasa-budapest-veganske-restaurace-ceny",
    title:
      "Kam na bezmasé jídlo v Budapešti? Ceny od street foodu po večeři s výhledem",
    metaDescription:
      "Ověřený průvodce bezmasým jídlem v Budapešti: veganské restaurace, street food, maďarská klasika, aktuální ceny a večeře s výhledem.",
    category: "Cestování",
    tags: ["Budapešť", "Maďarsko", "vegan", "restaurace", "ceny", "cestování"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-07-28",
    readingTimeMin: 8,
    coverImage: "/images/blog/bezmasa-budapest.webp",
    coverImageAlt:
      "Veganské maďarské jídlo s výhledem na Budínský hrad a Řetězový most",
    excerpt:
      "Budapešť není jen guláš a langoš. Porovnali jsme cenově dostupný street food, čistě veganské podniky i večeři s panoramatem a ověřili aktuální menu i ceny.",
    content: `## Budapešť bez masa: co čekat a kolik si připravit

Maďarská kuchyně má pověst země guláše, klobás a sádla, Budapešť ale dnes nabízí překvapivě pestrý výběr pro vegetariány i vegany. Najdete tu rychlý street food, rostlinné verze maďarské klasiky i reprezentativní večeři s výhledem na město.

**Ceny a nabídky jsme ověřovali 28. července 2026.** Menu se mění a převod na koruny kolísá, proto uvádíme především částky v maďarských forintech. Před cestou vždy otevřete aktuální menu podniku.

| Podnik | Styl | Orientační cena bezmasého jídla |
|---|---|---:|
| Karaván | street food | zveřejněné sezonní položky přibližně 1 800–2 400 Ft |
| Napfényes | čistě veganská maďarská kuchyně | polévky 1 400–1 500 Ft, hlavní jídla 4 400–5 700 Ft |
| Aranybástya | večeře s panoramatem | veganská polévka 2 750 Ft, hlavní chod 4 500 Ft |
| VIRTU | fine dining ve 28. patře | bezmasé menu je nutné ověřit před rezervací |

## Aranybástya: ověřená veganská večeře s výhledem

[Aranybástya](https://en.aranybastya.com/dinner-menu) sídlí v Budínském hradním areálu a kombinuje panoramatickou terasu s menu, na kterém jsou rostlinné položky označené přímo.

V aktuálním večerním menu najdete krémovou polévku ze zeleného hrášku s medvědím česnekem a rostlinnou smetanou za **2 750 Ft**, superfood salát za **3 200 Ft** s možností přidat grilované tofu nebo květák za **1 490 Ft** a veganské plněné zelí s čočkovým ragú a quinoou za **4 500 Ft**. Rostlinnou tečkou je malinové crème brûlée za **3 200 Ft**.

K účtu se připočítává **15% servisní poplatek**. Restaurace je v ulici Csónak 1 a podle oficiálního webu otevírá denně od 12:00 do 22:00. Na večeři se západem slunce je rozumné rezervovat stůl předem.

## VIRTU: výjimečné místo, ale bezmasé menu potvrďte předem

[VIRTU Restaurant](https://virturestaurant.com/) se nachází ve 28. patře MOL Campus a je doporučený průvodcem Michelin. Panoramatem patří k nejvýraznějším gastronomickým zážitkům ve městě.

Aktuálně zveřejněná nabídka šéfkuchaře však není sestavená jako vegetariánské nebo veganské menu. Proto zde neuvádíme dříve publikované ceny plněných paprik ani slib úpravy každého chodu — současné podklady je nepotvrzují. Pokud vás láká právě VIRTU, napište restauraci ještě před rezervací, popište své stravovací požadavky a nechte si potvrdit konkrétní skladbu i cenu menu.

## Napfényes: maďarská klasika v čistě veganské podobě

[Napfényes Étterem](https://napfenyesetterem.hu/) je plně veganská restaurace v centru, vhodná pro každého, kdo chce ochutnat sytější domácí kuchyni bez složitého vysvětlování obsluze.

Podle aktuálního sezonního menu stojí polévky **1 400–1 500 Ft**, carbonara **4 400 Ft**, plněné zelí **5 500 Ft** a sezonní rizoto **5 700 Ft**. Nabídka se mění, ale podnik dlouhodobě pracuje s tofu, seitanem, luštěninami a rostlinnými verzemi maďarských jídel. Najdete ho na adrese Curia u. 2; zveřejněná otevírací doba je 11:30–21:00.

## Karaván: rychlý oběd v židovské čtvrti

[Street Food Karaván](https://street-food-karavan-budapest.hu/menu) je venkovní food court v Kazinczy utca 18, hned vedle Szimpla Kert. Jednotlivé stánky se obměňují, takže nejde o čistě veganský areál, bezmasé varianty tu ale bývají běžnou součástí nabídky.

Na oficiálním menu jsou zveřejněné sezonní položky přibližně za **1 800–2 400 Ft**; ceny burgerů, langošů a dalších jídel se liší podle stánku. U smažených jídel se ptejte nejen na těsto a topping, ale také na společný olej, pokud je to pro vás důležité.

## Kozmosz: neformální čistě veganské bistro

Kozmosz Vegán Étterem je komornější podnik se sklepní atmosférou, burgery, tortillami, těstovinami a seitanem. Hodí se pro nenáročný oběd nebo večeři mimo turistický ruch.

Protože se nám nepodařilo dohledat spolehlivý aktuální oficiální ceník, starší cenové rozpětí zde záměrně neopakujeme. Před návštěvou ověřte aktuální menu a otevírací dobu přímo u podniku.

## Sladká tečka: sorbet a pozor na trdelník

[Gelarto Rosa](https://gelartorosa.com/en/) u Baziliky svatého Štěpána nabízí ovocné sorbety bez mléka a také varianty s rostlinným mlékem. Aktuální cenu provozovatel na webu neuvádí, proto s ní v rozpočtu zacházejte jako s proměnlivou.

U kürtőskalácse neplatí, že je automaticky veganský. Těsto nebo posyp mohou obsahovat mléko, máslo či vejce. Hledejte výslovné označení vegan a raději si složení potvrďte u obsluhy.

## Jak si vybrat podle rozpočtu

- **Rychle a levněji:** projděte aktuální stánky v Karavánu.
- **Jistota čistě rostlinné kuchyně:** zvolte Napfényes nebo Kozmosz.
- **Večeře s výhledem a jasně označeným veganským jídlem:** rezervujte Aranybástyu.
- **Fine dining ve 28. patře:** VIRTU volte pouze po předchozím potvrzení bezmasého menu.

Budapešť otevírá naši novou rubriku **Cestování**. V dalších průvodcích se zaměříme především na **Krakov a Varšavu**, následovat budou vybraná města v Itálii a Francii. Stejně jako zde budeme odlišovat ověřené aktuální ceny od starších nebo nedoložených údajů.`,
  },
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
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt:
      "Veganské jídlo v pražské restauraci — barevné misky se zeleninou",
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
      "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80",
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
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
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
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt:
      "Veganský brunch — avokádový toast, smoothie bowl a čerstvé ovoce",
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
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt:
      "Tradiční česká veganská jídla — svíčková z celeru, houbový guláš",
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
  {
    id: "6",
    slug: "vegansky-fast-food-praha-kde-jist-rychle-a-dobre",
    title: "Veganský fast food v Praze: kde jíst rychle a dobře v roce 2026",
    metaDescription:
      "Veganský fast food v Praze 2026 — přehled nejlepších míst pro rychlé veganské jídlo: burgery, wrap, falafel, sushi a indické bufety. Ceny od 90 Kč.",
    category: "Fast Food",
    tags: [
      "vegan",
      "fast food",
      "Praha",
      "rychlé jídlo",
      "burger",
      "falafel",
      "bufet",
    ],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-03-10",
    readingTimeMin: 6,
    coverImage:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Veganský burger a hranolky na dřevěném prkně",
    excerpt:
      "Veganský fast food už není oxymorón. Praha nabízejí deseti míst, kde se najdete rychle, levně a bez masa — od indických bujetů po veganské burgery.",
    content: `## Veganský fast food v Praze: rychle, levně, bez masa

Ještě před pěti lety bylo veganské rychlé občerstveni v Praze prakticky neexistující kategorií. Dnes je situace radikálně jiná — město nabízejí deseti míst, kde se najdete za méně než 200 Kč, rychle a bez žiivočičných produktů. Tento přehled mapuje nejlepší možnosti pro rok 2026.

## Beas Dhaba — indický bufet podle váhy

Beas Dhaba je pravděpodobně nejlepší veganský fast food v Praze z hlediska poměru cena/kvalita. Samoobslužný systém, kde platíte za gramme, znamená, že si každý složí talíř přesně podle chuti a rozpočtu. Výběr zahrnuje vždy minimálně 15 různých pokrmů — dál, kari, roti, rýže, samosy a dezerty. Průměrný talíř vyjde na 120–160 Kč. Beas Dhaba má v Praze přes 20 poboček, takže je prakticky vždy některá v dosahu.

## Country Life — bio bufet v srdci Praze

Country Life na Melantrychově ulici je průkopníkem biopotravin v ČR od roku 1991. Teplou i studenou veganskou stravu nabízejí formou bufetu, kde si vyberete, co chcete. Ceny jsou přiměřené, kvalita surovin vysoká. Ideální pro rychlý oběd v centru Prahy.

## Loving Hut — asijská veganská kuchyně

Mezinárodní síť Loving Hut má v Praze dvě pobočky. Nabízejí asijsky inspirovanou veganskou kuchyni — pho, pad thai, kari, správné burgery. Ceny začínají od 120 Kč za hlavní jídlo. Rychlá obsluha a příjemné prostředí.

## Sandokan Vegan Bistro — bufet na Vinohradech

Sandokan na Vinohradech je samoobslužný bufet s výběrem veganských a bezlepkových jídel. Systém je jednoduchý: vyberete si z teplych jídel a salátů, zaplatite a jíte. Ceny jsou nízké, jídlo kvalitní.

## Veganské možnosti v klasických fast food řetězcích

I klasické fast food řetězce rozšiřují veganské nabídky. Burger King nabízejí Rebel Whopper, McDonald's má McVegan (v některých pobočkách), KFC nabízejí veganské kusé a Subway má veganské sendviče. Tyto možnosti jsou praktické, když jste v čase tlaču a nemáte jinou možnost.

## Srovnání nejlepších veganských fast food míst v Praze

| Restaurace | Typ | Cena | Počet poboček |
|---|---|---|---|
| Beas Dhaba | Indický bufet | 100–180 Kč | 20+ |
| Country Life | Bio bufet | 120–200 Kč | 1 |
| Loving Hut | Asijská kuchyně | 120–200 Kč | 2 |
| Sandokan | Veganský bufet | 90–160 Kč | 1 |
| Burger King | Rebel Whopper | 150–200 Kč | 10+ |

## Tip: jak najít veganský fast food v blízkosti

Naše interaktivní mapa umožňuje najít veganské restaurace v okolí vaší polohy. Stačí kliknout na "V okolí" a zobrazí se všechna veganská místa do 1,5 km. Ideální, když jste v neznámé části města a potřebujete rychle najíst.`,
  },
  {
    id: "7",
    slug: "bezlepkove-veganske-restaurace-praha",
    title: "Bezlepkové veganské restaurace v Praze: kompletni průvodce 2026",
    metaDescription:
      "Bezlepkové veganské restaurace v Praze 2026 — kde jíst bez lepku a bez masa? Přehled podniků s bezlepkovou nabídkou, tipy na jídla a praktické rady.",
    category: "Průvodce",
    tags: [
      "bezlepkove",
      "vegan",
      "Praha",
      "celiakálie",
      "gluten-free",
      "restaurace",
    ],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-03-10",
    readingTimeMin: 7,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-bezlepkove-vegan-SefXVKQybptc8Ls93vCwzz.webp",
    coverImageAlt:
      "Bezlepkové veganské jídlo — barevné misky se zeleninou a quinoou",
    excerpt:
      "Kombinace veganské stravy a bezlepkové diety může být výzva — ale Praha nabízejí řadu podniků, které obě potřeby zvládají na jedničku.",
    content: `## Bezlepkové veganské jídlo v Praze: kde jíst bez kompromisů

Kombinace veganské stravy a bezlepkové diety může působit jako extremální omezení — ale Praha nabízejí překvapivuíce širokou nabídku podniků, které obě potřeby zvládají. Tento průvodce je určen jak pro lidi s celiakálií, tak pro ty, kteří se lepku vyhybají z jiných důvodů.

## Proč je kombinace vegan + bezlepkove náročná

Veganská strava se často opírá o obiloviny — pečivo, těstoviny, seitan (který je čistý lepek). Bezlepková veganská kuchyně proto musí najít jiné zdroje sacharidů a bílkovin: quinoa, pohanka, čočka, cizrna, rýže, bataty.

## Nejlepší bezlepkové veganské restaurace v Praze

### Maitrea (Staré Město)
Maitrea nabízejí širokou bezlepkovou nabídku a obsluha je schopna poradit s výběrem. Jejich sezónní menu vždy obsahuje několik bezlepkových možností. Restaurace je označena jako bezlepkove přátelská a používá oddělené kuchyské náčiní.

### Lehká Hlava (Staré Město)
Lehká Hlava má v menu vždy několik bezlepkových jídel a na žádost dokáže přizpůsobit většinu pokrmů. Jejich bezlepkové dezerty jsou obzvláště oblíbené.

### Natureza (Malá Strana)
Natureza je jedním z mála podniků v Praze, které má bezlepkovou nabídku jako standardní součást menu, nikoli jako výjimku. Jejich raw dezerty jsou přirozeně bezlepkové.

### Sandokan Vegan Bistro (Vinohrady)
Sandokan nabízejí řadu bezlepkových jídel v rámci svého bufetu. Systém samoobsluhy umožňuje snadno identifikovat bezlepkové možnosti.

### Beas Dhaba
Indická kuchyně je přirozeně často bezlepková — rýže, čočkové pokrmy a většina kari jsou bez lepku. Beas Dhaba vždy označuje bezlepkové položky.

## Praktické tipy pro bezlepkové vegany v Praze

**Před návštěvou:** Zavolejte nebo napište předem a zeptáte se na bezlepkovou nabídku. Většina podniků je ochotná přizpůsobit pokrmy.

**Při objednávání:** Vyhledejte symbol GF nebo se zeptáte obsluhy. Upozorněte na celiakálii, ne pouze na preferenci.

**Bezpečné možnosti:** Indická a asijská kuchyně jsou často přirozeně bezlepkové. Vyhybejte se seitanů, který je čistý lepek.

## Srovnání bezlepkových veganských možností

| Restaurace | Bezlepková nabídka | Certifikace | Cena |
|---|---|---|---|
| Maitrea | Rozsahlá | ✔️ | 200–350 Kč |
| Lehká Hlava | Střední | ✔️ | 180–300 Kč |
| Natureza | Rozsahlá | ✔️ | 150–250 Kč |
| Sandokan | Střední | ✔️ | 90–160 Kč |
| Beas Dhaba | Střední | ❌ | 100–180 Kč |

## Bezlepkové veganské recepty doma

Pokud chcete vařit bezlepkově a veganské doma, naše platforma nabízejí řadu receptů označených jako bezlepkové. Quinoové saláty, pohankove krupice, čočkové polévky a bataty jsou základem bezlepkové veganské kuchyně.`,
  },
  {
    id: "8",
    slug: "zdrave-obedy-do-200-kc-vegan-praha",
    title: "Zdravé veganské obědy do 200 Kč v Praze: kde jíst levně a dobře",
    metaDescription:
      "Veganské obědy do 200 Kč v Praze 2026 — přehled nejlepších míst pro zdravé a levné veganské jídlo. Bufety, denní menu, sámé jídla od 90 Kč.",
    category: "Tipy",
    tags: [
      "vegan",
      "Praha",
      "levné jídlo",
      "oběd",
      "rozpočet",
      "bufet",
      "denní menu",
    ],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-03-10",
    readingTimeMin: 5,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-levne-obedy-vegan-ijQXPMPHrYYAdU5T2q6Sbw.webp",
    coverImageAlt:
      "Zdravý veganský oběd — barevný talíř se zeleninou a lugtěninami",
    excerpt:
      "Veganské jídlo nemusí být drahé. Praha nabízejí řadu míst, kde se najdete za méně než 200 Kč — a jídlo bude zdravé, chtné a syté.",
    content: `## Veganské obědy do 200 Kč v Praze: průvodce pro rozpočtově vědomé

Veganské jídlo má pověst drahé záležitosti — ale to je mylá představa. Praha nabízejí řadu míst, kde se najdete za méně než 200 Kč a jídlo bude zdravé, syté a chtné. Klíčem je vědět, kde hledat.

## Nejlepší místa pro levné veganské obědy

### Beas Dhaba (20+ poboček)
Beas Dhaba je absolutní šampion v kategorii cena/kvalita. Samoobslužný systém, kde platíte za gramme, znamená, že si každý složí talíř přesně podle chuti a rozpočtu. Průměrný oběd vyjde na 120–160 Kč. Výběr zahrnuje vždy minimálně 15 různých pokrmů.

### Country Life (Staré Město)
Country Life nabízejí bufet s bio surovinami. Ceny jsou vyšší než v Beas Dhaba, ale stále v rozumném rozsahu — oběd vyjde na 150–200 Kč. Kválita surovin je výborná.

### Sandokan Vegan Bistro (Vinohrady)
Sandokan je samoobslužný bufet s veganskými a bezlepkovými jídly. Ceny začínají od 90 Kč za malý talíř. Ideální pro rychlý oběd bez čekní.

### Loving Hut (Na Poříčí)
Loving Hut nabízejí denní menu za 130–170 Kč — polévka + hlavní jídlo. Asijská kuchyně, rychlá obsluha.

### Denní menu v běžných restauracích
Mnohé veganské restaurace nabízejí denní menu za výhodné ceny — typicky polévka + hlavní jídlo za 150–200 Kč. Pastva, Natureza a Sandokan mají denní menu pravidelně.

## Jak ušetřit na veganském jídě v Praze

**Bufetový systém:** Beas Dhaba a Sandokan nabízejí bufet, kde platíte za gramme. Stačí si dát menší talíř a ušetříte.

**Denní menu:** Většina veganských restaurací nabízejí denní menu za výhodné ceny. Typicky polévka + hlavní jídlo za 150–200 Kč.

**Obed vs. večeře:** Oběd je vždy levnější než večeře. Pokud chcete jíst v kvalitní restauraci, jděte na oběd.

**Lokace:** Restaurace mimo centrum jsou vždy levnější. Vinohrady, Žižkov a Holšovice nabízejí dobré veganské jídlo za nižší ceny než centrum.

## Srovnání cen veganských obědů v Praze

| Restaurace | Typ | Průměrná cena oběda | Čtvrť |
|---|---|---|---|
| Beas Dhaba | Indický bufet | 120–160 Kč | Centrum + |
| Sandokan | Veganský bufet | 90–160 Kč | Vinohrady |
| Loving Hut | Asijská kuchyně | 130–170 Kč | Na Poříčí |
| Country Life | Bio bufet | 150–200 Kč | Staré Město |
| Pastva | Sezónní kuchyně | 160–220 Kč | Vinohrady |

## Veganské jídlo doma: ještě levnější

Pokud chcete ušetřit ještě více, vařte doma. Naše platforma nabízejí stovky veganských receptů od jednoduchých po složité. Lugtěniny, zelenina a obiloviny jsou nejlevnější a nejzdravější základ veganské kuchyně.`,
  },
  {
    id: "9",
    slug: "veganske-pizzerie-praha-nejlepsi-pizza-bez-masa",
    title: "Veganské pizzerie v Praze: nejlepší pizza bez masa a sýra 2026",
    metaDescription:
      "Veganské pizzerie v Praze 2026 — kde dát nejlepší veganskou pizzu? Přehled podniků s veganským sýrem, toppingy a bezlepkovou móžné těstem.",
    category: "Průvodce",
    tags: ["vegan", "pizza", "Praha", "pizzerie", "veganský sýr", "bezlepkové"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-03-10",
    readingTimeMin: 6,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-veganska-pizza-9ZMbWEbZpUc5ABmuG3mxrY.webp",
    coverImageAlt: "Veganská pizza s barevnými toppingy na dřevěném prkně",
    excerpt:
      "Veganská pizza už není kompromis. Praha nabízejí řadu pizzerií, kde si dáte skutečnou italskou pizzu s veganským sýrem a čerstvými toppingy.",
    content: `## Veganská pizza v Praze: kde si dát skutečnou italskou pizzu bez sýra

Veganská pizza je jednou z nejrychleji rostoucich kategorií v pražské gastronomii. Ještě před pěti lety bylo těžké najít pizzu s veganským sýrem — dnes ji nabízejí desítky podniků. Klíčem je vědět, kde hledat a co očekávat.

## Co dělá dobrou veganskou pizzu

Dobrá veganská pizza stojí na třech pilirích: kvalitním těstu, chtné omce a dobrém veganském sýru. Veganský sýr prošel v posledních letech velkým vývojem — moderní cashew a kokosové sýry se táhnou a chtní podobně jako tradiční mozzarella.

## Nejlepší veganské pizzerie v Praze

### Pizzerie s veganským sýrem
V Praze existuje několik specializovaných veganských pizzerií a řada tradičních pizzerií, které nabízejí veganskou variantu. Při výběru se zaměřte na: zda používají kvalitní veganský sýr (ne jen vynechání sýra), zda nabízejí bezlepkove těsto a zda mají široký výběr veganských toppings.

### Tipy na toppingy
Nejlepší veganské pizzy v Praze kombinují: grilovanou zeleninu (cuketa, paprika, liščka), karamelizovanou cibuli, olivy, kapary, cherry rajská jablka, čerstvé bylinky a veganský sýr. Vyhybejte se pizzám, které pouze vynechávají sýr — to není veganská pizza, to je pizza bez sýra.

## Bezlepkové veganské těsto

Řada pizzerií v Praze nabízejí bezlepkove těsto jako příplatek (typicky 30–50 Kč). Bezlepkove těsto je často přirozeně veganské, protože neobsahuje vejce. Zeptáte se předem, zda je těsto veganské.

## Veganská pizza doma: recepty

Pokud chcete veganskou pizzu připravit doma, naše platforma nabízejí několik receptů. Cashew sýr je překvapivě jednoduchý na přípravu — stačí namocit cashew, rozmixovat s citronovou šťávou, droždovými vločkami a solí. Výsledek je kremový, chtný a táhne se podobně jako mozzarella.

## Praktické tipy pro veganské pizzomily

**Při objednávání:** Zeptáte se, zda je veganský sýr cashew nebo kokosový — cashew má lepší chutný profil. Zeptáte se také, zda je těsto veganské (některá těsta obsahují vejce).

**Toppingy:** Vyberte si pizzu s bohatými toppingy — grilovaná zelenina, olivy, kapary a čerstvé bylinky nahradí chutně maso.

**Bezlepkove těsto:** Pokud máte celiakálii, vždy upozorněte obsluhu — bezlepkove těsto musí být připraveno na odděleném povrchu.

## Veganská pizza vs. tradiční pizza: srovnání

| Aspekt | Tradiční pizza | Veganská pizza |
|---|---|---|
| Sýr | Mozzarella | Cashew/kokosový sýr |
| Těsto | často s vejci | Veganské těsto |
| Toppingy | Maso, sýr | Zelenina, houby, olivy |
| Kalorie | Vyšší | Nižší |
| Cena | Nižší | Vyšší (+30–50 Kč za veganský sýr) |`,
  },
  {
    id: "10",
    slug: "veganske-vanoce-trhy-advent-praha-co-jist",
    title: "Veganské Vánoce v Praze: co jíst na adventních trzich a kde",
    metaDescription:
      "Veganské jídlo na adventních trzich v Praze — co jíst, kde hledat veganské stánky a jak si užít Vánoce bez masa. Tipy na veganské vánoční jídlo.",
    category: "Sezónní",
    tags: ["vegan", "Vánoce", "adventní trhy", "Praha", "sezónní", "trhy"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-03-10",
    readingTimeMin: 5,
    coverImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/blog-veganske-vanoce-QxpuKksnQFmbBZtpuJJukm.webp",
    coverImageAlt:
      "Veganské jídlo na adventním trhu — teplou polevá a pečené kaštany",
    excerpt:
      "Adventní trhy v Praze jsou krásné, ale pro vegany může být těžké najít něco k jídlu. Tento průvodce vám pomůže navigovat vánoční trhy bez kompromisů.",
    content: `## Veganské jídlo na adventních trzich v Praze

Adventní trhy v Praze jsou jednou z nejkrásnějších tradic — Staroměstské náměstí, Václavské náměstí a Havelští trh jsou každý rok plné návštěvníků. Pro vegany však může být náročné najít něco k jídlu — většina stánků nabízejí klobasy, sváteční pečivo s máslem a svařené víno. Tento průvodce vám pomůže navigovat vánoční trhy bez kompromisů.

## Přirozeně veganské vánoční jídlo

Některá tradiční vánoční jídla jsou přirozeně veganská:

**Pečené kaštany** jsou jednou z nejlepších veganských možností na adventních trzich. Vonné, teplou a přirozeně veganské. Hledejte stánky s pečenými kaštany — bývají na většině trhů.

**Svařené víno** je veganské — pokud neobsahuje med. Většina svařeného vína na trzich je veganská.

**Teplou polevá** — některé stánky nabízejí zeleninové polévky, které jsou veganské. Zeptáte se předem.

**Teplou čaj** — vždy veganský, pokud neobsahuje med.

## Veganské stánky na adventních trzich

V posledních letech se na pražských adventních trzich objevívají specializované veganské stánky. Nabízejí veganské trdlo, veganské paláčinky, veganské horá čokolady a veganské pečivo. Tyto stánky jsou označeny symbolem listu nebo nápisem "veganské".

## Veganské vánoční restaurace v Praze

Pokud chcete vánoční atmosféru a veganské jídlo, některé pražské veganské restaurace nabízejí v adventním období sezónní menu:

**Maitrea** nabízejí v prosinci sezónní vánoční menu s tradičními českými jídly v veganském provedení.

**Lehká Hlava** má v adventním období sezónní menu s vánočními dezerty a teplou jídly.

**Shromaždiště** nabízejí v zimě veganské české jídlo — veganský svítkový burger, veganské knedle a teplou polévky.

## Veganské vánoční pečivo doma

Pokud chcete připravit veganské vánoční pečivo doma, naše platforma nabízejí řadu receptů. Veganské vanilkové rohlicky, veganské pernik a veganské linecké jsou překvapivě jednoduché na přípravu.

## Praktické tipy pro veganské Vánoce v Praze

**Před návštěvou trhů:** Snězte něco doma nebo v restauraci, aby jste nebyli hladoví na trhu. Možnosti pro vegany jsou omezené.

**Na trzich:** Hledejte pečené kaštany, svařené víno a teplou čaj. Zeptáte se na veganské stánky u informací.

**V restauraci:** Rezervujte si stůl v jednom z veganských podniků předem — adventní období je nejrušnější čas v roce pro pražské restaurace.`,
  },
  {
    id: "12",
    slug: "domaci-marmelada-dzem-rozdil-recepty",
    title: "Domácí marmeláda vs. džem: Jaký je v nich rozdíl a 10 nejlepších receptů",
    metaDescription: "Jaký je rozdíl mezi džemem, marmeládou a povidly? Návod na zavařování, pektin, méně cukru a recepty od meruňkové po Aperol.",
    category: "Tipy & Návody",
    tags: ["zavařování", "džem", "marmeláda", "recepty", "ovoce", "domácí"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-08-01",
    readingTimeMin: 7,
    coverImage: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
    coverImageAlt: "Sklenice s domácím meruňkovým džemem a čerstvým ovocem",
    excerpt: "Léto je v plném proudu a ovoce dozrává. Víte, jaký je přesný rozdíl mezi marmeládou, džemem a povidly podle legislativy i v praxi? Přinášíme velkého průvodce zavařováním a 10 receptů od meruňky po Aperol.",
    content: `## Jaký je rozdíl mezi džemem, marmeládou a povidly?

Při výrobě domácích sladkých zásob často používáme slova **marmeláda** a **džem** jako synonyma. Podle české i evropské legislativy je v nich ale zásadní rozdíl:

1. **Marmeláda**: Oficiálně se tímto názvem smí označovat pouze výrobky vyhotovené z **citrusových plodů** (pomeranče, citrony, grapefruity, mandarinky), a to z dužiny, kůry nebo šťávy.
2. **Džem**: Vyrábí se z jednoho nebo více druhů jiného ovoce (jahody, meruňky, borůvky) a obsahuje viditelné kousky ovoce nebo celé plody rozvařené v rosolovité hmotě.
3. **Povidla**: Vznikají odpařováním vody z ovoce (tradičně švestek či hrušek) bez přídavku rosolujících látek a s minimem přidaného cukru.

## Základní pravidla pro dokonalé zavařování

- **Čistota a sterilizace**: Sklenice i víčka důkladně umyjte a vysterilizujte v horké vodě nebo v troubě na 100 °C.
- **Kvalita ovoce**: Používejte zralé, ale pevné ovoce bez známek plísně či hniloby.
- **Pektin**: Některé ovoce (jablka, rybíz, citrusy) má přirozeně vysoký obsah pektinu. U jahod či třešní pomůže přirozený jablečný pektin nebo kapka citrónové šťávy.
- **Zkouška rosolování**: Kápněte trochu horkého džemu na vychlazený talířek. Pokud po chvíli ztuhne a neztéká, máte hotovo.

## 10 skvělých receptů z letního ovoce

### 1. Meruňkový džem s levandulí
Jemná vůně sušených levandulových květů dodá sladkým meruňkám provensálský nádech. Svařte 1 kg meruněk s 500 g cukru, citrónovou šťávou a 1 lžičkou sušených levandulových kvítků.

### 2. Ostružinový džem se skořicí
Ostružiny obsahují dostatek pektinu. V kombinaci se špetkou mleté skořice a hřebíčku vytvoříte nádherný džem s hlubokou chutí.

### 3. Džem z višní a červeného rybízu
Kyselost rybízu dokonale vyváží sladkost zralých višní. Rybíz dodá přirozenou rosolovitost bez nutnosti přidávat želírovací cukr.

### 4. Jablečný džem s vanilkou
Šťavnatá jablka nakrájená na drobné kostičky, povařená s pravou vanilkou a kapkou citronu. Ideální do ranních ovesných kaší.

### 5. Morušový džem bez pektinu
Moruše jsou sladké a šťavnaté. Vařte je zvolna s cukrem a citrónovou šťávou do lehkého zhoustnutí.

### 6. Meruňkový džem s mandlemi
Ke konci vaření přimíchejte do meruňkového džemu opražené plátky mandlí a kapku amaretta.

### 7. Rakytníkový džem se zázvorem
Vitamínová bomba pro podzimní dny. Šťávu z rakytníku svařte s jemně nastrouhaným zázvorem a cukrem.

### 8. Broskvový džem s medem a vanilkou
Zralé broskve zbavené slupky nakrájejte, ochuťte květnovým medem a vanilkovým luskem.

### 9. Marmeláda z grapefruitu a Aperolu
Originální marmeláda pro dospělé! Křupavá kůra a dužina růžového grepfrutu v kombinaci s citrónovou šťávou a šplíchem Aperolu.

### 10. Borůvkový džem s kapkou rumu
Divoké lesní borůvky svařené s trochou cukru a kapkou tuzemského rumu pro neodolatelnou vůni.`
  },
  {
    id: "13",
    slug: "francouzsky-quiche-druhy-naplni-recept",
    title: "Francouzský quiche: Jak na dokonalý slaný koláč a nejlepší bezmasé náplně",
    metaDescription: "Velký průvodce francouzským slaným koláčem quiche: recept na křehké těsto pâte brisée, smetanovou zálivku a nejlepší vegetariánské náplně.",
    category: "Tipy & Návody",
    tags: ["quiche", "francouzská kuchyně", "slaný koláč", "špenát", "pórek", "vegetariánské"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-08-02",
    readingTimeMin: 8,
    coverImage: "https://images.unsplash.com/photo-1554998171-7e599bc95ccd?auto=format&fit=crop&w=800&q=80",
    coverImageAlt: "Tradiční francouzský quiche se zeleninou a parmazánem",
    excerpt: "Francouzský quiche je ideální volbou pro sytou snídani, lehký oběd i pohoštění pro návštěvu. Naučte se základní křehké těsto pâte brisée, sametovou vaječnou zálivku a inspirujte se pestrými vegetariánskými náplněmi.",
    content: `## Co je to francouzský quiche?

**Quiche** (vyslovuje se *kiš*) je tradiční francouzský slaný koláč pocházející z regionu Lotrinsko (Quiche Lorraine). Jeho základ tvoří korpus z křehkého máslového těsta (*pâte brisée*) a bohatá náplň ze smetany, vajec a sýra.

Výhodou quiche je jeho neuvěřitelná variabilita. Můžete jej podávat horký přímo z trouby, ale stejně skvěle chutná i studený druhý den se salátem.

## 1. Základní křehké těsto (Pâte Brisée)

Klíčem k dokonalému quiche je křehký korpus, který se po upečení nerozpadá ani nenavlhne od smetanové náplně.

### Suroviny na formu o průměru 24–26 cm:
- 200 g hladké mouky
- 100 g studeného másla (nakrájeného na kostičky)
- 1/2 lžičky soli
- 1 žloutek
- 3–4 lžíce ledové vody

### Postup:
1. Mouku smíchejte se solí. Přidejte studené máslo a prsty vypracujte drobenku.
2. Vmíchejte žloutek s ledovou vodou a rychle spojte v hladké těsto.
3. Zabalte do fólie a nechte v lednici alespoň 30 minut odpočinout.
4. Vyválejte těsto, vyložte jím koláčovou formu (vymazanou a vysypanou) a dno propíchejte vidličkou.
5. **Slepé pečení (blind baking)**: Korpus vyložte pečicím papírem, zasypte zátěží (fazolemi) a předpečte 15 minut na 190 °C. Poté zátěž odstraňte a pečte ještě 5 minut.

## 2. Sametová vaječná zálivka (Liaison)

Základem náplně je smetana vyšlehaná s vejci. Dodržujte základní poměr:
- 200 ml smetany ke šlehání (min. 30 % tuku) nebo zakysané smetany
- 100 ml plnotučného mléka
- 3 celá vejce + 1 žloutek
- Špetka muškátového oříšku, sůl a čerstvě mletý pepř

## 3. Nejlepší vegetariánské variace náplní

### Špenát a kozí sýr
Podušte 250 g čerstvého baby špenátu s česnekem na másle. Rozprestřete na předpečený korpus, posypte 100 g rozdrceného čerstvého kozího sýra a zalijte smetanovou směsí.

### Pórek a Gruyère
Dva pórky nakrájejte na kolečka a zvolna poduste na másle do změknutí (cca 10 minut). Smíchejte se 100 g strouhaného francouzského sýra Gruyère nebo Emmentaler.

### Pečená dýně a listy červené řepy
Kostky dýně Hokkaido upečte v troubě s olivovým olejem a tymiánem. Zapečte v koláči spolu s listy červené řepy a feta sýrem.

### Tradiční cibulový koláč (Zwiebelkuchen)
4 velké cibule nakrájejte na plátky a karamelizujte na mírném ohni 20 minut. Vmíchejte špetku kmínu a zakysanou smetanu.

### Jarní chřestový quiche
Zelený chřest krátce povařte ve slané vodě (2 minuty) a zchlaďte v ledové vodě. Naranžujte na korpus posypaný ricottou a parmazánem a zalijte vaječnou zálivkou.`
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(p => p.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(p => p.tags.includes(tag));
}
