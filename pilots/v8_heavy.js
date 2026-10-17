// Pilot 8 (18.5 s, drawn in code): why relationships feel heavy. Milo + his partner (a separate character).
// 1 park bench (easy) -> 2 kitchen, phones, the thread between them thins -> 3 Milo drags a sack of unsaid
// stones uphill -> 4 he puts it down and walks to her, the thread glows again -> 5 title.
const DUR = 18.5;
const INK = '#16161a';
const glw = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
function line(s, t, a, b, y = 120, size = 38, col = P.cream) {
  const op = Math.min(seg(t, a, a + 0.4), 1 - seg(t, b - 0.4, b));
  return op > 0 ? `<g opacity="${op}" transform="translate(0,${(1 - ease(seg(t, a, a + 0.4))) * 8 + Math.sin(t * 1.4 + y) * 1.5})">${txt(640, y, s, size, col, { weight: 700 })}</g>` : '';
}
function stars(t, n = 40) {
  let o = '';
  for (let i = 0; i < n; i++) o += `<circle cx="${(i * 211.7) % W}" cy="${(i * 97.3) % 330}" r="${1 + (i % 3) * 0.5}" fill="#dfe6ff" opacity="${0.15 + 0.35 * Math.abs(Math.sin(t * 1.2 + i))}"/>`;
  return o;
}
function motes(t, n, col, op, x0 = 200, y0 = 150, w = 880, h = 420) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const sx = (i * 97.13) % 1, sy = (i * 57.71) % 1;
    o += `<circle cx="${x0 + ((sx * w + t * (6 + (i % 5) * 3)) % w)}" cy="${y0 + ((sy * h - t * (4 + (i % 3) * 2) + h * 40) % h)}" r="${1.2 + (i % 3) * 0.7}" fill="${col}" opacity="${op * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i)))}"/>`;
  }
  return o;
}
const vign = () => `<defs><radialGradient id="vg8" cx="50%" cy="50%" r="72%"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.7"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#vg8)"/>`;

