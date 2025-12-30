# ORCAP Transaction Management System - CC Prompt Package

## 📁 Package Contents

This package contains everything needed to refactor the ORCAP TMS in Claude Code:

| File | Purpose | Size |
|------|---------|------|
| `ORCAP-TMS-Refactor-Spec.md` | Master specification - THE PRIMARY PROMPT | ~25KB |
| `ORCAP-TMS-Reference-Data.ts` | TypeScript reference data - importable | ~12KB |
| `ORCAP-TMS-Calculation-Engine.md` | Detailed calculation logic & pseudocode | ~18KB |

---

## 🚀 How to Use in Claude Code

### Option 1: Full Context Load
1. Open your TMS project in Claude Code
2. Paste the entire `ORCAP-TMS-Refactor-Spec.md` as your initial prompt
3. Reference the other files as needed during implementation

### Option 2: Phased Implementation
Start with the most critical fix and work through phases:

**Phase 1 Prompt:**
```
I need to refactor the core calculation engine in my ORCAP Transaction Management System.

The current implementation in src/utils/settlementCalculator.ts uses a 70/10/10/10 split 
which is WRONG. The correct formula is 70/10/20 with a waterfall priority system.

[Paste relevant sections from the spec]
```

**Phase 2 Prompt:**
```
Now let's add Wise CSV import support alongside the existing Lloyds parser.

[Paste CSV format specifications]
```

And so on...

---

## 🎯 Critical Fixes Required

### Priority 1: Calculation Engine
**File:** `src/utils/settlementCalculator.ts`
**Problem:** Wrong 70/10/10/10 split
**Solution:** Implement correct 70/10/20 with waterfall

### Priority 2: Wise CSV Import
**File:** `src/utils/csvParser.ts` (or similar)
**Problem:** Only Lloyds format supported
**Solution:** Add Wise parser with FX handling

### Priority 3: Settlement UI
**File:** `src/components/SettlementDetailView.tsx` (114KB!)
**Problem:** Monolithic, wrong display logic
**Solution:** Break into components, show correct waterfall flow

### Priority 4: Analytics
**File:** `src/components/Analytics.tsx`
**Problem:** Empty placeholder
**Solution:** Build dashboard with KPIs

### Priority 5: Reporting
**File:** NEW
**Problem:** Doesn't exist
**Solution:** Create reporting module

---

## ✅ Verification Data

Use November 2025 to verify implementation:

| Advisor | Expected AR+NK 20% |
|---------|-------------------|
| Maks | £1,585.42 |
| Sergey | £2,227.00 |
| Mariia | £0 (→ settlement) |
| Yulia | £702.73 |
| **Total** | **£4,515.15** |

If your calculations match these figures, the engine is working correctly.

---

## 📋 Key Configuration

### Distribution Split
```typescript
advisorShare: 0.70      // 70% to advisor
operationsOverride: 0.10 // 10% to Regent Consulting
waterfallPool: 0.20      // 20% to waterfall → settlements → ORCAP Nostro
```

### Waterfall Priority
1. Advisor's own settlement balance (if any)
2. ORCAP Nostro (AR+NK firm earnings)

### Active Settlement
Only Mariia has outstanding settlement (~£1,654 remaining as of Nov 2025)

---

## 🔧 Tech Stack Reference

- **Framework:** React 19 + Vite
- **State:** Zustand + React Query
- **Database:** IndexedDB via Dexie.js
- **Styling:** Tailwind CSS
- **Key Files:**
  - `src/utils/settlementCalculator.ts` (594 lines - REWRITE)
  - `src/components/SettlementDetailView.tsx` (114KB - REFACTOR)
  - `src/lib/db.ts` (Schema additions needed)

---

## 📞 Context

This refactor follows a comprehensive forensic analysis of ORCAP's financial records 
(November 2024 - December 2025) which verified the contractual structure and 
calculation methodology. The reference data and formulas in this package are 
derived from that analysis and are verified accurate.

---

*Package Created: 14 December 2025*
*By: Adrian Rader + Claude*
