import React, { useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import HermelinEbookCta from "@/components/HermelinEbookCta";
import { hermelinAnalytics } from "@/lib/hermelinTracking";
import {
  ChevronRight,
  Clock,
  Users,
  Flame,
  ShieldAlert,
  ThermometerSnowflake,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Info,
  Utensils,
  Award,
} from "lucide-react";

// ── Recipe JSON-LD generator for the 3 verified full recipes ──
function HermelinRecipeJsonLd({
  title,
  slug,
  description,
  prepTimeMinutes,
  ingredients,
  steps,
  image,
}: {
  title: string;
  slug: string;
  description: string;
  prepTimeMinutes: number;
  ingredients: string[];
  steps: string[];
  image: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `https://www.bezmasajidla.cz/varianty-nakladaneho-hermelinu#${slug}`,
    name: title,
    description,
    image: image.startsWith("http") ? image : `https://www.bezmasajidla.cz${image}`,
    author: {
      "@type": "Organization",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
      logo: {
        "@type": "ImageObject",
        url: "https://www.bezmasajidla.cz/images/logo.png",
      },
    },
    prepTime: `PT${prepTimeMinutes}M`,
    cookTime: "PT0M",
    totalTime: `PT${prepTimeMinutes}M`,
    recipeCategory: "Předkrmy a chuťovky",
    recipeCuisine: "Česká",
    recipeYield: "4 porce",
    recipeIngredient: ingredients,
    recipeInstructions: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
    suitableForDiet: [
      "https://schema.org/VegetarianDiet",
      "https://schema.org/GlutenFreeDiet",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Article JSON-LD ──
function ArticleJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "https://www.bezmasajidla.cz/varianty-nakladaneho-hermelinu#article",
    headline: "15+ variant nakládaného hermelínu: od české klasiky po Maroko a Black Gold",
    description:
      "Nakládaný hermelín nemusí být jen cibule, česnek a chilli. Objevte více než 15 autorských chuťových variant – od české klasiky přes středomořskou až po marockou, houbovou či lanýžovou verzi.",
    image: [
      "https://www.bezmasajidla.cz/images/hermelin-15-variant-prehled.jpg",
    ],
    datePublished: "2025-01-15T08:00:00+01:00",
    dateModified: "2025-02-20T10:00:00+01:00",
    author: {
      "@type": "Organization",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
      logo: {
        "@type": "ImageObject",
        url: "https://www.bezmasajidla.cz/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.bezmasajidla.cz/varianty-nakladaneho-hermelinu",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function HermelinPillarPage() {
  useEffect(() => {
    hermelinAnalytics.trackArticleView("varianty-nakladaneho-hermelinu");
  }, []);

  const breadcrumbs = [
    { name: "Domů", url: "/" },
    { name: "Recepty", url: "/recepty" },
    { name: "Varianty nakládaného hermelínu", url: "/varianty-nakladaneho-hermelinu" },
  ];

  const faqs = [
    {
      question: "Jaký olej je na nakládání hermelínu nejvhodnější?",
      answer:
        "Ideální volbou je kvalitní slunečnicový nebo řepkový olej lisovaný za studena s neutrální chutí, který nechá vyniknout koření a zralost sýra. Čistý extra panenský olivový olej se nehodí jako jediný nosič, protože v lednici tuhne a vlivem polyfenolů může v kombinaci s česnekem nepříjemně zhořknout. U středomořských variant doporučujeme poměr cca 70 % slunečnicového a 30 % olivového oleje.",
    },
    {
      question: "Může hermelín zrát na kuchyňské lince v teple?",
      answer:
        "Zásadně to nedoporučujeme. Nakládaný hermelín s čerstvým česnekem, cibulí a bylinkami je chlazená potravina podléhající zkáze, nikoli stabilní konzerva. Olej vytváří anaerobní prostředí (bez přístupu vzduchu), což v pokojové teplotě představuje vysoké mikrobiologické riziko (zejména bakterie Clostridium botulinum přítomné v půdě a česneku). Hermelín musí vždy zrát v chladničce při 2–6 °C.",
    },
    {
      question: "Jak dlouho nakládaný hermelín v lednici vydrží?",
      answer:
        "Neexistuje jediná univerzální bezpečná doba pro všechny varianty, protože trvanlivost závisí na výchozí zralosti sýra, čistotě sklenice a typu ingrediencí (čerstvý česnek a bylinky podléhají zkáze rychleji než sušené koření). V dobře vychlazené lednici (2–6 °C) sýr optimálně dozrává 5 až 10 dní a doporučuje se spotřebovat do 10 až 14 dnů. Před konzumací vždy zkontrolujte vůni, čistotu a konzistenci.",
    },
    {
      question: "Proč se v oleji vytvořil bílý zákal nebo hrudky?",
      answer:
        "Bílý zákal nebo drobné vločky v oleji jsou zcela přirozeným fyzikálním jevem. V chladničce tuhnou nasycené mastné kyseliny z oleje i mléčný tuk, který se uvolňuje z povrchu sýra. Nejde o plíseň ani zkažení. Stačí sklenici nebo porci vyjmout cca 15–20 minut před podáváním do pokojové teploty a olej se opět zprůhlední.",
    },
    {
      question: "Co udělat se zbylým ochuceným olejem po snědení hermelínu?",
      answer:
        "Olej z hygienických důvodů nikdy nepoužívejte na nakládání další várky sýra. Je však plný rozleželých chutí česneku, bylinek a koření, takže představuje skvělý základ pro restování pečených brambor, základ pod zeleninový guláš, restování cibulky nebo do salátových zálivek.",
    },
    {
      question: "Jak poznat, kdy je hermelín ideálně proleželý?",
      answer:
        "Správně proleželý hermelín poznáte jemným stiskem: sýr je v celém průřezu vláčný, těsto pod plísňovou kůrkou měkne a krémovatí, ale ještě nevytéká. Uvnitř už nesmí být patrné tvrdé, kyselé tvarohové jádro.",
    },
  ];

  // 15 variant data
  const variants = [
    {
      nr: "01",
      name: "Bohemian Classic",
      region: "Česká republika",
      profile: "Česneková pasta, sladká a pálivá paprika, cibule, nové koření, bobkový list, beraní rohy",
      oil: "Slunečnicový nebo řepkový",
      pairing: "Čerstvý kváskový chléb, ležák plzeňského typu",
    },
    {
      nr: "02",
      name: "Volcano (Ohnivý drak)",
      region: "Mexiko & Karibik",
      profile: "Čerstvé habanero, uzená paprika pimentón, drcené chilli, červená cibule, česnek",
      oil: "Slunečnicový s chilli infuzí",
      pairing: "Kukuřičné tortilly, IPA nebo tmavý ležák",
    },
    {
      nr: "03",
      name: "Sicilia",
      region: "Středomoří",
      profile: "Sušená rajčata, kapary, černé olivy kalamata, oregano, rozmarýn, česnek na plátky",
      oil: "70% slunečnicový + 30% extra panenský olivový",
      pairing: "Křupavá ciabatta, suché bílé víno (Pinot Grigio)",
    },
    {
      nr: "04",
      name: "Essaouira",
      region: "Maroko",
      profile: "Koření Ras el Hanout, bio pomerančová kůra, pražený římský kmín, čerstvý koriandr, mandle",
      oil: "Slunečnicový s citrusovou infuzí",
      pairing: "Pita chléb, silný marocký mátový čaj",
    },
    {
      nr: "05",
      name: "Provence",
      region: "Francie",
      profile: "Provensálské bylinky, sušená levandule, šalotka, bílý drcený pepř, bobkový list",
      oil: "Jemný slunečnicový s kapkou olivového",
      pairing: "Francouzská bageta, suché růžové víno",
    },
    {
      nr: "06",
      name: "Black Gold",
      region: "Gourmet",
      profile: "Fermentovaný černý česnek, lanýžový akcent, hrubozrnný černý pepř, tymián",
      oil: "Slunečnicový s několika kapkami lanýžového oleje",
      pairing: "Opečený brioškový toust, plné červené víno",
    },
    {
      nr: "07",
      name: "Forest King",
      region: "Střední Evropa",
      profile: "Sušené lesní hříbky (rehydratované), drcené plody jalovce, tymián, bobkový list",
      oil: "Slunečnicový za studena lisovaný",
      pairing: "Hutný žitný chléb s kmínem, polotmavé pivo",
    },
    {
      nr: "08",
      name: "Bavaria",
      region: "Bavorsko",
      profile: "Čerstvě nastrouhaný křen, celá žlutá i hnědá hořčičná semínka, červená cibule",
      oil: "Řepkový olej",
      pairing: "Měkký bavorský preclík, pšeničné pivo (Weissbier)",
    },
    {
      nr: "09",
      name: "Tokyo Umami",
      region: "Japonsko",
      profile: "Čerstvý zázvor na nudličky, pražený sezam, kapka tamari, vločky řasy nori",
      oil: "Slunečnicový s lžící praženého sezamového oleje",
      pairing: "Rýžové krekry, zelený čaj Sencha nebo suché saké",
    },
    {
      nr: "10",
      name: "Al-Andalus",
      region: "Španělsko",
      profile: "Uzená sladká paprika pimentón de la Vera, pražené solené mandle, stroužek česneku, sherry",
      oil: "Směsný olivovo-slunečnicový",
      pairing: "Španělský chléb pan de cristal, suché Sherry Fino",
    },
    {
      nr: "11",
      name: "Green Garden",
      region: "Jarní česká",
      profile: "Pesto z medvědího česneku, čerstvá pažitka, plocholistá petržel, zelený pepř",
      oil: "Slunečnicový olej",
      pairing: "Domácí podmáslový chléb, světlý ležák 11°",
    },
    {
      nr: "12",
      name: "Mexico Picante",
      region: "Mexiko",
      profile: "Kolečka nakládaných papriček jalapeño, limetková kůra, semínka koriandru, oregáno",
      oil: "Slunečnicový",
      pairing: "Nachos nebo kukuřičný chléb, mexické pivo s limetkou",
    },
    {
      nr: "13",
      name: "Sweet Fig & Nut",
      region: "Podzimní slavnostní",
      profile: "Sušené fialové fíky, vlašské ořechy, čerstvý tymián, špetka skořice, akcent medu",
      oil: "Jemný slunečnicový s oříškovým tónem",
      pairing: "Ořechový chléb, dezertní portské víno",
    },
    {
      nr: "14",
      name: "Nordic Dill",
      region: "Skandinávie",
      profile: "Bohatý svazek čerstvého kopru, růžový pepř, tenké plátky fenyklu, bílá cibule",
      oil: "Řepkový olej",
      pairing: "Severský křupavý knäckebrot, lehký cider",
    },
    {
      nr: "15",
      name: "Smoky BBQ",
      region: "Severní Amerika",
      profile: "Uzený sýr v základu, sušené papričky chipotle v adobo, pečený konfitovaný česnek",
      oil: "Slunečnicový olej",
      pairing: "Bramborový chléb, kouřové pivo (Rauchbier)",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6] text-gray-900">
      {/* Dynamic SEO Meta */}
      <SEOHead
        title="15+ variant nakládaného hermelínu: klasika, chilli, bylinky i Maroko"
        description="Nakládaný hermelín nemusí být jen cibule, česnek a chilli. Objevte více než 15 autorských chuťových variant – od české klasiky přes středomořskou až po marockou, houbovou či lanýžovou verzi."
        canonicalUrl="https://www.bezmasajidla.cz/varianty-nakladaneho-hermelinu"
        ogUrl="https://www.bezmasajidla.cz/varianty-nakladaneho-hermelinu"
        ogImage="https://www.bezmasajidla.cz/images/hermelin-15-variant-prehled.jpg"
        ogType="article"
      />

      {/* JSON-LD Schemas */}
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleJsonLd />
      <FAQPageJsonLd faqs={faqs} />

      {/* 3 Valid Recipe Schemas (Only for the 3 full recipes, not for teasers) */}
      <HermelinRecipeJsonLd
        title="Nakládaný hermelín: Bohemian Classic (Česká hospodská klasika)"
        slug="recept-bohemian-classic"
        description="Autentický recept na poctivý hospodský nakládaný hermelín s česnekovou pastou, paprikou, cibulí a beraními rohy."
        prepTimeMinutes={20}
        image="/images/hermelin-15-variant-prehled.jpg"
        ingredients={[
          "4 ks hermelínu (ideálně cca 5–7 dní před koncem trvanlivosti)",
          "2 velké žluté cibule nakrájené na tenká půlkolečka",
          "4 stroužky česneku utřené se špetkou soli",
          "1 lžička sladké mleté papriky",
          "1/2 lžičky pálivé papriky nebo drceného chilli",
          "8 kuliček nového koření",
          "15 kuliček černého pepře",
          "3 bobkové listy",
          "1 lžička celého hořčičného semínka",
          "4–6 ks sterilovaných beraních rohů",
          "500–600 ml kvalitního slunečnicového nebo řepkového oleje",
        ]}
        steps={[
          "Hermelíny podélně rozkrojte ostřeným nožem na dvě poloviny.",
          "Vnitřní řezné plochy potřete utřeným česnekem a poprašte směsí sladké i pálivé papriky.",
          "Mezi půlky vložte několik proužků cibule a sýr opět přiklopte k sobě.",
          "Na dno sterilní sklenice nasypte trochu cibule, koření a položte jeden beraní roh.",
          "Vložte sýr a pokračujte ve vrstvení cibule, koření, papriček a sýrů až po okraj.",
          "Vše zalijte olejem tak, aby byly sýry zcela ponořeny. Špejlí uvolněte vzduchové bubliny.",
          "Sklenici uzavřete a uložte do chladničky při teplotě 2–6 °C na 5 až 8 dní.",
        ]}
      />

      <HermelinRecipeJsonLd
        title="Nakládaný hermelín: Volcano (Ohnivý drak s chilli a habanero)"
        slug="recept-volcano"
        description="Extra pikantní verze nakládaného hermelínu pro milovníky ostrého jídla s čerstvými papričkami habanero a uzenou paprikou."
        prepTimeMinutes={20}
        image="/images/hermelin-15-variant-prehled.jpg"
        ingredients={[
          "4 ks hermelínu",
          "1 ks čerstvá paprička habanero nakrájená na miniaturní kostičky",
          "3 ks čerstvé červené chilli papričky podélně rozkrojené",
          "1 lžička pravé španělské uzené papriky (pimentón)",
          "1/2 lžičky kajenského pepře",
          "3 stroužky česneku nasekané",
          "1 velká červená cibule na tenká kolečka",
          "1 lžička celého černého pepře",
          "2 bobkové listy",
          "2 lžíce kvalitního chilli oleje",
          "500 ml slunečnicového oleje",
        ]}
        steps={[
          "Při manipulaci s habanero použijte rukavice. Hermelíny podélně rozkrojte.",
          "Vnitřek potřete směsí uzené papriky, kajenského pepře, česneku a trošky jemně nasekané habanero.",
          "Sýry uzavřete a do sklenice vrstvěte s červenou cibulí a rozkrojenými čerstvými chilli papričkami.",
          "Slunečnicový olej smíchejte se 2 lžícemi chilli oleje pro intenzivní barvu i prohřátí.",
          "Sýry zalijte, jemným poklepáním o desku vytlačte vzduch a uzavřete.",
          "Nechte zrát v chladničce při 2–6 °C po dobu 5 až 7 dní.",
        ]}
      />

      <HermelinRecipeJsonLd
        title="Nakládaný hermelín: Sicilia (Středomořská bylinková zahrada)"
        slug="recept-sicilia"
        description="Středomořská variace nakládaného hermelínu s naloženými sušenými rajčaty, kapary, olivami kalamata a voňavým rozmarýnem."
        prepTimeMinutes={25}
        image="/images/hermelin-15-variant-prehled.jpg"
        ingredients={[
          "4 ks hermelínu",
          "60 g kvalitních sušených rajčat v oleji (okapaných a nasekaných)",
          "2 lžíce nakládaných kaparů",
          "12 ks černých oliv Kalamata bez pecky",
          "2 snítky čerstvého rozmarýnu",
          "4 snítky čerstvého tymiánu",
          "1 lžička sušeného oregana",
          "2 stroužky česneku nakrájené na tenké plátky",
          "1 lžička kuliček barevného pepře",
          "350 ml slunečnicového oleje",
          "150 ml extra panenského olivového oleje",
        ]}
        steps={[
          "Hermelíny podélně rozkrojte. Vnitřek naplňte nasekanými sušenými rajčaty, kapary a špetkou oregana.",
          "Poloviny sýra přitiskněte zpět k sobě.",
          "Do sklenice vrstvěte bylinky, olivy kalamata, plátky česneku, barevný pepř a naplněné hermelíny.",
          "Smíchejte slunečnicový olej s panenským olivovým olejem v poměru 70:30 (zabrání ztuhnutí a hořknutí v chladu).",
          "Zalijte sýr olejem až po hrdlo, zbavte se vzduchových kapes a uzavřete.",
          "Nechte v chladničce zrát 5 až 8 dní. Podávejte s křupavou ciabattou.",
        ]}
      />

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-amber-950 via-emerald-950 to-emerald-900 text-white pt-10 pb-16 md:pt-14 md:pb-20">
          <div className="container max-w-4xl px-4 mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="text-xs text-amber-200/80 font-medium tracking-wide mb-6 flex items-center flex-wrap gap-2">
              <Link href="/" className="hover:text-white transition-colors">Domů</Link>
              <ChevronRight className="w-3 h-3 text-amber-400" />
              <Link href="/recepty" className="hover:text-white transition-colors">Recepty</Link>
              <ChevronRight className="w-3 h-3 text-amber-400" />
              <span className="text-white">Varianty nakládaného hermelínu</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-4 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Velký degustační průvodce & autorské recepty
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-amber-50 leading-tight tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              15+ variant nakládaného hermelínu: <span className="text-amber-400">od české klasiky po Maroko a Black Gold</span>
            </h1>

            <p className="text-emerald-100 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl">
              Nakládaný hermelín je pilířem české hospodské kultury, ale jeho potenciál sahá mnohem dál než k obligátní cibuli a pálivé paprice. Objevte, jak plísňový sýr proměnit v gurmánský zážitek s kořením z celého světa, jak správně pracovat s oleji a jak zajistit 100% bezpečnou přípravu v domácích podmínkách.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-emerald-200 border-t border-emerald-800/80 pt-6">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>12 min čtení</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>15 autorských variant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Průvodce bezpečným chlazením</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>E-book ke stažení zdarma</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-10 md:py-14">
          <div className="container max-w-4xl px-4 mx-auto">
            
            {/* Quick Overview Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-emerald-100 shadow-sm mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                <Utensils className="w-5 h-5 text-emerald-600" />
                Co se v tomto článku dozvíte:
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>4 pilíře dokonalého naložení:</strong> od výběru zralosti až po infuzované oleje.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Kritická pravidla hygieny a bezpečnosti:</strong> proč čerstvý česnek v oleji vyžaduje stálé chlazení.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>3 kompletní recepty krok za krokem:</strong> Česká klasika, ohnivé Volcano a bylinková Sicílie.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Srovnání všech 15 autorských variant:</strong> vč. Maroka, černého česneku, Japonska a fíků.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Bezplatný degustační e-book PDF:</strong> se všemi recepturami a fotografiemi do vaší kuchyně.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>FAQ & tipy na zbytkový olej:</strong> jak zužitkovat rozleželý nálev beze zbytku.</span>
                </li>
              </ul>
            </div>

            {/* Intro Prose */}
            <article className="prose prose-emerald max-w-none text-gray-700 leading-relaxed space-y-6 text-base sm:text-lg">
              <p>
                Když se v české hospodě řekne „něco k pivu“, nakládaný hermelín je volbou číslo jedna. Měkký sýr s bílou ušlechtilou plísní na povrchu dokáže absorbovat chutě česneku, cibule a divokého koření jako málokterá jiná surovina. Mnoho lidí má však zafixováno, že existuje pouze jediný recept – ten s hromadou cibule, sladkou paprikou a pálivým beraním rohem.
              </p>
              <p>
                Ve skutečnosti je hermelín (český příbuzný francouzského Camembertu) neuvěřitelně tvárným plátnem. Jeho tučné, krémové těsto přímo vybízí k experimentům: snese orientální směsi koření, svěží středomořské byliny, uzené tóny, asijské umami i prémiový lanýžový akcent.
              </p>
            </article>

            {/* Visual Showcase - Autorský sýrový speciál šéfkuchaře Matouše */}
            <div className="my-8 rounded-3xl overflow-hidden border border-emerald-100 shadow-md bg-white">
              <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                <img
                  src="/images/catering/matous-peceny-syr-hermelin.jpg"
                  alt="Pečený zralý sýr se semínky, restovanou paprikou a špenátem od šéfkuchaře Matouše"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium">
                  Autorská inspirace: Pečený zralý sýr se slunečnicovými semínky, restovanou paprikou a špenátem (šéfkuchař Matouš)
                </span>
              </div>
            </div>

            {/* 4 Pillars Section */}
            <div className="my-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                4 základní pilíře dokonalého naložení
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-4 text-lg">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Správná zralost sýra</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Nikdy nenakládejte hermelín právě vytažený z výrobní linky s tvrdým bílým křídovým středem. Sýr potřebuje čas. Ideální je koupit hermelín přibližně <strong>5 až 7 dní před vypršením data spotřeby</strong>. V této fázi je těsto zralé, ale kůrka stále pevná, takže sýr udrží tvar a nerozbředne se.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-4 text-lg">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Výběr a kombinace oleje</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Olej slouží jako nosič chuti. Základem by měl být vždy <strong>neutrální kvalitní slunečnicový nebo řepkový olej</strong>. Stoprocentní panenský olivový olej se nehodí – v lednici ztuhne na nevábnou pastu a polyfenoly v něm mohou v kontaktu s česnekem nepříjemně zhořknout. U středomořských verzí míchejte slunečnicový a olivový v poměru 70:30.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-4 text-lg">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Příprava náplně a separace</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Sýr vždy podélně rozkrojte a ochucující pastu vetřete přímo do těsta. Cibule funguje nejen jako aromatická složka, ale i jako fyzický separátor – jednotlivé kousky sýra se ve sklenici nesmí dotýkat stěn ani sebe navzájem, aby olej mohl volně cirkulovat a obalil každý milimetr povrchu.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-4 text-lg">
                    4
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Odvzdušnění a těsnost</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Po zalití sklenice olejem vezměte tupou špejli nebo jídelní nůž a opatrně projeďte kolem stěn, aby unikly všechny zachycené vzduchové bubliny. Sklenici lehce poklepejte o utěrku položenou na lince. Jakékoli suché místo nad hladinou oleje je vstupní branou pro nežádoucí oxidaci.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOD SAFETY MANDATORY WARNING BOX */}
            <div className="my-10 rounded-2xl bg-amber-50 border-2 border-amber-300 p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-200/80 rounded-xl text-amber-900 shrink-0 mt-0.5">
                  <ShieldAlert className="w-7 h-7 text-amber-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                      Důležité bezpečnostní upozornění
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    Nakládaný sýr je chlazená potravina, nikoli trvanlivá konzerva
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                    <p>
                      Mezi domácími kuchaři stále koluje nebezpečný mýtus, že sklenice s hermelínem má první 2–3 dny stát na teplé kuchyňské lince, „aby se rozležel“. <strong>Před tímto postupem důrazně varujeme.</strong>
                    </p>
                    <p>
                      Nalitím oleje na sýr a čerstvou zeleninu nevzniká sterilní prostředí. Naopak – olej hermeticky uzavře přístup kyslíku a vytvoří <strong>anaerobní prostředí</strong>. Pokud je v nálevu přítomen čerstvý česnek, cibule nebo čerstvé bylinky, při pokojové teplotě hrozí rychlé množení anaerobních spor mikroorganismů (včetně nebezpečného <em>Clostridium botulinum</em>).
                    </p>
                    <div className="bg-white/80 rounded-xl p-4 border border-amber-200 flex items-start gap-3 mt-3">
                      <ThermometerSnowflake className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-gray-800">
                        <strong>Zásada stálého chladu:</strong> Sýr po naložení uložte <strong>ihned do chladničky při stálé teplotě 2–6 °C</strong>. Sýr v chladu dozrává o něco pomaleji (5–10 dní podle výchozí zralosti), ale zcela bezpečně. Neexistuje univerzální bezpečná lhůta platná pro všechny varianty – recepty s čerstvými bylinkami vyžadují dřívější spotřebu než verze se sušeným kořením. Před jídlem vždy zkontrolujte čerstvost a vůni.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECIPE 1: BOHEMIAN CLASSIC */}
            <div id="recept-bohemian-classic" className="my-14 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Recept 1 ze 3 plných receptů • Česká hospoda
                  </span>
                  <div className="flex items-center gap-4 text-xs text-emerald-200">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> Příprava: 20 min</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-400" /> 4 porce</span>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Bohemian Classic — Česká hospodská klasika
                </h3>
                <p className="text-emerald-100 text-sm md:text-base mt-2">
                  Dokonalý vyvážený poměr česneku, sladké papriky, křupavé cibule a kyselkavých beraních rohů. Žádné kompromisy, jen poctivá tradice.
                </p>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 text-base uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    Suroviny (na 1 litrovou sklenici):
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    <li>• <strong>4 ks</strong> zralého hermelínu (cca 100 g / ks)</li>
                    <li>• <strong>2 ks</strong> velké žluté cibule (na tenká půlkolečka)</li>
                    <li>• <strong>4 stroužky</strong> česneku utřené se solí</li>
                    <li>• <strong>1 lžička</strong> sladké mleté papriky</li>
                    <li>• <strong>1/2 lžičky</strong> pálivé mleté papriky (nebo chilli)</li>
                    <li>• <strong>8 kuliček</strong> nového koření</li>
                    <li>• <strong>15 kuliček</strong> celého černého pepře</li>
                    <li>• <strong>3 ks</strong> bobkového listu</li>
                    <li>• <strong>1 lžička</strong> celého hořčičného semínka</li>
                    <li>• <strong>4–6 ks</strong> sterilovaných beraních rohů</li>
                    <li>• <strong>cca 500–600 ml</strong> slunečnicového oleje</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-base uppercase tracking-wider mb-3">
                    Postup přípravy krok za krokem:
                  </h4>
                  <ol className="space-y-3 text-sm text-gray-700 leading-relaxed list-decimal list-inside">
                    <li className="pl-1">
                      <strong>Příprava sýra:</strong> Hermelíny vyjměte z chladničky cca 20 minut předem, aby těsto lehce povolilo a nelámalo se. Ostrým tenkým nožem každý sýr podélně rozřízněte na dvě stejné poloviny.
                    </li>
                    <li className="pl-1">
                      <strong>Aromatická pasta:</strong> Utřený česnek smíchejte se špetkou soli a trochou sladké papriky. Touto směsí důkladně potřete obě vnitřní řezné plochy sýra. Lehce poprašte pálivou paprikou.
                    </li>
                    <li className="pl-1">
                      <strong>Naplnění:</strong> Mezi rozkrojené poloviny vložte několik plátků cibule a sýr jemně přiklopte zpět k sobě. Můžete ho rozkrojit na čtvrtiny nebo trojúhelníčky pro snazší servírování.
                    </li>
                    <li className="pl-1">
                      <strong>Vrstvení do sklenice:</strong> Na dno čisté a suché litrové sklenice dejte vrstvu cibule, pár kuliček pepře, nového koření a jeden beraní roh. Vložte sýr. Pokračujte ve vrstvení: cibule, koření, beraní roh, sýr. Zakončete vrstvou cibule a bobkovým listem u stěny sklenice.
                    </li>
                    <li className="pl-1">
                      <strong>Zalití olejem:</strong> Pomalu zalévejte slunečnicovým olejem. Dbejte na to, aby olej zatekl do všech mezer a všechny suroviny byly kompletně ponořené pod hladinou.
                    </li>
                    <li className="pl-1">
                      <strong>Odvzdušnění a zrání:</strong> Špejlí propíchněte vzduchové kapsy. Sklenici uzavřete a uložte do chladničky (2–6 °C) na <strong>5 až 8 dní</strong>. Před podáváním nechte porci sýra 15 minut stát při pokojové teplotě, aby se uvolnily aromatické tuky.
                    </li>
                  </ol>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span><strong>Tip k servírování:</strong> Podávejte s čerstvým kváskovým chlebem, nakládanou cibulkou a dobře vychlazeným plzeňským ležákem.</span>
                </div>
              </div>
            </div>

            {/* CTA POSITION A */}
            <div className="my-12">
              <HermelinEbookCta position="A" />
            </div>

            {/* RECIPE 2: VOLCANO */}
            <div id="recept-volcano" className="my-14 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-red-800 to-rose-900 text-white p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Recept 2 ze 3 plných receptů • Extra pálivý
                  </span>
                  <div className="flex items-center gap-4 text-xs text-rose-200">
                    <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> Pálivost: 4/5</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> Příprava: 20 min</span>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Volcano (Ohnivý drak) — Chilli & Habanero
                </h3>
                <p className="text-rose-100 text-sm md:text-base mt-2">
                  Exploze chutí pro ty, kterým běžná hospodská feferonka nestačí. Spojení kouřové uzené papriky s ovocnou ostrostí čerstvého habanera.
                </p>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 text-base uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-rose-600" />
                    Suroviny:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                    <li>• <strong>4 ks</strong> zralého hermelínu</li>
                    <li>• <strong>1 ks</strong> čerstvá paprička habanero (najemno nasekaná)</li>
                    <li>• <strong>3 ks</strong> čerstvé červené chilli papričky (podélně rozkrojené)</li>
                    <li>• <strong>1 lžička</strong> španělské uzené papriky (pimentón)</li>
                    <li>• <strong>1/2 lžičky</strong> kajenského pepře</li>
                    <li>• <strong>3 stroužky</strong> česneku (prolisované)</li>
                    <li>• <strong>1 velká</strong> červená cibule (na tenká kolečka)</li>
                    <li>• <strong>1 lžička</strong> kuliček černého pepře</li>
                    <li>• <strong>2 ks</strong> bobkového listu</li>
                    <li>• <strong>2 lžíce</strong> pikantního chilli oleje</li>
                    <li>• <strong>500 ml</strong> slunečnicového oleje</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-base uppercase tracking-wider mb-3">
                    Postup přípravy:
                  </h4>
                  <ol className="space-y-3 text-sm text-gray-700 leading-relaxed list-decimal list-inside">
                    <li className="pl-1">
                      <strong>Bezpečnost především:</strong> Při krájení papričky habanero doporučujeme použít kuchyňské rukavice a nedotýkat se očí ani obličeje. Habanero nasekejte na co nejmenší kostičky.
                    </li>
                    <li className="pl-1">
                      <strong>Ohnivá pasta:</strong> V misce smíchejte uzenou papriku, kajenský pepř, prolisovaný česnek a nasekané habanero se lžičkou oleje. Vznikne sytě červená, voňavá pasta.
                    </li>
                    <li className="pl-1">
                      <strong>Proříznutí a plnění:</strong> Hermelíny podélně rozřízněte, pastu rovnoměrně rozetřete na řezné plochy a sýry opět uzavřete.
                    </li>
                    <li className="pl-1">
                      <strong>Skládání do sklenice:</strong> Prokládejte kolečky červené cibule a podélně rozkrojenými čerstvými chilli papričkami. Červená cibule v kombinaci s papričkami vytvoří nádherný vizuální kontrast.
                    </li>
                    <li className="pl-1">
                      <strong>Nálev a zrání:</strong> Slunečnicový olej smíchejte se 2 lžícemi chilli oleje a zalijte obsah sklenice. Uvolněte bubliny a sklenici dejte do chladničky (2–6 °C) na <strong>5 až 7 dní</strong>. Kapsaicin z chilli se postupně rozpustí v tucích a sýr získá hlubokou, plnou pálivost.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* RECIPE 3: SICILIA */}
            <div id="recept-sicilia" className="my-14 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-amber-700 to-orange-800 text-white p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                    Recept 3 ze 3 plných receptů • Středomoří
                  </span>
                  <div className="flex items-center gap-4 text-xs text-amber-100">
                    <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-300" /> Chuť: Bylinková & Umami</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-300" /> Příprava: 25 min</span>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Sicilia — Středomořská bylinková zahrada
                </h3>
                <p className="text-amber-100 text-sm md:text-base mt-2">
                  Elegantní varianta bez pálivosti, postavená na sušených rajčatech, slaných kaparech, černých olivách a snítkách čerstvého rozmarýnu.
                </p>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 text-base uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    Suroviny:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                    <li>• <strong>4 ks</strong> zralého hermelínu</li>
                    <li>• <strong>60 g</strong> kvalitních sušených rajčat v oleji (nasekaných)</li>
                    <li>• <strong>2 lžíce</strong> sterilovaných kaparů (okapaných)</li>
                    <li>• <strong>12 ks</strong> černých oliv Kalamata bez pecky</li>
                    <li>• <strong>2 snítky</strong> čerstvého rozmarýnu</li>
                    <li>• <strong>4 snítky</strong> čerstvého tymiánu</li>
                    <li>• <strong>1 lžička</strong> sušeného oregana</li>
                    <li>• <strong>2 stroužky</strong> česneku (na velmi tenké plátky)</li>
                    <li>• <strong>1 lžička</strong> kuliček barevného pepře</li>
                    <li>• <strong>350 ml</strong> slunečnicového oleje</li>
                    <li>• <strong>150 ml</strong> extra panenského olivového oleje</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-base uppercase tracking-wider mb-3">
                    Postup přípravy:
                  </h4>
                  <ol className="space-y-3 text-sm text-gray-700 leading-relaxed list-decimal list-inside">
                    <li className="pl-1">
                      <strong>Příprava středomořské náplně:</strong> Sušená rajčata a kapary nasekejte nadrobno. Promíchejte s oreganem a plátky česneku.
                    </li>
                    <li className="pl-1">
                      <strong>Plnění sýra:</strong> Rozkrojené hermelíny velkoryse naplňte rajčatovou směsí a lehce přimáčkněte.
                    </li>
                    <li className="pl-1">
                      <strong>Aromatické vrstvení:</strong> Do sklenice vkládejte naplněné hermelíny, celé černé olivy, kuličky barevného pepře a podél skla zasuňte celé větvičky rozmarýnu a tymiánu.
                    </li>
                    <li className="pl-1">
                      <strong>Olejová rovnováha:</strong> Smíchejte slunečnicový a panenský olivový olej v poměru 70:30. Získáte nádhernou vůni oliv, ale olej v lednici neztuhne na tvrdý tuk.
                    </li>
                    <li className="pl-1">
                      <strong>Zrání:</strong> Zalijte, odvzdušněte a uložte do chladničky (2–6 °C) na <strong>5 až 8 dní</strong>. Podávejte s čerstvě upečenou křupavou ciabattou.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* TEASER: ESSAOUIRA */}
            <div className="my-12 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-yellow-50 border border-amber-200 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Autorský degustační teaser
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    Essaouira — Marocký orient s Ras el Hanout
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                    Inspirace kouzelným přístavním městem na pobřeží Atlantiku. Kombinace severoafrického koření Ras el Hanout (kardamom, skořice, hřebíček, muškátový květ), proužků pomerančové kůry, praženého římského kmínu a sekaných mandlí. Hermelín v této úpravě získá hlubokou, hřejivou a exotickou chuť, která v české kuchyni nemá obdoby.
                  </p>
                  <div className="text-xs text-amber-900 bg-white/70 p-3 rounded-xl border border-amber-200">
                    💡 <em>Kompletní gramáže koření, techniku přípravy citrusového macerátu a zbývajících 12 unikátních receptur najdete v našem bezplatném e-booku níže.</em>
                  </div>
                </div>
              </div>
            </div>

            {/* 15 VARIANTS OVERVIEW & PHOTO */}
            <div className="my-16">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Kompletní degustační atlas
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  15 autorských variant nakládaného hermelínu
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Každá varianta má svůj jedinečný chuťový profil, doporučený olej a ideální nápoj k párování.
                </p>
              </div>

              {/* Master visual image */}
              <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-white">
                <img
                  src="/images/hermelin-15-variant-prehled.jpg"
                  alt="Přehled 15 autorských variant nakládaného hermelínu ve sklenicích"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500 italic">
                  Všech 15 autorských variant nakládaného hermelínu v degustačním provedení s označenými sklenicemi.
                </div>
              </div>

              {/* Comparison Table / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variants.map((v) => (
                  <div
                    key={v.nr}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          #{v.nr}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                          {v.region}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mb-2">{v.name}</h4>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        <strong className="text-gray-700">Profil:</strong> {v.profile}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-2 text-[11px] text-gray-500 space-y-1">
                      <div><strong className="text-gray-700">Olej:</strong> {v.oil}</div>
                      <div><strong className="text-gray-700">K čemu:</strong> {v.pairing}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA POSITION B */}
            <div className="my-14">
              <HermelinEbookCta position="B" />
            </div>

            {/* Practical Advice & Oil recycling */}
            <div className="my-14 bg-white rounded-2xl p-6 md:p-8 border border-emerald-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Gurmánské desatero: Jak naložený sýr servírovat a co se zbylým olejem?
              </h3>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  <strong>Temperování před podáváním:</strong> Nakládaný hermelín nikdy nepodávejte přímo z chladničky. Vyjměte ho cca 15 až 20 minut před konzumací na servírovací talíř. Při pokojové teplotě povolí ztuhlý mléčný tuk, střed se stane hedvábně krémovým a rozvinou se všechny těkavé aromatické látky z bylinek.
                </p>
                <p>
                  <strong>Co udělat se zbylým olejem:</strong> Po vyjmutí posledního sýra vám ve sklenici zbyde 300–400 ml oleje nasáklého esencí česneku, cibule, bylin a koření. <em>Z hygienických důvodů do něj nikdy nenakládejte další várku sýra.</em> Olej ale rozhodně nevylévejte!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <strong className="text-emerald-900 block mb-1">🥔 Pečené brambory</strong>
                    Olej z Bohemian Classic nebo Volcana promíchejte s nakrájenými bramborami a upečte do křupava v troubě.
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <strong className="text-emerald-900 block mb-1">🥗 Salátový dresink</strong>
                    Olej ze Sicilie nebo Provence smíchejte s citronovou šťávou či vinným octem na skvělou zálivku.
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <strong className="text-emerald-900 block mb-1">🍳 Cibulový základ</strong>
                    Použijte olej jako voňavý základ pod zeleninový guláš, restovanou hříbkovou směs nebo polévku.
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ SECTION */}
            <div className="my-14">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Otázky a odpovědi
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Často kladené otázky (FAQ)
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-base mb-2 flex items-start gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed pl-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Links: Related Recipes Section */}
            <div className="my-14 bg-emerald-900 text-white rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-amber-300" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Hledáte další inspiraci na poctivá bezmasá jídla?
              </h3>
              <p className="text-emerald-100 text-sm mb-6 max-w-2xl">
                Prozkoumejte naše oblíbené tematické rubriky – od české hospodské kuchyně až po bleskové večeře během všedního dne:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
                <Link
                  href="/recepty/ceska-klasika-bez-masa"
                  className="bg-emerald-800/80 hover:bg-emerald-700/80 p-4 rounded-xl border border-emerald-700 transition flex flex-col justify-between"
                >
                  <span className="text-amber-300 font-bold mb-1">Česká klasika bez masa</span>
                  <span className="text-emerald-200 text-[11px]">Svíčková, guláše a bramboráky ve vegetariánské verzi</span>
                  <span className="text-amber-400 mt-3 flex items-center gap-1">Zobrazit recepty <ArrowRight className="w-3 h-3" /></span>
                </Link>

                <Link
                  href="/recepty/rychle-bezmase-vecere"
                  className="bg-emerald-800/80 hover:bg-emerald-700/80 p-4 rounded-xl border border-emerald-700 transition flex flex-col justify-between"
                >
                  <span className="text-amber-300 font-bold mb-1">Rychlé večeře do 30 min</span>
                  <span className="text-emerald-200 text-[11px]">Snadné bezmasé recepty pro celou rodinu po náročném dni</span>
                  <span className="text-amber-400 mt-3 flex items-center gap-1">Zobrazit recepty <ArrowRight className="w-3 h-3" /></span>
                </Link>

                <Link
                  href="/recepty/tofu"
                  className="bg-emerald-800/80 hover:bg-emerald-700/80 p-4 rounded-xl border border-emerald-700 transition flex flex-col justify-between"
                >
                  <span className="text-amber-300 font-bold mb-1">Recepty s tofu</span>
                  <span className="text-emerald-200 text-[11px]">Jak ochutit a upéct tofu, aby chutnalo i zapřisáhlým masožroutům</span>
                  <span className="text-amber-400 mt-3 flex items-center gap-1">Zobrazit recepty <ArrowRight className="w-3 h-3" /></span>
                </Link>

                <Link
                  href="/recepty"
                  className="bg-emerald-800/80 hover:bg-emerald-700/80 p-4 rounded-xl border border-emerald-700 transition flex flex-col justify-between"
                >
                  <span className="text-amber-300 font-bold mb-1">Katalog všech receptů</span>
                  <span className="text-emerald-200 text-[11px]">Kompletní databáze stovek bezmasých a veganských pokrmů</span>
                  <span className="text-amber-400 mt-3 flex items-center gap-1">Přejít do katalogu <ArrowRight className="w-3 h-3" /></span>
                </Link>
              </div>
            </div>

            {/* CTA POSITION C (FINAL) */}
            <div className="my-14">
              <HermelinEbookCta position="C" />
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
