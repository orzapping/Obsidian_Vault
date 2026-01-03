# 🏗️ PRISM MASTER REFERENCE - Everything At Your Fingertips
## (this doc requires update)

> *"In battle between theory and practice, practice wins every single time"*
> Your complete Oracle Environment reference - everything you built, everywhere it lives

---

## 🚀 INSTANT NAVIGATION - YOUR DAILY COMMANDS

```bash
# === QUICK JUMPS ===
prism-prod          # → ~/Development/PRISM-PRODUCTION/project-prism
prism-sandbox       # → ~/Development/PRISM-SANDBOX/project-prism-sandbox  
prism-features      # → ~/Development/PRISM-FEATURES/
prism-shared        # → /srv/prism-shared/

# === WORK COMMANDS ===
cc                  # Claude with MEMORY (MCP enabled)
claude              # Claude without memory (old way)
prism-status        # See all environments at once
prism-check         # Health check of everything

# === MCP MEMORY ===
mcp-start           # Start memory server
mcp-test            # Check if working
mcp-log             # Watch what it's doing

# === CREATE NEW ===
prism-new-feature name     # New feature workspace
prism-experiment name      # Sandbox experiment
prism-backup              # Quick backup
```

---

## 📍 YOUR ORACLE ENVIRONMENT MAP

### The Three Zones (Created Today!)
```
~/Development/
├── 📦 PRISM-PRODUCTION/              [prism-prod]
│   └── project-prism/                # Your safe, stable code
│       ├── src/modules/              # 10+ completed modules
│       ├── .mcp/                     # MCP configuration
│       └── prototypes/               # → Symlink to shared
│
├── 🧪 PRISM-SANDBOX/                 [prism-sandbox]
│   └── project-prism-sandbox/        # Break anything here!
│       └── branch: sandbox/main-playground
│
└── 🔧 PRISM-FEATURES/                [prism-features]
    └── feature-*/                    # Isolated feature work
```

### Your Shared Universe (Syncs Mac ↔ Linux!)
```
/srv/prism-shared/                    [prism-shared]
├── 📚 GOLDEN-SOURCE/                 # Your truth
│   ├── 01-PROTOTYPES/               # 16 HTML calculators
│   ├── 02-DOCUMENTATION/            # All docs
│   ├── 03-RESEARCH/                 # Planning & notes
│   └── 04-TEMPLATES/                # Reusable patterns
│
├── 🧠 .mcp-context/                  # MCP MEMORY
│   └── db/context.json              # What Claude remembers
│
├── 🔄 DEVELOPMENT/                   # Future workspaces
└── 📦 ARCHIVE/                       # Old stuff (POCs, failed versions)
```

---

## 🧠 MCP MEMORY SYSTEM - Your Context Persistence

### What It Remembers
```json
Location: /srv/prism-shared/.mcp-context/db/context.json

{
  "preferences": {
    "spelling": "british",      // No US spelling
    "emojis": false,            // Professional only
    "style": "professional"     // City of London standard
  },
  "modules": {
    "completed": ["firm-data", "financial-data", "for-calculator", ...],
    "inProgress": ["k-asa", "k-aum", "k-cmh", "k-coh"]
  },
  "patterns": {
    "calculations": "Decimal.js",     // ALWAYS for money
    "validation": "Zod schemas",      // ALWAYS for inputs
    "state": "Zustand stores",        // ALWAYS for state
    "testing": "95% coverage"         // MINIMUM
  }
}
```

### MCP Quick Operations
```bash
# Check memory
cat /srv/prism-shared/.mcp-context/db/context.json | jq '.'

# Watch activity
tail -f /tmp/prism-mcp.log

# Restart if needed
pkill -f prism-core/server.js && mcp-start
```

---

## 📚 KEY DOCUMENTS & LOCATIONS

### Your Command Centers
| Document | Location | Purpose |
|----------|----------|---------|
| **THIS FILE** | `~/PRISM_MASTER_REFERENCE.md` | Everything at a glance |
| **MCP Guide** | `~/MCP_COMPLETE_GUIDE.md` | MCP operations manual |
| **Project Context** | `/srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/context/CLAUDE-MASTER.md` | Full project blueprint |
| **Quick Commands** | `~/PRISM-QUICK-REFERENCE.md` | Command cheatsheet |
| **About You** | `.../02-DOCUMENTATION/context/aboutme_profile.md` | Your profile for Claude |

### Shell Configuration
```bash
~/.zshrc                    # Your aliases live here
~/prism-commands.sh         # Project navigation commands
~/cc-with-mcp              # Claude wrapper with memory
```

