/* Faldridge (HeyPay) — page de paiement hébergée, comme les autres billetteries.
   POST {FALDRIDGE_CHECKOUT_ORIGIN}/api/hosted-checkout
   Authorization: Bearer clé secrète, côté serveur uniquement. */

export class ErreurFaldridge extends Error {}

function origine() {
  return (process.env.FALDRIDGE_CHECKOUT_ORIGIN || process.env.BYTEQS_CHECKOUT_ORIGIN || "").replace(/\/+$/, "");
}

function secret() {
  return (process.env.FALDRIDGE_SECRET_KEY || process.env.BYTEQS_SECRET_KEY || "").trim();
}

function publiable() {
  return (
    process.env.FALDRIDGE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_FALDRIDGE_PUBLISHABLE_KEY ||
    process.env.BYTEQS_PUBLISHABLE_KEY ||
    ""
  ).trim();
}

export function secretWebhook() {
  return (process.env.FALDRIDGE_WEBHOOK_SECRET || process.env.BYTEQS_WEBHOOK_SECRET || secret()).trim();
}

export function clesSignature() {
  return [...new Set([secretWebhook(), secret(), publiable()].filter(Boolean))];
}

export function siteUrl() {
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.nbaeventsparis.com").replace(/\/+$/, "");
}

export async function creerCheckoutFaldridge(input) {
  const cle = secret() || publiable();
  if (!cle) throw new ErreurFaldridge("FALDRIDGE_SECRET_KEY manquante.");
  if (!origine()) throw new ErreurFaldridge("FALDRIDGE_CHECKOUT_ORIGIN manquante.");
  const site = siteUrl();
  const email = (input.email || "").trim().toLowerCase();
  const corps = {
    successUrl: `${site}/confirmation?commande=${encodeURIComponent(input.reference)}&key=${encodeURIComponent(input.orderKey)}`,
    cancelUrl: `${site}/panier?paiement=annule`,
    currency: input.currency || "EUR",
    clientReferenceId: input.reference,
    metadata: { wooId: String(input.wooId), reference: input.reference },
    lineItems: input.lignes.map((l) => ({
      name: String(l.name).slice(0, 180),
      amountInCents: l.amountInCents,
      quantity: l.quantity
    }))
  };
  if (email.includes("@") && !email.startsWith("attente@")) corps.customer = { email };
  const premier = await poster(cle, corps, site);
  if (premier) return premier;
  const secours = secret() && publiable() && cle === secret() ? publiable() : "";
  if (secours) {
    const second = await poster(secours, corps, site);
    if (second) return second;
  }
  throw new ErreurFaldridge("Faldridge n'a pas renvoyé de page de paiement.");
}

async function poster(cle, corps, site) {
  let res;
  try {
    res = await fetch(`${origine()}/api/hosted-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cle}`,
        Origin: site,
        Referer: `${site}/`
      },
      body: JSON.stringify(corps),
      cache: "no-store"
    });
  } catch (e) {
    throw new ErreurFaldridge(e instanceof Error ? e.message : "réseau");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || !data.checkoutUrl) {
    if (res.status === 401 || res.status === 403) return null;
    throw new ErreurFaldridge(data?.message || data?.error || `HTTP ${res.status}`);
  }
  const id = data.id || data.checkoutId || data.sessionId || data.session_id || "";
  return { checkoutUrl: data.checkoutUrl, ...(id ? { id } : {}) };
}
