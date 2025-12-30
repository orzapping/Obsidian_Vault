# K-CMH Calculator User Documentation

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

The K-CMH Calculator is a regulatory capital calculation tool designed to compute the K-factor requirement for Client Money Held (K-CMH) under the UK's Investment Firms Prudential Regime (IFPR).

### What is K-CMH?

K-CMH represents the capital requirement for firms holding client money. It ensures firms maintain adequate capital relative to their client money obligations, with differentiated coefficients based on segregation compliance.

### Key Features

- **Dual Coefficient Structure**: Different rates for segregated vs non-segregated
- **CASS Compliance Recognition**: Lower coefficient for properly segregated funds
- **Efficiency Analysis**: Shows capital savings from improved segregation
- **Same methodology as K-ASA/K-COH**: 6-month window, 3-month exclusion

### Who Needs This?

- Investment firms holding client money
- Brokers with client cash accounts
- Payment service providers
- Any MIFIDPRU firm with client money obligations

---

## Regulatory Context

### ICARA Process Framework

K-CMH sits within the K-Factor Requirements (KFR) component:

```
ICARA Process
    ├── Own Funds Requirements
    │   ├── Permanent Minimum Capital (PMR)
    │   ├── Fixed Overheads Requirement (FOR)
    │   └── K-Factor Requirements (KFR)
    │       ├── K-AUM (Assets Under Management)
    │       ├── K-ASA (Assets Safeguarded & Administered)
    │       ├── K-CMH (Client Money Held) ← You are here
    │       ├── K-COH (Client Orders Handled)
    │       └── [Other K-factors as applicable]
    └── Overall Financial Adequacy Rule (OFAR)
```

### Regulatory References

- **Primary Rule**: MIFIDPRU 4.11
- **Segregated Coefficient**: 0.4% (40 basis points)
- **Non-Segregated Coefficient**: 0.5% (50 basis points)
- **Calculation Period**: 6-month observation, 3-month exclusion
- **Application**: Daily end-of-business values

### CASS Rules & Segregation

**Segregated (0.4% coefficient):**
- Held in accordance with CASS 7 rules
- Client bank accounts properly designated
- Trust status established
- Daily reconciliations performed
- Client money properly identified

**Non-Segregated (0.5% coefficient):**
- Any other client money arrangements
- Operational float accounts
- In-transit balances
- Pre-segregation receipts
- Mixed use accounts

### Capital Incentive Structure

The 0.1% coefficient differential (0.5% - 0.4%) creates a direct capital incentive for proper segregation:
- £100M non-segregated = £500K K-CMH
- £100M segregated = £400K K-CMH
- **Savings from segregation = £100K**

---

## Calculation Methodology

### Formula

```
K-CMH = K-CMH(Segregated) + K-CMH(Non-Segregated)

Where:
- K-CMH(Seg) = Average Segregated CMH × 0.4%
- K-CMH(Non-Seg) = Average Non-Segregated CMH × 0.5%
- Averages based on months 4-6 prior (3-month exclusion)
```

### Step-by-Step Process

1. **Daily Recording**: Capture end-of-day client money balances
2. **Segregation Split**: Separate segregated from non-segregated
3. **6-Month Window**: Take preceding 6 months of daily values
4. **3-Month Exclusion**: Remove most recent 3 months
5. **Average Calculation**: Mean of remaining 3 months (months 4-6)
6. **Apply Coefficients**: 0.4% to segregated, 0.5% to non-segregated
7. **Sum Components**: Total K-CMH requirement

### Visual Timeline

```
[Month 6] → [Month 5] → [Month 4] → [Month 3] → [Month 2] → [Month 1] → [Today]
    ↑           ↑           ↑           ✗           ✗           ✗
    └───────────────────────┘
         AVERAGING PERIOD              EXCLUDED PERIOD
```

### Coefficient Comparison

| Type | Coefficient | On £10M Average | K-CMH Requirement |
|------|------------|-----------------|-------------------|
| Segregated | 0.4% | £10,000,000 | £40,000 |
| Non-Segregated | 0.5% | £10,000,000 | £50,000 |
| **Difference** | **0.1%** | - | **£10,000** |

