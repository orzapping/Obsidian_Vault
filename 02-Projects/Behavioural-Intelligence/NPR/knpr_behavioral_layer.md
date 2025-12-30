**Module: K-NPR (Net Position Risk) Behavioural Intelligence Capture Layer**

---

### 🧬 Context:
K-NPR captures the standardised approach to market risk for investment firms, broken down into multiple risk categories:
- **Position Risk** (Equities & Debt)
- **FX Risk**
- **Commodity Risk**
- **Options Risk**

Given the range of products, instruments, and strategies involved, behavioural capture in K-NPR must be especially rich in context, rationale, and decision-making nuance.

---

## ⚖️ Core Behavioural Data Capture Schema (All Categories)

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | DateTime | Time of position decision or update |
| `userId` | String | Actor taking the decision |
| `riskCategory` | Enum | One of: `position`, `fx`, `commodity`, `option` |
| `instrumentName` | String | Security or product name |
| `instrumentType` | Enum | `equity`, `debt`, `fx`, `commodity`, `option` |
| `positionSize` | Number | GBP market value (positive/negative) |
| `positionType` | Enum | `long`, `short` or position pair (FX) |
| `rationale` | Text | Natural language explanation of rationale |
| `riskAssessment` | Text | Perceived risk factors at the time |
| `confidenceScore` | Number (0-1) | How confident the actor was |
| `expectedOutcome` | Text | Intended outcome / hypothesis |
| `horizon` | Enum | `short`, `medium`, `long` term |
| `mitigationStrategy` | Text | Hedging or offset plans |
| `pressureFactor` | Enum[] | E.g. `market volatility`, `regulatory`, `client demand` |
| `decisionType` | Enum | `strategic`, `tactical`, `reactive`, `forced` |

---

## 🪤 Risk Category Specific Augmentation

### 📈 Position Risk (Equity/Debt)
- `portfolioType` | `index`, `liquid`, `other`
- `creditRating` | e.g. `AAA`, `BB+`, etc. (if debt)
- `maturity` | Years to maturity (if debt)
- ❓ Prompts:
  - What market signal or internal insight led to this equity/debt position?
  - Was diversification or index exposure a factor?
  - If debt, how did credit rating influence sizing?
  - What was your outlook on interest rate risk?

### 🌎 FX Risk
- `currencyPair` | String, e.g. `EUR/USD`
- `fxPositionType` | `spot`, `forward`, `gold`
- ❓ Prompts:
  - What macro factors influenced your FX exposure?
  - Was this FX trade hedging another portfolio position?
  - Were there structural or strategic reasons (e.g. treasury rebalancing)?

### ⛏️ Commodity Risk
- `commodityType` | `precious`, `energy`, `agriculture`, etc.
- `maturityMonths` | Integer
- ❓ Prompts:
  - What demand/supply insight shaped this position?
  - Was it part of a cross-asset strategy?
  - Any ESG or geopolitical factors in play?

### ✅ Options Risk
- `underlyingType` | `equity`, `fx`, `commodity`, `interest`
- `optionType` | `call`, `put`
- `delta`, `gamma`, `vega` | Greeks
- ❓ Prompts:
  - Why was an option (vs underlying) selected?
  - What volatility assumptions were made?
  - How were greeks and risk-reward assessed?

---

## ⚡ Behavioural Tag Generation (for AI enrichment)

Tags auto-generated from rationale/assessment fields:
- `#herding_behaviour`
- `#liquidity_crunch`
- `#volatility_reaction`
- `#macro_event_trade`
- `#credit_risk_hedge`
- `#esg_impact`
- `#fx_translation`
- `#portfolio_rebalancing`
- `#greek_exposure_management`

---

## 🏋️ Integration Note:
This framework should be called contextually when users:
- Add / edit K-NPR positions
- Submit updated net position summaries
- Trigger recalculations
- Manually tag risk drivers

Optional AI assistant (PatternRecognizer) to nudge behavioural capture if major changes occur without explanation.

---

## 🎓 Future Enhancements:
- Correlation mapping between stated rationale vs market outcome
- Stress response mapping to volatility spikes
- Intent vs outcome delta scoring
- Emotional variance detection (via NLP tone analysis)

---

**Status:** Draft v1.0 – open to iteration and refinement.

