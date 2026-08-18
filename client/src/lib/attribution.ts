// ============================================================
// BEZMASAJIDLA.CZ — Client Scoped Social Attribution
// Strictly recipe-scoped session attribution to avoid cross-contamination.
// ============================================================

export interface ScopedAttribution {
  socialPostId?: number;
  landingRecipeSlug: string;
  attributionSessionId: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  capturedAt: number;
}

const STORAGE_KEY = "bj_recipe_attribution";
const SESSION_ID_KEY = "bj_attr_session_id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server_session";
  try {
    let sid = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = `ses_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      window.sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    return `ses_fallback_${Date.now()}`;
  }
}

/**
 * Initializes and captures attribution on landing page load.
 * Returns payload if a new social landing was detected so the landing event can be recorded.
 */
export function initSocialLandingAttribution(currentRecipeSlug: string): {
  isSocialLanding: boolean;
  socialPostId?: number;
  attributionSessionId: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
} {
  if (typeof window === "undefined") {
    return { isSocialLanding: false, attributionSessionId: "server" };
  }

  const attributionSessionId = getOrCreateSessionId();

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") || undefined;
    const utmMedium = params.get("utm_medium") || undefined;
    const utmCampaign = params.get("utm_campaign") || undefined;
    const utmContent = params.get("utm_content") || "";

    let socialPostId: number | undefined;
    const postMatch = utmContent.match(/post_(\d+)/i);
    if (postMatch) {
      socialPostId = parseInt(postMatch[1], 10);
    } else {
      const rawPostId = params.get("socialPostId");
      if (rawPostId) socialPostId = parseInt(rawPostId, 10);
    }

    if (socialPostId && !isNaN(socialPostId)) {
      const record: ScopedAttribution = {
        socialPostId,
        landingRecipeSlug: currentRecipeSlug,
        attributionSessionId,
        utmSource,
        utmMedium,
        utmCampaign,
        capturedAt: Date.now(),
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));

      return {
        isSocialLanding: true,
        socialPostId,
        attributionSessionId,
        utmSource,
        utmMedium,
        utmCampaign,
      };
    }
  } catch (err) {
    console.warn("[Attribution] Failed to init social landing:", err);
  }

  return { isSocialLanding: false, attributionSessionId };
}

/**
 * Retrieves attribution ONLY if scoped to the current recipe.
 * Prevents cross-recipe attribution leaks when a user clicks internal links.
 */
export function getRecipeScopedAttribution(currentRecipeSlug: string): {
  socialPostId?: number;
  attributionSessionId: string;
  utmSource?: string;
  utmCampaign?: string;
} {
  if (typeof window === "undefined") {
    return { attributionSessionId: "server" };
  }

  const attributionSessionId = getOrCreateSessionId();

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { attributionSessionId };

    const data: ScopedAttribution = JSON.parse(raw);
    const isMatchingRecipe = data.landingRecipeSlug === currentRecipeSlug;
    const isFresh = Date.now() - (data.capturedAt || 0) < 24 * 60 * 60 * 1000;

    if (isMatchingRecipe && isFresh && data.socialPostId) {
      return {
        socialPostId: data.socialPostId,
        attributionSessionId: data.attributionSessionId || attributionSessionId,
        utmSource: data.utmSource,
        utmCampaign: data.utmCampaign,
      };
    }
  } catch (err) {
    console.warn("[Attribution] Failed to read scoped attribution:", err);
  }

  return { attributionSessionId };
}

/**
 * Appends scoped social attribution query parameters to affiliate redirect URLs
 */
export function buildAttributedRedirectUrl(baseRedirectUrl: string, currentRecipeSlug: string): string {
  const scoped = getRecipeScopedAttribution(currentRecipeSlug);
  try {
    const url = new URL(baseRedirectUrl, window.location.origin);
    if (scoped.socialPostId) {
      url.searchParams.set("socialPostId", scoped.socialPostId.toString());
    }
    if (scoped.attributionSessionId) {
      url.searchParams.set("attributionSessionId", scoped.attributionSessionId);
    }
    return url.pathname + url.search;
  } catch {
    return baseRedirectUrl;
  }
}
