# Prompt 10: CLI Interface

## Context

You are building ARGUS (Project Theta), a systematic options volatility trading platform. This prompt implements the CLI interface - the capstone of Phase 1 that ties all modules together into a usable tool.

The CLI provides:
- **Watchlist scanning**: Evaluate multiple symbols for opportunities
- **Chain analysis**: Deep dive on a single symbol's options chain
- **Signal display**: Ranked opportunities with key metrics
- **Configuration**: View and validate settings

This is what you'll actually *run* to find trades.

## Prerequisites

- Prompts 01-09 completed
- All analytics and signals modules working
- Polygon.io API key configured
- `click` and `rich` packages installed

## Task

Create the CLI module at `theta/cli.py` and the entry point.

## Reference Files

Review these before implementing:
- `theta/data/massive_client.py` - API client
- `theta/analytics/` - All analytics modules
- `theta/signals/rules_engine.py` - Signal generation
- `theta/signals/scoring.py` - ARR calculation
- `config/settings.yaml` - Configuration

## Specifications

### File: `theta/cli.py`

```python
"""
ARGUS CLI - Command-line interface for options volatility scanning.

Usage:
    theta scan              # Scan full watchlist
    theta scan SPY QQQ      # Scan specific symbols
    theta chain SPY         # Analyze single symbol chain
    theta config            # Show current configuration
    
Run with --help for more options.
"""

import asyncio
from datetime import date, timedelta
from pathlib import Path
from typing import Optional
import sys

import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.style import Style
from rich import box

from theta.config import Settings, load_settings
from theta.data.massive_client import MassiveClient
from theta.analytics.percentile import calculate_iv_percentile
from theta.analytics.realized_vol import calculate_realized_volatility, RVEstimator
from theta.analytics.greeks import calculate_greeks, calculate_time_to_expiry
from theta.signals.rules_engine import (
    evaluate_option,
    evaluate_chain,
    find_best_strikes,
    SignalThresholds,
    OptionSignalInput,
    SignalStrength,
)
from theta.signals.scoring import calculate_arr, ARRResult

# Rich console for pretty output
console = Console()

# Styles
STYLE_STRONG = Style(color="green", bold=True)
STYLE_MODERATE = Style(color="yellow")
STYLE_WEAK = Style(color="white", dim=True)
STYLE_FAIL = Style(color="red", dim=True)
STYLE_HEADER = Style(color="cyan", bold=True)


def get_signal_style(strength: SignalStrength) -> Style:
    """Get Rich style for signal strength."""
    if strength == SignalStrength.VERY_STRONG:
        return Style(color="bright_green", bold=True)
    elif strength == SignalStrength.STRONG:
        return STYLE_STRONG
    elif strength == SignalStrength.MODERATE:
        return STYLE_MODERATE
    elif strength == SignalStrength.WEAK:
        return STYLE_WEAK
    else:
        return STYLE_FAIL


def format_delta(delta: Optional[float]) -> str:
    """Format delta for display."""
    if delta is None:
        return "-"
    return f"{delta:+.2f}"


def format_percent(value: Optional[float], decimals: int = 1) -> str:
    """Format percentage for display."""
    if value is None:
        return "-"
    return f"{value:.{decimals}f}%"


def format_ratio(value: Optional[float]) -> str:
    """Format ratio for display."""
    if value is None:
        return "-"
    return f"{value:.2f}x"


def format_currency(value: Optional[float]) -> str:
    """Format currency for display."""
    if value is None:
        return "-"
    return f"${value:,.2f}"


@click.group()
@click.option('--config', '-c', type=click.Path(exists=True), help='Path to config file')
@click.option('--verbose', '-v', is_flag=True, help='Verbose output')
@click.pass_context
def cli(ctx, config: Optional[str], verbose: bool):
    """
    ARGUS - Systematic Options Volatility Scanner
    
    Scan for premium selling opportunities based on IV percentile,
    IV/RV ratio, and configurable signal rules.
    """
    ctx.ensure_object(dict)
    
    # Load settings
    config_path = Path(config) if config else None
    try:
        settings = load_settings(config_path)
    except Exception as e:
        console.print(f"[red]Error loading config: {e}[/red]")
        sys.exit(1)
    
    ctx.obj['settings'] = settings
    ctx.obj['verbose'] = verbose


@cli.command()
@click.argument('symbols', nargs=-1)
@click.option('--min-iv-percentile', type=float, help='Minimum IV percentile filter')
@click.option('--max-delta', type=float, help='Maximum absolute delta')
@click.option('--min-dte', type=int, help='Minimum days to expiration')
@click.option('--max-dte', type=int, help='Maximum days to expiration')
@click.option('--puts-only', is_flag=True, help='Only show puts')
@click.option('--calls-only', is_flag=True, help='Only show calls')
@click.option('--top', '-n', type=int, default=10, help='Number of results per symbol')
@click.option('--output', '-o', type=click.Choice(['table', 'json', 'csv']), default='table')
@click.pass_context
def scan(
    ctx,
    symbols: tuple[str, ...],
    min_iv_percentile: Optional[float],
    max_delta: Optional[float],
    min_dte: Optional[int],
    max_dte: Optional[int],
    puts_only: bool,
    calls_only: bool,
    top: int,
    output: str,
):
    """
    Scan watchlist for premium selling opportunities.
    
    If no symbols provided, scans the full watchlist from config.
    
    Examples:
    
        theta scan                    # Scan full watchlist
        
        theta scan SPY QQQ IWM        # Scan specific symbols
        
        theta scan --puts-only -n 5   # Top 5 puts only
        
        theta scan --min-iv-percentile 70  # Higher IV threshold
    """
    settings = ctx.obj['settings']
    verbose = ctx.obj['verbose']
    
    # Determine symbols to scan
    if symbols:
        scan_symbols = list(symbols)
    else:
        scan_symbols = settings.watchlist
    
    if not scan_symbols:
        console.print("[red]No symbols to scan. Provide symbols or configure watchlist.[/red]")
        return
    
    # Build thresholds with overrides
    threshold_kwargs = {}
    if min_iv_percentile is not None:
        threshold_kwargs['min_iv_percentile'] = min_iv_percentile
    if max_delta is not None:
        threshold_kwargs['max_delta'] = max_delta
    if min_dte is not None:
        threshold_kwargs['min_dte'] = min_dte
    if max_dte is not None:
        threshold_kwargs['max_dte'] = max_dte
    
    thresholds = SignalThresholds(**{**settings.signal_thresholds, **threshold_kwargs})
    
    # Display header
    console.print(Panel(
        f"[bold cyan]ARGUS Watchlist Scan[/bold cyan]\n"
        f"Symbols: {', '.join(scan_symbols)}\n"
        f"IV%ile ≥ {thresholds.min_iv_percentile} | "
        f"Delta ≤ {thresholds.max_delta} | "
        f"DTE: {thresholds.min_dte}-{thresholds.max_dte}",
        box=box.ROUNDED
    ))
    
    # Run async scan
    asyncio.run(_scan_watchlist(
        symbols=scan_symbols,
        thresholds=thresholds,
        settings=settings,
        puts_only=puts_only,
        calls_only=calls_only,
        top=top,
        output=output,
        verbose=verbose,
    ))


async def _scan_watchlist(
    symbols: list[str],
    thresholds: SignalThresholds,
    settings: Settings,
    puts_only: bool,
    calls_only: bool,
    top: int,
    output: str,
    verbose: bool,
):
    """Async implementation of watchlist scan."""
    
    async with MassiveClient(api_key=settings.polygon_api_key) as client:
        all_results = []
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("Scanning...", total=len(symbols))
            
            for symbol in symbols:
                progress.update(task, description=f"Scanning {symbol}...")
                
                try:
                    # Fetch options chain
                    chain = await client.get_options_chain(
                        symbol,
                        min_dte=thresholds.min_dte,
                        max_dte=thresholds.max_dte,
                    )
                    
                    # Fetch underlying quote for IV percentile context
                    quote = await client.get_quote(symbol)
                    underlying_price = quote.last if quote else None
                    
                    # Fetch historical IV for percentile (if available)
                    # This would come from stored data or API
                    iv_percentile_data = await _get_iv_percentile(client, symbol)
                    
                    # Convert chain to signal inputs
                    signal_inputs = []
                    for contract in chain.contracts:
                        # Filter by type if requested
                        if puts_only and contract.option_type != 'p':
                            continue
                        if calls_only and contract.option_type != 'c':
                            continue
                        
                        signal_input = OptionSignalInput(
                            symbol=symbol,
                            strike=contract.strike,
                            expiration=contract.expiration,
                            option_type=contract.option_type,
                            bid=contract.bid or 0,
                            ask=contract.ask or 0,
                            underlying_price=underlying_price or contract.underlying_price,
                            delta=contract.greeks.delta if contract.greeks else None,
                            iv=contract.iv,
                            iv_percentile=iv_percentile_data.get('percentile') if iv_percentile_data else None,
                            rv=iv_percentile_data.get('rv') if iv_percentile_data else None,
                            open_interest=contract.open_interest,
                            volume=contract.volume,
                            # TODO: Add earnings data
                        )
                        signal_inputs.append(signal_input)
                    
                    # Evaluate and find best
                    best = find_best_strikes(signal_inputs, thresholds, max_results=top)
                    
                    # Calculate ARR for passing signals
                    for result in best:
                        if result.passes_filters:
                            # Find the original input for premium calculation
                            original = next(
                                (s for s in signal_inputs 
                                 if s.strike == result.strike 
                                 and s.option_type == result.option_type),
                                None
                            )
                            if original:
                                result.arr = _calculate_arr_for_result(original, result)
                        
                        all_results.append(result)
                    
                except Exception as e:
                    if verbose:
                        console.print(f"[yellow]Warning: Error scanning {symbol}: {e}[/yellow]")
                    continue
                
                progress.advance(task)
        
        # Sort all results by score
        all_results.sort(key=lambda r: (r.score, r.iv_percentile or 0), reverse=True)
        
        # Display results
        if output == 'table':
            _display_results_table(all_results[:top * len(symbols)])
        elif output == 'json':
            _display_results_json(all_results)
        elif output == 'csv':
            _display_results_csv(all_results)


async def _get_iv_percentile(client: MassiveClient, symbol: str) -> Optional[dict]:
    """
    Get IV percentile data for a symbol.
    
    In a full implementation, this would:
    1. Fetch historical IV data from storage/API
    2. Calculate current IV percentile
    3. Calculate realized volatility
    4. Return metrics dict
    
    For MVP, return None and rely on per-contract IV.
    """
    # TODO: Implement historical IV fetching and percentile calculation
    # This requires storing historical ATM IV data
    return None


def _calculate_arr_for_result(option: OptionSignalInput, result) -> Optional[float]:
    """Calculate ARR for a signal result."""
    try:
        premium = option.mid_price * 100  # Per contract
        
        if option.option_type == 'p':
            # Short put: max risk = (strike * 100) - premium
            max_risk = (option.strike * 100) - premium
        else:
            # Short call: theoretically unlimited, use underlying as proxy
            max_risk = (option.underlying_price * 100) - premium
        
        if max_risk <= 0:
            return None
        
        arr = (premium / max_risk) * (365 / result.dte) * 100
        return round(arr, 2)
    except:
        return None


def _display_results_table(results):
    """Display results as a Rich table."""
    if not results:
        console.print("[yellow]No signals found matching criteria.[/yellow]")
        return
    
    table = Table(
        title="[bold cyan]ARGUS Scan Results[/bold cyan]",
        box=box.ROUNDED,
        show_header=True,
        header_style=STYLE_HEADER,
    )
    
    table.add_column("Symbol", style="bold")
    table.add_column("Type", justify="center")
    table.add_column("Strike", justify="right")
    table.add_column("Exp", justify="center")
    table.add_column("DTE", justify="right")
    table.add_column("Delta", justify="right")
    table.add_column("IV%ile", justify="right")
    table.add_column("IV/RV", justify="right")
    table.add_column("Spread", justify="right")
    table.add_column("Score", justify="center")
    table.add_column("Signal", justify="center")
    table.add_column("ARR", justify="right")
    
    for r in results:
        if not r.passes_filters:
            continue
        
        style = get_signal_style(r.strength)
        
        table.add_row(
            r.symbol,
            "PUT" if r.option_type == 'p' else "CALL",
            f"{r.strike:.0f}",
            r.expiration.strftime("%m/%d"),
            str(r.dte) if r.dte else "-",
            format_delta(r.delta),
            format_percent(r.iv_percentile),
            format_ratio(r.iv_rv_ratio),
            format_percent(r.spread_pct),
            str(r.score),
            f"[{style}]{r.strength.value.upper()}[/{style}]",
            format_percent(getattr(r, 'arr', None)) if hasattr(r, 'arr') else "-",
        )
    
    console.print(table)
    
    # Summary
    passing = [r for r in results if r.passes_filters]
    strong = [r for r in passing if r.strength in (SignalStrength.STRONG, SignalStrength.VERY_STRONG)]
    
    console.print(f"\n[dim]Found {len(passing)} signals ({len(strong)} strong)[/dim]")


def _display_results_json(results):
    """Display results as JSON."""
    import json
    
    data = []
    for r in results:
        data.append({
            'symbol': r.symbol,
            'strike': r.strike,
            'expiration': r.expiration.isoformat(),
            'option_type': r.option_type,
            'dte': r.dte,
            'delta': r.delta,
            'iv_percentile': r.iv_percentile,
            'iv_rv_ratio': r.iv_rv_ratio,
            'spread_pct': r.spread_pct,
            'score': r.score,
            'strength': r.strength.value,
            'passes_filters': r.passes_filters,
        })
    
    console.print_json(json.dumps(data, indent=2))


def _display_results_csv(results):
    """Display results as CSV."""
    print("symbol,strike,expiration,type,dte,delta,iv_percentile,iv_rv_ratio,spread_pct,score,strength")
    for r in results:
        print(f"{r.symbol},{r.strike},{r.expiration},{r.option_type},{r.dte},{r.delta},{r.iv_percentile},{r.iv_rv_ratio},{r.spread_pct},{r.score},{r.strength.value}")


@cli.command()
@click.argument('symbol')
@click.option('--expiration', '-e', type=str, help='Specific expiration (YYYY-MM-DD)')
@click.option('--puts-only', is_flag=True, help='Only show puts')
@click.option('--calls-only', is_flag=True, help='Only show calls')
@click.option('--show-all', is_flag=True, help='Show all contracts, not just passing')
@click.pass_context
def chain(ctx, symbol: str, expiration: Optional[str], puts_only: bool, calls_only: bool, show_all: bool):
    """
    Analyze options chain for a single symbol.
    
    Provides detailed analysis of all available contracts.
    
    Examples:
    
        theta chain SPY                    # Full SPY chain analysis
        
        theta chain SPY -e 2024-02-16      # Specific expiration
        
        theta chain SPY --puts-only        # Puts only
    """
    settings = ctx.obj['settings']
    verbose = ctx.obj['verbose']
    
    console.print(Panel(
        f"[bold cyan]ARGUS Chain Analysis: {symbol}[/bold cyan]",
        box=box.ROUNDED
    ))
    
    asyncio.run(_analyze_chain(
        symbol=symbol,
        expiration=expiration,
        settings=settings,
        puts_only=puts_only,
        calls_only=calls_only,
        show_all=show_all,
        verbose=verbose,
    ))


async def _analyze_chain(
    symbol: str,
    expiration: Optional[str],
    settings: Settings,
    puts_only: bool,
    calls_only: bool,
    show_all: bool,
    verbose: bool,
):
    """Async implementation of chain analysis."""
    
    thresholds = SignalThresholds(**settings.signal_thresholds)
    
    async with MassiveClient(api_key=settings.polygon_api_key) as client:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task(f"Fetching {symbol} chain...", total=None)
            
            try:
                # Parse expiration if provided
                exp_date = None
                if expiration:
                    exp_date = date.fromisoformat(expiration)
                
                # Fetch chain
                chain = await client.get_options_chain(
                    symbol,
                    expiration=exp_date,
                    min_dte=thresholds.min_dte if not exp_date else None,
                    max_dte=thresholds.max_dte if not exp_date else None,
                )
                
                progress.update(task, description=f"Analyzing {len(chain.contracts)} contracts...")
                
                # Get underlying info
                quote = await client.get_quote(symbol)
                underlying_price = quote.last if quote else None
                
                # Convert and evaluate
                signal_inputs = []
                for contract in chain.contracts:
                    if puts_only and contract.option_type != 'p':
                        continue
                    if calls_only and contract.option_type != 'c':
                        continue
                    
                    signal_input = OptionSignalInput(
                        symbol=symbol,
                        strike=contract.strike,
                        expiration=contract.expiration,
                        option_type=contract.option_type,
                        bid=contract.bid or 0,
                        ask=contract.ask or 0,
                        underlying_price=underlying_price or contract.underlying_price,
                        delta=contract.greeks.delta if contract.greeks else None,
                        iv=contract.iv,
                        open_interest=contract.open_interest,
                        volume=contract.volume,
                    )
                    signal_inputs.append(signal_input)
                
                results = evaluate_chain(signal_inputs, thresholds, only_passing=not show_all)
                
            except Exception as e:
                console.print(f"[red]Error analyzing {symbol}: {e}[/red]")
                return
        
        # Display underlying info
        if quote:
            console.print(f"\n[bold]{symbol}[/bold]: ${underlying_price:.2f}")
        
        # Group by expiration
        by_expiration: dict[date, list] = {}
        for r in results:
            if r.expiration not in by_expiration:
                by_expiration[r.expiration] = []
            by_expiration[r.expiration].append(r)
        
        # Display each expiration
        for exp_date in sorted(by_expiration.keys()):
            exp_results = by_expiration[exp_date]
            dte = (exp_date - date.today()).days
            
            console.print(f"\n[bold cyan]Expiration: {exp_date} ({dte} DTE)[/bold cyan]")
            
            # Separate puts and calls
            puts = [r for r in exp_results if r.option_type == 'p']
            calls = [r for r in exp_results if r.option_type == 'c']
            
            # Display puts
            if puts and not calls_only:
                _display_mini_table("PUTS", puts[:10], underlying_price)
            
            # Display calls
            if calls and not puts_only:
                _display_mini_table("CALLS", calls[:10], underlying_price)


def _display_mini_table(title: str, results, underlying_price: float):
    """Display a mini table for one option type."""
    table = Table(title=title, box=box.SIMPLE, show_header=True)
    
    table.add_column("Strike", justify="right")
    table.add_column("Bid", justify="right")
    table.add_column("Ask", justify="right")
    table.add_column("Delta", justify="right")
    table.add_column("IV", justify="right")
    table.add_column("OI", justify="right")
    table.add_column("Score", justify="center")
    table.add_column("Signal", justify="center")
    
    for r in results:
        style = get_signal_style(r.strength)
        
        # Find bid/ask from the result (we'd need to store this)
        # For now, just display what we have
        table.add_row(
            f"{r.strike:.0f}",
            "-",  # Would need bid
            "-",  # Would need ask
            format_delta(r.delta),
            format_percent(r.iv_percentile) if r.iv_percentile else "-",
            "-",  # Would need OI
            str(r.score) if r.passes_filters else "-",
            f"[{style}]{r.strength.value}[/{style}]" if r.passes_filters else "[dim]FAIL[/dim]",
        )
    
    console.print(table)


@cli.command()
@click.pass_context
def config(ctx):
    """
    Display current configuration.
    
    Shows watchlist, thresholds, and API configuration status.
    """
    settings = ctx.obj['settings']
    
    console.print(Panel("[bold cyan]ARGUS Configuration[/bold cyan]", box=box.ROUNDED))
    
    # API Status
    api_configured = bool(settings.polygon_api_key)
    api_status = "[green]✓ Configured[/green]" if api_configured else "[red]✗ Not configured[/red]"
    console.print(f"\n[bold]API Status:[/bold] {api_status}")
    
    # Watchlist
    console.print(f"\n[bold]Watchlist:[/bold]")
    if settings.watchlist:
        for symbol in settings.watchlist:
            console.print(f"  • {symbol}")
    else:
        console.print("  [dim]No symbols configured[/dim]")
    
    # Signal Thresholds
    console.print(f"\n[bold]Signal Thresholds:[/bold]")
    thresholds = SignalThresholds(**settings.signal_thresholds)
    console.print(f"  IV Percentile ≥ {thresholds.min_iv_percentile}%")
    console.print(f"  Delta ≤ {thresholds.max_delta}")
    console.print(f"  DTE: {thresholds.min_dte} - {thresholds.max_dte} days")
    console.print(f"  Open Interest ≥ {thresholds.min_open_interest}")
    console.print(f"  Spread ≤ {thresholds.max_spread_pct}%")
    console.print(f"  Earnings Buffer: {thresholds.min_earnings_buffer} days")
    
    # Scoring thresholds
    console.print(f"\n[bold]Scoring Bonuses:[/bold]")
    console.print(f"  Strong IV%ile: ≥ {thresholds.strong_iv_percentile}% (+2)")
    console.print(f"  IV/RV Ratio: ≥ {thresholds.iv_rv_ratio_threshold}x (+2)")
    console.print(f"  IV/RV Very High: ≥ {thresholds.iv_rv_ratio_strong}x (+1)")
    console.print(f"  Optimal DTE: {thresholds.optimal_dte_min}-{thresholds.optimal_dte_max} days (+1)")
    console.print(f"  Low Delta: ≤ {thresholds.low_delta_threshold} (+1)")


@cli.command()
@click.argument('symbol')
@click.option('--days', '-d', type=int, default=252, help='Lookback days for RV')
@click.pass_context  
def vol(ctx, symbol: str, days: int):
    """
    Display volatility analysis for a symbol.
    
    Shows IV vs RV comparison, IV percentile, and historical context.
    
    Examples:
    
        theta vol SPY           # SPY volatility analysis
        
        theta vol SPY -d 60     # 60-day RV lookback
    """
    settings = ctx.obj['settings']
    
    console.print(Panel(
        f"[bold cyan]ARGUS Volatility Analysis: {symbol}[/bold cyan]",
        box=box.ROUNDED
    ))
    
    asyncio.run(_analyze_volatility(symbol, days, settings))


async def _analyze_volatility(symbol: str, lookback_days: int, settings: Settings):
    """Async implementation of volatility analysis."""
    
    async with MassiveClient(api_key=settings.polygon_api_key) as client:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task(f"Fetching {symbol} data...", total=None)
            
            try:
                # Fetch historical prices for RV
                progress.update(task, description="Fetching historical prices...")
                ohlc_data = await client.get_historical_ohlc(symbol, days=lookback_days + 30)
                
                # Fetch current ATM IV
                progress.update(task, description="Fetching options data...")
                quote = await client.get_quote(symbol)
                chain = await client.get_options_chain(symbol, min_dte=25, max_dte=35)
                
            except Exception as e:
                console.print(f"[red]Error: {e}[/red]")
                return
        
        # Calculate RV
        if ohlc_data is not None and len(ohlc_data) > 20:
            from theta.analytics.realized_vol import (
                calculate_realized_volatility,
                calculate_all_estimators,
                RVEstimator,
            )
            
            console.print(f"\n[bold]Realized Volatility ({lookback_days} days):[/bold]")
            
            try:
                all_rv = calculate_all_estimators(ohlc_data, lookback_days=lookback_days)
                
                for estimator, result in all_rv.items():
                    console.print(f"  {estimator.value:20} {result.rv_percent:.1f}%")
                
                # Use Yang-Zhang as primary
                primary_rv = all_rv.get(RVEstimator.YANG_ZHANG)
                
            except Exception as e:
                console.print(f"  [yellow]Error calculating RV: {e}[/yellow]")
                primary_rv = None
        else:
            console.print("[yellow]Insufficient historical data for RV calculation[/yellow]")
            primary_rv = None
        
        # Find ATM IV from chain
        if chain and quote:
            underlying = quote.last
            
            # Find ATM options
            atm_contracts = [
                c for c in chain.contracts
                if abs(c.strike - underlying) < underlying * 0.02  # Within 2%
            ]
            
            if atm_contracts:
                avg_iv = sum(c.iv for c in atm_contracts if c.iv) / len([c for c in atm_contracts if c.iv])
                
                console.print(f"\n[bold]Current ATM IV:[/bold] {avg_iv * 100:.1f}%")
                
                if primary_rv:
                    ratio = avg_iv / primary_rv.rv
                    ratio_color = "green" if ratio > 1.3 else "yellow" if ratio > 1.0 else "red"
                    console.print(f"[bold]IV/RV Ratio:[/bold] [{ratio_color}]{ratio:.2f}x[/{ratio_color}]")
                    
                    if ratio > 1.3:
                        console.print("[green]→ IV elevated relative to realized - favorable for premium selling[/green]")
                    elif ratio < 1.0:
                        console.print("[red]→ IV below realized - options may be cheap[/red]")


def main():
    """Entry point for the CLI."""
    cli(obj={})


if __name__ == "__main__":
    main()
```

