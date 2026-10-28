"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { useI18n, useCart } from "@/lib/providers";
import { MATCH, plafond } from "@/lib/data";
import { CLE_COMMANDE, eurosRonds, lireCompte, lireSession } from "@/lib/store";

const CLE_HOLD = "paris-game-2027-delai";
const DUREE = 10 * 60 * 1000;
const CADENAS = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const LETTRE = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
const COMPTE = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.2 19.2c1.3-3 3.7-4.5 6.8-4.5s5.5 1.5 6.8 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const BILLET = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

export default function CartPage() {
  const { t, texte, pret, lang } = useI18n();
  const { detail, definirQuantite, vider } = useCart();
  const { lignes, total } = detail;

  useLayoutEffect(() => {
    const haut = () => {
      const html = document.documentElement;
      const avant = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = avant;
    };
    haut();
    const id = requestAnimationFrame(haut);
    return () => cancelAnimationFrame(id);
  }, []);
  const [fin, setFin] = useState(0);
  const [reste, setReste] = useState(DUREE);
  const [expire, setExpire] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [annule, setAnnule] = useState(false);
  const secondes = Math.ceil(reste / 1000);
  const mm = String(Math.floor(secondes / 60)).padStart(2, "0");
  const ss = String(secondes % 60).padStart(2, "0");

  useEffect(() => {
    if (!pret) return;
    if (!lignes.length) {
      if (!expire) sessionStorage.removeItem(CLE_HOLD);
      setFin(0);
      return;
    }
    let echeance = Number(sessionStorage.getItem(CLE_HOLD) || 0);
    if (!echeance || echeance <= Date.now()) {
      if (echeance) {
        sessionStorage.removeItem(CLE_HOLD);
        setExpire(true);
        vider();
        return;
      }
      echeance = Date.now() + DUREE;
      sessionStorage.setItem(CLE_HOLD, String(echeance));
    }
    setFin(echeance);
    if (expire) setExpire(false);
  }, [pret, lignes.length, vider, expire]);

  useEffect(() => {
    if (!fin) return;
    const tic = () => {
      const left = fin - Date.now();
      if (left <= 0) {
        setReste(0);
        setFin(0);
        setExpire(true);
        sessionStorage.removeItem(CLE_HOLD);
        vider();
        return;
      }
      setReste(left);
    };
    tic();
    const id = setInterval(tic, 250);
    return () => clearInterval(id);
  }, [fin, vider]);

  useEffect(() => {
    setAnnule(new URLSearchParams(window.location.search).get("paiement") === "annule");
  }, []);

  async function payer() {
    if (!lignes.length || envoi) return;
    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ langue: lang, lignes: lignes.map(({ id, qte }) => ({ id, qte })) })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setErreur(data.erreur || t("cart.payFail"));
        setEnvoi(false);
        return;
      }
      const compte = lireCompte();
      const connecte = compte && lireSession() === compte.email;
      const commande = {
        numero: data.numero,
        langue: lang === "en" ? "en" : "fr",
        date: new Date().toISOString(),
        acheteur: connecte ? { prenom: compte.prenom, nom: compte.nom, email: compte.email, ville: compte.ville } : {},
        lignes: lignes.map(({ id, nom, prix, qte, sousTotal }) => ({ id, nom, prix, qte, sousTotal })),
        total,
        match: MATCH
      };
      sessionStorage.setItem(CLE_COMMANDE, JSON.stringify(commande));
      window.location.assign(data.url);
    } catch {
      setErreur(t("cart.payFail"));
      setEnvoi(false);
    }
  }

  return (
    <>
      <header className="page-head">
        <div className={pret && lignes.length && secondes < 60 ? "wrap cart-head is-late" : "wrap cart-head"}>
          <div>
            <p className="crumbs">{t("cart.crumb")}</p>
            <h1>{t("cart.h1")}</h1>
          </div>
          {pret && lignes.length ? (
            <>
              <div className="cart-clock" role="timer" aria-live="polite" aria-atomic="true">
                <strong>{mm}:{ss}</strong>
                <p>{t("cart.hold")}</p>
              </div>
              <span className="cart-holdbar" aria-hidden="true">
                <i style={{ width: `${Math.max(0, Math.min(100, (reste / DUREE) * 100))}%` }} />
              </span>
            </>
          ) : null}
        </div>
      </header>
      <main className="wrap cart-page">
        <section>
          {!pret ? null : lignes.length ? lignes.map((l) => (
              <article className="pass cart-pass" key={l.id}>
                <div className="pass-face">
                  <div className="pass-blue">
                    <div className="cart-motion" aria-hidden="true">
                      <img src="/images/motion/basket.svg" alt="" />
                      <img src="/images/motion/basket.svg" alt="" />
                      <img src="/images/motion/basket.svg" alt="" />
                    </div>
                    <div className="pass-brand">
                      <img src="/images/logo-nba.png" alt="NBA" />
                      <p><span>Paris</span><span>Game 2027</span></p>
                    </div>
                    <p className="pass-by">Presented by <img src="/images/sponsors/tissot.svg" alt="Tissot" /></p>
                    <p className="ticket-tag">{l.tag}</p>
                    <h2>{l.nom}</h2>
                    <p className="pass-lead">{texte(l.resume)}</p>
                    <p className="pass-meta"><span>{t("tickets.blocks")}</span> {l.blocs}</p>
                    <div className="pass-buy">
                      <p className="price">{eurosRonds(l.sousTotal)} <span>{l.id === "loges" ? t("tickets.logePrice") : (l.qte > 1 ? `${l.qte} ${t("tickets.stock")}` : t("home.per"))}</span></p>
                      {l.id === "loges" ? null : (
                        <div className="qty">
                          <button type="button" aria-label="−" onClick={() => definirQuantite(l.id, l.qte - 1)}>−</button>
                          <span>{l.qte}</span>
                          <button type="button" aria-label="+" disabled={l.qte >= plafond(l.id)} onClick={() => definirQuantite(l.id, l.qte + 1)}>+</button>
                        </div>
                      )}
                      <button type="button" className="cart-remove" onClick={() => definirQuantite(l.id, 0)}>{t("cart.remove")}</button>
                    </div>
                    <div className="pass-clubs">
                      <img src="/images/logo-pelicans.png" alt="New Orleans Pelicans" />
                      <img src="/images/logo-spurs.png" alt="San Antonio Spurs" />
                      <span>Accor Arena</span>
                    </div>
                  </div>
                  <div className="pass-date">
                    <p className="pass-month">{t("tickets.month")}</p>
                    <p className="pass-day">{t("tickets.day")}</p>
                    <p className="pass-year">{t("tickets.year")}</p>
                  </div>
                </div>
              </article>
          )) : (
            <div className="cart-empty">
              <p>{expire ? t("cart.holdEnd") : t("cart.empty")}</p>
              <Link className="btn cart-checkout" href="/paris-game">{t("cart.see")}</Link>
            </div>
          )}
        </section>
        <aside className="cart-side" hidden={!pret || !lignes.length}>
          <ul className="cart-guarantees">
            <li>
              <span dangerouslySetInnerHTML={{ __html: LETTRE }} />
              {t("cart.mailTitle")}
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: COMPTE }} />
              {t("cart.spaceTitle")}
            </li>
            <li>
              <span dangerouslySetInnerHTML={{ __html: BILLET }} />
              {t("cart.ticketTitle")}
            </li>
          </ul>
          <div className="cart-pay">
            <div className="cart-clubs" aria-hidden="true">
              <img src="/images/logo-pelicans.png" alt="" />
              <img src="/images/logo-spurs.png" alt="" />
            </div>
            <h2>{t("cart.summary")}</h2>
            <p className="cart-match">Pelicans — Spurs · {texte(MATCH.date)}</p>
            <div className="cart-sum">
              <span>{t("ok.total")}</span>
              <strong>{eurosRonds(total)}</strong>
            </div>
            {annule ? <p className="cart-pay-note">{t("cart.payCancel")}</p> : null}
            {erreur ? <p className="cart-pay-note" role="alert">{erreur}</p> : null}
            <button className="btn cart-checkout" type="button" onClick={payer} disabled={envoi}>
              <span className="cart-checkout-lock" dangerouslySetInnerHTML={{ __html: CADENAS }} />
              {t("cart.pay")}
            </button>
            <p className="cart-legal">
              {t("cart.buyBefore")}
              <Link href="/mentions">{t("cart.cgv")}</Link>
              {t("cart.buyMid")}
              <a href="https://www.nba.com/privacy-policy" target="_blank" rel="noopener">{t("cart.policy")}</a>
              {t("cart.buyAnd")}
              <a href="https://www.nba.com/termsofuse" target="_blank" rel="noopener">{t("cart.terms")}</a>.
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
