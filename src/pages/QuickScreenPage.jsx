import { NumberField, ToggleField, MetricCard } from "../components/ui/FieldControls.jsx";
import { PageFrame } from "../components/ui/PageFrame.jsx";
import { buildDealFromState, buildQuickScreenState } from "../fixtures/quickScreenState.js";
import { failingRentalDeal, strongRentalDeal, unrentableSpeculativeDeal } from "../fixtures/sampleDeals.js";
import { analyzeDeal } from "../utils/underwriteMath.js";

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

export default function QuickScreenPage({ formState, setFormState }) {
  const activeDeal = buildDealFromState(formState);
  const analysis = analyzeDeal(activeDeal);

  function loadPreset(key) {
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
    <PageFrame
      kicker="Acquisitions / Quick Screen"
      title="Quick Screen"
      copy="This is the first live workflow in the app: basis, rent, OpEx, debt, and confidence flags in one place."
      actions={
        <div className="preset-row">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              className="preset-button"
              type="button"
              data-active={formState.preset === key}
              onClick={() => loadPreset(key)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="workspace-grid">
        <section className="panel">
          <div className="panel-inner">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Input the deal</p>
                <h3 className="panel-title">First-pass underwriting</h3>
                <p className="panel-copy">
                  Tight inputs only. If a deal fails here, it does not deserve a deeper page yet.
                </p>
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
              <NumberField label="Stress Rate" name="stressInterestRate" value={formState.stressInterestRate} onChange={handleChange} step="0.0001" hint="decimal" />
              <NumberField label="Amortization Years" name="amortizationYears" value={formState.amortizationYears} onChange={handleChange} />
              <ToggleField label="Rents Verified" name="rentsVerified" value={formState.rentsVerified} onChange={handleChange} />
              <ToggleField label="Needs Rent Growth to Work" name="requiresRentGrowthToWork" value={formState.requiresRentGrowthToWork} onChange={handleChange} />
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
                  <h3 className="panel-title">Investment recommendation</h3>
                </div>
                <div className={`status-badge ${analysis.grade}`}>{gradeLabel}</div>
              </div>

              <div className="score-readout">
                <p className="score-caption">Investment score</p>
                <p className="score-value">{analysis.score}</p>
                <p className="score-subcopy">
                  DSCR {analysis.metrics.dscr.toFixed(2)}x | stressed DSCR {analysis.metrics.stressedDscr.toFixed(2)}x
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
                Quick Screen is live. The other sections now exist as page scaffolds so the product has a real lifecycle shape.
              </p>
            </div>
          </section>
        </section>
      </div>
    </PageFrame>
  );
}
