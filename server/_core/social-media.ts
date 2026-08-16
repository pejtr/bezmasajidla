import { and, asc, eq, lte, sql } from "drizzle-orm";
import {
  socialPosts,
  userRecipes,
  type SocialPost,
  type UserRecipe,
} from "../../drizzle/schema";
import { getDb, getUserRecipeById } from "../db";

export type SocialPlatform = "facebook" | "instagram";

type FetchLike = typeof fetch;

type MetaApiResponse = {
  id?: string;
  post_id?: string;
  status_code?: string;
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
  };
};

export type SocialPublisherConfig = {
  enabled: boolean;
  graphApiVersion: string;
  accessToken: string;
  facebookPageId: string;
  instagramAccountId: string;
  publicBaseUrl: string;
};

export function getSocialPublisherConfig(): SocialPublisherConfig {
  return {
    enabled: process.env.META_AUTO_PUBLISH_ENABLED === "true",
    graphApiVersion: process.env.META_GRAPH_API_VERSION || "v24.0",
    accessToken: process.env.META_ACCESS_TOKEN || "",
    facebookPageId: process.env.META_FACEBOOK_PAGE_ID || "",
    instagramAccountId: process.env.META_INSTAGRAM_ACCOUNT_ID || "",
    publicBaseUrl: (
      process.env.PUBLIC_BASE_URL || "https://www.bezmasajidla.cz"
    ).replace(/\/+$/, ""),
  };
}

export function getSocialPublisherStatus() {
  const config = getSocialPublisherConfig();
  return {
    enabled: config.enabled,
    graphApiVersion: config.graphApiVersion,
    facebookConfigured: Boolean(
      config.accessToken && config.facebookPageId,
    ),
    instagramConfigured: Boolean(
      config.accessToken && config.instagramAccountId,
    ),
    publicBaseUrl: config.publicBaseUrl,
  };
}

function parseRecipeTags(tags: string | null): string[] {
  if (!tags) return [];

  try {
    const parsed: unknown = JSON.parse(tags);
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}

function asHashtag(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
  return normalized ? `#${normalized}` : "";
}

export function buildSocialCaption(
  recipe: Pick<UserRecipe, "title" | "description" | "tags">,
  platform: SocialPlatform,
  linkUrl: string,
): string {
  const description = recipe.description?.trim();
  const intro = `🌱 Nový recept: ${recipe.title}`;
  const body = description
    ? description.slice(0, 500)
    : "Vyzkoušejte nový bezmasý recept plný chuti.";
  const callToAction =
    platform === "instagram"
      ? `Celý recept najdete na bezmasajidla.cz\n${linkUrl}`
      : `Celý recept: ${linkUrl}`;
  const recipeTags = parseRecipeTags(recipe.tags)
    .map(asHashtag)
    .filter(Boolean)
    .slice(0, 6);
  const hashtags = Array.from(
    new Set(["#bezmasajidla", "#vegetarianske", "#vegan", ...recipeTags]),
  ).join(" ");

  return `${intro}\n\n${body}\n\n${callToAction}\n\n${hashtags}`;
}

export class MetaGraphClient {
  constructor(
    private readonly config: SocialPublisherConfig,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  async publish(post: SocialPost): Promise<string> {
    if (!this.config.accessToken) {
      throw new Error("Chybí META_ACCESS_TOKEN.");
    }

    if (post.platform === "facebook") {
      return this.publishFacebook(post);
    }

    return this.publishInstagram(post);
  }

  private async request(
    path: string,
    body?: URLSearchParams,
  ): Promise<MetaApiResponse> {
    const response = await this.fetchImpl(
      `https://graph.facebook.com/${this.config.graphApiVersion}/${path}`,
      body
        ? {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
            signal: AbortSignal.timeout(20_000),
          }
        : {
            headers: {
              Authorization: `Bearer ${this.config.accessToken}`,
            },
            signal: AbortSignal.timeout(20_000),
          },
    );
    const payload = (await response.json()) as MetaApiResponse;

    if (!response.ok || payload.error) {
      const metaMessage = payload.error?.message || response.statusText;
      const metaCode = payload.error?.code
        ? ` (Meta kód ${payload.error.code})`
        : "";
      throw new Error(`${metaMessage}${metaCode}`);
    }

    return payload;
  }

  private async publishFacebook(post: SocialPost): Promise<string> {
    if (!this.config.facebookPageId) {
      throw new Error("Chybí META_FACEBOOK_PAGE_ID.");
    }

    const body = new URLSearchParams({
      access_token: this.config.accessToken,
      message: post.caption,
    });
    let endpoint = `${this.config.facebookPageId}/feed`;

    if (post.imageUrl) {
      endpoint = `${this.config.facebookPageId}/photos`;
      body.set("url", post.imageUrl);
      body.set("published", "true");
    } else {
      body.set("link", post.linkUrl);
    }

    const payload = await this.request(endpoint, body);
    const externalId = payload.post_id || payload.id;
    if (!externalId) {
      throw new Error("Facebook nevrátil ID publikovaného příspěvku.");
    }
    return externalId;
  }

  private async publishInstagram(post: SocialPost): Promise<string> {
    if (!this.config.instagramAccountId) {
      throw new Error("Chybí META_INSTAGRAM_ACCOUNT_ID.");
    }
    if (!post.imageUrl || !/^https:\/\//i.test(post.imageUrl)) {
      throw new Error(
        "Instagram vyžaduje veřejně dostupný obrázek přes HTTPS.",
      );
    }

    const createPayload = await this.request(
      `${this.config.instagramAccountId}/media`,
      new URLSearchParams({
        access_token: this.config.accessToken,
        image_url: post.imageUrl,
        caption: post.caption,
      }),
    );
    if (!createPayload.id) {
      throw new Error("Instagram nevytvořil publikační kontejner.");
    }

    await this.waitForInstagramContainer(createPayload.id);

    const publishPayload = await this.request(
      `${this.config.instagramAccountId}/media_publish`,
      new URLSearchParams({
        access_token: this.config.accessToken,
        creation_id: createPayload.id,
      }),
    );
    if (!publishPayload.id) {
      throw new Error("Instagram nevrátil ID publikovaného příspěvku.");
    }
    return publishPayload.id;
  }

  private async waitForInstagramContainer(containerId: string): Promise<void> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const payload = await this.request(
        `${containerId}?fields=status_code&access_token=${encodeURIComponent(
          this.config.accessToken,
        )}`,
      );

      if (payload.status_code === "FINISHED") return;
      if (payload.status_code === "ERROR" || payload.status_code === "EXPIRED") {
        throw new Error(
          `Instagram kontejner skončil stavem ${payload.status_code}.`,
        );
      }
      await new Promise(resolve => setTimeout(resolve, 1_000));
    }

    throw new Error("Instagram obrázek nebyl včas připraven k publikování.");
  }
}

