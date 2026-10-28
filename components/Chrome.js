"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart, useI18n } from "@/lib/providers";

const LIENS = [
  { href: "/equipes", key: "nav.teams" },
  { href: "/faq", key: "nav.faq" }
];

const SPONSORS = [
  ["/images/sponsors/tissot.svg", "Tissot"],
  ["/images/sponsors/aws.png", "AWS"],
  ["/images/sponsors/amex.svg", "American Express"],
  ["/images/sponsors/emirates.svg", "Emirates"],
  ["/images/sponsors/footlocker.svg", "Foot Locker"],
  ["/images/sponsors/2k.svg", "NBA 2K27"],
  ["/images/sponsors/nike.svg", "Nike"],
  ["/images/sponsors/c4.svg", "C4 Energy"],
  ["/images/sponsors/sprite.svg", "Sprite"],
  ["/images/sponsors/unibet.svg", "Unibet"]
];

const PAGES = {
  "/": "home",
  "/paris-game": "tickets",
  "/panier": "cart",
  "/confirmation": "confirm",
  "/compte": "account",
  "/equipes": "teams",
  "/faq": "faq",
  "/experiences": "experiences",
  "/mentions": "legal"
};

const FR = `<svg class="flag" viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#0055a4"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ef4135"/></svg>`;
const EN = `<svg class="flag" viewBox="0 0 60 30" aria-hidden="true"><rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#fff" stroke-width="8"/><path d="M0 0L60 30M60 0L0 30" stroke="#C8102E" stroke-width="4"/><path d="M30 0V30M0 15H60" stroke="#fff" stroke-width="14"/><path d="M30 0V30M0 15H60" stroke="#C8102E" stroke-width="8"/></svg>`;

