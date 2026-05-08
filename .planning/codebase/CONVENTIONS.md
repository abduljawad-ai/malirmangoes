# CONVENTIONS.md - Code Conventions

**Project:** Malir Mangoes  
**Date:** 2026-05-01

## Style
- TypeScript with React
- Client components marked with `'use client'`
- Tailwind CSS for styling

## Naming
- **Files:** kebab-case (`page.tsx`, `AuthContext.tsx`)
- **Components:** PascalCase (`Home`, `Dashboard`)
- **Hooks:** camelCase with `use` prefix (`useAuth`, `useState`)

## Patterns
```typescript
// Client component
'use client'
import { useState } from 'react'

// Auth hook
const { user, signIn, signOut } = useAuth()

// Supabase query
const { data } = await supabase.from('table').select('*')

// Real-time chat via auto-refresh (free tier)
useEffect(() => {
  const interval = setInterval(fetchMessages, 10000)
  return () => clearInterval(interval)
}, [])
```

## Error Handling
- Try/catch for async Supabase operations
- User-friendly error messages via alert()
- Loading states shown via spinner

## State
- Auth: React Context
- Cart: Component local state
- Data: Real-time Supabase queries