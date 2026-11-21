const PRODUITS = [
  {
    id: "fig-001",
    nom: "Barnabé le Grognon",
    categorie: "monstres",
    categorieLabel: "Petit Monstre",
    prix: 28.00,
    stock: 1, // 1 = pièce unique disponible | 0 = adoptée
    hauteur: "11 cm",
    materiaux: "Mousse haute densité sculptée, peinture acrylique, vernis mat",
    emoji: "👹",
    couleurFond: "#FFE3E3",
    images: [
      "images/barnabe-1.jpg", // Vue principale (face)
      "images/barnabe-2.jpg", // Vue de profil / dos
      "images/barnabe-3.jpg"  // Mise en situation / échelle
    ],
    descriptionCourte: "Un petit monstre cornu au regard boudeur mais au cœur tout mou.",
    histoire: "Barnabé adore surveiller le coin des étagères. Sculpté entièrement à la main, chaque pli de son front est unique."
  },
  {
    id: "fig-002",
    nom: "Gaston le Champi-Lutin",
    categorie: "fantastique",
    categorieLabel: "Fantastique",
    prix: 32.00,
    stock: 1,
    hauteur: "13 cm",
    materiaux: "Mousse sculptée, acrylique perlée, vernis satiné",
    emoji: "🍄",
    couleurFond: "#E3FAFC",
    images: [
      "images/gaston-1.jpg",
      "images/gaston-2.jpg",
      "images/gaston-3.jpg"
    ],
    descriptionCourte: "Coiffé d'un chapeau tacheté, il veille sur les plantes d'intérieur.",
    histoire: "Né un jour de pluie dans l'atelier, Gaston apporte une touche féerique à côté d'un pot de fleurs."
  },
  {
    id: "fig-003",
    nom: "Pétunia la Chouette Bigleuse",
    categorie: "animaux",
    categorieLabel: "Bestiole & Forêt",
    prix: 26.00,
    stock: 2,
    hauteur: "9,5 cm",
    materiaux: "Mousse haute densité, peinture acrylique",
    emoji: "🦉",
    couleurFond: "#FFF3BF",
    images: [
      "images/petunia-1.jpg",
      "images/petunia-2.jpg",
      "images/petunia-3.jpg"
    ],
    descriptionCourte: "Deux grands yeux ronds qui suivent tout ce qui se passe dans le salon.",
    histoire: "Pétunia ne dort jamais vraiment : elle observe votre bureau avec une curiosité infinie."
  },
  {
    id: "fig-004",
    nom: "Zéphyr le Dragonnet",
    categorie: "fantastique",
    categorieLabel: "Fantastique",
    prix: 38.00,
    stock: 0,
    hauteur: "14 cm",
    materiaux: "Mousse sculptée, peinture métallisée, vernis protecteur",
    emoji: "🐲",
    couleurFond: "#E5DBFF",
    images: [
      "images/zephyr-1.jpg",
      "images/zephyr-2.jpg",
      "images/zephyr-3.jpg"
    ],
    descriptionCourte: "Un bébé dragon malicieux aux petites ailes déployées.",
    histoire: "Adopté récemment ! Il crache uniquement des confettis imaginaires."
  }
];