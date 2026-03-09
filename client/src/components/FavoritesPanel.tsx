// ============================================================
// BEZMASAJIDLA.CZ — FavoritesPanel
// Slide-in panel showing saved restaurants and recipes
// ============================================================

import { X, Heart, Utensils, BookOpen, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useFavorites } from "@/contexts/FavoritesContext";
import { restaurants, recipes } from "@/lib/data";

interface FavoritesPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function FavoritesPanel({ open, onClose }: FavoritesPanelProps) {
  const { favoriteRestaurants, favoriteRecipes, toggleRestaurant, toggleRecipe } = useFavorites();

  const savedRestaurants = restaurants.filter((r) => favoriteRestaurants.includes(r.slug));
  const savedRecipes = recipes.filter((r) => favoriteRecipes.includes(r.slug));
  const total = savedRestaurants.length + savedRecipes.length;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Oblíbené
            </h3>
            {total > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {total}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {total === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
              <Heart className="w-16 h-16 text-emerald-100 mb-4" />
              <p className="text-gray-500 font-medium mb-1">Zatím žádné oblíbené</p>
              <p className="text-gray-400 text-sm">
                Klikni na srdíčko u restaurace nebo receptu a uloží se sem.
              </p>
              <Link
                href="/restaurace"
                onClick={onClose}
                className="mt-6 text-sm text-emerald-700 font-medium hover:underline"
              >
                Procházet restaurace →
              </Link>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-6">
              {/* Saved Restaurants */}
              {savedRestaurants.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Restaurace ({savedRestaurants.length})
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {savedRestaurants.map((r) => (
                      <li key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 group transition-colors">
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/restaurace/${r.slug}`}
                            onClick={onClose}
                            className="text-sm font-medium text-gray-900 hover:text-emerald-700 transition-colors block truncate"
                          >
                            {r.name}
                          </Link>
                          <p className="text-xs text-gray-400 truncate">{r.district} · {r.type === "vegan" ? "Veganská" : r.type === "vegetarian" ? "Vegetariánská" : "Vegan-friendly"}</p>
                        </div>
                        <button
                          onClick={() => toggleRestaurant(r.slug)}
                          className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                          title="Odebrat z oblíbených"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Saved Recipes */}
              {savedRecipes.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Recepty ({savedRecipes.length})
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {savedRecipes.map((r) => (
                      <li key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-amber-50 group transition-colors">
                        <img
                          src={r.image}
                          alt={r.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/recepty/${r.slug}`}
                            onClick={onClose}
                            className="text-sm font-medium text-gray-900 hover:text-amber-700 transition-colors block truncate"
                          >
                            {r.title}
                          </Link>
                          <p className="text-xs text-gray-400 truncate">{r.category} · {r.prepTime}</p>
                        </div>
                        <button
                          onClick={() => toggleRecipe(r.slug)}
                          className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                          title="Odebrat z oblíbených"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {total > 0 && (
          <div className="border-t border-emerald-100 px-5 py-3">
            <Link
              href="/profil?tab=favorites"
              onClick={onClose}
              className="block text-center text-sm text-emerald-700 font-medium hover:underline"
            >
              Zobrazit vše v profilu →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
