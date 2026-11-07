// "Stop Overthinking" — 50-second trial cut v2 (no voice-over).
// Rules (HANDOFF.md): no camera zoom/pan — backgrounds exactly as they are; Milo stands on the floor of the scene
// (feet on the floor line, contact shadow, perspective scale), never slides; he may change poses in place;
// board text is handwritten on the board (marker font, written stroke by stroke, no floating);
// only UI on top of the frame (subtitles, phone bubbles) may animate in.
const DUR = 50;
const INK = '#16161a';
const POSE = { phone: [465, 687], thinking_gears: [559, 456], realization: [458, 452], presenting: [502, 549],
  talking: [523, 676], facepalm_stress: [425, 452], question_think: [438, 723], idea: [402, 563] };

const glw = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
// Background exactly as it is: full frame, no camera move.
const bg = img => `<image href="${img}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`;

// Milo standing on the floor: feet at (x, y), height h. talk 0..1 = small breathing bob in place (no sliding).
// Pose changes are instant cuts at the same feet position; shadow stays fixed on the floor.
function milo2(pose, x, y, h, t, talk = 0, shadowCol = '#1a0f22') {
  const [iw, ih] = POSE[pose], w = h * iw / ih;
  const breathe = Math.sin(t * 2.2) * 0.008 + talk * Math.abs(Math.sin(t * 7)) * 0.018;  // scale from the feet up
  return `<ellipse cx="${x}" cy="${y - 3}" rx="${w * 0.36}" ry="${h * 0.04}" fill="${shadowCol}" opacity="0.45" filter="url(#soft)"/>
    <ellipse cx="${x}" cy="${y - 3}" rx="${w * 0.22}" ry="${h * 0.022}" fill="${shadowCol}" opacity="0.4"/>
    <g transform="translate(${x},${y}) scale(${1 - breathe * 0.4},${1 + breathe})">
    <image href="${ASSETS['pose_' + pose]}" x="${-w / 2}" y="${-h}" width="${w}" height="${h}"/></g>`;
}
// Subtitle strip over the frame (UI): fades in, no bounce.
function cap(s, t, a, b, hl = null) {
  const op = Math.min(seg(t, a, a + 0.3), 1 - seg(t, b - 0.3, b));
  if (op <= 0) return '';
  const size = 30, w = s.length * size * 0.55 + 56, y = 690;
  let html = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (hl) html = html.replace(hl, `<tspan fill="${P.mustard}">${hl}</tspan>`);
  return `<g opacity="${op}"><rect x="${640 - w / 2}" y="${y - size - 8}" width="${w}" height="${size + 22}" rx="12" fill="#140f1e" opacity="0.8"/>
    <text x="640" y="${y}" font-family="Inter" font-weight="800" font-size="${size}" fill="#fff" text-anchor="middle">${html}</text></g>`;
}
// Handwriting on a surface: text revealed left to right as if written with a marker (no movement, no outline).
let _wid = 0;
function written(str, x, y, size, col, t, a, dur, o = {}) {
  if (t < a) return '';
  const p = clamp((t - a) / dur), id = 'w' + (_wid++);
  const w = str.length * size * (o.cw || 0.5) + 20;
  const anchor = o.anchor || 'middle', x0 = anchor === 'middle' ? x - w / 2 : x - 10;
  return `<defs><clipPath id="${id}"><rect x="${x0}" y="${y - size * 1.1}" width="${w * p}" height="${size * 1.5}"/></clipPath></defs>
    <g clip-path="url(#${id})" ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ''}><text x="${x}" y="${y}" font-family="${o.font || 'PatrickHand'}" font-size="${size}"
    fill="${col}" text-anchor="${anchor}" opacity="0.92">${str.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></g>`;
}
// Marker underline / circle drawn on the board.
function strokeLine(d, len, col, t, a, dur, wdt = 5) {
  if (t < a) return '';
  const p = clamp((t - a) / dur);
  return `<path d="${d}" stroke="${col}" stroke-width="${wdt}" fill="none" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - p)}" opacity="0.9"/>`;
}
// Phone chat bubble (UI on top of the frame): fades in, no bounce, does not float.
function bubble(x, y, s, t, a, me = true) {
  const op = seg(t, a, a + 0.25);
  if (op <= 0) return '';
  const w = s.length * 13 + 44;
  return `<g opacity="${op}"><rect x="${x - w / 2}" y="${y - 26}" width="${w}" height="48" rx="22" fill="${me ? '#5aa7ff' : '#f6f1e8'}" stroke="${INK}" stroke-width="3"/>
    ${txt(x, y + 6, s, 22, me ? '#fff' : INK, { weight: 800 })}</g>`;
}
// "SIGN n/7" tag (UI): fades in.
function signTag(n, t, a, b) {
  const op = Math.min(seg(t, a, a + 0.3), 1 - seg(t, b - 0.3, b));
  if (op <= 0) return '';
  return `<g opacity="${op}"><rect x="40" y="34" width="210" height="58" rx="12" fill="${P.mustard}" stroke="${INK}" stroke-width="4"/>${txt(145, 74, `SIGN ${n} / 7`, 30, INK, { weight: 900 })}</g>`;
}
const defs = `<defs><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;

const SHOTS = [0, 9, 15, 28, 36, 44, 50];
const BLUE = '#2b4a8f', RED = '#c8463b', BLACK = '#2a2530';

function render(t) {
  _wid = 0;
  let s = defs;
  if (t < 9) {            // 1. Hook: the bed scene as it is
    s += bg(ASSETS.ot_bed);
    s += glw(272, 572, 70, '#ffb35c', 0.16 + 0.06 * Math.sin(t * 2));     // clock glow pulse
    s += glw(170, 390, 110, '#ffcf8a', 0.10 + 0.03 * Math.sin(t * 5));    // lamp flicker
    s += cap("It's 11:47 PM.", t, 0.6, 3.2);
    s += cap('6 hours ago you texted "haha ok"...', t, 3.4, 6.2, 'haha ok');
    s += cap("...and you still can't stop thinking about it.", t, 6.4, 8.9);
  } else if (t < 15) {    // 2. Bedroom: Milo on the rug with his phone, thoughts pop in (UI)
    const lt = t - 9;
    s += bg(ASSETS.loc_bedroom_desk);
    s += milo2('phone', 800, 640, 270, t, 0, '#2a1830');
    s += bubble(1010, 360, 'haha ok', lt, 0.4);
    s += `<g opacity="${seg(lt, 0.9, 1.2)}">${txt(1060, 400, 'Seen ✓✓', 18, '#e8e0ff', { weight: 700 })}</g>`;
    ['did that sound rude?', 'are they mad at me?', 'why did I say that?'].forEach((q, i) => { s += bubble(520 - i * 20, 190 + i * 64, q, lt, 1.8 + i * 1.1, false); });
  } else if (t < 28) {    // 3–4. Whiteboard: title written on the board, Milo next to it changes poses in place
    const lt = t - 15;
    s += bg(ASSETS.loc_whiteboard);
    // board writing area: x 395..1055, y 75..435 (no movement, written on)
    s += written('Why you', 725, 150, 58, BLACK, lt, 0.3, 0.7);
    s += written('OVERTHINK', 725, 240, 92, BLUE, lt, 1.0, 1.0);
    s += strokeLine('M520 262 Q725 274 930 258', 420, RED, lt, 2.0, 0.5, 7);
    s += written('everything', 725, 320, 58, BLACK, lt, 2.4, 0.8);
    if (lt > 6.2) {
      s += written('replaying = safety?', 725, 400, 46, RED, lt, 6.4, 1.2);
    }
    const pose = lt < 4.2 ? 'facepalm_stress' : lt < 6.2 ? 'thinking_gears' : lt < 9.4 ? 'realization' : 'presenting';
    const ph = { facepalm_stress: 200, thinking_gears: 200, realization: 205, presenting: 235 }[pose];
    s += milo2(pose, 960, 645, ph, t, pose === 'presenting' ? 1 : 0, '#5a3a24');
    s += cap('Your brain thinks replaying it keeps you safe.', t, 21.4, 24.4, 'keeps you safe');
    s += cap("It doesn't. It just drains you.", t, 24.6, 27.8, 'drains you');
  } else if (t < 36) {    // 5. SIGN 1 — re-reading the message, café
    const lt = t - 28;
    s += bg(ASSETS.loc_cafe);
    s += milo2('phone', 640, 660, 230, t, 0, '#2a140c');
    s += signTag(1, lt, 0.2, 7.8);
    ['haha ok', 'haha ok', 'haha ok'].forEach((q, i) => { s += bubble(860 + i * 26, 210 + i * 62, q, lt, 1.0 + i * 0.5); });
    s += `<g opacity="${seg(lt, 2.8, 3.1)}">${txt(1063, 303, '× 27', 56, INK)}${txt(1060, 300, '× 27', 56, P.mustard)}</g>`;
    s += cap('You re-read the same message 27 times.', t, 29.0, 35.8, '27 times');
  } else if (t < 44) {    // 6. SIGN 2 — rehearsing a conversation, subway
    const lt = t - 36;
    s += bg(ASSETS.loc_subway);
    s += milo2('talking', 600, 650, 260, t, 1, '#1c1630');
    s += signTag(2, lt, 0.2, 7.8);
    [['"Hey, so... about yesterday"', 1.2, 3.0], ['"No wait, that\'s weird"', 3.0, 4.8], ['"Hey! So, funny story..."', 4.8, 99]].forEach(([q, a, b]) => {
      const op = Math.min(seg(lt, a, a + 0.25), 1 - seg(lt, b, b + 0.25));
      if (op > 0) s += `<g opacity="${op}">${bubble(880, 250, q, lt, a, false)}</g>`;
    });
    s += cap('You rehearse conversations that never happen.', t, 37.0, 43.8, 'never happen');
  } else {                // 7. End card: rooftop, Milo by the parapet
    const lt = t - 44;
    s += bg(ASSETS.loc_rooftop);
    s += milo2(lt < 2.6 ? 'question_think' : 'idea', 690, 625, lt < 2.6 ? 250 : 205, t, 0, '#1b1426');
    const op = Math.min(seg(lt, 0.5, 0.9), 1 - seg(lt, 5.4, 5.9));
    s += `<g opacity="${op}"><rect x="760" y="120" width="460" height="130" rx="16" fill="#140f1e" opacity="0.78"/>
      ${txt(990, 175, '5 MORE SIGNS', 44, '#fff', { weight: 900 })}${txt(990, 228, '+ HOW TO STOP', 44, P.mustard, { weight: 900 })}</g>`;
    s += cap('Full video: Stop Overthinking — MiloLore', t, 45.4, 49.6);
  }
  const dip = SHOTS.slice(1, -1).map(c => Math.max(0, 1 - Math.abs(t - c) / 0.2)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(dip * 0.9, 1 - seg(t, 0, 0.6), seg(t, 49.3, 50))), t, '#000');
}
