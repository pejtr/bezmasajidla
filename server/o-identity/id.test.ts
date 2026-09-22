import { describe, expect, it } from "vitest";
import { createDomainSubjectId, createUuidV7 } from "./id";

describe("o_ID identifiers", () => {
  it("creates RFC 9562 UUIDv7-shaped root identifiers", () => {
    const id = createUuidV7(1_795_000_000_000);
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("encodes the supplied timestamp in the first 48 bits", () => {
    const timestamp = 1_795_000_000_000;
    const id = createUuidV7(timestamp);
    const encoded = Number.parseInt(id.replaceAll("-", "").slice(0, 12), 16);
    expect(encoded).toBe(timestamp);
  });

  it("creates pairwise veg subject identifiers without exposing an o_ID prefix", () => {
    const subject = createDomainSubjectId("veg");
    expect(subject).toMatch(
      /^veg_[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("rejects timestamps outside the UUIDv7 48-bit range", () => {
    expect(() => createUuidV7(Number.MAX_SAFE_INTEGER)).toThrow(RangeError);
  });
});
