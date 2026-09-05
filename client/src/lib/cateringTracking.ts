// ============================================================
// BEZMASAJIDLA.CZ — Catering Funnel Conversion Tracking
// Standardized events for Google Ads, GTM, LeadOS & Umami
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

export function trackCateringEvent(
  eventName: CateringEventName,
  data: CateringTrackingPayload = {}
) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: eventName,
    page: "/catering",
    timestamp: new Date().toISOString(),
    currency: "CZK",
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

  // 3. Umami Analytics
  if (window.umami && typeof window.umami.track === "function") {
    try {
      window.umami.track(eventName, {
        package: data.packageName || data.packageId,
        guests: data.guestCount,
        value: data.estimatedRevenue,
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
