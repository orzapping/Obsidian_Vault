# ORCAP TMS Refactor - Claude Code Briefing

**To:** Claude Code  
**From:** Forensic Audit Session (Claude AI + Adrian Rabey)  
**Date:** 26 December 2025  
**Priority:** High - Production System Required Immediately

---

## The Situation

Adrian Rabey is Executive Director of Orion Ridge Capital Limited (ORCAP), an FCA-regulated investment advisory firm in London. The firm has 5 active advisors who service high-net-worth clients through relationships with Swiss and UK banks (primarily CBH Bank).

**As of today, the person who managed all invoicing and monthly calculations (Ilya) has departed.** Adrian is taking over this function immediately and needs a working Transaction Management System to do so.

The existing TMS prototype has a critical flaw: it implements a **70/10/10/10** distribution split when the correct contractual structure is **70/10/20**. This must be fixed.

---

## What You're Building

A React + TypeScript transaction management system that:

1. **Imports bank transactions** (Lloyds CSV, Wise CSV)
2. **Categorises them** (revenue by advisor/client, expenses by type)
3. **Calculates the distribution waterfall** (70/10/20 split)
4. **Tracks settlement recovery** (one advisor still has active settlement)
5. **Produces reports** (monthly summaries, advisor statements, AR+NK earnings)

---

## The Correct Business Logic

```
GROSS REVENUE (per advisor, per month)
         │
         ▼
    LESS: EXPENSES (allocated per advisor)
         │
         ▼
    NET DISTRIBUTABLE
         │
    ┌────┴────┬────────────┐
    │         │            │
   70%       10%          20%
    │         │            │
    ▼         ▼            ▼
 ADVISOR   OPERATIONS   WATERFALL
 PAYMENT    OVERRIDE      POOL
              │            │
              ▼            │
           (Regent)        │
                     ┌─────┴─────┐
                     │           │
                PRIORITY 1   PRIORITY 2
                     │           │
                     ▼           ▼
                SETTLEMENT    AR+NK
                RECOVERY     EARNINGS
```

### Critical Rules

1. **Settlement has absolute priority** - If an advisor has outstanding settlement, their entire 20% goes to settlement recovery until cleared

2. **Only one settlement remains active** - Mariia Filatenko (£3,017.44 remaining as of Nov 2025)

3. **Negative months = debt, not waterfall** - If expenses exceed revenue, track as debt to company, don't calculate negative splits

4. **Regent Consulting gets 10%** - This is the Operations Override, paid to Anastasia Soldatova's husband's company (she departed but override continues on inherited clients)

5. **Expense allocation varies** - Some expenses divide by 5 (advisors only), some by 7 (includes AR+NK in denominator)

---

## Your Documentation Package

You have been provided with:

| Document | Size | Purpose |
|----------|------|---------|
| `ORCAP-TMS-Refactor-Spec.md` | 30KB | Master specification - the WHAT |
| `ORCAP-TMS-Reference-Data.ts` | 21KB | Configuration data - advisor/client/expense mappings |
| `ORCAP-TMS-Calculation-Engine.md` | 35KB | Implementation guidance - the HOW |
| `ORCAP-TMS-Test-Data.ts` | 25KB | Verified test fixtures - the PROOF |
| `ORCAP-TMS-Validation-Guide.md` | 8KB | Test instructions - how to verify |

**Read them in this order:** Spec → Calculation Engine → Test Data → Validation Guide

---

## The Quality Bar

This is not a prototype or experiment. This system will:

- Process real money (£500k+ annually)
- Be used by Adrian to calculate advisor payments
- Generate figures that must reconcile with bank statements
- Be relied upon for regulatory reporting

**Tolerance for error: £0.02 per line item**

---

## Verification Before Proceeding

Before you write any UI code, your calculation engine must pass:

### Test 1: November 2025 Full Month
- Input: Transactions + Expenses from test data
- Expected AR+NK total: **£4,515.15** (exactly)
- Expected Mariia settlement: £4,380.71 → £3,017.44

### Test 2: Mariia Settlement Sequence
- 13-month trajectory from £15,551 → £3,017.44
- Each month's recovery must match test data within £0.02

### Test 3: Edge Cases
- Negative net distributable (Nikolai Nov 2025)
- Regent override on inherited clients
- Expense denominator logic (5 vs 7)

**If these tests don't pass, the implementation is wrong. Do not proceed.**

---

## Implementation Priority

1. **Settlement Calculator** - `src/utils/settlementCalculator.ts`
   - This is the core. 594 lines of broken code to rewrite.
   - Implement the waterfall logic correctly.
   - Add test validation.

2. **CSV Parsers** - Add Wise alongside Lloyds
   - Lloyds: DD/MM/YYYY format
   - Wise: DD-MM-YYYY format, exclude CONVERSION transactions

3. **Transaction Categorisation** - Auto-detect advisor/client/expense type
   - Use patterns from Reference Data

4. **Monthly Calculation View** - Show the waterfall for a selected month

5. **Settlement Tracking** - Mariia's balance and projected clearance

6. **Analytics Dashboard** - Revenue trends, advisor performance

7. **Reporting** - Export monthly summaries, advisor statements

---

## What "Done" Looks Like

Adrian should be able to:

1. Upload Lloyds + Wise CSVs for a month
2. See transactions auto-categorised
3. Review and adjust if needed
4. Click "Calculate" and see correct waterfall
5. See Mariia's settlement reduce correctly
6. See AR+NK earnings for the month
7. Export advisor payment instructions
8. Generate monthly summary report

---

## Key Contacts in Code

```typescript
// The people who matter
const AR = 'Adrian Rabey';      // Executive Director, 50% owner
const NK = 'Naji Karak';        // Partner, 50% owner
const ORCAP_NOSTRO = 'AR+NK';   // Combined earnings after settlements clear

// Active advisors
const ADVISORS = ['Maks', 'Sergey', 'Nikolai', 'Mariia', 'Yulia'];

// Operations Override recipient
const REGENT = 'Regent Consulting Ltd';  // AS's husband's company

// The one remaining settlement
const ACTIVE_SETTLEMENT = {
  advisor: 'Mariia',
  remaining: 3017.44,
  projectedClearance: 'Feb/Mar 2026'
};
```

---

## Final Notes

This specification package represents approximately 15 hours of forensic analysis across multiple sessions. The test data is derived from:

- Bank-reconciled transactions (Nov 2024 - Dec 2025)
- Original termination agreements
- Verified spreadsheet calculations

**Trust the test data.** If your implementation doesn't match it, the implementation is wrong, not the data.

Adrian is counting on this system being production-ready. Take the time to get the calculation engine right before building UI chrome. A beautiful interface that produces wrong numbers is worse than useless.

Good luck, and build it clean.

---

*"The fox knows many things, but the hedgehog knows one big thing."*  
*— Know the waterfall. Everything else follows.*
