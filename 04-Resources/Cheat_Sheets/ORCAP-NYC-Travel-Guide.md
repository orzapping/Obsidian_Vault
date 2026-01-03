# ORCAP Transaction Management - NYC Travel Guide

> Quick reference for running ORCAP on MacBook Pro M1 (Asahi Linux or macOS)
>
> **Created**: 2026-01-03
> **Trip**: NYC January 2026

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Clone repo
git clone <your-repo-url> ~/orcap-transaction-mgmt

# 2. Install & run
cd ~/orcap-transaction-mgmt/orcap-app
npm install
npm run dev

# 3. Open browser
open http://localhost:5173
```

That's it! No database, no backend, no config needed.

---

## 📋 Pre-Flight Checklist

### Before Leaving Linux

- [ ] Export full backup from ORCAP (Settings → Export Full Backup)
- [ ] Save `orcap-full-backup-YYYY-MM-DD.json` file
- [ ] Transfer backup to MacBook (email/USB/cloud)
- [ ] Push latest code to GitHub
- [ ] Push Obsidian vault to GitHub

### On MacBook (First Time)

- [ ] Verify Node.js installed: `node --version` (need v18+)
- [ ] Clone repo: `git clone <url> ~/orcap-transaction-mgmt`
- [ ] Install: `cd ~/orcap-transaction-mgmt/orcap-app && npm install`
- [ ] Test: `npm run dev`
- [ ] Import backup: Settings → Select backup file → Import

---

## 💻 System Requirements

### Asahi Linux (Fedora)
```bash
# Check Node
node --version

# Install if needed
sudo dnf install nodejs npm

# Verify
node --version && npm --version
```

### macOS
```bash
# Check Node
node --version

# Install via Homebrew
brew install node

# Or download from nodejs.org (Apple Silicon build)
```

### Minimum Versions
| Tool | Version |
|------|---------|
| Node.js | 18.0+ (recommend 20 LTS) |
| npm | 9.0+ (comes with Node) |

---

## 🔧 Daily Commands

### Start the App
```bash
cd ~/orcap-transaction-mgmt/orcap-app
npm run dev
```
Opens at: **http://localhost:5173**

### If Port 5173 is Busy
```bash
npm run dev -- --port 3000
```

### Production Build (Optional)
```bash
npm run build
npm run preview
```

---

## 📊 App Navigation

| Tab | Purpose |
|-----|---------|
| **Import** | Upload CSV bank statements |
| **Transactions** | View, categorize, manage transactions |
| **Settlements** | Calculate monthly advisor settlements |
| **Reports** | Generate CSV/markdown reports |
| **Settings** | Backup/restore, configure advisors & rules |

---

## 💾 Data Backup & Restore

### Export (Before Leaving a Machine)
1. Open ORCAP → Settings tab
2. Click **"Export Full Backup"**
3. Save the JSON file somewhere safe

### Import (On New Machine)
1. Open ORCAP → Settings tab
2. Click **"Select backup file"** → choose your JSON
3. Check boxes for what to import:
   - ✅ Settlements
   - ✅ Transactions
   - ✅ Advisors
   - ✅ Rules
4. Click **"Import Selected Data"**

### Backup Contents
```
Full Backup includes:
├── Settlement periods (calculated months)
├── All transactions (bank data)
├── Advisor configurations
├── Categorization rules
└── Expense rules
```

---

## 📱 Offline Capability

**This app works 100% offline!**

Once installed and running:
- ✅ All data stored locally (browser IndexedDB)
- ✅ CSV import works offline
- ✅ Calculations work offline
- ✅ Reports generate offline
- ✅ Perfect for flights

---

## 🛠️ Troubleshooting

### "npm: command not found"
```bash
# Asahi Linux
sudo dnf install nodejs npm

# macOS
brew install node
```

### "EACCES permission denied"
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3001

# Or kill existing process
lsof -ti:5173 | xargs kill -9
```

### Blank Page / Loading Forever
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Data Not Appearing After Import
- Refresh the browser (Ctrl+R / Cmd+R)
- Check browser console for errors (F12)
- Verify backup file isn't corrupted (try opening JSON)

---

## 📁 Project Structure

```
orcap-transaction-mgmt/
├── orcap-app/              # Main React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── lib/db.ts       # IndexedDB (Dexie)
│   │   ├── utils/          # Business logic
│   │   └── types/          # TypeScript types
│   ├── package.json        # Dependencies
│   └── vite.config.ts      # Build config
└── [Python scripts]        # Optional analysis tools
```

---

## 🔐 Data Safety Notes

### Where Data Lives
- **Browser IndexedDB** - specific to each browser profile
- **NOT synced** between devices automatically
- Use backup/restore for device-to-device transfer

### Before Returning Home
1. Export full backup on MacBook
2. Transfer JSON to Linux machine
3. Import on Linux to sync changes

---

## 📞 Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│  ORCAP QUICK REFERENCE                          │
├─────────────────────────────────────────────────┤
│  Start:    cd orcap-app && npm run dev          │
│  URL:      http://localhost:5173                │
│  Backup:   Settings → Export Full Backup        │
│  Restore:  Settings → Select backup file        │
├─────────────────────────────────────────────────┤
│  MONTHLY WORKFLOW                               │
│  1. Import → Upload bank CSV                    │
│  2. Transactions → Review & categorize          │
│  3. Settlements → Create new period             │
│  4. Reports → Export results                    │
│  5. Settings → Backup your data!                │
└─────────────────────────────────────────────────┘
```

---

## 🔗 Related Resources

- [[01-Companies/Orion-Ridge-Capital/index|Orion Ridge Capital]]
- [[04-Resources/Cheat_Sheets/git-workflow-cheatsheet|Git Workflow Cheatsheet]]
- ORCAP GitHub: `<your-repo-url>`

---

**Pro Tip**: Screenshot this reference card to your phone for quick access during travel!

---
*Created with Claude Code - Safe travels to NYC!*
