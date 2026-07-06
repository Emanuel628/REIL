import { useEffect, useState } from "react";

import { strongRentalDeal, failingRentalDeal, unrentableSpeculativeDeal } from "./fixtures/sampleDeals.js";
import { analyzeDeal } from "./utils/underwriteMath.js";

const PRESETS = {
  strong: {
    label: "Strong Duplex",
    deal: strongRentalDeal
  },
  failing: {
    label: "Bad Basis",
    deal: failingRentalDeal
  },
  speculative: {
    label: "Speculative Rents",
    deal: unrentableSpeculativeDeal
  }
};

const BUCKET_MAX = {
  cashFlowAndDscr: 30,
  priceVsValue: 20,
  capexRisk: 15,
  financingResilience: 15,
  rentAndMarketSupport: 10,
  strategyFit: 10
};

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function percent(value, digits = 1) {
  return `${((value ?? 0) * 100).toFixed(digits)}%`;
}

function cloneDeal(deal) {
  return structuredClone(deal);
}

function buildQuickScreenState(deal) {
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

function buildDealFromState(state) {
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

function NumberField({ label, value, name, onChange, hint, step = "1" }) {
  return (
    <label className="field-group">
      <span className="field-label">
        <span>{label}</span>
        {hint ? <span className="field-hint">{hint}</span> : null}
      </span>
      <input className="field-input" type="number" name={name} value={value} onChange={onChange} step={step} />
    </label>
  );
}

function ToggleField({ label, value, name, onChange }) {
  return (
    <label className="field-group">
      <span className="field-label">
        <span>{label}</span>
      </span>
      <select className="field-select" name={name} value={String(value)} onChange={onChange}>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  );
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </article>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [formState, setFormState] = useState(buildQuickScreenState(strongRentalDeal));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const activeDeal = buildDealFromState(formState);
  const analysis = analyzeDeal(activeDeal);

  function handlePreset(key) {
    const preset = PRESETS[key];
    if (!preset) {
      return;
    }

    setFormState({
      ...buildQuickScreenState(preset.deal),
      preset: key
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      preset: "custom",
      [name]: value === "true" ? true : value === "false" ? false : value
    }));
  }

  const gradeLabel = analysis.grade === "caution" ? "Caution" : analysis.grade;

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="brand-block">
          <div className="brand-chip">REIL Quick Screen</div>
          <h1 className="hero-title">A blue-white underwriting sheet with teeth.</h1>
          <p className="hero-copy">
            Phase 2 starts here: live entry basis, rent, expense, and debt assumptions on the left;
            hard underwriting logic on the right. If a deal dies under real numbers, the app says so.
          </p>
        </div>
        <button className="theme-toggle" type="button" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </button>
      </header>

      <main className="workspace-grid">
        <section className="panel">
          <div className="panel-inner">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Phase 2 / Quick Screen</p>
                <h2 className="panel-title">Input the deal</h2>
                <p className="panel-copy">
                  This screen stays intentionally tight: basis, rent, OpEx, debt, and a few confidence flags.
                </p>
              </div>
              <div className="preset-row">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    className="preset-button"
                    type="button"
                    data-active={formState.preset === key}
                    onClick={() => handlePreset(key)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <div className="field-span">
                <p className="panel-kicker">Basis</p>
              </div>
              <NumberField label="Asking Price" name="askingPrice" value={formState.askingPrice} onChange={handleChange} />
              <NumberField label="Offer Price" name="offerPrice" value={formState.offerPrice} onChange={handleChange} />
              <NumberField label="Supportable Value" name="supportableValue" value={formState.supportableValue} onChange={handleChange} />
              <NumberField label="Gross Living Area" name="grossLivingArea" value={formState.grossLivingArea} onChange={handleChange} />
              <NumberField label="Rehab Budget" name="rehabBudget" value={formState.rehabBudget} onChange={handleChange} />
              <NumberField label="Immediate CapEx" name="immediateCapex" value={formState.immediateCapex} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Income</p>
              </div>
              <NumberField label="Unit 1 Monthly Rent" name="monthlyRent1" value={formState.monthlyRent1} onChange={handleChange} />
              <NumberField label="Unit 2 Monthly Rent" name="monthlyRent2" value={formState.monthlyRent2} onChange={handleChange} />
              <NumberField label="Vacancy Rate" name="vacancyRate" value={formState.vacancyRate} onChange={handleChange} step="0.01" hint="decimal" />
              <NumberField label="Neighborhood Score" name="neighborhoodScore" value={formState.neighborhoodScore} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Operating Expenses</p>
              </div>
              <NumberField label="Annual Taxes" name="annualTaxes" value={formState.annualTaxes} onChange={handleChange} />
              <NumberField label="Annual Insurance" name="annualInsurance" value={formState.annualInsurance} onChange={handleChange} />
              <NumberField label="Repairs / Maintenance" name="annualRepairsMaintenance" value={formState.annualRepairsMaintenance} onChange={handleChange} />
              <NumberField label="Management" name="annualManagement" value={formState.annualManagement} onChange={handleChange} />
              <NumberField label="Owner Utilities" name="annualUtilitiesOwnerPaid" value={formState.annualUtilitiesOwnerPaid} onChange={handleChange} />
              <NumberField label="Turnover / Admin" name="annualTurnoverAdmin" value={formState.annualTurnoverAdmin} onChange={handleChange} />
              <NumberField label="CapEx Reserve" name="annualCapexReserve" value={formState.annualCapexReserve} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Debt and confidence</p>
              </div>
              <NumberField label="Loan Amount" name="loanAmount" value={formState.loanAmount} onChange={handleChange} />
              <NumberField label="Interest Rate" name="interestRate" value={formState.interestRate} onChange={handleChange} step="0.0001" hint="decimal" />
              <NumberField
                label="Stress Rate"
                name="stressInterestRate"
                value={formState.stressInterestRate}
                onChange={handleChange}
                step="0.0001"
                hint="decimal"
              />
              <NumberField label="Amortization Years" name="amortizationYears" value={formState.amortizationYears} onChange={handleChange} />
              <ToggleField label="Rents Verified" name="rentsVerified" value={formState.rentsVerified} onChange={handleChange} />
              <ToggleField
                label="Needs Rent Growth to Work"
                name="requiresRentGrowthToWork"
                value={formState.requiresRentGrowthToWork}
                onChange={handleChange}
              />
              <ToggleField label="Field Reviewed" name="fieldReviewed" value={formState.fieldReviewed} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section className="results-column">
          <section className="panel">
            <div className="panel-inner score-frame">
              <div className="status-row">
                <div>
                  <p className="panel-kicker">Live Output</p>
                  <h2 className="panel-title">Investment recommendation</h2>
                </div>
                <div className={`status-badge ${analysis.grade}`}>{gradeLabel}</div>
              </div>

              <div className="score-readout">
                <p className="score-caption">Investment score</p>
                <p className="score-value">{analysis.score}</p>
                <p className="score-subcopy">
                  DSCR {analysis.metrics.dscr.toFixed(2)}x · stressed DSCR {analysis.metrics.stressedDscr.toFixed(2)}x
                </p>
              </div>

              {analysis.failBanner ? <div className="fail-banner">{analysis.failBanner}</div> : null}

              <div className="metric-grid">
                <MetricCard label="NOI" value={currency(analysis.metrics.noi)} />
                <MetricCard label="Annual Levered Cash Flow" value={currency(analysis.metrics.annualLeveredCashFlow)} />
                <MetricCard label="All-In Basis" value={currency(analysis.metrics.allInBasis)} />
                <MetricCard label="Maximum Allowable Offer" value={currency(analysis.metrics.maximumAllowableOffer)} />
                <MetricCard label="Cash on Cash" value={percent(analysis.metrics.cashOnCashReturn)} />
                <MetricCard label="LTV" value={percent(analysis.metrics.ltv)} />
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-inner list-panel">
              <h3 className="list-title">Why it passes or fails</h3>
              <ol className="signal-list">
                {(analysis.hardFail ? analysis.failedChecks : analysis.reasons).map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ol>
              {analysis.warnings.length > 0 ? (
                <>
                  <h3 className="list-title">Warnings</h3>
                  <ol className="signal-list">
                    {analysis.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ol>
                </>
              ) : null}
            </div>
          </section>

          <section className="panel">
            <div className="panel-inner bucket-grid">
              <h3 className="list-title">Score breakdown</h3>
              {Object.entries(analysis.bucketScores).map(([key, value]) => (
                <div className="bucket-row" key={key}>
                  <div className="bucket-head">
                    <span>{key.replace(/([A-Z])/g, " $1")}</span>
                    <span>
                      {value} / {BUCKET_MAX[key]}
                    </span>
                  </div>
                  <div className="bucket-track">
                    <div className="bucket-fill" style={{ width: `${(value / BUCKET_MAX[key]) * 100}%` }} />
                  </div>
                </div>
              ))}
              <p className="footer-note">
                Phase 2 has started. The first screen is live and wired to the real underwriting engine, not mocked
                numbers. Once you approve this direction, the next build layer is database and multi-page workflow.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
