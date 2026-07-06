import { PageFrame, PlaceholderPanel } from "../components/ui/PageFrame.jsx";

export default function DueDiligencePage() {
  return (
    <PageFrame
      kicker="Acquisitions / Due Diligence"
      title="Field Mode"
      copy="This is the one-handed inspection page. High-contrast, larger touch targets, and direct underwriting deductions."
    >
      <div className="dashboard-grid">
        <PlaceholderPanel
          title="Physical checklist"
          copy="Roof, sewer, HVAC, electrical, utility metering, and neighborhood observations will live here."
          bullets={[
            "Every required-now issue should directly hit basis or MAO.",
            "Neighborhood vitality remains advisory but visible.",
            "Mark Reviewed will stamp the record as field verified."
          ]}
        />
        <PlaceholderPanel
          title="MAO pressure panel"
          copy="This page should keep a pinned running offer deduction so every finding has a financial consequence."
          emphasis="The dark field workstation treatment belongs here."
        />
      </div>
    </PageFrame>
  );
}
