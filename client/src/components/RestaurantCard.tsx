// ============================================================
// BEZMASAJIDLA.CZ — RestaurantCard Component
// "Zelená Metropole" — card with rating, tags, open/closed, heart button
// Mobile: stacked layout (image top, content below)
// Desktop: horizontal layout (image left, content right)
// ============================================================

import { Link } from "wouter";
import { MapPin, Phone, Star, Crown, Heart, ShoppingBag } from "lucide-react";
import { Restaurant, getTypeColor, renderStars } from "@/lib/data";
import { useFavorites } from "@/contexts/FavoritesContext";
import OptimizedImage from "@/components/OptimizedImage";
import { getOpenStatus } from "@/lib/openingHours";

interface Props {
  restaurant: Restaurant;
  rank?: number;
}

export default function RestaurantCard({ restaurant, rank }: Props) {
  const stars = renderStars(restaurant.rating);
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();
  const isFav = isRestaurantFavorite(restaurant.slug);
  const openStatus = getOpenStatus(restaurant.hours || "");

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleRestaurant(restaurant.slug);
  };

  return (
    <Link href={`/restaurace/${restaurant.slug}`}>
      <div className="restaurant-card bg-white rounded-xl border border-emerald-100 overflow-hidden group cursor-pointer">
        {/* Mobile: stacked | Desktop: horizontal */}
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Image */}
          <div className="relative w-full sm:w-44 flex-shrink-0">
            <OptimizedImage
              src={restaurant.image}
              alt={`${restaurant.name} — ${restaurant.type === "vegan" ? "veganská" : restaurant.type === "vegetarian" ? "vegetariánská" : "vegan-friendly"} restaurace v Praze`}
              className="w-full h-44 sm:h-full sm:min-h-[140px] group-hover:scale-105 transition-transform duration-300"
              placeholderColor="#d1fae5"
            />
            {rank && (
              <div className="absolute top-2 left-2 w-7 h-7 bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                {rank}
              </div>
            )}
            {restaurant.isPremium && (
              <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <Crown className="w-2.5 h-2.5" />
                <span>TOP</span>
              </div>
            )}
            {/* Heart button on image — mobile */}
            <button
              onClick={handleHeartClick}
              className={`absolute bottom-2 right-2 sm:hidden w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                isFav
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-400 hover:text-red-400"
              }`}
              title={isFav ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-4 min-w-0">
            {/* Header row — name always prominent */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-semibold text-gray-900 text-base sm:text-base leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2 sm:truncate"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${getTypeColor(restaurant.type)}`}>
                  {restaurant.type === "vegan" ? "Veganská" : restaurant.type === "vegetarian" ? "Vegetariánská" : "Vegan-friendly"}
                </span>
                {/* Heart button — desktop only (mobile has overlay on image) */}
                <button
                  onClick={handleHeartClick}
                  className={`hidden sm:flex w-7 h-7 rounded-full items-center justify-center transition-all ${
                    isFav
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-400"
                  }`}
                  title={isFav ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-500" : ""}`} />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: stars.filled }).map((_, i) => (
                  <Star key={`f${i}`} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                {stars.half && <Star className="w-3.5 h-3.5 fill-amber-200 text-amber-400" />}
                {Array.from({ length: stars.empty }).map((_, i) => (
                  <Star key={`e${i}`} className="w-3.5 h-3.5 text-gray-200 fill-gray-200" />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-800">{restaurant.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({restaurant.reviewCount})</span>
              {openStatus.isOpen ? (
                <span className="text-xs font-medium text-emerald-600" title={openStatus.statusText}>
                  ● Otevřeno
                </span>
              ) : (() => {
                // Split "Zavřeno · otevírá zítra v 11:30" into parts
                const parts = openStatus.statusText.split("·");
                const closedPart = parts[0]?.trim() || "Zavřeno";
                const opensPart = parts[1]?.trim() || "";
                // Extract time (last word after last space) and prefix
                const lastSpaceIdx = opensPart.lastIndexOf(" ");
                const opensPrefix = lastSpaceIdx >= 0 ? opensPart.slice(0, lastSpaceIdx + 1) : opensPart;
                const opensTime = lastSpaceIdx >= 0 ? opensPart.slice(lastSpaceIdx + 1) : "";
                return (
                  <span className="text-xs" title={openStatus.statusText}>
                    <span className="text-red-500 font-medium">● {closedPart}</span>
                    {opensPart && (
                      <span className="text-gray-400">
                        {" · "}{opensPrefix}<span className="font-bold text-gray-600">{opensTime}</span>
                      </span>
                    )}
                  </span>
                );
              })()}
              <span className="text-xs font-medium" title={restaurant.priceLevel === 1 ? "Do 200 Kč" : restaurant.priceLevel === 2 ? "200–400 Kč" : "400+ Kč"}>
                {Array.from({ length: restaurant.priceLevel }).map((_, i) => (
                  <span key={i} className="text-amber-600">Kč</span>
                ))}
                {Array.from({ length: 3 - restaurant.priceLevel }).map((_, i) => (
                  <span key={i} className="text-amber-300/50">Kč</span>
                ))}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {restaurant.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                  {tag}
                </span>
              ))}
            </div>

            {/* Best For badge — shown when editorialReview.bestFor is set */}
            {restaurant.editorialReview?.bestFor && (
              <div className="flex items-center gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                  <span>★</span>
                  {restaurant.editorialReview.bestFor.length > 40
                    ? restaurant.editorialReview.bestFor.slice(0, 40) + "…"
                    : restaurant.editorialReview.bestFor}
                </span>
              </div>
            )}

            {/* Description — hidden on very small screens to save space */}
            <p className="hidden sm:block text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
              {restaurant.description}
            </p>

            {/* Shopping Center badge */}
            {restaurant.shoppingCenter && (
              <div className="flex items-center gap-1 text-xs text-purple-600 mb-1">
                <ShoppingBag className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium">{restaurant.shoppingCenter}</span>
              </div>
            )}

            {/* Address & Phone */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </div>
              {restaurant.phone && (
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
