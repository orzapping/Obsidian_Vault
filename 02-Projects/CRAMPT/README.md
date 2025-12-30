# CRAMPT - Compliance Risk Assessment & Monitoring Platform Tool

A comprehensive FCA compliance management platform designed for UK financial services firms to manage regulatory risks, controls, breaches, and compliance reporting.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

## Overview

CRAMPT is a modern, full-stack web application built specifically for FCA-regulated firms to maintain compliance with UK financial regulatory requirements. The platform provides an integrated solution for risk management, control effectiveness tracking, breach reporting, and compliance analytics.

### Key Features

- **Risk Register Management** - Identify, assess, and monitor regulatory risks with gross/net risk calculations
- **Risk Library** - Pre-built FCA compliance risk templates ready for deployment
- **Controls Library** - Comprehensive library of compliance controls mapped to FCA Handbook references
- **Breach Register (SUP 15.3)** - Track and manage regulatory breaches with FCA notification workflows
- **Compliance Calendar** - Schedule and track regulatory submissions, reviews, and key compliance activities
- **Analytics Dashboard** - Real-time compliance metrics, trend analysis, and risk heatmaps
- **Global Search** - Quick access to risks, controls, breaches, and calendar items across the platform
- **FCA Handbook Integration** - Direct references to FCA Handbook rules and guidance

## Technology Stack

### Frontend
- **Next.js 15.5.6** - React framework with App Router and Turbopack
- **React 19.1.0** - UI component library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization and charting
- **shadcn/ui** - UI component system

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database (Supabase hosted)
- **Zod** - Runtime type validation
- **React Hook Form** - Form state management

### Development Tools
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI
- **tsx** - TypeScript execution

## Project Structure

```
crampt/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard home page
│   ├── risks/                    # Risk Register
│   ├── risk-library/             # Risk template library
│   ├── controls/                 # Controls library (controls-library page)
│   ├── breaches/                 # Breach Register
│   ├── calendar/                 # Compliance Calendar
│   ├── analytics/                # Analytics Dashboard
│   └── api/                      # API routes
│       ├── risks/                # Risk CRUD operations
│       ├── controls/             # Control operations
│       ├── breaches/             # Breach operations
│       ├── calendar-items/       # Calendar CRUD
│       ├── dashboard/            # Dashboard metrics
│       ├── analytics/            # Analytics data
│       └── search/               # Global search
├── components/                   # React components
│   ├── layout/                   # Layout components
│   │   ├── AppHeader.tsx         # Page headers
│   │   ├── AppSidebar.tsx        # Navigation sidebar
│   │   └── GlobalSearch.tsx      # Search component
│   ├── risks/                    # Risk-related components
│   │   ├── RiskRegister.tsx      # Risk register table
│   │   ├── RiskDetailModal.tsx   # Risk create/edit modal
│   │   ├── RiskControlsModal.tsx # Risk-control mapping
│   │   └── RiskLibrary.tsx       # Risk template library
│   ├── breaches/                 # Breach components
│   ├── calendar/                 # Calendar components
│   ├── analytics/                # Analytics components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema & seeds
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeding script
│   └── migrations/               # Database migrations
└── docs/                         # Documentation
```

## Core Modules

### 1. Dashboard
**Location:** `/`

The central hub displaying key compliance metrics and quick access to all modules.

**Features:**
- Total risk, control, and breach counts
- Risk heatmap visualization (gross vs. net risk)
- Recent activity feed
- Upcoming compliance deadlines
- Quick action buttons for common tasks
- Average risk scores and control effectiveness metrics

### 2. Risk Register
**Location:** `/risks`

Comprehensive risk management system for identifying, assessing, and monitoring regulatory risks.

**Features:**
- Create, view, edit, and delete risks
- Gross risk assessment (impact × probability)
- Control mapping and effectiveness tracking
- Net risk calculation (post-control mitigation)
- Risk categorization:
  - High Level Standards (PRIN, SYSC, COND, FIT)
  - Prudential Standards (MIFIDPRU)
  - Conduct of Business (COBS, PROD, CASS)
  - Regulatory Processes (SUP, DEPP)
- FCA Handbook reference mapping
- Risk-control relationship management
- Combined mitigation percentage calculation

**Risk Calculation:**
- Gross Risk Score = Impact (0-10) × Probability (0-100%)
- Net Risk Score = Gross Risk × (1 - Combined Mitigation %)
- Combined Mitigation = Aggregated effectiveness of all applied controls

### 3. Risk Library
**Location:** `/risk-library`

Pre-built library of common FCA compliance risk templates for quick risk register population.

**Features:**
- 8+ pre-configured risk templates
- One-click "Add to Register" functionality
- Template categories aligned with FCA Handbook
- Detailed risk descriptions and handbook references
- Pre-populated gross impact and probability values

**Example Templates:**
- Breach of Principles for Business (PRIN)
- Client Money Reconciliation Failure (CASS 7.15)
- Transaction Reporting Failure (SUP 17)
- Best Execution Breach (COBS 11.2A)
- Senior Manager Certification Regime Breaches (SM&CR)

