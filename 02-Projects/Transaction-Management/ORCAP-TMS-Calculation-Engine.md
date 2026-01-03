# ORCAP TMS - Calculation Engine Specification

## Document Purpose

This document provides detailed pseudocode, flowcharts, and logic specifications for the core calculation engine. Use alongside the main specification and reference data.

---

## 1. High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SETTLEMENT CALCULATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   IMPORT     │───▶│  CATEGORIZE  │───▶│   ALLOCATE   │───▶│  CALCULATE   │
│ Transactions │    │ & Auto-Match │    │  to Advisors │    │ Distribution │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                   │
                    ┌──────────────┐    ┌──────────────┐           │
                    │   REPORTS    │◀───│   FINALIZE   │◀──────────┘
                    │  & Export    │    │  & Pay       │
                    └──────────────┘    └──────────────┘
```

---

## 2. Transaction Processing Pipeline

### 2.1 Import Flow

```typescript
function processImport(file: File): ImportResult {
  // Step 1: Detect format
  const format = detectBankFormat(file);
  
  // Step 2: Parse based on format
  const rawTransactions = format === 'lloyds' 
    ? parseLloydsCSV(file) 
    : parseWiseCSV(file);
  
  // Step 3: Normalize to common format
  const normalized = rawTransactions.map(tx => normalizeTransaction(tx, format));
  
  // Step 4: Deduplicate against existing
  const newTransactions = deduplicate(normalized, existingTransactions);
  
  // Step 5: Auto-categorize
  const categorized = newTransactions.map(tx => autoCategorize(tx));
  
  // Step 6: FX processing for non-GBP
  const fxProcessed = await processFxRates(categorized);
  
  // Step 7: Persist
  await saveTransactions(fxProcessed);
  
  return {
    total: rawTransactions.length,
    new: newTransactions.length,
    duplicates: rawTransactions.length - newTransactions.length,
    categorized: categorized.filter(t => t.category !== 'uncategorized').length,
    uncategorized: categorized.filter(t => t.category === 'uncategorized').length,
  };
}
```

### 2.2 Format Detection

```typescript
function detectBankFormat(file: File): 'lloyds' | 'wise' {
  const firstLine = readFirstLine(file);
  const headers = firstLine.split(',');
  
  if (headers.includes('Transaction Date') && headers.includes('Sort Code')) {
    return 'lloyds';
  }
  
  if (headers.includes('TransferWise ID') || headers.includes('Currency')) {
    return 'wise';
  }
  
  throw new Error('Unknown bank format');
}
```

### 2.3 Wise CSV Special Handling

```typescript
function parseWiseCSV(file: File): WiseTransaction[] {
  const rows = parseCSV(file);
  
  return rows
    .map(row => ({
      id: row['TransferWise ID'],
      date: parseWiseDate(row['Date']), // DD-MM-YYYY
      amount: parseFloat(row['Amount']),
      currency: row['Currency'],
      description: row['Description'],
      reference: row['Payment Reference'],
      payerName: row['Payer Name'],
      payeeName: row['Payee Name'],
      type: row['Transaction Type'], // CREDIT or DEBIT
      detailType: row['Transaction Details Type'],
      fxFrom: row['Exchange From'],
      fxTo: row['Exchange To'],
      fxRate: parseFloat(row['Exchange Rate']) || null,
    }))
    .filter(tx => {
      // EXCLUDE internal conversions
      if (tx.detailType === 'CONVERSION') {
        // Log for FX tracking but don't include in transactions
        logFxConversion(tx);
        return false;
      }
      return true;
    });
}
```

---

## 3. Auto-Categorization Engine

### 3.1 Categorization Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AUTO-CATEGORIZATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

                         Transaction
                              │
                              ▼
                   ┌──────────────────┐
                   │ Is Credit/Debit? │
                   └────────┬─────────┘
                            │
           ┌────────────────┴────────────────┐
           │                                 │
        CREDIT                            DEBIT
           │                                 │
           ▼                                 ▼
   ┌───────────────┐                ┌───────────────┐
   │ Match Revenue │                │ Match Expense │
   │   Patterns    │                │   Patterns    │
   └───────┬───────┘                └───────┬───────┘
           │                                 │
           ▼                                 ▼
   ┌───────────────┐                ┌───────────────┐
   │ Match Client  │                │ Shared/Indiv/ │
   │   Patterns    │                │ Firm/Excluded │
   └───────┬───────┘                └───────┬───────┘
           │                                 │
           ▼                                 ▼
   ┌───────────────┐                ┌───────────────┐
   │   Assign      │                │   Assign      │
   │   Category    │                │   Category    │
   └───────────────┘                └───────────────┘
```

