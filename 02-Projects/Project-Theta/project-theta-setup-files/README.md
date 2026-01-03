# Claude Code Orchestration Guide

## Overview

This directory contains structured prompts for orchestrating Project Theta development through Claude Code (CC). Each prompt is self-contained with full context, enabling CC to execute specific development tasks without needing the full conversation history.

## How to Use These Prompts

### 1. Preparation
Before starting any prompt:
1. Ensure you've cloned the reference repositories (see `REPOS_TO_CLONE.md`)
2. Have the `PROJECT_THETA.md` available for reference
3. Set up your environment variables (API keys, etc.)

### 2. Prompt Execution Order
Execute prompts in sequence within each phase. Each prompt builds on the previous.

### 3. Prompt Structure
Each prompt file contains:
- **Context Block**: Background information CC needs
- **Reference Files**: Which cloned repos to examine
- **Task Description**: What to build
- **Acceptance Criteria**: How to verify success
- **Output Files**: Expected deliverables

### 4. Running a Prompt
1. Open Claude Code in the project directory
2. Copy the full prompt content
3. Paste and execute
4. Review the output
5. Run tests/verification
6. Commit if satisfied

---

## Prompt Index

### Phase 1: Core Analytics

| # | Prompt File | Purpose | Dependencies |
|---|-------------|---------|--------------|
| 1.0 | `01_project_setup.md` | Initialize Poetry project, structure, config | None |
| 1.1 | `02_data_models.md` | Pydantic models for options data | 1.0 |
| 1.2 | `03_massive_client.md` | Polygon.io API client | 1.1 |
| 1.3 | `04_iv_calculator.md` | IV extraction using vollib | 1.1 |
| 1.4 | `05_percentile.md` | IV percentile & rank calculation | 1.3 |
| 1.5 | `06_realized_vol.md` | Historical volatility calculation | 1.1 |
| 1.6 | `07_greeks.md` | Greeks calculation module | 1.1 |
| 1.7 | `08_rules_engine.md` | Signal generation rules | 1.4, 1.5, 1.6 |
| 1.8 | `09_scoring.md` | Opportunity scoring & ARR | 1.7 |
| 1.9 | `10_cli.md` | Command-line interface | All above |

### Phase 2: API Layer

| # | Prompt File | Purpose | Dependencies |
|---|-------------|---------|--------------|
| 2.0 | `11_fastapi_setup.md` | FastAPI application structure | Phase 1 |
| 2.1 | `12_watchlist_endpoint.md` | Watchlist API endpoint | 2.0 |
| 2.2 | `13_volatility_endpoint.md` | Volatility data endpoint | 2.0 |
| 2.3 | `14_chain_endpoint.md` | Options chain endpoint | 2.0 |

### Phase 3: Frontend

| # | Prompt File | Purpose | Dependencies |
|---|-------------|---------|--------------|
| 3.0 | `15_react_setup.md` | React + Vite + TypeScript + Tailwind | None |
| 3.1 | `16_api_client.md` | API client service | 3.0 |
| 3.2 | `17_watchlist_table.md` | WatchlistTable component | 3.1 |
| 3.3 | `18_volatility_chart.md` | VolatilityChart component | 3.1 |
| 3.4 | `19_signal_gauge.md` | SignalGauge component | 3.1 |

### Phase 4: Position Management

| # | Prompt File | Purpose | Dependencies |
|---|-------------|---------|--------------|
| 4.0 | `20_position_models.md` | Position data models | Phase 1 |
| 4.1 | `21_portfolio_aggregator.md` | Portfolio Greeks aggregation | 4.0 |
| 4.2 | `22_pnl_calculator.md` | P&L calculation | 4.0 |
| 4.3 | `23_risk_module.md` | Risk limits and alerts | 4.1, 4.2 |
| 4.4 | `24_positions_api.md` | Positions API endpoints | 4.0-4.3 |
| 4.5 | `25_websocket.md` | Real-time position updates | 4.4 |

### Phase 5: Performance

| # | Prompt File | Purpose | Dependencies |
|---|-------------|---------|--------------|
| 5.0 | `26_performance_metrics.md` | Performance calculations | Phase 4 |
| 5.1 | `27_reporting.md` | Tear sheet generation | 5.0 |
| 5.2 | `28_performance_api.md` | Performance API endpoints | 5.1 |

---

## Context Document

The file `CONTEXT.md` contains condensed context that should be prepended to any prompt if CC seems to lack understanding. It includes:
- Project summary
- Key architectural decisions
- Important formulas
- Style guidelines

---

## Tips for Effective CC Sessions

### Do:
- Run one prompt at a time
- Verify output before moving to next prompt
- Commit after each successful prompt
- Reference specific files from cloned repos when relevant

### Don't:
- Skip prompts in sequence
- Combine multiple prompts (unless trivial)
- Assume CC remembers previous sessions

### If CC Gets Confused:
1. Provide the `CONTEXT.md` content
2. Point to specific reference files
3. Break the task into smaller pieces
4. Show examples from cloned repos

---

## Customisation

Feel free to modify prompts based on:
- Your API key availability
- Specific symbol preferences
- Risk parameter preferences
- UI/UX preferences

The prompts are templates - adjust them to your workflow.
