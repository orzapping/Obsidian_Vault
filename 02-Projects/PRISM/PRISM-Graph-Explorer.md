# 🌌 PRISM Graph Explorer

> *Visualize the entire PRISM ecosystem and discover hidden connections*

---

## 🎯 Quick Graph Views

### See Everything PRISM:
1. Open Graph View: `Ctrl+G`
2. Add filter: `path:PRISM`
3. Color by: `tag:#prism`

### K-Factor Network:
```
Filters:
- Search: "K-" OR "calculator"
- Depth: 2 (shows 2 levels of connections)
```

### Module Dependencies:
```
Filters:
- Search: "module"
- Show orphans: OFF
- Show attachments: OFF
```

### Find Isolated Documents:
```
Filters:
- Path: PRISM
- Orphans: ONLY
(Shows unlinked files that need connecting)
```

---

## 🎨 Color Coding Setup

### By Document Type:
1. Graph Settings → Groups
2. Add groups:
   - **Modules** (Blue): `file:module`
   - **K-Factors** (Green): `file:K- OR calculator`
   - **Documentation** (Yellow): `path:GOLDEN-SOURCE`
   - **Tests** (Red): `file:test`
   - **Config** (Purple): `file:config`

### By Status:
- 🟢 Complete: `tag:#complete`
- 🟡 In Progress: `tag:#in-progress`
- 🔴 Blocked: `tag:#blocked`
- 🔵 Planned: `tag:#planned`

---

## 🔍 Discovery Queries

### Find Hidden Connections:
```
1. Open your PRISM-Hub
2. Open Local Graph (right-click note → Open local graph)
3. Depth: 3
4. See unexpected connections!
```

### Track Information Flow:
```
Start: PRISM_MASTER_REFERENCE
Depth: 2
Shows: What references the master → What those reference
```

### Identify Key Nodes:
```
Look for:
- Largest nodes (most connections)
- Bridge nodes (connect clusters)
- Orphan clusters (need integration)
```

---

## 📊 Graph Analysis

### Your PRISM Statistics:
- **Total Notes**: 4,460+
- **Connections**: (Check graph view)
- **Orphan Rate**: (Isolated files / Total)
- **Clustering**: (Visual groups)

### Health Indicators:
✅ **Good**: Tight clusters with bridges
⚠️ **Warning**: Many orphans
❌ **Bad**: Disconnected islands

---

## 🎮 Interactive Exercises

### Exercise 1: Find the Core
```
1. Graph view → Filter: path:PRISM
2. Look for the biggest node
3. That's your most connected file
4. Question: Is it the right hub?
```

### Exercise 2: Connect Orphans
```
1. Filter: path:PRISM AND orphan:true
2. Pick an orphan
3. Open it
4. Add relevant [[links]]
5. Watch it connect in real-time!
```

### Exercise 3: Trace K-Factor Flow
```
1. Search: "K-AUM"
2. Follow connections
3. Find: Input → Calculation → Output
4. Document the data flow
```

---

## 🚀 Advanced Graph Features

### Force-Directed Layout:
- **Attract**: Links pull nodes together
- **Repel**: Nodes push apart
- **Center**: Strong nodes gravitate center
- **Adjust**: Drag to override

### Filters Cookbook:

#### "Show me regulatory compliance path"
```
(tag:#compliance OR tag:#fca OR tag:#ifpr)
-path:Archive
```

#### "Active work this week"
```
path:PRISM modified:week-1 -tag:#completed
```

#### "K-Factor dependencies"
```
(file:K- OR content:"K-Factor") depth:2
```

---

## 💡 Graph Insights

### What to Look For:

1. **Hub Documents**
   - Should be your main references
   - If not, create better hubs

2. **Isolated Clusters**
   - Might need cross-linking
   - Or might be properly separated

3. **Bridge Documents**
   - Connect different areas
   - Critical for information flow

4. **Orphan Groups**
   - Recent imports?
   - Need categorization?

---

## 🎯 Action Items from Graph

Based on typical PRISM graph patterns:

- [ ] Connect orphaned calculator docs
- [ ] Link test files to their modules
- [ ] Create module interconnection notes
- [ ] Add tags to untagged files
- [ ] Build glossary for common terms

---

## 🔄 Dynamic Graph Queries

Save these as bookmarks:

### "Current Sprint"
```
tag:#sprint-current OR
(modified:week-1 AND path:PRISM)
```

### "Documentation Gaps"
```
path:PRISM -tag:#documented
```

### "Integration Points"
```
content:"import" OR content:"export" OR
content:"API" OR content:"interface"
```

---

*Use Ctrl+G right now and explore your PRISM universe!*

[[PRISM-Hub]] | [[OBSIDIAN-POWER-FEATURES]]