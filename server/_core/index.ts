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
  // Body parser — 1MB is enough for JSON APIs; file uploads go through storage
  app.use(express.json({ limit: "1mb" }));
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
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