// His partner, Mia: a little person in the same chibi style as Milo (big round head, tiny body), but her own look —
// chestnut bob with bangs, a pink flower clip, a dusty-rose dress, lashes. Anchored like milo(): (x,y) = head centre.
// o: eyes (open|closed|happy|sad), mouth (smile|flat|sad), look, rot, pose (stand|sit|none), armL/armR or handL/handR, light.
function her(x, y, s, o = {}) {
  const skin = '#f7efe6', hair = '#4a2f2a', hairHi = '#6b453c', dress = '#d98ca0', dressSh = '#b8697f', look = o.look || 0;
  const pose = o.pose || 'stand';
  const limb = (x1, y1, x2, y2, col = skin) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="14" stroke-linecap="round"/>`;
  const arm = (side, ang, hand) => {
    const sx = side * 40, sy = 96;
    if (hand) return limb(sx, sy, hand[0], hand[1]);
    const a = (ang ?? 12) * Math.PI / 180;
    return limb(sx, sy, sx + side * Math.sin(a) * 40, sy + Math.cos(a) * 40);
  };
  let legs = '';
  if (pose === 'stand') legs = limb(-18, 160, -20, 190) + limb(18, 160, 20, 190);
  if (pose === 'sit') legs = `<ellipse cx="-22" cy="176" rx="17" ry="14" fill="${skin}" stroke="${INK}" stroke-width="5"/><ellipse cx="22" cy="176" rx="17" ry="14" fill="${skin}" stroke="${INK}" stroke-width="5"/>`;
  const body = pose === 'none' ? '' : `${pose === 'stand' ? legs : ''}<path d="M-34 78 L-58 168 Q0 180 58 168 L34 78 Q0 66 -34 78 Z" fill="${dress}" stroke="${INK}" stroke-width="5.5"/>
    <path d="M18 80 L44 166 Q52 164 58 168 L34 78 Z" fill="${dressSh}" opacity="0.7"/>${pose === 'sit' ? legs : ''}`;
  const ex = 30;
  let eyes;
  if (o.eyes === 'happy' || o.eyes === 'closed') eyes = `<path d="M${-ex - 11} -2 q11 ${o.eyes === 'happy' ? -14 : 9} 22 0 M${ex - 11} -2 q11 ${o.eyes === 'happy' ? -14 : 9} 22 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else {
    eyes = [-ex, ex].map(c => `<ellipse cx="${c + look}" cy="-2" rx="8" ry="11" fill="${INK}"/><circle cx="${c + look + 2.5}" cy="-6" r="2.6" fill="#fff"/>
      <path d="M${c + look + (c < 0 ? -9 : 9)} -11 l${c < 0 ? -6 : 6} -5" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
    if (o.eyes === 'sad') eyes += `<path d="M${-ex - 14 + look} -22 l20 -5 M${ex + 14 + look} -22 l-20 -5" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }
  const mouth = { smile: `<path d="M-11 26 q11 10 22 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    flat: `<path d="M-8 29 h16" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
    sad: `<path d="M-10 32 q10 -8 20 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>` }[o.mouth || 'smile'];
  // hair: back part (behind head), then the head, then bangs on top
  const hairBack = `<path d="M-98 10 Q-104 -96 0 -104 Q104 -96 98 10 Q100 70 74 84 L60 30 L-60 30 L-74 84 Q-100 70 -98 10 Z" fill="${hair}" stroke="${INK}" stroke-width="5.5"/>`;
  const bangs = `<path d="M-86 -14 Q-84 -90 0 -96 Q84 -90 86 -14 Q70 -46 40 -40 Q28 -60 6 -44 Q-16 -62 -34 -40 Q-62 -48 -86 -14 Z" fill="${hair}" stroke="${INK}" stroke-width="5"/>
    <path d="M-50 -76 Q-20 -90 20 -86" stroke="${hairHi}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  const flower = `<g transform="translate(60,-66)">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="0" cy="-9" rx="7" ry="10" fill="#ff9ec0" stroke="${INK}" stroke-width="3" transform="rotate(${i * 72})"/>`).join('')}<circle r="6" fill="${P.mustard}" stroke="${INK}" stroke-width="3"/></g>`;
  const tint = o.light ? `<g style="mix-blend-mode:${o.lightMode || 'screen'}" opacity="${o.lightOp ?? 0.3}"><circle r="90" fill="${o.light}"/></g>` : '';
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0}) scale(${s})">
    ${hairBack}${body}
    <circle r="88" fill="${skin}" stroke="${INK}" stroke-width="6"/>
    <ellipse cx="-52" cy="20" rx="14" ry="8.5" fill="#f2969a" opacity="0.75"/><ellipse cx="52" cy="20" rx="14" ry="8.5" fill="#f2969a" opacity="0.75"/>
    ${eyes}${mouth}${bangs}${flower}${tint}
    ${o.arms === false ? '' : arm(-1, o.armL, o.handL) + arm(1, o.armR, o.handR)}</g>`;
}
// Tiny idle float for objects (a couple of pixels), phase by id so things don't move in sync.
const fl = (t, id, amp = 2.5) => `translate(${Math.sin(t * 1.1 + id * 1.7) * amp * 0.4},${Math.sin(t * 1.6 + id * 2.3) * amp})`;

// The thread between two people: a glowing curve; tension 0 = loose and bright, 1 = taut and faint.
function thread(x1, y1, x2, y2, tension, t, broken = 0) {
  const sag = lerp(60, 0, tension), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag + Math.sin(t * 2) * 4 * (1 - tension);
  const col = mix('#ff8fb8', '#6a6f86', tension), w = lerp(5, 1.5, tension);
  if (broken > 0) {
    const g = broken * 40;
    return `<path d="M${x1} ${y1} Q${(x1 + mx) / 2} ${my} ${mx - g} ${my + g * 0.6}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
      <path d="M${x2} ${y2} Q${(x2 + mx) / 2} ${my} ${mx + g} ${my + g * 0.6}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  }
  return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="${col}" stroke-width="${w * 3}" fill="none" opacity="${0.25 * (1 - tension)}" filter="url(#glow)"/>
    <path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}
