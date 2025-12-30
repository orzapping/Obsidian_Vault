# Claude's Perpetual Environment Repository - Master Index

> **What This Is**: This is Claude's operational home base. A persistent knowledge structure that enables rapid context loading, cross-session continuity, and efficient subagent coordination. This is FOR Claude, BY Claude.

**Last Updated**: December 29, 2025

---

## Quick Start - New Session Orientation

**Starting a new session?** Here's your checklist:

1. **Identify the project**: Which project is the user working on?
2. **Load quick context**: Go to `project-contexts/[PROJECT]/QUICK-CONTEXT.md`
3. **Check current state**: What's in progress? See `CURRENT-STATE.md`
4. **Review key decisions**: What's been decided? See `KEY-DECISIONS.md`
5. **Note any gotchas**: What pitfalls to avoid? See `TECHNICAL-GOTCHAS.md`

---

## Repository Structure

```
Claude's Perpetual Environment Repository/
│
├── MASTER-INDEX.md                      # YOU ARE HERE
│
├── project-contexts/                    # Per-project quick orientation
│   └── PRISM/
│       ├── QUICK-CONTEXT.md             # 2-minute PRISM orientation
│       ├── CURRENT-STATE.md             # What's in progress now
│       ├── KEY-DECISIONS.md             # Decisions log with rationale
│       └── TECHNICAL-GOTCHAS.md         # Pitfalls, lessons learned
│
├── agent-resources/                     # Subagent instructions
│   ├── AGENT-COMMAND-PROTOCOL.md        # ✓ How Claude orchestrates agents
│   ├── EXPLORE-AGENT-BRIEF.md           # (TODO) How to explore effectively
│   ├── PLAN-AGENT-BRIEF.md              # (TODO) Planning standards
│   └── CODE-REVIEW-BRIEF.md             # (TODO) Review criteria
│
├── regulatory-reference/                # Quick regulatory lookups (Layer 2)
│   ├── MIFIDPRU-QUICK-REF.md            # ✓ Fast regulatory facts & formulae
│   ├── K-FACTOR-CHEATSHEET.md           # ✓ All 9 K-factors at a glance
│   └── ICARA-PROCESS-MAP.md             # ✓ The process visualized
│
└── cross-session-memory/                # Continuity between sessions
    ├── SESSION-LOG.md                   # Brief notes from each session
    └── OPEN-QUESTIONS.md                # Unresolved items
```

---

## Active Projects

| Project | Status | Quick Context Path |
|---------|--------|-------------------|
| **PRISM** | Active Development | `project-contexts/PRISM/QUICK-CONTEXT.md` |

---

## Key External Resources

### PRISM Project

| Resource | Location |
|----------|----------|
| **Obsidian Vault** | `/home/obsidan/Documents/Obsidian Vault/` |
| **PRISM Docs (Obsidian)** | `02-Projects/PRISM/` |
| **Strategic Docs** | `02-Projects/PRISM/STRATEGIC/` |
| **Regulatory Docs** | `02-Projects/PRISM/REGULATORY/` |
| **PRISM Codebase** | `/home/obsidan/Development/PRISM-SANDBOX/project-prism-sandbox/` |
| **Project CLAUDE.md** | `/home/obsidan/Development/PRISM-SANDBOX/project-prism-sandbox/CLAUDE.md` |
| **Golden Source** | `/srv/prism-shared/GOLDEN-SOURCE/` |

### User Profile

| Resource | Location |
|----------|----------|
| **About Me Profile** | `02-Projects/PRISM/GOLDEN-SOURCE/02-DOCUMENTATION/context/aboutme_profile.md` |
| **AI Interaction Policy** | `02-Projects/PRISM/GOLDEN-SOURCE/02-DOCUMENTATION/context/7. ai_interaction_policy-preferred.md` |

---

## Working With Subagents

When spawning subagents, point them to relevant context files:

### Explore Agents
```
"Before exploring, read:
- Claude's Environment: project-contexts/PRISM/QUICK-CONTEXT.md
- Technical context: [Project CLAUDE.md path]
Focus on: [specific exploration goal]"
```

