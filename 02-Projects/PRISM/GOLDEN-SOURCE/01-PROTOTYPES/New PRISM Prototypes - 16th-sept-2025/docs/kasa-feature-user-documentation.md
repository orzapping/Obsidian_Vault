# K-ASA Calculator User Documentation

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

The K-ASA Calculator is a specialised regulatory capital calculation tool designed to compute the K-factor requirement for Assets Safeguarded and Administered (K-ASA) under the UK's Investment Firms Prudential Regime (IFPR).

### What is K-ASA?

K-ASA represents the capital requirement for firms that safeguard and administer client assets. It's designed to ensure firms hold sufficient capital to cover potential risks arising from their custody and administration activities.

### Who Needs This?

- Investment firms safeguarding client assets
- Custody service providers
- Wealth management firms with custody permissions
- Any MIFIDPRU investment firm with client assets under administration

---

## Regulatory Context

### ICARA Process Framework

K-ASA forms part of the broader Internal Capital Adequacy and Risk Assessment (ICARA) process:

```
ICARA Process
    ├── Own Funds Requirements
    │   ├── Permanent Minimum Capital (PMR)
    │   ├── Fixed Overheads Requirement (FOR)
    │   └── K-Factor Requirements (KFR)
    │       ├── K-AUM (Assets Under Management)
    │       ├── K-ASA (Assets Safeguarded & Administered) ← You are here
    │       ├── K-CMH (Client Money Held)
    │       ├── K-COH (Client Orders Handled)
    │       └── [Other K-factors as applicable]
    └── Overall Financial Adequacy Rule (OFAR)
```

### Regulatory References

- **Primary Rule**: MIFIDPRU 4.10
- **Coefficient**: 0.04% (4 basis points)
- **Calculation Period**: 6-month observation, 3-month exclusion
- **Application**: Daily values averaged over observation period

### Key Regulatory Points

1. **Gross Calculation**: ASA must be calculated on a gross basis (no netting)
2. **Daily Values**: Based on end-of-business day market values
3. **All Client Assets**: Includes all safeguarded assets regardless of legal structure
4. **Market Value**: Assets must be valued at current market prices

---

## Calculation Methodology

### Formula

```
K-ASA = Average ASA × 0.04%

Where:
- Average ASA = Mean of daily ASA values from months 4-6 prior
- Coefficient = 0.0004 (0.04%)
```

### Step-by-Step Process

1. **Data Collection**: Gather daily ASA values for the past 6 months
2. **Exclusion Period**: Remove the most recent 3 months from calculation
3. **Averaging**: Calculate the arithmetic mean of remaining 3 months (months 4-6)
4. **Coefficient Application**: Multiply average by 0.04%
5. **Result**: K-ASA capital requirement

### Visual Timeline

```
[Month 6] → [Month 5] → [Month 4] → [Month 3] → [Month 2] → [Month 1] → [Today]
    ↑           ↑           ↑           ✗           ✗           ✗
    └───────────────────────┘
         AVERAGING PERIOD              EXCLUDED PERIOD
```

---

## Using the Calculator

### Step 1: Prepare Your Data

Create a CSV file with two columns:
- **Date**: Transaction date (format: dd.mm.yyyy, dd/mm/yyyy, or yyyy-mm-dd)
- **ASA_Value**: Total market value of assets safeguarded and administered

Example CSV structure:
```csv
Date,ASA_Value
01.01.2024,5234567890
02.01.2024,5245678901
03.01.2024,5256789012
```

### Step 2: Load Data

1. Click "Choose File" and select your CSV
2. Verify the file name appears below the input
3. Check the debug panel (if visible) for parsing confirmation

### Step 3: Configure Parameters

- **Reporting Currency**: Select your reporting currency (GBP, USD, EUR, or Other)
- **Own Funds**: Enter your firm's total own funds for headroom analysis

### Step 4: Calculate

Click "Calculate K-ASA" to process your data. The calculator will:
- Parse and validate your data
- Apply the MIFIDPRU methodology
- Generate comprehensive results and visualisations

### Step 5: Review Results

The calculator provides:
- **K-ASA Requirement**: Your capital requirement
- **Average ASA**: The averaged value used in calculation
- **Headroom Analysis**: Available capital above requirement
- **Sensitivity Analysis**: K-ASA at different ASA levels
- **Visual Analytics**: Trends, distributions, and comparisons

---

## Using the Test Data Generator

### Purpose

The Test Data Generator creates realistic ASA data for:
- Testing the calculator functionality
- Training and familiarisation
- Scenario planning and stress testing
- System validation

### Quick Scenarios

#### Custody Giant
- **Profile**: Large established custodian
- **AUA**: £50B+
- **Characteristics**: Stable, low volatility, predictable growth

#### Wealth Manager
- **Profile**: Mid-size wealth management firm
- **AUA**: £5-10B
- **Characteristics**: Market-correlated, moderate volatility, active trading

#### Startup Custodian
- **Profile**: High-growth new entrant
- **AUA**: £100M - £1B
- **Characteristics**: Rapid growth, client acquisition focus

#### Market Stressed
- **Profile**: Stress test scenario
- **AUA**: Variable
- **Characteristics**: High volatility, market crashes, recovery cycles

### Configuration Options

1. **Base AUA**: Starting assets under administration
2. **Volatility**: Daily value fluctuation (0-10%)
3. **Market Correlation**: How closely ASA tracks equity markets (0-100%)
4. **Patterns**:
   - Market trends (bull/bear cycles)
   - Quarter-end effects
   - Client flows
   - Corporate actions
   - Market crash events
   - Seasonal variations

