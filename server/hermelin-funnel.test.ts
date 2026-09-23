// ============================================================
// BEZMASAJIDLA.CZ — Hermelín Lead Magnet Funnel Test Suite
// Verifies SEO, Content, Food Safety, Schema.org, Tracking & Email Delivery
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

// ── Mock DB & External APIs for Router Testing ───────────────
vi.mock("./db", () => ({
  getReviewsByRestaurant: vi.fn(),
  getReviewsByUser: vi.fn(),
  createReview: vi.fn(),
  deleteReview: vi.fn(),
  getRestaurantAverageRating: vi.fn(),
  getUserFavorites: vi.fn(),
  toggleFavorite: vi.fn(),
  isFavorited: vi.fn(),
  getUserRecipes: vi.fn(),
  getApprovedUserRecipes: vi.fn().mockResolvedValue([]),
  getUserRecipeBySlug: vi.fn(),
  getUserRecipeById: vi.fn(),
  createUserRecipe: vi.fn(),
  deleteUserRecipe: vi.fn(),
  syncFavorites: vi.fn(),
  getAllUserRecipes: vi.fn(),
  approveUserRecipe: vi.fn(),
  rejectUserRecipe: vi.fn(),
  getAllReviews: vi.fn(),
  adminDeleteReview: vi.fn(),
}));

vi.mock("./_core/social-media", () => ({
  distributeToSocialMedia: vi.fn().mockResolvedValue(undefined),
  scheduleRecipeForSocialMedia: vi.fn().mockResolvedValue(undefined),
}));

const mockSubscribeToBrevo = vi.fn().mockResolvedValue({
  success: true,
  message: "Contact added/updated in Brevo",
});
const mockSendBrevoEmail = vi.fn().mockResolvedValue({
  success: true,
  messageId: "mock-message-id",
});
vi.mock("./_core/brevo", () => ({
  subscribeToBrevo: (...args: any[]) => mockSubscribeToBrevo(...args),
  sendBrevoEmail: (...args: any[]) => mockSendBrevoEmail(...args),
}));

const mockNotifyOwner = vi.fn().mockResolvedValue(true);
vi.mock("./_core/notification", () => ({
  notifyOwner: (...args: any[]) => mockNotifyOwner(...args),
}));

// ── 1. Static Assets Verification ────────────────────────────
describe("Hermelín Lead Magnet — Static Assets Gate", () => {
  const rootDir = path.resolve(__dirname, "..");
  const pdfPath = path.join(rootDir, "client/public/ebooks/hermelin_around_the_world_ebook.pdf");
  const imgPath = path.join(rootDir, "client/public/images/hermelin-15-variant-prehled.jpg");

  it("should verify Hermelín Around the World PDF exists and is not corrupt/empty", () => {
    expect(fs.existsSync(pdfPath)).toBe(true);
    const stats = fs.statSync(pdfPath);
    // Verified 7.08 MB in previous session
    expect(stats.size).toBeGreaterThan(1_000_000);
  });

  it("should verify 15-variant overview master image exists", () => {
    expect(fs.existsSync(imgPath)).toBe(true);
    const stats = fs.statSync(imgPath);
    expect(stats.size).toBeGreaterThan(50_000);
  });
});

