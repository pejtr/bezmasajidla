// ============================================================
// BEZMASAJIDLA.CZ — Brevo Integration Module (formerly Sendinblue)
// Contacts, Newsletter Automation, Transactional Emails & Lead Magnets
// ============================================================

export const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_API_URL = "https://api.brevo.com/v3";

/**
 * Add or update contact in Brevo newsletter list
 */
export async function subscribeToBrevo(opts: {
  email: string;
  name?: string;
  source?: string;
  listIds?: number[];
}): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: opts.email,
        updateEnabled: true,
        attributes: {
          FIRSTNAME: opts.name || "",
          SOURCE: opts.source || "bezmasajidla.cz",
        },
        ...(opts.listIds && opts.listIds.length > 0 ? { listIds: opts.listIds } : {}),
      }),
    });

    if (response.ok || response.status === 204 || response.status === 201) {
      return { success: true };
    }

    const errorData = (await response.json()) as { message?: string; code?: string };
    // Duplicate contact is considered success with updated fields
    if (errorData.code === "duplicate_parameter") {
      return { success: true };
    }

    console.warn("[Brevo Subscription Error]", errorData);
    return { success: false, message: errorData.message || "Chyba při komunikaci s Brevo API." };
  } catch (err) {
    console.error("[Brevo Network Error]", err);
    return { success: false, message: "Nepodařilo se připojit k mailing službě." };
  }
}

/**
 * Send transactional email via Brevo SMTP API
 */
export async function sendBrevoEmail(opts: {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  senderName?: string;
  senderEmail?: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: opts.senderName || "Bezmasá Jídla",
          email: opts.senderEmail || "info@bezmasajidla.cz",
        },
        to: [
          {
            email: opts.toEmail,
            name: opts.toName || opts.toEmail,
          },
        ],
        subject: opts.subject,
        htmlContent: opts.htmlContent,
      }),
    });

    return response.ok;
  } catch (err) {
    console.error("[Brevo Send Email Error]", err);
    return false;
  }
}
