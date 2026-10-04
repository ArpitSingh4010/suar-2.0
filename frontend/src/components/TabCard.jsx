import { ArrowRight, Lock } from "lucide-react";

export const TabCard = ({ num, date, title, locked, unlockLabel = "6 November", onClick, testId }) => (
  <button type="button" data-testid={testId} aria-disabled={locked || undefined} onClick={onClick} className={`tab-card ${locked ? "is-locked" : ""}`}>
    <span className="tab-card-num">{num}</span>
    <span className="tab-card-date font-serif">{date}</span>
    <span className="tab-card-title" data-testid={`${testId}-reveal-date`}>{locked ? `Sealed until ${unlockLabel}` : title}</span>
    <span className="tab-card-state">
      {locked ? <Lock size={18} strokeWidth={1.5} /> : <ArrowRight size={18} strokeWidth={1.5} />}
      {locked ? "SEALED" : "ENTER"}
    </span>
  </button>
);
