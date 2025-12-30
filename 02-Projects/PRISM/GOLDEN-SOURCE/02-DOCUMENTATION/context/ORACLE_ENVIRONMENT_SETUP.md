# Oracle Environment Setup - Complete Infrastructure Plan
## Unified Development Environment Across Mac & Linux with MCP Integration

---

## PHASE 0: INFRASTRUCTURE FOUNDATION (PRIORITY 1)
*Must be completed before any file reorganization*

### A. Cross-Machine File Sharing Setup

#### Option 1: Network File System (NFS) - RECOMMENDED
```bash
# ON LINUX (Server):
# Install NFS server
sudo apt update
sudo apt install nfs-kernel-server

# Create shared directory
sudo mkdir -p /srv/prism-shared
sudo chown obsidan:obsidan /srv/prism-shared

# Configure exports
echo "/srv/prism-shared *(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports
sudo exportfs -a
sudo systemctl restart nfs-kernel-server

# ON MAC (Client):
# Create mount point
sudo mkdir -p /Volumes/prism-shared

# Mount NFS share (replace IP with Linux machine IP)
sudo mount -t nfs 192.168.1.XXX:/srv/prism-shared /Volumes/prism-shared

# Make permanent in /etc/fstab
echo "192.168.1.XXX:/srv/prism-shared /Volumes/prism-shared nfs resvport,rw 0 0" | sudo tee -a /etc/fstab
```

#### Option 2: Syncthing - Real-time Sync
```bash
# Install on both machines
# Linux:
sudo apt install syncthing

# Mac:
brew install syncthing

# Configure shared folders for:
# - /home/obsidan/Development/Projects
# - /home/obsidan/Documents/PRISM-Work
```

### B. Unified Project Structure
```
SHARED NETWORK LOCATION:
/srv/prism-shared/ (Linux) ↔ /Volumes/prism-shared/ (Mac)
├── 📁 GOLDEN-SOURCE/              # Single source of truth
│   ├── documentation/             # All project docs
│   ├── prototypes/                # HTML prototypes
│   ├── research/                  # Research materials
│   └── architecture/              # System design docs
├── 📁 DEVELOPMENT/               # Active development
│   ├── prism-main/               # Main branch
│   ├── prism-sandbox/            # Experimentation
│   └── prism-feature-*/          # Feature branches
└── 📁 ARCHIVE/                   # Historical materials
```

---

## PHASE 1: GOLDEN SOURCE REPOSITORY SETUP

### Directory Structure for Golden Source
```
/srv/prism-shared/GOLDEN-SOURCE/
├── 📁 01-PROTOTYPES/              # All HTML prototypes
│   ├── approved-for-production/  # Ready for TypeScript conversion
│   │   ├── core-modules/         # Original core calculators
│   │   │   ├── firm-data.html
│   │   │   ├── financial-data.html
│   │   │   ├── for-calculator.html
│   │   │   ├── ra-calculator.html
│   │   │   └── kfr-calculator.html
│   │   └── new-modules/          # Your 4 new approved modules
│   │       ├── [module-1].html
│   │       ├── [module-2].html
│   │       ├── [module-3].html
│   │       └── [module-4].html
│   ├── experimental/             # Testing/POC prototypes
│   └── archive/                  # Old versions
│
├── 📁 02-DOCUMENTATION/           # All documentation
│   ├── project-context/          # Core project docs
│   │   ├── CLAUDE.md            # Main AI context
│   │   ├── aboutme_profile.md   # Your profile
│   │   └── mcp-strategy.md      # MCP plans
│   ├── regulatory/               # FCA/MiFIDPRU docs
│   ├── technical/                # Technical specs
│   ├── session-history/          # Development history
│   └── decisions/                # Architectural decisions
│
├── 📁 03-RESEARCH/                # Research materials
│   ├── regulatory-updates/
│   ├── market-analysis/
│   └── technical-research/
│
└── 📁 04-TEMPLATES/               # Reusable templates
    ├── module-templates/
    ├── test-templates/
    └── documentation-templates/
```

### Migration Commands
```bash
# Create Golden Source structure
mkdir -p /srv/prism-shared/GOLDEN-SOURCE/{01-PROTOTYPES,02-DOCUMENTATION,03-RESEARCH,04-TEMPLATES}

# Copy prototypes from Mac (after file sharing setup)
cp /Volumes/mac-share/new-modules/*.html /srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/approved-for-production/new-modules/

# Copy existing prototypes from Linux project
cp ~/Development/Projects/project-prism/dashboard/*.html /srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/approved-for-production/core-modules/
```

---

