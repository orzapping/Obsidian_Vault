
# IFPR K‑Factor Calculations — Exact FCA MIFIDPRU Methodologies + Code Logic
**Scope:** UK IFPR (FCA Handbook MIFIDPRU). This file sets out the precise calculation methodology/rule references for: **K‑CMH, K‑COH (cash & derivatives), K‑DTF, K‑ASA, K‑AUM**, followed by implementation‑ready code logic examples (Python‑style pseudocode).  
**Monthly calculation date:** *First business day of each month* for each K‑factor (see specific rules below).  
> ⚠️ Implementers: treat all rule references as authoritative; avoid simplifications. Record FX rates where required by rule.

---

## K‑AUM (Assets Under Management)
**Rule basis & coefficients**  
- **K‑AUM requirement = 0.02% × average AUM.** (MIFIDPRU **4.7.1R**)
- **Calculated on the first business day of each month.** (MIFIDPRU **4.7.4R**)

**Average AUM — how to measure** (MIFIDPRU **4.7.5R**):
1. Take **total AUM as measured on the last business day** of **each of the previous 15 months**. (4.7.5R(1)(a))  
2. **Exclude the 3 most recent** monthly values. (4.7.5R(1)(b))  
3. **Arithmetic mean** of the **remaining 12** monthly values. (4.7.5R(1)(c))  
4. **FX**: When measuring month‑end AUM, convert any foreign‑currency amounts **on that date** into the firm’s functional currency, **record the rate used**; prior months keep their original month‑end conversion rates. (4.7.5R(2)–(3) & 4.7.6G)  
5. **Measurement basis:** use market value where available; otherwise fair value/best‑efforts estimate; **exclude amounts already included in CMH**; **may offset negative values/liabilities within portfolios** (i.e. net portfolio value). (4.7.7R)  
6. **Delegation:** 
   - If **you delegate** management out: **you must still include** those assets in AUM. (4.7.8R)  
   - If **a financial entity formally delegates** management **to you**, you **may exclude** those assets from your AUM **subject to the conditions/limitations** in 4.7.9R (incl. sub‑delegation limits in 4.7.9R(2)). See 4.7.10G for examples.  
7. **Firms with <15 months of activity**: use the **modified calculation** in **TP 4.11R(1)** as adjusted by **4.7.12R** (treat the start month as **month 0**, use best‑efforts estimate for month 0; roll forward monthly until 15 months have elapsed).  
8. **Investment advice of an ongoing nature:** additional detail on measuring monthly AUM for recurring advice is in **4.7.20G–4.7.21R** (use the sum of relevant financial instruments that are the subject of the advice for each month).

**Formula (deterministic):**  
\[ K\text{-}AUM = 0.0002 \times \frac{1}{12} \sum_{m=t-15}^{t-4} \text{AUM}_{m,\text{last business day}}^{(\text{FX on }m)} \]

**Code logic (example)**
```python
from datetime import date, timedelta
from statistics import mean

def average_aum(month_end_values):  # dict {month_end_date: aum_local_ccy_value_converted_on_that_date}
    # Expect 15 consecutive month-end observation dates ending with the most recent month-end
    assert len(month_end_values) >= 15, "Need 15 month-end AUM values per 4.7.5R"
    ordered = sorted(month_end_values.items(), key=lambda kv: kv[0])  # ascending by date
    # Exclude the 3 most recent monthly values
    eligible = [v for (_, v) in ordered[:-3]]
    assert len(eligible) >= 12
    return mean(eligible)  # arithmetic mean of remaining 12

def k_aum(month_end_values):
    avg = average_aum(month_end_values)
    return 0.0002 * avg  # 0.02% per 4.7.1R
```

---

## K‑CMH (Client Money Held)
**Rule basis & coefficients**  
- **K‑CMH requirement = 0.4% × average CMH (segregated) + 0.5% × average CMH (non‑segregated).** (MIFIDPRU **4.8.1R**)  
- **Calculated on the first business day of each month.** (MIFIDPRU **4.8.12R**)  
- **Segregated vs non‑segregated**: classification per **4.8.8R** (with evidential provisions in **4.8.9E** and guidance **4.8.10G** — e.g. CASS 7 compliance generally evidences segregation; non‑compliance should be treated as non‑segregated for K‑CMH).

