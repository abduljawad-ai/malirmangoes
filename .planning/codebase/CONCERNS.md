# CONCERNS.md - Technical Concerns

**Project:** Malir Mangoes  
**Date:** 2026-05-01

## Current Concerns

### No Formal Tests
- No test suite configured
- Manual verification only
- Build passes but runtime not tested

### Security
- Supabase RLS policies required
- No rate limiting
- No input sanitization beyond React

### Performance
- No image optimization
- No caching layer

## Fixed Issues

### Chat (Resolved)
- Added manual refresh button with icon
- Auto-refresh every 10 seconds when on chat tab
- No paid Realtime subscription needed

### Hardcoded Fallbacks
- Default varieties in page.tsx if DB empty
- Default site settings as fallback
- Works without Supabase connection

## Priority Fixes Needed
1. Enable Supabase RLS policies
2. Add test suite