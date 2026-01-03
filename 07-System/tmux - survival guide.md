# Start a new named session
tmux new -s argus

# Detach (keeps running in background)
Ctrl+b, d

# List sessions
tmux ls

# Reattach
tmux attach -t argus

# Split horizontally
Ctrl+b, "

# Split vertically  
Ctrl+b, %

# Navigate panes
Ctrl+b, arrow keys

# Kill pane
Ctrl+b, x

## Pro Tips for tmux (Since You're New to It)

**Session Management:**

bash

```bash
tmux ls                    # List sessions
tmux kill-session -t argus # Kill a session
tmux rename-session new    # Rename current session
```

**Pane Management:**

bash

```bash
Ctrl+b z                   # Zoom current pane (toggle)
Ctrl+b x                   # Kill current pane
Ctrl+b {                   # Move pane left
Ctrl+b }                   # Move pane right
Ctrl+b Space               # Cycle through layouts
```

**Copy Mode (scrollback):**

bash

```bash
Ctrl+b [                   # Enter copy mode
q                          # Exit copy mode
# Use arrow keys or Page Up/Down to scroll
```

**Useful .tmux.conf additions:**

bash

```bash
# Mouse support (highly recommended)
set -g mouse on

# Start window numbering at 1
set -g base-index 1

# Increase scrollback
set -g history-limit 10000
```