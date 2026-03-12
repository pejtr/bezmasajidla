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
  Instagram,
  Calendar,
  Copy,
  ExternalLink,
  TrendingUp,
  Hash,
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { restaurants } from "@/lib/data";

type Tab = "recipes" | "reviews" | "instagram";

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
          <Button
            variant={activeTab === "instagram" ? "default" : "outline"}
            onClick={() => setActiveTab("instagram")}
            className={
              activeTab === "instagram"
                ? "bg-pink-600 hover:bg-pink-500 text-white"
                : "border-pink-200 text-pink-700 hover:bg-pink-50"
            }
          >
            <Instagram className="w-4 h-4 mr-2" />
            Instagram Kalendář
          </Button>
        </div>

        {/* Content */}
        {activeTab === "recipes" && <RecipeApproval />}
        {activeTab === "reviews" && <ReviewManagement />}
        {activeTab === "instagram" && <InstagramCalendar />}
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

// ============================================================
// INSTAGRAM CALENDAR COMPONENT
// 30-day content plan with viral hooks, hashtags, and web links
// ============================================================

type PostType = "post" | "story" | "reel" | "poll";

interface ContentPost {
  day: number;
  date: string;
  type: PostType;
  theme: string;
  hook: string;
  caption: string;
  hashtags: string[];
  link: string;
  linkLabel: string;
  emoji: string;
  isViral?: boolean;
}

