#!/bin/bash
#===============================================================================
# TravelLinux Dev Environment Setup Script
# For: Asahi Linux (Fedora) on M1 MacBook Pro
# Author: Claude + Adrian
# Date: 2026-01-03
#===============================================================================

set -e  # Exit on error

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

#===============================================================================
# PRE-FLIGHT CHECKS
#===============================================================================
print_header "Pre-Flight Checks"

# Check if running on Fedora/Asahi
if ! command -v dnf &> /dev/null; then
    print_error "This script is designed for Fedora/Asahi Linux (dnf not found)"
    exit 1
fi
print_success "Running on Fedora/Asahi"

# Check gh auth
if ! gh auth status &> /dev/null; then
    print_error "GitHub CLI not authenticated. Run: gh auth login"
    exit 1
fi
print_success "GitHub CLI authenticated"

# Check node
if ! command -v node &> /dev/null; then
    print_error "Node.js not installed. Run: sudo dnf install nodejs npm"
    exit 1
fi
print_success "Node.js $(node --version) installed"

#===============================================================================
# PHASE 1: ESSENTIAL CLI TOOLS
#===============================================================================
print_header "Phase 1: Essential CLI Tools"

print_step "Installing development tools..."
sudo dnf install -y \
    bat \
    ripgrep \
    fd-find \
    fzf \
    htop \
    tree \
    jq \
    tmux \
    curl \
    wget \
    unzip \
    zsh \
    2>/dev/null || print_warning "Some packages may not be available"

print_success "CLI tools installed"

# bat = better cat with syntax highlighting
# ripgrep = fast grep (rg)
# fd-find = fast find
# fzf = fuzzy finder
# htop = better top
# tree = directory tree view
# jq = JSON processor
# tmux = terminal multiplexer

#===============================================================================
# PHASE 2: SHELL ENHANCEMENTS (Optional Oh-My-Zsh)
#===============================================================================
print_header "Phase 2: Shell Enhancements"

read -p "Install Oh-My-Zsh? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ ! -d "$HOME/.oh-my-zsh" ]; then
        print_step "Installing Oh-My-Zsh..."
        sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
        print_success "Oh-My-Zsh installed"

        # Add useful plugins
        print_step "Configuring Zsh plugins..."
        sed -i 's/plugins=(git)/plugins=(git node npm docker fzf)/' ~/.zshrc

        # Add aliases
        cat >> ~/.zshrc << 'EOF'

# TravelLinux Aliases
alias ll='ls -la'
alias dev='cd ~/Development/Projects'
alias obs='cd ~/Obsidian-Vault'
alias gs='git status'
alias gp='git push'
alias gl='git log --oneline -10'

# Project shortcuts
alias orcap='cd ~/Development/Projects/orcap-tx-mgmt/orcap-app && npm run dev'
alias crampt='cd ~/Development/Projects/crampt && npm run dev'
alias prism='cd ~/Development/Projects/prism-sandbox'
alias theta='cd ~/Development/Projects/project-theta'
alias manifold='cd ~/Development/Projects/project-manifold'

# Bat instead of cat (if installed)
if command -v bat &> /dev/null; then
    alias cat='bat --paging=never'
fi
EOF
        print_success "Zsh configured with aliases"
    else
        print_warning "Oh-My-Zsh already installed"
    fi
else
    print_step "Skipping Oh-My-Zsh, adding aliases to bashrc..."
    cat >> ~/.bashrc << 'EOF'

# TravelLinux Aliases
alias ll='ls -la'
alias dev='cd ~/Development/Projects'
alias obs='cd ~/Obsidian-Vault'
alias gs='git status'
alias gp='git push'
alias gl='git log --oneline -10'

# Project shortcuts
alias orcap='cd ~/Development/Projects/orcap-tx-mgmt/orcap-app && npm run dev'
alias crampt='cd ~/Development/Projects/crampt && npm run dev'
alias prism='cd ~/Development/Projects/prism-sandbox'
alias theta='cd ~/Development/Projects/project-theta'
alias manifold='cd ~/Development/Projects/project-manifold'
EOF
    print_success "Bash aliases added"
