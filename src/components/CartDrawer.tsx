import { X, Minus, Plus, Trash2 } from "lucide-react";
import type { Product, CartItem } from "../lib/store";
import "./CartDrawer.css";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onRemove: (product: Product) => void;
  onCheckout: () => void;
  deliveryFee?: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  deliveryFee = 400,
}: CartDrawerProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>
            <X className="close-icon" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <span>Add some mangoes to get started!</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.product.name}</h3>
                    <p className="cart-item-price">
                      Rs.{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="cart-item-qty">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="qty-icon" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product,
                            Math.min(10, item.quantity + 1)
                          )
                        }
                        disabled={item.quantity >= 10}
                      >
                        <Plus className="qty-icon" />
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => onRemove(item.product)}
                  >
                    <Trash2 className="remove-icon" />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="cart-summary-row cart-total">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="cart-checkout">
              <button
                className="whatsapp-checkout-btn"
                onClick={onCheckout}
                disabled={items.length === 0}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="whatsapp-icon"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.371-.025-.52-.075-.149-.66-1.342-1.085-1.841-.411-.498-1.054-.583-1.44-.495-.386.088-.746.198-1.04.348-.297.149-.495.223-.694.372-.173.149-.347.223-.546.348-.174.124-.348.099-.447.025-.099-.074-.747-.722-.807-.77-.06-.05-.149-.099-.223-.124-.074-.074-.173-.099-.297-.025-.149.074-.626.347-.756.595-.124.248-.124.496 0 .595.124.124.248.347.372.52.124.174.173.298.223.471.05.173.025.347-.025.52-.074.248-.173.496-.347.595z" />
                  <path d="M12.001 22c-.163 0-.326-.012-.485-.037-.159-.025-.303.025-.42.124l-.585.495c-.371.31-.772.51-1.227.536H8.5c-.455-.025-.856-.225-1.228-.536l-.584-.495c-.117-.099-.262-.149-.42-.124-.16.025-.323.037-.486.037-.326-.012-.623-.137-.854-.373-.231-.236-.358-.532-.373-.842l-.025-.475c-.012-.31.112-.612.37-.839.231-.2.485-.32.77-.337.284-.025.56.012.82.124l.495.223c.198.099.422.099.62 0l.495-.223c.26-.112.536-.149.798-.124.285.017.54.137.77.337.259.227.382.53.37.839l-.012.475c-.015.31-.142.606-.373.842-.231.236-.528.36-.854.372z" />
                </svg>
                Order via WhatsApp
              </button>
              <p className="checkout-note">
                Click to send order on WhatsApp
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}