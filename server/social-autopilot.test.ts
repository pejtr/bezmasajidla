import { describe, expect, it } from "vitest";
import {
  buildTrackedSocialUrl,
  determineCopyStyle,
  formatHashtags,
  generateScheduleSlots,
  generateSocialCaption,
  getAllCuratedCandidates,
  type RecipeSocialCandidate,
} from "./_core/social-autopilot";

const sampleRecipe: RecipeSocialCandidate = {
  id: "svickova-bez-masa",
  slug: "svickova-bez-masa",
  title: "Svíčková na smetaně bez masa",
  description: "Tradiční česká svíčková s kořenovou zeleninou a tempehem.",
  category: "Hlavní jídla",
  cuisine: "Česká bezmasá",
  prepTime: 45,
  cookTime: 30,
  image: "https://www.bezmasajidla.cz/images/recipes/svickova.webp",
  tags: ["Svíčková", "Česká klasika", "Tradiční", "Nedělní oběd"],
  isVegan: false,
};

const sampleBrownies: RecipeSocialCandidate = {
  id: "veganske-brownies",
  slug: "veganske-brownies",
  title: "Vláčné veganské brownies z černé fazole",
  description: "Čokoládové brownies s čokoládovými peckami a ořechy.",
  category: "Dezerty a sladké",
  cuisine: "Mezinárodní",
  prepTime: 25,
  image: "https://www.bezmasajidla.cz/images/recipes/brownies.webp",
  tags: ["Brownies", "Čokoláda", "Bez lepku", "Dezert"],
  isVegan: true,
};

describe("Social Auto-Pilot — Catalog & Copywriting Engine", () => {
  it("loads all curated recipes as candidates", () => {
    const candidates = getAllCuratedCandidates();
    expect(candidates.length).toBeGreaterThanOrEqual(70);
    const svickova = candidates.find(c => c.slug === "svickova-bez-masa");
    expect(svickova).toBeDefined();
    expect(svickova?.title).toContain("Svíčková");
  });

  it("formats Czech hashtags cleanly without special characters or illegal symbols", () => {
    const tags = formatHashtags(sampleRecipe);
    expect(tags).toContain("#bezmasajidla");
    expect(tags).toContain("#vegetarianskerecepty");
    expect(tags).toContain("#ceskakuchyne");
    expect(tags).toContain("#svickova");
    expect(tags).not.toContain("í"); // normalized without diacritics in tag
  });

  it("builds valid UTM tracked social links", () => {
    const url = buildTrackedSocialUrl("svickova-bez-masa", "instagram", "comfort_classic");
    expect(url).toContain("https://www.bezmasajidla.cz/recepty/svickova-bez-masa");
    expect(url).toContain("utm_source=instagram");
    expect(url).toContain("utm_medium=social_autopilot");
    expect(url).toContain("utm_campaign=comfort_classic");
  });

  it("determines appropriate copywriting styles for different dishes", () => {
    const monday = new Date("2026-08-17T12:00:00Z"); // Monday
    const sunday = new Date("2026-08-23T12:00:00Z"); // Sunday

    const dessertStyle = determineCopyStyle(sampleBrownies, monday);
    expect(dessertStyle).toBe("sweet_weekend");

    const classicStyle = determineCopyStyle(sampleRecipe, sunday);
    expect(classicStyle).toBe("comfort_classic");
  });

  it("generates platform-specific copy for Instagram and Facebook with emojis, CTA and hashtags", () => {
    const igCaption = generateSocialCaption(
      sampleRecipe,
      "instagram",
      "comfort_classic",
      "https://www.bezmasajidla.cz/recepty/svickova-bez-masa?utm_source=instagram",
    );

    expect(igCaption).toContain("Svíčková na smetaně bez masa");
    expect(igCaption).toContain("Tradiční chuť");
    expect(igCaption).toContain("👉 Celý recept");
    expect(igCaption).toContain("#bezmasajidla");
    expect(igCaption).toContain("https://www.bezmasajidla.cz/recepty/svickova-bez-masa");

    const fbCaption = generateSocialCaption(
      sampleBrownies,
      "facebook",
      "sweet_weekend",
      "https://www.bezmasajidla.cz/recepty/veganske-brownies?utm_source=facebook",
    );

    expect(fbCaption).toContain("Víkendové pečení");
    expect(fbCaption).toContain("Vláčné veganské brownies");
    expect(fbCaption).toContain("#zdravepeceni");
  });

  it("generates 2 daily slots (11:30 and 17:30) for scheduled horizon", () => {
    const start = new Date("2026-08-16T08:00:00Z");
    const slots = generateScheduleSlots(3, start);
    expect(slots.length).toBe(6); // 2 slots * 3 days

    // Verify time of day
    expect(slots[0].getHours()).toBe(11);
    expect(slots[0].getMinutes()).toBe(30);
    expect(slots[1].getHours()).toBe(17);
    expect(slots[1].getMinutes()).toBe(30);
  });
});
