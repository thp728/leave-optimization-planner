# Product Requirements Document (PRD)

## Product: Leave Optimization Planner (Individual User)

> Proposed Name: OffSeason

---

## 1. Overview

### 1.1 Problem

Corporate employees struggle to plan leaves efficiently due to:

- Complex leave policies (multiple leave types, accruals, expiries)
- Fixed holidays scattered across the year
- Risk of wasting leaves or overusing paid leave
- Manual, error-prone planning using spreadsheets or calendars

### 1.2 Solution

A web application that:

- Takes company leave policies and holiday calendars as input
- Computes an optimized leave plan for an individual employee
- Prioritizes low-cost leaves (casual/sick) and minimizes paid leave usage
- Presents ranked, explainable leave plans on a calendar UI

---

## 2. Goals & Non-Goals

### 2.1 Goals

- Generate optimized leave plans for a single user
- Be policy-agnostic and configurable for most corporate setups
- Provide transparent reasoning for suggested plans
- Support planning over a configurable horizon (default: 12 months)

### 2.2 Non-Goals (MVP)

- Group or collaborative planning
- Employer-side administration or approvals
- Calendar sync (Google/Outlook)
- AI-generated recommendations based on personal behavior

---

## 3. Target Users

- Individual corporate employees
- Knowledge workers with:
  - Multiple leave types
  - Fixed holiday calendars
  - Accruing leave balances

---

## 4. User Flow (MVP)

1. User enters or selects:
   - Holiday calendar
   - Leave types and balances
   - Accrual / vesting rules
2. User sets planning preferences
3. System computes optimized leave plans
4. User views ranked plans in a calendar
5. User optionally tweaks inputs and re-optimizes

---

## 5. Functional Requirements

### 5.1 Leave Policy Configuration

#### Leave Types

Each leave type must support:

- Name (e.g., Casual, Sick, Paid)
- Priority (lower = preferred)
- Accrual rule:
  - None (lump sum)
  - Monthly / quarterly / yearly
- Accrual rate
- Expiry rule (date or none)
- Carryover limit (optional)

#### Holiday Calendar

- Fixed-date holidays
- Weekend detection (locale-based)

---

### 5.2 Planning Preferences

- Planning horizon (e.g., next 6 or 12 months)
- Preferred leave pattern:
  - Long continuous breaks
  - Frequent short breaks
- Maximum acceptable paid leave usage (optional)

---

### 5.3 Optimization Engine

#### Inputs

- Holiday calendar
- Leave policies
- Accrued leave availability over time
- User preferences

#### Constraints

- Leave cannot be used before vesting
- Leave balances cannot go negative
- Holidays and weekends are non-working days

#### Objective (Weighted)

- Minimize high-priority-cost leave usage
- Maximize contiguous non-working periods
- Minimize leave expiry waste

#### Output

- One or more ranked leave plans
- Each plan includes:
  - Date ranges
  - Leave type used per day
  - Total leaves consumed by type
  - Optimization rationale

---

### 5.4 Output Presentation

- Calendar view:
  - Holidays
  - Suggested leave days
  - Continuous breaks highlighted
- Summary panel:
  - Leaves used vs remaining
  - Paid leave consumption
  - Longest break length
- Ability to switch between ranked plans

---

## 6. Non-Functional Requirements

### 6.1 Performance

- Optimization should complete in <2 seconds for 12-month horizon
- Deterministic results for identical inputs

### 6.2 Explainability

- Every plan must explain:
  - Why specific days were chosen
  - Why a leave type was used
- No black-box recommendations

### 6.3 Privacy

- No employer data required
- User data stored locally or minimally server-side
- No mandatory login for MVP

---

## 7. Edge Cases & Constraints

- Mid-period accruals (e.g., monthly vesting)
- Expiring leaves near year-end
- No feasible zero-paid-leave plan
- Leap years and locale-specific weekends

---

## 8. Success Metrics

- User can generate a plan without external tools
- Zero-paid-leave plans found when theoretically possible
- Clear reduction in leave wastage (qualitative feedback)

---

## 9. Future Enhancements (Out of Scope)

- Group leave planning
- Calendar integrations
- Policy templates by company
- Mobile app
- Employer-specific rulesets

---

## 10. Open Questions

- Should preferences be hard constraints or soft weights?
- Should output favor fewer plans or richer comparisons?
- How configurable should defaults be for first-time users?

---
