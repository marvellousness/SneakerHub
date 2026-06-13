export interface Review {
  id: string;
  username: string;
  rating: number;
  date: string;
  comment: string;
  title: string;
  verified: boolean;
}

export interface ColorOption {
  name: string;
  hex: string;
  imageIndex: number;
}

export interface SneakerProduct {
  id: string;
  name: string;
  brand: string;
  category: string; // "Running" | "Basketball" | "Lifestyle" | "Training" | "Tennis"
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  images: string[];
  sizes: number[]; // US sneaker sizes: e.g. [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
  colors: ColorOption[];
  stock: number;
  specs: { label: string; value: string }[];
  reviews: Review[];
  isHot?: boolean;
  designerNote?: string;
}

export interface CartItem {
  id: string; // Unique row ID (productId_size_colorHex)
  product: SneakerProduct;
  size: number;
  colorName: string;
  colorHex: string;
  quantity: number;
}

export interface OrderStatusMilestone {
  status: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  priceBreakdown: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingHistory: OrderStatusMilestone[];
  createdAt: string;
}

export interface Offer {
  code: string;
  discountText: string;
  percentage: number;
  type: 'Voucher' | 'Flash' | 'Scratch';
  expires: string;
  description: string;
  claimed?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'drop' | 'shipping' | 'promo' | 'assistant';
}

export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
  points: number;
  addresses: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  }[];
  shoeSize?: number;
  favoriteBrand?: string;
  bio?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'view_product' | 'apply_filter';
    payload: string;
  };
}
