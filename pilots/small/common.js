// Shared pieces for "The Small Things She'll Remember Forever" (all on-screen text in English).
const INK = '#16161a';
const glw = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
// Tiny idle float for objects (1–3 px), phased by id.
const fl = (t, id, amp = 2.5) => `translate(${Math.sin(t * 1.1 + id * 1.7) * amp * 0.4},${Math.sin(t * 1.6 + id * 2.3) * amp})`;
const cam = (inner, z, fx, fy) => `<g transform="translate(${fx},${fy}) scale(${z}) translate(${-fx},${-fy})">${inner}</g>`;
const vign = (op = 0.7) => `<defs><radialGradient id="vgS" cx="50%" cy="50%" r="72%"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#vgS)"/>`;

// Subtitle at the bottom (soft fade, tiny float).
function sub(s, t, a, b, y = 664, size = 34, col = P.cream) {
  const op = Math.min(seg(t, a, a + 0.5), 1 - seg(t, b - 0.5, b));
  if (op <= 0) return '';
  return `<g opacity="${op}" transform="translate(0,${(1 - ease(seg(t, a, a + 0.5))) * 8 + Math.sin(t * 1.4) * 1.2})">
    ${txt(642, y + 2, s, size, '#000', { weight: 700, op: 0.5 })}${txt(640, y, s, size, col, { weight: 700 })}</g>`;
}
// Big centred statement.
function big(s, t, a, b, y, size = 58, col = P.cream) {
  const op = Math.min(seg(t, a, a + 0.6), 1 - seg(t, b - 0.6, b));
  if (op <= 0) return '';
  return `<g opacity="${op}" transform="translate(640,${y + Math.sin(t * 1.3) * 1.5}) scale(${lerp(0.96, 1, ease(seg(t, a, a + 0.8)))})">${txt(0, 0, s, size, col)}</g>`;
}
function stars(t, n = 40, h = 330) {
  let o = '';
  for (let i = 0; i < n; i++) o += `<circle cx="${(i * 211.7) % W}" cy="${(i * 97.3) % h}" r="${1 + (i % 3) * 0.5}" fill="#dfe6ff" opacity="${0.15 + 0.35 * Math.abs(Math.sin(t * 1.2 + i))}"/>`;
  return o;
}
function motes(t, n, col, op, x0 = 150, y0 = 120, w = 980, h = 460) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const sx = (i * 97.13) % 1, sy = (i * 57.71) % 1;
    o += `<circle cx="${x0 + ((sx * w + t * (6 + (i % 5) * 3)) % w)}" cy="${y0 + ((sy * h - t * (4 + (i % 3) * 2) + h * 40) % h)}" r="${1.2 + (i % 3) * 0.7}" fill="${col}" opacity="${op * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i)))}"/>`;
  }
  return o;
}
// A firefly: warm dot with a soft halo and flicker.
function firefly(x, y, t, id = 0, sc = 1) {
  const f = 0.7 + 0.3 * Math.sin(t * 6 + id * 1.9);
  return `<g transform="translate(${x},${y}) scale(${sc})">${glw(0, 0, 22, '#ffd27a', 0.55 * f)}<circle r="5" fill="#fff3c4"/><circle r="9" fill="#ffd27a" opacity="${0.35 * f}"/></g>`;
}
// Small glass jar HUD (top right) that fills with collected fireflies.
function jarHud(t, count, op = 1) {
  if (op <= 0) return '';
  let s = `<g transform="translate(1186,92)" opacity="${op}"><rect x="-34" y="-46" width="68" height="92" rx="16" fill="#ffffff" fill-opacity="0.06" stroke="#cfd6ee" stroke-opacity="0.55" stroke-width="3"/>
    <rect x="-24" y="-58" width="48" height="14" rx="4" fill="#7a5638" stroke="${INK}" stroke-width="3"/>`;
  for (let i = 0; i < count; i++) s += firefly(-14 + (i % 3) * 14 + Math.sin(t * 1.5 + i) * 3, 30 - Math.floor(i / 3) * 18 + Math.cos(t * 1.2 + i) * 3, t, i, 0.55);
  return s + `</g>`;
}

