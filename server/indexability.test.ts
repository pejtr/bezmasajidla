import { describe, expect, it, vi } from "vitest";
import { redirectMiddleware } from "./_core/redirect";
import { injectMetaTags } from "./_core/seo";

function createResponseMock() {
  const response = {
    status: vi.fn(),
    set: vi.fn(),
    type: vi.fn(),
    send: vi.fn(),
    redirect: vi.fn(),
  };

  response.status.mockReturnValue(response);
  response.set.mockReturnValue(response);
  response.type.mockReturnValue(response);
  response.send.mockReturnValue(response);
  response.redirect.mockReturnValue(response);
  return response;
}

describe("indexability controls", () => {
  it.each(["/$", "/user.v1.UserPublicService/WebdevInsufficientBalanceNotify"])(
    "returns 410 and noindex for garbage URL %s",
    path => {
      const response = createResponseMock();
      const next = vi.fn();

      redirectMiddleware(
        {
          headers: { host: "www.bezmasajidla.cz" },
          originalUrl: path,
          url: path,
        } as never,
        response as never,
        next
      );

      expect(response.status).toHaveBeenCalledWith(410);
      expect(response.set).toHaveBeenCalledWith(
        expect.objectContaining({ "X-Robots-Tag": "noindex, nofollow" })
      );
      expect(next).not.toHaveBeenCalled();
    }
  );

  it("canonicalizes and excludes restaurant facets", async () => {
    const html = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/restaurace?district=Hole%C5%A1ovice"
    );

    expect(html).toContain(
      '<link rel="canonical" href="https://www.bezmasajidla.cz/restaurace"'
    );
    expect(html).toContain('<meta name="robots" content="noindex, nofollow"');
  });

  it("canonicalizes and excludes dietary recipe facets", async () => {
    const html = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/recepty?dietary=bezlepkove"
    );

    expect(html).toContain(
      '<link rel="canonical" href="https://www.bezmasajidla.cz/recepty"'
    );
    expect(html).toContain('<meta name="robots" content="noindex, nofollow"');
  });

  it("keeps curated recipe categories indexable", async () => {
    const html = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/recepty?category=Pol%C3%A9vky"
    );

    expect(html).toContain("Polévky | Bezmasé recepty");
    expect(html).toContain(
      '<link rel="canonical" href="https://www.bezmasajidla.cz/recepty?category=Pol%C3%A9vky"'
    );
    expect(html).toContain('<meta name="robots" content="index, follow"');
  });

  it("renders unique server metadata for detail pages", async () => {
    const restaurant = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/restaurace/strecha"
    );
    const recipe = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/recepty/cizrnove-curry"
    );
    const article = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/blog/veganske-restaurace-pro-deti-praha"
    );
    const restoredTeaHouse = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/restaurace/cajovna-peklo-nebe-raj"
    );

    expect(restaurant).toContain("Střecha | Veganská restaurace Praha");
    expect(recipe).toContain("Cizrnové curry s kokosovým mlékem");
    expect(article).toContain("Veganské restaurace v Praze vhodné pro rodiny");
    expect(restoredTeaHouse).toContain(
      "Čajovna Peklo, nebe, ráj | Vegan-friendly restaurace Praha"
    );
  });

  it("renders metadata for new high-intent SEO pillar pages", async () => {
    const quickDinners = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/recepty/rychle-bezmase-vecere"
    );
    const glutenFree = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/recepty/bezlepkove-recepty"
    );
    const veganLunch = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/restaurace/vegansky-obed-praha"
    );

    const mealPlanner = await injectMetaTags(
      "<html><head><title>Fallback</title></head><body></body></html>",
      "/tydenni-planovac-receptu"
    );

    expect(quickDinners).toContain("Rychlé bezmasé večeře do 20 minut");
    expect(glutenFree).toContain("Bezlepkové recepty bez masa");
    expect(veganLunch).toContain("Kam na veganský oběd v Praze");
    expect(mealPlanner).toContain("Týdenní Bezmasý Jídelníček");
  });
});
