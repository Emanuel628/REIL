import { MetricCard, NumberField, TextField } from "../components/ui/FieldControls.jsx";
import { PageFrame } from "../components/ui/PageFrame.jsx";
import { buildDealFromState } from "../fixtures/quickScreenState.js";
import {
  analyzeDeal,
  getAnnualCapexReserve,
  getAnnualDebtService,
  getNoi
} from "../utils/underwriteMath.js";

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function computeActuals(formState) {
  const actualGrossRent =
    ((Number(formState.actualMonthlyRent1) || 0) + (Number(formState.actualMonthlyRent2) || 0)) * 12;
  const actualOtherIncome = (Number(formState.actualOtherMonthlyIncome) || 0) * 12;
  const actualIncome = actualGrossRent + actualOtherIncome;
  const actualExpenses =
    (Number(formState.actualAnnualTaxes) || 0) +
    (Number(formState.actualAnnualInsurance) || 0) +
    (Number(formState.actualAnnualRepairsMaintenance) || 0) +
    (Number(formState.actualAnnualManagement) || 0) +
    (Number(formState.actualAnnualUtilitiesOwnerPaid) || 0) +
    (Number(formState.actualAnnualHoaCondoFees) || 0) +
    (Number(formState.actualAnnualTurnoverAdmin) || 0);
  const actualCapexReserve = Number(formState.actualAnnualCapexReserve) || 0;
  const actualNoi = actualIncome - actualExpenses;

  return {
    actualGrossRent,
    actualOtherIncome,
    actualIncome,
    actualExpenses,
    actualCapexReserve,
    actualNoi
  };
}

function variance(actual, baseline) {
  return actual - baseline;
}

function VarianceCell({ actual, baseline, currencyMode = true }) {
  const diff = variance(actual, baseline);
  const cls = diff > 0 ? "negative" : diff < 0 ? "positive" : "flat";
  const formatted = currencyMode ? currency(diff) : `${diff.toFixed(2)}x`;

  return <span className={`variance-chip ${cls}`}>{formatted}</span>;
}

