"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TEXTES } from "./textes";
import { plafond } from "./data";
import { CLE_LANG, assainir, detailDe, lirePanier, sauverPanier, totalArticles } from "./store";

const LangContext = createContext(null);
const CartContext = createContext(null);

export function useI18n() {
  return useContext(LangContext);
}

export function useCart() {
  return useContext(CartContext);
}

export function Providers({ children }) {
  const [lang, setLangState] = useState("fr");
  const [panier, setPanier] = useState({});
  const [pret, setPret] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const code = localStorage.getItem(CLE_LANG) === "en" ? "en" : "fr";
    setLangState(code);
    const propre = assainir(lirePanier());
    sauverPanier(propre);
    setPanier(propre);
    setPret(true);
  }, []);

  const setLang = useCallback((code) => {
    const suivant = code === "en" ? "en" : "fr";
    localStorage.setItem(CLE_LANG, suivant);
    setLangState(suivant);
  }, []);

  const t = useCallback((cle) => (TEXTES[lang] && TEXTES[lang][cle]) || TEXTES.fr[cle] || cle, [lang]);
  const texte = useCallback((valeur) => {
    if (valeur && typeof valeur === "object") return valeur[lang] || valeur.fr;
    return valeur;
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const ecrire = useCallback((suivant) => {
    sauverPanier(suivant);
    setPanier(suivant);
  }, []);

  const ajouter = useCallback((id, quantite) => {
    setPanier((actuel) => {
      const max = plafond(id);
      if (quantite < 1 || max < 1) return actuel;
      const suivant = { ...actuel, [id]: Math.min(max, (actuel[id] || 0) + quantite) };
      sauverPanier(suivant);
      return suivant;
    });
    setPulse((n) => n + 1);
  }, []);

  const definirQuantite = useCallback((id, quantite) => {
    setPanier((actuel) => {
      const suivant = { ...actuel };
      const max = plafond(id);
      if (quantite <= 0 || max < 1) delete suivant[id];
      else suivant[id] = Math.min(max, quantite);
      sauverPanier(suivant);
      return suivant;
    });
  }, []);

  const vider = useCallback(() => ecrire({}), [ecrire]);

  const detail = useMemo(() => detailDe(panier, texte), [panier, texte]);

  const langValue = useMemo(() => ({ lang, setLang, t, texte, pret }), [lang, setLang, t, texte, pret]);
  const cartValue = useMemo(() => ({
    panier,
    count: totalArticles(panier),
    ajouter,
    definirQuantite,
    vider,
    detail,
    pulse
  }), [panier, ajouter, definirQuantite, vider, detail, pulse]);

  return (
    <LangContext.Provider value={langValue}>
      <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
    </LangContext.Provider>
  );
}
