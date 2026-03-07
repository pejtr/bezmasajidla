import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// ── Mock the database module ────────────────────────────────
vi.mock("./db", () => ({
  getReviewsByRestaurant: vi.fn(),
  getReviewsByUser: vi.fn(),
  createReview: vi.fn(),
  deleteReview: vi.fn(),
  getRestaurantAverageRating: vi.fn(),
  getUserFavorites: vi.fn(),
  toggleFavorite: vi.fn(),
  isFavorited: vi.fn(),
  getUserRecipes: vi.fn(),
  getApprovedUserRecipes: vi.fn(),
  getUserRecipeBySlug: vi.fn(),
  createUserRecipe: vi.fn(),
  deleteUserRecipe: vi.fn(),
}));

import {
  getReviewsByRestaurant,
  getReviewsByUser,
  createReview,
  deleteReview,
  getRestaurantAverageRating,
  getUserFavorites,
  toggleFavorite,
  isFavorited,
  getUserRecipes,
  getApprovedUserRecipes,
  getUserRecipeBySlug,
  createUserRecipe,
  deleteUserRecipe,
} from "./db";

// ── Helpers ─────────────────────────────────────────────────

const testUser: User = {
  id: 42,
  openId: "test-open-id",
  name: "Test User",
  email: "test@example.com",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  lastSignedIn: new Date("2026-01-01"),
};

function createMockContext(user: User | null = null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function authedCaller() {
  return appRouter.createCaller(createMockContext(testUser));
}

function publicCaller() {
  return appRouter.createCaller(createMockContext(null));
}

// ── Reviews ─────────────────────────────────────────────────

describe("reviews", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("reviews.byRestaurant (public)", () => {
    it("returns reviews for a given restaurant slug", async () => {
      const mockReviews = [
        { id: 1, userId: 42, restaurantSlug: "maitrea", rating: 5, comment: "Skvělé!", createdAt: new Date(), userName: "Test" },
      ];
      vi.mocked(getReviewsByRestaurant).mockResolvedValue(mockReviews);

      const result = await publicCaller().reviews.byRestaurant({ slug: "maitrea" });

      expect(getReviewsByRestaurant).toHaveBeenCalledWith("maitrea");
      expect(result).toEqual(mockReviews);
    });
  });

  describe("reviews.avgRating (public)", () => {
    it("returns average rating and count", async () => {
      vi.mocked(getRestaurantAverageRating).mockResolvedValue({ avg: 4.5, count: 10 });

      const result = await publicCaller().reviews.avgRating({ slug: "maitrea" });

      expect(getRestaurantAverageRating).toHaveBeenCalledWith("maitrea");
      expect(result).toEqual({ avg: 4.5, count: 10 });
    });
  });

  describe("reviews.byUser (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(publicCaller().reviews.byUser()).rejects.toThrow();
    });

    it("returns reviews for the authenticated user", async () => {
      const mockReviews = [
        { id: 1, userId: 42, restaurantSlug: "maitrea", rating: 4, comment: "Dobré", createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.mocked(getReviewsByUser).mockResolvedValue(mockReviews);

      const result = await authedCaller().reviews.byUser();

      expect(getReviewsByUser).toHaveBeenCalledWith(42);
      expect(result).toEqual(mockReviews);
    });
  });

  describe("reviews.create (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(
        publicCaller().reviews.create({ restaurantSlug: "maitrea", rating: 5 })
      ).rejects.toThrow();
    });

    it("creates a review with valid data", async () => {
      vi.mocked(createReview).mockResolvedValue(undefined);

      await authedCaller().reviews.create({
        restaurantSlug: "maitrea",
        rating: 5,
        comment: "Výborné!",
      });

      expect(createReview).toHaveBeenCalledWith({
        userId: 42,
        restaurantSlug: "maitrea",
        rating: 5,
        comment: "Výborné!",
      });
    });

    it("rejects rating below 1", async () => {
      await expect(
        authedCaller().reviews.create({ restaurantSlug: "maitrea", rating: 0 })
      ).rejects.toThrow();
    });

    it("rejects rating above 5", async () => {
      await expect(
        authedCaller().reviews.create({ restaurantSlug: "maitrea", rating: 6 })
      ).rejects.toThrow();
    });
  });

  describe("reviews.delete (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(
        publicCaller().reviews.delete({ reviewId: 1 })
      ).rejects.toThrow();
    });

    it("deletes a review owned by the user", async () => {
      vi.mocked(deleteReview).mockResolvedValue(undefined);

      await authedCaller().reviews.delete({ reviewId: 1 });

      expect(deleteReview).toHaveBeenCalledWith(1, 42);
    });
  });
});

// ── Favorites ───────────────────────────────────────────────

