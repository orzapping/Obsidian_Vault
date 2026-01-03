# Intelligence Dashboard Reference Document
## ICARA/MIFIDPRU Platform - Master Control Centre

---

## Executive Overview

The Intelligence Dashboard is the crown jewel of the ICARA/MIFIDPRU platform, transforming raw regulatory calculations into actionable business intelligence. It serves as the master control centre that aggregates data from all calculator modules (FOR, KFR, WDA, RA) to compute the Minimum Capital Requirement (MCR) and provide strategic insights.

**Core Purpose**: Calculate and visualize MCR while providing predictive analytics, scenario planning, and regulatory intelligence to ensure firms maintain optimal capital adequacy.

---

## 📐 Core Architecture

### Design Principles
1. **Plugin-Based Architecture** - Each data source is a modular plugin
2. **Event-Driven Updates** - Components communicate via events, not direct dependencies  
3. **Progressive Enhancement** - Core functionality works without optional modules
4. **Graceful Degradation** - Missing data doesn't break the dashboard

### MCR Calculation Formula
```
MCR = max { PMR, FOR, KFR, WDA, RA }
```
Where:
- **PMR**: Permanent Minimum Requirement (£75k/£150k/£750k based on classification)
- **FOR**: Fixed Overhead Requirement (25% of annual expenditure)
- **KFR**: K-Factor Requirement (sum of applicable K-factors)
- **WDA**: Wind-Down Assessment (orderly closure costs)
- **RA**: Risk Assessment (firm-specific risk capital)

---

## 🎯 Stage 1: Essential Minimum Requirements

### 1.1 Primary MCR Widget (Hero Component)
```typescript
interface MCRDisplay {
  currentMCR: number;              // The highest of all 5 components
  determiningFactor: string;       // Which component is driving MCR
  utilizationRate: number;         // Current capital / MCR (%)
  headroom: number;               // Available capital - MCR
  status: 'COMPLIANT' | 'WARNING' | 'BREACH';
  lastCalculated: Date;
}
```

### 1.2 Five Components Breakdown
Visual cards displaying each component with:
- Current value (£)
- Percentage of MCR
- Trend indicator (↑↓→)
- Last updated timestamp
- Quick drill-down link

### 1.3 MCR Waterfall Chart
Visual flow showing component progression to final MCR:
```
PMR ──────────────► £150,000
FOR ────► £45,000
KFR ───► £30,000  
WDA ─────► £55,000
RA ────► £42,000
         └─► MCR = £150,000 (PMR drives)
```

### 1.4 Capital Adequacy Metrics
```typescript
interface CapitalMetrics {
  // Primary Metrics
  ownFunds: number;                    
  ownFundsRequirement: number;         // max(PMR, FOR, KFR)
  icaraThresholdRequirement: number;   // max(WDA, RA)
  
  // Coverage Ratios
  mcrCoverage: number;                 // Own Funds / MCR
  liquidityRatio: number;              
  
  // Warning Thresholds
  earlyWarningThreshold: number;       // 110% of MCR
  interventionPoint: number;           // 120% of MCR
}
```

### 1.5 Regulatory Compliance Panel
- **Traffic Light System**:
  - 🟢 Green: Capital > 120% MCR
  - 🟡 Amber: Capital 100-120% MCR
  - 🔴 Red: Capital < 100% MCR
- **Key Dates**: ICARA submission, quarterly reporting
- **Data Completeness**: Module status grid

---

## 🚀 Stage 2: Enhanced Intelligence Features

### 2.1 Predictive Analytics
- MCR trajectory modeling (1, 3, 6, 12 months)
- Driver analysis (which component will likely increase)
- Confidence intervals for predictions

### 2.2 Scenario Planning
```typescript
interface ScenarioEngine {
  presetScenarios: [
    'Market Downturn (-30% AUM)',
    'Key Client Loss (Top 3)',
    'Regulatory Change (K-factor increase)',
    'Operational Crisis'
  ];
  
  runScenario(scenario: Scenario): {
    newMCR: number;
    capitalShortfall?: number;
    timeToRecover: number;
    mitigationActions: string[];
  };
}
```

### 2.3 AI-Powered Insights
- Pattern recognition from historical data
- Anomaly detection in cost structures
- Risk correlation analysis
- Natural language commentary generation

