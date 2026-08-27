// ============================================================
// BEZMASAJIDLA.CZ — Live Production Sitemap Diagnostic Gate Runner
// Fetches live https://www.bezmasajidla.cz/sitemap.xml and performs E2E HTTP validation.
// ============================================================

const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

export interface SitemapGateReport {
  timestamp: string;
  wwwSitemap: {
    requestedUrl: string;
    httpStatus: number;
    contentType: string;
    responseSizeBytes: number;
    isValidXml: boolean;
    googlebotHttpStatus: number;
  };
  nonWwwSitemap: {
    requestedUrl: string;
    httpStatus: number;
    redirectUrl?: string;
  };
  robotsTxt: {
    requestedUrl: string;
    httpStatus: number;
    containsSitemapDirective: boolean;
    sitemapDirectiveUrl?: string;
  };
  sitemapAudit: {
    totalUrls: number;
    urls200: number;
    urlsRedirects: number;
    urls404: number;
    urls5xx: number;
    urlsNoindex: number;
    urlsNonCanonicalHost: number;
    urlsDuplicates: number;
    invalidUrls: string[];
  };
  legacyWordPressRedirects: {
    testedPath: string;
    httpStatus: number;
    contentType: string;
  }[];
  gatePassed: boolean;
}

export async function runLiveSitemapProductionGate(): Promise<SitemapGateReport> {
  const timestamp = new Date().toISOString();

  const report: SitemapGateReport = {
    timestamp,
    wwwSitemap: {
      requestedUrl: "https://www.bezmasajidla.cz/sitemap.xml",
      httpStatus: 0,
      contentType: "",
      responseSizeBytes: 0,
      isValidXml: false,
      googlebotHttpStatus: 0,
    },
    nonWwwSitemap: {
      requestedUrl: "https://bezmasajidla.cz/sitemap.xml",
      httpStatus: 0,
    },
    robotsTxt: {
      requestedUrl: "https://www.bezmasajidla.cz/robots.txt",
      httpStatus: 0,
      containsSitemapDirective: false,
    },
    sitemapAudit: {
      totalUrls: 0,
      urls200: 0,
      urlsRedirects: 0,
      urls404: 0,
      urls5xx: 0,
      urlsNoindex: 0,
      urlsNonCanonicalHost: 0,
      urlsDuplicates: 0,
      invalidUrls: [],
    },
    legacyWordPressRedirects: [],
    gatePassed: false,
  };

  try {
    // 1. Fetch https://www.bezmasajidla.cz/sitemap.xml (Standard UA)
    const wwwRes = await fetch("https://www.bezmasajidla.cz/sitemap.xml", {
      headers: { "User-Agent": "AntigravitySitemapGate/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    report.wwwSitemap.httpStatus = wwwRes.status;
    report.wwwSitemap.contentType = wwwRes.headers.get("content-type") || "";
    const wwwText = await wwwRes.text();
    report.wwwSitemap.responseSizeBytes = Buffer.byteLength(wwwText);

    // Fetch with Googlebot UA
    const gbotRes = await fetch("https://www.bezmasajidla.cz/sitemap.xml", {
      headers: { "User-Agent": GOOGLEBOT_UA },
      signal: AbortSignal.timeout(10000),
    });
    report.wwwSitemap.googlebotHttpStatus = gbotRes.status;

    // XML Regex Parse
    try {
      const matches = Array.from(wwwText.matchAll(/<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi));
      if (wwwText.includes("<urlset") && matches.length > 0) {
        report.wwwSitemap.isValidXml = true;

        const locSet = new Set<string>();
        const locs: string[] = matches.map(m => m[1].trim());

        report.sitemapAudit.totalUrls = locs.length;

        for (const loc of locs) {
          if (locSet.has(loc)) {
            report.sitemapAudit.urlsDuplicates += 1;
            report.sitemapAudit.invalidUrls.push(`DUPLICATE: ${loc}`);
          }
          locSet.add(loc);

          if (!loc.startsWith("https://www.bezmasajidla.cz/")) {
            report.sitemapAudit.urlsNonCanonicalHost += 1;
            report.sitemapAudit.invalidUrls.push(`NON_CANONICAL_HOST: ${loc}`);
          }
        }
      }
    } catch {
      report.wwwSitemap.isValidXml = false;
    }

    // 2. Fetch https://bezmasajidla.cz/sitemap.xml
    try {
      const nonWwwRes = await fetch("https://bezmasajidla.cz/sitemap.xml", {
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
      });
      report.nonWwwSitemap.httpStatus = nonWwwRes.status;
      report.nonWwwSitemap.redirectUrl = nonWwwRes.headers.get("location") || undefined;
    } catch (err: any) {
      report.nonWwwSitemap.httpStatus = 0;
    }

    // 3. Fetch robots.txt
    try {
      const robotsRes = await fetch("https://www.bezmasajidla.cz/robots.txt", {
        signal: AbortSignal.timeout(5000),
      });
      report.robotsTxt.httpStatus = robotsRes.status;
      const robotsTxt = await robotsRes.text();
      const sitemapMatch = robotsTxt.match(/^Sitemap:\s*(https?:\/\/[^\s]+)/im);
      if (sitemapMatch) {
        report.robotsTxt.containsSitemapDirective = true;
        report.robotsTxt.sitemapDirectiveUrl = sitemapMatch[1];
      }
    } catch {
      report.robotsTxt.httpStatus = 0;
    }

    // 4. Test Legacy WordPress sitemap paths
    const legacyPaths = [
      "/page-sitemap.xml",
      "/recipe-tag-sitemap.xml",
      "/recipe-cuisine-sitemap.xml",
      "/recipe-diet-sitemap.xml",
      "/sitemap-taxonomy-post_tag.xml",
    ];

    for (const p of legacyPaths) {
      try {
        const legRes = await fetch(`https://www.bezmasajidla.cz${p}`, {
          signal: AbortSignal.timeout(5000),
        });
        report.legacyWordPressRedirects.push({
          testedPath: p,
          httpStatus: legRes.status,
          contentType: legRes.headers.get("content-type") || "",
        });
      } catch {
        report.legacyWordPressRedirects.push({
          testedPath: p,
          httpStatus: 0,
          contentType: "error",
        });
      }
    }

    // Pass criteria
    report.gatePassed =
      report.wwwSitemap.httpStatus === 200 &&
      report.wwwSitemap.googlebotHttpStatus === 200 &&
      report.wwwSitemap.isValidXml &&
      report.robotsTxt.containsSitemapDirective &&
      report.sitemapAudit.urlsNonCanonicalHost === 0 &&
      report.sitemapAudit.urlsDuplicates === 0;

  } catch (err) {
    console.error("[Sitemap Gate Live Diagnostic Error]", err);
  }

  return report;
}
