import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("premium profile routing", () => {
  it("keeps the legacy /premium route wired to the B2B listing page", () => {
    const app = readFileSync("client/src/App.tsx", "utf8");
    expect(app).toContain('<Route path="/premium" component={B2BListingPage} />');
  });

  it("uses the canonical B2B listing URL in the footer", () => {
    const footer = readFileSync("client/src/components/Footer.tsx", "utf8");
    expect(footer).toContain('href="/inzerce/pridat-podnik"');
    expect(footer).not.toContain('href="/premium"');
  });
});
