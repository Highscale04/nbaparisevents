function parseMailFrom(raw) {
  const match = String(raw || "").match(/^(.*)<([^>]+)>\s*$/);
  if (match) {
    const name = match[1].trim().replace(/^["']|["']$/g, "");
    return { email: match[2].trim(), name: name || undefined };
  }
  return { email: String(raw || "").trim() };
}

function texteDepuisHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function mailContact() {
  return (process.env.CONTACT_EMAIL || "mail@nbaeventsparis.com").trim();
}

export async function envoyerBrevo({
  to,
  subject,
  html,
  kind,
  orderId,
  attachment,
  idempotencyKey
}) {
  const apiKey = (process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || "").trim();
  const fromRaw = (
    process.env.MAIL_FROM || `NBA Official <${mailContact()}>`
  ).trim();
  if (!apiKey || !fromRaw) {
    throw new Error("BREVO_API_KEY et MAIL_FROM doivent être configurés.");
  }
  const sender = parseMailFrom(fromRaw);
  if (!sender.email.includes("@")) throw new Error("MAIL_FROM n'est pas une adresse e-mail valide.");

  const contact = mailContact();
  const body = {
    sender: sender.name ? { email: sender.email, name: sender.name } : { email: sender.email },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: texteDepuisHtml(html),
    tags: [kind, "transactional", "nba"],
    headers: { "Idempotency-Key": idempotencyKey }
  };
  if (contact.includes("@")) {
    body.replyTo = { email: contact, name: "NBA Official" };
  }
  if (orderId) body.params = { order_id: String(orderId) };
  if (attachment?.length) body.attachment = attachment;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(body)
  });
  const result = await response.json().catch(() => ({}));
  if (response.ok || response.status === 201 || response.status === 202) return;
  const message = [result.message, result.detail, result.error].find((item) => typeof item === "string");
  throw new Error(`Brevo ${response.status}: ${message || "échec de l'envoi"}`);
}
