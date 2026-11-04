// Thumbnail v2 "before / after": DAY 1 (sad, empty jar, cool) | YEAR 10 (thrilled, overflowing jar, money rain, warm).
const DURATION = 0.04;
function render(t) {
  beginFrame(); setCamera(960, 540, 1);
  // two halves split by a jagged diagonal
  const split = [[1010, -20], [930, 300], [1000, 560], [900, 820], [960, 1100]];
  ctx.fillStyle = '#dfe5ec'; ctx.beginPath(); ctx.moveTo(0, 0); split.forEach(p => ctx.lineTo(...p)); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  const g = ctx.createRadialGradient(1450, 560, 60, 1450, 560, 700); g.addColorStop(0, 'rgba(255,214,102,0.85)'); g.addColorStop(1, 'rgba(255,214,102,0)');
  ctx.save(); ctx.beginPath(); ctx.moveTo(W, 0); split.forEach(p => ctx.lineTo(...p)); ctx.lineTo(W, H); ctx.closePath(); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(224,168,40,0.4)'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; ctx.beginPath(); ctx.moveTo(1450 + Math.cos(a) * 470, 560 + Math.sin(a) * 470); ctx.lineTo(1450 + Math.cos(a) * 580, 560 + Math.sin(a) * 580); ctx.stroke(); }
  ctx.restore();
  ctx.beginPath(); split.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.strokeStyle = C.ink; ctx.lineWidth = 14; ctx.lineJoin = 'round'; ctx.stroke();
  // left: day 1
  heroFront(330, 1010, 1.25, { face: 'sad', armR: [130, -130], armL: [-130, -130] });
  jar(690, 1010, 330, 0.03, 4);
  // right: year 10 with money rain
  jar(1560, 1010, 560, 1, 21);
  heroFront(1190, 1010, 1.25, { face: 'grin', armL: [-200, -330], armR: [200, -330] });
  const r = rng(5); for (let k = 0; k < 12; k++) { const x = 1050 + r() * 860, y = 420 + r() * 140; if (k % 3) bill(x, y, 120 + r() * 50, (r() - 0.5) * 1.6, r() < 0.5 ? '$100' : '$10'); else coin(x, y, 24); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // labels
  at(250, 110, 1, -0.04, () => marker('DAY 1', 0, 0, 90, { hl: '#fff' }));
  at(1720, 110, 1, 0.04, () => marker('YEAR 10', 0, 0, 90, { hl: YELLOW }));
  at(470, 330, 1, -0.05, () => marker('$10', 0, 0, 230, { color: '#fff', outline: true }));
  at(1450, 300, 1, -0.04, () => marker('$52,600', 0, 0, 190, { color: GREEN, outline: true }));
  endFrame();
}
