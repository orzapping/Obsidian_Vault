# Vision Memo: The Manifold Experience
**"From Passive Dashboard to Hunter-Killer Drone"**

## 1. Core Philosophy: The "Push" Paradigm
Most trading platforms are **Passive Tools**. They are search engines waiting for you to ask questions.
*   *Old Way:* "I wonder how Tesla is doing?" -> Type TSLA -> Look at chart.
*   *Manifold Way:* The system wakes up before you do. It scans the entire options universe (5,000+ tickers). It identifies structural inefficiencies using SVI parametrization. It **pushes** the highest probability opportunities to your attention.

**You don't search for Alpha. Alpha finds you.**

---

## 2. The User Interface Architecture

### A. The "Command Deck" (Omni-Search)
Located at the top-center (Cmd+K). This is the primary input method.
*   **Function:** Unified command palette.
*   **Capabilities:**
    *   **Navigation:** Jump to any ticker (`NVDA`, `SPX`).
    *   **Filtering:** `Sector: Semi`, `High IV Rank`, `Short Gamma`.
    *   **Actions:** `Close All Positions`, `Hedge Portfolio`.
*   **Experience:** You never leave the keyboard. You fly through the market.

### B. The "Lens" (3D Volatility Surface)
The central visualizer. Not just a pretty graph, but a topographic map of risk.
*   **Visuals:** A 3D green wireframe mesh representing the "Fair Value" (SVI Model).
*   **The Anomalies:** Real market prices appear as floating dots above or below the mesh.
*   **The Action:** A dot floating *above* the mesh means an option is **Overpriced** (relative to the surface structure). You click the dot to sell it. A dot *below* is cheap; you buy it.
*   **Interaction:** Rotatable, zoomable. It turns abstract math into physical terrain.

### C. The "Radar" (Live Signals Panel)
Located on the right. A prioritized, real-time feed of opportunities.
*   **Sorting:** Sorted by "Edge Score" (Statistical deviation from the model).
*   **Context:**
    *   "NVDA: 98/100 - IV Rank 85 - Surface Kink at $450 Strike."
    *   "SPY: Risk Alert - GEX Negative - Crash Probability Elevated."
*   **Workflow:** You click the top item. The Lens immediately focuses on that ticker's surface. You verify the kink. You execute.

### D. The "Cockpit" (Execution)
Floating context-aware panels.
*   **Smart Legging:** When you execute a complex spread (e.g., Iron Condor), the system doesn't just dump the order. It "legs in" algorithmically, selling the call side on an uptick and the put side on a downtick to capture spread edge.
*   **Risk Gate:** Before the order fires, the system checks your **Portfolio Beta**. If the trade correlates too highly with existing positions, it blocks the trade and warns: *"Too much Tech exposure. Trade Rejected."*

---

## 3. The Underlying Engines (The "Brain")

### A. The Regime Detector (HMM)
*   **Role:** The "Weather Station."
*   **Function:** Uses Hidden Markov Models to classify the market state (Calm, Trending, Volatile, Crisis).
*   **Impact:** It changes the Rules of Engagement. In a "Crisis" regime, the system automatically disables "Short Vega" (selling insurance) strategies to protect the fund.

### B. The GEX Profiler (Gamma Exposure)
*   **Role:** The "Terrain Scanner."
*   **Function:** Calculates the total Gamma Exposure of Market Makers.
*   **Impact:** When GEX is Negative, volatility accelerates. The system warns you of "Air Pockets" in liquidity where price can crash instantly.

### C. The SVI Calibrator
*   **Role:** The "Truth Seeker."
*   **Function:** Fits a theoretical curve to the chaos of market prices.
*   **Impact:** It defines what "Fair Value" is. Without this, you are guessing. With this, you are measuring.

---

## 4. The "Hunter-Killer" User Journey
1.  **Morning:** You open Manifold. The **Regime** is "Calm Bull".
2.  **The Scan:** The **Radar** highlights `AMZN` (Score: 94).
3.  **The Analysis:** You click `AMZN`. The **Lens** shows a "Smile" curve with a distinct lump (kink) at the $150 Call strike. It is trading at 35% IV, but the model says it should be 32%.
4.  **The Decision:** That 3% difference is pure Edge.
5.  **The Strike:** You click the lump on the 3D mesh.
6.  **The Execution:** The **Cockpit** opens a "Short Call Spread" ticket. The **Risk Gate** confirms you have room for Consumer Discretionary exposure.
7.  **Fire:** You click execute. The system legs into the trade.
8.  **Next:** You press `Cmd+K` and look for the next target.
