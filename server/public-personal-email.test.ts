import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PERSONAL_EMAIL = ["petr.matej", "gmail.com"].join("@");
const ROOT = process.cwd();
const SKIP = new Set([".git", "node_modules", "dist", ".pnpm-store"]);
const TEXT_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".html", ".css", ".txt",
  ".xml", ".yml", ".yaml", ".env", ".example",
]);

function extensionOf(path: string): string {
  const name = path.split("/").pop() ?? "";
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

function collectTextFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectTextFiles(full, out);
      continue;
    }
    if (TEXT_EXTENSIONS.has(extensionOf(full)) || entry === ".env.example") {
      out.push(full);
    }
  }
  return out;
}

describe("public privacy guard", () => {
  it("does not expose the owner's personal email in the current repository", () => {
    const leaks = collectTextFiles(ROOT)
      .filter(file => readFileSync(file, "utf8").toLowerCase().includes(PERSONAL_EMAIL));

    expect(leaks).toEqual([]);
  });
});
