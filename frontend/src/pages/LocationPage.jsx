import { GoaHero } from "../sections/GoaHero";
import { TabCard } from "../components/TabCard";

export default function LocationPage({ dressOpen, onNavigate }) {
  return (
    <div className="page page-location" data-testid="page-location">
      <GoaHero />
      <section className="location-closing" data-testid="location-celebration">
        <p className="eyebrow" data-testid="location-anniversary-label">TWENTY-FIVE YEARS OF TOGETHERNESS</p>
        <h1 className="font-serif" data-testid="location-couple-names">Saket &amp; Neha</h1>
        <p className="location-date font-serif" data-testid="location-event-date">6 December 2026 · Goa</p>
        <p className="location-note" data-testid="location-celebration-dates">Celebrating together, 5–6 December 2026.</p>
        <div className="dce-cards">
          <TabCard num="02" date="Dress Code" title="A palette for every moment" locked={!dressOpen}
            unlockLabel="22 October" onClick={() => onNavigate("dress")} testId="location-dress-card" />
        </div>
        <footer className="site-foot" data-testid="location-footer"><span className="font-display">S &amp; N | XXV</span><span>WITH LOVE, ALWAYS</span></footer>
      </section>
    </div>
  );
}