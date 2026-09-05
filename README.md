# House of Gargi

A digital commerce platform and atelier management system for luxury handcrafted Indian fashion, heritage handlooms, and bespoke bridal couture.

---

## Table of Contents

1. Project Overview
2. Business Logic and Domain Model
   - Brand Identity and Provenance
   - Product Catalog and Categorization
   - Multi-Currency Commerce Engine
   - Bespoke Commissions and Concierge Pipeline
   - Customer Portal (Patron Suite)
   - Seller Atelier Management Portal
   - Provenance, Certifications, and Trust
3. Infrastructure and Technical Architecture
   - Technology Stack
   - Application Architecture (Next.js App Router)
   - State Management Architecture
   - Database and Backend Integration (Supabase)
   - Search Engine Optimization and Google Sitelinks Architecture
   - Design System and Styling Strategy
4. Directory Structure
5. API Reference
6. Environment Variables and Local Setup
7. Build, Validation, and Deployment

---

## 1. Project Overview

House of Gargi is an enterprise-grade digital flagship combining two integrated environments:
- Storefront Atelier: A customer-facing digital salon designed for high-net-worth connoisseurs seeking pure silk handloom sarees (Banarasi, Kanchipuram, Paithani, Chanderi, Tussar), bridal lehengas, hand-embroidered kurta ensembles, and antique temple jewellery.
- Seller Atelier Portal: A dedicated vendor administration interface for artisan clusters and atelier managers to oversee product catalogs, monitor inventory levels, track order fulfillment, and inspect revenue analytics.

The application is built on Next.js 16 (App Router) using React 19, TypeScript, Vanilla CSS design tokens, and Supabase for cloud persistence and authentication.

---

## 2. Business Logic and Domain Model

### Brand Identity and Provenance
The atelier is named after Gargi Vachaknavi, the ancient philosopher from the Brihadaranyaka Upanishad known for debating metaphysical philosophy in the court of King Janaka. The platform reflects slow luxury: honoring multi-generational master weavers across Varanasi, Kanchipuram, Maharashtra, and Madhya Pradesh rather than mass factory production.

### Product Catalog and Categorization
Products are structured into four core categories:
- Sarees (`/category/sarees`): Masterloom weaves including Banarasi Katan silk with gold zari, Paithani peacock pallus, Kanchipuram crimson bridal silks, and Chanderi tissue weaves.
- Lehengas (`/category/lehengas`): Bridal and festive couture with zardozi, gota patti, and hand-embroidered heritage silhouettes.
- Kurta Sets (`/category/kurta-sets`): Hand-block printed pure silks, Chanderi cotton-silks, and artisan daytime and festive wear.
- Accessories (`/category/accessories`): Handcrafted Jadau, Kundan, and antique temple jewellery.

Each product entity models rich provenance attributes:
- `technique`: e.g., Kadwa Zari Weave, Paithani Tapestry Weaving, Hand-Embroidered Zardozi.
- `region`: Geographical origin (e.g., Varanasi, Uttar Pradesh; Paithan, Maharashtra).
- `artisanNote`: Generational weaver attribution and workshop details.
- `fabric`: Fiber breakdown (Pure Mulberry Silk, Handspun Cotton, Raw Silk).
- `care`: Museum-grade preservation and dry-cleaning instructions.

### Multi-Currency Commerce Engine
To accommodate global collectors across North America, Europe, the Middle East, and India:
- Supported Currencies: USD (`$`, default), INR (`INR`), GBP (`GBP`), EUR (`EUR`), AED (`AED`).
- Luxury Numerical Formatting: Luxury goods avoid fragmented fractional cents (such as $506.23). Prices are rounded to clean integers (e.g., $510).
- Persistent Storage: Patron currency preferences persist in browser storage (`localStorage`) and synchronize across the entire storefront instantly via React Context.
- High-Legibility Tabular Numerals: Prices use CSS `font-variant-numeric: tabular-nums lining-nums` with strong color contrast to ensure effortless readability for clients aged 30 and older.

### Bespoke Commissions and Concierge Pipeline
Clients can submit private commissions (`/bespoke`) for bridal trousseaux and custom loom weaves:
- Garment selection (Bespoke Saree, Bridal Lehenga, Kurta Set, Heritage Jewellery).
- Preferred weave regions, custom colorways, and measurements.
- Private video consultation and atelier scheduling.

### Customer Portal (Patron Suite)
Located at `/account`, authenticated patrons receive:
- Real-time shopping bag and wishlist registry synchronization.
- Quick links to measurement and blouse fit guides.
- White-glove logistics documentation and shipping policies.
- Clean session management backed by phone-based OTP verification.

### Seller Atelier Management Portal
Located at `/seller`, the merchant interface provides:
- Catalog Management: Create, edit, and audit product inventory, fabric compositions, and pricing.
- Image Asset Ingestion: Cloud asset synchronization with Supabase storage.
- Order Fulfillment: Real-time order dispatch statuses (Pending, Packed, Shipped, Delivered).
- Performance Analytics: Interactive revenue breakdowns and inventory metrics built with Recharts.

