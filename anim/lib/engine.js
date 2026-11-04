// Doodle animation engine (runs in the browser page). Look: cream paper, dark marker lines (rough.js),
// soft flat colors. Everything is drawn in "world" coordinates (1920x1080 wide shot) through a camera.
const W = 1920, H = 1080;
const C = {
  paper: '#efebe2', paperFill: '#f2efe7', ink: '#2c2c2c', far: '#8d8c88', farFill: '#f0ece4',
  sun: '#f3d98e', cloud: 'rgba(236, 205, 120, 0.38)', glass: '#c3c9cc', glassDark: '#b4bbbf',
  grey: '#a5a5a2', greyInk: '#3a3a3a', green: '#a8c69c', greenInk: '#45553f', greenHi: 'rgba(255,255,255,0.45)',
  yellow: '#e2ae2c', white: '#ffffff', sheet: '#b9bec1', sheetLight: '#cfd3d5',
};
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => (t = clamp(t), t * t * (3 - 2 * t));
const easeOutBack = t => { t = clamp(t); const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
// deterministic random
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const rc = rough.canvas(cv);
const G = rc.generator;
let SEED = 1;
const R = (o = {}) => Object.assign({ roughness: 0.9, bowing: 0.7, stroke: C.ink, strokeWidth: 1.7, disableMultiStroke: true, seed: SEED++ }, o);

// ---------- world: list of items drawn every frame ----------
const WORLD = [];
const add = d => (WORLD.push(d), d);
const shape = (d) => add({ d });
const fn = (f) => add({ f });

// paper grain (screen space), built once
const grain = document.createElement('canvas');
grain.width = W; grain.height = H;
(() => {
  const g = grain.getContext('2d'), img = g.createImageData(W, H), r = rng(7);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + r() * 120;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  // soft blotches
  for (let k = 0; k < 90; k++) {
    g.fillStyle = `rgba(${r() < 0.5 ? 255 : 150},${r() < 0.5 ? 245 : 140},${r() < 0.5 ? 230 : 120},0.06)`;
    g.beginPath(); g.ellipse(r() * W, r() * H, 60 + r() * 220, 40 + r() * 160, r() * 3, 0, 7); g.fill();
  }
})();

// ---------- primitives ----------
function bumpyPath(cx, cy, rx, ry, n, amp, seed, from = 0, to = Math.PI * 2) {
  const r = rng(seed); let d = '';
  for (let i = 0; i <= n; i++) {
    const a = lerp(from, to, i / n);
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (i === 0) { d += `M${x} ${y}`; continue; }
    const am = lerp(from, to, (i - 0.5) / n), k = 1 + amp * (0.7 + r() * 0.6);
    d += ` Q${cx + Math.cos(am) * rx * k} ${cy + Math.sin(am) * ry * k} ${x} ${y}`;
  }
  return d;
}

function house(x, base, w, h, o = {}) {
  const far = o.far, ink = far ? C.far : C.ink, sw = far ? 1.3 : 1.8, fill = far ? C.farFill : C.paperFill;
  const rh = o.roofH ?? h * 0.55, top = base - h, ov = o.overhang ?? 10;
  const S = (d) => shape(d);
  // chimney behind roof
  if (o.chimney) {
    const cx = x + w * (o.chimneyAt ?? 0.72);
    S(G.rectangle(cx, top - rh * 0.75, 22, rh * 0.75, R({ stroke: ink, strokeWidth: sw, fill, fillStyle: 'solid' })));
    S(G.rectangle(cx - 4, top - rh * 0.75 - 8, 30, 10, R({ stroke: ink, strokeWidth: sw, fill, fillStyle: 'solid' })));
  }
  S(G.rectangle(x, top, w, h, R({ stroke: ink, strokeWidth: sw, fill, fillStyle: 'solid' })));
  S(G.polygon([[x - ov, top + 4], [x + w / 2, top - rh], [x + w + ov, top + 4]], R({ stroke: ink, strokeWidth: sw, fill, fillStyle: 'solid' })));
  S(G.line(x - ov + 6, top + 12, x + w / 2, top - rh + 10, R({ stroke: ink, strokeWidth: sw * 0.8 })));
  S(G.line(x + w / 2, top - rh + 10, x + w + ov - 6, top + 12, R({ stroke: ink, strokeWidth: sw * 0.8 })));
  if (o.shingles) {
    for (let k = 1; k < 5; k++) {
      const yy = top - rh + rh * k / 5, half = (w / 2 + ov) * k / 5;
      S(G.line(x + w / 2 - half + 4, yy, x + w / 2 + half - 4, yy, R({ stroke: ink, strokeWidth: 1.1, roughness: 1.2 })));
      for (let j = -k; j <= k; j += 1) S(G.line(x + w / 2 + j * half / (k + 0.5), yy, x + w / 2 + j * half / (k + 0.5) + 3, yy + rh / 5, R({ stroke: ink, strokeWidth: 1 })));
    }
  }
  if (o.roundWin) {
    const cx = x + w / 2, cy = top - rh * 0.4;
    S(G.circle(cx, cy, rh * 0.32, R({ stroke: ink, strokeWidth: sw })));
    S(G.line(cx - rh * 0.16, cy, cx + rh * 0.16, cy, R({ stroke: ink, strokeWidth: 1.1 })));
    S(G.line(cx, cy - rh * 0.16, cx, cy + rh * 0.16, R({ stroke: ink, strokeWidth: 1.1 })));
  }
  for (const [wx, wy, ww, wh] of o.windows || []) {
    const X = x + wx * w, Y = top + wy * h, WW = ww * w, WH = wh * h;
    S(G.rectangle(X, Y, WW, WH, R({ stroke: ink, strokeWidth: sw, fill: far ? fill : '#f6f4ee', fillStyle: 'solid' })));
    S(G.line(X + WW / 2, Y, X + WW / 2, Y + WH, R({ stroke: ink, strokeWidth: 1.1 })));
    S(G.line(X, Y + WH / 2, X + WW, Y + WH / 2, R({ stroke: ink, strokeWidth: 1.1 })));
    S(G.line(X - 4, Y + WH + 3, X + WW + 4, Y + WH + 3, R({ stroke: ink, strokeWidth: sw })));
  }
  if (o.door) {
    const [dx, dw] = o.door, X = x + dx * w, DW = dw * w, DH = h * 0.62;
    S(G.rectangle(X, base - DH, DW, DH, R({ stroke: ink, strokeWidth: sw, fill: '#f6f4ee', fillStyle: 'solid' })));
    S(G.circle(X + DW * 0.8, base - DH * 0.48, 4, R({ stroke: ink, strokeWidth: 1.2 })));
    if (o.doorWin) S(G.rectangle(X + DW * 0.2, base - DH * 0.88, DW * 0.6, DH * 0.25, R({ stroke: ink, strokeWidth: 1.2 })));
  }
  if (o.porch) {
    const [px, pw] = o.porch, X = x + px * w, PW = pw * w, PY = top + h * 0.28;
    S(G.polygon([[X - 8, PY], [X + PW / 2, PY - 26], [X + PW + 8, PY]], R({ stroke: ink, strokeWidth: sw, fill, fillStyle: 'solid' })));
    S(G.line(X, PY, X, base, R({ stroke: ink, strokeWidth: sw })));
    S(G.line(X + PW, PY, X + PW, base, R({ stroke: ink, strokeWidth: sw })));
  }
  if (o.bricks !== false && !far) {
    const r = rng(x * 3 + 11);
    const avoid = (o.avoid || []).concat((o.windows || []).map(([wx, wy, ww, wh]) => [x + wx * w, top + wy * h, ww * w, wh * h]));
    if (o.door) avoid.push([x + o.door[0] * w, base - h * 0.62, o.door[1] * w, h * 0.62]);
    if (o.porch) avoid.push([x + o.porch[0] * w - 10, top, o.porch[1] * w + 20, h]);
    const hit = (bx, by) => avoid.some(([ax, ay, aw, ah]) => bx + 36 > ax - 6 && bx < ax + aw + 6 && by + 20 > ay - 6 && by < ay + ah + 6);
    for (let k = 0, tries = 0; k < 5 && tries < 60; tries++) {
      const side = r() < 0.5, bx = side ? x + 6 + r() * w * 0.18 : x + w * 0.78 + r() * (w * 0.22 - 36), by = top + 8 + r() * (h - 36);
      if (hit(bx, by)) continue; k++;
      S(G.rectangle(bx, by, 22, 9, R({ stroke: ink, strokeWidth: 1, roughness: 0.6 })));
      if (r() < 0.6) S(G.rectangle(bx + 11, by + 9, 22, 9, R({ stroke: ink, strokeWidth: 1, roughness: 0.6 })));
    }
  }
}

function tree(x, base, s, far) {
  const ink = far ? C.far : C.ink, sw = far ? 1.2 : 1.6, fill = far ? C.farFill : C.paperFill;
  shape(G.line(x - 5 * s, base, x - 4 * s, base - 70 * s, R({ stroke: ink, strokeWidth: sw })));
  shape(G.line(x + 5 * s, base, x + 4 * s, base - 70 * s, R({ stroke: ink, strokeWidth: sw })));
  shape(G.path(bumpyPath(x, base - 110 * s, 55 * s, 52 * s, 11, 0.14, x | 0), R({ stroke: ink, strokeWidth: sw, fill, fillStyle: 'solid' })));
  shape(G.path(bumpyPath(x - 14 * s, base - 102 * s, 22 * s, 18 * s, 5, 0.2, (x | 0) + 1, 3.6, 6.0), R({ stroke: ink, strokeWidth: 1 })));
}

function bush(x, base, w, far) {
  const ink = far ? C.far : C.ink;
  shape(G.path(bumpyPath(x + w / 2, base, w / 2, w * 0.36, 9, 0.22, x | 0, Math.PI, Math.PI * 2) + ` Z`, R({ stroke: ink, strokeWidth: 1.5, fill: C.paperFill, fillStyle: 'solid' })));
  const r = rng(x | 0);
  for (let k = 0; k < 4; k++) shape(G.arc(x + w * (0.2 + r() * 0.6), base - w * (0.08 + r() * 0.16), 10, 8, 3.4, 5.8, false, R({ stroke: ink, strokeWidth: 1 })));
}

function fence(x1, x2, base, h, far) {
  const ink = far ? C.far : C.ink, step = 26;
  shape(G.line(x1, base - h * 0.35, x2, base - h * 0.35, R({ stroke: ink, strokeWidth: 1.2 })));
  shape(G.line(x1, base - h * 0.75, x2, base - h * 0.75, R({ stroke: ink, strokeWidth: 1.2 })));
  for (let x = x1; x < x2 - 10; x += step) {
    shape(G.polygon([[x, base], [x, base - h + 8], [x + 10, base - h], [x + 20, base - h + 8], [x + 20, base]], R({ stroke: ink, strokeWidth: 1.3, fill: C.paperFill, fillStyle: 'solid' })));
  }
}

function tuft(x, y, s = 1) {
  shape(G.curve([[x - 8 * s, y], [x - 6 * s, y - 10 * s], [x - 9 * s, y - 16 * s]], R({ strokeWidth: 1.2 })));
  shape(G.curve([[x, y], [x + 1 * s, y - 12 * s], [x - 1 * s, y - 20 * s]], R({ strokeWidth: 1.2 })));
  shape(G.curve([[x + 7 * s, y], [x + 7 * s, y - 9 * s], [x + 11 * s, y - 15 * s]], R({ strokeWidth: 1.2 })));
}

// ---------- animated pieces ----------
// speech bubble: kind 'grey' | 'green'; scribble 'loops' | 'tangle'; tail -1 (left) / 1 (right)
const bubbleCache = {};
function bubbleDrawables(id, w, h, kind, tail, scribble) {
  const key = `${id}-${kind}`;
  if (bubbleCache[key]) return bubbleCache[key];
  const isG = kind === 'green', ink = isG ? C.greenInk : C.greyInk, fill = isG ? C.green : C.grey;
  const tx = tail * w * 0.22;
  const body = `M${-w / 2} 0 C${-w / 2} ${-h * 0.62} ${w / 2} ${-h * 0.62} ${w / 2} 0 C${w / 2} ${h * 0.45} ${tx + tail * 6} ${h * 0.5} ${tx + tail * 4} ${h * 0.46}` +
    ` L${tx + tail * 10} ${h * 0.8} L${tx - tail * 12} ${h * 0.44} C${-w / 2} ${h * 0.5} ${-w / 2} ${h * 0.4} ${-w / 2} 0 Z`;
  const out = [G.path(body, R({ seed: id * 7 + 1, stroke: ink, strokeWidth: 2.2, roughness: 0.6, fill, fillStyle: 'solid' }))];
  if (!isG) {
    const r = rng(id * 13 + 5); let d = '';
    if (scribble === 'loops') {
      let x = -w * 0.32; d = `M${x} ${h * 0.05}`;
      while (x < w * 0.3) { const nx = x + w * 0.07; d += ` C${x + w * 0.09} ${-h * 0.32} ${x - w * 0.03} ${-h * 0.3} ${nx} ${h * 0.08 + (r() - 0.5) * 4}`; x = nx; }
    } else {
      d = ptsToPath(scribblePoints(0, -h * 0.04, w * 0.26, h * 0.27, 4, id * 17 + 3));
    }
    out.push(G.path(d, R({ seed: id * 7 + 2, stroke: '#2a2a2a', strokeWidth: 2, roughness: 0.4 })));
    // light hatching for texture
    for (let k = 0; k < 4; k++) out.push(G.line(-w * 0.35 + k * w * 0.2, h * 0.25, -w * 0.2 + k * w * 0.2, -h * 0.3, R({ seed: id * 7 + 10 + k, stroke: 'rgba(255,255,255,0.18)', strokeWidth: 3, roughness: 0.3 })));
  }
  return (bubbleCache[key] = out);
}
function drawBubble(b, x, y, s, kind) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const d of bubbleDrawables(b.id, b.w, b.h, kind, b.tail, b.scribble)) rc.draw(d);
  if (kind === 'green') {
    ctx.fillStyle = C.greenHi; ctx.beginPath();
    ctx.ellipse(-b.w * 0.2, -b.h * 0.2, b.w * 0.16, b.h * 0.08, -0.5, 0, 7); ctx.fill();
  }
  ctx.restore();
}