### 3.2 Categorization Algorithm

```typescript
function autoCategorize(tx: Transaction): CategorizedTransaction {
  const description = tx.description.toUpperCase();
  
  // Check for transfers (exclude from calculations)
  if (transferPatterns.some(p => p.test(description))) {
    return { ...tx, category: 'transfer' };
  }
  
  if (tx.amount > 0) {
    // CREDIT - likely revenue
    return categorizeRevenue(tx);
  } else {
    // DEBIT - likely expense or payment
    return categorizeExpense(tx);
  }
}

function categorizeRevenue(tx: Transaction): CategorizedTransaction {
  const description = tx.description.toUpperCase();
  
  // Match revenue source
  const sourceMatch = revenueSourceRules.find(r => r.pattern.test(description));
  
  // Match client
  const clientMatch = clientRevenuePatterns.find(r => r.pattern.test(description));
  
  return {
    ...tx,
    category: 'revenue',
    revenueSource: sourceMatch?.source || 'unknown',
    suggestedAdvisor: clientMatch?.advisorId || null,
    autoMatched: !!(sourceMatch || clientMatch),
  };
}

function categorizeExpense(tx: Transaction): CategorizedTransaction {
  const description = tx.description.toUpperCase();
  
  // Check for advisor payment
  const advisorMatch = advisorPaymentPatterns.find(p => p.pattern.test(description));
  if (advisorMatch) {
    return {
      ...tx,
      category: 'advisor-payment',
      advisorId: advisorMatch.advisorId,
      autoMatched: true,
    };
  }
  
  // Match expense type
  const expenseMatch = expenseRules.find(r => r.pattern.test(description));
  if (expenseMatch) {
    return {
      ...tx,
      category: expenseMatch.category,
      expenseType: expenseMatch.expenseType,
      advisorId: expenseMatch.advisorId || null, // For individual expenses
      autoMatched: true,
    };
  }
  
  // Unknown - requires manual categorization
  return {
    ...tx,
    category: 'uncategorized',
    autoMatched: false,
  };
}
```

---

## 4. Settlement Calculation Engine

### 4.1 Master Calculation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SETTLEMENT CALCULATION ENGINE                        │
└─────────────────────────────────────────────────────────────────────────┘

FOR EACH Settlement Period:

┌──────────────────┐
│ 1. Get Revenue   │
│    Transactions  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Get Expense   │
│    Transactions  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Calculate     │
│    Shared Pool   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Get Settlement│
│    Balances      │
└────────┬─────────┘
         │
         ▼
FOR EACH Active Advisor:
         │
         ▼
┌──────────────────┐
│ 5. Sum Allocated │
│    Revenue       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 6. Calculate     │
│    Expenses      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 7. Calculate Net │
│    Distributable │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 8. Apply 70/10/20│
│    Split         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 9. Apply         │
│    Waterfall     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 10. Update       │
│     Balances     │
└──────────────────┘
```

### 4.2 Detailed Calculation Function

```typescript
interface SettlementCalculationInput {
  periodId: string;
  revenueTransactions: Transaction[];
  expenseTransactions: Transaction[];
  activeAdvisors: Advisor[];
  settlementBalances: Map<string, number>;
}

interface SettlementCalculationOutput {
  advisorResults: AdvisorSettlementResult[];
  periodTotals: PeriodTotals;
  settlementChanges: SettlementBalanceChange[];
}

