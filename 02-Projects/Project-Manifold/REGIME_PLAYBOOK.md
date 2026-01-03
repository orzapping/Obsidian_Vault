# Manifold Regime Playbook: The Rules of Engagement

## Overview
Markets are not random walks; they are state-dependent systems. A strategy that prints money in a **Calm Bull** regime will bankrupt you in a **Crisis** regime. Manifold uses a Gaussian Mixture Model (HMM) to classify the current state into one of four regimes.

---

## 1. The Four Regimes

### 🟢 Regime 1: Calm Bull ("The Grind")
*   **Characteristics:** Low Volatility, Positive Drift, Contango Term Structure.
*   **The Vibe:** Boring. Stocks slowly drift up.
*   **Indicators:**
    *   VIX < 15
    *   Term Structure: Steep Contango (VIX 3m > VIX Spot)
    *   GEX: Positive (Dealers dampen moves)
*   **Manifold Strategy:** **Short Volatility / Leverage.**
    *   *Primary:* Short Strangles (harvest decay).
    *   *Secondary:* Leveraged Longs (Call Spreads).
*   **Visualization:** The UI shows a "Green Pulse." The SVI surface is smooth and relaxed.

### 🟡 Regime 2: Volatile Bull ("The Trader's Market")
*   **Characteristics:** High Volatility, Positive Drift.
*   **The Vibe:** Big swings, but generally upwards. "Buy the dip" works.
*   **Indicators:**
    *   VIX 15-22
    *   Term Structure: Flat / Slight Contango
    *   GEX: Neutral to Low Positive
*   **Manifold Strategy:** **Directional Spreads.**
    *   *Primary:* Put Credit Spreads (Bullish but defined risk).
    *   *Secondary:* Iron Condors (wide wings).
*   **Visualization:** The UI pulses Yellow. The SVI surface shows steep skew (puts are expensive).

### 🟠 Regime 3: Correction ("The Shakeout")
*   **Characteristics:** High Volatility, Negative Drift.
*   **The Vibe:** Fear. Sharp drops. Rallies fail.
*   **Indicators:**
    *   VIX 22-30
    *   Term Structure: Flattening / Slight Backwardation
    *   GEX: **Negative** (Dealers accelerate moves).
*   **Manifold Strategy:** **Short Delta / Long Vega.**
    *   *Primary:* Debit Put Spreads (profit from drop).
    *   *Secondary:* Long Straddle (profit from chaos).
    *   *Rule:* **NO NAKED SHORT PUTS.**
*   **Visualization:** The UI pulses Orange. The 3D Surface "frowns" (smile inverts or steepens aggressively).

### 🔴 Regime 4: Crisis ("The Crash")
*   **Characteristics:** Extreme Volatility, Extreme Negative Drift.
*   **The Vibe:** Panic. Correlations go to 1. Everything falls together.
*   **Indicators:**
    *   VIX > 35
    *   Term Structure: **Deep Backwardation** (Spot VIX >> Futures).
    *   GEX: Deeply Negative.
*   **Manifold Strategy:** **Protection / Cash.**
    *   *Primary:* Cash is King.
    *   *Secondary:* VIX Calls (Tail Hedging).
    *   *Rule:* **KILL SWITCH.** All short vega positions are auto-closed by the Risk Engine.
*   **Visualization:** The UI flashes Red. The "System Status" alerts "DEFCON 1."

---

## 2. Transition Signals (The "Tell")

How do we know we are shifting?

1.  **The GEX Flip:**
    *   When Net Gamma Exposure flips from Positive to Negative, volatility unclamps. Manifold watches the `$0 GEX Line`. Crossing this is the first warning shot.

2.  **VIX Term Structure Inversion:**
    *   Healthy markets pay for insurance in the future (Contango).
    *   Panicked markets pay for insurance *now* (Backwardation).
    *   When `VIX Spot > VIX 3-Month`, the regime has shifted to **Crisis**.

3.  **SVI Surface Kinks:**
    *   Before a crash, "Downside Puts" often get bid up irrationally fast. The SVI model will show a massive "RMSE Error" spike because the market pricing is breaking the theoretical curve. Manifold detects this "Stress Fracture" before the price collapses.

---

## 3. Programmable Risk Protocols

Yes, these are hard-coded rules in the `manifold.execution.risk_gate` module.

```python
# Pseudo-code Example of Risk Gate Logic
def check_risk_gate(order, regime):
    if regime == Regime.CRASH and order.vega < 0:
        return "REJECTED: Cannot sell volatility in Crisis Regime."
        
    if regime == Regime.CORRECTION and portfolio.beta > 1.0:
        return "REJECTED: Portfolio Beta too high for Correction."
        
    return "APPROVED"
```

This logic runs **before** any order is sent to the broker. It saves you from yourself.
