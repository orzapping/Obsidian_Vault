ORCAP Website - our-servics- prompt.md


Prompt for – “Our Services” Section (ORCAP)

OKay pal, this is the brief for the “Our Services” section for the Orion Ridge Capital (ORCAP) website – a high-end, minimalist site for HNW / UHNW clients and family offices.

This section sits immediately below the “Why Orion Ridge Capital” section you’ve already built.

1. Brand & design constraints

Please keep these consistent with the rest of the site:
	•	Audience: high-net-worth individuals, family offices, sophisticated entrepreneurs.
	•	Tone: quiet luxury, precision, independence; no hype, no gimmicks.
	•	Look & feel:
	•	Minimal layout, generous whitespace.
	•	Serif headings, clean sans-serif body copy.
	•	Neutral palette (bone / off-white background, dark taupe/charcoal text, very subtle accent only).
	•	Motion:
	•	Very restrained; simple hover states and maybe a slight card elevation on hover.
	•	No parallax, no over-the-top animation.

2. Section content & structure

The section consists of:
	1.	A section label (eyebrow)
	2.	A main heading
	3.	A short intro paragraph
	4.	A 2×2 grid of service cards (4 cards total; 1 column on mobile, 2×2 on desktop)

2.1 Heading + intro (use exactly this copy)
Eyebrow (optional, but recommended):

Our Services

Main heading:

Architecture, execution, and oversight — delivered independently.

Intro paragraph (one short block):

We provide a tightly integrated set of services built for internationally minded families who expect sophistication, precision and discretion at every stage of their financial life.

2.2 Service cards (2×2 layout, best version)
Each card has: title + body.

Card 1 – Investment Advisory

Title:

Investment Advisory

Subheading (small line under the title – optional but nice if styled subtly):

Strategic advice, independent by design.

Body:

We deliver clear, evidence-based recommendations tailored to your objectives, risk appetite and life trajectory—without product shelves, sales agendas or institutional blind spots. You receive clarity, not complexity.


⸻

Card 2 – Portfolio Management (coming soon)

Title:

Portfolio Management

Subheading:

Discretion with discipline and transparency.

Body:

Our discretionary offering combines rigorous oversight, multi-institutional flexibility and full reporting—so every decision is traceable, rational, and aligned with your long-term architecture. We manage the detail; you retain the control.

Please include a small, tasteful “Coming soon” badge or label on this card (e.g. top-right corner or under the title), styled minimally so it doesn’t look like a SaaS beta tag.

⸻

Card 3 – Custodian Selection

Title:

Custodian Selection

Subheading:

The right partners across the right jurisdictions.

Body:

Global custody is fragmented, inconsistent and often misunderstood. We analyse your needs, regulatory exposure and geographical footprint, then curate the banks and custodians that best fit your long-term architecture—not someone else’s sales priorities.


⸻

Card 4 – Administrative Services

Title:

Administrative Services

Subheading:

Operational complexity handled with precision.

Body:

From onboarding, KYC and documentation to liaison with banks, partners and institutions, we manage the operational burden discreetly and efficiently. You focus on decisions; we handle the machinery.


⸻

3. Layout & behaviour
	•	The four cards should appear in a 2×2 grid on desktop, and stack vertically (1 column) on smaller screens.
	•	Each card should:
	•	sit within a soft, rounded rectangle,
	•	have subtle border / shadow (very light),
	•	have generous padding and vertical rhythm,
	•	optionally have a slight elevation / shadow increase on hover (desktop only).
	•	Typography scale should roughly mirror the “Why ORCAP” card section for visual continuity.

4. React component structure

Please implement as a reusable React component (Next.js / React 18 compatible).

Suggested component:

// components/OurServicesSection.tsx

type ServiceCard = {
  title: string;
  tagline: string;
  body: string;
  badge?: string;
};

