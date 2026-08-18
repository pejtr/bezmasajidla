import { desc, eq, gte } from "drizzle-orm";
import { socialPosts, type InsertSocialPost, type SocialPost } from "../../drizzle/schema";
import { getDb } from "../db";
import { recipes, type Recipe } from "../../client/src/lib/data";

export type SocialPlatform = "facebook" | "instagram";

export type CopywritingStyle =
  | "hook_curiosity"
  | "quick_easy"
  | "comfort_classic"
  | "high_protein_fit"
  | "sweet_weekend";

export interface RecipeSocialCandidate {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  category: string;
  cuisine?: string;
  prepTime?: number | string;
  cookTime?: number | string;
  image?: string;
  tags?: string[];
  isVegan?: boolean;
}

export interface GeneratedSocialPost {
  platform: SocialPlatform;
  recipeSlug: string;
  recipeTitle: string;
  caption: string;
  imageUrl: string;
  linkUrl: string;
  style: CopywritingStyle;
  publishingSlot: string;
  scheduledFor: Date;
}

export const BASE_PUBLIC_URL = (
  process.env.PUBLIC_BASE_URL || "https://www.bezmasajidla.cz"
).replace(/\/+$/, "");

/**
 * Robust Europe/Prague Date Converter (handles CET UTC+1 in winter, CEST UTC+2 in summer and DST transitions)
 */
export function createPragueDateTime(
  yearOrDate: number | Date,
  monthOrHour?: number,
  dayOrMinute?: number,
  hour?: number,
  minute?: number,
): Date {
  let targetYear: number;
  let targetMonth: number;
  let targetDay: number;
  let targetHour: number;
  let targetMinute: number;

  if (yearOrDate instanceof Date) {
    const parts = getPragueDateParts(yearOrDate);
    targetYear = parts.year;
    targetMonth = parts.month;
    targetDay = parts.day;
    targetHour = monthOrHour ?? 12;
    targetMinute = dayOrMinute ?? 0;
  } else {
    targetYear = yearOrDate;
    targetMonth = monthOrHour ?? 1;
    targetDay = dayOrMinute ?? 1;
    targetHour = hour ?? 12;
    targetMinute = minute ?? 0;
  }

  let utcGuess = new Date(
    Date.UTC(targetYear, targetMonth - 1, targetDay, targetHour, targetMinute, 0, 0),
  );

  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  });

  for (let i = 0; i < 3; i++) {
    const parts = dtf.formatToParts(utcGuess);
    const getPart = (type: string) => Number(parts.find(p => p.type === type)?.value || 0);
    const pYear = getPart("year");
    const pMonth = getPart("month");
    const pDay = getPart("day");
    const pHour = getPart("hour");
    const pMinute = getPart("minute");

    const diffMinutes =
      (Date.UTC(targetYear, targetMonth - 1, targetDay, targetHour, targetMinute) -
        Date.UTC(pYear, pMonth - 1, pDay, pHour, pMinute)) /
      (60 * 1000);

    if (diffMinutes === 0) break;
    utcGuess = new Date(utcGuess.getTime() + diffMinutes * 60 * 1000);
  }

  return utcGuess;
}

/**
 * Extracts Prague local calendar parts from a Date object
 */
export function getPragueDateParts(d: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(d);
  const getPart = (type: string) => Number(parts.find(p => p.type === type)?.value || 0);
  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hour: getPart("hour"),
    minute: getPart("minute"),
  };
}

/**
 * Standardizes hashtags for Czech plant-based gastronomy
 */
export function formatHashtags(recipe: RecipeSocialCandidate): string {
  const baseTags = ["#bezmasajidla", "#vegetarianskerecepty", "#vegancz", "#dnesvarim"];

  const specificTags: string[] = [];

  if (
    recipe.category?.toLowerCase().includes("polévk") ||
    recipe.category?.toLowerCase().includes("polevk")
  ) {
    specificTags.push("#polevka", "#polevkajegrunt", "#teplejidlo");
  }
  if (
    recipe.category?.toLowerCase().includes("dezert") ||
    recipe.category?.toLowerCase().includes("sladk")
  ) {
    specificTags.push("#zdravepeceni", "#sladkebezvycitek", "#dezert");
  }
  if (
    recipe.category?.toLowerCase().includes("hlavní") ||
    recipe.category?.toLowerCase().includes("večeř")
  ) {
    specificTags.push("#rychlevecere", "#veceredomu", "#zdravavecere");
  }
  if (recipe.cuisine?.toLowerCase().includes("česk")) specificTags.push("#ceskakuchyne", "#tradicnerecepty");
  if (recipe.cuisine?.toLowerCase().includes("italsk")) specificTags.push("#italskakuchyne", "#pasta");
  if (recipe.cuisine?.toLowerCase().includes("indick") || recipe.cuisine?.toLowerCase().includes("kari")) {
    specificTags.push("#indickakuchyne", "#kari");
  }

  // Sanitize recipe tags
  if (Array.isArray(recipe.tags)) {
    recipe.tags.forEach(t => {
      const clean = t
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "");
      if (clean && clean.length > 2 && specificTags.length < 8) {
        specificTags.push(`#${clean.toLowerCase()}`);
      }
    });
  }

  const unique = Array.from(new Set([...baseTags, ...specificTags])).slice(0, 10);
  return unique.join(" ");
}

