let categorieActive = "tous";
let panier = [];
let observateurVideosAccueil = null;

const SEUIL_PORT_GRATUIT = 75.0;
const PORT_DEUX_PRODUITS_PHYSIQUES = 6.9;

const TARIFS_GABARIT = {
  petit: 4.9,
  moyen: 5.9,
  grand: 6.9
};

const PRIORITE_GABARIT = {
  petit: 1,
  moyen: 2,
  grand: 3
};

const LIBELLES_GABARIT = {
  petit: "Petit (4,90 €)",
  moyen: "Moyen (5,90 €)",
  grand: "Grand (6,90 €)"
};

function aDesVariantes(prod) {
  return Array.isArray(prod.variantes) && prod.variantes.length > 0;
}

function getVarianteParId(prod, varianteId) {
  if (!aDesVariantes(prod)) return null;
  if (varianteId) {
    const trouvee = prod.variantes.find((v) => v.id === varianteId);
    if (trouvee) return trouvee;
  }
  const disponible = prod.variantes.find((v) => {
    if (estProduitNumerique(prod, v)) return true;
    return typeof v.stock !== "number" || v.stock > 0;
  });
  return disponible || prod.variantes[0];
}

function getInfosLivraisonProduit(prod, variante = null) {
  const typeLivraison = (variante && variante.livraison)
    || (prod && prod.livraison)
    || "physique";
  const gabarit = (variante && variante.gabarit)
    || (prod && prod.gabarit)
    || "petit";
  return { typeLivraison, gabarit };
}

function estProduitNumerique(prod, variante = null) {
  const { typeLivraison } = getInfosLivraisonProduit(prod, variante);
  return typeLivraison === "numerique";
}

function getStockMax(prod, variante = null) {
  if (estProduitNumerique(prod, variante)) {
    return Infinity;
  }
  if (variante && typeof variante.stock === "number") {
    return variante.stock;
  }
  return typeof prod.stock === "number" ? prod.stock : Infinity;
}

function getStockTotal(prod) {
  if (estProduitNumerique(prod)) {
    return Infinity;
  }
  if (aDesVariantes(prod)) {
    const stocksVariantes = prod.variantes
      .map((v) => v.stock)
      .filter((s) => typeof s === "number");
    if (stocksVariantes.length > 0) {
      return stocksVariantes.reduce((somme, s) => somme + Math.max(0, s), 0);
    }
  }
  return typeof prod.stock === "number" ? prod.stock : Infinity;
}

function estEpuise(prod, variante = null) {
  if (estProduitNumerique(prod, variante)) {
    return false;
  }
  const stock = getStockMax(prod, variante);
  return Number.isFinite(stock) && stock <= 0;
}

function formaterTexteStock(prod, variante = null) {
  if (estProduitNumerique(prod, variante)) {
    return "En stock";
  }

  const stockVariante = getStockMax(prod, variante);
  const nbVariantes = aDesVariantes(prod) ? prod.variantes.length : 0;

  if (nbVariantes <= 1) {
    if (!Number.isFinite(stockVariante)) return "";
    if (stockVariante <= 0) return "Épuisé";
    if (stockVariante === 1) return "1 exemplaire en stock";
    return `${stockVariante} exemplaires en stock`;
  }

  const stockTotal = getStockTotal(prod);
  if (!Number.isFinite(stockTotal)) return "";
  if (stockTotal <= 0) return "Épuisé";

  const libelleTotal = stockTotal === 1
    ? "1 exemplaire en stock"
    : `${stockTotal} exemplaires en stock`;

  if (!Number.isFinite(stockVariante)) return libelleTotal;
  if (stockVariante <= 0) return `${libelleTotal} (épuisé pour cette déclinaison)`;
  return `${libelleTotal} (${stockVariante} pour cette déclinaison)`;
}

function getInfosLivraisonItem(item) {
  const prod = typeof PRODUITS !== "undefined"
    ? PRODUITS.find((p) => p.id === item.id)
    : null;
  const variante = (prod && Array.isArray(prod.variantes) && item.varianteId)
    ? prod.variantes.find((v) => v.id === item.varianteId)
    : null;

  const typeLivraison = item.livraison
    || (variante && variante.livraison)
    || (prod && prod.livraison)
    || "physique";
  const gabarit = item.gabarit
    || (variante && variante.gabarit)
    || (prod && prod.gabarit)
    || "petit";

  return { typeLivraison, gabarit };
}

