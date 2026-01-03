# Prompt 01: Project Setup

## Context

We're building **Project Theta**, a systematic options trading dashboard for selling volatility premium. This prompt initialises the Python project structure with Poetry, configuration, and basic scaffolding.

## Task

Create the initial project structure with:
1. Poetry project with all dependencies
2. Directory structure for all modules
3. Configuration system (YAML + Pydantic settings)
4. Basic logging setup
5. Environment variable handling

## Reference Files

Before starting, examine:
- `refs/adaptive-vol-arb/backend/` - FastAPI project structure
- `refs/adaptive-vol-arb/config/` - YAML configuration pattern

## Specifications

### pyproject.toml Dependencies

```toml
[tool.poetry]
name = "project-theta"
version = "0.1.0"
description = "Systematic volatility premium harvesting system"
authors = ["Adrian <your-email>"]
readme = "README.md"
packages = [{include = "theta"}]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
uvicorn = {extras = ["standard"], version = "^0.27.0"}
pydantic = "^2.5.0"
pydantic-settings = "^2.1.0"
httpx = "^0.26.0"
numpy = "^1.26.0"
pandas = "^2.1.0"
scipy = "^1.11.0"
vollib = "^0.1.5"
pandas-ta = "^0.3.14b0"
quantstats = "^0.0.62"
pyyaml = "^6.0"
python-dotenv = "^1.0.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.23.0"
pytest-cov = "^4.1.0"
hypothesis = "^6.92.0"
black = "^23.12.0"
ruff = "^0.1.9"
mypy = "^1.8.0"
types-pyyaml = "^6.0.0"

[tool.poetry.scripts]
theta = "theta.cli:main"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.black]
line-length = 100
target-version = ["py311"]

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "W", "UP"]

[tool.mypy]
python_version = "3.11"
strict = true
plugins = ["pydantic.mypy"]
```

### Directory Structure to Create

```
project-theta/
├── pyproject.toml
├── README.md
├── .env.example
├── .gitignore
├── config/
│   └── settings.yaml
├── theta/
│   ├── __init__.py
│   ├── cli.py                  # Entry point (stub)
│   ├── config.py               # Configuration loading
│   ├── logging_config.py       # Logging setup
│   ├── data/
│   │   └── __init__.py
│   ├── analytics/
│   │   └── __init__.py
│   ├── signals/
│   │   └── __init__.py
│   ├── portfolio/
│   │   └── __init__.py
│   ├── performance/
│   │   └── __init__.py
│   └── api/
│       ├── __init__.py
│       └── routes/
│           └── __init__.py
└── tests/
    ├── __init__.py
    ├── conftest.py
    └── test_config.py
```

### config/settings.yaml

```yaml
# Project Theta Configuration

# Data providers
massive:
  base_url: "https://api.polygon.io"
  # api_key loaded from environment

# Watchlist symbols
watchlist:
  symbols:
    - SPY
    - QQQ
    - IWM
    - XLF
    - XLE
    - XLK
    - AAPL
    - MSFT
    - GOOGL
    - AMZN

# Signal generation rules
signals:
  iv_percentile_threshold: 50
  iv_percentile_strong: 70
  iv_rv_ratio_threshold: 1.3
  min_dte: 25
  max_dte: 50
  optimal_dte_min: 30
  optimal_dte_max: 45
  max_delta: 0.30
  min_open_interest: 100
  max_spread_percent: 5.0
  days_to_earnings_buffer: 7

# Risk limits
risk:
  max_portfolio_delta: 50
  max_portfolio_vega: 1000
  max_position_size_percent: 10
  max_sector_concentration_percent: 30
  max_buying_power_utilisation: 50

# Performance tracking
performance:
  benchmark: "SPY"
  risk_free_rate: 0.05

# Historical data lookback
historical:
  iv_lookback_days: 252
  rv_window: 20

# Logging
logging:
  level: "INFO"
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
```

### theta/config.py

