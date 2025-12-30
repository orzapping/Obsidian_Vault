# UI/UX Transformation Plan

## Experience Goals
Deliver a high-trust presence for a UK investment advisory—cinematic, editorial, and bespoke. Each fold should communicate authority through disciplined copy, immersive depth, and an unmistakably crafted aesthetic tuned for sophisticated investors.

## Typography Direction
Replace Playfair/Inter with a bold trio loaded via `next/font`: **Bricolage Grotesque** for dramatic headings, **Newsreader** for narrative copy, and **JetBrains Mono** for data blocks. Embrace extreme contrast (weights 200 vs 900, 3x size jumps) and intentional tracking to echo luxury editorial spreads.

## Color, Atmosphere, and Backgrounds
Retain the warm bone base but deepen contrast using charcoal overlays, malachite accents, and copper highlights declared as CSS variables (`--sand`, `--char`, `--copper`, `--verde`). Build an atmospheric canvas with layered radial + linear gradients, subtle grain textures, and thin luminous borders to suggest precision craftsmanship.

## Layout Evolution
- **Hero Showcase**: Full-height split manifesto with orbiting data cards, staged CTAs, and parallax b-roll imagery replacing the current rotating headline.
- **Why Orcap**: Diagonal scrollytelling timeline with structural grid background and checkpoint cards.
- **Services Carousel**: Skewed card rail featuring monochrome illustrations, key outcomes, and micro-CTAs.
- **Intelligence Suite**: Merge proof points, risk calculator, and quiz into a glassmorphic control center with toggles.
- **Footer Atelier**: Contact/compliance stack with geographic markers and scheduling CTA.

## Motion Strategy
Use a single orchestrated load timeline via Framer Motion: navigation fades, hero text rises, cards orbit, sections reveal with masked gradients. Add CSS `scroll-timeline` cues for background shifts and honor `prefers-reduced-motion` with reduced transforms.

## Implementation Roadmap
1. Update `src/app/layout.tsx` and `globals.css` with fonts, CSS variables, and atmospheric background.
2. Rebuild navigation with dual-row layout, sticky blur, and contextual links.
3. Replace `RotatingHero` with `HeroShowcase` featuring manifesto, orbiting cards, and CTAs.
4. Redesign sections (`WhyOrcapSection`, `OurServicesSection`, proof/calculator, contact) per concepts above, introducing new data structures where helpful.
5. Integrate staggered motion variants and component-level parallax, then run responsive + accessibility QA before final review.
