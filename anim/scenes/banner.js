// YouTube channel banner (render at 1920x1080, scale to 2560x1440).
// Safe area for all devices = 1546x423 at 2560 width -> 1160x317 here: x 380..1540, y 381..698. Everything important stays inside.
const DURATION = 0.04;
function render(t) {
  beginFrame(); setCamera(960, 540, 1);
  const im = window.IMG && IMG.bg03_bank; if (im) { ctx.globalAlpha = 0.35; ctx.drawImage(im, -80, -45, 2080, 941 * 2080 / 1672); ctx.globalAlpha = 1; }
  // trading candlestick chart across the whole background: an uptrend with pullbacks, scaled to span y 760 -> 190
  { const r = rng(17), n = 34, x0 = 40, x1 = 1880, step = (x1 - x0) / n, raw = [0];
    for (let k = 0; k < n; k++) raw.push(raw[k] + 1 + (r() - 0.45) * 7);
    const lo0 = Math.min(...raw), hi0 = Math.max(...raw), Y = v => 800 - (v - lo0) / (hi0 - lo0) * 640;
    ctx.save(); ctx.globalAlpha = 0.55; ctx.lineCap = 'round';
    for (let k = 0; k < n; k++) {
      const o = Y(raw[k]), c = Y(raw[k + 1]), up = c < o, w = step * 0.55, x = x0 + k * step + step / 2;
      const hi = Math.min(o, c) - 8 - r() * 30, lo = Math.max(o, c) + 8 + r() * 30;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, hi); ctx.lineTo(x, lo); ctx.stroke();
      ctx.beginPath(); ctx.rect(x - w / 2, Math.min(o, c), w, Math.max(6, Math.abs(c - o)));
      ctx.fillStyle = up ? '#7fc77a' : '#f08a80'; ctx.fill(); ctx.stroke();
    }
    ctx.restore(); }
  // warm glow behind the title
  const g = ctx.createRadialGradient(1010, 540, 40, 1010, 540, 620); g.addColorStop(0, 'rgba(255,214,102,0.55)'); g.addColorStop(1, 'rgba(255,214,102,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // decoration outside the safe area (shows on TV / desktop only)
  jar(200, 900, 360, 0.15, 3); jar(1720, 900, 520, 1, 9);
  const r = rng(4); for (let k = 0; k < 14; k++) { const x = k % 2 ? 1580 + r() * 320 : 20 + r() * 330, y = 120 + r() * 380; if (k % 3) bill(x, y, 120, (r() - 0.5) * 1.6, r() < 0.5 ? '$100' : '$10'); else coin(x, y, 22); }
  // hero inside the safe area, pointing at the title
  heroFront(520, 690, 0.76, { face: 'grin', armR: [190, -230], armL: [-150, -150] });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // title + tagline
  marker('HUMAN', 1090, 460, 88, { rot: -0.03 });
  marker('LITERACY', 1090, 548, 88, { hl: YELLOW, rot: -0.03 });
  marker('Animated stories. Real brain.', 1090, 630, 34, { rot: -0.015 });
  endFrame();
}
