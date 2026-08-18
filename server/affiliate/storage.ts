// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Persistence & Storage Layer
// Backed by MySQL Drizzle with resilient in-memory fallback.
// ============================================================

import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  affiliateProducts,
  affiliateEvents,
  affiliateSyncLogs,
  type InsertAffiliateProduct,
  type InsertAffiliateEvent,
  type InsertAffiliateSyncLog,
  type AffiliateProductRecord,
} from "../../drizzle/schema";
import { recipes } from "../../client/src/lib/data";
import type {
  AffiliateMerchant,
  NormalizedAffiliateProduct,
  AffiliatePlacement,
  AffiliateKpiReport,
  MerchantKpiBreakdown,
  PlacementKpiBreakdown,
  CuisineKpiBreakdown,
  CategoryKpiBreakdown,
  RecipeKpiBreakdown,
} from "./types";

// In-memory fallback cache (used when DB is not connected or in test mode)
const inMemoryProducts = new Map<string, NormalizedAffiliateProduct>();
export interface InMemoryAffiliateEvent {
  id: number;
  eventType: "impression" | "click" | "social_landing";
  merchant: string;
  productId: string;
  recipeSlug?: string;
  placement: string;
  category?: string;
  cuisine?: string;
  referrer?: string;
  socialPostId?: number;
  attributionSessionId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  copyStyle?: string;
  publishingSlot?: string;
  createdAt: Date;
}

export const inMemoryEvents: InMemoryAffiliateEvent[] = [];
const inMemorySyncLogs: Array<{
  id: number;
  merchant: string;
  status: "success" | "failed";
  itemsFetched: number;
  itemsAccepted: number;
  itemsRejected: number;
  itemsInserted: number;
  itemsUpdated: number;
  itemsDeactivated: number;
  durationMs: number;
  errorMessage?: string;
  createdAt: Date;
}> = [];

let eventIdCounter = 1;
let syncLogIdCounter = 1;

export async function getAllActiveAffiliateProducts(): Promise<NormalizedAffiliateProduct[]> {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryProducts.values()).filter(p => p.active);
  }

  try {
    const rows = await db
      .select()
      .from(affiliateProducts)
      .where(eq(affiliateProducts.active, true));

    return rows.map(mapRowToNormalizedProduct);
  } catch (err) {
    console.warn("[AffiliateStorage] DB fetch failed, falling back to memory:", err);
    return Array.from(inMemoryProducts.values()).filter(p => p.active);
  }
}

export async function getAffiliateProductsByMerchant(
  merchant: AffiliateMerchant
): Promise<NormalizedAffiliateProduct[]> {
  const db = await getDb();
  if (!db) {
    return Array.from(inMemoryProducts.values()).filter(
      p => p.merchant === merchant && p.active
    );
  }

  try {
    const rows = await db
      .select()
      .from(affiliateProducts)
      .where(
        and(
          eq(affiliateProducts.merchant, merchant),
          eq(affiliateProducts.active, true)
        )
      );

    return rows.map(mapRowToNormalizedProduct);
  } catch (err) {
    console.warn("[AffiliateStorage] DB fetch failed, falling back to memory:", err);
    return Array.from(inMemoryProducts.values()).filter(
      p => p.merchant === merchant && p.active
    );
  }
}

export async function getAffiliateProductById(
  id: string
): Promise<NormalizedAffiliateProduct | undefined> {
  const db = await getDb();
  if (!db) {
    return inMemoryProducts.get(id);
  }

  try {
    const rows = await db
      .select()
      .from(affiliateProducts)
      .where(eq(affiliateProducts.id, id))
      .limit(1);

    if (rows.length === 0) return inMemoryProducts.get(id);
    return mapRowToNormalizedProduct(rows[0]);
  } catch (err) {
    return inMemoryProducts.get(id);
  }
}