### 4. Controls Library
**Location:** `/controls`

Library of compliance controls that can be applied to risks to reduce their impact and probability.

**Features:**
- Control categorization by type:
  - Governance & Oversight (purple)
  - Policies & Procedures (blue)
  - CASS & Client Money (emerald)
  - Systems & Technical (cyan)
  - Training & Competence (amber)
  - Monitoring & Reporting (rose)
- Control effectiveness ratings (0-100%)
- Control type classification:
  - Policy
  - System
  - Training
  - Monitoring
- FCA Handbook reference mapping
- Search and filter functionality
- Base effectiveness ratings
- View, edit, and add controls

### 5. Breach Register (SUP 15.3)
**Location:** `/breaches`

Comprehensive breach tracking and notification system aligned with FCA SUP 15.3 requirements.

**Features:**
- Record and track regulatory breaches
- Breach severity classification (Low, Medium, High, Critical)
- FCA notification requirement tracking:
  - None required
  - As soon as practicable
  - Immediate notification
  - Within 3 business days
- Breach status workflow:
  - Open → Under Investigation → Remediation → Closed → Reported to FCA
- Root cause analysis documentation
- Corrective and preventive actions (CAPA)
- Client impact assessment
- Financial impact tracking
- Timeline tracking (occurred date, discovered date, notification date)
- FCA Handbook reference mapping

**SUP 15.3 Compliance:**
The breach register is designed to meet FCA SUP 15.3 requirements for notifying the FCA of significant breaches and issues.

### 6. Compliance Calendar
**Location:** `/calendar`

Schedule and track regulatory submissions, compliance reviews, and key regulatory activities.

**Features:**
- Calendar view of compliance activities
- Multiple item types:
  - FCA Submission (e.g., RMAR, GABRIEL, REP-CRIM)
  - Internal Review (e.g., risk reviews, policy reviews)
  - Training Session
  - Audit
  - Board Meeting
  - Other
- Due date tracking and overdue highlighting
- Status management (Upcoming, In Progress, Completed, Overdue)
- Description and notes for each item
- Quick add functionality
- View, edit, and delete calendar items

### 7. Analytics Dashboard
**Location:** `/analytics`

Advanced analytics and reporting for compliance metrics and trends.

**Features:**
- Risk trend analysis over time
- Control effectiveness tracking
- Breach frequency and severity analysis
- Risk distribution by category
- Control coverage by type
- Net vs. Gross risk comparison charts
- Interactive data visualizations using Recharts
- Time-series data for trend spotting
- Category-based risk breakdowns

### 8. Global Search
**Accessible from:** Any page (top navigation)

Quick search across all compliance data.

**Features:**
- Real-time search across:
  - Risks
  - Controls
  - Breaches
  - Calendar items
- Keyboard shortcut support (Cmd+K / Ctrl+K)
- Search by name, description, or handbook reference
- Direct navigation to search results
- Recent searches

## Database Schema

### Core Models

**Organization**
- Multi-tenant support
- FCA FRN (Firm Reference Number) tracking
- Links to all compliance data

**Risk**
- Gross/Net impact and probability
- Category classification (RiskCategory enum)
- FCA Handbook references
- Control relationships via RiskControl junction table

**Control**
- Control type (Policy, System, Training, Monitoring)
- Control category (ControlCategory enum)
- Base effectiveness percentage
- FCA Handbook references

**RiskControl (Junction Table)**
- Many-to-many relationship between Risks and Controls
- Per-risk effectiveness override
- Applied date tracking

**Breach**
- SUP 15.3 compliance fields
- Notification level tracking
- Root cause analysis
- CAPA tracking
- Client and financial impact

**CalendarItem**
- Compliance activity scheduling
- Type classification
- Status tracking (Upcoming, In Progress, Completed, Overdue)

**User**
- Role-based access control
- Organization association
- Audit log tracking

### Enumerations

**RiskCategory**
- HIGH_LEVEL_STANDARDS (PRIN, SYSC, COND, FIT)
- PRUDENTIAL_STANDARDS (MIFIDPRU)
- CONDUCT_OF_BUSINESS (COBS, PROD, CASS)
- REGULATORY_PROCESSES (SUP, DEPP)

**ControlCategory**
- GOVERNANCE_OVERSIGHT
- POLICIES_PROCEDURES
- CASS_CLIENT_MONEY
- SYSTEMS_TECHNICAL
- TRAINING_COMPETENCE
- MONITORING_REPORTING

**ControlType**
- POLICY
- SYSTEM
- TRAINING
- MONITORING

**BreachType**
- HANDBOOK_BREACH
- SYSTEM_FAILURE
- PROCESS_ERROR
- CONDUCT_ISSUE
- CASS_BREACH
- MARKET_ABUSE
- CLIENT_MONEY
- TRANSACTION_REPORTING
- OTHER

