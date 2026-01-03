# PRISM Project - Consolidated Context & Development Guide
## Essential Reference for AI-Assisted Financial Services Development

---

## PROJECT IDENTITY & STATUS

**Project**: ICARA/MiFIDPRU Risk Intelligence Platform (PRISM)  
**Purpose**: Enterprise regulatory compliance platform for UK investment firms  
**Commercial Impact**: 90% time reduction, £100k+ cost savings, 100% regulatory compliance  
**Architecture**: TypeScript/React enterprise platform (migrated from proven HTML prototypes)  
**Development Model**: Solo founder + AI-assisted development

### **Current Status - Post-Jad Consolidation**
- **Overall Completion**: 10+ modules complete (~70% functionality complete)
- **Architecture**: Advanced app structure with authentication, navigation, API routes
- **Integration**: Cross-module data flow established (Firm Data → Financial Data → FOR → RA Calculator)
- **Build Status**: ✅ Successfully building and deployable
- **Lines of Code**: ~15,000+ lines across consolidated modules

### **Key Modules Status**
✅ **Core Modules Complete**: Firm Data, Financial Data, FOR Calculator, Risk Assessment (RA) Calculator  
✅ **KFR Calculator Suite**: Main KFR + 4 supplementary K-factor calculators (K-CMG, K-CON, K-NPR, K-TCD)  
✅ **Winddown Calculator**: Complete implementation  
✅ **App Infrastructure**: Authentication, navigation, API routes, database integration  
🔄 **Integration Testing**: Ready for comprehensive testing phase  

---

## ESSENTIAL AI COLLABORATION STANDARDS

### **Professional Context - High Stakes Development**
This is **High Finance with a capital F** - designed for deployment across investment banks, regulatory bodies (PRA/FCA), central banks, and institutional funds. The stakes demand mathematical precision, regulatory accuracy, and unassailable professional integrity.

### **Communication Standards**
- **Language**: Proper British English, professional financial terminology
- **Precision**: Mathematical notation must be precise, regulatory citations must reference specific legislation
- **Wit Welcome**: Dry English wit, intelligent sarcasm, and profanity perfectly acceptable when delivered with charm and high intelligence
- **Zero Tolerance**: False confidence, hyperbolic praise, approximations presented as facts, regulatory guidance without citations

### **Uncertainty Management**
- **Mandatory Disclosure**: Any uncertainty must be explicitly stated - "I am uncertain about [specific aspect]"
- **Preferred Honesty**: "Honestly mate, I have no bloody idea, we best figure this one out before we encode a platypus into this beast!"
- **No Guessing**: Never approximate financial mathematics or regulatory requirements

---

## PROFESSIONAL BACKGROUND & WORKING PREFERENCES

### **Domain Expertise**
- **Experience**: 20+ years City of London financial services (since 2006, started at FSA)
- **Current Role**: Owner of FCA-regulated investment advisory firm + broker-dealer
- **Background**: Law degree, deep regulatory/compliance expertise
- **Core Skills**: Operational risk, regulatory compliance, product structuring, business strategy

### **Technical Position**
- **Development Journey**: Discovered AI-assisted development early 2025 via breakthrough MiFIDPRU solution
- **Current Capability**: Highly dependent on AI for all development, can read/comprehend code but cannot write independently
- **Learning Style**: Voracious learner, 6 months intensive development experience

### **Working Style Preferences**
- **Environment**: Linux Ubuntu 25.04 (primary), strong preference for terminal/CLI over GUI
- **Philosophy**: "Work smart, not hard" - elegant solutions over brute force
- **Core Belief**: "In battle between theory and practice, practice wins every single time"
- **Communication**: Appreciates analogies, storytelling, inline learning opportunities
- **Hours**: Night owl - more productive evenings/late nights

---

## REGULATORY COMPLIANCE REQUIREMENTS

### **Primary Regulatory Framework**
- **Jurisdiction**: United Kingdom - Financial Conduct Authority (FCA)
- **Core Regulation**: MiFIDPRU (Investment Firms Prudential Regime)  
- **Supporting Framework**: ICARA (Internal Capital Adequacy and Risk Assessment)
- **Audit Requirement**: 7-year data retention with complete calculation audit trail

