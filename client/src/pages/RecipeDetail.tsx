// ============================================================
// BEZMASAJIDLA.CZ — Recipe Detail Page
// "Zelená Metropole" — full recipe with ingredients, steps
// ============================================================

import { useParams, Link } from "wouter";
import { Clock, Users, ChefHat, ArrowLeft, Leaf } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { recipes } from "@/lib/data";

const sampleIngredients: Record<string, string[]> = {
  "veganska-svickova": [
    "500 g seitanu (nebo seitan z pšeničného lepku)",
    "2 mrkve",
    "1 petržel",
    "1/4 celeru",
    "2 cibule",
    "200 ml cashew smetany",
    "2 lžíce hořčice",
    "2 lžíce citronové šťávy",
    "Sůl, pepř, bobkový list, nové koření",
    "Houskové knedlíky k podávání",
    "Brusinkový džem k podávání",
  ],
  default: [
    "Ingredience budou brzy doplněny.",
  ],
};

const sampleSteps: Record<string, string[]> = {
  "veganska-svickova": [
    "Seitan nakrájejte na plátky a orestujte na oleji do zlatova z obou stran.",
    "Kořenovou zeleninu a cibuli nakrájejte na kostičky a restujte do měkka.",
    "Přidejte koření (bobkový list, nové koření, pepř) a zalijte vodou nebo zeleninovým vývarem.",
    "Vařte na mírném ohni 45 minut, dokud zelenina nezměkne.",
    "Zeleninu rozmixujte dohladka, přidejte cashew smetanu, hořčici a citronovou šťávu.",
    "Omáčku dochutíte solí a pepřem, případně přidejte trochu cukru pro vyvážení chuti.",
    "Podávejte s housekovými knedlíky a brusinkovým džemem.",
  ],
  default: [
    "Postup přípravy bude brzy doplněn.",
  ],
};

export default function RecipeDetail() {
  const params = useParams<{ slug: string }>();
  const recipe = recipes.find((r) => r.slug === params.slug);

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🥦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Recept nenalezen
            </h2>
            <Link href="/recepty">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white mt-4">
                Zpět na recepty
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ingredients = sampleIngredients[recipe.slug] || sampleIngredients.default;
  const steps = sampleSteps[recipe.slug] || sampleSteps.default;
  const totalTime = recipe.prepTime + recipe.cookTime;

  const difficultyColor = {
    snadný: "bg-emerald-100 text-emerald-700",
    střední: "bg-amber-100 text-amber-700",
    náročný: "bg-red-100 text-red-700",
  }[recipe.difficulty];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-emerald-800 py-4">
        <div className="container">
          <nav className="text-xs text-emerald-300 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            <span>/</span>
            <Link href="/recepty" className="hover:text-white transition-colors">Recepty</Link>
            <span>/</span>
            <span className="text-white">{recipe.title}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link href="/recepty" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Zpět na recepty
          </Link>

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-72">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {recipe.isVegan && (
              <div className="absolute top-4 left-4 bg-emerald-700 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Leaf className="w-3.5 h-3.5" />
                Veganský recept
              </div>
            )}
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
            <p className="text-sm text-emerald-600 font-medium mb-1">{recipe.category}</p>
            <h1
              className="text-3xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {recipe.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">{recipe.description}</p>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-100">
              <div className="text-center">
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Příprava</p>
                <p className="text-sm font-semibold text-gray-900">{recipe.prepTime} min</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Vaření</p>
                <p className="text-sm font-semibold text-gray-900">{recipe.cookTime} min</p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Porce</p>
                <p className="text-sm font-semibold text-gray-900">{recipe.servings}</p>
              </div>
              <div className="text-center">
                <ChefHat className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Náročnost</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor}`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
            <h2
              className="text-xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Ingredience
            </h2>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
            <h2
              className="text-xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Postup přípravy
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-7 h-7 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