fi

#===============================================================================
# PHASE 3: CLAUDE CODE CLI
#===============================================================================
print_header "Phase 3: Claude Code CLI"

if ! command -v claude &> /dev/null; then
    print_step "Installing Claude Code CLI..."
    npm install -g @anthropic-ai/claude-code
    print_success "Claude Code installed"
    print_warning "Run 'claude' to authenticate with your Anthropic account"
else
    print_success "Claude Code already installed: $(claude --version 2>/dev/null || echo 'installed')"
fi

#===============================================================================
# PHASE 4: RALPH AUTONOMOUS DEV FRAMEWORK
#===============================================================================
print_header "Phase 4: Ralph Framework"

if [ ! -d "$HOME/.ralph" ]; then
    print_step "Cloning Ralph..."
    git clone https://github.com/frankbria/ralph-claude-code.git ~/ralph-claude-code
    cd ~/ralph-claude-code
    print_step "Installing Ralph..."
    ./install.sh
    cd ~
    print_success "Ralph installed"
else
    print_success "Ralph already installed"
fi

#===============================================================================
# PHASE 5: DIRECTORY STRUCTURE
#===============================================================================
print_header "Phase 5: Directory Structure"

print_step "Creating development directories..."
mkdir -p ~/Development/Projects
mkdir -p ~/Development/Tools
mkdir -p ~/Development/Experiments
print_success "Directory structure created"

echo "
~/Development/
├── Projects/        # Active project repos
├── Tools/           # Utilities and scripts
└── Experiments/     # Sandbox and testing
"

#===============================================================================
# PHASE 6: CLONE REPOSITORIES
#===============================================================================
print_header "Phase 6: Clone Repositories"

cd ~/Development/Projects

# Function to clone if not exists
clone_repo() {
    local repo=$1
    local dir=$2
    if [ ! -d "$dir" ]; then
        print_step "Cloning $repo..."
        gh repo clone "orzapping/$repo" "$dir"
        print_success "Cloned $repo"
    else
        print_warning "$dir already exists, skipping"
    fi
}

# Clone all projects
clone_repo "Orcap_tx_mgmt_system" "orcap-tx-mgmt"
clone_repo "orcap_website" "orcap-website"
clone_repo "crampt" "crampt"
clone_repo "project-theta" "project-theta"
clone_repo "project-manifold" "project-manifold"
clone_repo "Project_Prism" "prism-sandbox"

# Obsidian vault in home directory
cd ~
if [ ! -d "Obsidian-Vault" ]; then
    print_step "Cloning Obsidian Vault..."
    gh repo clone orzapping/Obsidian_Vault Obsidian-Vault
    print_success "Cloned Obsidian Vault"
else
    print_warning "Obsidian-Vault already exists, pulling latest..."
    cd Obsidian-Vault && git pull && cd ~
fi

#===============================================================================
# PHASE 7: INSTALL DEPENDENCIES
#===============================================================================
print_header "Phase 7: Install Dependencies"

install_npm_deps() {
    local dir=$1
    local subdir=$2
    local full_path="$HOME/Development/Projects/$dir"
    if [ -n "$subdir" ]; then
        full_path="$full_path/$subdir"
    fi

    if [ -f "$full_path/package.json" ]; then
        print_step "Installing deps for $dir${subdir:+/$subdir}..."
        cd "$full_path"
        npm install --silent 2>/dev/null
        print_success "Dependencies installed for $dir"
    else
        print_warning "No package.json in $dir${subdir:+/$subdir}"
    fi
}

# Install npm dependencies
install_npm_deps "orcap-tx-mgmt" "orcap-app"
install_npm_deps "orcap-website"
install_npm_deps "crampt"
install_npm_deps "project-theta"
install_npm_deps "prism-sandbox"

# Manifold is Python - check for requirements.txt
if [ -f "$HOME/Development/Projects/project-manifold/requirements.txt" ]; then
    print_step "Installing Python deps for Manifold..."
    cd ~/Development/Projects/project-manifold
    pip install -r requirements.txt --quiet 2>/dev/null || print_warning "Pip install had issues"
    print_success "Python dependencies installed for Manifold"
