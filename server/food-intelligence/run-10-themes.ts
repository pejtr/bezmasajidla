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

  console.log("| # | Opportunity | rawCommercial | qualityMult | noveltyMult | finalProfitScore | Decision | Why now |");
  console.log("|---|-------------|--------------:|------------:|------------:|-----------------:|----------|---------|");

  results.forEach((r, idx) => {
    const raw = r.rawCommercialScore ?? r.profitScore?.rawCommercialScore ?? "-";
    const q = r.qualityMultiplier ?? r.profitScore?.qualityMultiplier ?? "-";
    const n = r.noveltyMultiplier ?? r.profitScore?.noveltyMultiplier ?? "-";
    const finalScore = r.finalProfitOpportunityScore ?? r.profitScore?.finalProfitOpportunityScore ?? r.score;
    console.log(
      `| ${idx + 1} | **${r.concept}** | ${raw} | ${q}× | ${n}× | **${finalScore}** | **${r.decision}** | ${r.whyNow || ""} |`
    );
  });

  console.log("\n---\n");
  console.log("## AFFILIATE REALITY GATE (TOP 3 OPPORTUNITIES)\n");
  results.slice(0, 3).forEach((r, idx) => {
    const aff = r.affiliateVerification || r.profitScore?.affiliateVerification;
    console.log(`### ${idx + 1}. ${r.concept}`);
    console.log(`* **affiliateFitScore:** ${aff?.affiliateFitScore ?? "N/A"}/100`);
    console.log(`* **affiliateAvailable:** ${aff?.affiliateAvailable ? "true" : "false"}`);
    console.log(`* **merchant:** ${aff?.merchant ? `"${aff.merchant}"` : "null"}`);
    console.log(`* **productMapped:** ${aff?.productMapped ? "true" : "false"}`);
    console.log(`* **commissionKnown:** ${aff?.commissionKnown ? "true" : "false"}`);
    console.log(`* **verificationStatus:** \`${aff?.verificationStatus ?? "HYPOTHESIS"}\``);
    console.log(`* **candidateItems:** ${aff?.candidateItems?.join(", ") || "None"}\n`);
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
      if (b.affiliateVerification) {
        console.log(`* **Affiliate reality status:** \`${b.affiliateVerification.verificationStatus}\` (available: ${b.affiliateVerification.affiliateAvailable}, mapped: ${b.affiliateVerification.productMapped})`);
      }
      console.log(`* **Catering usage:** ${b.cateringUsage}`);
      console.log(`* **Social hook:** ${b.socialHook}`);
      console.log(`* **Cookbook chapter:** ${b.cookbookChapter}`);
      console.log(`* **Newsletter hook:** ${b.newsletterHook}`);
      console.log(`* **SEO intent:** ${b.seoIntent}`);
      console.log(`* **Publication policy:** \`${b.publicationPolicy}\`\n`);
    });
}

main().catch(console.error);
