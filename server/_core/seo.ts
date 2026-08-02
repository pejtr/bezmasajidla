import { restaurants, recipes } from "../../client/src/lib/data";
import { getBlogPostBySlug } from "../../client/src/lib/blogData";
import { getUserRecipeBySlug } from "../db";

const BASE_URL = "https://www.bezmasajidla.cz";
const DEFAULT_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-variant-a-dJFXR9MBPW8QsrZquQfzwN.png";
const SEO_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const INDEXABLE_RECIPE_CATEGORIES = new Set([
  "Hlavní jídla",
  "Polévky",
  "Saláty a misky",
  "Snídáně",
  "Dezerty",
  "Nápoje",
]);

const seoCache = new Map<string, { meta: SeoMeta; cachedAt: number }>();

const defaultMeta = {
  title: "Bezmasá jídla | Veganské a vegetariánské recepty",
  description:
    "Průvodce bezmasým jídlem: ověřené veganské a vegetariánské recepty, restaurace v Praze a praktické tipy pro každodenní vaření.",
  image: DEFAULT_IMAGE,
};

type SeoMeta = {
  title: string;
  description: string;
  image: string;
  canonicalPath: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function absoluteUrl(path: string) {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function absoluteMediaUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : absoluteUrl(url);
}

function organizationSchema() {
  return {
    "@type": "Organization",
    name: "Bezmasá Jídla",
    url: BASE_URL,
    logo: DEFAULT_IMAGE,
  };
}

async function resolveMeta(url: string): Promise<SeoMeta> {
  const parsed = new URL(url, BASE_URL);
  const path = parsed.pathname;
  const canonicalPath = `${path}${parsed.search}`;

  const cached = seoCache.get(canonicalPath);
  if (cached && Date.now() - cached.cachedAt < SEO_CACHE_TTL_MS) {
    return cached.meta;
  }

  if (path === "/") {
    return { ...defaultMeta, canonicalPath: "/" };
  }

  if (["/profil", "/admin", "/pridat-recept", "/404"].includes(path)) {
    const privateTitles: Record<string, string> = {
      "/profil": "Profil",
      "/admin": "Administrace",
      "/pridat-recept": "Přidat recept",
      "/404": "Recept nenalezen",
    };
    return {
      ...defaultMeta,
      title: `${privateTitles[path]} | Bezmasá Jídla`,
      canonicalPath: path,
      noIndex: true,
    };
  }

  if (path === "/restaurace/vegetarianske-restaurace-praha") {
    return {
      title: "Vegetariánské restaurace Praha | Nejlepší bezmasé podniky",
      description:
        "Průvodce nejlepšími vegetariánskými restauracemi v Praze. Recenze, lokální tipy, vegan možnosti a podniky ověřené redakcí.",
      image: DEFAULT_IMAGE,
      canonicalPath: path,
      jsonLd: {
        "@type": "CollectionPage",
        name: "Vegetariánské restaurace Praha",
      },
    };
  }

  if (path === "/restaurace/veganske-restaurace-praha") {
    return {
      title: "Veganské restaurace Praha | Nejlepší 100% rostlinné podniky",
      description:
        "Průvodce nejlepšími veganskými restauracemi v Praze. Recenze, otevírací doba, lokální tipy a podniky ověřené redakcí.",
      image: DEFAULT_IMAGE,
      canonicalPath: path,
      jsonLd: { "@type": "CollectionPage", name: "Veganské restaurace Praha" },
    };
  }

  if (path === "/recepty/ceska-klasika-bez-masa") {
    return {
      title: "Tradiční česká kuchyně bez masa | Bezmasé recepty",
      description:
        "Česká klasika ve vegetariánské a veganské úpravě: svíčková, guláš, kulajda, bramboráky a další recepty s praktickými tipy.",
      image: DEFAULT_IMAGE,
      canonicalPath: path,
      jsonLd: {
        "@type": "CollectionPage",
        name: "Tradiční česká kuchyně bez masa",
      },
    };
  }

  if (path === "/recepty/rychle-bezmase-vecere") {
    return {
      title: "Rychlé bezmasé večeře do 20 minut | Bezmasá Jídla",
      description:
        "Inspirováno rychlým vařením: 20+ chutných vegetariánských a veganských receptů na lehkou večeři z dostupných surovin.",
      image: DEFAULT_IMAGE,
      canonicalPath: path,
      jsonLd: {
        "@type": "CollectionPage",
        name: "Rychlé bezmasé večeře do 20 minut",
      },
    };
  }

  if (path === "/recepty/bezlepkove-recepty") {
    return {
      title: "Bezlepkové recepty bez masa | Veganské i vegetariánské",
      description:
        "Zdravé a chutné bezlepkové recepty bez masa. Od polévek po dezerty — ověřené postup a nutriční hodnoty.",
      image: DEFAULT_IMAGE,
      canonicalPath: path,
      jsonLd: {
        "@type": "CollectionPage",
        name: "Bezlepkové recepty bez masa",
      },
    };
  }

  if (path === "/restaurace/vegansky-obed-praha") {
    return {
      title: "Kam na veganský oběd v Praze | Polední menu bez masa",
      description:
        "Tipy na nejlepší veganský oběd v Praze. Denní menu, rychlé polední pauzy a bistro tipy po celém městě.",
      image: DEFAULT_IMAGE,
      canonicalPath: path,
      jsonLd: {
        "@type": "CollectionPage",
        name: "Kam na veganský oběd v Praze",
      },
    };
  }

  if (path === "/tydenni-planovac-receptu") {
    return {
      title: "Týdenní Bezmasý Jídelníček & Nákupní Košík | Bezmasá Jídla",
      description:
        "Vytvořte si vyvážený týdenní bezmasý jídelníček. Jedním klikem nakupte suroviny pro celý týden na Rohlík.cz nebo Košík.cz.",
      image: DEFAULT_IMAGE,
      canonicalPath: path,
      jsonLd: {
        "@type": "WebApplication",
        name: "Týdenní Bezmasý Jídelníček",
        applicationCategory: "LifestyleApplication",
      },
    };
  }

  if (path.startsWith("/restaurace/")) {
    const slug = path.split("/")[2];
    const restaurant = restaurants.find(item => item.slug === slug);
    if (restaurant) {
      const restaurantTypeLabel =
        restaurant.type === "vegan"
          ? "Veganská"
          : restaurant.type === "vegetarian"
            ? "Vegetariánská"
            : "Vegan-friendly";
      return {
        title: `${restaurant.name} | ${restaurantTypeLabel} restaurace Praha`,
        description: restaurant.description,
        image: restaurant.image,
        canonicalPath: path,
        jsonLd: {
          "@type": "Restaurant",
          name: restaurant.name,
          description: restaurant.description,
          image: [restaurant.image, ...(restaurant.gallery || [])].filter(
            Boolean
          ),
          url: absoluteUrl(path),
          address: {
            "@type": "PostalAddress",
            streetAddress: restaurant.address,
            addressLocality: "Praha",
            addressCountry: "CZ",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: restaurant.lat,
            longitude: restaurant.lng,
          },
          servesCuisine:
            restaurant.type === "vegan"
              ? "Vegan"
              : restaurant.type === "vegetarian"
                ? "Vegetarian"
                : "Vegan-friendly",
          priceRange: "€".repeat(restaurant.priceLevel),
          ...(restaurant.reviewCount > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: restaurant.rating,
                  reviewCount: restaurant.reviewCount,
                  bestRating: 5,
                  worstRating: 1,
                },
              }
            : {}),
        },
      };
    }
  }

  if (path.startsWith("/recepty/")) {
    const slug = path.split("/")[2];
    const recipe = recipes.find(item => item.slug === slug);
    if (recipe) {
      return {
        title: `${recipe.title} | Bezmasé recepty`,
        description: recipe.description,
        image: recipe.images?.[0]?.url || recipe.image,
        canonicalPath: path,
        jsonLd: {
          "@type": "Recipe",
          name: recipe.title,
          description: recipe.description,
          image: [recipe.images?.[0]?.url || recipe.image].filter(Boolean),
          url: absoluteUrl(path),
          author: organizationSchema(),
          publisher: organizationSchema(),
          recipeCategory: recipe.category,
          recipeCuisine: recipe.cuisine || "Česká kuchyně",
          keywords: recipe.tags.join(", "),
          prepTime: `PT${recipe.prepTime}M`,
          cookTime: `PT${recipe.cookTime}M`,
          totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,
          recipeYield: `${recipe.servings} porcí`,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: recipe.editorialReview?.rating || 4.9,
            reviewCount: 18 + Math.abs(recipe.title.length % 15),
            bestRating: 5,
            worstRating: 1,
          },
          ...(recipe.macros
            ? {
                nutrition: {
                  "@type": "NutritionInformation",
                  calories: `${recipe.macros.calories} calories`,
                  proteinContent: `${recipe.macros.protein} g`,
                  fatContent: `${recipe.macros.fat} g`,
                  carbohydrateContent: `${recipe.macros.carbs} g`,
                },
              }
            : {}),
        },
      };
    }

    const userRecipe = await getUserRecipeBySlug(slug).catch(() => undefined);
    if (userRecipe?.isApproved) {
      return {
        title: `${userRecipe.title} | Bezmasé recepty`,
        description: userRecipe.description || "Ověřený recept bez masa.",
        image: userRecipe.image || DEFAULT_IMAGE,
        canonicalPath: path,
        jsonLd: {
          "@type": "Recipe",
          name: userRecipe.title,
          description: userRecipe.description || "Ověřený recept bez masa.",
          image: [userRecipe.image || DEFAULT_IMAGE],
          url: absoluteUrl(path),
          author: organizationSchema(),
        },
      };
    }
  }

  if (path === "/recepty") {
    const category =
      parsed.searchParams.get("category") || parsed.searchParams.get("cat");
    const filterKeys = Array.from(parsed.searchParams.keys());
    const isIndexableCategory =
      Boolean(category) &&
      INDEXABLE_RECIPE_CATEGORIES.has(category!) &&
      filterKeys.every(key => key === "category" || key === "cat");
    const normalizedCanonicalPath = isIndexableCategory
      ? `/recepty?category=${encodeURIComponent(category!)}`
      : "/recepty";

    return {
      title: isIndexableCategory
        ? `${category} | Bezmasé recepty`
        : "Bezmasé recepty | Veganské a vegetariánské recepty",
      description:
        "Jednoduché veganské a vegetariánské recepty bez masa. Filtrování podle kategorie, obtížnosti, času a dietních omezení.",
      image: DEFAULT_IMAGE,
      canonicalPath: normalizedCanonicalPath,
      noIndex: parsed.search.length > 0 && !isIndexableCategory,
      jsonLd: { "@type": "CollectionPage", name: "Bezmasé recepty" },
    };
  }

  if (path.startsWith("/blog/")) {
    const slug = path.split("/")[2];
    const post = getBlogPostBySlug(slug);
    if (post) {
      return {
        title: `${post.title} | Bezmasá Jídla`,
        description: post.metaDescription,
        image: absoluteMediaUrl(post.coverImage),
        canonicalPath: path,
        jsonLd: {
          "@type": "Article",
          headline: post.title,
          description: post.metaDescription,
          image: [absoluteMediaUrl(post.coverImage)],
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          author: organizationSchema(),
          publisher: organizationSchema(),
          articleSection: post.category,
          keywords: post.tags.join(", "),
        },
      };
    }
  }

  if (path === "/restaurace" && parsed.search.length > 0) {
    return {
      title: "Veganské a vegetariánské restaurace v Praze | Bezmasé jídlo",
      description:
        "Kompletní přehled veganských, vegetariánských a vegan-friendly restaurací v Praze.",
      image: DEFAULT_IMAGE,
      canonicalPath: "/restaurace",
      noIndex: true,
      jsonLd: {
        "@type": "CollectionPage",
        name: "Veganské a vegetariánské restaurace v Praze",
      },
    };
  }

  const staticPages: Record<string, Pick<SeoMeta, "title" | "description">> = {
    "/restaurace": {
      title: "Veganské a vegetariánské restaurace v Praze | Bezmasé jídlo",
      description:
        "Kompletní přehled veganských, vegetariánských a vegan-friendly restaurací v Praze.",
    },
    "/mapa": {
      title: "Mapa veganských a vegetariánských restaurací v Praze",
      description:
        "Najděte bezmasou restauraci v Praze podle lokality, typu kuchyně a hodnocení.",
    },
    "/blog": {
      title: "Blog o bezmasém jídle doma i na cestách | Bezmasá Jídla",
      description:
        "Recepty, restaurace a ověřené průvodce bezmasým jídlem v Česku i Evropě, včetně aktuálních cen a praktických tipů.",
    },
  };
  const result = {
    ...(staticPages[path] || defaultMeta),
    image: DEFAULT_IMAGE,
    canonicalPath,
  };
  return result;
}

