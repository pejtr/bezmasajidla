export const IMAGE_PLACEHOLDER = "/images/placeholders/image-placeholder.svg";
export const RESTAURANT_PLACEHOLDER =
  "/images/placeholders/restaurant-placeholder.svg";
export const BLOG_PLACEHOLDER = "/images/placeholders/blog-placeholder.svg";

const UNAVAILABLE_LEGACY_HOST = "d2xsxph8kpxj0f.cloudfront.net";

export function isUnavailableLegacyImage(image: string | null | undefined) {
  if (!image) return true;

  try {
    return (
      new URL(image, "https://www.bezmasajidla.cz").hostname ===
      UNAVAILABLE_LEGACY_HOST
    );
  } catch {
    return true;
  }
}

export function withImageFallback(
  image: string | null | undefined,
  fallback: string
) {
  return isUnavailableLegacyImage(image) ? fallback : image!;
}
