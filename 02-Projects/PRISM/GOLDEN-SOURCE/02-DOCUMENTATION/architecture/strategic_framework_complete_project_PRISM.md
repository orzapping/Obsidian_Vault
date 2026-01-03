												# ICARA/MiFIDPRU Platform AI-Assisted Development Framework
## Complete Project Scope & Strategic Implementation Guide

## Executive Summary

This document establishes the comprehensive framework for coordinating AI-assisted development of the complete ICARA/MiFIDPRU Risk Intelligence Platform (PRISM). The project encompasses **18 total modules** across core regulatory calculations and supplementary tools, representing the most sophisticated regulatory compliance platform in the financial services industry.

**Project Status**: 18 modules complete, 2 in progress, 6 planned  
**Completion Rate**: circa 75% overall completion with strong momentum  
**Architecture**: Enterprise TypeScript/React platform migration from proven HTML prototypes  
**Team Structure**: Solo founder + AI development model with strategic facilitators  

## Complete Project Scope

### Core Modules (12 Total)

#### Completed Core Modules (6)
1. **FOR Calculator** - Fixed Overhead Requirement with granular cost tracking
2. **KFR Calculator** - K-Factor Requirement with SNI intelligence; with 9 sub kfr-calculator algorithms 
3. **WDA Calculator** - Wind-Down Assessment with timeline and cost phasing
4. **RA Calculator** - Risk Assessment with controls library and gross/net analysis
5. **Financial Data Module** - Centralized financial statements and prudential data collection
6. **Firm & SMCR Data Module** - Corporate, regulatory, and SMCR personnel data management

#### In Progress Core Modules (2)
7. **Stress Test Module** - Dynamic stress testing with cascading effects
8. **Reverse Stress Test** - AI-powered failure point discovery

#### Planned Core Modules (4)
9. **Intelligence Dashboard** - Real-time MCR tracking and insights
10. **Historical Data** - Time-series analysis and pattern recognition
11. **Reporting Module** - Automated regulatory and management reporting
12. **User Management** - SMCR-aligned access control and audit

### Supplementary Modules (4 Total - All Complete)
1. **K-CON Calculator** - Concentration Risk with connected counterparty handling
2. **K-NPR Calculator** - Net Position Risk covering multiple asset classes
3. **K-CMG Calculator** - Clearing Member Guarantee with multi-CCP management
4. **K-TCD Calculator** - Trading Counterparty Default using SA-CCR methodology

## Strategic Organization Framework for AI-Assisted Migration

### 1. Project Organization Strategy

#### Recommended Directory Structure
```
icara-platform/
├── .claude/
│   ├── context/                     # Master reference documents
│   │   ├── master-context.claude.md # Primary context file
│   │   ├── migration-strategy.md
│   │   ├── calculation-testing-guide.md
│   │   ├── api-specification-guide.md
│   │   ├── deployment-guide.md
│   │   └── contributing-guide.md
│   ├── prompts/                     # Execution-ready prompts
│   │   ├── module-migration.claude.md
│   │   ├── calculation-validation.claude.md
│   │   ├── testing-framework.claude.md
│   │   └── integration-testing.claude.md
│   └── templates/                   # Reusable templates
│       ├── calculator-component.ts.template
│       ├── test-suite.ts.template
│       ├── api-endpoint.ts.template
│       └── module-structure.template
├── modules/
│   ├── core/
│   │   ├── for-calculator/
│   │   │   ├── .claude.md          # Module-specific context
│   │   │   ├── legacy/
│   │   │   │   └── FORCalc_.html   # Source prototype
│   │   │   ├── src/                # Generated TypeScript
│   │   │   └── tests/              # Generated tests
│   │   ├── kfr-calculator/
│   │   ├── wda-calculator/
│   │   ├── ra-calculator/
│   │   ├── financial-data/
│   │   ├── firm-smcr-data/
│   │   ├── stress-test/
│   │   ├── reverse-stress-test/
│   │   ├── intelligence-dashboard/
│   │   ├── historical-data/
│   │   ├── reporting/
│   │   └── user-management/
│   └── supplementary/
│       ├── k-con-calculator/
│       ├── k-npr-calculator/
│       ├── k-cmg-calculator/
│       └── k-tcd-calculator/
├── shared/
│   ├── types/
│   ├── utils/
│   ├── validation/
│   └── regulatory/
└── docs/
    ├── migration-logs/
    ├── regulatory-compliance/
    └── module-documentation/
```

### 2. .claude.md File Strategy

#### Master Context Philosophy
- **Single Source of Truth**: All module-specific .claude.md files reference the master context
- **Regulatory Accuracy**: Every context file emphasizes 100% calculation parity with HTML prototypes
- **Audit Trail**: Complete regulatory compliance and documentation requirements
- **Performance Standards**: <200ms calculation response times for institutional clients

