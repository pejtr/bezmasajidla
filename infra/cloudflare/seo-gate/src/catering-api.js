[Reading 264 lines from start (total: 264 lines, 0 remaining)]

const SIGNATURE_PRICE = 1190;
const MIN_GUESTS = 12;
const MAX_SIGNATURE_GUESTS = 80;
const MAX_ACCEPTED_GUESTS = 250;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clean(value, max = 256) {
  return String(value ?? "").trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 2000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sendBrevo(env, message) {
  if (!env.BREVO_API_KEY) {
    return { status: "not_configured", messageId: null };
  }

  const senderEmail = env.BREVO_SENDER_EMAIL || "info@bezmasajidla.cz";
  const senderName = env.BREVO_SENDER_NAME || "BezmasáJídla Catering";
  const body = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: message.toEmail, name: message.toName || message.toEmail }],
    subject: message.subject,
    htmlContent: message.htmlContent,
    textContent: message.textContent,
  };

  if (env.CATERING_NOTIFICATION_EMAIL) {
    body.replyTo = {
      email: env.CATERING_NOTIFICATION_EMAIL,
      name: "BezmasáJídla Catering",
    };
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[catering-mail] Brevo rejected message", response.status);
      return { status: "failed", messageId: null };
    }

    return {
      status: "sent",
      messageId: result.messageId ? String(result.messageId) : null,
    };
  } catch (error) {
    console.error("[catering-mail] Brevo network failure", error);
    return { status: "failed", messageId: null };
  }
}

function customerMailHtml(lead) {
  const estimate = lead.estimatedRevenue == null
    ? "Individuální kalkulace"
    : `${lead.estimatedRevenue.toLocaleString("cs-CZ")} Kč bez DPH`;
  return `<!doctype html>
<html lang="cs"><body style="font-family:Arial,sans-serif;color:#1c2923">
<h2>Poptávka ${escapeHtml(lead.leadCode)} byla přijata</h2>
<p>Děkujeme, ${escapeHtml(lead.contactPerson || lead.name)}. Poptávku jsme bezpečně uložili.</p>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
<tr><td><strong>Balíček</strong></td><td>Matouš Signature</td></tr>
<tr><td><strong>Typ akce</strong></td><td>${escapeHtml(lead.eventType)}</td></tr>
<tr><td><strong>Hosté</strong></td><td>${lead.guestCount}</td></tr>
<tr><td><strong>Datum</strong></td><td>${escapeHtml(lead.eventDate || "Dle dohody")}</td></tr>
<tr><td><strong>Čas</strong></td><td>${escapeHtml(lead.eventTime || "Dle dohody")}</td></tr>
<tr><td><strong>Místo</strong></td><td>${escapeHtml(lead.location || "Praha a okolí")}</td></tr>
<tr><td><strong>Orientační odhad</strong></td><td>${estimate}</td></tr>
</table>
<p>Do 24 hodin ověříme kapacitu a připravíme konkrétní nabídku. Toto není potvrzení rezervace termínu.</p>
<p>BezmasáJídla Catering</p>
</body></html>`;
}
function customerMailText(lead) {
  const estimate = lead.estimatedRevenue == null
    ? "Individuální kalkulace"
    : `${lead.estimatedRevenue.toLocaleString("cs-CZ")} Kč bez DPH`;
  return [
    `Poptávka ${lead.leadCode} byla přijata.`,
    `Matouš Signature · ${lead.eventType} · ${lead.guestCount} hostů`,
    `Datum: ${lead.eventDate || "Dle dohody"} · Čas: ${lead.eventTime || "Dle dohody"}`,
    `Místo: ${lead.location || "Praha a okolí"}`,
    `Orientační odhad: ${estimate}`,
    "",
    "Do 24 hodin ověříme kapacitu a připravíme konkrétní nabídku.",
    "Toto není potvrzení rezervace termínu.",
  ].join("\n");
}

