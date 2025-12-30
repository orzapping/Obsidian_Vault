# 🧭 PRISM Navigation Guide

> *How to efficiently navigate your PRISM documentation in Obsidian*

---

## 🚀 Quick Start

### Essential Pages
1. **[[PRISM-Hub]]** - Your PRISM command center
2. **[[Module-Overview]]** - All modules at a glance
3. **[[K-Factor-Index]]** - K-Factor calculator docs
4. **[[GOLDEN-SOURCE/02-DOCUMENTATION/PRISM_MASTER_REFERENCE|Master Reference]]** - Complete project reference

---

## 📂 Folder Structure Explained

```
PRISM/
├── PRISM-Hub.md                 # Start here!
├── GOLDEN-SOURCE/               # Master documentation (symlinked)
│   ├── 01-PROTOTYPES/          # POCs and experiments
│   ├── 02-DOCUMENTATION/       # All documentation
│   ├── 03-RESEARCH/            # Research & planning
│   └── 04-TEMPLATES/           # Reusable templates
├── K-Factor-Calculators/        # K-Factor specific docs
├── Modules/                     # Module documentation
├── PRODUCTION-Docs/            # Live system docs (symlinked)
├── SANDBOX/                    # Safe testing env (symlinked)
├── FEATURES/                   # Feature branches (symlinked)
└── EXPERIMENTS/                # POCs (symlinked)
```

---

## 🔍 Finding What You Need

### By Topic

#### Regulatory Compliance
- Search: `tag:#prism/compliance`
- Key docs: FCA requirements, IFPR implementation

#### K-Factor Calculations
- Search: `tag:#prism/k-factor`
- Start with: [[K-Factor-Index]]

#### Architecture & Design
- Search: `tag:#prism/architecture`
- Review: System design, data models

#### Session History
- Path: `GOLDEN-SOURCE/02-DOCUMENTATION/session-history/`
- Contains: All development session wraps

---

## 🏷️ Tag Navigation

### Primary Tags
- `#prism` - All PRISM content
- `#prism/active` - Current work
- `#prism/blocked` - Items needing attention

### Module Tags
- `#prism/module-1` through `#prism/module-5`

### K-Factor Tags
- `#prism/k-aum`, `#prism/k-cmh`, `#prism/k-asa`, etc.

### Environment Tags
- `#prism/production`
- `#prism/sandbox`
- `#prism/features`

---

## 💡 Pro Tips

### 1. Use Graph View
- Press `Ctrl+G` to see document connections
- Filter by `path:PRISM` to focus on project

### 2. Quick Switcher Patterns
- Type `prism` for all PRISM files
- Type `k-` for K-Factor docs
- Type `module` for module docs

### 3. Create Bookmarks
Bookmark these frequently used files:
- PRISM-Hub
- Current sprint docs
- Test data locations

### 4. Search Operators
```
path:PRISM tag:#urgent     # Urgent PRISM items
path:PRISM created:week-1   # This week's PRISM work
"K-Factor" -path:Archive    # K-Factor excluding archives
```

---

## 📊 Status Tracking

### Visual Indicators
- 🟢 Complete/Active
- 🟡 In Progress/Warning
- 🔴 Blocked/Critical
- 🔵 Planned/Research

### Finding Status
- All active: `tag:#prism/active`
- Blocked items: `tag:#prism/blocked`
- This sprint: `tag:#prism/sprint-current`

---

## 🔄 Workflow Integration

### Daily Routine
1. Check [[PRISM-Hub]] for updates
2. Review module status
3. Update relevant documentation
4. Tag new items appropriately

### Weekly Tasks
- Update [[Module-Overview]]
- Review blocked items
- Archive completed work
- Plan next sprint

---

## 🗺️ Common Journeys

### "I need to implement a new K-Factor"
1. Start: [[K-Factor-Index]]
2. Review: Existing calculator docs
3. Check: Test data generators
4. Reference: FCA requirements

### "I need to fix a bug in Module 2"
1. Start: [[Module-Overview]]
2. Navigate: Module 2 section
3. Review: Session wraps
4. Check: Test coverage

### "I need regulatory documentation"
1. Search: `tag:#prism/compliance`
2. Check: GOLDEN-SOURCE/03-RESEARCH
3. Review: FCA handbook references

---

## 🆘 Getting Help

### Can't find something?
1. Use global search (`Ctrl+Shift+F`)
2. Check [[PRISM_MASTER_REFERENCE]]
3. Browse GOLDEN-SOURCE structure
4. Search by date modified

### Documentation gaps?
- Create note with `#prism/todo-docs`
- Link from relevant module
- Add to sprint backlog

---

*Navigation guide version 1.0*
[[PRISM-Hub]] | [[Home]]