# PRISM - Quick Context

> **Read Time**: 2 minutes
> **Purpose**: Rapid orientation for any PRISM development session

**Last Updated**: December 29, 2025

---

## What Is PRISM?

**PRISM** = Prudential Risk Intelligence & Strategic Management

A regulatory capital management platform that automates the **ICARA/MiFIDPRU process** for UK investment firms.

**In one sentence**: PRISM reduces the ICARA process from months to days while dramatically improving data quality.

---

## The Commercial Reality

| Fact | Detail |
|------|--------|
| **Target Market** | 10,000+ UK firms (MiFID-regulated + consultants + lawyers) |
| **Target Persona** | CFO's Office (NOT Compliance) |
| **Pain Point** | Entirely manual process, months of document chaos |
| **Competitors** | None known (as of mid-2025) |
| **Owner** | Quantum Liquidity Systems Ltd (100% founder-owned) |

**Strategic Insight**: The ICARA tool is the "trojan horse" - the real value is the proprietary data platform built on accumulated firm data.

---

## V1 Goal

**Ship a complete ICARA solution**:
- All regulatory calculators working and integrated
- Linear + Reverse stress testing
- ICARA document generation with PDF export
- Living operational system (not just annual compliance)

**Definition of Done**: A CFO can complete the full ICARA process start-to-finish and generate a comprehensive, correct, high-quality ICARA report.

---

## Technical Stack

```
Frontend:  Next.js 14 + React 18 + TypeScript + Tailwind CSS
Backend:   Next.js API Routes + Prisma 6.17
Database:  PostgreSQL 15
State:     Zustand (global) + React hooks (local)
```

**Critical Pattern**: Multi-tenancy via `organizationId` on every query.

---

## Key Modules (Status)

| Module | Status | Purpose |
|--------|--------|---------|
| Firm Data | ACTIVE | Regulatory profile, K-factor applicability |
| Financial Data | ACTIVE | Own funds, liquidity |
| FOR Calculator | ACTIVE | Fixed Overhead Requirement |
| KFR Calculator | ACTIVE | K-Factor Requirement (9 K-factors) |
| Risk Assessment | ACTIVE | Risk-based capital |
| Wind-Down | ACTIVE | Wind-down capital |
| OFAR Calculator | COMING SOON | **MASTER** - aggregates everything → MCR |
| Stress Testing | ACTIVE | Linear stress (reverse stress TODO) |

**Critical Path**: OFAR is the apex. Everything flows to OFAR. OFAR produces the MCR.

---

## Key Formulas

```
OFR  = max(PMR, FOR, KFR)          ← Own Funds Requirement
OFTR = WDA + Stress + Risk Add-ons  ← Own Funds Threshold Requirement
MCR  = max(OFR, OFTR)               ← Minimum Capital Requirement
Headroom = Own Funds - MCR          ← Capital buffer
```

---

## Critical Gotchas

1. **ALWAYS inline Tailwind** - Never create custom CSS classes
2. **ALWAYS filter by organizationId** - Multi-tenancy is non-negotiable
3. **ALWAYS check isCurrentVersion** - Versioning pattern on all calculations
4. **Use isHydratingRef** - Prevent auto-save during form hydration
5. **Trust browser console** - Next.js build errors can be phantom

---

## Key Paths

| Asset | Path |
|-------|------|
| Codebase | `/home/obsidan/Development/PRISM-SANDBOX/project-prism-sandbox/` |
| CLAUDE.md | `/home/obsidan/Development/PRISM-SANDBOX/project-prism-sandbox/CLAUDE.md` |
| Strategic Docs | `/home/obsidan/Documents/Obsidian Vault/02-Projects/PRISM/STRATEGIC/` |
| Commercial Context | `STRATEGIC/COMMERCIAL-CONTEXT.md` |
| V1 Spec | `STRATEGIC/V1-SHIP-SPECIFICATION.md` |

---

## Before You Start Coding

1. **Read the project CLAUDE.md** - comprehensive technical context
2. **Check CURRENT-STATE.md** - what's in progress
3. **Review KEY-DECISIONS.md** - what's been decided
4. **Note TECHNICAL-GOTCHAS.md** - what to avoid

---

## The User

- Solo founder, deep domain expertise (20+ years financial services)
- Relies on AI for development (cannot write code independently)
- Night owl, prefers evening/late-night work
- Values elegant solutions, proper English, clear communication
- Cannot afford to be misled - no technical team to course-correct

---

**Now you're oriented. Get to work.**
