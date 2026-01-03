# Project Theta: Systematic Volatility Premium Harvesting System

## Executive Summary

Project Theta is a systematic options trading dashboard and signal generation system focused on **selling volatility premium** through defined-risk strategies (iron condors, strangles, credit spreads). The system identifies elevated implied volatility environments, generates entry signals based on configurable rules, tracks positions with aggregated Greeks, and monitors performance.

**Core Philosophy:** Volatility is the one true mean-reverting asset class. Implied volatility consistently exceeds realised volatility due to the variance risk premium (insurance demand). We systematically harvest this premium while managing tail risk through defined-risk structures and disciplined position sizing.

---

## 1. Technology Stack

### Backend (Python 3.11+)

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | FastAPI | Async REST API, WebSocket support, auto-docs |
| **Package Manager** | Poetry | Dependency management, virtual environments |
| **Data Validation** | Pydantic v2 | Type-safe models, serialisation |
| **HTTP Client** | httpx | Async HTTP requests to data providers |
| **Numerical** | NumPy, Pandas | Array operations, DataFrames |
| **Options Pricing** | vollib | IV extraction (Newton-Raphson/bisection) |
| **Indicators** | pandas-ta | Realised volatility, technical indicators |
| **Performance** | quantstats | Sharpe, Sortino, drawdown, tear sheets |
| **Testing** | pytest, hypothesis | Unit tests, property-based testing |
| **Database** | SQLite → PostgreSQL | Start simple, scale if needed |
| **Task Queue** | (Future) Celery/RQ | Background data refresh |

### Frontend (React 18 + TypeScript)

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | React 18 | Component-based UI |
| **Language** | TypeScript 5+ | Type safety |
| **Build** | Vite | Fast dev server, HMR |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Charts** | Recharts | Declarative charting |
| **Tables** | TanStack Table | Sorting, filtering, pagination |
| **State** | React Query | Server state management, caching |
| **HTTP** | Axios | API client |

### Data Providers

