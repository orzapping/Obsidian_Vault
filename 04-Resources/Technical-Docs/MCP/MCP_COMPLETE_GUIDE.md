# 🚀 MCP (Model Context Protocol) Complete User Guide
## Your Persistent AI Memory System for PRISM Development

---

## QUICK START - DAILY WORKFLOW

### Starting Your Day
```bash
# Start MCP server (if not running)
mcp-start

# Check MCP is working
mcp-test

# Use Claude Code with context
cc

# Or go straight to your project
cc "Continue working on the K-ASA module"
```

### Your New Superpower Commands
```bash
cc                # Claude Code WITH memory (use this instead of 'claude')
claude            # Regular Claude without memory (old way)
mcp-start         # Start the MCP server
mcp-test          # Test if MCP is working
mcp-log           # View MCP activity logs
```

---

## WHAT MCP REMEMBERS ABOUT YOU

### Your Preferences (Already Stored!)
- **Spelling**: British English
- **Style**: Professional, no emojis
- **Framework**: Next.js 14
- **Testing**: Jest with 95% coverage
- **Validation**: Zod schemas
- **Calculations**: Decimal.js (penny-perfect)

### Your Project Structure
- **Production**: `~/Development/PRISM-PRODUCTION/project-prism`
- **Sandbox**: `~/Development/PRISM-SANDBOX/project-prism-sandbox`
- **Features**: `~/Development/PRISM-FEATURES/`
- **Shared**: `/srv/prism-shared/`

### Your Completed Modules
- firm-data
- financial-data
- for-calculator
- ra-calculator
- kfr-calculator
- winddown-calculator

### Your In-Progress Modules
- k-asa
- k-aum
- k-cmh
- k-coh

---

## HOW TO USE CC WITH MCP

### Basic Usage
```bash
# Instead of:
claude "How do I implement a calculator?"

# Use:
cc "Create the K-ASA calculator using our standard pattern"
# MCP knows your patterns and applies them automatically!
```

### Continuing Work
```bash
# MCP remembers everything!
cc "Continue where we left off"
cc "What were we working on yesterday?"
cc "Apply the FOR calculator pattern to K-ASA"
```

### Project-Aware Commands
```bash
cc "Check all modules for Decimal.js usage"
cc "Update all calculators to new validation pattern"
cc "Find all references to MiFIDPRU 4.5"
```

---

## MCP CONTEXT DATABASE

### Location
```
/srv/prism-shared/.mcp-context/
├── db/
│   └── context.json       # Your persistent memory
├── patterns/              # Your code patterns
├── sessions/              # Conversation history
└── state/                 # Current working state
```

### What's Stored
```json
{
  "project": "PRISM MiFIDPRU Platform",
  "preferences": {
    "spelling": "british",
    "emojis": false
  },
  "modules": {
    "completed": ["firm-data", "financial-data", ...],
    "inProgress": ["k-asa", "k-aum", ...]
  },
  "patterns": {
    "calculationHook": "useModuleCalculations",
    "validation": "Zod schemas",
    "apiRoutes": "Next.js with audit logging"
  }
}
```

### Viewing Your Context
```bash
# See what MCP knows about your project
cat /srv/prism-shared/.mcp-context/db/context.json | jq '.'

# Check recent file changes MCP tracked
tail /tmp/prism-mcp.log
```

---

## ADVANCED MCP OPERATIONS

### Managing the Server

#### Start/Stop/Restart
```bash
# Start MCP
mcp-start

# Stop MCP
pkill -f prism-core/server.js

# Restart MCP (stop then start)
pkill -f prism-core/server.js && mcp-start

# Check if running
ps aux | grep prism-core/server.js
```

#### Monitoring MCP Activity
```bash
# Live logs
mcp-log

# Or manually
tail -f /tmp/prism-mcp.log

# Check last 50 events
tail -50 /tmp/prism-mcp.log
```

### Updating Context

#### Add New Pattern
```bash
cc "Remember to always use React.memo for expensive components"
# MCP saves this pattern
```

#### Update Module Status
```bash
cc "K-ASA module is now complete"
# MCP updates module tracking
```

