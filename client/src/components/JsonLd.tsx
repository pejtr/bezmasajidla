// ============================================================
// BEZMASAJIDLA.CZ — JSON-LD Structured Data Components
// Schema.org markup for Restaurant and Recipe rich snippets
// Google Rich Results: Restaurant, Recipe, BreadcrumbList, WebSite
// ============================================================

import type { Restaurant, Recipe } from "@/lib/data";

// ── Helpers ──────────────────────────────────────────────────

/**
 * Convert Czech human-readable hours string to schema.org openingHours format.
 * Input examples:
 *   "Po–Pá 11:00–22:00, So–Ne 12:00–22:00"
 *   "Po–Ne 10:00–21:00"
 *   "Út–Ne 12:00–21:00"
 */
function parseOpeningHours(hours?: string): string[] {
  if (!hours) return [];

  const dayMap: Record<string, string> = {
    Po: "Mo", Út: "Tu", St: "We", Čt: "Th", Pá: "Fr", So: "Sa", Ne: "Su",
  };

  const result: string[] = [];

  // Split by comma for multiple day ranges
  const parts = hours.split(",").map(s => s.trim());

  for (const part of parts) {
    // Match pattern like "Po–Pá 11:00–22:00" or "Po–Ne 10:00–21:00"
    const match = part.match(/^([A-Za-zÁ-žá-ž]+)[–-]([A-Za-zÁ-žá-ž]+)\s+(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})$/);
    if (match) {
      const dayFrom = dayMap[match[1]] || match[1];
      const dayTo = dayMap[match[2]] || match[2];
      const timeFrom = match[3];
      const timeTo = match[4];
      result.push(`${dayFrom}-${dayTo} ${timeFrom}-${timeTo}`);
      continue;
    }

    // Match single day "Po 11:00–22:00"
    const singleMatch = part.match(/^([A-Za-zÁ-žá-ž]+)\s+(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})$/);
    if (singleMatch) {
      const day = dayMap[singleMatch[1]] || singleMatch[1];
      result.push(`${day} ${singleMatch[2]}-${singleMatch[3]}`);
    }
  }

  return result;
}

/** Map priceLevel (1-3) to schema.org priceRange */
function priceRange(level: 1 | 2 | 3): string {
  return "€".repeat(level);
}

/** Map restaurant type to schema.org servesCuisine */
function getCuisineType(type: string): string[] {
  const base = ["Vegetarian", "Plant-based"];
  if (type === "vegan") return ["Vegan", ...base];
  if (type === "vegetarian") return ["Vegetarian", ...base];
  return ["Vegan-friendly", ...base];
}

// ── Components ───────────────────────────────────────────────

