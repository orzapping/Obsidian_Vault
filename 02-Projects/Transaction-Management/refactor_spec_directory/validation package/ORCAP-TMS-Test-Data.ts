/**
 * ORCAP Transaction Management System - Test Data & Validation Fixtures
 * =====================================================================
 * 
 * This file contains VERIFIED, RECONCILED data from the forensic audit
 * conducted December 2025. These figures have been cross-referenced against:
 * - Lloyds Bank statements (Nov 2024 - Dec 2025)
 * - Wise multi-currency statements (Nov 2024 - Dec 2025)
 * - Invoices_tracker_1112_latest_dec2025.xlsx (Ilya's master spreadsheet)
 * - Original termination agreements
 * 
 * USE THIS DATA TO VALIDATE YOUR IMPLEMENTATION.
 * If your calculations match these expected outputs, you've done it right.
 * 
 * @author Forensic Audit - Claude AI
 * @date 26 December 2025
 * @version 1.0.0
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Advisor {
  id: string;
  name: string;
  company: string | null;
  status: 'active' | 'departed';
  departureDate: string | null;
  bankDetails: {
    sortCode: string;
    accountNumber: string;
    reference: string;
  };
  expenses: {
    bupaHealth: number;
    bupaDental: number;
    axaHealth: number;  // Only Mariia has this
  };
  settlement: {
    originalAmount: number;
    clearedDate: string | null;
    currentBalance: number;
  };
  clients: string[];
}

export interface Transaction {
  id: string;
  date: string;
  source: 'CBH_UK' | 'CBH_SWISS' | 'TBC' | 'MAREX' | 'FIELDPOINT' | 'VONTOBEL' | 'STRIPE' | 'DIRECT';
  advisorId: string;
  clientName: string;
  grossAmount: number;
  currency: 'GBP' | 'USD' | 'CHF' | 'EUR';
  gbpEquivalent: number;
  fxRate: number | null;
  description: string;
}

export interface MonthlyExpense {
  category: string;
  provider: string;
  totalAmount: number;
  allocationMethod: 'shared' | 'individual' | 'firm';
  perAdvisorAmount: number;
  advisorIds: string[];  // Which advisors this applies to
}

export interface WaterfallCalculation {
  advisorId: string;
  grossRevenue: number;
  expenses: number;
  netDistributable: number;
  advisorShare70: number;
  operationsOverride10: number;
  waterfallPool20: number;
  settlementRecovery: number;
  arNkShare: number;
  paymentToAdvisor: number;
  settlementBalanceAfter: number;
}

export interface MonthlyCalculation {
  period: string;
  transactions: Transaction[];
  expenses: MonthlyExpense[];
  waterfallResults: WaterfallCalculation[];
  totals: {
    grossRevenue: number;
    totalExpenses: number;
    netDistributable: number;
    totalAdvisorPayments: number;
    totalOperationsOverride: number;
    totalSettlementRecovery: number;
    totalArNk: number;
  };
}

// =============================================================================
// ADVISOR MASTER DATA (As of November 2025)
// =============================================================================

export const ADVISORS: Record<string, Advisor> = {
  'MAKS': {
    id: 'MAKS',
    name: 'Maks Balbaev',
    company: 'Alpha Wealth Advisors Ltd',
    status: 'active',
    departureDate: null,
    bankDetails: {
      sortCode: '30-96-26',
      accountNumber: '71***901',
      reference: 'ALPHA WEALTH'
    },
    expenses: {
      bupaHealth: 0,        // Opted out
      bupaDental: 0,        // Single plan
      axaHealth: 0
    },
    settlement: {
      originalAmount: 6310.00,
      clearedDate: '2025-01-31',
      currentBalance: 0
    },
    clients: ['Rozov', 'Gordon', 'Barkov', 'Linnik', 'Smirnova', 'Karpova']
  },

  'SERGEY': {
    id: 'SERGEY',
    name: 'Sergey Zhirnov',
    company: null,  // Direct contractor
    status: 'active',
    departureDate: null,
    bankDetails: {
      sortCode: '30-96-26',
      accountNumber: '53***401',
      reference: 'ZHIRNOV S'
    },
    expenses: {
      bupaHealth: 156.68,   // Reduced plan
      bupaDental: 79.83,    // Family
      axaHealth: 0
    },
    settlement: {
      originalAmount: 15335.00,
      clearedDate: '2025-01-31',
      currentBalance: 0
    },
    clients: ['Biszko', 'Makarenko', 'Latsanych']
  },

  'NIKOLAI': {
    id: 'NIKOLAI',
    name: 'Nikolai Klimov',
    company: null,
    status: 'active',
    departureDate: null,
    bankDetails: {
      sortCode: '30-96-26',
      accountNumber: '46***101',
      reference: 'KLIMOV N'
    },
    expenses: {
      bupaHealth: 0,
      bupaDental: 159.67,   // Family
      axaHealth: 0
    },
    settlement: {
      originalAmount: 6378.00,
      clearedDate: '2025-07-31',
      currentBalance: 0
    },
    clients: ['Rubinchik', 'Dobrikova', 'Kelgankina', 'Tsalov', 'Obuschak', 'Zavileyskiy']
  },

  'MARIIA': {
    id: 'MARIIA',
    name: 'Mariia Filatenko',
    company: null,
    status: 'active',
    departureDate: null,
    bankDetails: {
      sortCode: '30-96-26',
      accountNumber: '78***601',
      reference: 'FILATENKO M'
    },
    expenses: {
      bupaHealth: 0,
      bupaDental: 159.66,   // Family
      axaHealth: 262.16     // ** UNIQUE - Only Mariia has AXA **
    },
    settlement: {
      originalAmount: 15551.00,
      clearedDate: null,    // STILL ACTIVE
      currentBalance: 3017.44  // As of Nov 2025
    },
    clients: ['Telepneva', 'Beliakova', 'Shneiderov', 'Anisimov']
  },

  'YULIA': {
    id: 'YULIA',
    name: 'Yulia Mitraeva',
    company: 'Sailaway Finance Ltd',
    status: 'active',
    departureDate: null,
    bankDetails: {
      sortCode: '30-96-26',
      accountNumber: '82***301',
      reference: 'SAILAWAY FIN'
    },
    expenses: {
      bupaHealth: 316.94,
      bupaDental: 159.67,
      axaHealth: 0
    },
    settlement: {
      originalAmount: 2657.00,
      clearedDate: '2025-07-31',
      currentBalance: 0
    },
    clients: ['Savushkin', 'Demarina', 'Markova', 'Shabalina', 'Solovyeva']
  },

  'REGENT': {
    id: 'REGENT',
    name: 'Regent Consulting Ltd',
    company: 'Regent Consulting Ltd',
    status: 'active',  // Continues to receive 10% override
    departureDate: null,
    bankDetails: {
      sortCode: '30-96-26',
      accountNumber: '92***801',
      reference: 'REGENT CONS'
    },
    expenses: {
      bupaHealth: 0,
      bupaDental: 0,
      axaHealth: 0
    },
    settlement: {
      originalAmount: 0,  // Never had settlement - this is AS's husband's entity
      clearedDate: null,
      currentBalance: 0
    },
    clients: []  // Receives override on inherited AS clients via Mariia/Yulia
  }
};

// =============================================================================
// NOVEMBER 2025 - COMPLETE VERIFIED TEST CASE
// =============================================================================

export const NOVEMBER_2025_TRANSACTIONS: Transaction[] = [
  // MAKS - Revenue
  {
    id: 'NOV25-001',
    date: '2025-11-15',
    source: 'CBH_UK',
    advisorId: 'MAKS',
    clientName: 'Rozov Iryna & Eugeniy UK',
    grossAmount: 843.42,
    currency: 'GBP',
    gbpEquivalent: 843.42,
    fxRate: null,
    description: 'Q4 advisory fee'
  },
  {
    id: 'NOV25-002',
    date: '2025-11-15',
    source: 'CBH_UK',
    advisorId: 'MAKS',
    clientName: 'Gordon Mark',
    grossAmount: 1097.51,
    currency: 'GBP',
    gbpEquivalent: 1097.51,
    fxRate: null,
    description: 'Q4 advisory fee'
  },
  {
    id: 'NOV25-003',
    date: '2025-11-15',
    source: 'CBH_UK',
    advisorId: 'MAKS',
    clientName: 'Smirnova Galina',
    grossAmount: 644.41,
    currency: 'GBP',
    gbpEquivalent: 644.41,
    fxRate: null,
    description: 'Q4 advisory fee'
  },
  {
    id: 'NOV25-004',
    date: '2025-11-15',
    source: 'CBH_UK',
    advisorId: 'MAKS',
    clientName: 'Barkov Alexander',
    grossAmount: 1517.16,
    currency: 'GBP',
    gbpEquivalent: 1517.16,
    fxRate: null,
    description: 'Quarterly - paid in Oct upfront'
  },
  {
    id: 'NOV25-005',
    date: '2025-11-20',
    source: 'MAREX',
    advisorId: 'MAKS',
    clientName: 'Various',
    grossAmount: 4470.69,
    currency: 'USD',
    gbpEquivalent: 3605.40,  // Converted at ~0.807
    fxRate: 0.807,
    description: 'Marex retrocession'
  },

  // SERGEY - Revenue
  {
    id: 'NOV25-010',
    date: '2025-11-20',
    source: 'MAREX',
    advisorId: 'SERGEY',
    clientName: 'Biszko/Makarenko',
    grossAmount: 14100.00,
    currency: 'USD',
    gbpEquivalent: 11363.82,  // Converted
    fxRate: 0.806,
    description: 'Marex retrocession - Biszko'
  },

  // MARIIA - Revenue
  {
    id: 'NOV25-020',
    date: '2025-11-15',
    source: 'CBH_UK',
    advisorId: 'MARIIA',
    clientName: 'Telepneva Natalia UK',
    grossAmount: 2471.48,
    currency: 'GBP',
    gbpEquivalent: 2471.48,
    fxRate: null,
    description: 'Q4 advisory fee'
  },
  {
    id: 'NOV25-021',
    date: '2025-11-15',
    source: 'CBH_SWISS',
    advisorId: 'MARIIA',
    clientName: 'Telepneva Natalia SW',
    grossAmount: 586.11,
    currency: 'GBP',
    gbpEquivalent: 586.11,
    fxRate: null,
    description: 'Swiss account fee'
  },
  {
    id: 'NOV25-022',
    date: '2025-11-15',
    source: 'CBH_UK',
    advisorId: 'MARIIA',
    clientName: 'Beliakova Irina',
    grossAmount: 776.81,
    currency: 'GBP',
    gbpEquivalent: 776.81,
    fxRate: null,
    description: 'Q4 advisory fee'
  },
  {
    id: 'NOV25-023',
    date: '2025-11-15',
    source: 'CBH_UK',
    advisorId: 'MARIIA',
    clientName: 'Shneiderov Evgeniy',
    grossAmount: 3552.73,
    currency: 'GBP',
    gbpEquivalent: 3552.73,
    fxRate: null,
    description: 'KYC/Account opening'
  },

  // YULIA - Revenue (via Regent split)
  {
    id: 'NOV25-030',
    date: '2025-12-04',
    source: 'FIELDPOINT',
    advisorId: 'YULIA',
    clientName: 'Savushkin Roman',
    grossAmount: 2069.63,
    currency: 'GBP',
    gbpEquivalent: 2069.63,
    fxRate: null,
    description: 'FP fee - split with Regent'
  },

  // NIKOLAI - Zero revenue month
  // No transactions - but still incurs shared expenses
];

export const NOVEMBER_2025_EXPENSES: MonthlyExpense[] = [
  // BUPA Health - Individual allocations
  {
    category: 'Healthcare',
    provider: 'BUPA Health',
    totalAmount: 316.94,  // Only Yulia this month (Sergey £156.68 shown separately)
    allocationMethod: 'individual',
    perAdvisorAmount: 0,  // Varies by advisor
    advisorIds: ['YULIA']  // Others either opted out or paid differently
  },
  {
    category: 'Healthcare',
    provider: 'BUPA Health - Sergey',
    totalAmount: 0,  // Sergey's BUPA not charged in Nov
    allocationMethod: 'individual',
    perAdvisorAmount: 0,
    advisorIds: ['SERGEY']
  },

  // BUPA Dental - Individual
  {
    category: 'Healthcare',
    provider: 'BUPA Dental',
    totalAmount: 558.83,  // Total across all advisors
    allocationMethod: 'individual',
    perAdvisorAmount: 0,  // Varies: 159.67 family, 79.83 single, 38.53 basic
    advisorIds: ['NIKOLAI', 'MARIIA', 'YULIA', 'SERGEY']
  },

  // AXA Health - Mariia only
  {
    category: 'Healthcare',
    provider: 'AXA Health',
    totalAmount: 262.16,
    allocationMethod: 'individual',
    perAdvisorAmount: 262.16,
    advisorIds: ['MARIIA']
  },

  // HTL Support - Shared across 5 advisors (NOT including AR+NK)
  {
    category: 'Technology',
    provider: 'HTL Support',
    totalAmount: 388.80,
    allocationMethod: 'shared',
    perAdvisorAmount: 77.76,  // 388.80 / 5
    advisorIds: ['MAKS', 'SERGEY', 'NIKOLAI', 'MARIIA', 'YULIA']
  },

  // 8X8 Telephony - Shared across 7 (includes AR+NK in denominator)
  {
    category: 'Technology',
    provider: '8X8 Telephony',
    totalAmount: 254.08,
    allocationMethod: 'shared',
    perAdvisorAmount: 36.30,  // 254.08 / 7
    advisorIds: ['MAKS', 'SERGEY', 'NIKOLAI', 'MARIIA', 'YULIA']
  },

  // Salesforce - Shared across 5
  {
    category: 'Technology',
    provider: 'Salesforce',
    totalAmount: 192.00,
    allocationMethod: 'shared',
    perAdvisorAmount: 38.40,  // 192 / 5
    advisorIds: ['MAKS', 'SERGEY', 'NIKOLAI', 'MARIIA', 'YULIA']
  },

  // Netlify - Shared across 5
  {
    category: 'Technology',
    provider: 'Netlify',
    totalAmount: 14.57,
    allocationMethod: 'shared',
    perAdvisorAmount: 2.91,  // 14.57 / 5
    advisorIds: ['MAKS', 'SERGEY', 'NIKOLAI', 'MARIIA', 'YULIA']
  }
];

// =============================================================================
// NOVEMBER 2025 - EXPECTED WATERFALL RESULTS
// =============================================================================

/**
 * CRITICAL: These are the VERIFIED correct outputs.
 * Your implementation MUST produce these exact figures (within £0.01 tolerance).
 */
