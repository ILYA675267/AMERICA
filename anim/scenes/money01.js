// Money ep.01 "What If You Saved $10 a Day for 10 Years?" — full video.
// DATA (injected by render.js --data scenes.json): [{ch, en, ons, dur}] per scene, in order.
// Each scene draws itself for local time t in [0, d]; the framework adds the on-screen label, subtitles and transitions.
const GY = 930;                                   // ground line
const SUBS = true;
let TT = 0;                                       // global time (for blinking)
// Hero with automatic "talking" gestures: on every phrase (beat) the arms move to a new pose and he does a small hop.
let BEAT = 0, BEATT = 0, SCN = 0, BG = '#efebe2', PHRASE = '';
const GESTURES = [[[-150, -150], [150, -150]], [[-150, -150], [190, -330]], [[-200, -260], [200, -260]], [[-190, -330], [150, -150]], [[-120, -240], [120, -240]]];
function hero(x, k = 1.6, o = {}) {
  const g = i => GESTURES[(i + SCN * 2) % GESTURES.length], f = ease(BEATT / 0.3), a = g(Math.max(0, BEAT - 1)), b = g(BEAT);
  const pose = side => [lerp(a[side][0], b[side][0], f), lerp(a[side][1], b[side][1], f)];
  const hop = BEAT > 0 ? Math.sin(clamp(BEATT / 0.35) * Math.PI) * 26 : 0;
  const auto = { bob: Math.sin(TT * 3) * 4 - hop, blink: (TT % 3.7) > 3.58, tilt: Math.sin(TT * 1.3) * 0.04 };
  if (!o.armL) auto.armL = pose(0); if (!o.armR) auto.armR = pose(1);
  heroFront(x, GY - hop * k * 0.6, k, Object.assign(auto, o));
  // reaction icon above the head for the current phrase: "?" for questions, "!" for exclamations, sweat drop on bad news
  const rx = x + 70 * k, ry = GY - 470 * k - hop * k * 0.6, wob = Math.sin(TT * 9) * 0.12, ap = easeOutBack(BEATT / 0.3);
  if (/\?$/.test(PHRASE)) at(rx, ry, k * 0.55 * ap, wob, () => marker('?', 0, 0, 150, { color: '#4a7cff', outline: true }));
  else if (/!$/.test(PHRASE)) at(rx, ry, k * 0.55 * ap, wob, () => marker('!', 0, 0, 150, { color: RED, outline: true }));
  else if (/crash|thief|lose|losses|quit|hard|shrank|screaming|debt|panick/i.test(PHRASE)) at(x + 130 * k, GY - 380 * k, k * ap, 0, () => {
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.bezierCurveTo(22, -4, 20, 22, 0, 22); ctx.bezierCurveTo(-20, 22, -22, -4, 0, -34); ink('#9fd3ff', 5); });
  // little emphasis marks next to the head right after a new phrase starts
  if (BEAT > 0 && BEATT < 0.45) { const al = 1 - BEATT / 0.45; ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.lineCap = 'round';
    const hx = x + 150 * k, hy = GY - 300 * k; for (let j = -1; j <= 1; j++) { const an = -0.6 + j * 0.45; ctx.beginPath(); ctx.moveTo(hx + Math.cos(an) * 20 * k, hy + Math.sin(an) * 20 * k); ctx.lineTo(hx + Math.cos(an) * (40 + 20 * (1 - al)) * k, hy + Math.sin(an) * (40 + 20 * (1 - al)) * k); ctx.stroke(); } ctx.restore(); }
}
const counter = (x, y, v, size = 120, color = GREEN) => marker(money(v), x, y, size, { color, outline: true });
const grow = (t, t0, d, a, b) => lerp(a, b, ease((t - t0) / d));
// Painted backgrounds (anim/bg). Drawn a bit larger than the frame so camera moves never show an edge.
// IP(x, y) converts a point on the 1672x941 picture into world coordinates.
const BGX = -80, BGY = -45, BGS = 2080 / 1672;
const IP = (x, y) => [BGX + x * BGS, BGY + y * BGS];
function bgImg(name) { const im = window.IMG && IMG[name]; if (im) ctx.drawImage(im, BGX, BGY, 2080, 941 * BGS); }
const DESK = { x: 1180, y: 592 };   // top of the desk in the hero's room (bg01)
const HILL = x => 514 + 0.1765 * (x + 80);   // snow hill surface line (bg05)
// Street backdrop (same neighbourhood as the reference clip), built once and drawn behind outdoor scenes, faded into the paper.
const STREET = (() => { const n = WORLD.length; buildStreet(); return WORLD.splice(n); })();
function backdrop(t, dx = 0, fadeAmt = 0.42) {
  const k = 1.3;
  ctx.save(); ctx.translate(960 - 960 * k + dx, GY - 42 - 760 * k); ctx.scale(k, k);
  for (const it of STREET) it.d ? rc.draw(it.d) : it.f(t);
  ctx.restore();
  ctx.globalAlpha = fadeAmt; ctx.fillStyle = BG; ctx.fillRect(-500, -500, W + 1000, H + 1000); ctx.globalAlpha = 1;
}

