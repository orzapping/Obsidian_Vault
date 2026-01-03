# PRISM Platform - Comprehensive Project Status Report
## Strategic Planning Document for Integration Phase

**Report Date**: December 19, 2025
**Document Version**: 1.0
**Classification**: Internal Development Planning
**Purpose**: Enable strategic planning for final integration phase and sprint allocation

---

## EXECUTIVE SUMMARY

### Project Overview
The PRISM Platform (ICARA/MiFIDPRU Risk Intelligence Platform) is a comprehensive regulatory capital management system designed for FCA-authorized investment firms. The platform calculates Minimum Capital Requirements (MCR) according to MiFIDPRU regulations, encompassing Fixed Overhead Requirements (FOR), K-Factor Requirements (KFR), Risk Assessment, Wind-Down Analysis, and Overall Financial Adequacy Rule (OFAR) calculations.

### Current State at a Glance

| Metric | Value | Notes |
|--------|-------|-------|
| **Total Modules** | 20 | Across all categories |
| **Active/Functional** | 9 (45%) | Production-ready |
| **Beta** | 2 (10%) | Functional with testing in progress |
| **Coming Soon** | 9 (45%) | Awaiting implementation/integration |
| **Total Lines of Code** | ~12,880 | In /src/modules directory |
| **TypeScript Files** | 140 | In /src/modules directory |
| **Database Models** | 18 | In Prisma schema |
| **API Endpoints** | 15+ | RESTful routes |

### Critical Path
The OFAR Calculator is the **apex module** - it aggregates outputs from ALL other calculators to produce the firm's final Minimum Capital Requirement. All integration work must flow toward enabling OFAR to auto-import data from:
- FOR Calculator (Fixed Overhead Requirement)
- KFR Calculator (K-Factor Requirement - aggregates all 9 K-factors)
- Risk Assessment Calculator (Risk-based capital)
- Wind-Down  
- Firm Data (Regulatory profile, PMR determination)

---

## TECHNOLOGY STACK

### Frontend
```yaml
Framework:        Next.js 14.2.5 (App Router)
UI Library:       React 18.3.1
Language:         TypeScript 5.5.4
Styling:          Tailwind CSS 3.4.7
State Management: Zustand 4.5.4 (global) + React hooks (local)
Charts:           Chart.js 4.5.1 + react-chartjs-2 5.3.0 + Recharts 3.1.0
PDF Generation:   jsPDF 3.0.3
Validation:       Zod 3.23.8
Utilities:        clsx 2.1.1, tailwind-merge 2.6.0
Icons:            lucide-react 0.525.0
Gantt Charts:     gantt-task-react 0.3.9
```

### Backend & Database
```yaml
Runtime:          Node.js 20+
Database:         PostgreSQL 15
ORM:              Prisma 6.17.1
API Style:        Next.js API Routes (RESTful)
Authentication:   Planned (Auth0/Clerk) - NOT IMPLEMENTED
Multi-tenancy:    organizationId-based row isolation
```

### Development & Testing
```yaml
Build Tool:       Next.js built-in (Webpack)
Linting:          ESLint 8.57.0 + TypeScript ESLint
Testing:          Jest 29.7.0 + React Testing Library
Type Checking:    TypeScript strict mode
```

---

## PROJECT ARCHITECTURE

### High-Level Architecture Diagram

```
                              +-----------------------+
                              |   PRISM PLATFORM      |
                              |   (Next.js 14 App)    |
                              +-----------+-----------+
                                          |
              +---------------------------+---------------------------+
              |                           |                           |
    +---------v---------+       +---------v---------+       +---------v---------+
    |  FOUNDATIONAL     |       |  CALCULATORS      |       |  ADMIN/REPORTING  |
    |  DATA MODULES     |       |  (MiFIDPRU)       |       |  MODULES          |
    +-------------------+       +-------------------+       +-------------------+
    | - Firm Data       |       | CORE:             |       | - User Management |
    | - Financial Data  |       | - FOR Calculator  |       | - SMCR Module     |
    | - Stress Testing  |       | - KFR Calculator  |       | - Regulatory      |
    | - Intelligence    |       | - Risk Assessment |       |   Reporting       |
    |   Dashboard       |       | - Wind-Down       |       +-------------------+
    +-------------------+       | - OFAR (Master)   |
                                |                   |
                                | K-FACTOR CALCS:   |
                                | - K-AUM, K-CMH    |
                                | - K-ASA, K-COH    |
                                | - K-DTF, K-NPR    |
                                | - K-TCD, K-CON    |
                                | - K-CMG           |
                                +-------------------+
```

### Data Flow Architecture (MCR Calculation)

