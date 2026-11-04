// The channel's hero (round white head, dot eyes, simple body) and the bedroom window he sleeps behind.
// Drawn with clean ink paths (no rough jitter) so he stays crisp in close-ups.
function inkPath(fill, width = 7) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = C.ink; ctx.lineWidth = width * HERO_LINE; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
}

// Window with the sleeping hero. Local box 960x640, placed at world (x, y) with scale s.
function sleepingWindow(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // glass + interior, clipped
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960, 640); ctx.clip();
  ctx.fillStyle = C.glass; ctx.fillRect(0, 0, 960, 640);
  // bed sheet
  ctx.beginPath(); ctx.moveTo(-10, 470); ctx.bezierCurveTo(250, 430, 600, 450, 970, 470); ctx.lineTo(970, 650); ctx.lineTo(-10, 650); ctx.closePath();
  inkPath(C.sheet, 5);
  ctx.beginPath(); ctx.moveTo(500, 600); ctx.bezierCurveTo(600, 560, 760, 590, 900, 560); inkPath(null, 4);
  const br = Math.sin(t * 2.2) * 5; // breathing
  // pillow
  ctx.save(); ctx.translate(220, 455); ctx.rotate(-0.32);
  ctx.beginPath(); ctx.moveTo(-170, -60); ctx.quadraticCurveTo(0, -110, 170, -60); ctx.quadraticCurveTo(200, 0, 170, 70);
  ctx.quadraticCurveTo(0, 110, -170, 70); ctx.quadraticCurveTo(-200, 0, -170, -60); ctx.closePath(); inkPath('#dadddf', 6);
  ctx.beginPath(); for (let k = 0; k < 8; k++) ctx.lineTo(-120 + k * 34, 20 + (k % 2 ? -16 : 16)); inkPath(null, 4);
  ctx.restore();
  // legs + feet
  ctx.save(); ctx.translate(0, br * 0.4);
  for (const [y1, y2] of [[500, 478], [545, 560]]) {
    ctx.beginPath(); ctx.moveTo(620, y1); ctx.lineTo(760, y2); ctx.lineWidth = 50 + 14 * HERO_LINE; ctx.lineCap = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.lineWidth = 50; ctx.strokeStyle = C.white; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(790, y2, 26, 36, 0.3, 0, 7); inkPath(C.white, 6);
  }
  // torso
  ctx.save(); ctx.translate(520, 505 + br); ctx.rotate(0.1);
  ctx.beginPath(); ctx.roundRect(-120, -70, 230, 140, 40); inkPath(C.white, 7);
  // arm resting on the torso, mitten hand with tiny fingers
  ctx.beginPath(); ctx.moveTo(-70, -20); ctx.quadraticCurveTo(-10, 10, 30, -8); inkPath(null, 6);
  ctx.beginPath(); ctx.moveTo(30, -8); ctx.lineTo(50, -28); ctx.moveTo(30, -8); ctx.lineTo(56, -4); ctx.moveTo(30, -8); ctx.lineTo(46, 14); inkPath(null, 5);
  ctx.restore(); ctx.restore();
  // head
  ctx.save(); ctx.translate(370, 360 + br * 0.6); ctx.rotate(-0.3);
  ctx.beginPath(); ctx.ellipse(0, 0, 172, 138, 0, 0, Math.PI * 2); inkPath(C.white, 8);
  ctx.beginPath(); ctx.arc(-52, -2, 22, 0.15 * Math.PI, 0.85 * Math.PI); inkPath(null, 7);
  ctx.beginPath(); ctx.arc(48, -2, 22, 0.15 * Math.PI, 0.85 * Math.PI); inkPath(null, 7);
  ctx.beginPath(); ctx.arc(0, 30, 62, 0.22 * Math.PI, 0.78 * Math.PI); inkPath(null, 7);
  ctx.restore();
  // yellow scribble = his own thought, drawn on
  if (o.thought > 0) {
    strokePartial(scribblePoints(700, 150, 85, 68, 6, 5), o.thought * 1.25, C.yellow, 7);
    const tail = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * 9; tail.push([640 - i * 1.6 + Math.cos(a) * 22, 300 - i * 1.2 + Math.sin(a) * 14]); }
    strokePartial(tail.reverse(), (o.thought - 0.55) / 0.45, C.yellow, 8);
  }
  // curtains
  for (const side of [-1, 1]) {
    ctx.save(); if (side === 1) { ctx.translate(960, 0); ctx.scale(-1, 1); }
    ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(150, -10); ctx.bezierCurveTo(135, 200, 95, 330, 100, 420);
    ctx.bezierCurveTo(115, 500, 165, 580, 175, 650); ctx.lineTo(-10, 650); ctx.closePath(); inkPath('#d3d7d9', 6);
    ctx.beginPath(); ctx.moveTo(60, 0); ctx.bezierCurveTo(55, 150, 35, 300, 40, 410); inkPath(null, 4);
    ctx.beginPath(); ctx.moveTo(60, 440); ctx.bezierCurveTo(70, 520, 90, 580, 95, 640); inkPath(null, 4);
    ctx.beginPath(); ctx.ellipse(92, 425, 30, 21, 0, 0, 7); inkPath('#d3d7d9', 6);
    ctx.restore();
  }
  // glass reflections
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  for (const [a, b] of [[260, 120], [560, 60]]) { ctx.beginPath(); ctx.moveTo(a + 400, -10); ctx.lineTo(a + 400 + b, -10); ctx.lineTo(a - 200 + b, 650); ctx.lineTo(a - 200, 650); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  // frame
  ctx.beginPath(); ctx.rect(-36, -36, 1032, 712); ctx.rect(0, 0, 960, 640);
  ctx.fillStyle = C.paperFill; ctx.fill('evenodd');
  ctx.beginPath(); ctx.rect(-36, -36, 1032, 712); inkPath(null, 12);
  ctx.beginPath(); ctx.rect(0, 0, 960, 640); inkPath(null, 9);
  for (const [a, b, c2, d] of [[-36, -36, 0, 0], [996, -36, 960, 0], [-36, 676, 0, 640], [996, 676, 960, 640]]) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c2, d); inkPath(null, 6); }
  ctx.restore();
}
