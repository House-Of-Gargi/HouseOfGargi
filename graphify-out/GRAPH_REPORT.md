# House of Gargi — Knowledge Graph Architecture Report

**Generated on:** Thu, 29 Oct 2026 09:17:25 GMT  
**Repository:** `House-Of-Gargi/HouseOfGargi`  
**Total Entities (Nodes):** 189  
**Total Relationships (Edges):** 229  
**Detected Communities:** 19

---

## 1. Executive Summary & Graph Metrics

House of Gargi is a Next.js 16 (React 19) digital atelier for luxury handcrafted Indian fashion. The knowledge graph reveals a clean, decoupled modular architecture separating **Storefront Pages**, **State Contexts**, **Real-time Synchronization Mesh**, and **Seller Administration Suite**.

| Metric | Count | Description |
| :--- | :--- | :--- |
| **Total Nodes** | **189** | Source files, components, contexts, routes, and configs |
| **Total Directed Edges** | **229** | Import, composition, and event dependencies |
| **Architectural Communities** | **19** | Functional subsystems |
| **Average Degree** | **2.42** | Inter-module connectivity density |

---

## 2. "God Nodes" (Core Hubs & Highly Connected Modules)

God nodes represent the foundational modules of the application that the majority of pages, components, and services depend upon:

| Rank | Module / File | In-Degree (Depended Upon By) | Out-Degree | Total Connections | Primary Function |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **#1** | `src/lib/apiProxy.ts` | **27** | 0 | **27** | Module apiProxy.ts in Infrastructure & Realtime Mesh |
| **#2** | `src/data/products.ts` | **16** | 4 | **20** | 18 catalog luxury products with price, images, and artisan mappings |
| **#3** | `src/lib/supabaseClient.ts` | **20** | 0 | **20** | Supabase client instance for database and auth |
| **#4** | `src/lib/realtimeSync.ts` | **14** | 1 | **15** | Cross-tab WebSocket and BroadcastChannel synchronization mesh |
| **#5** | `src/components/ProductCard.tsx` | **7** | 7 | **14** | Module ProductCard.tsx in Storefront UI Components |
| **#6** | `src/context/CustomerAuthContext.tsx` | **11** | 3 | **14** | Strict Email OTP customer authentication and multi-tab session state |
| **#7** | `src/components/admin/AdminLoadingSpinner.tsx` | **13** | 0 | **13** | Module AdminLoadingSpinner.tsx in Admin Components |
| **#8** | `src/components/ScrollReveal.tsx` | **12** | 0 | **12** | Module ScrollReveal.tsx in Storefront UI Components |
| **#9** | `src/types/index.ts` | **11** | 0 | **11** | Module index.ts in Type Definitions |
| **#10** | `src/app/(storefront)/page.tsx` | **0** | 10 | **10** | Route page for (storefront) |

---

## 3. Community Subsystem Breakdown


