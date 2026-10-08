# House of Gargi — Codebase Architecture & System Graph (Graphify)

This document provides a comprehensive structural graph, data relationship model, component dependency tree, and real-time synchronization architecture for **House of Gargi**.

---

## 1. High-Level System Topology Graph

```mermaid
flowchart TB
    subgraph ClientTier ["CLIENT TIER (Web & Mobile Browsers)"]
        TabA["Browser Tab A<br/>(Storefront Atelier)"]
        TabB["Browser Tab B<br/>(Storefront / Wishlist)"]
        TabAdmin["Browser Tab C<br/>(Seller Admin Portal)"]
    end

    subgraph RealtimeMesh ["REAL-TIME SYNCHRONIZATION MESH"]
        BC["Browser BroadcastChannel<br/>('gargi_realtime_portal_sync')"]
        StorageEvt["Window Storage Events<br/>(Zero-latency local fallback)"]
        SupaWS["Supabase Realtime WebSockets<br/>('house_of_gargi_patron_sync')"]
    end

    subgraph NextApp ["NEXT.JS 16 APP ROUTER CORE (React 19 + TypeScript)"]
        RootLayout["Root Layout & Providers<br/>(Theme, Currency, Auth, Cart, Wishlist)"]
        StorefrontRoutes["Storefront Dynamic Pages<br/>(/, /shop, /product/[id], /artisan/[id], /category/[id], etc.)"]
        SellerRoutes["Seller Atelier Suite<br/>(/seller, /seller/products, /seller/orders, /seller/login)"]
        APIRoutes["Route Handlers<br/>(/api/products, /api/orders, /api/checkout)"]
    end

    subgraph CloudServices ["BACKEND & CLOUD INFRASTRUCTURE"]
        SupaDB[("Supabase PostgreSQL Database<br/>(products, orders, order_items, sellers)")]
        SupaAuth["Supabase Auth Service<br/>(Strict 6-digit Email OTP Auth)"]
        SupaStorage["Supabase Object Storage<br/>(CDN Images & High-Res Textures)"]
        ResendEngine["Resend Email Delivery API<br/>(noreply@gargisaha.com via SMTP)"]
        VercelEdge["Vercel Edge / CDN Runtime<br/>(Asset Caching & SSR)"]
    end

    TabA <--> BC
    TabB <--> BC
    TabA <--> SupaWS
    TabB <--> SupaWS
    TabA <--> StorageEvt
    TabB <--> StorageEvt

    TabA --> RootLayout
    TabB --> RootLayout
    TabAdmin --> SellerRoutes

    RootLayout --> StorefrontRoutes
    StorefrontRoutes --> APIRoutes
    SellerRoutes --> APIRoutes

    APIRoutes --> SupaDB
    RootLayout --> SupaAuth
    SupaAuth --> ResendEngine
    StorefrontRoutes --> SupaStorage
    NextApp --> VercelEdge
```

---

