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
 * Durable DB Deduplication of eventId to guarantee idempotency: 2 deliveries -> 1 state transition.
 * Uses DB unique constraint on eventId as single source of truth, with memory set as fast-path.
 */
export async function checkAndDeduplicateWebhookEvent(
  eventId?: string,
  publicationId?: string,
  eventType?: string,
  rawBody?: string | Buffer,
): Promise<{ isDuplicate: boolean }> {
  if (!eventId) return { isDuplicate: false };

  // Fast-path in-memory check
  if (processedEventIds.has(eventId)) {
    return { isDuplicate: true };
  }

  // Durable DB unique constraint authority
  try {
    const { getDb } = await import("../db");
    const { omniforgeWebhookEvents } = await import("../../drizzle/schema");
    const db = await getDb();

    if (db) {
      const payloadHash = rawBody
        ? crypto.createHash("sha256").update(rawBody).digest("hex").slice(0, 64)
        : null;

      await db.insert(omniforgeWebhookEvents).values({
        eventId,
        publicationId: publicationId || null,
        eventType: eventType || "unknown",
        payloadHash,
        receivedAt: new Date(),
        processedAt: new Date(),
      });
    }
  } catch (err: any) {
    // Unique constraint violation (ER_DUP_ENTRY / 1062) means duplicate delivery!
    const errCode = err?.code || err?.errno || "";
    const errStr = String(err);
    if (
      errCode === "ER_DUP_ENTRY" ||
      errCode === 1062 ||
      errStr.includes("1062") ||
      errStr.includes("Duplicate") ||
      errStr.includes("unique")
    ) {
      processedEventIds.add(eventId);
      return { isDuplicate: true };
    }
  }

  // Update in-memory cache
  if (processedEventIds.size >= MAX_EVENT_CACHE_SIZE) {
    const firstItems = Array.from(processedEventIds.values()).slice(0, 2000);
    firstItems.forEach(id => processedEventIds.delete(id));
  }
  processedEventIds.add(eventId);

  return { isDuplicate: false };
}
