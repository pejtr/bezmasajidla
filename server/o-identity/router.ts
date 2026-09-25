import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getVegProfileForUser,
  listInteractionsForUser,
  setInteractionForUser,
  updateVegProfileForUser,
} from "./store";

const interactionTarget = z.enum(["recipe", "venue", "article", "product"]);
const interactionAction = z.enum([
  "favorite",
  "want_to_visit",
  "visited",
  "want_to_cook",
  "cooked",
  "saved",
]);

export const oIdentityRouter = router({
  /**
   * Returns only the application-scoped vegID subject. The root o_ID is never
   * exposed to the browser.
   */
  me: protectedProcedure.query(({ ctx }) => getVegProfileForUser(ctx.user)),

  updateVegProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().trim().min(1).max(120).nullable().optional(),
        publicHandle: z
          .string()
          .trim()
          .min(3)
          .max(40)
          .regex(/^[a-z0-9._-]+$/i)
          .nullable()
          .optional(),
        dietStyle: z
          .enum([
            "vegan",
            "vegetarian",
            "flexitarian",
            "plant-curious",
            "other",
          ])
          .nullable()
          .optional(),
        favoriteCuisines: z.array(z.string().trim().min(1).max(64)).max(24).optional(),
        profileVisibility: z.enum(["private", "public"]).optional(),
      }),
    )
    .mutation(({ ctx, input }) => updateVegProfileForUser(ctx.user, input)),

  interactions: router({
    list: protectedProcedure
      .input(
        z
          .object({
            targetType: interactionTarget.optional(),
            action: interactionAction.optional(),
          })
          .optional(),
      )
      .query(({ ctx, input }) => listInteractionsForUser(ctx.user, input)),

    set: protectedProcedure
      .input(
        z.object({
          targetType: interactionTarget,
          targetId: z.string().trim().min(1).max(256),
          action: interactionAction,
          active: z.boolean(),
        }),
      )
      .mutation(({ ctx, input }) => setInteractionForUser(ctx.user, input)),
  }),
});
