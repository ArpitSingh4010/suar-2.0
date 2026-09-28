import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { TABS } from "../lib/assets";
import { SoundToggle } from "./SoundToggle";

export const Nav = ({ active, unlocked, onSelect, sound }) => {
  const prev = useRef(unlocked);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    if (!prev.current && unlocked) {
      setRevealing(true);
      const t = setTimeout(() => setRevealing(false), 5000);
      return () => clearTimeout(t);
    }
    prev.current = unlocked;
  }, [unlocked]);

  return (
    <motion.header
      className="nav"
      data-testid="main-nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#main" className="nav-mark font-display" data-testid="nav-monogram" aria-label="Saket and Neha, twenty-five">
        S<span>&amp;</span>N <em>XXV</em>
      </a>
      <nav className="nav-tabs" aria-label="Invitation sections">
        {TABS.map((t) => {
          const locked = t.id !== "dress" && !unlocked;
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              data-testid={`tab-${t.id}`}
              className={`nav-tab ${isActive ? "is-active" : ""} ${locked ? "is-locked" : ""} ${revealing && t.id !== "dress" ? "is-revealing" : ""}`}
              aria-current={isActive ? "page" : undefined}
              aria-disabled={locked || undefined}
              onClick={() => onSelect(t.id)}
            >
              <span className="nav-num">{t.num}</span>
              <span className="nav-dash" aria-hidden="true">—</span>
              <span className="nav-label">{t.label}</span>
              <span className="nav-label-short">{t.short}</span>
              {locked && <Lock size={11} strokeWidth={1.6} className="nav-lock" aria-label="Locked" />}
              {isActive && <motion.span layoutId="nav-underline" className="nav-underline" />}
              {revealing && t.id !== "dress" && <span className="nav-revealed">NOW REVEALED</span>}
            </button>
          );
        })}
      </nav>
      <SoundToggle enabled={sound.enabled} onToggle={sound.toggle} />
    </motion.header>
  );
};
