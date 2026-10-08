# House of Gargi — Knowledge Graph Architecture Report

**Generated on:** Thu, 08 Oct 2026 04:11:51 GMT  
**Repository:** `House-Of-Gargi/HouseOfGargi`  
**Total Entities (Nodes):** 78  
**Total Relationships (Edges):** 108  
**Detected Communities:** 13

---

## 1. Executive Summary & Graph Metrics

House of Gargi is a Next.js 16 (React 19) digital atelier for luxury handcrafted Indian fashion. The knowledge graph reveals a clean, decoupled modular architecture separating **Storefront Pages**, **State Contexts**, **Real-time Synchronization Mesh**, and **Seller Administration Suite**.

| Metric | Count | Description |
| :--- | :--- | :--- |
| **Total Nodes** | **78** | Source files, components, contexts, routes, and configs |
| **Total Directed Edges** | **108** | Import, composition, and event dependencies |
| **Architectural Communities** | **13** | Functional subsystems |
| **Average Degree** | **2.77** | Inter-module connectivity density |

---

## 2. "God Nodes" (Core Hubs & Highly Connected Modules)

God nodes represent the foundational modules of the application that the majority of pages, components, and services depend upon:

| Rank | Module / File | In-Degree (Depended Upon By) | Out-Degree | Total Connections | Primary Function |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **#1** | `src/data/products.ts` | **15** | 2 | **17** | 18 catalog luxury products with price, images, and artisan mappings |
| **#2** | `src/components/ScrollReveal.tsx` | **14** | 0 | **14** | Module ScrollReveal.tsx in Storefront UI Components |
| **#3** | `src/components/ProductCard.tsx` | **6** | 6 | **12** | Module ProductCard.tsx in Storefront UI Components |
| **#4** | `src/context/CustomerAuthContext.tsx` | **10** | 2 | **12** | Strict Email OTP customer authentication and multi-tab session state |
| **#5** | `src/lib/supabaseClient.ts` | **12** | 0 | **12** | Supabase client instance for database and auth |
| **#6** | `src/context/CartContext.tsx` | **6** | 4 | **10** | Email-keyed shopping bag with real-time cross-tab sync |
| **#7** | `src/context/WishlistContext.tsx` | **6** | 4 | **10** | Email-keyed wishlist state with real-time cross-tab sync |
| **#8** | `src/app/(storefront)/product/[id]/page.tsx` | **0** | 8 | **8** | Storefront page route for [id] |
| **#9** | `src/components/Icons.tsx` | **8** | 0 | **8** | Module Icons.tsx in Storefront UI Components |
| **#10** | `src/components/Navbar.tsx` | **1** | 6 | **7** | Module Navbar.tsx in Storefront UI Components |

---

## 3. Community Subsystem Breakdown


### Configuration & Manifests (16 files)
- **`eslint.config.js`** (22 lines) — *Module eslint.config.js in Configuration & Manifests* [In: 0, Out: 0]
- **`next-env.d.ts`** (8 lines) — *Module next-env.d.ts in Configuration & Manifests* [In: 0, Out: 0]
- **`next.config.js`** (46 lines) — *Module next.config.js in Configuration & Manifests* [In: 0, Out: 0]
- **`package-lock.json`** (3470 lines) — *Module package-lock.json in Configuration & Manifests* [In: 0, Out: 0]
- **`package.json`** (38 lines) — *Module package.json in Configuration & Manifests* [In: 0, Out: 0]
- **`src/app/layout.tsx`** (167 lines) — *Module layout.tsx in Configuration & Manifests* [In: 0, Out: 4]
- **`src/app/not-found.tsx`** (22 lines) — *Module not-found.tsx in Configuration & Manifests* [In: 0, Out: 0]
- **`src/app/robots.ts`** (16 lines) — *Module robots.ts in Configuration & Manifests* [In: 0, Out: 0]
- **`src/app/sitemap.ts`** (104 lines) — *Module sitemap.ts in Configuration & Manifests* [In: 0, Out: 2]
- **`src/hooks/useSEO.ts`** (43 lines) — *Module useSEO.ts in Configuration & Manifests* [In: 0, Out: 0]
- **`tsconfig.json`** (43 lines) — *Module tsconfig.json in Configuration & Manifests* [In: 0, Out: 0]
- **`upload.js`** (52 lines) — *Module upload.js in Configuration & Manifests* [In: 0, Out: 0]
- **`upload_generated.js`** (48 lines) — *Module upload_generated.js in Configuration & Manifests* [In: 0, Out: 0]
- **`upload_webp.js`** (56 lines) — *Module upload_webp.js in Configuration & Manifests* [In: 0, Out: 0]
- **`urls.json`** (15 lines) — *Module urls.json in Configuration & Manifests* [In: 0, Out: 0]
- **`vercel.json`** (6 lines) — *Module vercel.json in Configuration & Manifests* [In: 0, Out: 0]


