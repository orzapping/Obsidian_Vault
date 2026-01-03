# Tmux Cheatsheet for AI Developers

## The "Magic" Key (Prefix)
**Default:** `Ctrl + b`
*Instructions: Press `Ctrl` and `b` together, release both, then press the desired key.*

---

## 🚀 Essentials

| Action | Shortcut |
| :--- | :--- |
| **Start new session** | `tmux` (in terminal) |
| **Detach session** (Leave running in bg) | `Prefix` + `d` |
| **List sessions** | `tmux ls` (in terminal) |
| **Attach to last session** | `tmux attach` (in terminal) |
| **Attach to specific session** | `tmux attach -t <session_name>` |

---

## 🪟 Panes (Splits)

| Action | Shortcut |
| :--- | :--- |
| **Vertical Split** (Left/Right) | `Prefix` + `|` (Custom) or `%` |
| **Horizontal Split** (Top/Bottom) | `Prefix` + `-` (Custom) or `"` |
| **Move Focus** | `Prefix` + `Arrow Keys` |
| **Zoom Pane** (Focus Mode) | `Prefix` + `z` (Toggle on/off) |
| **Convert Pane to Window** | `Prefix` + `!` |
| **Close Pane** | `Prefix` + `x` or type `exit` |
| **Scroll History** | `Prefix` + `[` (Press `q` to exit) |

---

## 📑 Windows (Tabs)

| Action | Shortcut |
| :--- | :--- |
| **New Window** | `Prefix` + `c` |
| **Next Window** | `Prefix` + `n` |
| **Previous Window** | `Prefix` + `p` |
| **Rename Window** | `Prefix` + `,` |
| **Go to Window #** | `Prefix` + `1`...`9` |

---

## 🖱️ Mouse Powers (Enabled)
*Since we enabled mouse support in your config:*
*   **Click** a pane to focus it.
*   **Drag** pane borders to resize.
*   **Scroll wheel** to scroll through history automatically.

---

## 💡 Pro Tips for AI Workflows

1.  **The "Think" Space:** Keep your AI agent in a zoomed pane (`Prefix + z`). When you need to copy code, zoom out, verify context in your editor pane, then zoom back in.
2.  **Scrollback Search:** In copy mode (`Prefix + [`), press `Ctrl + s` to search forward for text (like error messages or specific code snippets).
3.  **Session Naming:** Start named sessions for different projects:
    `tmux new -s my-project`
    This makes it easier to find the right "workspace" later with `tmux ls`.