---

## Using the Calculator

### Step 1: Prepare Your Data

Create a CSV file with daily client money data:
- **Date**: Business day (format: dd.mm.yyyy)
- **Segregated_CMH**: CASS 7 compliant balances
- **Non_Segregated_CMH**: Other client money

Example CSV structure:
```csv
Date,Segregated_CMH,Non_Segregated_CMH
01.01.2024,8500000,1500000
02.01.2024,8600000,1400000
03.01.2024,8700000,1300000
```

### Step 2: Load Data

1. Click "Choose File" and select your CSV
2. Verify file name appears
3. Check debug panel for parsing confirmation

### Step 3: Configure Parameters

- **Reporting Currency**: Select your reporting currency
- **Own Funds**: Enter total own funds for headroom analysis

### Step 4: Calculate

Click "Calculate K-CMH" to process. The calculator will:
- Parse and validate data
- Apply 6-month window with 3-month exclusion
- Calculate separate requirements for seg/non-seg
- Generate comprehensive analytics

### Step 5: Review Results

The calculator provides:
- **Segregated K-CMH**: Requirement at 0.4%
- **Non-Segregated K-CMH**: Requirement at 0.5%
- **Total K-CMH**: Combined requirement
- **Efficiency Analysis**: Capital saved through segregation
- **Visual Analytics**: Trends and composition breakdowns

---

## Using the Test Data Generator

### Purpose

Generate realistic client money data for:
- Testing calculator functionality
- Training and familiarisation
- Scenario planning
- Regulatory stress testing

### Quick Scenarios

#### Retail Broker (90% Segregated)
- **Profile**: Retail trading platform
- **Patterns**: T+2 settlement, trading volatility
- **Characteristics**: High CASS compliance, daily fluctuations

#### Prime Broker (50% Segregated)
- **Profile**: Institutional services
- **Patterns**: Margin lending, securities financing
- **Characteristics**: Mixed model, complex flows

#### Payment Firm (20% Segregated)
- **Profile**: Payment services provider
- **Patterns**: High volume, rapid turnover
- **Characteristics**: Mostly operational float

#### Wealth Platform (95% Segregated)
- **Profile**: Long-term investment platform
- **Patterns**: Stable balances, monthly fees
- **Characteristics**: Minimal daily movement

### Configuration Options

#### Base Parameters
- **Base Daily CMH**: Starting client money level
- **Segregation Ratio**: Percentage properly segregated
- **Daily Volatility**: Day-to-day fluctuation
- **Intraday Peak Factor**: Peak vs end-of-day ratio

#### Trading Patterns
- **T+2 Settlement**: Realistic settlement cycles
- **Month-end Sweeps**: Client balance management
- **Margin Calls**: Non-seg volatility spikes
- **Dividends**: Corporate action impacts
- **Large Movements**: Significant client flows
- **Segregation Migration**: Regulatory improvements

### Realistic Features

1. **Settlement Queue**: Models T+2 settlement lag
2. **Intraday Peaks**: End-of-day typically lower than peak
3. **Weekend Handling**: Various activity patterns
4. **Regulatory Evolution**: Gradual segregation improvements

---

## Data Requirements

### Mandatory Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| Date | Business day | dd.mm.yyyy | 15.09.2024 |
| Segregated_CMH | CASS 7 compliant | Numeric | 8500000 |
| Non_Segregated_CMH | Other client money | Numeric | 1500000 |

### Data Quality Checklist

✓ **Daily Values**: End-of-business day positions  
✓ **Complete Series**: No gaps in business days  
✓ **Segregation Accuracy**: Proper classification  
✓ **Reconciliation**: Matches CASS records  
✓ **Currency Consistency**: Single currency throughout  

### Important Considerations

#### Intraday vs End-of-Day
- K-CMH uses end-of-day values
- Intraday peaks don't affect calculation
- Important for operational monitoring separately

#### Weekend Treatment
- Option 1: Zero balances (no activity)
- Option 2: Carry forward Friday values
- Option 3: Actual weekend balances if applicable

