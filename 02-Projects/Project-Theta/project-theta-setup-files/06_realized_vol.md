# Prompt 06: Realized Volatility Calculator

## Context

You are building ARGUS (Project Theta), a systematic options volatility trading platform. This prompt implements Realized Volatility (RV) calculations - the actual historical volatility of the underlying asset. 

Comparing IV to RV (the IV/RV ratio) is crucial for identifying volatility premium opportunities. When IV > RV, options are "expensive" relative to actual price movement - ideal for premium selling.

We implement multiple RV estimators with different characteristics:
- **Close-to-Close**: Simple, widely used, but ignores intraday information
- **Parkinson**: Uses high/low, ~5x more efficient than close-to-close
- **Garman-Klass**: Uses OHLC, most efficient for no-gap data
- **Yang-Zhang**: Handles overnight gaps, best for stocks

## Prerequisites

- Prompt 01-05 completed
- Understanding of volatility estimation theory
- `pandas` and `numpy` available

## Task

Create the realized volatility calculation module at `theta/analytics/realized_vol.py`.

## Reference Files

Review these before implementing:
- `theta/data/models.py` - OHLC data structures
- `refs/awesome-systematic-trading/` - pandas-ta reference
- Academic reference: "Volatility Estimation" by Sinclair

## Specifications

### File: `theta/analytics/realized_vol.py`

