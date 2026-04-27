import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trash2, Edit, Plus, X } from "lucide-react";
import "./AdminLayout.css";

interface AdminLayoutProps {
  products: any[];
  settings: any;
  onAddProduct: (product: any) => void;
  onEditProduct: (id: string, product: any) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateSettings: (settings: any) => void;
}

export default function AdminLayout({
  products,
  settings,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateSettings,
}: AdminLayoutProps) {
  const location = useLocation();
  const tabs = [
    { path: "/admin/products", label: "Products" },
    { path: "/admin/settings", label: "Settings" },
  ];

  const currentTab = location.pathname === "/admin/settings" ? "settings" : "products";

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <Link to="/admin" className="admin-logo">
            <span className="logo-text">Mango</span>
            <span className="logo-accent">Admin</span>
          </Link>
          <Link to="/" className="view-site-btn" target="_blank">
            View Site →
          </Link>
        </div>
      </header>

      <nav className="admin-nav">
        <div className="admin-nav-content">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`nav-tab ${
                location.pathname === tab.path ? "active" : ""
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="admin-main">
        {currentTab === "products" ? (
          <ProductsTab
            products={products}
            onAdd={onAddProduct}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
          />
        ) : (
          <SettingsTab settings={settings} onSave={onUpdateSettings} />
        )}
      </main>
    </div>
  );
}

function ProductsTab({ products, onAdd, onEdit, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: 0,
    originalPrice: 0,
    image: "",
    images: [] as string[],
    description: "",
    category: "",
    inStock: true,
    featured: false,
    unit: "10kg box",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      onEdit(editing.id, form);
    } else {
      onAdd({ ...form, id: Date.now().toString() });
    }
    setShowForm(false);
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      price: 0,
      originalPrice: 0,
      image: "",
      images: [],
      description: "",
      category: "",
      inStock: true,
      featured: false,
      unit: "10kg box",
    });
  };

  const handleEdit = (p: any) => {
    setForm(p);
    setEditing(p);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="admin-tab-content">
      <div className="page-header">
        <h1>Products ({products.length})</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setForm({
              name: "",
              slug: "",
              price: 0,
              originalPrice: 0,
              image: "",
              images: [],
              description: "",
              category: "",
              inStock: true,
              featured: false,
              unit: "10kg box",
            });
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="btn-icon" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="product-form" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h2>{editing ? "Edit Product" : "Add Product"}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <X className="close-icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm({ ...form, originalPrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />
                </div>
                <div className="form-group full">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value, images: [e.target.value] })
                    }
                  />
                </div>
                <div className="form-group full">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="form-group full">
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={form.inStock}
                        onChange={(e) =>
                          setForm({ ...form, inStock: e.target.checked })
                        }
                      />
                      In Stock
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                          setForm({ ...form, featured: e.target.checked })
                        }
                      />
                      Featured
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editing ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt="" className="product-thumb" />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>Rs. {p.price.toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      p.inStock ? "badge-success" : "badge-danger"
                    }`}
                  >
                    {p.inStock ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" onClick={() => handleEdit(p)}>
                      <Edit className="action-icon" />
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={() => setDeleteConfirm(p.id)}
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsTab({ settings, onSave }: any) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-tab-content">
      <div className="page-header">
        <h1>Site Settings</h1>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-section">
          <h2>General</h2>
          <div className="form-group">
            <label>Site Title</label>
            <input
              type="text"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Order Settings</h2>
          <div className="form-group">
            <label>Delivery Fee (Rs.)</label>
            <input
              type="number"
              value={form.deliveryFee}
              onChange={(e) =>
                setForm({ ...form, deliveryFee: Number(e.target.value) })
              }
            />
          </div>
          <div className="form-group">
            <label>WhatsApp Number (with country code)</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) =>
                setForm({ ...form, whatsappNumber: e.target.value })
              }
              placeholder="923001234567"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>About Section</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={form.aboutTitle}
              onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Text</label>
            <textarea
              value={form.aboutText}
              onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}