const S = [
 // 00 $10 = coffee / delivery / subscriptions
 (t, d) => { hero(520, 1.6, { armR: [170, -260], face: 'smile' }); bill(780, 520, 200, -0.2);
   const k = Math.min(2, Math.floor(t / (d / 3))), tt = t - k * d / 3, s = pop(tt, 0);
   at(1200, GY, s * 0.9, 0, () => { if (k === 0) { coffee(-90, 0, 1.6); muffin(130, 0, 1.6); } else if (k === 1) bag(0, 0, 1.8); else { screen(-130, -40, 220, 160, '#ffd0cc', 1); screen(130, -40, 220, 160, '#cfe0ff', 1); } }); },
 // 01 what if you didn't — lottery / crypto / magic crossed out
 (t, d) => { hero(420, 1.6, { armR: [160, -230], face: 'flat' }); bill(660, 560, 180, -0.2);
   [[1000, ticket], [1350, cryptoCoin], [1680, wand]].forEach(([x, f], i) => { const t0 = 0.6 + i * d * 0.22; at(x, 560, pop(t, t0), 0, () => f(0, 0)); crossOut(x, 560, 90, (t - t0 - 0.4) / 0.5); }); },
 // 02 jar grows huge, hero looks up in shock
 (t, d) => { const h = grow(t, 0.8, d - 1.2, 260, 760); jar(1250, GY, h, clamp(t / d), 3); hero(520, 1.5, { face: t > 1.5 ? 'shock' : 'smile', tilt: -0.08 }); if (t < 1.2) bill(1250, lerp(300, GY - 120, t / 1.2), 140, t * 3); },
 // 03 disclaimer
 (t, d) => { hero(960, 1.6, { face: 'smile', tilt: Math.sin(t * 5) * 0.05 * (t < 1.5) , armR: [150, -150], armL: [-150, -150] }); },
 // 04 day one: walk out of the coffee shop... then drop the bill into the jar on the desk at home
 (t, d) => { const cut = d * 0.55;
   if (t < cut) { heroWalk(420 + heroWalkX(t, 0.55), GY, 0.55, t, { blink: true }); return; }
   const lt = t - cut; jar(DESK.x, DESK.y, 200, lt > 1.4 ? 0.05 : 0, 5); hero(880, 1.25, { armR: [240, -400] });
   const p = clamp((lt - 0.6) / 0.7); if (p < 1) bill(lerp(1180, DESK.x, p), lerp(400, DESK.y - 60, p), 100, p * 4); },
 // 05 lonely bill at the bottom, shrug
 (t, d) => { jar(DESK.x, DESK.y, 220, 0.04, 6); hero(760, 1.6, { face: 'flat', armL: [-190, -330], armR: [190, -330] }); },
 // 06 the math: $70/week -> $300/month -> $3,650/year
 (t, d) => { hero(380, 1.5, { armR: [180, -300], face: 'smile' });
   const rows = [['$10', 'a day'], ['$70', 'a week'], ['$300', 'a month'], ['$3,650', 'a year']];
   rows.forEach(([a, b], i) => { const t0 = 0.3 + i * d / 4.6; const s = pop(t, t0); if (s <= 0) return;
     at(1150, 260 + i * 125, s, 0, () => { marker(a, -60, 0, 96, { color: i === 3 ? GREEN : C.ink, outline: i === 3, align: 'right' }); marker(b, 0, 6, 64, { align: 'left' }); }); }); },
 // 07 full jar, thief peeks out
 (t, d) => { jar(1000, GY, 600, 1, 7); hero(480, 1.5, { face: 'grin' }); const p = ease((t - d * 0.55) / 0.8); at(lerp(2150, 1720, p), GY, 1.2, -0.1 * p, () => thief(0, 0, 1)); },
 // 08 inflation thief steals, burger price climbs
 (t, d) => { const f = 1 - 0.15 * clamp(t / d); jar(820, GY, 560, f, 7); thief(1250, GY, 1.2, t);
   for (let k = 0; k < 3; k++) { const p = ((t * 0.7 + k / 3) % 1); bill(lerp(900, 1330, p), lerp(GY - 520, GY - 420, p) - Math.sin(p * 3.14) * 120, 110, p * 3); }
   at(1640, 330, 1, 0, () => { ctx.beginPath(); ctx.ellipse(0, 0, 120, 50, 0, Math.PI, 0); ink('#e0a35a'); ctx.beginPath(); ctx.rect(-125, 0, 250, 30); ink('#7a4a2a'); ctx.beginPath(); ctx.ellipse(0, 40, 120, 22, 0, 0, Math.PI); ink('#e0a35a');
     marker('$' + (5 * Math.pow(1.03, clamp(t / d) * 10)).toFixed(2), 0, 130, 70, { color: RED }); }); },
 // 09 jar shrinks, value drops
 (t, d) => { const p = ease(t / d); jar(1200, GY, lerp(620, 520, p), 1, 7); hero(520, 1.6, { face: p > 0.4 ? 'sad' : 'flat' }); counter(1530, 300, lerp(36500, 31500, p), 84, p > 0.5 ? RED : C.ink); },
 // 10 the bank
 (t, d) => { hero(400, 1.45, { face: 'smile', armR: [200, -200] }); jar(800, GY, 260, 1, 7); counter(1450, 270, grow(t, 0.8, d - 1.2, 36500, 44800), 110); },
 // 11 rates swing, door "option 3"
 (t, d) => { at(700, 560, 1, 0, () => { ctx.beginPath(); ctx.arc(0, 0, 220, Math.PI, 0); ink('#fff'); for (let k = 0; k <= 6; k++) { const a = Math.PI + k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 190, Math.sin(a) * 190); ctx.lineTo(Math.cos(a) * 215, Math.sin(a) * 215); ink(null, 4); }
     const a = Math.PI * 1.5 + Math.sin(t * 2.5) * 0.9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 170, Math.sin(a) * 170); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.stroke(); marker('RATE', 0, 60, 54); });
   door(1500, GY, clamp((t - d * 0.5) / 0.8)); marker('OPTION 3', 1500, GY - 300, 54); hero(1080, 1.3, { face: 'smile', tilt: 0.1 }); },
 // 12 index fund: a whole city of companies, hero takes a slice
 (t, d) => { const r = rng(12); for (let k = 0; k < 16; k++) building(780 + k * 70 + (k % 2) * 6, GY - 40, 64, 180 + r() * 260, k);
   const p = ease((t - d * 0.45) / 1); ctx.fillStyle = 'rgba(255,211,77,0.45)'; ctx.fillRect(780 + 7 * 70 - 34, GY - 520, 70, 480); hero(380, 1.5, { face: 'grin', armR: [200, -280] }); if (p > 0) bill(lerp(1300, 620, p), lerp(GY - 300, GY - 440, p), 120); },
 // 13 market chart drawn on
 (t, d) => { chart(620, 650, 1020, 440, marketPts(13, 60, 0.85, 0.07, [[0.3, 0.12], [0.62, 0.18]]), clamp(t / (d * 0.8))); hero(300, 1.2, { face: 'smile', armR: [170, -260] }); },
 // 14 viewer guess (A/B/C card with a ticking timer), then the reveal: two stacks — what you put in vs what money made
 (t, d) => { const r0 = SC[14].beats[7];
   if (t < r0) { const opts = [['A', '$36,000'], ['B', '$50,000'], ['C', '$100,000']];
     hero(330, 1.4, { face: 'flat', armR: [150, -330] });
     opts.forEach(([l, v], k) => { const sc = pop(t, SC[14].beats[2 + k]); if (sc <= 0) return;
       at(1100, 300 + k * 190, sc, 0, () => { ctx.beginPath(); ctx.roundRect(-330, -70, 660, 140, 24); ink('#fff'); ctx.beginPath(); ctx.arc(-250, 0, 46, 0, 7); ink(YELLOW); marker(l, -250, 4, 64); marker(v, 40, 4, 84, { color: GREEN }); }); });
     const tp = clamp(t / r0); ctx.beginPath(); ctx.arc(1620, 760, 90, 0, 7); ink('#fff'); ctx.beginPath(); ctx.moveTo(1620, 760); ctx.arc(1620, 760, 80, -Math.PI / 2, -Math.PI / 2 + tp * Math.PI * 2); ctx.closePath(); ctx.fillStyle = 'rgba(232,72,63,0.6)'; ctx.fill();
     ctx.beginPath(); ctx.moveTo(1620, 760); ctx.lineTo(1620 + Math.cos(-Math.PI / 2 + tp * 6.28) * 70, 760 + Math.sin(-Math.PI / 2 + tp * 6.28) * 70); ink(null, 7);
     return; }
   t -= r0; d -= r0;
   const a = clamp(t / (d * 0.4)), b = clamp((t - d * 0.4) / (d * 0.45));
   for (let k = 0; k < Math.round(28 * a); k++) bill(1050 + (k % 2) * 6, GY - 20 - k * 16, 230, 0, '$100');
   for (let k = 0; k < Math.round(12 * b); k++) bill(1050 + (k % 2) * 6, GY - 20 - 28 * 16 - k * 16, 230, 0, '$100');
   marker('YOU: $36,500', 1230, GY - 220, 60, { align: 'left' }); if (b > 0) marker('MONEY: +$16,100', 1230, GY - 560, 60, { align: 'left', color: GREEN });
   hero(480, 1.5, { face: b > 0.5 ? 'shock' : 'smile' }); },
 // 15 fee bug nibbles the stack
 (t, d) => { for (let k = 0; k < 30; k++) bill(1100 + (k % 2) * 6, GY - 20 - k * 16, 230, 0, '$100');
   at(1290 + Math.sin(t * 8) * 6, GY - 260, 1, 0, () => { ctx.beginPath(); ctx.ellipse(0, 0, 60, 40, 0, 0, 7); ink('#7a8f3a'); ctx.beginPath(); ctx.arc(-58, -6, 24, 0, 7); ink('#7a8f3a'); for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(k * 22, 30); ctx.lineTo(k * 26 + Math.sin(t * 20 + k) * 6, 62); ink(null, 4); } marker('1%', 0, 0, 40, { color: '#fff' }); });
   hero(480, 1.5, { face: 'flat' }); },
 // 16 snowball of coins rolls down the painted hill and grows
 (t, d) => { const p = clamp(t / d), x = lerp(120, 1750, p * p * 0.6 + p * 0.4), r = lerp(26, 220, p * p);
   snowball(x, HILL(x) - r * 0.95, r, p * 16); const hx = 60 + p * 160; heroWalk(hx, HILL(hx), 0.33, t); },
 // 17 "Einstein" quote with a question mark
 (t, d) => { hero(760, 1.6, { wildHair: true, mustache: true, face: 'smile', armR: [190, -300] }); at(1300, 420, pop(t, d * 0.5), 0, () => marker('?', 0, 0, 380, { color: RED, outline: true })); },
 // 18 Rule of 72 on a board, money doubles
 (t, d) => { const q = clamp(t / 1.2); ctx.save(); ctx.beginPath(); ctx.rect(560, 280, 800 * q, 300); ctx.clip(); marker('72 ÷ 7 = ~10', 961, 430, 120); ctx.restore();
   const p = clamp((t - d * 0.5) / 1); for (let k = 0; k < 6 + Math.round(6 * p); k++) bill(1380, GY - 20 - k * 18, 200, 0, '$100'); hero(900, 1.0, { armL: [-200, -330] }); },
 // 19 year 1: magnifying glass on a tiny coin
 (t, d) => { calendar(1500, 420, 'YEAR 1'); hero(700, 1.6, { face: 'flat', armR: [230, -150] });
   ctx.beginPath(); ctx.arc(1000, GY - 230, 70, 0, 7); ink('rgba(214,230,232,0.6)', 9); ctx.beginPath(); ctx.moveTo(950, GY - 180); ctx.lineTo(900, GY - 120); ink(null, 16); coin(1000, GY - 230, 12); },
 // 20 year 3: friends leave with phones and suitcases (airport)
 (t, d) => { calendar(1180, 330, 'YEAR 3', 0.7); jar(330, GY, 340, 0.3, 8); hero(720, 1.35, { face: 'flat' });
   const p = clamp(t / d); heroFront(1150 + p * 380, GY, 1.0, { cap: RED, face: 'grin', armR: [160, -240], armL: [-150, -150] });
   heroFront(1500 + p * 380, GY, 1.0, { glasses: true, face: 'grin', armR: [150, -120] });
   ctx.beginPath(); ctx.roundRect(1500 + p * 380 + 150, GY - 140, 100, 140, 12); ink('#4a7cff'); },
 // 21 crash
 (t, d) => { const pts = marketPts(21, 40, 0.6, 0.04); for (let i = 26; i < 40; i++) pts[i][1] = Math.max(0.05, pts[i][1] - 0.32 * clamp((i - 26) / 3));
   chart(560, 640, 880, 400, pts, clamp(t / (d * 0.6)), clamp(t / (d * 0.6)) > 0.66 ? RED : GREEN); hero(330, 1.3, { face: t > d * 0.45 ? 'shock' : 'smile' });
   if (t > d * 0.45) { newsTV(1500, 330, t); newsTV(1750, 560, t + 1); newsTV(1250, 980 - 90, t + 2); } },
 // 22 history: crashes and recoveries
 (t, d) => { chart(300, 660, 1340, 480, marketPts(22, 90, 1.05, 0.05, [[0.15, 0.12], [0.38, 0.2], [0.6, 0.15], [0.82, 0.22]]), clamp(t / (d * 0.85))); },
 // 23 calendar flipping years, counter speeds up
 (t, d) => { const y = 5 + Math.min(4, Math.floor(t / (d / 5))); calendar(1400, 420, 'YEAR ' + y); const v = [21776, 26500, 32850, 37500, 43300][y - 5];
   counter(1400, 640, v, 120); jar(700, GY, 300 + (y - 5) * 60, 0.4 + (y - 5) * 0.12, 9); hero(380, 1.4, { face: 'smile' }); },
 // 24 year 10: the snowball rolls on its own, hero walks beside it
 (t, d) => { const x = 300 + heroWalkX(t, 0.5); backdrop(t, -heroWalkX(t, 0.5) * 0.4); heroWalk(x, GY, 0.5, t, { blink: true }); snowball(x + 360, GY - 160, 160, t * 3); counter(1500, 240, 3400, 110); marker('per year', 1500, 340, 60); },
 // 25 30 years: jar the size of a house
 (t, d) => { const h = grow(t, 0.3, d * 0.6, 300, 860); jar(1300, GY, h, 1, 10); at(700, GY, 0.9, 0, () => { ctx.beginPath(); ctx.rect(-150, -260, 300, 260); ink('#f6f4ee'); ctx.beginPath(); ctx.moveTo(-180, -260); ctx.lineTo(0, -400); ctx.lineTo(180, -260); ctx.closePath(); ink('#f6f4ee'); ctx.beginPath(); ctx.rect(-30, -120, 60, 120); ink('#fff'); });
   hero(260, 1.0, { face: 'shock' }); counter(560, 330, grow(t, 0.3, d * 0.6, 52600, 371000), 110); },
 // 26 40 years: skyscraper jar, old hero with glasses and cane
 (t, d) => { const h = grow(t, 0.3, d * 0.6, 600, 1500); ctx.save(); ctx.translate(1300, GY); ctx.scale(h / 1500, h / 1500); jar(0, 0, 1500, 1, 11); ctx.restore();
   hero(600, 1.3, { glasses: true, cane: true, mustache: true, face: 'shock', tilt: -0.12 }); counter(420, 330, grow(t, 0.3, d * 0.6, 371000, 798000), 100); },
 // 27 two runners: start at 25 vs 35
 (t, d) => { ctx.beginPath(); ctx.moveTo(200, GY); ctx.lineTo(200, GY - 520); ink(null, 6); marker('START', 200, GY - 560, 50);
   const a = 260 + heroWalkX(t, 0.4) * 1.8, b = t > d * 0.35 ? 260 + heroWalkX(t - d * 0.35, 0.4) * 1.8 : 260;
   heroWalk(Math.min(a, 1300), GY - 280, 0.4, t); marker('25', Math.min(a, 1300), GY - 470, 60);
   if (t > d * 0.35) heroWalk(b, GY, 0.4, t); else hero(260, 0.62, { face: 'flat' }); marker('35', b, GY - 190, 60);
   jar(1650, GY - 280, 300, 1, 12); jar(1650, GY, 150, 1, 13); },
 // 28 Buffett: old man with newspaper, money mountain at the end of a timeline
 (t, d) => { const BY = 660; ctx.beginPath(); ctx.moveTo(300, BY); ctx.lineTo(1660, BY); ink(null, 6); for (const [x, l] of [[300, '0'], [820, '30'], [1270, '65'], [1640, '90']]) { ctx.beginPath(); ctx.moveTo(x, BY); ctx.lineTo(x, BY - 20); ink(null, 5); marker(l, x + 34, BY - 40, 44); }
   const p = clamp(t / (d * 0.8)); ctx.beginPath(); ctx.moveTo(300, BY); for (let k = 0; k <= 60; k++) { const f = k / 60, x = 300 + f * 1340 * p; ctx.lineTo(x, BY - Math.pow(f * p, 6) * 470); } ctx.lineTo(300 + 1340 * p, BY); ctx.closePath(); ink(MONEY);
   hero(230, 0.9, { glasses: true, mustache: true, armR: [90, -190], armL: [-90, -190] }); ctx.beginPath(); ctx.rect(150, GY - 228, 160, 108); ink('#f4f1e8', 4); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(168, GY - 205 + k * 20); ctx.lineTo(292, GY - 205 + k * 20); ink(null, 3); } },
 // 29 present bias: coffee now vs jar far away
 (t, d) => { coffee(760, GY - 200, 2.2); jar(1650, GY - 300, 140, 1, 14); ctx.beginPath(); ctx.moveTo(900, GY - 300); ctx.lineTo(1580, GY - 300); ctx.setLineDash([16, 18]); ink(null, 5); ctx.setLineDash([]); marker('NOW', 760, 300, 80); marker('10 YEARS', 1650, 440, 56); hero(340, 1.4, { face: 'grin' }); },
 // 30 hand reaches for coffee, other hand stops it
 (t, d) => { const p = Math.sin(clamp(t / d) * Math.PI); coffee(1100, GY - 140, 2); hero(700, 1.6, { armR: [lerp(150, 260, p), -260], armL: [lerp(-150, 230, clamp(t / d * 2 - 0.6)), -260], face: t > d * 0.5 ? 'flat' : 'grin' }); },
 // 31 Save More Tomorrow: two economists at a board
 (t, d) => { marker('RAISE', 720, 380, 70); piggy(1230, 560, 0.85, clamp(t / d));
   const p = clamp((t - 0.5) / 1.5); ctx.beginPath(); ctx.moveTo(840, 380); ctx.quadraticCurveTo(1000, 300, lerp(840, 1110, p), lerp(380, 470, p)); ink(null, 9);
   heroFront(330, GY, 1.1, { glasses: true, armR: [200, -330] }); heroFront(1600, GY, 1.1, { mustache: true, armL: [-200, -300] }); },
 // 32 savings rate bars
 (t, d) => { const a = clamp(t / 1), b = clamp((t - 1) / (d - 1.5));
   ctx.beginPath(); ctx.rect(800, GY - 120 * a, 220, 120 * a); ink('#d3d8da'); marker('3.5%', 910, GY - 170, 80);
   ctx.beginPath(); ctx.rect(1200, GY - 470 * b, 220, 470 * b); ink(MONEY); if (b > 0.1) marker('13.6%', 1310, GY - 470 * b - 60, 80, { color: GREEN, outline: true }); hero(400, 1.4, { face: b > 0.6 ? 'grin' : 'smile' }); },
 // 33 it's not about coffee: other sources of $10
 (t, d) => { coffee(560, GY - 200, 1.5); crossOut(560, GY - 330, 140, (t - 0.3) / 0.6);
   const items = [() => { screen(0, 0, 230, 170, '#ffd0cc', 1); crossOut(0, -85, 70, (t - 1.8) / 0.5); }, () => { ctx.beginPath(); ctx.ellipse(0, -40, 110, 40, 0, 0, 7); ink('#3a3a3a'); ctx.beginPath(); ctx.roundRect(100, -55, 140, 26, 10); ink('#3a3a3a'); }, () => { ctx.beginPath(); ctx.rect(-110, -160, 220, 160); ink('#e3c79a'); marker('SELL', 0, -80, 50); }];
   items.forEach((f, i) => at(1050 + i * 330, GY - 60, pop(t, 1 + i * 0.6), 0, f)); },
 // 34 emergency fund first, then cut the card
 (t, d) => { piggy(620, GY, 1.4, clamp(t / (d * 0.5))); const p = clamp((t - d * 0.5) / 0.8); card(1350, GY - 260, 0.1, p);
   if (p > 0) at(1350, GY - 260, 1, -0.3, () => { ctx.beginPath(); ctx.arc(-20, 120 - 30 * p, 30, 0, 7); ink('#ddd'); ctx.beginPath(); ctx.arc(30, 140 - 30 * p, 30, 0, 7); ink('#ddd'); ctx.beginPath(); ctx.moveTo(0, 100 - 30 * p); ctx.lineTo(10, -140); ink(null, 10); }); },
 // 35 automate: phone sends money by itself, hero drinks tea
 (t, d) => { ctx.beginPath(); ctx.roundRect(1100, 220, 360, 640, 40); ink('#3a3a3a'); ctx.beginPath(); ctx.roundRect(1125, 260, 310, 560, 20); ink('#f4f1e8', 4);
   ctx.beginPath(); ctx.roundRect(1160, 300, 110, 110, 20); ink('#cfe0ff'); ctx.beginPath(); ctx.roundRect(1290, 650, 110, 110, 20); ink(MONEY);
   for (let k = 0; k < 3; k++) { const p = (t * 0.5 + k / 3) % 1; bill(lerp(1215, 1345, p), lerp(355, 705, p), 80, p * 2); }
   hero(560, 1.5, { face: 'smile', armR: [140, -240] }); coffee(770, GY - 345, 0.45); },
 // 36 one in three can't cover $400
 (t, d) => { [560, 960, 1360].forEach((x, i) => heroFront(x, GY, 1.2, { face: i === 1 && t > 1 ? 'shock' : 'smile', armL: i === 1 && t > 1 ? [-130, -330] : undefined, armR: i === 1 && t > 1 ? [130, -330] : undefined, cap: i === 0 ? RED : undefined, glasses: i === 2 }));
   if (t > 1) at(960, 330, pop(t, 1), 0, () => { ctx.beginPath(); ctx.rect(-130, -80, 260, 160); ink('#fff'); marker('BILL $400', 0, 0, 52, { color: RED }); }); },
 // 37 broken car: calm, money from the jar
 (t, d) => { at(1400, GY, 0.9, 0, () => { ctx.beginPath(); ctx.roundRect(-330, -220, 660, 160, 40); ink('#ffb3a7'); ctx.beginPath(); ctx.moveTo(-200, -220); ctx.lineTo(-130, -330); ctx.lineTo(130, -330); ctx.lineTo(200, -220); ink('#d3d8da'); for (const x of [-200, 200]) { ctx.beginPath(); ctx.arc(x, -60, 60, 0, 7); ink('#3a3a3a'); }
     for (let k = 0; k < 3; k++) { const p = (t * 0.6 + k / 3) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(-300 + Math.sin(p * 6) * 20, -240 - p * 300, 30 + p * 40, 0, 7); ink('#fff', 4); ctx.globalAlpha = 1; } });
   jar(300, GY, 360, 0.8, 15); hero(660, 1.4, { face: 'smile', armL: [-230, -280] }); const bp = clamp(t / 1.5); bill(lerp(300, 340, bp), lerp(GY - 300, GY - 420, bp), 110, 0.2); },
 // 38 freedom: doors of the hallway light up one by one, each with a new life inside
 (t, d) => { const doors = [[IP(158, 182), IP(310, 782)], [IP(1252, 256), IP(1370, 718)], [IP(688, 366), IP(983, 524)]];
   const icons = [(x, y) => { ctx.beginPath(); ctx.roundRect(x - 50, y - 30, 100, 70, 8); ink('#8a5a3c'); ctx.beginPath(); ctx.roundRect(x - 20, y - 46, 40, 18, 6); ink(null, 5); },
     (x, y) => building(x, y + 70, 70, 150, 3), (x, y) => { ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.lineTo(x, y - 50); ctx.lineTo(x + 50, y); ctx.closePath(); ink(RED); ctx.beginPath(); ctx.rect(x - 40, y, 80, 60); ink('#fff'); }];
   doors.forEach(([[x1, y1], [x2, y2]], i) => { const o = clamp((t - 0.5 - i * d * 0.22) / 0.6); if (o <= 0) return;
     ctx.fillStyle = `rgba(255,214,102,${0.6 * o})`; ctx.fillRect(x1, y1, x2 - x1, y2 - y1); ctx.save(); ctx.globalAlpha = o; icons[i]((x1 + x2) / 2, (y1 + y2) / 2); ctx.restore(); });
   hero(960, 1.4, { face: 'grin', armR: [200, -330], armL: [-200, -330] }); },
 // 39 evening in the room: night tint, warm desk lamp, full jar on the desk
 (t, d) => { ctx.fillStyle = 'rgba(40,50,90,0.18)'; ctx.fillRect(-200, -200, W + 400, H + 400);
   const g = ctx.createRadialGradient(1640, 470, 20, 1640, 470, 520); g.addColorStop(0, 'rgba(255,214,102,0.55)'); g.addColorStop(1, 'rgba(255,214,102,0)'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
   jar(DESK.x, DESK.y, 220, 1, 16); hero(720, 1.5, { face: 'smile' }); },
 // 40 a new bill into an empty jar on the desk
 (t, d) => { jar(DESK.x, DESK.y, 220, 0, 17); hero(880, 1.3, { armR: [230, -420], face: 'grin' }); const p = clamp((t - d * 0.4) / 0.8); if (p < 1) bill(lerp(1180, DESK.x, p), lerp(380, DESK.y - 60, p), 110, p * 4); },
 // 41 outro: wave, debt monster rises behind
 (t, d) => { const p = clamp((t - d * 0.45) / 1.5); if (p > 0) scribbleMonster(1450, GY, 1.2 * p + 0.01, t); card(1450, GY - 520 * p, 0.3); hero(700, 1.6, { face: 'grin', armR: [200 + Math.sin(t * 8) * 30, -420] }); },
];