### Configuration & Manifests (32 files)
- **`eslint.config.js`** (22 lines) — *Module eslint.config.js in Configuration & Manifests* [In: 0, Out: 0]
- **`next-env.d.ts`** (8 lines) — *Module next-env.d.ts in Configuration & Manifests* [In: 0, Out: 0]
- **`next.config.js`** (89 lines) — *Module next.config.js in Configuration & Manifests* [In: 0, Out: 0]
- **`package-lock.json`** (3408 lines) — *Module package-lock.json in Configuration & Manifests* [In: 0, Out: 0]
- **`package.json`** (37 lines) — *Module package.json in Configuration & Manifests* [In: 0, Out: 0]
- **`src/app/artisan/analytics/page.tsx`** (394 lines) — *Route page for analytics* [In: 0, Out: 0]
- **`src/app/artisan/apply/page.tsx`** (1429 lines) — *Route page for apply* [In: 0, Out: 0]
- **`src/app/artisan/dashboard/page.tsx`** (1096 lines) — *Route page for dashboard* [In: 0, Out: 2]
- **`src/app/artisan/earnings/page.tsx`** (278 lines) — *Route page for earnings* [In: 0, Out: 1]
- **`src/app/artisan/inventory/page.tsx`** (314 lines) — *Route page for inventory* [In: 0, Out: 1]
- **`src/app/artisan/layout.tsx`** (156 lines) — *Module layout.tsx in Configuration & Manifests* [In: 0, Out: 4]
- **`src/app/artisan/loading.tsx`** (14 lines) — *Module loading.tsx in Configuration & Manifests* [In: 0, Out: 1]
- **`src/app/artisan/login/page.tsx`** (1202 lines) — *Route page for login* [In: 0, Out: 1]
- **`src/app/artisan/orders/page.tsx`** (246 lines) — *Route page for orders* [In: 0, Out: 1]
- **`src/app/artisan/page.tsx`** (19 lines) — *Route page for artisan* [In: 0, Out: 0]
- **`src/app/artisan/products/new/page.tsx`** (1028 lines) — *Route page for new* [In: 0, Out: 2]
- **`src/app/artisan/products/page.tsx`** (1982 lines) — *Route page for products* [In: 0, Out: 2]
- **`src/app/artisan/profile/page.tsx`** (1085 lines) — *Route page for profile* [In: 0, Out: 2]
- **`src/app/layout.tsx`** (169 lines) — *Module layout.tsx in Configuration & Manifests* [In: 0, Out: 5]
- **`src/app/loading.tsx`** (6 lines) — *Module loading.tsx in Configuration & Manifests* [In: 0, Out: 1]
- **`src/app/not-found.tsx`** (225 lines) — *Module not-found.tsx in Configuration & Manifests* [In: 0, Out: 0]
- **`src/app/robots.ts`** (16 lines) — *Module robots.ts in Configuration & Manifests* [In: 0, Out: 0]
- **`src/app/sitemap.ts`** (104 lines) — *Module sitemap.ts in Configuration & Manifests* [In: 0, Out: 2]
- **`src/hooks/useSEO.ts`** (43 lines) — *Module useSEO.ts in Configuration & Manifests* [In: 0, Out: 0]
- **`src/proxy.ts`** (24 lines) — *Module proxy.ts in Configuration & Manifests* [In: 0, Out: 0]
- **`tsconfig.json`** (43 lines) — *Module tsconfig.json in Configuration & Manifests* [In: 0, Out: 0]
- **`upload.js`** (52 lines) — *Module upload.js in Configuration & Manifests* [In: 0, Out: 0]
- **`upload_generated.js`** (48 lines) — *Module upload_generated.js in Configuration & Manifests* [In: 0, Out: 0]
- **`upload_webp.js`** (56 lines) — *Module upload_webp.js in Configuration & Manifests* [In: 0, Out: 0]
- **`urls.json`** (15 lines) — *Module urls.json in Configuration & Manifests* [In: 0, Out: 0]
- **`vercel.json`** (6 lines) — *Module vercel.json in Configuration & Manifests* [In: 0, Out: 0]
- **`verify_schema.cjs`** (39 lines) — *Module verify_schema.cjs in Configuration & Manifests* [In: 0, Out: 0]


### Database Migrations (3 files)
- **`migrations/0001_initial_schema.sql`** (50 lines) — *Module 0001_initial_schema.sql in Database Migrations* [In: 0, Out: 0]
- **`migrations/0002_seed_initial_data.sql`** (36 lines) — *Module 0002_seed_initial_data.sql in Database Migrations* [In: 0, Out: 0]
- **`supabase_schema.sql`** (59 lines) — *Module supabase_schema.sql in Database Migrations* [In: 0, Out: 0]


### Automation Scripts (6 files)
- **`scripts/check_supabase.cjs`** (39 lines) — *Module check_supabase.cjs in Automation Scripts* [In: 0, Out: 0]
- **`scripts/generate-graphify.cjs`** (683 lines) — *Module generate-graphify.cjs in Automation Scripts* [In: 0, Out: 0]
- **`scripts/import_json_to_db.cjs`** (164 lines) — *Module import_json_to_db.cjs in Automation Scripts* [In: 0, Out: 0]
- **`scripts/process-banners.cjs`** (51 lines) — *Module process-banners.cjs in Automation Scripts* [In: 0, Out: 0]
- **`scripts/slice-sections.cjs`** (62 lines) — *Module slice-sections.cjs in Automation Scripts* [In: 0, Out: 0]
- **`scripts/sync-images.cjs`** (184 lines) — *Module sync-images.cjs in Automation Scripts* [In: 0, Out: 0]


### Design System & Styles (3 files)
- **`src/account.css`** (497 lines) — *Module account.css in Design System & Styles* [In: 0, Out: 0]
- **`src/index.css`** (9682 lines) — *Module index.css in Design System & Styles* [In: 0, Out: 0]
- **`src/seller.css`** (909 lines) — *Module seller.css in Design System & Styles* [In: 0, Out: 0]


