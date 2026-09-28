import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { ASSETS } from "../lib/assets";
import { Split } from "../components/Split";

export const DayTwoMorning = () => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 2.2, reduced);
    tl.fromTo(q(".d2m-card"), { opacity: 0, scale: 0.9, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, 0)
      .fromTo(q(".d2m-img"), { filter: "blur(30px)", scale: 1.2 }, { filter: "blur(14px)", scale: 1.05, duration: 2 }, 0)
      .fromTo(q(".d2m-haze"), { xPercent: -20, opacity: 0.2 }, { xPercent: 20, opacity: 0.6, duration: 2.2 }, 0)
      .fromTo(q(".d2m-eyebrow"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5)
      .fromTo(q(".d2m-title .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.2 }, 0.8)
      .fromTo(q(".d2m-q"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.7 }, 1.1)
      .fromTo(q(".d2m-reveal .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 1.5);
  });

  return (
    <section ref={ref} className="scene d2m" data-testid="dress-code-day2-morning" aria-labelledby="d2m-title">
      <div className="d2m-haze" aria-hidden="true" />
      <div className="d2m-wrap">
        <p className="eyebrow d2m-eyebrow">06 DECEMBER · MORNING</p>
        <div className="d2m-card">
          <img className="d2m-img" src={ASSETS.mystery} alt="" aria-hidden="true" loading="lazy" />
          <div className="d2m-glass">
            <span className="d2m-q font-serif" aria-hidden="true">?</span>
          </div>
        </div>
        <h2 id="d2m-title" className="d2m-title font-serif">
          <Split text="DRESS CODE" by="word" testId="day2-morning-title" />
        </h2>
        <p className="d2m-reveal font-serif">
          <Split text="WILL BE REVEALED THE SAME DAY" by="word" testId="day2-morning-reveal" />
        </p>
      </div>
    </section>
  );
};
