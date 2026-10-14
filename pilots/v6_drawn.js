// Pilot 6: fully hand-drawn (no AI). "Why you quit on day 47" — chibi Milo (milo() in style.js).
// Three scenes in one style: Day 1 morning, Day 19 night with the phone, Day 47 on the sofa; then title.

// Slow camera push towards (fx, fy).
const cam = (inner, z, fx, fy) => `<g transform="translate(${fx},${fy}) scale(${z}) translate(${-fx},${-fy})">${inner}</g>`;
const glow = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
// Soft light pool: radial gradient added on top (screen) — the main "lamp" look.
function pool(id, x, y, rx, ry, col, op) {
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${id})" style="mix-blend-mode:screen"/>`;
}
// Darkness everywhere except around (x,y).
function shade(id, x, y, r, op) {
  return `<defs><radialGradient id="${id}" cx="${x / W}" cy="${y / H}" r="${r}" gradientUnits="objectBoundingBox"><stop offset="0.25" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}
function dust(t, x0, y0, w, h, n, col, op = 0.55) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const sx = (i * 97.13) % 1, sy = (i * 57.71) % 1;
    const x = x0 + ((sx * w + t * (8 + (i % 5) * 4)) % w);
    const y = y0 + ((sy * h - t * (5 + (i % 3) * 3) + h * 4) % h);
    out += `<circle cx="${x}" cy="${y}" r="${1.2 + (i % 3) * 0.8}" fill="${col}" opacity="${op * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + i)))}"/>`;
  }
  return out;
}
function hud(x, y, label, value, col, t, blink) {
  const w = 380, fillW = Math.max(8, (w - 12) * value);
  const on = blink ? (Math.floor(t * 4) % 2 === 0 ? 1 : 0.35) : 1;
  return `<g transform="translate(${x},${y})" opacity="${on}">
    ${txt(0, -12, label, 22, P.cream, { anchor: 'start', weight: 800, ls: 2 })}
    <rect x="0" y="0" width="${w}" height="30" rx="15" fill="#000" fill-opacity="0.45" stroke="#fff" stroke-opacity="0.35" stroke-width="3"/>
    <rect x="6" y="6" width="${fillW}" height="18" rx="9" fill="${col}" filter="url(#glow)" opacity="0.8"/>
    <rect x="6" y="6" width="${fillW}" height="18" rx="9" fill="${col}"/>
    ${txt(w + 18, 27, Math.round(value * 100) + '%', 34, col, { anchor: 'start', weight: 900 })}</g>`;
}
function dayCounter(x, y, n, sc = 0.7) {
  return `<g transform="translate(${x},${y}) scale(${sc})">${txt(0, 0, 'DAY', 84, P.cream, { anchor: 'start' })}${txt(205, 0, String(n), 84, P.mustard, { anchor: 'start' })}
    <path d="M200 16 q60 -8 ${String(n).length * 52 + 10} 0" stroke="${P.mustard}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
}
const vignette = () => `<defs><radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.75"/></radialGradient>
  <linearGradient id="bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0.72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#vig)"/><rect width="${W}" height="${H}" fill="url(#bot)"/>`;
const ink = '#16161a';

