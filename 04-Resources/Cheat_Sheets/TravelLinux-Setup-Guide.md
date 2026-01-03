# TravelLinux (Asahi) - Complete Dev Environment Setup

> Setting up M1 MacBook Pro (Asahi Linux) as a full development workstation
>
> **Created**: 2026-01-03
> **Purpose**: NYC trip development continuity

---

## 🎯 Overview

This guide replicates your Linux command station environment on TravelLinux (Asahi/Fedora on M1 Mac) so you can continue development work while traveling.

### What We're Setting Up
- [x] Core dev tools (Node, Git, editors)
- [x] GitHub authentication
- [x] Claude Code CLI
- [x] Ralph autonomous development
- [x] All project repositories
- [x] Obsidian vault

---

## 📦 Phase 1: Core Development Tools

### 1.1 Update System First
```bash
# Asahi/Fedora
sudo dnf update -y
```

### 1.2 Install Node.js (v22 LTS)
```bash
# Option A: DNF (may be older version)
sudo dnf install nodejs npm -y

# Option B: NodeSource (recommended for v22)
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install nodejs -y

# Verify
node --version  # Should be v22.x
npm --version   # Should be 10.x+
```

### 1.3 Install Git
```bash
sudo dnf install git -y
git --version
```

### 1.4 Configure Git Identity
```bash
git config --global user.name "orzapping"
git config --global user.email "orzapping@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global pull.rebase false

# Add useful aliases
git config --global alias.today "log --since=midnight --oneline"
git config --global alias.week "log --since='1 week ago' --oneline"
git config --global alias.visual "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

---

## 🔐 Phase 2: GitHub Authentication

### 2.1 Install GitHub CLI
```bash
sudo dnf install gh -y
```

### 2.2 Authenticate with GitHub
```bash
gh auth login
```
Follow the prompts:
- Select **GitHub.com**
- Select **HTTPS**
- Authenticate via **browser** (easiest)

### 2.3 Configure Git to Use GH Credentials
```bash
gh auth setup-git
```

### 2.4 Verify Authentication
```bash
gh auth status
# Should show: ✓ Logged in to github.com as orzapping
```

---

## 🤖 Phase 3: Claude Code CLI

### 3.1 Install Claude Code
```bash
# Using npm (recommended)
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### 3.2 Authenticate Claude
```bash
claude
# Follow prompts to authenticate with your Anthropic account
```

### 3.3 Configure Claude Settings (Optional)
```bash
# Set preferred model if needed
claude config set model claude-sonnet-4-20250514
```

---

## 🔄 Phase 4: Ralph Autonomous Development

### 4.1 Clone Ralph
```bash
cd ~
git clone https://github.com/frankbria/ralph-claude-code.git
cd ralph-claude-code
```

### 4.2 Install Ralph
```bash
./install.sh
```

### 4.3 Verify Ralph
```bash
ralph --help
ralph-setup --help
```

### 4.4 Add to PATH (if not automatic)
```bash
echo 'export PATH="$HOME/.ralph:$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

## 💻 Phase 5: Code Editors

### 5.1 VS Code
```bash
# Fedora/Asahi
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
sudo dnf install code -y
```

### 5.2 Cursor (Optional)
```bash
# Download from cursor.sh
# Or use the AppImage:
cd ~/Downloads
chmod +x cursor-*.AppImage
./cursor-*.AppImage
```

---

## 📁 Phase 6: Clone All Projects

### 6.1 Create Development Directory
```bash
mkdir -p ~/Development/Projects
cd ~/Development/Projects
```

### 6.2 Clone Repositories
```bash
cd ~/Development/Projects

# ORCAP Transaction Management (critical for NYC)
gh repo clone orzapping/Orcap_tx_mgmt_system orcap-tx-mgmt

# ORCAP Website
gh repo clone orzapping/orcap_website

# CRAMPT (compliance platform)
gh repo clone orzapping/crampt

# Project Theta
gh repo clone orzapping/project-theta

# Project Manifold
gh repo clone orzapping/project-manifold

# PRISM (the big one)
gh repo clone orzapping/Project_Prism prism-sandbox

# Obsidian Vault (in home directory)
cd ~
gh repo clone orzapping/Obsidian_Vault Obsidian-Vault
```

### 6.3 Install Dependencies for Each Project
```bash
# ORCAP TX Management
cd ~/Development/Projects/orcap-tx-mgmt/orcap-app
npm install

# ORCAP Website
cd ~/Development/Projects/orcap_website
npm install

# CRAMPT
cd ~/Development/Projects/crampt
npm install

# Project Theta (check for package.json first)
cd ~/Development/Projects/project-theta
npm install 2>/dev/null || echo "No npm deps"

# Project Manifold (likely Python)
cd ~/Development/Projects/project-manifold
pip install -r requirements.txt 2>/dev/null || echo "No pip deps"