### **Critical Regulatory Articles**
- **MiFIDPRU 4.3**: MCR Calculation (max of OFR, WDA, RA)
- **MiFIDPRU 4.5**: Fixed Overhead Requirement (FOR) - 25% of prescribed costs
- **MiFIDPRU 4.6**: K-Factor Requirements (KFR) with SNI classification
- **MiFIDPRU 4.10-4.15**: Specific K-factor methodologies  
- **MiFIDPRU 7.7**: ICARA documentation and risk assessment
- **CRR Articles 274-280**: SA-CCR methodology for K-TCD calculations

### **Non-Negotiable Compliance Standards**
1. **Calculation Accuracy**: 100% parity with regulatory examples (penny-perfect)
2. **Audit Trail**: Complete user action and calculation history logging
3. **Data Retention**: 7-year regulatory compliance with secure storage
4. **Regulatory Reporting**: FCA-ready export formats and documentation
5. **Access Control**: SMCR-aligned permissions and responsibility matrices

---

## TECHNICAL ARCHITECTURE & DEVELOPMENT STANDARDS

### **Technology Stack**
```yaml
Frontend: Next.js 14 + React 18 + TypeScript (strict mode)
Styling: Tailwind CSS + CSS Modules  
State Management: Zustand + React Query
Validation: Zod schemas with regulatory compliance rules
Financial Calculations: Decimal.js for penny-perfect accuracy
Authentication: JWT-based with SMCR role management
Database: Type-safe queries with audit trail logging
API Architecture: tRPC for type-safe client-server communication
Testing: 95%+ coverage, 100% HTML prototype parity validation
```

### **Development Philosophy for Regulatory Software**
- **Regulatory Transparency Over Complexity**: Code must be readable/auditable by FCA
- **Calculation Accuracy Over Performance**: Penny-perfect accuracy takes absolute precedence  
- **Audit Trail Over Convenience**: Every action must be traceable for regulatory compliance
- **Validation Over Assumption**: Never assume financial mathematics - validate against standards
- **Industry Standards Over Innovation**: Follow established financial services patterns
- **Documentation Over Memory**: Comprehensive docs for maintenance and regulatory review

### **Module Structure Pattern**
```
modules/[category]/[module-name]/
├── components/[Module]Calculator.tsx     # Main calculator interface
├── hooks/use[Module]Calculations.ts      # Business logic & calculations  
├── types/[module].ts                     # TypeScript interfaces
├── validation/schemas.ts                 # Zod validation schemas
├── docs/[module]-readme.md               # Module documentation
└── tests/[module].test.ts                # Test suites
```

---

## MODULE INTEGRATION ARCHITECTURE

### **Proven Integration Pattern**
```typescript
// Established data flow architecture (successful across 3+ modules)
interface ModuleIntegration {
  dataInputs: {
    userDirectEntry: UserFormData;           // Direct user input
    crossModuleData: IntegratedModuleData;   // From other modules  
    regulatoryParameters: RegulatoryConfigData; // Compliance settings
    contextualData: BusinessContextData;     // Business context
  };
  
  processing: {
    validation: ZodSchemaValidation;         // Input validation
    transformation: DataTransformation;      // Data preparation
    calculation: RegulatoryCalculation;     // Core calculations
    auditTrail: AuditLogGeneration;         // Compliance logging
  };
  
  dataOutputs: {
    calculationResults: ModuleSpecificResults;  // Module results
    integrationExports: CrossModuleDataExports; // For other modules
    regulatoryReports: ComplianceOutputs;       // FCA reporting
    auditTrail: ComplianceAuditTrail;          // Full audit log
  };
}
```

### **Cross-Module Data Flow**
```
Firm Data → Financial Data → FOR Calculator → Risk Assessment → KFR Calculator
     ↓           ↓              ↓                    ↓              ↓
  K-Factor    Balance      Fixed Overhead    Risk Capital    MCR Final
 Relevance    Validation    Requirement      Assessment     Calculation
```

### **State Management Integration**
- **Zustand Stores**: Module-specific state with cross-module subscriptions
- **React Query**: Server state management with <50ms data propagation
- **localStorage**: Regulatory-compliant data persistence with encryption
- **Real-time Updates**: WebSocket integration for multi-user scenarios

