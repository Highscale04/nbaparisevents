import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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
const auth = "Basic " + Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
const AJOUT = 200;

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
  if (!res.ok) throw new Error(`Woo ${res.status} ${chemin}: ${texte.slice(0, 300)}`);
  return texte ? JSON.parse(texte) : {};
}

const produits = await wc("/products?sku=pelicans-spurs-14-01-2027&per_page=10");
const produit = produits.find((p) => p.sku === "pelicans-spurs-14-01-2027");
if (!produit) throw new Error("produit introuvable");
const variations = await wc(`/products/${produit.id}/variations?per_page=100`);

for (const v of variations) {
  const id = String(v.sku || "").split(":")[1] || v.sku;
  const actuel = Number(v.stock_quantity) || 0;
  const dispo = v.stock_status === "instock" && actuel > 0;
  if (!dispo) {
    console.log("inchangé", id, actuel, v.stock_status);
    continue;
  }
  const qte = actuel + AJOUT;
  const maj = await wc(`/products/${produit.id}/variations/${v.id}`, {
    method: "PUT",
    body: JSON.stringify({
      manage_stock: true,
      stock_quantity: qte,
      stock_status: "instock",
    }),
  });
  console.log("ajouté", id, actuel, "->", maj.stock_quantity);
}
