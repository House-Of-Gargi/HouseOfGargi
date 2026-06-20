# House of Gargi — Brand & Frontend Design Blueprint
*Luxury Handmade Traditional Indian Fashion — E-commerce Planning Document*

---

## 1. Reference Analysis Summary

### 1.1 Design Inspiration — Anita Dongre (Visual Aesthetic)
What makes the Anita Dongre site feel premium, and what we're borrowing:
- **Editorial, full-bleed photography** as the hero of every page — not banners stuffed with text. The product/story leads, text is minimal and confident.
- **Bright, airy whitespace** — the brand feels expensive because of restraint, not density. Light backgrounds (ivory/cream), never stark white or dark/heavy.
- **Heirloom storytelling** — sections about craftsmanship, artisans, and heritage woven between product grids, not relegated only to an "About" page.
- **Nature & heritage motifs** used sparingly as accents (florals, paisley, jaali lattice) — never overwhelming the photography.
- **Quiet luxury typography** — a characterful serif for headlines paired with a clean, light-weight sans for body copy, so the page stays legible and "bright" rather than ornate.
- **Simple, shallow navigation** — a handful of clear top-level links, large clickable category tiles, generous image-led category entry points.

### 1.2 Structure Inspiration — Novica (Navigation & Category Logic)
What we're borrowing from Novica's UX, adapted to a much smaller catalog:
- **Top nav = Categories**, each with a dedicated landing page (hero banner + short story blurb + product grid) rather than a generic "Shop" dump.
- **Category landing page anatomy:** banner image → 1-2 line craft/region story → filter/sort bar → product grid → "explore more" cross-links to other categories.
- **Lightweight filtering** (by fabric, occasion, price, color) sitting on the left or top of the grid — even with only 5–8 products per category, 2–3 filters keep it feeling like a "real" store.
- **Cross-category discovery** — "You may also like" and "Explore other categories" modules at the bottom of every category and product page, so a 4-category catalog still feels richly explorable.
- **Trust & origin storytelling** embedded directly in product listings (who made it, what technique, what region) — this becomes our "artisan note" on each product card/detail page.

### 1.3 Synthesis for House of Gargi
Bright/airy Anita-Dongre visual language + Novica's clear category-first navigation, applied to a deliberately small, curated catalog (3–4 categories × 5–8 products). The smallness is a feature: every category page should feel like a curated boutique rack, not an empty warehouse aisle — achieved through generous imagery, storytelling blocks, and confident whitespace rather than dense grids.

---

## 2. Brand Identity

**Name:** House of Gargi
**Positioning:** Luxury, handmade, traditional Indian fashion — elegant, premium, bright, sophisticated, woman-centric heritage brand.
**Tone of voice:** Warm, poetic, rooted in craft — short evocative sentences (e.g. "Woven by hand. Worn for a lifetime.") rather than salesy copy.

---

## 3. Color Palette

A bright, premium palette inspired by Indian textile traditions (Banarasi gold, Rajasthani sunset, ivory courtyards) — kept airy and never garish.

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary Background | Ivory Silk | `#FBF6EE` | Page background, section backgrounds |
| Secondary Background | Warm Sand | `#F2E8D8` | Alternating sections, cards |
| Primary Accent | Gargi Gold | `#C9A227` | CTAs, borders, foil-style accents, dividers |
| Deep Accent | Maharani Maroon | `#7A2331` | Headlines on light bg, premium tags, hover states |
| Supporting Accent | Peacock Teal | `#1F6F6B` | Secondary buttons, icon accents, festive highlights |
| Supporting Accent 2 | Marigold | `#E08A1E` | Sale/new badges, diya motif, small highlight accents |
| Neutral Dark (text) | Ink Brown | `#2B1F18` | Body text, navbar text |
| Neutral Mid | Stone Taupe | `#8B7E6F` | Secondary text, captions, meta info |
| Neutral Line | Soft Gold Line | `#E4D3AE` | Hairline dividers, input borders |
| White (rare use) | Pure White | `#FFFFFF` | Product image cards only, to keep photography true-color |

**Usage rule:** 70% Ivory/Sand neutrals, 20% Ink Brown text, 10% Gold/Maroon/Teal accents. Never place more than one saturated accent color in the same viewport — this is what keeps it "premium" rather than "festive clipart."

---

## 4. Typography

