# K-AUM Calculator User Documentation

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

The K-AUM Calculator is a regulatory capital calculation tool designed to compute the K-factor requirement for Assets Under Management (K-AUM) under the UK's Investment Firms Prudential Regime (IFPR).

### What is K-AUM?

K-AUM represents the capital requirement for firms managing client portfolios. It ensures firms hold adequate capital relative to their assets under management, covering operational risks associated with portfolio management activities.

### Key Distinction from Other K-Factors

- **K-AUM**: Monthly values, 15-month average, NO exclusion period
- **K-ASA/K-COH**: Daily values, 6-month window with 3-month exclusion
- **Simplest calculation**: Straightforward averaging without complex exclusions

### Who Needs This?

- Investment firms with MiFID portfolio management permissions
- Discretionary portfolio managers
- Non-discretionary managers with ongoing responsibility
- MIFIDPRU investment firms with managed assets

---

## Regulatory Context

### ICARA Process Framework

K-AUM sits within the K-Factor Requirements (KFR) component of ICARA:

```
ICARA Process
    ├── Own Funds Requirements
    │   ├── Permanent Minimum Capital (PMR)
    │   ├── Fixed Overheads Requirement (FOR)
    │   └── K-Factor Requirements (KFR)
    │       ├── K-AUM (Assets Under Management) ← You are here
    │       ├── K-ASA (Assets Safeguarded & Administered)
    │       ├── K-CMH (Client Money Held)
    │       ├── K-COH (Client Orders Handled)
    │       └── [Other K-factors as applicable]
    └── Overall Financial Adequacy Rule (OFAR)
```

### Regulatory References

- **Primary Rule**: MIFIDPRU 4.7
- **Coefficient**: 0.02% (2 basis points)
- **Calculation Period**: 15-month rolling average
- **Frequency**: Monthly observations only
- **Application**: Month-end valuations

### What Counts as AUM?

Per MIFIDPRU 4.7.3:
- ✅ **Included**:
  - Discretionary portfolio management
  - Non-discretionary with ongoing management
  - Assets managed under delegation
  - All asset classes under management
  
- ❌ **Excluded**:
  - Assets already counted in K-ASA
  - Execution-only services
  - Pure advisory without ongoing management
  - Assets under administration only

### Regulatory Nuances

- **No Double Counting**: Assets cannot be in both K-AUM and K-ASA
- **Delegation**: Include assets you manage for other firms
- **Sub-delegation**: Exclude assets delegated to others
- **New Firms**: Can use shorter period if less than 15 months history (MIFIDPRU 4.7.8)

---

## Calculation Methodology

### Formula

```
K-AUM = Average AUM × 0.02%

Where:
- Average AUM = Arithmetic mean of last 15 monthly values
- Coefficient = 0.0002 (0.02%)
```

### Step-by-Step Process

1. **Month-End Valuation**: Calculate total AUM at each month-end
2. **15-Month Collection**: Gather the most recent 15 monthly values
3. **Simple Average**: Sum all 15 values and divide by 15
4. **Apply Coefficient**: Multiply average by 0.02%
5. **Result**: K-AUM capital requirement

### Comparison with Other K-Factors

| Factor | Data Frequency | Period | Exclusion | Coefficient |
|--------|---------------|---------|-----------|-------------|
| K-AUM | Monthly | 15 months | None | 0.02% |
| K-ASA | Daily | 6 months | 3 months | 0.04% |
| K-COH Cash | Daily | 6 months | 3 months | 0.10% |
| K-COH Deriv | Daily | 6 months | 3 months | 0.01% |

### Visual Timeline

```
M-15  M-14  M-13  M-12  M-11  M-10  M-9  M-8  M-7  M-6  M-5  M-4  M-3  M-2  M-1
 ↓     ↓     ↓     ↓     ↓     ↓     ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓
 └─────────────────────── ALL 15 MONTHS INCLUDED ─────────────────────────────┘
                          No exclusion period for K-AUM
```

---

## Using the Calculator

### Step 1: Prepare Your Data

Create a CSV file with monthly AUM data:
- **Month**: Period identifier (format: YYYY-MM or MM/YYYY)
- **AUM_Value**: Total assets under management at month-end

