import { useEffect, useState } from "react";

import CommandCenterPage from "./pages/CommandCenterPage.jsx";
import DueDiligencePage from "./pages/DueDiligencePage.jsx";
import ExitTrackerPage from "./pages/ExitTrackerPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import QuickScreenPage from "./pages/QuickScreenPage.jsx";
import UnderwritingPage from "./pages/UnderwritingPage.jsx";
import { buildQuickScreenState } from "./fixtures/quickScreenState.js";
import { strongRentalDeal } from "./fixtures/sampleDeals.js";

const NAV_ITEMS = [
  { id: "command-center", label: "Command Center", section: "Home" },
  { id: "quick-screen", label: "Quick Screen", section: "Acquisitions" },
  { id: "underwriting", label: "Underwriting", section: "Acquisitions" },
  { id: "due-diligence", label: "Due Diligence", section: "Acquisitions" },
  { id: "portfolio", label: "Portfolio", section: "Ownership" },
  { id: "exit-tracker", label: "Exit Tracker", section: "Ownership" }
];

export default function App() {
  const [theme, setTheme] = useState("light");
  const [activePage, setActivePage] = useState("command-center");
  const [formState, setFormState] = useState(buildQuickScreenState(strongRentalDeal));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function renderPage() {
    switch (activePage) {
      case "quick-screen":
        return <QuickScreenPage formState={formState} setFormState={setFormState} />;
      case "underwriting":
        return <UnderwritingPage />;
      case "due-diligence":
        return <DueDiligencePage />;
      case "portfolio":
        return <PortfolioPage />;
      case "exit-tracker":
        return <ExitTrackerPage />;
      case "command-center":
      default:
        return <CommandCenterPage formState={formState} />;
    }
  }

  return (
    <div className="app-shell workspace-shell">
      <aside className="sidebar panel">
        <div className="panel-inner sidebar-inner">
          <div className="brand-block">
            <div className="brand-chip">REIL Workspace</div>
            <h1 className="sidebar-title">Real Estate Investing Lab</h1>
            <p className="hero-copy">
              One property record, two tracks, and a single underwriting language.
            </p>
          </div>

          <nav className="nav-stack" aria-label="Workspace sections">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="nav-item"
                data-active={activePage === item.id}
                onClick={() => setActivePage(item.id)}
              >
                <span className="nav-section">{item.section}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="theme-toggle" type="button" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </button>
          </div>
        </div>
      </aside>

      <main className="content-shell">{renderPage()}</main>
    </div>
  );
}
