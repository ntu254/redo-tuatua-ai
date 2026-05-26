# Anchored Summary — AI Virtual Stylist

## Goal
Build AI Virtual Stylist web app with real Supabase backend — all services (admin + user-facing) connected, auth with role/ban check, dialog consistency fixed.

## Constraints & Preferences
- Feature-based structure: `app/`, `shared/`, `features/[domain]/`
- Tech stack: React 18 + TypeScript, Vite, Tailwind, shadcn/ui, TanStack React Query, Framer Motion
- Supabase as backend (anon key on frontend, service role key for seed scripts)
- Admin auth with RBAC (4 roles, 10 modules, permission guards, dedicated login page)
- `VITE_USE_MOCK_API=false` — services query Supabase directly, mock fallback still present per-service
- Startup AI MVP priority: AI recommendation, affiliate conversion, retention, speed, viral UX
- Single `dialog` discriminated union state pattern for all admin pages (prevents dual overlays)
- `DialogContent` built-in close button used exclusively (no manual `<Button><X/></Button>` inside dialogs)

## Progress
### Done
- **All admin pages**: double-overlay bug fixed — every page uses single `dialog` discriminated union state instead of multiple `useState`
- **AdminProducts/AdminNotifications/AdminFeedback/AdminTrends**: duplicate X buttons removed (built-in `DialogContent` close button suffices)
- **Auth role/ban check**: `auth.service.ts` `login()` now fetches profile → checks `is_banned` (throws error with `ban_reason`) → calls `is_admin_user()` RPC → returns `role` in `AuthResult`. Same check in `getSession()` for page refreshes
- **AuthContext (`useAuth.tsx`)**: exposes `role: 'user' | 'admin' | null` and `is_banned: boolean`
- **LoginPage**: admin users redirected to `/admin` instead of original `from` location
- **ProtectedRoute**: banned accounts show blocked message (not silent redirect)
- **ResetPasswordPage**: redirects to `/login` instead of `/profile`
- **deleteAccount service**: cleans up `analytics_events`, `outfit_items`, `outfits`, `wardrobe_items` before calling `delete_my_account` RPC
- **Phase 1 — user-facing services**: all 5 services migrated to Supabase dual-path pattern:
  - `RecommenderService`: reads `outfits` table, falls back to `MOCK_OUTFITS` array
  - `WardrobeService`: reads `wardrobe_items` + `outfits` tables, computes analysis aggregates
  - `TrendsService`: reads `fashion_trends` table, groups by season
  - `QuizService` (new): saves `style_dna`, `favorite_colors`, `preferred_styles`, `preferred_occasions`, `budget_min/max` to `profiles`
  - `StyleProfileService` (new): reads `profiles` table, constructs `StyleProfile` shape with fallback
- **QuizPage**: now saves quiz answers via `quizService.completeQuiz()` on "analyzing" phase start
- **Routes**: `/recommender`, `/wardrobe`, `/trends`, `/style-profile`, `/quiz` wrapped in `ProtectedRoute`
- **Phase 2 — Profile & Preferences**: already fully wired to Supabase via `profileService`:
  - `ProfilePanel`: saves `preferred_styles`, `favorite_colors`, `preferred_occasions`, `budget_min`, `budget_max`, `body_size`, `display_name` to `profiles` table
  - `NotificationsPanel`: reads/writes `user_notification_preferences` table
  - `SecurityPanel`: password/2FA handled via inline Supabase queries
- **Phase 3 — Subscription & Credits**: already fully wired to Supabase:
  - `SubscriptionPanel`: queries `subscriptions` + `plans` + `user_credits` + `payments` + `invoices` directly from Supabase
- **Build passes**: 4010 modules, clean production build

### In Progress
- (none)

### Blocked
- **Direct DB connection**: `db.<ref>.supabase.co` only resolves to IPv6, Node.js can't connect — must use SQL Editor for DDL
- **Admin CRUD operations (write) fail with 403** if RLS policies not applied — paste `supabase/migrations/00004_foundation_auth_profile_rls.sql` into Supabase SQL Editor (already has `drop policy if exists` before every `create policy`, safe to run as-is)