function calculateSettlement(input: SettlementCalculationInput): SettlementCalculationOutput {
  const { 
    periodId, 
    revenueTransactions, 
    expenseTransactions, 
    activeAdvisors, 
    settlementBalances 
  } = input;
  
  // =========================================================================
  // STEP 1: Calculate Shared Expense Pool
  // =========================================================================
  const sharedExpenses = expenseTransactions
    .filter(tx => tx.category === 'shared')
    .reduce((sum, tx) => sum + Math.abs(tx.gbpAmount), 0);
  
  // Determine denominator (configurable: advisors only or advisors + owners)
  const denominator = sharedExpenseConfig.includeOwnersInDenominator
    ? activeAdvisors.length + 2  // +2 for AR and NK
    : activeAdvisors.length;
  
  const sharedExpensePerAdvisor = sharedExpenses / denominator;
  
  // =========================================================================
  // STEP 2: Calculate Per-Advisor Results
  // =========================================================================
  const advisorResults: AdvisorSettlementResult[] = activeAdvisors.map(advisor => {
    
    // ----- Revenue -----
    const advisorRevenue = revenueTransactions
      .filter(tx => tx.allocatedTo === advisor.id)
      .reduce((sum, tx) => {
        // Handle split transactions
        if (tx.splits && tx.splits.length > 0) {
          const split = tx.splits.find(s => s.advisorId === advisor.id);
          return sum + (split?.amount ?? 0);
        }
        return sum + tx.gbpAmount;
      }, 0);
    
    // ----- Individual Expenses -----
    const individualExpenses = expenseTransactions
      .filter(tx => tx.category === 'individual' && tx.advisorId === advisor.id)
      .reduce((sum, tx) => sum + Math.abs(tx.gbpAmount), 0);
    
    // ----- Total Expenses -----
    const totalExpenses = individualExpenses + sharedExpensePerAdvisor;
    
    // ----- Net Distributable -----
    const netDistributable = advisorRevenue - totalExpenses;
    
    // ----- Handle Negative Balance -----
    if (netDistributable <= 0) {
      return {
        advisorId: advisor.id,
        advisorName: advisor.displayName,
        
        grossRevenue: advisorRevenue,
        individualExpenses,
        sharedExpenses: sharedExpensePerAdvisor,
        totalExpenses,
        netDistributable,
        
        // All distribution amounts are 0
        advisorShare70: 0,
        operationsOverride10: 0,
        waterfallPool20: 0,
        settlementRecovery: 0,
        orcapNostro: 0,
        
        // Carry forward as debt
        carryForwardDebt: Math.abs(netDistributable),
        
        // Settlement unchanged
        settlementOpening: settlementBalances.get(advisor.id) ?? 0,
        settlementClosing: settlementBalances.get(advisor.id) ?? 0,
        settlementCleared: false,
      };
    }
    
    // ----- Apply 70/10/20 Split -----
    const advisorShare70 = netDistributable * distributionConfig.advisorShare;
    const operationsOverride10 = netDistributable * distributionConfig.operationsOverride;
    const waterfallPool20 = netDistributable * distributionConfig.waterfallPool;
    
    // ----- Apply Waterfall Logic -----
    const settlementOpening = settlementBalances.get(advisor.id) ?? 0;
    let settlementRecovery = 0;
    let orcapNostro = 0;
    let settlementClosing = settlementOpening;
    let settlementCleared = false;
    
    if (settlementOpening > 0) {
      // Settlement still outstanding
      if (waterfallPool20 >= settlementOpening) {
        // Full clearance
        settlementRecovery = settlementOpening;
        orcapNostro = waterfallPool20 - settlementOpening;
        settlementClosing = 0;
        settlementCleared = true;
      } else {
        // Partial recovery
        settlementRecovery = waterfallPool20;
        orcapNostro = 0;
        settlementClosing = settlementOpening - waterfallPool20;
      }
    } else {
      // No settlement - all to ORCAP Nostro
      orcapNostro = waterfallPool20;
    }
    
    return {
      advisorId: advisor.id,
      advisorName: advisor.displayName,
      
      grossRevenue: advisorRevenue,
      individualExpenses,
      sharedExpenses: sharedExpensePerAdvisor,
      totalExpenses,
      netDistributable,
      
      advisorShare70,
      operationsOverride10,
      waterfallPool20,
      settlementRecovery,
      orcapNostro,
      
      carryForwardDebt: 0,
      
      settlementOpening,
      settlementClosing,
      settlementCleared,
    };
  });
  
  // =========================================================================
  // STEP 3: Calculate Period Totals
  // =========================================================================
  const periodTotals: PeriodTotals = {
    totalRevenue: sum(advisorResults, 'grossRevenue'),
    totalExpenses: sum(advisorResults, 'totalExpenses'),
    totalNetDistributable: sum(advisorResults, 'netDistributable'),
    
    totalToAdvisors: sum(advisorResults, 'advisorShare70'),
    totalOperationsOverride: sum(advisorResults, 'operationsOverride10'),
    totalWaterfallPool: sum(advisorResults, 'waterfallPool20'),
    totalSettlementRecovery: sum(advisorResults, 'settlementRecovery'),
    totalOrcapNostro: sum(advisorResults, 'orcapNostro'),
    
    sharedExpensePool: sharedExpenses,
    firmOnlyExpenses: expenseTransactions
      .filter(tx => tx.category === 'firm-only')
      .reduce((sum, tx) => sum + Math.abs(tx.gbpAmount), 0),
    
    advisorCount: activeAdvisors.length,
  };
  
  // =========================================================================
  // STEP 4: Generate Settlement Balance Changes
  // =========================================================================
  const settlementChanges: SettlementBalanceChange[] = advisorResults
    .filter(r => r.settlementOpening !== r.settlementClosing)
    .map(r => ({
      advisorId: r.advisorId,
      periodId,
      openingBalance: r.settlementOpening,
      recoveryAmount: r.settlementRecovery,
      closingBalance: r.settlementClosing,
      cleared: r.settlementCleared,
      clearedDate: r.settlementCleared ? new Date() : undefined,
    }));
  
  return {
    advisorResults,
    periodTotals,
    settlementChanges,
  };
}