```
                    FOUNDATIONAL DATA LAYER
    +-------------+  +----------------+  +----------------+
    | FIRM DATA   |  | FINANCIAL DATA |  | STRESS TESTING |
    | - Permissions |  | - Own Funds    |  | - Market       |
    | - PMR Type    |  | - Liquidity    |  | - Operational  |
    | - K-factor    |  | - Capital      |  | - Liquidity    |
    |   Applicability|  | - Balance Sheet|  | - Concentration|
    +-------+-------+  +-------+--------+  +-------+--------+
            |                  |                   |
            +--------+---------+-------------------+
                     |                    |
                     v                    v
            +--------+--------+  +--------+--------+
            |  KFR CALCULATOR |  | RISK ASSESSMENT |
            |  (9 K-Factors)  |  | (Capital Calc)  |
            |                 |  |                 |
            | K-AUM, K-CMH    |  | Risk Register   |
            | K-ASA, K-COH    |  | Monte Carlo     |
            | K-DTF, K-NPR    |  | Correlations    |
            | K-TCD, K-CON    |  | Controls        |
            | K-CMG           |  +-----------------+
            +--------+--------+          |
                     |                   |
    +----------------+-------------------+----------------+
    |                |                                   |
    v                v                                   v
+---+---+    +-------+--------+    +--------------------+----+
|  FOR  |    | WIND-DOWN      |    |     OFAR CALCULATOR     |
| CALC  |    | ASSESSMENT     |    | (Overall Financial      |
|       |    |                |    |  Adequacy Rule)         |
| Fixed |    | Orderly        |    |                         |
| Over- |    | wind-down      |    | OFR = max(PMR, FOR, KFR)|
| head  |    | capital        |    | OFTR = WDA + Stress +   |
| Req.  |    | requirement    |    |        Risk Add-ons     |
+---+---+    +-------+--------+    | MCR = max(OFR, OFTR)    |
    |                |             +-----------+-------------+
    |                |                         |
    +----------------+-------------------------+
                                               |
                                               v
                              +----------------+----------------+
                              |     FINAL OUTPUT: MCR          |
                              | Minimum Capital Requirement    |
                              | + Headroom Analysis            |
                              | + Binding Constraint ID        |
                              | + Recommendations              |
                              +---------------------------------+
```

### Module Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── calculators/          # Calculator APIs
│   │   │   ├── for/route.ts      # FOR CRUD
│   │   │   ├── kfr/route.ts      # KFR CRUD
│   │   │   ├── ofar/route.ts     # OFAR CRUD
│   │   │   └── risk-assessment/  # RA CRUD
│   │   ├── core/                 # Core data APIs
│   │   │   ├── firm-data/        # Firm data CRUD
│   │   │   └── financial-data/   # Financial data CRUD
│   │   └── firm-data/            # Legacy FX rates
│   └── modules/                  # Page routes for each module
│
├── modules/                      # Module source code
│   ├── admin/                    # Admin modules
│   │   ├── smcr/                 # SMCR compliance
│   │   └── user-management/      # User RBAC
│   │
│   ├── calculators/              # All calculators
│   │   ├── for/                  # Fixed Overhead Requirement
│   │   ├── kfr/                  # K-Factor aggregator
│   │   ├── ofar/                 # OFAR master calculator
│   │   ├── risk-assessment/      # Risk-based capital
│   │   ├── wind-down/            # Wind-down assessment
│   │   ├── kaum/                 # K-AUM calculator
│   │   ├── kcmh/                 # K-CMH calculator
│   │   ├── kasa/                 # K-ASA calculator
│   │   ├── kcoh/                 # K-COH calculator
│   │   ├── kdtf/                 # K-DTF calculator
│   │   ├── knpr/                 # K-NPR calculator
│   │   ├── ktcd/                 # K-TCD calculator
│   │   ├── kcon/                 # K-CON calculator
│   │   └── kcmg/                 # K-CMG calculator
│   │
│   ├── core/                     # Foundational data
│   │   ├── firm-data/            # Corporate & regulatory profile
│   │   ├── financial-data/       # Balance sheet & capital
│   │   └── stress-testing/       # Stress scenarios
│   │
│   └── reporting/                # Reporting modules
│       ├── icara/                # ICARA reporting (empty)
│       └── regulatory/           # FCA/PRA reports
│
├── components/                   # Shared components
│   └── navigation/               # Navigation system
│
└── lib/                          # Shared utilities
    └── prisma.ts                 # Prisma client
