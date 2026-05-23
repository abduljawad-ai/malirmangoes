export interface Product {
  id: string;
  name: string;
  variety: string;
  description: string;
  price_per_box: number;
  image_url: string;
  image_urls?: string[];
  origin: string;
  season: string;
  taste_notes: string;
  in_stock: boolean;
  featured: boolean;
  created_at?: string;
}

export interface CustomSection {
  id: string;
  image_url: string;
  subtitle: string;
  title: string;
  text: string;
  image_position: "left" | "right";
}

export interface SiteSettings {
  id: string;
  whatsapp_number: string;
  delivery_charge: number;
  farm_name: string;
  farm_tagline: string;
  farm_location: string;
  hero_image_url: string;
  hero_image_urls?: string[];
  about_image_url: string;
  about_subtitle: string;
  about_title: string;
  about_text: string;
  years_farming: string;
  instagram_url: string;
  facebook_url: string;
  logo_url: string;
  custom_sections?: CustomSection[];
}

export function buildWhatsAppUrl(
  product: Product,
  qty: number,
  deliveryCharge: number,
  waNumber: string
): string {
  const subtotal = product.price_per_box * qty;
  const shipping = deliveryCharge * qty;
  const total = subtotal + shipping;

  const text =
    `Assalamu Alaikum! 🥭\n\n` +
    `I'd like to place an order:\n\n` +
    `*${product.name}*\n` +
    `Quantity: ${qty} box${qty > 1 ? "es" : ""} (${qty * 10} kg)\n` +
    `Price per box: PKR ${product.price_per_box.toLocaleString()}\n` +
    `Delivery: PKR ${shipping.toLocaleString()}\n` +
    `*Total: PKR ${total.toLocaleString()}*\n\n` +
    `Please confirm my order and let me know the payment details.`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "sindhri",
    name: "Sindhri Mango",
    variety: "Sindhri",
    description:
      "The crown jewel of Pakistani mangoes. Known for its golden-yellow skin, smooth texture, and exceptionally sweet, aromatic flesh. The Sindhri is a large, kidney-shaped mango with minimal fiber, making it the most sought-after variety both locally and internationally.",
    price_per_box: 3500,
    image_url:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=85",
    origin: "Mirpurkhas, Sindh",
    season: "May – July",
    taste_notes: "Very sweet, aromatic, buttery",
    in_stock: true,
    featured: true,
  },
  {
    id: "chaunsa",
    name: "Chaunsa Mango",
    variety: "Chaunsa",
    description:
      "Often called the 'King of Mangoes', Chaunsa is renowned for its rich, creamy texture and honey-like sweetness. It has a distinct golden-yellow skin with a pinkish blush. The flesh is firm, fiberless, and melts in your mouth with a complex flavor profile.",
    price_per_box: 3800,
    image_url:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=85",
    origin: "Multan, Punjab",
    season: "June – August",
    taste_notes: "Honey-sweet, creamy, rich",
    in_stock: true,
    featured: true,
  },
  {
    id: "anwar-ratol",
    name: "Anwar Ratol Mango",
    variety: "Anwar Ratol",
    description:
      "Small in size but enormous in flavor. Anwar Ratol is a premium variety prized for its intensely sweet, aromatic flesh and smooth, fiberless texture. Despite its modest size, it commands premium prices for its exceptional taste and fragrance.",
    price_per_box: 4200,
    image_url:
      "https://images.unsplash.com/photo-1618897996318-5a901fa18a1f?w=600&q=85",
    origin: "Rahim Yar Khan, Punjab",
    season: "May – July",
    taste_notes: "Intensely sweet, fragrant, delicate",
    in_stock: true,
    featured: false,
  },
  {
    id: "langra",
    name: "Langra Mango",
    variety: "Langra",
    description:
      "A beloved variety with a distinctive green skin that remains green even when ripe. Langra has a unique tangy-sweet flavor profile that sets it apart from other varieties. The flesh is juicy, fiberless, and has a refreshing citrus undertone.",
    price_per_box: 3200,
    image_url:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=85",
    origin: "Haripur, KPK",
    season: "June – August",
    taste_notes: "Tangy-sweet, juicy, citrus undertones",
    in_stock: true,
    featured: false,
  },
];

export const DEMO_SETTINGS: SiteSettings = {
  id: "1",
  whatsapp_number: "923001234567",
  delivery_charge: 400,
  farm_name: "Malir Mangoes",
  farm_tagline: "From our farm to your table — pure, fresh, and unforgettable.",
  farm_location: "Mirpurkhas, Sindh, Pakistan",
  hero_image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1400&q=85",
  hero_image_urls: [
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1400&q=85",
    "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=1400&q=85",
    "https://images.unsplash.com/photo-1618897996318-5a901fa18a1f?w=1400&q=85",
  ],
  about_image_url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=900&q=80",
  about_subtitle: "Our Story",
  about_title: "Grown with Care,\nDelivered with Pride",
  about_text:
    "We are a family-run mango farm with over 30 years of experience cultivating the finest mango varieties in Sindh. Our mangoes are hand-picked at peak ripeness and delivered fresh to your doorstep across Pakistan via Leopard Courier.",
  years_farming: "30+",
  instagram_url: "#",
  facebook_url: "#",
  logo_url: "",
  custom_sections: [],
};