## UX Audit (2026-05-26)
### Current Rating: 7.5/10 → 9/10 achievable
| Category | Score |
|---|---|
| Visual Design | 9/10 |
| Branding Consistency | 8.5/10 |
| Fashion/Lifestyle Feeling | 9/10 |
| AI Product Feeling | 7/10 |
| Conversion Optimization | 6.5/10 |
| Information Hierarchy | 6/10 |
| Realistic Product UX | 7/10 |

### Strengths
- **Visual identity**: beige/cream/orange accent palette fits fashion/lifestyle/AI stylist perfectly
- **Card layout**: spacing, typography, aesthetic match fashion app standards
- **Filter chips**: Casual/Streetwear/K-Fashion matches user behavior
- **AI Assistant sidebar**: right direction but underpowered

### Critical Issues to Fix
1. **AI chat too weak** — sidebar is a static helper box, needs to be a conversational stylist (center of UX). Should accept natural language ("outfit đi cafe tối nay tone đen budget dưới 800k") and respond with dynamic outfit generation
2. **Outfit cards lack "wow"** — flat clothing images, no emotional output. Need AI try-on preview (AI-generated fashion humans on real models, not flat lays). Even mock humans increase perceived value
3. **"Mua outfit" CTA unconvincing** — needs redesign to "Shop This Look" with explicit item breakdown, price per item, and affiliate platform badges (Shopee · Lazada · Zalora)
4. **Missing personalization** — all outfits look generic. Need "Based on your wardrobe", "Matches your style profile", "Based on your saved outfits" labels
5. **Information hierarchy loose** — too much whitespace, AI explanation dominates while item recommendations are buried. Card structure should be: TOP (tags + score) → CENTER (try-on image) → BOTTOM (items + price + CTA)
6. **Mobile UX not optimized** — app is mobile-first but desktop-focused. Need: swipe outfits, like/dislike, regenerate (TikTok/Tinder/Pinterest pattern)

### Direction
Transform from "Pinterest fashion board" to "AI stylist app" by increasing:
- AI interaction (dynamic prompts, regenerate, more casual/cheaper/luxury variants)
- Personalization (wardrobe-aware recommendations)
- Conversational UX (sidebar = "Your AI Stylist" with multi-turn dialogue)
- Try-on visualization (AI humans, not flat lays)

## Key Decisions
- All admin pages now use single `dialog` discriminated union state — prevents dual overlays from multiple `useState` variables being `true` simultaneously
- Custom X buttons removed from all dialogs — shadcn `DialogContent` already renders a close button automatically
- Auth login checks banned status first (before returning session) — banned users are signed out immediately with error message
- Quiz answers saved server-side to `profiles` table on completion — uses `quizService.completeQuiz()` which maps UI answers to DB fields
- User-facing services follow same dual-path pattern as admin: `if (!apiConfig.useMockApi) { supabase query } else { apiClient.get() }`, with mock fallback within the Supabase path when no data found
- All app routes (recommender, wardrobe, trends, style-profile, quiz) now behind `ProtectedRoute`
- ProfilePage uses inline component definitions (`ProfilePanel`, `NotificationsPanel`, `SubscriptionPanel`, `SecurityPanel`, `DangerPanel`) rather than separate files

## Next Steps
1. **Apply RLS**: paste `supabase/migrations/00004_foundation_auth_profile_rls.sql` into Supabase SQL Editor (safe — uses `drop policy if exists` before each `create policy`)
2. **Phase 5 — Recommender UX overhaul** (highest impact):
   - **Rewrite AI sidebar** as conversational stylist (multi-turn dialogue, context-aware, dynamic outfit generation)
   - **Replace flat lay images** with AI-generated fashion human models (try-on preview)
   - **Redesign "Mua outfit" → "Shop This Look"**: item breakdown, price per item, affiliate platform badges
   - **Add personalization labels**: "Based on your wardrobe", "Matches your style profile"
   - **Fix card information hierarchy**: TOP (tags + score) → CENTER (human model image) → BOTTOM (items + price + CTA)
   - **Add AI actions**: [Regenerate], [More Casual], [More Luxury], [Cheaper Version]