/**
 * Builds deterministic UTM-tagged canonical link for social tracking with optional socialPostId
 */
export function buildTrackedSocialUrl(
  slugOrOptions:
    | string
    | {
        recipeSlug: string;
        platform: SocialPlatform;
        copyStyle: CopywritingStyle;
        postId?: number;
      },
  platformArg?: SocialPlatform,
  styleArg?: CopywritingStyle,
  postIdArg?: number,
): string {
  let slug: string;
  let platform: SocialPlatform;
  let style: CopywritingStyle;
  let postId: number | undefined;

  if (typeof slugOrOptions === "object") {
    slug = slugOrOptions.recipeSlug;
    platform = slugOrOptions.platform;
    style = slugOrOptions.copyStyle;
    postId = slugOrOptions.postId;
  } else {
    slug = slugOrOptions;
    platform = platformArg || "facebook";
    style = styleArg || "hook_curiosity";
    postId = postIdArg;
  }

  const base = `${BASE_PUBLIC_URL}/recepty/${slug}?utm_source=${platform}&utm_medium=social_autopilot&utm_campaign=${style}`;
  return postId ? `${base}&utm_content=post_${postId}` : base;
}

/**
 * Selects an optimal copywriting style based on recipe category, cuisine, and day of week
 */
export function determineCopyStyle(recipe: RecipeSocialCandidate, targetDate: Date): CopywritingStyle {
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday...
  const category = (recipe.category || "").toLowerCase();
  const title = (recipe.title || "").toLowerCase();

  if (
    category.includes("dezert") ||
    category.includes("sladk") ||
    title.includes("koláč") ||
    title.includes("bábovk") ||
    title.includes("brownies")
  ) {
    return "sweet_weekend";
  }

  if (
    recipe.cuisine?.toLowerCase().includes("česk") ||
    title.includes("svíčkov") ||
    title.includes("guláš") ||
    title.includes("zelňačk") ||
    title.includes("knedl")
  ) {
    return "comfort_classic";
  }

  if (dayOfWeek === 1) {
    // Meatless Monday -> quick & easy weeknight start
    return "quick_easy";
  }

  if (
    title.includes("tofu") ||
    title.includes("tempeh") ||
    title.includes("cizrn") ||
    title.includes("čočk") ||
    title.includes("bowl")
  ) {
    return "high_protein_fit";
  }

  if (recipe.prepTime && Number(recipe.prepTime) <= 30) {
    return "quick_easy";
  }

  return "hook_curiosity";
}

/**
 * Generates engaging, platform-customized Czech copy with viral hooks
 */