// Utility function
function sum<T>(array: T[], key: keyof T): number {
  return array.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}
```

---

## 5. Waterfall Priority System

### 5.1 Visual Representation

```
                        ┌─────────────────────────┐
                        │   20% Waterfall Pool    │
                        │       £6,000.00         │
                        └───────────┬─────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               │
         ┌─────────────────────┐                   │
         │ Advisor Settlement  │                   │
         │    Outstanding?     │                   │
         └──────────┬──────────┘                   │
                    │                               │
         ┌──────────┴──────────┐                   │
         │                     │                   │
        YES                   NO                   │
         │                     │                   │
         ▼                     │                   │
┌─────────────────────┐        │                   │
│ Settlement Balance  │        │                   │
│     £2,000.00       │        │                   │
└──────────┬──────────┘        │                   │
           │                   │                   │
           ▼                   │                   │
┌─────────────────────┐        │                   │
│ 20% >= Settlement?  │        │                   │
└──────────┬──────────┘        │                   │
           │                   │                   │
    ┌──────┴──────┐            │                   │
    │             │            │                   │
   YES           NO            │                   │
    │             │            │                   │
    ▼             ▼            │                   │
┌────────┐  ┌────────┐         │                   │
│ Clear  │  │Partial │         │                   │
│£2,000  │  │£6,000  │         │                   │
│        │  │        │         │                   │
│Overflow│  │Balance │         │                   │
│£4,000  │  │-£4,000 │         │                   │
│to ORCAP│  │remains │         │                   │
└────────┘  └────────┘         │                   │
                               │                   │
                               ▼                   │
                     ┌─────────────────────┐       │
                     │   ORCAP Nostro      │◀──────┘
                     │    (AR + NK)        │
                     │                     │
                     │  Full 20% if no     │
                     │  settlement, or     │
                     │  overflow after     │
                     │  clearance          │
                     └─────────────────────┘
