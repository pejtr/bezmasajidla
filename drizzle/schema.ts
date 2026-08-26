import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, uniqueIndex, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Restaurant reviews — users can rate and comment on restaurants.
 * restaurantSlug links to the static data slug (not a FK to a DB table).
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  restaurantSlug: varchar("restaurantSlug", { length: 128 }).notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("reviews_userId_idx").on(table.userId),
  restaurantSlugIdx: index("reviews_restaurantSlug_idx").on(table.restaurantSlug),
}));

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * User favorites — restaurants and recipes.
 * itemType: "restaurant" | "recipe"
 * itemSlug: the slug of the restaurant or recipe from static data, or the id of a user recipe.
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemType: mysqlEnum("itemType", ["restaurant", "recipe"]).notNull(),
  itemSlug: varchar("itemSlug", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("favorites_userId_idx").on(table.userId),
  itemSlugIdx: index("favorites_itemSlug_idx").on(table.itemSlug),
  uniqueUserItem: uniqueIndex("favorites_userId_itemType_itemSlug_uidx").on(table.userId, table.itemType, table.itemSlug),
}));

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * User-submitted recipes.
 */
export const userRecipes = mysqlTable("userRecipes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  category: varchar("category", { length: 64 }),
  difficulty: varchar("difficulty", { length: 32 }),
  prepTime: varchar("prepTime", { length: 32 }),
  servings: int("servings"),
  image: text("image"),
  ingredients: text("ingredients"), // JSON string array
  steps: text("steps"), // JSON string array
  tags: text("tags"), // JSON string array
  isApproved: boolean("isApproved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserRecipe = typeof userRecipes.$inferSelect;
export type InsertUserRecipe = typeof userRecipes.$inferInsert;

/**
 * Durable publishing queue for Meta social networks.
 * One recipe can have one independently retryable job per platform.
 */
export const socialPosts = mysqlTable(
  "socialPosts",
  {
    id: int("id").autoincrement().primaryKey(),
    recipeId: int("recipeId"),
    recipeSlug: varchar("recipeSlug", { length: 128 }),
    postType: varchar("postType", { length: 32 }).default("recipe").notNull(),
    platform: mysqlEnum("platform", ["facebook", "instagram"]).notNull(),
    status: mysqlEnum("status", [
      "scheduled",
      "publishing",
      "published",
      "failed",
      "uncertain",
    ])
      .default("scheduled")
      .notNull(),
    caption: text("caption").notNull(),
    imageUrl: text("imageUrl"),
    linkUrl: text("linkUrl").notNull(),
    copyStyle: varchar("copyStyle", { length: 32 }),
    publishingSlot: varchar("publishingSlot", { length: 16 }),
    scheduledFor: timestamp("scheduledFor").notNull(),
    publishedAt: timestamp("publishedAt"),
    publishStartedAt: timestamp("publishStartedAt"),
    publishAttemptId: varchar("publishAttemptId", { length: 64 }),
    publicationId: varchar("publicationId", { length: 128 }).unique(),
    externalPostId: varchar("externalPostId", { length: 255 }),
    attempts: int("attempts").default(0).notNull(),
    lastError: text("lastError"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    recipePlatformScheduledIdx: index(
      "socialPosts_recipeSlug_platform_idx",
    ).on(table.recipeSlug, table.platform),
    duePostsIdx: index("socialPosts_status_scheduledFor_idx").on(
      table.status,
      table.scheduledFor,
    ),
    publicationIdIdx: index("socialPosts_publicationId_idx").on(
      table.publicationId,
    ),
  }),
);

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;

/**
 * Durable idempotency & audit log of received OMNIFORGE webhook events
 * Tracks processingStatus ("received" -> "processed" | "failed") for zero event loss on retries.
 */
export const omniforgeWebhookEvents = mysqlTable(
  "omniforgeWebhookEvents",
  {
    eventId: varchar("eventId", { length: 128 }).primaryKey(),
    publicationId: varchar("publicationId", { length: 128 }),
    eventType: varchar("eventType", { length: 64 }).notNull(),
    payloadHash: varchar("payloadHash", { length: 64 }),
    processingStatus: mysqlEnum("processingStatus", ["received", "processed", "failed"]).default("received").notNull(),
    lastError: text("lastError"),
    receivedAt: timestamp("receivedAt").defaultNow().notNull(),
    processedAt: timestamp("processedAt"),
  },
  table => ({
    publicationIdIdx: index("omniforgeWebhookEvents_publicationId_idx").on(table.publicationId),
    receivedAtIdx: index("omniforgeWebhookEvents_receivedAt_idx").on(table.receivedAt),
    statusIdx: index("omniforgeWebhookEvents_status_idx").on(table.processingStatus),
  })
);

export type OmniForgeWebhookEventRecord = typeof omniforgeWebhookEvents.$inferSelect;
export type InsertOmniForgeWebhookEvent = typeof omniforgeWebhookEvents.$inferInsert;

/**
 * Normalized affiliate products from partner feeds (Ekočlověk, Zážitky.cz, etc.)
 */
export const affiliateProducts = mysqlTable(
  "affiliateProducts",
  {
    id: varchar("id", { length: 128 }).primaryKey(), // e.g. "ekoclovek:52/5-0" or "zazitky:1138"
    externalId: varchar("externalId", { length: 128 }),
    merchant: varchar("merchant", { length: 32 }).notNull(), // "ekoclovek" | "zazitky"
    title: varchar("title", { length: 512 }).notNull(),
    description: text("description"),
    sourceUrl: varchar("sourceUrl", { length: 1024 }),
    affiliateUrl: varchar("affiliateUrl", { length: 1024 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 1024 }),
    price: decimal("price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 8 }).default("CZK"),
    category: varchar("category", { length: 256 }),
    tags: text("tags"), // JSON array of string tags
    cuisines: text("cuisines"), // JSON array of matched cuisines
    ingredients: text("ingredients"), // JSON array of matched ingredients
    intents: text("intents"), // JSON array of intents
    active: boolean("active").default(true).notNull(),
    relevanceScore: decimal("relevanceScore", { precision: 5, scale: 2 }).default("1.00"),
    lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    merchantActiveIdx: index("affiliateProducts_merchant_active_idx").on(table.merchant, table.active),
    categoryIdx: index("affiliateProducts_category_idx").on(table.category),
  })
);

export type AffiliateProductRecord = typeof affiliateProducts.$inferSelect;
export type InsertAffiliateProduct = typeof affiliateProducts.$inferInsert;

/**
 * Tracking impressions, clicks, and social landings for affiliate & social attribution
 */
export const affiliateEvents = mysqlTable(
  "affiliateEvents",
  {
    id: int("id").autoincrement().primaryKey(),
    eventType: mysqlEnum("eventType", ["impression", "click", "social_landing"]).notNull(),
    merchant: varchar("merchant", { length: 32 }).default("none").notNull(),
    productId: varchar("productId", { length: 128 }).default("none").notNull(),
    recipeSlug: varchar("recipeSlug", { length: 128 }),
    placement: varchar("placement", { length: 64 }).default("direct_link").notNull(), // "related_product" | "related_experience" | "recipe_ingredient" | "social_landing"
    category: varchar("category", { length: 128 }),
    cuisine: varchar("cuisine", { length: 128 }),
    socialPostId: int("socialPostId"),
    attributionSessionId: varchar("attributionSessionId", { length: 64 }),
    utmSource: varchar("utmSource", { length: 64 }),
    utmMedium: varchar("utmMedium", { length: 64 }),
    utmCampaign: varchar("utmCampaign", { length: 128 }),
    copyStyle: varchar("copyStyle", { length: 32 }),
    publishingSlot: varchar("publishingSlot", { length: 16 }),
    referrer: varchar("referrer", { length: 512 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    eventLookupIdx: index("affiliateEvents_type_merchant_idx").on(table.eventType, table.merchant),
    recipeSlugIdx: index("affiliateEvents_recipeSlug_idx").on(table.recipeSlug),
    socialPostIdIdx: index("affiliateEvents_socialPostId_idx").on(table.socialPostId),
    typeSocialPostIdx: index("affiliateEvents_type_socialPost_idx").on(table.eventType, table.socialPostId),
    createdAtIdx: index("affiliateEvents_createdAt_idx").on(table.createdAt),
  })
);

export type AffiliateEventRecord = typeof affiliateEvents.$inferSelect;
export type InsertAffiliateEvent = typeof affiliateEvents.$inferInsert;

/**
 * Audit log of affiliate feed synchronization runs
 */
export const affiliateSyncLogs = mysqlTable(
  "affiliateSyncLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    merchant: varchar("merchant", { length: 32 }).notNull(),
    status: mysqlEnum("status", ["success", "failed"]).notNull(),
    itemsFetched: int("itemsFetched").default(0).notNull(),
    itemsAccepted: int("itemsAccepted").default(0).notNull(),
    itemsRejected: int("itemsRejected").default(0).notNull(),
    itemsInserted: int("itemsInserted").default(0).notNull(),
    itemsUpdated: int("itemsUpdated").default(0).notNull(),
    itemsDeactivated: int("itemsDeactivated").default(0).notNull(),
    durationMs: int("durationMs").default(0).notNull(),
    errorMessage: text("errorMessage"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    merchantCreatedAtIdx: index("affiliateSyncLogs_merchant_createdAt_idx").on(table.merchant, table.createdAt),
  })
);

export type AffiliateSyncLogRecord = typeof affiliateSyncLogs.$inferSelect;
export type InsertAffiliateSyncLog = typeof affiliateSyncLogs.$inferInsert;