export function generateSocialCaption(
  recipe: RecipeSocialCandidate,
  platform: SocialPlatform,
  style: CopywritingStyle,
  linkUrl: string,
): string {
  const hashtags = formatHashtags(recipe);
  const timeInfo = recipe.prepTime ? `⏱️ Příprava: ${recipe.prepTime} minut` : "";
  const categoryInfo = recipe.category ? `🥗 Kategorie: ${recipe.category}` : "";
  const cuisineInfo = recipe.cuisine ? `🌍 Kuchyně: ${recipe.cuisine}` : "";
  const details = [categoryInfo, cuisineInfo, timeInfo].filter(Boolean).join(" | ");

  let hook = "";
  let body = "";

  switch (style) {
    case "hook_curiosity":
      hook = `„Tohle že je bez masa?!“ 🤯 ${recipe.title}`;
      body = `${recipe.description || "Dokonalé spojení chutí a vůní, které si zamilují i ti největší milovníci masa."}\n\nKlíč k úspěchu je v poctivém základu, správném dochucení a kvalitních surovinách.`;
      break;

    case "quick_easy":
      hook = `⚡ Hledáte rychlou a skvělou večeři? Vyzkoušejte: ${recipe.title}`;
      body = `Když po celém dni nechcete trávit hodiny v kuchyni, tohle jídlo je jasná volba. Snadné suroviny, minimum nádobí a výsledek jako z bistra!\n\n${recipe.description || "Výživné, chutné a hotové během chvilky."}`;
      break;

    case "comfort_classic":
      hook = `🍲 Tradiční chuť, která zahřeje: ${recipe.title}`;
      body = `Poctivá klasika v lehké a moderní bezmasé verzi. Přesně ten typ jídla, ke kterému se budete rádi vracet.\n\n${recipe.description || "Plná, hluboká chuť bez kompromisů."}`;
      break;

    case "high_protein_fit":
      hook = `🌱 Nálož energie a bílkovin: ${recipe.title}`;
      body = `Skvělé plnohodnotné jídlo plné rostlinných živin a vlákniny, které vás spolehlivě zasytí a dodá energii na celé odpoledne.\n\n${recipe.description || "Zdravé, vyvážené a neuvěřitelně chutné."}`;
      break;

    case "sweet_weekend":
      hook = `🍰 Víkendové pečení bez výčitek: ${recipe.title}`;
      body = `Vláčné, voňavé a dokonale sladké. Ideální ke kávě, pro rodinnou návštěvu nebo jen tak pro radost.\n\n${recipe.description || "Lahodný dezert v rostlinné podobě."}`;
      break;
  }

  const cta =
    platform === "instagram"
      ? `👉 Celý recept s přesným fotopostupem najdete na webu:\n🔗 ${linkUrl}`
      : `👉 Celý recept krok za krokem najdete zde:\n🔗 ${linkUrl}`;

  return `${hook}\n\n${details ? `${details}\n\n` : ""}${body}\n\n${cta}\n\n${hashtags}`;
}

/**
 * Returns all 72+ curated recipes formatted as social candidates
 */
export function getAllCuratedCandidates(): RecipeSocialCandidate[] {
  return recipes.map((r: Recipe) => {
    let imageUrl = r.image;
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `${BASE_PUBLIC_URL}${imageUrl}`;
    }
    return {
      id: r.id || r.slug,
      slug: r.slug,
      title: r.title,
      description: r.description,
      category: r.category,
      cuisine: r.cuisine,
      prepTime: r.prepTime + (r.cookTime || 0),
      cookTime: r.cookTime,
      image: imageUrl,
      tags: r.tags,
      isVegan: r.isVegan,
    };
  });
}

export interface ScheduleSlot {
  date: Date;
  slotLabel: "11:30" | "17:30";
}

/**
 * Returns optimal posting schedule slots (11:30 and 17:30 Europe/Prague time) for next N days
 */
export function generateScheduleSlots(daysAhead = 14, startDate = new Date()): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  const basePrague = getPragueDateParts(startDate);

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
    // Reference date for Prague day
    const dayRef = new Date(Date.UTC(basePrague.year, basePrague.month - 1, basePrague.day + dayOffset, 12, 0, 0));
    const parts = getPragueDateParts(dayRef);

    // Slot 1: 11:30 Prague
    const slotLunch = createPragueDateTime(parts.year, parts.month, parts.day, 11, 30);
    if (slotLunch > startDate) {
      slots.push({ date: slotLunch, slotLabel: "11:30" });
    }

    // Slot 2: 17:30 Prague
    const slotDinner = createPragueDateTime(parts.year, parts.month, parts.day, 17, 30);
    if (slotDinner > startDate) {
      slots.push({ date: slotDinner, slotLabel: "17:30" });
    }
  }

  return slots.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Autonomous Queue Maintenance:
 * Ensures there are always scheduled posts for both Facebook and Instagram for the next N days.
 * Prevents recipe duplicates within 30 days.
 * Stamps each post with its distinct socialPublicationId and Europe/Prague slot.
 */
