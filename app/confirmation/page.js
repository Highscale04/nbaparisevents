"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/providers";
import { CLE_COMMANDE, euros } from "@/lib/store";

export default function ConfirmationPage() {
  const { t, texte } = useI18n();
  const [commande, setCommande] = useState(undefined);

  useEffect(() => {
    try {
      setCommande(JSON.parse(sessionStorage.getItem(CLE_COMMANDE) || "null"));
    } catch {
      setCommande(null);
    }
  }, []);

  return (
    <main className="wrap confirm">
      <p className="kicker">NBA Paris Game 2027</p>
      <h1>{t("ok.h1")}</h1>
      <p className="sub">{t("ok.sub")}</p>
      {commande === undefined ? null : commande ? (
        <>
          <p className="code">{commande.numero}</p>
          {commande.acheteur && commande.acheteur.prenom ? <p>{commande.acheteur.prenom} {commande.acheteur.nom} · {commande.acheteur.email}</p> : null}
          <div className="panel">
            {commande.lignes.map((l) => (
              <div className="line" key={l.id}><span>{l.qte} × {l.nom}</span><strong>{euros(l.sousTotal)}</strong></div>
            ))}
            <div className="line total"><span>{t("ok.total")}</span><span>{euros(commande.total)}</span></div>
          </div>
          <p className="muted" style={{ marginTop: "1rem" }}>
            {commande.match.domicile} – {commande.match.exterieur}<br />
            {texte(commande.match.date)} · {commande.match.heure} · {commande.match.lieu}
          </p>
          <div className="actions">
            <Link className="btn btn-light" href="/">{t("ok.back")}</Link>
            <Link className="btn btn-ghost" href="/compte">{t("nav.account")}</Link>
          </div>
        </>
      ) : (
        <>
          <p className="empty">{t("ok.none")}</p>
          <Link className="btn btn-light" href="/billets">{t("cart.see")}</Link>
        </>
      )}
    </main>
  );
}
