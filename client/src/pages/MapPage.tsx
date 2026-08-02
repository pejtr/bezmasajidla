// ============================================================
// BEZMASAJIDLA.CZ — Map Page
// "Zelená Metropole" — full-screen map with restaurant markers
// Markers are re-rendered on filter change via useRef + useEffect
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { X, MapPin, Star, Navigation, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { MapView, MapHandle, MapMarker, MapCircle } from "@/components/Map";
import { restaurants, getTypeColor, getTypeLabel, Restaurant } from "@/lib/data";
import { getOpenStatus } from "@/lib/openingHours";
import SEOHead from "@/components/SEOHead";

const typeColors: Record<string, string> = {
  vegan: "#1B6B45",
  vegetarian: "#22c55e",
  friendly: "#E8B84B",
};

type FilterType = "all" | "vegan" | "vegetarian" | "friendly";

export default function MapPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [nearbyMode, setNearbyMode] = useState(false);
  const userMarkerRef = useRef<MapMarker | null>(null);
  const userCircleRef = useRef<MapCircle | null>(null);

  // Keep a ref to the map instance and all markers so we can show/hide them
  const mapRef = useRef<MapHandle | null>(null);
  const markersRef = useRef<{ marker: MapMarker; restaurant: Restaurant }[]>([]);

  // Calculate distance in km between two coordinates
  const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Handle GPS location request
  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Váš prohlížeč nepodporuje geolokaci.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        setNearbyMode(true);
        setGpsLoading(false);

        const map = mapRef.current;
        if (!map) return;

        // Center map on user
        map.setCenter(loc);
        map.setZoom(14);

        // Remove old user marker/circle
        if (userMarkerRef.current) userMarkerRef.current.remove();
        if (userCircleRef.current) userCircleRef.current.remove();

        // Add user location marker (blue dot)
        userMarkerRef.current = map.addMarker({ position: loc, title: "Vaše poloha", color: "#3B82F6" });

        // Add 1.5km radius circle
        userCircleRef.current = map.addCircle({ center: loc, radius: 1500, color: "#3B82F6" });
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) setGpsError("Přístup k poloze byl zamítnut. Povolte geolokaci v nastavení prohlížeče.");
        else setGpsError("Nepodařilo se zjistit vaši polohu. Zkuste to znovu.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Reset nearby mode
  const handleResetLocation = useCallback(() => {
    setNearbyMode(false);
    setUserLocation(null);
    setGpsError(null);
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
    if (userCircleRef.current) { userCircleRef.current.remove(); userCircleRef.current = null; }
    if (mapRef.current) {
      mapRef.current.setCenter({ lat: 50.0755, lng: 14.4378 });
      mapRef.current.setZoom(13);
    }
  }, []);

  // In nearby mode, also filter by distance (1.5km)
  const isVisible = useCallback(
    (r: Restaurant) => {
      if (r.type === "fastfood") return false;
      if (filterType !== "all" && r.type !== filterType) return false;
      if (nearbyMode && userLocation) {
        return getDistanceKm(userLocation.lat, userLocation.lng, r.lat, r.lng) <= 1.5;
      }
      return true;
    },
    [filterType, nearbyMode, userLocation]
  );

  const filteredCount = restaurants.filter(isVisible).length;

  // When filter changes, show/hide existing markers
  useEffect(() => {
    markersRef.current.forEach(({ marker, restaurant }) => {
      marker.setVisible(isVisible(restaurant));
    });
    // Close popup if selected restaurant is now hidden
    if (selectedRestaurant && !isVisible(selectedRestaurant)) {
      setSelectedRestaurant(null);
    }
  }, [filterType, isVisible, selectedRestaurant]);

  // Called once when Google Maps is ready — create all markerss
  const handleMapReady = useCallback((map: MapHandle) => {
    mapRef.current = map;
    map.setCenter({ lat: 50.0755, lng: 14.4378 });
    map.setZoom(13);

    // Create a marker for every non-fastfood restaurant
    const allRestaurants = restaurants.filter((r) => r.type !== "fastfood");
    allRestaurants.forEach((restaurant) => {
      const marker = map.addMarker({
        position: { lat: restaurant.lat, lng: restaurant.lng },
        title: restaurant.name,
        color: typeColors[restaurant.type] ?? "#888",
        onClick: () => setSelectedRestaurant(restaurant),
      });

      markersRef.current.push({ marker, restaurant });
    });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F8FAF6] overflow-hidden">
      <SEOHead
        title="Mapa Veganských a Vegetariánských Restaurací v Praze"
        description="Interaktivní mapa všech veganských a vegetariánských restaurací v Praze. Najděte bezmasé restaurace v okolí."
        ogUrl="https://www.bezmasajidla.cz/mapa"
      />
      <Header />

      {/* Filter bar */}
      <div className="bg-white border-b border-emerald-100 py-3 shadow-sm">
        <div className="container flex items-center gap-3 overflow-x-auto">
          <span className="text-sm text-gray-500 whitespace-nowrap">Filtrovat:</span>
          {[
            { value: "all" as FilterType, label: "Vše", activeColor: "bg-gray-700 text-white" },
            { value: "vegan" as FilterType, label: "Veganské", activeColor: "bg-emerald-700 text-white" },
            { value: "vegetarian" as FilterType, label: "Vegetariánské", activeColor: "bg-emerald-500 text-white" },
            { value: "friendly" as FilterType, label: "Vegan-friendly", activeColor: "bg-amber-400 text-amber-900" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full font-medium transition-all flex-shrink-0 ${
                filterType === opt.value
                  ? opt.activeColor + " shadow-sm scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {nearbyMode ? (
              <button
                onClick={handleResetLocation}
                className="whitespace-nowrap text-sm px-3 py-1.5 rounded-full font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1.5 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Zrušit okolí
              </button>
            ) : (
              <button
                onClick={handleNearMe}
                disabled={gpsLoading}
                className="whitespace-nowrap text-sm px-3 py-1.5 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 transition-all disabled:opacity-60"
              >
                {gpsLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5" />
                )}
                V okolí
              </button>
            )}
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {filteredCount} restaurací
            </span>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative min-h-0">
        <MapView onMapReady={handleMapReady} />

        {/* GPS error notification */}
        {gpsError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 max-w-sm">
            <X className="w-4 h-4 flex-shrink-0" onClick={() => setGpsError(null)} />
            {gpsError}
          </div>
        )}

        {/* Nearby mode indicator */}
        {nearbyMode && userLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5" />
            Zobrazuji restaurace do 1,5 km od vás — <strong>{filteredCount}</strong> nalezeno
          </div>
        )}

        {/* Legend — only show relevant items based on active filter */}
        <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-emerald-100 p-3 z-10">
          <p className="text-xs font-semibold text-gray-700 mb-2">Legenda</p>
          <div className="flex flex-col gap-1.5">
            {[
              { color: "#1B6B45", label: "Veganská", type: "vegan" },
              { color: "#22c55e", label: "Vegetariánská", type: "vegetarian" },
              { color: "#E8B84B", label: "Vegan-friendly", type: "friendly" },
            ]
              .filter((item) => filterType === "all" || filterType === item.type)
              .map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Selected restaurant popup */}
        {selectedRestaurant && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
              <div className="flex gap-0">
                <img
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                  className="w-24 h-24 object-cover flex-shrink-0"
                />
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-semibold text-gray-900 text-sm leading-tight truncate"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {selectedRestaurant.name}
                    </h3>
                    <button
                      onClick={() => setSelectedRestaurant(null)}
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${getTypeColor(
                      selectedRestaurant.type
                    )}`}
                  >
                    {getTypeLabel(selectedRestaurant.type)}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-700 font-medium">
                      {selectedRestaurant.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">({selectedRestaurant.reviewCount})</span>
                    {(() => {
                      const mapStatus = getOpenStatus(selectedRestaurant.hours || "");
                      return (
                        <span
                          className={`text-xs ml-1 ${
                            mapStatus.isOpen ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {mapStatus.isOpen ? "● Otevřeno" : `● ${mapStatus.statusText}`}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-gray-500 truncate">
                      {selectedRestaurant.district}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3">
                <Link href={`/restaurace/${selectedRestaurant.slug}`}>
                  <button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Zobrazit profil
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
