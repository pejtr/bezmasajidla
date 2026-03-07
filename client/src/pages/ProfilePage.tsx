// ============================================================
// BEZMASAJIDLA.CZ — Profile Page
// "Zelená Metropole" — user profile with saved favorites
// Favorites persisted in localStorage via FavoritesContext
// ============================================================

import { useState } from "react";
import { Link } from "wouter";
import { Heart, Bookmark, MapPin, Star, Clock, Users, Trash2, ChefHat, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { restaurants, recipes, getTypeColor } from "@/lib/data";

type Tab = "restaurants" | "recipes";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("restaurants");
  const {
    favoriteRestaurants,
    favoriteRecipes,
    toggleRestaurant,
    toggleRecipe,
  } = useFavorites();

  const savedRestaurants = restaurants.filter((r) =>
    favoriteRestaurants.includes(r.slug)
  );
  const savedRecipes = recipes.filter((r) =>
    favoriteRecipes.includes(r.slug)
  );

  const totalSaved = favoriteRestaurants.length + favoriteRecipes.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      {/* Profile hero */}
      <div className="bg-emerald-800 pt-10 pb-0">
        <div className="container">
          <div className="flex items-end gap-5 pb-0">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 border-4 border-emerald-700 flex items-center justify-center shadow-lg flex-shrink-0 mb-4">
              <span className="text-3xl">🌿</span>
            </div>
            <div className="pb-4">
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Můj profil
              </h1>
              <p className="text-emerald-300 text-sm mt-0.5">
                {totalSaved} uložených položek
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setActiveTab("restaurants")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-colors ${
                activeTab === "restaurants"
                  ? "bg-[#F8FAF6] text-emerald-800"
                  : "text-emerald-300 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              Restaurace
              {favoriteRestaurants.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "restaurants"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-600 text-emerald-100"
                }`}>
                  {favoriteRestaurants.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("recipes")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-colors ${
                activeTab === "recipes"
                  ? "bg-[#F8FAF6] text-emerald-800"
                  : "text-emerald-300 hover:text-white"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Recepty
              {favoriteRecipes.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "recipes"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-600 text-emerald-100"
                }`}>
                  {favoriteRecipes.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 flex-1">

        {/* === RESTAURANTS TAB === */}
        {activeTab === "restaurants" && (
          <>
            {savedRestaurants.length === 0 ? (
              <EmptyState
                icon={<Heart className="w-10 h-10 text-emerald-300" />}
                title="Žádné oblíbené restaurace"
                description="Přidávej restaurace do oblíbených kliknutím na srdíčko na kartě nebo na stránce restaurace."
                cta={{ label: "Procházet restaurace", href: "/restaurace" }}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Uloženo <span className="font-semibold text-gray-900">{savedRestaurants.length}</span> restaurací
                </p>
                {savedRestaurants.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-emerald-100 overflow-hidden flex group">
                    {/* Image */}
                    <div className="relative w-32 sm:w-40 flex-shrink-0">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-cover min-h-[120px]"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/restaurace/${r.slug}`}>
                            <h3
                              className="font-semibold text-gray-900 text-base leading-tight hover:text-emerald-700 transition-colors truncate"
                              style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                              {r.name}
                            </h3>
                          </Link>
                          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${getTypeColor(r.type)}`}>
                            {r.type === "vegan" ? "Veganská" : r.type === "vegetarian" ? "Vegetariánská" : "Vegan-friendly"}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleRestaurant(r.slug)}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                          title="Odebrat z oblíbených"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-gray-800">{r.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({r.reviewCount})</span>
                        <span className={`text-xs ml-1 ${r.isOpen ? "text-emerald-600" : "text-red-500"}`}>
                          {r.isOpen ? "● Otevřeno" : "● Zavřeno"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1.5">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-gray-500 truncate">{r.address}</span>
                      </div>

                      <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* === RECIPES TAB === */}
        {activeTab === "recipes" && (
          <>
            {savedRecipes.length === 0 ? (
              <EmptyState
                icon={<Bookmark className="w-10 h-10 text-emerald-300" />}
                title="Žádné uložené recepty"
                description="Ukládej recepty kliknutím na záložku na kartě nebo na stránce receptu."
                cta={{ label: "Procházet recepty", href: "/recepty" }}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Uloženo <span className="font-semibold text-gray-900">{savedRecipes.length}</span> receptů
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedRecipes.map((r) => {
                    const totalTime = r.prepTime + r.cookTime;
                    const difficultyColor = {
                      snadný: "bg-emerald-100 text-emerald-700",
                      střední: "bg-amber-100 text-amber-700",
                      náročný: "bg-red-100 text-red-700",
                    }[r.difficulty];

                    return (
                      <div key={r.id} className="bg-white rounded-xl border border-emerald-100 overflow-hidden group">
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={r.image}
                            alt={r.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          {r.isVegan && (
                            <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                              Vegan
                            </span>
                          )}
                          <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor}`}>
                            {r.difficulty}
                          </span>
                          {/* Remove button */}
                          <button
                            onClick={() => toggleRecipe(r.slug)}
                            className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/80 text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors shadow"
                            title="Odebrat z uložených"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Content */}
                        <div className="p-4">
                          <p className="text-xs text-emerald-600 font-medium mb-1">{r.category}</p>
                          <Link href={`/recepty/${r.slug}`}>
                            <h3
                              className="font-semibold text-gray-900 text-base leading-snug mb-2 hover:text-emerald-700 transition-colors"
                              style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                              {r.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{totalTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{r.servings} porce</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ChefHat className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{r.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

// ── Empty state helper ──────────────────────────────────────
function EmptyState({
  icon,
  title,
  description,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center max-w-md mx-auto">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3
        className="text-xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{description}</p>
      <Link href={cta.href}>
        <Button className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
          {cta.label}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
