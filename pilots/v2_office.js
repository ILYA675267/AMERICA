// Pilot 2: "Office in your head" — what your brain does when you procrastinate. Accents: pink + blue.
const PINK = '#FF4FA3', BLUE = '#4A7CFF', ORANGE = '#FF8A3D';

function room(t) {
  return `<line x1="0" y1="600" x2="${W}" y2="600" stroke="#2a2a2a" stroke-width="4"/>
    <rect x="420" y="500" width="520" height="24" fill="#3a3a3a" stroke="${OUT}" stroke-width="5"/>
    <rect x="460" y="524" width="20" height="76" fill="#3a3a3a"/><rect x="880" y="524" width="20" height="76" fill="#3a3a3a"/>
    <path d="M700 500 l30 -130 h190 l-30 130 z" fill="#2c2c2c" stroke="${OUT}" stroke-width="5"/>
    ${txt(812, 445, 'STUDY.docx', 20, '#8fb3ff', { weight: 600 })}`;
}

function office(t, flash) {
  // inside the head: brain-folds wall, desk, door
  let folds = '';
  for (let i = 0; i < 7; i++) folds += `<path d="M${80 + i * 180} 40 q40 50 0 100 q-40 50 0 100" stroke="${PINK}" stroke-width="5" fill="none" opacity="0.18"/>`;
  return `<rect width="${W}" height="${H}" fill="${flash ? '#4a1020' : '#241a36'}"/>${folds}
    <line x1="0" y1="610" x2="${W}" y2="610" stroke="${PINK}" stroke-width="5" opacity="0.5"/>
    <rect x="300" y="470" width="420" height="26" fill="#5a4a7a" stroke="${OUT}" stroke-width="5"/>
    <rect x="330" y="496" width="22" height="114" fill="#5a4a7a"/><rect x="668" y="496" width="22" height="114" fill="#5a4a7a"/>
    <rect x="40" y="40" width="300" height="56" rx="10" fill="#000" opacity="0.35"/>
    ${txt(190, 78, 'HEADQUARTERS', 28, PINK, { ls: 3 })}`;
}

function door(open) {
  const a = open * 75;
  return `<rect x="1020" y="250" width="170" height="360" fill="#120c1c" stroke="${OUT}" stroke-width="6"/>
    <g transform="translate(1020,250) skewY(${-a * 0.25}) scale(${1 - open * 0.75},1)">
      <rect width="170" height="360" fill="#7a5aa8" stroke="${OUT}" stroke-width="6"/><circle cx="145" cy="190" r="10" fill="${OUT}"/></g>`;
}

function tag(x, y, label, col) {
  return `<rect x="${x - label.length * 10 - 14}" y="${y - 30}" width="${label.length * 20 + 28}" height="42" rx="8" fill="${col}"/>${txt(x, y, label, 26, '#111')}`;
}

function confetti(t, t0) {
  let out = '';
  const cols = [PINK, '#FFD23F', '#3DDC84', BLUE];
  for (let i = 0; i < 40; i++) {
    const age = t - t0; if (age < 0) break;
    const ang = (i * 137.5) % 360 * Math.PI / 180, sp = 300 + (i * 53) % 400;
    const x = 1060 + Math.cos(ang) * sp * age, y = 380 + Math.sin(ang) * sp * age + 500 * age * age;
    out += `<rect x="${x}" y="${y}" width="14" height="8" fill="${cols[i % 4]}" transform="rotate(${i * 40 + age * 600} ${x} ${y})"/>`;
  }
  return out;
}

