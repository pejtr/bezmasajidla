// ============================================================
// BEZMASAJIDLA.CZ — Related Experiences Component (Zážitky.cz)
// "👨‍🍳 Naučte se tuto kuchyni od profesionála"
// ============================================================

import { useEffect, useRef } from "react";
import { ChefHat, ExternalLink, MapPin, Sparkles, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import AffiliateDisclosure from "./AffiliateDisclosure";
import { trackClientAffiliateImpression, trackClientAffiliateClick } from "@/lib/affiliate-tracking";
import { trpc } from "@/lib/trpc";

export interface RelatedExperienceItem {
  id: string;
  externalId: string;
  merchant: "zazitky" | string;
  title: string;
  description?: string;
  sourceUrl?: string;
  affiliateUrl: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  category?: string;
  tags?: string[];
  cuisines?: string[];
}

interface RelatedExperiencesProps {
  experiences: RelatedExperienceItem[];
  recipeSlug?: string;
  recipeTitle?: string;
  recipeCuisine?: string;
  className?: string;
}

export default function RelatedExperiences({
  experiences,
  recipeSlug,
  recipeTitle,
  recipeCuisine,
  className = "",
}: RelatedExperiencesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackImpressionMutation = trpc.affiliate.trackImpression.useMutation();
  const trackClickMutation = trpc.affiliate.trackClick.useMutation();

  useEffect(() => {
    if (!experiences || experiences.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          experiences.forEach(exp => {
            trackClientAffiliateImpression({
              merchant: exp.merchant,
              productId: exp.id,
              productName: exp.title,
              recipeSlug,
              placement: "related_experience",
              category: exp.category,
              cuisine: recipeCuisine,
              price: exp.price,
            });

            trackImpressionMutation.mutate({
              merchant: exp.merchant,
              productId: exp.id,
              recipeSlug,
              placement: "related_experience",
              category: exp.category,
              cuisine: recipeCuisine,
            });
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [experiences, recipeSlug, recipeCuisine]);

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const handleExperienceClick = (exp: RelatedExperienceItem) => {
    trackClientAffiliateClick({
      merchant: exp.merchant,
      productId: exp.id,
      productName: exp.title,
      recipeSlug,
      placement: "related_experience",
      category: exp.category,
      cuisine: recipeCuisine,
      price: exp.price,
    });

    trackClickMutation.mutate({
      merchant: "zazitky",
      productId: exp.id,
      recipeSlug,
      placement: "related_experience",
      category: exp.category,
      cuisine: recipeCuisine,
      destinationUrl: exp.sourceUrl,
    });
  };

  return (
    <section
      ref={containerRef}
      className={`my-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border border-amber-200/70 shadow-sm ${className}`}
      aria-label="Doporučené gastronomické zážitky a kurzy vaření"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-600/10 flex items-center justify-center text-amber-700">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              Naučte se tuto kuchyni od šéfkuchaře
              <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Zážitky & Kurzy
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Praktické kuchařské kurzy a degustační večery
            </p>
          </div>
        </div>
        <AffiliateDisclosure short />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {experiences.map(exp => (
          <div
            key={exp.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all duration-200 group"
          >
            <div>
              {exp.imageUrl && (
                <div className="w-full h-40 rounded-lg overflow-hidden bg-stone-100 mb-3 relative">
                  <img
                    src={exp.imageUrl}
                    alt={exp.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {exp.price && (
                    <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-stone-950/80 text-white text-xs font-bold backdrop-blur-sm shadow">
                      od {Math.round(exp.price).toLocaleString("cs-CZ")} Kč
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-amber-800 font-medium mb-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span className="line-clamp-1">{exp.category || "Gurmánský zážitek"}</span>
              </div>

              <h4 className="font-bold text-sm text-stone-900 line-clamp-2 mb-1.5 group-hover:text-amber-700 transition-colors">
                {exp.title}
              </h4>

              {exp.description && (
                <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                  {exp.description}
                </p>
              )}
            </div>

            <div className="pt-2 mt-auto">
              <a
                href={exp.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => handleExperienceClick(exp)}
                className="w-full"
              >
                <Button
                  size="sm"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  Zobrazit na Zážitky.cz
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-amber-100">
        <AffiliateDisclosure />
      </div>
    </section>
  );
}
