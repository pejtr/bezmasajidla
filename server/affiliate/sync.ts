// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Feed Synchronizer
// Idempotent background synchronization and audit logging.
// ============================================================

import type { AffiliateMerchant, SyncResult, AffiliateProvider } from "./types";
import { EhubEkoclovekProvider } from "./providers/ekoclovek";
import { EhubZazitkyProvider } from "./providers/zazitky";
import { saveAffiliateProducts, recordAffiliateSyncLog } from "./storage";

const providers: Record<AffiliateMerchant, AffiliateProvider> = {
  ekoclovek: new EhubEkoclovekProvider(),
  zazitky: new EhubZazitkyProvider(),
};

export async function syncAffiliateProvider(
  merchant: AffiliateMerchant
): Promise<SyncResult> {
  const provider = providers[merchant];
  if (!provider) {
    throw new Error(`[AffiliateSync] Unknown provider for merchant: ${merchant}`);
  }

  const startTime = Date.now();
  console.log(`[AffiliateSync] Starting feed sync for merchant: ${merchant}...`);

  try {
    const rawXml = await provider.fetchFeed();
    const rawItems = await provider.parseFeed(rawXml);
    const normalizedItems = provider.filterAndNormalize(rawItems);

    const itemsFetched = rawItems.length;
    const itemsAccepted = normalizedItems.length;
    const itemsRejected = itemsFetched - itemsAccepted;

    const { inserted, updated, deactivated } = await saveAffiliateProducts(
      merchant,
      normalizedItems
    );

    const durationMs = Date.now() - startTime;
    console.log(
      `[AffiliateSync:${merchant}] Sync SUCCESS: ${itemsFetched} fetched, ${itemsAccepted} accepted, ${itemsRejected} rejected. (${inserted} inserted, ${updated} updated, ${deactivated} deactivated) in ${durationMs}ms.`
    );

    const result: SyncResult = {
      merchant,
      status: "success",
      itemsFetched,
      itemsAccepted,
      itemsRejected,
      itemsInserted: inserted,
      itemsUpdated: updated,
      itemsDeactivated: deactivated,
      durationMs,
    };

    await recordAffiliateSyncLog(result);
    return result;
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error?.message || String(error);
    console.error(`[AffiliateSync:${merchant}] Sync FAILED: ${errorMessage}`);

    const result: SyncResult = {
      merchant,
      status: "failed",
      itemsFetched: 0,
      itemsAccepted: 0,
      itemsRejected: 0,
      itemsInserted: 0,
      itemsUpdated: 0,
      itemsDeactivated: 0,
      durationMs,
      errorMessage,
    };

    await recordAffiliateSyncLog(result);
    return result;
  }
}

export async function syncAllAffiliateFeeds(): Promise<Record<AffiliateMerchant, SyncResult>> {
  const merchants: AffiliateMerchant[] = ["ekoclovek", "zazitky"];
  const results = {} as Record<AffiliateMerchant, SyncResult>;

  for (const m of merchants) {
    try {
      results[m] = await syncAffiliateProvider(m);
    } catch (err: any) {
      results[m] = {
        merchant: m,
        status: "failed",
        itemsFetched: 0,
        itemsAccepted: 0,
        itemsRejected: 0,
        itemsInserted: 0,
        itemsUpdated: 0,
        itemsDeactivated: 0,
        durationMs: 0,
        errorMessage: err?.message || String(err),
      };
    }
  }

  return results;
}

// Optional interval sync starter for server init
let syncTimer: NodeJS.Timeout | null = null;

export function startAffiliateSyncCronJob(intervalHours = 12) {
  if (syncTimer) return;
  // Trigger initial sync in background after 5 seconds so server startup is instant
  setTimeout(() => {
    syncAllAffiliateFeeds().catch(err =>
      console.warn("[AffiliateSync] Background startup sync error:", err)
    );
  }, 5000);

  syncTimer = setInterval(
    () => {
      syncAllAffiliateFeeds().catch(err =>
        console.warn("[AffiliateSync] Scheduled sync error:", err)
      );
    },
    intervalHours * 60 * 60 * 1000
  );
}
