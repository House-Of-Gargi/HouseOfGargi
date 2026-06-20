# House of Gargi — Frontend Design Review & Improvements

> **Reviewer:** Claude (Opus 4.8) · **Date:** 2026-06-20
> **Scope:** A pure design/aesthetic review of the whole `HouseOfGargi/` codebase —
> typography, **font sizes**, **icon sizes**, spacing, color, and consistency across
> **mobile and desktop**. This is review + recommendations only; no code was changed.
> **Files reviewed:** `src/index.css` (the entire design system), `index.html`,
> `Navbar.jsx`, `Footer.jsx`, `ProductCard.jsx`, `Home.jsx`, `Category.jsx`,
> `ProductDetail.jsx`, plus `ScrollReveal.jsx` / `OurStory.jsx`.

**Legend:** 🔴 = noticeably hurts the premium feel / breaks on a viewport · 🟠 = inconsistent, worth fixing · 🟡 = polish.

---

## 0. The headline issue (read this first)

**The single biggest aesthetic problem is the icon system.** Icons are currently a
**three-way mix** of:
1. **Unicode typographic glyphs** — `⌕` (search), `♡` (wishlist/heart), `−` `+` (accordion), `→` (arrows), `✦` `❋` (vision/craft bullets), `☰` `✕` (mobile menu).
2. **One real inline SVG** — the cart icon in `Navbar.jsx:33`.
3. **A color emoji** — `🪔` (diya) used in dividers, the vision strip, the artisan note, the newsletter, the footer, and the PDP.

This is the thing that most undercuts a "luxury, handmade" brand, for three concrete reasons:

- **The diya `🪔` is a full-color emoji.** It renders in Apple/Google/Samsung's own
  cartoon style — bright orange/blue, glossy — which **directly violates the palette's
  "never more than one saturated accent per viewport" rule** and looks nothing like the
  elegant gold line-art diya the brand doc specifies (Asset 6.8). It also renders
  *differently on every OS*, so the brand mark is not under your control.
- **Unicode glyphs (`⌕ ♡ ✦ ❋`) have wildly different visual weights and baselines**
  between fonts/OSes. `⌕` (the search glyph) is especially fragile — on many Windows
  browsers it's nearly invisible or boxy. `♡` sits off-center vertically.
- **Sizes are set in `font-size`, not a unit system** — so an 18px `♡` and an 18px SVG
  cart are *not* the same optical size, and they don't align on the navbar baseline.

**Recommendation (one change, biggest payoff):** adopt **one** icon approach — a small set
of consistent **stroke SVGs** (you already have the cart SVG as the template: `1.8`
stroke, `currentColor`, 24-viewbox). Replace search, heart, hamburger, close, arrows, the
diya, and the `✦`/`❋` bullets with line-art SVGs at a shared `1.5–1.8` stroke weight in
`--gargi-gold` or `currentColor`. Either inline them like the cart, or use a tiny set under
`src/assets/icons/`. This alone moves the site from "template" to "designed."

The rest of this doc assumes that's the north star and details sizing on top of it.

---

## 1. Typography — font sizes

### What's already good ✅
- The `clamp()` scale on `h1`–`h3` (`index.css:61-63`) is the right instinct — fluid type that won't blow up the tiny catalog on mobile.
- Body at `16px / line-height 1.7` (`index.css:43-44`) is comfortable and legible.
- Discipline is correct: serif (`--font-display`) for headings only, sans (`--font-body`) for all functional text. This matches the brand doc and is the right call.

