# MIFIDPRU Web Application Technical Documentation

## Architecture Overview

The MIFIDPRU Web Application is built using a modern web architecture with the following components:

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: D1 database (SQLite-compatible)
- **Deployment**: Cloudflare Workers

### Directory Structure

```
mifidpru-webapp/
├── migrations/           # Database migration files
├── src/
│   ├── app/              # Next.js pages and API routes
│   │   ├── api/          # Backend API endpoints
│   │   └── */            # Frontend pages
│   ├── components/       # Reusable React components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions and business logic
│   └── tests/            # Test files
├── docs/                 # Documentation
└── wrangler.toml         # Cloudflare configuration
```

## Technology Stack

### Frontend

- **Next.js**: React framework for server-rendered applications
- **Tailwind CSS**: Utility-first CSS framework
- **React**: JavaScript library for building user interfaces
- **Recharts**: Charting library for data visualization

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **D1 Database**: SQLite-compatible database for Cloudflare Workers
- **Wrangler**: CLI for Cloudflare Workers development

## Database Schema

The application uses a relational database with the following tables:

### firm_details
- `id` (INTEGER): Primary key
- `firm_name` (TEXT): Name of the firm
- `fca_frn` (TEXT): FCA Firm Reference Number
- `reporting_date` (TEXT): Date of last reporting

### financial_data
- `id` (INTEGER): Primary key
- `reporting_date` (TEXT): Date of reporting
- `own_funds` (REAL): Own funds amount
- `liquid_assets` (REAL): Liquid assets amount
- `annual_revenue` (REAL): Annual revenue
- `annual_expenses` (REAL): Annual expenses

### risk_assessment
- `id` (INTEGER): Primary key
- `risk_name` (TEXT): Name of the risk
- `risk_description` (TEXT): Description of the risk
- `impact_score` (INTEGER): Impact score (1-5)
- `probability_score` (INTEGER): Probability score (1-5)
- `risk_score` (INTEGER): Calculated risk score
- `additional_capital` (REAL): Additional capital required

### k_factors
- `id` (INTEGER): Primary key
- `factor_code` (TEXT): K-factor code (e.g., K-AUM)
- `factor_name` (TEXT): K-factor name
- `value` (REAL): K-factor value
- `is_derivative` (INTEGER): Whether the value is for derivatives
- `coefficient_cash` (REAL): Coefficient for cash
- `coefficient_derivative` (REAL): Coefficient for derivatives
- `calculated_requirement` (REAL): Calculated requirement

### wind_down
- `id` (INTEGER): Primary key
- `cost_category` (TEXT): Category of cost
- `monthly_cost` (REAL): Monthly cost amount
- `wind_down_months` (INTEGER): Number of months for wind-down
- `is_custom` (INTEGER): Whether this is a custom category
- `notes` (TEXT): Additional notes
- `total_cost` (REAL): Calculated total cost

### fixed_overhead
- `id` (INTEGER): Primary key
- `quarter` (TEXT): Quarter identifier
- `year` (INTEGER): Year
- `expenses` (REAL): Quarterly expenses
- `deductions` (REAL): Allowable deductions
- `net_expenses` (REAL): Net expenses after deductions

### icara_calculations
- `id` (INTEGER): Primary key
- `calculation_date` (TEXT): Date of calculation
- `pmr` (REAL): Permanent Minimum Requirement
- `for_value` (REAL): Fixed Overhead Requirement
- `kfr` (REAL): K-Factor Requirement
- `risk_capital` (REAL): Risk capital
- `wind_down_cost` (REAL): Wind-down cost
- `icara_requirement` (REAL): Calculated ICARA requirement

### liquidity_assessment
- `id` (INTEGER): Primary key
- `assessment_date` (TEXT): Date of assessment
- `latr` (REAL): Liquid Asset Threshold Requirement
- `oflatr` (REAL): Own Funds Liquid Asset Threshold Requirement
- `blatr` (REAL): Basic Liquid Assets Threshold Requirement
- `projected_cash_outflows` (REAL): Projected cash outflows

### stress_testing
- `id` (INTEGER): Primary key
- `scenario_name` (TEXT): Name of the scenario
- `scenario_description` (TEXT): Description of the scenario
- `own_funds_impact` (REAL): Impact on own funds (percentage)
- `liquidity_impact` (REAL): Impact on liquidity (percentage)
- `k_factors_impact` (REAL): Impact on K-factors (percentage)
- `is_predefined` (INTEGER): Whether this is a predefined scenario
- `stress_results` (TEXT): JSON string of stress test results

### reverse_stress_testing
- `id` (INTEGER): Primary key
- `threshold_name` (TEXT): Name of the threshold
- `threshold_description` (TEXT): Description of the threshold
- `threshold_value` (REAL): Value of the threshold
- `scenario_description` (TEXT): Description of the scenario
- `stress_drivers` (TEXT): Key stress drivers
- `management_actions` (TEXT): Potential management actions

### historical_data
- `id` (INTEGER): Primary key
- `data_date` (TEXT): Date of the data point
- `data_type` (TEXT): Type of data (e.g., own_funds, kfr)
- `data_value` (REAL): Value of the data point
- `notes` (TEXT): Additional notes

