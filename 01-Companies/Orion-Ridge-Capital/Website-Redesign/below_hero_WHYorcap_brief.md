
Prompt for ClaudeCode

You are implementing a specific section of the Orion Ridge Capital website (ORCAP) – a high-end, minimalist site aimed at HNW investors, family offices and sophisticated entrepreneurs.

1. Brand & design context (important)

Please respect these constraints:
	•	Audience: HNW / UHNW, family offices, sophisticated investors. No gimmicks.
	•	Look & feel:
	•	Minimal, spacious layout, quiet luxury.
	•	Serif for headings, clean sans-serif for body copy.
	•	Neutral palette (off-white / bone background, dark taupe/charcoal text, very subtle accent only).
	•	Motion:
	•	Very restrained.
	•	Simple opacity fades, 300–400ms, ease-out.
	•	No sliding, bouncing, typing, or scroll-jacking.
	•	Typography:
	•	Use the site’s existing heading serif (e.g. Canela / Noe Display / similar) and body sans (e.g. Inter / Neue Haas Grotesk).
	•	Do NOT introduce calligraphy / handwriting / decorative script.
	•	The rotating lines should look like part of the core heading hierarchy, not like a separate “brand font”.

2. Section purpose

This section sits on the homepage under the hero and under the label:

WHY ORION RIDGE CAPITAL

It has two layers:
	1.	A rotating sub-heading: four philosophical statements that fade/rotate every ~10 seconds.
	2.	Three (optionally four) static cards underneath, explaining the advantages in concrete form.

The rotating copy is brand “philosophy”; the cards are the evidence.

Important:
The rotating subtitle must NOT be synchronised with individual cards. Cards remain static; the subtitle rotates independently like a calm brand mantra.

3. Content to implement

3.1 Static top label
Small all-caps label above the rotating line:

WHY ORION RIDGE CAPITAL

Style as a subtle overline (letterspacing slightly increased, smaller size than the rotating line).

3.2 Rotating sub-heading lines (in this exact order)
These four lines should rotate in order, every 10,000ms:
	1.	The Quiet Advantages That Actually Matter
	2.	Built for the Sophisticated, Not the Mass Market
	3.	The Architecture Behind the Advice
	4.	Designed Around Your Capital — Not Ours

Behaviour:
	•	Only one line visible at any time.
	•	Soft fade-out/fade-in using opacity; 300–400ms ease-out.
	•	Keep layout stable (no height jumps). Use a fixed container height if helpful.
	•	Respect prefers-reduced-motion: reduce (in that case, show the first line only and disable rotation).

Typography:
	•	Same font family as other major headings.
	•	Similar size/weight to an H2/H3, but you can slightly tweak:
	•	slightly increased line-height,
	•	slightly tighter tracking,
	•	weight not too heavy (avoid looking shouty).

3.3 Cards: “Why Orion Ridge Capital” advantages
Below the rotating line, render three cards in a responsive grid (1 column on mobile, 3 columns on desktop). Optional fourth card is included as well – please implement the layout so a 4th card can be added with no design break.

Card 1 – Experience as institutional intelligence

Title:

150+ Years of Collective Intelligence

Body:

Not just experience—institutional intelligence from Citi, Merrill Lynch, Bank of America and other global platforms. We’ve lived inside the machinery of major institutions and understand where the blind spots sit. That insight now works for you, not for them.


⸻

Card 2 – Independence as structural integrity

Title:

Independence That Cannot Be Bought

Body:

No parent bank. No product shelf. No performance targets dressed up as ‘advice’. Our incentives are structurally aligned with your outcomes—which is why families who value sovereignty choose us. We answer only to your balance sheet, not an institution’s.


⸻

Card 3 – Global perspective as multi-jurisdictional advantage

Title:

A Global Lens — Without the Global-Bank Baggage

Body:

From EMEA to MEA to Asia, our experience spans markets where rules, risk and opportunity shift fast. We design wealth architectures that survive mobility, regulatory drift and cross-border complexity—the realities of modern international families. Wherever life takes you, your wealth moves with you.


⸻

Optional Card 4 – Discretion

Please build the layout so this fourth card can be easily toggled on/off. For now, include it in the code but it could be removed later.

Title:

Discretion First, Always

Body:

For principals, founders and families, the line between privacy and exposure is razor-thin. We operate with the discretion of a private office, the discipline of a regulated firm, and the confidentiality of a long-standing advisor.

4. React component structure

Please implement this section as a reusable React component (for a Next.js / React 18 codebase).

Suggested structure:

// components/WhyOrcapSection.tsx

import { useEffect, useState } from "react";

