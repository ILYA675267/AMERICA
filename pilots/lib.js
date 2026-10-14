// Shared helpers for the pilot animations. Every scene is a pure function of time t (seconds).
const W = 1280, H = 720, FPS = 30;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = p => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const back = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const lerp = (a, b, p) => a + (b - a) * p;
const mix = (c1, c2, p) => {
  const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const a = h(c1), b = h(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], p)).toString(16).padStart(2, '0')).join('');
};
const OUT = '#111';

// Eyes / mouth for a head of radius 100 centred at 0,0.
function face({ eyes = 'open', mouth = 'flat', look = 0 } = {}) {
  let e = '';
  const L = -36 + look, R = 36 + look;
  switch (eyes) {
    case 'closed': e = `<path d="M${L - 18} 0 q18 12 36 0 M${R - 18} 0 q18 12 36 0" stroke="${OUT}" stroke-width="7" fill="none" stroke-linecap="round"/>`; break;
    case 'sleepy': e = `<path d="M${L - 20} -6 h40 M${R - 20} -6 h40" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/><ellipse cx="${L}" cy="4" rx="9" ry="6" fill="${OUT}"/><ellipse cx="${R}" cy="4" rx="9" ry="6" fill="${OUT}"/>`; break;
    case 'wide': e = `<circle cx="${L}" cy="-4" r="24" fill="#fff" stroke="${OUT}" stroke-width="5"/><circle cx="${R}" cy="-4" r="24" fill="#fff" stroke="${OUT}" stroke-width="5"/><circle cx="${L}" cy="-4" r="7" fill="${OUT}"/><circle cx="${R}" cy="-4" r="7" fill="${OUT}"/>`; break;
    case 'angry': e = `<path d="M${L - 22} -34 l40 14 M${R + 22} -34 l-40 14" stroke="${OUT}" stroke-width="9" stroke-linecap="round"/><ellipse cx="${L}" cy="0" rx="9" ry="12" fill="${OUT}"/><ellipse cx="${R}" cy="0" rx="9" ry="12" fill="${OUT}"/>`; break;
    case 'happy': e = `<path d="M${L - 18} 4 q18 -20 36 0 M${R - 18} 4 q18 -20 36 0" stroke="${OUT}" stroke-width="8" fill="none" stroke-linecap="round"/>`; break;
    case 'sad': e = `<path d="M${L - 20} -30 l36 -10 M${R + 20} -30 l-36 -10" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/><ellipse cx="${L}" cy="0" rx="8" ry="11" fill="${OUT}"/><ellipse cx="${R}" cy="0" rx="8" ry="11" fill="${OUT}"/>`; break;
    default: e = `<ellipse cx="${L}" cy="-2" rx="9" ry="12" fill="${OUT}"/><ellipse cx="${R}" cy="-2" rx="9" ry="12" fill="${OUT}"/>`;
  }
  let m = '';
  switch (mouth) {
    case 'sad': m = `<path d="M-24 58 q24 -18 48 0" stroke="${OUT}" stroke-width="7" fill="none" stroke-linecap="round"/>`; break;
    case 'smile': m = `<path d="M-30 44 q30 30 60 0" stroke="${OUT}" stroke-width="7" fill="none" stroke-linecap="round"/>`; break;
    case 'grin': m = `<path d="M-38 38 q38 50 76 0 z" fill="${OUT}"/>`; break;
    case 'open': m = `<ellipse cx="0" cy="52" rx="18" ry="22" fill="${OUT}"/>`; break;
    case 'scream': m = `<ellipse cx="0" cy="54" rx="28" ry="34" fill="${OUT}"/>`; break;
    case 'none': m = ''; break;
    default: m = `<path d="M-20 50 h40" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/>`;
  }
  return e + m;
}

// Bean character. (x,y) = head centre. Head radius 100 * s.
function bean(x, y, s, o = {}) {
  const c = o.color || '#f2efe6';
  const body = o.body === false ? '' :
    `<path d="M-62 70 Q-80 250 -40 270 L40 270 Q80 250 62 70 Z" fill="${o.bodyColor || c}" stroke="${OUT}" stroke-width="6"/>` +
    (o.tie ? `<path d="M0 95 l-14 20 l14 70 l14 -70 z" fill="${o.tie}" stroke="${OUT}" stroke-width="4"/>` : '');
  const hat = o.hat || '';
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0}) scale(${s})">${body}
    <circle r="100" fill="${c}" stroke="${OUT}" stroke-width="6"/>${face(o)}${hat}${o.extra || ''}</g>`;
}

function txt(x, y, s, size, fill, o = {}) {
  const esc = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<text x="${x}" y="${y}" font-family="${o.font || 'Inter'}" font-weight="${o.weight || 900}" font-size="${size}" fill="${fill}"
    text-anchor="${o.anchor || 'middle'}" opacity="${o.op ?? 1}" letter-spacing="${o.ls || 0}">${esc}</text>`;
}
// Typewriter: reveal characters over [a,b].
const typed = (s, t, a, b) => s.slice(0, Math.round(s.length * seg(t, a, b)));

function bubble(x, y, w, h, tail, content, o = {}) {
  return `<g opacity="${o.op ?? 1}" transform="translate(${x},${y}) scale(${o.sc ?? 1})">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="${o.fill || '#fff'}" stroke="${OUT}" stroke-width="5"/>
    <path d="M${tail[0]} ${h / 2 - 3} l${tail[1]} 40 l30 -40 z" fill="${o.fill || '#fff'}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="${tail[0] - 4}" y="${h / 2 - 8}" width="38" height="8" fill="${o.fill || '#fff'}"/>${content}</g>`;
}

function zzz(x, y, t, col) {
  let out = '';
  for (let i = 0; i < 3; i++) {
    const p = ((t * 0.6) + i / 3) % 1;
    out += txt(x + p * 60, y - p * 90, 'z', 30 + p * 30, col, { op: Math.sin(p * Math.PI) });
  }
  return out;
}

function frame(inner, bg = '#111') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${bg}"/>${inner}</svg>`;
}
// Fade-from/to-black helper.
const fade = op => `<rect width="${W}" height="${H}" fill="#000" opacity="${clamp(op)}"/>`;
