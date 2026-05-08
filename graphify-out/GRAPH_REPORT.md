# Graph Report - /home/jawad/Desktop/malirmangoes  (2026-05-01)

## Corpus Check
- Corpus is ~11,017 words - fits in a single context window. You may not need a graph.

## Summary
- 91 nodes · 104 edges · 19 communities detected
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Design System & UI Patterns|Design System & UI Patterns]]
- [[_COMMUNITY_Supabase Database Schema|Supabase Database Schema]]
- [[_COMMUNITY_Dashboard Orders Management|Dashboard Orders Management]]
- [[_COMMUNITY_Landing Page & Cart Logic|Landing Page & Cart Logic]]
- [[_COMMUNITY_Admin Panel & Product CRUD|Admin Panel & Product CRUD]]
- [[_COMMUNITY_Default Static Assets|Default Static Assets]]
- [[_COMMUNITY_API Routes|API Routes]]
- [[_COMMUNITY_Auth Context & Chat UI|Auth Context & Chat UI]]
- [[_COMMUNITY_Project Setup & Deployment|Project Setup & Deployment]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Profile Page|Profile Page]]
- [[_COMMUNITY_Sidebar Navigation|Sidebar Navigation]]
- [[_COMMUNITY_Agent Configuration|Agent Configuration]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Type Definitions|Next.js Type Definitions]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Supabase Client Library|Supabase Client Library]]

## God Nodes (most connected - your core abstractions)
1. `Design System Master File` - 13 edges
2. `Supabase Configuration` - 7 edges
3. `Orders Database Table` - 7 edges
4. `Row Level Security Policies` - 6 edges
5. `Users Database Table` - 5 edges
6. `Mango Varieties Database Table` - 4 edges
7. `Messages Database Table` - 4 edges
8. `Browser Window Icon` - 4 edges
9. `Globe Earth Icon` - 4 edges
10. `Document File Icon` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Vercel CLI Deployment` --conceptually_related_to--> `Vercel Platform Deployment`  [INFERRED]
  SETUP.md → README.md
- `User Mode Feature` --conceptually_related_to--> `Hero-Centric Conversion Pattern`  [INFERRED]
  SETUP.md → design-system/malir-mangoes/MASTER.md
- `CLAUDE References AGENTS` --references--> `Next.js Breaking Changes Warning`  [EXTRACTED]
  CLAUDE.md → AGENTS.md
- `ChatPage()` --calls--> `useAuth()`  [INFERRED]
  /home/jawad/Desktop/malirmangoes/src/app/dashboard/chat/page.tsx → /home/jawad/Desktop/malirmangoes/src/context/AuthContext.tsx
- `Browser Window Icon` --conceptually_related_to--> `Globe Earth Icon`  [INFERRED]
  public/window.svg → public/globe.svg

## Hyperedges (group relationships)
- **Supabase RLS-protected data layer** — setup_users_table, setup_orders_table, setup_messages_table, setup_rls_policies [INFERRED]
- **Three-mode role-based access system** — setup_user_mode, setup_seller_mode, setup_admin_mode [INFERRED]
- **UI component specification set** — master_button_components, master_card_components, master_input_components, master_modal_components [INFERRED]

## Communities

### Community 0 - "Design System & UI Patterns"
Cohesion: 0.18
Nodes (16): UI Anti-Patterns, Button Component Specs, Card Component Specs, Color Palette, Pre-Delivery Checklist, Design System Master File, Hero-Centric Conversion Pattern, Input Component Specs (+8 more)

### Community 1 - "Supabase Database Schema"
Cohesion: 0.27
Nodes (13): Admin Mode Feature, Environment Variables, Mango Varieties Database Table, Messages Database Table, Order Status Workflow, Orders Database Table, Row Level Security Policies, Seller Mode Feature (+5 more)

### Community 2 - "Dashboard Orders Management"
Cohesion: 0.31
Nodes (5): fetchMessages(), fetchOrders(), refreshMessages(), sendMessage(), updateOrderStatus()

### Community 3 - "Landing Page & Cart Logic"
Cohesion: 0.25
Nodes (0): 

### Community 4 - "Admin Panel & Product CRUD"
Cohesion: 0.32
Nodes (4): fetchVarieties(), handleDelete(), handleSaveProduct(), handleSignOut()

### Community 5 - "Default Static Assets"
Cohesion: 0.67
Nodes (7): Document File Icon, Globe Earth Icon, Next.js Framework Logo, Next.js Default Project Scaffold Assets, Public Static Assets Directory, Vercel Platform Logo, Browser Window Icon

### Community 6 - "API Routes"
Cohesion: 0.33
Nodes (1): GET()

### Community 7 - "Auth Context & Chat UI"
Cohesion: 0.4
Nodes (2): useAuth(), ChatPage()

### Community 8 - "Project Setup & Deployment"
Cohesion: 0.4
Nodes (5): Development Server, Next.js Font Optimization with Geist, Next.js Project, Vercel Platform Deployment, Vercel CLI Deployment

### Community 9 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Profile Page"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Sidebar Navigation"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Agent Configuration"
Cohesion: 1.0
Nodes (2): Next.js Breaking Changes Warning, CLAUDE References AGENTS

### Community 13 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Next.js Type Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Tailwind Config"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Supabase Client Library"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **11 isolated node(s):** `Development Server`, `Next.js Font Optimization with Geist`, `Environment Variables`, `User Role System`, `Order Status Workflow` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Root Layout`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Page`** (2 nodes): `page.tsx`, `handleSubmit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sidebar Navigation`** (2 nodes): `Sidebar.tsx`, `isActive()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agent Configuration`** (2 nodes): `Next.js Breaking Changes Warning`, `CLAUDE References AGENTS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Type Definitions`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Supabase Client Library`** (1 nodes): `supabase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User Mode Feature` connect `Design System & UI Patterns` to `Supabase Database Schema`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Orders Database Table` (e.g. with `Seller Mode Feature` and `WhatsApp Ordering Integration`) actually correct?**
  _`Orders Database Table` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `Next.js Default Project Scaffold Assets` (e.g. with `Browser Window Icon` and `Globe Earth Icon`) actually correct?**
  _`Next.js Default Project Scaffold Assets` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Development Server`, `Next.js Font Optimization with Geist`, `Environment Variables` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._