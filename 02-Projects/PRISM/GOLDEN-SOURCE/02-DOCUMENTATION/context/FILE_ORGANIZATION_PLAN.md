# PRISM Project File Organization Plan
## Systematic Restructuring for MCP Server Integration

---

## CURRENT STATE ANALYSIS

### Issues Identified
1. **Mixed concerns** - Dashboard files, docs, and source code at root level
2. **Unclear prototype location** - HTML prototypes scattered across multiple directories
3. **Session wraps buried** - Important development history in `.claude/session-wraps/`
4. **Multiple RA calculator versions** - `ra-calculator_failed` and `ra-calculator_aug_gpt5`
5. **Inconsistent documentation** - Docs spread across root, `/docs`, and `.claude/`
6. **No clear MCP preparation** - Structure not optimized for context servers

### Current Directory Structure
```
project-prism/
├── .claude/                    # Hidden, contains critical context
├── context-explorer-poc/       # Separate project mixed in
├── dashboard/                  # Dashboard HTML files
├── data/                       # Data files
├── doc_generator_files/        # Doc generation tools
├── docs/                       # Main documentation
├── intel-dashboard-design/     # More dashboard files
├── scripts/                    # Build/utility scripts
├── src/                        # Source code
│   ├── app/                   # Next.js app router
│   ├── components/            # Shared components
│   └── modules/               # Business modules
│       ├── core/              # Core PRISM modules
│       └── supplementary/     # Additional modules
├── tests/                      # Test files
└── Various root files          # Config, docs, etc.
```

---

## PROPOSED REORGANIZATION

### New Directory Structure (MCP-Optimized)
```
project-prism/
├── 📁 .mcp/                           # MCP Server Configuration
│   ├── servers/                       # MCP server implementations
│   │   ├── core-server.js           # Main PRISM context server
│   │   ├── regulatory-server.js     # Regulatory compliance
│   │   ├── migration-server.js      # HTML to TypeScript
│   │   └── testing-server.js        # Testing automation
│   ├── agents/                        # Agent definitions
│   │   ├── module-development.js    # Module creation agent
│   │   ├── compliance.js            # Regulatory agent
│   │   └── documentation.js         # Docs agent
│   └── config.json                   # MCP configuration
│
├── 📁 src/                            # Application Source (CLEAN)
│   ├── app/                          # Next.js app router
│   ├── components/                   # Shared components
│   ├── modules/                      # Business modules
│   │   ├── core/                    # Core PRISM modules
│   │   │   ├── firm-data/
│   │   │   ├── financial-data/
│   │   │   ├── for-calculator/
│   │   │   ├── ra-calculator/       # CONSOLIDATED version
│   │   │   ├── kfr-calculator/
│   │   │   ├── winddown-calculator/
│   │   │   ├── linear-reverse-stress-testing/
│   │   │   ├── reporting/
│   │   │   └── user-management/
│   │   └── supplementary/            # K-factor modules
│   │       ├── k-cmg/
│   │       ├── k-con/
│   │       ├── k-npr/
│   │       └── k-tcd/
│   ├── lib/                          # Shared libraries
│   ├── services/                     # API services
│   ├── store/                        # State management
│   ├── types/                        # TypeScript types
│   └── utils/                        # Utilities
│
├── 📁 prototypes/                     # HTML Prototypes (ORGANIZED)
│   ├── core/                         # Core module prototypes
│   │   ├── firm-data.html
│   │   ├── financial-data.html
│   │   ├── for-calculator.html
│   │   ├── ra-calculator.html
│   │   └── kfr-calculator.html
│   ├── supplementary/                # K-factor prototypes
│   └── archive/                      # Old versions
│
├── 📁 documentation/                  # All Documentation (UNIFIED)
│   ├── architecture/                 # System architecture
│   │   ├── CLAUDE.md                # Main AI context
│   │   ├── architecture.md
│   │   └── mcp-strategy.md
│   ├── modules/                      # Module-specific docs
│   │   └── [module-name]/
│   │       ├── README.md
│   │       ├── calculations.md
│   │       └── regulatory.md
│   ├── regulatory/                   # Regulatory references
│   │   ├── mifidpru/
│   │   ├── icara/
│   │   └── fca-guidance/
│   ├── session-history/              # Development history
│   │   ├── wraps/                   # Session wraps
│   │   ├── decisions/                # Technical decisions
│   │   └── lessons/                  # Lessons learned
│   └── guides/                       # User & dev guides
│
├── 📁 context/                        # MCP Context Store
│   ├── profiles/                     # User profiles
│   │   └── aboutme_profile.md
│   ├── patterns/                     # Reusable patterns
│   ├── templates/                    # Code templates
│   └── state/                        # Project state
│       ├── module-status.json
│       ├── integration-map.json
│       └── completion-metrics.json
│
├── 📁 tests/                          # Test Suites
│   ├── unit/                         # Unit tests
│   ├── integration/                  # Integration tests
│   ├── e2e/                          # End-to-end tests
│   ├── parity/                       # HTML parity tests
│   └── fixtures/                     # Test data
│
├── 📁 tools/                          # Development Tools
│   ├── dashboard/                    # Progress dashboard
│   ├── generators/                   # Code generators
│   ├── validators/                   # Validation tools
│   └── scripts/                      # Build/utility scripts
│
├── 📁 infrastructure/                 # Infrastructure Config
│   ├── docker/                       # Docker configs
│   ├── ci-cd/                        # CI/CD pipelines
│   └── deployment/                   # Deployment configs
│
└── 📁 archive/                        # Archived Content
    ├── old-dashboards/               # Old dashboard files
    ├── poc-projects/                 # POC experiments
    └── deprecated/                   # Deprecated code
```