```

---

## MODULE INVENTORY & COMPLETION STATUS

### Category 1: Foundational Data Modules

| Module | Status | Lines of Code | Components | API | Database | Integration Status |
|--------|--------|---------------|------------|-----|----------|-------------------|
| **Firm Data** | ACTIVE | ~2,500 | 7 | Yes | FirmData | Ready to integrate |
| **Financial Data** | ACTIVE | ~2,800 | 5 | Yes | FinancialData | Ready to integrate |
| **Stress Testing** | ACTIVE | ~5,200 | 4 (incl. services) | Partial | Via JSON | Needs API completion |
| **Intelligence Dashboard** | COMING SOON | 0 | 0 | No | N/A | Not started |

#### Firm Data Module Details
- **Components**: FirmDataForm (main), CorporateIdentitySection, KeyContactsSection, SeniorManagementSection, SpecialPermissionsSection, PermissionsMatrix, KFactorRelevanceCard
- **Features**: K-factor applicability determination, FX rate management, SMCR personnel tracking, scope of permissions
- **Database Fields**: 30+ fields covering corporate identity, regulatory profile, permissions, FX rates
- **Integration Points**:
  - OFAR: PMR determination (firm type → £75k/£150k/£750k)
  - KFR: K-factor applicability (which K-factors apply based on permissions)
  - Reporting: Firm identity for regulatory submissions

#### Financial Data Module Details
- **Components**: FinancialDataForm (main), BalanceSheetSection, RegulatoryCapitalSection, LiquidityResourcesSection, ContextualInfoSection
- **Features**: Own funds calculation (CET1 + AT1 + T2), liquidity resources, LCR tracking
- **Database Fields**: 35+ fields covering balance sheet, regulatory capital, liquidity
- **Integration Points**:
  - OFAR: Own funds for capital adequacy calculation
  - K-CON: Own funds threshold (25% limit calculation)
  - Wind-Down: Liquid resources for WDA
  - Risk Assessment: Capital base for stress testing

#### Stress Testing Module Details
- **Components**: StressTestingMain (16,000+ lines), StressVisualisations (24,000+ lines)
- **Services**: stress-calculation-engine.ts (23,000+ lines), stress-testing-services.ts (16,000+ lines)
- **Features**: Linear stress testing, reverse stress testing (planned), scenario management
- **Integration Points**:
  - OFAR: Stress test results (market, operational, liquidity, concentration)
  - Risk Assessment: Scenario correlation

---

### Category 2: Core Calculator Modules

| Module | Status | Lines of Code | Components | API | Database | Integration Status |
|--------|--------|---------------|------------|-----|----------|-------------------|
| **FOR Calculator** | ACTIVE | ~750 | 4 | Yes | FORCalculation | Fully functional, ready |
| **KFR Calculator** | ACTIVE | ~4,500 | 8+ | Yes | KFRCalculation | Functional, K-factors integrating |
| **Risk Assessment** | ACTIVE | ~1,500 | 5 | Yes | RiskAssessment | Functional, needs OFAR link |
| **Wind-Down Assessment** | ACTIVE | ~2,400 | 5 | Partial | Via JSON | Needs API completion |
| **OFAR Calculator** | COMING SOON | ~800 | 1 | Yes | OFARCalculation | UI exists, no auto-import |

#### FOR Calculator Details (MiFIDPRU 4.5)
- **Components**: FORCalculatorForm (main), ConsolidatedApproach, GranularApproach, FORResults
- **Features**: Two calculation approaches (consolidated/granular), 6 expense categories, MiFIDPRU adjustments
- **Formula**: `FOR = (Adjusted Expenditure / 12) × 3 months`
- **Database**: Full CRUD with versioning, historical snapshots
- **Integration Points**:
  - OFAR: FOR amount for OFR calculation (manual or auto-import)

#### KFR Calculator Details (MiFIDPRU 4.6)
- **Main Component**: KFRCalculatorForm (1,500+ lines), KFactorInput (500+ lines)
- **K-Factor Components**: Individual calculators for each K-factor (see K-Factor section below)
- **Features**: 9 K-factor inputs, category totals (RTM/RTC/RTF), SNI classification, modal launch for complex calculators
- **Formulas**:
  - `KFR = RTM + RTC + RTF`
  - RTM (Risk-to-Market): K-NPR + K-CMG + K-TCD
  - RTC (Risk-to-Client): K-AUM + K-CMH + K-ASA + K-COH
  - RTF (Risk-to-Firm): K-DTF + K-CON
- **Database**: Full CRUD, calculatorStates JSON for full state preservation
- **Integration Points**:
  - OFAR: KFR total for OFR calculation
  - Firm Data: K-factor applicability determination

#### Risk Assessment Details (MiFIDPRU 7.7)
- **Components**: RiskAssessmentMain, RiskCard, RiskDistributionChart, RiskHeatMap, RiskRegister
- **Features**: Risk register, gross/net scoring, controls library, Monte Carlo simulation, correlation matrix
- **Database**: RiskAssessment, RiskItem, RiskControl, RiskCorrelation, RiskScenario, MonteCarloSimulation
- **Integration Points**:
  - OFAR: Risk-based capital add-ons
  - Stress Testing: Scenario correlation

#### Wind-Down Assessment Details (MiFIDPRU 4.3)
- **Components**: WindDownMain (1,064 lines), GanttTimeline (222 lines), ScenarioComparison, ResourceValidationBanner, CriticalActivityModal
- **Features**: Critical activities timeline, cost projection, resource tracking, scenario comparison
- **Integration Points**:
  - OFAR: Wind-down capital requirement
  - Financial Data: Liquid resources for sufficiency check

#### OFAR Calculator Details (MiFIDPRU 7.6)
- **Current State**: UI exists with manual input fields; no auto-import from other modules
- **Components**: OFARCalculatorMain (partial)
- **Formula**:
  - `OFR = max(PMR, FOR, KFR)`
  - `OFTR = Wind-Down + Stress Testing + Risk Add-ons`
  - `MCR = max(OFR, OFTR)`
- **Required Integrations**:
  - Firm Data: PMR determination
  - FOR Calculator: FOR value
  - KFR Calculator: KFR total
  - Wind-Down: WDA capital
  - Stress Testing: Stress impacts
  - Risk Assessment: Risk add-ons
  - Financial Data: Own funds for headroom

---

### Category 3: K-Factor Calculator Modules

| K-Factor | MiFIDPRU | Category | Status | Lines | Complexity | Integration |
|----------|----------|----------|--------|-------|------------|-------------|
| **K-AUM** | 4.10 | RTC | UI Built | ~600 | Simple (CSV) | In KFR |
| **K-CMH** | 4.11 | RTC | UI Built | ~550 | Simple (CSV) | In KFR |
| **K-ASA** | 4.11 | RTC | UI Built | ~600 | Simple (CSV) | In KFR |
| **K-COH** | 4.10 | RTC | UI Built | ~500 | Simple (CSV) | In KFR |
| **K-DTF** | 4.15 | RTF | UI Built | ~450 | Simple (CSV) | In KFR |
| **K-NPR** | 4.8 | RTM | UI Built | ~1,370 | Complex (Modal) | In KFR |
| **K-CMG** | 4.9 | RTM | UI Built | ~925 | Complex (Modal) | In KFR |
| **K-TCD** | 4.11 | RTM | UI Built | ~1,400 | Complex (Modal) | In KFR |
| **K-CON** | 4.14 | RTF | UI Built | ~990 | Complex (Modal) | In KFR |

#### K-Factor Details

**Simple K-Factors (CSV-based)**:
- K-AUM: Assets Under Management - daily average over 12 months × 0.02%
- K-CMH: Client Money Held - daily average × 0.4%
- K-ASA: Assets Safeguarded and Administered - daily average × 0.04%
- K-COH: Client Orders Handled (cash) × 0.1% or (derivatives) × 0.01%
- K-DTF: Daily Trading Flow × coefficient (dealing vs matched principal)

**Complex K-Factors (Transaction-based, Modal UI)**:
- K-NPR: Net Position Risk - position-by-position calculation with risk weights
- K-CMG: Clearing Member Guarantee - CCP margins and default fund contributions
- K-TCD: Trading Counterparty Default - SA-CCR methodology with derivatives, SFTs, long settlement
- K-CON: Concentration Risk - large exposure monitoring, 25% threshold

---

### Category 4: Admin Modules

| Module | Status | Lines | Components | Integration |
|--------|--------|-------|------------|-------------|
| **User Management** | ACTIVE | ~1,200 | 1 (UserManagementForm) | None required |
| **SMCR Module** | COMING SOON | ~2,700 | 1 (SMCRMain) | Firm Data (personnel) |

---

### Category 5: Reporting Modules

| Module | Status | Lines | Components | Integration |
|--------|--------|-------|------------|-------------|
| **Regulatory Reporting** | ACTIVE | ~1,400 | 1 (RegulatoryReportingForm) | All calculators for data |
| **ICARA Reporting** | COMING SOON | 0 | None | All modules |

---

## MODULE DEPENDENCIES & DATA FLOW MAP

### Critical Integration Matrix

```
                     DATA SOURCES                    │            DATA CONSUMERS
