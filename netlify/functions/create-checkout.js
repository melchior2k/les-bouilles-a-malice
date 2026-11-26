const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { PRODUITS } = require("../../produits.js");

const TARIFS_GABARIT_CENTIMES = {
  petit: 490,  // 4,90 €
  moyen: 590,  // 5,90 €
  grand: 690   // 6,90 €
};

const PORT_DEUX_PRODUITS_PHYSIQUES_CENTIMES = 690; // 6,90 €

const PRIORITE_GABARIT = {
  petit: 1,
  moyen: 2,
  grand: 3
};

const SEUIL_FRANCO_CENTIMES = 7500; // 75,00 €

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée" })
    };
  }

  try {
    const { items } = JSON.parse(event.body || "{}");
    if (!Array.isArray(items) || !items.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Panier vide" })
      };
    }

    let sousTotalGlobalCentimes = 0;
    let quantitePhysique = 0;
    let aDuPhysique = false;
    let prioriteMax = 0;
    let gabaritMax = "petit";

    const line_items = items.map((item) => {
      const prod = PRODUITS.find((p) => p.id === item.id);
      if (!prod) {
        throw new Error(`Produit introuvable : ${item.id}`);
      }

      const variante = Array.isArray(prod.variantes) && item.varianteId
        ? prod.variantes.find((v) => v.id === item.varianteId)
        : null;

      const stockMax = variante && typeof variante.stock === "number"
        ? variante.stock
        : (typeof prod.stock === "number" ? prod.stock : Infinity);

      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      if (Number.isFinite(stockMax) && qty > stockMax) {
        throw new Error(`Stock insuffisant pour ${prod.nom}`);
      }

      const prixUnitaireCentimes = Math.round(Number(prod.prix) * 100);
      sousTotalGlobalCentimes += prixUnitaireCentimes * qty;

      const typeLivraison = (variante && variante.livraison) || prod.livraison || "physique";
      const gabarit = (variante && variante.gabarit) || prod.gabarit || "petit";

      if (typeLivraison === "physique") {
        aDuPhysique = true;
        quantitePhysique += qty;
        const prio = PRIORITE_GABARIT[gabarit] || 1;
        if (prio > prioriteMax) {
          prioriteMax = prio;
          gabaritMax = gabarit;
        }
      }

      const nomArticle = variante ? `${prod.nom} (${variante.nom})` : prod.nom;

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: nomArticle
          },
          unit_amount: prixUnitaireCentimes
        },
        quantity: qty
      };
    });

    let fraisPortCentimes = 0;
    if (aDuPhysique && sousTotalGlobalCentimes < SEUIL_FRANCO_CENTIMES) {
      fraisPortCentimes = quantitePhysique >= 2
        ? PORT_DEUX_PRODUITS_PHYSIQUES_CENTIMES
        : (TARIFS_GABARIT_CENTIMES[gabaritMax] ?? TARIFS_GABARIT_CENTIMES.petit);
    }

    const baseUrl = process.env.URL || "https://les-bouilles-a-malice.netlify.app";

    const sessionParams = {
      mode: "payment",
      allow_promotion_codes: true,
      line_items,
      phone_number_collection: {
        enabled: true
      },
      success_url: `${baseUrl}/?paiement=ok`,
      cancel_url: `${baseUrl}/?paiement=annule`
    };

    if (aDuPhysique) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["FR"]
      };
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: fraisPortCentimes,
              currency: "eur"
            },
            display_name: fraisPortCentimes === 0
              ? "Mondial Relay — Gratuit (dès 75 €)"
              : (quantitePhysique >= 2
                ? "Mondial Relay (2+ produits physiques)"
                : `Mondial Relay (gabarit ${gabaritMax})`),
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 6 }
            }
          }
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: fraisPortCentimes,
              currency: "eur"
            },
            display_name: fraisPortCentimes === 0
              ? "Colissimo — Gratuit (dès 75 €)"
              : (quantitePhysique >= 2
                ? "Colissimo (2+ produits physiques)"
                : `Colissimo (gabarit ${gabaritMax})`),
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 4 }
            }
          }
        }
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    };
  }
};