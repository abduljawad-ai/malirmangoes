"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CustomSection, DEMO_SETTINGS, Product, SiteSettings } from "@/lib/types";
import { getProducts, getSettings, saveProduct, removeProduct, saveSettings } from "@/lib/store";
import {
  LogOut, Plus, Pencil, Trash2, Package, Settings, Save, X, Eye, EyeOff, CheckCircle, Leaf, Loader2, Image as ImageIcon, Layers, MoveUp, MoveDown
} from "lucide-react";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type Tab = "products" | "settings" | "sections";

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "50px", background: `${color}22`, color, letterSpacing: "0.04em" }}>
      {children}
    </span>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div style={{
      position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
      background: "var(--leaf-900)", color: "white", padding: "14px 24px",
      borderRadius: "50px", fontSize: "14px", fontWeight: 600,
      display: "flex", alignItems: "center", gap: "8px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)", zIndex: 200,
      animation: "slideUpToast 0.3s ease",
    }}>
      <CheckCircle size={16} color="var(--mango-400)" />
      {message}
      <style>{`@keyframes slideUpToast { from { transform: translateX(-50%) translateY(20px); opacity:0; } to { transform: translateX(-50%) translateY(0); opacity:1; } }`}</style>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEMO_SETTINGS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [toast, setToast] = useState("");
  const [toastError, setToastError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [p, s] = await Promise.all([getProducts(), getSettings()]);
      setProducts(p);
      setSettings(s);
      setLoading(false);
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const showError = (msg: string) => {
    setToastError(msg);
    setTimeout(() => setToastError(""), 5000);
  };

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.href = "/admin/login";
  };

  // ── Product actions — save immediately to Firebase ──
  const handleDeleteProduct = async (id: string) => {
    const previousProducts = [...products];
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try {
      await removeProduct(id);
      showToast("Product deleted.");
    } catch (e) {
      setProducts(previousProducts);
      showError(`❌ Delete failed. Check Firebase rules: ${(e as Error).message}`);
    }
  };

  const handleToggleStock = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const previousProducts = [...products];
    const updatedProduct = { ...product, in_stock: !product.in_stock };
    const updatedList = products.map((p) => p.id === id ? updatedProduct : p);
    setProducts(updatedList);
    try {
      await saveProduct(updatedProduct);
      showToast("Stock status updated.");
    } catch (e) {
      setProducts(previousProducts);
      showError(`❌ Save failed. Check Firebase rules: ${(e as Error).message}`);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    const validationErrors: string[] = [];
    if (!product.name.trim()) validationErrors.push("Product name is required");
    if (product.price_per_box <= 0) validationErrors.push("Price must be greater than 0");
    if (product.image_url && !isValidUrl(product.image_url)) {
      validationErrors.push("Please enter a valid image URL");
    }

    if (validationErrors.length > 0) {
      showError("❌ " + validationErrors[0]);
      return;
    }

    const exists = products.find((p) => p.id === product.id);
    const previousProducts = [...products];
    const updatedList = exists
      ? products.map((p) => p.id === product.id ? product : p)
      : [...products, product];
    setProducts(updatedList);
    setShowAddForm(false);
    try {
      await saveProduct(product);
      showToast(exists ? "Product updated! ✓" : "Product added! ✓");
    } catch (e) {
      setProducts(previousProducts);
      showError(`❌ Save failed. Check Firebase rules: ${(e as Error).message}`);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings.whatsapp_number || !/^\d{10,15}$/.test(settings.whatsapp_number)) {
      showError("❌ WhatsApp number must be 10-15 digits (without +)");
      return;
    }
    if (settings.delivery_charge < 0) {
      showError("❌ Delivery charge cannot be negative");
      return;
    }
    try {
      await saveSettings(settings);
      showToast("Settings saved! Changes are live on the store ✓");
    } catch (e) {
      showError(`❌ Settings save failed. Check Firebase rules: ${(e as Error).message}`);
    }
  };

  const isValidUrl = (str: string): boolean => {
    try { new URL(str); return true; } catch { return false; }
  };

  const emptyProduct: Product = {
    id: generateId(),
    name: "", variety: "", description: "",
    price_per_box: 0, image_url: "", image_urls: [], origin: "",
    season: "", taste_notes: "", in_stock: true, featured: false,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100svh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={40} color="var(--mango-600)" className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "var(--bark-400)", fontSize: "14px" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100svh", background: "var(--cream)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Success Toast */}
      {toast && <Toast message={toast} />}
      {/* Error Toast */}
      {toastError && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: "#C53030", color: "white", padding: "14px 24px",
          borderRadius: "12px", fontSize: "13px", fontWeight: 600,
          maxWidth: "90vw", textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)", zIndex: 200,
        }}>
          {toastError}
        </div>
      )}

      {/* Top bar */}
      <header
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--cream-dark)",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", background: "var(--cream-dark)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {settings.logo_url ? (
                <Image src={settings.logo_url} alt="Logo" width={40} height={40} style={{ objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "20px" }}>🥭</span>
              )}
            </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--bark-900)", lineHeight: 1 }}>Admin Panel</p>
            <p style={{ fontSize: "11px", color: "var(--bark-400)" }}>Mango Farm Pakistan</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "13px", color: "var(--leaf-700)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            <Eye size={14} /> View Store
          </a>
          <button id="admin-logout" onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "1px solid var(--cream-dark)", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", fontWeight: 600, color: "var(--bark-700)", cursor: "pointer" }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 20px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          {([
            { id: "products", icon: <Package size={16} />, label: "Products" },
            { id: "sections", icon: <Layers size={16} />, label: "Page Sections" },
            { id: "settings", icon: <Settings size={16} />, label: "Settings" },
          ] as { id: Tab; icon: React.ReactNode; label: string }[]).map((t) => (
            <button key={t.id} id={`tab-${t.id}`} onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: 700,
                background: tab === t.id ? "var(--mango-600)" : "var(--white)",
                color: tab === t.id ? "var(--bark-900)" : "var(--bark-400)",
                boxShadow: tab === t.id ? "0 4px 16px rgba(255,179,0,0.3)" : "none",
                transition: "all 0.2s",
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--bark-900)" }}>
                Products ({products.length})
              </h2>
              <button id="add-product-btn"
                onClick={() => { setEditingProduct(emptyProduct); setShowAddForm(true); }}
                className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "var(--bark-400)", background: "var(--white)", borderRadius: "20px" }}>
                <Package size={40} color="var(--bark-300)" style={{ margin: "0 auto 12px", display: "block" }} />
                <p>No products yet. Click &quot;Add Product&quot; to get started.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {products.map((product) => (
                  <div key={product.id}
                    style={{
                      background: "var(--white)", borderRadius: "20px", padding: "16px",
                      display: "flex", gap: "16px", alignItems: "center",
                      boxShadow: "0 2px 12px var(--shadow-warm)",
                      border: "1px solid rgba(255,179,0,0.08)", flexWrap: "wrap",
                    }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "14px", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                      <Image
                        src={product.image_url || "https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&q=60"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="72px"
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--bark-900)" }}>{product.name}</span>
                        {product.featured && <Badge color="var(--mango-700)">Featured</Badge>}
                        <Badge color={product.in_stock ? "var(--leaf-700)" : "#E53E3E"}>
                          {product.in_stock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--bark-400)" }}>{product.variety} · {product.origin}</p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--leaf-800)", marginTop: "4px" }}>
                        Rs {product.price_per_box.toLocaleString()} / box
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
                      <button id={`toggle-stock-${product.id}`} onClick={() => handleToggleStock(product.id)}
                        title={product.in_stock ? "Mark as Out of Stock" : "Mark as In Stock"}
                        style={{
                          width: "42px",
                          height: "24px",
                          borderRadius: "20px",
                          background: product.in_stock ? "var(--leaf-600)" : "var(--bark-300)",
                          position: "relative",
                          border: "none",
                          cursor: "pointer",
                          transition: "background 0.3s ease",
                          padding: 0,
                          flexShrink: 0
                        }}>
                        <div style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "var(--white)",
                          position: "absolute",
                          top: "2px",
                          left: product.in_stock ? "20px" : "2px",
                          transition: "left 0.3s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        }} />
                      </button>
                      <button id={`edit-product-${product.id}`}
                        onClick={() => { setEditingProduct({ ...product }); setShowAddForm(true); }}
                        style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--mango-100)", background: "var(--mango-50)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--mango-800)", display: "flex", alignItems: "center" }}>
                        <Pencil size={14} />
                      </button>
                      <button id={`delete-product-${product.id}`} onClick={() => handleDeleteProduct(product.id)}
                        style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #FFE0E0", background: "#FFF5F5", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#E53E3E", display: "flex", alignItems: "center" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SECTIONS TAB ── */}
        {tab === "sections" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--bark-900)" }}>
                Custom Sections
              </h2>
              <button onClick={() => { setEditingSection({ id: generateId(), title: "", subtitle: "", text: "", image_url: "", image_position: "left" }); setShowSectionForm(true); }}
                className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
                <Plus size={16} /> Add Section
              </button>
            </div>
            
            {(!settings.custom_sections || settings.custom_sections.length === 0) ? (
              <div style={{ textAlign: "center", padding: "60px", color: "var(--bark-400)", background: "var(--white)", borderRadius: "20px" }}>
                <Layers size={40} color="var(--bark-300)" style={{ margin: "0 auto 12px", display: "block" }} />
                <p>No custom sections yet. Add one to show more content on your store.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {settings.custom_sections.map((sec, idx) => (
                  <div key={sec.id} style={{
                    background: "var(--white)", borderRadius: "20px", padding: "16px",
                    display: "flex", gap: "16px", alignItems: "center",
                    boxShadow: "0 2px 12px var(--shadow-warm)",
                    border: "1px solid rgba(255,179,0,0.08)", flexWrap: "wrap",
                  }}>
                    <div style={{ width: "80px", height: "60px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, position: "relative", background: "var(--cream-dark)" }}>
                      {sec.image_url && <Image src={sec.image_url} alt="Section image" fill style={{ objectFit: "cover" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--leaf-700)", textTransform: "uppercase" }}>{sec.subtitle || "No Subtitle"}</p>
                      <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--bark-900)", marginBottom: "4px" }}>{sec.title || "Untitled Section"}</h4>
                      <p style={{ fontSize: "13px", color: "var(--bark-400)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                        {sec.text}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button disabled={idx === 0} onClick={async () => {
                        const newSections = [...(settings.custom_sections || [])];
                        [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
                        const updated = { ...settings, custom_sections: newSections };
                        setSettings(updated);
                        await saveSettings(updated);
                      }} style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--cream-dark)", background: "var(--cream)", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.5 : 1 }}><MoveUp size={14} /></button>
                      
                      <button disabled={idx === (settings.custom_sections?.length || 0) - 1} onClick={async () => {
                        const newSections = [...(settings.custom_sections || [])];
                        [newSections[idx + 1], newSections[idx]] = [newSections[idx], newSections[idx + 1]];
                        const updated = { ...settings, custom_sections: newSections };
                        setSettings(updated);
                        await saveSettings(updated);
                      }} style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--cream-dark)", background: "var(--cream)", cursor: idx === (settings.custom_sections?.length || 0) - 1 ? "default" : "pointer", opacity: idx === (settings.custom_sections?.length || 0) - 1 ? 0.5 : 1 }}><MoveDown size={14} /></button>

                      <button onClick={() => { setEditingSection({ ...sec }); setShowSectionForm(true); }}
                        style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--mango-100)", background: "var(--mango-50)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--mango-800)" }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={async () => {
                        if (confirm("Delete this section?")) {
                          const updated = { ...settings, custom_sections: (settings.custom_sections || []).filter(s => s.id !== sec.id) };
                          setSettings(updated);
                          await saveSettings(updated);
                          showToast("Section deleted.");
                        }
                      }}
                        style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #FFE0E0", background: "#FFF5F5", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#E53E3E" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--bark-900)", marginBottom: "24px" }}>
              Site Settings
            </h2>
            <div style={{ background: "var(--white)", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 20px var(--shadow-warm)", display: "flex", flexDirection: "column", gap: "20px" }}>
              {(
                [
                  { label: "Logo URL", key: "logo_url", type: "url", hint: "Paste a direct image link (JPG/PNG). Leave empty for default." },
                  { label: "Farm Name", key: "farm_name", type: "text" },
                  { label: "Tagline", key: "farm_tagline", type: "text" },
                  { label: "Location", key: "farm_location", type: "text" },
                  { label: "WhatsApp Number (with country code, no +)", key: "whatsapp_number", type: "text", hint: "e.g. 923001234567" },
                  { label: "Leopard Delivery Charge (Rs per box)", key: "delivery_charge", type: "number" },
                  { label: "Hero Image URL", key: "hero_image_url", type: "url", hint: "Paste a Cloudinary or direct image link" },
                  { label: "About Image URL", key: "about_image_url", type: "url", hint: "Paste an image link for the 'Our Story' section" },
                  { label: "About Subtitle", key: "about_subtitle", type: "text", hint: "e.g. 🌿 Our Story" },
                  { label: "About Title", key: "about_title", type: "textarea", hint: "Main heading of the about section" },
                  { label: "About Text", key: "about_text", type: "textarea" },
                  { label: "Years Farming", key: "years_farming", type: "text", hint: "e.g. 30+" },
                  { label: "Instagram URL", key: "instagram_url", type: "url" },
                  { label: "Facebook URL", key: "facebook_url", type: "url" },
                ] as { label: string; key: keyof SiteSettings; type: string; hint?: string }[]
              ).map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--bark-700)", display: "block", marginBottom: "4px" }}>
                    {field.label}
                  </label>
                  {field.hint && <p style={{ fontSize: "11px", color: "var(--bark-400)", marginBottom: "6px" }}>{field.hint}</p>}
                  {field.type === "textarea" ? (
                    <textarea id={`settings-${field.key}`}
                      value={settings[field.key] as string}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      rows={3}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "2px solid var(--cream-dark)", fontSize: "14px", color: "var(--bark-900)", background: "var(--cream)", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                  ) : (
                    <input id={`settings-${field.key}`} type={field.type}
                      value={settings[field.key] as string | number}
                      onChange={(e) => setSettings({ ...settings, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "2px solid var(--cream-dark)", fontSize: "14px", color: "var(--bark-900)", background: "var(--cream)", outline: "none" }} />
                  )}
                </div>
              ))}

              <button id="save-settings-btn" onClick={handleSaveSettings} className="btn-primary" style={{ alignSelf: "flex-start", padding: "14px 32px" }}>
                <Save size={16} /> Save All Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── PRODUCT FORM MODAL ── */}
      {showAddForm && editingProduct && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(29,20,10,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setShowAddForm(false)}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--white)", borderRadius: "28px", padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90svh", overflowY: "auto", boxShadow: "0 16px 64px rgba(61,43,31,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--bark-900)" }}>
                {products.find((p) => p.id === editingProduct.id) ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowAddForm(false)}
                style={{ background: "var(--cream-dark)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(
                [
                  { label: "Product Name", key: "name", type: "text", hint: "e.g. Sindhri Mango" },
                  { label: "Variety", key: "variety", type: "text", hint: "e.g. Sindhri" },
                  { label: "Description", key: "description", type: "textarea" },
                  { label: "Price per Box (Rs)", key: "price_per_box", type: "number" },
                  { label: "Primary Image URL (Cloudinary or direct link)", key: "image_url", type: "url" },
                  { label: "Origin", key: "origin", type: "text", hint: "e.g. Mirpurkhas, Sindh" },
                  { label: "Season", key: "season", type: "text", hint: "e.g. May – July" },
                  { label: "Taste Notes", key: "taste_notes", type: "text", hint: "e.g. Sweet, buttery" },
                ] as { label: string; key: keyof Product; type: string; hint?: string }[]
              ).map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--bark-700)", display: "block", marginBottom: field.hint ? "2px" : "5px" }}>{field.label}</label>
                  {field.hint && <p style={{ fontSize: "11px", color: "var(--bark-400)", marginBottom: "5px" }}>{field.hint}</p>}
                  {field.type === "textarea" ? (
                    <textarea id={`product-${field.key}`}
                      value={editingProduct[field.key] as string}
                      onChange={(e) => setEditingProduct({ ...editingProduct, [field.key]: e.target.value })}
                      rows={2}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "2px solid var(--cream-dark)", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                  ) : (
                    <input id={`product-${field.key}`} type={field.type}
                      value={editingProduct[field.key] as string | number}
                      onChange={(e) => setEditingProduct({ ...editingProduct, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "2px solid var(--cream-dark)", fontSize: "14px", outline: "none" }} />
                  )}
                </div>
              ))}

              {/* Additional Images */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--bark-700)", display: "block", marginBottom: "5px" }}>Additional Images</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(editingProduct.image_urls || []).map((url, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...(editingProduct.image_urls || [])];
                          newUrls[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, image_urls: newUrls });
                        }}
                        style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "2px solid var(--cream-dark)", fontSize: "14px", outline: "none" }}
                        placeholder="Image URL..."
                      />
                      <button
                        onClick={() => {
                          const newUrls = (editingProduct.image_urls || []).filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, image_urls: newUrls });
                        }}
                        style={{ padding: "0 12px", background: "#FFF5F5", color: "#E53E3E", border: "1px solid #FFE0E0", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newUrls = [...(editingProduct.image_urls || []), ""];
                      setEditingProduct({ ...editingProduct, image_urls: newUrls });
                    }}
                    style={{ alignSelf: "flex-start", fontSize: "12px", fontWeight: 600, color: "var(--leaf-700)", background: "var(--mango-50)", border: "1px solid var(--mango-100)", padding: "6px 12px", borderRadius: "50px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <Plus size={14} /> Add Image
                  </button>
                </div>
              </div>

              {/* Image preview */}
              {editingProduct.image_url && (
                <div style={{ borderRadius: "14px", overflow: "hidden", height: "140px", position: "relative" }}>
                  <Image src={editingProduct.image_url} alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    sizes="100%"
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                  <div style={{
                    width: "42px", height: "24px", borderRadius: "20px", position: "relative",
                    background: editingProduct.in_stock ? "var(--leaf-600)" : "var(--bark-300)",
                    transition: "background 0.3s ease", flexShrink: 0
                  }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%", background: "var(--white)",
                      position: "absolute", top: "2px", left: editingProduct.in_stock ? "20px" : "2px",
                      transition: "left 0.3s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }} />
                  </div>
                  <input id="product-in_stock" type="checkbox" checked={editingProduct.in_stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.checked })}
                    style={{ display: "none" }} />
                  In Stock
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                  <div style={{
                    width: "42px", height: "24px", borderRadius: "20px", position: "relative",
                    background: editingProduct.featured ? "var(--mango-600)" : "var(--bark-300)",
                    transition: "background 0.3s ease", flexShrink: 0
                  }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%", background: "var(--white)",
                      position: "absolute", top: "2px", left: editingProduct.featured ? "20px" : "2px",
                      transition: "left 0.3s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }} />
                  </div>
                  <input id="product-featured" type="checkbox" checked={editingProduct.featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    style={{ display: "none" }} />
                  Featured
                </label>
              </div>

              <button id="save-product-btn" onClick={() => handleSaveProduct(editingProduct)}
                className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <Save size={16} />
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION FORM MODAL ── */}
      {showSectionForm && editingSection && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(29,20,10,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setShowSectionForm(false)}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--white)", borderRadius: "28px", padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90svh", overflowY: "auto", boxShadow: "0 16px 64px rgba(61,43,31,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--bark-900)" }}>
                {settings.custom_sections?.find(s => s.id === editingSection.id) ? "Edit Section" : "Add New Section"}
              </h3>
              <button onClick={() => setShowSectionForm(false)}
                style={{ background: "var(--cream-dark)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(
                [
                  { label: "Image URL", key: "image_url", type: "url", hint: "Direct image link (JPG/PNG)" },
                  { label: "Subtitle", key: "subtitle", type: "text", hint: "Small text above title" },
                  { label: "Title", key: "title", type: "text", hint: "Main heading" },
                  { label: "Content Text", key: "text", type: "textarea", hint: "Paragraph text" },
                ] as { label: string; key: keyof CustomSection; type: string; hint?: string }[]
              ).map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--bark-700)", display: "block", marginBottom: field.hint ? "2px" : "5px" }}>{field.label}</label>
                  {field.hint && <p style={{ fontSize: "11px", color: "var(--bark-400)", marginBottom: "5px" }}>{field.hint}</p>}
                  {field.type === "textarea" ? (
                    <textarea value={editingSection[field.key] as string}
                      onChange={(e) => setEditingSection({ ...editingSection, [field.key]: e.target.value })}
                      rows={4}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "2px solid var(--cream-dark)", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                  ) : (
                    <input type={field.type}
                      value={editingSection[field.key] as string}
                      onChange={(e) => setEditingSection({ ...editingSection, [field.key]: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "2px solid var(--cream-dark)", fontSize: "14px", outline: "none" }} />
                  )}
                </div>
              ))}

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--bark-700)", display: "block", marginBottom: "5px" }}>Image Position</label>
                <select value={editingSection.image_position} onChange={(e) => setEditingSection({ ...editingSection, image_position: e.target.value as "left" | "right" })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "2px solid var(--cream-dark)", fontSize: "14px", outline: "none", background: "var(--white)" }}>
                  <option value="left">Image on Left</option>
                  <option value="right">Image on Right</option>
                </select>
              </div>

              {editingSection.image_url && (
                <div style={{ borderRadius: "14px", overflow: "hidden", height: "140px", position: "relative", background: "var(--cream-dark)" }}>
                  <Image src={editingSection.image_url} alt="Preview" fill style={{ objectFit: "cover" }} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                </div>
              )}

              <button onClick={async () => {
                if (!editingSection.title) return showError("Title is required");
                const newSections = [...(settings.custom_sections || [])];
                const existingIdx = newSections.findIndex(s => s.id === editingSection.id);
                if (existingIdx >= 0) newSections[existingIdx] = editingSection;
                else newSections.push(editingSection);
                
                const updated = { ...settings, custom_sections: newSections };
                setSettings(updated);
                setShowSectionForm(false);
                try {
                  await saveSettings(updated);
                  showToast(existingIdx >= 0 ? "Section updated." : "Section added.");
                } catch (e) {
                  showError(`Failed to save: ${(e as Error).message}`);
                }
              }} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
                <Save size={16} /> Save Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