export async function ensureAutonomousQueue(daysAhead = 14): Promise<{
  scheduledCount: number;
  existingCount: number;
  totalCandidates: number;
}> {
  const db = await getDb();
  const allCandidates = getAllCuratedCandidates();
  if (!db || allCandidates.length === 0) {
    return { scheduledCount: 0, existingCount: 0, totalCandidates: allCandidates.length };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 1. Fetch recently published & currently scheduled posts
  const recentPosts = await db
    .select({
      id: socialPosts.id,
      recipeSlug: socialPosts.recipeSlug,
      scheduledFor: socialPosts.scheduledFor,
      platform: socialPosts.platform,
      status: socialPosts.status,
    })
    .from(socialPosts)
    .where(gte(socialPosts.scheduledFor, thirtyDaysAgo));

  const scheduledTimeStamps = new Set(
    recentPosts
      .filter(p => p.status === "scheduled" && p.scheduledFor >= now)
      .map(p => `${p.scheduledFor.toISOString().slice(0, 13)}_${p.platform}`),
  );

  const recentlyUsedSlugs = new Set(
    recentPosts.map(p => p.recipeSlug).filter(Boolean),
  );

  // 2. Determine target slots for the next `daysAhead` days
  const targetSlots = generateScheduleSlots(daysAhead, now);
  const platforms: SocialPlatform[] = ["facebook", "instagram"];
  let newlyScheduledCount = 0;

  let candidateIndex = 0;
  let availableCandidates = allCandidates.filter(c => !recentlyUsedSlugs.has(c.slug));
  if (availableCandidates.length < targetSlots.length) {
    availableCandidates = [...allCandidates];
  }

  for (const slot of targetSlots) {
    for (const platform of platforms) {
      const slotKey = `${slot.date.toISOString().slice(0, 13)}_${platform}`;
      if (scheduledTimeStamps.has(slotKey)) {
        continue; // Already scheduled
      }

      const recipe = availableCandidates[candidateIndex % availableCandidates.length];
      candidateIndex++;

      const style = determineCopyStyle(recipe, slot.date);
      const initialLinkUrl = buildTrackedSocialUrl(recipe.slug, platform, style);
      const initialCaption = generateSocialCaption(recipe, platform, style, initialLinkUrl);

      // Insert initial record to obtain distinct publication ID
      const insertResult = await db.insert(socialPosts).values({
        recipeSlug: recipe.slug,
        platform,
        status: "scheduled",
        copyStyle: style,
        publishingSlot: slot.slotLabel,
        caption: initialCaption,
        imageUrl: recipe.image || `${BASE_PUBLIC_URL}/images/og-default.jpg`,
        linkUrl: initialLinkUrl,
        scheduledFor: slot.date,
      });

      const rawInsert: unknown = insertResult;
      const header = Array.isArray(rawInsert) ? rawInsert[0] : rawInsert;
      const insertedId = (header as { insertId?: number })?.insertId;

      if (insertedId) {
        // Stamp authoritative post_<id> into the linkUrl and caption
        const finalLinkUrl = buildTrackedSocialUrl(recipe.slug, platform, style, insertedId);
        const finalCaption = generateSocialCaption(recipe, platform, style, finalLinkUrl);

        await db
          .update(socialPosts)
          .set({
            linkUrl: finalLinkUrl,
            caption: finalCaption,
          })
          .where(eq(socialPosts.id, insertedId));
      }

      scheduledTimeStamps.add(slotKey);
      newlyScheduledCount++;
    }
  }

  if (newlyScheduledCount > 0) {
    console.log(
      `[Autonomous Social Engine] Scheduled ${newlyScheduledCount} new posts across ${daysAhead} days (Europe/Prague slots).`,
    );
  }

  const totalScheduled =
    recentPosts.filter(p => p.status === "scheduled" && p.scheduledFor >= now).length +
    newlyScheduledCount;

  return {
    scheduledCount: newlyScheduledCount,
    existingCount: totalScheduled,
    totalCandidates: allCandidates.length,
  };
}

/**
 * Exports next scheduled social posts as CSV for Meta Business Suite / Buffer bulk upload
 */
export async function exportSocialCalendarCsv(limit = 60): Promise<string> {
  const db = await getDb();
  if (!db) return "Date,Time,Platform,Recipe,Slot,Style,Caption,Link,Image\n";

  const posts = await db
    .select()
    .from(socialPosts)
    .orderBy(desc(socialPosts.scheduledFor))
    .limit(limit);

  const headers = [
    "Date",
    "Time",
    "Platform",
    "Recipe Slug",
    "Publishing Slot",
    "Copy Style",
    "Caption",
    "Link URL",
    "Image URL",
    "Status",
  ];
  const rows = posts.map(p => {
    const d = new Date(p.scheduledFor);
    const dateStr = d.toISOString().split("T")[0];
    const timeStr = d.toTimeString().split(" ")[0].slice(0, 5);
    const safeCaption = `"${(p.caption || "").replace(/"/g, '""')}"`;
    return [
      dateStr,
      timeStr,
      p.platform,
      p.recipeSlug || "",
      p.publishingSlot || "",
      p.copyStyle || "",
      safeCaption,
      p.linkUrl,
      p.imageUrl || "",
      p.status,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
