// Front view of the hero, drawn from whatif/hero_reference.jpg: wide oval head, two dot eyes, no neck,
// body widening down into two thick legs, rounded shoes pointing outward, thin arms with round mitten hands.
// Local units: feet at y = 0, head ry = 100. o: { face: 'smile'|'shock'|'grin', armL: [x,y], armR: [x,y] (hand positions) }
function heroFront(x, y, s, o = {}) {
  const T = -205 + (o.bob || 0), lw = 6 * HERO_LINE;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.cane) { ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(150, -150); ctx.quadraticCurveTo(150, -185, 120, -180); ctx.strokeStyle = '#7a5b3a'; ctx.lineWidth = 14; ctx.stroke(); }
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(70,70,75,0.16)'; ctx.beginPath(); ctx.ellipse(0, 4, 110, 14, 0, 0, 7); ctx.fill();
  const stroke = (fill) => { if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = C.ink; ctx.lineWidth = lw; ctx.stroke(); };
  // arms (behind body): shoulder -> elbow -> hand
  const armTo = (side, hand) => {
    const sh = [side * 34, T + 28];
    const mid = [(sh[0] + hand[0]) / 2 + side * 28, (sh[1] + hand[1]) / 2 + 10];
    ctx.beginPath(); ctx.moveTo(...sh); ctx.quadraticCurveTo(mid[0], mid[1], hand[0], hand[1]);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 16 + 2 * lw; ctx.stroke(); ctx.strokeStyle = C.white; ctx.lineWidth = 16; ctx.stroke();
    ctx.beginPath(); ctx.arc(hand[0], hand[1], 17, 0, 7); stroke(C.white);
    ctx.beginPath(); ctx.moveTo(hand[0] - side * 4, hand[1] - 12); ctx.lineTo(hand[0] - side * 14, hand[1] - 24); stroke();   // thumb
  };
  armTo(-1, o.armL || [-92, -110]);
  armTo(1, o.armR || [92, -110]);
  // body + legs as one silhouette
  ctx.beginPath();
  ctx.moveTo(-30, T); ctx.bezierCurveTo(-44, T + 24, -54, T + 70, -54, -96); ctx.lineTo(-50, -20);
  ctx.lineTo(-10, -20); ctx.lineTo(-9, -80); ctx.quadraticCurveTo(0, -86, 9, -80); ctx.lineTo(10, -20); ctx.lineTo(50, -20);
  ctx.lineTo(54, -96); ctx.bezierCurveTo(54, T + 70, 44, T + 24, 30, T); ctx.closePath();
  stroke(C.white);
  // shoes pointing outward, flat soles
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side, 1);
    ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(6, -22); ctx.quadraticCurveTo(6, -30, 16, -30); ctx.lineTo(44, -30);
    ctx.bezierCurveTo(70, -30, 82, -16, 80, -6); ctx.quadraticCurveTo(79, 0, 70, 0); ctx.closePath(); stroke(C.white);
    ctx.restore();
  }
  // head
  ctx.save(); ctx.translate(0, T - 82); ctx.rotate(o.tilt || 0);
  ctx.beginPath(); ctx.ellipse(0, 0, 125, 100, 0, 0, 7); stroke(C.white);
  ctx.fillStyle = C.ink;
  const face = o.face || 'smile';
  const er = face === 'shock' ? 13 : 9.5;
  if (o.wildHair) { ctx.strokeStyle = C.ink; ctx.lineWidth = lw * 0.8; for (let k = 0; k < 9; k++) { const a = Math.PI * (1.05 + k * 0.1); ctx.beginPath(); ctx.moveTo(Math.cos(a) * 115, Math.sin(a) * 92); ctx.quadraticCurveTo(Math.cos(a) * 160, Math.sin(a) * 140 + 20, Math.cos(a) * 150 + (k % 2 ? 20 : -20), Math.sin(a) * 150); ctx.stroke(); } }
  if (o.cap) { ctx.beginPath(); ctx.moveTo(-112, -42); ctx.bezierCurveTo(-100, -120, 100, -120, 112, -42); ctx.closePath(); ctx.fillStyle = o.cap; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = lw; ctx.stroke(); ctx.beginPath(); ctx.moveTo(100, -45); ctx.quadraticCurveTo(160, -40, 175, -25); ctx.lineTo(105, -30); ctx.stroke(); }
  ctx.fillStyle = C.ink;
  if (o.blink) { ctx.strokeStyle = C.ink; ctx.lineWidth = lw; for (const [ex, ey] of [[-38, -14], [40, -18]]) { ctx.beginPath(); ctx.moveTo(ex - 11, ey); ctx.lineTo(ex + 11, ey); ctx.stroke(); } }
  else for (const [ex, ey] of [[-38, -14], [40, -18]]) { ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill(); }
  if (o.glasses) { ctx.strokeStyle = C.ink; ctx.lineWidth = lw * 0.8; for (const [ex, ey] of [[-38, -14], [40, -18]]) { ctx.beginPath(); ctx.arc(ex, ey, 28, 0, 7); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-10, -18); ctx.lineTo(12, -20); ctx.stroke(); }
  if (o.mustache) { ctx.beginPath(); ctx.ellipse(-14, 14, 22, 9, 0.2, 0, 7); ctx.ellipse(18, 12, 22, 9, -0.2, 0, 7); ctx.fillStyle = '#9a9a9a'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = lw * 0.6; ctx.stroke(); ctx.fillStyle = C.ink; }
  if (face === 'shock') {
    for (const [ex, ey] of [[-38, -14], [40, -18]]) { ctx.beginPath(); ctx.arc(ex, ey - 32, 16, 1.15 * Math.PI, 1.85 * Math.PI); ctx.strokeStyle = C.ink; ctx.lineWidth = lw; ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(2, 34, 18, 24, 0, 0, 7); ctx.fillStyle = C.ink; ctx.fill();
  } else if (face === 'sad') {
    ctx.beginPath(); ctx.moveTo(-26, 34); ctx.bezierCurveTo(-8, 18, 20, 18, 36, 30); ctx.strokeStyle = C.ink; ctx.lineWidth = lw; ctx.stroke();
  } else if (face === 'flat') {
    ctx.beginPath(); ctx.moveTo(-22, 26); ctx.lineTo(30, 24); ctx.strokeStyle = C.ink; ctx.lineWidth = lw; ctx.stroke();
  } else if (face === 'grin') {
    ctx.beginPath(); ctx.moveTo(-34, 18); ctx.bezierCurveTo(-18, 54, 26, 52, 40, 12); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(-30, 22); ctx.bezierCurveTo(-10, 38, 22, 36, 38, 14); ctx.strokeStyle = C.ink; ctx.lineWidth = lw; ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}
