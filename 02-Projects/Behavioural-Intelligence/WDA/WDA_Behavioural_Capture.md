
# Behavioural Intelligence Capture Reference Sheet – Wind-Down Assessment (WDA)

**Module**: Wind-Down Assessment  
**Plugin Name**: `Plugin_WDA_Capture.ts`  
**Status**: POC Phase (to be implemented in TypeScript)

---

## 🎯 Key Decision Points Tracked

| Context | Trigger | Captured Data |
|--------|---------|----------------|
| Wind-down period | Slider change | `period_length`, `change_frequency` |
| Approach selection (consolidated vs granular) | Toggle | `approach_type`, `switch_count`, `confidence` |
| Total cost entry | Input focus/submit | `cost_confidence_level`, `revision_count` |
| Subcategory engagement | Expand/edit | `engagement_depth`, `hesitation_time` |
| Stress scenario config | Modal interactions | `scenario_bias`, `risk_appetite` |
| Phasing timeline control | Slider adjustments | `prioritisation_bias`, `burn_rate_sensitivity` |
| Adding critical milestones | +Add, edit | `planning_detail`, `sequencing_focus` |
| Manual overrides | Rapid input changes | `override_anxiety`, `stress_trigger_pattern` |

---

## 📊 Metadata Signals Captured

- `timestamp`
- `input_latency`
- `focus_sequence`
- `hover_duration`
- `modal_dwell_time`
- `recalculation_frequency`
- `approach_flips`
- `slider_indecision_pattern`
- `suggested_default_use`
- `interruption_markers`

---

## 💬 Annotated Prompt Injections

| Condition | Suggested Prompt |
|----------|------------------|
| Hover but no input | _“Would you like help breaking this down?”_ |
| Multiple recalculations | _“Adjusting for new assumptions? Log them here.”_ |
| Reduced wind-down after stress | _“Has the adverse scenario altered your strategy?”_ |
| Missing key milestones | _“Milestones help validate your exit plan.”_ |

---

## 🧠 Example Behavioural Events

```ts
{
  module: "WDA",
  event: "cost_entry_revised",
  metadata: {
    previous_value: 150000,
    new_value: 110000,
    input_latency: 3400,
    timestamp: "2025-06-30T15:12:41.823Z"
  }
}
```

```ts
{
  module: "WDA",
  event: "stress_modal_opened",
  metadata: {
    modal_dwell_time: 9200,
    slider_engagement: 4,
    applied: true,
    timestamp: "2025-06-30T15:17:03.223Z"
  }
}
```

---

## 🛠️ Development Notes

- Final TypeScript implementation to follow project-wide integration plan
- HTML calculator POC to be transitioned to React/TypeScript component
- Plugin schema conforms to `BehaviouralIntelligenceEngine` event structure
