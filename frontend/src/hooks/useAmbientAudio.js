import { useCallback, useEffect, useRef, useState } from "react";

const THEMES = {
  opening: { notes: [55, 82.41, 110, 164.81], type: "sine", cutoff: 420, noise: 0.015, lfo: 0.05 },
  dress: { notes: [110, 164.81, 220, 277.18, 329.63], type: "sine", cutoff: 900, noise: 0.05, lfo: 0.08 },
  sufi: { notes: [73.42, 110, 146.83, 174.61, 220], type: "triangle", cutoff: 520, noise: 0, lfo: 0.13 },
  daysix: { notes: [130.81, 196, 261.63, 329.63, 392], type: "sine", cutoff: 1400, noise: 0.03, lfo: 0.3 },
};

function buildVoice(ctx, theme, dest) {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = theme.cutoff;
  filter.connect(gain).connect(dest);
  const nodes = [];
  theme.notes.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = theme.type;
    osc.frequency.value = f;
    osc.detune.value = (i % 2 ? 1 : -1) * 4;
    const g = ctx.createGain();
    g.gain.value = 0.18 / theme.notes.length;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = theme.lfo * (1 + i * 0.37);
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.08 / theme.notes.length;
    lfo.connect(lfoGain).connect(g.gain);
    osc.connect(g).connect(filter);
    osc.start();
    lfo.start();
    nodes.push(osc, lfo);
  });
  if (theme.noise > 0) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = "lowpass";
    nf.frequency.value = 380;
    const ng = ctx.createGain();
    ng.gain.value = theme.noise;
    src.connect(nf).connect(ng).connect(filter);
    src.start();
    nodes.push(src);
  }
  return { gain, nodes };
}

export function useAmbientAudio(themeKey) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef(null);
  const voiceRef = useRef(null);

  const stopVoice = (ctx, voice, fade = 2.2) => {
    if (!voice) return;
    voice.gain.gain.cancelScheduledValues(ctx.currentTime);
    voice.gain.gain.setTargetAtTime(0, ctx.currentTime, fade / 4);
    setTimeout(() => voice.nodes.forEach((n) => n.stop()), fade * 1000 + 200);
  };

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!enabled || !ctx) return;
    stopVoice(ctx, voiceRef.current);
    const voice = buildVoice(ctx, THEMES[themeKey] || THEMES.dress, ctx.destination);
    voice.gain.gain.setTargetAtTime(1, ctx.currentTime + 0.3, 1.2);
    voiceRef.current = voice;
  }, [themeKey, enabled]);

  const toggle = useCallback(() => {
    if (!enabled) {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current.resume();
      setEnabled(true);
    } else {
      stopVoice(ctxRef.current, voiceRef.current, 1);
      voiceRef.current = null;
      setEnabled(false);
    }
  }, [enabled]);

  return { enabled, toggle };
}
