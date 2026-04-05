# PROJECT COMPLETE STRUCTURE MAP

This file documents every single file in the project, what components it uses, what happens on clicks, and how everything connects.

---

## FILE 1: app/layout.tsx (ROOT LAYOUT)
**Path:** `/app/layout.tsx`
**Type:** Root layout (wraps ALL pages)
**Purpose:** The outermost wrapper for the entire application. Every page passes through here.

### Components Used:
- `LayoutProvider` (from `@/components/layout/LayoutContext`) — Provides `hideNavbar`/`hideFooter` state to all children
- `Providers` (from `@/components/layout/Providers`) — Wraps Firebase, Auth, Cart, Toaster
- `Navbar` (from `@/components/layout/Navbar`) — Top navigation bar with hamburger menu, logo, nav links, cart, sign in/profile
- `ChatWidget` (from `@/components/chat/ChatWidget`) — Floating chat bubble on bottom-right (user-side only)
- `Footer` (from `@/components/layout/Footer`) — Site footer with links, newsletter, social icons

### Layout Structure:
```
<html>
  <body>
    <LayoutProvider>
      <Providers>
        <Navbar />                    ← Always rendered (unless hideNavbar=true)
        <main className="flex-grow">  ← Page content injected here via {children}
          {children}
        </main>
        <ChatWidget />                ← Always rendered
        <Footer />                    ← Always rendered (unless hideFooter=true)
      </Providers>
    </LayoutProvider>
  </body>
</html>
```

### Click Behavior (from this file):
- No direct click handlers — this file just positions the components
- Child components (Navbar, Footer, ChatWidget) handle their own clicks

### Key Details:
- `main` has `flex-grow` — pushes footer to bottom when content is short
- `Navbar` is rendered BEFORE `{children}` — appears at top
- `Footer` is rendered AFTER `{children}` — appears at bottom
- `ChatWidget` is rendered after main, before footer — floating widget
- Admin and customer layouts set `hideNavbar=true` and `hideFooter=true` to hide these

**Status:** ✅ Reviewed

---

## FILE 2: app/page.tsx (USER HOME PAGE)
**Path:** `/app/page.tsx`
**Type:** Client component — User landing/home page
**Purpose:** The main storefront. Shows hero carousel, features, featured products, all products, why-choose-us section, and CTA.

### Components/Hooks Used:
- `ProductCard` (from `@/components/products/ProductCard`) — Renders individual product cards
- `useProducts` (from `@/hooks/useProducts`) — Fetches products from RTDB
- `useSettings` (from `@/hooks/useSettings`) — Fetches store settings from RTDB
- `Button` (from `@/components/ui/Button`) — Reusable button component
- `ProductGridSkeleton` (from `@/components/ui/Skeleton`) — Loading skeleton for product grids
- `framer-motion` — Animations (carousel, fade-in on scroll)
- `lucide-react` icons: ArrowRight, Truck, Shield, Leaf, Star, Play

### Sections (top to bottom):

#### 1. Hero Carousel (responsive height: 70vh on mobile, 85vh on desktop)
- Reads slides from `settings.carouselImages` (Firestore `settings/site` → `carouselImages` array)
- Each slide: `{ src, name, tagline, color }` → mapped to `{ image, tagline, title, highlight, subtitle, cta }`
- **Fallback:** 4 hardcoded Cloudinary slides shown while settings are loading or if RTDB has no carousel data
- Auto-rotates every 4 seconds (pauses if only 1 slide)
- Title uses `name` from settings; falls back to `tagline` for mango-colored highlight if `highlight` is empty
- **Click: Slide indicators (dots)** → Jumps to that slide, resets timer
- **Click: "Shop Now" / "Order Chaunsa" / "View Boxes" / "Shop Ratol" button** → Redirects to `/products`
- **Click: "Contact Us" button** → Redirects to `/chat`

#### 2. Features Bar (4 icons)
- Farm Fresh, Fast Delivery, Quality Guarantee, Premium Quality
- Static display — no click handlers

#### 3. Featured Products (up to 4 products)
- Filters products where `isFeatured === true`, shows first 4
- Each product rendered as `ProductCard`
- **Click: Any ProductCard** → Redirects to `/products/[slug]` (handled inside ProductCard)
- **Click: "View All" link** → Redirects to `/products` (visible on all screen sizes)

#### 4. Why Choose Us (3 cards with images)
- Direct from Farm, Hand-Selected Quality, Safe Delivery
- Static display — no click handlers (just images + text)

#### 5. All Products (up to 8 products)
- Shows first 8 active products
- Each product rendered as `ProductCard`
- **Click: Any ProductCard** → Redirects to `/products/[slug]`
- **Click: "View All Products" button** (only if > 8 products) → Redirects to `/products`

#### 6. CTA Section (dark background)
- **Click: "Start Shopping" button** → Redirects to `/products`
- **Click: "Talk to Us" button** → Redirects to `/chat`

### Data Flow:
- `useProducts()` → Fetches from RTDB `/products` path
- `useSettings()` → Fetches from Firestore `settings/site` document
- `carouselSlides = settings.carouselImages` → mapped to slide format (fallback to hardcoded slides if not loaded)
- `featured = products.filter(p => p.isFeatured).slice(0, 4)`
- `allProducts = products.filter(p => p.isActive && !featured.find(f => f.id === p.id))` — excludes featured products to prevent duplicates

**Status:** ✅ Reviewed

---

## FILE 3: components/layout/Navbar.tsx
**Path:** `/components/layout/Navbar.tsx`
**Type:** Client component — Main navigation bar (user-facing pages)
**Purpose:** Sticky top header with hamburger menu, logo, desktop nav links, cart button, chat link, and sign-in/profile. Shown on all user-facing pages (hidden on admin/customer pages via `hideNavbar`).

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `user`, `isAdmin`, `loading` state
- `useCart` (from `@/hooks/useCart`) — Gets `totalItems`, `toggleCart` function
- `useChatUnreadCount` (from `@/hooks/useChatUnreadCount`) — Gets unread chat message count
- `useLayout` (from `./LayoutContext`) — Gets `hideNavbar` to conditionally render
- `MobileMenu` (from `./MobileMenu`) — Slide-in drawer menu

### Layout Structure:
```
<header sticky top-0 z-40>
  [Left]  Hamburger button + Logo (link to /)
  [Center] Desktop nav links: Home, Products, Cart (hidden on mobile)
  [Right] Cart icon (mobile only) + Chat link (desktop, if logged in) + Profile/Sign In
</header>
<MobileMenu open={isMobileMenuOpen} />
```

### Click Behavior (every clickable element):

1. **Hamburger button (☰, top-left)** → Opens `MobileMenu` drawer (slide-in from LEFT)
2. **Logo ("MangoStore")** → Redirects to `/` (home page)
3. **Home link (desktop)** → Redirects to `/`
4. **Products link (desktop)** → Redirects to `/products`
5. **Cart button (desktop)** → Calls `toggleCart()` → Opens CartDrawer (slide-up cart panel)
6. **Cart icon (mobile, top-right)** → Calls `toggleCart()` → Opens CartDrawer
7. **Chat link (desktop, only if logged in)** → Redirects to `/chat`
8. **Profile avatar (circle with initial, if logged in)** → Redirects to `/admin` (if admin) or `/customer` (if regular user)
9. **Sign In link (if not logged in)** → Redirects to `/login`
10. **MobileMenu items** → Handled inside MobileMenu component

### Conditional Rendering:
- If `hideNavbar === true` → Returns `null` (hidden on admin/customer pages)
- Desktop nav links (`hidden md:flex`) → Only visible on medium+ screens
- Mobile cart icon (`md:hidden`) → Only visible on small screens
- Chat link → Only shown if user is logged in
- Profile avatar → Shown if logged in; "Sign In" link shown if not logged in
- Profile links to `/admin` for admins, `/customer` for regular users

### Note:
- "Search" link was removed from navItems. Users access product search via the Products page.

**Status:** ✅ Reviewed

---

## FILE 4: components/layout/MobileMenu.tsx
**Path:** `/components/layout/MobileMenu.tsx`
**Type:** Client component — Slide-in drawer menu (opens from LEFT)
**Purpose:** Overlay navigation drawer that slides in from the left side when hamburger menu is clicked. Shows different links based on user role (admin vs customer vs guest).

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `user`, `isAdmin`, `logout` function
- `Link` (from `next/link`) — Navigation links

### Props:
- `open: boolean` — Controls visibility
- `onClose: () => void` — Callback to close the drawer

### Layout Structure:
```
[Backdrop overlay] (click to close)
[Drawer panel - fixed left, w-72, slides from left]
  └─ Header: "Menu" title + X close button
  └─ User section:
     - If logged in: Avatar + Name + Email
     - If guest: "Sign In" button → /login
  └─ Main links (always shown): Home, Products
  └─ If admin: "Go to Admin Panel" button → /admin
  └─ Customer links (if logged in): Chat, My Orders, Profile
  └─ Sign Out button (if logged in)
```

### Click Behavior (every clickable element):

1. **Backdrop overlay** → Calls `onClose()` → Closes drawer
2. **X close button** → Calls `onClose()` → Closes drawer
3. **Sign In button (guest only)** → Redirects to `/login`, then closes drawer
4. **Home link** → Redirects to `/`, then closes drawer
5. **Products link** → Redirects to `/products`, then closes drawer
6. **"Go to Admin Panel" button (admin only)** → Redirects to `/admin`, then closes drawer
7. **Customer links (if not admin):**
   - Chat → `/chat`
   - My Orders → `/customer`
   - Profile → `/customer/profile`
8. **Sign Out button** → Calls `logout()` then `onClose()` → Logs out and closes drawer

### Conditional Rendering:
- If `open === false` → Returns `null` (not rendered)
- User section: Shows avatar+name+email if logged in, "Sign In" button if guest
- Role links: Shows adminLinks if `isAdmin === true`, customerLinks otherwise
- Sign Out: Only shown if logged in

