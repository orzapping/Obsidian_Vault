# Project Manifold: Resume Protocol
**Save Point:** Alpha v0.1 (2026-01-02)

## 1. The Context (For the Agent)
If you are a new AI agent picking up this task, here is your briefing:

*   **Project:** Manifold (Institutional Volatility Arbitrage Engine).
*   **Tech Stack:** Python 3.11 (FastAPI, ZeroMQ, Scipy, AsyncPG), React 19 (Vite, Tailwind v4, Three.js), TimescaleDB, Redis.
*   **Root Directory:** `/home/obsidan/Development/Projects/project-manifold`
*   **Documentation:** `/srv/Obsidian-Vault/02-Projects/Project-Manifold`

## 2. Current State
*   **Backend:** Functional. `main.py` launches Core Engine + API.
*   **Frontend:** Functional. `localhost:5174`. Displays mocked Surface.
*   **Data:** Polygon.io WebSocket is ACTIVE and streaming real quotes.
*   **Regime Detection:** Implemented (`manifold/analytics/regime.py`) but needs verification.

## 3. Immediate Objectives (Next Session)
1.  **Wire the Surface:** Modify `VolSurface.tsx` to listen to `ANALYTICS.SURFACE` events instead of using the hardcoded mock function.
2.  **Verify Regime:** Confirm the HMM model is training on history and outputting a state label.
3.  **Backfill:** Implement historical data fetching on startup so charts aren't empty.

## 4. Operational Commands
*   **Launch System:** `cd /home/obsidan/Development/Projects/project-manifold && ./launcher.sh`
*   **Launch Frontend Only:** `./frontend/start_frontend.sh`
*   **Git Status:** Repo is synced to `origin main`.

---

## 5. The "Resume Prompt"
*Copy and paste this to the AI at the start of the next session:*

> "I am resuming work on Project Manifold. The codebase is located at `/home/obsidan/Development/Projects/project-manifold`. Please review `RESUME_PROTOCOL.md` and `PROJECT_STATUS_2026-01-02.md` in the Obsidian Vault (`/srv/Obsidian-Vault/02-Projects/Project-Manifold`) to orient yourself. We are currently at Alpha v0.1. The system is runnable via `./launcher.sh`. Our immediate goal is to wire the React 3D Surface to the live SVI backend data. Let's proceed."
