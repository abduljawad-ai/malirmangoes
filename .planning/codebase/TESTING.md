# TESTING.md - Testing Approach

**Project:** Malir Mangoes  
**Date:** 2026-05-01

## Current Testing
- No formal test suite configured
- Manual testing via browser

## Build Verification
```bash
npm run build   # TypeScript + Next.js build
```

## Manual Test Checklist
- [ ] Landing page loads with mangoes
- [ ] Add to cart works
- [ ] WhatsApp order opens correct link
- [ ] User signup/login works
- [ ] Dashboard shows orders
- [ ] Admin panel saves products
- [ ] Site settings update

## Commands
```bash
npm run dev     # Development server
npm run build   # Production build
npm run start   # Production server
npm run lint   # ESLint
```

## Dependencies for Future
- Jest (unit tests)
- React Testing Library
- Playwright (e2e)