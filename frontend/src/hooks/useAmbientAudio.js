import { useCallback, useEffect, useRef, useState } from "react";
import { createMasqueradePlayer } from "../lib/masqueradePlayer";

export function useAmbientAudio() {
  const [status, setStatus] = useState("blocked");
  const statusRef = useRef("blocked");
  const player = useRef(null);
  const wanted = useRef(true);

  useEffect(() => {
    let alive = true;
    const update = next => {
      if (alive) { statusRef.current = next; setStatus(next); }
    };
    try {
      player.current = createMasqueradePlayer(update);
      player.current.start();
    } catch { update("unavailable"); }
    const unlock = event => {
      if (event.target instanceof Element && event.target.closest("[data-sound-control]")) return;
      if (wanted.current && statusRef.current !== "playing") player.current?.start();
    };
    const gestures = ["pointerdown", "pointerup", "click", "keydown"];
    gestures.forEach(event => document.addEventListener(event, unlock));
    return () => {
      alive = false;
      gestures.forEach(event => document.removeEventListener(event, unlock));
      player.current?.close();
      player.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    if (statusRef.current === "playing" || statusRef.current === "loading") {
      wanted.current = false;
      player.current?.mute();
    } else {
      wanted.current = true;
      player.current?.start();
    }
  }, []);
  return { enabled: status === "playing", status, toggle };
}