// Mia: a little person in Milo's chibi style. (x,y) = head centre. Extra options: hair colour, glasses, bun (older Mia).
function her(x, y, s, o = {}) {
  const skin = '#f7efe6', hair = o.hair || '#4a2f2a', hairHi = o.hairHi || '#6b453c', dress = o.dress || '#d98ca0', dressSh = o.dressSh || '#b8697f', look = o.look || 0;
  const pose = o.pose || 'stand';
  const limb = (x1, y1, x2, y2, col = skin) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="14" stroke-linecap="round"/>`;
  const arm = (side, ang, hand) => {
    const sx = side * 40, sy = 96;
    if (hand) return limb(sx, sy, hand[0], hand[1]);
    const a = (ang ?? 12) * Math.PI / 180;
    return limb(sx, sy, sx + side * Math.sin(a) * 40, sy + Math.cos(a) * 40);
  };
  let legs = '';
  if (pose === 'stand') legs = limb(-18, 160, -20 + (o.step || 0), 190) + limb(18, 160, 20 - (o.step || 0), 190);
  if (pose === 'sit') legs = `<ellipse cx="-22" cy="176" rx="17" ry="14" fill="${skin}" stroke="${INK}" stroke-width="5"/><ellipse cx="22" cy="176" rx="17" ry="14" fill="${skin}" stroke="${INK}" stroke-width="5"/>`;
  const body = pose === 'none' ? '' : `${pose === 'stand' ? legs : ''}<path d="M-34 78 L-58 168 Q0 180 58 168 L34 78 Q0 66 -34 78 Z" fill="${dress}" stroke="${INK}" stroke-width="5.5"/>
    <path d="M18 80 L44 166 Q52 164 58 168 L34 78 Z" fill="${dressSh}" opacity="0.7"/>${pose === 'sit' ? legs : ''}`;
  const ex = 30;
  let eyes;
  if (o.eyes === 'happy' || o.eyes === 'closed') eyes = `<path d="M${-ex - 11 + look} -2 q11 ${o.eyes === 'happy' ? -14 : 9} 22 0 M${ex - 11 + look} -2 q11 ${o.eyes === 'happy' ? -14 : 9} 22 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else {
    eyes = [-ex, ex].map(c => `<ellipse cx="${c + look}" cy="-2" rx="8" ry="11" fill="${INK}"/><circle cx="${c + look + 2.5}" cy="-6" r="2.6" fill="#fff"/>
      <path d="M${c + look + (c < 0 ? -9 : 9)} -11 l${c < 0 ? -6 : 6} -5" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
    if (o.eyes === 'sad') eyes += `<path d="M${-ex - 14 + look} -22 l20 -5 M${ex + 14 + look} -22 l-20 -5" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }
  const mouth = { smile: `<path d="M-11 26 q11 10 22 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    grin: `<path d="M-14 22 q14 20 28 0 z" fill="${INK}"/>`,
    flat: `<path d="M-8 29 h16" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
    sad: `<path d="M-10 32 q10 -8 20 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    o: `<ellipse cx="0" cy="28" rx="6" ry="7" fill="${INK}"/>` }[o.mouth || 'smile'];
  const hairBack = `<path d="M-98 10 Q-104 -96 0 -104 Q104 -96 98 10 Q100 70 74 84 L60 30 L-60 30 L-74 84 Q-100 70 -98 10 Z" fill="${hair}" stroke="${INK}" stroke-width="5.5"/>`;
  const bangs = `<path d="M-86 -14 Q-84 -90 0 -96 Q84 -90 86 -14 Q70 -46 40 -40 Q28 -60 6 -44 Q-16 -62 -34 -40 Q-62 -48 -86 -14 Z" fill="${hair}" stroke="${INK}" stroke-width="5"/>
    <path d="M-50 -76 Q-20 -90 20 -86" stroke="${hairHi}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  const bun = o.bun ? `<circle cx="0" cy="-104" r="30" fill="${hair}" stroke="${INK}" stroke-width="5"/>` : '';
  const flower = `<g transform="translate(60,-66)">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="0" cy="-9" rx="7" ry="10" fill="#ff9ec0" stroke="${INK}" stroke-width="3" transform="rotate(${i * 72})"/>`).join('')}<circle r="6" fill="${P.mustard}" stroke="${INK}" stroke-width="3"/></g>`;
  const glasses = o.glasses ? `<g fill="none" stroke="${INK}" stroke-width="4"><circle cx="${-ex + look}" cy="-2" r="19"/><circle cx="${ex + look}" cy="-2" r="19"/><path d="M${-11 + look} -4 q11 -6 22 0"/></g>` : '';
  const tint = o.light ? `<g style="mix-blend-mode:${o.lightMode || 'screen'}" opacity="${o.lightOp ?? 0.3}"><circle r="90" fill="${o.light}"/></g>` : '';
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0}) scale(${s})">
    ${bun}${hairBack}${body}
    <circle r="88" fill="${skin}" stroke="${INK}" stroke-width="6"/>
    <ellipse cx="-52" cy="20" rx="14" ry="8.5" fill="#f2969a" opacity="0.75"/><ellipse cx="52" cy="20" rx="14" ry="8.5" fill="#f2969a" opacity="0.75"/>
    ${o.wrinkles ? `<path d="M-62 -10 l-8 -4 M62 -10 l8 -4" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>` : ''}
    ${eyes}${glasses}${mouth}${bangs}${o.noFlower ? '' : flower}${tint}${o.extra || ''}
    ${o.arms === false ? '' : arm(-1, o.armL, o.handL) + arm(1, o.armR, o.handR)}</g>`;
}
const OLD_MIA = { hair: '#c9c4c0', hairHi: '#e6e2de', glasses: true, bun: true, dress: '#9a86b8', dressSh: '#7a679a', wrinkles: true, noFlower: true };

