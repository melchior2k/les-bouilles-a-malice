import { getStore } from "@netlify/blobs";

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
};

export default async (req) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
      status: 405,
      headers: HEADERS
    });
  }

  try {
    const store = getStore({ name: "inventaire-bouilles", consistency: "strong" });
    const stocks = (await store.get("stocks", { type: "json" })) || {};

    return new Response(JSON.stringify({ stocks }), {
      status: 200,
      headers: HEADERS
    });
  } catch (err) {
    console.error("[get-stocks] Erreur lecture Blobs :", err);
    return new Response(JSON.stringify({ stocks: {}, error: err.message }), {
      status: 200,
      headers: HEADERS
    });
  }
};