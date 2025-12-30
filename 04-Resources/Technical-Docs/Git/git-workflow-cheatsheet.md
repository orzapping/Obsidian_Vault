# Git & Development Workflow Cheat Sheet

## 📊 Review Today's Work

### See What You've Done Today
```bash
# Show all commits from today
git log --since="00:00" --oneline --graph

# More detailed view with changes
git log --since="00:00" --stat

# See actual code changes today
git log --since="00:00" -p

# Just see commit messages and times
git log --since="00:00" --pretty=format:"%h %ad | %s" --date=short

# See what files changed today
git diff --stat HEAD@{1.day.ago}
```

### Review Specific Time Periods
```bash
# Last 24 hours
git log --since="24 hours ago" --oneline

# This week
git log --since="1 week ago" --oneline --author="Your Name"

# Between dates
git log --since="2024-06-20" --until="2024-06-24" --oneline
```

### See File Changes
```bash
# What files have been modified
git status

# What changed in a specific file
git diff docs/technical/completed/FOR-calculator.md

# List all files changed in last 5 commits
git diff --name-only HEAD~5

# Show which files were added/modified/deleted today
git diff --name-status HEAD@{1.day.ago}
```

## 🚀 Essential Git Commands

### Daily Workflow
```bash
# Start your day - update from remote
git pull

# Check what you're working on
git status

# Stage changes
git add .                    # Add everything
git add -p                   # Add interactively (choose chunks)
git add docs/*.md           # Add specific pattern

# Commit with message
git commit -m "type: description"

# Push to remote
git push
```

### Commit Message Format
```bash
feat:     # New feature
fix:      # Bug fix  
docs:     # Documentation only
style:    # Formatting, no code change
refactor: # Code restructuring
test:     # Adding tests
chore:    # Maintenance
```

### Viewing History
```bash
# Pretty one-line log
git log --oneline -10

# Graph view
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# Search commits
git log --grep="calculator"

# Show commits by author
git log --author="Your Name"
```

### Undoing Things
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename.txt

# Amend last commit
git commit --amend

# Stash work temporarily
git stash
git stash pop
```

## 💡 Useful Aliases

Add these to your `~/.gitconfig` or `~/.bashrc`:

```bash
# Git aliases (~/.gitconfig)
[alias]
    st = status
    co = checkout
    br = branch
    cm = commit -m
    unstage = reset HEAD --
    last = log -1 HEAD
    today = log --since=midnight --oneline
    week = log --since='1 week ago' --oneline
    visual = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    
# Bash aliases (~/.bashrc)
alias gs='git status'
alias ga='git add'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline -10'
alias gtoday='git log --since=midnight --oneline'

# Project navigation
alias dev='cd ~/Development/Projects'
alias prism='cd ~/Development/Projects/mifidpru-risk-model'
alias docs='cd ~/Development/Projects/mifidpru-risk-model/docs'

# Project assistant
alias pa='~/Development/Tools/Scripts/project-assistant.py'
```

## 🔍 Project-Specific Commands

### Using Your Project Assistant
```bash
# Check all projects status
pa status

# Switch to PRISM project
pa switch mifidpru-risk-model

# Log work done
pa log "Implemented FOR calculator with 24 subcategories"

# Daily summary
pa daily
```

### Quick Project Stats
```bash
# Count lines of code
find . -name "*.html" -o -name "*.js" | xargs wc -l

# Count documentation files
find docs -name "*.md" | wc -l

# See directory structure
tree -L 3 -I 'node_modules'

# Find TODO comments
grep -r "TODO" --include="*.md" --include="*.html" .
```

## ⌨️ VS Code Shortcuts

### Essential Shortcuts
```
Ctrl+P          # Quick file open
Ctrl+Shift+P    # Command palette
Ctrl+`          # Toggle terminal
Ctrl+B          # Toggle sidebar
Ctrl+Shift+E    # Explorer
Ctrl+Shift+F    # Search in files
Ctrl+Shift+G    # Source control (Git)
Alt+↑/↓         # Move line up/down
Shift+Alt+↓     # Duplicate line
Ctrl+/          # Toggle comment
```

### Multi-Cursor Magic
```
Ctrl+D          # Select next occurrence
Ctrl+Shift+L    # Select all occurrences  
Alt+Click       # Add cursor
Ctrl+Alt+↓      # Add cursor below
```

## 📁 File Organization Review

### See Project Structure
```bash
# Basic structure
ls -la

# Tree view (if installed)
tree -L 2

# Find large files
find . -type f -size +1M -exec ls -lh {} \;

# Find recently modified
find . -type f -mtime -1 -ls
```

### Search Content
```bash
# Find text in files
grep -r "K-factor" docs/

# Find files by name
find . -name "*calculator*"

# Case-insensitive search
grep -ri "mifidpru" .
```

## 🎯 Daily Routine Commands

### Morning Start
```bash
cd ~/Development/Projects/mifidpru-risk-model
git pull
pa status
git status
```

### During Work
```bash
# After making changes
git add .
git commit -m "feat: add new feature"

# Log with project assistant
pa log "What I just did"

# Quick save point
git stash push -m "WIP: working on X"
```

### End of Day
```bash
# Review what you did
git today  # Using alias
pa daily

# Final commit and push
git add .
git commit -m "chore: end of day commit"
git push

# See summary
git log --since="00:00" --stat
```

## 🔧 Troubleshooting

### Common Issues
```bash
# Forgot to pull before working
git stash
git pull
git stash pop

# Wrong commit message
git commit --amend

# Need to see what changed
git diff HEAD~1

# Lost in Git history
git reflog
```

## 📝 Quick Reference Card

```
Daily Flow:
1. git pull                 # Start fresh
2. git status              # Check state
3. git add .               # Stage changes
4. git commit -m "msg"     # Commit
5. git push                # Share work
6. pa log "what I did"     # Log work

Review Commands:
- git today                # Today's commits
- git week                 # Week's work
- git visual               # Pretty graph
- pa daily                 # Full summary

Navigation:
- prism                    # Go to project
- docs                     # Go to docs
- pa switch project-name   # Switch projects
```

---

**Pro Tip**: Print this out and keep it next to your monitor for the first week. After that, you'll have memorized the commands you use most!