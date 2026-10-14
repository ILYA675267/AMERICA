// Pilot 1: "I Tried the 5 AM Club (It Went Horribly)". Accent: amber.
const ACC = '#FFB800';

function bedroom(t, clockText, ringing, smashed) {
  const shake = ringing ? Math.sin(t * 70) * 7 : 0;
  const sq = smashed ? 0.55 : 1;
  return `
    <rect x="1010" y="90" width="150" height="150" fill="#1d1f2e" stroke="#3a3d55" stroke-width="6"/>
    <path d="M1085 90 v150 M1010 165 h150" stroke="#3a3d55" stroke-width="6"/>
    <circle cx="1125" cy="128" r="18" fill="#e9e6d8"/>
    <path d="M1010 240 L900 620 L1300 620 L1300 240 Z" fill="#fff" opacity="0.025"/>
    <line x1="0" y1="600" x2="${W}" y2="600" stroke="#2a2a2a" stroke-width="4"/>
    <g transform="translate(${215 + shake},470)">
      <rect x="-70" y="40" width="140" height="90" rx="8" fill="#1c1c1c" stroke="#333" stroke-width="5"/>
      <g transform="translate(0,${smashed ? 22 : 0}) scale(1,${sq})">
        <rect x="-62" y="-50" width="124" height="70" rx="10" fill="#1a1a1a" stroke="${ringing ? '#ff3b3b' : '#444'}" stroke-width="5"/>
        ${txt(0, 0, clockText, 40, smashed ? '#552222' : '#ff3b3b', { font: 'DejaVu Sans Mono', weight: 700 })}
      </g>
      ${ringing ? `<path d="M-95 -60 l-20 -20 M95 -60 l20 -20 M-100 -20 h-26 M100 -20 h26" stroke="#ff3b3b" stroke-width="6" stroke-linecap="round" opacity="${0.5 + 0.5 * Math.sin(t * 40)}"/>` : ''}
    </g>
    <rect x="330" y="500" width="700" height="100" rx="14" fill="#262626" stroke="#333" stroke-width="5"/>
    <rect x="350" y="440" width="150" height="70" rx="30" fill="#d9d6cc" stroke="${OUT}" stroke-width="5"/>`;
}

function render(t) {
  let s = '';
  if (t < 4.2) {
    const ringing = t > 0.3 && t < 2.35;
    const smashed = t >= 2.4;
    s += bedroom(t, '5:00', ringing, smashed);
    // sleeping guy, head on pillow
    s += bean(430, 420, 0.62, { eyes: 'closed', mouth: t > 2.6 ? 'smile' : 'sad', body: false, rot: -8 });
    s += `<rect x="470" y="440" width="540" height="90" rx="30" fill="#2b2d45" stroke="${OUT}" stroke-width="5"/>`;
    // arm slamming the alarm
    const ap = ease(seg(t, 2.15, 2.4)), back_ = seg(t, 2.9, 3.3);
    if (t > 2.1 && t < 3.3) {
      const ex = lerp(470, 225, ap * (1 - back_)), ey = lerp(470, 425, ap * (1 - back_));
      s += `<path d="M470 470 L${ex} ${ey}" stroke="${OUT}" stroke-width="40" stroke-linecap="round"/>
            <path d="M470 470 L${ex} ${ey}" stroke="#f2efe6" stroke-width="30" stroke-linecap="round"/>`;
      if (t > 2.38 && t < 2.6) s += txt(215, 360, 'SMASH', 60, ACC, { op: 1 - seg(t, 2.45, 2.6) });
    }
    if (t > 2.9) s += zzz(470, 360, t, ACC);
    s += txt(60, 60, 'DAY 1', 26, '#777', { anchor: 'start', weight: 700 });
    if (t < 2.2) s += txt(640, 120, typed('New plan: wake up at 5 AM.', t, 0.2, 1.3), 40, '#fff', { weight: 500 });
    else s += txt(640, 120, typed('just 5 more minutes...', t, 2.6, 3.4), 42, ACC, { weight: 600 });
  } else if (t < 6.0) {
    // panic wake-up at 11:47
    const p = back(seg(t, 4.35, 4.7));
    s += bedroom(t, '11:47', false, false);
    s += `<rect x="470" y="440" width="540" height="90" rx="30" fill="#2b2d45" stroke="${OUT}" stroke-width="5"/>`;
    const y = lerp(420, 300, p);
    s += bean(lerp(430, 520, p), y, 0.62, { eyes: t > 4.35 ? 'wide' : 'closed', mouth: t > 4.35 ? 'scream' : 'smile', body: t > 4.35, rot: lerp(-8, 0, p) });
    if (t > 4.4) s += txt(650, 230, '!', 120, ACC, { op: 1 });
    s += txt(60, 60, 'DAY 1', 26, '#777', { anchor: 'start', weight: 700 });
    s += txt(640, 120, typed('...it was 11:47.', t, 4.4, 5.0), 42, '#fff', { weight: 500 });
  } else if (t < 8.2) {
    // DAY 3: asleep on the desk
    const p = back(seg(t, 6.0, 6.35));
    s += `<line x1="0" y1="560" x2="${W}" y2="560" stroke="#2a2a2a" stroke-width="4"/>
      <rect x="380" y="470" width="620" height="24" fill="#3a3a3a" stroke="${OUT}" stroke-width="5"/>
      <rect x="420" y="494" width="20" height="66" fill="#3a3a3a"/><rect x="940" y="494" width="20" height="66" fill="#3a3a3a"/>
      <path d="M760 470 l40 -140 h180 l-40 140 z" fill="#2c2c2c" stroke="${OUT}" stroke-width="5"/>
      <path d="M800 330 h180 l-40 140" fill="none" stroke="#8fb3ff" stroke-width="3" opacity="0.4"/>`;
    s += bean(600, 410, 0.6, { eyes: 'closed', mouth: 'open', body: false, rot: 80 });
    s += `<path d="M640 455 q4 26 -2 40" stroke="#8fd3ff" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    s += zzz(650, 330, t, ACC);
    s += `<g transform="translate(240,150) scale(${p})"><rect x="-170" y="-60" width="340" height="110" fill="${ACC}"/>
      ${txt(0, 25, 'DAY 3...', 72, '#141414')}</g>`;
    s += txt(640, 660, '(the 5 AM club was not going well)', 30, '#888', { weight: 500 });
  } else {
    // Title card
    const p1 = back(seg(t, 8.2, 8.55)), p2 = back(seg(t, 8.55, 8.9));
    s += `<g transform="translate(470,300) scale(${p1})">${txt(0, -20, 'I TRIED THE', 64, '#fff')}${txt(0, 90, '5 AM CLUB', 110, '#fff')}</g>`;
    s += `<g transform="translate(470,470) scale(${p2})"><rect x="-300" y="-60" width="600" height="96" fill="${ACC}"/>${txt(0, 12, '(it went horribly)', 56, '#141414')}</g>`;
    s += bean(1010, 360, 0.75, { eyes: 'sleepy', mouth: 'sad', rot: Math.sin(t * 3) * 4 });
    s += zzz(1080, 250, t, ACC);
  }
  // quick cuts with black flashes
  const cut = [4.2, 6.0, 8.2].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.08)).reduce((a, b) => Math.max(a, b), 0);
  return frame(s + fade(Math.max(cut, 1 - seg(t, 0, 0.25), seg(t, 9.7, 10))), '#121212');
}
