export interface Product {
  id: string;
  name: string;
  category: 'speakers' | 'headphones' | 'earbuds' | 'accessories';
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  colors: { name: string; hex: string }[];
  specs: {
    driver?: string;
    battery?: string;
    bluetooth?: string;
    waterproof?: string;
    weight?: string;
    power?: string;
  };
  description: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface EQPreset {
  name: string;
  bass: number; // -10 to 10 dB
  mid: number;
  treble: number;
  description: string;
}
