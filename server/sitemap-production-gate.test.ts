// ============================================================
// BEZMASAJIDLA.CZ — Live Production Sitemap Diagnostic Gate Test Runner
// Runs E2E live HTTP diagnostic against https://www.bezmasajidla.cz/sitemap.xml
// ============================================================

import { describe, it, expect } from "vitest";
import { runLiveSitemapProductionGate } from "./_core/sitemap-gate";

describe("SEO Sitemap Production Gate — Live HTTP Verification & Local XML Audit", () => {
  it("should audit local generateSitemap() XML output", async () => {
    const { generateSitemap } = await import("./_core/sitemap");
    const xml = await generateSitemap();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<urlset");
    expect(xml).toContain("https://www.bezmasajidla.cz/");

    const locMatches = Array.from(xml.matchAll(/<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi));
    const locs = locMatches.map(m => m[1].trim());

    expect(locs.length).toBeGreaterThan(100);

    const nonCanonicalHosts = locs.filter(loc => !loc.startsWith("https://www.bezmasajidla.cz/"));
    expect(nonCanonicalHosts.length).toBe(0);

    const duplicates = locs.filter((item, index) => locs.indexOf(item) !== index);
    expect(duplicates.length).toBe(0);

    console.log(`[LOCAL SITEMAP AUDIT] Total URLs: ${locs.length}, Non-canonical: ${nonCanonicalHosts.length}, Duplicates: ${duplicates.length}`);
  });

  it("should run live HTTP diagnostic against production sitemaps and output report", async () => {
    const report = await runLiveSitemapProductionGate();

    console.log("[LIVE SITEMAP GATE REPORT]", JSON.stringify(report, null, 2));

    expect(typeof report.timestamp).toBe("string");
    expect(report.wwwSitemap.httpStatus).toBeGreaterThan(0);
  });
});
