export const INDEXNOW_KEY = "bezmasajidla2026indexnowkey";
const HOST = "www.bezmasajidla.cz";

/**
 * Pings IndexNow endpoints (Bing, Seznam.cz, Yandex) with updated or new URLs
 */
export async function pingIndexNow(urlList: string[]): Promise<boolean> {
  if (!urlList || urlList.length === 0) return false;

  const fullUrls = urlList.map(url =>
    url.startsWith("http") ? url : `https://${HOST}${url.startsWith("/") ? url : `/${url}`}`
  );

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://search.seznam.cz/indexnow",
  ];

  let successCount = 0;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 202) {
        successCount++;
        console.log(`[IndexNow] Successfully notified ${endpoint} for ${fullUrls.length} URLs`);
      } else {
        console.warn(`[IndexNow] ${endpoint} returned status ${response.status}`);
      }
    } catch (err) {
      console.error(`[IndexNow Error] Failed to notify ${endpoint}:`, err);
    }
  }

  return successCount > 0;
}
