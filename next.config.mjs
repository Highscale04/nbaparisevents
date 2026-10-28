/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ["pdf-lib", "qrcode"],
  async redirects() {
    return [
      ["index.html", "/"],
      ["billets.html", "/billets"],
      ["panier.html", "/panier"],
      ["confirmation.html", "/confirmation"],
      ["compte.html", "/compte"],
      ["equipes.html", "/equipes"],
      ["faq.html", "/faq"],
      ["experiences.html", "/experiences"],
      ["mentions.html", "/mentions"]
    ].map(([source, destination]) => ({ source: `/${source}`, destination, permanent: false }));
  }
};

export default nextConfig;