---

## TESTING & QUALITY STANDARDS

### **Regulatory Testing Requirements**
- **Accuracy Standard**: Penny-perfect matching with HTML prototypes
- **Test Coverage**: 95%+ code coverage, 100% calculation scenario coverage
- **Performance Target**: <200ms calculation response time, <50ms UI updates
- **Cross-Module Testing**: Full integration test suite across all data flows

### **Test Categories**
1. **Calculation Accuracy Tests**: Mathematical precision validation (£0.01 max deviation)
2. **Data Flow Tests**: Input validation, state management, persistence integrity  
3. **Integration Tests**: Cross-module compatibility and data consistency
4. **Regulatory Compliance Tests**: FCA requirement validation and audit trail verification
5. **Performance Tests**: Response time benchmarks and concurrent user handling

### **Quality Gates**
✅ Build Success: TypeScript compilation without errors  
✅ Test Suite: All tests passing with 95%+ coverage  
✅ Calculation Parity: 100% matching with HTML prototype results  
✅ Integration Success: Cross-module data flow validation  
✅ Performance Benchmarks: <200ms calculation, <50ms UI updates  
✅ Regulatory Compliance: Audit trail and FCA requirements validated

---

## DEVELOPMENT WORKFLOW

### **AI-Assisted Development Process**
1. **Requirements Analysis**: Human defines business logic and regulatory requirements
2. **Technical Implementation**: AI implements TypeScript/React structure  
3. **Calculation Validation**: Cross-reference with HTML prototypes for accuracy
4. **Integration Testing**: Verify cross-module compatibility and data flow
5. **Quality Assurance**: Regulatory compliance validation and performance testing
6. **Documentation**: Comprehensive technical and regulatory documentation

### **Code Quality Requirements**
- **TypeScript**: Strict mode, no `any` types in financial calculations
- **Financial Calculations**: Decimal.js mandatory for monetary values
- **Error Handling**: Comprehensive error boundaries with user-friendly messages
- **Security**: No secrets in code, secure audit trail logging, SMCR access controls
- **Performance**: <200ms target, optimistic updates, efficient re-renders

### **Git Workflow**
- **Branches**: Feature branches with regulatory compliance validation
- **Commits**: Detailed commit messages with regulatory impact assessment
- **Pull Requests**: Code review including calculation accuracy verification
- **Testing**: Automated test suites with HTML prototype cross-validation

---

## DEPLOYMENT CONSIDERATIONS

### **Production Requirements**
- **Infrastructure**: Cloud-native with 99.9% uptime SLA
- **Security**: SOC 2 compliance, encryption at rest and in transit
- **Backup**: 7-year data retention with regulatory-compliant archiving
- **Monitoring**: Real-time performance monitoring with regulatory compliance alerts
- **Scaling**: Multi-tenant architecture supporting institutional client base

### **Regulatory Compliance in Production**
- **Audit Logging**: Complete user activity and calculation history
- **Data Sovereignty**: UK data residency requirements for FCA compliance
- **Access Controls**: SMCR-aligned role-based permissions
- **Change Management**: Regulatory change impact assessment and documentation
- **Incident Response**: FCA incident reporting procedures and timelines

---

## CURRENT PRIORITIES & NEXT STEPS

### **Immediate Focus**
1. **Comprehensive Testing**: Full test suite execution across all consolidated modules
2. **Integration Validation**: Cross-module data flow verification
3. **Performance Optimization**: Response time benchmarking and optimization
4. **Documentation Updates**: Align docs with current consolidated state
5. **Production Readiness**: Infrastructure setup and deployment preparation

### **Success Metrics**
- **Technical**: Build success, test coverage 95%+, <200ms performance
- **Business**: Regulatory compliance validation, FCA-ready reporting
- **Integration**: Seamless cross-module data flow with complete audit trail
- **Quality**: 100% calculation parity with HTML prototypes

---

## MODULE DEVELOPMENT IMPLEMENTATION GUIDE

### **Complete Module Scaffolding Template**