// ── 2. Editorial & Food Safety Verification ──────────────────
describe("Hermelín Pillar Page — Editorial & Food Safety Gate", () => {
  const rootDir = path.resolve(__dirname, "..");
  const pagePath = path.join(rootDir, "client/src/pages/HermelinPillarPage.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  it("should NOT contain '15 ověřených receptů' claim", () => {
    expect(pageContent.toLowerCase()).not.toContain("15 ověřených receptů");
  });

  it("should use '15 autorských receptů' or '15 autorských variant'", () => {
    const hasAutorskeVarianty =
      pageContent.includes("15 autorských variant") ||
      pageContent.includes("15 autorských receptů");
    expect(hasAutorskeVarianty).toBe(true);
  });

  it("should warn about anaerobic environment, botulinum risk, and require refrigeration (2–6 °C)", () => {
    expect(pageContent).toContain("chlazená potravina");
    expect(pageContent).toContain("anaerobní prostředí");
    expect(pageContent).toContain("2–6 °C");
    expect(pageContent).toContain("Clostridium botulinum");
  });

  it("should NOT claim a single fixed universal shelf life", () => {
    expect(pageContent).toContain("Neexistuje univerzální bezpečná lhůta");
  });

  it("should preserve the 3 complete recipes: Bohemian Classic, Volcano, Sicilia", () => {
    expect(pageContent).toContain("Bohemian Classic");
    expect(pageContent).toContain("Volcano");
    expect(pageContent).toContain("Sicilia");
  });

  it("should keep Essaouira as a teaser without leaking full recipe ratios", () => {
    expect(pageContent).toContain("Essaouira");
    expect(pageContent).toContain("teaser");
    // Essaouira should NOT have full recipe slug schema in the article
    expect(pageContent).not.toContain('slug="recept-essaouira"');
  });

  it("should render 3 CTA positions (A, B, C)", () => {
    expect(pageContent).toContain('<HermelinEbookCta position="A"');
    expect(pageContent).toContain('<HermelinEbookCta position="B"');
    expect(pageContent).toContain('<HermelinEbookCta position="C"');
  });

  it("should include internal links to core hubs", () => {
    expect(pageContent).toContain("/recepty/ceska-klasika-bez-masa");
    expect(pageContent).toContain("/recepty/rychle-bezmase-vecere");
    expect(pageContent).toContain("/recepty/tofu");
    expect(pageContent).toContain('href="/recepty"');
  });
});

// ── 3. SEO & Schema.org Gate ─────────────────────────────────
describe("Hermelín Pillar Page — Schema.org & SEO Gate", () => {
  const rootDir = path.resolve(__dirname, "..");
  const pagePath = path.join(rootDir, "client/src/pages/HermelinPillarPage.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  it("should have canonical URL matching https://www.bezmasajidla.cz/varianty-nakladaneho-hermelinu", () => {
    expect(pageContent).toContain('canonicalUrl="https://www.bezmasajidla.cz/varianty-nakladaneho-hermelinu"');
  });

  it("should emit ArticleJsonLd and FAQPageJsonLd and BreadcrumbJsonLd", () => {
    expect(pageContent).toContain("<ArticleJsonLd");
    expect(pageContent).toContain("<BreadcrumbJsonLd");
    expect(pageContent).toContain("<FAQPageJsonLd");
  });

  it("should emit EXACTLY 3 Recipe schema components for the 3 full recipes and NOT for teasers", () => {
    const matches = pageContent.match(/<HermelinRecipeJsonLd/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(3);

    // Verify specifically Bohemian Classic, Volcano, Sicilia
    expect(pageContent).toContain('slug="recept-bohemian-classic"');
    expect(pageContent).toContain('slug="recept-volcano"');
    expect(pageContent).toContain('slug="recept-sicilia"');

    // Ensure Essaouira does NOT emit RecipeJsonLd
    expect(pageContent).not.toContain('slug="recept-essaouira"');
  });
});

// ── 4. App Router & XML Sitemap Gate ─────────────────────────
describe("Hermelín Funnel — Router & Sitemap Gate", () => {
  const rootDir = path.resolve(__dirname, "..");
  const appPath = path.join(rootDir, "client/src/App.tsx");
  const sitemapPath = path.join(rootDir, "server/_core/sitemap.ts");

  it("should have /varianty-nakladaneho-hermelinu registered in App.tsx", () => {
    const appContent = fs.readFileSync(appPath, "utf-8");
    expect(appContent).toContain('path="/varianty-nakladaneho-hermelinu"');
    expect(appContent).toContain("HermelinPillarPage");
  });

  it("should have /varianty-nakladaneho-hermelinu registered in sitemap.ts", () => {
    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
    expect(sitemapContent).toContain('addUrl("/varianty-nakladaneho-hermelinu"');
  });
});

