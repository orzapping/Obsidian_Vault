# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Orion Ridge Capital (ORCAP) website redesign - a modern, luxury wealth advisory website built with Next.js 15. The project emphasizes ruthless minimalism, lavish spacing, and cinematic motion design.

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Design System & Brand Guidelines

### Color Palette (Critical - Never Deviate)
The warm, muted palette is core to the brand identity:
- **bone** (`#F6F4EE`) - Primary background (warm off-white, NEVER pure white)
- **warm-beige** (`#EAE6DC`) - Secondary background
- **warm-black** (`#1A1612`) - Primary text (NEVER pure black)
- **warm-gray** (`#5C554A`) - Secondary text
- **malachite** (`#0E7A5F`) - Primary accent (deep green for CTAs)

All colors are configured in `tailwind.config.ts`. Use these semantic names, not hex values.

### Typography System
- **Serif (Playfair Display)**: Used for all headings (`h1`-`h6`) and display text
- **Sans (Inter)**: Used for body text, paragraphs, and UI elements
- Fonts are loaded via runtime Google Fonts in `src/app/layout.tsx` (NOT using next/font)
- Custom font sizes defined: `display`, `h1`, `h2`, `body-lg`, `body`, `small`

### Spacing Philosophy
"Ruthless minimalism with lavish spacing" - generous padding/margins are intentional:
- Custom spacing scale in Tailwind: `18`, `22`, `26`, `30`, `34` (rem units)
- Use `max-w-content` (1200px) for main content containers
- Use `max-w-narrow` (800px) for text-heavy sections

## Architecture

### Component Structure
Single-page application composed of section components:
```
src/app/page.tsx          # Composition of all sections
src/components/
  ├── Navigation.tsx      # Fixed nav with scroll detection
  ├── Hero.tsx           # Above-fold section
  ├── ProofPoints.tsx    # Trust indicators
  ├── Services.tsx       # Service offerings grid
  ├── Contact.tsx        # Contact form
  └── Footer.tsx         # Site footer
```

All components are **server components by default** unless they require:
- Client-side interactivity (hooks, event handlers)
- Animation libraries (Framer Motion, GSAP)
- Browser APIs

When client-side features are needed, use `'use client'` directive.

### Animation Approach
Dual animation library strategy:
- **Framer Motion**: Interactive animations, hover effects, scroll-triggered animations
- **GSAP**: Complex timeline-based animations, advanced easing

**Accessibility**: All animations MUST respect `prefers-reduced-motion`. Check this before implementing motion.

### Styling Conventions
- **Tailwind CSS** for all styling - no CSS modules or styled-components
- Mobile-first responsive design (breakpoints: `sm`, `md`, `lg`, `xl`)
- Custom utility classes in `globals.css`:
  - `.animate-on-scroll` - Base class for scroll animations
  - `.text-balance` - Improved text wrapping

### Font Loading Strategy
Fonts are loaded using **next/font** for optimal performance and zero FOUC:
- Playfair Display (serif): weights 400-900
- Inter (sans): weights 400-700
- Fonts are configured in `layout.tsx` with CSS variables (`--font-playfair`, `--font-inter`)
- Tailwind config references these variables: `font-serif` → `var(--font-playfair)`, `font-sans` → `var(--font-inter)`
- Display strategy: `swap` to prevent blocking render

## Key Technical Decisions

### Next.js 15 App Router
- Using App Router (not Pages Router)
- Server components by default for better performance
- Metadata exports for SEO in `layout.tsx`

### State Management
Currently no global state management - components are self-contained. If complex state is needed in future, consider React Context or Zustand.

### Image Optimization
`next.config.ts` allows remote images from `orionridgecapital.co.uk`. Use Next.js `<Image>` component for all images with proper width/height.

### Dependencies
- **next**: ^15.0.0 (App Router features)
- **react**: ^19.0.0 (Latest features)
- **framer-motion**: ^11.0.0 (Animation library)
- **gsap**: ^3.12.0 (Advanced animations)
- **tailwindcss**: ^3.4.0 (Utility-first CSS)

## Code Style Guidelines

### Component Patterns
1. **Client Components**: Mark with `'use client'` at top, use hooks freely
2. **Server Components**: Default, async-friendly, no hooks
3. **Props**: Use TypeScript interfaces, destructure in function signature
4. **Exports**: Use default exports for page/component files

### Naming Conventions
- Components: PascalCase (`Navigation.tsx`)
- Utilities/hooks: camelCase (`useScrollAnimation.ts`)
- CSS classes: kebab-case via Tailwind utilities

### Import Aliases
- `@/components/*` - Components directory
- `@/app/*` - App directory
- `@/lib/*` - Utility functions (when created)

## Performance Considerations

- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Mobile-first**: Design and test mobile experience first
- **Lazy loading**: Consider for heavy components/images
- **Animation performance**: Use `transform` and `opacity` for GPU acceleration

## SEO & Metadata

Metadata defined in `src/app/layout.tsx`:
- Title: "Orion Ridge Capital - Wealth Advisory for the Next Generation"
- Description: Concise value proposition
- Keywords: Wealth management focused

Update metadata when adding new pages.

## Common Pitfalls to Avoid

1. **Don't use pure white/black**: Always use warm-white (bone) and warm-black
2. **Don't skip prefers-reduced-motion**: Required for accessibility
3. **Don't modify font loading**: next/font is properly configured with CSS variables
4. **Don't create tight layouts**: Generous spacing is brand-critical
5. **Don't mix serif/sans incorrectly**: Headings = serif, body = sans
6. **Don't forget bg-bone on html/body**: Both need the background color to prevent white flashing

## Future Considerations

- `/about`, `/services`, `/insights` routes (mentioned in Navigation but not implemented)
- Backend integration for contact form
- CMS integration for content management
- Analytics implementation
