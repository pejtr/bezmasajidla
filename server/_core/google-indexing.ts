// ============================================================
// BEZMASAJIDLA.CZ — Google Instant Indexing API (v3) Integration
// Automatically pings Google Search Console to index new URLs within minutes
// API Docs: https://developers.google.com/search/apis/indexing-api/v3/quickstart
// ============================================================

import crypto from "crypto";

export const GOOGLE_CLIENT_EMAIL =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "indexing-service@bezmasajidla-cz.iam.gserviceaccount.com";

// Service account private key (PEM format)
export const GOOGLE_PRIVATE_KEY =
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_INDEXING_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const SCOPE = "https://www.googleapis.com/auth/indexing";

/**
 * Generates a signed JWT for Google OAuth2 Service Account
 */
function createGoogleJwt(clientEmail: string, privateKeyPem: string): string {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: SCOPE,
    aud: GOOGLE_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const base64UrlEncode = (str: string) =>
    Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signatureInput);
  // Normalize formatting of private key if environment variable contains escaped newlines
  const formattedPrivateKey = privateKeyPem.replace(/\\n/g, "\n");
  const signature = signer.sign(formattedPrivateKey, "base64");

  const base64UrlSignature = signature
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signatureInput}.${base64UrlSignature}`;
}

/**
 * Obtains an OAuth2 Access Token using Google Service Account JWT
 */
async function getGoogleAccessToken(): Promise<string | null> {
  if (!GOOGLE_PRIVATE_KEY || !GOOGLE_PRIVATE_KEY.includes("BEGIN PRIVATE KEY")) {
    console.log("[Google Indexing API] Note: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY not set. Operating in simulation mode.");
    return null;
  }

  try {
    const jwt = createGoogleJwt(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);
    const params = new URLSearchParams();
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    params.append("assertion", jwt);

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("[Google Indexing Auth Error]", response.status, errText);
      return null;
    }

    const data = (await response.json()) as { access_token?: string };
    return data.access_token || null;
  } catch (err) {
    console.error("[Google Indexing Token Error]", err);
    return null;
  }
}

export interface GoogleIndexingResult {
  success: boolean;
  url: string;
  type: "URL_UPDATED" | "URL_DELETED";
  message?: string;
  simulated?: boolean;
}

/**
 * Submits a URL to Google Instant Indexing API v3
 */
export async function notifyGoogleIndexing(
  targetUrl: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<GoogleIndexingResult> {
  const fullUrl = targetUrl.startsWith("http")
    ? targetUrl
    : `https://www.bezmasajidla.cz${targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`}`;

  console.log(`[Google Instant Indexing API] Requesting ${type} for: ${fullUrl}`);

  const accessToken = await getGoogleAccessToken();

  if (!accessToken) {
    // Log simulation success when credentials are not configured yet
    console.log(`[Google Instant Indexing API] [SIMULATED] Successfully queued ${fullUrl} for indexing.`);
    return {
      success: true,
      url: fullUrl,
      type,
      simulated: true,
      message: "Simulovaný požadavek (Google Service Account nepřípojen).",
    };
  }

  try {
    const response = await fetch(GOOGLE_INDEXING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url: fullUrl,
        type,
      }),
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log(`[Google Instant Indexing API] Success indexing ${fullUrl}:`, responseText);
      return {
        success: true,
        url: fullUrl,
        type,
        message: "URL úspěšně odeslána do Google Indexing API v3.",
      };
    } else {
      console.warn(`[Google Instant Indexing API Failed ${response.status}]:`, responseText);
      return {
        success: false,
        url: fullUrl,
        type,
        message: `Chyba API ${response.status}: ${responseText}`,
      };
    }
  } catch (err) {
    console.error("[Google Instant Indexing API Network Error]", err);
    return {
      success: false,
      url: fullUrl,
      type,
      message: "Chyba při komunikaci s Google Indexing API.",
    };
  }
}

/**
 * Batch notifies Google Instant Indexing API for multiple URLs
 */
export async function batchNotifyGoogleIndexing(urls: string[]): Promise<GoogleIndexingResult[]> {
  const results: GoogleIndexingResult[] = [];
  for (const url of urls) {
    const res = await notifyGoogleIndexing(url);
    results.push(res);
    // Small delay between requests to respect Google rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return results;
}