function heart(x, y, sc, col, op) {
  return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${op}"><path d="M0 10 C-22 -6 -14 -24 0 -12 C14 -24 22 -6 0 10 Z" fill="${col}"/></g>`;
}
// A stone with words on it.
function stone(x, y, w, label, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M${-w / 2} 10 Q${-w / 2 - 6} -18 ${-w / 4} -24 Q0 -32 ${w / 4} -26 Q${w / 2 + 8} -18 ${w / 2} 10 Q0 22 ${-w / 2} 10 Z" fill="#5d5a66" stroke="${INK}" stroke-width="4"/>
    ${txt(0, -2, label, 15, '#e8e4dc', { weight: 800 })}</g>`;
}

// ---------- scenes ----------
function park(t) {
  const lt = t;
  let s = `<defs><linearGradient id="sky8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="1" stop-color="#101629"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#sky8)"/>${stars(t)}`;
  s += `<path d="M0 470 L60 470 L60 420 L120 420 L120 450 L180 450 L180 390 L240 390 L240 440 L300 440 L300 470 L980 470 L980 430 L1040 430 L1040 400 L1100 400 L1100 445 L1180 445 L1180 410 L1280 410 L1280 520 L0 520 Z" fill="#0b1020"/>`;
  for (const [x, y] of [[80, 432], [196, 404], [1056, 414], [1196, 424]]) s += `<rect x="${x}" y="${y}" width="8" height="10" fill="#ffcf8a" opacity="0.5"/>`;
  s += `<rect y="520" width="${W}" height="200" fill="#0a0d16"/>`;
  // street lamp
  s += `<path d="M880 560 V250 q0 -30 -40 -30 h-20" stroke="#1d2233" stroke-width="10" fill="none"/><path d="M800 220 h50 l-10 18 h-30 Z" fill="#f6d29a"/>`;
  s += glw(825, 236, 80, '#ffcf8a', 0.55 + 0.05 * Math.sin(t * 6));
  s += `<path d="M806 238 L846 238 L1000 600 L600 600 Z" fill="#ffcf8a" opacity="0.08" style="mix-blend-mode:screen"/>`;
  s += `<ellipse cx="740" cy="600" rx="300" ry="40" fill="#ffcf8a" opacity="0.1" filter="url(#glow)"/>`;
  // bench
  s += `<rect x="470" y="470" width="420" height="22" rx="6" fill="#5a3d25" stroke="${INK}" stroke-width="4"/><rect x="470" y="410" width="420" height="16" rx="5" fill="#5a3d25" stroke="${INK}" stroke-width="4"/>
    <path d="M500 492 V590 M860 492 V590 M500 426 V470 M860 426 V470" stroke="#2c2018" stroke-width="10"/>`;
  // Milo and her, holding hands; small lean towards each other
  const lean = Math.sin(lt * 1.2) * 2;
  s += milo(590, 396, 0.62, { level: 1, t, pose: 'sit', eyes: 'happy', mouth: 'smile', rot: 5 + lean, armL: 12, handR: [108, 126], light: '#ffcf8a', lightMode: 'soft-light', lightOp: 0.5 });
  s += her(745, 396, 0.62, { pose: 'sit', eyes: lt > 1.5 ? 'happy' : undefined, mouth: 'smile', look: -6, rot: -5 - lean, armR: 12, handL: [-114, 126], light: '#ffcf8a', lightMode: 'soft-light', lightOp: 0.5 });
  s += `<circle cx="666" cy="475" r="9" fill="#e8e4f4" stroke="${INK}" stroke-width="3"/>`;
  for (let i = 0; i < 5; i++) {
    const p = ((lt * 0.35) + i / 5) % 1;
    s += heart(667 + Math.sin(p * 7 + i) * 30, 440 - p * 260, 0.7 + i % 2 * 0.3, '#ff8fb8', Math.sin(p * Math.PI) * 0.85);
  }
  s += motes(t, 24, '#ffe2a8', 0.35, 500, 200, 500, 380);
  return s + line('At first, it was easy.', t, 0.5, 3.8);
}

