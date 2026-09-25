import { Link } from "wouter";
import { recipes, restaurants, type Restaurant } from "@/lib/data";
import { blogPosts } from "@/lib/blogData";
import { ArrowRight, BookOpen, Utensils, Sparkles, MapPin, Star, Building2 } from "lucide-react";

interface SmartInternalLinksProps {
  currentSlug: string;
  category?: string;
  tags?: string[];
  type: "recipe" | "blog" | "restaurant";
  content?: string;
}

export default function SmartInternalLinks({
  currentSlug,
  category,
  tags = [],
  type,
  content,
}: SmartInternalLinksProps) {
  // Find mentioned or related restaurants for blog articles
  let mentionedRestaurants: Restaurant[] = [];

  if (type === "blog") {
    if (content) {
      // Find restaurants directly linked or mentioned in article markdown
      mentionedRestaurants = restaurants.filter(r => {
        const slugMentioned = content.includes(`/restaurace/${r.slug}`);
        const baseName = r.name.split("—")[0].split("(")[0].trim().toLowerCase();
        return (
          slugMentioned ||
          (baseName.length >= 4 && content.toLowerCase().includes(baseName))
        );
      }).slice(0, 4);
    }

    // If fewer than 2 detected and it's a food / restaurant guide, recommend top-rated Prague spots
    if (
      mentionedRestaurants.length < 2 &&
      (category === "Průvodce" ||
        category === "Tipy" ||
        category === "Fast Food" ||
        category === "Brunch" ||
        category === "Česká kuchyně" ||
        tags.some(t => ["Praha", "restaurace", "vegan", "vegetarián"].includes(t)))
    ) {
      const fallback = restaurants
        .filter(r => r.rating >= 4.7 && (r.isPremium || r.reviewCount > 150))
        .slice(0, 4);
      mentionedRestaurants = Array.from(new Set([...mentionedRestaurants, ...fallback])).slice(0, 4);
    }
  }

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

  const hasRestaurants = mentionedRestaurants.length > 0;
  const hasRelated = relatedRecipes.length > 0 || relatedBlogs.length > 0;

  if (!hasRestaurants && !hasRelated) return null;

  return (
    <div className="my-8 space-y-6">
      {/* ── PODNIKY ZMÍNĚNÉ V ČLÁNKU ── */}
      {hasRestaurants && (
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-50">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <h3
                className="text-lg font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Podniky doporučené v tomto článku
              </h3>
            </div>
            <Link href="/restaurace">
              <span className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer">
                Všechny restaurace <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mentionedRestaurants.map(r => (
              <Link key={r.id} href={`/restaurace/${r.slug}`}>
                <div className="group bg-[#F8FAF6]/70 hover:bg-white p-3.5 rounded-xl border border-emerald-100/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-start h-full">
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full capitalize">
                          {r.type === "vegan"
                            ? "Veganská"
                            : r.type === "vegetarian"
                            ? "Vegetariánská"
                            : "Veg-friendly"}
                        </span>
                        <span className="flex items-center text-xs font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {r.rating.toFixed(1)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {r.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {r.district}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 mt-2">
                      Zobrazit profil podniku <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── DALŠÍ INSPIRACE (RECEPTY & BLOGY) ── */}
      {hasRelated && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3
              className="text-lg font-bold text-emerald-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
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
      )}
    </div>
  );
}