### Plan Agents
```
"Before planning, understand:
- Commercial context: 02-Projects/PRISM/STRATEGIC/COMMERCIAL-CONTEXT.md
- V1 specification: 02-Projects/PRISM/STRATEGIC/V1-SHIP-SPECIFICATION.md
- Technical architecture: [Project CLAUDE.md path]
Design for: [specific planning goal]"
```

### Code Review Agents
```
"Review against:
- Technical standards in CLAUDE.md
- V1 specification requirements
- Known gotchas in TECHNICAL-GOTCHAS.md
Focus on: [specific files or changes]"
```

---

## Session Continuity Protocol

### At Session Start
1. Check `cross-session-memory/SESSION-LOG.md` for last session notes
2. Check `cross-session-memory/OPEN-QUESTIONS.md` for unresolved items
3. Load project-specific quick context
4. Verify current state matches expectations

### During Session
- Update `CURRENT-STATE.md` when significant progress made
- Log key decisions in `KEY-DECISIONS.md`
- Note any new gotchas in `TECHNICAL-GOTCHAS.md`

### At Session End
- Add brief summary to `SESSION-LOG.md`
- Update `OPEN-QUESTIONS.md` with any unresolved items
- Update `CURRENT-STATE.md` with current progress

---

## User Context (Persistent)

### Working Style
- **Night owl**: More productive evening/late-night
- **Prefers**: Analogies, anecdotes, storytelling over dry technical descriptions
- **Philosophy**: "Work smart, not hard" - elegant solutions over brute force
- **Language**: Appreciates proper English, avoids sloppiness
- **Environment**: Linux Ubuntu 25.04, terminal-focused

### Professional Background
- 20+ years City of London financial services
- Started at FSA (now FCA) - the regulator
- Owns investment advisory firm (Orion Ridge Capital)
- Owns broker-dealer (One Global Market)
- Deep expertise: operational risk, regulatory compliance, prudential capital

### Development Context
- Solo founder - no technical team
- Relies on AI for all development work
- Can read and understand code, cannot write independently
- Critical: Cannot afford to be misled down false technical paths

---

## Documentation Layers

PRISM documentation follows a layered approach:

| Layer | Purpose | Location | Audience |
|-------|---------|----------|----------|
| **Layer 1: Full Reference** | Comprehensive detail | `02-Projects/PRISM/REGULATORY/` | Humans, deep reference |
| **Layer 2: Quick Reference** | Fast agent lookup | `regulatory-reference/` (this repo) | Agents, rapid context |
| **Layer 3: Formal Skills** | Invocable workflows | (Future - post V1) | End users |

**Trigger Points**: When working on regulatory calculations, agents should load:
- `regulatory-reference/K-FACTOR-CHEATSHEET.md` for K-factor work
- `regulatory-reference/MIFIDPRU-QUICK-REF.md` for formula verification
- `regulatory-reference/ICARA-PROCESS-MAP.md` for process understanding

---

## Key Cross-References

| Topic | Quick Ref (Layer 2) | Full Detail (Layer 1) |
|-------|---------------------|----------------------|
| K-Factors | `regulatory-reference/K-FACTOR-CHEATSHEET.md` | `02-Projects/PRISM/REGULATORY/ICARA-MIFIDPRU-GUIDE.md` |
| MiFIDPRU Formulae | `regulatory-reference/MIFIDPRU-QUICK-REF.md` | `02-Projects/PRISM/REGULATORY/ICARA-MIFIDPRU-GUIDE.md` |
| ICARA Process | `regulatory-reference/ICARA-PROCESS-MAP.md` | `02-Projects/PRISM/REGULATORY/ICARA-MIFIDPRU-GUIDE.md` |
| FCA Principles | - | `02-Projects/PRISM/REGULATORY/FCA-PRA-PRINCIPLES.md` |
| Commercial Context | - | `02-Projects/PRISM/STRATEGIC/COMMERCIAL-CONTEXT.md` |
| V1 Specification | - | `02-Projects/PRISM/STRATEGIC/V1-SHIP-SPECIFICATION.md` |
| Outstanding Work | - | `02-Projects/PRISM/STRATEGIC/OUTSTANDING-WORK-INDEX.md` |

---

## Repository Maintenance

This repository should be:
- **Updated regularly**: After significant sessions
- **Kept accurate**: Remove stale information
- **Organized**: Follow the established structure
- **Useful**: If something isn't helping, remove or improve it

---

**This is Claude's space. Use it well.**