```python
"""
Configuration loading for Project Theta.

Uses Pydantic Settings for environment variable handling
and YAML for structured configuration.
"""
from pathlib import Path
from functools import lru_cache

import yaml
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class MassiveConfig(BaseModel):
    """Polygon.io/Massive API configuration."""
    base_url: str = "https://api.polygon.io"
    api_key: str = ""


class SignalsConfig(BaseModel):
    """Signal generation configuration."""
    iv_percentile_threshold: int = 50
    iv_percentile_strong: int = 70
    iv_rv_ratio_threshold: float = 1.3
    min_dte: int = 25
    max_dte: int = 50
    optimal_dte_min: int = 30
    optimal_dte_max: int = 45
    max_delta: float = 0.30
    min_open_interest: int = 100
    max_spread_percent: float = 5.0
    days_to_earnings_buffer: int = 7


class RiskConfig(BaseModel):
    """Risk limits configuration."""
    max_portfolio_delta: float = 50
    max_portfolio_vega: float = 1000
    max_position_size_percent: float = 10
    max_sector_concentration_percent: float = 30
    max_buying_power_utilisation: float = 50


class PerformanceConfig(BaseModel):
    """Performance tracking configuration."""
    benchmark: str = "SPY"
    risk_free_rate: float = 0.05


class HistoricalConfig(BaseModel):
    """Historical data configuration."""
    iv_lookback_days: int = 252
    rv_window: int = 20


class LoggingConfig(BaseModel):
    """Logging configuration."""
    level: str = "INFO"
    format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"


class Settings(BaseSettings):
    """
    Main settings class combining environment variables and YAML config.
    
    Environment variables take precedence over YAML values.
    """
    model_config = SettingsConfigDict(
        env_prefix="THETA_",
        env_nested_delimiter="__",
        extra="ignore",
    )
    
    # API Keys (from environment)
    massive_api_key: str = Field(default="", alias="MASSIVE_API_KEY")
    
    # Loaded from YAML
    massive: MassiveConfig = Field(default_factory=MassiveConfig)
    watchlist_symbols: list[str] = Field(default_factory=list)
    signals: SignalsConfig = Field(default_factory=SignalsConfig)
    risk: RiskConfig = Field(default_factory=RiskConfig)
    performance: PerformanceConfig = Field(default_factory=PerformanceConfig)
    historical: HistoricalConfig = Field(default_factory=HistoricalConfig)
    logging: LoggingConfig = Field(default_factory=LoggingConfig)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._load_yaml_config()
        # Inject API key into massive config
        self.massive.api_key = self.massive_api_key

    def _load_yaml_config(self) -> None:
        """Load configuration from YAML file."""
        config_path = Path(__file__).parent.parent / "config" / "settings.yaml"
        if config_path.exists():
            with open(config_path) as f:
                yaml_config = yaml.safe_load(f)
            
            if yaml_config:
                if "massive" in yaml_config:
                    self.massive = MassiveConfig(**yaml_config["massive"])
                if "watchlist" in yaml_config:
                    self.watchlist_symbols = yaml_config["watchlist"].get("symbols", [])
                if "signals" in yaml_config:
                    self.signals = SignalsConfig(**yaml_config["signals"])
                if "risk" in yaml_config:
                    self.risk = RiskConfig(**yaml_config["risk"])
                if "performance" in yaml_config:
                    self.performance = PerformanceConfig(**yaml_config["performance"])
                if "historical" in yaml_config:
                    self.historical = HistoricalConfig(**yaml_config["historical"])
                if "logging" in yaml_config:
                    self.logging = LoggingConfig(**yaml_config["logging"])


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
```

### theta/logging_config.py

```python
"""Logging configuration for Project Theta."""
import logging
import sys

from theta.config import get_settings


def setup_logging() -> None:
    """Configure logging for the application."""
    settings = get_settings()
    
    logging.basicConfig(
        level=getattr(logging, settings.logging.level.upper()),
        format=settings.logging.format,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
    )
    
    # Reduce noise from third-party libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
```

### theta/cli.py (Stub)

```python
"""Command-line interface for Project Theta."""
import argparse
import logging

from theta.logging_config import setup_logging
from theta.config import get_settings


logger = logging.getLogger(__name__)


def main() -> None:
    """Main entry point."""
    setup_logging()
    settings = get_settings()
    
    parser = argparse.ArgumentParser(description="Project Theta - Options Analytics")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Watchlist command (to be implemented)
    watchlist_parser = subparsers.add_parser("watchlist", help="Show ranked watchlist")
    watchlist_parser.add_argument(
        "--symbols", 
        nargs="+", 
        default=None,
        help="Override default watchlist symbols"
    )
    
    args = parser.parse_args()
    
    if args.command == "watchlist":
        symbols = args.symbols or settings.watchlist_symbols
        logger.info(f"Watchlist symbols: {symbols}")
        print("Watchlist command not yet implemented")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
```

### .env.example

```bash
# Project Theta Environment Variables

# Polygon.io / Massive API key
MASSIVE_API_KEY=your_api_key_here

# Tastytrade credentials (future)
# TASTYTRADE_USERNAME=your_username
# TASTYTRADE_PASSWORD=your_password
```

### .gitignore

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
.Python
.venv/
venv/
*.egg-info/
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# Testing
.pytest_cache/
.coverage
htmlcov/
.mypy_cache/

# OS
.DS_Store
Thumbs.db

# Project specific
*.db
*.sqlite
```

### tests/conftest.py

```python
"""Pytest configuration and fixtures."""
import pytest

from theta.config import Settings


@pytest.fixture
def test_settings() -> Settings:
    """Provide test settings without loading .env."""
    return Settings(
        massive_api_key="test_key",
        watchlist_symbols=["SPY", "QQQ"],
    )
```

### tests/test_config.py

```python
"""Tests for configuration module."""
import pytest

from theta.config import Settings, SignalsConfig


def test_settings_defaults():
    """Test that settings have sensible defaults."""
    settings = Settings(massive_api_key="test")
    
    assert settings.signals.iv_percentile_threshold == 50
    assert settings.signals.max_delta == 0.30
    assert settings.risk.max_portfolio_delta == 50


def test_signals_config():
    """Test signals configuration."""
    config = SignalsConfig(iv_percentile_threshold=60)
    
    assert config.iv_percentile_threshold == 60
    assert config.optimal_dte_min == 30  # Default


def test_watchlist_symbols(test_settings):
    """Test watchlist symbols from fixture."""
    assert "SPY" in test_settings.watchlist_symbols
    assert "QQQ" in test_settings.watchlist_symbols
```

## Acceptance Criteria

1. ✅ `poetry install` succeeds
2. ✅ `poetry run pytest` passes (3 tests)
3. ✅ `poetry run theta --help` shows usage
4. ✅ `poetry run theta watchlist` prints stub message
5. ✅ Configuration loads from YAML
6. ✅ Environment variables override YAML values

## Output Files

After completion, verify these files exist:
- `pyproject.toml`
- `config/settings.yaml`
- `theta/config.py`
- `theta/cli.py`
- `tests/test_config.py`

## Next Prompt

Proceed to `02_data_models.md` to create Pydantic models for options data.
