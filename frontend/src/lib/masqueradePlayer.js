import { renderMasqueradeScore } from "./masqueradeScore";

export function createMasqueradePlayer(onStatus) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext || !(window.OfflineAudioContext || window.webkitOfflineAudioContext)) {
    onStatus("unavailable");
    return { start() {}, mute() {}, close() {} };
  }
  const ctx = new AudioContext();
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);
  let source;
  let closed = false;
  let wanted = true;
  let failed = false;
  let suspendTimer;
  const update = () => {
    if (closed) return;
    onStatus(failed ? "unavailable" : !wanted ? "muted" : ctx.state !== "running" ? "blocked" : !source ? "loading" : "playing");
  };
  ctx.onstatechange = update;
  renderMasqueradeScore().then(buffer => {
    if (closed) return;
    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
    if (wanted) gain.gain.setTargetAtTime(0.6, ctx.currentTime, 0.8);
    update();
  }).catch(() => { failed = true; update(); });
  return {
    start() {
      if (closed || failed) return;
      wanted = true;
      clearTimeout(suspendTimer);
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0.6, ctx.currentTime, 0.4);
      // Must be invoked synchronously from a gesture when autoplay is blocked.
      ctx.resume().then(update).catch(update);
      update();
    },
    mute() {
      if (closed) return;
      wanted = false;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
      update();
      clearTimeout(suspendTimer);
      suspendTimer = setTimeout(() => { if (!closed && !wanted) ctx.suspend().catch(() => {}); }, 300);
    },
    close() {
      closed = true;
      clearTimeout(suspendTimer);
      ctx.onstatechange = null;
      source?.stop();
      source?.disconnect();
      gain.disconnect();
      ctx.close().catch(() => {});
    },
  };
}