## API Endpoints

The application provides the following API endpoints:

### Firm Details
- `GET /api/firm-details`: Get firm details
- `POST /api/firm-details`: Create or update firm details

### Financial Data
- `GET /api/financial-data`: Get financial data
- `POST /api/financial-data`: Create or update financial data

### Risk Assessment
- `GET /api/risk-assessment`: Get all risks
- `POST /api/risk-assessment`: Create a new risk
- `PUT /api/risk-assessment/:id`: Update a risk
- `DELETE /api/risk-assessment/:id`: Delete a risk

### K-Factors
- `GET /api/k-factors`: Get all K-factors
- `POST /api/k-factors`: Create a new K-factor
- `PUT /api/k-factors/:id`: Update a K-factor
- `DELETE /api/k-factors/:id`: Delete a K-factor

### Wind-Down
- `GET /api/wind-down`: Get all wind-down items
- `POST /api/wind-down`: Create a new wind-down item
- `PUT /api/wind-down/:id`: Update a wind-down item
- `DELETE /api/wind-down/:id`: Delete a wind-down item

### Fixed Overhead
- `GET /api/fixed-overhead`: Get fixed overhead data
- `POST /api/fixed-overhead`: Create or update fixed overhead data

### ICARA Calculations
- `GET /api/icara-calculations`: Get ICARA calculations
- `POST /api/icara-calculations`: Create or update ICARA calculations

### Liquidity Assessment
- `GET /api/liquidity-assessment`: Get liquidity assessment
- `POST /api/liquidity-assessment`: Create or update liquidity assessment

### Stress Testing
- `GET /api/stress-testing`: Get all stress scenarios
- `POST /api/stress-testing`: Create a new stress scenario
- `PUT /api/stress-testing/:id`: Update a stress scenario
- `DELETE /api/stress-testing/:id`: Delete a stress scenario
- `POST /api/stress-testing/run`: Run stress tests

### Reverse Stress Testing
- `GET /api/reverse-stress-testing`: Get all reverse stress testing items
- `POST /api/reverse-stress-testing`: Create a new reverse stress testing item
- `PUT /api/reverse-stress-testing/:id`: Update a reverse stress testing item
- `DELETE /api/reverse-stress-testing/:id`: Delete a reverse stress testing item

### Historical Data
- `GET /api/historical-data`: Get historical data
- `POST /api/historical-data`: Create a new historical data entry
- `DELETE /api/historical-data/:id`: Delete a historical data entry

## MIFIDPRU Compliance Features

The application includes a dedicated library (`src/lib/mifidpru.ts`) that implements MIFIDPRU-specific calculations and validations:

### K-Factor Coefficients
- Predefined coefficients for each K-factor as specified by the FCA
- Support for both cash and derivative coefficients

### Risk Matrix Capital Multipliers
- Multipliers for each combination of impact and probability scores
- Used to calculate additional capital for identified risks

### Calculation Functions
- `calculateKFR`: Calculate K-factor requirement
- `calculateRiskCapital`: Calculate risk capital based on risk matrix
- `calculateFOR`: Calculate Fixed Overhead Requirement
- `calculateWindDownCost`: Calculate wind-down cost
- `calculateICARA`: Calculate ICARA requirement
- `calculateLiquidityRequirements`: Calculate LATR, OFLATR, and BLATR
- `validateMifidpruCompliance`: Validate compliance with MIFIDPRU requirements
- `generateFcaReportData`: Generate data for FCA reports

## Testing

The application includes comprehensive tests for all components and calculation functions:

### Component Tests
- Tests for all page components to verify rendering and functionality
- Tests for UI components to verify behavior

### Calculation Tests
- Tests for all MIFIDPRU calculation functions to verify accuracy
- Tests for compliance validation logic

## Deployment

The application is deployed using Cloudflare Workers:

### Prerequisites
- Cloudflare account
- Wrangler CLI installed and configured

### Deployment Steps
1. Build the application: `npm run build`
2. Deploy to Cloudflare: `wrangler deploy`

### Database Setup
1. Create D1 database: `wrangler d1 create mifidpru-db`
2. Apply migrations: `wrangler d1 migrations apply mifidpru-db --local`

## Maintenance

### Database Migrations
- New migrations should be added to the `migrations/` directory
- Migrations are applied automatically during deployment

### Adding New Features
1. Create new database tables if needed
2. Implement API endpoints
3. Create frontend components
4. Update tests
5. Update documentation

## Security Considerations

- All API endpoints should validate input data
- Sensitive data should be encrypted in transit and at rest
- Authentication and authorization should be implemented for production use
- Regular security audits should be conducted

## Performance Considerations

- Database queries should be optimized for performance
- Large datasets should be paginated
- Client-side caching should be used where appropriate
- Server-side rendering should be used for initial page loads

## Regulatory Compliance

- The application implements MIFIDPRU requirements as specified by the FCA
- Regular updates may be needed to reflect changes in regulations
- Users should verify calculations against official FCA guidance
