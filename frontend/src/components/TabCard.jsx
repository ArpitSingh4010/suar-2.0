import { ArrowRight, Lock } from "lucide-react";

export const TabCard = ({ num, date, title, locked, onClick, testId }) => (
  <button type="button" data-testid={testId} onClick={onClick} className={`tab-card ${locked ? "is-locked" : ""}`}>
    <span className="tab-card-num">{num}</span>
    <span className="tab-card-date font-serif">{date}</span>
    <span className="tab-card-title">{locked ? "Sealed until 6 November" : title}</span>
    <span className="tab-card-state">
      {locked ? <Lock size={12} strokeWidth={1.5} /> : <ArrowRight size={12} strokeWidth={1.5} />}
      {locked ? "SEALED" : "ENTER"}
    </span>
  </button>
);