fi

#===============================================================================
# PHASE 8: OBSIDIAN APP
#===============================================================================
print_header "Phase 8: Obsidian App"

if ! command -v obsidian &> /dev/null && ! [ -f "/usr/bin/obsidian" ]; then
    read -p "Install Obsidian app? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Downloading Obsidian AppImage..."
        mkdir -p ~/Applications
        cd ~/Applications

        # Get latest Obsidian AppImage
        curl -sL "https://github.com/obsidianmd/obsidian-releases/releases/download/v1.5.3/Obsidian-1.5.3.AppImage" -o Obsidian.AppImage
        chmod +x Obsidian.AppImage

        # Create desktop entry
        cat > ~/.local/share/applications/obsidian.desktop << EOF
[Desktop Entry]
Name=Obsidian
Exec=$HOME/Applications/Obsidian.AppImage
Icon=obsidian
Type=Application
Categories=Office;
EOF

        print_success "Obsidian installed at ~/Applications/Obsidian.AppImage"
        print_step "You can run it with: ~/Applications/Obsidian.AppImage"
    fi
else
    print_success "Obsidian already installed"
fi

#===============================================================================
# PHASE 9: VS CODE (Optional)
#===============================================================================
print_header "Phase 9: VS Code (Optional)"

if ! command -v code &> /dev/null; then
    read -p "Install VS Code? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Installing VS Code..."
        sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
        sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
        sudo dnf install code -y
        print_success "VS Code installed"
    fi
else
    print_success "VS Code already installed"
fi

#===============================================================================
# PHASE 10: GIT CONFIGURATION
#===============================================================================
print_header "Phase 10: Git Configuration"

print_step "Configuring Git..."
git config --global user.name "orzapping"
git config --global user.email "orzapping@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global pull.rebase false

# Useful aliases
git config --global alias.today "log --since=midnight --oneline"
git config --global alias.week "log --since='1 week ago' --oneline"
git config --global alias.visual "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.st "status"
git config --global alias.co "checkout"
git config --global alias.br "branch"

print_success "Git configured"

#===============================================================================
# SUMMARY
#===============================================================================
print_header "Setup Complete!"

echo -e "${GREEN}"
cat << 'EOF'
  _____                    _ _     _
 |_   _| __ __ ___   _____| | |   (_)_ __  _   ___  __
   | || '__/ _` \ \ / / _ \ | |   | | '_ \| | | \ \/ /
   | || | | (_| |\ V /  __/ | |___| | | | | |_| |>  <
   |_||_|  \__,_| \_/ \___|_|_____|_|_| |_|\__,_/_/\_\

EOF
echo -e "${NC}"

echo "
${CYAN}Projects Cloned:${NC}
  ~/Development/Projects/orcap-tx-mgmt     (ORCAP Transaction Management)
  ~/Development/Projects/orcap-website     (ORCAP Website)
  ~/Development/Projects/crampt            (CRAMPT Compliance Platform)
  ~/Development/Projects/project-theta     (Project Theta)
  ~/Development/Projects/project-manifold  (Project Manifold)
  ~/Development/Projects/prism-sandbox     (PRISM)
  ~/Obsidian-Vault                         (Obsidian Knowledge Base)

${CYAN}Quick Commands:${NC}
  dev        - cd to Projects folder
  obs        - cd to Obsidian vault
  orcap      - Start ORCAP dev server
  crampt     - Start CRAMPT dev server
  prism      - cd to PRISM project
  theta      - cd to Theta project
  manifold   - cd to Manifold project

${CYAN}Next Steps:${NC}
  1. Run 'claude' to authenticate Claude Code
  2. Import ORCAP backup: Settings → Select backup file
  3. Open Obsidian: ~/Applications/Obsidian.AppImage ~/Obsidian-Vault
  4. Restart terminal or run 'source ~/.bashrc' for aliases

${YELLOW}Remember:${NC}
  - Export ORCAP data before returning home!
  - Commit and push changes regularly!

${PURPLE}Happy coding in NYC! 🗽${NC}
"
