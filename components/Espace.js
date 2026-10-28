"use client";

import Link from "next/link";
import { useState } from "react";
import { BILLETS } from "@/lib/data";

const TEXTE = {
  fr: {
    hello: "Bonjour",
    inSpace: "dans votre espace",
    ticket: "billet",
    tickets: "billets",
    open: "Ouvrir",
    close: "Fermer",
    out: "Se déconnecter",
    homeKicker: "Espace client",
    homeTitle: "Mon compte",
    homeLead: "Retrouvez vos places, vos commandes et le suivi de vos demandes.",
    cards: ["Billets", "Commandes", "Demandes en cours"],
    shortcuts: [
      ["telecharger", "PDF"],
      ["modifier", "Modifier"],
      ["annuler", "Rembourser"],
      ["aide", "Aide"]
    ],
    groups: [
      ["Mon compte", [
        ["billets", "Mes billets"],
        ["commandes", "Mes commandes"],
        ["informations", "Mes informations"]
      ]],
      ["Gérer mes billets", [
        ["telecharger", "Télécharger mon billet"],
        ["modifier", "Modifier une réservation"],
        ["annuler", "Annuler / demander un remboursement"],
        ["non-recu", "Billet non reçu"]
      ]],
      ["Aide", [
        ["aide", "Centre d’aide"],
        ["contact", "Contacter le service client"],
        ["demandes", "Suivre ma demande"]
      ]],
      ["Paramètres", [
        ["securite", "Sécurité et mot de passe"]
      ]]
    ],
    billetsTitle: "Mes billets",
    billetsLead: "Chaque place a son QR. Présentez-le à l’entrée.",
    download: "Télécharger le PDF",
    ordersTitle: "Mes commandes",
    emptyOrders: "Aucune commande pour le moment.",
    paid: "Payée",
    infoTitle: "Mes informations",
    save: "Enregistrer",
    saved: "Informations enregistrées.",
    first: "Prénom",
    last: "Nom",
    mail: "Adresse e-mail",
    city: "Ville",
    dlTitle: "Télécharger mon billet",
    dlLead: "Le PDF reprend la commande, la tribune et le QR de chaque place.",
    editTitle: "Modifier une réservation",
    editLead: "Décrivez le changement souhaité. La demande reste visible dans le suivi.",
    editPh: "Précisez la modification.",
    send: "Envoyer la demande",
    editOk: "Demande de modification enregistrée.",
    cancelTitle: "Annuler / demander un remboursement",
    cancelLead: "Choisissez la commande et la raison. Le suivi indique l’avancement.",
    reason: "Raison",
    reasons: ["Je ne peux plus venir", "Erreur de catégorie", "Autre"],
    cancelOk: "Demande d’annulation et de remboursement enregistrée.",
    missingTitle: "Billet non reçu",
    missingLead: "Les e-billets sont aussi dans cet espace. Vous pouvez renvoyer le mail.",
    resend: "Renvoyer les e-billets",
    resendOk: "Les e-billets sont renvoyés à",
    helpTitle: "Centre d’aide",
    helpLead: "Les réponses sur l’entrée, les tribunes et la commande sont dans la FAQ.",
    helpLink: "Ouvrir la FAQ",
    contactTitle: "Contacter le service client",
    contactLead: "Écrivez uniquement à cette adresse.",
    message: "Message",
    contactOk: "Message envoyé.",
    trackTitle: "Suivre ma demande",
    trackEmpty: "Aucune demande en cours.",
    trackOpen: "En cours",
    passTitle: "Sécurité et mot de passe",
    passLead: "Le mot de passe actuel est celui reçu par e-mail après la commande.",
    pass: "Nouveau mot de passe",
    pass2: "Confirmer",
    passOk: "Mot de passe mis à jour.",
    passShort: "8 caractères minimum.",
    seat: "Place",
    order: "Commande"
  },
  en: {
    hello: "Hello",
    inSpace: "in your area",
    ticket: "ticket",
    tickets: "tickets",
    open: "Open",
    close: "Close",
    out: "Sign out",
    homeKicker: "Client area",
    homeTitle: "My account",
    homeLead: "Find your seats, your orders and the status of your requests.",
    cards: ["Tickets", "Orders", "Open requests"],
    shortcuts: [
      ["telecharger", "PDF"],
      ["modifier", "Change"],
      ["annuler", "Refund"],
      ["aide", "Help"]
    ],
    groups: [
      ["My account", [
        ["billets", "My tickets"],
        ["commandes", "My orders"],
        ["informations", "My details"]
      ]],
      ["Manage my tickets", [
        ["telecharger", "Download my ticket"],
        ["modifier", "Change a booking"],
        ["annuler", "Cancel / request a refund"],
        ["non-recu", "Ticket not received"]
      ]],
      ["Help", [
        ["aide", "Help centre"],
        ["contact", "Contact support"],
        ["demandes", "Track my request"]
      ]],
      ["Settings", [
        ["securite", "Security and password"]
      ]]
    ],
    billetsTitle: "My tickets",
    billetsLead: "Each seat has its own QR. Show it at the entrance.",
    download: "Download the PDF",
    ordersTitle: "My orders",
    emptyOrders: "No orders yet.",
    paid: "Paid",
    infoTitle: "My details",
    save: "Save",
    saved: "Details saved.",
    first: "First name",
    last: "Last name",
    mail: "Email address",
    city: "City",
    dlTitle: "Download my ticket",
    dlLead: "The PDF includes the order, the stand and the QR for each seat.",
    editTitle: "Change a booking",
    editLead: "Describe the change. The request stays in your tracking list.",
    editPh: "Describe the change.",
    send: "Send the request",
    editOk: "Change request saved.",
    cancelTitle: "Cancel / request a refund",
    cancelLead: "Choose the order and the reason. Tracking shows the progress.",
    reason: "Reason",
    reasons: ["I can no longer attend", "Wrong category", "Other"],
    cancelOk: "Cancellation and refund request saved.",
    missingTitle: "Ticket not received",
    missingLead: "The e-tickets are also in this area. You can resend the email.",
    resend: "Resend the e-tickets",
    resendOk: "The e-tickets were sent again to",
    helpTitle: "Help centre",
    helpLead: "Answers on entry, stands and the order are in the FAQ.",
    helpLink: "Open the FAQ",
    contactTitle: "Contact support",
    contactLead: "Write only to this address.",
    message: "Message",
    contactOk: "Message sent.",
    trackTitle: "Track my request",
    trackEmpty: "No open request.",
    trackOpen: "In progress",
    passTitle: "Security and password",
    passLead: "The current password is the one emailed after the order.",
    pass: "New password",
    pass2: "Confirm",
    passOk: "Password updated.",
    passShort: "8 characters minimum.",
    seat: "Seat",
    order: "Order"
  }
};

