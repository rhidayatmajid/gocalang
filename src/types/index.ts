export interface Outlet {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  image: string;           // primary hero image (first URL)
  imageFallbacks: string[]; // fallback variants for hero
  galleryImages: {         // all images from Outlets sheet image_url column
    src: string;
    fallbacks: string[];
  }[];
  mapsUrl: string;
  waNumber: string;
  bankInfo: string;
  category: string;
}

export interface MenuItem {
  id: string;
  outletId: string;
  category: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

// Outlet category chips shown on the Home filter bar
export const OUTLET_CATEGORIES = [
  { value: 'semua',   label: 'Semua',    emoji: '🍽️' },
  { value: 'makanan', label: 'Makanan',  emoji: '🍛' },
  { value: 'minuman', label: 'Minuman',  emoji: '🧋' },
  { value: 'jajanan', label: 'Jajanan',  emoji: '🍡' },
  { value: 'western', label: 'Western',  emoji: '🍔' },
  { value: 'italian', label: 'Italian',  emoji: '🍕' },
  { value: 'chinese', label: 'Chinese',  emoji: '🥡' },
  { value: 'local',   label: 'Lokal',    emoji: '🍜' },
  { value: 'seafood', label: 'Seafood',  emoji: '🦐' },
  { value: 'dessert', label: 'Dessert',  emoji: '🍰' },
  { value: 'kopi',    label: 'Kopi',     emoji: '☕' },
] as const;