function render(t) {
  let s = '';
  if (t < 2.2) {
    // Outside: guy at desk, then zoom into his head
    const z = ease(seg(t, 1.3, 2.2)), sc = lerp(1, 9, z);
    s += `<g transform="translate(560,380) scale(${sc}) translate(-560,-380)">${room(t)}
      ${bean(560, 380, 0.7, { eyes: 'sleepy', mouth: 'flat', look: 12 })}</g>`;
    s += txt(640, 120, typed('He just had to study. For one hour.', t, 0.1, 1.1), 40, '#fff', { weight: 500, op: 1 - z });
    s += fade(seg(t, 1.9, 2.2));
  } else if (t < 4.6) {
    s += office(t, false) + door(0);
    s += bean(510, 330, 0.85, { color: '#e8eefc', eyes: 'open', mouth: 'smile', tie: BLUE });
    s += `<g transform="translate(600,420) rotate(-8)"><rect width="110" height="140" fill="#fff" stroke="${OUT}" stroke-width="4"/>
      ${txt(55, 40, 'TASK:', 22, '#111')}${txt(55, 75, 'STUDY', 26, BLUE)}</g>`;
    s += tag(510, 190, 'MANAGER', BLUE);
    const b = back(seg(t, 2.6, 2.9));
    s += bubble(830, 150, 500, 110, [-150, -30], txt(0, 12, typed('Okay team. One hour. Focus.', t, 2.8, 3.8), 30, '#111', { weight: 700 }), { sc: b });
    s += fade(1 - seg(t, 2.2, 2.45));
  } else if (t < 7.0) {
    // Dopamine bursts in with confetti
    const open = ease(seg(t, 4.6, 4.8));
    const flash = t > 6.95;
    s += office(t, flash) + door(open);
    s += bean(510, 330, 0.85, { color: '#e8eefc', eyes: t > 4.9 ? 'wide' : 'open', mouth: t > 4.9 ? 'open' : 'smile', tie: BLUE,
      extra: t > 5.2 ? `<path d="M88 -70 q14 24 0 34 q-14 -10 0 -34z" fill="#8fd3ff" stroke="${OUT}" stroke-width="3"/>` : '' });
    s += tag(510, 190, 'MANAGER', BLUE);
    const dx = lerp(1110, 880, back(seg(t, 4.7, 5.05)));
    const hop = Math.abs(Math.sin(t * 9)) * 25;
    s += bean(dx, 330 - hop, 0.85, { color: PINK, eyes: 'happy', mouth: 'grin', rot: Math.sin(t * 9) * 8,
      hat: `<path d="M-40 -88 L0 -190 L40 -88 Z" fill="#FFD23F" stroke="${OUT}" stroke-width="5"/><circle cx="0" cy="-192" r="12" fill="#3DDC84" stroke="${OUT}" stroke-width="4"/>` });
    s += tag(dx, 120, 'DOPAMINE', PINK);
    s += confetti(t, 4.75);
    const b = back(seg(t, 5.1, 5.4));
    s += bubble(780, 560, 600, 100, [140, 30], txt(0, 12, 'WHO WANTS 40 TIKTOKS?!', 38, PINK), { sc: b });
  } else if (t < 8.4) {
    // Amygdala alarm: red flashing, guard runs across
    const on = Math.floor(t * 8) % 2 === 0;
    s += office(t, on);
    s += bean(510, 330, 0.85, { color: '#e8eefc', eyes: 'wide', mouth: 'scream', tie: BLUE, rot: Math.sin(t * 50) * 3 });
    s += bean(880, 330, 0.85, { color: PINK, eyes: 'wide', mouth: 'open',
      hat: `<path d="M-40 -88 L0 -190 L40 -88 Z" fill="#FFD23F" stroke="${OUT}" stroke-width="5"/>` });
    const gx = lerp(-150, 1450, seg(t, 7.0, 8.3));
    s += bean(gx, 300, 0.75, { color: ORANGE, eyes: 'wide', mouth: 'scream', rot: 12,
      hat: `<path d="M-95 -60 Q0 -150 95 -60 Z" fill="#222" stroke="${OUT}" stroke-width="5"/><rect x="-110" y="-66" width="220" height="16" rx="8" fill="#222"/>` });
    s += tag(gx, 110, 'AMYGDALA', ORANGE);
    s += txt(640, 680, 'EMAIL FROM BOSS!!!', 64, '#fff');
    // flying task paper
    const fp = seg(t, 7.1, 8.2);
    s += `<g transform="translate(${lerp(600, 1300, fp)},${lerp(420, -100, fp)}) rotate(${fp * 720})"><rect x="-55" y="-70" width="110" height="140" fill="#fff" stroke="${OUT}" stroke-width="4"/></g>`;
  } else {
    // Back outside: scrolling the phone in bed + title
    s += `<rect x="200" y="520" width="560" height="80" rx="14" fill="#262626" stroke="#333" stroke-width="5"/>`;
    s += bean(380, 450, 0.6, { eyes: 'sleepy', mouth: 'flat', body: false, look: 14 });
    s += `<rect x="470" y="380" width="48" height="84" rx="8" fill="#222" stroke="${OUT}" stroke-width="4"/>
      <rect x="476" y="388" width="36" height="66" fill="${PINK}" opacity="${0.6 + 0.4 * Math.sin(t * 12)}"/>
      <path d="M494 380 L700 200 L700 640 Z" fill="${PINK}" opacity="0.06"/>`;
    s += txt(60, 60, '3 HOURS LATER', 28, '#777', { anchor: 'start', weight: 700 });
    const p1 = back(seg(t, 8.5, 8.85)), p2 = back(seg(t, 8.8, 9.15));
    s += `<g transform="translate(990,300) scale(${p1})">${txt(0, 0, 'WHAT YOUR BRAIN', 54, '#fff')}${txt(0, 66, 'DOES WHEN YOU', 54, '#fff')}</g>`;
    s += `<g transform="translate(990,430) scale(${p2})"><rect x="-260" y="-56" width="520" height="84" fill="${PINK}"/>${txt(0, 10, 'PROCRASTINATE', 56, '#111')}</g>`;
  }
  const cut = [4.6, 7.0, 8.4].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.06)).reduce((a, b) => Math.max(a, b), 0);
  return frame(s + fade(Math.max(cut, 1 - seg(t, 0, 0.25), seg(t, 9.7, 10))), '#121212');
}
