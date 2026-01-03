# Prompt 02: Data Models

## Context

We're building **Project Theta**, a systematic options trading dashboard. This prompt creates the Pydantic models that define our data structures for options chains, contracts, Greeks, and quotes.

## Prerequisites

- Prompt 01 completed (project setup)
- Reference repos cloned

## Task

Create comprehensive Pydantic v2 models for:
1. Option contracts with Greeks
2. Options chains
3. Quotes (underlying prices)
4. VIX term structure
5. IV metrics
6. Signal results

## Reference Files

Before starting, examine:
- `refs/iv-greeks-dashboard/backend/app/models/` - Pydantic model patterns
- `refs/optionstratlib/src/model/` - Domain model design (Rust, but concepts apply)

## Specifications

### theta/data/models.py

```python
"""
Pydantic models for options data.

All models use Pydantic v2 with strict validation.
Financial values use float for simplicity (not Decimal) since
we're not doing accounting-level precision.
"""
from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator


class OptionType(str, Enum):
    """Option type: call or put."""
    CALL = "call"
    PUT = "put"


class OptionStyle(str, Enum):
    """Option style: American or European."""
    AMERICAN = "american"
    EUROPEAN = "european"


class Greeks(BaseModel):
    """Option Greeks for risk analysis."""
    delta: float = Field(..., ge=-1.0, le=1.0, description="Price sensitivity to underlying")
    gamma: float = Field(..., ge=0.0, description="Rate of change of delta")
    theta: float = Field(..., description="Time decay (typically negative)")
    vega: float = Field(..., ge=0.0, description="Sensitivity to volatility")
    rho: float = Field(default=0.0, description="Sensitivity to interest rate")
    
    # Second-order Greeks (optional)
    vanna: Optional[float] = Field(default=None, description="d(delta)/d(vol)")
    vomma: Optional[float] = Field(default=None, description="d(vega)/d(vol)")
    charm: Optional[float] = Field(default=None, description="d(delta)/d(time)")
    
    class Config:
        frozen = True


class OptionContract(BaseModel):
    """
    Single option contract with market data and Greeks.
    
    Represents one tradeable option with its current market state.
    """
    # Identification
    symbol: str = Field(..., description="Underlying symbol")
    strike: float = Field(..., gt=0, description="Strike price")
    expiration: date = Field(..., description="Expiration date")
    option_type: OptionType = Field(..., description="Call or put")
    
    # Market data
    bid: float = Field(..., ge=0, description="Bid price")
    ask: float = Field(..., ge=0, description="Ask price")
    last: Optional[float] = Field(default=None, ge=0, description="Last trade price")
    volume: int = Field(default=0, ge=0, description="Daily volume")
    open_interest: int = Field(default=0, ge=0, description="Open interest")
    
    # Calculated values
    mid: float = Field(default=0.0, description="Mid price (calculated)")
    implied_volatility: Optional[float] = Field(
        default=None, 
        ge=0, 
        le=5.0,  # 500% IV cap for sanity
        description="Implied volatility (decimal, e.g., 0.25 = 25%)"
    )
    
    # Greeks
    greeks: Optional[Greeks] = Field(default=None, description="Option Greeks")
    
    # Metadata
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    @field_validator("expiration")
    @classmethod
    def expiration_must_be_future(cls, v: date) -> date:
        """Expiration must be in the future."""
        if v < date.today():
            raise ValueError("Expiration date must be in the future")
        return v
    
    @model_validator(mode="after")
    def calculate_mid(self) -> "OptionContract":
        """Calculate mid price from bid/ask."""
        object.__setattr__(self, "mid", (self.bid + self.ask) / 2)
        return self
    
    @property
    def days_to_expiration(self) -> int:
        """Calculate days to expiration."""
        return (self.expiration - date.today()).days
    
    @property
    def spread(self) -> float:
        """Bid-ask spread in dollars."""
        return self.ask - self.bid
    
    @property
    def spread_percent(self) -> float:
        """Bid-ask spread as percentage of mid."""
        if self.mid <= 0:
            return float("inf")
        return (self.spread / self.mid) * 100
    
    @property
    def is_liquid(self) -> bool:
        """Check if contract has reasonable liquidity."""
        return self.open_interest >= 100 and self.spread_percent < 10
    
    class Config:
        frozen = True


class Quote(BaseModel):
    """Quote for underlying asset."""
    symbol: str
    bid: float = Field(..., ge=0)
    ask: float = Field(..., ge=0)
    last: float = Field(..., ge=0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def mid(self) -> float:
        """Mid price."""
        return (self.bid + self.ask) / 2
    
    class Config:
        frozen = True


class OptionsChain(BaseModel):
    """
    Complete options chain for an underlying.
    
    Contains all available contracts across strikes and expirations.
    """
    symbol: str = Field(..., description="Underlying symbol")
    underlying_price: float = Field(..., gt=0, description="Current underlying price")
    contracts: list[OptionContract] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    def get_calls(self) -> list[OptionContract]:
        """Get all call options."""
        return [c for c in self.contracts if c.option_type == OptionType.CALL]
    
    def get_puts(self) -> list[OptionContract]:
        """Get all put options."""
        return [c for c in self.contracts if c.option_type == OptionType.PUT]
    
    def get_expiration(self, expiration: date) -> list[OptionContract]:
        """Get all contracts for a specific expiration."""
        return [c for c in self.contracts if c.expiration == expiration]
    
    def get_expirations(self) -> list[date]:
        """Get unique expiration dates, sorted."""
        return sorted(set(c.expiration for c in self.contracts))
    
    def get_strikes(self, expiration: Optional[date] = None) -> list[float]:
        """Get unique strikes, optionally filtered by expiration."""
        contracts = self.get_expiration(expiration) if expiration else self.contracts
        return sorted(set(c.strike for c in contracts))
    
    def filter_by_dte(self, min_dte: int, max_dte: int) -> "OptionsChain":
        """Filter contracts by days to expiration range."""
        filtered = [
            c for c in self.contracts 
            if min_dte <= c.days_to_expiration <= max_dte
        ]
        return OptionsChain(
            symbol=self.symbol,
            underlying_price=self.underlying_price,
            contracts=filtered,
            timestamp=self.timestamp,
        )
    
    def filter_by_delta(self, max_delta: float) -> "OptionsChain":
        """Filter contracts by maximum absolute delta."""
        filtered = [
            c for c in self.contracts 
            if c.greeks and abs(c.greeks.delta) <= max_delta
        ]
        return OptionsChain(
            symbol=self.symbol,
            underlying_price=self.underlying_price,
            contracts=filtered,
            timestamp=self.timestamp,
        )
    
    class Config:
        frozen = True


class VIXFuture(BaseModel):
    """Single VIX futures contract."""
    expiration: date
    price: float = Field(..., gt=0)
    
    class Config:
        frozen = True


class VIXTermStructure(BaseModel):
    """
    VIX term structure for contango/backwardation analysis.
    
    Contango (normal): futures > spot (calm markets)
    Backwardation: futures < spot (stressed markets)
    """
    spot_vix: float = Field(..., gt=0, description="Current VIX spot")
    futures: list[VIXFuture] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def is_backwardation(self) -> bool:
        """Check if VIX is in backwardation (first future < spot)."""
        if not self.futures:
            return False
        front_future = min(self.futures, key=lambda f: f.expiration)
        return front_future.price < self.spot_vix
    
    @property
    def contango_ratio(self) -> float:
        """
        Ratio of front month future to spot.
        
        > 1.0 = contango (normal)
        < 1.0 = backwardation (caution)
        """
        if not self.futures:
            return 1.0
        front_future = min(self.futures, key=lambda f: f.expiration)
        return front_future.price / self.spot_vix
    
    class Config:
        frozen = True


class IVMetrics(BaseModel):
    """
    Implied volatility metrics for a symbol.
    
    Used for signal generation and opportunity scoring.
    """
    symbol: str
    current_iv: float = Field(..., ge=0, description="Current IV (ATM, decimal)")
    iv_percentile: float = Field(..., ge=0, le=100, description="IV percentile (0-100)")
    iv_rank: float = Field(..., ge=0, le=100, description="IV rank (0-100)")
    iv_high_52w: float = Field(..., ge=0, description="52-week IV high")
    iv_low_52w: float = Field(..., ge=0, description="52-week IV low")
    realized_vol: float = Field(..., ge=0, description="Realised volatility (decimal)")
    iv_rv_ratio: float = Field(..., ge=0, description="IV to RV ratio")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def is_elevated(self) -> bool:
        """Check if IV is elevated (above 50th percentile)."""
        return self.iv_percentile >= 50
    
    @property
    def is_premium_rich(self) -> bool:
        """Check if IV significantly exceeds RV (ratio > 1.3)."""
        return self.iv_rv_ratio >= 1.3
    
    class Config:
        frozen = True


class SignalStrength(str, Enum):
    """Signal strength classification."""
    NONE = "none"
    WEAK = "weak"
    MODERATE = "moderate"
    STRONG = "strong"
    VERY_STRONG = "very_strong"


class SignalResult(BaseModel):
    """
    Result of signal evaluation for a symbol.
    
    Used to rank opportunities in the watchlist.
    """
    symbol: str
    score: int = Field(..., ge=0, description="Numeric score (higher = better)")
    strength: SignalStrength = Field(..., description="Signal strength classification")
    iv_metrics: IVMetrics
    
    # Rule pass/fail
    rules_passed: list[str] = Field(default_factory=list)
    rules_failed: list[str] = Field(default_factory=list)
    
    # Key metrics for display
    iv_percentile: float = Field(..., ge=0, le=100)
    iv_rv_ratio: float = Field(..., ge=0)
    arr: Optional[float] = Field(default=None, description="Annualised rate of return %")
    
    # Warnings
    warnings: list[str] = Field(default_factory=list)
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    @classmethod
    def from_score(cls, score: int) -> SignalStrength:
        """Determine signal strength from score."""
        if score <= 0:
            return SignalStrength.NONE
        elif score <= 2:
            return SignalStrength.WEAK
        elif score <= 3:
            return SignalStrength.MODERATE
        elif score <= 5:
            return SignalStrength.STRONG
        else:
            return SignalStrength.VERY_STRONG
    
    class Config:
        frozen = True


class WatchlistEntry(BaseModel):
    """Entry in the ranked watchlist."""
    rank: int = Field(..., ge=1)
    symbol: str
    signal: SignalResult
    
    # Quick-access metrics
    iv_percentile: float
    iv_rv_ratio: float
    score: int
    strength: SignalStrength
    
    class Config:
        frozen = True


class Watchlist(BaseModel):
    """Complete ranked watchlist."""
    entries: list[WatchlistEntry] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    
    def __len__(self) -> int:
        return len(self.entries)
    
    def __iter__(self):
        return iter(self.entries)
    
    class Config:
        frozen = True
```

