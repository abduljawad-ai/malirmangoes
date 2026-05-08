# Codebase Analysis: Malir Mangoes

## Issues Found

### 1. Critical: Hardcoded Data Instead of Supabase
**File:** `src/app/page.tsx`
- WhatsApp number hardcoded: `const WHATSAPP_NUMBER = '923283181163'` (line 9)
- Mango varieties hardcoded in array instead of loading from `mango_varieties` table (lines 11-17)
- Site settings loaded from code instead of `site_settings` table

**Fix needed:** Fetch these from Supabase or use site_settings table.

### 2. Admin Panel Saves hero_image But Page Doesn't Use It
- Admin saves `hero_image` but homepage renders hardcoded hero section
- No hero image display on landing page

### 3. Auth Context Missing Phone Field
- User type has `phone?: string` but login/signup doesn't capture phone number
- No OTP login support despite Pakistan-ready

### 4. Chat Feature Incomplete
- Dashboard has chat tab but send message button doesn't work
- No actual message sending functionality

### 5. Order Status Updates Have Bug
- Query in dashboard line 34 builds incorrectly for admin:
```js
query = query.eq('user_id', user.id)
```
This would fail since `user.id` is UUID, not string in query.

### 6. Images Not Loading
- Admin panel uploads to Supabase Storage but no image preview in landing page
- Product images not displayed on homepage

### 7. Missing Environment Variable Check
- No fallback if Supabasecredentials are missing
- App will crash silently

---

## Action Items

1. **Replace hardcoded data with Supabase queries**
2. **Fix hero image loading and display** 
3. **Implement working chat**
4. **Fix order query bug**
5. **Add image display to products**

Run `/gsd-plan-phase 1` after fixes to verify.