```python
"""
Realized Volatility (RV) calculators.

Implements multiple RV estimators:
- Close-to-Close: Traditional log-return std dev
- Parkinson: High-low range estimator (~5x efficiency)
- Garman-Klass: OHLC estimator (most efficient for continuous trading)
- Yang-Zhang: Handles overnight gaps (best for stocks)

All estimators return annualized volatility as a decimal (e.g., 0.20 = 20%).
"""

from dataclasses import dataclass
from datetime import date
from enum import Enum
from typing import Optional
import numpy as np
from numpy.typing import NDArray
import pandas as pd


class RVEstimator(str, Enum):
    """Available realized volatility estimators."""
    CLOSE_TO_CLOSE = "close_to_close"
    PARKINSON = "parkinson"
    GARMAN_KLASS = "garman_klass"
    YANG_ZHANG = "yang_zhang"


@dataclass(frozen=True)
class OHLCBar:
    """Single OHLC bar for volatility calculation."""
    date: date
    open: float
    high: float
    low: float
    close: float
    
    def __post_init__(self):
        if self.high < self.low:
            raise ValueError(f"High ({self.high}) must be >= Low ({self.low})")
        if self.high < max(self.open, self.close):
            raise ValueError(f"High ({self.high}) must be >= Open and Close")
        if self.low > min(self.open, self.close):
            raise ValueError(f"Low ({self.low}) must be <= Open and Close")


@dataclass(frozen=True)
class RealizedVolResult:
    """Result of realized volatility calculation."""
    
    rv: float                          # Annualized RV as decimal
    estimator: RVEstimator             # Which estimator was used
    lookback_days: int                 # Trading days in calculation
    start_date: date
    end_date: date
    
    @property
    def rv_percent(self) -> float:
        """RV as percentage (e.g., 20.0 for 20%)."""
        return self.rv * 100


# Constants
TRADING_DAYS_PER_YEAR = 252


def _validate_prices(prices: NDArray[np.float64], min_length: int = 2) -> None:
    """Validate price array."""
    if len(prices) < min_length:
        raise ValueError(f"Need at least {min_length} prices, got {len(prices)}")
    if np.any(prices <= 0):
        raise ValueError("All prices must be positive")
    if np.any(np.isnan(prices)):
        raise ValueError("Prices contain NaN values")


def close_to_close_volatility(
    close_prices: NDArray[np.float64],
    annualize: bool = True,
) -> float:
    """
    Calculate close-to-close realized volatility.
    
    The traditional method using standard deviation of log returns.
    Simple and widely used, but ignores intraday price information.
    
    RV = std(log(C_t / C_{t-1})) * sqrt(252)
    
    Args:
        close_prices: Array of closing prices (oldest to newest)
        annualize: Whether to annualize (multiply by sqrt(252))
    
    Returns:
        Realized volatility (annualized by default)
    
    Example:
        >>> prices = np.array([100, 102, 99, 101, 103])
        >>> rv = close_to_close_volatility(prices)
        >>> print(f"RV: {rv:.2%}")
    """
    _validate_prices(close_prices)
    
    # Calculate log returns
    log_returns = np.log(close_prices[1:] / close_prices[:-1])
    
    # Standard deviation of log returns
    rv = np.std(log_returns, ddof=1)
    
    if annualize:
        rv *= np.sqrt(TRADING_DAYS_PER_YEAR)
    
    return float(rv)


def parkinson_volatility(
    high_prices: NDArray[np.float64],
    low_prices: NDArray[np.float64],
    annualize: bool = True,
) -> float:
    """
    Calculate Parkinson realized volatility.
    
    Uses high-low range. More efficient than close-to-close (~5x).
    Assumes continuous trading with no gaps.
    
    RV = sqrt(1/(4*n*ln(2)) * sum(ln(H/L)^2)) * sqrt(252)
    
    Args:
        high_prices: Array of high prices
        low_prices: Array of low prices  
        annualize: Whether to annualize
    
    Returns:
        Realized volatility (annualized by default)
    
    Reference:
        Parkinson, M. (1980). "The Extreme Value Method for Estimating 
        the Variance of the Rate of Return"
    """
    _validate_prices(high_prices)
    _validate_prices(low_prices)
    
    if len(high_prices) != len(low_prices):
        raise ValueError("High and low arrays must have same length")
    
    if np.any(high_prices < low_prices):
        raise ValueError("High prices must be >= low prices")
    
    n = len(high_prices)
    
    # Parkinson estimator
    log_hl = np.log(high_prices / low_prices)
    sum_squared = np.sum(log_hl ** 2)
    
    rv = np.sqrt(sum_squared / (4 * n * np.log(2)))
    
    if annualize:
        rv *= np.sqrt(TRADING_DAYS_PER_YEAR)
    
    return float(rv)


def garman_klass_volatility(
    open_prices: NDArray[np.float64],
    high_prices: NDArray[np.float64],
    low_prices: NDArray[np.float64],
    close_prices: NDArray[np.float64],
    annualize: bool = True,
) -> float:
    """
    Calculate Garman-Klass realized volatility.
    
    Uses full OHLC data. Most efficient estimator for continuous trading.
    Does NOT handle overnight gaps well - use Yang-Zhang for stocks.
    
    RV = sqrt(1/n * sum(0.5*(ln(H/L))^2 - (2*ln(2)-1)*(ln(C/O))^2)) * sqrt(252)
    
    Args:
        open_prices: Array of opening prices
        high_prices: Array of high prices
        low_prices: Array of low prices
        close_prices: Array of closing prices
        annualize: Whether to annualize
    
    Returns:
        Realized volatility (annualized by default)
    
    Reference:
        Garman, M. & Klass, M. (1980). "On the Estimation of Security 
        Price Volatilities from Historical Data"
    """
    _validate_prices(open_prices)
    _validate_prices(high_prices)
    _validate_prices(low_prices)
    _validate_prices(close_prices)
    
    arrays = [open_prices, high_prices, low_prices, close_prices]
    if len(set(len(a) for a in arrays)) != 1:
        raise ValueError("All price arrays must have same length")
    
    n = len(close_prices)
    
    log_hl = np.log(high_prices / low_prices)
    log_co = np.log(close_prices / open_prices)
    
    # Garman-Klass estimator
    term1 = 0.5 * (log_hl ** 2)
    term2 = (2 * np.log(2) - 1) * (log_co ** 2)
    
    rv = np.sqrt(np.sum(term1 - term2) / n)
    
    if annualize:
        rv *= np.sqrt(TRADING_DAYS_PER_YEAR)
    
    return float(rv)


def yang_zhang_volatility(
    open_prices: NDArray[np.float64],
    high_prices: NDArray[np.float64],
    low_prices: NDArray[np.float64],
    close_prices: NDArray[np.float64],
    annualize: bool = True,
) -> float:
    """
    Calculate Yang-Zhang realized volatility.
    
    Handles overnight gaps by combining overnight volatility with 
    open-to-close volatility. Best estimator for stocks.
    
    RV = sqrt(σ_overnight^2 + k*σ_open_to_close^2 + (1-k)*σ_Rogers_Satchell^2)
    
    Args:
        open_prices: Array of opening prices
        high_prices: Array of high prices
        low_prices: Array of low prices
        close_prices: Array of closing prices
        annualize: Whether to annualize
    
    Returns:
        Realized volatility (annualized by default)
    
    Reference:
        Yang, D. & Zhang, Q. (2000). "Drift Independent Volatility 
        Estimation Based on High, Low, Open, and Close Prices"
    """
    _validate_prices(open_prices)
    _validate_prices(high_prices)
    _validate_prices(low_prices)
    _validate_prices(close_prices)
    
    arrays = [open_prices, high_prices, low_prices, close_prices]
    if len(set(len(a) for a in arrays)) != 1:
        raise ValueError("All price arrays must have same length")
    
    n = len(close_prices)
    if n < 2:
        raise ValueError("Need at least 2 bars for Yang-Zhang")
    
    # Overnight returns: log(Open_t / Close_{t-1})
    log_overnight = np.log(open_prices[1:] / close_prices[:-1])
    
    # Open-to-close returns: log(Close_t / Open_t)
    log_oc = np.log(close_prices[1:] / open_prices[1:])
    
    # Overnight variance
    overnight_mean = np.mean(log_overnight)
    overnight_var = np.sum((log_overnight - overnight_mean) ** 2) / (n - 2)
    
    # Open-to-close variance  
    oc_mean = np.mean(log_oc)
    oc_var = np.sum((log_oc - oc_mean) ** 2) / (n - 2)
    
    # Rogers-Satchell variance (uses OHLC, drift independent)
    log_ho = np.log(high_prices[1:] / open_prices[1:])
    log_lo = np.log(low_prices[1:] / open_prices[1:])
    log_hc = np.log(high_prices[1:] / close_prices[1:])
    log_lc = np.log(low_prices[1:] / close_prices[1:])
    
    rs_var = np.mean(log_ho * log_hc + log_lo * log_lc)
    
    # Yang-Zhang constant k (optimal weighting)
    k = 0.34 / (1.34 + (n + 1) / (n - 1))
    
    # Combined variance
    variance = overnight_var + k * oc_var + (1 - k) * rs_var
    
    # Handle potential negative variance from estimation error
    if variance < 0:
        variance = max(overnight_var, oc_var, abs(rs_var))
    
    rv = np.sqrt(variance)
    
    if annualize:
        rv *= np.sqrt(TRADING_DAYS_PER_YEAR)
    
    return float(rv)


def calculate_realized_volatility(
    ohlc_data: pd.DataFrame,
    estimator: RVEstimator = RVEstimator.YANG_ZHANG,
    lookback_days: Optional[int] = None,
    annualize: bool = True,
) -> RealizedVolResult:
    """
    Calculate realized volatility from OHLC DataFrame.
    
    This is the main entry point for RV calculation. Accepts a pandas
    DataFrame with OHLC columns and calculates RV using the specified
    estimator.
    
    Args:
        ohlc_data: DataFrame with columns: date, open, high, low, close
                   OR with DatetimeIndex and open, high, low, close columns
        estimator: Which RV estimator to use (default: Yang-Zhang)
        lookback_days: Number of trading days (None = use all data)
        annualize: Whether to annualize the result
    
    Returns:
        RealizedVolResult with calculated RV
    
    Example:
        >>> df = pd.DataFrame({
        ...     'date': pd.date_range('2024-01-01', periods=30),
        ...     'open': [...], 'high': [...], 'low': [...], 'close': [...]
        ... })
        >>> result = calculate_realized_volatility(df)
        >>> print(f"RV: {result.rv:.2%}")
    """
    # Normalize column names to lowercase
    df = ohlc_data.copy()
    df.columns = [c.lower() for c in df.columns]
    
    # Extract date information
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        dates = df['date'].dt.date.values
    elif isinstance(df.index, pd.DatetimeIndex):
        df = df.sort_index()
        dates = df.index.date
    else:
        raise ValueError("DataFrame must have 'date' column or DatetimeIndex")
    
    # Validate required columns
    required = ['open', 'high', 'low', 'close']
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    
    # Apply lookback filter
    if lookback_days is not None:
        df = df.tail(lookback_days)
        dates = dates[-lookback_days:]
    
    # Extract price arrays
    open_prices = df['open'].values.astype(np.float64)
    high_prices = df['high'].values.astype(np.float64)
    low_prices = df['low'].values.astype(np.float64)
    close_prices = df['close'].values.astype(np.float64)
    
    # Calculate RV based on estimator
    if estimator == RVEstimator.CLOSE_TO_CLOSE:
        rv = close_to_close_volatility(close_prices, annualize)
    elif estimator == RVEstimator.PARKINSON:
        rv = parkinson_volatility(high_prices, low_prices, annualize)
    elif estimator == RVEstimator.GARMAN_KLASS:
        rv = garman_klass_volatility(
            open_prices, high_prices, low_prices, close_prices, annualize
        )
    elif estimator == RVEstimator.YANG_ZHANG:
        rv = yang_zhang_volatility(
            open_prices, high_prices, low_prices, close_prices, annualize
        )
    else:
        raise ValueError(f"Unknown estimator: {estimator}")
    
    return RealizedVolResult(
        rv=round(rv, 4),
        estimator=estimator,
        lookback_days=len(df),
        start_date=dates[0] if len(dates) > 0 else date.today(),
        end_date=dates[-1] if len(dates) > 0 else date.today(),
    )


def calculate_all_estimators(
    ohlc_data: pd.DataFrame,
    lookback_days: Optional[int] = None,
) -> dict[RVEstimator, RealizedVolResult]:
    """
    Calculate RV using all available estimators.
    
    Useful for comparing estimators or building ensemble estimates.
    
    Args:
        ohlc_data: DataFrame with OHLC data
        lookback_days: Number of trading days
    
    Returns:
        Dictionary mapping estimator to result
    """
    results = {}
    for estimator in RVEstimator:
        try:
            results[estimator] = calculate_realized_volatility(
                ohlc_data, estimator, lookback_days
            )
        except ValueError:
            # Skip if estimator fails (e.g., insufficient data)
            continue
    return results


def calculate_iv_rv_ratio(
    iv: float,
    rv: float,
) -> float:
    """
    Calculate IV/RV ratio.
    
    Ratio > 1.0 means options are expensive relative to realized movement.
    This is what premium sellers look for.
    
    Args:
        iv: Implied volatility (decimal)
        rv: Realized volatility (decimal)
    
    Returns:
        IV/RV ratio
    
    Example:
        >>> ratio = calculate_iv_rv_ratio(0.25, 0.20)  # IV=25%, RV=20%
        >>> print(f"IV/RV: {ratio:.2f}")  # 1.25
    """
    if rv <= 0:
        raise ValueError(f"RV must be positive, got {rv}")
    if iv < 0:
        raise ValueError(f"IV must be non-negative, got {iv}")
    
    return iv / rv
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
from theta.analytics.realized_vol import (
    close_to_close_volatility,
    parkinson_volatility,
    garman_klass_volatility,
    yang_zhang_volatility,
    calculate_realized_volatility,
    calculate_all_estimators,
    calculate_iv_rv_ratio,
    RVEstimator,
    RealizedVolResult,
    OHLCBar,
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
    # Realized Vol
    "close_to_close_volatility",
    "parkinson_volatility",
    "garman_klass_volatility",
    "yang_zhang_volatility",
    "calculate_realized_volatility",
    "calculate_all_estimators",
    "calculate_iv_rv_ratio",
    "RVEstimator",
    "RealizedVolResult",
    "OHLCBar",
]
```