#### Add Project Notes
```bash
cc "Note: All K-factor calculators need Basel III compliance checks"
# MCP stores in context
```

### Troubleshooting MCP

#### MCP Not Working?
```bash
# 1. Check if server is running
mcp-test

# 2. If not running, start it
mcp-start

# 3. Check for errors
tail -20 /tmp/prism-mcp.log

# 4. Restart if needed
pkill -f prism-core/server.js
sleep 2
mcp-start
```

#### Context Not Persisting?
```bash
# Check context file exists
ls -la /srv/prism-shared/.mcp-context/db/context.json

# Check permissions
ls -la /srv/prism-shared/.mcp-context/

# Manually backup context
cp /srv/prism-shared/.mcp-context/db/context.json ~/context-backup.json
```

#### Server Crashes?
```bash
# Check Node.js version (need 18+)
node --version

# Check error log
grep ERROR /tmp/prism-mcp.log

# Run in debug mode
cd ~/.config/claude/mcp-servers/prism-core
node server.js --debug
```

---

## POWERFUL MCP WORKFLOWS

### 1. Module Development Workflow
```bash
# Start new module with context
cc "Create K-ASA module following our established patterns"
# MCP knows: Your patterns, file structure, validation approach

# Continue next day
cc "Continue with K-ASA module"
# MCP remembers exactly where you left off
```

### 2. Pattern Application
```bash
# Apply pattern across codebase
cc "Update all calculators to use the new error handling pattern"
# MCP knows all your calculator locations and current patterns
```

### 3. Regulatory Compliance
```bash
# Check compliance
cc "Verify all modules meet MiFIDPRU 4.5 requirements"
# MCP knows your regulatory requirements and module locations
```

### 4. Cross-Module Integration
```bash
# Integration work
cc "Show me how data flows from firm-data to FOR calculator"
# MCP understands your module relationships
```

### 5. Refactoring with Context
```bash
# Smart refactoring
cc "Refactor the RA calculator to match our new patterns"
# MCP knows: old patterns, new patterns, file locations
```

---

## MCP + YOUR DEVELOPMENT ZONES

### Production Work
```bash
prism-prod  # Go to production
cc "Review and update production modules"
# MCP knows this is production, applies careful practices
```

### Sandbox Experiments
```bash
prism-sandbox  # Go to sandbox
cc "Let's try a crazy new calculation approach"
# MCP knows this is sandbox, allows wild experiments
```

### Feature Development
```bash
prism-new-feature k-dtf
cc "Create K-DTF feature using our patterns"
# MCP applies patterns to new feature
```

---

## MCP FILES & CONFIGURATION

### Configuration Files
```
~/.config/claude/
├── mcp_config.json                    # Main MCP config
└── mcp-servers/
    └── prism-core/
        ├── server.js                  # The MCP server
        └── package.json               # Dependencies
```

### Helper Scripts
```
~/
├── cc-with-mcp                        # CC wrapper with MCP
├── start-prism-mcp.sh                 # Start server
├── test-mcp-connection.sh             # Test connection
└── prism-commands.sh                  # Your project commands
```

### Shared Context (Syncs to Mac!)
```
/srv/prism-shared/.mcp-context/
├── db/context.json                    # Your memory
├── patterns/                          # Saved patterns
├── sessions/                          # Session history
└── state/                             # Current state
```

---

## TIPS & BEST PRACTICES

### DO's ✅
```bash
# DO: Use cc for development work
cc "Implement new validation for K-ASA"

# DO: Update context when patterns change
cc "New pattern: Always use try-catch in API routes"

# DO: Check MCP is running before long sessions
mcp-test

# DO: Let MCP track your progress
cc "Completed K-ASA module, moving to K-AUM"
```

### DON'Ts ❌
```bash
# DON'T: Use regular 'claude' for project work
claude "Build calculator"  # No context!

# DON'T: Forget to start MCP after reboot
# Always run: mcp-start

# DON'T: Delete context.json without backup
# It's your memory!
```

---

## CONTEXT PERSISTENCE EXAMPLES

