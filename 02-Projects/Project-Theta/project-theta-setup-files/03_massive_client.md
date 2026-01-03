# Prompt 03: Massive (Polygon.io) API Client

## Context

We're building **Project Theta**, a systematic options trading dashboard. This prompt creates the API client for Polygon.io (which powers Massive), our primary data source for options chains, Greeks, and historical volatility data.

## Prerequisites

- Prompts 01-02 completed (project setup, data models)
- Polygon.io API key in `.env` file

## Task

Create an async API client that:
1. Fetches options chains with Greeks
2. Fetches underlying quotes
3. Fetches historical options data for IV percentile calculation
4. Fetches VIX term structure data
5. Handles rate limiting and errors gracefully

## Reference Files

Before starting, examine:
- `refs/options-analytics/retriever.py` - Data retrieval pattern
- `refs/adaptive-vol-arb/backend/app/services/` - Service layer pattern
- Polygon.io Options API docs: https://polygon.io/docs/options

## Background: Polygon.io API

Key endpoints we'll use:

1. **Options Chain**: `/v3/snapshot/options/{underlyingAsset}`
   - Returns all contracts with Greeks, IV, bid/ask
   
2. **Options Contract**: `/v3/snapshot/options/{underlyingAsset}/{optionsTicker}`
   - Single contract details

3. **Historical Options**: `/v2/aggs/ticker/{optionsTicker}/range/{multiplier}/{timespan}/{from}/{to}`
   - OHLCV data for calculating historical IV

4. **Underlying Quote**: `/v2/snapshot/locale/us/markets/stocks/tickers/{ticker}`
   - Current price for underlying

5. **VIX Data**: We'll use ticker `VIX` and VIX futures tickers

## Specifications

### theta/data/massive_client.py

