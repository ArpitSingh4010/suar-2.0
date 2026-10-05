import { PoolParty } from "../sections/PoolParty";
import { MasqueradeBall } from "../sections/MasqueradeBall";
import { Finale } from "../sections/Finale";
import { Loading } from "../components/Loading";

export default function DaySixPage({ events }) {
  if (!events) return <Loading />;
  return (
    <div className="page page-daysix" data-testid="page-daysix">
      <PoolParty data={events.pool} maskSrc={events.masquerade.images.mask} />
      <MasqueradeBall data={events.masquerade} />
      <Finale data={events.finale} />
      <footer className="site-foot fin-foot">
        <span className="font-display">N &amp; S — XXV</span>
        <span>WITH LOVE</span>
      </footer>
    </div>
  );
}