| Provider | Purpose | Tier |
|----------|---------|------|
| **Massive (Polygon.io)** | Options chains, Greeks, IV, historical data | Starter ($29/mo) |
| **Tastytrade API** | Execution, positions, account state | Free with account |
| **CBOE** | VIX term structure (free delayed) | Free |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              PROJECT THETA                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                        DATA LAYER                               │    │
│   │                                                                 │    │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │    │
│   │  │   MASSIVE   │  │ TASTYTRADE  │  │  EARNINGS CALENDAR  │    │    │
│   │  │             │  │             │  │                     │    │    │
│   │  │ • Chains    │  │ • Positions │  │ • Binary events     │    │    │
│   │  │ • Greeks    │  │ • Orders    │  │ • Ex-div dates      │    │    │
│   │  │ • Historical│  │ • Account   │  │                     │    │    │
│   │  │ • VIX data  │  │ • Execution │  │                     │    │    │
│   │  └─────────────┘  └─────────────┘  └─────────────────────┘    │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                   │                                      │
│                                   ▼                                      │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                      ANALYTICS ENGINE                           │    │
│   │                                                                 │    │
│   │  ┌──────────────────────────────────────────────────────────┐  │    │
│   │  │  theta/analytics/                                         │  │    │
│   │  │  ├── iv_calculator.py    # IV extraction via vollib       │  │    │
│   │  │  ├── percentile.py       # IV percentile & rank           │  │    │
│   │  │  ├── realized_vol.py     # Historical volatility          │  │    │
│   │  │  ├── greeks.py           # Greeks calculation             │  │    │
│   │  │  └── term_structure.py   # VIX contango/backwardation     │  │    │
│   │  └──────────────────────────────────────────────────────────┘  │    │
│   │                                                                 │    │
│   │  ┌──────────────────────────────────────────────────────────┐  │    │
│   │  │  theta/signals/                                           │  │    │
│   │  │  ├── rules_engine.py     # Entry signal generation        │  │    │
│   │  │  ├── scoring.py          # Opportunity scoring            │  │    │
│   │  │  └── filters.py          # Pre-trade filters              │  │    │
│   │  └──────────────────────────────────────────────────────────┘  │    │
│   │                                                                 │    │
│   │  ┌──────────────────────────────────────────────────────────┐  │    │
│   │  │  theta/portfolio/                                         │  │    │
│   │  │  ├── position.py         # Position model                 │  │    │
│   │  │  ├── aggregator.py       # Portfolio Greeks               │  │    │
│   │  │  ├── pnl.py              # P&L calculation                │  │    │
│   │  │  └── risk.py             # Risk limits & alerts           │  │    │
│   │  └──────────────────────────────────────────────────────────┘  │    │
│   │                                                                 │    │
│   │  ┌──────────────────────────────────────────────────────────┐  │    │
│   │  │  theta/performance/                                       │  │    │
│   │  │  ├── metrics.py          # Performance calculations       │  │    │
│   │  │  └── reporting.py        # Tear sheet generation          │  │    │
│   │  └──────────────────────────────────────────────────────────┘  │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                   │                                      │
│                                   ▼                                      │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                         API LAYER                               │    │
│   │                                                                 │    │
│   │  theta/api/                                                     │    │
│   │  ├── main.py                # FastAPI app entry                 │    │
│   │  ├── routes/                                                    │    │
│   │  │   ├── watchlist.py       # GET /api/v1/watchlist            │    │
│   │  │   ├── chain.py           # GET /api/v1/chain/{symbol}       │    │
│   │  │   ├── volatility.py      # GET /api/v1/volatility/{symbol}  │    │
│   │  │   ├── positions.py       # GET /api/v1/positions            │    │
│   │  │   ├── risk.py            # GET /api/v1/risk                 │    │
│   │  │   └── performance.py     # GET /api/v1/performance          │    │
│   │  ├── websocket.py           # Real-time position updates        │    │
│   │  └── dependencies.py        # Shared dependencies               │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                   │                                      │
│                                   ▼                                      │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                    FRONTEND (React)                             │    │
│   │                                                                 │    │
│   │  frontend/src/                                                  │    │
│   │  ├── components/                                                │    │
│   │  │   ├── WatchlistTable.tsx                                    │    │
│   │  │   ├── VolatilityChart.tsx                                   │    │
│   │  │   ├── PositionMonitor.tsx                                   │    │
│   │  │   ├── RiskSummary.tsx                                       │    │
│   │  │   ├── PerformanceDashboard.tsx                              │    │
│   │  │   └── SignalGauge.tsx                                       │    │
│   │  ├── hooks/                                                     │    │
│   │  │   ├── useWatchlist.ts                                       │    │
│   │  │   ├── usePositions.ts                                       │    │
│   │  │   └── useWebSocket.ts                                       │    │
│   │  ├── services/                                                  │    │
│   │  │   └── api.ts                                                │    │
│   │  └── App.tsx                                                    │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Specifications

### 3.1 Data Layer (`theta/data/`)

#### `massive_client.py`
```python
"""
Polygon.io/Massive API client for options data.

Responsibilities:
- Fetch options chains with Greeks
- Fetch historical options data for IV percentile calculation
- Fetch underlying price data
- Fetch VIX and VIX futures for term structure

Key Methods:
- get_options_chain(symbol: str, expiration: date | None) -> OptionsChain
- get_historical_iv(symbol: str, lookback_days: int) -> pd.DataFrame
- get_underlying_quote(symbol: str) -> Quote
- get_vix_term_structure() -> VIXTermStructure
"""
```

#### `tastytrade_client.py`
```python
"""
Tastytrade API client for account/execution.

Responsibilities:
- Fetch current positions
- Fetch account balances and buying power
- Submit orders (future phase)
- Fetch order history

Key Methods:
- get_positions() -> list[Position]
- get_account_balance() -> AccountBalance
- submit_order(order: Order) -> OrderResult  # Future
"""
```

