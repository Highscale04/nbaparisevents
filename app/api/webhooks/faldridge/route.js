import crypto from "crypto";
import { NextResponse } from "next/server";
import { emailDepuisPaiement, envoyerMailsPaiement } from "@/lib/envoi-mails";
import { clesSignature } from "@/lib/faldridge";
import { getCommande, majCommandeWoo } from "@/lib/woo";

export const runtime = "nodejs";

function egal(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function signatureValide(corps, signature, horodatage) {
  const secrets = clesSignature();
  if (!secrets.length || !signature) return false;
  const recu = signature.trim().replace(/^"+|"+$/g, "");
  const extrait = recu.match(/(?:v1|sha256)=([A-Za-z0-9+/=]+)/i)?.[1] ?? recu;
  const candidats = [recu, extrait, extrait.toLowerCase()];
  const quand = horodatage || recu.match(/(?:^|,)t=(\d+)/)?.[1] || "";
  const messages = [corps];
  if (quand) messages.push(`${quand}.${corps}`, `${quand}${corps}`);
  return secrets.some((secret) => {
    const cles = [secret];
    if (secret.startsWith("whsec_")) {
      const decode = Buffer.from(secret.slice("whsec_".length), "base64");
      if (decode.length >= 8) cles.push(decode);
    }
    return cles.some((cle) =>
      messages.some((message) => {
        const mac = crypto.createHmac("sha256", cle).update(message, "utf8").digest();
        return candidats.some((c) => egal(c, mac.toString("hex")) || egal(c, mac.toString("base64")));
      })
    );
  });
}

function texte(...vals) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

export async function POST(req) {
  const brut = await req.text();
  const signature =
    req.headers.get("x-webhook-signature") ||
    req.headers.get("x-faldridge-signature") ||
    req.headers.get("x-byteqs-signature") ||
    "";
  if (!signatureValide(brut, signature, req.headers.get("x-webhook-timestamp") || "")) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let corps;
  try {
    corps = JSON.parse(brut);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = corps.data && typeof corps.data === "object" ? corps.data : corps;
  const objet = data.object && typeof data.object === "object" ? data.object : data;
  const meta = objet.metadata && typeof objet.metadata === "object" ? objet.metadata : data.metadata || {};
  const type = texte(corps.type, corps.event, data.type, data.event).toLowerCase();
  const status = texte(objet.status, data.status, corps.status).toLowerCase();
  const reference = texte(objet.clientReferenceId, objet.client_reference_id, objet.reference, meta.reference);
  const wooId = texte(meta.wooId, meta.woo_id);
  const referenceFinale = reference || (wooId ? `NBA-${wooId}` : "");
  const m = referenceFinale.match(/^NBA-(\d+)$/);
  if (!m) return NextResponse.json({ ok: true, ignore: "reference" });

  const paiement = texte(objet.payment_status, objet.paymentStatus).toLowerCase();
  const succes =
    (!/fail|unsuccess|expired|cancel|refund/.test(type) && /succeed|success|completed|paid/.test(type)) ||
    ["succeeded", "success", "paid", "completed", "complete"].includes(status) ||
    ["paid", "succeeded", "success"].includes(paiement);
  const echoue = type.includes("failed") || status === "failed";
  const rembourse = type.includes("refund") || status === "refunded";
  if (!succes && !echoue && !rembourse) {
    return NextResponse.json({ ok: true, ignore: type || status || "evenement" });
  }

  try {
    const wc = await getCommande(Number(m[1]));
    if (!wc) return NextResponse.json({ ok: true, ignore: "commande" });
    if (succes) {
      const email = emailDepuisPaiement(objet, data, wc);
      await majCommandeWoo(wc.id, {
        status: "processing",
        set_paid: true,
        transaction_id: texte(objet.id, data.id) || referenceFinale,
        payment_method: "faldridge",
        payment_method_title: "Faldridge",
        ...(email ? { billing: { ...wc.billing, email } } : {}),
        meta_data: [
          { key: "_faldridge_status", value: "paid" },
          { key: "_faldridge_event", value: type || status },
          ...(email ? [{ key: "_nba_email_client", value: email }] : [])
        ]
      });
      const payee = await getCommande(wc.id);
      try {
        await envoyerMailsPaiement(payee || wc, { email, objet, data });
      } catch (mailErr) {
        console.error("[mail brevo]", mailErr instanceof Error ? mailErr.message : mailErr);
      }
    } else {
      await majCommandeWoo(wc.id, {
        status: rembourse ? "refunded" : "failed",
        meta_data: [{ key: "_faldridge_status", value: rembourse ? "refunded" : "failed" }]
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhook faldridge]", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
