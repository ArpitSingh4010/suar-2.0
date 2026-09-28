import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useScene(ref, build, deps = []) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => build({ reduced, el, q: gsap.utils.selector(el) }), el);
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function pinned(el, length, reduced) {
  if (reduced) return { trigger: el, start: "top 65%", toggleActions: "play none none none" };
  return { trigger: el, start: "top top", end: `+=${length * 100}%`, pin: true, scrub: 0.7, anticipatePin: 1 };
}

export function scrubbed(el, reduced, start = "top 85%", end = "top 30%") {
  if (reduced) return { trigger: el, start: "top 80%", toggleActions: "play none none none" };
  return { trigger: el, start, end, scrub: 0.6 };
}

export const sceneTimeline = (el, length, reduced) =>
  gsap.timeline({
    scrollTrigger: pinned(el, length, reduced),
    defaults: { ease: reduced ? "power2.out" : "none" },
  });