**Average CMH — how to measure** (MIFIDPRU **4.8.13R–4.8.14R**, **4.8.16G**):  
1. Measure **total CMH at end of each business day** during the **previous 9 months**. (4.8.13R(1))  
2. **Exclude the daily values for the most recent 3 months**. (4.8.13R(2))  
3. **Arithmetic mean of the daily values** for the **remaining 6 months**. (4.8.13R(3))  
4. Measurement must align to **CASS 7.15** records/reconciliations and any accounting records. (4.8.14R)  
5. If internal reconciliations later adjust a day’s CMH, **update that day’s figure** and use the corrected figure. (4.8.16G)  
6. **<9 months history**: use **TP 4.11R(1)** as adjusted by **4.8.15R** (month 0, best‑efforts estimate, rolling update until 9 months elapsed).  
7. Include any amounts relating to **tied agents** performing MiFID business on your behalf. (4.8.3R)

**Formulae:**  
\[ \text{avgCMH}_S = \text{mean}\big(\{\text{CMH}_S(d)\}_{d\in D}\big),\quad \text{avgCMH}_{NS} = \text{mean}\big(\{\text{CMH}_{NS}(d)\}_{d\in D}\big) \]  
where **D** = all business days in months **t‑9 … t‑4** (i.e. **exclude** the most recent 3 months).  
\[ K\text{-}CMH = 0.004\times \text{avgCMH}_S\; +\; 0.005\times \text{avgCMH}_{NS} \]

**Code logic (example)**
```python
from statistics import mean

def rolling_businessday_window(values_by_date, months_back_inclusive=9, months_exclude_recent=3):
    # values_by_date: dict {date: amount} for each business day
    # Returns all dates in the window [t-9m, t-4m], i.e. exclude the most recent 3 months
    calc_ref = max(values_by_date)  # latest observed date before calc
    def ym(d): return (d.year, d.month)
    yms = sorted({ym(d) for d in values_by_date})
    # include last (months_back_inclusive + months_exclude_recent) months, then drop last 'exclude' months
    inc_months = yms[-(months_back_inclusive + months_exclude_recent): -months_exclude_recent]
    return [v for (d, v) in values_by_date.items() if ym(d) in inc_months]

def average_cmh(cmh_segregated_by_day, cmh_nonseg_by_day):
    seg_vals = rolling_businessday_window(cmh_segregated_by_day, 9, 3)
    nonseg_vals = rolling_businessday_window(cmh_nonseg_by_day, 9, 3)
    return mean(seg_vals), mean(nonseg_vals)

def k_cmh(cmh_segregated_by_day, cmh_nonseg_by_day):
    avg_s, avg_ns = average_cmh(cmh_segregated_by_day, cmh_nonseg_by_day)
    return 0.004 * avg_s + 0.005 * avg_ns  # per 4.8.1R
```

---

## K‑ASA (Assets Safeguarded and Administered)
**Rule basis & coefficient**  
- **K‑ASA requirement = 0.04% × average ASA.** (MIFIDPRU **4.9.1R**)  
- **Calculated on the first business day of each month.** (MIFIDPRU **4.9.7R**)

**Average ASA — how to measure** (MIFIDPRU **4.9.8R**):
1. Measure **total ASA at end of each business day** for the **previous 9 months**. (4.9.8R(1))  
2. **Exclude the most recent 3 months** of daily values. (4.9.8R(2))  
3. **Arithmetic mean** of the **remaining 6 months** of daily values. (4.9.8R(3))  
4. Measurement basis: **market value** where available, otherwise **fair value/best‑efforts**. (4.9.9R)  
5. **Exclude any QMMF units/shares that are treated as MiFID client money** (they belong in CMH, not ASA). (4.9.4R)  
6. **Delegation:** include assets where **you delegated safeguarding** to another entity **or** where **another entity delegated** safeguarding to you. (4.9.11R)  
7. Include amounts relating to **tied agents** performing MiFID business on your behalf. (4.9.2R)

**Formula:**  
\[ K\text{-}ASA = 0.0004\times \text{mean}\big(\{\text{ASA}(d)\}_{d\in D}\big) \]  
where **D** = business days in months **t‑9 … t‑4** (exclude most recent 3 months).

**Code logic (example)**
```python
from statistics import mean

def average_asa(asa_by_day):
    vals = rolling_businessday_window(asa_by_day, months_back_inclusive=9, months_exclude_recent=3)
    return mean(vals)

def k_asa(asa_by_day):
    return 0.0004 * average_asa(asa_by_day)  # 0.04% per 4.9.1R
```

---

## K‑COH (Client Orders Handled) — cash trades & derivatives
**Rule basis & coefficients**  
- **K‑COH requirement = 0.1% × average COH (cash trades) + 0.01% × average COH (derivatives).** (MIFIDPRU **4.10.1R**)  
- **Calculated on the first business day of each month.** (MIFIDPRU **4.10.18R**)  

