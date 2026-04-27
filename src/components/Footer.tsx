import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-logo">
          <span className="logo-text">Mango</span>
          <span className="logo-accent">Store</span>
        </h3>
        <p className="footer-tagline">Premium Pakistani Mangoes</p>
        <p className="footer-copy">&copy; 2026 MangoStore. All rights reserved.</p>
      </div>
    </footer>
  );
}