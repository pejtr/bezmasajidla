import crypto from "node:crypto";
import { z } from "zod";

/**
 * Thin producer adapter for the canonical OMNIFORGE publish-job contract.
 *
 * This mirrors @omniforge/contracts PublishJobRequestSchema at OMNIFORGE
 * commit 5fce0f69. The package is private and workspace-only, so this service
 * validates the wire shape at its own boundary instead of importing runtime
 * code from another deployment.
 *
 * Important: the schema exists in OMNIFORGE, but the HTTP route is not mounted
 * on that commit yet. Configuration is therefore fail-closed and no local
 * publisher, scheduler, OAuth flow, or retry worker is provided here.
 */

export const OMNIFORGE_PUBLISH_PATH = "/api/v1/publish-jobs";
export const OMNIFORGE_CONTRACT_REVISION = "publish-job.v1@5fce0f69";

export type OmniForgeChannel = "facebook" | "instagram";
export type PublicationPolicy = "ORIGINAL" | "INTERNAL_ONLY";

const mediaAssetSchema = z.object({
  url: z.url(),
  mimeType: z.string().min(1),
  bytes: z.number().int().positive().optional(),
  checksum: z.string().min(1).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationMs: z.number().int().nonnegative().optional(),
  aspectRatio: z.string().optional(),
  thumbnailUrl: z.url().optional(),
  altText: z.string().max(1_000).optional(),
});

const publishTargetSchema = z.object({
  accountId: z.string().min(1).optional(),
  provider: z.enum(["meta", "youtube", "tiktok", "x"]).optional(),
  accountRemoteId: z.string().min(1).optional(),
  targetKind: z.enum(["feed", "reel", "story", "short", "video", "carousel"]),
});