### 🔴 1.1 — Cormorant Garamond at weight 500 is too thin at hero sizes
`h1` and `.hero__tagline` render Cormorant at `font-weight: 500` and up to **60–64px**
(`index.css:57,61` / `index.css:582`). Cormorant is a high-contrast, *light-by-nature*
serif — at 60px/weight-500 the thin strokes look fragile and slightly "weak," which reads
as *delicate* rather than *confident luxury*. The brand doc itself flags this ("specify a
weight or it'll look spindly").
- **Fix:** use **weight 600** for the hero `h1`/tagline (you already load `600` in
  `index.html:11`), keep 500 for `h2`/`h3`. Consider `letter-spacing: 0.005em` and
  `line-height: 1.1` at the largest sizes so the big serif feels deliberate.

### 🟠 1.2 — Mobile heading minimums are slightly large for a 360px screen
`h1` min is `36px` and the hero tagline min is `36px`. On a 360–390px phone, a 36px
Cormorant headline at `max-width` can wrap to 4–5 lines in the hero and feel cramped under
the fixed navbar.
- **Fix:** drop the hero tagline floor to `clamp(30px, 8vw, 60px)` and `h1` to
  `clamp(30px, 5vw, 64px)`. Tighten `.hero__content` top padding on mobile (see §3.2).

### 🟠 1.3 — Several functional text sizes are below comfortable mobile minimums
These are all **fixed px** (no clamp), and several sit at the small end:
| Element | Current | File | Note |
|---|---|---|---|
| `.filter-bar__label` | **11px** | `index.css:502` | Too small; uppercase + 0.16em tracking makes it harder, not easier, to read |
| `.nav-label` / nav links | **12–13px** | `index.css:73,344` | OK on desktop; fine because tracked + uppercase, but see tap-target §2.3 |
| `.caption`, `.product-card__artisan` | **13px** | `index.css:79,209` | Acceptable, but the artisan note is *italic Stone-Taupe 13px on white* — low contrast (see §4.1) |
| `.pdp__accordion-header` | **12px** | `index.css:873` | Fine |
| Footer links | **14px** | `index.css:423` | Good |

- **Fix:** bump `.filter-bar__label` to **12–13px**. Leave the tracked-uppercase nav labels
  as-is (they're meant to be small), but make sure their **tap targets** are large (§2.3).
  Establish a rule: **no functional text below 12px**, and nothing below 13px that isn't
  uppercase-tracked.

### 🟡 1.4 — Two competing "small serif italic subtitle" sizes
The home section subtitles are inline-styled `fontSize: '18px'` (`Home.jsx:61,115`) while
the category banner tagline is `18px` (`index.css:754`) and the hero subtitle is
`clamp(16px,2vw,20px)`. Close, but ad-hoc.
- **Fix:** make one utility, e.g. `.subtitle-italic { font-size: clamp(15px,2vw,18px) }`,
  and stop inline-styling font sizes in JSX (there are ~6 inline `fontSize` overrides across
  `Home.jsx`/`ProductDetail.jsx` — they make the type scale impossible to reason about).

### 🟡 1.5 — `letter-spacing` on uppercase nav is on the high side
Nav links use `0.18em` (`index.css:344`). At 12px that's elegant; just confirm the brand
wordmark "HOUSE OF GARGI" (if ever set uppercase) doesn't inherit it and over-stretch.

---

## 2. Icon sizes (desktop + mobile)

> All of these assume you adopt the single-SVG-system from §0. Sizes below are the optical
> targets regardless of implementation.

### 🔴 2.1 — Navbar icons are visually unequal and too small for the bar
`.navbar__icons button` is `font-size: 18px` (`index.css:374`) — but the cart is an
**18×18 SVG** while search `⌕` and heart `♡` are **18px glyphs** that optically render
*smaller* and off-baseline. On the ~64px hero navbar they look undersized.
- **Fix:** standardise all three to **20×20 SVGs** in a fixed box, vertically centered.
  Give each button a fixed hit area (§2.3). Optically the heart and search should match the
  cart's weight exactly.

### 🔴 2.2 — The diya emoji sizes are arbitrary and color-clashing
`🪔` appears at: divider `18px` (`index.css:166`), vision-strip `28px` (`index.css:613`),
plus default size in the artisan note / newsletter / footer. Because it's emoji, each is a
different *colored* glyph, not a scalable gold mark.
- **Fix:** replace with the **gold line-art diya SVG** (brand Asset 6.8) at three defined
  sizes: divider **16px**, section accent **24px**, vision-strip feature **28–32px** — all
  in `--gargi-gold`, single stroke. This instantly aligns with the palette.

### 🟠 2.3 — Tap targets are below the 44px mobile minimum
Multiple interactive icons have only `padding: 4px` around an ~18–24px glyph:
- `.navbar__icons button` — `padding: 4px` (`index.css:375`) → ~26px target.
- `.navbar__mobile-toggle` — `padding: 4px`, `font-size: 24px` (`index.css:387-388`) → ~32px.
- `.product-card__wishlist` — `36×36` (`index.css:223-224`) → close, still under 44px.
- **Fix:** give all tappable icon-buttons a **min 44×44px** hit area (`min-width/height:44px`,
  center the icon). Visual icon stays 20–24px; the *target* grows. This is the most common
  real usability miss on the site and matters most on mobile.

### 🟠 2.4 — Vision-strip & craft bullets use decorative Unicode as "icons"
`✦` (`Home.jsx:34,143-151`) and `❋` (`Home.jsx:47`) are stand-ins for real motif icons.
They're inconsistent in weight and meaning (a 4-point star vs a 6-point asterisk-flower).
The brand doc specifies *paisley / jaali / diya / marigold* line-art.
- **Fix:** swap for 2–3 actual brand line-icons (e.g. lotus, charkha/loom, jaali) at a
  consistent **28–32px** in gold. Even simple SVGs beat font glyphs here.

### 🟡 2.5 — Accordion +/− and arrows
`+ / −` (`ProductDetail.jsx:105`) and `→` (`Home.jsx:74`, `Category.jsx:94`) are Unicode.
Fine functionally, but for consistency once you have an icon set, use a chevron/plus SVG so
weights match. Low priority.

---

## 3. Responsive / mobile-specific layout

### 🔴 3.1 — PDP "You May Also Like" is locked to 4 columns on ALL screens
`ProductDetail.jsx:120` hard-codes `gridTemplateColumns: 'repeat(4, 1fr)'` **inline**, which
**overrides** the responsive `.product-grid` rules in `index.css:891,902`. On a phone this
forces four columns into ~360px → ~80px-wide cards with unreadable 18px serif names and
clipped prices.
- **Fix:** remove the inline override and let `.product-grid` do its job (3→2→2 cols), or add
  a `--related` modifier that still collapses on mobile. **This is the most concrete mobile
  breakage in the codebase.** Same risk on `Category.jsx:87` and `Home.jsx:66` which inline
  `repeat(4,1fr)` for the category tiles (those at least are tiles, but they'll be tiny on
  small phones — see §3.3).

### 🟠 3.2 — Hero content top padding doesn't adapt; fixed `paddingTop:120px` on PDP
- `.hero__content` has `padding-top: 80px` (`index.css:578`) to clear the navbar; on a short
  mobile viewport with a 36px tagline this can push the CTA below the fold.
- `ProductDetail.jsx:26` uses inline `paddingTop: '120px'` to clear the fixed navbar — a
  magic number that won't track the navbar's scrolled/unscrolled height and is duplicated
  logic. **Fix:** use a `--navbar-height` variable and `scroll-margin`/padding off it, and
  reduce hero top-pad on mobile.

### 🟠 3.3 — 4-up category tiles get too small below 900px
The homepage "Shop by Collection" grid is inline `repeat(4,1fr)` (`Home.jsx:66`) with **no
responsive collapse** (the CSS responsive rules target `.product-grid`, not this inline
grid). At 600–900px four 4:5 tiles become thin strips.
- **Fix:** move this grid into a real CSS class (e.g. `.category-grid`) and collapse to
  **2 columns** at ≤900px and ≤600px. Don't rely on inline styles for anything that needs to
  respond.

### 🟠 3.4 — Mobile menu is a basic slide-down, not a premium drawer
`Navbar.jsx:50-65` renders an inline-styled slide-down list. It works, but: it's styled
inline (not in the design system), it has no overlay/scrim, no animation, and the links are
left-aligned `nav-label` with no spacing rhythm. For a luxury feel this is the weakest
surface on mobile.
- **Fix:** a proper full-height drawer or centered overlay menu with the wordmark, generous
  line-height, a gold hairline between items, and a soft fade/slide. Move styles into
  `index.css`.

### 🟡 3.5 — Product grid gap shrinks to 12px at 600px
`index.css:902` sets `gap: 12px` for the 2-col mobile grid. With white cards on ivory and
18px serif names, 12px feels tight.
- **Fix:** `16px` gap on mobile reads more "boutique," less "catalog."

### 🟡 3.6 — No `prefers-reduced-motion` guard
`.fade-up` and the diya `flicker` run unconditionally. Some users get motion sickness; it's
also a quick accessibility win.
- **Fix:** wrap transitions in `@media (prefers-reduced-motion: no-preference)` or disable
  transforms under `reduce`.

---

## 4. Color & contrast (affects perceived polish)

### 🔴 4.1 — Gold text/elements on ivory fail readability
This is the brand doc's known risk, and it's live in the CSS:
- `.btn--outline` is **Gargi Gold text `#C9A227` on transparent/ivory** (`index.css:131`) ≈
  **2.3:1 contrast** → fails WCAG AA badly. The "Read Our Story" and "Add to Wishlist"
  buttons use this.
- The "Clear filters" link is gold on ivory (`Category.jsx:69`) — same problem.
- `.category-tile__label span` is `opacity: 0.8` white over a gradient — usually OK, but on
  light image areas the "Explore →" can wash out.
- **Fix:** gold is for **borders, dividers, and large foil accents — not text**. For the
  outline button, use **Maroon or Ink-Brown text with a gold border**; reserve gold fills
  for the `.btn--gold` (which has ivory text on gold = fine). Add a contrast note to the CSS.

### 🟠 4.2 — Stone-Taupe small text is borderline
`--stone-taupe #8B7E6F` on ivory ≈ **3:1** — fine for large/secondary text, **fails for
13px** captions and the italic artisan note (`index.css:208-212`).
- **Fix:** for 13px secondary text use a slightly darker taupe (e.g. `#6F6456`) or bump the
  size to 14px.

### 🟡 4.3 — Emoji diya breaks the "one saturated accent per viewport" rule
Covered in §0/§2.2 — the color emoji is literally an uncontrolled saturated accent in the
divider, vision strip, newsletter and footer simultaneously. Replacing with gold line-art
fixes a color-discipline violation, not just an icon nit.

---

## 5. Smaller consistency notes

- 🟡 **Inline styles everywhere.** ~20+ inline `style={{...}}` blocks across pages set font
  sizes, colors, grid columns, and padding (e.g. `Home.jsx:59,61,66`, `ProductDetail.jsx:26,
  52,64,70-72,78,94,120`). This makes the design system in `index.css` only *half* the truth
  and is why several responsive bugs exist (inline grids don't inherit the media queries).
  **Move recurring patterns into classes.**
- 🟡 **Button vertical padding varies.** `.btn` is `14px 36px` (`index.css:109`) but the PDP
  Add-to-Cart is inline `padding: 16px` (`ProductDetail.jsx:94`) which *overrides both axes*
  → it loses the 36px horizontal and becomes 16px all around. Standardise full-width button
  padding via a `.btn--block` modifier.
- 🟡 **`.product-card__name` at 18px serif** can clip to 2 lines on narrow mobile cards
  without a reserved height → uneven card bottoms. Add `min-height` or `line-clamp: 2`.
- 🟡 **Favicon is still `vite.svg`** (`index.html:5`) — replace with a gold monogram/diya for
  brand polish.
- 🟡 **`html { scroll-behavior: smooth }`** plus fixed navbar means anchor jumps hide under
  the bar — pair with `scroll-padding-top: var(--navbar-height)`.
- 🟡 **Loading state** (`.diya-loader`) is built but I didn't see it used on any route; with
  static local data there's nothing async. Fine to keep for future, just noting it's dormant.

---

## 6. Priority order (do these first)

**🔴 High impact, low effort — do now:**
1. **Replace the emoji diya + Unicode icons with one gold line-art SVG set** (§0, §2.1, §2.2, §2.4). Biggest single aesthetic upgrade.
2. **Fix the PDP related-grid `repeat(4,1fr)` inline override** so it collapses on mobile (§3.1). Concrete breakage.
3. **Fix gold-on-ivory text contrast** on the outline button + clear-filters link (§4.1).
4. **Give all icon buttons 44×44 tap targets** (§2.3).
5. **Bump hero `h1` to weight 600** so the serif feels confident, not fragile (§1.1).

**🟠 Medium — next pass:**
6. Move inline grids (category tiles, related) into responsive CSS classes (§3.3, §5).
7. Bump sub-12px functional text; darken taupe for small captions (§1.3, §4.2).
8. Proper mobile drawer instead of inline slide-down (§3.4).
9. Normalise the navbar-height magic numbers into a variable (§3.2).

**🟡 Polish:**
10. `prefers-reduced-motion`, favicon, mobile grid gap 16px, card name line-clamp, unify subtitle size.

---

## 7. One-paragraph verdict

The bones are genuinely good: the `clamp()` type scale, the color tokens, the serif-for-
headings / sans-for-body discipline, and the section rhythm (ivory↔sand) are all correct and
on-brand. What's holding it back from looking *premium* is **execution consistency**, and it
concentrates in two places you specifically asked about: **icons** (a color emoji + mismatched
Unicode glyphs at inconsistent sizes — the #1 fix) and **responsive sizing** (a handful of
inline `repeat(4,1fr)` grids and magic-number paddings that break or cramp on mobile, plus
icon tap targets under 44px). Fix the icon system, kill the inline grid overrides, correct the
gold-on-ivory contrast, and enforce 44px touch targets — those four changes alone take this
from "nice template" to "looks designed," on both mobile and desktop.

---

## 8. Implementation Logs (Completed)

*All recommendations from sections 1-5 have been evaluated and fully implemented.*

**1. Icon System & Touch Targets (Section 0 & 2)**
- Created `src/components/Icons.jsx` to house a unified, 1.5-stroke scalable SVG library.
- Replaced all typography glyphs (`⌕ ♡ − + → ✦ ❋ ☰ ✕`) across `Navbar`, `Home`, `OurStory`, `Category`, and `ProductDetail`.
- Replaced the full-color emoji `🪔` with `<DiyaIcon>` to restore color-palette discipline.
- Added 44x44px minimum tap target wrappers for all interactive icons.

**2. Typography & Contrast (Section 1 & 4)**
- Bumped Hero `h1` to `font-weight: 600` for more confident presentation.
- Adjusted `--stone-taupe` from `#8B7E6F` to `#786C5E` for better contrast on captions.
- Replaced `.btn--outline` gold text with maroon (`--maharani-maroon`) to fix the failing contrast ratio against ivory backgrounds.
- Created the `.subtitle-italic` semantic utility class and stripped inline font sizes.
- Bumped `.filter-bar__label` to 12px for legibility.

**3. Responsive Refinements (Section 3 & 5)**
- Extracted inline grid overrides (`repeat(4, 1fr)`) into responsive `.category-grid` and `.related-grid` classes that collapse properly to 2 columns on mobile.
- Set `-webkit-line-clamp: 2` on product card names to keep grid baselines perfectly aligned.
- Converted the inline navbar menu into a premium, full-screen `.mobile-drawer` overlay.
- Wrapped keyframe animations and scale transforms in `@media (prefers-reduced-motion: reduce)`.
- Increased mobile product grid gaps to 16px to prevent overcrowding.