// ---------- Scene 1: Day 1, sunrise, calendar with "1" circled, Milo jumps with a fist up ----------
function scene1(t) {
  const sun = ease(seg(t, 0, 2.5));
  let s = `<defs><linearGradient id="w1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2236"/><stop offset="1" stop-color="#2a2433"/></linearGradient>
    <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix('#1b2442', '#5b6fa8', sun)}"/><stop offset="0.7" stop-color="${mix('#3a2a40', '#f39a5a', sun)}"/><stop offset="1" stop-color="${mix('#4a3040', '#ffcf7a', sun)}"/></linearGradient>
    <linearGradient id="beam1" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity="${0.22 * sun}"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#w1)"/>
    <rect y="560" width="${W}" height="160" fill="#2a2026"/><path d="M0 560 H${W}" stroke="#3a2c30" stroke-width="6"/>`;
  // window with rising sun and city silhouette
  s += `<rect x="860" y="110" width="300" height="300" rx="8" fill="url(#sky1)"/>
    <circle cx="1010" cy="${lerp(430, 320, sun)}" r="46" fill="#ffe2a0"/>${glow(1010, lerp(430, 320, sun), 70, '#ffb347', 0.6 * sun)}
    <path d="M860 410 V350 h40 v-30 h36 v40 h30 v-60 h44 v50 h34 v-24 h40 v44 h36 v-20 h40 V410 Z" fill="${mix('#141826', '#3a2d3c', sun)}"/>
    <rect x="860" y="110" width="300" height="300" rx="8" fill="none" stroke="${ink}" stroke-width="14"/>
    <path d="M1010 110 V410 M860 260 H1160" stroke="${ink}" stroke-width="10"/>
    <rect x="845" y="404" width="330" height="18" rx="4" fill="#3b2f36"/>`;
  // light beam from window onto floor
  s += `<path d="M870 140 L1150 140 L760 700 L230 700 Z" fill="url(#beam1)" style="mix-blend-mode:screen"/>`;
  // calendar: 4x5 grid, day 1 gets a red marker circle drawn on
  s += `<g transform="translate(190,250) rotate(-2) scale(0.85)"><rect width="250" height="270" rx="8" fill="#e9e3d6" stroke="${ink}" stroke-width="6"/>
    <rect width="250" height="60" rx="8" fill="${P.red}" stroke="${ink}" stroke-width="6"/>${txt(125, 42, 'JANUARY', 28, '#fff', { weight: 900, ls: 2 })}
    <circle cx="70" cy="-4" r="8" fill="${ink}"/><circle cx="180" cy="-4" r="8" fill="${ink}"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const n = r * 5 + c + 1;
    s += txt(30 + c * 48, 105 + r * 50, String(n), 24, n === 1 ? ink : '#8a8478', { weight: n === 1 ? 900 : 600 });
  }
  const dash = 160 * (1 - ease(seg(t, 0.9, 1.5)));
  s += `<circle cx="30" cy="97" r="24" fill="none" stroke="${P.red}" stroke-width="6" stroke-linecap="round" stroke-dasharray="160" stroke-dashoffset="${dash}" transform="rotate(-80 30 97)"/></g>`;
  // Milo: anticipation squash, jump, fist up, landing squash
  const jp = seg(t, 1.5, 2.2);
  const hop = Math.sin(jp * Math.PI) * 90;
  const squash = t < 1.5 ? 0.12 * Math.sin(seg(t, 1.25, 1.5) * Math.PI) : jp >= 1 ? 0.12 * Math.sin(seg(t, 2.2, 2.45) * Math.PI) : -0.06 * Math.sin(jp * Math.PI);
  const fist = ease(seg(t, 1.45, 1.7));
  const happy = t > 1.4;
  const bob = Math.sin(t * 4) * 3;
  s += `<ellipse cx="560" cy="602" rx="${86 - hop * 0.3}" ry="12" fill="#000" opacity="${0.45 - hop * 0.002}"/>`;
  s += milo(560, 412 - hop + bob * (t < 1.2 ? 1 : 0) + squash * 120, 1, {
    level: 1, t, eyes: happy ? 'happy' : undefined, mouth: happy ? 'grin' : 'smile', look: lerp(-10, 0, seg(t, 1.1, 1.4)) * (t < 1.4 ? 1 : 0),
    armL: lerp(12, 40, fist), armR: lerp(12, 170, fist), squash, light: '#ffb070', lightMode: 'soft-light', lightOp: 0.5 * sun,
  });
  if (fist > 0.5) for (let i = 0; i < 6; i++) {  // little sparkles around the fist
    const a = i * 1.05 + t, r = 30 + 20 * seg(t, 1.6, 2.4);
    s += `<circle cx="${560 + 44 + Math.cos(a) * r}" cy="${412 - hop - 70 + Math.sin(a) * r}" r="4" fill="#ffe2a0" opacity="${1 - seg(t, 2.2, 2.8)}"/>`;
  }
  s += dust(t, 400, 200, 600, 450, 40, '#ffe2a8', 0.5 * sun);
  s += shade('sh1', 760, 360, 0.75, 0.55) + vignette();
  return s;
}

// ---------- Scene 2: Day 19, 2:47 AM, in bed, blue phone glow on the face ----------
function scene2(t) {
  const lt = t - 3.2;
  const flick = 0.75 + 0.15 * Math.sin(lt * 11) + 0.1 * (Math.floor(lt * 2.5) % 2);  // content changing
  let s = `<defs><linearGradient id="w2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1222"/><stop offset="1" stop-color="#151525"/></linearGradient>
    <linearGradient id="bl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d4a6e"/><stop offset="1" stop-color="#232a42"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#w2)"/>`;
  // window with moon
  s += `<rect x="900" y="90" width="230" height="230" rx="8" fill="#141a33"/><circle cx="1050" cy="160" r="30" fill="#dfe6ff" opacity="0.85"/><circle cx="1062" cy="152" r="26" fill="#141a33"/>
    ${[[940, 130], [985, 250], [1100, 270], [960, 200]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff" opacity="${0.5 + 0.5 * Math.sin(lt * 3 + i)}"/>`).join('')}
    <rect x="900" y="90" width="230" height="230" rx="8" fill="none" stroke="#07080f" stroke-width="12"/><path d="M1015 90 V320 M900 205 H1130" stroke="#07080f" stroke-width="8"/>`;
  // bed: headboard, mattress, pillow
  s += `<rect x="190" y="250" width="70" height="360" rx="20" fill="#2a2238" stroke="${ink}" stroke-width="6"/>
    <rect x="230" y="470" width="760" height="110" rx="24" fill="#2b2f45" stroke="${ink}" stroke-width="6"/>
    <rect x="980" y="430" width="40" height="190" rx="14" fill="#2a2238" stroke="${ink}" stroke-width="6"/>
    <path d="M260 400 q-10 -50 40 -60 q100 -10 170 10 q30 30 0 70 q-100 20 -180 10 q-35 0 -30 -30 Z" fill="#c9cde0" stroke="${ink}" stroke-width="6"/>`;
  // nightstand with alarm clock
  s += `<rect x="40" y="440" width="140" height="170" rx="10" fill="#241c2c" stroke="${ink}" stroke-width="6"/>
    <rect x="58" y="390" width="104" height="52" rx="10" fill="#0b0b10" stroke="${ink}" stroke-width="5"/>
    ${txt(110, 428, '2:47', 34, '#ff4b4b', { weight: 800, font: 'DejaVu Sans Mono' })}${glow(110, 416, 40, '#ff3b3b', 0.35)}`;
  // Milo lying: head on the pillow, body under the blanket, arms up holding the phone
  const breathe = Math.sin(lt * 2.2) * 4;
  const hx = 410, hy = 365;
  const phx = 545, phy = 250 + Math.sin(lt * 1.6) * 4;
  const thumb = Math.floor(lt * 2.5) % 2;  // scrolling flick
  s += milo(hx, hy, 0.95, { level: lerp(0.5, 0.3, seg(lt, 0, 2.6)), t: t * 0.6, lid: 0.45, bags: 0.8, mouth: 'flat', look: 14, rot: -14, pose: 'none', arms: false,
    light: '#4a8fe0', lightMode: 'multiply', lightOp: 0.35 });
  // blanket on top of the body
  s += `<path d="M430 520 q20 -140 140 -160 q220 -20 440 40 l10 200 h-610 Z" fill="url(#bl2)" stroke="${ink}" stroke-width="6" transform="translate(0,${breathe * 0.4})"/>
    <path d="M600 420 q80 30 140 10 M760 470 q90 25 180 0" stroke="#1a2036" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  // arms from the blanket edge to the phone
  const limb = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${ink}" stroke-width="24" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#d9e4f2" stroke-width="14" stroke-linecap="round"/>`;
  s += limb(560, 410, phx - 18, phy + 40) + limb(600, 400, phx + 28, phy + 44 - thumb * 6);
  s += `<g transform="translate(${phx},${phy}) rotate(-28)"><rect x="-34" y="-58" width="68" height="116" rx="12" fill="#1c1d24" stroke="${ink}" stroke-width="6"/><rect x="-30" y="-54" width="60" height="108" rx="9" fill="none" stroke="#8cc8ff" stroke-width="3" opacity="${0.8 * flick}"/><circle cx="0" cy="-40" r="5" fill="#333"/></g>`;
  // the glow: cone from phone to face
  s += `<path d="M${phx - 10} ${phy + 20} L${hx - 60} ${hy - 90} L${hx + 40} ${hy + 90} Z" fill="#6ab8ff" opacity="${0.18 * flick}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
  s += pool('p2', hx + 40, hy - 10, 260, 200, '#5aa8ff', 0.3 * flick);
  s += glow(phx - 20, phy + 10, 70, '#7cc4ff', 0.5 * flick);
  s += dust(t, 300, 200, 400, 300, 22, '#a8d4ff', 0.4);
  s += shade('sh2', hx + 60, hy - 20, 0.6, 0.7) + vignette();
  return s;
}

