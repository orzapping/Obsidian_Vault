# Prompt 04: IV Calculator

## Context

We're building **Project Theta**, a systematic options trading dashboard. This prompt creates the implied volatility calculation module using the `vollib` library, which implements Newton-Raphson with bisection fallback.

## Prerequisites

- Prompts 01-02 completed (project setup, data models)
- `vollib` installed via Poetry

## Task

Create an IV calculator that:
1. Wraps `vollib` for IV extraction
2. Handles edge cases (deep ITM/OTM, near expiration)
3. Provides batch IV calculation
4. Calculates IV for full options chains

## Reference Files

Before starting, examine:
- `refs/iv-greeks-dashboard/backend/app/services/implied_vol.py` - IV extraction patterns
- `refs/vollib/vollib/black_scholes/implied_volatility.py` - Underlying implementation

## Background: How vollib Works

`vollib` uses Peter Jäckel's "Let's Be Rational" algorithm:
- Primary: Newton-Raphson (fast, O(n) convergence)
- Fallback: Bisection (robust, handles edge cases)
- Accuracy: Machine precision

The key function:
```python
from vollib.black_scholes.implied_volatility import implied_volatility

iv = implied_volatility(
    price,      # Option price
    S,          # Underlying price  
    K,          # Strike
    t,          # Time to expiration (years)
    r,          # Risk-free rate
    flag        # 'c' for call, 'p' for put
)
```

## Specifications

### theta/analytics/iv_calculator.py

