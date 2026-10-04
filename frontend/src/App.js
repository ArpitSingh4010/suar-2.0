import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import "./readability.css";
import "./ceremony.css";
import { useServerClock } from "./hooks/useServerClock";
import { useLenis } from "./hooks/useLenis";
import { useAmbientAudio } from "./hooks/useAmbientAudio";
import { fetchDressCode, fetchEvents } from "./lib/api";
import { ScrollTrigger } from "./lib/scroll";
import { SealedInvitation } from "./components/SealedInvitation";
import { FeatherReveal } from "./components/FeatherReveal";
import { Nav } from "./components/Nav";
import { LockedOverlay } from "./components/LockedOverlay";
import { TabTransition } from "./components/TabTransition";
import LocationPage from "./pages/LocationPage";
import DressCodePage from "./pages/DressCodePage";
import SufiPage from "./pages/SufiPage";
import DaySixPage from "./pages/DaySixPage";

export default function App() {
  const clock = useServerClock();
  const [opened, setOpened] = useState(false);
  const [tab, setTab] = useState("location");
  const [pending, setPending] = useState(null);
  const [lockedTarget, setLockedTarget] = useState(null);
  const [events, setEvents] = useState(null);
  const [dress, setDress] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const timers = useRef([]);
  const lenisRef = useLenis(opened && !pending && !lockedTarget);
  const sound = useAmbientAudio();
  const dressOpen = clock.tabs.dress.unlocked;

  useEffect(() => {
    let alive = true;
    setLoadError(false);
    const jobs = [];
    if (clock.unlocked && !events) jobs.push(fetchEvents().then(data => { if (alive) setEvents(data); }));
    if (dressOpen && !dress) jobs.push(fetchDressCode().then(data => { if (alive) setDress(data); }));
    Promise.all(jobs).catch(() => { if (alive) setLoadError(true); });
    return () => { alive = false; };
  }, [clock.unlocked, dressOpen, events, dress, retry]);

  useEffect(() => {
    if (!clock.tabs[tab]?.unlocked) setTab("location");
    if (lockedTarget && clock.tabs[lockedTarget]?.unlocked) setLockedTarget(null);
  }, [clock.tabs, tab, lockedTarget]);

  useEffect(() => {
    if (opened) ScrollTrigger.refresh();
  }, [opened, tab]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const requestTab = useCallback((id) => {
    if (!clock.tabs[id]?.unlocked) return setLockedTarget(id);
    if (id === pending || (id === tab && !pending)) return;
    // A new choice supersedes the old transition instead of silently dropping it.
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (id === tab) return setPending(null);
    setPending(id);
    timers.current.push(setTimeout(() => {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      setTab(id);
    }, 950));
    if (id !== "daysix") timers.current.push(setTimeout(() => setPending(null), 1900));
  }, [tab, pending, clock.tabs, lenisRef]);
  const open = useCallback(() => setOpened(true), []);
  const finishFeather = useCallback(() => setPending(null), []);
  const closeLock = useCallback(() => setLockedTarget(null), []);

  return (
    <div className={`app theme-${opened ? tab : "opening"}`} data-testid="app-root">
      <div className="grain" aria-hidden="true" />
      {opened && <Nav active={tab} tabs={clock.tabs} onSelect={requestTab} sound={sound} />}
      <main id="main" data-testid="main-content" inert={Boolean(!opened || pending || lockedTarget)}>
        {opened && <>
          {clock.error && <p className="connection-note" role="status" data-testid="clock-connection-error">Reconnecting to confirm the reveal dates. Location is still available.</p>}
          {loadError && tab !== "location" ? <div className="loading" role="alert" data-testid="content-load-error">
            <p>Your invitation could not be loaded.</p><button className="gold-btn" data-testid="retry-content-button" onClick={() => setRetry(n => n + 1)}>Try again</button>
          </div> : <>
            {tab === "location" && <LocationPage dressOpen={dressOpen} onNavigate={requestTab} />}
            {tab === "dress" && dressOpen && <DressCodePage data={dress} locked={!clock.unlocked} onNavigate={requestTab} />}
            {tab === "sufi" && clock.unlocked && <SufiPage events={events} onNavigate={requestTab} />}
            {tab === "daysix" && clock.unlocked && <DaySixPage events={events} />}
          </>}
        </>}
      </main>
      {pending === "daysix" ? <FeatherReveal onComplete={finishFeather} /> : <TabTransition target={pending} />}
      <LockedOverlay target={lockedTarget} now={clock.now} unlockAt={clock.tabs[lockedTarget]?.unlock_at} onClose={closeLock} />
      {!opened && <SealedInvitation onOpen={open} monthsToGo={clock.monthsToGo} sound={sound} />}
    </div>
  );
}