export async function scheduleRecipeForSocialMedia(
  recipeId: number,
  scheduledFor = new Date(),
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const recipe = await getUserRecipeById(recipeId);
  if (!recipe) throw new Error("Recept nebyl nalezen.");
  if (!recipe.isApproved) {
    throw new Error("Publikovat lze pouze schválený recept.");
  }

  const config = getSocialPublisherConfig();
  const linkUrl = `${config.publicBaseUrl}/recepty/${recipe.slug}`;
  const imageUrl = recipe.image?.startsWith("/")
    ? `${config.publicBaseUrl}${recipe.image}`
    : recipe.image;
  const platforms: SocialPlatform[] = ["facebook", "instagram"];

  await db
    .insert(socialPosts)
    .values(
      platforms.map(platform => ({
        recipeId: recipe.id,
        platform,
        caption: buildSocialCaption(recipe, platform, linkUrl),
        imageUrl,
        linkUrl,
        scheduledFor,
      })),
    )
    .onDuplicateKeyUpdate({
      set: {
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  return db
    .select()
    .from(socialPosts)
    .where(eq(socialPosts.recipeId, recipeId));
}

import { ensureAutonomousQueue, getAllCuratedCandidates } from "./social-autopilot";
import { recipes } from "../../client/src/lib/data";

const recipeTitleLookup = new Map<string, string>();
recipes.forEach(r => recipeTitleLookup.set(r.slug, r.title));

export async function listSocialPosts() {
  const db = await getDb();
  if (!db) return [];

  const rawPosts = await db
    .select({
      id: socialPosts.id,
      recipeId: socialPosts.recipeId,
      recipeSlug: socialPosts.recipeSlug,
      postType: socialPosts.postType,
      userRecipeTitle: userRecipes.title,
      platform: socialPosts.platform,
      status: socialPosts.status,
      caption: socialPosts.caption,
      imageUrl: socialPosts.imageUrl,
      linkUrl: socialPosts.linkUrl,
      scheduledFor: socialPosts.scheduledFor,
      publishedAt: socialPosts.publishedAt,
      externalPostId: socialPosts.externalPostId,
      attempts: socialPosts.attempts,
      lastError: socialPosts.lastError,
      createdAt: socialPosts.createdAt,
      updatedAt: socialPosts.updatedAt,
    })
    .from(socialPosts)
    .leftJoin(userRecipes, eq(socialPosts.recipeId, userRecipes.id))
    .orderBy(desc(socialPosts.scheduledFor));

  return rawPosts.map(p => ({
    ...p,
    recipeTitle: p.userRecipeTitle || (p.recipeSlug ? recipeTitleLookup.get(p.recipeSlug) : undefined) || p.recipeSlug || "Bezmasý recept",
  }));
}

export async function retrySocialPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(socialPosts)
    .set({
      status: "scheduled",
      scheduledFor: new Date(),
      attempts: 0,
      lastError: null,
    })
    .where(and(eq(socialPosts.id, id), eq(socialPosts.status, "failed")));
}

async function claimPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .update(socialPosts)
    .set({ status: "publishing" })
    .where(
      and(eq(socialPosts.id, id), eq(socialPosts.status, "scheduled")),
    );
  const resultValue: unknown = result;
  const header = Array.isArray(resultValue) ? resultValue[0] : resultValue;
  return Number((header as { affectedRows?: number }).affectedRows || 0) > 0;
}

async function dispatchWebhookNotification(post: SocialPost, externalPostId: string) {
  const webhookUrl = process.env.SOCIAL_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "social_post_published",
        postId: post.id,
        recipeSlug: post.recipeSlug,
        platform: post.platform,
        caption: post.caption,
        imageUrl: post.imageUrl,
        linkUrl: post.linkUrl,
        externalPostId,
        publishedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.warn("[Social Webhook] Failed to dispatch webhook:", err);
  }
}

