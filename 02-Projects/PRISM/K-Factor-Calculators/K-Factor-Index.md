# 📊 K-Factor Calculator Documentation

> *IFPR K-Factor implementation for UK investment firms*

---
**Linked Files** :
[[0. master_context_PRISM]]
[[02-Projects/PRISM/PRISM_MASTER_REFERENCE|PRISM_MASTER_REFERENCE]]
[[CLAUDE-MASTER]]

## 🎯 Overview

K-Factors are quantitative indicators that reflect the risk that an investment firm poses to:
- **Clients** (K-C factors)
- **Markets** (K-M factors)
- **The firm itself** (K-F factors)

---

## 📈 Implemented K-Factors

### Risk to Client (RtC)

#### K-AUM (Assets Under Management)
- **Documentation**: [[GOLDEN-SOURCE/02-DOCUMENTATION/calculator documentation/kaum-documentation|K-AUM Docs]]
- **Status**: ✅ Complete
- **Formula**: 0.02% × AUM
- **Testing**: Full coverage

#### K-CMH (Client Money Held)
- **Documentation**: [[GOLDEN-SOURCE/02-DOCUMENTATION/calculator documentation/kcmh-documentation|K-CMH Docs]]
- **Status**: ✅ Complete
- **Formula**: Based on segregated/non-segregated
- **Testing**: Full coverage

#### K-ASA (Assets Safeguarded and Administered)
- **Documentation**: [[GOLDEN-SOURCE/02-DOCUMENTATION/calculator documentation/kasa-feature-user-documentation|K-ASA Docs]]
- **Status**: ✅ Complete
- **Formula**: 0.04% × ASA
- **Testing**: Full coverage

#### K-COH (Client Orders Handled)
- **Status**: 🟡 In Testing
- **Formula**: Cash trades × 0.1%, Derivatives × 0.01%
- **Note**: Awaiting production data

---

### Risk to Market (RtM)

#### K-NPR (Net Position Risk)
- **Status**: 🔵 In Development
- **Target**: Q1 2025

#### K-CMG (Clearing Margin Given)
- **Status**: 🔵 Planned
- **Target**: Q1 2025

---

### Risk to Firm (RtF)

#### K-TCD (Trading Counterparty Default)
- **Status**: 🔵 Planned
- **Target**: Q2 2025

#### K-DTF (Daily Trading Flow)
- **Documentation**: [[GOLDEN-SOURCE/02-DOCUMENTATION/calculator documentation/kdtf-documentation|K-DTF Docs]]
- **Status**: ✅ Complete
- **Formula**: Cash × 0.1%, Derivatives × 0.01%

#### K-CON (Concentration Risk)
- **Status**: 🔵 Research Phase
- **Complexity**: High
- **Dependencies**: Client exposure data

---

## 🧮 Calculation Framework

### Input Data Flow
```
Data Sources → Validation → Calculation → Aggregation → Reporting
```

### Common Components
1. **Data Validators** - Ensure input integrity
2. **Calculation Engine** - Apply FCA formulas
3. **Audit Trail** - Track all calculations
4. **Error Handling** - Graceful degradation

---

## 📋 Testing Strategy

### Unit Tests
- Individual calculator logic
- Edge cases and boundaries
- Error scenarios

### Integration Tests
- Data flow through system
- Multi-calculator scenarios
- Reporting accuracy

### Test Data
- Location: `/srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/test data generators`
- Coverage: All K-Factors
- Scenarios: Normal, edge, error cases

---

## 🔗 Related Documentation

### Regulatory References
- [[FCA IFPR Handbook]]
- [[K-Factor Methodologies]]
- [[Prudential Requirements]]

### Implementation Guides
- [[Calculator Architecture]]
- [[Data Model Specifications]]
- [[API Endpoints Reference]]

### Session History
- [[Module 3 Session Wraps]]
- [[Calculator Design Issues]]
- [[Performance Optimizations]]

---

## ⚠️ Known Issues & Limitations

1. **K-COH**: Derivative categorization pending clarification
2. **K-CMG**: Formula interpretation varies by clearing house
3. **K-TCD**: Requires enhanced counterparty data model

---

## 🚦 Validation Rules

### Global Rules
- No negative values
- Currency consistency
- Date range validation
- Mandatory field checks

### Calculator-Specific
- K-AUM: Discretionary vs non-discretionary split
- K-CMH: Segregation status required
- K-ASA: Custody arrangement classification

---

## 📊 Performance Metrics

| Calculator | Avg Time | Max Records | Memory |
|------------|----------|-------------|---------|
| K-AUM | 12ms | 10,000 | 25MB |
| K-CMH | 8ms | 5,000 | 15MB |
| K-ASA | 15ms | 10,000 | 30MB |
| K-DTF | 20ms | 50,000 | 45MB |

---

## 🏷️ Tags

`#prism/k-factor` `#prism/compliance` `#prism/ifpr` `#prism/calculator`

---

*Index updated: {{date}}*
[[PRISM-Hub]] | [[Home]]