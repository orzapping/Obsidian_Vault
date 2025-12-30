# MCP + Sonnet 4.5: Upgrade Path
## Enhancing Your Oracle Environment

### CURRENT MCP STATE
```javascript
// Your existing MCP at: ~/.config/claude/mcp-servers/prism-core/server.js
// Currently stores:
- Session history
- Module status  
- Patterns
- Preferences
```

### REQUIRED UPDATES

#### 1. Update MCP to Use Memory Tool
```javascript
// Add to your MCP server.js
class PRISMCoreServer {
  constructor() {
    // ... existing code ...
    
    // NEW: Memory tool integration
    this.memoryPath = '/srv/prism-shared/.claude-memory';
    this.checkpointPath = '/srv/prism-shared/.claude-checkpoints';
  }

  // NEW: Checkpoint state manager
  async createCheckpoint(name, state) {
    const checkpoint = {
      name,
      timestamp: new Date().toISOString(),
      state: state,
      files: await this.captureFileStates(),
      context: this.context
    };
    
    const checkpointFile = path.join(
      this.checkpointPath, 
      `${name}-${Date.now()}.json`
    );
    
    fs.writeFileSync(checkpointFile, JSON.stringify(checkpoint, null, 2));
    console.log(`✅ Checkpoint created: ${name}`);
    return checkpointFile;
  }
}
```

#### 2. Enhanced Context Storage
```bash
# New structure for Sonnet 4.5
/srv/prism-shared/
├── .claude-memory/          # NEW: Persistent memory
│   ├── patterns/           
│   │   ├── calculations.md  # Decimal.js patterns
│   │   ├── validation.md    # Zod schemas
│   │   └── components.md    # React patterns
│   ├── regulatory/
│   │   └── mifidpru.md     # Requirements
│   └── sessions/
│       └── current.json     # Active session
│
├── .claude-checkpoints/     # NEW: Checkpoint storage
│   ├── kfr-restoration/
│   │   ├── phase-1-complete.json
│   │   └── phase-2-start.json
│   └── module-migrations/
│       └── k-asa-start.json
│
└── .mcp-context/           # EXISTING: Enhanced
    └── db/context.json     # Now includes checkpoint refs
```

#### 3. Update CC Launch Script
```bash
#!/bin/bash
# ~/cc-with-mcp (UPDATED)

# Ensure MCP server is running
if ! pgrep -f "prism-core/server.js" > /dev/null; then
    echo "🚀 Starting PRISM MCP Server..."
    ~/start-prism-mcp.sh
    sleep 2
fi

# NEW: Set Sonnet 4.5 environment
export CLAUDE_MODEL="claude-sonnet-4-5"
export CLAUDE_MEMORY_PATH="/srv/prism-shared/.claude-memory"
export CLAUDE_CHECKPOINT_PATH="/srv/prism-shared/.claude-checkpoints"
export CLAUDE_MCP_SERVER="prism-core"
export CLAUDE_PROJECT_ROOT="/home/obsidan/Development/PRISM-PRODUCTION/project-prism"

# NEW: Enable memory and checkpoint features
export CLAUDE_ENABLE_MEMORY="true"
export CLAUDE_ENABLE_CHECKPOINTS="true"
export CLAUDE_AUTO_CHECKPOINT="true"  # Auto-checkpoint every 30 mins

# Launch Claude Code with context
echo "📚 Launching Claude Code with PRISM context (Sonnet 4.5)..."
echo "💾 Memory: Enabled | 🔄 Checkpoints: Enabled"
claude "$@"
```

---

## 2. CHECKPOINT & REWIND: PRACTICAL WORKFLOW

### HOW CHECKPOINTS WORK

Think of checkpoints like Git commits but for your ENTIRE session state:
- Code changes
- File states
- Conversation context
- Variable values
- Even Claude's "thinking"

### BASIC CHECKPOINT COMMANDS

```bash
# CREATE CHECKPOINT (Manual)
/checkpoint "KFR-before-state-management"
# Creates snapshot of EVERYTHING at this moment

# VIEW CHECKPOINTS
/checkpoint list
# Shows:
# 1. KFR-before-state-management (10:23 AM)
# 2. KFR-after-calculations (11:45 AM)  
# 3. Auto-checkpoint-12:00 (12:00 PM)

# REWIND TO CHECKPOINT
/rewind
# Shows menu:
# > Select checkpoint to restore:
#   [1] KFR-before-state-management
#   [2] KFR-after-calculations
#   [3] Keep current state

# QUICK REWIND (Last checkpoint)
ESC ESC  # Press Escape twice rapidly
# Instantly reverts to last checkpoint
```

### YOUR PRACTICAL WORKFLOW