═══════════════════════════════════════════════════════════════════════════════════════
                                                     │
    FIRM DATA                                        │    OFAR CALCULATOR
    ├─── PMR Type (£75k/£150k/£750k) ───────────────┼───► PMR Component
    ├─── K-Factor Applicability ────────────────────┼───► KFR Calculator
    ├─── Reporting Currency ────────────────────────┼───► All Calculators
    └─── FX Rates ─────────────────────────────────┼───► Currency Conversion
                                                     │
    FINANCIAL DATA                                   │
    ├─── Own Funds (CET1+AT1+T2) ───────────────────┼───► OFAR (Headroom)
    ├─── Liquid Assets ─────────────────────────────┼───► Wind-Down
    ├─── Undrawn Facilities ────────────────────────┼───► Wind-Down
    └─── Own Funds ─────────────────────────────────┼───► K-CON (25% threshold)
                                                     │
    FOR CALCULATOR                                   │
    └─── FOR Requirement ───────────────────────────┼───► OFAR (OFR component)
                                                     │
    KFR CALCULATOR                                   │
    ├─── K-AUM value ───────────────────────────────┤
    ├─── K-CMH value ───────────────────────────────┤
    ├─── K-ASA value ───────────────────────────────┤
    ├─── K-COH value ───────────────────────────────┤
    ├─── K-DTF value ───────────────────────────────┤
    ├─── K-NPR value ───────────────────────────────┤
    ├─── K-CMG value ───────────────────────────────┤
    ├─── K-TCD value ───────────────────────────────┤
    ├─── K-CON value ───────────────────────────────┤
    └─── KFR Total ─────────────────────────────────┼───► OFAR (OFR component)
                                                     │
    RISK ASSESSMENT                                  │
    ├─── Operational Risk Capital ──────────────────┼───► OFAR (Risk Add-ons)
    ├─── Strategic Risk Capital ────────────────────┼───► OFAR (Risk Add-ons)
    ├─── Reputational Risk Capital ─────────────────┼───► OFAR (Risk Add-ons)
    └─── Total Risk Capital ────────────────────────┼───► OFAR (OFTR)
                                                     │
    WIND-DOWN ASSESSMENT                             │
    └─── Wind-Down Requirement ─────────────────────┼───► OFAR (OFTR component)
                                                     │
    STRESS TESTING                                   │
    ├─── Market Stress Impact ──────────────────────┼───► OFAR (OFTR)
    ├─── Operational Stress Impact ─────────────────┼───► OFAR (OFTR)
    ├─── Liquidity Stress Impact ───────────────────┼───► OFAR (OFTR)
    └─── Concentration Stress Impact ───────────────┼───► OFAR (OFTR)
                                                     │
