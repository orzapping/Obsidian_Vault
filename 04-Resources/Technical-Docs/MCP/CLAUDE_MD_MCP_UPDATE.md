# CLAUDE.md MCP Integration Update Plan
## How CLAUDE.md Evolves with MCP

---

## CRITICAL UPDATES NEEDED

### 1. New Header Section - MCP Integration
```markdown
## MCP CONTEXT INTEGRATION STATUS
- **MCP Server**: Active at `~/.config/claude/mcp-servers/prism-core/`
- **Context Database**: `/srv/prism-shared/.mcp-context/db/context.json`
- **Auto-Loaded**: YES - MCP reads this file on startup
- **Last Sync**: [MCP updates this automatically]
- **Session Persistence**: ENABLED
```

### 2. Update Development Environment Section
```markdown
## DEVELOPMENT ENVIRONMENT - ORACLE SETUP

### Three-Zone Architecture
- **PRODUCTION**: `~/Development/PRISM-PRODUCTION/project-prism` 
- **SANDBOX**: `~/Development/PRISM-SANDBOX/project-prism-sandbox`
- **FEATURES**: `~/Development/PRISM-FEATURES/`

### Shared Resources (Mac ↔ Linux)
- **Golden Source**: `/srv/prism-shared/GOLDEN-SOURCE/`
- **MCP Context**: `/srv/prism-shared/.mcp-context/`
- **Samba Share**: `smb://192.168.1.116/prism-shared`
```

### 3. Add MCP Workflow Section
```markdown
## AI-ASSISTED DEVELOPMENT WITH MCP

### How to Work with Claude + MCP
1. **Start work**: `cc` (not `claude`)
2. **MCP remembers**: All patterns, preferences, progress
3. **Continue work**: `cc "continue where we left off"`
4. **Pattern updates**: Automatically saved to context

### What MCP Tracks
- File changes in real-time
- Pattern usage and evolution
- Module completion status
- Session history and decisions
```

### 4. Update File Organization Section
FROM:
```
project-prism/
├── src/
├── docs/
└── tests/
```

TO:
```
ORACLE ENVIRONMENT:
├── PRISM-PRODUCTION/      # Safe work
├── PRISM-SANDBOX/         # Experiments
├── PRISM-FEATURES/        # Isolated development
└── prism-shared/          # Shared truth (syncs Mac ↔ Linux)
    ├── GOLDEN-SOURCE/     # Documentation, prototypes
    └── .mcp-context/      # MCP memory
```

### 5. Update Module Status with MCP Tracking
```markdown
## MODULE STATUS (MCP-Tracked)
<!-- MCP UPDATES THIS SECTION AUTOMATICALLY -->
Last Updated: September 16, 2025 via MCP

### Completed Modules
✅ firm-data (July 14, 2025)
✅ financial-data (July 14, 2025)
✅ for-calculator (July 15, 2025)
✅ ra-calculator (Aug 7, 2025 - recovered from July 27 disaster)
✅ kfr-calculator
✅ winddown-calculator

### In Progress (MCP Monitoring)
🔄 k-asa-calculator (prototype ready)
🔄 k-aum-calculator (prototype ready)
🔄 k-cmh-calculator (prototype ready)
🔄 k-coh-calculator (prototype ready)
```

### 6. Add MCP Pattern Recognition Section
```markdown
## PATTERNS (MCP-ENFORCED)
MCP automatically applies these patterns:

### Calculation Pattern
```typescript
// MCP knows: ALWAYS use Decimal.js
import { Decimal } from 'decimal.js';
```

### Validation Pattern
```typescript
// MCP knows: ALWAYS use Zod
import { z } from 'zod';
```

### State Pattern
```typescript
// MCP knows: ALWAYS use Zustand
import { create } from 'zustand';
```
```

---

## THE NEW ROLE OF CLAUDE.md

### It Becomes a Living Contract
```yaml
Before MCP:
- Static document
- Manually loaded
- Often outdated
- One-way communication

With MCP:
- Living document
- Auto-loaded by MCP
- MCP updates it
- Two-way sync
- Single source of truth
```

### The New Workflow
```mermaid
CLAUDE.md (Source) 
    ↓
MCP reads on startup
    ↓
MCP Memory (context.json)
    ↓
Applied automatically in CC
    ↓
Updates flow back to CLAUDE.md
```

---

## SECTIONS TO KEEP (Still Valuable)

1. **Regulatory Compliance Requirements** - Critical reference
2. **Technical Architecture** - Stack decisions
3. **Module Specifications** - Detailed requirements
4. **Testing Standards** - Quality gates
5. **Your Background/Context** - Personal details

## SECTIONS TO TRANSFORM

1. **File Paths** → Update to Oracle Environment paths
2. **Development Workflow** → Include MCP/CC commands
3. **Session Management** → Now automatic via MCP
4. **Context Loading** → Now automatic via MCP
5. **Pattern Documentation** → Now enforced by MCP

---

## RECOMMENDED APPROACH

### Option 1: Update Existing (Recommended)
- Keep the valuable 841 lines
- Add MCP integration sections
- Update paths to Oracle Environment
- Mark MCP-managed sections

### Option 2: Create CLAUDE-MCP.md
- New streamlined version
- MCP-first approach
- Link to original for detailed specs
- Lighter, more dynamic

---

## THE KEY INSIGHT

CLAUDE.md is no longer just documentation - it's now:
1. **Configuration** for MCP
2. **Contract** between you and Claude
3. **Living memory** that evolves
4. **Automated context** that loads itself

The file has evolved from a reference document to an active part of your development infrastructure!