## 2. Entity Relationship & Data Model Graph

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ CART_ITEM : owns
    CUSTOMER ||--o{ WISHLIST_ITEM : saves
    
    CATEGORY ||--|{ PRODUCT : categorizes
    ARTISAN ||--|{ PRODUCT : crafts
    SELLER ||--|{ PRODUCT : manages
    
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : ordered_as
    PRODUCT ||--o{ CART_ITEM : references
    PRODUCT ||--o{ WISHLIST_ITEM : references

    CUSTOMER {
        string email PK "Normalized lowercase email"
        string name "Patron display name"
        string id "Supabase UUID (optional)"
    }

    PRODUCT {
        string id PK "Unique slug identifier"
        string name "Product title"
        string category FK "sarees | lehengas | kurta-sets | accessories"
        number price "Base price in INR"
        string description "Editorial prose"
        string[] images "High-res WebP/JPG gallery URLs"
        string artisanId FK "Master artisan identifier"
        string artisanName "Master weaver display name"
        string technique "Kadwa | Korvai | Zardozi | Ajrakh | Tapestry"
        string fabric "Pure Mulberry Silk | Raw Silk | Fine Cotton"
        string care "Preservation and dry-cleaning notes"
        string origin "Geographical provenance"
        string[] sizes "Available dimensions/sizes"
        boolean inStock "Availability state"
    }

    ARTISAN {
        string id PK "Artisan slug identifier"
        string name "Full name & guild designation"
        string role "Master craft title"
        string region "Craft cluster geographical location"
        string lineage "Generational atelier lineage"
        number experienceYears "Decades of loom mastery"
        string loomHoursTotal "Verified authentic handcraft hours"
        string image "Portrait avatar URL"
        string coverImage "Workshop landscape banner URL"
        string bio "Detailed biographical narrative"
        string philosophy "Master artisan philosophy quote"
        string[] specialties "Signature techniques and materials"
        string[] awards "National and international honors"
        string[] productIds "Associated catalog pieces"
    }

    CATEGORY {
        string id PK "sarees | lehengas | kurta-sets | accessories"
        string name "Display title"
        string tagline "Poetic subtitle"
        string image "Hero category banner URL"
        string collectionTileImage "Grid tile thumbnail URL"
    }

    ORDER {
        string id PK "Unique order UUID"
        string order_number "Archival format: HG-YYYY-XXXX"
        string customer_name "Recipient patron name"
        string customer_email "Patron notification email"
        number total_amount "Order total in INR"
        string status "pending | confirmed | processing | shipped | delivered"
        string payment_status "paid | pending | cod"
        string currency "INR | USD | EUR | GBP | AED | CAD | AUD | SGD"
        timestamp created_at "Order placement timestamp"
    }

    ORDER_ITEM {
        string id PK "UUID"
        string order_id FK "Parent order foreign key"
        string product_id FK "Catalog item foreign key"
        string product_name "Snapshot product title"
        number price "Unit price at time of order"
        number quantity "Quantity ordered"
        string size "Chosen sizing specification"
    }

    SELLER {
        string id PK "Seller account UUID"
        string email "Seller portal login email"
        string business_name "Atelier / Weaver Guild name"
        string phone "Contact phone number"
        string status "active | suspended"
    }
```

---

## 3. Application Route & Hierarchy Graph

```mermaid
graph TD
    Root["src/app/layout.tsx (Root Layout & Providers)"]

    %% Storefront Branch
    Root --> StorefrontLayout["src/app/(storefront)/layout.tsx"]
    
    StorefrontLayout --> Home["/ (Home Page with HeroBanner Carousel)"]
    StorefrontLayout --> Shop["/shop (Curated Catalog & Filters)"]
    StorefrontLayout --> CategoryPage["/category/[id] (Category Landing)"]
    StorefrontLayout --> ProductPage["/product/[id] (PDP with Artisan Provenance)"]
    StorefrontLayout --> ArtisanPage["/artisan/[id] (Master Artisan Profile)"]
    StorefrontLayout --> OurArtisans["/our-artisans (Guild Directory)"]
    StorefrontLayout --> CartPage["/cart (Private Shopping Bag & Checkout)"]
    StorefrontLayout --> WishlistPage["/wishlist (Saved Heirloom Registry)"]
    StorefrontLayout --> AccountPage["/account (Patron Atelier Client Suite)"]
    StorefrontLayout --> BespokePage["/bespoke (Private Commission Inquiries)"]
    StorefrontLayout --> OurStory["/our-story (Vedic Philosophy & Origins)"]
    StorefrontLayout --> Sustainability["/sustainability (Ethical Handloom Promise)"]
    StorefrontLayout --> SizeGuide["/size-guide (Measurement Standards)"]
    StorefrontLayout --> ShippingPage["/shipping (White-Glove Logistics)"]
    StorefrontLayout --> ReturnsPage["/returns (Concierge Exchanges & Returns)"]
    StorefrontLayout --> TermsPage["/terms (Terms of Commission)"]
    StorefrontLayout --> PrivacyPage["/privacy (Patron Data Sovereignty)"]
    StorefrontLayout --> FAQPage["/faq (Frequently Asked Questions)"]
    StorefrontLayout --> PressPage["/press (Editorial Features & Press)"]

    %% Seller Branch
    Root --> SellerLayout["src/app/seller/layout.tsx (Seller Portal Auth Guard)"]
    SellerLayout --> SellerDashboard["/seller (Analytics & Revenue Dashboard)"]
    SellerLayout --> SellerLogin["/seller/login (Seller Portal Login)"]
    SellerLayout --> SellerProducts["/seller/products (Catalog Management & Add Item)"]
    SellerLayout --> SellerOrders["/seller/orders (Fulfillment & Dispatch Ledger)"]

    %% API Branch
    Root --> API["src/app/api/"]
    API --> APICheckout["/api/checkout (Order Payload Preparation)"]
    API --> APIOrders["/api/orders (Order Creation & Supabase Sync)"]
    API --> APIProducts["/api/products (Product Catalog CRUD)"]

    %% SEO & System
    Root --> Sitemap["/sitemap.xml (Dynamic XML Sitemap Generator)"]
    Root --> Robots["/robots.txt (Web Crawler Directives)"]
    Root --> NotFound["/_not-found (Luxury 404 Experience)"]
```

---

## 4. State Management & Real-Time Sync Flow

```mermaid
sequenceDiagram
    autonumber
    actor Patron as Patron (Customer)
    participant Tab1 as Browser Tab 1 (Shop)
    participant Modal as CustomerLoginModal
    participant SupaAuth as Supabase Auth + Resend
    participant SyncEngine as realtimeSync.ts (WebSockets & BroadcastChannel)
    participant Tab2 as Browser Tab 2 (Wishlist / Bag)

    Note over Tab1,Tab2: 1. Strict 6-Digit Email OTP Authentication Flow
    Patron->>Tab1: Clicks "Sign In" or adds item to wishlist
    Tab1->>Modal: Opens CustomerLoginModal
    Patron->>Modal: Inputs email (e.g., patron@gargisaha.com)
    Modal->>SupaAuth: signInWithOtp({ email: "patron@gargisaha.com" })
    SupaAuth-->>Patron: Sends 6-digit OTP from noreply@gargisaha.com
    Patron->>Modal: Enters 6-digit code (e.g., 123456)
    Modal->>SupaAuth: verifyOtp({ email, token: "123456", type: "email" })
    SupaAuth-->>Modal: Session verified (JWT + Customer Object)
    Modal->>SyncEngine: broadcastPortalSync('AUTH_CHANGED', { action: 'login', email })
    SyncEngine-->>Tab2: Syncs logged-in patron state instantly (0ms)

    Note over Tab1,Tab2: 2. Real-Time Multi-Tab Wishlist / Bag Synchronization
    Patron->>Tab1: Clicks Heart Icon on Banarasi Saree
    Tab1->>Tab1: Updates local React state (WishlistCount = 1)
    Tab1->>SyncEngine: broadcastPortalSync('WISHLIST_UPDATED', { email, wishlist })
    SyncEngine->>Tab2: Supabase WebSocket + BroadcastChannel message
    Tab2->>Tab2: WishlistContext receives message -> Updates WishlistCount = 1
    Note over Tab2: Tab 2 UI updates heart counter without refreshing!
```

---

## 5. UI Component Hierarchy Graph

```mermaid
graph LR
    subgraph GlobalLayout ["Global Shell Components"]
        Navbar["Navbar.tsx<br/>(Logo, Nav Links, Search, Currency Switcher, Auth, Wishlist/Cart Counters)"]
        Footer["Footer.tsx<br/>(Heritage Links, Socials, Newsletter, Legal)"]
        LoginModal["CustomerLoginModal.tsx<br/>(Strict 6-Digit Email OTP + Resend Timer)"]
        ScrollRev["ScrollReveal.tsx<br/>(Intersection Observer Viewport Reveals)"]
    end

    subgraph StorefrontComponents ["Storefront UI Components"]
        Hero["HeroBanner.tsx<br/>(3-Concept Carousel Slider, Responsive Picture WebP, Code Overlays)"]
        ProdCard["ProductCard.tsx<br/>(Image Prefetch on Hover, Wishlist Trigger, Price Formatter)"]
        Newsletter["AtelierNewsletter.tsx<br/>(Editorial Salon Subscription Form)"]
        CustomDrop["CustomDropdown.tsx<br/>(Luxury Select Menu)"]
        Icons["Icons.tsx<br/>(Lotus, Pure Gold Zari, Handloom, Wishlist SVGs)"]
    end

    subgraph SellerComponents ["Seller Admin Components"]
        SellerNav["SellerSidebar.tsx<br/>(Admin Navigation & Active Route Highlighting)"]
        MetricCard["Seller Metrics<br/>(Revenue, Units Sold, Active Looms, Pending Dispatch)"]
    end

    Navbar --> Icons
    Navbar --> LoginModal
    Navbar --> CustomDrop

    Hero --> Icons
    ProdCard --> Icons
    Newsletter --> Icons
```

---

## 6. Comprehensive Module & File Sitemap

### Core Configuration & Scripts
| File Path | Role & Purpose | Key Exports & Dependencies |
| :--- | :--- | :--- |
| [`package.json`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/package.json) | Project manifests, scripts, dependencies | Next 16.3.4, React 19, Supabase, Resend, Lucide, Sharp |
| [`next.config.js`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/next.config.js) | Next.js compilation, image optimization & cache headers | WebP/AVIF formats, 1-year immutable caching, Supabase remote patterns |
| [`tsconfig.json`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/tsconfig.json) | TypeScript compiler options and `@/*` path aliases | ESNext, Strict mode, JSX preserve |
| [`vercel.json`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/vercel.json) | Vercel deployment build specifications | Serverless runtime routing |
| [`.env.local`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/.env.local) | Environment variables (ignored by Git) | `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`, `RESEND_API_KEY` |
| [`scripts/process-banners.cjs`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/scripts/process-banners.cjs) | Sharp image optimization utility for hero banners | Generates Desktop 2:1 and Mobile 9:16 WebP/JPGs |
| [`scripts/sync-images.cjs`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/scripts/sync-images.cjs) | Product photography automation & Supabase sync | Automated product image ingestion |

---

### Data Models & Utilities
| File Path | Role & Purpose | Key Exports |
| :--- | :--- | :--- |
| [`src/types/index.ts`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/types/index.ts) | Core TypeScript interfaces and domain models | `Product`, `Category`, `Artisan`, `CartItem`, `Order`, `Currency` |
| [`src/data/products.ts`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/data/products.ts) | 18 catalog products mapped with artisan IDs & provenance | `products`, `categories`, `getProduct`, `getProductsByCategory` |
| [`src/data/artisans.ts`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/data/artisans.ts) | 10 generational master weaver guild records | `artisans`, `getArtisan`, `getArtisanByProductId`, `getAllArtisans` |
| [`src/lib/supabaseClient.ts`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/lib/supabaseClient.ts) | Supabase client instance with public anon keys | `supabase` |
| [`src/lib/realtimeSync.ts`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/lib/realtimeSync.ts) | Real-time WebSocket + BroadcastChannel cross-tab mesh | `broadcastPortalSync`, `subscribeToPortalSync` |
| [`src/lib/resend.ts`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/lib/resend.ts) | Resend transactional email client for `noreply@gargisaha.com` | `resend`, `NOREPLY_EMAIL`, `CONCIERGE_EMAIL` |

---

### React Contexts & State Providers
| File Path | Role & Purpose | State & Actions |
| :--- | :--- | :--- |
| [`src/context/CustomerAuthContext.tsx`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/context/CustomerAuthContext.tsx) | Email OTP authentication state & multi-tab session sync | `customer`, `isLoggedIn`, `login()`, `logout()`, `openLoginModal()` |
| [`src/context/WishlistContext.tsx`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/context/WishlistContext.tsx) | Email-keyed wishlist with real-time cross-tab sync | `wishlist`, `isInWishlist()`, `toggleWishlist()`, `wishlistCount` |
| [`src/context/CartContext.tsx`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/context/CartContext.tsx) | Email-keyed shopping bag with real-time cross-tab sync | `cart`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `subtotal` |
| [`src/context/CurrencyContext.tsx`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/context/CurrencyContext.tsx) | 8-currency engine (INR, USD, EUR, GBP, AED, CAD, AUD, SGD) | `currency`, `setCurrency()`, `formatPrice()`, `rates` |

---

### Styling Architecture
| File Path | Style Rules & Design Tokens |
| :--- | :--- |
| [`src/index.css`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/index.css) | Core design system: `--maharani-maroon`, `--gargi-gold`, `--ivory-silk`, typography, hero carousel animations, and responsive media queries |
| [`src/account.css`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/account.css) | Patron Suite (`/account`) responsive layout, stats badges, and policy card grids |
| [`src/seller.css`](file:///c:/Users/shaws/ANGA9/HouseOfGargi/src/seller.css) | Seller Admin dashboard, revenue metric cards, order ledgers, and inventory tables |

---

## 7. Key Architecture Rationale & Guardrails

1. **Strict 6-Digit Email OTP Authentication**:
   - Eliminates passwords and SMS dependencies in favor of cryptographic 6-digit tokens sent from `noreply@gargisaha.com` via Resend SMTP.
2. **Zero-Latency Multi-Tab Sync (WebSockets + BroadcastChannel)**:
   - Eliminates out-of-sync state across browser tabs when a user browses on one tab and adds/removes pieces in another.
3. **Master Artisan Provenance Linking**:
   - Every product is directly linked to an `Artisan` entity (`/artisan/[artisanId]`), reinforcing authentic Indian heritage craftsmanship and geographical indication (GI).
4. **Performance & Image Optimization**:
   - Static assets cached for 1 year with immutable CDN headers. Responsive `<picture>` tags deliver tailored 9:16 vertical images on mobile and 2:1 wide banners on desktop.
