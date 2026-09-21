const BASE = "https://www.bezmasajidla.cz";

const UNVERIFIED_RECIPE_PATHS = new Set([
  "/recepty/svickova-bez-masa",
  "/recepty/cocková-polevka-uzena-paprika",
  "/recepty/buddha-bowl-pecena-zelenina",
  "/recepty/gulas-bez-masa",
  "/recepty/spenatove-palacinkys-tofu-ricottou",
  "/recepty/houbove-rizoto-kešu-parmezan",
  "/recepty/veganske-palacinky",
  "/recepty/vegetariansky-bramborovy-salat",
  "/recepty/veganske-brownies",
  "/recepty/houbove-rizoto",
  "/recepty/veganska-babovka",
  "/recepty/vegansky-pad-thai",
  "/recepty/domaci-vegetarianska-pizza",
  "/recepty/vegansky-cheesecake",
  "/recepty/tortilla-grilovana-zelenina",
  "/recepty/vegansky-bananovy-chleb",
  "/recepty/smoothie-bowl",
  "/recepty/spenatova-polevka",
  "/recepty/kvetakova-polevka",
  "/recepty/cizrnove-curry",
  "/recepty/tofu-stir-fry",
  "/recepty/mexicke-fazole-ryze",
  "/recepty/spenatove-testoviny",
  "/recepty/hraskova-polevka",
  "/recepty/slany-strudl-modry-syr",
  "/recepty/strudl-se-zelim",
  "/recepty/strudl-spenat-ricotta",
  "/recepty/adzarsky-khachapuri",
  "/recepty/lobiani-gruzinsky-chleb",
  "/recepty/pchali-gruzinske-kulicky",
  "/recepty/houbove-risotto",
  "/recepty/spaghetti-al-pomodoro",
  "/recepty/veganske-tiramisu",
  "/recepty/veganska-pizza-margherita",
  "/recepty/vegetariansky-gulas-paprika",
  "/recepty/langos-cesnekovym-kremem",
  "/recepty/madarske-palacsinky",
  "/recepty/bryndzove-halusky",
  "/recepty/kapustnica-slovenska",
  "/recepty/florentinska-pizza",
  "/recepty/tradincni-veganska-svickova-na-smetane",
  "/recepty/kremovy-cockovy-dal-s-kokosovym-mlekem",
  "/recepty/krupave-tofu-s-arasidovou-omackou",
  "/recepty/domaci-kremovy-hummus-s-pecenou-cizrnou",
  "/recepty/pecena-kvetakova-kridla-v-buffalo-omacce",
  "/recepty/uzen-tempeh-s-testovinami-a-spenatem"
]);

const EXTRA_VALID_PATHS = new Set([
  "/",
  "/o-nas",
  "/inzerce",
  "/inzerce/pridat-podnik",
  "/podminky",
  "/ochrana-soukromi",
  "/kontakt",
  "/profil",
  "/admin",
  "/pridat-recept",
  "/platba/uspech",
  "/platba/zruseno",
  "/404"
]);

const PRIVATE_NOINDEX = new Set([
  "/profil",
  "/admin",
  "/pridat-recept",
  "/platba/uspech",
  "/platba/zruseno",
  "/404"
]);

const PASS_PREFIXES = [
  "/api/",
  "/assets/",
  "/images/",
  "/ebooks/",
  "/fonts/",
  "/cdn-cgi/",
  "/.well-known/"
];

let cachedSitemap = null;
let cachedPaths = null;
let cacheAt = 0;
const CACHE_MS = 10 * 60 * 1000;

function normalizedPath(pathname) {
  let value = pathname;
  try { value = decodeURIComponent(pathname); } catch {}
  if (value.length > 1) value = value.replace(/\/+$/, "");
  return value || "/";
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function robotsResponse() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    "Sitemap: https://www.bezmasajidla.cz/sitemap.xml",
    ""
  ].join("\n");
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-robots-tag": "noindex"
    }
  });
}

