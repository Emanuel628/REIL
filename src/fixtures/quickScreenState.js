import { strongRentalDeal } from "./sampleDeals.js";

export function cloneDeal(deal) {
  return structuredClone(deal);
}

export function buildQuickScreenState(deal = strongRentalDeal) {
  return {
    preset: "custom",
    askingPrice: deal.purchase.askingPrice,
    offerPrice: deal.purchase.offerPrice,
    supportableValue: deal.underwriting.supportableValue,
    rehabBudget: deal.purchase.rehabBudget,
    immediateCapex: deal.purchase.immediateCapex,
    grossLivingArea: deal.property.grossLivingArea,
    monthlyRent1: deal.income.monthlyRentByUnit[0] ?? 0,
    monthlyRent2: deal.income.monthlyRentByUnit[1] ?? 0,
    annualTaxes: deal.expenses.annualTaxes,
    annualInsurance: deal.expenses.annualInsurance,
    annualRepairsMaintenance: deal.expenses.annualRepairsMaintenance,
    annualManagement: deal.expenses.annualManagement,
    annualUtilitiesOwnerPaid: deal.expenses.annualUtilitiesOwnerPaid,
    annualTurnoverAdmin: deal.expenses.annualTurnoverAdmin,
    annualCapexReserve: deal.expenses.annualCapexReserve,
    loanAmount: deal.financing.loanAmount,
    interestRate: deal.financing.interestRate,
    stressInterestRate: deal.financing.stressInterestRate,
    amortizationYears: deal.financing.amortizationYears,
    rentsVerified: deal.underwriting.rentsVerified,
    requiresRentGrowthToWork: deal.underwriting.requiresRentGrowthToWork,
    fieldReviewed: deal.dueDiligence.fieldReviewed,
    neighborhoodScore: deal.dueDiligence.neighborhoodScore,
    vacancyRate: deal.income.vacancyRate
  };
}

export function buildDealFromState(state) {
  const baseDeal = cloneDeal(strongRentalDeal);

  baseDeal.purchase.askingPrice = Number(state.askingPrice);
  baseDeal.purchase.offerPrice = Number(state.offerPrice);
  baseDeal.purchase.rehabBudget = Number(state.rehabBudget);
  baseDeal.purchase.immediateCapex = Number(state.immediateCapex);
  baseDeal.property.grossLivingArea = Number(state.grossLivingArea);
  baseDeal.income.monthlyRentByUnit = [Number(state.monthlyRent1), Number(state.monthlyRent2)];
  baseDeal.income.vacancyRate = Number(state.vacancyRate);
  baseDeal.expenses.annualTaxes = Number(state.annualTaxes);
  baseDeal.expenses.annualInsurance = Number(state.annualInsurance);
  baseDeal.expenses.annualRepairsMaintenance = Number(state.annualRepairsMaintenance);
  baseDeal.expenses.annualManagement = Number(state.annualManagement);
  baseDeal.expenses.annualUtilitiesOwnerPaid = Number(state.annualUtilitiesOwnerPaid);
  baseDeal.expenses.annualTurnoverAdmin = Number(state.annualTurnoverAdmin);
  baseDeal.expenses.annualCapexReserve = Number(state.annualCapexReserve);
  baseDeal.financing.loanAmount = Number(state.loanAmount);
  baseDeal.financing.interestRate = Number(state.interestRate);
  baseDeal.financing.stressInterestRate = Number(state.stressInterestRate);
  baseDeal.financing.amortizationYears = Number(state.amortizationYears);
  baseDeal.underwriting.supportableValue = Number(state.supportableValue);
  baseDeal.underwriting.rentsVerified = Boolean(state.rentsVerified);
  baseDeal.underwriting.requiresRentGrowthToWork = Boolean(state.requiresRentGrowthToWork);
  baseDeal.dueDiligence.fieldReviewed = Boolean(state.fieldReviewed);
  baseDeal.dueDiligence.neighborhoodScore = Number(state.neighborhoodScore);

  return baseDeal;
}
