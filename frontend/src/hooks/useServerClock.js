import { useEffect, useState } from "react";
import { fetchTime } from "../lib/api";

const CLOSED = { location: { unlocked: true }, dress: { unlocked: false }, sufi: { unlocked: false }, daysix: { unlocked: false } };

export function useServerClock() {
  const [sync, setSync] = useState(null);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(performance.now());

  useEffect(() => {
    let alive = true;
    let timer;
    let inFlight = false;
    const run = async () => {
      if (inFlight) return;
      inFlight = true;
      clearTimeout(timer);
      let delay = 60000;
      try {
        const start = performance.now();
        const data = await fetchTime();
        const received = performance.now();
        const serverMs = Date.parse(data.server_time) + (received - start) / 2;
        if (!alive) return;
        setSync({ ...data, serverMs, received });
        setTick(received);
        setError(false);
        const boundaries = Object.values(data.tabs).filter(t => !t.unlocked && t.unlock_at)
          .map(t => Date.parse(t.unlock_at) - serverMs + 100);
        if (boundaries.length) delay = Math.min(delay, Math.max(250, Math.min(...boundaries)));
      } catch {
        if (alive) setError(true);
        delay = 10000;
      } finally {
        inFlight = false;
        if (alive) timer = setTimeout(run, delay);
      }
    };
    const visible = () => { if (document.visibilityState === "visible") run(); };
    run();
    window.addEventListener("online", run);
    document.addEventListener("visibilitychange", visible);
    return () => {
      alive = false;
      clearTimeout(timer);
      window.removeEventListener("online", run);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTick(performance.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // A monotonic clock keeps the countdown smooth even if the device date changes.
  // Access is NEVER inferred from this countdown: only the server's flags grant it.
  const now = sync ? sync.serverMs + Math.max(0, tick - sync.received) : null;
  const eventAt = sync ? Date.parse(sync.event_at) : null;
  const tabs = error ? CLOSED : sync?.tabs || CLOSED;
  const monthsToGo = now === null ? null : Math.max(
    0,
    (new Date(eventAt).getUTCFullYear() - new Date(now).getUTCFullYear()) * 12
      + new Date(eventAt).getUTCMonth() - new Date(now).getUTCMonth()
      - (new Date(eventAt).getUTCDate() < new Date(now).getUTCDate() ? 1 : 0),
  );
  return {
    now, eventAt, tabs, error, synced: !!sync,
    monthsToGo,
    unlocked: tabs.sufi.unlocked,
  };
}