### Storefront Pages (29 files)
- **`src/app/(storefront)/account/page.tsx`** (268 lines) — *Route page for account* [In: 0, Out: 3]
- **`src/app/(storefront)/artisan/[id]/layout.tsx`** (43 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 1]
- **`src/app/(storefront)/artisan/[id]/page.tsx`** (255 lines) — *Route page for [id]* [In: 0, Out: 3]
- **`src/app/(storefront)/bespoke/layout.tsx`** (20 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 0]
- **`src/app/(storefront)/bespoke/page.tsx`** (394 lines) — *Route page for bespoke* [In: 0, Out: 2]
- **`src/app/(storefront)/cart/page.tsx`** (578 lines) — *Route page for cart* [In: 0, Out: 5]
- **`src/app/(storefront)/category/[id]/layout.tsx`** (67 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 1]
- **`src/app/(storefront)/category/[id]/loading.tsx`** (6 lines) — *Module loading.tsx in Storefront Pages* [In: 0, Out: 1]
- **`src/app/(storefront)/category/[id]/page.tsx`** (403 lines) — *Route page for [id]* [In: 0, Out: 4]
- **`src/app/(storefront)/explore/ExploreContent.tsx`** (436 lines) — *Module ExploreContent.tsx in Storefront Pages* [In: 1, Out: 5]
- **`src/app/(storefront)/explore/page.tsx`** (35 lines) — *Route page for explore* [In: 0, Out: 1]
- **`src/app/(storefront)/faq/page.tsx`** (107 lines) — *Route page for faq* [In: 0, Out: 1]
- **`src/app/(storefront)/layout.tsx`** (17 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 3]
- **`src/app/(storefront)/loading.tsx`** (6 lines) — *Module loading.tsx in Storefront Pages* [In: 0, Out: 1]
- **`src/app/(storefront)/our-artisans/page.tsx`** (337 lines) — *Route page for our-artisans* [In: 0, Out: 2]
- **`src/app/(storefront)/our-story/page.tsx`** (98 lines) — *Route page for our-story* [In: 0, Out: 2]
- **`src/app/(storefront)/page.tsx`** (276 lines) — *Route page for (storefront)* [In: 0, Out: 10]
- **`src/app/(storefront)/press/page.tsx`** (70 lines) — *Route page for press* [In: 0, Out: 1]
- **`src/app/(storefront)/privacy/page.tsx`** (77 lines) — *Route page for privacy* [In: 0, Out: 1]
- **`src/app/(storefront)/product/[id]/loading.tsx`** (6 lines) — *Module loading.tsx in Storefront Pages* [In: 0, Out: 1]
- **`src/app/(storefront)/product/[id]/page.tsx`** (356 lines) — *Route page for [id]* [In: 0, Out: 8]
- **`src/app/(storefront)/returns/page.tsx`** (68 lines) — *Route page for returns* [In: 0, Out: 1]
- **`src/app/(storefront)/shipping/page.tsx`** (66 lines) — *Route page for shipping* [In: 0, Out: 1]
- **`src/app/(storefront)/shop/layout.tsx`** (20 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 0]
- **`src/app/(storefront)/shop/page.tsx`** (367 lines) — *Route page for shop* [In: 0, Out: 4]
- **`src/app/(storefront)/size-guide/page.tsx`** (102 lines) — *Route page for size-guide* [In: 0, Out: 1]
- **`src/app/(storefront)/sustainability/page.tsx`** (64 lines) — *Route page for sustainability* [In: 0, Out: 1]
- **`src/app/(storefront)/terms/page.tsx`** (30 lines) — *Route page for terms* [In: 0, Out: 0]
- **`src/app/(storefront)/wishlist/page.tsx`** (322 lines) — *Route page for wishlist* [In: 0, Out: 6]


