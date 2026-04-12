# Design System Strategy: The Digital Atelier

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

We are not building a standard SaaS dashboard; we are crafting a private viewing room. The aesthetic must bridge the gap between the heritage of high-fashion houses (Gucci, Saint Laurent) and the precision of advanced artificial intelligence. We achieve this through "Atmospheric Minimalist" layouts: prioritizing negative space, intentional asymmetry, and tonal depth over structural lines. The UI should feel like a curated editorial spread where the AI is the invisible tailor, and the interface is the velvet backdrop.

## 2. Colors & Surface Philosophy
The palette moves away from "flat" digital design into a world of deep, ink-like navies and crystalline overlays.

### The Palette
*   **Primary (The Ink):** `#0F172A` (Primary-Container) – Use this for foundational structural elements.
*   **Secondary (The Slate):** `#1E293B` – Used for supporting architectural layers.
*   **Accent (The Signature):** `#E11D48` (Tertiary-Container/Fixed) – Use sparingly as a "hallmark" or "seal of quality."
*   **Neutral (The Light):** `#F8FAFC` – Reserved for high-contrast typography and minimalist highlights.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. The "boxed-in" look is the antithesis of luxury. Separation must be achieved through:
*   **Tonal Shifts:** Placing a `surface-container-high` element against a `surface` background.
*   **Negative Space:** Using generous, rhythmic padding from the spacing scale to denote content groups.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials.
*   **Base:** `surface` (#0b1326) – The deep, infinite floor.
*   **Secondary Layer:** `surface-container-low` (#131b2e) – Subtle content grouping.
*   **High-Touch Elements:** `surface-container-highest` (#2d3449) – To draw immediate focus to interactive cards.

### The "Glass & Gradient" Rule
To evoke "Intelligence," use Glassmorphism for floating overlays (modals, dropdowns, sticky navs). 
*   **Formula:** `rgba(255, 255, 255, 0.08)` with a `20px` to `40px` backdrop-blur. 
*   **Signature Gradient:** For primary CTAs, apply a subtle linear gradient from `primary` (#bec6e0) to `primary-container` (#0f172a) at a 135-degree angle. This adds a "silk-sheen" finish that feels tactile and bespoke.

## 3. Typography
We utilize a high-contrast pairing to balance technical precision with editorial flair.

*   **Display & Headlines (Manrope/Poppins):** These are our "Editorial Voices." Use `display-lg` and `headline-lg` with tightened letter-spacing (-0.02em) to create an authoritative, "Vogue-esque" impact.
*   **Body & Labels (Inter):** This is our "Technical Voice." Inter provides the legibility required for AI data and fashion specifications. 
*   **Hierarchy Note:** Use `label-sm` in all-caps with `0.1em` letter-spacing for category tags (e.g., "COLLECTION 2024") to mimic luxury garment labels.

## 4. Elevation & Depth
Depth is created through "Tonal Layering" rather than heavy drop shadows.

*   **The Layering Principle:** Avoid shadows on static components. Instead, nest a `surface-container-lowest` card inside a `surface-container-low` section. The slight variation in darkness creates a "soft-touch" recession.
*   **Ambient Shadows:** For floating elements (like the AI Chat bubble or Image Modals), use a "Whisper Shadow": `0px 24px 48px rgba(0, 0, 0, 0.4)`. The shadow must be large, diffused, and almost imperceptible.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility on inputs, use `outline-variant` at **15% opacity**. It should appear as a faint shimmer, not a hard line.

## 5. Components

### Buttons: The "Couture" Action
*   **Primary:** A "Silk" finish. Subtle gradient, `xl` (0.75rem) corner radius. Typography: `title-sm` (Inter).
*   **Secondary:** Glassmorphism style. `rgba(255, 255, 255, 0.05)` fill with a ghost border.
*   **Tertiary:** Text-only, using the `tertiary` (#ffb3b6) color with a 1px underline that appears only on hover.

### Cards & Lists: The "No-Divider" Mandate
*   **Rule:** Forbid the use of horizontal rules (`<hr>`). 
*   **Alternative:** Use `surface-container-low` for the card body and `surface-container-high` for a hover state. Use 32px or 48px of vertical spacing to separate list items.

### AI Interaction Chips
*   **Style:** Pill-shaped (`full` roundedness).
*   **State:** Use a subtle "glow" (outer glow using `accent` color at 10% opacity) to indicate the AI is "thinking" or processing a style suggestion.

### Input Fields
*   **Style:** Minimalist underline or "ghost" box. Focus states should transition the background color slightly lighter rather than changing the border color to a bright blue.

### New Component: The "Look-Book Drawer"
A slide-out panel using 60% background blur and 40% transparency. This component should overlap the main content, allowing the "outfit" underneath to remain visible but obscured, maintaining the sense of a physical layer.

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but place imagery slightly off-center to create a modern, editorial rhythm.
*   **Use Tonal Contrast:** Ensure `on-surface` text (#dae2fd) has enough contrast against the deep navy backgrounds.
*   **Prioritize Image Quality:** This system relies on high-end fashion photography. UI elements should never compete with the garments.

### Don’t:
*   **Don't use 100% Black:** Pure black (#000000) feels "cheap" in digital luxury. Always use our "Ink" Primary (#0F172A).
*   **Don't use Sharp Corners:** Luxury is smooth. Use the `xl` (0.75rem) radius for cards and `lg` for smaller components.
*   **Don't Over-Animate:** Transitions should be slow and "weighted" (e.g., 400ms ease-out), mimicking the slow movement of heavy fabric or a camera lens focusing.