Example CSV structure:
```csv
Month,AUM_Value
2023-01,5234567890
2023-02,5345678901
2023-03,5456789012
2023-04,5567890123
...
```

### Step 2: Load Data

1. Click "Choose File" and select your CSV
2. Verify the file name appears
3. Check debug panel confirms successful parsing

### Step 3: Configure Parameters

- **Reporting Currency**: Select your reporting currency
- **Own Funds**: Enter total own funds for headroom analysis

### Step 4: Calculate

Click "Calculate K-AUM" to process. The calculator will:
- Validate data completeness
- Apply 15-month averaging
- Calculate K-AUM requirement
- Generate comprehensive analytics

### Step 5: Review Results

The calculator provides:
- **K-AUM Requirement**: Your capital requirement
- **Average AUM**: 15-month average used
- **Headroom Analysis**: Capital buffer assessment
- **Monthly Breakdown**: Table with month-on-month changes
- **Visual Analytics**: Trends, growth patterns, utilisation

---

## Using the Test Data Generator

### Purpose

Generate realistic monthly AUM data for:
- Testing calculator functionality
- Training and familiarisation
- Scenario planning
- Stress testing

### Quick Scenarios

#### Traditional Manager
- **Profile**: Established asset manager
- **AUM**: £2-5B range
- **Characteristics**: Steady growth, moderate correlation to markets

#### Robo-Advisor
- **Profile**: Digital wealth platform
- **AUM**: Rapid scaling from £100M
- **Characteristics**: High growth, systematic allocation

#### Hedge Fund
- **Profile**: Alternative investment manager
- **AUM**: £500M-1B
- **Characteristics**: Volatile, quarterly redemption cycles

#### Private Wealth
- **Profile**: High-net-worth manager
- **AUM**: £10B+
- **Characteristics**: Large tickets, stable base

### Configuration Options

#### Base Parameters
- **Starting AUM**: Initial assets under management
- **Growth Target**: Annual growth rate (-20% to +50%)
- **Market Beta**: Correlation to market movements (0 to 2)
- **Monthly Volatility**: Random variation (0-15%)

#### Business Events
- **Client Wins**: Step increases from new mandates
- **Client Losses**: Step decreases from redemptions
- **Quarterly Flows**: End-of-quarter rebalancing
- **Performance Fees**: AUM impact from fee crystallisation
- **Market Stress**: Drawdown scenarios
- **Seasonality**: Year-end effects, summer lulls

### Best Practices for Test Data

1. **Generate 18+ months**: Ensures full 15-month calculation period
2. **Test edge cases**: High growth, negative returns, volatility
3. **Match your profile**: Use scenarios similar to your firm
4. **Stress test**: Include market stress events

---

## Data Requirements

### Mandatory Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| Month | Month identifier | YYYY-MM | 2024-09 |
| AUM_Value | Month-end AUM | Numeric | 5234567890 |

### Accepted Date Formats

- `YYYY-MM` (Recommended): 2024-09
- `MM/YYYY`: 09/2024
- `Month YYYY`: September 2024
- `YYYYMM`: 202409

### Data Quality Requirements

✓ **Month-End Values**: Consistent month-end valuations  
✓ **Complete Months**: No gaps in monthly sequence  
✓ **Consistent Basis**: Same valuation methodology  
✓ **Gross Values**: Before any deductions  
✓ **Currency Consistency**: All values in same currency  

### Minimum Data Requirements

- **Standard**: 15 months for full calculation
- **New Firms**: Can use available months if less than 15
- **Recommended**: 18+ months for trend analysis

---

## Interpreting Results

### Primary Metrics

#### K-AUM Requirement
Your minimum capital requirement for managed assets. Compare against other K-factors to identify binding constraint.

#### Average AUM
The 15-month average driving your requirement. Monitor for business planning.

#### Headroom Analysis
- **Absolute**: Own Funds minus K-AUM
- **Percentage**: Available capital after K-AUM
- **Implied Maximum**: Maximum AUM at current own funds

### Additional Analytics

#### Growth Metrics
- **15-Month Growth**: Total change over calculation period
- **Annualised Growth**: Yearly growth rate
- **Month-on-Month**: Individual monthly changes

