# Reference Repositories: What to Clone and What to Extract

## Overview

This document identifies the repositories worth cloning locally for reference, patterns, and selective code extraction. We're not building on top of these - we're learning from them and borrowing proven patterns.

---

## Priority 1: Must Clone (Direct Applicability)

### 1. ThetaTracker
**Repo:** `https://github.com/RudolfTheOne/ThetaTracker`

**Why Clone:**
- Closest in concept to what we're building (premium selling opportunity scanner)
- ARR (Annualised Rate of Return) calculation - exactly what we need
- Earnings calendar integration pattern
- Position sizing based on buying power

**Files to Study:**
```
ThetaTracker/
├── config.json              # Configuration structure for thresholds
├── main.py                  # Main scanning logic
└── [various modules]        # ARR calculation, delta filtering
```

**What to Extract:**
| Pattern | File/Location | Our Usage |
|---------|---------------|-----------|
| ARR formula | Main scanning logic | `theta/signals/scoring.py` |
| Config structure | `config.json` | `config/settings.yaml` |
| Position sizing | Buying power calculation | `theta/portfolio/risk.py` |
| Earnings flag | Calendar integration | `theta/signals/filters.py` |

**Clone Command:**
```bash
git clone https://github.com/RudolfTheOne/ThetaTracker.git refs/ThetaTracker
```

---

### 2. adaptive-volatility-arbitrage
**Repo:** `https://github.com/willhammondhimself/adaptive-volatility-arbitrage`

**Why Clone:**
- FastAPI + React architecture (exactly our stack)
- Greeks aggregation for portfolio-level risk
- LRU caching pattern for expensive calculations
- Strategy base class design

**Files to Study:**
```
adaptive-volatility-arbitrage/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI setup
│   │   ├── routes/              # API structure
│   │   └── services/            # Business logic separation
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # React component structure
│   │   └── services/            # API client pattern
│   └── package.json
├── src/volatility_arbitrage/
│   ├── backtest/                # Event-driven backtester
│   ├── strategy/                # Strategy base class
│   └── models/                  # Pricing models
└── config/                      # YAML configurations
```

**What to Extract:**
| Pattern | File/Location | Our Usage |
|---------|---------------|-----------|
| FastAPI structure | `backend/app/` | `theta/api/` |
| Strategy base class | `src/volatility_arbitrage/strategy/` | Future extensibility |
| LRU caching | Pricing functions | `theta/analytics/` decorators |
| Config pattern | `config/*.yaml` | `config/settings.yaml` |
| React structure | `frontend/src/` | `frontend/src/` |

**Clone Command:**
```bash
git clone https://github.com/willhammondhimself/adaptive-volatility-arbitrage.git refs/adaptive-vol-arb
```

---

### 3. iv-greeks-dashboard
**Repo:** `https://github.com/kmart2002/iv-greeks-dashboard`

**Why Clone:**
- Clean FastAPI + React + TypeScript implementation
- IV extraction with Newton-Raphson + bisection fallback
- Pydantic v2 models
- 500ms debouncing pattern for real-time updates
- 93 tests - excellent test structure reference

**Files to Study:**
```
iv-greeks-dashboard/
├── backend/
│   ├── app/
│   │   ├── models/              # Pydantic models
│   │   ├── services/
│   │   │   ├── black_scholes.py # Greeks implementation
│   │   │   └── implied_vol.py   # IV extraction
│   │   └── routes/              # API endpoints
│   └── tests/                   # Test structure
├── frontend/
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Custom hooks
│   │   └── utils/               # Debouncing, etc.
│   └── package.json
```

**What to Extract:**
| Pattern | File/Location | Our Usage |
|---------|---------------|-----------|
| IV extraction | `services/implied_vol.py` | `theta/analytics/iv_calculator.py` |
| Greeks formulas | `services/black_scholes.py` | `theta/analytics/greeks.py` |
| Pydantic models | `app/models/` | `theta/data/models.py` |
| Debounce pattern | `frontend/src/utils/` | `frontend/src/hooks/` |
| Test structure | `backend/tests/` | `tests/` |
| CSV export | Various | `theta/api/routes/` |

**Clone Command:**
```bash
git clone https://github.com/kmart2002/iv-greeks-dashboard.git refs/iv-greeks-dashboard
```

---

### 4. Options-Analytics
**Repo:** `https://github.com/alexisdpc/Options-Analytics`

**Why Clone:**
- Clean data retrieval pattern (retriever → analytics separation)
- Bid/ask spread analysis (execution cost awareness)
- Term structure visualisation
- Moneyness calculation

**Files to Study:**
```
Options-Analytics/
├── retriever.py                 # Data fetching pattern
├── greeks.py                    # Analytics layer
├── notebooks/                   # Analysis examples
└── [visualisation code]
```

**What to Extract:**
| Pattern | File/Location | Our Usage |
|---------|---------------|-----------|
| Retriever pattern | `retriever.py` | `theta/data/massive_client.py` |
| Analytics separation | `greeks.py` | `theta/analytics/` structure |
| Moneyness calc | Analysis code | `theta/analytics/` helpers |
| Spread analysis | Various | `theta/signals/filters.py` |

**Clone Command:**
```bash
git clone https://github.com/alexisdpc/Options-Analytics.git refs/options-analytics
```

---

