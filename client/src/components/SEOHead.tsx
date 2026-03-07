// ============================================================
// BEZMASAJIDLA.CZ — Dynamic SEO Head Component
// Updates document title and meta tags dynamically per page
// ============================================================

import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "restaurant";
  ogUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
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

    // Open Graph
    setMeta("og:title", ogTitle || title, true);
    setMeta("og:description", ogDescription || description, true);
    setMeta("og:image", ogImage || DEFAULT_IMAGE, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:locale", "cs_CZ", true);
    if (ogUrl) {
      setMeta("og:url", ogUrl, true);
    }

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle || title);
    setMeta("twitter:description", ogDescription || description);
    setMeta("twitter:image", ogImage || DEFAULT_IMAGE);

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
  }, [title, description, ogTitle, ogDescription, ogImage, ogType, ogUrl, canonicalUrl, noIndex]);

  return null;
}

export { BASE_URL, SITE_NAME };
