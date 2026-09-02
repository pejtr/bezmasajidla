import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { redirectMiddleware } from "./redirect";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { startDailyRecipeCronJob } from "./ai-recipe";
import { startSocialPublisher } from "./social-media";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();

  app.use(redirectMiddleware);

  const server = createServer(app);
  // Body parser with rawBody preservation for cryptographic HMAC webhook signatures
  app.use(
    express.json({
      limit: "1mb",
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ limit: "1mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Redirect legacy /assets/ URLs indexed by search engines back to homepage
  app.use((req, res, next) => {
    if (req.path.startsWith("/assets/") && (req.headers["sec-fetch-dest"] === "document" || req.headers.accept?.includes("text/html"))) {
      return res.redirect(301, "/");
    }
    next();
  });

  // Robots.txt Handler
  app.get("/robots.txt", (_req, res) => {
    res.header("Content-Type", "text/plain");
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /assets/\nDisallow: /api/\nSitemap: https://www.bezmasajidla.cz/sitemap.xml\n`
    );
  });

  // Sitemap & Legacy WordPress Sitemap Handler
  app.get(["/sitemap.xml", "/*sitemap*.xml", "/sitemap_index.xml"], async (_req, res) => {
    try {
      const { generateSitemap } = await import("./sitemap");
      const xml = await generateSitemap();
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap Error]", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // RSS & Atom Feeds
  app.get(["/rss.xml", "/feed.xml"], async (req, res) => {
    try {
      const { generateRssFeed } = await import("./rss");
      const xml = generateRssFeed();
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("[RSS] Error generating feed:", err);
      res.status(500).end();
    }
  });

  // IndexNow Verification Key
  app.get("/bezmasajidla2026indexnowkey.txt", (req, res) => {
    res.header("Content-Type", "text/plain");
    res.send("bezmasajidla2026indexnowkey");
  });

  // Comgate Payment Webhook
  app.post("/api/webhooks/comgate", async (req, res) => {
    try {
      const { parseComgateWebhook } = await import("./comgate");
      const notification = parseComgateWebhook(req.body as Record<string, string>);

      if (!notification.isValid) {
        console.warn("[Comgate Webhook] Invalid secret or merchant payload received.");
        res.status(400).send("code=1&message=INVALID_MERCHANT_OR_SECRET");
        return;
      }

      console.log(`[Comgate Webhook] Payment status updated: orderId=${notification.orderId}, status=${notification.status}, amount=${notification.priceCzk} CZK`);

      if (notification.status === "PAID") {
        // Send confirmation email via Brevo
        if (notification.email) {
          const { sendBrevoEmail } = await import("./brevo");
          await sendBrevoEmail({
            toEmail: notification.email,
            subject: "✨ Potvrzení platby — Bezmasá Jídla / Bezmasý Warrior",
            htmlContent: `<div style="font-family: sans-serif; padding: 20px;">
              <h2>Děkujeme za vaši platbu!</h2>
              <p>Vaše objednávka č. <strong>${notification.orderId}</strong> na částku <strong>${notification.priceCzk} Kč</strong> byla úspěšně přijata.</p>
              <p>Přístupové údaje a e-kniha vám byly zpřístupněny na bezmasajidla.cz.</p>
            </div>`,
          });
        }
      }

      res.header("Content-Type", "application/x-www-form-urlencoded");
      res.send("code=0&message=OK");
    } catch (err) {
      console.error("[Comgate Webhook Error]", err);
      res.status(500).send("code=1&message=SERVER_ERROR");
    }
  });

  // Safe Affiliate Click & Redirect Endpoint (prevents open-redirects)
  app.get("/api/affiliate/redirect", async (req, res) => {
    try {
      const merchant = req.query.merchant as string;
      const productId = req.query.productId as string | undefined;
      const destUrl = req.query.url as string | undefined;
      const recipeSlug = req.query.recipeSlug as string | undefined;
      const placement = (req.query.placement as string) || "direct_link";
      const rawSocialPostId = req.query.socialPostId as string | undefined;
      const socialPostId = rawSocialPostId ? parseInt(rawSocialPostId, 10) : undefined;
      const attributionSessionId = req.query.attributionSessionId as string | undefined;

      if (merchant !== "ekoclovek" && merchant !== "zazitky") {
        return res.status(400).send("Invalid merchant");
      }

      const { recordAffiliateEvent } = await import("../affiliate/storage");
      const { getSafeAffiliateUrl } = await import("../affiliate/links");

      // Record exactly ONE internal click event with server-authoritative attribution
      await recordAffiliateEvent({
        eventType: "click",
        merchant,
        productId: productId || "unknown",
        recipeSlug,
        placement,
        socialPostId: socialPostId && !isNaN(socialPostId) ? socialPostId : undefined,
        attributionSessionId,
        referrer: req.headers.referer,
      });

      const safeUrl = await getSafeAffiliateUrl({
        merchant: merchant as "ekoclovek" | "zazitky",
        productId,
        destinationUrl: destUrl,
      });

      res.redirect(302, safeUrl);
    } catch (err) {
      console.error("[Affiliate Redirect Error]", err);
      res.redirect(302, "https://www.bezmasajidla.cz/");
    }
  });

  // OMNIFORGE Central Publishing Hub Webhook Feedback Receiver
  app.post("/api/webhooks/omniforge", async (req, res) => {
    let claimedEventId: string | undefined;

    try {
      const {
        verifyOmniForgeWebhookSignature,
        claimAndCheckWebhookEvent,
        markWebhookEventProcessed,
        markWebhookEventFailed,
      } = await import("./omniforge-webhook");
      const { getOmniForgeConfig } = await import("./omniforge-client");
      const config = getOmniForgeConfig();

      const signatureHeader =
        (req.headers["x-omniforge-signature"] as string) ||
        (req.headers["X-OmniForge-Signature"] as string);
      const timestampHeader =
        (req.headers["x-omniforge-timestamp"] as string) ||
        (req.headers["X-OmniForge-Timestamp"] as string);

      const rawBody =
        (req as any).rawBody ||
        (typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}));

      // 1. HMAC Signature Verification & Timestamp Freshness
      if (config.webhookSecret) {
        const signatureCheck = verifyOmniForgeWebhookSignature({
          signatureHeader,
          timestampHeader,
          rawBody,
          secret: config.webhookSecret,
        });

        if (!signatureCheck.valid) {
          console.warn("[OMNIFORGE Webhook] Security rejection:", signatureCheck.reason);
          return res.status(401).json({ error: signatureCheck.reason || "Unauthorized signature" });
        }
      }

      const payload = req.body || {};
      const eventId = payload.eventId || payload.id;
      const event = payload.event || payload.eventType;
      const internalPostId = payload.metadata?.internalPostId || payload.internalPostId;
      const publicationId = payload.publicationId || payload.metadata?.publicationId;
      const providerPostId = payload.providerPostId;
      const status = payload.status;

      // 2. Durable Event Claim: Inserts 'received' status; if already 'processed', returns NO-OP
      if (eventId) {
        claimedEventId = eventId;
        const claimResult = await claimAndCheckWebhookEvent({
          eventId,
          publicationId,
          eventType: event,
          rawBody,
        });

        if (!claimResult.shouldProcess && claimResult.isDuplicate) {
          return res
            .status(200)
            .json({ received: true, deduplicated: true, message: "Duplicate event already processed" });
        }
      }

      if (!internalPostId && !publicationId) {
        return res.status(400).json({ error: "Missing internalPostId / publicationId in payload metadata" });
      }

      const { getDb } = await import("../db");
      const { socialPosts } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();

      if (db) {
        const whereClause = internalPostId
          ? eq(socialPosts.id, Number(internalPostId))
          : publicationId
            ? eq(socialPosts.publicationId, String(publicationId))
            : null;

        if (whereClause) {
          if (event === "publication.published" || status === "published") {
            await db
              .update(socialPosts)
              .set({
                status: "published",
                publishedAt: new Date(payload.publishedAt || Date.now()),
                externalPostId: providerPostId || publicationId,
                publicationId: publicationId || undefined,
                lastError: null,
              })
              .where(whereClause);
          } else if (event === "publication.failed" || status === "failed") {
            await db
              .update(socialPosts)
              .set({
                status: "failed",
                publicationId: publicationId || undefined,
                lastError: (payload.error || "Chyba publikace přes OMNIFORGE").slice(0, 2000),
              })
              .where(whereClause);
          } else if (event === "publication.uncertain" || status === "uncertain") {
            await db
              .update(socialPosts)
              .set({
                status: "uncertain",
                publicationId: publicationId || undefined,
                lastError: "OMNIFORGE hlásí nejednoznačný stav (timeout API).",
              })
              .where(whereClause);
          }
        }
      }

      // 3. Mark event as successfully processed in DB
      if (claimedEventId) {
        await markWebhookEventProcessed(claimedEventId);
      }

      return res.status(200).json({ received: true, event, internalPostId, publicationId });
    } catch (err) {
      console.error("[OMNIFORGE Webhook Error]", err);
      if (claimedEventId) {
        const { markWebhookEventFailed } = await import("./omniforge-webhook");
        await markWebhookEventFailed(claimedEventId, err);
      }
      return res.status(500).json({ error: "Internal webhook processing error" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Railway / Container Health Check Endpoint
  app.get(["/health", "/api/health"], (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── Catering Pricing Engine & Revenue Gate ─────────────────────
  interface ServerPackageRule {
    id: string;
    name: string;
    pricePerPerson: number;
    minGuests: number;
    maxGuests?: number;
  }

  const SERVER_CATERING_PACKAGES: Record<string, ServerPackageRule> = {
    office: { id: "office", name: "GREEN OFFICE", pricePerPerson: 590, minGuests: 15, maxGuests: 150 },
    signature: { id: "signature", name: "MATOUŠ SIGNATURE", pricePerPerson: 950, minGuests: 10, maxGuests: 150 },
    privatetable: { id: "privatetable", name: "PRIVATE TABLE BY MATOUŠ", pricePerPerson: 1800, minGuests: 6, maxGuests: 15 },
  };

  interface CateringLeadRecord {
    id: number;
    leadCode: string;
    status: "NEW" | "OFFER_SENT" | "WON" | "LOST";
    lostReason?: string;
    name: string;
    email: string;
    phone: string;
    eventDate?: string;
    notes?: string;
    packageId: string;
    packageName: string;
    guestCount: number;
    includeDrinks: boolean;
    includeGlassware: boolean;
    includeStaff: boolean;
    estimatedRevenue: number;
    finalRevenue?: number;
    foodCost?: number;
    chefCost?: number;
    staffCost?: number;
    transportCost?: number;
    equipmentCost?: number;
    marketingCost?: number;
    otherCost?: number;
    contribution?: number;
    marginPct?: number;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referrer?: string;
    landingPage?: string;
    createdAt: string;
  }

  const inMemoryCateringLeads: CateringLeadRecord[] = [];

  // Commercial Lead Inquiry Endpoint (Server-Side Pricing & Validation)
  app.post("/api/catering-inquiry", async (req, res) => {
    try {
      const body = req.body || {};
      const {
        name, email, phone, date, notes,
        packageId, guestCount, includeDrinks, includeGlassware, includeStaff,
        utmSource, utmMedium, utmCampaign, referrer, landingPage
      } = body;

      if (!name || !email || !phone || !packageId || !guestCount) {
        return res.status(400).json({ error: "Missing required inquiry fields (name, email, phone, packageId, guestCount)." });
      }

      const pkg = SERVER_CATERING_PACKAGES[packageId];
      if (!pkg) {
        return res.status(400).json({ error: `Unknown catering packageId: ${packageId}` });
      }

      const numGuests = parseInt(guestCount, 10);
      if (isNaN(numGuests) || numGuests < pkg.minGuests) {
        return res.status(400).json({
          error: `Balíček ${pkg.name} vyžaduje minimálně ${pkg.minGuests} osob.`
        });
      }

      if (pkg.maxGuests && numGuests > pkg.maxGuests) {
        return res.status(400).json({
          error: `Balíček ${pkg.name} umožňuje maximálně ${pkg.maxGuests} osob.`
        });
      }

      // Server-Side Pricing Engine (Never trust client-passed price)
      const drinksFee = includeDrinks ? 150 : 0;
      const glasswareFee = includeGlassware ? 80 : 0;
      const staffFee = includeStaff ? 3500 : 0;
      const calculatedPerPerson = pkg.pricePerPerson + drinksFee + glasswareFee;
      const estimatedRevenue = calculatedPerPerson * numGuests + staffFee;

      const leadCode = `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const leadRecord: CateringLeadRecord = {
        id: inMemoryCateringLeads.length + 1,
        leadCode,
        status: "NEW",
        name,
        email,
        phone,
        eventDate: date || undefined,
        notes: notes || undefined,
        packageId: pkg.id,
        packageName: pkg.name,
        guestCount: numGuests,
        includeDrinks: Boolean(includeDrinks),
        includeGlassware: Boolean(includeGlassware),
        includeStaff: Boolean(includeStaff),
        estimatedRevenue,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        referrer: referrer || undefined,
        landingPage: landingPage || undefined,
        createdAt: new Date().toISOString(),
      };

      inMemoryCateringLeads.unshift(leadRecord);

      // Attempt DB persistence
      try {
        const { getDb } = await import("../db");
        const { cateringLeads } = await import("../../drizzle/schema");
        const db = await getDb();
        if (db) {
          await db.insert(cateringLeads).values({
            leadCode: leadRecord.leadCode,
            status: "NEW",
            name: leadRecord.name,
            email: leadRecord.email,
            phone: leadRecord.phone,
            eventDate: leadRecord.eventDate,
            notes: leadRecord.notes,
            packageId: leadRecord.packageId,
            packageName: leadRecord.packageName,
            guestCount: leadRecord.guestCount,
            includeDrinks: leadRecord.includeDrinks,
            includeGlassware: leadRecord.includeGlassware,
            includeStaff: leadRecord.includeStaff,
            estimatedRevenue: leadRecord.estimatedRevenue,
            utmSource: leadRecord.utmSource,
            utmMedium: leadRecord.utmMedium,
            utmCampaign: leadRecord.utmCampaign,
            referrer: leadRecord.referrer,
            landingPage: leadRecord.landingPage,
          });
        }
      } catch (dbErr) {
        console.warn("[DB Catering Lead Persist Warning]:", dbErr);
      }

      console.log("==================================================");
      console.log(`🌿 NEW CATERING LEAD [${leadCode}]:`);
      console.log(`Customer: ${name} (${email}, ${phone})`);
      console.log(`Package: ${pkg.name} | Guests: ${numGuests}`);
      console.log(`Server-Calculated Estimated Revenue: ${estimatedRevenue} Kč`);
      console.log(`UTM: ${utmSource || 'direct'} / ${utmMedium || 'none'} / ${utmCampaign || 'none'}`);
      console.log("==================================================");

      return res.status(200).json({
        success: true,
        message: "Poptávka byla úspěšně zaznamenána.",
        leadCode,
        estimatedRevenue,
      });
    } catch (e: any) {
      console.error("[Catering Lead Error]:", e);
      return res.status(500).json({ error: e.message || "Failed to record inquiry" });
    }
  });

  // Admin Catering Leads API — List all leads
  app.get("/api/admin/catering-leads", async (_req, res) => {
    try {
      let dbLeads: any[] = [];
      try {
        const { getDb } = await import("../db");
        const { cateringLeads } = await import("../../drizzle/schema");
        const db = await getDb();
        if (db) {
          const { desc } = await import("drizzle-orm");
          dbLeads = await db.select().from(cateringLeads).orderBy(desc(cateringLeads.createdAt));
        }
      } catch {
        dbLeads = [];
      }

      const merged = dbLeads.length > 0 ? dbLeads : inMemoryCateringLeads;
      return res.status(200).json({ leads: merged });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Admin Catering Lead Update API — Profit Gate Financial Entry (Costs, Revenue, Contribution, Margin %)
  app.post("/api/admin/catering-leads/update", async (req, res) => {
    try {
      const body = req.body || {};
      const {
        leadCode, status, lostReason, finalRevenue,
        foodCost, chefCost, staffCost, transportCost, equipmentCost, marketingCost, otherCost
      } = body;

      if (!leadCode) {
        return res.status(400).json({ error: "Missing leadCode" });
      }

      const numFinalRev = parseInt(finalRevenue, 10) || 0;
      const numFood = parseInt(foodCost, 10) || 0;
      const numChef = parseInt(chefCost, 10) || 0;
      const numStaff = parseInt(staffCost, 10) || 0;
      const numTransport = parseInt(transportCost, 10) || 0;
      const numEquip = parseInt(equipmentCost, 10) || 0;
      const numMktg = parseInt(marketingCost, 10) || 0;
      const numOther = parseInt(otherCost, 10) || 0;

      const totalCosts = numFood + numChef + numStaff + numTransport + numEquip + numMktg + numOther;
      const contribution = numFinalRev - totalCosts;
      const marginPct = numFinalRev > 0 ? Number(((contribution / numFinalRev) * 100).toFixed(2)) : 0;
      const isTargetMet = marginPct >= 25.0;

      // Update memory record
      const idx = inMemoryCateringLeads.findIndex(l => l.leadCode === leadCode);
      if (idx !== -1) {
        inMemoryCateringLeads[idx] = {
          ...inMemoryCateringLeads[idx],
          status: status || inMemoryCateringLeads[idx].status,
          lostReason,
          finalRevenue: numFinalRev,
          foodCost: numFood,
          chefCost: numChef,
          staffCost: numStaff,
          transportCost: numTransport,
          equipmentCost: numEquip,
          marketingCost: numMktg,
          otherCost: numOther,
          contribution,
          marginPct,
        };
      }

      // Update DB record
      try {
        const { getDb } = await import("../db");
        const { cateringLeads } = await import("../../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDb();
        if (db) {
          await db
            .update(cateringLeads)
            .set({
              status,
              lostReason,
              finalRevenue: numFinalRev,
              foodCost: numFood,
              chefCost: numChef,
              staffCost: numStaff,
              transportCost: numTransport,
              equipmentCost: numEquip,
              marketingCost: numMktg,
              otherCost: numOther,
              contribution,
              marginPct: marginPct.toString() as any,
            })
            .where(eq(cateringLeads.leadCode, leadCode));
        }
      } catch (dbErr) {
        console.warn("[DB Catering Lead Update Warning]:", dbErr);
      }

      return res.status(200).json({
        success: true,
        leadCode,
        finalRevenue: numFinalRev,
        totalCosts,
        contribution,
        marginPct,
        isProfitGateTargetMet: isTargetMet,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // On production platforms (e.g. Railway), bind strictly to process.env.PORT
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : await findAvailablePort(3000);

  // Global Error Resiliency — prevent background DB/async errors from crashing the HTTP server
  process.on("unhandledRejection", (reason) => {
    console.error("[Non-fatal Unhandled Rejection]:", reason);
  });

  process.on("uncaughtException", (err) => {
    console.error("[Non-fatal Uncaught Exception]:", err);
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`[Server] Listening on 0.0.0.0:${port} (ENV.PORT=${process.env.PORT || "none"})`);
    try {
      startDailyRecipeCronJob();
    } catch (e) {
      console.error("[Background Cron Error]:", e);
    }
    try {
      startSocialPublisher();
    } catch (e) {
      console.error("[Background Social Publisher Error]:", e);
    }
    import("../affiliate/sync")
      .then(({ startAffiliateSyncCronJob }) => {
        try {
          startAffiliateSyncCronJob();
        } catch (e) {
          console.error("[Background Affiliate Sync Error]:", e);
        }
      })
      .catch((e) => console.error("[Affiliate Module Import Error]:", e));
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
