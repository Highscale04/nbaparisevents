const ROSTERS = [
  {
    id: "spurs",
    logo: "images/logo-spurs.png",
    alt: "San Antonio Spurs",
    lead: "teams.spursLead",
    players: [
      ["1", "Victor Wembanyama", "images/rosters/spurs-wemby.avif", "Pivot français de 2,24 m, élu rookie de l’année en 2024. Il contre, tire de loin et couvre tout le terrain.", "French 7-foot-4 center, 2024 Rookie of the Year. He blocks, shoots from distance and covers the floor."],
      ["4", "De’Aaron Fox", "images/rosters/spurs-fox.avif", "Meneur très rapide, dangereux en transition et dans la raquette.", "One of the fastest guards in the league, a scorer in transition and at the rim."],
      ["5", "Stephon Castle", "images/rosters/spurs-castle.avif", "Arrière élu rookie de l’année en 2025, utile au rebond et en défense.", "2025 Rookie of the Year, a guard who rebounds and defends."],
      ["2", "Dylan Harper", "images/rosters/spurs-harper.jpg", "Rookie arrière, à l’aise pour scorer et organiser.", "Rookie guard, comfortable scoring and setting up teammates."],
      ["11", "Carter Bryant", "images/rosters/spurs-bryant.avif", "Ailier athlétique, déjà sollicité pour défendre plusieurs postes.", "Athletic wing, already asked to guard more than one position."],
      ["24", "Devin Vassell", "images/rosters/spurs-vassell.avif", "Ailier tireur, présent des deux côtés du terrain.", "A wing shooter who contributes at both ends."],
      ["25", "David Jones Garcia", "images/rosters/spurs-jones.avif", "Arrière dominicain, profil de scoreur.", "Dominican guard with a scorer’s profile."],
      ["30", "Julian Champagnie", "images/rosters/spurs-champagnie.avif", "Ailier qui espace le jeu avec son tir à trois points.", "Wing who spaces the floor with his three-point shot."],
      ["40", "Harrison Barnes", "images/rosters/spurs-barnes.avif", "Ailier champion NBA, cadre de vestiaire et finisseur régulier.", "NBA champion wing, a veteran leader and a steady finisher."],
      ["0", "Jordan McLaughlin", "images/rosters/spurs-mclaughlin.avif", "Meneur d’expérience, chargé de tenir le rythme quand il entre.", "Veteran point guard, brought in to steady the pace."]
    ]
  },
  {
    id: "pelicans",
    logo: "images/logo-pelicans.png",
    alt: "New Orleans Pelicans",
    lead: "teams.pelicansLead",
    players: [
      ["1", "Zion Williamson", "images/rosters/pelicans-zion.jpg", "Ailier fort, il attaque le cercle par la puissance et le premier pas.", "Power forward who attacks the rim with strength and a first step."],
      ["5", "Dejounte Murray", "images/rosters/pelicans-murray.jpg", "Ancien All-Star, il mène, rebondit et défend sur la ligne arrière.", "Former All-Star who runs the offense, rebounds and defends."],
      ["25", "Trey Murphy III", "images/rosters/pelicans-murphy.jpg", "Ailier tireur, l’une des principales menaces extérieures de l’équipe.", "Wing shooter and one of the team’s main outside threats."],
      ["22", "Derik Queen", "images/rosters/pelicans-queen.jpg", "Jeune intérieur, déjà à l’aise pour finir, prendre le rebond et passer.", "Young big, already comfortable finishing, rebounding and passing."],
      ["2", "Herbert Jones", "images/rosters/pelicans-herbert.jpg", "Défenseur de périmètre capable de prendre plusieurs postes.", "Perimeter defender who can take on several positions."],
      ["3", "Jordan Poole", "images/rosters/pelicans-poole.jpg", "Arrière champion NBA, créateur et tireur à longue distance.", "NBA champion guard, a creator and a long-range shooter."],
      ["9", "DeAndre Jordan", "images/rosters/pelicans-jordan.jpg", "Pivot vétéran, spécialiste du rebond et du jeu au-dessus du cercle.", "Veteran center, a rebounder and a presence above the rim."],
      ["17", "Karlo Matković", "images/rosters/pelicans-matkovic.jpg", "Intérieur mobile, utile pour contrer et finir près du cercle.", "Mobile big, used to block shots and finish at the rim."],
      ["41", "Saddiq Bey", "images/rosters/pelicans-bey.jpg", "Ailier physique, rebond et adresse à mi-distance et à trois points.", "Physical wing who rebounds and hits from the midrange and the arc."],
      ["0", "Jeremiah Fears", "images/rosters/pelicans-fears.jpg", "Rookie arrière, rapide et déjà tourné vers le cercle.", "Rookie guard, quick and already aimed at the basket."],
      ["21", "Yves Missi", "images/rosters/pelicans-missi.jpg", "Pivot athlétique, rebond et protection du cercle.", "Athletic center, a rebounder and a rim protector."],
      ["11", "Bryce McGowens", "images/rosters/pelicans-mcgowens.jpg", "Ailier jeune, en progression sur le tir extérieur.", "Young wing, growing as an outside shooter."],
      ["14", "AJ Johnson", "images/rosters/pelicans-johnson.jpg", "Jeune meneur arrivé aux Pelicans en cours de saison.", "Young point guard who joined the Pelicans during the season."],
      ["9", "Bennedict Mathurin", "images/rosters/pelicans-mathurin.jpg", "Scoreur arrivé récemment, habitué à créer son tir.", "Scorer who arrived recently and creates his own shot."]
    ]
  }
];

