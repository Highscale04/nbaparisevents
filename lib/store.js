import { BILLETS, plafond } from "./data";

export const CLE_PANIER = "paris-game-2027-panier";
export const CLE_COMMANDE = "paris-game-2027-commande";
export const CLE_COMMANDES = "paris-game-2027-commandes";
export const CLE_COMPTE = "paris-game-2027-compte";
export const CLE_SESSION = "paris-game-2027-session";
export const CLE_LANG = "paris-game-lang";

export function lirePanier() {
  try {
    return JSON.parse(localStorage.getItem(CLE_PANIER)) || {};
  } catch {
    return {};
  }
}

export function sauverPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
}

export function totalArticles(panier = lirePanier()) {
  return Object.values(panier).reduce((n, q) => n + q, 0);
}

export function assainir(panier) {
  const suivant = { ...panier };
  let corrige = false;
  Object.keys(suivant).forEach((id) => {
    const max = plafond(id);
    if (max < 1) {
      delete suivant[id];
      corrige = true;
    } else if (suivant[id] > max) {
      suivant[id] = max;
      corrige = true;
    }
  });
  return corrige ? suivant : panier;
}

export function detailDe(panier, texte) {
  const lignes = Object.entries(panier)
    .map(([id, qte]) => {
      const billet = BILLETS.find((b) => b.id === id);
      const max = plafond(id);
      if (!billet || max < 1) return null;
      const q = Math.min(max, qte);
      return {
        ...billet,
        nom: texte(billet.nom),
        tag: texte(billet.tag),
        qte: q,
        sousTotal: billet.prix * q
      };
    })
    .filter(Boolean);
  const total = lignes.reduce((n, l) => n + l.sousTotal, 0);
  return { lignes, total };
}

export function euros(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

export function eurosRonds(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function lireCompte() {
  try {
    return JSON.parse(localStorage.getItem(CLE_COMPTE)) || null;
  } catch {
    return null;
  }
}

export function lireSession() {
  return localStorage.getItem(CLE_SESSION) || "";
}

export function connecter(email) {
  localStorage.setItem(CLE_SESSION, email);
}

export function deconnecter() {
  localStorage.removeItem(CLE_SESSION);
}

export function lireCommandes() {
  try {
    return JSON.parse(localStorage.getItem(CLE_COMMANDES)) || [];
  } catch {
    return [];
  }
}

export function sauverCommandes(liste) {
  localStorage.setItem(CLE_COMMANDES, JSON.stringify(liste));
}

export function commandesCompte(email) {
  return lireCommandes().filter((c) => c.acheteur && c.acheteur.email === email);
}

export function creerCompte({ prenom, nom, email, ville, mdp }) {
  const propre = email.trim().toLowerCase();
  if (lireCompte()) return "exists";
  if (mdp.length < 8) return "short";
  const compte = { prenom: prenom.trim(), nom: nom.trim(), email: propre, ville: ville.trim(), mdp };
  localStorage.setItem(CLE_COMPTE, JSON.stringify(compte));
  connecter(propre);
  return "";
}

export function entrerCompte(email, mdp) {
  const compte = lireCompte();
  const propre = email.trim().toLowerCase();
  if (!compte || compte.email !== propre || compte.mdp !== mdp) return false;
  connecter(propre);
  return true;
}

export function nouveauMdp(email, mdp) {
  const compte = lireCompte();
  const propre = email.trim().toLowerCase();
  if (!compte || compte.email !== propre) return "unknown";
  if (mdp.length < 8) return "short";
  compte.mdp = mdp;
  localStorage.setItem(CLE_COMPTE, JSON.stringify(compte));
  return "";
}

export function majCompte(suivant) {
  const ancien = lireCompte();
  if (!ancien) return "unknown";
  const email = suivant.email.trim().toLowerCase();
  if (ancien.email !== email) {
    const liste = lireCommandes().map((c) => {
      if (c.acheteur && c.acheteur.email === ancien.email) {
        c.acheteur.email = email;
        c.acheteur.prenom = suivant.prenom.trim();
        c.acheteur.nom = suivant.nom.trim();
        c.acheteur.ville = suivant.ville.trim();
      }
      return c;
    });
    sauverCommandes(liste);
  }
  const compte = {
    ...ancien,
    prenom: suivant.prenom.trim(),
    nom: suivant.nom.trim(),
    email,
    ville: suivant.ville.trim()
  };
  localStorage.setItem(CLE_COMPTE, JSON.stringify(compte));
  connecter(email);
  return "";
}
