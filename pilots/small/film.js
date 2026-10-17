// "The Small Things She'll Remember Forever" — 4:32, all on-screen text in English.
// 0–25 hook (old Mia, memory box) · 25–50 first coffee · 50–220 seven small things (24.3 s each, chapter card + scene + firefly to jar)
// 220–250 present day (jar opens, old Milo warms her hands) · 250–272 final words + question to viewers.
const DUR = 272;
const B0 = 50, BL = 170 / 7;
const walkBob = (lt, a, b) => (lt > a && lt < b ? Math.abs(Math.sin(lt * 8)) * 5 : 0);

// ---------- shared rooms ----------
function oldRoom(t, warm = 0) {
  let s = room('#0d1120', '#070910', '#120d09');
  s += window_(900, 120, 230, 250, t, { moon: true, rain: true });
  s += `<g opacity="0.35"><rect x="60" y="150" width="170" height="430" rx="6" fill="#141a2b"/>${[0, 1, 2, 3].map(r => `<path d="M64 ${240 + r * 95} H226" stroke="#1d2540" stroke-width="5"/>`).join('')}</g>`;
  s += `<rect x="300" y="210" width="90" height="70" rx="4" fill="#1a2030" stroke="#2a3048" stroke-width="5" opacity="0.7"/><circle cx="345" cy="245" r="18" fill="#2c3550" opacity="0.7"/>`;
  s += floorLamp(760, t, 0.9);
  if (warm > 0) s += glw(560, 400, 420 * warm + 1, '#ffcf8a', 0.18 * warm);
  return s;
}
function cafe(t) {
  let s = room('#1a1210', '#0c0907', '#160f0a');
  s += `<rect x="120" y="90" width="1040" height="330" rx="10" fill="#0b0d18"/>`;
  for (let i = 0; i < 26; i++) s += `<circle cx="${140 + ((i * 97.3) % 1000)}" cy="${150 + ((i * 53.1) % 240)}" r="${8 + (i % 5) * 5}" fill="${['#ffcf8a', '#ff9e7a', '#9fc6ff', '#ffd9a0'][i % 4]}" opacity="${0.16 + 0.08 * Math.sin(t + i)}" filter="url(#glow)"/>`;
  s += `<rect x="120" y="90" width="1040" height="330" rx="10" fill="none" stroke="#2a1d16" stroke-width="12"/><path d="M466 90 V420 M813 90 V420" stroke="#2a1d16" stroke-width="10"/>`;
  for (const x of [400, 880]) s += `<path d="M${x} 0 V70" stroke="#2a1d16" stroke-width="4"/><path d="M${x - 34} 70 h68 l-14 26 h-40 Z" fill="#f6d29a" stroke="${INK}" stroke-width="4"/>` + glw(x, 96, 90, '#ffcf8a', 0.45);
  return s;
}

// ---------- scenes ----------
function sHook(t) {
  let s = oldRoom(t, ease(seg(t, 14.5, 20)));
  s += armchair(520, 540, '#4a3442');
  const open = ease(seg(t, 14.2, 15.2));
  s += her(520, 400, 0.7, { ...OLD_MIA, pose: 'sit', look: 4, mouth: t > 15.5 ? 'smile' : 'flat', eyes: t > 18 ? 'happy' : undefined, handL: [-30, 150], handR: [30, 150] });
  // memory box on her lap
  s += `<g transform="translate(520,512) ${fl(t, 1, 1)}"><rect x="-56" y="-26" width="112" height="44" rx="6" fill="#7a5638" stroke="${INK}" stroke-width="4"/>
    <g transform="translate(${open * 90},${-12 - open * 30})" opacity="${1 - seg(t, 15, 16)}"><rect x="-56" y="-12" width="112" height="14" rx="5" fill="#8a6644" stroke="${INK}" stroke-width="4"/></g></g>`;
  if (t > 14.5) {
    const p = seg(t, 14.5, 24), x = 520 + Math.sin(p * 7) * 120 * p, y = 490 - ease(p) * 260 + Math.sin(t * 2) * 10;
    s += firefly(x, y, t, 1, 1.3);
  }
  s += motes(t, 26, '#ffe2a8', 0.3, 300, 200, 700, 380);
  let o = cam(s, lerp(1, 1.08, seg(t, 0, 25)), 560, 420);
  o += big('Forty years later,', t, 1.5, 7.6, 140, 54);
  o += big('she didn\'t remember the ring.', t, 8, 14.2, 140, 54);
  o += big('She remembered the small things.', t, 18.4, 24.6, 140, 54, P.mustard);
  return o;
}

