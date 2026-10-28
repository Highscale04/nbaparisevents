/**
 * 1) Recopie le stock lib/data.js sur les variations Woo.
 * 2) Désactive les e-mails automatiques WooCommerce.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { STOCK, epuise } from "../lib/data.js";

function chargerEnv() {
  for (const nom of [".dev.vars", ".env.local"]) {
    const fichier = resolve(process.cwd(), nom);
    if (!existsSync(fichier)) continue;
    for (const ligne of readFileSync(fichier, "utf8").split(/\r?\n/)) {
      const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

chargerEnv();

const WC_URL = (process.env.WC_URL ?? "").replace(/\/+$/, "");
const WC_KEY = process.env.WC_CONSUMER_KEY ?? "";
const WC_SECRET = process.env.WC_CONSUMER_SECRET ?? "";
const auth = "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
const SLUG = "pelicans-spurs-14-01-2027";

async function wc(chemin, init) {
  const res = await fetch(`${WC_URL}/wp-json/wc/v3${chemin}`, {
    ...init,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const texte = await res.text();
  if (!res.ok) throw new Error(`Woo ${res.status} ${chemin}: ${texte.slice(0, 400)}`);
  return texte ? JSON.parse(texte) : {};
}

async function stock() {
  const produits = await wc(`/products?sku=${encodeURIComponent(SLUG)}&per_page=10`);
  const produit = produits.find((p) => p.sku === SLUG);
  if (!produit) throw new Error("produit introuvable");
  const variations = await wc(`/products/${produit.id}/variations?per_page=100`);
  for (const v of variations) {
    const id = String(v.sku || "").split(":")[1];
    if (!id || !(id in STOCK)) continue;
    const qte = STOCK[id] || 0;
    const vide = epuise(id) || qte < 1;
    const maj = await wc(`/products/${produit.id}/variations/${v.id}`, {
      method: "PUT",
      body: JSON.stringify({
        manage_stock: true,
        stock_quantity: qte,
        stock_status: vide ? "outofstock" : "instock",
      }),
    });
    console.log("stock", id, maj.stock_quantity, maj.stock_status);
  }
}

const EMAILS = [
  "new_order",
  "cancelled_order",
  "failed_order",
  "customer_on_hold_order",
  "customer_processing_order",
  "customer_completed_order",
  "customer_refunded_order",
  "customer_partially_refunded_order",
  "customer_invoice",
  "customer_note",
  "customer_reset_password",
  "customer_new_account",
  "customer_failed_order",
  "customer_cancelled_order",
];

async function couperMails() {
  try {
    const groupe = await wc("/settings/email");
    if (Array.isArray(groupe)) {
      for (const s of groupe) {
        if (s.id && /enabled/i.test(s.id) && s.value !== "no") {
          await wc(`/settings/email/${s.id}`, {
            method: "PUT",
            body: JSON.stringify({ value: "no" }),
          });
          console.log("email setting", s.id, "off");
        }
      }
    }
  } catch (e) {
    console.log("settings/email", e instanceof Error ? e.message : e);
  }

  for (const id of EMAILS) {
    const groupe = `email_${id}`;
    try {
      const champs = await wc(`/settings/${groupe}`);
      const enabled = Array.isArray(champs) ? champs.find((c) => c.id === "enabled") : null;
      if (!enabled) {
        console.log("pas de groupe", groupe);
        continue;
      }
      if (enabled.value === "no") {
        console.log("déjà off", id);
        continue;
      }
      await wc(`/settings/${groupe}/enabled`, {
        method: "PUT",
        body: JSON.stringify({ value: "no" }),
      });
      console.log("off", id);
    } catch (e) {
      console.log("skip", id, e instanceof Error ? e.message.slice(0, 120) : e);
    }
  }
}

await stock();
await couperMails();
console.log("ok");