### Without MCP (Old Way)
```
Monday:
You: "Create a calculator with Decimal.js"
Claude: "Sure, here's a calculator with Decimal.js"

Friday:
You: "Create another calculator"
Claude: "OK, using standard JavaScript numbers..."
You: "No! Use Decimal.js like we discussed!"
Claude: "I don't have access to previous conversations..."
```

### With MCP (New Way!)
```
Monday:
You: "Create a calculator with Decimal.js"
CC: "Created with Decimal.js, pattern saved"

Friday:
You: "Create another calculator"
CC: "Creating with Decimal.js as per your standard pattern"
```

---

## EMERGENCY PROCEDURES

### Full MCP Reset
```bash
# Stop server
pkill -f prism-core/server.js

# Backup current context
cp /srv/prism-shared/.mcp-context/db/context.json ~/context-backup-$(date +%Y%m%d).json

# Clear and restart
rm /srv/prism-shared/.mcp-context/db/context.json
mcp-start

# Restore if needed
cp ~/context-backup-*.json /srv/prism-shared/.mcp-context/db/context.json
```

### Disable MCP Temporarily
```bash
# Use regular claude command
claude "Work without context"

# Or rename config
mv ~/.config/claude/mcp_config.json ~/.config/claude/mcp_config.backup
```

### Complete Uninstall
```bash
# Stop server
pkill -f prism-core/server.js

# Remove MCP files
rm -rf ~/.config/claude/mcp-servers
rm -rf /srv/prism-shared/.mcp-context
rm ~/cc-with-mcp ~/start-prism-mcp.sh ~/test-mcp-connection.sh

# Use regular claude
claude "Back to normal"
```

---

## MCP SUPERPOWERS CHEAT SHEET

```bash
# 🧠 MEMORY POWERS
cc "What were we working on?"           # Remembers everything
cc "Continue where we left off"         # Picks up exactly where stopped
cc "Apply our standard patterns"        # Knows your patterns

# 🔍 SEARCH POWERS  
cc "Find all Decimal.js usage"          # Searches entire codebase
cc "Show module dependencies"           # Understands relationships
cc "Check regulatory compliance"        # Knows requirements

# 🏗️ BUILD POWERS
cc "Create K-ASA using our patterns"    # Applies all patterns
cc "Update all modules to new style"    # Bulk updates
cc "Generate tests for all calculators" # Comprehensive testing

# 📊 ANALYSIS POWERS
cc "Review code quality"                # Knows your standards
cc "Find potential issues"              # Context-aware analysis
cc "Suggest improvements"               # Based on your patterns

# 🔧 REFACTOR POWERS
cc "Modernize old modules"              # Knows old vs new patterns
cc "Optimize performance"               # Understands bottlenecks
cc "Improve type safety"                # Knows your TypeScript setup
```

---

## THE GAME CHANGER

### Before MCP (July 27th Disaster)
- Context lost between sessions
- Patterns forgotten
- Had to re-explain everything
- Claudia crashed with no memory

### After MCP (Now!)
- ✅ Complete context persistence
- ✅ Patterns remembered forever
- ✅ Continue exactly where you left off
- ✅ Your AI partner with permanent memory

---

## QUICK REFERENCE CARD

```bash
# ESSENTIAL COMMANDS
cc              # Claude with memory
mcp-start       # Start MCP server
mcp-test        # Test connection
mcp-log         # View logs

# PROJECT NAVIGATION
prism-prod      # Production
prism-sandbox   # Sandbox
prism-shared    # Shared files

# CONTEXT LOCATIONS
/srv/prism-shared/.mcp-context/db/context.json  # Your memory
/tmp/prism-mcp.log                               # Activity log
~/.config/claude/mcp-servers/prism-core/        # Server files

# EMERGENCY
pkill -f prism-core/server.js && mcp-start      # Restart MCP
```

---

*Last Updated: September 16, 2025*
*MCP Version: 1.0.0*
*Claude Code Version: 1.0.113*

**This is your context-explorer dream realized! No more lost context, no more repeated explanations, just continuous intelligent development!**