const ROTATING_LINES = [
  "The Quiet Advantages That Actually Matter",
  "Built for the Sophisticated, Not the Mass Market",
  "The Architecture Behind the Advice",
  "Designed Around Your Capital — Not Ours",
];

const CARDS = [
  {
    title: "150+ Years of Collective Intelligence",
    body: "Not just experience—institutional intelligence from Citi, Merrill Lynch, Bank of America and other global platforms. We’ve lived inside the machinery of major institutions and understand where the blind spots sit. That insight now works for you, not for them.",
  },
  {
    title: "Independence That Cannot Be Bought",
    body: "No parent bank. No product shelf. No performance targets dressed up as ‘advice’. Our incentives are structurally aligned with your outcomes—which is why families who value sovereignty choose us. We answer only to your balance sheet, not an institution’s.",
  },
  {
    title: "A Global Lens — Without the Global-Bank Baggage",
    body: "From EMEA to MEA to Asia, our experience spans markets where rules, risk and opportunity shift fast. We design wealth architectures that survive mobility, regulatory drift and cross-border complexity—the realities of modern international families. Wherever life takes you, your wealth moves with you.",
  },
  {
    title: "Discretion First, Always",
    body: "For principals, founders and families, the line between privacy and exposure is razor-thin. We operate with the discretion of a private office, the discipline of a regulated firm, and the confidentiality of a long-standing advisor.",
  },
];

export function WhyOrcapSection() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setReducedMotion(true);

    if (reducedMotion) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_LINES.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [reducedMotion]);

  const subtitle = ROTATING_LINES[index];

  return (
    <section className="why-orcap" aria-labelledby="why-orcap-heading">
      <div className="why-orcap__inner">
        <header className="why-orcap__header">
          <p className="why-orcap__eyebrow" id="why-orcap-heading">
            WHY ORION RIDGE CAPITAL
          </p>
          <div className="why-orcap__subtitle-wrapper" aria-live="polite">
            <span key={subtitle} className="why-orcap__subtitle">
              {subtitle}
            </span>
          </div>
        </header>

        <div className="why-orcap__cards">
          {CARDS.map((card) => (
            <article className="why-orcap__card" key={card.title}>
              <h3 className="why-orcap__card-title">{card.title}</h3>
              <p className="why-orcap__card-body">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

Notes:
	•	The key={subtitle} on the rotating span is intentional: it lets the fade animation trigger on text change when combined with CSS transitions.
	•	aria-live="polite" ensures screen readers pick up the changing line without being obnoxious.
	•	If you prefer Tailwind, you can translate the classNames accordingly; keep the BEM semantics as a guide.

5. CSS / naming conventions

Please implement styles using BEM-like naming as above.

Core classes:
	•	.why-orcap
	•	.why-orcap__inner
	•	.why-orcap__header
	•	.why-orcap__eyebrow
	•	.why-orcap__subtitle-wrapper
	•	.why-orcap__subtitle
	•	.why-orcap__cards
	•	.why-orcap__card
	•	.why-orcap__card-title
	•	.why-orcap__card-body

Example base CSS (feel free to refine values, but keep the behaviour):

.why-orcap {
  padding: 6rem 1.5rem;
  background-color: #f6f4ee; /* bone */
}

.why-orcap__inner {
  max-width: 1120px;
  margin: 0 auto;
}

.why-orcap__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.why-orcap__eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  color: rgba(0, 0, 0, 0.55);
}

.why-orcap__subtitle-wrapper {
  position: relative;
  min-height: 2.8em; /* keep layout stable as lines rotate */
  overflow: hidden;
}

.why-orcap__subtitle {
  display: inline-block;
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 400;
  opacity: 0;
  transform: translateY(0); /* no slide, just fade */
  transition: opacity 350ms ease-out;
}

/* simple mount animation, using the key trick */
.why-orcap__subtitle {
  opacity: 1;
}

.why-orcap__cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 900px) {
  .why-orcap__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.why-orcap__card {
  background: #fbfaf6;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  padding: 2.4rem 2.2rem;
}

.why-orcap__card-title {
  font-size: 1.35rem;
  line-height: 1.3;
  margin-bottom: 0.9rem;
}

.why-orcap__card-body {
  font-size: 0.98rem;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.75);
}

/* reduced motion: remove animation, no rotation */
@media (prefers-reduced-motion: reduce) {
  .why-orcap__subtitle {
    transition: none;
  }
}

You can adjust exact font sizes, colours and spacing to match the existing design system, but keep the behaviours exactly as described:
	•	Rotating subtitle, 10s interval, soft fades, no gimmicks.
	•	Static cards below.
	•	Fully responsive; mobile-first.

⸻

Please generate the final React component and CSS (or Tailwind/Styled-Components equivalent) based on the above, ready to drop into a Next.js project.

⸻

