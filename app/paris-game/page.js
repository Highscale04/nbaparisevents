"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { BILLETS, epuise, plafond } from "@/lib/data";
import { bowlMarkup } from "@/lib/bowl";
import { eurosRonds } from "@/lib/store";
import { useCart, useI18n } from "@/lib/providers";

const ETOILE = "M12 2.7 14.8 8.6l6.5.6-4.9 4.2 1.5 6.3L12 16.7 6.1 19.7l1.5-6.3L2.7 9.2l6.5-.6L12 2.7z";
const OEIL = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.2 10-6.2S22 12 22 12s-3.6 6.2-10 6.2S2 12 2 12z" /><circle cx="12" cy="12" r="2.4" /></svg>
);
const CARTES = [
  ["grand-hall", "/images/vues/grand-hall.jpg", "hall", "Grand Hall", "cat.4"],
  ["seine", "/images/vues/seine.jpg", "seine", "Seine", "cat.3"],
  ["studio", "/images/vues/studio.jpg", "studio", "Studio", "cat.2"],
  ["boulevard", "/images/vues/boulevard.jpg", "blvd", "Boulevard", "cat.1"],
  ["loges", "/images/vues/loges.jpg", "loges", null, "cat.premium"],
  ["parquet", "/images/vues/rang-b.jpg", "rang", null, "cat.courtside"]
];
const COUP = new Date("2027-01-14T20:30:00+01:00").getTime();

