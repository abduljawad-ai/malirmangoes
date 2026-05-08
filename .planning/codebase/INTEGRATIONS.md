# INTEGRATIONS.md - External Integrations

**Project:** Malir Mangoes  
**Date:** 2026-05-01

## Database
- **Service:** Supabase (PostgreSQL)
- **Tier:** Free tier
- **Tables:**
  - `users` - User profiles with roles
  - `mango_varieties` - Product catalog
  - `orders` - Order records
  - `messages` - Chat messages
  - `site_settings` - Site configuration

## Authentication
- **Provider:** Supabase Auth
- **Methods:** Email/password

## Storage
- **Service:** Supabase Storage
- **Bucket:** `mango-images`
- **Purpose:** Product images, site logo, hero images

## External Services
| Service | Purpose | Cost |
|---------|---------|------|
| WhatsApp (wa.me) | Order notifications | Free |
| Supabase Database | Data storage | Free tier |
| Supabase Auth | User authentication | Free tier |
| Supabase Storage | Image storage | Free tier (1GB) |

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```