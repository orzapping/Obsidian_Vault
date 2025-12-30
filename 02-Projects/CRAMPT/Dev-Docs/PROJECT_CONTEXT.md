# CRAMPT - Project Context Document

## Project Purpose

CRAMPT (Compliance Risk Assessment & Monitoring Platform Tool) is a specialized software platform designed to help small-to-medium UK investment firms manage FCA regulatory compliance efficiently.

## Problem Statement

UK investment firms operating under MIFIDPRU face significant regulatory burden including:
- Complex risk management requirements (SYSC)
- Client asset protection (CASS)
- Conduct requirements (COBS)
- Prudential standards (MIFIDPRU)
- Breach notification obligations (SUP 15.3)

Current solutions are either:
1. Generic GRC platforms (expensive, over-featured)
2. Spreadsheets (error-prone, no automation)
3. Disparate systems (fragmented, inefficient)

## Solution Overview

CRAMPT provides an integrated, FCA-specific compliance platform with:

### Core Features
1. **Risk Register**
   - Gross/net risk scoring
   - Control effectiveness tracking
   - Mitigation calculation engine

2. **Controls Library**
   - Pre-populated FCA Handbook-mapped controls
   - Custom control creation
   - Many-to-many risk-control linking

3. **Breach Register**
   - SUP 15.3 compliant
   - Root cause analysis
   - Corrective action tracking
   - FCA notification management

4. **Compliance Calendar**
   - Recurring regulatory deadlines
   - Automated alerts
   - Completion tracking

5. **Analytics Dashboard**
   - Key Risk Indicators (KRIs)
   - Risk heat maps
   - Executive summaries

## Target Users

### Primary
- **Compliance Officers** - Day-to-day compliance management
- **MLROs** - AML/CTF oversight
- **Risk Managers** - Risk identification and monitoring

### Secondary
- **Directors** - Board-level oversight
- **Auditors** - Internal/external audit review
- **FCA** - Regulatory reporting/evidence

## Technical Architecture

### Core Principles
1. **Type Safety** - TypeScript end-to-end
2. **Audit Trail** - All actions logged for FCA compliance
3. **Data Integrity** - PostgreSQL with ACID guarantees
4. **Scalability** - Multi-tenant architecture
5. **Security** - RBAC, encryption, secure by default

### Technology Choices Rationale

**Next.js 14**
- Full-stack TypeScript
- API routes = no separate backend
- Server components = better performance
- Vercel deployment = zero-config

**Prisma**
- Type-safe database access
- Excellent migrations
- Introspection and studio tools

**PostgreSQL**
- ACID compliance critical for audit
- Complex queries for analytics
- JSON support for flexible data

**shadcn/ui**
- Production-ready components
- Accessible by default
- Tailwind-based customization

## Data Model Overview

```
Organization (multi-tenant)
  ├── Users (RBAC roles)
  ├── Risks (gross/net scoring)
  ├── Controls (effectiveness ratings)
  ├── RiskControls (linkage)
  ├── Breaches (SUP 15.3 compliance)
  ├── CalendarItems (recurring deadlines)
  └── AuditLogs (complete trail)
```

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [x] Project setup
- [x] Database schema
- [ ] Authentication
- [ ] Layout & navigation

### Phase 2: Core Features (Weeks 3-4)
- [ ] Risk Register CRUD
- [ ] Controls Library
- [ ] Risk-Control linking
- [ ] Mitigation calculations

### Phase 3: Compliance (Weeks 5-6)
- [ ] Breach Register
- [ ] Compliance Calendar
- [ ] Alert system

### Phase 4: Analytics (Weeks 7-8)
- [ ] Dashboard KRIs
- [ ] Charts/visualizations
- [ ] PDF reports

### Phase 5: Production (Weeks 9-10)
- [ ] Testing
- [ ] Documentation
- [ ] Deployment
- [ ] Training materials

## Key Compliance Requirements

### FCA Handbook References
- **SYSC 4** - Risk management
- **SYSC 6** - Compliance function
- **CASS 7** - Client money rules
- **COBS 2** - Conduct standards
- **MIFIDPRU 7** - ICARA
- **SUP 15.3** - Notifiable events

### Data Retention
- Minimum 7 years (FCA requirement)
- Soft deletes only
- Audit trail immutable

### Security Requirements
- Role-based access control
- MFA for sensitive actions
- Encryption at rest/transit
- Regular backups

## Success Criteria

### MVP (3 months)
- Complete risk register functionality
- 50+ pre-loaded controls
- Breach register operational
- Calendar with alerts
- 1-2 pilot firms using it

### V1.0 (6 months)
- Full analytics dashboard
- PDF report generation
- Multi-org support
- 10+ paying customers

## Known Constraints

### Technical
- Browser-based only (no mobile app initially)
- English language only
- UK regulatory focus only

### Business
- Bootstrap funded (no VC)
- Solo developer (initially)
- B2B SaaS model

## Related Documents

- `README.md` - Setup and installation
- `prisma/schema.prisma` - Database schema
- `ARCHITECTURE.md` - Technical architecture (TBD)
- `API_DOCS.md` - API documentation (TBD)

## Contact

**Project Lead**: Adrian Rader
**Start Date**: October 2025
**Target Launch**: Q1 2026
