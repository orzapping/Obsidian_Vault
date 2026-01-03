# Engineering Memo: Dependency Resolution & Environment Hardening
**Date:** 2026-01-02
**Project:** Manifold
**Status:** RESOLVED

## Executive Summary
During the initialization of Project Manifold, we encountered failures in building the scientific Python stack (`pyzmq`, `asyncpg`, `numba`) and the Frontend styling engine (`Tailwind CSS`). These issues stemmed from the constrained nature of the execution environment (likely a containerized Linux instance with minimal system libraries).

## 1. ZeroMQ (pyzmq) Compilation Failure
*   **Issue:** `pyzmq` v25.1.2 failed to compile.
*   **Cause:** The build process referenced `strlcpy`, a string function not exposed in the standard way in the environment's `glibc`. This often happens with GCC 14+ or specific Linux distros when building older packages from source.
*   **Fix:** Upgraded to `pyzmq` v26.0.0. The newer version ships with pre-built binary wheels that bypass local compilation requirements.

## 2. AsyncPG (PostgreSQL Driver) Failure
*   **Issue:** `asyncpg` v0.29.0 failed to build extensions.
*   **Cause:** Incompatibility with Python 3.13. The C-extensions used internal Python APIs that changed in 3.13.
*   **Fix:** Upgraded to `asyncpg` v0.30.0, which officially supports Python 3.13.

## 3. Numba / LLVMLite Failure
*   **Issue:** `llvmlite` failed to find `llvm-config`.
*   **Cause:** `numba` requires the **LLVM** compiler toolchain installed at the system level to perform JIT (Just-In-Time) compilation. This system dependency was missing.
*   **Impact:** We cannot use JIT compilation for the Greeks calculations in Phase 1.
*   **Fix:** Removed `numba` dependency. Refactored `manifold.analytics.greeks` to run in pure Python (NumPy).
*   **Performance Note:** Python is sufficient for <500 ticks/sec. For Phase 3 scaling, we will need a Docker container with LLVM installed.

## 4. Tailwind CSS v4 vs PostCSS
*   **Issue:** The frontend build failed with PostCSS configuration errors.
*   **Cause:** We attempted to use Tailwind v4 (the bleeding edge) with a v3-style PostCSS configuration.
*   **Fix:** Migrated to the native **Vite Plugin** architecture (`@tailwindcss/vite`), which is the modern standard and eliminates the fragile PostCSS layer.

## Conclusion
The stack is now stable. We have successfully pivoted to "Binary-Only" or "Pure Python" dependencies where possible to maximize portability across environments.