## PHASE 2: GIT REPOSITORY REORGANIZATION

### A. Branch Strategy
```
main                    # Production-ready code only
├── develop            # Integration branch
├── feature/*          # Feature development
├── sandbox/*          # Experimentation
└── archive/*          # Historical branches
```

### B. Repository Structure
```
project-prism/
├── .github/
│   ├── workflows/         # CI/CD
│   └── CODEOWNERS        # Code ownership
├── .mcp/                  # MCP configuration
├── src/                   # Source code
├── docs/                  # Project documentation
├── prototypes/            # Symlink to GOLDEN-SOURCE
├── tests/                 # Test suites
└── infrastructure/        # DevOps configs
```

### C. Git Setup Commands
```bash
# Setup main repository
cd ~/Development/Projects/project-prism
git checkout main
git pull origin main

# Create develop branch
git checkout -b develop
git push -u origin develop

# Create sandbox for experimentation
git checkout -b sandbox/experimental-main
git push -u origin sandbox/experimental-main

# Setup branch protection (on GitHub)
# - Protect main branch
# - Require PR reviews
# - Enable status checks
```

---

## PHASE 3: LOCAL DEVELOPMENT ENVIRONMENT

### A. Main Development Structure (Linux & Mac)
```
~/Development/
├── 📁 PRISM-PRODUCTION/           # Main branch work
│   └── project-prism/             # Git repo (main/develop)
├── 📁 PRISM-SANDBOX/              # Safe experimentation
│   └── project-prism-sandbox/    # Git repo (sandbox/*)
├── 📁 PRISM-FEATURES/             # Feature development
│   ├── feature-module-x/         # Individual features
│   └── feature-module-y/
└── 📁 PRISM-GOLDEN -> /srv/prism-shared/GOLDEN-SOURCE/  # Symlink
```

### B. Setup Commands
```bash
# Create development structure
mkdir -p ~/Development/{PRISM-PRODUCTION,PRISM-SANDBOX,PRISM-FEATURES}

# Clone for production
cd ~/Development/PRISM-PRODUCTION
git clone git@github.com:yourusername/project-prism.git
cd project-prism
git checkout main

# Clone for sandbox
cd ~/Development/PRISM-SANDBOX
git clone git@github.com:yourusername/project-prism.git project-prism-sandbox
cd project-prism-sandbox
git checkout -b sandbox/experimental

# Create symlink to Golden Source
ln -s /srv/prism-shared/GOLDEN-SOURCE ~/Development/PRISM-GOLDEN
```

---

## PHASE 4: MCP SERVER INTEGRATION

### A. MCP Configuration for Multi-Machine Setup
```json
{
  "servers": {
    "prism-core": {
      "path": "./servers/core-server.js",
      "config": {
        "goldenSource": "/srv/prism-shared/GOLDEN-SOURCE",
        "development": "~/Development/PRISM-PRODUCTION/project-prism",
        "sandbox": "~/Development/PRISM-SANDBOX/project-prism-sandbox"
      }
    },
    "prism-sync": {
      "path": "./servers/sync-server.js",
      "config": {
        "machines": ["linux", "mac"],
        "syncPaths": [
          "/srv/prism-shared/GOLDEN-SOURCE",
          "/Volumes/prism-shared/GOLDEN-SOURCE"
        ]
      }
    }
  }
}
```

### B. Context Persistence Setup
```javascript
// MCP Core Server - Complete Context Management
class PRISMCoreServer {
  async loadCompleteContext() {
    const context = {
      goldenSource: await this.loadGoldenSource(),
      currentProject: await this.loadProjectState(),
      sandbox: await this.loadSandboxState(),
      crossMachine: await this.syncMachineStates()
    };
    return context;
  }
  
  async persistContext(context) {
    // Save to both machines
    await this.saveToLinux(context);
    await this.saveToMac(context);
    await this.saveToCloud(context);
  }
}
```

---

## PHASE 5: SANDBOX ENVIRONMENT SETUP

### A. Sandbox Structure
```
~/Development/PRISM-SANDBOX/project-prism-sandbox/
├── .sandbox/                      # Sandbox-specific config
│   ├── experiments.log           # Track experiments
│   ├── rollback-points/          # Saved states
│   └── sandbox.config.json       # Sandbox settings
├── experiments/                   # Experimental code
│   ├── exp-001-new-ui/
│   ├── exp-002-performance/
│   └── exp-003-ai-integration/
└── [regular project structure]
```

