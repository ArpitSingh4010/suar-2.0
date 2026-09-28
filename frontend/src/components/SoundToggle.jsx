export const SoundToggle = ({ enabled, onToggle }) => (
  <button
    type="button"
    className={`sound-toggle ${enabled ? "is-on" : ""}`}
    onClick={onToggle}
    aria-pressed={enabled}
    aria-label={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
    data-testid="sound-toggle"
  >
    <span className="sound-bars" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
    <span className="sound-label">{enabled ? "SOUND ON" : "SOUND OFF"}</span>
  </button>
);
