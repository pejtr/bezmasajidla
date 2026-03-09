// ============================================================
// BEZMASAJIDLA.CZ — Průvodci (Guides) Listing Page
// SEO-optimized educational articles about vegan Prague
// ============================================================

import { useState } from "react";
import { Link } from "wouter";
import { BookOpen, Clock, ArrowRight, ChevronRight, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guides, guideCategories, type Guide } from "@/lib/guides";
import { WebsiteJsonLd } from "@/components/JsonLd";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/guides-hero-prague-vegan-3nubnT5HHdRNasnpPsFKuh.webp";

function GuideCard({ guide, featured = false }: { guide: Guide; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/pruvodci/${guide.slug}`}>
        <article className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative h-72 overflow-hidden">
            <img
              src={guide.thumbnailImage || guide.heroImage}
              alt={guide.heroImageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Doporučujeme
              </span>
              <span className="bg-emerald-700/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {guide.categoryLabel}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2
                className="text-xl font-bold text-white mb-1 leading-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {guide.title}
              </h2>
              <p className="text-white/80 text-sm line-clamp-2">{guide.subtitle}</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {guide.readingTime} min čtení
              </span>
              <span>·</span>
              <span>{guide.author}</span>
            </div>
            <span className="text-emerald-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Číst <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/pruvodci/${guide.slug}`}>
      <article className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={guide.thumbnailImage || guide.heroImage}
            alt={guide.heroImageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {guide.categoryLabel}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {guide.title}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-2">{guide.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{guide.readingTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Guides() {
  const [activeCategory, setActiveCategory] = useState("vse");

  const filteredGuides =
    activeCategory === "vse"
      ? guides
      : guides.filter((g) => g.category === activeCategory);

  const featuredGuide = guides.find((g) => g.featured);
  const otherGuides = filteredGuides.filter((g) => !g.featured || activeCategory !== "vse");

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <WebsiteJsonLd />
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-[340px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/60 to-transparent" />
        <div className="relative container py-16">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-emerald-300 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Domů
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Průvodci</span>
            </nav>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">
                Edukační průvodci
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Průvodci veganskou Prahou
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-xl">
              Hloubkové články o veganské gastronomii, pražských čtvrtích, sezonní kuchyni a
              zdravém životním stylu. Psáno s láskou k jídlu.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-emerald-800 py-3">
        <div className="container">
          <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-200">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <strong className="text-white">{guides.length}</strong> průvodců
            </span>
            <span>·</span>
            <span>
              Průměrně <strong className="text-white">10 min</strong> čtení
            </span>
            <span>·</span>
            <span>Aktualizováno <strong className="text-white">2026</strong></span>
          </div>
        </div>
      </section>

      <div className="container py-10">
        {/* ── CATEGORY FILTER ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {guideCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── FEATURED GUIDE ── */}
        {activeCategory === "vse" && featuredGuide && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                Doporučený průvodce
              </span>
            </div>
            <div className="max-w-2xl">
              <GuideCard guide={featuredGuide} featured />
            </div>
          </div>
        )}

        {/* ── ALL GUIDES ── */}
        {otherGuides.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                {activeCategory === "vse" ? "Všechny průvodce" : filteredGuides[0]?.categoryLabel}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>
        ) : activeCategory !== "vse" ? (
          <div className="text-center py-16 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium text-gray-500">Průvodci v této kategorii brzy přibudou</p>
            <p className="text-sm mt-1">Pracujeme na dalším obsahu — sledujte nás!</p>
          </div>
        ) : null}

        {/* ── CTA — SUGGEST GUIDE ── */}
        <div className="mt-12 bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-8 text-center">
          <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Máte tip na průvodce?
          </h2>
          <p className="text-emerald-200 text-sm mb-4 max-w-md mx-auto">
            Chybí vám průvodce na konkrétní téma? Napište nám — rádi ho napíšeme pro vás.
          </p>
          <Link href="/o-nas">
            <button className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-6 py-2.5 rounded-xl transition-colors">
              Kontaktujte nás
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
