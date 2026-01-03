# K-Factor Cheatsheet

> **Purpose**: All 9 K-factors at a glance. Fast lookup for calculations.
> **Full Detail**: See `02-Projects/PRISM/REGULATORY/ICARA-MIFIDPRU-GUIDE.md`

---

## K-Factor Overview

```
KFR = RTM + RTC + RTF

RTM (Risk-to-Market):  K-NPR + K-CMG + K-TCD
RTC (Risk-to-Client):  K-AUM + K-CMH + K-ASA + K-COH
RTF (Risk-to-Firm):    K-DTF + K-CON
```

---

## Risk-to-Client (RTC) K-Factors

### K-AUM - Assets Under Management
| Article | 4.10 |
|---------|------|
| **Applies to** | Discretionary portfolio management |
| **Calculation** | Daily average AUM over 15 months, exclude oldest 3 |
| **Coefficient** | **0.02%** (0.0002) |
| **Formula** | `K-AUM = Average AUM × 0.0002` |
| **Data Source** | Monthly AUM figures (CSV) |

### K-CMH - Client Money Held
| Article | 4.11 |
|---------|------|
| **Applies to** | Holding client money |
| **Calculation** | Daily average over reporting period |
| **Coefficient (segregated)** | **0.4%** (0.004) |
| **Coefficient (non-segregated)** | **0.5%** (0.005) |
| **Formula** | `K-CMH = Average CMH × coefficient` |
| **Data Source** | Daily client money balances (CSV) |

### K-ASA - Assets Safeguarded and Administered
| Article | 4.11 |
|---------|------|
| **Applies to** | Safeguarding/administering client assets |
| **Calculation** | Daily average over reporting period |
| **Coefficient** | **0.04%** (0.0004) |
| **Formula** | `K-ASA = Average ASA × 0.0004` |
| **Data Source** | Daily asset values (CSV) |

### K-COH - Client Orders Handled
| Article | 4.10 |
|---------|------|
| **Applies to** | Receiving/transmitting orders, executing orders |
| **Calculation** | Daily average over reporting period |
| **Coefficient (cash)** | **0.1%** (0.001) |
| **Coefficient (derivatives)** | **0.01%** (0.0001) |
| **Formula** | `K-COH = (Cash orders × 0.001) + (Deriv orders × 0.0001)` |
| **Data Source** | Daily order values (CSV) |

---

## Risk-to-Market (RTM) K-Factors

### K-NPR - Net Position Risk
| Article | 4.8 |
|---------|------|
| **Applies to** | Trading book positions |
| **Calculation** | Position-by-position with risk weights |
| **Method** | Standard approach or internal model |
| **Complexity** | HIGH - requires detailed position data |
| **Data Source** | Individual trading positions (Modal UI) |

### K-CMG - Clearing Member Guarantee
| Article | 4.9 |
|---------|------|
| **Applies to** | Clearing member firms |
| **Calculation** | CCP margin requirements + default fund contributions |
| **Formula** | `K-CMG = Total initial margin posted to CCPs` |
| **Complexity** | MEDIUM - CCP-level data |
| **Data Source** | CCP margin statements (Modal UI) |

### K-TCD - Trading Counterparty Default
| Article | 4.11 |
|---------|------|
| **Applies to** | OTC derivatives, SFTs, long settlement transactions |
| **Calculation** | SA-CCR (Standardised Approach for CCR) |
| **Components** | Replacement cost + Potential future exposure |
| **Complexity** | HIGH - requires SA-CCR methodology |
| **Data Source** | Counterparty exposures (Modal UI) |

---

## Risk-to-Firm (RTF) K-Factors

### K-DTF - Daily Trading Flow
| Article | 4.15 |
|---------|------|
| **Applies to** | Dealing on own account |
| **Calculation** | Daily average trading volume |
| **Coefficient (dealing)** | Varies by instrument |
| **Coefficient (matched principal)** | Lower rate |
| **Formula** | `K-DTF = Average daily flow × coefficient` |
| **Data Source** | Daily trading volumes (CSV) |

### K-CON - Concentration Risk
| Article | 4.14 |
|---------|------|
| **Applies to** | Large exposures |
| **Threshold** | 25% of Own Funds |
| **Calculation** | Capital charge on excess above threshold |
| **Formula** | `K-CON = Σ(Excess exposure × risk weight)` |
| **Complexity** | MEDIUM - requires Own Funds from Financial Data |
| **Data Source** | Large exposures (Modal UI) |

---

## Applicability Quick Check

| Permission | Applicable K-Factors |
|------------|---------------------|
| Discretionary management | K-AUM |
| Holding client money | K-CMH |
| Safeguarding client assets | K-ASA |
| Receiving/transmitting orders | K-COH |
| Executing orders | K-COH |
| Dealing on own account | K-NPR, K-TCD, K-DTF, K-CON |
| Clearing member | K-CMG |

---

## Implementation Notes

**Simple K-Factors** (K-AUM, K-CMH, K-ASA, K-COH, K-DTF):
- CSV upload workflow
- Apply coefficient
- Average calculation

**Complex K-Factors** (K-NPR, K-CMG, K-TCD, K-CON):
- Modal UI for data entry
- Position/counterparty level detail
- More sophisticated calculations

---

**For detailed methodologies, see full regulatory documents.**
