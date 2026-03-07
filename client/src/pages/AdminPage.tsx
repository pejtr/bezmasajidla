// ============================================================
// BEZMASAJIDLA.CZ — Admin Panel
// Recipe approval + review management
// ============================================================

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import {
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  Clock,
  ChefHat,
  MessageSquare,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { restaurants } from "@/lib/data";

type Tab = "recipes" | "reviews";

export default function AdminPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("recipes");
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md px-4">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Administrace
            </h1>
            <p className="text-gray-500 mb-6">
              Pro přístup do administrace se musíte přihlásit.
            </p>
            <a href={getLoginUrl()}>
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white">
                Přihlásit se
              </Button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md px-4">
            <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h1
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Přístup zamítnut
            </h1>
            <p className="text-gray-500 mb-6">
              Nemáte oprávnění pro přístup do administrace. Tato sekce je dostupná pouze pro administrátory.
            </p>
            <Link href="/">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white">
                Zpět na hlavní stránku
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-7 h-7 text-emerald-700" />
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Administrace
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "recipes" ? "default" : "outline"}
            onClick={() => setActiveTab("recipes")}
            className={
              activeTab === "recipes"
                ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }
          >
            <ChefHat className="w-4 h-4 mr-2" />
            Recepty ke schválení
          </Button>
          <Button
            variant={activeTab === "reviews" ? "default" : "outline"}
            onClick={() => setActiveTab("reviews")}
            className={
              activeTab === "reviews"
                ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Správa recenzí
          </Button>
        </div>

        {/* Content */}
        {activeTab === "recipes" ? <RecipeApproval /> : <ReviewManagement />}
      </div>

      <Footer />
    </div>
  );
}

function RecipeApproval() {
  const { data: recipes, isLoading, refetch } = trpc.admin.allRecipes.useQuery();
  const approveMut = trpc.admin.approveRecipe.useMutation({
    onSuccess: () => {
      toast.success("Recept schválen");
      refetch();
    },
    onError: () => toast.error("Chyba při schvalování"),
  });
  const rejectMut = trpc.admin.rejectRecipe.useMutation({
    onSuccess: () => {
      toast.success("Recept zamítnut a smazán");
      refetch();
    },
    onError: () => toast.error("Chyba při zamítání"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  const pending = recipes?.filter((r) => !r.isApproved) ?? [];
  const approved = recipes?.filter((r) => r.isApproved) ?? [];

  return (
    <div className="space-y-8">
      {/* Pending recipes */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          Čekající na schválení ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <Card className="border-emerald-100">
            <CardContent className="py-8 text-center text-gray-500">
              Žádné recepty nečekají na schválení.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((recipe) => (
              <Card key={recipe.id} className="border-amber-200 bg-amber-50/50">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Autor: {recipe.authorName ?? "Neznámý"} | Kategorie:{" "}
                        {recipe.category ?? "—"} | Obtížnost:{" "}
                        {recipe.difficulty ?? "—"}
                      </p>
                      {recipe.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {recipe.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Přidáno:{" "}
                        {new Date(recipe.createdAt).toLocaleDateString("cs-CZ")}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        onClick={() =>
                          approveMut.mutate({ recipeId: recipe.id })
                        }
                        disabled={approveMut.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Schválit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() =>
                          rejectMut.mutate({ recipeId: recipe.id })
                        }
                        disabled={rejectMut.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Zamítnout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Approved recipes */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          Schválené recepty ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <Card className="border-emerald-100">
            <CardContent className="py-8 text-center text-gray-500">
              Zatím žádné schválené recepty.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {approved.map((recipe) => (
              <Card key={recipe.id} className="border-emerald-100">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Autor: {recipe.authorName ?? "Neznámý"} | Schváleno
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0"
                      onClick={() =>
                        rejectMut.mutate({ recipeId: recipe.id })
                      }
                      disabled={rejectMut.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Smazat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewManagement() {
  const { data: allReviews, isLoading, refetch } = trpc.admin.allReviews.useQuery();
  const deleteMut = trpc.admin.deleteReview.useMutation({
    onSuccess: () => {
      toast.success("Recenze smazána");
      refetch();
    },
    onError: () => toast.error("Chyba při mazání recenze"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!allReviews || allReviews.length === 0) {
    return (
      <Card className="border-emerald-100">
        <CardContent className="py-8 text-center text-gray-500">
          Zatím žádné recenze.
        </CardContent>
      </Card>
    );
  }

  // Find restaurant name by slug
  const getRestaurantName = (slug: string) => {
    const r = restaurants.find((rest) => rest.slug === slug);
    return r?.name ?? slug;
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        Všechny recenze ({allReviews.length})
      </h2>
      <div className="space-y-3">
        {allReviews.map((review) => (
          <Card key={review.id} className="border-gray-200">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {review.userName ?? "Anonym"}
                    </span>
                    <span className="text-gray-300">|</span>
                    <Link
                      href={`/restaurace/${review.restaurantSlug}`}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      {getRestaurantName(review.restaurantSlug)}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(review.createdAt).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0"
                  onClick={() => deleteMut.mutate({ reviewId: review.id })}
                  disabled={deleteMut.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Smazat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
