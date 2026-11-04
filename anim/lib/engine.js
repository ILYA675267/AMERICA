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
// Line thickness multipliers (1 = original thin version). LINE for the sketchy world, HERO_LINE for the hero + window.
const LINE = 1.2, HERO_LINE = 1.1;
const R = (o = {}) => { const r = Object.assign({ roughness: 0.9, bowing: 0.7, stroke: C.ink, strokeWidth: 1.7, disableMultiStroke: true, seed: SEED++ }, o); r.strokeWidth *= LINE; return r; };

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

// ---------- detailed scenery (line hierarchy: outlines thick, details thin; soft grey wash for shade) ----------
const SHADE = 'rgba(70,70,75,0.10)', SHADE2 = 'rgba(70,70,75,0.18)';
const OUT = 2.1, DET = 1.05;   // outline / detail stroke widths (multiplied by LINE)
function wash(points, color = SHADE) { fn(() => { ctx.fillStyle = color; ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); }); }
function washEllipse(cx, cy, rx, ry, color = SHADE) { fn(() => { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.fill(); }); }

function windowDetailed(X, Y, WW, WH, o = {}) {
  const far = o.far, ink = far ? C.far : C.ink, r = rng((X * 7 + Y) | 0);
  shape(G.rectangle(X - 4, Y - 4, WW + 8, WH + 8, R({ stroke: ink, strokeWidth: OUT * (far ? 0.7 : 1), fill: C.paperFill, fillStyle: 'solid' })));
  shape(G.rectangle(X, Y, WW, WH, R({ stroke: ink, strokeWidth: DET, fill: far ? '#e2e3e1' : '#d3d8da', fillStyle: 'solid', roughness: 0.5 })));
  if (!far) {
    // reflections
    fn(() => { ctx.save(); ctx.beginPath(); ctx.rect(X, Y, WW, WH); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.45)';
      for (const f of [0.25, 0.55]) { ctx.beginPath(); ctx.moveTo(X + WW * f + WH * 0.6, Y); ctx.lineTo(X + WW * f + WH * 0.6 + 7, Y); ctx.lineTo(X + WW * f + 7, Y + WH); ctx.lineTo(X + WW * f, Y + WH); ctx.fill(); }
      ctx.restore(); });
    // curtains (some windows)
    if (r() < 0.6) for (const side of [-1, 1]) {
      const ex = side < 0 ? X : X + WW, cw = WW * 0.22 * -side;
      shape(G.path(`M${ex} ${Y} L${ex - cw} ${Y} Q${ex - cw * 0.35} ${Y + WH * 0.5} ${ex - cw * 0.5} ${Y + WH} L${ex} ${Y + WH} Z`,
        R({ stroke: ink, strokeWidth: DET * 0.9, fill: '#e9e9e6', fillStyle: 'solid', roughness: 0.5 })));
    }
  }
  if (o.panes !== false) {
    shape(G.line(X + WW / 2, Y, X + WW / 2, Y + WH, R({ stroke: ink, strokeWidth: DET * 1.4, roughness: 0.4 })));
    shape(G.line(X, Y + WH / 2, X + WW, Y + WH / 2, R({ stroke: ink, strokeWidth: DET * 1.4, roughness: 0.4 })));
  }
  // sill with shadow
  shape(G.rectangle(X - 8, Y + WH + 4, WW + 16, 6, R({ stroke: ink, strokeWidth: DET, fill: C.paperFill, fillStyle: 'solid', roughness: 0.4 })));
  if (!far) wash([[X - 6, Y + WH + 10], [X + WW + 6, Y + WH + 10], [X + WW, Y + WH + 18], [X, Y + WH + 18]]);
}

