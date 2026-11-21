// État global de la boutique
let currentCategory = "tout";
let searchQuery = "";
let onlyAvailable = false;
let currentSort = "default";
let cart = JSON.parse(localStorage.getItem("bouilles_cart")) || [];

const SHIPPING_COST = 5.50;
const FREE_SHIPPING_THRESHOLD = 60.00;

// Sélecteurs DOM
const gridEl = document.getElementById("products-grid");
const counterEl = document.getElementById("results-counter");
const searchInput = document.getElementById("search-input");
const availableCheckbox = document.getElementById("only-available");
const sortSelect = document.getElementById("sort-select");

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

// Rendu visuel d'une image précise avec fallback emoji
function renderVisualImage(imgSrc, product, labelText = "Photo à venir") {
  return `
    <img 
      src="${imgSrc}" 
      alt="${product.nom}" 
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div class="placeholder-art" style="display:none; background:${product.couleurFond || '#f5efe0'};">
      ${product.emoji || '🎨'}
      <span>${labelText}</span>
    </div>
  `;
}

// Filtrage & tri
function getFilteredProducts() {
  let list = PRODUITS.filter((p) => {
    const matchCat = currentCategory === "tout" || p.categorie === currentCategory;
    const matchStock = !onlyAvailable || p.stock > 0;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.nom.toLowerCase().includes(q) ||
      p.descriptionCourte.toLowerCase().includes(q) ||
      p.categorieLabel.toLowerCase().includes(q);
    return matchCat && matchStock && matchSearch;
  });

  if (currentSort === "price-asc") {
    list.sort((a, b) => a.prix - b.prix);
  } else if (currentSort === "price-desc") {
    list.sort((a, b) => b.prix - a.prix);
  } else if (currentSort === "name-asc") {
    list.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  }

  return list;
}

