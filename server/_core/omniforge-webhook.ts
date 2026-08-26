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
 * Deduplicates eventId to guarantee idempotency: 2 deliveries -> 1 state transition
 */
export function checkAndDeduplicateWebhookEvent(eventId?: string): { isDuplicate: boolean } {
  if (!eventId) return { isDuplicate: false };

  if (processedEventIds.has(eventId)) {
    return { isDuplicate: true };
  }

  if (processedEventIds.size >= MAX_EVENT_CACHE_SIZE) {
    // Clear oldest items to avoid unbounded memory growth
    const firstItems = Array.from(processedEventIds.values()).slice(0, 2000);
    firstItems.forEach(id => processedEventIds.delete(id));
  }

  processedEventIds.add(eventId);
  return { isDuplicate: false };
}