### Database Migrations (3 files)
- **`migrations/0001_initial_schema.sql`** (50 lines) — *Module 0001_initial_schema.sql in Database Migrations* [In: 0, Out: 0]
- **`migrations/0002_seed_initial_data.sql`** (36 lines) — *Module 0002_seed_initial_data.sql in Database Migrations* [In: 0, Out: 0]
- **`supabase_schema.sql`** (59 lines) — *Module supabase_schema.sql in Database Migrations* [In: 0, Out: 0]


### Automation Scripts (3 files)
- **`scripts/generate-graphify.cjs`** (663 lines) — *Module generate-graphify.cjs in Automation Scripts* [In: 0, Out: 0]
- **`scripts/process-banners.cjs`** (51 lines) — *Module process-banners.cjs in Automation Scripts* [In: 0, Out: 0]
- **`scripts/sync-images.cjs`** (184 lines) — *Module sync-images.cjs in Automation Scripts* [In: 0, Out: 0]


### Design System & Styles (3 files)
- **`src/account.css`** (497 lines) — *Module account.css in Design System & Styles* [In: 0, Out: 0]
- **`src/index.css`** (3371 lines) — *Module index.css in Design System & Styles* [In: 0, Out: 0]
- **`src/seller.css`** (686 lines) — *Module seller.css in Design System & Styles* [In: 0, Out: 0]


### Storefront Pages (24 files)
- **`src/app/(storefront)/account/page.tsx`** (268 lines) — *Storefront page route for account* [In: 0, Out: 3]
- **`src/app/(storefront)/artisan/[id]/layout.tsx`** (43 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 1]
- **`src/app/(storefront)/artisan/[id]/page.tsx`** (478 lines) — *Storefront page route for [id]* [In: 0, Out: 4]
- **`src/app/(storefront)/bespoke/layout.tsx`** (20 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 0]
- **`src/app/(storefront)/bespoke/page.tsx`** (171 lines) — *Storefront page route for bespoke* [In: 0, Out: 2]
- **`src/app/(storefront)/cart/page.tsx`** (578 lines) — *Storefront page route for cart* [In: 0, Out: 5]
- **`src/app/(storefront)/category/[id]/layout.tsx`** (67 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 1]
- **`src/app/(storefront)/category/[id]/page.tsx`** (256 lines) — *Storefront page route for [id]* [In: 0, Out: 5]
- **`src/app/(storefront)/faq/page.tsx`** (107 lines) — *Storefront page route for faq* [In: 0, Out: 1]
- **`src/app/(storefront)/layout.tsx`** (14 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 2]
- **`src/app/(storefront)/our-artisans/page.tsx`** (337 lines) — *Storefront page route for our-artisans* [In: 0, Out: 2]
- **`src/app/(storefront)/our-story/page.tsx`** (98 lines) — *Storefront page route for our-story* [In: 0, Out: 2]
- **`src/app/(storefront)/page.tsx`** (210 lines) — *Storefront page route for (storefront)* [In: 0, Out: 6]
- **`src/app/(storefront)/press/page.tsx`** (70 lines) — *Storefront page route for press* [In: 0, Out: 1]
- **`src/app/(storefront)/privacy/page.tsx`** (77 lines) — *Storefront page route for privacy* [In: 0, Out: 1]
- **`src/app/(storefront)/product/[id]/page.tsx`** (453 lines) — *Storefront page route for [id]* [In: 0, Out: 8]
- **`src/app/(storefront)/returns/page.tsx`** (68 lines) — *Storefront page route for returns* [In: 0, Out: 1]
- **`src/app/(storefront)/shipping/page.tsx`** (66 lines) — *Storefront page route for shipping* [In: 0, Out: 1]
- **`src/app/(storefront)/shop/layout.tsx`** (20 lines) — *Module layout.tsx in Storefront Pages* [In: 0, Out: 0]
- **`src/app/(storefront)/shop/page.tsx`** (183 lines) — *Storefront page route for shop* [In: 0, Out: 5]
- **`src/app/(storefront)/size-guide/page.tsx`** (102 lines) — *Storefront page route for size-guide* [In: 0, Out: 1]
- **`src/app/(storefront)/sustainability/page.tsx`** (64 lines) — *Storefront page route for sustainability* [In: 0, Out: 1]
- **`src/app/(storefront)/terms/page.tsx`** (30 lines) — *Storefront page route for terms* [In: 0, Out: 0]
- **`src/app/(storefront)/wishlist/page.tsx`** (322 lines) — *Storefront page route for wishlist* [In: 0, Out: 6]


