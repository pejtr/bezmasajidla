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

  const hostHeader = String(req.headers.host || "").toLowerCase().replace(/:\d+$/, "");
  const forwardedHostHeader = String(req.headers["x-forwarded-host"] || "").toLowerCase().replace(/:\d+$/, "");
  const protoHeader = String(req.headers["x-forwarded-proto"] || "").toLowerCase();

  const isNakedDomain = requestHost === "bezmasajidla.cz" || hostHeader === "bezmasajidla.cz" || forwardedHostHeader === "bezmasajidla.cz";
  const isHttp = protoHeader === "http";

  if (isNakedDomain) {
    const fullTarget = `https://www.bezmasajidla.cz${targetUrl}`;
    return res.redirect(301, fullTarget);
  }

  if (shouldRedirect) {
    const proto = targetHost === "localhost" || targetHost?.includes(":") ? "http" : "https";
    const redirectHost = targetHost === "localhost" || targetHost?.includes(":") ? "" : `${proto}://${targetHost}`;
    return res.redirect(301, `${redirectHost}${targetUrl}`);
  }
  next();
}
