// ============================================================
// BEZMASAJIDLA.CZ — RestaurantCard Component
// "Zelená Metropole" — card with rating, tags, open/closed
// ============================================================

import { Link } from "wouter";
import { MapPin, Phone, Star, Crown } from "lucide-react";
import { Restaurant, getTypeLabel, getTypeColor, renderStars } from "@/lib/data";

interface Props {
  restaurant: Restaurant;
  rank?: number;
}

export default function RestaurantCard({ restaurant, rank }: Props) {
  const stars = renderStars(restaurant.rating);

  return (
    <Link href={`/restaurace/${restaurant.slug}`}>
      <div className="restaurant-card bg-white rounded-xl border border-emerald-100 overflow-hidden group cursor-pointer">
        <div className="flex gap-0">
          {/* Image */}
          <div className="relative w-36 sm:w-44 flex-shrink-0">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover min-h-[140px] group-hover:scale-105 transition-transform duration-300"
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
          </div>

          {/* Content */}
          <div className="flex-1 p-4 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-emerald-700 transition-colors truncate" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {restaurant.name}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${getTypeColor(restaurant.type)}`}
              >
                {restaurant.type === "vegan" ? "Vegan" : restaurant.type === "vegetarian" ? "Vegetarián" : "Vegan-friendly"}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-2">
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
              <span className="text-xs text-gray-400">({restaurant.reviewCount} recenzí)</span>
              <span className={`text-xs font-medium ml-1 ${restaurant.isOpen ? "text-emerald-600" : "text-red-500"}`}>
                {restaurant.isOpen ? "● Otevřeno" : "● Zavřeno"}
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

            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
              {restaurant.description}
            </p>

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