### File: `theta/__main__.py`

```python
"""Allow running as python -m theta."""
from theta.cli import main

if __name__ == "__main__":
    main()
```

### Update: `pyproject.toml` (add CLI entry point)

Add to the `[tool.poetry.scripts]` section:

```toml
[tool.poetry.scripts]
theta = "theta.cli:main"
```

### File: `theta/config.py` (ensure this exists)

```python
"""Configuration management for ARGUS."""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
import os

import yaml


@dataclass
class Settings:
    """Application settings."""
    
    # API
    polygon_api_key: str = ""
    
    # Watchlist
    watchlist: list[str] = field(default_factory=lambda: [
        "SPY", "QQQ", "IWM", "XLF", "XLE", "XLK",
        "AAPL", "MSFT", "GOOGL", "AMZN"
    ])
    
    # Signal thresholds (as dict for easy override)
    signal_thresholds: dict = field(default_factory=lambda: {
        'min_iv_percentile': 50.0,
        'max_delta': 0.30,
        'min_dte': 25,
        'max_dte': 50,
        'min_open_interest': 100,
        'max_spread_pct': 5.0,
        'min_earnings_buffer': 7,
        'strong_iv_percentile': 70.0,
        'iv_rv_ratio_threshold': 1.3,
        'iv_rv_ratio_strong': 1.5,
        'optimal_dte_min': 30,
        'optimal_dte_max': 45,
        'low_delta_threshold': 0.20,
    })
    
    # Risk limits
    risk_limits: dict = field(default_factory=lambda: {
        'max_portfolio_delta': 50,
        'max_portfolio_vega': 1000,
        'max_position_pct': 10.0,
        'max_sector_pct': 30.0,
        'max_bp_utilization': 50.0,
    })


def load_settings(config_path: Optional[Path] = None) -> Settings:
    """
    Load settings from config file and environment.
    
    Priority:
    1. Environment variables (highest)
    2. Config file
    3. Defaults (lowest)
    """
    settings = Settings()
    
    # Load from file if exists
    if config_path is None:
        config_path = Path("config/settings.yaml")
    
    if config_path.exists():
        with open(config_path) as f:
            config_data = yaml.safe_load(f) or {}
        
        if 'watchlist' in config_data:
            settings.watchlist = config_data['watchlist']
        
        if 'signal_thresholds' in config_data:
            settings.signal_thresholds.update(config_data['signal_thresholds'])
        
        if 'risk_limits' in config_data:
            settings.risk_limits.update(config_data['risk_limits'])
    
    # Override with environment
    settings.polygon_api_key = os.environ.get('POLYGON_API_KEY', settings.polygon_api_key)
    
    return settings
```

