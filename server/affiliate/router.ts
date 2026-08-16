// ============================================================
// BEZMASAJIDLA.CZ — Affiliate tRPC Router
// ============================================================

import { z } from "zod";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";
import {
  getAllActiveAffiliateProducts,
  recordAffiliateEvent,
  getAffiliateDiagnosticStats,
  getDetailedAffiliateKpis,
} from "./storage";
import { matchAffiliateProducts } from "./matcher";
import { syncAllAffiliateFeeds, syncAffiliateProvider } from "./sync";
import { getSafeAffiliateUrl } from "./links";
import type { RecipeMatchContext, AffiliateMerchant } from "./types";
import { recipes } from "../../client/src/lib/data";

export const affiliateRouter = router({
  // ── Public: Get Recommended Products & Experiences for a Recipe ──
  getRecipeRecommendations: publicProcedure
    .input(
      z.object({
        recipeSlug: z.string(),
        title: z.string().optional(),
        category: z.string().optional(),
        cuisine: z.string().optional(),
        ingredients: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Look up static recipe if attributes are not passed directly
        let context: RecipeMatchContext = {
          slug: input.recipeSlug,
          title: input.title || "",
          category: input.category,
          cuisine: input.cuisine,
          ingredients: input.ingredients || [],
          tags: input.tags || [],
        };

        const staticRecipe = recipes.find(r => r.slug === input.recipeSlug);
        if (staticRecipe) {
          context = {
            slug: staticRecipe.slug,
            title: staticRecipe.title,
            category: staticRecipe.category,
            cuisine: staticRecipe.cuisine,
            ingredients: input.ingredients && input.ingredients.length > 0 ? input.ingredients : staticRecipe.tags,
            tags: staticRecipe.tags,
          };
        }

        const allProducts = await getAllActiveAffiliateProducts();
        if (allProducts.length === 0) {
          return { products: [], experiences: [] };
        }

        return matchAffiliateProducts(allProducts, context);
      } catch (err) {
        console.error("[AffiliateRouter] getRecipeRecommendations error:", err);
        return { products: [], experiences: [] };
      }
    }),

  // ── Public: Track Impression (Fired when component enters viewport) ─
  trackImpression: publicProcedure
    .input(
      z.object({
        merchant: z.string(),
        productId: z.string(),
        recipeSlug: z.string().optional(),
        placement: z.string(),
        category: z.string().optional(),
        cuisine: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const referrer = ctx.req.headers.referer;
        await recordAffiliateEvent({
          eventType: "impression",
          merchant: input.merchant,
          productId: input.productId,
          recipeSlug: input.recipeSlug,
          placement: input.placement,
          category: input.category,
          cuisine: input.cuisine,
          referrer,
        });
        return { success: true };
      } catch (err) {
        console.warn("[AffiliateRouter] Failed to record impression:", err);
        return { success: false };
      }
    }),

  // ── Public: Track Click and Get Validated Destination URL ──────────
  trackClick: publicProcedure
    .input(
      z.object({
        merchant: z.enum(["ekoclovek", "zazitky"]),
        productId: z.string(),
        recipeSlug: z.string().optional(),
        placement: z.string(),
        category: z.string().optional(),
        cuisine: z.string().optional(),
        destinationUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const referrer = ctx.req.headers.referer;
        await recordAffiliateEvent({
          eventType: "click",
          merchant: input.merchant,
          productId: input.productId,
          recipeSlug: input.recipeSlug,
          placement: input.placement,
          category: input.category,
          cuisine: input.cuisine,
          referrer,
        });

        const safeUrl = await getSafeAffiliateUrl({
          merchant: input.merchant,
          productId: input.productId,
          destinationUrl: input.destinationUrl,
        });

        return { success: true, url: safeUrl };
      } catch (err) {
        console.error("[AffiliateRouter] Failed to process click:", err);
        const safeUrl = await getSafeAffiliateUrl({
          merchant: input.merchant,
          productId: input.productId,
          destinationUrl: input.destinationUrl,
        });
        return { success: true, url: safeUrl };
      }
    }),

  // ── Admin: Get Diagnostic Stats ──────────────────────────────────
  getDiagnosticStats: adminProcedure.query(async () => {
    return await getAffiliateDiagnosticStats();
  }),

  // ── Admin: Get Detailed Multi-Dimensional Telemetry & KPIs ────────
  getDetailedKpis: adminProcedure
    .input(z.object({ days: z.number().optional() }).optional())
    .query(async ({ input }) => {
      return await getDetailedAffiliateKpis(input?.days);
    }),

  // ── Admin: Manually Trigger Feed Synchronization ─────────────────
  triggerSync: adminProcedure
    .input(z.object({ merchant: z.enum(["ekoclovek", "zazitky"]).optional() }))
    .mutation(async ({ input }) => {
      if (input?.merchant) {
        const result = await syncAffiliateProvider(input.merchant);
        return { [input.merchant]: result };
      }
      return await syncAllAffiliateFeeds();
    }),
});