```python
"""
Polygon.io API client for options data.

This module provides async access to Polygon.io's options API,
which powers our market data needs for Project Theta.

Usage:
    client = MassiveClient()
    chain = await client.get_options_chain("SPY")
    quote = await client.get_quote("SPY")
"""
import asyncio
import logging
from datetime import date, datetime, timedelta
from typing import Optional
from functools import lru_cache

import httpx

from theta.config import get_settings
from theta.data.models import (
    Greeks,
    OptionContract,
    OptionsChain,
    OptionType,
    Quote,
    VIXFuture,
    VIXTermStructure,
)

logger = logging.getLogger(__name__)


class MassiveClientError(Exception):
    """Base exception for Massive client errors."""
    pass


class RateLimitError(MassiveClientError):
    """Raised when rate limit is hit."""
    pass


class MassiveClient:
    """
    Async client for Polygon.io API.
    
    Handles:
    - Options chain retrieval
    - Quote retrieval
    - Historical data for IV percentile
    - VIX term structure
    - Rate limiting and retries
    
    Example:
        async with MassiveClient() as client:
            chain = await client.get_options_chain("SPY")
            print(f"Got {len(chain.contracts)} contracts")
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: float = 30.0,
        max_retries: int = 3,
    ):
        """
        Initialize the client.
        
        Args:
            api_key: Polygon.io API key (default: from config)
            base_url: API base URL (default: from config)
            timeout: Request timeout in seconds
            max_retries: Maximum retry attempts for failed requests
        """
        settings = get_settings()
        
        self.api_key = api_key or settings.massive.api_key
        self.base_url = base_url or settings.massive.base_url
        self.timeout = timeout
        self.max_retries = max_retries
        
        if not self.api_key:
            raise MassiveClientError("API key not configured")
        
        self._client: Optional[httpx.AsyncClient] = None
    
    async def __aenter__(self) -> "MassiveClient":
        """Async context manager entry."""
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=self.timeout,
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        """Async context manager exit."""
        if self._client:
            await self._client.aclose()
            self._client = None
    
    @property
    def client(self) -> httpx.AsyncClient:
        """Get the HTTP client, raising if not initialized."""
        if self._client is None:
            raise MassiveClientError("Client not initialized. Use 'async with' context manager.")
        return self._client
    
    async def _request(
        self,
        method: str,
        path: str,
        params: Optional[dict] = None,
    ) -> dict:
        """
        Make an API request with retry logic.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            path: API path (e.g., /v3/snapshot/options/SPY)
            params: Query parameters
            
        Returns:
            Response JSON as dictionary
            
        Raises:
            RateLimitError: If rate limit is exceeded
            MassiveClientError: For other API errors
        """
        params = params or {}
        params["apiKey"] = self.api_key  # Some endpoints need this as param
        
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                response = await self.client.request(method, path, params=params)
                
                if response.status_code == 429:
                    # Rate limited - wait and retry
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.warning(f"Rate limited, waiting {wait_time}s")
                    await asyncio.sleep(wait_time)
                    continue
                
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPStatusError as e:
                logger.warning(f"HTTP error: {e.response.status_code}")
                last_exception = e
                
            except httpx.RequestError as e:
                logger.warning(f"Request error: {e}")
                last_exception = e
                await asyncio.sleep(1)
        
        raise MassiveClientError(f"Request failed after {self.max_retries} retries: {last_exception}")
    
    async def get_quote(self, symbol: str) -> Quote:
        """
        Get current quote for a symbol.
        
        Args:
            symbol: Stock ticker (e.g., "SPY")
            
        Returns:
            Quote with bid, ask, last price
        """
        path = f"/v2/snapshot/locale/us/markets/stocks/tickers/{symbol}"
        data = await self._request("GET", path)
        
        ticker = data.get("ticker", {})
        day = ticker.get("day", {})
        prevDay = ticker.get("prevDay", {})
        
        # Use current day data if available, else previous day
        last_price = day.get("c") or prevDay.get("c", 0)
        
        # Polygon snapshot doesn't always have bid/ask, use last as proxy
        return Quote(
            symbol=symbol,
            bid=last_price * 0.9999,  # Approximate
            ask=last_price * 1.0001,  # Approximate
            last=last_price,
            timestamp=datetime.utcnow(),
        )
    
    async def get_options_chain(
        self,
        symbol: str,
        expiration_date: Optional[date] = None,
        expiration_date_gte: Optional[date] = None,
        expiration_date_lte: Optional[date] = None,
        contract_type: Optional[str] = None,
        limit: int = 250,
    ) -> OptionsChain:
        """
        Get options chain for a symbol.
        
        Args:
            symbol: Underlying symbol (e.g., "SPY")
            expiration_date: Specific expiration date
            expiration_date_gte: Minimum expiration date
            expiration_date_lte: Maximum expiration date
            contract_type: "call" or "put" (None for both)
            limit: Maximum contracts to return
            
        Returns:
            OptionsChain with contracts
        """
        # First get the underlying price
        quote = await self.get_quote(symbol)
        
        # Build request params
        params = {
            "limit": limit,
            "sort": "expiration_date",
        }
        
        if expiration_date:
            params["expiration_date"] = expiration_date.isoformat()
        if expiration_date_gte:
            params["expiration_date.gte"] = expiration_date_gte.isoformat()
        if expiration_date_lte:
            params["expiration_date.lte"] = expiration_date_lte.isoformat()
        if contract_type:
            params["contract_type"] = contract_type
        
        path = f"/v3/snapshot/options/{symbol}"
        data = await self._request("GET", path, params)
        
        contracts = []
        for result in data.get("results", []):
            try:
                contract = self._parse_contract(result, symbol)
                if contract:
                    contracts.append(contract)
            except Exception as e:
                logger.debug(f"Failed to parse contract: {e}")
                continue
        
        return OptionsChain(
            symbol=symbol,
            underlying_price=quote.last,
            contracts=contracts,
            timestamp=datetime.utcnow(),
        )
    
    def _parse_contract(self, data: dict, symbol: str) -> Optional[OptionContract]:
        """Parse a contract from API response."""
        details = data.get("details", {})
        day = data.get("day", {})
        greeks_data = data.get("greeks", {})
        
        # Extract fields
        strike = details.get("strike_price")
        expiration_str = details.get("expiration_date")
        contract_type = details.get("contract_type")
        
        if not all([strike, expiration_str, contract_type]):
            return None
        
        # Parse expiration
        expiration = date.fromisoformat(expiration_str)
        
        # Skip expired contracts
        if expiration < date.today():
            return None
        
        # Parse option type
        option_type = OptionType.CALL if contract_type == "call" else OptionType.PUT
        
        # Parse prices - use last_quote if day data not available
        last_quote = data.get("last_quote", {})
        bid = last_quote.get("bid", 0) or day.get("o", 0)
        ask = last_quote.get("ask", 0) or day.get("c", 0)
        
        if bid <= 0 and ask <= 0:
            return None
        
        # Parse Greeks
        greeks = None
        if greeks_data:
            greeks = Greeks(
                delta=greeks_data.get("delta", 0),
                gamma=greeks_data.get("gamma", 0),
                theta=greeks_data.get("theta", 0),
                vega=greeks_data.get("vega", 0),
            )
        
        return OptionContract(
            symbol=symbol,
            strike=strike,
            expiration=expiration,
            option_type=option_type,
            bid=max(0, bid),
            ask=max(0, ask),
            last=day.get("c"),
            volume=day.get("v", 0),
            open_interest=data.get("open_interest", 0),
            implied_volatility=data.get("implied_volatility"),
            greeks=greeks,
            last_updated=datetime.utcnow(),
        )
    
    async def get_historical_iv(
        self,
        symbol: str,
        lookback_days: int = 252,
    ) -> list[tuple[date, float]]:
        """
        Get historical ATM IV for calculating IV percentile.
        
        Note: This is a simplified approach. For production, you might
        want to store historical IV data in a database.
        
        Args:
            symbol: Underlying symbol
            lookback_days: Number of days to look back
            
        Returns:
            List of (date, iv) tuples
        """
        # For now, return mock data - in production you'd:
        # 1. Query historical options snapshots
        # 2. Calculate ATM IV for each day
        # 3. Store in database for fast retrieval
        
        # This is a placeholder - actual implementation would query
        # /v2/aggs/ticker/{optionsTicker}/range/1/day/{from}/{to}
        # for historical options data
        
        logger.warning(
            "Historical IV not fully implemented - using mock data. "
            "For production, implement historical data storage."
        )
        
        import random
        random.seed(42)  # Reproducible for testing
        
        today = date.today()
        result = []
        for i in range(lookback_days):
            d = today - timedelta(days=i)
            # Mock IV between 0.12 and 0.35
            iv = 0.12 + random.random() * 0.23
            result.append((d, iv))
        
        return result
    
    async def get_vix_term_structure(self) -> VIXTermStructure:
        """
        Get VIX term structure (spot + futures).
        
        Returns:
            VIXTermStructure with spot VIX and futures
        """
        # Get VIX spot
        try:
            vix_quote = await self.get_quote("VIX")
            spot_vix = vix_quote.last
        except Exception:
            # VIX might need different handling
            logger.warning("Could not get VIX quote, using default")
            spot_vix = 15.0
        
        # VIX futures would require futures data
        # For now, return spot only
        # In production, you'd query CBOE VIX futures
        
        return VIXTermStructure(
            spot_vix=spot_vix,
            futures=[],  # Would need futures data source
            timestamp=datetime.utcnow(),
        )


# Convenience function for one-off requests
async def get_chain(symbol: str) -> OptionsChain:
    """
    Convenience function to get an options chain.
    
    Example:
        chain = await get_chain("SPY")
    """
    async with MassiveClient() as client:
        return await client.get_options_chain(symbol)


async def get_quote(symbol: str) -> Quote:
    """
    Convenience function to get a quote.
    
    Example:
        quote = await get_quote("SPY")
    """
    async with MassiveClient() as client:
        return await client.get_quote(symbol)
```