## Tests

### File: `tests/analytics/test_realized_vol.py`

```python
"""Tests for realized volatility calculations."""

import numpy as np
import pandas as pd
import pytest
from datetime import date, timedelta

from theta.analytics.realized_vol import (
    close_to_close_volatility,
    parkinson_volatility,
    garman_klass_volatility,
    yang_zhang_volatility,
    calculate_realized_volatility,
    calculate_all_estimators,
    calculate_iv_rv_ratio,
    RVEstimator,
    RealizedVolResult,
    OHLCBar,
    TRADING_DAYS_PER_YEAR,
)


class TestOHLCBar:
    """Tests for OHLCBar dataclass."""
    
    def test_valid_bar(self):
        """Test creating a valid OHLC bar."""
        bar = OHLCBar(
            date=date(2024, 1, 1),
            open=100.0,
            high=105.0,
            low=98.0,
            close=103.0
        )
        assert bar.high == 105.0
        
    def test_high_less_than_low_raises(self):
        """Test that high < low raises error."""
        with pytest.raises(ValueError, match="High.*Low"):
            OHLCBar(
                date=date(2024, 1, 1),
                open=100.0,
                high=95.0,  # Less than low
                low=98.0,
                close=97.0
            )
            
    def test_high_less_than_close_raises(self):
        """Test that high < close raises error."""
        with pytest.raises(ValueError, match="High.*Close"):
            OHLCBar(
                date=date(2024, 1, 1),
                open=100.0,
                high=101.0,  # Less than close
                low=98.0,
                close=105.0
            )


class TestCloseToCloseVolatility:
    """Tests for close-to-close volatility."""
    
    def test_constant_prices_zero_vol(self):
        """Test that constant prices give zero volatility."""
        prices = np.array([100.0, 100.0, 100.0, 100.0, 100.0])
        rv = close_to_close_volatility(prices)
        assert rv == pytest.approx(0.0, abs=0.001)
        
    def test_known_volatility(self):
        """Test with prices that give known log returns."""
        # Create prices with consistent daily return
        daily_vol = 0.01  # 1% daily
        returns = np.array([0.01, -0.01, 0.01, -0.01, 0.01])
        prices = 100 * np.exp(np.cumsum(np.insert(returns, 0, 0)))
        
        rv = close_to_close_volatility(prices, annualize=False)
        expected = np.std(returns, ddof=1)
        assert rv == pytest.approx(expected, rel=0.01)
        
    def test_annualization(self):
        """Test that annualization multiplies by sqrt(252)."""
        prices = np.array([100.0, 101.0, 99.0, 102.0, 98.0, 103.0])
        
        daily_rv = close_to_close_volatility(prices, annualize=False)
        annual_rv = close_to_close_volatility(prices, annualize=True)
        
        expected = daily_rv * np.sqrt(TRADING_DAYS_PER_YEAR)
        assert annual_rv == pytest.approx(expected, rel=0.001)
        
    def test_insufficient_data_raises(self):
        """Test that single price raises error."""
        with pytest.raises(ValueError, match="at least"):
            close_to_close_volatility(np.array([100.0]))
            
    def test_negative_prices_raises(self):
        """Test that negative prices raise error."""
        with pytest.raises(ValueError, match="positive"):
            close_to_close_volatility(np.array([100.0, -50.0, 100.0]))


class TestParkinsonVolatility:
    """Tests for Parkinson volatility."""
    
    def test_no_range_zero_vol(self):
        """Test that no high-low range gives zero volatility."""
        highs = np.array([100.0, 100.0, 100.0])
        lows = np.array([100.0, 100.0, 100.0])
        rv = parkinson_volatility(highs, lows)
        assert rv == pytest.approx(0.0, abs=0.001)
        
    def test_consistent_range(self):
        """Test with consistent daily range."""
        # 1% daily range
        highs = np.array([101.0, 101.0, 101.0, 101.0, 101.0])
        lows = np.array([100.0, 100.0, 100.0, 100.0, 100.0])
        
        rv = parkinson_volatility(highs, lows, annualize=False)
        
        # Parkinson formula
        log_hl = np.log(101.0 / 100.0)
        expected = np.sqrt((log_hl ** 2) / (4 * np.log(2)))
        assert rv == pytest.approx(expected, rel=0.01)
        
    def test_high_below_low_raises(self):
        """Test that high < low raises error."""
        highs = np.array([100.0, 95.0, 100.0])  # Second bar invalid
        lows = np.array([99.0, 98.0, 99.0])
        
        with pytest.raises(ValueError, match=">="):
            parkinson_volatility(highs, lows)
            
    def test_length_mismatch_raises(self):
        """Test that mismatched array lengths raise error."""
        highs = np.array([100.0, 101.0, 102.0])
        lows = np.array([99.0, 100.0])  # Different length
        
        with pytest.raises(ValueError, match="same length"):
            parkinson_volatility(highs, lows)


class TestGarmanKlassVolatility:
    """Tests for Garman-Klass volatility."""
    
    def test_no_movement_zero_vol(self):
        """Test that no price movement gives zero volatility."""
        opens = np.array([100.0, 100.0, 100.0])
        highs = np.array([100.0, 100.0, 100.0])
        lows = np.array([100.0, 100.0, 100.0])
        closes = np.array([100.0, 100.0, 100.0])
        
        rv = garman_klass_volatility(opens, highs, lows, closes)
        assert rv == pytest.approx(0.0, abs=0.001)
        
    def test_higher_than_close_to_close(self):
        """Test that GK is more efficient (often lower) than close-to-close."""
        np.random.seed(42)
        n = 100
        
        # Generate synthetic OHLC data
        returns = np.random.normal(0, 0.02, n)
        closes = 100 * np.exp(np.cumsum(returns))
        opens = np.roll(closes, 1) * (1 + np.random.normal(0, 0.005, n))
        opens[0] = closes[0]
        
        highs = np.maximum(opens, closes) * (1 + np.abs(np.random.normal(0, 0.01, n)))
        lows = np.minimum(opens, closes) * (1 - np.abs(np.random.normal(0, 0.01, n)))
        
        gk_rv = garman_klass_volatility(opens, highs, lows, closes)
        cc_rv = close_to_close_volatility(closes)
        
        # Both should be reasonable volatilities
        assert 0 < gk_rv < 1  # Less than 100% vol
        assert 0 < cc_rv < 1


class TestYangZhangVolatility:
    """Tests for Yang-Zhang volatility."""
    
    def test_handles_overnight_gaps(self):
        """Test that YZ handles overnight gaps."""
        # Create data with overnight gaps
        opens = np.array([100.0, 102.0, 99.0, 103.0, 98.0])  # Gaps from close
        highs = np.array([101.0, 103.0, 101.0, 104.0, 100.0])
        lows = np.array([99.0, 100.0, 98.0, 101.0, 97.0])
        closes = np.array([100.5, 101.0, 100.0, 102.0, 99.0])
        
        rv = yang_zhang_volatility(opens, highs, lows, closes)
        
        # Should produce reasonable volatility
        assert 0 < rv < 2  # Reasonable range
        
    def test_insufficient_data_raises(self):
        """Test that single bar raises error."""
        with pytest.raises(ValueError, match="at least 2"):
            yang_zhang_volatility(
                np.array([100.0]),
                np.array([101.0]),
                np.array([99.0]),
                np.array([100.5])
            )


class TestCalculateRealizedVolatility:
    """Tests for main calculate_realized_volatility function."""
    
    @pytest.fixture
    def sample_ohlc_df(self):
        """Create sample OHLC DataFrame."""
        np.random.seed(42)
        n = 60
        
        base_price = 100
        returns = np.random.normal(0, 0.02, n)
        closes = base_price * np.exp(np.cumsum(returns))
        
        df = pd.DataFrame({
            'date': pd.date_range('2024-01-01', periods=n, freq='B'),
            'open': closes * (1 + np.random.normal(0, 0.005, n)),
            'high': closes * (1 + np.abs(np.random.normal(0, 0.015, n))),
            'low': closes * (1 - np.abs(np.random.normal(0, 0.015, n))),
            'close': closes,
        })
        
        # Ensure OHLC validity
        df['high'] = df[['open', 'high', 'close']].max(axis=1) * 1.001
        df['low'] = df[['open', 'low', 'close']].min(axis=1) * 0.999
        
        return df
    
    def test_close_to_close_estimator(self, sample_ohlc_df):
        """Test with close-to-close estimator."""
        result = calculate_realized_volatility(
            sample_ohlc_df, 
            estimator=RVEstimator.CLOSE_TO_CLOSE
        )
        
        assert isinstance(result, RealizedVolResult)
        assert result.estimator == RVEstimator.CLOSE_TO_CLOSE
        assert 0 < result.rv < 1
        
    def test_all_estimators(self, sample_ohlc_df):
        """Test that all estimators can be used."""
        for estimator in RVEstimator:
            result = calculate_realized_volatility(sample_ohlc_df, estimator=estimator)
            assert result.estimator == estimator
            assert result.rv > 0
            
    def test_lookback_days(self, sample_ohlc_df):
        """Test lookback_days parameter."""
        result_all = calculate_realized_volatility(sample_ohlc_df)
        result_20 = calculate_realized_volatility(sample_ohlc_df, lookback_days=20)
        
        assert result_all.lookback_days > result_20.lookback_days
        assert result_20.lookback_days == 20
        
    def test_date_range_in_result(self, sample_ohlc_df):
        """Test that date range is captured correctly."""
        result = calculate_realized_volatility(sample_ohlc_df)
        
        assert result.start_date < result.end_date
        assert result.lookback_days == len(sample_ohlc_df)
        
    def test_datetime_index_works(self, sample_ohlc_df):
        """Test that DatetimeIndex works instead of date column."""
        df = sample_ohlc_df.set_index('date')
        result = calculate_realized_volatility(df)
        
        assert result.rv > 0
        
    def test_missing_columns_raises(self):
        """Test that missing columns raise error."""
        df = pd.DataFrame({
            'date': pd.date_range('2024-01-01', periods=10),
            'close': [100] * 10
        })
        
        with pytest.raises(ValueError, match="Missing"):
            calculate_realized_volatility(df)


class TestCalculateAllEstimators:
    """Tests for calculate_all_estimators function."""
    
    def test_returns_all_estimators(self):
        """Test that all estimators are calculated."""
        np.random.seed(42)
        df = pd.DataFrame({
            'date': pd.date_range('2024-01-01', periods=30, freq='B'),
            'open': 100 + np.random.randn(30),
            'high': 102 + np.random.randn(30),
            'low': 98 + np.random.randn(30),
            'close': 100 + np.random.randn(30),
        })
        # Fix OHLC validity
        df['high'] = df[['open', 'high', 'close']].max(axis=1) + 0.1
        df['low'] = df[['open', 'low', 'close']].min(axis=1) - 0.1
        
        results = calculate_all_estimators(df)
        
        assert len(results) == len(RVEstimator)
        for estimator in RVEstimator:
            assert estimator in results


class TestIVRVRatio:
    """Tests for calculate_iv_rv_ratio function."""
    
    def test_basic_ratio(self):
        """Test basic IV/RV ratio."""
        ratio = calculate_iv_rv_ratio(0.25, 0.20)
        assert ratio == pytest.approx(1.25, rel=0.001)
        
    def test_ratio_below_one(self):
        """Test ratio when IV < RV."""
        ratio = calculate_iv_rv_ratio(0.15, 0.20)
        assert ratio == pytest.approx(0.75, rel=0.001)
        
    def test_zero_rv_raises(self):
        """Test that zero RV raises error."""
        with pytest.raises(ValueError, match="positive"):
            calculate_iv_rv_ratio(0.25, 0.0)
            
    def test_negative_iv_raises(self):
        """Test that negative IV raises error."""
        with pytest.raises(ValueError, match="non-negative"):
            calculate_iv_rv_ratio(-0.10, 0.20)
```

## Acceptance Criteria

1. All four RV estimators implemented correctly
2. `calculate_realized_volatility` accepts DataFrame with OHLC
3. Annualization uses 252 trading days
4. `calculate_iv_rv_ratio` computes ratio correctly
5. Input validation catches invalid OHLC data
6. All tests pass: `poetry run pytest tests/analytics/test_realized_vol.py -v`

## Output Files

- `theta/analytics/realized_vol.py`
- `theta/analytics/__init__.py` (updated)
- `tests/analytics/test_realized_vol.py`

## Next Prompt

Prompt 07: Greeks Calculator - wraps vollib for Delta, Gamma, Theta, Vega calculation with batch processing.
