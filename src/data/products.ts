import { SneakerProduct } from '../types';

export const INITIAL_PRODUCTS: SneakerProduct[] = [
  {
    id: "prod-zoom-alpha",
    name: "Air Zoom Alphafly Next% V3",
    brand: "Nike",
    category: "Running",
    price: 285.00,
    discountPrice: 259.99,
    rating: 4.8,
    reviewsCount: 142,
    description: "Built for elite runners aiming to crush world records, the Nike Air Zoom Alphafly Next% V3 represents the pinnacle of marathon racing performance. Featuring dual Zoom Air pods under the forefoot, massive ZoomX foam stacking for ultimate energy return, and an optimized full-length carbon-fiber flyplate. Every stride is loaded with responsive rebound, pushing your performance boundaries.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80", // Volt Green
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80", // Premium Sport Alternate
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"  // Radiant Crimson
    ],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    colors: [
      { name: "Volt Green", hex: "#82EF2D", imageIndex: 0 },
      { name: "Arctic White/Sky", hex: "#E2EAF8", imageIndex: 1 },
      { name: "Radiant Crimson", hex: "#EF233C", imageIndex: 2 }
    ],
    stock: 14,
    specs: [
      { label: "Pronation Support", value: "Neutral" },
      { label: "Heel-to-Toe Drop", value: "8 mm" },
      { label: "Midsole Technology", value: "Full-length ZoomX & Carbon-Fiber Flyplate" },
      { label: "Outsole Material", value: "High-abrasion racing rubber" },
      { label: "Upper Knit", value: "AtomKnit 2.0 ultra-breathable mesh" }
    ],
    reviews: [
      {
        id: "rev-1",
        username: "MarathonMac",
        rating: 5,
        date: "2026-05-18",
        title: "Absolute game changer!",
        comment: "Crushed my personal record by 6 minutes using these. The energy bounce is unreal. It feels like you have springs on your feet.",
        verified: true
      },
      {
        id: "rev-2",
        username: "RunnerBecca",
        rating: 4,
        date: "2026-06-01",
        title: "Fast, but snug fit",
        comment: "Extremely fast shoes. The upper is very snug, so I had to size up by half a size. Excellent breathability though.",
        verified: true
      }
    ],
    isHot: true,
    designerNote: "Engineered specifically to maximize propulsion in modern athletic races, eliminating dead weight while retaining optimal support in critical turns."
  },
  {
    id: "prod-jordan-4",
    name: "Air Jordan 4 Retro 'Obsidian Dust'",
    brand: "Nike",
    category: "Basketball",
    price: 210.00,
    rating: 4.9,
    reviewsCount: 328,
    description: "The timeless Air Jordan IV returns in a luxurious 'Obsidian Dust' colorway, combining buttery nubuck leather panels with breathable mesh side windows. This premium edition showcases immaculate classic elements: retro triangular support wings, comfortable encapsulated Air heel units, and a signature stitched tongue emblem. A certified essential for court dominance and lifestyle fashion alike.",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80", // Obsidian Grey
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80", // Court White alternate
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"  // Leather detail
    ],
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    colors: [
      { name: "Obsidian Grey", hex: "#2B3C52", imageIndex: 0 },
      { name: "Court White", hex: "#F3F4F6", imageIndex: 1 },
      { name: "Oreo Speckle", hex: "#1F2937", imageIndex: 2 }
    ],
    stock: 8,
    specs: [
      { label: "Ankle Protection", value: "Mid-Top Classic" },
      { label: "Upper Material", value: "Full-Grain Nubuck Leather & TPU Mesh" },
      { label: "Cushioning", value: "Visible Heel Nike Air / Encapsulated Forefoot Air" },
      { label: "Outsole Grip", value: "Herringbone pivot tread" },
      { label: "Lacing Wings", value: "Signature TPU structural support straps" }
    ],
    reviews: [
      {
        id: "rev-3",
        username: "SneakerHead94",
        rating: 5,
        date: "2026-05-25",
        title: "Perfection in detail",
        comment: "Quality of leather on this is premium. Colors look even better in person. Fits true to size.",
        verified: true
      },
      {
        id: "rev-4",
        username: "EliteHooper",
        rating: 4,
        date: "2026-06-03",
        title: "Great court grip, slightly heavy",
        comment: "Excellent lateral support and ankle lock. Incredible aesthetic on-court. Slightly heavier than modern performance mesh, but comfortable.",
        verified: true
      }
    ],
    isHot: true,
    designerNote: "Restoring the precise material thickness guidelines that made the 1989 Tinker Hatfield model iconic."
  },
  {
    id: "prod-ultraboost",
    name: "UltraBoost Light 26",
    brand: "Adidas",
    category: "Running",
    price: 190.00,
    discountPrice: 159.99,
    rating: 4.7,
    reviewsCount: 215,
    description: "Shatter limits with the lightest UltraBoost ever built. Engineered using groundbreaking Light BOOST particle technology, the midsole achieves incredible cushion rebound while shaving 30% off standard weight. The custom Adidas Primeknit+ upper cocoons your foot with seamless adaptive compression, and the reinforced Linear Energy Push system ensures fluid toe-offs.",
    images: [
      "https://images.unsplash.com/photo-1616279969096-54b228f5f103?w=800&auto=format&fit=crop&q=80", // Cloud White
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80", // Cyber Black
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80"  // Solar Red
    ],
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    colors: [
      { name: "Cloud White", hex: "#FAF8F5", imageIndex: 0 },
      { name: "Cyber Black", hex: "#111827", imageIndex: 1 },
      { name: "Solar Red", hex: "#FF4D19", imageIndex: 2 }
    ],
    stock: 22,
    specs: [
      { label: "Midsole", value: "Light BOOST 30% lighter compound" },
      { label: "Upper Type", value: "Primeknit+ made with 50% Parley Ocean Plastic" },
      { label: "Outsole", value: "Continental™ Better Rubber traction" },
      { label: "Eco-Friendly", value: "Yes - Recycled Ocean Materials" },
      { label: "Support Style", value: "Dynamic TPU Heel Counter" }
    ],
    reviews: [
      {
        id: "rev-5",
        username: "UltraComfort",
        rating: 5,
        date: "2026-05-19",
        title: "Walking on modern clouds",
        comment: "I wear this for both gym training and daily errands. Simply unmatched comfort. It wraps the foot like a bespoke sock.",
        verified: true
      }
    ],
    designerNote: "Targeting daily runners who seek zero-distraction foot comfort combined with environmental responsibility."
  },
  {
    id: "prod-nb990",
    name: "New Balance 990v6 Grey-Orange",
    brand: "New Balance",
    category: "Lifestyle",
    price: 220.00,
    rating: 4.9,
    reviewsCount: 189,
    description: "Continuing the legacy of peak craft, the New Balance Made in USA 990v6 updates the iconic silhouette with absolute performance. FuelCell foam merges into the classic ENCAP midsole, providing lightweight rebound, stability, and sleek comfort. Designed with premium pigskin overlays, textured synthetic panels, and mesh, this classic is the gold standard of daily lifestyle sneakers.",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80", // Ochre & Grey
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80", // Pink/Blue
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"  // Retro Orange Accent
    ],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    colors: [
      { name: "Ochre & Grey", hex: "#CD7F32", imageIndex: 0 },
      { name: "Retro Pink Mix", hex: "#F3A9C8", imageIndex: 1 },
      { name: "Sunset Orange", hex: "#FF5E36", imageIndex: 2 }
    ],
    stock: 5,
    specs: [
      { label: "Manufacture Origin", value: "Made in the USA Premium Series" },
      { label: "Midsole cushion", value: "ENCAP & FuelCell shock absorbing foam" },
      { label: "Material Trim", value: "Suede Pigskin, Synthetic mesh panels" },
      { label: "Reflective Accents", value: "3M reflective side logo and heel tabs" }
    ],
    reviews: [
      {
        id: "rev-6",
        username: "BostonShoes",
        rating: 5,
        date: "2026-06-08",
        title: "Worth every single cent!",
        comment: "This is my third pair of 990 range. The v6 feels even softer because of the FuelCell core. Perfect dad-shoe elegance.",
        verified: true
      }
    ],
    isHot: true
  },
  {
    id: "prod-puma-rsx",
    name: "RS-X Efekt Retro Futurism",
    brand: "Puma",
    category: "Lifestyle",
    price: 120.00,
    discountPrice: 99.95,
    rating: 4.6,
    reviewsCount: 94,
    description: "The Puma RS-X returns with a vengeance. Featuring a bold retro-futurist design language, the RS-X Efekt utilizes bulky layers, mesh foundation, leather trims, and striking synthetic accents. Built with Puma's classic Running System cushioning tech, you get modern impact absorption paired with an extreme style statement.",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80", // Cyber Pastel
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80", // Stealth Shadow
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80"  // Minimal Pearl
    ],
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    colors: [
      { name: "Cyber Pastel", hex: "#E9D5FF", imageIndex: 0 },
      { name: "Stealth Shadow", hex: "#374151", imageIndex: 1 },
      { name: "Minimal Pearl", hex: "#EBE6DD", imageIndex: 2 }
    ],
    stock: 19,
    specs: [
      { label: "Cushioning Tech", value: "Puma Classic RS (Running System)" },
      { label: "Outsole Wrap", value: "Chunky textured rubber grip" },
      { label: "Heel Pull Tab", value: "Dual pull loops for seamless wear" },
      { label: "Aesthetic Era", value: "90s bulky runner inspired revival" }
    ],
    reviews: [
      {
        id: "rev-7",
        username: "RetroKicks",
        rating: 5,
        date: "2026-05-14",
        title: "Striking street aesthetic",
        comment: "People comment on these constantly! Very chunky and stylish. Shock absorption is surprisingly decent too.",
        verified: true
      }
    ]
  },
  {
    id: "prod-asics-nimbus",
    name: "Gel-Nimbus 26 Pro",
    brand: "Asics",
    category: "Running",
    price: 160.00,
    rating: 4.8,
    reviewsCount: 168,
    description: "Step into unparalleled running comfort. The premium Gel-Nimbus 26 introduces the updated PureGEL cushioning system to generate softer transitions and superior shock absorption. Layered with double-action FF Blast+ Eco cushioning, this shoe offers feather-light stride transitions and promotes continuous propulsion on long marathon routes.",
    images: [
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80", // Neon Sunset
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80", // Aurora Green
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"  // Cyber Grey
    ],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    colors: [
      { name: "Neon Sunset", hex: "#FF6200", imageIndex: 0 },
      { name: "Aurora Green", hex: "#39FF14", imageIndex: 1 },
      { name: "Cyber Grey", hex: "#7C8E9B", imageIndex: 2 }
    ],
    stock: 12,
    specs: [
      { label: "Cushioning", value: "Rearfoot PureGEL & Forefoot FF Blast Plus Eco" },
      { label: "Insole Type", value: "Ortholite™ X-55 premium comfort" },
      { label: "Outsole Tech", value: "ASICSGRIP & AHARPLUS high-durability rubber" },
      { label: "Breathability", value: "Engineered warp stretch knit mesh" }
    ],
    reviews: [
      {
        id: "rev-8",
        username: "JogLife30",
        rating: 5,
        date: "2026-06-04",
        title: "Best running shoe ever made",
        comment: "Excellent impact reduction. My knees no longer ache after long highway jogs. Incredible heel-to-toe rollover.",
        verified: true
      }
    ]
  },
  {
    id: "prod-reebok-club",
    name: "Club C Vintage Classic",
    brand: "Reebok",
    category: "Tennis",
    price: 90.00,
    rating: 4.7,
    reviewsCount: 457,
    description: "A tennis original born in 1985, the Reebok Club C Vintage defines effortless retro styling. Sculpted with butter-soft high-grade garment leather and vintage canvas interior lining. Its cushioned EVA midsole delivers light shock absorption while the timeless gum sole provides vintage vibes and reliable everyday traction.",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80", // Vintage Chalk
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80", // Cream Suede Detail
      "https://images.unsplash.com/photo-1616279969096-54b228f5f103?w=800&auto=format&fit=crop&q=80"  // Soft White
    ],
    sizes: [6, 7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    colors: [
      { name: "Vintage Chalk", hex: "#EFEDE6", imageIndex: 0 },
      { name: "Cream Suede", hex: "#DFDED6", imageIndex: 1 },
      { name: "Soft White", hex: "#FFFFFF", imageIndex: 2 }
    ],
    stock: 30,
    specs: [
      { label: "Upper", value: "Garment Leather with stitch reinforcement" },
      { label: "Midsole", value: "Encapsulated comfort EVA cushion shell" },
      { label: "Aesthetic Accent", value: "Classic union jack side window patch" },
      { label: "Outsole", value: "Non-marking retro tennis cupsole" }
    ],
    reviews: [
      {
        id: "rev-9",
        username: "VintageVibes",
        rating: 5,
        date: "2026-05-30",
        title: "Matches everything imaginable!",
        comment: "Simplest, cleanest shoe model in my wardrobe. Soft leather breaks in wonderfully within a single day. Buying another pair.",
        verified: true
      }
    ]
  }
];
