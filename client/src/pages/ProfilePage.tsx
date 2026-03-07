// ============================================================
// BEZMASAJIDLA.CZ — Profile Page
// "Zelená Metropole" — user profile with favorites, reviews, recipes
// Favorites: localStorage for non-logged-in, DB for logged-in
// Reviews & User Recipes: DB only (requires login)
// ============================================================

import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Heart, Bookmark, MapPin, Star, Clock, Users, Trash2, ChefHat, ArrowRight, BookOpen, LogIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { restaurants, recipes, getTypeColor } from "@/lib/data";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

type Tab = "favorites" | "reviews" | "recipes";

export default function ProfilePage() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tabParam = params.get("tab");

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (tabParam === "reviews") return "reviews";
    if (tabParam === "recipes") return "recipes";
    return "favorites";
  });

  useEffect(() => {
    if (tabParam === "reviews") setActiveTab("reviews");
    else if (tabParam === "recipes") setActiveTab("recipes");
    else if (tabParam === "favorites") setActiveTab("favorites");
  }, [tabParam]);

  const { user, isAuthenticated } = useAuth();
  const {
    favoriteRestaurants,
    favoriteRecipes,
    toggleRestaurant,
    toggleRecipe,
  } = useFavorites();

  // DB-backed queries for logged-in users
  const { data: userReviews = [] } = trpc.reviews.byUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: userRecipesList = [] } = trpc.userRecipes.myRecipes.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteReview = trpc.reviews.delete.useMutation({
    onSuccess: () => {
      utils.reviews.byUser.invalidate();
    },
  });
  const deleteRecipe = trpc.userRecipes.delete.useMutation({
    onSuccess: () => {
      utils.userRecipes.myRecipes.invalidate();
    },
  });
  const utils = trpc.useUtils();

  const savedRestaurants = restaurants.filter((r) =>
    favoriteRestaurants.includes(r.slug)
  );
  const savedRecipes = recipes.filter((r) =>
    favoriteRecipes.includes(r.slug)
  );

  const totalSaved = favoriteRestaurants.length + favoriteRecipes.length;

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      key: "favorites",
      label: "Oblíbené",
      icon: <Heart className="w-4 h-4" />,
      count: totalSaved > 0 ? totalSaved : undefined,
    },
    {
      key: "reviews",
      label: "Recenze",
      icon: <Star className="w-4 h-4" />,
      count: userReviews.length > 0 ? userReviews.length : undefined,
    },
    {
      key: "recipes",
      label: "Recepty",
      icon: <ChefHat className="w-4 h-4" />,
      count: userRecipesList.length > 0 ? userRecipesList.length : undefined,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      {/* Profile hero */}
      <div className="bg-emerald-800 pt-10 pb-0">
        <div className="container">
          <div className="flex items-end gap-5 pb-0">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 border-4 border-emerald-700 flex items-center justify-center shadow-lg flex-shrink-0 mb-4">
              {isAuthenticated && user?.name ? (
                <span className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="text-3xl">🌿</span>
              )}
            </div>
            <div className="pb-4">
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {isAuthenticated && user?.name ? user.name : "Můj profil"}
              </h1>
              <p className="text-emerald-300 text-sm mt-0.5">
                {isAuthenticated
                  ? `${totalSaved} oblíbených · ${userReviews.length} recenzí · ${userRecipesList.length} receptů`
                  : `${totalSaved} uložených položek`
                }
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-[#F8FAF6] text-emerald-800"
                    : "text-emerald-300 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.key
                      ? "bg-emerald-700 text-white"
                      : "bg-emerald-600 text-emerald-100"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 flex-1">

        {/* === FAVORITES TAB === */}
        {activeTab === "favorites" && (
          <>
            {totalSaved === 0 ? (
              <EmptyState
                icon={<Heart className="w-10 h-10 text-emerald-300" />}
                title="Žádné oblíbené"
                description="Přidávej restaurace a recepty do oblíbených kliknutím na srdíčko."
                cta={{ label: "Procházet restaurace", href: "/restaurace" }}
              />
            ) : (
              <div className="space-y-8">
                {/* Saved restaurants */}
                {savedRestaurants.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      <Heart className="w-5 h-5 text-red-400" />
                      Oblíbené restaurace ({savedRestaurants.length})
                    </h3>
                    <div className="space-y-3">
                      {savedRestaurants.map((r) => (
                        <div key={r.id} className="bg-white rounded-xl border border-emerald-100 overflow-hidden flex group">
                          <div className="relative w-32 sm:w-40 flex-shrink-0">
                            <img src={r.image} alt={r.name} className="w-full h-full object-cover min-h-[120px]" />
                          </div>
                          <div className="flex-1 p-4 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link href={`/restaurace/${r.slug}`}>
                                  <h3 className="font-semibold text-gray-900 text-base leading-tight hover:text-emerald-700 transition-colors truncate" style={{ fontFamily: "'DM Serif Display', serif" }}>
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
                            </div>
                            <div className="flex items-center gap-1 mt-1.5">
                              <MapPin className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs text-gray-500 truncate">{r.address}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved recipes */}
                {savedRecipes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      <Bookmark className="w-5 h-5 text-amber-500" />
                      Uložené recepty ({savedRecipes.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {savedRecipes.map((r) => {
                        const totalTime = r.prepTime + r.cookTime;
                        return (
                          <div key={r.id} className="bg-white rounded-xl border border-emerald-100 overflow-hidden group">
                            <div className="relative h-44 overflow-hidden">
                              <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              {r.isVegan && (
                                <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Vegan</span>
                              )}
                              <button
                                onClick={() => toggleRecipe(r.slug)}
                                className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/80 text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors shadow"
                                title="Odebrat z uložených"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="p-4">
                              <p className="text-xs text-emerald-600 font-medium mb-1">{r.category}</p>
                              <Link href={`/recepty/${r.slug}`}>
                                <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 hover:text-emerald-700 transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
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
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* === REVIEWS TAB === */}
        {activeTab === "reviews" && (
          <>
            {!isAuthenticated ? (
              <LoginPrompt message="Pro zobrazení vašich recenzí se prosím přihlaste." />
            ) : userReviews.length === 0 ? (
              <EmptyState
                icon={<Star className="w-10 h-10 text-amber-300" />}
                title="Žádné recenze"
                description="Zatím jste nenapsali žádnou recenzi. Navštivte stránku restaurace a podělte se o svůj zážitek."
                cta={{ label: "Procházet restaurace", href: "/restaurace" }}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Napsáno <span className="font-semibold text-gray-900">{userReviews.length}</span> recenzí
                </p>
                {userReviews.map((review) => {
                  const restaurant = restaurants.find((r) => r.slug === review.restaurantSlug);
                  return (
                    <div key={review.id} className="bg-white rounded-xl border border-emerald-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          {restaurant ? (
                            <Link href={`/restaurace/${restaurant.slug}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-emerald-700 transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                {restaurant.name}
                              </h3>
                            </Link>
                          ) : (
                            <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                              {review.restaurantSlug}
                            </h3>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString("cs-CZ", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200 fill-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => deleteReview.mutate({ reviewId: review.id })}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                            title="Smazat recenzi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* === USER RECIPES TAB === */}
        {activeTab === "recipes" && (
          <>
            {!isAuthenticated ? (
              <LoginPrompt message="Pro zobrazení vašich receptů se prosím přihlaste." />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-500">
                    {userRecipesList.length > 0
                      ? <>Vytvořeno <span className="font-semibold text-gray-900">{userRecipesList.length}</span> receptů</>
                      : "Zatím žádné recepty"
                    }
                  </p>
                  <Link href="/pridat-recept">
                    <Button className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
                      <BookOpen className="w-4 h-4" />
                      Přidat recept
                    </Button>
                  </Link>
                </div>

                {userRecipesList.length === 0 ? (
                  <EmptyState
                    icon={<ChefHat className="w-10 h-10 text-emerald-300" />}
                    title="Žádné recepty"
                    description="Sdílejte své oblíbené bezmasé recepty s komunitou."
                    cta={{ label: "Přidat recept", href: "/pridat-recept" }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {userRecipesList.map((recipe) => (
                      <div key={recipe.id} className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
                        {recipe.image && (
                          <div className="relative h-40 overflow-hidden">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              {recipe.category && (
                                <p className="text-xs text-emerald-600 font-medium mb-1">{recipe.category}</p>
                              )}
                              <h3 className="font-semibold text-gray-900 text-base leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                {recipe.title}
                              </h3>
                            </div>
                            <button
                              onClick={() => deleteRecipe.mutate({ recipeId: recipe.id })}
                              className="flex-shrink-0 w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                              title="Smazat recept"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {recipe.description && (
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{recipe.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            {recipe.prepTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{recipe.prepTime}</span>
                              </div>
                            )}
                            {recipe.servings && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                <span>{recipe.servings} porcí</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              recipe.isApproved
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {recipe.isApproved ? "Schváleno" : "Čeká na schválení"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

// ── Login prompt for non-authenticated users ──────────────────
function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <LogIn className="w-10 h-10 text-emerald-300" />
      </div>
      <h3
        className="text-xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Přihlaste se
      </h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
      <a href={getLoginUrl()}>
        <Button className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
          <LogIn className="w-4 h-4" />
          Přihlásit se
        </Button>
      </a>
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
