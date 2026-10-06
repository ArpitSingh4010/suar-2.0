import { useEffect, useState } from "react";
import { fetchTime } from "../lib/api";

const CLOSED = { location: { unlocked: true }, dress: { unlocked: false }, sufi: { unlocked: false }, daysix: { unlocked: false } };
const EVENT_AT = Date.parse("2026-12-06T00:00:00+05:30");

function calendarMonthsBetween(startMs, endMs) {
  const istOffset = 330 * 60 * 1000;
  const start = new Date(startMs + istOffset);
  const end = new Date(endMs + istOffset);
  return Math.max(
    0,
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12
      + end.getUTCMonth() - start.getUTCMonth()
      - (end.getUTCDate() < start.getUTCDate() ? 1 : 0),
  );
}

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
  const eventAt = sync ? Date.parse(sync.event_at) : EVENT_AT;
  const tabs = error ? CLOSED : sync?.tabs || CLOSED;
  // The invitation can show an immediate visual countdown while server time syncs.
  const monthsToGo = calendarMonthsBetween(now ?? Date.now(), eventAt);
  return {
    now, eventAt, tabs, error, synced: !!sync,
    monthsToGo,
    unlocked: tabs.sufi.unlocked,
  };
}