3. **Phase 5 — Mobile UX**: swipe outfit, like/dislike, regenerate gesture (TikTok/Tinder/Pinterest pattern)
4. **Phase 5 — Saved Outfits page**: build dedicated page listing user's saved outfits (read from `outfits` + `outfit_items` tables)
5. **Phase 5 — Seed production data**: run seed scripts for fashion trends, products, AI models, plans, admin accounts
6. **Phase 5 — Notification settings**: notification preferences already saved to `user_notification_preferences` table; wire device push tokens when ready

## Critical Context
- Build passes (Vite production) — 4010 modules
- Admin login WORKS (RPC fix) but admin CRUD operations (write) fail with 403 if RLS policies not applied
- 429 and widget-loader console errors are external (ipapi.co rate limit, Supabase widget) — not project issues
- `test@redo.ai` / `Test123456!` exists as auth user + super_admin in admin_users
- `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_USE_MOCK_API=false`
- `VITE_USE_MOCK_API` defaults `true`, `.env` overrides to `false` — all services check this boolean for Supabase vs mock path
- Migration 00004 already has `drop policy if exists` before every `create policy` — safe to paste directly into Supabase SQL Editor

## Relevant Files
- `src/features/auth/services/auth.service.ts`: `login()` now checks `is_banned` + `is_admin_user()` RPC; `deleteAccount()` soft-cleans related tables; `getSession()` returns role
- `src/features/auth/hooks/useAuth.tsx`: exposes `role`, `is_banned`
- `src/features/auth/components/ProtectedRoute.tsx`: banned account UI
- `src/features/auth/pages/LoginPage.tsx`: admin redirect to `/admin`
- `src/features/auth/pages/ResetPasswordPage.tsx`: redirect to `/login`
- `src/features/recommender/services/recommender.service.ts`: Supabase dual-path with mock fallback
- `src/features/wardrobe/services/wardrobe.service.ts`: Supabase dual-path, analysis aggregates
- `src/features/trends/services/trends.service.ts`: Supabase dual-path, groups `fashion_trends` by season
- `src/features/quiz/services/quiz.service.ts` (new): saves quiz to `profiles` table
- `src/features/quiz/pages/QuizPage.tsx`: wired `quizService.completeQuiz()`
- `src/features/style-profile/services/style-profile.service.ts` (new): reads `profiles` into `StyleProfile`
- `src/features/profile/services/profile.service.ts`: getProfile/updateProfile/uploadAvatar/resetPersonalization/notification prefs/listPayments/listInvoices — all Supabase dual-path
- `src/features/profile/pages/ProfilePage.tsx`: all 5 panels inline — Profile (style/colors/occasions/budget/body_size), Security, Notifications, Subscription, Danger — all wired to Supabase
- `src/app/routes.tsx`: 5 routes wrapped in `ProtectedRoute`
- `src/features/admin/pages/AdminUsers.tsx`: single `dialog` state pattern
- `src/features/admin/pages/AdminProducts.tsx`: single `dialog` state + removed duplicate X button
- `src/features/admin/pages/AdminNotifications.tsx`: removed duplicate X button from Preview dialog
- `src/features/admin/pages/AdminFeedback.tsx`: removed duplicate X button from detail dialog
- `src/features/admin/pages/AdminTrends.tsx`: removed duplicate X button from Edit Trend dialog
- `src/shared/api/config.ts`: `useMockApi` defaults `true`, overridden by `.env` to `false`
- `supabase/migrations/00004_foundation_auth_profile_rls.sql`: RLS policies — drop-before-create pattern, safe for SQL Editor
