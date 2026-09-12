// ============================================================
// BEZMASAJIDLA.CZ — OMNIFORGE Webhook Security & Ingestion
// Strict HMAC-SHA256 signature verification and event deduplication.
// ============================================================

import crypto from "crypto";
import { z } from "zod";

const processedEventIds = new Set<string>();
const activeProcessingEventIds = new Set<string>();
const MAX_EVENT_CACHE_SIZE = 10000;

const publicationEventDataSchema = z.object({
  publicationId: z.uuid(),
  contentItemId: z.uuid(),
  remotePostId: z.string().min(1).optional(),
  permalinkUrl: z.url().nullable().optional(),
  publishedAt: z.iso.datetime().optional(),
  errorKind: z.string().optional(),
  message: z.string().optional(),
  attempts: z.number().int().nonnegative().optional(),
});

export const omniForgeDomainEventSchema = z.object({
  eventId: z.uuid(),
  type: z.enum([
    "publication.created",
    "publication.started",
    "publication.succeeded",
    "publication.failed",
    "reconciliation.required",
    "reconciliation.resolved",
    "intake.received",
  ]),
  payloadVersion: z.literal(1),
  occurredAt: z.iso.datetime(),
  brandId: z.uuid(),
  brandSlug: z.string().min(1),
  aggregate: z.object({
    type: z.enum(["publication", "content_item"]),
    id: z.uuid(),
  }),
  correlationId: z.string().nullable(),
  data: z.record(z.string(), z.unknown()),
});

export type OmniForgeDomainEvent = z.infer<typeof omniForgeDomainEventSchema>;

export function parseOmniForgePublicationEvent(value: unknown) {
  const event = omniForgeDomainEventSchema.parse(value);
  if (
    !event.type.startsWith("publication.") &&
    event.type !== "reconciliation.required"
  ) {
    return { event, publication: null };
  }
  return { event, publication: publicationEventDataSchema.parse(event.data) };
}

/**
 * Validates HMAC-SHA256 signature and timestamp freshness for incoming webhook requests.
 */
export function verifyOmniForgeWebhookSignature(params: {
  signatureHeader?: string;
  rawBody: string | Buffer;
  secret: string;
}): { valid: boolean; reason?: string } {
  const { signatureHeader, rawBody, secret } = params;

  if (!secret) {
    return {
      valid: false,
      reason: "OMNIFORGE webhook secret is not configured",
    };
  }

  if (!signatureHeader) {
    return { valid: false, reason: "malformed_header" };
  }

  let timestamp: number | null = null;
  let signature: string | null = null;
  for (const part of signatureHeader.split(",")) {
    const [rawKey, ...rest] = part.split("=");
    const key = rawKey?.trim();
    const value = rest.join("=").trim();
    if (key === "t") timestamp = Number(value);
    if (key === "v1") signature = value;
  }
  if (timestamp === null || !Number.isInteger(timestamp) || !signature) {
    return { valid: false, reason: "malformed_header" };
  }
  const signedTimestamp = timestamp;
  if (Math.abs(Math.floor(Date.now() / 1000) - signedTimestamp) > 300) {
    return { valid: false, reason: "stale_timestamp" };
  }

  const payloadToSign = `${String(signedTimestamp)}.${rawBody.toString("utf8")}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadToSign)
    .digest("hex");

  try {
    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return { valid: false, reason: "Signature length mismatch" };
    }

    const isMatch = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    return isMatch
      ? { valid: true }
      : { valid: false, reason: "signature_mismatch" };
  } catch {
    return { valid: false, reason: "signature_mismatch" };
  }
}

/**
 * Atomically claims a webhook event for processing.
 *
 * Uses atomic SQL UPDATE to transition processingStatus:
 * ("received" | "failed" | expired "processing") -> "processing"
 *
 * Prevents concurrent parallel processing of identical webhook events.
 */
export async function claimAndCheckWebhookEvent(params: {
  eventId?: string;
  publicationId?: string;
  eventType?: string;
  rawBody?: string | Buffer;
}): Promise<{
  shouldProcess: boolean;
  isDuplicate: boolean;
  isProcessing?: boolean;
}> {
  const { eventId, publicationId, eventType, rawBody } = params;
  if (!eventId) return { shouldProcess: true, isDuplicate: false };

  // Fast-path in-memory set check for already processed events
  if (processedEventIds.has(eventId)) {
    return { shouldProcess: false, isDuplicate: true };
  }

  try {
    const { getDb } = await import("../db");
    const { omniforgeWebhookEvents } = await import("../../drizzle/schema");
    const { eq, and, or, lt, inArray } = await import("drizzle-orm");
    const db = await getDb();

    if (db) {
      // 1. Ensure initial row exists
      const existing = await db
        .select()
        .from(omniforgeWebhookEvents)
        .where(eq(omniforgeWebhookEvents.eventId, eventId))
        .limit(1);

      if (existing.length === 0) {
        const payloadHash = rawBody
          ? crypto
              .createHash("sha256")
              .update(rawBody)
              .digest("hex")
              .slice(0, 64)
          : null;

        try {
          await db.insert(omniforgeWebhookEvents).values({
            eventId,
            publicationId: publicationId || null,
            eventType: eventType || "unknown",
            payloadHash,
            processingStatus: "received",
            receivedAt: new Date(),
            processedAt: null,
          });
        } catch {
          // Ignore duplicate insert error on concurrent arrival
        }
      }

      // 2. Atomic claim via UPDATE with condition
      const leaseExpiry = new Date(Date.now() - 5 * 60 * 1000); // 5 minute lock lease
      const updateResult = await db
        .update(omniforgeWebhookEvents)
        .set({
          processingStatus: "processing",
          processingStartedAt: new Date(),
        })
        .where(
          and(
            eq(omniforgeWebhookEvents.eventId, eventId),
            or(
              inArray(omniforgeWebhookEvents.processingStatus, [
                "received",
                "failed",
              ]),
              and(
                eq(omniforgeWebhookEvents.processingStatus, "processing"),
                lt(omniforgeWebhookEvents.processingStartedAt, leaseExpiry)
              )
            )
          )
        );

      const affectedRows =
        (updateResult as any)?.[0]?.affectedRows ??
        (updateResult as any)?.affectedRows ??
        1;

      if (affectedRows > 0) {
        return { shouldProcess: true, isDuplicate: false };
      }

      // Re-read status to distinguish between 'processed' and 'currently processing'
      const reRead = await db
        .select()
        .from(omniforgeWebhookEvents)
        .where(eq(omniforgeWebhookEvents.eventId, eventId))
        .limit(1);

      if (reRead.length > 0 && reRead[0].processingStatus === "processed") {
        processedEventIds.add(eventId);
        return { shouldProcess: false, isDuplicate: true };
      }

      return { shouldProcess: false, isDuplicate: false, isProcessing: true };
    }
  } catch (err: any) {
    console.error("[OmniForge Webhook] Error claiming event:", err);
  }

  // In-memory fallback lock when DB is not available
  if (activeProcessingEventIds.has(eventId)) {
    return { shouldProcess: false, isDuplicate: false, isProcessing: true };
  }
  activeProcessingEventIds.add(eventId);

  return { shouldProcess: true, isDuplicate: false };
}

/**
 * Marks a claimed webhook event as successfully processed.
 */
export async function markWebhookEventProcessed(eventId: string) {
  processedEventIds.add(eventId);
  activeProcessingEventIds.delete(eventId);
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
  activeProcessingEventIds.delete(eventId);
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