### tests/test_data/test_massive_client.py

```python
"""Tests for Massive client."""
import pytest
from datetime import date, timedelta
from unittest.mock import AsyncMock, patch, MagicMock

from theta.data.massive_client import (
    MassiveClient,
    MassiveClientError,
    get_chain,
    get_quote,
)
from theta.data.models import OptionType


class TestMassiveClient:
    """Tests for MassiveClient."""
    
    @pytest.fixture
    def mock_response(self):
        """Create a mock API response."""
        return {
            "results": [
                {
                    "details": {
                        "strike_price": 450.0,
                        "expiration_date": (date.today() + timedelta(days=30)).isoformat(),
                        "contract_type": "call",
                    },
                    "day": {"o": 10.0, "c": 10.5, "v": 5000},
                    "last_quote": {"bid": 10.2, "ask": 10.4},
                    "open_interest": 25000,
                    "implied_volatility": 0.22,
                    "greeks": {
                        "delta": 0.52,
                        "gamma": 0.02,
                        "theta": -0.05,
                        "vega": 0.30,
                    },
                }
            ]
        }
    
    @pytest.fixture
    def mock_quote_response(self):
        """Create a mock quote response."""
        return {
            "ticker": {
                "day": {"c": 452.50},
                "prevDay": {"c": 450.00},
            }
        }
    
    def test_client_requires_api_key(self):
        """Test that client raises without API key."""
        with patch("theta.data.massive_client.get_settings") as mock_settings:
            mock_settings.return_value.massive.api_key = ""
            with pytest.raises(MassiveClientError):
                MassiveClient()
    
    @pytest.mark.asyncio
    async def test_get_quote(self, mock_quote_response):
        """Test quote retrieval."""
        with patch("theta.data.massive_client.get_settings") as mock_settings:
            mock_settings.return_value.massive.api_key = "test_key"
            mock_settings.return_value.massive.base_url = "https://api.polygon.io"
            
            client = MassiveClient()
            client._client = AsyncMock()
            
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = mock_quote_response
            client._client.request = AsyncMock(return_value=mock_response)
            
            quote = await client.get_quote("SPY")
            
            assert quote.symbol == "SPY"
            assert quote.last == 452.50
    
    @pytest.mark.asyncio
    async def test_get_options_chain(self, mock_response, mock_quote_response):
        """Test options chain retrieval."""
        with patch("theta.data.massive_client.get_settings") as mock_settings:
            mock_settings.return_value.massive.api_key = "test_key"
            mock_settings.return_value.massive.base_url = "https://api.polygon.io"
            
            client = MassiveClient()
            client._client = AsyncMock()
            
            # Mock both the quote and chain requests
            def mock_request(method, path, **kwargs):
                mock_resp = MagicMock()
                mock_resp.status_code = 200
                if "snapshot" in path and "options" not in path:
                    mock_resp.json.return_value = mock_quote_response
                else:
                    mock_resp.json.return_value = mock_response
                return mock_resp
            
            client._client.request = AsyncMock(side_effect=mock_request)
            
            chain = await client.get_options_chain("SPY")
            
            assert chain.symbol == "SPY"
            assert len(chain.contracts) == 1
            assert chain.contracts[0].strike == 450.0
            assert chain.contracts[0].option_type == OptionType.CALL
            assert chain.contracts[0].greeks is not None
            assert chain.contracts[0].greeks.delta == 0.52
    
    @pytest.mark.asyncio
    async def test_parse_contract_handles_missing_data(self):
        """Test that missing data is handled gracefully."""
        with patch("theta.data.massive_client.get_settings") as mock_settings:
            mock_settings.return_value.massive.api_key = "test_key"
            mock_settings.return_value.massive.base_url = "https://api.polygon.io"
            
            client = MassiveClient()
            
            # Missing strike
            result = client._parse_contract({"details": {}}, "SPY")
            assert result is None
            
            # Expired contract
            result = client._parse_contract({
                "details": {
                    "strike_price": 450.0,
                    "expiration_date": (date.today() - timedelta(days=1)).isoformat(),
                    "contract_type": "call",
                }
            }, "SPY")
            assert result is None


class TestConvenienceFunctions:
    """Tests for convenience functions."""
    
    @pytest.mark.asyncio
    async def test_get_chain_function(self):
        """Test get_chain convenience function."""
        with patch("theta.data.massive_client.MassiveClient") as MockClient:
            mock_instance = AsyncMock()
            mock_instance.get_options_chain = AsyncMock(return_value="mock_chain")
            MockClient.return_value.__aenter__ = AsyncMock(return_value=mock_instance)
            MockClient.return_value.__aexit__ = AsyncMock(return_value=None)
            
            result = await get_chain("SPY")
            assert result == "mock_chain"
```

## Acceptance Criteria

1. ✅ Client connects to Polygon.io API
2. ✅ Options chain retrieval works with filters
3. ✅ Greeks are parsed correctly
4. ✅ Quotes are retrieved
5. ✅ Rate limiting is handled
6. ✅ `poetry run pytest tests/test_data/test_massive_client.py` passes

## Output Files

- `theta/data/massive_client.py`
- `tests/test_data/test_massive_client.py`

## Important Notes

### API Key Setup

1. Get a Polygon.io API key from https://polygon.io/
2. Add to `.env`: `MASSIVE_API_KEY=your_key_here`
3. Start with the free tier for development

### Rate Limiting

Polygon.io has different rate limits by tier:
- Free: 5 requests/minute
- Starter ($29/mo): Higher limits
- Developer: Even higher

The client implements exponential backoff for rate limit handling.

### Historical IV Data

The `get_historical_iv` method is a placeholder. For production:
1. Store daily IV snapshots in a database
2. Query historical data from storage
3. Polygon's historical options data requires higher tier plans

## Next Prompt

Proceed to `04_iv_calculator.md` (already created) to implement IV extraction.