═══════════════════════════════════════════════════════════════════════════════════════
```

### Data Flow Sequence for MCR Calculation

```
STEP 1: FOUNDATIONAL DATA ENTRY
┌─────────────────────────────────────────────────────────────────┐
│  User enters/updates:                                            │
│  • Firm Data (one-time setup, periodic updates)                  │
│  • Financial Data (monthly/quarterly updates)                    │
│  • System determines K-factor applicability from permissions     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
STEP 2: COMPONENT CALCULATIONS (Can run in parallel)
┌─────────────────────────────────────────────────────────────────┐
│  FOR Calculator        │  User enters annual expenditure        │
│  ─────────────────────────────────────────────────────────────  │
│  KFR Calculator        │  User configures applicable K-factors  │
│    ├── Simple K-factors │  Upload CSV data                      │
│    └── Complex K-factors│  Enter transactions via modals        │
│  ─────────────────────────────────────────────────────────────  │
│  Risk Assessment       │  User builds risk register             │
│  ─────────────────────────────────────────────────────────────  │
│  Wind-Down Assessment  │  User plans critical activities        │
│  ─────────────────────────────────────────────────────────────  │
│  Stress Testing        │  User runs stress scenarios            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
STEP 3: OFAR AGGREGATION (Master calculation)
┌─────────────────────────────────────────────────────────────────┐
│  OFAR Calculator auto-imports:                                   │
│  • PMR from Firm Data (firm type)                               │
│  • FOR from FOR Calculator (latest)                             │
│  • KFR from KFR Calculator (latest)                             │
│  • WDA from Wind-Down Assessment                                 │
│  • Stress impacts from Stress Testing                           │
│  • Risk add-ons from Risk Assessment                            │
│  • Own Funds from Financial Data                                │
│                                                                  │
│  Calculates:                                                     │
│  • OFR = max(PMR, FOR, KFR)                                     │
│  • OFTR = WDA + Stress + Risk Add-ons                           │
│  • MCR = max(OFR, OFTR)                                         │
│  • Headroom = Own Funds - MCR                                   │
│  • Binding Constraint identification                            │
│  • Recommendations                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
STEP 4: OUTPUT & REPORTING
┌─────────────────────────────────────────────────────────────────┐
│  • MCR Dashboard display                                         │
│  • Regulatory reports (MIF001, MIF002, etc.)                    │
│  • Historical tracking & trend analysis                          │
│  • PDF/Excel export                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## OUTSTANDING WORK & INTEGRATION GAPS

### Critical Integration Gaps (Must Fix)

#### 1. OFAR Auto-Import System (PRIORITY: CRITICAL)
**Current State**: OFAR Calculator has manual input fields only
**Required Work**:
- Implement API calls to fetch latest FOR calculation
- Implement API calls to fetch latest KFR calculation
- Implement API calls to fetch latest Wind-Down calculation
- Implement API calls to fetch latest Stress Testing results
- Implement API calls to fetch latest Risk Assessment results
- Implement API calls to fetch Financial Data (own funds)
- Implement Firm Data integration for PMR determination
- Add "Import from Calculator" buttons with loading states
- Add data freshness indicators (last updated timestamps)
- Handle cases where source data doesn't exist

**Estimated Effort**: 3-4 sessions

#### 2. K-CON → Financial Data Integration (PRIORITY: HIGH)
**Current State**: K-CON calculator has manual Own Funds entry
**Required Work**:
- Fetch Own Funds from Financial Data module
- Display "Import Own Funds" button
- Auto-calculate 25% threshold
- Update when Financial Data changes

**Estimated Effort**: 1 session

#### 3. Wind-Down API Completion (PRIORITY: HIGH)
**Current State**: Wind-Down has partial API, no full CRUD
**Required Work**:
- Complete POST endpoint for saving wind-down calculations
- Add GET endpoint for fetching saved calculations
- Add database model for WindDownCalculation (currently uses JSON)
- Integrate with Financial Data for liquid resources

**Estimated Effort**: 1-2 sessions

#### 4. Stress Testing API Completion (PRIORITY: HIGH)
**Current State**: Stress Testing module exists but limited API integration
**Required Work**:
- Expose stress test results via API for OFAR consumption
- Standardize output format (market, operational, liquidity, concentration)
- Add endpoint for fetching latest stress test results

**Estimated Effort**: 1 session

### Module Status Updates Needed

#### Navigation Updates Required
Several K-factor calculators are marked as "coming-soon" in navigation but are actually built:
- K-NPR: Should be "active" or "beta"
- K-CMG: Already marked "beta" (correct)
- K-TCD: Should be "beta"
- K-CON: Already marked "beta" (correct)
- K-AUM, K-CMH, K-ASA, K-COH, K-DTF: UI exists in KFR, navigation should reflect this

#### Outstanding Module Development

| Module | Work Required | Estimated Sessions |
|--------|---------------|-------------------|
| SMCR Module | Connect to Firm Data SMF fields | 1 |
| Intelligence Dashboard | Build from scratch | 3-4 |
| ICARA Reporting | Build from scratch | 2-3 |
| Reverse Stress Testing | Add to Stress Testing module | 2 |

---

## VISUAL INTEGRATION ARCHITECTURE

### OFAR Integration Architecture (Target State)

