# Prompt 07: Greeks Calculator

## Context

You are building ARGUS (Project Theta), a systematic options volatility trading platform. This prompt implements the Greeks calculation module - Delta, Gamma, Theta, Vega, and Rho.

Greeks quantify option price sensitivity:
- **Delta**: Price change per $1 move in underlying
- **Gamma**: Rate of change of Delta
- **Theta**: Time decay per day
- **Vega**: Price change per 1% IV change
- **Rho**: Price change per 1% interest rate change

For premium selling (short options), we particularly care about:
- Delta (directional risk)
- Theta (positive for short positions - time is on our side)
- Vega (negative for short positions - we want IV to drop)

## Prerequisites

- Prompt 01-06 completed
- `py_vollib` or `py_vollib_vectorized` installed
- Understanding of Black-Scholes model

## Task

Create the Greeks calculation module at `theta/analytics/greeks.py`.

## Reference Files

Review these before implementing:
- `theta/data/models.py` - OptionContract, Greeks models
- `refs/iv-greeks-dashboard/` - Reference implementation
- `vollib` documentation

## Specifications

### File: `theta/analytics/greeks.py`

```python
"""
Greeks calculation module using Black-Scholes model.

Wraps vollib for efficient Greeks computation with:
- Single option calculation
- Batch processing for chains
- Portfolio-level Greek aggregation

Greeks are calculated per-contract (multiply by 100 for per-lot).
"""

from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum
from typing import Optional, Sequence
import numpy as np

# Try vectorized version first, fall back to standard
try:
    from py_vollib_vectorized import vectorized_implied_volatility
    from py_vollib_vectorized.greeks import delta as vec_delta
    from py_vollib_vectorized.greeks import gamma as vec_gamma
    from py_vollib_vectorized.greeks import theta as vec_theta
    from py_vollib_vectorized.greeks import vega as vec_vega
    from py_vollib_vectorized.greeks import rho as vec_rho
    VECTORIZED_AVAILABLE = True
except ImportError:
    VECTORIZED_AVAILABLE = False

from py_vollib.black_scholes.greeks.analytical import delta as bs_delta
from py_vollib.black_scholes.greeks.analytical import gamma as bs_gamma
from py_vollib.black_scholes.greeks.analytical import theta as bs_theta
from py_vollib.black_scholes.greeks.analytical import vega as bs_vega
from py_vollib.black_scholes.greeks.analytical import rho as bs_rho


class OptionType(str, Enum):
    """Option type enum."""
    CALL = "c"
    PUT = "p"


@dataclass(frozen=True)
class GreeksResult:
    """Complete Greeks for a single option."""
    
    delta: float          # Price change per $1 underlying move
    gamma: float          # Rate of change of delta
    theta: float          # Daily time decay (negative for long positions)
    vega: float           # Price change per 1% IV change
    rho: float            # Price change per 1% rate change
    
    # Input parameters (for reference)
    underlying_price: float
    strike: float
    time_to_expiry: float  # Years
    volatility: float      # IV as decimal
    risk_free_rate: float
    option_type: OptionType
    
    @property
    def theta_per_day(self) -> float:
        """Theta expressed as daily decay."""
        return self.theta / 365
    
    @property
    def vega_per_point(self) -> float:
        """Vega for 1 vol point (1%) move."""
        return self.vega / 100
    
    def for_position(self, quantity: int) -> "PositionGreeks":
        """
        Calculate Greeks for a position of given size.
        
        Positive quantity = long position
        Negative quantity = short position
        
        Returns Greeks scaled by quantity and contract multiplier (100).
        """
        multiplier = quantity * 100  # Options contract = 100 shares
        
        return PositionGreeks(
            delta=self.delta * multiplier,
            gamma=self.gamma * multiplier,
            theta=self.theta * multiplier,
            vega=self.vega * multiplier,
            rho=self.rho * multiplier,
            quantity=quantity,
            underlying_price=self.underlying_price,
            strike=self.strike,
        )


@dataclass(frozen=True)
class PositionGreeks:
    """Greeks for a position (quantity * 100 shares)."""
    
    delta: float      # Dollar delta
    gamma: float      # Dollar gamma  
    theta: float      # Daily P&L from time decay
    vega: float       # Dollar vega
    rho: float        # Dollar rho
    quantity: int     # Number of contracts (negative = short)
    underlying_price: float
    strike: float
    
    @property
    def delta_dollars(self) -> float:
        """Delta exposure in dollars."""
        return self.delta * self.underlying_price
    
    @property
    def is_short(self) -> bool:
        """True if short position."""
        return self.quantity < 0


@dataclass
class AggregatedGreeks:
    """Aggregated Greeks across multiple positions."""
    
    total_delta: float = 0.0
    total_gamma: float = 0.0
    total_theta: float = 0.0
    total_vega: float = 0.0
    total_rho: float = 0.0
    position_count: int = 0
    
    def add_position(self, greeks: PositionGreeks) -> None:
        """Add a position's Greeks to the aggregate."""
        self.total_delta += greeks.delta
        self.total_gamma += greeks.gamma
        self.total_theta += greeks.theta
        self.total_vega += greeks.vega
        self.total_rho += greeks.rho
        self.position_count += 1
    
    @property
    def net_delta(self) -> float:
        """Net delta (same as total_delta, explicit name)."""
        return self.total_delta
    
    @property
    def daily_theta(self) -> float:
        """Expected daily P&L from theta."""
        return self.total_theta / 365


def calculate_time_to_expiry(
    expiration: date,
    as_of: Optional[date] = None,
) -> float:
    """
    Calculate time to expiry in years.
    
    Args:
        expiration: Option expiration date
        as_of: Current date (defaults to today)
    
    Returns:
        Time to expiry in years (365-day basis)
    
    Raises:
        ValueError: If option has expired
    """
    if as_of is None:
        as_of = date.today()
    
    if isinstance(expiration, datetime):
        expiration = expiration.date()
    if isinstance(as_of, datetime):
        as_of = as_of.date()
    
    days_to_expiry = (expiration - as_of).days
    
    if days_to_expiry < 0:
        raise ValueError(f"Option expired {-days_to_expiry} days ago")
    
    # Minimum 1 day to avoid division issues
    days_to_expiry = max(1, days_to_expiry)
    
    return days_to_expiry / 365.0


def calculate_greeks(
    underlying_price: float,
    strike: float,
    time_to_expiry: float,
    volatility: float,
    risk_free_rate: float,
    option_type: OptionType | str,
) -> GreeksResult:
    """
    Calculate all Greeks for a single option.
    
    Uses Black-Scholes analytical formulas via vollib.
    
    Args:
        underlying_price: Current price of underlying
        strike: Option strike price
        time_to_expiry: Time to expiration in years
        volatility: Implied volatility as decimal (0.20 = 20%)
        risk_free_rate: Risk-free rate as decimal (0.05 = 5%)
        option_type: "c" or "p" (or OptionType enum)
    
    Returns:
        GreeksResult with all Greeks
    
    Example:
        >>> greeks = calculate_greeks(
        ...     underlying_price=100,
        ...     strike=100,
        ...     time_to_expiry=30/365,
        ...     volatility=0.20,
        ...     risk_free_rate=0.05,
        ...     option_type="c"
        ... )
        >>> print(f"Delta: {greeks.delta:.3f}")
    """
    # Normalize option type
    if isinstance(option_type, OptionType):
        flag = option_type.value
    else:
        flag = option_type.lower()
        if flag not in ("c", "p"):
            raise ValueError(f"option_type must be 'c' or 'p', got {option_type}")
    
    # Validate inputs
    if underlying_price <= 0:
        raise ValueError(f"underlying_price must be positive, got {underlying_price}")
    if strike <= 0:
        raise ValueError(f"strike must be positive, got {strike}")
    if time_to_expiry <= 0:
        raise ValueError(f"time_to_expiry must be positive, got {time_to_expiry}")
    if volatility <= 0:
        raise ValueError(f"volatility must be positive, got {volatility}")
    
    # Calculate Greeks using vollib
    try:
        delta = bs_delta(flag, underlying_price, strike, time_to_expiry, risk_free_rate, volatility)
        gamma = bs_gamma(flag, underlying_price, strike, time_to_expiry, risk_free_rate, volatility)
        theta = bs_theta(flag, underlying_price, strike, time_to_expiry, risk_free_rate, volatility)
        vega = bs_vega(flag, underlying_price, strike, time_to_expiry, risk_free_rate, volatility)
        rho = bs_rho(flag, underlying_price, strike, time_to_expiry, risk_free_rate, volatility)
    except Exception as e:
        raise ValueError(f"Greeks calculation failed: {e}")
    
    return GreeksResult(
        delta=round(delta, 6),
        gamma=round(gamma, 6),
        theta=round(theta, 6),
        vega=round(vega, 6),
        rho=round(rho, 6),
        underlying_price=underlying_price,
        strike=strike,
        time_to_expiry=time_to_expiry,
        volatility=volatility,
        risk_free_rate=risk_free_rate,
        option_type=OptionType(flag),
    )


def calculate_greeks_for_expiration(
    underlying_price: float,
    expiration: date,
    volatility: float,
    risk_free_rate: float,
    option_type: OptionType | str,
    as_of: Optional[date] = None,
) -> GreeksResult:
    """
    Calculate Greeks using expiration date instead of time_to_expiry.
    
    Convenience wrapper that calculates time to expiry automatically.
    
    Args:
        underlying_price: Current price of underlying
        expiration: Option expiration date
        volatility: Implied volatility as decimal
        risk_free_rate: Risk-free rate as decimal
        option_type: "c" or "p"
        as_of: Current date (defaults to today)
    
    Returns:
        GreeksResult
    """
    time_to_expiry = calculate_time_to_expiry(expiration, as_of)
    
    return calculate_greeks(
        underlying_price=underlying_price,
        strike=underlying_price,  # This seems wrong - should be passed in
        time_to_expiry=time_to_expiry,
        volatility=volatility,
        risk_free_rate=risk_free_rate,
        option_type=option_type,
    )


def calculate_greeks_batch(
    underlying_price: float,
    strikes: Sequence[float],
    time_to_expiry: float,
    volatilities: Sequence[float],
    risk_free_rate: float,
    option_types: Sequence[OptionType | str],
) -> list[GreeksResult]:
    """
    Calculate Greeks for multiple options efficiently.
    
    Uses vectorized computation if available, otherwise loops.
    
    Args:
        underlying_price: Current price (same for all)
        strikes: List of strike prices
        time_to_expiry: Time to expiry in years (same for all)
        volatilities: List of IVs (one per option)
        risk_free_rate: Risk-free rate (same for all)
        option_types: List of option types
    
    Returns:
        List of GreeksResult, one per option
    
    Raises:
        ValueError: If input lengths don't match
    """
    n = len(strikes)
    if len(volatilities) != n or len(option_types) != n:
        raise ValueError(
            f"Length mismatch: strikes={n}, vols={len(volatilities)}, "
            f"types={len(option_types)}"
        )
    
    if n == 0:
        return []
    
    # Normalize option types
    flags = [
        t.value if isinstance(t, OptionType) else t.lower()
        for t in option_types
    ]
    
    results = []
    
    if VECTORIZED_AVAILABLE and n > 10:
        # Use vectorized computation for larger batches
        try:
            strikes_arr = np.array(strikes, dtype=np.float64)
            vols_arr = np.array(volatilities, dtype=np.float64)
            flags_arr = np.array(flags)
            
            # Vectorized Greeks
            deltas = vec_delta(
                flags_arr, underlying_price, strikes_arr,
                time_to_expiry, risk_free_rate, vols_arr
            )
            gammas = vec_gamma(
                flags_arr, underlying_price, strikes_arr,
                time_to_expiry, risk_free_rate, vols_arr
            )
            thetas = vec_theta(
                flags_arr, underlying_price, strikes_arr,
                time_to_expiry, risk_free_rate, vols_arr
            )
            vegas = vec_vega(
                flags_arr, underlying_price, strikes_arr,
                time_to_expiry, risk_free_rate, vols_arr
            )
            rhos = vec_rho(
                flags_arr, underlying_price, strikes_arr,
                time_to_expiry, risk_free_rate, vols_arr
            )
            
            for i in range(n):
                results.append(GreeksResult(
                    delta=round(float(deltas[i]), 6),
                    gamma=round(float(gammas[i]), 6),
                    theta=round(float(thetas[i]), 6),
                    vega=round(float(vegas[i]), 6),
                    rho=round(float(rhos[i]), 6),
                    underlying_price=underlying_price,
                    strike=strikes[i],
                    time_to_expiry=time_to_expiry,
                    volatility=volatilities[i],
                    risk_free_rate=risk_free_rate,
                    option_type=OptionType(flags[i]),
                ))
            
            return results
            
        except Exception:
            # Fall back to loop on vectorized failure
            pass
    
    # Loop-based calculation
    for i in range(n):
        try:
            result = calculate_greeks(
                underlying_price=underlying_price,
                strike=strikes[i],
                time_to_expiry=time_to_expiry,
                volatility=volatilities[i],
                risk_free_rate=risk_free_rate,
                option_type=flags[i],
            )
            results.append(result)
        except ValueError:
            # Skip invalid options (e.g., zero IV)
            continue
    
    return results


def aggregate_position_greeks(
    positions: Sequence[PositionGreeks],
) -> AggregatedGreeks:
    """
    Aggregate Greeks across multiple positions.
    
    Args:
        positions: List of PositionGreeks
    
    Returns:
        AggregatedGreeks with totals
    """
    agg = AggregatedGreeks()
    
    for pos in positions:
        agg.add_position(pos)
    
    return agg


def calculate_delta_neutral_hedge(
    current_delta: float,
    underlying_price: float,
) -> dict[str, float]:
    """
    Calculate shares needed to delta-hedge a position.
    
    Args:
        current_delta: Current portfolio delta
        underlying_price: Current underlying price
    
    Returns:
        Dict with hedge recommendation
    """
    shares_to_trade = -current_delta  # Negative to offset
    
    return {
        "shares_to_trade": round(shares_to_trade, 0),
        "action": "sell" if shares_to_trade > 0 else "buy",
        "notional_value": abs(shares_to_trade * underlying_price),
        "resulting_delta": 0.0,
    }


# Common risk-free rate (can be updated)
DEFAULT_RISK_FREE_RATE = 0.05  # 5%
```

