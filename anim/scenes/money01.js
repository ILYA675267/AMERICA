// Money ep.01 "What If You Saved $10 a Day for 10 Years?" — full video.
// DATA (injected by render.js --data scenes.json): [{ch, en, ons, dur}] per scene, in order.
// Each scene draws itself for local time t in [0, d]; the framework adds the on-screen label, subtitles and transitions.
const GY = 930;                                   // ground line
const SUBS = true;
let TT = 0;                                       // global time (for blinking)
const hero = (x, k = 1.6, o = {}) => heroFront(x, GY, k, Object.assign({ bob: Math.sin(TT * 2.4) * 3, blink: (TT % 3.7) > 3.58 }, o));
const counter = (x, y, v, size = 120, color = GREEN) => marker(money(v), x, y, size, { color, outline: true });
const grow = (t, t0, d, a, b) => lerp(a, b, ease((t - t0) / d));
// Street backdrop (same neighbourhood as the reference clip), built once and drawn behind outdoor scenes, faded into the paper.
const STREET = (() => { const n = WORLD.length; buildStreet(); return WORLD.splice(n); })();
function backdrop(t, dx = 0, fadeAmt = 0.42) {
  const k = 1.3;
  ctx.save(); ctx.translate(960 - 960 * k + dx, GY - 42 - 760 * k); ctx.scale(k, k);
  for (const it of STREET) it.d ? rc.draw(it.d) : it.f(t);
  ctx.restore();
  ctx.fillStyle = `rgba(239,235,226,${fadeAmt})`; ctx.fillRect(-500, -500, W + 1000, H + 1000);
}

