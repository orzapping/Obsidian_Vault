# 📦 VANTAGE Dataset Specification
*Version: 1.0 | Date: 2025-07-01*

---

## 🔹 Overview
The **VANTAGE** dataset is the canonical output format of the AnthroSynth Behavioural Intelligence Engine. It stores version-controlled, context-rich behavioural records in a structured format that is both human-readable and machine-trainable.

---

## 🔹 Objectives
- Persist emotionally and behaviourally annotated decision data.
- Enable downstream querying, AI training, visualisation, and audit.
- Maintain schema versioning and domain modularity.

---

## 🔹 Data Entry Structure

Each entry is a structured JSON object comprising:

```json
{
  "timestamp": "2025-07-01T14:33:22Z",
  "module": "mifidpru-kfactor",
  "user_id": "anon-8743",
  "context": {
    "firm_type": "non-SNI",
    "user_role": "CFO",
    "decision_stage": "post-mitigation"
  },
  "inputs": {
    "slider_confidence": 7,
    "text_justification": "Mitigation is well embedded and routinely tested."
  },
  "signals": {
    "latency_ms": 2745,
    "revisits": 2,
    "prompt_dismissed": false
  },
  "tags": ["risk", "confidence", "financial"],
  "score": 6.9,
  "schema_version": "v1.0"
}
```

---

## 🔹 Field Definitions

| Field             | Type     | Description |
|------------------|----------|-------------|
| `timestamp`       | `string` | ISO 8601 UTC timestamp of capture |
| `module`          | `string` | Source module triggering the event |
| `user_id`         | `string` | Anonymised user identifier |
| `context`         | `object` | Domain-specific state variables |
| `inputs`          | `object` | Active user inputs (sliders, text, etc.) |
| `signals`         | `object` | Passive data (timing, latency, errors) |
| `tags`            | `array`  | Semantic labelling for filtering |
| `score`           | `number` | Weighted scoring outcome (optional) |
| `schema_version`  | `string` | Version of the plug-in schema used |

---

## 🔹 Context Keys (Common Examples)

| Key             | Description |
|----------------|-------------|
| `firm_type`     | SNI or non-SNI |
| `user_role`     | Decision-maker, Analyst, etc. |
| `decision_stage`| Pre- or post-submission |

---

## 🔹 Tagging System

Tags are used for filtering, training, analysis and audit. Example tag sets:

- `risk`, `liquidity`, `capital`, `compliance`, `stress`, `confidence`, `hesitation`, `override`, `volatility`, `bias`, `timing`, `emotion`

---

## 🔹 Notes on Persistence

- **Anonymity First**: All user IDs must be hashed or tokenised.
- **Encrypted-at-Rest**: Every record is encrypted on storage.
- **Schema-linked**: Every record maps back to its originating schema version for reproducibility.

---

## 🧠 Future Enhancements

- [ ] Time-series chaining (decision evolution over time)
- [ ] Multimodal input support (voice, gesture)
- [ ] Uncertainty quantification metrics

---

## 📘 VANTAGE API (Stub)

- `GET /vantage/query?tags=risk+confidence`
- `POST /vantage/record`
- `GET /vantage/user-history/:user_id`
