import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { rateLimitMiddleware } from "./_core/rateLimit";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { subscribeToBrevo } from "./_core/brevo";
import { createComgatePayment } from "./_core/comgate";
import { notifyGoogleIndexing } from "./_core/google-indexing";
import { affiliateRouter } from "./affiliate/router";
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

    // Approve a pending recipe and trigger Google Instant Indexing API v3
    approveRecipe: adminProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(async ({ input }) => {
        const recipe = await getUserRecipeById(input.recipeId);
        if (recipe) {
          await approveUserRecipe(input.recipeId);
          await scheduleRecipeForSocialMedia(recipe.id);
          // Ping Google Instant Indexing API v3
          await notifyGoogleIndexing(`/recepty/${recipe.slug}`);
        }
      }),

    // Manually trigger Google Instant Indexing API v3 for any target URL
    pingGoogleIndexing: adminProcedure
      .input(z.object({ url: z.string().min(1) }))
      .mutation(async ({ input }) => {
        return await notifyGoogleIndexing(input.url);
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

    refillSocialQueue: adminProcedure
      .input(z.object({ days: z.number().min(1).max(60).default(14) }).optional())
      .mutation(async ({ input }) => {
        const { ensureAutonomousQueue } = await import("./_core/social-autopilot");
        return await ensureAutonomousQueue(input?.days || 14);
      }),

    exportSocialCsv: adminProcedure
      .input(z.object({ limit: z.number().min(1).max(300).default(60) }).optional())
      .query(async ({ input }) => {
        const { exportSocialCalendarCsv } = await import("./_core/social-autopilot");
        return await exportSocialCalendarCsv(input?.limit || 60);
      }),

    previewSocialPost: adminProcedure
      .input(
        z.object({
          recipeSlug: z.string(),
          platform: z.enum(["facebook", "instagram"]).default("instagram"),
        }),
      )
      .query(async ({ input }) => {
        const {
          getAllCuratedCandidates,
          generateSocialCaption,
          determineCopyStyle,
          buildTrackedSocialUrl,
        } = await import("./_core/social-autopilot");

        const candidates = getAllCuratedCandidates();
        const found = candidates.find(c => c.slug === input.recipeSlug) || candidates[0];
        if (!found) throw new TRPCError({ code: "NOT_FOUND", message: "Recept nebyl nalezen" });

        const style = determineCopyStyle(found, new Date());
        const linkUrl = buildTrackedSocialUrl(found.slug, input.platform, style);
        const caption = generateSocialCaption(found, input.platform, style, linkUrl);

        return {
          recipeSlug: found.slug,
          recipeTitle: found.title,
          platform: input.platform,
          style,
          linkUrl,
          imageUrl: found.image,
          caption,
        };
      }),

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

        // Brevo API integration (formerly Sendinblue)
        const brevoResult = await subscribeToBrevo({ email, source: "bezmasajidla.cz_newsletter" });
        if (!brevoResult.success) {
          console.warn("[Newsletter] Brevo subscription status:", brevoResult.message);
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

  // ── Comgate Payment Gateway ───────────────────────────────
  payment: router({
    createPayment: publicProcedure
      .use(rateLimitMiddleware({ windowMs: 60_000, max: 10 }))
      .input(
        z.object({
          priceCzk: z.number().min(1, "Cena musí být vyšší než 0 Kč"),
          label: z.string().min(3).max(200),
          payerEmail: z.string().email("Neplatná e-mailová adresa"),
          payerName: z.string().optional(),
          orderType: z.enum(["warrior_program", "b2b_listing", "eshop_product"]).default("warrior_program"),
        })
      )
      .mutation(async ({ input }) => {
        const orderId = `BM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

        const paymentResult = await createComgatePayment({
          orderId,
          priceCzk: input.priceCzk,
          label: input.label,
          payerEmail: input.payerEmail,
          payerName: input.payerName,
        });

        if (!paymentResult.success || !paymentResult.redirectUrl) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: paymentResult.message || "Nepodařilo se vytvořit platbu v bráně Comgate.",
          });
        }

        // Notify owner about pending checkout init
        await notifyOwner({
          title: `💳 Zahájena platba v bráně Comgate`,
          content: `**Objednávka:** ${orderId}\n**Částka:** ${input.priceCzk} Kč\n**Produkt:** ${input.label}\n**E-mail:** ${input.payerEmail}`,
        });

        return {
          orderId,
          transId: paymentResult.transId,
          redirectUrl: paymentResult.redirectUrl,
        };
      }),
  }),

  // ── Affiliate Commerce Engine ─────────────────────────────
  affiliate: affiliateRouter,
});

export type AppRouter = typeof appRouter;
