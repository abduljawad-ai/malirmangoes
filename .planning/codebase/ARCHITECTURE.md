# ARCHITECTURE.md - System Architecture

**Project:** Malir Mangoes  
**Date:** 2026-05-01

## Pattern
Next.js App Router with client-side React components.

## Data Flow
```
User Browser
    ↓
Next.js Pages (React)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase (Database, Auth, Storage)
```

## Components
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home | Landing page + ordering |
| `/dashboard` | Dashboard | User orders, chat, profile |
| `/admin` | Admin | Product & site management |

## State Management
- **Auth:** React Context (`AuthContext`)
- **Cart:** Local component state (useState)
- **Data:** Supabase queries (real-time fetch)

## Key Files
- `src/lib/supabase.ts` - Supabase client
- `src/context/AuthContext.tsx` - Auth provider
- `src/app/page.tsx` - Landing page
- `src/app/dashboard/page.tsx` - User dashboard
- `src/app/admin/page.tsx` - Admin panel

## User Roles
- `user` - Customer
- `seller` - Order processing
- `admin` - Full site control