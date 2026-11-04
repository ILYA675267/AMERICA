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
  // grey rain cloud over the sad hero
  ctx.save(); ctx.translate(0, -120);
  ctx.fillStyle = '#9aa3ad'; ctx.strokeStyle = C.ink; ctx.lineWidth = 7;
  ctx.beginPath(); for (const [cx, cy, rr] of [[170, 470, 55], [235, 440, 70], [305, 465, 55], [240, 490, 60]]) { ctx.moveTo(cx + rr, cy); ctx.arc(cx, cy, rr, 0, 7); } ctx.fill();
  ctx.beginPath(); ctx.moveTo(115, 470); ctx.bezierCurveTo(100, 410, 160, 395, 180, 410); ctx.bezierCurveTo(200, 360, 280, 365, 290, 410); ctx.bezierCurveTo(350, 400, 370, 470, 340, 500); ctx.bezierCurveTo(300, 540, 150, 540, 115, 470); ctx.stroke();
  ctx.restore();
  heroFront(330, 1010, 1.25, { face: 'sad', armR: [150, -150], armL: [-130, -130] });
  // rain falling onto his head
  ctx.strokeStyle = '#6f9fd8'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (const [x, y] of [[160, 430], [215, 470], [265, 435], [315, 470], [190, 505], [290, 510]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 7, y + 22); ctx.stroke(); }
  // a lonely, crumpled $10 in his hand
  bill(530, 830, 120, -0.35, '$10');
  // a fly buzzing around the empty jar, with a dotted path
  ctx.setLineDash([6, 10]); ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(610, 640); ctx.bezierCurveTo(650, 560, 760, 560, 780, 610); ctx.bezierCurveTo(800, 660, 720, 680, 740, 630); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.ellipse(745, 620, 9, 7, 0, 0, 7); ctx.fillStyle = C.ink; ctx.fill();
  ctx.beginPath(); ctx.ellipse(738, 607, 9, 6, -0.6, 0, 7); ctx.ellipse(752, 607, 9, 6, 0.6, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke();
  jar(690, 1010, 330, 0.03, 4);
  // right: year 10 with money rain
  // money rain behind the hero and the jar (drawn first, so they cover it)
  const r = rng(5);
  // extra money behind the jar (around its edges and above the lid)
  for (let k = 0; k < 18; k++) { const side = k % 2 ? 1 : -1, x = 1560 + side * (150 + r() * 230), y = 380 + r() * 620; if (k % 5 === 0) coin(x, y, 24); else bill(x, y, 120 + r() * 40, (r() - 0.5) * 1.8, r() < 0.5 ? '$100' : '$10'); }
  for (let k = 0; k < 4; k++) { const x = 1380 + r() * 360, y = 390 + r() * 70; bill(x, y, 120, (r() - 0.5) * 1.8, '$100'); }
  for (let k = 0; k < 18; k++) { const x = 1010 + r() * 890, y = 400 + r() * 560; if (k % 4 === 0) coin(x, y, 24); else bill(x, y, 120 + r() * 40, (r() - 0.5) * 1.8, r() < 0.5 ? '$100' : '$10'); }
  jar(1560, 1010, 560, 1, 21);
  heroFront(1120, 1010, 1.25, { face: 'grin', armL: [-200, -330], armR: [175, -330] });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // labels
  at(250, 110, 1, -0.04, () => marker('DAY 1', 0, 0, 90, { hl: '#fff' }));
  at(1720, 110, 1, 0.04, () => marker('YEAR 10', 0, 0, 90, { hl: YELLOW }));
  at(600, 330, 1, -0.05, () => marker('$10', 0, 0, 210, { color: '#fff', outline: true }));
  at(1450, 300, 1, -0.04, () => marker('$52,600', 0, 0, 190, { color: GREEN, outline: true }));
  endFrame();
}
