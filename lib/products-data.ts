export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  badge?: string
  popularity: number
  isNew: boolean
  description?: string
  stock?: number
  specifications?: { label: string; value: string }[]
  images?: string[]
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Casque Audio Sans Fil Premium",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviews: 234,
    image: "/wireless-headphones.png",
    category: "Électronique",
    badge: "Promo",
    popularity: 95,
    isNew: false,
    description:
      "Découvrez une expérience audio exceptionnelle avec notre casque sans fil premium. Doté de la technologie de réduction de bruit active, il vous plonge dans votre musique sans distraction. Avec une autonomie de 30 heures et un confort optimal, c'est le compagnon idéal pour vos déplacements quotidiens.",
    stock: 45,
    specifications: [
      { label: "Type", value: "Circum-auriculaire" },
      { label: "Connectivité", value: "Bluetooth 5.0" },
      { label: "Autonomie", value: "30 heures" },
      { label: "Réduction de bruit", value: "Active (ANC)" },
      { label: "Poids", value: "250g" },
    ],
    images: ["/wireless-headphones.png", "/wireless-headphones-2.jpg", "/wireless-headphones-3.jpg"],
  },
  {
    id: 2,
    name: "Montre Connectée Sport",
    price: 299.99,
    rating: 4.8,
    reviews: 567,
    image: "/smartwatch-fitness.png",
    category: "Électronique",
    badge: "Nouveau",
    popularity: 98,
    isNew: true,
    description:
      "Suivez vos performances sportives avec précision grâce à cette montre connectée de dernière génération. GPS intégré, capteur de fréquence cardiaque, suivi du sommeil et plus de 100 modes sportifs pour vous accompagner dans tous vos défis.",
    stock: 32,
    specifications: [
      { label: "Écran", value: "AMOLED 1.4 pouces" },
      { label: "GPS", value: "Intégré" },
      { label: "Étanchéité", value: "5 ATM" },
      { label: "Autonomie", value: "14 jours" },
      { label: "Capteurs", value: "Cardio, SpO2, Accéléromètre" },
    ],
    images: ["/smartwatch-fitness.png", "/smartwatch-fitness-2.jpg", "/smartwatch-fitness-3.jpg"],
  },
  {
    id: 3,
    name: "Sac à Dos Urbain Design",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.3,
    reviews: 123,
    image: "/urban-backpack.png",
    category: "Mode",
    badge: "Promo",
    popularity: 85,
    isNew: false,
    description:
      "Un sac à dos élégant et fonctionnel pour la ville. Compartiment rembourré pour ordinateur portable 15 pouces, poches organisées, tissu résistant à l'eau et design minimaliste. Parfait pour le travail ou les études.",
    stock: 67,
    specifications: [
      { label: "Capacité", value: "25 litres" },
      { label: "Matériau", value: "Polyester résistant à l'eau" },
      { label: "Compartiment PC", value: "Jusqu'à 15 pouces" },
      { label: "Dimensions", value: "45 x 30 x 15 cm" },
      { label: "Poids", value: "800g" },
    ],
    images: ["/urban-backpack.png", "/urban-backpack-2.jpg", "/urban-backpack-3.jpg"],
  },
  {
    id: 4,
    name: "Lampe LED Intelligente",
    price: 49.99,
    rating: 4.6,
    reviews: 345,
    image: "/smart-led-lamp.jpg",
    category: "Maison",
    badge: "Populaire",
    popularity: 92,
    isNew: false,
    description:
      "Créez l'ambiance parfaite avec cette lampe LED intelligente. Contrôlez la luminosité et la température de couleur depuis votre smartphone. Compatible avec les assistants vocaux pour un contrôle mains libres.",
    stock: 89,
    specifications: [
      { label: "Puissance", value: "12W" },
      { label: "Luminosité", value: "800 lumens" },
      { label: "Température", value: "2700K - 6500K" },
      { label: "Connectivité", value: "WiFi 2.4GHz" },
      { label: "Compatibilité", value: "Alexa, Google Home" },
    ],
    images: ["/smart-led-lamp.jpg", "/smart-led-lamp-2.jpg", "/smart-led-lamp-3.jpg"],
  },
  {
    id: 5,
    name: "Chaussures de Running Pro",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviews: 456,
    image: "/running-shoes.jpg",
    category: "Sport",
    badge: "Promo",
    popularity: 90,
    isNew: false,
    description:
      "Des chaussures de running haute performance conçues pour les coureurs exigeants. Amorti réactif, semelle adhérente et tige respirante pour un confort optimal sur toutes les distances.",
    stock: 54,
    specifications: [
      { label: "Type", value: "Running route" },
      { label: "Drop", value: "8mm" },
      { label: "Poids", value: "280g (taille 42)" },
      { label: "Amorti", value: "Mousse EVA haute densité" },
      { label: "Semelle", value: "Caoutchouc Continental" },
    ],
    images: ["/running-shoes.jpg", "/running-shoes-2.jpg", "/running-shoes-3.jpg"],
  },
  {
    id: 6,
    name: "Cafetière Automatique",
    price: 189.99,
    rating: 4.4,
    reviews: 189,
    image: "/automatic-coffee-maker.jpg",
    category: "Maison",
    badge: "Nouveau",
    popularity: 78,
    isNew: true,
    description:
      "Préparez un café d'exception à la maison avec cette cafetière automatique. Broyeur intégré, réglages personnalisables et système de chauffe rapide pour un café parfait à chaque tasse.",
    stock: 23,
    specifications: [
      { label: "Capacité", value: "1.8 litres" },
      { label: "Broyeur", value: "Céramique conique" },
      { label: "Pression", value: "15 bars" },
      { label: "Programmes", value: "8 boissons" },
      { label: "Puissance", value: "1450W" },
    ],
    images: ["/automatic-coffee-maker.jpg", "/automatic-coffee-maker-2.jpg", "/automatic-coffee-maker-3.jpg"],
  },
  {
    id: 7,
    name: "Tablette Graphique Professionnelle",
    price: 249.99,
    rating: 4.9,
    reviews: 678,
    image: "/drawing-tablet.jpg",
    category: "Électronique",
    badge: "Populaire",
    popularity: 99,
    isNew: false,
    description:
      "Libérez votre créativité avec cette tablette graphique professionnelle. Stylet sans batterie avec 8192 niveaux de pression, surface de travail généreuse et compatibilité avec tous les logiciels de création.",
    stock: 18,
    specifications: [
      { label: "Zone active", value: "10 x 6.25 pouces" },
      { label: "Niveaux de pression", value: "8192" },
      { label: "Résolution", value: "5080 LPI" },
      { label: "Connectivité", value: "USB-C" },
      { label: "Compatibilité", value: "Windows, macOS, Linux" },
    ],
    images: ["/drawing-tablet.jpg", "/drawing-tablet-2.jpg", "/drawing-tablet-3.jpg"],
  },
  {
    id: 8,
    name: "Enceinte Bluetooth Portable",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.5,
    reviews: 234,
    image: "/bluetooth-speaker.jpg",
    category: "Électronique",
    badge: "Promo",
    popularity: 88,
    isNew: false,
    description:
      "Emportez votre musique partout avec cette enceinte Bluetooth portable. Son puissant à 360°, résistance à l'eau IPX7 et autonomie de 24 heures pour vos aventures en extérieur.",
    stock: 76,
    specifications: [
      { label: "Puissance", value: "20W" },
      { label: "Autonomie", value: "24 heures" },
      { label: "Étanchéité", value: "IPX7" },
      { label: "Bluetooth", value: "5.0" },
      { label: "Portée", value: "30 mètres" },
    ],
    images: ["/bluetooth-speaker.jpg", "/bluetooth-speaker-2.jpg", "/bluetooth-speaker-3.jpg"],
  },
  {
    id: 9,
    name: "Vélo Électrique Urbain",
    price: 1299.99,
    rating: 4.8,
    reviews: 145,
    image: "/electric-bike.jpg",
    category: "Sport",
    popularity: 87,
    isNew: true,
    description:
      "Révolutionnez vos déplacements urbains avec ce vélo électrique élégant et performant. Moteur puissant, batterie longue durée et design moderne pour une mobilité écologique et confortable.",
    stock: 12,
    specifications: [
      { label: "Moteur", value: "250W brushless" },
      { label: "Batterie", value: "36V 10Ah" },
      { label: "Autonomie", value: "60 km" },
      { label: "Vitesse max", value: "25 km/h" },
      { label: "Poids", value: "22 kg" },
    ],
    images: ["/electric-bike.jpg", "/electric-bike-2.jpg", "/electric-bike-3.jpg"],
  },
  {
    id: 10,
    name: "Appareil Photo Mirrorless",
    price: 899.99,
    originalPrice: 1099.99,
    rating: 4.9,
    reviews: 423,
    image: "/mirrorless-camera.jpg",
    category: "Électronique",
    badge: "Promo",
    popularity: 96,
    isNew: false,
    description:
      "Capturez des images exceptionnelles avec cet appareil photo mirrorless professionnel. Capteur plein format, autofocus ultra-rapide et vidéo 4K pour des résultats époustouflants.",
    stock: 8,
    specifications: [
      { label: "Capteur", value: "Full Frame 24MP" },
      { label: "Autofocus", value: "693 points" },
      { label: "Vidéo", value: "4K 60fps" },
      { label: "ISO", value: "100-51200" },
      { label: "Rafale", value: "10 fps" },
    ],
    images: ["/mirrorless-camera.jpg", "/mirrorless-camera-2.jpg", "/mirrorless-camera-3.jpg"],
  },
  {
    id: 11,
    name: "Canapé Scandinave 3 Places",
    price: 599.99,
    rating: 4.6,
    reviews: 234,
    image: "/scandinavian-sofa.jpg",
    category: "Maison",
    popularity: 82,
    isNew: false,
    description:
      "Apportez une touche d'élégance nordique à votre salon avec ce canapé scandinave. Design épuré, assise confortable et tissu de qualité pour un confort optimal au quotidien.",
    stock: 15,
    specifications: [
      { label: "Places", value: "3 personnes" },
      { label: "Dimensions", value: "200 x 85 x 80 cm" },
      { label: "Tissu", value: "Lin mélangé" },
      { label: "Structure", value: "Bois massif" },
      { label: "Couleur", value: "Gris clair" },
    ],
    images: ["/scandinavian-sofa.jpg", "/scandinavian-sofa-2.jpg", "/scandinavian-sofa-3.jpg"],
  },
  {
    id: 12,
    name: "Machine à Espresso Professionnelle",
    price: 449.99,
    rating: 4.7,
    reviews: 312,
    image: "/espresso-machine.jpg",
    category: "Maison",
    popularity: 89,
    isNew: true,
    description:
      "Préparez des espressos dignes d'un barista professionnel. Pompe haute pression, buse vapeur pour cappuccinos et système de chauffe thermoblock pour une température parfaite.",
    stock: 19,
    specifications: [
      { label: "Pression", value: "19 bars" },
      { label: "Chauffe", value: "Thermoblock" },
      { label: "Réservoir", value: "2 litres" },
      { label: "Buse vapeur", value: "Professionnelle" },
      { label: "Puissance", value: "1350W" },
    ],
    images: ["/espresso-machine.jpg", "/espresso-machine-2.jpg", "/espresso-machine-3.jpg"],
  },
  {
    id: 13,
    name: "Drone avec Caméra 4K",
    price: 699.99,
    originalPrice: 899.99,
    rating: 4.5,
    reviews: 267,
    image: "/drone-4k.jpg",
    category: "Électronique",
    badge: "Promo",
    popularity: 91,
    isNew: false,
    description:
      "Explorez le monde vu du ciel avec ce drone équipé d'une caméra 4K stabilisée. GPS, retour automatique et modes de vol intelligents pour des prises de vue aériennes spectaculaires.",
    stock: 25,
    specifications: [
      { label: "Caméra", value: "4K 30fps" },
      { label: "Stabilisation", value: "Gimbal 3 axes" },
      { label: "Autonomie", value: "30 minutes" },
      { label: "Portée", value: "4 km" },
      { label: "GPS", value: "Intégré" },
    ],
    images: ["/drone-4k.jpg", "/drone-4k-2.jpg", "/drone-4k-3.jpg"],
  },
  {
    id: 14,
    name: "Tapis de Yoga Premium",
    price: 39.99,
    rating: 4.4,
    reviews: 567,
    image: "/yoga-mat.jpg",
    category: "Sport",
    popularity: 75,
    isNew: false,
    description:
      "Pratiquez le yoga dans les meilleures conditions avec ce tapis premium. Matériau écologique, adhérence optimale et épaisseur confortable pour protéger vos articulations.",
    stock: 143,
    specifications: [
      { label: "Dimensions", value: "183 x 61 cm" },
      { label: "Épaisseur", value: "6 mm" },
      { label: "Matériau", value: "TPE écologique" },
      { label: "Adhérence", value: "Double face" },
      { label: "Poids", value: "1.2 kg" },
    ],
    images: ["/yoga-mat.jpg", "/yoga-mat-2.jpg", "/yoga-mat-3.jpg"],
  },
  {
    id: 15,
    name: "Lunettes de Soleil Polarisées",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.6,
    reviews: 189,
    image: "/polarized-sunglasses.jpg",
    category: "Mode",
    badge: "Promo",
    popularity: 84,
    isNew: false,
    description:
      "Protégez vos yeux avec style grâce à ces lunettes de soleil polarisées. Verres anti-reflets, monture légère et design intemporel pour un confort optimal toute la journée.",
    stock: 98,
    specifications: [
      { label: "Protection", value: "UV400" },
      { label: "Verres", value: "Polarisés" },
      { label: "Monture", value: "Acétate" },
      { label: "Style", value: "Aviateur" },
      { label: "Poids", value: "28g" },
    ],
    images: ["/polarized-sunglasses.jpg", "/polarized-sunglasses-2.jpg", "/polarized-sunglasses-3.jpg"],
  },
  {
    id: 16,
    name: "Robot Aspirateur Intelligent",
    price: 349.99,
    rating: 4.7,
    reviews: 445,
    image: "/robot-vacuum.jpg",
    category: "Maison",
    popularity: 93,
    isNew: true,
    description:
      "Gardez votre maison impeccable sans effort avec ce robot aspirateur intelligent. Navigation laser, aspiration puissante et contrôle via application pour un nettoyage automatisé.",
    stock: 31,
    specifications: [
      { label: "Navigation", value: "Laser LDS" },
      { label: "Aspiration", value: "2700 Pa" },
      { label: "Autonomie", value: "120 minutes" },
      { label: "Réservoir", value: "600 ml" },
      { label: "Connectivité", value: "WiFi + App" },
    ],
    images: ["/robot-vacuum.jpg", "/robot-vacuum-2.jpg", "/robot-vacuum-3.jpg"],
  },
  {
    id: 17,
    name: "Clavier Mécanique RGB",
    price: 129.99,
    rating: 4.8,
    reviews: 678,
    image: "/mechanical-keyboard.jpg",
    category: "Électronique",
    popularity: 94,
    isNew: false,
    description:
      "Améliorez votre expérience de frappe avec ce clavier mécanique RGB. Switchs tactiles, rétroéclairage personnalisable et construction robuste pour les gamers et professionnels.",
    stock: 62,
    specifications: [
      { label: "Switchs", value: "Mécaniques tactiles" },
      { label: "Rétroéclairage", value: "RGB par touche" },
      { label: "Connexion", value: "USB-C détachable" },
      { label: "Format", value: "TKL (87 touches)" },
      { label: "Matériau", value: "Aluminium" },
    ],
    images: ["/mechanical-keyboard.jpg", "/mechanical-keyboard-2.jpg", "/mechanical-keyboard-3.jpg"],
  },
  {
    id: 18,
    name: "Veste Imperméable Outdoor",
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviews: 234,
    image: "/waterproof-jacket.jpg",
    category: "Mode",
    badge: "Promo",
    popularity: 81,
    isNew: false,
    description:
      "Affrontez les éléments avec cette veste imperméable technique. Membrane respirante, coutures étanches et capuche ajustable pour rester au sec dans toutes les conditions.",
    stock: 47,
    specifications: [
      { label: "Imperméabilité", value: "20000 mm" },
      { label: "Respirabilité", value: "15000 g/m²/24h" },
      { label: "Membrane", value: "3 couches" },
      { label: "Capuche", value: "Ajustable" },
      { label: "Poches", value: "4 zippées" },
    ],
    images: ["/waterproof-jacket.jpg", "/waterproof-jacket-2.jpg", "/waterproof-jacket-3.jpg"],
  },
  {
    id: 19,
    name: "Mixeur Blender Haute Performance",
    price: 119.99,
    rating: 4.6,
    reviews: 356,
    image: "/high-performance-blender.jpg",
    category: "Maison",
    popularity: 79,
    isNew: false,
    description:
      "Préparez smoothies, soupes et sauces en un instant avec ce blender haute performance. Moteur puissant, lames en acier inoxydable et bol en verre pour des résultats parfaits.",
    stock: 55,
    specifications: [
      { label: "Puissance", value: "1200W" },
      { label: "Capacité", value: "1.5 litres" },
      { label: "Vitesses", value: "10 + Pulse" },
      { label: "Lames", value: "6 en acier inox" },
      { label: "Matériau", value: "Verre borosilicate" },
    ],
    images: ["/high-performance-blender.jpg", "/high-performance-blender-2.jpg", "/high-performance-blender-3.jpg"],
  },
  {
    id: 20,
    name: "Ballon de Basketball Pro",
    price: 49.99,
    rating: 4.7,
    reviews: 423,
    image: "/basketball-pro.jpg",
    category: "Sport",
    popularity: 86,
    isNew: false,
    description:
      "Jouez comme un pro avec ce ballon de basketball officiel. Revêtement composite, adhérence optimale et durabilité exceptionnelle pour l'intérieur et l'extérieur.",
    stock: 127,
    specifications: [
      { label: "Taille", value: "7 (officielle)" },
      { label: "Matériau", value: "Composite" },
      { label: "Usage", value: "Intérieur/Extérieur" },
      { label: "Poids", value: "600g" },
      { label: "Circonférence", value: "75 cm" },
    ],
    images: ["/basketball-pro.jpg", "/basketball-pro-2.jpg", "/basketball-pro-3.jpg"],
  },
  {
    id: 21,
    name: "Écouteurs True Wireless",
    price: 99.99,
    originalPrice: 149.99,
    rating: 4.4,
    reviews: 512,
    image: "/true-wireless-earbuds.jpg",
    category: "Électronique",
    badge: "Promo",
    popularity: 88,
    isNew: false,
    description:
      "Profitez d'une liberté totale avec ces écouteurs true wireless. Réduction de bruit active, son haute fidélité et boîtier de charge pour 24 heures d'autonomie.",
    stock: 83,
    specifications: [
      { label: "Autonomie", value: "6h + 18h (boîtier)" },
      { label: "ANC", value: "Réduction de bruit active" },
      { label: "Bluetooth", value: "5.2" },
      { label: "Résistance", value: "IPX4" },
      { label: "Charge", value: "USB-C + Sans fil" },
    ],
    images: ["/true-wireless-earbuds.jpg", "/true-wireless-earbuds-2.jpg", "/true-wireless-earbuds-3.jpg"],
  },
  {
    id: 22,
    name: "Sac de Voyage Grande Capacité",
    price: 129.99,
    rating: 4.5,
    reviews: 198,
    image: "/travel-bag.jpg",
    category: "Mode",
    popularity: 77,
    isNew: true,
    description:
      "Partez en voyage avec ce sac spacieux et pratique. Compartiments multiples, roulettes robustes et matériau résistant pour accompagner toutes vos aventures.",
    stock: 38,
    specifications: [
      { label: "Capacité", value: "60 litres" },
      { label: "Dimensions", value: "65 x 40 x 25 cm" },
      { label: "Poids", value: "3.2 kg" },
      { label: "Roulettes", value: "4 multidirectionnelles" },
      { label: "Matériau", value: "Polyester renforcé" },
    ],
    images: ["/travel-bag.jpg", "/travel-bag-2.jpg", "/travel-bag-3.jpg"],
  },
  {
    id: 23,
    name: "Purificateur d'Air HEPA",
    price: 199.99,
    rating: 4.8,
    reviews: 289,
    image: "/air-purifier.jpg",
    category: "Maison",
    popularity: 90,
    isNew: true,
    description:
      "Respirez un air pur avec ce purificateur équipé d'un filtre HEPA. Élimine 99.97% des particules, mode silencieux et capteurs intelligents pour une qualité d'air optimale.",
    stock: 41,
    specifications: [
      { label: "Filtration", value: "HEPA H13" },
      { label: "Surface", value: "Jusqu'à 50 m²" },
      { label: "CADR", value: "300 m³/h" },
      { label: "Niveau sonore", value: "22-52 dB" },
      { label: "Capteurs", value: "PM2.5, Odeurs" },
    ],
    images: ["/air-purifier.jpg", "/air-purifier-2.jpg", "/air-purifier-3.jpg"],
  },
  {
    id: 24,
    name: "Gants de Boxe Professionnels",
    price: 79.99,
    rating: 4.6,
    reviews: 167,
    image: "/boxing-gloves.jpg",
    category: "Sport",
    popularity: 73,
    isNew: false,
    description:
      "Entraînez-vous comme un champion avec ces gants de boxe professionnels. Rembourrage multi-couches, cuir synthétique de qualité et fermeture velcro sécurisée.",
    stock: 94,
    specifications: [
      { label: "Poids", value: "12 oz" },
      { label: "Matériau", value: "Cuir synthétique" },
      { label: "Rembourrage", value: "Mousse multi-couches" },
      { label: "Fermeture", value: "Velcro" },
      { label: "Usage", value: "Entraînement/Sparring" },
    ],
    images: ["/boxing-gloves.jpg", "/boxing-gloves-2.jpg", "/boxing-gloves-3.jpg"],
  },
]