// ---- framework: timing, beats, camera cuts, label slam, particles, transitions, subtitles ----
const SC = DATA.map((s, i) => Object.assign({}, s, { draw: S[i] }));
let acc = 0;
for (const s of SC) {
  s.t0 = acc; acc += s.dur;
  // beats = phrases (sentences); each gets a share of the scene time by word count
  const parts = s.en.split(/(?<=[.!?…:])\s+/).filter(Boolean), total = s.en.split(' ').length;
  let w = 0; s.beats = parts.map(p => { const st = w / total * s.dur; w += p.split(' ').length; return st; });
  s.parts = parts;
  s.bad = /-|INFLATION|CAN'T|FEE/.test(s.ons || '');
  s.labelAt = 0;
}
const COLD = 2.5;            // cold-open hook before the first word
const DURATION = acc + COLD;
SC[14].labelAt = SC[14].beats[7];   // don't spoil the viewer's guess: show the answer only at the reveal
// camera framings, cycled per phrase: [zoom, dx, dy]
// per-chapter paper tint, words that are "bad news", scenes whose top area is busy (no kinetic words there),
// and the hero's face position for dramatic zooms
const TINTS = ['#efebe2', '#e8eef1', '#edf0e4', '#f4ecdc', '#f1e8e8', '#e9ebf3'];
const BADW = /CRASH|SELL|THIEF|FEES|MISTAKE|QUIT|-/;
const NOKW = new Set([6, 9, 10, 14, 18, 23, 24, 25, 26]);
const FACE = { 2: [520, 500], 9: [520, 470], 14: [480, 500], 21: [330, 557], 26: [600, 557] };
const CHAP = []; SC.forEach((s, i) => { if (!i || s.ch !== SC[i - 1].ch) CHAP.push(i); s.chi = CHAP.length - 1; });
const IMGS = { 0: 'bg02_coffee', 4: (t, d) => t < d * 0.55 ? 'bg02_coffee' : 'bg01_room', 5: 'bg01_room', 7: 'bg01_room', 8: 'bg01_room', 9: 'bg01_room',
  10: 'bg03_bank', 16: 'bg05_snow_hill', 18: 'bg09_classroom', 20: 'bg06_airport', 29: 'bg02_coffee', 30: 'bg02_coffee', 31: 'bg09_classroom', 32: 'bg09_classroom',
  35: 'bg01_room', 37: 'bg07_garage', 38: 'bg10_hallway', 39: 'bg01_room', 40: 'bg01_room', 41: 'bg01_room',
  // explainer scenes: the hero stands at a whiteboard (bg11) or the board fills the frame (bg12)
  1: 'bg11_board_room', 3: 'bg11_board_room', 11: 'bg11_board_room', 12: 'bg11_board_room', 14: 'bg11_board_room', 17: 'bg11_board_room',
  19: 'bg11_board_room', 23: 'bg11_board_room', 33: 'bg11_board_room', 34: 'bg11_board_room', 36: 'bg11_board_room',
  6: 'bg11_board_room', 13: 'bg11_board_room', 15: 'bg11_board_room', 21: 'bg11_board_room', 22: 'bg11_board_room', 28: 'bg11_board_room' };
