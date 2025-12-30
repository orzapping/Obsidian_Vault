# ICARA Process Map

> **Purpose**: Step-by-step ICARA process flow. Quick reference for what happens when.
> **Full Detail**: See `02-Projects/PRISM/REGULATORY/ICARA-MIFIDPRU-GUIDE.md`

---

## The ICARA Process Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ICARA PROCESS FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  STEP 1: FOUNDATIONAL DATA                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Firm Data: Regulatory profile, permissions, firm type         │   │
│  │ • Financial Data: Balance sheet, own funds, liquidity           │   │
│  │ • K-Factor Applicability: Which K-factors apply to this firm?   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  STEP 2: COMPONENT CALCULATIONS (parallel)                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │     FOR     │  │     KFR     │  │    RISK ASSESSMENT      │  │   │
│  │  │  Calculator │  │  Calculator │  │   (Risk Register)       │  │   │
│  │  │             │  │             │  │                         │  │   │
│  │  │ 25% of      │  │ 9 K-factors │  │ Identify risks          │  │   │
│  │  │ annual      │  │ RTM+RTC+RTF │  │ Score gross/net         │  │   │
│  │  │ fixed costs │  │             │  │ Map controls            │  │   │
│  │  └─────────────┘  └─────────────┘  │ Calculate capital       │  │   │
│  │                                     └─────────────────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────────────────────────────────┐   │   │
│  │  │  WIND-DOWN  │  │           STRESS TESTING                │   │   │
│  │  │  Assessment │  │                                         │   │   │
│  │  │             │  │  ┌─────────────┐  ┌─────────────────┐   │   │   │
│  │  │ Critical    │  │  │   LINEAR    │  │    REVERSE      │   │   │   │
│  │  │ activities  │  │  │   STRESS    │  │    STRESS       │   │   │   │
│  │  │ Timeline    │  │  │             │  │                 │   │   │   │
│  │  │ Costs       │  │  │ Impact of   │  │ What breaks     │   │   │   │
│  │  │ Resources   │  │  │ adverse     │  │ the firm?       │   │   │   │
│  │  │             │  │  │ scenarios   │  │                 │   │   │   │
│  │  └─────────────┘  │  └─────────────┘  └─────────────────┘   │   │   │
│  │                    └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  STEP 3: AGGREGATION (OFAR)                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │   OFR = max(PMR, FOR, KFR)                                      │   │
│  │                                                                  │   │
│  │   OFTR = Wind-Down + Stress Impacts + Risk Add-ons              │   │
│  │                                                                  │   │
│  │   MCR = max(OFR, OFTR)                                          │   │
│  │                                                                  │   │
│  │   Headroom = Own Funds - MCR                                    │   │
│  │                                                                  │   │
│  │   Binding Constraint = Which component drives MCR?              │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  STEP 4: OUTPUT & REPORTING                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • ICARA Document generation                                      │   │
│  │ • Regulatory reports (MIF001, MIF002, etc.)                     │   │
│  │ • Board reporting                                                │   │
│  │ • PDF export                                                     │   │
│  │ • Ongoing monitoring dashboard                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Reporting Calendar

| Frequency | Activity |
|-----------|----------|
| **Daily** | Capital monitoring, dashboard review |
| **Monthly** | Board metrics, trend analysis |
| **Quarterly** | Regulatory submissions (MIF001, etc.) |
| **Bi-annually** | Deep ICARA review |
| **Annually** | Full ICARA refresh, stress test cycles |
| **Trigger Events** | Material changes, significant transactions |

---

## ICARA as Living Document

**The regulation requires**:
- Continuous updating (not just annual)
- Integration into business-as-usual operations
- Board-level oversight and review
- Immediate recalculation when inputs change

**What this means for PRISM**:
- Real-time calculations (no "Calculate" button philosophy)
- Dashboard for daily monitoring
- Historical tracking for trend analysis
- Alerts when thresholds approached

---

## Key Decision Points in ICARA

1. **K-Factor Applicability**: Which K-factors apply based on permissions?
2. **Stress Scenarios**: Which scenarios to test?
3. **Wind-Down Timeline**: How long would orderly wind-down take?
4. **Risk Identification**: What are the material risks?
5. **Capital Allocation**: How much capital for each risk?
6. **Binding Constraint**: What's driving the MCR?

---

## PRISM Module Mapping

| ICARA Step | PRISM Module |
|------------|--------------|
| Firm profile | Firm Data |
| Own funds | Financial Data |
| FOR calculation | FOR Calculator |
| K-factor calculation | KFR Calculator (+ 9 K-factor modules) |
| Risk identification | Risk Assessment |
| Wind-down planning | Wind-Down Assessment |
| Stress testing | Stress Testing |
| Aggregation | OFAR Calculator |
| Reporting | Regulatory Reporting |

---

**For implementation details, see project CLAUDE.md and V1-SHIP-SPECIFICATION.md**
