// ============================================================
// BEZMASAJIDLA.CZ — Guide Detail Page
// Full article with ToC, rich sections, related restaurants
// ============================================================

import { useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import {
  Clock,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Share2,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guides } from "@/lib/guides";
import { restaurants } from "@/lib/data";
import NotFound from "./NotFound";

// Simple markdown-like renderer for bold text and line breaks
function RichText({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed">
      {lines.map((line, i) => {
        if (line.trim() === "") return <br key={i} />;
        // Handle **bold** text
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="mb-3">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-gray-900">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

function RelatedRestaurantCard({ slug }: { slug: string }) {
  const restaurant = restaurants.find((r) => r.slug === slug);
  if (!restaurant) return null;
  return (
    <Link href={`/restaurace/${restaurant.slug}`}>
      <div className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer group">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {restaurant.name}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">{restaurant.address}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-500 text-xs">★</span>
            <span className="text-xs font-medium text-gray-700">{restaurant.rating}</span>
            <span className="text-xs text-gray-400">({restaurant.reviewCount})</span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guides.find((g) => g.slug === slug);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!guide) return <NotFound />;

  const allRelatedSlugs = guide.sections
    .flatMap((s) => s.restaurantSlugs || [])
    .filter((v, i, a) => a.indexOf(v) === i);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-[420px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${guide.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative container pb-10 pt-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Domů
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/pruvodci" className="hover:text-white transition-colors">
              Průvodci
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80 line-clamp-1">{guide.title}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {guide.categoryLabel}
            </span>
            {guide.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 max-w-3xl"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {guide.title}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-4">{guide.subtitle}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {guide.readingTime} min čtení
            </span>
            <span>·</span>
            <span>{guide.author}</span>
            <span>·</span>
            <span>
              Aktualizováno{" "}
              {new Date(guide.updatedAt).toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <article ref={articleRef} className="lg:col-span-2">
            {/* Description lead */}
            <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-5 mb-8">
              <p className="text-emerald-800 font-medium leading-relaxed">{guide.description}</p>
            </div>

            {/* Sections */}
            {guide.sections.map((section, idx) => (
              <section key={section.id} id={section.id} className="mb-10 scroll-mt-20">
                <h2
                  className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  {section.title}
                </h2>

                {section.image && (
                  <div className="rounded-xl overflow-hidden mb-5 aspect-video">
                    <img
                      src={section.image}
                      alt={section.imageAlt || section.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <RichText content={section.content} />

                {/* Related restaurants for this section */}
                {section.restaurantSlugs && section.restaurantSlugs.length > 0 && (
                  <div className="mt-5 p-4 bg-white rounded-xl border border-emerald-100">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">
                      Doporučené restaurace v této čtvrti
                    </p>
                    <div className="flex flex-col gap-2">
                      {section.restaurantSlugs.map((s) => (
                        <RelatedRestaurantCard key={s} slug={s} />
                      ))}
                    </div>
                  </div>
                )}

                {idx < guide.sections.length - 1 && (
                  <hr className="border-gray-100 mt-8" />
                )}
              </section>
            ))}

            {/* Share */}
            <div className="mt-8 p-5 bg-white rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Líbil se vám tento průvodce?</p>
                <p className="text-gray-500 text-xs mt-0.5">Sdílejte ho s přáteli</p>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Sdílet
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 sticky top-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">
                Obsah článku
              </p>
              <nav className="flex flex-col gap-1">
                {guide.sections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700 py-1.5 px-2 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="line-clamp-2">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* All related restaurants */}
            {allRelatedSlugs.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">
                  Zmíněné restaurace
                </p>
                <div className="flex flex-col gap-2">
                  {allRelatedSlugs.map((s) => (
                    <RelatedRestaurantCard key={s} slug={s} />
                  ))}
                </div>
              </div>
            )}

            {/* Back to guides */}
            <Link href="/pruvodci">
              <div className="bg-emerald-700 hover:bg-emerald-600 rounded-xl p-5 cursor-pointer transition-colors group">
                <p className="text-white font-semibold text-sm mb-1">Další průvodci</p>
                <p className="text-emerald-200 text-xs mb-3">
                  Prozkoumejte naše edukační články o veganské Praze
                </p>
                <span className="flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Zobrazit všechny <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
