# PRISM V1 - Ship Specification

> **Purpose**: This document defines exactly what "done" means for PRISM V1. It is the concrete, checkable specification against which we measure completion.

**Created**: December 29, 2025
**Status**: Active
**Owner**: Quantum Liquidity Systems Ltd

---

## The Ship Standard

**When V1 is complete, a CFO can:**
1. Enter their firm data once
2. Have K-factor applicability automatically determined
3. Run all required regulatory calculations
4. Execute linear and reverse stress tests
5. Generate a complete, high-quality ICARA document
6. Export to PDF with visual charts and metrics
7. Use daily for operational decision-making

**The test**: "We can sell this tomorrow."

---

## Component Checklist

### Foundational Data Modules

| Component | Status | Criteria |
|-----------|--------|----------|
| **Firm Data** | | |
| ☐ Corporate identity capture | | All firm details stored |
| ☐ Regulatory profile (permissions) | | Drives K-factor applicability |
| ☐ PMR determination | | Firm type → £75k/£150k/£750k |
| ☐ K-factor applicability logic | | Auto-determines which K-factors apply |
| ☐ FX rate management | | Currency conversion working |
| ☐ SMF personnel tracking | | Key individuals recorded |
| **Financial Data** | | |
| ☐ Balance sheet capture | | Assets, liabilities, equity |
| ☐ Own Funds calculation | | CET1 + AT1 + T2 |
| ☐ Liquidity resources | | HQLA, undrawn facilities |
| ☐ LCR tracking | | Liquidity coverage ratio |
| ☐ Integration with K-CON | | 25% threshold calculation |
| ☐ Integration with Wind-Down | | Liquid resources for WDA |
| **Stress Testing** | | |
| ☐ Linear stress testing | | As per MiFIDPRU requirements |
| ☐ Reverse stress testing | | Point of non-viability analysis |
| ☐ ICARA-specific variables | | K-factors, own funds as inputs |
| ☐ Scenario management | | Create, save, compare scenarios |
| ☐ Integration with OFAR | | Stress results flow to OFTR |

### Core Calculators

| Component | Status | Criteria |
|-----------|--------|----------|
| **FOR Calculator (MiFIDPRU 4.5)** | | |
| ☐ Consolidated approach | | Single annual figure input |
| ☐ Granular approach | | 6 expense categories |
| ☐ MiFIDPRU adjustments | | Regulatory exclusions applied |
| ☐ FOR result calculation | | (Adjusted Expenditure / 12) × 3 |
| ☐ Historical versioning | | Previous calculations preserved |
| ☐ API endpoint working | | GET/POST/PUT functional |
| **KFR Calculator (MiFIDPRU 4.6)** | | |
| ☐ K-factor input UI | | All 9 K-factors accessible |
| ☐ Applicability filtering | | Only show applicable K-factors |
| ☐ RTM total (K-NPR + K-CMG + K-TCD) | | Risk-to-Market aggregation |
| ☐ RTC total (K-AUM + K-CMH + K-ASA + K-COH) | | Risk-to-Client aggregation |
| ☐ RTF total (K-DTF + K-CON) | | Risk-to-Firm aggregation |
| ☐ KFR total calculation | | RTM + RTC + RTF |
| ☐ Calculator state persistence | | Full state saved to DB |
| **Risk Assessment (MiFIDPRU 7.7)** | | |
| ☐ Risk register | | Capture all material risks |
| ☐ Gross/net scoring | | Impact × Likelihood |
| ☐ Controls library | | Reusable control templates |
| ☐ Risk-based capital calculation | | Capital per risk category |
| ☐ Monte Carlo simulation | | Probabilistic analysis |
| ☐ Correlation matrix | | Inter-risk relationships |
| ☐ Integration with OFAR | | Risk add-ons flow to OFTR |
| **Wind-Down Assessment (MiFIDPRU 7.5)** | | |
| ☐ Critical activities identification | | What must continue during wind-down |
| ☐ Timeline planning | | Gantt-style activity sequencing |
| ☐ Cost projection | | Monthly cost breakdown |
| ☐ Resource tracking | | Staff, systems, third parties |
| ☐ Liquid resources validation | | Check against Financial Data |
| ☐ WDA capital result | | Total wind-down requirement |
| ☐ API endpoint working | | Full CRUD functional |
| **OFAR Calculator (MiFIDPRU 7.6)** | | |
| ☐ PMR auto-import from Firm Data | | Firm type → PMR amount |
| ☐ FOR auto-import | | Latest FOR calculation |
| ☐ KFR auto-import | | Latest KFR total |
| ☐ WDA auto-import | | Latest wind-down requirement |
| ☐ Stress results auto-import | | Market, operational, liquidity, concentration |
| ☐ Risk add-ons auto-import | | From Risk Assessment |
| ☐ Own Funds auto-import | | From Financial Data |
| ☐ OFR calculation | | max(PMR, FOR, KFR) |
| ☐ OFTR calculation | | WDA + Stress + Risk Add-ons |
| ☐ MCR calculation | | max(OFR, OFTR) |
| ☐ Headroom calculation | | Own Funds - MCR |
| ☐ Binding constraint identification | | Which component drives MCR |
| ☐ Data source tracking | | Manual vs auto-imported flagging |
| ☐ Freshness indicators | | Last updated timestamps |

