# UI Rewrite Plan — Tiny Component Architecture

**Goal:** Replace all monolithic page files with a forest of single-responsibility components. Every visual section, modal, form, badge, and layout wrapper gets its own file. No file exceeds 100 lines (except pages themselves, which are just orchestrators).

---

## Guiding Principles

1. **One concern per file** — a component does one thing and does it well
2. **Pages are pure orchestrators** — they import, compose, pass props. Zero inline JSX of their own.
3. **Props over context where possible** — context (CartContext) is fine for cross-cutting state, but section-level data flows via props
4. **Shared primitives extracted** — buttons, badges, stat cards, toast notifications become reusable
5. **No style duplication** — all CSS variables live in `globals.css`, components reference them by `var(--xxx)`

---

## Proposed File Structure

```
src/
  app/
    layout.tsx                          # Root layout — fonts, metadata, CartProvider, ErrorBoundary
    globals.css                         # Design tokens, animations, utility classes
    error.tsx                           # Error boundary page (already well-structured)
    not-found.tsx                       # 404 page (already well-structured)
    proxy.ts                            # Auth guard

    page.tsx                            # Homepage orchestrator — imports sections, loads data, composes
    components/                         # ★ Sections specific to the homepage (kept close to route)
      home/
        LoadingSkeleton.tsx              # Full-screen mango bounce loading state
        Hero.tsx                         # Full-screen hero with slider background, text, CTAs, feature pills
        DeliveryBanner.tsx               # Green bar: "Leopard delivery — Rs X per box"
        ProductsSection.tsx              # Section wrapper with heading, sub, grid, empty state
        ProductGrid.tsx                  # Grid of ProductCard items with AnimateOnScroll wrapper
        EmptyProducts.tsx                # Mango bounce empty state
        AboutSection.tsx                 # Image + text side-by-side with stats
        AboutImage.tsx                   # Single about image with ImageWithFallback
        AboutTextContent.tsx             # Subtitle, title, body, stat cards
        StatCard.tsx                     # Single stat (value, label)
        CustomSectionBlock.tsx           # One custom section (image + text, position-aware)
        TrustBadges.tsx                  # 4-column grid of badge cards
        TrustBadgeCard.tsx               # Single trust badge (icon, title, desc)
        ContactCTA.tsx                   # WhatsApp CTA section

    admin/
      login/
        page.tsx                        # Login page orchestrator
        components/
          LoginForm.tsx                  # Form with password input, show/hide, submit
          LoginHeader.tsx                # Mango icon + title + subtitle
          LoginError.tsx                  # Error message with motion animation

      page.tsx                           # Admin dashboard orchestrator
      components/
        AdminHeader.tsx                  # Sticky header with logo, farm name, view store, sign out
        AdminLoading.tsx                 # Loading spinner state
        Toast.tsx                        # Success toast notification
        ToastError.tsx                   # Error toast notification
        TabBar.tsx                       # Products | Sections | Settings tabs
        TabButton.tsx                    # Single tab button
        ProductsTab.tsx                  # Products panel — list + empty state + add button
        ProductListItem.tsx              # A single product row in the admin list (image, name, badge, actions)
        ProductListItemBadge.tsx         # Featured / In Stock badge
        ToggleSwitch.tsx                 # Reusable toggle (in stock / featured)
        ProductFormModal.tsx             # Modal wrapper (overlay, close, scroll)
        ProductForm.tsx                  # Form fields array + validation + save
        ProductFormField.tsx             # Single form field (label, hint, input/textarea/imageuploader)
        ImageListEditor.tsx              # Add/remove/upload multiple images
        ImageListItem.tsx                # Single image row in editor
        SectionsTab.tsx                  # Custom sections panel
        SectionListItem.tsx              # Single section row in list (image, title, subtitle, actions)
        SectionFormModal.tsx             # Modal wrapper for section editing
        SectionForm.tsx                  # Section form fields + image position select
        SettingsTab.tsx                  # Settings panel
        SettingsField.tsx                # Single settings field (label, hint, input/textarea/imageuploader)
        HeroImageListEditor.tsx          # Hero slider image list with add/remove

    product/
      [id]/
        page.tsx                         # Product detail orchestrator
        components/
          ProductDetailLoading.tsx        # Spinner loading state
          ProductNotFound.tsx             # Not-found state with link home
          ProductDetailHeader.tsx         # Back button + title
          ProductImageGallery.tsx         # Square image with prev/next/dots
          ImageNavButton.tsx             # Single chevron button
          ImageDots.tsx                   # Dot indicators
          ProductInfo.tsx                 # Name, price, season/taste badges
          ProductTagBadge.tsx             # Single tag (season, taste)
          ProductDescription.tsx          # Description paragraph
          QuantitySelector.tsx            # - / count / + with weight display
          QtyButton.tsx                  # Single +/- button
          OrderSummaryCard.tsx            # Subtotal, delivery, total breakdown
          OrderSummaryRow.tsx             # Single line item
          StickyOrderBar.tsx              # Bottom sticky CTA — WhatsApp or Out of Stock

  components/                            # ★ Shared/reusable components
    ui/
      AnimateOnScroll.tsx                # IntersectionObserver fade-up (already exists)
      ImageWithFallback.tsx              # Next/Image with fallback (already exists)
      Button.tsx                         # Unified button with variants (primary, whatsapp, ghost)
      Badge.tsx                          # Small colored pill (used in admin + product detail)
      Modal.tsx                          # Reusable modal overlay with close
      SectionHeading.tsx                 # Section label + title + subtitle pattern
      StatCard.tsx                       # Value + label (reused in about + admin)
      Toast.tsx                          # Generic toast notification
    icons/
      WhatsAppIcon.tsx                   # (already exists)
      FacebookIcon.tsx                   # (already exists)
      InstagramIcon.tsx                  # (already exists)
    layout/
      Navbar.tsx                         # Fixed header with scroll, mobile menu (already exists)
      NavLinks.tsx                       # Desktop nav link list
      NavLink.tsx                        # Single nav link
      CartBadge.tsx                      # Cart icon with count badge
      MobileMenu.tsx                     # AnimatePresence mobile menu
      MobileMenuLink.tsx                 # Single mobile menu link
      Footer.tsx                         # Site footer (already exists)
      FooterBrand.tsx                    # Logo + name + location
      FooterLinks.tsx                    # Quick links column
      FooterContact.tsx                  # WhatsApp + social icons
    commerce/
      ProductCard.tsx                    # Product card (already exists)
      ProductCardImage.tsx               # Image with hover zoom
      ProductCardBadges.tsx              # Featured + tags
      ProductCardActions.tsx             # Qty controls + order/add buttons
      QuantityControl.tsx                # - / count / + (reused in card + detail)

  lib/
    types.ts                             # Shared types (no change needed)
    store.ts                             # Firebase persistence (no change needed)
    CartContext.tsx                       # Cart context (no change needed)
```

