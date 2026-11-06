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

# marker on a whiteboard: soft, felt-tip scratch — gentle band-limited noise in rounded strokes, no squeak
def marker_sound(d):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    lo1 = np.zeros(n); lo2 = np.zeros(n); y1 = y2 = 0.0
    for k in range(n):
        y1 += 0.28 * (noise[k] - y1); y2 += 0.06 * (noise[k] - y2); lo1[k] = y1; lo2[k] = y2
    band = lo1 - lo2                                   # roughly 0.5-2 kHz: warm, not hissy
    rate = 6 + rng.random() * 2
    strokes = 0.55 + 0.45 * np.sin(np.pi * rate * t + rng.random() * 3) ** 2
    fade = np.minimum(1, np.minimum(t / 0.06, (d - t) / 0.08))
    return band * 1.6 * strokes * fade


if "--writes" in sys.argv:
    for w in json.load(open(sys.argv[sys.argv.index("--writes") + 1])):
        add(marker_sound(w["d"]), COLD + w["t"], 0.12)

if music:   # calm documentary theme: a soft piano melody (two 8-bar phrases) over quiet pad chords and a bass note
    beat = 60 / 72; bar = 4 * beat
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]         # Am, F, C, G — two bars each
    # melody (MIDI note, beats); 32 beats per phrase = 8 bars
    A = [(76, 2), (72, 1), (74, 1), (76, 3), (69, 1),  (77, 2), (76, 1), (72, 1), (69, 4),
         (67, 1), (72, 1), (76, 2), (74, 2), (72, 2),  (71, 2), (74, 1), (79, 1), (74, 3), (71, 1)]
    B = [(72, 2), (76, 1), (81, 1), (79, 2), (76, 2),  (77, 1), (76, 1), (74, 1), (72, 1), (69, 4),
         (76, 2), (79, 2), (76, 2), (72, 2),           (74, 2), (71, 2), (69, 4)]
    def pad(notes, d):
        n = int(d * SR); t = np.arange(n) / SR; sig = np.zeros(n)
        for m in notes:
            for det in (-0.08, 0.08):
                f = hz(m) * 2 ** (det / 12); sig += np.sin(2 * np.pi * f * t + rng.random() * 6)
        return sig * np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.5) / 6
    def bass(m, d):
        n = int(d * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * hz(m) * t) * np.minimum(1, t / 0.05) * np.exp(-t / 2.5)
    def piano(m, d):
        n = int((d + 1.2) * SR); t = np.arange(n) / SR; f = hz(m)
        tone = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) * np.exp(-t / 0.4) + 0.08 * np.sin(6 * np.pi * f * t) * np.exp(-t / 0.2)
        rel = np.where(t < d, 1.0, np.exp(-(t - d) / 0.35))                  # note held for its length, then a soft release
        return tone * np.minimum(1, t / 0.008) * np.exp(-t / 1.6) * rel
    t = 0.0; phrase = 0
    while t < total - 1:
        for k in range(4):                                                    # accompaniment for one 8-bar phrase
            ct = t + k * 2 * bar
            if ct < total: add(pad(prog[k], 2 * bar + 1.5), max(0, ct - 0.75), 0.0064); add(bass(prog[k][0] - 12, 2 * bar), ct, 0.009)
        mt = t
        for m, b in (A if phrase % 2 == 0 else B):
            if mt < total - 1: add(piano(m, b * beat * 0.95), mt, 0.0104, pan=0.1)
            mt += b * beat
        t += 8 * bar; phrase += 1

mix = np.stack([L, R], 1)
mix /= max(1.0, np.abs(mix).max() / 0.9)
with wave.open(out_path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(f"{out_path}: {total:.1f} s")
