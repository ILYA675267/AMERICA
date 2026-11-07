// "Stop Overthinking" — 50-second trial cut, no voice-over: on-screen text, scenes from the user, Milo poses on locations.
// Pacing rule: something new every 3–6 s. Milo is never redrawn: user poses only, with a light "talking" bob.
const DUR = 50;
const INK = '#16161a';
const POSE = { phone: [465, 687], thinking_gears: [559, 456], realization: [458, 452], presenting: [502, 549],
  talking: [523, 676], facepalm_stress: [425, 452], question_think: [438, 723], idea: [402, 563] };

const glw = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
const fl = (t, id, amp = 2.5) => `translate(${Math.sin(t * 1.1 + id * 1.7) * amp * 0.4},${Math.sin(t * 1.6 + id * 2.3) * amp})`;

// Full-frame background with a slow camera move (zoom z0->z1 around fx,fy).
function bg(img, p, z0, z1, fx = 640, fy = 360) {
  const z = lerp(z0, z1, ease(p));
  return `<g transform="translate(${fx},${fy}) scale(${z}) translate(${-fx},${-fy})"><image href="${img}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/></g>`;
}
// Milo pose standing with feet at (x, y), height h. talk: 0..1 talking bob; pop: entrance spring 0..1.
function milo2(pose, x, y, h, t, talk = 0, pop = 1, flip = false) {
  const [iw, ih] = POSE[pose], w = h * iw / ih;
  const bob = talk * Math.abs(Math.sin(t * 7.5)) * 4, sq = talk * Math.sin(t * 15) * 0.012;
  const k = back(clamp(pop));
  return `<g transform="translate(${x},${y - bob}) scale(${k * (1 + sq)},${k * (1 - sq)})">
    <ellipse cx="0" cy="${bob - 2}" rx="${w * 0.33}" ry="${h * 0.035}" fill="#000" opacity="0.35"/>
    <image href="${ASSETS['pose_' + pose]}" x="${-w / 2}" y="${-h}" width="${w}" height="${h}" ${flip ? 'transform="scale(-1,1)"' : ''}/></g>`;
}
// Caption bar at the bottom: white text on a dark rounded strip, soft in/out.
function cap(s, t, a, b, y = 694, size = 30, hl = null) {
  const op = Math.min(seg(t, a, a + 0.3), 1 - seg(t, b - 0.3, b));
  if (op <= 0) return '';
  const w = s.length * size * 0.56 + 60;
  let words = s;
  if (hl) words = s.replace(hl, `\u0000${hl}\u0001`);
  const parts = words.split(/(\u0000[^\u0001]*\u0001)/).map(p => p.startsWith('\u0000')
    ? `<tspan fill="${P.mustard}">${p.slice(1, -1)}</tspan>` : p.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('');
  return `<g opacity="${op}" transform="translate(640,${y + (1 - ease(seg(t, a, a + 0.3))) * 10})">
    <rect x="${-w / 2}" y="${-size - 10}" width="${w}" height="${size + 26}" rx="14" fill="#140f1e" opacity="0.82"/>
    <text x="0" y="0" font-family="Inter" font-weight="800" font-size="${size}" fill="#fff" text-anchor="middle">${parts}</text></g>`;
}
// Big title text with a yellow highlight box (style of the thumbnail).
function title(lines, t, a, b, cx, cy, size = 64) {
  const op = Math.min(seg(t, a, a + 0.3), 1 - seg(t, b - 0.3, b));
  if (op <= 0) return '';
  let s = `<g opacity="${op}" transform="translate(${cx},${cy}) scale(${back(seg(t, a, a + 0.45))}) ${fl(t, 7, 1.5)}">`;
  lines.forEach(([txtS, yel], i) => {
    const y = i * size * 1.12, w = txtS.length * size * 0.62 + 40;
    if (yel) s += `<rect x="${-w / 2}" y="${y - size * 0.85}" width="${w}" height="${size * 1.05}" rx="12" fill="${P.mustard}" transform="rotate(-2 0 ${y})"/>`;
    s += `<text x="0" y="${y}" font-family="Inter" font-weight="900" font-size="${size}" text-anchor="middle" fill="${yel ? INK : '#fff'}" stroke="${yel ? 'none' : INK}" stroke-width="${yel ? 0 : 8}" paint-order="stroke">${txtS}</text>`;
  });
  return s + '</g>';
}
// Chat bubble (phone message) that pops in.
function bubble(x, y, s, t, a, me = true, w = 220) {
  const p = seg(t, a, a + 0.35);
  if (p <= 0) return '';
  return `<g transform="translate(${x},${y}) scale(${back(p)}) ${fl(t, x % 7, 2)}" opacity="${p}">
    <rect x="${-w / 2}" y="-30" width="${w}" height="56" rx="24" fill="${me ? '#5aa7ff' : '#f1ede4'}" stroke="${INK}" stroke-width="4"/>
    ${txt(0, 8, s, 26, me ? '#fff' : INK, { weight: 800 })}</g>`;
}
function signTag(n, t, a, b) {
  const op = Math.min(seg(t, a, a + 0.25), 1 - seg(t, b - 0.3, b));
  if (op <= 0) return '';
  return `<g opacity="${op}" transform="translate(70,70) scale(${back(seg(t, a, a + 0.4))})">
    <rect x="0" y="-40" width="230" height="64" rx="14" fill="${P.mustard}" stroke="${INK}" stroke-width="5"/>
    ${txt(115, 7, `SIGN ${n} / 7`, 34, INK, { weight: 900 })}</g>`;
}
const vign = () => `<defs><radialGradient id="vgT" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.45"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#vgT)"/>`;

// ---------------- shots ----------------
const SHOTS = [0, 9, 15, 21, 28, 36, 44, 50];

function render(t) {
  let s = '';
  if (t < 9) {            // 1. Hook: the bed scene, 23:47
    s += bg(ASSETS.ot_bed, seg(t, 0, 9), 1.0, 1.12, 420, 520);
    s += glw(272, 572, 70, '#ffb35c', 0.18 + 0.06 * Math.sin(t * 2));            // clock glow
    s += glw(170, 390, 120, '#ffcf8a', 0.12 + 0.03 * Math.sin(t * 5));           // lamp flicker
    s += cap("It's 11:47 PM.", t, 0.6, 3.2);
    s += cap('6 hours ago you texted "haha ok"...', t, 3.4, 6.2, 694, 30, 'haha ok');
    s += cap('...and you still can\'t stop thinking about it.', t, 6.4, 8.9);
  } else if (t < 15) {    // 2. Phone, "Seen", spiralling thoughts
    const lt = t - 9;
    s += bg(ASSETS.loc_bedroom_desk, seg(lt, 0, 6), 1.04, 1.1);
    s += milo2('phone', 640, 650, 320, t, 0, seg(lt, 0, 0.4));
    s += bubble(880, 250, 'haha ok', lt, 0.5);
    s += `<g opacity="${seg(lt, 1.1, 1.4)}">${txt(940, 300, 'Seen ✓✓', 20, '#d9d2ff', { weight: 700 })}</g>`;
    ['did that sound rude?', 'are they mad at me?', 'why did I say that'].forEach((q, i) => {
      s += bubble(330 + (i % 2) * 40, 190 + i * 90, q, lt, 2.0 + i * 1.0, false, q.length * 13 + 40);
    });
  } else if (t < 21) {    // 3. Title on the whiteboard
    const lt = t - 15;
    s += bg(ASSETS.loc_whiteboard, seg(lt, 0, 6), 1.0, 1.05);
    s += title([['WHY YOU', false], ['OVERTHINK', true], ['EVERYTHING', false]], lt, 0.3, 5.8, 690, 230, 62);
    s += milo2('facepalm_stress', 1080, 660, 250, t, 0, seg(lt, 0.6, 1.0));
  } else if (t < 28) {    // 4. Why: the brain thinks replaying keeps you safe
    const lt = t - 21;
    s += bg(ASSETS.loc_whiteboard, seg(lt, 0, 7), 1.05, 1.1);
    s += milo2(lt < 3.6 ? 'thinking_gears' : 'presenting', 470, 655, lt < 3.6 ? 300 : 330, t, lt > 3.6 ? 1 : 0, seg(lt, 0, 0.35) + (lt > 3.6 ? 0 : 0));
    s += title([['REPLAYING', false], ['= SAFETY?', true]], lt, 0.5, 6.8, 760, 220, 52);
    s += cap('Your brain thinks replaying it will keep you safe.', t, 21.8, 24.6);
    s += cap('It doesn\'t. It just drains you.', t, 24.8, 27.8, 694, 30, 'drains you');
  } else if (t < 36) {    // 5. SIGN 1 — re-reading messages
    const lt = t - 28;
    s += bg(ASSETS.loc_cafe, seg(lt, 0, 8), 1.0, 1.08, 640, 400);
    s += milo2('phone', 520, 655, 310, t, 0, seg(lt, 0, 0.35));
    s += signTag(1, lt, 0.2, 7.8);
    ['haha ok', 'haha ok', 'haha ok'].forEach((q, i) => {
      const a = 1.2 + i * 0.6;
      s += bubble(800 + i * 30, 190 + i * 74, q, lt, a);
    });
    s += `<g opacity="${seg(lt, 3.2, 3.5)}" transform="translate(1010,470) scale(${back(seg(lt, 3.2, 3.6))})">${txt(3, 3, '× 27', 64, INK)}${txt(0, 0, '× 27', 64, P.mustard)}</g>`;
    s += cap('You re-read the same message 27 times.', t, 29.0, 35.8, 694, 30, '27 times');
  } else if (t < 44) {    // 6. SIGN 2 — rehearsing conversations
    const lt = t - 36;
    s += bg(ASSETS.loc_subway, seg(lt, 0, 8), 1.0, 1.06);
    s += milo2('talking', 480, 655, 320, t, 1, seg(lt, 0, 0.35));
    s += signTag(2, lt, 0.2, 7.8);
    [['"Hey, so... about yesterday"', 1.2], ['"No wait, too weird"', 3.0], ['"Hey! So, funny story..."', 4.8]].forEach(([q, a], i) => {
      const op = Math.min(seg(lt, a, a + 0.3), i < 2 ? 1 - seg(lt, a + 1.6, a + 1.9) : 1);
      if (op > 0) s += `<g opacity="${op}">${bubble(880, 210 + i * 40, q, lt, a, false, q.length * 13 + 40)}</g>`;
    });
    s += cap('You rehearse conversations that never happen.', t, 37.0, 43.8, 694, 30, 'never happen');
  } else {                // 7. End card / teaser
    const lt = t - 44;
    s += bg(ASSETS.loc_rooftop, seg(lt, 0, 6), 1.0, 1.06);
    s += milo2('idea', 560, 660, 300, t, 0, seg(lt, 0.2, 0.6));
    s += title([['5 MORE SIGNS', false], ['+ HOW TO STOP', true]], lt, 0.4, 6.0, 940, 230, 54);
    s += cap('Full video: Stop Overthinking — MiloLore', t, 45.4, 49.6, 694, 28);
  }
  s += vign();
  const dip = SHOTS.slice(1, -1).map(c => Math.max(0, 1 - Math.abs(t - c) / 0.18)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(dip * 0.9, 1 - seg(t, 0, 0.6), seg(t, 49.3, 50))), t, '#000');
}