### API Handlers (3 files)
- **`src/app/api/checkout/route.ts`** (42 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]
- **`src/app/api/orders/route.ts`** (108 lines) — *Module route.ts in API Handlers* [In: 0, Out: 2]
- **`src/app/api/products/route.ts`** (22 lines) — *Module route.ts in API Handlers* [In: 0, Out: 1]


### Seller Portal (5 files)
- **`src/app/seller/layout.tsx`** (105 lines) — *Module layout.tsx in Seller Portal* [In: 0, Out: 2]
- **`src/app/seller/login/page.tsx`** (685 lines) — *Storefront page route for login* [In: 0, Out: 1]
- **`src/app/seller/orders/page.tsx`** (265 lines) — *Storefront page route for orders* [In: 0, Out: 2]
- **`src/app/seller/page.tsx`** (582 lines) — *Storefront page route for seller* [In: 0, Out: 2]
- **`src/app/seller/products/page.tsx`** (516 lines) — *Storefront page route for products* [In: 0, Out: 2]


### Storefront UI Components (9 files)
- **`src/components/AtelierNewsletter.tsx`** (93 lines) — *Module AtelierNewsletter.tsx in Storefront UI Components* [In: 1, Out: 0]
- **`src/components/CustomDropdown.tsx`** (212 lines) — *Module CustomDropdown.tsx in Storefront UI Components* [In: 6, Out: 0]
- **`src/components/CustomerLoginModal.tsx`** (417 lines) — *Module CustomerLoginModal.tsx in Storefront UI Components* [In: 1, Out: 2]
- **`src/components/Footer.tsx`** (47 lines) — *Module Footer.tsx in Storefront UI Components* [In: 1, Out: 0]
- **`src/components/HeroBanner.tsx`** (261 lines) — *Interactive 3-concept hero carousel with responsive WebP picture sources* [In: 1, Out: 0]
- **`src/components/Icons.tsx`** (188 lines) — *Module Icons.tsx in Storefront UI Components* [In: 8, Out: 0]
- **`src/components/Navbar.tsx`** (172 lines) — *Module Navbar.tsx in Storefront UI Components* [In: 1, Out: 6]
- **`src/components/ProductCard.tsx`** (91 lines) — *Module ProductCard.tsx in Storefront UI Components* [In: 6, Out: 6]
- **`src/components/ScrollReveal.tsx`** (38 lines) — *Module ScrollReveal.tsx in Storefront UI Components* [In: 14, Out: 0]


### Seller Components (2 files)
- **`src/components/seller/SellerShell.tsx`** (132 lines) — *Module SellerShell.tsx in Seller Components* [In: 1, Out: 1]
- **`src/components/seller/SellerSidebar.tsx`** (309 lines) — *Module SellerSidebar.tsx in Seller Components* [In: 1, Out: 1]


### State & Context Providers (4 files)
- **`src/context/CartContext.tsx`** (231 lines) — *Email-keyed shopping bag with real-time cross-tab sync* [In: 6, Out: 4]
- **`src/context/CurrencyContext.tsx`** (154 lines) — *Module CurrencyContext.tsx in State & Context Providers* [In: 4, Out: 0]
- **`src/context/CustomerAuthContext.tsx`** (179 lines) — *Strict Email OTP customer authentication and multi-tab session state* [In: 10, Out: 2]
- **`src/context/WishlistContext.tsx`** (170 lines) — *Email-keyed wishlist state with real-time cross-tab sync* [In: 6, Out: 4]


### Data Models & Catalog (2 files)
- **`src/data/artisans.ts`** (177 lines) — *10 generational master artisan guild records and provenance helpers* [In: 5, Out: 1]
- **`src/data/products.ts`** (399 lines) — *18 catalog luxury products with price, images, and artisan mappings* [In: 15, Out: 2]


### Infrastructure & Realtime Mesh (3 files)
- **`src/lib/realtimeSync.ts`** (148 lines) — *Cross-tab WebSocket and BroadcastChannel synchronization mesh* [In: 3, Out: 1]
- **`src/lib/resend.ts`** (8 lines) — *Resend email client integration for noreply@gargisaha.com* [In: 0, Out: 0]
- **`src/lib/supabaseClient.ts`** (14 lines) — *Supabase client instance for database and auth* [In: 12, Out: 0]


### Type Definitions (1 files)
- **`src/types/index.ts`** (81 lines) — *Module index.ts in Type Definitions* [In: 6, Out: 0]


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