### File: `theta/analytics/__init__.py` (update)

Add to the existing exports:

```python
from theta.analytics.greeks import (
    calculate_greeks,
    calculate_greeks_for_expiration,
    calculate_greeks_batch,
    aggregate_position_greeks,
    calculate_time_to_expiry,
    calculate_delta_neutral_hedge,
    GreeksResult,
    PositionGreeks,
    AggregatedGreeks,
    OptionType,
    DEFAULT_RISK_FREE_RATE,
)

__all__ = [
    # ... existing exports ...
    # Greeks
    "calculate_greeks",
    "calculate_greeks_for_expiration",
    "calculate_greeks_batch",
    "aggregate_position_greeks",
    "calculate_time_to_expiry",
    "calculate_delta_neutral_hedge",
    "GreeksResult",
    "PositionGreeks",
    "AggregatedGreeks",
    "OptionType",
    "DEFAULT_RISK_FREE_RATE",
]
```

## Tests

### File: `tests/analytics/test_greeks.py`

```python
"""Tests for Greeks calculation module."""

import numpy as np
import pytest
from datetime import date, timedelta

from theta.analytics.greeks import (
    calculate_greeks,
    calculate_greeks_batch,
    calculate_time_to_expiry,
    aggregate_position_greeks,
    calculate_delta_neutral_hedge,
    GreeksResult,
    PositionGreeks,
    AggregatedGreeks,
    OptionType,
)


class TestCalculateTimeToExpiry:
    """Tests for time to expiry calculation."""
    
    def test_future_expiration(self):
        """Test with future expiration date."""
        today = date.today()
        expiry = today + timedelta(days=30)
        
        tte = calculate_time_to_expiry(expiry, today)
        
        assert tte == pytest.approx(30 / 365, rel=0.01)
        
    def test_same_day_expiration(self):
        """Test expiring today (minimum 1 day)."""
        today = date.today()
        
        tte = calculate_time_to_expiry(today, today)
        
        # Minimum 1 day
        assert tte == pytest.approx(1 / 365, rel=0.01)
        
    def test_expired_raises(self):
        """Test that expired option raises error."""
        today = date.today()
        expiry = today - timedelta(days=5)
        
        with pytest.raises(ValueError, match="expired"):
            calculate_time_to_expiry(expiry, today)


class TestCalculateGreeks:
    """Tests for single option Greeks calculation."""
    
    def test_atm_call_delta(self):
        """Test ATM call has delta near 0.5."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        # ATM call delta should be around 0.5-0.55
        assert 0.45 < greeks.delta < 0.60
        
    def test_atm_put_delta(self):
        """Test ATM put has delta near -0.5."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="p"
        )
        
        # ATM put delta should be around -0.5 to -0.45
        assert -0.55 < greeks.delta < -0.40
        
    def test_deep_itm_call_delta(self):
        """Test deep ITM call has delta near 1."""
        greeks = calculate_greeks(
            underlying_price=120,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        assert greeks.delta > 0.90
        
    def test_deep_otm_call_delta(self):
        """Test deep OTM call has delta near 0."""
        greeks = calculate_greeks(
            underlying_price=80,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        assert greeks.delta < 0.10
        
    def test_gamma_positive(self):
        """Test gamma is always positive."""
        for opt_type in ["c", "p"]:
            greeks = calculate_greeks(
                underlying_price=100,
                strike=100,
                time_to_expiry=30/365,
                volatility=0.20,
                risk_free_rate=0.05,
                option_type=opt_type
            )
            assert greeks.gamma > 0
            
    def test_theta_negative_for_long(self):
        """Test theta is negative (time decay hurts long positions)."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        assert greeks.theta < 0
        
    def test_vega_positive(self):
        """Test vega is positive (higher vol = higher price)."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        assert greeks.vega > 0
        
    def test_call_rho_positive(self):
        """Test call rho is positive."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        assert greeks.rho > 0
        
    def test_put_rho_negative(self):
        """Test put rho is negative."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="p"
        )
        
        assert greeks.rho < 0
        
    def test_option_type_enum(self):
        """Test that OptionType enum works."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type=OptionType.CALL
        )
        
        assert greeks.option_type == OptionType.CALL
        
    def test_invalid_inputs_raise(self):
        """Test that invalid inputs raise errors."""
        with pytest.raises(ValueError):
            calculate_greeks(
                underlying_price=-100,  # Invalid
                strike=100,
                time_to_expiry=30/365,
                volatility=0.20,
                risk_free_rate=0.05,
                option_type="c"
            )


class TestGreeksResult:
    """Tests for GreeksResult methods."""
    
    def test_for_position_long(self):
        """Test position Greeks for long position."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        # Long 10 contracts
        pos = greeks.for_position(10)
        
        assert pos.quantity == 10
        assert pos.delta == pytest.approx(greeks.delta * 1000, rel=0.01)  # 10 * 100
        assert pos.theta == pytest.approx(greeks.theta * 1000, rel=0.01)
        assert pos.is_short is False
        
    def test_for_position_short(self):
        """Test position Greeks for short position."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="p"
        )
        
        # Short 5 contracts
        pos = greeks.for_position(-5)
        
        assert pos.quantity == -5
        assert pos.is_short is True
        # Short put = positive delta (negating the negative delta)
        assert pos.delta == pytest.approx(greeks.delta * -500, rel=0.01)
        
    def test_theta_per_day(self):
        """Test theta_per_day property."""
        greeks = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        assert greeks.theta_per_day == pytest.approx(greeks.theta / 365, rel=0.01)


class TestCalculateGreeksBatch:
    """Tests for batch Greeks calculation."""
    
    def test_batch_calculation(self):
        """Test batch calculation returns correct count."""
        strikes = [95, 100, 105]
        vols = [0.22, 0.20, 0.21]
        types = ["p", "c", "c"]
        
        results = calculate_greeks_batch(
            underlying_price=100,
            strikes=strikes,
            time_to_expiry=30/365,
            volatilities=vols,
            risk_free_rate=0.05,
            option_types=types,
        )
        
        assert len(results) == 3
        assert all(isinstance(r, GreeksResult) for r in results)
        
    def test_batch_matches_single(self):
        """Test batch results match single calculations."""
        single = calculate_greeks(
            underlying_price=100,
            strike=100,
            time_to_expiry=30/365,
            volatility=0.20,
            risk_free_rate=0.05,
            option_type="c"
        )
        
        batch = calculate_greeks_batch(
            underlying_price=100,
            strikes=[100],
            time_to_expiry=30/365,
            volatilities=[0.20],
            risk_free_rate=0.05,
            option_types=["c"],
        )
        
        assert batch[0].delta == pytest.approx(single.delta, rel=0.001)
        assert batch[0].gamma == pytest.approx(single.gamma, rel=0.001)
        
    def test_empty_batch(self):
        """Test empty batch returns empty list."""
        results = calculate_greeks_batch(
            underlying_price=100,
            strikes=[],
            time_to_expiry=30/365,
            volatilities=[],
            risk_free_rate=0.05,
            option_types=[],
        )
        
        assert results == []
        
    def test_length_mismatch_raises(self):
        """Test mismatched lengths raise error."""
        with pytest.raises(ValueError, match="mismatch"):
            calculate_greeks_batch(
                underlying_price=100,
                strikes=[95, 100, 105],
                time_to_expiry=30/365,
                volatilities=[0.20, 0.21],  # Wrong length
                risk_free_rate=0.05,
                option_types=["c", "c", "c"],
            )


class TestAggregateGreeks:
    """Tests for Greek aggregation."""
    
    def test_aggregate_positions(self):
        """Test aggregating multiple positions."""
        # Long call
        call_greeks = calculate_greeks(
            underlying_price=100, strike=105, time_to_expiry=30/365,
            volatility=0.20, risk_free_rate=0.05, option_type="c"
        )
        call_pos = call_greeks.for_position(10)
        
        # Short put
        put_greeks = calculate_greeks(
            underlying_price=100, strike=95, time_to_expiry=30/365,
            volatility=0.22, risk_free_rate=0.05, option_type="p"
        )
        put_pos = put_greeks.for_position(-10)
        
        agg = aggregate_position_greeks([call_pos, put_pos])
        
        assert agg.position_count == 2
        assert agg.total_delta == pytest.approx(
            call_pos.delta + put_pos.delta, rel=0.01
        )
        
    def test_empty_aggregation(self):
        """Test aggregating no positions."""
        agg = aggregate_position_greeks([])
        
        assert agg.position_count == 0
        assert agg.total_delta == 0


class TestDeltaNeutralHedge:
    """Tests for delta hedging calculation."""
    
    def test_positive_delta_hedge(self):
        """Test hedge recommendation for positive delta."""
        result = calculate_delta_neutral_hedge(
            current_delta=50,  # Long 50 delta
            underlying_price=100
        )
        
        assert result["shares_to_trade"] == -50  # Sell shares
        assert result["action"] == "sell"
        assert result["notional_value"] == 5000
        
    def test_negative_delta_hedge(self):
        """Test hedge recommendation for negative delta."""
        result = calculate_delta_neutral_hedge(
            current_delta=-30,  # Short 30 delta
            underlying_price=100
        )
        
        assert result["shares_to_trade"] == 30  # Buy shares
        assert result["action"] == "buy"
        assert result["notional_value"] == 3000
```

## Acceptance Criteria

1. `calculate_greeks` returns accurate Delta, Gamma, Theta, Vega, Rho
2. ATM call delta ~0.5, ATM put delta ~-0.5
3. Gamma always positive, Theta negative for long positions
4. `calculate_greeks_batch` handles multiple options efficiently
5. `GreeksResult.for_position()` scales by quantity × 100
6. Aggregation sums Greeks correctly across positions
7. All tests pass: `poetry run pytest tests/analytics/test_greeks.py -v`

## Output Files

- `theta/analytics/greeks.py`
- `theta/analytics/__init__.py` (updated)
- `tests/analytics/test_greeks.py`

## Next Prompt

Prompt 08: Rules Engine - implements entry signal logic with configurable thresholds for IV percentile, DTE, delta, liquidity, and earnings.
