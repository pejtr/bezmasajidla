// ============================================================
// BEZMASAJIDLA.CZ — Catering Funnel Conversion Tracking
// Standardized events for GTM / Google Ads, LeadOS & Umami
// PII-safe payloads + strict conversion deduplication
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
  estimated_pipeline_value?: number;
  language?: "cz" | "en";
  viewport?: "mobile" | "tablet" | "desktop";
  event_type?: string;
  guest_count?: number;
  source_section?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  [key: string]: any;
}

export type CateringEventName =
  | "catering_page_view"
  | "catering_cta_calculator_click"
  | "catering_cta_date_click"
  | "catering_form_start"
  | "catering_form_step_1_complete"
  | "catering_form_step_2_complete"
  | "catering_form_step_3_complete"
  | "catering_form_submit_attempt"
  | "catering_form_submit_success"
  | "catering_form_submit_error"
  | "catering_gallery_open"
  | "catering_language_switch"
  // Legacy events retained so existing dashboards / ad mappings do not break.
  | "catering_view"
  | "calculator_started"
  | "calculator_completed"
  | "inquiry_started"
  | "inquiry_submitted";

const trackedEventsSet = new Set<string>();

const PII_KEYS = new Set([
  "name",
  "contactPerson",
  "contact_person",
  "companyName",
  "company_name",
  "email",
  "phone",
  "ico",
  "notes",
  "dietNotes",
  "diet_notes",
]);

function viewportClass(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1280) return "tablet";
  return "desktop";
}

function stripPii(data: CateringTrackingPayload): CateringTrackingPayload {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !PII_KEYS.has(key))
  ) as CateringTrackingPayload;
}

export function getCookieConsentPrefs(): { analytics: boolean; marketing: boolean } {
  if (typeof window === "undefined") return { analytics: false, marketing: false };
  try {
    const stored = localStorage.getItem("bezmasajidla_cookie_consent");
    if (!stored) return { analytics: true, marketing: false };
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
  rawData: CateringTrackingPayload = {}
) {
  if (typeof window === "undefined") return;

  const data = stripPii(rawData);

  // Deduplicate actual lead conversion events only.
  if (eventName === "inquiry_submitted" || eventName === "catering_form_submit_success") {
    const leadCode = data.leadCode || data.transaction_id;
    if (!leadCode) {
      console.warn(`[Tracking] Blocked ${eventName}: missing leadCode / transaction_id`);
      return;
    }

    const dedupKey = `${eventName}:${leadCode}`;
    if (trackedEventsSet.has(dedupKey)) return;

    try {
      if (sessionStorage.getItem(`tracked_${dedupKey}`)) return;
      sessionStorage.setItem(`tracked_${dedupKey}`, String(Date.now()));
    } catch {
      // sessionStorage unavailable/private mode
    }
    trackedEventsSet.add(dedupKey);
  }

  const consent = getCookieConsentPrefs();
  const revenueEstimate =
    Number(data.estimated_pipeline_value ?? data.estimatedRevenue ?? 0) || 0;
  const isLeadConversion =
    eventName === "inquiry_submitted" || eventName === "catering_form_submit_success";
  const conversionValue = isLeadConversion
    ? data.value !== undefined
      ? data.value
      : 1
    : revenueEstimate;

  const language =
    data.language || (window.location.pathname.startsWith("/en/") ? "en" : "cz");
  const viewport = data.viewport || viewportClass();

  const eventPayload = {
    event: eventName,
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    currency: "CZK",
    language,
    viewport,
    event_type: data.event_type,
    guest_count: data.guest_count ?? data.guestCount,
    source_section: data.source_section,
    utm_source: data.utm_source ?? data.utmSource ?? "",
    utm_medium: data.utm_medium ?? data.utmMedium ?? "",
    utm_campaign: data.utm_campaign ?? data.utmCampaign ?? "",
    gclid: data.gclid || "",
    gbraid: data.gbraid || "",
    wbraid: data.wbraid || "",
    transaction_id: data.leadCode || data.transaction_id || undefined,
    consent_analytics: consent.analytics ? "granted" : "denied",
    consent_marketing: consent.marketing ? "granted" : "denied",
    ...data,
    value: conversionValue,
    estimated_pipeline_value: revenueEstimate,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  if (typeof window.losTrack === "function") {
    try {
      window.losTrack(eventName, eventPayload);
    } catch (err) {
      console.warn("[LeadOS track error]", err);
    }
  }

  if (window.umami && typeof window.umami.track === "function" && consent.analytics) {
    try {
      window.umami.track(eventName, {
        package: data.packageName || data.packageId,
        guests: data.guest_count ?? data.guestCount,
        source: data.source_section,
        language,
        viewport,
        value: revenueEstimate,
        lead: data.leadCode,
      });
    } catch (err) {
      console.warn("[Umami track error]", err);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`📊 [Catering Tracking] ${eventName}:`, eventPayload);
  }
}
