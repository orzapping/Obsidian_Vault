# Prompt 05: IV Percentile & Rank Calculator

## Context

You are building ARGUS (Project Theta), a systematic options volatility trading platform. This prompt implements the IV Percentile and IV Rank calculations - critical metrics for identifying elevated implied volatility environments suitable for premium selling strategies.

**IV Percentile** answers: "What percentage of days in the lookback period had IV lower than today?"
**IV Rank** answers: "Where does current IV sit between the 52-week high and low?"

Both metrics help identify when options are "expensive" relative to historical norms.

## Prerequisites

- Prompt 01 (project setup) completed
- Prompt 02 (data models) completed  
- Prompt 03 (massive client) completed
- Prompt 04 (iv_calculator) completed

## Task

Create the IV percentile and rank calculation module at `theta/analytics/percentile.py`.

## Reference Files

Review these before implementing:
- `theta/data/models.py` - IVMetrics model
- `theta/analytics/iv_calculator.py` - IV calculation utilities
- `refs/ThetaTracker/` - Reference implementation patterns

## Specifications

### File: `theta/analytics/percentile.py`

```python
"""
IV Percentile and IV Rank calculations.

IV Percentile = (Days where IV < Current) / Total Days × 100
IV Rank = (Current - 52wk Low) / (52wk High - 52wk Low) × 100

These metrics identify elevated IV environments for premium selling.
"""

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional
import numpy as np
from numpy.typing import NDArray


@dataclass(frozen=True)
class IVPercentileResult:
    """Result of IV percentile/rank calculation."""
    
    current_iv: float
    iv_percentile: float          # 0-100, percentage of days with lower IV
    iv_rank: float                # 0-100, position between high/low
    high_52w: float               # 52-week high IV
    low_52w: float                # 52-week low IV
    mean_iv: float                # Mean IV over period
    std_iv: float                 # Std dev of IV over period
    lookback_days: int            # Actual days in calculation
    as_of_date: date
    
    @property
    def is_elevated(self) -> bool:
        """IV is considered elevated if percentile > 50."""
        return self.iv_percentile > 50
    
    @property
    def is_high(self) -> bool:
        """IV is considered high if percentile > 70."""
        return self.iv_percentile > 70
    
    @property
    def z_score(self) -> float:
        """Standard deviations from mean."""
        if self.std_iv == 0:
            return 0.0
        return (self.current_iv - self.mean_iv) / self.std_iv


def calculate_iv_percentile(
    current_iv: float,
    historical_ivs: NDArray[np.float64],
    as_of_date: Optional[date] = None,
) -> IVPercentileResult:
    """
    Calculate IV percentile and rank from historical IV data.
    
    Args:
        current_iv: Current implied volatility (as decimal, e.g., 0.25 for 25%)
        historical_ivs: Array of historical IV values (same format as current_iv)
        as_of_date: Date of calculation (defaults to today)
    
    Returns:
        IVPercentileResult with all metrics
    
    Raises:
        ValueError: If insufficient historical data or invalid inputs
    
    Example:
        >>> ivs = np.array([0.20, 0.22, 0.25, 0.30, 0.28, 0.24])
        >>> result = calculate_iv_percentile(0.26, ivs)
        >>> print(f"Percentile: {result.iv_percentile:.1f}%")
    """
    if as_of_date is None:
        as_of_date = date.today()
    
    # Validate inputs
    if current_iv <= 0:
        raise ValueError(f"Current IV must be positive, got {current_iv}")
    
    if len(historical_ivs) < 5:
        raise ValueError(
            f"Insufficient historical data: need at least 5 points, got {len(historical_ivs)}"
        )
    
    # Remove any NaN or invalid values
    valid_ivs = historical_ivs[~np.isnan(historical_ivs)]
    valid_ivs = valid_ivs[valid_ivs > 0]
    
    if len(valid_ivs) < 5:
        raise ValueError(
            f"Insufficient valid historical data after filtering: {len(valid_ivs)} points"
        )
    
    # Calculate IV Percentile
    # Count days where historical IV was lower than current
    days_below = np.sum(valid_ivs < current_iv)
    iv_percentile = (days_below / len(valid_ivs)) * 100
    
    # Calculate IV Rank
    high_52w = float(np.max(valid_ivs))
    low_52w = float(np.min(valid_ivs))
    
    if high_52w == low_52w:
        # No variation in IV - set rank to 50
        iv_rank = 50.0
    else:
        iv_rank = ((current_iv - low_52w) / (high_52w - low_52w)) * 100
        # Clamp to 0-100 (current could be outside historical range)
        iv_rank = max(0.0, min(100.0, iv_rank))
    
    # Calculate statistics
    mean_iv = float(np.mean(valid_ivs))
    std_iv = float(np.std(valid_ivs, ddof=1))  # Sample std dev
    
    return IVPercentileResult(
        current_iv=current_iv,
        iv_percentile=round(iv_percentile, 2),
        iv_rank=round(iv_rank, 2),
        high_52w=round(high_52w, 4),
        low_52w=round(low_52w, 4),
        mean_iv=round(mean_iv, 4),
        std_iv=round(std_iv, 4),
        lookback_days=len(valid_ivs),
        as_of_date=as_of_date,
    )


def calculate_iv_percentile_from_series(
    iv_series: dict[date, float],
    lookback_days: int = 252,
    as_of_date: Optional[date] = None,
) -> IVPercentileResult:
    """
    Calculate IV percentile from a date-keyed series.
    
    This is the typical use case where you have historical IV data
    indexed by date from an API or database.
    
    Args:
        iv_series: Dictionary mapping dates to IV values
        lookback_days: Number of trading days to look back (default 252 = 1 year)
        as_of_date: Date to calculate for (defaults to most recent in series)
    
    Returns:
        IVPercentileResult
    
    Example:
        >>> series = {
        ...     date(2024, 1, 1): 0.22,
        ...     date(2024, 1, 2): 0.24,
        ...     date(2024, 1, 3): 0.23,
        ...     # ... more dates
        ... }
        >>> result = calculate_iv_percentile_from_series(series)
    """
    if not iv_series:
        raise ValueError("IV series is empty")
    
    # Sort dates
    sorted_dates = sorted(iv_series.keys())
    
    # Determine as_of_date
    if as_of_date is None:
        as_of_date = sorted_dates[-1]
    
    # Get current IV
    if as_of_date not in iv_series:
        # Find the closest date before as_of_date
        valid_dates = [d for d in sorted_dates if d <= as_of_date]
        if not valid_dates:
            raise ValueError(f"No IV data available on or before {as_of_date}")
        as_of_date = valid_dates[-1]
    
    current_iv = iv_series[as_of_date]
    
    # Calculate cutoff date for lookback
    cutoff_date = as_of_date - timedelta(days=int(lookback_days * 365 / 252))
    
    # Get historical IVs within lookback period (excluding current)
    historical_ivs = np.array([
        iv for d, iv in iv_series.items()
        if cutoff_date <= d < as_of_date
    ])
    
    return calculate_iv_percentile(current_iv, historical_ivs, as_of_date)


def calculate_rolling_percentile(
    iv_series: dict[date, float],
    lookback_days: int = 252,
    min_periods: int = 20,
) -> dict[date, IVPercentileResult]:
    """
    Calculate rolling IV percentile for each date in series.
    
    Useful for backtesting or visualizing percentile over time.
    
    Args:
        iv_series: Dictionary mapping dates to IV values
        lookback_days: Rolling window size in trading days
        min_periods: Minimum data points required for calculation
    
    Returns:
        Dictionary mapping dates to IVPercentileResult
    """
    if len(iv_series) < min_periods:
        raise ValueError(
            f"Insufficient data for rolling calculation: "
            f"need {min_periods}, got {len(iv_series)}"
        )
    
    sorted_dates = sorted(iv_series.keys())
    results: dict[date, IVPercentileResult] = {}
    
    for i, current_date in enumerate(sorted_dates):
        if i < min_periods:
            continue
        
        # Get lookback window
        start_idx = max(0, i - lookback_days)
        historical_dates = sorted_dates[start_idx:i]
        
        if len(historical_dates) < min_periods:
            continue
        
        historical_ivs = np.array([iv_series[d] for d in historical_dates])
        current_iv = iv_series[current_date]
        
        try:
            result = calculate_iv_percentile(
                current_iv, historical_ivs, current_date
            )
            results[current_date] = result
        except ValueError:
            # Skip dates with insufficient valid data
            continue
    
    return results


def compare_iv_to_threshold(
    result: IVPercentileResult,
    percentile_threshold: float = 50.0,
    rank_threshold: float = 50.0,
) -> dict[str, bool]:
    """
    Compare IV metrics against thresholds for signal generation.
    
    Args:
        result: IVPercentileResult to evaluate
        percentile_threshold: Minimum IV percentile (default 50)
        rank_threshold: Minimum IV rank (default 50)
    
    Returns:
        Dictionary with boolean flags for each condition
    """
    return {
        "percentile_above_threshold": result.iv_percentile >= percentile_threshold,
        "rank_above_threshold": result.iv_rank >= rank_threshold,
        "is_elevated": result.is_elevated,
        "is_high": result.is_high,
        "above_mean": result.current_iv > result.mean_iv,
        "z_score_positive": result.z_score > 0,
        "z_score_above_one": result.z_score > 1.0,
    }
```