#### Segregation Classification
- Review account structures regularly
- Document segregation decisions
- Monitor for classification changes

---

## Interpreting Results

### Primary Metrics

#### K-CMH Components
- **Segregated K-CMH**: Capital for CASS compliant money
- **Non-Segregated K-CMH**: Capital for other client money
- **Total K-CMH**: Sum of both components

#### Efficiency Metrics
- **Segregation Ratio**: Percentage properly segregated
- **Capital Efficiency**: Savings from segregation
- **Optimization Potential**: Additional savings available

#### Risk Indicators
- **Headroom**: Own Funds minus K-CMH
- **Headroom Ratio**: Percentage buffer
- **Utilisation**: K-CMH as percentage of own funds

### Visual Analytics

#### Trend Chart
- **Orange line**: Segregated CMH daily values
- **Red line**: Non-segregated CMH daily values
- **Use for**: Identifying patterns, anomalies

#### Breakdown Chart
- **Horizontal bars**: K-CMH by type
- **Shows**: Relative contribution to total
- **Use for**: Understanding capital drivers

#### Composition Chart
- **Doughnut chart**: Segregation split
- **Shows**: Current segregation performance
- **Use for**: Quick segregation assessment

### Optimization Opportunities

The calculator highlights when segregation improvements could reduce K-CMH:
- Calculates potential savings
- Shows impact of moving non-seg to seg
- Quantifies regulatory capital benefit

---

## Best Practices

### Operational Excellence

1. **Daily Reconciliation**: Match to CASS records
2. **Segregation Review**: Regular classification checks
3. **Documentation**: Clear audit trail for segregation decisions
4. **System Integration**: Automate data capture

### Regulatory Compliance

1. **CASS Alignment**: Ensure K-CMH matches CASS reporting
2. **Evidence Trail**: Document segregation status
3. **Regular Updates**: Monthly K-CMH recalculation
4. **Board Reporting**: Include in ICARA documentation

### Capital Optimization

1. **Segregation Strategy**: Maximize CASS compliance
2. **Cost-Benefit Analysis**: Weigh operational costs vs capital savings
3. **Continuous Improvement**: Track segregation ratio trends
4. **Benchmarking**: Compare with industry standards

### Risk Management

1. **Concentration Risk**: Monitor large client exposures
2. **Operational Risk**: Track segregation breaches
3. **Liquidity Planning**: Consider client money obligations
4. **Stress Testing**: Model client money outflows

---

## Common Issues & Solutions

### Issue: "Date column not found"
**Solution**: Ensure CSV header includes "Date" column

### Issue: Different segregation classifications
**Solution**: Map your internal classifications to seg/non-seg binary

### Issue: Intraday peaks affecting calculations
**Solution**: K-CMH uses end-of-day only; track peaks separately for liquidity

### Issue: Weekend data handling
**Solution**: Choose consistent approach; document in policies

### Issue: Segregation ratio declining
**Solution**: Review operational processes; consider automation

### Issue: High non-segregated balances
**Solution**: Analyze root causes; implement segregation improvements

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
- **Percentage Display**: 1 decimal place for ratios
- **Large Numbers**: Automatic K/M/B formatting

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

### Integration Opportunities

For production deployment:
- Direct integration with CASS systems
- Automated daily data feeds
- Regulatory reporting exports
- Capital monitoring dashboards
- Alert thresholds for segregation ratios

---

## Regulatory Disclaimer

This calculator implements K-CMH calculations per MIFIDPRU 4.11 requirements. Users remain responsible for ensuring compliance with all applicable regulations, including CASS rules for client money segregation. The calculator should not replace professional regulatory advice or firm-specific policies. Always verify calculations against current FCA Handbook requirements and maintain appropriate documentation for regulatory review.

---

## Change Log

### Version 1.0 (Current)
- Initial release with full MIFIDPRU 4.11 compliance
- Dual coefficient structure (0.4% segregated, 0.5% non-segregated)
- 6-month window with 3-month exclusion methodology
- Comprehensive efficiency analysis
- Test data generator with realistic patterns

---

*Last Updated: September 2024 | MIFIDPRU 4.11 Compliant*