function sMeet(t) {
  const lt = t - 25;
  let s = cafe(t);
  s += milo(470, 420, 0.72, { level: 0.9, t, pose: 'none', arms: false, look: 14, sweat: seg(lt, 1, 2) * (1 - seg(lt, 6, 7)), eyes: lt > 14 ? 'happy' : lt > 8 ? 'wide' : undefined, mouth: lt > 14 ? 'grin' : lt > 8 ? 'smile' : 'flat', light: '#ffcf8a', lightMode: 'soft-light', lightOp: 0.45 });
  const talk = lt > 7 && lt < 14 && Math.floor(lt * 5) % 2 ? 'o' : lt > 14 ? 'grin' : 'smile';
  s += her(810, 420, 0.72, { pose: 'none', arms: false, look: -10, eyes: lt > 14 ? 'happy' : undefined, mouth: talk, light: '#ffcf8a', lightMode: 'soft-light', lightOp: 0.45 });
  s += `<ellipse cx="640" cy="500" rx="300" ry="34" fill="#5a3d25" stroke="${INK}" stroke-width="5"/><path d="M640 534 V600" stroke="#2c2018" stroke-width="14"/><ellipse cx="640" cy="602" rx="80" ry="10" fill="#2c2018"/>`;
  s += `<g transform="${fl(t, 2, 1.5)}">${cup(560, 500, 1, 1, t)}</g><g transform="${fl(t, 3, 1.5)}">${cup(720, 500, 1, 1, t, '#ffd9e4')}</g>`;
  // his phone face-down on the table
  s += `<rect x="600" y="488" width="44" height="14" rx="4" fill="#1b1c24" stroke="${INK}" stroke-width="3"/>`;
  if (lt > 14) for (let i = 0; i < 3; i++) {
    const p = seg(lt, 14 + i * 0.4, 19 + i * 0.4);
    s += `<g opacity="${Math.sin(p * Math.PI)}" transform="translate(${640 + (i - 1) * 40},${380 - p * 140})"><path d="M0 10 C-22 -6 -14 -24 0 -12 C14 -24 22 -6 0 10 Z" fill="#ff8fb8"/></g>`;
  }
  s += motes(t, 24, '#ffe2a8', 0.35);
  let o = cam(s, lerp(1, 1.06, seg(lt, 0, 25)), 640, 430);
  o += sub('It started with one coffee.', t, 26.5, 32.5);
  o += sub('His phone stayed face down. He was listening.', t, 34, 42);
  o += sub('Really listening.', t, 43, 49);
  return o;
}

// 1. coffee the way she likes it
function s1(lt, t) {
  let s = room('#101628', '#080b15', '#140e09') + window_(160, 110, 240, 230, t, { sky: '#1c2a4a' }) + glw(280, 220, 160, '#ffb37a', 0.18);
  s += `<rect x="640" y="470" width="440" height="22" rx="6" fill="#6b4a2e" stroke="${INK}" stroke-width="4"/><path d="M670 492 V580 M1050 492 V580" stroke="#4e3520" stroke-width="14"/>`;
  s += `<path d="M900 468 L930 390 L1040 390 L1020 468 Z" fill="#2a2e3a" stroke="${INK}" stroke-width="4"/>` + glw(970, 430, 70, '#9fc6ff', 0.25);
  const sees = lt > 12.5;
  s += her(830, 404, 0.68, { pose: 'none', arms: false, look: sees ? -14 : 12, eyes: sees ? (lt > 13.5 ? 'happy' : undefined) : 'closed', mouth: sees ? 'smile' : 'flat' });
  const x = lerp(140, 610, ease(seg(lt, 3, 10))), bob = walkBob(lt, 3, 10);
  const placed = lt > 10.6;
  s += milo(x, 447 - bob, 0.7, { level: 1, t, look: 10, mouth: 'smile', eyes: lt > 13.5 ? 'happy' : undefined, armL: 10 + Math.sin(lt * 8) * 12 * (lt < 10 ? 1 : 0), handR: placed ? [70, 120] : [80, 80] });
  const cx = placed ? lerp(x + 56, 715, ease(seg(lt, 10, 10.6))) : x + 60, cy = placed ? lerp(447 + 56, 466, ease(seg(lt, 10, 10.6))) : 447 - bob + 56;
  s += `<g transform="${fl(t, 4, 1)}">${cup(cx, cy, 0.9, 1, t)}</g>`;
  if (lt > 11) s += `<g opacity="${seg(lt, 11, 11.5)}" transform="translate(${cx + 30},${cy - 40}) rotate(-8) ${fl(t, 5, 1.5)}"><rect x="-58" y="-24" width="116" height="40" rx="3" fill="#ffe27a" stroke="${INK}" stroke-width="3"/>${txt(0, -6, 'no sugar', 15, INK)}${txt(0, 10, '+ cinnamon', 15, INK)}</g>`;
  return { s, subs: [['Deadline day. She forgot to eat.', 3.5, 9.8], ['No sugar. A little cinnamon. He never had to ask.', 12.4, 20]], fly: [cx, cy - 30] };
}

