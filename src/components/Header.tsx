import { ShoppingCart } from "lucide-react";
import "./Header.css";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="header-logo">
          <span className="logo-text">Mango</span>
          <span className="logo-accent">Store</span>
        </a>
        <button className="cart-button" onClick={onCartClick} aria-label="Open cart">
          <ShoppingCart className="cart-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}