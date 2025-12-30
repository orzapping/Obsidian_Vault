# ICARA/MiFIDPRU Platform Architecture

## System Overview
The ICARA/MiFIDPRU Risk Intelligence Platform is a comprehensive regulatory capital management system designed as a modern, scalable, cloud-native application. The architecture prioritises modularity, performance, security, and user experience.

## Architectural Principles

### 1. Domain-Driven Design (DDD)
The system is organised around business domains:
- **Capital Domain**: MCR calculations, capital resources
- **Risk Domain**: Risk assessment, stress testing
- **Regulatory Domain**: Reporting, compliance
- **User Domain**: Authentication, authorisation, SMCR

### 2. Microservices Architecture
Each major module operates as an independent service:
```
┌─────────────────────────────────────────────────────┐
│                   API Gateway                       │
├──────┬──────┬──────┬──────┬──────┬──────┬─────────┤
│ FOR  │ KFR  │ WDA  │  RA  │Stress│Report│  User   │
│ Svc  │ Svc  │ Svc  │ Svc  │ Svc  │ Svc  │  Svc    │
└──────┴──────┴──────┴──────┴──────┴──────┴─────────┘
```

### 3. Event-Driven Architecture
Services communicate through events:
```typescript
interface DomainEvent {
  id: string;
  type: EventType;
  aggregateId: string;
  timestamp: Date;
  payload: any;
  metadata: EventMetadata;
}

// Example events
MCRCalculatedEvent
RiskAssessmentUpdatedEvent
StressTestCompletedEvent
ReportGeneratedEvent
```

## Technology Stack

### Frontend Architecture
```yaml
framework: Next.js 14
ui_library: React 18
state_management: 
  - Zustand (global state)
  - React Query (server state)
  - React Hook Form (form state)
styling: 
  - Tailwind CSS
  - CSS Modules
  - Framer Motion
visualization:
  - Chart.js (standard charts)
  - D3.js (custom visualizations)
  - Three.js (3D visualizations)
type_safety: TypeScript 5.x
build_tool: Vite
testing: 
  - Vitest (unit)
  - Playwright (e2e)
  - React Testing Library
```

### Backend Architecture
```yaml
runtime: Node.js 20 LTS
framework: 
  - Next.js API Routes
  - tRPC (type-safe APIs)
database:
  primary: PostgreSQL 15
  timeseries: TimescaleDB
  cache: Redis 7
  search: Elasticsearch
orm: Prisma
validation: Zod
authentication: Auth0 / Clerk
file_storage: AWS S3
message_queue: AWS SQS
websocket: Socket.io
```

### Infrastructure
```yaml
hosting:
  primary: Vercel
  alternative: AWS (ECS + ALB)
cdn: Cloudflare
monitoring:
  - Datadog (APM)
  - Sentry (errors)
  - LogRocket (session replay)
ci_cd: GitHub Actions
container: Docker
orchestration: Kubernetes (if needed)
```

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐     │
│  │  Web App    │ │  Mobile PWA  │ │   API       │     │
│  │  (Next.js)  │ │  (Next.js)   │ │  Clients    │     │
│  └──────┬──────┘ └──────┬───────┘ └──────┬──────┘     │
└─────────┼───────────────┼────────────────┼─────────────┘
          │               │                │
┌─────────▼───────────────▼────────────────▼─────────────┐
│                    API Gateway                          │
│                 (Authentication/Routing)                │
└─────────┬───────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────┐
│                  Application Layer                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐         │
│  │Calculator  │ │Risk Engine │ │Intelligence│         │
│  │  Services  │ │  Services  │ │  Services  │         │
│  └────────────┘ └────────────┘ └────────────┘         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐         │
│  │ Reporting  │ │   User     │ │Integration │         │
│  │  Services  │ │  Services  │ │  Services  │         │
│  └────────────┘ └────────────┘ └────────────┘         │
└─────────┬───────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────┐
│                    Data Layer                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐         │
│  │PostgreSQL  │ │TimescaleDB │ │   Redis    │         │
│  │(Primary)   │ │(TimeSeries)│ │  (Cache)   │         │
│  └────────────┘ └────────────┘ └────────────┘         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐         │
│  │    S3      │ │Elasticsearch│ │  Event     │         │
│  │ (Storage)  │ │  (Search)  │ │  Store     │         │
│  └────────────┘ └────────────┘ └────────────┘         │
└─────────────────────────────────────────────────────────┘
```

## Module-Specific Architecture

### FOR Calculator Module (Module 3)

#### Session 1: Core Implementation
**Scope**: Core FOR calculation with basic categorization
```typescript
// Core Components
- FORCalculatorForm.tsx         // Main form container
- ConsolidatedApproach.tsx      // Simple total entry
- GranularApproach.tsx          // 6 categories, 24 subcategories
- FORResults.tsx                // Results display (basic)
- useForCalculations.ts         // Core calculation hook

