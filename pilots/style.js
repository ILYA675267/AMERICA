// Our own house style: deep-teal world, teal ink outlines, hard offset "riso" shadows, film grain,
// cream / coral / mustard palette. Main character: Percy, whose head is a battery filled with liquid charge.
const P = {
  bg: '#17414A', bg2: '#1F5560', ink: '#0B2227', cream: '#FFF4E0', coral: '#FF7A59',
  mustard: '#FFC845', green: '#57D68D', red: '#FF4D4D', dead: '#6B7F84',
};
const chargeColor = l => (l > 0.5 ? P.green : l > 0.2 ? P.mustard : P.red);

// SVG defs shared by every frame: hard shadow + animated grain.
function styleDefs(t) {
  const seed = Math.floor(t * 12) % 50;
  return `<defs>
    <filter id="hard" x="-20%" y="-20%" width="150%" height="150%"><feDropShadow dx="9" dy="9" stdDeviation="0" flood-color="${P.ink}" flood-opacity="0.55"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>`;
}
const grain = (op = 0.07) => `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${op}"/>`;

function sframe(inner, t, bg = P.bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${styleDefs(t)}
    <rect width="${W}" height="${H}" fill="${bg}"/>${inner}${grain()}</svg>`;
}

// Title text with a coral hard shadow.
function stitle(x, y, s, size, fill = P.cream, sh = P.coral, o = {}) {
  return txt(x + size * 0.06, y + size * 0.06, s, size, sh, o) + txt(x, y, s, size, fill, o);
}
// Caption in a cream label box.
function caption(x, y, s, size = 34, o = {}) {
  const w = Math.max(40, s.length * size * 0.62 + 44);
  if (!s) return '';
  return `<g opacity="${o.op ?? 1}"><rect x="${x - w / 2}" y="${y - size - 6}" width="${w}" height="${size + 26}" rx="10" fill="${o.bg || P.cream}" filter="url(#hard)"/>
    ${txt(x, y, s, size, o.fill || P.ink, { weight: 800 })}</g>`;
}

let _pid = 0;
// Percy. (x,y) = head centre, s = scale. o: level 0..1, t, eyes, mouth, armL/armR (deg), pct (label), body, rot, dead.
function percy(x, y, s, o = {}) {
  const id = 'ph' + (_pid++);
  const lvl = clamp(o.level ?? 1), t = o.t || 0;
  const dead = o.dead;
  const liquid = dead ? P.dead : chargeColor(lvl);
  const top = 95 - lvl * 200;
  let wave = `M-90 ${top}`;
  for (let xx = -90; xx <= 90; xx += 10) wave += ` L${xx} ${top + Math.sin(xx / 18 + t * 6) * (lvl > 0.02 ? 6 : 0)}`;
  wave += ' L90 120 L-90 120 Z';
  const head = `<rect x="-80" y="-105" width="160" height="200" rx="46"/>`;
  // eyes
  const lid = clamp(o.lid ?? 0);
  const look = o.look || 0;
  let eyes;
  if (dead) eyes = `<path d="M-52 -30 l28 28 M-24 -30 l-28 28 M24 -30 l28 28 M52 -30 l-28 28" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>`;
  else if (o.eyes === 'happy') eyes = `<path d="M-56 -10 q18 -24 36 0 M20 -10 q18 -24 36 0" stroke="${P.ink}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  else {
    const ry = o.eyes === 'wide' ? 30 : 24, pr = o.eyes === 'wide' ? 7 : 10;
    const eye = cx => `<ellipse cx="${cx}" cy="-16" rx="21" ry="${ry}" fill="#fff" stroke="${P.ink}" stroke-width="6"/>
      <circle cx="${cx + look}" cy="-12" r="${pr}" fill="${P.ink}"/>
      ${lid > 0 ? `<clipPath id="${id}e${cx}"><ellipse cx="${cx}" cy="-16" rx="21" ry="${ry}"/></clipPath>
        <rect x="${cx - 24}" y="${-16 - ry - 4}" width="48" height="${(ry * 2 + 8) * lid}" fill="${P.cream}" clip-path="url(#${id}e${cx})"/>
        <path d="M${cx - 21} ${-16 - ry + (ry * 2 + 8) * lid - 4} h42" stroke="${P.ink}" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="${cx}" cy="-16" rx="21" ry="${ry}" fill="none" stroke="${P.ink}" stroke-width="6"/>` : ''}`;
    eyes = eye(-37) + eye(37);
    if (o.brows) eyes += `<path d="M-60 ${-54 + o.brows} l40 ${o.brows > 0 ? -8 : 8} M60 ${-54 + o.brows} l-40 ${o.brows > 0 ? -8 : 8}" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>`;
  }
  const mouths = {
    smile: `<path d="M-26 42 q26 26 52 0" stroke="${P.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    grin: `<path d="M-34 36 q34 46 68 0 z" fill="${P.ink}"/>`,
    flat: `<path d="M-18 48 h36" stroke="${P.ink}" stroke-width="7" stroke-linecap="round"/>`,
    sad: `<path d="M-22 56 q22 -18 44 0" stroke="${P.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    open: `<ellipse cx="0" cy="50" rx="16" ry="20" fill="${P.ink}"/>`,
    wobble: `<path d="M-26 50 q6.5 -8 13 0 t13 0 t13 0 t13 0" stroke="${P.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  };
  const mouth = mouths[o.mouth || 'smile'];
  // body: coral hoodie, teal pants, sneakers, arms
  const arm = (side, ang) => {
    const sx = side * 62, a = (ang ?? 20) * Math.PI / 180;
    const ex = sx + side * Math.sin(a) * 95, ey = 130 + Math.cos(a) * 95;
    return `<path d="M${sx} 130 L${ex} ${ey}" stroke="${P.ink}" stroke-width="34" stroke-linecap="round"/>
      <path d="M${sx} 130 L${ex} ${ey}" stroke="${P.coral}" stroke-width="22" stroke-linecap="round"/>
      <circle cx="${ex}" cy="${ey}" r="15" fill="${P.cream}" stroke="${P.ink}" stroke-width="5"/>`;
  };
  const pct = o.pct ?? Math.round(lvl * 100) + '%';
  const body = o.body === false ? '' : `
    <path d="M-30 250 v60 M30 250 v60" stroke="${P.ink}" stroke-width="34" stroke-linecap="round"/>
    <path d="M-30 250 v60 M30 250 v60" stroke="#2E6E78" stroke-width="22" stroke-linecap="round"/>
    <rect x="-62" y="300" width="56" height="26" rx="13" fill="${P.cream}" stroke="${P.ink}" stroke-width="5"/>
    <rect x="6" y="300" width="56" height="26" rx="13" fill="${P.cream}" stroke="${P.ink}" stroke-width="5"/>
    ${arm(-1, o.armL)}${arm(1, o.armR)}
    <path d="M-70 105 Q-82 255 -50 262 L50 262 Q82 255 70 105 Q0 85 -70 105 Z" fill="${P.coral}" stroke="${P.ink}" stroke-width="7"/>
    <path d="M-14 112 v34 M14 112 v34" stroke="${P.cream}" stroke-width="5" stroke-linecap="round"/>
    <rect x="-40" y="176" width="80" height="38" rx="9" fill="${P.ink}"/>
    ${txt(0, 205, pct, 28, dead ? P.dead : chargeColor(lvl), { weight: 900 })}`;
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0}) scale(${s})" filter="url(#hard)">
    <defs><clipPath id="${id}">${head}</clipPath></defs>
    ${body}
    <rect x="-26" y="-128" width="52" height="30" rx="9" fill="${P.cream}" stroke="${P.ink}" stroke-width="7"/>
    <g clip-path="url(#${id})"><rect x="-90" y="-120" width="180" height="240" fill="${P.cream}"/><path d="${wave}" fill="${liquid}"/>
      ${!dead && lvl > 0.05 ? `<circle cx="${-40 + Math.sin(t * 3) * 8}" cy="${80 - ((t * 60) % 100)}" r="5" fill="#fff" opacity="0.5"/><circle cx="${30}" cy="${85 - ((t * 45 + 40) % 100)}" r="4" fill="#fff" opacity="0.5"/>` : ''}</g>
    <rect x="-80" y="-105" width="160" height="200" rx="46" fill="none" stroke="${P.ink}" stroke-width="8"/>
    <path d="M-58 -78 q10 -14 26 -16" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.7"/>
    ${eyes}${mouth}${o.extra || ''}</g>`;
}