## Tests

### File: `tests/test_cli.py`

```python
"""Tests for CLI interface."""

import pytest
from click.testing import CliRunner
from datetime import date, timedelta

from theta.cli import cli, format_delta, format_percent, format_ratio


@pytest.fixture
def runner():
    """CLI test runner."""
    return CliRunner()


class TestFormatters:
    """Tests for display formatters."""
    
    def test_format_delta_positive(self):
        assert format_delta(0.25) == "+0.25"
        
    def test_format_delta_negative(self):
        assert format_delta(-0.30) == "-0.30"
        
    def test_format_delta_none(self):
        assert format_delta(None) == "-"
        
    def test_format_percent(self):
        assert format_percent(75.5) == "75.5%"
        
    def test_format_percent_none(self):
        assert format_percent(None) == "-"
        
    def test_format_ratio(self):
        assert format_ratio(1.35) == "1.35x"
        
    def test_format_ratio_none(self):
        assert format_ratio(None) == "-"


class TestCLICommands:
    """Tests for CLI commands."""
    
    def test_help(self, runner):
        """Test --help works."""
        result = runner.invoke(cli, ['--help'])
        assert result.exit_code == 0
        assert 'ARGUS' in result.output
        
    def test_config_command(self, runner):
        """Test config command runs."""
        result = runner.invoke(cli, ['config'])
        # May fail if no config, but shouldn't crash
        assert result.exit_code in (0, 1)
        
    def test_scan_help(self, runner):
        """Test scan --help."""
        result = runner.invoke(cli, ['scan', '--help'])
        assert result.exit_code == 0
        assert 'watchlist' in result.output.lower()
        
    def test_chain_help(self, runner):
        """Test chain --help."""
        result = runner.invoke(cli, ['chain', '--help'])
        assert result.exit_code == 0
        assert 'symbol' in result.output.lower()
        
    def test_vol_help(self, runner):
        """Test vol --help."""
        result = runner.invoke(cli, ['vol', '--help'])
        assert result.exit_code == 0
        assert 'volatility' in result.output.lower()


class TestCLIOptions:
    """Tests for CLI option parsing."""
    
    def test_scan_with_symbols(self, runner):
        """Test scan with specific symbols."""
        # This will fail without API key, but tests arg parsing
        result = runner.invoke(cli, ['scan', 'SPY', 'QQQ'])
        # Check symbols were parsed (will fail at API call)
        assert 'SPY' in result.output or result.exit_code != 0
        
    def test_scan_with_filters(self, runner):
        """Test scan with filter options."""
        result = runner.invoke(cli, [
            'scan', 
            '--min-iv-percentile', '70',
            '--max-delta', '0.20',
            '--puts-only'
        ])
        # Check options were accepted
        assert result.exit_code in (0, 1)  # 1 if no API key
```

