import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { ASSETS } from "../lib/assets";
import { Split } from "../components/Split";

export const DayOneYellow = () => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 2.6, reduced);
    tl.fromTo(q(".d1-leak"), { xPercent: -30, yPercent: 20, opacity: 0 }, { xPercent: 30, yPercent: -20, opacity: 0.9, duration: 2.6 }, 0)
      .fromTo(q(".d1-frame"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1 }, 0)
      .fromTo(q(".d1-img"), { scale: 1.3, yPercent: 10 }, { scale: 1, yPercent: -6, duration: 2.6 }, 0)
      .fromTo(q(".d1-eyebrow"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.6)
      .fromTo(q(".d1-l1 .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.8 }, 0.9)
      .fromTo(q(".d1-l2 .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.8 }, 1.3)
      .fromTo(q(".d1-desc"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.3 }, 1.7)
      .fromTo(q(".d1-dot"), { opacity: 0, scale: 0 }, { opacity: 0.8, scale: 1, duration: 0.6, stagger: 0.05 }, 1.2);
  });

  return (
    <section ref={ref} className="scene d1" data-testid="dress-code-day1" aria-labelledby="d1-title">
      <div className="d1-leak" aria-hidden="true" />
      <div className="d1-dots" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} className="d1-dot" style={{ left: `${8 + ((i * 37) % 84)}%`, top: `${10 + ((i * 53) % 78)}%` }} />
        ))}
      </div>
      <div className="d1-grid">
        <div className="d1-frame">
          <img className="d1-img" src={ASSETS.yellow} alt="Elegant yellow Indo-Western outfits on a Goan terrace" loading="lazy" />
        </div>
        <div className="d1-copy">
          <p className="eyebrow d1-eyebrow">05 DECEMBER · DAY ONE</p>
          <h2 id="d1-title" className="d1-title font-serif">
            <Split text="INDO-WESTERN" by="word" className="d1-l1" testId="day1-dress-style" />
            <Split text="YELLOW" by="word" className="d1-l2 d1-yellow" testId="day1-dress-colour" />
          </h2>
          <p className="d1-desc">Indo-Western outfit.</p>
          <p className="d1-desc">Yellow colour for everyone.</p>
        </div>
      </div>
    </section>
  );
};
