# House of Gargi — Luxury Design System & Theme Hierarchy
*Handcrafted Indian Luxury Fashion — Official Design Specifications*

---

## 1. Brand Philosophy & Aesthetic Direction

House of Gargi is positioned in the **quiet luxury** segment of traditional Indian couture and handcrafted heritage fashion (akin to *Anita Dongre*, *Sabyasachi*, and *Raw Mango*).

### Core Aesthetic Pillars
- **Airy Restraint**: Never crowd elements. Generous negative space (ivory whitespace) conveys exclusivity and calm.
- **Heirloom Craftsmanship**: Focus on artisanal origin, weaving techniques, and tactile textures rather than aggressive promotional badges.
- **Editorial Presentation**: High-contrast, elegant typography paired with warm, golden-hour, lifestyle photography.
- **Color Discipline**: Strict adherence to the **70-20-10 Rule** (70% neutrals, 20% deep grounding ink/taupe, 10% curated rich accents). Never show more than one saturated accent in any single viewport.

---

## 2. Color Palette & Hierarchy

### 2.1 The Official Palette Matrix

| Token Name | CSS Variable | Hex Code | RGB | Role & Hierarchy | Ratio Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ivory Silk** | `--ivory-silk` | `#FBF6EE` | `251, 246, 238` | **Dominant Base**. Main page background, modal canvas, breathing space. | 50% |
| **Warm Sand** | `--warm-sand` | `#F2E8D8` | `242, 232, 216` | **Secondary Base**. Alternating sections, card surfaces, subtle contrast. | 20% |
| **Pure White** | `--pure-white` | `#FFFFFF` | `255, 255, 255` | **Catalog Isolation**. Product image tiles only, keeping garment colors true. | Contextual |
| **Ink Brown** | `--ink-brown` | `#231812` | `35, 24, 18` | **Primary Text**. Deep espresso ink, highest contrast & warmth (WCAG AAA). | 15% |
| **Stone Taupe** | `--stone-taupe` | `#5C5043` | `92, 80, 67` | **Secondary Text**. Darkened for 30+ visual accommodation, captions, origins. | 5% |
| **Soft Gold Line** | `--soft-gold-line` | `#E4D3AE` | `228, 211, 174` | **Hairlines**. Delicate dividers, input outlines, table rows, card borders. | Accents |
| **Gargi Gold** | `--gargi-gold` | `#B88E18` | `184, 142, 24` | **Primary Accent**. Foil accents, active indicators, luxury CTAs, diya glows. | 5% |
| **Maharani Maroon** | `--maharani-maroon` | `#7A2331` | `122, 35, 49` | **Deep Regal Accent**. Key headlines, primary buy buttons, hero hover states. | 4% |
| **Peacock Teal** | `--peacock-teal` | `#1F6F6B` | `31, 111, 107` | **Supporting Accent**. Festive tags, sustainable craft badges, secondary links. | 1% |
| **Marigold** | `--marigold` | `#E08A1E` | `224, 138, 30` | **Highlight Accent**. Limited edition badges, notification dots. | Rare (<1%) |

---

## 3. Typography Hierarchy & Sizing Rules (30+ International Standards)

Typography is calibrated for a **discerning 30+ international luxury clientele**. Visual hierarchy prioritizes **instant optical legibility**, generous leading, high-contrast text, and quiet stately elegance.

### 3.1 Font Families

1. **Display / Headlines**: `'Cormorant Garamond', Georgia, serif`
   - High-contrast classical serif with optical kerning. Evokes royal Indian heritage and literary depth.
2. **Navigation & Badges**: `'Marcellus', 'Cinzel', serif`
   - Stone-carved, all-caps styling with generous letter spacing (`0.14em–0.18em`).
3. **Body & Functional UI**: `'Lato', 'Inter', -apple-system, sans-serif`
   - High-legibility humanist sans-serif with spacious line-height (`1.75–1.8`) to eliminate micro-fatigue.

---

### 3.2 Visual Type Hierarchy Table (30+ Audience Specifications)

