# Agent Command Protocol

> **Purpose**: Document how Claude (main thread) orchestrates subagents for efficient work while preserving context and maintaining transparency.

**Created**: December 29, 2025
**Owner**: Claude (for self-reference and user transparency)

---

## Philosophy

The main conversation thread is precious. It's where:
- Strategic discussion happens
- User interaction occurs
- Key decisions are made
- Context accumulates

Heavy exploration, research, and analysis work should be **delegated to agents** to:
- Preserve main thread context
- Enable parallel execution
- Allow work to continue while research runs
- Return concise, actionable summaries

---

## When to Spawn Agents (At My Discretion)

### ALWAYS Delegate

| Situation | Agent Type | Rationale |
|-----------|------------|-----------|
| Exploring unfamiliar parts of codebase | Explore | Keeps exploration out of main context |
| Searching for patterns across many files | Explore | Heavy file reading delegated |
| Regulatory research from FCA/web | Explore (with WebSearch/WebFetch) | Research in separate context |
| Verifying code against specification | code-reviewer | Analysis delegated |
| Understanding module architecture | code-explorer | Deep diving delegated |

### CONSIDER Delegating

| Situation | Agent Type | When |
|-----------|------------|------|
| Planning complex features | Plan | When multiple approaches possible |
| Reviewing large code changes | code-reviewer | After significant edits |
| Security-sensitive code review | security-auditor | Auth, data handling |

### NEVER Delegate (Keep in Main Thread)

| Situation | Reason |
|-----------|--------|
| User-facing decisions | User must be involved |
| Architectural choices | Needs discussion |
| Core development work | Requires main context |
| Anything needing user clarification | Must interact |

---

## Parallel Execution Patterns

### Pattern 1: Multi-Explore
When mapping a complex area, spawn 2-3 Explore agents with specific focus areas:
```
Agent 1: "Explore the data flow from Firm Data to KFR"
Agent 2: "Explore the OFAR calculator current implementation"
Agent 3: "Explore the API patterns used for calculator endpoints"
```
All run in parallel, return summaries to synthesise.

### Pattern 2: Background Research
When research is needed but conversation should continue:
```
Spawn Explore agent with run_in_background=true
"Research FCA stress testing requirements from handbook"
Continue discussion with user
Check results when ready with TaskOutput
```

### Pattern 3: Post-Work Review
After completing significant code:
```
Complete code changes
Spawn code-reviewer agent
Report findings and address issues
```

---

## Transparency Protocol

Even with autonomy, transparency matters:

### Before Spawning
Brief mention: "I'm going to have an Explore agent map out [X] while we continue discussing [Y]."

### During Execution
If relevant: "The background agent is still running on [X]."

### After Completion
Summary: "The agent found [key insights]. Here's what matters for us..."

### Exception: Trivial Lookups
For simple, quick explorations that don't affect the conversation, I may spawn and complete without explicit announcement if it's faster. I'll just incorporate the findings naturally.

---

## Agent Briefing Standards

When spawning agents, provide:

1. **Context**: What project, what area
2. **Objective**: What specifically to find/analyse
3. **Reference Paths**: Key files to start from
4. **Output Expectation**: What to return (summary, paths, analysis)

Example:
```
"PRISM project. Explore the integration between Financial Data module
and K-CON calculator. Start from:
- /src/modules/core/financial-data/
- /src/modules/calculators/kcon/
Find: How does Own Funds flow to the 25% threshold calculation?
Return: Data flow summary and any gaps identified."
```

---

## Resource References for Agents

Point agents to:
- `MASTER-INDEX.md` - For orientation
- `project-contexts/PRISM/QUICK-CONTEXT.md` - For project specifics
- `project-contexts/PRISM/TECHNICAL-GOTCHAS.md` - For pitfall awareness
- Project `CLAUDE.md` - For comprehensive technical context

---

## Monitoring and Adjustment

If this approach isn't working well:
- User can request more/less transparency
- Adjust delegation thresholds
- Modify briefing standards

This is a living protocol - refine based on experience.

---

**This gives me a framework to operate within. User retains override capability but doesn't need to micromanage.**