#### `models.py`
```python
"""
Pydantic models for data layer.

Models:
- OptionContract: strike, expiration, type, bid, ask, greeks, iv, oi, volume
- OptionsChain: underlying, spot_price, list of contracts
- Quote: symbol, bid, ask, last, timestamp
- VIXTermStructure: spot_vix, futures list with expirations
- Position: contract, quantity, entry_price, current_price, greeks
"""
```

### 3.2 Analytics Layer (`theta/analytics/`)

#### `iv_calculator.py`
```python
"""
Implied volatility calculation using vollib.

Responsibilities:
- Extract IV from option prices using Newton-Raphson
- Handle edge cases (deep ITM/OTM, near expiration)
- Batch IV calculation for efficiency

Key Functions:
- calculate_iv(price, spot, strike, dte, rate, option_type) -> float
- calculate_iv_batch(contracts: list[OptionContract]) -> list[float]
"""
```

#### `percentile.py`
```python
"""
IV Percentile and IV Rank calculations.

Definitions:
- IV Percentile: % of days IV was lower than current (distribution-based)
- IV Rank: (Current - 52wk Low) / (52wk High - 52wk Low) (range-based)

Key Functions:
- calculate_iv_percentile(current_iv, historical_iv, lookback=252) -> float
- calculate_iv_rank(current_iv, historical_iv, lookback=252) -> float
- calculate_iv_metrics(symbol, current_iv, historical_data) -> IVMetrics
"""
```

#### `realized_vol.py`
```python
"""
Realised (historical) volatility calculation.

Methods:
- Close-to-close volatility
- Parkinson (high-low)
- Garman-Klass
- Yang-Zhang

Key Functions:
- calculate_realized_vol(prices: pd.Series, window: int, method: str) -> float
- calculate_iv_rv_ratio(iv: float, rv: float) -> float
"""
```

#### `greeks.py`
```python
"""
Greeks calculation using Black-Scholes analytical formulas.

Greeks Supported:
- Delta, Gamma, Theta, Vega, Rho (first-order)
- Charm, Vanna, Vomma (second-order, optional)

Key Functions:
- calculate_delta(spot, strike, dte, vol, rate, option_type) -> float
- calculate_all_greeks(contract: OptionContract, spot: float) -> Greeks
- aggregate_greeks(positions: list[Position]) -> PortfolioGreeks
"""
```

#### `term_structure.py`
```python
"""
VIX term structure analysis.

Key Concepts:
- Contango: VIX futures > spot (normal, calm markets)
- Backwardation: VIX futures < spot (stress, elevated fear)

Key Functions:
- analyze_term_structure(vix_data: VIXTermStructure) -> TermStructureState
- is_backwardation(vix_data: VIXTermStructure) -> bool
- calculate_contango_ratio(vix_data: VIXTermStructure) -> float
"""
```

### 3.3 Signals Layer (`theta/signals/`)

#### `rules_engine.py`
```python
"""
Entry signal generation based on configurable rules.

Default Rules (all must pass):
1. IV Percentile > threshold (default: 50)
2. VIX NOT in backwardation
3. Days to earnings > 7 (avoid binary events)
4. Bid/Ask spread < threshold % (liquidity filter)
5. Open interest > minimum (liquidity filter)

Key Functions:
- evaluate_entry_rules(symbol, chain, config) -> RulesResult
- get_passing_contracts(chain, config) -> list[OptionContract]
"""
```

#### `scoring.py`
```python
"""
Opportunity scoring for ranked watchlist.

Scoring Criteria (configurable weights):
- IV Percentile > 70: +2 points
- IV/RV Ratio > 1.3: +2 points
- DTE in 30-45 range: +1 point
- Delta < 0.20 (higher probability): +1 point
- Good liquidity (tight spread, high OI): +1 point

Key Functions:
- score_opportunity(symbol, metrics: IVMetrics, config) -> Score
- rank_watchlist(symbols: list[str]) -> list[RankedOpportunity]
- calculate_arr(premium, max_risk, dte) -> float  # Annualised Return Rate
"""
```

