# PRISM - Outstanding Work Index

> **Purpose**: Consolidated index of all outstanding work items identified across documentation. Use this to plan future sessions and delegate to subagents.

**Created**: December 29, 2025
**Last Updated**: December 29, 2025

---

## How to Use This Document

1. **Planning Sessions**: Review this before strategic planning to identify priorities
2. **Subagent Delegation**: Items marked "Agent-Suitable" can be delegated
3. **Development Sessions**: Reference for what needs building
4. **Progress Tracking**: Check items off as completed

---

## Documentation TODOs

### ICARA-MIFIDPRU-GUIDE.md

| Item | Type | Agent-Suitable? | Priority |
|------|------|-----------------|----------|
| Detailed K-factor calculation methodologies | Research/Writing | Yes - Explore agent | High |
| SA-CCR methodology for K-TCD | Research/Writing | Yes - Explore agent | High |
| Stress testing scenario specifications | Research/Writing | Yes - Explore agent | High |
| Reverse stress testing methodology | Research/Writing | Yes - Explore agent | High |
| Wind-down planning requirements | Research/Writing | Yes - Explore agent | Medium |
| Regulatory reporting form specifications | Research/Writing | Yes - Explore agent | Medium |
| Example calculations | Writing | Partial - needs review | Medium |

### FCA-PRA-PRINCIPLES.md

| Item | Type | Agent-Suitable? | Priority |
|------|------|-----------------|----------|
| Full Principles for Business detail | Research/Writing | Yes - WebFetch | Medium |
| Cross-mapping to MiFIDPRU requirements | Analysis | Yes - Explore agent | Medium |
| Case studies of Principle 4 enforcement | Research | Yes - WebSearch | Low |
| Links to FCA guidance documents | Research | Yes - WebSearch | Low |

### V1-SHIP-SPECIFICATION.md

| Item | Type | Agent-Suitable? | Priority |
|------|------|-----------------|----------|
| Update progress tracking table | Ongoing | No - needs manual verification | Ongoing |
| Verify checklist items against codebase | Analysis | Yes - Explore agent | High |

---

## Development TODOs

### Critical Path (OFAR Integration)

| Item | Type | Agent-Suitable? | Notes |
|------|------|-----------------|-------|
| OFAR auto-import from FOR | Development | No | Core dev work |
| OFAR auto-import from KFR | Development | No | Core dev work |
| OFAR auto-import from Wind-Down | Development | No | Requires Wind-Down API first |
| OFAR auto-import from Stress Testing | Development | No | Requires Stress API first |
| OFAR auto-import from Risk Assessment | Development | No | Core dev work |
| OFAR auto-import from Financial Data | Development | No | Core dev work |
| OFAR PMR calculation from Firm Data | Development | No | Core dev work |

### API Completion

| Item | Type | Agent-Suitable? | Notes |
|------|------|-----------------|-------|
| Wind-Down full CRUD API | Development | No | Partial exists |
| Stress Testing results API | Development | No | Needs endpoint |
| Complete WindDownCalculation Prisma model | Development | No | Schema change |

### Stress Testing

| Item | Type | Agent-Suitable? | Notes |
|------|------|-----------------|-------|
| Reverse stress testing implementation | Development | No | Major feature |
| Linear stress testing API exposure | Development | No | For OFAR consumption |

---

## Research TODOs

### Regulatory

| Item | Type | Agent-Suitable? | Notes |
|------|------|-----------------|-------|
| FCA RegData JSON upload capability | Investigation | Yes - WebSearch | Can RegData accept automated uploads? |
| Exact MiFIDPRU stress testing requirements | Research | Yes - WebFetch from FCA | Detailed regs needed |
| ICARA document common sections | Research | Yes - WebSearch | What do good ICARAs contain? |

### Technical

| Item | Type | Agent-Suitable? | Notes |
|------|------|-----------------|-------|
| Stress testing module refactoring needs | Analysis | Yes - Explore agent | 16k+ line files |
| Performance implications of current architecture | Analysis | Yes - Explore agent | Review before scale |

---

## Skills/Documentation TODOs

| Item | Type | Agent-Suitable? | Notes |
|------|------|-----------------|-------|
| ICARA/MiFIDPRU skill creation | Strategic | Partial | Needs discussion |
| FCA/PRA Principles skill creation | Strategic | Partial | Needs discussion |
| Agent briefing documents | Writing | Partial | Structure determined, content needed |
| K-Factor cheatsheet | Writing | Yes | Quick reference doc |
| ICARA process map | Writing/Visual | Partial | Flowchart/diagram |

---

## Infrastructure TODOs

| Item | Type | Agent-Suitable? | Notes |
|------|------|-----------------|-------|
| GitHub repo for documentation | Setup | No | Manual setup |
| Obsidian sync strategy | Decision | No | User decision |
| Agent resource folder population | Writing | Partial | Briefing docs needed |

---

## Delegation Guidelines

### Suitable for Explore Agents
- Codebase analysis and mapping
- Finding patterns across files
- Documenting existing implementations
- Checking integration points

### Suitable for WebSearch/WebFetch
- Regulatory research (FCA handbook)
- Industry best practices
- Competitor analysis (if any emerge)
- Technical documentation lookup

### NOT Suitable for Agents (Require Main Context)
- Core development work
- Architectural decisions
- User-facing features
- Anything requiring conversation with user

---

## Priority Matrix

```
                    URGENT
                      │
         ┌────────────┼────────────┐
         │            │            │
         │  OFAR      │  Reverse   │
         │  Integration│  Stress   │
         │            │  Testing   │
         │            │            │
IMPORTANT├────────────┼────────────┤ NOT IMPORTANT
         │            │            │
         │  Regulatory│  FCA       │
         │  Research  │  Guidance  │
         │            │  Links     │
         │            │            │
         └────────────┼────────────┘
                      │
                  NOT URGENT
```

---

**Keep this index updated as work is completed or new items identified.**
