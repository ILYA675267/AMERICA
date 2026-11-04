// Shared dawn street used by several scenes (the hero's neighbourhood). World is the 1920x1080 wide shot.
const WIN = { x: 864, y: 588, w: 192, h: 128 };   // hero's bedroom window in the center house
const SIDEWALK_Y = 787;                           // where characters stand

function buildStreet(opts = {}) {
  // ---- sky ----
  fn(() => {
    ctx.fillStyle = C.cloud;
    for (const [x, y, w, h] of [[360, 448, 330, 14], [610, 492, 140, 9], [1010, 440, 90, 8], [1100, 440, 110, 8], [1080, 488, 140, 10], [1230, 420, 190, 22], [1250, 482, 140, 10]]) {
      ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
    }
  });
  shape(G.circle(840, 488, 100, R({ stroke: '#d9b86a', strokeWidth: 1.2, fill: C.sun, fillStyle: 'solid', roughness: 0.5 })));
  for (let k = 0; k < 8; k++) {
    const a = k / 8 * 6.28 + 0.3;
    shape(G.arc(840, 488, 128, 128, a, a + 0.18, false, R({ stroke: '#b9a476', strokeWidth: 1.2 })));
  }

  // ---- far row ----
  house(170, 745, 150, 95, { far: true, windows: [[0.15, 0.3, 0.25, 0.3]], door: [0.6, 0.2], bricks: false });
  house(625, 742, 140, 90, { far: true, roundWin: true, door: [0.4, 0.22], bricks: false });
  tree(600, 745, 0.9, true);
  house(1090, 742, 140, 85, { far: true, chimney: true, windows: [[0.2, 0.3, 0.3, 0.3]], bricks: false });
  house(1230, 745, 130, 90, { far: true, windows: [[0.55, 0.3, 0.3, 0.3]], bricks: false });
  house(1480, 742, 150, 90, { far: true, roundWin: true, door: [0.3, 0.22], bricks: false });
  tree(320, 742, 0.8, true);
  tree(1690, 745, 0.9, true);
  tree(1010, 742, 0.75, true);
  tree(1860, 742, 0.8, true);
  fence(240, 380, 750, 50, true);
  fence(1060, 1290, 752, 62, true);

  // ---- main row ----
  house(45, 760, 200, 135, { roofH: 75, siding: true, door: [0.15, 0.2], windows: [[0.55, 0.28, 0.3, 0.28]] });
  house(385, 760, 230, 150, { roofH: 85, chimney: false, door: [0.62, 0.22], doorWin: true, windows: [[0.12, 0.3, 0.3, 0.32]] });
  bush(280, 760, 110);
  tree(650, 760, 1.15);
  fence(1075, 1290, 760, 75);
  house(815, 760, 290, 190, { roofH: 88, chimney: true, chimneyAt: 0.68, overhang: 12, bricks: true, avoid: [[WIN.x - 12, WIN.y - 12, WIN.w + 24, WIN.h + 24]] });
  if (opts.centerWindow) fn(opts.centerWindow);
  else windowDetailed(WIN.x, WIN.y, WIN.w, WIN.h);
  bush(700, 760, 105);
  bush(1150, 760, 110);
  house(1300, 760, 220, 150, { roofH: 90, shingles: true, chimney: true, chimneyAt: 0.78, windows: [[0.1, 0.3, 0.28, 0.32]], porch: [0.55, 0.3] });
  tree(1580, 760, 1.1);
  house(1640, 760, 230, 140, { roofH: 80, roundWin: true, siding: true, door: [0.72, 0.2], windows: [[0.15, 0.32, 0.3, 0.3]] });

  // ---- ground ----
  shape(G.line(40, 772, 1880, 772, R({ strokeWidth: OUT })));
  shape(G.line(36, 779, 1884, 779, R({ strokeWidth: DET })));
  shape(G.line(30, 800, 1890, 800, R({ strokeWidth: OUT })));
  for (let x = 120; x < 1880; x += 170) shape(G.line(x, 779, x - 6, 800, R({ strokeWidth: DET })));
  for (const x of [300, 760, 1240, 1700]) shape(G.path(`M${x} 786 l8 4 l-3 5 l9 3`, R({ strokeWidth: DET * 0.7 })));
  wash([[30, 800], [1890, 800], [1890, 808], [30, 808]], 'rgba(70,70,75,0.07)');
  shape(G.line(50, 862, 1870, 862, R({ strokeWidth: OUT })));
  for (let x = 140; x < 1870; x += 150) shape(G.line(x, 862, x + (x - 960) * 0.06, 884, R({ strokeWidth: DET })));
  for (const [x, y, s] of [[345, 848, 0.9], [1350, 848, 0.9], [520, 758, 0.8], [1020, 758, 0.7], [1210, 758, 0.8], [1625, 758, 0.8], [250, 758, 0.7], [1885, 758, 0.7], [700, 848, 0.6], [1560, 850, 0.6], [80, 850, 0.7]]) tuft(x, y, s);
  // mailbox by the hero's house
  shape(G.line(790, 760, 790, 712, R({ strokeWidth: OUT })));
  shape(G.path('M770 712 L770 696 Q790 680 810 696 L810 712 Z', R({ strokeWidth: OUT, fill: C.paperFill, fillStyle: 'solid' })));
  shape(G.line(806, 698, 806, 684, R({ strokeWidth: DET }))); shape(G.rectangle(806, 684, 10, 6, R({ strokeWidth: DET, fill: '#d98f7a', fillStyle: 'solid' })));
  for (const [x, y] of [[420, 830], [1480, 828], [990, 840]]) shape(G.ellipse(x, y, 6, 3, R({ strokeWidth: DET * 0.7 })));
}
