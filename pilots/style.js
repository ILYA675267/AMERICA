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

// Milo v2 (hand-drawn, chibi): huge round head, tiny bean body about one head tall, stubby limbs
// without knees or elbows, pink cheeks, two-leaf sprout. (x,y) = head centre, head radius 90*s.
// o: level 0..1 (sprout energy), dead (dry brown sprout), t, lid 0..1, look, mouth, bags,
//    pose 'stand'|'sit'|'none', armL/armR (deg from down) or handL/handR [x,y], squash, rot,
//    oneLeaf (second leaf already fallen), light (tint colour over the whole figure), lightOp.
function milo(x, y, s, o = {}) {
  const lvl = clamp(o.level ?? 1), t = o.t || 0, dead = o.dead, look = o.look || 0, lid = clamp(o.lid ?? 0);
  const ink = '#16161a', skin = '#f4f1ea', sh = '#c9c4ba';
  const droop = dead ? 1 : 1 - lvl, sway = Math.sin(t * 2.6) * 5 * (0.3 + lvl);
  const tipX = lerp(4, 46, droop) + sway, tipY = lerp(-150, -104, droop);
  const leafCol = dead ? '#8a6a3e' : mix('#9aa04a', '#5bc46a', lvl), leafDark = dead ? '#5e4526' : mix('#6a7a30', '#2f8f45', lvl);
  const leaf = (ang, len) => `<g transform="translate(${tipX},${tipY}) rotate(${ang})"><path d="M0 0 Q${len * 0.45} ${-len * 0.55} ${len} ${-len * 0.12} Q${len * 0.5} ${len * 0.32} 0 0 Z" fill="${leafCol}" stroke="${ink}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M3 -1 Q${len * 0.5} ${-len * 0.2} ${len * 0.85} ${-len * 0.12}" stroke="${leafDark}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  const cx = lerp(2, 26, droop), cy = lerp(-125, -128, droop);
  const sprout = `<path d="M0 -84 Q${cx} ${cy} ${tipX} ${tipY}" stroke="${ink}" stroke-width="11" fill="none" stroke-linecap="round"/>
    <path d="M0 -84 Q${cx} ${cy} ${tipX} ${tipY}" stroke="${leafCol}" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${leaf(lerp(-40, 60, droop) + sway * 0.8, dead ? 30 : 40)}${o.oneLeaf ? '' : leaf(lerp(-150, 110, droop) - sway * 0.6, dead ? 28 : 36)}
    <ellipse cx="0" cy="-86" rx="12" ry="5" fill="#5a4030" stroke="${ink}" stroke-width="3"/>`;
  const fl = clamp(o.flower || 0);
  const flower = fl > 0 ? `<g transform="translate(${tipX},${tipY - 4}) scale(${fl}) rotate(${t * 20})">${[0, 1, 2, 3, 4, 5].map(i =>
    `<ellipse cx="0" cy="-17" rx="10" ry="16" fill="#ffb3c7" stroke="${ink}" stroke-width="3.5" transform="rotate(${i * 60})"/>`).join('')}
    <circle r="10" fill="#ffd45e" stroke="${ink}" stroke-width="3.5"/></g>` : '';
  // eyes
  const ex = 30;
  let eyes;
  if (o.eyes === 'wide') eyes = [-ex, ex].map(c => `<circle cx="${c}" cy="-6" r="17" fill="#fff" stroke="${ink}" stroke-width="4.5"/><circle cx="${c + look * 0.6}" cy="-4" r="7" fill="${ink}"/><circle cx="${c + look * 0.6 + 2.5}" cy="-7" r="2.2" fill="#fff"/>`).join('');
  else if (o.eyes === 'closed') eyes = `<path d="M${-ex - 11} -4 q11 9 22 0 M${ex - 11} -4 q11 9 22 0" stroke="${ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else if (o.eyes === 'happy') eyes = `<path d="M${-ex - 11} -4 q11 -15 22 0 M${ex - 11} -4 q11 -15 22 0" stroke="${ink}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  else {
    const e = c => `<ellipse cx="${c + look}" cy="-6" rx="7.5" ry="10.5" fill="${ink}"/><circle cx="${c + look + 2.5}" cy="-10" r="2.6" fill="#fff"/>`;
    eyes = e(-ex) + e(ex);
    if (lid > 0) {
      const lidY = -17 + lid * 15;
      const l = c => `<path d="M${c - 14} -20 H${c + 14} V${lidY} Q${c} ${lidY + 6} ${c - 14} ${lidY} Z" fill="url(#mhead)"/><path d="M${c - 11} ${lidY + 1} Q${c} ${lidY + 5} ${c + 11} ${lidY + 1}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      eyes += l(-ex + look) + l(ex + look);
    }
    if (o.bags) eyes += `<path d="M${-ex - 9} 9 q9 6 18 0 M${ex - 9} 9 q9 6 18 0" stroke="#8a7f95" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${o.bags}"/>`;
  }
  const mouths = {
    smile: `<path d="M-13 24 q13 12 26 0" stroke="${ink}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`,
    grin: `<path d="M-19 20 q19 28 38 0 z" fill="${ink}"/><path d="M-10 33 q10 6 20 0" stroke="#e07b7b" stroke-width="5" stroke-linecap="round"/>`,
    flat: `<path d="M-9 28 h18" stroke="${ink}" stroke-width="5.5" stroke-linecap="round"/>`,
    sad: `<path d="M-12 32 q12 -9 24 0" stroke="${ink}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`,
    open: `<ellipse cx="0" cy="28" rx="8" ry="10" fill="${ink}"/>`,
    o: `<ellipse cx="0" cy="30" rx="6" ry="7" fill="${ink}"/>`,
    wobble: `<path d="M-16 30 q4 -6 8 0 t8 0 t8 0 t8 0" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    shock: `<path d="M-15 22 q15 -8 30 0 q2 18 -15 20 q-17 -2 -15 -20 z" fill="${ink}"/>`,
  };
  const sweat = o.sweat ? `<g opacity="${o.sweat}"><path d="M74 -46 q12 18 0 27 q-12 -9 0 -27 z" fill="#9fd8ff" stroke="${ink}" stroke-width="3.5"/></g>` : '';
  const cheeks = `<ellipse cx="-54" cy="16" rx="14" ry="8.5" fill="#f2969a" opacity="0.75"/><ellipse cx="54" cy="16" rx="14" ry="8.5" fill="#f2969a" opacity="0.75"/>`;
  const limb = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${ink}" stroke-width="25" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${skin}" stroke-width="15" stroke-linecap="round"/>`;
  const arm = (side, ang, hand) => {
    const sx = side * 40, sy = 96;
    if (hand) return limb(sx, sy, hand[0], hand[1]);
    const a = (ang ?? 12) * Math.PI / 180;
    return limb(sx, sy, sx + side * Math.sin(a) * 40, sy + Math.cos(a) * 40);
  };
  const pose = o.pose || 'stand';
  let legs = '';
  if (pose === 'stand') legs = limb(-20, 160, -22, 190) + limb(20, 160, 22, 190);
  if (pose === 'sit') legs = `<ellipse cx="-24" cy="176" rx="19" ry="15" fill="${skin}" stroke="${ink}" stroke-width="5"/><ellipse cx="24" cy="176" rx="19" ry="15" fill="${skin}" stroke="${ink}" stroke-width="5"/>`;
  const body = pose === 'none' ? '' : `${pose === 'stand' ? legs : ''}
    <path d="M-46 74 Q-60 170 0 172 Q60 170 46 74 Q0 62 -46 74 Z" fill="url(#mbody)" stroke="${ink}" stroke-width="5.5"/>${pose === 'sit' ? legs : ''}`;
  const arms = o.arms === false ? '' : arm(-1, o.armL, o.handL) + arm(1, o.armR, o.handR);
  const sq = o.squash || 0;
  const tint = o.light ? `<g style="mix-blend-mode:${o.lightMode || 'multiply'}" opacity="${o.lightOp ?? 0.5}"><circle r="90" fill="${o.light}"/>${pose === 'none' ? '' : `<path d="M-46 74 Q-60 170 0 172 Q60 170 46 74 Q0 62 -46 74 Z" fill="${o.light}"/>`}</g>` : '';
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0}) scale(${s * (1 + sq * 0.5)},${s * (1 - sq)})">
    <defs><radialGradient id="mhead" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.65" stop-color="${skin}"/><stop offset="1" stop-color="${sh}"/></radialGradient>
    <radialGradient id="mbody" cx="40%" cy="20%" r="90%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="${skin}"/><stop offset="1" stop-color="${sh}"/></radialGradient></defs>
    ${body}${sprout}${flower}
    <circle r="90" fill="url(#mhead)" stroke="${ink}" stroke-width="6"/>
    ${cheeks}${eyes}${mouths[o.mouth || 'smile']}${sweat}${tint}${arms}${o.extra || ''}</g>`;
}