const S = [
 // 00 $10 = coffee / delivery / subscriptions
 (t, d) => { hero(520, 1.6, { armR: [170, -260], face: 'smile' }); bill(780, 520, 200, -0.2);
   const k = Math.min(2, Math.floor(t / (d / 3))), tt = t - k * d / 3, s = pop(tt, 0);
   at(1350, GY, s, 0, () => { if (k === 0) { coffee(-90, 0, 1.6); muffin(130, 0, 1.6); } else if (k === 1) bag(0, 0, 1.8); else { screen(-130, -40, 220, 160, '#ffd0cc', 1); screen(130, -40, 220, 160, '#cfe0ff', 1); } }); },
 // 01 what if you didn't — lottery / crypto / magic crossed out
 (t, d) => { hero(420, 1.6, { armR: [160, -230], face: 'flat' }); bill(660, 560, 180, -0.2);
   [[1000, ticket], [1350, cryptoCoin], [1680, wand]].forEach(([x, f], i) => { const t0 = 0.6 + i * d * 0.22; at(x, 560, pop(t, t0), 0, () => f(0, 0)); crossOut(x, 560, 90, (t - t0 - 0.4) / 0.5); }); },
 // 02 jar grows huge, hero looks up in shock
 (t, d) => { const h = grow(t, 0.8, d - 1.2, 260, 760); jar(1250, GY, h, clamp(t / d), 3); hero(520, 1.5, { face: t > 1.5 ? 'shock' : 'smile', tilt: -0.08 }); if (t < 1.2) bill(1250, lerp(300, GY - 120, t / 1.2), 140, t * 3); },
 // 03 disclaimer
 (t, d) => { hero(960, 1.6, { face: 'smile', tilt: Math.sin(t * 5) * 0.05 * (t < 1.5) , armR: [150, -150], armL: [-150, -150] }); },
 // 04 day one: walk out of the coffee shop to the desk with the jar
 (t, d) => { // coffee shop on the left, desk + jar on the right
   ctx.beginPath(); ctx.rect(80, GY - 420, 380, 420); ink('#f6f4ee'); marker('COFFEE', 270, GY - 360, 60); coffee(200, GY - 140, 0.9); coffee(330, GY - 140, 0.9);
   ctx.beginPath(); ctx.rect(1420, GY - 200, 420, 24); ink('#e3d3b8'); ctx.beginPath(); ctx.moveTo(1450, GY - 176); ctx.lineTo(1450, GY); ctx.moveTo(1810, GY - 176); ctx.lineTo(1810, GY); ink(null);
   jar(1640, GY - 200, 220, t > d - 0.6 ? 0.05 : 0, 5);
   const wt = Math.min(t, d - 1.2), hx = 560 + heroWalkX(wt, 0.55);
   if (t < d - 1.2) heroWalk(Math.min(hx, 1350), GY, 0.55, t, { blink: true });
   else { hero(1350, 1.15, { armR: [190, -330] }); const p = clamp((t - (d - 1.2)) / 0.6); bill(1640, lerp(GY - 520, GY - 260, p), 110, p * 4); } },
 // 05 lonely bill at the bottom, shrug
 (t, d) => { jar(1250, GY, 520, 0.03, 6); hero(560, 1.6, { face: 'flat', armL: [-190, -330], armR: [190, -330] }); },
 // 06 the math: $70/week -> $300/month -> $3,650/year
 (t, d) => { hero(380, 1.5, { armR: [180, -300], face: 'smile' });
   const rows = [['$10', 'a day'], ['$70', 'a week'], ['$300', 'a month'], ['$3,650', 'a year']];
   rows.forEach(([a, b], i) => { const t0 = 0.3 + i * d / 4.6; const s = pop(t, t0); if (s <= 0) return;
     at(1150, 230 + i * 180, s, 0, () => { marker(a, -60, 0, 110, { color: i === 3 ? GREEN : C.ink, outline: i === 3, align: 'right' }); marker(b, 0, 6, 64, { align: 'left' }); }); }); },
 // 07 full jar, thief peeks out
 (t, d) => { jar(1000, GY, 600, 1, 7); hero(480, 1.5, { face: 'grin' }); const p = ease((t - d * 0.55) / 0.8); at(lerp(2150, 1720, p), GY, 1.2, -0.1 * p, () => thief(0, 0, 1)); },
 // 08 inflation thief steals, burger price climbs
 (t, d) => { const f = 1 - 0.15 * clamp(t / d); jar(820, GY, 560, f, 7); thief(1250, GY, 1.2, t);
   for (let k = 0; k < 3; k++) { const p = ((t * 0.7 + k / 3) % 1); bill(lerp(900, 1330, p), lerp(GY - 520, GY - 420, p) - Math.sin(p * 3.14) * 120, 110, p * 3); }
   at(1640, 330, 1, 0, () => { ctx.beginPath(); ctx.ellipse(0, 0, 120, 50, 0, Math.PI, 0); ink('#e0a35a'); ctx.beginPath(); ctx.rect(-125, 0, 250, 30); ink('#7a4a2a'); ctx.beginPath(); ctx.ellipse(0, 40, 120, 22, 0, 0, Math.PI); ink('#e0a35a');
     marker('$' + (5 * Math.pow(1.03, clamp(t / d) * 10)).toFixed(2), 0, 130, 70, { color: RED }); }); },
 // 09 jar shrinks, value drops
 (t, d) => { const p = ease(t / d); jar(1200, GY, lerp(620, 520, p), 1, 7); hero(520, 1.6, { face: p > 0.4 ? 'sad' : 'flat' }); counter(1200, 230, lerp(36500, 31500, p), 110, p > 0.5 ? RED : C.ink); },
 // 10 the bank
 (t, d) => { backdrop(t, 500); bank(1300, GY, 1.3); hero(480, 1.5, { face: 'smile', armR: [180, -200] }); jar(700, GY, 260, 1, 7); counter(1300, 260, grow(t, 0.8, d - 1.2, 36500, 44800), 110); },
 // 11 rates swing, door "option 3"
 (t, d) => { at(700, 560, 1, 0, () => { ctx.beginPath(); ctx.arc(0, 0, 220, Math.PI, 0); ink('#fff'); for (let k = 0; k <= 6; k++) { const a = Math.PI + k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 190, Math.sin(a) * 190); ctx.lineTo(Math.cos(a) * 215, Math.sin(a) * 215); ink(null, 4); }
     const a = Math.PI * 1.5 + Math.sin(t * 2.5) * 0.9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 170, Math.sin(a) * 170); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.stroke(); marker('RATE', 0, 60, 54); });
   door(1500, GY, clamp((t - d * 0.5) / 0.8)); marker('OPTION 3', 1500, GY - 300, 54); hero(1080, 1.3, { face: 'smile', tilt: 0.1 }); },
 // 12 index fund: a whole city of companies, hero takes a slice
 (t, d) => { const r = rng(12); for (let k = 0; k < 16; k++) building(780 + k * 70 + (k % 2) * 6, GY - 40, 64, 180 + r() * 260, k);
   const p = ease((t - d * 0.45) / 1); ctx.fillStyle = 'rgba(255,211,77,0.45)'; ctx.fillRect(780 + 7 * 70 - 34, GY - 520, 70, 480); hero(380, 1.5, { face: 'grin', armR: [200, -280] }); if (p > 0) bill(lerp(1300, 620, p), lerp(GY - 300, GY - 440, p), 120); },
 // 13 market chart drawn on
 (t, d) => { chart(560, 820, 1200, 560, marketPts(13, 60, 0.85, 0.07, [[0.3, 0.12], [0.62, 0.18]]), clamp(t / (d * 0.8))); hero(300, 1.2, { face: 'smile', armR: [170, -260] }); },
 // 14 two stacks: what you put in vs what money made
 (t, d) => { const a = clamp(t / (d * 0.4)), b = clamp((t - d * 0.4) / (d * 0.45));
   for (let k = 0; k < Math.round(28 * a); k++) bill(1050 + (k % 2) * 6, GY - 20 - k * 16, 230, 0, '$100');
   for (let k = 0; k < Math.round(12 * b); k++) bill(1050 + (k % 2) * 6, GY - 20 - 28 * 16 - k * 16, 230, 0, '$100');
   marker('YOU: $36,500', 1230, GY - 220, 60, { align: 'left' }); if (b > 0) marker('MONEY: +$16,100', 1230, GY - 560, 60, { align: 'left', color: GREEN });
   hero(480, 1.5, { face: b > 0.5 ? 'shock' : 'smile' }); },
 // 15 fee bug nibbles the stack
 (t, d) => { for (let k = 0; k < 30; k++) bill(1100 + (k % 2) * 6, GY - 20 - k * 16, 230, 0, '$100');
   at(1290 + Math.sin(t * 8) * 6, GY - 260, 1, 0, () => { ctx.beginPath(); ctx.ellipse(0, 0, 60, 40, 0, 0, 7); ink('#7a8f3a'); ctx.beginPath(); ctx.arc(-58, -6, 24, 0, 7); ink('#7a8f3a'); for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(k * 22, 30); ctx.lineTo(k * 26 + Math.sin(t * 20 + k) * 6, 62); ink(null, 4); } marker('1%', 0, 0, 40, { color: '#fff' }); });
   hero(480, 1.5, { face: 'flat' }); },
 // 16 snowball of coins rolls down a hill and grows
 (t, d) => { ctx.beginPath(); ctx.moveTo(0, 360); ctx.quadraticCurveTo(900, 520, 1920, 980); ink(null, 7);
   const p = clamp(t / d), x = lerp(150, 1650, p), y = 360 + (980 - 360) * (p * p * 0.55 + p * 0.45) - 30, r = lerp(30, 230, p * p);
   snowball(x, y - r * 0.85, r, p * 14); heroWalk(110 + p * 200, 400, 0.35, t); },
 // 17 "Einstein" quote with a question mark
 (t, d) => { hero(760, 1.6, { wildHair: true, mustache: true, face: 'smile', armR: [190, -300] }); at(1300, 420, pop(t, d * 0.5), 0, () => marker('?', 0, 0, 380, { color: RED, outline: true })); },
 // 18 Rule of 72 on a board, money doubles
 (t, d) => { ctx.beginPath(); ctx.rect(500, 160, 900, 440); ink('#2f3b33', 10); marker('72 ÷ 7 = ~10', 950, 380, 120, { color: '#f4f1e8' });
   const p = clamp((t - d * 0.5) / 1); for (let k = 0; k < 6 + Math.round(6 * p); k++) bill(1650, GY - 20 - k * 18, 220, 0, '$100'); hero(300, 1.2, { armR: [180, -240] }); },
 // 19 year 1: magnifying glass on a tiny coin
 (t, d) => { calendar(1500, 420, 'YEAR 1'); hero(700, 1.6, { face: 'flat', armR: [230, -150] });
   ctx.beginPath(); ctx.arc(1000, GY - 230, 70, 0, 7); ink('rgba(214,230,232,0.6)', 9); ctx.beginPath(); ctx.moveTo(950, GY - 180); ctx.lineTo(900, GY - 120); ink(null, 16); coin(1000, GY - 230, 12); },
 // 20 year 3: friends leave with phones and suitcases
 (t, d) => { backdrop(t, -300); calendar(1550, 330, 'YEAR 3', 0.9); jar(420, GY, 360, 0.3, 8); hero(700, 1.4, { face: 'flat' });
   const p = clamp(t / d); heroFront(1150 + p * 400, GY, 1.2, { cap: RED, face: 'grin', armR: [180, -260], armL: [-150, -150] }); heroFront(1350 + p * 420, GY, 1.2, { glasses: true, face: 'grin', armR: [150, -150] });
   ctx.beginPath(); ctx.roundRect(1350 + p * 420 + 160, GY - 150, 110, 150, 12); ink('#4a7cff'); },
 // 21 crash
 (t, d) => { const pts = marketPts(21, 40, 0.6, 0.04); for (let i = 26; i < 40; i++) pts[i][1] = Math.max(0.05, pts[i][1] - 0.32 * clamp((i - 26) / 3));
   chart(600, 760, 1000, 500, pts, clamp(t / (d * 0.6)), clamp(t / (d * 0.6)) > 0.66 ? RED : GREEN); hero(330, 1.3, { face: t > d * 0.45 ? 'shock' : 'smile' });
   if (t > d * 0.45) { newsTV(1500, 330, t); newsTV(1750, 560, t + 1); newsTV(1250, 980 - 90, t + 2); } },
 // 22 history: crashes and recoveries
 (t, d) => { chart(260, 860, 1450, 640, marketPts(22, 90, 1.05, 0.05, [[0.15, 0.12], [0.38, 0.2], [0.6, 0.15], [0.82, 0.22]]), clamp(t / (d * 0.85))); },
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
 (t, d) => { ctx.beginPath(); ctx.moveTo(200, GY); ctx.lineTo(1800, GY); ink(null, 6); for (const [x, l] of [[200, '0'], [800, '30'], [1300, '65'], [1750, '90']]) { ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x, GY - 20); ink(null, 5); marker(l, x + 34, GY - 40, 44); }
   const p = clamp(t / (d * 0.8)); ctx.beginPath(); ctx.moveTo(200, GY); for (let k = 0; k <= 60; k++) { const f = k / 60, x = 200 + f * 1550 * p; ctx.lineTo(x, GY - Math.pow(f * p, 6) * 700); } ctx.lineTo(200 + 1550 * p, GY); ctx.closePath(); ink(MONEY);
   hero(500, 1.0, { glasses: true, mustache: true, armR: [90, -190], armL: [-90, -190] }); ctx.beginPath(); ctx.rect(410, GY - 250, 180, 120); ink('#f4f1e8', 4); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(430, GY - 225 + k * 22); ctx.lineTo(570, GY - 225 + k * 22); ink(null, 3); } },
 // 29 present bias: coffee now vs jar far away
 (t, d) => { coffee(760, GY - 200, 2.2); jar(1650, GY - 300, 140, 1, 14); ctx.beginPath(); ctx.moveTo(900, GY - 300); ctx.lineTo(1580, GY - 300); ctx.setLineDash([16, 18]); ink(null, 5); ctx.setLineDash([]); marker('NOW', 760, 300, 80); marker('10 YEARS', 1650, 440, 56); hero(340, 1.4, { face: 'grin' }); },
 // 30 hand reaches for coffee, other hand stops it
 (t, d) => { const p = Math.sin(clamp(t / d) * Math.PI); coffee(1100, GY - 140, 2); hero(700, 1.6, { armR: [lerp(150, 260, p), -260], armL: [lerp(-150, 230, clamp(t / d * 2 - 0.6)), -260], face: t > d * 0.5 ? 'flat' : 'grin' }); },
 // 31 Save More Tomorrow: two economists at a board
 (t, d) => { ctx.beginPath(); ctx.rect(560, 150, 1000, 480); ink('#fff', 8); marker('RAISE', 760, 330, 70); piggy(1360, 520, 1.1, clamp(t / d));
   const p = clamp((t - 0.5) / 1.5); ctx.beginPath(); ctx.moveTo(880, 330); ctx.quadraticCurveTo(1050, 250, lerp(880, 1210, p), lerp(330, 420, p)); ink(null, 9);
   heroFront(380, GY, 1.2, { glasses: true, armR: [200, -330] }); heroFront(1760, GY, 1.2, { mustache: true, armL: [-200, -300] }); },
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
   hero(560, 1.5, { face: 'smile', armR: [140, -240] }); coffee(700, GY - 330, 0.6); },
 // 36 one in three can't cover $400
 (t, d) => { [560, 960, 1360].forEach((x, i) => heroFront(x, GY, 1.2, { face: i === 1 && t > 1 ? 'shock' : 'smile', armL: i === 1 && t > 1 ? [-130, -330] : undefined, armR: i === 1 && t > 1 ? [130, -330] : undefined, cap: i === 0 ? RED : undefined, glasses: i === 2 }));
   if (t > 1) at(960, 330, pop(t, 1), 0, () => { ctx.beginPath(); ctx.rect(-130, -80, 260, 160); ink('#fff'); marker('BILL $400', 0, 0, 52, { color: RED }); }); },
 // 37 broken car: calm, money from the jar
 (t, d) => { backdrop(t, -150); at(1250, GY, 1, 0, () => { ctx.beginPath(); ctx.roundRect(-330, -220, 660, 160, 40); ink('#ffb3a7'); ctx.beginPath(); ctx.moveTo(-200, -220); ctx.lineTo(-130, -330); ctx.lineTo(130, -330); ctx.lineTo(200, -220); ink('#d3d8da'); for (const x of [-200, 200]) { ctx.beginPath(); ctx.arc(x, -60, 60, 0, 7); ink('#3a3a3a'); }
     for (let k = 0; k < 3; k++) { const p = (t * 0.6 + k / 3) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(-300 + Math.sin(p * 6) * 20, -240 - p * 300, 30 + p * 40, 0, 7); ink('#fff', 4); ctx.globalAlpha = 1; } });
   jar(330, GY, 360, 0.8, 15); hero(640, 1.4, { face: 'smile', armL: [-200, -250] }); bill(lerp(380, 520, clamp(t / 2)), GY - 520, 120, 0.2); },
 // 38 freedom: doors open one by one
 (t, d) => { const icons = [(x, y) => { ctx.beginPath(); ctx.roundRect(x - 50, y - 30, 100, 70, 8); ink('#8a5a3c'); }, (x, y) => building(x, y + 60, 70, 140, 3), (x, y) => { ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.lineTo(x, y - 50); ctx.lineTo(x + 50, y); ctx.closePath(); ink(RED); ctx.beginPath(); ctx.rect(x - 40, y, 80, 60); ink('#fff'); }];
   [900, 1250, 1600].forEach((x, i) => door(x, GY, clamp((t - 0.5 - i * d * 0.22) / 0.8), icons[i])); hero(450, 1.5, { face: 'grin', armR: [200, -330], armL: [-200, -330] }); },
 // 39 evening at the window, full jar, warm lamp
 (t, d) => { ctx.fillStyle = 'rgba(40,50,80,0.12)'; ctx.fillRect(0, 0, W, H);
   ctx.beginPath(); ctx.rect(1100, 180, 560, 440); ink('#2e3a5c', 10); ctx.beginPath(); ctx.arc(1520, 300, 40, 0, 7); ctx.fillStyle = '#f3e3a0'; ctx.fill();
   const g = ctx.createRadialGradient(560, 380, 20, 560, 380, 500); g.addColorStop(0, 'rgba(255,214,102,0.5)'); g.addColorStop(1, 'rgba(255,214,102,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
   jar(860, GY, 420, 1, 16); hero(560, 1.5, { face: 'smile' }); },
 // 40 a new bill into an empty jar
 (t, d) => { jar(1150, GY, 520, 0, 17); hero(650, 1.6, { armR: [200, -380], face: 'grin' }); const p = clamp((t - d * 0.4) / 0.8); bill(lerp(1000, 1150, p), lerp(GY - 680, GY - 60, p), 160, p * 4); },
 // 41 outro: wave, debt monster rises behind
 (t, d) => { const p = clamp((t - d * 0.45) / 1.5); if (p > 0) scribbleMonster(1450, GY, 1.2 * p + 0.01, t); card(1450, GY - 520 * p, 0.3); hero(700, 1.6, { face: 'grin', armR: [200 + Math.sin(t * 8) * 30, -420] }); },
];