// ---------- props ----------
const cup = (x, y, s = 1, steam = 0, t = 0, col = '#f1ede4') => `<g transform="translate(${x},${y}) scale(${s})">
  ${steam ? [0, 1, 2].map(i => `<path d="M${-8 + i * 8} -28 q-6 -10 0 -20 q6 -10 0 -20" stroke="#fff" stroke-width="3" fill="none" opacity="${steam * (0.25 + 0.2 * Math.sin(t * 2 + i))}" transform="translate(0,${-((t * 10 + i * 7) % 10)})"/>`).join('') : ''}
  <path d="M-16 -24 L16 -24 L13 8 Q0 14 -13 8 Z" fill="${col}" stroke="${INK}" stroke-width="4"/><path d="M16 -16 q12 0 10 10 q-2 8 -12 6" stroke="${INK}" stroke-width="4" fill="none"/></g>`;
function phone(x, y, rot, lit, s = 1) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-15" y="-26" width="30" height="52" rx="6" fill="#1b1c24" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-20" width="20" height="40" rx="3" fill="${mix('#2a3550', '#bfe4ff', lit)}"/></g>` + (lit > 0 ? glw(x, y, 50, '#7cc4ff', 0.4 * lit) : '');
}
function window_(x, y, w, h, t, o = {}) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${o.sky || '#0a0f22'}"/>`;
  if (o.moon) s += `<circle cx="${x + w * 0.72}" cy="${y + h * 0.26}" r="${w * 0.1}" fill="#e6ecff" opacity="0.85"/><circle cx="${x + w * 0.76}" cy="${y + h * 0.23}" r="${w * 0.088}" fill="${o.sky || '#0a0f22'}"/>`;
  if (o.city) for (let i = 0; i < 18; i++) s += `<circle cx="${x + ((i * 53.7) % w)}" cy="${y + h * 0.45 + ((i * 31.3) % (h * 0.5))}" r="${6 + (i % 4) * 4}" fill="${['#ffcf8a', '#ff9e7a', '#9fc6ff'][i % 3]}" opacity="${0.18 + 0.1 * Math.sin(t + i)}" filter="url(#glow)"/>`;
  if (o.rain) for (let i = 0; i < 22; i++) { const rx = x + ((i * 37.1) % w), ry = y + ((i * 61.7 + t * 260) % h); s += `<path d="M${rx} ${ry} l-3 12" stroke="#9fb4e0" stroke-width="2" opacity="0.5"/>`; }
  if (o.snow) for (let i = 0; i < 24; i++) { const rx = x + ((i * 37.1 + Math.sin(t + i) * 8) % w), ry = y + ((i * 61.7 + t * 40) % h); s += `<circle cx="${rx}" cy="${ry}" r="2.5" fill="#fff" opacity="0.7"/>`; }
  return s + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="#05070e" stroke-width="10"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#05070e" stroke-width="7"/>`;
}
const room = (top = '#0e1322', bot = '#080b15', floor = '#140e09') => `<defs><linearGradient id="rm${top.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#rm${top.slice(1)})"/><rect y="580" width="${W}" height="140" fill="${floor}"/><path d="M0 580 H${W}" stroke="#1f160f" stroke-width="5"/>`;
const floorLamp = (x, t, on = 1) => `<path d="M${x} 580 V300" stroke="#2b2730" stroke-width="9"/><ellipse cx="${x}" cy="582" rx="40" ry="9" fill="#2b2730"/>
  <path d="M${x - 46} 300 L${x + 46} 300 L${x + 30} 236 L${x - 30} 236 Z" fill="${mix('#3a3540', '#f6d29a', on)}" stroke="${INK}" stroke-width="5"/>` + glw(x, 290, 90, '#ffcf8a', 0.45 * on * (0.95 + 0.05 * Math.sin(t * 5)));
