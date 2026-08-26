// ============================================================
// BEZMASAJIDLA.CZ — OMNIFORGE Webhook Security & Ingestion
// Strict HMAC-SHA256 signature verification and event deduplication.
// ============================================================

import crypto from "crypto";

const processedEventIds = new Set<string>();
const MAX_EVENT_CACHE_SIZE = 10000;

export interface OmniForgeWebhookPayload {
  eventId: string;
  eventType: "publication.published" | "publication.failed" | "publication.uncertain" | string;
  timestamp: string | number;
  publicationId: string;
  providerPostId?: string;
  publishedAt?: string;
  status?: string;
  error?: string;
  metadata?: {
    internalPostId?: number;
    recipeSlug?: string;
    copyStyle?: string;
    publishingSlot?: string;
    publicationId?: string;
  };
}

/**
 * Validates HMAC-SHA256 signature and timestamp freshness for incoming webhook requests.
 */
export function verifyOmniForgeWebhookSignature(params: {
  signatureHeader?: string;
  timestampHeader?: string;
  rawBody: string | Buffer;
  secret: string;
}): { valid: boolean; reason?: string } {
  const { signatureHeader, timestampHeader, rawBody, secret } = params;

  if (!secret) {
    // Secret not configured: return valid in development/unconfigured mode
    return { valid: true };
  }

  if (!signatureHeader) {
    return { valid: false, reason: "Missing X-OmniForge-Signature header" };
  }

  const timestamp = timestampHeader || "";
  if (timestamp) {
    const timeMs = Number(timestamp) * (timestamp.length === 10 ? 1000 : 1);
    if (!isNaN(timeMs)) {
      const diffMs = Math.abs(Date.now() - timeMs);
      if (diffMs > 5 * 60 * 1000) {
        return { valid: false, reason: "Webhook timestamp expired (> 5 minutes)" };
      }
    }
  }

  const payloadToSign = timestamp ? `${timestamp}.${rawBody.toString("utf8")}` : rawBody.toString("utf8");
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadToSign)
    .digest("hex");

  const cleanSignature = signatureHeader.replace(/^sha256=/, "").trim();

  try {
    const signatureBuffer = Buffer.from(cleanSignature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return { valid: false, reason: "Signature length mismatch" };
    }

    const isMatch = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    return isMatch ? { valid: true } : { valid: false, reason: "Invalid HMAC-SHA256 signature" };
  } catch (err) {
    return { valid: false, reason: "Signature parsing error" };
  }
}

/**
 * Claims a webhook event in DB or checks its current processingStatus.
 *
 * - If event does not exist in DB: Inserts row with processingStatus = "received". Returns { shouldProcess: true, isDuplicate: false }.
 * - If event exists with processingStatus = "processed": Returns { shouldProcess: false, isDuplicate: true }.
 * - If event exists with processingStatus = "received" or "failed": Returns { shouldProcess: true, isDuplicate: false, isRetry: true }.
 */
export async function claimAndCheckWebhookEvent(params: {
  eventId?: string;
  publicationId?: string;
  eventType?: string;
  rawBody?: string | Buffer;
}): Promise<{ shouldProcess: boolean; isDuplicate: boolean; isRetry?: boolean }> {
  const { eventId, publicationId, eventType, rawBody } = params;
  if (!eventId) return { shouldProcess: true, isDuplicate: false };

  // Fast-path in-memory set check for already processed events
  if (processedEventIds.has(eventId)) {
    return { shouldProcess: false, isDuplicate: true };
  }

  try {
    const { getDb } = await import("../db");
    const { omniforgeWebhookEvents } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const db = await getDb();

    if (db) {
      const existing = await db
        .select()
        .from(omniforgeWebhookEvents)
        .where(eq(omniforgeWebhookEvents.eventId, eventId))
        .limit(1);

      if (existing.length > 0) {
        const record = existing[0];
        if (record.processingStatus === "processed") {
          processedEventIds.add(eventId);
          return { shouldProcess: false, isDuplicate: true };
        }
        // Event exists but was not successfully processed ("received" or "failed"): allow retry!
        return { shouldProcess: true, isDuplicate: false, isRetry: true };
      }

      // Record does not exist: insert initial record with processingStatus = 'received'
      const payloadHash = rawBody
        ? crypto.createHash("sha256").update(rawBody).digest("hex").slice(0, 64)
        : null;

      await db.insert(omniforgeWebhookEvents).values({
        eventId,
        publicationId: publicationId || null,
        eventType: eventType || "unknown",
        payloadHash,
        processingStatus: "received",
        receivedAt: new Date(),
        processedAt: null,
      });

      return { shouldProcess: true, isDuplicate: false };
    }
  } catch (err: any) {
    const errStr = String(err);
    if (errStr.includes("1062") || errStr.includes("Duplicate") || errStr.includes("unique")) {
      return { shouldProcess: true, isDuplicate: false, isRetry: true };
    }
  }

  return { shouldProcess: true, isDuplicate: false };
}

/**
 * Marks a claimed webhook event as successfully processed.
 */
export async function markWebhookEventProcessed(eventId: string) {
  processedEventIds.add(eventId);
  try {
    const { getDb } = await import("../db");
    const { omniforgeWebhookEvents } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const db = await getDb();

    if (db) {
      await db
        .update(omniforgeWebhookEvents)
        .set({
          processingStatus: "processed",
          processedAt: new Date(),
          lastError: null,
        })
        .where(eq(omniforgeWebhookEvents.eventId, eventId));
    }
  } catch (err) {
    console.error("[OmniForge Webhook] Error marking event processed:", err);
  }
}

/**
 * Marks a claimed webhook event as failed during processing.
 */
export async function markWebhookEventFailed(eventId: string, error: unknown) {
  try {
    const { getDb } = await import("../db");
    const { omniforgeWebhookEvents } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const db = await getDb();

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (db) {
      await db
        .update(omniforgeWebhookEvents)
        .set({
          processingStatus: "failed",
          lastError: errorMessage.slice(0, 2000),
        })
        .where(eq(omniforgeWebhookEvents.eventId, eventId));
    }
  } catch (err) {
    console.error("[OmniForge Webhook] Error marking event failed:", err);
  }
}