### B. Sandbox Workflow
```bash
# Create new experiment
cd ~/Development/PRISM-SANDBOX/project-prism-sandbox
git checkout -b sandbox/experiment-name

# Save rollback point
git add .
git commit -m "ROLLBACK_POINT: Before experiment X"
git tag rollback-exp-x

# Experiment freely
# ... make changes ...

# If successful, merge to develop
git checkout develop
git merge sandbox/experiment-name

# If failed, rollback
git reset --hard rollback-exp-x
```

---

## PHASE 6: WORKFLOW AUTOMATION

### A. Quick Commands Setup
```bash
# Add to ~/.bashrc or ~/.zshrc

# Navigation aliases
alias prism-main="cd ~/Development/PRISM-PRODUCTION/project-prism"
alias prism-sandbox="cd ~/Development/PRISM-SANDBOX/project-prism-sandbox"
alias prism-golden="cd ~/Development/PRISM-GOLDEN"

# Sync commands
alias prism-sync="rsync -av /srv/prism-shared/ /Volumes/prism-shared/"
alias prism-backup="tar -czf ~/backups/prism-$(date +%Y%m%d).tar.gz ~/Development/PRISM-PRODUCTION/"

# Git workflows
function prism-feature() {
  git checkout develop
  git pull origin develop
  git checkout -b feature/$1
}

function prism-experiment() {
  cd ~/Development/PRISM-SANDBOX/project-prism-sandbox
  git checkout -b sandbox/$1
  echo "Experiment: $1" >> .sandbox/experiments.log
}
```

### B. MCP Quick Start
```bash
# Start MCP servers
function prism-mcp-start() {
  mcp start prism-core
  mcp start prism-sync
  echo "MCP Servers started - Complete context loaded"
}

# Check MCP status
function prism-mcp-status() {
  mcp status --detailed
}
```

---

## IMPLEMENTATION TIMELINE

### Day 1: Infrastructure (2-3 hours)
- [ ] Setup file sharing between Mac & Linux
- [ ] Create shared network directories
- [ ] Test file sync between machines
- [ ] Create backup of everything

### Day 2: Golden Source (2 hours)
- [ ] Create GOLDEN-SOURCE structure
- [ ] Migrate all prototypes
- [ ] Consolidate documentation
- [ ] Setup symlinks

### Day 3: Git Reorganization (1-2 hours)
- [ ] Create branch structure
- [ ] Setup branch protection
- [ ] Create sandbox branches
- [ ] Update remote repository

### Day 4: Local Environment (2 hours)
- [ ] Create development directories
- [ ] Clone repositories
- [ ] Setup sandbox environment
- [ ] Configure workflow aliases

### Day 5: MCP Integration (2-3 hours)
- [ ] Install MCP infrastructure
- [ ] Configure multi-machine servers
- [ ] Test context persistence
- [ ] Deploy first agents

---

## VERIFICATION CHECKLIST

### Infrastructure
- [ ] Files accessible from both Mac & Linux
- [ ] Sync working in real-time
- [ ] Backup system functional

### Organization
- [ ] Golden Source contains all prototypes
- [ ] Documentation consolidated
- [ ] Clear separation: production/sandbox/features

### Git/Version Control
- [ ] Main branch protected
- [ ] Develop branch active
- [ ] Sandbox branches created
- [ ] All branches pushed to GitHub

### MCP/Context
- [ ] MCP servers running
- [ ] Context persisted across sessions
- [ ] Agents deployable
- [ ] Complete project context available

### Workflow
- [ ] Quick commands working
- [ ] Easy navigation between environments
- [ ] Sandbox safe for experiments
- [ ] Clear production path

---

## ROLLBACK PROCEDURES

### If Issues Occur
```bash
# Full system restore
cd ~/backups
tar -xzf prism-[latest].tar.gz

# Git rollback
git reset --hard HEAD~1
git push --force-with-lease

# MCP reset
mcp stop --all
rm -rf ~/.mcp/state
mcp init --fresh
```

---

## SUCCESS METRICS

### Immediate Benefits
- ✅ Single source of truth accessible from both machines
- ✅ No more LocalSend file transfers
- ✅ Complete context persistence with MCP
- ✅ Safe experimentation environment

### Long-term Benefits
- ✅ 10x faster development with MCP agents
- ✅ Clear organization reduces cognitive load
- ✅ Sandbox enables fearless experimentation
- ✅ Production code always protected

---

## NEXT IMMEDIATE STEPS

1. **Choose file sharing method** (NFS vs Syncthing)
2. **Backup everything** on both machines
3. **Setup shared network storage**
4. **Begin Phase 1** implementation

---

*This Oracle Environment will transform your development workflow into a unified, intelligent, and efficient system across both machines with complete MCP integration!*

Ready to begin with Phase 0 - Infrastructure Foundation?