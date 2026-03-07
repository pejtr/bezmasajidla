// ============================================================
// BEZMASAJIDLA.CZ — RecipeCard Component
// "Zelená Metropole" — recipe card with time, difficulty, bookmark button
// ============================================================

import { Link } from "wouter";
import { Clock, Users, ChefHat, Bookmark } from "lucide-react";
import { Recipe } from "@/lib/data";
import { useFavorites } from "@/contexts/FavoritesContext";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const { isRecipeFavorite, toggleRecipe } = useFavorites();
  const isFav = isRecipeFavorite(recipe.slug);

  const difficultyColor = {
    snadný: "bg-emerald-100 text-emerald-700",
    střední: "bg-amber-100 text-amber-700",
    náročný: "bg-red-100 text-red-700",
  }[recipe.difficulty];

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleRecipe(recipe.slug);
  };

  return (
    <Link href={`/recepty/${recipe.slug}`}>
      <div className="restaurant-card bg-white rounded-xl border border-emerald-100 overflow-hidden group cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.images?.[0]?.url || recipe.image}
            alt={recipe.images?.[0]?.alt || recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {recipe.isVegan && (
            <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Vegan
            </span>
          )}
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor}`}>
            {recipe.difficulty}
          </span>
          {/* Bookmark button */}
          <button
            onClick={handleBookmarkClick}
            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              isFav
                ? "bg-emerald-700 text-white"
                : "bg-white/80 text-gray-500 hover:bg-emerald-700 hover:text-white"
            }`}
            title={isFav ? "Odebrat z oblíbených" : "Uložit recept"}
          >
            <Bookmark className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-emerald-600 font-medium mb-1">{recipe.category}</p>
          <h3
            className="font-semibold text-gray-900 text-base leading-snug mb-3 group-hover:text-emerald-700 transition-colors"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {recipe.title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
            {recipe.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>{recipe.servings} porce</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-emerald-500" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
