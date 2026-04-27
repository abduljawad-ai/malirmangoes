import ProductCard from "./ProductCard";
import type { Product } from "../lib/products";
import "./ProductGrid.css";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ title, subtitle, products, onProductClick, onAddToCart }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="product-grid-section" id="products">
      <div className="product-grid-container">
        <div className="product-grid-header">
          <h2 className="product-grid-title">{title}</h2>
          {subtitle && <p className="product-grid-subtitle">{subtitle}</p>}
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}