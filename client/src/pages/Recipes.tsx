// ============================================================
// BEZMASAJIDLA.CZ — Recipes Page
// "Zelená Metropole" — recipe grid with category filters
// ============================================================

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/lib/data";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

const RECIPE_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/recipe-hero-kAEk42WS8auJkLKnU8C6NV.webp";

const categories = ["Vše", "Hlavní jídla", "Polévky", "Saláty a misky", "Snídáně", "Dezerty", "Nápoje"];

const cuisines = [
  { key: "", label: "Všechny kuchyně", flag: "🌍" },
  { key: "česká", label: "Česká", flag: "🇨🇿" },
  { key: "italská", label: "Italská", flag: "🇮🇹" },
  { key: "gruzínská", label: "Gruzínská", flag: "🇬🇪" },
  { key: "asijská", label: "Asijská", flag: "🇨🇳" },
  { key: "maďarská", label: "Maďarská", flag: "🇭🇺" },
  { key: "slovenská", label: "Slovenská", flag: "🇸🇰" },
  { key: "mexická", label: "Mexická", flag: "🇲🇽" },
  { key: "indická", label: "Indická", flag: "🇮🇳" },
];

const categorySEO: Record<string, { title: string, desc: string }> = {
  "Vše": {
    title: "Bezmasé Recepty — Veganské a Vegetariánské Recepty",
    desc: "Sbírka ověřených veganských a vegetariánských receptů. Inspirujte se a objevte nejlepší bezmasá jídla od snídaně po dezert."
  },
  "Hlavní jídla": {
    title: "Hlavní Bezmasá Jídla — Veganské a Vegetariánské Recepty",
    desc: "Vynikající recepty na vegetariánská a veganská hlavní jídla. Bohaté a výživné obědy a večeře plné zeleniny a rostlinných proteinů."
  },
  "Polévky": {
    title: "Veganské a Vegetariánské Polévky — Zahřejí a Zasytí",
    desc: "Od tradiční bramboračky nebo kulajdy až po asijské vývary. Nejlepší recepty na bezmasé polévky, které zvládnete do 30 i 60 minut."
  },
  "Saláty a misky": {
    title: "Svěží Saláty a Poke Misky — Bezmasá Sezóna",
    desc: "Osvěžující a výživné veganské saláty a moderní buddha bowls. Recepty vhodné ke zdravému obědu i lehké večeři."
  },
  "Snídáně": {
    title: "Veganské Snídaně — Skvělý Start do Nového Dne",
    desc: "Bezmasé recepty na sladké i slané snídaně. Dopřejte si energií nabité lívance, ovesné kaše, zdravé tousty nebo veganské palačinky."
  },
  "Dezerty": {
    title: "Zdravé a Lahodné Dezerty Bez Masa a Živočišných Tuků",
    desc: "Nejlepší vegetariánské a veganské sladkosti, raw dorty a veganské pečení, které potěší i náročné gurmány."
  },
  "Nápoje": {
    title: "Zdravé Nápoje a Smoothie - Veganské Osvěžení",
    desc: "Smoothie plné vitamínů, čerstvé džusy a hřejivé nápoje pro podporu imunity."
  }
};

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Vše");
  const [veganOnly, setVeganOnly] = useState(false);
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [prepTimeFilter, setPrepTimeFilter] = useState<number | null>(null);

  // Read URL params on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    const cuisine = params.get("cuisine") || "";
    const type = params.get("type") || "";
    const diet = params.get("diet") || "";

    if (q) setSearchQuery(q);
    if (cuisine) setCuisineFilter(cuisine.toLowerCase());
    if (type === "vegan") setVeganOnly(true);
    if (diet === "vegan") setVeganOnly(true);
  }, []);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      if (selectedCategory !== "Vše" && r.category !== selectedCategory) return false;
      if (veganOnly && !r.isVegan) return false;
      // Cuisine filter: match against recipe tags (e.g. "gruzínská" matches tag "Gruzínská kuchyně") or exact cuisine string
      if (cuisineFilter) {
        const cf = cuisineFilter.toLowerCase();
        const matches = r.cuisine?.toLowerCase().includes(cf) ||
          r.tags.some(t => t.toLowerCase().includes(cf)) ||
          r.title.toLowerCase().includes(cf);
        if (!matches) return false;
      }
      // Difficulty
      if (difficultyFilter && r.difficulty !== difficultyFilter) return false;
      // Prep Time
      if (prepTimeFilter !== null) {
        const total = r.prepTime + r.cookTime;
        if (prepTimeFilter === 15 && total > 15) return false;
        if (prepTimeFilter === 30 && (total <= 15 || total > 30)) return false;
        if (prepTimeFilter === 60 && (total <= 30 || total > 60)) return false;
        if (prepTimeFilter === 61 && total <= 60) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, veganOnly, cuisineFilter, difficultyFilter, prepTimeFilter]);

  const currentSEOParams = categorySEO[selectedCategory] || categorySEO["Vše"];
  const dynamicTitle = cuisineFilter ? `${cuisines.find(c => c.key === cuisineFilter)?.label} Kuchyně | ${currentSEOParams.title}` : currentSEOParams.title;
  const dynamicDesc = cuisineFilter ? `Objevte ty nejlepší bezmasé recepty orientované na ${cuisineFilter} kuchyni. ${currentSEOParams.desc}` : currentSEOParams.desc;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title={dynamicTitle}
        description={dynamicDesc}
        ogUrl={`https://www.bezmasajidla.cz/recepty${selectedCategory !== "Vše" ? `?category=${selectedCategory}` : ""}`}
      />
      <Header />

      {/* Hero */}
      <div className="relative bg-emerald-800 py-14 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${RECIPE_HERO})` }}
        />
        <div className="relative container">
          <nav className="text-xs text-emerald-300 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            <span>/</span>
            <span className="text-white">Recepty</span>
          </nav>
          <h1
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Bezmasé Recepty
          </h1>
          <p className="text-emerald-200 text-sm">
            {recipes.length} ověřených receptů · Veganské & vegetariánské
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Hledat recept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer bg-white border border-emerald-100 rounded-xl px-4 py-2.5 shadow-sm">
            <input
              type="checkbox"
              checked={veganOnly}
              onChange={(e) => setVeganOnly(e.target.checked)}
              className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700 whitespace-nowrap">Pouze veganské</span>
          </label>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-colors flex-shrink-0 ${selectedCategory === cat
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-gray-600 border border-emerald-100 hover:border-emerald-400 hover:text-emerald-700"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cuisine filter row */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Kuchyně světa</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cuisines.map((c) => (
              <button
                key={c.key}
                onClick={() => setCuisineFilter(c.key)}
                className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${cuisineFilter === c.key
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-amber-100 hover:border-amber-400 hover:text-amber-700"
                  }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty and Prep time row */}
        <div className="flex gap-6 mb-6 overflow-x-auto pb-1">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Náročnost</p>
            <div className="flex gap-2">
              {[
                { val: "", label: "Nerozhoduje" },
                { val: "snadný", label: "Snadná příprava" },
                { val: "střední", label: "Střední náročnost" },
                { val: "náročný", label: "Náročná" }
              ].map(d => (
                <button
                  key={d.val}
                  onClick={() => setDifficultyFilter(d.val)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 ${difficultyFilter === d.val ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Doba přípravy</p>
            <div className="flex gap-2">
              {[
                { val: null, label: "Nerozhoduje" },
                { val: 15, label: "Do 15 min" },
                { val: 30, label: "Do 30 min" },
                { val: 60, label: "Do 60 min" },
                { val: 61, label: "Nad hodinu" }
              ].map(p => (
                <button
                  key={p.val === null ? 'null' : p.val}
                  onClick={() => setPrepTimeFilter(p.val)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 ${prepTimeFilter === p.val ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500 mb-4">
          Nalezeno <span className="font-semibold text-gray-900">{filtered.length}</span> receptů
        </p>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-emerald-100 p-12 text-center">
            <div className="text-4xl mb-3">🥦</div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Žádné recepty nenalezeny
            </h3>
            <p className="text-sm text-gray-500">Zkus upravit vyhledávání nebo filtr.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