const armchair = (x, y, col = '#5a3d4a') => `<g transform="translate(${x},${y})"><rect x="-110" y="-150" width="220" height="170" rx="40" fill="${col}" stroke="${INK}" stroke-width="5"/>
  <rect x="-130" y="-60" width="60" height="120" rx="26" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="70" y="-60" width="60" height="120" rx="26" fill="${col}" stroke="${INK}" stroke-width="5"/>
  <rect x="-80" y="10" width="160" height="40" rx="12" fill="${mix(col, '#000000', 0.15)}" stroke="${INK}" stroke-width="5"/><path d="M-100 50 V80 M100 50 V80" stroke="#2c2018" stroke-width="10"/></g>`;

// Chapter card for each small thing: number + title, over a dark veil (first 2.4 s of the block).
function chapter(n, title, lt) {
  const op = Math.min(seg(lt, 0, 0.35), 1 - seg(lt, 2.0, 2.6));
  if (op <= 0) return '';
  const k = back(seg(lt, 0.1, 0.5));
  return `<g opacity="${op}"><rect width="${W}" height="${H}" fill="#05070c" opacity="0.88"/>
    <g transform="translate(640,${300 + Math.sin(lt * 1.3) * 1.5}) scale(${k})"><circle r="46" fill="${P.mustard}"/>${txt(0, 18, String(n), 52, '#1a1a1a')}</g>
    ${txt(640, 420, title, 40, P.cream)}</g>`;
}
// Firefly that rises from (x0,y0) and flies into the jar HUD over [a,b].
function flyToJar(t, a, b, x0, y0) {
  const p = seg(t, a, b);
  if (p <= 0 || p >= 1) return '';
  const e = ease(p), x = lerp(x0, 1186, e) + Math.sin(p * 9) * 30 * (1 - p), y = lerp(y0, 100, e) - Math.sin(p * Math.PI) * 120;
  let trail = '';
  for (let i = 1; i < 6; i++) {
    const q = Math.max(0, p - i * 0.025), eq = ease(q);
    trail += `<circle cx="${lerp(x0, 1186, eq) + Math.sin(q * 9) * 30 * (1 - q)}" cy="${lerp(y0, 100, eq) - Math.sin(q * Math.PI) * 120}" r="${4 - i * 0.6}" fill="#ffd27a" opacity="${0.5 - i * 0.08}"/>`;
  }
  return trail + firefly(x, y, t, 99, 1.2);
}