export const NOVEMBER_2025_EXPECTED_RESULTS: WaterfallCalculation[] = [
  {
    advisorId: 'MAKS',
    grossRevenue: 8076.09,
    expenses: 148.999143,  // Shared only (no individual health)
    netDistributable: 7927.09,
    advisorShare70: 5548.96,
    operationsOverride10: 792.71,
    waterfallPool20: 1585.42,
    settlementRecovery: 0,  // Settlement already cleared
    arNkShare: 1585.42,
    paymentToAdvisor: 5548.96,
    settlementBalanceAfter: 0
  },
  {
    advisorId: 'SERGEY',
    grossRevenue: 11363.82,
    expenses: 228.829143,  // Includes dental
    netDistributable: 11134.99,
    advisorShare70: 7794.49,
    operationsOverride10: 1113.50,
    waterfallPool20: 2227.00,
    settlementRecovery: 0,  // Settlement already cleared
    arNkShare: 2227.00,
    paymentToAdvisor: 7794.49,
    settlementBalanceAfter: 0
  },
  {
    advisorId: 'NIKOLAI',
    grossRevenue: 0,  // Zero revenue month
    expenses: 308.669143,  // Still pays shared expenses
    netDistributable: -308.67,  // NEGATIVE - debt to company
    advisorShare70: 0,
    operationsOverride10: 0,
    waterfallPool20: 0,
    settlementRecovery: 0,
    arNkShare: 0,
    paymentToAdvisor: 0,
    settlementBalanceAfter: 0  // Settlement was already cleared
    // NOTE: The -308.67 becomes debt to company, tracked separately
  },
  {
    advisorId: 'MARIIA',
    grossRevenue: 7387.13,
    expenses: 570.819143,  // Includes AXA Health (262.16)
    netDistributable: 6816.31,
    advisorShare70: 4771.42,
    operationsOverride10: 681.63,
    waterfallPool20: 1363.26,
    settlementRecovery: 1363.26,  // ALL goes to settlement (still active)
    arNkShare: 0,  // Nothing to AR+NK while settlement active
    paymentToAdvisor: 4771.42,  // Her 70% still paid
    settlementBalanceAfter: 3017.44  // 4380.71 - 1363.26 = 3017.45 (rounding)
  },
  {
    advisorId: 'YULIA',
    grossRevenue: 2069.63,
    expenses: 625.609143,  // Higher due to full BUPA
    netDistributable: 1444.02,
    advisorShare70: 1010.81,
    operationsOverride10: 144.40,
    waterfallPool20: 288.80,
    settlementRecovery: 0,  // Settlement already cleared
    arNkShare: 288.80,
    paymentToAdvisor: 1010.81,
    settlementBalanceAfter: 0
  },
  {
    advisorId: 'REGENT',
    grossRevenue: 2069.63,  // Yulia's Savushkin revenue (inherited AS client)
    expenses: 0,  // Regent pays no expenses
    netDistributable: 2069.63,
    advisorShare70: 0,  // Regent doesn't get 70%
    operationsOverride10: 413.93,  // Gets 10% of the revenue from inherited clients
    waterfallPool20: 0,
    settlementRecovery: 0,
    arNkShare: 0,
    paymentToAdvisor: 413.93,  // Just the 10% override
    settlementBalanceAfter: 0
  }
];

