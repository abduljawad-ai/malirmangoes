// ============================================================
// Mango Store — Firebase Firestore Persistence Layer
// ============================================================
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Product, SiteSettings, DEMO_PRODUCTS, DEMO_SETTINGS } from "./types";

// ── Products ──────────────────────────────────────────────
const SEED_FLAG = "mango_products_seeded";

export async function getProducts(): Promise<Product[]> {
  if (!db) return DEMO_PRODUCTS;
  try {
    const snapshot = await getDocs(collection(db, "products"));

    if (snapshot.empty) {
      if (typeof window !== "undefined" && !localStorage.getItem(SEED_FLAG)) {
        const firestore = db;
        const promises = DEMO_PRODUCTS.map(p => setDoc(doc(firestore, "products", p.id), p));
        await Promise.all(promises);
        localStorage.setItem(SEED_FLAG, "true");
        return DEMO_PRODUCTS;
      }
      return DEMO_PRODUCTS;
    }
    const products = snapshot.docs.map(d => d.data() as Product);
    return products.sort((a, b) => {
      if (a.featured === b.featured) return a.name.localeCompare(b.name);
      return a.featured ? -1 : 1;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return DEMO_PRODUCTS;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "products", product.id), product);
}

export async function removeProduct(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "products", id));
}

// ── Settings ──────────────────────────────────────────────
export async function getSettings(): Promise<SiteSettings> {
  if (!db) return DEMO_SETTINGS;
  try {
    const d = await getDoc(doc(db, "settings", "global"));
    if (d.exists()) return { ...DEMO_SETTINGS, ...(d.data() as Partial<SiteSettings>) } as SiteSettings;
    return DEMO_SETTINGS;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEMO_SETTINGS;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "settings", "global"), settings);
}