### Provenance, Certifications, and Trust
Every product listing and invoice integrates authenticity markers:
- Silk Mark India verification standards.
- Handloom Mark Geographical Indication (GI) authentication.
- Transparent loom hours (typically 120 to 240 handloom hours per saree).

---

## 3. Infrastructure and Technical Architecture

### Technology Stack
- Framework: Next.js 16.3.4 (App Router, Turbopack engine).
- UI Library: React 19.2.6 with React DOM 19.2.6.
- Language: TypeScript 7.0.2 with strict type validation.
- Database and Auth: Supabase JS Client (`@supabase/supabase-js` 2.109.0) interfacing with PostgreSQL.
- Visualization: Recharts 3.9.1 for seller telemetry.
- Icons: Lucide React 1.40.0.
- Image Processing: Sharp 0.35.3 for automated build-time media optimizations.

### Application Architecture (Next.js App Router)
The codebase uses a hybrid architecture balancing Server Components (SSR) for static discovery and Client Components (`use client`) for dynamic state:
- Server Components: Layout roots, metadata generation, sitemaps, robots definitions, and static narrative pages (`/`, `/our-story`, `/privacy`, `/terms`).
- Client Components: Context providers, interactive shopping bag, product detail image zoom, filters, currency switcher, and authentication modals.

### State Management Architecture
Platform state is managed via four decoupled React contexts in `src/context/`:
1. `CurrencyContext`: Handles exchange calculations, currency switching, symbol formatting, and browser storage persistence.
2. `CustomerAuthContext`: Controls customer authentication, session tokens, OTP modal visibility, and client profile data.
3. `CartContext`: Manages shopping bag items, variant sizing, quantities, subtotal calculations, and Supabase database synchronization.
4. `WishlistContext`: Maintains client registry items, bookmark states, and persistent storage.

Root layout hierarchy in `src/app/layout.tsx`:
```tsx
<CurrencyProvider>
  <CustomerAuthProvider>
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  </CustomerAuthProvider>
</CurrencyProvider>
```

### Database and Backend Integration (Supabase)
The platform interfaces with Supabase PostgreSQL using Row-Level Security (RLS):
- `products`: Product listings, regional attributes, pricing, stock levels, and media URLs.
- `orders`: Customer orders, payment status, shipping addresses, and fulfillment tracking.
- `customers`: Patron profiles, phone verification records, and saved addresses.
- `storage`: Media buckets for high-resolution product photography and artisan documentation.

Database client initialization resides in `src/lib/supabaseClient.ts`.

### Search Engine Optimization and Google Sitelinks Architecture
To ensure high authority on search engines and enable expanded Google Sitelinks:
- Explicit Domain and Canonical URL: Root and sub-routes enforce `https://www.gargisaha.com` as the canonical origin.
- Absolute Title Configuration: Root page explicitly declares an absolute title to prevent template duplication (`House of Gargi | Handcrafted Luxury Indian Fashion`).
- Dynamic XML Sitemap (`src/app/sitemap.ts`): Automatically renders `/sitemap.xml` with priority hierarchy (1.0 for homepage, 0.9 for core categories, 0.8 for products).
- Crawler Directives (`src/app/robots.ts`): Automatically serves `/robots.txt` granting Googlebot access to storefront routes while disallowing private admin paths (`/seller/*`, `/api/*`).
- Structured Data (Schema.org JSON-LD):
  - `WebSite` Schema: Identifies brand name, alternative names, and `SearchAction` sitelinks query endpoint.
  - `Organization` Schema: Declares atelier credentials, logo, support email, and social entities.
  - `SiteNavigationElement` / `ItemList`: Explicitly declares the 6 primary quicklinks (Sarees, Lehengas, Kurta Sets, Accessories, Bespoke Atelier, Our Story).

### Design System and Styling Strategy
The user interface avoids third-party utility frameworks like Tailwind CSS in favor of custom Vanilla CSS tokens defined in `src/index.css` and `src/account.css`.

Key Design Tokens:
- Maharani Maroon: `#7D1A27` (Primary royal accent, CTA buttons)
- Gargi Gold: `#C9A227` (Ornamental borders, certifications, crests)
- Ivory Silk: `#FAF7F2` (Primary atelier background)
- Obsidian Brown: `#241A15` (High-contrast typography)
- Stone Taupe: `#6E5F54` (Secondary technical copy)

Typography:
- Headlines: Playfair Display, Marcellus, Cinzel
- Heritage Kicker: Noto Serif Devanagari
- Navigation and Metadata: Plus Jakarta Sans
- Body and Provenance: Cormorant Garamond

---

## 4. Directory Structure

