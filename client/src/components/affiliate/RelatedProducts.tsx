// ============================================================
// BEZMASAJIDLA.CZ — Related Products Component (Ekočlověk.cz)
// "🌱 Vypěstujte si vlastní suroviny"
// ============================================================

import { useEffect, useRef } from "react";
import { Sprout, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AffiliateDisclosure from "./AffiliateDisclosure";
import { trackClientAffiliateImpression, trackClientAffiliateClick } from "@/lib/affiliate-tracking";
import { trpc } from "@/lib/trpc";

export interface RelatedProductItem {
  id: string;
  externalId: string;
  merchant: "ekoclovek" | string;
  title: string;
  description?: string;
  sourceUrl?: string;
  affiliateUrl: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  category?: string;
  tags?: string[];
  ingredients?: string[];
}

interface RelatedProductsProps {
  products: RelatedProductItem[];
  recipeSlug?: string;
  recipeTitle?: string;
  recipeCuisine?: string;
  className?: string;
}

export default function RelatedProducts({
  products,
  recipeSlug,
  recipeTitle,
  recipeCuisine,
  className = "",
}: RelatedProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackImpressionMutation = trpc.affiliate.trackImpression.useMutation();
  const trackClickMutation = trpc.affiliate.trackClick.useMutation();

  // IntersectionObserver for impression tracking
  useEffect(() => {
    if (!products || products.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          products.forEach(p => {
            trackClientAffiliateImpression({
              merchant: p.merchant,
              productId: p.id,
              productName: p.title,
              recipeSlug,
              placement: "related_product",
              category: p.category,
              cuisine: recipeCuisine,
              price: p.price,
            });

            trackImpressionMutation.mutate({
              merchant: p.merchant,
              productId: p.id,
              recipeSlug,
              placement: "related_product",
              category: p.category,
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
  }, [products, recipeSlug, recipeCuisine]);

  if (!products || products.length === 0) {
    return null;
  }

  const handleProductClick = (product: RelatedProductItem) => {
    trackClientAffiliateClick({
      merchant: product.merchant,
      productId: product.id,
      productName: product.title,
      recipeSlug,
      placement: "related_product",
      category: product.category,
      cuisine: recipeCuisine,
      price: product.price,
    });

    trackClickMutation.mutate({
      merchant: "ekoclovek",
      productId: product.id,
      recipeSlug,
      placement: "related_product",
      category: product.category,
      cuisine: recipeCuisine,
      destinationUrl: product.sourceUrl,
    });
  };

  return (
    <section
      ref={containerRef}
      className={`my-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-lime-50/50 border border-emerald-100/80 shadow-sm ${className}`}
      aria-label="Doporučené produkty pro domácí pěstování surovin"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-100/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              Vypěstujte si vlastní suroviny
              <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Bio & Eko
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Čerstvé bylinky a zelenina pro ještě lahodnější recept
            </p>
          </div>
        </div>
        <AffiliateDisclosure short />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div
            key={product.id}
            className="flex flex-col justify-between p-3.5 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
          >
            <div>
              {product.imageUrl && (
                <div className="w-full h-32 rounded-lg overflow-hidden bg-stone-50 mb-3 relative flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.price && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-stone-900/85 text-white text-xs font-semibold backdrop-blur-sm shadow">
                      {Math.round(product.price)} Kč
                    </span>
                  )}
                </div>
              )}

              <h4 className="font-semibold text-sm text-stone-800 line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">
                {product.title}
              </h4>

              {product.description && (
                <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                  {product.description}
                </p>
              )}
            </div>

            <div className="pt-2 mt-auto">
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => handleProductClick(product)}
                className="w-full"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Koupit na Ekočlověk.cz
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-100/60">
        <AffiliateDisclosure />
      </div>
    </section>
  );
}
