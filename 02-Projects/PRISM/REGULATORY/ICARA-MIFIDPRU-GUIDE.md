# ICARA/MiFIDPRU Comprehensive Guide

> **Purpose**: This document provides the regulatory context for PRISM - the What and Why of ICARA and MiFIDPRU. This is the "skill" content that contextualizes the entire platform.

**Status**: OUTLINE - To be expanded with detailed regulatory content
**Created**: December 29, 2025

---

## Table of Contents

1. [What is MiFIDPRU?](#what-is-mifidpru)
2. [What is ICARA?](#what-is-icara)
3. [The Regulatory Hierarchy](#the-regulatory-hierarchy)
4. [Own Funds Requirement (OFR)](#own-funds-requirement-ofr)
5. [Own Funds Threshold Requirement (OFTR)](#own-funds-threshold-requirement-oftr)
6. [K-Factor Requirements](#k-factor-requirements)
7. [Stress Testing Requirements](#stress-testing-requirements)
8. [The Living Document Requirement](#the-living-document-requirement)
9. [Reporting Periods](#reporting-periods)
10. [Regulatory Source References](#regulatory-source-references)

---

## What is MiFIDPRU?

**MiFIDPRU** = Markets in Financial Instruments Directive - Prudential Requirements

The FCA's prudential regime for investment firms, effective **January 1, 2022**.

**Key Points**:
- Replaced the previous BIPRU/IFPRU regimes
- Applies to all MiFID investment firms in the UK
- Determines how much capital a firm must hold
- Part of the Investment Firms Prudential Regime (IFPR)

**Regulatory Source**: FCA Handbook, MiFIDPRU Section

---

## What is ICARA?

**ICARA** = Internal Capital Adequacy and Risk Assessment

The **process** by which firms:
1. Assess their risks
2. Calculate their capital requirements
3. Demonstrate they have adequate financial resources
4. Plan for stress scenarios and wind-down

**Key Insight**: ICARA is not a document - it's a **living, breathing process** that must inform daily operations.

**Regulatory Source**: MiFIDPRU 7.1 - 7.9

---

## The Regulatory Hierarchy

```
FCA/PRA Statutory Objectives
         │
         ▼
FCA Principles for Business
(Principle 4: Financial Prudence)
         │
         ▼
MiFIDPRU Regulations
         │
    ┌────┴────┐
    │         │
    ▼         ▼
   OFR      OFTR
    │         │
    ▼         ▼
   MCR = max(OFR, OFTR)
```

---

## Own Funds Requirement (OFR)

**MiFIDPRU 4.3**

```
OFR = max(PMR, FOR, KFR)
```

### PMR - Permanent Minimum Requirement (4.4)

| Firm Type | PMR Amount |
|-----------|------------|
| SNI firm (limited activities) | £75,000 |
| Non-SNI, non-dealing | £150,000 |
| Dealing on own account / underwriting | £750,000 |

### FOR - Fixed Overhead Requirement (4.5)

```
FOR = (Adjusted Annual Fixed Expenditure / 12) × 3
```

Represents 3 months of operating costs.

### KFR - K-Factor Requirement (4.6)

```
KFR = RTM + RTC + RTF

Where:
RTM = K-NPR + K-CMG + K-TCD (Risk-to-Market)
RTC = K-AUM + K-CMH + K-ASA + K-COH (Risk-to-Client)
RTF = K-DTF + K-CON (Risk-to-Firm)
```

---

## Own Funds Threshold Requirement (OFTR)

**MiFIDPRU 7.4**

```
OFTR = Wind-Down Requirement + Stress Impacts + Risk Add-ons
```

The OFTR captures:
- Orderly wind-down costs
- Stress scenario impacts
- Additional risks not captured in OFR

---

## K-Factor Requirements

### Risk-to-Market (RTM)

| K-Factor | Article | Description | Calculation |
|----------|---------|-------------|-------------|
| K-NPR | 4.8 | Net Position Risk | Position-by-position with risk weights |
| K-CMG | 4.9 | Clearing Member Guarantee | CCP margins + default fund |
| K-TCD | 4.11 | Trading Counterparty Default | SA-CCR methodology |

### Risk-to-Client (RTC)

| K-Factor | Article | Description | Calculation |
|----------|---------|-------------|-------------|
| K-AUM | 4.10 | Assets Under Management | AUM × 0.02% |
| K-CMH | 4.11 | Client Money Held | CMH × 0.4% |
| K-ASA | 4.11 | Assets Safeguarded | ASA × 0.04% |
| K-COH | 4.10 | Client Orders Handled | Cash × 0.1%, Derivatives × 0.01% |

### Risk-to-Firm (RTF)

| K-Factor | Article | Description | Calculation |
|----------|---------|-------------|-------------|
| K-DTF | 4.15 | Daily Trading Flow | Volume × coefficient |
| K-CON | 4.14 | Concentration Risk | Excess over 25% own funds × risk weight |

---

## Stress Testing Requirements

### Linear Stress Testing

**Purpose**: Assess impact of adverse scenarios on capital position.

**Requirement**: Firms must stress test against:
- Market stress scenarios
- Operational stress scenarios
- Liquidity stress scenarios
- Concentration stress scenarios

**MiFIDPRU Source**: 7.7

### Reverse Stress Testing

**Purpose**: Identify scenarios that would render the firm non-viable.

**Requirement**: Work backwards from failure to identify:
- What events would cause failure
- How likely those events are
- What mitigating actions are available

**MiFIDPRU Source**: 7.7

---

## The Living Document Requirement

> **Critical**: ICARA is NOT an annual exercise. It must be a living, breathing process.

**Regulatory Requirements**:
- Continuously updated, not just at reporting periods
- Used to inform day-to-day business decisions
- Reviewed regularly by senior management
- Integral to business-as-usual operations

**What This Means in Practice**:
- Daily monitoring of capital position
- Real-time metrics for board
- Immediate recalculation when inputs change
- Integration into operational decision-making

**Current Market Reality**: Firms are NOT doing this. Most treat ICARA as annual compliance.

---

## Reporting Periods

| Period | Requirement |
|--------|-------------|
| Daily | Internal monitoring (best practice) |
| Monthly | Board reporting, trend analysis |
| Quarterly | Regulatory submissions (MIF001, etc.) |
| Bi-annually | Deeper ICARA reviews |
| Annually | Full ICARA refresh, stress test cycles |

---

## Regulatory Source References

### FCA Handbook

- **MiFIDPRU 4**: Own funds requirements
- **MiFIDPRU 7**: ICARA and internal capital
- **MiFIDPRU 7.4**: OFTR
- **MiFIDPRU 7.5**: Wind-down planning
- **MiFIDPRU 7.7**: Stress testing and scenario analysis

### External Resources

- FCA Website: https://www.fca.org.uk/firms/investment-firms-prudential-regime
- MiFIDPRU Handbook: https://www.handbook.fca.org.uk/handbook/MIFIDPRU/

---

## TODO: Content to be Added

- [ ] Detailed K-factor calculation methodologies
- [ ] SA-CCR methodology for K-TCD
- [ ] Stress testing scenario specifications
- [ ] Reverse stress testing methodology
- [ ] Wind-down planning requirements
- [ ] Regulatory reporting form specifications
- [ ] Example calculations

---

**This document to be expanded with full regulatory detail.**
