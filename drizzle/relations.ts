import { relations } from "drizzle-orm";
import { users, reviews, favorites, userRecipes } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  favorites: many(favorites),
  userRecipes: many(userRecipes),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

export const userRecipesRelations = relations(userRecipes, ({ one }) => ({
  user: one(users, {
    fields: [userRecipes.userId],
    references: [users.id],
  }),
}));
