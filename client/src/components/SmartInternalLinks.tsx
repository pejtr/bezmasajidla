import { Link } from "wouter";
import { recipes } from "@/lib/data";
import { blogPosts } from "@/lib/blogData";
import { ArrowRight, BookOpen, Utensils, Sparkles } from "lucide-react";

interface SmartInternalLinksProps {
  currentSlug: string;
  category?: string;
  tags?: string[];
  type: "recipe" | "blog" | "restaurant";
}

export default function SmartInternalLinks({
  currentSlug,
  category,
  tags = [],
  type,
}: SmartInternalLinksProps) {
  // Find related recipes
  const relatedRecipes = recipes
    .filter(
      r =>
        r.slug !== currentSlug &&
        (r.category === category || r.tags.some(t => tags.includes(t)))
    )
    .slice(0, 2);

  // Find related blog posts
  const relatedBlogs = blogPosts
    .filter(
      b =>
        b.slug !== currentSlug &&
        (b.category === category || b.tags.some(t => tags.includes(t)))
    )
    .slice(0, 2);

  if (relatedRecipes.length === 0 && relatedBlogs.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-700" />
        <h3 className="text-lg font-bold text-emerald-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Mohlo by vás také zajímat
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedRecipes.map(r => (
          <Link key={r.id} href={`/recepty/${r.slug}`}>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer flex items-center gap-3">
              <img
                src={r.image}
                alt={r.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase text-emerald-700 tracking-wider flex items-center gap-1">
                  <Utensils className="w-3 h-3" /> Recept
                </span>
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {r.title}
                </h4>
                <p className="text-xs text-gray-500 truncate">{r.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            </div>
          </Link>
        ))}

        {relatedBlogs.map(b => (
          <Link key={b.id} href={`/blog/${b.slug}`}>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer flex items-center gap-3">
              <img
                src={b.coverImage}
                alt={b.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase text-emerald-700 tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Článek
                </span>
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {b.title}
                </h4>
                <p className="text-xs text-gray-500 truncate">{b.excerpt}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