### K-Factor Calculators

| K-Factor | Status | Criteria |
|----------|--------|----------|
| **K-AUM (MiFIDPRU 4.10)** | | |
| ☐ CSV upload functional | | Monthly AUM data |
| ☐ 12-month average calculation | | Daily average methodology |
| ☐ Coefficient application | | × 0.02% |
| ☐ Integration with KFR | | Value flows to RTC |
| **K-CMH (MiFIDPRU 4.11)** | | |
| ☐ CSV upload functional | | Monthly client money data |
| ☐ Daily average calculation | | Correct methodology |
| ☐ Coefficient application | | × 0.4% |
| ☐ Segregated vs non-segregated | | Different treatments |
| ☐ Integration with KFR | | Value flows to RTC |
| **K-ASA (MiFIDPRU 4.11)** | | |
| ☐ CSV upload functional | | Monthly assets data |
| ☐ Daily average calculation | | Correct methodology |
| ☐ Coefficient application | | × 0.04% |
| ☐ Integration with KFR | | Value flows to RTC |
| **K-COH (MiFIDPRU 4.10)** | | |
| ☐ CSV upload functional | | Order flow data |
| ☐ Cash orders calculation | | × 0.1% |
| ☐ Derivative orders calculation | | × 0.01% |
| ☐ Integration with KFR | | Value flows to RTC |
| **K-DTF (MiFIDPRU 4.15)** | | |
| ☐ CSV upload functional | | Daily trading flow data |
| ☐ Dealing on own account | | Correct coefficient |
| ☐ Matched principal | | Correct coefficient |
| ☐ Integration with KFR | | Value flows to RTF |
| **K-NPR (MiFIDPRU 4.8)** | | |
| ☐ Position entry (modal UI) | | Per-position capture |
| ☐ Risk weight calculation | | Asset class specific |
| ☐ Net position aggregation | | Long/short netting |
| ☐ Capital requirement output | | Position risk capital |
| ☐ Integration with KFR | | Value flows to RTM |
| **K-CMG (MiFIDPRU 4.9)** | | |
| ☐ CCP margin entry (modal UI) | | Per-CCP capture |
| ☐ Initial margin treatment | | Correct methodology |
| ☐ Default fund contributions | | Included in calculation |
| ☐ Integration with KFR | | Value flows to RTM |
| **K-TCD (MiFIDPRU 4.11)** | | |
| ☐ Counterparty entry (modal UI) | | Per-counterparty capture |
| ☐ SA-CCR methodology | | Standardised Approach CCR |
| ☐ Exposure at default | | EAD calculation |
| ☐ CVA adjustment | | Credit valuation |
| ☐ Integration with KFR | | Value flows to RTM |
| **K-CON (MiFIDPRU 4.14)** | | |
| ☐ Exposure entry (modal UI) | | Large exposures capture |
| ☐ Own Funds import | | From Financial Data |
| ☐ 25% threshold calculation | | Auto-calculated |
| ☐ Excess exposure identification | | Above threshold flagging |
| ☐ Capital requirement | | Excess × risk weight |
| ☐ Integration with KFR | | Value flows to RTF |

