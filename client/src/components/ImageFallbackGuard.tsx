import { useEffect } from "react";
import { IMAGE_PLACEHOLDER } from "@/lib/imageFallbacks";

/**
 * Last-resort protection for images rendered outside OptimizedImage.
 * A broken remote URL must never turn into a misleading photo of another item.
 */
export default function ImageFallbackGuard() {
  useEffect(() => {
    const handleImageError = (event: Event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || image.alt === "") return;

      if (image.dataset.fallbackApplied === "true") {
        image.hidden = true;
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.src = image.dataset.fallbackSrc || IMAGE_PLACEHOLDER;
    };

    document.addEventListener("error", handleImageError, true);
    return () => document.removeEventListener("error", handleImageError, true);
  }, []);

  return null;
}
