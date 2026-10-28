import crypto from "crypto";
import { MATCH } from "./data";
import { envoyerBrevo } from "./brevo";
import { pdfEbillet } from "./ebillet-pdf.mjs";
import { htmlFacture, htmlMotDePasse, preparer } from "./mails";
import { majCommandeWoo } from "./woo";

function meta(wc, cle) {
  const ligne = (wc.meta_data || []).find((m) => m.key === cle);
  return ligne && ligne.value != null ? String(ligne.value) : "";
}

function emailPropre(valeur) {
  const email = String(valeur || "").trim().toLowerCase();
  if (!email.includes("@") || email.startsWith("attente@")) return "";
  return email;
}

export function emailDepuisPaiement(objet, data, wc) {
  const client = objet?.customer && typeof objet.customer === "object" ? objet.customer : {};
  const billing = objet?.billing && typeof objet.billing === "object" ? objet.billing : {};
  return (
    emailPropre(objet?.customerEmail) ||
    emailPropre(objet?.customer_email) ||
    emailPropre(objet?.email) ||
    emailPropre(client.email) ||
    emailPropre(billing.email) ||
    emailPropre(data?.customerEmail) ||
    emailPropre(data?.email) ||
    emailPropre(wc?.billing?.email)
  );
}

function lignesDepuis(wc) {
  try {
    const brut = JSON.parse(meta(wc, "_nba_lignes") || "[]");
    if (Array.isArray(brut) && brut.length) {
      return brut.map((l) => ({
        id: l.id,
        qte: Number(l.qte) || 1,
        prix: (Number(l.prixCents) || 0) / 100,
        sousTotal: (Number(l.totalCents) || 0) / 100
      }));
    }
  } catch {
    /* catalogue fee_lines */
  }
  return (wc.fee_lines || []).map((l) => {
    const id = (l.meta_data || []).find((m) => m.key === "_nba_categorie")?.value || "";
    const qte = Number((l.meta_data || []).find((m) => m.key === "_nba_quantite")?.value) || 1;
    const prix = Number((l.meta_data || []).find((m) => m.key === "_nba_prix_unitaire_cents")?.value || 0) / 100;
    return { id, qte, prix, sousTotal: prix * qte };
  });
}

function motDePasse(wc) {
  return meta(wc, "_nba_mot_de_passe") || crypto.randomBytes(4).toString("hex");
}

export function commandeDepuisWoo(wc, extras = {}) {
  const email = emailPropre(extras.email) || emailPropre(wc.billing?.email);
  return {
    langue: meta(wc, "_nba_langue") === "en" ? "en" : "fr",
    numero: `NBA-${wc.id}`,
    email,
    motDePasse: extras.motDePasse || motDePasse(wc),
    total: Number(wc.total) || 0,
    heure: MATCH.heure,
    lieu: "Accor Arena",
    lignes: lignesDepuis(wc)
  };
}

export async function envoyerMailsPaiement(wc, extras = {}) {
  if (meta(wc, "_nba_mail_brevo") === "oui") return { ok: true, deja: true };
  const email = emailDepuisPaiement(extras.objet || {}, extras.data || {}, { ...wc, billing: { ...wc.billing, email: extras.email || wc.billing?.email } });
  if (!email) {
    console.warn("[mail] pas d'e-mail client", wc.id);
    return { ok: false, raison: "email" };
  }
  const mdp = motDePasse(wc);
  const commande = commandeDepuisWoo(wc, { email, motDePasse: mdp });
  if (!commande.lignes.length) {
    console.warn("[mail] pas de lignes", wc.id);
    return { ok: false, raison: "lignes" };
  }
  const pret = preparer(commande);
  const pdf = await pdfEbillet(pret);
  await envoyerBrevo({
    to: email,
    subject: pret.copie.titreFacture(pret.numero),
    html: htmlFacture(commande),
    kind: "invoice",
    orderId: wc.id,
    idempotencyKey: `nba-${wc.id}-facture`
  });
  await envoyerBrevo({
    to: email,
    subject: pret.copie.titreAcces(pret.numero),
    html: htmlMotDePasse(commande),
    kind: "tickets",
    orderId: wc.id,
    attachment: [{ name: `billets-${pret.numero}.pdf`, content: Buffer.from(pdf).toString("base64") }],
    idempotencyKey: `nba-${wc.id}-ebillets`
  });
  await majCommandeWoo(wc.id, {
    billing: { ...wc.billing, email },
    meta_data: [
      { key: "_nba_mail_brevo", value: "oui" },
      { key: "_nba_mot_de_passe", value: mdp },
      { key: "_nba_email_client", value: email }
    ]
  });
  return { ok: true };
}