**NotificationLevel**
- NONE
- AS_SOON_AS_PRACTICABLE
- IMMEDIATE
- THREE_BUSINESS_DAYS

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/orzapping/crampt.git
cd crampt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Optional: Add other environment variables
```

4. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Push schema changes without migrations (development)
npm run db:push

# Seed the database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Build for Production

```bash
npm run build
npm run start
```

## Design System

### Color Palette

**Risk Categories:**
- High Level Standards: Indigo (`indigo-400`)
- Prudential Standards: Emerald (`emerald-400`)
- Conduct of Business: Amber (`amber-400`)
- Regulatory Processes: Fuchsia (`fuchsia-400`)

**Control Categories:**
- Governance & Oversight: Purple (`purple-400`)
- Policies & Procedures: Blue (`blue-400`)
- CASS & Client Money: Emerald (`emerald-400`)
- Systems & Technical: Cyan (`cyan-400`)
- Training & Competence: Amber (`amber-400`)
- Monitoring & Reporting: Rose (`rose-400`)

**Risk Scores:**
- High Risk (7-10): Red
- Medium Risk (4-6.9): Amber
- Low Risk (0-3.9): Green

**Control Effectiveness:**
- High (80-100%): Green
- Medium (60-79%): Amber
- Low (0-59%): Red

### UI Components

Built with shadcn/ui and Radix UI primitives:
- Button, Card, Badge
- Dialog (Modal)
- Input, Textarea, Select
- Label, Separator
- Checkbox, Slider
- Table

## API Routes

### Risk Management
- `GET /api/risks` - List all risks
- `POST /api/risks` - Create new risk
- `GET /api/risks/[id]` - Get risk details
- `PUT /api/risks/[id]` - Update risk
- `DELETE /api/risks/[id]` - Delete risk
- `POST /api/risks/[id]/controls` - Add control to risk
- `PUT /api/risks/[id]/controls/[controlId]` - Update risk-control effectiveness
- `DELETE /api/risks/[id]/controls/[controlId]` - Remove control from risk

### Controls
- `GET /api/controls` - List all controls

### Breach Management
- `GET /api/breaches` - List all breaches
- `POST /api/breaches` - Create breach
- `GET /api/breaches/[id]` - Get breach details
- `PUT /api/breaches/[id]` - Update breach
- `DELETE /api/breaches/[id]` - Delete breach

### Calendar
- `GET /api/calendar-items` - List calendar items
- `POST /api/calendar-items` - Create calendar item
- `GET /api/calendar-items/[id]` - Get item details
- `PUT /api/calendar-items/[id]` - Update calendar item
- `DELETE /api/calendar-items/[id]` - Delete calendar item

### Analytics & Search
- `GET /api/dashboard` - Dashboard metrics
- `GET /api/analytics` - Analytics data
- `GET /api/search?q={query}` - Global search

## Regulatory Framework

CRAMPT is designed to support compliance with:

- **FCA Handbook** - Comprehensive FCA rule mapping
- **PRIN (Principles for Business)** - High-level regulatory principles
- **SYSC (Senior Management Arrangements)** - Governance and systems
- **COBS (Conduct of Business)** - Client-facing requirements
- **CASS (Client Assets)** - Client money and asset protection
- **SUP 15.3** - Breach notification requirements
- **MIFIDPRU** - Prudential requirements for investment firms
- **SM&CR** - Senior Managers & Certification Regime

## Roadmap

### Phase 1 - Core Platform (Completed)
- ✅ Risk Register with gross/net risk calculation
- ✅ Risk Library with FCA-aligned templates
- ✅ Controls Library with effectiveness tracking
- ✅ Breach Register (SUP 15.3 compliant)
- ✅ Compliance Calendar
- ✅ Analytics Dashboard
- ✅ Global Search
- ✅ Unified navigation and layout

### Phase 2 - Reporting & Exports (In Progress)
- [ ] PDF report generation
- [ ] CSV data exports
- [ ] Markdown report templates
- [ ] Management Information (MI) reports
- [ ] Board pack generation

### Phase 3 - Advanced Features (Planned)
- [ ] Settings page (company details, FRN, user management)
- [ ] Multi-user authentication (Clerk/Auth.js)
- [ ] Role-based access control (RBAC)
- [ ] Audit log tracking
- [ ] Email notifications
- [ ] Document attachment support
- [ ] Risk appetite framework
- [ ] Control testing workflows

### Phase 4 - Integrations (Future)
- [ ] FCA GABRIEL submission integration
- [ ] FCA Connect integration
- [ ] Email integration (Outlook, Gmail)
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Document management integration

## Contributing

This is a private project. For internal development:

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request with detailed description
5. Ensure all tests pass
6. Request review from team members

## License

Private - All rights reserved. Not licensed for public use or distribution.

## Support

For questions, issues, or feature requests, please contact the development team or create an issue in the GitHub repository.

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Supabase](https://supabase.com/) - PostgreSQL hosting
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [Recharts](https://recharts.org/) - Chart library

---

**CRAMPT** - Compliance Risk Assessment & Monitoring Platform Tool
Version 0.1.0 | Built for FCA-regulated firms
