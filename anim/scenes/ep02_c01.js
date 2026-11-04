// Ep.02 clip 01 (10 s): dawn street; grey "lie" bubbles rise from the houses, pop into green "truth" bubbles,
// camera pushes into the window where the hero sleeps; his yellow thought scribble draws itself.
const DURATION = 10;

buildStreet({ centerWindow: t => sleepingWindow(WIN.x, WIN.y, 0.2, t, { thought: clamp((t - 7.0) / 1.6) }) });

// ---- bubbles ----
// source points (world), spawn time, switch-to-green time, size, tail side, scribble kind
const BUB = [
  [430, 630, 0.15, 3.1, 95, 70, 1, 'loops'], [505, 610, 0.35, 3.6, 90, 72, 1, 'tangle'], [1040, 640, 0.55, 3.3, 80, 62, -1, 'tangle'],
  [1395, 635, 0.75, 3.9, 80, 64, 1, 'tangle'], [130, 640, 1.0, 4.2, 85, 62, 1, 'loops'], [700, 600, 1.2, 4.6, 80, 60, -1, 'tangle'],
  [1720, 600, 1.4, 4.0, 90, 66, -1, 'tangle'], [930, 560, 1.6, 4.4, 95, 70, 1, 'loops'], [260, 610, 1.9, 4.8, 70, 54, 1, 'tangle'],
  [1560, 620, 2.1, 5.0, 75, 58, -1, 'loops'], [1150, 600, 2.3, 4.3, 70, 56, 1, 'tangle'], [600, 640, 2.6, 5.2, 72, 56, -1, 'tangle'],
  [1300, 610, 3.0, 3.0, 60, 48, 1, 'tangle'], [880, 610, 3.4, 3.4, 55, 44, -1, 'tangle'], [1500, 650, 3.7, 3.7, 60, 46, 1, 'tangle'],
  [350, 660, 4.0, 4.0, 58, 44, -1, 'tangle'], [1010, 620, 4.5, 4.5, 50, 40, 1, 'tangle'],
].map((b, i) => ({ id: i + 1, sx: b[0], sy: b[1], t0: b[2], ts: b[3], w: b[4], h: b[5], tail: b[6], scribble: b[7], born: b[2] === b[3] }));

fn(t => {
  for (const b of BUB) {
    const age = t - b.t0; if (age < 0) continue;
    const r = rng(b.id * 31);
    const vy = 26 + r() * 22, sway = 6 + r() * 8, ph = r() * 6;
    const x = b.sx + Math.sin(age * 1.3 + ph) * sway + (r() - 0.5) * 30 * age / 4;
    const y = b.sy - 30 - age * vy - age * age * 1.6;
    let s = easeOutBack(age / 0.45) * (1 + age * 0.05);
    const green = b.born || t >= b.ts;
    if (!b.born) { const d = t - b.ts; if (d > -0.18 && d < 0) s *= 1 - 0.25 * ((d + 0.18) / 0.18); else if (d >= 0 && d < 0.35) s *= 0.75 + 0.25 * easeOutBack(d / 0.35); }
    drawBubble(b, x, y, s, green ? 'green' : 'grey');
    // little pop sparkles when switching
    const d = t - b.ts;
    if (!b.born && d >= 0 && d < 0.6) {
      ctx.fillStyle = `rgba(168,198,156,${1 - d / 0.6})`; ctx.strokeStyle = `rgba(69,85,63,${1 - d / 0.6})`; ctx.lineWidth = 1.5;
      for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28 + b.id; const rr = b.w * (0.55 + d * 1.2);
        ctx.beginPath(); ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.7, 4 + (k % 3) * 2, 0, 7); ctx.fill(); ctx.stroke(); }
    }
  }
});

// ---- camera: slow push-in that speeds up, ending on the window ----
function render(t) {
  beginFrame();
  const p = Math.pow(clamp(t / DURATION), 1.75);
  const zEnd = 7.4, z = Math.exp(Math.log(zEnd) * p);
  const wx = WIN.x + WIN.w / 2, wy = WIN.y + WIN.h / 2;
  const f = (z - 1) / (zEnd - 1);
  setCamera(lerp(960, wx, Math.pow(f, 0.6)), lerp(560, wy, Math.pow(f, 0.6)), z);
  drawWorld(t);
  endFrame();
}
