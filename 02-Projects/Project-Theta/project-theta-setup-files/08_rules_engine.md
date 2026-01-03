# Prompt 08: Rules Engine

## Context

You are building ARGUS (Project Theta), a systematic options volatility trading platform. This prompt implements the Rules Engine - the heart of signal generation.

The rules engine evaluates options contracts against configurable criteria to determine if they're suitable for premium selling. It implements:

- **Hard filters**: Must-pass criteria (minimum IV percentile, max delta, liquidity)
- **Soft scoring**: Point-based ranking (IV/RV ratio, DTE sweet spot, VIX contango)
- **Safety checks**: Earnings proximity, position limits

This connects the analytics modules (IV, percentile, RV, Greeks) with the scoring system.

## Prerequisites

- Prompts 01-07 completed
- All analytics modules available
- Prompt 09 (scoring) can be referenced for ARR calculation

## Task

Create the rules engine module at `theta/signals/rules_engine.py`.

## Reference Files

Review these before implementing:
- `theta/analytics/` - All analytics modules
- `config/settings.yaml` - Default thresholds
- `refs/ThetaTracker/` - Signal logic reference

## Specifications

### File: `theta/signals/rules_engine.py`

```python
"""
Rules Engine for entry signal generation.

Evaluates options contracts against configurable criteria:
- Hard filters (must pass)
- Soft scoring (bonus points)
- Safety checks (warnings)

The engine is stateless - all configuration passed at evaluation time.
"""

from dataclasses import dataclass, field
from datetime import date, timedelta
from enum import Enum
from typing import Optional, Sequence
import logging

logger = logging.getLogger(__name__)


class SignalStrength(str, Enum):
    """Signal strength classification."""
    NONE = "none"           # Failed hard filter
    WEAK = "weak"           # Score 1-2
    MODERATE = "moderate"   # Score 3-4
    STRONG = "strong"       # Score 5-6
    VERY_STRONG = "very_strong"  # Score 7+


class FilterResult(str, Enum):
    """Result of a single filter evaluation."""
    PASS = "pass"
    FAIL = "fail"
    WARN = "warn"
    SKIP = "skip"  # Not enough data to evaluate


@dataclass(frozen=True)
class SignalThresholds:
    """
    Configurable thresholds for signal generation.
    
    Hard Filters (must pass):
    - min_iv_percentile: Minimum IV percentile (default 50)
    - max_delta: Maximum absolute delta (default 0.30)
    - min_dte: Minimum days to expiration (default 25)
    - max_dte: Maximum days to expiration (default 50)
    - min_open_interest: Minimum open interest (default 100)
    - max_spread_pct: Maximum bid-ask spread % (default 5%)
    - min_earnings_buffer: Days to avoid before earnings (default 7)
    
    Scoring Thresholds:
    - strong_iv_percentile: Bonus for IV%ile above this (default 70)
    - iv_rv_ratio_threshold: Bonus for IV/RV above this (default 1.3)
    - iv_rv_ratio_strong: Extra bonus for IV/RV above this (default 1.5)
    - optimal_dte_min: Optimal DTE range start (default 30)
    - optimal_dte_max: Optimal DTE range end (default 45)
    - low_delta_threshold: Bonus for delta below this (default 0.20)
    """
    # Hard filters
    min_iv_percentile: float = 50.0
    max_delta: float = 0.30
    min_dte: int = 25
    max_dte: int = 50
    min_open_interest: int = 100
    max_spread_pct: float = 5.0
    min_earnings_buffer: int = 7
    
    # Scoring thresholds
    strong_iv_percentile: float = 70.0
    iv_rv_ratio_threshold: float = 1.3
    iv_rv_ratio_strong: float = 1.5
    optimal_dte_min: int = 30
    optimal_dte_max: int = 45
    low_delta_threshold: float = 0.20
    
    # VIX structure
    require_vix_contango: bool = False  # If True, fail if VIX backwardated
    
    def __post_init__(self):
        """Validate thresholds."""
        if self.min_iv_percentile < 0 or self.min_iv_percentile > 100:
            raise ValueError(f"min_iv_percentile must be 0-100, got {self.min_iv_percentile}")
        if self.max_delta <= 0 or self.max_delta > 1:
            raise ValueError(f"max_delta must be 0-1, got {self.max_delta}")
        if self.min_dte >= self.max_dte:
            raise ValueError(f"min_dte ({self.min_dte}) must be < max_dte ({self.max_dte})")


@dataclass
class OptionSignalInput:
    """
    Input data for evaluating a single option.
    
    This bundles all the data needed to evaluate an option against the rules.
    """
    # Identity
    symbol: str
    strike: float
    expiration: date
    option_type: str  # 'c' or 'p'
    
    # Pricing
    bid: float
    ask: float
    underlying_price: float
    
    # Greeks (pre-calculated)
    delta: Optional[float] = None
    iv: Optional[float] = None
    
    # IV Metrics
    iv_percentile: Optional[float] = None
    iv_rank: Optional[float] = None
    
    # RV Metrics
    rv: Optional[float] = None  # Realized volatility
    
    # Liquidity
    open_interest: Optional[int] = None
    volume: Optional[int] = None
    
    # Calendar
    next_earnings_date: Optional[date] = None
    as_of_date: Optional[date] = None
    
    # VIX Structure
    vix_in_contango: Optional[bool] = None
    
    @property
    def mid_price(self) -> float:
        """Mid price between bid and ask."""
        return (self.bid + self.ask) / 2
    
    @property
    def spread(self) -> float:
        """Bid-ask spread."""
        return self.ask - self.bid
    
    @property
    def spread_pct(self) -> float:
        """Spread as percentage of mid price."""
        if self.mid_price <= 0:
            return float('inf')
        return (self.spread / self.mid_price) * 100
    
    @property
    def dte(self) -> int:
        """Days to expiration."""
        as_of = self.as_of_date or date.today()
        return (self.expiration - as_of).days
    
    @property
    def days_to_earnings(self) -> Optional[int]:
        """Days until next earnings announcement."""
        if self.next_earnings_date is None:
            return None
        as_of = self.as_of_date or date.today()
        return (self.next_earnings_date - as_of).days
    
    @property
    def iv_rv_ratio(self) -> Optional[float]:
        """IV/RV ratio (>1 means IV expensive vs realized)."""
        if self.iv is None or self.rv is None or self.rv <= 0:
            return None
        return self.iv / self.rv


@dataclass
class FilterEvaluation:
    """Result of evaluating a single filter."""
    name: str
    result: FilterResult
    value: Optional[float] = None
    threshold: Optional[float] = None
    message: str = ""


@dataclass
class SignalResult:
    """
    Complete result of evaluating an option against the rules.
    """
    # Input reference
    symbol: str
    strike: float
    expiration: date
    option_type: str
    
    # Overall result
    passes_filters: bool
    score: int
    strength: SignalStrength
    
    # Individual filter results
    filter_results: list[FilterEvaluation] = field(default_factory=list)
    
    # Scoring breakdown
    score_breakdown: dict[str, int] = field(default_factory=dict)
    
    # Warnings (soft failures)
    warnings: list[str] = field(default_factory=list)
    
    # Key metrics for display
    iv_percentile: Optional[float] = None
    iv_rv_ratio: Optional[float] = None
    delta: Optional[float] = None
    dte: Optional[int] = None
    spread_pct: Optional[float] = None
    
    @property
    def is_tradeable(self) -> bool:
        """True if option passes all filters and has positive score."""
        return self.passes_filters and self.score > 0


def evaluate_hard_filters(
    option: OptionSignalInput,
    thresholds: SignalThresholds,
) -> tuple[bool, list[FilterEvaluation]]:
    """
    Evaluate option against hard filters.
    
    All hard filters must pass for the option to be considered.
    
    Returns:
        Tuple of (all_passed, list of filter evaluations)
    """
    evaluations: list[FilterEvaluation] = []
    all_passed = True
    
    # 1. IV Percentile filter
    if option.iv_percentile is not None:
        passed = option.iv_percentile >= thresholds.min_iv_percentile
        evaluations.append(FilterEvaluation(
            name="iv_percentile",
            result=FilterResult.PASS if passed else FilterResult.FAIL,
            value=option.iv_percentile,
            threshold=thresholds.min_iv_percentile,
            message=f"IV%ile {option.iv_percentile:.1f}% {'≥' if passed else '<'} {thresholds.min_iv_percentile}%"
        ))
        if not passed:
            all_passed = False
    else:
        evaluations.append(FilterEvaluation(
            name="iv_percentile",
            result=FilterResult.SKIP,
            message="IV percentile data not available"
        ))
    
    # 2. Delta filter
    if option.delta is not None:
        abs_delta = abs(option.delta)
        passed = abs_delta <= thresholds.max_delta
        evaluations.append(FilterEvaluation(
            name="delta",
            result=FilterResult.PASS if passed else FilterResult.FAIL,
            value=abs_delta,
            threshold=thresholds.max_delta,
            message=f"|Delta| {abs_delta:.2f} {'≤' if passed else '>'} {thresholds.max_delta}"
        ))
        if not passed:
            all_passed = False
    else:
        evaluations.append(FilterEvaluation(
            name="delta",
            result=FilterResult.SKIP,
            message="Delta not available"
        ))
    
    # 3. DTE filter
    dte = option.dte
    passed_min = dte >= thresholds.min_dte
    passed_max = dte <= thresholds.max_dte
    passed = passed_min and passed_max
    
    evaluations.append(FilterEvaluation(
        name="dte",
        result=FilterResult.PASS if passed else FilterResult.FAIL,
        value=float(dte),
        threshold=float(thresholds.min_dte),  # Show min threshold
        message=f"DTE {dte} {'in' if passed else 'outside'} [{thresholds.min_dte}, {thresholds.max_dte}]"
    ))
    if not passed:
        all_passed = False
    
    # 4. Open Interest filter
    if option.open_interest is not None:
        passed = option.open_interest >= thresholds.min_open_interest
        evaluations.append(FilterEvaluation(
            name="open_interest",
            result=FilterResult.PASS if passed else FilterResult.FAIL,
            value=float(option.open_interest),
            threshold=float(thresholds.min_open_interest),
            message=f"OI {option.open_interest} {'≥' if passed else '<'} {thresholds.min_open_interest}"
        ))
        if not passed:
            all_passed = False
    else:
        evaluations.append(FilterEvaluation(
            name="open_interest",
            result=FilterResult.SKIP,
            message="Open interest not available"
        ))
    
    # 5. Spread filter
    spread_pct = option.spread_pct
    if spread_pct != float('inf'):
        passed = spread_pct <= thresholds.max_spread_pct
        evaluations.append(FilterEvaluation(
            name="spread",
            result=FilterResult.PASS if passed else FilterResult.FAIL,
            value=spread_pct,
            threshold=thresholds.max_spread_pct,
            message=f"Spread {spread_pct:.1f}% {'≤' if passed else '>'} {thresholds.max_spread_pct}%"
        ))
        if not passed:
            all_passed = False
    else:
        evaluations.append(FilterEvaluation(
            name="spread",
            result=FilterResult.FAIL,
            message="Invalid spread (zero mid price)"
        ))
        all_passed = False
    
    # 6. Earnings buffer filter
    days_to_earnings = option.days_to_earnings
    if days_to_earnings is not None:
        # Check if earnings falls within the option's lifetime
        if days_to_earnings >= 0 and days_to_earnings <= dte:
            # Earnings before expiration - need buffer
            passed = days_to_earnings >= thresholds.min_earnings_buffer
            evaluations.append(FilterEvaluation(
                name="earnings_buffer",
                result=FilterResult.PASS if passed else FilterResult.FAIL,
                value=float(days_to_earnings),
                threshold=float(thresholds.min_earnings_buffer),
                message=f"Earnings in {days_to_earnings} days {'≥' if passed else '<'} {thresholds.min_earnings_buffer} day buffer"
            ))
            if not passed:
                all_passed = False
        else:
            # Earnings after expiration or in the past
            evaluations.append(FilterEvaluation(
                name="earnings_buffer",
                result=FilterResult.PASS,
                message="No earnings before expiration"
            ))
    else:
        evaluations.append(FilterEvaluation(
            name="earnings_buffer",
            result=FilterResult.SKIP,
            message="Earnings date not available"
        ))
    
    # 7. VIX contango filter (optional)
    if thresholds.require_vix_contango:
        if option.vix_in_contango is not None:
            passed = option.vix_in_contango
            evaluations.append(FilterEvaluation(
                name="vix_structure",
                result=FilterResult.PASS if passed else FilterResult.FAIL,
                message=f"VIX {'in contango' if passed else 'in BACKWARDATION'}"
            ))
            if not passed:
                all_passed = False
        else:
            evaluations.append(FilterEvaluation(
                name="vix_structure",
                result=FilterResult.SKIP,
                message="VIX structure not available"
            ))
    
    return all_passed, evaluations


def calculate_score(
    option: OptionSignalInput,
    thresholds: SignalThresholds,
) -> tuple[int, dict[str, int]]:
    """
    Calculate signal score based on soft criteria.
    
    Points are awarded for favorable conditions beyond the minimum thresholds.
    
    Returns:
        Tuple of (total_score, breakdown dict)
    """
    score = 0
    breakdown: dict[str, int] = {}
    
    # 1. IV Percentile bonus (+2 for strong)
    if option.iv_percentile is not None:
        if option.iv_percentile >= thresholds.strong_iv_percentile:
            breakdown["iv_percentile_strong"] = 2
            score += 2
    
    # 2. IV/RV ratio bonus (+2 for elevated, +1 bonus for very elevated)
    iv_rv = option.iv_rv_ratio
    if iv_rv is not None:
        if iv_rv >= thresholds.iv_rv_ratio_threshold:
            breakdown["iv_rv_elevated"] = 2
            score += 2
            
            if iv_rv >= thresholds.iv_rv_ratio_strong:
                breakdown["iv_rv_very_elevated"] = 1
                score += 1
    
    # 3. Optimal DTE bonus (+1)
    dte = option.dte
    if thresholds.optimal_dte_min <= dte <= thresholds.optimal_dte_max:
        breakdown["optimal_dte"] = 1
        score += 1
    
    # 4. Low delta bonus (+1)
    if option.delta is not None:
        if abs(option.delta) <= thresholds.low_delta_threshold:
            breakdown["low_delta"] = 1
            score += 1
    
    # 5. Good liquidity bonus (+1)
    if option.open_interest is not None and option.volume is not None:
        if option.open_interest >= thresholds.min_open_interest * 5:
            if option.volume >= 50:
                breakdown["good_liquidity"] = 1
                score += 1
    
    # 6. VIX contango bonus (+1)
    if option.vix_in_contango is True:
        breakdown["vix_contango"] = 1
        score += 1
    
    # 7. Tight spread bonus (+1)
    if option.spread_pct <= thresholds.max_spread_pct / 2:
        breakdown["tight_spread"] = 1
        score += 1
    
    return score, breakdown


def classify_signal_strength(score: int) -> SignalStrength:
    """Classify signal strength based on score."""
    if score <= 0:
        return SignalStrength.NONE
    elif score <= 2:
        return SignalStrength.WEAK
    elif score <= 4:
        return SignalStrength.MODERATE
    elif score <= 6:
        return SignalStrength.STRONG
    else:
        return SignalStrength.VERY_STRONG


def evaluate_option(
    option: OptionSignalInput,
    thresholds: Optional[SignalThresholds] = None,
) -> SignalResult:
    """
    Evaluate a single option against all rules.
    
    This is the main entry point for signal generation.
    
    Args:
        option: Option data to evaluate
        thresholds: Signal thresholds (uses defaults if not provided)
    
    Returns:
        SignalResult with complete evaluation
    
    Example:
        >>> option = OptionSignalInput(
        ...     symbol="SPY",
        ...     strike=450,
        ...     expiration=date(2024, 2, 16),
        ...     option_type="p",
        ...     bid=2.50,
        ...     ask=2.55,
        ...     underlying_price=460,
        ...     delta=-0.20,
        ...     iv=0.18,
        ...     iv_percentile=65,
        ...     open_interest=5000,
        ... )
        >>> result = evaluate_option(option)
        >>> print(f"Signal: {result.strength.value}, Score: {result.score}")
    """
    if thresholds is None:
        thresholds = SignalThresholds()
    
    # Evaluate hard filters
    passes_filters, filter_results = evaluate_hard_filters(option, thresholds)
    
    # Calculate score (even if filters fail, for diagnostics)
    score, score_breakdown = calculate_score(option, thresholds)
    
    # If filters fail, score is 0
    if not passes_filters:
        score = 0
        score_breakdown = {}
    
    # Classify strength
    strength = classify_signal_strength(score)
    
    # Generate warnings
    warnings: list[str] = []
    
    # Warn about earnings proximity even if filter passes
    if option.days_to_earnings is not None:
        if 0 <= option.days_to_earnings <= 14 and option.days_to_earnings <= option.dte:
            warnings.append(f"Earnings in {option.days_to_earnings} days")
    
    # Warn about VIX backwardation even if not required
    if option.vix_in_contango is False and not thresholds.require_vix_contango:
        warnings.append("VIX in backwardation - elevated volatility environment")
    
    # Warn about very wide spreads
    if option.spread_pct > thresholds.max_spread_pct * 0.8:
        warnings.append(f"Wide spread: {option.spread_pct:.1f}%")
    
    return SignalResult(
        symbol=option.symbol,
        strike=option.strike,
        expiration=option.expiration,
        option_type=option.option_type,
        passes_filters=passes_filters,
        score=score,
        strength=strength,
        filter_results=filter_results,
        score_breakdown=score_breakdown,
        warnings=warnings,
        iv_percentile=option.iv_percentile,
        iv_rv_ratio=option.iv_rv_ratio,
        delta=option.delta,
        dte=option.dte,
        spread_pct=option.spread_pct if option.spread_pct != float('inf') else None,
    )


def evaluate_chain(
    options: Sequence[OptionSignalInput],
    thresholds: Optional[SignalThresholds] = None,
    only_passing: bool = False,
) -> list[SignalResult]:
    """
    Evaluate multiple options (e.g., an options chain).
    
    Args:
        options: List of options to evaluate
        thresholds: Signal thresholds
        only_passing: If True, only return options that pass filters
    
    Returns:
        List of SignalResults, sorted by score descending
    """
    results = []
    
    for option in options:
        result = evaluate_option(option, thresholds)
        
        if only_passing and not result.passes_filters:
            continue
            
        results.append(result)
    
    # Sort by score descending, then by IV percentile descending
    results.sort(
        key=lambda r: (r.score, r.iv_percentile or 0),
        reverse=True
    )
    
    return results


def find_best_strikes(
    options: Sequence[OptionSignalInput],
    thresholds: Optional[SignalThresholds] = None,
    max_results: int = 5,
) -> list[SignalResult]:
    """
    Find the best strikes from a chain.
    
    Convenience wrapper that evaluates and returns top N passing options.
    
    Args:
        options: List of options to evaluate
        thresholds: Signal thresholds  
        max_results: Maximum number of results to return
    
    Returns:
        Top scoring options that pass all filters
    """
    results = evaluate_chain(options, thresholds, only_passing=True)
    return results[:max_results]
```