// Data Structure
interface FORCalculation {
  annualExpenditure: number;
  financialYear: number;
  approach: 'consolidated' | 'granular';
  categories: FORCategories;
  result: {
    forRequirement: number;
    monthlyRunRate: number;
    dailyBurnRate: number;
    coverageDays: number;
  };
}

// Cost Categories (6 main + 24 subcategories)
interface FORCategories {
  staffCosts: StaffCostBreakdown;
  professionalFees: ProfessionalFeesBreakdown;
  technology: TechnologyBreakdown;
  occupancy: OccupancyBreakdown;
  regulatory: RegulatoryBreakdown;
  other: OtherBreakdown;
}
```

#### Session 2: Advanced Features (Future)
**Scope**: Charts, scenarios, adjustments, analytics
```typescript
// Advanced Components
- FORChartsSection.tsx          // Recharts integration
- ScenarioPlanning.tsx          // Growth/efficiency modeling
- FORAdj ustments.tsx           // MiFIDPRU 4.5.3R adjustments
- FORAnalytics.tsx              // Advanced metrics dashboard
- FORExport.tsx                 // Export functionality

// Chart Library: Recharts (React-native solution)
- Cost breakdown pie charts
- Historical trend analysis
- Scenario comparison charts
- Real-time updates with state changes
```

#### Technical Implementation Plan
```typescript
// State Management Strategy
- React useState for form state
- Zustand for persistent data (LocalStorage)
- React Query for future API integration

// Validation Strategy
- Zod schemas for all input validation
- Regulatory compliance validation
- Real-time calculation validation

// Performance Requirements
- Calculation response: <50ms
- Component render: <25ms
- State synchronization: <10ms
- Chart updates: <100ms
```

#### Regulatory Compliance Requirements
```typescript
// MiFIDPRU 4.5 Implementation
interface RegulatoryCompliance {
  calculation: 'FOR = Annual Fixed Expenditure ÷ 4';
  adjustments: 'MiFIDPRU 4.5.3R one-off exclusions';
  auditTrail: '7-year data retention';
  accuracy: 'Penny-perfect precision';
  reporting: 'FCA MIF007 ready';
}
```

#### Migration Strategy
1. **Phase 1**: Core calculation engine and basic categorization
2. **Phase 2**: Advanced features and analytics
3. **Integration**: MCR Dashboard connection
4. **Testing**: 100% parity with HTML prototype
5. **Documentation**: Complete regulatory compliance documentation

## Module Integration Strategy

### 1. Shared Component Library
```typescript
// packages/ui/components
export * from './buttons';
export * from './forms';
export * from './charts';
export * from './modals';
export * from './tables';

// packages/ui/hooks
export * from './useAuth';
export * from './useCalculator';
export * from './useRiskData';
```

### 2. Common Data Models
```typescript
// packages/types/models
interface CapitalPosition {
  date: Date;
  totalCapital: Money;
  tier1Capital: Money;
  deductions: Money;
  buffers: CapitalBuffers;
}

interface RiskMetric {
  id: string;
  type: RiskType;
  value: number;
  timestamp: Date;
  confidence: number;
  metadata: MetricMetadata;
}
```

### 3. Service Communication
```typescript
// Event-based communication
class EventBus {
  private subscribers = new Map<EventType, Set<Handler>>();
  
  subscribe(eventType: EventType, handler: Handler) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(handler);
  }
  
  async publish(event: DomainEvent) {
    const handlers = this.subscribers.get(event.type) || new Set();
    await Promise.all(
      Array.from(handlers).map(handler => handler(event))
    );
  }
}
```

### 4. API Design
```typescript
// tRPC router example
export const calculatorRouter = router({
  calculateFOR: procedure
    .input(FORInputSchema)
    .mutation(async ({ input }) => {
      const result = await forCalculator.calculate(input);
      await eventBus.publish(new FORCalculatedEvent(result));
      return result;
    }),
    
  calculateMCR: procedure
    .input(MCRInputSchema)
    .query(async ({ input }) => {
      const components = await Promise.all([
        forService.getLatest(),
        kfrService.getLatest(),
        wdaService.getLatest(),
        raService.getLatest()
      ]);
      return mcrCalculator.calculate(components);
    })
});
```

## Data Flow Architecture

### 1. Real-Time Data Flow
```
User Input → Validation → Calculation → Event Publishing → 
State Update → UI Update → Persistence → Analytics
```

### 2. Batch Processing
```
Scheduled Job → Data Collection → Aggregation → 
Calculation → Storage → Report Generation → Distribution
```

### 3. Integration Flow
```
External System → API Gateway → Adapter → 
Validation → Transformation → Internal API → Processing
```

## Security Architecture

### 1. Defense in Depth
```
Layer 1: CloudFlare (DDoS, WAF)
Layer 2: API Gateway (Rate limiting, Authentication)
Layer 3: Application (Authorization, Input validation)
Layer 4: Database (Encryption, Access control)
Layer 5: Infrastructure (Network isolation, Secrets management)
```

### 2. Authentication Flow
```typescript
interface AuthenticationFlow {
  1. User enters credentials
  2. Primary authentication (password)
  3. Risk assessment
  4. MFA challenge (if required)
  5. Token generation (JWT)
  6. Session establishment
  7. Continuous validation
}
```

### 3. Data Encryption
- At rest: AES-256
- In transit: TLS 1.3
- Key management: AWS KMS / HashiCorp Vault
- PII handling: Field-level encryption

## Performance Optimization

### 1. Caching Strategy
```typescript
interface CachingLayers {
  browser: {
    serviceWorker: 'Offline capability';
    localStorage: 'User preferences';
    sessionStorage: 'Temporary data';
  };
  
