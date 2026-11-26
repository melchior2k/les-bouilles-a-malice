const PRODUITS = [
  {
    id: "Sophia-fee-stylo",
    nom: "Sophia — Fée en mousse cache-stylo",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	aLaUne: false,
	nouveau: false,
    prix: 16.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/presentation.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "rose-grise",
        nom: "Rose & Grise",
        stock: 1,
        image: "images/sophia-1-rose-jaune-marron.webp"
      },
      {
        id: "bleu-grise",
        nom: "Bleu & Blanche",
        stock: 1,
        image: "images/sophia-2-bleu-jaune-orange.webp"
      },
      {
        id: "rose-marron",
        nom: "Rose & Marron",
        stock: 1,
        image: "images/sophia-3-rose-bleu-marron.webp"
      }
    ],
    images: [
      "images/sophia-1-rose-jaune-marron.webp",
      "images/sophia-1-entiere-rose-jaune-marron.webp",
      "images/sophia-2-bleu-jaune-orange.webp",
      "images/sophia-2-entiere-bleu-jaune-orange.webp",
      "images/sophia-3-rose-bleu-marron.webp",
      "images/sophia-3-entiere-rose-bleu-marron.webp",
      "images/sophia-4-autres-couleurs.webp",
      "images/sophia-5-exemple-stylo.webp"
    ],
    vignettes: [

    ],
    description: "Petite fée malicieuse façonnée à la main en mousse avec ailes bicolores, couettes bouclées et base amovible dissimulant un stylo prêt à l'emploi.",
    descriptionDetaillee: "Sophia est une figurine artisanale façonnable en mousse arborant de joyeuses couettes bouclées, des ailes bicolores, une jupe plissée et un socle décoré de petits nœuds. Sa base amovible dissimule astucieusement un stylo prêt à écrire : idéale sur un bureau, une étagère ou comme cadeau original et malicieux. La figurine mesure environ 22 cm de haut (écriture encre noire). Si vous souhaitez des couleurs particulières, n'hésitez pas à me contacter !",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Cache un stylo sous son socle amovible",
      finition: "Pièce artisanale en mousse"
    }
  },
  {
    id: "Paniers-noel",
    nom: "Paniers de Noël — Petites boîtes à friandises",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: false,
	aLaUne: false,
    prix: 3.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	video: "videos/paniers-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "blanc-flocon-bleu",
        nom: "Blanc & Flocon bleu",
        stock: 1,
        image: "images/paniers-pere-noel-3-bleuclair.webp"
      },
      {
        id: "rose-flocon-argent",
        nom: "Rose & Flocon argent",
        stock: 1,
        image: "images/paniers-pere-noel-3-rose.webp"
      },
      {
        id: "rouge-fleur-rouge",
        nom: "Rouge & Fleur rouge",
        stock: 1,
        image: "images/paniers-pere-noel-3-rouge.webp"
      },
      {
        id: "blanc-pere-noel",
        nom: "Blanc & Père Noel",
        stock: 1,
        image: "images/paniers-pere-noel-3-blanc.webp"
      }
    ],
    images: [
      "images/paniers-pere-noel-1.webp",
      "images/paniers-pere-noel-2-blanc-rouge.webp",
      "images/paniers-pere-noel-2-rose-bleuclair.webp",
      "images/paniers-pere-noel-3-blanc.webp",
      "images/paniers-pere-noel-3-bleuclair.webp",
      "images/paniers-pere-noel-3-rose.webp",
      "images/paniers-pere-noel-3-rouge.webp"
    ],
    vignettes: [
    ],
    description: "Mini-paniers de Noël façonnés à la main en mousse avec anse et socle fleuri : parfaits pour glisser des chocolats, petites douceurs, mots des lutins ou marque-places de fête.",
    descriptionDetaillee: "De jolis petits paniers festifs réalisés artisanalement en mousse légère, dotés d'une corolle arrondie, d'un socle en forme d'étoile/fleur et d'une anse ornée de motifs hivernaux (Père Noël, flocons pailletés ou étoile de Noël). Idéaux pour déposer quelques chocolats ou friandises sur la table de fête, accompagner le passage des lutins de Noël ou offrir une petite attention gourmande. Chaque pièce étant assemblée à la main, de légères variations de couleurs, de motifs ou de découpe font partie de son charme unique. Si vous souhaitez des couleurs particulières, n'hésitez pas à me contacter !",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Petits paniers de Noël décorés",
      finition: "Pièce artisanale en mousse"
    }
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "trio-givres-bohnomme-neige",
    nom: "Trio de Givrés - Décoration hivernale !",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: false,
    prix: 29.90,
    livraison: "physique",
    gabarit: "moyen", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/xxx.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Couleur unique",
        stock: 1,
        image: "images/bonhomme-neige-rigolo-1.jpg"
      }
    ],
    images: [
      "images/bonhomme-neige-rigolo-1.jpg",
      "images/bonhomme-neige-rigolo-2.jpg",
      "images/bonhomme-neige-rigolo-3.jpg",
      "images/bonhomme-neige-rigolo-4.jpg",
      "images/bonhomme-neige-rigolo-5.jpg",
      "images/bonhomme-neige-rigolo-6.jpg",
      "images/bonhomme-neige-rigolo-7.jpg"
    ],
    vignettes: [
    ],
    description: "Totem rigolo à trois étages style bonhomme de neige, façonné à la main avec haut-de-forme à flocon, nez carotte et écharpes colorées à franges : une déco hivernale pleine de bonne humeur.",
    descriptionDetaillee: "Un bonhomme de neige tout en hauteur et en malice, composé de trois sphères blanches superposées sur un socle bleu pailleté, chacune dotée de sa propre expression espiègle et d'un nez carotte orangé. Il porte un chapeau haut-de-forme noir orné d'un flocon bleu-vert et trois écharpes à franges aux motifs variés (bleue à étoiles et nuages, orangée à carreaux, arc-en-ciel à rayures) qui donnent du relief et du mouvement à l'ensemble. Parfait pour égayer une étagère, une table de fête ou un rebord de fenêtre pendant l'hiver et les fêtes. Chaque création étant réalisée à la main, de légères variations de teintes, de motifs ou de finition font partie de son charme unique. La figurine est sur socle et mesure environ 32cm de hauteur.",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Trio givré de bonhomme de neige",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "figurine-mongolfiere-ourson",
    nom: "Ourson en montgolfière - Figurine à suspendre",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: false,
	aLaUne: true,
    prix: 28.90,
    livraison: "physique",
    gabarit: "grand", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/xxx.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Couleur unique",
        stock: 1,
        image: "images/figurine-ourson-mongolfiere-1.webp"
      }
    ],
    images: [
      "images/figurine-ourson-mongolfiere-1.webp"
    ],
    vignettes: [
    ],
    description: "Ourson en montgolfière rose façonné à la main en mousse avec petits nœuds blancs et nacelle assortie : léger et à suspendre, idéal comme cadeau de naissance ou décoration douce pour une chambre de bébé.",
    descriptionDetaillee: "Un adorable petit ourson brun installé dans sa nacelle rose bordée de blanc, qui s'envole sous une montgolfière en mousse rose rehaussée de petits nœuds blancs et reliée par de fines tiges en bois. Entièrement façonné et assemblé artisanalement à la main en mousse légère, il peut se poser ou se suspendre facilement pour apporter une touche poétique et tendre dans une chambre de bébé ou d'enfant.\n\nC'est une belle idée de cadeau de naissance original et fait main, qui accompagnera les premiers rêves de bébé. Chaque création étant réalisée à la main, de légères nuances de découpe ou de finition font partie de son charme unique.\n\nL’ensemble mesure un peu plus de 30cm et peut soit se poser, soit être suspendu. Les couleurs et certaints détails peuvent être modifiés (les noeuds par des étoiles ou des nuages par exemple) : n'hésitez pas à me contacter pour un modèle personnalisé !",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Trio givré de bonhomme de neige",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "marque-place-noel",
    nom: "Marque place - Thème de Noêl",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: false,
	aLaUne: false,
    prix: 2.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/xxx.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "Lutin",
        nom: "Lutin de Noël",
        stock: 1,
        image: "images/marque-place-noel-4-gnome.jpg"
      },
	  {
        id: "Bonhomme de neige",
        nom: "Bonhomme de neige",
        stock: 1,
        image: "images/marque-place-noel-4-bonhomme-neige.jpg"
      }
    ],
    images: [
      "images/marque-place-noel-1.jpg",
      "images/marque-place-noel-2.jpg",
      "images/marque-place-noel-3.jpg",
      "images/marque-place-noel-4-gnome.jpg",
	  "images/marque-place-noel-4-bonhomme-neige.jpg"
    ],
    vignettes: [
    ],
    description: "Marque-places de Noël façonnés à la main en mousse avec pince en bois au dos (bonhomme de neige à haut-de-forme ou lutin étoilé) : parfaits pour glisser un prénom, un menu ou un petit mot sur la table de fête.",
    descriptionDetaillee: "De jolis marque-places de Noël réalisés artisanalement à la main en mousse légère et montés au dos sur une pince en bois pratique pour tenir cartes de placement, petits cartons menus ou mots doux des invités.\n\nDeux modèles hivernaux pleins de charme sont proposés : un bonhomme de neige souriant coiffé d'un haut-de-forme noir à liseré vert pailleté assorti à son écharpe scintillante, et un lutin gris-bleu à longue barbe blanche texturée, nez rouge et grand bonnet recourbé parsemé d'étoiles. Chaque pièce étant découpée et assemblée à la main, de légères variations de découpe ou de finition font partie de son charme unique.",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Marques place de Noel Lutin et bonhomme de neige",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "nougat-lapin-boite-friandises",
    nom: "Nougat le lapin - Boîte à friandises",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: false,
    prix: 25.90,
    livraison: "physique",
    gabarit: "moyen", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/xxx.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Couleur unique",
        stock: 1,
        image: "images/nougat-lapin-boite-2.webp"
      }
    ],
    images: [
      "images/nougat-lapin-boite-2.webp",
      "images/nougat-lapin-boite-1.webp",
      "images/nougat-lapin-boite-3.webp"
    ],
    vignettes: [
    ],
    description: "Lapin en salopette bleu clair tenant sa carotte, accompagné de sa petite coupe assortie pour friandises, chocolats ou nougats : une création artisanale pleine de douceur.",
    descriptionDetaillee: "Un adorable lapin blanc façonné à la main en mousse, coiffé de grandes oreilles à pois bleu clair, d'une salopette bleu ciel ornée de boutons et de liserés rayés, et tenant une carotte orange à pois blancs. Il est accompagné de sa petite coupe-bonbonnière assortie sur socle arrondi, idéale pour accueillir des chocolats, nougats ou petites douceurs lors d'un anniversaire, de Pâques ou d'un goûter de fête. Réalisé artisanalement à la main, chaque exemplaire présente de subtiles nuances qui rendent chaque ensemble unique. La figurine mesure environ 20cm de hauteur.",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Nougat le lapin",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "ael-isil-duo-gnomes-de-noel",
    nom: "Aël et Isil, duo de gnômes de Noël",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: false,
    prix: 28.90,
    livraison: "physique",
    gabarit: "moyen", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	video: "videos/Ael-Isil-gnomes-de-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Couleur unique",
        stock: 1,
        image: "images/ael-isil-gnomes-noel-0.png"
      }
    ],
    images: [
	  "images/ael-isil-gnomes-noel-0.png",
      "images/ael-isil-gnomes-de-noel-1.webp",
      "images/ael-isil-gnomes-de-noel-2.webp",
      "images/ael-isil-gnomes-de-noel-3.webp",
	  "images/ael-isil-gnomes-de-noel-4.webp",
      "images/ael-isil-gnomes-de-noel-5.webp",
      "images/ael-isil-gnomes-de-noel-6.webp",
	  "images/ael-isil-gnomes-de-noel-7.webp",
      "images/ael-isil-gnomes-de-noel-8.webp"
    ],
    vignettes: [
    ],
    description: "Lapin en salopette bleu clair tenant sa carotte, accompagné de sa petite coupe assortie pour friandises, chocolats ou nougats : une création artisanale pleine de douceur.",
    descriptionDetaillee: "Adoptez Aël et Isil, notre duo de gnomes de Noël aux prénoms enchanteurs évoquant la magie céleste. Ce duo parfait plein de magie et de douceur vous apportera une belle ambiance féérique à Noël, mais aussi tout le reste de l'année. Les personnages mesurent environ 17 cm de hauteur.\nLes Bouilles à Malice sont des personnages entièrement faits à la main à partir de matériaux spécifiques de bonne qualité. Les personnages ont leurs jambes et bras articulables afin d’ajuster leur position ou de les mettre en scène dans différentes postures.\n\nAël & Isil forment un modèle unique mais s'il n’est plus disponible, pas de panique ! Il est possible de créer leurs jumeaux sur commande. De même si vous souhaitez des couleurs particulières à appliquer sur ce modèle de personnage, n’hésitez pas à me contacter. ",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Aël et Isil, les gnômes de Noel",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "sulfura-demon-porte-stylo",
    nom: "Sulfura - Petit démon porte-stylo",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: false,
    prix: 16.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/Ael-Isil-gnomes-de-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Couleur unique",
        stock: 1,
        image: "images/sulfura-sorciere-porte-crayon-1.webp"
      }
    ],
    images: [
	  "images/sulfura-sorciere-porte-crayon-1.webp",
      "images/sulfura-sorciere-porte-crayon-2.webp"
    ],
    vignettes: [
    ],
    description: "Petite diablotine malicieuse façonnée à la main en mousse avec coiffure jaune ébouriffée, mini-trident et socle stable : un stylo original qui veille sur le bureau.",
    descriptionDetaillee: "Une diablotine pleine de peps et de malice, réalisée artisanalement en mousse légère : coiffure jaune vif aux mèches ébouriffées, petites cornes rouges, robe rouge lacée à la taille noire et jupette évasée, sans oublier sa queue à pointe noire et son mini-trident noir. Posée sur son socle rouge et orange qui lui assure une bonne tenue, elle cache astucieusement un stylo pour garder un instrument d'écriture à portée de main tout en apportant une touche espiègle sur un bureau ou une étagère. Chaque pièce étant assemblée à la main, de légères variations de découpe, d'expression ou de teintes font partie de son charme unique.\n\nSulfura mesure environ 24 cm de hauteur.",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Sulfura - Petit démon porte-stylo",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "paniers-lutins-noel-friandises",
    nom: "Paniers Lutins de Noël, boîtes à friandises",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: false,
    prix: 7.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	video: "videos/paniers-pieds-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "blanc",
        nom: "Panier lutin blanc",
        stock: 1,
        image: "images/panier-pieds-noel-2-blanc.webp"
      },
	  {
        id: "vert",
        nom: "Panier lutin vert",
        stock: 1,
        image: "images/panier-pieds-noel-2-vert.webp"
      },
	  {
        id: "rouge",
        nom: "Panier lutin rouge",
        stock: 1,
        image: "images/panier-pieds-noel-2-rouge.webp"
      }
    ],
    images: [
      "images/panier-pieds-noel-1.webp",
      "images/panier-pieds-noel-2-blanc.webp",
      "images/panier-pieds-noel-2-vert.webp",
	  "images/panier-pieds-noel-2-rouge.webp",
      "images/panier-pieds-noel-3.webp"
    ],
    vignettes: [
    ],
    description: "Pour vos friandises ou chocolats à l'occasion des fêtes de fin d'année, nous vous proposons ces jolis paniers en forme de lutin du Père Noël !",
    descriptionDetaillee: "Pour vos friandises ou chocolats à l'occasion des fêtes de fin d'année, nous vous proposons ces jolis paniers en forme de lutin du Père Noël !\n\nLes dimensions des paniers sont : entre 8cm à 12cm de large, 13cm de haut et 5cm de profondeur.\n\n3 choix de couleur sont disponibles.\n\nCette décoration peut aussi être réalisée dans d'autres couleurs ou avec d'autres détails. Pour toutes questions ou commandes particulières, n'hésitez pas à prendre contact avec moi : réponse rapide assurée ! ",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Paniers Lutins de Noël, boîtes à friandises",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "panier-paques-cloches",
    nom: "Paniers Pâques Cloche, boîtes à friandises",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: false,
    prix: 9.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/paniers-pieds-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "jaune",
        nom: "Cloche de Pâques jaune",
        stock: 1,
        image: "images/panier-paques-cloche-jaune.webp"
      },
	  {
        id: "vert",
        nom: "Cloche de Pâques orange",
        stock: 1,
        image: "images/panier-paques-cloche-orange.webp"
      }
    ],
    images: [
      "images/panier-paques-cloche-jaune.webp",
      "images/panier-paques-cloche-orange.webp"
    ],
    vignettes: [
    ],
    description: "Panier de Pâques en forme de cloche ailée façonné à la main en mousse, avec poignées intégrées, petites fleurs colorées et vrai grelot doré : idéal pour récolter les œufs et friandises lors de la chasse aux œufs.",
    descriptionDetaillee: "Un joyeux panier de Pâques en forme de cloche ailée, entièrement réalisé artisanalement en mousse légère et pensé pour les petites mains lors de la chasse aux œufs. Doté de deux poignées découpées au sommet, d'ailes blanches soulignées d'un liseré doré, d'une frise de petites fleurs colorées et d'un véritable grelot doré suspendu en dessous qui tinte à chaque pas, il accueille facilement œufs en chocolat, fritures et petites douceurs.\n\nHauteur 17cm (sans compter le grelot), largeur 15cm (à la base de la cloche) et profondeur 5cm.\n\nLa cloche peut être réalisée dans d'autres couleurs ou avec d'autres détails. Pour toutes questions ou commandes particulières, n'hésitez pas à prendre contact avec moi !",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Paniers de paques Cloche",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "panier-coeurs-tresses",
    nom: "Paniers en forme de cœur tressé",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: false,
    prix: 5.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/paniers-pieds-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "mauve",
        nom: "Mauve & Bleu",
        stock: 1,
        image: "images/paniers-coeurs-tresses-2-mauve.jpg"
      },
	  {
        id: "jaune",
        nom: "Jaune & Orange",
        stock: 1,
        image: "images/paniers-coeurs-tresses-2-jaune.jpg"
      },
	  {
        id: "violet",
        nom: "Violet & Gris",
        stock: 1,
        image: "images/paniers-coeurs-tresses-2-violet.jpg"
      },
	  {
        id: "rose",
        nom: "Rose & Mauve",
        stock: 1,
        image: "images/paniers-coeurs-tresses-2-rose.jpg"
      }
    ],
    images: [
      "images/paniers-coeurs-tresses-1.jpg",
      "images/paniers-coeurs-tresses-2-mauve.jpg",
	  "images/paniers-coeurs-tresses-2-jaune.jpg",
	  "images/paniers-coeurs-tresses-2-violet.jpg",
	  "images/paniers-coeurs-tresses-2-rose.jpg"
    ],
    vignettes: [
    ],
    description: "Petits paniers en forme de cœur tressés à la main en mousse bicolore avec anse assortie et petite fleur : parfaits pour glisser chocolats, friandises, petits mots ou marque-places.",
    descriptionDetaillee: "De jolis petits paniers en forme de cœur tressés artisanalement à la main en mousse légère, associant deux teintes coordonnées et une anse assortie pour un rendu graphique et plein de fraîcheur. Chaque cœur est rehaussé d'une petite fleur fleurie délicate et offre une petite poche idéale pour glisser quelques chocolats, friandises, mots doux, attentions de fête ou petites surprises.\n\nPetit panier en forme de cœur tressé mesurant 16cm x 17cm environ.Hauteur totale de 25cm avec l'anse du panier.",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Paniers Coeurs Tressés",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "cadre-decoratif-elephant",
    nom: "Cadre à accrocher - Éléphant dans la nature",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: false,
	aLaUne: false,
    prix: 16.90,
    livraison: "physique",
    gabarit: "moyen", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/paniers-pieds-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Modèle unique",
        stock: 1,
        image: "images/cadre-decoratif-elephant-1.webp"
      }
    ],
    images: [
      "images/cadre-decoratif-elephant-1.webp"      
    ],
    vignettes: [
    ],
    description: "Tableau décoratif à accrocher mettant en scène un petit éléphant gris en relief sous un grand arc-en-ciel bordé de nuages et une prairie fleurie : idéal pour égayer une chambre d'enfant.",
    descriptionDetaillee: "Un tableau décoratif plein de douceur et de relief, monté sur toile peinte et habillé d'éléments en mousse découpés et assemblés à la main : un adorable petit éléphant gris se promène dans une prairie verdoyante parsemée de touffes d'herbe et de petites fleurs rouges, jaunes et blanches, sous un ciel bleu étoilé de petits points blancs et surmonté d'un grand arc-en-ciel entouré de nuages moelleux.\n\nCadre de 20cm x 20 cm avec un éléphant et des nuages en relief (effet bombé).",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Cadre décoratif éléphant",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "selma-gentille-sorciere-elegante-souriante",
    nom: "Selma, gentille sorcière souriante et élégante",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: true,
	aLaUne: true,
    prix: 44.90,
    livraison: "physique",
    gabarit: "grand", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	video: "videos/selma-sorciere-elegante.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Modèle unique",
        stock: 1,
        image: "images/selma-gentille-sorciere-elegante-souriante-1.webp"
      }
    ],
    images: [
      "images/selma-gentille-sorciere-elegante-souriante-1.webp",     
	  "images/selma-gentille-sorciere-elegante-souriante-2.webp", 
	  "images/selma-gentille-sorciere-elegante-souriante-3.webp", 
	  "images/selma-gentille-sorciere-elegante-souriante-4.webp", 
	  "images/selma-gentille-sorciere-elegante-souriante-5.webp", 
	  "images/selma-gentille-sorciere-elegante-souriante-6.webp",
	  "images/selma-gentille-sorciere-elegante-souriante-7.webp" 	  
    ],
    vignettes: [
    ],
    description: "Figurine de gentille sorcière façonnée à la main en mousse, avec boucles rose vif, chapeau pointu noir à ruban rose, petit balai et bottines à lacets : une pièce pleine de malice et d'élégance à poser sur une étagère ou un bureau.",
    descriptionDetaillee: "Selma est une gentille sorcière pleine de bonne humeur, façonnée et assemblée artisanalement à la main en mousse légère. Elle affiche un grand sourire et un clin d'œil espiègle avec un petit cœur rose sur la joue, entourée d'une cascade de boucles rose vif et coiffée d'un chapeau noir à ruban rose orné d'une petite araignée.\n\nVêtue d'un haut gris à motifs floraux découpé en pointes et d'une jupe noire effilée, elle tient un balai en bois aux poils rose vif entouré de mousse noire (avec sa petite araignée complice) et chausse de jolies bottines noires et grises à lacets. Réalisée à la main, chaque figurine possède son caractère propre et de subtiles nuances qui la rendent unique.\n\nSelma mesure environ 38 cm de hauteur.",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Personnage Selma Sorciere Gentille Elegante Souriante",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "embout-crayon-tete-pirate",
    nom: "Crayon a papier - Embout tête de pirate",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: false,
	aLaUne: false,
    prix: 3.90,
    livraison: "physique",
    gabarit: "petit", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/paniers-pieds-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "unique",
        nom: "Modèle unique",
        stock: 3,
        image: "images/embout-crayon-tete-pirate-1.jpg"
      }
    ],
    images: [
      "images/embout-crayon-tete-pirate-1.jpg",   
	  "images/embout-crayon-tete-pirate-2.jpg",
	  "images/embout-crayon-tete-pirate-3.jpg"
    ],
    vignettes: [
    ],
    description: "Crayon à papier surmonté d'un embout tête de pirate façonné à la main en mousse, avec tricorne noir surpiqué, bandana rouge à pois blancs et cache-œil : un petit compagnon d'aventure idéal pour la trousse ou les pochettes cadeaux d'anniversaire.",
    descriptionDetaillee: "Monté sur un crayon à papier vert prêt à écrire (et réutilisable ensuite sur d'autres crayons standards), il accompagne aussi bien les devoirs et dessins du quotidien qu'un anniversaire sur le thème des pirates, une chasse au trésor ou une pochette surprise. Chaque embout étant réalisé artisanalement à la main, de légères variations d'expression ou de découpe font partie de son charme unique.",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Embout Crayon Tête de Pirate",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  { //FICHE PRODUIT DEBUT -----------------------------------------------------------------------------------
    id: "paniers-noel-renne",
    nom: "Paniers renne de Noël - Boîtes à friandises.",
    categorie: "figurines-mousse",
    categorieLabel: "Les figurines en mousse",
	nouveau: false,
	aLaUne: false,
    prix: 14.90,
    livraison: "physique",
    gabarit: "moyen", // "petit" (4,90 €) | "moyen" (5,90 €) | "grand" (6,90 €)
    varianteLabel: "Style / Couleur",
	//video: "videos/paniers-pieds-noel.mp4", // Décommente et indique le chemin de ta vidéo .mp4
    variantes: [
      {
        id: "Vert",
        nom: "Renne vert",
        stock: 1,
        image: "images/panier-rennes-noel-2-vert.webp"
      },
	  {
        id: "Rose",
        nom: "Renne rose",
        stock: 1,
        image: "images/panier-rennes-noel-2-rose.webp"
      }
    ],
    images: [
      "images/panier-rennes-noel-1.webp",   
	  "images/panier-rennes-noel-2-vert.webp",
	  "images/panier-rennes-noel-2-rose.webp",
	  "images/panier-rennes-noel-3.webp", 
	  "images/panier-rennes-noel-4.webp" 
    ],
    vignettes: [
    ],
    description: "Panier de Noël en mousse en forme de renne malicieux au bonnet et nœud papillon pailletés, avec compartiment arrière intégré : idéal pour glisser chocolats, papillotes, courriers des lutins ou petits cadeaux sur la table de fête.",
    descriptionDetaillee: "Un joyeux renne de Noël façonné à la main en mousse légère, qui fait un clin d'œil malicieux avec son museau rouge, ses grands bois découpés, son bonnet de Noël pailleté à pompon blanc et son nœud papillon scintillant assorti. À l'arrière se cache un compartiment rigide et stable en forme de panier, parfait pour accueillir chocolats, papillotes, mandarines, petites surprises d'invités ou même les messages des lutins farceurs en décembre.\n\nLes dimensions du panier sont : 18cm de large, 21cm de haut (11cm sur la partie arrière), 5cm de profondeur.\n\nCette décoration peut aussi être réalisée dans d'autres couleurs ou avec d'autres détails. Pour toutes questions ou commandes particulières, n'hésitez pas à prendre contact avec moi !",
	
    carteCollection: {
      univers: "Bouilles à Malice",
      particularite: "Embout Crayon Tête de Pirate",
      finition: "Pièce artisanale en mousse"
    }
  //FICHE PRODUIT FIN  -----------------------------------------------------------------------------------
  },
  {
    id: "chasse-dinosaures",
    nom: "Chasse au trésor : Sur la piste des dinosaures",
    categorie: "chasses-au-tresor",
    categorieLabel: "Les chasses au trésor",
	nouveau: false,
	aLaUne: false,
    prix: 14.00,
    stock: 20,
    livraison: "numerique", // "numerique" (0 €) | "physique"
    gabarit: "petit",
    images: [
      "images/chasse-dinosaures-1.jpg",
      "images/chasse-dinosaures-2.jpg",
      "images/chasse-dinosaures-3.jpg"
    ],
    description: "Kit d'aventure complet pour anniversaire et fête d'enfants : énigmes, indices à cacher, carte au trésor et diplôme d'explorateur paléontologue.",
    descriptionDetaillee: "Conçu pour animer un goûter d'anniversaire ou une fête entre amis sans stress pour les parents, ce kit plonge les enfants dans une expédition préhistorique : indices prêts à être cachés dans la maison ou le jardin, énigmes adaptées aux jeunes aventuriers, carte d'exploration et diplôme final pour chaque participant.",
    carteCollection: {
      univers: "Anniversaire & Fête",
      age: "4–9 ans",
      duree: "45 à 60 min",
      joueurs: "2 à 10 enfants"
    }
  },
  {
    id: "chasse-minecraft",
    nom: "Chasse au trésor : Aventure cubique façon Minecraft",
    categorie: "chasses-au-tresor",
    categorieLabel: "Les chasses au trésor",
	nouveau: false,
	aLaUne: false,
    prix: 14.00,
    stock: 20,
    livraison: "numerique",
    gabarit: "petit",
    images: [
      "images/chasse-minecraft-1.jpg",
      "images/chasse-minecraft-2.jpg",
      "images/chasse-minecraft-3.jpg"
    ],
    description: "Une chasse au trésor inspirée de l'univers des blocs et de l'exploration : défis d'observation, épreuves par équipe et coffre final à déverrouiller.",
    descriptionDetaillee: "Un parcours d'aventure dynamique autour de l'exploration, de la collecte d'indices et des défis d'équipe. Parfait pour un anniversaire ou une après-midi récréative : les joueurs enchaînent des énigmes visuelles et des petits défis pour localiser le coffre final.",
    carteCollection: {
      univers: "Anniversaire & Fête",
      age: "6–11 ans",
      duree: "45 à 75 min",
      joueurs: "2 à 12 enfants"
    }
  },
  {
    id: "lutins-a-travers-les-pays",
    nom: "Les lutins à travers les pays",
    categorie: "lutins-noel",
    categorieLabel: "Les aventures des lutins de Noël",
	nouveau: false,
	aLaUne: false,
    prix: 12.00,
    stock: 25,
    livraison: "numerique",
    gabarit: "petit",
    images: [
      "images/lutins-pays-1.jpg",
      "images/lutins-pays-2.jpg",
      "images/lutins-pays-3.jpg"
    ],
    description: "Un tour du monde féerique avec les lutins de Noël : chaque étape fait découvrir une tradition, un salut ou une spécialité d'un autre pays.",
    descriptionDetaillee: "Chaque matin de décembre, les lutins rapportent un clin d'œil venu d'ailleurs : mots doux, découvertes culturelles simples, petites idées de mise en scène et clins d'œil festifs pour faire voyager les enfants tout en préparant Noël en famille.",
    carteCollection: {
      univers: "Magie de Noël",
      age: "3–9 ans",
      duree: "Rituels quotidiens (5–10 min)",
      joueurs: "En famille"
    }
  },
  {
    id: "lutins-moyens-de-transport",
    nom: "Les lutins et les moyens de transport",
    categorie: "lutins-noel",
    categorieLabel: "Les aventures des lutins de Noël",
	nouveau: false,
	aLaUne: false,
    prix: 12.00,
    stock: 25,
    livraison: "numerique",
    gabarit: "petit",
    images: [
      "images/lutins-transports-1.jpg",
      "images/lutins-transports-2.jpg",
      "images/lutins-transports-3.jpg"
    ],
    description: "Des mises en scène amusantes où les lutins débarquent en train, fusée, voiture, bateau ou montgolfière pour surprendre les enfants au réveil.",
    descriptionDetaillee: "Fini la panne d'inspiration le matin : ce kit propose des idées rapides et malicieuses où les lutins arrivent ou se déplacent avec différents moyens de transport (petit train, fusée en carton, voiture miniature, bateau ou montgolfière) pour déclencher de grands éclats de rire au réveil.",
    carteCollection: {
      univers: "Magie de Noël",
      age: "3–8 ans",
      duree: "Mises en scène rapides le matin",
      joueurs: "En famille"
    }
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUITS };
}