#### **Standard File Structure (Copy Exactly)**
```typescript
// Required file structure for all new modules
modules/[category]/[module-name]/
├── components/
│   ├── [Module]Calculator.tsx        # Main calculator interface
│   ├── [Module]Form.tsx             # Input form component  
│   ├── [Module]Results.tsx          # Results display component
│   └── index.ts                     # Component exports
├── hooks/
│   ├── use[Module]Calculations.ts   # Business logic & calculations
│   ├── use[Module]API.ts           # API integration hook
│   └── index.ts                     # Hook exports
├── types/
│   ├── [module].ts                  # Module-specific types
│   └── index.ts                     # Type exports
├── validation/
│   └── schemas.ts                   # Zod validation schemas
├── docs/
│   └── [module]-readme.md          # Module documentation
└── tests/
    ├── [module].test.ts            # Unit tests
    ├── integration.test.ts         # Integration tests
    └── cross-validation.test.ts    # HTML prototype validation
```

#### **Required API Route Structure**
```typescript
// All modules must follow this API pattern
src/app/api/calculations/[module]/route.ts

export async function POST(request: Request) {
  const data = await request.json();
  
  // 1. Validation with Zod schema
  const validatedData = moduleSchema.parse(data);
  
  // 2. Calculation with Decimal.js for monetary values
  const results = calculateModuleResults(validatedData);
  
  // 3. Audit trail logging
  await logCalculation(validatedData, results);
  
  // 4. Return standardized response
  return Response.json({
    success: true,
    data: results,
    timestamp: new Date().toISOString(),
    calculationType: '[module]'
  });
}
```

#### **Component Pattern Template**
```typescript
// Standard calculator component structure
'use client';

import React, { useState } from 'react';
import { [Module]Form } from './[Module]Form';
import { [Module]Results } from './[Module]Results';
import { use[Module]Calculations } from '../hooks/use[Module]Calculations';
import { [Module]Data } from '../types';

export function [Module]Calculator() {
  const [formData, setFormData] = useState<[Module]Data>({});
  const calculationResults = use[Module]Calculations(formData);
  
  const handleFormChange = (data: [Module]Data) => {
    setFormData(data);
    // Save to localStorage for cross-module integration
    localStorage.setItem('prism_[module]_data', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <[Module]Form 
          data={formData} 
          onChange={handleFormChange}
        />
        <[Module]Results 
          results={calculationResults} 
        />
      </div>
    </div>
  );
}
```

#### **Hook Pattern Template**
```typescript
// Standard calculation hook structure
import { useMemo } from 'react';
import { Decimal } from 'decimal.js';
import { [Module]Data, [Module]Results } from '../types';

export function use[Module]Calculations(data: [Module]Data): [Module]Results {
  return useMemo(() => {
    // 1. Input validation
    if (!data || Object.keys(data).length === 0) {
      return { isValid: false, results: null };
    }

    // 2. Calculations with Decimal.js (mandatory for monetary values)
    const calculation = new Decimal(data.value || 0)
      .mul(data.factor || 1)
      .toNumber();

    // 3. Regulatory compliance validation
    const isCompliant = validateRegulatory(calculation);

    // 4. Cross-module integration data
    const integrationData = {
      [module]: calculation,
      timestamp: new Date().toISOString(),
      regulatoryCompliant: isCompliant
    };

    return {
      isValid: true,
      results: {
        calculation,
        isCompliant,
        integrationData,
        auditTrail: generateAuditTrail(data, calculation)
      }
    };
  }, [data]);
}
```

### **Integration Requirements (Non-Negotiable)**

#### **Cross-Module Data Flow Pattern**
```typescript
// Standard localStorage keys for cross-module integration
const MODULE_STORAGE_KEYS = {
  firmData: 'prism_firm_data',
  financialData: 'prism_financial_data', 
  forCalculator: 'prism_for_calculator',
  raCalculator: 'prism_ra_calculator',
  kfrCalculator: 'prism_kfr_calculator'
} as const;

// Standard integration data structure
interface ModuleIntegrationData {
  moduleType: string;
  timestamp: string;
  calculationResults: Record<string, number>;
  regulatoryCompliant: boolean;
  auditTrail: AuditEntry[];
}
```