#### `filters.py`
```python
"""
Pre-trade filters.

Filters:
- Earnings filter: exclude if earnings within N days
- Liquidity filter: bid/ask spread, open interest thresholds
- Position concentration: max % of portfolio in single underlying
- Sector concentration: max % of portfolio in single sector

Key Functions:
- apply_earnings_filter(symbols, earnings_calendar) -> list[str]
- apply_liquidity_filter(chain, config) -> OptionsChain
"""
```

### 3.4 Portfolio Layer (`theta/portfolio/`)

#### `position.py`
```python
"""
Position model and management.

Position Types:
- Single leg (short put, short call)
- Spread (credit spread, debit spread)
- Multi-leg (iron condor, strangle, butterfly)

Key Classes:
- Position: single contract position
- Strategy: multi-leg position (iron condor, etc.)
- PositionManager: CRUD operations on positions
"""
```

#### `aggregator.py`
```python
"""
Portfolio-level Greek aggregation.

Aggregations:
- Sum of deltas (directional exposure)
- Sum of gammas (convexity exposure)
- Sum of thetas (daily decay)
- Sum of vegas (volatility exposure)

Key Functions:
- aggregate_portfolio_greeks(positions: list[Position]) -> PortfolioGreeks
- calculate_beta_weighted_delta(positions, spy_price) -> float
"""
```

#### `pnl.py`
```python
"""
Profit & Loss calculation.

P&L Types:
- Open P&L: unrealised on current positions
- Closed P&L: realised on closed trades
- Daily P&L: change from previous day

Key Functions:
- calculate_position_pnl(position: Position, current_price: float) -> PnL
- calculate_portfolio_pnl(positions: list[Position]) -> PortfolioPnL
"""
```

#### `risk.py`
```python
"""
Risk limits and alerts.

Risk Metrics:
- Max portfolio loss (sum of max loss per position)
- Margin utilisation
- Position concentration
- Greek limits (max delta, max vega, etc.)

Key Functions:
- calculate_max_loss(positions: list[Position]) -> float
- check_risk_limits(positions, config) -> list[RiskAlert]
- suggest_adjustments(positions, alerts) -> list[Adjustment]
"""
```

### 3.5 Performance Layer (`theta/performance/`)

#### `metrics.py`
```python
"""
Performance metrics using quantstats.

Metrics:
- Returns: daily, monthly, yearly, cumulative
- Risk-adjusted: Sharpe, Sortino, Calmar
- Drawdown: max drawdown, drawdown duration
- Win rate, profit factor, expectancy

Key Functions:
- calculate_performance_metrics(returns: pd.Series) -> PerformanceMetrics
- calculate_trade_statistics(trades: list[Trade]) -> TradeStats
"""
```

#### `reporting.py`
```python
"""
Performance reporting and visualisation.

Reports:
- HTML tear sheet (quantstats)
- Monthly returns heatmap
- Equity curve
- Drawdown chart

Key Functions:
- generate_tear_sheet(returns: pd.Series, output_path: str) -> None
- generate_monthly_returns(returns: pd.Series) -> pd.DataFrame
"""
```

---

## 4. API Endpoints

### Watchlist & Signals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/watchlist` | Ranked opportunities with scores |
| GET | `/api/v1/watchlist/{symbol}` | Detailed metrics for single symbol |
| POST | `/api/v1/signal/evaluate` | Evaluate a specific trade setup |

### Options Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/chain/{symbol}` | Options chain with Greeks |
| GET | `/api/v1/volatility/{symbol}` | IV percentile, IV rank, RV, IV/RV |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/positions` | Current positions with Greeks, P&L |
| GET | `/api/v1/risk` | Portfolio risk summary |
| POST | `/api/v1/positions` | Log a new position (manual entry) |
| PUT | `/api/v1/positions/{id}` | Update position (close, adjust) |

### Performance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/performance` | Performance metrics |
| GET | `/api/v1/performance/tearsheet` | Download HTML tear sheet |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| `/ws/positions` | Real-time position updates |

