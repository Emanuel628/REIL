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
    roofYearsRemaining: "",
    roofCondition: "good",
    roofAdjustment: "",
    hvacYearsRemaining: "",
    hvacCondition: "good",
    hvacAdjustment: "",
    sewerRisk: "low",
    sewerAdjustment: "",
    electricalRisk: "low",
    electricalAdjustment: "",
    utilityMetering: "separate",
    utilityAdjustment: "",
    competitiveSupplyRisk: "low",
    fieldNotes: "",
    actualMonthlyRent1: "",
    actualMonthlyRent2: "",
    actualOtherMonthlyIncome: "",
    actualAnnualTaxes: "",
    actualAnnualInsurance: "",
    actualAnnualRepairsMaintenance: "",
    actualAnnualManagement: "",
    actualAnnualUtilitiesOwnerPaid: "",
    actualAnnualHoaCondoFees: "",
    actualAnnualTurnoverAdmin: "",
    actualAnnualCapexReserve: "",
    unit1Number: "1",
    unit1LeaseStart: "",
    unit1LeaseEnd: "",
    unit1DepositHeld: "",
    unit1PaymentStatus: "current",
    unit2Number: "2",
    unit2LeaseStart: "",
    unit2LeaseEnd: "",
    unit2DepositHeld: "",
    unit2PaymentStatus: "current",
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
      sewerRisk: state.sewerRisk || "low",
      roofYearsRemaining: Number(state.roofYearsRemaining) || 0,
      hvacYearsRemaining: Number(state.hvacYearsRemaining) || 0,
      electricalRisk: state.electricalRisk || "low",
      utilityMetering: state.utilityMetering || "separate",
      neighborhoodScore: Number(state.neighborhoodScore) || 0,
      competitiveSupplyRisk: state.competitiveSupplyRisk || "low",
      capexAdjustments: [
        {
          component: "roof",
          age: Number(state.roofYearsRemaining) || 0,
          condition: state.roofCondition || "good",
          adjustment: Number(state.roofAdjustment) || 0,
          estimatedCost: Number(state.roofAdjustment) || 0,
          requiredNow: Number(state.roofAdjustment) > 0
        },
        {
          component: "hvac",
          age: Number(state.hvacYearsRemaining) || 0,
          condition: state.hvacCondition || "good",
          adjustment: Number(state.hvacAdjustment) || 0,
          estimatedCost: Number(state.hvacAdjustment) || 0,
          requiredNow: Number(state.hvacAdjustment) > 0
        },
        {
          component: "sewer",
          age: 0,
          condition: state.sewerRisk || "low",
          adjustment: Number(state.sewerAdjustment) || 0,
          estimatedCost: Number(state.sewerAdjustment) || 0,
          requiredNow: Number(state.sewerAdjustment) > 0
        },
        {
          component: "electrical",
          age: 0,
          condition: state.electricalRisk || "low",
          adjustment: Number(state.electricalAdjustment) || 0,
          estimatedCost: Number(state.electricalAdjustment) || 0,
          requiredNow: Number(state.electricalAdjustment) > 0
        },
        {
          component: "utilities",
          age: 0,
          condition: state.utilityMetering || "separate",
          adjustment: Number(state.utilityAdjustment) || 0,
          estimatedCost: Number(state.utilityAdjustment) || 0,
          requiredNow: Number(state.utilityAdjustment) > 0
        }
      ]
    }
  };
}
