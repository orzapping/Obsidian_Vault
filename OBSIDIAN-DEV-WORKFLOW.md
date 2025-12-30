# 🔧 Obsidian Development Workflow Guide

> *How to integrate Obsidian with your development projects without disrupting your flow*

---

## 🎯 The Golden Rule: Separation of Concerns

### What STAYS in Project Directories:
```
/Development/PRISM-PRODUCTION/
├── src/              ← Code stays here
├── tests/            ← Test files stay here
├── package.json      ← Config stays here
├── .env              ← Environment stays here
└── README.md         ← Basic README can stay (or symlink)
```

### What GOES in Obsidian:
```
/Obsidian Vault/02-Projects/PRISM/
├── Architecture decisions
├── Meeting notes
├── Research & exploration
├── API documentation
├── Design decisions
├── Sprint reviews
├── Bug investigations
└── Knowledge base
```

---

## 📊 Real-World Workflow Patterns

### Pattern 1: "Documentation Companion" (RECOMMENDED)
```
Code Editor (VS Code) ← → Obsidian
     ↓                      ↓
   Code files          Documentation
   (.ts, .py)          (.md notes)

Example:
- Write code in VS Code
- Document decisions in Obsidian
- Link between them via references
```

### Pattern 2: "Selective Sync"
```bash
# In your project
/project/
├── docs/           → Symlink to Obsidian
├── DECISIONS/      → Symlink to Obsidian
├── meeting-notes/  → Symlink to Obsidian
└── src/           → Stays in project
```

### Pattern 3: "Hub & Spoke"
```
Obsidian = Hub (all documentation)
    ↓
References multiple project directories
    ↓
Each project has minimal docs (just README)
```

---

## 🔄 Practical Daily Workflow

### Morning Routine (5 mins):
1. **Open Obsidian** → Daily note
2. **Review** → Yesterday's decisions/blockers
3. **Plan** → Today's development tasks
4. **Switch to VS Code** → Start coding

### During Development:
```markdown
# Quick Capture Example (Alt+Tab to Obsidian)

## 2024-11-21 - K-Factor Calculation Bug

**Problem**: K-AUM calculation off by 0.02%

**Investigation**:
- Found in: `/PRISM-PRODUCTION/src/calculators/kaum.ts:45`
- Root cause: Rounding error in percentage calculation
- Solution: Use decimal.js for precision

**Decision**: Implement decimal.js library
**PR**: #234
```

### End of Day (5 mins):
- Commit code to git (in project dir)
- Update Obsidian notes with decisions
- Link notes to relevant code files
- Update tomorrow's tasks

---

## 🎨 Recommended Setup

### 1. Create Project Index Files
```markdown
# In Obsidian: PRISM-Dev-Index.md

## Current Work
- Working on: `/Development/PRISM-PRODUCTION/src/calculators/`
- Branch: `feature/k-factor-precision`
- PR: [#234](github-link)

## Code Locations
- Production: `/home/obsidan/Development/PRISM-PRODUCTION`
- Sandbox: `/home/obsidan/Development/PRISM-SANDBOX`

## Recent Changes
- [[2024-11-21-calculation-fix]]
- [[2024-11-20-api-refactor]]
```

### 2. Use File URIs for Direct Links
```markdown
# In your Obsidian notes:
See implementation: [kaum.ts](file:///home/obsidan/Development/PRISM-PRODUCTION/src/calculators/kaum.ts)
```

### 3. Create a `.obsidian-doc` folder in projects
```bash
/PRISM-PRODUCTION/
├── .obsidian-doc/    ← Symlink this to Obsidian
│   ├── decisions/
│   ├── reviews/
│   └── architecture/
├── src/
└── tests/
```

---

## 💡 What Goes Where - Quick Reference

### ✅ ALWAYS in Obsidian:
- **Meeting notes** - Client meetings, team standups
- **Architecture decisions** - ADRs, design choices
- **Bug investigations** - Root cause analysis
- **Learning notes** - New tech, patterns, research
- **Sprint planning** - User stories, planning
- **API documentation** - Endpoint docs, schemas
- **Compliance docs** - FCA requirements, IFPR rules

