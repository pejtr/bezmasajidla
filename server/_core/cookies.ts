import type { CookieOptions, Request } from "express";

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  // Use "none" only for cross-origin requests (OAuth callbacks); "lax" for same-site
  const origin = req.headers.origin;
  const host = req.headers.host;
  const isCrossOrigin = origin && host && !origin.includes(host);

  return {
    httpOnly: true,
    path: "/",
    sameSite: isCrossOrigin ? "none" : "lax",
    secure: isSecureRequest(req),
  };
}
