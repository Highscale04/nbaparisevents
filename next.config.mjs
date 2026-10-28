/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ["pdf-lib", "qrcode"],
  async redirects() {
    return [
      { source: "/billets", destination: "/paris-game", permanent: true },
      ...[
        ["index.html", "/"],
        ["billets.html", "/paris-game"],
        ["panier.html", "/panier"],
        ["confirmation.html", "/confirmation"],
        ["compte.html", "/compte"],
        ["equipes.html", "/equipes"],
        ["faq.html", "/faq"],
        ["experiences.html", "/experiences"],
        ["mentions.html", "/mentions"]
      ].map(([source, destination]) => ({ source: `/${source}`, destination, permanent: false }))
    ];
  }
};

export default nextConfig;
