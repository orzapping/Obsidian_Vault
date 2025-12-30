# PRISM Platform Enhancement Session Prompt - September 19, 2025

## 🎯 SESSION OVERVIEW

**Primary Objective**: Major platform reorganization with navigation restructure, module categorization, integration enhancements, and new K-Factor calculator migrations

**Session Type**: Multi-phase development session focusing on:
1. Navigation architecture restructuring
2. Module statistics updates and categorization
3. SNI/Non-SNI classification system enhancement
4. Data integration between modules
5. Migration of 7 new K-Factor calculators from HTML prototypes

---

## 📋 PREPARATION REQUIREMENTS

### Pre-Session Setup
1. **Project Cloning**: Create new working directory `project-prism-sandbox-19092025` from current codebase
2. **Context Loading**: Reference previous session wrap: `session-wrap-prism-ui-standardization-and-module-implementation.md`
3. **Prototype Access**: Validate access to `/srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/` directory
4. **Current State Assessment**: Review existing 30 TypeScript components across 4 module categories

### Reference Materials Required
- **Aurora UI Guidance**: `guidance-memo-aurora.md` for consistent styling patterns
- **Master Context**: `.claude/context/0. master_context_PRISM.md` for regulatory requirements
- **Previous Session Documentation**: All session wraps in `.claude/session-wraps/`
- **HTML Prototypes**: 20+ proven calculators in `/srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/`

---

## 🏗️ PHASE 1: NAVIGATION ARCHITECTURE RESTRUCTURING

### Module Category Reorganization
Update main navigation structure from current generic labels to business-logical categories:

#### Current → New Navigation Structure
```
Current Categories:
├── Core
├── Calculators
├── Admin
└── Reporting

New Categories:
├── Foundational Data
├── MiFiD Calculators
│   ├── Core Calculators
│   └── K-Factor Calculators/Data Parsers
├── Admin
├── Reporting
└── All Modules
```

### Detailed Category Mapping

#### 1. Foundational Data
**Purpose**: Core business and regulatory data collection
**Modules**:
- Firm Data (existing - `/src/modules/core/firm-data/`)
- Financial Data (existing - `/src/modules/core/financial-data/`)
- Stress Test (existing - `/src/modules/core/stress-testing/`)
- Intelligence Dashboard (new - requires implementation)

#### 2. MiFiD Calculators
**Purpose**: MiFIDPRU regulatory calculation engines

##### 2a. Core Calculators
- FOR Calculator (existing - `/src/modules/calculators/for/`)
- KFR Calculator (existing - `/src/modules/calculators/kfr/`)
- Risk Assessment Calculator (requires UI migration only - source: `/srv/prism-shared/DEVELOPMENT/prism-sandbox/ui-playground - 10-sept-2025/src/modules/core/`)
- Wind Down Assessment Calculator (requires UI migration only - source: `/srv/prism-shared/DEVELOPMENT/prism-sandbox/ui-playground - 10-sept-2025/src/modules/core/`)
- OFAR Calculator (new - requires migration from HTML prototype)

##### 2b. K-Factor Calculators/Data Parsers
**All require migration from HTML prototypes to TypeScript/React with Aurora UI**:
- KAUM (K-AUM) - Asset Under Management
- KASA (K-ASA) - Assets Safeguarded and Administered
- KCOH (K-COH) - Client Orders Handled
- KCMH (K-CMH) - Client Money Held
- KDTF (K-DTF) - Daily Trading Flow
- KNPR (existing - `/src/modules/calculators/knpr/`) - Net Position Risk
- KTCD (existing - `/src/modules/calculators/ktcd/`) - Trading Counterparty Default
- KCON (existing - `/src/modules/calculators/kcon/`) - Concentration Risk
- KCMG (existing - `/src/modules/calculators/kcmg/`) - Clearing Member Guarantee

#### 3. Admin
- User Management (existing - `/src/modules/admin/user-management/`)
- SMCR (new - requires migration from prototype)

#### 4. Reporting
- Regulatory Reporting (existing - `/src/modules/reporting/regulatory/`)

---

## 📊 PHASE 2: PLATFORM STATISTICS UPDATES

### Module Count Update
**Current State Analysis Required**:
- Count existing HTML prototypes in `/srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/`
- Count current TypeScript modules in `/src/modules/`
- Calculate migration requirements

