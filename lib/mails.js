/* Mails transactionnels NBA Paris Game, dans la langue de la commande.
   1) Facture, juste après le paiement.
   2) Mot de passe + e-billets PDF joints. */

import { BILLETS } from "./data";
import { COPIE, euro, langueDe } from "./mail-copie.mjs";

const NOIR = "#000000";
const ROUGE = "#c8102e";
const TEXTE = "#161616";
const MUET = "#5e6570";
const FOND = "#ececec";
const SITE = "https://www.nbaeventsparis.com";
const LOGO = `${SITE}/images/logo-nba.png`;
const CONTACT = (process.env.CONTACT_EMAIL || "mail@nbaeventsparis.com").trim();
const FONT = "Arial,Helvetica,sans-serif";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decrire(ligne, langue) {
  const billet = BILLETS.find((b) => b.id === ligne.id);
  if (!billet) {
    return {
      nom: ligne.nom || "",
      categorie: ligne.categorie || "",
      detail: ligne.detail || "",
      tribune: ligne.tribune || (ligne.nom || ""),
      categorieLabel: ligne.categorieLabel || (ligne.categorie || ""),
      blocsLabel: ligne.blocsLabel || "",
      niveauLabel: ligne.niveauLabel || ligne.detail || ""
    };
  }
  const c = COPIE[langue];
  const niveau = String(billet.niveaux[langue] || billet.niveaux.fr).split(".")[0];
  const nom = billet.tag[langue] || billet.tag.fr;
  const categorie = billet.nom[langue] || billet.nom.fr;
  const blocs = String(billet.blocs).replaceAll(" · ", ", ");
  return {
    nom,
    categorie,
    detail: `${c.blocs} ${blocs} · ${niveau}`,
    tribune: nom.toLocaleUpperCase(langue === "en" ? "en-GB" : "fr-FR"),
    categorieLabel: categorie.toLocaleUpperCase(langue === "en" ? "en-GB" : "fr-FR"),
    blocsLabel: `${c.blocs} ${blocs}`,
    niveauLabel: niveau
  };
}

export function preparer(commande) {
  const langue = langueDe(commande);
  const lignes = (commande.lignes || []).map((l) => ({ ...l, ...decrire(l, langue) }));
  return { ...commande, langue, copie: COPIE[langue], lignes };
}

