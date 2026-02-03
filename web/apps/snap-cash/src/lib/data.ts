// Data types for SnapCash

export type Upload = {
  id: string;
  userId: string;
  type: "photo" | "video";
  thumbnail: string;
  category: string;
  tags: string[];
  status: "processing" | "approved" | "rejected";
  quality: "standard" | "high" | "premium";
  earnings: number;
  licenses: number;
  uploadedAt: string;
};

export type Earnings = {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  thisMonth: number;
  lastMonth: number;
  topCategory: string;
  totalUploads: number;
  totalLicenses: number;
};

export type Dataset = {
  id: string;
  name: string;
  description: string;
  category: string;
  sampleImages: string[];
  totalItems: number;
  pricePerItem: number;
  licenseTiers: { name: string; items: number; price: number }[];
  quality: string;
  tags: string[];
};

export type Payout = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed";
  method: string;
  date: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  itemCount: number;
  avgEarning: number;
};

// Categories
export const categories: Category[] = [
  {
    id: "faces",
    name: "Faces",
    icon: "face",
    description: "Portraits, expressions, and facial features for recognition models",
    itemCount: 125000,
    avgEarning: 0.15,
  },
  {
    id: "objects",
    name: "Objects",
    icon: "box",
    description: "Everyday items, products, and physical objects for detection",
    itemCount: 89000,
    avgEarning: 0.08,
  },
  {
    id: "scenes",
    name: "Scenes",
    icon: "image",
    description: "Landscapes, interiors, and environmental contexts",
    itemCount: 67000,
    avgEarning: 0.12,
  },
  {
    id: "actions",
    name: "Actions",
    icon: "activity",
    description: "Human activities, movements, and interactions",
    itemCount: 45000,
    avgEarning: 0.20,
  },
  {
    id: "text",
    name: "Text",
    icon: "type",
    description: "Handwriting, signs, documents, and text in the wild",
    itemCount: 32000,
    avgEarning: 0.10,
  },
  {
    id: "audio",
    name: "Audio",
    icon: "volume-2",
    description: "Voice recordings, ambient sounds, and audio samples",
    itemCount: 28000,
    avgEarning: 0.25,
  },
];

// Mock uploads
export const mockUploads: Upload[] = [
  {
    id: "up1",
    userId: "user_1",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    category: "Faces",
    tags: ["portrait", "natural light", "outdoors"],
    status: "approved",
    quality: "premium",
    earnings: 4.50,
    licenses: 30,
    uploadedAt: "2025-02-01",
  },
  {
    id: "up2",
    userId: "user_1",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    category: "Faces",
    tags: ["portrait", "smile", "professional"],
    status: "approved",
    quality: "high",
    earnings: 2.80,
    licenses: 14,
    uploadedAt: "2025-01-30",
  },
  {
    id: "up3",
    userId: "user_1",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200",
    category: "Objects",
    tags: ["food", "plate", "restaurant"],
    status: "approved",
    quality: "standard",
    earnings: 1.20,
    licenses: 12,
    uploadedAt: "2025-01-28",
  },
  {
    id: "up4",
    userId: "user_1",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200",
    category: "Actions",
    tags: ["running", "fitness", "outdoor"],
    status: "approved",
    quality: "premium",
    earnings: 8.40,
    licenses: 21,
    uploadedAt: "2025-01-25",
  },
  {
    id: "up5",
    userId: "user_1",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
    category: "Scenes",
    tags: ["mountain", "landscape", "nature"],
    status: "approved",
    quality: "high",
    earnings: 3.60,
    licenses: 18,
    uploadedAt: "2025-01-22",
  },
  {
    id: "up6",
    userId: "user_1",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200",
    category: "Text",
    tags: ["handwriting", "notes", "paper"],
    status: "processing",
    quality: "standard",
    earnings: 0,
    licenses: 0,
    uploadedAt: "2025-02-02",
  },
  {
    id: "up7",
    userId: "user_1",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200",
    category: "Objects",
    tags: ["laptop", "technology", "desk"],
    status: "approved",
    quality: "high",
    earnings: 2.10,
    licenses: 7,
    uploadedAt: "2025-01-20",
  },
  {
    id: "up8",
    userId: "user_1",
    type: "photo",
    thumbnail: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200",
    category: "Faces",
    tags: ["dog", "pet", "animal"],
    status: "rejected",
    quality: "standard",
    earnings: 0,
    licenses: 0,
    uploadedAt: "2025-01-18",
  },
];

// Mock earnings data
export const mockEarnings: Earnings = {
  availableBalance: 89.50,
  pendingBalance: 24.30,
  totalEarned: 342.80,
  thisMonth: 68.40,
  lastMonth: 52.20,
  topCategory: "Faces",
  totalUploads: 156,
  totalLicenses: 423,
};

