# REIL Underwriting Source of Truth

Research date: July 6, 2026

## Purpose

This document is the underwriting doctrine for REIL.

It replaces the earlier draft spec as the primary source of truth for:

- acquisition screening
- full underwriting
- due diligence
- financing stress testing
- refinance / BRRRR logic
- 1031 timing
- red / yellow / green deal scoring

The target assets for Phase 1 are:

- single-family rentals
- townhomes and condos used as rentals
- duplexes
- triplexes
- fourplexes
- owner-occupied 2-4 unit house hacks

This system is **Ben Mallah-inspired**, but **not Ben Mallah-dependent**. Ben supplies the operating philosophy. Official and lender-grade sources supply the hard math and compliance rules.

## Evidence hierarchy

REIL should trust sources in this order:

### Tier A: Hard rules

- IRS guidance
- HUD / FHA guidance
- Fannie Mae and Freddie Mac underwriting guidance
- bank regulatory guidance such as OCC / Federal Reserve

These define timing rules, depreciation rules, and conservative debt logic.

### Tier B: Ben Mallah primary sources

- BenMallah.com pages
- Ben Mallah YouTube channel pages

These define style, priorities, and heuristics.

### Tier C: Transcript and summary sources about Ben

- podcast transcript pages
- video summary pages

These are useful for extracting patterns in his thinking, but they are not binding legal, tax, or lending authority.

## Ben Mallah doctrine: what is consistent across his public guidance

The following points show up repeatedly in Ben Mallah's own site and public interviews.

### 1. Know the numbers before emotion enters the room

Ben's own consulting pages repeatedly instruct people to know:

- purchase price
- insurance
- property taxes
- renovation cost
- deal income and expenses

That is consistent with a numbers-first acquisition process, not a story-first process.

### 2. Cash flow matters more than hope

Ben repeatedly frames bad deals as deals that stop working when rates move, refinancing gets harder, or operating costs rise. His worldview is not appreciation-first. It is cash-flow-first with upside.

### 3. Lowballing is a tactic, not the investment thesis

Ben publicly says he often offers around 25% below ask on average. The important part is not the exact percentage. The important part is:

- the offer is based on underwriting
- the offer is unemotional
- repairs, credits, and cap improvements are part of price discovery

REIL should therefore treat low offers as a negotiation heuristic, not a universal formula.

### 4. Value-add is central

Ben's public materials consistently point toward:

- buying mismanaged or underperforming property
- improving operations or the physical plant
- forcing value
- refinancing or exchanging into the next deal

### 5. 1031 exchanges are a core compounding mechanism

Ben has directly credited 1031 exchanges as a major reason he was able to keep capital rolling instead of paying tax and resetting smaller.

### 6. Compare effort and risk against passive alternatives

Ben explicitly compares real estate returns against tax-free municipal bonds. That means REIL should not only ask, "Is this profitable?" It should also ask, "Is this worth the operational pain relative to safer alternatives?"

### 7. Local knowledge matters

Ben's own operating footprint is heavily Florida-focused, and his public guidance is highly practical and market-specific. This supports localized comp analysis rather than broad citywide assumptions.

## What REIL accepts from Ben

These are accepted as valid product principles:

- buy with numbers, not emotion
- underwrite to actual or supportable income
- normalize expenses
- require physical due diligence
- model repair credits and CapEx explicitly
- test whether cash flow survives worse financing conditions
- prefer a clear value-add path
- treat refinancing and 1031s as part of the strategy stack
- compare return against safer alternatives

## What REIL does not accept from Ben as hard law

These ideas may be useful heuristics, but they are not universal truths:

- always offer 25% below asking price
- always use a 1-2 mile radius for comps
- always use price per square foot as a primary buy decision
- always prefer interest-only debt
- modular construction will cut costs in half
- a deal is good just because it has "upside"

These can exist in the app as optional strategy presets, not core underwriting law.

## Hard underwriting truths REIL will use

## 1. Separate screening from underwriting

REIL must have two modes:

- `Quick Screen`: fast triage using limited inputs
- `Full Underwrite`: full rent, expense, debt, CapEx, and exit analysis

A property can pass screening and still fail underwriting.

## 2. Separate owner-occupied house hacks from pure investments

A duplex or fourplex purchased as a principal residence is not underwritten the same way as a pure investment property.

REIL must support at least these deal modes:

- `Investment Rental`
- `House Hack 2-4 Unit`
- `Value-Add / BRRRR`
- `Hold for Refi / 1031`

## 3. Support localized comping, but do not hard-code one radius

The earlier draft used a 1-2 mile radius as a universal rule. That is too rigid.

REIL should:

- default to local radius-based comping
- let the radius vary by density and asset type
- let the user override it
- keep sold comps, active comps, and rent comps separate

Price per square foot is only a screening signal. It is not enough to approve a deal.

## 4. Use verified or supportable rents, not seller fantasy

For full underwriting, rents must come from one of:

- in-place leases
- rent roll
- market rent support
- appraiser-supported market rent