// 2. "Text me when you're home"
function s2(lt, t) {
  let L = room('#0a0e1c', '#05070d', '#0b0b10');
  L += `<rect x="80" y="130" width="480" height="300" rx="20" fill="#0b0d18" stroke="#1d2233" stroke-width="10"/>`;
  for (let i = 0; i < 16; i++) L += `<circle cx="${100 + ((i * 83 + lt * 220) % 460)}" cy="${170 + (i * 37) % 220}" r="${6 + (i % 4) * 4}" fill="${['#ffcf8a', '#ff9e7a', '#9fc6ff'][i % 3]}" opacity="0.22" filter="url(#glow)"/>`;
  L += her(320, 330, 0.62, { pose: 'none', arms: false, look: 12, eyes: lt > 12.6 && lt < 13.6 ? 'happy' : undefined, mouth: 'smile', light: '#9fc6ff', lightOp: 0.12 });
  L += phone(400, 400, 10, lt > 12 && lt < 13.2 ? 1 : 0.3, 0.9);
  L += txt(320, 520, 'TAXI · 1:12 AM', 20, '#6a7090', { weight: 700, ls: 2 });
  let R = room('#0c1020', '#06080f', '#0d0a0a') + window_(980, 110, 190, 180, t, { moon: true });
  R += `<rect x="700" y="470" width="480" height="60" rx="14" fill="#2b2f45" stroke="${INK}" stroke-width="5"/><rect x="700" y="420" width="70" height="160" rx="16" fill="#2a2238" stroke="${INK}" stroke-width="5"/>`;
  const got = lt > 13, sleep = lt > 16.5;
  R += milo(900, 400, 0.68, { level: got ? 1 : 0.6, t, pose: 'sit', lid: got ? 0 : lerp(0.2, 0.6, seg(lt, 4, 12)), eyes: sleep ? 'closed' : got ? 'happy' : undefined, mouth: got ? 'smile' : 'flat', rot: sleep ? -12 : 0, armL: 12, handR: [60, 70] });
  R += phone(946, 450, -6, got ? 1 : 0.55, 0.9);
  if (got) R += `<g opacity="${seg(lt, 13, 13.4) * (1 - seg(lt, 18, 18.6))}" transform="translate(1000,330) scale(${back(seg(lt, 13, 13.4))}) ${fl(t, 6, 2)}"><rect x="-90" y="-30" width="180" height="52" rx="26" fill="#f1ede4" stroke="${INK}" stroke-width="4"/>${txt(0, 6, 'I\'m home ♥', 24, '#e0408f', { weight: 900 })}</g>`;
  if (sleep) R += `<g opacity="${seg(lt, 16.5, 17)}">${['z', 'z', 'z'].map((z, i) => { const p = ((lt * 0.5) + i / 3) % 1; return txt(960 + p * 50, 300 - p * 80, z, 26 + p * 18, '#9aa6d0', { op: Math.sin(p * Math.PI) }); }).join('')}</g>`;
  R += `<g transform="translate(1160,520)"><rect x="-50" y="-26" width="100" height="44" rx="8" fill="#0b0b10" stroke="${INK}" stroke-width="4"/>${txt(0, 6, '1:12', 24, '#ff5a5a', { weight: 800, font: 'DejaVu Sans Mono' })}</g>`;
  const s = `<defs><clipPath id="cl2"><rect width="638" height="${H}"/></clipPath><clipPath id="cr2"><rect x="642" width="638" height="${H}"/></clipPath></defs>
    <g clip-path="url(#cl2)">${L}</g><g clip-path="url(#cr2)">${R}</g><rect x="638" width="4" height="${H}" fill="#2a3048"/>`;
  return { s, subs: [['She took the late taxi home.', 3.4, 10], ['He never fell asleep before "I\'m home".', 12.6, 20.5]], fly: [946, 420] };
}

