import { ControleAcces } from "@/components/ControleAcces";

export const metadata = {
  title: "Aperçu e-billet",
  robots: { index: false, follow: false }
};

export default async function ApercuValidite({ searchParams }) {
  const q = await searchParams;
  const refuse = q?.ok === "0";
  return (
    <ControleAcces
      statut={refuse ? "refuse" : "valide"}
      logo="/images/logo-nba.png"
      titre="New Orleans Pelicans vs San Antonio Spurs"
      lignes={[
        { label: "Catégorie", valeur: "Catégorie 4" },
        { label: "Tribune", valeur: "Tribune Grand Hall" },
        { label: "Blocs", valeur: "A · B · C · S · T · U" },
        { label: "Date", valeur: "14 janvier 2027" },
        { label: "Heure", valeur: "20:30" },
        { label: "Lieu", valeur: "Accor Arena, Paris" },
        { label: "Place", valeur: "Place 1 / 4" },
        { label: "Commande", valeur: "NBA-2487" },
        { label: "Code", valeur: "NBA2487P1" }
      ]}
    />
  );
}
