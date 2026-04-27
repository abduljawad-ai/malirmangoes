# Admin Panel - Specification

## 1. Acceptance Criteria

- [ ] Admin panel accessible at /admin route
- [ ] Product list with CRUD operations
- [ ] Product add/edit form with all fields
- [ ] Product delete with confirmation
- [ ] Site settings (delivery fee, WhatsApp number, about text)
- [ ] Settings auto-save to localStorage
- [ ] Changes reflect immediately on main site

## 2. Admin Panel Features

### Products Management
- List all products in table/grid
- Add new product button
- Edit product (click row)
- Delete product (with confirmation)
- Toggle inStock / featured
- Image URL input with preview

### Site Settings
- Delivery fee (Rs.)
- WhatsApp number
- About section text
- Site title

### Route
- /admin - Dashboard (redirect to /admin/products)

## 3. Data Structure

```typescript
interface SiteData {
  products: Product[];
  settings: {
    deliveryFee: number;
    whatsappNumber: string;
    aboutTitle: string;
    aboutText: string;
    siteTitle: string;
  };
}
```

## 4. Tech Stack
- React Router for routing
- Same styling as main site
- localStorage for persistence
- Load from localStorage first, fallback to defaults