---

## 5. Configuration

### `config/settings.yaml`
```yaml
# Data providers
massive:
  api_key: ${MASSIVE_API_KEY}
  base_url: https://api.polygon.io

tastytrade:
  username: ${TASTYTRADE_USERNAME}
  password: ${TASTYTRADE_PASSWORD}

# Watchlist
watchlist:
  symbols:
    - SPY
    - QQQ
    - IWM
    - XLF
    - XLE
    - XLK
    - AAPL
    - MSFT
    - GOOGL
    - AMZN

# Signal rules
signals:
  iv_percentile_threshold: 50
  iv_percentile_strong: 70
  iv_rv_ratio_threshold: 1.3
  min_dte: 25
  max_dte: 50
  optimal_dte_min: 30
  optimal_dte_max: 45
  max_delta: 0.30
  min_open_interest: 100
  max_spread_percent: 5.0
  days_to_earnings_buffer: 7

# Risk limits
risk:
  max_portfolio_delta: 50
  max_portfolio_vega: 1000
  max_position_size_percent: 10
  max_sector_concentration_percent: 30
  max_buying_power_utilisation: 50

# Performance
performance:
  benchmark: SPY
  risk_free_rate: 0.05
```

---

## 6. Development Phases

### Phase 1: Core Analytics (Weeks 1-3)
**Goal:** Calculate IV percentile and generate basic signals via CLI

**Deliverables:**
- [ ] Project setup (Poetry, structure, config)
- [ ] Massive API client
- [ ] IV calculation module (vollib integration)
- [ ] IV percentile/rank calculation
- [ ] Realised volatility calculation
- [ ] Basic rules engine
- [ ] CLI: `python -m theta.cli watchlist`

**Success Criteria:** CLI outputs ranked watchlist with IV%, IV Rank, IV/RV

### Phase 2: Dashboard MVP (Weeks 4-6)
**Goal:** Web UI for watchlist and volatility analysis

**Deliverables:**
- [ ] FastAPI application structure
- [ ] Watchlist endpoint
- [ ] Volatility endpoint
- [ ] React frontend setup
- [ ] WatchlistTable component
- [ ] VolatilityChart component (IV vs RV history)
- [ ] SignalGauge component

**Success Criteria:** Browser shows ranked watchlist with charts

### Phase 3: Position Management (Weeks 7-10)
**Goal:** Track positions, aggregate Greeks, calculate P&L

**Deliverables:**
- [ ] Position models and database schema
- [ ] Position CRUD API
- [ ] Portfolio Greeks aggregation
- [ ] P&L calculation
- [ ] Risk alerts
- [ ] PositionMonitor component
- [ ] RiskSummary component
- [ ] WebSocket for real-time updates

**Success Criteria:** Dashboard shows positions with live Greeks and P&L

### Phase 4: Performance Analytics (Weeks 11-12)
**Goal:** Track historical performance, generate reports

**Deliverables:**
- [ ] Trade logging
- [ ] Performance metrics (quantstats integration)
- [ ] Tear sheet generation
- [ ] PerformanceDashboard component
- [ ] Monthly returns heatmap
- [ ] Equity curve chart

**Success Criteria:** Performance tab shows metrics and downloadable reports

### Phase 5: Paper Trading (Weeks 13+)
**Goal:** Validate system with paper trades

**Deliverables:**
- [ ] Paper trade logging
- [ ] Tastytrade integration (read positions)
- [ ] Trade journal
- [ ] Performance tracking over 3+ months

**Success Criteria:** 3 months of paper trading data with positive expectancy

---

## 7. File Structure