function calculerResumePanier() {
  let sousTotalTotal = 0;
  let quantitePhysique = 0;
  let gabaritMax = null;
  let prioriteMax = 0;
  let aDuPhysique = false;

  for (const item of panier) {
    const qty = Number(item.qty || 1);
    const lignePrix = Number(item.prix || 0) * qty;
    sousTotalTotal += lignePrix;

    const { typeLivraison, gabarit } = getInfosLivraisonItem(item);
    if (typeLivraison === "physique") {
      aDuPhysique = true;
      quantitePhysique += qty;
      const prio = PRIORITE_GABARIT[gabarit] || 1;
      if (prio > prioriteMax) {
        prioriteMax = prio;
        gabaritMax = gabarit;
      }
    }
  }

  let fraisPort = 0;
  if (aDuPhysique && sousTotalTotal < SEUIL_PORT_GRATUIT) {
    if (quantitePhysique >= 2) {
      fraisPort = PORT_DEUX_PRODUITS_PHYSIQUES;
    } else {
      fraisPort = TARIFS_GABARIT[gabaritMax] ?? TARIFS_GABARIT.petit;
    }
  }

  const montantRestantPortGratuit = aDuPhysique
    ? Math.max(0, SEUIL_PORT_GRATUIT - sousTotalTotal)
    : 0;

  return {
    sousTotalTotal,
    quantitePhysique,
    aDuPhysique,
    gabaritMax: gabaritMax || "petit",
    fraisPort,
    montantRestantPortGratuit,
    totalAvecPort: sousTotalTotal + fraisPort
  };
}

function getMediaProduit(prod) {
  const grandes = Array.isArray(prod.images) && prod.images.length ? prod.images : [""];
  const miniatures = Array.isArray(prod.vignettes) && prod.vignettes.length
    ? prod.vignettes
    : grandes;
  return { grandes, miniatures };
}

function formaterCarteCollection(prod, variante = null) {
  const carte = (prod && prod.carteCollection) || {};
  const { typeLivraison, gabarit } = getInfosLivraisonProduit(prod, variante);
  const lignes = [];

  if (carte.univers) lignes.push(`<li><strong>Univers :</strong> ${carte.univers}</li>`);
  if (carte.particularite) lignes.push(`<li><strong>Astuce :</strong> ${carte.particularite}</li>`);
  if (carte.age) lignes.push(`<li><strong>Âge conseillé :</strong> ${carte.age}</li>`);
  if (carte.duree) lignes.push(`<li><strong>Durée / rythme :</strong> ${carte.duree}</li>`);
  if (carte.joueurs) lignes.push(`<li><strong>Participants :</strong> ${carte.joueurs}</li>`);
  if (carte.couleurs) lignes.push(`<li><strong>Teintes :</strong> ${carte.couleurs}</li>`);
  if (carte.finition) lignes.push(`<li><strong>Finition :</strong> ${carte.finition}</li>`);

  if (typeLivraison === "numerique") {
    lignes.push(`<li><strong>Livraison :</strong> Numérique (0,00 € de port)</li>`);
  } else {
    const labelGabarit = LIBELLES_GABARIT[gabarit] || LIBELLES_GABARIT.petit;
    lignes.push(`<li><strong>Livraison :</strong> Physique — gabarit ${labelGabarit} (gratuit dès 75,00 €)</li>`);
  }

  return lignes.join("");
}

function genererHtmlVariantes(prod, varianteActive, selectId) {
  if (!aDesVariantes(prod)) return "";
  const label = prod.varianteLabel || "Déclinaison";
  const estNumeriqueProduit = estProduitNumerique(prod);

  const options = prod.variantes.map((v) => {
    const estNumVar = estProduitNumerique(prod, v);
    let mentionStock = "";
    if (!estNumeriqueProduit && !estNumVar) {
      const stockV = typeof v.stock === "number" ? v.stock : Infinity;
      if (Number.isFinite(stockV)) {
        mentionStock = stockV > 0 ? ` (${stockV} en stock)` : " (Épuisé)";
      }
    }
    const selected = varianteActive && v.id === varianteActive.id ? "selected" : "";
    return `<option value="${v.id}" ${selected}>${v.nom}${mentionStock}</option>`;
  }).join("");

  return `
    <div class="variantes-box">
      <label class="variante-label" for="${selectId}">${label} :</label>
      <select id="${selectId}" class="variante-select" data-produit-id="${prod.id}">
        ${options}
      </select>
    </div>
  `;
}

