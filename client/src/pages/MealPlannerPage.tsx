// ============================================================
// BEZMASAJIDLA.CZ — MealPlannerPage
// "Týdenní Bezmasý Jídelníček & Nákupní Košík"
// High-conversion SEO & Affiliate tool
// ============================================================

import { useState, useMemo } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { recipes, type Recipe } from "@/lib/data";
import { getRohlikLink, getKosikLink, trackAffiliateClick } from "@/lib/affiliates";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  Calendar,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight,
  Share2,
  Copy,
  Utensils
} from "lucide-react";

const DAYS_OF_WEEK = [
  "Pondělí",
  "Úterý",
  "Středa",
  "Čtvrtek",
  "Pátek",
  "Sobota",
  "Neděle",
];

export default function MealPlannerPage() {
  const [filterType, setFilterType] = useState<"all" | "vegan" | "glutenFree">("all");
  const [copied, setCopied] = useState(false);
  const [portionMultiplier, setPortionMultiplier] = useState(2);

  // Filter recipes based on dietary preference
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      if (filterType === "vegan") return r.isVegan;
      if (filterType === "glutenFree") return r.isGlutenFree;
      return true;
    });
  }, [filterType]);

  // Generate initial random meal plan for 7 days
  const [mealPlan, setMealPlan] = useState<Recipe[]>(() => {
    const pool = [...recipes];
    // Shuffle
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  });

  const regeneratePlan = () => {
    const pool = [...filteredRecipes];
    const shuffled = pool.sort(() => 0.5 - Math.random());
    setMealPlan(shuffled.slice(0, 7));
  };

  const replaceDay = (dayIndex: number) => {
    const currentSlugs = new Set(mealPlan.map(m => m.slug));
    const available = filteredRecipes.filter(r => !currentSlugs.has(r.slug));
    if (available.length === 0) return;
    const randomChoice = available[Math.floor(Math.random() * available.length)];
    const updated = [...mealPlan];
    updated[dayIndex] = randomChoice;
    setMealPlan(updated);
  };

  // Aggregate all main key ingredients across the 7 meals
  const aggregatedIngredients = useMemo(() => {
    const itemSet = new Set<string>();
    mealPlan.forEach(recipe => {
      // Pick recipe title keywords or tags for smart cart search
      const keyItems = recipe.title
        .replace(/s\s+/gi, "")
        .replace(/a\s+/gi, "")
        .split(" ")
        .filter(w => w.length > 3);
      keyItems.forEach(k => itemSet.add(k.toLowerCase()));
    });
    return Array.from(itemSet).slice(0, 10);
  }, [mealPlan]);

  const mainQuery = mealPlan.slice(0, 3).map(r => r.title.split(" ")[0]).join(" ");

  const copyShoppingList = () => {
    const listText = mealPlan
      .map((recipe, index) => `${DAYS_OF_WEEK[index]}: ${recipe.title} (${portionMultiplier} porce)`)
      .join("\n");
    navigator.clipboard.writeText(`🌱 Týdenní jídelníček z bezmasajidla.cz (${portionMultiplier} porce):\n\n${listText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const totalPrepMinutes = mealPlan.reduce((acc, r) => acc + (r.prepTime || 15) + (r.cookTime || 20), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Týdenní Bezmasý Jídelníček & Nákupní Seznam | Bezmasá Jídla"
        description="Vytvořte si vyvážený týdenní bezmasý jídelníček z ověřených receptů. Jedním klikem nakupte surovin na Rohlík.cz nebo Košík.cz."
        canonicalUrl="https://www.bezmasajidla.cz/tydenni-planovac-receptu"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Recepty", url: "/recepty" },
          { name: "Týdenní Plánovač", url: "/tydenni-planovac-receptu" },
        ]}
      />
      <Header />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interaktivní SEO Nástroj pro Zdravé Vaření</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Týdenní Bezmasý Jídelníček
          </h1>
          <p className="text-emerald-100/90 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
            Naplánujte si bezstarostný týden plný chutných, vyvážených vegetariánských a veganských večeří. Suroviny na celý týden přidejte jedním klikem do košíku.
          </p>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={regeneratePlan}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Vygenerovat nový plán
            </button>

            <div className="flex bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/80">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === "all" ? "bg-emerald-700 text-white shadow-sm" : "text-emerald-300 hover:text-white"
                }`}
              >
                Vše bez masa
              </button>
              <button
                onClick={() => setFilterType("vegan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === "vegan" ? "bg-emerald-700 text-white shadow-sm" : "text-emerald-300 hover:text-white"
                }`}
              >
                 Pouze Veganské
              </button>
              <button
                onClick={() => setFilterType("glutenFree")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === "glutenFree" ? "bg-emerald-700 text-white shadow-sm" : "text-emerald-300 hover:text-white"
                }`}
              >
                🌾 Bez lepku
              </button>
            </div>

            {/* Portion Counter */}
            <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/80 text-xs text-emerald-200">
              <span>Počet osob:</span>
              {[1, 2, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setPortionMultiplier(num)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                    portionMultiplier === num ? "bg-emerald-600 text-white" : "hover:bg-emerald-800 text-emerald-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 container max-w-5xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: 7-Day Plan List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                <Calendar className="w-5 h-5 text-emerald-700" />
                Váš týdenní jídelníček
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Celkový čas vaření: ~{Math.round(totalPrepMinutes / 7)} min / den
              </span>
            </div>

            {mealPlan.map((recipe, idx) => (
              <div
                key={`${recipe.slug}-${idx}`}
                className="bg-white rounded-2xl border border-emerald-100/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
              >
                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-emerald-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {DAYS_OF_WEEK[idx]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold mb-1">
                    <span>{recipe.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {(recipe.prepTime || 15) + (recipe.cookTime || 20)} min
                    </span>
                    {recipe.isVegan && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md border border-emerald-200">
                        Vegan
                      </span>
                    )}
                  </div>

                  <Link href={`/recepty/${recipe.slug}`}>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate cursor-pointer">
                      {recipe.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {recipe.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-50">
                  <button
                    onClick={() => replaceDay(idx)}
                    title="Vyměnit toto jídlo za jiné"
                    className="flex-1 sm:flex-initial text-xs text-gray-500 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 p-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Vyměnit</span>
                  </button>

                  <Link href={`/recepty/${recipe.slug}`}>
                    <button className="flex-1 sm:flex-initial text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <span>Recept</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Right Col: Instant Grocery Affiliate Shopping Cart */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-xl sticky top-24">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Koupit ingredience
                </h3>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed mb-6">
                Přeneste seznam surovin pro tento 7-denní jídelníček přímo do svého košíku na online potravinách.
              </p>

              {/* Affiliate Action Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href={getRohlikLink(mainQuery, aggregatedIngredients)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAffiliateClick("Rohlik", "meal_planner")}
                  className="w-full bg-[#D42B28] hover:bg-[#b8221f] text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Nakoupit na Rohlík.cz</span>
                </a>

                <a
                  href={getKosikLink(mainQuery, aggregatedIngredients)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAffiliateClick("Kosik", "meal_planner")}
                  className="w-full bg-[#1E56B7] hover:bg-[#184596] text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Nakoupit na Košík.cz</span>
                </a>
              </div>

              {/* Copy List Tool */}
              <button
                onClick={copyShoppingList}
                className="w-full bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 font-semibold text-xs py-2.5 px-3 rounded-xl border border-emerald-700/60 flex items-center justify-center gap-2 transition-colors mb-6"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Zkopírováno do schránky!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Zkopírovat nákupní seznam</span>
                  </>
                )}
              </button>

              {/* Key Ingredients Summary */}
              <div className="border-t border-emerald-800/60 pt-4">
                <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" /> Hlavní suroviny plánu
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {aggregatedIngredients.map(item => (
                    <span key={item} className="text-[11px] bg-emerald-950/80 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-800/40 capitalize">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
