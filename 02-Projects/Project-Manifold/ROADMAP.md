# Project Manifold: Development Roadmap

## Phase 1: The Foundation (Data & Math)
**Objective:** A console application that streams data, calculates "Invisible Metrics" (GEX, SVI), and stores them.

### Week 1: Infrastructure
- [x] Initialize Git & Poetry environment (`scipy`, `numba`, `zmq`, `asyncpg`).
- [ ] Set up Docker containers for TimescaleDB and Redis.
- [ ] Build `manifold.core.messaging` (ZeroMQ Pub/Sub).

### Week 2: Data Ingestion
- [x] Build `manifold.feed.massive` (Polygon.io WebSocket client).
- [ ] Implement `manifold.feed.geeks` (JIT-compiled Greeks).
- [ ] Verify 1000+ msg/sec throughput.

### Week 3: Surface Analytics
- [ ] Implement `manifold.analytics.surface` (SVI Calibration using `scipy.optimize`).
- [ ] Implement `manifold.analytics.gex` (Net Gamma Exposure).
- [ ] Console Output: Real-time "GEX Meter" and "SVI RMSE" monitor.

---

## Phase 2: The Strategist (Regime & Logic)
**Objective:** The system identifies "Where we are" (Regime) and "Where the alpha is" (Signal).

### Week 4: Regime Detection
- [ ] Fetch 5 years of SPY/VIX history.
- [ ] Train `hmmlearn` Gaussian Mixture Model.
- [ ] Implement `manifold.analytics.regime` for live classification.

### Week 5: Strategy Engine
- [ ] Build `manifold.strategy.engine` (Event Loop).
- [ ] Implement `manifold.strategy.alpha.surface_arb` (The "Kink" Hunter).
- [ ] Backtest SVI Arbitrage strategy on historical data.

---

## Phase 3: The Dashboard (Visualization)
**Objective:** A "Minority Report" style interface to visualize the math.

### Week 6: API Layer
- [ ] Build FastAPI Gateway (`manifold.api`).
- [ ] Expose WebSocket endpoints for real-time Surface/GEX data.

### Week 7: Frontend Core
- [ ] Initialize React + Vite + TypeScript.
- [ ] Set up `react-three-fiber`.
- [ ] Build the "3D Volatility Surface" component.

### Week 8: Dashboard Polish
- [ ] "Regime Radar" Widget.
- [ ] "GEX Profile" Chart (Recharts).
- [ ] Deployment to local server.

---

## Phase 4: Execution (The Trigger)
**Objective:** Paper trading and risk management.

### Week 9: Execution & Risk
- [ ] Implement `manifold.execution.risk_gate`.
- [ ] Integrate Tastytrade API for order routing.
- [ ] Implement "Paper Trading" mode.

### Week 10: Live Testing
- [ ] Run system in "Shadow Mode" (Logging trades without executing).
- [ ] Performance analysis & tuning.
