import { NextResponse } from "next/server";
import { envoyerBrevo } from "@/lib/brevo";

const DESTINATAIRE = (process.env.ANNULATION_EMAIL || "jvelasseur552@gmail.com").trim();

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req) {
  let corps;
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const type = String(corps.type || "");
  const email = String(corps.email || "").trim();
  const numero = String(corps.numero || "").trim();
  const raison = String(corps.raison || corps.message || "").trim();
  if (!["annuler", "modifier", "contact"].includes(type) || !email.includes("@") || !raison) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const sujets = {
    annuler: `Demande d’annulation — ${numero || email}`,
    modifier: `Demande de modification — ${numero || email}`,
    contact: `Message espace client — ${email}`
  };
  const intros = {
    annuler: "Un client demande l’annulation / le remboursement de sa commande.",
    modifier: "Un client demande une modification de commande.",
    contact: "Un client a envoyé un message depuis l’espace client."
  };
  const html = `
    <p>${esc(intros[type])}</p>
    <p><strong>E-mail :</strong> ${esc(email)}<br/>
    <strong>Commande :</strong> ${esc(numero || "—")}<br/>
    <strong>Raison / message :</strong></p>
    <p>${esc(raison).replace(/\n/g, "<br/>")}</p>`;
  try {
    await envoyerBrevo({
      to: DESTINATAIRE,
      subject: sujets[type],
      html,
      kind: type,
      replyTo: { email }
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[demande]", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
