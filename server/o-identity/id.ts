import { randomBytes } from "node:crypto";

/**
 * RFC 9562 UUIDv7 generator.
 *
 * We keep o_ID values opaque and server-side only. Domain subject ids are
 * separate random identifiers so an application cannot infer the root o_ID.
 */
export function createUuidV7(now = Date.now()): string {
  if (!Number.isSafeInteger(now) || now < 0 || now > 0xffffffffffff) {
    throw new RangeError("UUIDv7 timestamp must fit in 48 bits");
  }

  const bytes = randomBytes(16);
  let timestamp = BigInt(now);

  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(timestamp & 0xffn);
    timestamp >>= 8n;
  }

  // Version 7.
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // RFC 4122 / RFC 9562 variant 10xx.
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

export function createDomainSubjectId(domain: "veg"): string {
  return `${domain}_${createUuidV7()}`;
}