export default function PortfolioPage({ formState, setFormState, onSaveRecord }) {
  const hasCoreInputs = Boolean(formState.offerPrice || formState.supportableValue || formState.monthlyRent1 || formState.monthlyRent2);
  const deal = buildDealFromState(formState);
  const analysis = analyzeDeal(deal);
  const baselineNoi = getNoi(deal);
  const baselineDebt = getAnnualDebtService(deal);
  const baselineCapexReserve = getAnnualCapexReserve(deal);
  const actuals = computeActuals(formState);
  const actualCashFlow = actuals.actualNoi - baselineDebt - actuals.actualCapexReserve;
  const baselineCashFlow = analysis.metrics.annualLeveredCashFlow;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value
    }));
  }

  return (
    <PageFrame
      kicker="Portfolio"
      title="Active Portfolio Manager"
      copy="This page tracks how the property actually performs against the underwritten baseline, then exposes drift quickly."
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
                <p className="panel-kicker">Actual operating inputs</p>
                <h3 className="panel-title">Current performance</h3>
                <p className="panel-copy">
                  Enter live rents, real expenses, and unit-level status. The right side shows variance against the original underwriting.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field-span">
                <p className="panel-kicker">Actual income</p>
              </div>
              <NumberField label="Actual Rent Unit 1" name="actualMonthlyRent1" value={formState.actualMonthlyRent1} onChange={handleChange} />
              <NumberField label="Actual Rent Unit 2" name="actualMonthlyRent2" value={formState.actualMonthlyRent2} onChange={handleChange} />
              <NumberField label="Actual Other Monthly Income" name="actualOtherMonthlyIncome" value={formState.actualOtherMonthlyIncome} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Actual expenses</p>
              </div>
              <NumberField label="Actual Taxes" name="actualAnnualTaxes" value={formState.actualAnnualTaxes} onChange={handleChange} />
              <NumberField label="Actual Insurance" name="actualAnnualInsurance" value={formState.actualAnnualInsurance} onChange={handleChange} />
              <NumberField label="Actual Repairs" name="actualAnnualRepairsMaintenance" value={formState.actualAnnualRepairsMaintenance} onChange={handleChange} />
              <NumberField label="Actual Management" name="actualAnnualManagement" value={formState.actualAnnualManagement} onChange={handleChange} />
              <NumberField label="Actual Utilities" name="actualAnnualUtilitiesOwnerPaid" value={formState.actualAnnualUtilitiesOwnerPaid} onChange={handleChange} />
              <NumberField label="Actual HOA Fees" name="actualAnnualHoaCondoFees" value={formState.actualAnnualHoaCondoFees} onChange={handleChange} />
              <NumberField label="Actual Turnover / Admin" name="actualAnnualTurnoverAdmin" value={formState.actualAnnualTurnoverAdmin} onChange={handleChange} />
              <NumberField label="Actual CapEx Reserve" name="actualAnnualCapexReserve" value={formState.actualAnnualCapexReserve} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Unit ledger</p>
              </div>
              <TextField label="Unit 1 Number" name="unit1Number" value={formState.unit1Number} onChange={handleChange} />
              <TextField label="Unit 1 Lease Start" name="unit1LeaseStart" value={formState.unit1LeaseStart} onChange={handleChange} placeholder="YYYY-MM-DD" />
              <TextField label="Unit 1 Lease End" name="unit1LeaseEnd" value={formState.unit1LeaseEnd} onChange={handleChange} placeholder="YYYY-MM-DD" />
              <NumberField label="Unit 1 Deposit Held" name="unit1DepositHeld" value={formState.unit1DepositHeld} onChange={handleChange} />
              <TextField label="Unit 1 Payment Status" name="unit1PaymentStatus" value={formState.unit1PaymentStatus} onChange={handleChange} placeholder="current or delinquent" />

              <TextField label="Unit 2 Number" name="unit2Number" value={formState.unit2Number} onChange={handleChange} />
              <TextField label="Unit 2 Lease Start" name="unit2LeaseStart" value={formState.unit2LeaseStart} onChange={handleChange} placeholder="YYYY-MM-DD" />
              <TextField label="Unit 2 Lease End" name="unit2LeaseEnd" value={formState.unit2LeaseEnd} onChange={handleChange} placeholder="YYYY-MM-DD" />
              <NumberField label="Unit 2 Deposit Held" name="unit2DepositHeld" value={formState.unit2DepositHeld} onChange={handleChange} />
              <TextField label="Unit 2 Payment Status" name="unit2PaymentStatus" value={formState.unit2PaymentStatus} onChange={handleChange} placeholder="current or delinquent" />
            </div>
          </div>
        </section>

        <section className="results-column">
          {hasCoreInputs ? (
            <>
              <section className="panel">
                <div className="panel-inner">
                  <div className="panel-header">
                    <div>
                      <p className="panel-kicker">Variance ledger</p>
                      <h3 className="panel-title">Underwritten vs actual</h3>
                    </div>
                  </div>

                  <div className="ledger-table">
                    <div className="ledger-row ledger-head">
                      <span>Line item</span>
                      <span>Underwritten</span>
                      <span>Actual</span>
                      <span>Variance</span>
                    </div>
                    <div className="ledger-row">
                      <span>NOI</span>
                      <span>{currency(baselineNoi)}</span>
                      <span>{currency(actuals.actualNoi)}</span>
                      <VarianceCell actual={actuals.actualNoi} baseline={baselineNoi} />
                    </div>
                    <div className="ledger-row">
                      <span>Debt Service</span>
                      <span>{currency(baselineDebt)}</span>
                      <span>{currency(baselineDebt)}</span>
                      <VarianceCell actual={baselineDebt} baseline={baselineDebt} />
                    </div>
                    <div className="ledger-row">
                      <span>CapEx Reserve</span>
                      <span>{currency(baselineCapexReserve)}</span>
                      <span>{currency(actuals.actualCapexReserve)}</span>
                      <VarianceCell actual={actuals.actualCapexReserve} baseline={baselineCapexReserve} />
                    </div>
                    <div className="ledger-row">
                      <span>Levered Cash Flow</span>
                      <span>{currency(baselineCashFlow)}</span>
                      <span>{currency(actualCashFlow)}</span>
                      <VarianceCell actual={actualCashFlow} baseline={baselineCashFlow} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-inner">
                  <div className="panel-header">
                    <div>
                      <p className="panel-kicker">Operating pulse</p>
                      <h3 className="panel-title">Current posture</h3>
                    </div>
                  </div>
                  <div className="metric-grid">
                    <MetricCard label="Score" value={analysis.score} />
                    <MetricCard label="Baseline Cash Flow" value={currency(baselineCashFlow)} />
                    <MetricCard label="Actual Cash Flow" value={currency(actualCashFlow)} />
                    <MetricCard label="Rent Roll Annualized" value={currency(actuals.actualGrossRent)} />
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-inner list-panel">
                  <h3 className="list-title">Tenant rent roll</h3>
                  <div className="ledger-table">
                    <div className="ledger-row ledger-head">
                      <span>Unit</span>
                      <span>Lease start</span>
                      <span>Lease end</span>
                      <span>Deposit</span>
                      <span>Status</span>
                    </div>
                    <div className="ledger-row">
                      <span>{formState.unit1Number || "-"}</span>
                      <span>{formState.unit1LeaseStart || "-"}</span>
                      <span>{formState.unit1LeaseEnd || "-"}</span>
                      <span>{currency(Number(formState.unit1DepositHeld) || 0)}</span>
                      <span>{formState.unit1PaymentStatus || "-"}</span>
                    </div>
                    <div className="ledger-row">
                      <span>{formState.unit2Number || "-"}</span>
                      <span>{formState.unit2LeaseStart || "-"}</span>
                      <span>{formState.unit2LeaseEnd || "-"}</span>
                      <span>{currency(Number(formState.unit2DepositHeld) || 0)}</span>
                      <span>{formState.unit2PaymentStatus || "-"}</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="panel">
              <div className="panel-inner empty-state">
                <h4 className="empty-title">No portfolio basis yet</h4>
                <p className="panel-copy">
                  Save a real acquisition record first. This page only becomes useful once there is an underwritten baseline to compare against.
                </p>
              </div>
            </section>
          )}
        </section>
      </div>
    </PageFrame>
  );
}