async function notifyInternal(env, lead) {
  const target = env.CATERING_NOTIFICATION_EMAIL;
  if (!target || !env.BREVO_API_KEY) return;

  await sendBrevo(env, {
    toEmail: target,
    toName: "Catering",
    subject: `Nová poptávka ${lead.leadCode} · ${lead.guestCount} hostů`,
    htmlContent: `<p><strong>${escapeHtml(lead.leadCode)}</strong></p><p>${escapeHtml(lead.name)} · ${escapeHtml(lead.email)} · ${escapeHtml(lead.phone)}</p><p>${escapeHtml(lead.eventType)} · ${lead.guestCount} hostů · ${escapeHtml(lead.eventDate || "Dle dohody")}</p>`,
    textContent: `${lead.leadCode} | ${lead.name} | ${lead.email} | ${lead.phone} | ${lead.eventType} | ${lead.guestCount} hostů`,
  });
}
export async function handleCateringInquiry(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!env.CATERING_DB) {
    return json({ error: "Catering lead store is not configured." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Neplatný JSON payload." }, 400);
  }

  if (clean(body.website_hp, 32)) {
    return json({ success: true, leadCode: "ACCEPTED", mailStatus: "not_configured" });
  }

  const name = clean(body.name, 128);
  const contactPerson = clean(body.contactPerson || body.name, 128);
  const companyName = clean(body.companyName, 128);
  const ico = clean(body.ico, 32);
  const email = clean(body.email, 160).toLowerCase();
  const phone = clean(body.phone, 48);
  const packageId = clean(body.packageId, 64);
  const guestCount = Number.parseInt(body.guestCount, 10);
  if (!name || !email || !phone || packageId !== "signature" || !Number.isFinite(guestCount)) {
    return json({ error: "Vyplňte prosím povinná pole poptávky." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Zadejte platný e-mail." }, 400);
  }
  if (guestCount < MIN_GUESTS || guestCount > MAX_ACCEPTED_GUESTS) {
    return json({ error: `Signature poptávka podporuje ${MIN_GUESTS}–${MAX_ACCEPTED_GUESTS} hostů.` }, 400);
  }

  const forwarded = request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") || "unknown";
  const ipHash = await sha256(forwarded.split(",")[0].trim());
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const recent = await env.CATERING_DB.prepare(
    "SELECT COUNT(*) AS count FROM catering_leads WHERE ip_hash = ? AND created_at >= ?"
  ).bind(ipHash, since).first();
  if (Number(recent?.count || 0) >= 5) {
    return json({ error: "Příliš mnoho poptávek. Zkuste to prosím za 15 minut." }, 429);
  }

  const createdAt = new Date().toISOString();
  const tempCode = `PENDING-${crypto.randomUUID()}`;
  const estimatedRevenue = guestCount <= MAX_SIGNATURE_GUESTS
    ? guestCount * SIGNATURE_PRICE
    : null;
  const lead = {
    leadCode: tempCode,
    name,
    companyName,
    ico,
    contactPerson,
    email,
    phone,
    eventType: clean(body.eventType, 96),
    guestCount,
    eventDate: clean(body.eventDate || body.date, 64),
    eventTime: clean(body.eventTime, 64),
    location: clean(body.location, 256),
    venueType: clean(body.venueType, 160),
    dietNotes: clean(body.dietNotes, 1000),
    addons: Array.isArray(body.addons) ? body.addons.slice(0, 16).map(v => clean(v, 96)) : [],
    notes: clean(body.notes, 2000),
    packageId,
    packageName: "MATOUŠ SIGNATURE",
    estimatedRevenue,
    currency: "CZK",
    isTest: Boolean(body.isTest),
    utmSource: clean(body.utmSource, 128),
    utmMedium: clean(body.utmMedium, 128),
    utmCampaign: clean(body.utmCampaign, 256),
    gclid: clean(body.gclid, 256),
    gbraid: clean(body.gbraid, 256),
    wbraid: clean(body.wbraid, 256),
  };

  const result = await env.CATERING_DB.prepare(
    `INSERT INTO catering_leads (
      lead_code,status,is_test,created_at,ip_hash,name,company_name,ico,contact_person,
      email,phone,event_type,guest_count,event_date,event_time,location,venue_type,
      diet_notes,addons_json,notes,package_id,package_name,estimated_revenue,currency,
      utm_source,utm_medium,utm_campaign,gclid,gbraid,wbraid,mail_status
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    lead.leadCode, "LEAD", lead.isTest ? 1 : 0, createdAt, ipHash,
    lead.name, lead.companyName, lead.ico, lead.contactPerson, lead.email, lead.phone,
    lead.eventType, lead.guestCount, lead.eventDate, lead.eventTime, lead.location,
    lead.venueType, lead.dietNotes, JSON.stringify(lead.addons), lead.notes,
    lead.packageId, lead.packageName, lead.estimatedRevenue, lead.currency,
    lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.gclid, lead.gbraid,
    lead.wbraid, "pending"
  ).run();

  const id = Number(result.meta?.last_row_id || 0);
  const leadCode = `C-${new Date(createdAt).getUTCFullYear()}-${String(id).padStart(4, "0")}`;
  lead.leadCode = leadCode;

  await env.CATERING_DB.prepare(
    "UPDATE catering_leads SET lead_code = ? WHERE id = ?"
  ).bind(leadCode, id).run();

  const mail = await sendBrevo(env, {
    toEmail: email,
    toName: contactPerson || name,
    subject: `Poptávka ${leadCode} přijata | Matouš Signature`,
    htmlContent: customerMailHtml(lead),
    textContent: customerMailText(lead),
  });
  await env.CATERING_DB.prepare(
    "UPDATE catering_leads SET mail_status = ?, mail_message_id = ? WHERE id = ?"
  ).bind(mail.status, mail.messageId, id).run();

  if (!lead.isTest) {
    await notifyInternal(env, lead);
  }

  return json({
    success: true,
    leadCode,
    status: "LEAD",
    estimatedRevenue,
    currency: "CZK",
    mailStatus: mail.status,
  }, 201);
}

[executed on device: DESKTOP-ALZABOX (7e869a05-3e3d-4dd2-adbd-ebf450ac342d)]