## Priority 2: Reference Only (Study Architecture)

### 5. OptionStratLib (Rust)
**Repo:** `https://github.com/joaquinbejar/OptionStratLib`

**Why Clone:**
- Excellent domain model for options strategies
- Trait system design (Strategable, BreakEvenable, etc.)
- Comprehensive strategy implementations (25+)
- Greeks including second-order

**What to Study (Not Extract Code):**
- Strategy trait hierarchy → Python Protocol pattern
- Strategy implementations → Logic patterns
- Greeks calculation approaches
- Position P&L formulas

**Clone Command:**
```bash
git clone https://github.com/joaquinbejar/OptionStratLib.git refs/optionstratlib
```

**Note:** This is Rust, so we're studying the *design* not copying code. The trait system maps beautifully to Python Protocols.

---

### 6. vollib (Python Library)
**Repo:** `https://github.com/vollib/vollib`

**Why Clone:**
- Reference implementation for IV calculation
- Newton-Raphson implementation
- Understanding the underlying lets_be_rational library

**What to Study:**
- IV extraction algorithm
- Edge case handling (deep ITM/OTM)
- Numerical stability

**Clone Command:**
```bash
git clone https://github.com/vollib/vollib.git refs/vollib
```

**Note:** We'll use vollib as a dependency, but cloning helps understand what's happening under the hood.

---

### 7. quantstats
**Repo:** `https://github.com/ranaroussi/quantstats`

**Why Clone:**
- Performance metrics reference
- Tear sheet generation
- Report formatting

**What to Study:**
- Metrics calculation formulas
- Report generation patterns
- Chart styling

**Clone Command:**
```bash
git clone https://github.com/ranaroussi/quantstats.git refs/quantstats
```

**Note:** We'll use as a dependency but may want to customise reports.

---

## Priority 3: Optional (Nice to Have)

### 8. marketcalls/trading-dashboard
**Repo:** `https://github.com/marketcalls/trading-dashboard`

**Why Clone:**
- Simple React + Tailwind dashboard template
- Visual layout reference

**Clone Command:**
```bash
git clone https://github.com/marketcalls/trading-dashboard.git refs/trading-dashboard
```

---

## Clone Script

Create a script to clone all priority repos:

```bash
#!/bin/bash
# clone_refs.sh - Clone reference repositories

mkdir -p refs
cd refs

echo "Cloning Priority 1 repositories..."
git clone https://github.com/RudolfTheOne/ThetaTracker.git ThetaTracker
git clone https://github.com/willhammondhimself/adaptive-volatility-arbitrage.git adaptive-vol-arb
git clone https://github.com/kmart2002/iv-greeks-dashboard.git iv-greeks-dashboard
git clone https://github.com/alexisdpc/Options-Analytics.git options-analytics

echo "Cloning Priority 2 repositories..."
git clone https://github.com/joaquinbejar/OptionStratLib.git optionstratlib
git clone https://github.com/vollib/vollib.git vollib
git clone https://github.com/ranaroussi/quantstats.git quantstats

echo "Cloning Priority 3 repositories..."
git clone https://github.com/marketcalls/trading-dashboard.git trading-dashboard

echo "Done! Reference repos cloned to ./refs/"
```

---

## Extraction Checklist

After cloning, here's what to examine in order:

### Week 1: Core Patterns
- [ ] ThetaTracker: ARR formula, config structure
- [ ] iv-greeks-dashboard: IV extraction, Greeks, Pydantic models
- [ ] Options-Analytics: Retriever pattern

### Week 2: Architecture
- [ ] adaptive-vol-arb: FastAPI structure, React structure
- [ ] iv-greeks-dashboard: API endpoints, test structure

### Week 3: Advanced Patterns
- [ ] OptionStratLib: Strategy trait system → Python Protocols
- [ ] adaptive-vol-arb: Caching patterns, strategy base class

---

## Key Code Snippets to Locate

### ARR Calculation (ThetaTracker)
```python
# Look for something like:
def calculate_arr(premium, strike, delta, dte):
    max_risk = strike * abs(delta)  # Simplified
    daily_return = premium / max_risk
    arr = daily_return * (365 / dte) * 100
    return arr
```

### IV Extraction (iv-greeks-dashboard / vollib)
```python
# Newton-Raphson with bisection fallback
def implied_volatility(price, S, K, T, r, option_type):
    # Try Newton-Raphson first (fast)
    # Fall back to bisection if NR fails (robust)
    pass
```

### Greeks (iv-greeks-dashboard)
```python
from scipy.stats import norm
import numpy as np

def calculate_d1_d2(S, K, T, r, sigma):
    d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return d1, d2

def delta(S, K, T, r, sigma, option_type):
    d1, _ = calculate_d1_d2(S, K, T, r, sigma)
    if option_type == 'call':
        return norm.cdf(d1)
    return norm.cdf(d1) - 1
```

### FastAPI Structure (adaptive-vol-arb)
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Project Theta")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes/
from fastapi import APIRouter
router = APIRouter(prefix="/api/v1")
```

---

## Legal Note

All referenced repositories are open source with permissive licenses (MIT, Apache 2.0). We're:
- ✅ Studying patterns and architecture
- ✅ Implementing our own versions inspired by these patterns
- ✅ Giving credit in documentation
- ❌ NOT copy-pasting large chunks verbatim without attribution
