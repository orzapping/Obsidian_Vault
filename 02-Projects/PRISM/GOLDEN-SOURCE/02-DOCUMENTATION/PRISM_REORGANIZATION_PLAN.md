# PRISM Complete Reorganization Plan
## Phase 0 Complete: File Sharing ✅
## Phase 1 Complete: Backup Creation ✅
## Phase 2 Complete: Golden Source Setup ✅
## Phase 3 Complete: Archive & Cleanup ✅
## Phase 4 Complete: Three-Zone Architecture ✅
## Phase 5 Complete: MCP Integration ✅

---

## ✅ BACKUP COMPLETED
```bash
# Created timestamped backup (1.6GB project)
# COMPLETED: project-prism-BACKUP-20250916-172705.tar.gz
# Location: /home/obsidan/Development/Projects/
# Size: 1.6GB → Compressed to manageable backup
```

---

## CURRENT STATE ANALYSIS

### ✅ COMPLETED TODAY
- **Prototypes moved**: 16 calculators now in `/srv/prism-shared/GOLDEN-SOURCE/01-PROTOTYPES/` ✅
  - Core calculators (1-10): firm-data, financial-data, FOR, RA, WDA, KFR, K-CMG, K-CON, K-NPR, K-TCD ✅
  - New approved modules (11-16): K-ASA, K-AUM, K-CMH, K-COH, K-DTF, OFAR ✅
- **Documentation consolidated**: All critical docs in GOLDEN-SOURCE/02-DOCUMENTATION ✅
- **Archives created**: POCs, old dashboards, failed modules moved to ARCHIVE ✅
- **Three-zone environment**: PRODUCTION, SANDBOX, FEATURES established ✅
- **MCP integration**: Persistent context server running ✅

### 📁 Project Structure Issues Identified
1. **Context files scattered**: CLAUDE.md at root, important contexts in `.claude/context/`
2. **Session wraps buried**: In `.claude/session-wraps/` - critical development history
3. **Context-explorer POC**: Side project that should be archived
4. **Dashboard files**: Scattered HTML dashboards at root
5. **Outdated /src**: Needs update from GitHub adrian branch
6. **Multiple RA calculator versions**: Need to consolidate

---

## ✅ REORGANIZATION ACTIONS COMPLETED

### ✅ PART A: COPIED TO PRISM-SHARED (Preserved in Both Locations)

#### 1. Golden Source Documentation
```bash
# Create documentation structure in shared
mkdir -p /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/{context,session-history,architecture}

# Copy critical context files (KEEP originals)
cp /home/obsidan/Development/Projects/project-prism/CLAUDE.md \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/context/CLAUDE-MASTER.md

cp /home/obsidan/Development/Projects/project-prism/.claude/context/*.md \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/context/

cp /home/obsidan/Development/Projects/project-prism/MCP_AGENTS_STRATEGY.md \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/architecture/

cp /home/obsidan/Development/Projects/project-prism/ORACLE_ENVIRONMENT_SETUP.md \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/architecture/
```

#### 2. Session History (Critical!)
```bash
# Copy session wraps - these are gold!
mkdir -p /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/session-history/wraps
cp -r /home/obsidan/Development/Projects/project-prism/.claude/session-wraps/* \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/session-history/wraps/

# Copy issue logs
mkdir -p /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/session-history/issues
cp -r /home/obsidan/Development/Projects/project-prism/.claude/issue-logs/* \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/session-history/issues/
```

#### 3. Architecture Documentation
```bash
# Copy architecture and planning docs
cp /home/obsidan/Development/Projects/project-prism/.claude/architecture*.md \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/architecture/

cp /home/obsidan/Development/Projects/project-prism/.claude/strategic_framework*.md \
   /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/architecture/
```

### ✅ PART B: MOVED TO ARCHIVE (Removed from Main Project)

#### 1. Context Explorer POC
```bash
# Archive the context-explorer side project
mkdir -p /srv/prism-shared/ARCHIVE/poc-projects
mv /home/obsidan/Development/Projects/project-prism/context-explorer-poc \
   /srv/prism-shared/ARCHIVE/poc-projects/

# Archive Intel Dashboard POC
mv /home/obsidan/Development/Projects/project-prism/intel-dashboard-design-planning-docs \
   /srv/prism-shared/ARCHIVE/poc-projects/
```

#### 2. Old Dashboard Files
```bash
# Archive dashboard HTMLs
mkdir -p /srv/prism-shared/ARCHIVE/old-dashboards
mv /home/obsidan/Development/Projects/project-prism/dashboard/*.html \
   /srv/prism-shared/ARCHIVE/old-dashboards/
```

#### 3. Failed RA Calculator Version
```bash
# Archive the failed version
mkdir -p /srv/prism-shared/ARCHIVE/failed-modules
mv /home/obsidan/Development/Projects/project-prism/src/modules/core/ra-calculator_failed \
   /srv/prism-shared/ARCHIVE/failed-modules/
```

### ✅ PART C: REORGANIZED WITHIN PROJECT-PRISM

