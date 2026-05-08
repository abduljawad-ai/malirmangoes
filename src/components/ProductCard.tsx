"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, SiteSettings } from "@/lib/types";
import { Sun, Sparkles, Package } from "lucide-react";

export default function ProductCard({
  product,
  settings,
}: {
  product: Product;
  settings: SiteSettings;
}) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
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
        border: "1px solid rgba(255,179,0,0.1)",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
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
      {/* Image */}
      <div style={{ position: "relative", paddingTop: "68%", overflow: "hidden" }}>
        <Image
          src={product.image_url || "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=60"}
          alt={product.name}
          fill
          style={{
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.06)")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {product.featured && (
            <span style={{ background: "var(--mango-600)", color: "var(--bark-900)", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "50px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              ⭐ Featured
            </span>
          )}
          {!product.in_stock && (
            <span style={{ background: "rgba(61,43,31,0.75)", color: "white", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "50px", letterSpacing: "0.04em" }}>
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
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
          ].map((chip) => (
            <span
              key={chip.text}
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "var(--mango-50)", color: "var(--bark-700)",
                fontSize: "11px", fontWeight: 600, padding: "4px 10px",
                borderRadius: "50px", border: "1px solid var(--mango-100)",
              }}
            >
              {chip.icon} {chip.text}
            </span>
          ))}
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              <Package size={14} color="var(--bark-400)" />
              <span style={{ fontSize: "12px", color: "var(--bark-400)", fontWeight: 500 }}>10kg Wooden Box</span>
            </div>
            <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--leaf-800)", lineHeight: 1 }}>
              PKR {product.price_per_box.toLocaleString()}
            </p>
          </div>

          <button
            id={`order-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            style={{
              background: product.in_stock ? "var(--mango-600)" : "var(--cream-dark)",
              color: product.in_stock ? "var(--bark-900)" : "var(--bark-400)",
              border: "none",
              borderRadius: "50px",
              padding: "12px 20px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: product.in_stock ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: product.in_stock ? "0 4px 14px rgba(255,179,0,0.35)" : "none",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              if (product.in_stock) {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {product.in_stock ? "View Details" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
