
# 🧠 Project Prometheus: Behavioural Intelligence Abstraction Matrix

This document outlines the module-by-module behavioural signal tracking for Project Prometheus. Each module is designed to capture user behaviour, decision rationale, and emotional indicators within high-stakes financial environments.

---

## 📘 Legend

| Field | Description |
|-------|-------------|
| **Module** | The ICARA/MiFIDPRU platform section |
| **Action/Decision Point** | Key user interaction |
| **Behavioural Signals** | What the system passively tracks |
| **Prompt Trigger** | When the system asks for input |
| **Data Tag** | Identifier used in the behavioural engine |

---

## 🧾 Module Abstraction Matrix

### 1. 🏢 Firm Information

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| User enters firm details | Input completion time | None | `firminfo_basic_entry_time` |
| Edits contributor list | Add/remove contributors rapidly | “Why are contributors changing frequently?” | `firminfo_contributor_volatility` |

---

### 2. 💰 Financial Data

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| PMR selection | Delay in choosing among PMR thresholds | “What influenced your PMR selection?” | `financial_pmr_decision_rationale` |
| SNI/Non-SNI toggle | Toggle reversals, hesitations | “Not sure about SNI status?” | `financial_sni_toggle_confidence` |

---

### 3. 🧾 Fixed Overhead Requirement (FOR)

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Add/modify cost category | Manual override of auto-calc | “Why did you override this FOR item?” | `for_override_reason` |
| Unusual seasonality | High Q4/Q1 delta | “Please explain the variance in quarterly expenses.” | `for_quarterly_volatility_note` |

---

### 4. ⚖️ Risk Assessment

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Slider movement | Repeated changes, backtracking | “What made you revise this risk level?” | `risk_reconsideration_flag` |
| Capital allocation | Divergence from residual risk norm | “Reason for high/low capital allocation?” | `risk_capital_justification` |

---

### 5. ⏳ Wind-Down Modeller

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Duration set | Extreme or nonstandard durations | “Why this wind-down period?” | `wdc_duration_anomaly_explainer` |
| Burn rate changes | Sudden spikes/drops | “Explain this cost shift?” | `wdc_burnrate_change_reason` |

---

### 6. 🧮 K-Factor Engine

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Inputting volumes | Manual data overrides | “Why override imported K-factor input?” | `kfactor_override_flag` |
| Ignored warning | Ignoring alerts | “You ignored a K-CON warning. Explain?” | `kfactor_warning_ack` |

---

### 7. 💧 Liquidity Thresholds

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Setting buffer | Low buffer confidence | “How confident are you in this buffer?” | `liquidity_confidence_level` |
| Inputting LAR | Unusually low/high LAR | “Why this basic liquid asset ratio?” | `lar_extreme_flag` |

---

### 8. 📊 Stress & Reverse Stress Test

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Scenario selection | Preference for base scenarios | “Avoided severe cases – any concerns?” | `stress_avoidance_flag` |
| Manual scenario creation | High iterations/rewrites | “What are you anticipating?” | `stress_custom_rationale` |

---

### 9. 🧾 Historical Dashboard

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Performance trend review | Rapid tab switches | “Searching for something specific?” | `history_review_intent` |

---

### 10. 🧠 AI Commentary & Audit

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Dismissing commentary | Frequent dismissals | “Would you like less AI insight here?” | `ai_commentary_dismissal_feedback` |
| Repeating commentary | Same AI request again | “Seeking second opinion?” | `ai_opinion_loop` |

---

### ✅ Shared Context Module: Balance Sheet

| Action/Decision Point | Behavioural Signals | Prompt Trigger | Data Tag |
|------------------------|----------------------|-----------------|-----------|
| Adjusting Tier 2 cap | Maximising T2 value | “What influenced your Tier 2 allocation?” | `tier2_max_flag` |
| Sudden asset change | Big shift in assets | “What drove this reclassification?” | `bs_asset_shift_note` |

---

## 🔚 End of Matrix v1.0

Next step: We convert this into a YAML schema that the engine can ingest.
