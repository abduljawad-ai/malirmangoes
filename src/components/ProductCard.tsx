import { Plus, Check } from "lucide-react";
import type { Product } from "../lib/products";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick, onAddToCart }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <article className="product-card" onClick={() => onProductClick(product)}>
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        {hasDiscount && <span className="product-badge">-{discount}%</span>}
        {!product.inStock && (
          <div className="product-out-of-stock">
            <span>Out of Stock</span>
          </div>
        )}
      </div>
      <div className="product-content">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-unit">{product.unit}</p>
        <div className="product-price-row">
          <div className="product-price">
            <span className="price-current">Rs. {product.price.toLocaleString()}</span>
            {hasDiscount && (
              <span className="price-original">Rs. {product.originalPrice!.toLocaleString()}</span>
            )}
          </div>
        </div>
        {product.inStock && (
          <button
            className="product-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <Plus className="btn-plus-icon" />
            Add to Cart
          </button>
        )}
        {!product.inStock && <span className="product-unavailable">Currently Unavailable</span>}
      </div>
    </article>
  );
}