export async function saveAffiliateProducts(
  merchant: AffiliateMerchant,
  freshProducts: NormalizedAffiliateProduct[]
): Promise<{ inserted: number; updated: number; deactivated: number }> {
  const freshMap = new Map(freshProducts.map(p => [p.id, p]));
  let inserted = 0;
  let updated = 0;
  let deactivated = 0;

  // Always update in-memory cache
  for (const [id, product] of Array.from(inMemoryProducts.entries())) {
    if (product.merchant === merchant && !freshMap.has(id)) {
      product.active = false;
      product.updatedAt = new Date();
      deactivated++;
    }
  }

  for (const fresh of freshProducts) {
    if (inMemoryProducts.has(fresh.id)) {
      const existing = inMemoryProducts.get(fresh.id)!;
      inMemoryProducts.set(fresh.id, {
        ...existing,
        ...fresh,
        updatedAt: new Date(),
      });
      updated++;
    } else {
      inMemoryProducts.set(fresh.id, {
        ...fresh,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      inserted++;
    }
  }

  const db = await getDb();
  if (!db) {
    return { inserted, updated, deactivated };
  }

  try {
    const existingDbRows = await db
      .select({ id: affiliateProducts.id })
      .from(affiliateProducts)
      .where(eq(affiliateProducts.merchant, merchant));

    const existingIds = new Set(existingDbRows.map(r => r.id));

    // Batch upsert fresh products
    for (const p of freshProducts) {
      const values: InsertAffiliateProduct = {
        id: p.id,
        externalId: p.externalId,
        merchant: p.merchant,
        title: p.title,
        description: p.description ?? null,
        sourceUrl: p.sourceUrl ?? null,
        affiliateUrl: p.affiliateUrl,
        imageUrl: p.imageUrl ?? null,
        price: p.price ? p.price.toString() : null,
        currency: p.currency,
        category: p.category ?? null,
        tags: JSON.stringify(p.tags),
        cuisines: JSON.stringify(p.cuisines),
        ingredients: JSON.stringify(p.ingredients),
        intents: JSON.stringify(p.intents),
        active: true,
        relevanceScore: p.relevanceScore ? p.relevanceScore.toString() : "1.00",
        lastSeenAt: p.lastSeenAt,
      };

      await db
        .insert(affiliateProducts)
        .values(values)
        .onDuplicateKeyUpdate({
          set: {
            title: values.title,
            description: values.description,
            sourceUrl: values.sourceUrl,
            affiliateUrl: values.affiliateUrl,
            imageUrl: values.imageUrl,
            price: values.price,
            currency: values.currency,
            category: values.category,
            tags: values.tags,
            cuisines: values.cuisines,
            ingredients: values.ingredients,
            intents: values.intents,
            active: true,
            relevanceScore: values.relevanceScore,
            lastSeenAt: values.lastSeenAt,
            updatedAt: new Date(),
          },
        });
    }

    // Deactivate missing
    for (const existingId of Array.from(existingIds)) {
      if (!freshMap.has(existingId)) {
        await db
          .update(affiliateProducts)
          .set({ active: false, updatedAt: new Date() })
          .where(eq(affiliateProducts.id, existingId));
      }
    }
  } catch (err) {
    console.error("[AffiliateStorage] DB batch save error:", err);
  }

  return { inserted, updated, deactivated };
}

export async function recordAffiliateEvent(event: {
  eventType: "impression" | "click" | "social_landing";
  merchant?: string;
  productId?: string;
  recipeSlug?: string;
  placement: string;
  category?: string;
  cuisine?: string;
  referrer?: string;
  socialPostId?: number;
  attributionSessionId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  copyStyle?: string;
  publishingSlot?: string;
}): Promise<void> {
  let authoritativeMeta = null;
  if (event.socialPostId) {
    try {
      const { getAuthoritativePostMetadata } = await import("./attribution");
      authoritativeMeta = await getAuthoritativePostMetadata(event.socialPostId);
    } catch {
      /* ignore */
    }
  }

  const finalUtmSource = authoritativeMeta?.platform || event.utmSource;
  const finalCopyStyle = authoritativeMeta?.copyStyle || event.copyStyle;
  const finalSlot = authoritativeMeta?.publishingSlot || event.publishingSlot;

  const item = {
    id: eventIdCounter++,
    eventType: event.eventType,
    merchant: event.merchant || "none",
    productId: event.productId || "none",
    recipeSlug: event.recipeSlug,
    placement: event.placement,
    category: event.category,
    cuisine: event.cuisine,
    referrer: event.referrer,
    socialPostId: event.socialPostId,
    attributionSessionId: event.attributionSessionId,
    utmSource: finalUtmSource,
    utmMedium: event.utmMedium || (event.socialPostId ? "social_autopilot" : undefined),
    utmCampaign: finalCopyStyle || event.utmCampaign,
    copyStyle: finalCopyStyle,
    publishingSlot: finalSlot,
    createdAt: new Date(),
  };
  inMemoryEvents.push(item);

  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertAffiliateEvent = {
      eventType: event.eventType,
      merchant: event.merchant || "none",
      productId: event.productId || "none",
      recipeSlug: event.recipeSlug ?? null,
      placement: event.placement,
      category: event.category ?? null,
      cuisine: event.cuisine ?? null,
      referrer: event.referrer ?? null,
      socialPostId: event.socialPostId ?? null,
      attributionSessionId: event.attributionSessionId ?? null,
      utmSource: finalUtmSource ?? null,
      utmMedium: event.utmMedium || (event.socialPostId ? "social_autopilot" : null),
      utmCampaign: finalCopyStyle || event.utmCampaign || null,
      copyStyle: finalCopyStyle ?? null,
      publishingSlot: finalSlot ?? null,
    };
    await db.insert(affiliateEvents).values(values);
  } catch (err) {
    console.error("[AffiliateStorage] Failed to record event in DB:", err);
  }
}

export async function recordAffiliateSyncLog(log: {
  merchant: string;
  status: "success" | "failed";
  itemsFetched: number;
  itemsAccepted: number;
  itemsRejected: number;
  itemsInserted: number;
  itemsUpdated: number;
  itemsDeactivated: number;
  durationMs: number;
  errorMessage?: string;
}): Promise<void> {
  const item = {
    id: syncLogIdCounter++,
    ...log,
    createdAt: new Date(),
  };
  inMemorySyncLogs.unshift(item);

  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertAffiliateSyncLog = {
      merchant: log.merchant,
      status: log.status,
      itemsFetched: log.itemsFetched,
      itemsAccepted: log.itemsAccepted,
      itemsRejected: log.itemsRejected,
      itemsInserted: log.itemsInserted,
      itemsUpdated: log.itemsUpdated,
      itemsDeactivated: log.itemsDeactivated,
      durationMs: log.durationMs,
      errorMessage: log.errorMessage ?? null,
    };
    await db.insert(affiliateSyncLogs).values(values);
  } catch (err) {
    console.error("[AffiliateStorage] Failed to record sync log:", err);
  }
}