const BOARD = new Set([1, 3, 11, 12, 14, 17, 19, 23, 33, 34, 36, 6, 13, 15, 21, 22, 28, 18, 31, 32]);   // scenes where text is written on a board
const SHOTS = [[1, 0, 0], [1.1, -60, -25], [1.05, 60, 10], [1.12, 0, -40], [1.07, -40, 15]];

function subtitle(line) {
  ctx.font = '800 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = BG; ctx.lineWidth = 8; ctx.strokeText(line, 960, 1012);
  ctx.fillStyle = C.ink; ctx.fillText(line, 960, 1012);
}
function subLine(s, b, bt) {   // within a phrase, show 7-word pieces in turn
  const words = s.parts[b].split(' '), per = 7, n = Math.ceil(words.length / per);
  const bd = (b + 1 < s.beats.length ? s.beats[b + 1] : s.dur) - s.beats[b];
  const k = Math.min(n - 1, Math.floor(bt / bd * n));
  return words.slice(k * per, k * per + per).join(' ');
}
function burst(t, x, y) {      // coins and bills flying out of a money label
  const r = rng(7);
  for (let k = 0; k < 16; k++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.6, v = 500 + r() * 600, tt = t;
    const px = x + Math.cos(a) * v * tt, py = y + Math.sin(a) * v * tt + 900 * tt * tt;
    if (k % 3 === 0) bill(px, py, 70, tt * 8 + k, '$'); else coin(px, py, 14);
  }
}

