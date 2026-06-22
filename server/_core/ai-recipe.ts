import { getDb } from "../db";
import { userRecipes, type InsertUserRecipe } from "../../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * Service to generate a daily recipe using an AI Model.
 * For demonstration, this mocks the OpenAI API call.
 */
export async function generateDailyAIRecipe() {
    console.log("[AI Recipe] Starting daily AI recipe generation...");

    try {
        const db = await getDb();
        if (!db) {
            console.warn("[AI Recipe] Database not available, skipping generation.");
            return;
        }
        // TBD: use real OpenAI fetch here using fetch() to api.openai.com
        // Mocked AI output
        const mockGeneratedRecipe: InsertUserRecipe = {
            userId: 1, // Admin user ID or system user ID
            title: "AI Vygenerovaný Veganský Zázrak: Quinoa s Pečenou Zeleninou",
            slug: `quinoa-pecena-zelenina-${nanoid(6)}`,
            description: "Tento jednoduchý a zdravý recept byl navržen umělou inteligencí pro maximální výživu a skvělou chuť. Plný proteinu a barev!",
            category: "Hlavní jídla",
            difficulty: "snadný",
            prepTime: "15",
            servings: 2,
            isApproved: false, // Wait for admin approval
            ingredients: JSON.stringify([
                "200g quinoy",
                "1 batát",
                "1 paprika",
                "2 lžíce olivového oleje",
                "Sůl, pepř a kurkuma"
            ]),
            steps: JSON.stringify([
                "Uvařte quinou dle návodu.",
                "Zeleninu nakrájejte a upečte v troubě s olejem a kořením.",
                "Vše smíchejte a podávejte."
            ]),
            tags: JSON.stringify(["Vegan", "AI Recept", "Zdravé", "Do 30 min", "Bezlepkové"]),
            image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/restaurant-placeholder-NfsuHQoJhFmyxCXwn7EygE.webp" // Placeholder until explicitly generated via DALL-E
        };

        await db.insert(userRecipes).values(mockGeneratedRecipe);
        console.log("[AI Recipe] Successfully generated and stored a draft AI recipe.");

    } catch (error) {
        console.error("[AI Recipe] Failed to generate AI recipe", error);
    }
}

/**
 * Utility to start the mock CRON job interval in the server
 */
export function startDailyRecipeCronJob() {
    // Runs every 24 hours (86400000 ms)
    const INTERVAL_MS = 24 * 60 * 60 * 1000;

    // Call once immediately on startup for testing if needed, or just set interval
    // setTimeout(() => generateDailyAIRecipe(), 10000); 

    setInterval(async () => {
        await generateDailyAIRecipe();
    }, INTERVAL_MS);

    console.log("[CRON] Daily AI recipe generator started.");
}