---

## Data Requirements

### Mandatory Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| Date | Business day | dd.mm.yyyy | 15.09.2024 |
| ASA_Value | Total safeguarded assets | Numeric | 5234567890 |

### Data Quality Checklist

✓ **Completeness**: No missing business days (weekends optional)  
✓ **Accuracy**: Values reflect end-of-day market prices  
✓ **Consistency**: Same valuation methodology throughout  
✓ **Currency**: All values in same currency  
✓ **Gross Basis**: No netting or offsets applied  

### Weekend Handling

- **Option 1**: Carry forward Friday values (recommended)
- **Option 2**: Zero values on weekends
- **Option 3**: Include with same values as Friday

---

## Interpreting Results

### Primary Metrics

#### K-ASA Requirement
Your minimum capital requirement for safeguarded assets. This must be covered by own funds.

#### Average ASA
The three-month rolling average used in the calculation. Monitor trends for business planning.

#### Headroom Analysis
- **Absolute Headroom**: Own Funds minus K-ASA (in currency)
- **Headroom Ratio**: Percentage of own funds available after K-ASA
- **Implied Maximum ASA**: Maximum ASA supportable at current own funds

### Visual Analytics

#### Trend Chart
- **Blue line**: Daily ASA values
- **Vertical marker**: Exclusion period boundary
- **Use for**: Identifying trends, volatility, unusual movements

#### Distribution Chart
- **Histogram**: Frequency of ASA values in averaging period
- **Use for**: Understanding value concentration, identifying outliers

#### K-ASA vs Own Funds
- **Doughnut chart**: Visual representation of capital utilisation
- **Use for**: Quick assessment of capital adequacy

### Sensitivity Analysis

Shows K-ASA requirement at different ASA levels:
- **-50%**: Significant business reduction
- **-25%**: Moderate outflows
- **Current**: Actual position
- **+25%**: Moderate growth
- **+50%**: Significant growth
- **+100%**: Doubling of business

---

## Best Practices

### Data Management

1. **Regular Updates**: Run calculations monthly or after significant changes
2. **Data Validation**: Cross-check values against custody records
3. **Version Control**: Maintain historical calculation files
4. **Documentation**: Record any adjustments or assumptions

### Business Planning

1. **Growth Monitoring**: Use sensitivity analysis for capacity planning
2. **Trend Analysis**: Monitor ASA trends for early warning signs
3. **Stress Testing**: Use generator to model adverse scenarios
4. **Capital Planning**: Project K-ASA requirements for budgeting

### Regulatory Compliance

1. **Audit Trail**: Keep all source data and calculations
2. **Methodology Documentation**: Document any firm-specific approaches
3. **Regular Review**: Update calculations as per MIFIDPRU requirements
4. **Board Reporting**: Include K-ASA in ICARA documentation

---

## Common Issues & Solutions

### Issue: "Date column not found"
**Solution**: Ensure your CSV header includes "Date" (case-insensitive)

### Issue: "ASA_Value column not found"
**Solution**: Header must contain "ASA", "Value", or "Amount"

### Issue: Large/unusual values not displaying correctly
**Solution**: Calculator handles values up to trillions; check for data entry errors

### Issue: Weekend data handling
**Solution**: Use "Carry Forward Friday Values" option for most accurate results

### Issue: Negative headroom
**Solution**: K-ASA exceeds own funds; immediate capital planning required

---

## Technical Appendix

### Supported Date Formats

- DD.MM.YYYY (European)
- DD/MM/YYYY (UK)
- DD-MM-YYYY (Alternative)
- YYYY-MM-DD (ISO)

### Value Limits

- **Minimum ASA**: £0
- **Maximum ASA**: £999 trillion (system limit)
- **Precision**: 2 decimal places
- **Display Format**: Automatic (K, M, B, T suffixes)

### Browser Compatibility

- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Required Features**: JavaScript enabled, local file access
- **Screen Resolution**: Minimum 1280x720 recommended

### Performance Specifications

- **Maximum Data Points**: 10,000 days (approximately 27 years)
- **Processing Time**: <2 seconds for typical datasets
- **Memory Usage**: <50MB for standard calculations

### CSV Specifications

- **Encoding**: UTF-8 (with or without BOM)
- **Delimiters**: Comma, semicolon, or tab
- **Line Endings**: Windows (CRLF) or Unix (LF)
- **File Size**: No practical limit

---

## Support & Maintenance

### Version History

- **v1.0** (Current): Initial release with full MIFIDPRU compliance

### Known Limitations

1. Single currency per calculation (no automatic FX conversion)
2. No direct integration with custody systems (manual CSV export required)
3. Browser-based only (no server-side processing)

### Future Enhancements

- Multi-currency support with FX rates
- Direct API integration with custody platforms
- Automated regulatory reporting formats
- Historical K-ASA tracking and comparison

---

## Regulatory Disclaimer

This calculator is provided as a tool to assist with K-ASA calculations under MIFIDPRU. Users remain responsible for ensuring compliance with all applicable regulations. The calculator should not be considered a substitute for professional regulatory advice. Always verify calculations against current FCA Handbook requirements.

---

## Contact & Feedback

For technical issues, feature requests, or regulatory questions, consult your compliance team or regulatory advisor. This calculator is designed to support, not replace, professional judgment in regulatory capital management.

---

*Last Updated: September 2024 | MIFIDPRU 4.10 Compliant*