Seller pro formas cannot be treated as truth.

## 5. Distinguish lender qualifying rent from operating underwriting rent

These are not the same thing.

For qualifying rental income, Fannie Mae states that lenders often use `75%` of gross monthly rent, with the remaining `25%` absorbed by vacancy and ongoing maintenance.

For operating underwriting, REIL should not blindly use `25%` as a vacancy assumption. Instead it should use:

- actual vacancy if stabilized history exists
- appraiser or market vacancy if available
- a conservative floor when no better data exists

For small multifamily, Freddie Mac guidance supports underwriting physical vacancy at the greatest of:

- `5%`
- actual physical vacancy
- appraiser vacancy
- supported market vacancy

That is a better fallback rule for operating analysis than a fixed 25% haircut.

## 6. NOI must exclude debt service, income taxes, and depreciation

REIL uses:

`NOI = Effective Gross Income - Operating Expenses`

Where operating expenses include recurring ownership and operation costs, such as:

- property taxes
- insurance
- repairs and maintenance
- management
- utilities paid by owner
- HOA or condo fees if owner-paid
- turnover / admin reserves when relevant

NOI does not include:

- mortgage principal and interest
- owner income taxes
- depreciation
- one-time renovation cost

CapEx reserves should be modeled separately and also reflected in cash flow and risk scoring.

## 7. DSCR must be calculated on amortizing debt service, even if the loan has an IO period

This is a major correction.

Fannie Mae multifamily guidance states that when calculating underwritten DSCR for a loan with an interest-only period, debt service should still be based on a level payment including amortization.

That means:

- IO can be shown as a short-term cash flow view
- IO should not be the sole basis for saying a deal "works"
- the core pass/fail underwriting should use amortizing debt service

## 8. LTV and DSCR thresholds are baselines, not magic numbers

Common small multifamily lender baselines include:

- `80%` maximum LTV for many conventional stabilized executions
- `1.25x` minimum DSCR for many conventional executions

These are common market anchors, not laws of physics.

REIL should use them as a baseline reference band:

- above the band: stronger
- near the band: caution
- below the band: elevated risk or fail, depending on context

## 9. Debt yield belongs in the advanced view

The OCC defines debt yield as:

`Debt Yield = NOI / Loan Amount`

It is useful because it does not depend on interest rate, amortization period, or cap rate.

For 1-4 unit property, debt yield should be an advanced metric, not the lead screen. For 5+ units later, it becomes more important.

## 10. 1031 timing is hard-coded law

For deferred exchanges, IRS rules require:

- identification within `45 days`
- receipt of replacement property within `180 days` or earlier tax-return deadlines where applicable

REIL should track these as legal timers, not soft reminders.

## 11. Residential rental depreciation is real, but should be treated carefully

IRS Publication 527 states residential rental property is generally depreciated over `27.5 years` under GDS.

REIL may show estimated depreciation benefit, but must label it as:

- estimate only
- dependent on basis allocation
- not tax advice

## 12. House hacking is real and should be supported explicitly

HUD states FHA loans can be available on `1-4 unit` properties with down payments as low as `3.5%`.

Fannie Mae also separately recognizes `2-4 unit primary residence` rental income treatment.

This validates house hacking as a real Phase 1 use case. It should not be treated as a workaround or side feature.

## REIL underwriting doctrine

The app should answer one question:

`Does this property make sense as an investment under realistic numbers, realistic risk, and realistic financing?`

If the answer is no, REIL should say so plainly.

### Core doctrine

REIL approves deals that satisfy all of the following:

1. The purchase basis is justified by current condition, supportable rents, and local comps.
2. Stabilized cash flow is positive after realistic operating expenses.
3. The deal still works under a financing stress case.
4. Near-term CapEx risk does not erase the equity thesis.
5. The strategy path is clear:
   acquisition only, house hack, value-add, refinance, or 1031 hold.
6. The projected reward is meaningfully better than passive alternatives.

If a property fails those tests, the app should not soften the answer.

## Hard fail conditions

Any one of these should trigger a red fail state:

- negative stabilized monthly cash flow
- DSCR below `1.00x` on amortizing debt
- stressed DSCR below `1.00x`
- unsupported rent assumptions
- all-in basis plus required repairs materially exceeds supportable value with no clear recovery path
- near-term CapEx exposure overwhelms reserves or deal margin
- rent growth assumptions are required to make the deal work
- buyer is relying on interest-only debt to create the appearance of safety

When a hard fail occurs, show a flashing red label:

`If it don't make sense, it don't make dollars.`

This should not be decorative. It is the plain-language output for a failed investment thesis.

## Suggested score model for Phase 1

REIL should score deals from `0-100`.

### Weighted score buckets

- `30` points: cash flow and DSCR quality
- `20` points: entry price versus supportable value
- `15` points: CapEx and physical-risk profile
- `15` points: financing resilience
- `10` points: rent support and micro-market quality
- `10` points: strategy fit and exit optionality

### Suggested color bands

