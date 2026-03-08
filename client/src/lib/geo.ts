// ============================================================
// BEZMASAJIDLA.CZ — Geo Utilities
// Haversine distance + walking time estimation
// ============================================================

import { Restaurant, restaurants } from "./data";

/**
 * Calculate distance between two GPS coordinates using Haversine formula.
 * Returns distance in meters.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance for display.
 * Under 1000m: "850 m", over 1000m: "1.2 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Estimate walking time based on distance.
 * Average walking speed: ~5 km/h = ~83 m/min
 * We use a slightly slower pace for urban walking: ~70 m/min
 */
export function estimateWalkingTime(meters: number): string {
  const minutes = Math.round(meters / 70);
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} h`;
  return `${hours} h ${remainingMinutes} min`;
}

export interface NearbyRestaurant {
  restaurant: Restaurant;
  distance: number; // meters
  formattedDistance: string;
  walkingTime: string;
}

/**
 * Find the N nearest fastfood chains to a given restaurant.
 */
export function getNearestFastFood(
  currentSlug: string,
  count: number = 5
): NearbyRestaurant[] {
  const current = restaurants.find((r) => r.slug === currentSlug);
  if (!current) return [];

  // Get unique chains (by name prefix) — pick the closest branch per chain
  const chainMap = new Map<string, NearbyRestaurant>();

  restaurants
    .filter((r) => r.type === "fastfood")
    .forEach((r) => {
      const distance = haversineDistance(current.lat, current.lng, r.lat, r.lng);
      // Use chain name as key (strip branch suffix after " — ")
      const chainName = r.name.split(" — ")[0].split(" Praha")[0].trim();
      const existing = chainMap.get(chainName);
      if (!existing || distance < existing.distance) {
        chainMap.set(chainName, {
          restaurant: r,
          distance,
          formattedDistance: formatDistance(distance),
          walkingTime: estimateWalkingTime(distance),
        });
      }
    });

  return Array.from(chainMap.values())
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

/**
 * Find the N nearest restaurants to a given restaurant.
 * Excludes the restaurant itself.
 */
export function getNearestRestaurants(
  currentSlug: string,
  count: number = 5
): NearbyRestaurant[] {
  const current = restaurants.find((r) => r.slug === currentSlug);
  if (!current) return [];

  return restaurants
    .filter((r) => r.slug !== currentSlug && r.type !== "fastfood")
    .map((r) => {
      const distance = haversineDistance(current.lat, current.lng, r.lat, r.lng);
      return {
        restaurant: r,
        distance,
        formattedDistance: formatDistance(distance),
        walkingTime: estimateWalkingTime(distance),
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}