function coque(titre, preheader, corps, langue) {
  const c = COPIE[langue];
  return `<!doctype html>
<html lang="${c.html}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(titre)}</title>
</head>
<body style="margin:0;padding:0;background:${FOND};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${FOND};">
    <tr><td align="center" style="padding:24px 12px 32px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
        ${corps}
        <tr><td style="padding:16px 4px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#fff;border:1px solid #e4e4e4;border-radius:12px;padding:16px 18px;font-family:${FONT};font-size:13px;line-height:1.55;color:${TEXTE};text-align:center;">
              ${c.probleme} <a href="mailto:${CONTACT}" style="color:${ROUGE};text-decoration:none;font-weight:700;">${CONTACT}</a>. ${c.seule}<br>
              ${c.conserve}
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:14px 8px 0;font-family:${FONT};font-size:12px;line-height:1.65;color:#8d8d8d;text-align:center;">
          ${c.pied}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function bandeau(kicker, titre, ref, commandeMot) {
  return `
  <tr><td style="background:${NOIR};padding:26px 28px 22px;text-align:center;">
    <img src="${LOGO}" width="78" alt="NBA" style="display:block;margin:0 auto 14px;border:0;height:auto;">
    <div style="height:3px;width:36px;background:${ROUGE};margin:0 auto 14px;font-size:0;line-height:0;">&nbsp;</div>
    ${kicker ? `<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.55);">${kicker}</div>` : ""}
    <div style="font-family:${FONT};font-size:26px;font-weight:700;letter-spacing:-.02em;color:#fff;margin-top:${kicker ? "6px" : "0"};">${titre}</div>
    <div style="font-family:${FONT};font-size:13px;color:rgba(255,255,255,.72);margin-top:6px;">${commandeMot} ${esc(ref)}</div>
  </td></tr>`;
}

function rencontre() {
  return `
  <tr><td style="padding:0 22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:-18px;background:#fff;border:1px solid #e4e4e4;border-radius:14px;">
      <tr>
        <td width="42%" style="padding:16px 8px;font-family:${FONT};font-size:13px;font-weight:700;color:${TEXTE};text-align:right;">Pelicans</td>
        <td width="16%" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:.16em;color:${ROUGE};text-align:center;">VS</td>
        <td width="42%" style="padding:16px 8px;font-family:${FONT};font-size:13px;font-weight:700;color:${TEXTE};">Spurs</td>
      </tr>
    </table>
  </td></tr>`;
}

function faits(items) {
  const cols = items.map((item, i) => `
    <td width="${Math.floor(100 / items.length)}%" style="padding:12px 8px;${i ? "border-left:1px solid #ececec;" : ""}font-family:${FONT};text-align:center;vertical-align:top;">
      <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${MUET};">${item.k}</div>
      <div style="margin-top:5px;font-size:13px;font-weight:700;color:${TEXTE};line-height:1.35;">${item.v}</div>
    </td>`).join("");
  return `
  <tr><td style="padding:16px 22px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;border-radius:12px;"><tr>${cols}</tr></table>
  </td></tr>`;
}

export function htmlFacture(commande) {
  const pret = preparer(commande);
  const c = pret.copie;
  const langue = pret.langue;
  const lignes = pret.lignes.map((l) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #ececec;font-family:${FONT};vertical-align:top;">
        <div style="font-size:15px;font-weight:700;color:${TEXTE};">${esc(l.nom)}</div>
        <div style="margin-top:3px;font-size:12px;line-height:1.45;color:${MUET};">${esc(l.categorie)} · ${esc(l.detail)}</div>
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #ececec;font-family:${FONT};font-size:14px;color:${TEXTE};text-align:center;vertical-align:top;white-space:nowrap;">${l.qte}</td>
        <td style="padding:14px 0;border-bottom:1px solid #ececec;font-family:${FONT};font-size:14px;color:${TEXTE};text-align:right;vertical-align:top;white-space:nowrap;">${euro(l.prix, langue)}</td>
      <td style="padding:14px 0 14px 12px;border-bottom:1px solid #ececec;font-family:${FONT};font-size:14px;font-weight:700;color:${TEXTE};text-align:right;vertical-align:top;white-space:nowrap;">${euro(l.sousTotal, langue)}</td>
    </tr>`).join("");
  const corps = `
    <tr><td style="background:#fff;border-radius:18px;overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${bandeau(c.factureKicker, c.factureTitre, pret.numero, c.commande)}
        ${rencontre()}
        ${faits([
          { k: c.date, v: esc(c.quand) },
          { k: c.coup, v: esc(pret.heure) },
          { k: c.salle, v: `${esc(pret.lieu)}<br><span style="font-weight:500;color:${MUET};">${c.paris}</span>` }
        ])}
        <tr><td style="padding:18px 28px 0;font-family:${FONT};font-size:15px;line-height:1.55;color:${TEXTE};">
          ${c.factureIntro}
        </td></tr>
        ${faits([
          { k: c.factureDate, v: esc(c.dateFacture) },
          { k: c.paiement, v: c.paiementValeur },
          { k: c.envoyee, v: esc(pret.email) }
        ])}
        <tr><td style="padding:18px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 0 8px;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${MUET};">${c.place}</td>
              <td style="padding:0 0 8px;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${MUET};text-align:center;">${c.qte}</td>
              <td style="padding:0 0 8px;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${MUET};text-align:right;">${c.prix}</td>
              <td style="padding:0 0 8px 12px;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${MUET};text-align:right;">${c.montant}</td>
            </tr>
            ${lignes}
          </table>
        </td></tr>
        <tr><td style="padding:16px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NOIR};border-radius:12px;">
            <tr>
              <td style="padding:16px 18px;font-family:${FONT};font-size:14px;font-weight:700;color:#fff;">${c.total}</td>
              <td style="padding:16px 18px;font-family:${FONT};font-size:22px;font-weight:700;color:#fff;text-align:right;">${euro(pret.total, langue)}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:14px 28px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;border-radius:12px;">
            <tr><td style="padding:14px 16px;font-family:${FONT};font-size:13px;line-height:1.5;color:${TEXTE};">
              ${c.second}
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`;
  return coque(c.titreFacture(pret.numero), c.preFacture(pret.numero), corps, langue);
}