```
                                    ╔═══════════════════════════════════════╗
                                    ║         OFAR CALCULATOR               ║
                                    ║  (Master Capital Requirement Engine)   ║
                                    ╠═══════════════════════════════════════╣
                                    ║                                       ║
                                    ║   ┌─────────────────────────────────┐ ║
                                    ║   │   OFR = max(PMR, FOR, KFR)      │ ║
                                    ║   └─────────────────────────────────┘ ║
                                    ║                  ▲                    ║
              ┌────────────────────────────────────────┼────────────────────┼─────────────────┐
              │                    │                   │                    │                 │
              ▼                    ▼                   ▼                    │                 │
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │                 │
    │   FIRM DATA     │  │  FOR CALCULATOR │  │  KFR CALCULATOR │          │                 │
    │                 │  │                 │  │                 │          │                 │
    │ ► Firm Type     │  │ ► Annual        │  │ ► 9 K-Factors   │          │                 │
    │   → PMR Amount  │  │   Expenditure   │  │ ► RTM + RTC     │          │                 │
    │ ► K-Factor      │  │ ► Adjustments   │  │   + RTF         │          │                 │
    │   Applicability │  │ ► FOR Result    │──┼─► KFR Total     │          │                 │
    │ ► Currency      │  │                 │  │                 │          │                 │
    │ ► FX Rates      │  └─────────────────┘  └─────────────────┘          │                 │
    └─────────────────┘          │                     │                   │                 │
              │                  │                     │                   │                 │
              │                  │         ┌───────────┘                   │                 │
              │                  │         │                               │                 │
              │                  │         │   ┌───────────────────────────┘                 │
              │                  │         │   │                                             │
              │                  │         │   │                                             │
              │                  └─────────┼───┼─────────────────────────────────────────────┤
              │                            │   │                                             │
              │         ╔═══════════════════╧═══╧═════════════════════════════════╗         │
              │         ║   OFTR = Wind-Down + Stress + Risk Add-ons              ║         │
              │         ╚═══════════════════════════════════════════════════════╝         │
              │                    ▲           ▲           ▲                               │
              │                    │           │           │                               │
              ▼                    │           │           │                               │
    ┌─────────────────┐  ┌────────┴───────┐ ┌─┴──────────┐ ┌───────────────┐              │
    │ FINANCIAL DATA  │  │  WIND-DOWN     │ │  STRESS    │ │    RISK       │              │
    │                 │  │  ASSESSMENT    │ │  TESTING   │ │  ASSESSMENT   │              │
    │ ► Own Funds     │──┼─► WDA Capital  │ │            │ │               │              │
    │ ► Liquidity     │  │ ► Critical     │ │ ► Market   │ │ ► Risk        │              │
    │ ► HQLA          │  │   Activities   │ │ ► Operat.  │ │   Register    │              │
    │ ► Capital       │  │ ► Cost         │ │ ► Liquid.  │ │ ► Controls    │              │
    └─────────────────┘  │   Projection   │ │ ► Concent. │ │ ► Capital     │              │
              │          └────────────────┘ └────────────┘ └───────────────┘              │
              │                                                                            │
              └────────────────────────────────────────────────────────────────────────────┤
                                                                                           │
                                    ╔═════════════════════════════════════════════════╗   │
                                    ║   MCR = max(OFR, OFTR)                          ║◄──┘
                                    ║   Headroom = Own Funds - MCR                     ║
                                    ║   Capital Adequacy = Headroom >= 0               ║
                                    ║   Binding Constraint = PMR/FOR/KFR/OFTR          ║
                                    ╚═════════════════════════════════════════════════╝
```

### K-Factor Architecture (Within KFR)

