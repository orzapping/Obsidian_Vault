# Prompt Summary: Complete List

This document lists all prompts needed for the complete Project Theta implementation. Detailed prompts have been created for the critical path items. The remaining prompts follow the same structure and can be created as needed.

---

## Phase 1: Core Analytics ✓ PROMPTS READY

| # | File | Status | Description |
|---|------|--------|-------------|
| 01 | `01_project_setup.md` | ✅ Complete | Poetry, structure, config |
| 02 | `02_data_models.md` | ✅ Complete | Pydantic models for options |
| 03 | `03_massive_client.md` | 📝 To Create | Polygon.io API client |
| 04 | `04_iv_calculator.md` | ✅ Complete | IV extraction with vollib |
| 05 | `05_percentile.md` | 📝 To Create | IV percentile & rank |
| 06 | `06_realized_vol.md` | 📝 To Create | Historical volatility |
| 07 | `07_greeks.md` | 📝 To Create | Greeks calculation |
| 08 | `08_rules_engine.md` | 📝 To Create | Signal rules |
| 09 | `09_scoring.md` | ✅ Complete | ARR & scoring |
| 10 | `10_cli.md` | 📝 To Create | CLI interface |

---

## Phase 2: API Layer

| # | File | Status | Description |
|---|------|--------|-------------|
| 11 | `11_fastapi_setup.md` | 📝 To Create | FastAPI app structure |
| 12 | `12_watchlist_endpoint.md` | 📝 To Create | GET /api/v1/watchlist |
| 13 | `13_volatility_endpoint.md` | 📝 To Create | GET /api/v1/volatility/{symbol} |
| 14 | `14_chain_endpoint.md` | 📝 To Create | GET /api/v1/chain/{symbol} |

---

## Phase 3: Frontend

| # | File | Status | Description |
|---|------|--------|-------------|
| 15 | `15_react_setup.md` | 📝 To Create | Vite + React + TS + Tailwind |
| 16 | `16_api_client.md` | 📝 To Create | Axios service |
| 17 | `17_watchlist_table.md` | 📝 To Create | WatchlistTable component |
| 18 | `18_volatility_chart.md` | 📝 To Create | IV vs RV chart |
| 19 | `19_signal_gauge.md` | 📝 To Create | Signal strength gauge |

---

## Phase 4: Position Management

| # | File | Status | Description |
|---|------|--------|-------------|
| 20 | `20_position_models.md` | 📝 To Create | Position data models |
| 21 | `21_portfolio_aggregator.md` | 📝 To Create | Portfolio Greeks |
| 22 | `22_pnl_calculator.md` | 📝 To Create | P&L calculation |
| 23 | `23_risk_module.md` | 📝 To Create | Risk limits & alerts |
| 24 | `24_positions_api.md` | 📝 To Create | Positions endpoints |
| 25 | `25_websocket.md` | 📝 To Create | Real-time updates |

---

## Phase 5: Performance

| # | File | Status | Description |
|---|------|--------|-------------|
| 26 | `26_performance_metrics.md` | 📝 To Create | quantstats integration |
| 27 | `27_reporting.md` | 📝 To Create | Tear sheet generation |
| 28 | `28_performance_api.md` | 📝 To Create | Performance endpoints |

---

## Prompt Creation Notes

For prompts marked "📝 To Create", follow this template:

```markdown
# Prompt XX: [Module Name]

## Context
[Brief description of Project Theta and where this fits]

## Prerequisites
[Which prompts must be completed first]

## Task
[What to build, in detail]

## Reference Files
[Which repos/files to examine]

## Specifications
[Detailed code with docstrings]

## Tests
[Test file with comprehensive tests]

## Acceptance Criteria
[How to verify success]

## Output Files
[List of files created]

## Next Prompt
[What comes next]
```

---

## Quick Reference: What Each Phase Delivers

### After Phase 1
```bash
poetry run theta watchlist
```
Outputs ranked watchlist with IV%, IV Rank, IV/RV, Score, ARR

### After Phase 2
```bash
curl http://localhost:8000/api/v1/watchlist
```
JSON API returning watchlist data

### After Phase 3
Open `http://localhost:5173` to see the dashboard with:
- Ranked watchlist table
- IV vs RV charts
- Signal strength indicators

### After Phase 4
Dashboard shows:
- Current positions with Greeks
- P&L tracking
- Risk alerts
- Real-time updates

### After Phase 5
Dashboard shows:
- Performance metrics
- Equity curve
- Monthly returns
- Downloadable reports

---

## Estimated Effort

| Phase | Prompts | Estimated Time |
|-------|---------|----------------|
| 1 | 10 | 2-3 weeks |
| 2 | 4 | 1 week |
| 3 | 5 | 1-2 weeks |
| 4 | 6 | 2-3 weeks |
| 5 | 3 | 1 week |
| **Total** | **28** | **7-10 weeks** |

*Times assume execution via CC with review cycles*

---

## Creating Missing Prompts

When you need a prompt that's marked "📝 To Create", you can:

1. **Ask Claude (here)** to generate it based on the template
2. **Use CONTEXT.md** to provide CC with background
3. **Reference the complete prompts** (01, 02, 04, 09) as examples

The detailed prompts I've created cover the critical path modules. The remaining prompts follow similar patterns but for different modules.
