// ============================================================
// BEZMASAJIDLA.CZ — Hermelín Lead Magnet Funnel Tracking
// Multi-platform tracking (dataLayer, Umami, LeadOS)
// Strictly ZERO PII: No emails or personal identifiers in payloads.
// ============================================================

export type HermelinCtaPosition = "A" | "B" | "C";

export type HermelinEventName =
  | "hermelin_article_view"
  | "hermelin_ebook_cta_view"
  | "hermelin_ebook_cta_click"
  | "hermelin_ebook_signup_started"
  | "hermelin_ebook_signup_completed"
  | "hermelin_ebook_downloaded";

export interface HermelinTrackingPayload {
  content_id: string;
  cta_position?: HermelinCtaPosition;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer?: string;
  path: string;
  timestamp: string;
  [key: string]: any;
}

// In-memory deduplication set to avoid duplicate views/clicks within the same session
const firedEvents = new Set<string>();

/**
 * Extracts UTM parameters and referrer cleanly
 */
export function getTrackingContext(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer: string;
  path: string;
} {
  if (typeof window === "undefined") {
    return { referrer: "", path: "" };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_content: params.get("utm_content") || undefined,
      referrer: document.referrer || "direct",
      path: window.location.pathname,
    };
  } catch {
    return { referrer: "", path: window.location.pathname || "" };
  }
}

/**
 * Dispatches an event to dataLayer, Umami and LeadOS without exposing any PII.
 */
export function trackHermelinEvent(
  eventName: HermelinEventName,
  position?: HermelinCtaPosition,
  contentId: string = "varianty-nakladaneho-hermelinu",
  dedupKey?: string
): void {
  if (typeof window === "undefined") return;

  const key = dedupKey || (position ? `${eventName}_${position}` : eventName);
  if (firedEvents.has(key)) return;
  firedEvents.add(key);

  const context = getTrackingContext();
  const payload: HermelinTrackingPayload = {
    content_id: contentId,
    ...(position ? { cta_position: position } : {}),
    ...context,
    timestamp: new Date().toISOString(),
  };

  // Google Tag Manager / GA4 dataLayer
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...payload,
    });
  } catch (e) {
    console.debug("[Tracking] dataLayer error", e);
  }

  // Umami analytics
  try {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(eventName, payload);
    }
  } catch (e) {
    console.debug("[Tracking] umami error", e);
  }

  // LeadOS tracking
  try {
    if (typeof window.losTrack === "function") {
      window.losTrack(eventName, payload);
    }
  } catch (e) {
    console.debug("[Tracking] losTrack error", e);
  }
}

export const hermelinAnalytics = {
  trackArticleView: (contentId: string = "varianty-nakladaneho-hermelinu") => {
    trackHermelinEvent("hermelin_article_view", undefined, contentId, `article_view_${contentId}`);
  },

  trackCtaView: (position: HermelinCtaPosition, contentId?: string) => {
    trackHermelinEvent("hermelin_ebook_cta_view", position, contentId, `cta_view_${position}`);
  },

  trackCtaClick: (position: HermelinCtaPosition, contentId?: string) => {
    trackHermelinEvent("hermelin_ebook_cta_click", position, contentId, `cta_click_${position}_${Date.now()}`);
  },

  trackSignupStarted: (position: HermelinCtaPosition, contentId?: string) => {
    trackHermelinEvent("hermelin_ebook_signup_started", position, contentId, `signup_started_${position}_${Date.now()}`);
  },

  trackSignupCompleted: (position: HermelinCtaPosition, contentId?: string) => {
    trackHermelinEvent("hermelin_ebook_signup_completed", position, contentId, `signup_completed_${position}_${Date.now()}`);
  },

  trackDownloaded: (position: HermelinCtaPosition, contentId?: string) => {
    trackHermelinEvent("hermelin_ebook_downloaded", position, contentId, `download_${position}_${Date.now()}`);
  },
};
