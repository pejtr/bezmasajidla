// ============================================================
// BEZMASAJIDLA.CZ — Restaurants Listing Page
// "Zelená Metropole" — two-column: filters left, results right
// Includes dietary options filter, price filter, and sorting
// ============================================================

import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, X, MapPin, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { restaurants, districts, cuisineTags, dietaryOptionsConfig, RestaurantType, DietaryOption } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

type SortOption = "popularity" | "rating" | "reviews" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Popularita" },
  { value: "rating", label: "Nejlépe hodnocené" },
  { value: "reviews", label: "Nejvíce recenzí" },
  { value: "price-asc", label: "Cena: nejlevnější" },
  { value: "price-desc", label: "Cena: nejdražší" },
  { value: "name", label: "Název A–Z" },
];

const priceLevels = [
  { value: 1, label: "Kč", description: "Do 200 Kč" },
  { value: 2, label: "Kč Kč", description: "200–400 Kč" },
  { value: 3, label: "Kč Kč Kč", description: "400+ Kč" },
] as const;

export default function Restaurants() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.includes("?") ? location.split("?")[1] : "");

  const [searchQuery, setSearchQuery] = useState(params.get("q") || "");
  const [selectedType, setSelectedType] = useState<RestaurantType | "all">(
    (params.get("type") as RestaurantType) || "all"
  );
  const [selectedDistrict, setSelectedDistrict] = useState(params.get("district") || "Všechny čtvrti");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<DietaryOption[]>([]);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<number[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = restaurants.filter((r) => {
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedType !== "all" && r.type !== selectedType) return false;
      if (selectedDistrict !== "Všechny čtvrti" && r.district !== selectedDistrict) return false;
      if (showOpenOnly && !r.isOpen) return false;
      if (selectedTags.length > 0 && !selectedTags.some(t => r.tags.includes(t))) return false;
      if (selectedDietary.length > 0 && !selectedDietary.every(d => r.dietaryOptions.includes(d))) return false;
      if (selectedPriceLevels.length > 0 && !selectedPriceLevels.includes(r.priceLevel)) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case "popularity":
        result.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "price-asc":
        result.sort((a, b) => a.priceLevel - b.priceLevel || b.rating - a.rating);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceLevel - a.priceLevel || b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "cs"));
        break;
    }

    return result;
  }, [searchQuery, selectedType, selectedDistrict, showOpenOnly, selectedTags, selectedDietary, selectedPriceLevels, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleDietary = (option: DietaryOption) => {
    setSelectedDietary(prev => prev.includes(option) ? prev.filter(d => d !== option) : [...prev, option]);
  };

  const togglePriceLevel = (level: number) => {
    setSelectedPriceLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedDistrict("Všechny čtvrti");
    setShowOpenOnly(false);
    setSelectedTags([]);
    setSelectedDietary([]);
    setSelectedPriceLevels([]);
  };

  const hasFilters = selectedType !== "all" || selectedDistrict !== "Všechny čtvrti" || showOpenOnly || selectedTags.length > 0 || searchQuery || selectedDietary.length > 0 || selectedPriceLevels.length > 0;

  const activeFilterCount = (selectedType !== "all" ? 1 : 0) + (selectedDistrict !== "Všechny čtvrti" ? 1 : 0) + (showOpenOnly ? 1 : 0) + selectedTags.length + selectedDietary.length + selectedPriceLevels.length;

  const typeOptions: { value: RestaurantType | "all"; label: string; color: string }[] = [
    { value: "all", label: "Vše", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    { value: "vegan", label: "Veganské", color: "bg-emerald-700 text-white hover:bg-emerald-600" },
    { value: "vegetarian", label: "Vegetariánské", color: "bg-emerald-500 text-white hover:bg-emerald-400" },
    { value: "friendly", label: "Vegan-friendly", color: "bg-amber-400 text-amber-900 hover:bg-amber-300" },
  ];

  // Only show dietary options that exist in at least one restaurant
  const availableDietary = useMemo(() => {
    const available = new Set<DietaryOption>();
    restaurants.forEach(r => r.dietaryOptions.forEach(d => available.add(d)));
    return dietaryOptionsConfig.filter(opt => available.has(opt.value));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Veganské a Vegetariánské Restaurace v Praze"
        description="Kompletní přehled veganských, vegetariánských a vegan-friendly restaurací v Praze. Filtrujte podle čtvrti, kuchyně, cenové hladiny a dietních preferencí."
        ogUrl="https://www.bezmasajidla.cz/restaurace"
      />
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
        {/* Search bar + mobile filter toggle */}
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
            className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 md:hidden relative"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtry
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Link href="/mapa">
            <Button variant="outline" className="hidden md:flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <MapPin className="w-4 h-4" />
              Mapa
            </Button>
          </Link>
        </div>

        {/* Active filters bar (shown when filters are applied) */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
                {typeOptions.find(t => t.value === selectedType)?.label}
                <button onClick={() => setSelectedType("all")} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDistrict !== "Všechny čtvrti" && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
                {selectedDistrict}
                <button onClick={() => setSelectedDistrict("Všechny čtvrti")} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedPriceLevels.map(level => (
              <span key={level} className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">
                {priceLevels.find(p => p.value === level)?.label} — {priceLevels.find(p => p.value === level)?.description}
                <button onClick={() => togglePriceLevel(level)} className="hover:text-amber-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedDietary.map(d => {
              const config = dietaryOptionsConfig.find(c => c.value === d);
              return (
                <span key={d} className="inline-flex items-center gap-1 text-xs bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full font-medium">
                  {config?.icon} {config?.label}
                  <button onClick={() => toggleDietary(d)} className="hover:text-teal-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                {tag}
                <button onClick={() => toggleTag(tag)} className="hover:text-gray-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {showOpenOnly && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                Otevřeno
                <button onClick={() => setShowOpenOnly(false)} className="hover:text-green-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium ml-1">
              Vymazat vše
            </button>
          </div>
        )}

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

              {/* ── PRICE LEVEL FILTER ── */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Cenová hladina
                </p>
                <div className="flex flex-col gap-1.5">
                  {priceLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => togglePriceLevel(level.value)}
                      className={`flex items-center gap-2.5 py-2 px-3 rounded-lg border transition-all duration-200 text-left ${
                        selectedPriceLevels.includes(level.value)
                          ? "bg-amber-50 border-amber-400 text-amber-800 shadow-sm"
                          : "bg-white border-emerald-100 text-gray-500 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50"
                      }`}
                      title={level.description}
                    >
                      <span className={`text-sm font-bold whitespace-nowrap ${
                        selectedPriceLevels.includes(level.value) ? "text-amber-600" : "text-gray-400"
                      }`}>
                        {Array.from({ length: level.value }).map((_, i) => (
                          <span key={i} className="inline-block">Kč</span>
                        ))}
                        {Array.from({ length: 3 - level.value }).map((_, i) => (
                          <span key={i} className="inline-block opacity-25">Kč</span>
                        ))}
                      </span>
                      <span className="text-xs">{level.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── DIETARY OPTIONS FILTER ── */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Dietní preference
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {availableDietary.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleDietary(opt.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1 ${
                        selectedDietary.includes(opt.value)
                          ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                          : "bg-white text-gray-600 border-emerald-100 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50"
                      }`}
                    >
                      <span className="text-sm leading-none">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {selectedDietary.length > 0 && (
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    Zobrazeny restaurace se <span className="font-medium">všemi</span> vybranými preferencemi
                  </p>
                )}
              </div>

              {/* District filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Čtvrť</p>
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
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
            {/* Results count + sorting */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Nalezeno <span className="font-semibold text-gray-900">{filtered.length}</span> restaurací
              </p>
              <div className="flex items-center gap-3">
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 md:hidden">
                    <X className="w-3 h-3" /> Vymazat filtry
                  </button>
                )}
                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-700 bg-white border border-emerald-100 rounded-lg px-3 py-1.5 shadow-sm transition-colors"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{sortOptions.find(s => s.value === sortBy)?.label}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {sortDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 bg-white border border-emerald-100 rounded-xl shadow-lg z-20 py-1 w-48">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                            className={`w-full text-left text-sm px-4 py-2 transition-colors ${
                              sortBy === opt.value
                                ? "bg-emerald-50 text-emerald-700 font-medium"
                                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
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
