// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Central Configuration
// ============================================================

export const AFFILIATE_CONFIG = {
  // eHUB Network Affiliate IDs
  ehub: {
    aid: process.env.EHUB_AID || "6e1140ca",
    ekoclovekBid: process.env.EHUB_EKOCLOVEK_BID || "7092fff6",
    zazitkyBid: process.env.EHUB_ZAZITKY_BID || "c22fc1d9",
    clickScriptUrl: "https://ehub.cz/system/scripts/click.php",
  },

  // Feed Endpoints
  feeds: {
    ekoclovek:
      process.env.AFFILIATE_FEED_EKOCLOVEK ||
      "https://eshop.ekoclovek.cz/google.xml",
    zazitky:
      process.env.AFFILIATE_FEED_ZAZITKY ||
      "https://alis.zazitky.cz/data/exports/zazitky-pap-all.xml",
    zazitkyResidences:
      process.env.AFFILIATE_FEED_ZAZITKY_RESIDENCES ||
      "https://alis.zazitky.cz/data/exports/zazitky-pap-residences.xml",
  },

  // Matching & Display Thresholds
  matching: {
    minRelevanceThreshold: 25, // Minimum score needed to display
    maxProductsPerRecipe: 3,   // Max related products per recipe
    maxExperiencesPerRecipe: 2, // Max related experiences per recipe
    feedTimeoutMs: 20_000,     // HTTP timeout for feed fetching
  },

  // Allowed Whitelist Domains for Safe Redirects
  whitelistedDomains: [
    "eshop.ekoclovek.cz",
    "ekoclovek.cz",
    "www.ekoclovek.cz",
    "zazitky.cz",
    "www.zazitky.cz",
    "alis.zazitky.cz",
    "ehub.cz",
    "www.ehub.cz",
    "rohlik.cz",
    "www.rohlik.cz",
    "kosik.cz",
    "www.kosik.cz",
  ],
};