### Admin Operations Portal (11 files)
- **`src/app/admin/artisans/applications/page.tsx`** (1114 lines) — *Route page for applications* [In: 0, Out: 1]
- **`src/app/admin/artisans/page.tsx`** (797 lines) — *Route page for artisans* [In: 0, Out: 1]
- **`src/app/admin/artisans/profile/page.tsx`** (972 lines) — *Route page for profile* [In: 0, Out: 1]
- **`src/app/admin/bespoke/page.tsx`** (1500 lines) — *Route page for bespoke* [In: 0, Out: 1]
- **`src/app/admin/dashboard/page.tsx`** (1224 lines) — *Route page for dashboard* [In: 0, Out: 2]
- **`src/app/admin/layout.tsx`** (103 lines) — *Module layout.tsx in Admin Operations Portal* [In: 0, Out: 5]
- **`src/app/admin/loading.tsx`** (14 lines) — *Module loading.tsx in Admin Operations Portal* [In: 0, Out: 1]
- **`src/app/admin/login/page.tsx`** (726 lines) — *Route page for login* [In: 0, Out: 1]
- **`src/app/admin/page.tsx`** (18 lines) — *Route page for admin* [In: 0, Out: 0]
- **`src/app/admin/products/approvals/page.tsx`** (502 lines) — *Route page for approvals* [In: 0, Out: 2]
- **`src/app/admin/products/page.tsx`** (1661 lines) — *Route page for products* [In: 0, Out: 2]


### Admin APIs (6 files)
- **`src/app/api/admin/applications/route.ts`** (68 lines) — *Module route.ts in Admin APIs* [In: 0, Out: 1]
- **`src/app/api/admin/artisans/profile/route.ts`** (57 lines) — *Module route.ts in Admin APIs* [In: 0, Out: 1]
- **`src/app/api/admin/artisans/route.ts`** (19 lines) — *Module route.ts in Admin APIs* [In: 0, Out: 1]
- **`src/app/api/admin/bespoke/route.ts`** (28 lines) — *Module route.ts in Admin APIs* [In: 0, Out: 1]
- **`src/app/api/admin/dashboard/route.ts`** (115 lines) — *Module route.ts in Admin APIs* [In: 0, Out: 2]
- **`src/app/api/admin/products/route.ts`** (178 lines) — *Module route.ts in Admin APIs* [In: 0, Out: 2]


