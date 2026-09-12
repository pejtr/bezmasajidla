import { desc, eq } from "drizzle-orm";
import {
  socialPosts,
  userRecipes,
  type UserRecipe,
} from "../../drizzle/schema";
import { recipes } from "../../client/src/lib/data";
import { getDb, getUserRecipeById } from "../db";
import {
  buildRecipePublishRequest,
  getOmniForgeConfig,
  isOmniForgeConfigured,
  OmniForgeClient,
  sha256Hex,
  type OmniForgeChannel,
  type PublicationPolicy,
} from "./omniforge-client";

export type SocialPlatform = OmniForgeChannel;

function publicBaseUrl(): string {
  return (process.env.PUBLIC_BASE_URL || "https://www.bezmasajidla.cz").replace(
    /\/+$/,
    ""
  );
}

export function getSocialPublisherStatus() {
  const config = getOmniForgeConfig();
  return {
    executionOwner: "omniforge" as const,
    localPublisherEnabled: false,
    configured: isOmniForgeConfigured(),
    apiUrl: config.apiUrl || null,
    brandSlug: config.brandSlug,
    facebookConfigured: Boolean(config.facebookAccountId),
    instagramConfigured: Boolean(config.instagramAccountId),
    webhookConfigured: Boolean(config.webhookSecret),
    publishContractReady: true,
    publishEndpointObserved: false,
    publicBaseUrl: publicBaseUrl(),
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
  linkUrl: string
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
    new Set(["#bezmasajidla", "#vegetarianske", "#vegan", ...recipeTags])
  ).join(" ");

  return `${intro}\n\n${body}\n\n${callToAction}\n\n${hashtags}`;
}

function buildTrackedLink(
  recipeSlug: string,
  platform: SocialPlatform
): string {
  const url = new URL(`/recepty/${recipeSlug}`, publicBaseUrl());
  url.searchParams.set("utm_source", platform);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "recipe_distribution");
  return url.toString();
}

function recipeContentVersion(recipe: UserRecipe): string {
  return sha256Hex({
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    prepTime: recipe.prepTime,
    servings: recipe.servings,
    image: recipe.image,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: recipe.tags,
  });
}

type MirrorStatus =
  | "scheduled"
  | "publishing"
  | "published"
  | "failed"
  | "uncertain";

function mirrorStatus(
  state:
    | "DRAFT"
    | "APPROVED"
    | "QUEUED"
    | "PUBLISHING"
    | "PUBLISHED"
    | "FAILED"
    | "CANCELLED"
): MirrorStatus {
  if (state === "PUBLISHING") return "publishing";
  if (state === "PUBLISHED") return "published";
  if (state === "FAILED" || state === "CANCELLED") return "failed";
  return "scheduled";
}

async function upsertStatusMirror(input: {
  recipe: UserRecipe;
  platform: SocialPlatform;
  caption: string;
  imageUrl: string;
  linkUrl: string;
  scheduledFor: Date;
  status: MirrorStatus;
  publicationId?: string | null;
  lastError?: string | null;
}) {
  const db = await getDb();
  if (!db) return;

  await db
    .insert(socialPosts)
    .values({
      recipeId: input.recipe.id,
      recipeSlug: input.recipe.slug,
      platform: input.platform,
      status: input.status,
      caption: input.caption,
      imageUrl: input.imageUrl,
      linkUrl: input.linkUrl,
      copyStyle: "editorial",
      scheduledFor: input.scheduledFor,
      publicationId: input.publicationId,
      attempts: 0,
      lastError: input.lastError,
    })
    .onDuplicateKeyUpdate({
      set: {
        recipeSlug: input.recipe.slug,
        status: input.status,
        caption: input.caption,
        imageUrl: input.imageUrl,
        linkUrl: input.linkUrl,
        scheduledFor: input.scheduledFor,
        publicationId: input.publicationId,
        attempts: 0,
        lastError: input.lastError,
      },
    });
}

export interface SocialHandoffOptions {
  scheduledFor?: Date;
  channels?: SocialPlatform[];
  publicationPolicy: PublicationPolicy;
}

/**
 * Performs one immediate producer-to-control-plane handoff.
 *
 * There is deliberately no local queue, timer, provider call, or retry here.
 * OMNIFORGE owns every transition after its API accepts the request.
 */
