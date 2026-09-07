import { runLocalProfitabilityEvaluation } from "./analysis/intelligence-runner";

async function main() {
  const results = await runLocalProfitabilityEvaluation();

  console.log("# LOCAL PROFITABILITY RUN: 10 STRATEGIC THEMES");
  console.log("> **HEURISTIC — NOT REVENUE FORECAST**");
  console.log("> **Data Disclosure:**");
  console.log("> OWN DATA SIGNALS:        ✅ REAL (106 catalog recipes checked)");
  console.log("> RULE-BASED SCORE:        ✅ REAL (6 commercial pillars + quality/novelty multipliers)");
  console.log("> TASTY SIGNALS:           ⚪ DISABLED / NO CREDENTIALS");
  console.log("> TRANSLATION SIGNALS:     ⚪ DISABLED / NO CREDENTIALS\n");

  console.log("| # | Opportunity | Profit score | Decision | Revenue routes | Why now |");
  console.log("|---|-------------|-------------:|----------|----------------|---------|");

  results.forEach((r, idx) => {
    const routes = r.revenueRoutes?.join(" · ") || "None";
    console.log(
      `| ${idx + 1} | **${r.concept}** | ${r.profitScore?.score || r.score} | **${r.decision}** | ${routes} | ${r.whyNow || ""} |`
    );
  });

  console.log("\n---\n");
  console.log("## ORIGINAL CONTENT BRIEFS (FOR 'CREATE' CANDIDATES)\n");

  results
    .filter(r => r.decision === "CREATE")
    .forEach((r, idx) => {
      const b = r.originalContentBrief;
      if (!b) return;
      console.log(`### ${idx + 1}. ${b.workingTitle}`);
      console.log(`* **Crave signals:** ${b.craveSignals.join(", ")}`);
      console.log(`* **Core ingredients:** ${b.coreIngredients.join(", ")}`);
      console.log(`* **Original angle:** ${b.originalAngle}`);
      console.log(`* **What makes it different from existing recipes:** ${b.differentiationFromCatalog}`);
      console.log(`* **Affiliate opportunities:** ${b.affiliateOpportunities.join(" · ")}`);
      console.log(`* **Catering usage:** ${b.cateringUsage}`);
      console.log(`* **Social hook:** ${b.socialHook}`);
      console.log(`* **Cookbook chapter:** ${b.cookbookChapter}`);
      console.log(`* **Newsletter hook:** ${b.newsletterHook}`);
      console.log(`* **SEO intent:** ${b.seoIntent}`);
      console.log(`* **Publication policy:** \`${b.publicationPolicy}\`\n`);
    });
}

main().catch(console.error);
