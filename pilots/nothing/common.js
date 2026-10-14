// Shared pieces for the film "NOTHING" (room, props, light, HUD, timer). Loaded before each act file.
const INK = '#16161a';

const cam = (inner, z, fx, fy, dx = 0, dy = 0) => `<g transform="translate(${fx + dx},${fy + dy}) scale(${z}) translate(${-fx},${-fy})">${inner}</g>`;
const glow = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
function pool(id, x, y, rx, ry, col, op) {
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${id})" style="mix-blend-mode:screen"/>`;
}
function shade(id, x, y, r, op) {
  return `<defs><radialGradient id="${id}" cx="${x / W}" cy="${y / H}" r="${r}"><stop offset="0.25" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id})"/>`;
}
function dust(t, x0, y0, w, h, n, col, op = 0.5) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const sx = (i * 97.13) % 1, sy = (i * 57.71) % 1;
    const x = x0 + ((sx * w + t * (6 + (i % 5) * 3)) % w);
    const y = y0 + ((sy * h - t * (4 + (i % 3) * 2) + h * 40) % h);
    out += `<circle cx="${x}" cy="${y}" r="${1.2 + (i % 3) * 0.8}" fill="${col}" opacity="${op * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i)))}"/>`;
  }
  return out;
}
const vignette = (op = 0.75) => `<defs><radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${op}"/></radialGradient>
  <linearGradient id="bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0.75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.7"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#vig)"/><rect width="${W}" height="${H}" fill="url(#bot)"/>`;

// Subtitle line with soft fade in/out over [a, b].
function line(s, t, a, b, y = 668, size = 38, col = P.cream) {
  const op = Math.min(seg(t, a, a + 0.35), 1 - seg(t, b - 0.35, b));
  if (op <= 0) return '';
  return `<g opacity="${op}" transform="translate(0,${(1 - ease(seg(t, a, a + 0.35))) * 10})">${txt(640, y, s, size, col, { weight: 700 })}</g>`;
}
// Bigger centred statement.
function big(s, t, a, b, y, size = 64, col = P.cream) {
  const op = Math.min(seg(t, a, a + 0.4), 1 - seg(t, b - 0.4, b));
  if (op <= 0) return '';
  return `<g opacity="${op}" transform="translate(640,${y}) scale(${lerp(0.94, 1, ease(seg(t, a, a + 0.5)))})">${txt(0, 0, s, size, col)}</g>`;
}

