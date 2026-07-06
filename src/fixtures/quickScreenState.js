export function buildQuickScreenState(overrides = {}) {
  return {
    preset: "custom",
    recordName: "",
    address: "",
    assetType: "duplex",
    units: "2",
    askingPrice: "",
    offerPrice: "",
    supportableValue: "",
    asStabilizedValue: "",
    rehabBudget: "",
    immediateCapex: "",
    closingCosts: "",
    initialReserves: "",
    downPaymentRate: "0.25",
    grossLivingArea: "",
    monthlyRent1: "",
    monthlyRent2: "",
    marketRent1: "",
    marketRent2: "",
    otherMonthlyIncome: "",
    annualTaxes: "",
    annualInsurance: "",
    annualRepairsMaintenance: "",
    annualManagement: "",
    annualUtilitiesOwnerPaid: "",
    annualHoaCondoFees: "",
    annualTurnoverAdmin: "",
    annualCapexReserve: "",
    loanAmount: "",
    interestRate: "",
    stressInterestRate: "",
    amortizationYears: "30",
    interestOnlyYears: "0",
    creditLossRate: "0",
    rentsVerified: false,
    requiresRentGrowthToWork: false,
    fieldReviewed: false,
    targetDscr: "1.25",
    targetCashOnCash: "0.10",
    neighborhoodScore: "",
    vacancyRate: "0.05",
    ...overrides
  };
}

export function buildDealFromState(state) {
  return {
    dealMode: "investment_rental",
    assetType: state.assetType || "duplex",
    address: state.address || state.recordName || "Untitled deal",
    purchase: {
      askingPrice: Number(state.askingPrice) || 0,
      offerPrice: Number(state.offerPrice) || 0,
      closingCosts: Number(state.closingCosts) || 0,
      downPaymentRate: Number(state.downPaymentRate) || 0,
      rehabBudget: Number(state.rehabBudget) || 0,
      immediateCapex: Number(state.immediateCapex) || 0,
      initialReserves: Number(state.initialReserves) || 0
    },
    property: {
      units: Number(state.units) || 0,
      grossLivingArea: Number(state.grossLivingArea) || 0,
      ownerOccupiedUnits: 0
    },
    income: {
      monthlyRentByUnit: [Number(state.monthlyRent1) || 0, Number(state.monthlyRent2) || 0],
      marketRentByUnit: [Number(state.marketRent1) || 0, Number(state.marketRent2) || 0],
      otherMonthlyIncome: {
        parking: 0,
        laundry: 0,
        pet: 0,
        rubs: 0,
        misc: Number(state.otherMonthlyIncome) || 0
      },
      vacancyRate: Number(state.vacancyRate) || 0,
      creditLossRate: Number(state.creditLossRate) || 0
    },
    expenses: {
      annualTaxes: Number(state.annualTaxes) || 0,
      annualInsurance: Number(state.annualInsurance) || 0,
      annualRepairsMaintenance: Number(state.annualRepairsMaintenance) || 0,
      annualManagement: Number(state.annualManagement) || 0,
      annualUtilitiesOwnerPaid: Number(state.annualUtilitiesOwnerPaid) || 0,
      annualHoaCondoFees: Number(state.annualHoaCondoFees) || 0,
      annualTurnoverAdmin: Number(state.annualTurnoverAdmin) || 0,
      annualCapexReserve: Number(state.annualCapexReserve) || 0
    },
    financing: {
      loanAmount: Number(state.loanAmount) || 0,
      interestRate: Number(state.interestRate) || 0,
      amortizationYears: Number(state.amortizationYears) || 30,
      interestOnlyYears: Number(state.interestOnlyYears) || 0,
      stressInterestRate: Number(state.stressInterestRate) || 0
    },
    underwriting: {
      supportableValue: Number(state.supportableValue) || 0,
      asStabilizedValue: Number(state.asStabilizedValue) || Number(state.supportableValue) || 0,
      targetDscr: Number(state.targetDscr) || 1.25,
      minDscr: 1,
      targetCashOnCash: Number(state.targetCashOnCash) || 0.1,
      passiveAlternativeRate: 0.05,
      requiresRentGrowthToWork: Boolean(state.requiresRentGrowthToWork),
      rentsVerified: Boolean(state.rentsVerified)
    },
    dueDiligence: {
      fieldReviewed: Boolean(state.fieldReviewed),
      sewerRisk: "low",
      roofYearsRemaining: 0,
      hvacYearsRemaining: 0,
      electricalRisk: "low",
      utilityMetering: "separate",
      neighborhoodScore: Number(state.neighborhoodScore) || 0,
      competitiveSupplyRisk: "low",
      capexAdjustments: []
    }
  };
}
