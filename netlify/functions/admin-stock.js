import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { getStore } from "@netlify/blobs";

const MAX_TENTATIVES = 5;
const DUREE_BLOCAGE_MS = 15 * 60 * 1000;
const encoder = new TextEncoder();

function chargerProduits() {
  try {
    const chemin = path.resolve(process.cwd(), "produits.js");
    const code = fs.readFileSync(chemin, "utf-8");
    const contexte = {};
    vm.createContext(contexte);
    vm.runInContext(`${code}\nthis.PRODUITS = PRODUITS;`, contexte);
    return contexte.PRODUITS || [];
  } catch {
    return [];
  }
}

const PRODUITS = chargerProduits();

function getCleStock(id, varianteId) {
  return varianteId ? `${id}::${varianteId}` : id;
}

function getStockInitial(prod, variante) {
  const livraison = (variante && variante.livraison) || prod.livraison || "physique";
  if (livraison === "numerique") return null;
  if (variante && typeof variante.stock === "number") return variante.stock;
  return typeof prod.stock === "number" ? prod.stock : null;
}

function construireListeArticles(stocksLive) {
  const liste = [];
  for (const prod of PRODUITS) {
    if (Array.isArray(prod.variantes) && prod.variantes.length > 0) {
      for (const v of prod.variantes) {
        const livraison = v.livraison || prod.livraison || "physique";
        if (livraison === "numerique") continue;
        const cle = getCleStock(prod.id, v.id);
        const stockCatalogue = getStockInitial(prod, v);
        const stockActuel = typeof stocksLive[cle] === "number" ? stocksLive[cle] : stockCatalogue;
        liste.push({
          cle,
          label: `${prod.nom} — ${v.nom}`,
          stockActuel,
          stockCatalogue,
          overrideActif: typeof stocksLive[cle] === "number"
        });
      }
    } else {
      const livraison = prod.livraison || "physique";
      if (livraison === "numerique") continue;
      const cle = getCleStock(prod.id, null);
      const stockCatalogue = getStockInitial(prod, null);
      const stockActuel = typeof stocksLive[cle] === "number" ? stocksLive[cle] : stockCatalogue;
      liste.push({
        cle,
        label: prod.nom,
        stockActuel,
        stockCatalogue,
        overrideActif: typeof stocksLive[cle] === "number"
      });
    }
  }
  return liste;
}

function comparerEgaliteConstante(a, b) {
  const bytesA = encoder.encode(a);
  const bytesB = encoder.encode(b);
  if (bytesA.length !== bytesB.length) return false;
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0;
}

function verifierToken(authHeader, secretAttendu) {
  if (!secretAttendu || typeof authHeader !== "string") return false;
  return comparerEgaliteConstante(authHeader, `Bearer ${secretAttendu}`);
}

function getClientIp(req) {
  const netlifyIp = req.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "inconnue";
}

async function hashIp(ip) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(ip));
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.slice(0, 24);
}

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (!process.env.ADMIN_STOCK_TOKEN) {
    return new Response(JSON.stringify({ error: "ADMIN_STOCK_TOKEN non configuré" }), {
      status: 500,
      headers
    });
  }

  const store = getStore({ name: "inventaire-bouilles", consistency: "strong" });
  const cleRateLimit = `ratelimit_${await hashIp(getClientIp(req))}`;
  const maintenant = Date.now();

  const etatSecurite = (await store.get(cleRateLimit, { type: "json" })) || {
    echecs: 0,
    bloqueJusqua: 0
  };

  if (etatSecurite.bloqueJusqua && maintenant < etatSecurite.bloqueJusqua) {
    const minutesRestantes = Math.ceil((etatSecurite.bloqueJusqua - maintenant) / 60000);
    return new Response(
      JSON.stringify({
        error: `Trop de tentatives. Réessaie dans ${minutesRestantes} minute(s).`
      }),
      { status: 429, headers }
    );
  }

  const auth = req.headers.get("authorization") || "";
  if (!verifierToken(auth, process.env.ADMIN_STOCK_TOKEN)) {
    const nouveauxEchecs = (etatSecurite.echecs || 0) + 1;
    const estBloque = nouveauxEchecs >= MAX_TENTATIVES;

    await store.setJSON(cleRateLimit, {
      echecs: estBloque ? 0 : nouveauxEchecs,
      bloqueJusqua: estBloque ? maintenant + DUREE_BLOCAGE_MS : 0
    });

    if (estBloque) {
      return new Response(
        JSON.stringify({ error: "Trop de tentatives ratées. Accès bloqué 15 minutes." }),
        { status: 429, headers }
      );
    }

    const restantes = MAX_TENTATIVES - nouveauxEchecs;
    return new Response(
      JSON.stringify({
        error: `Clé incorrecte (${restantes} essai(s) restant(s) avant blocage).`
      }),
      { status: 401, headers }
    );
  }

  if (etatSecurite.echecs > 0 || etatSecurite.bloqueJusqua > 0) {
    await store.delete(cleRateLimit);
  }

  const stocksLive = (await store.get("stocks", { type: "json" })) || {};

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        stocks: stocksLive,
        articles: construireListeArticles(stocksLive)
      }),
      { status: 200, headers }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405, headers });
  }

  const { action, cle, stock } = await req.json();
  if (!cle || typeof cle !== "string") {
    return new Response(JSON.stringify({ error: "Paramètre 'cle' requis" }), { status: 400, headers });
  }

  if (action === "delete") {
    delete stocksLive[cle];
    await store.setJSON("stocks", stocksLive);
    return new Response(
      JSON.stringify({
        ok: true,
        action: "delete",
        cle,
        stocks: stocksLive,
        articles: construireListeArticles(stocksLive)
      }),
      { status: 200, headers }
    );
  }

  if (typeof stock !== "number" || Number.isNaN(stock) || stock < 0) {
    return new Response(JSON.stringify({ error: "Paramètre 'stock' invalide" }), { status: 400, headers });
  }

  stocksLive[cle] = Math.floor(stock);
  await store.setJSON("stocks", stocksLive);

  return new Response(
    JSON.stringify({
      ok: true,
      action: "set",
      cle,
      stock: stocksLive[cle],
      stocks: stocksLive,
      articles: construireListeArticles(stocksLive)
    }),
    { status: 200, headers }
  );
};