// Affichage de la grille principale
function renderProducts() {
  const items = getFilteredProducts();
  counterEl.textContent = `${items.length} création${items.length > 1 ? "s" : ""} affichée${items.length > 1 ? "s" : ""}`;

  if (items.length === 0) {
    gridEl.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; font-weight:700;">Aucune Bouille ne correspond à cette recherche 😅 Essayez un autre filtre !</p>`;
    return;
  }

  gridEl.innerHTML = items
    .map((p) => {
      const isAvailable = p.stock > 0;
      const mainImg = (p.images && p.images[0]) || "";
      const badgeHtml = isAvailable
        ? `<span class="status-badge badge-unique">${p.stock === 1 ? "Pièce unique" : `${p.stock} dispo`}</span>`
        : `<span class="status-badge badge-adopted">Adoptée ♥</span>`;

      return `
        <article class="product-card">
          <div class="product-media" onclick="openProductModal('${p.id}')">
            ${badgeHtml}
            ${renderVisualImage(mainImg, p)}
          </div>
          <div class="product-body">
            <div class="product-meta">${p.categorieLabel} • ${p.hauteur}</div>
            <h3 class="product-title" onclick="openProductModal('${p.id}')">${p.nom}</h3>
            <p class="product-desc">${p.descriptionCourte}</p>
            <div class="product-footer">
              <span class="product-price">${formatPrice(p.prix)}</span>
              <button 
                class="btn btn-primary btn-small" 
                ${!isAvailable ? "disabled" : ""}
                onclick="addToCart('${p.id}')"
              >
                ${isAvailable ? "+ Adopter" : "Adoptée"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

// Changement de photo active dans la modale
function selectModalPhoto(productId, index) {
  const p = PRODUITS.find((item) => item.id === productId);
  if (!p || !p.images[index]) return;

  const mainContainer = document.getElementById("modal-main-visual");
  mainContainer.innerHTML = renderVisualImage(p.images[index], p, `Vue ${index + 1}`);

  document.querySelectorAll(".thumb-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === index);
  });
}

// Fiche produit détaillée avec galerie 3 photos
function openProductModal(id) {
  const p = PRODUITS.find((item) => item.id === id);
  if (!p) return;

  const isAvailable = p.stock > 0;
  const photos = p.images && p.images.length ? p.images : [""];
  const modalBody = document.getElementById("modal-body");

  const thumbsHtml = photos
    .map(
      (src, idx) => `
      <button type="button" class="thumb-btn ${idx === 0 ? "active" : ""}" onclick="selectModalPhoto('${p.id}', ${idx})" aria-label="Voir photo ${idx + 1}">
        <img src="${src}" alt="${p.nom} vue ${idx + 1}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="thumb-placeholder" style="display:none; background:${p.couleurFond || '#f5efe0'};">${idx + 1}</div>
      </button>
    `
    )
    .join("");

  modalBody.innerHTML = `
    <div class="modal-gallery">
      <div class="modal-img-box" id="modal-main-visual">
        ${renderVisualImage(photos[0], p, "Vue 1")}
      </div>
      <div class="thumbs-row">
        ${thumbsHtml}
      </div>
    </div>
    <div>
      <span class="pill-tag">${p.categorieLabel}</span>
      <h2 style="font-size:1.9rem; margin-bottom:10px;">${p.nom}</h2>
      <p style="font-size:1.5rem; font-family:'Fredoka',sans-serif; font-weight:700; color:var(--coral); margin-bottom:12px;">
        ${formatPrice(p.prix)}
      </p>
      <p>${p.histoire}</p>
      <ul class="specs-list">
        <li><strong>📏 Hauteur :</strong> ${p.hauteur}</li>
        <li><strong>🎨 Matériaux :</strong> ${p.materiaux}</li>
        <li><strong>📦 Disponibilité :</strong> ${isAvailable ? (p.stock === 1 ? "Pièce unique en stock" : `${p.stock} exemplaires en stock`) : "Déjà adoptée"}</li>
      </ul>
      <button 
        class="btn btn-primary btn-full" 
        ${!isAvailable ? "disabled" : ""}
        onclick="addToCart('${p.id}'); closeProductModal();"
      >
        ${isAvailable ? "Ajouter cette Bouille au panier" : "Cette figurine a déjà trouvé sa maison"}
      </button>
    </div>
  `;

  document.getElementById("product-modal").classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("product-modal").classList.add("hidden");
}

// Gestion du panier multi-articles
function saveCart() {
  localStorage.setItem("bouilles_cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = PRODUITS.find((p) => p.id === productId);
  if (!product || product.stock <= 0) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty += 1;
    } else {
      alert(`Il n'y a que ${product.stock} exemplaire(s) disponible(s) pour ${product.nom} !`);
      return;
    }
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  openCart();
}

function changeCartQty(productId, delta) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  const product = PRODUITS.find((p) => p.id === productId);
  const newQty = cart[index].qty + delta;

  if (newQty <= 0) {
    cart.splice(index, 1);
  } else if (product && newQty <= product.stock) {
    cart[index].qty = newQty;
  }

  saveCart();
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const itemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const shippingEl = document.getElementById("cart-shipping");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p style="text-align:center; color:var(--ink-muted); padding:40px 10px; font-weight:700;">Votre panier est encore vide.<br>Choisissez une première Bouille à adopter !</p>`;
    subtotalEl.textContent = "0,00 €";
    shippingEl.textContent = "0,00 €";
    totalEl.textContent = "0,00 €";
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  let subtotal = 0;

  itemsEl.innerHTML = cart
    .map((item) => {
      const p = PRODUITS.find((prod) => prod.id === item.id);
      if (!p) return "";
      const lineTotal = p.prix * item.qty;
      subtotal += lineTotal;

      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${p.nom}</h4>
            <span>${formatPrice(p.prix)} × ${item.qty} = ${formatPrice(lineTotal)}</span>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeCartQty('${p.id}', -1)">−</button>
            <strong>${item.qty}</strong>
            <button class="qty-btn" onclick="changeCartQty('${p.id}', 1)">+</button>
          </div>
        </div>
      `;
    })
    .join("");

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  subtotalEl.textContent = formatPrice(subtotal);
  shippingEl.textContent = shipping === 0 ? "Offerts 🎉" : formatPrice(shipping);
  totalEl.textContent = formatPrice(total);
}

function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-backdrop").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-backdrop").classList.add("hidden");
}

// Connexion Stripe Checkout via Netlify Function
document.getElementById("checkout-btn").addEventListener("click", async () => {
  const btn = document.getElementById("checkout-btn");
  btn.disabled = true;
  btn.textContent = "Redirection vers Stripe...";

  try {
    const itemsPayload = cart.map((item) => {
      const p = PRODUITS.find((prod) => prod.id === item.id);
      return {
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        qty: item.qty
      };
    });

    const response = await fetch("/.netlify/functions/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemsPayload })
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || "Erreur lors de la création du paiement.");
    }
  } catch (err) {
    alert(
      "Le module Stripe n'est pas encore activé en ligne (ou erreur réseau).\n" +
      "Détail : " + err.message
    );
    btn.disabled = false;
    btn.textContent = "Passer au paiement sécurisé";
  }
});

// Gestion des retours Stripe (?paiement=succes ou ?paiement=annule)
function checkPaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("paiement");
  const banner = document.getElementById("payment-banner");

  if (status === "succes") {
    localStorage.removeItem("bouilles_cart");
    cart = [];
    updateCartUI();
    banner.textContent = "🎉 Merci pour votre adoption ! Votre commande a bien été enregistrée et un reçu vous a été envoyé par e-mail.";
    banner.classList.remove("hidden");
  } else if (status === "annule") {
    banner.textContent = "Le paiement a été annulé. Vos Bouilles sont toujours bien au chaud dans votre panier.";
    banner.classList.add("canceled");
    banner.classList.remove("hidden");
  }
}

