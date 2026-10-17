// Pilot 7 (10 s, drawn in code): Milo tries to study -> "HEADQUARTERS" in his head: Manager holds TASK: STUDY,
// Dopamine bursts in with confetti -> Milo picks up the phone, "Just checking one thing...", time flies, sprout wilts.
const DUR = 10;
const INK = '#16161a';
const glw = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
const tag = (x, y, s, bg, fg = '#fff', size = 22) => {
  const w = s.length * size * 0.68 + 26;
  return `<g transform="translate(${x},${y})"><rect x="${-w / 2}" y="${-size + 2}" width="${w}" height="${size + 14}" rx="6" fill="${bg}"/>${txt(0, 6, s, size, fg, { weight: 900, ls: 1.5 })}</g>`;
};
function line(s, t, a, b, y = 668, size = 36) {
  const op = Math.min(seg(t, a, a + 0.35), 1 - seg(t, b - 0.3, b));
  return op > 0 ? `<g opacity="${op}">${txt(640, y, s, size, P.cream, { weight: 700 })}</g>` : '';
}
function motes(t, n, col, op) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const sx = (i * 97.13) % 1, sy = (i * 57.71) % 1;
    o += `<circle cx="${200 + ((sx * 880 + t * (6 + (i % 5) * 3)) % 880)}" cy="${120 + ((sy * 460 - t * (4 + (i % 3) * 2) + 4600) % 460)}" r="${1.2 + (i % 3) * 0.7}" fill="${col}" opacity="${op * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i)))}"/>`;
  }
  return o;
}

