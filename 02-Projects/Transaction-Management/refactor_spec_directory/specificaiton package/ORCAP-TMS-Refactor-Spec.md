# ORCAP Transaction Management System - Refactor Specification

## Document Purpose

This specification provides comprehensive requirements for refactoring the ORCAP Transaction Management System (TMS). The primary objective is to correct the core calculation engine, implement proper waterfall distribution logic, and build out analytics and reporting capabilities.

**Target:** Claude Code implementation session
**Codebase:** React 19 + Vite + Zustand + Dexie.js + TanStack React Query
**Primary Surgery Target:** `src/utils/settlementCalculator.ts` (594 lines - requires complete rewrite)

---

## 1. Executive Context

### 1.1 Business Background

ORCAP (Orion Ridge Capital Ltd) is an FCA-regulated investment advisory firm based in the UK. The firm operates a unique business model where independent investment advisors service high-net-worth clients through partner banking relationships (CBH Bank, TBC Bank, Marex, Vontobel, Fieldpoint).

The firm emerged from Citi Private Bank's Russian desk in October 2024, with six advisors transitioning under individual consultancy agreements. Each advisor brought their client book and agreed to a revenue-sharing arrangement with the firm.

### 1.2 Ownership Structure

- **Adrian Rader (AR)** - Co-owner, 50%
- **Naji Karak (NK)** - Co-owner, 50%

The owners previously sold an Option to the advisors to acquire a controlling stake. This option was NOT exercised, so the firm remains 100% owned by AR and NK.

### 1.3 Current Operational Challenge

Revenue distribution calculations are currently performed manually in Excel by an external party. This creates:
- Lack of transparency and auditability
- Delayed settlements
- Governance concerns
- No real-time visibility into firm performance

The TMS application exists but has **critical flaws in its calculation logic** that must be corrected before it can be used operationally.

---

## 2. Contractual Framework

### 2.1 Revenue Distribution Formula

**CRITICAL: The current app implements 70/10/10/10 which is WRONG.**

The correct formula is **70/10/20**:

```
Gross Revenue (100%)
│
├── Less: Shared Operational Expenses
│         (Allocated equally among active advisors)
│
├── Less: Individual Expenses
│         (Charged to specific advisor)
│
│   = Net Distributable Revenue
│
├── 70% → Advisor (their commission)
│
├── 10% → Operations Override (currently: Regent Consulting Ltd)
│
└── 20% → ORCAP Nostro (firm earnings)
          BUT SUBJECT TO WATERFALL PRIORITY:
          │
          ├── Priority 1: Advisor's own settlement balance
          │               (if any outstanding)
          │
          └── Priority 2: ORCAP Nostro
                          (once advisor's settlement clears)
```

### 2.2 The Waterfall Mechanism

When advisors joined in October 2024, each had a "termination settlement" amount owed to them from the previous regime. These settlements are recovered from the 20% tranche BEFORE any funds flow to ORCAP Nostro.

**Settlement Amounts (Original - October 2024):**

| Advisor | Settlement Amount | Clearance Month | Status |
|---------|------------------|-----------------|--------|
| Maksat Balbaev | £6,310.00 | January 2025 | ✅ CLEARED |
| Sergey Zhirnov | £15,335.00 | January 2025 | ✅ CLEARED |
| Anastasia Soldatova | £11,685.00 | April 2025 | ✅ CLEARED |
| Nikolai Klimov | £6,378.00 | July 2025 | ✅ CLEARED |
| Yulia Mitraeva | £2,657.00 | July 2025 | ✅ CLEARED |
| Mariia Filatenko | £15,551.00 | ~February 2026 (est) | 🔄 ACTIVE (~£1,654 remaining) |

**Waterfall Logic:**

For each advisor in each settlement period:
1. Calculate their 20% tranche amount
2. Check if their settlement balance > 0
3. If YES: Deduct from 20% tranche, reduce settlement balance
4. If 20% tranche > remaining settlement: Clear settlement, overflow to ORCAP Nostro
5. If NO settlement balance: Full 20% flows to ORCAP Nostro