function house(x, base, w, h, o = {}) {
  const far = o.far, ink = far ? C.far : C.ink, k = far ? 0.7 : 1, fill = far ? C.farFill : C.paperFill;
  const rh = o.roofH ?? h * 0.55, top = base - h, ov = o.overhang ?? 12, r = rng((x * 13) | 0);
  const S = d => shape(d);
  if (!far) washEllipse(x + w / 2, base + 2, w * 0.55, 7, SHADE);
  if (o.chimney) {
    const cx = x + w * (o.chimneyAt ?? 0.72), cy = top - rh * 0.78;
    S(G.rectangle(cx, cy, 24, rh * 0.78, R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
    S(G.rectangle(cx - 5, cy - 9, 34, 11, R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
    if (!far) for (let j = 1; j < 4; j++) S(G.line(cx + 2, cy + j * 11, cx + 22, cy + j * 11, R({ stroke: ink, strokeWidth: DET * 0.8 })));
  }
  // wall
  S(G.rectangle(x, top, w, h, R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
  if (!far) {
    if (o.siding) for (let yy = top + 12; yy < base - 4; yy += 11) S(G.line(x + 3, yy, x + w - 3, yy, R({ stroke: 'rgba(44,44,44,0.35)', strokeWidth: DET * 0.8, roughness: 0.5 })));
    S(G.line(x, base - 10, x + w, base - 10, R({ stroke: ink, strokeWidth: DET })));            // foundation
    wash([[x + 2, top + 2], [x + w - 2, top + 2], [x + w - 2, top + 16], [x + 2, top + 16]]);  // eave shadow
    wash([[x + w * 0.82, top + 16], [x + w - 2, top + 16], [x + w - 2, base - 2], [x + w * 0.82, base - 2]], 'rgba(70,70,75,0.06)');
  }
  // roof: main shape + fascia line + shingle rows
  const roofPts = [[x - ov, top + 4], [x + w / 2, top - rh], [x + w + ov, top + 4]];
  S(G.polygon(roofPts, R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
  S(G.line(x - ov + 9, top + 4, x + w / 2, top - rh + 12, R({ stroke: ink, strokeWidth: DET * k })));
  S(G.line(x + w / 2, top - rh + 12, x + w + ov - 9, top + 4, R({ stroke: ink, strokeWidth: DET * k })));
  if (o.shingles && !far) {
    for (let j = 1; j < 6; j++) {
      const yy = top - rh + rh * j / 6, half = (w / 2 + ov) * j / 6;
      S(G.line(x + w / 2 - half + 6, yy, x + w / 2 + half - 6, yy, R({ stroke: ink, strokeWidth: DET * 0.9 })));
      for (let i = -j; i <= j; i++) { const sx = x + w / 2 + i * half / (j + 0.5) + (j % 2) * 6; S(G.line(sx, yy, sx + 2, yy + rh / 6, R({ stroke: ink, strokeWidth: DET * 0.8 }))); }
    }
  } else if (!far) {
    for (let j = 0; j < 3; j++) { const f = 0.25 + r() * 0.6, yy = top - rh * f * 0.9 + 6, half = (w / 2 + ov) * (1 - f) * 0.7; const cx = x + w / 2 + (r() - 0.5) * half;
      S(G.line(cx - 14, yy, cx + 14, yy, R({ stroke: 'rgba(44,44,44,0.5)', strokeWidth: DET * 0.8 }))); }
  }
  if (o.roundWin) {
    const cx = x + w / 2, cy = top - rh * 0.42, rr = rh * 0.34;
    S(G.circle(cx, cy, rr, R({ stroke: ink, strokeWidth: OUT * k, fill: far ? fill : '#d3d8da', fillStyle: 'solid' })));
    S(G.line(cx - rr / 2, cy, cx + rr / 2, cy, R({ stroke: ink, strokeWidth: DET })));
    S(G.line(cx, cy - rr / 2, cx, cy + rr / 2, R({ stroke: ink, strokeWidth: DET })));
  }
  for (const [wx, wy, ww, wh] of o.windows || []) windowDetailed(x + wx * w, top + wy * h, ww * w, wh * h, { far });
  if (o.door) {
    const [dx, dw] = o.door, X = x + dx * w, DW = dw * w, DH = h * 0.62, Y = base - DH;
    S(G.rectangle(X - 4, Y - 4, DW + 8, DH + 4, R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
    S(G.rectangle(X, Y, DW, DH, R({ stroke: ink, strokeWidth: DET, fill: '#f6f4ee', fillStyle: 'solid' })));
    if (!far) {
      if (o.doorWin) S(G.rectangle(X + DW * 0.2, Y + DH * 0.1, DW * 0.6, DH * 0.24, R({ stroke: ink, strokeWidth: DET, fill: '#d3d8da', fillStyle: 'solid' })));
      else S(G.rectangle(X + DW * 0.2, Y + DH * 0.1, DW * 0.6, DH * 0.3, R({ stroke: ink, strokeWidth: DET * 0.8 })));
      S(G.rectangle(X + DW * 0.2, Y + DH * 0.52, DW * 0.6, DH * 0.36, R({ stroke: ink, strokeWidth: DET * 0.8 })));
      S(G.circle(X + DW * 0.82, Y + DH * 0.48, 5, R({ stroke: ink, strokeWidth: DET, fill: ink, fillStyle: 'solid' })));
      S(G.rectangle(X - 10, base - 4, DW + 20, 8, R({ stroke: ink, strokeWidth: DET, fill, fillStyle: 'solid' })));   // step
      S(G.line(X - 4, base + 10, X - 18, base + 34, R({ stroke: ink, strokeWidth: DET })));                              // path to sidewalk
      S(G.line(X + DW + 4, base + 10, X + DW + 18, base + 34, R({ stroke: ink, strokeWidth: DET })));
      wash([[X, Y], [X + DW, Y], [X + DW, Y + 10], [X, Y + 10]], SHADE2);
    }
  }
  if (o.porch) {
    const [px, pw] = o.porch, X = x + px * w, PW = pw * w, PY = top + h * 0.26;
    S(G.polygon([[X - 10, PY], [X + PW / 2, PY - 28], [X + PW + 10, PY]], R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
    for (const px2 of [X, X + PW]) S(G.rectangle(px2 - 3, PY, 6, base - PY, R({ stroke: ink, strokeWidth: DET, fill, fillStyle: 'solid' })));
    if (!far) wash([[X - 8, PY], [X + PW + 8, PY], [X + PW + 8, PY + 12], [X - 8, PY + 12]], SHADE2);
  }
  if (o.bricks !== false && !far) {
    const avoid = (o.avoid || []).concat((o.windows || []).map(([wx, wy, ww, wh]) => [x + wx * w, top + wy * h, ww * w, wh * h]));
    if (o.door) avoid.push([x + o.door[0] * w, base - h * 0.62, o.door[1] * w, h * 0.62]);
    if (o.porch) avoid.push([x + o.porch[0] * w - 10, top, o.porch[1] * w + 20, h]);
    const placed = [];
    const hit = (bx, by) => avoid.concat(placed).some(([ax, ay, aw, ah]) => bx + 34 > ax - 8 && bx < ax + aw + 8 && by + 22 > ay - 8 && by < ay + ah + 8);
    for (let n = 0, tries = 0; n < 3 && tries < 60; tries++) {
      const side = r() < 0.5, bx = side ? x + 6 + r() * w * 0.16 : x + w * 0.8 + r() * (w * 0.2 - 44), by = top + 18 + r() * (h - 50);
      if (hit(bx, by)) continue; n++; placed.push([bx, by, 34, 22]);
      S(G.rectangle(bx, by, 22, 10, R({ stroke: ink, strokeWidth: DET * 0.8, roughness: 0.5 })));
      S(G.rectangle(bx + 11, by + 10, 22, 10, R({ stroke: ink, strokeWidth: DET * 0.8, roughness: 0.5 })));
    }
  }
}

function tree(x, base, s, far) {
  const ink = far ? C.far : C.ink, fill = far ? C.farFill : C.paperFill, r = rng((x * 5) | 0), k = far ? 0.7 : 1;
  if (!far) washEllipse(x + 10 * s, base + 2, 48 * s, 6, SHADE);
  shape(G.path(`M${x - 7 * s} ${base} Q${x - 4 * s} ${base - 40 * s} ${x - 6 * s} ${base - 80 * s} L${x + 6 * s} ${base - 80 * s} Q${x + 5 * s} ${base - 40 * s} ${x + 8 * s} ${base} Z`, R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
  if (!far) for (let j = 0; j < 3; j++) shape(G.line(x - 2 * s, base - (15 + j * 20) * s, x + 1 * s, base - (25 + j * 20) * s, R({ stroke: ink, strokeWidth: DET * 0.7 })));
  shape(G.path(bumpyPath(x, base - 118 * s, 62 * s, 56 * s, 13, 0.13, x | 0), R({ stroke: ink, strokeWidth: OUT * k, fill, fillStyle: 'solid' })));
  if (!far) {
    // soft crescent shade on the lower-right of the crown
    fn(() => { ctx.save(); ctx.beginPath(); ctx.ellipse(x, base - 118 * s, 58 * s, 52 * s, 0, 0, 7); ctx.clip();
      ctx.fillStyle = SHADE; ctx.beginPath(); ctx.ellipse(x, base - 118 * s, 58 * s, 52 * s, 0, 0, 7); ctx.ellipse(x - 14 * s, base - 128 * s, 56 * s, 50 * s, 0, 0, 7); ctx.fill('evenodd'); ctx.restore(); });
    for (let j = 0; j < 7; j++) { const a = r() * 6.28, d = r() * 0.6; const cx = x + Math.cos(a) * 40 * s * d, cy = base - 118 * s + Math.sin(a) * 36 * s * d;
      shape(G.arc(cx, cy, 20 * s, 15 * s, 3.3, 6.0, false, R({ stroke: ink, strokeWidth: DET * 0.8 }))); }
  }
}

function bush(x, base, w, far) {
  const ink = far ? C.far : C.ink, r = rng((x * 3) | 0);
  if (!far) washEllipse(x + w / 2, base + 1, w * 0.55, 5, SHADE2);
  shape(G.path(bumpyPath(x + w / 2, base, w / 2, w * 0.38, 10, 0.22, x | 0, Math.PI, Math.PI * 2) + ' Z', R({ stroke: ink, strokeWidth: OUT, fill: C.paperFill, fillStyle: 'solid' })));
  for (let k = 0; k < 7; k++) shape(G.arc(x + w * (0.15 + r() * 0.7), base - w * (0.06 + r() * 0.2), 9, 7, 3.4, 5.9, false, R({ stroke: ink, strokeWidth: DET * 0.8 })));
  wash([[x + w * 0.1, base - 2], [x + w * 0.9, base - 2], [x + w * 0.8, base - w * 0.12], [x + w * 0.2, base - w * 0.12]], 'rgba(70,70,75,0.07)');
}

function fence(x1, x2, base, h, far) {
  const ink = far ? C.far : C.ink, step = 26, k = far ? 0.7 : 1;
  if (!far) wash([[x1, base - 2], [x2, base - 2], [x2 + 8, base + 6], [x1 + 8, base + 6]], SHADE);
  for (const f of [0.32, 0.72]) shape(G.rectangle(x1, base - h * f - 4, x2 - x1, 8, R({ stroke: ink, strokeWidth: DET * k, fill: C.paperFill, fillStyle: 'solid' })));
  for (let x = x1; x < x2 - 10; x += step) {
    shape(G.polygon([[x, base], [x, base - h + 8], [x + 10, base - h], [x + 20, base - h + 8], [x + 20, base]], R({ stroke: ink, strokeWidth: OUT * 0.8 * k, fill: C.paperFill, fillStyle: 'solid' })));
    if (!far) { shape(G.line(x + 7, base - h * 0.85, x + 8, base - h * 0.55, R({ stroke: ink, strokeWidth: DET * 0.6 })));
      wash([[x + 15, base - h + 6], [x + 20, base - h + 8], [x + 20, base], [x + 15, base]], 'rgba(70,70,75,0.08)'); }
  }
}

function tuft(x, y, s = 1) {
  for (const [dx, h, lean] of [[-9, 14, -5], [-3, 20, -1], [3, 17, 3], [9, 12, 6]])
    shape(G.curve([[x + dx * s, y], [x + (dx + lean * 0.3) * s, y - h * 0.5 * s], [x + (dx + lean) * s, y - h * s]], R({ strokeWidth: DET })));
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
