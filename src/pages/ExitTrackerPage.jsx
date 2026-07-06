import { PageFrame, PlaceholderPanel } from "../components/ui/PageFrame.jsx";

export default function ExitTrackerPage() {
  return (
    <PageFrame
      kicker="Portfolio / Exit"
      title="Capital Recycling and Exit Tracker"
      copy="This page will hold BRRRR, refi pull, 1031 timing, and the passive-alternative comparison."
    >
      <div className="dashboard-grid">
        <PlaceholderPanel
          title="Decision stack"
          copy="BRRRR, 1031, and opportunity cost are sequential decisions, not three unrelated widgets."
          bullets={[
            "Legal 45-day and 180-day timers must be rigid.",
            "Municipal-bond comparison stays visible as a discipline check.",
            "A weak hold should tell you to walk, not flatter the asset."
          ]}
        />
        <PlaceholderPanel
          title="Exit discipline"
          copy="The logic here will lean heavily on the doctrine already written in Phase 1."
        />
      </div>
    </PageFrame>
  );
}