**Status:** ✅ Reviewed

---

## FILE 5: components/layout/LayoutContext.tsx
**Path:** `/components/layout/LayoutContext.tsx`
**Type:** Client component — React Context for layout visibility
**Purpose:** Provides global state to show/hide Navbar and Footer. Used by admin and customer layouts to hide the main site navigation.

### Exports:
- `LayoutProvider` — Wraps the app, provides `hideNavbar`/`hideFooter` state
- `useLayout` — Hook to consume the context

### State:
- `hideNavbar: boolean` (default: `false`) — When `true`, Navbar returns `null`
- `hideFooter: boolean` (default: `false`) — When `true`, Footer returns `null`

### Who uses this:
- `app/layout.tsx` — Creates the `LayoutProvider` wrapper
- `components/layout/Navbar.tsx` — Reads `hideNavbar`, returns `null` if true
- `components/layout/Footer.tsx` — Reads `hideFooter`, returns `null` if true
- `app/admin/layout.tsx` — Sets `hideNavbar(true)` and `hideFooter(true)` on mount
- `app/(public)/customer/layout.tsx` — Sets `hideNavbar(true)` and `hideFooter(true)` on mount

### No click handlers — pure state management

**Status:** ✅ Reviewed

---

## FILE 6: components/layout/Footer.tsx
**Path:** `/components/layout/Footer.tsx`
**Type:** Client component — Site footer
**Purpose:** Displays brand info, shop links, and contact info. Hidden on admin/customer pages via `hideFooter`.

### Components/Hooks Used:
- `useLayout` (from `./LayoutContext`) — Gets `hideFooter` to conditionally render
- `Link` (from `next/link`) — Navigation links

### Layout Structure:
```
<footer bg-slate-900 mt-auto>
  └─ 3-column grid:
     - Brand: Logo + description
     - Shop: All Products, Chaunsa, Sindhri, Anwar Ratol
     - Contact: Address, Phone, Email
  └─ Bottom bar: Copyright
</footer>
```

### Click Behavior (every clickable element):

1. **Logo ("MangoStore")** → Redirects to `/`
2. **Shop links:**
   - All Products → `/products`
   - Chaunsa → `/products?category=chaunsa`
   - Sindhri → `/products?category=sindhri`
   - Anwar Ratol → `/products?category=anwar-ratol`

### Removed (cleaned up dead links):
- Newsletter subscribe section (fake functionality removed)
- Social icons (all were `#` placeholders)
- Support links (Shipping Info, Returns, FAQ — all `#` placeholders)
- Company links (About Us, Our Orchards, Contact — all `#` placeholders)
- Privacy/Terms links (no pages exist yet)
- Contact section moved into main grid instead of separate bar

### Conditional Rendering:
- If `hideFooter === true` → Returns `null` (hidden on admin/customer pages)

**Status:** ✅ Reviewed

---

## FILE 7: components/layout/Providers.tsx
**Path:** `/components/layout/Providers.tsx`
**Type:** Server component (no 'use client') — Provider wrapper
**Purpose:** Wraps the entire app with all necessary providers: ErrorBoundary, AuthProvider, CartProvider, CartDrawer, and Toaster notifications.

### Components Used:
- `ErrorBoundary` (from `@/components/ErrorBoundary`) — Catches React errors, shows fallback UI
- `AuthProvider` (from `@/hooks/useAuth`) — Firebase auth context provider
- `CartProvider` (from `@/hooks/useCart`) — Shopping cart context provider
- `CartDrawer` (from `@/components/cart/CartDrawer`) — Slide-up cart panel
- `Toaster` (from `react-hot-toast`) — Toast notification system

### Provider Nesting Order (outer to inner):
```
<ErrorBoundary>
  <AuthProvider>
    <CartProvider>
      {children}          ← Page content
      <CartDrawer />      ← Cart slide-up panel (available everywhere)
      <Toaster />         ← Toast notifications (bottom-right, dark theme)
    </CartProvider>
  </AuthProvider>
</ErrorBoundary>
```

