export interface Product {
  id: string;
  category: 'sarees' | 'lehengas' | 'kurta-sets' | 'accessories';
  name: string;
  price: number;
  artisanNote: string;
  description: string;
  fabric: string;
  technique: string;
  region: string;
  occasion: string;
  sizes: string[];
  care: string;
  images: string[];
}

export interface Category {
  id: 'sarees' | 'lehengas' | 'kurta-sets' | 'accessories';
  name: string;
  pronunciation: string;
  tagline: string;
  image: string;
  bannerImage: string;
  exploreImage?: string;
  collectionTileImage?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size: string | null;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
}

export interface CustomerOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  items?: OrderItem[];
  total_rupees: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Bespoke Review' | 'Cancelled';
  created_at: string;
}

export interface BespokeInquiry {
  name: string;
  email: string;
  phone: string;
  category: string;
  material: string;
  size: string;
  details: string;
}