#### **State Management Pattern (Zustand)**
```typescript
// Standard Zustand store structure for each module
interface [Module]Store {
  // State
  data: [Module]Data;
  results: [Module]Results | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateData: (data: Partial<[Module]Data>) => void;
  calculateResults: () => void;
  resetModule: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}
```

---

## SESSION MANAGEMENT & DOCUMENTATION WORKFLOW

### **Session Wrap Process (Mandatory for All Development)**

#### **Pre-Session Requirements**
```yaml
Context Loading Checklist:
□ Load session wrap template: .claude/context/6. session_wrap_PRISM.md
□ Review previous session wraps for patterns and lessons learned
□ Load current CLAUDE.md (this file) for complete development blueprint
□ Define specific, measurable objectives with success criteria
□ Plan detailed file operations and execution sequence
□ Identify context files needed for specific module/task

Objective Setting Template:
Primary: [Main deliverable - must be specific and measurable]
Secondary: [Supporting objectives that enhance primary goal]
Additional: [Nice-to-have objectives if time permits]
Bonus: [Stretch goals or preparation for future sessions]
```

#### **During Session Documentation**
```yaml
Real-Time Tracking:
- Track execution against planned file operations
- Document all technical decisions with reasoning
- Note deviations from plan and why they occurred
- Capture exact code implementations and patterns used
- Record any breakthrough solutions or elegant approaches
- Log performance metrics and calculation accuracy validation

Decision Documentation:
- Why specific approaches were chosen over alternatives
- How regulatory requirements influenced implementation
- Integration decisions and cross-module compatibility choices
- Performance optimization decisions and trade-offs
```

#### **Post-Session Completion (Verbose & Detailed)**
```yaml
Session Wrap Completion:
1. Complete all sections of session wrap template
2. Include detailed execution summary with:
   - Exact files modified with before/after status
   - Technical breakthrough explanations
   - Code pattern implementations
   - Integration success verification
   - Performance benchmarks achieved
   - Regulatory compliance validation

3. Save with proper naming: [module-name]-session-wrap-YYYYMMDD.md
4. Update project status and completion metrics
5. Identify reusable patterns for future module development
6. Commit all changes with detailed commit messages

File Naming Conventions (Strictly Enforced):
✅ session-wraps/[module-name]-session-wrap-20250909.md
✅ modules/core/[module-name]/.claude.md  
✅ tests/[module-name].test.ts
✅ docs/[module-name]-readme.md
```

### **Documentation Quality Standards**

#### **Session Wrap Quality Requirements**
- **Verbose Detail**: Every implementation decision explained with reasoning
- **Code Examples**: Include actual code snippets from key implementations
- **Pattern Documentation**: Identify reusable patterns for future modules
- **Metrics**: Include specific performance and accuracy measurements
- **Integration**: Document cross-module compatibility and data flow testing
- **Regulatory**: Confirm MiFIDPRU/ICARA compliance validation

#### **Context Explorer Integration**
```yaml
Automated Metrics (No Manual Update Required):
- Lines of code totals (parsed from session wraps)
- Module completion status (extracted from file operations)
- Development velocity (calculated from session frequency)
- Integration success rates (parsed from session outcomes)

Manual Updates Required:
- Strategic priorities and focus areas
- Business context and commercial opportunities
- Regulatory framework changes or updates
- Architectural decisions and technical debt
```

---

## QUALITY ASSURANCE CHECKLIST TEMPLATES

### **Pre-Development Checklist (Complete Before Coding)**
```yaml
Context & Planning:
□ Session wrap template loaded and objectives clearly defined
□ Previous session wraps reviewed for applicable patterns
□ HTML prototype analyzed (if applicable) for business logic extraction
□ Regulatory requirements confirmed with specific MiFIDPRU articles
□ Cross-module integration points identified and documented
□ Performance targets established (<200ms calculations, <50ms updates)

Technical Preparation:
□ File structure planned following standard module template
□ Component hierarchy designed with clear separation of concerns  
□ API endpoints planned with standard route structure
□ State management approach decided (Zustand store structure)
□ TypeScript interfaces designed with strict mode compliance
□ Test strategy planned with HTML prototype validation approach
```

