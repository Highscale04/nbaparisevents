import "./globals.css";
import { Providers } from "@/lib/providers";
import { Chrome } from "@/components/Chrome";

export const metadata = {
  title: "NBA Paris Game 2027 | Billets",
  description: "Billets pour le NBA Paris Game 2027 : Pelicans contre Spurs, le 14 janvier à l’Accor Arena."
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link id="fonts" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kanit:ital,wght@0,500;0,600;0,700;1,700&display=swap" rel="stylesheet" media="print" />
        <script dangerouslySetInnerHTML={{ __html: "var n=document.getElementById('fonts');if(n)n.media='all'" }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <Providers>
          <Chrome>{children}</Chrome>
        </Providers>
      </body>
    </html>
  );
}