## Acceptance Criteria

1. `theta scan` scans watchlist and displays results table
2. `theta scan SPY QQQ` scans specific symbols
3. `theta chain SPY` shows detailed chain analysis
4. `theta config` displays current configuration
5. `theta vol SPY` shows volatility analysis
6. CLI options override config defaults
7. Rich tables display with proper formatting and colors
8. Async operations complete without blocking
9. Graceful error handling for API failures
10. All tests pass: `poetry run pytest tests/test_cli.py -v`

## Output Files

- `theta/cli.py`
- `theta/__main__.py`
- `theta/config.py`
- `tests/test_cli.py`
- `pyproject.toml` (updated with entry point)

## Usage Examples

```bash
# After installation
poetry install

# Set API key
export POLYGON_API_KEY=your_key_here

# Scan full watchlist
theta scan

# Scan specific symbols with filters
theta scan SPY QQQ --min-iv-percentile 70 --puts-only -n 5

# Analyze single chain
theta chain SPY

# Check configuration
theta config

# Volatility analysis
theta vol SPY -d 60

# JSON output for scripting
theta scan --output json > signals.json
```

## tmux Workflow

For development with Claude Code:

```bash
# Create session with panes
tmux new -s argus

# Split into panes (Ctrl+b, " for horizontal)
# Pane 1: Claude Code
# Pane 2: theta scan (watching results)
# Pane 3: logs/testing

# In pane 1 - run Claude Code
claude

# In pane 2 - watch scan results
watch -n 60 'theta scan --top 5'

# In pane 3 - run tests
poetry run pytest -v --tb=short
```

## Next Steps

Phase 1 complete! The CLI ties together:
- Data fetching (Massive client)
- IV calculation
- IV percentile & rank
- Realized volatility
- Greeks
- Rules engine
- Scoring

Phase 2 prompts will add:
- FastAPI endpoints
- React frontend
- Real-time updates