// ---------- room ----------
// warm: 0..1 lamp intensity. Returns background (behind Milo).
function roomBack(t, warm = 1, o = {}) {
  let s = `<defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151d"/><stop offset="1" stop-color="#1d1a22"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#wall)"/>
    <rect y="600" width="${W}" height="120" fill="#141116"/><path d="M0 600 H${W}" stroke="#24202a" stroke-width="5"/>`;
  // window (night) at left
  s += `<rect x="90" y="120" width="190" height="230" rx="6" fill="#10162a"/><circle cx="235" cy="170" r="20" fill="#dfe6ff" opacity="0.7"/><circle cx="244" cy="164" r="17" fill="#10162a"/>
    <rect x="90" y="120" width="190" height="230" rx="6" fill="none" stroke="#08080d" stroke-width="10"/><path d="M185 120 V350 M90 235 H280" stroke="#08080d" stroke-width="7"/>`;
  // wall clock
  const cx = 930, cy = 190, sec = (o.clockT ?? t) * 6, min = (o.clockT ?? t) * 0.1 + 120;
  s += `<g transform="translate(${cx},${cy}) scale(${o.clockScale || 1})"><circle r="46" fill="#e9e3d6" stroke="${INK}" stroke-width="7"/>
    ${[0, 1, 2, 3].map(i => `<path d="M0 -38 V-30" stroke="${INK}" stroke-width="5" transform="rotate(${i * 90})"/>`).join('')}
    <path d="M0 0 V-22" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${min})"/>
    <path d="M0 6 V-34" stroke="${P.red}" stroke-width="3" stroke-linecap="round" transform="rotate(${Math.floor(sec / 6) * 6})"/><circle r="5" fill="${INK}"/></g>`;
  // floor lamp at left
  s += `<path d="M330 600 V300" stroke="#2b2730" stroke-width="10"/><ellipse cx="330" cy="602" rx="44" ry="10" fill="#2b2730"/>
    <path d="M280 300 L380 300 L360 230 L300 230 Z" fill="${mix('#3a3540', '#f6d29a', warm)}" stroke="${INK}" stroke-width="6"/>`;
  // fridge at right
  const door = clamp(o.fridge || 0);
  s += `<rect x="1010" y="300" width="170" height="300" rx="14" fill="#c9ccd6" stroke="${INK}" stroke-width="7"/><path d="M1010 400 H1180" stroke="${INK}" stroke-width="5"/>`;
  if (door > 0) {
    s += `<rect x="1022" y="310" width="146" height="282" rx="6" fill="#fff6d8"/><rect x="1032" y="420" width="126" height="8" fill="#e5dcc0"/><rect x="1032" y="500" width="126" height="8" fill="#e5dcc0"/>
      <circle cx="1060" cy="400" r="18" fill="${P.red}"/><rect x="1095" y="372" width="30" height="46" rx="6" fill="#7ac0ff"/><rect x="1050" y="455" width="60" height="40" rx="8" fill="${P.mustard}"/>`;
    s += `<g transform="translate(1010,0) scale(${1 - door * 1.6},1)"><rect x="0" y="300" width="170" height="300" rx="14" fill="#b4b7c2" stroke="${INK}" stroke-width="7"/></g>`;
  } else s += `<path d="M1030 330 V380 M1030 420 V480" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  // chair (behind Milo)
  s += `<rect x="535" y="320" width="210" height="240" rx="24" fill="#3a3040" stroke="${INK}" stroke-width="6"/>`;
  return s;
}
// chair seat and legs (in front of Milo's body bottom)
const chairFront = () => `<rect x="550" y="548" width="180" height="26" rx="10" fill="#4a3d52" stroke="${INK}" stroke-width="6"/>
  <path d="M572 574 V640 M708 574 V640" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`;
// light overlays for the room
function roomLight(t, warm = 1, extra = '') {
  return pool('lamp', 330, 330, 420, 330, '#ffb35c', 0.42 * warm) + glow(330, 300, 70, '#ffcf8a', 0.5 * warm) + extra;
}

// Phone lying on the floor, slightly top-down. buzz: 0..1 shake, lit: 0..1 screen.
function floorPhone(x, y, t, lit = 0, buzz = 0, legs = 0) {
  const jx = buzz ? Math.sin(t * 90) * 3 * buzz : 0;
  let s = pool('ph' + Math.round(x), x, y, 200, 70, '#4aa6ff', 0.15 + 0.6 * lit);
  if (legs > 0) {  // tiny legs scuttling
    for (let i = 0; i < 4; i++) {
      const ph = Math.sin(t * 22 + i * 1.6) * 8 * legs;
      s += `<path d="M${x - 30 + i * 20} ${y + 6} l${ph} 14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    }
  }
  s += `<g transform="translate(${x + jx},${y}) scale(1.35,0.55)"><rect x="-48" y="-80" width="96" height="160" rx="16" fill="#1b1c24" stroke="${INK}" stroke-width="10"/>
    <rect x="-38" y="-70" width="76" height="140" rx="9" fill="${mix('#2c3a52', '#bfe4ff', lit)}"/></g>` + (lit > 0 ? glow(x, y - 4, 50, '#7cc4ff', 0.6 * lit) : '');
  if (buzz > 0) s += `<g stroke="#bfe4ff" stroke-width="4" fill="none" stroke-linecap="round" opacity="${buzz}"><path d="M${x - 70} ${y - 20} q-8 14 0 28 M${x + 70} ${y - 20} q8 14 0 28"/></g>`;
  return s;
}

// Thought bubble above-left of Milo; sc = pop-in scale.
function thought(x, y, w, h, sc, inner) {
  if (sc <= 0.01) return '';
  return `<g transform="translate(${x},${y}) scale(${sc})"><circle cx="${w * 0.05 + 60}" cy="${h / 2 + 50}" r="10" fill="#f1ede4" stroke="${INK}" stroke-width="4"/>
    <circle cx="${w * 0.05 + 80}" cy="${h / 2 + 22}" r="16" fill="#f1ede4" stroke="${INK}" stroke-width="5"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2.2}" fill="#f1ede4" stroke="${INK}" stroke-width="6"/>${inner}</g>`;
}

