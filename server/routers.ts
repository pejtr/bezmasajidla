import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Reviews ────────────────────────────────────────────
  reviews: router({
    byRestaurant: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getReviewsByRestaurant(input.slug)),

    byUser: protectedProcedure
      .query(({ ctx }) => getReviewsByUser(ctx.user.id)),

    avgRating: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getRestaurantAverageRating(input.slug)),

    create: protectedProcedure
      .input(z.object({
        restaurantSlug: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(({ ctx, input }) =>
        createReview({
          userId: ctx.user.id,
          restaurantSlug: input.restaurantSlug,
          rating: input.rating,
          comment: input.comment ?? null,
        })
      ),

    delete: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(({ ctx, input }) => deleteReview(input.reviewId, ctx.user.id)),
  }),

  // ── Favorites ──────────────────────────────────────────
  favorites: router({
    list: protectedProcedure
      .query(({ ctx }) => getUserFavorites(ctx.user.id)),

    toggle: protectedProcedure
      .input(z.object({
        itemType: z.enum(["restaurant", "recipe"]),
        itemSlug: z.string(),
      }))
      .mutation(({ ctx, input }) =>
        toggleFavorite(ctx.user.id, input.itemType, input.itemSlug)
      ),

    check: protectedProcedure
      .input(z.object({
        itemType: z.enum(["restaurant", "recipe"]),
        itemSlug: z.string(),
      }))
      .query(({ ctx, input }) =>
        isFavorited(ctx.user.id, input.itemType, input.itemSlug)
      ),
  }),

  // ── User Recipes ───────────────────────────────────────
  userRecipes: router({
    myRecipes: protectedProcedure
      .query(({ ctx }) => getUserRecipes(ctx.user.id)),

    approved: publicProcedure
      .query(() => getApprovedUserRecipes()),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getUserRecipeBySlug(input.slug)),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(3).max(256),
        description: z.string().optional(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        prepTime: z.string().optional(),
        servings: z.number().optional(),
        image: z.string().optional(),
        ingredients: z.string(), // JSON array string
        steps: z.string(), // JSON array string
        tags: z.string().optional(), // JSON array string
      }))
      .mutation(({ ctx, input }) => {
        const slug = input.title
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          + "-" + Date.now().toString(36);

        return createUserRecipe({
          userId: ctx.user.id,
          title: input.title,
          slug,
          description: input.description ?? null,
          category: input.category ?? null,
          difficulty: input.difficulty ?? null,
          prepTime: input.prepTime ?? null,
          servings: input.servings ?? null,
          image: input.image ?? null,
          ingredients: input.ingredients,
          steps: input.steps,
          tags: input.tags ?? null,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(({ ctx, input }) => deleteUserRecipe(input.recipeId, ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