### API Handlers (16 files)
- **`src/app/api/artisan/analytics/route.ts`** (24 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/artisan/apply/route.ts`** (6 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/artisan/inventory/route.ts`** (10 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/artisan/me/route.ts`** (34 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/artisan/profile/route.ts`** (98 lines) — *Module route.ts in API Handlers* [In: 0, Out: 2]
- **`src/app/api/auth/admin-login/route.ts`** (117 lines) — *Module route.ts in API Handlers* [In: 0, Out: 2]
- **`src/app/api/auth/logout/route.ts`** (36 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/auth/role/route.ts`** (53 lines) — *Module route.ts in API Handlers* [In: 0, Out: 2]
- **`src/app/api/auth/send-otp/route.ts`** (6 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/auth/verify-otp/route.ts`** (58 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/bespoke/route.ts`** (10 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/categories/route.ts`** (6 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/checkout/route.ts`** (42 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/orders/route.ts`** (120 lines) — *Module route.ts in API Handlers* [In: 0, Out: 2]
- **`src/app/api/products/route.ts`** (22 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/revalidate/route.ts`** (42 lines) — *Module route.ts in API Handlers* [In: 0, Out: 0]


### Super Admin APIs (8 files)
- **`src/app/api/super-admin/admins/reset-password/route.ts`** (78 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 2]
- **`src/app/api/super-admin/admins/route.ts`** (208 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 2]
- **`src/app/api/super-admin/bestsellers/route.ts`** (70 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 2]
- **`src/app/api/super-admin/catalog/route.ts`** (127 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 2]
- **`src/app/api/super-admin/categories/route.ts`** (42 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 1]
- **`src/app/api/super-admin/change-password/route.ts`** (109 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 2]
- **`src/app/api/super-admin/dashboard/route.ts`** (108 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 2]
- **`src/app/api/super-admin/revenue/route.ts`** (7 lines) — *Module route.ts in Super Admin APIs* [In: 0, Out: 1]


### Artisan / Seller Portal (12 files)
- **`src/app/seller/analytics/page.tsx`** (394 lines) — *Route page for analytics* [In: 0, Out: 0]
- **`src/app/seller/apply/page.tsx`** (1429 lines) — *Route page for apply* [In: 0, Out: 0]
- **`src/app/seller/earnings/page.tsx`** (265 lines) — *Route page for earnings* [In: 0, Out: 0]
- **`src/app/seller/inventory/page.tsx`** (296 lines) — *Route page for inventory* [In: 0, Out: 0]
- **`src/app/seller/layout.tsx`** (141 lines) — *Module layout.tsx in Artisan / Seller Portal* [In: 0, Out: 4]
- **`src/app/seller/loading.tsx`** (14 lines) — *Module loading.tsx in Artisan / Seller Portal* [In: 0, Out: 1]
- **`src/app/seller/login/page.tsx`** (1200 lines) — *Route page for login* [In: 0, Out: 1]
- **`src/app/seller/orders/page.tsx`** (246 lines) — *Route page for orders* [In: 0, Out: 1]
- **`src/app/seller/page.tsx`** (41 lines) — *Route page for seller* [In: 0, Out: 0]
- **`src/app/seller/products/new/page.tsx`** (1024 lines) — *Route page for new* [In: 0, Out: 1]
- **`src/app/seller/products/page.tsx`** (1932 lines) — *Route page for products* [In: 0, Out: 1]
- **`src/app/seller/profile/page.tsx`** (1085 lines) — *Route page for profile* [In: 0, Out: 2]


### Super Admin Portal (10 files)
- **`src/app/super-admin/admins/page.tsx`** (979 lines) — *Super Admin team privilege and admin invitation control center* [In: 0, Out: 2]
- **`src/app/super-admin/bestsellers/page.tsx`** (298 lines) — *Sales velocity tracking, revenue leaders, and best seller rankings* [In: 0, Out: 1]
- **`src/app/super-admin/catalog/page.tsx`** (502 lines) — *Master catalog display governance and storefront product overrides* [In: 0, Out: 2]
- **`src/app/super-admin/categories/page.tsx`** (673 lines) — *Taxonomy, collection management, and storefront banner curation* [In: 0, Out: 1]
- **`src/app/super-admin/dashboard/page.tsx`** (548 lines) — *Executive Overview command dashboard with live revenue and order stats* [In: 0, Out: 2]
- **`src/app/super-admin/layout.tsx`** (93 lines) — *Module layout.tsx in Super Admin Portal* [In: 0, Out: 5]
- **`src/app/super-admin/loading.tsx`** (14 lines) — *Module loading.tsx in Super Admin Portal* [In: 0, Out: 1]
- **`src/app/super-admin/login/page.tsx`** (18 lines) — *Route page for login* [In: 0, Out: 0]
- **`src/app/super-admin/page.tsx`** (18 lines) — *Route page for super-admin* [In: 0, Out: 0]
- **`src/app/super-admin/revenue/page.tsx`** (409 lines) — *Financial ledger, GMV metrics, take-rate, and profit margins* [In: 0, Out: 1]


### Admin Components (3 files)
- **`src/components/admin/AdminLoadingSpinner.tsx`** (101 lines) — *Module AdminLoadingSpinner.tsx in Admin Components* [In: 13, Out: 0]
- **`src/components/admin/AdminShell.tsx`** (85 lines) — *Module AdminShell.tsx in Admin Components* [In: 1, Out: 1]
- **`src/components/admin/AdminSidebar.tsx`** (451 lines) — *Module AdminSidebar.tsx in Admin Components* [In: 1, Out: 1]


### Storefront UI Components (20 files)
- **`src/components/ArtisanProfileModal.tsx`** (344 lines) — *Module ArtisanProfileModal.tsx in Storefront UI Components* [In: 2, Out: 0]
- **`src/components/ArtisanQuestionnaireDossier.tsx`** (1157 lines) — *Module ArtisanQuestionnaireDossier.tsx in Storefront UI Components* [In: 2, Out: 0]
- **`src/components/AtelierNewsletter.tsx`** (93 lines) — *Module AtelierNewsletter.tsx in Storefront UI Components* [In: 0, Out: 0]
- **`src/components/CategoryCollectionRail.tsx`** (91 lines) — *Module CategoryCollectionRail.tsx in Storefront UI Components* [In: 1, Out: 3]
- **`src/components/common/NetworkStatusBanner.tsx`** (104 lines) — *Module NetworkStatusBanner.tsx in Storefront UI Components* [In: 1, Out: 0]
- **`src/components/common/PortalLoadingScreen.tsx`** (70 lines) — *Module PortalLoadingScreen.tsx in Storefront UI Components* [In: 9, Out: 0]
- **`src/components/common/UnauthorizedSessionScreen.tsx`** (242 lines) — *Module UnauthorizedSessionScreen.tsx in Storefront UI Components* [In: 4, Out: 1]
- **`src/components/CustomDropdown.tsx`** (212 lines) — *Module CustomDropdown.tsx in Storefront UI Components* [In: 9, Out: 0]
- **`src/components/CustomerLoginModal.tsx`** (339 lines) — *Module CustomerLoginModal.tsx in Storefront UI Components* [In: 1, Out: 1]
- **`src/components/Footer.tsx`** (151 lines) — *Module Footer.tsx in Storefront UI Components* [In: 1, Out: 0]
- **`src/components/HeroBanner.tsx`** (244 lines) — *Interactive 3-concept hero carousel with responsive WebP picture sources* [In: 1, Out: 0]
- **`src/components/Icons.tsx`** (209 lines) — *Module Icons.tsx in Storefront UI Components* [In: 7, Out: 0]
- **`src/components/Navbar.tsx`** (799 lines) — *Module Navbar.tsx in Storefront UI Components* [In: 1, Out: 7]
- **`src/components/ProductCard.tsx`** (141 lines) — *Module ProductCard.tsx in Storefront UI Components* [In: 7, Out: 7]
- **`src/components/ScrollReveal.tsx`** (48 lines) — *Module ScrollReveal.tsx in Storefront UI Components* [In: 12, Out: 0]
- **`src/components/SearchDropdown.tsx`** (331 lines) — *Module SearchDropdown.tsx in Storefront UI Components* [In: 2, Out: 3]
- **`src/components/skeletons/CategoryPageSkeleton.tsx`** (45 lines) — *Module CategoryPageSkeleton.tsx in Storefront UI Components* [In: 2, Out: 0]
- **`src/components/skeletons/ProductDetailSkeleton.tsx`** (94 lines) — *Module ProductDetailSkeleton.tsx in Storefront UI Components* [In: 2, Out: 0]
- **`src/components/skeletons/SkeletonShimmer.css`** (155 lines) — *Module SkeletonShimmer.css in Storefront UI Components* [In: 0, Out: 0]
- **`src/components/skeletons/StorefrontSkeleton.tsx`** (29 lines) — *Module StorefrontSkeleton.tsx in Storefront UI Components* [In: 2, Out: 0]


### Seller Components (2 files)
- **`src/components/seller/SellerShell.tsx`** (132 lines) — *Module SellerShell.tsx in Seller Components* [In: 2, Out: 1]
- **`src/components/seller/SellerSidebar.tsx`** (440 lines) — *Module SellerSidebar.tsx in Seller Components* [In: 1, Out: 1]


### Super Admin Components (2 files)
- **`src/components/super-admin/SuperAdminShell.tsx`** (55 lines) — *Executive layout shell with zero-header permanent luxury side nav rail* [In: 1, Out: 1]
- **`src/components/super-admin/SuperAdminSidebar.tsx`** (409 lines) — *Hover-collapsible 72px to 264px floating luxury side navigation rail* [In: 1, Out: 1]


### State & Context Providers (5 files)
- **`src/context/CartContext.tsx`** (231 lines) — *Email-keyed shopping bag with real-time cross-tab sync* [In: 6, Out: 4]
- **`src/context/CurrencyContext.tsx`** (154 lines) — *Module CurrencyContext.tsx in State & Context Providers* [In: 5, Out: 0]
- **`src/context/CustomerAuthContext.tsx`** (221 lines) — *Strict Email OTP customer authentication and multi-tab session state* [In: 11, Out: 3]
- **`src/context/PageTransitionContext.tsx`** (125 lines) — *Module PageTransitionContext.tsx in State & Context Providers* [In: 2, Out: 3]
- **`src/context/WishlistContext.tsx`** (170 lines) — *Email-keyed wishlist state with real-time cross-tab sync* [In: 6, Out: 4]


### Data Models & Catalog (13 files)
- **`src/data/artisans.ts`** (280 lines) — *10 generational master artisan guild records and provenance helpers* [In: 5, Out: 2]
- **`src/data/artisan_applications.json`** (41 lines) — *Module artisan_applications.json in Data Models & Catalog* [In: 0, Out: 0]
- **`src/data/artisan_inventory.json`** (67 lines) — *Module artisan_inventory.json in Data Models & Catalog* [In: 0, Out: 0]
- **`src/data/artisan_profile.json`** (28 lines) — *Module artisan_profile.json in Data Models & Catalog* [In: 0, Out: 0]
- **`src/data/artisan_profiles_list.json`** (29 lines) — *Module artisan_profiles_list.json in Data Models & Catalog* [In: 1, Out: 0]
- **`src/data/backend_orders.json`** (1 lines) — *Module backend_orders.json in Data Models & Catalog* [In: 1, Out: 0]
- **`src/data/bespoke_requests.json`** (20 lines) — *Module bespoke_requests.json in Data Models & Catalog* [In: 0, Out: 0]
- **`src/data/categories.json`** (52 lines) — *Module categories.json in Data Models & Catalog* [In: 0, Out: 0]
- **`src/data/deleted_products.json`** (4 lines) — *Module deleted_products.json in Data Models & Catalog* [In: 2, Out: 0]
- **`src/data/orders_overrides.json`** (1 lines) — *Module orders_overrides.json in Data Models & Catalog* [In: 0, Out: 0]
- **`src/data/products.ts`** (425 lines) — *18 catalog luxury products with price, images, and artisan mappings* [In: 16, Out: 4]
- **`src/data/product_numbers.json`** (40 lines) — *Module product_numbers.json in Data Models & Catalog* [In: 0, Out: 0]
- **`src/data/product_overrides.json`** (151 lines) — *Module product_overrides.json in Data Models & Catalog* [In: 2, Out: 0]


### Infrastructure & Realtime Mesh (7 files)
- **`src/lib/apiClient.ts`** (293 lines) — *Module apiClient.ts in Infrastructure & Realtime Mesh* [In: 1, Out: 0]
- **`src/lib/apiProxy.ts`** (84 lines) — *Module apiProxy.ts in Infrastructure & Realtime Mesh* [In: 27, Out: 0]
- **`src/lib/rbac.ts`** (117 lines) — *Module rbac.ts in Infrastructure & Realtime Mesh* [In: 4, Out: 1]
- **`src/lib/realtimeSync.ts`** (271 lines) — *Cross-tab WebSocket and BroadcastChannel synchronization mesh* [In: 14, Out: 1]
- **`src/lib/resend.ts`** (8 lines) — *Resend email client integration for noreply@gargisaha.com* [In: 0, Out: 0]
- **`src/lib/supabaseAdmin.ts`** (27 lines) — *Module supabaseAdmin.ts in Infrastructure & Realtime Mesh* [In: 8, Out: 0]
- **`src/lib/supabaseClient.ts`** (20 lines) — *Supabase client instance for database and auth* [In: 20, Out: 0]


### Type Definitions (1 files)
- **`src/types/index.ts`** (92 lines) — *Module index.ts in Type Definitions* [In: 11, Out: 0]


---

## 4. Key Architectural Flows

### A. Strict Email OTP Authentication Flow
`CustomerLoginModal.tsx` &rarr; `supabase.auth.signInWithOtp()` &rarr; Resend SMTP (`noreply@gargisaha.com`) &rarr; `supabase.auth.verifyOtp()` &rarr; `CustomerAuthContext.tsx` &rarr; `realtimeSync.ts` Broadcast.

### B. Zero-Latency Multi-Tab WebSocket Mesh
Tab Action (Add to Wishlist/Bag) &rarr; Context Provider &rarr; `realtimeSync.ts` (`supabase.channel('house_of_gargi_patron_sync')` + `BroadcastChannel('gargi_realtime_portal_sync')`) &rarr; All other open browser tabs update state instantly without page reload.

### C. Master Artisan Lineage Graph
`product/[id]/page.tsx` &rarr; Reads `artisanId` from `products.ts` &rarr; Links directly to `artisan/[id]/page.tsx` &rarr; Displays verified GI badge, provenance ledger, and masterworks catalog.

---

## 5. Suggested Graph Queries for AI Assistants & Developers

- **Query 1:** *"Show all pages depending on `WishlistContext.tsx` and how real-time updates propagate."*
- **Query 2:** *"Trace the authentication state lifecycle from `CustomerLoginModal` to `CustomerAuthContext` and Supabase Auth."*
- **Query 3:** *"List all components importing `src/data/products.ts` and `src/data/artisans.ts`."*
- **Query 4:** *"Analyze the Seller Suite routing guard in `src/app/seller/layout.tsx` and its API dependencies."*