### **During Development Checklist (Continuous Validation)**
```yaml
Code Quality Standards:
□ TypeScript strict mode compliance maintained (no 'any' types)
□ Decimal.js used for all monetary calculations (never native Number)
□ Zod validation schemas implemented for all user inputs
□ Error boundaries configured with user-friendly financial messaging
□ Component props properly typed with comprehensive interfaces
□ React hooks follow established patterns (useMemo for calculations)

Integration Requirements:
□ Cross-module data flow patterns followed exactly
□ localStorage integration implemented with standard key naming
□ Audit trail logging included for all calculation operations  
□ State management follows proven Zustand patterns
□ API routes implement standard request/response structure
□ Performance optimizations applied (React.memo, useMemo, useCallback)

Regulatory Compliance:
□ Calculation accuracy verified against regulatory examples
□ MiFIDPRU article references included in code comments
□ Audit trail captures all required data for 7-year retention
□ Financial data handling follows FCA requirements
□ Access control patterns prepared for SMCR implementation
□ Error handling preserves calculation integrity and user context
```

### **Post-Development Checklist (Before Session Completion)**
```yaml
Testing & Validation:
□ Unit test suite implemented with 95%+ code coverage
□ HTML prototype parity validated (penny-perfect accuracy)
□ Cross-module integration tested with existing modules
□ Performance benchmarks met (<200ms calculation response)
□ Error handling tested with edge cases and invalid inputs
□ Responsive design validated across device sizes

Documentation & Completion:
□ Module README.md created with comprehensive documentation
□ Session wrap completed with verbose technical detail
□ Code comments include regulatory references and business logic
□ API documentation updated with new endpoints
□ Integration patterns documented for future module reference
□ Repository committed with detailed commit messages

Production Readiness:
□ Build process successful without warnings or errors
□ TypeScript compilation clean with strict mode
□ No console errors or warnings in browser
□ Security review completed (no exposed secrets or sensitive data)
□ Deployment configuration updated (if required)
□ Monitoring and logging prepared for production use
```

---

## REFERENCE IMPLEMENTATION PATTERNS

### **FOR Calculator Pattern (Proven Implementation)**
*Based on successful 6-hour implementation session - July 2025*

#### **Complex State Management Example**
```typescript
// File: src/modules/core/for-calculator/hooks/useFORCalculations.ts
// Proven pattern for dual-approach calculations

export function useFORCalculation(
  approach: 'consolidated' | 'granular',
  annualExpenditure: number,
  categories: FORCategories,
  adjustments: FORAdjustment[] = []
): FORResult {
  return useMemo(() => {
    // Step 1: Calculate total based on approach
    let totalAnnualExpenditure: number;
    
    if (approach === 'consolidated') {
      totalAnnualExpenditure = annualExpenditure;
    } else {
      // Granular: Sum all 24 subcategories
      totalAnnualExpenditure = Object.values(categories).reduce((sum, category) => {
        return sum + (category.value || 0);
      }, 0);
    }

    // Step 2: Apply regulatory adjustments per MiFIDPRU 4.5.3R
    const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const adjustedExpenditure = totalAnnualExpenditure + totalAdjustments;

    // Step 3: Calculate FOR = Annual Expenditure ÷ 4 (quarterly basis)
    const forRequirement = new Decimal(adjustedExpenditure).div(4).toNumber();

    return {
      totalAnnualExpenditure,
      totalAdjustments,
      adjustedExpenditure,
      forRequirement,
      isValid: forRequirement > 0,
      breakdown: generateBreakdown(categories, approach),
      auditTrail: generateAuditTrail(approach, categories, adjustments)
    };
  }, [approach, annualExpenditure, categories, adjustments]);
}
```

