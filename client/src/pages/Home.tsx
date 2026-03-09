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
import { blogPosts } from "@/lib/blogData";
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
  // Curated top restaurants: vegan, vegetarian and vegan-friendly (exclude fast food), sort by popularity score (rating × reviewCount), show top 6
  const topRestaurants = [...restaurants]
    .filter(r => r.type === "vegan" || r.type === "vegetarian" || r.type === "friendly")
    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    .slice(0, 6);
  const featuredRecipes = recipes.slice(0, 6);
  const fastFoodChains = restaurants.filter(r => r.type === "fastfood");

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

      {/* ── RESTAURACE TÝDNE ── */}
      {(() => {
        // Pick the restaurant with the highest editorial score
        const restaurantOfWeek = [...restaurants]
          .filter(r => r.editorialReview)
          .sort((a, b) => (b.editorialReview!.score - a.editorialReview!.score))[0];
        if (!restaurantOfWeek || !restaurantOfWeek.editorialReview) return null;
        const rev = restaurantOfWeek.editorialReview;
        return (
          <section className="py-6 container">
            <Link href={`/restaurace/${restaurantOfWeek.slug}`}>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${restaurantOfWeek.image})` }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-transparent" />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 sm:p-8">
                  {/* Left: badge + content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        ★ Restaurace týdne
                      </span>
                      <span className="text-emerald-300 text-xs">
                        {restaurantOfWeek.type === 'vegan' ? 'Veganská' : restaurantOfWeek.type === 'vegetarian' ? 'Vegetariánská' : 'Vegan-friendly'}
                      </span>
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {restaurantOfWeek.name}
                    </h2>
                    <p className="text-emerald-200 text-sm mb-3 max-w-lg leading-relaxed">
                      &ldquo;{rev.summary}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 text-xs text-emerald-300">
                      <span>{restaurantOfWeek.address}</span>
                      <span>·</span>
                      <span>{restaurantOfWeek.hours}</span>
                    </div>
                  </div>

                  {/* Right: score badge */}
                  <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center min-w-[80px]">
                    <div
                      className="text-4xl font-bold text-amber-400"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {rev.score.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-emerald-300 uppercase tracking-wider mt-1">Naše skore</div>
                    <div className="flex justify-center gap-0.5 mt-2">
                      {[1,2,3,4,5].map(i => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i <= Math.round(rev.score / 2) ? 'text-amber-400 fill-amber-400' : 'text-emerald-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Must-order pills */}
                <div className="relative px-6 sm:px-8 pb-5 flex flex-wrap gap-2">
                  <span className="text-xs text-emerald-400 font-medium mr-1">Určitě objednejte:</span>
                  {rev.mustOrder.slice(0, 3).map(item => (
                    <span key={item} className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-full border border-white/20">
                      {item}
                    </span>
                  ))}
                  <span className="text-xs text-emerald-300 self-center ml-auto flex items-center gap-1">
                    Zobrazit recenzi <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        );
      })()}

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

      {/* ── FAST FOOD ── */}
      <section className="py-8 container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🍔</span>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Fast Food</span>
            </div>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Fastfood řetězce
            </h2>
            <p className="text-sm text-gray-500 mt-1">Co si dát v běžných řetězcích, když nechcete maso</p>
          </div>
          <Link href="/restaurace?type=fastfood">
            <Button variant="outline" className="hidden sm:flex items-center gap-1 border-orange-200 text-orange-700 hover:bg-orange-50">
              Všechny řetězce <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fastFoodChains.map((chain) => (
            <Link key={chain.id} href={`/restaurace/${chain.slug}`}>
              <div className="bg-white rounded-xl border border-orange-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                {/* Header strip with logo */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {chain.image && (
                      <div className="w-12 h-12 rounded-lg bg-white flex-shrink-0 overflow-hidden flex items-center justify-center p-1 shadow-sm">
                        <img src={chain.image} alt={chain.name} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span className="text-white font-bold text-sm truncate">{chain.name}</span>
                  </div>
                  <span className="text-orange-100 text-xs flex-shrink-0">{chain.priceLevel === 1 ? "Kč" : chain.priceLevel === 2 ? "KčKč" : "KčKčKč"}</span>
                </div>
                {/* Menu items */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{chain.description}</p>
                  <div className="flex flex-col gap-2">
                    {(chain.fastFoodItems || []).slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {item.image ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="text-xs flex-shrink-0 w-9 text-center">{item.isVegan ? '🌱' : '🥚'}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-800">{item.name}</span>
                          {item.price && <span className="text-xs text-orange-600 font-bold ml-2">{item.price}</span>}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          item.isVegan ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.isVegan ? 'V' : 'VG'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-orange-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{chain.hours}</span>
                    <span className="text-xs text-orange-600 font-medium hover:text-orange-800">Detail →</span>
                  </div>
                </div>
              </div>
            </Link>
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

      {/* ── BLOG SEKCE ── */}
      <section className="py-10 container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Blog</span>
            </div>
            <h2
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Průvodce veganskou Prahou
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="hidden sm:flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Všechny články <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="group bg-white rounded-xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative overflow-hidden h-40 flex-shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 text-xs font-semibold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-50 text-xs text-gray-400">
                    <span>{new Date(post.publishedAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="text-emerald-600 font-medium">{post.readingTimeMin} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 text-center sm:hidden">
          <Link href="/blog">
            <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Všechny články <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      <NewsletterBanner />
      <Footer />
    </div>
  );
}
