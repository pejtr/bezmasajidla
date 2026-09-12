import { describe, expect, it } from "vitest";
import {
  buildSocialCaption,
  getSocialPublisherStatus,
} from "./_core/social-media";

describe("social content producer", () => {
  it("builds a Czech caption with recipe tags and link", () => {
    const caption = buildSocialCaption(
      {
        title: "Brokolicová polévka s hráškem",
        description: "Zářivě zelená krémová polévka.",
        tags: JSON.stringify(["Brokolice", "Do 30 min"]),
      },
      "facebook",
      "https://www.bezmasajidla.cz/recepty/brokolicova-polevka"
    );

    expect(caption).toContain("Brokolicová polévka s hráškem");
    expect(caption).toContain("#Brokolice");
    expect(caption).toContain("#Do30min");
    expect(caption).toContain("https://www.bezmasajidla.cz/recepty/");
  });

  it("reports OMNIFORGE as the only execution owner", () => {
    const status = getSocialPublisherStatus();
    expect(status.executionOwner).toBe("omniforge");
    expect(status.localPublisherEnabled).toBe(false);
  });
});
