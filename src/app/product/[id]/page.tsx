"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Product, SiteSettings, buildWhatsAppUrl, DEMO_SETTINGS } from "@/lib/types";
import { getProducts, getSettings } from "@/lib/store";
import { Minus, Plus, ShoppingBag, Sun, Sparkles, Package, ChevronLeft, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEMO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [pList, s] = await Promise.all([getProducts(), getSettings()]);
      const found = pList.find((p) => p.id === id);
      setProduct(found || null);
      setSettings(s);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100svh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={40} color="var(--mango-600)" className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "var(--bark-400)", fontSize: "14px" }}>Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100svh", background: "var(--cream)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <Package size={64} color="var(--bark-300)" style={{ marginBottom: "16px" }} />
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--bark-900)", marginBottom: "8px" }}>Product Not Found</h1>
        <p style={{ color: "var(--bark-400)", marginBottom: "24px" }}>This product might have been removed or doesn&apos;t exist.</p>
        <Link href="/" style={{ background: "var(--mango-600)", color: "var(--bark-900)", padding: "12px 24px", borderRadius: "50px", fontWeight: 700, textDecoration: "none" }}>
          Return to Store
        </Link>
      </div>
    );
  }

  const subtotal = product.price_per_box * qty;
  const shipping = settings.delivery_charge * qty;
  const total = subtotal + shipping;
  const waUrl = buildWhatsAppUrl(product, qty, settings.delivery_charge, settings.whatsapp_number);

  const images = [product.image_url, ...(product.image_urls || [])].filter(Boolean);

  const nextImage = () => setCurrentImageIdx((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentImageIdx((i) => (i - 1 + images.length) % images.length);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100svh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation */}
      <header style={{ padding: "16px 20px", position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--cream-dark)", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.back()} style={{ background: "var(--white)", border: "1px solid var(--cream-dark)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <ArrowLeft size={20} color="var(--bark-900)" />
        </button>
        <h1 style={{ marginLeft: "16px", fontSize: "16px", fontWeight: 700, color: "var(--bark-900)" }}>Product Details</h1>
      </header>

      <main style={{ flex: 1, maxWidth: "600px", margin: "0 auto", width: "100%", background: "var(--white)", boxShadow: "0 0 40px rgba(0,0,0,0.02)" }}>
        {/* Image Slider */}
        <div style={{ position: "relative", width: "100%", paddingTop: "100%", background: "var(--cream-dark)" }}>
          {images.length > 0 ? (
            <Image
              src={images[currentImageIdx]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 600px) 100vw, 600px"
              priority
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={40} color="var(--bark-300)" />
            </div>
          )}
          
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                style={{
                  position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
                  width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
                }}
              >
                <ChevronLeft size={24} color="var(--bark-900)" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                style={{
                  position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
                  width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
                }}
              >
                <ChevronRight size={24} color="var(--bark-900)" />
              </button>
              <div style={{ position: "absolute", bottom: "16px", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "8px" }}>
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: idx === currentImageIdx ? "var(--mango-600)" : "rgba(255,255,255,0.6)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "background 0.3s"
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details Content */}
        <div style={{ padding: "28px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--bark-900)", lineHeight: 1.1 }}>
              {product.name}
            </h2>
          </div>
          
          <p style={{ fontSize: "20px", fontWeight: 800, color: "var(--leaf-800)", marginBottom: "20px" }}>
            PKR {product.price_per_box.toLocaleString()}{" "}
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--bark-400)" }}>/ 10kg box</span>
          </p>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--mango-50)", color: "var(--bark-700)", fontSize: "13px", fontWeight: 600, padding: "8px 14px", borderRadius: "50px", border: "1px solid var(--mango-100)" }}>
              <Sun size={14} /> {product.season}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--mango-50)", color: "var(--bark-700)", fontSize: "13px", fontWeight: 600, padding: "8px 14px", borderRadius: "50px", border: "1px solid var(--mango-100)" }}>
              <Sparkles size={14} /> {product.taste_notes}
            </span>
          </div>

          <p style={{ fontSize: "15px", color: "var(--bark-700)", lineHeight: 1.6, marginBottom: "36px", whiteSpace: "pre-line" }}>
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div style={{ background: "var(--white)", border: "1px solid var(--cream-dark)", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 4px 20px var(--shadow-warm)" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--bark-700)", marginBottom: "16px", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Select Quantity (Boxes)
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                style={{ width: "48px", height: "48px", borderRadius: "50%", background: qty <= 1 ? "var(--cream-dark)" : "var(--mango-600)", border: "none", cursor: qty <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              >
                <Minus size={20} color={qty <= 1 ? "var(--bark-400)" : "var(--bark-900)"} />
              </button>
              <div style={{ textAlign: "center", minWidth: "80px" }}>
                <span style={{ fontSize: "36px", fontWeight: 800, color: "var(--bark-900)", lineHeight: 1 }}>{qty}</span>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--bark-400)", marginTop: "6px" }}>{qty * 10} kg</p>
              </div>
              <button
                onClick={() => setQty(qty + 1)}
                style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--mango-600)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Plus size={20} color="var(--bark-900)" />
              </button>
            </div>
          </div>

          {/* Price breakdown */}
          <div style={{ background: "var(--cream-dark)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "var(--bark-700)" }}>Mangoes ({qty} box{qty > 1 ? "es" : ""})</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--bark-900)" }}>PKR {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: "14px", color: "var(--bark-700)" }}>Delivery ({qty} × Rs {settings.delivery_charge})</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--bark-900)" }}>PKR {shipping.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--bark-900)" }}>Total</span>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--leaf-800)" }}>PKR {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed bottom action */}
      <div style={{ padding: "20px 24px", background: "var(--white)", borderTop: "1px solid var(--cream-dark)", boxShadow: "0 -8px 30px rgba(0,0,0,0.06)", position: "sticky", bottom: 0, zIndex: 40 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {product.in_stock ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", padding: "16px", fontSize: "16px", borderRadius: "16px", gap: "8px", textDecoration: "none" }}
            >
              <WhatsAppIcon size={20} /> Order Now via WhatsApp
            </a>
          ) : (
            <button
              disabled
              style={{ width: "100%", padding: "16px", fontSize: "16px", background: "var(--cream-dark)", color: "var(--bark-400)", border: "none", borderRadius: "16px", fontWeight: 700, cursor: "not-allowed" }}
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