### File: `theta/signals/__init__.py`

```python
"""Signal generation modules."""

from theta.signals.rules_engine import (
    evaluate_option,
    evaluate_chain,
    find_best_strikes,
    evaluate_hard_filters,
    calculate_score,
    classify_signal_strength,
    SignalThresholds,
    OptionSignalInput,
    SignalResult,
    SignalStrength,
    FilterResult,
    FilterEvaluation,
)

__all__ = [
    "evaluate_option",
    "evaluate_chain",
    "find_best_strikes",
    "evaluate_hard_filters",
    "calculate_score",
    "classify_signal_strength",
    "SignalThresholds",
    "OptionSignalInput",
    "SignalResult",
    "SignalStrength",
    "FilterResult",
    "FilterEvaluation",
]
```

## Tests

### File: `tests/signals/test_rules_engine.py`

```python
"""Tests for rules engine."""

import pytest
from datetime import date, timedelta

from theta.signals.rules_engine import (
    evaluate_option,
    evaluate_chain,
    find_best_strikes,
    evaluate_hard_filters,
    calculate_score,
    classify_signal_strength,
    SignalThresholds,
    OptionSignalInput,
    SignalResult,
    SignalStrength,
    FilterResult,
)


@pytest.fixture
def default_thresholds():
    """Default signal thresholds."""
    return SignalThresholds()


@pytest.fixture
def good_option():
    """An option that should pass all filters."""
    return OptionSignalInput(
        symbol="SPY",
        strike=450,
        expiration=date.today() + timedelta(days=35),
        option_type="p",
        bid=2.50,
        ask=2.55,
        underlying_price=460,
        delta=-0.20,
        iv=0.22,
        iv_percentile=72,
        iv_rank=65,
        rv=0.18,
        open_interest=5000,
        volume=500,
        next_earnings_date=date.today() + timedelta(days=60),
        vix_in_contango=True,
    )


@pytest.fixture
def marginal_option():
    """An option at the threshold boundaries."""
    return OptionSignalInput(
        symbol="SPY",
        strike=445,
        expiration=date.today() + timedelta(days=25),  # Minimum DTE
        option_type="p",
        bid=1.00,
        ask=1.05,
        underlying_price=460,
        delta=-0.30,  # At max delta
        iv=0.18,
        iv_percentile=50,  # Minimum
        open_interest=100,  # Minimum
    )


@pytest.fixture
def bad_option():
    """An option that should fail filters."""
    return OptionSignalInput(
        symbol="SPY",
        strike=455,
        expiration=date.today() + timedelta(days=10),  # Too short
        option_type="p",
        bid=0.50,
        ask=0.70,  # Wide spread
        underlying_price=460,
        delta=-0.45,  # Too high
        iv=0.15,
        iv_percentile=30,  # Too low
        open_interest=50,  # Too low
    )


class TestSignalThresholds:
    """Tests for SignalThresholds validation."""
    
    def test_default_thresholds(self, default_thresholds):
        """Test default threshold values."""
        assert default_thresholds.min_iv_percentile == 50
        assert default_thresholds.max_delta == 0.30
        assert default_thresholds.min_dte == 25
        assert default_thresholds.max_dte == 50
        
    def test_invalid_iv_percentile_raises(self):
        """Test that invalid IV percentile raises error."""
        with pytest.raises(ValueError, match="iv_percentile"):
            SignalThresholds(min_iv_percentile=150)
            
    def test_invalid_delta_raises(self):
        """Test that invalid delta raises error."""
        with pytest.raises(ValueError, match="delta"):
            SignalThresholds(max_delta=1.5)
            
    def test_invalid_dte_range_raises(self):
        """Test that invalid DTE range raises error."""
        with pytest.raises(ValueError, match="dte"):
            SignalThresholds(min_dte=50, max_dte=30)


class TestOptionSignalInput:
    """Tests for OptionSignalInput properties."""
    
    def test_mid_price(self, good_option):
        """Test mid price calculation."""
        assert good_option.mid_price == 2.525
        
    def test_spread_pct(self, good_option):
        """Test spread percentage calculation."""
        expected = (0.05 / 2.525) * 100
        assert good_option.spread_pct == pytest.approx(expected, rel=0.01)
        
    def test_dte(self, good_option):
        """Test DTE calculation."""
        assert good_option.dte == 35
        
    def test_iv_rv_ratio(self, good_option):
        """Test IV/RV ratio calculation."""
        expected = 0.22 / 0.18
        assert good_option.iv_rv_ratio == pytest.approx(expected, rel=0.01)
        
    def test_days_to_earnings(self, good_option):
        """Test days to earnings calculation."""
        assert good_option.days_to_earnings == 60


class TestEvaluateHardFilters:
    """Tests for hard filter evaluation."""
    
    def test_good_option_passes(self, good_option, default_thresholds):
        """Test that good option passes all filters."""
        passes, results = evaluate_hard_filters(good_option, default_thresholds)
        
        assert passes is True
        assert all(r.result in (FilterResult.PASS, FilterResult.SKIP) for r in results)
        
    def test_bad_option_fails(self, bad_option, default_thresholds):
        """Test that bad option fails filters."""
        passes, results = evaluate_hard_filters(bad_option, default_thresholds)
        
        assert passes is False
        # Should have at least one failure
        failures = [r for r in results if r.result == FilterResult.FAIL]
        assert len(failures) > 0
        
    def test_iv_percentile_filter(self, default_thresholds):
        """Test IV percentile filter specifically."""
        option_low = OptionSignalInput(
            symbol="SPY", strike=450, 
            expiration=date.today() + timedelta(days=35),
            option_type="p", bid=2.50, ask=2.55, underlying_price=460,
            iv_percentile=40,  # Below threshold
            open_interest=1000,
        )
        
        passes, results = evaluate_hard_filters(option_low, default_thresholds)
        
        iv_result = next(r for r in results if r.name == "iv_percentile")
        assert iv_result.result == FilterResult.FAIL
        assert passes is False
        
    def test_dte_filter(self, default_thresholds):
        """Test DTE filter specifically."""
        # Too short
        option_short = OptionSignalInput(
            symbol="SPY", strike=450,
            expiration=date.today() + timedelta(days=10),  # Too short
            option_type="p", bid=2.50, ask=2.55, underlying_price=460,
            iv_percentile=60, open_interest=1000,
        )
        
        passes, results = evaluate_hard_filters(option_short, default_thresholds)
        
        dte_result = next(r for r in results if r.name == "dte")
        assert dte_result.result == FilterResult.FAIL
        
    def test_earnings_filter(self, default_thresholds):
        """Test earnings buffer filter."""
        option = OptionSignalInput(
            symbol="SPY", strike=450,
            expiration=date.today() + timedelta(days=35),
            option_type="p", bid=2.50, ask=2.55, underlying_price=460,
            iv_percentile=60, open_interest=1000,
            next_earnings_date=date.today() + timedelta(days=5),  # Earnings in 5 days
        )
        
        passes, results = evaluate_hard_filters(option, default_thresholds)
        
        earnings_result = next(r for r in results if r.name == "earnings_buffer")
        assert earnings_result.result == FilterResult.FAIL


class TestCalculateScore:
    """Tests for score calculation."""
    
    def test_good_option_high_score(self, good_option, default_thresholds):
        """Test that good option gets high score."""
        score, breakdown = calculate_score(good_option, default_thresholds)
        
        assert score >= 4  # Should get several bonuses
        assert "iv_percentile_strong" in breakdown  # IV%ile > 70
        assert "iv_rv_elevated" in breakdown  # IV/RV > 1.3
        
    def test_marginal_option_low_score(self, marginal_option, default_thresholds):
        """Test that marginal option gets low score."""
        score, breakdown = calculate_score(marginal_option, default_thresholds)
        
        # Should have few or no bonuses
        assert score <= 2
        
    def test_optimal_dte_bonus(self, default_thresholds):
        """Test optimal DTE bonus."""
        option = OptionSignalInput(
            symbol="SPY", strike=450,
            expiration=date.today() + timedelta(days=38),  # In optimal range
            option_type="p", bid=2.50, ask=2.55, underlying_price=460,
        )
        
        score, breakdown = calculate_score(option, default_thresholds)
        
        assert "optimal_dte" in breakdown
        
    def test_low_delta_bonus(self, default_thresholds):
        """Test low delta bonus."""
        option = OptionSignalInput(
            symbol="SPY", strike=450,
            expiration=date.today() + timedelta(days=35),
            option_type="p", bid=2.50, ask=2.55, underlying_price=460,
            delta=-0.15,  # Below 0.20 threshold
        )
        
        score, breakdown = calculate_score(option, default_thresholds)
        
        assert "low_delta" in breakdown


class TestClassifySignalStrength:
    """Tests for signal strength classification."""
    
    def test_strength_none(self):
        """Test NONE strength for zero score."""
        assert classify_signal_strength(0) == SignalStrength.NONE
        
    def test_strength_weak(self):
        """Test WEAK strength for scores 1-2."""
        assert classify_signal_strength(1) == SignalStrength.WEAK
        assert classify_signal_strength(2) == SignalStrength.WEAK
        
    def test_strength_moderate(self):
        """Test MODERATE strength for scores 3-4."""
        assert classify_signal_strength(3) == SignalStrength.MODERATE
        assert classify_signal_strength(4) == SignalStrength.MODERATE
        
    def test_strength_strong(self):
        """Test STRONG strength for scores 5-6."""
        assert classify_signal_strength(5) == SignalStrength.STRONG
        assert classify_signal_strength(6) == SignalStrength.STRONG
        
    def test_strength_very_strong(self):
        """Test VERY_STRONG strength for scores 7+."""
        assert classify_signal_strength(7) == SignalStrength.VERY_STRONG
        assert classify_signal_strength(10) == SignalStrength.VERY_STRONG


class TestEvaluateOption:
    """Tests for complete option evaluation."""
    
    def test_good_option_result(self, good_option):
        """Test evaluation of good option."""
        result = evaluate_option(good_option)
        
        assert result.passes_filters is True
        assert result.score >= 4
        assert result.strength in (SignalStrength.STRONG, SignalStrength.VERY_STRONG)
        assert result.is_tradeable is True
        
    def test_bad_option_result(self, bad_option):
        """Test evaluation of bad option."""
        result = evaluate_option(bad_option)
        
        assert result.passes_filters is False
        assert result.score == 0
        assert result.strength == SignalStrength.NONE
        assert result.is_tradeable is False
        
    def test_custom_thresholds(self, marginal_option):
        """Test with custom thresholds."""
        strict = SignalThresholds(
            min_iv_percentile=60,  # Higher than default
            max_delta=0.25,  # Tighter than default
        )
        
        result = evaluate_option(marginal_option, strict)
        
        # Should fail with stricter thresholds
        assert result.passes_filters is False


class TestEvaluateChain:
    """Tests for chain evaluation."""
    
    def test_evaluate_chain(self, good_option, bad_option, marginal_option):
        """Test evaluating multiple options."""
        options = [good_option, bad_option, marginal_option]
        
        results = evaluate_chain(options)
        
        assert len(results) == 3
        # Should be sorted by score
        assert results[0].score >= results[1].score >= results[2].score
        
    def test_only_passing(self, good_option, bad_option):
        """Test only_passing filter."""
        options = [good_option, bad_option]
        
        results = evaluate_chain(options, only_passing=True)
        
        assert len(results) == 1
        assert results[0].passes_filters is True


class TestFindBestStrikes:
    """Tests for find_best_strikes."""
    
    def test_find_best(self, good_option, marginal_option, bad_option):
        """Test finding best strikes."""
        options = [bad_option, marginal_option, good_option]
        
        results = find_best_strikes(options, max_results=2)
        
        # Should only include passing options
        assert len(results) <= 2
        assert all(r.passes_filters for r in results)
        # Best should be first
        if len(results) > 0:
            assert results[0].symbol == good_option.symbol
```

## Acceptance Criteria

1. Hard filters correctly evaluate IV%ile, delta, DTE, OI, spread, earnings
2. Score calculation awards points for favorable conditions
3. Signal strength classification matches score ranges
4. `evaluate_option` returns complete SignalResult
5. `evaluate_chain` sorts by score and filters correctly
6. Warnings generated for earnings proximity and VIX backwardation
7. All tests pass: `poetry run pytest tests/signals/test_rules_engine.py -v`

## Output Files

- `theta/signals/rules_engine.py`
- `theta/signals/__init__.py`
- `tests/signals/test_rules_engine.py`

## Next Prompt

Prompt 10: CLI Interface - ties together all modules with a command-line watchlist scanner and signal display.
