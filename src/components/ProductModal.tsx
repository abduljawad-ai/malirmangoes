import { X, Plus, Minus, Check } from "lucide-react";
import type { Product } from "../lib/products";
import "./ProductModal.css";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  quantity,
  onQuantityChange,
}: ProductModalProps) {
  if (!product) return null;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X className="close-icon" />
        </button>

        <div className="modal-grid">
          <div className="modal-images">
            <img
              src={product.images[0]}
              alt={product.name}
              className="modal-main-image"
            />
          </div>

          <div className="modal-details">
            <span className="modal-category">{product.category}</span>
            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-unit">{product.unit}</p>

            <div className="modal-price">
              <span className="modal-price-current">
                Rs. {product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="modal-price-original">
                    Rs. {product.originalPrice!.toLocaleString()}
                  </span>
                  <span className="modal-price-discount">-{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="modal-description">{product.description}</p>

            <div className="modal-stock">
              {product.inStock ? (
                <>
                  <Check className="stock-icon" />
                  <span className="stock-text">In Stock</span>
                </>
              ) : (
                <span className="stock-out">Out of Stock</span>
              )}
            </div>

            {product.inStock && (
              <>
                <div className="modal-quantity">
                  <span className="quantity-label">Quantity:</span>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="qty-icon" />
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
                      disabled={quantity >= 10}
                    >
                      <Plus className="qty-icon" />
                    </button>
                  </div>
                </div>

                <button
                  className="modal-add-btn"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                    onClose();
                  }}
                >
                  <Plus className="btn-icon" />
                  Add to Cart - Rs. {(product.price * quantity).toLocaleString()}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}