function getScoreMiseEnAvant(prod) {
  if (prod && prod.aLaUne) return 2;
  if (prod && prod.nouveau) return 1;
  return 0;
}

function afficherPhotoSurCarte(carte, photoSrc, masquerVideo = true) {
  const mainImg = carte.querySelector(".photo-principale");
  const mainVideo = carte.querySelector(".video-principale");
  if (mainVideo && masquerVideo) {
    mainVideo.pause();
    mainVideo.hidden = true;
  }
  if (mainImg) {
    mainImg.hidden = false;
    if (photoSrc) {
      mainImg.src = photoSrc;
    }
  }
}

function afficherVideoSurCarte(carte, videoSrc, autoPlay = true) {
  const mainImg = carte.querySelector(".photo-principale");
  const mainVideo = carte.querySelector(".video-principale");
  if (!mainVideo || !videoSrc) return;

  if (mainImg) {
    mainImg.hidden = true;
  }
  if (mainVideo.getAttribute("src") !== videoSrc) {
    mainVideo.src = videoSrc;
  }
  mainVideo.muted = true;
  mainVideo.loop = true;
  mainVideo.hidden = false;
  if (autoPlay) {
    mainVideo.play().catch(() => {});
  }
}

function configurerAutoplayVideosAccueil() {
  if (observateurVideosAccueil) {
    observateurVideosAccueil.disconnect();
    observateurVideosAccueil = null;
  }

  const cartesAvecVideo = Array.from(document.querySelectorAll(".carte-produit[data-video-src]"));
  if (!cartesAvecVideo.length) return;

  if (!("IntersectionObserver" in window)) {
    cartesAvecVideo.forEach((carte) => {
      const videoSrc = carte.dataset.videoSrc;
      const thumbVideo = carte.querySelector(".thumb-video");
      carte.querySelectorAll(".thumb-btn").forEach((b) => b.classList.remove("actif"));
      if (thumbVideo) thumbVideo.classList.add("actif");
      afficherVideoSurCarte(carte, videoSrc, true);
    });
    return;
  }

  observateurVideosAccueil = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const carte = entry.target;
        const videoSrc = carte.dataset.videoSrc;
        const mainVideo = carte.querySelector(".video-principale");
        if (!videoSrc || !mainVideo) return;

        if (entry.isIntersecting) {
          // Si l'utilisateur n'a pas volontairement basculé sur une miniature photo, lance la vidéo
          if (carte.dataset.modeMedia !== "photo") {
            const thumbVideo = carte.querySelector(".thumb-video");
            carte.querySelectorAll(".thumb-btn").forEach((b) => b.classList.remove("actif"));
            if (thumbVideo) thumbVideo.classList.add("actif");
            afficherVideoSurCarte(carte, videoSrc, true);
          }
        } else {
          mainVideo.pause();
        }
      });
    },
    { threshold: 0.45 }
  );

  cartesAvecVideo.forEach((carte) => observateurVideosAccueil.observe(carte));
}

