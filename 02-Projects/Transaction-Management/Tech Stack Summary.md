Tech Stack Summary

  | Aspect           | Answer
                                                  |
  |------------------|--------------------------------------------
  ------------------------------------------------|
  | Framework        | React 19 (vanilla, NOT Next.js) with Vite
  as build tool                                    |
  | State Management | Zustand (though the stores/ folder appears
  empty - may be using local state + React Query) |
  | Persistence      | IndexedDB via Dexie.js - client-side
  database, browser-specific                            |
  | Styling          | Tailwind CSS
                                                  |
  | Data Fetching    | TanStack React Query (for async state
  management)                                          |

  ---
  Codebase Size & Structure

  | Metric               | Value
            |
  |----------------------|----------------------------------------
  ----------|
  | Total TS/TSX files   | ~19 files
            |
  | Components           | 8 main components
            |
  | Size of largest file | SettlementDetailView.tsx at 114KB
  (quite large!) |

  Directory Structure:
  src/
  ├── components/     # 8 UI components
  ├── hooks/          # Custom React hooks
  ├── lib/            # Database setup (db.ts - Dexie)
  ├── stores/         # Zustand stores (currently empty?)
  ├── types/          # TypeScript types
  ├── utils/          # Utilities (settlementCalculator.ts lives
  here)
  ├── App.tsx         # Main app (~10KB)
  └── main.tsx        # Entry point

  ---
  Assessment: Well-Structured or Needs Reorganisation?

  Reasonably well-structured, but a few observations:

  1. SettlementDetailView.tsx at 114KB - This is a monster file
  that likely handles too much. Could benefit from splitting into
  sub-components.
  2. Empty stores/ folder - Zustand is installed but might not be
  actively used; state may be primarily in React Query cache +
  local component state.
  3. Good separation of concerns - utils/ for business logic, lib/
   for database, types/ for TypeScript types.
  4. For the refactor: The key files are:
    - src/utils/settlementCalculator.ts (594 lines - the core
  logic to rewrite)
    - src/components/SettlementDetailView.tsx (will need UI
  updates)
    - src/lib/db.ts (may need schema additions)