### tests/test_data/test_models.py

```python
"""Tests for data models."""
from datetime import date, timedelta

import pytest

from theta.data.models import (
    Greeks,
    OptionContract,
    OptionType,
    OptionsChain,
    IVMetrics,
    SignalResult,
    SignalStrength,
    VIXTermStructure,
    VIXFuture,
)


class TestGreeks:
    """Tests for Greeks model."""
    
    def test_valid_greeks(self):
        """Test creating valid Greeks."""
        greeks = Greeks(delta=0.5, gamma=0.05, theta=-0.02, vega=0.15)
        assert greeks.delta == 0.5
        assert greeks.gamma == 0.05
    
    def test_delta_bounds(self):
        """Test delta is bounded -1 to 1."""
        with pytest.raises(ValueError):
            Greeks(delta=1.5, gamma=0.05, theta=-0.02, vega=0.15)
    
    def test_gamma_non_negative(self):
        """Test gamma must be non-negative."""
        with pytest.raises(ValueError):
            Greeks(delta=0.5, gamma=-0.05, theta=-0.02, vega=0.15)


class TestOptionContract:
    """Tests for OptionContract model."""
    
    @pytest.fixture
    def valid_contract(self) -> OptionContract:
        """Create a valid option contract."""
        return OptionContract(
            symbol="SPY",
            strike=450.0,
            expiration=date.today() + timedelta(days=30),
            option_type=OptionType.CALL,
            bid=5.00,
            ask=5.20,
            volume=1000,
            open_interest=5000,
            implied_volatility=0.20,
            greeks=Greeks(delta=0.45, gamma=0.02, theta=-0.05, vega=0.30),
        )
    
    def test_mid_calculation(self, valid_contract):
        """Test mid price is calculated correctly."""
        assert valid_contract.mid == 5.10
    
    def test_spread_calculation(self, valid_contract):
        """Test spread calculation."""
        assert valid_contract.spread == 0.20
    
    def test_spread_percent(self, valid_contract):
        """Test spread percentage calculation."""
        expected = (0.20 / 5.10) * 100
        assert abs(valid_contract.spread_percent - expected) < 0.01
    
    def test_days_to_expiration(self, valid_contract):
        """Test DTE calculation."""
        assert valid_contract.days_to_expiration == 30
    
    def test_is_liquid(self, valid_contract):
        """Test liquidity check."""
        assert valid_contract.is_liquid is True
    
    def test_expired_contract_rejected(self):
        """Test that expired contracts are rejected."""
        with pytest.raises(ValueError):
            OptionContract(
                symbol="SPY",
                strike=450.0,
                expiration=date.today() - timedelta(days=1),
                option_type=OptionType.CALL,
                bid=5.00,
                ask=5.20,
            )


class TestOptionsChain:
    """Tests for OptionsChain model."""
    
    @pytest.fixture
    def chain(self) -> OptionsChain:
        """Create a test options chain."""
        exp1 = date.today() + timedelta(days=30)
        exp2 = date.today() + timedelta(days=60)
        
        contracts = [
            OptionContract(
                symbol="SPY",
                strike=450.0,
                expiration=exp1,
                option_type=OptionType.CALL,
                bid=5.00, ask=5.20,
            ),
            OptionContract(
                symbol="SPY",
                strike=450.0,
                expiration=exp1,
                option_type=OptionType.PUT,
                bid=4.50, ask=4.70,
            ),
            OptionContract(
                symbol="SPY",
                strike=455.0,
                expiration=exp2,
                option_type=OptionType.CALL,
                bid=6.00, ask=6.30,
            ),
        ]
        
        return OptionsChain(
            symbol="SPY",
            underlying_price=452.0,
            contracts=contracts,
        )
    
    def test_get_calls(self, chain):
        """Test filtering calls."""
        calls = chain.get_calls()
        assert len(calls) == 2
        assert all(c.option_type == OptionType.CALL for c in calls)
    
    def test_get_puts(self, chain):
        """Test filtering puts."""
        puts = chain.get_puts()
        assert len(puts) == 1
        assert puts[0].option_type == OptionType.PUT
    
    def test_get_expirations(self, chain):
        """Test getting unique expirations."""
        expirations = chain.get_expirations()
        assert len(expirations) == 2
    
    def test_filter_by_dte(self, chain):
        """Test filtering by DTE range."""
        filtered = chain.filter_by_dte(min_dte=25, max_dte=45)
        assert len(filtered.contracts) == 2  # Only 30-day contracts


class TestVIXTermStructure:
    """Tests for VIX term structure."""
    
    def test_contango(self):
        """Test contango detection (normal market)."""
        vix = VIXTermStructure(
            spot_vix=15.0,
            futures=[
                VIXFuture(expiration=date.today() + timedelta(days=30), price=16.0),
                VIXFuture(expiration=date.today() + timedelta(days=60), price=17.0),
            ],
        )
        assert vix.is_backwardation is False
        assert vix.contango_ratio > 1.0
    
    def test_backwardation(self):
        """Test backwardation detection (stressed market)."""
        vix = VIXTermStructure(
            spot_vix=25.0,
            futures=[
                VIXFuture(expiration=date.today() + timedelta(days=30), price=22.0),
                VIXFuture(expiration=date.today() + timedelta(days=60), price=20.0),
            ],
        )
        assert vix.is_backwardation is True
        assert vix.contango_ratio < 1.0


class TestIVMetrics:
    """Tests for IV metrics."""
    
    def test_elevated_iv(self):
        """Test elevated IV detection."""
        metrics = IVMetrics(
            symbol="SPY",
            current_iv=0.22,
            iv_percentile=65,
            iv_rank=55,
            iv_high_52w=0.35,
            iv_low_52w=0.12,
            realized_vol=0.15,
            iv_rv_ratio=1.47,
        )
        assert metrics.is_elevated is True
        assert metrics.is_premium_rich is True
    
    def test_low_iv(self):
        """Test low IV detection."""
        metrics = IVMetrics(
            symbol="SPY",
            current_iv=0.12,
            iv_percentile=25,
            iv_rank=15,
            iv_high_52w=0.35,
            iv_low_52w=0.10,
            realized_vol=0.13,
            iv_rv_ratio=0.92,
        )
        assert metrics.is_elevated is False
        assert metrics.is_premium_rich is False


class TestSignalResult:
    """Tests for signal result."""
    
    def test_signal_strength_classification(self):
        """Test score to strength mapping."""
        assert SignalResult.from_score(0) == SignalStrength.NONE
        assert SignalResult.from_score(2) == SignalStrength.WEAK
        assert SignalResult.from_score(3) == SignalStrength.MODERATE
        assert SignalResult.from_score(5) == SignalStrength.STRONG
        assert SignalResult.from_score(7) == SignalStrength.VERY_STRONG
```

## Acceptance Criteria

1. ✅ All models defined with proper Pydantic v2 syntax
2. ✅ Type hints on all fields
3. ✅ Validation rules for financial values (non-negative, bounds)
4. ✅ Computed properties where appropriate
5. ✅ Models are frozen (immutable)
6. ✅ `poetry run pytest tests/test_data/` passes all tests

## Output Files

- `theta/data/models.py`
- `tests/test_data/__init__.py`
- `tests/test_data/test_models.py`

## Next Prompt

Proceed to `03_massive_client.md` to create the Polygon.io API client.