const SERVICES: ServiceCard[] = [
  {
    title: "Investment Advisory",
    tagline: "Strategic advice, independent by design.",
    body: "We deliver clear, evidence-based recommendations tailored to your objectives, risk appetite and life trajectory—without product shelves, sales agendas or institutional blind spots. You receive clarity, not complexity.",
  },
  {
    title: "Portfolio Management",
    tagline: "Discretion with discipline and transparency.",
    body: "Our discretionary offering combines rigorous oversight, multi-institutional flexibility and full reporting—so every decision is traceable, rational, and aligned with your long-term architecture. We manage the detail; you retain the control.",
    badge: "Coming soon",
  },
  {
    title: "Custodian Selection",
    tagline: "The right partners across the right jurisdictions.",
    body: "Global custody is fragmented, inconsistent and often misunderstood. We analyse your needs, regulatory exposure and geographical footprint, then curate the banks and custodians that best fit your long-term architecture—not someone else’s sales priorities.",
  },
  {
    title: "Administrative Services",
    tagline: "Operational complexity handled with precision.",
    body: "From onboarding, KYC and documentation to liaison with banks, partners and institutions, we manage the operational burden discreetly and efficiently. You focus on decisions; we handle the machinery.",
  },
];

export function OurServicesSection() {
  return (
    <section className="services" aria-labelledby="services-heading">
      <div className="services__inner">
        <header className="services__header">
          <p className="services__eyebrow">Our Services</p>
          <h2 className="services__title" id="services-heading">
            Architecture, execution, and oversight — delivered independently.
          </h2>
          <p className="services__intro">
            We provide a tightly integrated set of services built for internationally minded families who expect sophistication, precision and discretion at every stage of their financial life.
          </p>
        </header>

        <div className="services__grid">
          {SERVICES.map((service) => (
            <article className="services__card" key={service.title}>
              <header className="services__card-header">
                <div>
                  <h3 className="services__card-title">{service.title}</h3>
                  <p className="services__card-tagline">{service.tagline}</p>
                </div>
                {service.badge && (
                  <span className="services__card-badge">{service.badge}</span>
                )}
              </header>
              <p className="services__card-body">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

You may adjust the exact structure, but please keep:
	•	a clear SERVICES config array,
	•	BEM-style class names following the pattern above,
	•	semantic HTML (section, header, article, etc.).

5. CSS / class naming conventions

Use BEM-like naming as above:
	•	.services
	•	.services__inner
	•	.services__header
	•	.services__eyebrow
	•	.services__title
	•	.services__intro
	•	.services__grid
	•	.services__card
	•	.services__card-header
	•	.services__card-title
	•	.services__card-tagline
	•	.services__card-body
	•	.services__card-badge

Example base CSS (you can refine values to match the existing design system):

.services {
  padding: 6rem 1.5rem;
  background-color: #fdfbf7; /* slight variation from previous section if needed */
}

.services__inner {
  max-width: 1120px;
  margin: 0 auto;
}

.services__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.services__eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  color: rgba(0, 0, 0, 0.55);
}

.services__title {
  font-size: 1.9rem;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 1rem;
}

.services__intro {
  max-width: 640px;
  margin: 0.5rem auto 0;
  font-size: 0.98rem;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.72);
}

.services__grid {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 800px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)); /* 2×2 layout */
  }
}

.services__card {
  background: #fbfaf6;
  border-radius: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 2.4rem 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  transition: box-shadow 200ms ease-out, transform 200ms ease-out;
}

.services__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
}

.services__card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.services__card-title {
  font-size: 1.25rem;
  line-height: 1.3;
  margin-bottom: 0.3rem;
}

.services__card-tagline {
  font-size: 0.9rem;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.65);
}

.services__card-body {
  font-size: 0.96rem;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.78);
}

.services__card-badge {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.65);
}

Please generate the final React component and CSS/Tailwind equivalent based on this specification, ready to drop into the existing ORCAP codebase.

⸻

