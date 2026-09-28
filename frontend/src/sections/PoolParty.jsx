import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { Split } from "../components/Split";

const Tag = ({ className, label }) => (
  <span className={`pool-tag ${className}`}>
    <i aria-hidden="true" />
    {label}
  </span>
);

export const PoolParty = ({ data, maskSrc }) => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 6, reduced);
    tl.fromTo(q(".pool-sky"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
      .to(q(".pool-hint"), { opacity: 0, duration: 0.2 }, 0.1)
      .fromTo(q(".pool-water"), { yPercent: 100 }, { yPercent: 0, duration: 1.4 }, 0.5)
      .fromTo(q(".pool-main"), { clipPath: "circle(0% at 50% 58%)", scale: 1.6 }, { clipPath: "circle(85% at 50% 58%)", scale: 1.0, duration: 2.0 }, 1.5)
      .fromTo(q(".pool-tag-dj"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 3.2)
      .fromTo(q(".pool-tag-bar"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 3.5)
      .fromTo(q(".pool-tag-guests"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 3.8)
      .fromTo(q(".pool-decor"), { xPercent: -140, rotate: -8, opacity: 0 }, { xPercent: 0, rotate: -3, opacity: 1, duration: 1 }, 4.0)
      .fromTo(q(".pool-eyebrow"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 4.6)
      .fromTo(q(".pool-title .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.12 }, 4.8)
      .fromTo(q(".pool-tagline"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 5.4)
      .to(q(".pool-tag"), { opacity: 0, duration: 0.3 }, 5.4)
      .to(q(".pool-visual"), { filter: "saturate(0) brightness(0.12)", duration: 1.6 }, 6.4)
      .to(q(".pool-sky"), { opacity: 0, duration: 1.2 }, 6.4)
      .to(q(".pool-type"), { opacity: 0, y: -30, duration: 0.8 }, 6.6)
      .to(q(".pool-decor"), { opacity: 0, yPercent: 20, duration: 0.8 }, 6.4)
      .fromTo(q(".pool-dark"), { opacity: 0 }, { opacity: 1, duration: 1.4 }, 6.8)
      .fromTo(q(".pool-wine"), { opacity: 0, scale: 0.5 }, { opacity: 0.9, scale: 1.2, duration: 1.4 }, 7.2)
      .fromTo(q(".pool-mask"), { opacity: 0, scale: 0.35, y: 60 }, { opacity: 1, scale: 0.6, y: 0, duration: 1.2 }, 7.6)
      .fromTo(q(".pool-after"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 8.2);
  });

  return (
    <section ref={ref} className="scene pool" data-testid="pool-party" aria-labelledby="pool-title">
      <div className="pool-sky" aria-hidden="true" />
      <div className="pool-visual">
        <div className="pool-water" style={{ backgroundImage: `url(${data.images.water})` }} aria-hidden="true" />
        <div className="pool-main" role="img" aria-label="Poolside celebration with DJ, bar and guests" style={{ backgroundImage: `url(${data.images.pool})` }} />
        <Tag className="pool-tag-dj" label="DJ" />
        <Tag className="pool-tag-bar" label="THE BAR" />
        <Tag className="pool-tag-guests" label="POOLSIDE" />
      </div>
      <figure className="pool-decor">
        <img src={data.images.decor} alt="Bihari festive decor and flavours by the pool" loading="lazy" />
        <figcaption>BIHARI FLAVOURS</figcaption>
      </figure>
      <div className="pool-type">
        <p className="eyebrow pool-eyebrow" data-testid="pool-date">{data.date} · {data.time}</p>
        <h2 id="pool-title" className="pool-title font-serif">
          <Split text={data.title} by="word" testId="pool-title" />
        </h2>
        <p className="pool-tagline" data-testid="pool-tagline">{data.tagline}</p>
      </div>
      <div className="pool-dark" aria-hidden="true" />
      <div className="pool-wine" aria-hidden="true" />
      <img className="pool-mask" src={maskSrc} alt="" aria-hidden="true" loading="lazy" />
      <p className="pool-after eyebrow">AS THE SUN SETS…</p>
      <p className="pool-hint scroll-hint">SCROLL TOWARDS THE POOL</p>
    </section>
  );
};
