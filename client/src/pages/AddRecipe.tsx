// ============================================================
// BEZMASAJIDLA.CZ — Add Recipe Page
// "Zelená Metropole" — enhanced form with structured ingredients & steps
// ============================================================

import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Plus, Trash2, ChefHat, Loader2,
  GripVertical, ArrowUp, ArrowDown, Utensils, ListOrdered,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const CATEGORIES = [
  "Hlavní jídla", "Polévky", "Saláty", "Dezerty",
  "Snídaně", "Svačiny", "Přílohy", "Nápoje", "Pečivo",
];

const DIFFICULTIES = ["snadný", "střední", "náročný"];

interface Ingredient {
  amount: string;
  name: string;
}

export default function AddRecipe() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [isVegan, setIsVegan] = useState(true);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ amount: "", name: "" }]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [tags, setTags] = useState("");

  const createRecipe = trpc.userRecipes.create.useMutation({
    onSuccess: () => {
      toast.success("Recept byl odeslán ke schválení!");
      navigate("/profil?tab=recipes");
    },
    onError: (err) => {
      toast.error("Nepodařilo se odeslat recept: " + err.message);
    },
  });

  // ── Ingredient helpers ──
  const addIngredient = () => setIngredients([...ingredients, { amount: "", name: "" }]);
  const removeIngredient = (i: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, idx) => idx !== i));
  };
  const updateIngredient = (i: number, field: keyof Ingredient, val: string) => {
    const updated = [...ingredients];
    updated[i] = { ...updated[i], [field]: val };
    setIngredients(updated);
  };

  // ── Step helpers ──
  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (i: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, idx) => idx !== i));
  };
  const updateStep = (i: number, val: string) => {
    const updated = [...steps];
    updated[i] = val;
    setSteps(updated);
  };
  const moveStep = useCallback((from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= steps.length) return;
    setSteps((prev) => {
      const updated = [...prev];
      [updated[from], updated[to]] = [updated[to], updated[from]];
      return updated;
    });
  }, [steps.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vyplňte název receptu.");
      return;
    }

    const filteredIngredients = ingredients
      .filter((i) => i.name.trim())
      .map((i) => (i.amount.trim() ? `${i.amount.trim()} ${i.name.trim()}` : i.name.trim()));
    const filteredSteps = steps.filter((s) => s.trim());

    if (filteredIngredients.length === 0) {
      toast.error("Přidejte alespoň jednu ingredienci.");
      return;
    }
    if (filteredSteps.length === 0) {
      toast.error("Přidejte alespoň jeden krok postupu.");
      return;
    }

    createRecipe.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      difficulty: difficulty || undefined,
      prepTime: prepTime || undefined,
      servings: servings ? Number(servings) : undefined,
      image: imageUrl.trim() || undefined,
      ingredients: JSON.stringify(filteredIngredients),
      steps: JSON.stringify(filteredSteps),
      tags: tags.trim()
        ? JSON.stringify(tags.split(",").map((t) => t.trim()).filter(Boolean))
        : undefined,
    });
  };

  if (authLoading) {
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
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center max-w-md mx-auto">
            <ChefHat className="w-10 h-10 text-emerald-300 mx-auto mb-4" />
            <h2
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Přihlaste se
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Pro přidání receptu se prosím přihlaste.
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      {/* Hero */}
      <div className="bg-emerald-800 py-8">
        <div className="container">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 text-sm text-emerald-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět
          </button>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Přidat nový recept
          </h1>
          <p className="text-emerald-300 text-sm mt-1">
            Sdílejte svůj oblíbený bezmasý recept s komunitou. Po odeslání bude recept zkontrolován a schválen.
          </p>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Basic info ── */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Základní informace
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Název receptu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="např. Veganský pad thai s tofu"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Popis
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Krátký popis receptu..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  >
                    <option value="">Vyberte kategorii</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Obtížnost</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  >
                    <option value="">Vyberte obtížnost</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doba přípravy</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="např. 15 min"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doba vaření</label>
                  <input
                    type="text"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="např. 30 min"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Počet porcí</label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : "")}
                    placeholder="např. 4"
                    min={1}
                    max={50}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2.5">
                    <input
                      type="checkbox"
                      checked={isVegan}
                      onChange={(e) => setIsVegan(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Veganský recept</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL obrázku (volitelné)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/foto-receptu.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Štítky (oddělené čárkou)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="např. vegan, bezlepkové, rychlé"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* ── Ingredients ── */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Ingredience <span className="text-red-500">*</span>
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Zadejte množství a název každé ingredience zvlášť pro lepší přehlednost.
            </p>

            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                    placeholder="Množství"
                    className="w-28 flex-shrink-0 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    placeholder="Název ingredience"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Odebrat ingredienci"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-3 flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Přidat ingredienci
            </button>
          </div>

          {/* ── Steps ── */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListOrdered className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Postup přípravy <span className="text-red-500">*</span>
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Popište jednotlivé kroky přípravy. Pomocí šipek můžete měnit pořadí kroků.
            </p>

            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 group">
                  {/* Step number + reorder buttons */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-2">
                    <span className="text-xs font-bold text-white bg-emerald-600 w-6 h-6 rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveStep(i, "up")}
                        disabled={i === 0}
                        className="p-0.5 text-gray-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Posunout nahoru"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(i, "down")}
                        disabled={i === steps.length - 1}
                        className="p-0.5 text-gray-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Posunout dolů"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    placeholder={`Popište krok ${i + 1}...`}
                    rows={2}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors mt-2"
                      title="Odebrat krok"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="mt-3 flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Přidat krok
            </button>
          </div>

          {/* ── Preview summary ── */}
          {(title.trim() || ingredients.some((i) => i.name.trim()) || steps.some((s) => s.trim())) && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <h2 className="text-lg font-semibold text-emerald-900 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Náhled receptu
              </h2>
              {title.trim() && (
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
              )}
              {description.trim() && (
                <p className="text-sm text-gray-600 mb-3">{description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                {category && <span className="bg-white px-2 py-1 rounded-full">{category}</span>}
                {difficulty && <span className="bg-white px-2 py-1 rounded-full">{difficulty}</span>}
                {prepTime && <span className="bg-white px-2 py-1 rounded-full">Příprava: {prepTime}</span>}
                {cookTime && <span className="bg-white px-2 py-1 rounded-full">Vaření: {cookTime}</span>}
                {servings && <span className="bg-white px-2 py-1 rounded-full">{servings} porcí</span>}
                {isVegan && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Vegan</span>}
              </div>
              {ingredients.some((i) => i.name.trim()) && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-emerald-800 mb-1">Ingredience:</p>
                  <ul className="text-sm text-gray-700 space-y-0.5">
                    {ingredients.filter((i) => i.name.trim()).map((ing, idx) => (
                      <li key={idx}>
                        {ing.amount.trim() ? (
                          <><span className="font-medium">{ing.amount}</span> {ing.name}</>
                        ) : (
                          ing.name
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {steps.some((s) => s.trim()) && (
                <div>
                  <p className="text-xs font-semibold text-emerald-800 mb-1">Postup:</p>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    {steps.filter((s) => s.trim()).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* ── Submit ── */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-400">
              Recept bude po odeslání zkontrolován a schválen administrátorem.
            </p>
            <Button
              type="submit"
              disabled={createRecipe.isPending}
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-3 text-base font-semibold"
            >
              {createRecipe.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Odesílám...
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4 mr-2" />
                  Odeslat recept
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
