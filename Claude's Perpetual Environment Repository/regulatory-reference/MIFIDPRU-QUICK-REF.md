# MiFIDPRU Quick Reference

> **Purpose**: Fast lookup for regulatory formulae and requirements. For agent consumption.
> **Full Detail**: See `02-Projects/PRISM/REGULATORY/ICARA-MIFIDPRU-GUIDE.md`

---

## Core Formulae

### Minimum Capital Requirement (MCR)
```
MCR = max(OFR, OFTR)
```

### Own Funds Requirement (OFR) - MiFIDPRU 4.3
```
OFR = max(PMR, FOR, KFR)
```

### Own Funds Threshold Requirement (OFTR) - MiFIDPRU 7.4
```
OFTR = Wind-Down Requirement + Stress Impacts + Risk Add-ons
```

### Headroom
```
Headroom = Own Funds - MCR
```
Positive = compliant. Negative = breach.

---

## PMR - Permanent Minimum Requirement (4.4)

| Firm Type | PMR Amount |
|-----------|------------|
| SNI firm (limited activities) | £75,000 |
| Non-SNI, non-dealing | £150,000 |
| Dealing on own account / underwriting | £750,000 |

---

## FOR - Fixed Overhead Requirement (4.5)

```
FOR = (Adjusted Annual Fixed Expenditure / 12) × 3
```

**Adjustments** (items to EXCLUDE from expenditure):
- Staff bonuses
- Profit shares
- Other discretionary payments
- Shared commissions
- Fees/commissions payable to tied agents
- Interest payable to customers
- Non-recurring expenses from non-ordinary activities
- Raw materials costs

---

## KFR - K-Factor Requirement (4.6)

```
KFR = RTM + RTC + RTF
```

### Risk-to-Market (RTM)
```
RTM = K-NPR + K-CMG + K-TCD
```

### Risk-to-Client (RTC)
```
RTC = K-AUM + K-CMH + K-ASA + K-COH
```

### Risk-to-Firm (RTF)
```
RTF = K-DTF + K-CON
```

---

## Article References

| Component | MiFIDPRU Article |
|-----------|------------------|
| PMR | 4.4 |
| FOR | 4.5 |
| KFR | 4.6 |
| K-AUM | 4.10 |
| K-CMH | 4.11 |
| K-ASA | 4.11 |
| K-COH | 4.10 |
| K-DTF | 4.15 |
| K-NPR | 4.8 |
| K-CMG | 4.9 |
| K-TCD | 4.11 |
| K-CON | 4.14 |
| Wind-Down | 7.5 |
| Stress Testing | 7.7 |
| OFTR | 7.4 |
| ICARA | 7.1-7.9 |

---

## Key Regulatory Principles

1. **ICARA is a living document** - Must inform daily operations, not just annual compliance
2. **Capital must be adequate** - Firm must survive stress and wind-down orderly
3. **K-factors are activity-based** - Only applicable K-factors count (determined by permissions)
4. **MCR is the MAXIMUM** - Not a sum; whichever constraint binds

---

**For detailed explanations, see the full regulatory documents.**
