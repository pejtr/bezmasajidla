// ============================================================
// BEZMASAJIDLA.CZ — Dynamic SEO Head Component
// Updates document title and meta tags dynamically per page
// Supports recipe-specific OG tags, Twitter Card, and article meta
// ============================================================

import { useEffect } from "react";

interface RecipeMeta {
  /** ISO 8601 duration, e.g. "PT30M" */
  prepTime?: string;
  cookTime?: string;
  /** e.g. "4 porce" */
  recipeYield?: string;
  /** e.g. "Polévky" */
  recipeCategory?: string;
  /** Calories per serving, e.g. "320 calories" */
  calories?: string;
  /** Tags for og:article:tag */
  tags?: string[];
  /** ISO date string */
  datePublished?: string;
  dateModified?: string;
}

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  /** Use "recipe" for recipe pages — enables recipe-specific meta tags */
  ogType?: "website" | "article" | "restaurant" | "recipe";
  ogUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  /** Pass for recipe pages to inject recipe-specific meta */
  recipeMeta?: RecipeMeta;
}

function setMeta(property: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(property: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  const el = document.querySelector(`meta[${attr}="${property}"]`);
  if (el) el.remove();
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

const DEFAULT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-variant-a-dJFXR9MBPW8QsrZquQfzwN.png";
const SITE_NAME = "Bezmasá Jídla";
const BASE_URL = "https://www.bezmasajidla.cz";

export default function SEOHead({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  ogUrl,
  canonicalUrl,
  noIndex = false,
  recipeMeta,
}: SEOProps) {
  useEffect(() => {
    // Page title
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // Primary meta
    setMeta("description", description);
    if (noIndex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      setMeta("robots", "index, follow");
    }

    // Open Graph — map "recipe" to "article" for og:type (schema.org recipe not supported by OG)
    const ogTypeValue = ogType === "recipe" ? "article" : ogType;
    setMeta("og:title", ogTitle || title, true);
    setMeta("og:description", ogDescription || description, true);
    setMeta("og:image", ogImage || DEFAULT_IMAGE, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", ogTitle || title, true);
    setMeta("og:type", ogTypeValue, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:locale", "cs_CZ", true);
    if (ogUrl) {
      setMeta("og:url", ogUrl, true);
    }

    // Recipe-specific Open Graph (article namespace for recipe metadata)
    if (ogType === "recipe" && recipeMeta) {
      if (recipeMeta.datePublished) setMeta("article:published_time", recipeMeta.datePublished, true);
      if (recipeMeta.dateModified) setMeta("article:modified_time", recipeMeta.dateModified, true);
      setMeta("article:author", SITE_NAME, true);
      setMeta("article:section", recipeMeta.recipeCategory || "Recepty", true);
      if (recipeMeta.tags) {
        // Remove old tag metas first, then add fresh ones
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        recipeMeta.tags.forEach(tag => {
          const el = document.createElement("meta");
          el.setAttribute("property", "article:tag");
          el.setAttribute("content", tag);
          document.head.appendChild(el);
        });
      }
    } else {
      // Clean up recipe-specific metas when navigating away
      removeMeta("article:published_time", true);
      removeMeta("article:modified_time", true);
      removeMeta("article:author", true);
      removeMeta("article:section", true);
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
    }

    // Twitter Card — use "summary_large_image" for all pages
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", "@bezmasajidla");
    setMeta("twitter:creator", "@bezmasajidla");
    setMeta("twitter:title", ogTitle || title);
    setMeta("twitter:description", ogDescription || description);
    setMeta("twitter:image", ogImage || DEFAULT_IMAGE);
    setMeta("twitter:image:alt", ogTitle || title);

    // Recipe-specific Twitter Card labels (shown as key-value pairs in Twitter cards)
    if (ogType === "recipe" && recipeMeta) {
      if (recipeMeta.prepTime || recipeMeta.cookTime) {
        setMeta("twitter:label1", "Doba přípravy");
        const prepMin = recipeMeta.prepTime?.replace("PT", "").replace("M", "") || "0";
        const cookMin = recipeMeta.cookTime?.replace("PT", "").replace("M", "") || "0";
        const total = parseInt(prepMin) + parseInt(cookMin);
        setMeta("twitter:data1", `${total} minut`);
      }
      if (recipeMeta.recipeYield) {
        setMeta("twitter:label2", "Počet porcí");
        setMeta("twitter:data2", recipeMeta.recipeYield);
      }
    } else {
      // Clean up recipe-specific Twitter metas
      removeMeta("twitter:label1");
      removeMeta("twitter:data1");
      removeMeta("twitter:label2");
      removeMeta("twitter:data2");
    }

    // Canonical
    if (canonicalUrl) {
      setCanonical(canonicalUrl);
    } else if (ogUrl) {
      setCanonical(ogUrl);
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = `${SITE_NAME} — Veganské a Vegetariánské Restaurace v Praze`;
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogType, ogUrl, canonicalUrl, noIndex, recipeMeta]);

  return null;
}

export { BASE_URL, SITE_NAME };
