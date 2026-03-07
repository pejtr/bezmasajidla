// ============================================================
// BEZMASAJIDLA.CZ — Homepage
// "Zelená Metropole" — hero, top restaurants, recipes, CTA
// Hero: dark overlay on food image → white text
// ============================================================

import { useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, ChevronRight, Leaf, Star, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import RecipeCard from "@/components/RecipeCard";
import { restaurants, recipes } from "@/lib/data";
import NewsletterBanner from "@/components/NewsletterBanner";
import { WebsiteJsonLd } from "@/components/JsonLd";
import SEOHead from "@/components/SEOHead";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/hero-bg-8DsoJ9QpVxJTndww9Yv7SZ.webp";
const MAP_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/map-section-bg-Xt3deu7E3AeXh6WhYnAxDq.webp";

const stats = [
  { value: "150+", label: "Restaurací v Praze" },
  { value: "2,400+", label: "Uživatelských recenzí" },
  { value: "80+", label: "Ověřených receptů" },
  { value: "100%", label: "Bezmasé možnosti" },
];

const categories = [
  { label: "Veganské", icon: "🌱", href: "/restaurace?type=vegan", color: "bg-emerald-700 hover:bg-emerald-600" },
  { label: "Vegetariánské", icon: "🥦", href: "/restaurace?type=vegetarian", color: "bg-emerald-500 hover:bg-emerald-400" },
  { label: "Vegan-friendly", icon: "🌿", href: "/restaurace?type=friendly", color: "bg-teal-600 hover:bg-teal-500" },
  { label: "Recepty", icon: "📖", href: "/recepty", color: "bg-amber-500 hover:bg-amber-400" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  // Curated top restaurants: sort by popularity score (rating × reviewCount), show top 6
  const topRestaurants = [...restaurants]
    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    .slice(0, 6);
  const featuredRecipes = recipes.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/restaurace?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Bezmasá Jídla — Veganské a Vegetariánské Restaurace v Praze"
        description="Největší český průvodce veganskými a vegetariánskými restauracemi v Praze. Najdi nejlepší bezmasá jídla, přečti recenze a objevuj nové recepty."
        ogUrl="https://www.bezmasajidla.cz/"
      />
      <WebsiteJsonLd />
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-transparent" />

        <div className="relative container py-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Praha
              </span>
              <span className="text-emerald-200 text-sm">Průvodce bezmasou Prahou</span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Najdi nejlepší
              <br />
              <span className="text-amber-400">bezmasá jídla</span>
              <br />
              v Praze
            </h1>

            <p className="text-emerald-100 text-lg mb-8 leading-relaxed max-w-lg">
              Největší český adresář veganských a vegetariánských restaurací. Recenze, mapy, recepty — vše na jednom místě.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Hledat restauraci nebo recept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white text-gray-900 placeholder-gray-400 shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <Button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-6 py-3 rounded-xl shadow-lg"
              >
                Hledat
              </Button>
            </form>

            {/* Quick links */}
            <div className="flex items-center gap-2 mt-4 text-sm text-emerald-200">
              <span>Populární:</span>
              {["Vinohrady", "Žižkov", "Malá Strana", "Holešovice"].map((d) => (
                <Link
                  key={d}
                  href={`/restaurace?district=${d}`}
                  className="text-amber-300 hover:text-amber-200 underline underline-offset-2 transition-colors"
                >
                  {d}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-emerald-800 py-5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {s.value}
                </div>
                <div className="text-xs text-emerald-200 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-12 container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href}>
              <div className={`${cat.color} text-white rounded-xl p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm">{cat.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TOP RESTAURANTS ── */}
      <section className="py-8 container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Nejlépe hodnocené</span>
            </div>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Top restaurace v Praze
            </h2>
          </div>
          <Link href="/restaurace">
            <Button variant="outline" className="hidden sm:flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Zobrazit vše <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {topRestaurants.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} rank={i + 1} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/restaurace">
            <Button className="bg-emerald-700 hover:bg-emerald-600 text-white px-8">
              Zobrazit všechny restaurace
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── MAP CTA ── */}
      <section className="my-8 mx-4 md:mx-8 rounded-2xl overflow-hidden relative min-h-[200px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${MAP_BG})` }}
        />
        <div className="absolute inset-0 bg-emerald-900/60" />
        <div className="relative container py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Prozkoumej Prahu na mapě
            </h2>
            <p className="text-emerald-100 text-sm">
              Najdi veganské restaurace v okolí pomocí interaktivní mapy.
            </p>
          </div>
          <Link href="/mapa">
            <Button className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-8 py-3 rounded-xl shadow-lg whitespace-nowrap">
              <MapPin className="w-4 h-4 mr-2" />
              Otevřít mapu
            </Button>
          </Link>
        </div>
      </section>

      {/* ── RECIPES ── */}
      <section className="py-8 container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Inspirace do kuchyně</span>
            </div>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Oblíbené recepty
            </h2>
          </div>
          <Link href="/recepty">
            <Button variant="outline" className="hidden sm:flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Všechny recepty <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      {/* ── PREMIUM CTA ── */}
      <section className="py-12 container">
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-8 md:p-12 text-center">
          <Leaf className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Vlastníte restauraci?
          </h2>
          <p className="text-emerald-200 mb-6 max-w-lg mx-auto">
            Přidejte svůj podnik do největšího českého adresáře bezmasých restaurací. Základní profil je zdarma. Prémiový profil za 490 Kč/měsíc.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-8">
              Přidat restauraci zdarma
            </Button>
            <Button variant="outline" className="border-emerald-500 text-emerald-200 hover:bg-emerald-800">
              Zjistit více o prémiu
            </Button>
          </div>
        </div>
      </section>

      <NewsletterBanner />
      <Footer />
    </div>
  );
}