# PRISM
cd ~/Development/Projects/prism-sandbox
npm install 2>/dev/null || echo "Check PRISM setup"
```

---

## 🔧 Phase 7: Environment Variables

### 7.1 Create .env Files

**For CRAMPT** (`~/Development/Projects/crampt/.env`):
```bash
# Copy from your Linux machine or create:
cat << 'EOF' > ~/Development/Projects/crampt/.env
NEXT_PUBLIC_SUPABASE_URL="https://ftbeykyapikiugxrciqe.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key-here"
DATABASE_URL="your-connection-string-here"
DIRECT_URL="your-direct-url-here"
EOF
```

> ⚠️ **Security**: Never commit .env files. Copy these securely from your Linux machine.

### 7.2 Secure Transfer of Secrets
Options for transferring .env files:
1. **USB drive** (most secure)
2. **Encrypted email** to yourself
3. **Password manager** (1Password, Bitwarden)
4. **Temporary encrypted file share**

---

## 📊 Phase 8: Data Migration

### 8.1 ORCAP Data (IndexedDB)
See [[ORCAP-NYC-Travel-Guide]] for backup/restore process:
1. Export backup on Linux (Settings → Export Full Backup)
2. Transfer JSON file
3. Import on TravelLinux browser

### 8.2 CRAMPT Data
CRAMPT uses Supabase (cloud database) - no migration needed!
Just ensure .env has correct credentials.

---

## ✅ Phase 9: Verification Checklist

Run through this to confirm everything works:

```bash
# System tools
node --version          # v22.x
npm --version           # 10.x+
git --version           # 2.x
gh auth status          # Logged in

# Claude & Ralph
claude --version        # Should show version
ralph --help           # Should show help

# Projects
cd ~/Development/Projects/orcap-transaction-mgmt/orcap-app
npm run dev             # Should start on :5173

cd ~/Development/Projects/crampt
npm run dev             # Should start on :3000

# Obsidian
ls ~/Obsidian-Vault     # Should show vault contents
```

---

## 🚀 Quick Start Commands (Daily Use)

### Start ORCAP
```bash
cd ~/Development/Projects/orcap-transaction-mgmt/orcap-app
npm run dev
# Open http://localhost:5173
```

### Start CRAMPT
```bash
cd ~/Development/Projects/crampt
npm run dev
# Open http://localhost:3000
```

### Run Ralph on a Project
```bash
cd ~/Development/Projects/crampt
ralph --verbose
# Or with monitor (needs separate terminal, not tmux-in-tmux)
```

### Open Obsidian
```bash
# If using Obsidian app
obsidian ~/Obsidian-Vault

# Or open in VS Code
code ~/Obsidian-Vault
```

---

## 🛠️ Troubleshooting

### "Permission denied" on npm install
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### GitHub authentication issues
```bash
gh auth logout
gh auth login
gh auth setup-git
```

### Claude CLI not found
```bash
# Check if installed
which claude || npm install -g @anthropic-ai/claude-code

# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Ralph not found
```bash
# Re-run install
cd ~/ralph-claude-code
./install.sh

# Add to PATH manually
echo 'export PATH="$HOME/.ralph:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Node version too old
```bash
# Install nvm for version management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
nvm alias default 22
```

---

## 📋 Pre-Departure Checklist

### On Linux (Before Leaving)
- [ ] Push all projects to GitHub
- [ ] Export ORCAP backup (Settings → Export Full Backup)
- [ ] Copy .env files to secure location
- [ ] Push Obsidian vault to GitHub
- [ ] Note any in-progress work in project READMEs

### On TravelLinux (After Setup)
- [ ] All tools installed and verified
- [ ] All repos cloned
- [ ] .env files configured
- [ ] ORCAP backup imported
- [ ] Test each project runs
- [ ] Claude Code authenticated
- [ ] Ralph working

---

## 🔄 Sync Workflow (During Trip)

### Daily Habit
```bash
# Start of work session
cd ~/Development/Projects/<project>
git pull

# End of work session
git add .
git commit -m "chore: NYC work session $(date +%Y-%m-%d)"
git push
```

### Before Returning Home
1. Commit and push all changes
2. Export ORCAP backup (if data changed)
3. Note any new dependencies added

---

## 📱 Quick Reference

```
┌─────────────────────────────────────────────────┐
│  TRAVELLINUX QUICK REFERENCE                    │
├─────────────────────────────────────────────────┤
│  GitHub auth:    gh auth login                  │
│  Clone repo:     gh repo clone user/repo        │
│  Start ORCAP:    cd orcap-app && npm run dev    │
│  Start CRAMPT:   cd crampt && npm run dev       │
│  Run Ralph:      ralph --verbose                │
│  Claude Code:    claude                         │
├─────────────────────────────────────────────────┤
│  PORTS                                          │
│  ORCAP:     http://localhost:5173               │
│  CRAMPT:    http://localhost:3000               │
└─────────────────────────────────────────────────┘
```

---

## 🔗 Related Guides

- [[ORCAP-NYC-Travel-Guide]] - ORCAP-specific travel guide
- [[git-workflow-cheatsheet]] - Git commands reference
- [[RALPH_CHEATSHEET]] - Ralph autonomous dev method

---

*Created with Claude Code - Happy travels and productive coding!*