function kitchen(t) {
  const lt = t - 4;
  let s = `<defs><linearGradient id="k8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0e19"/><stop offset="1" stop-color="#070910"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#k8)"/><rect y="560" width="${W}" height="160" fill="#0c0a09"/><path d="M0 560 H${W}" stroke="#18130f" stroke-width="5"/>`;
  // window with rain-less night, hanging lamp turned off
  s += `<rect x="540" y="90" width="200" height="190" rx="6" fill="#0a0f22"/><path d="M640 90 V280 M540 185 H740" stroke="#05070e" stroke-width="7"/><rect x="540" y="90" width="200" height="190" rx="6" fill="none" stroke="#05070e" stroke-width="9"/>`;
  s += `<path d="M640 0 V60" stroke="#1a1d28" stroke-width="4"/><path d="M610 60 h60 l-12 22 h-36 Z" fill="#2a2830"/>`;
  // table
  s += `<rect x="330" y="460" width="620" height="22" rx="6" fill="#4a3220" stroke="${INK}" stroke-width="4"/><path d="M370 482 V560 M910 482 V560" stroke="#2c2018" stroke-width="14"/>`;
  // both on phones, blue glow on faces; the thread between them thins
  const tension = ease(seg(lt, 0.6, 3.6));
  s += milo(430, 418, 0.7, { level: lerp(0.85, 0.45, tension), t, pose: 'none', arms: false, lid: 0.3, mouth: 'flat', look: -6, rot: -4 });
  s += `<g transform="translate(470,440) ${fl(t, 1)} rotate(-12)"><rect x="-15" y="-26" width="30" height="50" rx="6" fill="#1b1c24" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-20" width="20" height="38" rx="3" fill="#9fd2ff"/></g>`;
  s += glw(450, 420, 90, '#5aa8ff', 0.28 + 0.06 * Math.sin(t * 5));
  s += her(850, 418, 0.7, { pose: 'none', mouth: 'flat', look: 8, rot: 4, arms: false, light: '#5aa8ff', lightOp: 0.15 });
  s += `<g transform="translate(805,440) ${fl(t, 2)} rotate(12)"><rect x="-15" y="-26" width="30" height="50" rx="6" fill="#1b1c24" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-20" width="20" height="38" rx="3" fill="#9fd2ff"/></g>`;
  s += glw(820, 420, 90, '#5aa8ff', 0.28 + 0.06 * Math.sin(t * 4.3));
  s += thread(475, 470, 800, 470, tension, t);
  // silence marks
  if (lt > 1.6) s += `<g opacity="${seg(lt, 1.6, 2.0) * (1 - seg(lt, 3.6, 4))}"><g transform="${fl(t, 3, 4)}">${txt(640, 380, '...', 54, '#6a6f86', { weight: 900 })}</g></g>`;
  return s + line('Then came the small silences.', t, 4.4, 7.8);
}

function uphill(t) {
  const lt = t - 8;
  let s = `<defs><linearGradient id="u8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06080f"/><stop offset="1" stop-color="#121729"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#u8)"/>${stars(t, 25)}`;
  s += `<path d="M0 640 L1280 380 L1280 720 L0 720 Z" fill="#0b0e18"/><path d="M0 640 L1280 380" stroke="#1d2338" stroke-width="5"/>`;
  // Milo walks uphill slowly, slower as the sack fills
  const fill = Math.min(3, Math.floor(seg(lt, 0.4, 3.4) * 3.99));
  const prog = lt * lerp(1, 0.45, seg(lt, 0, 4)) * 0.11;
  const x = lerp(380, 620, clamp(prog)), groundY = 640 - (x / 1280) * 260;
  const step = Math.sin(lt * 5) * 3;
  const tilt = 8 + fill * 5;
  const sackR = 46 + fill * 16;
  // the sack behind him (drawn first), with stones inside
  s += `<g transform="translate(${x - 70 - fill * 6},${groundY - 110 - fill * 6}) rotate(${-tilt * 0.6})">
    <ellipse rx="${sackR}" ry="${sackR * 0.9}" fill="#3a332c" stroke="${INK}" stroke-width="5"/><path d="M${-sackR * 0.4} ${-sackR * 0.8} q${sackR * 0.4} -20 ${sackR * 0.8} 0" stroke="${INK}" stroke-width="5" fill="none"/></g>`;
  s += `<path d="M${x - 40} ${groundY - 150} L${x - 60 - fill * 6} ${groundY - 150 - fill * 4}" stroke="#2a241e" stroke-width="7"/>`;
  s += milo(x, groundY - 172 * 0.75 + step, 0.75, { level: lerp(0.6, 0.08, seg(lt, 0.4, 3.6)), t, mouth: 'sad', lid: 0.4, bags: seg(lt, 1, 3), sweat: seg(lt, 1.8, 2.4), rot: tilt, armL: 160, armR: 140 });
  // stones falling into the sack, one by one, with words
  const labels = ['"I\'m fine"', '"whatever"', '"forget it"'];
  for (let i = 0; i < 3; i++) {
    const a = 0.4 + i * 1.0, p = seg(lt, a, a + 0.6);
    if (p <= 0) continue;
    const sx = x - 70, sy = lerp(100, groundY - 140, ease(p));
    if (p < 1) s += `<g transform="${fl(t, 4 + i, 3)}">${stone(sx + (i - 1) * 20, sy, 130, labels[i], (i - 1) * 8 + Math.sin(t * 3 + i) * 4)}</g>`;
    else s += `<g opacity="${1 - seg(lt, a + 0.6, a + 1.2)}">${txt(sx + 90, groundY - 230 - i * 30, '+1 kg', 22, P.red, { weight: 800 })}</g>`;
  }
  return s + line('Every "I\'m fine" adds weight.', t, 8.4, 11.8);
}

