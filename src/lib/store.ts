import { useState, useEffect, useCallback } from "react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  unit: string;
}

export interface SiteSettings {
  deliveryFee: number;
  whatsappNumber: string;
  aboutTitle: string;
  aboutText: string;
  siteTitle: string;
}

export interface SiteData {
  products: Product[];
  settings: SiteSettings;
}

const STORAGE_KEY = "mango-store-data";

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Sindhri Premium",
    slug: "sindhri-premium",
    price: 2500,
    originalPrice: 3000,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
    images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=800"],
    description: "Sweet & juicy Sindhri mangoes from Sindh.",
    category: "Sindhri",
    inStock: true,
    featured: true,
    unit: "10kg box",
  },
  {
    id: "2",
    name: "Chaunsa Special",
    slug: "chaunsa-special",
    price: 2800,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600",
    images: ["https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800"],
    description: "Premium Chaunsa from Multan.",
    category: "Chaunsa",
    inStock: true,
    featured: true,
    unit: "10kg box",
  },
];

const defaultSettings: SiteSettings = {
  deliveryFee: 400,
  whatsappNumber: "923283181163",
  aboutTitle: "Why Choose Us?",
  aboutText: "Direct from farmers in Sindh & Multan to your doorstep",
  siteTitle: "MangoStore - Premium Pakistani Mangoes",
};

const defaultData: SiteData = {
  products: defaultProducts,
  settings: defaultSettings,
};

export function useSiteData() {
  const [data, setData] = useState<SiteData>(() => {
    if (typeof window === "undefined") return defaultData;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateProducts = useCallback((products: Product[]) => {
    setData((prev) => ({ ...prev, products }));
  }, []);

  const updateSettings = useCallback((settings: SiteSettings) => {
    setData((prev) => ({ ...prev, settings }));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setData((prev) => ({
      ...prev,
      products: [...prev.products, { ...product, id: Date.now().toString() }],
    }));
  }, []);

  const editProduct = useCallback((id: string, updates: Partial<Product>) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  }, []);

  return {
    data,
    updateProducts,
    updateSettings,
    addProduct,
    editProduct,
    deleteProduct,
  };
}

export function getFeaturedProducts(products: Product[]): Product[] {
  return products.filter((p) => p.featured);
}