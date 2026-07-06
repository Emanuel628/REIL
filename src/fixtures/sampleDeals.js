export const strongRentalDeal = {
  dealMode: "investment_rental",
  assetType: "duplex",
  address: "123 Main St, Tampa, FL",
  purchase: {
    askingPrice: 310000,
    offerPrice: 285000,
    closingCosts: 7000,
    downPaymentRate: 0.25,
    rehabBudget: 12000,
    immediateCapex: 8000,
    initialReserves: 8000
  },
  property: {
    units: 2,
    grossLivingArea: 2100,
    ownerOccupiedUnits: 0
  },
  income: {
    monthlyRentByUnit: [1750, 1700],
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
    annualTaxes: 4200,
    annualInsurance: 2600,
    annualRepairsMaintenance: 2800,
    annualManagement: 2484,
    annualUtilitiesOwnerPaid: 1200,
    annualHoaCondoFees: 0,
    annualTurnoverAdmin: 900,
    annualCapexReserve: 1800
  },
  financing: {
    loanAmount: 213750,
    interestRate: 0.0675,
    amortizationYears: 30,
    interestOnlyYears: 0,
    stressInterestRate: 0.0825
  },
  underwriting: {
    supportableValue: 335000,
    asStabilizedValue: 350000,
    targetDscr: 1.25,
    minDscr: 1,
    targetCashOnCash: 0.1,
    passiveAlternativeRate: 0.05,
    requiresRentGrowthToWork: false,
    rentsVerified: true
  },
  dueDiligence: {
    fieldReviewed: true,
    sewerRisk: "low",
    roofYearsRemaining: 10,
    hvacYearsRemaining: 8,
    electricalRisk: "low",
    utilityMetering: "separate",
    neighborhoodScore: 82,
    competitiveSupplyRisk: "low",
    capexAdjustments: []
  }
};

export const failingRentalDeal = {
  dealMode: "investment_rental",
  assetType: "duplex",
  address: "456 Warning Ln, Tampa, FL",
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
    ownerOccupiedUnits: 0
  },
  income: {
    monthlyRentByUnit: [1850, 1750],
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
    sewerRisk: "low",
    roofYearsRemaining: 12,
    hvacYearsRemaining: 6,
    electricalRisk: "low",
    utilityMetering: "separate",
    neighborhoodScore: 78,
    competitiveSupplyRisk: "low",
    capexAdjustments: []
  }
};

export const unrentableSpeculativeDeal = {
  ...strongRentalDeal,
  address: "789 Speculation Ave, Tampa, FL",
  underwriting: {
    ...strongRentalDeal.underwriting,
    rentsVerified: false,
    requiresRentGrowthToWork: true
  }
};
