# STRUCTURE.md - Directory Structure

**Project:** Malir Mangoes  
**Date:** 2026-05-01

## Directory Layout
```
malirmangoes/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page (Home)
│   │   ├── layout.tsx       # Root layout
│   │   ├── globals.css      # Global styles
│   │   ├── dashboard/
│   │   │   └── page.tsx     # User dashboard
│   │   └── admin/
│   │       └── page.tsx     # Admin panel
│   ├── context/
│   │   └── AuthContext.tsx   # Auth provider
│   └── lib/
│       └── supabase.ts      # Supabase client
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.mjs
└── .env.local
```

## Key Locations
| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Main store page |
| `src/app/dashboard/page.tsx` | User dashboard |
| `src/app/admin/page.tsx` | Admin panel |
| `src/lib/supabase.ts` | DB client |
| `src/context/AuthContext.tsx` | Auth |