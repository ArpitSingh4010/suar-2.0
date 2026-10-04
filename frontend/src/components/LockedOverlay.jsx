import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Countdown } from "./Countdown";

const LABEL = { dress: "02 — Dress Code", sufi: "03 — 5th Dec", daysix: "04 — 6th Dec" };

export const LockedOverlay = ({ target, now, unlockAt, onClose }) => {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!target) return;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const key = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") { e.preventDefault(); closeRef.current?.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); previous?.focus(); };
  }, [target, onClose]);
  return <AnimatePresence>{target && (
    <motion.div className="locked-overlay" role="dialog" aria-modal="true" aria-labelledby="locked-title"
      data-testid="locked-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="locked-panel" initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65 }} onClick={e => e.stopPropagation()}>
        <div className="locked-seal" aria-hidden="true"><Lock size={30} strokeWidth={1.4} /></div>
        <p className="eyebrow" data-testid="locked-tab-label">{LABEL[target]}</p>
        <h2 id="locked-title" className="locked-title font-serif" data-testid="locked-title">A little more<br />anticipation.</h2>
        <p className="locked-sub" data-testid="locked-message">This part of your invitation is still sealed.</p>
        <Countdown target={unlockAt ? Date.parse(unlockAt) : null} now={now} testId="unlock-countdown" />
        <p className="locked-note" data-testid="locked-unlock-date">Unlocks {target === "dress" ? "22 October" : "6 November"} 2026<br />12:00 AM IST</p>
        <button ref={closeRef} type="button" className="ghost-btn" onClick={onClose} data-testid="locked-close-btn">Return to invitation</button>
      </motion.div>
    </motion.div>
  )}</AnimatePresence>;
};