describe("favorites", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("favorites.list (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(publicCaller().favorites.list()).rejects.toThrow();
    });

    it("returns user favorites", async () => {
      const mockFavorites = [
        { id: 1, userId: 42, itemType: "restaurant" as const, itemSlug: "maitrea", createdAt: new Date() },
      ];
      vi.mocked(getUserFavorites).mockResolvedValue(mockFavorites);

      const result = await authedCaller().favorites.list();

      expect(getUserFavorites).toHaveBeenCalledWith(42);
      expect(result).toEqual(mockFavorites);
    });
  });

  describe("favorites.toggle (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(
        publicCaller().favorites.toggle({ itemType: "restaurant", itemSlug: "maitrea" })
      ).rejects.toThrow();
    });

    it("toggles a restaurant favorite", async () => {
      vi.mocked(toggleFavorite).mockResolvedValue({ added: true });

      const result = await authedCaller().favorites.toggle({
        itemType: "restaurant",
        itemSlug: "maitrea",
      });

      expect(toggleFavorite).toHaveBeenCalledWith(42, "restaurant", "maitrea");
      expect(result).toEqual({ added: true });
    });

    it("toggles a recipe favorite", async () => {
      vi.mocked(toggleFavorite).mockResolvedValue({ added: false });

      const result = await authedCaller().favorites.toggle({
        itemType: "recipe",
        itemSlug: "pad-thai",
      });

      expect(toggleFavorite).toHaveBeenCalledWith(42, "recipe", "pad-thai");
      expect(result).toEqual({ added: false });
    });
  });

  describe("favorites.check (protected)", () => {
    it("checks if an item is favorited", async () => {
      vi.mocked(isFavorited).mockResolvedValue(true);

      const result = await authedCaller().favorites.check({
        itemType: "restaurant",
        itemSlug: "maitrea",
      });

      expect(isFavorited).toHaveBeenCalledWith(42, "restaurant", "maitrea");
      expect(result).toBe(true);
    });
  });
});

// ── User Recipes ────────────────────────────────────────────

describe("userRecipes", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("userRecipes.myRecipes (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(publicCaller().userRecipes.myRecipes()).rejects.toThrow();
    });

    it("returns recipes for the authenticated user", async () => {
      const mockRecipes = [
        { id: 1, userId: 42, title: "Tofu Pad Thai", slug: "tofu-pad-thai-abc", description: null, category: "Hlavní jídla", difficulty: "střední", prepTime: "30 min", servings: 4, image: null, ingredients: "[]", steps: "[]", tags: null, isApproved: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.mocked(getUserRecipes).mockResolvedValue(mockRecipes);

      const result = await authedCaller().userRecipes.myRecipes();

      expect(getUserRecipes).toHaveBeenCalledWith(42);
      expect(result).toEqual(mockRecipes);
    });
  });

  describe("userRecipes.approved (public)", () => {
    it("returns approved recipes", async () => {
      const mockRecipes = [
        { id: 1, userId: 42, title: "Approved Recipe", slug: "approved-recipe-abc", description: null, category: null, difficulty: null, prepTime: null, servings: null, image: null, ingredients: "[]", steps: "[]", tags: null, isApproved: true, createdAt: new Date(), updatedAt: new Date(), authorName: "Test" },
      ];
      vi.mocked(getApprovedUserRecipes).mockResolvedValue(mockRecipes);

      const result = await publicCaller().userRecipes.approved();

      expect(getApprovedUserRecipes).toHaveBeenCalled();
      expect(result).toEqual(mockRecipes);
    });
  });

  describe("userRecipes.bySlug (public)", () => {
    it("returns a recipe by slug", async () => {
      const mockRecipe = {
        id: 1, userId: 42, title: "Test Recipe", slug: "test-recipe-abc", description: null, category: null, difficulty: null, prepTime: null, servings: null, image: null, ingredients: "[]", steps: "[]", tags: null, isApproved: true, createdAt: new Date(), updatedAt: new Date(), authorName: "Test",
      };
      vi.mocked(getUserRecipeBySlug).mockResolvedValue(mockRecipe);

      const result = await publicCaller().userRecipes.bySlug({ slug: "test-recipe-abc" });

      expect(getUserRecipeBySlug).toHaveBeenCalledWith("test-recipe-abc");
      expect(result).toEqual(mockRecipe);
    });
  });

  describe("userRecipes.create (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(
        publicCaller().userRecipes.create({
          title: "Test",
          ingredients: "[]",
          steps: "[]",
        })
      ).rejects.toThrow();
    });

    it("creates a recipe with valid data", async () => {
      vi.mocked(createUserRecipe).mockResolvedValue(undefined);

      await authedCaller().userRecipes.create({
        title: "Veganský Pad Thai",
        description: "Skvělý recept",
        category: "Hlavní jídla",
        difficulty: "střední",
        prepTime: "30 min",
        servings: 4,
        ingredients: JSON.stringify(["200g tofu", "100g rýžové nudle"]),
        steps: JSON.stringify(["Nakrájejte tofu", "Uvařte nudle"]),
        tags: JSON.stringify(["vegan", "asijská"]),
      });

      expect(createUserRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 42,
          title: "Veganský Pad Thai",
          description: "Skvělý recept",
          category: "Hlavní jídla",
          difficulty: "střední",
          prepTime: "30 min",
          servings: 4,
          ingredients: JSON.stringify(["200g tofu", "100g rýžové nudle"]),
          steps: JSON.stringify(["Nakrájejte tofu", "Uvařte nudle"]),
          tags: JSON.stringify(["vegan", "asijská"]),
          slug: expect.stringContaining("vegansky-pad-thai"),
        })
      );
    });

    it("rejects title shorter than 3 chars", async () => {
      await expect(
        authedCaller().userRecipes.create({
          title: "Ab",
          ingredients: "[]",
          steps: "[]",
        })
      ).rejects.toThrow();
    });
  });

  describe("userRecipes.delete (protected)", () => {
    it("rejects unauthenticated users", async () => {
      await expect(
        publicCaller().userRecipes.delete({ recipeId: 1 })
      ).rejects.toThrow();
    });

    it("deletes a recipe owned by the user", async () => {
      vi.mocked(deleteUserRecipe).mockResolvedValue(undefined);

      await authedCaller().userRecipes.delete({ recipeId: 1 });

      expect(deleteUserRecipe).toHaveBeenCalledWith(1, 42);
    });
  });
});