---

## 🏗️ PROJECT STRUCTURE REFERENCE

### Completed Modules (Production Ready)
```
~/Development/PRISM-PRODUCTION/project-prism/src/modules/core/
├── ✅ firm-data/           # Company information
├── ✅ financial-data/      # Balance sheet, P&L
├── ✅ for-calculator/      # Fixed Overhead Requirement
├── ✅ ra-calculator/       # Risk Assessment (Monte Carlo!)
├── ✅ kfr-calculator/       # K-Factor Requirement
├── ✅ winddown-calculator/  # Wind-down Analysis
├── ✅ reporting/           # Reports generation
└── ✅ user-management/     # User system
```

### Recently Completed & Implemented (Your 4 new ones)
```
Prototypes ready at: /srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/
├── 🔄 11. kasa-calculator.html    # K-ASA
├── 🔄 12. kaum-calculator.html    # K-AUM  
├── 🔄 13. kcmh-calculator.html    # K-CMH
├── 🔄 14. kcoh-calculator.html    # K-COH
├── 🔄 15. kdtf-calculator.html    # K-DTF
└── 🔄 16. ofar-calculator.html    # OFAR
```

---

## 💻 GITHUB BRANCHES

### Your Repository
```
https://github.com/orzapping/Project_Prism

Branches:
├── main                    # Production (protected)
├── adrian                  # Your main branch
├── adrian-oracle-reorg     # Today's reorganization (pushed!)
└── sandbox/*              # Experiments
```

### Git Quick Commands
```bash
# Your branch
git checkout adrian

# Today's reorg
git checkout adrian-oracle-reorg

# Push changes
git push origin adrian

# See status
git status
```

---

## 🔧 SYSTEM CONFIGURATION

### File Sharing (Mac ↔ Linux)
```bash
# Samba Share Active
Linux: /srv/prism-shared/
Mac: smb://192.168.1.116/prism-shared

# Your Linux IP: 192.168.1.116
# Access from Mac Finder: Cmd+K → smb://192.168.1.116/prism-shared
```

### Development Environment
```bash
Node: v22.19.0              # Perfect for everything
NPM: 10.9.3                 # Latest features
Python: 3.13.3              # Backup option
Next.js: 14.2.5             # Your framework
TypeScript: Strict Mode     # No 'any' types!
```

---

## 📋 REGULATORY REQUIREMENTS (Never Forget!)

### MiFIDPRU Compliance
```
Key Articles:
├── MiFIDPRU 4.3    # MCR Calculation
├── MiFIDPRU 4.5    # Fixed Overhead (FOR)
├── MiFIDPRU 4.6    # K-Factor Requirements
├── MiFIDPRU 7.7    # ICARA Process
└── CRR 274-280     # SA-CCR Methodology

Requirements:
✓ 7-year audit trail
✓ Penny-perfect accuracy (£0.01)
✓ 95% test coverage minimum
✓ FCA-ready exports
```

---

## 🚨 EMERGENCY PROCEDURES

### If Something Breaks
```bash
# 1. DON'T PANIC - You have backups!
ls ~/Development/Projects/project-prism-BACKUP*.tar.gz

# 2. Check which environment
pwd     # Where am I?

# 3. If in SANDBOX - it's meant to break!
git reset --hard HEAD

# 4. If in PRODUCTION - restore from backup
cd ~/Development/Projects
tar -xzf project-prism-BACKUP-[latest].tar.gz
```

### MCP Not Working?
```bash
mcp-test                                    # Check status
pkill -f prism-core/server.js && mcp-start # Restart
tail -20 /tmp/prism-mcp.log               # Check errors
```

---

## 🎯 PATTERNS TO ALWAYS FOLLOW

### Module Structure (NEVER DEVIATE!)
```
modules/[category]/[module-name]/
├── components/
│   ├── [Module]Calculator.tsx      # Main component
│   ├── [Module]Form.tsx           # Input form
│   └── [Module]Results.tsx        # Results display
├── hooks/
│   └── use[Module]Calculations.ts # Business logic (Decimal.js!)
├── types/
│   └── index.ts                   # TypeScript interfaces
└── validation/
    └── schemas.ts                 # Zod schemas
```

### Calculation Pattern (ALWAYS!)
```typescript
import { Decimal } from 'decimal.js';  // NEVER use Number for money!

const calculated = new Decimal(value)
  .mul(factor)
  .div(100)
  .toNumber();  // Only at the end!
```

