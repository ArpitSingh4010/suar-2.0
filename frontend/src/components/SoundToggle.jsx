export const SoundToggle = ({ enabled, status, onToggle, testId = "sound-toggle" }) => {
  const unavailable = status === "unavailable";
  const label = enabled ? "MUSIC ON" : status === "blocked" ? "ENABLE MUSIC" : status === "loading" ? "MUSIC STARTING" : unavailable ? "MUSIC UNAVAILABLE" : "MUSIC OFF";
  return <button type="button" className={`sound-toggle ${enabled ? "is-on" : ""}`}
    onClick={onToggle} disabled={unavailable} aria-pressed={enabled}
    aria-label={unavailable ? "Music is unavailable in this browser" : enabled ? "Turn masquerade music off" : "Turn masquerade music on"}
    title={unavailable ? "Music is unavailable in this browser" : "Masquerade waltz"}
    data-testid={testId} data-sound-control="true" data-audio-state={status}>
    <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
    <span className="sound-label" data-testid={`${testId}-label`}>{label}</span>
  </button>;
};