### Integration Requirements

| Integration | Status | Criteria |
|-------------|--------|----------|
| ☐ Firm Data → KFR | | K-factor applicability flows |
| ☐ Firm Data → OFAR | | PMR determination flows |
| ☐ Financial Data → K-CON | | Own Funds for 25% threshold |
| ☐ Financial Data → Wind-Down | | Liquid resources validation |
| ☐ Financial Data → OFAR | | Own Funds for headroom |
| ☐ FOR → OFAR | | FOR value auto-imports |
| ☐ KFR → OFAR | | KFR total auto-imports |
| ☐ Risk Assessment → OFAR | | Risk add-ons auto-import |
| ☐ Wind-Down → OFAR | | WDA capital auto-imports |
| ☐ Stress Testing → OFAR | | Stress results auto-import |
| ☐ All calculators → Historical DB | | Versioning and audit trail |

### Output Requirements

| Output | Status | Criteria |
|--------|--------|----------|
| **ICARA Document** | | |
| ☐ Document generation | | Complete ICARA output |
| ☐ All sections populated | | From calculator data |
| ☐ Narrative sections | | Editable commentary |
| ☐ Calculation appendices | | Detailed workings |
| **Export Functionality** | | |
| ☐ PDF export | | Professional formatting |
| ☐ Visual charts included | | MCR breakdown, trends |
| ☐ Metrics summary | | Key figures highlighted |
| ☐ Audit-ready format | | Clear, traceable |
| **Dashboards & Visualisations** | | |
| ☐ MCR summary dashboard | | Real-time view |
| ☐ Component breakdown chart | | PMR/FOR/KFR/OFTR |
| ☐ Headroom indicator | | Capital adequacy visual |
| ☐ Trend charts | | Historical MCR evolution |
| ☐ Binding constraint display | | What's driving MCR |

### Operational System Requirements

| Requirement | Status | Criteria |
|-------------|--------|----------|
| ☐ Daily usability | | Not just annual compliance |
| ☐ Real-time updates | | Calculations update on input change |
| ☐ Multi-user access | | Admin, SMF owner, contributors |
| ☐ Audit trail | | All changes logged |
| ☐ Data validation | | Input checking, error prevention |
| ☐ Session persistence | | Work saved automatically |

---

## Explicitly OUT of Scope for V1

The following are **not** part of V1:

| Feature | Reason | Target Version |
|---------|--------|----------------|
| Direct FCA RegData integration | Requires FCA cooperation | V2+ |
| Real-time trading system APIs | Complexity, V1 focus on ICARA | V2 |
| Cross-firm benchmarking | Requires data accumulation | V2+ |
| Mobile application | Desktop-first for CFO use | V2+ |
| White-label for consultants | After core product proven | V1.5 |
| AI-driven recommendations | After data patterns emerge | V2+ |

---

## Quality Standards

### Accuracy

> "It has to be precise and flawlessly accurate."

- All regulatory calculations must match manual calculation within £1
- Formulas must exactly match MiFIDPRU specifications
- No estimation or approximation in regulatory figures

### Reliability

- No data loss under any circumstances
- Versioning preserves all historical calculations
- Graceful handling of missing data

### Performance

- Calculations complete in under 2 seconds
- Page loads under 1 second
- PDF generation under 10 seconds

### Security

- organizationId-based data isolation (multi-tenancy)
- No cross-tenant data leakage
- Audit logging of all data access

---

## Acceptance Criteria

V1 is **DONE** when:

1. **All checkboxes above are checked** - every component functional
2. **End-to-end test passes** - CFO can complete full ICARA process
3. **Accuracy validated** - calculations match manual validation
4. **ICARA document generated** - complete, professional, correct
5. **Founder's own firms use it** - real-world proof of concept
6. **No critical bugs** - stable for daily use

---

## Progress Tracking

| Category | Total Items | Complete | % |
|----------|-------------|----------|---|
| Foundational Data | | | |
| Core Calculators | | | |
| K-Factor Calculators | | | |
| Integration | | | |
| Output | | | |
| Operational | | | |
| **TOTAL** | | | |

*Update this table as components are completed.*

---

## Document Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-29 | 1.0 | Initial creation |

---

**End of Specification**
