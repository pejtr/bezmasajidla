// ============================================================
// BEZMASAJIDLA.CZ — Catering Funnel Conversion Tracking
// Standardized events for Google Ads, GTM, LeadOS & Umami
// Strict deduplication by leadCode + Consent Gate
// ============================================================

declare global {
  interface Window {
    dataLayer?: any[];
    losTrack?: (eventName: string, data?: Record<string, any>) => void;
    umami?: {
      track: (eventName: string, data?: Record<string, any>) => void;
    };
  }
}

export interface CateringTrackingPayload {
  packageId?: string;
  packageName?: string;
  guestCount?: number;
  estimatedRevenue?: number;
  leadCode?: string;
  transaction_id?: string;
  value?: number;
  currency?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  [key: string]: any;
}

export type CateringEventName =
  | "catering_view"
  | "calculator_started"
  | "calculator_completed"
  | "inquiry_started"
  | "inquiry_submitted";

// In-memory deduplication set
const trackedEventsSet = new Set<string>();

/**
 * Checks cookie consent preferences from localStorage
 */
export function getCookieConsentPrefs(): { analytics: boolean; marketing: boolean } {
  if (typeof window === "undefined") return { analytics: false, marketing: false };
  try {
    const stored = localStorage.getItem("bezmasajidla_cookie_consent");
    if (!stored) return { analytics: true, marketing: false }; // default: basic anonymous analytics allowed, marketing off
    const parsed = JSON.parse(stored);
    return {
      analytics: Boolean(parsed?.prefs?.analytics ?? true),
      marketing: Boolean(parsed?.prefs?.marketing ?? false),
    };
  } catch {
    return { analytics: true, marketing: false };
  }
}

export function trackCateringEvent(
  eventName: CateringEventName,
  data: CateringTrackingPayload = {}
) {
  if (typeof window === "undefined") return;

  // 1. Strict Deduplication Guard for inquiry_submitted
  if (eventName === "inquiry_submitted") {
    const leadCode = data.leadCode || data.transaction_id;
    if (!leadCode) {
      console.warn("[Tracking] Blocked inquiry_submitted: missing leadCode / transaction_id");
      return;
    }

    const dedupKey = `inquiry_submitted:${leadCode}`;
    if (trackedEventsSet.has(dedupKey)) {
      console.warn(`[Tracking] Deduplicated event ${dedupKey} (already fired in-memory)`);
      return;
    }

    try {
      if (sessionStorage.getItem(`tracked_${dedupKey}`)) {
        console.warn(`[Tracking] Deduplicated event ${dedupKey} (already fired in session)`);
        return;
      }
      sessionStorage.setItem(`tracked_${dedupKey}`, String(Date.now()));
    } catch {
      // sessionStorage unavailable/private mode
    }

    trackedEventsSet.add(dedupKey);
  }

  const consent = getCookieConsentPrefs();
  const revenueValue = data.estimatedRevenue || data.value || 0;

  const eventPayload = {
    event: eventName,
    page: "/catering",
    timestamp: new Date().toISOString(),
    currency: "CZK",
    value: revenueValue,
    transaction_id: data.leadCode || undefined,
    consent_analytics: consent.analytics ? "granted" : "denied",
    consent_marketing: consent.marketing ? "granted" : "denied",
    ...data,
  };

  // 1. Google Tag Manager / Google Ads DataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  // 2. LeadOS Universal Traffic Pixel
  if (typeof window.losTrack === "function") {
    try {
      window.losTrack(eventName, eventPayload);
    } catch (err) {
      console.warn("[LeadOS track error]", err);
    }
  }

  // 3. Umami Analytics (Client-side tracking via window.umami.track)
  if (window.umami && typeof window.umami.track === "function" && consent.analytics) {
    try {
      window.umami.track(eventName, {
        package: data.packageName || data.packageId,
        guests: data.guestCount,
        value: revenueValue,
        lead: data.leadCode,
      });
    } catch (err) {
      console.warn("[Umami track error]", err);
    }
  }

  // Debug log in dev
  if (process.env.NODE_ENV !== "production") {
    console.log(`📊 [Catering Tracking] ${eventName}:`, eventPayload);
  }
}