// 3. bus stop in winter
function s3(lt, t) {
  let s = room('#0b1020', '#070a14', '#1a1c24');
  for (let i = 0; i < 70; i++) s += `<circle cx="${(i * 97.3 + Math.sin(t + i) * 12) % W}" cy="${(i * 61.7 + t * 36) % 600}" r="${1.5 + (i % 3)}" fill="#fff" opacity="0.6"/>`;
  s += `<rect y="580" width="${W}" height="140" fill="#cfd4e4" opacity="0.18"/>`;
  s += `<path d="M300 180 H980" stroke="#2a3048" stroke-width="18" stroke-linecap="round"/><path d="M320 180 V580 M960 180 V580" stroke="#2a3048" stroke-width="10"/>
    <rect x="330" y="200" width="620" height="300" fill="#9fc6ff" opacity="0.06"/>`;
  s += `<g transform="translate(1100,0)"><path d="M0 580 V230 q0 -30 -40 -30 h-20" stroke="#1d2233" stroke-width="10" fill="none"/><path d="M-80 200 h50 l-10 18 h-30 Z" fill="#f6d29a"/></g>` + glw(1035, 214, 80, '#ffcf8a', 0.5);
  s += `<rect x="360" y="270" width="140" height="60" rx="6" fill="#141a2b" stroke="#2a3048" stroke-width="4"/>${txt(430, 308, 'BUS 42 · LATE', 16, '#ff9e7a', { weight: 800 })}`;
  const hold = lt > 9, shiver = lt < 12 ? Math.sin(lt * 40) * 2.5 : 0;
  s += milo(560, 447, 0.7, { level: 0.9, t, look: 12, mouth: hold ? 'smile' : 'flat', eyes: lt > 14 ? 'happy' : undefined, armL: 12, handR: hold ? [lerp(60, 92, seg(lt, 9, 10)), lerp(120, 90, seg(lt, 9, 10))] : undefined });
  s += her(720, 447, 0.7, { look: -10, rot: shiver, mouth: lt < 11 ? 'flat' : 'smile', eyes: lt > 14 ? 'happy' : undefined, armR: 12, handL: hold ? [lerp(-60, -92, seg(lt, 9, 10)), lerp(120, 90, seg(lt, 9, 10))] : [-20, 110], dress: '#c97b8e' });
  if (hold) {
    s += glw(640, 512, 60, '#ffcf8a', 0.5 * seg(lt, 9.5, 11));
    for (let i = 0; i < 3; i++) { const p = ((lt * 0.8) + i / 3) % 1; s += `<circle cx="${615 + p * 20}" cy="${470 - p * 30}" r="${6 + p * 10}" fill="#fff" opacity="${0.35 * Math.sin(p * Math.PI) * seg(lt, 10, 11)}"/>`; }
  }
  for (const [x, ph] of [[560, 0], [720, 1.3]]) { const p = ((lt * 0.6) + ph) % 1; s += `<circle cx="${x + 30}" cy="${430 - p * 30}" r="${5 + p * 8}" fill="#fff" opacity="${0.25 * Math.sin(p * Math.PI)}"/>`; }
  return { s, subs: [['The bus was late. Minus ten.', 3.4, 9.6], ['He kept her hands warm.', 11.4, 20.5]], fly: [640, 500] };
}