**Average COH — how to measure** (MIFIDPRU **4.10.19R**):
1. Take **total COH measured throughout each business day** over the **previous 6 months**. (4.10.19R(1)(a))  
2. **Exclude the daily values for the most recent 3 months**. (4.10.19R(1)(b))  
3. **Arithmetic mean** of the **remaining 3 months** of daily values. (4.10.19R(1)(c))  
4. **FX**: convert foreign‑currency orders **daily on that day** to functional currency; **record the rate used**; do **not** restate prior days. (4.10.19R(2)–(3) & 4.10.21G(6)–(7))

**What is “value of an order” for COH?** (MIFIDPRU **4.10.20R–4.10.25R**)
- **Sum absolute values** of each buy and sell order. (4.10.20R(1))  
- **Cash trades**: value = **amount paid/received on the trade at execution time**, unless using the **RTO alternative** in 4.10.23R. (4.10.20R(2))  
  - **Optional RTO alternative (4.10.23R):** for **received & transmitted** cash trades, you may use a **deemed price**: the **limit/fixed price**; or, if none, the **end‑of‑day market price at transmission**. Must **apply consistently** (see 4.10.24G anti‑arbitrage).  
  - **Transaction costs**: You **may** deduct costs **only if** not paid separately by the client to the firm; otherwise **do not deduct**. (4.10.20R(5), 4.10.21G(2)–(5))  
- **Derivatives (non‑IR)**: value = **notional amount** per **4.14.20R(2)**. (4.10.20R(3))  
- **Interest‑rate derivatives**: **notional × duration**, where **duration = time‑to‑maturity (years) / 10**. (4.10.20R(4) & 4.10.25R)  

**Explicit exclusions from COH** (MIFIDPRU **4.10.4R**): do **not** include
- Orders executed **by the firm in its own name** (including in own name **on behalf of a client**) — these feed K‑DTF instead.  
- Orders handled as **operator of an MTF/OTF**.  
- Transactions captured only by **MiFID recital 44 “bringing together”** (corporate finance‑style introductions).  
- **Orders not ultimately executed**.

**Formulæ:**  
\[ K\text{-}COH = 0.001\times \overline{\text{COH}}_{\text{cash}}\; +\; 0.0001\times \overline{\text{COH}}_{\text{deriv}} \]  
with \(\overline{\text{COH}}\) computed strictly per **4.10.19R**.

**Code logic (example)**
```python
from statistics import mean

def order_value_cash(executed_amount, transaction_costs_included=True, costs_paid_separately=False):
    # 4.10.20R(2) and 4.10.20R(5); if costs are paid separately to the firm, do NOT net them off
    if transaction_costs_included and not costs_paid_separately:
        return abs(executed_amount)
    return abs(executed_amount)  # no separate deduction unless included in consideration

def order_value_derivative(notional, is_interest_rate=False, time_to_maturity_years=None):
    # 4.10.20R(3) and (4) + 4.10.25R
    if is_interest_rate:
        assert time_to_maturity_years is not None
        duration = time_to_maturity_years / 10.0  # per 4.10.25R(2)
        return abs(notional) * duration
    return abs(notional)

def average_coh(coh_by_day):  # dict {date: total COH value that day (sum abs buys+sells with correct valuation rules)}
    vals = rolling_businessday_window(coh_by_day, months_back_inclusive=6, months_exclude_recent=3)
    return mean(vals)

def k_coh(coh_cash_by_day, coh_deriv_by_day):
    avg_cash = average_coh(coh_cash_by_day)
    avg_deriv = average_coh(coh_deriv_by_day)
    return 0.001 * avg_cash + 0.0001 * avg_deriv  # per 4.10.1R
```

---

## K‑DTF (Daily Trading Flow)
**Rule basis & coefficients**  
- **K‑DTF requirement = 0.1% × average DTF (cash trades) + 0.01% × average DTF (derivatives)**, **subject to stressed‑market adjusted coefficients** in 4.15.11R. (MIFIDPRU **4.15.1R**, **4.15.11R**)  
- **Calculated on the first business day of each month.** (MIFIDPRU **4.15.3R**)  

**Average DTF — how to measure** (MIFIDPRU **4.15.4R**):
1. Take **total DTF measured throughout each business day** in **each of the previous 9 months**. (4.15.4R(1)(a))  
2. **Exclude the daily values for the most recent 3 months**. (4.15.4R(1)(b))  
3. **Arithmetic mean** of the **remaining 6 months** of daily values. (4.15.4R(1)(c))  
4. **FX**: convert foreign‑currency amounts **day by day** into functional currency; **record the rate used**; do **not** restate prior days. (4.15.4R(2)–(3) & 4.15.5G)

