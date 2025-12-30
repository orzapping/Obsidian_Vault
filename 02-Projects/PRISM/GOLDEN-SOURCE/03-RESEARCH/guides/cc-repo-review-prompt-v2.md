# Repository Review & Architecture Analysis Command Prompt

## Context & Objective

I need you to conduct a comprehensive review of our ICARA/MIFIDPRU platform repository to prepare for building an Intelligence Dashboard that will serve as the master control centre. This dashboard will aggregate data from all calculator modules to compute the Minimum Capital Requirement (MCR) and provide both regulatory compliance and sophisticated value-added intelligence features.

**Critical Note**: We're building an enterprise-grade SaaS platform that will eventually run on AWS with full data persistence, but currently using localStorage for development. The Intelligence Dashboard must be architected to support both paradigms.

## Primary Review Tasks

### 1. Module Architecture Analysis

Please analyze each calculator module and extract:

#### A. Data Persistence Patterns
```javascript
// For each module, identify:
- localStorage key names (exact strings)
- Data structure/schema being stored
- Update frequency patterns
- Any existing event dispatching
- Data validation methods

// Example extraction needed:
localStorage.setItem('for_total', JSON.stringify({
  value: 150000,
  breakdown: {...},
  timestamp: Date.now()
}));
```

#### B. Calculation Logic Extraction
**IMPORTANT**: Extract reusable calculation functions to avoid reinventing the wheel:
- Core MCR calculation logic
- Utility functions for formatting/validation
- Any aggregation or summation patterns
- Chart data preparation functions
- Export/PDF generation logic

```javascript
// Look for patterns like:
function calculateFOR() { ... }
function aggregateKFactors() { ... }
function validateInputs() { ... }
// Extract these completely for reuse
```

### 2. Module Inventory & Status

Create a comprehensive status matrix:

| Module | File(s) | Status | Data Keys | Integration Points | Priority |
|--------|---------|--------|-----------|-------------------|----------|
| FOR Calculator | `FORCalc_.html` | Complete | `for_total`, `for_breakdown` | localStorage | REGULATORY |
| KFR Calculator | `kfactorcalc.html` | Complete | `kfr_total`, etc. | localStorage | REGULATORY |
| K-TCD | `ktcd-calculator.html` | Complete | ... | ... | REGULATORY |
| WDA Calculator | `winddowncostcalc_*.html` | Complete | ... | ... | REGULATORY |
| Risk Assessment | `riskassessalc_*.html` | Complete | ... | ... | REGULATORY |
| Linear Stress Test | `[filename]` | WIP | TBD | Placeholder needed | VALUE-ADD |
| Reverse Stress Test | `[filename]` | WIP | TBD | Placeholder needed | VALUE-ADD |
| User Management | `[filename]` | Complete | ... | ... | BOTH |
| Reporting Module | `[filename]` | Complete | ... | ... | BOTH |

### 3. Regulatory vs Value-Added Classification

Clearly differentiate features into two categories:

#### REGULATORY (Minimum MiFIDPRU Requirements)
These are non-negotiable, must be 100% accurate:
- PMR calculation (fixed values based on firm type)
- FOR calculation (25% of annual expenditure)
- KFR calculation (all 9 K-factors if applicable)
- WDA calculation (wind-down costs)
- RA calculation (risk assessment capital)
- Basic MCR formula: max(PMR, FOR, KFR, WDA, RA)
- Regulatory reporting formats
- Compliance status indicators

#### VALUE-ADD (Competitive Moat Features)
These make us irreplaceable - must be sophisticated and impressive:
- AI-powered insights and commentary
- Predictive analytics and forecasting
- Scenario planning and what-if analysis
- Peer benchmarking
- Advanced visualizations (3D surfaces, etc.)
- Linear stress testing (once complete)
- Reverse stress testing (once complete)
- Correlation analysis
- Monte Carlo simulations
- Early warning systems

### 4. Database Architecture Planning

Map out the transition from localStorage to AWS:

```typescript
// Current State (localStorage)
interface LocalStorageSchema {
  key: string;
  value: any;
  limitations: string[];
}

// Future State (AWS RDS/DynamoDB)
interface DatabaseSchema {
  table: string;
  columns: Column[];
  relationships: Relationship[];
  indexes: Index[];
  partitionKey?: string;
}

// Abstraction Layer Needed
interface DataService {
  save(key: string, value: any): Promise<void>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  // Should work with both localStorage and AWS
}
```

### 5. AI Insights Framework Design

Design a comprehensive framework for AI-powered intelligence:

```typescript
interface AIInsightsFramework {
  // Data Collection Points
  dataPoints: {
    calculations: MCRComponents;
    trends: HistoricalData[];
    anomalies: DetectedAnomalies[];
    benchmarks: IndustryComparisons;
  };
  
  // Analysis Dimensions
  analysisDimensions: [
    'regulatory_compliance',  // Distance from breach
    'trend_analysis',         // Direction and velocity
    'anomaly_detection',      // Unusual patterns
    'optimization_opportunities', // Cost savings
    'risk_correlations',      // Hidden relationships
    'predictive_warnings'     // Future issues
  ];
  
  // Output Formats
  outputs: {
    executiveSummary: string;    // 2-3 sentences
    keyFindings: Finding[];       // Bullet points
    recommendations: Action[];    // Prioritized actions
    naturalLanguage: {           // Contextual commentary
      technical: string;
      executive: string;
      board: string;
    };
  };
  
  // Integration Points
  triggers: [
    'on_calculation_complete',
    'on_threshold_approach',
    'on_anomaly_detected',
    'scheduled_daily',
    'user_requested'
  ];
}
```

### 6. User Management & Reporting Integration

Analyze these modules for:
- Authentication/authorization patterns
- User role definitions (SMCR mappings?)
- Report generation capabilities
- Export formats supported
- Multi-tenancy considerations
- Audit trail functionality

### 7. Code Quality & Technical Debt Assessment

Please identify:
- Duplicate code across modules (consolidation opportunities)
- Inconsistent patterns that need standardization
- Missing error handling
- Performance bottlenecks
- Security concerns (even in POC stage)
- Technical debt that needs addressing

### 8. Intelligence Dashboard Data Requirements

Based on your review, specify exactly what the Intelligence Dashboard needs:

```javascript
// Required Data Contract
interface DashboardDataRequirements {
  // From each calculator
  forCalculator: {
    endpoint: 'localStorage:for_total' | 'api:/for/calculate',
    format: FORDataStructure,
    updateFrequency: 'on-change' | 'periodic',
    dependencies: string[]
  };
  // ... repeat for each module
  
  // Aggregation logic
  mcrCalculation: {
    formula: 'max(pmr, for, kfr, wda, ra)',
    validation: ValidationRules[],
    errorHandling: ErrorStrategy
  };
}
```

### 9. Specific Extraction Requests

Please extract and provide:

1. **Complete calculation functions** from each module (copy verbatim)
2. **localStorage key names** (exact strings used)
3. **Data validation patterns** (how each module validates inputs)
4. **Chart configuration objects** (for Chart.js reuse)
5. **CSS styling patterns** (for visual consistency)
6. **Any existing API endpoints or service calls**
7. **Error messages and user notifications patterns**

### 10. Placeholder Architecture for WIP Modules

For the incomplete stress test modules, design placeholder interfaces:

```typescript
interface StressTestPlaceholder {
  linearStressTest: {
    status: 'development',
    expectedOutput: {
      scenarios: ScenarioResult[],
      breakingPoint: number,
      recommendations: string[]
    },
    mockData: () => StressTestResult
  };
  reverseStressTest: {
    status: 'development',
    expectedOutput: {
      failureScenarios: FailureScenario[],
      probability: number,
      timeToFailure: number
    },
    mockData: () => ReverseStressResult
  };
}
```

## Output Format Required

Please provide your analysis in this structure:

```markdown
# Repository Analysis Report

## 1. Executive Summary
- Overall architecture assessment
- Readiness for Intelligence Dashboard
- Critical issues identified
- Quick wins available

## 2. Module-by-Module Analysis
[Detailed breakdown of each module]

## 3. Data Flow Architecture
[Current and proposed data flows]

## 4. Extracted Code Snippets
[Reusable functions and patterns]

## 5. Integration Recommendations
[How to connect everything]

## 6. AI Insights Framework Proposal
[Detailed framework for AI features]

## 7. Migration Path to AWS
[Step-by-step from localStorage to cloud]

## 8. Intelligence Dashboard Implementation Plan
[Specific steps with priorities]

## 9. Risk Register
[Technical, regulatory, and business risks]

## 10. Appendices
- Complete localStorage key inventory
- Database schema proposals
- API endpoint specifications
```

## Priority Focus Areas

1. **MUST HAVE**: All regulatory MCR calculation components
2. **SHOULD HAVE**: User management, reporting, basic AI insights
3. **NICE TO HAVE**: Advanced analytics, stress testing (when ready)
4. **FUTURE**: Full AWS migration, multi-tenancy, advanced AI

Remember: The value-added features are our competitive moat - they need to be sophisticated enough that competitors can't easily replicate them. The AI insights particularly need to provide genuine intelligence, not just formatted numbers.

Please also note any innovative patterns or clever solutions you find that we should propagate across the platform.

Time to dig in! 🚀