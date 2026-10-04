const Face = ({ className = "" }) => (
  <div className={`op-seal-face ${className}`}>
    <span className="op-seal-top font-display">S &amp; N</span>
    <span className="op-seal-mid font-display">XXV</span>
    <div className="seal-gleam" />
  </div>
);

export const CeremonialSeal = () => (
  <div className="op-seal ceremonial-seal" data-testid="ceremonial-seal">
    <div className="seal-whole">
      <Face />
      <svg className="seal-fracture-svg" viewBox="0 0 100 100" aria-hidden="true">
        <path className="seal-fracture" d="M50 1 L47 17 L54 30 L46 43 L53 57 L48 72 L54 86 L50 99" />
        <path className="seal-fracture seal-fracture-light" d="M50 1 L47 17 L54 30 L46 43 L53 57 L48 72 L54 86 L50 99" />
      </svg>
    </div>
    <div className="seal-half seal-half-left"><Face /></div>
    <div className="seal-half seal-half-right"><Face /></div>
  </div>
);