### 2.4 Advanced Visualizations
- **Multi-Dimensional Risk Radar**: Spider chart of risk categories
- **Time Series Analysis**: 12-month rolling MCR evolution
- **Heat Map Matrix**: Risk concentration visualization
- **3D Failure Surface**: Reverse stress test visualization (WIP)

### 2.5 Real-Time Monitoring
- WebSocket connections for live updates
- Automatic recalculation triggers
- Smart alert configuration
- Audit trail visualization

### 2.6 Peer Benchmarking
- Industry comparison metrics
- Percentile rankings
- Best practice identification
- Improvement opportunities

---

## 📊 Dashboard Layout Architecture

### Responsive Grid Structure (12-column)
```
┌─────────────────────────────────────────────────────┐
│           MCR STATUS HERO WIDGET (12 cols)          │
├────────┬────────┬────────┬────────┬────────────────┤
│  PMR   │  FOR   │  KFR   │  WDA   │   RA    (2.4)  │
├────────┴────────┴────────┴────────┴────────────────┤
│     WATERFALL CHART (8)    │  METRICS (4)          │
├────────────────────────────┬────────────────────────┤
│   TREND ANALYSIS (6)       │  AI INSIGHTS (6)      │
├────────────────────────────┼────────────────────────┤
│   SCENARIO PLANNER (8)     │  ALERTS (4)          │
├────────────────────────────┴────────────────────────┤
│          RISK HEAT MAP / RADAR CHARTS (12)         │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Technical Implementation

### File Structure
```
src/modules/intelligence-dashboard/
├── core/
│   ├── MCRCalculationEngine.ts      
│   ├── DataAggregator.ts           
│   ├── ValidationService.ts         
│   └── types.ts                     
├── components/
│   ├── MCRHeroWidget/
│   ├── ComponentCards/
│   ├── WaterfallChart/
│   ├── CapitalMetrics/
│   └── ComplianceStatus/
├── plugins/
│   ├── base/                        
│   │   ├── FORPlugin.ts
│   │   ├── KFRPlugin.ts
│   │   ├── WDAPlugin.ts
│   │   └── RAPlugin.ts
│   ├── enhanced/                    
│   │   ├── StressTestPlugin.ts     // Placeholder
│   │   ├── AIInsightsPlugin.ts
│   │   └── PeerBenchmarkPlugin.ts
│   └── registry.ts                  
├── hooks/
│   ├── useMCRCalculation.ts
│   ├── useDataAggregation.ts
│   └── useRealTimeUpdates.ts
├── services/
│   ├── api/
│   ├── storage/
│   └── export/
└── utils/
```

### Core MCR Engine
```typescript
export class MCRCalculationEngine {
  private plugins: Map<string, DataPlugin> = new Map();
  
  async calculateMCR(): Promise<MCRResult> {
    const componentValues = await this.aggregateComponentData();
    
    const mcr = Math.max(
      componentValues.pmr,
      componentValues.for,
      componentValues.kfr,
      componentValues.wda,
      componentValues.ra
    );

    const drivingFactor = this.identifyDrivingFactor(mcr, componentValues);
    const metrics = this.calculateMetrics(mcr, componentValues);

    return { mcr, drivingFactor, componentValues, metrics, timestamp: new Date() };
  }
  
  registerPlugin(plugin: DataPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }
}
```

### Plugin Interface
```typescript
interface DataPlugin {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'disabled';
  fetchData: () => Promise<PluginData>;
  transform: (data: PluginData) => StandardizedData;
  validate: (data: PluginData) => ValidationResult;
}
```

### State Management (Zustand)
```typescript
interface DashboardState {
  mcr: number;
  componentValues: ComponentValues;
  metrics: CapitalMetrics;
  pluginStatus: Map<string, PluginStatus>;
  isLoading: boolean;
  errors: ErrorState[];
  
