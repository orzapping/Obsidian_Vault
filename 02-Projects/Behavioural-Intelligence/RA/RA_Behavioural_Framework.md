
# Risk Assessment Module – Behavioural Intelligence Layer

## Overview
This document outlines the tailored behavioural capture structure embedded within the Risk Assessment module of the ICARA/MiFIDPRU platform. The purpose is to create high-fidelity training data for an AI model designed to understand human decision-making under high-stakes regulatory conditions.

---

## 🎯 Interaction Points & Behavioural Prompts

| Interaction Point                        | Trigger Prompt                                                                 | Purpose                                  |
|------------------------------------------|--------------------------------------------------------------------------------|------------------------------------------|
| Risk Type Selection                      | “Why do you consider this risk material at this time?”                         | Rationale, regulatory awareness          |
| Likelihood/Impact Scoring                | “What real-world scenario are you basing these estimates on?”                 | Scenario-based logic, experience         |
| Mitigation Effectiveness (Slider)        | “What evidence supports this mitigation confidence level?”                     | Mitigation confidence model              |
| Capital Allocation                       | “Why this amount rather than more/less?”                                       | Cost-risk psychology                     |
| Adding New Risk Rows                     | “Is this a newly emerging risk? What triggered its inclusion?”                 | Early warning signals                    |
| Adjusting Existing Scores                | “What’s changed in your view since last update?”                               | Evolution under pressure                 |
| Residual Risk Evaluation                 | “Is this residual risk within your firm’s risk appetite?”                      | Tolerance & governance intent            |
| Notes Section                            | “Include debates, disagreements, or uncertain views here.”                     | Captures cultural/decision dynamics      |

---

## 🧠 Metadata Schema

Each prompt will be captured with metadata:
- decision_type: risk identification | capital allocation | override
- reasoning_style: heuristic | quantitative | emotional | procedural
- certainty_level: high | moderate | low
- emotional_tone: cautious | confident | anxious | indifferent
- stress_context: normal ops | emerging pressure | crisis simulation
- source_reference: regulatory | anecdotal | client-driven | board mandate

---

## Prototype

An HTML prototype demonstrates contextual prompt injection and simulated metadata capture.
