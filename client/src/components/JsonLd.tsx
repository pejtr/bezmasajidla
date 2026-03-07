// ============================================================
// BEZMASAJIDLA.CZ — JSON-LD Structured Data Components
// Schema.org markup for Restaurant and Recipe rich snippets
// ============================================================

import type { Restaurant, Recipe } from "@/lib/data";

export function RestaurantJsonLd({ restaurant }: { restaurant: Restaurant }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      addressLocality: "Praha",
      addressRegion: restaurant.district,
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.lat,
      longitude: restaurant.lng,
    },
    url: restaurant.website || `https://bezmasajidla.cz/restaurace/${restaurant.slug}`,
    telephone: restaurant.phone || undefined,
    servesCuisine: restaurant.tags,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: restaurant.rating,
      reviewCount: restaurant.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    priceRange: "$".repeat(restaurant.priceLevel),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function RecipeJsonLd({ recipe, ingredients, steps }: { recipe: Recipe; ingredients?: string[]; steps?: string[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.image,
    author: {
      "@type": "Organization",
      name: "bezmasajidla.cz",
    },
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,
    recipeCategory: recipe.category,
    recipeCuisine: "Czech",
    recipeIngredient: ingredients || [],
    recipeInstructions: (steps || []).map((step: string, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
    recipeYield: recipe.servings ? `${recipe.servings} porce` : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bezmasá Jídla",
    url: "https://bezmasajidla.cz",
    description: "Průvodce veganskými a vegetariánskými restauracemi v Praze. Recepty, recenze a mapa bezmasých podniků.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bezmasajidla.cz/restaurace?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://bezmasajidla.cz${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
