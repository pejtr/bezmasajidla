import { initTRPC, TRPCError } from "@trpc/server";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create();
const buckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(ctx: { req: { ip?: string; socket?: { remoteAddress?: string } } }): string {
  return ctx.req.ip || ctx.req.socket?.remoteAddress || "unknown";
}

export function rateLimitMiddleware(opts: { windowMs: number; max: number; message?: string }) {
  return t.middleware(async ({ ctx, next }) => {
    const key = getClientIp(ctx);
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || now > entry.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > opts.max) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: opts.message || "Příliš mnoho požadavků. Zkuste to prosím znovu za chvíli.",
      });
    }

    return next();
  });
}

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now();
  buckets.forEach((entry, key) => {
    if (now > entry.resetAt) buckets.delete(key);
  });
}, 60_000);