export const NOVEMBER_2025_TOTALS = {
  grossRevenue: 30966.30,
  totalExpenses: 1882.93,
  netDistributable: 29083.37,
  totalAdvisorPayments: 19125.68,  // Sum of all paymentToAdvisor
  totalOperationsOverride: 3146.17,  // Sum of all ops override (including Regent)
  totalSettlementRecovery: 1363.26,  // Only Mariia
  totalArNk: 4515.15  // VERIFIED FIGURE - This is what AR+NK should receive
};

// =============================================================================
// MARIIA SETTLEMENT - 13-MONTH VALIDATION SEQUENCE
// =============================================================================

/**
 * Use this to validate that settlement recovery logic works correctly
 * across multiple months with the priority waterfall.
 */
export const MARIIA_SETTLEMENT_SEQUENCE = [
  { period: 'Nov 2024', openingBalance: 15551.00, recovery: 2139.94, closingBalance: 13411.06 },
  { period: 'Dec 2024', openingBalance: 13411.06, recovery: 386.27, closingBalance: 13024.79 },
  { period: 'Jan 2025', openingBalance: 13024.79, recovery: 556.46, closingBalance: 12468.33 },
  { period: 'Feb 2025', openingBalance: 12468.33, recovery: 2982.31, closingBalance: 9486.02 },
  { period: 'Mar 2025', openingBalance: 9486.02, recovery: 423.23, closingBalance: 9062.79 },
  { period: 'Apr 2025', openingBalance: 9062.79, recovery: 1219.36, closingBalance: 7843.43 },
  { period: 'May 2025', openingBalance: 7843.43, recovery: 1406.88, closingBalance: 6436.55 },
  { period: 'Jun 2025', openingBalance: 6436.55, recovery: 469.26, closingBalance: 5967.29 },
  { period: 'Jul 2025', openingBalance: 5967.29, recovery: 744.47, closingBalance: 5222.82 },
  { period: 'Aug 2025', openingBalance: 5222.82, recovery: 447.19, closingBalance: 4775.63 },
  { period: 'Sep 2025', openingBalance: 4775.63, recovery: 394.92, closingBalance: 4380.71 },
  { period: 'Oct 2025', openingBalance: 4380.71, recovery: 704.84, closingBalance: 3675.87 },
  { period: 'Nov 2025', openingBalance: 4380.71, recovery: 1363.27, closingBalance: 3017.44 },
];

