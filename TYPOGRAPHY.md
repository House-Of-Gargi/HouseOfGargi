# House of Gargi — Typography & Text Hierarchy Guide

A comprehensive architectural reference detailing every font family, desktop size, mobile size, weight, line-height, and tracking rule implemented across the House of Gargi storefront.

---

## 1. Core Font Stack

| Token | Primary Font | Fallbacks | Role & Purpose |
| :--- | :--- | :--- | :--- |
| **Headline Serif** | **Playfair Display** | Cormorant Garamond, Georgia, serif | Bold, high-fashion editorial display serif for H1/H2 section headings and bold product titles. |
| `--font-subtitle` | **Cormorant Garamond** (Upright) | Georgia, serif | Upright literary serif for collection subtitles (*"Explore our curated lines..."*). |
| `--font-nav` | **Plus Jakarta Sans** | Outfit, -apple-system, sans-serif | High-legibility, modern luxury sans for navbar links, buttons, and action CTAs. |
| `--font-body` | **Outfit** | Plus Jakarta Sans, Inter, sans-serif | High-contrast, easily readable body copy, product descriptions, pricing, and specs. |

---

## 2. Text Hierarchy: Desktop vs Mobile Specifications

### A. Navigation & Header Bar

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Tracking / Layout | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Signature (Hero)** | `.navbar--hero .navbar__logo-img--white` | Custom Script Image | Height: `72px` | Height: `58px` | — | Drop shadow `0 2px 10px rgba(0,0,0,0.35)` | Pure White (`#FFFFFF`) |
| **Brand Signature (Scrolled)**| `.navbar--scrolled .navbar__logo-img--dark` | Custom Script Image | Height: `66px` | Height: `52px` | — | Crisp transparent PNG | Maharani Maroon (`#7A2331`) |
| **Navigation Links** | `.navbar__links a` | Plus Jakarta Sans | `15.5px` (Enlarged) | Drawer (`18px`) | 600 | `gap: 28px`, Tracking: `0.05em` / Uppercase | `#FFFFFF` (Hero) / `#231812` (Scrolled) |
| **Navigation Icons** | `.navbar__icons` | Lucide SVG Icons | Icon `23px` (box `40px`) | Icon `20px` (box `36px`) | — | Clustered (`gap: 8px`), no spreading | `#FFFFFF` (Hero) / `#231812` (Scrolled) |
| **Drawer Nav Links** | `.mobile-drawer__links .nav-label` | Plus Jakarta Sans | — | `18px` | 600 | `0.10em` / Uppercase | `#231812` |

---

### B. Hero Banner

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Tracking | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Tagline (H1)** | `.hero__tagline` | Playfair Display / Cormorant | `clamp(38px, 5vw, 62px)` | `32px` | 600 | 1.15 | `0.01em` | Pure White (`#FFFFFF`) |
| **Hero Narrative** | `.hero__subtitle` | Cormorant Garamond (Upright) | `18px–20px` | Hidden | 500 | 1.6 | Normal | Pure White (`#FFFFFF`) |
| **Primary CTA** | `.hero-primary-btn` | Plus Jakarta Sans | `14.5px` | `13.5px` | 600 | 1.0 | `0.12em` / Uppercase | Maroon on Gold (`#7A2331`) |
| **Secondary CTA** | `.hero-secondary-btn`| Plus Jakarta Sans | `14.5px` | `13.5px` | 500 | 1.0 | `0.12em` / Uppercase | White with gold line |

---

### C. Homepage Section Headings & Subtitles

*Directly mirrors Screenshot 4 classic serif header style ("You May Also Cherish") in authoritative bold and signature Maharani Maroon (`#7A2331`).*

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Category Heading** | `h2.section-heading-bold` | Cormorant Garamond / Playfair | `clamp(38px, 4.6vw, 52px)` | `32px` | 700 (Bold) | 1.2 | Maharani Maroon (`#7A2331`) |
| **Category Subtitle** | `.subtitle-italic` | Cormorant Garamond (Upright)| `clamp(19px, 2.2vw, 23px)` | `17px` | 500 | 1.6 | Stone Taupe (`#5C5043`) |
| **Featured Heading** | `h2.section-heading-bold` | Cormorant Garamond / Playfair | `clamp(38px, 4.6vw, 52px)` | `32px` | 700 (Bold) | 1.2 | Maharani Maroon (`#7A2331`) |
| **Featured Subtitle** | `.subtitle-italic` | Cormorant Garamond (Upright)| `clamp(19px, 2.2vw, 23px)` | `17px` | 500 | 1.6 | Stone Taupe (`#5C5043`) |

