// ============================================================
// BEZMASAJIDLA.CZ — OMNI FOOD INTELLIGENCE v0.1
// Content Gap Engine: External Signals vs Inventory Analysis
// ============================================================

import { recipes as staticRecipes, Recipe } from "../../../client/src/lib/data";
import { getApprovedUserRecipes } from "../../db";
import type {
  ContentOpportunity,
  ExternalRecipeSignal,
  ExistingRecipeMatch,
} from "../types";
import { detectCraveSignals, calculateOpportunityScore } from "./signal-scorer";

export interface InventoryItem {
  slug: string;
  title: string;
  category?: string;
  cuisine?: string;
  tags: string[];
}

export class ContentGapEngine {
  private staticInventory: InventoryItem[];

  constructor(customInventory?: InventoryItem[]) {
    this.staticInventory =
      customInventory ||
      staticRecipes.map(r => ({
        slug: r.slug,
        title: r.title,
        category: r.category,
        cuisine: r.cuisine,
        tags: r.tags || [],
      }));
  }

  /**
   * Retrieves full catalog combining static recipes and approved user recipes
   */
  async getFullInventory(): Promise<InventoryItem[]> {
    try {
      const dbUserRecipes = await getApprovedUserRecipes();
      const userItems: InventoryItem[] = (dbUserRecipes || []).map(ur => ({
        slug: ur.slug,
        title: ur.title,
        category: ur.category || undefined,
        tags: ur.tags ? (typeof ur.tags === "string" ? JSON.parse(ur.tags) : ur.tags) : [],
      }));
      return [...this.staticInventory, ...userItems];
    } catch {
      return this.staticInventory;
    }
  }

  /**
   * Compares external recipe signals against our recipe inventory to detect content gaps.
   * NEVER imports external text or assets — strictly produces editorial opportunities.
   */
  async analyzeGaps(signals: ExternalRecipeSignal[]): Promise<ContentOpportunity[]> {
    if (!signals || signals.length === 0) {
      return [];
    }

    const inventory = await this.getFullInventory();
    const opportunities: ContentOpportunity[] = [];

    // Group signals by normalized ingredient & technique clusters to detect signal frequency
    const groupedConcepts = this.clusterSignals(signals);

    for (const cluster of groupedConcepts) {
      const conceptName = cluster.representativeTitle;
      const ingredients = Array.from(cluster.ingredients);
      const techniques = Array.from(cluster.techniques);
      const cuisines = Array.from(cluster.cuisines);
      const craveSignals = detectCraveSignals(
        `${conceptName} ${cluster.tags.join(" ")}`,
        cluster.tags
      );

      // Find similarity with existing recipes
      const existingMatches = this.findExistingMatches(
        conceptName,
        ingredients,
        inventory
      );

      // Score this opportunity
      const isVegetarian = cluster.signals.every(s => s.vegetarian !== false);
      const scoreResult = calculateOpportunityScore({
        concept: conceptName,
        frequency: cluster.signals.length,
        craveSignals,
        cuisine: cuisines[0],
        ingredients,
        techniques,
        existingMatches,
        isVegetarian,
      });

      opportunities.push({
        concept: conceptName,
        score: scoreResult.score,
        profitScore: scoreResult.profitScore,
        decision: scoreResult.decision,
        whyNow: scoreResult.whyNow,
        revenueRoutes: scoreResult.revenueRoutes,
        reasons: scoreResult.reasons,
        ingredients,
        techniques,
        cuisines,
        craveSignals,
        existingRecipeMatches: existingMatches,
      });
    }

    // Sort opportunities by highest score first
    return opportunities.sort((a, b) => b.score - a.score);
  }

