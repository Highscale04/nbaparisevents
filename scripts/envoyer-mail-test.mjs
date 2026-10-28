import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { envoyerBrevo } from "../lib/brevo.js";
import { pdfEbillet } from "../lib/ebillet-pdf.mjs";
import { htmlFacture, htmlMotDePasse, preparer } from "../lib/mails.js";

function charger(fichier) {
  const chemin = resolve(process.cwd(), fichier);
  if (!existsSync(chemin)) return;
  for (const ligne of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

charger(".dev.vars");
charger(".env.local");
charger("/Users/muller/Documents/GitHub/finalchampionleague8749278428/.env.local");

const commande = {
  langue: "fr",
  numero: "NBA-2487",
  email: "cartierkyle59@gmail.com",
  motDePasse: "H9tK2wL8",
  total: 750,
  heure: "20:30",
  lieu: "Accor Arena",
  lignes: [
    { id: "grand-hall", qte: 2, prix: 95, sousTotal: 190 },
    { id: "studio", qte: 1, prix: 235, sousTotal: 235 },
    { id: "boulevard", qte: 1, prix: 325, sousTotal: 325 }
  ]
};

const pret = preparer(commande);
const pdf = await pdfEbillet(pret);

await envoyerBrevo({
  to: commande.email,
  subject: pret.copie.titreFacture(pret.numero),
  html: htmlFacture(commande),
  kind: "invoice",
  orderId: 2487,
  idempotencyKey: `nba-test-${Date.now()}-facture`
});
console.log("facture envoyée", pret.numero);

await envoyerBrevo({
  to: commande.email,
  subject: pret.copie.titreAcces(pret.numero),
  html: htmlMotDePasse(commande),
  kind: "tickets",
  orderId: 2487,
  attachment: [{ name: `billets-${pret.numero}.pdf`, content: Buffer.from(pdf).toString("base64") }],
  idempotencyKey: `nba-test-${Date.now()}-ebillets`
});
console.log("e-billets envoyés", pret.numero);
