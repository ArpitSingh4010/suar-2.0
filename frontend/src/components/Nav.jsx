import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { TABS } from "../lib/assets";
import { SoundToggle } from "./SoundToggle";

export const Nav = ({ active, tabs, onSelect, sound }) => (
  <motion.header className="nav" data-testid="main-nav" initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
    <button type="button" onClick={() => onSelect("location")} className="nav-mark font-display"
      data-testid="nav-monogram" aria-label="Neha & Saket — return to Location">
      N<span>&amp;</span>S <em>XXV</em>
    </button>
    <nav className="nav-tabs" aria-label="Invitation sections" data-testid="invitation-tabs">
      {TABS.map(t => {
        const locked = !tabs[t.id]?.unlocked;
        return (
          <button key={t.id} type="button" data-testid={`tab-${t.id}`}
            className={`nav-tab ${t.id === active ? "is-active" : ""} ${locked ? "is-locked" : ""}`}
            aria-current={t.id === active ? "page" : undefined} aria-disabled={locked || undefined}
            aria-label={`${t.label}${locked ? ", locked" : ""}`} onClick={() => onSelect(t.id)}>
            <span className="nav-num" aria-hidden="true">{t.num}</span>
            <span className="nav-label">{t.label}</span>
            {locked && <Lock size={16} strokeWidth={1.7} className="nav-lock" data-testid={`lock-${t.id}`} aria-hidden="true" />}
            {t.id === active && <motion.span layoutId="nav-underline" className="nav-underline" />}
          </button>
        );
      })}
    </nav>
    <SoundToggle enabled={sound.enabled} status={sound.status} onToggle={sound.toggle} />
  </motion.header>
);