  cdn: {
    static: 'Assets, scripts';
    dynamic: 'API responses (short TTL)';
  };
  
  application: {
    redis: 'Session data, calculations';
    memory: 'Frequently accessed data';
  };
  
  database: {
    materialized: 'Aggregated views';
    indexes: 'Query optimization';
  };
}
```

### 2. Query Optimization
- Database indexes on key fields
- Materialized views for reports
- Query result caching
- Connection pooling

### 3. Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- Bundle size monitoring

## Scalability Design

### 1. Horizontal Scaling
- Stateless services
- Load balancing
- Auto-scaling policies
- Database read replicas

### 2. Vertical Scaling
- Resource monitoring
- Performance profiling
- Bottleneck identification
- Optimization cycles

### 3. Data Partitioning
- Time-based partitioning for historical data
- User-based sharding for multi-tenancy
- Service-based data isolation

## Deployment Strategy

### 1. Environment Structure
```yaml
environments:
  development:
    url: dev.icara-platform.app
    features: all enabled
    data: synthetic
    
  staging:
    url: staging.icara-platform.app
    features: production-like
    data: anonymized production
    
  production:
    url: app.icara-platform.app
    features: stable only
    data: live
```

### 2. CI/CD Pipeline
```yaml
pipeline:
  - trigger: push to main
  - step: lint and type check
  - step: run unit tests
  - step: run integration tests
  - step: build application
  - step: security scanning
  - step: deploy to staging
  - step: run e2e tests
  - step: manual approval
  - step: deploy to production
  - step: smoke tests
  - step: monitoring alerts
```

### 3. Rollback Strategy
- Blue-green deployments
- Database migration versioning
- Feature flags
- Automated rollback triggers

## Monitoring & Observability

### 1. Metrics Collection
```typescript
interface MetricsStrategy {
  application: {
    responseTime: Histogram;
    errorRate: Counter;
    throughput: Gauge;
    saturation: Gauge;
  };
  
  business: {
    calculationsPerformed: Counter;
    reportsGenerated: Counter;
    activeUsers: Gauge;
    dataAccuracy: Gauge;
  };
  
  infrastructure: {
    cpu: Gauge;
    memory: Gauge;
    disk: Gauge;
    network: Gauge;
  };
}
```

### 2. Logging Strategy
- Structured logging (JSON)
- Centralized log aggregation
- Log levels and filtering
- Retention policies

### 3. Alerting Rules
- SLA breaches
- Error rate spikes
- Performance degradation
- Security incidents

## Disaster Recovery

### 1. Backup Strategy
- Continuous replication
- Point-in-time recovery
- Geographic redundancy
- Regular restore testing

### 2. RTO/RPO Targets
- Recovery Time Objective: < 1 hour
- Recovery Point Objective: < 5 minutes
- Degraded operation mode available

### 3. Incident Response
- Runbook automation
- Escalation procedures
- Communication plan
- Post-mortem process

## Future Architecture Considerations

### 1. Multi-Tenancy
- Data isolation strategies
- Performance isolation
- Customization framework
- Billing integration

### 2. AI/ML Integration
- Model serving infrastructure
- Training pipeline
- Feature store
- Model versioning

### 3. Mobile Native Apps
- React Native consideration
- Offline-first architecture
- Push notifications
- Biometric authentication

### 4. Blockchain Integration
- Audit trail immutability
- Smart contract integration
- Distributed verification
- Regulatory compliance

## Success Metrics
- System uptime: 99.9%
- API response time: <200ms (p95)
- Concurrent users: 10,000+
- Data processing: 1M calculations/day
- Storage efficiency: 10:1 compression