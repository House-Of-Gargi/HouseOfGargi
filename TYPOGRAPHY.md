# House of Gargi — Typography & Text Hierarchy Guide

A comprehensive architectural reference detailing every font family, desktop size, mobile size, weight, line-height, and tracking rule implemented across the House of Gargi storefront.

---

## 1. Font Family Stack

| Token | Primary Font | Fallbacks | Role & Purpose |
| :--- | :--- | :--- | :--- |
| `--font-script` | **Alex Brush** | Italianno, cursive | Signature script matching the brand logo. Used for luxury section titles. |
| `--font-display` | **Cormorant Garamond** | Playfair Display, Georgia, serif | High-fashion editorial display serif for H1/H2/H3 titles and product names. |
| `--font-subtitle` | **Cormorant Garamond** (Upright) | Georgia, serif | Upright literary serif for poetic collection subtitles and craft narratives. |
| `--font-nav` | **Tenor Sans** | Marcellus, sans-serif | Wide-tracked Roman all-caps font for navigation links, buttons, and badges. |
| `--font-body` | **Outfit** | Plus Jakarta Sans, Inter, sans-serif | Clean, modern geometric sans-serif for product metadata, prices, descriptions, and forms. |

---

## 2. Text Hierarchy: Desktop vs Mobile Specifications

### A. Brand Navigation & Header

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Tracking / Transform | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Signature (Hero)** | `.navbar--hero .navbar__logo-img--white` | Custom Script Image | Height: `68px` | Height: `54px` | — | Drop shadow `0 2px 10px rgba(0,0,0,0.35)` | Pure White (`#FFFFFF`) |
| **Brand Signature (Scrolled)**| `.navbar--scrolled .navbar__logo-img--dark` | Custom Script Image | Height: `62px` | Height: `48px` | — | Crisp transparent PNG | Maharani Maroon (`#7A2331`) |
| **Nav Links** | `.navbar__links a` | Tenor Sans | `16px` | Drawer (`18px`) | 500 | `0.18em` / Uppercase | `#FFFFFF` (Hero) / `#231812` (Scrolled) |
| **Drawer Nav Links** | `.mobile-drawer__links .nav-label` | Tenor Sans | — | `18px` | 500 | `0.16em` / Uppercase | `#231812` |

---

### B. Hero Banner

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Tracking | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Tagline (H1)** | `.hero__tagline` | Cormorant Garamond | `clamp(38px, 5vw, 62px)` | `32px` | 600 | 1.15 | `0.01em` | Pure White (`#FFFFFF`) |
| **Hero Narrative** | `.hero__subtitle` | Cormorant Garamond (Upright) | `18px–20px` | Hidden | 500 | 1.6 | Normal | Pure White (`#FFFFFF`) |
| **Primary CTA** | `.hero-primary-btn` | Tenor Sans | `14.5px` | `13.5px` | 600 | 1.0 | `0.16em` / Uppercase | Maroon on Gold (`#7A2331`) |
| **Secondary CTA** | `.hero-secondary-btn`| Tenor Sans | `14.5px` | `13.5px` | 500 | 1.0 | `0.16em` / Uppercase | White with gold line |

*(Note: The Devanagari Sanskrit lipi text previously placed above the hero headline has been removed for a clean, minimalist layout.)*

---

### C. Homepage Section Titles & Subtitles

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Category Section Heading** | `h2.section-title--script` | Alex Brush | `clamp(42px, 5.5vw, 64px)` | `38px` | 400 | 1.1 | Maharani Maroon (`#7A2331`) |
| **Category Subtitle** | `.subtitle-italic` | Cormorant Garamond (Upright)| `clamp(17px, 2vw, 20px)` | `16px` | 500 | 1.6 | Stone Taupe (`#5C5043`) |
| **Featured Section Heading** | `h2.section-title--script` | Alex Brush | `clamp(42px, 5.5vw, 64px)` | `38px` | 400 | 1.1 | Maharani Maroon (`#7A2331`) |
| **Featured Subtitle** | `.subtitle-italic` | Cormorant Garamond (Upright)| `clamp(17px, 2vw, 20px)` | `16px` | 500 | 1.6 | Stone Taupe (`#5C5043`) |

