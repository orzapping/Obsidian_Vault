# GEMINI Design Vision: "The Architect's Interface"

> **Core Concept:** Wealth management is not just a service; it is the architecture of legacy. The UI should feel like a precision instrument designed for the architects of capital. It balances the timeless authority of a private bank with the algorithmic precision of a modern family office.

## 1. Visual Identity: "Algorithmic Luxury"

We are moving away from generic "corporate clean" and "standard luxury" into a realm of **Intellectual Elegance**.

### Color Palette: "Midnight & Alabaster"
The site will primarily operate in a sophisticated **Dark Mode** by default (referencing premium trading terminals and private member clubs), with the option to breathe in light.

- **Void (Background):** `#0a0a0a` (Pure, deep black) or `#0f1115` (Gunmetal)
- **Alabaster (Text):** `#EDEDED` (Soft white, never harsh pure white)
- **Tungsten (Secondary Text):** `#888888`
- **Gilded Signal (Accent):** `#D4AF37` (Metallic Gold - subtle, for data points only) or `#A5B4FC` (Indigo - for tech/modernity) -> *Decision: Muted Bronze/Gold for authority.*

### Typography: "History meets Future"
- **Headings (The History):** `Cormorant Garamond` (Google Font). High-contrast, editorial, italicized for emphasis. Used for the "Why" and "Philosophy."
- **Body/UI (The Future):** `Manrope` or `DM Sans`. Geometric, highly legible, precision-engineered. Used for data, navigation, and "How."

### Texture & Atmosphere
- **Noise/Grain:** Subtle film grain overlay to remove digital coldness.
- **Glassmorphism:** Used for "tools" (calculators, quiz) to make them feel like floating instruments.
- **Grid Lines:** Very subtle, 5% opacity grid lines in the background, suggesting architectural blueprints.

## 2. User Experience (UX) Principles

1.  **Vertical Stability:** No diagonal scrolling or disorientation. The site feels weighted and grounded.
2.  **Cinematic Reveal:** Elements do not just "appear"; they unmask. Text reveals line-by-line. Images fade in with a slow zoom.
3.  **Intellectual Depth:** We assume the user is smart. Content is concise but dense with meaning.
4.  **"The Concierge" Navigation:** Navigation is not a sticky bar cluttering the top. It is a floating, intelligent dock or a "menu" button that opens a full-screen command center.

## 3. Component Architecture

### A. The `OrbitalHero`
Instead of a rotating carousel (which is low-conversion), we implement a **Manifesto Interface**.
- **Visual:** A slow-moving, abstract 3D form or fluid gradient representing "Risk vs. Opportunity."
- **Content:** "Wealth Architecture for the Sovereign Family."
- **Interaction:** Mouse movement subtly affects the lighting of the background.

### B. The `BlueprintGrid` (Services)
- A layout that mimics an architectural plan.
- Services are not "cards" but "sectors" on a blueprint.
- Hovering over a sector expands it to reveal details (Investment, Custody, Admin).

### C. The `InstrumentPanel` (Tools)
- The "Wealth Mobility Quiz" and "Risk Calculator" should not look like web forms.
- They should look like **control panels**.
- Sliders, toggles, and data visualizations update in real-time.
- **Glassmorphic** containers against the dark background.

### D. The `NarrativeStream` (Why Orcap)
- A vertical flow of the "Four Narratives."
- As you scroll, the background subtly shifts color to match the mood of the narrative (e.g., darker for "Risk," lighter for "Opportunity").

## 4. Tech Stack & Implementation
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (for utility) + Custom CSS Variables (for themes).
- **Animation:** Framer Motion (orchestration).
- **Fonts:** `next/font/google` (Cormorant Garamond, Manrope).
- **Icons:** Lucide React (thin stroke, elegant).

## 5. Development Plan (Gemini Branch)
1.  **Foundation:** Set up `layout.tsx` with the new fonts, dark theme variables, and noise overlay.
2.  **Navigation:** Build the `ConciergeNav` (floating).
3.  **Hero:** Implement `OrbitalHero` with Framer Motion.
4.  **Sections:** Build `BlueprintGrid` and `NarrativeStream`.
5.  **Tools:** Refactor the existing calculator logic into the new `InstrumentPanel` design.
6.  **Polish:** Add the "cinematic" reveals.

---

*Status: Design Phase Complete. Awaiting Approval to Commence Code Construction.*