// ── 5. Analytics & Zero PII Gate ─────────────────────────────
describe("Hermelín Analytics — Zero PII & Event Coverage", () => {
  const rootDir = path.resolve(__dirname, "..");
  const trackingPath = path.join(rootDir, "client/src/lib/hermelinTracking.ts");
  const trackingContent = fs.readFileSync(trackingPath, "utf-8");

  it("should define all required 6 events", () => {
    const requiredEvents = [
      "hermelin_article_view",
      "hermelin_ebook_cta_view",
      "hermelin_ebook_cta_click",
      "hermelin_ebook_signup_started",
      "hermelin_ebook_signup_completed",
      "hermelin_ebook_downloaded",
    ];

    for (const evt of requiredEvents) {
      expect(trackingContent).toContain(evt);
    }
  });

  it("should never include email or PII in HermelinTrackingPayload interface", () => {
    expect(trackingContent).not.toContain("email?: string");
    expect(trackingContent).not.toContain("email: string");
    expect(trackingContent).not.toContain("name?: string");
  });
});

// ── 6. Backend Lead Magnet Subscription Gate ────────────────
describe("Backend — newsletter.subscribe Lead Magnet Contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully process lead magnet signup and trigger transactional email with download link", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller({
      req: { ip: "127.0.0.1", headers: {} },
    } as any);

    const result = await caller.newsletter.subscribe({
      email: "lead.gourmet@example.com",
      source: "hermelin_ebook",
      landingPage: "/varianty-nakladaneho-hermelinu",
      utmSource: "facebook",
      utmMedium: "cpc",
      utmCampaign: "spring_hermelin",
      utmContent: "cta_b",
      consent: true,
    });

    expect(result.success).toBe(true);
    expect(result.downloadUrl).toBe("/ebooks/hermelin_around_the_world_ebook.pdf");

    // Check Brevo subscription called with correct attributes
    expect(mockSubscribeToBrevo).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "lead.gourmet@example.com",
        source: "hermelin_ebook",
        attributes: expect.objectContaining({
          SOURCE: "hermelin_ebook",
          LANDING_PAGE: "/varianty-nakladaneho-hermelinu",
          UTM_SOURCE: "facebook",
          UTM_MEDIUM: "cpc",
          UTM_CAMPAIGN: "spring_hermelin",
          UTM_CONTENT: "cta_b",
          CONSENT_STATE: "GRANTED",
        }),
      })
    );

    // Check transactional delivery email sent with HTTPS download link
    expect(mockSendBrevoEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        toEmail: "lead.gourmet@example.com",
        subject: expect.stringContaining("Hermelín Around the World"),
        htmlContent: expect.stringContaining(
          "https://www.bezmasajidla.cz/ebooks/hermelin_around_the_world_ebook.pdf"
        ),
      })
    );

    // Check owner notification sent with attribution details
    expect(mockNotifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Hermelín Around the World"),
        content: expect.stringContaining("lead.gourmet@example.com"),
      })
    );
  }, 30000);

  it("should handle existing/duplicate subscriber gracefully without error", async () => {
    mockSubscribeToBrevo.mockResolvedValueOnce({
      success: true,
      message: "Contact already existed; attributes updated.",
    });

    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller({
      req: { ip: "127.0.0.1", headers: {} },
    } as any);

    const result = await caller.newsletter.subscribe({
      email: "duplicate.subscriber@example.com",
      source: "hermelin_ebook",
      landingPage: "/varianty-nakladaneho-hermelinu",
      consent: true,
    });

    expect(result.success).toBe(true);
    expect(mockSendBrevoEmail).toHaveBeenCalled();
  }, 30000);
});
