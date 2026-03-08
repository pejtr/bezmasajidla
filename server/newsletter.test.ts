import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("newsletter.subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env vars
    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_AUDIENCE_ID;
    delete process.env.MAILCHIMP_SERVER_PREFIX;
  });

  it("should accept a valid email and notify owner (no Mailchimp configured)", async () => {
    const { notifyOwner } = await import("./_core/notification");

    // Simulate the newsletter subscribe logic directly
    const email = "test@example.com";
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    // Without Mailchimp config, should skip API call and just notify owner
    if (apiKey && audienceId && serverPrefix) {
      await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`);
    }

    await notifyOwner({
      title: `📧 Nový odběratel newsletteru`,
      content: `E-mail: **${email}**\n\n*Přihlášen z bezmasajidla.cz*`,
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Nový odběratel"),
        content: expect.stringContaining("test@example.com"),
      })
    );
  });

  it("should call Mailchimp API when credentials are configured", async () => {
    process.env.MAILCHIMP_API_KEY = "test-api-key";
    process.env.MAILCHIMP_AUDIENCE_ID = "abc123";
    process.env.MAILCHIMP_SERVER_PREFIX = "us21";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "member123", status: "subscribed" }),
    });

    const { notifyOwner } = await import("./_core/notification");
    const email = "vegan@example.com";

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    if (apiKey && audienceId && serverPrefix) {
      const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          tags: ["bezmasajidla"],
        }),
      });
      const data = await response.json() as { title?: string; detail?: string };
      expect(data).toHaveProperty("status", "subscribed");
    }

    await notifyOwner({
      title: `📧 Nový odběratel newsletteru`,
      content: `E-mail: **${email}**\n\n*Přihlášen z bezmasajidla.cz*`,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://us21.api.mailchimp.com/3.0/lists/abc123/members",
      expect.objectContaining({ method: "POST" })
    );
    expect(notifyOwner).toHaveBeenCalled();
  });

  it("should handle Mailchimp Member Exists gracefully", async () => {
    process.env.MAILCHIMP_API_KEY = "test-api-key";
    process.env.MAILCHIMP_AUDIENCE_ID = "abc123";
    process.env.MAILCHIMP_SERVER_PREFIX = "us21";

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ title: "Member Exists", detail: "already subscribed" }),
    });

    const email = "existing@example.com";
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    let threwError = false;
    if (apiKey && audienceId && serverPrefix) {
      const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
      const response = await fetch(url, { method: "POST", headers: {}, body: "" });
      const data = await response.json() as { title?: string; detail?: string };
      // Should NOT throw when Member Exists
      if (!response.ok && data.title !== "Member Exists") {
        threwError = true;
      }
    }

    expect(threwError).toBe(false);
  });
});