export const omniForgePublishJobRequestSchema = z.object({
  brandSlug: z.string().min(1),
  idempotencyKey: z.string().min(1).optional(),
  content: z.object({
    kind: z.enum(["video", "image", "carousel", "text"]),
    title: z.string().max(300).optional(),
    caption: z.string().max(10_000).optional(),
    media: z.array(mediaAssetSchema).default([]),
    locale: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
  targets: z.array(publishTargetSchema).min(1),
  scheduledAt: z.iso.datetime().nullable().optional(),
  requiresApproval: z.boolean().default(true),
  campaignRef: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type OmniForgePublishJobRequest = z.infer<
  typeof omniForgePublishJobRequestSchema
>;

export const omniForgePublishJobResponseSchema = z.object({
  jobs: z.array(
    z.object({
      publishJobId: z.string(),
      state: z.enum([
        "DRAFT",
        "APPROVED",
        "QUEUED",
        "PUBLISHING",
        "PUBLISHED",
        "FAILED",
        "CANCELLED",
      ]),
      accountId: z.string(),
      targetKind: z.string(),
      idempotencyKey: z.string(),
      created: z.boolean(),
    })
  ),
  contentItemId: z.string(),
});

export type OmniForgePublishJobResponse = z.infer<
  typeof omniForgePublishJobResponseSchema
>;

export interface OmniForgeConfig {
  apiUrl?: string;
  serviceToken?: string;
  brandSlug: string;
  facebookAccountId?: string;
  instagramAccountId?: string;
  webhookSecret?: string;
}

export function getOmniForgeConfig(): OmniForgeConfig {
  return {
    apiUrl: process.env.OMNIFORGE_API_URL?.replace(/\/+$/, ""),
    serviceToken: process.env.OMNIFORGE_SERVICE_TOKEN,
    brandSlug: process.env.OMNIFORGE_BRAND_SLUG || "bezmasajidla",
    facebookAccountId: process.env.OMNIFORGE_FACEBOOK_ACCOUNT_ID,
    instagramAccountId: process.env.OMNIFORGE_INSTAGRAM_ACCOUNT_ID,
    webhookSecret: process.env.OMNIFORGE_WEBHOOK_SECRET,
  };
}

export function isOmniForgeConfigured(
  channels: readonly OmniForgeChannel[] = ["facebook", "instagram"]
): boolean {
  const config = getOmniForgeConfig();
  if (!config.apiUrl || !config.serviceToken) return false;
  return channels.every(channel =>
    channel === "facebook"
      ? Boolean(config.facebookAccountId)
      : Boolean(config.instagramAccountId)
  );
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => item !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));
  return `{${entries
    .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
    .join(",")}}`;
}

export function sha256Hex(value: unknown): string {
  return crypto
    .createHash("sha256")
    .update(typeof value === "string" ? value : canonicalJson(value), "utf8")
    .digest("hex");
}

export function buildOmniForgeIdempotencyKey(input: {
  brandSlug: string;
  sourceId: string;
  channel: OmniForgeChannel;
  format: "feed" | "reel" | "story" | "carousel";
  contentVersion: string;
}): string {
  return `sha256:${sha256Hex([
    input.brandSlug,
    input.sourceId,
    input.channel,
    input.format,
    input.contentVersion,
  ])}`;
}

function inferImageMimeType(url: string): string {
  const pathname = new URL(url).pathname.toLowerCase();
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  throw new Error("OMNIFORGE vyžaduje obrázek s rozpoznatelným MIME typem.");
}

export interface BuildRecipePublishRequestInput {
  channel: OmniForgeChannel;
  accountId: string;
  sourceId: string;
  contentVersion: string;
  title: string;
  caption: string;
  imageUrl: string;
  destinationUrl: string;
  tags: string[];
  scheduledAt?: Date;
  publicationPolicy: PublicationPolicy;
}

export function buildRecipePublishRequest(
  input: BuildRecipePublishRequestInput,
  config = getOmniForgeConfig()
): OmniForgePublishJobRequest {
  if (input.publicationPolicy !== "ORIGINAL") {
    throw new Error("INTERNAL_ONLY obsah nesmí být předán k publikaci.");
  }
  if (!input.imageUrl.startsWith("https://")) {
    throw new Error("OMNIFORGE vyžaduje veřejný HTTPS media asset.");
  }
  if (input.imageUrl.includes("/images/placeholders/")) {
    throw new Error("Zástupný obrázek nesmí být předán k publikaci.");
  }

  return omniForgePublishJobRequestSchema.parse({
    brandSlug: config.brandSlug,
    idempotencyKey: buildOmniForgeIdempotencyKey({
      brandSlug: config.brandSlug,
      sourceId: input.sourceId,
      channel: input.channel,
      format: "feed",
      contentVersion: input.contentVersion,
    }),
    content: {
      kind: "image",
      title: input.title,
      caption: input.caption,
      media: [
        {
          url: input.imageUrl,
          mimeType: inferImageMimeType(input.imageUrl),
          altText: input.title,
        },
      ],
      locale: "cs-CZ",
      tags: input.tags,
    },
    targets: [{ accountId: input.accountId, targetKind: "feed" }],
    scheduledAt: input.scheduledAt?.toISOString() ?? null,
    requiresApproval: false,
    metadata: {
      schemaVersion: 1,
      sourceSystem: "bezmasajidla",
      sourceType: "recipe",
      sourceId: input.sourceId,
      sourceRevision: input.contentVersion,
      destinationUrl: input.destinationUrl,
      publicationPolicy: input.publicationPolicy,
      provenance: {
        originalContent: true,
        externalResearchOnly: false,
      },
      attribution: {
        utmSource: input.channel,
        utmMedium: "social",
        utmCampaign: "recipe_distribution",
        utmContent: input.contentVersion.slice(0, 16),
      },
      contractRevision: OMNIFORGE_CONTRACT_REVISION,
    },
  });
}

export class OmniForgeClient {
  constructor(
    private readonly config = getOmniForgeConfig(),
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async submitPublishJob(
    request: OmniForgePublishJobRequest
  ): Promise<OmniForgePublishJobResponse> {
    const parsedRequest = omniForgePublishJobRequestSchema.parse(request);
    if (!this.config.apiUrl || !this.config.serviceToken) {
      throw new Error(
        "OMNIFORGE_API_URL a OMNIFORGE_SERVICE_TOKEN musí být nastavené."
      );
    }

    const response = await this.fetchImpl(
      `${this.config.apiUrl}${OMNIFORGE_PUBLISH_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.serviceToken}`,
          "Idempotency-Key": parsedRequest.idempotencyKey || "",
          "X-Correlation-Id": parsedRequest.idempotencyKey || "",
        },
        body: JSON.stringify(parsedRequest),
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `OMNIFORGE publish API odmítlo požadavek (${response.status}): ${errorText}`
      );
    }

    return omniForgePublishJobResponseSchema.parse(await response.json());
  }
}
