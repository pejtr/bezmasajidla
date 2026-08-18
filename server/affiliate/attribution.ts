// ============================================================
// BEZMASAJIDLA.CZ — Social to Revenue Attribution Engine
// Server-authoritative linking of social posts to recipe landings,
// affiliate impressions, clicks, and conversion readiness.
// ============================================================

import { eq, and, gte, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { affiliateEvents, socialPosts } from "../../drizzle/schema";
import { recipes } from "../../client/src/lib/data";

const recipeMap = new Map<string, string>();
recipes.forEach(r => recipeMap.set(r.slug, r.title));

export interface ChannelAttributionBreakdown {
  channel: "facebook" | "instagram" | "other";
  landings: number;
  impressions: number;
  clicks: number;
  affiliateCtr: number; // (clicks / impressions) * 100
  clicksPer100Landings: number; // (clicks / landings) * 100
}

export interface SlotAttributionBreakdown {
  slot: string; // "11:30" | "17:30" | "other"
  landings: number;
  impressions: number;
  clicks: number;
  affiliateCtr: number;
  clicksPer100Landings: number;
}

export interface CopyStyleAttributionBreakdown {
  style: string;
  landings: number;
  impressions: number;
  clicks: number;
  affiliateCtr: number;
  clicksPer100Landings: number;
}

export interface PostAttributionBreakdown {
  postId: number;
  recipeSlug: string;
  recipeTitle: string;
  channel: "facebook" | "instagram";
  slot: string;
  copyStyle: string;
  landings: number;
  impressions: number;
  clicks: number;
  affiliateCtr: number;
  clicksPer100Landings: number;
}

export interface RecipeYieldBreakdown {
  recipeSlug: string;
  recipeTitle: string;
  landings: number;
  impressions: number;
  clicks: number;
  affiliateCtr: number;
  clicksPer100Landings: number;
}

export interface SocialAttributionReport {
  timeframe: string;
  totalLandings: number;
  totalAffiliateImpressions: number;
  totalAffiliateClicks: number;
  overallAffiliateCtr: number;
  overallClicksPer100Landings: number;
  byChannel: ChannelAttributionBreakdown[];
  bySlot: SlotAttributionBreakdown[];
  byCopyStyle: CopyStyleAttributionBreakdown[];
  byPost: PostAttributionBreakdown[];
  byRecipeYield: RecipeYieldBreakdown[];
}

/**
 * Server-authoritative lookup of social post metadata
 */
export async function getAuthoritativePostMetadata(postId: number): Promise<{
  platform: "facebook" | "instagram";
  recipeSlug: string;
  copyStyle?: string;
  publishingSlot?: string;
} | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select({
        id: socialPosts.id,
        platform: socialPosts.platform,
        recipeSlug: socialPosts.recipeSlug,
        copyStyle: socialPosts.copyStyle,
        publishingSlot: socialPosts.publishingSlot,
      })
      .from(socialPosts)
      .where(eq(socialPosts.id, postId))
      .limit(1);

    if (rows.length === 0) return null;
    const p = rows[0];
    return {
      platform: p.platform,
      recipeSlug: p.recipeSlug || "",
      copyStyle: p.copyStyle || undefined,
      publishingSlot: p.publishingSlot || undefined,
    };
  } catch (err) {
    console.warn("[Attribution] DB post lookup failed:", err);
    return null;
  }
}

/**
 * Records a verified social landing event (denominator for social funnel)
 */
export async function recordSocialLanding(payload: {
  socialPostId: number;
  recipeSlug: string;
  attributionSessionId?: string;
  referrer?: string;
}): Promise<void> {
  const meta = await getAuthoritativePostMetadata(payload.socialPostId);
  const { recordAffiliateEvent } = await import("./storage");

  await recordAffiliateEvent({
    eventType: "social_landing",
    merchant: "social",
    productId: "none",
    placement: "social_landing",
    recipeSlug: payload.recipeSlug || meta?.recipeSlug || undefined,
    socialPostId: payload.socialPostId,
    attributionSessionId: payload.attributionSessionId,
    utmSource: meta?.platform || "social",
    utmMedium: "social_autopilot",
    utmCampaign: meta?.copyStyle || undefined,
    copyStyle: meta?.copyStyle || undefined,
    publishingSlot: meta?.publishingSlot || undefined,
    referrer: payload.referrer,
  });
}