**Expected Total**: ~20 modules
- **Completed**: Current TypeScript implementations
- **In Progress**: Modules requiring UI migration only
- **Planned**: New modules requiring full migration from HTML prototypes

### Dashboard Metrics Enhancement
Update top-level application statistics to reflect:
1. **Total Module Count**: Accurate count from prototype + current analysis
2. **Completion Status**: Percentage of modules fully migrated and integrated
3. **K-Factor Coverage**: Number of K-factors implemented vs. MiFIDPRU requirements
4. **Integration Status**: Cross-module data flow completion

---

## 🔧 PHASE 3: SNI CLASSIFICATION SYSTEM ENHANCEMENT

### Terminology Updates
**Current Issue**: Inconsistent language across modules for firm classification
**Solution**: Standardize to regulatory terminology

#### SNI Classification Standards
```
Current Inconsistent Terms → Standardized Terms:
"Small Firm" → "Small Non-Interconnected (SNI) Firm"
"Large Firm" → "Non-Small Non-Interconnected Firm"
"Complex Firm" → "Non-Small Non-Interconnected Firm"
```

### Implementation Requirements
1. **Global Search & Replace**: Update all modules with consistent SNI terminology
2. **Regulatory Alignment**: Ensure terms match MiFIDPRU Article 4.6 exactly
3. **Help Text Updates**: Add regulatory citations for clarity
4. **Validation Logic**: Ensure SNI classification triggers appropriate K-factor requirements

---

## 🔗 PHASE 4: INTER-MODULE DATA INTEGRATION

### Firm Type Integration
**Objective**: Eliminate redundant data entry across modules

#### Data Flow Architecture
```
Firm Data Module (Source) → All Other Modules (Consumers)
├── Firm Type Classification
├── SNI Status
├── Business Activities
├── K-Factor Applicability
└── Regulatory Classification
```

### KFR Module Enhancement
**Dual Data Entry Methods**:

#### Method 1: Auto-Populate
- **Source**: Pull directly from Firm Data Module
- **Trigger**: Automatic population based on firm classification
- **Validation**: Cross-reference with business activities
- **Override**: Manual adjustment capability maintained

#### Method 2: Manual Entry
- **Purpose**: Override capability for complex scenarios
- **Validation**: Warning prompts if conflicts with firm data
- **Audit Trail**: Log manual overrides for compliance

### K-Factor Calculator Integration
**Bidirectional Data Flow**:

#### Input Methods:
1. **Manual Entry**: Direct numerical input for each K-factor
2. **Auto-Calculation**: Link to specific K-factor calculator modules

#### Validation Requirements:
- **Formula Verification**: Confirm all K-factor formulas match MiFIDPRU articles
- **Coefficient Accuracy**: Validate all regulatory coefficients
- **Threshold Compliance**: Implement MiFIDPRU/FCA Handbook thresholds

---

## 📈 PHASE 5: ENHANCED DATA VISUALIZATION

### Chart Integration Maintenance
**Preserve Existing**: Maintain current RtC/RtM/RtF (Ready to Complete/Monitor/File) visuals

### New Analytics Enhancement
**Implement Additional Visualizations**:
1. **K-Factor Breakdown Charts**: Visual representation of each K-factor contribution
2. **SNI Threshold Monitoring**: Real-time tracking of SNI status changes
3. **Module Completion Dashboard**: Progress tracking across all modules
4. **Regulatory Compliance Score**: Visual compliance status indicator
5. **Historical Trend Analysis**: Time-series data for key metrics

---

## 🚀 PHASE 6: CRITICAL MODULE MIGRATIONS

### Priority 1: Existing TS/React Modules (UI Migration Only)
**Modules**: Risk Assessment, Wind Down Assessment
**Source Locations**:
- Risk Assessment: `/srv/prism-shared/DEVELOPMENT/prism-sandbox/ui-playground - 10-sept-2025/src/modules/core/ra-calculator_aug_gpt5/`
- Wind Down Assessment: `/srv/prism-shared/DEVELOPMENT/prism-sandbox/ui-playground - 10-sept-2025/src/modules/core/winddown-calculator/`
**Task**: Extract business logic and apply Aurora UI theme
**Requirements**:
- **Source Files**: Read existing TypeScript/React implementations from specified directories
- **Business Logic Preservation**: Copy all calculation logic, state management, and features EXACTLY
- **UI Transformation**: Replace old Tailwind classes with Aurora theme patterns
- **Component Structure**: Maintain existing component architecture, only update styling
- **Route Integration**: Create new routes at `/src/app/modules/calculators/[module]/page.tsx`
- **DO NOT**: Simplify, optimize, or change any business functionality

