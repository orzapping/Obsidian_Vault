# PRISM Platform - Master Context Document

> **Purpose**: This document provides comprehensive context for AI-assisted development of the PRISM Platform. It explains the WHY behind every component, enabling intelligent decision-making during implementation.

Last Updated: December 19, 2025
---

## TABLE OF CONTENTS

1. [Project Identity & Mission](#1-project-identity--mission)
2. [Regulatory Context - The WHY](#2-regulatory-context---the-why)
3. [Architecture & Technology](#3-architecture--technology)
4. [Module Inventory & Status](#4-module-inventory--status)
5. [Critical Integration Map](#5-critical-integration-map)
6. [Database Schema Reference](#6-database-schema-reference)
7. [API Patterns & Conventions](#7-api-patterns--conventions)
8. [Code Style & Patterns](#8-code-style--patterns)
9. [Strategic Implementation Guidance](#9-strategic-implementation-guidance)
10. [Common Pitfalls & Lessons Learned](#10-common-pitfalls--lessons-learned)
11. [Session Workflow](#11-session-workflow)
12. [Agent Usage for Context Preservation](#12-agent-usage-for-context-preservation)

---

## 1. PROJECT IDENTITY & MISSION

### What is PRISM?

**PRISM** (Prudential Risk Intelligence & Strategic Management) is a comprehensive regulatory capital management platform for FCA-authorized investment firms. It automates the calculation of **Minimum Capital Requirements (MCR)** under the **MiFIDPRU** regulatory framework.

### The Core Problem We Solve

Investment firms must maintain minimum capital to protect clients and markets. Calculating this capital is complex:
- Multiple calculation methodologies (FOR, KFR, Risk Assessment, Wind-Down)
- 9 different K-factors with varying applicability
- Stress testing requirements
- The final requirement is the MAXIMUM of multiple calculations

**Without PRISM**: Firms use spreadsheets, risking errors, inconsistency, and audit failures.
**With PRISM**: Automated, auditable, real-time capital requirement calculations.

### The Ultimate Output

```
┌─────────────────────────────────────────────────────────────────┐
│                    MINIMUM CAPITAL REQUIREMENT                   │
│                                                                  │
│   MCR = max(OFR, OFTR)                                          │
│                                                                  │
│   where:                                                         │
│   • OFR = max(PMR, FOR, KFR)     ← Own Funds Requirement        │
│   • OFTR = WDA + Stress + Risk   ← Own Funds Threshold Req.     │
│                                                                  │
│   Result: The firm must hold at least £X in capital             │
│   Headroom: Own Funds - MCR = buffer for growth/shocks          │
│   Binding Constraint: Which component is driving the MCR?       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. REGULATORY CONTEXT - THE WHY

### Understanding MiFIDPRU

**MiFIDPRU** (Markets in Financial Instruments Directive - Prudential) is the FCA's prudential regime for investment firms, effective January 1, 2022. It determines how much capital a firm must hold.

### Why This Matters (Business Context)

| Stakeholder | Why They Care |
|-------------|---------------|
| **Firm Management** | Must ensure sufficient capital or face regulatory action |
| **Compliance Officers** | Must demonstrate calculations are accurate and auditable |
| **FCA Regulators** | Must verify firms can absorb losses and wind down orderly |
| **Clients** | Protected by firms having adequate financial resources |

### The Regulatory Calculation Hierarchy

```
                    MiFIDPRU CAPITAL REQUIREMENT
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
   OFR (Own Funds Requirement)          OFTR (Own Funds Threshold Req.)
   MiFIDPRU 4.3                         MiFIDPRU 7.4
        │                                           │
   ┌────┴────┬────────┐                 ┌──────────┼──────────┐
   │         │        │                 │          │          │
   ▼         ▼        ▼                 ▼          ▼          ▼
  PMR       FOR      KFR              WDA      Stress      Risk
  4.4       4.5      4.6              7.5      Testing    Add-ons
   │         │        │                │          │          │
   │         │        │                │          │          │
Permanent  Fixed   K-Factor         Wind-    Scenario   Additional
Minimum   Overhead  Requirement     Down     Impacts    Risk Capital
£75k-£750k   ÷4                    Capital
```

### Regulatory Articles Reference

| Component | MiFIDPRU Article | Description |
|-----------|------------------|-------------|
| **PMR** | 4.4 | Permanent Minimum Requirement (£75k, £150k, or £750k) |
| **FOR** | 4.5 | Fixed Overhead Requirement (25% of annual fixed costs) |
| **KFR** | 4.6-4.15 | K-Factor Requirement (activity-based capital) |
| **WDA** | 7.5 | Wind-Down Assessment (orderly closure costs) |
| **OFTR** | 7.4 | Own Funds Threshold Requirement |
| **ICARA** | 7.1-7.9 | Internal Capital Adequacy & Risk Assessment |

### K-Factor Categories (KFR Breakdown)

K-factors measure risk based on WHAT the firm does:

```
KFR = RTM + RTC + RTF

RTM (Risk-to-Market) - Trading activities
├── K-NPR: Net Position Risk (MiFIDPRU 4.8) - Trading book positions
├── K-CMG: Clearing Member Guarantee (4.9) - CCP margin requirements
└── K-TCD: Trading Counterparty Default (4.11) - Counterparty exposure

RTC (Risk-to-Client) - Client-facing activities
├── K-AUM: Assets Under Management (4.10) - Discretionary management
├── K-CMH: Client Money Held (4.11) - Segregated client funds
├── K-ASA: Assets Safeguarded/Administered (4.11) - Custody
└── K-COH: Client Orders Handled (4.10) - Order execution

RTF (Risk-to-Firm) - Firm's own risk
├── K-DTF: Daily Trading Flow (4.15) - Principal trading volume
└── K-CON: Concentration Risk (4.14) - Large exposure concentration
```

### Why K-Factor Applicability Matters

**Not all firms have all K-factors.** The applicable K-factors depend on the firm's permissions:

| Permission | Applicable K-Factors |
|------------|---------------------|
| Managing investments (discretionary) | K-AUM |
| Holding client money | K-CMH |
| Safeguarding client assets | K-ASA |
| Receiving/transmitting orders | K-COH |
| Executing orders | K-COH |
| Dealing on own account | K-NPR, K-TCD, K-DTF, K-CON |
| Clearing member status | K-CMG |

**This is why Firm Data is foundational** - it determines which K-factors apply.

---

## 3. ARCHITECTURE & TECHNOLOGY

### Technology Stack

```yaml
# Frontend
Framework:        Next.js 14.2.5 (App Router)
UI:               React 18.3.1
Language:         TypeScript 5.5.4 (strict mode)
Styling:          Tailwind CSS 3.4.7 (INLINE CLASSES ONLY - critical!)
State:            Zustand 4.5.4 (global) + React hooks (local)
Charts:           Chart.js 4.5.1, Recharts 3.1.0
Validation:       Zod 3.23.8
Icons:            lucide-react 0.525.0

# Backend
Runtime:          Node.js 20+
Database:         PostgreSQL 15
ORM:              Prisma 6.17.1
API:              Next.js API Routes (RESTful)

# Multi-Tenancy
Pattern:          organizationId-based row isolation
Every query:      MUST filter by organizationId
```

### Directory Structure

```
project-prism-sandbox/
├── prisma/
│   └── schema.prisma          # Database schema (source of truth)
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── calculators/   # Calculator CRUD APIs
│   │   │   └── core/          # Foundational data APIs
│   │   ├── modules/           # Page routes (UI entry points)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home → ModuleNavigation
│   │
│   ├── modules/               # Module source code (MAIN DEVELOPMENT AREA)
│   │   ├── admin/             # User management, SMCR
│   │   ├── calculators/       # All calculator modules
│   │   │   ├── for/           # Fixed Overhead Requirement
│   │   │   ├── kfr/           # K-Factor aggregator (COMPLEX)
│   │   │   ├── ofar/          # OFAR master calculator (KEYSTONE)
│   │   │   ├── risk-assessment/
│   │   │   ├── wind-down/
│   │   │   └── k[factor]/     # Individual K-factor calculators
│   │   ├── core/              # Foundational data modules
│   │   │   ├── firm-data/     # Regulatory profile (FOUNDATIONAL)
│   │   │   ├── financial-data/ # Capital & liquidity (FOUNDATIONAL)
│   │   │   └── stress-testing/
│   │   └── reporting/         # Regulatory reports
│   │
│   ├── components/            # Shared UI components
│   │   └── navigation/        # ModuleNavigation.tsx
│   │
│   └── lib/                   # Utilities
│       └── prisma.ts          # Prisma client singleton
│
├── docs/
│   ├── planning & guides/     # Architecture, deployment, API docs
│   ├── session-wraps/         # Development session documentation
│   └── technical/completed/   # Completed module documentation
│
└── CLAUDE.md                  # THIS FILE - master context
```

### Module Structure Pattern

Each module follows this structure:

```
src/modules/calculators/[module-name]/
├── components/
│   ├── [ModuleName]Main.tsx       # Main component
│   ├── [SubComponent].tsx         # Sub-components
│   └── modals/                    # Modal components (if needed)
├── hooks/
│   ├── use[ModuleName]Data.ts     # Data fetching hook
│   └── use[ModuleName]Calculations.ts  # Calculation logic
├── types/
│   └── index.ts                   # TypeScript interfaces
├── services/                      # Business logic (if complex)
├── validation/
│   └── schema.ts                  # Zod schemas
└── [module-name]-readme.md        # Module documentation (optional)
```

---

## 4. MODULE INVENTORY & STATUS

### Status Legend

| Status | Meaning | Navigation Display |
|--------|---------|-------------------|
| **ACTIVE** | Production-ready, fully functional | Green badge |
| **BETA** | Functional, testing in progress | Amber badge |
| **COMING SOON** | Placeholder or not started | Red badge |

### Complete Module Inventory

#### Foundational Data Modules

| Module | Status | Purpose | Integration Priority |
|--------|--------|---------|---------------------|
| **Firm Data** | ACTIVE | Regulatory profile, permissions, K-factor applicability | CRITICAL - drives PMR and K-factor determination |
| **Financial Data** | ACTIVE | Balance sheet, own funds, liquidity | CRITICAL - feeds OFAR headroom, K-CON threshold |
| **Stress Testing** | ACTIVE | Stress scenarios, impact analysis | HIGH - feeds OFAR stress components |
| **Intelligence Dashboard** | COMING SOON | Real-time MCR tracking | FUTURE - depends on OFAR completion |

#### Core Calculator Modules

| Module | Status | MiFIDPRU | Purpose | Integration Priority |
|--------|--------|----------|---------|---------------------|
| **FOR Calculator** | ACTIVE | 4.5 | Fixed overhead calculation | HIGH - feeds OFAR |
| **KFR Calculator** | ACTIVE | 4.6 | K-factor aggregation | HIGH - feeds OFAR |
| **Risk Assessment** | ACTIVE | 7.7 | Risk-based capital | MEDIUM - feeds OFAR |
| **Wind-Down Assessment** | ACTIVE | 7.5 | Wind-down capital | HIGH - feeds OFAR |
| **OFAR Calculator** | COMING SOON | 7.6 | **MASTER MCR CALCULATION** | **CRITICAL - KEYSTONE MODULE** |

#### K-Factor Calculator Modules

| K-Factor | Status | Category | Complexity | Calculation Type |
|----------|--------|----------|------------|------------------|
| **K-AUM** | UI Built | RTC | Simple | CSV upload → coefficient |
| **K-CMH** | UI Built | RTC | Simple | CSV upload → coefficient |
| **K-ASA** | UI Built | RTC | Simple | CSV upload → coefficient |
| **K-COH** | UI Built | RTC | Simple | CSV upload → coefficient |
| **K-DTF** | UI Built | RTF | Simple | CSV upload → coefficient |
| **K-NPR** | BETA | RTM | Complex | Position-by-position, modal UI |
| **K-CMG** | BETA | RTM | Complex | CCP margins, modal UI |
| **K-TCD** | BETA | RTM | Complex | SA-CCR methodology, modal UI |
| **K-CON** | BETA | RTF | Complex | Large exposure threshold, modal UI |

**Simple vs Complex K-Factors**:
- **Simple**: User uploads CSV data, system calculates value using coefficient
- **Complex**: User enters transactions via modal UI, system applies regulatory formulas

#### Admin & Reporting Modules

| Module | Status | Purpose |
|--------|--------|---------|
| **User Management** | ACTIVE | RBAC, user administration |
| **SMCR Module** | COMING SOON | Senior Managers & Certification Regime |
| **Regulatory Reporting** | ACTIVE | FCA/PRA report generation |
| **ICARA Reporting** | COMING SOON | ICARA document generation |

---

## 5. CRITICAL INTEGRATION MAP

### The Golden Rule of Integration

> **OFAR is the keystone.** Every other module exists to feed data INTO OFAR.
> When working on any module, ask: "How does this ultimately contribute to MCR?"

### Data Flow Diagram

```
══════════════════════════════════════════════════════════════════════════════
                           DATA SOURCES → OFAR
══════════════════════════════════════════════════════════════════════════════

┌─────────────────┐
│   FIRM DATA     │──────┬──► PMR (firm type → £75k/£150k/£750k)
│                 │      │
│ • Firm type     │      └──► K-Factor Applicability (which K's apply?)
│ • Permissions   │           │
│ • Currency      │           ▼
│ • FX rates      │      ┌─────────────────┐
└─────────────────┘      │  KFR CALCULATOR  │
                         │                  │
┌─────────────────┐      │  9 K-Factors:    │
│ FINANCIAL DATA  │──┬──►│  RTM: NPR+CMG+TCD│──────────────┐
│                 │  │   │  RTC: AUM+CMH+   │              │
│ • Own Funds     │  │   │       ASA+COH    │              │
│ • Liquidity     │  │   │  RTF: DTF+CON    │              │
│ • HQLA          │  │   └─────────────────┘              │
└─────────────────┘  │                                     │
        │            │   ┌─────────────────┐               │
        │            └──►│   K-CON CALC    │               │
        │                │ (25% threshold) │               │
        │                └─────────────────┘               │
        │                                                  │
        │            ┌─────────────────┐                   │
        └───────────►│  WIND-DOWN      │                   │
        │            │  ASSESSMENT     │──────────────┐    │
        │            └─────────────────┘              │    │
        │                                             │    │
        │            ┌─────────────────┐              │    │
        │            │ STRESS TESTING  │──────────────┤    │
        │            └─────────────────┘              │    │
        │                                             │    │
        │            ┌─────────────────┐              │    │
        │            │ RISK ASSESSMENT │──────────────┤    │
        │            └─────────────────┘              │    │
        │                                             │    │
        │            ┌─────────────────┐              │    │
        └───────────►│  FOR CALCULATOR │──────────────┤    │
                     └─────────────────┘              │    │
                                                      │    │
                                                      ▼    ▼
                         ┌────────────────────────────────────────┐
                         │           OFAR CALCULATOR              │
                         │         (KEYSTONE MODULE)              │
                         │                                        │
                         │  OFR = max(PMR, FOR, KFR)              │
                         │  OFTR = WDA + Stress + Risk            │
                         │  MCR = max(OFR, OFTR)                  │
                         │  Headroom = Own Funds - MCR            │
                         │  Binding = which component drives MCR? │
                         └────────────────────────────────────────┘
                                          │
                                          ▼
                         ┌────────────────────────────────────────┐
                         │       INTELLIGENCE DASHBOARD            │
                         │  • Real-time MCR tracking              │
                         │  • Trend analysis                       │
                         │  • Recommendations                      │
                         │  • Alerts                               │
                         └────────────────────────────────────────┘
```

### Integration Requirements by Module

#### Firm Data → Consumers

```typescript
// Firm Data provides to:

// 1. OFAR Calculator
interface FirmDataToOFAR {
  firmType: 'non-dealing' | 'dealing' | 'mtf-operator'  // → PMR amount
  reportingCurrency: string                              // → Currency for all calcs
  fxRateGBPToReporting: number                          // → PMR conversion
}

// 2. KFR Calculator
interface FirmDataToKFR {
  applicableKFactors: {                                  // → Which K-factors to show
    kAUM: { applicable: boolean; reason: string }
    kCMH: { applicable: boolean; reason: string }
    // ... etc
  }
  sniStatus: 'sni' | 'non_sni'                          // → SNI adjustments
}
```

#### Financial Data → Consumers

```typescript
// Financial Data provides to:

// 1. OFAR Calculator
interface FinancialDataToOFAR {
  totalOwnFunds: number      // → Headroom calculation
  // Headroom = Own Funds - MCR
}

// 2. K-CON Calculator
interface FinancialDataToKCON {
  totalOwnFunds: number      // → 25% threshold
  // Threshold = Own Funds × 25%
  // Excess = Exposure - Threshold
}

// 3. Wind-Down Assessment
interface FinancialDataToWindDown {
  hqla: number               // High Quality Liquid Assets
  undrawnFacilities: number  // Available credit lines
  // Sufficiency = Liquid Resources >= Wind-Down Requirement
}
```

#### Calculator → OFAR Mapping

| Calculator | OFAR Field | Import Method |
|------------|------------|---------------|
| FOR Calculator | `forAmount` | API: GET /api/calculators/for |
| KFR Calculator | `kfrTotal`, `kFactorValues` | API: GET /api/calculators/kfr |
| Wind-Down | `windDownRequirement` | API: GET /api/calculations/winddown |
| Stress Testing | `stressMarket`, `stressOperational`, etc. | API: (needs creation) |
| Risk Assessment | `riskConcentration`, `riskReputational`, etc. | API: (needs creation) |
| Financial Data | `ownFunds` | API: GET /api/core/financial-data |
| Firm Data | `firmType` → PMR | API: GET /api/core/firm-data |

---

## 6. DATABASE SCHEMA REFERENCE

### Core Models Overview

```
Organization (Multi-tenancy root)
├── User (RBAC)
├── AuditLog (Change tracking)
├── FirmData (Regulatory profile)
├── FinancialData (Capital & liquidity)
│   ├── FinancialDataSnapshot (Point-in-time)
│   └── CalculatorDependency (Cross-references)
├── FORCalculation (FOR)
│   └── FORHistoricalSnapshot
├── KFRCalculation (KFR)
│   └── KFactorCalculation (Individual K-factors)
├── RiskAssessment
│   ├── RiskItem
│   │   └── RiskControl
│   ├── RiskCorrelation
│   ├── RiskScenario
│   └── MonteCarloSimulation
├── OFARCalculation (Master MCR)
└── ControlsLibrary (Control templates)
```

### Key Model Relationships

```prisma
// Every model has organizationId for multi-tenancy
model KFRCalculation {
  organizationId    String

  // Links to source data
  linkedFirmDataId  String?        // Which Firm Data was used
  linkedFirmData    FirmData?

  // K-factor values stored as JSON
  rtmFactors        Json           // { kNPR: {...}, kCMG: {...}, kTCD: {...} }
  rtcFactors        Json           // { kAUM: {...}, kCMH: {...}, ... }
  rtfFactors        Json           // { kDTF: {...}, kCON: {...} }

  // Full state for form hydration
  calculatorStates  Json?          // Complete calculator configs

  // Versioning
  isCurrentVersion  Boolean
  supersededBy      String?
}

model OFARCalculation {
  organizationId    String

  // OFR Components
  pmrAmountGBP      Float          // From Firm Data (firm type)
  forAmount         Float          // From FOR Calculator
  kfrTotal          Float          // From KFR Calculator

  // OFTR Components
  windDownRequirement Float        // From Wind-Down Assessment
  stressMarket       Float         // From Stress Testing
  stressOperational  Float
  stressLiquidity    Float
  riskTotalAddons    Float         // From Risk Assessment

  // Results
  ofrValue           Float         // max(PMR, FOR, KFR)
  oftrValue          Float         // WDA + Stress + Risk
  totalRequirement   Float         // max(OFR, OFTR) = MCR
  bindingRequirement String        // 'PMR' | 'FOR' | 'KFR' | 'OFTR'

  // Data source tracking
  dataSourceTracking Json          // Which fields are auto vs manual
}
```

### Version Control Pattern

All calculation models use this versioning pattern:

```prisma
// Common versioning fields
isCurrentVersion  Boolean   @default(true)
supersededBy      String?   // ID of newer version
supersededAt      DateTime?

// When saving new version:
// 1. Find current version
// 2. Update current: isCurrentVersion = false, supersededAt = now
// 3. Create new version with isCurrentVersion = true
```

---

## 7. API PATTERNS & CONVENTIONS

### Standard API Route Structure

```typescript
// Location: src/app/api/calculators/[module]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch current/latest
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')

  // CRITICAL: Always validate organizationId
  if (!organizationId) {
    return NextResponse.json(
      { error: 'Missing required parameter: organizationId' },
      { status: 400 }
    )
  }

  // CRITICAL: Always filter by organizationId + isCurrentVersion
  const data = await prisma.[model].findFirst({
    where: {
      organizationId,
      isCurrentVersion: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(data)
}

// POST - Create new
export async function POST(request: NextRequest) {
  const body = await request.json()

  // CRITICAL: Validate organizationId in body
  if (!body.organizationId) {
    return NextResponse.json(
      { error: 'Missing required field: organizationId' },
      { status: 400 }
    )
  }

  // Version any existing record first
  await prisma.[model].updateMany({
    where: { organizationId: body.organizationId, isCurrentVersion: true },
    data: { isCurrentVersion: false, supersededAt: new Date() }
  })

  // Create new record
  const newRecord = await prisma.[model].create({
    data: {
      ...body,
      isCurrentVersion: true,
      createdAt: new Date()
    }
  })

  return NextResponse.json(newRecord, { status: 201 })
}
```

### API Endpoints Inventory

| Endpoint | Methods | Status | Purpose |
|----------|---------|--------|---------|
| `/api/core/firm-data` | GET, POST, PUT | Active | Firm data CRUD |
| `/api/core/firm-data/k-factors` | GET | Active | K-factor applicability |
| `/api/core/financial-data` | GET, POST, PUT | Active | Financial data CRUD |
| `/api/calculators/for` | GET, POST, PUT | Active | FOR calculations |
| `/api/calculators/kfr` | GET, POST, PUT | Active | KFR calculations |
| `/api/calculators/ofar` | GET, POST, PUT | Partial | OFAR (needs auto-import) |
| `/api/calculators/risk-assessment` | GET, POST, PUT | Active | Risk assessment |
| `/api/calculations/winddown` | GET, POST | Partial | Wind-down (needs full CRUD) |

---

## 8. CODE STYLE & PATTERNS

### Critical CSS Rule

> **ALWAYS USE INLINE TAILWIND CLASSES. NEVER CREATE CUSTOM CSS CLASSES.**

```tsx
// WRONG - Will break styling
<div className="modal-overlay">
<div className="modal-content">

// CORRECT - Use inline Tailwind
<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
<div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl">
```

### Component Patterns

#### Modal Pattern (for complex K-factors)

```tsx
// Modal wrapper
<div
  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
  onClick={closeModal}
>
  <div
    className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
    onClick={e => e.stopPropagation()}  // Prevent close on content click
  >
    {/* Modal content */}
  </div>
</div>
```

#### Card Pattern

```tsx
<div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl backdrop-blur-sm p-6">
  <h2 className="text-xl font-bold text-cyan-400 mb-4">Section Title</h2>
  {/* Content */}
</div>
```

#### Form Input Pattern

```tsx
<div>
  <label className="form-label">Field Label</label>
  <input
    type="text"
    className="aurora-input w-full"
    value={value}
    onChange={e => setValue(e.target.value)}
    placeholder="Placeholder text"
  />
</div>
```

#### Button Patterns

```tsx
// Primary button
<button className="aurora-button-primary">
  Save Changes
</button>

// Secondary button
<button className="aurora-button-secondary">
  Cancel
</button>

// Icon button
<button className="text-cyan-300 hover:text-cyan-200 transition-colors">
  <Settings className="w-5 h-5" />
</button>
```

### State Management Patterns

#### Real-Time Calculation (No Calculate Button)

```tsx
// Use useEffect to trigger calculation on any input change
useEffect(() => {
  if (isHydratingRef.current) return  // Skip during initial load

  const result = calculateValue(input1, input2, input3)
  setResult(result)
}, [input1, input2, input3])
```

#### Form Hydration Pattern

```tsx
// Prevent auto-save during hydration from database
const isHydratingRef = useRef(true)

useEffect(() => {
  const loadData = async () => {
    const data = await fetchData()
    setFormState(data)

    // Allow a tick for state to settle before enabling saves
    setTimeout(() => {
      isHydratingRef.current = false
    }, 100)
  }
  loadData()
}, [])

// In save logic
const handleSave = () => {
  if (isHydratingRef.current) return  // Don't save during hydration
  // ... save logic
}
```

### TypeScript Patterns

#### Interface Naming

```typescript
// Input types (what comes into the calculator)
interface PositionInput { ... }
interface NettingSetInput { ... }

// Result types (what comes out)
interface CalculationResult { ... }
interface KNPRResult { ... }

// Form data (complete form state)
interface KNPRFormData { ... }
```

#### Regulatory Constant Pattern

```typescript
// Mark regulatory constants clearly - DO NOT MODIFY
export const SUPERVISORY_FACTORS: Record<AssetClass, number> = {
  ir: 0.005,      // Interest Rate: 0.5%
  fx: 0.04,       // FX: 4.0%
  credit_ig: 0.005, // Credit IG: 0.5%
  // ... etc
} as const  // Use 'as const' to prevent modification

// Add comment explaining regulatory source
// Source: CRR Article 274, Table 2 - SA-CCR Supervisory Factors
```

---

## 9. STRATEGIC IMPLEMENTATION GUIDANCE

### Tactical Approach: "Foundation First"

When implementing any feature, follow this sequence:

1. **Ensure data source exists** - Can you get the data you need?
2. **Implement API endpoint** - Can you fetch/save the data?
3. **Build UI component** - Can the user interact with it?
4. **Add integration** - Does it connect to consumers?
5. **Test end-to-end** - Does the data flow correctly?

### Sprint Priority Framework

```
Priority 1 (Critical Path)
└── Enables OFAR auto-import

Priority 2 (High Value)
└── Improves data accuracy/efficiency

Priority 3 (Enhancement)
└── Better UX, polish

Priority 4 (Future)
└── Nice-to-have features
```

### Integration Sprint Sequence

| Sprint | Goal | Why This Order |
|--------|------|----------------|
| 1 | Financial Data integration | Provides Own Funds to K-CON, Wind-Down, OFAR |
| 2 | Firm Data integration | Provides PMR, K-factor applicability |
| 3 | Wind-Down API completion | Needs Financial Data; feeds OFAR |
| 4 | Stress Testing API | Feeds OFAR OFTR component |
| 5 | Risk Assessment integration | Feeds OFAR risk add-ons |
| 6 | **OFAR Auto-Import** | **Brings everything together** |
| 7+ | Dashboard, SMCR, Reporting | Build on complete OFAR |

### When Implementing a New Calculator

1. **Start with types** - Define all interfaces first
2. **Build calculation logic** - Pure functions, easy to test
3. **Create hooks** - Data fetching and state management
4. **Build form UI** - Follow existing patterns
5. **Add API route** - CRUD with versioning
6. **Integrate** - Connect to KFR or OFAR
7. **Document** - Update this file and create session wrap

### When Fixing Integration Issues

1. **Trace the data flow** - Where does data come from? Where does it go?
2. **Check API responses** - Is the data shape correct?
3. **Verify organizationId** - Is multi-tenancy being respected?
4. **Check isCurrentVersion** - Are we fetching the right record?
5. **Test in isolation** - Does the source work? Does the consumer work?

---

## 10. COMMON PITFALLS & LESSONS LEARNED

### Pitfall 1: Custom CSS Classes

**Symptom**: Styling doesn't work, components appear unstyled
**Cause**: Using custom class names like `modal-overlay` that don't exist
**Solution**: Always use inline Tailwind classes

### Pitfall 2: Missing organizationId

**Symptom**: Data isolation fails, or API returns empty results
**Cause**: Not passing organizationId in API calls
**Solution**: Always require and validate organizationId

### Pitfall 3: Phantom Build Errors

**Symptom**: Build shows errors but app works fine
**Cause**: Next.js cache issues, stale build artifacts
**Solution**: Trust browser console over build output; `rm -rf .next` if persistent
**Critical Learning**: "You could end up chasing a ghost and rearranging furniture for no reason"

### Pitfall 4: React Fragment Issues

**Symptom**: Syntax errors when using `<>...</>` or `<React.Fragment>`
**Cause**: Some file contexts don't handle fragments well
**Solution**: Use plain `<div>` wrappers instead

### Pitfall 5: Saving During Hydration

**Symptom**: Form immediately saves empty/default values on load
**Cause**: useEffect triggers save before database values loaded
**Solution**: Use `isHydratingRef` pattern to block saves during initial load

### Pitfall 6: Hardcoded IDs

**Symptom**: Multi-tenant data bleeds across organizations
**Cause**: Using "temp-org-id" or hardcoded values
**Solution**: Always pass real organizationId from parent components

### Pitfall 7: Version Conflicts

**Symptom**: Old data appears after saving new data
**Cause**: Not properly versioning records
**Solution**: Follow version control pattern - update old record before creating new

---

## 11. SESSION WORKFLOW

### Starting a Session

1. **Read this file** - Understand current context
2. **Check recent session wraps** - See what was done last
3. **Understand the ask** - What module/feature is being worked on?
4. **Identify dependencies** - What does this module need? What uses its output?
5. **Create todo list** - Break down the work
6. **Execute** - Follow tactical approach

### During a Session

1. **Use TodoWrite** - Track progress through the session
2. **Test frequently** - Verify changes work before moving on
3. **Commit incrementally** - Don't batch all changes to end
4. **Document decisions** - Note why certain approaches were chosen

### Ending a Session

1. **Complete current task** - Don't leave work half-done
2. **Stage and commit** - Push all changes to remote
3. **Create session wrap** - Document what was done, decisions made, issues encountered
4. **Update this file** - If significant new patterns or learnings

### Session Wrap Template

Session wraps go in: `docs/session-wraps/session-wrap-DDMMYYYY-description.md`

Key sections:
- Objectives and achievement rate
- Files created/modified
- Issues encountered and resolutions
- Decisions made and rationale
- Next steps / handoff notes

---

## QUICK REFERENCE

### File Locations

| What | Where |
|------|-------|
| Database schema | `prisma/schema.prisma` |
| API routes | `src/app/api/[module]/route.ts` |
| Module components | `src/modules/[category]/[module]/components/` |
| Navigation config | `src/components/navigation/ModuleNavigation.tsx` |
| Session wraps | `docs/session-wraps/` |
| This file | `CLAUDE.md` |

### Key Commands

```bash
# Start dev server
npm run dev

# Build (check for errors)
npm run build

# Type check only
npm run type-check

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

### Regulatory Quick Reference

| Term | Meaning |
|------|---------|
| **MCR** | Minimum Capital Requirement (final output) |
| **OFR** | Own Funds Requirement = max(PMR, FOR, KFR) |
| **OFTR** | Own Funds Threshold Requirement = WDA + Stress + Risk |
| **PMR** | Permanent Minimum Requirement (£75k/£150k/£750k) |
| **FOR** | Fixed Overhead Requirement (25% of annual costs) |
| **KFR** | K-Factor Requirement (sum of applicable K-factors) |
| **RTM** | Risk-to-Market (trading risks) |
| **RTC** | Risk-to-Client (client-facing risks) |
| **RTF** | Risk-to-Firm (firm's own risks) |
| **WDA** | Wind-Down Assessment (orderly closure capital) |
| **SNI** | Small and Non-Interconnected (simplified regime) |
| **SA-CCR** | Standardised Approach for Counterparty Credit Risk |

---

## 12. AGENT USAGE FOR CONTEXT PRESERVATION

### The Core Principle

> **Use sub-agents to preserve the main conversation's context window.**
> Agents run in their own context - heavy exploration and review work should be delegated to them.

### Why This Matters

When working on integration-heavy phases like PRISM's current state, understanding how modules connect requires reading many files. If done directly in the main conversation, this bloats the context window and leads to earlier summarization, losing important details.

**Agents solve this**: They do the heavy lifting in their own context and return concise summaries.

### When to Spawn Agents (Proactively)

| Situation | Agent to Use | Rationale |
|-----------|--------------|-----------|
| Need to understand how a module works | `Explore` | Reads files in its context, returns summary |
| After writing significant code (50+ lines) | `code-reviewer` | Catches issues without cluttering main context |
| Investigating error handling | `silent-failure-hunter` | Detailed analysis stays in agent context |
| Creating new TypeScript types | `type-design-analyzer` | Type review in separate context |
| Security-sensitive code (auth, data) | `security-auditor` | Thorough review without bloat |
| Need to trace data flow across modules | `code-explorer` | Multi-file exploration delegated |
| Planning complex features | `Plan` or `code-architect` | Design work in separate context |

### Parallel Agent Execution

When multiple independent investigations are needed, spawn agents in parallel:

```
// Good: Parallel execution for independent tasks
User: "I need to understand how Financial Data, Firm Data, and OFAR connect"

→ Spawn THREE Explore agents simultaneously:
  1. Explore Financial Data module
  2. Explore Firm Data module
  3. Explore OFAR module
→ All run in parallel, results synthesized
→ Main context only contains summaries
```

### Background Agents

For long-running explorations, use background execution:

```
// Agent runs while conversation continues
→ Spawn Explore agent with run_in_background=true
→ Continue discussing strategy with user
→ Check agent output when needed with TaskOutput
```

### Post-Implementation Review Pattern

After completing a significant piece of work, proactively run reviews:

```
// After implementing a feature:
1. Spawn code-reviewer (catches bugs, style issues)
2. Spawn silent-failure-hunter (if error handling involved)
3. Spawn type-design-analyzer (if new types created)

// Run in parallel - all review in agent contexts
// Report only significant findings to main conversation
```

### Integration Phase Specific Guidance

For PRISM's integration sprints, agent usage is particularly valuable:

```
Understanding integration points:
→ Use Explore agent to map data flows between modules
→ Keeps main context focused on implementation decisions

Before modifying shared code:
→ Use code-explorer to understand all consumers
→ Prevents breaking changes

After connecting modules:
→ Use code-reviewer to verify integration correctness
→ Catches issues before they compound
```

### User-Initiated Agent Requests

The user may also request agent usage with phrases like:
- "Explore how X works" → Spawn Explore agent
- "Review this thoroughly" → Spawn multiple review agents
- "Do these investigations in parallel" → Parallel agent execution
- "Check this in the background while we discuss Y" → Background agent

### The Golden Rule

> **When in doubt, delegate to an agent.**
> A cleaner main context with concise insights beats a bloated context with raw file contents.

---

## CONCLUSION

This document provides the comprehensive context needed to work effectively on the PRISM Platform. The key insights:

1. **OFAR is the keystone** - Everything flows toward MCR calculation
2. **Foundation first** - Firm Data and Financial Data must be solid before integration
3. **Real-time calculations** - No "Calculate" buttons, instant feedback
4. **Multi-tenancy everywhere** - organizationId is non-negotiable
5. **Tailwind inline only** - Never create custom CSS classes
6. **Document decisions** - Future sessions need to understand WHY
7. **Delegate to agents** - Preserve context by offloading exploration and review work

When in doubt about any implementation decision, ask: "How does this serve the ultimate goal of calculating accurate Minimum Capital Requirements?"

When in doubt about context management, ask: "Should this exploration be delegated to an agent?"

---

**Document Maintained By**: Development Team
**Last Updated**: December 19, 2025
**Version**: 2.0

---