```
HouseOfGargi/
|-- docs/                          # Architecture documentation and prompt ledgers
|-- public/                        # Static assets, fonts, and photography
|   |-- assets/                    # Textures and heritage illustration assets
|   |-- images/                    # Product imagery and category hero banners
|   `-- favicon.svg                # Atelier lotus vector crest
|-- src/
|   |-- app/                       # Next.js App Router routes
|   |   |-- (storefront)/          # Public client storefront route group
|   |   |   |-- account/           # Patron profile suite
|   |   |   |-- bespoke/           # Custom commissions and private bookings
|   |   |   |-- cart/              # Shopping bag and checkout staging
|   |   |   |-- category/[id]/     # Dynamic category archives
|   |   |   |-- our-story/         # Heritage and artisan provenance
|   |   |   |-- product/[id]/      # Product detail page (PDP)
|   |   |   |-- shop/              # Complete luxury catalog
|   |   |   |-- wishlist/          # Client registry
|   |   |   `-- page.tsx           # Storefront homepage
|   |   |-- api/                   # Serverless route handlers
|   |   |   |-- checkout/          # Checkout order processing
|   |   |   |-- orders/            # Order query and mutation
|   |   |   `-- products/          # Catalog data API
|   |   |-- seller/                # Merchant and artisan administration portal
|   |   |   |-- login/             # Seller authentication
|   |   |   |-- orders/            # Order fulfillment tracking
|   |   |   |-- products/          # Inventory and product management
|   |   |   `-- page.tsx           # Seller analytics dashboard
|   |   |-- layout.tsx             # Root layout with JSON-LD schema injection
|   |   |-- not-found.tsx          # 404 luxury fallback page
|   |   |-- robots.ts              # Native robots.txt generator
|   |   `-- sitemap.ts             # Native sitemap.xml generator
|   |-- components/                # Modular React components
|   |   |-- AtelierNewsletter.tsx  # Expansive newsletter invitation card
|   |   |-- CustomerLoginModal.tsx # Patron phone OTP modal
|   |   |-- Footer.tsx             # Storefront footer navigation
|   |   |-- Icons.tsx              # Vector SVG icon collection
|   |   |-- Navbar.tsx             # Header navigation and currency selector
|   |   |-- ProductCard.tsx        # Product catalog card with price conversion
|   |   `-- ScrollReveal.tsx       # Viewport intersection animation wrapper
|   |-- context/                   # React Context state providers
|   |   |-- CartContext.tsx
|   |   |-- CurrencyContext.tsx
|   |   |-- CustomerAuthContext.tsx
|   |   `-- WishlistContext.tsx
|   |-- data/                      # Static catalog fallback data and collections
|   |   `-- products.ts
|   |-- hooks/                     # Custom React hooks (useSEO, etc.)
|   |-- lib/                       # Third-party service clients
|   |   `-- supabaseClient.ts
|   |-- types/                     # TypeScript domain interfaces
|   |   `-- index.ts
|   |-- account.css                # Patron suite dedicated styles
|   `-- index.css                  # Global design tokens and component styles
|-- next.config.js                 # Next.js runtime configuration
|-- package.json                   # Project scripts and dependencies
|-- tsconfig.json                  # TypeScript compiler options
`-- vercel.json                    # Vercel deployment specification
```

---

## 5. API Reference

The application exposes serverless route handlers under `/api/`:

### Products Endpoint
- Route: `GET /api/products`
- Description: Retrieves product records from Supabase with fallback to static catalog data.
- Query Parameters: `category` (optional filter).

### Checkout Endpoint
- Route: `POST /api/checkout`
- Description: Validates inventory, computes localized totals, and initializes the checkout ledger.
- Request Body:
```json
{
  "items": [
    { "id": "banarasi-gold-weave", "size": "Free Size", "quantity": 1 }
  ],
  "currency": "USD",
  "customer": {
    "phone": "9876543210",
    "name": "Ananya Sharma"
  }
}
```

### Orders Endpoint
- Route: `GET /api/orders`
- Description: Fetches customer or vendor order histories filtered by authorization credentials.
- Route: `POST /api/orders`
- Description: Records an authenticated order confirmation into the database.

---

## 6. Environment Variables and Local Setup

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Environment Configuration
Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Production Domain
NEXT_PUBLIC_SITE_URL=https://www.gargisaha.com
```

### Installation and Development Server
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/HouseOfGargi.git
   cd HouseOfGargi
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the environments:
   - Storefront: `http://localhost:3000`
   - Seller Portal: `http://localhost:3000/seller`

---

## 7. Build, Validation, and Deployment

### Static Code Analysis and Type Checking
To execute the TypeScript type checker without emitting files:
```bash
npx tsc --noEmit
```

### Production Build
To test full static page generation and bundle compilation:
```bash
npm run build
```

This compiles:
- 27 static and dynamic App Router routes
- `/sitemap.xml` dynamic XML sitemap
- `/robots.txt` crawler routing specifications

### Deployment Specification
The repository is optimized for continuous deployment on Vercel via `vercel.json`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "next build"
}
```
All route handlers, server components, and dynamic metadata render natively on the Vercel Edge/Serverless runtime.
