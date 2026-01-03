# Prompt 09: Scoring and ARR Calculation

## Context

We're building **Project Theta**, a systematic options trading dashboard. This prompt creates the opportunity scoring module, including the Annualised Rate of Return (ARR) calculation borrowed from ThetaTracker.

## Prerequisites

- Prompts 01-08 completed (especially rules_engine, percentile, greeks)
- ThetaTracker repo cloned for reference

## Task

Create a scoring system that:
1. Scores opportunities based on multiple criteria
2. Calculates ARR (Annualised Rate of Return) for premium selling
3. Ranks the watchlist by score
4. Provides clear signal strength classification

## Reference Files

**Critical Reference - Study First:**
- `refs/ThetaTracker/` - Look for ARR calculation logic

The ThetaTracker ARR formula is the key metric for comparing premium selling opportunities. It answers: "If I could repeat this trade all year, what would my annual return be?"

## Key Concept: ARR (Annualised Rate of Return)

From ThetaTracker, the ARR formula is:

```
ARR = (Premium / Max Risk) × (365 / DTE) × 100

Where:
- Premium = Credit received (per share, so multiply by 100 for contract)
- Max Risk = Maximum loss on the trade
- DTE = Days to expiration
```

For different strategies:
- **Short Put**: Max Risk = Strike - Premium (cash-secured)
- **Credit Spread**: Max Risk = Width of spread - Premium
- **Iron Condor**: Max Risk = Width of widest spread - Total premium

Example:
- Sell $5 put on SPY at strike 450, collect $3.50 premium, 30 DTE
- Max Risk = $450 - $3.50 = $446.50 (per share)
- ARR = ($3.50 / $446.50) × (365 / 30) × 100 = 9.54%

## Specifications

### theta/signals/scoring.py