// ---------- Scene 3: Day 47, slumped on the sofa, TV flicker, the last leaf falls ----------
function scene3(t) {
  const lt = t - 6.2;
  const tv = 0.6 + 0.25 * Math.sin(lt * 13) * Math.sin(lt * 5.3) + 0.15 * (Math.floor(lt * 6) % 3 === 0 ? 1 : 0);
  let s = `<defs><linearGradient id="w3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101016"/><stop offset="1" stop-color="#18161c"/></linearGradient>
    <linearGradient id="sofa3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3644"/><stop offset="1" stop-color="#26232e"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#w3)"/><rect y="580" width="${W}" height="140" fill="#1c1719"/>`;
  // shelf with a dead potted plant (echoes his sprout) and a frame
  s += `<g transform="translate(780,0)"><rect x="120" y="170" width="260" height="14" rx="4" fill="#2b2530"/><rect x="160" y="110" width="70" height="60" rx="4" fill="#1d1a22" stroke="#2f2a36" stroke-width="5"/>
    <path d="M290 170 l-10 -45 h60 l-10 45 Z" fill="#4a3530"/><path d="M310 125 q-6 -30 -30 -36 M310 125 q10 -24 34 -20" stroke="#6e5a3c" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  // sofa — big compared to Milo
  s += `<rect x="330" y="290" width="560" height="200" rx="50" fill="url(#sofa3)" stroke="${ink}" stroke-width="6"/>
    <rect x="300" y="420" width="620" height="140" rx="36" fill="#302c39" stroke="${ink}" stroke-width="6"/>
    <rect x="280" y="360" width="100" height="210" rx="40" fill="#35313f" stroke="${ink}" stroke-width="6"/>
    <rect x="840" y="360" width="100" height="210" rx="40" fill="#35313f" stroke="${ink}" stroke-width="6"/>
    <path d="M610 300 V420" stroke="#221f29" stroke-width="5"/>
    <rect x="330" y="560" width="22" height="30" fill="#141216"/><rect x="868" y="560" width="22" height="30" fill="#141216"/>`;
  // Milo sinking into the cushion; slow slide down over the shot
  const slide = ease(seg(lt, 0, 2.2)) * 18;
  const mx = 560, my = 330 + slide;
  const breath = Math.sin(lt * 1.6) * 2;
  s += milo(mx, my + breath, 0.78, { level: 0, dead: true, t, lid: lerp(0.5, 0.7, seg(lt, 0, 2)), bags: 1, mouth: 'sad', rot: lerp(4, 10, seg(lt, 0, 2.2)), pose: 'sit',
    armL: 8, armR: 8, oneLeaf: lt > 0.6, light: '#7fa8d8', lightMode: 'screen', lightOp: 0.22 * tv });
  // the falling leaf
  if (lt > 0.6) {
    const fp = seg(lt, 0.6, 2.1);
    const lx = mx + 40 + Math.sin(fp * 9) * 30 + fp * 60, ly = my - 100 + ease(fp) * 330, rot = Math.sin(fp * 9) * 50 + fp * 200;
    s += `<g transform="translate(${lx},${ly}) rotate(${rot}) scale(0.78)"><path d="M0 0 Q12 -15 28 -3 Q14 9 0 0 Z" fill="#8a6a3e" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/></g>`;
  }
  // floor clutter: wrappers, pizza box, can
  s += `<path d="M120 640 l120 -20 l40 30 l-130 20 Z" fill="#7a5a3a" stroke="${ink}" stroke-width="5"/><path d="M150 640 l90 -14" stroke="#5a4028" stroke-width="4"/>
    <path d="M470 630 l30 -14 l24 12 l-10 18 l-30 4 Z" fill="#c8c2d4" stroke="${ink}" stroke-width="4"/>
    <path d="M700 646 l40 -10 l16 18 l-36 10 Z" fill="${P.red}" stroke="${ink}" stroke-width="4"/>
    <g transform="translate(1000,620) rotate(80)"><rect x="-14" y="-24" width="28" height="48" rx="6" fill="#9aa0aa" stroke="${ink}" stroke-width="4"/></g>`;
  // TV on the right, seen from the side: only its light
  s += `<rect x="1150" y="300" width="160" height="200" rx="10" fill="#0c0d12" stroke="${ink}" stroke-width="6"/>
    <rect x="1162" y="312" width="30" height="176" fill="#8fc0ff" opacity="${0.5 * tv}"/>`;
  s += `<path d="M1165 310 L460 180 L460 620 L1165 490 Z" fill="#7aa6e0" opacity="${0.12 * tv}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
  s += pool('p3', 760, 400, 560, 320, '#6f9ad8', 0.45 * tv);
  s += `<rect width="${W}" height="${H}" fill="#000" opacity="${0.08 * seg(lt, 0, 2.4)}"/>`;
  s += dust(t, 500, 220, 600, 300, 18, '#c8dcff', 0.35);
  s += shade('sh3', 650, 380, 0.75, 0.5) + vignette();
  return s;
}

