// House style v2: dark world (like the niche), simple cream character, light film grain.
// Our signature: Percy's battery head with liquid charge; brand accent = battery green, warnings = red.
const P = {
  bg: '#101013', bg2: '#17171b', ink: '#0a0a0a', cream: '#F1EDE4', coral: '#E8483F',
  mustard: '#F2B544', green: '#4CC57F', red: '#E8483F', dead: '#55555c', dim: '#8a8a92',
};
const chargeColor = l => (l > 0.5 ? P.green : l > 0.2 ? P.mustard : P.red);

function styleDefs(t) {
  const seed = Math.floor(t * 12) % 50;
  return `<defs>
    <filter id="hard" x="-20%" y="-20%" width="150%" height="150%"><feDropShadow dx="0" dy="0" stdDeviation="0" flood-opacity="0"/></filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>`;
}
const grain = (op = 0.05) => `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${op}"/>`;

function sframe(inner, t, bg = P.bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${styleDefs(t)}
    <rect width="${W}" height="${H}" fill="${bg}"/>${inner}${grain()}</svg>`;
}

// Title: plain cream, heavy weight (shadow only when asked).
function stitle(x, y, s, size, fill = P.cream, sh = null, o = {}) {
  return (sh ? txt(x + size * 0.05, y + size * 0.05, s, size, sh, o) : '') + txt(x, y, s, size, fill, o);
}
// Caption: understated text line, like a subtitle.
function caption(x, y, s, size = 34, o = {}) {
  if (!s) return '';
  if (o.bg) {
    const w = s.length * size * 0.6 + 44;
    return `<rect x="${x - w / 2}" y="${y - size - 6}" width="${w}" height="${size + 26}" rx="8" fill="${o.bg}"/>${txt(x, y, s, size, o.fill || P.cream, { weight: 700 })}`;
  }
  return txt(x, y, s, size, o.fill || P.cream, { weight: 600, op: o.op ?? 1 });
}

// Milo: simple round-headed guy. Signature: a sprout on his head that stands up when he has energy
// and wilts when he doesn't. o: level 0..1 (energy), t, eyes (open|wide|happy), lid 0..1, mouth,
// armL/armR (deg from down), look, rot, dead, body.
function percy(x, y, s, o = {}) {
  const lvl = clamp(o.level ?? 1), t = o.t || 0, dead = o.dead;
  const look = o.look || 0, lid = clamp(o.lid ?? 0);
  // sprout: tip swings from upright (lvl 1) to drooping (lvl 0)
  const sway = Math.sin(t * 3) * 4 * lvl;
  const droop = dead ? 1 : 1 - lvl;
  const tipX = lerp(6, 62, droop) + sway, tipY = lerp(-168, -92, droop);
  const leafCol = dead ? '#6e5a3c' : lvl > 0.3 ? P.green : '#8a9a4a';
  const leafAng = lerp(-30, 70, droop);
  const sprout = `<path d="M0 -88 Q${lerp(2, 30, droop)} ${lerp(-140, -130, droop)} ${tipX} ${tipY}" stroke="${P.ink}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M0 -88 Q${lerp(2, 30, droop)} ${lerp(-140, -130, droop)} ${tipX} ${tipY}" stroke="${leafCol}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <g transform="translate(${tipX},${tipY}) rotate(${leafAng})"><path d="M0 0 Q18 -26 44 -6 Q18 12 0 0 Z" fill="${leafCol}" stroke="${P.ink}" stroke-width="5" stroke-linejoin="round"/></g>`;
  let eyes;
  if (dead) eyes = `<path d="M-44 -22 l20 20 M-24 -22 l-20 20 M24 -22 l20 20 M44 -22 l-20 20" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>`;
  else if (o.eyes === 'happy') eyes = `<path d="M-46 -6 q12 -17 24 0 M22 -6 q12 -17 24 0" stroke="${P.ink}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  else if (o.eyes === 'wide') eyes = `<circle cx="-32" cy="-12" r="16" fill="#fff" stroke="${P.ink}" stroke-width="6"/><circle cx="32" cy="-12" r="16" fill="#fff" stroke="${P.ink}" stroke-width="6"/>
      <circle cx="${-32 + look}" cy="-12" r="6" fill="${P.ink}"/><circle cx="${32 + look}" cy="-12" r="6" fill="${P.ink}"/>`;
  else if (lid > 0) {
    const r = 10, y0 = -10 + lid * 4;
    const half = cx => `<path d="M${cx - r} ${y0} A${r} ${r} 0 0 0 ${cx + r} ${y0} Z" fill="${P.ink}"/><path d="M${cx - r - 3} ${y0} h${2 * r + 6}" stroke="${P.ink}" stroke-width="6" stroke-linecap="round"/>`;
    eyes = half(-32 + look) + half(32 + look);
  } else eyes = `<ellipse cx="${-32 + look}" cy="-10" rx="8" ry="12" fill="${P.ink}"/><ellipse cx="${32 + look}" cy="-10" rx="8" ry="12" fill="${P.ink}"/>`;
  const mouths = {
    smile: `<path d="M-20 32 q20 18 40 0" stroke="${P.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    grin: `<path d="M-28 26 q28 38 56 0 z" fill="${P.ink}"/>`,
    flat: `<path d="M-14 38 h28" stroke="${P.ink}" stroke-width="7" stroke-linecap="round"/>`,
    sad: `<path d="M-18 44 q18 -14 36 0" stroke="${P.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    open: `<ellipse cx="0" cy="40" rx="13" ry="16" fill="${P.ink}"/>`,
    wobble: `<path d="M-22 40 q5.5 -7 11 0 t11 0 t11 0 t11 0" stroke="${P.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  };
  const limb = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${P.ink}" stroke-width="24" stroke-linecap="round"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${P.cream}" stroke-width="14" stroke-linecap="round"/>`;
  const arm = (side, ang) => {
    const a = (ang ?? 15) * Math.PI / 180, sx = side * 38;
    return limb(sx, 112, sx + side * Math.sin(a) * 78, 112 + Math.cos(a) * 78);
  };
  const body = o.body === false ? '' : `
    ${limb(-16, 214, -20, 292)}${limb(16, 214, 20, 292)}
    ${arm(-1, o.armL)}${arm(1, o.armR)}
    <path d="M-40 92 Q-50 214 -25 222 L25 222 Q50 214 40 92 Q0 80 -40 92 Z" fill="${P.cream}" stroke="${P.ink}" stroke-width="6"/>`;
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0}) scale(${s})">
    ${body}${sprout}
    <circle r="90" fill="${dead ? '#bdb9b0' : P.cream}" stroke="${P.ink}" stroke-width="7"/>
    ${eyes}${mouths[o.mouth || 'smile']}${o.extra || ''}</g>`;
}