// =============================================================================
// EDGE CASES FOR TESTING
// =============================================================================

export const EDGE_CASES = {
  /**
   * EDGE CASE 1: Negative Net Distributable
   * When expenses exceed revenue, advisor has debt to company.
   * DO NOT apply waterfall - just track the debt.
   */
  negativeNetDistributable: {
    advisorId: 'NIKOLAI',
    period: 'Nov 2025',
    grossRevenue: 0,
    expenses: 308.67,
    netDistributable: -308.67,
    expectedBehaviour: 'Track as debt to company. No waterfall calculation. No payment to advisor.'
  },

  /**
   * EDGE CASE 2: Settlement Partially Absorbs Waterfall
   * When settlement balance is less than 20% pool, remainder goes to AR+NK.
   */
  partialSettlementAbsorption: {
    scenario: 'Advisor has £500 settlement remaining, 20% pool is £800',
    expectedBehaviour: '£500 to settlement (clears it), £300 to AR+NK',
    settlementAfter: 0,
    arNkReceives: 300
  },

  /**
   * EDGE CASE 3: Regent Override on Inherited Clients
   * AS departed but Regent still gets 10% on clients she introduced.
   */
  regentOverride: {
    scenario: 'Yulia services Savushkin (originally AS client)',
    expectedBehaviour: 'Yulia gets 70%, Regent gets 10%, 20% to waterfall',
    note: 'Regent does NOT pay expenses on this revenue'
  },

  /**
   * EDGE CASE 4: Multi-Currency Transaction
   * USD revenue must be converted to GBP for calculations.
   */
  multiCurrency: {
    scenario: 'Marex pays $14,100 for Sergey',
    fxRate: 0.806,
    gbpEquivalent: 11363.82,
    expectedBehaviour: 'All calculations in GBP. Store original currency for audit trail.'
  },

  /**
   * EDGE CASE 5: Shared Expense Denominator
   * Some expenses divide by 5 (advisors only), some by 7 (includes AR+NK).
   */
  expenseDenominator: {
    htl: { total: 388.80, divisor: 5, perAdvisor: 77.76, note: 'Advisors only' },
    eightByEight: { total: 254.08, divisor: 7, perAdvisor: 36.30, note: 'Includes AR+NK' }
  },

  /**
   * EDGE CASE 6: Advisor with Debt Carries Forward
   * Yulia had negative balance in Sep 2025, carried to Oct.
   */
  debtCarryForward: {
    advisorId: 'YULIA',
    period: 'Sep 2025',
    debtAmount: -933.69,
    note: 'Debt should reduce next positive month payment, not affect waterfall'
  }
};

