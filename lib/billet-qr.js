import { BILLETS, MATCH } from "./data";
import { commandeDepuisWoo } from "./envoi-mails";
import { getCommande } from "./woo";

export function sitePublicUrl() {
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.nbaeventsparis.com").replace(/\/+$/, "");
}

export function codeBillet(numero, index) {
  return `${String(numero || "").replace("-", "")}P${index}`;
}

export function urlBillet(code) {
  return `${sitePublicUrl()}/e-billet/${encodeURIComponent(code)}`;
}

export function parserCodeBillet(brut) {
  const code = decodeURIComponent(String(brut || "").trim());
  const m = code.toUpperCase().match(/^NBA-?(\d+)P(\d+)$/);
  if (!m) return null;
  return { id: Number(m[1]), index: Number(m[2]), code: `NBA${m[1]}P${m[2]}` };
}

function commandePayee(wc) {
  if (!wc) return false;
  const statut = String(wc.status || "").toLowerCase();
  if (["cancelled", "refunded", "failed", "trash"].includes(statut)) return false;
  const faldridge = String((wc.meta_data || []).find((m) => m.key === "_faldridge_status")?.value || "").toLowerCase();
  return statut === "processing" || statut === "completed" || Boolean(wc.date_paid) || faldridge === "paid";
}

export async function lireBillet(brut) {
  const lu = parserCodeBillet(brut);
  if (!lu) return null;
  let wc;
  try {
    wc = await getCommande(lu.id);
  } catch {
    return null;
  }
  if (!commandePayee(wc)) return null;
  const commande = commandeDepuisWoo(wc);
  const places = (commande.lignes || []).flatMap((l) => Array.from({ length: l.qte || 1 }, () => l));
  const ligne = places[lu.index - 1];
  if (!ligne) return null;
  const cat = BILLETS.find((b) => b.id === ligne.id);
  return {
    ok: true,
    code: lu.code,
    numero: commande.numero,
    titre: `${MATCH.domicile} vs ${MATCH.exterieur}`,
    categorie: cat?.nom?.fr || ligne.id,
    date: MATCH.date.fr,
    heure: MATCH.heure,
    lieu: MATCH.lieu,
    tribune: cat?.tag?.fr || "",
    blocs: cat?.blocs || "",
    place: `Place ${lu.index} / ${places.length}`,
    nom: [wc.billing?.first_name, wc.billing?.last_name].filter(Boolean).join(" ")
  };
}
