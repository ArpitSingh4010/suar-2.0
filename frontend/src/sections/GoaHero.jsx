import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { ASSETS } from "../lib/assets";
import { Split } from "../components/Split";

export const GoaHero = () => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 3.5, reduced);
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    tl.fromTo(q(".goa-bg"), { backgroundSize: mobile ? "auto 135%" : "135% auto", filter: "brightness(0.5) saturate(0.7)" }, { backgroundSize: mobile ? "auto 105%" : "105% auto", filter: "brightness(1) saturate(1.05)", duration: 1.3 }, 0)
      .to(q(".goa-hint"), { opacity: 0, duration: 0.2 }, 0.1)
      .fromTo(q(".goa-shimmer"), { backgroundPosition: "100% 0", opacity: 0 }, { backgroundPosition: "0% 0", opacity: 0.35, duration: 2.6 }, 0.3)
      .fromTo(q(".goa-palm-a"), { backgroundPosition: "40% 0%", opacity: 0.5 }, { backgroundPosition: "55% 20%", opacity: 0.9, duration: 2.4 }, 0.4)
      .fromTo(q(".goa-palm-b"), { backgroundPosition: "60% 0%", opacity: 0.3 }, { backgroundPosition: "45% 30%", opacity: 0.5, duration: 2.4 }, 0.4)
      .fromTo(q(".goa-eyebrow"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
      .fromTo(q(".goa-title .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 1.85)
      .fromTo(q(".goa-vignette"), { opacity: 0 }, { opacity: 1, duration: 1 }, 2.4)
      .fromTo(q(".goa-sub"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 2.9)
      .to(q(".goa-bg"), { backgroundPosition: "50% 65%", duration: 0.6 }, 2.9);
  });

  return (
    <section ref={ref} className="scene goa" data-testid="goa-hero" aria-label="Goa">
      <div className="goa-bg" style={{ backgroundImage: `url(${ASSETS.goaCoast})` }} role="img" aria-label="Goa coastline at golden hour" />
      <div className="goa-shimmer" aria-hidden="true" />
      <div className="goa-palm goa-palm-a" style={{ backgroundImage: `url(${ASSETS.palms})` }} aria-hidden="true" />
      <div className="goa-palm goa-palm-b" style={{ backgroundImage: `url(${ASSETS.palms})` }} aria-hidden="true" />
      <div className="goa-vignette" aria-hidden="true" />
      <div className="goa-copy">
        <p className="eyebrow goa-eyebrow" data-testid="goa-location-label">SOMEWHERE ON THE KONKAN COAST</p>
        <Split as="h2" text="GOA" by="char" className="goa-title font-serif" testId="goa-title" />
        <p className="goa-sub" data-testid="goa-celebration-dates">5 – 6 DECEMBER 2026 · SAKET &amp; NEHA · XXV</p>
      </div>
      <p className="goa-hint scroll-hint" data-testid="goa-scroll-hint">SCROLL TO ARRIVE</p>
    </section>
  );
};
