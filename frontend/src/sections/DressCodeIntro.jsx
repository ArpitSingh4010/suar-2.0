import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { Split } from "../components/Split";

export const DressCodeIntro = ({ data }) => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 2.2, reduced);
    tl.fromTo(q(".dci-frame"), { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1 }, 0)
      .fromTo(q(".dci-img"), { objectPosition: "50% 80%" }, { objectPosition: "50% 20%", duration: 2.2 }, 0)
      .fromTo(q(".dci-eyebrow"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, 0.5)
      .fromTo(q(".dci-title .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.18 }, 0.7)
      .fromTo(q(".dci-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 1.2)
      .fromTo(q(".dci-sub"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.4)
      .fromTo(q(".dci-day"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.25 }, 1.6);
  });

  return (
    <section ref={ref} className="scene dci" data-testid="dress-code-intro" aria-labelledby="dci-title">
      <div className="dci-grid">
        <div className="dci-copy">
          <p className="eyebrow dci-eyebrow">GOA · 5 – 6 DECEMBER 2026</p>
          <h2 id="dci-title" className="dci-title font-serif">
            <Split text={data.title} by="word" testId="dress-code-title" />
          </h2>
          <span className="dci-line gold-line" aria-hidden="true" />
          <p className="dci-sub" data-testid="dress-code-subtitle">{data.subtitle}</p>
          <div className="dci-days">
            <div className="dci-day">
              <span className="dci-day-num font-serif">05</span>
              <span className="dci-day-label" data-testid="dress-code-day-one-label">{data.day_one}</span>
            </div>
            <div className="dci-day">
              <span className="dci-day-num font-serif">06</span>
              <span className="dci-day-label" data-testid="dress-code-day-two-label">{data.day_two}</span>
            </div>
          </div>
        </div>
        <div className="dci-frame">
          <img className="dci-img" src={data.image} alt="Portuguese heritage villa in Fontainhas, Goa" loading="lazy" />
        </div>
      </div>
    </section>
  );
};