---

## Pages as Pure Orchestrators

### `page.tsx` (homepage)
```tsx
export default function Home() {
  const [settings, products, loading] = useSiteData();
  if (loading || !settings) return <LoadingSkeleton />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Navbar farmName={settings.farm_name} logoUrl={settings.logo_url} />
      <Hero settings={settings} heroImages={settings.hero_image_urls || []} />
      <DeliveryBanner charge={settings.delivery_charge} />
      <ProductsSection products={products} settings={settings} />
      <HowItWorks />
      <AboutSection settings={settings} productCount={products.length} />
      {settings.custom_sections?.map(s => <CustomSectionBlock key={s.id} section={s} />)}
      <TrustBadges charge={settings.delivery_charge} />
      <ContactCTA whatsapp={settings.whatsapp_number} />
      <Footer settings={settings} />
    </motion.div>
  );
}
```
★ ~40 lines. Every section is a named import.

### `admin/page.tsx`
```tsx
export default function AdminDashboard() {
  // state, handlers, data loading
  if (loading) return <AdminLoading />;
  return (
    <>
      <Toast ... />
      <ToastError ... />
      <AdminHeader settings={settings} onLogout={logout} />
      <TabBar active={tab} onChange={setTab} />
      {tab === 'products' && <ProductsTab ... />}
      {tab === 'sections' && <SectionsTab ... />}
      {tab === 'settings' && <SettingsTab ... />}
      {showAddForm && <ProductFormModal ... />}
      {showSectionForm && <SectionFormModal ... />}
    </>
  );
}
```
★ ~100 lines. No inline JSX blocks.

---

## Implementation Order

| Phase | What | Files | Est. |
|-------|------|-------|------|
| 1 | **Shared primitives** — Button, Badge, Modal, SectionHeading, Toast, StatCard | 6 files | 30 min |
| 2 | **Homepage sections** — extract Hero, DeliveryBanner, AboutSection, TrustBadges, ContactCTA | 12 files | 45 min |
| 3 | **Product detail sections** — extract ImageGallery, QtySelector, OrderSummary, StickyBar | 10 files | 30 min |
| 4 | **Admin sub-components** — extract header, tabs, list items, forms, modals | 22 files | 60 min |
| 5 | **Navbar decomposition** — NavLinks, MobileMenu, CartBadge | 4 files | 15 min |
| 6 | **Commerce primitives** — ProductCard decomposition | 3 files | 10 min |
| 7 | **Cleanup & test** — remove unused imports, verify build, smoke test | — | 15 min |

**Total:** ~3 hours of focused work, ~57 new component files.

---

## Migration Strategy

Do NOT do everything at once. The rewrite should proceed section-by-section:

1. Create a new component file (e.g., `home/Hero.tsx`)
2. Copy the JSX from `page.tsx` into it
3. Replace the inline JSX in `page.tsx` with `<Hero ... />`
4. Build & verify
5. Repeat

This is zero-risk because you're extracting, not rewriting — no logic changes, only file moves. If a build breaks, you know exactly which section caused it.

---

## What Stays the Same

- `layout.tsx` (no change — fonts, metadata, providers are fine)
- `error.tsx` (already well-structured at 144 lines)
- `not-found.tsx` (already well-structured at 111 lines)
- `proxy.ts` (no change)
- `globals.css` (design tokens stay — they're the source of truth)
- `lib/store.ts` (Firebase persistence — UI-agnostic)
- `lib/types.ts` (types are fine)
- `lib/CartContext.tsx` (context is fine)
- All icons (`WhatsAppIcon`, `FacebookIcon`, `InstagramIcon`)

---

## Line Count Targets

| File | Now | Target |
|------|-----|--------|
| `page.tsx` | 530 | ~40 |
| `admin/page.tsx` | 753 | ~100 |
| `product/[id]/page.tsx` | 279 | ~40 |
| `admin/login/page.tsx` | 163 | ~30 |
| `components/Navbar.tsx` | 243 | ~30 (orchestrator) |
| `components/ProductCard.tsx` | 298 | ~40 (orchestrator) |

All extracted components: **≤80 lines** each.