function dessinerEquipes() {
  const hote = document.querySelector("[data-rosters]");
  if (!hote) return;
  const num = t("teams.num");
  hote.innerHTML = ROSTERS.map((equipe) => `
    <section class="roster ${equipe.id}" id="${equipe.id}">
      <img class="roster-logo" src="${equipe.logo}" alt="${equipe.alt}">
      <h2>${t("teams.kicker")}</h2>
      <p class="roster-lead">${t(equipe.lead)}</p>
      <div class="roster-nav">
        <button type="button" data-prev aria-label="${t("teams.prev")}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button type="button" data-next aria-label="${t("teams.next")}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="roster-track" tabindex="0">
        ${equipe.players.map(([n, nom, photo, fr, en]) => `
          <article class="player-card">
            <div class="player-shot"><img src="${photo}" alt=""></div>
            <p class="player-num">${num} ${n}</p>
            <h3>${nom}</h3>
            <p class="player-bio">${langue() === "en" ? en : fr}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");

  hote.querySelectorAll(".roster").forEach((bloc) => {
    const piste = bloc.querySelector(".roster-track");
    const avant = bloc.querySelector("[data-prev]");
    const apres = bloc.querySelector("[data-next]");
    const pas = () => {
      const carte = piste.querySelector(".player-card");
      if (!carte) return 240;
      const trou = parseFloat(getComputedStyle(piste).columnGap) || 12;
      return carte.getBoundingClientRect().width + trou;
    };
    const bornes = () => {
      const marge = parseFloat(getComputedStyle(piste).paddingLeft) || 0;
      const max = piste.scrollWidth - piste.clientWidth;
      avant.disabled = piste.scrollLeft <= marge + 2;
      apres.disabled = max <= marge + 2 || piste.scrollLeft >= max - 2;
    };
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    avant.addEventListener("click", () => piste.scrollBy({ left: -pas(), behavior: doux ? "smooth" : "auto" }));
    apres.addEventListener("click", () => piste.scrollBy({ left: pas(), behavior: doux ? "smooth" : "auto" }));
    piste.addEventListener("scroll", bornes, { passive: true });
    bornes();
  });
}

dessinerEquipes();
document.addEventListener("langue", dessinerEquipes);