```python
"""
Opportunity scoring and ARR calculation.

This module implements:
- Annualised Rate of Return (ARR) calculation
- Multi-criteria scoring
- Watchlist ranking

The ARR formula is adapted from ThetaTracker:
ARR = (Premium / Max Risk) × (365 / DTE) × 100

This gives an annualised return figure that allows comparison
across different strikes, expirations, and underlyings.
"""
import logging
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional

from theta.config import get_settings
from theta.data.models import (
    IVMetrics,
    OptionContract,
    OptionsChain,
    OptionType,
    SignalResult,
    SignalStrength,
    WatchlistEntry,
    Watchlist,
)

logger = logging.getLogger(__name__)


# Scoring weights (can be moved to config)
class ScoringCriteria(str, Enum):
    """Scoring criteria with point values."""
    IV_PERCENTILE_ELEVATED = "iv_percentile_elevated"  # > 50
    IV_PERCENTILE_HIGH = "iv_percentile_high"          # > 70
    IV_RV_RATIO_GOOD = "iv_rv_ratio_good"              # > 1.3
    IV_RV_RATIO_EXCELLENT = "iv_rv_ratio_excellent"    # > 1.5
    OPTIMAL_DTE = "optimal_dte"                         # 30-45
    LOW_DELTA = "low_delta"                             # < 0.20
    GOOD_LIQUIDITY = "good_liquidity"                   # Tight spread, high OI
    VIX_CONTANGO = "vix_contango"                       # VIX not in backwardation


# Point values for each criterion
SCORING_POINTS = {
    ScoringCriteria.IV_PERCENTILE_ELEVATED: 1,
    ScoringCriteria.IV_PERCENTILE_HIGH: 2,      # Bonus on top of elevated
    ScoringCriteria.IV_RV_RATIO_GOOD: 2,
    ScoringCriteria.IV_RV_RATIO_EXCELLENT: 1,   # Bonus on top of good
    ScoringCriteria.OPTIMAL_DTE: 1,
    ScoringCriteria.LOW_DELTA: 1,
    ScoringCriteria.GOOD_LIQUIDITY: 1,
    ScoringCriteria.VIX_CONTANGO: 1,
}


@dataclass
class ARRResult:
    """Result of ARR calculation."""
    arr: float  # Annualised Rate of Return as percentage
    premium: float  # Premium collected
    max_risk: float  # Maximum loss
    dte: int  # Days to expiration
    strategy: str  # Strategy type (e.g., "short_put", "credit_spread")


def calculate_arr(
    premium: float,
    max_risk: float,
    dte: int,
) -> Optional[float]:
    """
    Calculate Annualised Rate of Return (ARR).
    
    This is the core metric from ThetaTracker for comparing
    premium selling opportunities. It answers: "What annual
    return would I get if I could repeat this trade all year?"
    
    Formula:
        ARR = (Premium / Max Risk) × (365 / DTE) × 100
    
    Args:
        premium: Credit received (per contract value, e.g., $350 for $3.50 option)
        max_risk: Maximum possible loss
        dte: Days to expiration
        
    Returns:
        Annualised rate of return as percentage (e.g., 15.5 for 15.5%)
        
    Example:
        >>> arr = calculate_arr(premium=350, max_risk=4650, dte=30)
        >>> print(f"ARR: {arr:.1f}%")
        ARR: 91.7%
    """
    if max_risk <= 0 or dte <= 0:
        return None
    
    daily_return = premium / max_risk
    arr = daily_return * (365 / dte) * 100
    
    return arr


def calculate_short_put_arr(
    contract: OptionContract,
    cash_secured: bool = True,
) -> Optional[ARRResult]:
    """
    Calculate ARR for a short put position.
    
    Args:
        contract: Put option contract
        cash_secured: If True, max risk is strike - premium (full cash secured)
                      If False, would need margin calculation (not implemented)
    
    Returns:
        ARRResult with all calculation details
    """
    if contract.option_type != OptionType.PUT:
        logger.warning("Expected PUT contract for short_put_arr")
        return None
    
    # Premium per contract (mid price × 100)
    premium = contract.mid * 100
    
    if premium <= 0:
        return None
    
    if cash_secured:
        # Max risk is being assigned at strike, minus premium received
        max_risk = (contract.strike * 100) - premium
    else:
        # TODO: Implement margin-based max risk
        raise NotImplementedError("Margin-based risk not implemented")
    
    arr = calculate_arr(premium, max_risk, contract.days_to_expiration)
    
    if arr is None:
        return None
    
    return ARRResult(
        arr=arr,
        premium=premium,
        max_risk=max_risk,
        dte=contract.days_to_expiration,
        strategy="short_put",
    )


def calculate_credit_spread_arr(
    short_contract: OptionContract,
    long_contract: OptionContract,
) -> Optional[ARRResult]:
    """
    Calculate ARR for a credit spread (vertical spread).
    
    Args:
        short_contract: Option being sold (higher premium)
        long_contract: Option being bought (hedge)
        
    Returns:
        ARRResult with all calculation details
    """
    # Validate same type and expiration
    if short_contract.option_type != long_contract.option_type:
        logger.warning("Credit spread requires same option type")
        return None
    
    if short_contract.expiration != long_contract.expiration:
        logger.warning("Credit spread requires same expiration")
        return None
    
    # Calculate net premium (credit received)
    premium = (short_contract.mid - long_contract.mid) * 100
    
    if premium <= 0:
        logger.warning("Credit spread must have positive net premium")
        return None
    
    # Width of the spread
    width = abs(short_contract.strike - long_contract.strike) * 100
    
    # Max risk is width minus premium received
    max_risk = width - premium
    
    arr = calculate_arr(premium, max_risk, short_contract.days_to_expiration)
    
    if arr is None:
        return None
    
    return ARRResult(
        arr=arr,
        premium=premium,
        max_risk=max_risk,
        dte=short_contract.days_to_expiration,
        strategy="credit_spread",
    )


def calculate_iron_condor_arr(
    put_spread_short: OptionContract,
    put_spread_long: OptionContract,
    call_spread_short: OptionContract,
    call_spread_long: OptionContract,
) -> Optional[ARRResult]:
    """
    Calculate ARR for an iron condor.
    
    An iron condor consists of:
    - Short put spread (sell higher strike, buy lower strike)
    - Short call spread (sell lower strike, buy higher strike)
    
    Max risk is the width of the widest spread minus total premium.
    """
    # Calculate both spread premiums
    put_premium = (put_spread_short.mid - put_spread_long.mid) * 100
    call_premium = (call_spread_short.mid - call_spread_long.mid) * 100
    
    total_premium = put_premium + call_premium
    
    if total_premium <= 0:
        return None
    
    # Width of each spread
    put_width = abs(put_spread_short.strike - put_spread_long.strike) * 100
    call_width = abs(call_spread_short.strike - call_spread_long.strike) * 100
    
    # Max risk is the widest spread minus total premium
    # (you can only lose on one side)
    max_width = max(put_width, call_width)
    max_risk = max_width - total_premium
    
    arr = calculate_arr(total_premium, max_risk, put_spread_short.days_to_expiration)
    
    if arr is None:
        return None
    
    return ARRResult(
        arr=arr,
        premium=total_premium,
        max_risk=max_risk,
        dte=put_spread_short.days_to_expiration,
        strategy="iron_condor",
    )


def score_opportunity(
    symbol: str,
    iv_metrics: IVMetrics,
    best_contract: Optional[OptionContract] = None,
    vix_in_backwardation: bool = False,
) -> SignalResult:
    """
    Score an opportunity based on multiple criteria.
    
    Scoring Criteria:
    - IV Percentile > 50: +1 point
    - IV Percentile > 70: +2 bonus points
    - IV/RV Ratio > 1.3: +2 points
    - IV/RV Ratio > 1.5: +1 bonus point
    - DTE in 30-45: +1 point
    - Delta < 0.20: +1 point
    - Good liquidity: +1 point
    - VIX in contango: +1 point
    
    Total possible: 10 points
    
    Signal Strength:
    - 0: None
    - 1-2: Weak
    - 3: Moderate
    - 4-5: Strong
    - 6+: Very Strong
    
    Args:
        symbol: Underlying symbol
        iv_metrics: IV metrics for the symbol
        best_contract: Best contract candidate (optional)
        vix_in_backwardation: Whether VIX is in backwardation
        
    Returns:
        SignalResult with score and breakdown
    """
    settings = get_settings()
    
    score = 0
    rules_passed = []
    rules_failed = []
    warnings = []
    
    # IV Percentile scoring
    if iv_metrics.iv_percentile >= settings.signals.iv_percentile_threshold:
        score += SCORING_POINTS[ScoringCriteria.IV_PERCENTILE_ELEVATED]
        rules_passed.append("IV Percentile > 50")
        
        if iv_metrics.iv_percentile >= settings.signals.iv_percentile_strong:
            score += SCORING_POINTS[ScoringCriteria.IV_PERCENTILE_HIGH]
            rules_passed.append("IV Percentile > 70 (bonus)")
    else:
        rules_failed.append("IV Percentile < 50")
    
    # IV/RV Ratio scoring
    if iv_metrics.iv_rv_ratio >= settings.signals.iv_rv_ratio_threshold:
        score += SCORING_POINTS[ScoringCriteria.IV_RV_RATIO_GOOD]
        rules_passed.append("IV/RV > 1.3")
        
        if iv_metrics.iv_rv_ratio >= 1.5:
            score += SCORING_POINTS[ScoringCriteria.IV_RV_RATIO_EXCELLENT]
            rules_passed.append("IV/RV > 1.5 (bonus)")
    else:
        rules_failed.append("IV/RV < 1.3")
    
    # VIX contango check
    if not vix_in_backwardation:
        score += SCORING_POINTS[ScoringCriteria.VIX_CONTANGO]
        rules_passed.append("VIX in contango")
    else:
        rules_failed.append("VIX in backwardation")
        warnings.append("⚠️ VIX in backwardation - elevated market stress")
    
    # Contract-specific scoring (if provided)
    arr_value = None
    if best_contract:
        # DTE scoring
        dte = best_contract.days_to_expiration
        if settings.signals.optimal_dte_min <= dte <= settings.signals.optimal_dte_max:
            score += SCORING_POINTS[ScoringCriteria.OPTIMAL_DTE]
            rules_passed.append("Optimal DTE (30-45)")
        
        # Delta scoring
        if best_contract.greeks and abs(best_contract.greeks.delta) <= settings.signals.max_delta:
            score += SCORING_POINTS[ScoringCriteria.LOW_DELTA]
            rules_passed.append("Low delta (< 0.20)")
        
        # Liquidity scoring
        if best_contract.is_liquid:
            score += SCORING_POINTS[ScoringCriteria.GOOD_LIQUIDITY]
            rules_passed.append("Good liquidity")
        
        # Calculate ARR if it's a put (most common for premium selling)
        if best_contract.option_type == OptionType.PUT:
            arr_result = calculate_short_put_arr(best_contract)
            if arr_result:
                arr_value = arr_result.arr
    
    # Determine signal strength
    strength = SignalResult.from_score(score)
    
    return SignalResult(
        symbol=symbol,
        score=score,
        strength=strength,
        iv_metrics=iv_metrics,
        rules_passed=rules_passed,
        rules_failed=rules_failed,
        iv_percentile=iv_metrics.iv_percentile,
        iv_rv_ratio=iv_metrics.iv_rv_ratio,
        arr=arr_value,
        warnings=warnings,
        timestamp=datetime.utcnow(),
    )


def rank_watchlist(
    signals: list[SignalResult],
) -> Watchlist:
    """
    Rank opportunities by score to create the watchlist.
    
    Primary sort: Score (descending)
    Secondary sort: IV Percentile (descending)
    Tertiary sort: ARR (descending, if available)
    
    Args:
        signals: List of signal results to rank
        
    Returns:
        Ranked watchlist
    """
    # Sort by score (primary), IV percentile (secondary), ARR (tertiary)
    sorted_signals = sorted(
        signals,
        key=lambda s: (
            s.score,
            s.iv_percentile,
            s.arr if s.arr is not None else 0,
        ),
        reverse=True,
    )
    
    entries = []
    for rank, signal in enumerate(sorted_signals, start=1):
        entry = WatchlistEntry(
            rank=rank,
            symbol=signal.symbol,
            signal=signal,
            iv_percentile=signal.iv_percentile,
            iv_rv_ratio=signal.iv_rv_ratio,
            score=signal.score,
            strength=signal.strength,
        )
        entries.append(entry)
    
    return Watchlist(
        entries=entries,
        generated_at=datetime.utcnow(),
    )


def find_best_contract(
    chain: OptionsChain,
    option_type: OptionType = OptionType.PUT,
    min_dte: Optional[int] = None,
    max_dte: Optional[int] = None,
    max_delta: Optional[float] = None,
) -> Optional[OptionContract]:
    """
    Find the best contract for premium selling.
    
    Criteria:
    1. Correct option type
    2. Within DTE range
    3. Delta below threshold
    4. Best liquidity (tightest spread, highest OI)
    5. Highest ARR
    
    Args:
        chain: Options chain to search
        option_type: PUT or CALL
        min_dte: Minimum days to expiration
        max_dte: Maximum days to expiration
        max_delta: Maximum absolute delta
        
    Returns:
        Best contract, or None if no suitable contract found
    """
    settings = get_settings()
    
    min_dte = min_dte or settings.signals.min_dte
    max_dte = max_dte or settings.signals.max_dte
    max_delta = max_delta or settings.signals.max_delta
    
    # Filter by DTE
    filtered = chain.filter_by_dte(min_dte, max_dte)
    
    # Filter by type
    contracts = [
        c for c in filtered.contracts
        if c.option_type == option_type
    ]
    
    # Filter by delta
    if max_delta:
        contracts = [
            c for c in contracts
            if c.greeks and abs(c.greeks.delta) <= max_delta
        ]
    
    # Filter by liquidity
    contracts = [c for c in contracts if c.is_liquid]
    
    if not contracts:
        return None
    
    # Score contracts by ARR and liquidity
    scored = []
    for contract in contracts:
        arr_result = calculate_short_put_arr(contract) if option_type == OptionType.PUT else None
        arr = arr_result.arr if arr_result else 0
        
        # Composite score: ARR weighted higher, liquidity bonus
        liquidity_score = 1 / (1 + contract.spread_percent)  # 0 to 1
        composite = arr * 0.7 + liquidity_score * 100 * 0.3
        
        scored.append((contract, composite))
    
    # Return highest scored
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[0][0]
```