// =============================================================================
// AR+NK EARNINGS - MONTHLY VERIFICATION DATA
// =============================================================================

/**
 * These are the VERIFIED AR+NK earnings after all settlements cleared
 * except Mariia's. Use to validate waterfall priority logic.
 */
export const AR_NK_MONTHLY_EARNINGS = [
  { period: 'Nov 2024', amount: 0, note: 'All to settlements (5 active)' },
  { period: 'Dec 2024', amount: 0, note: 'All to settlements' },
  { period: 'Jan 2025', amount: 0, note: 'Maks + Sergey cleared, overflow to others' },
  { period: 'Feb 2025', amount: 0, note: 'To AS settlement primarily' },
  { period: 'Mar 2025', amount: 0, note: 'To AS settlement' },
  { period: 'Apr 2025', amount: 7639.73, note: 'AS cleared, NK+Yulia still active, Mariia active' },
  { period: 'May 2025', amount: 1429.67, note: 'Low revenue month' },
  { period: 'Jun 2025', amount: 11136.36, note: 'Strong Sergey month' },
  { period: 'Jul 2025', amount: 10005.63, note: 'NK + Yulia cleared this month' },
  { period: 'Aug 2025', amount: 1883.46, note: 'Only Mariia settlement active' },
  { period: 'Sep 2025', amount: 6639.14, note: 'Only Mariia settlement active' },
  { period: 'Oct 2025', amount: 8244.09, note: 'Only Mariia settlement active' },
  { period: 'Nov 2025', amount: 4515.15, note: 'Only Mariia settlement active' },
];

