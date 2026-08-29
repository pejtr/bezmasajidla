// ============================================================
// BEZMASAJIDLA.CZ — 1-Click Grocery Cart & Affiliate Ingredient Widget
// Embedded in recipe detail pages for instant grocery purchasing & commission generation.
// ============================================================

import { useState } from "react";
import { ShoppingBag, ShoppingCart, CheckCircle2, ExternalLink, Sparkles, ShieldCheck } from "lucide-react";

interface RecipeGroceryWidgetProps {
  recipeTitle: string;
  recipeSlug: string;
  servings: number;
  ingredients: { name: string; amount?: string }[];
  estimatedCostPerServingCzk?: number;
}

export default function RecipeGroceryWidget({
  recipeTitle,
  recipeSlug,
  servings,
  ingredients,
  estimatedCostPerServingCzk = 35,
}: RecipeGroceryWidgetProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    ingredients.forEach((_, idx) => {
      initial[idx] = true;
    });
    return initial;
  });

  const toggleIngredient = (idx: number) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const selectedCount = Object.values(selectedIngredients).filter(Boolean).length;
  const estimatedTotalCzk = Math.round(estimatedCostPerServingCzk * servings);

  const getAffiliateUrl = (merchant: "rohlik" | "kosik" | "ekoclovek") => {
    const baseUrl =
      merchant === "ekoclovek"
        ? "https://www.ekoclovek.cz/"
        : merchant === "rohlik"
          ? "https://www.rohlik.cz/"
          : "https://www.kosik.cz/";

    const params = new URLSearchParams({
      merchant,
      recipeSlug,
      placement: "recipe_grocery_widget",
      url: baseUrl,
    });

    return `/api/affiliate/redirect?${params.toString()}`;
  };

  return (
    <div className="bg-gradient-to-br from-[#F4F8F3] to-[#EBF2E8] border border-[#D5E3D2] rounded-3xl p-6 sm:p-8 shadow-sm my-8">
      {/* Header Badge */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A7C59] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#4A7C59]" />
            <span>Nákupní košík ingrediencí • 1-Click Order</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C2826]">
            Nakupte suroviny na {recipeTitle}
          </h3>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#D5E3D2] shadow-2xs text-right">
          <span className="text-xs text-[#7A887D] font-medium block">Odhadovaná cena</span>
          <span className="text-lg font-bold text-[#4A7C59]">
            ~{estimatedCostPerServingCzk} Kč <span className="text-xs font-normal text-[#5A685D]">/ porce</span>
          </span>
        </div>
      </div>

      {/* Ingredient Selection List */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E1EADF] mb-6">
        <div className="flex items-center justify-between text-sm font-semibold text-[#2C352E] mb-3 pb-2 border-b border-[#F0F4EF]">
          <span>Vybrané ingredience pro {servings} porce ({selectedCount}/{ingredients.length})</span>
          <span className="text-xs text-[#7A887D]">Kliknutím odškrtnete</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ingredients.map((ing, idx) => {
            const isChecked = selectedIngredients[idx] ?? true;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleIngredient(idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-sm font-medium ${
                  isChecked
                    ? "bg-[#F8FAF6] border-[#4A7C59] text-[#1C2826]"
                    : "bg-gray-50 border-gray-200 text-gray-400 line-through"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <CheckCircle2
                    className={`w-4 h-4 flex-shrink-0 ${
                      isChecked ? "text-[#4A7C59]" : "text-gray-300"
                    }`}
                  />
                  <span className="truncate">{ing.name}</span>
                </div>
                {ing.amount && (
                  <span className="text-xs font-semibold text-[#7A887D] flex-shrink-0 ml-2">
                    {ing.amount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Merchant 1-Click Order Buttons */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[#5A685D] uppercase tracking-wider mb-2">
          Vyberte váš oblíbený e-shop s doručením domů:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Ekočlověk */}
          <a
            href={getAffiliateUrl("ekoclovek")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-[#4A7C59] text-white rounded-2xl hover:bg-[#3D6649] transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                🌱
              </div>
              <div>
                <span className="text-sm font-bold block leading-tight">Ekočlověk.cz</span>
                <span className="text-[11px] opacity-90 block">BIO Suroviny & Tofu</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>

          {/* Rohlík.cz */}
          <a
            href={getAffiliateUrl("rohlik")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-[#E65100] text-white rounded-2xl hover:bg-[#BF360C] transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                🥐
              </div>
              <div>
                <span className="text-sm font-bold block leading-tight">Rohlík.cz</span>
                <span className="text-[11px] opacity-90 block">Doručení do 60 min</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>

          {/* Košík.cz */}
          <a
            href={getAffiliateUrl("kosik")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-[#1976D2] text-white rounded-2xl hover:bg-[#1565C0] transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                🛒
              </div>
              <div>
                <span className="text-sm font-bold block leading-tight">Košík.cz</span>
                <span className="text-[11px] opacity-90 block">Velký supermarket</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="flex items-center gap-2 text-xs text-[#7A887D] mt-4 pt-3 border-t border-[#D5E3D2]/60">
        <ShieldCheck className="w-4 h-4 text-[#4A7C59]" />
        <span>Nákupem přes tyto odkazy podporujete rozvoj BezmasáJídla.cz bez jakýchkoli příplatků k ceně nakoupeného zboží.</span>
      </div>
    </div>
  );
}
