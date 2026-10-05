import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/scroll";
import { ASSETS } from "../lib/assets";
import { CeremonialSeal } from "./CeremonialSeal";
import { SoundToggle } from "./SoundToggle";

export const SealedInvitation = ({ onOpen, monthsToGo, sound }) => {
  const ref = useRef(null);
  const timeline = useRef(null);
  const exitTween = useRef(null);
  const enterRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(({ selector: q }) => {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: () => setReady(true) });
      if (prefersReducedMotion()) {
        tl.set(q(".candle-velvet"), { opacity: 0.2, clipPath: "circle(100% at 50% 50%)" })
          .to(q(".candle-days-reveal"), { autoAlpha: 1, duration: 0.3 })
          .to(q(".candle-days-reveal"), { autoAlpha: 0, duration: 0.3 }, "+=2.5")
          .to(q(".candle-anchor"), { left: -100, opacity: 0, duration: 0.3 })
          .to(q(".candle-copy"), { opacity: 1, duration: 0.7 });
      } else {
        const mobile = window.matchMedia("(max-width: 700px)").matches;
        tl.to(q(".candle-flame"), { opacity: 1, scaleY: 1, duration: 1.3 }, 0.7)
          .to(q(".candle-wax"), { opacity: 0.8, duration: 1.5 }, 1.3)
          .to(q(".candle-light"), { opacity: 1, duration: 2.5 }, 1.3)
          .to(q(".candle-velvet"), { opacity: 0.85, clipPath: "circle(100% at 50% 50%)", duration: 3 }, 1.5)
          .to(q(".candle-anchor"), { left: mobile ? 42 : 72, top: mobile ? 98 : 118, scale: 0.85, duration: 2.2 }, 2.2)
          .to(q(".candle-days-reveal"), { autoAlpha: 1, duration: 1.1 }, 4.5)
          .to(q(".candle-days-reveal"), { autoAlpha: 0, duration: 0.8 }, 8)
          .addLabel("envelope", 8.9)
          .fromTo(q(".op-env-wrap"), { opacity: 0, y: 45, rotateX: 16 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.8 }, "envelope")
          .fromTo(q(".seal-whole .seal-gleam"), { backgroundPosition: "150% 0" }, { backgroundPosition: "-150% 0", duration: 1.6 }, "envelope+=1.1")
          .to(q(".seal-fracture"), { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, "envelope+=2.1")
          .to(q(".seal-fracture-light"), { opacity: 0.8, duration: 0.5 }, "envelope+=2.8")
          .set(q(".seal-whole"), { opacity: 0 }, "envelope+=3.3")
          .set(q(".seal-half"), { opacity: 1 }, "envelope+=3.3")
          .to(q(".seal-half-left"), { x: -28, y: 26, rotateZ: -22, rotateY: -18, opacity: 0, duration: 1.8 }, "envelope+=3.3")
          .to(q(".seal-half-right"), { x: 28, y: 38, rotateZ: 25, rotateY: 20, opacity: 0, duration: 1.8 }, "envelope+=3.45")
          .to(q(".seal-fracture-light"), { opacity: 0, duration: 0.7 }, "envelope+=3.4")
          .to(q(".op-flap"), { rotateX: -176, duration: 1.7 }, "envelope+=4")
          .to(q(".op-env-card"), { yPercent: -45, duration: 1.8 }, "envelope+=4.8")
          .to(q(".op-env-wrap"), { opacity: 0, y: 18, duration: 1.2 }, "envelope+=7")
          .to(q(".candle-flame"), { skewX: 28, scaleX: 1.6, scaleY: 0.45, duration: 0.8 }, "envelope+=7.7")
          .to(q(".candle-flame"), { scaleY: 0, opacity: 0, duration: 0.7 }, "envelope+=8.35")
          .fromTo(q(".candle-smoke"), { opacity: 0, y: 0 }, { opacity: 0.35, y: -22, duration: 1 }, "envelope+=8.7")
          .to(q(".candle-smoke"), { opacity: 0, y: -58, duration: 1.3 }, "envelope+=9.4")
          .to(q(".candle-velvet, .candle-light, .candle-wax"), { opacity: 0, duration: 1.5 }, "envelope+=8.2")
          .to(q(".candle-anchor"), { left: -100, opacity: 0, duration: 1.2 }, "envelope+=7.8")
          .fromTo(q(".candle-copy"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2 }, "envelope+=10.9");
      }
      timeline.current = tl;
    }, ref);
    return () => { ctx.revert(); exitTween.current?.kill(); };
  }, []);

  useEffect(() => { if (ready) enterRef.current?.focus({ preventScroll: true }); }, [ready]);
  const enter = () => {
    if (!ready || leaving) return;
    setLeaving(true);
    exitTween.current = gsap.to(ref.current, { opacity: 0, duration: 0.7, onComplete: onOpen });
  };

  return <div ref={ref} className="opening candle-opening" data-testid="opening-sequence" aria-label="The Candle — Neha & Saket's invitation">
    <div className="candle-velvet" style={{ backgroundImage: `url(${ASSETS.velvet})` }} aria-hidden="true" />
    <div className="candle-light" aria-hidden="true" />
    <div className="candle-anchor" aria-hidden="true" data-testid="opening-candle">
      <div className="candle-flame"><i /></div><div className="candle-wax"><i /></div><div className="candle-smoke" />
    </div>
    <div className="candle-days-reveal" data-testid="opening-days-reveal">
      <p className="candle-days-number font-display" data-testid="opening-days-count">{monthsToGo ?? "—"}</p>
      <p className="candle-days-label font-display" data-testid="opening-days-label">{monthsToGo === 1 ? "MONTH TO GO" : "MONTHS TO GO"}</p>
      {monthsToGo === null && <p className="candle-days-status" role="status" data-testid="opening-days-sync-status">Confirming the date…</p>}
    </div>
    <div className="candle-copy" data-testid="opening-completed-invitation" aria-hidden={!ready}>
      <p className="eyebrow" data-testid="opening-anniversary-label">TWENTY-FIVE YEARS OF TOGETHERNESS</p>
      <h1 className="candle-names font-serif" data-testid="opening-names">Neha &amp; Saket</h1>
      <p className="candle-numeral font-display" data-testid="opening-anniversary-numeral">XXV</p>
      <p className="candle-date" data-testid="opening-event-date">6 December 2026 · Goa</p>
    </div>
    <div className="op-stage ceremonial-stage" aria-hidden="true">
      <div className="op-env-wrap" data-testid="ceremonial-envelope"><div className="op-env">
        <div className="op-env-body" /><div className="op-env-card font-display"><span>N &amp; S | XXV</span><span className="seal-card-date">6 December 2026</span></div>
        <div className="op-env-front" /><div className="op-flap" />
        <CeremonialSeal />
      </div></div>
    </div>
    <div className="opening-sound-control"><SoundToggle enabled={sound.enabled} status={sound.status} onToggle={sound.toggle} testId="opening-sound-toggle" /></div>
    {!ready && <button type="button" className="candle-skip" data-testid="skip-intro-btn" onClick={() => timeline.current?.progress(1)}>Skip <span aria-hidden="true">→</span></button>}
    {ready && <button ref={enterRef} type="button" className="candle-enter gold-btn" disabled={leaving} data-testid="open-invitation-btn" onClick={enter}>Open invitation <span aria-hidden="true">→</span></button>}
  </div>;
};