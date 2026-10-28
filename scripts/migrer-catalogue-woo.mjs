/**
 * Publie le Paris Game (lib/data.js) dans WooCommerce :
 * un produit variable, une variation par catégorie.
 *
 *   node scripts/migrer-catalogue-woo.mjs
 *
 * Lit WC_* depuis .dev.vars ou .env.local.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { BILLETS, STOCK, MATCH, epuise } from "../lib/data.js";

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

if (!WC_URL || !WC_KEY || !WC_SECRET) {
  console.error("WC_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET manquants.");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
const SLUG = "pelicans-spurs-14-01-2027";
const TITRE = `${MATCH.domicile} – ${MATCH.exterieur}`;

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

async function existant(sku) {
  const liste = await wc(`/products?sku=${encodeURIComponent(sku)}&per_page=10`);
  return liste.find((p) => p.sku === sku) ?? null;
}

async function main() {
  const options = BILLETS.map((b) => b.tag.fr);
  const corps = {
    name: TITRE,
    type: "variable",
    status: "publish",
    catalog_visibility: "hidden",
    sku: SLUG,
    description: `${MATCH.date.fr} · ${MATCH.heure} · ${MATCH.lieu}`,
    virtual: true,
    tax_status: "none",
    attributes: [
      {
        name: "Categorie",
        slug: "categorie",
        visible: true,
        variation: true,
        options,
      },
    ],
    meta_data: [
      { key: "_nba_slug", value: SLUG },
      { key: "_nba_date", value: MATCH.date.fr },
      { key: "_nba_heure", value: MATCH.heure },
      { key: "_nba_lieu", value: MATCH.lieu },
      { key: "_nba_domicile", value: MATCH.domicile },
      { key: "_nba_exterieur", value: MATCH.exterieur },
    ],
  };

  let produit = await existant(SLUG);
  if (produit) {
    produit = await wc(`/products/${produit.id}`, { method: "PUT", body: JSON.stringify(corps) });
    console.log("mis à jour", SLUG, produit.id);
  } else {
    produit = await wc("/products", { method: "POST", body: JSON.stringify(corps) });
    console.log("créé", SLUG, produit.id);
  }

  const variations = await wc(`/products/${produit.id}/variations?per_page=100`);
  for (const cat of BILLETS) {
    const sku = `${SLUG}:${cat.id}`;
    const stock = STOCK[cat.id] || 0;
    const vide = epuise(cat.id);
    const variation = {
      sku,
      regular_price: String(cat.prix),
      virtual: true,
      manage_stock: true,
      stock_quantity: stock,
      stock_status: vide ? "outofstock" : "instock",
      attributes: [{ name: "Categorie", option: cat.tag.fr }],
      meta_data: [
        { key: "_nba_categorie_id", value: cat.id },
        { key: "_nba_categorie_label", value: cat.tag.fr },
        { key: "_nba_blocs", value: cat.blocs },
      ],
    };
    const deja = variations.find((v) => v.sku === sku);
    if (deja) {
      await wc(`/products/${produit.id}/variations/${deja.id}`, {
        method: "PUT",
        body: JSON.stringify(variation),
      });
      console.log("  variation", sku, deja.id, vide ? "complet" : `stock ${stock}`);
    } else {
      const cree = await wc(`/products/${produit.id}/variations`, {
        method: "POST",
        body: JSON.stringify(variation),
      });
      console.log("  variation", sku, cree.id, vide ? "complet" : `stock ${stock}`);
    }
  }
  console.log("Catalogue publié dans WooCommerce.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
