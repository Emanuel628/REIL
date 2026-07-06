const DEFAULT_THRESHOLDS = {
  minVacancyFloor: 0.05,
  targetDscr: 1.25,
  minDscr: 1,
  strongDscr: 1.4,
  maxLtv: 0.8,
  targetCashOnCash: 0.1,
  passiveAlternativeRate: 0.05,
  strongNeighborhoodScore: 80,
  acceptableNeighborhoodScore: 65
};

const FAIL_BANNER = "If it don't make sense, it don't make dollars.";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((toNumber(value) + Number.EPSILON) * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sum(values = []) {
  return values.reduce((total, value) => total + toNumber(value), 0);
}

function percentage(value, base) {
  if (!base) {
    return 0;
  }

  return toNumber(value) / toNumber(base);
}

function getVacancyRate(income = {}, thresholds = DEFAULT_THRESHOLDS) {
  const vacancyRate = toNumber(income.vacancyRate, thresholds.minVacancyFloor);
  return Math.max(vacancyRate, thresholds.minVacancyFloor);
}

function getCreditLossRate(income = {}) {
  return clamp(toNumber(income.creditLossRate, 0), 0, 1);
}

function getMonthlyRents(income = {}) {
  const monthlyRentByUnit = Array.isArray(income.monthlyRentByUnit) ? income.monthlyRentByUnit : [];
  const marketRentByUnit = Array.isArray(income.marketRentByUnit) ? income.marketRentByUnit : [];
  return monthlyRentByUnit.length > 0 ? monthlyRentByUnit : marketRentByUnit;
}

export function getGrossScheduledRent(deal) {
  return sum(getMonthlyRents(deal?.income)) * 12;
}

export function getOtherAnnualIncome(deal) {
  const otherIncome = deal?.income?.otherMonthlyIncome ?? {};
  return sum(Object.values(otherIncome)) * 12;
}

export function getVacancyCreditLoss(deal, thresholds = DEFAULT_THRESHOLDS) {
  const grossIncome = getGrossScheduledRent(deal) + getOtherAnnualIncome(deal);
  const vacancyRate = getVacancyRate(deal?.income, thresholds);
  const creditLossRate = getCreditLossRate(deal?.income);
  return grossIncome * (vacancyRate + creditLossRate);
}

export function getEffectiveGrossIncome(deal, thresholds = DEFAULT_THRESHOLDS) {
  return getGrossScheduledRent(deal) + getOtherAnnualIncome(deal) - getVacancyCreditLoss(deal, thresholds);
}

export function getOperatingExpenses(deal) {
  const expenses = deal?.expenses ?? {};
  return sum([
    expenses.annualTaxes,
    expenses.annualInsurance,
    expenses.annualRepairsMaintenance,
    expenses.annualManagement,
    expenses.annualUtilitiesOwnerPaid,
    expenses.annualHoaCondoFees,
    expenses.annualTurnoverAdmin
  ]);
}

export function getAnnualCapexReserve(deal) {
  return toNumber(deal?.expenses?.annualCapexReserve, 0);
}

export function getNoi(deal, thresholds = DEFAULT_THRESHOLDS) {
  return getEffectiveGrossIncome(deal, thresholds) - getOperatingExpenses(deal);
}

export function getCapRate(deal, thresholds = DEFAULT_THRESHOLDS) {
  return percentage(getNoi(deal, thresholds), toNumber(deal?.purchase?.offerPrice, 0));
}

export function getAllInBasis(deal) {
  const purchase = deal?.purchase ?? {};
  return sum([
    purchase.offerPrice,
    purchase.closingCosts,
    purchase.rehabBudget,
    purchase.immediateCapex
  ]);
}

export function getPricePerSf(deal) {
  return percentage(toNumber(deal?.purchase?.offerPrice, 0), toNumber(deal?.property?.grossLivingArea, 0));
}

export function getMonthlyDebtService(loanAmount, annualRate, amortizationYears) {
  const principal = toNumber(loanAmount, 0);
  const rate = toNumber(annualRate, 0);
  const periods = Math.max(toNumber(amortizationYears, 0) * 12, 0);

  if (!principal || !periods) {
    return 0;
  }

  if (!rate) {
    return principal / periods;
  }

  const monthlyRate = rate / 12;
  return principal * (monthlyRate / (1 - (1 + monthlyRate) ** -periods));
}

export function getInterestOnlyMonthlyDebtService(loanAmount, annualRate) {
  return toNumber(loanAmount, 0) * toNumber(annualRate, 0) / 12;
}

export function getAnnualDebtService(deal) {
  const financing = deal?.financing ?? {};
  return getMonthlyDebtService(financing.loanAmount, financing.interestRate, financing.amortizationYears) * 12;
}

export function getAnnualStressedDebtService(deal) {
  const financing = deal?.financing ?? {};
  const stressedRate = toNumber(financing.stressInterestRate, financing.interestRate);
  return getMonthlyDebtService(financing.loanAmount, stressedRate, financing.amortizationYears) * 12;
}

export function getDscr(deal, thresholds = DEFAULT_THRESHOLDS) {
  return percentage(getNoi(deal, thresholds), getAnnualDebtService(deal));
}

export function getStressedDscr(deal, thresholds = DEFAULT_THRESHOLDS) {
  return percentage(getNoi(deal, thresholds), getAnnualStressedDebtService(deal));
}

export function getLtv(deal) {
  const financing = deal?.financing ?? {};
  const underwriting = deal?.underwriting ?? {};
  const denominator = toNumber(underwriting.asStabilizedValue, underwriting.supportableValue);
  return percentage(financing.loanAmount, denominator);
}

export function getDebtYield(deal, thresholds = DEFAULT_THRESHOLDS) {
  return percentage(getNoi(deal, thresholds), toNumber(deal?.financing?.loanAmount, 0));
}

export function getCashInvested(deal) {
  const purchase = deal?.purchase ?? {};
  const financing = deal?.financing ?? {};

  const downPayment =
    purchase.downPaymentRate != null
      ? toNumber(purchase.offerPrice, 0) * toNumber(purchase.downPaymentRate, 0)
      : Math.max(toNumber(purchase.offerPrice, 0) - toNumber(financing.loanAmount, 0), 0);

  return sum([
    downPayment,
    purchase.closingCosts,
    purchase.rehabBudget,
    purchase.immediateCapex,
    purchase.initialReserves
  ]);
}

export function getAnnualLeveredCashFlow(deal, thresholds = DEFAULT_THRESHOLDS) {
  return getNoi(deal, thresholds) - getAnnualDebtService(deal) - getAnnualCapexReserve(deal);
}

export function getCashOnCashReturn(deal, thresholds = DEFAULT_THRESHOLDS) {
  return percentage(getAnnualLeveredCashFlow(deal, thresholds), getCashInvested(deal));
}

export function getMarginOfSafety(deal) {
  return percentage(
    toNumber(deal?.underwriting?.supportableValue, 0) - getAllInBasis(deal),
    toNumber(deal?.underwriting?.supportableValue, 0)
  );
}

export function getBenStartingOffer(deal) {
  return toNumber(deal?.purchase?.askingPrice, 0) * 0.75;
}

export function getMaximumAllowableOffer(deal, thresholds = DEFAULT_THRESHOLDS) {
  const underwriting = deal?.underwriting ?? {};
  const supportableValue = toNumber(underwriting.supportableValue, 0);
  const rehabDrag = sum([deal?.purchase?.rehabBudget, deal?.purchase?.immediateCapex]);
  const targetYield = Math.max(toNumber(underwriting.targetCashOnCash, thresholds.targetCashOnCash), 0);
  const targetDiscount = clamp(targetYield, 0.05, 0.2);
  return supportableValue * (1 - targetDiscount) - rehabDrag;
}

function getCashFlowAndDscrScore(metrics, thresholds = DEFAULT_THRESHOLDS) {
  if (metrics.annualLeveredCashFlow < 0 || metrics.dscr < thresholds.minDscr) {
    return 0;
  }
  if (metrics.dscr >= thresholds.strongDscr) {
    return 30;
  }
  if (metrics.dscr >= thresholds.targetDscr) {
    return 25;
  }
  if (metrics.dscr >= 1.15) {
    return 20;
  }
  return 10;
}

function getPriceVsValueScore(metrics) {
  if (metrics.marginOfSafety < 0) {
    return 0;
  }
  if (metrics.marginOfSafety >= 0.15) {
    return 20;
  }
  if (metrics.marginOfSafety >= 0.1) {
    return 15;
  }
  if (metrics.marginOfSafety >= 0.05) {
    return 10;
  }
  return 5;
}

function getCapexRiskScore(deal) {
  const dueDiligence = deal?.dueDiligence ?? {};
  const allInBasis = getAllInBasis(deal);
  const capexRatio = percentage(sum([deal?.purchase?.immediateCapex, getAnnualCapexReserve(deal)]), allInBasis);
  let score = 15;

  if (capexRatio > 0.12) {
    score -= 8;
  } else if (capexRatio > 0.08) {
    score -= 5;
  } else if (capexRatio > 0.04) {
    score -= 2;
  }

  if (dueDiligence.sewerRisk === "high") {
    score -= 3;
  }
  if (dueDiligence.electricalRisk === "high") {
    score -= 2;
  }
  if (dueDiligence.utilityMetering === "shared") {
    score -= 2;
  }

  const requiredNowCount = Array.isArray(dueDiligence.capexAdjustments)
    ? dueDiligence.capexAdjustments.filter((item) => item?.requiredNow).length
    : 0;

  score -= Math.min(requiredNowCount * 2, 6);
  return clamp(score, 0, 15);
}

function getFinancingResilienceScore(metrics, deal, thresholds = DEFAULT_THRESHOLDS) {
  let score = 0;

  if (metrics.stressedDscr >= thresholds.targetDscr) {
    score = 15;
  } else if (metrics.stressedDscr >= 1.1) {
    score = 10;
  } else if (metrics.stressedDscr >= thresholds.minDscr) {
    score = 5;
  }

  if (metrics.ltv > thresholds.maxLtv) {
    score -= 4;
  }

  const ioMonthlyDebtService = getInterestOnlyMonthlyDebtService(
    deal?.financing?.loanAmount,
    deal?.financing?.interestRate
  );
  const amortizingMonthlyDebtService = getMonthlyDebtService(
    deal?.financing?.loanAmount,
    deal?.financing?.interestRate,
    deal?.financing?.amortizationYears
  );

  if (ioMonthlyDebtService > 0 && metrics.annualLeveredCashFlow < 0 && amortizingMonthlyDebtService > ioMonthlyDebtService) {
    score -= 5;
  }

  return clamp(score, 0, 15);
}

function getRentAndMarketSupportScore(deal, thresholds = DEFAULT_THRESHOLDS) {
  const underwriting = deal?.underwriting ?? {};
  const dueDiligence = deal?.dueDiligence ?? {};
  const vacancyRate = getVacancyRate(deal?.income, thresholds);
  let score = 10;

  if (!underwriting.rentsVerified) {
    score -= 6;
  }
  if (vacancyRate > 0.08) {
    score -= 2;
  }
  if (dueDiligence.neighborhoodScore != null) {
    if (dueDiligence.neighborhoodScore < thresholds.acceptableNeighborhoodScore) {
      score -= 3;
    } else if (dueDiligence.neighborhoodScore < thresholds.strongNeighborhoodScore) {
      score -= 1;
    }
  }
  if (dueDiligence.competitiveSupplyRisk === "high") {
    score -= 3;
  } else if (dueDiligence.competitiveSupplyRisk === "medium") {
    score -= 1;
  }

  return clamp(score, 0, 10);
}

function getStrategyFitScore(deal, metrics, thresholds = DEFAULT_THRESHOLDS) {
  const mode = deal?.dealMode;
  let score = 6;

  if (mode === "house_hack_2to4") {
    const ownerOccupiedUnits = toNumber(deal?.property?.ownerOccupiedUnits, 0);
    score += ownerOccupiedUnits > 0 ? 2 : -2;
  }

  if (mode === "value_add_brrrr") {
    const asStabilizedValue = toNumber(deal?.underwriting?.asStabilizedValue, 0);
    const valueLift = percentage(asStabilizedValue - getAllInBasis(deal), getAllInBasis(deal));
    score += valueLift >= 0.1 ? 3 : valueLift > 0 ? 1 : -2;
  }

  if (mode === "hold_refi_1031" && metrics.cashOnCashReturn >= thresholds.passiveAlternativeRate) {
    score += 2;
  }

  if (metrics.cashOnCashReturn >= thresholds.targetCashOnCash) {
    score += 2;
  } else if (metrics.cashOnCashReturn < thresholds.passiveAlternativeRate) {
    score -= 3;
  }

  return clamp(score, 0, 10);
}

function getHardFails(deal, metrics, thresholds = DEFAULT_THRESHOLDS) {
  const underwriting = deal?.underwriting ?? {};
  const dueDiligence = deal?.dueDiligence ?? {};
  const requiredNowCapex = Array.isArray(dueDiligence.capexAdjustments)
    ? dueDiligence.capexAdjustments
        .filter((item) => item?.requiredNow)
        .reduce((total, item) => total + toNumber(item?.estimatedCost, 0), 0)
    : 0;

  const failures = [];

  if (metrics.annualLeveredCashFlow < 0) {
    failures.push("Negative stabilized cash flow.");
  }
  if (metrics.dscr < thresholds.minDscr) {
    failures.push("DSCR is below 1.00x on amortizing debt.");
  }
  if (metrics.stressedDscr < thresholds.minDscr) {
    failures.push("Stressed DSCR is below 1.00x.");
  }
  if (!underwriting.rentsVerified) {
    failures.push("Rents are not sufficiently verified.");
  }
  if (underwriting.requiresRentGrowthToWork) {
    failures.push("The deal requires rent growth assumptions to work.");
  }
  if (getAllInBasis(deal) > toNumber(underwriting.supportableValue, 0)) {
    failures.push("All-in basis exceeds supportable value.");
  }
  const remainingMargin = Math.max(toNumber(underwriting.supportableValue, 0) - getAllInBasis(deal), 0);

  if (requiredNowCapex > 0 && requiredNowCapex > remainingMargin) {
    failures.push("Required-now CapEx wipes out the margin of safety.");
  }

  return failures;
}

function getGrade(score, hardFail) {
  if (hardFail || score < 50) {
    return "red";
  }
  if (score < 65) {
    return "caution";
  }
  if (score < 80) {
    return "yellow";
  }
  return "green";
}

function buildReasons(metrics, bucketScores) {
  const reasons = [];

  if (bucketScores.priceVsValue >= 15) {
    reasons.push("Deal basis is comfortably below supportable value.");
  }
  if (bucketScores.cashFlowAndDscr >= 25) {
    reasons.push("Debt coverage is above the target underwriting threshold.");
  }
  if (bucketScores.financingResilience >= 10) {
    reasons.push("The deal remains resilient under a stress-rate scenario.");
  }
  if (bucketScores.capexRisk >= 10) {
    reasons.push("Physical risk appears manageable relative to the spread.");
  }
  if (metrics.cashOnCashReturn >= DEFAULT_THRESHOLDS.targetCashOnCash) {
    reasons.push("Cash-on-cash return clears the target hurdle.");
  }

  return reasons;
}

function buildWarnings(deal, metrics, thresholds = DEFAULT_THRESHOLDS) {
  const warnings = [];
  const income = deal?.income ?? {};
  const dueDiligence = deal?.dueDiligence ?? {};

  if (toNumber(income.vacancyRate, 0) < thresholds.minVacancyFloor) {
    warnings.push("Vacancy assumption uses the minimum conservative floor.");
  }
  if (!dueDiligence.fieldReviewed) {
    warnings.push("Due diligence is not yet field-reviewed.");
  }
  if (metrics.ltv > thresholds.maxLtv) {
    warnings.push("LTV exceeds the common 80% conventional reference band.");
  }
  if (dueDiligence.utilityMetering === "shared") {
    warnings.push("Shared utilities reduce tenant bill-back flexibility.");
  }

  return warnings;
}

export function analyzeDeal(deal, overrides = {}) {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...overrides };
  const metrics = {
    grossScheduledRent: round(getGrossScheduledRent(deal)),
    otherAnnualIncome: round(getOtherAnnualIncome(deal)),
    vacancyCreditLoss: round(getVacancyCreditLoss(deal, thresholds)),
    effectiveGrossIncome: round(getEffectiveGrossIncome(deal, thresholds)),
    operatingExpenses: round(getOperatingExpenses(deal)),
    annualCapexReserve: round(getAnnualCapexReserve(deal)),
    noi: round(getNoi(deal, thresholds)),
    capRate: round(getCapRate(deal, thresholds), 4),
    allInBasis: round(getAllInBasis(deal)),
    pricePerSf: round(getPricePerSf(deal)),
    annualDebtService: round(getAnnualDebtService(deal)),
    annualStressedDebtService: round(getAnnualStressedDebtService(deal)),
    dscr: round(getDscr(deal, thresholds), 3),
    stressedDscr: round(getStressedDscr(deal, thresholds), 3),
    ltv: round(getLtv(deal), 4),
    debtYield: round(getDebtYield(deal, thresholds), 4),
    cashInvested: round(getCashInvested(deal)),
    annualLeveredCashFlow: round(getAnnualLeveredCashFlow(deal, thresholds)),
    cashOnCashReturn: round(getCashOnCashReturn(deal, thresholds), 4),
    marginOfSafety: round(getMarginOfSafety(deal), 4),
    benStartingOffer: round(getBenStartingOffer(deal)),
    maximumAllowableOffer: round(getMaximumAllowableOffer(deal, thresholds))
  };

  const bucketScores = {
    cashFlowAndDscr: getCashFlowAndDscrScore(metrics, thresholds),
    priceVsValue: getPriceVsValueScore(metrics),
    capexRisk: getCapexRiskScore(deal),
    financingResilience: getFinancingResilienceScore(metrics, deal, thresholds),
    rentAndMarketSupport: getRentAndMarketSupportScore(deal, thresholds),
    strategyFit: getStrategyFitScore(deal, metrics, thresholds)
  };

  const failedChecks = getHardFails(deal, metrics, thresholds);
  const hardFail = failedChecks.length > 0;
  const score = Object.values(bucketScores).reduce((total, value) => total + value, 0);
  const grade = getGrade(score, hardFail);

  return {
    score,
    grade,
    hardFail,
    failBanner: hardFail ? FAIL_BANNER : null,
    failedChecks,
    bucketScores,
    reasons: buildReasons(metrics, bucketScores),
    warnings: buildWarnings(deal, metrics, thresholds),
    metrics
  };
}

export const thresholds = DEFAULT_THRESHOLDS;