export async function scheduleRecipeForSocialMedia(
  recipeId: number,
  options: SocialHandoffOptions
) {
  const recipe = await getUserRecipeById(recipeId);
  if (!recipe) throw new Error("Recept nebyl nalezen.");
  if (!recipe.isApproved) {
    throw new Error("Do OMNIFORGE lze předat pouze schválený recept.");
  }
  if (options.publicationPolicy !== "ORIGINAL") {
    throw new Error("INTERNAL_ONLY obsah nesmí být předán k publikaci.");
  }
  if (!recipe.image || recipe.image.includes("/images/placeholders/")) {
    throw new Error("Recept nemá schválenou publikační fotografii.");
  }

  const requestedChannels: SocialPlatform[] = options.channels?.length
    ? options.channels
    : ["facebook", "instagram"];
  const channels = Array.from(new Set<SocialPlatform>(requestedChannels));
  if (!isOmniForgeConfigured(channels)) {
    throw new Error(
      "OMNIFORGE není kompletně nakonfigurován pro zvolené kanály."
    );
  }

  const config = getOmniForgeConfig();
  const imageUrl = recipe.image.startsWith("/")
    ? `${publicBaseUrl()}${recipe.image}`
    : recipe.image;
  const contentVersion = recipeContentVersion(recipe);
  const client = new OmniForgeClient(config);
  const scheduledFor = options.scheduledFor ?? new Date();

  const submissions = [];
  for (const channel of channels) {
    const accountId =
      channel === "facebook"
        ? config.facebookAccountId
        : config.instagramAccountId;
    if (!accountId) continue;

    const linkUrl = buildTrackedLink(recipe.slug, channel);
    const caption = buildSocialCaption(recipe, channel, linkUrl);
    const request = buildRecipePublishRequest(
      {
        channel,
        accountId,
        sourceId: `recipe:${recipe.id}`,
        contentVersion,
        title: recipe.title,
        caption,
        imageUrl,
        destinationUrl: linkUrl,
        tags: parseRecipeTags(recipe.tags),
        scheduledAt: scheduledFor,
        publicationPolicy: options.publicationPolicy,
      },
      config
    );

    try {
      const response = await client.submitPublishJob(request);
      const job = response.jobs.find(item => item.accountId === accountId);
      if (!job) {
        throw new Error("OMNIFORGE nevrátil job pro požadovaný účet.");
      }
      await upsertStatusMirror({
        recipe,
        platform: channel,
        caption,
        imageUrl,
        linkUrl,
        scheduledFor,
        status: mirrorStatus(job.state),
        publicationId: job.publishJobId,
        lastError: null,
      });
      submissions.push({
        channel,
        accepted: true as const,
        created: job.created,
        publishJobId: job.publishJobId,
        contentItemId: response.contentItemId,
        state: job.state,
        idempotencyKey: request.idempotencyKey,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Neznámá chyba OMNIFORGE.";
      await upsertStatusMirror({
        recipe,
        platform: channel,
        caption,
        imageUrl,
        linkUrl,
        scheduledFor,
        status: "failed",
        publicationId: null,
        lastError: message.slice(0, 2_000),
      });
      submissions.push({
        channel,
        accepted: false as const,
        error: message,
        idempotencyKey: request.idempotencyKey,
      });
    }
  }

  return { contentVersion, submissions };
}

const recipeTitleLookup = new Map<string, string>();
recipes.forEach(recipe => recipeTitleLookup.set(recipe.slug, recipe.title));

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
      publicationId: socialPosts.publicationId,
      externalPostId: socialPosts.externalPostId,
      attempts: socialPosts.attempts,
      lastError: socialPosts.lastError,
      createdAt: socialPosts.createdAt,
      updatedAt: socialPosts.updatedAt,
    })
    .from(socialPosts)
    .leftJoin(userRecipes, eq(socialPosts.recipeId, userRecipes.id))
    .orderBy(desc(socialPosts.scheduledFor));

  return rawPosts.map(post => ({
    ...post,
    recipeTitle:
      post.userRecipeTitle ||
      (post.recipeSlug ? recipeTitleLookup.get(post.recipeSlug) : undefined) ||
      post.recipeSlug ||
      "Bezmasý recept",
  }));
}
