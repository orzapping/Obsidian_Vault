## tmux Workflow for ARGUS Development

Here's how I'd set it up:

# Create the session
tmux new -s argus

# You'll start in pane 0 - this is your Claude Code pane
# Split vertically (creates pane 1 on the right)
Ctrl+b %

# In pane 1, split horizontally (creates pane 2 below it)
Ctrl+b "

# Now you have:
# ┌─────────────────┬─────────────────┐
# │                 │  Pane 1: Tests  │
# │  Pane 0: CC     ├─────────────────┤
# │                 │  Pane 2: Scan   │
# └─────────────────┴─────────────────┘

# Navigate between panes
Ctrl+b, arrow keys

# In pane 0: Run Claude Code
cd ~/project-theta
claude

# In pane 1: Run tests on change
cd ~/project-theta
poetry run pytest --tb=short -v

# In pane 2: Watch scan results (once CLI is working)
cd ~/project-theta
watch -n 300 'poetry run theta scan --top 5 2>/dev/null'

# Detach when done (session persists!)
Ctrl+b d

# Reattach later
tmux attach -t argus