### File: `theta/analytics/__init__.py` (update)

```python
"""Analytics modules for options analysis."""

from theta.analytics.iv_calculator import (
    calculate_iv,
    calculate_iv_for_chain,
    calculate_atm_iv,
    IVCalculationError,
)
from theta.analytics.percentile import (
    calculate_iv_percentile,
    calculate_iv_percentile_from_series,
    calculate_rolling_percentile,
    compare_iv_to_threshold,
    IVPercentileResult,
)

__all__ = [
    # IV Calculator
    "calculate_iv",
    "calculate_iv_for_chain",
    "calculate_atm_iv",
    "IVCalculationError",
    # Percentile
    "calculate_iv_percentile",
    "calculate_iv_percentile_from_series",
    "calculate_rolling_percentile",
    "compare_iv_to_threshold",
    "IVPercentileResult",
]
```

## Tests

### File: `tests/analytics/test_percentile.py`

```python
"""Tests for IV percentile and rank calculations."""

import numpy as np
import pytest
from datetime import date, timedelta

from theta.analytics.percentile import (
    calculate_iv_percentile,
    calculate_iv_percentile_from_series,
    calculate_rolling_percentile,
    compare_iv_to_threshold,
    IVPercentileResult,
)


class TestIVPercentileResult:
    """Tests for IVPercentileResult dataclass."""
    
    def test_is_elevated(self):
        """Test is_elevated property."""
        result = IVPercentileResult(
            current_iv=0.30,
            iv_percentile=60.0,
            iv_rank=55.0,
            high_52w=0.40,
            low_52w=0.20,
            mean_iv=0.28,
            std_iv=0.05,
            lookback_days=252,
            as_of_date=date.today(),
        )
        assert result.is_elevated is True
        
    def test_is_not_elevated(self):
        """Test is_elevated returns False below 50."""
        result = IVPercentileResult(
            current_iv=0.22,
            iv_percentile=30.0,
            iv_rank=25.0,
            high_52w=0.40,
            low_52w=0.20,
            mean_iv=0.28,
            std_iv=0.05,
            lookback_days=252,
            as_of_date=date.today(),
        )
        assert result.is_elevated is False
        
    def test_is_high(self):
        """Test is_high property."""
        result = IVPercentileResult(
            current_iv=0.35,
            iv_percentile=75.0,
            iv_rank=80.0,
            high_52w=0.40,
            low_52w=0.20,
            mean_iv=0.28,
            std_iv=0.05,
            lookback_days=252,
            as_of_date=date.today(),
        )
        assert result.is_high is True
        
    def test_z_score(self):
        """Test z_score calculation."""
        result = IVPercentileResult(
            current_iv=0.38,
            iv_percentile=90.0,
            iv_rank=90.0,
            high_52w=0.40,
            low_52w=0.20,
            mean_iv=0.28,
            std_iv=0.05,
            lookback_days=252,
            as_of_date=date.today(),
        )
        # (0.38 - 0.28) / 0.05 = 2.0
        assert result.z_score == pytest.approx(2.0, rel=0.01)


class TestCalculateIVPercentile:
    """Tests for calculate_iv_percentile function."""
    
    def test_basic_percentile(self):
        """Test basic percentile calculation."""
        # 6 historical values, current at 0.26
        historical = np.array([0.20, 0.22, 0.24, 0.25, 0.28, 0.30])
        current = 0.26
        
        result = calculate_iv_percentile(current, historical)
        
        # 4 values below 0.26 (0.20, 0.22, 0.24, 0.25), out of 6
        # Percentile = 4/6 * 100 = 66.67
        assert result.iv_percentile == pytest.approx(66.67, rel=0.01)
        
    def test_iv_rank(self):
        """Test IV rank calculation."""
        historical = np.array([0.20, 0.25, 0.30, 0.35, 0.40])
        current = 0.30
        
        result = calculate_iv_percentile(current, historical)
        
        # Rank = (0.30 - 0.20) / (0.40 - 0.20) * 100 = 50%
        assert result.iv_rank == pytest.approx(50.0, rel=0.01)
        
    def test_high_low_values(self):
        """Test 52-week high/low extraction."""
        historical = np.array([0.18, 0.22, 0.25, 0.30, 0.42])
        current = 0.28
        
        result = calculate_iv_percentile(current, historical)
        
        assert result.high_52w == pytest.approx(0.42, rel=0.001)
        assert result.low_52w == pytest.approx(0.18, rel=0.001)
        
    def test_mean_and_std(self):
        """Test mean and std calculation."""
        historical = np.array([0.20, 0.20, 0.20, 0.20, 0.20])
        current = 0.25
        
        result = calculate_iv_percentile(current, historical)
        
        assert result.mean_iv == pytest.approx(0.20, rel=0.001)
        assert result.std_iv == pytest.approx(0.0, abs=0.001)
        
    def test_percentile_at_extremes(self):
        """Test percentile when current is outside historical range."""
        historical = np.array([0.20, 0.22, 0.24, 0.26, 0.28])
        
        # Current below all historical
        result_low = calculate_iv_percentile(0.15, historical)
        assert result_low.iv_percentile == 0.0
        
        # Current above all historical
        result_high = calculate_iv_percentile(0.35, historical)
        assert result_high.iv_percentile == 100.0
        
    def test_iv_rank_clamped(self):
        """Test IV rank is clamped to 0-100."""
        historical = np.array([0.20, 0.22, 0.24, 0.26, 0.28])
        
        # Current above historical high - should clamp to 100
        result = calculate_iv_percentile(0.40, historical)
        assert result.iv_rank == 100.0
        
        # Current below historical low - should clamp to 0
        result = calculate_iv_percentile(0.10, historical)
        assert result.iv_rank == 0.0
        
    def test_filters_nan_values(self):
        """Test that NaN values are filtered from historical data."""
        historical = np.array([0.20, np.nan, 0.24, np.nan, 0.28, 0.30])
        current = 0.26
        
        result = calculate_iv_percentile(current, historical)
        
        # Should only use 4 valid values
        assert result.lookback_days == 4
        
    def test_filters_zero_values(self):
        """Test that zero/negative values are filtered."""
        historical = np.array([0.20, 0.0, 0.24, -0.10, 0.28, 0.30])
        current = 0.26
        
        result = calculate_iv_percentile(current, historical)
        
        # Should only use 4 valid values
        assert result.lookback_days == 4
        
    def test_insufficient_data_raises(self):
        """Test that insufficient data raises ValueError."""
        historical = np.array([0.20, 0.22, 0.24])  # Only 3 points
        
        with pytest.raises(ValueError, match="at least 5"):
            calculate_iv_percentile(0.25, historical)
            
    def test_invalid_current_iv_raises(self):
        """Test that invalid current IV raises ValueError."""
        historical = np.array([0.20, 0.22, 0.24, 0.26, 0.28])
        
        with pytest.raises(ValueError, match="positive"):
            calculate_iv_percentile(-0.10, historical)
            
        with pytest.raises(ValueError, match="positive"):
            calculate_iv_percentile(0, historical)


class TestCalculateIVPercentileFromSeries:
    """Tests for calculate_iv_percentile_from_series function."""
    
    def test_basic_series(self):
        """Test calculation from date series."""
        today = date.today()
        series = {
            today - timedelta(days=i): 0.20 + (i % 10) * 0.01
            for i in range(1, 101)
        }
        series[today] = 0.28
        
        result = calculate_iv_percentile_from_series(series)
        
        assert result.as_of_date == today
        assert result.current_iv == 0.28
        assert result.lookback_days > 0
        
    def test_uses_most_recent_date_by_default(self):
        """Test that most recent date is used if as_of_date not specified."""
        base = date(2024, 6, 1)
        series = {
            base + timedelta(days=i): 0.25 + (i * 0.001)
            for i in range(100)
        }
        
        result = calculate_iv_percentile_from_series(series)
        
        expected_date = base + timedelta(days=99)
        assert result.as_of_date == expected_date
        
    def test_respects_lookback_days(self):
        """Test that lookback_days parameter is respected."""
        today = date.today()
        series = {
            today - timedelta(days=i): 0.25
            for i in range(500)
        }
        series[today] = 0.25
        
        result = calculate_iv_percentile_from_series(series, lookback_days=100)
        
        # Should use approximately 100 days (minus weekends approximation)
        assert result.lookback_days <= 150  # Allow some buffer
        
    def test_empty_series_raises(self):
        """Test that empty series raises ValueError."""
        with pytest.raises(ValueError, match="empty"):
            calculate_iv_percentile_from_series({})


class TestCalculateRollingPercentile:
    """Tests for calculate_rolling_percentile function."""
    
    def test_rolling_calculation(self):
        """Test rolling percentile calculation."""
        base = date(2024, 1, 1)
        series = {
            base + timedelta(days=i): 0.20 + (i % 20) * 0.01
            for i in range(100)
        }
        
        results = calculate_rolling_percentile(series, lookback_days=50, min_periods=20)
        
        # Should have results for dates after min_periods
        assert len(results) > 0
        assert all(isinstance(r, IVPercentileResult) for r in results.values())
        
    def test_insufficient_data_raises(self):
        """Test that insufficient data raises ValueError."""
        series = {date(2024, 1, i): 0.25 for i in range(1, 10)}
        
        with pytest.raises(ValueError, match="Insufficient"):
            calculate_rolling_percentile(series, min_periods=20)


class TestCompareIVToThreshold:
    """Tests for compare_iv_to_threshold function."""
    
    def test_all_conditions_met(self):
        """Test when all conditions are met."""
        result = IVPercentileResult(
            current_iv=0.35,
            iv_percentile=75.0,
            iv_rank=70.0,
            high_52w=0.40,
            low_52w=0.20,
            mean_iv=0.28,
            std_iv=0.05,
            lookback_days=252,
            as_of_date=date.today(),
        )
        
        comparison = compare_iv_to_threshold(result, percentile_threshold=50.0)
        
        assert comparison["percentile_above_threshold"] is True
        assert comparison["rank_above_threshold"] is True
        assert comparison["is_elevated"] is True
        assert comparison["is_high"] is True
        assert comparison["above_mean"] is True
        assert comparison["z_score_positive"] is True
        
    def test_low_iv_fails_conditions(self):
        """Test when IV is low."""
        result = IVPercentileResult(
            current_iv=0.22,
            iv_percentile=20.0,
            iv_rank=15.0,
            high_52w=0.40,
            low_52w=0.20,
            mean_iv=0.28,
            std_iv=0.05,
            lookback_days=252,
            as_of_date=date.today(),
        )
        
        comparison = compare_iv_to_threshold(result)
        
        assert comparison["percentile_above_threshold"] is False
        assert comparison["rank_above_threshold"] is False
        assert comparison["is_elevated"] is False
        assert comparison["is_high"] is False
        assert comparison["above_mean"] is False
        assert comparison["z_score_positive"] is False
```

## Acceptance Criteria

1. `calculate_iv_percentile` correctly computes percentile from array
2. `calculate_iv_percentile_from_series` works with date-keyed dictionaries
3. IV Rank is clamped to 0-100 range
4. NaN and invalid values are filtered from historical data
5. Appropriate errors raised for insufficient data
6. `IVPercentileResult` properties (`is_elevated`, `is_high`, `z_score`) work correctly
7. All tests pass: `poetry run pytest tests/analytics/test_percentile.py -v`

## Output Files

- `theta/analytics/percentile.py`
- `theta/analytics/__init__.py` (updated)
- `tests/analytics/test_percentile.py`

## Next Prompt

Prompt 06: Realized Volatility Calculator - implements close-to-close and advanced RV estimators (Parkinson, Garman-Klass, Yang-Zhang).