async function loadOriginSitemap(request) {
  const now = Date.now();
  if (cachedSitemap && cachedPaths && now - cacheAt < CACHE_MS) {
    return { xml: cachedSitemap, paths: cachedPaths };
  }

  const target = new URL(request.url);
  target.hostname = "www.bezmasajidla.cz";
  target.pathname = "/sitemap.xml";
  target.search = "";

  const origin = await fetch(new Request(target.toString(), request), {
    cf: { cacheTtl: 300, cacheEverything: true }
  });
  if (!origin.ok) {
    throw new Error("Origin sitemap fetch failed: " + origin.status);
  }

  const source = await origin.text();
  const allUrls = [];
  const paths = new Set();

  for (const match of source.matchAll(/<url>\s*([\s\S]*?)<\/url>/g)) {
    const block = match[1];
    const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/);
    if (!locMatch) continue;
    const rawLoc = locMatch[1].trim()
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    let parsed;
    try { parsed = new URL(rawLoc); } catch { continue; }

    parsed.protocol = "https:";
    parsed.hostname = "www.bezmasajidla.cz";
    parsed.port = "";

    const path = normalizedPath(parsed.pathname);
    paths.add(path);

    if (UNVERIFIED_RECIPE_PATHS.has(path)) continue;

    const normalizedLoc = parsed.toString();
    const rewritten = block.replace(
      /<loc>[\s\S]*?<\/loc>/,
      "<loc>" + xmlEscape(normalizedLoc) + "</loc>"
    );
    allUrls.push("<url>" + rewritten + "</url>");
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls,
    "</urlset>",
    ""
  ].join("\n");

  cachedSitemap = xml;
  cachedPaths = paths;
  cacheAt = now;
  return { xml, paths };
}

async function sitemapResponse(request) {
  try {
    const { xml } = await loadOriginSitemap(request);
    return new Response(xml, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=300",
        "x-robots-tag": "noindex"
      }
    });
  } catch {
    return fetch(request);
  }
}

function isStaticAsset(path) {
  if (PASS_PREFIXES.some(prefix => path.startsWith(prefix))) return true;
  return /\.[a-z0-9]{1,8}$/i.test(path);
}

function wantsHtml(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html") || accept.includes("application/xhtml+xml");
}

function notFoundResponse() {
  const html = `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<title>Stránka nenalezena | Bezmasá Jídla</title>
</head>
<body><main><h1>Stránka nenalezena</h1><p>Požadovaná stránka neexistuje.</p></main></body>
</html>`;
  return new Response(html, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-robots-tag": "noindex, nofollow"
    }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname === "bezmasajidla.cz") {
      const target = new URL(request.url);
      target.protocol = "https:";
      target.hostname = "www.bezmasajidla.cz";
      target.port = "";
      return Response.redirect(target.toString(), 301);
    }

    const path = normalizedPath(url.pathname);

    if (path === "/robots.txt") return robotsResponse();
    if (
      path === "/sitemap.xml" ||
      path === "/sitemap_index.xml" ||
      path === "/sitemap-index.xml" ||
      path === "/wp-sitemap.xml"
    ) {
      return sitemapResponse(request);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return fetch(request);
    }

    if (isStaticAsset(path)) return fetch(request);

    if (!wantsHtml(request)) return fetch(request);

    // One canonical URL shape: no trailing slash except root.
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      const target = new URL(request.url);
      target.pathname = target.pathname.replace(/\/+$/, "");
      return Response.redirect(target.toString(), 301);
    }

    let paths;
    try {
      ({ paths } = await loadOriginSitemap(request));
    } catch {
      return fetch(request);
    }

    const isValid = paths.has(path) || EXTRA_VALID_PATHS.has(path);
    if (!isValid) {
      return notFoundResponse();
    }

    const origin = await fetch(request);
    const headers = new Headers(origin.headers);

    if (UNVERIFIED_RECIPE_PATHS.has(path) || PRIVATE_NOINDEX.has(path)) {
      headers.set("x-robots-tag", "noindex, follow");
    }

    return new Response(origin.body, {
      status: origin.status,
      statusText: origin.statusText,
      headers
    });
  }
};
