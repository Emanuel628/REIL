import { PageFrame, PlaceholderPanel } from "../components/ui/PageFrame.jsx";

export default function UnderwritingPage() {
  return (
    <PageFrame
      kicker="Acquisitions / Underwriting"
      title="Full Underwriting"
      copy="This page will expand the quick pass into the full financing and normalized-expense workflow."
    >
      <div className="dashboard-grid">
        <PlaceholderPanel
          title="Normalized expense engine"
          copy="Seller numbers get replaced with real tax, insurance, maintenance, management, and reserve logic."
          bullets={[
            "Separate in-place and market rent assumptions.",
            "Show amortizing and IO scenarios side by side without letting IO fake safety.",
            "Pin the DSCR stress response directly beside the debt inputs."
          ]}
        />
        <PlaceholderPanel
          title="Results sheet"
          copy="This panel becomes the sticky readout for DSCR, LTV, debt yield, cash-on-cash, and maximum allowable offer."
          emphasis="Phase 3 should build this page for real."
        />
      </div>
    </PageFrame>
  );
}
