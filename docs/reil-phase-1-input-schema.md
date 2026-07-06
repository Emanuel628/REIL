# REIL Phase 1 Input Schema

## Purpose

This document defines the Phase 1 data contract for REIL.

It is designed for:

- quick screening
- full underwriting
- scoring
- due diligence adjustments
- house-hack and pure-rental paths

## Deal object

```js
{
  dealMode: "investment_rental", // investment_rental | house_hack_2to4 | value_add_brrrr | hold_refi_1031
  assetType: "duplex", // single_family | townhouse | condo | duplex | triplex | fourplex
  address: "123 Main St, Tampa, FL",
  market: {
    city: "Tampa",
    state: "FL",
    radiusMiles: 1.5,
    compDensity: "urban" // urban | suburban | rural
  },
  purchase: {
    askingPrice: 450000,
    offerPrice: 405000,
    closingCosts: 9000,
    downPaymentRate: 0.25,
    rehabBudget: 35000,
    immediateCapex: 15000,
    initialReserves: 10000
  },
  property: {
    units: 2,
    grossLivingArea: 2200,
    yearBuilt: 1978,
    occupancyRate: 1,
    ownerOccupiedUnits: 0,
    aduPotential: false
  },
  income: {
    monthlyRentByUnit: [1850, 1750],
    marketRentByUnit: [1900, 1800],
    otherMonthlyIncome: {
      parking: 0,
      laundry: 0,
      pet: 50,
      rubs: 0,
      misc: 0
    },
    vacancyRate: 0.05,
    creditLossRate: 0
  },
  expenses: {
    annualTaxes: 6200,
    annualInsurance: 4800,
    annualRepairsMaintenance: 3600,
    annualManagement: 4080,
    annualUtilitiesOwnerPaid: 1800,
    annualHoaCondoFees: 0,
    annualTurnoverAdmin: 1200,
    annualCapexReserve: 2400
  },
  financing: {
    loanAmount: 303750,
    interestRate: 0.0725,
    amortizationYears: 30,
    interestOnlyYears: 0,
    lenderFees: 0,
    stressInterestRate: 0.09
  },
  underwriting: {
    supportableValue: 455000,
    asStabilizedValue: 485000,
    targetDscr: 1.25,
    minDscr: 1,
    targetCashOnCash: 0.1,
    passiveAlternativeRate: 0.05,
    requiresRentGrowthToWork: false,
    rentsVerified: true
  },
  dueDiligence: {
    fieldReviewed: true,
    sewerRisk: "low", // low | medium | high
    roofYearsRemaining: 12,
    hvacYearsRemaining: 6,
    electricalRisk: "low",
    utilityMetering: "separate", // separate | shared
    neighborhoodScore: 78,
    competitiveSupplyRisk: "low",
    capexAdjustments: [
      {
        component: "roof",
        estimatedCost: 0,
        requiredNow: false
      }
    ]
  }
}
```

## Required fields

These are required for any recommendation:

- `dealMode`
- `assetType`
- `purchase.askingPrice`
- `purchase.offerPrice`
- `property.units`
- `income.monthlyRentByUnit` or `income.marketRentByUnit`
- `expenses.annualTaxes`
- `expenses.annualInsurance`
- `financing.interestRate`
- `financing.amortizationYears`
- `underwriting.supportableValue`
- `underwriting.rentsVerified`

## Quick screen minimum fields

Quick screen may run on fewer inputs:

- `assetType`
- `purchase.askingPrice`
- `purchase.offerPrice`
- `property.grossLivingArea`
- `property.units`
- `income.marketRentByUnit`
- `expenses.annualTaxes`
- `expenses.annualInsurance`
- `financing.interestRate`
- `financing.amortizationYears`

When only quick-screen fields are present, REIL must label the result:

- `Preliminary`
- `Not field-verified`
- `Not full underwriting`

## Computed fields

These should not be stored as user-entered values if they can be derived:

- `grossScheduledRent`
- `otherAnnualIncome`
- `effectiveGrossIncome`
- `noi`
- `capRate`
- `monthlyDebtService`
- `annualDebtService`
- `interestOnlyMonthlyDebtService`
- `dscr`
- `stressedDscr`
- `ltv`
- `debtYield`
- `cashInvested`
- `annualLeveredCashFlow`
- `cashOnCashReturn`
- `allInBasis`
- `pricePerSf`
- `benStartingOffer`
- `maximumAllowableOffer`
- `investmentScore`
- `investmentGrade`

## Notes by deal mode

### `investment_rental`

Use full operating underwriting and investment scoring.

### `house_hack_2to4`

Support owner occupancy and a separate measure:

- `ownerHousingCost = housing payment + owner-paid operating share - rents from other units`

This mode should show:

- investment score
- house-hack viability
- estimated owner monthly out-of-pocket

### `value_add_brrrr`

Must support:

- as-is value
- rehab budget
- as-stabilized value
- refinance scenario

### `hold_refi_1031`

Must support:

- stabilized hold performance
- refi proceeds estimate
- 1031 timers when sale is in progress

## Validation rules

- Currency values must be `>= 0`.
- Rates must be stored as decimals, not percentages.
- `property.units` must be `1-4` in Phase 1.
- `monthlyRentByUnit.length` and `marketRentByUnit.length` should equal `property.units` when present.
- `downPaymentRate` must be between `0` and `1`.
- `vacancyRate` and `creditLossRate` must be between `0` and `1`.
- `interestRate` and `stressInterestRate` must be between `0` and `1`.
- `amortizationYears` must be greater than `0`.

## UI output contract

Every analyzed deal should return:

```js
{
  score: 72,
  grade: "yellow",
  hardFail: false,
  reasons: [
    "Supportable value exceeds offer basis.",
    "DSCR is above the target threshold.",
    "CapEx burden remains manageable."
  ],
  warnings: [
    "Vacancy assumption uses fallback market minimum.",
    "Due diligence is not yet field-reviewed."
  ],
  metrics: {
    noi: 28320,
    dscr: 1.31,
    stressedDscr: 1.12,
    cashOnCashReturn: 0.108,
    allInBasis: 469000
  }
}
```
