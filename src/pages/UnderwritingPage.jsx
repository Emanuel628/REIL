import { MetricCard, NumberField, TextField, ToggleField } from "../components/ui/FieldControls.jsx";
import { PageFrame } from "../components/ui/PageFrame.jsx";
import { buildDealFromState } from "../fixtures/quickScreenState.js";
import {
  analyzeDeal,
  getInterestOnlyMonthlyDebtService,
  getMonthlyDebtService
} from "../utils/underwriteMath.js";

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

function getDisplayGrade(grade) {
  return grade === "caution" ? "Caution" : grade;
}

export default function UnderwritingPage({ formState, setFormState, onSaveRecord }) {
  const hasCoreInputs = Boolean(formState.offerPrice || formState.askingPrice || formState.monthlyRent1 || formState.monthlyRent2);
  const activeDeal = buildDealFromState(formState);
  const analysis = analyzeDeal(activeDeal);
  const amortizingMonthlyDebtService = getMonthlyDebtService(
    activeDeal.financing.loanAmount,
    activeDeal.financing.interestRate,
    activeDeal.financing.amortizationYears
  );
  const ioMonthlyDebtService = getInterestOnlyMonthlyDebtService(
    activeDeal.financing.loanAmount,
    activeDeal.financing.interestRate
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value === "true" ? true : value === "false" ? false : value
    }));
  }

  return (
    <PageFrame
      kicker="Acquisitions / Underwriting"
      title="Full Underwriting"
      copy="This page is the deeper pass: supportable rents, normalized OpEx, debt structure, reserve posture, and stress-tested returns."
      actions={
        <button className="primary-button" type="button" onClick={() => onSaveRecord(formState)}>
          Save Record
        </button>
      }
    >
      <div className="underwriting-grid">
        <section className="panel">
          <div className="panel-inner">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Normalized input sheet</p>
                <h3 className="panel-title">Assumptions and debt</h3>
                <p className="panel-copy">
                  This is where seller optimism gets replaced with your actual underwriting posture.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field-span">
                <p className="panel-kicker">Record</p>
              </div>
              <TextField label="Record Name" name="recordName" value={formState.recordName} onChange={handleChange} />
              <TextField label="Address" name="address" value={formState.address} onChange={handleChange} placeholder="123 Main St, Tampa, FL" />

              <div className="field-span">
                <p className="panel-kicker">Value and basis</p>
              </div>
              <NumberField label="Asking Price" name="askingPrice" value={formState.askingPrice} onChange={handleChange} />
              <NumberField label="Offer Price" name="offerPrice" value={formState.offerPrice} onChange={handleChange} />
              <NumberField label="Supportable Value" name="supportableValue" value={formState.supportableValue} onChange={handleChange} />
              <NumberField label="As-Stabilized Value" name="asStabilizedValue" value={formState.asStabilizedValue} onChange={handleChange} />
              <NumberField label="Closing Costs" name="closingCosts" value={formState.closingCosts} onChange={handleChange} />
              <NumberField label="Initial Reserves" name="initialReserves" value={formState.initialReserves} onChange={handleChange} />
              <NumberField label="Rehab Budget" name="rehabBudget" value={formState.rehabBudget} onChange={handleChange} />
              <NumberField label="Immediate CapEx" name="immediateCapex" value={formState.immediateCapex} onChange={handleChange} />
              <NumberField label="Gross Living Area" name="grossLivingArea" value={formState.grossLivingArea} onChange={handleChange} />
              <NumberField label="Units" name="units" value={formState.units} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Rent support</p>
              </div>
              <NumberField label="In-Place Rent Unit 1" name="monthlyRent1" value={formState.monthlyRent1} onChange={handleChange} />
              <NumberField label="In-Place Rent Unit 2" name="monthlyRent2" value={formState.monthlyRent2} onChange={handleChange} />
              <NumberField label="Market Rent Unit 1" name="marketRent1" value={formState.marketRent1} onChange={handleChange} />
              <NumberField label="Market Rent Unit 2" name="marketRent2" value={formState.marketRent2} onChange={handleChange} />
              <NumberField label="Other Monthly Income" name="otherMonthlyIncome" value={formState.otherMonthlyIncome} onChange={handleChange} />
              <NumberField label="Vacancy Rate" name="vacancyRate" value={formState.vacancyRate} onChange={handleChange} step="0.01" hint="decimal" />
              <NumberField label="Credit Loss Rate" name="creditLossRate" value={formState.creditLossRate} onChange={handleChange} step="0.01" hint="decimal" />
              <ToggleField label="Rents Verified" name="rentsVerified" value={formState.rentsVerified} onChange={handleChange} />
              <ToggleField label="Needs Rent Growth to Work" name="requiresRentGrowthToWork" value={formState.requiresRentGrowthToWork} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Operating expenses</p>
              </div>
              <NumberField label="Annual Taxes" name="annualTaxes" value={formState.annualTaxes} onChange={handleChange} />
              <NumberField label="Annual Insurance" name="annualInsurance" value={formState.annualInsurance} onChange={handleChange} />
              <NumberField label="Repairs / Maintenance" name="annualRepairsMaintenance" value={formState.annualRepairsMaintenance} onChange={handleChange} />
              <NumberField label="Management" name="annualManagement" value={formState.annualManagement} onChange={handleChange} />
              <NumberField label="Owner Utilities" name="annualUtilitiesOwnerPaid" value={formState.annualUtilitiesOwnerPaid} onChange={handleChange} />
              <NumberField label="HOA / Condo Fees" name="annualHoaCondoFees" value={formState.annualHoaCondoFees} onChange={handleChange} />
              <NumberField label="Turnover / Admin" name="annualTurnoverAdmin" value={formState.annualTurnoverAdmin} onChange={handleChange} />
              <NumberField label="CapEx Reserve" name="annualCapexReserve" value={formState.annualCapexReserve} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Financing</p>
              </div>
              <NumberField label="Loan Amount" name="loanAmount" value={formState.loanAmount} onChange={handleChange} />
              <NumberField label="Down Payment Rate" name="downPaymentRate" value={formState.downPaymentRate} onChange={handleChange} step="0.01" hint="decimal" />
              <NumberField label="Interest Rate" name="interestRate" value={formState.interestRate} onChange={handleChange} step="0.0001" hint="decimal" />
              <NumberField label="Stress Rate" name="stressInterestRate" value={formState.stressInterestRate} onChange={handleChange} step="0.0001" hint="decimal" />
              <NumberField label="Amortization Years" name="amortizationYears" value={formState.amortizationYears} onChange={handleChange} />
              <NumberField label="Interest-Only Years" name="interestOnlyYears" value={formState.interestOnlyYears} onChange={handleChange} />
              <NumberField label="Target DSCR" name="targetDscr" value={formState.targetDscr} onChange={handleChange} step="0.01" />
              <NumberField label="Target Cash on Cash" name="targetCashOnCash" value={formState.targetCashOnCash} onChange={handleChange} step="0.01" hint="decimal" />
              <ToggleField label="Field Reviewed" name="fieldReviewed" value={formState.fieldReviewed} onChange={handleChange} />
              <NumberField label="Neighborhood Score" name="neighborhoodScore" value={formState.neighborhoodScore} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section className="results-column">
          {hasCoreInputs ? (
            <>
              <section className="panel">
                <div className="panel-inner score-frame">
                  <div className="status-row">
                    <div>
                      <p className="panel-kicker">Underwriting output</p>
                      <h3 className="panel-title">Recommendation</h3>
                    </div>
                    <div className={`status-badge ${analysis.grade}`}>{getDisplayGrade(analysis.grade)}</div>
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
                    <MetricCard label="Cap Rate" value={percent(analysis.metrics.capRate, 2)} />
                    <MetricCard label="Debt Yield" value={percent(analysis.metrics.debtYield, 2)} />
                    <MetricCard label="Cash on Cash" value={percent(analysis.metrics.cashOnCashReturn, 2)} />
                    <MetricCard label="All-In Basis" value={currency(analysis.metrics.allInBasis)} />
                    <MetricCard label="MAO" value={currency(analysis.metrics.maximumAllowableOffer)} />
                    <MetricCard label="LTV" value={percent(analysis.metrics.ltv, 2)} />
                    <MetricCard label="Margin of Safety" value={percent(analysis.metrics.marginOfSafety, 2)} />
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-inner">
                  <div className="panel-header">
                    <div>
                      <p className="panel-kicker">Debt structure</p>
                      <h3 className="panel-title">Amortizing versus IO</h3>
                      <p className="panel-copy">IO is shown for comparison only. The underwriting grade still keys off amortizing debt service.</p>
                    </div>
                  </div>

                  <div className="metric-grid">
                    <MetricCard label="Amortizing Monthly Debt" value={currency(amortizingMonthlyDebtService)} />
                    <MetricCard label="Interest-Only Monthly Debt" value={currency(ioMonthlyDebtService)} />
                    <MetricCard label="Annual Debt Service" value={currency(analysis.metrics.annualDebtService)} />
                    <MetricCard label="Stressed Annual Debt" value={currency(analysis.metrics.annualStressedDebtService)} />
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-inner list-panel">
                  <h3 className="list-title">Drivers</h3>
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
            </>
          ) : (
            <section className="panel">
              <div className="panel-inner empty-state">
                <h4 className="empty-title">No underwriting inputs yet</h4>
                <p className="panel-copy">
                  Enter real deal assumptions on the left and the underwriting sheet will populate here.
                </p>
              </div>
            </section>
          )}
        </section>
      </div>
    </PageFrame>
  );
}