```

### 5.2 Waterfall Decision Table

| Scenario | Settlement Balance | 20% Pool | To Settlement | To ORCAP | New Balance |
|----------|-------------------|----------|---------------|----------|-------------|
| No settlement | £0 | £1,000 | £0 | £1,000 | £0 |
| Partial recovery | £3,000 | £1,000 | £1,000 | £0 | £2,000 |
| Exact clearance | £1,000 | £1,000 | £1,000 | £0 | £0 ✓ |
| Overflow | £500 | £1,000 | £500 | £500 | £0 ✓ |
| Large overflow | £100 | £2,000 | £100 | £1,900 | £0 ✓ |

---

## 6. FX Rate Handling

### 6.1 FX Processing Flow

```typescript
async function processFxRates(transactions: Transaction[]): Promise<Transaction[]> {
  const nonGbpTransactions = transactions.filter(tx => 
    tx.originalCurrency && tx.originalCurrency !== 'GBP'
  );
  
  // Batch fetch spot rates by date to minimize API calls
  const dateRates = new Map<string, Map<string, number>>();
  
  for (const tx of nonGbpTransactions) {
    const dateKey = formatDate(tx.date);
    
    if (!dateRates.has(dateKey)) {
      dateRates.set(dateKey, new Map());
    }
    
    const dayRates = dateRates.get(dateKey)!;
    
    if (!dayRates.has(tx.originalCurrency)) {
      try {
        const rate = await fetchSpotRate(tx.originalCurrency, 'GBP', dateKey);
        dayRates.set(tx.originalCurrency, rate);
      } catch (error) {
        console.error(`Failed to fetch rate for ${tx.originalCurrency} on ${dateKey}`);
        dayRates.set(tx.originalCurrency, null); // Will require manual entry
      }
    }
  }
  
  // Apply rates to transactions
  return transactions.map(tx => {
    if (!tx.originalCurrency || tx.originalCurrency === 'GBP') {
      return tx;
    }
    
    const spotRate = dateRates.get(formatDate(tx.date))?.get(tx.originalCurrency);
    
    return {
      ...tx,
      spotRate: spotRate ?? null,
      fxRate: spotRate ?? null, // Default to spot, allow override
      gbpAmount: spotRate ? tx.originalAmount * spotRate : null,
      fxRateSource: spotRate ? 'api' : 'manual-required',
    };
  });
}
```

### 6.2 FX P&L Calculation

```typescript
function calculateFxPnL(tx: Transaction): number | null {
  if (!tx.originalCurrency || tx.originalCurrency === 'GBP') {
    return null;
  }
  
  if (!tx.spotRate || !tx.fxRate) {
    return null;
  }
  
  // P&L = (Actual Rate - Spot Rate) × Original Amount
  // Positive = gain (got more GBP than spot suggested)
  // Negative = loss (got less GBP than spot suggested)
  return (tx.fxRate - tx.spotRate) * tx.originalAmount;
}
```

---

## 7. Historical Period Calculation

### 7.1 Point-in-Time Reconstruction

To calculate a historical period AS IF running at that time:

```typescript
async function calculateHistoricalPeriod(
  periodDate: Date,
  options: { useHistoricalSettlements: boolean }
): Promise<SettlementCalculationOutput> {
  
  // Get transactions within period
  const periodTransactions = await getTransactionsForPeriod(periodDate);
  
  // Get settlement balances AS OF that period
  let settlementBalances: Map<string, number>;
  
  if (options.useHistoricalSettlements) {
    // Use historical snapshot
    settlementBalances = await getSettlementBalancesAsOf(periodDate);
  } else {
    // Use current balances (for what-if analysis)
    settlementBalances = await getCurrentSettlementBalances();
  }
  
  // Get active advisors AS OF that period
  const activeAdvisors = await getActiveAdvisorsAsOf(periodDate);
  
  // Run calculation
  return calculateSettlement({
    periodId: formatPeriodId(periodDate),
    revenueTransactions: periodTransactions.filter(t => t.category === 'revenue'),
    expenseTransactions: periodTransactions.filter(t => 
      ['shared', 'individual', 'firm-only'].includes(t.category)
    ),
    activeAdvisors,
    settlementBalances,
  });
}
```

### 7.2 Settlement Balance History Tracking

```typescript
interface SettlementHistoryEntry {
  id: string;
  advisorId: string;
  periodId: string;
  periodName: string;
  openingBalance: number;
  grossRevenue: number;
  netDistributable: number;
  waterfallPool20: number;
  recoveryAmount: number;
  closingBalance: number;
  clearedThisPeriod: boolean;
  clearedDate?: Date;
  createdAt: Date;
}

