import { creerCheckoutFaldridge, ErreurFaldridge } from "@/lib/faldridge";

/* Commande WooCommerce, encaissée par Faldridge. Les billets ne sont pas
   des produits du catalogue : ce sont des lignes de frais, au tarif du site. */

export class ErreurWoo extends Error {}

function base() {
  return (process.env.WC_URL || "").replace(/\/+$/, "");
}

function cle() {
  return (process.env.WC_CONSUMER_KEY || "").trim();
}

function secret() {
  return (process.env.WC_CONSUMER_SECRET || "").trim();
}

function moyen() {
  return (process.env.WC_PAYMENT_METHOD || "faldridge").trim() || "faldridge";
}

function estFaldridge(method = moyen()) {
  return method === "faldridge" || method === "byteqs" || method === "heypay";
}

export function wooPret() {
  return Boolean(base() && cle() && secret());
}

function url(chemin) {
  const u = new URL(`${base()}/wp-json/wc/v3${chemin.startsWith("/") ? chemin : `/${chemin}`}`);
  u.searchParams.set("consumer_key", cle());
  u.searchParams.set("consumer_secret", secret());
  return u.toString();
}

async function wcFetch(chemin, init) {
  if (!wooPret()) {
    throw new ErreurWoo("Configuration WooCommerce manquante.");
  }
  const res = await fetch(url(chemin), {
    ...init,
    headers: {
      Authorization: "Basic " + Buffer.from(`${cle()}:${secret()}`).toString("base64"),
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });
  if (!res.ok) {
    const corps = await res.text().catch(() => "");
    console.error("[woo]", res.status, chemin, corps.slice(0, 240));
    throw new ErreurWoo(`WooCommerce ${res.status}`);
  }
  return res.json();
}

export function getCommande(id) {
  return wcFetch(`/orders/${id}`);
}

export function majCommandeWoo(id, donnees) {
  return wcFetch(`/orders/${id}`, { method: "PUT", body: JSON.stringify(donnees) });
}

export async function creerCommandePaiement(commande) {
  const attendu = (commande.totalCents / 100).toFixed(2);
  const wc = await wcFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
      set_paid: false,
      status: "pending",
      payment_method: moyen(),
      payment_method_title: estFaldridge() ? "Faldridge" : "Carte bancaire",
      currency: "EUR",
      billing: {
        first_name: "Client",
        last_name: "Billetterie",
        email: commande.email,
        country: "FR"
      },
      fee_lines: commande.lignes.map((l) => ({
        name: `${l.nom} — ${l.qte} place${l.qte > 1 ? "s" : ""}`,
        amount: (l.totalCents / 100).toFixed(2),
        total: (l.totalCents / 100).toFixed(2),
        tax_status: "none",
        meta_data: [
          { key: "_nba_categorie", value: l.id },
          { key: "_nba_quantite", value: String(l.qte) },
          { key: "_nba_prix_unitaire_cents", value: String(l.prixCents) }
        ]
      })),
      meta_data: [
        { key: "_origine", value: "nba-paris-game" },
        { key: "_nba_langue", value: commande.langue === "en" ? "en" : "fr" },
        { key: "_nba_lignes", value: JSON.stringify(commande.lignes) }
      ]
    })
  });

  if (Number(wc.total).toFixed(2) !== attendu) {
    throw new ErreurWoo(`Total incorrect (${wc.total}, attendu ${attendu})`);
  }

  const reference = `NBA-${wc.id}`;
  if (!estFaldridge()) {
    if (!wc.payment_url) throw new ErreurWoo("Pas d'adresse de paiement.");
    return { id: wc.id, numero: reference, total: wc.total, urlPaiement: wc.payment_url, orderKey: wc.order_key };
  }

  try {
    const session = await creerCheckoutFaldridge({
      reference,
      email: commande.email,
      currency: wc.currency || "EUR",
      orderKey: wc.order_key,
      wooId: wc.id,
      lignes: commande.lignes.map((l) => ({
        name: l.nom,
        amountInCents: l.prixCents,
        quantity: l.qte
      }))
    });
    await majCommandeWoo(wc.id, {
      meta_data: [
        { key: "_faldridge_status", value: "unpaid" },
        { key: "_faldridge_reference", value: reference },
        { key: "_faldridge_checkout_url", value: session.checkoutUrl },
        ...(session.id ? [{ key: "_faldridge_session_id", value: session.id }] : [])
      ]
    });
    return { id: wc.id, numero: reference, total: wc.total, urlPaiement: session.checkoutUrl, orderKey: wc.order_key };
  } catch (e) {
    const detail = e instanceof ErreurFaldridge ? e.message : "session";
    throw new ErreurWoo(`Faldridge : ${detail}`);
  }
}