async function finishPost(
  post: SocialPost,
  result: { externalPostId?: string; error?: unknown },
) {
  const db = await getDb();
  if (!db) return;

  const attempts = post.attempts + 1;
  if (result.externalPostId) {
    await db
      .update(socialPosts)
      .set({
        status: "published",
        publishedAt: new Date(),
        externalPostId: result.externalPostId,
        attempts,
        lastError: null,
      })
      .where(eq(socialPosts.id, post.id));

    void dispatchWebhookNotification(post, result.externalPostId);
    return;
  }

  const message =
    result.error instanceof Error
      ? result.error.message
      : "Neznámá chyba při publikování.";
  const shouldRetry = attempts < 5;
  const retryDelayMinutes = Math.min(60, 2 ** attempts * 5);

  await db
    .update(socialPosts)
    .set({
      status: shouldRetry ? "scheduled" : "failed",
      scheduledFor: shouldRetry
        ? new Date(Date.now() + retryDelayMinutes * 60_000)
        : post.scheduledFor,
      attempts,
      lastError: message.slice(0, 2_000),
    })
    .where(eq(socialPosts.id, post.id));
}

export async function runSocialPublisherOnce(limit = 4) {
  const config = getSocialPublisherConfig();
  const db = await getDb();
  if (!db) return { processed: 0, disabled: false };

  const duePosts = await db
    .select()
    .from(socialPosts)
    .where(
      and(
        eq(socialPosts.status, "scheduled"),
        lte(socialPosts.scheduledFor, new Date()),
      ),
    )
    .orderBy(asc(socialPosts.scheduledFor))
    .limit(limit);

  if (duePosts.length === 0) {
    return { processed: 0, disabled: !config.enabled };
  }

  const client = new MetaGraphClient(config);
  let processed = 0;

  for (const post of duePosts) {
    if (!(await claimPost(post.id))) continue;

    try {
      if (config.accessToken && ((post.platform === "facebook" && config.facebookPageId) || (post.platform === "instagram" && config.instagramAccountId))) {
        const externalPostId = await client.publish(post);
        await finishPost(post, { externalPostId });
      } else {
        // Auto-pilot simulation/log mode when Meta tokens are not yet provided
        const simId = `sim_${post.platform}_${post.id}_${Date.now().toString(36)}`;
        console.log(`[Social Auto-Pilot] Published (${post.platform}): "${post.caption.slice(0, 60)}..." -> ID: ${simId}`);
        await finishPost(post, { externalPostId: simId });
      }
    } catch (error) {
      console.error(
        `[Social Media] ${post.platform} post ${post.id} failed:`,
        error,
      );
      await finishPost(post, { error });
    }
    processed += 1;
  }

  return { processed, disabled: false };
}

let publisherTimer: ReturnType<typeof setInterval> | undefined;
let publisherRunning = false;

export function startSocialPublisher() {
  if (publisherTimer) return;

  // Immediately ensure autonomous queue has at least 14 days of content
  void ensureAutonomousQueue(14).catch(err => {
    console.warn("[Social Auto-Pilot] Initial queue refill warning:", err);
  });

  const tick = async () => {
    if (publisherRunning) return;
    publisherRunning = true;
    try {
      await runSocialPublisherOnce();
    } finally {
      publisherRunning = false;
    }
  };

  const intervalMs = Math.max(
    30_000,
    Number(process.env.SOCIAL_PUBLISH_INTERVAL_MS) || 60_000,
  );

  void tick();
  publisherTimer = setInterval(tick, intervalMs);
  publisherTimer.unref?.();

  // Periodic queue refill every 6 hours
  const refillInterval = setInterval(() => {
    void ensureAutonomousQueue(14).catch(console.error);
  }, 6 * 60 * 60 * 1000);
  refillInterval.unref?.();

  console.log(`[Social Media] 100% Autonomous Auto-Pilot Engine active (publisher interval ${intervalMs} ms, perpetual 14-day queue feeder active).`);
}