### Priority 2: New K-Factor Calculator Migrations
**Source**: `/srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/01-KFR-CALCULATORS/01-KFR-CALCULATORS-PROOF-OF-CONCEPT/`

#### Modules for Migration:
1. **KASA** (K-ASA Calculator)
2. **KAUM** (K-AUM Calculator)
3. **KCOH** (K-COH Calculator)
4. **KCMH** (K-CMH Calculator)
5. **KDTF** (K-DTF Calculator)
6. **OFAR** (OFAR Calculator)
7. **SMCR** (SMCR Compliance Module)

#### Migration Requirements:
- **HTML to TypeScript/React**: Full framework migration
- **Aurora UI Implementation**: Apply established design system
- **Calculation Accuracy**: Maintain penny-perfect regulatory compliance
- **Integration Points**: Connect to KFR main calculator
- **Route Structure**: Follow `/src/app/modules/calculators/[module]/page.tsx` pattern

---

## 🔍 QUALITY ASSURANCE REQUIREMENTS

### Regulatory Compliance Validation
1. **Formula Accuracy**: Cross-validate all calculations against MiFIDPRU articles
2. **Coefficient Verification**: Ensure all regulatory coefficients are current
3. **Threshold Compliance**: Implement latest FCA Handbook thresholds
4. **Audit Trail**: Maintain complete calculation history for 7-year retention

### Technical Standards
1. **TypeScript Compliance**: Strict mode with comprehensive type safety
2. **Aurora UI Consistency**: Apply design system across all new/updated modules
3. **Performance Standards**: <200ms response time for standard calculations
4. **Integration Testing**: Verify cross-module data flow functionality

### Documentation Requirements
1. **Session Wrap Creation**: Comprehensive documentation of all changes
2. **Module Documentation**: Update guidance memo with new patterns
3. **Integration Guides**: Document new data flow architecture
4. **Migration Patterns**: Establish templates for future HTML→TS migrations

---

## 📝 SUCCESS CRITERIA

### Functional Completeness
- [ ] Navigation restructured with business-logical categories
- [ ] All 7 new K-factor calculators migrated and integrated
- [ ] SNI classification standardized across platform
- [ ] Inter-module data integration functional
- [ ] Enhanced analytics and visualizations implemented
- [ ] Risk Assessment and Wind Down Assessment modules migrated

### Technical Excellence
- [ ] All modules compile without errors
- [ ] Aurora UI consistently applied
- [ ] Performance benchmarks met
- [ ] Cross-module integration tested
- [ ] Regulatory compliance validated

### Documentation & Knowledge Preservation
- [ ] Comprehensive session wrap completed
- [ ] Migration patterns documented
- [ ] Integration architecture documented
- [ ] Aurora UI guidance updated

---

## 🎯 EXPECTED DELIVERABLES

1. **Enhanced Platform Structure**: Professional navigation with logical module categorization
2. **Complete K-Factor Suite**: All 9 K-factors implemented and integrated
3. **Unified Data Architecture**: Cross-module integration eliminating redundant data entry
4. **Regulatory Compliance**: 100% MiFIDPRU article compliance with audit trails
5. **Professional UI**: Consistent Aurora theme across all 20+ modules
6. **Advanced Analytics**: Enhanced visualizations and compliance monitoring
7. **Migration Templates**: Established patterns for future HTML prototype migrations

This session will significantly advance the PRISM platform toward production readiness with comprehensive module coverage, professional UI consistency, and robust regulatory compliance capabilities.

---

**Session Complexity**: High
**Estimated Duration**: Extended multi-phase session (3-4 hours)
**Prerequisites**: MCP context loading, prototype access validation, Aurora UI guidance reference
**Risk Mitigation**: Preserve existing functionality while enhancing architecture and adding new capabilities