// Props for explainer scenes, drawn in the hero's clean-ink style (white/soft fills, one dark outline).
// All functions draw at the current transform; sizes are in world pixels (1920x1080 frame).
const INK = () => 6 * HERO_LINE;
const GREEN = '#4cbb4c', MONEY = '#a9d39e', MONEY_INK = '#2f4a2c', GOLD = '#f2c94c', RED = '#e8483f', YELLOW = '#ffd34d';
const pop = (t, t0, d = 0.45) => easeOutBack((t - t0) / d);
const fade = (t, t0, d = 0.4) => clamp((t - t0) / d);

function ink(fill, w = INK()) { if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = C.ink; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
function at(x, y, s, rot, f) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (s !== 1) ctx.scale(s, s); f(); ctx.restore(); }
// Write-on mode (board scenes): text appears left-to-right as if written with a marker, with a pen at the writing edge.
// Each piece of text is remembered by scene + its letters (digits ignored, so animated counters are written once).
let WRITE_ON = false, WRITE_T = 0, WRITE_SCN = -1;
const WRITTEN = new Map(), QEND = new Map();
function marker(text, x, y, size, o = {}) {
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  ctx.font = `${size}px "Permanent Marker"`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const w = ctx.measureText(text).width;
  let wp = 1;
  if (WRITE_ON && !o.noWrite) {
    // one marker for the whole board: each new text waits in a queue until the previous one is finished
    const key = WRITE_SCN + '|' + text.replace(/[0-9.,]/g, '#') + '|' + size;
    const dur = Math.min(1.3, 0.2 + text.length * 0.05);
    let e = WRITTEN.get(key);
    if (!e || e.seen > WRITE_T) {
      const start = Math.max(WRITE_T, (QEND.get(WRITE_SCN) || 0) + 0.08);
      e = { seen: WRITE_T, start, dur }; WRITTEN.set(key, e); QEND.set(WRITE_SCN, start + dur);
    }
    wp = clamp((WRITE_T - e.start) / e.dur);
  }
  const x0 = o.align === 'left' ? 0 : o.align === 'right' ? -w : -w / 2;
  if (wp < 1) { ctx.save(); ctx.beginPath(); ctx.rect(x0 - size * 0.3, -size, (w + size * 0.6) * wp, size * 2); ctx.clip(); }
  if (o.hl) { ctx.fillStyle = o.hl; const x0 = o.align === 'left' ? -14 : -w / 2 - 18; ctx.fillRect(x0, -size * 0.55, w + 36, size * 1.1); }
  if (o.outline) { ctx.strokeStyle = C.ink; ctx.lineWidth = size * 0.17; ctx.strokeText(text, 0, 0); }
  ctx.fillStyle = o.color || C.ink; ctx.fillText(text, 0, 0);
  if (wp < 1) {
    ctx.restore();
    // the marker pen at the writing edge, wiggling like handwriting
    const ex = x0 + w * wp, ey = Math.sin(WRITE_T * 40) * size * 0.12, k = size / 100;
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(-0.75); ctx.scale(k, k);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(14, -8); ctx.lineTo(14, 8); ctx.closePath(); ctx.fillStyle = o.color || C.ink; ctx.fill();
    ctx.beginPath(); ctx.roundRect(14, -14, 40, 28, 6); ctx.fillStyle = o.color === GREEN ? GREEN : o.color === RED ? RED : '#3a3a3a'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(54, -16, 120, 32, 10); ctx.fillStyle = '#f4f1e8'; ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.restore(); return w;
}
const money = n => '$' + Math.round(n).toLocaleString('en-US');

function bill(x, y, w, rot = 0, label = '$10') {
  at(x, y, 1, rot, () => {
    ctx.beginPath(); ctx.roundRect(-w / 2, -w * 0.24, w, w * 0.48, 6); ctx.fillStyle = MONEY; ctx.fill(); ctx.strokeStyle = MONEY_INK; ctx.lineWidth = Math.max(2.5, w * 0.025); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-w / 2 + w * 0.05, -w * 0.19, w * 0.9, w * 0.38, 4); ctx.lineWidth = Math.max(1.5, w * 0.012); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, w * 0.14, w * 0.15, 0, 0, 7); ctx.fillStyle = '#cfe8c7'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = MONEY_INK; ctx.font = `${Math.round(w * 0.2)}px "Permanent Marker"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2);
  });
}
function coin(x, y, r) {
  ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.92, 0, 0, 7); ctx.fillStyle = GOLD; ctx.fill(); ctx.strokeStyle = '#7a5b12'; ctx.lineWidth = Math.max(2, r * 0.12); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.62, r * 0.57, 0, 0, 7); ctx.lineWidth = Math.max(1.2, r * 0.07); ctx.stroke();
}
// glass jar: bottom-center at (x, y), height h, fill 0..1 with money
function jar(x, y, h, fill = 0, seed = 1) {
  const w = h * 0.7, top = y - h;
  const body = () => { ctx.beginPath(); ctx.moveTo(x - w * 0.36, top + h * 0.06); ctx.quadraticCurveTo(x - w / 2, top + h * 0.12, x - w / 2, top + h * 0.26);
    ctx.lineTo(x - w / 2, y - h * 0.08); ctx.quadraticCurveTo(x - w / 2, y, x - w / 2 + h * 0.08, y); ctx.lineTo(x + w / 2 - h * 0.08, y);
    ctx.quadraticCurveTo(x + w / 2, y, x + w / 2, y - h * 0.08); ctx.lineTo(x + w / 2, top + h * 0.26); ctx.quadraticCurveTo(x + w / 2, top + h * 0.12, x + w * 0.36, top + h * 0.06); ctx.closePath(); };
  ctx.fillStyle = 'rgba(70,70,75,0.14)'; ctx.beginPath(); ctx.ellipse(x, y + 4, w * 0.6, h * 0.03, 0, 0, 7); ctx.fill();
  body(); ctx.fillStyle = 'rgba(214,230,232,0.6)'; ctx.fill();
  if (fill > 0) {
    ctx.save(); body(); ctx.clip();
    const r = rng(seed), n = Math.round(110 * fill), level = y - (h * 0.9) * fill;
    for (let k = 0; k < n; k++) {
      const yy = y - 10 - (k / Math.max(1, n)) * (y - level - 10) + (r() - 0.5) * h * 0.05, xx = x + (r() - 0.5) * (w - 20);
      if (r() < 0.62) bill(xx, yy, h * 0.24, (r() - 0.5) * 1.4, r() < 0.5 ? '$100' : '$10'); else coin(xx, yy, h * 0.04);
    }
    ctx.restore();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = h * 0.025; ctx.beginPath(); ctx.moveTo(x - w / 2 + h * 0.07, top + h * 0.32); ctx.lineTo(x - w / 2 + h * 0.07, y - h * 0.15); ctx.stroke();
  body(); ink(null, Math.max(4, h * 0.012));
  ctx.beginPath(); ctx.roundRect(x - w * 0.4, top - h * 0.02, w * 0.8, h * 0.08, h * 0.02); ink('#9aa1a6', Math.max(4, h * 0.012));
}
function coffee(x, y, s = 1) {
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.moveTo(-45, -120); ctx.lineTo(45, -120); ctx.lineTo(35, 0); ctx.lineTo(-35, 0); ctx.closePath(); ink('#fbf6e6');
    ctx.beginPath(); ctx.roundRect(-52, -138, 104, 22, 8); ink('#8a5a3c');
    ctx.beginPath(); ctx.rect(-41, -85, 82, 34); ink('#c9a27e');
    for (const dx of [-15, 12]) { ctx.beginPath(); ctx.moveTo(dx, -150); ctx.bezierCurveTo(dx - 12, -170, dx + 12, -185, dx, -205); ink(null, 4); }
  });
}
function muffin(x, y, s = 1) {
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.moveTo(-40, -50); ctx.lineTo(40, -50); ctx.lineTo(30, 0); ctx.lineTo(-30, 0); ctx.closePath(); ink('#e7c9a0');
    for (const dx of [-20, 0, 20]) { ctx.beginPath(); ctx.moveTo(dx, -48); ctx.lineTo(dx * 0.8, -2); ink(null, 3); }
    ctx.beginPath(); ctx.moveTo(-48, -50); ctx.bezierCurveTo(-60, -110, 60, -110, 48, -50); ctx.closePath(); ink('#8a5a3c');
    for (const [dx, dy] of [[-15, -75], [12, -82], [25, -65]]) { ctx.beginPath(); ctx.arc(dx, dy, 4, 0, 7); ctx.fillStyle = C.ink; ctx.fill(); }
  });
}
function bag(x, y, s = 1) {   // delivery bag
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.moveTo(-60, -130); ctx.lineTo(60, -130); ctx.lineTo(70, 0); ctx.lineTo(-70, 0); ctx.closePath(); ink('#e9d3a8');
    ctx.beginPath(); ctx.moveTo(-60, -130); ctx.lineTo(-40, -150); ctx.lineTo(40, -150); ctx.lineTo(60, -130); ink('#d9bf8e');
    ctx.beginPath(); ctx.arc(0, -65, 26, 0, 7); ink('#fff');
    marker('$', 0, -63, 34);
  });
}
function screen(x, y, w, h, color = '#d3d8da', icon) {
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h, 14); ink('#3a3a3a');
  ctx.beginPath(); ctx.roundRect(x - w / 2 + 10, y - h + 10, w - 20, h - 30, 8); ink(color, 3);
  if (icon) { ctx.beginPath(); ctx.moveTo(x - 18, y - h / 2 - 30); ctx.lineTo(x + 24, y - h / 2 - 8); ctx.lineTo(x - 18, y - h / 2 + 14); ctx.closePath(); ink('#fff', 4); }
}
function crossOut(x, y, r, p) {   // red X drawn on over something
  ctx.strokeStyle = RED; ctx.lineWidth = 14; ctx.lineCap = 'round';
  const a = clamp(p * 2), b = clamp(p * 2 - 1);
  if (a > 0) { ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x - r + 2 * r * a, y - r + 2 * r * a); ctx.stroke(); }
  if (b > 0) { ctx.beginPath(); ctx.moveTo(x + r, y - r); ctx.lineTo(x + r - 2 * r * b, y - r + 2 * r * b); ctx.stroke(); }
}
function ticket(x, y) { at(x, y, 1, -0.15, () => { ctx.beginPath(); ctx.roundRect(-90, -55, 180, 110, 10); ink('#fbe3a0'); marker('LOTTO', 0, -12, 40); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(-60 + k * 30, 28, 10, 0, 7); ink('#fff', 3); } }); }
function cryptoCoin(x, y) { ctx.beginPath(); ctx.arc(x, y, 70, 0, 7); ink('#f2a93b'); marker('₿', x, y + 4, 80, { color: '#fff' }); }
function wand(x, y) { at(x, y, 1, -0.6, () => { ctx.beginPath(); ctx.roundRect(-8, -10, 16, 150, 6); ink('#3a3a3a'); ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 22 : 50; ctx.lineTo(Math.cos(a) * r, -40 + Math.sin(a) * r); } ctx.closePath(); ink(YELLOW); }); }

// simple doodle line chart drawn on with progress p; pts in 0..1 space
function chart(x, y, w, h, pts, p, color = GREEN) {
  ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x, y); ctx.lineTo(x + w, y); ink(null, 5);
  const n = pts.length, upto = p * (n - 1);
  ctx.beginPath();
  for (let i = 0; i <= Math.min(n - 1, Math.floor(upto)); i++) { const px = x + pts[i][0] * w, py = y - pts[i][1] * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  const i0 = Math.floor(upto);
  if (i0 < n - 1) { const f = upto - i0; ctx.lineTo(x + lerp(pts[i0][0], pts[i0 + 1][0], f) * w, y - lerp(pts[i0][1], pts[i0 + 1][1], f) * h); }
  ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
function marketPts(seed, n, drift = 0.8, vol = 0.08, crashes = []) {
  const r = rng(seed), pts = []; let v = 0.1;
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1);
    v += drift / n + (r() - 0.5) * vol;
    for (const [at, depth] of crashes) if (Math.abs(f - at) < 0.5 / n) v -= depth;
    pts.push([f, clamp(v, 0.02, 1)]);
  }
  return pts;
}
function bank(x, y, s = 1) {
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.moveTo(-230, -300); ctx.lineTo(0, -400); ctx.lineTo(230, -300); ctx.closePath(); ink('#f6f4ee');
    ctx.beginPath(); ctx.rect(-220, -300, 440, 30); ink('#f6f4ee');
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.rect(-190 + k * 90, -270, 40, 240); ink('#fff'); }
    ctx.beginPath(); ctx.rect(-250, -30, 500, 30); ink('#f6f4ee');
    marker('BANK', 0, -335, 46);
  });
}
function thief(x, y, s = 1, t = 0, bagLabel = '3%') {   // inflation thief: hero-like figure in grey with a mask
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.moveTo(-26, -205); ctx.bezierCurveTo(-40, -180, -50, -140, -50, -96); ctx.lineTo(-46, -20); ctx.lineTo(-8, -20); ctx.lineTo(-8, -80); ctx.lineTo(8, -80); ctx.lineTo(8, -20); ctx.lineTo(46, -20); ctx.lineTo(50, -96); ctx.bezierCurveTo(50, -140, 40, -180, 26, -205); ctx.closePath(); ink('#6b6e73');
    ctx.beginPath(); ctx.ellipse(0, -287, 118, 95, 0, 0, 7); ink('#8b8f94');
    ctx.beginPath(); ctx.roundRect(-110, -320, 220, 50, 22); ink('#2c2c2c');
    for (const ex of [-38, 40]) { ctx.beginPath(); ctx.arc(ex, -296, 10, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-26, -240); ctx.quadraticCurveTo(0, -224, 30, -244); ink(null);
    // sack over the shoulder
    ctx.beginPath(); ctx.moveTo(60, -230); ctx.bezierCurveTo(200, -260, 210, -60, 90, -60); ctx.bezierCurveTo(40, -60, 30, -200, 60, -230); ink('#d9c79e');
    marker(bagLabel, 120, -140, 54);
  });
}
function calendar(x, y, label, s = 1) {
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.roundRect(-150, -190, 300, 190, 14); ink('#fff');
    ctx.beginPath(); ctx.roundRect(-150, -190, 300, 54, [14, 14, 0, 0]); ink(RED);
    for (const dx of [-90, 90]) { ctx.beginPath(); ctx.roundRect(dx - 8, -212, 16, 40, 6); ink('#9aa1a6'); }
    marker(label, 0, -68, 64);
  });
}
function snowball(x, y, r, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ink('#f4f1e8', Math.max(4, r * 0.04));
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.clip();
  const rr = rng(9); for (let k = 0; k < 22; k++) { const a = rr() * 6.28, d = rr() * r * 0.85; coin(Math.cos(a) * d, Math.sin(a) * d, r * 0.13); }
  ctx.restore(); ctx.restore();
}
function door(x, y, open, icon) {
  ctx.beginPath(); ctx.rect(x - 80, y - 260, 160, 260); ink('#2c2c2c');
  ctx.fillStyle = 'rgba(255,214,102,' + (0.8 * open) + ')'; ctx.fillRect(x - 76, y - 256, 152, 252);
  if (icon && open > 0.3) { ctx.globalAlpha = open; icon(x, y - 120); ctx.globalAlpha = 1; }
  ctx.beginPath(); ctx.moveTo(x - 80, y - 260); ctx.lineTo(x - 80 + 160 * (1 - open * 0.75), y - 260 - 20 * open); ctx.lineTo(x - 80 + 160 * (1 - open * 0.75), y + 20 * open); ctx.lineTo(x - 80, y); ctx.closePath(); ink('#f6f4ee');
}
function piggy(x, y, s = 1, fill = 0) {
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.ellipse(0, -90, 120, 85, 0, 0, 7); ink('#f6b8c4');
    for (const dx of [-70, -30, 30, 70]) { ctx.beginPath(); ctx.roundRect(dx - 14, -30, 28, 30, 6); ink('#f6b8c4'); }
    ctx.beginPath(); ctx.ellipse(120, -95, 24, 30, 0, 0, 7); ink('#f6b8c4');
    ctx.beginPath(); ctx.moveTo(-40, -172); ctx.lineTo(30, -172); ink(null, 7);
    ctx.beginPath(); ctx.arc(70, -115, 7, 0, 7); ctx.fillStyle = C.ink; ctx.fill();
    if (fill > 0) { ctx.fillStyle = 'rgba(76,187,76,0.5)'; ctx.beginPath(); ctx.ellipse(0, -90, 100 * fill, 60 * fill, 0, 0, 7); ctx.fill(); }
  });
}
function card(x, y, rot = 0, cut = 0) {
  at(x, y, 1, rot, () => {
    ctx.save(); ctx.translate(-cut * 30, cut * 10); ctx.rotate(-cut * 0.2);
    ctx.beginPath(); ctx.roundRect(-150, -95, 150, 190, [16, 0, 0, 16]); ink('#4a7cff');
    ctx.restore();
    ctx.save(); ctx.translate(cut * 30, -cut * 10); ctx.rotate(cut * 0.2);
    ctx.beginPath(); ctx.roundRect(0, -95, 150, 190, [0, 16, 16, 0]); ink('#4a7cff');
    ctx.beginPath(); ctx.roundRect(40, -50, 60, 40, 6); ink(GOLD, 4);
    ctx.restore();
  });
}
function building(x, y, w, h, seed) {
  ctx.beginPath(); ctx.rect(x - w / 2, y - h, w, h); ink('#fff', 4);
  const r = rng(seed); for (let yy = y - h + 12; yy < y - 14; yy += 22) for (let xx = x - w / 2 + 10; xx < x + w / 2 - 14; xx += 20) if (r() < 0.8) { ctx.beginPath(); ctx.rect(xx, yy, 10, 12); ink('#d3d8da', 2); }
}
function scribbleMonster(x, y, s, t) {   // debt monster for the teaser
  at(x, y, s, 0, () => {
    ctx.beginPath(); ctx.moveTo(-160, 0);
    for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI, r = 200 + Math.sin(k * 3 + t * 6) * 18; ctx.lineTo(Math.cos(a) * r * 0.9, -220 + Math.sin(a) * r * 1.2); }
    ctx.lineTo(160, 0); ctx.closePath(); ink('#3a3a3a');
    for (const ex of [-60, 60]) { ctx.beginPath(); ctx.arc(ex, -300, 22, 0, 7); ctx.fillStyle = RED; ctx.fill(); }
    ctx.beginPath(); for (let k = 0; k < 7; k++) ctx.lineTo(-90 + k * 30, -200 + (k % 2 ? 26 : 0)); ink(null, 7);
  });
}
function newsTV(x, y, t) {
  ctx.beginPath(); ctx.roundRect(x - 120, y - 170, 240, 170, 12); ink('#3a3a3a');
  ctx.beginPath(); ctx.rect(x - 105, y - 155, 210, 120); ink(Math.sin(t * 10) > 0 ? '#ffd0cc' : '#fff', 3);
  ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 70, y - 135); ctx.lineTo(x + 50, y - 60); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 50, y - 60); ctx.lineTo(x + 10, y - 62); ctx.moveTo(x + 50, y - 60); ctx.lineTo(x + 44, y - 98); ctx.stroke();
}
