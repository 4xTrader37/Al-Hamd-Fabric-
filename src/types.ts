export interface FabricDetails {
  material: string;
  pieces: string;       // "3-Piece", "2-Piece", "Unstitched (4.5 Metre)" etc.
  measurement: string;  // Kameez: 2.5m, Dupatta: 2.5m, Shalwar: 2.5m
  stitchType: string;   // "Unstitched" or "Stitched"
  season: string;       // "Summer Lawn", "Winter Karandi", "Premium Wash 'n Wear"
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'ladies-3pc' | 'ladies-2pc' | 'gents' | 'wedding-fancy';
  images: string[];
  tag?: string; // e.g., "Bestseller", "New Launch", "Hot Sale"
  fabricInfo: FabricDetails;
  colors: string[];
  inStock: boolean;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string; // Optional if stitched
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  shippingAddress: string;
  city?: string;
  notes?: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'products'; filterCategory?: string }
  | { type: 'product-detail'; productId: string }
  | { type: 'cart' }
  | { type: 'privacy' }
  | { type: 'about' }
  | { type: 'admin' };
