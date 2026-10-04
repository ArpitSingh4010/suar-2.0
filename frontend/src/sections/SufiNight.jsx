import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { Split } from "../components/Split";
import { GoldParticles } from "../components/GoldParticles";

const Ornament = ({ className }) => (
  <svg className={`orn ${className}`} viewBox="0 0 1200 40" aria-hidden="true" preserveAspectRatio="none">
    <path d="M0 20 H548 M652 20 H1200" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M600 3 L617 20 L600 37 L583 20 Z" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="600" cy="20" r="3" fill="currentColor" />
    <circle cx="560" cy="20" r="2" fill="currentColor" />
    <circle cx="640" cy="20" r="2" fill="currentColor" />
  </svg>
);

export const SufiNight = ({ data }) => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 5, reduced);
    tl.fromTo(q(".sufi-particles"), { opacity: 0 }, { opacity: 1, duration: 1 }, 0.3)
      .to(q(".sufi-hint"), { opacity: 0, duration: 0.2 }, 0.1)
      .fromTo(q(".sufi-img1"), { opacity: 0, clipPath: "circle(0% at 50% 60%)" }, { opacity: 1, clipPath: "circle(80% at 50% 60%)", duration: 1.6 }, 1.0)
      .fromTo(q(".sufi-eyebrow"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 2.0)
      .fromTo(q(".sufi-title .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.07 }, 2.2)
      .fromTo(q(".sufi-tag"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 2.9)
      .to(q(".sufi-img1"), { backgroundPosition: "40% 50%", filter: "brightness(0.35)", duration: 1.2 }, 3.4)
      .to(q(".sufi-type"), { xPercent: -12, opacity: 0.25, duration: 1.0 }, 3.4)
      .fromTo(q(".sufi-img2"), { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.3 }, 3.4)
      .fromTo(q(".sufi-img2 img"), { objectPosition: "65% 50%" }, { objectPosition: "50% 50%", duration: 1.6 }, 3.4)
      .fromTo(q(".orn-a"), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.2 }, 4.0)
      .fromTo(q(".orn-b"), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.2 }, 4.0)
      .to(q(".sufi-img2"), { filter: "brightness(0.3)", duration: 0.8 }, 5.0)
      .fromTo(q(".sufi-final .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, 5.2);
  });

  return (
    <section ref={ref} className="scene sufi" data-testid="sufi-night" aria-labelledby="sufi-title">
      <div className="sufi-particles"><GoldParticles count={110} /></div>
      <div className="sufi-img1" role="img" aria-label="Live Sufi performance under candlelight" style={{ backgroundImage: `url(${data.images.performance})` }} />
      <div className="sufi-img2">
        <img src={data.images.guests} alt="Guests seated in an intimate candlelit setting" loading="lazy" />
      </div>
      <Ornament className="orn-a" />
      <Ornament className="orn-b" />
      <div className="sufi-type">
        <p className="eyebrow sufi-eyebrow" data-testid="sufi-date">{data.date}</p>
        <h2 id="sufi-title" className="sufi-title font-serif">
          <Split text={data.title} by="char" testId="sufi-title" />
        </h2>
        <p className="sufi-tag font-serif" data-testid="sufi-tagline">{data.tagline}</p>
      </div>
      <p className="sufi-final font-serif">
        <Split text={data.closing} by="word" testId="sufi-closing" />
      </p>
      <p className="sufi-hint scroll-hint">SCROLL INTO THE NIGHT</p>
    </section>
  );
};