function together(t) {
  const lt = t - 12;
  let s = `<defs><linearGradient id="r8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#090c17"/><stop offset="1" stop-color="#05070d"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#r8)"/><rect y="560" width="${W}" height="160" fill="#0b0a0c"/><path d="M0 560 H${W}" stroke="#171319" stroke-width="5"/>`;
  // Milo drops the sack (left), walks to her (right); the thread re-lights as he gets closer
  const drop = seg(lt, 0.2, 0.7), walk = ease(seg(lt, 0.9, 2.6));
  const mx = lerp(330, 640, walk), bob = walk > 0 && walk < 1 ? Math.abs(Math.sin(lt * 9)) * 6 : 0;
  s += `<g transform="translate(${lerp(270, 230, drop)},${lerp(440, 520, ease(drop))})"><g transform="${drop >= 1 ? fl(t, 8, 1.5) : ''}"><ellipse rx="70" ry="60" fill="#3a332c" stroke="${INK}" stroke-width="5"/></g></g>`;
  if (drop > 0.9) s += `<g opacity="${1 - seg(lt, 0.8, 1.6)}">${txt(230, 430, 'put down', 22, P.dim, { weight: 700 })}</g>`;
  const reunite = seg(lt, 2.2, 3.2);
  s += milo(mx, 412 - bob, 0.75, { level: lerp(0.15, 0.95, ease(seg(lt, 1.2, 3.6))), t, pose: 'stand', mouth: lt > 2.6 ? 'smile' : 'flat',
    eyes: lt > 3.0 ? 'happy' : undefined, armL: 12, handR: reunite > 0 ? [lerp(40, 104, reunite), lerp(130, 92, reunite)] : undefined, light: '#ffcf8a', lightMode: 'soft-light', lightOp: 0.4 * reunite });
  s += her(820, 412, 0.75, { eyes: lt > 3.0 ? 'happy' : lt > 1.6 ? undefined : 'sad', mouth: lt > 2.8 ? 'smile' : 'sad', look: lt > 1.4 ? -10 : 6, rot: lt > 1.4 ? -4 : 6,
    handL: reunite > 0 ? [lerp(-50, -108, reunite), lerp(130, 92, reunite)] : undefined, light: '#ffcf8a', lightOp: 0.15 * reunite });
  s += thread(mx + 40, 500, 780, 500, lerp(0.95, 0.05, ease(seg(lt, 1.2, 3.4))), t, lt < 1.2 ? 1 : 0);
  s += glw(740, 450, 220, '#ffcf8a', 0.25 * reunite);
  if (lt > 3.1) for (let i = 0; i < 3; i++) {
    const p = seg(lt, 3.1 + i * 0.25, 4.4 + i * 0.25);
    s += heart(745 + (i - 1) * 30, 380 - p * 120, 0.9, '#ff8fb8', Math.sin(p * Math.PI));
  }
  s += motes(t, 20, '#ffe2a8', 0.3 * reunite, 500, 250, 500, 300);
  s += line('Love isn\'t heavy.', t, 12.3, 15.9, 110, 40);
  s += line('Unsaid things are.', t, 13.3, 15.9, 165, 40, P.mustard);
  return s;
}

function title(t) {
  const p1 = back(seg(t, 16.05, 16.4)), p2 = back(seg(t, 16.35, 16.7));
  let s = `<rect width="${W}" height="${H}" fill="#06070b"/>` + glw(640, 340, 300, '#ff8fb8', 0.06);
  s += `<g transform="translate(640,310) ${fl(t, 9, 2)} scale(${p1})">${txt(0, 0, 'WHY RELATIONSHIPS', 76, P.cream)}${txt(0, 84, 'FEEL SO HEAVY', 76, P.cream)}</g>`;
  s += `<g transform="translate(640,500) scale(${p2})"><rect x="-260" y="-46" width="520" height="70" rx="12" fill="${P.mustard}"/>${txt(0, 4, '(and how to lighten them)', 34, '#1a1a1a')}</g>`;
  return s;
}

function render(t) {
  let s = t < 4 ? park(t) : t < 8 ? kitchen(t) : t < 12 ? uphill(t) : t < 16 ? together(t) : title(t);
  s += vign();
  const cut = [4, 8, 12, 16].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.25)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(cut, 1 - seg(t, 0, 0.6), seg(t, 17.9, 18.5))), t, '#000');
}
