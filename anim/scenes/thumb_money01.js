// Thumbnail for money ep.01 "What If You Saved $10 a Day for 10 Years?" (render one frame, scale to 1280x720).
// Layout: shocked hero holding a $10 bill on the left, a giant glowing jar of money on the right, big "$50,000" text.
const DURATION = 0.04;

function bill(x, y, w, rot, label, alpha = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.roundRect(-w / 2, -w * 0.24, w, w * 0.48, 6); ctx.fillStyle = '#a9d39e'; ctx.fill();
  ctx.strokeStyle = '#2f4a2c'; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -w * 0.24 + 8, w - 16, w * 0.48 - 16, 4); ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, w * 0.14, w * 0.15, 0, 0, 7); ctx.fillStyle = '#cfe8c7'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2f4a2c'; ctx.font = `${Math.round(w * 0.2)}px "Permanent Marker"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 2);
  ctx.restore();
}
function coin(x, y, r) {
  ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.92, 0, 0, 7); ctx.fillStyle = '#f2c94c'; ctx.fill();
  ctx.strokeStyle = '#7a5b12'; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.65, r * 0.6, 0, 0, 7); ctx.lineWidth = 2; ctx.stroke();
}

function render(t) {
  beginFrame();
  setCamera(960, 540, 1);
  // warm glow behind the jar
  const g = ctx.createRadialGradient(1320, 600, 60, 1320, 600, 620);
  g.addColorStop(0, 'rgba(255, 214, 102, 0.75)'); g.addColorStop(1, 'rgba(255, 214, 102, 0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // rays
  ctx.strokeStyle = 'rgba(224, 168, 40, 0.35)'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(1320 + Math.cos(a) * 430, 600 + Math.sin(a) * 430); ctx.lineTo(1320 + Math.cos(a) * 540, 600 + Math.sin(a) * 540); ctx.stroke(); }

  // ---- jar ----
  const jx = 1320, top = 250, bot = 1000, jw = 520;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(jx - jw * 0.36, top + 40); ctx.quadraticCurveTo(jx - jw / 2, top + 90, jx - jw / 2, top + 200);
  ctx.lineTo(jx - jw / 2, bot - 60); ctx.quadraticCurveTo(jx - jw / 2, bot, jx - jw / 2 + 60, bot); ctx.lineTo(jx + jw / 2 - 60, bot);
  ctx.quadraticCurveTo(jx + jw / 2, bot, jx + jw / 2, bot - 60); ctx.lineTo(jx + jw / 2, top + 200); ctx.quadraticCurveTo(jx + jw / 2, top + 90, jx + jw * 0.36, top + 40); ctx.closePath();
  ctx.fillStyle = 'rgba(214, 230, 232, 0.55)'; ctx.fill();
  ctx.save(); ctx.clip();
  // money inside, piled up
  const r = rng(42);
  for (let k = 0; k < 120; k++) {
    const yy = bot - 30 - (k / 120) * (bot - top - 120) + (r() - 0.5) * 40, xx = jx + (r() - 0.5) * (jw - 60);
    if (r() < 0.62) bill(xx, yy, 150 + r() * 40, (r() - 0.5) * 1.4, r() < 0.5 ? '$100' : '$10'); else coin(xx, yy, 26 + r() * 10);
  }
  ctx.restore();
  // glass shine + outline
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(jx - jw / 2 + 50, top + 240); ctx.lineTo(jx - jw / 2 + 50, bot - 120); ctx.stroke();
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(jx - jw / 2 + 92, top + 260); ctx.lineTo(jx - jw / 2 + 92, top + 420); ctx.stroke();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(jx - jw * 0.36, top + 40); ctx.quadraticCurveTo(jx - jw / 2, top + 90, jx - jw / 2, top + 200);
  ctx.lineTo(jx - jw / 2, bot - 60); ctx.quadraticCurveTo(jx - jw / 2, bot, jx - jw / 2 + 60, bot); ctx.lineTo(jx + jw / 2 - 60, bot);
  ctx.quadraticCurveTo(jx + jw / 2, bot, jx + jw / 2, bot - 60); ctx.lineTo(jx + jw / 2, top + 200); ctx.quadraticCurveTo(jx + jw / 2, top + 90, jx + jw * 0.36, top + 40); ctx.closePath(); ctx.stroke();
  ctx.restore();
  // lid
  ctx.beginPath(); ctx.roundRect(jx - jw * 0.4, top - 10, jw * 0.8, 60, 14); ctx.fillStyle = '#9aa1a6'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.stroke();
  for (let k = 1; k < 9; k++) { ctx.beginPath(); ctx.moveTo(jx - jw * 0.4 + k * jw * 0.8 / 9, top - 2); ctx.lineTo(jx - jw * 0.4 + k * jw * 0.8 / 9, top + 42); ctx.lineWidth = 4; ctx.stroke(); }
  // money spilling out over the top
  bill(jx - 150, top - 40, 170, -0.5, '$100'); bill(jx + 140, top - 60, 170, 0.45, '$10'); coin(jx + 10, top - 50, 30); bill(jx + 30, top - 120, 160, 0.15, '$100');
  // label on the jar
  ctx.save(); ctx.translate(jx, 760); ctx.rotate(-0.04);
  ctx.beginPath(); ctx.roundRect(-150, -55, 300, 110, 12); ctx.fillStyle = '#fbf6e6'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '62px "Permanent Marker"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('10 YEARS', 0, 4);
  ctx.restore();

  // ---- hero: shocked, holding a $10 bill ----
  heroFront(470, 1010, 1.55, { face: 'shock', armR: [150, -200], armL: [-215, -250], tilt: 0.05 });
  bill(720, 700, 230, -0.25, '$10');
  // arrow from bill to jar
  ctx.strokeStyle = C.ink; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(760, 560); ctx.bezierCurveTo(820, 380, 940, 330, 1010, 360); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1015, 362); ctx.lineTo(965, 320); ctx.moveTo(1015, 362); ctx.lineTo(955, 395); ctx.stroke();

  // ---- big text ----
  ctx.save(); ctx.translate(120, 250); ctx.rotate(-0.05);
  ctx.font = '150px "Permanent Marker"'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
  ctx.fillStyle = '#ffd34d'; const tw = ctx.measureText('$10 A DAY').width;
  ctx.fillRect(-20, -125, tw + 40, 150);
  ctx.fillStyle = C.ink; ctx.fillText('$10 A DAY', 0, 0);
  ctx.restore();
  ctx.save(); ctx.translate(1320, 215); ctx.rotate(0.03);
  ctx.font = '190px "Permanent Marker"'; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  ctx.strokeStyle = C.ink; ctx.lineWidth = 34; ctx.strokeText('$50,000', 0, 0);
  ctx.fillStyle = '#4cbb4c'; ctx.fillText('$50,000', 0, 0);
  ctx.restore();
  endFrame();
}
