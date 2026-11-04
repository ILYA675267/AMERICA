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
total = sum(s["dur"] for s in data) + 1.0
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


t0 = 0.0
for i, s in enumerate(data):
    if i: add(whoosh(), max(0, t0 - 0.12), 0.35, pan=0.4 if i % 2 else -0.4)
    parts = [p for p in re.split(r"(?<=[.!?…:])\s+", s["en"]) if p]
    total_w = len(s["en"].split()); w = 0
    for k, p in enumerate(parts):
        if k: add(tick(), t0 + w / total_w * s["dur"], 0.12)
        w += len(p.split())
    ons = s.get("ons") or ""
    if ons:
        add(pop(), t0 + 0.3, 0.5)
        if "$" in ons:
            for k, f0 in enumerate([2093, 2637, 3136, 2349, 2794]): add(coin(f0), t0 + 0.55 + k * 0.07, 0.10, pan=(k - 2) * 0.2)
        if re.search(r"-|INFLATION|CAN'T|FEE", ons): add(boom(), t0 + 0.5, 0.6)
    t0 += s["dur"]

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
