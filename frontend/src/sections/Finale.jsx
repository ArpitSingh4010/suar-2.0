import { useRef } from "react";
import { gsap, useScene, scrubbed } from "../lib/scroll";

export const Finale = ({ data }) => {
  const ref = useRef(null);

  useScene(ref, ({ reduced, el, q }) => {
    gsap
      .timeline({ scrollTrigger: scrubbed(el, reduced, "top 80%", "top 15%"), defaults: { ease: reduced ? "power2.out" : "none" } })
      .fromTo(q(".fin-item"), { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.35 }, 0)
      .fromTo(q(".fin-line"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0.8);
  });

  return (
    <section ref={ref} className="fin" data-testid="finale" aria-labelledby="fin-names">
      <h2 id="fin-names" className="fin-item fin-names font-serif" data-testid="finale-names">{data.names}</h2>
      <p className="fin-item fin-numeral font-display" data-testid="finale-numeral">{data.numeral}</p>
      <span className="fin-line gold-line" aria-hidden="true" />
      <p className="fin-item fin-quote font-serif" data-testid="finale-line1">{data.lines[0]}</p>
      <p className="fin-item fin-quote font-serif" data-testid="finale-line2">{data.lines[1]}</p>
      <p className="fin-item fin-dates font-serif" data-testid="finale-dates">{data.dates}</p>
      <p className="fin-item fin-place font-serif" data-testid="finale-place">{data.place}</p>
    </section>
  );
};
