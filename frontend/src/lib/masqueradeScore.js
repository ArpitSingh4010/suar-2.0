// Original D-minor chamber waltz: a bowed-string bed, soft bell/harp melody,
// and a three-beat bass/chord pulse. Render once, then loop without JS timers.
const BEAT = 60 / 72;
const BARS = [
  { chord: [50, 57, 65], melody: [74, 77, 81, 77, 76, 74] },
  { chord: [46, 53, 62], melody: [77, 74, 70, 74, 77, 79] },
  { chord: [43, 50, 58], melody: [79, 77, 74, 70, 74, 77] },
  { chord: [45, 52, 61], melody: [76, 73, 69, 73, 76, 73] },
  { chord: [50, 57, 65], melody: [74, 81, 86, 81, 77, 74] },
  { chord: [41, 48, 57], melody: [77, 81, 84, 81, 79, 77] },
  { chord: [43, 50, 58], melody: [79, 82, 81, 79, 77, 74] },
  { chord: [45, 52, 61], melody: [76, 73, 69, 73, 76, 73] },
];

function tone(ctx, output, midi, time, duration, level, type, attack, pan) {
  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();
  const stereo = ctx.createStereoPanner();
  osc.type = type;
  osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
  stereo.pan.value = pan;
  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(level, time + attack);
  envelope.gain.exponentialRampToValueAtTime(0.00001, time + duration);
  osc.connect(envelope).connect(stereo).connect(output);
  osc.start(time);
  osc.stop(time + duration + 0.01);
}

export async function renderMasqueradeScore() {
  const OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const rate = 44100;
  const loopSeconds = BARS.length * 2 * 3 * BEAT;
  const tailSeconds = 3;
  const ctx = new OfflineContext(2, Math.ceil((loopSeconds + tailSeconds) * rate), rate);
  const mix = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2800;
  mix.connect(filter).connect(ctx.destination);
  const echo = ctx.createDelay(2);
  const feedback = ctx.createGain();
  const wet = ctx.createGain();
  echo.delayTime.value = BEAT * 0.75;
  feedback.gain.value = 0.28;
  wet.gain.value = 0.22;
  filter.connect(echo);
  echo.connect(feedback).connect(echo);
  echo.connect(wet).connect(ctx.destination);

  for (let bar = 0; bar < BARS.length * 2; bar++) {
    const { chord, melody } = BARS[bar % BARS.length];
    const start = bar * 3 * BEAT;
    tone(ctx, mix, chord[0] - 12, start, BEAT * 2.8, 0.12, "sine", 0.045, 0);
    chord.forEach((note, index) => {
      tone(ctx, mix, note + 12, start, BEAT * 3.3, 0.028, "triangle", 0.38, (index - 1) * 0.35);
      for (const beat of [1, 2]) tone(ctx, mix, note, start + beat * BEAT, BEAT * 1.1, 0.046, "triangle", 0.018, -0.25);
    });
    melody.forEach((note, i) => {
      const at = start + i * BEAT / 2;
      const soft = bar >= BARS.length ? 0.85 : 1;
      tone(ctx, mix, note, at, BEAT * 1.8, 0.092 * soft, "sine", 0.008, 0.23);
      tone(ctx, mix, note + 12, at, BEAT * 0.65, 0.018 * soft, "sine", 0.006, -0.15);
    });
  }
  const rendered = await ctx.startRendering();
  const length = Math.round(loopSeconds * rate);
  const loop = ctx.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const source = rendered.getChannelData(channel);
    const target = loop.getChannelData(channel);
    target.set(source.subarray(0, length));
    // Carry the final release into the start for a seamless musical cadence.
    for (let i = length; i < source.length; i++) target[i - length] += source[i];
  }
  return loop;
}