**What is included in DTF & how to value orders** (MIFIDPRU **4.15.2G, 4.15.6R–4.15.9G**):  
- **Include transactions** the firm enters into **when dealing on own account** *or* **executing client orders in its own name**. (4.15.2G; 4.15.9G)  
- **Sum absolute values** of buy and sell orders. (4.15.6R(1))  
- **Cash trades**: value = **amount paid/received** on the trade. (4.15.6R(2))  
- **Derivatives (non‑IR)**: value = **notional amount** per **4.14.20R(2)**. (4.15.6R(3))  
- **Interest‑rate derivatives**: **notional × duration** where **duration = time‑to‑maturity (years) / 10**. (4.15.6R(4) & **4.15.8R–4.15.9G**)

**Adjusted coefficients in stressed market conditions** (MIFIDPRU **4.15.11R–4.15.13G**):  
If any part of the average DTF relates to trades on a trading‑venue segment under **“stressed market conditions”** (as per Market Making RTS art. 6), you **may** replace 0.1%/0.01% with adjusted coefficients:
- **CadjCash = C × (DTF_excl / DTF_incl)** for cash trades. (4.15.11R(3))  
- **CadjDer = C × (DTF_excl / DTF_incl)** for derivatives. (4.15.11R(4))  
Where **C** is the original coefficient; **DTF_incl** is average DTF including stressed‑segment trades; **DTF_excl** excludes those stressed‑segment trades (both per 4.15.4R averaging window).

**Formula:**  
\[ K\text{-}DTF = C_{cash}\,\overline{\text{DTF}}_{\text{cash}} + C_{deriv}\,\overline{\text{DTF}}_{\text{deriv}} \]  
with \(C_{cash}=0.001\) and \(C_{deriv}=0.0001\), **unless** adjusted under 4.15.11R as above.

**Code logic (example)**
```python
from statistics import mean

def average_dtf(dtf_by_day):
    vals = rolling_businessday_window(dtf_by_day, months_back_inclusive=9, months_exclude_recent=3)
    return mean(vals)

def adjusted_coeff(original_coeff, avg_including, avg_excluding):
    # 4.15.11R(3)-(4)
    return original_coeff * (avg_excluding / avg_including) if avg_including else original_coeff

def k_dtf(dtf_cash_by_day, dtf_deriv_by_day,
          stressed_cash_avg_excl=None, stressed_deriv_avg_excl=None):
    avg_cash = average_dtf(dtf_cash_by_day)
    avg_deriv = average_dtf(dtf_deriv_by_day)
    c_cash = 0.001
    c_deriv = 0.0001
    # Optional stressed-market adjusted coefficients
    if stressed_cash_avg_excl is not None:
        c_cash = adjusted_coeff(c_cash, avg_cash, stressed_cash_avg_excl)
    if stressed_deriv_avg_excl is not None:
        c_deriv = adjusted_coeff(c_deriv, avg_deriv, stressed_deriv_avg_excl)
    return c_cash * avg_cash + c_deriv * avg_deriv
```

---

## K‑COH vs K‑AUM — interaction (heads‑up only)
Orders arising from **portfolio management or ongoing investment advice** may fall into AUM/COH depending on scenario; see **MIFIDPRU 4.10.26G–4.10.32G** and **MIFIDPRU 4 Annex 12G**. Implement controls to avoid **double counting** between K‑AUM and K‑COH per the Handbook scenarios.

---

### Implementation Notes
- **Business days vs calendar days**: COH/DTF/CMH/ASA require **business‑day** observations; AUM is **month‑end last business day**. Source all calendars from the firm’s official trading calendar.
- **FX**: Where mandated, **convert on the observation date** and **record the rate**; do not back‑adjust historic observations.
- **Reconciliations**: If CASS or accounting reconciliations adjust a past CMH figure, **update that day and recalc** the average for the next month’s computation.
- **Tied agents**: Include where required by the relevant rules (AUM 4.7.2R; CMH 4.8.3R; ASA 4.9.2R; COH 4.10.2R).
- **Start‑up / short history**: Apply the **modified calculations** referenced in each section’s rule when you have < required look‑back period.

---

*Prepared for engineering implementation. Copy these functions and wire them to your data pipelines & calendars. Keep a rule‑map alongside to evidence compliance during audit.*