### 2.3 Operations Override (10%)

This 10% allocation was originally Anastasia Soldatova's "platform override" as compensation for operational duties. Following her departure, this continues to be paid to Regent Consulting Ltd (now operated by her husband).

**App Treatment:**
- Label as "Operations Override" (not hardcoded to any individual)
- Configurable recipient in Settings
- Current recipient: Regent Consulting Ltd
- This is a REAL outflow, not suspended/accrued

### 2.4 Expense Categories

**Shared Operational Expenses** (Deducted before 70/10/20 split, divided among active advisors):
- HTL Support Ltd (IT/compliance support)
- 8x8 UK Limited (telephony) - *Note: Denominator configurable (5 advisors or 7 including AR+NK)*
- Salesforce (CRM)
- WorldCheck (compliance screening) - quarterly

**Individual Expenses** (Charged to specific advisor's allocation):
- BUPA Health Insurance (per advisor's policy)
- BUPA Dental Insurance (per advisor's policy)
- AXA Health Insurance (Mariia only)

**Firm-Only Expenses** (Absorbed by ORCAP, NOT charged to advisors):
- Netlify (hosting)
- Website costs
- Google Workspace

### 2.5 Special Cases

**Clients shared between advisors:**
Some clients are serviced jointly. Revenue from these clients must be splittable across multiple advisors with configurable percentages. The app already has this functionality - preserve it.

**AS's clients post-departure:**
Anastasia's former clients (Anisimov, Gorn) continue to generate revenue. This revenue flows through the normal 70/10/20 split but the "advisor" portion may be assigned to whoever now services them.

---

## 3. Bank Account Structure

### 3.1 Accounts

| Bank | Currency | Account Type | Primary Use |
|------|----------|--------------|-------------|
| Lloyds | GBP | Current | Main operating account |
| Wise | GBP | Multi-currency | FX conversions, overflow |
| Wise | USD | Multi-currency | USD revenue (Marex, FP) |
| Wise | EUR | Multi-currency | EUR revenue (Gordon/Mark) |
| Wise | CHF | Multi-currency | CHF revenue (CBH Swiss) |

### 3.2 CSV Format - Lloyds

```csv
Transaction Date,Transaction Type,Sort Code,Account Number,Transaction Description,Debit Amount,Credit Amount,Balance
12/12/2025,FPO,'30-96-26,50847768,8X8 UK LIMITED 100000001672042095...,254.08,,31041.29
12/12/2025,FPI,'30-96-26,50847768,ORION RIDGE CAPITA...,,26000.00,31295.37
```

**Field Mapping:**
- `Transaction Date`: DD/MM/YYYY format
- `Transaction Type`: FPO (Faster Payment Out), FPI (Faster Payment In), DD (Direct Debit), DEB (Debit Card), etc.
- `Debit Amount`: Outgoing (expenses, payments)
- `Credit Amount`: Incoming (revenue)
- `Balance`: Running balance

### 3.3 CSV Format - Wise

```csv
TransferWise ID,Date,Date Time,Amount,Currency,Description,Payment Reference,Running Balance,Exchange From,Exchange To,Exchange Rate,Payer Name,Payee Name,Payee Account Number,Merchant,Card Last Four Digits,Card Holder Full Name,Attachment,Note,Total fees,Exchange To Amount,Transaction Type,Transaction Details Type
TRANSFER-1867022945,12-12-2025,12-12-2025 13:42:00.834,-26000.00,GBP,Sent money to Orion Ridge Capital Limited,,3106.06,,,,,Orion Ridge Capital Limited,(30-96-26) 50847768,,,,,,,0.00,,DEBIT,TRANSFER
```

**Field Mapping:**
- `Date`: DD-MM-YYYY format (note: different from Lloyds!)
- `Amount`: Signed (negative = debit, positive = credit)
- `Currency`: GBP/USD/EUR/CHF/AUD
- `Transaction Type`: CREDIT/DEBIT
- `Transaction Details Type`: TRANSFER, DEPOSIT, CONVERSION, CARD, etc.
- `Payer Name`: For incoming - who sent the money
- `Exchange From/To/Rate`: For FX conversions

**CRITICAL:** Wise CONVERSION transactions are internal FX movements, NOT revenue/expenses. Must be handled specially to avoid double-counting.

---

## 4. Core Calculation Engine Specification

### 4.1 Algorithm Overview

```typescript
interface SettlementPeriod {
  id: string;
  name: string;                    // e.g., "November 2025"
  revenueDateRange: DateRange;     // When revenue was received
  expenseDateRange: DateRange;     // When expenses were incurred
  status: 'draft' | 'finalized' | 'paid';
}

interface AdvisorSettlement {
  advisorId: string;
  
  // Revenue
  grossRevenue: number;            // Total revenue allocated to this advisor
  revenueTransactions: Transaction[];
  
  // Expenses
  individualExpenses: number;      // BUPA, AXA etc.
  sharedExpenseShare: number;      // Their portion of shared costs
  totalExpenses: number;
  
  // Calculations
  netDistributableRevenue: number; // Gross - Expenses
  
  // Distribution
  advisorShare70: number;          // 70% to advisor
  operationsOverride10: number;    // 10% to Operations Override
  waterfallPool20: number;         // 20% to waterfall
  
  // Waterfall breakdown
  settlementRecovery: number;      // Portion of 20% going to their settlement
  orcapNostro: number;             // Portion of 20% going to firm
  
  // Settlement tracking
  settlementOpeningBalance: number;
  settlementClosingBalance: number;
  settlementCleared: boolean;
  settlementClearanceDate?: Date;
}
```

### 4.2 Step-by-Step Calculation

```typescript
function calculateAdvisorSettlement(
  advisor: Advisor,
  revenueTransactions: Transaction[],
  sharedExpenseTotal: number,
  activeAdvisorCount: number,
  periodOpeningSettlementBalance: number
): AdvisorSettlement {
  
  // Step 1: Sum allocated revenue
  const grossRevenue = revenueTransactions
    .filter(t => t.allocatedTo === advisor.id || t.splits?.some(s => s.advisorId === advisor.id))
    .reduce((sum, t) => {
      if (t.splits) {
        const split = t.splits.find(s => s.advisorId === advisor.id);
        return sum + (split?.amount ?? 0);
      }
      return sum + t.amount;
    }, 0);
  
  // Step 2: Calculate expenses
  const individualExpenses = getIndividualExpenses(advisor.id, period);
  const sharedExpenseShare = sharedExpenseTotal / activeAdvisorCount;
  const totalExpenses = individualExpenses + sharedExpenseShare;
  
  // Step 3: Net distributable
  const netDistributableRevenue = grossRevenue - totalExpenses;
  
  // Handle negative (expenses exceed revenue)
  if (netDistributableRevenue <= 0) {
    return {
      // ... all distribution fields = 0
      // Carry forward negative as debt
      carryForwardDebt: Math.abs(netDistributableRevenue)
    };
  }
  
  // Step 4: Apply 70/10/20 split
  const advisorShare70 = netDistributableRevenue * 0.70;
  const operationsOverride10 = netDistributableRevenue * 0.10;
  const waterfallPool20 = netDistributableRevenue * 0.20;
  
  // Step 5: Waterfall logic for 20%
  let settlementRecovery = 0;
  let orcapNostro = 0;
  let closingBalance = periodOpeningSettlementBalance;
  
  if (periodOpeningSettlementBalance > 0) {
    // Settlement still outstanding - recover from 20%
    if (waterfallPool20 >= periodOpeningSettlementBalance) {
      // Full clearance this period
      settlementRecovery = periodOpeningSettlementBalance;
      orcapNostro = waterfallPool20 - periodOpeningSettlementBalance;
      closingBalance = 0;
    } else {
      // Partial recovery
      settlementRecovery = waterfallPool20;
      orcapNostro = 0;
      closingBalance = periodOpeningSettlementBalance - waterfallPool20;
    }
  } else {
    // No settlement outstanding - all to ORCAP Nostro
    settlementRecovery = 0;
    orcapNostro = waterfallPool20;
  }
  
  return {
    advisorId: advisor.id,
    grossRevenue,
    individualExpenses,
    sharedExpenseShare,
    totalExpenses,
    netDistributableRevenue,
    advisorShare70,
    operationsOverride10,
    waterfallPool20,
    settlementRecovery,
    orcapNostro,
    settlementOpeningBalance: periodOpeningSettlementBalance,
    settlementClosingBalance: closingBalance,
    settlementCleared: closingBalance === 0 && periodOpeningSettlementBalance > 0,
    settlementClearanceDate: closingBalance === 0 && periodOpeningSettlementBalance > 0 
      ? new Date() 
      : undefined
  };
}
```

### 4.3 Period Aggregation

```typescript
function calculatePeriodTotals(
  advisorSettlements: AdvisorSettlement[]
): PeriodTotals {
  return {
    totalRevenue: sum(advisorSettlements, 'grossRevenue'),
    totalExpenses: sum(advisorSettlements, 'totalExpenses'),
    totalNetDistributable: sum(advisorSettlements, 'netDistributableRevenue'),
    
    // Distribution totals
    totalToAdvisors: sum(advisorSettlements, 'advisorShare70'),
    totalOperationsOverride: sum(advisorSettlements, 'operationsOverride10'),
    totalWaterfallPool: sum(advisorSettlements, 'waterfallPool20'),
    
    // Waterfall breakdown
    totalSettlementRecovery: sum(advisorSettlements, 'settlementRecovery'),
    totalOrcapNostro: sum(advisorSettlements, 'orcapNostro'),
    
    // Summary metrics
    firmEarnings: sum(advisorSettlements, 'orcapNostro'), // What AR+NK actually receive
    pendingSettlements: advisorSettlements
      .filter(a => a.settlementClosingBalance > 0)
      .map(a => ({ advisorId: a.advisorId, balance: a.settlementClosingBalance }))
  };
}
```

---

## 5. Feature Specifications by Tab

### 5.1 Import Tab

**Current State:** Functional for Lloyds CSV
**Required Changes:**
- Add Wise CSV parser (all currencies)
- Auto-detect bank format from headers
- Handle Wise CONVERSION transactions (exclude from revenue/expense, track for FX P&L)
- Duplicate detection across multiple imports
- FX rate capture for non-GBP transactions

**Wise Import Logic:**
```typescript
function parseWiseTransaction(row: WiseCSVRow): Transaction | null {
  // Skip internal conversions
  if (row['Transaction Details Type'] === 'CONVERSION') {
    // Log for FX tracking but don't create transaction
    return null;
  }
  
  const amount = parseFloat(row['Amount']);
  const currency = row['Currency'];
  
  // Get FX rate if non-GBP
  let gbpAmount = amount;
  let fxRate = 1;
  let spotRate = 1;
  
  if (currency !== 'GBP') {
    spotRate = await fetchSpotRate(currency, 'GBP', row['Date']);
    fxRate = spotRate; // Default to spot, allow manual override
    gbpAmount = amount * fxRate;
  }
  
  return {
    id: row['TransferWise ID'],
    date: parseWiseDate(row['Date']), // DD-MM-YYYY format
    description: row['Description'],
    originalAmount: amount,
    originalCurrency: currency,
    gbpAmount: gbpAmount,
    fxRate: fxRate,
    spotRate: spotRate,
    type: amount > 0 ? 'credit' : 'debit',
    source: 'wise',
    payerName: row['Payer Name'],
    payeeName: row['Payee Name'],
    reference: row['Payment Reference']
  };
}
```

### 5.2 Transactions Tab

**Current State:** Functional with categorisation
**Required Changes:**
- Add Wise transactions alongside Lloyds
- Show original currency and GBP equivalent for non-GBP
- Add FX rate override capability
- Enhance auto-categorisation rules (see Section 6)

**Transaction Categories:**
- `revenue` - Incoming client/bank payments
- `shared` - Shared operational expenses
- `individual` - Advisor-specific expenses
- `firm-only` - Absorbed by ORCAP
- `advisor-payment` - Outgoing to advisors
- `transfer` - Internal (Wise↔Lloyds)
- `excluded` - Not part of calculations

### 5.3 Settlements Tab

**Current State:** Has structure but wrong calculation logic
**Required Changes:**

#### 5.3.1 Settlement Period List View
- Show all periods with summary metrics
- Status badges: Draft / Finalized / Paid
- Quick actions: View, Duplicate, Delete (draft only)

#### 5.3.2 Settlement Detail View (MAJOR REFACTOR)

**Break up the 114KB monster file into:**

```
src/components/settlements/
├── SettlementDetailView.tsx      # Container/orchestrator
├── SettlementHeader.tsx          # Period info, status, actions
├── SettlementSummaryCards.tsx    # Total revenue, expenses, distributions
├── AdvisorDistributionGrid.tsx   # All advisors at a glance
├── AdvisorDetailCard.tsx         # Expandable per-advisor breakdown
├── WaterfallVisualization.tsx    # Show where 20% is flowing
├── RevenueAllocation.tsx         # Revenue transaction assignment
├── ExpenseAllocation.tsx         # Expense management
├── SettlementActions.tsx         # Approve, finalize, mark paid
└── SettlementHistory.tsx         # Audit trail
```

#### 5.3.3 Advisor Detail Card

Must show:
```
┌─────────────────────────────────────────────────────────────┐
│  Maks Balbaev (Alpha Wealth Advisors Ltd)                   │
├─────────────────────────────────────────────────────────────┤
│  + Revenue (Gross)                           £31,293.67     │
│    ├── Individual Expenses                       £0.00      │
│    └── Shared Expenses                       £1,003.24      │
│  - Expenses (Total)                          £1,003.24      │
│  ═══════════════════════════════════════════════════════════│
│  Net Distributable Revenue                   £30,290.43     │
├─────────────────────────────────────────────────────────────┤
│  Distribution:                                              │
│    → Advisor (70%):                         £21,203.30      │
│    → Operations Override (10%):              £3,029.04      │
│    → Waterfall Pool (20%):                   £6,058.09      │
│        ├── Settlement Recovery:                  £0.00      │
│        └── ORCAP Nostro:                     £6,058.09      │
├─────────────────────────────────────────────────────────────┤
│  Settlement Status: ✅ CLEARED (January 2025)               │
│  Opening Balance: £0.00 → Closing Balance: £0.00            │
└─────────────────────────────────────────────────────────────┘
```

For Mariia (active settlement):
```
├─────────────────────────────────────────────────────────────┤
│  Settlement Status: 🔄 ACTIVE                               │
│  Opening Balance: £3,017.44                                 │
│  Recovery This Period: £1,363.26                            │
│  Closing Balance: £1,654.18                                 │
│  Est. Clearance: ~2 months at current revenue rate          │
└─────────────────────────────────────────────────────────────┘
```

#### 5.3.4 Waterfall Visualization

Visual representation showing flow of funds:
```
                    Total 20% Pool: £12,116.18
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
    To Settlements                     To ORCAP Nostro
      £1,363.26                           £10,752.92
         │                                   │
    ┌────┴────┐                              │
    │ Mariia  │                         AR + NK
    │ £1,363  │                        Firm Earnings
    └─────────┘
```

### 5.4 Analytics Tab

**Current State:** Empty placeholder
**Required Build:**

#### 5.4.1 Dashboard Cards (Top Row)
- Total Revenue (YTD / Period)
- Total Expenses (YTD / Period)
- Net Profit (YTD / Period)
- ORCAP Nostro Earned (YTD / Period)
- Operations Override Paid (YTD / Period)
- Outstanding Settlements (Total)

#### 5.4.2 Revenue Analytics
- Revenue by Advisor (bar chart)
- Revenue by Source Bank (pie chart)
- Revenue trend over time (line chart)
- Top clients by revenue

#### 5.4.3 Expense Analytics
- Expense breakdown by category (pie chart)
- Expense trend over time (line chart)
- Shared vs Individual expenses
- Per-advisor expense burden

#### 5.4.4 Advisor Performance
- Revenue per advisor (ranking)
- Expense ratio per advisor (expenses / revenue)
- Net contribution per advisor
- Settlement status summary
- Month-over-month growth

#### 5.4.5 Firm Metrics
- Gross margin (Revenue - Expenses)
- Take rate (ORCAP Nostro + Ops Override) / Revenue
- Run rate projections
- Cash position estimate

### 5.5 Settings Tab

**Current State:** Basic structure
**Required Enhancements:**

#### 5.5.1 Advisors Management
- Add/Edit/Deactivate advisors
- Settlement balance management
- Bank payment details
- Associated clients list

#### 5.5.2 Clients Management
- Add/Edit clients
- Assign to advisor(s)
- Bank account references
- Revenue allocation rules

#### 5.5.3 Expense Allocation Rules
- Define shared expense list
- Configure denominator (5 advisors / 7 including AR+NK)
- Individual expense assignments
- Firm-only expense patterns

#### 5.5.4 Auto-Categorization Rules
- Pattern matching for revenue sources
- Pattern matching for expenses
- Default category assignments

#### 5.5.5 Operations Override Configuration
- Current recipient
- Percentage (default 10%)
- Payment details

#### 5.5.6 FX Settings
- Default rate source (API / Manual)
- Override permissions

### 5.6 Reporting Tab

**Current State:** Does not exist
**Required Build:**

#### 5.6.1 Standard Reports
- **Settlement Summary** - Single period breakdown
- **Advisor Statement** - Per-advisor detail for period
- **Settlement History** - All settlements for an advisor
- **Expense Report** - Categorized expense breakdown
- **Revenue Report** - Revenue by source/advisor

#### 5.6.2 Financial Statements
- **Income Statement** - P&L for period/YTD
- **Balance Sheet** - Assets, liabilities, equity
- **Cash Flow** - Inflows, outflows, net position

#### 5.6.3 Custom Reports
- Date range selection
- Filter by advisor/source/category
- Export to CSV/PDF

#### 5.6.4 Report Outputs
- On-screen preview
- PDF generation
- CSV export
- Print-friendly format

---

## 6. Auto-Categorization Rules

### 6.1 Revenue Source Patterns

```typescript
const revenuePatterns: AutoCategorizeRule[] = [
  // Partner Banks
  { pattern: /CBH WEALTH|CBH COMPAGNIE/i, category: 'revenue', source: 'CBH' },
  { pattern: /TBC BANK/i, category: 'revenue', source: 'TBC' },
  { pattern: /MAREX FINANCIAL/i, category: 'revenue', source: 'MAREX' },
  { pattern: /FIELDPOINT PRIVATE/i, category: 'revenue', source: 'FIELDPOINT' },
  { pattern: /VONTOBEL/i, category: 'revenue', source: 'VONTOBEL' },
  { pattern: /STRIPE PAYMENTS/i, category: 'revenue', source: 'STRIPE' },
  
  // Client direct payments (Wise)
  { pattern: /ROZOVA|IRINA.*ROZOVA/i, category: 'revenue', client: 'rozova' },
  { pattern: /GORDON MARK/i, category: 'revenue', client: 'gordon' },
  { pattern: /TATIANA GORN|GORN/i, category: 'revenue', client: 'gorn' },
  { pattern: /SMIRNOVA/i, category: 'revenue', client: 'smirnova' },
  { pattern: /KARPOVA/i, category: 'revenue', client: 'karpova' },
  { pattern: /SHNEIDEROV|SHNEYDEROV/i, category: 'revenue', client: 'shneiderov' },
];
```

### 6.2 Expense Patterns

```typescript
const expensePatterns: AutoCategorizeRule[] = [
  // Shared Operational
  { pattern: /HTL SUPPORT/i, category: 'shared', expenseType: 'HTL' },
  { pattern: /8X8 UK/i, category: 'shared', expenseType: '8X8' },
  { pattern: /SALESFORCE/i, category: 'shared', expenseType: 'SALESFORCE' },
  { pattern: /WORLDCHECK|WORLD CHECK/i, category: 'shared', expenseType: 'WORLDCHECK' },
  
  // Individual (needs manual advisor assignment)
  { pattern: /BUPA.*BUPA\d{11}/i, category: 'individual', expenseType: 'BUPA' },
  { pattern: /AXA PPP/i, category: 'individual', expenseType: 'AXA' },
  
  // Firm-only
  { pattern: /NETLIFY/i, category: 'firm-only', expenseType: 'HOSTING' },
  { pattern: /Google GSUITE/i, category: 'firm-only', expenseType: 'GOOGLE' },
  
  // Advisor Payments (outgoing)
  { pattern: /ALPHA WEALTH/i, category: 'advisor-payment', advisor: 'maks-balbaev' },
  { pattern: /REGENT CONSULTING/i, category: 'advisor-payment', advisor: 'operations-override' },
  { pattern: /NIKOLAI KLIMOV/i, category: 'advisor-payment', advisor: 'nikolai-klimov' },
  { pattern: /SERGEY ZHIRNOV/i, category: 'advisor-payment', advisor: 'sergey-zhirnov' },
  { pattern: /MARIIA FILATENKO|MARIA FILATENKO/i, category: 'advisor-payment', advisor: 'mariia-filatenko' },
  { pattern: /SAILAWAY/i, category: 'advisor-payment', advisor: 'yulia-mitraeva' },
  
  // Internal transfers (exclude)
  { pattern: /ORION RIDGE CAPITA/i, category: 'transfer' },
];
```

---

## 7. Database Schema Additions

### 7.1 New/Modified Tables (Dexie.js)

```typescript
// db.ts additions

interface SettlementBalanceHistory {
  id: string;
  advisorId: string;
  periodId: string;
  openingBalance: number;
  recoveryAmount: number;
  closingBalance: number;
  clearedDate?: Date;
  createdAt: Date;
}

interface FXRateLog {
  id: string;
  transactionId: string;
  originalCurrency: string;
  originalAmount: number;
  spotRate: number;
  actualRate: number;
  gbpAmount: number;
  fxPnL: number;  // (actualRate - spotRate) * originalAmount
  rateSource: 'api' | 'manual';
  createdAt: Date;
}

interface AuditLog {
  id: string;
  entityType: 'settlement' | 'transaction' | 'advisor' | 'settings';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'finalize';
  previousValue?: any;
  newValue?: any;
  userId: string;
  createdAt: Date;
}

// Updated Dexie schema
db.version(2).stores({
  transactions: '++id, date, type, category, advisorId, source',
  settlements: '++id, periodName, status, createdAt',
  advisors: '++id, name, isActive',
  clients: '++id, name, advisorId',
  settlementBalanceHistory: '++id, advisorId, periodId, createdAt',
  fxRateLog: '++id, transactionId, originalCurrency',
  auditLog: '++id, entityType, entityId, createdAt',
  settings: 'key'
});
```

---

## 8. FX Rate Integration

### 8.1 API Integration

Use frankfurter.app (free, no API key required):

```typescript
async function fetchSpotRate(
  from: string, 
  to: string, 
  date: string
): Promise<number> {
  try {
    const response = await fetch(
      `https://api.frankfurter.app/${date}?from=${from}&to=${to}`
    );
    const data = await response.json();
    return data.rates[to];
  } catch (error) {
    console.error('FX rate fetch failed:', error);
    return null; // Fallback to manual entry
  }
}
```

### 8.2 FX Handling Flow

1. Non-GBP transaction imported
2. Auto-fetch spot rate for transaction date
3. Calculate GBP equivalent at spot
4. Allow manual override with actual rate used
5. Store both rates
6. Calculate and track FX P&L

---

## 9. Implementation Priority

### Phase 1: Core Calculation Fix (CRITICAL)
1. Rewrite `settlementCalculator.ts` with correct 70/10/20 logic
2. Implement waterfall priority system
3. Add settlement balance tracking
4. Update `SettlementDetailView.tsx` to display correctly

### Phase 2: Data Import Enhancement
1. Add Wise CSV parser
2. Implement FX rate fetching
3. Enhance auto-categorization

### Phase 3: Settlement UI Refactor
1. Break up `SettlementDetailView.tsx`
2. Add waterfall visualization
3. Improve advisor detail cards
4. Add settlement history view

### Phase 4: Analytics Build
1. Dashboard cards
2. Charts and visualizations
3. Advisor performance metrics

### Phase 5: Reporting
1. Standard report templates
2. Financial statements
3. Export functionality

---

## 10. Testing Requirements

### 10.1 Calculation Tests

Create test cases using known data from November 2025:

```typescript
describe('Settlement Calculations', () => {
  it('should calculate 70/10/20 split correctly', () => {
    const netRevenue = 10000;
    const result = calculateDistribution(netRevenue);
    expect(result.advisorShare).toBe(7000);
    expect(result.operationsOverride).toBe(1000);
    expect(result.waterfallPool).toBe(2000);
  });
  
  it('should apply waterfall to settlement before ORCAP Nostro', () => {
    const netRevenue = 10000;
    const settlementBalance = 1500;
    const result = calculateDistribution(netRevenue, settlementBalance);
    expect(result.settlementRecovery).toBe(1500);
    expect(result.orcapNostro).toBe(500);
    expect(result.closingBalance).toBe(0);
  });
  
  it('should handle partial settlement recovery', () => {
    const netRevenue = 5000;
    const settlementBalance = 1500;
    const waterfallPool = netRevenue * 0.20; // 1000
    const result = calculateDistribution(netRevenue, settlementBalance);
    expect(result.settlementRecovery).toBe(1000);
    expect(result.orcapNostro).toBe(0);
    expect(result.closingBalance).toBe(500);
  });
});
```

### 10.2 November 2025 Verification

Use these known values to verify implementation:

| Advisor | AR+NK 20% (Expected) |
|---------|---------------------|
| Maks | £1,585.42 |
| Sergey | £2,227.00 |
| Mariia | £0 (→ settlement) |
| Yulia | £288.80 + £413.93 |
| **Total** | **£4,515.15** |

---

## 11. Success Criteria

The refactored TMS will be considered complete when:

1. ✅ Calculations match independently verified forensic analysis
2. ✅ All bank CSV formats import correctly
3. ✅ Waterfall logic correctly prioritizes settlements
4. ✅ Settlement history is tracked with clearance dates
5. ✅ FX transactions handled with rate tracking
6. ✅ Analytics dashboard provides meaningful insights
7. ✅ Reports can be generated for any period
8. ✅ All existing functionality preserved
9. ✅ November 2025 test case passes verification

---

## Appendices

### Appendix A: Advisor Reference Data
See accompanying file: `ORCAP-TMS-Reference-Data.ts`

### Appendix B: Detailed Calculation Examples
See accompanying file: `ORCAP-TMS-Calculation-Engine.md`

---

*Document Version: 1.0*
*Created: 14 December 2025*
*Author: AR + Claude*
