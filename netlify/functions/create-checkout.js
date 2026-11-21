exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
    const { items } = JSON.parse(event.body);
    const origin = event.headers.origin || "https://lesbouillesamalice.fr";

    let subtotal = 0;
    const params = new URLSearchParams();

    params.append("mode", "payment");
    params.append("success_url", `${origin}/?paiement=succes`);
    params.append("cancel_url", `${origin}/?paiement=annule`);

    // Pays autorisés pour la livraison
    const countries = ["FR", "BE", "CH", "LU"];
    countries.forEach((code, idx) => {
      params.append(`shipping_address_collection[allowed_countries][${idx}]`, code);
    });

    // Articles du panier
    items.forEach((item, index) => {
      subtotal += item.prix * item.qty;
      params.append(`line_items[${index}][price_data][currency]`, "eur");
      params.append(`line_items[${index}][price_data][product_data][name]`, item.nom);
      params.append(`line_items[${index}][price_data][unit_amount]`, Math.round(item.prix * 100));
      params.append(`line_items[${index}][quantity]`, item.qty);
    });

    // Frais de port : 5,50 € si panier < 60 €, sinon gratuits
    const shippingAmount = subtotal >= 60 ? 0 : 550;
    const shippingLabel = shippingAmount === 0 ? "Livraison offerte" : "Colissimo / Mondial Relay suivi";

    params.append("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    params.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]", shippingAmount);
    params.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "eur");
    params.append("shipping_options[0][shipping_rate_data][display_name]", shippingLabel);

    // Appel direct à l'API Stripe sans module externe
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const session = await response.json();

    if (!response.ok) {
      throw new Error(session.error?.message || "Erreur Stripe");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};