- `80-100`: Green
- `65-79`: Yellow
- `50-64`: Orange-red caution
- `0-49`: Red

### Important scoring rule

Hard fail conditions override the weighted score.

Example:

- a property could numerically score `68`
- but if stressed DSCR is below `1.00x`, it must still display as red fail

## Phase 1 formulas

These formulas are safe to use as the initial math engine.

### Price and basis

- `All-In Basis = Purchase Price + Closing Costs + Immediate Rehab + Required CapEx`
- `Price Per SF = Purchase Price / Gross Living Area`

### Rent and income

- `Gross Scheduled Rent = Sum of monthly market or in-place rents x 12`
- `Other Income = parking + laundry + pet + RUBS + misc verified income`
- `Effective Gross Income = Gross Scheduled Rent + Other Income - Vacancy/Credit Loss`

### Operating performance

- `NOI = Effective Gross Income - Operating Expenses`
- `Cap Rate = NOI / Purchase Price`
- `CapEx Reserve Ratio = Annual CapEx Reserve / Gross Scheduled Rent`

### Debt

- `Annual Debt Service = 12 x monthly amortizing payment`
- `DSCR = NOI / Annual Debt Service`
- `LTV = Loan Amount / As-Is or As-Stabilized Value`
- `Debt Yield = NOI / Loan Amount`

### Equity and return

- `Cash Invested = Down Payment + Closing Costs + Rehab + Initial Reserves`
- `Annual Levered Cash Flow = NOI - Annual Debt Service - Annual CapEx Reserve`
- `Cash on Cash Return = Annual Levered Cash Flow / Cash Invested`

### Ben-style initial offer heuristic

REIL may optionally display:

- `Ben Starting Offer = Asking Price x 0.75`

But it must be labeled:

- negotiation heuristic
- not underwriting truth
- overrideable

### Maximum allowable offer

REIL should not anchor on ask.

Instead:

`Maximum Allowable Offer = Value supported by target DSCR, target yield, repair burden, and required margin of safety`

This is the number that actually matters.

## What changed from the earlier draft

The earlier draft had the right spirit but mixed real underwriting with loose heuristics.

Corrections:

- `25% below ask` moved from rule to optional tactic
- `1-2 mile radius` moved from rule to configurable comp scope
- `20% below local price per SF` moved from buy trigger to screen-only signal
- `interest-only cash flow` moved from primary truth to secondary scenario
- `modular cuts cost in half` removed as a hard assumption
- `seller numbers` removed as trustworthy defaults
- `DSCR` tied to amortizing debt, not IO payment shortcuts

## Product rules implied by this doctrine

### The app should say no clearly

REIL is not a hype machine. It is a filter.

If the deal fails, the interface should do three things:

- turn the recommendation red
- show the specific failure reasons
- display the flashing label: `If it don't make sense, it don't make dollars.`

### The app should explain why a deal passed or failed

Every recommendation should show:

- score
- color band
- top positive drivers
- top failure drivers
- key stressed metric changes

### The app should separate "numbers mode" from "strategy mode"

Numbers mode:

- input
- expenses
- debt
- DSCR
- cash flow

Strategy mode:

- house hack
- value-add
- refi
- 1031
- ADU or expansion upside

Upside should never rescue a deal that already fails the core numbers.

## Sources

Ben Mallah primary and near-primary sources:

- https://benmallah.com/
- https://benmallah.com/phone-call-with-ben
- https://benmallah.com/phone-call-with-ben-6578
- https://benmallah.com/shadow-mentor-real-estate-investor
- https://benmallah.com/masterclass22
- https://www.youtube.com/channel/UC94m18wtI9QAYrXKXqFPWDg
- https://pod.wave.co/podcast/the-iced-coffee-hour/im-selling-everything-why-ben-mallah-is-cashing-out-of-real-estate-c0bf4668
- https://summify.io/discover/meet-the-250-000-000-man-2h5zNB
- https://www.instagram.com/realbenmallah/
- https://www.facebook.com/BenMallahLife/videos/i-am-checking-out-shopping-center-and-multifamily-investments-realestateinvestin/3959336824370139/

Authoritative underwriting, tax, and housing sources:

- https://www.irs.gov/instructions/i8824
- https://www.irs.gov/publications/p527
- https://www.hud.gov/helping-americans/loans
- https://www.hud.gov/sites/default/files/OCHCO/documents/40001-hsgh-Update-17.pdf
- https://selling-guide.fanniemae.com/sel/b3-3.8-01/rental-income
- https://mfguide.fanniemae.com/node/10786
- https://mfguide.fanniemae.com/node/3781
- https://multifamily.fanniemae.com/financing-options/small-loans/small-mortgage-loan-program-term-sheet
- https://multifamily.fanniemae.com/financing-options/fixed-rate-mortgage-loans-term-sheet
- https://mf.freddiemac.com/docs/%20sbl_update_06282024.pdf
- https://mf.freddiemac.com/docs/product/sbl_term_sheet_landingPage.pdf
- https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate-previous.pdf