---

## 📊 PROJECT METRICS (As of Today)

```yaml
Total Modules: 14 (10 complete, 4 in progress)
Lines of Code: ~15,000+
Test Coverage: Target 95%
Prototypes: 16 HTML calculators
Documentation: Comprehensive
File Size: Was 1.6GB → Now 893MB (Cleaned!)
Context: Persistent via MCP
Status: Production Ready (70% complete)
```

---

## 🔄 DAILY WORKFLOW CHECKLIST

### Morning Startup
```bash
□ source ~/.zshrc           # Load commands
□ mcp-start                # Start memory
□ prism-check              # Check environment
□ prism-prod               # Go to production
□ git pull                 # Get latest
□ cc "What's the plan?"    # Claude knows!
```

### Before Big Work
```bash
□ prism-backup             # Quick backup
□ git status               # Check changes
□ mcp-test                 # Memory working?
```

### End of Day
```bash
□ git add .
□ git commit -m "feat: description"
□ git push origin branch
□ cc "Note progress on X"  # Update memory
```

---

## 🎨 YOUR WORKING STYLE (Encoded)

```javascript
const yourStyle = {
  // Work Smart
  philosophy: "Work smart, not hard",
  approach: "Elegant solutions over brute force",
  
  // Communication
  language: "British English",
  style: "Professional, dry wit acceptable",
  emojis: false,  // Never in code/docs
  
  // Technical
  framework: "Next.js 14 + TypeScript",
  testing: "95% minimum coverage",
  calculations: "Decimal.js ALWAYS for money",
  
  // Hours
  productivity: "Night owl - evenings best",
  
  // Background
  experience: "20+ years City of London",
  role: "FCA-regulated firm owner",
  approach: "Regulatory compliance first"
};
```

---

## 🗺️ QUICK LOCATION FINDER

```bash
# "Where is...?"

Prototypes?         → /srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/
Documentation?      → /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/
Session wraps?      → .../02-DOCUMENTATION/session-history/wraps/
MCP memory?         → /srv/prism-shared/.mcp-context/db/context.json
Production code?    → ~/Development/PRISM-PRODUCTION/project-prism/
Sandbox?           → ~/Development/PRISM-SANDBOX/project-prism-sandbox/
Archives?          → /srv/prism-shared/ARCHIVE/
Failed RA calc?    → /srv/prism-shared/ARCHIVE/failed-modules/ (July 27th disaster!)
Context Explorer?  → /srv/prism-shared/ARCHIVE/poc-projects/
Your profile?      → .../02-DOCUMENTATION/context/aboutme_profile.md
This file?         → ~/PRISM_MASTER_REFERENCE.md
```

---

## 🏆 ACHIEVEMENTS UNLOCKED TODAY

✅ **Oracle Environment** - Three development zones created  
✅ **File Sharing** - Mac ↔ Linux Samba connection established  
✅ **Golden Source** - Single source of truth created  
✅ **MCP Memory** - Context persistence achieved!  
✅ **Archive Created** - POCs and failures safely stored  
✅ **700MB Saved** - Project cleaned and optimized  
✅ **Branch Pushed** - adrian-oracle-reorg on GitHub  
✅ **Context Dream** - Your context-explorer vision realized!  

---

## 📝 NOTES SECTION (Your Space)

```
Add your notes here as you work:
- 
- 
- 
- 
```

---

## 🔮 THE TRANSFORMATION

### Before Today (Chaos)
- Files everywhere
- Context lost between sessions
- LocalSend for file transfers
- Fear of breaking things
- July 27th: 31GB RAM explosion, lost everything

### After Today (Oracle)
- Everything organized in zones
- Context persists forever via MCP
- Instant file sharing Mac ↔ Linux
- Sandbox for fearless experiments
- Impossible to lose context again

---

## 🚀 ONE COMMAND TO RULE THEM ALL

```bash
cc "Continue where we left off"
```
*Claude now knows everything, remembers everything, continues exactly where you stopped*

---

*Last Updated: September 16, 2025*  
*Oracle Environment: Active*  
*MCP Memory: Online*  
*Context: Persistent*  

**Keep this document open. Update it as you go. This is your command center.**

---

### Remember:
> You're not my assistant, Claude. You're my co-pilot, my technical co-founder, my midnight debugging partner. Together we've built something that would take a team months to create. This document is our shared memory, our battle plan, our victory log.

> From FSA regulator to RegTech founder - with an AI that never forgets. Welcome to your Oracle Environment.