  calculateMCR: () => Promise<void>;
  refreshComponent: (componentId: string) => Promise<void>;
  exportDashboard: (format: 'pdf' | 'excel') => Promise<void>;
}
```

---

## 📋 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Core MCR calculation engine
- [ ] Plugin system architecture
- [ ] Basic data aggregation
- [ ] Type definitions

### Phase 2: Data Integration (Week 2)
- [ ] Plugin implementations for each calculator
- [ ] State management setup
- [ ] Data validation layer
- [ ] Error handling

### Phase 3: Visual Components (Week 3)
- [ ] Dashboard layout
- [ ] Component cards
- [ ] Waterfall chart
- [ ] Metrics panel

### Phase 4: Progressive Enhancement (Week 4+)
- [ ] Feature toggle system
- [ ] AI insights integration
- [ ] Scenario planning
- [ ] Export functionality

---

## 🔌 Data Integration Points

### Expected Data Sources
Each calculator module should expose data via:

1. **localStorage Keys**:
   - `for_total`: Fixed Overhead Requirement value
   - `kfr_total`: K-Factor Requirement sum
   - `wda_total`: Wind-down Assessment total
   - `risk_total`: Risk Assessment capital

2. **Data Structure**:
```typescript
interface CalculatorOutput {
  value: number;
  breakdown: Record<string, number>;
  lastCalculated: Date;
  metadata: {
    method?: string;
    confidence?: number;
    assumptions?: string[];
  };
}
```

3. **Event System** (if implemented):
```javascript
document.dispatchEvent(new CustomEvent('calculator-update', {
  detail: { 
    calculator: 'FOR',
    value: 150000,
    timestamp: new Date()
  }
}));
```

---

## 🎯 Development Best Practices

### Progressive Data Loading
```typescript
const loadDashboard = async () => {
  // Critical - blocks render
  await loadCoreComponents();
  
  // Important - loads async
  loadEnhancedFeatures().catch(handleError);
  
  // Nice-to-have - background
  loadOptionalFeatures().catch(logWarning);
};
```

### Error Boundaries
Each component wrapped for resilience:
```tsx
<ErrorBoundary fallback={<ComponentErrorState />}>
  <FORCard />
</ErrorBoundary>
```

### Feature Toggles
```typescript
export const FEATURE_FLAGS = {
  STRESS_TESTING: false,  // WIP
  AI_INSIGHTS: true,
  PEER_BENCHMARK: false,
  REAL_TIME_UPDATES: true,
};
```

---

## 📝 Pending Information Required

### From Repository Review:
1. **Actual localStorage key names** used by each calculator
2. **Data structures** being stored (JSON format)
3. **Calculation methodologies** (Simple vs Granular for FOR)
4. **Module communication patterns** (if any)
5. **Current tech stack** (HTML/JS vs React/TS progress)
6. **Styling approach** (CSS files, Tailwind classes, etc.)
7. **Stress test module status** and expected outputs

### Critical Questions:
- How do modules currently persist calculations?
- Is there any existing state management?
- What libraries are already in use?
- Are calculations stored with history/versioning?
- What's the current user authentication state?

---

## 🚦 Next Steps

1. **Repository Review** (via Claude Code - IN PROGRESS)
   - Analyze actual module implementations
   - Extract reusable calculation functions
   - Map localStorage keys and data structures
   - Identify User Management & Reporting module integration points
   - Design AI Insights framework coverage

2. **Development Approach Decision**:
   - **Selected: HTML POC First** → Quick validation, familiar territory
   - Extract working logic from existing modules
   - Validate MCR calculations and aggregation
   - Then migrate to React/TS with confidence

3. **Implementation Priority**:
   - **Phase 1**: Regulatory minimum (MCR calculation, basic dashboard)
   - **Phase 2**: Value-add features (AI insights, advanced analytics)
   - **Phase 3**: AWS integration and enterprise features
   - **Phase 4**: Complete stress testing integration when modules ready

4. **Competitive Moat Features** (Critical for long-term success):
   - Sophisticated AI commentary that provides genuine insights
   - Predictive analytics that actually predict
   - Visualizations that reveal hidden patterns
   - Integrations that save hours of manual work

---

## 📚 References

- **MCR Formula**: MiFIDPRU 4.3.1R
- **Component Definitions**: mcr_definitions_training_master_reference.html
- **Architecture Pattern**: Domain-Driven Design with Plugin Architecture
- **State Management**: Zustand for React
- **Visualization**: Chart.js / D3.js for advanced graphics

---

*Last Updated: September 2025*
*Status: Awaiting repository review for final integration details*