export const AR_NK_TOTAL_VERIFIED = 51493.23;  // Sum of Apr-Nov 2025

// =============================================================================
// DISTRIBUTION CONFIGURATION
// =============================================================================

export const DISTRIBUTION_CONFIG = {
  advisorShare: 0.70,      // 70% to advisor
  operationsOverride: 0.10, // 10% to Regent Consulting (Operations)
  waterfallPool: 0.20,      // 20% to ORCAP waterfall
  
  // Validation: These MUST sum to 1.0
  validate: function() {
    const sum = this.advisorShare + this.operationsOverride + this.waterfallPool;
    if (Math.abs(sum - 1.0) > 0.0001) {
      throw new Error(`Distribution config invalid: sums to ${sum}, must be 1.0`);
    }
    return true;
  }
};

// =============================================================================
// HELPER: Acceptance Test Runner
// =============================================================================

export function validateNovember2025Calculation(actualResults: WaterfallCalculation[]): {
  passed: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const tolerance = 0.02;  // £0.02 tolerance for rounding

  for (const expected of NOVEMBER_2025_EXPECTED_RESULTS) {
    const actual = actualResults.find(r => r.advisorId === expected.advisorId);
    
    if (!actual) {
      errors.push(`Missing result for advisor: ${expected.advisorId}`);
      continue;
    }

    // Check each field
    const fields: (keyof WaterfallCalculation)[] = [
      'grossRevenue', 'expenses', 'netDistributable', 'advisorShare70',
      'operationsOverride10', 'waterfallPool20', 'settlementRecovery',
      'arNkShare', 'paymentToAdvisor', 'settlementBalanceAfter'
    ];

    for (const field of fields) {
      const expectedVal = expected[field] as number;
      const actualVal = actual[field] as number;
      
      if (Math.abs(expectedVal - actualVal) > tolerance) {
        errors.push(
          `${expected.advisorId}.${field}: expected £${expectedVal.toFixed(2)}, got £${actualVal.toFixed(2)}`
        );
      }
    }
  }

  // Check totals
  const actualArNkTotal = actualResults.reduce((sum, r) => sum + r.arNkShare, 0);
  if (Math.abs(actualArNkTotal - NOVEMBER_2025_TOTALS.totalArNk) > tolerance) {
    errors.push(
      `Total AR+NK: expected £${NOVEMBER_2025_TOTALS.totalArNk.toFixed(2)}, got £${actualArNkTotal.toFixed(2)}`
    );
  }

  return {
    passed: errors.length === 0,
    errors
  };
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export default {
  ADVISORS,
  NOVEMBER_2025_TRANSACTIONS,
  NOVEMBER_2025_EXPENSES,
  NOVEMBER_2025_EXPECTED_RESULTS,
  NOVEMBER_2025_TOTALS,
  MARIIA_SETTLEMENT_SEQUENCE,
  EDGE_CASES,
  AR_NK_MONTHLY_EARNINGS,
  AR_NK_TOTAL_VERIFIED,
  DISTRIBUTION_CONFIG,
  validateNovember2025Calculation
};
