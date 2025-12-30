WDAWDA Behavioural Intelligence Capture Framework

Splendid—your Wind-Down Assessment (WDA) module is an intricate beast, and quite beautifully structured, I might add. Now, as requested, let us define the Behavioural Intelligence Capture Framework for this WDA module.

We’ll take your now-established methodology—identifying decision points, pressure indicators, and emotional metadata markers—and tailor it precisely to the wind-down context, as seen in the enhanced HTML model you’ve provided.

⸻

✅ WDA Behavioural Intelligence Capture Framework

Module: Wind-Down Assessment
Captured By: BIE: Plugin_WDA_Capture.ts (to be implemented)

⸻

🔸 1. Key Decision Points to Monitor

These are interaction events with behavioural signal potential:

Decision Context	Prompt Trigger	Data Type Captured
Wind-down period selection (3–24 months)	On slider adjustment	period_length, change_frequency
Choice of consolidated vs granular approach	On tab toggle	approach_type, switch_count, confidence
Entry of Total Wind-Down Cost	On input focus & submission	cost_confidence_level, revision_count
Subcategory breakdown entries	On expand, hover, and edit events	engagement_depth, hesitation_time
Stress scenario adjustments	On modal open, changes, apply	scenario_bias, risk_appetite
Phasing adjustments across timelines	On slider drag / phase redistribution	prioritisation_bias, burn_rate_sensitivity
Critical activity additions	On ‘+ Add’ action, text input, timing	planning_detail, sequencing_focus
Manual overrides or high-stress inputs	Repeated field edits, stress modal use	override_anxiety, stress_trigger_pattern


⸻

🔸 2. Metadata Signals (Capture Meta-Layer)

Metadata Field	Description
timestamp	ISO timestamp for all interactions
input_latency	Time between field focus and entry
focus_sequence	Order of field interactions (e.g. skipped categories)
hover_duration	Time spent hovering over specific fields/tooltips
modal_dwell_time	Time spent in modal dialogues (stress, phasing, critical paths)
recalculation_frequency	Number of WDA recalculations during session
approach_flips	Switching between consolidated ↔ granular
slider_indecision_pattern	Repeated slider adjustments without commitment
suggested default use	Whether default values were accepted, ignored, or overwritten
interruption_markers	Breaks in session activity (suggesting doubt or context switching)


⸻

🔸 3. Annotated Prompt Injections (Client-Facing)

Designed to surface just-in-time prompts based on observable behavioural cues:

Condition	Suggested Prompt
User hovers over subcategory field but doesn’t complete	“Would you like help breaking down this cost further?”
Repeated WDA recalculations within short time	“Are you adjusting due to external assumptions? You can log them for review.”
Wind-down period reduced sharply after stress scenario use	“Has the adverse scenario changed your wind-down strategy?”
Critical activities skipped or added late	“Don’t forget: key milestones help validate capital adequacy timelines.”


⸻

🔸 4. Event Dispatch Examples (for EventRepository.ts)

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


⸻

🔸 5. Proposed Plugin Stub (Plugin_WDA_Capture.ts)

We’ll eventually formalise this as a .ts plugin that injects listeners across:
	•	Range sliders (wind-down period, phasing)
	•	Modal triggers and actions (stress scenarios, critical paths)
	•	Input fields (total costs, subcategories)
	•	Toggle buttons (consolidated vs granular)

It will dispatch events to the BehaviouralIntelligenceEngine with relevant tags and classifications based on a controlled schema.

⸻

Would you like me to go ahead and produce the .md reference sheet for this module in the same style as the others?