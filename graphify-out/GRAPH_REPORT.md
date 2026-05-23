# Graph Report - .  (2026-05-23)

## Corpus Check
- Corpus is ~15,131 words - fits in a single context window. You may not need a graph.

## Summary
- 69 nodes · 65 edges · 23 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Dashboard Logic|Admin Dashboard Logic]]
- [[_COMMUNITY_Data Loading & Sitemap|Data Loading & Sitemap]]
- [[_COMMUNITY_ProductCard Interactions|ProductCard Interactions]]
- [[_COMMUNITY_Auth Middleware & API|Auth Middleware & API]]
- [[_COMMUNITY_Error Boundary Class|Error Boundary Class]]
- [[_COMMUNITY_Cart Context Provider|Cart Context Provider]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Robots Config|Robots Config]]
- [[_COMMUNITY_Admin Login Handler|Admin Login Handler]]
- [[_COMMUNITY_WhatsApp Icon|WhatsApp Icon]]
- [[_COMMUNITY_Navbar Scroll|Navbar Scroll]]
- [[_COMMUNITY_Image Fallback|Image Fallback]]
- [[_COMMUNITY_Instagram Icon|Instagram Icon]]
- [[_COMMUNITY_Image Uploader|Image Uploader]]
- [[_COMMUNITY_Facebook Icon|Facebook Icon]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next Env Types|Next Env Types]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Error Page|Error Page]]
- [[_COMMUNITY_Not Found Page|Not Found Page]]
- [[_COMMUNITY_Firebase Init|Firebase Init]]
- [[_COMMUNITY_AnimateOnScroll|AnimateOnScroll]]

## God Nodes (most connected - your core abstractions)
1. `showToast()` - 6 edges
2. `showError()` - 6 edges
3. `loadData()` - 5 edges
4. `handleSaveProduct()` - 5 edges
5. `handleDeleteProduct()` - 4 edges
6. `handleToggleStock()` - 4 edges
7. `handleSaveSettings()` - 4 edges
8. `async()` - 4 edges
9. `getProducts()` - 3 edges
10. `saveProduct()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `loadData()` --calls--> `getSettings()`  [INFERRED]
  src/app/product/[id]/page.tsx → src/lib/store.ts
- `handleDeleteProduct()` --calls--> `removeProduct()`  [INFERRED]
  src/app/admin/page.tsx → src/lib/store.ts
- `handleSaveSettings()` --calls--> `saveSettings()`  [INFERRED]
  src/app/admin/page.tsx → src/lib/store.ts
- `async()` --calls--> `saveSettings()`  [INFERRED]
  src/app/admin/page.tsx → src/lib/store.ts
- `middleware()` --calls--> `GET()`  [INFERRED]
  src/middleware.ts → src/app/api/auth/route.ts

## Communities

### Community 0 - "Admin Dashboard Logic"
Cohesion: 0.35
Nodes (9): async(), handleDeleteProduct(), handleSaveProduct(), handleSaveSettings(), handleToggleStock(), isValidUrl(), showError(), showToast() (+1 more)

### Community 1 - "Data Loading & Sitemap"
Cohesion: 0.22
Nodes (6): loadData(), sitemap(), getProducts(), getSettings(), removeProduct(), saveSettings()

### Community 2 - "ProductCard Interactions"
Cohesion: 0.25
Nodes (2): handleOrderNow(), buildWhatsAppUrl()

### Community 3 - "Auth Middleware & API"
Cohesion: 0.4
Nodes (4): middleware(), GET(), getCookieOptions(), POST()

### Community 4 - "Error Boundary Class"
Cohesion: 0.5
Nodes (0): 

### Community 5 - "Cart Context Provider"
Cohesion: 0.67
Nodes (0): 

### Community 6 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Robots Config"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Admin Login Handler"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "WhatsApp Icon"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Navbar Scroll"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Image Fallback"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Instagram Icon"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Image Uploader"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Facebook Icon"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Next Env Types"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Next Config"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Error Page"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Not Found Page"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Firebase Init"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "AnimateOnScroll"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Root Layout`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Robots Config`** (2 nodes): `robots()`, `robots.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Login Handler`** (2 nodes): `handleSubmit()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `WhatsApp Icon`** (2 nodes): `WhatsAppIcon.tsx`, `WhatsAppIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar Scroll`** (2 nodes): `onScroll()`, `Navbar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Image Fallback`** (2 nodes): `ImageWithFallback()`, `ImageWithFallback.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Instagram Icon`** (2 nodes): `InstagramIcon()`, `InstagramIcon.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Image Uploader`** (2 nodes): `handleUpload()`, `ImageUploader.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Facebook Icon`** (2 nodes): `FacebookIcon()`, `FacebookIcon.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Env Types`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Error Page`** (1 nodes): `error.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Not Found Page`** (1 nodes): `not-found.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Firebase Init`** (1 nodes): `firebase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AnimateOnScroll`** (1 nodes): `AnimateOnScroll.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `loadData()` connect `Data Loading & Sitemap` to `Admin Dashboard Logic`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `loadData()` (e.g. with `getSettings()` and `getProducts()`) actually correct?**
  _`loadData()` has 2 INFERRED edges - model-reasoned connections that need verification._