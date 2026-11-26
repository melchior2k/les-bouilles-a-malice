import Stripe from "stripe";
import { getStore } from "@netlify/blobs";
import catalogueModule from "../../produits.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PRODUITS = catalogueModule.PRODUITS || [];

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
    return new Response("Méthode non autorisée", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Erreur signature webhook : ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const store = getStore("inventaire-bouilles");

    // Protection contre les doublons d'événements Stripe
    const dejaTraite = await store.get(`event_${event.id}`);
    if (dejaTraite) {
      return new Response("Déjà traité", { status: 200 });
    }

    let articles = [];
    try {
      articles = JSON.parse(session.metadata?.articles || "[]");
    } catch {
      articles = [];
    }

    if (articles.length > 0) {
      const stocksLive = (await store.get("stocks", { type: "json" })) || {};

      for (const art of articles) {
        const prod = PRODUITS.find((p) => p.id === art.id);
        if (!prod) continue;

        const variante = (Array.isArray(prod.variantes) && art.varianteId)
          ? prod.variantes.find((v) => v.id === art.varianteId)
          : null;

        const stockBase = typeof stocksLive[getCleStock(prod.id, variante ? variante.id : null)] === "number"
          ? stocksLive[getCleStock(prod.id, variante ? variante.id : null)]
          : getStockInitial(prod, variante);

        if (Number.isFinite(stockBase)) {
          const cle = getCleStock(prod.id, variante ? variante.id : null);
          const nouveauStock = Math.max(0, stockBase - Number(art.qty || 1));
          stocksLive[cle] = nouveauStock;
        }
      }

      await store.setJSON("stocks", stocksLive);
    }

    await store.set(`event_${event.id}`, "ok");
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};