function afficherCatalogue() {
  const grid = document.getElementById("catalogue-grid");
  if (!grid) return;

  if (typeof PRODUITS === "undefined" || !Array.isArray(PRODUITS)) {
    grid.innerHTML = "<p>Catalogue indisponible pour le moment.</p>";
    return;
  }

  const filtres = categorieActive === "tous"
    ? [...PRODUITS]
    : PRODUITS.filter((p) => p.categorie === categorieActive);

  // Priorité : aLaUne (2) > nouveau (1) > standard (0), en conservant l'ordre relatif
  filtres.sort((a, b) => getScoreMiseEnAvant(b) - getScoreMiseEnAvant(a));

  grid.innerHTML = filtres.map((prod) => {
    const { grandes, miniatures } = getMediaProduit(prod);
    const varianteInit = getVarianteParId(prod);
    const photoInit = (varianteInit && varianteInit.image) ? varianteInit.image : grandes[0];
    const indexInit = Math.max(0, grandes.indexOf(photoInit));
    const epuise = estEpuise(prod, varianteInit);
    const texteStock = formaterTexteStock(prod, varianteInit);
    const estALaUne = Boolean(prod.aLaUne);
    const estNouveau = !estALaUne && Boolean(prod.nouveau);

    let badgeMiseEnAvant = "";
    if (estALaUne) {
      badgeMiseEnAvant = `<span class="badge-une">À la une</span>`;
    } else if (estNouveau) {
      badgeMiseEnAvant = `<span class="badge-nouveau">Nouveau</span>`;
    }

    const vignettesPhotos = miniatures.map((thumbSrc, idx) => {
      const grandeSrc = grandes[idx] || grandes[0];
      return `
        <button
          type="button"
          class="thumb-btn ${!prod.video && idx === indexInit ? "actif" : ""}"
          data-type="image"
          data-full-src="${grandeSrc}"
          data-index="${idx}"
          aria-label="Miniature ${idx + 1} de ${prod.nom}"
        >
          <img src="${thumbSrc}" alt="${prod.nom} — miniature ${idx + 1}">
        </button>
      `;
    }).join("");

    const vignetteVideo = prod.video
      ? `
        <button
          type="button"
          class="thumb-btn thumb-video actif"
          data-type="video"
          data-video-src="${prod.video}"
          aria-label="Lire la vidéo de ${prod.nom}"
        >
          <span>&#9654;</span>
          <span>Vidéo</span>
        </button>
      `
      : "";

    const mediaVideo = prod.video
      ? `<video class="video-principale" controls autoplay muted loop playsinline preload="metadata" hidden></video>`
      : "";

    return `
      <article
        class="carte-produit ${estALaUne ? "carte-a-la-une" : ""}"
        data-id="${prod.id}"
        data-photo-index="${indexInit}"
        data-variante-id="${varianteInit ? varianteInit.id : ""}"
        data-mode-media="${prod.video ? "video" : "photo"}"
        ${prod.video ? `data-video-src="${prod.video}"` : ""}
      >
        <div class="carte-badges">
          <span class="badge-categorie">${prod.categorieLabel || ""}</span>
          ${badgeMiseEnAvant}
        </div>
        <div class="galerie-produit">
          <img class="photo-principale" src="${photoInit}" alt="${prod.nom}">
          ${mediaVideo}
          <div class="vignettes-produit">${vignettesPhotos}${vignetteVideo}</div>
        </div>
        <h3>${prod.nom}</h3>
        <p class="prix-produit">${Number(prod.prix || 0).toFixed(2)} €</p>
        ${texteStock ? `<p class="stock-carte ${epuise ? "epuise" : ""}">${texteStock}</p>` : ""}
        <p class="description-produit">${prod.description || ""}</p>
        <ul class="carte-collection">
          ${formaterCarteCollection(prod, varianteInit)}
        </ul>
        ${genererHtmlVariantes(prod, varianteInit, `select-var-${prod.id}`)}
        <div class="actions-carte">
          <button type="button" class="btn-detail js-ouvrir-fiche">Voir la fiche</button>
          <button
            type="button"
            class="btn-ajouter"
            data-id="${prod.id}"
            ${epuise ? "disabled" : ""}
          >
            ${epuise ? "Épuisé" : "Ajouter au panier"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const carte = btn.closest(".carte-produit");
      carte.querySelectorAll(".thumb-btn").forEach((b) => b.classList.remove("actif"));
      btn.classList.add("actif");

      if (btn.dataset.type === "video") {
        carte.dataset.modeMedia = "video";
        afficherVideoSurCarte(carte, btn.dataset.videoSrc, true);
      } else {
        carte.dataset.modeMedia = "photo";
        afficherPhotoSurCarte(carte, btn.dataset.fullSrc, true);
        carte.dataset.photoIndex = btn.dataset.index || "0";
      }
    });
  });

  grid.querySelectorAll(".variante-select").forEach((select) => {
    select.addEventListener("change", () => {
      const carte = select.closest(".carte-produit");
      const prod = PRODUITS.find((p) => p.id === select.dataset.produitId);
      if (!carte || !prod) return;

      const variante = getVarianteParId(prod, select.value);
      carte.dataset.varianteId = variante ? variante.id : "";

      const epuise = estEpuise(prod, variante);
      const stockEl = carte.querySelector(".stock-carte");
      const btnAjouter = carte.querySelector(".btn-ajouter");
      const collectionEl = carte.querySelector(".carte-collection");

      if (stockEl) {
        stockEl.textContent = formaterTexteStock(prod, variante);
        stockEl.classList.toggle("epuise", epuise);
      }

      if (collectionEl) {
        collectionEl.innerHTML = formaterCarteCollection(prod, variante);
      }

      if (btnAjouter) {
        btnAjouter.disabled = epuise;
        btnAjouter.textContent = epuise ? "Épuisé" : "Ajouter au panier";
      }

      if (variante && variante.image) {
        carte.dataset.modeMedia = "photo";
        afficherPhotoSurCarte(carte, variante.image, true);
        const { grandes } = getMediaProduit(prod);
        const idx = grandes.indexOf(variante.image);
        if (idx >= 0) {
          carte.dataset.photoIndex = String(idx);
          carte.querySelectorAll(".thumb-btn").forEach((b, i) => {
            b.classList.toggle("actif", b.dataset.type === "image" && i === idx);
          });
        }
      }
    });
  });

  grid.querySelectorAll(".js-ouvrir-fiche").forEach((btn) => {
    btn.addEventListener("click", () => {
      const carte = btn.closest(".carte-produit");
      if (carte) {
        const mainVideo = carte.querySelector(".video-principale");
        if (mainVideo) {
          mainVideo.pause();
        }
        const indexInitial = Number(carte.dataset.photoIndex || 0);
        const varianteId = carte.dataset.varianteId || null;
        ouvrirModalProduit(carte.dataset.id, indexInitial, varianteId);
      }
    });
  });

  grid.querySelectorAll(".btn-ajouter").forEach((btn) => {
    btn.addEventListener("click", () => {
      const carte = btn.closest(".carte-produit");
      const varianteId = carte ? carte.dataset.varianteId || null : null;
      ajouterAuPanier(btn.dataset.id, varianteId);
    });
  });

  configurerAutoplayVideosAccueil();
}

function ouvrirModalParId(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.hidden = false;
  }
}

function fermerModalParId(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.hidden = true;
  }
}

function initialiserModalesGenerales() {
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ouvrirModalParId(btn.dataset.openModal);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      fermerModalParId(btn.dataset.closeModal);
    });
  });

  document.querySelectorAll("[data-switch-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [fromId, toId] = (btn.dataset.switchModal || "").split(":");
      if (fromId) fermerModalParId(fromId);
      if (toId) ouvrirModalParId(toId);
    });
  });

  ["apropos-modal", "contact-modal", "panier-modal", "cgv-modal"].forEach((id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        fermerModalParId(id);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fermerCadrePhoto();
      fermerModalProduit();
      ["apropos-modal", "contact-modal", "panier-modal", "cgv-modal"].forEach(fermerModalParId);
    }
  });
}

function ouvrirModalProduit(id, indexInitial = 0, varianteInitialeId = null) {
  const modal = document.getElementById("produit-modal");
  const produit = PRODUITS.find((p) => p.id === id);
  if (!modal || !produit) return;

  const { grandes, miniatures } = getMediaProduit(produit);
  let varianteCourante = getVarianteParId(produit, varianteInitialeId);
  const startIndex = grandes[indexInitial] ? indexInitial : 0;

  const photoPrincipale = document.getElementById("modal-produit-photo-principale");
  const videoPrincipale = document.getElementById("modal-produit-video-principale");
  const vignettesBox = document.getElementById("modal-produit-vignettes");
  const categorieEl = document.getElementById("modal-produit-categorie");
  const uneBadgeEl = document.getElementById("modal-produit-une");
  const nouveauBadgeEl = document.getElementById("modal-produit-nouveau");
  const titreEl = document.getElementById("modal-produit-titre");
  const prixEl = document.getElementById("modal-produit-prix");
  const stockEl = document.getElementById("modal-produit-stock");
  const descEl = document.getElementById("modal-produit-description");
  const collectionEl = document.getElementById("modal-produit-collection");
  const variantesContainer = document.getElementById("modal-produit-variantes");
  const ajouterBtn = document.getElementById("modal-btn-ajouter");

  const estALaUne = Boolean(produit.aLaUne);
  const estNouveau = !estALaUne && Boolean(produit.nouveau);

  categorieEl.textContent = produit.categorieLabel || "";
  if (uneBadgeEl) {
    uneBadgeEl.hidden = !estALaUne;
  }
  if (nouveauBadgeEl) {
    nouveauBadgeEl.hidden = !estNouveau;
  }
  titreEl.textContent = produit.nom;
  prixEl.textContent = `${Number(produit.prix || 0).toFixed(2)} €`;
  descEl.textContent = produit.descriptionDetaillee || produit.description || "";

  function afficherPhotoDansModal(src) {
    if (videoPrincipale) {
      videoPrincipale.pause();
      videoPrincipale.hidden = true;
    }
    photoPrincipale.hidden = false;
    photoPrincipale.src = src;
  }

  function afficherVideoDansModal(videoSrc) {
    if (!videoPrincipale || !videoSrc) return;
    photoPrincipale.hidden = true;
    videoPrincipale.src = videoSrc;
    videoPrincipale.muted = true;
    videoPrincipale.loop = true;
    videoPrincipale.hidden = false;
    videoPrincipale.play().catch(() => {});
  }

  function actualiserEtatModal() {
    const epuise = estEpuise(produit, varianteCourante);
    const texte = formaterTexteStock(produit, varianteCourante);
    stockEl.textContent = texte ? `Disponibilité : ${texte}` : "";
    collectionEl.innerHTML = formaterCarteCollection(produit, varianteCourante);
    ajouterBtn.disabled = epuise;
    ajouterBtn.textContent = epuise ? "Épuisé" : "Ajouter au panier";
  }

  const photoDepart = (varianteCourante && varianteCourante.image)
    ? varianteCourante.image
    : grandes[startIndex];

  photoPrincipale.alt = produit.nom;
  afficherPhotoDansModal(photoDepart);

  const boutonsPhotos = miniatures.map((thumbSrc, idx) => {
    const grandeSrc = grandes[idx] || grandes[0];
    return `
      <button
        type="button"
        class="modal-thumb-btn ${idx === startIndex ? "actif" : ""}"
        data-type="image"
        data-full-src="${grandeSrc}"
        aria-label="Photo ${idx + 1}"
      >
        <img src="${thumbSrc}" alt="${produit.nom} — miniature ${idx + 1}">
      </button>
    `;
  }).join("");

  const boutonVideo = produit.video
    ? `
      <button
        type="button"
        class="modal-thumb-btn modal-thumb-video"
        data-type="video"
        data-video-src="${produit.video}"
        aria-label="Voir la vidéo de ${produit.nom}"
      >
        <span>&#9654;</span>
        <span>Vidéo</span>
      </button>
    `
    : "";

  vignettesBox.innerHTML = `${boutonsPhotos}${boutonVideo}`;

  vignettesBox.querySelectorAll(".modal-thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      vignettesBox.querySelectorAll(".modal-thumb-btn").forEach((b) => b.classList.remove("actif"));
      btn.classList.add("actif");

      if (btn.dataset.type === "video") {
        afficherVideoDansModal(btn.dataset.videoSrc);
      } else {
        afficherPhotoDansModal(btn.dataset.fullSrc);
      }
    });
  });

  if (variantesContainer) {
    variantesContainer.innerHTML = genererHtmlVariantes(
      produit,
      varianteCourante,
      "modal-select-variante"
    );

    const modalSelect = document.getElementById("modal-select-variante");
    if (modalSelect) {
      modalSelect.addEventListener("change", () => {
        varianteCourante = getVarianteParId(produit, modalSelect.value);
        actualiserEtatModal();
        if (varianteCourante && varianteCourante.image) {
          afficherPhotoDansModal(varianteCourante.image);
          const idx = grandes.indexOf(varianteCourante.image);
          if (idx >= 0) {
            vignettesBox.querySelectorAll(".modal-thumb-btn").forEach((b, i) => {
              b.classList.toggle("actif", b.dataset.type === "image" && i === idx);
            });
          }
        }
      });
    }
  }

  photoPrincipale.onclick = () => {
    ouvrirCadrePhoto(photoPrincipale.src, produit.nom);
  };

  actualiserEtatModal();

  ajouterBtn.onclick = () => {
    const varId = varianteCourante ? varianteCourante.id : null;
    if (ajouterAuPanier(produit.id, varId)) {
      fermerModalProduit();
    }
  };

  modal.hidden = false;
}

function fermerModalProduit() {
  const videoPrincipale = document.getElementById("modal-produit-video-principale");
  if (videoPrincipale) {
    videoPrincipale.pause();
    videoPrincipale.removeAttribute("src");
    videoPrincipale.hidden = true;
  }
  fermerModalParId("produit-modal");
}

function initialiserModalProduit() {
  const modal = document.getElementById("produit-modal");
  const closeBtn = document.getElementById("close-produit-btn");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", fermerModalProduit);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      fermerModalProduit();
    }
  });
}

function ouvrirCadrePhoto(src, altText = "") {
  const modal = document.getElementById("photo-cadre-modal");
  const img = document.getElementById("photo-cadre-img");
  if (!modal || !img || !src) return;

  img.src = src;
  img.alt = altText;
  modal.hidden = false;
}

function fermerCadrePhoto() {
  fermerModalParId("photo-cadre-modal");
}

function initialiserCadrePhoto() {
  const modal = document.getElementById("photo-cadre-modal");
  const closeBtn = document.getElementById("close-photo-cadre-btn");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", fermerCadrePhoto);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      fermerCadrePhoto();
    }
  });
}

function initialiserPhotoAPropos() {
  const img = document.getElementById("apropos-photo-img");
  const placeholder = document.getElementById("apropos-photo-placeholder");
  if (!img || !placeholder) return;

  const src = (img.getAttribute("src") || "").trim();
  if (src) {
    img.hidden = false;
    placeholder.hidden = true;
  } else {
    img.hidden = true;
    placeholder.hidden = false;
  }
}

function initialiserFormulairePersonnalise() {
  const form = document.getElementById("form-creation-personnalisee");
  const statutEl = document.getElementById("perso-statut");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const nom = String(formData.get("nom") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const typeCreation = String(formData.get("type_creation") || "");
    const occasionDate = String(formData.get("occasion_date") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!nom || !email || !message) {
      if (statutEl) statutEl.textContent = "Merci de renseigner les champs obligatoires.";
      return;
    }

    const estSurNetlify = !["localhost", "127.0.0.1", ""].includes(window.location.hostname);

    if (estSurNetlify) {
      try {
        const encoded = new URLSearchParams(formData).toString();
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encoded
        });

        if (!res.ok) {
          throw new Error("Réponse réseau inattendue.");
        }

        form.reset();
        if (statutEl) {
          statutEl.textContent = "Merci ! Ton message a bien été envoyé à bouilles.a.malice@gmail.com.";
        }
        return;
      } catch (err) {
        if (statutEl) {
          statutEl.textContent = "Envoi direct indisponible pour le moment : ouverture de ta messagerie vers bouilles.a.malice@gmail.com.";
        }
      }
    }

    const sujet = encodeURIComponent(`Contact — ${typeCreation} (${nom})`);
    const corps = encodeURIComponent(
      `Nom : ${nom}\n` +
      `E-mail : ${email}\n` +
      `Type de création : ${typeCreation}\n` +
      `Date / occasion : ${occasionDate || "Non précisée"}\n\n` +
      `Description :\n${message}`
    );
    window.location.href = `mailto:bouilles.a.malice@gmail.com?subject=${sujet}&body=${corps}`;
    if (statutEl) {
      statutEl.textContent = "Ta messagerie s'ouvre avec le message prérempli pour bouilles.a.malice@gmail.com.";
    }
  });
}

function initialiserRetourPaiement() {
  const banner = document.getElementById("paiement-retour-banner");
  if (!banner) return;

  const params = new URLSearchParams(window.location.search);
  const statutPaiement = params.get("paiement");

  if (statutPaiement === "ok") {
    banner.innerHTML =
      "<strong>Merci pour ta commande !</strong> Ton paiement sécurisé a bien été validé et un reçu Stripe vient de t'être envoyé par e-mail. " +
      "Tes <strong>kits numériques</strong> te sont envoyés par e-mail sous 24 h (pense à vérifier tes spams), et pour toute <strong>création physique</strong>, " +
      "tu recevras le numéro de suivi Colissimo ou Mondial Relay dès l'expédition de ton colis.";
    banner.classList.remove("annule");
    banner.hidden = false;
  } else if (statutPaiement === "annule") {
    banner.innerHTML =
      "<strong>Paiement annulé.</strong> Ta commande n'a pas été débitée. Tu peux reprendre ton panier à tout moment ou nous écrire à <strong>bouilles.a.malice@gmail.com</strong> si tu as une question.";
    banner.classList.add("annule");
    banner.hidden = false;
  }
}

function initialiserFiltres() {
  document.querySelectorAll(".filtre-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      categorieActive = btn.dataset.categorie;
      document.querySelectorAll(".filtre-btn").forEach((b) => b.classList.remove("actif"));
      btn.classList.add("actif");
      afficherCatalogue();
    });
  });
}

function ajouterAuPanier(id, varianteId = null) {
  const produit = PRODUITS.find((p) => p.id === id);
  if (!produit) return false;

  const variante = getVarianteParId(produit, varianteId);
  const stockMax = getStockMax(produit, variante);

  if (stockMax <= 0) {
    alert("Cette déclinaison est actuellement épuisée.");
    return false;
  }

  const clePanier = variante ? `${produit.id}::${variante.id}` : produit.id;
  const libellePanier = variante ? `${produit.nom} (${variante.nom})` : produit.nom;
  const { typeLivraison, gabarit } = getInfosLivraisonProduit(produit, variante);

  const existant = panier.find((item) => item.cle === clePanier);
  const qtyActuelle = existant ? existant.qty : 0;

  if (qtyActuelle + 1 > stockMax) {
    alert(`Stock maximum disponible pour cette déclinaison : ${stockMax}.`);
    return false;
  }

  if (existant) {
    existant.qty += 1;
  } else {
    panier.push({
      cle: clePanier,
      id: produit.id,
      varianteId: variante ? variante.id : null,
      nom: libellePanier,
      prix: produit.prix,
      livraison: typeLivraison,
      gabarit,
      qty: 1
    });
  }
  afficherPanier();
  return true;
}

function afficherPanier() {
  const liste = document.getElementById("panier-items");
  const countEl = document.getElementById("panier-count");
  const headerCountEl = document.getElementById("header-panier-count");
  const totalEl = document.getElementById("panier-total");
  if (!liste || !countEl || !totalEl) return;

  const totalQty = panier.reduce((acc, item) => acc + item.qty, 0);
  const resume = calculerResumePanier();

  countEl.textContent = totalQty;
  if (headerCountEl) headerCountEl.textContent = totalQty;

  if (!panier.length) {
    liste.innerHTML = "<li>Ton panier est vide pour le moment.</li>";
    totalEl.textContent = "0.00 €";
    return;
  }

  const lignesArticles = panier.map((item) => {
    const { typeLivraison, gabarit } = getInfosLivraisonItem(item);
    const infoLivraison = typeLivraison === "numerique"
      ? "Numérique (0,00 € port)"
      : `Physique — gabarit ${gabarit}`;
    return `<li>${item.nom} × ${item.qty} — <em>${infoLivraison}</em> — ${(item.prix * item.qty).toFixed(2)} €</li>`;
  });

  let detailPort = "0.00 €";
  if (resume.aDuPhysique) {
    if (resume.sousTotalTotal >= SEUIL_PORT_GRATUIT) {
      detailPort = "0.00 € (offert dès 75,00 €)";
    } else if (resume.quantitePhysique >= 2) {
      detailPort = `${resume.fraisPort.toFixed(2)} € (Mondial Relay / Colissimo — forfait 2+ produits physiques)`;
    } else {
      detailPort = `${resume.fraisPort.toFixed(2)} € (Mondial Relay / Colissimo — gabarit ${resume.gabaritMax})`;
    }
  } else {
    detailPort = "0.00 € (articles numériques)";
  }

  lignesArticles.push(`<li>Frais de port : <strong>${detailPort}</strong></li>`);

  if (resume.aDuPhysique && resume.montantRestantPortGratuit > 0) {
    lignesArticles.push(
      `<li><strong>Plus que ${resume.montantRestantPortGratuit.toFixed(2)} € pour avoir les frais de port offerts !</strong></li>`
    );
  }

  liste.innerHTML = lignesArticles.join("");
  totalEl.textContent = `${resume.totalAvecPort.toFixed(2)} €`;
}

function initialiserCheckout() {
  const btn = document.getElementById("btn-checkout");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!panier.length) {
      alert("Ton panier est vide.");
      return;
    }

    try {
      const res = await fetch("/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: panier })
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Erreur lors de la création du paiement.");
      }

      window.location.href = data.url;
    } catch (err) {
      alert(`Le module Stripe n'est pas encore activé en ligne (ou erreur réseau).\nDétail : ${err.message}`);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialiserRetourPaiement();
  initialiserFiltres();
  initialiserCheckout();
  initialiserModalesGenerales();
  initialiserModalProduit();
  initialiserCadrePhoto();
  initialiserPhotoAPropos();
  initialiserFormulairePersonnalise();
  afficherCatalogue();
  afficherPanier();
});