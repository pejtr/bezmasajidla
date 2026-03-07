// ============================================================
// BEZMASAJIDLA.CZ — FavoritesContext
// Persists favorite restaurants & recipes in localStorage
// ============================================================

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritesContextType {
  favoriteRestaurants: string[];
  favoriteRecipes: string[];
  toggleRestaurant: (slug: string) => void;
  toggleRecipe: (slug: string) => void;
  isRestaurantFavorite: (slug: string) => boolean;
  isRecipeFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY_RESTAURANTS = "bj_fav_restaurants";
const STORAGE_KEY_RECIPES = "bj_fav_recipes";

function loadFromStorage(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEY_RESTAURANTS)
  );
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEY_RECIPES)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESTAURANTS, JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  const toggleRestaurant = (slug: string) => {
    setFavoriteRestaurants((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleRecipe = (slug: string) => {
    setFavoriteRecipes((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isRestaurantFavorite = (slug: string) => favoriteRestaurants.includes(slug);
  const isRecipeFavorite = (slug: string) => favoriteRecipes.includes(slug);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurants,
        favoriteRecipes,
        toggleRestaurant,
        toggleRecipe,
        isRestaurantFavorite,
        isRecipeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
