from pathlib import Path

# Markdown cheatsheet for Cursor editor
cursor_cheatsheet = """
# 🧠 Cursor Editor – AI-Enhanced Code Editor Cheat Sheet (Markdown Edition)

A handy guide to using **Cursor**, the AI-powered VS Code fork for rapid, intelligent development.

---

## 🚀 Basic Commands

| Action                         | Shortcut (macOS / Linux)       |
|-------------------------------|--------------------------------|
| Open Command Palette          | `Cmd+Shift+P` / `Ctrl+Shift+P` |
| Open AI Chat (in-file)        | `Cmd+K` / `Ctrl+K`             |
| Accept Inline Suggestion      | `Tab`                          |
| Ask AI about code             | Select code → `Cmd+K`          |
| Refactor Code via AI          | Highlight → Right Click > AI   |
| Create File from Prompt       | `Cmd+N` + type natural request |
| Explain Code Snippet          | `Cmd+K` over code block        |

---

## 🤖 AI Prompt Examples

- `"What does this function do?"`
- `"Refactor this into a class."`
- `"Add error handling here."`
- `"Explain this regex like I'm 5."`
- `"Write unit tests for this function."`

---

## 🔧 Must-Have Extensions

| Purpose         | Extension                         |
|----------------|-----------------------------------|
| Linting         | `ESLint`, `Pylint`                |
| Formatting      | `Prettier`                        |
| Python Support  | `Python (Microsoft)`              |
| Containers      | `Docker`, `Dev Containers`        |
| Git Utilities   | `GitLens`                         |
| API Testing     | `REST Client`                     |
| Documentation   | `Markdown All in One`             |
| Snippets        | `CodeSnap`                        |
| Icons & Theme   | `Material Icon Theme`, `Tokyo Night` |

---

## 🧙 Jeeves’ Pro Tips

- Use `Cmd+K` liberally – AI understands context across files.
- Refactor multi-file logic by saying `"Refactor this pattern across project."`
- GPT-4 is far more accurate – worth enabling if you can.
- Cursor supports full VS Code extensions – power it up!

---

## 📁 File Location Notes

If you extracted Cursor manually:
```bash
~/.local/opt/cursor/squashfs-root/AppRun
