/**
 * ORCAP Transaction Management System - Reference Data
 * 
 * This file contains all reference data structures for the TMS refactor.
 * Import directly into the codebase or use as specification reference.
 * 
 * @version 1.0
 * @date 14 December 2025
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Advisor {
  id: string;
  displayName: string;
  company: string | null;
  bankPatterns: string[];
  isActive: boolean;
  settlement: {
    originalAmount: number;
    clearedDate: string | null;
    currentBalance: number;
  };
  clients: Client[];
  paymentDetails?: {
    accountName: string;
    sortCode?: string;
    accountNumber?: string;
  };
}

export interface Client {
  name: string;
  accountRef: string;
  bankPatterns?: string[];
  sharedWith?: string; // advisorId if shared
  notes?: string;
}

export interface ExpenseRule {
  pattern: RegExp;
  category: 'shared' | 'individual' | 'firm-only' | 'excluded';
  expenseType: string;
  description: string;
  advisorId?: string; // For individual expenses
}

export interface RevenueSourceRule {
  pattern: RegExp;
  source: string;
  type: 'partner-bank' | 'payment-processor' | 'client-direct';
  currencies: string[];
  description: string;
}

export interface AdvisorPaymentPattern {
  pattern: RegExp;
  advisorId: string;
  description: string;
}

// =============================================================================
// ADVISOR DATA
// =============================================================================

export const advisors: Record<string, Advisor> = {
  'maks-balbaev': {
    id: 'maks-balbaev',
    displayName: 'Maks Balbaev',
    company: 'Alpha Wealth Advisors Ltd',
    bankPatterns: ['ALPHA WEALTH', 'ALPHA_WEALTH'],
    isActive: true,
    settlement: {
      originalAmount: 6310.00,
      clearedDate: '2025-01',
      currentBalance: 0
    },
    clients: [
      { name: 'Alexander & Yana Barkov', accountRef: '9027772', bankPatterns: ['BARKOV'] },
      { name: 'Rozov Iryna & Eugeniy (SW)', accountRef: '9027793', bankPatterns: ['ROZOV'] },
      { name: 'Rozov Iryna & Eugeniy (UK)', accountRef: '9029006', bankPatterns: ['ROZOV'] },
      { name: 'Linnik Vadim', accountRef: '9027841', bankPatterns: ['LINNIK'] },
      { name: 'Gordon Mark', accountRef: '9029020', bankPatterns: ['GORDON MARK'] },
      { name: 'Smirnova Galina', accountRef: '9029022', bankPatterns: ['SMIRNOVA'] },
      { name: 'Karpova Anna', accountRef: '9429023', bankPatterns: ['KARPOVA'] },
    ],
    paymentDetails: {
      accountName: 'Alpha Wealth Advisors Ltd',
    }
  },
  
  'nikolai-klimov': {
    id: 'nikolai-klimov',
    displayName: 'Nikolai Klimov',
    company: null,
    bankPatterns: ['NIKOLAI KLIMOV', 'N KLIMOV'],
    isActive: true,
    settlement: {
      originalAmount: 6378.00,
      clearedDate: '2025-07',
      currentBalance: 0
    },
    clients: [
      { name: 'Kelgankina Yulia', accountRef: '9027842' },
      { name: 'Rubinchik Igor', accountRef: '9027873' },
      { name: 'Tsalov R & Svedtsikova N', accountRef: '9029000' },
      { name: 'Dobrikova Svetlana', accountRef: '9029004' },
      { name: 'Obuschak Artem', accountRef: '9029024' },
      { name: 'Zavileyskiy Mikhail', accountRef: 'IB', notes: 'Interactive Brokers' },
    ],
    paymentDetails: {
      accountName: 'Nikolai Klimov',
    }
  },
  
  'sergey-zhirnov': {
    id: 'sergey-zhirnov',
    displayName: 'Sergey Zhirnov',
    company: null,
    bankPatterns: ['SERGEY ZHIRNOV', 'S ZHIRNOV'],
    isActive: true,
    settlement: {
      originalAmount: 15335.00,
      clearedDate: '2025-01',
      currentBalance: 0
    },
    clients: [
      { name: 'Latsanych Vasily', accountRef: '9027880' },
      { name: 'Makarenko Viacheslav', accountRef: '9029003' },
      { name: 'Biszko Roman Waclaw', accountRef: '9029012' },
    ],
    paymentDetails: {
      accountName: 'Sergey Zhirnov',
    }
  },
  
  'mariia-filatenko': {
    id: 'mariia-filatenko',
    displayName: 'Mariia Filatenko',
    company: null,
    bankPatterns: ['MARIIA FILATENKO', 'M FILATENKO', 'MARIA FILATENKO'],
    isActive: true,
    settlement: {
      originalAmount: 15551.00,
      clearedDate: null, // Still active
      currentBalance: 1654.18 // As of November 2025
    },
    clients: [
      { name: 'Telepneva Natalia (UK)', accountRef: '9029009' },
      { name: 'Telepneva Natalia (SW)', accountRef: '9027919' },
      { name: 'Beliakova Irina', accountRef: '9029010' },
    ],
    paymentDetails: {
      accountName: 'Mariia Filatenko',
    }
  },
  
  'yulia-mitraeva': {
    id: 'yulia-mitraeva',
    displayName: 'Yulia Mitraeva',
    company: 'Sailaway Finance Ltd',
    bankPatterns: ['SAILAWAY', 'YULIA MITRAEVA'],
    isActive: true,
    settlement: {
      originalAmount: 2657.00,
      clearedDate: '2025-07',
      currentBalance: 0
    },
    clients: [
      { name: 'Demarina Liudmila', accountRef: 'TBC' },
      { name: 'Markova Natalia', accountRef: 'TBC' },
      { name: 'Solovyeva Elena', accountRef: 'consultancy', notes: 'Hourly consulting' },
      { name: 'Tuvykin Konstantin', accountRef: 'TBC' },
      { name: 'Shabalina Anna', accountRef: 'TBC' },
      { name: 'Savushkin Roman', accountRef: 'FP', notes: 'Fieldpoint' },
    ],
    paymentDetails: {
      accountName: 'Sailaway Finance Ltd',
    }
  },
  
  'anastasia-soldatova': {
    id: 'anastasia-soldatova',
    displayName: 'Anastasia Soldatova',
    company: 'Regent Consulting Ltd',
    bankPatterns: ['REGENT CONSULTING', 'ANASTASIA SOLDATOVA'],
    isActive: false, // Departed - but receives Operations Override
    settlement: {
      originalAmount: 11685.00,
      clearedDate: '2025-04',
      currentBalance: 0
    },
    clients: [
      { 
        name: 'Anisimov Alexey & Elena', 
        accountRef: '9029019', 
        sharedWith: 'mariia-filatenko',
        notes: 'Joint client with Mariia'
      },
      { 
        name: 'Gorn Tatyana & Vitaly', 
        accountRef: 'Vontobel',
        notes: 'Vontobel bank'
      },
    ],
    paymentDetails: {
      accountName: 'Regent Consulting Ltd',
    }
  },
};

// =============================================================================
// OPERATIONS OVERRIDE CONFIGURATION
// =============================================================================

export const operationsOverrideConfig = {
  recipient: 'anastasia-soldatova', // Maps to advisor ID for payment details
  recipientName: 'Regent Consulting Ltd',
  percentage: 0.10,
  description: 'Operations Override (10%)',
  notes: 'Formerly AS platform fee, now paid to husband via Regent Consulting'
};

// =============================================================================
// SETTLEMENT CONFIGURATION
// =============================================================================

export const settlementConfig = {
  // Original settlement amounts from October 2024 terminations
  originalSettlements: [
    { advisorId: 'maks-balbaev', amount: 6310.00, source: 'termination' },
    { advisorId: 'sergey-zhirnov', amount: 15335.00, source: 'termination' },
    { advisorId: 'anastasia-soldatova', amount: 11685.00, source: 'termination' },
    { advisorId: 'nikolai-klimov', amount: 6378.00, source: 'termination' },
    { advisorId: 'yulia-mitraeva', amount: 2657.00, source: 'termination' },
    { advisorId: 'mariia-filatenko', amount: 15551.00, source: 'termination' },
  ],
  totalOriginalSettlement: 57916.00,
};

// =============================================================================
// EXPENSE RULES
// =============================================================================

export const expenseRules: ExpenseRule[] = [
  // Shared Operational Expenses
  {
    pattern: /HTL SUPPORT/i,
    category: 'shared',
    expenseType: 'HTL',
    description: 'IT & Compliance Support'
  },
  {
    pattern: /8X8 UK/i,
    category: 'shared',
    expenseType: '8X8',
    description: 'Telephony Services'
  },
  {
    pattern: /SALESFORCE/i,
    category: 'shared',
    expenseType: 'SALESFORCE',
    description: 'CRM Platform'
  },
  {
    pattern: /WORLDCHECK|WORLD CHECK/i,
    category: 'shared',
    expenseType: 'WORLDCHECK',
    description: 'Compliance Screening (Quarterly)'
  },
  
  // Individual Expenses (require advisor assignment)
  {
    pattern: /BUPA.*BUPA\d{11}/i,
    category: 'individual',
    expenseType: 'BUPA',
    description: 'Health/Dental Insurance'
  },
  {
    pattern: /AXA PPP/i,
    category: 'individual',
    expenseType: 'AXA',
    description: 'Health Insurance',
    advisorId: 'mariia-filatenko' // Only Mariia has AXA
  },
  
  // Firm-Only Expenses (absorbed by ORCAP)
  {
    pattern: /NETLIFY/i,
    category: 'firm-only',
    expenseType: 'HOSTING',
    description: 'Website Hosting'
  },
  {
    pattern: /Google GSUITE|GSUITE/i,
    category: 'firm-only',
    expenseType: 'GOOGLE',
    description: 'Google Workspace'
  },
  
  // Excluded from calculations
  {
    pattern: /REFINITIV/i,
    category: 'excluded',
    expenseType: 'DATA',
    description: 'Data subscription (one-off setup)'
  },
];

// =============================================================================
// REVENUE SOURCE PATTERNS
// =============================================================================

export const revenueSourceRules: RevenueSourceRule[] = [
  {
    pattern: /CBH WEALTH UK|CBH COMPAGNIE BANCAIRE/i,
    source: 'CBH',
    type: 'partner-bank',
    currencies: ['GBP', 'CHF'],
    description: 'CBH Bank - Primary Swiss Counterparty'
  },
  {
    pattern: /TBC BANK|'TBC BANK' JSC/i,
    source: 'TBC',
    type: 'partner-bank',
    currencies: ['GBP'],
    description: 'TBC Bank - Georgian Partnership'
  },
  {
    pattern: /MAREX FINANCIAL|Marex Financial/i,
    source: 'MAREX',
    type: 'partner-bank',
    currencies: ['USD'],
    description: 'Marex - Execution/Prime Broker'
  },
  {
    pattern: /FIELDPOINT PRIVATE|Fieldpoint Private/i,
    source: 'FIELDPOINT',
    type: 'partner-bank',
    currencies: ['GBP', 'USD'],
    description: 'Fieldpoint Private Bank - US'
  },
  {
    pattern: /VONTOBEL/i,
    source: 'VONTOBEL',
    type: 'partner-bank',
    currencies: ['CHF', 'EUR'],
    description: 'Vontobel - Swiss Bank'
  },
  {
    pattern: /STRIPE PAYMENTS/i,
    source: 'STRIPE',
    type: 'payment-processor',
    currencies: ['GBP'],
    description: 'Card Payments / Direct Client Fees'
  },
];

// =============================================================================
// ADVISOR PAYMENT PATTERNS
// =============================================================================

export const advisorPaymentPatterns: AdvisorPaymentPattern[] = [
  { pattern: /ALPHA WEALTH/i, advisorId: 'maks-balbaev', description: 'Maks - Alpha Wealth' },
  { pattern: /REGENT CONSULTING/i, advisorId: 'operations-override', description: 'Operations Override' },
  { pattern: /NIKOLAI KLIMOV/i, advisorId: 'nikolai-klimov', description: 'Nikolai' },
  { pattern: /SERGEY ZHIRNOV/i, advisorId: 'sergey-zhirnov', description: 'Sergey' },
  { pattern: /MARIIA FILATENKO|MARIA FILATENKO/i, advisorId: 'mariia-filatenko', description: 'Mariia' },
  { pattern: /SAILAWAY/i, advisorId: 'yulia-mitraeva', description: 'Yulia - Sailaway' },
];

// =============================================================================
// TRANSFER PATTERNS (EXCLUDE FROM CALCULATIONS)
// =============================================================================

export const transferPatterns = [
  /ORION RIDGE CAPITA/i,       // Internal Lloyds <-> Wise
  /WISE/i,                      // Wise transfers
  /TW\d+/i,                     // Wise transfer references
];

// =============================================================================
// CLIENT-REVENUE MAPPING
// =============================================================================

export const clientRevenuePatterns: Array<{
  pattern: RegExp;
  clientName: string;
  advisorId: string;
}> = [
  // Maks's clients
  { pattern: /BARKOV/i, clientName: 'Barkov', advisorId: 'maks-balbaev' },
  { pattern: /ROZOV/i, clientName: 'Rozov', advisorId: 'maks-balbaev' },
  { pattern: /LINNIK/i, clientName: 'Linnik', advisorId: 'maks-balbaev' },
  { pattern: /GORDON MARK/i, clientName: 'Gordon Mark', advisorId: 'maks-balbaev' },
  { pattern: /SMIRNOVA/i, clientName: 'Smirnova', advisorId: 'maks-balbaev' },
  { pattern: /KARPOVA/i, clientName: 'Karpova', advisorId: 'maks-balbaev' },
  
  // Nikolai's clients
  { pattern: /KELGANKINA/i, clientName: 'Kelgankina', advisorId: 'nikolai-klimov' },
  { pattern: /RUBINCHIK/i, clientName: 'Rubinchik', advisorId: 'nikolai-klimov' },
  { pattern: /TSALOV|SVEDTSIKOVA/i, clientName: 'Tsalov/Svedtsikova', advisorId: 'nikolai-klimov' },
  { pattern: /DOBRIKOVA/i, clientName: 'Dobrikova', advisorId: 'nikolai-klimov' },
  { pattern: /OBUSCHAK/i, clientName: 'Obuschak', advisorId: 'nikolai-klimov' },
  { pattern: /ZAVILEYSKIY/i, clientName: 'Zavileyskiy', advisorId: 'nikolai-klimov' },
  
  // Sergey's clients
  { pattern: /LATSANYCH/i, clientName: 'Latsanych', advisorId: 'sergey-zhirnov' },
  { pattern: /MAKARENKO/i, clientName: 'Makarenko', advisorId: 'sergey-zhirnov' },
  { pattern: /BISZKO/i, clientName: 'Biszko', advisorId: 'sergey-zhirnov' },
  
  // Mariia's clients
  { pattern: /TELEPNEVA/i, clientName: 'Telepneva', advisorId: 'mariia-filatenko' },
  { pattern: /BELIAKOVA/i, clientName: 'Beliakova', advisorId: 'mariia-filatenko' },
  
  // Yulia's clients
  { pattern: /DEMARINA/i, clientName: 'Demarina', advisorId: 'yulia-mitraeva' },
  { pattern: /MARKOVA/i, clientName: 'Markova', advisorId: 'yulia-mitraeva' },
  { pattern: /SOLOVYEVA/i, clientName: 'Solovyeva', advisorId: 'yulia-mitraeva' },
  { pattern: /TUVYKIN/i, clientName: 'Tuvykin', advisorId: 'yulia-mitraeva' },
  { pattern: /SHABALINA/i, clientName: 'Shabalina', advisorId: 'yulia-mitraeva' },
  { pattern: /SAVUSHKIN/i, clientName: 'Savushkin', advisorId: 'yulia-mitraeva' },
  
  // Anastasia's clients
  { pattern: /ANISIMOV/i, clientName: 'Anisimov', advisorId: 'anastasia-soldatova' },
  { pattern: /GORN/i, clientName: 'Gorn', advisorId: 'anastasia-soldatova' },
  
  // Direct client payments (Wise)
  { pattern: /IRINA.*ROZOVA|ROZOVA.*IRINA/i, clientName: 'Rozova (Irina)', advisorId: 'maks-balbaev' },
  { pattern: /RUSS HOLLAND/i, clientName: 'Holland', advisorId: 'maks-balbaev' },
];

// =============================================================================
// DISTRIBUTION CONFIGURATION
// =============================================================================

export const distributionConfig = {
  advisorShare: 0.70,           // 70% to advisor
  operationsOverride: 0.10,     // 10% to Operations Override
  waterfallPool: 0.20,          // 20% to waterfall (settlements → ORCAP Nostro)
  
  // Validate percentages sum to 1
  get isValid(): boolean {
    return (this.advisorShare + this.operationsOverride + this.waterfallPool) === 1.0;
  }
};

// =============================================================================
// SHARED EXPENSE DENOMINATOR CONFIG
// =============================================================================

export const sharedExpenseConfig = {
  // Toggle: Should AR+NK be included in the denominator for shared expenses?
  includeOwnersInDenominator: false, // Default: NO (contractual position)
  
  // If false: denominator = active advisors only (typically 5)
  // If true: denominator = active advisors + 2 (AR + NK)
  
  get denominatorDescription(): string {
    return this.includeOwnersInDenominator 
      ? 'Shared expenses divided by (advisors + owners)'
      : 'Shared expenses divided by advisors only';
  }
};

// =============================================================================
// BANK CSV FORMATS
// =============================================================================

export const csvFormats = {
  lloyds: {
    name: 'Lloyds Bank',
    dateFormat: 'DD/MM/YYYY',
    headers: [
      'Transaction Date',
      'Transaction Type',
      'Sort Code',
      'Account Number',
      'Transaction Description',
      'Debit Amount',
      'Credit Amount',
      'Balance'
    ],
    fieldMapping: {
      date: 'Transaction Date',
      type: 'Transaction Type',
      description: 'Transaction Description',
      debit: 'Debit Amount',
      credit: 'Credit Amount',
      balance: 'Balance'
    }
  },
  wise: {
    name: 'Wise',
    dateFormat: 'DD-MM-YYYY',
    headers: [
      'TransferWise ID',
      'Date',
      'Date Time',
      'Amount',
      'Currency',
      'Description',
      'Payment Reference',
      'Running Balance',
      'Exchange From',
      'Exchange To',
      'Exchange Rate',
      'Payer Name',
      'Payee Name',
      'Payee Account Number',
      'Merchant',
      'Card Last Four Digits',
      'Card Holder Full Name',
      'Attachment',
      'Note',
      'Total fees',
      'Exchange To Amount',
      'Transaction Type',
      'Transaction Details Type'
    ],
    fieldMapping: {
      id: 'TransferWise ID',
      date: 'Date',
      amount: 'Amount',
      currency: 'Currency',
      description: 'Description',
      reference: 'Payment Reference',
      balance: 'Running Balance',
      fxFrom: 'Exchange From',
      fxTo: 'Exchange To',
      fxRate: 'Exchange Rate',
      payerName: 'Payer Name',
      payeeName: 'Payee Name',
      type: 'Transaction Type',
      detailType: 'Transaction Details Type'
    },
    // Transaction types to exclude from revenue/expense calculations
    excludeDetailTypes: ['CONVERSION'] // Internal FX movements
  }
};

// =============================================================================
// FX CONFIGURATION
// =============================================================================

export const fxConfig = {
  baseCurrency: 'GBP',
  supportedCurrencies: ['USD', 'EUR', 'CHF', 'AUD'],
  
  // API for spot rates
  rateApi: {
    provider: 'frankfurter',
    baseUrl: 'https://api.frankfurter.app',
    // Usage: GET /{date}?from={currency}&to=GBP
  },
  
  // Allow manual rate override
  allowManualOverride: true,
  
  // Track FX P&L
  trackFxPnL: true
};

// =============================================================================
// ANALYTICS METRICS
// =============================================================================

export const analyticsMetrics = {
  // Dashboard KPIs
  kpis: [
    { id: 'totalRevenue', label: 'Total Revenue', format: 'currency' },
    { id: 'totalExpenses', label: 'Total Expenses', format: 'currency' },
    { id: 'netProfit', label: 'Net Profit', format: 'currency' },
    { id: 'orcapNostro', label: 'ORCAP Nostro', format: 'currency' },
    { id: 'operationsOverride', label: 'Operations Override', format: 'currency' },
    { id: 'outstandingSettlements', label: 'Outstanding Settlements', format: 'currency' },
  ],
  
  // Advisor performance metrics
  advisorMetrics: [
    { id: 'grossRevenue', label: 'Gross Revenue', format: 'currency' },
    { id: 'expenses', label: 'Expenses', format: 'currency' },
    { id: 'netContribution', label: 'Net Contribution', format: 'currency' },
    { id: 'expenseRatio', label: 'Expense Ratio', format: 'percentage' },
    { id: 'settlementStatus', label: 'Settlement Status', format: 'status' },
  ],
  
  // Financial ratios
  financialRatios: [
    { id: 'grossMargin', label: 'Gross Margin', formula: '(Revenue - Expenses) / Revenue' },
    { id: 'takeRate', label: 'Firm Take Rate', formula: '(ORCAP Nostro + Ops Override) / Revenue' },
    { id: 'advisorEfficiency', label: 'Advisor Efficiency', formula: 'Net Revenue / Advisor Count' },
  ]
};

// =============================================================================
// VERIFICATION TEST DATA (November 2025)
// =============================================================================

export const november2025TestData = {
  period: 'November 2025',
  expectedResults: {
    advisors: {
      'maks-balbaev': { arnk20: 1585.42 },
      'sergey-zhirnov': { arnk20: 2227.00 },
      'mariia-filatenko': { arnk20: 0, toSettlement: 1363.26 },
      'yulia-mitraeva': { arnk20: 288.80 + 413.93 },
      'nikolai-klimov': { arnk20: 0, hasNegativeBalance: true },
    },
    totals: {
      totalArnk20: 4515.15,
      mariiaSettlementClosing: 1654.18,
    }
  },
  notes: 'Use these values to verify calculation engine is working correctly'
};

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
  advisors,
  operationsOverrideConfig,
  settlementConfig,
  expenseRules,
  revenueSourceRules,
  advisorPaymentPatterns,
  transferPatterns,
  clientRevenuePatterns,
  distributionConfig,
  sharedExpenseConfig,
  csvFormats,
  fxConfig,
  analyticsMetrics,
  november2025TestData,
};
