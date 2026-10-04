import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { Split } from "../components/Split";

export const DayTwoEvening = ({ data }) => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 2.8, reduced);
    tl.fromTo(q(".d2e-wine"), { opacity: 0 }, { opacity: 1, duration: 2.8 }, 0)
      .fromTo(q(".d2e-eyebrow"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
      .fromTo(q(".d2e-men .d2e-frame"), { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1 }, 0.4)
      .fromTo(q(".d2e-men .d2e-img"), { objectPosition: "50% 40%" }, { objectPosition: "50% 0%", duration: 2.4 }, 0.4)
      .fromTo(q(".d2e-men .d2e-label"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, 1.0)
      .fromTo(q(".d2e-men .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.7, stagger: 0.1 }, 1.2)
      .fromTo(q(".d2e-women .d2e-frame"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1 }, 1.0)
      .fromTo(q(".d2e-women .d2e-img"), { objectPosition: "50% 0%" }, { objectPosition: "50% 40%", duration: 2.0 }, 1.0)
      .fromTo(q(".d2e-women .d2e-label"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 1.6)
      .fromTo(q(".d2e-women .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.7, stagger: 0.1 }, 1.8);
  });

  return (
    <section ref={ref} className="scene d2e" data-testid="dress-code-day2-evening" aria-labelledby="d2e-title">
      <div className="d2e-wine" aria-hidden="true" />
      <p className="eyebrow d2e-eyebrow">06 DECEMBER · EVENING</p>
      <h2 id="d2e-title" className="sr-only">Evening dress code: {data.men} for men, {data.women} for women</h2>
      <div className="d2e-grid">
        <figure className="d2e-col d2e-men">
          <div className="d2e-frame">
            <img className="d2e-img" src={data.men_image} alt="Men’s evening outfit" loading="lazy" />
          </div>
          <figcaption className="d2e-caption">
            <span className="d2e-label">MEN</span>
            <Split as="span" text={data.men} by="word" className="d2e-look font-serif" testId="day2-evening-men" />
          </figcaption>
        </figure>
        <figure className="d2e-col d2e-women">
          <div className="d2e-frame">
            <img className="d2e-img" src={data.women_image} alt="Women’s evening outfit" loading="lazy" />
          </div>
          <figcaption className="d2e-caption">
            <span className="d2e-label">WOMEN</span>
            <Split as="span" text={data.women} by="word" className="d2e-look d2e-red font-serif" testId="day2-evening-women" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
