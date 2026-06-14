export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "Закуски" | "Основные блюда" | "Десерты" | "Напитки";
  image: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  workHours: string;
}

export interface OrderData {
  items: CartItem[];
  total: number;
  customerName: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  comment?: string;
  paymentMethod: "card" | "cash";
}

export interface ServerOrder {
  id: string;
  userId: string | null;
  customer: CustomerInfo;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: "Новый" | "Готовится" | "В пути" | "Доставлен";
  created_at: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  name?: string;
}
