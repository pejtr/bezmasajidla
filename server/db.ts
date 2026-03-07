import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  reviews, InsertReview,
  favorites, InsertFavorite,
  userRecipes, InsertUserRecipe,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ── Users ──────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Reviews ────────────────────────────────────────────────

export async function getReviewsByRestaurant(restaurantSlug: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: reviews.id,
      userId: reviews.userId,
      restaurantSlug: reviews.restaurantSlug,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.restaurantSlug, restaurantSlug))
    .orderBy(desc(reviews.createdAt));
  return rows;
}

export async function getReviewsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.userId, userId)).orderBy(desc(reviews.createdAt));
}

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(reviews).values(data);
}

export async function deleteReview(reviewId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(reviews).where(and(eq(reviews.id, reviewId), eq(reviews.userId, userId)));
}

export async function getRestaurantAverageRating(restaurantSlug: string) {
  const db = await getDb();
  if (!db) return { avg: 0, count: 0 };
  const result = await db
    .select({
      avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.restaurantSlug, restaurantSlug));
  return { avg: Number(result[0]?.avg ?? 0), count: Number(result[0]?.count ?? 0) };
}

// ── Favorites ──────────────────────────────────────────────

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
}

export async function toggleFavorite(userId: number, itemType: "restaurant" | "recipe", itemSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(favorites)
    .where(and(
      eq(favorites.userId, userId),
      eq(favorites.itemType, itemType),
      eq(favorites.itemSlug, itemSlug),
    ))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    return { added: false };
  } else {
    await db.insert(favorites).values({ userId, itemType, itemSlug });
    return { added: true };
  }
}

export async function isFavorited(userId: number, itemType: "restaurant" | "recipe", itemSlug: string) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(
      eq(favorites.userId, userId),
      eq(favorites.itemType, itemType),
      eq(favorites.itemSlug, itemSlug),
    ))
    .limit(1);
  return result.length > 0;
}

// ── User Recipes ───────────────────────────────────────────

export async function getUserRecipes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userRecipes).where(eq(userRecipes.userId, userId)).orderBy(desc(userRecipes.createdAt));
}

export async function getApprovedUserRecipes() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: userRecipes.id,
    userId: userRecipes.userId,
    title: userRecipes.title,
    slug: userRecipes.slug,
    description: userRecipes.description,
    category: userRecipes.category,
    difficulty: userRecipes.difficulty,
    prepTime: userRecipes.prepTime,
    servings: userRecipes.servings,
    image: userRecipes.image,
    ingredients: userRecipes.ingredients,
    steps: userRecipes.steps,
    tags: userRecipes.tags,
    isApproved: userRecipes.isApproved,
    createdAt: userRecipes.createdAt,
    updatedAt: userRecipes.updatedAt,
    authorName: users.name,
  })
    .from(userRecipes)
    .leftJoin(users, eq(userRecipes.userId, users.id))
    .where(eq(userRecipes.isApproved, true))
    .orderBy(desc(userRecipes.createdAt));
}

export async function getUserRecipeBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select({
      id: userRecipes.id,
      userId: userRecipes.userId,
      title: userRecipes.title,
      slug: userRecipes.slug,
      description: userRecipes.description,
      category: userRecipes.category,
      difficulty: userRecipes.difficulty,
      prepTime: userRecipes.prepTime,
      servings: userRecipes.servings,
      image: userRecipes.image,
      ingredients: userRecipes.ingredients,
      steps: userRecipes.steps,
      tags: userRecipes.tags,
      isApproved: userRecipes.isApproved,
      createdAt: userRecipes.createdAt,
      updatedAt: userRecipes.updatedAt,
      authorName: users.name,
    })
    .from(userRecipes)
    .leftJoin(users, eq(userRecipes.userId, users.id))
    .where(eq(userRecipes.slug, slug))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserRecipe(data: InsertUserRecipe) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(userRecipes).values(data);
}

export async function deleteUserRecipe(recipeId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(userRecipes).where(and(eq(userRecipes.id, recipeId), eq(userRecipes.userId, userId)));
}
