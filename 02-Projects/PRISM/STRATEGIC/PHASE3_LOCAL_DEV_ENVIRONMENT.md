# Phase 3: Local Development Environment Setup
## Creating Your Structured Development Workflow

---

## CURRENT SITUATION

### What We Have Now:
- ✅ **File sharing working** between Mac/Linux via Samba
- ✅ **GOLDEN-SOURCE** established at `/srv/prism-shared/`
- ✅ **Project cleaned** and reorganized
- ✅ **adrian-oracle-reorg** branch pushed to GitHub
- ✅ **Single project directory** at `~/Development/Projects/project-prism`

### What Phase 3 Will Give You:
- 🎯 **Separate environments** for production vs experimentation
- 🎯 **Safe sandbox** where you can break things without fear
- 🎯 **Clear workflow** for features → testing → production
- 🎯 **Quick commands** to navigate between environments
- 🎯 **No more hesitation** about where to work

---

## THE PLAN: THREE DEVELOPMENT ZONES

```
~/Development/
├── 📁 PRISM-PRODUCTION/           # Safe, stable, production work
│   └── project-prism/             # Tracks 'main' or 'adrian' branch
│
├── 📁 PRISM-SANDBOX/              # Wild west - break anything!
│   └── project-prism-sandbox/    # Separate clone for experiments
│
└── 📁 PRISM-FEATURES/             # Individual feature development
    ├── feature-k-asa/             # New K-ASA calculator
    ├── feature-k-aum/             # New K-AUM calculator
    └── feature-[name]/            # Any new feature
```

---

## IMPLEMENTATION STEPS

### Step 1: Create Directory Structure
```bash
# Create the three zones
mkdir -p ~/Development/PRISM-PRODUCTION
mkdir -p ~/Development/PRISM-SANDBOX  
mkdir -p ~/Development/PRISM-FEATURES
```

### Step 2: Set Up Production Environment
```bash
# Move current project to production zone
mv ~/Development/Projects/project-prism ~/Development/PRISM-PRODUCTION/

# Create symlink for backward compatibility
ln -s ~/Development/PRISM-PRODUCTION/project-prism ~/Development/Projects/project-prism
```

### Step 3: Set Up Sandbox Environment
```bash
# Clone fresh copy for sandbox
cd ~/Development/PRISM-SANDBOX
git clone git@github.com:orzapping/Project_Prism.git project-prism-sandbox

# Check out experimental branch
cd project-prism-sandbox
git checkout -b sandbox/main-playground
```

### Step 4: Create Quick Access Commands
Add to `~/.bashrc` or `~/.zshrc`:
```bash
# PRISM Navigation Commands
alias prism-prod="cd ~/Development/PRISM-PRODUCTION/project-prism && pwd && git status"
alias prism-sandbox="cd ~/Development/PRISM-SANDBOX/project-prism-sandbox && pwd && git status"
alias prism-features="cd ~/Development/PRISM-FEATURES && pwd && ls -la"
alias prism-shared="cd /srv/prism-shared && pwd && ls -la"

# PRISM Git Commands
alias prism-status="echo '=== PRODUCTION ===' && cd ~/Development/PRISM-PRODUCTION/project-prism && git status --short && echo -e '\n=== SANDBOX ===' && cd ~/Development/PRISM-SANDBOX/project-prism-sandbox && git status --short"

# PRISM Feature Creation
function prism-new-feature() {
    if [ -z "$1" ]; then
        echo "Usage: prism-new-feature <feature-name>"
        return 1
    fi
    cd ~/Development/PRISM-FEATURES
    git clone git@github.com:orzapping/Project_Prism.git feature-$1
    cd feature-$1
    git checkout -b feature/$1
    echo "Feature workspace created at: $(pwd)"
}
```

---

## WORKFLOW CHEAT SHEET

### 🟢 PRODUCTION WORK (Safe, Careful)
```bash
prism-prod                          # Go to production
git checkout adrian                 # Work on main branch
# ... make careful changes ...
git add .
git commit -m "feat: Add feature"
git push origin adrian
```

