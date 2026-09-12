import crypto from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  buildRecipePublishRequest,
  OmniForgeClient,
  OMNIFORGE_PUBLISH_PATH,
  omniForgePublishJobRequestSchema,
} from "./_core/omniforge-client";
import {
  parseOmniForgePublicationEvent,
  verifyOmniForgeWebhookSignature,
} from "./_core/omniforge-webhook";

const config = {
  apiUrl: "https://forge.example.test",
  serviceToken: "service-test-token",
  brandSlug: "bezmasajidla",
  facebookAccountId: "fb-account-id",
  instagramAccountId: "ig-account-id",
  webhookSecret: "webhook-secret",
};

function recipeRequest(channel: "facebook" | "instagram") {
  return buildRecipePublishRequest(
    {
      channel,
      accountId:
        channel === "facebook"
          ? config.facebookAccountId
          : config.instagramAccountId,
      sourceId: "recipe:42",
      contentVersion: "revision-7",
      title: "Brokolicová polévka s hráškem",
      caption: "Schválený text",
      imageUrl: "https://www.bezmasajidla.cz/images/recipes/brokolice.webp",
      destinationUrl: "https://www.bezmasajidla.cz/recepty/brokolicova-polevka",
      tags: ["brokolice", "vegan"],
      scheduledAt: new Date("2026-09-09T10:00:00.000Z"),
      publicationPolicy: "ORIGINAL",
    },
    config
  );
}

describe("OMNIFORGE producer contract", () => {
  it("uses the canonical publish-job wire shape and deterministic per-channel key", () => {
    const first = recipeRequest("facebook");
    const second = recipeRequest("facebook");
    const instagram = recipeRequest("instagram");

    expect(omniForgePublishJobRequestSchema.parse(first)).toEqual(first);
    expect(first.idempotencyKey).toBe(second.idempotencyKey);
    expect(first.idempotencyKey).not.toBe(instagram.idempotencyKey);
    expect(first.requiresApproval).toBe(false);
    expect(first.targets).toEqual([
      { accountId: "fb-account-id", targetKind: "feed" },
    ]);
    expect(first.metadata).toMatchObject({
      sourceSystem: "bezmasajidla",
      sourceType: "recipe",
      publicationPolicy: "ORIGINAL",
      provenance: { originalContent: true },
    });
  });

  it("rejects INTERNAL_ONLY content and placeholder assets before network", () => {
    expect(() =>
      buildRecipePublishRequest(
        {
          ...recipeRequest("facebook"),
          channel: "facebook",
          accountId: "fb-account-id",
          sourceId: "recipe:42",
          contentVersion: "revision-7",
          title: "Interní rešerše",
          caption: "Nesmí ven",
          imageUrl: "https://www.bezmasajidla.cz/images/recipes/brokolice.webp",
          destinationUrl: "https://www.bezmasajidla.cz/recepty/test",
          tags: [],
          publicationPolicy: "INTERNAL_ONLY",
        },
        config
      )
    ).toThrow("INTERNAL_ONLY");

    expect(() =>
      buildRecipePublishRequest(
        {
          channel: "instagram",
          accountId: "ig-account-id",
          sourceId: "recipe:43",
          contentVersion: "revision-8",
          title: "Bez fotografie",
          caption: "Text",
          imageUrl:
            "https://www.bezmasajidla.cz/images/placeholders/recipe.webp",
          destinationUrl: "https://www.bezmasajidla.cz/recepty/test",
          tags: [],
          publicationPolicy: "ORIGINAL",
        },
        config
      )
    ).toThrow("Zástupný obrázek");
  });

  it("submits only to the canonical OMNIFORGE endpoint", async () => {
    const request = recipeRequest("facebook");
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            jobs: [
              {
                publishJobId: "job-1",
                state: "APPROVED",
                accountId: "fb-account-id",
                targetKind: "feed",
                idempotencyKey: request.idempotencyKey,
                created: true,
              },
            ],
            contentItemId: "content-1",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        )
    );
    const client = new OmniForgeClient(config, fetchMock as typeof fetch);

    const response = await client.submitPublishJob(request);

    expect(response.jobs[0]?.publishJobId).toBe("job-1");
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(`${config.apiUrl}${OMNIFORGE_PUBLISH_PATH}`);
    expect(init?.headers).toMatchObject({
      Authorization: "Bearer service-test-token",
      "Idempotency-Key": request.idempotencyKey,
    });
  });
});

describe("OMNIFORGE outbound status contract", () => {
  it("verifies the canonical t=...,v1=... signature and parses success", () => {
    const event = {
      eventId: "d9b2d63d-a233-4123-847a-768e2b2c2f72",
      type: "publication.succeeded",
      payloadVersion: 1,
      occurredAt: "2026-09-08T08:00:00.000Z",
      brandId: "0e85742e-9ed4-4f5f-b948-510c56bd00c5",
      brandSlug: "bezmasajidla",
      aggregate: {
        type: "publication",
        id: "7fbb53d8-954a-4c80-bc1d-2e5643670957",
      },
      correlationId: null,
      data: {
        publicationId: "7fbb53d8-954a-4c80-bc1d-2e5643670957",
        contentItemId: "d89cb728-c95e-4261-9777-da90a6e8194e",
        remotePostId: "meta-post-123",
        publishedAt: "2026-09-08T08:00:00.000Z",
      },
    };
    const rawBody = JSON.stringify(event);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHmac("sha256", config.webhookSecret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    expect(
      verifyOmniForgeWebhookSignature({
        signatureHeader: `t=${timestamp},v1=${signature}`,
        rawBody,
        secret: config.webhookSecret,
      })
    ).toEqual({ valid: true });

    const parsed = parseOmniForgePublicationEvent(event);
    expect(parsed.event.type).toBe("publication.succeeded");
    expect(parsed.publication?.remotePostId).toBe("meta-post-123");
  });
});
