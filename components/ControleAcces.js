"use client";

export function ControleAcces({ statut, titre, lignes, logo }) {
  const ok = statut === "valide";
  const couleur = ok ? "#1f9d55" : "#e23b3b";
  const infos = (lignes ?? []).filter((ligne) => String(ligne.valeur || "").trim());

  return (
    <main className={`ctl ctl--${statut}`}>
      <style>{`
        .ctl{position:fixed;inset:0;z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:28px 18px 48px;color:#fff;font-family:Inter,Arial,Helvetica,sans-serif;background:#050505;overflow:auto}
        .ctl h1,.ctl h2,.ctl p{color:#fff}
        .ctl--valide{background:radial-gradient(circle at 50% 28%,rgba(200,16,46,.32),transparent 46%),#050505}
        .ctl--valide .ctl__etat{color:#3ddc84}
        .ctl--refuse .ctl__etat{color:#ff8d8d}
        .ctl__halo{position:fixed;inset:auto;width:140vw;height:140vw;left:50%;top:38%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(200,16,46,.28) 0%,transparent 62%);pointer-events:none}
        .ctl__carte{position:relative;width:min(420px,100%);text-align:center}
        .ctl__logo{width:88px;height:auto;margin:0 auto 16px;display:block;animation:ctl-rise .5s ease both}
        .ctl__marque{margin:0 0 18px;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;opacity:.8}
        .ctl__badge{position:relative;width:148px;height:148px;margin:0 auto 18px}
        .ctl__badge svg{position:relative;z-index:1;width:148px;height:148px}
        .ctl__anneau,.ctl__anneau--2{position:absolute;inset:0;border-radius:50%;border:3px solid ${couleur};animation:ctl-ring 1.6s ease-out infinite}
        .ctl__anneau--2{animation-delay:.55s}
        .ctl--valide .ctl__badge{animation:ctl-pop .55s cubic-bezier(.2,1.4,.4,1) both}
        .ctl--refuse .ctl__badge{animation:ctl-shake .45s ease both}
        .ctl__trace{fill:none;stroke:${couleur};stroke-width:3.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:90;stroke-dashoffset:90;animation:ctl-draw .7s .25s ease forwards}
        .ctl__etat{margin:0;font-size:32px;line-height:1.1;font-weight:800;letter-spacing:.06em;animation:ctl-rise .5s .35s ease both}
        .ctl__sous{margin:10px 0 0;font-size:16px;opacity:.9;animation:ctl-rise .5s .48s ease both}
        .ctl__tampon{display:inline-block;margin-top:14px;padding:6px 14px;border:2px solid #3ddc84;border-radius:8px;color:#3ddc84;font-size:13px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;animation:ctl-stamp .7s .4s cubic-bezier(.2,1.6,.3,1) both}
        .ctl__bloc{margin-top:22px;padding:14px 16px 8px;border-radius:18px;background:rgba(255,255,255,.08);text-align:left;animation:ctl-rise .5s .6s ease both}
        .ctl__titre{margin:0 0 8px;font-size:18px;text-align:center}
        .ctl__ligne{display:flex;justify-content:space-between;gap:16px;margin:0;padding:8px 0;border-top:1px solid rgba(255,255,255,.12);font-size:14px}
        .ctl__label{opacity:.65}
        .ctl__valeur{font-weight:700;text-align:right}
        @keyframes ctl-pop{0%{transform:scale(.2);opacity:0}70%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        @keyframes ctl-ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.7);opacity:0}}
        @keyframes ctl-draw{to{stroke-dashoffset:0}}
        @keyframes ctl-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes ctl-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes ctl-stamp{0%{transform:scale(1.6) rotate(-8deg);opacity:0}100%{transform:scale(1) rotate(-2deg);opacity:1}}
      `}</style>
      <div className="ctl__halo" />
      <section className="ctl__carte">
        {logo ? <img className="ctl__logo" src={logo} alt="NBA" width={88} height={52} /> : null}
        <p className="ctl__marque">NBA Paris Game</p>
        <div className="ctl__badge" aria-hidden>
          <span className="ctl__anneau" />
          {ok ? <span className="ctl__anneau--2" /> : null}
          {ok ? (
            <svg viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="36" fill="rgba(31,157,85,.16)" stroke={couleur} strokeWidth="3" />
              <path className="ctl__trace" d="M28 45 l10 10 22-24" />
            </svg>
          ) : (
            <svg viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="36" fill="rgba(226,59,59,.16)" stroke={couleur} strokeWidth="3" />
              <path className="ctl__trace" d="M32 32 l24 24 M56 32 l-24 24" />
            </svg>
          )}
        </div>
        <h1 className="ctl__etat">{ok ? "BILLET VALIDE" : "BILLET NON VALIDE"}</h1>
        <p className="ctl__sous">
          {ok ? "Ce billet est valide. Présentez cet écran à l’entrée." : "Ce code ne correspond à aucun billet."}
        </p>
        {ok ? <p className="ctl__tampon">Billet validé</p> : null}
        {ok && titre ? (
          <div className="ctl__bloc">
            <h2 className="ctl__titre">{titre}</h2>
            {infos.map((ligne) => (
              <p className="ctl__ligne" key={`${ligne.label}-${ligne.valeur}`}>
                <span className="ctl__label">{ligne.label}</span>
                <span className="ctl__valeur">{ligne.valeur}</span>
              </p>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