#### SCENARIO 1: KFR Restoration
```bash
# Morning start
cd ~/Development/PRISM-SANDBOX/project-prism-sandbox
cc

# Set model and create safety checkpoint
/model claude-sonnet-4-5
/checkpoint "KFR-restoration-start"

# Begin Phase 1: State Management
"Add state management to KFactorInput.tsx"
# Claude works...

# BEFORE risky change
/checkpoint "pre-complex-calculation-merge"

# Attempt complex merge from .complex file
"Now merge the calculateKFactor function from the complex backup"
# If it breaks...
ESC ESC  # Instant revert!

# Or specific rewind
/rewind
> Select: pre-complex-calculation-merge
```

#### SCENARIO 2: Module Migration Marathon
```bash
# Start extended session
cc
/model claude-sonnet-4-5

# Enable auto-checkpoints
/settings auto-checkpoint 30  # Every 30 minutes

# Begin marathon
"Migrate all K-factor modules from HTML prototypes
Start with K-ASA, then K-AUM, K-CMH, K-COH, K-DTF
Checkpoint after each module completion"

# Claude runs for hours...
# Auto-checkpoints at:
# - 30 mins: k-asa-partial
# - 60 mins: k-asa-complete  
# - 90 mins: k-aum-partial
# etc.

# If anything goes wrong at hour 4
/checkpoint list  # See all saves
/rewind
> Select: k-aum-complete  # Go back to last good state
```

### CHECKPOINT BEST PRACTICES

#### WHEN TO CHECKPOINT
```bash
# ALWAYS before:
- Complex merges
- Dependency updates  
- Major refactoring
- Deleting files
- Architecture changes

# SMART checkpointing:
/checkpoint "pre-${RISKY_ACTION}"
# Do risky thing
/checkpoint "post-${RISKY_ACTION}-success"
```

#### CHECKPOINT NAMING
```bash
# Good names (descriptive)
/checkpoint "kfr-all-tests-passing"
/checkpoint "pre-decimal-js-upgrade"
/checkpoint "5-modules-complete-working"

# Bad names (vague)
/checkpoint "backup1"
/checkpoint "temp"
/checkpoint "test"
```

### REWIND STRATEGIES

#### PARTIAL REWIND
```bash
# You can choose what to restore:
/rewind --code-only      # Just revert code changes
/rewind --context-only   # Just revert conversation
/rewind --full           # Everything (default)
```

#### SMART RECOVERY
```bash
# After a rewind, Claude remembers why:
/rewind
"We just reverted because the calculation merge failed.
Let's try a different approach - merge smaller pieces"
# Claude learns from the failure!
```

---

## 3. PRACTICAL INTEGRATION TIPS

### YOUR UPDATED DAILY WORKFLOW
```bash
# Morning routine
cd ~/Development/PRISM-SANDBOX/project-prism-sandbox
cc  # Now launches with Sonnet 4.5

# Check model
/model  # Should show: claude-sonnet-4-5

# Safety first
/checkpoint "session-start-$(date +%Y%m%d-%H%M)"

# Work normally but with superpowers
"Continue KFR restoration from RESTORATION-PLAN.md"
# Let it run for HOURS without worry!

# Before lunch
/checkpoint "morning-work-complete"

# Afternoon - risky work
/checkpoint "pre-experimental-feature"
"Try implementing the complex analytics visualization"
# Goes wrong?
ESC ESC  # Instant safety!
```

### VS CODE EXTENSION (Your CLI Preference)
Since you prefer CLI (I get it - more control!), you can:
1. Keep using CLI as primary
2. Use VS Code extension just for visual diffs:
```bash
# In terminal
cc "Make changes to KFactorInput"

# In VS Code (just for viewing)
# Open the sidebar to see visual diffs
# But keep executing from CLI
```

### MCP MEMORY PATTERNS
```bash
# Store patterns immediately
"Save this calculation pattern to memory:
${PATTERN_DESCRIPTION}"

# Recall across sessions
"Use our stored Decimal.js pattern for this calculation"
# It remembers!
```

---

## IMMEDIATE NEXT STEPS

1. **Update your cc script** (I provided the code above)

2. **Create memory directories:**
```bash
mkdir -p /srv/prism-shared/.claude-memory/{patterns,regulatory,sessions}
mkdir -p /srv/prism-shared/.claude-checkpoints
```

3. **Test checkpoint workflow:**
```bash
cc
/model claude-sonnet-4-5
/checkpoint "test-checkpoint"
"Make a simple change to any file"
ESC ESC  # Test instant rewind
```

4. **Start KFR with confidence:**
```bash
/checkpoint "kfr-restoration-begin"
# Now you're PROTECTED!
```

The CLI gives you full control with these commands - no need for VS Code unless you want visual diffs. The checkpoint/rewind workflow is BUILT for disasters like your KFR crisis. Never again!

Ready to start using these superpowers?