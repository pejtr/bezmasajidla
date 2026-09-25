// ============================================================
// BEZMASAJIDLA.CZ — Blog Data
// Editorial + SEO hub: restaurace, recepty, long-tail guides a cestování
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

import { BLOG_PLACEHOLDER, withImageFallback } from "./imageFallbacks";

const blogPostSource: BlogPost[] = [
  {
    "id": "14",
    "slug": "bezmasa-jidla-na-obed",
    "title": "Bezmasá jídla na oběd: rychlá, sytá a bez nudy",
    "metaDescription": "Tipy na bezmasá jídla na oběd: rychlé recepty, syté luštěniny, tofu, česká klasika i lehčí misky. Vyberte podle času a chuti.",
    "category": "Recepty",
    "tags": [
      "bezmasá jídla",
      "oběd",
      "rychlé recepty",
      "vegetariánské recepty",
      "vegan"
    ],
    "author": "Sofie — virtuální food & lifestyle redaktorka",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 9,
    "coverImage": "/images/recipes/grilovana-zelenina-a-tofu-s-hummusovym-dipem.webp",
    "coverImageAlt": "Bezmasý oběd s grilovanou zeleninou, tofu a hummusem",
    "excerpt": "Když chcete oběd bez masa, který opravdu zasytí, rozhoduje hlavně kombinace bílkovin, přílohy, zeleniny a výrazné chuti. Tady je praktický výběr podle času i nálady.",
    "content": "## Bezmasý oběd nemusí znamenat „něco místo masa“\n\nNejlepší bezmasá jídla na oběd nejsou náhražka. Jsou to normální, plnohodnotná jídla postavená na chuti, struktuře a sytosti. Když nechcete po obědě za hodinu znovu hledat svačinu, pomáhá myslet na čtyři věci: zdroj bílkovin, přílohu, zeleninu a omáčku nebo koření, které celé jídlo spojí.\n\n### Když máte do 20 minut\n\nZačněte jídly, kde není dlouhé pečení ani několik hrnců. [Vegánská míchaná vajíčka z tofu](/recepty/veganska-michana-vajicka-z-tofu) zvládnete přibližně za 20 minut a hodí se i jako rychlý slaný oběd. [Veganské krevety se zeleninou](/recepty/veganske-krevety-se-zeleninou) jsou další rychlá varianta a [grilovaná zelenina s tofu a hummusovým dipem](/recepty/grilovana-zelenina-a-tofu-s-hummusovym-dipem) funguje dobře ve chvíli, kdy chcete něco lehčího, ale ne jen salát.\n\n### Když chcete něco opravdu sytého\n\nPro větší hlad fungují jídla s tofu, tempehem, luštěninami nebo rostlinnou alternativou masa. Z našich receptů zkuste [veganskou kachnu se špenátem a bramborovým knedlíkem](/recepty/veganska-kachna-se-spenatem-a-knedlikem), [veganské kuře na paprice s těstovinami](/recepty/veganske-kure-na-paprice-s-testovinami) nebo [plněné bramborové knedlíky s uzeným tofu](/recepty/plnene-bramborove-knedliky-s-uzenym-tofu).\n\nPokud máte raději luštěniny, dobrým základem je [čočka s kořenovou zeleninou](/recepty/cocka-s-korenovou-zeleninou), [falafel a hummus v pita chlebu](/recepty/falafel-a-hummus-v-pita-chlebu) nebo [fazolová polévka s veganským chorizem](/recepty/fazolova-polevka-s-veganskym-chorizem).\n\n### Oběd do krabičky\n\nDo práce nebo školy jsou praktická jídla, která drží tvar a chutnají i po několika hodinách. Výborně funguje [celozrnný těstovinový salát se sušenými rajčaty a tofu](/recepty/celozrnny-testovinovy-salat-se-susenymi-rajcaty-a-tofu), [pohankový salát s tempehem a grilovanou zeleninou](/recepty/pohankovy-salat-s-tempehem-a-grilovanou-zeleninou) nebo [tabbouleh z celozrnného bulguru s marinovaným tofu](/recepty/salat-tabbouleh-z-celozrnneho-bulguru-s-marinovanym-tofu).\n\n### Český oběd bez masa\n\nPokud nechcete bowl ani hummus, bezmasý oběd může být úplně klasický. [Pravá krkonošská kulajda](/recepty/prava-krkonosska-kulajda), [bramboračka s lesními houbami](/recepty/bramboracka-s-lesnimi-houbami) nebo [veganský kuřecí řízek s bramborovou kaší](/recepty/vegansky-kureci-rizek-s-bramborovou-kasi) jsou přesně ten typ jídla, který nepůsobí jako dietní kompromis.\n\n## Jak si vybrat oběd podle toho, co dnes potřebujete\n\n- **Do 20 minut:** tofu scramble, rychlá pánev, salát s tofu.\n- **Na velký hlad:** luštěniny, tempeh, seitan, tofu a vydatná příloha.\n- **Do krabičky:** obilovinový nebo těstovinový salát, bowl, pita.\n- **Česká chuť:** polévky, knedlíky, omáčky a bramborová jídla.\n- **Lehčí oběd:** zelenina + hummus/tahini + tofu nebo tempeh.\n\nDalší recepty najdete v našem hlavním přehledu [bezmasých jídel a receptů](/recepty). Pokud chcete plánovat dopředu, otevřete si také [týdenní bezmasý jídelníček](/tydenni-planovac-receptu)."
  },
  {
    "id": "15",
    "slug": "bezmasa-jidla-pro-deti",
    "title": "Bezmasá jídla pro děti: co vařit, když nechcete boj u stolu",
    "metaDescription": "Bezmasá jídla pro děti: známé chutě, jednoduché textury, recepty do školy i na rodinný oběd. Praktické tipy bez moralizování.",
    "category": "Rodiny",
    "tags": [
      "bezmasá jídla pro děti",
      "děti",
      "rodina",
      "oběd",
      "vegetariánské recepty"
    ],
    "author": "Sofie — virtuální food & lifestyle redaktorka",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 9,
    "coverImage": "/images/recipes/pohankove-livance-s-jahodami.webp",
    "coverImageAlt": "Bezmasé jídlo pro děti v podobě lívanců s jahodami",
    "excerpt": "U dětí často nevyhrává nejzdravěji vypadající talíř, ale známá forma, jednoduchá chuť a možnost vybrat si. Bezmasé jídlo se tomu může přizpůsobit bez zbytečných triků.",
    "content": "## U dětí začněte známou formou, ne přednáškou\n\nKdyž dítě odmítne nové jídlo, obvykle nepomůže vysvětlovat, proč je čočka zdravá. Mnohem praktičtější je nabídnout známý formát: placičku, těstoviny, tortillu, polévku, kaši nebo něco, co si může samo poskládat.\n\nBezmasé vaření pro děti proto nemusí být o „náhradách“. Často stačí upravit jídla, která už rodina zná.\n\n### Snídaně nebo lehký oběd\n\n[Pohankové lívance s jahodami](/recepty/pohankove-livance-s-jahodami), [kynuté lívance v americkém duchu](/recepty/kynute-livance-v-americkem-duchu) nebo [chia ovesná kaše s borůvkami](/recepty/pres-noc-namocena-chia-ovesna-kase-s-boruvkami) mají pro děti výhodu: jejich forma je známá a jednotlivé toppingy lze servírovat zvlášť.\n\n### Jídla, která se dají držet v ruce\n\nDobře fungují jídla, která dítě nemusí složitě krájet. [Falafel a hummus v pita chlebu](/recepty/falafel-a-hummus-v-pita-chlebu) můžete servírovat po jednotlivých částech. Podobně funguje [bagetka s uzeným tofu a karamelizovanou cibulkou](/recepty/bagetka-s-uzenym-tofu-a-karamelizovanou-cibulkou) — u menších dětí jen zjednodušte množství výrazných ingrediencí.\n\n### Když dítě chce „normální jídlo“\n\nTo je úplně v pořádku. [Veganský kuřecí řízek s bramborovou kaší](/recepty/vegansky-kureci-rizek-s-bramborovou-kasi), [veganské kuře na paprice s těstovinami](/recepty/veganske-kure-na-paprice-s-testovinami) nebo [bramborový salát s domácí sójanézou](/recepty/bramborovy-salat-s-domaci-sojanezou) pracují s tvarem a chutí, které jsou v české domácnosti běžné.\n\n### Polévky jako bezpečná cesta k zelenině a luštěninám\n\nU hladkých polévek dítě nemusí řešit jednotlivé kousky zeleniny. Zkuste [brokolicovou polévku s hráškem](/recepty/brokolicova-polevka-s-hraskem), [krémovou cizrnovou polévku](/recepty/kremova-cizrnova-polevka) nebo [lehce pikantní dýňovou polévku](/recepty/lehce-pikantni-dynova-polevka-s-dynovym-olejem). Pálivost samozřejmě upravte podle věku a zvyku dítěte.\n\n## Pět pravidel, která v běžné rodině pomáhají\n\n1. **Nedávejte na talíř deset novinek najednou.** Jedna nová surovina vedle známého jídla je snazší začátek.\n2. **Servírujte některé části zvlášť.** Dítě si může samo přidat hummus, zeleninu nebo omáčku.\n3. **Nechte dítě pomáhat.** Míchání těsta, skládání pity nebo zdobení kaše zvyšuje zájem o výsledek.\n4. **Myslete na sytost.** Bezmasý talíř není jen zelenina; přidejte luštěniny, tofu, vejce, mléčný výrobek nebo jiný vhodný zdroj bílkovin podle stylu rodiny.\n5. **Neoznačujte jídlo jako „speciální vegan verzi“, pokud to není potřeba.** Pro dítě je důležitější, zda mu chutná.\n\n### Do školy a do krabičky\n\nDo krabičky se hodí [kuskusový salát s brusinkami a mandlemi](/recepty/kuskusovy-salat-s-brusinkami-a-mandlemi), [celozrnný těstovinový salát s tofu](/recepty/celozrnny-testovinovy-salat-se-susenymi-rajcaty-a-tofu) nebo domácí hummus s pečivem a zeleninou.\n\nPokud hledáte další inspiraci, pokračujte na [bezmasá jídla na oběd](/blog/bezmasa-jidla-na-obed) nebo do hlavního přehledu [receptů bez masa](/recepty)."
  },
  {
    "id": "16",
    "slug": "bezmasa-jidla-plna-bilkovin",
    "title": "Bezmasá jídla plná bílkovin: konkrétní recepty a čísla",
    "metaDescription": "Bezmasá jídla plná bílkovin: tofu, luštěniny, tempeh a další recepty. U vybraných jídel uvádíme protein podle našich receptových výpočtů.",
    "category": "Výživa",
    "tags": [
      "bílkoviny",
      "protein",
      "bezmasá jídla",
      "tofu",
      "luštěniny",
      "fitness"
    ],
    "author": "Sofie — virtuální food & lifestyle redaktorka",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 10,
    "coverImage": "/images/recipes/veganska-michana-vajicka-z-tofu.webp",
    "coverImageAlt": "Vegánská míchaná vajíčka z tofu jako bezmasé jídlo plné bílkovin",
    "excerpt": "Bílkoviny bez masa nejsou problém, když jídlo nestavíte jen na zelenině. Vybrali jsme konkrétní recepty s tofu, luštěninami a rostlinnými alternativami.",
    "content": "## Kde vzít bílkoviny, když jídlo nestavíte na mase\n\nBezmasý talíř může mít dost bílkovin, ale nevznikne to automaticky. Salát z listové zeleniny je skvělá příloha; jako hlavní jídlo potřebuje něco navíc. Praktickým základem jsou tofu, tempeh, luštěniny, seitan, vejce a mléčné výrobky podle toho, zda jíte vegansky nebo vegetariánsky.\n\n**Čísla níže vycházejí z nutričních výpočtů uvedených u našich receptů.** Reálná hodnota se může měnit podle značek surovin a velikosti porce.\n\n| Recept | Bílkoviny podle receptu |\n|---|---:|\n| [Veganská kachna se špenátem a knedlíkem](/recepty/veganska-kachna-se-spenatem-a-knedlikem) | 26 g |\n| [Sport smoothie s plant-based proteinem](/recepty/sport-smoothie-s-proteinem) | 25 g |\n| [Veganské kuřecí špízy se třemi omáčkami](/recepty/veganske-kureci-spizy-se-tremi-omacami) | 24 g |\n| [Veganský Burger XXL](/recepty/vegansky-burger-xxl) | 24 g |\n| [Rýžové nudle s veganským kuřecím masem a teriyaki](/recepty/ryzove-nudle-s-veganskym-kurecim-masem-a-teriyaki) | 22 g |\n| [Veganské kuře na paprice s těstovinami](/recepty/veganske-kure-na-paprice-s-testovinami) | 22 g |\n| [Veganský kuřecí řízek s bramborovou kaší](/recepty/vegansky-kureci-rizek-s-bramborovou-kasi) | 20 g |\n| [Čočka s kořenovou zeleninou](/recepty/cocka-s-korenovou-zeleninou) | 19 g |\n| [Osso Buco z marinovaného tofu](/recepty/osso-buco-z-marinovaneho-tofu) | 19 g |\n| [Vegánská míchaná vajíčka z tofu](/recepty/veganska-michana-vajicka-z-tofu) | 18 g |\n| [Falafel a hummus v pita chlebu](/recepty/falafel-a-hummus-v-pita-chlebu) | 18 g |\n| [Plněné bramborové knedlíky s uzeným tofu](/recepty/plnene-bramborove-knedliky-s-uzenym-tofu) | 18 g |\n\n### Tofu: nejjednodušší univerzální základ\n\nTofu může být snídaně, rychlá pánev, náplň i hlavní chod. Pokud vám připadá bez chuti, problém obvykle není tofu samotné, ale způsob přípravy. Marinování, opečení do křupava a výrazná omáčka udělají velký rozdíl.\n\nZačněte [míchaným tofu](/recepty/veganska-michana-vajicka-z-tofu), [grilovanou zeleninou s tofu a hummusem](/recepty/grilovana-zelenina-a-tofu-s-hummusovym-dipem) nebo [Osso Buco z marinovaného tofu](/recepty/osso-buco-z-marinovaneho-tofu).\n\n### Luštěniny: levné a praktické\n\nČočka, fazole a cizrna přidávají nejen bílkoviny, ale i vlákninu a objem. Praktická je [čočka s kořenovou zeleninou](/recepty/cocka-s-korenovou-zeleninou), [fazolová polévka s veganským chorizem](/recepty/fazolova-polevka-s-veganskym-chorizem) nebo [krémová cizrnová polévka](/recepty/kremova-cizrnova-polevka).\n\n### Bílkoviny nejsou jediná metrika\n\nVyšší číslo není automaticky lepší jídlo. Dává smysl hlídat i zeleninu, vlákninu, energii, tuky a hlavně to, zda vám jídlo dlouhodobě vyhovuje.\n\nPro další výběr pokračujte na [bezmasá jídla na oběd](/blog/bezmasa-jidla-na-obed) nebo filtrujte kompletní [databázi receptů](/recepty)."
  },
  {
    "id": "17",
    "slug": "bezmasa-jidla-z-jednoho-hrnce",
    "title": "Bezmasá jídla z jednoho hrnce: minimum nádobí, maximum chuti",
    "metaDescription": "Bezmasá jídla z jednoho hrnce: polévky, luštěniny a jednoduché večeře, které šetří čas i nádobí. Praktické tipy a recepty.",
    "category": "Recepty",
    "tags": [
      "z jednoho hrnce",
      "one pot",
      "bezmasá jídla",
      "rychlá večeře",
      "oběd"
    ],
    "author": "Sofie — virtuální food & lifestyle redaktorka",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 8,
    "coverImage": "/images/recipes/cocka-s-korenovou-zeleninou.webp",
    "coverImageAlt": "Čočka s kořenovou zeleninou jako bezmasé jídlo z jednoho hrnce",
    "excerpt": "Když nechcete po vaření uklízet půl kuchyně, one-pot jídla jsou jednoduché řešení. Nejlépe fungují polévky, luštěniny, kari a dušená zelenina.",
    "content": "## Proč fungují jídla z jednoho hrnce\n\nOne-pot vaření není jen trend. Je to dobrý systém pro všední den: jedna nádoba, méně kroků a možnost nechat suroviny vařit společně tak, aby se chutě propojily.\n\nNejlépe se pro tento styl hodí polévky, luštěniny, kari, ragú a dušená zelenina.\n\n### Luštěniny jako základ\n\n[Čočka s kořenovou zeleninou](/recepty/cocka-s-korenovou-zeleninou) je přesně typ receptu, který nepotřebuje komplikovanou sestavu nádobí. Podobně funguje [fazolová polévka s veganským chorizem](/recepty/fazolova-polevka-s-veganskym-chorizem) nebo [krémová cizrnová polévka](/recepty/kremova-cizrnova-polevka).\n\n### Krémové polévky\n\nPokud chcete minimum práce, polévka je skoro ideální. Zkuste [brokolicovou polévku s hráškem](/recepty/brokolicova-polevka-s-hraskem), [dýňovou polévku s dýňovým olejem](/recepty/lehce-pikantni-dynova-polevka-s-dynovym-olejem), [veganskou kulajdu s hříbky a koprem](/recepty/veganska-kulajda-s-hribky-a-koprem) nebo [bramboračku s lesními houbami](/recepty/bramboracka-s-lesnimi-houbami).\n\n### Jeden hrnec neznamená jednu chuť\n\nRozdíl dělá pořadí. Nejprve rozvoňte cibuli a koření, pak přidejte pevnější zeleninu, tekutinu a nakonec suroviny, které potřebují jen krátce prohřát. U smetanových nebo kokosových jídel přidávejte krémovou složku až ke konci.\n\n### Co mít doma pro one-pot večeře\n\nDobrá základní zásoba je jednoduchá: konzerva cizrny nebo fazolí, čočka, rajčata, kokosové mléko, vývar, cibule, česnek a několik směsí koření. Z čerstvých věcí pak stačí přidat to, co máte právě v lednici.\n\nPokud vás zajímá hlavně rychlost, pokračujte také na [bezmasá jídla na oběd](/blog/bezmasa-jidla-na-obed) a [rychlé bezmasé večeře](/recepty/rychle-bezmase-vecere)."
  },
  {
    "id": "18",
    "slug": "bezmasa-jidla-z-testovin",
    "title": "Bezmasá jídla z těstovin: co uvařit podle toho, co máte doma",
    "metaDescription": "Bezmasá jídla z těstovin: rychlé omáčky, tofu, zelenina, saláty i sytější varianty. Praktický přehled podle surovin v lednici.",
    "category": "Ingredience",
    "tags": [
      "těstoviny",
      "bezmasá jídla",
      "rychlé recepty",
      "oběd",
      "večeře"
    ],
    "author": "Sofie — virtuální food & lifestyle redaktorka",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 8,
    "coverImage": "/images/recipes/veganske-kure-na-paprice-s-testovinami.webp",
    "coverImageAlt": "Veganské kuře na paprice s těstovinami",
    "excerpt": "Těstoviny jsou nejlepší záchrana ve chvíli, kdy doma není plán. Místo jednoho univerzálního receptu se vyplatí vybírat podle toho, co už máte v lednici.",
    "content": "## Máte těstoviny. Co k nim?\n\nTěstoviny jsou skvělý základ právě proto, že se nemusíte držet jedné kuchyně. Rajčata, houby, špenát, tofu, luštěniny i krémová omáčka umí vytvořit úplně jiné jídlo.\n\n### Když máte tofu\n\nTofu přidejte opečené do křupava nebo rozdrobené do omáčky. Inspirací může být [veganské kuře na paprice s těstovinami](/recepty/veganske-kure-na-paprice-s-testovinami), kde je rostlinná bílkovina součástí hlavního chodu, ne jen doplněk.\n\n### Když chcete studený oběd do krabičky\n\n[Celozrnný těstovinový salát se sušenými rajčaty a tofu](/recepty/celozrnny-testovinovy-salat-se-susenymi-rajcaty-a-tofu) funguje jako oběd do práce i jako příloha na piknik. Výhodou je, že nepotřebuje ohřívání.\n\n### Rajčatová omáčka\n\nZáklad z cibule, česneku a rajčat je nejjednodušší způsob, jak těstoviny rychle dostat na stůl. Pro větší sytost přidejte cizrnu, čočku nebo opečené tofu. Pro intenzivnější chuť pomohou sušená rajčata, olivy, kapary nebo chilli.\n\n### Houby\n\nHouby potřebují dostatečně rozpálenou pánev, aby se opékaly a nezačaly se jen dusit ve vlastní vodě. Pak je spojte se smetanovou nebo rostlinnou omáčkou, česnekem a pepřem.\n\n### Špenát a zelené omáčky\n\nŠpenát je rychlý: stačí několik minut. Funguje s česnekem, citronem a krémovým základem. Pro více bílkovin přidejte tofu nebo luštěninovou pomazánku rozředěnou trochou vody z těstovin.\n\n### Jak udělat omáčku lepší bez dalšího receptu\n\nNež slijete těstoviny, nechte si stranou hrnek škrobové vody. Po lžících ji vmíchejte do omáčky. Pomůže propojit tuk, koření a omáčku s těstovinami a často udělá větší rozdíl než další ingredience.\n\nDalší inspiraci najdete v přehledu [bezmasých jídel na oběd](/blog/bezmasa-jidla-na-obed) a v kompletní databázi [receptů bez masa](/recepty)."
  },
  {
    "id": "19",
    "slug": "bezmasa-jidla-z-brambor",
    "title": "Bezmasá jídla z brambor: levná, sytá a poctivá inspirace",
    "metaDescription": "Bezmasá jídla z brambor: polévky, saláty, knedlíky i hlavní chody. Inspirace pro levný a sytý oběd bez masa.",
    "category": "Ingredience",
    "tags": [
      "brambory",
      "bezmasá jídla",
      "levná jídla",
      "česká kuchyně",
      "oběd"
    ],
    "author": "Zakladatel BezmasáJídla.cz",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 8,
    "coverImage": "/images/recipes/plnene-bramborove-knedliky-s-uzenym-tofu.webp",
    "coverImageAlt": "Plněné bramborové knedlíky s uzeným tofu",
    "excerpt": "Brambory jsou možná obyčejné, ale právě v bezmasé kuchyni umí být jeden z nejuniverzálnějších základů: polévka, salát, kaše, knedlíky i hlavní chod.",
    "content": "## Brambory nejsou příloha. Klidně mohou být hlavní jídlo.\n\nKdyž mám doma brambory, nepřemýšlím automaticky nad tím, co k nim přidat za maso. Mnohem zajímavější je rozhodnout se, jestli z nich chci udělat něco křupavého, krémového, plněného nebo úplně klasického.\n\n### Plněné a knedlíkové varianty\n\n[Plněné bramborové knedlíky s uzeným tofu](/recepty/plnene-bramborove-knedliky-s-uzenym-tofu) jsou přesně příklad jídla, kde maso vůbec nechybí. Uzené tofu dodá výraznou chuť a bramborové těsto udělá z jídla plnohodnotný oběd.\n\n### Brambory v české polévce\n\n[Bramboračka s lesními houbami](/recepty/bramboracka-s-lesnimi-houbami) stojí na bramborách, kořenové zelenině a houbách. Není potřeba ji „veganizovat“ složitou náhražkou; stačí dobrý základ a správné koření.\n\n### Salát bez klasické majonézy\n\n[Bramborový salát s domácí sójanézou](/recepty/bramborovy-salat-s-domaci-sojanezou) ukazuje, že i velmi známé jídlo jde posunout jinam bez ztráty jeho charakteru.\n\n### Bramborová kaše jako základ sytého talíře\n\nU [veganského kuřecího řízku s bramborovou kaší](/recepty/vegansky-kureci-rizek-s-bramborovou-kasi) je bramborová část stejně důležitá jako hlavní protein. Když do kaše přidáte kvalitní tuk, dobře ji osolíte a nepřepracujete ji, není to „jen příloha“.\n\n### Co ještě z brambor\n\nBrambory můžete péct s kořenovou zeleninou, udělat z nich placky, noky, kaši, zapečenou směs nebo základ husté polévky. Pokud chcete jídlo s vyšším obsahem bílkovin, kombinujte je s tofu, tempehem, luštěninami, vejci nebo mléčnými výrobky podle toho, jak se stravujete.\n\nDalší českou inspiraci najdete v [bezmasých receptech](/recepty) a v článku [bezmasá jídla na oběd](/blog/bezmasa-jidla-na-obed)."
  },
  {
    "id": "20",
    "slug": "bezmasy-jidelnicek-na-7-dni",
    "title": "Bezmasý jídelníček na 7 dní: 14 jídel a jednoduchý nákupní systém",
    "metaDescription": "Bezmasý jídelníček na 7 dní: snídaně, obědy a večeře z receptů BezmasáJídla.cz. Praktický plán a cesta k nákupnímu seznamu.",
    "category": "Jídelníček",
    "tags": [
      "jídelníček",
      "7 dní",
      "meal prep",
      "bezmasá jídla",
      "nákupní seznam"
    ],
    "author": "Sofie — virtuální food & lifestyle redaktorka",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 10,
    "coverImage": "/images/recipes/pohankovy-salat-s-tempehem-a-grilovanou-zeleninou.webp",
    "coverImageAlt": "Bezmasý týdenní jídelníček s tempehem, zeleninou a přílohami",
    "excerpt": "Nejtěžší na vaření často není recept, ale rozhodnutí co dnes uvařit. Tady je týdenní plán, který střídá rychlá jídla, českou klasiku i krabičky.",
    "content": "## Jeden plán je lepší než sedm večerních rozhodnutí\n\nBezmasý jídelníček nemusí znamenat sedm dní salátu. Smyslem týdne je střídat luštěniny, tofu, zeleninu, obiloviny a jídla, která jsou prostě dobrá.\n\nPro přesné plánování můžete použít náš [Týdenní plánovač receptů](/tydenni-planovac-receptu). Níže je jednoduchý startovní návrh.\n\n| Den | Hlavní jídlo | Druhé jídlo / krabička |\n|---|---|---|\n| Pondělí | [Čočka s kořenovou zeleninou](/recepty/cocka-s-korenovou-zeleninou) | [Chia ovesná kaše s borůvkami](/recepty/pres-noc-namocena-chia-ovesna-kase-s-boruvkami) |\n| Úterý | [Rýžové nudle s teriyaki](/recepty/ryzove-nudle-s-veganskym-kurecim-masem-a-teriyaki) | [Kuskusový salát](/recepty/kuskusovy-salat-s-brusinkami-a-mandlemi) |\n| Středa | [Veganské kuře na paprice](/recepty/veganske-kure-na-paprice-s-testovinami) | [Brokolicová polévka s hráškem](/recepty/brokolicova-polevka-s-hraskem) |\n| Čtvrtek | [Falafel a hummus v pita chlebu](/recepty/falafel-a-hummus-v-pita-chlebu) | [Pohankový salát s tempehem](/recepty/pohankovy-salat-s-tempehem-a-grilovanou-zeleninou) |\n| Pátek | [Veganský Burger XXL](/recepty/vegansky-burger-xxl) | [Krémová cizrnová polévka](/recepty/kremova-cizrnova-polevka) |\n| Sobota | [Veganská kachna se špenátem a knedlíkem](/recepty/veganska-kachna-se-spenatem-a-knedlikem) | [Pohankové lívance s jahodami](/recepty/pohankove-livance-s-jahodami) |\n| Neděle | [Grilovaná zelenina a tofu s hummusem](/recepty/grilovana-zelenina-a-tofu-s-hummusovym-dipem) | [Celozrnný těstovinový salát](/recepty/celozrnny-testovinovy-salat-se-susenymi-rajcaty-a-tofu) |\n\n### Jak z toho udělat nákup, ne chaos\n\nNejprve si projděte spíž. Rýže, těstoviny, luštěniny, koření a olej není potřeba kupovat znovu každý týden. Pak spojte čerstvé položky napříč recepty: jedna várka mrkve může jít do čočky, polévky i salátu; tofu se dá rozdělit mezi dvě jídla.\n\n### Uvařte některé věci dvakrát\n\nLuštěninová jídla, polévky a saláty do krabičky se vyplatí dělat ve větší dávce. Nejde o to jíst celý týden totéž, ale mít jeden nebo dva hotové základy, když není čas.\n\n### Nakoupit celý týden\n\nNa [Týdenním plánovači](/tydenni-planovac-receptu) postupně propojujeme recepty s nákupním košíkem. Cíl je jednoduchý: vybrat týden, upravit jídla a převést ingredience do jednoho nákupního seznamu.\n\nPokud nechcete plánovat celý týden, začněte jen článkem [bezmasá jídla na oběd](/blog/bezmasa-jidla-na-obed)."
  },
  {
    "id": "21",
    "slug": "bezmasa-jidla-do-skolni-jidelny",
    "title": "Bezmasá jídla do školní jídelny: co musí fungovat nutričně i provozně",
    "metaDescription": "Bezmasá jídla do školní jídelny: bílkoviny, známé chutě, velkoobjemová příprava a inspirace na jídla, která lze přizpůsobit školnímu provozu.",
    "category": "Školní jídelna",
    "tags": [
      "školní jídelna",
      "bezmasá jídla",
      "děti",
      "bílkoviny",
      "hromadné stravování"
    ],
    "author": "Redakce BezmasáJídla.cz",
    "publishedAt": "2026-09-22",
    "readingTimeMin": 10,
    "coverImage": "/images/recipes/fazolova-polevka-s-veganskym-chorizem.webp",
    "coverImageAlt": "Čočkové bezmasé jídlo vhodné jako inspirace pro školní stravování",
    "excerpt": "Školní jídelna potřebuje něco jiného než instagramový recept: jídlo musí být výživově smysluplné, cenově zvládnutelné, škálovatelné a pro děti srozumitelné.",
    "content": "## Ve školní jídelně nerozhoduje jen recept\n\nBezmasé jídlo pro školní provoz musí projít několika filtry najednou: výživová hodnota, cena surovin, dostupnost, práce kuchyně, alergeny, přijetí dětmi a pravidla školního stravování. Proto není dobrý nápad jen vzít domácí recept a vynásobit ho stem.\n\nTento článek je inspirace pro skladbu jídel; konkrétní jídelníček musí vždy odpovídat aktuálním pravidlům školního stravování a odbornému nutričnímu posouzení.\n\n### 1. Stavte jídlo kolem skutečného zdroje bílkovin\n\nU bezmasého oběda nestačí odstranit maso z omáčky. Použít lze luštěniny, tofu, tempeh, vejce nebo mléčné výrobky podle typu jídla a režimu jídelny.\n\nJako inspirace funguje [čočka s kořenovou zeleninou](/recepty/cocka-s-korenovou-zeleninou), [krémová cizrnová polévka](/recepty/kremova-cizrnova-polevka) nebo [fazolová polévka s veganským chorizem](/recepty/fazolova-polevka-s-veganskym-chorizem). Pro domácí měřítko mají jasnou strukturu, kterou lze technologicky dále upravit pro velkokapacitní kuchyni.\n\n### 2. Známá forma snižuje odpor\n\nDětem může být bližší známý tvar nebo omáčka než úplně nové jídlo. Inspirací může být [veganský řízek s bramborovou kaší](/recepty/vegansky-kureci-rizek-s-bramborovou-kasi) nebo [veganské kuře na paprice s těstovinami](/recepty/veganske-kure-na-paprice-s-testovinami). Pro školní provoz je samozřejmě nutné zvolit vhodnou surovinu, technologii a porci.\n\n### 3. Luštěniny zavádějte chytře\n\nMísto velké porce čistých luštěnin lze začít polévkami, pomazánkami, směsmi nebo jídly, kde je luštěnina součástí známého celku. Pomoci může i [cizrnový hummus](/recepty/cikrnovy-hummus-na-mnoho-zpusobu).\n\n### 4. Myslete na logistiku\n\nPro školní kuchyni je výhodné, když jídlo:\n- lze připravit ve velké dávce,\n- dobře drží kvalitu při výdeji,\n- nevyžaduje desítky individuálních dokončovacích kroků,\n- má jasně zvládnutelné alergeny,\n- používá dostupné suroviny.\n\nZ tohoto pohledu bývají praktičtější polévky, luštěninová ragú, omáčky, pečená jídla a některé obilovinové směsi než komplikované minutky.\n\n### 5. Ptejte se dětí\n\nNejlepší jídelníček nevznikne jen od stolu. Malé ochutnávky, hlasování mezi dvěma variantami nebo sledování skutečných zbytků mohou ukázat víc než obecné představy o tom, co děti „mají rády“.\n\nPro domácí inspiraci rodičům doporučujeme také článek [bezmasá jídla pro děti](/blog/bezmasa-jidla-pro-deti). Pro jídelny chceme postupně připravit samostatnou databázi receptur vhodných k velkoobjemovému provozu, oddělenou od běžných domácích receptů."
  },
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

Budapešť otevírá naši novou rubriku **Cestování**. V dalších průvodcích se zaměříme především na **Krakov a Varšavu**, následovat budou vybraná města v Itálii a Francii. Stejně jako zde budeme odlišovat ověřené aktuální ceny od starších nebo nedoložených údajů.

Pokud plánujete gastronomické zážitky doma v Praze, prozkoumejte náš [přehled nejlepších veganských restaurací v Praze pro rok 2026](/blog/top-10-veganskych-restauraci-praha-2026), tipy na [zdravé obědy do 200 Kč](/blog/zdrave-obedy-do-200-kc-vegan-praha) nebo kompletní [interaktivní mapu restaurací](/mapa).`,
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

Praha se v posledních letech proměnila v jedno z nejpřívětivějších měst pro vegany ve střední Evropě. Zatímco ještě před deseti lety bylo obtížné najít restauraci s více než jedním bezmasým jídlem, dnes nabízí hlavní město desítky podniků zaměřených výhradně nebo převážně na rostlinnou stravu.

Podívejte se také na náš kompletní přehled [veganských restaurací v Praze](/restaurace/veganske-restaurace-praha), [vegetariánských restaurací](/restaurace/vegetarianske-restaurace-praha) a prozkoumejte naši [interaktivní mapu podniků](/mapa).

Tento přehled vychází z hodnocení naší komunity a zohledňuje kvalitu surovin, stálost chutí, atmosféru, poměr ceny a zážitku i dostupnost.

## 1. [Maitrea](/restaurace/maitrea) (Staré Město)

[Maitrea](/restaurace/maitrea) v srdci [Starého Města](/restaurace/praha/stare-mesto) v Týnské uličce patří dlouhodobě mezi absolutní špičku pražské bezmasé gastronomie. Interiér inspirovaný feng-shui s tekoucí fontánou, klidná atmosféra a precizně vyladěná jídla z ní dělají ideální místo pro slavnostní večeři i klidný polední oběd. V menu najdete asijské speciality, burgery i české klasiky v moderním rostlinném hávu.

## 2. [Lehká Hlava](/restaurace/lehka-hlava) (Staré Město)

Sesterský podnik Maitrey, legendární [Lehká Hlava](/restaurace/lehka-hlava) v malebné uličce Boršov u Vltavy, okouzlí hvězdným nebem na stropě a útulným historickým prostorem. Patří k nejznámějším vegetariánským a veganským podnikům v republice. Vyhlášené jsou jejich pomazánky, bezlepkové tacos, pečené lilky i pestrá denní menu. Rezervace předem je zde téměř nutností.

## 3. [Palo Verde](/restaurace/palo-verde) (Vinohrady / Nové Město)

[Palo Verde](/restaurace/palo-verde) představuje moderní prémiové rostlinné bistro a kavárnu. Specializuje se na bezchybné brunche, mandlové croissanty, domácí těstoviny a vyladěná hlavní jídla ze sezónních surovin. Pokud hledáte stylové prostředí a jídlo, které nadchne i náročné gurmány z řad neveganů, Palo Verde je sázka na jistotu.

## 4. [Pastva](/restaurace/pastva) (Smíchov)

[Pastva](/restaurace/pastva) na pražském [Smíchově](/restaurace/praha/smichov) (kousek od Anděla) je synonymem pro kreativní a poctivé vaření. Jejich týdenní obědová meníčka plná čerstvé zeleniny, luštěnin a domácích omáček patří k nejoblíbenějším v celém městě. Stálý lístek nabízí legendární Pastva burger, sezónní rizota i domácí raw a pečené dezerty.

## 5. [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) (Centrum & celá Praha)

Indická samoobslužná síť [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) s více než 20 pobočkami je stálicí pražského rychlého stravování. Díky váhovému bufetu platíte pouze za to, co si naložíte. Denně nabízejí čerstvé sabdží, luštěninový dál, několik druhů rýže, čerstvý chléb i saláty. Pobočky najdete na [Starém Městě](/restaurace/praha/stare-mesto), na [Vinohradech](/restaurace/beas-dhaba-belehradska) i v [Karlíně](/restaurace/beas-dhaba-karlin).

## 6. [Loving Hut](/restaurace/loving-hut-na-porici) (Na Poříčí & další pobočky)

[Loving Hut — Na Poříčí](/restaurace/loving-hut-na-porici) a sesterské pobočky v nákupních centrech představují spolehlivou asijskou rostlinnou kuchyni. Nabízejí pestrý polední bufet i bohaté à la carte menu plné polévek pho, pad thai, křupavých rolek a tofu v různých omáčkách za velmi vstřícné ceny.

## 7. [Chutnej](/restaurace/chutnej) (Holešovice)

[Chutnej](/restaurace/chutnej) v Holešovicích je rájem pro milovníky 100% rostlinného comfort foodu. Jejich veganská pizza z pomalu kynutého těsta, křupavé bezlepkové pizzy i vyladěné burgery s domácími hranolky dokazují, že rostlinný fast casual styl snese ta nejpřísnější italská a americká měřítka.

## 8. [Střecha](/restaurace/strecha) (Nové Město)

Sociální veganské bistro [Střecha](/restaurace/strecha) v Křemencově ulici spojuje výbornou kuchyni se sociálním přesahem — dává pracovní příležitost lidem po výkonu trestu a bez domova. Nabízí skvělou veganskou svíčkovou, guláš, plněné knedlíky i polední menu za lidové ceny. Přátelská atmosféra a férový přístup dělají ze Střechy výjimečný podnik.

## 9. [Vegan's Prague](/restaurace/vegans-prague) (Malá Strana)

[Vegan's Prague](/restaurace/vegans-prague) najdete přímo v Nerudově ulici pod Pražským hradem. Specializuje se na tradiční českou kuchyni v moderním čistě rostlinném provedení: jejich celerová svíčková, houbový guláš s karlovarským knedlíkem i smažený sýr z tofu patří k vyhledávaným zážitkům tuzemských i zahraničních hostů. Terasa pod střechou nabízí navíc kouzelný výhled.

## 10. [Shromaždiště](/restaurace/shromazdistepraha) (Žižkov)

Žižkovská veganská hospoda [Shromaždiště](/restaurace/shromazdistepraha) nabízí neformální alternativní atmosféru s točenými řemeslnými pivy a poctivým hospodským jídlem: sojovými výpečky se zelím a knedlíkem, tatarákem, utopenci a burgery. Autentické místo, kde se skvěle najíte i pobavíte.

Za zmínku stojí také nuselská jídelna [Eaternia](/restaurace/eaternia), útulné [Sandokan Vegan Bistro na Vinohradech](/restaurace/sandokan-vegan-bistro) nebo vyhlášená raw cukrárna [MyRaw Café](/restaurace/myraw-cafe).

## Jak vybrat tu správnou restauraci?

Při výběru veganské restaurace v Praze doporučujeme zohlednit příležitost a lokalitu:
- **Romantická večeře:** [Maitrea](/restaurace/maitrea) nebo [Lehká Hlava](/restaurace/lehka-hlava)
- **Víkendový brunch:** [Palo Verde](/restaurace/palo-verde) nebo [Pastva](/restaurace/pastva)
- **Rychlý a levný oběd do 200 Kč:** [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) či [Sandokan](/restaurace/sandokan-vegan-bistro) (více tipů v našem článku [zdravé obědy do 200 Kč](/blog/zdrave-obedy-do-200-kc-vegan-praha))
- **Česká klasika:** [Vegan's Prague](/restaurace/vegans-prague) nebo [Střecha](/restaurace/strecha)

Kompletní přehled všech 80+ prověřených míst s možností filtrování podle městské části a diety najdete v našem [katalogu restaurací](/restaurace) a v [interaktivní mapě](/mapa).`,
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

Praha má desítky vynikajících veganských a vegetariánských podniků, ale jejich rozmístění po městě je nerovnoměrné. Zatímco některé čtvrti nabízejí na každém rohu špičkovou bezmasou alternativu, jiné oblasti stále zaostávají. Tento průvodce vám pomůže zorientovat se v tom, kde v Praze hledat nejlepší rostlinnou stravu a kam vyrazit za konkrétním gastronomickým zážitkem.

Prozkoumejte také náš [katalog bezmasých restaurací](/restaurace) nebo si otevřete [interaktivní mapu Prahy](/mapa).

## [Vinohrady](/restaurace/praha/vinohrady) — veganská Mekka Prahy

[Vinohrady](/restaurace/praha/vinohrady) jsou bezesporu nejhustěji obsazenou čtvrtí co do počtu veganských a vegetariánských podniků. Na relativně malé ploše zde najdete širokou škálu restaurací, kaváren a bister:
- Pro rychlý a dostupný polední oběd vyrazte do [Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) na Korunní nebo do [Beas Dhaba v Bělehradské](/restaurace/beas-dhaba-belehradska).
- Prémiový brunch a kávu nabízí stylové [Palo Verde](/restaurace/palo-verde).
- Skvělou moderní gastronomii s vegetariánskými volbami servíruje [KRO Kitchen Vinohrady](/restaurace/kro-kitchen-vinohrady).
- Oblíbenou trasou je procházka od náměstí Míru podél Mánesovy a Korunní ulice až k Riegrovým sadům.

Typická cena hlavního jídla na Vinohradech se pohybuje mezi 160 a 320 Kč podle typu podniku.

## Žižkov — alternativa s charakterem

Žižkov si drží osobitý charakter alternativní kultury a uvolněné gastronomie. Veganské podniky zde mají komunitnější ráz a poctivou hospodskou i bistro kuchyni:
- Nezaměnitelnou atmosféru nabízí veganská hospoda [Shromaždiště](/restaurace/shromazdistepraha) s řemeslnými pivy a rostlinnými verzemi české klasiky.
- Na legendární rostlinné burgery a večerní posezení láká [Belzepub](/restaurace/belzepub).
- Ceny na Žižkově jsou velmi příznivé a atmosféra neformální.

## Holešovice — moderní gastronomický hub

Holešovice prošly dramatickou proměnou a staly se jedním z nejzajímavějších gastronomických center Prahy.
- Absolutním králem rostlinného comfort foodu je zde [Chutnej](/restaurace/chutnej) nabízející špičkovou kynutou i bezlepkovou pizzu a poctivé burgery.
- Pro rychlé asijské veganské speciality a nudle poslouží [Veganland Express](/restaurace/veganland-express).
- V okolí Veletržního paláce i v Tržnici navíc najdete řadu kaváren s výběrovou kávou a rostlinnými dezerty.

## [Staré Město a centrum](/restaurace/praha/stare-mesto) — klenoty v historickém srdci

[Staré Město](/restaurace/praha/stare-mesto) sice čelí turistickému tlaku, ale ukrývá podniky s naprosto mimořádnou atmosférou i kvalitou:
- Ikonické podniky [Maitrea](/restaurace/maitrea) u Týnského chrámu a [Lehká Hlava](/restaurace/lehka-hlava) v Boršově patří k nejvyhledávanějším vegetariánským a veganským restauracím ve střední Evropě.
- Na rychlý zdravý oběd v centru zamiřte do bio bufetu [Country Life v Melantrichově](/restaurace/country-life-melantrichova) nebo do [Beas Dhaba ve Vladislavově](/restaurace/beas-dhaba-vladislavova).
- Poctivé české jídlo se sociálním přesahem nabízí [Střecha](/restaurace/strecha) v Křemencově ulici a asijské speciality [Loving Hut — Na Poříčí](/restaurace/loving-hut-na-porici).

## [Smíchov](/restaurace/praha/smichov) a [Karlín](/restaurace/praha/karlin) — skvělá volba mimo ruch

- Na [Smíchově](/restaurace/praha/smichov) kraluje vyhlášená [Pastva](/restaurace/pastva) s bezkonkurenčními poledními meníčky a burgerem, v sousedních Nuslích pak kultovní [Eaternia](/restaurace/eaternia).
- V [Karlíně](/restaurace/praha/karlin) najdete moderní [Spojka Karlín](/restaurace/spojka-karlin) s bohatou nabídkou pro vegany i flexitariány a oblíbenou pobočku [Beas Dhaba Karlín](/restaurace/beas-dhaba-karlin).
- Přejdete-li Karlův most na Malou Stranu, čeká vás tradiční česká kuchyně ve [Vegan's Prague](/restaurace/vegans-prague) a klidné posezení v [Natureza](/restaurace/natureza).

## Srovnávací tabulka čtvrtí

| Čtvrť | Typická cena | Doporučené podniky | Průvodce čtvrtí |
|---|---|---|---|
| Vinohrady | 160–320 Kč | Sandokan, Palo Verde, KRO Kitchen | [Zobrazit Vinohrady](/restaurace/praha/vinohrady) |
| Staré Město & Centrum | 150–350 Kč | Maitrea, Lehká Hlava, Country Life, Střecha | [Zobrazit Staré Město](/restaurace/praha/stare-mesto) |
| Smíchov & Anděl | 150–260 Kč | Pastva, Eaternia, Beas Dhaba | [Zobrazit Smíchov](/restaurace/praha/smichov) |
| Karlín | 160–280 Kč | Spojka Karlín, Beas Dhaba | [Zobrazit Karlín](/restaurace/praha/karlin) |
| Žižkov & Holešovice | 140–260 Kč | Chutnej, Shromaždiště, Belzepub | [Zobrazit celou Prahu](/restaurace/veganske-restaurace-praha) |

## Vyzkoušejte interaktivní mapu

Chcete zjistit, co máte právě teď nejblíže? Využijte naši [interaktivní mapu restaurací](/mapa), kde můžete filtrovat podle vzdálenosti, čistě veganského konceptu i cenové hladiny. A pokud chcete ušetřit, podívejte se na naše tipy na [zdravé obědy do 200 Kč](/blog/zdrave-obedy-do-200-kc-vegan-praha).`,
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

Vzít děti do bezmasé či veganské restaurace může být výzva — ne každý podnik myslí na nejmenší hosty a jejich chuťové preference. Přesto v Praze existuje řada míst, která kombinují kvalitní rostlinnou kuchyni s přátelským přístupem k rodinám, dětskými židličkami a jídly, která zachutnají i konzervativnějším jedlíkům.

Prozkoumejte také náš průvodce [bezmasá jídla pro děti](/blog/bezmasa-jidla-pro-deti) nebo si otevřete [interaktivní mapu podniků](/mapa).

## Co hledat při výběru restaurace pro rodiny

Při výběru restaurace s dětmi je důležité zohlednit několik faktorů: dostupnost jednodušších jídel (nebo možnost přizpůsobit porce a ubrat pálivé koření), přítomnost vysokých židliček, prostor pro kočárek, přívětivý přístup personálu a toleranci k živějším hostům.

## Doporučené rodinné restaurace

### [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) — bufetový systém bez čekání

[Beas Dhaba](/restaurace/beas-dhaba-vladislavova) je pro rodiny s dětmi jednou z nejpraktičtějších voleb. Samoobslužný bufetový systém eliminuje čekání u stolu: přijdete, dítě si prohlédne nabídku a samo si vybere, na co má chuť — jemné luštěninové pyré, rýži, pečené brambory, čerstvý chléb naan nebo sladký dezert. Platíte pouze za skutečnou váhu na talíři. Prostornější pobočky s pohodlným sezením najdete v [Paláci Lucerna](/restaurace/beas-dhaba-palac-lucerna), ve [Slovanském domě](/restaurace/beas-dhaba-slovansky-dum) či v [OC Nový Smíchov](/restaurace/beas-dhaba-oc-novy-smichov).

### [Pastva](/restaurace/pastva) (Smíchov) — prostorné bistro a oblíbená klasika

Bistro [Pastva na Smíchově](/restaurace/pastva) nabízí světlý, prostorný interiér, kam se bez problémů vejde kočárek. Obsluha je k rodinám velmi vstřícná a na lístku najdete jídla, která děti milují — křupavé pečené brambory a hranolky, jemné zeleninové krémy, domácky laděné burgery i skvělé sladké lívance a dezerty.

### [Country Life](/restaurace/country-life-melantrichova) (Staré Město) — zdravý bio výběr

V samoobslužném bufetu [Country Life v Melantrichově ulici](/restaurace/country-life-melantrichova) snadno poskládáte vyvážený dětský talíř z certifikovaných bio surovin. K dispozici jsou teplé obilninové kaše, vařená zelenina, těstoviny i čerstvé ovocné a zeleninové saláty.

### [Maitrea](/restaurace/maitrea) (Staré Město) — klidné zázemí a jemné chutě

Při procházce historickým centrem oceníte [Maitreu](/restaurace/maitrea) u Staroměstského náměstí. Restaurace má klidné, nekuřácké prostředí, vysoké židličky a ochotný personál, který rád doporučí nepálivá jídla vhodná pro děti (například jemné rýžové pokrmy, bezlepkové quesadilly nebo ovocné dezerty).

### [Natureza](/restaurace/natureza) (Malá Strana) — oáza se zahrádkou

[Natureza](/restaurace/natureza) na Malé Straně nabízí klidné posezení mimo hlavní turistické trasy a v teplých měsících příjemnou zahrádku ve vnitrobloku, kde se děti cítí uvolněně.

## Veganské fast food alternativy pro děti

Pokud jste na celodenním výletě a potřebujete rychlé řešení bez rezervace:
- [McDonald's Praha](/restaurace/mcdonalds-praha) nabízí hranolky a rostlinné alternativy burgerů.
- [Subway Praha](/restaurace/subway-praha) umožňuje poskládat čerstvý Veggie Delite sendvič přesně podle přání dítěte.
- [Pizza Hut Praha](/restaurace/pizza-hut-praha) připraví pizzu s veganským sýrem a oblíbenými zeleninovými toppingy.
- [Loving Hut v OC Quadrio](/restaurace/loving-hut-oc-quadrio) nabízí rychlé rýžové nudle a zeleninové závitky.

## Praktické tipy pro rodinné výlety

1. **Rezervujte včas o víkendech:** Populární podniky jako [Pastva](/restaurace/pastva) mívají o víkendech plno.
2. **Vyzkoušejte váhový bufet:** V [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) dáte dítěti ochutnat lžičku nového jídla bez rizika, že zaplatíte celou velkou porci, kterou nesní.
3. **Vařte oblíbené recepty i doma:** Naše virtuální redaktorka Sofie připravila osvědčená [bezmasá jídla pro děti](/blog/bezmasa-jidla-pro-deti) — od [pohankových lívanců s jahodami](/recepty/pohankove-livance-s-jahodami) až po krémovou [brokolicovou polévku s hráškem](/recepty/brokolicova-polevka-s-hraskem).`,
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
    content: `## Veganský brunch v Praze — rostoucí víkendový rituál

Víkendový brunch se stal jedním z nejoblíbenějších gastronomických rituálů Pražanů. Pražská rostlinná scéna nabízí pestrý výběr podniků, kde si lze dopřát vydatné dopolední posezení bez živočišných produktů — od nadýchaných croissantů a lívanců až po slaný tofu scramble a výběrovou kávu s ovesným mlékem.

Prozkoumejte také náš [katalog bezmasých restaurací a kaváren](/restaurace) nebo si otevřete [interaktivní mapu Prahy](/mapa).

## Co tvoří dokonalý rostlinný brunch?

Kvalitní veganský brunch kombinuje slané a sladké chutě, dostatek bílkovin (tofu scramble, tempehová slanina, luštěninové pomazánky), čerstvé sezónní ovoce, kváskové pečivo a samozřejmě špičkovou kávu s kvalitním rostlinným mlékem (ovesné barista mléko je dnes standardem).

## Nejlepší místa pro veganský brunch v Praze

### [Palo Verde](/restaurace/palo-verde) (Vinohrady / Nové Město)

[Palo Verde](/restaurace/palo-verde) je absolutní ikonou pražské veganské brunchové scény. V krásném vnitrobloku v Žitné ulici servírují legendární mandlové i pistáciové croissanty, avokádové toasty na kváskovém chlebu, lívance s lesním ovocem a slaný tofu scramble s bylinkami. K tomu výběrová káva od předních pražských pražíren. O víkendech doporučujeme přijít včas nebo rezervovat stůl.

### [Pastva](/restaurace/pastva) (Smíchov)

Oblíbené bistro [Pastva na Smíchově](/restaurace/pastva) (kousek od Anděla) nabízí o víkendech skvělou uvolněnou atmosféru a vydatné snídaňové menu. Ochutnat můžete domácí vafle, míchané tofu na cibulkách s křupavým chlebem, čerstvě lisované ovocné šťávy i pestré smoothie bowls.

### [MyRaw Café](/restaurace/myraw-cafe) (Staré Město)

V Dlouhé ulici na [Starém Městě](/restaurace/praha/stare-mesto) najdete [MyRaw Café](/restaurace/myraw-cafe), ráj pro milovníky raw a živé stravy. Jejich açaí bowls s domácí granolou, raw palačinky s ovocným přelivem, avokádový tatarák i široká nabídka bezlepkových raw dortů bez přidaného cukru jsou ideálním startem aktivního víkendu.

### [Share Sweet and Espresso Bar](/restaurace/share-sweet-espresso) (Centrum)

Pokud milujete sladký brunch v kavárenském duchu, [Share Sweet and Espresso Bar](/restaurace/share-sweet-espresso) nabízí 100% veganské řemeslné pečivo, plněné croissanty, skořicové šneky a vynikající espresso. Ideální zastávka při procházce centrem města.

### [Herbivore](/restaurace/herbivore) (Výtoň / Praha 2)

[Herbivore](/restaurace/herbivore) na Rašínově nábřeží spojuje veganské bistro s obchůdkem. Nabízí bohaté snídaňové misky, ovesné a chia kaše, hummusové toasty a výhled na Vltavu — perfektní kombinace pro ranní víkendovou procházku po náplavce.

### [KRO Kitchen Vinohrady](/restaurace/kro-kitchen-vinohrady) (Vinohrady)

Populární koncept [KRO Kitchen Vinohrady](/restaurace/kro-kitchen-vinohrady) na náměstí Jiřího z Poděbrad nabízí moderní snídaňové menu se skvělými vegetariánskými možnostmi, sezónní zeleninou a špičkovým řemeslným pečivem.

## Praktické tipy na brunch

Většina pražských podniků nabízí brunch o víkendech od 9:00 do 14:00 či 15:00. V podnicích na [Vinohradech](/restaurace/praha/vinohrady) a v [centru](/restaurace/praha/stare-mesto) je rezervace o víkendu velkou výhodou. Průměrná cena brunchového menu včetně kávy se pohybuje mezi 220 a 380 Kč.

## Brunch doma: osvědčené recepty

Nechce se vám o víkendu nikam vyrážet? Skvělý brunch zvládnete snadno i doma:
- [Vegánská míchaná vajíčka z tofu](/recepty/veganska-michana-vajicka-z-tofu) — hotová do 15 minut, plná bílkovin a chuti po černé soli kala namak.
- [Pohankové lívance s jahodami](/recepty/pohankove-livance-s-jahodami) — přirozeně bezlepkové a nadýchané lívance, které milují i děti.
- [Přes noc namočená chia ovesná kaše s borůvkami](/recepty/pres-noc-namocena-chia-ovesna-kase-s-boruvkami) — připravená předem v lednici.
- Prozkoumejte celou naši [databázi bezmasých receptů](/recepty).`,
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

Česká kuchyně je tradičně masová — svíčková na smetaně, vepřo-knedlo-zelo, guláš nebo smažený sýr. Přesto se v posledních letech objevuje stále více podniků a receptů, které dokazují, že i tyto ikonické pokrmy lze připravit v čistě rostlinném provedení, aniž by ztratily svou charakteristickou hloubku a sytost.

Pokud chcete ochutnat tradiční jídla přímo v Praze, prozkoumejte náš [katalog bezmasých restaurací](/restaurace) nebo si otevřete [interaktivní mapu podniků](/mapa).

## Klíčové ingredience české veganské kuchyně

Úspěšná česká veganská kuchyně stojí na poctivém základu:
- **Kořenová zelenina:** mrkev, celer a petržel dodávají svíčkové omáčce její typickou sladkost a plnost.
- **Lesní houby:** žampiony, hříbky a sušené houby tvoří základ poctivého guláše a [krkonošské kulajdy](/recepty/prava-krkonosska-kulajda).
- **Kvalitní tofu a tempeh:** marinované a uzené tofu skvěle nahrazuje uzené maso v knedlících či smažený sýr v trojobalu.
- **Rostlinná smetana:** ovesná nebo sójová smetana dodá omáčkám sametovou jemnost bez mléčných alergenů.

## Svíčková z kořenové zeleniny — bezmasý král

Svíčková omáčka je pravděpodobně nejpopulárnějším českým jídlem v rostlinné úpravě. Kořenová zelenina se peče do zkaramelizování s divokým kořením, rozmixuje do hladka a zjemní rostlinnou smetanou s kapkou citronu. Místo hovězího masa se podává pečený marinovaný celer, seitanový plátek nebo uzené tofu s brusinkami a knedlíkem.

V Praze ji nepřekonatelně připravují ve [Vegan's Prague](/restaurace/vegans-prague) na Malé Straně a v sociálním bistru [Střecha](/restaurace/strecha) v Novém Městě.

## Poctivý houbový guláš

Houbový guláš patří k nejchutnějším českým bezmasým jídlům. Kombinace čerstvých a sušených lesních hub, cibule orestované dozlatova, majoránky a česneku vytváří dokonale hustou a voňavou omáčku. Nejlépe chutná s karlovarským knedlíkem nebo čerstvým chlebem. Vyhlášenou verzi servíruje veganská hospoda [Shromaždiště](/restaurace/shromazdistepraha) na Žižkově.

## Smažený sýr z tofu s tatarkou

Smažák je český národní fenomén. V rostlinném pojetí se obaluje kvalitní pevné nebo uzené tofu v trojobalu (hladká mouka, rostlinné mléko s hraškou, strouhanka) a podává s vařenými bramborami a domácí sójanézovou tatarkou. Tradiční jídelna [Havelská Koruna](/restaurace/havelska-koruna) na Starém Městě i hospoda [Shromaždiště](/restaurace/shromazdistepraha) dokazují, že tato varianta skvěle uspokojí i ty největší milovníky hospodské klasiky.

## Knedlíky — vegansky bez problému

Tradiční houskové knedlíky i bramborové těsto jsou ve své podstatě přirozeně veganské (mouka, voda, sůl, droždí či vařené brambory). Skvělou ukázkou jsou [plněné bramborové knedlíky s uzeným tofu](/recepty/plnene-bramborove-knedliky-s-uzenym-tofu) s dušeným kysaným zelím a smaženou cibulkou.

## Kde ochutnat českou veganskou kuchyni v Praze

| Restaurace | Specialita | Lokalita | Profil podniku |
|---|---|---|---|
| [Vegan's Prague](/restaurace/vegans-prague) | Celerová svíčková, houbový guláš, knedlíky | [Malá Strana / Hradčany](/restaurace/praha/stare-mesto) | [Zobrazit profil](/restaurace/vegans-prague) |
| [Shromaždiště](/restaurace/shromazdistepraha) | Sójové výpečky, smažený sýr z tofu, tatarák | [Žižkov](/restaurace/veganske-restaurace-praha) | [Zobrazit profil](/restaurace/shromazdistepraha) |
| [Střecha](/restaurace/strecha) | Veganská svíčková, koprovka, halušky | [Nové Město / centrum](/restaurace/praha/stare-mesto) | [Zobrazit profil](/restaurace/strecha) |
| [Havelská Koruna](/restaurace/havelska-koruna) | Smažený tofu sýr, české polední přílohy | [Staré Město](/restaurace/praha/stare-mesto) | [Zobrazit profil](/restaurace/havelska-koruna) |
| [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) | Zeleninové placky a polední bufet | [Centrum a celá Praha](/restaurace/veganske-restaurace-praha) | [Zobrazit profil](/restaurace/beas-dhaba-vladislavova) |

## Uvařte si českou klasiku doma: osvědčené recepty

Máte chuť na poctivé české jídlo u vás v kuchyni? Vyzkoušejte naše prověřené recepty:
- [Česká klasika bez masa](/recepty/ceska-klasika-bez-masa) — velký průvodce tradičními omáčkami a knedlíky.
- [Veganský kuřecí řízek s bramborovou kaší](/recepty/vegansky-kureci-rizek-s-bramborovou-kasi) — zlatavá křupavá klasika s jemnou kaší.
- [Plněné bramborové knedlíky s uzeným tofu a zelím](/recepty/plnene-bramborove-knedliky-s-uzenym-tofu) — sytý nedělní oběd pro celou rodinu.
- [Veganská kachna se špenátem a knedlíkem](/recepty/veganska-kachna-se-spenatem-a-knedlikem) — slavnostní pečeně ze seitanu.
- [Pravá krkonošská kulajda](/recepty/prava-krkonosska-kulajda) nebo [bramboračka s lesními houbami](/recepty/bramboracka-s-lesnimi-houbami).
- [Bramborový salát s domácí sójanézou](/recepty/bramborovy-salat-s-domaci-sojanezou) a inspirace na [bezmasá jídla z brambor](/blog/bezmasa-jidla-z-brambor).`,
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
      "Veganský fast food už dávno není protimluv. Praha nabízí desítky míst, kde se najíte rychle, levně a bez masa — od indických váhových bufetů až po řemeslné burgery a onigirazu.",
    content: `## Veganský fast food v Praze: rychle, levně a bez kompromisů

Ještě před několika lety bylo veganské rychlé občerstvení v Praze raritou. Dnes je situace diametrálně odlišná — město nabízí desítky míst, kde se najíte za méně než 200 Kč, bleskově a z čistě rostlinných surovin. Tento přehled mapuje nejlepší možnosti pro rok 2026.

Podívejte se také na náš kompletní [katalog restaurací a bister](/restaurace) nebo si otevřete [interaktivní mapu podniků](/mapa).

## [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) — indický bufet na váhu

[Beas Dhaba](/restaurace/beas-dhaba-vladislavova) představuje bezkonkurenční poměr cena/výkon. Samoobslužný váhový systém znamená, že platíte pouze za gramáž jídla na talíři. Denní výběr zahrnuje luštěninový dál, zeleninová sabdží, basmati rýži, čerstvý chléb i saláty. Průměrný talíř vyjde na 120–160 Kč. S více než 20 pobočkami po Praze (např. ve [Vladislavově](/restaurace/beas-dhaba-vladislavova), na [Poříčí](/restaurace/beas-dhaba-na-porici), v [Lucerně](/restaurace/beas-dhaba-palac-lucerna), v [Karlíně](/restaurace/beas-dhaba-karlin) či na [Smíchově](/restaurace/beas-dhaba-oc-novy-smichov)) máte Beas vždy na dosah.

## [Country Life](/restaurace/country-life-melantrichova) — bio bufet v srdci Starého Města

Průkopník ekologického zemědělství [Country Life v Melantrichově ulici](/restaurace/country-life-melantrichova) nabízí samoobslužný teplý i studený bufet z certifikovaných bio surovin. Výborná volba pro rychlý a vyvážený oběd přímo v historickém centru [Starého Města](/restaurace/praha/stare-mesto). Další pobočku najdete v [Jungmannově ulici](/restaurace/country-life-jungmannova).

## [Loving Hut](/restaurace/loving-hut-na-porici) — asijská rostlinná kuchyně

Mezinárodní síť [Loving Hut — Na Poříčí](/restaurace/loving-hut-na-porici) nabízí asijskou veganskou kuchyni — nudle pad thai, voňavé pho, křupavé závitky i polední bufet za ceny od 130 Kč. Rychlá obsluha a pobočky v nákupních centrech jako [OC Quadrio](/restaurace/loving-hut-oc-quadrio) a na [Budějovické](/restaurace/loving-hut-budejovicka) dělají z Loving Hut jistotu při spěchu.

## [Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) — bufet na Vinohradech

[Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) na Korunní třídě na [Vinohradech](/restaurace/praha/vinohrady) nabízí čistě veganský a bezlepkový samoobslužný bufet. Zvolíte si malý, střední nebo velký talíř, naberete si teplá jídla a saláty a do pěti minut jíte.

## Řemeslný street food a burgery: [Chutnej](/restaurace/chutnej), [Belzepub](/restaurace/belzepub) a [Onigirazu](/restaurace/onigirazu)

- **Burgery a pizza v Holešovicích:** [Chutnej](/restaurace/chutnej) nabízí vyladěné řemeslné veganské burgery s hranolky a křupavou pizzu.
- **Žižkovská klasika:** [Belzepub](/restaurace/belzepub) je vyhlášený svými opulentními veganskými burgery a uvolněnou atmosférou.
- **Japonský snack na cesty:** [Onigirazu](/restaurace/onigirazu) na Vinohradech připravuje japonské rýžové sendviče zabalené v řase nori s tofu, zeleninou a lahodnými omáčkami.
- **Rychlá asijská jídla:** [Veganland Express](/restaurace/veganland-express) v Holešovicích uspokojí chuť na křupavé nudle a tofu kousky.

## Veganské možnosti v klasických řetězcích

Když spěcháte na vlak nebo metro, rostlinné varianty dnes nabízí i velké sítě:
- [Burger King Praha](/restaurace/burger-king-praha) — rostlinný Plant-based Whopper a veganské nugetky.
- [McDonald's Praha](/restaurace/mcdonalds-praha) — hranolky a rostlinné alternativy.
- [Subway Praha](/restaurace/subway-praha) — sendvič Veggie Delite s čerstvou zeleninou a veganskou omáčkou.
- [Bageterie Boulevard Praha](/restaurace/bageterie-boulevard-praha) — sezónní vegetariánské a veganské bagety a pečené brambory patatas.
- [UGO Praha](/restaurace/ugo-praha) — čerstvé zeleninové šťávy, polévky a salátové misky.

## Srovnání nejlepších veganských fast food míst v Praze

| Podnik | Typ | Orientační cena | Lokalita |
|---|---|---|---|
| [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) | Indický váhový bufet | 120–160 Kč | [Celá Praha (20+ poboček)](/restaurace/veganske-restaurace-praha) |
| [Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) | Veganský samoobslužný bufet | 90–160 Kč | [Vinohrady](/restaurace/praha/vinohrady) |
| [Loving Hut](/restaurace/loving-hut-na-porici) | Asijský bufet & menu | 130–180 Kč | [Staré Město & Nové Město](/restaurace/praha/stare-mesto) |
| [Country Life](/restaurace/country-life-melantrichova) | Bio bufet z ekofarmy | 150–200 Kč | [Staré Město](/restaurace/praha/stare-mesto) |
| [Chutnej](/restaurace/chutnej) | Řemeslné burgery a pizza | 180–260 Kč | [Holešovice](/restaurace/veganske-restaurace-praha) |
| [Belzepub](/restaurace/belzepub) | Poctivé veganské burgery | 170–240 Kč | [Žižkov](/restaurace/veganske-restaurace-praha) |
| [Onigirazu](/restaurace/onigirazu) | Japonské rýžové sendviče | 95–140 Kč | [Vinohrady](/restaurace/praha/vinohrady) |

## Jak najít veganský fast food v okolí

Potřebujete se najíst hned teď? Otevřete si naši [interaktivní mapu restaurací](/mapa) a vyhledejte nejbližší podnik podle své aktuální polohy. Pro další cenově dostupné tipy si přečtěte také náš článek [zdravé veganské obědy do 200 Kč](/blog/zdrave-obedy-do-200-kc-vegan-praha).`,
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
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80",
    coverImageAlt:
      "Bezlepkové veganské jídlo — barevné misky se zeleninou a quinoou",
    excerpt:
      "Kombinace veganské stravy a bezlepkové diety může být výzva — ale Praha nabízejí řadu podniků, které obě potřeby zvládají na jedničku.",
    content: `## Bezlepkové veganské jídlo v Praze: kde jíst bez kompromisů

Kombinace veganské stravy a bezlepkové diety může na první pohled působit jako extrémní omezení — ale Praha nabízí překvapivě širokou a kvalitní nabídku podniků, které obě potřeby zvládají na jedničku. Tento průvodce je určen jak pro hosty s celiakií, tak pro ty, kteří se lepku vyhýbají z osobních či zdravotních důvodů.

Podívejte se také na náš [katalog bezmasých restaurací v Praze](/restaurace) nebo si otevřete [interaktivní mapu podniků](/mapa).

## Proč bývá kombinace vegan + bezlepkové náročná?

Běžná veganská strava se často opírá o lepek — těstoviny, pšeničné pečivo nebo seitan (který je z čistého pšeničného lepku vyroben). Kvalitní bezlepková rostlinná kuchyně proto staví na jiných, přirozeně bezlepkových zdrojích bílkovin a komplexních sacharidů: quinoe, pohance, čočce, cizrně, rýži, kukuřici a ořeších.

## Nejlepší bezlepkové veganské restaurace v Praze

### [Maitrea](/restaurace/maitrea) (Staré Město)
[Maitrea](/restaurace/maitrea) u Staroměstského náměstí má v menu přehledně označené bezlepkové položky (GF) a vyškolený personál ochotně poradí s alergeny. Sezónní menu vždy nabízí bezlepková kari, saláty, polévky i vynikající dezerty.

### [Lehká Hlava](/restaurace/lehka-hlava) (Staré Město)
V sesterské [Lehké Hlavě](/restaurace/lehka-hlava) v Boršově vám na přání přizpůsobí většinu pokrmů. Jejich bezlepková tacos z kukuřičných tortill a raw dezerty patří k tomu nejlepšímu, co můžete v centru ochutnat.

### [Natureza](/restaurace/natureza) (Malá Strana)
Restaurace [Natureza](/restaurace/natureza) pod Petřínem má bezlepkovou nabídku jako pevnou součást denní nabídky. Připravují bezlepková polední meníčka, zeleninové krémy a přirozeně bezlepkové raw dorty.

### [Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) (Vinohrady)
Samoobslužný bufet [Sandokan](/restaurace/sandokan-vegan-bistro) na Korunní na [Vinohradech](/restaurace/praha/vinohrady) má u každého jídla v bufetu viditelně označené alergeny. Většina jejich teplých luštěninových i zeleninových jídel a salátů je bezlepková.

### [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) (Centrum & celá Praha)
Tradiční indická kuchyně v síti [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) je přirozeně postavena na rýži, čočce a koření. Dál i zeleninová sabdží jsou většinou bezlepková (pozor pouze na placky roti a samosy, které obsahují pšeničnou mouku). Všechny alergeny jsou u nádob přehledně vyznačeny.

### [Dosa Dosa](/restaurace/dosa-dosa) (Malá Strana)
Bistro [Dosa Dosa](/restaurace/dosa-dosa) se specializuje na jihoindické placky dosa, které se připravují z fermentované rýže a čočky. Jsou přirozeně 100% bezlepkové, lehce stravitelné a plněné bramborovými či zeleninovými směsmi.

### [Chutnej](/restaurace/chutnej) (Holešovice)
Máte chuť na pizzu nebo burger bez lepku? [Chutnej](/restaurace/chutnej) v Holešovicích nabízí bezlepková těsta na pizzu a bezlepkové bulky na burgery s křupavou náplní a domácími omáčkami.

### [Palo Verde](/restaurace/palo-verde) (Vinohrady)
Stylové bistro [Palo Verde](/restaurace/palo-verde) nabízí bezlepkové lívance, ovesné misky a vyhlášené bezlepkové dorty a koláče.

## Srovnání bezlepkových rostlinných podniků

| Restaurace | Bezlepková nabídka | Čtvrť | Profil |
|---|---|---|---|
| [Maitrea](/restaurace/maitrea) | Velmi široká (GF označeno) | [Staré Město](/restaurace/praha/stare-mesto) | [Zobrazit profil](/restaurace/maitrea) |
| [Lehká Hlava](/restaurace/lehka-hlava) | Široká nabídka + úprava na přání | [Staré Město](/restaurace/praha/stare-mesto) | [Zobrazit profil](/restaurace/lehka-hlava) |
| [Sandokan](/restaurace/sandokan-vegan-bistro) | Denní bezlepkový bufet | [Vinohrady](/restaurace/praha/vinohrady) | [Zobrazit profil](/restaurace/sandokan-vegan-bistro) |
| [Dosa Dosa](/restaurace/dosa-dosa) | Přirozeně bezlepkové čočkovo-rýžové placky | [Malá Strana](/restaurace/praha/stare-mesto) | [Zobrazit profil](/restaurace/dosa-dosa) |
| [Chutnej](/restaurace/chutnej) | Bezlepková pizza i burgery | [Holešovice](/restaurace/veganske-restaurace-praha) | [Zobrazit profil](/restaurace/chutnej) |
| [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) | Většina dálů a rýže bez lepku | [Centrum a celá Praha](/restaurace/veganske-restaurace-praha) | [Zobrazit profil](/restaurace/beas-dhaba-vladislavova) |
| [Natureza](/restaurace/natureza) | Denní menu a raw dezerty | [Malá Strana](/restaurace/praha/stare-mesto) | [Zobrazit profil](/restaurace/natureza) |

## Bezlepkové bezmasé recepty na doma

Chcete vařit bezlepkově a rostlinně doma? Prozkoumejte naši specializovanou sekci [bezlepkových receptů](/recepty/bezlepkove-recepty), kde najdete polévky, luštěninová ragú i sladké pečení bez jediné špetky pšenice.`,
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
      "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?auto=format&fit=crop&w=800&q=80",
    coverImageAlt:
      "Zdravý veganský oběd — barevný talíř se zeleninou a luštěninami",
    excerpt:
      "Veganské jídlo nemusí být drahé. Praha nabízí řadu míst, kde se najíte za méně než 200 Kč — a jídlo bude zdravé, chutné a syté.",
    content: `## Veganské obědy do 200 Kč v Praze: průvodce pro rozpočtově vědomé

Veganské jídlo má pověst drahé záležitosti — ale to je mylná představa. Praha nabízí řadu míst, kde se naobědváte za méně než 200 Kč, a jídlo bude zdravé, syté a chutné. Klíčem je vědět, kde hledat a jak využít samoobslužné bufety nebo polední meníčka.

Podívejte se také na náš kompletní přehled [veganských restaurací v Praze](/restaurace/veganske-restaurace-praha) nebo si otevřete [interaktivní mapu podniků](/mapa).

## Nejlepší místa pro levné veganské obědy

### [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) (20+ poboček)
[Beas Dhaba](/restaurace/beas-dhaba-vladislavova) je absolutní šampion v kategorii poměru cena/kvalita. Samoobslužný bufetový systém, kde platíte za gramy na váhu, znamená, že si každý složí talíř přesně podle chuti a rozpočtu. Průměrný oběd vyjde na 120–160 Kč a výběr zahrnuje denně minimálně 15 různých teplých pokrmů, luštěnin, salátů a čerstvého pečiva. Oblíbené pobočky najdete v centru na [Vladislavově](/restaurace/beas-dhaba-vladislavova) a [Týnské](/restaurace/beas-dhaba-tynska), na [Vinohradech](/restaurace/beas-dhaba-belehradska), v [Karlíně](/restaurace/beas-dhaba-karlin) i na [Smíchově](/restaurace/beas-dhaba-oc-novy-smichov).

### [Country Life](/restaurace/country-life-melantrichova) (Staré Město)
[Country Life v Melantrichově](/restaurace/country-life-melantrichova) nabízí samoobslužný bufet s certifikovanými bio surovinami. Ceny jsou o něco vyšší než v Dhaba Beas, ale stále v rozumném poledním rozmezí — poctivý oběd vyjde na 150–200 Kč. Zelenina, luštěniny i celozrnné obiloviny pocházejí z ekologického zemědělství. Další pobočky fungují v [Jungmannově](/restaurace/country-life-jungmannova) a [Spálené ulici](/restaurace/country-life-spalena).

### [Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) (Vinohrady)
[Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) na Korunní třídě je samoobslužný bufet zaměřený na čistě veganská a bezlepková jídla. Ceny začínají od 90 Kč za malý talíř. Je to ideální volba pro rychlý, lehký a výživný oběd na [Vinohradech](/restaurace/praha/vinohrady) bez zdlouhavého čekání na obsluhu.

### [Loving Hut](/restaurace/loving-hut-na-porici) (Na Poříčí & centrum)
[Loving Hut — Na Poříčí](/restaurace/loving-hut-na-porici) nabízí výhodné denní menu za 130–170 Kč (polévka + hlavní asijské jídlo). Ochutnat můžete tofu speciality, veganské pho, křupavé závitky i restovanou zeleninu. Další pobočky najdete v [OC Quadrio](/restaurace/loving-hut-oc-quadrio) nebo na [Budějovické](/restaurace/loving-hut-budejovicka).

### Denní menu v běžných restauracích
Řada pražských rostlinných bister a restaurací nabízí polední menu za zvýhodněné ceny — typicky polévka + hlavní jídlo za 150–200 Kč. Pravidelná polední menu najdete v bistru [Pastva na Smíchově](/restaurace/pastva), v restauraci [Natureza na Malé Straně](/restaurace/natureza) nebo v sociálním bistru [Střecha v Novém Městě](/restaurace/strecha).

## Jak ušetřit na veganském jídle v Praze

**Bufetový systém:** [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) a [Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) nabízejí bufet, kde platíte za váhu na talíři. Pokud nemáte obří hlad, poskládáte si lehký oběd do 130 Kč. Hodinu před zavírací dobou navíc většina poboček Beas nabízí slevu na zbývající jídlo.

**Denní menu:** Polední menu bývají o 20–35 % levnější než stálý jídelní lístek. V podnicích jako [Pastva](/restaurace/pastva) nebo [Střecha](/restaurace/strecha) dostanete za 160–200 Kč kompletní menu včetně polévky.

**Oběd vs. večeře:** Oběd je v Praze vždy cenově dostupnější. Pokud chcete ochutnat prémiovější kuchyni, vyrazte tam v době poledního menu.

**Lokace mimo nejužší centrum:** Restaurace mimo Staroměstské náměstí jsou příznivější pro peněženku. Projděte si naše průvodce po čtvrtích: [Vinohrady](/restaurace/praha/vinohrady), [Karlín](/restaurace/praha/karlin) a [Smíchov](/restaurace/praha/smichov).

## Srovnání cen veganských obědů v Praze

| Restaurace | Typ | Průměrná cena oběda | Čtvrť / Lokalita |
|---|---|---|---|
| [Beas Dhaba](/restaurace/beas-dhaba-vladislavova) | Indický váhový bufet | 120–160 Kč | [Staré Město](/restaurace/praha/stare-mesto) & celá Praha |
| [Sandokan Vegan Bistro](/restaurace/sandokan-vegan-bistro) | Veganský samoobslužný bufet | 90–160 Kč | [Vinohrady](/restaurace/praha/vinohrady) |
| [Loving Hut](/restaurace/loving-hut-na-porici) | Asijská polední kuchyně | 130–170 Kč | [Staré Město & Nové Město](/restaurace/praha/stare-mesto) |
| [Country Life](/restaurace/country-life-melantrichova) | Bio bufet z ekofarmy | 150–200 Kč | [Staré Město](/restaurace/praha/stare-mesto) |
| [Pastva](/restaurace/pastva) | Sezónní polední menu | 160–220 Kč | [Smíchov](/restaurace/praha/smichov) |
| [Střecha](/restaurace/strecha) | Sociální veganské bistro | 150–190 Kč | [Nové Město](/restaurace/praha/stare-mesto) |

## Veganské jídlo doma: ještě levnější

Pokud chcete ušetřit ještě více, vařte doma. Na naší platformě najdete prověřené [rychlé bezmasé večeře do 30 minut](/recepty/rychle-bezmase-vecere), inspiraci na [bezmasá jídla na oběd do krabičky](/blog/bezmasa-jidla-na-obed) i kompletní [týdenní plánovač receptů](/tydenni-planovac-receptu). Luštěniny, tofu, kořenová zelenina a obiloviny představují nejlevnější a nutričně nejhodnotnější základ každodenní stravy.`,
  },
  {
    id: "9",
    slug: "veganske-pizzerie-praha-nejlepsi-pizza-bez-masa",
    title: "Veganské pizzerie v Praze: nejlepší pizza bez masa a sýra 2026",
    metaDescription:
      "Veganské pizzerie v Praze 2026 — kde si dát nejlepší veganskou pizzu? Přehled podniků s kvalitním rostlinným sýrem, toppingy i bezlepkovým těstem.",
    category: "Průvodce",
    tags: ["vegan", "pizza", "Praha", "pizzerie", "veganský sýr", "bezlepkové"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-03-10",
    readingTimeMin: 6,
    coverImage:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80",
    coverImageAlt: "Veganská pizza s barevnými toppingy na dřevěném prkně",
    excerpt:
      "Veganská pizza už dávno není kompromis. V Praze najdete specializované pizzerie, kde si dáte poctivé kynuté i bezlepkové těsto s kvalitním rostlinným sýrem a čerstvými bylinkami.",
    content: `## Veganská pizza v Praze: kde si dát poctivou italskou pizzu bez kompromisů

Veganská pizza je jednou z nejrychleji rostoucích kategorií v pražské gastronomii. Doba, kdy rostlinná pizza znamenala pouhé vynechání sýra ze surového rajčatového základu, je definitivně pryč. Dnes se používají vyladěné sýry z kešu oříšků nebo kokosového oleje, které se v peci krásně roztékají a mají skvělou chuť.

Prozkoumejte také náš kompletní [katalog bezmasých restaurací v Praze](/restaurace) nebo si otevřete [interaktivní mapu podniků](/mapa).

## Co dělá dokonalou veganskou pizzu?

Dobrá veganská pizza stojí na třech pilířích:
1. **Dlouho fermentované těsto:** pomalé kynutí dává korpusu vzdušnost, křupavost a lehkou stravitelnost.
2. **Kvalitní rajčatové sugo:** omáčka z pravých rajčat San Marzano, česneku, extra panenského olivového oleje a čerstvé bazalky.
3. **Poctivý rostlinný sýr:** moderní kešu mozzarelly a rostlinné sýry, které se zapékají dozlatova a nepůsobí gumově.

## Nejlepší místa na veganskou pizzu v Praze

### [Chutnej](/restaurace/chutnej) (Holešovice) — pražská jednička v rostlinné pizze

Bistro a pizzerie [Chutnej](/restaurace/chutnej) v Holešovicích je absolutním etalonem rostlinné pizzy v ČR. Jejich těsto kyne desítky hodin, peče se při vysoké teplotě a výsledkem je nadýchaný okraj s typickými puchýřky. Na výběr mají klasiky jako Margherita, pikantní Diavola s rostlinným salámem, houbové Funghi s lanýžovým olejem i zeleninové variace. Velkým plusem je možnost objednat **bezlepkové těsto**, které patří k nejlépe hodnoceným v Praze.

### [Palo Verde](/restaurace/palo-verde) (Vinohrady / Nové Město)

Stylové bistro [Palo Verde](/restaurace/palo-verde) připravuje italsky laděné menu včetně sezónních pizz a pinsa placek s pečenou zeleninou, domácím mandlovým ricottovým krémem a čerstvými bylinkami.

### [Pizza Hut Praha](/restaurace/pizza-hut-praha) — dostupná varianta v síti poboček

Pro rychlou večeři s doručením nebo při cestování nabízí řetězec [Pizza Hut Praha](/restaurace/pizza-hut-praha) veganské pizzy se speciálním rostlinným sýrem Violife, žampiony, paprikou, kukuřicí a rajčaty.

## Bezlepkové těsto na pizzu

Většina specializovaných pizzerií, jako je [Chutnej](/restaurace/chutnej), nabízí bezlepkový korpus za příplatek (typicky 30–50 Kč). Pokud máte celiakii, vždy personál upozorněte, aby pizza byla připravována s maximálním ohledem na křížovou kontaminaci. Další tipy najdete v našem článku [bezlepkové veganské restaurace v Praze](/blog/bezlepkove-veganske-restaurace-praha).

## Italská jídla doma

Chcete si připravit poctivé italské jídlo doma? Inspirujte se naším průvodcem [bezmasá jídla z těstovin](/blog/bezmasa-jidla-z-testovin) a objevte osvědčené [rychlé bezmasé večeře](/recepty/rychle-bezmase-vecere) v naší [databázi receptů](/recepty).`,
  },
  {
    id: "10",
    slug: "veganske-vanoce-trhy-advent-praha-co-jist",
    title: "Veganské Vánoce v Praze: co jíst na adventních trzích a kde",
    metaDescription:
      "Veganské jídlo na adventních trzích v Praze — co ochutnat, kde najít rostlinné stánky a kam zajít do tepla na sváteční bezmasé menu v centru.",
    category: "Sezónní",
    tags: ["vegan", "Vánoce", "adventní trhy", "Praha", "sezónní", "trhy"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-03-10",
    readingTimeMin: 5,
    coverImage:
      "https://images.unsplash.com/photo-1610562275255-03b7fa0d4655?auto=format&fit=crop&w=800&q=80",
    coverImageAlt:
      "Veganské jídlo na adventním trhu — teplá polévka a pečené kaštany",
    excerpt:
      "Adventní trhy v Praze mají kouzelnou atmosféru, ale pro vegany může být hledání sytého jídla výzvou. Přinášíme tipy na osvědčené stánky i skvělé restaurace v okolí trhů.",
    content: `## Veganské jídlo na adventních trzích v Praze

Adventní trhy v Praze patří k nejkrásnějším v Evropě — Staroměstské náměstí, Václavské náměstí, Náměstí Míru i Havelský trh lákají každý rok tisíce návštěvníků. Pro vegany však může být nabídka klasických stánků plných klobás a trdelníků s máslem omezující. Tento průvodce vám ukáže, kde si pochutnat přímo u stánků a kam v centru zajít do tepla na poctivé rostlinné menu.

Prozkoumejte také náš [katalog restaurací v centru Prahy](/restaurace/praha/stare-mesto) nebo si otevřete [interaktivní mapu podniků](/mapa).

## Co ochutnat přímo na adventních trzích

Některé tradiční trhové dobroty jsou přirozeně veganské:
- **Pečené horké kaštany:** Klasika adventu. Voňavé, syté a 100% rostlinné. Stánky s kaštany najdete na Staroměstském i Václavském náměstí.
- **Svařené víno a horký mošt:** Většina svařených vín a jablečných či hruškových moštů se koření skořicí, hřebíčkem a badyánem bez živočišných přísad (pouze se ujistěte, že nápoj není slazen medem).
- **Trdelník (ve vybraných stáncích):** Tradiční těsto často obsahuje máslo nebo vejce, ale na větších trzích se objevují certifikované veganské stánky označené zeleným lístkem.
- **Bramborové spirály a pečené brambory:** Rychlý slaný snack na zahřátí.

## Kde se najíst v teple: adventní menu v pražských podnicích

Když promrznete u stánků, vyplatí se popojít pár kroků do ověřených rostlinných restaurací přímo v historickém jádru města:

### [Maitrea](/restaurace/maitrea) (Staré Město — u Staroměstského náměstí)
Jen minutu chůze od hlavního adventního trhu v Týnské uličce najdete [Maitreu](/restaurace/maitrea). V prosinci tradičně nabízí sváteční menu s rostlinnou svíčkovou, marinovaným tofu a bezlepkovými zimními dezerty v klidném, vyhřátém prostředí.

### [Lehká Hlava](/restaurace/lehka-hlava) (Staré Město — u Karlova mostu)
Útulná [Lehká Hlava](/restaurace/lehka-hlava) v uličce Boršov nabízí hřejivé luštěninové polévky, pečenou zeleninu a horký kořeněný mošt. Rezervace stolu v předvánočním čase je naprostou nutností.

### [Havelská Koruna](/restaurace/havelska-koruna) (Staré Město — u Havelského trhu)
Přímo u stánků na Havelské ulici sídlí tradiční česká jídelna [Havelská Koruna](/restaurace/havelska-koruna), kde si můžete dát teplou polévku, vařené brambory i smažený sýr z tofu za lidové ceny.

### [Střecha](/restaurace/strecha) (Nové Město / Národní třída)
Kousek od Václavského náměstí v Křemencově ulici nabízí sociální veganské bistro [Střecha](/restaurace/strecha) skvělá zimní jídla — veganskou koprovku, houbový guláš, plněné knedlíky i vánoční cukroví.

### [Shromaždiště](/restaurace/shromazdistepraha) (Žižkov)
Pokud po návštěvě trhů na Náměstí Míru zamíříte na Žižkov, v hospodě [Shromaždiště](/restaurace/shromazdistepraha) na vás čekají poctivé horké polévky, sójové výpečky se zelím a točený ležák.

### [Vegan's Prague](/restaurace/vegans-prague) (Malá Strana)
Při cestě na Pražský hrad se zastavte v Nerudově ulici ve [Vegan's Prague](/restaurace/vegans-prague) na poctivou celerovou svíčkovou s knedlíkem a brusinkami.

## Sváteční vaření a pečení doma

Rádi si připravíte vánoční atmosféru doma? Vyzkoušejte naše prověřené recepty:
- [Bramborový salát s domácí sójanézou](/recepty/bramborovy-salat-s-domaci-sojanezou) — lehký a nerozeznatelný od rodinné klasiky.
- [Bramboračka s lesními houbami](/recepty/bramboracka-s-lesnimi-houbami) nebo [pravá krkonošská kulajda](/recepty/prava-krkonosska-kulajda) pro zahřátí.
- Velký přehled tradičních omáček a pečení najdete v článku [česká veganská kuchyně](/blog/ceska-veganska-kuchyne-tradicni-jidla-bez-masa) a v naší sekci [česká klasika bez masa](/recepty/ceska-klasika-bez-masa).`,
  },
  {
    id: "12",
    slug: "domaci-marmelada-dzem-rozdil-recepty",
    title:
      "Domácí marmeláda vs. džem: Jaký je v nich rozdíl a 10 nejlepších receptů",
    metaDescription:
      "Jaký je rozdíl mezi džemem, marmeládou a povidly? Návod na zavařování, pektin, méně cukru a recepty od meruňkové po Aperol.",
    category: "Tipy & Návody",
    tags: ["zavařování", "džem", "marmeláda", "recepty", "ovoce", "domácí"],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-08-01",
    readingTimeMin: 7,
    coverImage:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
    coverImageAlt: "Sklenice s domácím meruňkovým džemem a čerstvým ovocem",
    excerpt:
      "Léto je v plném proudu a ovoce dozrává. Víte, jaký je přesný rozdíl mezi marmeládou, džemem a povidly podle legislativy i v praxi? Přinášíme velkého průvodce zavařováním a 10 receptů od meruňky po Aperol.",
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
Divoké lesní borůvky svařené s trochou cukru a kapkou tuzemského rumu pro neodolatelnou vůni.

## Kam s domácí marmeládou a džemem?

Domácí ovocné zavařeniny se báječně hodí na teplé snídaně: vyzkoušejte nadýchané [pohankové lívance s jahodami](/recepty/pohankove-livance-s-jahodami), přimíchejte lžičku do [chia ovesné kaše s borůvkami](/recepty/pres-noc-namocena-chia-ovesna-kase-s-boruvkami) nebo prozkoumejte naši kompletní [databázi bezmasých receptů](/recepty).`,
  },
  {
    id: "13",
    slug: "francouzsky-quiche-druhy-naplni-recept",
    title:
      "Francouzský quiche: Jak na dokonalý slaný koláč a nejlepší bezmasé náplně",
    metaDescription:
      "Velký průvodce francouzským slaným koláčem quiche: recept na křehké těsto pâte brisée, smetanovou zálivku a nejlepší vegetariánské náplně.",
    category: "Tipy & Návody",
    tags: [
      "quiche",
      "francouzská kuchyně",
      "slaný koláč",
      "špenát",
      "pórek",
      "vegetariánské",
    ],
    author: "Bezmasájídla.cz",
    publishedAt: "2026-08-02",
    readingTimeMin: 8,
    coverImage:
      "https://images.unsplash.com/photo-1554998171-7e599bc95ccd?auto=format&fit=crop&w=800&q=80",
    coverImageAlt: "Tradiční francouzský quiche se zeleninou a parmazánem",
    excerpt:
      "Francouzský quiche je ideální volbou pro sytou snídani, lehký oběd i pohoštění pro návštěvu. Naučte se základní křehké těsto pâte brisée, sametovou vaječnou zálivku a inspirujte se pestrými vegetariánskými náplněmi.",
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
Zelený chřest krátce povařte ve slané vodě (2 minuty) a zchlaďte v ledové vodě. Naranžujte na korpus posypaný ricottou a parmazánem a zalijte vaječnou zálivkou.

## Tipy na další bezmasá jídla

Quiche je skvělý i do krabičky na druhý den do práce. Pokud hledáte další inspiraci na rychlé pohoštění a večeře bez masa, vyzkoušejte naše [rychlé bezmasé večeře](/recepty/rychle-bezmase-vecere), přečtěte si tipy na [bezmasá jídla na oběd](/blog/bezmasa-jidla-na-obed) nebo prozkoumejte celou [databázi receptů BezmasáJídla.cz](/recepty).`,
  },
];

const BLOG_IMAGE_PLACEHOLDER_SLUGS = new Set([
  "domaci-marmelada-dzem-rozdil-recepty",
  "nejlepsi-veganske-brunche-praha",
  "ceska-veganska-kuchyne-tradicni-jidla-bez-masa",
  "francouzsky-quiche-druhy-naplni-recept",
]);

export const blogPosts: BlogPost[] = blogPostSource.map(post => ({
  ...post,
  coverImage: BLOG_IMAGE_PLACEHOLDER_SLUGS.has(post.slug)
    ? BLOG_PLACEHOLDER
    : withImageFallback(post.coverImage, BLOG_PLACEHOLDER),
}));

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(p => p.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(p => p.tags.includes(tag));
}
