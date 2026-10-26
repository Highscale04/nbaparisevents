const SALLE = {
  nom: "Accor Arena",
  adresse: "8 boulevard de Bercy, 75012 Paris",
  basket: 15609,
  loges: 54,
  metro: { fr: "Métro 6 et 14 · Bercy", en: "Metro 6 and 14 · Bercy" },
  rer: { fr: "RER A et D · Gare de Lyon", en: "RER A and D · Gare de Lyon" },
  parking: { fr: "Parking officiel · 85 rue de Bercy", en: "Official car park · 85 rue de Bercy" }
};

const BILLETS = [
  {
    id: "parquet",
    nom: { fr: "Parquet, rang B", en: "Floor, row B" },
    prix: 1415,
    tag: { fr: "Courtside", en: "Courtside" },
    etoiles: 5,
    vue: 5,
    resume: { fr: "Au pied du parquet, placement Floor Row B.", en: "Courtside, the Floor Row B placement." },
    blocs: "Rang B",
    niveaux: { fr: "Au pied du parquet, placement Floor Row B des NBA Paris Games.", en: "On the floor, the Floor Row B placement used for the NBA Paris Games." },
    description: { fr: "Places au bord du terrain. L’entrée se fait avec le public du Grand Hall, sur l’esplanade.", en: "Courtside seats. Entry is with the general public, through the Grand Hall on the esplanade." }
  },
  {
    id: "boulevard",
    nom: { fr: "Catégorie 1", en: "Category 1" },
    prix: 925,
    tag: { fr: "Tribune Boulevard", en: "Boulevard stand" },
    etoiles: 4,
    vue: 5,
    resume: { fr: "Les blocs centraux D, E et F voient les deux paniers.", en: "Central blocks D, E and F see both baskets." },
    blocs: "D · E · F · G",
    niveaux: { fr: "Gradin et balcon. Les blocs centraux D, E et F voient les deux paniers.", en: "Lower bowl and balcony. Central blocks D, E and F see both baskets." },
    description: { fr: "Côté boulevard de Bercy. Entrée grand public par le Grand Hall, ou entrée VIP dédiée.", en: "Boulevard de Bercy side. General entry through the Grand Hall, or the dedicated VIP entrance." }
  },
  {
    id: "seine",
    nom: { fr: "Catégorie 3", en: "Category 3" },
    prix: 665,
    tag: { fr: "Tribune Seine", en: "Seine stand" },
    etoiles: 3,
    vue: 3,
    resume: { fr: "Le bloc M est l’un des plus centraux de la tribune.", en: "Block M is one of the most central in the stand." },
    blocs: "H · I · J · K · L · M",
    niveaux: { fr: "Gradin H à M. Balcon : H, I, L, M. Corbeille : J et K.", en: "Lower bowl H to M. Balcony: H, I, L, M. Gallery: J and K." },
    description: { fr: "Côté Seine. Entrée par le Grand Hall ou par le Hall Seine. Le bloc M est l’un des plus centraux.", en: "Seine side. Enter through the Grand Hall or the Seine hall. Block M is one of the most central." }
  },
  {
    id: "studio",
    nom: { fr: "Catégorie 2", en: "Category 2" },
    prix: 735,
    tag: { fr: "Tribune Studio", en: "Studio stand" },
    etoiles: 4,
    vue: 4,
    resume: { fr: "Les blocs N et O comptent parmi les plus centraux.", en: "Blocks N and O are among the most central." },
    blocs: "N · O · P · Q · R",
    niveaux: { fr: "Gradin et balcon. Les blocs N et O sont parmi les plus centraux.", en: "Lower bowl and balcony. Blocks N and O are among the most central." },
    description: { fr: "Entrée par le Grand Hall ou par l’entrée Studio.", en: "Enter through the Grand Hall or the Studio entrance." }
  },
  {
    id: "grand-hall",
    nom: { fr: "Catégorie 4", en: "Category 4" },
    prix: 525,
    tag: { fr: "Tribune Grand Hall", en: "Grand Hall stand" },
    etoiles: 3,
    vue: 3,
    resume: { fr: "Gradin et balcon, côté esplanade du Grand Hall.", en: "Lower bowl and balcony, on the Grand Hall side." },
    blocs: "A · B · C · S · T · U",
    niveaux: { fr: "Gradin et balcon. Corbeille aux blocs A et U.", en: "Lower bowl and balcony. Gallery at blocks A and U." },
    description: { fr: "Tribune de l’entrée principale, sur l’esplanade.", en: "Stand at the main entrance, on the esplanade." }
  },
  {
    id: "loges",
    nom: { fr: "Loges", en: "Suites" },
    prix: 1060,
    tag: { fr: "Premium", en: "Premium" },
    etoiles: 5,
    vue: 5,
    resume: { fr: "Dix des 54 loges offrent une vue panoramique.", en: "Ten of the 54 suites have a panoramic view." },
    blocs: "Boulevard de Bercy",
    niveaux: { fr: "54 loges, dont 10 avec vue panoramique.", en: "54 suites, 10 of them with a panoramic view." },
    description: { fr: "Accès par l’entrée dédiée, au 8 boulevard de Bercy.", en: "Access through the dedicated entrance at 8 boulevard de Bercy." }
  }
];

const STOCK = {
  parquet: 8,
  boulevard: 24,
  seine: 30,
  studio: 30,
  "grand-hall": 40,
  loges: 6
};

const MATCH = {
  date: { fr: "14 janvier 2027", en: "January 14, 2027" },
  heure: "20:30",
  lieu: "Accor Arena, Paris",
  domicile: "New Orleans Pelicans",
  exterieur: "San Antonio Spurs"
};
