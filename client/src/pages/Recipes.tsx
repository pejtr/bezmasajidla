// ============================================================
// BEZMASAJIDLA.CZ — Recipes Page
// "Zelená Metropole" — recipe grid with category filters
// ============================================================

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/lib/data";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

const RECIPE_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/recipe-hero-kAEk42WS8auJkLKnU8C6NV.webp";

const categories = ["Vše", "Hlavní jídla", "Polévky", "Saláty a misky", "Snídaně", "Dezerty"];

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Vše");
  const [veganOnly, setVeganOnly] = useState(false);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== "Vše" && r.category !== selectedCategory) return false;
      if (veganOnly && !r.isVegan) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, veganOnly]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Bezmasé Recepty — Veganské a Vegetariánské Recepty"
        description="Sbírka ověřených veganských a vegetariánských receptů. Hlavní jídla, polévky, saláty, dezerty a snídaně bez masa."
        ogUrl="https://www.bezmasajidla.cz/recepty"
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
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-emerald-100 hover:border-emerald-400 hover:text-emerald-700"
              }`}
            >
              {cat}
            </button>
          ))}
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
