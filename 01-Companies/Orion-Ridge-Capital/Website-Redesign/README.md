# Orion Ridge Capital - Website Redesign

Modern, sophisticated website for ORCAP built with Next.js 15, TypeScript, and Tailwind CSS.

## Design Philosophy

- **Ruthless minimalism** with lavish spacing
- **Warm, muted color palette** (no cold white backgrounds)
- **Modern luxury aesthetic** inspired by high-end brands
- **Cinematic, restrained motion** using Framer Motion & GSAP
- **Typography**: Playfair Display (serif) + Inter (sans)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion + GSAP
- **Fonts**: Google Fonts (next/font optimization)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Color Palette

- **Bone** (Background): `#F6F4EE` - Warm off-white
- **Warm Beige**: `#EAE6DC` - Secondary background
- **Warm Black**: `#1A1612` - Primary text
- **Warm Gray**: `#5C554A` - Secondary text
- **Malachite** (Accent): `#0E7A5F` - Deep green for CTAs and highlights

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout with fonts
│   ├── page.tsx      # Homepage
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── ProofPoints.tsx
│   ├── Services.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
└── lib/              # Utilities (future)
```

## Development Notes

- All animations respect `prefers-reduced-motion`
- Mobile-first responsive design
- Optimized for Core Web Vitals
- SEO-friendly with proper metadata

## License

© 2025 Orion Ridge Capital Limited. All rights reserved.
