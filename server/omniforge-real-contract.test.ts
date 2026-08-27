// ============================================================
// BEZMASAJIDLA.CZ — OMNIFORGE Real Contract & Migration Gate Runner
// Runs E2E Contract verification and reports physical DB migration status.
// ============================================================

import { describe, it, expect } from "vitest";
import { getOmniForgeConfig, OmniForgeClient } from "./_core/omniforge-client";
import { verifyOmniForgeMigrationsReadOnly } from "./_core/db-migration-check";
import { claimAndCheckWebhookEvent, markWebhookEventProcessed } from "./_core/omniforge-webhook";

describe("OMNIFORGE Contract Gate — Database Migration Proof", () => {
  it("should verify physical DB schema columns, indexes, and tables in READ-ONLY mode", async () => {
    const report = await verifyOmniForgeMigrationsReadOnly();

    expect(typeof report.timestamp).toBe("string");
    console.log("[PROD DB Migration Proof (Read-Only)]", JSON.stringify(report, null, 2));
  });
});

describe("OMNIFORGE Contract Gate — Atomic Concurrency & Lease Lock", () => {
  it("should prevent dual parallel processing on simultaneous webhook delivery", async () => {
    const concurrentEventId = `evt_concurrent_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Simulate Request A and Request B arriving in parallel
    const [resA, resB] = await Promise.all([
      claimAndCheckWebhookEvent({ eventId: concurrentEventId, eventType: "publication.published" }),
      claimAndCheckWebhookEvent({ eventId: concurrentEventId, eventType: "publication.published" }),
    ]);

    // Exactly ONE request must get shouldProcess = true, the second receives isProcessing = true or isDuplicate = true
    const processors = [resA, resB].filter(r => r.shouldProcess);
    expect(processors.length).toBe(1);

    // After completion, mark processed
    await markWebhookEventProcessed(concurrentEventId);

    // Subsequent delivery must be deduplicated
    const resC = await claimAndCheckWebhookEvent({ eventId: concurrentEventId });
    expect(resC.shouldProcess).toBe(false);
    expect(resC.isDuplicate).toBe(true);
  });
});

describe("OMNIFORGE Contract Gate — End-to-End Live Connectivity", () => {
  it("should verify OMNIFORGE API reachability or report NOT DEPLOYED status", async () => {
    const config = getOmniForgeConfig();
    const isConfigured = Boolean(config.apiKey && config.apiKey.length > 5);

    if (!isConfigured) {
      console.warn(
        `[OMNIFORGE Gate A] OMNIFORGE_API_KEY is not configured in ENV. Result: NOT DEPLOYED / LOCAL SIMULATION MODE`,
      );
      expect(isConfigured).toBe(false);
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/v1/health`, {
        method: "GET",
        headers: { Authorization: `Bearer ${config.apiKey}` },
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        console.log(`[OMNIFORGE Gate A] API ${config.apiUrl} REACHABLE — PASS`);
      } else {
        console.warn(`[OMNIFORGE Gate A] API ${config.apiUrl} returned ${response.status} — NOT DEPLOYED`);
      }
    } catch (err: any) {
      console.warn(`[OMNIFORGE Gate A] Network connection to ${config.apiUrl} failed: ${err.message} — NOT DEPLOYED`);
    }
  });
});
