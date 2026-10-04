import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/scroll";
import { ASSETS } from "../lib/assets";

export const FeatherReveal = ({ onComplete }) => {
  const ref = useRef(null);
  const timeline = useRef(null);
  useLayoutEffect(() => {
    const previousFocus = document.activeElement;
    ref.current.querySelector("button")?.focus();
    const ctx = gsap.context(({ selector: q }) => {
      const reduced = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: "sine.inOut" }, onComplete });
      tl.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.8 })
        .fromTo(q(".feather-card"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.6 }, 0.5);
      if (!reduced) {
        tl.fromTo(q(".falling-feather"), { opacity: 0, y: -250, x: -150, rotation: -28 }, { opacity: 1, y: -175, x: -65, rotation: 22, duration: 1.6 }, 0.6)
          .to(q(".falling-feather"), { y: -95, x: -112, rotation: -18, duration: 1.6 })
          .to(q(".falling-feather"), { y: -30, x: -24, rotation: 8, duration: 1.3 })
          .to(q(".falling-feather"), { y: 0, x: 0, rotation: -8, duration: 1.1 });
      } else tl.set(q(".falling-feather"), { opacity: 1, rotation: -8 }, 0.5);
      tl.to(q(".feather-monogram"), { opacity: 1, y: 0, duration: 1 }, reduced ? 1 : 5.6)
        .to(q(".feather-title"), { opacity: 1, y: 0, duration: 1.2 }, "-=0.4")
        .to(q(".feather-card-date"), { opacity: 1, duration: 0.8 }, "-=0.5")
        .addLabel("leave", "+=2.5")
        .to(ref.current, { opacity: 0, duration: 1 }, "leave");
      timeline.current = tl;
    }, ref);
    return () => { ctx.revert(); previousFocus?.focus(); };
  }, [onComplete]);
  return <div ref={ref} className="feather-reveal" role="dialog" aria-modal="true" aria-label="The Masquerade Ball invitation" data-testid="feather-reveal"
    onKeyDown={e => {
      if (e.key === "Escape") timeline.current?.seek("leave");
      if (e.key === "Tab") { e.preventDefault(); ref.current.querySelector("button")?.focus(); }
    }}>
    <div className="feather-velvet" style={{ backgroundImage: `url(${ASSETS.velvet})` }} aria-hidden="true" />
    <div className="feather-stage">
      <div className="feather-card" data-testid="feather-invitation-card">
        <div className="feather-card-inner">
          <p className="feather-monogram font-display" data-testid="feather-monogram">N &amp; S | XXV</p>
          <h2 className="feather-title font-serif" data-testid="feather-title">The Masquerade<br />Ball</h2>
          <p className="feather-card-date" data-testid="feather-event-date">6 December 2026 · Evening</p>
        </div>
      </div>
      <img className="falling-feather" src="/images/black-feather.webp" alt="A black feather settling on a gold invitation" data-testid="falling-feather" />
    </div>
    <button type="button" className="feather-continue ghost-btn" data-testid="feather-continue-button" onClick={() => timeline.current?.seek("leave")}>Continue <span aria-hidden="true">→</span></button>
  </div>;
};