const CONTENT_CALENDAR: ContentPost[] = [
  {
    day: 1, date: "St 13.3.", type: "poll", theme: "Fast Food Anketa",
    hook: "Který fast food má nejlepší vege burger?",
    caption: "🍔 Velká anketa! Zkoušeli jste vege burgery ve fast foodech? Hlasujte a my vám ukážeme, kde v Praze najdete ty nejlepší! 👇\n\n👉 Výsledky + tipy na bezmasé fast food restaurace na webu!",
    hashtags: ["#veganpraha", "#vegetarianpraha", "#fastfoodvegan", "#bezmasajidla", "#veganfood", "#plantbased", "#pragueveganfood", "#veganburgr"],
    link: "/restaurace?type=fastfood", linkLabel: "Fast food restaurace", emoji: "🍔", isViral: true,
  },
  {
    day: 2, date: "Čt 14.3.", type: "story", theme: "Recept dne",
    hook: "Veganský pad thai za 20 minut 🍜",
    caption: "🍜 Recept dne: Veganský pad thai s tofu a arašídy! Rychlý, levný a absolutně návykový. Celý recept na webu — odkaz v biu!",
    hashtags: ["#veganrecept", "#padthai", "#veganfood", "#bezmasajidla", "#veganczech", "#recepty", "#quickvegan", "#tofu"],
    link: "/recepty/vegansky-pad-thai", linkLabel: "Recept: Pad Thai", emoji: "🍜",
  },
  {
    day: 3, date: "Pá 15.3.", type: "post", theme: "Restaurace týdne",
    hook: "Nejlepší veganská restaurace v Praze? Tohle musíte vyzkoušet 🌿",
    caption: "🌿 Restaurace týdne: Maitrea! Uklidňující atmosféra, skvělé jídlo, 100% vegetariánské menu. Ideální na romantickou večeři nebo oběd s přáteli.\n\n⭐ Hodnocení, menu a rezervace na bezmasajidla.cz!",
    hashtags: ["#maitrea", "#veganpraha", "#vegetarianpraha", "#bezmasajidla", "#praguerestaurant", "#veganrestaurant", "#plantbased", "#praguefood"],
    link: "/restaurace/maitrea", linkLabel: "Maitrea — detail", emoji: "🌿",
  },
  {
    day: 4, date: "So 16.3.", type: "poll", theme: "Fast Food Anketa 2",
    hook: "Jíš vege i ve fast foodu?",
    caption: "🗳️ Anketa: Jíš vege i ve fast foodu? Nebo si fast food úplně vyhýbáš? Zajímá nás váš názor! 👇\n\n📊 Výsledky ankety sdílíme v pondělí!",
    hashtags: ["#vegananketa", "#veganpraha", "#fastfood", "#bezmasajidla", "#plantbased", "#veganlife", "#vegetarian", "#veganczech"],
    link: "/restaurace?type=fastfood", linkLabel: "Fast food tipy", emoji: "🗳️", isViral: true,
  },
  {
    day: 5, date: "Ne 17.3.", type: "reel", theme: "Recept video",
    hook: "Domácí vegetariánská pizza za 30 minut 🍕",
    caption: "🍕 Domácí pizza lepší než z pizzerie! Vegetariánská, sytá a připravená za 30 minut. Celý recept + tipy na nejlepší vegánské pizzerie v Praze na webu!",
    hashtags: ["#veganpizza", "#vegetarianskarecepty", "#bezmasajidla", "#veganfood", "#homemade", "#pizzarecept", "#veganczech", "#plantbasedpizza"],
    link: "/recepty/domaci-vegetarianska-pizza", linkLabel: "Recept: Pizza", emoji: "🍕",
  },
  {
    day: 6, date: "Po 18.3.", type: "story", theme: "Výsledky ankety",
    hook: "Výsledky ankety: Kde jíte vege fast food? 📊",
    caption: "📊 Výsledky jsou tady! Sdílíme výsledky naší ankety o vege fast foodu. A tady jsou naše tipy na nejlepší bezmasé fast food v Praze!",
    hashtags: ["#veganpraha", "#fastfoodvegan", "#bezmasajidla", "#veganlife", "#plantbased"],
    link: "/restaurace?type=fastfood", linkLabel: "Fast food tipy", emoji: "📊",
  },
  {
    day: 7, date: "Út 19.3.", type: "post", theme: "Romantická restaurace",
    hook: "Plánujete rande? Tato restaurace vás nezklame 💚",
    caption: "💚 Lehká Hlava — nejromantičtější vegetariánská restaurace v Praze! Skrytá ve středu města, s úžasnou atmosférou a kreativním menu.\n\n🌹 Ideální na rande nebo výjimečnou večeři. Rezervace a menu na bezmasajidla.cz!",
    hashtags: ["#lehkahlava", "#veganpraha", "#romantickavecere", "#bezmasajidla", "#vegetarianpraha", "#praguedining", "#vegandate", "#plantbased"],
    link: "/restaurace/lehka-hlava", linkLabel: "Lehká Hlava — detail", emoji: "💚",
  },
  {
    day: 8, date: "St 20.3.", type: "poll", theme: "Kuchyně světa",
    hook: "Která světová kuchyně je nejlepší pro vegany?",
    caption: "🌍 Velká anketa! Která světová kuchyně je podle vás nejlepší pro vegany a vegetariány? Indická, thajská, italská nebo mexická? 👇",
    hashtags: ["#veganworld", "#veganfood", "#bezmasajidla", "#veganpraha", "#plantbased", "#worldcuisine", "#veganczech", "#veganlife"],
    link: "/recepty", linkLabel: "Recepty světové kuchyně", emoji: "🌍", isViral: true,
  },
  {
    day: 9, date: "Čt 21.3.", type: "story", theme: "Recept dne",
    hook: "Veganský guláš s knedlíky? Ano, existuje! 🥘",
    caption: "🥘 Česká klasika bez masa! Veganský guláš s houbami a knedlíky — recept, který přesvědčí i masožravce. Celý recept na webu!",
    hashtags: ["#veganrecept", "#vegangulas", "#ceskakultura", "#bezmasajidla", "#veganczech", "#plantbased", "#knedliky", "#veganfood"],
    link: "/recepty/vegansky-gulas-knedliky", linkLabel: "Recept: Guláš", emoji: "🥘",
  },
  {
    day: 10, date: "Pá 22.3.", type: "post", theme: "Top 5 levné obědy",
    hook: "5 míst v Praze kde se najíte vege za méně než 200 Kč 💰",
    caption: "💰 Zdravé a levné jídlo v Praze? Jde to! Vybrali jsme 5 nejlepších míst kde se najíte vegetariánsky za méně než 200 Kč.\n\n📍 Celý seznam + mapa na bezmasajidla.cz!",
    hashtags: ["#levneobedjpraha", "#veganpraha", "#bezmasajidla", "#budgetfood", "#vegetarianpraha", "#levnevege", "#praguefood", "#plantbased"],
    link: "/restaurace?bestFor=Levné+jídlo", linkLabel: "Levné restaurace", emoji: "💰", isViral: true,
  },
  {
    day: 11, date: "So 23.3.", type: "reel", theme: "Brunch tipy",
    hook: "Nejlepší vegan brunch v Praze — kde jít v neděli ráno ☕",
    caption: "☕ Neděle = brunch! Ukázali jsme vám 5 nejlepších míst pro veganský brunch v Praze. Vejce Benedict z tofu, smoothie bowls a pancakes!\n\n🗺️ Mapa a hodnocení na bezmasajidla.cz!",
    hashtags: ["#veganbrunch", "#brunchpraha", "#bezmasajidla", "#veganpraha", "#brunch", "#veganbreakfast", "#praguecafe", "#plantbased"],
    link: "/restaurace?bestFor=Brunch", linkLabel: "Brunch restaurace", emoji: "☕",
  },
  {
    day: 12, date: "Ne 24.3.", type: "story", theme: "Recept dne",
    hook: "Buddha bowl — zdravý oběd za 15 minut 🥗",
    caption: "🥗 Recept dne: Buddha bowl s pečenou zeleninou! Barevný, sytý a plný vitamínů. Celý recept na webu!",
    hashtags: ["#buddhabowl", "#veganrecept", "#bezmasajidla", "#healthyfood", "#veganfood", "#plantbased", "#veganczech", "#bowl"],
    link: "/recepty/buddha-bowl-pecena-zelenina", linkLabel: "Recept: Buddha bowl", emoji: "🥗",
  },
  {
    day: 13, date: "Po 25.3.", type: "post", theme: "Bezlepkové restaurace",
    hook: "Bezlepkové A veganské? Tato místa v Praze to zvládají 🌾",
    caption: "🌾 Bezlepkové a veganské — kombinace, která v Praze existuje! Vybrali jsme nejlepší restaurace pro bezlepkáře a vegany.\n\n📍 Kompletní průvodce na bezmasajidla.cz!",
    hashtags: ["#bezlepkove", "#glutenfree", "#veganpraha", "#bezmasajidla", "#glutenfreevegan", "#celiac", "#veganglutenfree", "#praguefood"],
    link: "/blog/bezlepkove-veganske-restaurace-praha", linkLabel: "Blog: Bezlepkové restaurace", emoji: "🌾",
  },
  {
    day: 14, date: "Út 26.3.", type: "poll", theme: "Oblíbené jídlo",
    hook: "Jaké je vaše oblíbené veganské jídlo?",
    caption: "🌱 Velká anketa! Jaké je vaše nejoblíbenější veganské jídlo? Hlasujte a inspirujte ostatní! 👇\n\n💡 Recepty na všechna tato jídla najdete na bezmasajidla.cz!",
    hashtags: ["#veganfood", "#veganrecept", "#bezmasajidla", "#veganpraha", "#plantbased", "#veganlife", "#veganczech", "#oblibenevedlo"],
    link: "/recepty", linkLabel: "Všechny recepty", emoji: "🌱", isViral: true,
  },
  {
    day: 15, date: "St 27.3.", type: "post", theme: "Nová restaurace spotlight",
    hook: "Tahle restaurace v Praze servíruje nejlepší indické jídlo bez masa 🍛",
    caption: "🍛 Beas Dhaba — autentická indická kuchyně, 100% vegetariánská! Dhal, curry, samosa... vše čerstvé a za skvělou cenu.\n\n⭐ Hodnocení a menu na bezmasajidla.cz!",
    hashtags: ["#beasdhaba", "#indianfood", "#veganpraha", "#bezmasajidla", "#vegetarianpraha", "#indianvegan", "#praguefood", "#plantbased"],
    link: "/restaurace/beas-dhaba-vladislavova", linkLabel: "Beas Dhaba — detail", emoji: "🍛",
  },
  {
    day: 16, date: "Čt 28.3.", type: "story", theme: "Recept dne",
    hook: "Čočková polévka s uzenou paprikou — comfort food 🍲",
    caption: "🍲 Recept dne: Čočková polévka s uzenou paprikou! Zahřeje, zasytí a je hotová za 25 minut. Celý recept na webu!",
    hashtags: ["#coczkovapolevka", "#veganrecept", "#bezmasajidla", "#comfortfood", "#veganczech", "#polevka", "#plantbased", "#veganfood"],
    link: "/recepty/cockov%C3%A1-polevka-uzena-paprika", linkLabel: "Recept: Čočková polévka", emoji: "🍲",
  },
  {
    day: 17, date: "Pá 29.3.", type: "reel", theme: "Top 10 restaurací",
    hook: "Top 10 veganských restaurací v Praze 2026 — kompletní průvodce 🏆",
    caption: "🏆 Sestavili jsme TOP 10 veganských restaurací v Praze pro rok 2026! Od romantických podniků po levné obědy — máme vše.\n\n📖 Celý článek na bezmasajidla.cz!",
    hashtags: ["#top10vegan", "#veganpraha", "#bezmasajidla", "#veganrestaurant", "#prague2026", "#plantbased", "#praguevegan", "#veganlife"],
    link: "/blog/top-10-veganskych-restauraci-praha-2026", linkLabel: "Blog: Top 10", emoji: "🏆", isViral: true,
  },
  {
    day: 18, date: "So 30.3.", type: "poll", theme: "Víkendový brunch",
    hook: "Kde trávíte víkendový brunch v Praze?",
    caption: "☀️ Víkend = brunch! Kde vy trávíte neděle? Hlasujte a sdílejte svá oblíbená místa v komentářích! 👇",
    hashtags: ["#brunchpraha", "#veganbrunch", "#bezmasajidla", "#weekend", "#praguecafe", "#veganpraha", "#sundaybrunch", "#plantbased"],
    link: "/restaurace?bestFor=Brunch", linkLabel: "Brunch tipy", emoji: "☀️",
  },
  {
    day: 19, date: "Ne 31.3.", type: "story", theme: "Recept dne",
    hook: "Houbové risotto — italská klasika bez masa 🍄",
    caption: "🍄 Recept dne: Houbové risotto! Krémové, voňavé a absolutně dokonalé. Celý recept na webu!",
    hashtags: ["#risotto", "#veganrecept", "#bezmasajidla", "#italianfood", "#veganfood", "#mushrooms", "#plantbased", "#veganczech"],
    link: "/recepty/houbove-risotto", linkLabel: "Recept: Risotto", emoji: "🍄",
  },
  {
    day: 20, date: "Po 1.4.", type: "post", theme: "Rodinné restaurace",
    hook: "S dětmi do veganské restaurace? Tato místa je milují 👨‍👩‍👧",
    caption: "👨‍👩‍👧 Veganské restaurace pro celou rodinu! Vybrali jsme místa, kde se cítí dobře i ti nejmenší — dětská menu, hračky a přátelský personál.\n\n📍 Kompletní seznam na bezmasajidla.cz!",
    hashtags: ["#veganrodina", "#veganpraha", "#bezmasajidla", "#familyfriendly", "#veganforkids", "#vegetarianpraha", "#praguefamily", "#plantbased"],
    link: "/blog/veganske-restaurace-pro-deti-praha", linkLabel: "Blog: Restaurace pro děti", emoji: "👨‍👩‍👧",
  },
  {
    day: 21, date: "Út 2.4.", type: "poll", theme: "Sezónní jídla",
    hook: "Jaké sezónní jídlo milujete nejvíce?",
    caption: "🌸 Jaro je tady! Jaké sezónní jídlo milujete nejvíce? Chřest, špenát, ředkvičky nebo jahody? Hlasujte! 👇",
    hashtags: ["#sezonnijedla", "#veganspring", "#bezmasajidla", "#veganfood", "#seasonal", "#veganczech", "#plantbased", "#spring"],
    link: "/recepty", linkLabel: "Jarní recepty", emoji: "🌸", isViral: true,
  },
  {
    day: 22, date: "St 3.4.", type: "post", theme: "Pracovní oběd",
    hook: "5 nejlepších míst na pracovní oběd v centru Prahy 💼",
    caption: "💼 Pracovní oběd v Praze nemusí být nudný! Vybrali jsme 5 nejlepších vegetariánských restaurací v centru — rychlé, chutné a za rozumnou cenu.\n\n📍 Mapa a hodnocení na bezmasajidla.cz!",
    hashtags: ["#pracovniobed", "#veganpraha", "#bezmasajidla", "#businesslunch", "#vegetarianpraha", "#praguefood", "#lunchprague", "#plantbased"],
    link: "/restaurace?bestFor=Pracovn%C3%AD+ob%C4%9Bd", linkLabel: "Pracovní oběd tipy", emoji: "💼",
  },
  {
    day: 23, date: "Čt 4.4.", type: "story", theme: "Recept dne",
    hook: "Veganská svíčková — česká klasika bez masa 🥩❌",
    caption: "🥩❌ Věřili byste, že veganská svíčková může chutnat lépe než originál? Vyzkoušejte náš recept! Celý postup na webu.",
    hashtags: ["#vegansvickova", "#veganczech", "#bezmasajidla", "#ceskakultura", "#veganrecept", "#plantbased", "#veganfood", "#svickova"],
    link: "/recepty/veganska-svickova", linkLabel: "Recept: Svíčková", emoji: "🥩",
  },
  {
    day: 24, date: "Pá 5.4.", type: "reel", theme: "Průvodce čtvrtěmi",
    hook: "Kde jíst vege v každé pražské čtvrti? Kompletní průvodce 🗺️",
    caption: "🗺️ Průvodce veganskou Prahou po čtvrtích! Vinohrady, Žižkov, Holešovice, Malá Strana — každá čtvrť má svá skrytá vege místa.\n\n📖 Celý průvodce na bezmasajidla.cz!",
    hashtags: ["#veganpraha", "#pruvodcepraha", "#bezmasajidla", "#vinohrady", "#zizkov", "#holesovice", "#praguevegan", "#plantbased"],
    link: "/blog/pruvodce-veganskou-prahou-ctvrti", linkLabel: "Blog: Průvodce Prahou", emoji: "🗺️", isViral: true,
  },
  {
    day: 25, date: "So 6.4.", type: "poll", theme: "Nejlepší dezert",
    hook: "Který veganský dezert milujete nejvíce? 🍰",
    caption: "🍰 Sladká anketa! Který veganský dezert je váš favorit? Cheesecake, brownies, tiramisu nebo palačinky? Hlasujte! 👇",
    hashtags: ["#vegandezert", "#vegansweets", "#bezmasajidla", "#veganfood", "#veganczech", "#plantbased", "#veganlife", "#dessert"],
    link: "/recepty?category=Dezerty", linkLabel: "Veganské dezerty", emoji: "🍰",
  },
  {
    day: 26, date: "Ne 7.4.", type: "story", theme: "Recept dne",
    hook: "Veganský cheesecake bez pečení 🍋",
    caption: "🍋 Recept dne: Veganský citronový cheesecake bez pečení! Připravte ho večer, ráno je hotový. Celý recept na webu!",
    hashtags: ["#vegancheesecake", "#veganrecept", "#bezmasajidla", "#nobake", "#veganfood", "#plantbased", "#veganczech", "#dessert"],
    link: "/recepty/vegansky-cheesecake", linkLabel: "Recept: Cheesecake", emoji: "🍋",
  },
  {
    day: 27, date: "Po 8.4.", type: "post", theme: "Nová restaurace",
    hook: "Tuto restauraci v Praze musíte vyzkoušet — otevřela nedávno 🆕",
    caption: "🆕 Shromaždiště Praha — nová adresa pro vegany a vegetariány! Moderní bistro s úžasnou atmosférou a kreativním menu.\n\n⭐ Hodnocení a menu na bezmasajidla.cz!",
    hashtags: ["#shromazdistepraha", "#veganpraha", "#bezmasajidla", "#newrestaurant", "#vegetarianpraha", "#praguefood", "#plantbased", "#novabistro"],
    link: "/restaurace/shromazdistepraha", linkLabel: "Shromaždiště — detail", emoji: "🆕",
  },
  {
    day: 28, date: "Út 9.4.", type: "poll", theme: "Vegan vs. vegetarián",
    hook: "Jsi vegan nebo vegetarián — jaký je rozdíl v Praze?",
    caption: "🌱 Velká otázka: Jsi vegan nebo vegetarián? A jaký je podle vás rozdíl ve výběru restaurací v Praze? Sdílejte v komentářích! 👇",
    hashtags: ["#veganvsvege", "#veganpraha", "#bezmasajidla", "#vegetarian", "#vegan", "#plantbased", "#veganlife", "#veganczech"],
    link: "/restaurace", linkLabel: "Všechny restaurace", emoji: "🌱", isViral: true,
  },
  {
    day: 29, date: "St 10.4.", type: "reel", theme: "Nejlepší brunche",
    hook: "TOP 5 veganských brunchů v Praze — víkendový průvodce ☕",
    caption: "☕ Víkendový brunch v Praze! Ukázali jsme vám 5 nejlepších míst pro veganský brunch — od Vinohrad po Holešovice.\n\n📖 Celý článek na bezmasajidla.cz!",
    hashtags: ["#veganbrunch", "#brunchpraha", "#bezmasajidla", "#weekend", "#praguecafe", "#veganpraha", "#brunch", "#plantbased"],
    link: "/blog/nejlepsi-veganske-brunche-praha", linkLabel: "Blog: Nejlepší brunche", emoji: "☕",
  },
  {
    day: 30, date: "Čt 11.4.", type: "post", theme: "Měsíční shrnutí",
    hook: "30 dní veganské Prahy — co jsme objevili? 🎉",
    caption: "🎉 Měsíc plný skvělého jídla! Sdíleli jsme s vámi restaurace, recepty, tipy a ankety. Děkujeme za vaši podporu!\n\n🌱 Celý adresář veganských a vegetariánských restaurací v Praze na bezmasajidla.cz — odkaz v biu!",
    hashtags: ["#veganpraha", "#bezmasajidla", "#veganlife", "#plantbased", "#veganczech", "#vegetarianpraha", "#praguevegan", "#vegancommunity"],
    link: "/", linkLabel: "bezmasajidla.cz", emoji: "🎉", isViral: true,
  },
];

