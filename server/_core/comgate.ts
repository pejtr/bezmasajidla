// ============================================================
// BEZMASAJIDLA.CZ — Comgate Payment Gateway Integration Module
// Support for Cards, Czech Bank Buttons, QR Payments, Apple Pay & Google Pay
// API Docs: https://help.comgate.cz/docs/api-protokol
// ============================================================

export const COMGATE_MERCHANT_ID = process.env.COMGATE_MERCHANT_ID || "bezmasajidla_cz";
export const COMGATE_SECRET = process.env.COMGATE_SECRET || "bezmasajidla_secret_2026";
export const COMGATE_TEST_MODE = process.env.NODE_ENV !== "production" || process.env.COMGATE_TEST === "true";

const COMGATE_API_URL = "https://payments.comgate.cz/v1.0";

export interface CreatePaymentParams {
  orderId: string;
  priceCzk: number; // in CZK, e.g. 490 for 490 CZK
  label: string;
  payerEmail: string;
  payerName?: string;
  redirectSuccessUrl?: string;
  redirectCancelUrl?: string;
}

export interface PaymentCreateResult {
  success: boolean;
  transId?: string;
  redirectUrl?: string;
  message?: string;
}

/**
 * Creates a payment via Comgate API v1.0
 */
export async function createComgatePayment(
  params: CreatePaymentParams
): Promise<PaymentCreateResult> {
  try {
    const successUrl =
      params.redirectSuccessUrl ||
      `https://www.bezmasajidla.cz/platba/uspech?orderId=${encodeURIComponent(params.orderId)}`;
    const cancelUrl =
      params.redirectCancelUrl ||
      `https://www.bezmasajidla.cz/platba/zruseno?orderId=${encodeURIComponent(params.orderId)}`;

    // Price in haléře (cents): 490 CZK -> 49000
    const priceInCents = Math.round(params.priceCzk * 100);

    const formData = new URLSearchParams();
    formData.append("merchant", COMGATE_MERCHANT_ID);
    formData.append("secret", COMGATE_SECRET);
    formData.append("price", priceInCents.toString());
    formData.append("curr", "CZK");
    formData.append("label", params.label);
    formData.append("refId", params.orderId);
    formData.append("email", params.payerEmail);
    formData.append("method", "ALL"); // Allow Card, QR, Bank Buttons, Apple/Google Pay
    formData.append("prepareOnly", "true");
    formData.append("test", COMGATE_TEST_MODE ? "true" : "false");
    formData.append("urlPaid", successUrl);
    formData.append("urlCancelled", cancelUrl);
    formData.append("urlPending", successUrl);

    const response = await fetch(`${COMGATE_API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    const resultParams = new URLSearchParams(responseText);

    const code = resultParams.get("code");
    const message = resultParams.get("message");
    const transId = resultParams.get("transId");
    const redirectUrl = resultParams.get("redirect");

    if (code === "0" && redirectUrl) {
      return {
        success: true,
        transId: transId || undefined,
        redirectUrl,
      };
    }

    console.warn("[Comgate Payment Error]", { code, message, responseText });
    return {
      success: false,
      message: message || "Chyba při vytváření platby v bráně Comgate.",
    };
  } catch (err) {
    console.error("[Comgate Network Error]", err);
    return {
      success: false,
      message: "Nepodařilo se navázat spojení s platební bránou.",
    };
  }
}

/**
 * Verifies and parses Comgate webhook notification (HTTP POST form-data)
 */
export function parseComgateWebhook(body: Record<string, string>): {
  isValid: boolean;
  orderId: string;
  transId: string;
  status: "PAID" | "CANCELLED" | "PENDING" | "UNKNOWN";
  priceCzk: number;
  email: string;
} {
  const secret = body.secret;
  const merchant = body.merchant;
  const statusRaw = body.status;
  const refId = body.refId || "";
  const transId = body.transId || "";
  const priceRaw = body.price || "0";
  const email = body.email || "";

  // Secret & merchant verification
  const isValid = secret === COMGATE_SECRET && merchant === COMGATE_MERCHANT_ID;

  let status: "PAID" | "CANCELLED" | "PENDING" | "UNKNOWN" = "UNKNOWN";
  if (statusRaw === "PAID") status = "PAID";
  else if (statusRaw === "CANCELLED") status = "CANCELLED";
  else if (statusRaw === "PENDING") status = "PENDING";

  const priceCzk = parseFloat(priceRaw) / 100;

  return {
    isValid,
    orderId: refId,
    transId,
    status,
    priceCzk,
    email,
  };
}