export async function getAffiliateDiagnosticStats(): Promise<{
  activeCounts: Record<string, number>;
  totalProducts: number;
  recentSyncLogs: any[];
  impressionsCount: number;
  clicksCount: number;
  ctr: string;
}> {
  const products = await getAllActiveAffiliateProducts();
  const activeCounts: Record<string, number> = { ekoclovek: 0, zazitky: 0 };
  for (const p of products) {
    activeCounts[p.merchant] = (activeCounts[p.merchant] || 0) + 1;
  }

  const impressions = inMemoryEvents.filter(e => e.eventType === "impression").length;
  const clicks = inMemoryEvents.filter(e => e.eventType === "click").length;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + "%" : "0.00%";

  return {
    activeCounts,
    totalProducts: products.length,
    recentSyncLogs: inMemorySyncLogs.slice(0, 10),
    impressionsCount: impressions,
    clicksCount: clicks,
    ctr,
  };
}

export async function getDetailedAffiliateKpis(timeframeDays?: number): Promise<AffiliateKpiReport> {
  const cutoffDate = timeframeDays ? new Date(Date.now() - timeframeDays * 86400000) : null;
  
  // Filter events within timeframe
  const events = inMemoryEvents.filter(e => !cutoffDate || new Date(e.createdAt) >= cutoffDate);
  
  // Calculate total impressions & clicks
  const totalImpressions = events.filter(e => e.eventType === "impression").length;
  const totalClicks = events.filter(e => e.eventType === "click").length;
  const overallCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;

  // Active products count
  const activeProducts = await getAllActiveAffiliateProducts();
  const activeByMerchant: Record<string, number> = { ekoclovek: 0, zazitky: 0 };
  for (const p of activeProducts) {
    activeByMerchant[p.merchant] = (activeByMerchant[p.merchant] || 0) + 1;
  }

  // 1. By Merchant Breakdown
  const merchants: AffiliateMerchant[] = ["ekoclovek", "zazitky"];
  const merchantNames: Record<AffiliateMerchant, string> = {
    ekoclovek: "Ekočlověk (Semínka & Bylinky)",
    zazitky: "Zážitky.cz (Kurzy & Gastro)",
  };
  const byMerchant: MerchantKpiBreakdown[] = merchants.map(m => {
    const mImpr = events.filter(e => e.merchant === m && e.eventType === "impression").length;
    const mClicks = events.filter(e => e.merchant === m && e.eventType === "click").length;
    const mCtr = mImpr > 0 ? Number(((mClicks / mImpr) * 100).toFixed(2)) : 0;
    return {
      merchant: m,
      displayName: merchantNames[m],
      impressions: mImpr,
      clicks: mClicks,
      ctr: mCtr,
      activeProducts: activeByMerchant[m] || 0,
    };
  });

  // 2. By Placement Breakdown
  const placements: AffiliatePlacement[] = ["related_product", "related_experience", "recipe_ingredient", "article_inline"];
  const placementNames: Record<AffiliatePlacement, string> = {
    related_product: "🌱 Pod nákupním košíkem (Ekočlověk)",
    related_experience: "👨‍🍳 Pod FAQ sekcí (Zážitky.cz)",
    recipe_ingredient: "🛒 U suroviny receptu",
    article_inline: "📰 V textu článku",
  };
  const byPlacement: PlacementKpiBreakdown[] = placements.map(pl => {
    const plImpr = events.filter(e => e.placement === pl && e.eventType === "impression").length;
    const plClicks = events.filter(e => e.placement === pl && e.eventType === "click").length;
    const plCtr = plImpr > 0 ? Number(((plClicks / plImpr) * 100).toFixed(2)) : 0;
    return {
      placement: pl,
      displayName: placementNames[pl] || pl,
      impressions: plImpr,
      clicks: plClicks,
      ctr: plCtr,
    };
  });

  // Recipe lookup map from static recipes
  const recipeMap = new Map(recipes.map(r => [r.slug, r]));

  // 3. By Cuisine Breakdown (distinct dimension)
  const cuisineStats = new Map<string, { impressions: number; clicks: number }>();
  // 4. By Category Breakdown (distinct dimension)
  const categoryStats = new Map<string, { impressions: number; clicks: number }>();
  // 5. By Recipe Breakdown
  const recipeStats = new Map<string, { title: string; category?: string; cuisine?: string; impressions: number; clicks: number }>();

  for (const e of events) {
    const rec = e.recipeSlug ? recipeMap.get(e.recipeSlug) : undefined;
    const cuisine = e.cuisine || rec?.cuisine || "Mezinárodní";
    const category = e.category || rec?.category || "Ostatní";
    const slug = e.recipeSlug || "unassigned";
    const title = rec?.title || (slug !== "unassigned" ? slug : "Ostatní stránky");

    // Cuisine
    if (!cuisineStats.has(cuisine)) cuisineStats.set(cuisine, { impressions: 0, clicks: 0 });
    const cStat = cuisineStats.get(cuisine)!;
    if (e.eventType === "impression") cStat.impressions++;
    else if (e.eventType === "click") cStat.clicks++;

    // Category
    if (!categoryStats.has(category)) categoryStats.set(category, { impressions: 0, clicks: 0 });
    const catStat = categoryStats.get(category)!;
    if (e.eventType === "impression") catStat.impressions++;
    else if (e.eventType === "click") catStat.clicks++;

    // Recipe
    if (slug !== "unassigned") {
      if (!recipeStats.has(slug)) recipeStats.set(slug, { title, category, cuisine, impressions: 0, clicks: 0 });
      const rStat = recipeStats.get(slug)!;
      if (e.eventType === "impression") rStat.impressions++;
      else if (e.eventType === "click") rStat.clicks++;
    }
  }

  const byCuisine: CuisineKpiBreakdown[] = Array.from(cuisineStats.entries())
    .map(([cuisine, stat]) => ({
      cuisine,
      impressions: stat.impressions,
      clicks: stat.clicks,
      ctr: stat.impressions > 0 ? Number(((stat.clicks / stat.impressions) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  const byCategory: CategoryKpiBreakdown[] = Array.from(categoryStats.entries())
    .map(([category, stat]) => ({
      category,
      impressions: stat.impressions,
      clicks: stat.clicks,
      ctr: stat.impressions > 0 ? Number(((stat.clicks / stat.impressions) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  const topRecipes: RecipeKpiBreakdown[] = Array.from(recipeStats.entries())
    .map(([recipeSlug, stat]) => ({
      recipeSlug,
      recipeTitle: stat.title,
      category: stat.category,
      cuisine: stat.cuisine,
      impressions: stat.impressions,
      clicks: stat.clicks,
      ctr: stat.impressions > 0 ? Number(((stat.clicks / stat.impressions) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, 20);

  return {
    timeframeDays,
    totalImpressions,
    totalClicks,
    overallCtr,
    byMerchant,
    byPlacement,
    byCuisine,
    byCategory,
    topRecipes,
    generatedAt: new Date(),
  };
}

function mapRowToNormalizedProduct(row: AffiliateProductRecord): NormalizedAffiliateProduct {
  return {
    id: row.id,
    externalId: row.externalId || row.id,
    merchant: row.merchant as AffiliateMerchant,
    title: row.title,
    description: row.description || undefined,
    sourceUrl: row.sourceUrl || undefined,
    affiliateUrl: row.affiliateUrl,
    imageUrl: row.imageUrl || undefined,
    price: row.price ? parseFloat(row.price) : undefined,
    currency: row.currency || "CZK",
    category: row.category || undefined,
    tags: safeJsonParse<string[]>(row.tags, []),
    cuisines: safeJsonParse<string[]>(row.cuisines, []),
    ingredients: safeJsonParse<string[]>(row.ingredients, []),
    intents: safeJsonParse<string[]>(row.intents, []),
    active: row.active,
    relevanceScore: row.relevanceScore ? parseFloat(row.relevanceScore) : 1,
    lastSeenAt: row.lastSeenAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