const ICONE = {
  accueil: "home",
  billets: "ticket",
  commandes: "list",
  informations: "user",
  telecharger: "down",
  modifier: "swap",
  annuler: "back",
  "non-recu": "alert",
  aide: "help",
  contact: "mail",
  demandes: "clock",
  securite: "lock",
  out: "out"
};

const TRAITS = {
  home: ["M4 11 12 4l8 7", "M6 10v9h12v-9"],
  ticket: ["M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V10a2 2 0 0 0 0 4v1.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15.5V14a2 2 0 0 0 0-4V8.5Z", "M12 8v8"],
  list: ["M8 7h11M8 12h11M8 17h11", "M4.5 7h.01M4.5 12h.01M4.5 17h.01"],
  user: ["M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M5 19a7 7 0 0 1 14 0"],
  down: ["M12 4v10", "m8 10 4 4 4-4", "M5 18h14"],
  swap: ["M7 7h11l-3-3", "M17 17H6l3 3"],
  back: ["M9 14 4 9l5-5", "M4 9h10a6 6 0 0 1 0 12h-3"],
  alert: ["M12 4 3.5 19h17L12 4Z", "M12 10v4", "M12 16.5h.01"],
  help: ["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14", "M12 17h.01"],
  mail: ["M5 6h14v10H8l-3 3V6Z"],
  clock: ["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M12 8v5l3 2"],
  lock: ["M6 11h12v9H6z", "M8 11V8a4 4 0 0 1 8 0v3"],
  out: ["M10 7V5h9v14h-9v-2", "M4 12h10", "m11 9 3 3-3 3"],
  chevron: ["m6 9 6 6 6-6"]
};

