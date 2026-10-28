"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/providers";
import { ROSTERS } from "@/lib/rosters";

export default function TeamsPage() {
  const { t, lang } = useI18n();
  return (
    <main className="meet">
      <section className="meet-hero">
        <div className="meet-logos">
          <img src="/images/logo-spurs.png" alt="San Antonio Spurs" />
          <img src="/images/logo-pelicans.png" alt="New Orleans Pelicans" />
        </div>
        <h1>{t("teams.h1")}</h1>
        <p>{t("teams.lead")}</p>
        <div className="meet-jumps">
          <a href="#spurs">{t("teams.toSpurs")}</a>
          <a href="#pelicans">{t("teams.toPelicans")}</a>
        </div>
        <img className="meet-cast" src="/images/joueurs.png" alt="New Orleans Pelicans et San Antonio Spurs" />
      </section>
      {ROSTERS.map((equipe) => (
        <Roster key={equipe.id} equipe={equipe} lang={lang} t={t} />
      ))}
    </main>
  );
}

function Roster({ equipe, lang, t }) {
  const piste = useRef(null);
  const avant = useRef(null);
  const apres = useRef(null);

  useEffect(() => {
    const el = piste.current;
    const prev = avant.current;
    const next = apres.current;
    const bornes = () => {
      const marge = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const max = el.scrollWidth - el.clientWidth;
      prev.disabled = el.scrollLeft <= marge + 2;
      next.disabled = max <= marge + 2 || el.scrollLeft >= max - 2;
    };
    el.addEventListener("scroll", bornes, { passive: true });
    bornes();
    return () => el.removeEventListener("scroll", bornes);
  }, [lang]);

  function pas() {
    const carte = piste.current.querySelector(".player-card");
    if (!carte) return 240;
    const trou = parseFloat(getComputedStyle(piste.current).columnGap) || 12;
    return carte.getBoundingClientRect().width + trou;
  }

  function glisser(sens) {
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    piste.current.scrollBy({ left: sens * pas(), behavior: doux ? "smooth" : "auto" });
  }

  return (
    <section className={`roster ${equipe.id}`} id={equipe.id}>
      <img className="roster-logo" src={equipe.logo} alt={equipe.alt} />
      <h2>{t("teams.kicker")}</h2>
      <p className="roster-lead">{t(equipe.lead)}</p>
      <div className="roster-nav">
        <button type="button" ref={avant} aria-label={t("teams.prev")} onClick={() => glisser(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" ref={apres} aria-label={t("teams.next")} onClick={() => glisser(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="roster-track" tabIndex={0} ref={piste}>
        {equipe.players.map(([n, nom, photo, fr, en]) => (
          <article className="player-card" key={nom}>
            <div className="player-shot"><img src={photo} alt="" /></div>
            <p className="player-num">{t("teams.num")} {n}</p>
            <h3>{nom}</h3>
            <p className="player-bio">{lang === "en" ? en : fr}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