### ❌ NEVER in Obsidian:
- Source code files (.ts, .py, .js)
- Build artifacts
- Node_modules or dependencies
- Environment variables
- Binary files
- Database dumps

### 🤔 DEPENDS on Context:
- **README.md** - Can symlink to Obsidian
- **API specs** - Can generate from code → Obsidian
- **Test documentation** - High-level in Obsidian, details in code
- **Configuration docs** - Explanations in Obsidian, files in project

---

## 🚀 Your Optimal Workflow

### For PRISM Development:
1. **Keep all code** in `/Development/PRISM-*/`
2. **Keep all documentation** in Obsidian vault
3. **Create index notes** that reference code locations
4. **Use Daily Notes** for development logs
5. **Tag everything**: `#bug-fix`, `#feature`, `#decision`, `#prism`

### For CRAMPT Compliance Platform:
1. **Compliance rules** → Obsidian (searchable, linkable)
2. **Implementation** → Code repository
3. **FCA mappings** → Obsidian (reference docs)
4. **Test scenarios** → Both (high-level in Obsidian, details in code)

### For Transaction Management System:
1. **System design** → Obsidian
2. **FIX protocol specs** → Obsidian (reference)
3. **Integration docs** → Obsidian
4. **Code** → Repository

---

## 📝 Example Daily Dev Flow

```markdown
## 2024-11-21 Daily Dev Log

### Morning Stand-up
- Yesterday: Fixed K-AUM calculation precision
- Today: Integration tests for calculator
- Blockers: Need FCA rounding clarification

### Working On
- Project: [[PRISM]]
- Module: K-Factor Calculators
- File: `/Development/PRISM-PRODUCTION/src/calculators/kaum.ts`
- Branch: `fix/calculation-precision`

### Decisions Made
- Using decimal.js for all financial calculations
- Reasoning: [[2024-11-21-decimal-precision-decision]]
- Impact: All calculators need updating

### Code References
- [Current implementation](file:///home/obsidan/Development/PRISM-PRODUCTION/src/calculators/kaum.ts)
- [Test file](file:///home/obsidan/Development/PRISM-PRODUCTION/tests/kaum.test.ts)
- PR: [#234](https://github.com/yourrepo/prism/pull/234)

### Discoveries
- FCA requires 4 decimal places for K-Factors
- Found in: [[FCA-IFPR-Handbook#Calculation-Precision]]
- Action: Update all formatters

### Blockers
- [ ] FCA clarification on rounding rules
- [ ] Performance impact of decimal.js
- [ ] Migration strategy for existing data

### End of Day
- Committed: `abc123f - Fix K-AUM precision issue`
- PR Status: Ready for review
- Tomorrow: Performance testing
```

---

## 🎯 Quick Start Actions

1. **Create Templates Folder**: `04-Resources/Templates/Dev-Templates/`
2. **Set up hotkeys**:
   - `Alt+D` → New dev log
   - `Alt+B` → Bug investigation
   - `Alt+A` → Architecture decision
3. **Install "Templater" plugin** for dynamic templates
4. **Create your first dev log** using the template

---

## 🔗 Integration Tips

### VS Code → Obsidian:
- Install "Copy file path" extension
- Use `Ctrl+Shift+C` to copy path
- Paste into Obsidian notes

### Obsidian → VS Code:
- Use `file:///` links
- Or install "Open in VS Code" plugin

### Git Integration:
- Commit code in project repos
- Reference commits in Obsidian
- Link PRs from notes

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't duplicate code** - Reference it instead
2. **Don't over-document** - Capture decisions, not implementation
3. **Don't version control everything** - Vault can be separate from code
4. **Don't break existing workflows** - Enhance, don't replace
5. **Don't force it** - If it feels wrong, adjust the workflow

---

## 📈 Measuring Success

You know it's working when:
- ✅ You can find any decision quickly
- ✅ Onboarding new devs is easier
- ✅ You remember why you made choices
- ✅ Bug investigations are faster
- ✅ Knowledge isn't lost when switching projects

---

*Workflow guide v1.0 - Adapt to your needs!*
[[Home]] | [[OBSIDIAN-POWER-FEATURES]]