#### **Multi-Section Form Component Pattern**
```typescript
// File: src/modules/core/for-calculator/components/GranularApproach.tsx
// Proven pattern for complex form handling with 24 subcategories

interface GranularApproachProps {
  categories: FORCategories;
  onChange: (categories: FORCategories) => void;
}

export function GranularApproach({ categories, onChange }: GranularApproachProps) {
  const handleCategoryChange = (categoryKey: CategoryKey, value: number) => {
    const updatedCategories = {
      ...categories,
      [categoryKey]: {
        ...categories[categoryKey],
        value: value
      }
    };
    onChange(updatedCategories);
  };

  return (
    <div className="space-y-6">
      {FOR_CATEGORIES.map((category) => (
        <div key={category.key} className="card-section">
          <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.subcategories.map((subcategory) => (
              <div key={subcategory.key} className="form-field">
                <label className="block text-sm font-medium mb-2">
                  {subcategory.name}
                </label>
                <input
                  type="number"
                  value={categories[subcategory.key]?.value || ''}
                  onChange={(e) => handleCategoryChange(
                    subcategory.key, 
                    parseFloat(e.target.value) || 0
                  )}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter annual amount"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### **Financial Data Pattern (Proven Multi-Section Architecture)**
*Based on successful institutional-grade implementation*

#### **Balance Sheet Validation Pattern**
```typescript
// File: src/modules/core/financial-data/hooks/useFinancialCalculations.ts
// Proven pattern for regulatory capital calculations

export function useFinancialCalculations(data: FinancialData): FinancialResults {
  return useMemo(() => {
    // Step 1: Validate balance sheet integrity
    const { assets, liabilities, equity } = data.balanceSheet || {};
    const balanceSheetBalanced = Math.abs(
      (assets?.total || 0) - ((liabilities?.total || 0) + (equity?.total || 0))
    ) < 0.01; // Penny-perfect accuracy

    // Step 2: Calculate Own Funds per MiFIDPRU
    const ownFunds = calculateOwnFunds(data);
    
    // Step 3: Liquidity calculations per Basel III LCR
    const liquidityMetrics = calculateLiquidityMetrics(data);

    return {
      balanceSheetBalanced,
      ownFunds,
      liquidityMetrics,
      isValid: balanceSheetBalanced && ownFunds.total > 0,
      auditTrail: generateFinancialAuditTrail(data)
    };
  }, [data]);
}
```

### **Risk Assessment Pattern (Advanced Implementation)**
*Based on your sophisticated Monte Carlo implementation*

#### **Monte Carlo Simulation Pattern**
```typescript
// File: src/modules/core/ra-calculator_aug_gpt5/services/ra-monte-carlo.ts
// Advanced pattern for performance-critical financial calculations

export class MonteCarloSimulation {
  private worker: Worker | null = null;

  async runSimulation(
    risks: RiskItem[], 
    iterations: number = 10000,
    confidenceLevel: number = 99.5
  ): Promise<SimulationResults> {
    
    // Use Web Worker for CPU-intensive calculations
    if (!this.worker) {
      this.worker = new Worker('/js/ra-monte-carlo.worker.js');
    }

    return new Promise((resolve, reject) => {
      this.worker!.postMessage({
        risks,
        iterations,
        confidenceLevel,
        correlationMatrix: this.buildCorrelationMatrix(risks)
      });

      this.worker!.onmessage = (event) => {
        const { results, error } = event.data;
        if (error) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      };
    });
  }

  private buildCorrelationMatrix(risks: RiskItem[]): CorrelationMatrix {
    // Sophisticated correlation modeling for institutional risk assessment
    // Implementation details...
  }
}
```

### **API Integration Pattern (Consistent Across All Modules)**
```typescript
// Standard API hook pattern used across all modules
export function use[Module]API() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveCalculation = async (data: [Module]Data): Promise<[Module]Results> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/calculations/[module]`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Calculation failed: ${response.statusText}`);
      }

      const results = await response.json();
      
      // Save to localStorage for cross-module integration
      localStorage.setItem('prism_[module]_data', JSON.stringify(data));
      localStorage.setItem('prism_[module]_results', JSON.stringify(results));

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { saveCalculation, loading, error };
}
```

---

**Context Window Optimization**: Complete development blueprint with proven patterns and implementation guidance  
**Implementation Ready**: Zero ambiguity - copy-paste patterns ensure first-time integration success  
**Session Management**: Integrated workflow with Context Explorer automation  
**Last Updated**: 9th September 2025 - Enhanced with complete technical blueprint  
**Status**: Ultimate AI-assisted development reference for institutional financial software  

---

*This enhanced CLAUDE.md file provides complete technical implementation guidance, session management integration, and proven patterns from successful modules - enabling seamless AI-assisted development of sophisticated financial regulatory software.*