```
project-theta/
├── pyproject.toml              # Poetry configuration
├── README.md
├── .env.example                # Environment variables template
├── config/
│   └── settings.yaml           # Application configuration
├── theta/
│   ├── __init__.py
│   ├── cli.py                  # Command-line interface
│   ├── config.py               # Configuration loading
│   ├── data/
│   │   ├── __init__.py
│   │   ├── massive_client.py
│   │   ├── tastytrade_client.py
│   │   └── models.py
│   ├── analytics/
│   │   ├── __init__.py
│   │   ├── iv_calculator.py
│   │   ├── percentile.py
│   │   ├── realized_vol.py
│   │   ├── greeks.py
│   │   └── term_structure.py
│   ├── signals/
│   │   ├── __init__.py
│   │   ├── rules_engine.py
│   │   ├── scoring.py
│   │   └── filters.py
│   ├── portfolio/
│   │   ├── __init__.py
│   │   ├── position.py
│   │   ├── aggregator.py
│   │   ├── pnl.py
│   │   └── risk.py
│   ├── performance/
│   │   ├── __init__.py
│   │   ├── metrics.py
│   │   └── reporting.py
│   └── api/
│       ├── __init__.py
│       ├── main.py
│       ├── dependencies.py
│       ├── websocket.py
│       └── routes/
│           ├── __init__.py
│           ├── watchlist.py
│           ├── chain.py
│           ├── volatility.py
│           ├── positions.py
│           ├── risk.py
│           └── performance.py
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── WatchlistTable.tsx
│       │   ├── VolatilityChart.tsx
│       │   ├── PositionMonitor.tsx
│       │   ├── RiskSummary.tsx
│       │   ├── PerformanceDashboard.tsx
│       │   └── SignalGauge.tsx
│       ├── hooks/
│       │   ├── useWatchlist.ts
│       │   ├── usePositions.ts
│       │   └── useWebSocket.ts
│       ├── services/
│       │   └── api.ts
│       └── types/
│           └── index.ts
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_analytics/
│   ├── test_signals/
│   ├── test_portfolio/
│   └── test_api/
└── docs/
    ├── architecture.md
    ├── api.md
    └── deployment.md
```

---

## 8. Key Formulas Reference

### IV Percentile
```
IV Percentile = (Days where IV < Current IV) / Total Days × 100
```

### IV Rank
```
IV Rank = (Current IV - 52wk Low) / (52wk High - 52wk Low) × 100
```

### Realised Volatility (Close-to-Close)
```
RV = std(log returns) × sqrt(252) × 100
```

### Annualised Rate of Return (ARR)
```
ARR = (Premium / Max Risk) × (365 / DTE) × 100
```

### Black-Scholes Greeks
```
d1 = (ln(S/K) + (r + σ²/2)T) / (σ√T)
d2 = d1 - σ√T

Delta (Call) = N(d1)
Delta (Put)  = N(d1) - 1
Gamma        = N'(d1) / (Sσ√T)
Theta        = -(Sσ N'(d1)) / (2√T) - rKe^(-rT) N(d2)  [call]
Vega         = S√T N'(d1)
```

---

## 9. Dependencies

### Python (`pyproject.toml`)
```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
uvicorn = "^0.27.0"
pydantic = "^2.5.0"
pydantic-settings = "^2.1.0"
httpx = "^0.26.0"
numpy = "^1.26.0"
pandas = "^2.1.0"
scipy = "^1.11.0"
vollib = "^0.1.5"
pandas-ta = "^0.3.14b0"
quantstats = "^0.0.62"
pyyaml = "^6.0"
python-dotenv = "^1.0.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.23.0"
pytest-cov = "^4.1.0"
hypothesis = "^6.92.0"
black = "^23.12.0"
ruff = "^0.1.9"
mypy = "^1.8.0"
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/react-table": "^8.11.0",
    "recharts": "^2.10.0",
    "axios": "^1.6.0",
    "date-fns": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 10. Success Metrics

### System Health
- API response time < 500ms (p95)
- Data refresh latency < 5 minutes
- Uptime > 99% during market hours

### Trading Performance (Target)
- Win rate > 70%
- Profit factor > 1.5
- Max drawdown < 25%
- Annual return target: 15-25%
- Sharpe ratio > 1.0

### User Experience
- Dashboard load time < 2 seconds
- Real-time position updates < 1 second
- Clear signal interpretation (no ambiguity)
