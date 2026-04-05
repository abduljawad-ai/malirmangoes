# Cloudinary + Firebase Security Integration Plan

## Phase 1: Cloudinary Image Setup
### Goal: Replace local product images with Cloudinary-hosted images

1. **Install Cloudinary SDK**
   - Add `cloudinary` to package.json
   - Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to .env.local

2. **Create Cloudinary utility** (`lib/cloudinary.ts`)
   - Upload function for admin product images
   - URL builder for optimized image delivery
   - Auto-format (webp/avif) + auto-quality

3. **Create upload API route** (`app/api/upload/route.ts`)
   - Admin-only endpoint
   - Accepts multipart form data
   - Uploads to Cloudinary
   - Returns optimized URL

4. **Update ProductModal** (`app/admin/products/ProductModal.tsx`)
   - Replace URL input with file upload
   - Show upload progress
   - Preview uploaded image
   - Store Cloudinary URL in product data

5. **Update ProductCard + Product Detail**
   - Use Cloudinary URLs with responsive transformations
   - Auto-optimize format and quality
   - Lazy loading for non-critical images

6. **Update Home Page**
   - Replace local hero images with Cloudinary URLs
   - Use Cloudinary transformations for hero (crop, optimize)

## Phase 2: Firebase Security Rules Deployment
### Goal: Deploy corrected RTDB rules to Firebase

1. **Deploy RTDB Rules**
   - Copy rules from garbage/database.rules.json
   - Fix: `data.child('userId')` → `newData.child('userId')`
   - Fix: Remove `!data.exists()` from order write (allows status updates)
   - Paste into Firebase Console → Realtime Database → Rules → Publish

2. **Enable Firestore**
   - Enable Firestore in Firebase Console
   - Required for useSettings hook
   - Create `settings` collection with `site` document

3. **Verify RTDB Rules**
   - Test admin chat loads without permission errors
   - Test order creation succeeds
   - Test product CRUD works for admin

## Phase 3: Auth Security Improvements
### Goal: Strengthen authentication

1. **Session Cookie Security**
   - Already uses httpOnly, secure, strict sameSite
   - No changes needed

2. **Admin Verification**
   - Server-side admin check in `lib/auth-server.ts`
   - RTDB `admins/` collection as source of truth
   - No changes needed

## Phase 4: Performance Optimizations
### Goal: Fast load on weak connections

1. **Image Optimization**
   - Cloudinary auto-format (webp/avif)
   - Responsive sizes via `srcset`
   - Lazy loading below fold
   - Eager loading for hero/LCP images

2. **Code Splitting**
   - Already handled by Next.js
   - Dynamic imports for heavy components (charts)

3. **Bundle Size**
   - Removed 4 unused dependencies
   - Removed 18 unused files
   - Can further optimize by lazy-loading recharts

## File Changes Required
| File | Action |
|------|--------|
| `package.json` | Add `cloudinary` |
| `.env.local` | Add Cloudinary vars |
| `lib/cloudinary.ts` | New file |
| `app/api/upload/route.ts` | New file |
| `app/admin/products/ProductModal.tsx` | Add file upload |
| `app/page.tsx` | Update hero image URLs |
| `components/products/ProductCard.tsx` | Update image handling |
| `app/(public)/products/[slug]/page.tsx` | Update image handling |
| `hooks/useSettings.ts` | Update image upload to use Cloudinary |
| `app/admin/settings/page.tsx` | Update image upload UI |

## Order of Execution
1. Phase 2 (Firebase rules) — quickest fix, unblocks chat/orders
2. Phase 1 (Cloudinary) — biggest visual impact
3. Phase 4 (Performance) — optimization pass
4. Phase 3 (Auth) — already solid, verify only
