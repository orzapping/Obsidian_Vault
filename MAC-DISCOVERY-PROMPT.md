# Mac Mini Documentation Discovery & Integration

## Context

This Obsidian vault is shared between Linux and Mac via SMB. The Linux side has already completed a consolidation exercise. Now we need to discover and integrate .md files from the Mac side.

**Important:** The Linux machine is the primary development environment. Most PRISM-related files on Mac are likely duplicates or outdated versions.

---

## Your Task

Scan the Mac filesystem for markdown (.md) files and integrate unique, valuable documentation into this Obsidian vault.

---

## CRITICAL CONSTRAINTS - READ THESE FIRST

### Absolute Rules
1. **NO touching/editing/moving ANY existing vault files**
2. **NO changing existing directory structure** - only NEW subdirectories allowed if needed
3. **NO overwriting files** - if a file with the same name exists in the vault, skip it
4. **ONLY incoming operations** - we ADD files, we do NOT reorganize
5. **Preserve all existing content** - this vault has indexed links and references

### Protected Areas (Complete Read-Only)
- `02-Projects/PRISM/` - **ALL files protected** - Linux has the authoritative versions
- `Claude's Perpetual Environment Repository/` - AI context preservation
- **ALL existing directories** - structure is frozen, only additions permitted

### Duplicate Handling
- PRISM files on Mac are likely **outdated** - skip unless clearly unique
- If duplicate detected, **always keep the vault version**
- When in doubt, skip the file

---

## Directory Structure Reference

```
00-Dashboard/           → Control center, project status
01-Companies/           → Company documentation
   ├── One-Global-Market/
   ├── Orion-Ridge-Capital/
   └── Quantum-Liquidity-Systems/
02-Projects/            → Project documentation
   ├── PRISM/ (PROTECTED - skip duplicates)
   ├── Behavioural-Intelligence/
   ├── Business-Management/
   ├── CRAMPT/
   ├── FeelX/
   ├── Transaction-Management/
   └── Website-ORC/
03-Personal/            → Personal notes, ideas, learning
04-Resources/           → Reference materials
   ├── Cheat_Sheets/
   ├── Technical-Docs/
   │   ├── MCP/
   │   └── Git/
   └── Templates/
05-Daily-Notes/         → Daily journaling
06-Interesting_Things/  → Misc references
07-System/              → System notes
99-Archive/             → Archived content
Claude's Perpetual Environment Repository/ → AI context (protected)
```

---

## Scan Locations

Search these Mac directories for .md files:

1. `~/Documents/` - Primary document storage
2. `~/Desktop/` - Often has working documents
3. `~/Downloads/` - May have downloaded guides/docs
4. `~/Development/` or `~/Projects/` - Code project docs
5. `~/.claude/` - Claude context files
6. Any other locations with project documentation

**Exclude from scan:**
- `node_modules/` directories
- `.git/` directories
- System directories (`/System`, `/Library`, etc.)
- The mounted vault itself (avoid recursion)

---

## Discovery Process

### Phase 1: Scan & Inventory
1. Find all .md files across the scan locations
2. For each file, note:
   - Full path
   - File size and modification date
   - Apparent project/category (from parent folder names)
   - Content type (README, guide, notes, session wrap, etc.)

### Phase 2: Categorization
Map each file to the appropriate vault location:
- Company docs → `01-Companies/{company}/`
- Project docs → `02-Projects/{project}/`
- Personal notes → `03-Personal/`
- Guides/references → `04-Resources/`
- Templates → `04-Resources/Templates/`

### Phase 3: Duplicate Detection
For each file:
1. Check if same filename exists in vault
2. If yes, compare content/timestamps
3. Mark as: UNIQUE, DUPLICATE, or NEWER_VERSION

### Phase 4: Integration Plan
Create a detailed plan showing:
- Files to copy and their destinations
- Files to skip (duplicates)
- Any new subdirectories needed
- Estimated file counts per category

---

## Output Format

Produce a report with:

### Summary
- Total .md files found
- Unique files to integrate
- Duplicates to skip
- Files needing review

### Detailed File List
| Source Path | Destination | Status | Notes |
|-------------|-------------|--------|-------|
| ~/Documents/... | 02-Projects/... | COPY | Unique file |
| ~/Desktop/... | (skip) | DUPLICATE | Exists in vault |

### Execution Plan
Ordered list of copy operations, grouped by destination directory.

---

## Execution Guidelines

When ready to execute:
1. Create any new subdirectories first
2. Copy files in batches by category
3. Verify each batch before proceeding
4. Generate a summary of changes made

**Remember:** When in doubt, DON'T copy. It's better to miss a file than to create confusion with duplicates.

---

## Start Command

Begin by exploring the Mac filesystem to understand what's there:

```
Please scan my Mac for .md files, focusing on ~/Documents, ~/Desktop, ~/Downloads, and any Development/Projects directories. Map findings to the vault structure and create an integration plan. Remember: no changes to existing vault content, only additions of unique files.
```