---

## MIGRATION STEPS

### Phase 1: Backup & Preparation (30 mins)
```bash
# 1. Create full backup
cd /home/obsidan/Development/Projects
tar -czf prism-backup-$(date +%Y%m%d-%H%M%S).tar.gz project-prism/

# 2. Create migration log
cd project-prism
mkdir -p migration-log
echo "Migration started: $(date)" > migration-log/migration.log

# 3. Create new directory structure
mkdir -p {.mcp/{servers,agents},prototypes/{core,supplementary,archive}}
mkdir -p {documentation/{architecture,modules,regulatory,session-history,guides}}
mkdir -p {context/{profiles,patterns,templates,state}}
mkdir -p {tests/{unit,integration,e2e,parity,fixtures}}
mkdir -p {tools/{dashboard,generators,validators,scripts}}
mkdir -p {infrastructure/{docker,ci-cd,deployment}}
mkdir -p {archive/{old-dashboards,poc-projects,deprecated}}
```

### Phase 2: Organize Prototypes (20 mins)
```bash
# Move HTML prototypes to centralized location
mv dashboard/*.html prototypes/archive/
mv doc_generator_files/*.html prototypes/archive/
mv intel-dashboard-design-planning-docs/*.html archive/old-dashboards/

# Identify and organize core prototypes
# [Manual review needed to identify which HTMLs are actual prototypes]
```

### Phase 3: Consolidate Documentation (30 mins)
```bash
# Move architecture docs
mv CLAUDE.md documentation/architecture/
mv MCP_AGENTS_STRATEGY.md documentation/architecture/
mv .claude/architecture*.md documentation/architecture/

# Move session wraps
mv .claude/session-wraps/* documentation/session-history/wraps/
mv .claude/context/* context/profiles/

# Move module docs
mv docs/modules/* documentation/modules/

# Move guides and planning
mv "docs/planning & guides"/* documentation/guides/
```