function render(t) {
  let s = '';
  if (t < 3.2) {
    s += cam(scene1(t), lerp(1.0, 1.08, seg(t, 0, 3.2)), 560, 380);
    s += `<g transform="translate(60,110) scale(${back(seg(t, 0.3, 0.7))})">${dayCounter(0, 0, 1)}</g>`;
    s += `<g opacity="${seg(t, 0.6, 0.9)}">${hud(60, 175, 'ENERGY', lerp(0.4, 1, ease(seg(t, 0.6, 1.8))), P.green, t)}</g>`;
    s += caption(640, 670, typed('Day 1. He had a plan.', t, 0.8, 1.8), 36);
  } else if (t < 6.2) {
    const lt = t - 3.2;
    s += cam(scene2(t), lerp(1.04, 1.14, seg(lt, 0, 3)), 450, 330);
    s += dayCounter(60, 110, 19);
    const e = lerp(0.62, 0.32, ease(seg(lt, 0.2, 2.4)));
    s += hud(60, 175, 'ENERGY', e, chargeColor(e), t);
    s += caption(640, 670, typed('Day 19. Just one more video.', t, 3.5, 4.7), 36);
  } else if (t < 8.6) {
    const lt = t - 6.2;
    s += cam(scene3(t), lerp(1.0, 1.12, ease(seg(lt, 0, 2.4))), 580, 340);
    s += dayCounter(60, 110, 47);
    const e = lerp(0.32, 0.06, ease(seg(lt, 0.1, 1.2)));
    s += hud(60, 175, 'ENERGY', e, chargeColor(e), t, e < 0.15);
    s += caption(640, 670, typed('Day 47. The plan was gone.', t, 6.5, 7.5), 36);
  } else {
    const p1 = back(seg(t, 8.65, 9.0)), p2 = back(seg(t, 8.95, 9.3));
    s += `<rect width="${W}" height="${H}" fill="#0b0b0d"/>` + glow(640, 360, 260, '#ffb347', 0.08);
    s += dust(t, 200, 100, 880, 520, 40, '#ffe2a8');
    s += milo(640, 170, 0.45 * back(seg(t, 8.6, 8.9)), { level: 0, dead: true, t, lid: 0.6, mouth: 'sad', pose: 'none', arms: false, oneLeaf: true });
    s += `<g transform="translate(640,380) scale(${p1})">${txt(0, 0, 'WHY YOU QUIT', 96, P.cream)}</g>`;
    s += `<g transform="translate(640,500) scale(${p2})"><rect x="-210" y="-72" width="420" height="104" rx="12" fill="${P.mustard}"/>${txt(0, 12, 'ON DAY 47', 76, '#111')}</g>`;
  }
  const cut = [3.2, 6.2, 8.6].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.1)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(cut, 1 - seg(t, 0, 0.4), seg(t, 9.6, 10))), t, '#000');
}
