import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { rateLimitMiddleware } from "./_core/rateLimit";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import {
  getSocialPublisherStatus,
  listSocialPosts,
  retrySocialPost,
  runSocialPublisherOnce,
  scheduleRecipeForSocialMedia,
} from "./_core/social-media";
import {
  getReviewsByRestaurant,
  getReviewsByUser,
  createReview,
  deleteReview,
  getRestaurantAverageRating,
  getUserFavorites,
  toggleFavorite,
  isFavorited,
  syncFavorites,
  getUserRecipes,
  getApprovedUserRecipes,
  getUserRecipeBySlug,
  createUserRecipe,
  deleteUserRecipe,
  getAllUserRecipes,
  approveUserRecipe,
  rejectUserRecipe,
  getAllReviews,
  adminDeleteReview,
  getUserRecipeById,
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

    sync: protectedProcedure
      .input(z.object({
        localRestaurants: z.array(z.string()),
        localRecipes: z.array(z.string()),
      }))
      .mutation(({ ctx, input }) =>
        syncFavorites(ctx.user.id, input.localRestaurants, input.localRecipes)
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
        description: z.string().max(2000).optional(),
        category: z.string().max(64).optional(),
        difficulty: z.string().max(32).optional(),
        prepTime: z.string().max(32).optional(),
        servings: z.number().max(100).optional(),
        image: z.string().max(2000).optional(),
        ingredients: z.string().max(10000).refine((val) => {
          try { const arr = JSON.parse(val); return Array.isArray(arr); } catch { return false; }
        }, "Musí být JSON pole"),
        steps: z.string().max(10000).refine((val) => {
          try { const arr = JSON.parse(val); return Array.isArray(arr); } catch { return false; }
        }, "Musí být JSON pole"),
        tags: z.string().max(2000).optional().refine((val) => {
          if (!val) return true;
          try { const arr = JSON.parse(val); return Array.isArray(arr); } catch { return false; }
        }, "Musí být JSON pole"),
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

  // ── Admin ──────────────────────────────────────────────
  admin: router({
    // List all user-submitted recipes (pending + approved)
    allRecipes: adminProcedure
      .query(() => getAllUserRecipes()),

    // Approve a pending recipe
    approveRecipe: adminProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(async ({ input }) => {
        const recipe = await getUserRecipeById(input.recipeId);
        if (recipe) {
          await approveUserRecipe(input.recipeId);
          await scheduleRecipeForSocialMedia(recipe.id);
        }
      }),

    // Reject (delete) a recipe
    rejectRecipe: adminProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(({ input }) => rejectUserRecipe(input.recipeId)),

    // List all reviews
    allReviews: adminProcedure
      .query(() => getAllReviews()),

    // Delete any review (admin override — no userId check)
    deleteReview: adminProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(({ input }) => adminDeleteReview(input.reviewId)),

    socialPublisherStatus: adminProcedure.query(() =>
      getSocialPublisherStatus(),
    ),

    socialPosts: adminProcedure.query(() => listSocialPosts()),

    scheduleRecipeSocial: adminProcedure
      .input(
        z.object({
          recipeId: z.number(),
          scheduledFor: z.date().optional(),
        }),
      )
      .mutation(({ input }) =>
        scheduleRecipeForSocialMedia(input.recipeId, input.scheduledFor),
      ),

    retrySocialPost: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => retrySocialPost(input.id)),

    runSocialPublisher: adminProcedure.mutation(() =>
      runSocialPublisherOnce(),
    ),
  }),
  // ── Newsletter ───────────────────────────────────────────
  newsletter: router({
    subscribe: publicProcedure
      .use(rateLimitMiddleware({ windowMs: 60_000, max: 5 }))
      .input(z.object({ email: z.string().email("Neplatný e-mail").max(320) }))
      .mutation(async ({ input }) => {
        const { email } = input;

        // Mailchimp API integration
        const apiKey = process.env.MAILCHIMP_API_KEY;
        const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
        const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX; // e.g. "us21"

        if (apiKey && audienceId && serverPrefix) {
          // Full Mailchimp API integration
          const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
            },
            body: JSON.stringify({
              email_address: email,
              status: "subscribed",
              tags: ["bezmasajidla"],
            }),
          });
          const data = await response.json() as { title?: string; detail?: string };
          if (!response.ok && data.title !== "Member Exists") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: data.detail || "Nastala chyba při přihlášení.",
            });
          }
        }

        // Always notify owner about new subscriber
        await notifyOwner({
          title: `📧 Nový odběratel newsletteru`,
          content: `E-mail: **${email}**\n\n*Přihlášen z bezmasajidla.cz*`,
        });

        return { success: true };
      }),
  }),

  // ── Contact ───────────────────────────────────────────────────────
  contact: router({
    send: publicProcedure
      .use(rateLimitMiddleware({ windowMs: 60_000, max: 3 }))
      .input(
        z.object({
          name: z.string().min(2, "Jméno musí mít alespoň 2 znaky").max(100),
          email: z.string().email("Neplatná e-mailová adresa").max(320),
          subject: z.string().min(3, "Předmět musí mít alespoň 3 znaky").max(200),
          message: z.string().min(10, "Zpráva musí mít alespoň 10 znaků").max(5000),
        })
      )
      .mutation(async ({ input }) => {
        const { name, email, subject, message } = input;
        const title = `📧 Kontaktní formulář: ${subject}`;
        const content = [
          `**Od:** ${name} <${email}>`,
          `**Předmět:** ${subject}`,
          `**Zpráva:**`,
          message,
          `---`,
          `*Odesláno z bezmasajidla.cz kontaktního formuláře*`,
          `*Odpovězte na: ${email}*`,
        ].join("\n\n");
        const sent = await notifyOwner({ title, content });
        if (!sent) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.",
          });
        }
        return { success: true };
      }),
  }),
});
export type AppRouter = typeof appRouter;
