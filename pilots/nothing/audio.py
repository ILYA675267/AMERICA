"""Soft soundtrack for the film "NOTHING" (48 kHz, stereo, gentle attacks, room reverb).

Usage: python3 audio.py <hook|minute> <out.wav>
"""
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(3)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


class Track:
    def __init__(self, dur):
        self.n = int(dur * SR)
        self.dry = np.zeros(self.n)
        self.wet = np.zeros(self.n)  # sent to reverb

    def add(self, start, sig, vol, send=0.35):
        i0 = int(start * SR)
        if i0 >= self.n:
            return
        sig = sig[: self.n - i0]
        self.dry[i0:i0 + len(sig)] += vol * sig
        self.wet[i0:i0 + len(sig)] += vol * send * sig


def env(n, attack, release):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(attack, 1e-4))
    r = int(release * SR)
    if r:
        e[-r:] *= np.linspace(1, 0, r) ** 1.5
    return e


def soft_tone(freq, dur, attack=0.01, decay=1.0, harm=0.15):
    """Soft piano/bell: sine with a touch of 2nd harmonic, exponential decay."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    w = np.sin(2 * np.pi * freq * t) + harm * np.sin(4 * np.pi * freq * t) * np.exp(-t / (decay * 0.4))
    return w * np.minimum(1, t / attack) * np.exp(-t / decay) * env(n, 0, 0.05)


def pad(notes, dur, attack=1.5, release=1.8):
    """Warm pad: detuned sines, slow attack/release, slight vibrato."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    w = np.zeros(n)
    for m in notes:
        f = midi(m)
        for d in (-0.12, 0.12):
            w += np.sin(2 * np.pi * f * 2 ** (d / 12) * t + 0.3 * np.sin(2 * np.pi * 0.25 * t))
        w += 0.25 * np.sin(4 * np.pi * f * t)
    return w / (len(notes) * 2.25) * env(n, attack, release)


def lowpass(x, a):
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc)
        y[i] = acc
    return y


def noise(dur, a=0.08, decay=0.05):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return lowpass(rng.standard_normal(n), a) * 4 * np.exp(-t / decay)


def tick(vol_scale=1.0):
    """Soft wooden clock tick."""
    return soft_tone(1900, 0.06, attack=0.001, decay=0.012, harm=0) * 0.6 + noise(0.06, 0.25, 0.008) * 0.3


