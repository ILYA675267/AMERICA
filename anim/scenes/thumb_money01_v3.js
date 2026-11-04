// Thumbnail v3 "this coffee": shocked hero holds a coffee cup, an arrow points to a mountain of money, "$800,000?".
const DURATION = 0.04;
function render(t) {
  beginFrame(); setCamera(960, 540, 1);
  const im = window.IMG && IMG.bg01_room; if (im) { ctx.globalAlpha = 0.45; ctx.drawImage(im, -80, -45, 2080, 941 * 2080 / 1672); ctx.globalAlpha = 1; }
  const g = ctx.createRadialGradient(1420, 640, 60, 1420, 640, 650); g.addColorStop(0, 'rgba(255,214,102,0.9)'); g.addColorStop(1, 'rgba(255,214,102,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // mountain of money
  const r = rng(11);
  for (let row = 0; row < 9; row++) for (let k = 0; k < 11 - row; k++) {
    const x = 1100 + row * 34 + k * 66 + (r() - 0.5) * 20, y = 1040 - row * 62 + (r() - 0.5) * 16;
    if ((k + row) % 4 === 0) coin(x, y, 30); else bill(x, y, 170, (r() - 0.5) * 0.8, r() < 0.5 ? '$100' : '$10');
  }
  for (let k = 0; k < 8; k++) bill(1150 + r() * 620, 150 + r() * 260, 130, (r() - 0.5) * 1.4, '$100');
  // hero with the coffee, arrow to the money
  heroFront(470, 1040, 1.55, { face: 'shock', armR: [230, -330], armL: [-200, -300] });
  coffee(830, 600, 1.35);
  ctx.strokeStyle = C.ink; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(900, 330); ctx.bezierCurveTo(1000, 220, 1120, 230, 1190, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1195, 336); ctx.lineTo(1130, 318); ctx.moveTo(1195, 336); ctx.lineTo(1182, 270); ctx.stroke();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  at(420, 130, 1, -0.05, () => marker('THIS COFFEE =', 0, 0, 110, { hl: YELLOW }));
  at(1400, 190, 1, 0.03, () => marker('$800,000?', 0, 0, 175, { color: GREEN, outline: true }));
  endFrame();
}