```
                            ┌─────────────────────────────────────┐
                            │         KFR CALCULATOR              │
                            │     (K-Factor Aggregator)           │
                            ├─────────────────────────────────────┤
                            │                                     │
                            │   KFR = RTM + RTC + RTF             │
                            │                                     │
                            └───────────────┬─────────────────────┘
                                            │
              ┌─────────────────────────────┼─────────────────────────────┐
              │                             │                             │
              ▼                             ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
│   RTM (Risk-to-Market)  │   │   RTC (Risk-to-Client)  │   │   RTF (Risk-to-Firm)    │
│                         │   │                         │   │                         │
│  ┌───────────────────┐  │   │  ┌───────────────────┐  │   │  ┌───────────────────┐  │
│  │ K-NPR (Net Pos)   │  │   │  │ K-AUM (Assets UM) │  │   │  │ K-DTF (Daily TF)  │  │
│  │ [Complex - Modal] │  │   │  │ [Simple - CSV]    │  │   │  │ [Simple - CSV]    │  │
│  └───────────────────┘  │   │  └───────────────────┘  │   │  └───────────────────┘  │
│  ┌───────────────────┐  │   │  ┌───────────────────┐  │   │  ┌───────────────────┐  │
│  │ K-CMG (Clearing)  │  │   │  │ K-CMH (Client $)  │  │   │  │ K-CON (Conc. Risk)│  │
│  │ [Complex - Modal] │  │   │  │ [Simple - CSV]    │  │   │  │ [Complex - Modal] │  │
│  └───────────────────┘  │   │  └───────────────────┘  │   │  └───────────────────┘  │
│  ┌───────────────────┐  │   │  ┌───────────────────┐  │   │                         │
│  │ K-TCD (TCD Risk)  │  │   │  │ K-ASA (Assets SA) │  │   │                         │
│  │ [Complex - Modal] │  │   │  │ [Simple - CSV]    │  │   │                         │
│  └───────────────────┘  │   │  └───────────────────┘  │   │                         │
│                         │   │  ┌───────────────────┐  │   │                         │
│                         │   │  │ K-COH (Orders)    │  │   │                         │
│                         │   │  │ [Simple - CSV]    │  │   │                         │
│                         │   │  └───────────────────┘  │   │                         │
└─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

---

## RECOMMENDED SPRINT ROADMAP

### Sprint Priority Framework

**Priority 1 (Critical Path)**: OFAR integration - enables the core product function
**Priority 2 (High Value)**: K-factor standalone access, navigation updates
**Priority 3 (Enhancement)**: Dashboard, SMCR, additional features
**Priority 4 (Future)**: Advanced analytics, AI features, mobile

### Recommended Sprint Sequence

#### SPRINT 1: Financial Data Module Deep Integration
**Goal**: Establish Financial Data as the single source of truth for capital figures
**Work Items**:
1. Add organizationId to Financial Data create flow
2. Implement "Import Own Funds" in K-CON calculator
3. Implement "Import Liquid Resources" in Wind-Down calculator
4. Add data freshness indicators to all consumers
5. Add validation for minimum data requirements

**Dependencies**: None (foundational)
**Estimated Duration**: 1-2 sessions
**Deliverable**: Financial Data reliably feeds K-CON and Wind-Down

---

#### SPRINT 2: Firm Data Module Deep Integration
**Goal**: Establish Firm Data as authority for regulatory profile
**Work Items**:
1. PMR determination logic in OFAR (firm type → PMR amount)
2. K-factor applicability propagation to KFR calculator
3. Currency/FX rate handling across all calculators
4. SMCR personnel integration preparation

**Dependencies**: None (foundational)
**Estimated Duration**: 1-2 sessions
**Deliverable**: Firm Data drives PMR and K-factor applicability

---

#### SPRINT 3: Wind-Down Assessment API Completion
**Goal**: Make Wind-Down a proper CRUD module with database persistence
**Work Items**:
1. Create WindDownCalculation Prisma model
2. Implement full CRUD API routes
3. Add Financial Data integration for liquid resources validation
4. Implement OFAR export interface

**Dependencies**: Sprint 1 (Financial Data)
**Estimated Duration**: 2 sessions
**Deliverable**: Wind-Down persists to database, exports to OFAR

---

#### SPRINT 4: Stress Testing API Completion
**Goal**: Expose Stress Testing results for OFAR consumption
**Work Items**:
1. Create standardized stress result output format
2. Implement API endpoint for latest stress results
3. Add database persistence for stress test results
4. Implement OFAR export interface

**Dependencies**: None
**Estimated Duration**: 1-2 sessions
**Deliverable**: Stress Testing results available via API

---

#### SPRINT 5: Risk Assessment → OFAR Integration
**Goal**: Connect Risk Assessment capital output to OFAR
**Work Items**:
1. Standardize risk capital output format
2. Implement API endpoint for risk-based capital
3. Add OFAR import capability
4. Handle risk add-on categorization

**Dependencies**: None
**Estimated Duration**: 1 session
**Deliverable**: Risk Assessment exports to OFAR

---

#### SPRINT 6: OFAR Auto-Import Implementation (MAJOR)
**Goal**: Complete OFAR as the master aggregation calculator
**Work Items**:
1. FOR auto-import implementation
2. KFR auto-import implementation
3. Wind-Down auto-import implementation
4. Stress Testing auto-import implementation
5. Risk Assessment auto-import implementation
6. Financial Data (own funds) auto-import
7. Firm Data (PMR) auto-import
8. Data source tracking (manual vs auto)
9. Freshness indicators and warnings
10. Calculate button integration

**Dependencies**: Sprints 1-5
**Estimated Duration**: 3-4 sessions
**Deliverable**: OFAR fully functional with auto-import

---

#### SPRINT 7: Navigation & Status Updates
**Goal**: Update navigation to reflect actual module status
**Work Items**:
1. Update K-factor calculator statuses in ModuleNavigation
2. Add standalone routes for K-factor calculators (optional)
3. Implement breadcrumb navigation
4. Add module completion indicators
5. Update documentation

**Dependencies**: Sprints 1-6
**Estimated Duration**: 1 session
**Deliverable**: Navigation accurately reflects module status

---

#### SPRINT 8: SMCR & User Management Integration
**Goal**: Connect SMCR to Firm Data personnel
**Work Items**:
1. SMCR data sync from Firm Data SMF fields
2. User role assignment integration
3. Audit trail for personnel changes
4. Certification regime tracking

**Dependencies**: Sprint 2 (Firm Data)
**Estimated Duration**: 2 sessions
**Deliverable**: SMCR module functional

---

#### SPRINT 9: Intelligence Dashboard
**Goal**: Real-time MCR tracking and insights
**Work Items**:
1. Design dashboard layout
2. Implement MCR summary widget
3. Add trend charts (historical MCR)
4. Implement binding constraint analysis
5. Add recommendations engine
6. Implement alerts system

**Dependencies**: Sprint 6 (OFAR)
**Estimated Duration**: 3-4 sessions
**Deliverable**: Intelligence Dashboard live

---

#### SPRINT 10: Regulatory Reporting Enhancement
**Goal**: Generate FCA-compliant reports
**Work Items**:
1. MIF001 report generation
2. MIF002 report generation
3. PDF export functionality
4. Excel export functionality
5. Submission tracking

**Dependencies**: Sprint 6 (OFAR)
**Estimated Duration**: 2-3 sessions
**Deliverable**: Regulatory reports exportable

---

### Sprint Timeline Summary

```
Sprint 1  ████░░░░░░░░░░░░░░░░  Financial Data Integration
Sprint 2  ████░░░░░░░░░░░░░░░░  Firm Data Integration
Sprint 3  ████████░░░░░░░░░░░░  Wind-Down API
Sprint 4  ████░░░░░░░░░░░░░░░░  Stress Testing API
Sprint 5  ████░░░░░░░░░░░░░░░░  Risk Assessment Integration
Sprint 6  ████████████████░░░░  OFAR Auto-Import (MAJOR)
Sprint 7  ████░░░░░░░░░░░░░░░░  Navigation Updates
Sprint 8  ████████░░░░░░░░░░░░  SMCR Integration
Sprint 9  ████████████████░░░░  Intelligence Dashboard
Sprint 10 ████████████░░░░░░░░  Regulatory Reporting
          ─────────────────────
          Session estimate: ~20-25 sessions total
