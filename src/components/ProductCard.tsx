"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, SiteSettings, buildWhatsAppUrl } from "@/lib/types";
import { Sun, Sparkles, Package, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function ProductCard({
  product,
  settings,
}: {
  product: Product;
  settings: SiteSettings;
}) {
  const router = useRouter();
  const { getQty, addToCart, updateQty } = useCart();
  const qty = getQty(product.id);
  const inCart = qty > 0;

  // ── Navigate to detail page (card-level click) ──────────────
  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  // ── Order Now → WhatsApp directly ───────────────────────────
  const handleOrderNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const orderQty = qty > 0 ? qty : 1;
    const url = buildWhatsAppUrl(
      product,
      orderQty,
      settings.delivery_charge,
      settings.whatsapp_number
    );
    window.open(url, "_blank");
  };

  // ── Add to cart ──────────────────────────────────────────────
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
  };

  // ── Qty controls ─────────────────────────────────────────────
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQty(product.id, qty - 1); // removeFromCart if qty hits 0
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQty(product.id, qty + 1);
  };

  return (
    <article
      className="product-card"
      onClick={handleNavigate}
      style={{
        background: "var(--white)",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 4px 24px var(--shadow-warm)",
        border: inCart
          ? "1.5px solid var(--mango-400)"
          : "1px solid rgba(255,179,0,0.1)",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px var(--shadow-warm)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px var(--shadow-warm)";
      }}
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <div style={{ position: "relative", paddingTop: "68%", overflow: "hidden" }}>
        <Image
          src={product.image_url || "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=60"}
          alt={product.name}
          fill
          style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.06)")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {product.featured && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "var(--mango-600)", color: "var(--bark-900)", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "50px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              <Star size={11} fill="currentColor" /> Featured
            </span>
          )}
          {!product.in_stock && (
            <span style={{ background: "rgba(61,43,31,0.75)", color: "white", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "50px", letterSpacing: "0.04em" }}>
              Out of Stock
            </span>
          )}
        </div>

        {/* In-cart indicator (top-right) */}
        {inCart && (
          <div
            style={{
              position: "absolute", top: "12px", right: "12px",
              background: "var(--mango-600)", color: "var(--bark-900)",
              borderRadius: "50px", padding: "4px 10px",
              fontSize: "11px", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "4px",
            }}
          >
            <ShoppingCart size={11} />
            {qty} in cart
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "19px", fontWeight: 800, color: "var(--bark-900)", marginBottom: "6px", lineHeight: 1.2 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: "13px", color: "var(--bark-400)", marginBottom: "12px", lineHeight: 1.55, minHeight: "40px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.description}
        </p>

        {/* Meta chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {[
            { icon: <Sun size={12} />, text: product.season },
            { icon: <Sparkles size={12} />, text: product.taste_notes },
          ].filter((chip) => chip.text).map((chip) => (
            <span
              key={chip.text}
              title={chip.text}
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "var(--mango-50)", color: "var(--bark-700)",
                fontSize: "11px", fontWeight: 600, padding: "4px 10px",
                borderRadius: "50px", border: "1px solid var(--mango-100)",
                maxWidth: "180px", overflow: "hidden",
              }}
            >
              <span style={{ flexShrink: 0, display: "flex" }}>{chip.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chip.text}</span>
            </span>
          ))}
        </div>

        {/* ── Price ─────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
          <Package size={14} color="var(--bark-400)" />
          <span style={{ fontSize: "12px", color: "var(--bark-400)", fontWeight: 500 }}>10kg Wooden Box</span>
        </div>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--mango-700)", lineHeight: 1 }}>
          PKR {product.price_per_box.toLocaleString()}
        </p>
        <p style={{ fontSize: "11px", color: "var(--bark-400)", marginTop: "3px", marginBottom: "16px" }}>
          + Rs {settings.delivery_charge.toLocaleString()} delivery
        </p>

        {/* ── Action Row ────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

          {/* Add to Cart / Qty Controls */}
          {product.in_stock && (
            inCart ? (
              /* Qty stepper */
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "flex", alignItems: "center", gap: "0",
                  background: "var(--mango-50)",
                  border: "1.5px solid var(--mango-300)",
                  borderRadius: "50px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <button
                  id={`cart-dec-${product.id}`}
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  style={{
                    background: "none", border: "none",
                    width: "36px", height: "36px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "var(--bark-700)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--mango-100)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: "28px", textAlign: "center", fontSize: "14px", fontWeight: 700, color: "var(--bark-900)" }}>
                  {qty}
                </span>
                <button
                  id={`cart-inc-${product.id}`}
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  style={{
                    background: "none", border: "none",
                    width: "36px", height: "36px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "var(--bark-700)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--mango-100)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              /* Add to Cart button */
              <button
                id={`cart-add-${product.id}`}
                onClick={handleAddToCart}
                style={{
                  background: "var(--mango-50)",
                  color: "var(--bark-900)",
                  border: "1.5px solid var(--mango-300)",
                  borderRadius: "50px",
                  padding: "0 16px",
                  height: "36px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "5px",
                  flexShrink: 0,
                  transition: "background 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--mango-100)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--mango-400)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--mango-50)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--mango-300)";
                }}
              >
                <ShoppingCart size={13} />
                Add to Cart
              </button>
            )
          )}

          {/* Order Now → WhatsApp */}
          <button
            id={`order-btn-${product.id}`}
            onClick={handleOrderNow}
            disabled={!product.in_stock}
            style={{
              background: product.in_stock ? "var(--mango-600)" : "var(--cream-dark)",
              color: product.in_stock ? "var(--bark-900)" : "var(--bark-400)",
              border: "none",
              borderRadius: "50px",
              padding: "0 18px",
              height: "36px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: product.in_stock ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: "5px",
              boxShadow: product.in_stock ? "0 4px 14px rgba(255,179,0,0.35)" : "none",
              transition: "transform 0.15s, box-shadow 0.15s",
              flexShrink: 0,
              whiteSpace: "nowrap",
              flex: 1,
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (product.in_stock) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {product.in_stock
              ? qty > 0
                ? `Order ${qty} Box${qty > 1 ? "es" : ""}`
                : "Order Now"
              : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
