ALACRITTY - FEATURES FUNCTIONS SHORTCUTS KEYSTROKE ALIAS BINDINGS NAVIGATION PRODUCTIVITY

And absolutely - you're not dreaming! The terminal is basically a **file management powerhouse** once you know the tricks. Let me show you around your new digital cabin! 🏠

## **Basic Navigation & File Management:**

```bash
# Where am I?
pwd                              # Print working directory

# What's here?
ls                              # List files
ls -la                          # List with details + hidden files
ls -lah                         # Human-readable file sizes

# Move around
cd Documents                    # Change to Documents folder
cd ..                          # Go up one level
cd ~                           # Go to home directory
cd -                           # Go back to previous directory

# File operations
mkdir my-project               # Create directory
touch file.txt                # Create empty file
cp file.txt backup.txt         # Copy file
mv file.txt renamed.txt        # Move/rename file
rm file.txt                    # Delete file (BE CAREFUL!)
rm -rf folder/                 # Delete folder and contents (VERY CAREFUL!)
```

## **Why 'clear' Doesn't Work:**
On macOS with zsh, try these instead:
```bash
cls                            # Clear screen (if aliased)
⌘ + K                         # Command+K to clear (in most terminals)
printf '\33c\e[3J'            # Nuclear clear option
```

Let's fix this by adding a proper alias:
```bash
echo "alias clear='printf \"\\\33c\\\e[3J\"'" >> ~/.zshrc
source ~/.zshrc
# Now 'clear' should work!
```

## **Modern File Browsing (Let's Install Some Power Tools!):**

```bash
# Install better file listing
brew install exa               # Modern 'ls' replacement
brew install tree              # Directory tree viewer
brew install bat               # Better 'cat' with syntax highlighting
brew install fd                # Modern 'find' replacement

# Now try these:
exa -la                        # Beautiful file listing with icons
tree                           # See directory structure as tree
tree -L 2                      # Limit depth to 2 levels
bat file.txt                   # View file with syntax highlighting
fd filename                    # Find files super fast
```

## **Productivity Keyboard Shortcuts:**

```bash
# Navigation shortcuts
Ctrl + A                       # Beginning of line
Ctrl + E                       # End of line
Ctrl + U                       # Delete line
Ctrl + L                       # Clear screen (alternative)
Ctrl + R                       # Search command history
Ctrl + C                       # Kill current process

# With your Starship setup:
Tab                           # Auto-complete (try typing "cd Doc" then tab)
↑/↓ arrows                    # Command history
Ctrl + R                      # Fuzzy search history
```

## **File Content Viewing:**

```bash
cat file.txt                   # Display file contents
less file.txt                 # View file page by page (q to quit)
head file.txt                 # First 10 lines
tail file.txt                 # Last 10 lines
tail -f logfile.txt           # Follow file in real-time
```

## **Quick Directory Jumping:**

```bash
# Install 'z' for smart directory jumping
brew install z

# After using it a while, you can do:
z documents                    # Jump to Documents (or any frequently visited dir)
z proj                        # Jump to project folder
```

## **File Search & Management:**

```bash
# Find files
find . -name "*.txt"          # Find all .txt files
grep "search term" *.txt      # Search inside files
which node                    # Find where a command is located

# Disk usage
du -sh *                      # See folder sizes
df -h                         # See disk space
```

## **Let's Set Up a Productivity Alias Collection:**

```bash
cat >> ~/.zshrc << 'EOF'

# Productivity aliases
alias ll='exa -la'            # Better long listing
alias la='exa -a'             # Show hidden files
alias tree='tree -C'         # Colorized tree
alias ..='cd ..'              # Quick up one level
alias ...='cd ../..'          # Quick up two levels
alias h='history'             # Quick history
alias grep='grep --color=auto'  # Colored grep
alias mkdir='mkdir -p'        # Create parent dirs automatically

# Quick navigation
alias docs='cd ~/Documents'
alias desk='cd ~/Desktop'
alias down='cd ~/Downloads'

EOF

source ~/.zshrc               # Reload your shell config
```

Try some of these out! Your terminal is now a file management beast! What would you like to explore first? 🚀📁