// A "brain worker": rounded bean body + round head, flat colour, simple face, optional tie / party hat.
function worker(x, y, s, o) {
  const col = o.col, sh = o.shade;
  const eyes = o.eyes === 'wide'
    ? `<circle cx="-18" cy="-8" r="11" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="18" cy="-8" r="11" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-18" cy="-7" r="4.5" fill="${INK}"/><circle cx="18" cy="-7" r="4.5" fill="${INK}"/>`
    : o.eyes === 'happy' ? `<path d="M-27 -6 q9 -11 18 0 M9 -6 q9 -11 18 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      : `<circle cx="-17" cy="-8" r="5" fill="${INK}"/><circle cx="17" cy="-8" r="5" fill="${INK}"/>`;
  const mouth = o.mouth === 'o' ? `<ellipse cx="0" cy="16" rx="7" ry="9" fill="${INK}"/>`
    : o.mouth === 'grin' ? `<path d="M-18 8 q18 24 36 0 z" fill="${INK}"/>` : `<path d="M-14 10 q14 12 28 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const tie = o.tie ? `<path d="M0 58 l-9 10 l9 38 l9 -38 z" fill="#2f6fe0" stroke="${INK}" stroke-width="3"/>` : '';
  const hat = o.hat ? `<path d="M-6 -50 L14 -102 L30 -46 Z" fill="${P.mustard}" stroke="${INK}" stroke-width="4" transform="rotate(12)"/><circle cx="35" cy="-96" r="6" fill="${P.green}"/>` : '';
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0}) scale(${s})">
    <path d="M-40 50 Q-48 150 -30 160 L30 160 Q48 150 40 50 Q0 38 -40 50 Z" fill="${col}"/><path d="M14 52 Q40 60 40 150 L30 160 L12 160 Q34 120 14 52 Z" fill="${sh}" opacity="0.6"/>
    ${tie}<circle r="52" fill="${col}"/><path d="M30 -40 A52 52 0 0 1 30 40 A60 60 0 0 0 30 -40 Z" fill="${sh}" opacity="0.5"/>
    ${eyes}${mouth}${hat}</g>`;
}

// Milo's room in our style (navy walls, bookshelf, moon window, warm lamp beam, wood floor).
function deskRoom(t, lampOn = 1, redGlow = 0) {
  let s = `<defs><linearGradient id="nw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1322"/><stop offset="1" stop-color="#080b15"/></linearGradient>
    <linearGradient id="beam" x1="0.6" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity="${0.28 * lampOn}"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#nw)"/><rect y="560" width="${W}" height="160" fill="#140e09"/><path d="M0 560 H${W}" stroke="#1f160f" stroke-width="5"/>`;
  // bookshelf (soft, out of focus)
  s += `<g opacity="0.35"><rect x="60" y="120" width="190" height="440" rx="6" fill="#161c2e" stroke="#202840" stroke-width="6"/>`;
  for (let r = 0; r < 4; r++) {
    s += `<path d="M66 ${220 + r * 100} H244" stroke="#202840" stroke-width="6"/>`;
    for (let b = 0; b < 6; b++) s += `<rect x="${80 + b * 26}" y="${150 + r * 100 + (b % 3) * 8}" width="18" height="${62 - (b % 3) * 8}" rx="2" fill="${['#2b3350', '#33293f', '#24334a'][b % 3]}"/>`;
  }
  s += `</g>`;
  // window with moon and a few stars
  s += `<rect x="960" y="110" width="210" height="220" rx="8" fill="#0a0f22"/><circle cx="1120" cy="160" r="22" fill="#e6ecff" opacity="0.85"/><circle cx="1130" cy="153" r="19" fill="#0a0f22"/>
    ${[[990, 140], [1040, 270], [1010, 220], [1150, 290]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff" opacity="${0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))}"/>`).join('')}
    <rect x="960" y="110" width="210" height="220" rx="8" fill="none" stroke="#0a0e1c" stroke-width="10"/><path d="M1065 110 V330 M960 220 H1170" stroke="#0a0e1c" stroke-width="7"/>`;
  // warm lamp beam onto the desk
  s += `<path d="M850 300 L905 300 L1000 560 L620 560 Z" fill="url(#beam)" style="mix-blend-mode:screen"/>`;
  if (redGlow) s += glw(560, 380, 220, '#ff4a6a', redGlow);
  return s;
}
// desk, laptop and lamp drawn in front of Milo's body
function deskFront(t, label = 'STUDY.docx', lampOn = 1) {
  return `<rect x="380" y="440" width="560" height="24" rx="6" fill="#6b4a2e" stroke="${INK}" stroke-width="5"/><rect x="380" y="458" width="560" height="10" fill="#4e3520"/>
    <path d="M420 468 V560 M900 468 V560" stroke="#4e3520" stroke-width="16"/>
    <rect x="400" y="466" width="520" height="70" rx="4" fill="#5a3d25" stroke="${INK}" stroke-width="4"/><path d="M420 500 H900" stroke="#4e3520" stroke-width="3"/>
    <path d="M660 438 L700 330 L840 330 L812 438 Z" fill="#2a2e3a" stroke="${INK}" stroke-width="5"/>${label ? txt(755, 392, label, 18, '#9fc6ff', { weight: 700 }) : ''}
    <path d="M905 438 L890 330 L862 300" stroke="#3a3540" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="905" cy="440" rx="34" ry="8" fill="#3a3540"/>
    <path d="M832 300 L892 300 L874 268 L850 268 Z" fill="${mix('#4a4450', '#f6d29a', lampOn)}" stroke="${INK}" stroke-width="4"/>` + glw(862, 304, 60, '#ffcf8a', 0.55 * lampOn);
}

function hqRoom_unused(t, red = 0) {
  let s = `<rect width="${W}" height="${H}" fill="${mix('#271d3c', '#4a1424', red)}"/>`;
  for (let i = 0; i < 9; i++) {  // brain folds on the wall
    const x = 70 + i * 140, sw = Math.sin(t * 0.8 + i) * 6;
    s += `<path d="M${x} 70 q-30 40 0 80 q30 40 0 80" stroke="${mix('#6a2a6e', '#a0304f', red)}" stroke-width="5" fill="none" opacity="0.7" transform="translate(${sw},0)"/>`;
  }
  s += `<rect y="560" width="${W}" height="160" fill="${mix('#211833', '#3a1020', red)}"/><path d="M0 560 H${W}" stroke="#c0407a" stroke-width="4"/>`;
  return s + tag(150, 70, 'HEADQUARTERS', '#1a1226', '#ff5aa5', 24);
}

// FOCUS: a living desk lamp (our warm-light signature). Face on the shade; light dims when it is scared.
function lampGuy(x, y, s, o = {}) {
  const tilt = o.tilt || 0, on = o.on ?? 1;
  const eyes = o.shock
    ? `<circle cx="-14" cy="-26" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="14" cy="-26" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="-14" cy="-25" r="3.5" fill="${INK}"/><circle cx="14" cy="-25" r="3.5" fill="${INK}"/><ellipse cx="0" cy="-10" rx="5" ry="6" fill="${INK}"/>`
    : `<path d="M-20 -26 q6 -7 12 0 M8 -26 q6 -7 12 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-8 -14 q8 7 16 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cx="0" cy="150" rx="56" ry="13" fill="#3a3540" stroke="${INK}" stroke-width="4"/>
    <path d="M0 146 L-24 70 L18 4" stroke="#3a3540" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-24" cy="70" r="9" fill="#4a4450" stroke="${INK}" stroke-width="3"/>
    <g transform="translate(18,4) rotate(${tilt})">
      <path d="M-58 4 L58 4 L34 -56 L-34 -56 Z" fill="${mix('#6a6070', '#f6d29a', on)}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      ${eyes}<ellipse cx="0" cy="6" rx="34" ry="8" fill="${mix('#2a2630', '#fff6d8', on)}"/></g>
    <path d="M-30 12 L66 12 L110 160 L-80 160 Z" fill="#ffcf8a" opacity="${0.18 * on}" style="mix-blend-mode:screen"/></g>`;
}
// DOPAMINE: a pink sparkly jelly blob.
function jelly(x, y, s, t) {
  const wob = Math.sin(t * 9) * 0.06;
  return `<g transform="translate(${x},${y}) scale(${s * (1 + wob)},${s * (1 - wob)})">
    <path d="M-62 150 Q-74 40 -32 0 Q0 -32 32 0 Q74 40 62 150 Q0 162 -62 150 Z" fill="#ff5fb0" opacity="0.94" stroke="#c4307e" stroke-width="4"/>
    <path d="M-34 14 Q-44 54 -38 96" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.45"/>
    <circle cx="26" cy="110" r="6" fill="#fff" opacity="0.35"/><circle cx="-12" cy="128" r="4" fill="#fff" opacity="0.35"/>
    <path d="M-26 52 q9 -11 18 0 M8 52 q9 -11 18 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-16 72 q16 20 32 0 z" fill="${INK}"/></g>`;
}

// Inside Milo's head: a dark dome seen from inside, two round eye-windows looking out at the laptop.
function headRoom(t, lt) {
  let s = `<defs><radialGradient id="dome" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#111729"/><stop offset="1" stop-color="#05070e"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#dome)"/>`;
  // curved ribs of the dome
  for (let i = 1; i <= 3; i++) s += `<ellipse cx="640" cy="560" rx="${200 + i * 170}" ry="${150 + i * 140}" fill="none" stroke="#161d33" stroke-width="4" opacity="0.8"/>`;
  // eye windows with the outside view (warm room, laptop glow)
  for (const x of [520, 760]) {
    s += `<circle cx="${x}" cy="300" r="74" fill="#2a2030"/><circle cx="${x}" cy="300" r="74" fill="url(#eyeview)"/>
      <rect x="${x - 34}" y="${292}" width="68" height="40" rx="4" fill="#9fc6ff" opacity="0.5"/>
      <circle cx="${x}" cy="300" r="74" fill="none" stroke="#2c3656" stroke-width="12"/>`;
  }
  s = s.replace('<rect width', `<defs><radialGradient id="eyeview" cx="40%" cy="40%"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.55"/><stop offset="1" stop-color="#3a2a30" stop-opacity="0.2"/></radialGradient></defs><rect width`);
  s += `<rect y="560" width="${W}" height="160" fill="#080b16"/><path d="M0 560 H${W}" stroke="#1d2540" stroke-width="4"/>`;
  s += `<g transform="translate(70,58)"><rect x="0" y="-26" width="300" height="40" rx="8" fill="#0b0f1d" stroke="#2c3656" stroke-width="3"/>${txt(150, 3, "INSIDE MILO'S HEAD", 20, P.green, { weight: 900, ls: 1.5 })}</g>`;
  return s;
}