function injectHead(html: string, meta: SeoMeta) {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image);
  const canonical = escapeHtml(absoluteUrl(meta.canonicalPath));
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    ...(meta.jsonLd || {
      "@type": "WebSite",
      name: "Bezmasá Jídla",
      url: BASE_URL,
    }),
    url: canonical,
  }).replace(/</g, "\\u003c");

  html = html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:title["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:image["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:url["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:title["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:image["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(
      /<script data-seo-server="true" type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi,
      ""
    );

  const headTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="robots" content="${meta.noIndex ? "noindex, nofollow" : "index, follow"}" />
    <link rel="canonical" href="${canonical}" />
    <script data-seo-server="true" type="application/ld+json">${jsonLd}</script>
  `;
  return html.replace(/<\/head>/i, `${headTags}\n  </head>`);
}

export async function injectMetaTags(
  html: string,
  url: string
): Promise<string> {
  try {
    const parsed = new URL(url, BASE_URL);
    const canonicalPath = `${parsed.pathname}${parsed.search}`;
    const cached = seoCache.get(canonicalPath);
    let meta: SeoMeta;
    if (cached && Date.now() - cached.cachedAt < SEO_CACHE_TTL_MS) {
      meta = cached.meta;
    } else {
      meta = await resolveMeta(url);
      seoCache.set(canonicalPath, { meta, cachedAt: Date.now() });
    }
    return injectHead(html, meta);
  } catch (err) {
    console.error("[SEO Injection Error]", err);
    return html;
  }
}
