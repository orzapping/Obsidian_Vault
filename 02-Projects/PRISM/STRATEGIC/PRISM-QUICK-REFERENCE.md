# 🚀 PRISM QUICK REFERENCE CARD

## Your Three Zones Are Ready!

### 📦 PRODUCTION (`~/Development/PRISM-PRODUCTION/project-prism`)
- Current branch: `adrian-oracle-reorg`
- For: Careful, production-ready work
- Jump there: `prism-prod`

### 🧪 SANDBOX (`~/Development/PRISM-SANDBOX/project-prism-sandbox`)
- Current branch: `sandbox/main-playground`
- For: Wild experiments, break anything!
- Jump there: `prism-sandbox`

### 🔧 FEATURES (`~/Development/PRISM-FEATURES/`)
- For: Isolated feature development
- Create new: `prism-new-feature k-asa`

---

## 🎯 QUICK COMMANDS (Available Now!)

```bash
# Navigation
prism-prod          # → Jump to production
prism-sandbox       # → Jump to sandbox
prism-features      # → Jump to features
prism-shared        # → Jump to shared files

# Status
prism-status        # See all environments
prism-check         # Health check

# Creating
prism-new-feature name     # New feature workspace
prism-experiment name      # New sandbox experiment

# Backup
prism-backup        # Quick backup of production
```

---

## 🎮 DAILY WORKFLOW
                                          
### Morning Routine
```bash
prism-check         # See what's where
prism-prod         # Start in production
git pull           # Get latest changes
```

### Starting New Work
```bash
# For new feature:
prism-new-feature k-asa
cd ~/Development/PRISM-FEATURES/feature-k-asa

# For experiment:
prism-sandbox
prism-experiment crazy-idea

# For bug fix:
prism-prod
git checkout -b fix/calculation-bug
```

### Saving Work
```bash
git add .
git commit -m "feat: Amazing new feature"
git push origin branch-name
```

---

## 🔥 SANDBOX PLAYGROUND RULES

In sandbox, you can:
- 🎮 Break everything
- 🎮 Try crazy ideas
- 🎮 Delete entire directories
- 🎮 Experiment with new packages
- 🎮 Test dangerous commands

To bring good stuff to production:
```bash
# In sandbox, note commit hash
git log --oneline

# In production
prism-prod
git cherry-pick <hash>
```

---

## 💡 PRO TIPS

1. **Always know where you are**: The prompt tells you!
   - 📦 = Production
   - 🧪 = Sandbox
   - 🔧 = Feature

2. **Sandbox experiments**: Tag interesting points
   ```bash
   git tag experiment-ui-v1
   ```

3. **Quick recovery**: Production messed up?
   ```bash
   git reset --hard origin/adrian
   ```

4. **Share between machines**: Everything in `/srv/prism-shared` syncs!

---

## 🆘 HELP

Lost? Just run:
```bash
prism-check        # See everything
pwd                # Where am I?
git status         # What's changed?
git branch         # What branch?
```

---

## NEXT: When Ready for MCP (Phase 4)

You'll have:
- Complete context persistence
- AI agents helping you code
- Never lose your place again!

But for now, enjoy your organized environment! 🎉