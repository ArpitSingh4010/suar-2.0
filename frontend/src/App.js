import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useServerClock } from "./hooks/useServerClock";
import { useLenis } from "./hooks/useLenis";
import { useAmbientAudio } from "./hooks/useAmbientAudio";
import { fetchEvents } from "./lib/api";
import { ScrollTrigger } from "./lib/scroll";
import { SealedInvitation } from "./components/SealedInvitation";
import { Nav } from "./components/Nav";
import { LockedOverlay } from "./components/LockedOverlay";
import { TabTransition } from "./components/TabTransition";
import DressCodePage from "./pages/DressCodePage";
import SufiPage from "./pages/SufiPage";
import DaySixPage from "./pages/DaySixPage";

export default function App() {
  const clock = useServerClock();
  const [opened, setOpened] = useState(false);
  const [tab, setTab] = useState("dress");
  const [pending, setPending] = useState(null);
  const [lockedTarget, setLockedTarget] = useState(null);
  const [events, setEvents] = useState(null);
  const lenisRef = useLenis(opened);
  const sound = useAmbientAudio(opened ? tab : "opening");

  useEffect(() => {
    if (!clock.unlocked || events) return;
    fetchEvents(clock.previewKey).then(setEvents).catch((e) => console.error("events locked", e));
  }, [clock.unlocked, clock.previewKey, events]);

  useEffect(() => {
    if (!clock.unlocked && tab !== "dress") setTab("dress");
  }, [clock.unlocked, tab]);

  const requestTab = useCallback(
    (id) => {
      if (id === tab || pending) return;
      if (id !== "dress" && !clock.unlocked) {
        setLockedTarget(id);
        return;
      }
      setPending(id);
      setTimeout(() => {
        setTab(id);
        lenisRef.current?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
      }, 950);
      setTimeout(() => setPending(null), 1900);
    },
    [tab, pending, clock.unlocked, lenisRef]
  );

  return (
    <div className={`app theme-${opened ? tab : "opening"}`} data-testid="app-root">
      <div className="grain" aria-hidden="true" />
      {opened && <Nav active={tab} unlocked={clock.unlocked} onSelect={requestTab} sound={sound} />}
      <main id="main" data-testid="main-content">
        {tab === "dress" && <DressCodePage locked={!clock.unlocked} onNavigate={requestTab} />}
        {tab === "sufi" && <SufiPage events={events} onNavigate={requestTab} />}
        {tab === "daysix" && <DaySixPage events={events} />}
      </main>
      <TabTransition target={pending} />
      <LockedOverlay target={lockedTarget} now={clock.now} unlockAt={clock.unlockAt} onClose={() => setLockedTarget(null)} />
      {!opened && <SealedInvitation daysToGo={clock.daysToGo} onOpen={() => setOpened(true)} />}
    </div>
  );
}
