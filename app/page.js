"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/providers";

const PHOTOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const ALTS = [
  "Dîner des légendes",
  "Échauffement sur le terrain",
  "Dîner-croisière",
  "Dîner des légendes 2025",
  "Table des légendes",
  "Photo sur le parquet",
  "Soirée des légendes",
  "Réception d’accueil",
  "Dîner NBA Experiences",
  "Salon NBA Experiences",
  "Salon avant-match",
  "Espace hospitalité",
  "Salon premium",
  "Photo avec le trophée"
];

export default function HomePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [file, setFile] = useState(null);

  function reserver(e) {
    if (file || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    setFile({ lance: true });
  }

  useEffect(() => {
    if (!file?.lance) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => router.push("/billets"), reduit ? 360 : 1600);
    return () => clearTimeout(id);
  }, [file?.lance, router]);

  useEffect(() => {
    document.body.classList.toggle("queue-on", Boolean(file));
    return () => document.body.classList.remove("queue-on");
  }, [file]);

  return (
    <>
      <section className="hero hero-live">
        <img className="hero-photo" src="/images/hero-players.avif" width="3770" height="2301" alt="New Orleans Pelicans et San Antonio Spurs" fetchPriority="high" decoding="async" />
        <div className="hero-panel">
          <img className="hero-logo" src="/images/logo-paris-2027.png" width="2400" height="1430" alt="NBA Paris Game 2027, presented by Tissot" fetchPriority="high" decoding="async" />
          <p>{t("hero.text")}</p>
          <div className="hero-actions">
            <Link className="btn btn-light" href="/billets" onClick={reserver}>{t("hero.cta")}</Link>
            <Link className="btn btn-ghost" href="/equipes">{t("hero.teams")}</Link>
          </div>
        </div>
      </section>

      <section className="skyline">
        <img className="skyline-photo" src="/images/paris-city.avif" width="6000" height="3376" alt="" decoding="async" />
        <div className="skyline-panel">
          <h2>{t("sky.date")}</h2>
          <p className="skyline-venue">{t("sky.venue")}</p>
          <div className="skyline-logos">
            <img src="/images/logo-pelicans.png" width="2000" height="1261" alt="New Orleans Pelicans" decoding="async" />
            <span className="skyline-line" aria-hidden="true" />
            <img src="/images/logo-spurs.png" width="2401" height="1132" alt="San Antonio Spurs" decoding="async" />
          </div>
          <Link className="btn btn-light" href="/equipes">{t("nav.teams")}</Link>
        </div>
      </section>

      <section className="xp-band">
        <div className="xp-marquee">
          <div className="xp-track">
            <div className="xp-set">
              {PHOTOS.map((n, i) => <img key={n} src={`/images/xp/${String(n).padStart(2, "0")}.jpg`} alt={ALTS[i]} decoding="async" />)}
            </div>
            <div className="xp-set" aria-hidden="true">
              {PHOTOS.map((n) => <img key={n} src={`/images/xp/${String(n).padStart(2, "0")}.jpg`} alt="" decoding="async" />)}
            </div>
          </div>
        </div>
        <div className="xp-copy">
          <img className="xp-logo" src="/images/xp/logo-experiences.png" width="1232" height="295" alt="NBA Experiences" decoding="async" />
          <div>
            <p>{t("xp.lead")}</p>
            <p>{t("xp.more")}</p>
          </div>
        </div>
        <a className="btn btn-light" href="mailto:contact@nbaparisevents.com?subject=R%C3%A9servation%20NBA%20Experiences%20%E2%80%94%20Paris%20Game%202027">{t("xp.cta")}</a>
      </section>

      {file ? (
        <div className="queue" role="status" aria-live="polite" aria-label={t("queue.load")}>
          <div className="queue-card">
            <img className="queue-logo" src="/images/logo-nba.png" alt="" />
            <div className="queue-bar" aria-hidden="true"><span /></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