#### Risk Metrics
- **Volatility**: Standard deviation of monthly AUM
- **Min/Max Range**: Lowest and highest months
- **Trend Analysis**: Underlying growth pattern

### Visual Interpretations

#### Trend Chart
- **Green line**: Monthly AUM values
- **Dashed line**: 15-month average
- **Use for**: Identifying trends, volatility patterns

#### Growth Chart
- **Bar chart**: Month-on-month growth rates
- **Green bars**: Positive growth
- **Red bars**: Negative growth
- **Use for**: Understanding growth consistency

#### Capital Utilisation
- **Doughnut chart**: K-AUM vs available capital
- **Use for**: Quick capital adequacy assessment

### Sensitivity Analysis

Understand K-AUM at different AUM levels:
- **-50%**: Major business loss scenario
- **-25%**: Moderate outflows
- **Current**: Your actual position
- **+25%**: Moderate growth
- **+50%**: Significant expansion
- **+100%**: Business doubling

---

## Best Practices

### Data Management

1. **Monthly Discipline**: Ensure accurate month-end captures
2. **Reconciliation**: Cross-check against management accounts
3. **Documentation**: Record any adjustments or exclusions
4. **Consistency**: Maintain same valuation approach

### Operational Excellence

1. **Automation**: Consider automated month-end processes
2. **Validation**: Implement checks for data accuracy
3. **Review Cycle**: Monthly review of K-AUM position
4. **Early Warning**: Monitor trends for capital planning

### Regulatory Compliance

1. **Audit Trail**: Maintain all source data
2. **Methodology**: Document valuation approaches
3. **Regular Updates**: Recalculate monthly minimum
4. **ICARA Integration**: Include in broader capital assessment

### Strategic Planning

1. **Growth Planning**: Use sensitivity for capacity analysis
2. **Capital Efficiency**: Compare K-AUM vs other K-factors
3. **Buffer Management**: Maintain appropriate headroom
4. **Stress Testing**: Regular scenario analysis

---

## Common Issues & Solutions

### Issue: "Month column not found"
**Solution**: Ensure CSV header contains "Month", "Date", or "Period"

### Issue: Less than 15 months of data
**Solution**: Calculator will use available months and flag the limitation

### Issue: Gaps in monthly sequence
**Solution**: Fill missing months with interpolated or carry-forward values

### Issue: Large month-on-month swings
**Solution**: Verify data accuracy; large mandate wins/losses can cause this

### Issue: K-AUM exceeds expectations
**Solution**: Check you're not double-counting assets already in K-ASA

### Issue: Currency inconsistencies
**Solution**: Convert all values to reporting currency before calculation

---

## Technical Appendix

### CSV Specifications

- **Encoding**: UTF-8 (with or without BOM)
- **Delimiters**: Comma, semicolon, or tab
- **Headers**: Case-insensitive matching
- **File Size**: No practical limit

### Calculation Precision

- **Internal Calculations**: Full floating-point precision
- **Display Rounding**: 2 decimal places
- **Large Numbers**: Automatic formatting (K, M, B, T)
- **Percentage Display**: 2 decimal places

### Browser Requirements

- **Minimum**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: Required for calculations
- **Screen**: 1280x720 minimum recommended
- **Memory**: <50MB typical usage

### Performance Metrics

- **Processing Speed**: <1 second for typical datasets
- **Maximum Months**: 1,000+ supported
- **Chart Rendering**: Real-time updates
- **Export Capability**: CSV download functionality

### Integration Considerations

For production deployment:
- API integration with portfolio systems
- Automated month-end data feeds
- Database storage of calculations
- Regulatory reporting exports

---

## Regulatory Disclaimer

This calculator implements K-AUM calculations per MIFIDPRU 4.7 requirements. Users remain responsible for ensuring compliance with all applicable regulations. The calculator should not replace professional regulatory advice or firm-specific interpretations. Always verify calculations against current FCA Handbook requirements and your firm's specific circumstances.

---

## Change Log

### Version 1.0 (Current)
- Initial release with full MIFIDPRU 4.7 compliance
- 15-month averaging methodology
- Monthly data processing
- Comprehensive analytics and visualisation
- Test data generator with realistic scenarios

---

*Last Updated: September 2024 | MIFIDPRU 4.7 Compliant*