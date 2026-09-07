// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Internal Editorial Research & Intelligence tRPC Router
// ============================================================

import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { foodIntelligenceService } from "./food-intelligence-service";

export const foodIntelligenceRouter = router({
  /**
   * Health and status of registered food intelligence providers
   */
  status: adminProcedure.query(() => {
    return foodIntelligenceService.getProvidersStatus();
  }),

  /**
   * Search external recipe signals for editorial research
   * Strictly server-side; NEVER calls third-party APIs from the browser.
   */
  searchSignals: adminProcedure
    .input(
      z.object({
        query: z.string().min(2),
        limit: z.number().int().min(1).max(30).optional(),
        vegetarianOnly: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      return foodIntelligenceService.searchExternalSignals({
        query: input.query,
        limit: input.limit,
        vegetarianOnly: input.vegetarianOnly !== false,
      });
    }),

  /**
   * Run Content Gap Engine to discover high-scoring original recipe opportunities
   */
  discoverOpportunities: adminProcedure
    .input(
      z.object({
        query: z.string().min(2),
        limit: z.number().int().min(1).max(30).optional(),
      })
    )
    .query(async ({ input }) => {
      return foodIntelligenceService.discoverOpportunities(
        input.query,
        input.limit || 15
      );
    }),

  /**
   * Translate text for research with SHA256 caching
   */
  translate: adminProcedure
    .input(
      z.object({
        text: z.string().min(1),
        sourceLanguage: z.string().optional(),
        targetLanguage: z.string().default("cs"),
      })
    )
    .mutation(async ({ input }) => {
      return foodIntelligenceService.translateForResearch({
        text: input.text,
        sourceLanguage: input.sourceLanguage,
        targetLanguage: input.targetLanguage,
      });
    }),

  /**
   * Creates an editorial brief for an original recipe draft
   * Enforces the critical product law that all concepts require original content.
   */
  createEditorialBrief: adminProcedure
    .input(
      z.object({
        concept: z.string(),
        score: z.number(),
        reasons: z.array(z.string()),
        ingredients: z.array(z.string()),
        techniques: z.array(z.string()),
        cuisines: z.array(z.string()),
        craveSignals: z.array(z.any()).optional(),
        existingRecipeMatches: z.array(z.any()),
      })
    )
    .mutation(({ input }) => {
      return foodIntelligenceService.createEditorialConceptDraft(input);
    }),
});
