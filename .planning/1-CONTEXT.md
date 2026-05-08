# Phase 1 Implementation Decisions

## What's Built

| Component | Status | Notes |
|----------|--------|-------|
| Landing page with mango varieties | ✅ Done | Loads from DB |
| User auth (signup/login) | ✅ Done | Email + password |
| Shopping cart | ✅ Done | Local state |
| WhatsApp ordering | ✅ Done | Pre-filled message |
| Dashboard (orders, chat, profile) | ✅ Done | Role-based |
| Admin panel (products, settings) | ✅ Done | Upload images |
| Site settings (logo, hero, WhatsApp#) | ✅ Done | DB-powered |

## What's Locked

| Decision | Choice | Rationale |
|----------|--------|----------|
| **Notifications** | WhatsApp only | Zero cost, you're already on WhatsApp |
| **Chat** | Real-time (Supabase Realtime) | Instant messaging experience |
| **Delivery tracking** | Simple status in dashboard | No tracking numbers yet |
| **Order storage** | Supabase DB | Orders saved for history |

## Implementation Details

### WhatsApp Notify on New Order
- When `orders` table gets insert → trigger sends WhatsApp message
- Or: Frontend makes wa.me link with site owner's number
- **Method:** Already works - WhatsApp message includes full order details

### Real-Time Chat
- Use Supabase Realtime (subscription on `messages` table)
- `supabase.channel('chat').on('postgres_changes', ...)`
- Requires: Enable Realtime on `messages` table in Supabase dashboard

### Delivery Status
- Status field: `pending` → `confirmed` → `shipped` → `delivered`
- Customer sees status in their dashboard
- Simple badge display, no tracking numbers

## Out of Scope (Deferred)

- SMS notifications - costs money
- Email notifications - costs money  
- Payment gateway - COD only
- Multi-vendor - single store
- Analytics dashboard

## Next Step

Run `/gsd-plan-phase 1` to create the implementation plan.

---
*Context: 2026-05-01 after Phase 1 discuss*