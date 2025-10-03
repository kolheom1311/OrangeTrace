export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'farmer' | 'buyer';
  phone?: string;
  location?: string;
}

export interface CartItem {
  id: string;
  variety: string;
  pricePerKg: number;
  quantity: number;
  selectedQuantity: number; // quantity user wants to buy
  image: string;
  farmLocation: {
    address: string;
      lat: number;
      lng: number;
    };
  addedAt: string;
}

// export interface HarvestBatch {
//   features: any;
//   videoUrl: any;
//   id: string;
//   farmerId: string;
//   batchId: string;
//   variety: string;
//   harvestDate: string;
//   quantity: number;
//   pricePerKg: number;
//   farmLocation: {
//     lat: number;
//     lng: number;
//     address: string;
//   };
//   images: string[];
//   status: 'available' | 'sold' | 'reserved';
//   qrCode: string;
//   createdAt: string;
// }

export interface HarvestBatch {
  id: string;
  batchId: string;
  farmerId: string;
  variety: string;
  quantity: number;
  pricePerKg: number;
  harvestDate: Date;
  status: 'available' | 'reserved' | 'sold';
  qualityGrade: string;
  location: string;
  description?: string;
  images?: string[];
  features?: string[];
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  // Add index signature to allow additional properties
  [key: string]: any;
}

export interface Farmer {
  id: string;
  name: string;
  avatar?: string;
  farmName: string;
  rating: number;
  totalReviews: number;
  // Add any other fields a farmer might have
}

export interface Purchase {
  id: string;
  batchId: string;
  buyerId: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  pricePerKg: number;
  status: 'pending' | 'confirmed' | 'delivered';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'purchase' | 'interest' | 'sale' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// export interface Feedback {
//   id: string;
//   batchId: string;
//   buyerId: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
// }

// Add this new interface

export interface Feedback {
  id: string;
  batchId: string;
  buyerId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  // Add index signature to allow additional properties
  [key: string]: any;
}

export interface Review {
  id: string;         // The document ID from Firestore
  user: string;       // The name of the reviewer
  avatar?: string;    // URL for the reviewer's avatar (optional)
  rating: number;     // A number from 1 to 5
  date: string;       // An ISO date string
  comment: string;
  helpful: number;    // Count of how many users found it helpful
  verified: boolean;  // True if it's a verified purchase
}

export const ORANGE_VARIETIES = [
  'Nagpur Orange',
  'Valencia Orange',
  'Blood Orange',
  'Mandarin Orange',
  'Sweet Orange',
  'Kinnow Orange'
] as const;

export type OrangeVariety = typeof ORANGE_VARIETIES[number];