// Modale Mentions Légales & CGV génériques
function openLegalModal(type) {
  const legalBody = document.getElementById("legal-body");

  if (type === "mentions") {
    legalBody.innerHTML = `
      <h2>Mentions Légales</h2>
      <h3>1. Éditeur du site</h3>
      <p>Le site <strong>Les Bouilles à Malice</strong> est édité par :<br>
      <strong>[Prénom Nom / Dénomination commerciale]</strong> — Entrepreneur Individuel (Micro-entreprise)<br>
      Adresse de l'atelier : <strong>[Adresse postale complète]</strong><br>
      Numéro SIRET : <strong>[Votre numéro SIRET à 14 chiffres]</strong><br>
      E-mail : <strong>contact@lesbouillesamalice.fr</strong><br>
      TVA non applicable, art. 293 B du CGI <em>(à adapter selon votre régime fiscal)</em>.</p>

      <h3>2. Hébergement</h3>
      <p>Le site est hébergé par <strong>Netlify, Inc.</strong>, 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>

      <h3>3. Propriété intellectuelle</h3>
      <p>L'ensemble des créations, figurines, photographies, textes et visuels présents sur ce site sont la propriété exclusive de <strong>Les Bouilles à Malice</strong>. Toute reproduction sans autorisation écrite est interdite.</p>
    `;
  } else {
    legalBody.innerHTML = `
      <h2>Conditions Générales de Vente (CGV)</h2>
      <h3>Article 1 — Objet et nature des créations</h3>
      <p>Les présentes CGV régissent les ventes de figurines artisanales réalisées sur le site <strong>Les Bouilles à Malice</strong>. Chaque figurine est sculptée et peinte entièrement à la main. De légères variations de texture ou de teinte témoignent du caractère artisanal et unique de chaque pièce et ne constituent pas un défaut.</p>
      <p><strong>Avertissement :</strong> Ces figurines sont des objets de décoration et de collection. Elles ne conviennent pas aux enfants de moins de 3 ans (petits éléments).</p>

      <h3>Article 2 — Prix et paiement</h3>
      <p>Les prix sont indiqués en euros (€) toutes taxes comprises, hors frais de livraison. Le règlement s'effectue comptant lors de la commande via la plateforme sécurisée <strong>Stripe</strong> (Carte Bancaire, Apple Pay, Google Pay). La vente est définitive après confirmation du paiement.</p>

      <h3>Article 3 — Livraison</h3>
      <p>Les commandes sont expédiées sous 48 à 72 heures ouvrées dans un emballage protecteur adapté. Les frais de port sont calculés avant validation du panier (offerts dès 60,00 € d'achat). Les délais d'acheminement dépendent du transporteur choisi (Colissimo ou Mondial Relay).</p>

      <h3>Article 4 — Droit de rétractation</h3>
      <p>Conformément à l'article L.221-18 du Code de la consommation, l'acheteur dispose d'un délai de <strong>14 jours</strong> à compter de la réception de sa commande pour exercer son droit de rétractation (hors commandes personnalisées réalisées sur mesure à la demande du client, exclues par l'article L.221-28). Les frais de retour restent à la charge de l'acheteur ; la figurine doit être renvoyée intacte dans son emballage d'origine.</p>

      <h3>Article 5 — Données personnelles</h3>
      <p>Les informations recueillies lors de la commande sont strictement nécessaires à la préparation et à l'expédition du colis et ne sont jamais cédées à des tiers.</p>
    `;
  }

  document.getElementById("legal-modal").classList.remove("hidden");
}

// Événements
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

availableCheckbox.addEventListener("change", (e) => {
  onlyAvailable = e.target.checked;
  renderProducts();
});

sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderProducts();
});

document.getElementById("open-cart-btn").addEventListener("click", openCart);
document.getElementById("close-cart-btn").addEventListener("click", closeCart);
document.getElementById("cart-backdrop").addEventListener("click", closeCart);
document.getElementById("close-modal-btn").addEventListener("click", closeProductModal);
document.getElementById("product-modal").addEventListener("click", (e) => {
  if (e.target.id === "product-modal") closeProductModal();
});

document.getElementById("close-legal-btn").addEventListener("click", () => {
  document.getElementById("legal-modal").classList.add("hidden");
});
document.getElementById("legal-modal").addEventListener("click", (e) => {
  if (e.target.id === "legal-modal") document.getElementById("legal-modal").classList.add("hidden");
});

// Initialisation
renderProducts();
updateCartUI();
checkPaymentReturn();