  /**
   * Finds matching recipes in our inventory and scores similarity (0 to 1)
   */
  private findExistingMatches(
    concept: string,
    ingredients: string[],
    inventory: InventoryItem[]
  ): ExistingRecipeMatch[] {
    const conceptTokens = this.tokenize(concept);
    const ingredientTokens = new Set(
      ingredients.flatMap(i => this.tokenize(i))
    );

    const matches: ExistingRecipeMatch[] = [];

    for (const item of inventory) {
      const itemTitleTokens = this.tokenize(item.title);
      // Jaccard similarity & containment overlap on title tokens
      let titleIntersection = 0;
      const titleSet = new Set(itemTitleTokens);
      conceptTokens.forEach(t => {
        if (titleSet.has(t)) titleIntersection++;
      });
      const minLength = Math.min(conceptTokens.length, itemTitleTokens.length);
      const containmentOverlap = minLength > 0 ? titleIntersection / minLength : 0;
      const jaccard = this.jaccardSimilarity(conceptTokens, itemTitleTokens);
      const titleOverlap = Math.max(jaccard, containmentOverlap * 0.85);

      // Tag / ingredient token overlap
      const itemTagTokens = item.tags.flatMap(t => this.tokenize(t));
      const tagOverlap = this.tokenSetOverlap(ingredientTokens, itemTagTokens);

      // Weighted similarity score
      const similarityScore = Math.min(
        1,
        titleOverlap * 0.75 + tagOverlap * 0.25
      );

      if (similarityScore >= 0.20) {
        matches.push({
          slug: item.slug,
          title: item.title,
          similarityScore: Number(similarityScore.toFixed(2)),
          reason:
            similarityScore >= 0.7
              ? "Vysoká obsahová a názvová shoda"
              : similarityScore >= 0.4
              ? "Shoda v klíčových surovinách nebo kategorii"
              : "Částečná tématická příbuznost",
        });
      }
    }

    // Sort by highest similarity first and take top 5
    return matches.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 5);
  }

  /**
   * Groups external signals by core ingredients/concept to detect frequency
   */
  private clusterSignals(signals: ExternalRecipeSignal[]): Array<{
    representativeTitle: string;
    signals: ExternalRecipeSignal[];
    ingredients: Set<string>;
    techniques: Set<string>;
    cuisines: Set<string>;
    tags: string[];
  }> {
    const clusters: Array<{
      representativeTitle: string;
      signals: ExternalRecipeSignal[];
      ingredients: Set<string>;
      techniques: Set<string>;
      cuisines: Set<string>;
      tags: string[];
    }> = [];

    for (const signal of signals) {
      const signalIngredients = signal.normalizedIngredients.map(i => i.canonicalName);
      let matchedCluster = false;

      for (const cluster of clusters) {
        const clusterIngs = Array.from(cluster.ingredients);
        const overlap = signalIngredients.filter(i => clusterIngs.includes(i));
        // If shares 2+ main ingredients and similar cuisine or title
        if (
          overlap.length >= 2 ||
          (overlap.length >= 1 &&
            signal.cuisine &&
            cluster.cuisines.has(signal.cuisine))
        ) {
          cluster.signals.push(signal);
          signalIngredients.forEach(i => cluster.ingredients.add(i));
          signal.techniques.forEach(t => cluster.techniques.add(t));
          if (signal.cuisine) cluster.cuisines.add(signal.cuisine);
          cluster.tags.push(...signal.tags);
          matchedCluster = true;
          break;
        }
      }

      if (!matchedCluster) {
        clusters.push({
          representativeTitle: signal.title || "Kulinářský koncept",
          signals: [signal],
          ingredients: new Set(signalIngredients),
          techniques: new Set(signal.techniques),
          cuisines: new Set(signal.cuisine ? [signal.cuisine] : []),
          tags: [...signal.tags],
        });
      }
    }

    return clusters;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  private jaccardSimilarity(a: string[], b: string[]): number {
    if (a.length === 0 || b.length === 0) return 0;
    const setA = new Set(a);
    const setB = new Set(b);
    let intersection = 0;
    setA.forEach(item => {
      if (setB.has(item)) intersection++;
    });
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  private tokenSetOverlap(aSet: Set<string>, bList: string[]): number {
    if (aSet.size === 0 || bList.length === 0) return 0;
    let match = 0;
    for (const item of bList) {
      if (aSet.has(item)) match++;
    }
    return Math.min(1, match / Math.max(1, aSet.size));
  }
}

export const defaultContentGapEngine = new ContentGapEngine();
