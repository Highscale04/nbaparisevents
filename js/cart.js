const CLE = "paris-game-2027-panier";

function lirePanier() {
  try {
    return JSON.parse(localStorage.getItem(CLE)) || {};
  } catch {
    return {};
  }
}

function sauverPanier(panier) {
  localStorage.setItem(CLE, JSON.stringify(panier));
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(totalArticles(panier));
  });
}

function totalArticles(panier = lirePanier()) {
  return Object.values(panier).reduce((n, q) => n + q, 0);
}

function trouverBillet(id) {
  return BILLETS.find((b) => b.id === id);
}

function ajouter(id, quantite) {
  const billet = trouverBillet(id);
  const max = plafond(id);
  if (!billet || quantite < 1 || max < 1) return;
  const panier = lirePanier();
  const deja = panier[id] || 0;
  panier[id] = Math.min(max, deja + quantite);
  sauverPanier(panier);
}

function definirQuantite(id, quantite) {
  const panier = lirePanier();
  const max = plafond(id);
  if (quantite <= 0 || max < 1) delete panier[id];
  else panier[id] = Math.min(max, quantite);
  sauverPanier(panier);
}

function viderPanier() {
  sauverPanier({});
}

function detailPanier() {
  const panier = lirePanier();
  let corrige = false;
  const lignes = Object.entries(panier)
    .map(([id, qte]) => {
      const billet = trouverBillet(id);
      const max = plafond(id);
      if (!billet || max < 1) {
        delete panier[id];
        corrige = true;
        return null;
      }
      const q = Math.min(max, qte);
      if (q !== qte) {
        panier[id] = q;
        corrige = true;
      }
      return { ...billet, nom: texte(billet.nom), tag: texte(billet.tag), description: texte(billet.description), qte: q, sousTotal: billet.prix * q };
    })
    .filter(Boolean);
  if (corrige) sauverPanier(panier);
  const total = lignes.reduce((n, l) => n + l.sousTotal, 0);
  return { lignes, total };
}

function euros(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function assainirPanier() {
  const panier = lirePanier();
  let corrige = false;
  Object.keys(panier).forEach((id) => {
    const max = plafond(id);
    if (max < 1) {
      delete panier[id];
      corrige = true;
    } else if (panier[id] > max) {
      panier[id] = max;
      corrige = true;
    }
  });
  if (corrige) sauverPanier(panier);
}

assainirPanier();

function assainirPanier() {
  const panier = lirePanier();
  let corrige = false;
  Object.keys(panier).forEach((id) => {
    const max = plafond(id);
    if (max < 1) {
      delete panier[id];
      corrige = true;
    } else if (panier[id] > max) {
      panier[id] = max;
      corrige = true;
    }
  });
  if (corrige) sauverPanier(panier);
}

assainirPanier();