/**
 * Generates aggregated Social -> Revenue Attribution Report with exact metric naming
 */
export async function getSocialAttributionReport(timeframeDays?: number): Promise<SocialAttributionReport> {
  const db = await getDb();

  let events: Array<{
    eventType: string;
    merchant: string;
    productId: string;
    recipeSlug?: string | null;
    socialPostId?: number | null;
    attributionSessionId?: string | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    copyStyle?: string | null;
    publishingSlot?: string | null;
    createdAt: Date;
  }> = [];

  if (db) {
    const conditions = [];
    if (timeframeDays) {
      const cutoff = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);
      conditions.push(gte(affiliateEvents.createdAt, cutoff));
    }

    events = await db
      .select()
      .from(affiliateEvents)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  } else {
    const { inMemoryEvents } = await import("./storage");
    const cutoff = timeframeDays ? Date.now() - timeframeDays * 24 * 60 * 60 * 1000 : 0;
    events = inMemoryEvents.filter(e => e.createdAt.getTime() >= cutoff);
  }

  // Group events
  const channelMap = new Map<string, { landings: number; impressions: number; clicks: number }>();
  const slotMap = new Map<string, { landings: number; impressions: number; clicks: number }>();
  const styleMap = new Map<string, { landings: number; impressions: number; clicks: number }>();
  const postMap = new Map<number, {
    recipeSlug: string;
    channel: "facebook" | "instagram";
    slot: string;
    copyStyle: string;
    landings: number;
    impressions: number;
    clicks: number;
  }>();
  const recipeMapStats = new Map<string, { landings: number; impressions: number; clicks: number }>();

  let totalLandings = 0;
  let totalImpressions = 0;
  let totalClicks = 0;

  for (const e of events) {
    const isLanding = e.eventType === "social_landing";
    const isImpression = e.eventType === "impression" && Boolean(e.socialPostId);
    const isClick = e.eventType === "click" && Boolean(e.socialPostId);

    if (!isLanding && !isImpression && !isClick) continue;

    if (isLanding) totalLandings++;
    if (isImpression) totalImpressions++;
    if (isClick) totalClicks++;

    const channelKey = (e.utmSource === "facebook" || e.utmSource === "instagram") ? e.utmSource : "other";
    const slotKey = e.publishingSlot || "11:30";
    const styleKey = e.copyStyle || "hook_curiosity";
    const slug = e.recipeSlug || "unknown";

    // Channel stats
    const cStat = channelMap.get(channelKey) || { landings: 0, impressions: 0, clicks: 0 };
    if (isLanding) cStat.landings++;
    if (isImpression) cStat.impressions++;
    if (isClick) cStat.clicks++;
    channelMap.set(channelKey, cStat);

    // Slot stats
    const sStat = slotMap.get(slotKey) || { landings: 0, impressions: 0, clicks: 0 };
    if (isLanding) sStat.landings++;
    if (isImpression) sStat.impressions++;
    if (isClick) sStat.clicks++;
    slotMap.set(slotKey, sStat);

    // Style stats
    const stStat = styleMap.get(styleKey) || { landings: 0, impressions: 0, clicks: 0 };
    if (isLanding) stStat.landings++;
    if (isImpression) stStat.impressions++;
    if (isClick) stStat.clicks++;
    styleMap.set(styleKey, stStat);

    // Recipe stats
    const rStat = recipeMapStats.get(slug) || { landings: 0, impressions: 0, clicks: 0 };
    if (isLanding) rStat.landings++;
    if (isImpression) rStat.impressions++;
    if (isClick) rStat.clicks++;
    recipeMapStats.set(slug, rStat);

    // Post stats
    if (e.socialPostId) {
      const pStat = postMap.get(e.socialPostId) || {
        recipeSlug: slug,
        channel: (e.utmSource === "facebook" ? "facebook" : "instagram"),
        slot: slotKey,
        copyStyle: styleKey,
        landings: 0,
        impressions: 0,
        clicks: 0,
      };
      if (isLanding) pStat.landings++;
      if (isImpression) pStat.impressions++;
      if (isClick) pStat.clicks++;
      postMap.set(e.socialPostId, pStat);
    }
  }

  const calcCtr = (clicks: number, impr: number) => (impr > 0 ? Number(((clicks / impr) * 100).toFixed(2)) : 0);
  const calcClicksPer100 = (clicks: number, landings: number) =>
    landings > 0 ? Number(((clicks / landings) * 100).toFixed(2)) : 0;

  const byChannel: ChannelAttributionBreakdown[] = Array.from(channelMap.entries()).map(([k, v]) => ({
    channel: k as "facebook" | "instagram" | "other",
    landings: v.landings,
    impressions: v.impressions,
    clicks: v.clicks,
    affiliateCtr: calcCtr(v.clicks, v.impressions),
    clicksPer100Landings: calcClicksPer100(v.clicks, v.landings),
  }));

  const bySlot: SlotAttributionBreakdown[] = Array.from(slotMap.entries()).map(([k, v]) => ({
    slot: k,
    landings: v.landings,
    impressions: v.impressions,
    clicks: v.clicks,
    affiliateCtr: calcCtr(v.clicks, v.impressions),
    clicksPer100Landings: calcClicksPer100(v.clicks, v.landings),
  }));

  const byCopyStyle: CopyStyleAttributionBreakdown[] = Array.from(styleMap.entries()).map(([k, v]) => ({
    style: k,
    landings: v.landings,
    impressions: v.impressions,
    clicks: v.clicks,
    affiliateCtr: calcCtr(v.clicks, v.impressions),
    clicksPer100Landings: calcClicksPer100(v.clicks, v.landings),
  }));

  const byPost: PostAttributionBreakdown[] = Array.from(postMap.entries())
    .map(([postId, v]) => ({
      postId,
      recipeSlug: v.recipeSlug,
      recipeTitle: recipeMap.get(v.recipeSlug) || v.recipeSlug,
      channel: v.channel,
      slot: v.slot,
      copyStyle: v.copyStyle,
      landings: v.landings,
      impressions: v.impressions,
      clicks: v.clicks,
      affiliateCtr: calcCtr(v.clicks, v.impressions),
      clicksPer100Landings: calcClicksPer100(v.clicks, v.landings),
    }))
    .sort((a, b) => b.clicks - a.clicks || b.landings - a.landings)
    .slice(0, 50);

  const byRecipeYield: RecipeYieldBreakdown[] = Array.from(recipeMapStats.entries())
    .map(([slug, v]) => ({
      recipeSlug: slug,
      recipeTitle: recipeMap.get(slug) || slug,
      landings: v.landings,
      impressions: v.impressions,
      clicks: v.clicks,
      affiliateCtr: calcCtr(v.clicks, v.impressions),
      clicksPer100Landings: calcClicksPer100(v.clicks, v.landings),
    }))
    .sort((a, b) => b.clicks - a.clicks || b.landings - a.landings)
    .slice(0, 25);

  return {
    timeframe: timeframeDays ? `${timeframeDays}d` : "all",
    totalLandings,
    totalAffiliateImpressions: totalImpressions,
    totalAffiliateClicks: totalClicks,
    overallAffiliateCtr: calcCtr(totalClicks, totalImpressions),
    overallClicksPer100Landings: calcClicksPer100(totalClicks, totalLandings),
    byChannel,
    bySlot,
    byCopyStyle,
    byPost,
    byRecipeYield,
  };
}