```python
"""
Implied volatility calculation using vollib.

This module wraps vollib's implied_volatility function with:
- Proper error handling for edge cases
- Batch calculation for efficiency
- Chain-level IV extraction
- ATM IV estimation

vollib uses the "Let's Be Rational" algorithm by Peter Jäckel,
which combines Newton-Raphson with bisection fallback for
machine-precision accuracy.
"""
import logging
from datetime import date
from typing import Optional

import numpy as np
from vollib.black_scholes.implied_volatility import implied_volatility as vollib_iv
from vollib.helper.exceptions import PriceIsAboveMaximum, PriceIsBelowIntrinsic

from theta.data.models import OptionContract, OptionsChain, OptionType
from theta.config import get_settings

logger = logging.getLogger(__name__)


# Constants
TRADING_DAYS_PER_YEAR = 252
CALENDAR_DAYS_PER_YEAR = 365
MIN_TIME_TO_EXPIRY = 1 / CALENDAR_DAYS_PER_YEAR  # 1 day minimum
MAX_IV = 5.0  # 500% IV cap
MIN_IV = 0.01  # 1% IV floor


class IVCalculationError(Exception):
    """Raised when IV calculation fails."""
    pass


def calculate_iv(
    price: float,
    spot: float,
    strike: float,
    days_to_expiry: int,
    risk_free_rate: float,
    option_type: OptionType,
) -> Optional[float]:
    """
    Calculate implied volatility for a single option.
    
    Uses vollib's Black-Scholes IV extraction with Newton-Raphson
    and bisection fallback.
    
    Args:
        price: Option price (mid or last)
        spot: Underlying price
        strike: Strike price
        days_to_expiry: Days to expiration
        risk_free_rate: Annual risk-free rate (e.g., 0.05 for 5%)
        option_type: Call or put
        
    Returns:
        Implied volatility as decimal (e.g., 0.25 for 25%), or None if calculation fails
        
    Example:
        >>> iv = calculate_iv(5.50, 100.0, 105.0, 30, 0.05, OptionType.CALL)
        >>> print(f"IV: {iv:.2%}")
        IV: 22.50%
    """
    # Validate inputs
    if price <= 0:
        logger.debug(f"Price must be positive: {price}")
        return None
    
    if spot <= 0 or strike <= 0:
        logger.debug(f"Spot and strike must be positive: spot={spot}, strike={strike}")
        return None
    
    if days_to_expiry <= 0:
        logger.debug(f"Days to expiry must be positive: {days_to_expiry}")
        return None
    
    # Convert days to years
    time_to_expiry = max(days_to_expiry / CALENDAR_DAYS_PER_YEAR, MIN_TIME_TO_EXPIRY)
    
    # Convert option type to vollib flag
    flag = "c" if option_type == OptionType.CALL else "p"
    
    try:
        iv = vollib_iv(
            price=price,
            S=spot,
            K=strike,
            t=time_to_expiry,
            r=risk_free_rate,
            flag=flag,
        )
        
        # Sanity check the result
        if iv < MIN_IV or iv > MAX_IV:
            logger.debug(f"IV outside bounds: {iv:.4f}")
            return None
        
        return float(iv)
        
    except PriceIsBelowIntrinsic:
        # Option price is below intrinsic value (arbitrage)
        logger.debug(
            f"Price below intrinsic: price={price}, spot={spot}, "
            f"strike={strike}, type={option_type}"
        )
        return None
        
    except PriceIsAboveMaximum:
        # Option price too high for any reasonable IV
        logger.debug(f"Price above maximum: price={price}")
        return None
        
    except Exception as e:
        logger.warning(f"IV calculation failed: {e}")
        return None


def calculate_iv_for_contract(
    contract: OptionContract,
    spot: float,
    risk_free_rate: float = 0.05,
) -> Optional[float]:
    """
    Calculate IV for an OptionContract.
    
    Uses the mid price for IV calculation.
    
    Args:
        contract: Option contract with bid/ask prices
        spot: Current underlying price
        risk_free_rate: Annual risk-free rate
        
    Returns:
        Implied volatility as decimal, or None if calculation fails
    """
    # Use mid price for IV calculation
    price = contract.mid
    
    if price <= 0:
        return None
    
    return calculate_iv(
        price=price,
        spot=spot,
        strike=contract.strike,
        days_to_expiry=contract.days_to_expiration,
        risk_free_rate=risk_free_rate,
        option_type=contract.option_type,
    )


def calculate_iv_batch(
    contracts: list[OptionContract],
    spot: float,
    risk_free_rate: float = 0.05,
) -> list[Optional[float]]:
    """
    Calculate IV for multiple contracts.
    
    Args:
        contracts: List of option contracts
        spot: Current underlying price
        risk_free_rate: Annual risk-free rate
        
    Returns:
        List of IV values (None for failed calculations)
    """
    return [
        calculate_iv_for_contract(contract, spot, risk_free_rate)
        for contract in contracts
    ]


def update_chain_with_iv(
    chain: OptionsChain,
    risk_free_rate: float = 0.05,
) -> OptionsChain:
    """
    Update all contracts in a chain with calculated IV.
    
    Creates a new chain with IV populated on all contracts
    where calculation succeeds.
    
    Args:
        chain: Options chain to update
        risk_free_rate: Annual risk-free rate
        
    Returns:
        New OptionsChain with IV values populated
    """
    updated_contracts = []
    
    for contract in chain.contracts:
        iv = calculate_iv_for_contract(contract, chain.underlying_price, risk_free_rate)
        
        # Create new contract with IV (Pydantic models are immutable)
        contract_dict = contract.model_dump()
        contract_dict["implied_volatility"] = iv
        updated_contracts.append(OptionContract(**contract_dict))
    
    return OptionsChain(
        symbol=chain.symbol,
        underlying_price=chain.underlying_price,
        contracts=updated_contracts,
        timestamp=chain.timestamp,
    )


def calculate_atm_iv(
    chain: OptionsChain,
    risk_free_rate: float = 0.05,
    expiration: Optional[date] = None,
) -> Optional[float]:
    """
    Calculate at-the-money implied volatility.
    
    ATM IV is commonly used as the "IV" for a symbol. We find
    the strikes closest to the underlying price and average
    the call and put IVs.
    
    Args:
        chain: Options chain
        risk_free_rate: Annual risk-free rate
        expiration: Specific expiration to use (default: nearest)
        
    Returns:
        ATM IV as decimal, or None if calculation fails
    """
    # Filter to specific expiration if provided
    if expiration:
        contracts = chain.get_expiration(expiration)
    else:
        # Use nearest expiration
        expirations = chain.get_expirations()
        if not expirations:
            return None
        contracts = chain.get_expiration(expirations[0])
    
    if not contracts:
        return None
    
    spot = chain.underlying_price
    
    # Find strikes closest to spot
    strikes = sorted(set(c.strike for c in contracts))
    if not strikes:
        return None
    
    # Find the two strikes bracketing the spot price
    below = [s for s in strikes if s <= spot]
    above = [s for s in strikes if s > spot]
    
    atm_strikes = []
    if below:
        atm_strikes.append(max(below))
    if above:
        atm_strikes.append(min(above))
    
    if not atm_strikes:
        return None
    
    # Calculate IV for ATM options
    ivs = []
    for strike in atm_strikes:
        for contract in contracts:
            if contract.strike == strike:
                iv = calculate_iv_for_contract(contract, spot, risk_free_rate)
                if iv is not None:
                    ivs.append(iv)
    
    if not ivs:
        return None
    
    # Return average of ATM IVs
    return sum(ivs) / len(ivs)


def calculate_iv_by_strike(
    chain: OptionsChain,
    expiration: date,
    option_type: OptionType,
    risk_free_rate: float = 0.05,
) -> dict[float, Optional[float]]:
    """
    Calculate IV for each strike at a given expiration.
    
    Useful for volatility smile/skew analysis.
    
    Args:
        chain: Options chain
        expiration: Expiration date
        option_type: Call or put
        risk_free_rate: Annual risk-free rate
        
    Returns:
        Dictionary mapping strike to IV
    """
    contracts = [
        c for c in chain.get_expiration(expiration)
        if c.option_type == option_type
    ]
    
    result = {}
    for contract in contracts:
        iv = calculate_iv_for_contract(contract, chain.underlying_price, risk_free_rate)
        result[contract.strike] = iv
    
    return result


def calculate_iv_term_structure(
    chain: OptionsChain,
    risk_free_rate: float = 0.05,
) -> dict[date, Optional[float]]:
    """
    Calculate ATM IV for each expiration.
    
    Useful for term structure analysis.
    
    Args:
        chain: Options chain
        risk_free_rate: Annual risk-free rate
        
    Returns:
        Dictionary mapping expiration to ATM IV
    """
    result = {}
    
    for expiration in chain.get_expirations():
        iv = calculate_atm_iv(chain, risk_free_rate, expiration)
        result[expiration] = iv
    
    return result
```