const TYPE_LABELS: Record<PostType, { label: string; color: string }> = {
  post: { label: "Post", color: "bg-blue-100 text-blue-700" },
  story: { label: "Story", color: "bg-pink-100 text-pink-700" },
  reel: { label: "Reel", color: "bg-purple-100 text-purple-700" },
  poll: { label: "Anketa", color: "bg-amber-100 text-amber-700" },
};

function InstagramCalendar() {
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyCaption = (post: ContentPost) => {
    const text = `${post.caption}\n\n${post.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(post.day);
      toast.success("Příspěvek zkopírován do schránky!");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const viralCount = CONTENT_CALENDAR.filter((p) => p.isViral).length;
  const pollCount = CONTENT_CALENDAR.filter((p) => p.type === "poll").length;
  const reelCount = CONTENT_CALENDAR.filter((p) => p.type === "reel").length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-pink-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">30</div>
            <div className="text-xs text-gray-500 mt-1">Dní obsahu</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{viralCount}</div>
            <div className="text-xs text-gray-500 mt-1">Virální příspěvky</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{reelCount}</div>
            <div className="text-xs text-gray-500 mt-1">Reels</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pollCount}</div>
            <div className="text-xs text-gray-500 mt-1">Ankety</div>
          </CardContent>
        </Card>
      </div>

      {/* n8n Integration Note */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Instagram className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-pink-800 text-sm mb-1">Automatizace přes n8n</div>
            <p className="text-pink-700 text-xs leading-relaxed">
              Pro automatické publikování nastavte n8n workflow s Meta Graph API. 
              Zkopírujte texty níže a naplánujte je v Meta Business Suite nebo n8n.
              Doporučené časy: <strong>St–Pá 18:00–20:00</strong>, <strong>So–Ne 10:00–12:00</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CONTENT_CALENDAR.map((post) => (
          <Card
            key={post.day}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPost?.day === post.day ? "ring-2 ring-pink-400" : ""
            } ${post.isViral ? "border-amber-300" : "border-gray-200"}`}
            onClick={() => setSelectedPost(selectedPost?.day === post.day ? null : post)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-6">#{post.day}</span>
                  <span className="text-sm font-semibold text-gray-700">{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  {post.isViral && (
                    <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      Virální
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_LABELS[post.type].color}`}>
                    {TYPE_LABELS[post.type].label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{post.emoji}</span>
                <div className="font-semibold text-gray-900 text-sm leading-tight">{post.hook}</div>
              </div>

              <div className="text-xs text-emerald-600 font-medium mb-3">{post.theme}</div>

              {/* Expanded content */}
              {selectedPost?.day === post.day && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Caption
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{post.caption}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Hashtagy
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-pink-600 hover:bg-pink-500 text-white text-xs"
                      onClick={(e) => { e.stopPropagation(); copyCaption(post); }}
                    >
                      {copiedId === post.day ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Copy className="w-3 h-3 mr-1" />
                      )}
                      {copiedId === post.day ? "Zkopírováno!" : "Kopírovat text"}
                    </Button>
                    <Link href={post.link}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {post.linkLabel}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {selectedPost?.day !== post.day && (
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {post.linkLabel}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export hint */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-gray-700 text-sm mb-1">Tip: Export do Google Sheets</div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Pro plánování v Meta Business Suite nebo n8n exportujte tento kalendář do Google Sheets.
              Každý příspěvek zkopírujte tlačítkem "Kopírovat text" a vložte do plánovacího nástroje.
              Doporučujeme naplánovat celý měsíc dopředu pro maximální konzistenci.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
