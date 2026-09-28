import { useRef } from "react";
import { gsap, useScene, scrubbed } from "../lib/scroll";
import { Split } from "../components/Split";
import { TabCard } from "../components/TabCard";

export const DressCodeEnd = ({ locked, onNavigate }) => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    gsap
      .timeline({ scrollTrigger: scrubbed(q(".dce-title")[0], reduced, "top 90%", "top 35%"), defaults: { ease: reduced ? "power2.out" : "none" } })
      .fromTo(q(".dce-l1 .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.15 }, 0)
      .fromTo(q(".dce-l2 .split-inner"), { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.1 }, 0.5)
      .fromTo(q(".dce-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 1);
    gsap
      .timeline({ scrollTrigger: scrubbed(q(".dce-cards")[0], reduced, "top 95%", "top 55%"), defaults: { ease: reduced ? "power2.out" : "none" } })
      .fromTo(q(".tab-card"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.3 }, 0);
  });

  return (
    <section ref={ref} className="dce" data-testid="dress-code-end" aria-labelledby="dce-title">
      <h2 id="dce-title" className="dce-title font-serif">
        <Split text="TWO DAYS." by="word" className="dce-l1" testId="dress-code-end-line1" />
        <Split text="ONE UNFORGETTABLE CELEBRATION." by="word" className="dce-l2" testId="dress-code-end-line2" />
      </h2>
      <span className="dce-line gold-line" aria-hidden="true" />
      <p className="dce-sub">Continue into the celebration.</p>
      <div className="dce-cards">
        <TabCard num="02" date="5 DECEMBER" title="Day One Event" locked={locked} onClick={() => onNavigate("sufi")} testId="end-card-sufi" />
        <TabCard num="03" date="6 DECEMBER" title="Day Two Events" locked={locked} onClick={() => onNavigate("daysix")} testId="end-card-daysix" />
      </div>
      <footer className="site-foot">
        <span className="font-display">S &amp; N — XXV</span>
        <span>GOA · 5–6 DECEMBER 2026</span>
      </footer>
    </section>
  );
};