// ---- framework: timing, label, subtitles, transitions ----
const SC = DATA.map((s, i) => Object.assign({}, s, { draw: S[i] }));
let acc = 0; for (const s of SC) { s.t0 = acc; acc += s.dur; }
const DURATION = acc;

function subtitle(text, t, d) {
  const words = text.replace(/\(.*?\)\s*/g, '').split(' '), per = 7, n = Math.ceil(words.length / per);
  const k = Math.min(n - 1, Math.floor(t / d * n)), line = words.slice(k * per, k * per + per).join(' ');
  ctx.font = '800 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  // plain black text on the picture (thin paper-coloured halo keeps it readable where it crosses lines)
  ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(239,235,226,0.9)'; ctx.lineWidth = 8; ctx.strokeText(line, 960, 1012);
  ctx.fillStyle = C.ink; ctx.fillText(line, 960, 1012);
}

function render(t) {
  TT = t;
  let i = SC.findIndex(s => t < s.t0 + s.dur); if (i < 0) i = SC.length - 1;
  const s = SC[i], lt = t - s.t0;
  beginFrame();
  const z = 1 + 0.035 * clamp(lt / s.dur);
  setCamera(960, 560, z);
  ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(-200, GY + 2); ctx.lineTo(2200, GY + 2); ctx.strokeStyle = '#8d8c88'; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;
  s.draw(lt, s.dur);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (s.ons) { const sc = pop(lt, 0.25); if (sc > 0) at(960, 110, sc, -0.02, () => marker(s.ons, 0, 0, 84, { hl: YELLOW })); }
  if (SUBS) subtitle(s.en, lt, s.dur);
  // quick paper-wipe between chapters, short dip between scenes
  const fadeIn = clamp(lt / 0.18);
  if (fadeIn < 1) { ctx.fillStyle = `rgba(239,235,226,${1 - fadeIn})`; ctx.fillRect(0, 0, W, H); }
  endFrame();
}
