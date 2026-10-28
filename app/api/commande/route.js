import { NextResponse } from "next/server";
import { BILLETS, plafond } from "@/lib/data";
import { COPIE } from "@/lib/mail-copie.mjs";
import { creerCommandePaiement, ErreurWoo } from "@/lib/woo";
import { siteUrl } from "@/lib/faldridge";

/* POST /api/commande
   Corps : { lignes: [{ id, qte }] }
   Les prix viennent du catalogue du site, jamais du navigateur.
   Crée une commande WooCommerce en attente, puis renvoie la page Faldridge. */

export async function POST(req) {
  let corps;
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ erreur: "Corps de requête invalide." }, { status: 400 });
  }

  if (!Array.isArray(corps?.lignes) || !corps.lignes.length) {
    return NextResponse.json({ erreur: "Le panier est vide." }, { status: 400 });
  }

  const langue = corps?.langue === "en" ? "en" : "fr";
  const lignes = [];
  for (const brut of corps.lignes) {
    const id = typeof brut?.id === "string" ? brut.id : "";
    const qte = Number(brut?.qte);
    const billet = BILLETS.find((b) => b.id === id);
    const max = plafond(id);
    if (!billet || !Number.isInteger(qte) || qte < 1 || qte > max) {
      return NextResponse.json({ erreur: "Une place du panier n'est plus disponible." }, { status: 400 });
    }
    lignes.push({
      id,
      nom: `${billet.tag[langue]} — ${qte} ${COPIE[langue].places(qte)}`,
      qte,
      prixCents: Math.round(billet.prix * 100),
      totalCents: Math.round(billet.prix * 100) * qte
    });
  }

  const hote = siteUrl().replace(/^https?:\/\//, "");
  try {
    const wc = await creerCommandePaiement({
      email: `attente@${hote}`,
      langue,
      totalCents: lignes.reduce((n, l) => n + l.totalCents, 0),
      lignes
    });
    return NextResponse.json({ numero: wc.numero, url: wc.urlPaiement, key: wc.orderKey, total: wc.total });
  } catch (e) {
    console.error("[commande]", e instanceof Error ? e.message : e);
    const message = e instanceof ErreurWoo ? "Le paiement n'a pas pu s'ouvrir. Réessayez." : "Le paiement n'a pas pu s'ouvrir. Réessayez.";
    return NextResponse.json({ erreur: message }, { status: 502 });
  }
}