export function RestaurantJsonLd({ restaurant }: { restaurant: Restaurant }) {
  const openingHours = parseOpeningHours(restaurant.hours);

  // Build sameAs array from social links + website
  const sameAs: string[] = [];
  if (restaurant.website) sameAs.push(restaurant.website);
  if (restaurant.instagramUrl) sameAs.push(restaurant.instagramUrl);
  if (restaurant.facebookUrl) sameAs.push(restaurant.facebookUrl);
  if (restaurant.woltUrl) sameAs.push(restaurant.woltUrl);

  // Build Review from editorial review if available
  const review = restaurant.editorialReview
    ? {
        "@type": "Review",
        author: {
          "@type": "Organization",
          name: "Bezmasá Jídla",
          url: "https://www.bezmasajidla.cz",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: restaurant.editorialReview.score,
          bestRating: 10,
          worstRating: 1,
        },
        reviewBody: restaurant.editorialReview.summary,
        datePublished: "2025-01-01",
      }
    : undefined;

  // Use current date as dateModified (refreshed on each deploy/build)
  const today = new Date().toISOString().split("T")[0];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `https://www.bezmasajidla.cz/restaurace/${restaurant.slug}`,
    name: restaurant.name,
    description: restaurant.description,
    image: [restaurant.image, ...(restaurant.gallery || [])].filter(Boolean),
    url: `https://www.bezmasajidla.cz/restaurace/${restaurant.slug}`,
    dateModified: today,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.split(",")[0]?.trim() || restaurant.address,
      addressLocality: "Praha",
      addressRegion: restaurant.district,
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.lat,
      longitude: restaurant.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`,
    telephone: restaurant.phone || undefined,
    servesCuisine: getCuisineType(restaurant.type),
    priceRange: priceRange(restaurant.priceLevel),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: restaurant.rating,
      reviewCount: restaurant.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    // Dietary features
    hasMenuItem: undefined, // Placeholder — could be extended with actual menu items
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Vegetarian menu",
        value: true,
      },
      ...(restaurant.type === "vegan"
        ? [{ "@type": "LocationFeatureSpecification", name: "Vegan menu", value: true }]
        : []),
    ],
    // Delivery/takeout
    ...(restaurant.woltUrl
      ? {
          hasDeliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload",
          potentialAction: {
            "@type": "OrderAction",
            target: restaurant.woltUrl,
          },
        }
      : {}),
    // Opening hours
    ...(openingHours.length > 0 ? { openingHours } : {}),
    // Social links
    ...(sameAs.length > 0 ? { sameAs } : {}),
    // Editorial review
    ...(review ? { review } : {}),
    // Publisher / brand
    isPartOf: {
      "@type": "WebSite",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
    },
  };

  // Remove undefined values for clean output
  const clean = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean, null, 0) }}
    />
  );
}

export function RecipeJsonLd({
  recipe,
  ingredients,
  steps,
}: {
  recipe: Recipe;
  ingredients?: string[];
  steps?: string[];
}) {
  const keywords = [
    recipe.category,
    recipe.cuisine,
    recipe.isVegan ? "vegan" : "vegetariánský",
    recipe.isVegan ? "veganský recept" : "vegetariánský recept",
    "bezmasý recept",
    "recept bez masa",
    ...(recipe.isGlutenFree ? ["bezlepkovy recept", "bez lepku"] : []),
    ...(recipe.isKeto ? ["low carb", "keto"] : []),
    ...recipe.tags,
  ].filter(Boolean) as string[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `https://www.bezmasajidla.cz/recepty/${recipe.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.bezmasajidla.cz/recepty/${recipe.slug}`,
    },
    inLanguage: "cs-CZ",
    name: recipe.title,
    description: recipe.description,
    image: [recipe.image, ...(recipe.images || []).map((image) => image.url)].filter(Boolean),
    author: {
      "@type": "Organization",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
      logo: {
        "@type": "ImageObject",
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-cropped_d7cd6ecf.png",
      },
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine || recipe.tags.find((tag) => tag.toLowerCase().includes("kuchyn")) || "Vegetarian",
    keywords: keywords.join(", "),
    about: keywords.slice(0, 8).map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
    mentions: (ingredients || []).slice(0, 8).map((ingredient) => ({
      "@type": "Thing",
      name: ingredient,
    })),
    recipeYield: recipe.servings ? `${recipe.servings} porce` : undefined,
    recipeIngredient: ingredients || [],
    recipeInstructions: (steps || []).map((step: string, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
    // Nutrition info if macros available
    ...(recipe.macros
      ? {
          nutrition: {
            "@type": "NutritionInformation",
            calories: `${recipe.macros.calories} calories`,
            proteinContent: `${recipe.macros.protein}g`,
            carbohydrateContent: `${recipe.macros.carbs}g`,
            fatContent: `${recipe.macros.fat}g`,
            fiberContent: recipe.macros.fiber ? `${recipe.macros.fiber}g` : undefined,
          },
        }
      : {}),
    // Dietary suitability
    suitableForDiet: [
      ...(recipe.isVegan ? ["https://schema.org/VeganDiet"] : []),
      // All recipes on this site are vegetarian
      "https://schema.org/VegetarianDiet",
      ...(recipe.isGlutenFree ? ["https://schema.org/GlutenFreeDiet"] : []),
    ],
  };

  const clean = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean, null, 0) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.bezmasajidla.cz/#website",
    name: "Bezmasá Jídla",
    url: "https://www.bezmasajidla.cz",
    description:
      "Průvodce veganskými a vegetariánskými restauracemi v Praze. Recepty, recenze a mapa bezmasých podniků.",
    inLanguage: "cs",
    publisher: {
      "@type": "Organization",
      name: "Bezmasá Jídla",
      url: "https://www.bezmasajidla.cz",
      logo: {
        "@type": "ImageObject",
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-cropped_d7cd6ecf.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.bezmasajidla.cz/restaurace?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
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
      item: `https://www.bezmasajidla.cz${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

/** Organization schema for the About page */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.bezmasajidla.cz/#organization",
    name: "Bezmasá Jídla",
    url: "https://www.bezmasajidla.cz",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-cropped_d7cd6ecf.png",
    description: "Největší český adresář veganských a vegetariánských restaurací v Praze.",
    sameAs: [
      "https://www.instagram.com/bezmasajidla",
      "https://www.facebook.com/bezmasajidla",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "info@bezmasajidla.cz",
      availableLanguage: "Czech",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

/** FAQPage schema — renders expandable FAQ in Google search results */
export function FAQPageJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

/** ItemList schema for the restaurant listing page — helps Google understand the list */
export function RestaurantListJsonLd({
  restaurants,
}: {
  restaurants: { name: string; slug: string; image: string; description: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Veganské a vegetariánské restaurace v Praze",
    description: "Přehled nejlepších veganských a vegetariánských restaurací v Praze",
    url: "https://www.bezmasajidla.cz/restaurace",
    numberOfItems: restaurants.length,
    itemListElement: restaurants.slice(0, 20).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.bezmasajidla.cz/restaurace/${r.slug}`,
      name: r.name,
      image: r.image,
      description: r.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

/** ItemList schema for the recipe listing page. */
export function RecipeListJsonLd({ recipes }: { recipes: Recipe[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Veganské a vegetariánské recepty",
    description:
      "Přehled ověřených bezmasých receptů pro českou domácí kuchyni, včetně veganských a vegetariánských jídel.",
    url: "https://www.bezmasajidla.cz/recepty",
    numberOfItems: recipes.length,
    itemListElement: recipes.slice(0, 50).map((recipe, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.bezmasajidla.cz/recepty/${recipe.slug}`,
      name: recipe.title,
      image: recipe.image,
      description: recipe.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
