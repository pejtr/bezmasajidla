import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Search, MapPin, ChevronRight, Leaf, TrendingUp, BookOpen, ArrowRight, Utensils, Clock } from "lucide-react";
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

const HERO_POSTER = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1920&q=80";
const HERO_VIDEO = "https://cdn.coverr.co/videos/coverr-preparing-a-salad-5437/1080p.mp4";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const latestRecipes = [...recipes].slice(0, 3);
  const czechClassics = [...recipes]
    .filter(
      (r) =>
        r.editorialCollections?.includes("czech-classics") ||
        r.cuisine?.toLowerCase().includes("česká")
    )
    .slice(0, 3);
  const veganRecipes = [...recipes].filter((r) => r.isVegan).slice(0, 3);
  const quickDinners = [...recipes].filter((r) => r.prepTime + r.cookTime <= 30).slice(0, 3);

  const vegetarianRestaurants = [...restaurants].filter((r) => r.type === "vegetarian").slice(0, 3);
  const veganRestaurants = [...restaurants].filter((r) => r.type === "vegan").slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recepty?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Graceful autoplay fallback if browser blocks video playback
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Bezmasá jídla, bezmasé a vegetariánské recepty | Bezmasajidla.cz"
        description="Největší průvodce pro bezmasé jídlo. Objevte jednoduché bezmasé a vegetariánské recepty, veganské jídlo, obědy bez masa a tipy na restaurace."
        ogUrl="https://www.bezmasajidla.cz/"
      />
      <WebsiteJsonLd />
      <Header />

      {/* ── HERO WITH CINEMATIC VIDEO BACKGROUND (MOBILE & MOTION OPTIMIZED) ── */}
      <section className="relative min-h-[620px] flex items-center overflow-hidden bg-emerald-950">
        {/* Mobile & Motion-Reduce Static Poster Image (0 MB Video Download on Mobile) */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-75 scale-105 md:hidden motion-reduce:block"
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
        />

        {/* Desktop HTML5 Video Loop (Hidden on Mobile & Reduced Motion) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
          className="hidden md:block absolute inset-0 w-full h-full object-cover filter brightness-75 scale-105 motion-reduce:hidden"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        {/* Dark Gradient Overlay for Maximum Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/75 to-emerald-900/40 backdrop-blur-[1px]" />

        <div className="relative container py-20 z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 backdrop-blur border border-emerald-500/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <span>🌿 CRAVE × ABUNDANCE × CRAFT</span>
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Bezmasá jídla:{" "}
              <span className="text-amber-400 italic">recepty a restaurace</span>{" "}
              bez masa
            </h1>

            <p className="text-emerald-100 text-lg leading-relaxed max-w-lg font-light">
              Český průvodce pro každé bezmasé jídlo. Objevte ověřené restaurace, syté domácí recepty i poctivý chef catering od Matouše.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg pt-2">
              <Link href="/recepty">
                <Button className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-8 py-6 rounded-xl shadow-lg text-lg flex items-center justify-center transition transform hover:-translate-y-0.5">
                  <Utensils className="w-5 h-5 mr-2" />
                  Najít recept na dnes
                </Button>
              </Link>
              <Link href="/restaurace">
                <Button variant="outline" className="w-full sm:w-auto border-emerald-400/30 bg-emerald-800/40 backdrop-blur text-white hover:bg-emerald-700/60 font-bold px-8 py-6 rounded-xl shadow-lg text-lg flex items-center justify-center transition">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-300" />
                  Mapa restaurací
                </Button>
              </Link>
            </div>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 max-w-lg relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700/50" />
                <input
                  type="text"
                  placeholder="Nebo zadejte na co máte chuť (např. kulajda)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-emerald-700/20 bg-white/95 backdrop-blur text-gray-900 placeholder-gray-500 shadow-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <span className="font-semibold text-emerald-400">Nejhledanější:</span>
                <Link href="/recepty?q=kulajda">
                  <span className="bg-emerald-900/60 hover:bg-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-700/50 transition cursor-pointer">Kulajda</span>
                </Link>
                <Link href="/recepty?q=svíčková">
                  <span className="bg-emerald-900/60 hover:bg-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-700/50 transition cursor-pointer">Svíčková</span>
                </Link>
                <Link href="/restaurace?q=indie">
                  <span className="bg-emerald-900/60 hover:bg-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-700/50 transition cursor-pointer">Indický bufet</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── TRUST & STATS PILLARS ── */}
      <section className="bg-white border-b border-emerald-100 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shadow-sm">
                🏛️
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>150+ Podniků v Praze</div>
                <div className="text-xs text-gray-500 font-medium">Filtrovatelný průvodce s hodnocením</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shadow-sm">
                🍳
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>100+ Receptů bez masa</div>
                <div className="text-xs text-gray-500 font-medium">Poctivé obědy & česká klasika</div>
              </div>
            </div>

            <Link href="/catering">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-sm hover:border-amber-400 transition cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xl shadow-sm">
                  🌿
                </div>
                <div>
                  <div className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    Chef Catering
                    <span className="text-[10px] uppercase font-extrabold bg-amber-400 text-amber-950 px-2 py-0.5 rounded">Matouš</span>
                  </div>
                  <div className="text-xs text-emerald-200 font-medium">Firemní akce & oslavy od 15 osob</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 1. Nejnovější recepty bez masa ── */}
      <section className="py-16 container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Nejnovější recepty bez masa
            </h2>
            <p className="text-gray-500">Čerstvá inspirace pro vaše každodenní vaření</p>
          </div>
          <Link href="/recepty">
            <Button variant="ghost" className="hidden sm:flex text-emerald-700 hover:bg-emerald-50">
              Všechny recepty <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>

      {/* ── 2. Česká klasika bez masa ── */}
      <section className="py-16 bg-emerald-50/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Česká klasika bez masa
              </h2>
              <p className="text-gray-500">Tradiční české omáčky a jídla ve veganské a vegetariánské verzi</p>
            </div>
            <Link href="/recepty/ceska-klasika-bez-masa">
              <Button variant="ghost" className="hidden sm:flex text-emerald-700 hover:bg-emerald-50">
                Celá česká klasika <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {czechClassics.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </div>
      </section>

      {/* ── 3. Veganské recepty ── */}
      <section className="py-16 container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Veganské recepty
            </h2>
            <p className="text-gray-500">100% rostlinná jídla plná chuti a živin</p>
          </div>
          <Link href="/recepty?type=vegan">
            <Button variant="ghost" className="hidden sm:flex text-emerald-700 hover:bg-emerald-50">
              Více veganských receptů <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {veganRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>

      {/* ── 4. & 5. Restaurace v Praze (Veg & Vegan) ── */}
      <section className="py-16 bg-emerald-900 text-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Leaf className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Průvodce restauracemi v Praze
            </h2>
            <p className="text-emerald-200">
              Objevte nejlépe hodnocené podniky, kde se najíte bezvadně a bez masa. Od rychlého bistra po večerní posezení.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Vegetariánské */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-50" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Vegetariánské restaurace
                </h3>
                <Link href="/restaurace/vegetarianske-restaurace-praha">
                  <span className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center">
                    Zobrazit všechny <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {vegetarianRestaurants.map((r, i) => (
                  <RestaurantCard key={r.id} restaurant={r} rank={i + 1} />
                ))}
              </div>
            </div>

            {/* Veganské */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-50" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Veganské restaurace
                </h3>
                <Link href="/restaurace/veganske-restaurace-praha">
                  <span className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center">
                    Zobrazit všechny <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {veganRestaurants.map((r, i) => (
                  <RestaurantCard key={r.id} restaurant={r} rank={i + 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Rychlá večeře bez masa ── */}
      <section className="py-16 container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Jednoduchý oběd bez masa
              </h2>
            </div>
            <p className="text-gray-500">Skvělé jídlo připravené do 30 minut</p>
          </div>
          <Link href="/recepty?q=večeře">
            <Button variant="ghost" className="hidden sm:flex text-emerald-700 hover:bg-emerald-50">
              Všechny rychlovky <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickDinners.map((r) => <RecipeCard key={r.id} recipe={r} />)}
      {/* ── CATERING BRAND SECTION (MATOUŠ × BEZMASÁJÍDLA) ── */}
      <section className="py-12 container">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-8 md:p-12 border border-emerald-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              🌿 MATOUŠ × BEZMASÁJÍDLA.CZ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Plánujete firemní akci nebo oslavu bez masa?
            </h2>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Prémiový bezmasý fingerfood, rauty a fine-dining menu od šéfkuchaře Matouše pro 15 až 200+ hostů. Spočítejte si nezávaznou kalkulaci během 1 minuty.
            </p>
          </div>

          <Link href="/catering">
            <Button className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-base px-7 py-6 rounded-xl shadow-xl transition transform hover:-translate-y-0.5 whitespace-nowrap">
              Spočítat kalkulaci cateringu →
            </Button>
          </Link>
        </div>
      </section>

      {/* ── 7. Nejčtenější články ── */}
      <section className="py-16 bg-emerald-50/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Nejčtenější články z blogu
              </h2>
              <p className="text-gray-500">Tipy, návody a nápady pro bezmasý životní styl</p>
            </div>
            <Link href="/blog">
              <Button variant="ghost" className="hidden sm:flex text-emerald-700 hover:bg-emerald-50">
                Všechny články <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="group bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="relative overflow-hidden h-48 flex-shrink-0">
                    <img
                      src={post.coverImage}
                      alt={post.coverImageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-xs font-bold text-emerald-800 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors leading-snug"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-emerald-50 text-xs font-medium text-gray-400">
                      <span>{new Date(post.publishedAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{post.readingTimeMin} min čtení</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Newsletter ── */}
      <NewsletterBanner />

      <Footer />
    </div>
  );
}
