import { NumberField, TextField, ToggleField, MetricCard } from "../components/ui/FieldControls.jsx";
import { PageFrame } from "../components/ui/PageFrame.jsx";
import { buildDealFromState } from "../fixtures/quickScreenState.js";
import { analyzeDeal } from "../utils/underwriteMath.js";

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function conditionAdjustmentTotal(formState) {
  return [
    Number(formState.roofAdjustment) || 0,
    Number(formState.hvacAdjustment) || 0,
    Number(formState.sewerAdjustment) || 0,
    Number(formState.electricalAdjustment) || 0,
    Number(formState.utilityAdjustment) || 0
  ].reduce((sum, value) => sum + value, 0);
}

function fieldChipClass(value) {
  if (value === "poor" || value === "high" || value === "shared") {
    return "danger";
  }
  if (value === "fair" || value === "medium") {
    return "watch";
  }
  return "good";
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="field-group">
      <span className="field-label">
        <span>{label}</span>
      </span>
      <select className="field-select" name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function DueDiligencePage({ formState, setFormState, onSaveRecord }) {
  const activeDeal = buildDealFromState(formState);
  const analysis = analyzeDeal(activeDeal);
  const totalAdjustment = conditionAdjustmentTotal(formState);
  const adjustedMao = Math.max((analysis.metrics.maximumAllowableOffer || 0) - totalAdjustment, 0);
  const hasCoreInputs = Boolean(formState.offerPrice || formState.supportableValue);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value === "true" ? true : value === "false" ? false : value
    }));
  }

  return (
    <PageFrame
      kicker="Acquisitions / Due Diligence"
      title="Field Mode"
      copy="This page turns physical findings into immediate offer pressure. Every issue logged here needs a number attached to it."
      actions={
        <button className="primary-button" type="button" onClick={() => onSaveRecord(formState)}>
          Save Record
        </button>
      }
    >
      <div className="underwriting-grid">
        <section className="panel field-panel">
          <div className="panel-inner">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Inspection input</p>
                <h3 className="panel-title">Physical findings</h3>
                <p className="panel-copy">
                  Use this as the one-handed walkthrough screen. Anything that hurts the basis should show up as a deduction.
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
                <p className="panel-kicker">Roof</p>
              </div>
              <NumberField label="Years Remaining" name="roofYearsRemaining" value={formState.roofYearsRemaining} onChange={handleChange} />
              <SelectField
                label="Condition"
                name="roofCondition"
                value={formState.roofCondition}
                onChange={handleChange}
                options={[
                  { value: "good", label: "Good" },
                  { value: "fair", label: "Fair" },
                  { value: "poor", label: "Poor" }
                ]}
              />
              <NumberField label="Offer Deduction" name="roofAdjustment" value={formState.roofAdjustment} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">HVAC</p>
              </div>
              <NumberField label="Years Remaining" name="hvacYearsRemaining" value={formState.hvacYearsRemaining} onChange={handleChange} />
              <SelectField
                label="Condition"
                name="hvacCondition"
                value={formState.hvacCondition}
                onChange={handleChange}
                options={[
                  { value: "good", label: "Good" },
                  { value: "fair", label: "Fair" },
                  { value: "poor", label: "Poor" }
                ]}
              />
              <NumberField label="Offer Deduction" name="hvacAdjustment" value={formState.hvacAdjustment} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Utilities and systems</p>
              </div>
              <SelectField
                label="Sewer Risk"
                name="sewerRisk"
                value={formState.sewerRisk}
                onChange={handleChange}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" }
                ]}
              />
              <NumberField label="Sewer Deduction" name="sewerAdjustment" value={formState.sewerAdjustment} onChange={handleChange} />
              <SelectField
                label="Electrical Risk"
                name="electricalRisk"
                value={formState.electricalRisk}
                onChange={handleChange}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" }
                ]}
              />
              <NumberField label="Electrical Deduction" name="electricalAdjustment" value={formState.electricalAdjustment} onChange={handleChange} />
              <SelectField
                label="Utility Metering"
                name="utilityMetering"
                value={formState.utilityMetering}
                onChange={handleChange}
                options={[
                  { value: "separate", label: "Separate" },
                  { value: "shared", label: "Shared" }
                ]}
              />
              <NumberField label="Utility Deduction" name="utilityAdjustment" value={formState.utilityAdjustment} onChange={handleChange} />

              <div className="field-span">
                <p className="panel-kicker">Area risk</p>
              </div>
              <NumberField label="Neighborhood Score" name="neighborhoodScore" value={formState.neighborhoodScore} onChange={handleChange} />
              <SelectField
                label="Competitive Supply"
                name="competitiveSupplyRisk"
                value={formState.competitiveSupplyRisk}
                onChange={handleChange}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" }
                ]}
              />
              <ToggleField label="Field Reviewed" name="fieldReviewed" value={formState.fieldReviewed} onChange={handleChange} />
              <label className="field-group field-span">
                <span className="field-label">
                  <span>Field Notes</span>
                </span>
                <textarea className="field-input field-textarea" name="fieldNotes" value={formState.fieldNotes} onChange={handleChange} placeholder="Roof wear, odors, meter layout, neighborhood observations..." />
              </label>
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
                      <p className="panel-kicker">Offer pressure</p>
                      <h3 className="panel-title">Field-adjusted MAO</h3>
                    </div>
                    <div className={`status-badge ${analysis.grade}`}>{analysis.grade === "caution" ? "Caution" : analysis.grade}</div>
                  </div>

                  <div className="score-readout">
                    <p className="score-caption">Adjusted MAO</p>
                    <p className="score-value">{currency(adjustedMao)}</p>
                    <p className="score-subcopy">
                      Base MAO {currency(analysis.metrics.maximumAllowableOffer)} | field deductions {currency(totalAdjustment)}
                    </p>
                  </div>

                  {analysis.failBanner ? <div className="fail-banner">{analysis.failBanner}</div> : null}

                  <div className="metric-grid">
                    <MetricCard label="Roof Deduction" value={currency(Number(formState.roofAdjustment) || 0)} />
                    <MetricCard label="HVAC Deduction" value={currency(Number(formState.hvacAdjustment) || 0)} />
                    <MetricCard label="Sewer Deduction" value={currency(Number(formState.sewerAdjustment) || 0)} />
                    <MetricCard label="Electrical Deduction" value={currency(Number(formState.electricalAdjustment) || 0)} />
                    <MetricCard label="Utility Deduction" value={currency(Number(formState.utilityAdjustment) || 0)} />
                    <MetricCard label="Total Field Deductions" value={currency(totalAdjustment)} />
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-inner">
                  <div className="panel-header">
                    <div>
                      <p className="panel-kicker">Condition signals</p>
                      <h3 className="panel-title">Inspection posture</h3>
                    </div>
                  </div>
                  <div className="condition-grid">
                    <div className={`condition-chip ${fieldChipClass(formState.roofCondition)}`}>Roof {formState.roofCondition}</div>
                    <div className={`condition-chip ${fieldChipClass(formState.hvacCondition)}`}>HVAC {formState.hvacCondition}</div>
                    <div className={`condition-chip ${fieldChipClass(formState.sewerRisk)}`}>Sewer {formState.sewerRisk}</div>
                    <div className={`condition-chip ${fieldChipClass(formState.electricalRisk)}`}>Electrical {formState.electricalRisk}</div>
                    <div className={`condition-chip ${fieldChipClass(formState.utilityMetering)}`}>Utilities {formState.utilityMetering}</div>
                    <div className={`condition-chip ${fieldChipClass(formState.competitiveSupplyRisk)}`}>Supply {formState.competitiveSupplyRisk}</div>
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
                <h4 className="empty-title">No deal basis yet</h4>
                <p className="panel-copy">
                  Save a record with actual price or value assumptions first, then field deductions will mean something.
                </p>
              </div>
            </section>
          )}
        </section>
      </div>
    </PageFrame>
  );
}
