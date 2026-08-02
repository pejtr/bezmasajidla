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
    recipeId: int("recipeId").notNull(),
    platform: mysqlEnum("platform", ["facebook", "instagram"]).notNull(),
    status: mysqlEnum("status", [
      "scheduled",
      "publishing",
      "published",
      "failed",
    ])
      .default("scheduled")
      .notNull(),
    caption: text("caption").notNull(),
    imageUrl: text("imageUrl"),
    linkUrl: text("linkUrl").notNull(),
    scheduledFor: timestamp("scheduledFor").notNull(),
    publishedAt: timestamp("publishedAt"),
    externalPostId: varchar("externalPostId", { length: 255 }),
    attempts: int("attempts").default(0).notNull(),
    lastError: text("lastError"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    uniqueRecipePlatform: uniqueIndex(
      "socialPosts_recipeId_platform_uidx",
    ).on(table.recipeId, table.platform),
    duePostsIdx: index("socialPosts_status_scheduledFor_idx").on(
      table.status,
      table.scheduledFor,
    ),
  }),
);

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;