#### Module-Specific .claude.md Template
```markdown
# [Module Name] Migration Context

## Include Master Context
Please reference the master context at `.claude/context/master-context.claude.md` for overall project requirements.

## Module-Specific Details
**Source File**: `modules/[category]/[module-name]/legacy/[source-file].html`
**Target Architecture**: [React TypeScript component / Data management system / Dashboard interface]
**Module Category**: [Core / Supplementary]
**Completion Status**: [Complete / In Progress / Planned]

## Unique Features
- [Key feature 1]
- [Key feature 2] 
- [Key feature 3]

## Regulatory References
- [Primary regulation]: [Description]
- [Secondary regulation]: [Description]

## Cross-Validation Requirements
Must achieve 100% parity with HTML prototype across all test scenarios.

## Integration Dependencies
- [Module dependencies]
- [Data flow requirements]
- [API integration points]

## Current Phase
[Status and next steps]
```

### 3. Execution Command Framework

#### Primary Migration Command Template
```bash
# Execute with comprehensive context for any module
claude code \
  --context .claude/context/master-context.claude.md \
  --context .claude/context/migration-strategy.md \
  --context modules/[category]/[module-name]/.claude.md \
  --prompt "
MIGRATION OBJECTIVE: Migrate [Module Name] from HTML to TypeScript/React

SPECIFIC TASKS:
1. Analyze source HTML file: modules/[category]/[module-name]/legacy/[source-file].html
2. Extract business logic and calculation algorithms
3. Generate TypeScript interfaces with Zod validation
4. Create React components following architecture guidelines
5. Implement tRPC API endpoints per specification
6. Generate comprehensive test suite with regulatory validation
7. Create cross-validation tests against HTML prototype

REGULATORY REQUIREMENTS:
- Maintain 100% calculation accuracy
- Implement complete audit trail
- Follow MiFIDPRU/ICARA compliance patterns
- Generate regulatory documentation

INTEGRATION REQUIREMENTS:
- Ensure compatibility with existing [X] completed modules
- Follow established data flow patterns
- Maintain performance standards (<200ms response)

DELIVERABLES:
- TypeScript calculation engine
- React UI components
- tRPC API routes
- Test suite with HTML cross-validation
- Documentation with regulatory references

Please follow the migration strategy exactly as documented."
```

#### Module Category-Specific Commands

**For Core Modules:**
```bash
claude code \
  --context .claude/context/master-context.claude.md \
  --context modules/core/[module-name]/.claude.md \
  --prompt "
CORE MODULE MIGRATION: [Module Name]

This is a core regulatory calculation module requiring:
- Integration with MCR aggregation system
- Real-time calculation updates
- Comprehensive audit trail
- FCA-ready reporting capabilities

Follow core module patterns established in completed modules:
FOR, KFR, WDA, RA, Financial Data, Firm & SMCR Data
"
```

**For Supplementary Modules:**
```bash
claude code \
  --context .claude/context/master-context.claude.md \
  --context modules/supplementary/[module-name]/.claude.md \
  --prompt "
SUPPLEMENTARY MODULE MIGRATION: [Module Name]

This is a K-factor calculation module requiring:
- Integration with KFR Calculator
- Specialized calculation methodologies
- Component-based architecture
- Seamless data flow to primary calculations

Follow supplementary module patterns established in completed modules:
K-CON, K-NPR, K-CMG, K-TCD
"
```

### 4. Team Coordination Protocol

#### Enhanced Role Definitions

**You (Project Lead)**:
- Strategic oversight and regulatory validation across all 18 modules
- Quality assurance and institutional client requirements
- Claude Code execution coordination for all module categories
- Final approval on all deliverables
- Integration validation across core and supplementary modules

**Experienced Team Member**:
- Documentation review and organization across full project scope
- Test scenario preparation for complex regulatory calculations
- Integration validation between completed and in-progress modules
- Cross-reference checking against regulatory standards
- Performance benchmarking coordination

**Mid-Level Team Member**:
- File organization and preparation for all 18 modules
- Basic testing execution for completed modules
- Documentation formatting and maintenance
- Progress tracking across core and supplementary categories
- Legacy HTML file organization and preparation

**Claude (via Claude Code)**:
- All code generation and implementation across 18 modules
- Technical architecture implementation following established patterns
- Test suite creation with regulatory compliance validation
- Documentation generation with regulatory references
- Integration code for module interconnectivity

### 5. Module Development Sequence Strategy

#### Phase 1: Foundation Consolidation (Weeks 1-2)
**Objective**: Strengthen completed modules and establish migration patterns

**Core Modules (Completed)**:
- FOR Calculator: Refine granular cost tracking and scenario planning
- KFR Calculator: Enhance SNI intelligence and threshold monitoring
- WDA Calculator: Optimize timeline and stress scenario modeling
- RA Calculator: Improve correlation modeling and controls effectiveness
- Financial Data Module: Strengthen data validation and regulatory reporting
- Firm & SMCR Data Module: Enhance permissions matrix and K-factor relevance

**Supplementary Modules (All Completed)**:
- K-CON, K-NPR, K-CMG, K-TCD: Integration testing and performance optimization

#### Phase 2: Active Development (Weeks 3-6)
**Objective**: Complete in-progress modules and begin planned modules

