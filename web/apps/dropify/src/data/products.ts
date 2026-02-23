export interface Product {
  id: string;
  name: string;
  scent: "Floral" | "Woody" | "Citrus" | "Spice" | "Fruity";
  price: number;
  description: string;
  image: string;
  notes: {
    top: string;
    middle: string;
    base: string;
  };
  weight: string;
  burnTime: string;
}

export const products: Product[] = [
  {
    id: "midnight-jasmine",
    name: "Midnight Jasmine",
    scent: "Floral",
    price: 68,
    image: "https://images.unsplash.com/photo-1601922046210-41e129a3e64a?w=600&h=600&fit=crop",
    description:
      "A heady, intoxicating blend that captures the essence of jasmine blooming under moonlight. Rich white florals unfold slowly, revealing a warm, musky depth that lingers long after the flame is extinguished.",
    notes: {
      top: "Night-blooming jasmine, white tea",
      middle: "Tuberose, ylang-ylang",
      base: "White musk, benzoin",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
  {
    id: "cedar-smoke",
    name: "Cedar & Smoke",
    scent: "Woody",
    price: 72,
    image: "https://images.unsplash.com/photo-1634391920492-94ac5fea359a?w=600&h=600&fit=crop",
    description:
      "Inspired by quiet evenings beside a dying fire in a mountain cabin. Smoky cedar mingles with the warmth of aged leather, creating an atmosphere of rugged sophistication and calm introspection.",
    notes: {
      top: "Smoked birch, black pepper",
      middle: "Atlas cedar, leather",
      base: "Vetiver, amber",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
  {
    id: "sicilian-bergamot",
    name: "Sicilian Bergamot",
    scent: "Citrus",
    price: 64,
    image: "https://images.unsplash.com/photo-1757688525739-8d1e13daf44f?w=600&h=600&fit=crop",
    description:
      "Sun-drenched citrus groves along the Sicilian coast, distilled into wax. Bright, effervescent bergamot is tempered by soft green tea and a whisper of white cedar for an uplifting yet refined experience.",
    notes: {
      top: "Bergamot, lemon zest",
      middle: "Green tea, neroli",
      base: "White cedar, musk",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
  {
    id: "santal-noir",
    name: "Santal Noir",
    scent: "Woody",
    price: 78,
    image: "https://images.unsplash.com/photo-1607284235728-e0d256e519f9?w=600&h=600&fit=crop",
    description:
      "Our deepest, most meditative fragrance. Rare Australian sandalwood meets the dark sweetness of Madagascan vanilla, enveloped in a cloud of papyrus and soft incense. A scent for contemplation and stillness.",
    notes: {
      top: "Cardamom, violet leaf",
      middle: "Australian sandalwood, papyrus",
      base: "Vanilla absolute, incense",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
  {
    id: "wild-fig-cassis",
    name: "Wild Fig & Cassis",
    scent: "Fruity",
    price: 66,
    image: "https://images.unsplash.com/photo-1673446302995-29511b6f78de?w=600&h=600&fit=crop",
    description:
      "Ripe Mediterranean figs warmed by the afternoon sun, paired with the tart brilliance of blackcurrant. A lush, verdant fragrance that evokes a hidden garden in the south of France.",
    notes: {
      top: "Blackcurrant, green fig leaf",
      middle: "Ripe fig, coconut milk",
      base: "Cedarwood, tonka bean",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
  {
    id: "tobacco-vanilla",
    name: "Tobacco & Vanilla",
    scent: "Spice",
    price: 74,
    image: "https://images.unsplash.com/photo-1601479604588-68d9e6d386b5?w=600&h=600&fit=crop",
    description:
      "The warmth of a mahogany-lined library in winter. Pipe tobacco and bourbon vanilla intertwine with subtle spice, creating a scent that is at once nostalgic and deeply comforting. Bold, warm, unapologetic.",
    notes: {
      top: "Tobacco leaf, cinnamon bark",
      middle: "Bourbon vanilla, tonka",
      base: "Benzoin, dried fruits, musk",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
  {
    id: "yuzu-hinoki",
    name: "Yuzu & Hinoki",
    scent: "Citrus",
    price: 70,
    image: "https://images.unsplash.com/photo-1640095889747-2090ee12fa7d?w=600&h=600&fit=crop",
    description:
      "A journey to a Japanese forest bathing trail. Bright yuzu citrus opens into the clean, meditative aroma of hinoki cypress, grounded by the earthiness of vetiver and a touch of green shiso leaf.",
    notes: {
      top: "Yuzu, shiso leaf",
      middle: "Hinoki cypress, bamboo",
      base: "Vetiver, white tea",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
  {
    id: "oud-rose",
    name: "Oud & Rose",
    scent: "Floral",
    price: 82,
    image: "https://images.unsplash.com/photo-1676959137657-7e26409c6669?w=600&h=600&fit=crop",
    description:
      "Our most luxurious offering. Precious oud from the heartwood of agarwood trees meets the velvety richness of Damascena rose. An opulent, deeply complex fragrance that evolves beautifully over hours of burn time.",
    notes: {
      top: "Saffron, pink pepper",
      middle: "Damascena rose, geranium",
      base: "Oud, sandalwood, amber",
    },
    weight: "8 oz / 227g",
    burnTime: "50-60 hours",
  },
];
