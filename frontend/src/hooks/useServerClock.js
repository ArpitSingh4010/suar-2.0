import { useEffect, useMemo, useState } from "react";
import { fetchTime } from "../lib/api";

const UNLOCK_FALLBACK = Date.UTC(2026, 10, 5, 18, 30, 0);
const EVENT_FALLBACK = Date.UTC(2026, 11, 4, 18, 30, 0);

export function useServerClock() {
  const previewKey = useMemo(() => {
    const p = new URLSearchParams(window.location.search).get("preview");
    if (p) sessionStorage.setItem("xxv-preview", p);
    return p || sessionStorage.getItem("xxv-preview") || "";
  }, []);

  const [sync, setSync] = useState({
    offset: 0,
    unlockAt: UNLOCK_FALLBACK,
    eventAt: EVENT_FALLBACK,
    serverUnlocked: false,
    daysToGo: null,
    synced: false,
  });
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const t0 = Date.now();
        const data = await fetchTime(previewKey);
        const serverMs = new Date(data.server_time).getTime() + (Date.now() - t0) / 2;
        if (!alive) return;
        setSync({
          offset: serverMs - Date.now(),
          unlockAt: new Date(data.unlock_at).getTime(),
          eventAt: new Date(data.event_at).getTime(),
          serverUnlocked: data.unlocked,
          daysToGo: data.days_to_go,
          synced: true,
        });
      } catch (e) {
        console.error("time sync failed", e);
      }
    };
    run();
    const id = setInterval(run, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [previewKey]);

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const now = tick + sync.offset;
  const unlocked = sync.serverUnlocked || (sync.synced && now >= sync.unlockAt);
  const daysToGo = sync.daysToGo ?? Math.max(0, Math.ceil((sync.eventAt - now) / 86_400_000));

  return { now, unlocked, daysToGo, unlockAt: sync.unlockAt, synced: sync.synced, previewKey };
}