### tests/test_analytics/test_iv_calculator.py

```python
"""Tests for IV calculator module."""
from datetime import date, timedelta

import pytest

from theta.analytics.iv_calculator import (
    calculate_iv,
    calculate_iv_for_contract,
    calculate_atm_iv,
    update_chain_with_iv,
    MIN_IV,
    MAX_IV,
)
from theta.data.models import OptionContract, OptionsChain, OptionType


class TestCalculateIV:
    """Tests for single IV calculation."""
    
    def test_atm_call(self):
        """Test IV calculation for ATM call."""
        # Using realistic values: SPY at $450, 30 DTE, ATM call at ~$10
        iv = calculate_iv(
            price=10.0,
            spot=450.0,
            strike=450.0,
            days_to_expiry=30,
            risk_free_rate=0.05,
            option_type=OptionType.CALL,
        )
        
        assert iv is not None
        assert MIN_IV <= iv <= MAX_IV
        # ATM call with this price should have ~18-22% IV
        assert 0.15 <= iv <= 0.30
    
    def test_atm_put(self):
        """Test IV calculation for ATM put."""
        iv = calculate_iv(
            price=9.5,
            spot=450.0,
            strike=450.0,
            days_to_expiry=30,
            risk_free_rate=0.05,
            option_type=OptionType.PUT,
        )
        
        assert iv is not None
        assert MIN_IV <= iv <= MAX_IV
    
    def test_otm_put(self):
        """Test IV calculation for OTM put (typical premium selling target)."""
        # OTM put, ~5% out of the money
        iv = calculate_iv(
            price=3.0,
            spot=450.0,
            strike=427.5,  # 5% OTM
            days_to_expiry=30,
            risk_free_rate=0.05,
            option_type=OptionType.PUT,
        )
        
        assert iv is not None
        assert MIN_IV <= iv <= MAX_IV
    
    def test_zero_price_returns_none(self):
        """Test that zero price returns None."""
        iv = calculate_iv(
            price=0.0,
            spot=450.0,
            strike=450.0,
            days_to_expiry=30,
            risk_free_rate=0.05,
            option_type=OptionType.CALL,
        )
        
        assert iv is None
    
    def test_negative_dte_returns_none(self):
        """Test that negative DTE returns None."""
        iv = calculate_iv(
            price=10.0,
            spot=450.0,
            strike=450.0,
            days_to_expiry=-1,
            risk_free_rate=0.05,
            option_type=OptionType.CALL,
        )
        
        assert iv is None
    
    def test_deep_itm_option(self):
        """Test deep ITM option IV calculation."""
        # Deep ITM call - mostly intrinsic value
        iv = calculate_iv(
            price=55.0,  # Strike 400, spot 450 = $50 intrinsic + $5 time value
            spot=450.0,
            strike=400.0,
            days_to_expiry=30,
            risk_free_rate=0.05,
            option_type=OptionType.CALL,
        )
        
        # Should still calculate, though may be less reliable
        assert iv is None or (MIN_IV <= iv <= MAX_IV)


class TestCalculateIVForContract:
    """Tests for contract-based IV calculation."""
    
    @pytest.fixture
    def sample_contract(self) -> OptionContract:
        """Create a sample option contract."""
        return OptionContract(
            symbol="SPY",
            strike=450.0,
            expiration=date.today() + timedelta(days=30),
            option_type=OptionType.CALL,
            bid=9.80,
            ask=10.20,  # Mid = 10.00
            volume=5000,
            open_interest=25000,
        )
    
    def test_contract_iv(self, sample_contract):
        """Test IV calculation from contract."""
        iv = calculate_iv_for_contract(
            contract=sample_contract,
            spot=450.0,
            risk_free_rate=0.05,
        )
        
        assert iv is not None
        assert MIN_IV <= iv <= MAX_IV


class TestCalculateATMIV:
    """Tests for ATM IV calculation."""
    
    @pytest.fixture
    def sample_chain(self) -> OptionsChain:
        """Create a sample options chain."""
        exp = date.today() + timedelta(days=30)
        spot = 450.0
        
        contracts = [
            # ATM options
            OptionContract(
                symbol="SPY",
                strike=450.0,
                expiration=exp,
                option_type=OptionType.CALL,
                bid=9.80, ask=10.20,
            ),
            OptionContract(
                symbol="SPY",
                strike=450.0,
                expiration=exp,
                option_type=OptionType.PUT,
                bid=9.50, ask=9.90,
            ),
            # OTM options
            OptionContract(
                symbol="SPY",
                strike=460.0,
                expiration=exp,
                option_type=OptionType.CALL,
                bid=5.50, ask=5.80,
            ),
            OptionContract(
                symbol="SPY",
                strike=440.0,
                expiration=exp,
                option_type=OptionType.PUT,
                bid=5.20, ask=5.50,
            ),
        ]
        
        return OptionsChain(
            symbol="SPY",
            underlying_price=spot,
            contracts=contracts,
        )
    
    def test_atm_iv_calculation(self, sample_chain):
        """Test ATM IV is calculated correctly."""
        atm_iv = calculate_atm_iv(sample_chain)
        
        assert atm_iv is not None
        assert 0.10 <= atm_iv <= 0.50  # Reasonable range


class TestUpdateChainWithIV:
    """Tests for chain IV update."""
    
    def test_chain_update(self):
        """Test that chain is updated with IV values."""
        exp = date.today() + timedelta(days=30)
        
        chain = OptionsChain(
            symbol="SPY",
            underlying_price=450.0,
            contracts=[
                OptionContract(
                    symbol="SPY",
                    strike=450.0,
                    expiration=exp,
                    option_type=OptionType.CALL,
                    bid=9.80, ask=10.20,
                ),
            ],
        )
        
        # Initially no IV
        assert chain.contracts[0].implied_volatility is None
        
        # Update chain
        updated = update_chain_with_iv(chain)
        
        # Now has IV
        assert updated.contracts[0].implied_volatility is not None
        assert 0.10 <= updated.contracts[0].implied_volatility <= 0.50
```

## Acceptance Criteria

1. ✅ IV calculation works for calls and puts
2. ✅ Edge cases handled gracefully (returns None, doesn't crash)
3. ✅ Batch calculation works efficiently
4. ✅ ATM IV calculation identifies correct strikes
5. ✅ Chain update populates IV on all contracts
6. ✅ `poetry run pytest tests/test_analytics/test_iv_calculator.py` passes

## Output Files

- `theta/analytics/__init__.py` (update if needed)
- `theta/analytics/iv_calculator.py`
- `tests/test_analytics/__init__.py`
- `tests/test_analytics/test_iv_calculator.py`

## Key Concepts

### Why vollib?

vollib implements Peter Jäckel's "Let's Be Rational" algorithm, which:
1. Uses Newton-Raphson for fast convergence
2. Falls back to bisection for edge cases
3. Achieves machine precision
4. Handles numerical instabilities gracefully

### ATM IV

ATM (at-the-money) IV is the most commonly quoted IV for an underlying. It's calculated by:
1. Finding strikes closest to the current spot price
2. Calculating IV for both call and put at those strikes
3. Averaging the results

This gives a single "IV" number for the symbol that can be tracked over time.

## Next Prompt

Proceed to `05_percentile.md` to create the IV percentile and rank calculation module.