// partial stroke along a polyline (for "drawn on" lines)
function strokePartial(pts, p, color, width) {
  if (p <= 0) return;
  let total = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; }
  let left = total * clamp(p);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  for (let i = 1; i < pts.length && left > 0; i++) {
    const f = Math.min(1, left / seg[i - 1]);
    ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f));
    left -= seg[i - 1];
  }
  ctx.stroke();
}
// loopy tangle: small circles whose centers wander around an ellipse (looks like a marker scribble)
function scribblePoints(cx, cy, rx, ry, turns, seed) {
  const r = rng(seed), pts = [], p1 = r() * 6, p2 = r() * 6, f1 = 0.11 + r() * 0.04, f2 = 0.15 + r() * 0.04;
  const n = Math.round(turns * 40);
  for (let i = 0; i <= n; i++) {
    const a = i / 40 * Math.PI * 2 * 1.6;
    pts.push([cx + Math.cos(a * f1 * 6 + p1) * rx * 0.58 + Math.cos(a) * rx * 0.42,
              cy + Math.sin(a * f2 * 6 + p2) * ry * 0.58 + Math.sin(a) * ry * 0.42]);
  }
  return pts;
}
const ptsToPath = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');

// ---------- camera + frame ----------
function beginFrame() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
}
function setCamera(cx, cy, z) { ctx.setTransform(z, 0, 0, z, W / 2 - cx * z, H / 2 - cy * z); }
function drawWorld(t) { for (const it of WORLD) it.d ? rc.draw(it.d) : it.f(t); }
function endFrame() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.07; ctx.drawImage(grain, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}