```

---

## STRATEGIC CONSIDERATIONS

### Why This Sequence Matters

1. **Foundational First**: Sprints 1-2 establish Firm Data and Financial Data as authoritative sources. Every downstream calculation depends on these.

2. **Dependencies Resolved**: Sprints 3-5 complete the component calculators' API layers, enabling OFAR to consume their outputs.

3. **OFAR Critical Path**: Sprint 6 is the culmination - without functional OFAR auto-import, the platform cannot fulfill its core purpose of calculating MCR.

4. **UX Polish**: Sprints 7-10 are enhancements that improve usability but don't affect core regulatory calculations.

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Database schema changes required | Use Prisma migrations; test in dev first |
| Breaking existing functionality | Create feature branches; comprehensive testing |
| Performance with multiple API calls | Implement parallel fetching; consider caching |
| Data consistency issues | Add timestamps; implement optimistic locking |
| User confusion during transition | Add loading states; clear error messages |

### Success Criteria

The integration phase is complete when:
- [ ] User can enter Firm Data once, and PMR/K-factor applicability propagates
- [ ] User can enter Financial Data once, and Own Funds flows to K-CON, Wind-Down, OFAR
- [ ] FOR, KFR, Risk Assessment, Wind-Down, Stress Testing all persist to database
- [ ] OFAR can auto-import all component values with one click
- [ ] MCR calculation matches manual calculation within £1
- [ ] Historical tracking shows MCR evolution over time
- [ ] Regulatory reports can be generated from calculated data

---

## APPENDIX A: Database Schema Overview

### Core Tables (18 total)

| Table | Purpose | Relations |
|-------|---------|-----------|
| Organization | Multi-tenant root | All tables |
| User | Authentication & RBAC | Organization |
| AuditLog | Change tracking | Organization, User |
| FirmData | Regulatory profile | Organization, KFRCalculation |
| FinancialData | Capital & liquidity | Organization, Snapshots, Dependencies |
| FinancialDataSnapshot | Point-in-time records | FinancialData |
| CalculatorDependency | Cross-calculator links | FinancialData |
| FORCalculation | FOR calculations | Organization, Snapshots |
| FORHistoricalSnapshot | FOR history | FORCalculation |
| KFRCalculation | KFR calculations | Organization, FirmData, K-factor calcs |
| KFactorCalculation | Individual K-factors | KFRCalculation |
| RiskAssessment | Risk capital | Organization, Items, Correlations, Scenarios, Monte Carlo |
| RiskItem | Individual risks | RiskAssessment, Controls |
| RiskControl | Risk mitigations | RiskItem |
| RiskCorrelation | Risk relationships | RiskAssessment |
| ControlsLibrary | Control templates | Organization |
| RiskScenario | Stress scenarios | RiskAssessment |
| MonteCarloSimulation | Simulation results | RiskAssessment |
| OFARCalculation | Master MCR calc | Organization |

---

## APPENDIX B: API Endpoints Summary

### Existing Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/core/firm-data` | GET, POST, PUT | Firm data CRUD |
| `/api/core/firm-data/k-factors` | GET | K-factor applicability |
| `/api/core/firm-data/history` | GET | Firm data history |
| `/api/core/financial-data` | GET, POST, PUT | Financial data CRUD |
| `/api/calculators/for` | GET, POST, PUT | FOR CRUD |
| `/api/calculators/for/history` | GET | FOR history |
| `/api/calculators/kfr` | GET, POST, PUT | KFR CRUD |
| `/api/calculators/kfr/history` | GET | KFR history |
| `/api/calculators/ofar` | GET, POST, PUT | OFAR CRUD |
| `/api/calculators/ofar/history` | GET | OFAR history |
| `/api/calculators/risk-assessment` | GET, POST, PUT | Risk Assessment CRUD |
| `/api/calculators/risk-assessment/history` | GET | RA history |
| `/api/calculations/winddown` | GET, POST | Wind-down (partial) |
| `/api/firm-data/fx-rates` | GET, POST | FX rates |
| `/api/firm-data/fx-rates/history` | GET | FX rate history |

### Required New Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/calculators/stress-testing` | GET, POST | Stress test results |
| `/api/calculators/winddown` | GET, POST, PUT | Full Wind-down CRUD |
| `/api/calculators/ofar/import` | POST | Trigger auto-import |

---

## CONCLUSION

The PRISM Platform has achieved significant progress with ~45% of modules in active/functional state. The core regulatory calculation engine (FOR, KFR, Risk Assessment, Wind-Down) exists but operates in silos. The critical next phase is **integration** - connecting these modules so data flows automatically to the OFAR calculator, which produces the final Minimum Capital Requirement.

The recommended sprint sequence prioritizes:
1. Establishing foundational data modules as authoritative sources
2. Completing API layers for all component calculators
3. Building the OFAR auto-import system
4. Polishing UX and adding advanced features

With approximately 20-25 development sessions, the platform can achieve full integration and deliver on its core promise: automated MiFIDPRU capital requirement calculation.

---

**Report Prepared By**: Claude Code (Opus 4.5)
**Date**: December 19, 2025
**Next Review**: After Sprint 6 completion

---
