import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import Stripe from "stripe";
import { getStore } from "@netlify/blobs";

function chargerProduits() {
  const chemin = path.resolve(process.cwd(), "produits.js");
  const code = fs.readFileSync(chemin, "utf-8");
  const contexte = {};
  vm.createContext(contexte);
  vm.runInContext(`${code}\nthis.PRODUITS = PRODUITS;`, contexte);
  return contexte.PRODUITS || [];
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PRODUITS = chargerProduits();

const SEUIL_PORT_GRATUIT = 75.0;
const PORT_DEUX_PRODUITS_PHYSIQUES = 6.9;
const TARIFS_GABARIT = { petit: 4.9, moyen: 5.9, grand: 6.9 };
const PRIORITE_GABARIT = { petit: 1, moyen: 2, grand: 3 };

function getCleStock(id, varianteId) {
  return varianteId ? `${id}::${varianteId}` : id;
}

function getStockInitial(prod, variante) {
  const livraison = (variante && variante.livraison) || prod.livraison || "physique";
  if (livraison === "numerique") return Infinity;
  if (variante && typeof variante.stock === "number") return variante.stock;
  return typeof prod.stock === "number" ? prod.stock : Infinity;
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Panier vide" }), { status: 400 });
    }

    const store = getStore("inventaire-bouilles");
    const stocksLive = (await store.get("stocks", { type: "json" })) || {};

    const lineItems = [];
    const resumeMetadata = [];
    let sousTotal = 0;
    let quantitePhysique = 0;
    let gabaritMax = "petit";
    let prioriteMax = 0;
    let aDuPhysique = false;

    for (const item of items) {
      const prod = PRODUITS.find((p) => p.id === item.id);
      if (!prod) {
        return new Response(JSON.stringify({ error: `Produit introuvable : ${item.id}` }), { status: 400 });
      }

      const variante = (Array.isArray(prod.variantes) && item.varianteId)
        ? prod.variantes.find((v) => v.id === item.varianteId)
        : null;

      const qty = Math.max(1, Math.floor(Number(item.qty || 1)));
      const cleStock = getCleStock(prod.id, variante ? variante.id : null);
      const livraison = (variante && variante.livraison) || prod.livraison || "physique";
      const gabarit = (variante && variante.gabarit) || prod.gabarit || "petit";

      if (livraison !== "numerique") {
        const stockActuel = typeof stocksLive[cleStock] === "number"
          ? stocksLive[cleStock]
          : getStockInitial(prod, variante);

        if (qty > stockActuel) {
          return new Response(
            JSON.stringify({
              error: `Stock insuffisant pour "${prod.nom}" (disponible : ${Math.max(0, stockActuel)}).`
            }),
            { status: 409 }
          );
        }

        aDuPhysique = true;
        quantitePhysique += qty;
        const prio = PRIORITE_GABARIT[gabarit] || 1;
        if (prio > prioriteMax) {
          prioriteMax = prio;
          gabaritMax = gabarit;
        }
      }

      const prixUnitaire = Number(prod.prix || 0);
      sousTotal += prixUnitaire * qty;

      const nomLigne = variante ? `${prod.nom} (${variante.nom})` : prod.nom;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: nomLigne },
          unit_amount: Math.round(prixUnitaire * 100)
        },
        quantity: qty
      });

      if (livraison !== "numerique") {
        resumeMetadata.push({
          id: prod.id,
          varianteId: variante ? variante.id : null,
          qty
        });
      }
    }

    if (aDuPhysique && sousTotal < SEUIL_PORT_GRATUIT) {
      const fraisPort = quantitePhysique >= 2
        ? PORT_DEUX_PRODUITS_PHYSIQUES
        : (TARIFS_GABARIT[gabaritMax] ?? TARIFS_GABARIT.petit);

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de port (Mondial Relay / Colissimo)" },
          unit_amount: Math.round(fraisPort * 100)
        },
        quantity: 1
      });
    }

    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      shipping_address_collection: aDuPhysique
        ? { allowed_countries: ["FR", "BE", "LU", "CH"] }
        : undefined,
      metadata: {
        articles: JSON.stringify(resumeMetadata)
      },
      success_url: `${origin}/?paiement=ok`,
      cancel_url: `${origin}/?paiement=annule`
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};