function Icone({ nom }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cp-ico">
      {(TRAITS[nom] || []).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

function nomDe(id, lang) {
  const billet = BILLETS.find((b) => b.id === id);
  return billet ? (billet.tag[lang] || billet.tag.fr) : id;
}

function billetsDe(commandes) {
  const liste = [];
  commandes.forEach((c) => {
    c.lignes.forEach((l) => {
      for (let i = 0; i < l.qte; i += 1) {
        liste.push({
          id: `${c.numero}-${l.id}-${i}`,
          code: `${String(c.numero).replace("-", "")}P${liste.length + 1}`,
          cat: l.id,
          numero: c.numero,
          index: i + 1,
          qte: l.qte
        });
      }
    });
  });
  return liste;
}

export function Espace({ compte, commandes, lang, demo, section = "accueil", onOut }) {
  const t = TEXTE[lang] || TEXTE.fr;
  const [ouvert, setOuvert] = useState(false);
  const [msg, setMsg] = useState("");
  const [demandes, setDemandes] = useState([]);
  const [profil, setProfil] = useState(compte);
  const places = billetsDe(commandes);
  const locale = lang === "en" ? "en-GB" : "fr-FR";
  const prix = (n) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n);
  const pdf = `/apercu/ebillet?langue=${lang === "en" ? "en" : "fr"}`;

  function lien(id) {
    const q = new URLSearchParams();
    if (demo) q.set("demo", "1");
    if (id && id !== "accueil") q.set("section", id);
    const s = q.toString();
    return s ? `/compte?${s}` : "/compte";
  }

  const courant = t.groups.flatMap((g) => g[1]).find((l) => l[0] === section);

  return (
    <div className={ouvert ? "cp is-ouvert" : "cp"}>
      <aside className="cp-menu">
        <div className="cp-who">
          <span>{(profil.prenom || profil.email || "C").trim().charAt(0).toUpperCase()}</span>
          <div>
            <p>{t.hello}{profil.prenom ? ` ${profil.prenom}` : ""}</p>
            <small>{profil.email}</small>
          </div>
        </div>
        <p className="cp-count"><strong>{places.length} {places.length > 1 ? t.tickets : t.ticket}</strong><span>{t.inSpace}</span></p>
        <button type="button" className={ouvert ? "cp-toggle is-ouvert" : "cp-toggle"} aria-expanded={ouvert} onClick={() => setOuvert((v) => !v)}>
          <span className="cp-toggle-page">
            <Icone nom={ICONE[courant ? courant[0] : "accueil"]} />
            <span>{courant ? courant[1] : t.homeTitle}</span>
          </span>
          <Icone nom="chevron" />
        </button>
        <nav>
          {t.groups.map(([titre, liens]) => (
            <div key={titre}>
              <p className="cp-label">{titre}</p>
              <ul>
                {liens.map(([id, label]) => (
                  <li key={id}>
                    <Link href={lien(id)} className={section === id ? "is-actif" : undefined} onClick={() => { setMsg(""); setOuvert(false); }}>
                      <Icone nom={ICONE[id]} />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button type="button" className="cp-out" onClick={onOut}><Icone nom="out" /><span>{t.out}</span></button>
        </nav>
      </aside>
      <section className="cp-corps">
        {section === "accueil" && (
          <>
            <p className="cp-kicker">{t.homeKicker}</p>
            <h1>{t.homeTitle}</h1>
            <p className="cp-lead">{t.homeLead}</p>
            <div className="cp-cartes">
              {[["billets", places.length], ["commandes", commandes.length], ["demandes", demandes.length]].map(([id, n], i) => (
                <Link key={id} href={lien(id)} className="cp-carte">
                  <span className="cp-puce"><Icone nom={ICONE[id]} /></span>
                  <strong>{n}</strong>
                  <span>{t.cards[i]}</span>
                </Link>
              ))}
            </div>
            <div className="cp-raccourcis">
              {t.shortcuts.map(([id, label]) => (
                <Link key={id} href={lien(id)} className="cp-raccourci">
                  <span className="cp-puce"><Icone nom={ICONE[id]} /></span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </>
        )}
        {section === "billets" && (
          <>
            <h1 className="cp-titre"><Icone nom="ticket" />{t.billetsTitle}</h1>
            <p className="cp-lead">{t.billetsLead}</p>
            <Liste places={places} lang={lang} t={t} pdf={pdf} />
          </>
        )}
        {section === "commandes" && (
          <>
            <h1 className="cp-titre"><Icone nom="list" />{t.ordersTitle}</h1>
            {commandes.length ? commandes.map((c) => (
              <article className="cp-pass" key={c.numero}>
                <span className="cp-puce"><Icone nom="list" /></span>
                <div>
                  <strong>{c.numero}</strong>
                  <span>{new Date(c.date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="cp-pass-fin">
                  <strong>{prix(c.total)}</strong>
                  <span className="cp-pill">{t.paid}</span>
                </div>
              </article>
            )) : <p className="cp-lead">{t.emptyOrders}</p>}
          </>
        )}
        {section === "informations" && (
          <form className="cp-form" onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); setProfil({ ...profil, ...d }); setMsg(t.saved); }}>
            <h1 className="cp-titre"><Icone nom="user" />{t.infoTitle}</h1>
            <label>{t.first}<input name="prenom" defaultValue={profil.prenom} required /></label>
            <label>{t.last}<input name="nom" defaultValue={profil.nom} required /></label>
            <label>{t.mail}<input name="email" type="email" defaultValue={profil.email} required /></label>
            <label>{t.city}<input name="ville" defaultValue={profil.ville} /></label>
            {msg ? <p className="cp-ok">{msg}</p> : null}
            <button type="submit">{t.save}</button>
          </form>
        )}
        {section === "telecharger" && (
          <>
            <h1 className="cp-titre"><Icone nom="down" />{t.dlTitle}</h1>
            <p className="cp-lead">{t.dlLead}</p>
            <Liste places={places} lang={lang} t={t} pdf={pdf} />
          </>
        )}
        {section === "modifier" && (
          <form className="cp-form" onSubmit={(e) => { e.preventDefault(); setDemandes((d) => [...d, { id: "mod", titre: t.editTitle }]); setMsg(t.editOk); }}>
            <h1 className="cp-titre"><Icone nom="swap" />{t.editTitle}</h1>
            <p className="cp-lead">{t.editLead}</p>
            <label>{t.message}<textarea name="msg" required placeholder={t.editPh} rows={4} /></label>
            {msg ? <p className="cp-ok">{msg}</p> : null}
            <button type="submit">{t.send}</button>
          </form>
        )}
        {section === "annuler" && (
          <form className="cp-form" onSubmit={(e) => { e.preventDefault(); setDemandes((d) => [...d, { id: "ann", titre: t.cancelTitle }]); setMsg(t.cancelOk); }}>
            <h1 className="cp-titre"><Icone nom="back" />{t.cancelTitle}</h1>
            <p className="cp-lead">{t.cancelLead}</p>
            <label>{t.order}
              <select name="commande" defaultValue={commandes[0]?.numero}>
                {commandes.map((c) => <option key={c.numero}>{c.numero}</option>)}
              </select>
            </label>
            <label>{t.reason}
              <select name="raison">{t.reasons.map((r) => <option key={r}>{r}</option>)}</select>
            </label>
            {msg ? <p className="cp-ok">{msg}</p> : null}
            <button type="submit">{t.send}</button>
          </form>
        )}
        {section === "non-recu" && (
          <form className="cp-form" onSubmit={(e) => { e.preventDefault(); setMsg(`${t.resendOk} ${profil.email}.`); }}>
            <h1 className="cp-titre"><Icone nom="alert" />{t.missingTitle}</h1>
            <p className="cp-lead">{t.missingLead}</p>
            {msg ? <p className="cp-ok">{msg}</p> : null}
            <button type="submit">{t.resend}</button>
          </form>
        )}
        {section === "aide" && (
          <>
            <h1 className="cp-titre"><Icone nom="help" />{t.helpTitle}</h1>
            <p className="cp-lead">{t.helpLead}</p>
            <Link className="cp-btn" href="/faq">{t.helpLink}</Link>
          </>
        )}
        {section === "contact" && (
          <form className="cp-form" onSubmit={(e) => { e.preventDefault(); setMsg(t.contactOk); }}>
            <h1 className="cp-titre"><Icone nom="mail" />{t.contactTitle}</h1>
            <p className="cp-lead">{t.contactLead} contact@nbaparisevents.com</p>
            <label>{t.message}<textarea name="msg" required rows={4} /></label>
            {msg ? <p className="cp-ok">{msg}</p> : null}
            <button type="submit">{t.send}</button>
          </form>
        )}
        {section === "demandes" && (
          <>
            <h1 className="cp-titre"><Icone nom="clock" />{t.trackTitle}</h1>
            {demandes.length ? demandes.map((d, i) => (
              <article className="cp-pass" key={`${d.id}-${i}`}>
                <span className="cp-puce"><Icone nom="clock" /></span>
                <div><strong>{d.titre}</strong><span>{t.trackOpen}</span></div>
              </article>
            )) : <p className="cp-lead">{t.trackEmpty}</p>}
          </>
        )}
        {section === "securite" && (
          <form className="cp-form" onSubmit={(e) => {
            e.preventDefault();
            const d = Object.fromEntries(new FormData(e.target));
            setMsg(String(d.mdp || "").length < 8 || d.mdp !== d.mdp2 ? t.passShort : t.passOk);
          }}>
            <h1 className="cp-titre"><Icone nom="lock" />{t.passTitle}</h1>
            <p className="cp-lead">{t.passLead}</p>
            <label>{t.pass}<input name="mdp" type="password" required /></label>
            <label>{t.pass2}<input name="mdp2" type="password" required /></label>
            {msg ? <p className="cp-ok">{msg}</p> : null}
            <button type="submit">{t.save}</button>
          </form>
        )}
      </section>
    </div>
  );
}

function Liste({ places, lang, t, pdf }) {
  return places.map((p) => (
    <article className="cp-pass" key={p.id}>
      <span className="cp-puce"><Icone nom="ticket" /></span>
      <div>
        <strong>{nomDe(p.cat, lang)}</strong>
        <span>{t.order} {p.numero} · {t.seat} {p.index} / {p.qte}</span>
        <span>{p.code}</span>
      </div>
      <a className="cp-dl" href={pdf} aria-label={t.download}><Icone nom="down" /></a>
    </article>
  ));
}