| Role | Font | Style Notes | Fallback |
|---|---|---|---|
| Display / Headlines (H1, Hero) | **Cormorant Garamond** (or "Butler" if licensed) | Serif, elegant, slightly high-contrast strokes — used large, letter-spaced, sentence case (not all-caps) | Playfair Display |
| Sub-headlines / Section titles | **Cormorant Garamond Medium / Italic** | Italic used for emotive lines ("Crafted by hand, for generations.") | EB Garamond |
| Navigation / UI labels | **Marcellus** or small-caps serif | Wide letter-spacing, all-caps, used sparingly for nav + buttons only | Cinzel |
| Body copy | **Lato** or **Avenir Next** (light/regular weight) | Clean sans, high legibility, generous line-height (1.6–1.8) | Inter |
| Price / numeric UI | **Lato Medium** | Tabular numbers for price alignment | Inter Medium |

**Type scale (desktop):** H1 56–64px / H2 40px / H3 28px / Body 16–17px / Caption 13px.
**Rule:** Never mix more than 2 font families on a single screen (1 serif display + 1 sans body). Decorative serif is for *titles only* — all functional UI text stays in the sans body font for usability.

---

## 5. Visual & Motion Language

- **Motifs to use as line-art accents** (never as heavy background textures over text): paisley (kairi), jaali lattice cut-outs, diya silhouette, mandala corner flourishes, marigold garland line-art, peacock feather accent.
- **Dividers:** thin gold hairline with a small center motif (diya or mandala dot) instead of plain `<hr>`.
- **Buttons:** rectangular, generous padding, 0–2px radius (sharp/elegant, not bubbly), gold or maroon outline on hover with a slow 300ms transition — no bouncy/playful easing.
- **Imagery treatment:** warm color grading (slightly golden white balance), soft natural shadows, never harsh studio white backgrounds for lifestyle shots; product cut-outs on Pure White only for the catalog grid.
- **Loading state:** a single diya (oil lamp) line-icon with an animated "flickering flame" (CSS/SVG, 2–3 keyframes glow) — replaces generic spinners site-wide.
- **Scroll motion:** gentle fade-up on section entry (no parallax gimmicks), section backgrounds alternate Ivory ↔ Sand to create rhythm down the page.

---

## 6. Asset List — Gemini Image Generation Prompts

> Use these prompts with Gemini's image generation. Generate at high resolution (landscape 16:9 for heroes/banners, square 1:1 for category tiles/products, vertical 4:5 for mobile heroes). Keep a consistent "warm golden-hour, editorial fashion photography" instruction across every prompt for visual consistency across the whole site.

### 6.1 Homepage Hero / Cover Image
> "Editorial luxury fashion photograph of an elegant Indian woman wearing a richly embroidered traditional handloom outfit (Banarasi silk drape) in a warm sunlit haveli courtyard with sandstone jaali lattice walls. Soft golden-hour natural light, shallow depth of field, muted ivory and gold color grading, calm confident pose, magazine cover composition, negative space on the left third for text overlay, ultra-realistic, high-end fashion photography, no text, no watermark."

### 6.2 About / Brand Story Section Image
> "Warm documentary-style photograph of artisan hands hand-embroidering gold zari thread onto traditional Indian fabric, close-up macro shot, soft window light, rich texture detail of thread and fabric, ivory and maroon tones, shallow depth of field, authentic craftsmanship feel, no text."

### 6.3 Category Tile — Sarees
> "Soft editorial photograph of a folded stack of three handwoven traditional Indian silk sarees in ivory, deep maroon, and gold tones, draped elegantly on a wooden bench, natural window light, minimal styling with a single brass diya beside the stack, warm luxury aesthetic, no text."

### 6.4 Category Tile — Lehengas
> "Full-length editorial fashion photo of an ornate hand-embroidered Indian lehenga on a mannequin form in a softly lit cream-colored studio with one Mughal jaali-pattern decorative panel in the background, warm golden lighting, luxury bridal-wear catalog style, no model face visible, no text."

### 6.5 Category Tile — Kurta Sets
> "Editorial flat-lay photograph of a hand block-printed cotton kurta set folded neatly beside a small brass diya and a few marigold petals, on an ivory linen surface, soft natural daylight from the side, warm minimal styling, no text."

### 6.6 Category Tile — Accessories / Jewelry (optional 4th category)
> "Close-up editorial photograph of traditional Indian jadau jewelry — a gold and kundan necklace and matching earrings — displayed on a cream silk fabric with a few rose petals, warm soft lighting, luxury jewelry catalog style, no text."