### tests/test_signals/test_scoring.py

```python
"""Tests for scoring module."""
from datetime import date, timedelta

import pytest

from theta.signals.scoring import (
    calculate_arr,
    calculate_short_put_arr,
    calculate_credit_spread_arr,
    score_opportunity,
    rank_watchlist,
    find_best_contract,
)
from theta.data.models import (
    Greeks,
    IVMetrics,
    OptionContract,
    OptionsChain,
    OptionType,
    SignalStrength,
)


class TestCalculateARR:
    """Tests for ARR calculation."""
    
    def test_basic_arr(self):
        """Test basic ARR calculation."""
        # $350 premium, $4650 risk, 30 DTE
        arr = calculate_arr(premium=350, max_risk=4650, dte=30)
        
        assert arr is not None
        # (350 / 4650) * (365 / 30) * 100 ≈ 91.7%
        assert 90 <= arr <= 93
    
    def test_arr_with_longer_dte(self):
        """Test ARR decreases with longer DTE."""
        arr_30 = calculate_arr(premium=350, max_risk=4650, dte=30)
        arr_45 = calculate_arr(premium=350, max_risk=4650, dte=45)
        arr_60 = calculate_arr(premium=350, max_risk=4650, dte=60)
        
        assert arr_30 > arr_45 > arr_60
    
    def test_arr_zero_risk_returns_none(self):
        """Test zero risk returns None."""
        arr = calculate_arr(premium=350, max_risk=0, dte=30)
        assert arr is None
    
    def test_arr_zero_dte_returns_none(self):
        """Test zero DTE returns None."""
        arr = calculate_arr(premium=350, max_risk=4650, dte=0)
        assert arr is None


class TestCalculateShortPutARR:
    """Tests for short put ARR."""
    
    @pytest.fixture
    def put_contract(self) -> OptionContract:
        """Create a sample put contract."""
        return OptionContract(
            symbol="SPY",
            strike=440.0,
            expiration=date.today() + timedelta(days=30),
            option_type=OptionType.PUT,
            bid=3.30,
            ask=3.50,  # Mid = 3.40
            volume=5000,
            open_interest=25000,
            greeks=Greeks(delta=-0.15, gamma=0.01, theta=-0.05, vega=0.30),
        )
    
    def test_short_put_arr(self, put_contract):
        """Test short put ARR calculation."""
        result = calculate_short_put_arr(put_contract)
        
        assert result is not None
        assert result.strategy == "short_put"
        assert result.premium == 340  # $3.40 × 100
        assert result.max_risk == 44000 - 340  # Strike × 100 - Premium
        assert result.dte == 30
        assert result.arr > 0
    
    def test_call_returns_none(self):
        """Test that call contract returns None."""
        call = OptionContract(
            symbol="SPY",
            strike=450.0,
            expiration=date.today() + timedelta(days=30),
            option_type=OptionType.CALL,
            bid=5.00, ask=5.20,
        )
        
        result = calculate_short_put_arr(call)
        assert result is None


class TestScoreOpportunity:
    """Tests for opportunity scoring."""
    
    @pytest.fixture
    def strong_metrics(self) -> IVMetrics:
        """Create metrics for a strong opportunity."""
        return IVMetrics(
            symbol="SPY",
            current_iv=0.25,
            iv_percentile=75,
            iv_rank=70,
            iv_high_52w=0.35,
            iv_low_52w=0.12,
            realized_vol=0.15,
            iv_rv_ratio=1.67,
        )
    
    @pytest.fixture
    def weak_metrics(self) -> IVMetrics:
        """Create metrics for a weak opportunity."""
        return IVMetrics(
            symbol="QQQ",
            current_iv=0.14,
            iv_percentile=25,
            iv_rank=20,
            iv_high_52w=0.30,
            iv_low_52w=0.12,
            realized_vol=0.16,
            iv_rv_ratio=0.88,
        )
    
    def test_strong_opportunity(self, strong_metrics):
        """Test scoring a strong opportunity."""
        result = score_opportunity(
            symbol="SPY",
            iv_metrics=strong_metrics,
            vix_in_backwardation=False,
        )
        
        assert result.score >= 5
        assert result.strength in [SignalStrength.STRONG, SignalStrength.VERY_STRONG]
        assert "IV Percentile > 70" in " ".join(result.rules_passed)
        assert "IV/RV > 1.3" in result.rules_passed
    
    def test_weak_opportunity(self, weak_metrics):
        """Test scoring a weak opportunity."""
        result = score_opportunity(
            symbol="QQQ",
            iv_metrics=weak_metrics,
            vix_in_backwardation=False,
        )
        
        assert result.score <= 2
        assert result.strength in [SignalStrength.NONE, SignalStrength.WEAK]
        assert "IV Percentile < 50" in result.rules_failed
    
    def test_backwardation_warning(self, strong_metrics):
        """Test that VIX backwardation adds warning."""
        result = score_opportunity(
            symbol="SPY",
            iv_metrics=strong_metrics,
            vix_in_backwardation=True,
        )
        
        assert len(result.warnings) > 0
        assert "backwardation" in result.warnings[0].lower()


class TestRankWatchlist:
    """Tests for watchlist ranking."""
    
    def test_ranking_by_score(self):
        """Test that watchlist is ranked by score."""
        metrics_high = IVMetrics(
            symbol="HIGH",
            current_iv=0.25, iv_percentile=80, iv_rank=75,
            iv_high_52w=0.30, iv_low_52w=0.12,
            realized_vol=0.15, iv_rv_ratio=1.67,
        )
        metrics_low = IVMetrics(
            symbol="LOW",
            current_iv=0.15, iv_percentile=30, iv_rank=25,
            iv_high_52w=0.30, iv_low_52w=0.12,
            realized_vol=0.16, iv_rv_ratio=0.94,
        )
        
        signals = [
            score_opportunity("LOW", metrics_low),
            score_opportunity("HIGH", metrics_high),
        ]
        
        watchlist = rank_watchlist(signals)
        
        assert len(watchlist) == 2
        assert watchlist.entries[0].symbol == "HIGH"
        assert watchlist.entries[0].rank == 1
        assert watchlist.entries[1].symbol == "LOW"
        assert watchlist.entries[1].rank == 2
```

## Acceptance Criteria

1. ✅ ARR calculation matches ThetaTracker formula
2. ✅ Short put ARR calculates correctly
3. ✅ Credit spread ARR calculates correctly
4. ✅ Scoring assigns points per criteria
5. ✅ Watchlist ranks by score descending
6. ✅ `poetry run pytest tests/test_signals/test_scoring.py` passes

## Output Files

- `theta/signals/scoring.py`
- `tests/test_signals/test_scoring.py`

## Key Insights from ThetaTracker

The ARR metric is powerful because it:
1. **Normalises across DTE** - Compare 30 DTE vs 45 DTE fairly
2. **Normalises across strikes** - Compare ATM vs OTM fairly
3. **Normalises across underlyings** - Compare SPY vs IWM fairly

A higher ARR means more efficient use of capital. However, higher ARR often comes with higher risk (tighter strikes, shorter DTE), so it must be balanced with the probability of profit.

## Next Prompt

Proceed to `10_cli.md` to create the command-line interface that ties everything together.