| Level | Element / Role | Font Family | Weight | Desktop Size | Mobile Size | Line Height | Letter Spacing | Contrast & Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | Hero Headline | Cormorant Garamond | `600` | `64px` | `36px` (`clamp(36px, 5vw, 64px)`) | `1.15` | `0.01em` | Landing page hero banner |
| **H1** | Page Titles | Cormorant Garamond | `600` | `48px` | `34px` (`clamp(32px, 4vw, 48px)`) | `1.18` | `0.01em` | Collection titles, page headers |
| **H2** | Section Titles | Cormorant Garamond | `500` | `38px` | `28px` (`clamp(28px, 3.5vw, 38px)`) | `1.22` | `0.01em` | Major module headings |
| **H3** | Subsection / Card Titles | Cormorant Garamond | `600` | `26px` | `22px` (`clamp(20px, 2.5vw, 26px)`) | `1.3` | `0` | Product card titles, modal titles |
| **Subtitle** | Editorial Tagline | Cormorant Garamond | `400 Italic` | `22px` | `18px` (`clamp(18px, 2vw, 22px)`) | `1.5` | `0.02em` | Emotive brand lines, artisan notes |
| **Nav / CTA** | Buttons & Main Nav | Marcellus | `500` | `15px` | `14px` | `1.0` | `0.16em` | Uppercase buttons, top nav links |
| **Body Large** | Introduction Copy | Lato | `400` | `19px` | `17px` | `1.8` | `0` | Brand story leads, editorial excerpts |
| **Body Regular** | Standard Body / PDP | Lato | `400` | `18px` | `16px` | `1.75` | `0` | Product descriptions, policy copy |
| **Body Bold** | Prices / Highlights | Lato / Cormorant | `700` | `28px` | `24px` | `1.3` | `0.02em` | Currency values, stock status |
| **Caption / Meta** | Subtext, Origin, Specs | Lato | `500` | `14px` | `13.5px` | `1.6` | `0.05em` | Minimum size allowed; never below 13.5px |

> [!IMPORTANT]
> **30+ Readability Laws**:
> 1. **No Micro-Text**: Never use fonts smaller than `13.5px` on any screen.
> 2. **Comfortable Leading**: Body copy must maintain `line-height: 1.75` to `1.8` to prevent ocular strain.
> 3. **High Contrast**: Always set captions in `--stone-taupe` (`#5C5043`) or darker. Washed-out light grays are strictly prohibited.
> 4. **Grounded Authenticity**: Avoid ungrounded marketing hyperbole (e.g. "7th generation dynasties", "10 generations", "fearlessly debated the universe"). Employ dignified, grounded terminology: *Generational Weaving Families*, *Partner Artisan Collectives*, *Centuries-old Pit Loom Traditions*.

---

## 4. Component Stylings & Micro-Interactions

### 4.1 Buttons
- **Shape**: Rectangular with subtle micro-radius (`1px` or `2px`). No bubbly rounded pill buttons.
- **Lettering**: Always uppercase, wide letter-spacing (`0.16em`).
- **Transitions**: Smooth `300ms ease`.

```css
/* Primary Royal Button */
.btn--primary {
  background: var(--maharani-maroon);
  color: var(--ivory-silk);
  border: 1.5px solid var(--maharani-maroon);
  padding: 14px 28px;
  font-family: var(--font-nav);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.btn--primary:hover {
  background: transparent;
  color: var(--maharani-maroon);
  border-color: var(--gargi-gold);
}

/* Secondary Gold Outline Button */
.btn--outline {
  background: transparent;
  color: var(--maharani-maroon);
  border: 1.5px solid var(--gargi-gold);
}
.btn--outline:hover {
  background: var(--gargi-gold);
  color: var(--ivory-silk);
}
```

### 4.2 Heritage Dividers
- Instead of raw `<hr>` lines, House of Gargi utilizes a thin gold hairline centered with a brass Diya or Vedic motif:
```html
<div class="divider">
  <span class="divider__icon">
    <DiyaIcon size={16} />
  </span>
</div>
```
- Line thickness: `1px solid var(--soft-gold-line)`.

### 4.3 Product Cards
- Card surface: `var(--pure-white)` image frame on `var(--ivory-silk)` background.
- Image aspect ratio: 3:4 portrait (fashion catalog standard).
- Hover effect: Gentle image zoom (`transform: scale(1.04); transition: 600ms cubic-bezier(0.25, 1, 0.5, 1);`).
- Wishlist icon: Floating top-right with soft shadow, filled with Maharani Maroon on active state.

---

## 5. Spacing System & Grid

- **Desktop Container Max**: `1280px` centered with `24px` gutter.
- **Section Padding**:
  - Desktop: `100px 0`
  - Tablet: `72px 0`
  - Mobile: `48px 0`
- **Grid Systems**:
  - Category / Lookbook Grid: 2 columns on mobile, 4 columns on desktop with `24px–32px` gaps.
  - Story Split Sections: 50% image / 50% copy with generous `64px` interior gutter.

---

## 6. Imagery Standards
- **Tone**: Warm golden-hour natural sunlight, authentic Indian textures (sandstone courtyards, handlooms, silk sheen).
- **Prohibited**: Cold studio white lighting, oversaturated clipart, cartoon emojis, or low-resolution compressed banners.
