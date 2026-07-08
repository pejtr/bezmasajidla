import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
