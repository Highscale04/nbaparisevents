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
  if (!billet || quantite < 1) return;
  const panier = lirePanier();
  const deja = panier[id] || 0;
  panier[id] = Math.min(STOCK[id], deja + quantite);
  sauverPanier(panier);
}

function definirQuantite(id, quantite) {
  const panier = lirePanier();
  if (quantite <= 0) delete panier[id];
  else panier[id] = Math.min(STOCK[id], quantite);
  sauverPanier(panier);
}

function viderPanier() {
  sauverPanier({});
}

function detailPanier() {
  const panier = lirePanier();
  const lignes = Object.entries(panier)
    .map(([id, qte]) => {
      const billet = trouverBillet(id);
      if (!billet) return null;
      return { ...billet, nom: texte(billet.nom), tag: texte(billet.tag), description: texte(billet.description), qte, sousTotal: billet.prix * qte };
    })
    .filter(Boolean);
  const total = lignes.reduce((n, l) => n + l.sousTotal, 0);
  return { lignes, total };
}

function euros(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}