### 🟡 FEATURE DEVELOPMENT (Isolated)
```bash
prism-new-feature k-asa            # Create feature workspace
# ... develop new feature ...
git add .
git commit -m "feat: K-ASA calculator implementation"
git push origin feature/k-asa
# Create PR on GitHub when ready
```

### 🔴 SANDBOX EXPERIMENTATION (Go Wild!)
```bash
prism-sandbox                       # Go to sandbox
git checkout -b sandbox/crazy-idea
# ... break everything, try wild ideas ...
git add .
git commit -m "EXPERIMENT: Trying something crazy"

# If it works, cherry-pick to production:
git log --oneline                  # Find commit hash
prism-prod                          # Switch to production
git cherry-pick <commit-hash>      # Bring over the good stuff
```

---

## SAFETY RULES & BEST PRACTICES

### Production Zone Rules
1. ✅ **Always pull before starting work**: `git pull origin adrian`
2. ✅ **Small, focused commits**: One feature per commit
3. ✅ **Test before pushing**: `npm run build` should pass
4. ✅ **Descriptive commit messages**: "feat:", "fix:", "docs:"

### Sandbox Zone Rules
1. 🎮 **Anything goes!** Break it, fix it, learn
2. 🎮 **Commit often**: Create restore points
3. 🎮 **Tag interesting points**: `git tag experiment-1`
4. 🎮 **Don't push to main branches**: Keep experiments in sandbox/* branches

### Feature Zone Rules
1. 🔧 **One feature = One directory**: Keep features isolated
2. 🔧 **Branch naming**: Always `feature/[name]`
3. 🔧 **PR when ready**: Use GitHub Pull Requests for review
4. 🔧 **Delete after merge**: Clean up merged feature directories

---

## QUICK REFERENCE CARD

### Daily Commands
```bash
# Morning startup
prism-status              # See what's where
prism-prod               # Start in production
git pull                 # Get latest changes

# Switching contexts
prism-sandbox            # Time to experiment
prism-prod              # Back to serious work
prism-shared            # Check shared files

# Creating new work
prism-new-feature xyz    # New feature workspace
git checkout -b fix/bug  # Quick fix branch

# Saving work
git add .
git commit -m "type: description"
git push origin branch-name
```

### Git Branch Strategy
```
main/adrian         → Production (protected)
feature/*          → New features (PR required)
sandbox/*          → Experiments (never merge directly)
fix/*              → Bug fixes (quick merge)
```

### Commit Message Format
```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructuring
test:     Test additions
chore:    Maintenance
```

---

## TROUBLESHOOTING

### "I don't know where to work!"
- **New feature?** → `prism-new-feature name`
- **Experiment?** → `prism-sandbox`
- **Bug fix?** → `prism-prod` on a fix/* branch
- **Documentation?** → `/srv/prism-shared/GOLDEN-SOURCE/`

### "I messed up production!"
```bash
git reset --hard HEAD~1    # Undo last commit
git reset --hard origin/adrian  # Reset to GitHub state
```

### "I want sandbox changes in production!"
```bash
# In sandbox, note the commit hash
git log --oneline

# In production
git cherry-pick <hash>     # Bring specific commit
# OR
git checkout sandbox/branch -- path/to/file  # Bring specific file
```

### "I lost track of branches!"
```bash
prism-status               # See all environments
git branch -a              # See all branches
git log --graph --oneline  # See commit history
```

---

## ENVIRONMENT VALIDATION CHECKLIST

After setup, verify:
- [ ] Can navigate with `prism-prod`, `prism-sandbox`
- [ ] Production points to adrian branch
- [ ] Sandbox has separate clone
- [ ] Quick commands work in terminal
- [ ] Can create new feature with `prism-new-feature test`
- [ ] Shared files accessible from both Mac and Linux

---

## NEXT STEPS AFTER PHASE 3

With your structured environment, you'll be ready for:
- **Phase 4**: MCP Server integration (context persistence!)
- **Phase 5**: Workflow automation
- **Phase 6**: Agent deployment

But first, let's get this foundation rock-solid!

---

## READY TO IMPLEMENT?

This gives you:
- **Clear separation** between safe and experimental work
- **No hesitation** - always know where to work
- **Quick recovery** from any mistakes
- **Professional workflow** like a proper dev team

Shall we proceed with setting this up?