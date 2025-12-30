KCON

Absolutely cracking, old sport. What you’ve given me in that kcon-calculator.html is properly advanced territory, and I must say, it’s a delightfully complex beast—a noble foe worthy of behavioural tagging glory.

Here’s what we’ll do now: I shall craft a granular behavioural intelligence capture layer tailored specifically for the K-CON (Concentration Risk) module. This will follow the same schema structure we’ve now established for prior modules (e.g. Risk Assessment, FOR, WDA), but with elevated nuance given K-CON’s intricate nature.

⸻

🧠 Behavioural Intelligence Capture Framework: K-CON (MiFIDPRU 4.14)

# Behavioral Intelligence Capture – K-CONcentration Risk (K-CON)
_Module: MiFIDPRU 4.14_

## 1. Module Context
- K-CON monitors exposure to individual counterparties or groups.
- Risk arises when net exposure exceeds 25% of own funds.
- Large exposures (>500%) carry additional strategic, reputational, and concentration risk.

---

## 2. Key Data Inputs for BIE Trigger

| Field                         | Behavioural Tags              | Meta Notes |
|------------------------------|-------------------------------|------------|
| Total Own Funds              | `entry_start`, `risk_baseline` | Foundation metric |
| Exposure Amount              | `decision_risk_weighting`, `high_stakes_input` | Manually entered |
| Counterparty Type            | `strategic_choice`, `sector_focus` | Selection-driven insight |
| Days to Maturity             | `time_pressure`, `urgency_classification` | Duration relevance |
| Collateral Held              | `risk_mitigation_input`, `capital_offset` | Shows hedging behaviour |
| Exposure Type                | `strategy_signal`, `book_choice` | Derivative/SFT = complexity |
| Group ID (connection logic)  | `aggregation_awareness`, `pattern_linking` | Captures risk clustering logic |

---

## 3. Behavioural Prompts (Triggered During Data Entry)

### Prompt A: On adding exposure ≥20% of own funds
> *“You're approaching the 25% threshold—what's the strategic rationale for this exposure level?”*
- `tag`: `threshold_awareness`, `strategic_bias`

### Prompt B: On choosing "Corporate" + maturity > 20 days
> *“Is this exposure expected to be rolled or is it naturally expiring?”*
- `tag`: `forward_assumption`, `exit_strategy_ambiguity`

### Prompt C: On no group ID for similar names
> *“Do you believe this counterparty is isolated, or part of a wider group relationship?”*
- `tag`: `grouping_uncertainty`, `risk_fragmentation`

### Prompt D: On use of high-risk counterparties (corporate + long-dated)
> *“Given the high implied risk, what justifies maintaining this exposure?”*
- `tag`: `risk_justification`, `stress_motivation`, `complacency_check`

---

## 4. Implicit Behavioural Signals Captured (Passive via UX/Timing)

| Signal                             | Data Example                        | Interpretation |
|------------------------------------|-------------------------------------|----------------|
| Time taken to add/edit exposure    | Timestamp delta                     | Decision confidence or hesitation |
| Number of exposures manually grouped | Group ID frequency               | Organisational risk thinking |
| Collateral use frequency           | % exposures with collateral         | Hedging attitude |
| Exposure amount edits              | Frequency of revision               | Stress revision loop |
| Repetition of exposure types       | e.g. multiple OTC Derivatives       | Strategy clustering bias |

---

## 5. Aggregated Risk Persona Output (From K-CON Behaviour)

| Persona Dimension        | Evaluation Logic |
|--------------------------|------------------|
| **Concentration Aversion** | Low grouping, low exposures >25% |
| **High-Stakes Bias**       | Frequent >25% inputs without justification |
| **Strategic Clarity**      | High use of group ID, thoughtful maturity usage |
| **Risk Complacency**       | No collateral, long-term + risky counterparties |

---

## 6. Optional Prompt on Save / Submission

> *“Based on your current inputs, your counterparty exposure pattern suggests [High/Moderate/Low] concentration vulnerability. Would you like to review or proceed?”*

- `tag`: `reflective_loop_trigger`, `meta_decision_reflexivity`


⸻

🔌 Plug-In Consideration

This structure is ideal for BIE plug-in logic:
	•	Prompts, tags, and passive signals feed into EventProcessor.ts
	•	Aggregated profile updates via PatternRecognizer.ts
	•	Meta-layer maps back into dashboard heatmaps and AI Commentary Engine

This format can be piped directly into a standalone .md or .json schema to be ingested by the core BIE engine.

Would you like me to:
	1.	Export this in Markdown?
	2.	Inject the schema into the BIE core files?
	3.	Move on to NPR (prepare the bourbon)?

Let me know, Captain. 🧠🧭