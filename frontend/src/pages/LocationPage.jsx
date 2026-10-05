import { GoaHero } from "../sections/GoaHero";
import { TabCard } from "../components/TabCard";

export default function LocationPage({ dressOpen, onNavigate }) {
  return (
    <div className="page page-location" data-testid="page-location">
      <GoaHero />
      <section className="location-closing" data-testid="location-celebration">
        <p className="eyebrow" data-testid="location-anniversary-label">TWENTY-FIVE YEARS OF TOGETHERNESS</p>
        <h1 className="font-serif" data-testid="location-couple-names">Neha &amp; Saket</h1>
        <p className="location-date font-serif" data-testid="location-event-date">6 December 2026 <span>Goa</span></p>
        {dressOpen ? <div className="dce-cards">
          <TabCard num="02" date="Dress Code" title="A palette for every moment" locked={false}
            onClick={() => onNavigate("dress")} testId="location-dress-card" />
        </div> : <div className="location-teaser" data-testid="location-suspense-message">
          <span className="location-teaser-line" aria-hidden="true" />
          <p className="font-serif">Something Exciting Coming Up Soon!</p>
        </div>}
        <footer className="site-foot" data-testid="location-footer"><span className="font-display">N &amp; S | XXV</span><span>WITH LOVE, ALWAYS</span></footer>
      </section>
    </div>
  );
}