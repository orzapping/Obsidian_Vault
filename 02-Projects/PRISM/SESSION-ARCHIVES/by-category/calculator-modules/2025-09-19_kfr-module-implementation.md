# Session Wrap: KFR Module Implementation & K-Factor Calculator Integration
**Date: September 19, 2025**
**Module: K-Factor Requirements (KFR) Calculator**
**Focus: K-COH and K-AUM Implementation, Bug Fixes, and Pattern Establishment**

---

## Executive Summary

This session focused on fixing critical issues in the KFR module's embedded K-factor calculators, specifically K-COH (Client Orders Handled) and K-AUM (Assets Under Management). We identified and resolved fundamental UX/UI problems, calculation flow issues, and regulatory threshold misunderstandings. This document establishes the patterns and requirements for implementing the remaining K-factor calculators.

---

## Critical Issues Identified and Fixed

### 1. Double Coefficient Application Problem

**Issue**: The K-factor value was being truncated from £56,358.17 to £56.36 due to coefficient being applied twice.

**Root Cause**:
- Embedded calculators return the FINAL K-factor requirement (already has coefficient applied)
- KFR calculation was then applying the coefficient AGAIN
- Result: £56,358.17 × 0.001 = £56.36 (incorrect)

**Solution Implemented**:
```typescript
// When receiving value from embedded calculator
const handleEmbeddedCalculatorResult = (result: number) => {
  // Reverse-engineer the base value by dividing by coefficient
  const baseValue = result / definition.coefficient
  onChange(baseValue)
}
```

**Key Learning**: Distinguish between:
- **Manual Entry**: Raw values that NEED coefficient application
- **Auto-Calculated**: Final K-factor requirements that ALREADY HAVE coefficient applied

### 2. Manual vs Auto-Calculated Value Confusion

**Issue**: No clear distinction between manually entered raw values and auto-calculated K-factor requirements.

**Solution**: Implemented dual-field approach with clear labeling:
```typescript
// Separate displays for:
1. "📝 Manual Entry - Raw Value (GBP)" - with warning about coefficient application
2. "🧮 Auto-Calculated K-Factor Requirement" - in emerald box, clearly final value
```

### 3. Modal Z-Index and Visibility Issues

**Issue**: Calculator modal buttons hidden behind other cards, unable to close or use calculated values.

**Solution**:
```typescript
import { createPortal } from 'react-dom'

// Render modal to document.body, bypassing component hierarchy
{showEmbeddedCalculator && createPortal(
  <div style={{zIndex: 99999}}>
    {/* Modal content */}
  </div>,
  document.body
)}
```

### 4. Currency Symbol Inconsistency

**Issue**: Mixed use of € (EUR) and £ (GBP) throughout the application.

**Solution**: Standardized all currency formatting to GBP:
```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
```

### 5. KFR Calculation Logic Error

**Issue**: KFR was using MAX of RTM/RTC/RTF instead of SUM.

**Incorrect**: `result.overallKFR = Math.max(rtmTotal, rtcTotal, rtfTotal)`

**Correct**: `result.overallKFR = rtmTotal + rtcTotal + rtfTotal`

### 6. CSV Parsing Failures

**K-AUM Specific Issues**:
- Date format `YYYY-MM` not recognized
- Column headers `Month` and `AUM_Value` not detected

**Solution**: Enhanced date parsing and column detection:
```typescript
// Added YYYY-MM format support
if (/^\d{4}-\d{1,2}$/.test(s)) {
  const [y, m] = s.split('-')
  return new Date(Number(y), Number(m) - 1, 1)
}

// Prioritized actual column names
const date = parseDate(row.Month || row.month || row.date || ...)
const aum = parseFloat(row.AUM_Value || row.aum_value || row.aum || ...)
```

### 7. Regulatory Threshold Misunderstanding

**Issue**: £1.2bn K-AUM threshold displayed as if K-AUM only applies above this amount.

**Reality**:
- £1.2bn is an SNI/Non-SNI CLASSIFICATION threshold
- K-AUM applies to ALL firms from first pound of AUM
- Threshold determines regulatory regime, not K-factor applicability

**Solution**: Reworded all threshold displays:
- "SNI Classification Threshold" instead of generic "Threshold"
- "NON-SNI FIRM" badge instead of "THRESHOLD EXCEEDED"
- Added explanatory notes about K-AUM applying regardless of threshold

---

## Established Patterns for K-Factor Calculators

### 1. Value Flow Pattern

```
User Action → CSV Upload → Parse Data → Calculate K-Factor → Display Analytics
                                ↓
                    Return FINAL requirement (with coefficient)
                                ↓
                    Store as base value ÷ coefficient for KFR
                                ↓
                    KFR applies coefficient to get correct result
```

### 2. UI/UX Requirements

**Every K-Factor Input Must Have**:
1. Clear distinction between manual entry and auto-calculated values
2. Separate display boxes with appropriate styling
3. Warning notes about coefficient application for manual entry
4. Confirmation that auto-calculated values are final requirements
5. Currency consistency (£ GBP throughout)
6. 2 decimal place formatting

### 3. CSV Parsing Requirements

**Flexible Column Detection**:
```typescript
// Must check multiple column name variations
date: row.Month || row.month || row.Date || row.date || row.period
value: row.[Factor]_Value || row.[factor]_value || row.value || row.amount
```

**Date Format Support**:
- YYYY-MM (monthly data)
- MM/YYYY
- DD/MM/YYYY
- YYYY-MM-DD
- YYYYMMDD