// Mock payouts
export const mockPayouts: Payout[] = [
  {
    id: "p1",
    amount: 75.00,
    status: "completed",
    date: "2025-01-25",
    method: "Bank Account ****4242",
  },
  {
    id: "p2",
    amount: 50.00,
    status: "completed",
    date: "2025-01-10",
    method: "Bank Account ****4242",
  },
  {
    id: "p3",
    amount: 62.30,
    status: "completed",
    date: "2024-12-28",
    method: "PayPal",
  },
];

// Mock datasets (for data buyers)
export const mockDatasets: Dataset[] = [
  {
    id: "ds1",
    name: "Diverse Faces Collection",
    description: "High-quality facial images representing diverse demographics, ages, and expressions. Perfect for training facial recognition and emotion detection models.",
    category: "Faces",
    sampleImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    ],
    totalItems: 50000,
    pricePerItem: 0.02,
    licenseTiers: [
      { name: "Starter", items: 1000, price: 49 },
      { name: "Growth", items: 10000, price: 299 },
      { name: "Enterprise", items: 50000, price: 999 },
    ],
    quality: "High Resolution",
    tags: ["facial recognition", "diverse", "expressions", "demographics"],
  },
  {
    id: "ds2",
    name: "Product Photography Dataset",
    description: "Curated collection of product images across various categories including electronics, fashion, and home goods. Ideal for e-commerce AI applications.",
    category: "Objects",
    sampleImages: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200",
    ],
    totalItems: 35000,
    pricePerItem: 0.015,
    licenseTiers: [
      { name: "Starter", items: 1000, price: 39 },
      { name: "Growth", items: 10000, price: 199 },
      { name: "Enterprise", items: 35000, price: 549 },
    ],
    quality: "Studio Quality",
    tags: ["products", "e-commerce", "retail", "object detection"],
  },
  {
    id: "ds3",
    name: "Human Activities Video Set",
    description: "Video clips capturing everyday human activities including walking, running, cooking, and more. Annotated with action labels and timestamps.",
    category: "Actions",
    sampleImages: [
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200",
      "https://images.unsplash.com/photo-1483721310020-03333e577078?w=200",
    ],
    totalItems: 15000,
    pricePerItem: 0.05,
    licenseTiers: [
      { name: "Starter", items: 500, price: 79 },
      { name: "Growth", items: 5000, price: 399 },
      { name: "Enterprise", items: 15000, price: 749 },
    ],
    quality: "HD Video",
    tags: ["activities", "motion", "video", "action recognition"],
  },
  {
    id: "ds4",
    name: "Global Landscapes Collection",
    description: "Stunning landscape and scene images from around the world. Includes urban, rural, natural, and indoor environments with location metadata.",
    category: "Scenes",
    sampleImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200",
    ],
    totalItems: 42000,
    pricePerItem: 0.018,
    licenseTiers: [
      { name: "Starter", items: 1000, price: 45 },
      { name: "Growth", items: 10000, price: 249 },
      { name: "Enterprise", items: 42000, price: 699 },
    ],
    quality: "4K Resolution",
    tags: ["landscapes", "scenes", "locations", "environments"],
  },
  {
    id: "ds5",
    name: "Handwritten Text Collection",
    description: "Diverse handwriting samples including notes, signatures, and documents. Multiple languages and writing styles represented.",
    category: "Text",
    sampleImages: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200",
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200",
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=200",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200",
    ],
    totalItems: 28000,
    pricePerItem: 0.012,
    licenseTiers: [
      { name: "Starter", items: 1000, price: 35 },
      { name: "Growth", items: 10000, price: 159 },
      { name: "Enterprise", items: 28000, price: 349 },
    ],
    quality: "High Resolution Scans",
    tags: ["handwriting", "OCR", "text recognition", "documents"],
  },
  {
    id: "ds6",
    name: "Multilingual Voice Dataset",
    description: "Audio recordings featuring speakers from 50+ countries. Clean recordings with transcriptions for speech recognition training.",
    category: "Audio",
    sampleImages: [
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200",
      "https://images.unsplash.com/photo-1519874179391-3ebc752241dd?w=200",
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200",
    ],
    totalItems: 20000,
    pricePerItem: 0.04,
    licenseTiers: [
      { name: "Starter", items: 500, price: 59 },
      { name: "Growth", items: 5000, price: 299 },
      { name: "Enterprise", items: 20000, price: 599 },
    ],
    quality: "Studio Audio",
    tags: ["voice", "speech", "multilingual", "audio recognition"],
  },
];

// Helper functions
export function getUpload(id: string): Upload | undefined {
  return mockUploads.find((u) => u.id === id);
}

export function getDataset(id: string): Dataset | undefined {
  return mockDatasets.find((d) => d.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getUploadsByCategory(category: string): Upload[] {
  if (category === "All") return mockUploads;
  return mockUploads.filter((u) => u.category === category);
}

export function getDatasetsByCategory(category: string): Dataset[] {
  if (category === "All") return mockDatasets;
  return mockDatasets.filter((d) => d.category === category);
}