### Phase 4: Clean Source Structure (20 mins)
```bash
# Consolidate RA calculator versions
# Decision needed: Which version to keep?
# - ra-calculator_aug_gpt5 (likely the better one)
# - ra-calculator_failed (archive this)

mv src/modules/core/ra-calculator_failed archive/deprecated/
mv src/modules/core/ra-calculator_aug_gpt5 src/modules/core/ra-calculator

# Move POC projects
mv context-explorer-poc archive/poc-projects/
```

### Phase 5: Setup MCP Infrastructure (30 mins)
```bash
# Create MCP configuration
cat > .mcp/config.json << 'EOF'
{
  "servers": {
    "prism-core": {
      "path": "./servers/core-server.js",
      "autoStart": true
    },
    "prism-regulatory": {
      "path": "./servers/regulatory-server.js",
      "autoStart": false
    }
  },
  "context": {
    "rootPath": "/home/obsidan/Development/Projects/project-prism",
    "primaryDocs": [
      "documentation/architecture/CLAUDE.md",
      "context/profiles/aboutme_profile.md"
    ]
  }
}
EOF

# Create basic core server
cat > .mcp/servers/core-server.js << 'EOF'
// PRISM Core MCP Server
// Provides complete project context and file management
const { MCPServer } = require('@anthropic/mcp-server');

class PRISMCoreServer extends MCPServer {
  constructor() {
    super({
      name: 'prism-core',
      version: '1.0.0'
    });
  }
  
  async initialize() {
    // Load project context
    await this.loadContext();
    console.log('PRISM Core Server initialized');
  }
}

module.exports = PRISMCoreServer;
EOF
```

### Phase 6: Update Configuration Files (15 mins)
```bash
# Update .gitignore
echo "
# MCP Server
.mcp/state/
.mcp/logs/

# Archives
archive/

# Migration
migration-log/
" >> .gitignore

# Update tsconfig paths
# Update import paths in package.json scripts
# Update Next.js config if needed
```

---

## BENEFITS OF NEW STRUCTURE

### For MCP Servers
1. **Clear context location** - `.mcp/` and `context/` directories
2. **Organized prototypes** - Easy for migration server to find
3. **Centralized docs** - Single source of truth
4. **Clean source** - No confusion about active code

### For Development
1. **Faster navigation** - Logical structure
2. **Clear module status** - One RA calculator, organized modules
3. **Better testing** - Organized test structure
4. **Easy archival** - Clear deprecated/archive folders

### For AI Assistance
1. **Complete context** - All relevant files in known locations
2. **Pattern library** - Reusable patterns in `context/patterns/`
3. **Template access** - Code templates readily available
4. **State tracking** - Module status in `context/state/`

---

## IMPLEMENTATION CHECKLIST

### Pre-Migration
- [ ] Create full backup
- [ ] Review and identify active HTML prototypes
- [ ] Decide on RA calculator version to keep
- [ ] Notify any team members (if applicable)

### During Migration
- [ ] Phase 1: Backup & create structure
- [ ] Phase 2: Organize prototypes
- [ ] Phase 3: Consolidate documentation
- [ ] Phase 4: Clean source structure
- [ ] Phase 5: Setup MCP infrastructure
- [ ] Phase 6: Update configurations

### Post-Migration
- [ ] Test build process
- [ ] Verify all imports work
- [ ] Update any absolute paths
- [ ] Test MCP server connection
- [ ] Update CLAUDE.md with new structure
- [ ] Commit with detailed message

---

## ROLLBACK PLAN

If issues arise:
```bash
# Restore from backup
cd /home/obsidan/Development/Projects
rm -rf project-prism
tar -xzf prism-backup-[timestamp].tar.gz
```

---

## NEXT STEPS AFTER ORGANIZATION

1. **Install MCP CLI tools**
2. **Configure MCP servers**
3. **Test context persistence**
4. **Deploy first agent**
5. **Validate workflow improvements**

---

*Ready to transform PRISM into an MCP-powered development environment!*