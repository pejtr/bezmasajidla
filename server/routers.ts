import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { rateLimitMiddleware } from "./_core/rateLimit";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { subscribeToBrevo, sendBrevoEmail } from "./_core/brevo";
import { createComgatePayment } from "./_core/comgate";
import { notifyGoogleIndexing } from "./_core/google-indexing";
import { affiliateRouter } from "./affiliate/router";
import { foodIntelligenceRouter } from "./food-intelligence/food-intelligence-router";
import {
  getSocialPublisherStatus,
  listSocialPosts,
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
      getSocialPublisherStatus()
    ),

    socialPosts: adminProcedure.query(() => listSocialPosts()),

    scheduleRecipeSocial: adminProcedure
      .input(
        z.object({
          recipeId: z.number(),
          scheduledFor: z.date().optional(),
          channels: z
            .array(z.enum(["facebook", "instagram"]))
            .min(1)
            .optional(),
          publicationPolicy: z.enum(["ORIGINAL", "INTERNAL_ONLY"]),
        })
      )
      .mutation(({ input }) =>
        scheduleRecipeForSocialMedia(input.recipeId, {
          scheduledFor: input.scheduledFor,
          channels: input.channels,
          publicationPolicy: input.publicationPolicy,
        })
      ),

    previewSocialPost: adminProcedure
      .input(
        z.object({
          recipeSlug: z.string(),
          platform: z.enum(["facebook", "instagram"]).default("instagram"),
        })
      )
      .query(async ({ input }) => {
        const {
          getAllCuratedCandidates,
          generateSocialCaption,
          determineCopyStyle,
          buildTrackedSocialUrl,
        } = await import("./_core/social-autopilot");

        const candidates = getAllCuratedCandidates();
        const found =
          candidates.find(c => c.slug === input.recipeSlug) || candidates[0];
        if (!found)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Recept nebyl nalezen",
          });

        const style = determineCopyStyle(found, new Date());
        const linkUrl = buildTrackedSocialUrl(
          found.slug,
          input.platform,
          style
        );
        const caption = generateSocialCaption(
          found,
          input.platform,
          style,
          linkUrl
        );

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
  }),

  // ── Newsletter ───────────────────────────────────────────
  newsletter: router({
    subscribe: publicProcedure
      .use(rateLimitMiddleware({ windowMs: 60_000, max: 5 }))
      .input(
        z.object({
          email: z.string().email("Neplatný e-mail").max(320),
          source: z.string().max(100).optional(),
          landingPage: z.string().max(500).optional(),
          utmSource: z.string().max(100).optional(),
          utmMedium: z.string().max(100).optional(),
          utmCampaign: z.string().max(100).optional(),
          utmContent: z.string().max(100).optional(),
          consent: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { email, source, landingPage, utmSource, utmMedium, utmCampaign, utmContent, consent } = input;
        const normalizedSource = source || "bezmasajidla.cz_newsletter";
        const submittedAt = new Date().toISOString();

        // Brevo API integration (formerly Sendinblue) - safe deduplication and attribute updating
        const brevoResult = await subscribeToBrevo({
          email,
          source: normalizedSource,
          attributes: {
            SOURCE: normalizedSource,
            LANDING_PAGE: landingPage || "",
            UTM_SOURCE: utmSource || "",
            UTM_MEDIUM: utmMedium || "",
            UTM_CAMPAIGN: utmCampaign || "",
            UTM_CONTENT: utmContent || "",
            CONSENT_DATE: submittedAt,
            CONSENT_STATE: consent !== false ? "GRANTED" : "OPT_OUT",
          },
        });
        if (!brevoResult.success) {
          console.warn("[Newsletter] Brevo subscription status:", brevoResult.message);
        }

        // For Hermelin E-book: deliver PDF download link via transactional email
        if (normalizedSource === "hermelin_ebook") {
          try {
            await sendBrevoEmail({
              toEmail: email,
              subject: "Váš e-book: Hermelín Around the World (15 autorských receptů)",
              htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1C2826; line-height: 1.6;">
                  <h1 style="color: #064E3B; font-size: 22px; margin-bottom: 16px;">Váš e-book je připraven ke stažení! 🧀</h1>
                  <p>Dobrý den,</p>
                  <p>děkujeme za váš zájem o degustační kuchařku <strong>Hermelín Around the World: 15 variant nakládaného hermelínu</strong>.</p>
                  <div style="text-align: center; margin: 28px 0;">
                    <a href="https://www.bezmasajidla.cz/ebooks/hermelin_around_the_world_ebook.pdf"
                       style="background-color: #059669; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                      👉 Stáhnout e-book v PDF
                    </a>
                  </div>
                  <p style="font-size: 14px; color: #4B5563;">
                    Přímý odkaz pro stažení:<br />
                    <a href="https://www.bezmasajidla.cz/ebooks/hermelin_around_the_world_ebook.pdf" style="color: #059669;">https://www.bezmasajidla.cz/ebooks/hermelin_around_the_world_ebook.pdf</a>
                  </p>
                  <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 28px 0;" />
                  <p style="font-size: 12px; color: #9CA3AF;">
                    Tento e-mail jste obdrželi na základě žádosti o stažení e-booku na webu BezmasáJídla.cz.
                  </p>
                </div>
              `,
            });
          } catch (mailErr) {
            console.warn("[Newsletter] Brevo confirmation mail send error:", mailErr);
          }
        }

        // Always notify owner about new subscriber
        await notifyOwner({
          title: normalizedSource === "hermelin_ebook"
            ? `🧀 Nový zájemce o e-book: Hermelín Around the World`
            : `📧 Nový odběratel newsletteru`,
          content: `E-mail: **${email}**\n\nZdroj: ${normalizedSource}\nLanding: ${landingPage || "home"}\nUTM: ${utmSource || "direct"} / ${utmMedium || "-"} / ${utmCampaign || "-"}`,
        });

        return {
          success: true,
          downloadUrl: "/ebooks/hermelin_around_the_world_ebook.pdf",
        };
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

  // ── Omni Food Intelligence v0.1 (Internal Editorial Research) ─
  foodIntelligence: foodIntelligenceRouter,
});

export type AppRouter = typeof appRouter;