export default function TicketsPage() {
  const { t, texte, lang } = useI18n();
  const { ajouter } = useCart();
  const router = useRouter();
  const versPanier = useRef(false);
  const cadreRef = useRef(null);
  const [zone, setZone] = useState("boulevard");
  const [bloc, setBloc] = useState("");
  const [qte, setQte] = useState(1);
  const [ouvert, setOuvert] = useState(false);
  const [toast, setToast] = useState("");
  const [reste, setReste] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const [frais, setFrais] = useState(false);
  const [monte, setMonte] = useState(false);
  const zoom = useRef({ scale: 1, tx: 0, ty: 0, ignorer: false });

  useEffect(() => {
    const hash = location.hash.slice(1);
    if (BILLETS.some((b) => b.id === hash)) setZone(hash);
  }, []);

  useEffect(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const tic = () => {
      const s = Math.max(0, Math.floor((COUP - Date.now()) / 1000));
      setReste({
        d: String(Math.floor(s / 86400)),
        h: pad(Math.floor((s % 86400) / 3600)),
        m: pad(Math.floor((s % 3600) / 60)),
        s: pad(s % 60)
      });
    };
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => setMonte(true), []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOuvert(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const body = document.body;
    body.classList.toggle("pass-open", ouvert);
    if (!ouvert) return;
    const y = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    const caler = () => {
      const vv = window.visualViewport;
      const haut = vv ? vv.offsetTop : 0;
      const taille = vv ? vv.height : window.innerHeight;
      document.querySelectorAll(".pass-pop, .pass-pop-back").forEach((el) => {
        el.style.top = `${haut}px`;
        el.style.left = "0";
        el.style.right = "0";
        el.style.bottom = "auto";
        el.style.width = "100%";
        el.style.height = `${taille}px`;
      });
    };
    caler();
    window.visualViewport?.addEventListener("resize", caler);
    window.visualViewport?.addEventListener("scroll", caler);
    return () => {
      window.visualViewport?.removeEventListener("resize", caler);
      window.visualViewport?.removeEventListener("scroll", caler);
      body.classList.remove("pass-open");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      document.querySelectorAll(".pass-pop, .pass-pop-back").forEach((el) => {
        el.style.top = "";
        el.style.left = "";
        el.style.right = "";
        el.style.bottom = "";
        el.style.width = "";
        el.style.height = "";
      });
      const html = document.documentElement;
      const avant = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, versPanier.current ? 0 : y);
      html.style.scrollBehavior = avant;
    };
  }, [ouvert]);

  useEffect(() => {
    const cadre = cadreRef.current;
    const plan = cadre.querySelector(".bowl");
    if (!cadre || !plan) return;
    const z = zoom.current;
    const doigts = new Map();
    let geste = null;
    const mobile = () => window.matchMedia("(max-width: 860px)").matches;
    const poser = () => {
      if (!mobile()) {
        plan.style.transform = "";
        z.scale = 1;
        z.tx = 0;
        z.ty = 0;
        return;
      }
      const fw = cadre.clientWidth;
      const fh = cadre.clientHeight;
      const vb = plan.viewBox.baseVal;
      const large = fw * z.scale;
      const haut = fw * (vb.height / vb.width) * z.scale;
      z.tx = large <= fw ? (fw - large) / 2 : Math.min(0, Math.max(fw - large, z.tx));
      z.ty = haut <= fh ? (fh - haut) / 2 : Math.min(0, Math.max(fh - haut, z.ty));
      plan.style.transform = `translate(${z.tx}px, ${z.ty}px) scale(${z.scale})`;
    };
    const zoomer = (suivant, cx, cy, doux) => {
      if (!mobile()) return;
      plan.classList.toggle("is-smooth", Boolean(doux));
      const rect = cadre.getBoundingClientRect();
      const px = (cx == null ? rect.left + rect.width / 2 : cx) - rect.left;
      const py = (cy == null ? rect.top + rect.height / 2 : cy) - rect.top;
      const visee = Math.min(3.2, Math.max(1, suivant));
      const ox = (px - z.tx) / z.scale;
      const oy = (py - z.ty) / z.scale;
      z.scale = visee;
      z.tx = px - ox * z.scale;
      z.ty = py - oy * z.scale;
      poser();
    };
    cadre.zoomer = zoomer;
    const down = (e) => {
      if (!mobile() || e.target.closest(".zoom-ui")) return;
      plan.classList.remove("is-smooth");
      doigts.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
      if (doigts.size === 1) geste = { tx: z.tx, ty: z.ty, x: e.clientX, y: e.clientY, bouge: false, scale: z.scale };
      if (doigts.size === 2) {
        const pts = [...doigts.values()];
        geste = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1, scale: z.scale, bouge: true };
      }
    };
    const move = (e) => {
      if (!doigts.has(e.pointerId) || !geste) return;
      const ancien = doigts.get(e.pointerId);
      doigts.set(e.pointerId, { ...ancien, x: e.clientX, y: e.clientY });
      if (doigts.size >= 2) {
        const pts = [...doigts.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
        zoomer(geste.scale * (dist / geste.dist), (pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
        geste.bouge = true;
        return;
      }
      const dx = e.clientX - geste.x;
      const dy = e.clientY - geste.y;
      if (Math.hypot(e.clientX - ancien.sx, e.clientY - ancien.sy) > 8) geste.bouge = true;
      if (z.scale > 1 && geste.bouge) {
        z.tx = geste.tx + dx;
        z.ty = geste.ty + dy;
        poser();
      }
    };
    const up = (e) => {
      const courant = geste;
      doigts.delete(e.pointerId);
      if (doigts.size === 0) {
        if (courant && courant.bouge) z.ignorer = true;
        geste = null;
      }
    };
    cadre.addEventListener("pointerdown", down);
    cadre.addEventListener("pointermove", move);
    cadre.addEventListener("pointerup", up);
    cadre.addEventListener("pointercancel", up);
    window.addEventListener("resize", poser);
    return () => {
      cadre.removeEventListener("pointerdown", down);
      cadre.removeEventListener("pointermove", move);
      cadre.removeEventListener("pointerup", up);
      cadre.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", poser);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  function choisir(id, blocSuivant) {
    if (!BILLETS.some((b) => b.id === id)) return;
    setZone(id);
    setBloc(blocSuivant || "");
    setQte(1);
    history.replaceState(null, "", "#" + id);
    setFrais(true);
  }

  function onCarte(e, id) {
    if (epuise(id)) return;
    const voir = e.target.closest("[data-voir]");
    choisir(id, "");
    if (voir) {
      const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cadreRef.current?.scrollIntoView({ behavior: doux ? "smooth" : "auto", block: "start" });
      return;
    }
    setOuvert(true);
  }

  function onPlan(e) {
    if (zoom.current.ignorer) {
      zoom.current.ignorer = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const zoomBtn = e.target.closest("[data-zoom]");
    if (zoomBtn && cadreRef.current.zoomer) {
      cadreRef.current.zoomer(zoom.current.scale * (zoomBtn.dataset.zoom === "in" ? 1.35 : 1 / 1.35), null, null, true);
      return;
    }
    const bouton = e.target.closest("[data-zone]");
    if (!bouton || bouton.closest("[data-legend]")) return;
    choisir(bouton.dataset.zone, bouton.dataset.bloc || "");
  }

  const billet = BILLETS.find((b) => b.id === zone);
  const complet = epuise(zone);

  function ajouterPlace() {
    ajouter(zone, qte);
    versPanier.current = true;
    setOuvert(false);
    router.push("/panier");
  }

  return (
    <main className="arena-page">
      <div className="drift" aria-hidden="true">
        <span style={{ "--x": "7%", "--s": "72px", "--t": "32s", "--d": "-8s" }}><img src="/images/motion/eiffel.svg" alt="" /></span>
        <span className="ball" style={{ "--x": "22%", "--s": "58px", "--t": "22s", "--d": "-4s" }}><img src="/images/motion/basket.svg" alt="" /></span>
        <span className="ghost" style={{ "--x": "80%", "--s": "64px", "--t": "36s", "--d": "-16s" }}><img src="/images/motion/eiffel-silhouette.svg" alt="" /></span>
        <span className="ball" style={{ "--x": "90%", "--s": "40px", "--t": "18s", "--d": "-11s" }}><img src="/images/motion/basket.svg" alt="" /></span>
        <span style={{ "--x": "46%", "--s": "84px", "--t": "40s", "--d": "-24s" }}><img src="/images/motion/eiffel.svg" alt="" /></span>
        <span className="ball" style={{ "--x": "62%", "--s": "48px", "--t": "26s", "--d": "-6s" }}><img src="/images/motion/basket.svg" alt="" /></span>
        <span className="ghost" style={{ "--x": "34%", "--s": "50px", "--t": "28s", "--d": "-19s" }}><img src="/images/motion/eiffel-silhouette.svg" alt="" /></span>
        <span className="ball" style={{ "--x": "14%", "--s": "34px", "--t": "20s", "--d": "-14s" }}><img src="/images/motion/basket.svg" alt="" /></span>
      </div>
      <section className="offer">
        <img className="offer-art" src={`/${t("tickets.art")}`} width="819" height="617" alt={t("tickets.artAlt")} />
        <p className="offer-kicker">{t("tickets.kicker")}</p>
        <h1>{t("tickets.offer")}</h1>
        <ul className="offer-meta">
          <li><span>{t("tickets.date")}</span></li>
          <li><span>{t("tickets.city")}</span></li>
          <li><span>Accor Arena</span></li>
        </ul>
        <p className="offer-lead">{t("tickets.lead")}</p>
        <p className="board">
          <span><b>{reste.d}</b><i>{t("tickets.days")}</i></span>
          <span><b>{reste.h}</b><i>{t("tickets.hours")}</i></span>
          <span><b>{reste.m}</b><i>{t("tickets.mins")}</i></span>
          <span><b>{reste.s}</b><i>{t("tickets.secs")}</i></span>
        </p>
      </section>
      <section className="arena-stage">
        <div className="map-scroll" ref={cadreRef} onClick={onPlan}>
          <Bowl zone={zone} bloc={bloc} lang={lang} t={t} />
          <div className="zoom-ui">
            <button type="button" data-zoom="in" aria-label={t("tickets.zoomIn")}>+</button>
            <button type="button" data-zoom="out" aria-label={t("tickets.zoomOut")}>−</button>
          </div>
        </div>
        <section className="seat-faq" aria-labelledby="seat-faq-title">
          <h2 id="seat-faq-title">{t("seat.h")}</h2>
          <Faq questions={[["seat.q1", "seat.a1"], ["seat.q2", "seat.a2"], ["seat.q3", "seat.a3"], ["seat.q4", "seat.a4"], ["seat.q5", "seat.a5"]]} t={t} />
        </section>
        <div className="map-legend" role="list">
          {CARTES.map(([id, src, crop, nom, cat]) => {
            const item = BILLETS.find((b) => b.id === id);
            const out = epuise(id);
            return (
              <article key={id} className={["view-card", zone === id ? "is-key" : "", out ? "is-out" : ""].filter(Boolean).join(" ")} role="listitem" data-zone={id} onClick={(e) => onCarte(e, id)}>
                <img className="view" src={src} alt="" data-crop={crop} />
                {out ? <span className="sold-stamp">{t("tickets.sold")}</span> : null}
                <span className="view-body">
                  <span className="view-top">
                    <span className="view-cat">
                      <small>{t(cat)}</small>
                      {out ? <span className="sold-chip">{t("tickets.sold")}</span> : null}
                    </span>
                    <b>{eurosRonds(item.prix)}</b>
                  </span>
                  <strong className="view-place"><span>{nom || (id === "loges" ? t("zone.loges") : t("tickets.rowb"))}</span></strong>
                  <span className="view-score">
                    <span className="stars" role="img" aria-label={t("tickets.stars").replace("{n}", String(item.etoiles))}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} className={i < item.etoiles ? "on" : "off"} viewBox="0 0 24 24" aria-hidden="true"><path d={ETOILE} /></svg>
                      ))}
                    </span>
                    <span className={`view-eye is-${item.vue}`} role="img" aria-label={t("tickets.view" + item.vue)}>{OEIL}</span>
                    {out ? null : (
                      <button type="button" className="view-where" data-voir>{t("tickets.where")}</button>
                    )}
                  </span>
                  <p className="view-resume">{texte(item.resume)}</p>
                  <span className="view-actions">
                    {out ? (
                      <span className="view-sold">{t("tickets.soldCat")}</span>
                    ) : (
                      <button type="button" className="view-select">{t("tickets.select")}</button>
                    )}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      </section>

      {monte ? createPortal(<div className="pass-pop" hidden={!ouvert}>
        <button type="button" className="pass-pop-back" aria-label={t("tickets.close")} onClick={() => setOuvert(false)} />
        <div className="pass-pop-card" role="dialog" aria-modal="true" aria-labelledby="pass-title">
          <img className="pass-atmos pass-atmos-tower" src="/images/motion/eiffel-silhouette.svg" alt="" />
          <img className="pass-atmos pass-atmos-ball" src="/images/motion/basket.svg" alt="" />
          <button type="button" className="pass-pop-x" aria-label={t("tickets.close")} onClick={() => setOuvert(false)}>×</button>
          <div className="pass-pop-scroll">
            <article className={complet ? "pass is-out is-fresh" : frais ? "pass is-fresh" : "pass"} id="fiche">
              <img className="pass-players" src="/images/joueurs.png" alt="" />
              <div className="pass-face">
                <div className="pass-blue">
                  <div className="pass-brand">
                    <img src="/images/logo-nba.png" alt="NBA" />
                    <p><span>Paris</span><span>Game 2027</span></p>
                  </div>
                  <p className="pass-by">Presented by <img src="/images/sponsors/tissot.svg" alt="Tissot" /></p>
                  <p className="ticket-tag">{texte(billet.tag)}</p>
                  <h2 id="pass-title">{texte(billet.nom)}</h2>
                  <p className="pass-lead">{texte(billet.resume)}</p>
                  <p className="pass-meta"><span>{t("tickets.blocks")}</span> {billet.blocs}</p>
                  {bloc ? <p className="pass-meta"><span>{t("tickets.picked")}</span> {bloc}</p> : null}
                  <div className="pass-buy">
                    {complet ? (
                      <>
                        <p className="sold-ribbon">{t("tickets.sold")}</p>
                        <p className="price">{eurosRonds(billet.prix)} <span>{t("tickets.sold")}</span></p>
                        <p className="stock">{t("tickets.soldLead")}</p>
                      </>
                    ) : (
                      <>
                        <p className="price">{eurosRonds(billet.prix * qte)} <span>{billet.id === "loges" ? t("tickets.logePrice") : (qte > 1 ? `${qte} ${t("tickets.stock")}` : t("home.per"))}</span></p>
                        {billet.id === "loges" ? null : (
                          <div className="qty">
                            <button type="button" aria-label="−" onClick={() => setQte((n) => Math.max(1, n - 1))}>−</button>
                            <span>{qte}</span>
                            <button type="button" aria-label="+" onClick={() => setQte((n) => Math.min(plafond(zone), n + 1))}>+</button>
                          </div>
                        )}
                        <button className="btn btn-red" type="button" onClick={ajouterPlace}>{t("tickets.add")}</button>
                      </>
                    )}
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
          </div>
        </div>
      </div>, document.body) : null}
      {monte && toast ? createPortal(
        <div className="cart-toast is-on" role="status">
          <span className="cart-toast-mark" aria-hidden="true">✓</span>
          <span>{toast}</span>
        </div>,
        document.body
      ) : null}
    </main>
  );
}

const Bowl = memo(function Bowl({ zone, bloc, lang, t }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll(".sec, .rangb, .loge-hit").forEach((el) => {
      const memeZone = el.dataset.zone === zone;
      const memeBloc = !bloc || el.dataset.bloc === bloc;
      el.classList.toggle("is-on", memeZone && memeBloc);
      el.classList.toggle("is-zone", memeZone && Boolean(bloc) && !memeBloc);
      el.classList.toggle("is-sold", epuise(el.dataset.zone));
      el.setAttribute("aria-pressed", String(memeZone && memeBloc));
    });
  }, [zone, bloc, lang, t]);
  return <div ref={ref} style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: bowlMarkup }} />;
});

function Faq({ questions, t }) {
  return (
    <div className="faq" onToggle={(e) => {
      const item = e.target;
      if (!item.open) return;
      item.parentElement.querySelectorAll("details").forEach((autre) => {
        if (autre !== item) autre.open = false;
      });
    }}>
      {questions.map(([q, a]) => (
        <details key={q}><summary>{t(q)}</summary><p>{t(a)}</p></details>
      ))}
    </div>
  );
}
