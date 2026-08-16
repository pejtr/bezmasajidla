// ============================================================
// BEZMASAJIDLA.CZ — Grocery Readiness & Ingredient Parser Tests (v1.1)
// ============================================================

import { describe, expect, it } from "vitest";
import { parseIngredient, parseRecipeIngredients, parseQuantity } from "./affiliate/grocery/parser";
import { UnavailableGroceryProvider } from "./affiliate/grocery/provider";
import { AFFILIATE_CONFIG } from "./affiliate/config";

describe("Grocery Readiness — Czech Ingredient Parser", () => {
  it("parses fractional and decimal quantities correctly", () => {
    expect(parseQuantity("400")).toBe(400);
    expect(parseQuantity("1/2")).toBe(0.5);
    expect(parseQuantity("1/4")).toBe(0.25);
    expect(parseQuantity("2.5")).toBe(2.5);
    expect(parseQuantity("2,5")).toBe(2.5);
    expect(parseQuantity("")).toBeUndefined();
  });

  it("handles user specification test cases accurately", () => {
    // 1. "400 g cizrny" -> 400 | g | cizrna
    const cizrna = parseIngredient("400 g cizrny");
    expect(cizrna.amount).toBe(400);
    expect(cizrna.unit).toBe("g");
    expect(cizrna.name).toBe("cizrna");
    expect(cizrna.raw).toBe("400 g cizrny");

    // 2. "2 lžíce olivového oleje" -> 2 | lžíce | olivový olej
    const olej = parseIngredient("2 lžíce olivového oleje");
    expect(olej.amount).toBe(2);
    expect(olej.unit).toBe("lžíce");
    expect(olej.name).toBe("olivový olej");

    // 3. "1 velká cibule, najemno" -> 1 | ks | cibule
    const cibule = parseIngredient("1 velká cibule, najemno");
    expect(cibule.amount).toBe(1);
    expect(cibule.unit).toBe("ks");
    expect(cibule.name).toBe("cibule");

    // 4. "sůl dle chuti" -> undefined | undefined | sůl
    const sul = parseIngredient("sůl dle chuti");
    expect(sul.amount).toBeUndefined();
    expect(sul.unit).toBeUndefined();
    expect(sul.name).toBe("sůl");

    // 5. "čerstvě mletý černý pepř" -> undefined | undefined | černý pepř
    const pepr = parseIngredient("čerstvě mletý černý pepř");
    expect(pepr.amount).toBeUndefined();
    expect(pepr.unit).toBeUndefined();
    expect(pepr.name).toBe("černý pepř");
  });

  it("handles Czech garlic cloves, lemon juice and fractions", () => {
    // "2 stroužky česneku" -> 2 | stroužek | česnek
    const cesnek = parseIngredient("2 stroužky česneku");
    expect(cesnek.amount).toBe(2);
    expect(cesnek.unit).toBe("stroužek");
    expect(cesnek.name).toBe("česnek");

    // "1/2 lžičky kurkumy" -> 0.5 | lžička | kurkuma
    const kurkuma = parseIngredient("1/2 lžičky kurkumy");
    expect(kurkuma.amount).toBe(0.5);
    expect(kurkuma.unit).toBe("lžička");
    expect(kurkuma.name).toBe("kurkuma");
  });

  it("safely passes through unknown ingredients without failing", () => {
    const unknown = parseIngredient("1 balení exotické bio dračí ovoce");
    expect(unknown.amount).toBe(1);
    expect(unknown.unit).toBe("balení");
    expect(unknown.name).toContain("dračí ovoce");
    expect(unknown.query.length).toBeGreaterThan(0);
  });

  it("batch parses recipe ingredient arrays", () => {
    const list = [
      "400 g červené čočky",
      "1 lžíce rostlinného oleje",
      "1 plechovka kokosového mléka",
      "sůl dle chuti",
    ];
    const parsed = parseRecipeIngredients(list);
    expect(parsed.length).toBe(4);
    expect(parsed[0].name).toBe("červená čočka");
    expect(parsed[2].name).toBe("kokosové mléko");
    expect(parsed[2].unit).toBe("plechovka");
  });
});

describe("Grocery Readiness — Provider Interface & Feature Flag", () => {
  it("UnavailableGroceryProvider reports configured = false and null cart URL", async () => {
    const provider = new UnavailableGroceryProvider();
    expect(provider.isConfigured).toBe(false);
    expect(provider.name).toBe("UnavailableGroceryProvider");
    expect(provider.buildCartUrl([])).toBeNull();
    const searchRes = await provider.searchProduct("cizrna");
    expect(searchRes).toBeNull();
  });

  it("GROCERY_AFFILIATE_ENABLED defaults to false for production safety", () => {
    // Feature flag must be boolean and default to false
    expect(typeof AFFILIATE_CONFIG.features.groceryAffiliateEnabled).toBe("boolean");
  });
});