async function recordSettlementHistory(
  result: AdvisorSettlementResult,
  periodId: string,
  periodName: string
): Promise<void> {
  const entry: SettlementHistoryEntry = {
    id: generateId(),
    advisorId: result.advisorId,
    periodId,
    periodName,
    openingBalance: result.settlementOpening,
    grossRevenue: result.grossRevenue,
    netDistributable: result.netDistributable,
    waterfallPool20: result.waterfallPool20,
    recoveryAmount: result.settlementRecovery,
    closingBalance: result.settlementClosing,
    clearedThisPeriod: result.settlementCleared,
    clearedDate: result.settlementCleared ? new Date() : undefined,
    createdAt: new Date(),
  };
  
  await db.settlementHistory.add(entry);
}
```

---

## 8. Validation & Error Handling

### 8.1 Pre-Calculation Validation

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

function validateSettlementPeriod(period: SettlementPeriod): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Check all revenue is allocated
  const unallocatedRevenue = period.revenueTransactions.filter(
    tx => !tx.allocatedTo && (!tx.splits || tx.splits.length === 0)
  );
  if (unallocatedRevenue.length > 0) {
    errors.push({
      code: 'UNALLOCATED_REVENUE',
      message: `${unallocatedRevenue.length} revenue transactions not allocated to any advisor`,
      transactions: unallocatedRevenue.map(tx => tx.id),
    });
  }
  
  // Check individual expenses have advisor assignment
  const unassignedIndividual = period.expenseTransactions.filter(
    tx => tx.category === 'individual' && !tx.advisorId
  );
  if (unassignedIndividual.length > 0) {
    errors.push({
      code: 'UNASSIGNED_INDIVIDUAL_EXPENSE',
      message: `${unassignedIndividual.length} individual expenses not assigned to advisor`,
      transactions: unassignedIndividual.map(tx => tx.id),
    });
  }
  
  // Check for uncategorized transactions
  const uncategorized = [
    ...period.revenueTransactions,
    ...period.expenseTransactions,
  ].filter(tx => tx.category === 'uncategorized');
  if (uncategorized.length > 0) {
    warnings.push({
      code: 'UNCATEGORIZED_TRANSACTIONS',
      message: `${uncategorized.length} transactions remain uncategorized`,
      transactions: uncategorized.map(tx => tx.id),
    });
  }
  
  // Check FX rates
  const missingFxRates = period.revenueTransactions.filter(
    tx => tx.originalCurrency !== 'GBP' && !tx.fxRate
  );
  if (missingFxRates.length > 0) {
    errors.push({
      code: 'MISSING_FX_RATE',
      message: `${missingFxRates.length} non-GBP transactions missing FX rate`,
      transactions: missingFxRates.map(tx => tx.id),
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

### 8.2 Post-Calculation Verification

```typescript
function verifyCalculationIntegrity(result: SettlementCalculationOutput): boolean {
  const { advisorResults, periodTotals } = result;
  
  // Verify 70/10/20 split sums correctly for each advisor
  for (const advisor of advisorResults) {
    if (advisor.netDistributable > 0) {
      const splitSum = advisor.advisorShare70 
        + advisor.operationsOverride10 
        + advisor.waterfallPool20;
      
      if (Math.abs(splitSum - advisor.netDistributable) > 0.01) {
        console.error(`Split sum mismatch for ${advisor.advisorName}`);
        return false;
      }
    }
    
    // Verify waterfall components sum to pool
    const waterfallSum = advisor.settlementRecovery + advisor.orcapNostro;
    if (Math.abs(waterfallSum - advisor.waterfallPool20) > 0.01) {
      console.error(`Waterfall sum mismatch for ${advisor.advisorName}`);
      return false;
    }
  }
  
  // Verify period totals
  const calculatedTotal = advisorResults.reduce(
    (sum, a) => sum + a.orcapNostro, 
    0
  );
  if (Math.abs(calculatedTotal - periodTotals.totalOrcapNostro) > 0.01) {
    console.error('Period total ORCAP Nostro mismatch');
    return false;
  }
  
  return true;
}
```

---

## 9. Test Cases

### 9.1 Unit Test Examples

```typescript
describe('Distribution Calculations', () => {
  
  test('70/10/20 split on positive net distributable', () => {
    const netDistributable = 10000;
    
    const result = applyDistributionSplit(netDistributable);
    
    expect(result.advisorShare).toBe(7000);
    expect(result.operationsOverride).toBe(1000);
    expect(result.waterfallPool).toBe(2000);
    expect(result.advisorShare + result.operationsOverride + result.waterfallPool)
      .toBe(netDistributable);
  });
  
  test('zero distribution on negative net distributable', () => {
    const netDistributable = -500;
    
    const result = applyDistributionSplit(netDistributable);
    
    expect(result.advisorShare).toBe(0);
    expect(result.operationsOverride).toBe(0);
    expect(result.waterfallPool).toBe(0);
    expect(result.carryForwardDebt).toBe(500);
  });
  
});

