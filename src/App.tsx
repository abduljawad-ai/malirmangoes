import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import About from "./components/About";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import { useSiteData, getFeaturedProducts, type Product, type CartItem, type SiteSettings } from "./lib/store";
import "./App.css";

function Store() {
  const { data } = useSiteData();
  const settings = data.settings as SiteSettings;
  const products = data.products as Product[];
  
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  const DELIVERY_FEE = settings.deliveryFee;
  const WHATSAPP_NUMBER = settings.whatsappNumber;

  useEffect(() => {
    const saved = localStorage.getItem("mango-cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mango-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(10, item.quantity + 1) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (product: Product, quantity: number) => {
    if (quantity < 1) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== product.id));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (product: Product) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== product.id));
  };

  const handleCheckout = () => {
    const items = cartItems;
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const total = subtotal + DELIVERY_FEE;

    let message = `🛒 *New Order from ${settings.siteTitle}*\n\n`;
    message += `*📦 Items:*\n`;
    items.forEach((item) => {
      message += `• ${item.product.name} x${item.quantity} (${item.product.unit}) = Rs. ${(
        item.product.price * item.quantity
      ).toLocaleString()}\n`;
    });
    message += `\n💰 *Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
    message += `🚚 *Delivery:* Rs. ${DELIVERY_FEE}\n`;
    message += `💵 *Total:* Rs. ${total.toLocaleString()}\n`;
    message += `\n━━━━━━━━━━━━━━━━━━\n`;
    message += `📍 *Delivery Address:*\n[Please enter your full address here]\n`;
    message += `👤 *Name:* \n`;
    message += `📱 *Phone:* \n`;
    message += `━━━━━━━━━━━━━━━━━━`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const featuredProducts = getFeaturedProducts(products);

  return (
    <div className="app">
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <Hero />
      <ProductGrid
        title="Featured Mangoes"
        subtitle="Our most loved varieties"
        products={featuredProducts}
        onProductClick={(p) => {
          setSelectedProduct(p);
          setModalQuantity(1);
        }}
        onAddToCart={addToCart}
      />
      <ProductGrid
        title="All Products"
        subtitle={`${products.length} varieties available`}
        products={products}
        onProductClick={(p) => {
          setSelectedProduct(p);
          setModalQuantity(1);
        }}
        onAddToCart={addToCart}
      />
      <About 
        title={settings.aboutTitle} 
        text={settings.aboutText} 
      />
      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        quantity={modalQuantity}
        onQuantityChange={setModalQuantity}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        deliveryFee={DELIVERY_FEE}
      />
    </div>
  );
}

function AdminWrapper() {
  const { data, addProduct, editProduct, deleteProduct, updateSettings } = useSiteData();
  
  return (
    <AdminLayout 
      products={data.products}
      settings={data.settings}
      onAddProduct={addProduct}
      onEditProduct={editProduct}
      onDeleteProduct={deleteProduct}
      onUpdateSettings={updateSettings}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminWrapper />} />
        <Route path="/*" element={<Store />} />
      </Routes>
    </BrowserRouter>
  );
}