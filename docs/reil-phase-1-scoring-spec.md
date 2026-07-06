# REIL Phase 1 Scoring Spec

## Purpose

This document defines the scoring model used to turn underwriting results into:

- a numeric score
- a color grade
- a pass / caution / fail recommendation

The score is not allowed to override hard underwriting failures.

## Output shape

```js
{
  score: 0,
  grade: "red", // green | yellow | caution | red
  hardFail: true,
  failBanner: "If it don't make sense, it don't make dollars.",
  bucketScores: {
    cashFlowAndDscr: 0,
    priceVsValue: 0,
    capexRisk: 0,
    financingResilience: 0,
    rentAndMarketSupport: 0,
    strategyFit: 0
  },
  reasons: [],
  warnings: [],
  failedChecks: []
}
```

## Color bands

- `80-100` = `green`
- `65-79` = `yellow`
- `50-64` = `caution`
- `0-49` = `red`

If any hard fail condition is true, force:

- `grade = red`
- `hardFail = true`

## Weighted buckets

Total possible score: `100`

- `30` points: cash flow and DSCR quality
- `20` points: entry price versus supportable value
- `15` points: CapEx and physical risk
- `15` points: financing resilience
- `10` points: rent and market support
- `10` points: strategy fit and exit optionality

## Bucket logic

### 1. Cash flow and DSCR quality (`30`)

Recommended point logic:

- `0` if stabilized cash flow is negative
- `0` if DSCR < `1.00`
- `10` if DSCR is `1.00 - 1.149`
- `20` if DSCR is `1.15 - 1.249`
- `25` if DSCR is `1.25 - 1.399`
- `30` if DSCR >= `1.40`

Add a downward adjustment of up to `5` points if annual levered cash flow is weak relative to invested cash.

### 2. Entry price versus supportable value (`20`)

Measure:

`marginOfSafety = (supportableValue - allInBasis) / supportableValue`

Suggested points:

- `0` if margin of safety is negative
- `5` if `0 - 4.99%`
- `10` if `5 - 9.99%`
- `15` if `10 - 14.99%`
- `20` if `>= 15%`

### 3. CapEx and physical risk (`15`)

Base this on:

- immediate CapEx burden
- required-now repairs
- due-diligence risk flags
- shared utility drag

Suggested points:

- `0-4` = severe physical risk
- `5-9` = notable but manageable risk
- `10-12` = moderate or light risk
- `13-15` = clean physical profile

### 4. Financing resilience (`15`)

Base this on:

- stressed DSCR
- LTV
- dependence on IO to create positive optics

Suggested points:

- `0` if stressed DSCR < `1.00`
- `5` if stressed DSCR is `1.00 - 1.099`
- `10` if stressed DSCR is `1.10 - 1.249`
- `15` if stressed DSCR >= `1.25`

Reduce points if:

- LTV > `80%`
- the deal only works under interest-only cash flow

### 5. Rent and market support (`10`)

Base this on:

- verified rents
- realistic vacancy assumptions
- neighborhood support
- competitive supply risk

Suggested points:

- `0-2` = weak rent support or speculative
- `3-5` = mixed support
- `6-8` = good support
- `9-10` = strong support and low supply risk

### 6. Strategy fit and exit optionality (`10`)

Base this on:

- whether the deal clearly fits its intended strategy
- refinance path
- 1031 or disposition flexibility
- house-hack utility where relevant

Suggested points:

- `0-2` = unclear strategy
- `3-5` = works but constrained
- `6-8` = clear strategy
- `9-10` = strong optionality

## Hard fail conditions

Any of these forces `hardFail = true`:

- stabilized monthly cash flow `< 0`
- `DSCR < 1.00`
- `stressed DSCR < 1.00`
- `underwriting.rentsVerified === false`
- `requiresRentGrowthToWork === true`
- `allInBasis > supportableValue` with no strong value-add offset
- required-now CapEx wipes out margin of safety
- positive recommendation depends on IO debt service instead of amortizing debt service

## Reason generation rules

The scoring engine must output human-readable reasons.

Examples:

- `Deal basis is below supportable value.`
- `Stressed DSCR remains above break-even.`
- `Immediate CapEx burden is too high for the spread.`
- `Rents are not sufficiently supported.`

## Warning generation rules

Warnings are not hard failures.

Examples:

- `Vacancy assumption uses fallback minimum.`
- `Insurance expense may be understated for this market.`
- `Shared utilities reduce tenant bill-back flexibility.`

## Recommendation behavior

### Green

Use for deals that:

- pass all hard rules
- show real cash flow
- maintain resilience under stress
- have acceptable physical risk

### Yellow

Use for deals that:

- pass, but with thinner margin
- need closer review
- depend on some assumptions that are supported but not ideal

### Caution

Use for deals that:

- are not yet dead
- but need a meaningful basis change, scope change, or expense correction

### Red

Use for deals that:

- fail one or more hard rules
- or are clearly inferior relative to safer capital uses

## UI fail-state requirement

If `hardFail === true`, show:

`If it don't make sense, it don't make dollars.`
