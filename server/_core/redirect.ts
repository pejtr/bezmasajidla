import type { Request, Response, NextFunction } from "express";

const GONE_PATHS = new Set([
  "/$",
  "/user.v1.UserPublicService/WebdevInsufficientBalanceNotify",
]);

export function redirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const rawHost = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.headers.host || "";
  const requestHost = rawHost
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  let targetHost = requestHost;
  let targetUrl = req.originalUrl || req.url;
  let shouldRedirect = false;

  const pathname = targetUrl.split("?")[0].replace(/\/+$/, "") || "/";
  if (GONE_PATHS.has(pathname)) {
    return res
      .status(410)
      .set({
        "Cache-Control": "public, max-age=3600",
        "X-Robots-Tag": "noindex, nofollow",
      })
      .type("text/plain")
      .send("Tato URL již neexistuje.");
  }

  if (requestHost === "bezmasajidla.cz") {
    targetHost = "www.bezmasajidla.cz";
    shouldRedirect = true;
  }

  if (targetUrl.startsWith("/recepty/veganska-svickova")) {
    targetUrl = targetUrl.replace(
      "/recepty/veganska-svickova",
      "/recepty/svickova-bez-masa"
    );
    shouldRedirect = true;
  }
  if (targetUrl.startsWith("/recepty/vegansky-gulas-knedliky")) {
    targetUrl = targetUrl.replace(
      "/recepty/vegansky-gulas-knedliky",
      "/recepty/gulas-bez-masa"
    );
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    const proto =
      targetHost === "localhost" || targetHost?.includes(":")
        ? "http"
        : "https";
    const redirectHost =
      targetHost === "localhost" || targetHost?.includes(":")
        ? ""
        : `${proto}://${targetHost}`;
    return res.redirect(301, `${redirectHost}${targetUrl}`);
  }
  next();
}