---

### D. Category Tiles (4 Core Collections)

*Background: Ivory Silk (`#FBF6EE`); top-only rounded corners (`20px 20px 0 0`).*

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Tracking / Transform | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Category Title** | `.category-tile__label h3` | Cormorant Garamond / Playfair | `26px` | `20px` | 700 | Normal | Pure White (`#FFFFFF`) |
| **Explore Link** | `.category-tile__label span` | Plus Jakarta Sans | `13.5px` | `12px` | 700 | `0.10em` / Uppercase | Gargi Gold (`#B88E18`) |

---

### E. Product Cards (Catalog & Featured Grid)

*Upgraded to a crystal-clear, non-curvy sans font for maximum legibility and zero eye strain.*

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Product Title** | `.product-card__name` | Plus Jakarta Sans / Outfit | `19px` (Large & Clear) | `17px` | 700 (Bold) | 1.35 | Ink Brown (`#231812`) |
| **Artisan Subtitle** | `.product-card__artisan` | Outfit / Sans | `15px` (Legible) | `14px` | 500 | 1.45 | High Contrast (`#42352B`) |
| **Price Tag** | `.product-card__price` | Plus Jakarta Sans / Outfit | `20px` (Large) | `18px` | 700 (Bold) | 1.2 | Maharani Maroon (`#7A2331`) |

---

### F. Product Detail Page (PDP)

| Element | Selector / Location | Styling & Formatting |
| :--- | :--- | :--- |
| **Product Title (H1)** | `h1` | Playfair Display, `clamp(28px, 3.5vw, 42px)`, bold 600, `#231812` |
| **Price & Currency** | `.pdp-price__number` | Outfit, `32px`, bold 700, Maharani Maroon (`#7A2331`) |
| **Artisan Attribution** | Native Inline Link | **Clean same-page background (`#FBF6EE`)** — No white box, no border, no description paragraph, no gold verified badge. Displays simply as `Artisan: [Artisan Name]`. |

---

### G. Global Buttons & Action CTAs

| Button Variant | Selector | Font Family | Desktop Size | Mobile Size | Weight | Tracking / Transform | Styling |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Button** | `.btn--primary` | Plus Jakarta Sans | `14.5px` | `13.5px` | 600 | `0.12em` / Uppercase | Maroon bg (`#7A2331`), Ivory text |
| **Outline Button** | `.btn--outline` | Plus Jakarta Sans | `14.5px` | `13.5px` | 600 | `0.12em` / Uppercase | Transparent bg, Gold border (`#B88E18`) |
| **Gold Button** | `.btn--gold` | Plus Jakarta Sans | `14.5px` | `13.5px` | 600 | `0.12em` / Uppercase | Gold gradient bg, Maroon text |

---

### H. Body Copy, Metadata & Footer

| Element | Selector | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Standard Body Text** | `body, p` | Outfit | `18px` | `16px` | 400 | 1.75 | Ink Brown (`#231812`) |
| **Form Inputs & Labels**| `input, label` | Outfit | `14.5px–15px` | `14px` | 500 | 1.5 | Ink Brown (`#231812`) |
| **Footer Column Headings**| `.footer__heading` | Plus Jakarta Sans | `14px` | `13px` | 600 | `0.14em` / Uppercase | Gargi Gold (`#B88E18`) |
| **Footer Navigation Links**| `.footer a` | Outfit | `15px` | `14px` | 400 | 1.7 | Ivory Silk (`#FAF7F2`) |
| **Footer Copyright** | `.footer__bottom` | Outfit | `13px` | `12px` | 400 | 1.6 | Muted Ivory (`rgba(251,246,238,0.7)`) |
