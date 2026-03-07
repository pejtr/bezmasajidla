// ============================================================
// BEZMASAJIDLA.CZ — FavoritesContext
// localStorage for guests, synced with DB for logged-in users
// On login: merges localStorage + DB → updates both sides
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface FavoritesContextType {
  favoriteRestaurants: string[];
  favoriteRecipes: string[];
  toggleRestaurant: (slug: string) => void;
  toggleRecipe: (slug: string) => void;
  isRestaurantFavorite: (slug: string) => boolean;
  isRecipeFavorite: (slug: string) => boolean;
  syncing: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY_RESTAURANTS = "bj_fav_restaurants";
const STORAGE_KEY_RECIPES = "bj_fav_recipes";
const SYNC_DONE_KEY = "bj_fav_synced";

function loadFromStorage(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(key: string, data: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEY_RESTAURANTS)
  );
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEY_RECIPES)
  );
  const [syncing, setSyncing] = useState(false);
  const hasSynced = useRef(false);

  const utils = trpc.useUtils();

  // Sync mutation
  const syncMutation = trpc.favorites.sync.useMutation({
    onSuccess: (merged) => {
      setFavoriteRestaurants(merged.restaurants);
      setFavoriteRecipes(merged.recipes);
      saveToStorage(STORAGE_KEY_RESTAURANTS, merged.restaurants);
      saveToStorage(STORAGE_KEY_RECIPES, merged.recipes);
      localStorage.setItem(SYNC_DONE_KEY, "true");
      setSyncing(false);
    },
    onError: () => {
      setSyncing(false);
    },
  });

  // Toggle mutation (for logged-in users, also updates DB)
  const toggleMutation = trpc.favorites.toggle.useMutation();

  // Persist to localStorage on change
  useEffect(() => {
    saveToStorage(STORAGE_KEY_RESTAURANTS, favoriteRestaurants);
  }, [favoriteRestaurants]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_RECIPES, favoriteRecipes);
  }, [favoriteRecipes]);

  // Sync on login: merge localStorage favorites with DB
  useEffect(() => {
    if (authLoading || !isAuthenticated || !user || hasSynced.current) return;
    hasSynced.current = true;

    const localR = loadFromStorage(STORAGE_KEY_RESTAURANTS);
    const localRec = loadFromStorage(STORAGE_KEY_RECIPES);

    setSyncing(true);
    syncMutation.mutate({
      localRestaurants: localR,
      localRecipes: localRec,
    });
  }, [authLoading, isAuthenticated, user]);

  // Reset sync flag on logout
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      hasSynced.current = false;
      localStorage.removeItem(SYNC_DONE_KEY);
    }
  }, [authLoading, isAuthenticated]);

  const toggleRestaurant = useCallback((slug: string) => {
    setFavoriteRestaurants((prev) => {
      const isFav = prev.includes(slug);
      const next = isFav ? prev.filter((s) => s !== slug) : [...prev, slug];

      // If logged in, also update DB
      if (isAuthenticated) {
        toggleMutation.mutate({ itemType: "restaurant", itemSlug: slug });
      }

      return next;
    });
  }, [isAuthenticated, toggleMutation]);

  const toggleRecipe = useCallback((slug: string) => {
    setFavoriteRecipes((prev) => {
      const isFav = prev.includes(slug);
      const next = isFav ? prev.filter((s) => s !== slug) : [...prev, slug];

      // If logged in, also update DB
      if (isAuthenticated) {
        toggleMutation.mutate({ itemType: "recipe", itemSlug: slug });
      }

      return next;
    });
  }, [isAuthenticated, toggleMutation]);

  const isRestaurantFavorite = useCallback(
    (slug: string) => favoriteRestaurants.includes(slug),
    [favoriteRestaurants]
  );

  const isRecipeFavorite = useCallback(
    (slug: string) => favoriteRecipes.includes(slug),
    [favoriteRecipes]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurants,
        favoriteRecipes,
        toggleRestaurant,
        toggleRecipe,
        isRestaurantFavorite,
        isRecipeFavorite,
        syncing,
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
