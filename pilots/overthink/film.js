// "Stop Overthinking Before It Ruins Your Life" — full film, no voice-over yet (subtitles = narration script).
// Built from beats: every beat = one narration line (subtitle) + optional pose/board/UI change. Beat length follows
// the text length, so the edit keeps a steady pace and a voice-over can be recorded to the same timing later.
// Rules (HANDOFF.md): backgrounds exactly as they are (no zoom/pan); Milo stands on the scene floor with a contact
// shadow, never slides, may change poses in place; board text is handwritten; only UI on top of the frame animates in.
const INK = '#16161a';
const M = MILO_METRICS;  // per-pose image metrics (size, head diameter, feet row)
const HEAD_FIX = { magnifier: 236, victory: 240, surprised: 235 };

// ---------- drawing helpers ----------
const glw = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
const bg = img => `<image href="${img}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`;
// Milo with feet at (x, y); u = head diameter on screen (same for every pose -> consistent size).
function milo2(pose, x, y, u, t, talk, shadowCol) {
  const m = M[pose], k = u / (HEAD_FIX[pose] || m.head), w = m.w * k, h = m.h * k, feet = m.feet * k;
  const breathe = Math.sin(t * 2.2) * 0.008 + (talk ? Math.abs(Math.sin(t * 7)) * 0.016 : 0);
  return `<ellipse cx="${x}" cy="${y - 2}" rx="${u * 0.62}" ry="${u * 0.075}" fill="${shadowCol}" opacity="0.45" filter="url(#soft)"/>
    <ellipse cx="${x}" cy="${y - 2}" rx="${u * 0.38}" ry="${u * 0.04}" fill="${shadowCol}" opacity="0.4"/>
    <g transform="translate(${x},${y}) scale(${1 - breathe * 0.4},${1 + breathe})">
    <image href="${ASSETS['pose_' + pose]}" x="${-w / 2}" y="${-feet}" width="${w}" height="${h}"/></g>`;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function cap(s, t, a, b, hl) {
  const op = Math.min(seg(t, a, a + 0.25), 1 - seg(t, b - 0.25, b));
  if (op <= 0 || !s) return '';
  const size = 29, w = Math.min(1220, s.length * size * 0.54 + 56), y = 692;
  let html = esc(s);
  if (hl) html = html.replace(esc(hl), `<tspan fill="${P.mustard}">${esc(hl)}</tspan>`);
  return `<g opacity="${op}"><rect x="${640 - w / 2}" y="${y - size - 8}" width="${w}" height="${size + 21}" rx="12" fill="#140f1e" opacity="0.8"/>
    <text x="640" y="${y}" font-family="Inter" font-weight="800" font-size="${size}" fill="#fff" text-anchor="middle">${html}</text></g>`;
}
let _wid = 0;
function written(str, x, y, size, col, t, a, dur) {
  if (t < a) return '';
  const p = clamp((t - a) / dur), id = 'w' + (_wid++), w = str.length * size * 0.5 + 24;
  return `<defs><clipPath id="${id}"><rect x="${x - w / 2}" y="${y - size * 1.1}" width="${w * p}" height="${size * 1.5}"/></clipPath></defs>
    <g clip-path="url(#${id})"><text x="${x}" y="${y}" font-family="PatrickHand" font-size="${size}" fill="${col}" text-anchor="middle" opacity="0.93">${esc(str)}</text></g>`;
}
function bubble(x, y, s, op, me) {
  if (op <= 0) return '';
  const w = s.length * 12.5 + 44;
  return `<g opacity="${op}"><rect x="${x - w / 2}" y="${y - 25}" width="${w}" height="46" rx="21" fill="${me ? '#5aa7ff' : '#f6f1e8'}" stroke="${INK}" stroke-width="3"/>
    ${txt(x, y + 6, s, 21, me ? '#fff' : INK, { weight: 800 })}</g>`;
}
function tag(s, op, col = P.mustard) {
  if (op <= 0) return '';
  const w = s.length * 17 + 40;
  return `<g opacity="${op}"><rect x="40" y="34" width="${w}" height="56" rx="12" fill="${col}" stroke="${INK}" stroke-width="4"/>${txt(40 + w / 2, 72, s, 28, INK, { weight: 900 })}</g>`;
}
function card(lines, op, x = 990, y = 150) {
  if (op <= 0) return '';
  const w = Math.max(...lines.map(l => l[0].length)) * 24 + 70, h = lines.length * 54 + 34;
  return `<g opacity="${op}"><rect x="${x - w / 2}" y="${y - 50}" width="${w}" height="${h}" rx="16" fill="#140f1e" opacity="0.8"/>
    ${lines.map(([s, col], i) => txt(x, y + i * 54, s, 42, col || '#fff', { weight: 900 })).join('')}</g>`;
}
// Simple UI props (drawn as overlays, not part of the scene): timer, notebook card, choice cards, storm cloud.
function timerUI(x, y, secs, op) {
  if (op <= 0) return '';
  const mm = Math.floor(secs / 60), ss = Math.floor(secs % 60);
  return `<g opacity="${op}"><rect x="${x - 110}" y="${y - 50}" width="220" height="90" rx="20" fill="#140f1e" opacity="0.85" stroke="${P.mustard}" stroke-width="4"/>
    ${txt(x, y + 18, `${mm}:${String(ss).padStart(2, '0')}`, 54, P.mustard, { weight: 900, font: 'DejaVu Sans Mono' })}</g>`;
}
function noteUI(lines, op, x = 1000, y = 200) {
  if (op <= 0) return '';
  return `<g opacity="${op}" transform="rotate(-3 ${x} ${y})"><rect x="${x - 170}" y="${y - 60}" width="340" height="${lines.length * 46 + 70}" rx="6" fill="#fff7d6" stroke="${INK}" stroke-width="4"/>
    ${lines.map((l, i) => `<text x="${x - 140}" y="${y + i * 46}" font-family="PatrickHand" font-size="34" fill="#2b4a8f">${esc(l)}</text>`).join('')}</g>`;
}
function choices(op, t) {
  if (op <= 0) return '';
  return `<g opacity="${op}">${['A', 'B', 'C'].map((c, i) => `<g transform="translate(${880 + i * 120},230)"><rect x="-48" y="-60" width="96" height="120" rx="12" fill="#f6f1e8" stroke="${INK}" stroke-width="4"/>
    ${txt(0, 18, c, 56, ['#2b4a8f', '#c8463b', '#2f7d4f'][i], { weight: 900 })}</g>`).join('')}${txt(1000, 340, '???', 44, P.mustard, { weight: 900 })}</g>`;
}

// ---------- scene geometry: where Milo stands (feet x, y), head size, shadow tint ----------
const LOC = {
  bed: { img: 'ot_bed' },
  bedroom: { img: 'loc_bedroom_desk', x: 800, y: 640, u: 132, sh: '#2a1830' },
  board: { img: 'loc_whiteboard', x: 960, y: 645, u: 112, sh: '#5a3a24' },
  cafe: { img: 'loc_cafe', x: 640, y: 662, u: 112, sh: '#2a140c' },
  subway: { img: 'loc_subway', x: 600, y: 652, u: 128, sh: '#1c1630' },
  roofnight: { img: 'loc_rooftop', x: 690, y: 626, u: 118, sh: '#1b1426' },
  study: { img: 'loc_study_room', x: 640, y: 665, u: 128, sh: '#5a3a24' },
  therapy: { img: 'loc_therapist_office_sunset', x: 830, y: 706, u: 116, sh: '#3a2418' },
  park: { img: 'loc_park_sunset_bench', x: 900, y: 626, u: 112, sh: '#3a2a2a' },
  mountain: { img: 'loc_mountain_overlook_bench', x: 760, y: 652, u: 112, sh: '#2a1f2a' },
  fire: { img: 'loc_cozy_fireplace_rain', x: 900, y: 656, u: 112, sh: '#2a1a20' },
  library: { img: 'loc_reading_library_window', x: 520, y: 702, u: 112, sh: '#2a1810' },
  roofsun: { img: 'loc_rooftop_sunset', x: 560, y: 646, u: 128, sh: '#4a3530' },
};
const BLUE = '#2b4a8f', RED = '#c8463b', BLACK = '#2a2530', GREEN = '#2f7d4f';

// ---------- the film: shots of beats ----------
// beat: [narration, {pose, talk, hl, write:[[text,x,y,size,col]], ui:'key'}]
const SHOTS = [
  { loc: 'bed', beats: [
    ["It's 11:47 PM.", {}],
    ['Six hours ago, you texted a friend "haha ok".', { hl: 'haha ok' }],
    ["And you still can't stop thinking about it.", {}],
  ] },
  { loc: 'bedroom', beats: [
    ['Did that sound rude?', { pose: 'phone', ui: 'q1' }],
    ['Are they mad at me?', { pose: 'phone', ui: 'q2' }],
    ['Why did I even say that?', { pose: 'facepalm_stress', ui: 'q3' }],
    ["If this sounds familiar, you're not alone.", { pose: 'question_think' }],
  ] },
  { loc: 'board', beats: [
    ['This is overthinking.', { pose: 'thinking_gears', write: [['Why you', 725, 150, 58, BLACK], ['OVERTHINK', 725, 240, 92, BLUE]] }],
    ["And today we'll see why it happens,", { pose: 'thinking_gears', write: [['everything', 725, 320, 58, BLACK]] }],
    ['the 7 signs you do it,', { pose: 'presenting', talk: 1, hl: '7 signs', write: [['7 signs', 600, 400, 46, RED]] }],
    ['and 5 simple ways to stop.', { pose: 'presenting', talk: 1, hl: '5 simple ways', write: [['5 fixes', 850, 400, 46, GREEN]] }],
  ] },
  { loc: 'study', tagS: 'WHAT IS IT?', beats: [
    ['Overthinking means replaying the same thoughts again and again,', { pose: 'thinking_gears' }],
    ['without getting any closer to an answer.', { pose: 'shrug', hl: 'without' }],
    ['It feels like solving a problem.', { pose: 'thinking_idea' }],
    ["But it's really just running in circles.", { pose: 'tired_sigh', hl: 'running in circles' }],
  ] },
  { loc: 'board', beats: [
    ['So why does your brain do it?', { pose: 'question_think', write: [['brain = alarm', 725, 160, 64, BLUE]] }],
    ['Your brain is built to spot danger.', { pose: 'presenting', talk: 1, write: [['spot danger -> stay safe', 725, 250, 46, BLACK]] }],
    ['A long time ago, danger meant a lion in the grass.', { pose: 'presenting', talk: 1 }],
    ["Today it's an unread message, or a weird look from a coworker.", { pose: 'surprised', write: [['today: "Seen" , a look', 725, 330, 44, RED]] }],
    ['Your brain treats them the same way.', { pose: 'realization' }],
    ['It replays them, hoping to keep you safe.', { pose: 'thinking_gears', write: [['replay = safety?', 725, 410, 50, RED]] }],
    ["But it doesn't make you safer. It just makes you tired.", { pose: 'tired_sigh', hl: 'tired' }],
  ] },
  { loc: 'board', beats: [
    ["Let's look at the 7 signs you might be overthinking.", { pose: 'confident', write: [['7 SIGNS', 725, 220, 110, BLUE]] }],
    ['See how many sound like you.', { pose: 'magnifier', write: [['how many are you?', 725, 330, 52, RED]] }],
  ] },
  // ----- 7 signs -----
  { loc: 'cafe', tagS: 'SIGN 1 / 7', beats: [
    ['Sign one: you re-read messages over and over.', { pose: 'phone', ui: 'msgs', hl: 're-read messages' }],
    ['You check your words, their words, the emoji, the timing.', { pose: 'phone', ui: 'msgs' }],
    ['As if the answer is hidden somewhere in "haha ok".', { pose: 'question_think', ui: 'x27', hl: 'haha ok' }],
  ] },
  { loc: 'subway', tagS: 'SIGN 2 / 7', beats: [
    ['Sign two: you rehearse conversations that never happen.', { pose: 'talking', talk: 1, ui: 'r1', hl: 'never happen' }],
    ['What you will say, what they might answer,', { pose: 'talking', talk: 1, ui: 'r2' }],
    ['and what you will say back. Ten different versions.', { pose: 'shrug', ui: 'r3' }],
  ] },
  { loc: 'therapy', tagS: 'SIGN 3 / 7', beats: [
    ['Sign three: you keep wondering what people think of you.', { pose: 'question_think', hl: 'what people think' }],
    ['One small mistake, and you replay it for days.', { pose: 'facepalm_stress' }],
    ['Even though most people forgot about it in five minutes.', { pose: 'shrug', hl: 'five minutes' }],
  ] },
  { loc: 'bedroom', tagS: 'SIGN 4 / 7', beats: [
    ["Sign four: you can't make small decisions.", { pose: 'question_think', ui: 'abc', hl: 'small decisions' }],
    ['What to eat. What to wear. Which movie to watch.', { pose: 'shrug', ui: 'abc' }],
    ['Every choice feels like a test you could fail.', { pose: 'facepalm_stress', hl: 'a test' }],
  ] },
  { loc: 'roofnight', tagS: 'SIGN 5 / 7', beats: [
    ['Sign five: you always expect the worst.', { pose: 'surprised', hl: 'the worst' }],
    ['A late reply means they hate you.', { pose: 'phone' }],
    ['A short email from your boss means you are getting fired.', { pose: 'facepalm_stress' }],
    ['Your mind writes the scariest story first.', { pose: 'thinking_gears', hl: 'scariest story' }],
  ] },
  { loc: 'bed', tagS: 'SIGN 6 / 7', beats: [
    ["Sign six: you can't fall asleep.", { hl: "can't fall asleep" }],
    ['Your body is tired, but your mind starts a meeting', {}],
    ['about everything that happened today, and everything that might happen tomorrow.', {}],
  ] },
  { loc: 'fire', tagS: 'SIGN 7 / 7', beats: [
    ['Sign seven: you feel exhausted, even when you did nothing.', { pose: 'tired_sigh', hl: 'exhausted' }],
    ['Because thinking all day is work too.', { pose: 'sad_hug_knees' }],
    ['Your brain ran a marathon, and you never left the couch.', { pose: 'sad_hug_knees', hl: 'a marathon' }],
  ] },
  { loc: 'board', beats: [
    ['If you saw yourself in three or more of these, take a breath.', { pose: 'meditating', write: [['3+ signs?', 725, 200, 80, RED]] }],
    ["It doesn't mean something is wrong with you.", { pose: 'meditating' }],
    ['It means your brain is trying too hard to protect you.', { pose: 'realization', write: [['your brain is trying to help', 725, 300, 44, BLACK]] }],
    ['And here is how to calm it down.', { pose: 'confident', write: [['5 FIXES', 725, 400, 70, GREEN]] }],
  ] },
  // ----- 5 fixes -----
  { loc: 'study', tagS: 'FIX 1 / 5', tagC: '#7fd18a', beats: [
    ['Fix one: give your worries a time slot.', { pose: 'idea', ui: 'timer', hl: 'a time slot' }],
    ['Set a timer for five minutes, and let yourself worry about everything.', { pose: 'thinking_gears', ui: 'timer' }],
    ['When the timer ends, the worry time is over.', { pose: 'confident', ui: 'timer0' }],
    ['If a thought comes back later, tell it: not now, see you tomorrow.', { pose: 'talking', talk: 1, hl: 'not now' }],
  ] },
  { loc: 'library', tagS: 'FIX 2 / 5', tagC: '#7fd18a', beats: [
    ['Fix two: write it down.', { pose: 'reading_happy', hl: 'write it down' }],
    ['Thoughts in your head feel huge and endless.', { pose: 'thinking_gears' }],
    ['On paper, they become just a few lines.', { pose: 'reading_happy', ui: 'note' }],
    ['And small enough to deal with.', { pose: 'realization', ui: 'note' }],
  ] },
  { loc: 'board', tagS: 'FIX 3 / 5', tagC: '#7fd18a', beats: [
    ['Fix three: ask one simple question.', { pose: 'question_think', hl: 'one simple question' }],
    ['Can I do something about this right now?', { pose: 'presenting', talk: 1, write: [['Can I do something', 725, 180, 56, BLUE], ['right now?', 725, 250, 56, BLUE]] }],
    ['If yes, do the smallest step.', { pose: 'confident', write: [['YES -> small step', 600, 350, 44, GREEN]] }],
    ['If no, let it go for now.', { pose: 'meditating', write: [['NO -> let it go', 860, 400, 44, RED]] }],
  ] },
  { loc: 'park', tagS: 'FIX 4 / 5', tagC: '#7fd18a', beats: [
    ['Fix four: move your body.', { pose: 'walking', hl: 'move your body' }],
    ['A short walk, without headphones.', { pose: 'walking' }],
    ['When your body moves, your mind slows down.', { pose: 'meditating', hl: 'slows down' }],
    ['Ten minutes outside can quiet more thoughts than an hour in bed.', { pose: 'excited_wave' }],
  ] },
  { loc: 'mountain', tagS: 'FIX 5 / 5', tagC: '#7fd18a', beats: [
    ['Fix five: say it out loud.', { pose: 'talking', talk: 1, hl: 'say it out loud' }],
    ['Tell a friend, or just say it to yourself.', { pose: 'talking', talk: 1 }],
    ['A thought that sounded terrifying in your head', { pose: 'surprised' }],
    ['often sounds a lot smaller once you hear it.', { pose: 'realization', hl: 'a lot smaller' }],
  ] },
  { loc: 'board', beats: [
    ["Let's recap.", { pose: 'presenting', talk: 1, write: [['1. worry slot (5 min)', 725, 130, 44, BLUE]] }],
    ['A worry slot. Write it down.', { pose: 'presenting', talk: 1, write: [['2. write it down', 725, 195, 44, BLUE]] }],
    ['Ask: can I act now?', { pose: 'presenting', talk: 1, write: [['3. can I act now?', 725, 260, 44, BLUE]] }],
    ['Move your body. Say it out loud.', { pose: 'confident', write: [['4. move   5. say it out loud', 725, 325, 44, BLUE]] }],
    ["You don't need all five. Just start with one.", { pose: 'victory', hl: 'start with one', write: [['start with ONE', 725, 410, 54, GREEN]] }],
  ] },
  { loc: 'roofsun', beats: [
    ["Remember: your thoughts aren't facts.", { pose: 'meditating', hl: "aren't facts" }],
    ["And you don't have to answer every one of them.", { pose: 'meditating' }],
    ['What do you overthink about the most? Tell me in the comments.', { pose: 'question_think', ui: 'end1' }],
    ['And if this helped, subscribe. See you in the next one.', { pose: 'excited_wave', ui: 'end2' }],
  ] },
];

// ---------- timing ----------
const beatDur = s => Math.max(2.8, s.length * 0.072 + 0.9);
const TIMELINE = [];
let _t = 0.8;
SHOTS.forEach((sh, si) => {
  const start = _t; const beats = [];
  sh.beats.forEach(([say, o]) => { const d = beatDur(say); beats.push({ say, o, a: _t, b: _t + d }); _t += d; });
  _t += 0.6;
  TIMELINE.push({ sh, si, a: start, b: _t, beats });
});
const DUR = Math.ceil(_t + 1.5);

// ---------- UI per key ----------
function ui(key, t, bt, lt, op) {
  const x = 1000;
  switch (key) {
    case 'q1': return bubble(1010, 360, 'haha ok', op, true) + bubble(520, 200, 'did that sound rude?', op, false);
    case 'q2': return bubble(1010, 360, 'haha ok', 1, true) + bubble(520, 200, 'did that sound rude?', 1, false) + bubble(500, 265, 'are they mad at me?', op, false);
    case 'q3': return bubble(1010, 360, 'haha ok', 1, true) + bubble(520, 200, 'did that sound rude?', 1, false) + bubble(500, 265, 'are they mad at me?', 1, false) + bubble(480, 330, 'why did I say that?', op, false);
    case 'msgs': return [0, 1, 2].map(i => bubble(880 + i * 26, 220 + i * 62, 'haha ok', seg(lt, 0.3 + i * 0.4, 0.6 + i * 0.4), true)).join('');
    case 'x27': return [0, 1, 2].map(i => bubble(880 + i * 26, 220 + i * 62, 'haha ok', 1, true)).join('') +
      `<g opacity="${op}">${txt(1063, 413, '× 27', 56, INK)}${txt(1060, 410, '× 27', 56, P.mustard)}</g>`;
    case 'r1': return bubble(880, 240, '"Hey, so... about yesterday"', op, false);
    case 'r2': return bubble(880, 240, '"No wait, that sounds weird"', op, false);
    case 'r3': return bubble(880, 240, '"Hey! So, funny story..."', op, false);
    case 'abc': return choices(op, t);
    case 'timer': return timerUI(x, 200, Math.max(0, 300 - lt * 40), op);
    case 'timer0': return timerUI(x, 200, 0, op);
    case 'note': return noteUI(['- they might be busy', '- I can ask them', '- not a big deal'], op);
    case 'end1': return card([['What do YOU', '#fff'], ['overthink about?', P.mustard]], op);
    case 'end2': return card([['SUBSCRIBE', P.mustard], ['for more MiloLore', '#fff']], op);
  }
  return '';
}

const defs = `<defs><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;

function render(t) {
  _wid = 0;
  const cur = TIMELINE.find(s => t < s.b) || TIMELINE[TIMELINE.length - 1];
  const { sh, a: sa, beats } = cur, L = LOC[sh.loc];
  let s = defs + bg(ASSETS[L.img]);
  if (sh.loc === 'bed') {  // living light in the bed scene
    s += glw(272, 572, 70, '#ffb35c', 0.16 + 0.06 * Math.sin(t * 2)) + glw(170, 390, 110, '#ffcf8a', 0.10 + 0.03 * Math.sin(t * 5));
  }
  // current beat (or the last one before t)
  let bi = 0;
  beats.forEach((b, i) => { if (t >= b.a) bi = i; });
  const beat = beats[bi], o = beat.o;
  // board writing: all lines of this shot's beats up to now, each written when its beat starts
  beats.forEach((b, i) => {
    if (i > bi || !b.o.write) return;
    b.o.write.forEach(([str, x, y, size, col], j) => { s += written(str, x, y, size, col, t, b.a + 0.15 + j * 0.9, Math.min(1.4, 0.25 + str.length * 0.05)); });
  });
  // Milo (pose of the current beat; if a beat has no pose, keep the last one)
  if (L.x !== undefined) {
    let pose = 'question_think', talk = 0;
    for (let i = 0; i <= bi; i++) if (beats[i].o.pose) { pose = beats[i].o.pose; talk = beats[i].o.talk || 0; }
    s += milo2(pose, L.x, L.y, L.u, t, talk, L.sh);
  }
  // UI overlays
  if (o.ui) s += ui(o.ui, t, beat, t - beat.a, seg(t, beat.a + 0.1, beat.a + 0.35));
  if (sh.tagS) s += tag(sh.tagS, Math.min(seg(t, sa, sa + 0.3), 1 - seg(t, cur.b - 0.4, cur.b - 0.1)), sh.tagC);
  s += cap(beat.say, t, beat.a, beat.b, o.hl);
  // soft dip between shots
  const dip = TIMELINE.slice(1).map(c => Math.max(0, 1 - Math.abs(t - c.a + 0.3) / 0.25)).reduce((x, y) => Math.max(x, y), 0);
  return sframe(s + fade(Math.max(dip * 0.85, 1 - seg(t, 0, 0.6), seg(t, DUR - 1, DUR))), t, '#000');
}
