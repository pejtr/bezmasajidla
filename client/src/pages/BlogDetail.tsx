// ============================================================
// BEZMASAJIDLA.CZ — BlogDetail
// "Zelená Metropole" — detail blogového článku s markdown obsahem
// ============================================================

import { Link, useParams } from "wouter";
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { getBlogPostBySlug, blogPosts } from "@/lib/blogData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Streamdown } from "streamdown";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || "");

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Článek nenalezen</h1>
            <p className="text-gray-500 mb-6">Tento článek neexistuje nebo byl přesunut.</p>
            <Link href="/blog">
              <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Zpět na blog
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Find prev/next articles
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Related posts: same category, excluding current
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);
  const otherPosts = relatedPosts.length > 0
    ? relatedPosts
    : blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title={`${post.title} | Blog — Bezmasájídla.cz`}
        description={post.metaDescription}
        canonicalUrl={`https://bezmasajidla.cz/blog/${post.slug}`}
      />
      <Header />

      {/* ── HERO ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.coverImageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/40 to-transparent" />
        <div className="relative container h-full flex flex-col justify-end pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-emerald-200 truncate max-w-[200px]">{post.title}</span>
          </nav>
          <span className="text-xs font-semibold text-amber-400 bg-amber-400/20 px-2.5 py-1 rounded-full w-fit mb-2">
            {post.category}
          </span>
          <h1
            className="text-2xl md:text-3xl font-bold text-white leading-snug max-w-3xl"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-emerald-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              {post.readingTimeMin} min čtení
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              {post.author}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
            {post.excerpt}
          </p>

          {/* Article body — rendered markdown */}
          <div className="prose prose-emerald prose-sm sm:prose max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-800
            prose-table:border-collapse prose-th:bg-emerald-50 prose-th:text-emerald-800 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-emerald-100
            prose-li:text-gray-600
          ">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* ── PREV / NEXT NAVIGATION ── */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-emerald-100">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="flex-1">
                <div className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer">
                  <ArrowLeft className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Předchozí článek</p>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {prevPost.title}
                    </p>
                  </div>
                </div>
              </Link>
            ) : <div className="flex-1" />}
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="flex-1">
                <div className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer text-right sm:flex-row-reverse">
                  <ArrowRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Další článek</p>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {nextPost.title}
                    </p>
                  </div>
                </div>
              </Link>
            ) : <div className="flex-1" />}
          </div>

          {/* ── RELATED ARTICLES ── */}
          {otherPosts.length > 0 && (
            <div className="mt-10">
              <h3
                className="text-xl font-bold text-gray-900 mb-5"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Další články
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherPosts.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <div className="group bg-white rounded-xl overflow-hidden border border-emerald-100 hover:shadow-sm transition-shadow cursor-pointer flex gap-3 p-3">
                      <img
                        src={related.coverImage}
                        alt={related.coverImageAlt}
                        loading="lazy"
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs text-emerald-600 font-medium">{related.category}</span>
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mt-0.5">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(related.publishedAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── BACK TO BLOG ── */}
          <div className="mt-8 text-center">
            <Link href="/blog">
              <button className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-600 font-medium text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Zpět na všechny články
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