export function Chrome({ children }) {
  const pathname = usePathname();
  const { t, lang, setLang } = useI18n();
  const { count, pulse } = useCart();
  const [ouvert, setOuvert] = useState(false);
  const [pop, setPop] = useState(false);
  const page = PAGES[pathname] || "";
  const offre = page === "tickets" || page === "cart";
  const nba = offre || page === "account";

  useEffect(() => {
    document.body.dataset.page = page;
    document.body.classList.toggle("motion", page === "home");
    const cle = `title.${page}`;
    const valeur = t(cle);
    if (valeur && valeur !== cle) document.title = valeur;
    setOuvert(false);
  }, [page, t]);

  useEffect(() => {
    if (!offre) return;
    const barre = document.querySelector(".nav-clear");
    let theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) {
      theme = document.createElement("meta");
      theme.name = "theme-color";
      document.head.appendChild(theme);
    }
    let frame = 0;
    const ombrer = () => {
      frame = 0;
      const teinte = Math.min(1, Math.max(0, window.scrollY / 220));
      const panier = document.body.dataset.page === "cart";
      if (barre) barre.style.setProperty("--shade", panier ? "1" : teinte.toFixed(3));
      theme.content = panier || teinte > 0.55 ? "#000000" : "#e21842";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(ombrer);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    ombrer();
    return () => window.removeEventListener("scroll", onScroll);
  }, [offre, pathname]);

  useEffect(() => {
    if (!pulse) return;
    setPop(true);
    const id = setTimeout(() => setPop(false), 480);
    return () => clearTimeout(id);
  }, [pulse]);

  useEffect(() => {
    if (page !== "home") return;
    const zones = document.querySelectorAll(".skyline, .xp-band");
    if (!("IntersectionObserver" in window)) {
      zones.forEach((zone) => zone.classList.add("is-in"));
      return;
    }
    const vu = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        vu.unobserve(entry.target);
      });
    }, { threshold: 0.28 });
    zones.forEach((zone) => vu.observe(zone));
    return () => vu.disconnect();
  }, [page, pathname]);

  const menu = (
    <button className="menu-btn" type="button" aria-expanded={ouvert} aria-controls="nav-links" aria-label={t("nav.menu")} onClick={() => setOuvert((v) => !v)}>
      <span /><span /><span />
    </button>
  );

  return (
    <>
      <header className={offre ? "nav nav-clear" : nba ? "nav nav-account" : "nav"}>
        <div className="nav-inner">
          {nba ? menu : null}
          <Link className={nba ? "logo logo-xp" : "logo"} href="/" aria-label={nba ? "NBA" : "NBA Paris Game 2027"}>
            <img src={nba ? "/images/logo-nba.png" : "/images/logo-paris-2027.png"} alt={nba ? "NBA" : "NBA Paris Game 2027, presented by Tissot"} />
          </Link>
          <nav className={ouvert ? "links open" : "links"} id="nav-links">
            {LIENS.map((lien) => (
              <Link key={lien.href} href={lien.href} aria-current={pathname === lien.href ? "page" : undefined}>{t(lien.key)}</Link>
            ))}
            <Link className="account-link" href="/compte" aria-current={pathname === "/compte" ? "page" : undefined} aria-label={t("nav.account")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M5.2 19.2c1.3-3 3.7-4.5 6.8-4.5s5.5 1.5 6.8 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <span>{t("nav.account")}</span>
            </Link>
          </nav>
          <div className="nav-tools">
            {nba ? null : menu}
            <button className="lang-btn" type="button" aria-label={t("nav.lang")} onClick={() => setLang(lang === "fr" ? "en" : "fr")} dangerouslySetInnerHTML={{ __html: lang === "en" ? EN : FR }} />
            {page === "home" ? null : (
              <Link className={pop ? "cart-link is-pop" : "cart-link"} href="/panier" aria-current={pathname === "/panier" ? "page" : undefined} aria-label={count > 0 ? `${t("nav.cart")} (${count})` : t("nav.cart")}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 8.2h11.6l-1 11.1a1.3 1.3 0 0 1-1.3 1.2H8.5a1.3 1.3 0 0 1-1.3-1.2l-1-11.1z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 8.2V6.8a3 3 0 0 1 6 0v1.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                <span className="cart-count" hidden={count < 1}>{count}</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      {children}
      <footer className="footer">
        {page === "account" ? null : (
          <div className="sponsors">
            <div className="sponsors-track">
              <div className="sponsors-set">
                {SPONSORS.map(([src, alt]) => <img key={alt} src={src} alt={alt} loading="lazy" decoding="async" />)}
              </div>
              <div className="sponsors-set" aria-hidden="true">
                {SPONSORS.map(([src]) => <img key={src} src={src} alt="" loading="lazy" decoding="async" />)}
              </div>
            </div>
          </div>
        )}
        <div className="footer-legal">
          <img className="footer-nba" src="/images/logo-nba.png" alt="NBA" loading="lazy" decoding="async" />
          <p><strong>{t("footer.copy")}</strong></p>
          <p>
            <a href="https://www.nba.com/privacy-policy" target="_blank" rel="noopener">{t("footer.privacy")}</a>
            {" | "}
            <a href="https://www.nba.com/eeaukprivacy" target="_blank" rel="noopener">{t("footer.eea")}</a>
            {" | "}
            <a href="https://www.nba.com/brazilprivacy" target="_blank" rel="noopener">{t("footer.brazil")}</a>
            {" | "}
            <a href="https://www.nba.com/coprivacy" target="_blank" rel="noopener">{t("footer.colorado")}</a>
            {" | "}
            <a href="https://www.nba.com/caprivacy" target="_blank" rel="noopener">{t("footer.california")}</a>
            {" | "}
            <a href="https://www.nba.com/termsofuse" target="_blank" rel="noopener">{t("footer.terms")}</a>
            {" | "}
            <a href="https://www.nba.com/cookiepolicy" target="_blank" rel="noopener">{t("footer.cookies")}</a>
            {" | "}
            <a href="https://www.nba.com/accessibility" target="_blank" rel="noopener">{t("footer.access")}</a>
            {" | "}
            <a href="https://support.watch.nba.com/hc/en-us" target="_blank" rel="noopener">{t("footer.support")}</a>
          </p>
          <p>
            <span>{t("footer.help.before")}</span>
            <a href="https://www.nba.com/accessibility" target="_blank" rel="noopener">{t("footer.help.link")}</a>
            <span>{t("footer.help.after")}</span>
          </p>
        </div>
      </footer>
    </>
  );
}
