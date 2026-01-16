# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leave Optimization Planner is a web application that helps corporate employees plan their leaves efficiently. It takes company leave policies and holiday calendars as input, computes optimized leave plans, and presents ranked, explainable results on a calendar UI.

**Status**: Greenfield project - see [docs/prd.md](docs/prd.md) for full requirements.

## Core Domain Concepts

- **Leave Types**: Each has name, priority (lower = preferred), accrual rules (none/monthly/quarterly/yearly), expiry rules, and carryover limits
- **Holiday Calendar**: Fixed-date holidays with locale-based weekend detection
- **Planning Horizon**: Configurable period (default 12 months) for optimization
- **Leave Plans**: Ranked outputs showing date ranges, leave type per day, totals by type, and optimization rationale

## Optimization Engine Requirements

The engine must handle these constraints:
- Leave cannot be used before vesting
- Leave balances cannot go negative
- Holidays and weekends are non-working days

Optimization objectives (weighted):
- Minimize high-priority-cost (paid) leave usage
- Maximize contiguous non-working periods
- Minimize leave expiry waste

**Performance target**: <2 seconds for 12-month horizon with deterministic results.

## Key Edge Cases

- Mid-period accruals (monthly vesting)
- Expiring leaves near year-end
- No feasible zero-paid-leave plan scenarios
- Leap years and locale-specific weekends (some countries have Fri-Sat weekends)

## MVP Scope

In scope:
- Single user leave planning
- Policy-agnostic configuration
- Calendar view with leave suggestions
- Multiple ranked plan comparison

Out of scope for MVP:
- Group/collaborative planning
- Employer administration
- Calendar sync (Google/Outlook)
- AI behavior-based recommendations
