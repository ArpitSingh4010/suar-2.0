import { useRef } from "react";
import { useScene, sceneTimeline } from "../lib/scroll";
import { Split } from "../components/Split";
import { GoldParticles } from "../components/GoldParticles";

export const MasqueradeBall = ({ data }) => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    const tl = sceneTimeline(el, 5.5, reduced);
    tl.fromTo(q(".mq-mask"), { opacity: 0.9, scale: 0.6, yPercent: 0 }, { scale: 1.5, yPercent: -6, duration: 1.8 }, 0)
      .fromTo(q(".mq-wine"), { opacity: 0.3, scale: 0.6 }, { opacity: 1, scale: 1.5, duration: 2.2 }, 0.4)
      .fromTo(q(".mq-ballroom"), { opacity: 0, scale: 1.35, filter: "brightness(0.2)" }, { opacity: 1, scale: 1.05, filter: "brightness(0.85)", duration: 2.0 }, 1.4)
      .to(q(".mq-mask"), { opacity: 0.12, scale: 2.4, yPercent: -30, duration: 1.4 }, 1.8)
      .fromTo(q(".mq-guests"), { yPercent: 110 }, { yPercent: 0, duration: 1.4 }, 2.8)
      .fromTo(q(".mq-guests img"), { scale: 1.3, yPercent: 10 }, { scale: 1, yPercent: 0, duration: 1.8 }, 2.8)
      .fromTo(q(".mq-tag-floor"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, 3.6)
      .fromTo(q(".mq-tag-dj"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, 3.9)
      .to(q(".mq-ballroom"), { filter: "brightness(0.35)", duration: 1 }, 4.2)
      .to(q(".mq-guests"), { filter: "brightness(0.3)", duration: 1 }, 4.2)
      .to(q(".mq-scrim"), { opacity: 1, duration: 1 }, 4.2)
      .to(q(".mq-tag"), { opacity: 0, duration: 0.3 }, 4.3)
      .fromTo(q(".mq-eyebrow"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 4.4)
      .fromTo(q(".mq-title .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.05 }, 4.7)
      .fromTo(q(".mq-tagline"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 5.6);
  });

  return (
    <section ref={ref} className="scene mq" data-testid="masquerade-ball" aria-labelledby="mq-title">
      <div className="mq-wine" aria-hidden="true" />
      <div className="mq-ballroom" role="img" aria-label="Opulent ballroom in wine-red light" style={{ backgroundImage: `url(${data.images.ballroom})` }} />
      <div className="mq-guests">
        <img src={data.images.guests} alt="Guests in tuxedos, gowns and masks on the dance floor" loading="lazy" />
        <span className="mq-tag mq-tag-floor"><i aria-hidden="true" />DANCE FLOOR</span>
        <span className="mq-tag mq-tag-dj"><i aria-hidden="true" />DJ</span>
      </div>
      <img className="mq-mask" src={data.images.mask} alt="" aria-hidden="true" loading="lazy" />
      <div className="mq-scrim" aria-hidden="true" />
      <div className="mq-particles"><GoldParticles count={50} color="226,183,85" /></div>
      <div className="mq-type">
        <p className="eyebrow mq-eyebrow" data-testid="masquerade-date">{data.date} · {data.time}</p>
        <h2 id="mq-title" className="mq-title font-serif">
          <Split text={data.title} by="char" testId="masquerade-title" />
        </h2>
        <p className="mq-tagline font-serif" data-testid="masquerade-tagline">{data.tagline}</p>
      </div>
    </section>
  );
};
