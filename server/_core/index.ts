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

  // Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { generateSitemap } = await import("./sitemap");
      const xml = await generateSitemap();
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating sitemap:", err);
      res.status(500).end();
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
    try {
      const { verifyOmniForgeWebhookSignature, checkAndDeduplicateWebhookEvent } = await import(
        "./omniforge-webhook"
      );
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

      // 2. Durable Idempotency Check: 2 deliveries -> 1 state transition
      if (eventId) {
        const { isDuplicate } = await checkAndDeduplicateWebhookEvent(
          eventId,
          publicationId,
          event,
          rawBody,
        );
        if (isDuplicate) {
          return res
            .status(200)
            .json({ received: true, deduplicated: true, message: "Duplicate event ignored" });
        }
      }

      if (!internalPostId && !publicationId) {
        return res.status(400).json({ error: "Missing internalPostId / publicationId in payload metadata" });
      }

      const { getDb } = await import("../db");
      const { socialPosts } = await import("../../drizzle/schema");
      const { eq, or } = await import("drizzle-orm");
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

      return res.status(200).json({ received: true, event, internalPostId, publicationId });
    } catch (err) {
      console.error("[OMNIFORGE Webhook Error]", err);
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

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port} (preferred: ${preferredPort})`);
    startDailyRecipeCronJob();
    startSocialPublisher();
    import("../affiliate/sync").then(({ startAffiliateSyncCronJob }) => {
      startAffiliateSyncCronJob();
    });
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
