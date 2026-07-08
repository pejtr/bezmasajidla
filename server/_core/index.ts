import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { startDailyRecipeCronJob } from "./ai-recipe";

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

  // Enforce www for production and handle SEO slug redirects
  app.use((req, res, next) => {
    let targetHost = req.headers.host;
    let targetUrl = req.originalUrl || req.url;
    let shouldRedirect = false;

    if (targetHost === 'bezmasajidla.cz') {
      targetHost = 'www.bezmasajidla.cz';
      shouldRedirect = true;
    }

    // SEO Redirects for old slugs
    if (targetUrl.startsWith('/recepty/veganska-svickova')) {
      targetUrl = targetUrl.replace('/recepty/veganska-svickova', '/recepty/svickova-bez-masa');
      shouldRedirect = true;
    }
    if (targetUrl.startsWith('/recepty/vegansky-gulas-knedliky')) {
      targetUrl = targetUrl.replace('/recepty/vegansky-gulas-knedliky', '/recepty/gulas-bez-masa');
      shouldRedirect = true;
    }

    if (shouldRedirect) {
      const proto = targetHost === 'localhost' || targetHost?.includes(':') ? 'http' : 'https';
      const redirectHost = targetHost === 'localhost' || targetHost?.includes(':') ? '' : `${proto}://${targetHost}`;
      return res.redirect(301, `${redirectHost}${targetUrl}`);
    }
    next();
  });

  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
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

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    // Initialize the daily AI recipe service
    startDailyRecipeCronJob();
  });
}

startServer().catch(console.error);
