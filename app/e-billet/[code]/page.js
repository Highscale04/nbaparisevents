import { ControleAcces } from "@/components/ControleAcces";
import { lireBillet } from "@/lib/billet-qr";

export const metadata = {
  title: "E-billet",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function PageEBillet({ params }) {
  const { code } = await params;
  const billet = await lireBillet(code);
  const ok = Boolean(billet?.ok);
  return (
    <ControleAcces
      statut={ok ? "valide" : "refuse"}
      logo="/images/logo-nba.png"
      titre={ok ? billet.titre : undefined}
      lignes={
        ok
          ? [
              { label: "Catégorie", valeur: billet.categorie },
              { label: "Tribune", valeur: billet.tribune },
              { label: "Blocs", valeur: billet.blocs },
              { label: "Date", valeur: billet.date },
              { label: "Heure", valeur: billet.heure },
              { label: "Lieu", valeur: billet.lieu },
              { label: "Place", valeur: billet.place },
              { label: "Commande", valeur: billet.numero },
              { label: "Code", valeur: billet.code }
            ]
          : undefined
      }
    />
  );
}