function render(t) {
  let s = '';
  if (t < 2.6) {  // 1. Milo at the desk, laptop: STUDY.docx
    s += deskRoom(t);
    s += milo(560, 398, 0.85, { level: 1, t, mouth: 'flat', look: 16, pose: 'stand', armL: 30, armR: 30, light: '#ffcf8a', lightMode: 'soft-light', lightOp: 0.4 });
    s += deskFront(t);
    s += txt(70, 70, '7:00', 30, P.dim, { anchor: 'start', weight: 700, font: 'DejaVu Sans Mono' });
    s += line('He just had to study. For one hour.', t, 0.3, 2.5, 140);
    s += motes(t, 24, '#ffe2a8', 0.35);
  } else if (t < 5.6) {  // 2. INSIDE MILO'S HEAD: Focus holds the task, Dopamine pops out of a floor hatch
    const lt = t - 2.6, open = ease(seg(lt, 1.1, 1.4)), shock = lt > 1.35;
    s += headRoom(t, lt);
    // FOCUS: the living lamp, shining on today's task; it flinches and dims when Dopamine pops up
    const fx = 440, fy = 362;
    s += lampGuy(fx, fy, 1.28, { shock, tilt: shock ? -18 : Math.sin(t * 1.5) * 3, on: shock ? lerp(1, 0.35, seg(lt, 1.35, 2.2)) : 1 });
    s += tag(fx + 23, fy - 110, 'FOCUS', P.mustard, '#1a1a1a');
    if (!shock || lt < 1.7) s += `<g transform="translate(${fx + 140},${fy + 150}) rotate(${shock ? 30 : 4}) translate(0,${shock ? -50 * seg(lt, 1.35, 1.7) : 0})" opacity="${1 - seg(lt, 1.5, 1.7)}">
      <rect x="-40" y="-52" width="80" height="96" rx="6" fill="#f1ede4" stroke="${INK}" stroke-width="4"/>${txt(0, -18, 'TODAY:', 16, INK)}${txt(0, 12, 'STUDY', 22, P.green)}
      <path d="M-26 26 h52" stroke="#bbb" stroke-width="3"/></g>`;
    // floor hatch opens, Dopamine jelly springs out with sparkles
    s += `<ellipse cx="870" cy="560" rx="${90}" ry="18" fill="#05070f"/>`;
    s += `<g transform="translate(870,560) scale(1,${1 - open})"><ellipse rx="90" ry="18" fill="#3a3355" stroke="#4d4670" stroke-width="4"/></g>`;
    if (lt > 1.2) {
      // DOPAMINE: pink jelly springing out of the hatch
      const k = back(seg(lt, 1.2, 1.7)), hop = lt > 1.8 ? Math.abs(Math.sin(lt * 7)) * 12 : 0;
      const dy = lerp(580, 400, k) - hop;
      s += `<defs><clipPath id="abovefloor"><rect x="0" y="0" width="${W}" height="562"/></clipPath></defs><g clip-path="url(#abovefloor)">${jelly(870, dy, 1, lt)}</g>`;
      s += glw(870, dy + 70, 120, '#ff5fb0', 0.3);
      s += tag(870, dy - 30, 'DOPAMINE', '#ff5fb0');
      for (let i = 0; i < 30; i++) {  // sparkles
        const a = i * 2.39, p = seg(lt, 1.25 + (i % 4) * 0.06, 2.9), d = ease(p) * (90 + (i % 6) * 35);
        const x = 870 + Math.cos(a) * d, y = 470 + Math.sin(a) * d * 0.8 - p * 60, r = 5 * (1 - p);
        s += `<path d="M${x} ${y - r * 2} L${x + r * 0.6} ${y} L${x} ${y + r * 2} L${x - r * 0.6} ${y} Z" fill="${['#ffd45e', '#ff9ad0', '#9fe8ff'][i % 3]}" opacity="${1 - p}"/>`;
      }
      if (lt > 1.9) s += `<g opacity="${seg(lt, 1.9, 2.1)}" transform="translate(870,150) scale(${back(seg(lt, 1.9, 2.2))})">
        <rect x="-150" y="-34" width="300" height="60" rx="30" fill="#f1ede4" stroke="${INK}" stroke-width="4"/>${txt(0, 7, '1 NEW VIDEO!', 28, '#e0408f', { weight: 900 })}</g>`;
    }
    // the energy bulb on the sprout root dims when Dopamine shows up
    s += `<g transform="translate(640,0)"><path d="M0 0 Q-10 60 6 110 Q14 140 0 165" stroke="#7a5a3a" stroke-width="7" fill="none"/>
      <circle cx="0" cy="178" r="18" fill="${mix('#7cf0a0', '#4a6a50', seg(lt, 1.4, 2.6))}"/></g>` + glw(640, 178, 50, '#7cf0a0', lerp(0.6, 0.15, seg(lt, 1.4, 2.6)));
  } else if (t < 8.4) {  // 3. Milo grabs the phone; time jumps, sprout wilts
    const lt = t - 5.6;
    const times = ['7:02', '8:13', '9:34'], idx = Math.min(2, Math.floor(lt / 0.95));
    const lvl = lerp(0.9, 0.12, ease(seg(lt, 0.4, 2.6)));
    s += deskRoom(t, 0.35, 0.10 + 0.04 * Math.sin(t * 6));
    s += milo(560, 398, 0.85, { level: lvl, t, look: 22, eyes: lt > 0.4 ? 'wide' : undefined, mouth: 'flat', lid: 0, bags: seg(lt, 1.5, 2.6), pose: 'stand', armL: 25, handR: [118, -6] });
    s += `<g transform="translate(668,330) rotate(-8)"><rect x="-17" y="-30" width="34" height="58" rx="7" fill="#1b1c24" stroke="${INK}" stroke-width="4"/><rect x="-12" y="-24" width="24" height="44" rx="3" fill="${['#ff6a8a', '#7ac0ff', '#ffd45e'][Math.floor(lt * 3) % 3]}"/></g>`;
    s += glw(668, 330, 50, '#ff8aa0', 0.5);
    for (let i = 0; i < 3; i++) {  // icons popping from the phone
      const p = ((lt * 0.9) + i / 3) % 1;
      s += `<g opacity="${Math.sin(p * Math.PI)}" transform="translate(${700 + i * 30 + p * 60},${300 - p * 120})"><circle r="18" fill="#1d1d22" stroke="#33333b" stroke-width="3"/>${i === 1
        ? `<path d="M-9 4 Q-9 -10 0 -10 Q9 -10 9 4 Z" fill="${P.mustard}"/>` : `<path d="M0 7 C-15 -4 -9 -16 0 -8 C9 -16 15 -4 0 7 Z" fill="${P.red}"/>`}</g>`;
    }
    s += deskFront(t, '', 0.35);
    const tick = 1 + 0.25 * Math.max(0, 1 - ((lt % 0.95) / 0.25));
    s += `<g transform="translate(70,70) scale(${tick})">${txt(0, 0, times[idx], 30, idx ? P.red : P.dim, { anchor: 'start', weight: 700, font: 'DejaVu Sans Mono' })}</g>`;
    s += line('Just checking one thing...', t, 5.8, 8.3, 140);
  } else {  // 4. title
    const p1 = back(seg(t, 8.45, 8.8)), p2 = back(seg(t, 8.75, 9.1));
    s += `<rect width="${W}" height="${H}" fill="#0c0c10"/>` + glw(640, 340, 280, '#ffb35c', 0.07);
    s += `<g transform="translate(640,320) scale(${p1})">${txt(0, 0, 'WHY YOU CAN\'T FOCUS', 84, P.cream)}</g>`;
    s += `<g transform="translate(640,430) scale(${p2})"><rect x="-235" y="-50" width="470" height="78" rx="12" fill="${P.mustard}"/>${txt(0, 6, '(it\'s not laziness)', 44, '#1a1a1a')}</g>`;
  }
  s += `<defs><radialGradient id="vg7" cx="50%" cy="48%" r="72%"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.65"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#vg7)"/>`;
  const cut = [2.6, 5.6, 8.4].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.12)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(cut, 1 - seg(t, 0, 0.4), seg(t, 9.6, 10))), t, '#000');
}
