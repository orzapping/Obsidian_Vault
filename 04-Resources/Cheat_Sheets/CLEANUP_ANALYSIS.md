# Project Cleanup Analysis
## Files Safe to Remove/Archive

---

## ✅ SAFE TO DELETE (Already in GOLDEN-SOURCE)

### Root Directory
```bash
# These are now in /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/context/
✓ CLAUDE.md                    → Already copied as CLAUDE-MASTER.md
✓ MCP_AGENTS_STRATEGY.md       → Already in GOLDEN-SOURCE
✓ ORACLE_ENVIRONMENT_SETUP.md  → Already in GOLDEN-SOURCE  
✓ FILE_ORGANIZATION_PLAN.md    → Already in GOLDEN-SOURCE
```

### .claude Directory
```bash
# Architecture docs - Already in GOLDEN-SOURCE/02-DOCUMENTATION/architecture/
✓ .claude/architecture.md
✓ .claude/architecture-old.md  
✓ .claude/strategic_framework_complete_project_PRISM.md

# Context files - Already moved to archives
✓ .claude/context/* (numbered files already archived)
```

---

## ⚠️ KEEP BUT CONSIDER MOVING

### Working Documents (Move to GOLDEN-SOURCE/03-RESEARCH/)
```bash
? Organisation and Workflow Reorganisation.md  → Your planning doc, move to RESEARCH
? docs/JAD-DEVELOPER-ASSESSMENT.md            → Jad's work assessment, move to RESEARCH
? docs/CONSOLIDATION-FIXES-MEMO.md           → Technical notes, move to RESEARCH
? docs/UI-EXPERIMENTATION-GUIDE.md           → UI guide, move to RESEARCH
? docs/intel-dashboard-ref.md                → Dashboard reference, move to RESEARCH
```

### Project Meta Files (KEEP in project root)
```bash
✗ README.md          → Essential for GitHub
✗ CHANGELOG.md       → Project history
✗ TODO.md           → Active tasks
✗ .gitignore        → Git configuration
✗ package.json      → Node configuration
✗ tsconfig.json     → TypeScript config
```

---

## 🗑️ REDUNDANT/TEMPORARY FILES TO DELETE

### Build Artifacts (Safe to delete - regenerate on build)
```bash
✓ .next/             → Entire directory can be deleted (npm run build recreates)
✓ .swc/              → Build cache, safe to delete
✓ tsconfig.tsbuildinfo → TypeScript build info, regenerates
```

### Backup/Log Files
```bash
✓ server.log         → Old server log from July
✓ *-BACKUP-*         → Any backup files (we have tar.gz backup)
```

---

## 📁 DIRECTORIES TO REVIEW

### /docs Directory Structure
```
docs/
├── archive/           → Old docs
├── decisions/         → Architectural decisions  
├── migration/         → Migration guides
├── modules/          → Module documentation
├── planning & guides/ → Planning documents
├── sessions/         → Session documentation
├── technical/        → Technical specs
├── templates/        → Doc templates
├── testing/          → Test documentation
├── user/            → User guides
├── validation/      → Validation docs
└── Workflow Protocol & Context Management Guide/
```

**Recommendation**: This entire `/docs` structure could be moved to GOLDEN-SOURCE/02-DOCUMENTATION/ 
and replaced with a simple symlink, keeping only active working docs in the project.

---

## PROPOSED CLEANUP ACTIONS

### Phase 1: Delete Redundant Files (Saves ~500MB)
```bash
# Remove build artifacts
rm -rf .next/ .swc/ tsconfig.tsbuildinfo server.log

# Remove duplicates already in GOLDEN-SOURCE
rm CLAUDE.md MCP_AGENTS_STRATEGY.md ORACLE_ENVIRONMENT_SETUP.md FILE_ORGANIZATION_PLAN.md
rm .claude/architecture*.md .claude/strategic_framework*.md
```

### Phase 2: Move Research/Planning Docs
```bash
# Move to GOLDEN-SOURCE/03-RESEARCH/
mv "Organisation and Workflow Reorganisation.md" /srv/prism-shared/GOLDEN-SOURCE/03-RESEARCH/
mv docs/JAD-DEVELOPER-ASSESSMENT.md /srv/prism-shared/GOLDEN-SOURCE/03-RESEARCH/
mv docs/CONSOLIDATION-FIXES-MEMO.md /srv/prism-shared/GOLDEN-SOURCE/03-RESEARCH/
mv docs/UI-EXPERIMENTATION-GUIDE.md /srv/prism-shared/GOLDEN-SOURCE/03-RESEARCH/
mv docs/intel-dashboard-ref.md /srv/prism-shared/GOLDEN-SOURCE/03-RESEARCH/
```

### Phase 3: Consolidate Documentation
```bash
# Move entire docs structure to GOLDEN-SOURCE
cp -r docs/* /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION/
rm -rf docs
ln -s /srv/prism-shared/GOLDEN-SOURCE/02-DOCUMENTATION docs
```

---

## SPACE SAVINGS ESTIMATE

- **Build artifacts (.next, .swc)**: ~500MB
- **Duplicate documentation**: ~5MB  
- **Old logs**: ~1MB
- **Total potential savings**: ~506MB

---

## WHAT STAYS IN PROJECT

After cleanup, project directory will contain ONLY:
- Source code (/src)
- Configuration files (package.json, tsconfig.json, etc.)
- Git files (.git, .gitignore)
- Essential docs (README.md, CHANGELOG.md, TODO.md)
- Node modules (needed for development)
- Tests directory
- Scripts directory
- Symlinks to shared resources

---

## SAFETY CHECK

Before deleting anything:
1. ✅ Full backup exists: `project-prism-BACKUP-20250916-172705.tar.gz`
2. ✅ Important files copied to GOLDEN-SOURCE
3. ✅ File sharing working between machines
4. ⚠️ Consider creating a second backup before major deletions

---

## RECOMMENDED APPROACH

1. **Start with obvious deletions** (.next/, .swc/, duplicates)
2. **Move research docs** to GOLDEN-SOURCE/03-RESEARCH/
3. **Test project** still works after each phase
4. **Final consolidation** of /docs only after confirming everything works

This will give you a clean, lean project directory with all documentation safely preserved in GOLDEN-SOURCE!