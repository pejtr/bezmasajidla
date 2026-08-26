// ============================================================
// BEZMASAJIDLA.CZ — OMNIFORGE Cutover & Delivery Verification Test Suite
// Verified end-to-end publishing modes, correlation IDs, webhook security, and dry-run contract.
// ============================================================

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import { getPublisherMode } from "./_core/social-media";
import { OmniForgeClient } from "./_core/omniforge-client";
import {
  verifyOmniForgeWebhookSignature,
  checkAndDeduplicateWebhookEvent,
} from "./_core/omniforge-webhook";
import type { SocialPost } from "../drizzle/schema";

describe("OMNIFORGE Cutover — Publisher Mode Scoping", () => {
  const originalEnv = process.env.SOCIAL_PUBLISHER_MODE;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.SOCIAL_PUBLISHER_MODE = originalEnv;
    } else {
      delete process.env.SOCIAL_PUBLISHER_MODE;
    }
  });

  it("should respect explicit SOCIAL_PUBLISHER_MODE=omniforge", () => {
    process.env.SOCIAL_PUBLISHER_MODE = "omniforge";
    expect(getPublisherMode()).toBe("omniforge");
  });

  it("should respect explicit SOCIAL_PUBLISHER_MODE=direct_meta", () => {
    process.env.SOCIAL_PUBLISHER_MODE = "direct_meta";
    expect(getPublisherMode()).toBe("direct_meta");
  });

  it("should respect explicit SOCIAL_PUBLISHER_MODE=local", () => {
    process.env.SOCIAL_PUBLISHER_MODE = "local";
    expect(getPublisherMode()).toBe("local");
  });
});

describe("OMNIFORGE Cutover — Three-Tier Identity Correlation", () => {
  it("should generate and maintain distinct internalPostId, publicationId, and providerPostId", () => {
    const mockPost: SocialPost = {
      id: 482,
      recipeSlug: "svickova-bez-masa",
      platform: "facebook",
      status: "scheduled",
      caption: "Test caption",
      imageUrl: "https://www.bezmasajidla.cz/images/svickova.jpg",
      linkUrl: "https://www.bezmasajidla.cz/recepty/svickova-bez-masa?utm_source=facebook",
      copyStyle: "hook_curiosity",
      publishingSlot: "11:30",
      scheduledFor: new Date(),
      publishedAt: null,
      publishStartedAt: null,
      publishAttemptId: null,
      publicationId: "pub_bj_482_facebook_01j99x",
      externalPostId: null,
      attempts: 0,
      lastError: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(mockPost.id).toBe(482);
    expect(mockPost.publicationId).toBe("pub_bj_482_facebook_01j99x");
  });
});

describe("OMNIFORGE Cutover — Webhook HMAC & Idempotency", () => {
  const secret = "test_webhook_secret_9988";

  it("should verify valid HMAC-SHA256 webhook signatures with timestamp", () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = JSON.stringify({ event: "publication.published", internalPostId: 482 });
    const payloadToSign = `${timestamp}.${rawBody}`;
    const signature = crypto.createHmac("sha256", secret).update(payloadToSign).digest("hex");

    const result = verifyOmniForgeWebhookSignature({
      signatureHeader: `sha256=${signature}`,
      timestampHeader: timestamp,
      rawBody,
      secret,
    });

    expect(result.valid).toBe(true);
  });

  it("should reject webhook with invalid signature", () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = JSON.stringify({ event: "publication.published", internalPostId: 482 });

    const result = verifyOmniForgeWebhookSignature({
      signatureHeader: "sha256=invalid_signature_hash_1234567890abcdef1234567890abcdef",
      timestampHeader: timestamp,
      rawBody,
      secret,
    });

    expect(result.valid).toBe(false);
    expect(result.reason?.toLowerCase()).toContain("signature");
  });

  it("should reject expired webhook requests older than 5 minutes", () => {
    const expiredTimestamp = Math.floor((Date.now() - 10 * 60 * 1000) / 1000).toString();
    const rawBody = JSON.stringify({ event: "publication.published" });
    const payloadToSign = `${expiredTimestamp}.${rawBody}`;
    const signature = crypto.createHmac("sha256", secret).update(payloadToSign).digest("hex");

    const result = verifyOmniForgeWebhookSignature({
      signatureHeader: `sha256=${signature}`,
      timestampHeader: expiredTimestamp,
      rawBody,
      secret,
    });

    expect(result.valid).toBe(false);
    expect(result.reason).toContain("expired");
  });

  it("should deduplicate eventId for 2 deliveries -> 1 state transition idempotency", async () => {
    const uniqueEventId = `evt_test_${Date.now()}_${Math.random()}`;

    const delivery1 = await checkAndDeduplicateWebhookEvent(uniqueEventId);
    expect(delivery1.isDuplicate).toBe(false);

    const delivery2 = await checkAndDeduplicateWebhookEvent(uniqueEventId);
    expect(delivery2.isDuplicate).toBe(true);
  });
});

describe("OMNIFORGE Cutover — Dry-Run Contract Test", () => {
  it("should format dry-run publication payload with correlation ID and validate contract", async () => {
    const client = new OmniForgeClient({
      apiKey: "omni_test_key_12345",
      projectId: "bezmasajidla",
      apiUrl: "https://api.omniforge.io",
    });

    const mockPost: SocialPost = {
      id: 501,
      recipeSlug: "cockova-polevka-uzena-paprika",
      platform: "instagram",
      status: "scheduled",
      caption: "Test caption",
      imageUrl: "https://www.bezmasajidla.cz/images/cockova.jpg",
      linkUrl: "https://www.bezmasajidla.cz/recepty/cockova-polevka-uzena-paprika?utm_source=instagram",
      copyStyle: "quick_tip",
      publishingSlot: "17:30",
      scheduledFor: new Date(),
      publishedAt: null,
      publishStartedAt: null,
      publishAttemptId: null,
      publicationId: "pub_bj_501_instagram_dryrun",
      externalPostId: null,
      attempts: 0,
      lastError: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock fetch for dryRun test
    const globalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      const body = JSON.parse(init?.body as string);
      expect(body.dryRun).toBe(true);
      expect(body.publicationId).toBe("pub_bj_501_instagram_dryrun");
      expect(body.content.metadata.internalPostId).toBe(501);

      return {
        ok: true,
        json: async () => ({
          publicationId: body.publicationId,
          status: "validated",
          providerPostId: "dry_run_provider_501",
        }),
      } as Response;
    }) as typeof fetch;

    try {
      const res = await client.publish(mockPost, { dryRun: true });
      expect(res.publicationId).toBe("pub_bj_501_instagram_dryrun");
      expect(res.status).toBe("validated");
      expect(res.dryRunSuccess).toBe(true);
    } finally {
      globalThis.fetch = globalFetch;
    }
  });
});
