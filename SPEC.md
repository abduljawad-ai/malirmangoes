# Mango Store - Specification Document

## 1. Project Overview

**Project Name:** MangoStore  
**Type:** E-commerce Product Showcase (Vite + React + TypeScript)  
**Core Functionality:** Showcase mango products with WhatsApp ordering - customers select products, add to cart (10kg boxes), checkout sends pre-filled WhatsApp message  
**Target Users:** Pakistani mango buyers

---

## 2. Acceptance Criteria (DoD)

- [ ] Home page displays featured mango products with images, names, prices
- [ ] Product detail shows full description, images, pricing
- [ ] Cart system adds 10kg boxes only
- [ ] Delivery charges: Flat Rs. 400 per order
- [ ] WhatsApp checkout button opens wa.me with pre-filled order message
- [ ] Order message includes: products, quantities, total, delivery address input
- [ ] Mobile responsive design
- [ ] Dev server runs without errors

---

## 3. UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────┐
│ HEADER (logo + cart icon)             │
├─────────────────────────────────────┤
│ HERO (mango image + tagline + CTA)  │
├─────────────────────────────────────┤
│ FEATURED PRODUCTS grid              │
├─────────────────────────────────────┤
│ ABOUT section                      │
├─────────────────────────────────────┤
│ FOOTER                            │
└─────────────────────────────────────┘
```

### Responsive Breakpoints

- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

### Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Primary | `#F59E0B` (amber-500) | Buttons, highlights |
| Primary Dark | `#D97706` (amber-600) | Button hover |
| Secondary | `#10B981` (emerald-500) | Success, stock status |
| Background | `#FFFBF5` (warm cream) | Page background |
| Surface | `#FFFFFF` | Cards, modals |
| Text Primary | `#1F2937` (gray-800) | Headings |
| Text Secondary | `#6B7280` (gray-500) | Body text |
| Border | `#E5E7EB` (gray-200) | Dividers |

### Typography

- Heading Font: **DM Sans** (Google Fonts) - Bold
- Body Font: **DM Sans** - Regular
- Heading Sizes: H1: 48px, H2: 32px, H3: 24px
- Body: 16px, Small: 14px

### Spacing System

- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px

### Components

#### Header
- Logo text: "MangoStore" in DM Sans Bold
- Cart icon with item count badge
- Sticky on scroll

#### Product Card
- Rounded corners: 16px
- Image aspect ratio: 1:1
- Hover: scale(1.02), shadow increase
- Price in bold, original price strikethrough if discounted
- "Add to Cart" button

#### Cart Sidebar/Drawer
- Slides in from right
- Lists items with quantity controls
- Shows: Subtotal, Delivery (Rs.400), Total
- "Order via WhatsApp" button

#### WhatsApp Button
- Green background: `#25D366`
- White text + WhatsApp icon
- Opens: `https://wa.me/923283181163?text={prefilled}`

#### Order Message Format
```
🛒 New Order from MangoStore

📦 Items:
- Sindhri Premium x 2 (10kg box) = Rs. 3000
- Chaunsa Special x 1 (10kg box) = Rs. 1800

💰 Subtotal: Rs. 4800
🚚 Delivery: Rs. 400
💵 Total: Rs. 5200

📍 Delivery Address:
[User enters address]

👤 Customer Name:
👤 Phone:
```

---

## 4. Data Structure

### Product

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;        // per 10kg box
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  unit: "10kg box";
}
```

### Cart Item

```typescript
interface CartItem {
  product: Product;
  quantity: number;
}
```

### Cart

```typescript
interface Cart {
  items: CartItem[];
  subtotal: number;
  delivery: number;  // always 400
  total: number;
}
```

---

## 5. Functionality Specification

### Core Features

1. **Product Display**
   - Featured products on home
   - Click product → detail modal/page
   - Show stock status

2. **Cart Management**
   - Add to cart (quantity 1-10)
   - Update quantity in cart
   - Remove from cart
   - Cart persists in localStorage

3. **Delivery Calculation**
   - Always Rs. 400 flat
   - Free if we want: orders above Rs. X (future)

4. **WhatsApp Checkout**
   - Generate pre-filled message
   - Open wa.me link
   - Include all order details

### User Flow

```
1. User lands on home
2. Scrolls featured products
3. Clicks product → sees details
4. Clicks "Add to Cart"
5. Opens cart drawer
6. Reviews items
7. Enters delivery address (in text area before checkout)
8. Clicks "Order via WhatsApp"
9. WhatsApp opens with pre-filled order
10. User sends message
```

---

## 6. Technical Stack

- **Framework:** Vite 5 + React 19
- **Language:** TypeScript
- **Styling:** CSS Modules or vanilla CSS with CSS variables
- **State:** React useState + useReducer (or Zustand if needed)
- **Storage:** localStorage for cart
- **Icons:** Lucide React
- **Build:** No errors, no warnings (eslint)

---

## 7. File Structure

```
mango-store/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── lib/
    │   └── products.ts
    └── components/
        ├── Header.tsx
        ├── Hero.tsx
        ├── ProductGrid.tsx
        ├── ProductCard.tsx
        ├── ProductModal.tsx
        ├── CartDrawer.tsx
        ├── WhatsAppButton.tsx
        ├── About.tsx
        └── Footer.tsx
```

---

## 8. WhatsApp Configuration

**Number:** 923283181163 (country code 92 for Pakistan)  
**wa.me Link:** `https://wa.me/923283181163?text=`

---

## 9. Acceptance Test Commands

```bash
# Dev server starts without errors
npm run dev

# Browser displays home page
# Products render with images
# Cart add/remove works
# WhatsApp link opens with correct message format
```