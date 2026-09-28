import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/scroll";
import { ASSETS } from "../lib/assets";

const FRAGS = [0, 1, 2, 3, 4, 5].map((i) => {
  const a1 = (i * 60 - 90) * (Math.PI / 180);
  const a2 = ((i + 1) * 60 - 90) * (Math.PI / 180);
  const pt = (a) => `${50 + 60 * Math.cos(a)}% ${50 + 60 * Math.sin(a)}%`;
  return { clip: `polygon(50% 50%, ${pt(a1)}, ${pt((a1 + a2) / 2)}, ${pt(a2)})`, dir: (a1 + a2) / 2 };
});

const SPARKS = Array.from({ length: 18 }, (_, i) => i);

export const SealedInvitation = ({ daysToGo, onOpen }) => {
  const ref = useRef(null);
  const tlRef = useRef(null);
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: () => setDone(true) });
      tl.fromTo(q(".op-label"), { opacity: 0 }, { opacity: 0.55, duration: 1.2 }, 0.3)
        .to(q(".op-label"), { opacity: 0, duration: 0.7 }, 1.7)
        .fromTo(q(".op-velvet"), { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, duration: 2.4, ease: "power1.inOut" }, 1.1)
        .fromTo(
          q(".op-env-wrap"),
          { yPercent: 75, scale: 0.7, rotateX: 28, opacity: 0 },
          { yPercent: 0, scale: 1, rotateX: 10, opacity: 1, duration: 1.9, ease: "power3.out" },
          2.3
        )
        .to(q(".op-env-wrap"), { scale: 1.16, rotateX: 0, duration: 1.4, ease: "power1.inOut" }, 4.0)
        .fromTo(q(".op-crack"), { strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 0.55, ease: "power1.in" }, 4.55)
        .to(q(".op-seal-face"), { scale: 1.06, duration: 0.25, ease: "power1.inOut" }, 4.85)
        .set(q(".op-seal-face"), { opacity: 0 }, 5.1)
        .set(q(".op-frag"), { opacity: 1 }, 5.1)
        .to(
          q(".op-frag"),
          {
            x: (i) => Math.cos(FRAGS[i].dir) * 160,
            y: (i) => Math.sin(FRAGS[i].dir) * 160 + 60,
            rotation: (i) => (i % 2 ? 1 : -1) * (70 + i * 25),
            opacity: 0,
            duration: 1.0,
            ease: "power2.out",
          },
          5.1
        )
        .fromTo(
          q(".op-spark"),
          { x: 0, y: 0, opacity: 1, scale: 1 },
          {
            x: (i) => Math.cos((i / SPARKS.length) * Math.PI * 2) * (90 + (i % 4) * 40),
            y: (i) => Math.sin((i / SPARKS.length) * Math.PI * 2) * (90 + (i % 3) * 40) + 40,
            opacity: 0,
            scale: 0.2,
            duration: 1.1,
            ease: "power2.out",
          },
          5.1
        )
        .to(q(".op-flap"), { rotateX: -176, duration: 1.15, ease: "power2.inOut" }, 5.25)
        .to(q(".op-env-card"), { yPercent: -55, duration: 1.2, ease: "power2.inOut" }, 5.7)
        .to(q(".op-env-wrap"), { yPercent: 40, scale: 1.7, opacity: 0, duration: 1.4, ease: "power2.inOut" }, 6.1)
        .to(q(".op-velvet"), { opacity: 0.22, duration: 1.3 }, 5.9)
        .fromTo(q(".op-num"), { opacity: 0, scale: 0.82, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.3 }, 6.4)
        .fromTo(q(".op-days"), { opacity: 0, letterSpacing: "0.9em" }, { opacity: 1, letterSpacing: "0.38em", duration: 1.2 }, 6.8)
        .fromTo(q(".op-name"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.28 }, 7.5)
        .fromTo(q(".op-tagline"), { opacity: 0 }, { opacity: 1, duration: 1.3 }, 8.5)
        .fromTo(q(".op-open"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 9.2);
      tl.timeScale(1.25);
      if (prefersReducedMotion()) tl.progress(1);
      tlRef.current = tl;
    }, ref);
    return () => ctx.revert();
  }, []);

  const skip = () => tlRef.current?.progress(1);

  const open = () => {
    if (leaving) return;
    setLeaving(true);
    const el = ref.current;
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ onComplete: onOpen })
      .to(q(".op-content"), { opacity: 0, y: -40, duration: 0.6, ease: "power2.in" })
      .to(el, { scale: 2.8, opacity: 0, duration: 1.4, ease: "power3.inOut" }, 0.25);
  };

  return (
    <div className="opening" ref={ref} data-testid="opening-sequence" aria-label="The sealed invitation">
      <div className="op-velvet" style={{ backgroundImage: `url(${ASSETS.velvet})` }} aria-hidden="true" />
      <p className="op-label font-display">THE SEALED INVITATION</p>

      <div className="op-stage" aria-hidden="true">
        <div className="op-env-wrap">
          <div className="op-env">
            <div className="op-env-body" />
            <div className="op-env-card">
              <span className="font-display">S &amp; N</span>
            </div>
            <div className="op-env-front" />
            <div className="op-flap" />
            <div className="op-seal">
              <div className="op-seal-face">
                <span className="op-seal-top font-display">S &amp; N</span>
                <span className="op-seal-mid font-display">XXV</span>
                <svg className="op-crack-svg" viewBox="0 0 100 100">
                  <path className="op-crack" d="M50 6 L47 22 L54 34 L46 50 L55 66 L48 80 L52 94" />
                </svg>
              </div>
              {FRAGS.map((f, i) => (
                <div key={i} className="op-frag" style={{ clipPath: f.clip }} />
              ))}
              {SPARKS.map((i) => (
                <i key={i} className="op-spark" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="op-content">
        <div className="op-num font-serif" data-testid="days-to-go-number">{daysToGo}</div>
        <p className="op-days" data-testid="days-to-go-label">DAYS TO GO</p>
        <h1 className="op-name op-name-main font-serif" data-testid="opening-names">Saket &amp; Neha</h1>
        <p className="op-name op-name-sub font-display">25 Years</p>
        <p className="op-tagline font-serif" data-testid="opening-tagline">An unforgettable celebration awaits…</p>
        <button type="button" className="op-open gold-btn" onClick={open} data-testid="open-invitation-btn" tabIndex={done ? 0 : -1}>
          <span>OPEN INVITATION</span>
        </button>
      </div>

      {!done && (
        <button type="button" className="op-skip" onClick={skip} data-testid="skip-intro-btn">
          SKIP
        </button>
      )}
    </div>
  );
};
