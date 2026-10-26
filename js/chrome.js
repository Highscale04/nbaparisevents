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
  const fichier = location.pathname.split("/").pop() || "index.html";
  return fichier === "" ? "index.html" : fichier;
}

function monterChrome() {
  const ici = pageCourante();
  const liens = PAGES.map((p) => {
    const courant = p.href === ici ? ' aria-current="page"' : "";
    return `<a href="${p.href}" data-i18n="${p.key}"${courant}></a>`;
  }).join("");
  const code = langue().toUpperCase();
  const offre = ici === "billets.html";
  const menu = offre
    ? `<button class="menu-btn menu-word" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><em data-i18n="nav.menu">Menu</em></button>`
    : "";
  const hamburger = offre
    ? ""
    : `<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu"><span></span><span></span><span></span></button>`;
  const panier = offre ? `<a class="cart-link" href="panier.html" data-i18n="nav.cart">Panier</a>` : "";

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="nav${offre ? " nav-clear" : ""}">
      <div class="nav-inner">
        ${menu}
        <a class="logo${offre ? " logo-xp" : ""}" href="index.html" aria-label="${offre ? "NBA" : "NBA Paris Game 2027"}">
          <img src="${offre ? "images/logo-nba.png" : "images/logo-paris-2027.png"}" alt="${offre ? "NBA" : "NBA Paris Game 2027, presented by Tissot"}">
        </a>
        <nav class="links" id="nav-links">
          ${liens}
        </nav>
        <div class="nav-tools">
          ${panier}
          <a class="account-link" href="compte.html"${ici === "compte.html" ? ' aria-current="page"' : ""}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.2 19.2c1.3-3 3.7-4.5 6.8-4.5s5.5 1.5 6.8 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <span data-i18n="nav.account">Espace client</span>
          </a>
          <div class="lang">
            <button class="lang-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Langue">${code}</button>
            <div class="lang-menu" hidden>
              <button type="button" data-set-lang="fr">FR</button>
              <button type="button" data-set-lang="en">EN</button>
            </div>
          </div>
          ${hamburger}
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

  const langBtn = document.querySelector(".lang-btn");
  const langMenu = document.querySelector(".lang-menu");
  langBtn.addEventListener("click", () => {
    const ouvert = langMenu.hasAttribute("hidden");
    langMenu.toggleAttribute("hidden", !ouvert);
    langBtn.setAttribute("aria-expanded", String(ouvert));
  });
  langMenu.addEventListener("click", (e) => {
    const choix = e.target.closest("[data-set-lang]");
    if (!choix) return;
    choisirLangue(choix.dataset.setLang);
    langMenu.hidden = true;
    langBtn.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang")) {
      langMenu.hidden = true;
      langBtn.setAttribute("aria-expanded", "false");
    }
  });

  if (offre) {
    const barre = document.querySelector(".nav-clear");
    const seuil = 280;
    let frame = 0;
    const couleurs = [[0, [226, 24, 66]], [70, [196, 22, 72]], [220, [122, 40, 96]], [420, [42, 44, 98]], [640, [20, 38, 78]], [900, [11, 24, 52]], [1400, [0, 0, 0]]];
    let theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) {
      theme = document.createElement("meta");
      theme.name = "theme-color";
      document.head.appendChild(theme);
    }
    const teinte = (y) => {
      let a = couleurs[0];
      let b = couleurs[couleurs.length - 1];
      for (let i = 0; i < couleurs.length - 1; i++) {
        if (y >= couleurs[i][0] && y <= couleurs[i + 1][0]) {
          a = couleurs[i];
          b = couleurs[i + 1];
          break;
        }
      }
      const p = Math.min(1, Math.max(0, (y - a[0]) / (b[0] - a[0] || 1)));
      const c = a[1].map((v, i) => Math.round(v + (b[1][i] - v) * p));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    };
    const ombrer = () => {
      frame = 0;
      const y = window.scrollY;
      const t = Math.min(1, Math.max(0, y / seuil));
      barre.style.setProperty("--shade", t.toFixed(3));
      theme.content = teinte(y);
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