export const categories = ["Tous", "Électronique", "Mode", "Maison", "Sport"]

export function getProductById(id: number): Product | undefined {
  return allProducts.find((product) => product.id === id)
}

export function getSimilarProducts(productId: number, category: string, limit = 4): Product[] {
  return allProducts
    .filter((product) => product.id !== productId && product.category === category)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

export interface Review {
  id: number
  author: string
  rating: number
  date: string
  comment: string
  verified: boolean
}

export function getProductReviews(productId: number): Review[] {
  // Mock reviews - in a real app, this would come from a database
  return [
    {
      id: 1,
      author: "Marie L.",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Excellent produit ! Exactement ce que je cherchais. La qualité est au rendez-vous et la livraison a été rapide.",
      verified: true,
    },
    {
      id: 2,
      author: "Thomas B.",
      rating: 4,
      date: "2024-01-10",
      comment:
        "Très bon rapport qualité-prix. Quelques petits détails à améliorer mais globalement très satisfait de mon achat.",
      verified: true,
    },
    {
      id: 3,
      author: "Sophie M.",
      rating: 5,
      date: "2024-01-05",
      comment: "Je recommande vivement ! Le produit correspond parfaitement à la description et dépasse mes attentes.",
      verified: false,
    },
    {
      id: 4,
      author: "Lucas D.",
      rating: 4,
      date: "2023-12-28",
      comment: "Bon produit dans l'ensemble. Livraison rapide et emballage soigné. Je suis content de mon achat.",
      verified: true,
    },
  ]
}
