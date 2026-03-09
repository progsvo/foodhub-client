export interface Category {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  cuisine: string | null;
  dietaryPreference: string | null;
  isAvailable: boolean;
  providerId: string;
  categoryId: string;
  provider?: ProviderProfile;
  category?: Category;
  reviews?: Review[];
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string | null;
  image: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string; image: string | null };
  meals?: Meal[];
}

export interface Review {
  id: string;
  userId: string;
  mealId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; image: string | null };
}

export interface CartItem {
  id: string;
  cartId: string;
  mealId: string;
  quantity: number;
  meal: Meal;
}

export interface Cart {
  id: string | null;
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  mealName: string;
  mealPrice: number;
  quantity: number;
  meal?: { id: string; image: string | null };
}

export interface Order {
  id: string;
  userId: string;
  providerId: string;
  status: OrderStatus;
  deliveryAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  provider?: {
    id: string;
    businessName: string;
    user?: { id: string; name: string; image: string | null };
  };
  user?: { id: string; name: string; image: string | null };
  _count?: { items: number };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  role: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  providerProfile?: ProviderProfile | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number };
}
