import { describe, expect, it, vi } from "vitest";
import type { SocialPost } from "../drizzle/schema";
import {
  buildSocialCaption,
  MetaGraphClient,
  type SocialPublisherConfig,
} from "./_core/social-media";

const config: SocialPublisherConfig = {
  enabled: true,
  graphApiVersion: "v24.0",
  accessToken: "test-token",
  facebookPageId: "page-123",
  instagramAccountId: "ig-456",
  publicBaseUrl: "https://www.bezmasajidla.cz",
};

function post(platform: "facebook" | "instagram"): SocialPost {
  const now = new Date();
  return {
    id: 1,
    recipeId: 42,
    platform,
    status: "scheduled",
    caption: "Nový recept",
    imageUrl: "https://www.bezmasajidla.cz/images/recept.webp",
    linkUrl: "https://www.bezmasajidla.cz/recepty/test",
    scheduledFor: now,
    publishedAt: null,
    externalPostId: null,
    attempts: 0,
    lastError: null,
    createdAt: now,
    updatedAt: now,
  };
}

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("social media publisher", () => {
  it("builds a Czech caption with recipe tags and link", () => {
    const caption = buildSocialCaption(
      {
        title: "Brokolicová polévka s hráškem",
        description: "Zářivě zelená krémová polévka.",
        tags: JSON.stringify(["Brokolice", "Do 30 min"]),
      },
      "facebook",
      "https://www.bezmasajidla.cz/recepty/brokolicova-polevka",
    );

    expect(caption).toContain("Brokolicová polévka s hráškem");
    expect(caption).toContain("#Brokolice");
    expect(caption).toContain("#Do30min");
    expect(caption).toContain("https://www.bezmasajidla.cz/recepty/");
  });

  it("publishes a Facebook image post through the Page photos edge", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ id: "photo-1", post_id: "page-123_789" }),
    );
    const client = new MetaGraphClient(config, fetchMock as typeof fetch);

    await expect(client.publish(post("facebook"))).resolves.toBe(
      "page-123_789",
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://graph.facebook.com/v24.0/page-123/photos",
    );
    expect(String(init?.body)).toContain("published=true");
    expect(String(init?.body)).toContain("test-token");
  });

  it("creates, waits for and publishes an Instagram image container", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ id: "container-1" }))
      .mockResolvedValueOnce(jsonResponse({ status_code: "FINISHED" }))
      .mockResolvedValueOnce(jsonResponse({ id: "instagram-post-1" }));
    const client = new MetaGraphClient(config, fetchMock as typeof fetch);

    await expect(client.publish(post("instagram"))).resolves.toBe(
      "instagram-post-1",
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toContain("/ig-456/media");
    expect(fetchMock.mock.calls[1][0]).toContain(
      "/container-1?fields=status_code",
    );
    expect(fetchMock.mock.calls[2][0]).toContain("/ig-456/media_publish");
  });

  it("rejects Instagram jobs without a public HTTPS image", async () => {
    const client = new MetaGraphClient(config, vi.fn() as unknown as typeof fetch);
    const invalidPost = { ...post("instagram"), imageUrl: "/local.webp" };

    await expect(client.publish(invalidPost)).rejects.toThrow(
      "veřejně dostupný obrázek přes HTTPS",
    );
  });
});
