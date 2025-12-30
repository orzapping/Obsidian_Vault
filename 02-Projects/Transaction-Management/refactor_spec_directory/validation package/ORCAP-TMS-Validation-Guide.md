# ORCAP TMS - Validation Guide for Claude Code

## Purpose

This guide provides step-by-step instructions for validating your TMS implementation against verified, reconciled data. **Do not consider the settlement module complete until all tests pass.**

---

## Quick Start Checklist

```
□ Read ORCAP-TMS-Refactor-Spec.md (understand the business logic)
□ Load ORCAP-TMS-Test-Data.ts (import the test fixtures)
□ Implement calculation engine
□ Run November 2025 validation
□ Verify AR+NK total = £4,515.15
□ Run Mariia settlement sequence validation
□ Test all edge cases
□ Only then: proceed to UI work
```

---

## Test 1: November 2025 Full Calculation

### What You're Testing
The complete waterfall calculation for a single month with:
- 5 active advisors (one with zero revenue)
- 1 active settlement (Mariia)
- Mixed revenue sources (CBH, Marex, Fieldpoint)
- Regent override on inherited client

### Input Data
```typescript
import { 
  NOVEMBER_2025_TRANSACTIONS,
  NOVEMBER_2025_EXPENSES,
  ADVISORS 
} from './ORCAP-TMS-Test-Data';
```

### Expected Outputs

| Advisor | Gross Rev | Expenses | Net Dist | 70% | 10% | 20% | Settlement | AR+NK |
|---------|----------:|---------:|---------:|----:|----:|----:|-----------:|------:|
| Maks | £8,076.09 | £149.00 | £7,927.09 | £5,548.96 | £792.71 | £1,585.42 | £0 | £1,585.42 |
| Sergey | £11,363.82 | £228.83 | £11,134.99 | £7,794.49 | £1,113.50 | £2,227.00 | £0 | £2,227.00 |
| Nikolai | £0 | £308.67 | -£308.67 | £0 | £0 | £0 | £0 | £0 |
| Mariia | £7,387.13 | £570.82 | £6,816.31 | £4,771.42 | £681.63 | £1,363.26 | £1,363.26 | £0 |
| Yulia | £2,069.63 | £625.61 | £1,444.02 | £1,010.81 | £144.40 | £288.80 | £0 | £288.80 |
| Regent | £2,069.63 | £0 | £2,069.63 | £0 | £413.93 | £0 | £0 | £0 |

### Key Validation Points

1. **Total AR+NK MUST equal £4,515.15**
   - This is the verified figure from bank reconciliation
   - If you get a different number, your waterfall logic is wrong

2. **Mariia's settlement balance MUST go from £4,380.71 → £3,017.44**
   - Recovery of £1,363.26
   - Her entire 20% goes to settlement (not AR+NK)

3. **Nikolai's negative month MUST NOT generate waterfall**
   - Expenses exceed revenue = debt to company
   - No 70/10/20 split on negative numbers

4. **Regent MUST receive 10% of Yulia's Savushkin revenue**
   - This is the inherited AS client override
   - Regent pays no expenses

### Validation Code
```typescript
import { validateNovember2025Calculation } from './ORCAP-TMS-Test-Data';

const myResults = calculateMonth('2025-11', transactions, expenses, advisors);
const validation = validateNovember2025Calculation(myResults);

if (!validation.passed) {
  console.error('VALIDATION FAILED:');
  validation.errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

console.log('✓ November 2025 validation passed');
```

---

## Test 2: Mariia Settlement Sequence (13 months)

### What You're Testing
That settlement recovery works correctly over time with the priority waterfall.

### Expected Behaviour
```
Month       Opening      Recovery    Closing
─────────────────────────────────────────────
Nov 2024    £15,551.00   £2,139.94   £13,411.06
Dec 2024    £13,411.06   £  386.27   £13,024.79
Jan 2025    £13,024.79   £  556.46   £12,468.33
Feb 2025    £12,468.33   £2,982.31   £ 9,486.02
Mar 2025    £ 9,486.02   £  423.23   £ 9,062.79
Apr 2025    £ 9,062.79   £1,219.36   £ 7,843.43
May 2025    £ 7,843.43   £1,406.88   £ 6,436.55
Jun 2025    £ 6,436.55   £  469.26   £ 5,967.29
Jul 2025    £ 5,967.29   £  744.47   £ 5,222.82
Aug 2025    £ 5,222.82   £  447.19   £ 4,775.63
Sep 2025    £ 4,775.63   £  394.92   £ 4,380.71
Oct 2025    £ 4,380.71   £  704.84   £ 3,675.87
Nov 2025    £ 4,380.71*  £1,363.27   £ 3,017.44
```
*Note: Oct/Nov opening balance discrepancy in source data - use Nov figure

### Validation Logic
```typescript
import { MARIIA_SETTLEMENT_SEQUENCE } from './ORCAP-TMS-Test-Data';

let balance = 15551.00;

for (const month of MARIIA_SETTLEMENT_SEQUENCE) {
  const calculated = calculateSettlementRecovery('MARIIA', month.period);
  
  // Check recovery amount
  if (Math.abs(calculated.recovery - month.recovery) > 0.02) {
    throw new Error(`${month.period}: expected recovery £${month.recovery}, got £${calculated.recovery}`);
  }
  
  // Check closing balance
  balance -= calculated.recovery;
  if (Math.abs(balance - month.closingBalance) > 0.02) {
    throw new Error(`${month.period}: expected closing £${month.closingBalance}, got £${balance}`);
  }
}

console.log('✓ Mariia settlement sequence validated');
```