#### 1. Clean Root Directory
```bash
cd /home/obsidan/Development/Projects/project-prism

# Move doc generator to tools
mkdir -p tools/generators
mv doc_generator_files tools/generators/

# Keep only essential files at root:
# - package.json, tsconfig.json, next.config.js (config files)
# - README.md, CHANGELOG.md, TODO.md (project docs)
# - .env.example, .gitignore (git files)
```

#### 2. Consolidate RA Calculator
```bash
# Rename the working version
mv src/modules/core/ra-calculator_aug_gpt5 src/modules/core/ra-calculator
```

#### 3. Update .claude Directory Structure
```bash
# Reorganize .claude for MCP
cd .claude
mkdir -p {templates,prompts,archives}

# Move old contexts to archive (since CLAUDE.md is now master)
mkdir -p archives/legacy-context
mv context/[1-11]*.md archives/legacy-context/

# Keep only essential active contexts
# - aboutme_profile.md
# - master_context_PRISM.md
# - session_wrap_PRISM.md (template)
```

### ✅ PART D: SYNCED WITH GITHUB

#### 1. Pull Latest from adrian branch
```bash
cd /home/obsidan/Development/Projects/project-prism
git stash  # Save local changes
git checkout adrian
git pull origin adrian

# Review changes to /src
git status
```

#### 2. ✅ Created Clean Branch Structure
```bash
# Created organized branch structure
# COMPLETED: adrian-oracle-reorg branch
# Pushed successfully to GitHub
# Commit: "Major reorganization: Oracle environment with three zones"
```

---

## POST-REORGANIZATION STRUCTURE

### Final Project-Prism Structure (Clean)
```
project-prism/
├── .claude/              # MCP-ready context
│   ├── templates/       # Session wrap templates
│   ├── prompts/         # Standard prompts
│   └── archives/        # Historical contexts
├── src/                  # UPDATED from GitHub
│   └── modules/
│       ├── core/        # Clean, single versions
│       └── supplementary/
├── tests/               # Test suites
├── tools/               # Dev tools
│   └── generators/      # Doc generators
├── public/              # Static assets
└── [config files]       # Root configs only
```

### Shared Directory Structure (Complete)
```
/srv/prism-shared/
├── GOLDEN-SOURCE/
│   ├── 01-PROTOTYPES/    ✅ (16 calculators)
│   ├── 02-DOCUMENTATION/
│   │   ├── context/      # Master contexts
│   │   ├── session-history/
│   │   └── architecture/
│   ├── 03-RESEARCH/
│   └── 04-TEMPLATES/
├── DEVELOPMENT/
│   ├── prism-main/      # For main branch work
│   └── prism-sandbox/   # For experiments
└── ARCHIVE/
    ├── poc-projects/    # Context explorer, etc
    ├── old-dashboards/
    └── failed-modules/
```

---

## ✅ EXECUTION COMPLETED

### ✅ Step 1: BACKUP (Completed)
- Created: project-prism-BACKUP-20250916-172705.tar.gz

### ✅ Step 2: COPY Critical Files (Completed)
- All documentation copied to GOLDEN-SOURCE
- Session wraps preserved
- Context files secured

### ✅ Step 3: ARCHIVE Old Files (Completed) 
- Failed RA calculator (July 27 disaster) archived
- POC projects moved
- Old dashboards cleaned

### ✅ Step 4: REORGANIZE Project (Completed)
- Project reduced from 1.6GB to 893MB
- Clean structure established
- Three-zone architecture created

### ✅ Step 5: SYNC with GitHub (Completed)
- Branch: adrian-oracle-reorg pushed
- All changes committed
- Repository synchronized

### ✅ Step 6: VERIFY (Completed)
- File access from Mac/Linux working ✅
- Nothing critical lost ✅
- Project builds successfully ✅

---

## ROLLBACK PLAN
```bash
# If anything goes wrong:
cd ~/Development/Projects
rm -rf project-prism
tar -xzf project-prism-BACKUP-[timestamp].tar.gz
```

---

## ✅ MISSION ACCOMPLISHED!

**Actual time taken**: ~3 hours (thorough and careful)
**Risk mitigated**: Full backup preserved
**Benefits achieved**: 
- Clean, organized structure ✅
- MCP-ready with persistent context ✅
- Three-zone development environment ✅
- File sharing Mac ↔ Linux working ✅
- Project size reduced by 44% (1.6GB → 893MB) ✅

## 🎯 WHAT WE ACHIEVED TODAY

### Infrastructure Wins:
1. **Samba file sharing** replacing LocalSend
2. **Three development zones** (Production, Sandbox, Features)
3. **MCP server** for persistent AI memory
4. **Golden Source** repository structure
5. **GitHub branch** safely pushed

### Organization Wins:
1. **16 HTML prototypes** organized and ready
2. **Documentation** consolidated in one place
3. **Failed code** archived (July 27 disaster contained)
4. **700MB** of cruft removed
5. **Clean structure** for rapid development

### Developer Experience:
1. **Quick commands**: `prism-prod`, `prism-sandbox`, `prism-features`
2. **MCP memory**: `cc` command with context persistence
3. **Master references**: All key docs created
4. **No more lost context**: MCP remembers everything

## NEXT STEPS
Use `cc` (not `claude`) for all future work - it has persistent memory!
Start with: `cc "Continue K-ASA module conversion"`