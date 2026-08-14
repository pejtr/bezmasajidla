// ============================================================
// BEZMASAJIDLA.CZ — Defensive XML Parser
// Zero external runtime dependencies, handles CDATA, namespaces,
// HTML entities, and malformed tags defensively.
// ============================================================

export function decodeXmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => {
      try {
        return String.fromCharCode(parseInt(code, 10));
      } catch {
        return "";
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
      try {
        return String.fromCharCode(parseInt(code, 16));
      } catch {
        return "";
      }
    });
}

export function stripHtml(html: string): string {
  if (!html) return "";
  const decoded = decodeXmlEntities(html);
  return decoded
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+([.,!?:;])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function parsePrice(priceStr?: string | null): { price?: number; currency: string } {
  if (!priceStr) return { currency: "CZK" };
  const cleaned = priceStr.trim();
  let currency = "CZK";
  if (/EUR|€/i.test(cleaned)) currency = "EUR";
  else if (/USD|\$/i.test(cleaned)) currency = "USD";

  // Replace comma with dot and remove non-numeric chars except digits and dot/minus
  const numericPart = cleaned
    .replace(/\s+/g, "")
    .replace(/CZK|Kč|EUR|€|USD|\$/gi, "")
    .replace(",", ".");

  const match = numericPart.match(/-?\d+(\.\d+)?/);
  if (!match) return { currency };
  const parsed = parseFloat(match[0]);
  return {
    price: isNaN(parsed) ? undefined : Math.round(parsed * 100) / 100,
    currency,
  };
}

/**
 * Extracts inner content of a specific tag from an XML block.
 * Handles both regular `<tag>...</tag>` and namespaced `<g:tag>...</g:tag>`.
 */
export function getTagContent(xmlBlock: string, tagName: string): string | undefined {
  // Regex supporting optional namespace prefix e.g. (g:)?tag
  const escapedTag = tagName.replace(":", "\\:");
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${escapedTag}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${escapedTag}>`,
    "i"
  );
  const match = xmlBlock.match(pattern);
  if (!match) return undefined;
  return decodeXmlEntities(match[1].trim());
}

/**
 * Extracts all occurrences of a specific tag from an XML block.
 */
export function getAllTagContents(xmlBlock: string, tagName: string): string[] {
  const escapedTag = tagName.replace(":", "\\:");
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${escapedTag}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${escapedTag}>`,
    "gi"
  );
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(xmlBlock)) !== null) {
    const val = decodeXmlEntities(match[1].trim());
    if (val) results.push(val);
  }
  return results;
}

/**
 * Extracts list of repeated item blocks (e.g. `<entry>...</entry>` or `<SHOPITEM>...</SHOPITEM>`)
 */
export function extractXmlBlocks(xml: string, blockTagName: string): string[] {
  if (!xml) return [];
  const escapedTag = blockTagName.replace(":", "\\:");
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${escapedTag}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${escapedTag}>`,
    "gi"
  );
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(xml)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}
