import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Countdown } from "./Countdown";

const LABEL = { sufi: "02 — 5 DECEMBER", daysix: "03 — 6 DECEMBER" };

export const LockedOverlay = ({ target, now, unlockAt, onClose }) => (
  <AnimatePresence>
    {target && (
      <motion.div
        className="locked-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="locked-title"
        data-testid="locked-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
      >
        <motion.div
          className="locked-panel"
          initial={{ y: 28, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="locked-seal"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -7, 7, -4, 0] }}
            transition={{ duration: 0.8, delay: 0.3 }}
            aria-hidden="true"
          >
            <Lock size={22} strokeWidth={1.4} />
          </motion.div>
          <p className="eyebrow" data-testid="locked-tab-label">{LABEL[target]}</p>
          <h2 id="locked-title" className="locked-title font-serif" data-testid="locked-title">Oops...</h2>
          <p className="locked-sub" data-testid="locked-message">You'll have to wait a little more.</p>
          <Countdown target={unlockAt} now={now} testId="unlock-countdown" />
          <p className="locked-note">Unlocks 6 November 2026 · 12:00 AM IST</p>
          <button type="button" className="ghost-btn" onClick={onClose} data-testid="locked-close-btn">
            Return to the dress code
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
