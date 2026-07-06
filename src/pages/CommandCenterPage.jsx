import { MetricCard } from "../components/ui/FieldControls.jsx";
import { PageFrame, PlaceholderPanel } from "../components/ui/PageFrame.jsx";
import { buildDealFromState } from "../fixtures/quickScreenState.js";
import { analyzeDeal } from "../utils/underwriteMath.js";

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

export default function CommandCenterPage({ formState, records, activeRecordId, onSelectRecord, onCreateRecord }) {
  const analysis = analyzeDeal(buildDealFromState(formState));

  return (
    <PageFrame
      kicker="Command Center"
      title="One desk, one active record"
      copy="This becomes the always-home page. For now it summarizes the live Quick Screen deal and previews the lifecycle split."
      actions={
        <button className="primary-button" type="button" onClick={onCreateRecord}>
          New Record
        </button>
      }
    >
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-inner">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Live snapshot</p>
                <h3 className="panel-title">Current acquisition pulse</h3>
              </div>
              <div className={`status-badge ${analysis.grade}`}>{analysis.grade}</div>
            </div>
            <div className="metric-grid">
              <MetricCard label="Score" value={analysis.score} />
              <MetricCard label="DSCR" value={`${analysis.metrics.dscr.toFixed(2)}x`} />
              <MetricCard label="Cash Flow" value={currency(analysis.metrics.annualLeveredCashFlow)} />
              <MetricCard label="MAO" value={currency(analysis.metrics.maximumAllowableOffer)} />
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-inner">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Acquisitions track</p>
                <h3 className="panel-title">Stored records</h3>
                <p className="panel-copy">These cards now come from persisted local records, not a single transient form.</p>
              </div>
            </div>
            <div className="record-grid">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  className="record-card"
                  data-active={record.id === activeRecordId}
                  onClick={() => onSelectRecord(record.id)}
                >
                  <div className="record-head">
                    <span className={`status-badge compact ${record.grade}`}>{record.grade}</span>
                    <span className="record-score">{record.score}</span>
                  </div>
                  <strong className="record-title">{record.recordName}</strong>
                  <span className="record-address">{record.address}</span>
                  <div className="record-metrics">
                    <span>DSCR {record.dscr.toFixed(2)}x</span>
                    <span>{currency(record.cashFlow)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <PlaceholderPanel
          title="Portfolio track"
          copy="This side will hold active assets, monthly cash-flow posture, and archive behavior after sale."
          emphasis="Phase 2 persistence is now in place locally. The next storage step is a real database-backed property table."
        />
      </div>
    </PageFrame>
  );
}
