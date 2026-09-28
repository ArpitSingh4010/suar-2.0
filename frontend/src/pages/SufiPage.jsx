import { SufiNight } from "../sections/SufiNight";
import { TabCard } from "../components/TabCard";
import { Loading } from "../components/Loading";

export default function SufiPage({ events, onNavigate }) {
  if (!events) return <Loading />;
  return (
    <div className="page page-sufi" data-testid="page-sufi">
      <SufiNight data={events.sufi} />
      <section className="next-section" data-testid="sufi-next">
        <p className="eyebrow">THE NEXT MORNING</p>
        <div className="dce-cards">
          <TabCard num="03" date="6 DECEMBER" title="Day Two Events" locked={false} onClick={() => onNavigate("daysix")} testId="sufi-next-card" />
        </div>
        <footer className="site-foot">
          <span className="font-display">S &amp; N — XXV</span>
          <span>GOA · 5–6 DECEMBER 2026</span>
        </footer>
      </section>
    </div>
  );
}
