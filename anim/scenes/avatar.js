// Channel avatar variants (render 1920x1080, crop the center 1080x1080 -> 800x800). Choose with window.AV = 'A' | 'B' | 'C'.
const DURATION = 0.04;
function face(cx, cy, k, smile = 'grin') {   // the hero's head only (wide oval, dot eyes, smile), scale k
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
  ctx.beginPath(); ctx.ellipse(0, 0, 125, 100, 0, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.stroke();
  ctx.fillStyle = C.ink; for (const [ex, ey] of [[-38, -14], [40, -18]]) { ctx.beginPath(); ctx.arc(ex, ey, 10, 0, 7); ctx.fill(); }
  if (smile === 'grin') { ctx.beginPath(); ctx.moveTo(-34, 18); ctx.bezierCurveTo(-18, 54, 26, 52, 40, 12); ctx.closePath(); ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(-30, 22); ctx.bezierCurveTo(-10, 38, 22, 36, 38, 14); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
}
function bulb(cx, cy, k) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
  ctx.strokeStyle = 'rgba(224,168,40,0.9)'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.1125); ctx.beginPath(); ctx.moveTo(Math.cos(a) * 110, Math.sin(a) * 110 - 10); ctx.lineTo(Math.cos(a) * 150, Math.sin(a) * 150 - 10); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-34, 60); ctx.bezierCurveTo(-34, 30, -80, 10, -80, -40); ctx.arc(0, -40, 80, Math.PI, 0); ctx.bezierCurveTo(80, 10, 34, 30, 34, 60); ctx.closePath();
  ctx.fillStyle = '#ffd34d'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-18, 55); ctx.lineTo(-10, -10); ctx.lineTo(0, 10); ctx.lineTo(10, -10); ctx.lineTo(18, 55); ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-36, 60, 72, 44, 10); ctx.fillStyle = '#b9bec1'; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-36, 82); ctx.lineTo(36, 82); ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();
}
function brain(cx, cy, k) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
  ctx.beginPath(); const bumps = [[-70, -10, 45], [-40, -50, 45], [10, -60, 48], [55, -35, 45], [70, 10, 42], [30, 40, 42], [-25, 40, 42], [-65, 25, 38]];
  for (const [x, y, r] of bumps) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 7); }
  ctx.fillStyle = '#f6b8c4'; ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.beginPath(); for (const [x, y, r] of bumps) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 7); } ctx.stroke();
  ctx.fillStyle = '#f6b8c4'; ctx.beginPath(); ctx.ellipse(0, -5, 85, 60, 0, 0, 7); ctx.fill();
  ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -75); ctx.bezierCurveTo(-10, -30, 10, 0, 0, 60); ctx.stroke();
  for (const [a, b, c, d] of [[-60, -20, -30, -10], [-55, 20, -20, 15], [30, -30, 60, -15], [25, 15, 60, 20]]) { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c) / 2, b - 20, c, d); ctx.stroke(); }
  ctx.restore();
}
function render(t) {
  const v = window.AV || 'A';
  beginFrame(); setCamera(960, 540, 1); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (v === 'A') {          // light background, big face, glowing bulb
    ctx.fillStyle = '#f4f1e8'; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(960, 330, 30, 960, 330, 420); g.addColorStop(0, 'rgba(255,214,102,0.8)'); g.addColorStop(1, 'rgba(255,214,102,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    face(960, 690, 2.9); bulb(960, 270, 1.35);
  } else if (v === 'B') {   // yellow background, face with a thought cloud holding a brain
    ctx.fillStyle = '#ffd34d'; ctx.fillRect(0, 0, W, H);
    face(880, 760, 2.4, 'smile');
    ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = 9;
    for (const [x, y, r] of [[1060, 560, 20], [1100, 490, 30]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(1110, 330, 165, 130, 0, 0, 7); ctx.fill(); ctx.stroke();
    brain(1110, 335, 1.15);
  } else {                  // dark background, just the face — reads at any size
    ctx.fillStyle = '#2c2c2c'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(960, 540, 470, 0, 7); ctx.fill();
    face(960, 560, 3.2);
  }
  endFrame();
}