**In Progress**:
- Stress Test Module: Complete cascading effects and correlation modeling
- Reverse Stress Test: Finalize AI-powered failure point discovery

**Begin Planned**:
- Intelligence Dashboard: Real-time MCR tracking and predictive analytics
- Historical Data: Time-series analysis and pattern recognition engine

#### Phase 3: Advanced Features (Weeks 7-10)
**Objective**: Complete remaining core modules

**Planned Completion**:
- Reporting Module: Automated MIF007 and smart narrative generation
- User Management: SMCR-aligned access control with full audit trail

#### Phase 4: Integration & Optimization (Weeks 11-12)
**Objective**: System-wide integration and performance optimization

**System Integration**:
- Cross-module data flow optimization
- Real-time calculation engine performance tuning
- Comprehensive regulatory compliance testing
- End-to-end user journey validation

### 6. Quality Assurance Framework

#### Module Category Standards

**Core Module Requirements**:
- 100% HTML prototype parity
- <200ms calculation response time
- Complete regulatory audit trail
- Integration with MCR aggregation
- Real-time update capabilities
- FCA-ready export formats

**Supplementary Module Requirements**:
- Seamless integration with KFR Calculator
- Specialized calculation accuracy
- Component-based data architecture
- Performance optimized for complex calculations
- Regulatory methodology documentation

#### Continuous Validation Strategy
```bash
# Comprehensive validation across all completed modules
claude code \
  --context .claude/context/master-context.claude.md \
  --context .claude/context/calculation-testing-guide.md \
  --prompt "
Execute comprehensive validation suite for all 10 completed modules:

CORE MODULES VALIDATION:
1. FOR Calculator: All cost categories and scenario planning
2. KFR Calculator: SNI intelligence and threshold monitoring
3. WDA Calculator: Timeline optimization and stress scenarios
4. RA Calculator: Correlation modeling and controls effectiveness
5. Financial Data: Regulatory data validation and reporting
6. Firm & SMCR Data: Permissions matrix and K-factor relevance

SUPPLEMENTARY MODULES VALIDATION:
1. K-CON Calculator: Concentration risk and counterparty grouping
2. K-NPR Calculator: Multi-asset class position risk
3. K-CMG Calculator: Multi-CCP guarantee calculations
4. K-TCD Calculator: SA-CCR methodology implementation

INTEGRATION TESTING:
- Cross-module data flow validation
- MCR aggregation accuracy
- Real-time update performance
- Regulatory compliance across all modules

Generate comprehensive compliance report for institutional review.
"
```

### 7. Success Metrics & Milestones

#### Current Achievement Status
- **Modules Completed**: 10/18 (55% completion rate)
- **Core Modules**: 6/12 completed (50% completion rate)
- **Supplementary Modules**: 4/4 completed (100% completion rate)
- **Project Momentum**: Strong - 10 modules in 8 weeks

#### Target Milestones
- **Week 2**: Stress Test & Reverse Stress Test completion (67% total completion)
- **Week 6**: Intelligence Dashboard & Historical Data completion (78% total completion)
- **Week 10**: Reporting & User Management completion (100% total completion)
- **Week 12**: Full system integration and optimization complete

#### Performance Benchmarks
- **Calculation Accuracy**: 100% parity with HTML prototypes (non-negotiable)
- **Response Time**: <200ms for all calculations (institutional standard)
- **Concurrent Users**: Support for 1000+ simultaneous calculations
- **Regulatory Compliance**: FCA-ready with complete audit trail
- **Data Retention**: 7-year regulatory compliance automatically maintained

### 8. Risk Management for Full Project Scope

#### Technical Risks
- **Integration Complexity**: 18 modules require seamless data flow
- **Performance Scaling**: Complex calculations across multiple modules
- **Regulatory Updates**: Changes affecting multiple calculation methodologies

#### Mitigation Strategies
- **Modular Architecture**: Independent module development with standardized interfaces
- **Performance Monitoring**: Continuous benchmarking across all modules
- **Regulatory Monitoring**: Proactive tracking of FCA updates and implementation

### 9. Commercial Impact Projection

#### Industry Transformation
- **First Complete Platform**: Integrated ICARA/MiFIDPRU solution
- **Market Disruption**: 90% time reduction vs traditional consulting
- **Cost Savings**: £100k+ per firm vs consultant fees
- **Accuracy Enhancement**: 100% regulatory compliance guarantee

#### Institutional Client Value
- **Real-time Capital Management**: Live MCR tracking across all components
- **Regulatory Confidence**: FCA-ready reporting and documentation
- **Operational Efficiency**: Integrated workflow across all regulatory requirements
- **Strategic Intelligence**: Predictive analytics and scenario planning

This comprehensive framework ensures systematic development of all 18 modules while maintaining the regulatory accuracy and audit trail essential for institutional financial services clients. The clear separation of concerns between strategic oversight, facilitation, and AI-assisted implementation creates an efficient and reliable development process for this industry-transforming platform.