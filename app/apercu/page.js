"use client";

import { useState } from "react";
import { EXEMPLE_COMMANDE, htmlFacture, htmlMotDePasse } from "@/lib/mails";

export default function ApercuMails() {
  const [langue, setLangue] = useState("fr");
  const commande = { ...EXEMPLE_COMMANDE, langue };

  return (
    <main className="apercu">
      <header className="apercu-head">
        <p>Aperçu</p>
        <h1>Facture, mot de passe, e-billet.</h1>
        <div className="apercu-lang">
          <button type="button" className={langue === "fr" ? "is-on" : ""} onClick={() => setLangue("fr")}>FR</button>
          <button type="button" className={langue === "en" ? "is-on" : ""} onClick={() => setLangue("en")}>EN</button>
        </div>
      </header>

      <section>
        <h2>1 · Mail de facturation</h2>
        <iframe title="Mail de facturation" srcDoc={htmlFacture(commande)} />
      </section>

      <section>
        <h2>2 · Mail du mot de passe</h2>
        <iframe title="Mail du mot de passe" srcDoc={htmlMotDePasse(commande)} />
      </section>

      <section>
        <h2>3 · E-billet PDF</h2>
        <iframe key={langue} className="apercu-pdf" title="E-billet PDF" src={`/apercu/ebillet?langue=${langue}`} />
      </section>

      <section>
        <h2>4 · Scan QR — billet valide</h2>
        <iframe className="apercu-pdf" title="Page de validité" src="/apercu/validite" />
      </section>
    </main>
  );
}
