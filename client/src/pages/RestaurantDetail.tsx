// ============================================================
// BEZMASAJIDLA.CZ — Restaurant Detail Page
// "Zelená Metropole" — full profile with map, reviews, info
// ============================================================

import { useParams, Link } from "wouter";
import { MapPin, Phone, Globe, Clock, Star, Crown, ArrowLeft, ExternalLink, Share2, Navigation, Footprints, ShoppingBag, X, ChevronLeft, ChevronRight, Maximize2, Award, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { restaurants, getTypeLabel, getTypeColor, renderStars, type Restaurant } from "@/lib/data";
import { getOpenStatus } from "@/lib/openingHours";
import { MapView } from "@/components/Map";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { RestaurantJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import ReviewSection from "@/components/ReviewSection";
import { getNearestRestaurants, getNearestFastFood } from "@/lib/geo";
import SEOHead from "@/components/SEOHead";
import { getWoltLink } from "@/lib/affiliates";

const RESTAURANT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/restaurant-placeholder-NfsuHQoJhFmyxCXwn7EygE.webp";

function NearbyFastFoodSection({ slug }: { slug: string }) {
  const nearby = useMemo(() => getNearestFastFood(slug, 5), [slug]);

  if (nearby.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-orange-100 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Navigation className="w-4 h-4 text-orange-500" />
        Nejbližší fastfood řetězce
      </h3>
      <div className="flex flex-col gap-3">
        {nearby.map((item) => (
          <Link key={item.restaurant.id} href={`/restaurace/${item.restaurant.slug}`}>
            <div className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-orange-50/50 transition-colors">
              <img
                src={item.restaurant.image}
                alt={item.restaurant.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                  {item.restaurant.name.split(" — ")[0].split(" Praha")[0].trim()}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">{item.restaurant.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-300 mx-0.5">·</span>
                  <span className="text-xs text-gray-500">{item.restaurant.district}</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-xs font-semibold text-orange-600">
                  {item.formattedDistance}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                  <Footprints className="w-3 h-3" />
                  {item.walkingTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NearbyRestaurantsSection({ slug }: { slug: string }) {
  const nearby = useMemo(() => getNearestRestaurants(slug, 5), [slug]);

  if (nearby.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-5">
      <h3
        className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"
      >
        <Navigation className="w-4 h-4 text-emerald-600" />
        Nejbližší restaurace
      </h3>
      <div className="flex flex-col gap-3">
        {nearby.map((item) => (
          <Link key={item.restaurant.id} href={`/restaurace/${item.restaurant.slug}`}>
            <div className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
              <img
                src={item.restaurant.image}
                alt={item.restaurant.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                  {item.restaurant.name}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">{item.restaurant.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-300 mx-0.5">·</span>
                  <span className="text-xs text-gray-500">{item.restaurant.district}</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-xs font-semibold text-emerald-700">
                  {item.formattedDistance}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                  <Footprints className="w-3 h-3" />
                  {item.walkingTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function GalleryLightbox({
  images,
  startIdx,
  restaurantName,
  onClose,
}: {
  images: string[];
  startIdx: number;
  restaurantName: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIdx);

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Zavřít"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
        {idx + 1} / {images.length}
      </div>

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors"
          aria-label="Předchozí foto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main image */}
      <div
        className="max-w-5xl max-h-[85vh] w-full px-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[idx]}
          alt={`${restaurantName} — foto ${idx + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors"
          aria-label="Další foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Thumbnail strip at bottom */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-1"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? "border-white" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={src} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GallerySection({ restaurant, fallbackImg }: { restaurant: Restaurant; fallbackImg: string }) {
  const allImages = [
    restaurant.image || fallbackImg,
    ...(restaurant.gallery || []),
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const openLightbox = (idx: number) => {
    setLightboxStart(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      {lightboxOpen && (
        <GalleryLightbox
          images={allImages}
          startIdx={lightboxStart}
          restaurantName={restaurant.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
      <div className="mb-6">
        {/* Main hero image — clickable to open lightbox */}
        <div
          className="relative rounded-2xl overflow-hidden h-72 mb-2 cursor-zoom-in group"
          onClick={() => openLightbox(activeIdx)}
        >
          <img
            src={allImages[activeIdx]}
            alt={`${restaurant.name} — foto ${activeIdx + 1}`}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Zoom hint overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/40 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4" />
              Zobrazit v celé velikosti
            </div>
          </div>
          {restaurant.isPremium && (
            <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Crown className="w-3.5 h-3.5" />
              Prémiový profil
            </div>
          )}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {activeIdx + 1} / {allImages.length}
            </div>
          )}
        </div>
        {/* Thumbnail strip — only shown when gallery exists */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIdx
                    ? "border-emerald-500 ring-2 ring-emerald-300"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                  onClick={(e) => { e.stopPropagation(); openLightbox(i); }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

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
      <SEOHead
        title={`${restaurant.name} — ${restaurant.type === "vegan" ? "Veganská" : restaurant.type === "vegetarian" ? "Vegetariánská" : "Vegan-friendly"} restaurace v Praze`}
        description={`${restaurant.name} — ${restaurant.description.slice(0, 150)}. Hodnocení ${restaurant.rating.toFixed(1)}/5, ${restaurant.district}.`}
        ogImage={restaurant.image}
        ogType="restaurant"
        ogUrl={`https://www.bezmasajidla.cz/restaurace/${restaurant.slug}`}
      />
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

            {/* Hero image + gallery */}
            <GallerySection restaurant={restaurant} fallbackImg={RESTAURANT_IMG} />

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
                {(() => {
                  const status = getOpenStatus(restaurant.hours || "");
                  return (
                    <span className={`text-sm font-medium ${status.isOpen ? "text-emerald-600" : "text-red-500"}`}>
                      {status.isOpen ? `● ${status.statusText}` : `● ${status.statusText}`}
                    </span>
                  );
                })()}
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

            {/* Social Media Links */}
            {(restaurant.instagramUrl || restaurant.facebookUrl || restaurant.website) && (
              <div className="bg-white rounded-xl border border-emerald-100 p-4 mb-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  Online přítomnost
                </h3>
                <div className="flex flex-wrap gap-3">
                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors"
                    >
                      <Globe className="w-4 h-4 text-gray-500" />
                      Web
                    </a>
                  )}
                  {restaurant.instagramUrl && (
                    <a
                      href={restaurant.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-pink-700 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {restaurant.facebookUrl && (
                    <a
                      href={restaurant.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Fast Food Menu Items */}
            {restaurant.fastFoodItems && restaurant.fastFoodItems.length > 0 && (
              <div className="bg-white rounded-xl border border-orange-100 overflow-hidden mb-6">
                <div className="p-4 border-b border-orange-100 bg-orange-50">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    🍔 Vegetariánské & Veganské položky v menu
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Tyto položky jsou vhodné pro vegetariány a vegany</p>
                </div>
                <div className="divide-y divide-orange-50">
                  {restaurant.fastFoodItems.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-start gap-3 hover:bg-orange-50/30 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ background: item.isVegan ? '#d1fae5' : '#fef3c7' }}>
                        {item.isVegan ? '🌱' : '🥚'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.isVegan
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.isVegan ? 'Veganské' : 'Vegetariánské'}
                          </span>
                          {item.price && (
                            <span className="text-xs font-bold text-orange-600 ml-auto">{item.price}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editorial Review — "Naše hodnocení" */}
            {restaurant.editorialReview && (
              <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden mb-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      Naše hodnocení
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-200">Celkové skóre</span>
                    <span className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {restaurant.editorialReview.score.toFixed(1)}
                    </span>
                    <span className="text-emerald-300 text-sm">/10</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Summary */}
                  <p className="text-gray-700 font-medium italic mb-5 text-base leading-relaxed border-l-4 border-emerald-400 pl-4">
                    „{restaurant.editorialReview.summary}“
                  </p>

                  {/* Score bars */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {([
                      { label: "Kuchyně", key: "food" as const, color: "bg-emerald-500" },
                      { label: "Poměr C/K", key: "value" as const, color: "bg-amber-500" },
                      { label: "Atmosféra", key: "atmosphere" as const, color: "bg-purple-500" },
                      { label: "Obsluha", key: "service" as const, color: "bg-blue-500" },
                    ] as const).map(({ label, key, color }) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">{label}</span>
                          <span className="text-xs font-bold text-gray-800">{restaurant.editorialReview!.scores[key]}/10</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color} transition-all duration-500`}
                            style={{ width: `${restaurant.editorialReview!.scores[key] * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Body text */}
                  <div className="text-gray-600 text-sm leading-relaxed mb-5 space-y-3">
                    {restaurant.editorialReview.body.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Best for + Must order */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Ideální pro</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-snug">{restaurant.editorialReview.bestFor}</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Určitě objednejte</span>
                      </div>
                      <ul className="space-y-1">
                        {restaurant.editorialReview.mustOrder.map((dish, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                            {dish}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Skip */}
                  {restaurant.editorialReview.skip && (
                    <div className="bg-red-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Mějte na paměti</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-snug">{restaurant.editorialReview.skip}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-4 text-right">Hodnocení redakce Bezmasá Jídla</p>
                </div>
              </div>
            )}

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

            {/* Reviews Section — fully functional with database */}
            <ReviewSection
              restaurantSlug={restaurant.slug}
              restaurantName={restaurant.name}
            />
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-1">
            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-emerald-100 p-5 mb-4">
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
                {restaurant.woltUrl ? (
                  <a
                    href={getWoltLink(restaurant.woltUrl)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block"
                  >
                    <Button className="w-full font-semibold text-white" style={{ backgroundColor: '#009DE0' }}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Objednat přes Wolt
                    </Button>
                  </a>
                ) : (
                  <a
                    href={getWoltLink()}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block"
                  >
                    <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Hledat na Woltu
                    </Button>
                  </a>
                )}
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

            {/* Nearest restaurants */}
            <NearbyRestaurantsSection slug={restaurant.slug} />

            {/* Nearest fastfood chains */}
            <NearbyFastFoodSection slug={restaurant.slug} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
