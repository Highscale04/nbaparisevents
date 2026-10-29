import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { COPIE, langueDe } from "./mail-copie.mjs";
import { LOGO_NBA_PNG } from "./logo-nba-png.js";

const NOIR = rgb(0, 0, 0);
const ROUGE = rgb(200 / 255, 16 / 255, 46 / 255);
const BLEU = rgb(29 / 255, 78 / 255, 150 / 255);
const BLEU_FONC = rgb(22 / 255, 53 / 255, 110 / 255);
const ENCRE = rgb(22 / 255, 22 / 255, 22 / 255);
const MUET = rgb(94 / 255, 101 / 255, 112 / 255);
const PAPIER = rgb(236 / 255, 236 / 255, 236 / 255);
const BLANC = rgb(1, 1, 1);
const OR = rgb(1, 209 / 255, 90 / 255);
const GRIS = rgb(246 / 255, 246 / 255, 246 / 255);

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function latin(value) {
  return String(value)
    .replaceAll("€", "EUR")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("’", "'")
    .replaceAll("·", "-");
}

async function image(pdf) {
  return pdf.embedPng(LOGO_NBA_PNG);
}

function texte(page, value, x, y, size, font, color) {
  page.drawText(latin(value), { x, y, size, font, color });
}

function centre(page, value, y, size, font, color) {
  const t = latin(value);
  const w = font.widthOfTextAtSize(t, size);
  page.drawText(t, { x: (595 - w) / 2, y, size, font, color });
}

function droite(page, value, droiteX, y, size, font, color) {
  const t = latin(value);
  const w = font.widthOfTextAtSize(t, size);
  page.drawText(t, { x: droiteX - w, y, size, font, color });
}

export async function pdfEbillet(commande) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const logo = await image(pdf);
  const langue = langueDe(commande);
  const c = commande.copie || COPIE[langue];
  const places = (commande.lignes || []).flatMap((l) => Array.from({ length: l.qte || 1 }, () => l));
  const total = places.length;

  for (let i = 0; i < total; i += 1) {
    const ligne = places[i];
    const prix = ligne.prixLabel || `${Number(ligne.prix || 0).toLocaleString(langue === "en" ? "en-GB" : "fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
    const page = pdf.addPage([595, 842]);
    const code = `${commande.numero.replace("-", "")}P${i + 1}`;
    const site = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.nbaeventsparis.com").replace(/\/+$/, "");
    const qrPng = await QRCode.toBuffer(`${site}/e-billet/${code}`, {
      type: "png",
      width: 360,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#111111", light: "#ffffff" }
    });
    const qr = await pdf.embedPng(qrPng);

    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: PAPIER });
    page.drawRectangle({ x: 28, y: 28, width: 539, height: 786, color: BLANC });

    page.drawRectangle({ x: 28, y: 702, width: 539, height: 112, color: NOIR });
    page.drawRectangle({ x: 28, y: 698, width: 539, height: 4, color: ROUGE });
    const logoH = 38;
    const logoW = (logo.width / logo.height) * logoH;
    page.drawImage(logo, { x: (595 - logoW) / 2, y: 764, width: logoW, height: logoH });
    centre(page, c.eticket, 744, 10, bold, rgb(0.72, 0.72, 0.72));
    centre(page, c.placeDe(i + 1, total), 722, 15, bold, BLANC);

    page.drawRectangle({ x: 44, y: 468, width: 507, height: 206, color: BLEU });
    page.drawRectangle({ x: 44, y: 468, width: 507, height: 8, color: BLEU_FONC });
    page.drawRectangle({ x: 414, y: 484, width: 121, height: 174, color: BLANC });

    texte(page, "PELICANS", 62, 628, 16, bold, BLANC);
    texte(page, "VS", 164, 630, 12, bold, OR);
    texte(page, "SPURS", 194, 628, 16, bold, BLANC);

    texte(page, ligne.tribune || "TRIBUNE GRAND HALL", 62, 588, 10, bold, OR);
    texte(page, ligne.categorieLabel || "CATEGORIE 4", 62, 556, 22, bold, BLANC);
    texte(page, ligne.blocsLabel || "", 62, 534, 11, font, BLANC);
    texte(page, ligne.niveauLabel || "", 62, 516, 11, font, rgb(0.86, 0.9, 0.96));
    texte(page, prix, 62, 492, 13, bold, BLANC);

    const colX = 414;
    const colW = 121;
    const dansCol = (value, y, size, f, color) => {
      const t = latin(value);
      const w = f.widthOfTextAtSize(t, size);
      page.drawText(t, { x: colX + (colW - w) / 2, y, size, font: f, color });
    };
    dansCol(c.mois, 614, 10, bold, BLEU_FONC);
    dansCol("14", 556, 40, bold, BLEU_FONC);
    dansCol("2027", 534, 11, bold, BLEU_FONC);
    dansCol("20:30", 506, 13, bold, ROUGE);

    texte(page, c.commandeLabel, 48, 430, 9, bold, MUET);
    texte(page, commande.numero, 48, 408, 16, bold, ENCRE);
    texte(page, commande.email, 48, 390, 11, font, MUET);

    texte(page, c.rencontreLabel, 48, 358, 9, bold, MUET);
    texte(page, c.matchCourt, 48, 338, 13, bold, ENCRE);
    texte(page, `${c.quand} - ${commande.heure || "20:30"}`, 48, 320, 11, font, MUET);
    texte(page, commande.lieu, 48, 304, 11, font, MUET);

    page.drawRectangle({ x: 392, y: 228, width: 148, height: 176, color: GRIS });
    page.drawImage(qr, { x: 406, y: 268, width: 120, height: 120 });
    const qrLabel = c.presenter;
    const qrW = bold.widthOfTextAtSize(qrLabel, 8);
    page.drawText(qrLabel, { x: 392 + (148 - qrW) / 2, y: 246, size: 8, font: bold, color: MUET });

    page.drawRectangle({ x: 44, y: 148, width: 507, height: 56, color: GRIS });
    texte(page, c.code, 58, 176, 9, bold, MUET);
    texte(page, code, 58, 158, 12, bold, ENCRE);
    droite(page, process.env.CONTACT_EMAIL || "mail@nbaeventsparis.com", 534, 162, 10, font, ROUGE);

    page.drawRectangle({ x: 28, y: 28, width: 539, height: 72, color: NOIR });
    texte(page, c.jeu, 48, 62, 12, bold, BLANC);
    texte(page, c.pdfPied, 48, 44, 10, font, rgb(0.78, 0.78, 0.78));
  }

  return pdf.save();
}

const estDirect = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (estDirect) {
  const { writeFile } = await import("node:fs/promises");
  const bytes = await pdfEbillet({
    langue: "fr",
    copie: COPIE.fr,
    numero: "NBA-1842",
    email: "camille.martin@email.fr",
    heure: "20:30",
    lieu: "Accor Arena",
    lignes: [{
      qte: 2,
      prix: 95,
      tribune: "TRIBUNE GRAND HALL",
      categorieLabel: "CATÉGORIE 4",
      blocsLabel: "Blocs A, B, C, S, T, U",
      niveauLabel: "Gradin et balcon"
    }]
  });
  const sortie = path.join(RACINE, ".tmp-billets-NBA-1842.pdf");
  await writeFile(sortie, bytes);
  console.log(sortie);
}
