// Ep.02 clip 01 (10 s): dawn street; grey "lie" bubbles rise from the houses, pop into green "truth" bubbles,
// camera pushes into the window where the hero sleeps; his yellow thought scribble draws itself.
const DURATION = 10;
const WIN = { x: 864, y: 588, w: 192, h: 128 };

// ---- sky ----
fn(() => {
  ctx.fillStyle = C.cloud;
  for (const [x, y, w, h] of [[360, 448, 330, 14], [610, 492, 140, 9], [1010, 440, 90, 8], [1100, 440, 110, 8], [1080, 488, 140, 10], [1230, 420, 190, 22], [1250, 482, 140, 10]]) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
  }
});
shape(G.circle(840, 488, 100, R({ stroke: '#d9b86a', strokeWidth: 1.2, fill: C.sun, fillStyle: 'solid', roughness: 0.5 })));
for (let k = 0; k < 8; k++) {
  const a = k / 8 * 6.28 + 0.3;
  shape(G.arc(840, 488, 128, 128, a, a + 0.18, false, R({ stroke: '#b9a476', strokeWidth: 1.2 })));
}

// ---- far row ----
house(170, 745, 150, 95, { far: true, windows: [[0.15, 0.3, 0.25, 0.3]], door: [0.6, 0.2], bricks: false });
house(625, 742, 140, 90, { far: true, roundWin: true, door: [0.4, 0.22], bricks: false });
tree(600, 745, 0.9, true);
house(1090, 742, 140, 85, { far: true, chimney: true, windows: [[0.2, 0.3, 0.3, 0.3]], bricks: false });
house(1230, 745, 130, 90, { far: true, windows: [[0.55, 0.3, 0.3, 0.3]], bricks: false });
house(1480, 742, 150, 90, { far: true, roundWin: true, door: [0.3, 0.22], bricks: false });
tree(320, 742, 0.8, true);
tree(1690, 745, 0.9, true);
fence(1060, 1290, 752, 62, true);

// ---- main row ----
house(45, 760, 200, 135, { roofH: 75, door: [0.15, 0.2], windows: [[0.55, 0.28, 0.3, 0.28]] });
house(385, 760, 230, 150, { roofH: 85, chimney: false, door: [0.62, 0.22], doorWin: true, windows: [[0.12, 0.3, 0.3, 0.32]] });
bush(280, 760, 110);
tree(650, 760, 1.15);
fence(1075, 1290, 760, 75);
house(815, 760, 290, 190, { roofH: 88, chimney: true, chimneyAt: 0.68, overhang: 12, bricks: true, avoid: [[WIN.x - 12, WIN.y - 12, WIN.w + 24, WIN.h + 24]] });
fn(t => sleepingWindow(WIN.x, WIN.y, 0.2, t, { thought: clamp((t - 7.0) / 1.6) }));
bush(700, 760, 105);
bush(1150, 760, 110);
house(1300, 760, 220, 150, { roofH: 90, shingles: true, chimney: true, chimneyAt: 0.78, windows: [[0.1, 0.3, 0.28, 0.32]], porch: [0.55, 0.3] });
tree(1580, 760, 1.1);
house(1640, 760, 230, 140, { roofH: 80, roundWin: true, door: [0.72, 0.2], windows: [[0.15, 0.32, 0.3, 0.3]] });

// ---- ground ----
shape(G.line(40, 772, 1880, 772, R({ strokeWidth: 1.6 })));
shape(G.line(30, 795, 1890, 795, R({ strokeWidth: 1.6 })));
for (let x = 120; x < 1880; x += 170) shape(G.line(x, 772, x - 6, 795, R({ strokeWidth: 1.2 })));
shape(G.line(50, 860, 1870, 860, R({ strokeWidth: 1.6 })));
for (let x = 140; x < 1870; x += 150) shape(G.line(x, 860, x + (x - 960) * 0.06, 880, R({ strokeWidth: 1.2 })));
for (const [x, y] of [[345, 846], [1350, 846], [520, 758], [1020, 758], [1210, 758], [1625, 758]]) tuft(x, y, 0.9);

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