// Brain wearing a tie — the "producer" temptation.
function brainGuy(x, y, s, t) {
  const b = Math.sin(t * 6) * 3;
  return `<g transform="translate(${x},${y + b}) scale(${s})">
    <path d="M-60 0 q-10 -40 25 -50 q15 -25 45 -10 q30 -18 50 10 q30 10 15 45 q10 35 -30 40 h-80 q-35 -5 -25 -35 z" fill="#f4a3b8" stroke="${INK}" stroke-width="6"/>
    <path d="M-30 -30 q15 10 0 25 M10 -40 q-10 20 10 30 M35 -20 q-12 14 4 26" stroke="#d27792" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="-16" cy="8" r="6" fill="${INK}"/><circle cx="18" cy="8" r="6" fill="${INK}"/><path d="M-12 22 q12 10 24 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M0 35 l-12 12 l12 40 l12 -40 z" fill="${P.red}" stroke="${INK}" stroke-width="4"/>
    <g transform="translate(64,10) rotate(${Math.sin(t * 4) * 10})"><rect x="-16" y="-28" width="32" height="56" rx="7" fill="#1b1c24" stroke="${INK}" stroke-width="5"/><rect x="-11" y="-22" width="22" height="42" rx="3" fill="#9fd2ff"/></g></g>`;
}

// Countdown ring at top centre. rem in seconds (0..60). emph 0..1 makes it bigger and glow.
function timerRing(rem, t, op = 1, emph = 0, label = null) {
  if (op <= 0) return '';
  const r = 54, c = 2 * Math.PI * r, frac = clamp(rem / 60);
  const secs = Math.ceil(rem - 1e-6);
  const str = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const col = rem <= 10 ? mix(P.mustard, P.green, 1 - rem / 10) : P.cream;
  return `<g opacity="${op}" transform="translate(640,92) scale(${1 + emph * 0.25})">
    <circle r="${r + 14}" fill="#000" opacity="0.45"/>
    <circle r="${r}" fill="none" stroke="#ffffff" stroke-opacity="0.15" stroke-width="10"/>
    <circle r="${r}" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - frac)}" transform="rotate(-90)"/>
    ${emph > 0 ? `<circle r="${r}" fill="none" stroke="${col}" stroke-width="10" opacity="${0.5 * emph}" filter="url(#glow)"/>` : ''}
    ${label ? txt(0, 20, label, 58, P.mustard, { weight: 900 }) : txt(0, 13, str, 38, col, { weight: 900 })}</g>`;
}

function hudBar(x, y, label, value, col, op = 1) {
  if (op <= 0) return '';
  const w = 300, fillW = Math.max(8, (w - 12) * value);
  return `<g transform="translate(${x},${y})" opacity="${op}">${txt(0, -12, label, 20, P.cream, { anchor: 'start', weight: 800, ls: 2 })}
    <rect width="${w}" height="26" rx="13" fill="#000" fill-opacity="0.45" stroke="#fff" stroke-opacity="0.3" stroke-width="3"/>
    <rect x="6" y="6" width="${fillW}" height="14" rx="7" fill="${col}" filter="url(#glow)" opacity="0.7"/><rect x="6" y="6" width="${fillW}" height="14" rx="7" fill="${col}"/>
    ${txt(w + 14, 23, Math.round(value * 100) + '%', 28, col, { anchor: 'start', weight: 900 })}</g>`;
}

// Particle burst from (x,y) at time p 0..1.
function burst(x, y, p, n, col) {
  if (p <= 0 || p >= 1) return '';
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = i * 2.399, d = ease(p) * (60 + (i % 5) * 30);
    s += `<circle cx="${x + Math.cos(a) * d}" cy="${y + Math.sin(a) * d - p * 30}" r="${3 + (i % 3)}" fill="${col}" opacity="${1 - p}"/>`;
  }
  return s;
}
