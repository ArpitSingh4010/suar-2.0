import { Fragment } from "react";

const pad = (n) => String(n).padStart(2, "0");

export const Countdown = ({ target, now, testId = "countdown" }) => {
  const ready = Number.isFinite(target) && Number.isFinite(now);
  const diff = ready ? Math.max(0, target - now) : 0;
  const units = [
    ["DAYS", Math.floor(diff / 86_400_000)],
    ["HOURS", Math.floor(diff / 3_600_000) % 24],
    ["MINUTES", Math.floor(diff / 60_000) % 60],
    ["SECONDS", Math.floor(diff / 1000) % 60],
  ];
  return (
    <div className="countdown" data-testid={testId} role="timer" aria-live="off">
      {units.map(([label, val], i) => (
        <Fragment key={label}>
          {i > 0 && <span className="cd-sep" aria-hidden="true">:</span>}
          <div className="cd-unit">
            <span className="cd-val" data-testid={`${testId}-${label.toLowerCase()}`}>{ready ? pad(val) : "—"}</span>
            <span className="cd-label" data-testid={`${testId}-${label.toLowerCase()}-label`}>{label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
