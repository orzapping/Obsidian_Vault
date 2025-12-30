# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/`. The App Router entry is `src/app`, with `layout.tsx`, `page.tsx`, and `globals.css` owning global fonts, metadata, and utility classes.
- Reusable UI belongs in `src/components`; prefer colocating component-specific helpers inside the same directory.
- Design narratives and content cues (`SESSION_WRAP*.md`, `GEMINI.md`, `CLAUDE.md`) anchor strategy decisions—update them when flows or tone shift.
- Configuration files (`next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`) control routing, theming, and compiler settings; adjust these instead of scattering project-level constants inside components.

## Build, Test, and Development Commands
- `npm install` – sync dependencies after pulling.
- `npm run dev` – start the Next.js dev server at `http://localhost:3000` with fast refresh.
- `npm run build` – produce an optimized production bundle; run before handing off deployments.
- `npm start` – serve the last production build locally.
- `npm run lint` – execute ESLint with the Next.js config; treat failures as release blockers.

## Coding Style & Naming Conventions
- Use TypeScript everywhere, lean on strict mode, and keep components typed via explicit props interfaces.
- Two-space indentation, single quotes, and trailing commas match the current codebase—let your editor format via ESLint/VS Code integration.
- Favor Tailwind classes for styling; fall back to `globals.css` only for tokens or cross-cutting utilities. Keep class lists sorted by layout → color → motion.
- Import shared modules with the `@/` alias (configured in `tsconfig.json`) to avoid brittle relative paths, and name components with PascalCase files (`RotatingHero.tsx`).

## Testing Guidelines
- There is no dedicated test suite yet; when adding one, place component tests under `src/__tests__` and name files `ComponentName.test.tsx`.
- Prefer React Testing Library plus Jest/Vitest, focusing on user-visible behavior and framer-motion interactions.
- Run `npm run lint` before every push; it currently doubles as the automated gate until a broader test harness exists.

## Commit & Pull Request Guidelines
- Follow the existing `Feature: ...` / `Fix: ...` prefix style observed in history, keeping subjects under ~70 characters and bodies in imperative voice.
- Scope commits narrowly (one feature or bug), include context about affected sections (e.g., "Hero" or "WhyOrcap"), and reference design docs when applicable.
- PRs must describe the change, link to any Gemini/Session notes, include before/after screenshots for visual surfaces, and list manual test steps (desktop + mobile + reduced-motion).
- Request at least one reviewer and ensure the branch is rebased on the latest mainline before merging.
