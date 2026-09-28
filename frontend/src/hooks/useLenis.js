import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/scroll";

export function useLenis(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ref.current = lenis;
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ref.current = null;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "" : "hidden";
    const lenis = ref.current;
    if (!lenis) return;
    if (active) lenis.start();
    else lenis.stop();
  }, [active]);

  return ref;
}
