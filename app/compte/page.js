"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/providers";
import { Espace } from "@/components/Espace";
import {
  commandesCompte,
  deconnecter,
  entrerCompte,
  lireCompte,
  lireSession,
  nouveauMdp
} from "@/lib/store";

const DEMO_COMPTE = {
  prenom: "Camille",
  nom: "Martin",
  email: "camille.martin@email.fr",
  ville: "Paris"
};

const DEMO_COMMANDES = [{
  numero: "NBA-1842",
  date: "2026-10-27T12:00:00+01:00",
  lignes: [{ id: "grand-hall", qte: 2, sousTotal: 190 }],
  total: 190
}];

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="wrap account" />}>
      <Compte />
    </Suspense>
  );
}

function Compte() {
  const params = useSearchParams();
  const demo = params.get("demo") === "1";
  const { t, lang } = useI18n();
  const [vue, setVue] = useState(0);
  const [pret, setPret] = useState(false);
  useEffect(() => setPret(true), []);
  if (!pret) return <main className="wrap account" />;
  const compte = lireCompte();
  const connecte = compte && lireSession() === compte.email;

  const sortir = () => {
    if (demo) {
      window.location.assign("/compte");
      return;
    }
    deconnecter();
    setVue((n) => n + 1);
  };

  if (demo || connecte) {
    const actif = demo ? DEMO_COMPTE : compte;
    const liste = demo ? DEMO_COMMANDES : commandesCompte(actif.email);
    return (
      <Espace
        key={vue + lang + (demo ? "demo" : actif.email)}
        compte={actif}
        commandes={liste}
        lang={lang}
        demo={demo}
        section={params.get("section") || "accueil"}
        onOut={sortir}
      />
    );
  }

  return <Porte key={vue + lang} t={t} onChange={() => setVue((n) => n + 1)} />;
}

function champ(id, nom, type, auto, label) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={nom} type={type} required autoComplete={auto} />
    </>
  );
}

function Porte({ t, onChange }) {
  const [oublier, setOublier] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  const [oubliMsg, setOubliMsg] = useState("");

  function envoyer(e, id) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    if (form.elements.mdp2 && form.elements.mdp.value !== form.elements.mdp2.value) {
      setOubliMsg(t("account.mismatch"));
      return;
    }
    if (id === "entrer") {
      if (entrerCompte(data.email, data.mdp)) onChange();
      else setLoginMsg(t("account.bad"));
      return;
    }
    const code = nouveauMdp(data.email, data.mdp);
    if (code === "unknown") setOubliMsg(t("account.unknown"));
    else if (code === "short") setOubliMsg(t("account.short"));
    else {
      setOublier(false);
      setLoginMsg(t("account.resetOk"));
      setOubliMsg("");
    }
  }

  return (
    <main className="wrap account" style={{ paddingTop: "1rem" }}>
      <header className="page-head">
        <p className="crumbs">{t("account.crumb")}</p>
        <h1>{t("account.h1")}</h1>
      </header>
      <div className="account-grid">
        <form className="panel account-card" hidden={oublier} onSubmit={(e) => envoyer(e, "entrer")}>
          <h2>{t("account.login")}</h2>
          <p className="muted">{t("account.loginLead")}</p>
          {champ("login-mail", "email", "email", "username", t("account.mail"))}
          {champ("login-mdp", "mdp", "password", "current-password", t("account.pass"))}
          <button className="account-switch" type="button" onClick={() => setOublier(true)}>{t("account.forgot")}</button>
          <p className="error" role="status">{loginMsg}</p>
          <button className="btn btn-red" type="submit">{t("account.submit")}</button>
        </form>
        <form className="panel account-card" hidden={!oublier} onSubmit={(e) => envoyer(e, "oublier")}>
          <h2>{t("account.forgot")}</h2>
          <p className="muted">{t("account.resetLead")}</p>
          {champ("oubli-mail", "email", "email", "username", t("account.mail"))}
          {champ("oubli-mdp", "mdp", "password", "new-password", t("account.pass"))}
          {champ("oubli-mdp2", "mdp2", "password", "new-password", t("account.pass2"))}
          <p className="error" role="status">{oubliMsg}</p>
          <button className="btn btn-red" type="submit">{t("account.resetBtn")}</button>
          <button className="account-switch" type="button" onClick={() => setOublier(false)}>{t("account.back")}</button>
        </form>
      </div>
    </main>
  );
}