export function htmlMotDePasse(commande) {
  const pret = preparer(commande);
  const c = pret.copie;
  const ligne = pret.lignes[0];
  const places = pret.lignes.flatMap((l) => Array.from({ length: l.qte }, (_, i) => ({ l, i }))).map(({ l, i }, index, tous) => `
    <tr><td style="padding:10px 0;${index ? "border-top:1px solid #ececec;" : ""}font-family:${FONT};">
      <div style="font-size:14px;font-weight:700;color:${TEXTE};">${c.placeN(index + 1, tous.length)}</div>
      <div style="margin-top:2px;font-size:12px;color:${MUET};">${esc(l.categorie)} · ${esc(l.nom)} · ${c.qrIndividuel}</div>
    </td></tr>`).join("");
  const corps = `
    <tr><td style="background:#fff;border-radius:18px;overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${bandeau("", c.accesTitre, pret.numero, c.commande)}
        ${rencontre()}
        ${faits([
          { k: c.horaire, v: `${esc(pret.heure)}<br><span style="font-weight:500;color:${MUET}">${c.coup}</span>` },
          { k: c.billet, v: `${c.qr}<br><span style="font-weight:500;color:${MUET}">${c.unePlace}</span>` }
        ])}
        <tr><td style="padding:18px 28px 0;font-family:${FONT};font-size:15px;line-height:1.55;color:${TEXTE};text-align:center;">
          ${c.accesIntro}
        </td></tr>
        <tr><td style="padding:16px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e4;border-radius:12px;">
            <tr>
              <td width="54" style="background:${ROUGE};color:#fff;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.08em;text-align:center;border-radius:12px 0 0 12px;">PDF</td>
              <td style="padding:12px 14px;font-family:${FONT};">
                <div style="font-size:14px;font-weight:700;color:${TEXTE};">billets-${esc(pret.numero)}.pdf</div>
                <div style="margin-top:2px;font-size:12px;color:${MUET};">${c.pdfN(pret.lignes.reduce((n, l) => n + l.qte, 0), ligne.nom)}</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:8px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${places}</table>
        </td></tr>
        <tr><td style="padding:8px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;border-radius:14px;">
            <tr><td style="padding:20px 16px;text-align:center;font-family:${FONT};">
              <div style="font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${MUET};">${c.email}</div>
              <div style="margin-top:4px;font-size:15px;font-weight:700;color:${TEXTE};">${esc(pret.email)}</div>
              <div style="margin-top:16px;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${MUET};">${c.mdp}</div>
              <div style="margin-top:8px;font-family:Courier New,Courier,monospace;font-size:28px;font-weight:700;letter-spacing:.22em;color:${NOIR};">${esc(pret.motDePasse)}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:16px 28px 0;">
          <a href="${SITE}/compte" style="display:inline-block;background:${ROUGE};color:#fff;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:14px 22px;border-radius:999px;">${c.ouvrir}</a>
        </td></tr>
        <tr><td style="padding:10px 40px 26px;font-family:${FONT};font-size:12px;line-height:1.45;color:#9aa0a6;text-align:center;">
          ${c.actions}
        </td></tr>
        <tr><td style="padding:0 28px 26px;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUET};text-align:center;">
          ${c.gardeMdp}
        </td></tr>
      </table>
    </td></tr>`;
  return coque(c.titreAcces(pret.numero), c.preAcces(pret.numero), corps, pret.langue);
}

export const EXEMPLE_COMMANDE = {
  langue: "fr",
  numero: "NBA-1842",
  email: "camille.martin@email.fr",
  motDePasse: "K7mP4qR2",
  total: 190,
  heure: "20:30",
  lieu: "Accor Arena",
  lignes: [
    { id: "grand-hall", qte: 2, prix: 95, sousTotal: 190 }
  ]
};
