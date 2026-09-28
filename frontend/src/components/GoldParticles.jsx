import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/scroll";

export const GoldParticles = ({ count = 60, color = "212,175,55", className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    const ps = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.5,
      s: Math.random() * 0.00022 + 0.00006,
      ph: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 0.00012,
    }));
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        if (!reduced) {
          p.y -= p.s;
          p.x += p.dx + Math.sin(t * 0.0004 + p.ph) * 0.00004;
          if (p.y < -0.02) {
            p.y = 1.02;
            p.x = Math.random();
          }
        }
        const a = 0.25 + 0.75 * Math.abs(Math.sin(t * 0.0009 + p.ph));
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${a})`;
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [count, color]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden="true" />;
};
