import { PageFrame, PlaceholderPanel } from "../components/ui/PageFrame.jsx";

export default function PortfolioPage() {
  return (
    <PageFrame
      kicker="Portfolio"
      title="Active Portfolio Manager"
      copy="This becomes the post-close ledger: baseline, actuals, variance, and unit-level rent roll."
    >
      <div className="dashboard-grid">
        <PlaceholderPanel
          title="Ledger table"
          copy="Underwritten baseline versus actual performance needs its own ruled table and sharp mono numerics."
          bullets={[
            "Variance rows should highlight negative drift immediately.",
            "This page requires the future units table.",
            "Rent roll belongs under the cash-flow summary, not in a separate app."
          ]}
        />
        <PlaceholderPanel
          title="Refi monitor"
          copy="Seasoning, equity build, and stabilized-asset state should live beside the ledger."
        />
      </div>
    </PageFrame>
  );
}
