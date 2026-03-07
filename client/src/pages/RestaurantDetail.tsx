// ============================================================
// BEZMASAJIDLA.CZ — Restaurant Detail Page
// "Zelená Metropole" — full profile with map, reviews, info
// ============================================================

import { useParams, Link } from "wouter";
import { MapPin, Phone, Globe, Clock, Star, Crown, ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { restaurants, getTypeLabel, getTypeColor, renderStars } from "@/lib/data";
import { MapView } from "@/components/Map";
import { useState } from "react";
import { toast } from "sonner";
import { RestaurantJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

const RESTAURANT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/restaurant-placeholder-NfsuHQoJhFmyxCXwn7EygE.webp";

export default function RestaurantDetail() {
  const params = useParams<{ slug: string }>();
  const restaurant = restaurants.find((r) => r.slug === params.slug);
  const [mapReady, setMapReady] = useState(false);

  const jsonLd = restaurant ? (
    <>
      <RestaurantJsonLd restaurant={restaurant} />
      <BreadcrumbJsonLd items={[
        { name: "Domů", url: "/" },
        { name: "Restaurace", url: "/restaurace" },
        { name: restaurant.name, url: `/restaurace/${restaurant.slug}` },
      ]} />
    </>
  ) : null;

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Restaurace nenalezena
            </h2>
            <Link href="/restaurace">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white mt-4">
                Zpět na seznam
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stars = renderStars(restaurant.rating);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Odkaz zkopírován do schránky");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      {jsonLd}
      <Header />

      {/* Breadcrumb */}
      <div className="bg-emerald-800 py-4">
        <div className="container">
          <nav className="text-xs text-emerald-300 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            <span>/</span>
            <Link href="/restaurace" className="hover:text-white transition-colors">Restaurace</Link>
            <span>/</span>
            <span className="text-white">{restaurant.name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2">
            {/* Back button */}
            <Link href="/restaurace" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zpět na seznam
            </Link>

            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 h-72">
              <img
                src={restaurant.image || RESTAURANT_IMG}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {restaurant.isPremium && (
                <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                  Prémiový profil
                </div>
              )}
            </div>

            {/* Restaurant header */}
            <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1
                    className="text-3xl font-bold text-gray-900 mb-1"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {restaurant.name}
                  </h1>
                  <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${getTypeColor(restaurant.type)}`}>
                    {getTypeLabel(restaurant.type)}
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: stars.filled }).map((_, i) => (
                    <Star key={`f${i}`} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  {stars.half && <Star className="w-5 h-5 fill-amber-200 text-amber-400" />}
                  {Array.from({ length: stars.empty }).map((_, i) => (
                    <Star key={`e${i}`} className="w-5 h-5 text-gray-200 fill-gray-200" />
                  ))}
                </div>
                <span className="text-xl font-bold text-gray-900">{restaurant.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({restaurant.reviewCount} recenzí)</span>
                <span className={`text-sm font-medium ${restaurant.isOpen ? "text-emerald-600" : "text-red-500"}`}>
                  {restaurant.isOpen ? "● Nyní otevřeno" : "● Nyní zavřeno"}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.tags.map((tag) => (
                  <span key={tag} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-emerald-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Adresa
                </h3>
                <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                >
                  Otevřít v Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {restaurant.phone && (
                <div className="bg-white rounded-xl border border-emerald-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Kontakt
                  </h3>
                  <a href={`tel:${restaurant.phone}`} className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors">
                    {restaurant.phone}
                  </a>
                </div>
              )}

              {restaurant.hours && (
                <div className="bg-white rounded-xl border border-emerald-100 p-4 sm:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Otevírací doba
                  </h3>
                  <p className="text-sm text-gray-600">{restaurant.hours}</p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden mb-6">
              <div className="p-4 border-b border-emerald-100">
                <h3 className="text-sm font-semibold text-gray-900">Poloha na mapě</h3>
              </div>
              <div className="h-64">
                <MapView
                  onMapReady={(map) => {
                    setMapReady(true);
                    map.setCenter({ lat: restaurant.lat, lng: restaurant.lng });
                    map.setZoom(16);
                    new google.maps.Marker({
                      position: { lat: restaurant.lat, lng: restaurant.lng },
                      map,
                      title: restaurant.name,
                    });
                  }}
                />
              </div>
            </div>

            {/* Reviews placeholder */}
            <div className="bg-white rounded-xl border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Recenze ({restaurant.reviewCount})
              </h3>
              <div className="text-center py-8 text-gray-400">
                <Star className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                <p className="text-sm">Recenze budou brzy dostupné.</p>
                <Button
                  className="mt-4 bg-emerald-700 hover:bg-emerald-600 text-white text-sm"
                  onClick={() => toast.info("Funkce recenzí bude brzy spuštěna!")}
                >
                  Napsat recenzi
                </Button>
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-1">
            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-emerald-100 p-5 mb-4 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Rychlé akce</h3>
              <div className="flex flex-col gap-2">
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`}>
                    <Button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Zavolat
                    </Button>
                  </a>
                )}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <MapPin className="w-4 h-4 mr-2" />
                    Navigovat
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => toast.info("Funkce objednávky bude brzy dostupná!")}
                >
                  Objednat online
                </Button>
              </div>

              {/* Price level */}
              <div className="mt-4 pt-4 border-t border-emerald-100">
                <p className="text-xs text-gray-500 mb-1">Cenová hladina</p>
                <p className="text-sm font-medium text-gray-900">
                  {"Kč".repeat(restaurant.priceLevel)}
                  <span className="text-gray-300">{"Kč".repeat(3 - restaurant.priceLevel)}</span>
                </p>
              </div>
            </div>

            {/* Similar restaurants */}
            <div className="bg-white rounded-xl border border-emerald-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Podobné restaurace</h3>
              <div className="flex flex-col gap-3">
                {restaurants
                  .filter((r) => r.id !== restaurant.id && r.type === restaurant.type)
                  .slice(0, 3)
                  .map((r) => (
                    <Link key={r.id} href={`/restaurace/${r.slug}`}>
                      <div className="flex items-center gap-3 group cursor-pointer">
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                            {r.name}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-500">{r.rating.toFixed(1)} · {r.district}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
