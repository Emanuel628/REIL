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

export default function CommandCenterPage({ formState }) {
  const analysis = analyzeDeal(buildDealFromState(formState));

  return (
    <PageFrame
      kicker="Command Center"
      title="One desk, one active record"
      copy="This becomes the always-home page. For now it summarizes the live Quick Screen deal and previews the lifecycle split."
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

        <PlaceholderPanel
          title="Acquisitions track"
          copy="This area will become the pipeline card grid with score lamps, filters, and status progression."
          bullets={[
            "Lead cards will summarize score, price, and status.",
            "Closing a deal will move the same record into the ownership track.",
            "The Quick Screen page is already feeding the shape of this view."
          ]}
        />

        <PlaceholderPanel
          title="Portfolio track"
          copy="This side will hold active assets, monthly cash-flow posture, and archive behavior after sale."
          emphasis="Phase 2 intentionally stops short of persistence. The structure is here; the database comes next."
        />
      </div>
    </PageFrame>
  );
}