---

## Test 3: Edge Cases

### Edge Case 1: Negative Net Distributable
```typescript
// Input: Nikolai Nov 2025 - zero revenue, £308.67 expenses
const result = calculateWaterfall({
  advisorId: 'NIKOLAI',
  grossRevenue: 0,
  expenses: 308.67
});

// Expected:
assert(result.netDistributable === -308.67);
assert(result.advisorShare70 === 0);
assert(result.operationsOverride10 === 0);
assert(result.waterfallPool20 === 0);
assert(result.paymentToAdvisor === 0);
// The -308.67 should be tracked as debt, not paid
```

### Edge Case 2: Partial Settlement Absorption
```typescript
// Scenario: Advisor has £500 settlement, 20% pool is £800
const result = calculateWaterfall({
  advisorId: 'TEST',
  netDistributable: 4000,  // 20% = 800
  settlementBalance: 500
});

// Expected:
assert(result.waterfallPool20 === 800);
assert(result.settlementRecovery === 500);  // Only takes what's needed
assert(result.arNkShare === 300);            // Remainder to AR+NK
assert(result.settlementBalanceAfter === 0); // Cleared
```

### Edge Case 3: Regent Override Calculation
```typescript
// Savushkin is inherited AS client, now serviced by Yulia
// Regent gets 10% override, Yulia gets 70%

const result = calculateWithRegentOverride({
  advisorId: 'YULIA',
  clientId: 'SAVUSHKIN',
  isInheritedASClient: true,
  grossRevenue: 2069.63
});

// Expected:
assert(result.yuliaReceives === 2069.63 * 0.70);  // £1,448.74
assert(result.regentReceives === 2069.63 * 0.10); // £206.96
assert(result.waterfallPool === 2069.63 * 0.20);  // £413.93
```

### Edge Case 4: Expense Denominator Logic
```typescript
// HTL divides by 5 (advisors only)
const htlPerAdvisor = 388.80 / 5;  // £77.76
assert(htlPerAdvisor === 77.76);

// 8X8 divides by 7 (includes AR+NK)
const eightByEightPerAdvisor = 254.08 / 7;  // £36.30
assert(Math.abs(eightByEightPerAdvisor - 36.30) < 0.01);
```

---

## Test 4: AR+NK Monthly Totals

### Verification Data
```typescript
const AR_NK_EXPECTED = {
  'Apr 2025': 7639.73,
  'May 2025': 1429.67,
  'Jun 2025': 11136.36,
  'Jul 2025': 10005.63,
  'Aug 2025': 1883.46,
  'Sep 2025': 6639.14,
  'Oct 2025': 8244.09,
  'Nov 2025': 4515.15,
  TOTAL: 51493.23
};
```

### Why These Months?
- **Nov 2024 - Mar 2025**: All 20% goes to settlements (5-6 active)
- **Apr 2025 onwards**: AS cleared, then NK+Yulia cleared in July
- **Aug 2025 onwards**: Only Mariia settlement active

---

## Common Implementation Mistakes

### ❌ WRONG: Applying 70/10/20 to gross revenue
```typescript
// WRONG
const advisorShare = grossRevenue * 0.70;
```

### ✅ CORRECT: Apply to NET distributable (after expenses)
```typescript
// CORRECT
const netDistributable = grossRevenue - expenses;
const advisorShare = netDistributable * 0.70;
```

---

### ❌ WRONG: Splitting 20% equally between settlement and AR+NK
```typescript
// WRONG
const toSettlement = waterfallPool * 0.5;
const toArNk = waterfallPool * 0.5;
```

### ✅ CORRECT: Settlement has PRIORITY - takes all it needs first
```typescript
// CORRECT
const toSettlement = Math.min(waterfallPool, settlementBalance);
const toArNk = waterfallPool - toSettlement;
```

---

### ❌ WRONG: Calculating waterfall on negative net distributable
```typescript
// WRONG - will produce negative payments
if (netDistributable !== 0) {
  const waterfall = netDistributable * 0.20;
}
```

### ✅ CORRECT: Only apply waterfall to positive net distributable
```typescript
// CORRECT
if (netDistributable > 0) {
  const waterfall = netDistributable * 0.20;
} else {
  // Track as debt, no waterfall
  recordDebtToCompany(advisorId, Math.abs(netDistributable));
}
```

---

## Final Acceptance Criteria

Your implementation is complete when:

1. ✅ November 2025 calculation produces exactly £4,515.15 AR+NK
2. ✅ Mariia's settlement tracks from £15,551 → £3,017.44 over 13 months
3. ✅ Negative months don't generate payments or waterfall
4. ✅ Regent receives 10% on inherited AS clients
5. ✅ Expense allocation uses correct denominators (5 vs 7)
6. ✅ All edge cases pass

**Only proceed to UI/Analytics work after all tests pass.**

---

## Questions?

If something doesn't make sense, re-read:
- `ORCAP-TMS-Refactor-Spec.md` - The full business logic
- `ORCAP-TMS-Calculation-Engine.md` - Implementation guidance
- `ORCAP-TMS-Test-Data.ts` - The actual test fixtures

The spec package + this test data represents ~15 hours of forensic analysis. Trust the data.