### 6.7 Decorative Background Pattern (site-wide subtle texture)
> "Seamless tileable vector pattern of delicate gold paisley (kairi) and small mandala motifs on a transparent or cream background, thin linework, minimal and elegant, suitable for a subtle 5%-opacity website background texture, no color saturation, luxury Indian textile pattern, flat vector illustration style."

### 6.8 Section Divider Motif (diya icon)
> "Minimalist single-line vector icon of a traditional Indian diya (oil lamp) with a small flame, gold line on transparent background, elegant and simple, suitable for a website section divider icon, flat vector, no shading."

### 6.9 Loading Animation Frames (diya flame flicker — 3 frame set)
> "Generate 3 sequential frames of a minimalist gold line-art diya icon with a small flame: frame 1 small flame, frame 2 medium flame slightly tilted, frame 3 tall flame slightly tilted opposite direction — transparent background, identical line weight and diya base across all 3 frames, for a looping CSS flame-flicker animation, flat vector style."

### 6.10 Footer Background Texture
> "Subtle dark maroon textile-inspired background texture resembling hand-block printed fabric with faint gold botanical motifs, very low contrast, suitable as a website footer background behind white text, luxury aesthetic, seamless edges."

### 6.11 Mobile Hero (vertical crop)
> "Same as Homepage Hero prompt (6.1) but composed in vertical 4:5 portrait orientation with the woman centered and more headroom above for a mobile navigation bar, golden-hour lighting, no text."

### 6.12 Craft Story Banner (Our Vision section)
> "Wide editorial photograph of a small group of Indian women artisans working together at a handloom, warm afternoon light streaming through a window, vibrant but tastefully muted thread colors in the background, candid and dignified mood, documentary fashion-brand style, no text, no logos."

**Consistency note for Gemini prompting:** Always end every prompt with the same closing tag — *"warm golden ivory color grading, luxury editorial fashion photography, no text, no watermark, 4k quality"* — to keep tonal consistency across all generated assets.

---

## 7. Site Structure & Navigation (Novica-inspired, simplified)

```
Logo (left) | Sarees | Lehengas | Kurta Sets | Accessories | (search icon) | Wishlist | Cart
```

- **4 top-level category links** directly in the navbar (no dropdown needed at this catalog size — keeps nav "bright" and uncluttered). Optional: a subtle gold underline-on-hover instead of dropdown menus.
- **Secondary nav row (optional, thin strip):** Our Story | New Arrivals | Contact
- **Sticky navbar** that shrinks slightly on scroll, background fades from transparent (over hero) to Ivory Silk.

### Sitemap
1. **Home** — Landing page (see §8)
2. **Category Page** ×4 — Sarees / Lehengas / Kurta Sets / Accessories
3. **Product Detail Page** — per product
4. **Our Story / About** — brand vision, artisan story
5. **Cart**
6. **Checkout** (basic, backend TBD)
7. **Contact**
8. **Wishlist** (optional nice-to-have)

---

## 8. Landing Page — Section-by-Section Plan

1. **Hero Section**
   - Full-bleed cover image (Asset 6.1), logo + nav overlaid on transparent bar.
   - One-line tagline (e.g. *"Handcrafted Heritage, Worn Today."*) in serif display + a single gold CTA button ("Explore the Collection").

2. **Brand Vision Strip**
   - 3 short pillars in a row with thin diya-icon dividers: *Handmade* / *Traditional Craft* / *Modern Elegance* — one line each, icon + 4-5 words.

3. **Shop by Category (Quick Links)**
   - 3–4 large image tiles (Assets 6.3–6.6), each linking straight to its category page. Hover = soft zoom + gold border reveal.

4. **Our Story Section**
   - Split layout: artisan image (Asset 6.2 or 6.12) on one side, short brand story copy on the other ("About House of Gargi" — 2-3 short paragraphs + "Read our story" link to About page).

5. **Featured Products**
   - A curated row of 4–6 best pieces pulled across categories, each card with image, name, price, and a one-line "artisan note" (Novica-style provenance line, e.g. "Hand block-printed in Jaipur").

6. **Craftsmanship / Why House of Gargi**
   - Banner image (6.12) + 2–3 trust points (handmade guarantee, ethical sourcing, limited-edition pieces) styled like Novica's "impact" messaging but luxury-toned.

