# Codex Website Design Plan

## Anchors
- Preserve all copy verbatim: the three rotating hero silos and CTAs, below-hero proposition, Why ORCAP rotating line + cards, Services copy, and tool narratives.
- Audience: UHNW/HNW under a UK-regulated advisory; emphasize institutional freedom, jurisdictional sovereignty, and generational liquidity.

## Visual Direction
- Theme: "Sovereign Atlas" — warm bone base with deep ink panels, copper/bronze edges, and a restrained verde accent to cue action.
- Palette: Bone (#f6f2eb), Clay (#e8e1d6), Ink (#0f1115), Bronze (#b88c5d), Verde (#0e7a5f for CTAs); optional fog gradients and hairline grid lines at low opacity.
- Typography: tall, editorial serif for headlines (keep or refine Cormorant; evaluate Newsreader if weight range fits), technical sans for body/UI (Inter/Soehne-style via Inter or Manrope with tighter tracking). Minimal uppercase tracking for labels.
- Spacing: 12-column grid up to ~1600px; section rhythm 72/96px; generous line-height for long-form copy; micro gutters for card interiors.

## Section Blueprints
- Navigation: slim floating bar with soft blur and active section indicator; single primary CTA ("Engage the Desk" / contact) plus anchors to services/tools.
- Hero: restore mandated rotating silos (10s cadence, manual controls, pause on hover/tap) with CTA mapping to calculators. Dual-pane layout: left for copy, right for atmospheric architectural visualization (arcs/topographic gradient). Prefer reduced motion defaults to first silo.
- Below-Hero Proposition: restate core value prop + triplet pillars; CTA "Schedule a Sovereignty Audit" anchored in a lightly elevated card.
- Why ORCAP: overline label; rotating mantra independent of static cards with fixed height to prevent layout shift. 3 cards + optional 4th in responsive grid; subtle accent strokes per card; background a step darker than hero.
- Services: 2x2 grid retaining copy; add micro meta row (status, jurisdictional tags), hover lift, and subtle divider lines; respect "Coming Soon" treatment for Portfolio Management.
- Interactive Tools: maintain Risk Calculator, Architecture Comparison slider, and Mobility Quiz tied to the hero CTAs. Present within an "Instruments" surface (glass/ink panel), with progress cues, summary states, and consistent modal styling; UI refinements only—no copy edits.
- Contact/Footer: luxurious but concise contact form with compliance note; footer with regulatory disclosures, office markers, and quick links.

## Motion & Interaction
- Framer Motion for staged entrances and hover; opacity/translate only, 300–500ms ease. Disable motion for `prefers-reduced-motion`.
- Light parallax on hero visualization only; no scroll-jacking.
- Focus-visible styling, high contrast on dark panels, and tactile feedback on sliders/buttons.

## Implementation Path
1. Tokens: define CSS variables in `globals.css` + Tailwind for palette, type scale, spacing, and elevation.
2. Layout scaffolding: containers, background layers (gradient + noise), and updated navigation shell.
3. Hero refactor: rebuild rotating hero with mandated copy/CTA mapping, timer controls, and new visualization.
4. Why ORCAP + Services: adhere to rotating-line spec and 2x2 grids; ensure card layouts support the optional fourth card.
5. Instruments hub: align calculator UIs to the new visual system, restore richer flows where copy requires, and standardize modal presentation.
6. Contact/Footer: align with new typography, add compliance clarity, and harmonize spacing.
7. QA: mobile/desktop pass, reduced-motion verification, lint, and manual CTA-to-tool flows.

## Risks / Watchouts
- Copy must remain untouched; design around length instead of truncating on small screens.
- Heavy gradients/noise can hurt performance; prefer CSS-based treatments over large assets.
- Maintain accessibility (contrast ratios, focus states) on both light and dark surfaces.
