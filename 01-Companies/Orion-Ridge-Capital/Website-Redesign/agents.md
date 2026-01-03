# Agents Guide (Codex Branch)

## Working Area
- Repository root `/srv/prism-shared`; active project at `DEVELOPMENT/orcap-website_redesign/orcap_website`.
- Do not touch `GOLDEN-SOURCE`, `ARCHIVE`, or other sibling directories.

## Branching
- Active branch: `codex-website-version`. Do not commit to `gemini-branch` or `main`.

## Content Guardrails
- Do not change any marketing copy. Hero rotating silos + CTAs stay verbatim.
- Preserve ordering and wording for Why ORCAP cards and Services copy.
- Keep CTA routing: Risk Calculator, Architecture Comparison, Wealth Mobility Quiz.

## Tech Stack
- Next.js 15 (App Router), TypeScript, Tailwind, Framer Motion.
- Fonts currently via `next/font` (Cormorant Garamond + Manrope). If changed, document in the plan.

## Dev Commands (run inside `orcap_website`)
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Quality
- Respect `prefers-reduced-motion`; prioritize mobile and desktop parity.
- Use Tailwind for styling; keep animations lightweight and purposeful.
- Run lint before any PR; capture before/after screenshots for visual surfaces.

## Documentation
- Update `codex-website-design-plan.md` when design decisions shift.
- Log major UI choices or deviations from Claude/Gemini in `gemini.md` or `codex.md`.
