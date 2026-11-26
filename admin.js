const tokenInput = document.getElementById("token-input");
const btnCharger = document.getElementById("btn-charger");
const btnEffacerToken = document.getElementById("btn-effacer-token");
const zoneArticles = document.getElementById("zone-articles");
const tbody = document.getElementById("liste-stocks");
const messageEl = document.getElementById("message");

const SESSION_KEY = "bouilles_admin_token";

const savedToken = sessionStorage.getItem(SESSION_KEY);
if (savedToken) {
  tokenInput.value = savedToken;
}

function setMessage(texte, isError = false) {
  messageEl.textContent = texte;
  messageEl.style.color = isError ? "#b00020" : "#1565c0";
}

function getToken() {
  return tokenInput.value.trim();
}

async function appelAdmin(method = "GET", body = null) {
  const token = getToken();
  if (!token) {
    setMessage("Entre d'abord la clé d'accès admin.", true);
    return null;
  }

  const options = {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch("/.netlify/functions/admin-stock", options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Erreur HTTP ${res.status}`);
  }

  sessionStorage.setItem(SESSION_KEY, token);
  return data;
}

function rendreTableau(articles) {
  tbody.innerHTML = "";

  for (const art of articles) {
    const tr = document.createElement("tr");

    const tdNom = document.createElement("td");
    tdNom.textContent = art.label;

    const tdCle = document.createElement("td");
    tdCle.innerHTML = `<code>${art.cle}</code>`;

    const tdCat = document.createElement("td");
    tdCat.textContent = art.stockCatalogue ?? "—";

    const tdActuel = document.createElement("td");
    tdActuel.innerHTML = `<strong>${art.stockActuel ?? "—"}</strong> ${
      art.overrideActif ? '<span class="badge">Blobs</span>' : '<span class="muted">(catalogue)</span>'
    }`;

    const tdInput = document.createElement("td");
    const inputQty = document.createElement("input");
    inputQty.type = "number";
    inputQty.min = "0";
    inputQty.step = "1";
    inputQty.style.width = "80px";
    inputQty.value = art.stockActuel ?? 0;
    tdInput.appendChild(inputQty);

    const tdActions = document.createElement("td");
    const btnSet = document.createElement("button");
    btnSet.type = "button";
    btnSet.textContent = "Enregistrer";
    btnSet.style.marginRight = "0.4rem";
    btnSet.addEventListener("click", async () => {
      const val = Number(inputQty.value);
      try {
        setMessage("Mise à jour en cours...");
        const data = await appelAdmin("POST", { action: "set", cle: art.cle, stock: val });
        if (data) {
          rendreTableau(data.articles);
          setMessage(`Stock mis à jour pour "${art.label}" : ${val}`);
        }
      } catch (err) {
        setMessage(err.message, true);
      }
    });

    const btnReset = document.createElement("button");
    btnReset.type = "button";
    btnReset.className = "secondary";
    btnReset.textContent = "Reset clé";
    btnReset.title = "Supprime la clé dans Blobs pour revenir au stock de produits.js";
    btnReset.addEventListener("click", async () => {
      try {
        setMessage("Suppression de la clé Blobs...");
        const data = await appelAdmin("POST", { action: "delete", cle: art.cle });
        if (data) {
          rendreTableau(data.articles);
          setMessage(`Clé "${art.cle}" supprimée de Blobs.`);
        }
      } catch (err) {
        setMessage(err.message, true);
      }
    });

    tdActions.appendChild(btnSet);
    tdActions.appendChild(btnReset);

    tr.appendChild(tdNom);
    tr.appendChild(tdCle);
    tr.appendChild(tdCat);
    tr.appendChild(tdActuel);
    tr.appendChild(tdInput);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  }

  zoneArticles.style.display = "block";
}

btnCharger.addEventListener("click", async () => {
  try {
    setMessage("Chargement des stocks...");
    const data = await appelAdmin("GET");
    if (data) {
      rendreTableau(data.articles || []);
      setMessage("Stocks chargés.");
    }
  } catch (err) {
    setMessage(err.message, true);
  }
});

btnEffacerToken.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  tokenInput.value = "";
  zoneArticles.style.display = "none";
  setMessage("Clé oubliée.");
});

if (savedToken) {
  btnCharger.click();
}