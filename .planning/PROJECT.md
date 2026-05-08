# Malir Mangoes — E-Commerce Showcase

## What This Is

A Pakistani mango e-commerce store where customers across Pakistan can browse premium mango varieties, place orders via website account or WhatsApp, and track their orders — with full admin/seller/buyer dashboard, real-time chat, and cash on delivery.

## Core Value

Customers across Pakistan can order premium mangoes effortlessly, whether they're tech-savvy shoppers or someone ordering via WhatsApp with one tap.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Product showcase landing page with mango varieties
- [ ] User registration/login with phone OTP support
- [ ] User profile with saved address, editable name
- [ ] Dashboard: orders, chat, history, profile, home
- [ ] WhatsApp one-tap ordering with order details pre-filled
- [ ] Admin panel: manage products, varieties, content from UI
- [ ] Seller panel: process orders, update status, chat with customers
- [ ] Order flow: select varieties → quantity → address confirm → submit
- [ ] Cash on delivery across Pakistan
- [ ] Image uploads for products via Supabase Storage
- [ ] Real-time chat between buyers and seller

### Out of Scope

- [Payment gateway integration] — Cash on delivery only
- [Multi-vendor marketplace] — Single seller/store only
- [Analytics dashboard] — Basic order tracking only for v1

## Context

- WhatsApp number: +923283181163
- Mango varieties (v1): Sindhri, Chaunsa, Langra, Dasheri, Anwar Ratol
- Packaging: 10kg boxes
- Delivery: All over Pakistan, Cash on Delivery
- Target users: Mobile-first, low-end devices, some users unfamiliar with websites

## Constraints

- **Tech Stack**: Next.js + TypeScript + Tailwind CSS + Supabase
- **Auth**: Supabase Auth (email/password, phone OTP)
- **Storage**: Supabase Storage (images, CDN-backed)
- **Database**: Supabase PostgreSQL with row-level security
- **Chat**: Supabase Realtime
- **WhatsApp**: wa.me deep link (no API cost)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------| |
| Supabase over Firebase | Better PostgreSQL, RLS, real-time, open-source | — Pending |
| wa.me for WhatsApp | Zero cost, immediate, works for non-technical users | — Pending |
| Mobile-first Tailwind | Lightweight, smooth on low-end devices | — Pending |
| No payment gateway | Cash on delivery simplifies v1, COD standard in Pakistan | — Pending |

---
*Last updated: 2026-05-01 after initialization*