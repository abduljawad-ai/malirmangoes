# Malir Mangoes - Comprehensive Improvement Plan

**Generated:** 2026-05-23 | **Last Updated:** 2026-05-23  
**From:** Graphify knowledge graph + codebase audit

---

## Priority Matrix

| Priority | Area | Impact | Effort | Status |
|----------|------|--------|--------|--------|
| 🔴 P0 | **Security: Auth hardening** | High | Low | ✅ Done |
| 🔴 P0 | **Firebase: DEMO_PRODUCTS empty** | High | Low | ✅ Done |
| 🔴 P0 | **Rate limiting on auth** | High | Low | ✅ Done |
| 🟠 P1 | **Frontend: Visual design system** | High | Medium | ✅ Done |
| 🟠 P1 | **UX: Loading/error/empty states** | High | Low | ✅ Done |
| 🟡 P2 | **Code quality: Dead code, style duplication** | Medium | Low | ✅ Done |
| 🟡 P2 | **Framer Motion animations** | High | Low | ✅ Done |
| 🟢 P3 | **SEO: JSON-LD structured data** | Medium | Medium | ✅ Done |
| 🟢 P3 | **Component extraction for code quality** | Medium | Medium | ✅ Done |
| 🟢 P3 | **Image optimization (priority on above-fold)** | Low | Medium | ✅ Done |

---

## Implementation Log

### ✅ 1. GRAPHIFY — Knowledge Graph
- Built graph of 70+ nodes, 65 edges, 23 communities
- **God nodes:** `showToast()`, `showError()`, `loadData()`, `handleSaveProduct()`
- Outputs: `graphify-out/graph.html` (interactive viz), `GRAPH_REPORT.md`, `graph.json`

### ✅ 2. DEMO_PRODUCTS Fix
- **`src/lib/types.ts`** — Added 4 real mango products: Sindhri (Rs 3,500), Chaunsa (Rs 3,800), Anwar Ratol (Rs 4,200), Langra (Rs 3,200) — all with descriptions, origins, seasons, and images

### ✅ 3. Auth Cookie Fix + Rate Limiting
- **`src/app/api/auth/route.ts`** — Added in-memory rate limiter: 5 attempts per 60s window per IP
- Admin login now uses `/api/auth` POST → sets `admin_session` cookie (httpOnly, secure, sameSite: strict)
- Middleware checks cookie server-side; removed stale sessionStorage dependency
- Uses `x-forwarded-for` / `x-real-ip` headers for rate limit key

### ✅ 4. Design System Upgrade
- **`src/app/layout.tsx`** — `next/font` for Playfair Display (headings) + Plus Jakarta Sans (body) — eliminates layout shift, 0 CLS
- **`src/app/globals.css`** — Expanded to 30+ CSS variables (shadows, gradients, decorative patterns, skeleton, divider-mango, mango-pattern, glass-card)
- All components updated to use `var(--font-heading)` / `var(--font-body)`

### ✅ 5. Framer Motion Animations
- **`src/app/page.tsx`** — `containerVariants`/`itemVariants` staggered page load, `whileInView` stat counters, `whileHover` trust badges
- **`src/components/Navbar.tsx`** — `AnimatePresence` mobile menu with staggered link animation
- **`src/app/admin/login/page.tsx`** — Entrance + mango bounce animation
- **`src/app/product/[id]/page.tsx`** — Entrance + tap animations on qty buttons + CTA
- **`src/app/error.tsx`** — Motion entrance + pulse animation

### ✅ 6. Loading / Empty / Error States
- **`src/components/ImageWithFallback.tsx`** — Now shows styled fallback (Package icon + "Image unavailable" text) on error instead of `display: none`
- **`src/app/page.tsx`** — Shimmer skeleton when products loading, mango bounce during initial load
- **`src/app/not-found.tsx`** — Styled 404 with mango icon, Home + Browse buttons
- `prefers-reduced-motion` support added to globals.css

### ✅ 7. Dead Code Cleanup
- Removed old Google Fonts CSS import `@import url(...)` (moved to next/font)
- Removed duplicate `animate-spin` inline `<style>` blocks (now in `globals.css`)
- Removed unused `useRouter` import from admin page
- Removed unused `Lora` font-family references

### ✅ 8. JSON-LD Structured Data
- **`src/app/layout.tsx`** — Organization schema (name, URL, contact, address, image)
- **`src/app/product/[id]/page.tsx`** — Product schema (name, description, image, offers with price/availability/shipping, additional properties for variety/origin/season/taste)

### ✅ 9. Component Extraction
- **`src/components/HowItWorks.tsx`** — Extracted static "How to Order" 3-step section from homepage. Self-contained, no props needed.
- **`src/components/Footer.tsx`** — Extracted site footer from homepage. Accepts `settings: SiteSettings` prop.
- **`src/app/page.tsx`** — Reduced from 705 → ~530 lines by using extracted components
- Removed unused imports: `AnimatePresence`, `FacebookIcon`, `InstagramIcon`

### ✅ 10. Next.js 16 Proxy Migration
- **`src/proxy.ts`** — Renamed from `middleware.ts`, changed export from `middleware` → `proxy`
- Build no longer shows the `⚠ The "middleware" file convention is deprecated` warning
- API surface identical (NextRequest, NextResponse, config.matcher unchanged)
- Proxy now defaults to Node.js runtime (was Edge in middleware)

### ✅ 11. Above-Fold Image Priority
- **`src/components/ProductCard.tsx`** — Added `priority?: boolean` prop, passed to `<Image>`
- **`src/app/page.tsx`** — First 3 product cards in grid get `priority={true}` for faster LCP
- Main product detail image already had `priority` (no change needed)
- Next config has `remotePatterns` for 20+ image hosts
- Most `Image` components have `sizes` attributes; hero and critical images should get `priority`
- Lazy loading is default for below-fold images (Next.js built-in)