---

### D. Category Tiles (4 Core Collections)

*Background Note: Category section sits on Ivory Silk (`#FBF6EE`); tiles feature top-only rounded corners (`20px 20px 0 0`).*

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Tracking / Transform | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Category Name** | `.category-tile__label h3` | Cormorant Garamond | `26px` | `20px` | 600 | `-0.01em` / Normal | Pure White (`#FFFFFF`) |
| **Explore Link** | `.category-tile__label span` | Tenor Sans | `13.5px` | `12px` | 700 | `0.12em` / Uppercase | Gargi Gold (`#B88E18`) |

---

### E. Product Cards (Catalog & Featured Grid)

| Element | Selector / Location | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Product Title** | `.product-card__name` | Cormorant Garamond | `20px` | `17px` | 600 | 1.3 | Ink Brown (`#231812`) |
| **Artisan / Region** | `.product-card__artisan` | Outfit | `14px` | `13px` | 400 | 1.5 | Stone Taupe (`#5C5043`) |
| **Price Tag** | `.product-card__price` | Outfit | `18px` | `16px` | 600 | 1.2 | Maharani Maroon (`#7A2331`) |

---

### F. Global Buttons & Action CTAs

| Button Variant | Selector | Font Family | Desktop Size | Mobile Size | Weight | Tracking / Transform | Styling |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Button** | `.btn--primary` | Tenor Sans | `14.5px` | `13.5px` | 600 | `0.16em` / Uppercase | Maroon bg (`#7A2331`), Ivory text |
| **Outline Button** | `.btn--outline` | Tenor Sans | `14.5px` | `13.5px` | 600 | `0.16em` / Uppercase | Transparent bg, Gold border (`#B88E18`) |
| **Gold Button** | `.btn--gold` | Tenor Sans | `14.5px` | `13.5px` | 600 | `0.16em` / Uppercase | Gold gradient bg, Maroon text |

---

### G. Body Copy, Metadata & Footer

| Element | Selector | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Standard Body Text** | `body, p` | Outfit | `18px` | `16px` | 400 | 1.75 | Ink Brown (`#231812`) |
| **Form Inputs & Labels**| `input, label` | Outfit / Tenor Sans | `14.5px–15px` | `14px` | 500 | 1.5 | Ink Brown (`#231812`) |
| **Footer Column Headings**| `.footer__heading` | Tenor Sans | `14px` | `13px` | 600 | `0.18em` / Uppercase | Gargi Gold (`#B88E18`) |
| **Footer Navigation Links**| `.footer a` | Outfit | `15px` | `14px` | 400 | 1.7 | Ivory Silk (`#FAF7F2`) |
| **Footer Copyright** | `.footer__bottom` | Outfit | `13px` | `12px` | 400 | 1.6 | Muted Ivory (`rgba(251,246,238,0.7)`) |

---

## 3. Why This Typography System Works for All Audiences (20–60+ Age Group)

1. **High Contrast Serifs (Cormorant Garamond)**:
   Gives a regal, timeless couture impression without being stuffy. Young audiences perceive it as high-fashion editorial (reminiscent of Vogue and luxury fragrance houses), while mature patrons appreciate its classic dignity.
2. **Upright Subtitles**:
   Rendering Cormorant Garamond upright (rather than skewed italics) significantly improves character recognition and reading speed on both OLED mobile screens and retina displays.
3. **Tenor Sans for Navigation**:
   With its flared terminals and wide letter-spacing (`0.18em`), Tenor Sans delivers instant clarity for menu navigation and buttons, ensuring effortless tapping on mobile devices.
4. **Outfit for Body & Numbers**:
   A geometric sans-serif that renders currency symbols, numbers, and fabric descriptions with zero ambiguity, ensuring pricing and sizing remain razor-sharp.
