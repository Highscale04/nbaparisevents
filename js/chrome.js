const PAGES = [
  { href: "equipes.html", key: "nav.teams" },
  { href: "faq.html", key: "nav.faq" }
];

const SPONSORS = [
  ["images/sponsors/tissot.svg", "Tissot"],
  ["images/sponsors/aws.png", "AWS"],
  ["images/sponsors/amex.svg", "American Express"],
  ["images/sponsors/emirates.svg", "Emirates"],
  ["images/sponsors/footlocker.svg", "Foot Locker"],
  ["images/sponsors/2k.svg", "NBA 2K27"],
  ["images/sponsors/nike.svg", "Nike"],
  ["images/sponsors/c4.svg", "C4 Energy"],
  ["images/sponsors/sprite.svg", "Sprite"],
  ["images/sponsors/unibet.svg", "Unibet"]
];

function bandeSponsors() {
  const logos = SPONSORS.map(([src, alt]) => `<img src="${src}" alt="${alt}">`).join("");
  const muets = SPONSORS.map(([src]) => `<img src="${src}" alt="">`).join("");
  return `
    <div class="sponsors">
      <div class="sponsors-track">
        <div class="sponsors-set">${logos}</div>
        <div class="sponsors-set" aria-hidden="true">${muets}</div>
      </div>
    </div>
  `;
}

function pageCourante() {
  const bout = decodeURIComponent(location.pathname).split("/").filter(Boolean).pop() || "index";
  if (bout === "index") return "index.html";
  return bout.endsWith(".html") ? bout : `${bout}.html`;
}

function monterChrome() {
  const ici = pageCourante();
  const liens = PAGES.map((p) => {
    const courant = p.href === ici ? ' aria-current="page"' : "";
    return `<a href="${p.href}" data-i18n="${p.key}"${courant}></a>`;
  }).join("");
  const offre = ici === "billets.html" || ici === "panier.html" || document.body.dataset.page === "tickets" || document.body.dataset.page === "cart";
  const menu = `<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav-links"><span></span><span></span><span></span></button>`;
  const panier = `<a class="cart-link" href="panier.html"${ici === "panier.html" ? ' aria-current="page"' : ""} aria-label="Panier"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 8.2h11.6l-1 11.1a1.3 1.3 0 0 1-1.3 1.2H8.5a1.3 1.3 0 0 1-1.3-1.2l-1-11.1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8.2V6.8a3 3 0 0 1 6 0v1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span class="cart-count" data-cart-count hidden>0</span></a>`;
  const compte = `<a class="account-link" href="compte.html"${ici === "compte.html" ? ' aria-current="page"' : ""}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.2 19.2c1.3-3 3.7-4.5 6.8-4.5s5.5 1.5 6.8 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <span data-i18n="nav.account">Espace client</span>
          </a>`;

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="nav${offre ? " nav-clear" : ""}">
      <div class="nav-inner">
        ${offre ? menu : ""}
        <a class="logo${offre ? " logo-xp" : ""}" href="index.html" aria-label="${offre ? "NBA" : "NBA Paris Game 2027"}">
          <img src="${offre ? "images/logo-nba.png" : "images/logo-paris-2027.png"}" alt="${offre ? "NBA" : "NBA Paris Game 2027, presented by Tissot"}">
        </a>
        <nav class="links" id="nav-links">
          ${liens}
          ${compte}
        </nav>
        <div class="nav-tools">
          ${offre ? "" : menu}
          <button class="lang-btn" type="button"></button>
          ${panier}
        </div>
      </div>
    </header>
  `);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
      ${bandeSponsors()}
      <div class="footer-legal">
        <img class="footer-nba" src="images/logo-nba.png" alt="NBA">
        <p><strong data-i18n="footer.copy">© 2026 NBA Media Ventures, LLC. Tous droits réservés.</strong></p>
        <p>
          <a data-i18n="footer.privacy" href="https://www.nba.com/privacy-policy" target="_blank" rel="noopener">Politique de confidentialité</a> |
          <a data-i18n="footer.eea" href="https://www.nba.com/eeaukprivacy" target="_blank" rel="noopener">Déclaration de confidentialité EEE/Royaume-Uni</a> |
          <a data-i18n="footer.brazil" href="https://www.nba.com/brazilprivacy" target="_blank" rel="noopener">Déclaration de confidentialité Brésil</a> |
          <a data-i18n="footer.colorado" href="https://www.nba.com/coprivacy" target="_blank" rel="noopener">Déclaration de confidentialité des consommateurs du Colorado</a> |
          <a data-i18n="footer.california" href="https://www.nba.com/caprivacy" target="_blank" rel="noopener">Déclaration de confidentialité des consommateurs de Californie</a> |
          <a data-i18n="footer.terms" href="https://www.nba.com/termsofuse" target="_blank" rel="noopener">Conditions d’utilisation</a> |
          <a data-i18n="footer.cookies" href="https://www.nba.com/cookiepolicy" target="_blank" rel="noopener">Politique relative aux cookies</a> |
          <a data-i18n="footer.access" href="https://www.nba.com/accessibility" target="_blank" rel="noopener">Accessibilité et sous-titres</a> |
          <a data-i18n="footer.support" href="https://support.watch.nba.com/hc/en-us" target="_blank" rel="noopener">Service client</a>
        </p>
        <p><span data-i18n="footer.help.before">Si vous avez des difficultés à accéder à un contenu de ce site, consultez notre </span><a data-i18n="footer.help.link" href="https://www.nba.com/accessibility" target="_blank" rel="noopener">page Accessibilité</a><span data-i18n="footer.help.after">.</span></p>
      </div>
    </footer>
  `);

  const bouton = document.querySelector(".menu-btn");
  const nav = document.querySelector(".links");
  bouton.addEventListener("click", () => {
    const ouvert = nav.classList.toggle("open");
    bouton.setAttribute("aria-expanded", String(ouvert));
  });

  document.querySelector(".lang-btn").addEventListener("click", () => {
    choisirLangue(langue() === "fr" ? "en" : "fr");
  });

  if (offre) {
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
      const t = Math.min(1, Math.max(0, window.scrollY / 220));
      barre.style.setProperty("--shade", t.toFixed(3));
      theme.content = t > 0.55 ? "#000000" : "#e21842";
    };
    window.addEventListener("scroll", () => {
      if (!frame) frame = requestAnimationFrame(ombrer);
    }, { passive: true });
    ombrer();
  }

  if (ici === "index.html") {
    document.body.classList.add("motion");
    const zones = document.querySelectorAll(".skyline, .xp-band");
    if ("IntersectionObserver" in window) {
      const vu = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          vu.unobserve(entry.target);
        });
      }, { threshold: 0.28 });
      zones.forEach((zone) => vu.observe(zone));
    } else {
      zones.forEach((zone) => zone.classList.add("is-in"));
    }
  }

  appliquerLangue();
  sauverPanier(lirePanier());
}

document.addEventListener("DOMContentLoaded", monterChrome);
document.addEventListener("langue", () => appliquerLangue());