def buzz(dur=0.45):
    """Phone vibration: low hum with a fast tremolo, rounded edges."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 150 * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * t)) * env(n, 0.02, 0.08)


def whoosh(dur=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return lowpass(rng.standard_normal(n), 0.05) * 3 * np.sin(np.pi * t / dur) ** 2


def blip(f0=520, f1=780, dur=0.18):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.06) * env(n, 0.004, 0.02)


def boom(dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 62 * np.exp(-t * 0.8) + 38
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.6) * env(n, 0.01, 0.3)


def reverb(x, seconds=2.2):
    """Convolution with decaying, low-passed noise — a soft room."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = lowpass(rng.standard_normal(n), 0.2) * np.exp(-t / (seconds / 5))
    ir[: int(0.02 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y


# ---------------- acts ----------------
def hook(tr):
    # dark minimal bed: A minor pad + slow heartbeat
    tr.add(0.0, pad([45, 52, 60], 10.2, attack=2.5), 0.10)
    for b in [0.6, 1.9, 3.2, 5.6, 7.4]:
        tr.add(b, buzz(), 0.12, send=0.15)
    for k in range(6):
        tr.add(4.5 + k * 0.95, soft_tone(55, 0.5, attack=0.005, decay=0.12, harm=0), 0.22, send=0.1)
        tr.add(4.72 + k * 0.95, soft_tone(52, 0.5, attack=0.005, decay=0.10, harm=0), 0.15, send=0.1)
    for t0, m in [(5.0, 69), (6.4, 72), (7.8, 71), (9.0, 76)]:  # tense little piano line
        tr.add(t0, soft_tone(midi(m), 2.0, decay=0.9), 0.07)
    # freeze-frame: everything drops to a hush, soft low hit
    tr.add(10.0, boom(1.4), 0.25, send=0.3)
    tr.add(10.0, pad([33, 45], 2.0, attack=0.05, release=1.0), 0.08)
    # "Tonight, you'll try. With him." — warm turn to C major
    tr.add(12.2, pad([48, 55, 64, 67], 5.0, attack=1.2), 0.10)
    for t0, m in [(12.8, 72), (13.6, 76), (14.4, 79), (15.2, 76)]:
        tr.add(t0, soft_tone(midi(m), 2.0, decay=1.0), 0.07)
    # title: low warm boom + chord + letter blips
    tr.add(17.15, boom(), 0.32, send=0.4)
    tr.add(17.2, pad([45, 52, 57, 60, 64], 2.8, attack=0.3, release=1.2), 0.11)
    for i in range(8):
        tr.add(17.2 + i * 0.09, soft_tone(midi(72 + [0, 2, 4, 7, 9, 7, 4, 12][i]), 0.6, decay=0.25), 0.035)


def minute(tr):
    # intro: friendly C major, kick-whoosh, 3-2-1 soft woodblocks, start bell
    tr.add(0.0, pad([48, 55, 64], 8.0, attack=1.0), 0.09)
    for t0, m in [(0.5, 72), (1.3, 76), (2.1, 79), (3.3, 77), (4.1, 76), (5.9, 74), (6.7, 72)]:
        tr.add(t0, soft_tone(midi(m), 2.0, decay=0.9), 0.06)
    tr.add(3.4, whoosh(0.6), 0.10, send=0.2)
    for i in range(3):
        tr.add(7.6 + i * 0.8, soft_tone(midi(84), 0.4, attack=0.002, decay=0.08, harm=0.3), 0.08)
    tr.add(10.0, soft_tone(midi(84), 3.0, decay=1.4, harm=0.4), 0.09, send=0.6)
    tr.add(10.0, soft_tone(midi(91), 3.0, decay=1.2, harm=0.2), 0.04, send=0.6)
    # the minute: very quiet pad changing every 10 s + one soft clock tick per second
    prog = [[45, 52, 60], [41, 48, 57], [48, 55, 64], [43, 50, 59], [45, 52, 60], [48, 55, 62, 64, 67]]
    for k, ch in enumerate(prog):
        tr.add(10 + k * 10 - 0.5, pad(ch, 11.5, attack=2.0, release=2.0), 0.07 if k < 5 else 0.09)
    for s in range(60):
        loud = 2.2 if 50 <= 10 + s < 58 else 1.0  # beat 5: the silence gets loud
        tr.add(10 + s + 1.0, tick(), 0.05 * loud, send=0.25)
    # beat 1: phone buzzes, crawls (tiny footsteps), slides back
    for b in [0.4, 1.6, 2.6, 4.2, 5.8]:
        tr.add(10 + b, buzz(), 0.11, send=0.15)
    for i in range(24):
        tr.add(12.6 + i * 0.2, noise(0.03, 0.4, 0.006), 0.05, send=0.1)
    tr.add(17.6, whoosh(0.5), 0.09, send=0.2)
    # beat 2: thought bubble pop in / out, small questioning notes
    tr.add(21.0, blip(), 0.06)
    for t0, m in [(22.0, 74), (22.6, 77), (24.0, 74), (24.6, 79)]:
        tr.add(t0, soft_tone(midi(m), 1.0, decay=0.4), 0.04)
    tr.add(27.5, blip(780, 420), 0.05)
    # beat 3: fridge opens — low hum + "psst" + magical shimmer, closes with a soft thud
    n = int(6 * SR)
    t = np.arange(n) / SR
    tr.add(31.0, (np.sin(2 * np.pi * 60 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)) * env(n, 0.8, 1.0), 0.05, send=0.1)
    tr.add(32.2, lowpass(rng.standard_normal(int(0.5 * SR)), 0.6) * env(int(0.5 * SR), 0.1, 0.3), 0.04, send=0.3)
    for i, m in enumerate([84, 88, 91, 96]):
        tr.add(31.2 + i * 0.12, soft_tone(midi(m), 1.5, decay=0.6, harm=0), 0.03, send=0.6)
    tr.add(37.6, noise(0.2, 0.05, 0.05), 0.10, send=0.2)
    # beat 4: the brain-producer — playful bass bounce
    tr.add(40.8, blip(), 0.06)
    for i, m in enumerate([43, 47, 50, 47, 43, 47, 50, 55]):
        tr.add(41.4 + i * 0.6, soft_tone(midi(m), 0.5, attack=0.005, decay=0.18, harm=0.4), 0.08, send=0.15)
    tr.add(47.8, blip(780, 360), 0.05)
    # beat 6 (60–70): breathing swells, 4-second cycle
    for k in range(3):
        n = int(4 * SR)
        tr.add(60 + k * 4, lowpass(rng.standard_normal(n), 0.03) * 2 * np.sin(np.pi * np.arange(n) / n) ** 2, 0.05, send=0.4)
    # bloom: chimes + bright pad + low warm boom
    tr.add(70.0, boom(2.0), 0.18, send=0.5)
    tr.add(70.0, pad([48, 55, 60, 64, 67, 71], 5.0, attack=0.4, release=2.0), 0.11)
    for i, m in enumerate([72, 76, 79, 83, 84, 88, 91, 96]):
        tr.add(70.1 + i * 0.11, soft_tone(midi(m), 2.5, decay=1.1, harm=0.1), 0.05, send=0.7)
    for t0, m in [(72.2, 79), (72.8, 84), (73.4, 83), (74.0, 79)]:
        tr.add(t0, soft_tone(midi(m), 2.0, decay=1.0), 0.06)


def probe(tr):
    """Smooth only: slow warm pad chords that melt into each other + a few low, soft piano notes."""
    for i, ch in enumerate([[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]]):
        tr.add(i * 2.6 - 0.3, pad(ch, 4.2, attack=1.4, release=1.8), 0.09, send=0.5)
    for t0, m in [(0.8, 64), (2.2, 67), (3.6, 65), (5.0, 64), (6.4, 60), (7.8, 64), (8.5, 67)]:
        tr.add(t0, soft_tone(midi(m), 2.5, attack=0.03, decay=1.2, harm=0.05), 0.045, send=0.6)


ACTS = {"hook": (20, hook), "minute": (75, minute), "probe": (10, probe)}


def main():
    name, out = sys.argv[1], sys.argv[2]
    dur, fn = ACTS[name]
    tr = Track(dur)
    fn(tr)
    rev = reverb(tr.wet)
    left = tr.dry + 0.55 * rev
    right = tr.dry + 0.55 * np.roll(rev, int(0.011 * SR))  # tiny offset = width
    st = np.stack([left, right], 1)
    fade = int(0.4 * SR)
    st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    st[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]
    st = np.tanh(st * 1.1) / np.tanh(1.1)
    st *= 0.8 / (np.max(np.abs(st)) + 1e-9)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main()
