// ============================================================
// BEZMASAJIDLA.CZ — Unit & Integration Test Suite
// Social -> Revenue Attribution Engine v1.0
// ============================================================

import { describe, it, expect, beforeEach } from "vitest";
import {
  createPragueDateTime,
  getPragueDateParts,
  generateScheduleSlots,
  buildTrackedSocialUrl,
} from "./_core/social-autopilot";
import {
  getSocialAttributionReport,
  type SocialAttributionReport,
} from "./affiliate/attribution";
import { recordAffiliateEvent } from "./affiliate/storage";

describe("Social Attribution — Prague Timezone & Scheduling", () => {
  it("should calculate exact Prague local time for 11:30 and 17:30 slots", () => {
    const summerDate = new Date(2026, 6, 15); // July (CEST = UTC+2)
    const dtSummer1130 = createPragueDateTime(summerDate, 11, 30);
    const dtSummer1730 = createPragueDateTime(summerDate, 17, 30);

    const parts1130 = getPragueDateParts(dtSummer1130);
    expect(parts1130.hour).toBe(11);
    expect(parts1130.minute).toBe(30);

    const parts1730 = getPragueDateParts(dtSummer1730);
    expect(parts1730.hour).toBe(17);
    expect(parts1730.minute).toBe(30);

    const winterDate = new Date(2026, 0, 15); // January (CET = UTC+1)
    const dtWinter1130 = createPragueDateTime(winterDate, 11, 30);
    const partsWinter = getPragueDateParts(dtWinter1130);
    expect(partsWinter.hour).toBe(11);
    expect(partsWinter.minute).toBe(30);
  });

  it("should generate 14-day schedule slots (2 per day)", () => {
    const slots = generateScheduleSlots(14);
    expect(slots.length).toBe(28);
    expect(slots[0].slotLabel).toBe("11:30");
    expect(slots[1].slotLabel).toBe("17:30");
  });
});

describe("Social Attribution — UTM Tracking & URL Construction", () => {
  it("should build tracked social URL with unique post ID in utm_content", () => {
    const fbUrl = buildTrackedSocialUrl({
      recipeSlug: "svickova-bez-masa",
      platform: "facebook",
      copyStyle: "hook_curiosity",
      postId: 101,
    });

    expect(fbUrl).toContain("utm_source=facebook");
    expect(fbUrl).toContain("utm_medium=social_autopilot");
    expect(fbUrl).toContain("utm_campaign=hook_curiosity");
    expect(fbUrl).toContain("utm_content=post_101");

    const igUrl = buildTrackedSocialUrl({
      recipeSlug: "svickova-bez-masa",
      platform: "instagram",
      copyStyle: "quick_tip",
      postId: 102,
    });

    expect(igUrl).toContain("utm_source=instagram");
    expect(igUrl).toContain("utm_content=post_102");
    expect(igUrl).not.toEqual(fbUrl);
  });
});

describe("Social Attribution — Storage & Report Calculations", () => {
  it("should safely compute CTR and Clicks/100 Landings with zero division safety", async () => {
    const report = await getSocialAttributionReport(30);

    expect(report).toBeDefined();
    expect(typeof report.totalLandings).toBe("number");
    expect(typeof report.totalAffiliateImpressions).toBe("number");
    expect(typeof report.totalAffiliateClicks).toBe("number");
    expect(typeof report.overallAffiliateCtr).toBe("number");
    expect(typeof report.overallClicksPer100Landings).toBe("number");

    // Zero-division safety: must never be NaN or Infinity
    expect(isNaN(report.overallAffiliateCtr)).toBe(false);
    expect(isFinite(report.overallAffiliateCtr)).toBe(true);
    expect(isNaN(report.overallClicksPer100Landings)).toBe(false);
    expect(isFinite(report.overallClicksPer100Landings)).toBe(true);
  });

  it("should correctly record social landing event and affiliate click attribution", async () => {
    // Record social landing
    await recordAffiliateEvent({
      eventType: "social_landing",
      placement: "social_landing",
      recipeSlug: "svickova-bez-masa",
      socialPostId: 999,
      attributionSessionId: "test_session_1",
      utmSource: "facebook",
      copyStyle: "secret_ingredient",
      publishingSlot: "11:30",
    });

    // Record impression
    await recordAffiliateEvent({
      eventType: "impression",
      merchant: "ekoclovek",
      productId: "eko_1",
      recipeSlug: "svickova-bez-masa",
      placement: "related_product",
      socialPostId: 999,
      attributionSessionId: "test_session_1",
      utmSource: "facebook",
      copyStyle: "secret_ingredient",
      publishingSlot: "11:30",
    });

    // Record single click
    await recordAffiliateEvent({
      eventType: "click",
      merchant: "ekoclovek",
      productId: "eko_1",
      recipeSlug: "svickova-bez-masa",
      placement: "related_product",
      socialPostId: 999,
      attributionSessionId: "test_session_1",
      utmSource: "facebook",
      copyStyle: "secret_ingredient",
      publishingSlot: "11:30",
    });

    const report = await getSocialAttributionReport();
    expect(report.totalLandings).toBeGreaterThanOrEqual(1);
    expect(report.totalAffiliateImpressions).toBeGreaterThanOrEqual(1);
    expect(report.totalAffiliateClicks).toBeGreaterThanOrEqual(1);
  });
});