describe('Waterfall Logic', () => {
  
  test('full amount to ORCAP when no settlement', () => {
    const waterfallPool = 2000;
    const settlementBalance = 0;
    
    const result = applyWaterfall(waterfallPool, settlementBalance);
    
    expect(result.settlementRecovery).toBe(0);
    expect(result.orcapNostro).toBe(2000);
    expect(result.closingBalance).toBe(0);
    expect(result.cleared).toBe(false);
  });
  
  test('partial recovery when pool less than settlement', () => {
    const waterfallPool = 1000;
    const settlementBalance = 3000;
    
    const result = applyWaterfall(waterfallPool, settlementBalance);
    
    expect(result.settlementRecovery).toBe(1000);
    expect(result.orcapNostro).toBe(0);
    expect(result.closingBalance).toBe(2000);
    expect(result.cleared).toBe(false);
  });
  
  test('full clearance with overflow', () => {
    const waterfallPool = 2000;
    const settlementBalance = 500;
    
    const result = applyWaterfall(waterfallPool, settlementBalance);
    
    expect(result.settlementRecovery).toBe(500);
    expect(result.orcapNostro).toBe(1500);
    expect(result.closingBalance).toBe(0);
    expect(result.cleared).toBe(true);
  });
  
  test('exact clearance', () => {
    const waterfallPool = 1500;
    const settlementBalance = 1500;
    
    const result = applyWaterfall(waterfallPool, settlementBalance);
    
    expect(result.settlementRecovery).toBe(1500);
    expect(result.orcapNostro).toBe(0);
    expect(result.closingBalance).toBe(0);
    expect(result.cleared).toBe(true);
  });
  
});

describe('November 2025 Verification', () => {
  
  test('AR+NK total matches expected £4,515.15', () => {
    const result = calculateSettlement(november2025Data);
    
    expect(result.periodTotals.totalOrcapNostro).toBeCloseTo(4515.15, 2);
  });
  
  test('Mariia settlement recovery to settlement not ORCAP', () => {
    const result = calculateSettlement(november2025Data);
    const mariia = result.advisorResults.find(a => a.advisorId === 'mariia-filatenko');
    
    expect(mariia.settlementRecovery).toBeGreaterThan(0);
    expect(mariia.orcapNostro).toBe(0);
  });
  
});
```

---

## 10. Performance Considerations

### 10.1 Optimization Strategies

```typescript
// Memoize expensive calculations
const memoizedCalculation = useMemo(() => {
  return calculateSettlement(input);
}, [input.periodId, input.revenueTransactions.length, input.expenseTransactions.length]);

// Batch database operations
async function saveSettlementResults(results: SettlementCalculationOutput): Promise<void> {
  await db.transaction('rw', 
    [db.settlements, db.settlementHistory, db.advisorBalances], 
    async () => {
      // All operations in single transaction
      await db.settlements.put(results.periodTotals);
      await db.settlementHistory.bulkAdd(results.settlementChanges);
      
      for (const advisor of results.advisorResults) {
        await db.advisorBalances.update(advisor.advisorId, {
          settlementBalance: advisor.settlementClosing
        });
      }
    }
  );
}
```

---

*Document Version: 1.0*
*Created: 14 December 2025*
*Author: AR + Claude*