// 4. asleep on the sofa: blanket + TV off
function s4(lt, t) {
  const tvOn = 1 - seg(lt, 14, 15);
  let s = room('#0c1020', '#06080f', '#120d09') + floorLamp(160, t, 0.6);
  s += `<rect x="1020" y="300" width="200" height="130" rx="8" fill="#0b0c12" stroke="${INK}" stroke-width="6"/><rect x="1032" y="312" width="176" height="106" rx="4" fill="${mix('#0b0c12', '#7fb2ff', tvOn * (0.8 + 0.2 * Math.sin(t * 9)))}"/>
    <path d="M1120 430 V470 M1080 470 H1160" stroke="#1d1d25" stroke-width="8"/>`;
  s += glw(900, 420, 260, '#6f9ad8', 0.25 * tvOn);
  s += `<rect x="330" y="360" width="500" height="160" rx="44" fill="#3a3046" stroke="${INK}" stroke-width="6"/><rect x="300" y="460" width="560" height="110" rx="30" fill="#45385a" stroke="${INK}" stroke-width="6"/>`;
  s += her(620, 412, 0.66, { pose: 'sit', eyes: 'closed', mouth: lt > 12.5 ? 'smile' : 'flat', rot: 14, look: 4, armL: 8, armR: 8, light: '#6f9ad8', lightOp: 0.12 * tvOn });
  const blanket = ease(seg(lt, 9.5, 12));
  if (blanket > 0) s += `<g transform="translate(620,${lerp(380, 520, blanket)}) rotate(4) ${fl(t, 7, 1)}" opacity="${seg(lt, 9, 9.6)}"><path d="M-110 -40 Q0 -70 110 -40 L120 60 Q0 80 -120 60 Z" fill="#d9a35b" stroke="${INK}" stroke-width="5"/>
    <path d="M-80 -30 V50 M-30 -40 V60 M20 -40 V60 M70 -30 V50" stroke="#b8833f" stroke-width="5" opacity="0.6"/></g>`;
  if (lt > 2.5) s += `<g opacity="${(1 - seg(lt, 12, 13)) * seg(lt, 2.5, 3)}">${['z', 'z', 'z'].map((z, i) => { const p = ((lt * 0.5) + i / 3) % 1; return txt(690 + p * 40, 300 - p * 70, z, 22 + p * 14, '#9aa6d0', { op: Math.sin(p * Math.PI) }); }).join('')}</g>`;
  const x = lerp(-60, 430, ease(seg(lt, 4, 9))), bob = walkBob(lt, 4, 9);
  const remote = lt > 13;
  s += milo(remote ? lerp(430, 470, seg(lt, 13, 13.6)) : x, 447 - bob, 0.7, { level: 1, t, look: 14, mouth: 'smile', eyes: lt > 15 ? 'happy' : undefined, armL: 10 + Math.sin(lt * 8) * 12 * (lt < 9 ? 1 : 0), handR: lt > 9 && lt < 12 ? [110, 40] : remote ? [100, 50] : undefined });
  if (remote) s += `<g transform="translate(${470 + 70},${447 + 35}) rotate(-30)"><rect x="-8" y="-24" width="16" height="44" rx="5" fill="#2a2a33" stroke="${INK}" stroke-width="3"/><circle cy="-14" r="3" fill="#ff5a5a"/></g>`;
  return { s, subs: [['She fell asleep during the movie. Again.', 3.4, 9], ['He covered her. Turned off the TV. Quietly.', 12.6, 20.5]], fly: [620, 440] };
}

