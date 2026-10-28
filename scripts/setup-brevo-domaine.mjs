/**
 * Authentifie nbaeventsparis.com dans Brevo et pose les DNS Cloudflare.
 *   node --env-file=.dev.vars scripts/setup-brevo-domaine.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function chargerEnv() {
  for (const nom of [".dev.vars", ".env.local"]) {
    const fichier = resolve(process.cwd(), nom);
    if (!existsSync(fichier)) continue;
    for (const ligne of readFileSync(fichier, "utf8").split(/\r?\n/)) {
      const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
chargerEnv();

const DOMAINE = "nbaeventsparis.com";
const API = "https://api.brevo.com/v3";
const key = (process.env.BREVO_API_KEY || "").trim();
if (!key) {
  console.error("BREVO_API_KEY manquante");
  process.exit(1);
}

async function brevo(chemin, init = {}) {
  const res = await fetch(`${API}${chemin}`, {
    ...init,
    headers: {
      "api-key": key,
      accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  const texte = await res.text();
  let json = {};
  try {
    json = texte ? JSON.parse(texte) : {};
  } catch {
    json = { raw: texte.slice(0, 400) };
  }
  return { ok: res.ok, status: res.status, json };
}

function extraireEnregistrements(payload) {
  const out = [];
  const seen = new Set();
  const walk = (node, hint = "") => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, hint));
      return;
    }
    const type = String(node.type || node.record_type || node.recordType || "").toUpperCase();
    const host = String(node.host_name || node.hostName || node.hostname || node.host || node.name || "").replace(/\.$/, "");
    const value = String(node.value || node.data || node.content || node.target || node.hostname_value || "").replace(/\.$/, "");
    if (type && value && (type === "TXT" || type === "CNAME" || type === "MX")) {
      const nom = host && host !== "@" && host !== DOMAINE ? (host.includes(DOMAINE) ? host : `${host}.${DOMAINE}`) : DOMAINE;
      const cle = `${type}|${nom}|${value}`;
      if (!seen.has(cle)) {
        seen.add(cle);
        out.push({ type, nom, valeur: value, hint });
      }
    }
    for (const [k, v] of Object.entries(node)) {
      if (v && typeof v === "object") walk(v, k);
    }
  };
  walk(payload);
  return out;
}

const cf = {
  async request({ method, path, body }) {
    const token = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || "";
    if (!token) throw new Error("CLOUDFLARE_API_TOKEN manquant");
    const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return res.json();
  }
};

async function main() {
  let domaines = await brevo("/senders/domains");
  console.log("GET /senders/domains", domaines.status);
  const liste = domaines.json.domains || domaines.json || [];
  const deja = Array.isArray(liste)
    ? liste.find((d) => (d.domain || d.domain_name || d.name) === DOMAINE)
    : null;

  if (!deja) {
    const cree = await brevo("/senders/domains", {
      method: "POST",
      body: JSON.stringify({ name: DOMAINE, domain: DOMAINE, domainName: DOMAINE })
    });
    console.log("POST /senders/domains", cree.status, Object.keys(cree.json));
    if (!cree.ok) {
      const alt = await brevo("/senders/domains", {
        method: "POST",
        body: JSON.stringify({ domainName: DOMAINE })
      });
      console.log("POST alt", alt.status, JSON.stringify(alt.json).slice(0, 500));
    }
    domaines = await brevo("/senders/domains");
  }

  const detail = await brevo(`/senders/domains/${DOMAINE}`);
  console.log("GET domain", detail.status, JSON.stringify(detail.json).slice(0, 1200));

  const senders = await brevo("/senders?limit=50&offset=0");
  const email = "mail@nbaeventsparis.com";
  const existant = (senders.json.senders || []).find((s) => s.email === email);
  if (!existant) {
    const sender = await brevo("/senders", {
      method: "POST",
      body: JSON.stringify({ name: "NBA Official", email })
    });
    console.log("POST /senders", sender.status, sender.json.id || sender.json.message || sender.json.code);
  } else {
    console.log("sender déjà là", existant.id, existant.active);
  }

  const enr = extraireEnregistrements({ ...domaines.json, detail: detail.json });
  console.log("enregistrements détectés", enr.length);
  for (const e of enr) console.log(`  ${e.type} ${e.nom} -> ${e.valeur.slice(0, 80)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
