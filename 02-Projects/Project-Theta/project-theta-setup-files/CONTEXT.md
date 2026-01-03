# Project Theta: Condensed Context for Claude Code

**Prepend this to any prompt if CC needs additional context.**

---

## Project Summary

Project Theta is a **systematic options trading dashboard** for selling volatility premium through defined-risk strategies (iron condors, strangles, credit spreads).

**Core Thesis:** Implied volatility consistently exceeds realised volatility (variance risk premium). We systematically identify elevated IV environments and harvest premium while managing tail risk.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11+, FastAPI, Pydantic v2 |
| Analytics | NumPy, Pandas, vollib, pandas-ta, quantstats |
| Frontend | React 18, TypeScript, Vite, Tailwind, Recharts |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Package Manager | Poetry (Python), npm (JS) |

---

## Project Structure

```
project-theta/
├── theta/
│   ├── data/           # API clients, models
│   ├── analytics/      # IV, Greeks, percentile, RV
│   ├── signals/        # Rules engine, scoring
│   ├── portfolio/      # Positions, P&L, risk
│   ├── performance/    # Metrics, reporting
│   └── api/            # FastAPI routes
├── frontend/           # React application
├── tests/              # pytest tests
└── config/             # YAML configuration
```

---

## Key Formulas

### IV Percentile
```
IV Percentile = (Days where IV < Current) / Total Days × 100
```

### IV Rank
```
IV Rank = (Current - 52wk Low) / (52wk High - 52wk Low) × 100
```

### Annualised Rate of Return (ARR)
```
ARR = (Premium / Max Risk) × (365 / DTE) × 100
```

### Black-Scholes d1/d2
```
d1 = (ln(S/K) + (r + σ²/2)T) / (σ√T)
d2 = d1 - σ√T
```

---

## Signal Rules (Default)

Entry signal requires ALL:
1. IV Percentile > 50 (elevated premium)
2. VIX NOT in backwardation (market not stressed)
3. Days to earnings > 7 (avoid binary events)
4. Bid/Ask spread < 5% (liquidity)
5. Open Interest > 100 (liquidity)

Scoring (bonus points):
- IV%ile > 70: +2
- IV/RV > 1.3: +2
- DTE 30-45: +1
- Delta < 0.20: +1
- Strong signal: Score ≥ 4

---

## Reference Repositories

| Repo | What to Extract |
|------|-----------------|
| ThetaTracker | ARR formula, config structure |
| adaptive-vol-arb | FastAPI structure, caching |
| iv-greeks-dashboard | IV extraction, Greeks, Pydantic models |
| Options-Analytics | Data retriever pattern |
| OptionStratLib | Strategy trait system (architecture) |

---

## Coding Standards

### Python
- Type hints on all functions
- Pydantic v2 for data models
- Async where beneficial (API clients)
- Docstrings for public functions
- pytest for testing

### TypeScript
- Strict mode enabled
- Interfaces for API responses
- React Query for server state
- Tailwind for styling

### General
- No magic numbers (use config)
- Meaningful variable names
- Single responsibility principle
- Test coverage for core logic

---

## Configuration Example

```yaml
signals:
  iv_percentile_threshold: 50
  iv_percentile_strong: 70
  iv_rv_ratio_threshold: 1.3
  min_dte: 25
  max_dte: 50
  max_delta: 0.30
  min_open_interest: 100
  max_spread_percent: 5.0
  days_to_earnings_buffer: 7
```

---

## API Endpoints Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/watchlist` | GET | Ranked opportunities |
| `/api/v1/chain/{symbol}` | GET | Options chain + Greeks |
| `/api/v1/volatility/{symbol}` | GET | IV metrics |
| `/api/v1/positions` | GET/POST | Position management |
| `/api/v1/risk` | GET | Portfolio risk summary |
| `/api/v1/performance` | GET | Performance metrics |
| `/ws/positions` | WS | Real-time updates |

---

## Important Notes

1. **vollib** is used for IV extraction - don't reinvent
2. **quantstats** is used for performance metrics - leverage it
3. **Massive/Polygon** is the data source - $29/mo starter tier
4. **Tastytrade** is for execution (future phase)
5. Start with SQLite, migrate to PostgreSQL if needed
