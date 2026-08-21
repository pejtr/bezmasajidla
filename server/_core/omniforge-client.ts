// ============================================================
// BEZMASAJIDLA.CZ — OMNIFORGE Producer Client (SDK Lite)
// Standardized client for connecting to OMNIFORGE Central Publishing API.
// ============================================================

import type { SocialPost } from "../../drizzle/schema";

export interface OmniForgeConfig {
  apiKey?: string;
  projectId?: string;
  apiUrl?: string;
  webhookSecret?: string;
}

export function getOmniForgeConfig(): OmniForgeConfig {
  return {
    apiKey: process.env.OMNIFORGE_API_KEY,
    projectId: process.env.OMNIFORGE_PROJECT_ID || "bezmasajidla",
    apiUrl: (process.env.OMNIFORGE_API_URL || "https://api.omniforge.io").replace(/\/+$/, ""),
    webhookSecret: process.env.OMNIFORGE_WEBHOOK_SECRET,
  };
}

export function isOmniForgeConfigured(): boolean {
  const config = getOmniForgeConfig();
  return Boolean(config.apiKey && config.apiKey.length > 5);
}

export class OmniForgeClient {
  private config: OmniForgeConfig;

  constructor(config = getOmniForgeConfig()) {
    this.config = config;
  }

  /**
   * Dispatches a publication intent to OMNIFORGE Central Hub
   */
  async publish(post: SocialPost): Promise<{ externalPostId: string; omniPublicationId?: string }> {
    if (!this.config.apiKey) {
      throw new Error("OMNIFORGE_API_KEY is not configured");
    }

    const payload = {
      idempotencyKey: `bj_post_${post.id}_${post.platform}`,
      project: this.config.projectId || "bezmasajidla",
      targets: [
        {
          platform: post.platform,
          targetType: post.platform === "facebook" ? "page_feed" : "business_feed",
          targetId: "auto_default",
        },
      ],
      content: {
        text: post.caption,
        mediaUrls: post.imageUrl ? [post.imageUrl] : [],
        canonicalUrl: post.linkUrl,
        metadata: {
          recipeSlug: post.recipeSlug,
          copyStyle: post.copyStyle,
          publishingSlot: post.publishingSlot,
          internalPostId: post.id,
        },
      },
      scheduledFor: post.scheduledFor.toISOString(),
    };

    const response = await fetch(`${this.config.apiUrl}/v1/publications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        "X-Project-Id": this.config.projectId || "bezmasajidla",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`OMNIFORGE API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return {
      externalPostId: data.providerPostId || data.publicationId || `omni_${data.id}`,
      omniPublicationId: data.publicationId,
    };
  }

  /**
   * Cancels a scheduled publication in OMNIFORGE
   */
  async cancel(publicationId: string): Promise<boolean> {
    if (!this.config.apiKey) return false;

    try {
      const response = await fetch(`${this.config.apiUrl}/v1/publications/${publicationId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "X-Project-Id": this.config.projectId || "bezmasajidla",
        },
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
