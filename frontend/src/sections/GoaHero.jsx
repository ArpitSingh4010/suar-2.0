import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { ASSETS } from "../lib/assets";
import { Split } from "../components/Split";

export const GoaHero = () => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 3.5, reduced);
    tl.fromTo(q(".goa-bg"), { scale: 1.35, filter: "brightness(0.12) saturate(0.5)" }, { scale: 1.04, filter: "brightness(1) saturate(1.05)", duration: 1.3 }, 0)
      .to(q(".goa-hint"), { opacity: 0, duration: 0.2 }, 0.1)
      .fromTo(q(".goa-shimmer"), { xPercent: -25, opacity: 0 }, { xPercent: 25, opacity: 0.55, duration: 2.6 }, 0.3)
      .fromTo(q(".goa-palm-a"), { xPercent: -22, yPercent: 12, scale: 1.25 }, { xPercent: -4, yPercent: -10, scale: 1, duration: 2.4 }, 0.4)
      .fromTo(q(".goa-palm-b"), { xPercent: 24, yPercent: 8, scale: 1.3 }, { xPercent: 9, yPercent: -16, scale: 1.08, duration: 2.4 }, 0.4)
      .fromTo(q(".goa-eyebrow"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
      .fromTo(q(".goa-title .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 1.85)
      .fromTo(q(".goa-title"), { letterSpacing: "0.55em" }, { letterSpacing: "0.1em", duration: 1.3 }, 1.85)
      .fromTo(q(".goa-vignette"), { opacity: 0 }, { opacity: 1, duration: 1 }, 2.4)
      .fromTo(q(".goa-sub"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 2.9)
      .to(q(".goa-bg"), { scale: 1.1, duration: 0.6 }, 2.9);
  });

  return (
    <section ref={ref} className="scene goa" data-testid="goa-hero" aria-label="Goa">
      <div className="goa-bg" style={{ backgroundImage: `url(${ASSETS.goaCoast})` }} role="img" aria-label="Goa coastline at golden hour" />
      <div className="goa-shimmer" aria-hidden="true" />
      <div className="goa-palm goa-palm-a" style={{ backgroundImage: `url(${ASSETS.palms})` }} aria-hidden="true" />
      <div className="goa-palm goa-palm-b" style={{ backgroundImage: `url(${ASSETS.palms})` }} aria-hidden="true" />
      <div className="goa-vignette" aria-hidden="true" />
      <div className="goa-copy">
        <p className="eyebrow goa-eyebrow">SOMEWHERE ON THE KONKAN COAST</p>
        <Split as="h2" text="GOA" by="char" className="goa-title font-serif" testId="goa-title" />
        <p className="goa-sub">5 – 6 DECEMBER 2026 · SAKET &amp; NEHA · XXV</p>
      </div>
      <p className="goa-hint scroll-hint">SCROLL TO ARRIVE</p>
    </section>
  );
};
