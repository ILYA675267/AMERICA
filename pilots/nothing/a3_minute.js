// Act 3 — "the minute together" (75 s). Milo and the viewer do nothing for 60 seconds.
// 0–10 intro + 3·2·1, 10–70 the minute with six temptations (10 s each), 70–75 the bloom.
const DUR = 75;
const MX = 640, MY = 400, MS = 0.9;
const T0 = 10;  // the minute starts here

// Sprout grows one step after each beaten temptation; continuous during the calm beat.
function sproutLevel(t) {
  let l = 0.25;
  for (let k = 0; k < 5; k++) l += 0.12 * back(seg(t, T0 + 10 * (k + 1) - 0.6, T0 + 10 * (k + 1) - 0.1));
  return clamp(l + 0.15 * seg(t, 60, 70));
}

function render(t) {
  const rem = clamp(60 - (t - T0), 0, 60);
  const k = t < T0 ? -1 : Math.min(5, Math.floor((t - T0) / 10));  // temptation index
  const lt = t - T0 - 10 * k;  // time inside the current beat
  const lvl = sproutLevel(t);
  const calm = ease(seg(t, 60, 63)) * (1 - ease(seg(t, 70, 71.5)));  // lights soften in the calm beat
  const bloom = seg(t, 70, 71);

  // ---- Milo's acting per beat ----
  const m = { level: lvl, t, pose: 'sit', mouth: 'flat', look: 0, armL: 10, armR: 10, rot: 0, flower: back(bloom) };
  let phoneX = 830, phoneBuzz = 0, phoneLit = 0, phoneLegs = 0, fridge = 0, bubble = 0, bubbleInner = '', tick = 0;
  let dx = 0;
  if (t < T0) {  // intro: talks to the viewer, kicks the phone away
    m.mouth = Math.floor(t * 5) % 2 && (t < 2.8 || (t > 3.2 && t < 5.2)) ? 'open' : 'smile';
    m.armR = lerp(10, 60, Math.sin(seg(t, 0.3, 1.6) * Math.PI));
    const kick = seg(t, 3.4, 4.2);
    phoneX = 830 + ease(kick) * 130;
    m.rot = -6 * Math.sin(seg(t, 3.3, 3.8) * Math.PI);
    if (t > 7) { m.eyes = undefined; m.mouth = 'flat'; }
  } else if (k === 0) {  // 1. the phone buzzes and crawls towards him
    phoneX = 960 - ease(seg(lt, 2.5, 7.2)) * 170 + ease(seg(lt, 7.6, 8.2)) * 170;
    phoneBuzz = [0.4, 1.6, 2.6, 4.2, 5.8].some(b => lt > b && lt < b + 0.5) ? 1 : 0;
    phoneLit = Math.max(phoneBuzz, 0.4 * seg(lt, 2.5, 3));
    phoneLegs = lt > 2.5 && lt < 7.4 ? 1 : 0;
    m.look = lerp(0, 20, seg(lt, 0.5, 1.2));
    m.eyes = lt > 3 && lt < 7.6 ? 'wide' : undefined;
    m.sweat = seg(lt, 4, 5) * (1 - seg(lt, 8, 8.5));
    m.mouth = lt > 3 && lt < 7.6 ? 'o' : 'flat';
    m.rot = lt > 7.4 && lt < 8.2 ? -10 * Math.sin(seg(lt, 7.4, 8.2) * Math.PI) : 0;  // nudges it away
    if (lt > 8.4) { m.look = 0; m.mouth = 'smile'; }
  } else if (k === 1) {  // 2. "Did I lock the door?"
    phoneX = 960;
    bubble = back(seg(lt, 1, 1.5)) * (1 - seg(lt, 7.4, 7.7));
    bubbleInner = `<g transform="translate(-95,-5)"><rect x="-30" y="-50" width="60" height="100" rx="6" fill="#8a6a50" stroke="${INK}" stroke-width="5"/><circle cx="18" cy="2" r="6" fill="${P.mustard}"/>
      <g transform="translate(36,-30) rotate(${Math.sin(t * 6) * 8})">${txt(0, 0, '?', 48, P.red)}</g></g>${txt(40, 12, 'Did I lock', 32, INK, { weight: 800 })}${txt(40, 48, 'the door?', 32, INK, { weight: 800 })}`;
    m.look = lt > 1.5 && lt < 7 ? (Math.floor(lt * 1.5) % 2 ? -16 : 16) : 0;
    m.mouth = lt > 1.5 && lt < 7.5 ? 'wobble' : 'flat';
    m.rot = lt > 7.2 && lt < 8.2 ? 8 * Math.sin(seg(lt, 7.2, 8.2) * Math.PI * 3) : 0;  // shakes head
    if (lt > 8.3) m.mouth = 'smile';
  } else if (k === 2) {  // 3. the fridge opens by itself
    phoneX = 960;
    fridge = ease(seg(lt, 1, 2)) * (1 - ease(seg(lt, 7, 7.8)));
    m.look = 22 * seg(lt, 1.6, 2.2) * (1 - seg(lt, 7, 7.5));
    m.rot = 10 * ease(seg(lt, 2.5, 4.5)) * (1 - ease(seg(lt, 5.8, 6.6)));
    m.eyes = lt > 2.2 && lt < 6 ? 'wide' : undefined;
    m.mouth = lt > 2.2 && lt < 6 ? 'o' : lt > 6.6 ? 'smile' : 'flat';
    dx = 0;
  } else if (k === 3) {  // 4. the brain-producer: "Just ONE short video?"
    phoneX = 960;
    bubble = back(seg(lt, 0.8, 1.3)) * (1 - seg(lt, 7.6, 8.0));
    bubbleInner = brainGuy(-110, 5, 0.75, t) + txt(55, -2, 'Just ONE', 34, INK, { weight: 900 }) + txt(55, 36, 'short video?', 30, INK, { weight: 800 });
    m.lid = lt > 3 && lt < 7.2 ? 0.35 : 0;
    m.mouth = lt > 2.5 && lt < 7.3 ? 'sad' : 'smile';
    m.rot = lt > 6 && lt < 7.4 ? 8 * Math.sin(seg(lt, 6, 7.4) * Math.PI * 3) : 0;
  } else if (k === 4) {  // 5. the silence gets loud
    phoneX = 960;
    tick = lt < 8 ? 1 : 1 - seg(lt, 8, 8.6);
    m.rot = Math.sin(t * 9) * 5 * seg(lt, 1.5, 2.5) * (1 - seg(lt, 7.5, 8.5));
    m.mouth = lt < 8 ? 'wobble' : 'flat';
    m.handR = lt > 3 && lt < 6 ? [114 + Math.sin(t * 25) * 5, -18] : undefined;  // scratches his head
    m.sweat = seg(lt, 2, 3) * (1 - seg(lt, 8, 9));
    m.eyes = lt > 1.5 && lt < 8 ? 'wide' : undefined;
    m.look = Math.sin(t * 2.2) * 14 * seg(lt, 1.5, 2) * (1 - seg(lt, 7.5, 8));
  } else {  // 6. calm: eyes closed, breathing
    phoneX = 960;
    m.eyes = lt > 0.8 || t >= 70 ? 'closed' : undefined;
    m.mouth = 'smile';
  }
  if (t >= 70) { m.eyes = t > 71.6 ? 'happy' : 'closed'; m.mouth = t > 71.6 ? 'grin' : 'smile'; m.armL = lerp(10, 150, ease(seg(t, 71.8, 72.4))); m.armR = m.armL; }
  const breathe = (k === 5 || t >= 70) ? Math.sin((t - 60) * 2 * Math.PI / 4) : 0;  // 4-second breath cycle
  m.squash = -0.02 * breathe;

  // ---- scene ----
  const warmBloom = ease(seg(t, 70.5, 72.5));
  let sc = roomBack(t, 1 - 0.4 * calm, { fridge, clockScale: 1 + 0.3 * tick * Math.abs(Math.sin(t * Math.PI)) });
  sc += `<ellipse cx="${MX}" cy="640" rx="120" ry="14" fill="#000" opacity="0.45"/>`;
  sc += milo(MX + dx, MY, MS, m) + chairFront();
  sc += floorPhone(phoneX, 626, t, phoneLit, phoneBuzz, phoneLegs);
  sc += thought(400, 200, 420, 150, bubble, bubbleInner);
  if (fridge > 0) sc += `<path d="M1015 305 L760 640 L1180 640 Z" fill="#fff2c4" opacity="${0.18 * fridge}" filter="url(#glow)" style="mix-blend-mode:screen"/>` +
    `<g opacity="${seg(lt, 2, 2.4) * (1 - seg(lt, 6, 6.4))}">${txt(1095, 270, 'psst...', 34, '#fff2c4', { weight: 800 })}</g>`;
  if (tick > 0) {  // TICK / TOCK pulsing next to the clock
    const sec = Math.floor(t), ph = t - sec;
    sc += `<g opacity="${tick * (1 - ph)}" transform="translate(${sec % 2 ? 1060 : 800},${sec % 2 ? 150 : 120}) scale(${1 + ph * 0.4})">${txt(0, 0, sec % 2 ? 'TOCK' : 'TICK', 46, P.cream, { weight: 900 })}</g>`;
  }
  sc += roomLight(t, 1 - 0.4 * calm);
  sc += pool('breath', MX, MY + 30, 260 + 30 * breathe, 240 + 30 * breathe, '#ffd9a0', (0.18 + 0.1 * breathe) * calm);
  sc += pool('bloom', MX, MY - 60, 700 * warmBloom + 1, 520 * warmBloom + 1, '#ffc27a', 0.5 * warmBloom);
  sc += burst(MX + 30, MY - 150, seg(t, 70.3, 72.3), 40, '#ffd45e') + burst(MX + 30, MY - 150, seg(t, 70.5, 72.8), 30, '#ffb3c7');
  sc += dust(t, 200, 150, 880, 450, 34, '#ffe2a8', 0.4 + 0.3 * calm);
  sc += shade('sh3', 640, 420, 0.7 - 0.12 * calm + 0.2 * warmBloom, 0.6 + 0.2 * calm - 0.3 * warmBloom) + vignette();
  // camera: slow push during the minute, a little closer in the calm beat
  const z = lerp(1.0, 1.06, seg(t, 0, 60)) + 0.08 * ease(seg(t, 60, 66)) - 0.05 * warmBloom;
  let s = cam(sc, z, 640, 420);

  // ---- overlays ----
  s += line('Let\'s do it together.', t, 0.4, 3.0);
  s += line('60 seconds. No phone. No talking.', t, 3.2, 5.6);
  s += line('Just breathe. I\'ll do it with you.', t, 5.8, 8.0);
  const cd = t >= 7.6 && t < T0 ? String(3 - Math.floor((t - 7.6) / 0.8)) : null;
  s += timerRing(t < T0 ? 60 : rem, t, seg(t, 7.6, 8.2) * (1 - seg(t, 71.5, 72.5)), seg(t, 60, 61) * (1 - seg(t, 70, 70.5)) + (cd ? 0.3 * (1 - ((t - 7.6) % 0.8) / 0.8) : 0), cd);
  s += hudBar(60, 72, 'BRAIN', lerp(0.23, 1, (lvl - 0.25) / 0.75), chargeColor(lerp(0.23, 1, (lvl - 0.25) / 0.75)), seg(t, 9.5, 10.5) * (1 - seg(t, 72, 73)));
  // small hint lines during the minute (sparse, so the viewer can rest too)
  s += line('Don\'t pick it up.', t, T0 + 3, T0 + 7.5);
  s += line('Let the thought pass.', t, T0 + 13, T0 + 17.5);
  s += line('You\'re not hungry. You\'re bored.', t, T0 + 23, T0 + 27.5);
  s += line('Not now.', t, T0 + 34, T0 + 37.5);
  s += line('This is what bored feels like. It\'s okay.', t, T0 + 43, T0 + 47.5);
  s += line('Breathe in...', t, 60.5, 62.4, 668, 34);
  s += line('...and out.', t, 62.5, 64.4, 668, 34);
  s += line('Almost there.', t, 66, 69.5, 668, 34);
  s += big('You just did something', t, 72.2, 75.2, 610, 46);
  s += big('most people won\'t do today.', t, 72.7, 75.2, 668, 46, P.mustard);
  return sframe(s + fade(Math.max(1 - seg(t, 0, 0.5), seg(t, 74.4, 75))), t, '#000');
}
