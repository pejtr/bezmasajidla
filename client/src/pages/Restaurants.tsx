// ============================================================
// BEZMASAJIDLA.CZ — Restaurants Listing Page
// "Zelená Metropole" — two-column: filters left, results right
// ============================================================

import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { restaurants, districts, cuisineTags, RestaurantType } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Restaurants() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.includes("?") ? location.split("?")[1] : "");

  const [searchQuery, setSearchQuery] = useState(params.get("q") || "");
  const [selectedType, setSelectedType] = useState<RestaurantType | "all">(
    (params.get("type") as RestaurantType) || "all"
  );
  const [selectedDistrict, setSelectedDistrict] = useState(params.get("district") || "Všechny čtvrti");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedType !== "all" && r.type !== selectedType) return false;
      if (selectedDistrict !== "Všechny čtvrti" && r.district !== selectedDistrict) return false;
      if (showOpenOnly && !r.isOpen) return false;
      if (selectedTags.length > 0 && !selectedTags.some(t => r.tags.includes(t))) return false;
      return true;
    });
  }, [searchQuery, selectedType, selectedDistrict, showOpenOnly, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedDistrict("Všechny čtvrti");
    setShowOpenOnly(false);
    setSelectedTags([]);
  };

  const hasFilters = selectedType !== "all" || selectedDistrict !== "Všechny čtvrti" || showOpenOnly || selectedTags.length > 0 || searchQuery;

  const typeOptions: { value: RestaurantType | "all"; label: string; color: string }[] = [
    { value: "all", label: "Vše", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    { value: "vegan", label: "Veganské", color: "bg-emerald-700 text-white hover:bg-emerald-600" },
    { value: "vegetarian", label: "Vegetariánské", color: "bg-emerald-500 text-white hover:bg-emerald-400" },
    { value: "friendly", label: "Vegan-friendly", color: "bg-amber-400 text-amber-900 hover:bg-amber-300" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      {/* Page header */}
      <div className="bg-emerald-800 py-10">
        <div className="container">
          <nav className="text-xs text-emerald-300 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            <span>/</span>
            <span className="text-white">Restaurace</span>
          </nav>
          <h1
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Veganské & Vegetariánské Restaurace v Praze
          </h1>
          <p className="text-emerald-200 text-sm">
            {restaurants.length} restaurací v databázi · Aktualizováno 2026
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Hledat restauraci, čtvrť, kuchyni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 md:hidden"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtry
          </Button>
          <Link href="/mapa">
            <Button variant="outline" className="hidden md:flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <MapPin className="w-4 h-4" />
              Mapa
            </Button>
          </Link>
        </div>

        <div className="flex gap-8">
          {/* ── SIDEBAR FILTERS ── */}
          <aside className={`w-64 flex-shrink-0 ${filtersOpen ? "block" : "hidden"} md:block`}>
            <div className="bg-white rounded-xl border border-emerald-100 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">Filtry</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                    <X className="w-3 h-3" /> Vymazat
                  </button>
                )}
              </div>

              {/* Type filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Typ restaurace</p>
                <div className="flex flex-col gap-1.5">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedType(opt.value)}
                      className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                        selectedType === opt.value ? opt.color : "text-gray-600 hover:bg-emerald-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* District filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Čtvrť</p>
                <div className="flex flex-col gap-1">
                  {districts.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDistrict(d)}
                      className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        selectedDistrict === d
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-600 hover:bg-emerald-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Open now */}
              <div className="mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOpenOnly}
                    onChange={(e) => setShowOpenOnly(e.target.checked)}
                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Pouze otevřené</span>
                </label>
              </div>

              {/* Cuisine tags */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kuchyně</p>
                <div className="flex flex-wrap gap-1.5">
                  {cuisineTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-white text-gray-600 border-emerald-100 hover:border-emerald-400 hover:text-emerald-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── RESULTS ── */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Nalezeno <span className="font-semibold text-gray-900">{filtered.length}</span> restaurací
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 md:hidden">
                  <X className="w-3 h-3" /> Vymazat filtry
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-emerald-100 p-12 text-center">
                <div className="text-4xl mb-3">🌿</div>
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Žádné výsledky
                </h3>
                <p className="text-sm text-gray-500 mb-4">Zkus upravit filtry nebo vyhledávací dotaz.</p>
                <Button onClick={clearFilters} variant="outline" className="border-emerald-200 text-emerald-700">
                  Vymazat filtry
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((r, i) => (
                  <RestaurantCard key={r.id} restaurant={r} rank={i + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