### Toaster Configuration:
- Position: bottom-right
- Duration: 3 seconds
- Style: Dark background (#011627), light text (#FDFFFC), 12px border radius
- Success icon: Teal (#2EC4B6)
- Error icon: Red (#EF4444)

### No click handlers — pure wrapper component

**Status:** ✅ Reviewed

---

## FILE 8: app/admin/layout.tsx
**Path:** `/app/admin/layout.tsx`
**Type:** Client component — Admin area layout wrapper
**Purpose:** Wraps ALL admin pages (`/admin`, `/admin/products`, `/admin/orders`, etc.). Provides sidebar navigation, top bar with menu toggle, and protects against non-admin access.

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `user`, `loading`, `isAdmin`, `logout`
- `useLayout` (from `@/components/layout/LayoutContext`) — Calls `setHideNavbar(true)` and `setHideFooter(true)` to hide main site navbar/footer
- `useAdminChats` (from `@/hooks/useAdminChats`) — Gets `totalUnread` for chat badge
- `usePathname` (from `next/navigation`) — Highlights active nav item
- `useRouter` (from `next/navigation`) — Redirects non-admins to `/login`

### Layout Structure:
```
<div flex min-h-screen>
  [Mobile Backdrop overlay] (click to close sidebar)
  [Sidebar - fixed left, w-60]
    └─ Header: Logo "M Admin" + X close button (mobile only)
    └─ Nav links: Overview, Products, Orders, Customers, Live Chat (with unread badge), Reports, Settings
    └─ User section: Avatar + Name + Email + Sign Out + Visit Store icon
   [Main content area]
     └─ Top bar: Hamburger menu button (top-left)
     └─ Page content: {children}
</div>
```

### Click Behavior (every clickable element):

1. **Mobile backdrop overlay** → Calls `setSidebarOpen(false)` → Closes sidebar
2. **X close button in sidebar header (mobile only)** → Calls `setSidebarOpen(false)` → Closes sidebar
 3. **Sidebar nav links (7 links):**
   - Overview → `/admin`
   - Products → `/admin/products`
   - Orders → `/admin/orders`
   - Customers → `/admin/customers`
   - Live Chat → `/admin/chat` (shows red unread badge if `totalUnread > 0`)
   - Reports → `/admin/reports`
   - Settings → `/admin/settings`
   - All links call `setSidebarOpen(false)` after click (closes sidebar on mobile)
 4. **Sign Out button** → Calls `logout()` → Logs out user
 5. **Visit Store icon (Store icon in sidebar footer)** → Redirects to `/` (user-facing homepage)
 6. **Hamburger menu button (top bar, top-left)** → Calls `setSidebarOpen(true)` → Opens sidebar

### Conditional Rendering:
- If `loading || !user || !isAdmin` → Shows spinner, then redirects to `/login?redirect=/admin`
- Sidebar: Hidden on mobile (`-translate-x-full`), always visible on desktop (`lg:translate-x-0`)
- X close button: Only visible on mobile (`lg:hidden`)
- Live Chat badge: Only shown if `totalUnread > 0`
- Active nav item: Highlighted with `bg-mango-50 text-mango` when `pathname === item.href`

### Auth Guard:
- Redirects to `/login?redirect=/admin` if user is not logged in or not an admin

**Status:** ✅ Reviewed

---

## FILE 9: app/admin/page.tsx
**Path:** `/app/admin/page.tsx`
**Type:** Client component — Admin Dashboard (landing page)
**Purpose:** Admin overview showing store stats (revenue, orders, products, customers), quick action buttons, and recent orders table.

### Components/Hooks Used:
- `useProducts` (from `@/hooks/useProducts`) — Fetches products from RTDB
- `useUsers` (from `@/hooks/useUsers`) — Fetches users from RTDB
- `useAdminOrders` (from `@/hooks/useAdminOrders`) — Fetches all orders from RTDB
- `Badge`, `OrderStatusBadge` (from `@/components/ui/Badge`) — Status badges for orders
- `StatCardSkeleton`, `ProductGridSkeleton` (from `@/components/ui/Skeleton`) — Loading skeletons
- `Button` (from `@/components/ui/Button`) — Quick action buttons
- `Link` (from `next/link`) — Navigation links

### Data Computed:
- `totalRevenue` = Sum of all orders where `paymentStatus === 'Verified'`
- `activeProductsCount` = Count of products where `isActive === true`
- `pendingOrders` = Count of orders where `orderStatus === 'Pending'`

### Sections (top to bottom):

#### 1. Header
- Title: "Dashboard"
- **Click: "{pendingOrders} pending" button** (only if pendingOrders > 0) → Redirects to `/admin/orders`

#### 2. Stats Cards (4 cards)
- Revenue (total verified revenue)
- Orders (total order count)
- Products (active product count)
- Customers (total user count)
- Static display — no click handlers

#### 3. Quick Actions (3 buttons)
- **Click: "Manage Products"** → Redirects to `/admin/products`
- **Click: "Process Orders"** → Redirects to `/admin/orders`
- **Click: "Store Settings"** → Redirects to `/admin/settings`

#### 4. Recent Orders Table (up to 5 orders)
- Shows: Order ID, Date, Customer name, Total, Status badge, View link
- **Click: Any order row** → Redirects to `/admin/orders`
- **Click: "View" link** → Redirects to `/admin/orders`
- **Click: "View All" link** → Redirects to `/admin/orders`

**Status:** ✅ Reviewed

---

## FILE 10: app/admin/products/page.tsx
**Path:** `/app/admin/products/page.tsx`
**Type:** Client component — Admin Products management page
**Purpose:** Table view of all products with search, category filter, add/edit/delete functionality. Opens ProductModal for creating/editing products.

### Components/Hooks Used:
- `useProducts` (from `@/hooks/useProducts`) — Fetches products, supports category filter, provides `refresh()`
- `ProductModal` (from `./ProductModal`) — Modal form for adding/editing products
- `Button` (from `@/components/ui/Button`) — Action buttons
- `Badge` (from `@/components/ui/Badge`) — Category badges
- `Image` (from `next/image`) — Product thumbnails
- `ref, remove` (from `firebase/database`) — Deletes products from RTDB
- `rtdb` (from `@/lib/firebase`) — RTDB instance
- `toast` (from `react-hot-toast`) — Success/error notifications

### State:
- `searchTerm` — Filters products by name
- `categoryFilter` — Filters products by category (all, chaunsa, sindhri, anwar-ratol, langra)
- `isModalOpen` — Controls ProductModal visibility
- `selectedProduct` — Product being edited (null = adding new)

### Click Behavior (every clickable element):

1. **Click: "Add Product" button** → Calls `handleAddNew()`:
   - Sets `selectedProduct = null` (new mode)
   - Opens ProductModal
2. **Click: Search input** → Types to filter products by name (client-side)
3. **Click: Category dropdown** → Changes `categoryFilter` → Re-fetches products filtered by category
4. **Click: Edit icon (pencil) on a product row** → Calls `handleEdit(product)`:
   - Sets `selectedProduct = product` (edit mode)
   - Opens ProductModal
5. **Click: Delete icon (trash) on a product row** → Sets `confirmDeleteId` → Shows inline confirmation row below:
   - Shows message: "Are you sure you want to delete '{name}'?"
   - **Click: "Cancel"** → Clears `confirmDeleteId` → Hides confirmation
   - **Click: "Delete"** → Calls `handleDelete(id)` → Removes product from RTDB, shows toast, refreshes list
6. **Click: "Reset Filters" button** (shown when no products found) → Clears `searchTerm` and `categoryFilter`
7. **ProductModal interactions** → Handled inside ProductModal component

### Data Flow:
- `filteredProducts = products.filter(p => p.name.includes(searchTerm))` — client-side name search
- `useProducts({ category })` — fetches from RTDB, optionally filtered by category
- Delete: `remove(ref(rtdb, 'products/{id}'))` — direct RTDB deletion

**Status:** ✅ Reviewed

---

## FILE 11: app/admin/products/ProductModal.tsx
**Path:** `/app/admin/products/ProductModal.tsx`
**Type:** Client component — Product create/edit modal
**Purpose:** Modal form for adding new products or editing existing ones. Handles form validation, image upload, and RTDB write operations.

### Components/Hooks Used:
- `Product` (from `@/types`) — TypeScript interface for product data
- `Button` (from `@/components/ui/Button`) — Cancel and Submit buttons
- `Input` (from `@/components/ui/Input`) — Text/number input fields
- `Textarea` (from `@/components/ui/Textarea`) — Description field
- `ImageUpload` (from `@/components/ui/ImageUpload`) — Image upload component (uploads to Cloudinary via API)
- `ref, set, push, update` (from `firebase/database`) — RTDB write operations
- `rtdb` (from `@/lib/firebase`) — RTDB instance
- `toast` (from `react-hot-toast`) — Success/error notifications

### Props:
- `product?: Product | null` — If provided, edit mode; if null, create mode
- `isOpen: boolean` — Controls modal visibility
- `onClose: () => void` — Callback to close modal
- `onSuccess: () => void` — Callback after successful save (triggers product list refresh)

### Form Fields:
- Product Name (text, required) — Auto-generates slug from name
- Slug (text, required) — URL-friendly identifier
- Price (number, required) — Must be > 0
- Sale Price (number, optional) — Discounted price
- Category (dropdown) — chaunsa, sindhri, anwar-ratol, langra, dasheri
- Stock (number, required) — Must be >= 0
- Box Weight (number, required) — Weight in kg
- Description (textarea, required)
- Product Image (via ImageUpload component)
- Visible on store (checkbox) — `isActive`
- Feature on homepage (checkbox) — `isFeatured`

### Click Behavior (every clickable element):

1. **Click: X close button** → Calls `onClose()` → Closes modal
2. **Click: Product Name input** → Typing auto-generates slug (lowercase, hyphenated)
3. **Click: Slug input** → Manual editing allowed
4. **Click: Price input** → Number input
5. **Click: Sale Price input** → Number input (optional)
6. **Click: Category dropdown** → Select category
7. **Click: Stock input** → Number input
8. **Click: Box Weight input** → Number input
9. **Click: Description textarea** → Text input
10. **Click: ImageUpload component** → Opens file picker, uploads to Cloudinary via `/api/upload`, returns URL
11. **Click: "Visible on store" checkbox** → Toggles `isActive`
12. **Click: "Feature on homepage" checkbox** → Toggles `isFeatured`
13. **Click: "Cancel" button** → Calls `onClose()` → Closes modal
14. **Click: "Create" / "Update" button (form submit)** → Calls `handleSubmit()`:
    - Validates: name, slug, price > 0, stock >= 0, description
    - If edit mode (`product?.id` exists): `update(ref(rtdb, 'products/{id}'), data)`
    - If create mode: `push(ref(rtdb, 'products'))` then `set()` with new data
    - Calls `onSuccess()` → refreshes product list
    - Calls `onClose()` → closes modal
    - Shows toast success/error

### Conditional Rendering:
- If `isOpen === false` → Returns `null`
- Header shows "Edit Product" if `product` exists, "Add Product" otherwise
- Submit button shows "Update" if editing, "Create" if new

**Status:** ✅ Reviewed

---

## FILE 12: app/admin/orders/page.tsx
**Path:** `/app/admin/orders/page.tsx`
**Type:** Client component — Admin Orders management page
**Purpose:** Lists all orders with search, status filter, and inline status update dropdown. Allows admin to change order status directly from the list.

### Components/Hooks Used:
- `useAdminOrders` (from `@/hooks/useAdminOrders`) — Fetches ALL orders from RTDB, provides `refresh()`
- `Badge`, `OrderStatusBadge`, `PaymentStatusBadge` (from `@/components/ui/Badge`) — Status badges
- `ref, update` (from `firebase/database`) — Updates order status in RTDB
- `rtdb` (from `@/lib/firebase`) — RTDB instance
- `toast` (from `react-hot-toast`) — Success/error notifications

### State:
- `searchQuery` — Filters orders by ID, customer name, or email
- `statusFilter` — Filters orders by status (all, Pending, Confirmed, Packed, Shipped, Delivered, Cancelled)
- `updatingId` — Tracks which order is currently being updated (disables dropdown during update)

### Click Behavior (every clickable element):

1. **Click: Search input** → Types to filter orders by order ID, customer name, or email (client-side)
2. **Click: Status filter dropdown** → Changes `statusFilter` → Re-filters displayed orders
3. **Click: Status dropdown on an order card** → Calls `updateOrderStatus(orderId, newStatus)`:
   - Sets `updatingId` to current order ID (disables dropdown)
   - Updates RTDB at `orders/all/{orderId}` with new status
   - If order has `userId`, also updates `orders/byUser/{userId}/{orderId}`
   - Shows toast success/error
   - Calls `refresh()` to reload orders
4. **Order cards** — Display only (no click handlers on the card itself)

### Data Flow:
- `filteredOrders` = Orders filtered by search query (ID, name, email) AND status
- Status update writes to TWO paths in RTDB:
  - `orders/all/{orderId}` — master list
  - `orders/byUser/{userId}/{orderId}` — user-specific copy (if userId exists)

### Order Status Options:
Pending → Confirmed → Packed → Shipped → Delivered (or Cancelled at any point)

**Status:** ✅ Reviewed

---

## FILE 13: app/admin/customers/page.tsx
**Path:** `/app/admin/customers/page.tsx`
**Type:** Client component — Admin Customers management page
**Purpose:** Lists all registered customers with search, order count, total spent, and ban/unban functionality. Clicking a user expands their details.

### Components/Hooks Used:
- `useUsers` (from `@/hooks/useUsers`) — Fetches all users from RTDB, provides `refresh()`
- `useAdminOrders` (from `@/hooks/useAdminOrders`) — Fetches all orders (to compute per-user stats)
- `ref, update` (from `firebase/database`) — Updates user's `isBanned` field in RTDB
- `rtdb` (from `@/lib/firebase`) — RTDB instance
- `toast` (from `react-hot-toast`) — Success/error notifications

### State:
- `searchQuery` — Filters users by name, email, or phone
- `selectedUser` — Currently expanded user ID (null = none expanded)

### Computed Data:
- `getUserOrders(userId)` — Returns orders where `order.userId === userId`
- `getUserSpent(userId)` — Sum of verified orders for that user

### Click Behavior (every clickable element):

1. **Click: Search input** → Types to filter users by name, email, or phone (client-side)
2. **Click: User card (main row)** → Toggles expand/collapse:
   - If already selected → Collapses (`selectedUser = null`)
   - If not selected → Expands (`selectedUser = user.uid`)
3. **Expanded section shows:**
   - Email address
   - Phone number
   - Registration date
   - Ban/Unban button
4. **Click: "Ban User" button** → Calls `toggleBan(userId, false)`:
   - Sets `isBanned: true` in RTDB at `users/{userId}`
   - Shows toast "User banned"
   - Calls `refresh()` to reload user list
5. **Click: "Unban User" button** → Calls `toggleBan(userId, true)`:
   - Sets `isBanned: false` in RTDB at `users/{userId}`
   - Shows toast "User unbanned"
   - Calls `refresh()` to reload user list

### Conditional Rendering:
- If user is banned → Shows red "BANNED" badge next to name
- Expanded section only visible when `selectedUser === user.uid`

**Status:** ✅ Reviewed

---

## FILE 14: app/admin/chat/page.tsx
**Path:** `/app/admin/chat/page.tsx`
**Type:** Client component — Admin Live Chat management page
**Purpose:** Three-panel chat interface for admins to manage customer conversations. Left panel = conversation list, center = chat window, right = user info panel.

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `isAdmin` for access control
- `useAdminChats` (from `@/hooks/useAdminChats`) — Manages all customer conversations, provides:
  - `conversations` — Array of all customer chat conversations
  - `selectedUserId` — Currently selected customer's user ID
  - `setSelectedUserId` — Select/deselect a conversation
  - `sendReply(userId, text)` — Send admin reply
  - `markAsRead(userId)` — Mark messages as read
  - `setTyping(userId, isTyping)` — Set admin typing indicator
  - `closeChat(userId)` — Close a conversation
  - `reopenChat(userId)` — Reopen a closed conversation
  - `getTypingStatus(userId, callback)` — Subscribe to user typing status
  - `totalUnread` — Total unread messages across all conversations
  - `loading` — Loading state
- `ChatList` (from `@/components/admin/chat/ChatList`) — Left panel: list of conversations
- `ChatWindow` (from `@/components/admin/chat/ChatWindow`) — Center panel: message thread + reply input
- `UserInfoPanel` (from `@/components/admin/chat/UserInfoPanel`) — Right panel: customer details

### State:
- `isUserTyping` — Record of which users are currently typing
- `showUserInfo` — Whether the user info panel is visible
- `isMobile` — Whether viewport width < 1024px (triggers responsive layout)

### Layout Structure:
```
[Header: "Live Chat" title + unread count badge]
[Main area - 3 panels]
  └─ Left: ChatList (conversation list) — hidden on desktop when chat selected
  └─ Center: ChatWindow (message thread) — shows placeholder if no chat selected
  └─ Right: UserInfoPanel (customer details) — hidden on mobile, toggleable on tablet
```

### Click Behavior (every clickable element):

1. **Click: Conversation in ChatList** → Calls `setSelectedUserId(userId)` → Opens that conversation in center panel
2. **Click: Back button in ChatWindow (mobile)** → Calls `setSelectedUserId(null)` → Returns to conversation list
3. **Click: Send reply in ChatWindow** → Calls `sendReply(userId, text)` → Sends message to customer
4. **Click: Mark as read in ChatWindow** → Calls `markAsRead(userId)` → Clears unread badge
5. **Click: Close chat in ChatWindow** → Calls `closeChat(userId)` → Closes conversation
6. **Click: Reopen chat in ChatWindow** → Calls `reopenChat(userId)` → Reopens conversation
7. **Click: Toggle info button in ChatWindow** → Calls `setShowUserInfo(!showUserInfo)` → Shows/hides UserInfoPanel
8. **Click: X close on UserInfoPanel** → Calls `setShowUserInfo(false)` → Hides panel
9. **Click: UserInfoPanel backdrop (mobile)** → Calls `setShowUserInfo(false)` → Hides panel

### Conditional Rendering:
- If `!isAdmin` → Shows "Access Denied" message
- ChatList: Hidden on desktop when a conversation is selected (`hidden lg:flex`)
- ChatWindow: Shows "Select a Conversation" placeholder when no chat is selected
- UserInfoPanel: Hidden on mobile by default, always visible on XL screens, toggleable on medium screens

**Status:** ✅ Reviewed

---

## FILE 15: app/admin/reports/page.tsx
**Path:** `/app/admin/reports/page.tsx`
**Type:** Client component — Admin Reports & Analytics page
**Purpose:** Dashboard with charts showing revenue trends, order status distribution, orders per day, and products by category. Uses recharts for data visualization.

### Components/Hooks Used:
- `useAdminOrders` (from `@/hooks/useAdminOrders`) — Fetches all orders
- `useProducts` (from `@/hooks/useProducts`) — Fetches all products
- `useUsers` (from `@/hooks/useUsers`) — Fetches all users
- `recharts` — BarChart, LineChart, PieChart, Tooltip, ResponsiveContainer, etc.

### Data Computed:
- `totalRevenue` = Sum of verified orders
- `avgOrderValue` = Total revenue / number of verified orders
- `statusData` = Count of orders per status (Pending, Confirmed, Packed, Shipped, Delivered, Cancelled)
- `categoryData` = Count of products per category
- `weeklyData` = Revenue and order count per day of current week (Sun-Sat)

### Sections (top to bottom):

#### 1. Header
- Title: "Reports & Analytics"
- Static display — no click handlers

#### 2. Stats Cards (4 cards)
- Revenue, Avg Order, Products, Customers
- Static display — no click handlers

#### 3. Charts (2x2 grid):
- **Revenue Trend (Line Chart)** — Shows daily revenue this week
- **Order Status Distribution (Pie Chart)** — Shows order count by status
- **Orders Per Day (Bar Chart)** — Shows order count per day this week
- **Products by Category (Pie Chart)** — Shows product count by category

### Click Behavior:
- **NO click handlers on this page** — All charts and stats are display-only
- Charts have built-in tooltips from recharts (hover to see values)

**Status:** ✅ Reviewed

---

## FILE 16: app/admin/cms/page.tsx
**Path:** `/app/admin/cms/page.tsx`
**Type:** Server component (no 'use client') — Admin CMS placeholder page
**Purpose:** Placeholder for future content management (banners, hero content, testimonials, FAQs). Currently shows "coming soon" message.

### Components Used:
- None — pure JSX with Tailwind classes

### Click Behavior:
- **NO click handlers** — Just a placeholder message

**Status:** ✅ Reviewed

---

## FILE 17: app/admin/settings/page.tsx
**Path:** `/app/admin/settings/page.tsx`
**Type:** Client component — Admin Store Settings page
**Purpose:** Manage store content (text settings), images (logo, hero, carousel), and contact info (phone, email, address, social links). Uses 3 tabs: General, Images, Contact.

### Components/Hooks Used:
- `useSettings` (from `@/hooks/useSettings`) — Provides:
  - `settings` — All store settings from RTDB
  - `loading` — Loading state
  - `saving` — Saving state
  - `updateSetting(key, value)` — Update a text setting in RTDB
  - `updateHeroImage(index, file)` — Upload new hero image
  - `updateLogo(file)` — Upload new logo
  - `updateCarouselImage(index, file, name, tagline)` — Upload carousel image
- `Button` (from `@/components/ui/Button`) — Action buttons

### State:
- `activeTab` — Current tab: 'general', 'images', or 'contact'
- `editForm` — Tracks unsaved text changes per field key
- `heroFileRefs`, `logoFileRef`, `carouselFileRefs` — Hidden file input refs

### Tabs & Click Behavior:

#### Tab 1: General (text settings)
Each field has a text input/textarea + Save button that appears when changed:
1. **Hero Title** → Type → Save button appears → Click Save → `updateSetting('heroTitle', value)`
2. **Hero Description** → Type → Save → `updateSetting('heroDescription', value)`
3. **Feature Title** → Type → Save → `updateSetting('featureTitle', value)`
4. **Feature Description** → Type → Save → `updateSetting('featureDescription', value)`
5. **CTA Title** → Type → Save → `updateSetting('ctaTitle', value)`
6. **CTA Description** → Type → Save → `updateSetting('ctaDescription', value)`
7. **Site Title** → Type → Save → `updateSetting('siteTitle', value)`
8. **Site Description** → Type → Save → `updateSetting('siteDescription', value)`

#### Tab 2: Images
1. **Click: "Change Logo" button** → Triggers hidden file input → Uploads file via `updateLogo(file)`
2. **Click: "Replace" on Hero Image** → Triggers hidden file input → Uploads via `updateHeroImage(index, file)`
3. **Click: "Replace" on Carousel Image** → Triggers hidden file input → Shows prompts for name/tagline → Uploads via `updateCarouselImage(index, file, name, tagline)`

#### Tab 3: Contact
Each field has an input + Save button:
1. **Phone Number** → Type → Save → `updateSetting('phone', value)`
2. **Email Address** → Type → Save → `updateSetting('email', value)`
3. **Address** → Type → Save → `updateSetting('address', value)`
4. **WhatsApp Number** → Type → Save → `updateSetting('whatsapp', value)`
5. **Facebook URL** → Type → Save → `updateSetting('facebook', value)`
6. **Instagram URL** → Type → Save → `updateSetting('instagram', value)`

#### Tab Navigation:
- **Click: "General" tab** → Sets `activeTab = 'general'`
- **Click: "Images" tab** → Sets `activeTab = 'images'`
- **Click: "Contact" tab** → Sets `activeTab = 'contact'`

**Status:** ✅ Reviewed

---

## FILE 18: app/(auth)/layout.tsx
**Path:** `/app/(auth)/layout.tsx`
**Type:** Client component — Auth pages layout (login/signup)
**Purpose:** Split-screen layout for authentication pages. Left side has animated branding (desktop only), right side has the auth form.

### Components Used:
- `Link` (from `next/link`) — Logo links to home
- `motion` (from `framer-motion`) — Animated background blobs
- `FloatingElement` (from `@/components/motion`) — Floating mango/leaf emojis
- `SpringFade` (from `@/components/motion`) — Fade-in animation for form card

### Layout Structure:
```
<div min-h-screen flex>
  [Left side - desktop only, hidden on mobile]
    - Animated gradient background (orange/amber/yellow)
    - Floating logo image
    - "MangoStore" title
    - Tagline
    - Floating emoji decorations (🥭 🌿 🍃)
    - Wave SVG at bottom
  [Right side - always visible]
    - Background decorations (blurred circles)
    - Mobile logo (visible only on mobile, links to /)
    - White card with rounded corners containing {children} (login/signup form)
</div>
```

### Click Behavior:
1. **Click: Logo (desktop, left side)** → Redirects to `/` (home page)
2. **Click: Logo (mobile, right side)** → Redirects to `/` (home page)

### Conditional Rendering:
- Left branding panel: `hidden lg:flex` — hidden on mobile, visible on desktop
- Mobile logo: `lg:hidden` — visible on mobile, hidden on desktop
- `{children}` → Injected into white card (login or signup form content)

**Status:** ✅ Reviewed

---

## FILE 19: app/(auth)/login/page.tsx
**Path:** `/app/(auth)/login/page.tsx`
**Type:** Client component — Login page
**Purpose:** Email/password login form with Google Sign-In option. Redirects to home if already logged in.

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `loginWithGoogle`, `user`, `authLoading`
- `useRouter` (from `next/navigation`) — Redirects after login
- `useForm` (from `react-hook-form`) — Form state management
- `zodResolver` (from `@hookform/resolvers/zod`) — Validates against `loginSchema`
- `loginSchema` (from `@/lib/validations`) — Requires email + password (min 6 chars)
- `Button`, `Input` (from `@/components/ui/`) — Form components
- `toast` (from `react-hot-toast`) — Error notifications
- `Link` (from `next/link`) — Link to signup page
- `signInWithEmailAndPassword` (from `firebase/auth`) — Firebase email login

### Click Behavior (every clickable element):

1. **Click: "Sign In" button (form submit)** → Calls `onSubmit(data)`:
   - Calls `signInWithEmailAndPassword(auth, email, password)`
   - On success: Redirects to `?redirect=` param (defaults to `/`)
   - On failure: Shows toast error ("Invalid email or password", "No account found", or "Login failed")
2. **Click: "Continue with Google" button** → Calls `loginWithGoogle()`:
   - Opens Firebase Google Sign-In popup
   - On success: Redirects to `?redirect=` param (defaults to `/`) (handled by `useEffect` watching `user`)
3. **Click: "Sign Up" link** → Redirects to `/signup`

### Auto-redirect:
- If user is already logged in (`user` exists and `authLoading` is false) → Automatically redirects to `?redirect=` param (defaults to `/`)

**Status:** ✅ Reviewed

---

## FILE 20: app/(auth)/signup/page.tsx
**Path:** `/app/(auth)/signup/page.tsx`
**Type:** Server component wrapper — Signup page
**Purpose:** Wraps `SignupContent` (client component) in a `Suspense` boundary to handle `useSearchParams` properly. Email/password registration form with Google Sign-In option. Creates user in Firebase Auth and stores profile in RTDB. Redirects to home if already logged in.

### Structure:
```
export default SignupPage() {
  return (
    <Suspense fallback={spinner}>
      <SignupContent />  ← Contains all form logic + useSearchParams
    </Suspense>
  )
}
```

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `loginWithGoogle`, `user`, `authLoading`
- `useRouter` (from `next/navigation`) — Redirects after signup
- `useForm` (from `react-hook-form`) — Form state management
- `zodResolver` (from `@hookform/resolvers/zod`) — Validates against `signupSchema`
- `signupSchema` (from `@/lib/validations`) — Requires name, email, password (min 6 chars), confirmPassword
- `Button`, `Input` (from `@/components/ui/`) — Form components
- `toast` (from `react-hot-toast`) — Success/error notifications
- `Link` (from `next/link`) — Link to login page
- `createUserWithEmailAndPassword`, `updateProfile` (from `firebase/auth`) — Firebase signup
- `ref, set` (from `firebase/database`) — Stores user profile in RTDB
- `rtdb` (from `@/lib/firebase`) — RTDB instance

### Click Behavior (every clickable element):

1. **Click: "Create Account" button (form submit)** → Calls `onSubmit(data)`:
   - Creates user via `createUserWithEmailAndPassword(auth, email, password)`
   - Sets display name via `updateProfile(cred.user, { displayName: data.name })`
   - Stores user profile in RTDB at `users/{uid}` with: `name`, `email`, `role: 'customer'`, `createdAt`
   - On success: Shows toast "Account created!" → Redirects to `?redirect=` param (defaults to `/`)
   - On failure: Shows toast error ("Email already registered" or "Signup failed")
2. **Click: "Continue with Google" button** → Calls `loginWithGoogle()`:
   - Opens Firebase Google Sign-In popup
   - On success: Redirects to `?redirect=` param (defaults to `/`) (handled by `useEffect` watching `user`)
3. **Click: "Sign In" link** → Redirects to `/login`

### Auto-redirect:
- If user is already logged in (`user` exists and `authLoading` is false) → Automatically redirects to `?redirect=` param (defaults to `/`)

**Status:** ✅ Reviewed

---

## FILE 21: app/(public)/customer/layout.tsx
**Path:** `/app/(public)/customer/layout.tsx`
**Type:** Client component — Customer area layout wrapper
**Purpose:** Wraps ALL customer pages (/customer, /customer/profile, /customer/orders/[id]). Wishlist page (`/customer/wishlist`) exists but is not linked from navigation. Provides top bar with hamburger menu, slide-in drawer from left, and protects against non-logged-in access.

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `user`, `loading`, `logout`
- `useLayout` (from `@/components/layout/LayoutContext`) — Calls `setHideNavbar(true)` and `setHideFooter(true)` to hide main site navbar/footer
- `usePathname` (from `next/navigation`) — Highlights active nav item in drawer
- `useRouter` (from `next/navigation`) — Redirects non-logged-in users to `/login`

### Layout Structure:
```
[Mobile Backdrop overlay] (click to close drawer)
[Drawer - fixed left, w-60]
  └─ Header: Logo "MangoStore" + X close button
  └─ User Info: Avatar + Name + Email
  └─ Nav Links: Home, My Orders, Profile, Chat
  └─ Sign Out button
[Top Bar - sticky top-0]
  └─ Left: Hamburger menu button
  └─ Center: "My Account"
  └─ Right: "Shop →" link (to /)
[Content area]
  └─ {children} wrapped in max-w-3xl container
```

### Click Behavior (every clickable element):

1. **Click: Mobile backdrop overlay** → Calls `setDrawerOpen(false)` → Closes drawer
2. **Click: X close button in drawer header** → Calls `setDrawerOpen(false)` → Closes drawer
3. **Click: Logo in drawer header** → Redirects to `/` (home page)
 4. **Click: Drawer nav links (4 links):**
   - Home → `/`
   - My Orders → `/customer`
   - Profile → `/customer/profile`
   - Chat → `/chat`
   - All links call `setDrawerOpen(false)` after click (closes drawer)
5. **Click: Sign Out button** → Calls `logout()` then `setDrawerOpen(false)` → Logs out and closes drawer
6. **Click: Hamburger menu button (top bar, top-left)** → Calls `setDrawerOpen(true)` → Opens drawer
7. **Click: "Shop →" link (top bar, right)** → Redirects to `/`

### Conditional Rendering:
- If `loading` → Shows spinner
- If `!user` → Redirects to `/login?redirect=/customer` and returns `null`
- Active nav item: Highlighted with `bg-mango-50 text-mango` when `pathname === item.href`

### Auth Guard:
- Redirects to `/login?redirect=/customer` if user is not logged in

**Status:** ✅ Reviewed

---

## FILE 22: app/(public)/customer/page.tsx
**Path:** `/app/(public)/customer/page.tsx`
**Type:** Client component — Customer My Orders page
**Purpose:** Lists all orders for the logged-in user. Shows order cards with status, items, total, and a link to order details.

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `user`, `loading`
- `useOrders` (from `@/hooks/useOrders`) — Fetches orders for current user from RTDB (`orders/byUser/{uid}`)
- `Badge`, `OrderStatusBadge`, `PaymentStatusBadge` (from `@/components/ui/Badge`) — Status badges
- `ProductGridSkeleton` (from `@/components/ui/Skeleton`) — Loading skeleton
- `Image` (from `next/image`) — Product thumbnails in order cards
- `Link` (from `next/link`) — Navigation links

### Click Behavior (every clickable element):

1. **Click: "Sign In →" link** (shown if not logged in) → Redirects to `/login?redirect=/customer`
2. **Click: "Browse Products →" link** (shown if no orders) → Redirects to `/products`
3. **Click: "Details →" link on an order card** → Redirects to `/customer/orders/{orderId}` (order detail page)

### Conditional Rendering:
- If loading → Shows skeleton cards
- If not logged in → Shows "Please sign in" message with Sign In link
- If no orders → Shows "No orders yet" message with Browse Products link
- If orders exist → Shows list of order cards

**Status:** ✅ Reviewed

---

## FILE 23: app/(public)/customer/profile/page.tsx
**Path:** `/app/(public)/customer/profile/page.tsx`
**Type:** Client component — Customer Profile page
**Purpose:** Allows user to view/edit their name, phone, and manage saved addresses.

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `user`, `loading`, `updateUserData`
- `Button`, `Input` (from `@/components/ui/`) — Form components
- `toast` (from `react-hot-toast`) — Success/error notifications

### State:
- `isEditing` — Toggle between view and edit mode
- `isSaving` — Loading state during save
- `profileForm` — Name, phone, photoURL
- `addresses` — Array of saved addresses

### Click Behavior (every clickable element):

1. **Click: "Edit" button** → Sets `isEditing = true` → Enables form fields
2. **Click: "Cancel" button** → Sets `isEditing = false` → Disables form fields, discards changes
3. **Click: "Save" button** → Calls `handleUpdateProfile()`:
   - Calls `updateUserData({ ...profileForm, addresses })` → Updates user data in RTDB
   - Shows toast success/error
   - Sets `isEditing = false`
4. **Click: "Add" button (addresses section, edit mode only)** → Calls `handleAddAddress()`:
   - Adds a new empty address to the `addresses` array
5. **Click: Address label input (edit mode)** → Edits address label
6. **Click: Address fields (street, city, state, zip) inputs (edit mode)** → Edits address fields
7. **Click: Trash icon on an address (edit mode only)** → Calls `handleRemoveAddress(idx)`:
   - Removes that address from the `addresses` array

### Conditional Rendering:
- If loading → Shows spinner
- If not logged in → Shows "Please sign in" message
- Edit mode: Shows "Cancel" + "Save" buttons, enables inputs, shows "Add" address button, shows trash icons
- View mode: Shows "Edit" button, inputs are disabled, no trash icons

**Status:** ✅ Reviewed

---

## FILE 24: app/(public)/customer/wishlist/page.tsx
**Path:** `/app/(public)/customer/wishlist/page.tsx`
**Type:** Client component — Customer Wishlist page
**Purpose:** Placeholder wishlist page with "Coming Soon" banner so users know the feature is under development.

### Components/Hooks Used:
- `useAuth` (from `@/hooks/useAuth`) — Gets `user`, `loading`
- `Button` (from `@/components/ui/Button`) — Action button
- `Link` (from `next/link`) — Navigation links
- `Suspense` (from `react`) — Loading fallback

### Click Behavior (every clickable element):

1. **Click: "Sign In" button** (shown if not logged in) → Redirects to `/login?redirect=/customer/wishlist`
2. **Click: "Browse Products" button** → Redirects to `/products`

### Conditional Rendering:
- If loading → Shows spinner
- If not logged in → Shows "Please sign in" with Sign In button
- If logged in → Shows "Coming Soon" banner + "Not available yet" card with Browse Products link

**Status:** ✅ Reviewed

---

## FILE 25: app/(public)/customer/orders/[id]/page.tsx
**Path:** `/app/(public)/customer/orders/[id]/page.tsx`
**Type:** Client component — Order Detail page
**Purpose:** Shows full details of a single order: order progress tracker, items list, shipping address, payment info, and total.

### Components/Hooks Used:
- `useOrders` (from `@/hooks/useOrders`) — Fetches user's orders from RTDB
- `useParams` (from `next/navigation`) — Gets `id` from URL
- `useRouter` (from `next/navigation`) — Redirects if order not found
- `Button`, `Image` — UI components
- `Link` — Back to Orders link

### Click Behavior:
1. **Click: "Back to Orders" link** → Redirects to `/customer`
2. **Click: "Back to Orders" button** (if order not found) → Redirects to `/customer`

### Sections:
- Order header: ID, status badge, date placed
- Order Progress: Visual step tracker (Pending → Confirmed → Packed → Shipped → Delivered)
- Items list: Product images, names, quantities, prices
- Shipping Address: Name, phone, street, city, state, zip
- Payment: Method and status
- Total breakdown: Subtotal, Delivery (FREE), Total

**Status:** ✅ Reviewed

---

## FILE 26: app/(public)/products/page.tsx
**Path:** `/app/(public)/products/page.tsx`
**Type:** Client component — Products listing page
**Purpose:** Shows all products with search, category filter, sort, and category pills (mobile).

### Components/Hooks Used:
- `useProducts` — Fetches all products
- `ProductCard` — Renders each product
- `FilterSidebar` — Desktop filter panel
- `useSearchParams` — Reads `?category=` from URL
- `useRouter` — Updates URL when category changes

### Click Behavior:
1. **Click: Search input** → Filters products by name (client-side)
2. **Click: Filters button (mobile)** → Opens mobile filter sidebar
3. **Click: Category in FilterSidebar** → Updates URL `?category=X` and re-fetches
4. **Click: Sort dropdown** → Sorts by price-asc, price-desc, name-asc, or newest
5. **Click: ProductCard** → Redirects to `/products/[slug]`
6. **Click: "Clear Filters" button** → Resets category and search

**Status:** ✅ Reviewed

---

## FILE 27: app/(public)/products/[slug]/page.tsx
**Path:** `/app/(public)/products/[slug]/page.tsx`
**Type:** Client component — Product detail page
**Purpose:** Shows full product info: images, price, description, reviews, add to cart, related products.

### Components/Hooks Used:
- `useProduct(slug)` — Fetches single product from RTDB
- `useProducts({ category, limitCount: 4 })` — Fetches related products
- `useCart` — `addItem`, `toggleCart`
- `useReviews(productId)` — Fetches reviews
- `ProductCard`, `ChatButton`, `ReviewSystem` — Sub-components

### Click Behavior:
1. **Click: "Back to products" link** → Redirects to `/products`
2. **Click: Thumbnail images** → Sets `activeImage` to show in main image
3. **Click: Quantity +/- buttons** → Increments/decrements qty (min 1, max stock)
4. **Click: "Add to Cart" button** → Calls `addItem()` with product data, shows toast, opens cart drawer
5. **Click: ChatButton** → Opens chat with product context
6. **Click: ReviewSystem** → Submit rating/comment (handled inside component)
7. **Click: Related ProductCard** → Redirects to `/products/[slug]`

**Status:** ✅ Reviewed

---

## FILE 28: app/(public)/checkout/page.tsx
**Path:** `/app/(public)/checkout/page.tsx`
**Type:** Client component — Checkout page
**Purpose:** Shipping form + order summary. Submits order to `/api/orders` endpoint.

### Components/Hooks Used:
- `useCart` — Gets cart items, total, `clearCart`
- `useAuth` — Gets user info
- `useForm` + `zodResolver` + `checkoutSchema` — Form validation
- `fetch('/api/orders')` — POST to create order

### Click Behavior:
1. **Click: Saved address card** → Fills form fields with address data
2. **Click: "Place Order" button** → Submits form:
   - Validates shipping info
   - POSTs to `/api/orders` with items, total, user data
   - On success: Clears cart, redirects to `/checkout/success?id={orderId}`
   - On failure: Shows toast error
3. **Click: Cash on Delivery label** → Already selected (only option)

### Conditional Rendering:
- If not logged in → Redirects to `/login?redirect=/checkout`
- If cart empty → Shows "Your Cart is Empty" with "Go to Shop" button → `/products`

**Status:** ✅ Reviewed

---

## FILE 29: app/(public)/checkout/success/page.tsx
**Path:** `/app/(public)/checkout/success/page.tsx`
**Type:** Client component — Order success page
**Purpose:** Shows confirmation after successful order placement.

### Click Behavior:
1. **Click: "Track Order" button** → Redirects to `/customer`
2. **Click: "Continue Shopping" button** → Redirects to `/products`

**Status:** ✅ Reviewed

---

## FILE 30: app/chat/page.tsx
**Path:** `/app/chat/page.tsx`
**Type:** Server component — Chat page wrapper
**Purpose:** Renders `ChatInterface` as full-screen overlay. Passes product info from URL search params.

### Click Behavior:
- All clicks handled inside `ChatInterface` component

**Status:** ✅ Reviewed

---

## FILE 31: components/products/ProductCard.tsx
**Path:** `/components/products/ProductCard.tsx`
**Type:** Client component — Product card (used in grids)
**Purpose:** Shows product image, name, price, sale price, and "Add to Cart" button. No wishlist/heart icon — that feature is not implemented.

### Click Behavior:
1. **Click: Card body (image, name, price area)** → Redirects to `/products/[slug]`
2. **Click: "Add to Cart" button** → Calls `addItem()` from cart context, shows toast, opens cart drawer
3. **Click: Quantity +/- buttons** → Increments/decrements cart quantity

**Status:** ✅ Reviewed

---

## FILE 32: components/cart/CartDrawer.tsx
**Path:** `/components/cart/CartDrawer.tsx`
**Type:** Client component — Cart slide-up drawer
**Purpose:** Shows cart items with quantity controls, shipping progress bar, and checkout button.

### Click Behavior:
1. **Click: Backdrop overlay** → Calls `toggleCart()` → Closes drawer
2. **Click: X close button** → Calls `toggleCart()` → Closes drawer
3. **Click: "Start Shopping" button** (empty cart) → Calls `toggleCart()` → Closes drawer
4. **Click: Quantity - button** → Decrements qty (if qty=1, removes item)
5. **Click: Quantity + button** → Increments qty
6. **Click: Trash icon** → Removes item from cart
7. **Click: "Checkout" button** → Redirects to `/checkout`

**Status:** ✅ Reviewed

---

## FILE 33: components/chat/ChatWidget.tsx
**Path:** `/components/chat/ChatWidget.tsx`
**Type:** Client component — Floating chat bubble
**Purpose:** Bottom-right floating button that opens chat when clicked. Hidden on admin/customer pages and checkout pages.

### Click Behavior:
1. **Click: Chat bubble** → Redirects to `/chat`

### Conditional Rendering:
- Hidden if `!isVisible` (first 2 seconds)
- Hidden if `!user` (not logged in)
- Hidden if `isAdmin` (admin users don't need it)
- Hidden if `pathname === '/checkout'` or `pathname === '/checkout/success'` (clean checkout)

**Status:** ✅ Reviewed

---

## FILE 34: components/chat/ChatInterface.tsx
**Path:** `/components/chat/ChatInterface.tsx`
**Type:** Client component — Full chat interface
**Purpose:** Message thread with real-time chat, image attachment, typing indicators.

### Click Behavior:
1. **Click: Back arrow (mobile)** → Calls `router.back()` → Returns to previous page in browser history
2. **Click: "Go to Dashboard" button** (admin mode) → Redirects to `/admin/chat`
3. **Click: Product image/link** → Redirects to `/products/[slug]`
4. **Click: Image attachment button** → Opens file picker
5. **Click: Send button** → Sends message (text and/or image)
6. **Click: Chat message image** → Opens full-screen image preview
7. **Click: Image preview X** → Closes preview
8. **Click: "Sign In" button** (if not logged in) → Redirects to `/login?redirect=/chat`

**Status:** ✅ Reviewed

---

## FILE 35: components/ui/Button.tsx
**Path:** `/components/ui/Button.tsx`
**Type:** Client component — Reusable button
**Purpose:** Styled button with variants (default, outline, ghost), sizes (sm, md, lg), loading state, and optional icon.

### Props:
- `variant`: 'default' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean — Shows spinner, disables button
- `asChild`: boolean — If true, wraps children in `<button>` instead of being a button itself
- `icon`: ReactNode — Icon before text
- `disabled`: boolean — Disables button

**Status:** ✅ Reviewed

---

## FILE 36: components/ui/Input.tsx
**Path:** `/components/ui/Input.tsx`
**Type:** Client component — Form input with label and error
**Purpose:** Styled text/number/email/password input with optional label and error message.

**Status:** ✅ Reviewed

---

## FILE 37: components/ui/Textarea.tsx
**Path:** `/components/ui/Textarea.tsx`
**Type:** Client component — Form textarea with label and error
**Purpose:** Styled multi-line text input.

**Status:** ✅ Reviewed

---

## FILE 38: components/ui/Badge.tsx
**Path:** `/components/ui/Badge.tsx`
**Type:** Client component — Status badges
**Purpose:** Renders colored badges for order status, payment status, and product categories.

### Exports:
- `Badge` — Generic badge with variants (default, success, warning, danger, muted)
- `OrderStatusBadge` — Colored badge for order status (Pending, Confirmed, Packed, Shipped, Delivered, Cancelled)
- `PaymentStatusBadge` — Colored badge for payment status (Pending, Verified, Failed, Refunded)

**Status:** ✅ Reviewed

---

## FILE 39: components/ui/Card.tsx
**Path:** `/components/ui/Card.tsx`
**Type:** Client component — Card wrapper
**Purpose:** Styled container with border, rounded corners, and padding.

**Status:** ✅ Reviewed

---

## FILE 40: components/ui/Skeleton.tsx
**Path:** `/components/ui/Skeleton.tsx`
**Type:** Client component — Loading skeletons
**Purpose:** Pulsing placeholder UI for products and stats.

### Exports:
- `ProductGridSkeleton` — Grid of skeleton product cards
- `StatCardSkeleton` — Single stat card skeleton

**Status:** ✅ Reviewed

---

## FILE 41: components/ui/ImageUpload.tsx
**Path:** `/components/ui/ImageUpload.tsx`
**Type:** Client component — Image upload with Cloudinary
**Purpose:** File picker that uploads to Cloudinary via `/api/upload` endpoint, returns URL.

### Click Behavior:
1. **Click: Upload area** → Opens file picker
2. **On file select** → Uploads to `/api/upload` → Sets `value` to returned URL

**Status:** ✅ Reviewed

---

## FILE 42: components/ErrorBoundary.tsx
**Path:** `/components/ErrorBoundary.tsx`
**Type:** Client component — React error boundary
**Purpose:** Catches React rendering errors, shows fallback UI instead of crashing.

**Status:** ✅ Reviewed

---

## FILE 43: components/motion/index.ts
**Path:** `/components/motion/index.ts`
**Type:** Barrel export file
**Purpose:** Re-exports `FloatingElement` and `SpringFade` from motion components.

**Status:** ✅ Reviewed

---

## FILE 44: components/motion/ParallaxLayer.tsx
**Path:** `/components/motion/ParallaxLayer.tsx`
**Type:** Client component — Parallax scroll effect
**Purpose:** Animated element that moves at different speed on scroll.

**Status:** ✅ Reviewed

---

## FILE 45: components/motion/SpringFade.tsx
**Path:** `/components/motion/SpringFade.tsx`
**Type:** Client component — Spring fade-in animation
**Purpose:** Element that fades in with spring physics on mount.

**Status:** ✅ Reviewed

---

## FILE 46: components/admin/chat/ChatList.tsx
**Path:** `/components/admin/chat/ChatList.tsx`
**Type:** Client component — Admin conversation list
**Purpose:** Shows all customer conversations with unread badges, last message preview.

### Click Behavior:
1. **Click: Conversation item** → Calls `onSelectChat(userId)` → Opens that chat in center panel

**Status:** ✅ Reviewed

---

## FILE 47: components/admin/chat/ChatWindow.tsx
**Path:** `/components/admin/chat/ChatWindow.tsx`
**Type:** Client component — Admin chat message window
**Purpose:** Shows message thread, reply input, typing indicator, close/reopen chat buttons.

### Click Behavior:
1. **Click: Back button (mobile)** → Calls `onBack()` → Returns to conversation list
2. **Click: Send button** → Calls `onSendReply(text)` → Sends message to customer
3. **Click: Close chat button** → Calls `onCloseChat()` → Closes conversation
4. **Click: Reopen chat button** → Calls `onReopenChat()` → Reopens conversation
5. **Click: Toggle info button** → Calls `onToggleInfo()` → Shows/hides user info panel

**Status:** ✅ Reviewed

---

## FILE 48: components/admin/chat/UserInfoPanel.tsx
**Path:** `/components/admin/chat/UserInfoPanel.tsx`
**Type:** Client component — User info side panel
**Purpose:** Shows customer details: name, email, phone, order history, chat metadata.

### Click Behavior:
1. **Click: X close button** → Calls `onClose()` → Hides panel

**Status:** ✅ Reviewed

---

## FILE 49: types/index.ts
**Path:** `/types/index.ts`
**Type:** TypeScript type definitions
**Purpose:** Defines all TypeScript interfaces used across the app: Product, Order, User, Address, Review, ChatMessage, etc.

**Status:** ✅ Reviewed

---

## FILE 50: lib/firebase.ts
**Path:** `/lib/firebase.ts`
**Type:** Firebase client SDK initialization
**Purpose:** Initializes Firebase app, exports `auth`, `rtdb`, `firestore` instances.

**Status:** ✅ Reviewed

---

## FILE 51: lib/utils.ts
**Path:** `/lib/utils.ts`
**Type:** Utility functions
**Purpose:** Helper functions: `formatPKR` (currency formatting), `cn` (class merging), `getValidImageUrl` (Cloudinary URL handling).

**Status:** ✅ Reviewed

---

## FILE 52: lib/validations.ts
**Path:** `/lib/validations.ts`
**Type:** Zod validation schemas
**Purpose:** Defines form validation schemas: login, signup, checkout, product, category, review, profile.

**Status:** ✅ Reviewed

---

## FILE 53: lib/env.ts
**Path:** `/lib/env.ts`
**Type:** Environment variable loader
**Purpose:** Loads `.env.local` variables for client-side access.

**Status:** ✅ Reviewed

---

## FILE 54: app/globals.css
**Path:** `/app/globals.css`
**Type:** Global CSS
**Purpose:** Tailwind imports, custom theme colors (mango, leaf, slate, danger, etc.), scroll behavior, animation keyframes.

**Status:** ✅ Reviewed

---

## FILE 55: app/not-found.tsx
**Path:** `/app/not-found.tsx`
**Type:** Client component — 404 page
**Purpose:** Custom branded 404 page with mango emoji, friendly messaging, and action buttons. Navbar and Footer are rendered via the root layout.

### Layout:
- Large 🥭 emoji with floating 🍃 decoration
- "404" in mango brand color
- Friendly headline: "Looks like this page went mango-ing!"
- Subtext explaining the page wasn't found
- Two action buttons: Homepage + Browse Products

### Click Behavior:
1. **Click: "Go to Homepage" button** → Redirects to `/`
2. **Click: "Browse Products" button** → Redirects to `/products`

**Status:** ✅ Reviewed

---

# COMPLETE FILE INDEX

## Layouts (9 files)
1. `app/layout.tsx` — Root layout
2. `app/admin/layout.tsx` — Admin layout
3. `app/(auth)/layout.tsx` — Auth layout
4. `app/(public)/customer/layout.tsx` — Customer layout
5. `components/layout/Navbar.tsx` — User navbar
6. `components/layout/MobileMenu.tsx` — Mobile drawer
7. `components/layout/Footer.tsx` — Site footer
8. `components/layout/LayoutContext.tsx` — Layout state
9. `components/layout/Providers.tsx` — App providers

## Pages (21 files)
10. `app/page.tsx` — Home
11. `app/admin/page.tsx` — Admin dashboard
12. `app/admin/products/page.tsx` — Admin products
13. `app/admin/orders/page.tsx` — Admin orders
14. `app/admin/customers/page.tsx` — Admin customers
15. `app/admin/chat/page.tsx` — Admin chat
16. `app/admin/reports/page.tsx` — Admin reports
17. `app/admin/cms/page.tsx` — Admin CMS (placeholder)
18. `app/admin/settings/page.tsx` — Admin settings
19. `app/(auth)/login/page.tsx` — Login
20. `app/(auth)/signup/page.tsx` — Signup
21. `app/(public)/customer/page.tsx` — My Orders
22. `app/(public)/customer/profile/page.tsx` — Profile
23. `app/(public)/customer/wishlist/page.tsx` — Wishlist (placeholder)
24. `app/(public)/customer/orders/[id]/page.tsx` — Order detail
25. `app/(public)/products/page.tsx` — Products listing
26. `app/(public)/products/[slug]/page.tsx` — Product detail
27. `app/(public)/checkout/page.tsx` — Checkout
28. `app/(public)/checkout/success/page.tsx` — Order success
29. `app/chat/page.tsx` — Chat
30. `app/not-found.tsx` — 404

## Components (19 files)
31. `components/products/ProductCard.tsx`
32. `components/cart/CartDrawer.tsx`
33. `components/chat/ChatWidget.tsx`
34. `components/chat/ChatInterface.tsx`
35. `components/admin/chat/ChatList.tsx`
36. `components/admin/chat/ChatWindow.tsx`
37. `components/admin/chat/UserInfoPanel.tsx`
38. `components/ui/Button.tsx`
39. `components/ui/Input.tsx`
40. `components/ui/Textarea.tsx`
41. `components/ui/Badge.tsx`
42. `components/ui/Card.tsx`
43. `components/ui/Skeleton.tsx`
44. `components/ui/ImageUpload.tsx`
45. `components/ErrorBoundary.tsx`
46. `components/motion/index.ts`
47. `components/motion/ParallaxLayer.tsx`
48. `components/motion/SpringFade.tsx`
49. `app/admin/products/ProductModal.tsx`

## Lib/Types/Config (6 files)
50. `types/index.ts`
51. `lib/firebase.ts`
52. `lib/utils.ts`
53. `lib/validations.ts`
54. `lib/env.ts`
55. `app/globals.css`

---

**TOTAL: 55 front-end files documented**

## FILE 56: components/products/ChatButton.tsx
**Path:** `/components/products/ChatButton.tsx`
**Type:** Client component — Chat with seller button
**Purpose:** Button/link that opens chat with product context (product name, image, price passed as URL params).

### Props:
- `productId`, `productSlug`, `productName`, `productImage`, `productPrice` — Product info
- `variant`: 'button' (filled), 'icon' (just icon), 'outline' (outlined)
- `className` — Additional classes

### Click Behavior:
1. **Click: Any variant** → Redirects to `/chat?product={id}&name={name}&image={image}&price={price}`
   - Opens chat page with product info pre-filled in the chat interface

**Status:** ✅ Reviewed

---

## FILE 57: components/products/FilterSidebar.tsx
**Path:** `/components/products/FilterSidebar.tsx`
**Type:** Client component — Product filter sidebar
**Purpose:** Desktop sidebar + mobile overlay for filtering products by category and sorting.

### Props:
- `categories` — Array of category strings
- `selectedCategory` — Currently selected category
- `onCategoryChange(category)` — Callback when category changes
- `sortBy` — Current sort option
- `onSortChange(sort)` — Callback when sort changes
- `mobileOpen` — Whether mobile filter is open
- `onMobileClose()` — Callback to close mobile filter

### Layout:
- **Desktop:** Sticky sidebar on left side, always visible (`hidden lg:block`)
- **Mobile:** Overlay drawer from left, shown when `mobileOpen === true`

### Click Behavior:
1. **Click: Sort option** → Calls `onSortChange(value)` → Sorts products (newest, price-asc, price-desc, name-asc)
2. **Click: Category button** → Calls `onCategoryChange(cat)` → Filters by category
3. **Click: "All" category** → Calls `onCategoryChange('')` → Shows all products
4. **Click: X close button (mobile)** → Calls `onMobileClose()` → Closes mobile filter
5. **Click: Backdrop overlay (mobile)** → Calls `onMobileClose()` → Closes mobile filter

**Status:** ✅ Reviewed

---

## FILE 58: components/products/ReviewSystem.tsx
**Path:** `/components/products/ReviewSystem.tsx`
**Type:** Client component — Product review system
**Purpose:** Shows review summary, rating distribution, review form, and list of community reviews.

### Components/Hooks Used:
- `useReviews(productId)` — Fetches reviews, provides `submitReview(rating, comment)`
- `useAuth` — Gets `user`, `loginWithGoogle`
- `Button`, `Textarea` — Form components

### State:
- `rating` — Selected star rating (0-5)
- `hover` — Hovered star for preview
- `comment` — Review text
- `submitting` — Loading state during submission

### Sections:
1. **Left column:**
   - Average rating (large number + stars)
   - Rating distribution bars (5-star to 1-star)
   - Stats: Total feedback count, recommended percentage
2. **Right column:**
   - Review form (if logged in) or Sign in prompt (if not)
   - Community reviews list

### Click Behavior:
1. **Click: Star rating buttons (1-5)** → Sets `rating` state
2. **Click: Star hover** → Sets `hover` state for preview
3. **Click: Textarea** → Types review comment
4. **Click: "Post Review" button** → Calls `submitReview(rating, comment)`:
   - If success: Clears rating and comment
   - Shows toast success/error
5. **Click: "Sign in to Review" button** (if not logged in) → Calls `loginWithGoogle()`
6. **Review cards** — Display only (no click handlers)

### Conditional Rendering:
- If logged in → Shows review form with stars + textarea + submit
- If not logged in → Shows "Sign in to Review" with Google login button
- If loading → Shows skeleton cards
- If no reviews → Shows "No reviews yet" placeholder

**Status:** ✅ Reviewed

---

**TOTAL FRONT-END FILES DOCUMENTED: 58**

# PRODUCTION AUDIT & FIXES

## Issues Found & Fixed

### 1. Missing CSS Color Aliases (CRITICAL)
**Problem:** Multiple files used `text-dark`, `text-muted`, `bg-cream`, `bg-mango-soft`, `text-error`, `bg-error` which were NOT defined in `globals.css`. These would render as invisible/broken styles in production.

**Affected files (200+ class references across 12 files):**
- `app/admin/customers/page.tsx` — Uses `text-dark`, `text-muted`, `border-border/50`, `bg-surface-hover/50`, `bg-error/10`, `text-error`
- `app/admin/chat/page.tsx` — Uses `text-dark`, `text-muted`
- `app/chat/page.tsx` — Uses `bg-cream/40`
- `components/chat/ChatInterface.tsx` — Uses `text-dark`, `text-muted`, `bg-cream/50`, `bg-cream/20`, `border-border/50`
- `components/chat/ChatWidget.tsx` — Uses `animate-bounce-subtle` (missing animation)
- `components/admin/chat/ChatList.tsx` — Uses `text-dark`, `text-muted`, `bg-cream/30`, `bg-cream`, `border-border`
- `components/admin/chat/ChatWindow.tsx` — Uses `text-dark`, `text-muted`, `bg-cream/30`, `bg-cream/20`, `bg-cream`, `border-border/50`
- `components/admin/chat/UserInfoPanel.tsx` — Uses `text-dark`, `text-muted`, `bg-cream/50`, `bg-cream/30`, `border-border/50`, `border-border/30`
- `components/products/ChatButton.tsx` — Uses `text-muted`
- `components/products/ReviewSystem.tsx` — Uses `text-dark`, `text-muted`, `bg-cream`, `bg-surface`, `border-border/50`
- `components/products/FilterSidebar.tsx` — OK (uses slate colors correctly)

**Fix Applied:** Added color aliases to `app/globals.css`:
```css
--color-dark: #0F172A;
--color-muted: #94A3B8;
--color-cream: #F8FAFC;
--color-mango-soft: #FFF3E0;
--color-error: #EF4444;
--color-error-10: #FEF2F2;
--color-error-20: #FEE2E2;
--color-surface: #FFFFFF;
--color-surface-hover: #F8FAFC;
```

### 2. Missing CSS Opacity Utilities (CRITICAL)
**Problem:** Tailwind v4 doesn't auto-generate opacity utilities for custom theme colors. Classes like `bg-border/50`, `bg-cream/30`, `border-border/50` would be silently ignored.

**Fix Applied:** Added explicit `color-mix()` rules to `globals.css`:
```css
.bg-border\/50 { background-color: color-mix(in srgb, var(--color-border) 50%, transparent); }
.bg-border\/30 { background-color: color-mix(in srgb, var(--color-border) 30%, transparent); }
.border-border\/50 { border-color: color-mix(in srgb, var(--color-border) 50%, transparent); }
.bg-cream\/50 { background-color: color-mix(in srgb, var(--color-cream) 50%, transparent); }
.bg-cream\/30 { background-color: color-mix(in srgb, var(--color-cream) 30%, transparent); }
.bg-cream\/20 { background-color: color-mix(in srgb, var(--color-cream) 20%, transparent); }
.bg-error\/10 { background-color: color-mix(in srgb, var(--color-error) 10%, transparent); }
.bg-surface-hover\/30 { background-color: color-mix(in srgb, var(--color-surface-hover) 30%, transparent); }
.bg-surface-hover\/50 { background-color: color-mix(in srgb, var(--color-surface-hover) 50%, transparent); }
```

### 3. Missing Animation Keyframe (MEDIUM)
**Problem:** `animate-bounce-subtle` used in `ChatWidget.tsx` was not defined.

**Fix Applied:** Added keyframes to `globals.css`:
```css
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
```

## Component Connection Verification

### ✅ All Connections Verified Correct:
- `Navbar` → `MobileMenu` (opens from left) ✅
- `Navbar` → `CartDrawer` (via `useCart.toggleCart`) ✅
- `Navbar` → Profile avatar → `/admin` (if admin) or `/customer` (if user) ✅
- `Navbar` → Sign In → `/login` ✅
- `MobileMenu` → All nav links work correctly ✅
- `ProductCard` → Click card → `/products/[slug]` ✅
- `ProductCard` → Add to Cart → `useCart.addItem()` ✅
- `ChatButton` → `/chat?product=...` with query params ✅
- `ChatWidget` → `/chat` (only for non-admin logged-in users) ✅
- `ChatInterface` → Back arrow → `/products` ✅
- `ReviewSystem` → Submit review → `useReviews.submitReview()` ✅
- `FilterSidebar` → Category change → re-fetches products ✅
- `CartDrawer` → Checkout → `/checkout` ✅
- `Checkout` → Place Order → `/api/orders` → `/checkout/success` ✅
- `Admin Layout` → Sidebar → all 8 nav links ✅
- `Customer Layout` → Drawer → all 5 nav links ✅
- `ProductModal` → Create/Update → RTDB write ✅
- `Admin Orders` → Status dropdown → RTDB update ✅
- `Admin Customers` → Ban/Unban → RTDB update ✅
- `Admin Settings` → Text/Image updates → RTDB ✅

### ✅ Mobile/Desktop Layout Verification:
- **User pages:** Navbar on top (desktop + mobile), hamburger menu on mobile opens drawer from LEFT ✅
- **Admin pages:** Sidebar always visible on desktop, hamburger opens sidebar on mobile ✅
- **Customer pages:** Top bar with hamburger, drawer from left ✅
- **Auth pages:** Split screen on desktop, single column on mobile ✅
- **ChatWidget:** Bottom-right floating, hidden on admin pages ✅
- **Footer:** Hidden on admin/customer pages, visible on user pages ✅

## Build Verification
- `npm run build` — **PASSED** (0 errors, 0 warnings)
- All routes generated correctly
- No TypeScript errors

## Final Checklist
- [x] All CSS color aliases added
- [x] All CSS opacity utilities added
- [x] Missing animation keyframe added
- [x] All component connections verified
- [x] Mobile navigation verified (hamburger top-left, drawer from left)
- [x] Desktop navigation verified (sidebar visible, nav links work)
- [x] Admin layout verified (sidebar + top bar consistent)
- [x] Customer layout verified (top bar + drawer consistent)
- [x] Auth layout verified (responsive split screen)
- [x] Build passes with zero errors
- [x] No broken links or dead buttons
- [x] All routes accessible from navigation
