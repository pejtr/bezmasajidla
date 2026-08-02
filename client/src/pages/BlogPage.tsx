// ============================================================
// BEZMASAJIDLA.CZ — BlogPage
// "Zelená Metropole" — výpis blogových článků
// ============================================================

import { Link } from "wouter";
import { Calendar, Clock, Tag, ArrowRight, BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { blogPosts } from "@/lib/blogData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const categories = useMemo(
    () => ["Vše", ...Array.from(new Set(blogPosts.map(post => post.category)))],
    []
  );
  const [activeCategory, setActiveCategory] = useState("Vše");
  const visiblePosts =
    activeCategory === "Vše"
      ? blogPosts
      : blogPosts.filter(post => post.category === activeCategory);
  const featured = visiblePosts[0];
  const rest = visiblePosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Blog — Bezmasé jídlo doma i na cestách | Bezmasájídla.cz"
        description="Recepty, restaurace a ověřené průvodce bezmasým jídlem v Česku i Evropě. Nově Budapešť, příště Krakov, Varšava, Itálie a Francie."
        canonicalUrl="https://www.bezmasajidla.cz/blog"
      />
      <Header />

      {/* ── PAGE HEADER ── */}
      <section className="bg-emerald-800 py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">
              Blog
            </span>
          </div>
          <h1
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Bezmasé jídlo doma i na cestách
          </h1>
          <p className="text-emerald-200 max-w-xl">
            Ověřené restaurace, ceny a praktické tipy z Česka i evropských měst.
            Začínáme Budapeští, pokračovat budeme Krakovem a Varšavou.
          </p>
        </div>
      </section>

      <main className="flex-1 container py-10">
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-8"
          aria-label="Kategorie článků"
        >
          {categories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ── FEATURED ARTICLE ── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`}>
            <div className="group bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md transition-shadow mb-10 cursor-pointer">
              <div className="flex flex-col md:flex-row">
                {/* Cover image */}
                <div className="relative md:w-2/5 flex-shrink-0 overflow-hidden">
                  <img
                    src={featured.coverImage}
                    alt={featured.coverImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Doporučujeme
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {featured.category}
                      </span>
                    </div>
                    <h3
                      className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors leading-snug"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {featured.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(featured.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.readingTimeMin} min čtení
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-emerald-700 text-sm font-medium group-hover:gap-2 transition-all">
                      Číst článek <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── ARTICLE GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {rest.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="group bg-white rounded-xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                {/* Cover image */}
                <div className="relative overflow-hidden h-44 flex-shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-xs font-semibold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3
                    className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-emerald-50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTimeMin} min
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