7. **Newsletter / Closing CTA**
   - Simple email capture on a maroon or sand background block with gold diya divider, "Join the House of Gargi family."

8. **Footer**
   - Texture background (Asset 6.10), 4 columns: Shop (category links), About/Contact, Customer Care (Shipping/Returns/FAQ — content TBD), Social + Newsletter. Small motif divider above copyright line.

---

## 9. Category Page Plan (Novica-style)

1. Banner image specific to category (reuse tile asset, larger crop) + 1-line story ("Sarees, handwoven across the looms of Banaras and Kanchipuram.")
2. Thin filter/sort bar: Fabric | Occasion | Price | Sort by (New/Price) — even with 5–8 products, this preserves the "real store" feel.
3. Product grid: 2 rows × 3–4 columns desktop (responsive to 2-col mobile), each card = image, name, price, 1-line artisan note, wishlist heart icon.
4. "Explore Other Collections" strip at the bottom — tiles linking to the other 2–3 categories.

## 10. Product Detail Page Plan

- Left: image gallery (3–4 images, zoom on hover).
- Right: Product name (serif), price, short poetic description, fabric/craft technique detail, size selector, Add to Cart (gold button), artisan/region note block, care instructions accordion.
- Below: "You May Also Like" — 3-4 related products, cross-category if needed.

---

## 11. Component Style Notes (for dev handoff)

- **Buttons:** Primary = Maharani Maroon fill, Ivory text, sharp corners, gold border on hover. Secondary = transparent with gold 1px border.
- **Cards:** Pure White or Ivory background, 1px Soft-Gold-Line border, no heavy drop shadows — use a very subtle 4–8px soft shadow only.
- **Spacing:** Generous section padding (96–120px desktop, 48–64px mobile) — whitespace is the luxury signal.
- **Icons:** Custom line-art (diya, paisley, jaali) over generic icon packs wherever brand-facing; standard icon set (cart, search, heart) can stay minimal/neutral for usability.
- **Imagery aspect ratios:** Hero 16:9, Category tiles 4:5, Product cards 4:5, About split-images 1:1 or 4:5.

---

## 12. Open Items (Decide Later)
- Backend/CMS choice, payments, inventory logic.
- Final font licensing (Butler vs. Cormorant Garamond substitution).
- Whether Accessories is category #4 or held back for a future drop (currently planned as optional 4th category).
- Real photography vs. Gemini-generated imagery for the final production site (Gemini assets recommended for MVP/demo; consider real shoot before public launch for product-accuracy reasons).

---

## 13. Implementation Status (Completed)

**✅ 1. Project Initialization**
- React + Vite + Vanilla CSS project created.
- Git repository initialized and connected to remote (Push pending GitHub permissions).
- Basic dependencies (`react-router-dom`) installed.

**✅ 2. Assets & Generation**
- All 8 key images generated using Gemini prompts (Hero, Artisan Hands, 4x Category Tiles, Craft Banner, Footer Texture).
- Assets integrated into `src/assets/`.

**✅ 3. Design System & Styling**
- `index.css` populated with the complete design system.
- Variables set for Color Palette (Ivory Silk, Warm Sand, Gargi Gold, Maharani Maroon).
- Typography scale and fonts imported (Cormorant Garamond, Marcellus, Lato).
- Common elements styled (Buttons, Diya Divider, Product Cards, ScrollReveal).

**✅ 4. Data Layer**
- Created `src/data/products.js`.
- Implemented 4 categories (Sarees, Lehengas, Kurta Sets, Accessories).
- Populated with 18 high-end curated products containing complete metadata, pricing, and artisan notes.

**✅ 5. Components & Layout**
- `Navbar.jsx`: Responsive, sticky header with mobile menu.
- `Footer.jsx`: 4-column layout with maroon texture background.
- `ProductCard.jsx`: Reusable product card with image hover effect.
- `ScrollReveal.jsx`: Custom intersection observer component for smooth fade-ins.

**✅ 6. Pages (Routing Setup)**
- `Home.jsx`: Hero banner, vision strip, category tiles, brand story, featured products, newsletter.
- `Category.jsx`: Filter/sort bar, dynamic product grid, cross-category discovery strip.
- `ProductDetail.jsx`: Gallery, info panel, size selector, care accordion, "You May Also Like" section.
- `OurStory.jsx`: Deep dive into brand narrative and artisan focus.