### 4. Analytics Display Pattern

Each calculator should provide:
```typescript
analytics: {
  // Core calculation metrics
  averageValue,
  coefficient,
  requirement,

  // Period information
  dataRange: { from, to },
  periodsUsed,

  // Statistical analysis
  min, max, growth, stdDev,

  // Regulatory context
  methodology,
  warning (if applicable)
}
```

---

## Critical Requirements for Remaining K-Factor Calculators

### ⚠️ ABSOLUTE CRITICAL REQUIREMENT

**Every remaining K-factor calculator MUST be verified against its original HTML prototype for**:

1. **Exact Formula Match**
   - Coefficient values (0.02%, 0.1%, 0.01%, etc.)
   - Calculation methodology (simple average, rolling average, etc.)
   - Time periods (15 months, 6 months with 3-month exclusion, etc.)

2. **Precise Calculation Logic**
   - Averaging methods
   - Exclusion periods
   - Aggregation rules
   - Threshold applications

3. **Data Processing Rules**
   - Which months/days to include
   - How to handle missing data
   - Aggregation for duplicate entries
   - Business day calculations

### Remaining K-Factors to Implement/Verify

| K-Factor | Status | Original HTML File | Critical Verification Points |
|----------|--------|-------------------|----------------------------|
| K-ASA | ❌ Not Verified | `/docs/modules/6.1 k-asa/kasa-calculator.html` | 6-month rolling, 3-month exclusion, 0.04% coefficient |
| K-CMH | ❌ Not Verified | `/docs/modules/6.4 k-cmh/kcmh-calculator.html` | Segregation models, daily calculations |
| K-DTF | ❌ Not Verified | `/docs/modules/6.5 k-dtf/kdtf-calculator.html` | Daily trading flow, business days |
| K-NPR | ❌ Not Verified | `/docs/modules/6.8 k-npr/knpr-calculator.html` | Net position calculations |
| K-CMG | ❌ Not Verified | `/docs/modules/6.6 k-cmg/kcmg-calculator.html` | Clearing member guarantee |
| K-CON | ❌ Not Verified | `/docs/modules/6.7 k-con/kcon-calculator.html` | Concentration risk |
| K-TCD | ❌ Not Verified | `/docs/modules/6.9 k-tcd/ktcd-calculator.html` | Trading counterparty default |

### Verification Checklist for Each Calculator

- [ ] Read original HTML prototype completely
- [ ] Extract exact formula and coefficients
- [ ] Document calculation methodology
- [ ] Verify time period requirements
- [ ] Check special rules (exclusions, aggregations)
- [ ] Compare line-by-line with implementation
- [ ] Test with sample data from prototype
- [ ] Validate results match exactly

---

## Code Structure Requirements

### 1. Calculator Function Structure

```typescript
const calculateK[FACTOR] = (data: any[]): { value: number; analytics: any } => {
  // 1. Parse and validate data
  // 2. Apply time period logic (15 months, 6 months, etc.)
  // 3. Calculate averages/aggregations
  // 4. Apply coefficient
  // 5. Return FINAL requirement and detailed analytics

  return {
    value: finalRequirement,  // This is WITH coefficient applied
    analytics: {
      // All calculation details for transparency
    }
  }
}
```

### 2. Display Requirements

```typescript
// Must show:
1. Calculation methodology reference (MIFIDPRU section)
2. Time period used
3. Coefficient applied
4. Any warnings or special conditions
5. Detailed breakdown of calculation steps
```

### 3. Error Handling

```typescript
// Check for:
- Empty data sets
- Invalid date formats
- Missing required columns
- Negative values (where inappropriate)
- Data outside reasonable ranges
```

---

## Testing Requirements

### For Each K-Factor Calculator:

1. **Unit Tests**:
   - Formula correctness
   - Edge cases (empty data, single month, etc.)
   - Coefficient application

2. **Integration Tests**:
   - CSV parsing with various formats
   - Value flow from calculator to KFR
   - UI state management

3. **Validation Tests**:
   - Compare output with original HTML calculator
   - Use same test data as prototype
   - Results must match EXACTLY

---

## Deployment Readiness Criteria

Before ANY K-factor calculator can be considered complete:

1. ✅ Formula verified against original prototype
2. ✅ Calculation methodology documented
3. ✅ UI/UX follows established patterns
4. ✅ Currency formatting consistent (GBP)
5. ✅ Manual vs auto-calculated values clearly distinguished
6. ✅ Analytics display comprehensive
7. ✅ CSV parsing flexible and robust
8. ✅ Test results match prototype exactly

---

## Next Steps

1. **Immediate Priority**: Verify ALL remaining K-factor calculators against HTML prototypes
2. **Document**: Each calculator's specific requirements and edge cases
3. **Test**: With actual regulatory test cases
4. **Review**: With compliance team for accuracy

---

## Conclusion

The KFR module is mission-critical for MiFIDPRU compliance. The issues fixed today highlight the importance of:
- Understanding the difference between raw values and calculated requirements
- Precise implementation of regulatory formulas
- Clear UI/UX that prevents user confusion
- Thorough verification against original specifications

**No K-factor calculator should be deployed without complete verification against its original HTML prototype. This is non-negotiable for regulatory compliance.**

---

**Session completed by**: Claude
**Date**: September 19, 2025
**Module status**: K-COH ✅ | K-AUM ✅ | Others pending verification