// 5. he came in the rain
function s5(lt, t) {
  let s = room('#0a0e1b', '#06080e', '#0e1016');
  s += `<rect x="120" y="120" width="420" height="460" fill="#141018"/><rect x="160" y="250" width="340" height="250" rx="6" fill="#ffcf8a" opacity="0.22"/>` + glw(330, 380, 180, '#ffcf8a', 0.25);
  s += `<path d="M110 220 L560 220 L600 270 L70 270 Z" fill="#7a3a46" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${90 + i * 72} 270 q36 26 72 0" fill="#7a3a46" stroke="${INK}" stroke-width="4"/>`).join('')}`;
  for (let i = 0; i < 120; i++) { const x = (i * 53.7) % W, y = (i * 91.3 + t * 520) % 620; if (x > 80 && x < 590 && y > 230 && y < 580) continue; s += `<path d="M${x} ${y} l-4 16" stroke="#9fb4e0" stroke-width="2" opacity="0.45"/>`; }
  for (let i = 0; i < 8; i++) { const p = ((t * 1.3) + i / 8) % 1; s += `<ellipse cx="${(i * 157) % W}" cy="${600 + (i % 3) * 30}" rx="${8 + p * 30}" ry="${2 + p * 6}" fill="none" stroke="#9fb4e0" stroke-width="2" opacity="${0.4 * (1 - p)}"/>`; }
  const arrive = ease(seg(lt, 6, 10.5)), leave = ease(seg(lt, 15, 20));
  const mx = lerp(1280, 470, arrive) - leave * 260, hx = 330 - leave * 260;
  s += her(hx, 447, 0.7, { look: lt > 8 ? 14 : 0, eyes: lt > 11.5 ? 'happy' : lt < 8 ? 'sad' : undefined, mouth: lt > 11 ? 'smile' : 'flat', step: leave > 0 && leave < 1 ? Math.sin(lt * 8) * 6 : 0 });
  s += milo(mx, 447 - walkBob(lt, 6, 10.5) - walkBob(lt, 15, 20), 0.7, { level: 1, t, look: -14, mouth: 'grin', eyes: lt > 11.5 ? 'happy' : undefined, armL: 150, armR: 12, sweat: seg(lt, 8, 9) * (1 - seg(lt, 13, 14)) });
  const ux = mx - 60;
  s += `<g transform="translate(${ux},${447 - 150}) ${fl(t, 8, 1.5)}"><path d="M-90 0 Q0 -80 90 0 Q60 -12 30 0 Q0 -12 -30 0 Q-60 -12 -90 0 Z" fill="${P.mustard}" stroke="${INK}" stroke-width="5"/><path d="M0 -40 V110" stroke="${INK}" stroke-width="5"/></g>`;
  if (arrive > 0.95) s += glw(ux, 400, 140, '#ffcf8a', 0.18);
  return { s, subs: [['Rain. No umbrella. No taxi.', 3.4, 8.6], ['He came in the rain. He always came.', 11.4, 20.5]], fly: [ux, 330] };
}

// 6. sick day: he stayed
function s6(lt, t) {
  let s = room('#0d1120', '#070910', '#120d09') + window_(950, 110, 200, 190, t, { sky: '#16203a', snow: false });
  s += `<rect x="220" y="430" width="520" height="70" rx="18" fill="#2b2f45" stroke="${INK}" stroke-width="5"/><rect x="200" y="360" width="70" height="220" rx="20" fill="#2a2238" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M260 390 q-10 -40 40 -46 q90 -6 140 10 q20 26 0 52 q-90 12 -160 8 q-26 0 -20 -24 Z" fill="#c9cde0" stroke="${INK}" stroke-width="5"/>`;
  const laugh = lt > 14.5 && lt < 19;
  s += her(380, 368, 0.6, { pose: 'none', arms: false, rot: -70, eyes: laugh ? 'happy' : lt < 8 ? 'closed' : undefined, mouth: laugh ? 'grin' : 'flat', look: 10, extra: `<ellipse cx="-50" cy="18" rx="18" ry="10" fill="#ff6a6a" opacity="0.45"/><ellipse cx="50" cy="18" rx="18" ry="10" fill="#ff6a6a" opacity="0.45"/>` });
  s += `<path d="M430 440 q120 -40 300 -10 l10 70 h-320 Z" fill="#8a9bd0" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="560" y="520" width="90" height="60" rx="6" fill="#4a3a30" stroke="${INK}" stroke-width="4"/><g transform="translate(605,505) ${fl(t, 9, 1)}"><rect x="-26" y="-20" width="52" height="30" rx="5" fill="#e8e4f4" stroke="${INK}" stroke-width="3"/><path d="M-8 -20 q8 -16 16 0" fill="#fff" stroke="${INK}" stroke-width="2"/></g>`;
  const sit = ease(seg(lt, 3, 7));
  s += `<rect x="790" y="470" width="130" height="20" rx="6" fill="#5a3d25" stroke="${INK}" stroke-width="4"/><path d="M800 490 V580 M910 490 V580 M905 470 V380" stroke="#4e3520" stroke-width="10"/>`;
  const spoon = lt > 8 && lt < 13 ? Math.sin(lt * 3) : 0;
  s += milo(lerp(1100, 850, sit), 360 + (1 - sit) * 20 - walkBob(lt, 3, 7), 0.68, { level: 1, t, pose: sit > 0.9 ? 'sit' : 'stand', look: -16, mouth: lt > 14 ? 'grin' : 'smile', eyes: laugh ? 'happy' : undefined, armR: 12, handL: [-80 - spoon * 20, 70 - spoon * 30] });
  s += `<g transform="translate(${lerp(1100, 850, sit) - 50},${430}) ${fl(t, 10, 1)}"><path d="M-26 0 q26 28 52 0 Z" fill="#f1ede4" stroke="${INK}" stroke-width="4"/>${[0, 1].map(i => `<path d="M${-6 + i * 12} -6 q-5 -10 0 -18" stroke="#fff" stroke-width="3" fill="none" opacity="${0.3 + 0.2 * Math.sin(t * 2 + i)}"/>`).join('')}</g>`;
  if (lt > 14.5 && lt < 18.5) s += `<g opacity="${Math.min(seg(lt, 14.5, 15), 1 - seg(lt, 18, 18.5))}" transform="translate(860,250) ${fl(t, 11, 2)}"><rect x="-120" y="-30" width="240" height="52" rx="26" fill="#f1ede4" stroke="${INK}" stroke-width="4"/>${txt(0, 6, 'Why did the soup…', 20, INK, { weight: 800 })}</g>`;
  return { s, subs: [['Fever. 38.5°.', 3.4, 8.6], ['He stayed. With soup and terrible jokes.', 10.6, 20.5]], fly: [380, 360] };
}

