import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("inventaire-bouilles");
    const stocks = (await store.get("stocks", { type: "json" })) || {};

    return new Response(JSON.stringify({ stocks }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ stocks: {}, error: err.message }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};