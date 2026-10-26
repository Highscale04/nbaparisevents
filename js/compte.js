const CLE_COMPTE = "paris-game-2027-compte";
const CLE_SESSION = "paris-game-2027-session";
const CLE_COMMANDES = "paris-game-2027-commandes";

function lireCompte() {
  try {
    return JSON.parse(localStorage.getItem(CLE_COMPTE)) || null;
  } catch {
    return null;
  }
}

function lireSession() {
  return localStorage.getItem(CLE_SESSION) || "";
}

function connecter(email) {
  localStorage.setItem(CLE_SESSION, email);
}

function deconnecter() {
  localStorage.removeItem(CLE_SESSION);
}

function lireCommandes() {
  try {
    return JSON.parse(localStorage.getItem(CLE_COMMANDES)) || [];
  } catch {
    return [];
  }
}

function sauverCommandes(liste) {
  localStorage.setItem(CLE_COMMANDES, JSON.stringify(liste));
}

function commandesCompte(email) {
  return lireCommandes().filter((c) => c.acheteur && c.acheteur.email === email);
}

function creerCompte({ prenom, nom, email, ville, mdp }) {
  const propre = email.trim().toLowerCase();
  const actuel = lireCompte();
  if (actuel) return "exists";
  if (mdp.length < 8) return "short";
  const compte = { prenom: prenom.trim(), nom: nom.trim(), email: propre, ville: ville.trim(), mdp };
  localStorage.setItem(CLE_COMPTE, JSON.stringify(compte));
  connecter(propre);
  return "";
}

function entrerCompte(email, mdp) {
  const compte = lireCompte();
  const propre = email.trim().toLowerCase();
  if (!compte || compte.email !== propre || compte.mdp !== mdp) return false;
  connecter(propre);
  return true;
}

function nouveauMdp(email, mdp) {
  const compte = lireCompte();
  const propre = email.trim().toLowerCase();
  if (!compte || compte.email !== propre) return "unknown";
  if (mdp.length < 8) return "short";
  compte.mdp = mdp;
  localStorage.setItem(CLE_COMPTE, JSON.stringify(compte));
  return "";
}

function majCompte(suivant) {
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
