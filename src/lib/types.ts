// ============================================================
// Mango Store — Shared data types & constants
// ============================================================

export interface Product {
  id: string;
  name: string;
  variety: string;
  description: string;
  price_per_box: number; // PKR per 10kg wooden box
  image_url: string;
  image_urls?: string[]; // Multiple image support
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
  whatsapp_number: string;        // e.g. "923001234567"
  delivery_charge: number;        // PKR per box — Leopard
  farm_name: string;
  farm_tagline: string;
  farm_location: string;
  hero_image_url: string;
  about_image_url: string;
  about_subtitle: string;
  about_title: string;
  about_text: string;
  years_farming: string;
  instagram_url: string;
  facebook_url: string;
  logo_url: string;            // URL to logo image; leave empty to use default 🥭 emoji
  custom_sections?: CustomSection[];
}

// ---- WhatsApp URL builder ----
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

// ---- Demo Data Fallbacks ----

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sindhri Mango",
    variety: "Sindhri",
    description: "The 'King of Mangoes' — famous for its fibre-less, buttery-sweet flesh and heavenly fragrance. Grown in the heart of Mirpurkhas.",
    price_per_box: 2800,
    image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
    image_urls: [
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
      "https://images.unsplash.com/photo-1618897996318-5a901fa18a1f?w=800&q=80"
    ],
    origin: "Mirpurkhas, Sindh",
    season: "May – July",
    taste_notes: "Sweet, fibre-less, buttery",
    in_stock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Chaunsa Mango",
    variety: "Chaunsa",
    description: "Creamy, honey-sweet and juicy with a perfectly smooth texture. Pakistan's most exported premium mango variety.",
    price_per_box: 3200,
    image_url: "https://images.unsplash.com/photo-1618897996318-5a901fa18a1f?w=800&q=80",
    origin: "Rahim Yar Khan, Punjab",
    season: "July – September",
    taste_notes: "Creamy, honey-sweet, aromatic",
    in_stock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Anwar Ratol",
    variety: "Anwar Ratol",
    description: "A small, intensely flavourful mango with an unmatched sugar-rich sweetness. Highly prized by connoisseurs worldwide.",
    price_per_box: 3600,
    image_url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
    origin: "Bahawalpur, Punjab",
    season: "July – August",
    taste_notes: "Intensely sweet, rich, sugar-packed",
    in_stock: true,
    featured: false,
  },
  {
    id: "4",
    name: "Langra Mango",
    variety: "Langra",
    description: "Distinguished by its unique tangy-sweet flavour profile and bright green skin even when fully ripe. A true classic.",
    price_per_box: 2500,
    image_url: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=800&q=80",
    origin: "Muzaffargarh, Punjab",
    season: "June – August",
    taste_notes: "Tangy-sweet, fibrous, refreshing",
    in_stock: false,
    featured: false,
  },
];

export const DEMO_SETTINGS: SiteSettings = {
  id: "1",
  whatsapp_number: "923001234567",
  delivery_charge: 400,
  farm_name: "Mango Farm Pakistan",
  farm_tagline: "From our farm to your table — pure, fresh, and unforgettable.",
  farm_location: "Mirpurkhas, Sindh, Pakistan",
  hero_image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=1400&q=85",
  about_image_url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=900&q=80",
  about_subtitle: "🌿 Our Story",
  about_title: "Grown with Care,\nDelivered with Pride",
  about_text: "We are a family-run mango farm with over 30 years of experience cultivating the finest mango varieties in Sindh. Our mangoes are hand-picked at peak ripeness and delivered fresh to your doorstep across Pakistan via Leopard Courier.",
  years_farming: "30+",
  instagram_url: "#",
  facebook_url: "#",
  logo_url: "",
  custom_sections: [],
};

