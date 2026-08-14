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
import type {
  AffiliateMerchant,
  NormalizedAffiliateProduct,
  AffiliatePlacement,
} from "./types";

// In-memory fallback cache (used when DB is not connected or in test mode)
const inMemoryProducts = new Map<string, NormalizedAffiliateProduct>();
const inMemoryEvents: Array<{
  id: number;
  eventType: "impression" | "click";
  merchant: string;
  productId: string;
  recipeSlug?: string;
  placement: string;
  category?: string;
  cuisine?: string;
  referrer?: string;
  createdAt: Date;
}> = [];
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
  eventType: "impression" | "click";
  merchant: string;
  productId: string;
  recipeSlug?: string;
  placement: string;
  category?: string;
  cuisine?: string;
  referrer?: string;
}): Promise<void> {
  const item = {
    id: eventIdCounter++,
    ...event,
    createdAt: new Date(),
  };
  inMemoryEvents.push(item);

  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertAffiliateEvent = {
      eventType: event.eventType,
      merchant: event.merchant,
      productId: event.productId,
      recipeSlug: event.recipeSlug ?? null,
      placement: event.placement,
      category: event.category ?? null,
      cuisine: event.cuisine ?? null,
      referrer: event.referrer ?? null,
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
