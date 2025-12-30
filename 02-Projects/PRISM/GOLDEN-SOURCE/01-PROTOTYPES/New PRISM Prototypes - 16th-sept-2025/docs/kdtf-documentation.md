# K-DTF Calculator User Documentation

## Version 1.0 | MIFIDPRU Compliant

---

## Table of Contents

1. [Overview](#overview)
2. [Regulatory Context](#regulatory-context)
3. [Calculation Methodology](#calculation-methodology)
4. [Using the Calculator](#using-the-calculator)
5. [Using the Test Data Generator](#using-the-test-data-generator)
6. [Data Requirements](#data-requirements)
7. [Interpreting Results](#interpreting-results)
8. [Best Practices](#best-practices)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [Technical Appendix](#technical-appendix)

---

## Overview

The K-DTF Calculator is a regulatory capital calculation tool designed to compute the K-factor requirement for Daily Trading Flow (K-DTF) under the UK's Investment Firms Prudential Regime (IFPR).

### What is K-DTF?

K-DTF represents the capital requirement for firms dealing on own account or executing orders in their own name. It captures the risk from proprietary trading and matched principal activities where the firm acts as principal rather than agent.

### Key Distinction: K-DTF vs K-COH

- **K-DTF**: Firm is principal/counterparty (own account trading)
- **K-COH**: Firm is agent (client order execution)
- **Mutual Exclusivity**: A transaction is either DTF or COH, never both
- **Same Coefficients**: Both use 0.1% for cash, 0.01% for derivatives

### Who Needs This?

- Proprietary trading firms
- Market makers
- Matched principal brokers
- Firms dealing on own account
- Systematic internalisers

---

## Regulatory Context

### ICARA Process Framework

K-DTF completes the K-Factor Requirements (KFR) suite:

```
ICARA Process
    ├── Own Funds Requirements
    │   ├── Permanent Minimum Capital (PMR)
    │   ├── Fixed Overheads Requirement (FOR)
    │   └── K-Factor Requirements (KFR)
    │       ├── K-AUM (Assets Under Management)
    │       ├── K-ASA (Assets Safeguarded & Administered)
    │       ├── K-CMH (Client Money Held)
    │       ├── K-COH (Client Orders Handled)
    │       ├── K-DTF (Daily Trading Flow) ← You are here
    │       └── [Other K-factors: NPR, TCD, CON]
    └── Overall Financial Adequacy Rule (OFAR)
```

### Regulatory References

- **Primary Rule**: MIFIDPRU 4.14
- **Cash Coefficient**: 0.1% (10 basis points)
- **Derivatives Coefficient**: 0.01% (1 basis point)
- **Calculation Period**: 6-month observation, 3-month exclusion
- **Application**: Daily gross trading flow (purchases + sales)

### What Counts as DTF?

**Included:**
- ✅ Proprietary trading positions
- ✅ Market making activities
- ✅ Matched principal trades
- ✅ Own account dealing
- ✅ Both purchases AND sales (gross basis)

**Excluded:**
- ❌ Agency trades (these are K-COH)
- ❌ Pure client facilitation
- ❌ Securities financing transactions
- ❌ Positions held for investment

### Trading Flow Calculation

DTF = Daily Purchases + Daily Sales (Gross)

Example:
- Buy £10M bonds, Sell £8M bonds same day
- DTF = £10M + £8M = £18M
- NOT net position of £2M

---

## Calculation Methodology

### Formula

```
K-DTF = K-DTF(Cash) + K-DTF(Derivatives)

Where:
- K-DTF(Cash) = Average Cash DTF × 0.1%
- K-DTF(Deriv) = Average Derivatives DTF × 0.01%
- Averages based on months 4-6 prior (3-month exclusion)
```

### Step-by-Step Process

1. **Daily Recording**: Total purchases + sales when dealing on own account
2. **Asset Classification**: Separate cash instruments from derivatives
3. **6-Month Window**: Take preceding 6 months of daily values
4. **3-Month Exclusion**: Remove most recent 3 months
5. **Average Calculation**: Mean of remaining 3 months (months 4-6)
6. **Apply Coefficients**: 0.1% to cash, 0.01% to derivatives
7. **Sum Components**: Total K-DTF requirement

### Visual Timeline

```
[Month 6] → [Month 5] → [Month 4] → [Month 3] → [Month 2] → [Month 1] → [Today]
    ↑           ↑           ↑           ✗           ✗           ✗
    └───────────────────────┘
         AVERAGING PERIOD              EXCLUDED PERIOD
```

### Coefficient Impact Comparison

| Instrument Type | Daily Flow | Coefficient | K-DTF Impact |
|----------------|------------|-------------|--------------|
| Cash Equities | £100M | 0.1% | £100,000 |
| FX Spot | £100M | 0.1% | £100,000 |
| Listed Derivatives | £100M | 0.01% | £10,000 |
| OTC Derivatives | £100M | 0.01% | £10,000 |

The 10x difference makes instrument mix critical for capital planning.

---

## Using the Calculator

### Step 1: Prepare Your Data

Create a CSV file with daily trading flow:
- **Date**: Business day (format: dd.mm.yyyy)
- **Cash_DTF**: Total cash instrument flow
- **Derivatives_DTF**: Total derivatives flow

Example CSV structure:
```csv
Date,Cash_DTF,Derivatives_DTF
01.01.2024,25000000,75000000
02.01.2024,30000000,80000000
03.01.2024,20000000,70000000
```

### Step 2: Load Data

1. Click "Choose File" and select your CSV
2. Verify file name appears
3. Check debug panel for parsing confirmation

### Step 3: Configure Parameters

- **Reporting Currency**: Select your reporting currency
- **Own Funds**: Enter total own funds for headroom analysis

### Step 4: Calculate

Click "Calculate K-DTF" to process. The calculator will:
- Parse and validate data
- Apply 6-month window with 3-month exclusion
- Calculate separate requirements for cash/derivatives
- Generate comprehensive analytics

### Step 5: Review Results

The calculator provides:
- **Cash K-DTF**: Requirement at 0.1%
- **Derivatives K-DTF**: Requirement at 0.01%
- **Total K-DTF**: Combined requirement
- **Peak Trading Day**: Highest daily flow
- **DTF Mix**: Cash vs derivatives split
- **Visual Analytics**: Trends and breakdowns

---

## Using the Test Data Generator

### Purpose

Generate realistic trading flow data for:
- Testing calculator functionality
- Scenario planning
- Stress testing
- Training purposes

### Quick Scenarios

#### Market Maker
- **Profile**: Two-way quotes, balanced flow
- **Characteristics**: High volume, low directional risk
- **Patterns**: Consistent daily flow, volatility clustering

#### Prop Trading Desk
- **Profile**: Directional positions
- **Characteristics**: Variable volume, position building/unwinding
- **Patterns**: Risk-on/risk-off cycles, earnings plays

#### Matched Principal
- **Profile**: Back-to-back client trades
- **Characteristics**: Client-driven volumes
- **Patterns**: Follows client activity patterns

#### Hybrid Dealer
- **Profile**: Mix of prop and facilitation
- **Characteristics**: Complex flow patterns
- **Patterns**: Varied by strategy and market conditions

### Configuration Options

#### Volume Parameters
- **Base Cash DTF**: Daily cash instrument flow
- **Base Derivatives DTF**: Daily derivatives flow
- **Daily Volatility**: Day-to-day variation (5-100%)
- **Directional Bias**: Trend in position taking

#### Market Patterns
- **Volatility Regimes**: High/low vol periods
- **Risk Cycles**: Risk-on/risk-off periods
- **Month-end**: Rebalancing effects
- **Earnings Season**: Quarterly spikes
- **Flash Events**: Market disruption scenarios
- **Regulatory Events**: Trading restrictions

### Trading Style Adjustments

1. **Market Making**: Lower volatility, balanced flow
2. **Directional**: Higher volatility, trending
3. **Arbitrage**: Burst patterns when opportunities arise
4. **Matched Principal**: Client-pattern following

---

## Data Requirements

### Mandatory Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| Date | Business day | dd.mm.yyyy | 15.09.2024 |
| Cash_DTF | Cash instruments flow | Numeric | 25000000 |
| Derivatives_DTF | Derivatives flow | Numeric | 75000000 |

### Data Quality Checklist

✓ **Gross Basis**: Purchases + Sales, not net positions  
✓ **Daily Values**: End-of-day totals  
✓ **Complete Series**: No gaps in business days  
✓ **Consistent Classification**: Same instrument mapping throughout  
✓ **Currency Consistency**: Single currency per file  

### Classification Guidelines

#### Cash Instruments (0.1%)
- Equities (spot)
- Bonds
- FX spot
- Commodities (physical)
- Money market instruments

#### Derivatives (0.01%)
- Listed futures
- Listed options
- OTC derivatives
- FX forwards
- Swaps
- CFDs

### Common Classification Issues

1. **FX Spot vs Forward**: Spot = cash, Forward = derivative
2. **ETFs**: Generally cash unless synthetic
3. **Structured Products**: Check underlying for classification
4. **Repos**: Typically excluded (securities financing)

---

## Interpreting Results

### Primary Metrics

#### K-DTF Components
- **Cash K-DTF**: Capital for cash instrument trading
- **Derivatives K-DTF**: Capital for derivatives trading
- **Total K-DTF**: Sum of both components

#### Flow Analysis
- **Average Cash DTF**: Daily average over calculation period
- **Average Derivatives DTF**: Daily average over calculation period
- **DTF Mix**: Percentage split between cash and derivatives
- **Peak Trading Day**: Maximum single day flow

#### Capital Metrics
- **Headroom**: Own Funds minus K-DTF
- **Headroom Ratio**: Available capital percentage
- **Capital Efficiency**: Impact of instrument mix

### Visual Analytics

#### Trend Chart
- **Pink line**: Cash DTF daily values
- **Red line**: Derivatives DTF daily values
- **Use for**: Identifying patterns, volatility clusters

#### Breakdown Chart
- **Horizontal bars**: K-DTF by instrument type
- **Shows**: Relative capital impact
- **Use for**: Understanding capital drivers

### Strategic Insights

The 10x coefficient difference (0.1% vs 0.01%) creates opportunities:
- Shifting to derivatives can reduce K-DTF by 90%
- But consider other risks (market, counterparty)
- Balance K-DTF efficiency with overall risk profile

---

## Best Practices

### Operational Excellence

1. **Accurate Classification**: Maintain clear instrument taxonomy
2. **Daily Reconciliation**: Match to trading systems
3. **Gross Calculation**: Never net purchases against sales
4. **Documentation**: Clear audit trail for DTF vs COH decisions

### Risk Management

1. **Monitor Peaks**: Track maximum daily exposures
2. **Volatility Analysis**: Understand flow patterns
3. **Instrument Mix**: Optimize cash/derivatives split
4. **Stress Testing**: Model extreme trading days

### Regulatory Compliance

1. **Clear Segregation**: DTF vs COH must be distinct
2. **Consistent Methodology**: Document classification rules
3. **Regular Updates**: Monthly K-DTF recalculation
4. **ICARA Integration**: Include in capital planning

### Capital Optimization

1. **Instrument Strategy**: Consider capital impact in product mix
2. **Netting Efficiency**: Maximize within-day netting where possible
3. **Flow Management**: Smooth peaks where feasible
4. **Derivatives Migration**: Evaluate cash-to-derivatives shifts

---

## Common Issues & Solutions

### Issue: "Date column not found"
**Solution**: Ensure CSV header includes "Date" column

### Issue: Distinguishing DTF from COH
**Solution**: DTF = principal risk, COH = agency/riskless principal

### Issue: Classification uncertainty
**Solution**: Document classification policy and apply consistently

### Issue: Weekend/holiday data
**Solution**: Include only business days with actual trading

### Issue: Very high K-DTF
**Solution**: Review instrument mix; consider derivatives for efficiency

### Issue: Flash crash/exceptional days
**Solution**: Include in data; these events are part of the risk

---

## Technical Appendix

### CSV Specifications

- **Encoding**: UTF-8 (with or without BOM)
- **Delimiters**: Comma, semicolon, or tab
- **Line Endings**: Windows (CRLF) or Unix (LF)
- **Headers**: Case-insensitive matching
- **File Size**: No practical limit

### Calculation Precision

- **Internal Calculations**: Full floating-point precision
- **Display Rounding**: 2 decimal places
- **Large Numbers**: Automatic K/M/B formatting
- **Percentage Display**: 1 decimal place

### Browser Requirements

- **Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: Required for calculations
- **Screen Resolution**: 1280x720 minimum
- **Memory Usage**: <50MB typical

### Performance Metrics

- **Processing Speed**: <2 seconds typical
- **Maximum Days**: 10,000+ supported
- **Chart Rendering**: Real-time updates
- **CSV Export**: Instant download

### Integration Considerations

For production deployment:
- Direct integration with trading systems
- Real-time DTF tracking
- Automated daily calculations
- Regulatory reporting exports
- Combined K-factor dashboards

---

## Regulatory Disclaimer

This calculator implements K-DTF calculations per MIFIDPRU 4.14 requirements. Users remain responsible for ensuring compliance with all applicable regulations, including proper classification of trading activities between K-DTF and K-COH. The calculator should not replace professional regulatory advice or firm-specific policies. Always verify calculations against current FCA Handbook requirements and maintain appropriate documentation for regulatory review.

---

## Change Log

### Version 1.0 (Current)
- Initial release with full MIFIDPRU 4.14 compliance
- Dual coefficient structure (0.1% cash, 0.01% derivatives)
- 6-month window with 3-month exclusion methodology
- Peak trading day analysis
- Test data generator with trading patterns

---

*Last Updated: September 2024 | MIFIDPRU 4.14 Compliant*