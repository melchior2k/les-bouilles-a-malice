import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { getStore } from "@netlify/blobs";

const MAX_TENTATIVES = 5;
const DUREE_BLOCAGE_MS = 15 * 60 * 1000; // 15 minutes

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

function verifierToken(authHeader, secretAttendu) {
  if (!secretAttendu || typeof authHeader !== "string") return false;
  const attendu = `Bearer ${secretAttendu}`;
  const bufRecu = Buffer.from(authHeader);
  const bufAttendu = Buffer.from(attendu);
  if (bufRecu.length !== bufAttendu.length) return false;
  return crypto.timingSafeEqual(bufRecu, bufAttendu);
}

function getClientIp(req) {
  const netlifyIp = req.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "inconnue";
}

function hashIp(ip) {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 24);
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
  const cleRate