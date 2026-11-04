# Sound effects + a quiet music bed for a scene list (synthesized, no copyrighted samples).
# Usage: python3 sfx.py scenes.json out.wav [--no-music]
# Events (same timing as scenes/money01.js): whoosh at every scene cut, "pop" when the label slams in,
# coin jingle on money labels, low boom on bad news, soft tick on every new phrase.
import json, re, sys, wave
import numpy as np

SR = 48000
data = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
music = "--no-music" not in sys.argv
COLD = 2.5                     # cold open before the first scene (matches scenes/money01.js)
total = sum(s["dur"] for s in data) + COLD + 1.0
L = np.zeros(int(total * SR)); R = np.zeros_like(L)
rng = np.random.default_rng(1)


def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(len(L), i + len(sig))
    if i >= len(L): return
    s = sig[: j - i] * gain
    L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))


def whoosh(d=0.38):
    n = int(d * SR); noise = rng.standard_normal(n)
    t = np.linspace(0, 1, n); out = np.zeros(n); y = 0.0
    a = 0.02 + 0.25 * np.sin(np.pi * t)            # sweeping one-pole low-pass
    for k in range(n): y += a[k] * (noise[k] - y); out[k] = y
    return out * np.sin(np.pi * t) ** 2 * 0.9


def pop():
    n = int(0.18 * SR); t = np.arange(n) / SR
    f = 600 * np.exp(-t * 30) + 180
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.05)


def coin(f0):
    n = int(0.5 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f0 * t) + 0.5 * np.sin(2 * np.pi * f0 * 1.5 * t)) * env(n, 0.001, 0.12)


def boom():
    n = int(0.9 * SR); t = np.arange(n) / SR
    f = 90 * np.exp(-t * 3) + 40
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.005, 0.35)


def tick():
    n = int(0.06 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 1400 * t) * env(n, 0.001, 0.012)


# cold open: rising coin cascade, slam, rewind whoosh
for k in range(14): add(coin(1800 + k * 120), 0.15 + k * 0.1, 0.08, pan=(k % 3 - 1) * 0.3)
add(pop(), 1.5, 0.7); add(boom(), 1.5, 0.7); add(whoosh(0.5), 2.05, 0.7)
t0 = COLD
for i, s in enumerate(data):
    if i: add(whoosh(), max(0, t0 - 0.12), 0.35, pan=0.4 if i % 2 else -0.4)
    parts = [p for p in re.split(r"(?<=[.!?…:])\s+", s["en"]) if p]
    total_w = len(s["en"].split()); w = 0
    for k, p in enumerate(parts):
        if k: add(tick(), t0 + w / total_w * s["dur"], 0.12)
        w += len(p.split())
    for k in s.get("kw") or []:                       # soft pop for every kinetic word
        add(pop(), t0 + k["f"] * s["dur"], 0.22, pan=0.3 if k["w"].startswith("$") else -0.3)
        if k["w"].startswith("$"): add(coin(2637), t0 + k["f"] * s["dur"] + 0.05, 0.06)
    if s.get("drama") is not None: add(boom(), t0 + s["drama"] * s["dur"], 0.8)
    if i and s["ch"] != data[i - 1]["ch"]: add(whoosh(0.6), t0, 0.6); add(pop(), t0 + 0.25, 0.4)
    ons = s.get("ons") or ""
    bstarts = []; ww = 0
    for p in parts: bstarts.append(ww / total_w * s["dur"]); ww += len(p.split())
    la = t0 + (bstarts[7] if i == 14 and len(bstarts) > 7 else 0)    # scene 14: the answer label comes at the reveal
    if ons:
        add(pop(), la + 0.3, 0.5)
        if "$" in ons:
            for k, f0 in enumerate([2093, 2637, 3136, 2349, 2794]): add(coin(f0), la + 0.55 + k * 0.07, 0.10, pan=(k - 2) * 0.2)
        if re.search(r"-|INFLATION|CAN'T|FEE", ons): add(boom(), la + 0.5, 0.6)
    t0 += s["dur"]

# marker on a whiteboard: scratchy band-limited noise in short strokes, with a faint squeak
def marker_sound(d):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    lo1 = np.zeros(n); lo2 = np.zeros(n); a1 = 0.55; a2 = 0.08; y1 = y2 = 0.0
    for k in range(n):
        y1 += a1 * (noise[k] - y1); y2 += a2 * (noise[k] - y2); lo1[k] = y1; lo2[k] = y2
    band = lo1 - lo2                                  # roughly 0.7-5 kHz
    rate = 7 + rng.random() * 3                        # pen strokes per second
    strokes = np.abs(np.sin(np.pi * rate * t + rng.random() * 3)) ** 0.6
    squeak = 0.15 * np.sin(2 * np.pi * (2300 + 300 * np.sin(2 * np.pi * 3 * t)) * t) * strokes
    fade = np.minimum(1, np.minimum(t / 0.03, (d - t) / 0.05))
    return (band * 2.2 * strokes + squeak) * fade


if "--writes" in sys.argv:
    for w in json.load(open(sys.argv[sys.argv.index("--writes") + 1])):
        add(marker_sound(w["d"]), COLD + w["t"], 0.32)

if music:   # gentle pluck arpeggio, I–V–vi–IV in C, 96 bpm, very low in the mix
    beat = 60 / 96
    chords = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]
    def pluck(midi, d=0.6):
        n = int(d * SR); t = np.arange(n) / SR; f = 440 * 2 ** ((midi - 69) / 12)
        return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.004, 0.25)
    def kick():
        n = int(0.25 * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * np.cumsum(60 * np.exp(-t * 20) + 45) / SR) * env(n, 0.002, 0.08)
    k = 0; t = 0.0
    while t < total - 1:
        ch = chords[(k // 8) % 4]
        add(pluck(ch[k % 4] + (12 if k % 8 >= 4 else 0)), t, 0.05, pan=0.3 if k % 2 else -0.3)
        if k % 2 == 0: add(pluck(ch[0] - 24, 1.2), t, 0.05)
        if k % 4 == 0: add(kick(), t, 0.07)
        t += beat / 2; k += 1

mix = np.stack([L, R], 1)
mix /= max(1.0, np.abs(mix).max() / 0.9)
with wave.open(out_path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(f"{out_path}: {total:.1f} s")
