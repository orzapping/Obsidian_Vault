# FCA MiFIDPRU K-Factor Formulas & Calculation Logic

This file sets out the **precise calculation methodology** for the requested K-factors, with accompanying **coding logic examples**.

---

## 1. K-CMH (Client Money Held)

**Reference:** MIFIDPRU 4.7.4R – 4.7.9R

**Formula (per rules):**
\[
K\text{-}CMH = 0.004 \times CMH_{AV}
\]

Where:
- \(CMH_{AV}\) = arithmetic mean of the **daily client money balances** held (segregated and non-segregated) over the period of the previous 3 months.

**Calculation methodology:**
1. For each business day in the last 3 months, record total client money balance.  
2. Compute the arithmetic mean of these daily balances.  
3. Multiply by 0.004 (i.e. 0.4%).  

**Code logic (Python-style):**
```python
def calc_K_CMH(daily_balances):
    # daily_balances = list of daily CMH values over last 3 months
    CMH_AV = sum(daily_balances) / len(daily_balances)
    return 0.004 * CMH_AV
```

---

## 2. K-COH (Client Orders Handled)

**Reference:** MIFIDPRU 4.7.10R – 4.7.15R

**Formula (per rules):**
\[
K\text{-}COH = (0.001 \times V_{cash}) + (0.0001 \times V_{deriv})
\]

Where:
- \(V_{cash}\) = annualised value of cash trades handled.  
- \(V_{deriv}\) = annualised notional value of derivative trades handled.  

**Calculation methodology:**
1. For each month, calculate value of cash trades and notional value of derivative trades.  
2. Compute a rolling average of the last 9 months (or 12 months if available).  
3. Annualise the result (multiply by 12/number_of_months).  
4. Apply factors: 0.1% for cash trades, 0.01% for derivatives.  

**Code logic:**
```python
def calc_K_COH(monthly_cash, monthly_deriv):
    # monthly_cash, monthly_deriv = lists of monthly volumes over last 9-12 months
    months = len(monthly_cash)
    V_cash = sum(monthly_cash) / months * 12
    V_deriv = sum(monthly_deriv) / months * 12
    return 0.001 * V_cash + 0.0001 * V_deriv
```

---

## 3. K-DTF (Daily Trading Flow)

**Reference:** MIFIDPRU 4.7.16R – 4.7.22R

**Formula (per rules):**
\[
K\text{-}DTF = (0.001 \times V_{cash}) + (0.0001 \times V_{deriv})
\]

Where:
- \(V_{cash}\) = annualised value of firm’s own-account cash trades.  
- \(V_{deriv}\) = annualised notional value of firm’s own-account derivative trades.  

**Calculation methodology:**
1. For each day, calculate the value of firm’s cash and derivative trades.  
2. Compute average daily volumes over previous 9 months.  
3. Annualise the result.  
4. Apply factors.  

**Code logic:**
```python
def calc_K_DTF(daily_cash, daily_deriv, trading_days=252):
    # daily_cash, daily_deriv = lists of daily trading volumes over last 9 months
    avg_cash = sum(daily_cash) / len(daily_cash)
    avg_deriv = sum(daily_deriv) / len(daily_deriv)
    V_cash = avg_cash * trading_days
    V_deriv = avg_deriv * trading_days
    return 0.001 * V_cash + 0.0001 * V_deriv
```

---

## 4. K-ASA (Assets Safeguarded and Administered)

**Reference:** MIFIDPRU 4.7.23R – 4.7.27R

**Formula (per rules):**
\[
K\text{-}ASA = 0.0004 \times ASA_{AV}
\]

Where:
- \(ASA_{AV}\) = arithmetic mean of daily values of financial instruments safeguarded/administered over the previous 3 months.

**Calculation methodology:**
1. For each business day in last 3 months, record value of assets safeguarded/administered.  
2. Compute arithmetic mean.  
3. Multiply by 0.0004 (i.e. 0.04%).  

**Code logic:**
```python
def calc_K_ASA(daily_ASA):
    ASA_AV = sum(daily_ASA) / len(daily_ASA)
    return 0.0004 * ASA_AV
```

---

## 5. K-AUM (Assets Under Management)

**Reference:** MIFIDPRU 4.7.28R – 4.7.33R

**Formula (per rules):**
\[
K\text{-}AUM = 0.0002 \times AUM_{AV}
\]

Where:
- \(AUM_{AV}\) = average of quarterly-end values of AUM over the previous 15 months.  

**Calculation methodology:**
1. Take quarterly-end AUM values for last 15 months.  
2. Compute average of these values.  
3. Multiply by 0.0002 (i.e. 0.02%).  

**Code logic:**
```python
def calc_K_AUM(quarterly_AUM):
    # quarterly_AUM = list of AUM values at quarter-end over last 15 months
    AUM_AV = sum(quarterly_AUM) / len(quarterly_AUM)
    return 0.0002 * AUM_AV
```

---

# Notes
- All calculations must be performed using **gross values** (no netting of longs/shorts or leverage adjustments).  
- Delegated arrangements must be **included** as specified in MIFIDPRU.  
- Annualisation factors depend on actual observed months/days in sample period.  

