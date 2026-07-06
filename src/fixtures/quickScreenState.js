export function buildQuickScreenState(overrides = {}) {
  return {
    preset: "custom",
    recordName: "",
    address: "",
    askingPrice: "",
    offerPrice: "",
    supportableValue: "",
    rehabBudget: "",
    immediateCapex: "",
    grossLivingArea: "",
    monthlyRent1: "",
    monthlyRent2: "",
    annualTaxes: "",
    annualInsurance: "",
    annualRepairsMaintenance: "",
    annualManagement: "",
    annualUtilitiesOwnerPaid: "",
    annualTurnoverAdmin: "",
    annualCapexReserve: "",
    loanAmount: "",
    interestRate: "",
    stressInterestRate: "",
    amortizationYears: "30",
    rentsVerified: false,
    requiresRentGrowthToWork: false,
    fieldReviewed: false,
    neighborhoodScore: "",
    vacancyRate: "0.05",
    ...overrides
  };
}

export function buildDealFromState(state) {
  return {
    dealMode: "investment_rental",
    assetType: "duplex",
    address: state.address || state.recordName || "Untitled deal",
    purchase: {
      askingPrice: Number(state.askingPrice) || 0,
      offerPrice: Number(state.offerPrice) || 0,
      closingCosts: 0,
      downPaymentRate: 0,
      rehabBudget: Number(state.rehabBudget) || 0,
      immediateCapex: Number(state.immediateCapex) || 0,
      initialReserves: 0
    },
    property: {
      units: 2,
      grossLivingArea: Number(state.grossLivingArea) || 0,
      ownerOccupiedUnits: 0
    },
    income: {
      monthlyRentByUnit: [Number(state.monthlyRent1) || 0, Number(state.monthlyRent2) || 0],
      otherMonthlyIncome: {
        parking: 0,
        laundry: 0,
        pet: 0,
        rubs: 0,
        misc: 0
      },
      vacancyRate: Number(state.vacancyRate) || 0,
      creditLossRate: 0
    },
    expenses: {
      annualTaxes: Number(state.annualTaxes) || 0,
      annualInsurance: Number(state.annualInsurance) || 0,
      annualRepairsMaintenance: Number(state.annualRepairsMaintenance) || 0,
      annualManagement: Number(state.annualManagement) || 0,
      annualUtilitiesOwnerPaid: Number(state.annualUtilitiesOwnerPaid) || 0,
      annualHoaCondoFees: 0,
      annualTurnoverAdmin: Number(state.annualTurnoverAdmin) || 0,
      annualCapexReserve: Number(state.annualCapexReserve) || 0
    },
    financing: {
      loanAmount: Number(state.loanAmount) || 0,
      interestRate: Number(state.interestRate) || 0,
      amortizationYears: Number(state.amortizationYears) || 30,
      interestOnlyYears: 0,
      stressInterestRate: Number(state.stressInterestRate) || 0
    },
    underwriting: {
      supportableValue: Number(state.supportableValue) || 0,
      asStabilizedValue: Number(state.supportableValue) || 0,
      targetDscr: 1.25,
      minDscr: 1,
      targetCashOnCash: 0.1,
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