function coldOpen(t) {
  beginFrame(); BG = TINTS[0];
  const shake = 6 * Math.sin(t * 60); setCamera(960 + shake, 560, 1 + t * 0.06);
  jar(1330, GY, 640, clamp(t / 1.5), 21); hero(520, 1.5, { face: 'shock', armL: [-210, -300], armR: [210, -300] });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const v = 10 * Math.pow(52600 / 10, ease(clamp(t / 1.5)));
  at(960, 170, 1 + 0.05 * Math.sin(t * 30), -0.03, () => marker(money(v), 0, 0, 170, { color: GREEN, outline: true }));
  if (t > 0.2 && t < 1.8) burst(t - 0.2, 1330, GY - 640);
  if (t > 1.5) { const sc = lerp(3, 1, easeOutBack((t - 1.5) / 0.25)); at(960, 560, sc, -0.08, () => marker('WHAT IF?', 0, 0, 200, { hl: YELLOW })); }
  if (t > 2.1) { const p = (t - 2.1) / 0.4; ctx.fillStyle = 'rgba(44,44,44,0.25)'; for (let k = 0; k < 14; k++) ctx.fillRect(0, ((k * 97 + p * 900) % H), W, 6);
    marker('<< REWIND', 1700, 90, 60); ctx.globalAlpha = p; ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  endFrame();
}

function render(t) {
  if (t < COLD) return coldOpen(t);
  t -= COLD;
  TT = t;
  let i = SC.findIndex(s => t < s.t0 + s.dur); if (i < 0) i = SC.length - 1;
  const s = SC[i], lt = t - s.t0;
  let b = 0; while (b + 1 < s.beats.length && lt >= s.beats[b + 1]) b++;
  SCN = i; BEAT = b; BEATT = lt - s.beats[b]; PHRASE = s.parts[b].trim();
  beginFrame();
  BG = TINTS[s.chi % TINTS.length]; ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.1; for (let k = 0; k < 16; k++) { const r = rng(k * 31 + 5), sp = 25 + r() * 35, x = r() * W + Math.sin(t * 0.5 + k) * 30, y = H + 100 - ((t * sp + r() * H * 1.2) % (H + 200));
    if (k % 2) coin(x, y, 18 + r() * 10); else marker('$', x, y, 60 + r() * 30); } ctx.globalAlpha = 1;
  // camera: quick punch to a new framing on every phrase + slow drift; scenes slide in from alternating sides
  const sh = SHOTS[(b + i) % SHOTS.length], pv = SHOTS[(Math.max(0, b - 1) + i) % SHOTS.length], f = b ? easeOutBack(BEATT / 0.28) : 1;
  let z = lerp(pv[0], sh[0], f) + 0.012 * BEATT, cx = 960 + lerp(pv[1], sh[1], f), cy = 560 + lerp(pv[2], sh[2], f);
  const tin = clamp(lt / 0.4), dir = IMGS[i] ? 0 : (i % 2 ? 1 : -1);
  cx += dir * 700 * Math.pow(1 - tin, 3); z *= 1 + 0.12 * Math.pow(1 - tin, 2);
  // screen shake on bad news when the label lands
  if (s.bad && lt > 0.55 && lt < 1.1) { const a = (1.1 - lt) * 22; cx += Math.sin(lt * 90) * a; cy += Math.cos(lt * 70) * a; }
  // micro punch on every kinetic word
  for (const k of s.kw || []) { const dt = lt - k.f * s.dur; if (dt > 0 && dt < 0.35) z += 0.045 * Math.sin(dt / 0.35 * Math.PI); }
  // dramatic zoom onto the hero's face
  if (s.drama != null && FACE[i]) { const dt = lt - s.drama * s.dur, D = 1.0;
    if (dt > 0 && dt < D) { const e = dt < 0.15 ? easeOutBack(dt / 0.15) : dt > D - 0.2 ? ease((D - dt) / 0.2) : 1;
      z = lerp(z, 2.1, e); cx = lerp(cx, FACE[i][0], e); cy = lerp(cy, FACE[i][1], e); } }
  setCamera(cx, cy, z);
  const im = typeof IMGS[i] === 'function' ? IMGS[i](lt, s.dur) : IMGS[i];
  if (im) bgImg(im);
  else { ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(-600, GY + 2); ctx.lineTo(2600, GY + 2); ctx.strokeStyle = '#8d8c88'; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1; }
  WRITE_ON = BOARD.has(i); WRITE_T = TT; WRITE_SCN = i; WRITE_OCC = new Map();
  s.draw(lt, s.dur);
  WRITE_ON = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // label: slams in big at the center, then settles at the top
  if (s.ons) {
    const lt0 = lt; { const lt = lt0 - s.labelAt;
    const p = clamp((lt - 0.3) / 0.25), q = ease((lt - 1.0) / 0.45);
    if (p > 0) {
      const sc = lerp(lerp(2.6, 1.7, easeOutBack(p)), 1, q), y = lerp(470, 110, q);
      at(960, y, sc, -0.02 * q + (1 - q) * 0.03, () => marker(s.ons, 0, 0, 84, { hl: s.bad ? '#ffb3a7' : YELLOW }));
      if (s.ons.includes('$') && lt > 0.55 && lt < 2.2) burst(lt - 0.55, 960, 470);
      if (lt > 0.5 && lt < 0.85) { const e = (lt - 0.5) / 0.35; ctx.save(); ctx.globalAlpha = 1 - e; ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineCap = 'round';
        for (let k = 0; k < 14; k++) { const an = k / 14 * 6.28; ctx.beginPath(); ctx.moveTo(960 + Math.cos(an) * (260 + e * 200), 470 + Math.sin(an) * (130 + e * 120)); ctx.lineTo(960 + Math.cos(an) * (330 + e * 260), 470 + Math.sin(an) * (170 + e * 150)); ctx.stroke(); }
        ctx.restore(); }
    }
  }
  }
  // kinetic words: numbers and key terms pop up exactly when they are said
  if (!NOKW.has(i)) (s.kw || []).forEach((k, n) => {
    const dt = lt - k.f * s.dur + 0.05; if (dt < 0 || dt > 1.6) return;
    const sc = easeOutBack(dt / 0.3), al = dt > 1.3 ? 1 - (dt - 1.3) / 0.3 : 1, side = n % 2 ? 1 : -1;
    const money = k.w.startsWith('$') || k.w.endsWith('%'), bad = BADW.test(k.w);
    ctx.save(); ctx.globalAlpha = al;
    at(960 + side * 470, 300 - dt * 18, sc, side * 0.07 + Math.sin(dt * 14) * 0.05 * Math.max(0, 1 - dt * 1.5), () =>
      marker(k.w, 0, 0, 110, { color: bad ? RED : money ? GREEN : C.ink, outline: bad || money }));
    ctx.restore();
  });
  if (SUBS) subtitle(subLine(s, b, BEATT));
  // chapter card: a black band with the chapter name sweeps across at the start of each chapter
  if (s.chi > 0 && i === CHAP[s.chi] && lt < 1.2) {
    const x = lt < 0.25 ? lerp(-W, 0, ease(lt / 0.25)) : lt > 0.9 ? lerp(0, W, ease((lt - 0.9) / 0.3)) : 0;
    ctx.save(); ctx.translate(x, 0); ctx.rotate(-0.03);
    ctx.fillStyle = C.ink; ctx.fillRect(-100, 420, W + 200, 230);
    marker(s.ch, 960, 535, 120, { color: '#f4f1e8' });
    ctx.restore();
  }
  // flash of paper at the very start of a scene (hides the cut)
  if (lt < 0.12) { ctx.globalAlpha = 1 - lt / 0.12; ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  endFrame();
}