// 7. tiny notes on the fridge
function s7(lt, t) {
  const close = ease(seg(lt, 14, 15));
  let s = room('#101628', '#080b15', '#140e09') + window_(820, 110, 220, 200, t, { sky: '#1c2a4a' }) + glw(930, 210, 150, '#ffb37a', 0.16);
  s += `<rect x="260" y="200" width="200" height="380" rx="16" fill="#c9ccd6" stroke="${INK}" stroke-width="6"/><path d="M260 330 H460" stroke="${INK}" stroke-width="5"/><path d="M280 230 V300 M280 350 V420" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  const stuck = lt > 6;
  s += `<g transform="translate(370,270) rotate(-4)" opacity="${stuck ? 1 : 0}"><rect x="-40" y="-30" width="80" height="60" rx="3" fill="#ffe27a" stroke="${INK}" stroke-width="3"/><path d="M-26 -10 h52 M-26 4 h40 M-26 18 h30" stroke="#8a7a3a" stroke-width="3"/></g>`;
  const mIn = ease(seg(lt, 2.6, 5.4)), mOut = ease(seg(lt, 7, 9.6));
  if (lt < 9.8) s += milo(lerp(1300, 520, mIn) + mOut * 900, 447 - walkBob(lt, 2.6, 5.4) - walkBob(lt, 7, 9.6), 0.7, { level: 1, t, look: -16, mouth: 'smile', handL: lt > 5 && lt < 6.4 ? [-120, -60] : undefined, armR: 12 });
  if (lt > 9.6) {
    const hIn = ease(seg(lt, 10, 12.4));
    s += her(lerp(1300, 560, hIn), 447, 0.7, { look: -16, eyes: lt > 13 ? 'happy' : undefined, mouth: lt > 13 ? 'smile' : 'flat', step: hIn > 0 && hIn < 1 ? Math.sin(lt * 8) * 6 : 0, handL: lt > 16 ? [-50, 60] : undefined, handR: lt > 16 ? [50, 60] : undefined });
  }
  if (close > 0) s += `<g opacity="${close}"><rect width="${W}" height="${H}" fill="#05070c" opacity="0.6"/>
    <g transform="translate(640,330) rotate(-3) scale(${lerp(0.4, 1, close)}) ${fl(t, 12, 2)}"><rect x="-230" y="-140" width="460" height="260" rx="6" fill="#ffe27a" stroke="${INK}" stroke-width="5"/>
    ${txt(0, -60, 'Have a good day.', 40, INK, { font: 'DejaVu Serif', weight: 700 })}${txt(0, 0, 'I\'m proud of you.', 40, INK, { font: 'DejaVu Serif', weight: 700 })}${txt(120, 70, '— M', 32, '#5a4a20', { font: 'DejaVu Serif', weight: 700 })}
    <path d="M-150 78 C-172 62 -164 44 -150 56 C-136 44 -128 62 -150 78 Z" fill="#ff6a8a"/></g></g>`;
  return { s, subs: [['Before work. Every single morning.', 3.4, 9.4], ['Tiny notes. She kept every one.', 15.6, 20.5]], fly: [640, 330] };
}

const BLOCKS = [
  { f: s1, title: 'He remembered how she takes her coffee' },
  { f: s2, title: 'He waited for "I\'m home"' },
  { f: s3, title: 'He kept her hands warm' },
  { f: s4, title: 'He turned off the TV. Quietly.' },
  { f: s5, title: 'He came in the rain' },
  { f: s6, title: 'He stayed' },
  { f: s7, title: 'He left little notes' },
];

function sBlock(t) {
  const k = Math.min(6, Math.floor((t - B0) / BL)), lt = t - B0 - k * BL;
  const r = BLOCKS[k].f(lt, t);
  let o = cam(r.s + motes(t, 18, '#ffe2a8', 0.25), lerp(1, 1.05, seg(lt, 2, BL)), 640, 430);
  for (const [s, a, b] of r.subs) o += sub(s, lt, a, b);
  o += flyToJar(lt, 20.6, 23.6, r.fly[0], r.fly[1]);
  o += chapter(k + 1, BLOCKS[k].title, lt);
  return o;
}

function sPresent(t) {
  const lt = t - 220;
  const out = seg(lt, 3.5, 14);
  let s = oldRoom(t, ease(out));
  s += armchair(520, 540, '#4a3442');
  const sitDown = ease(seg(lt, 14, 17));
  s += her(520, 400, 0.7, { ...OLD_MIA, pose: 'sit', look: lt > 11 ? -12 : 4, mouth: 'smile', eyes: lt > 19 ? 'happy' : undefined, handL: lt > 18 ? [-70, 110] : [-34, 150], handR: [34, 150] });
  // the jar on her lap; fireflies fly out and fill the room
  const lid = ease(seg(lt, 2, 3.2));
  s += `<g transform="translate(520,500) ${fl(t, 13, 1)}"><rect x="-34" y="-46" width="68" height="92" rx="16" fill="#ffffff" fill-opacity="0.08" stroke="#cfd6ee" stroke-opacity="0.7" stroke-width="3"/>
    <g transform="translate(${lid * 70},${-58 + lid * 20})" opacity="${1 - seg(lt, 3, 4)}"><rect x="-24" y="0" width="48" height="14" rx="4" fill="#7a5638" stroke="${INK}" stroke-width="3"/></g></g>`;
  for (let i = 0; i < 7; i++) {
    const p = seg(lt, 3.5 + i * 0.5, 9 + i * 0.6);
    const tx = 260 + ((i * 173) % 760), ty = 160 + ((i * 97) % 240);
    const x = lerp(520 + (i % 3 - 1) * 12, tx, ease(p)) + Math.sin(t * 0.7 + i) * 20 * p, y = lerp(505, ty, ease(p)) + Math.cos(t * 0.9 + i) * 14 * p;
    s += firefly(x, y, t, i, 1.1);
  }
  // old Milo (a little tree on his head) brings two cups and warms her hands
  const walk = ease(seg(lt, 9, 14));
  const mx = lerp(-80, 690, walk);
  s += milo(mx, 410 + sitDown * 0 - walkBob(lt, 9, 14) * 0.6, 0.7, { tree: true, level: 1, t, rot: 4, look: -14, mouth: 'smile', eyes: lt > 19 ? 'happy' : undefined,
    handL: lt > 18 ? [-110, 120] : [-60, 80], armR: 12, extra: `<path d="M-62 -10 l-8 -4 M62 -10 l8 -4" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>` });
  if (lt > 9 && lt < 16) s += `<g transform="translate(${mx - 40},470) ${fl(t, 14, 1)}">${cup(0, 0, 0.8, 1, t)}${cup(30, 4, 0.8, 1, t, '#ffd9e4')}</g>`;
  if (lt > 16) s += `<g transform="${fl(t, 15, 1)}">${cup(640, 560, 0.85, 1, t)}${cup(670, 564, 0.85, 1, t, '#ffd9e4')}</g><rect x="610" y="568" width="100" height="14" rx="4" fill="#5a3d25"/>`;
  if (lt > 18) s += glw(600, 520, 110, '#ffcf8a', 0.45 * seg(lt, 18, 20));
  let o = cam(s, lerp(1.04, 1.12, seg(lt, 0, 30)), 580, 430);
  o += sub('Forty years later.', t, 222, 228);
  o += sub('A thousand small things. Still warm.', t, 239, 249);
  return o;
}

function sFinal(t) {
  const lt = t - 250;
  let s = `<rect width="${W}" height="${H}" fill="#05070c"/>` + glw(640, 360, 320, '#ffcf8a', 0.07);
  for (let i = 0; i < 16; i++) s += firefly(((i * 157.3) + Math.sin(t * 0.4 + i) * 40) % W, ((i * 89.7) % 600) + 60 + Math.cos(t * 0.5 + i) * 20, t, i, 0.8);
  s += big('Love isn\'t one big moment.', t, 251.5, 258.2, 300, 56);
  s += big('It\'s a thousand small ones', t, 258.4, 265.2, 290, 56);
  s += big('nobody else sees.', t, 259.2, 265.2, 370, 56, P.mustard);
  const op = Math.min(seg(lt, 15.6, 16.2), 1 - seg(lt, 21.2, 22));
  if (op > 0) s += `<g opacity="${op}" transform="translate(640,${330 + Math.sin(t * 1.3) * 1.5})"><rect x="-330" y="-56" width="660" height="88" rx="16" fill="${P.mustard}"/>${txt(0, 4, 'What small thing do you remember?', 36, '#1a1a1a')}
    ${txt(0, 90, 'Tell us in the comments ↓', 28, P.cream, { weight: 700 })}</g>`;
  return s;
}

function render(t) {
  let s;
  if (t < 25) s = sHook(t);
  else if (t < 50) s = sMeet(t);
  else if (t < 220) s = sBlock(t);
  else if (t < 250) s = sPresent(t);
  else s = sFinal(t);
  const count = t < B0 ? 0 : Math.min(7, Math.floor((t - B0 - 23.6) / BL) + 1);
  if (t >= B0 && t < 250) s += jarHud(t, Math.max(0, count), seg(t, B0 + 2.4, B0 + 3) * (1 - seg(t, 219, 220)));
  s += vign();
  const cuts = [25, 50, 220, 250].concat([1, 2, 3, 4, 5, 6].map(k => B0 + k * BL));
  const dip = cuts.map(c => Math.max(0, 1 - Math.abs(t - c) / 0.3)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(dip, 1 - seg(t, 0, 1.2), seg(t, 270.5, 272))), t, '#000');
}
