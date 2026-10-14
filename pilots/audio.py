"""Synthesizes a 10 s soundtrack (music bed + sound effects) for each pilot.

Usage: python3 audio.py <v1_5am|v2_office|v3_365> <out.wav>
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 10.0
N = int(SR * DUR)
rng = np.random.default_rng(7)


def note(freq):
    return 440.0 * 2 ** ((freq - 69) / 12)


def tone(buf, start, dur, freq, vol=0.2, kind="sine", attack=0.005, decay=None, glide=None):
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 >= N:
        return
    n = min(n, N - i0)
    t = np.arange(n) / SR
    f = freq if glide is None else np.linspace(freq, glide, n)
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, (n,))) / SR
    if kind == "sine":
        w = np.sin(ph)
    elif kind == "square":
        w = np.sign(np.sin(ph)) * 0.5
    elif kind == "saw":
        w = 2 * ((ph / (2 * np.pi)) % 1) - 1
    elif kind == "pluck":  # soft electric-piano-ish tone
        w = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    env = np.minimum(1, t / attack)
    env *= np.exp(-t / decay) if decay else np.minimum(1, (dur - t) / 0.03)
    buf[i0:i0 + n] += vol * w * env


def noise(buf, start, dur, vol=0.3, decay=0.08, lowpass=1.0):
    i0 = int(start * SR)
    n = min(int(dur * SR), N - i0)
    w = rng.standard_normal(n)
    if lowpass < 1:  # one-pole low-pass for a duller thud
        for k in range(1, n):
            w[k] = w[k - 1] + lowpass * (w[k] - w[k - 1])
        w /= np.max(np.abs(w)) + 1e-9
    t = np.arange(n) / SR
    buf[i0:i0 + n] += vol * w * np.exp(-t / decay)


def pop(buf, t0, vol=0.35):
    tone(buf, t0, 0.12, 900, vol, glide=300, decay=0.05)


def whoosh(buf, t0, dur, vol=0.25):
    i0 = int(t0 * SR)
    n = int(dur * SR)
    w = rng.standard_normal(n)
    for k in range(1, n):
        w[k] = w[k - 1] + 0.08 * (w[k] - w[k - 1])
    w /= np.max(np.abs(w))
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    buf[i0:i0 + n] += vol * w * env


def chords(buf, prog, bpm, start, end, vol=0.06, kind="pluck", decay=0.6, rhythm=(0, 1.5, 2.5)):
    beat = 60 / bpm
    bar = 4 * beat
    t, i = start, 0
    while t < end:
        for off in rhythm:
            if t + off * beat < end:
                for m in prog[i % len(prog)]:
                    tone(buf, t + off * beat, beat * 1.5, note(m), vol, kind, decay=decay)
        tone(buf, t, bar, note(prog[i % len(prog)][0] - 12), vol * 1.2, "sine", decay=1.2)  # bass
        t += bar
        i += 1


def drums(buf, bpm, start, end, vol=0.25):
    beat = 60 / bpm
    t = start
    k = 0
    while t < end:
        if k % 2 == 0:
            tone(buf, t, 0.25, 110, vol, glide=45, decay=0.09)  # kick
        else:
            noise(buf, t, 0.15, vol * 0.5, decay=0.05)  # snare-ish
        noise(buf, t + beat / 2, 0.05, vol * 0.15, decay=0.015)  # hat
        t += beat
        k += 1


def v1(buf):
    chords(buf, [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], 92, 0.2, 4.3, vol=0.05)
    for i in range(8):  # alarm beeps
        tone(buf, 0.3 + i * 0.25, 0.12, 1760, 0.12, "square")
    noise(buf, 2.4, 0.4, 0.6, decay=0.08, lowpass=0.15)  # smash
    tone(buf, 2.4, 0.3, 90, 0.5, glide=40, decay=0.12)
    tone(buf, 2.7, 1.5, note(72), 0.05, "sine", decay=0.8)  # dreamy return to sleep
    tone(buf, 4.35, 0.5, 1200, 0.25, "saw", glide=200, decay=0.2)  # record-scratch-like panic
    tone(buf, 4.4, 0.6, note(84), 0.08, "square", decay=0.2)
    chords(buf, [[45, 48, 52], [41, 45, 48]], 70, 6.0, 8.2, vol=0.05, decay=1.0, rhythm=(0, 2))  # sad trombone-ish mood
    tone(buf, 6.3, 0.4, note(55), 0.12, "saw", decay=0.3, glide=note(54))
    tone(buf, 6.8, 0.4, note(54), 0.12, "saw", decay=0.3, glide=note(53))
    tone(buf, 7.3, 0.8, note(53), 0.12, "saw", decay=0.5, glide=note(50))
    pop(buf, 6.05)
    pop(buf, 8.25)
    pop(buf, 8.6)
    drums(buf, 120, 8.2, 9.8, 0.2)
    chords(buf, [[57, 60, 64], [53, 57, 60]], 120, 8.2, 9.8, vol=0.05)


def v2(buf):
    chords(buf, [[60, 64, 67], [57, 60, 64]], 100, 0.2, 2.2, vol=0.05)
    whoosh(buf, 1.3, 0.9, 0.35)
    chords(buf, [[62, 65, 69], [60, 64, 67], [58, 62, 65], [60, 64, 67]], 110, 2.3, 4.6, vol=0.05)
    pop(buf, 2.65)
    for i in range(18):  # "typing" blips for the speech bubble
        tone(buf, 2.8 + i * 0.055, 0.03, 900 + (i % 3) * 150, 0.04, "square")
    noise(buf, 4.6, 0.3, 0.6, decay=0.07, lowpass=0.2)  # door bang
    tone(buf, 4.75, 0.5, 300, 0.15, "saw", glide=700)  # party horn
    for i in range(20):  # confetti sparkle
        tone(buf, 4.8 + i * 0.05, 0.08, 2000 + (i * 397) % 1500, 0.03, decay=0.04)
    drums(buf, 140, 4.8, 7.0, 0.22)
    chords(buf, [[64, 68, 71], [66, 69, 73]], 140, 4.8, 7.0, vol=0.05, rhythm=(0, 1, 2, 3))
    for i in range(6):  # siren
        tone(buf, 7.0 + i * 0.23, 0.23, 650 if i % 2 == 0 else 950, 0.12, "saw", glide=950 if i % 2 == 0 else 650)
    chords(buf, [[57, 60, 64], [55, 59, 62]], 80, 8.4, 9.8, vol=0.05, decay=1.0, rhythm=(0, 2))
    pop(buf, 8.55)
    pop(buf, 8.85)


def v3(buf):
    # slow, emotional "piano" in A minor -> C major lift
    beat = 60 / 70
    prog = [[57, 60, 64], [53, 57, 60]]
    for i, ch in enumerate(prog):
        for m in ch:
            tone(buf, 0.2 + i * 1.4, 2.5, note(m), 0.06, "pluck", decay=1.2)
    melody = [(0.4, 76), (1.1, 74), (1.8, 72), (2.4, 71)]
    for t0, m in melody:
        tone(buf, t0, 1.0, note(m), 0.07, "pluck", decay=0.6)
    # montage: building pulse + ticks
    drums(buf, 128, 3.0, 6.6, 0.18)
    chords(buf, [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], 128, 3.0, 6.6, vol=0.045, rhythm=(0, 1, 2, 3))
    for i in range(40):
        tone(buf, 3.0 + i * 0.09, 0.02, 2500, 0.03, "square")
    # summit: big major chord swell
    for m in [48, 60, 64, 67, 72, 76]:
        tone(buf, 6.6, 1.9, note(m), 0.055, "pluck", attack=0.3, decay=1.5)
    tone(buf, 7.0, 1.2, note(79), 0.06, "pluck", decay=0.8)
    pop(buf, 8.45)
    pop(buf, 8.8)
    for m in [53, 60, 65, 69]:
        tone(buf, 8.4, 1.5, note(m), 0.05, "pluck", decay=1.0)


def low_battery(buf, t0, vol=0.18):
    """Percy's signature sound: two descending soft beeps."""
    tone(buf, t0, 0.14, note(81), vol, "square", decay=0.1)
    tone(buf, t0 + 0.18, 0.2, note(76), vol, "square", decay=0.14)


def v4(buf):
    # morning: bright plucks + stretch "ding"
    chords(buf, [[60, 64, 67, 72], [65, 69, 72]], 96, 0.2, 2.3, vol=0.05)
    tone(buf, 0.9, 1.0, note(84), 0.07, "pluck", decay=0.6)
    # doom-scroll: fast loop, swipe whooshes, drain "glugs" descending
    drums(buf, 128, 2.4, 5.2, 0.18)
    chords(buf, [[62, 65, 69], [60, 64, 67]], 128, 2.4, 5.2, vol=0.04, rhythm=(0, 1, 2, 3))
    for i in range(8):
        whoosh(buf, 2.5 + i * 0.32, 0.18, 0.18)
        tone(buf, 2.62 + i * 0.32, 0.12, note(79 - i * 2), 0.08, "sine", decay=0.07, glide=note(74 - i * 2))
    # 3%: signature beeps
    for k in range(3):
        low_battery(buf, 5.3 + k * 0.5)
    # shutdown: falling power-down tone + thud
    tone(buf, 6.9, 0.8, 600, 0.2, "saw", glide=60, decay=0.4)
    noise(buf, 7.45, 0.3, 0.5, decay=0.07, lowpass=0.15)
    tone(buf, 7.45, 0.3, 80, 0.4, glide=40, decay=0.12)
    # title
    pop(buf, 8.1)
    pop(buf, 8.4)
    low_battery(buf, 8.8, 0.15)
    chords(buf, [[57, 60, 64], [53, 57, 60]], 96, 8.0, 9.8, vol=0.05)


def main():
    name, out = sys.argv[1], sys.argv[2]
    buf = np.zeros(N)
    {"v1_5am": v1, "v2_office": v2, "v3_365": v3, "v4_percy": v4}[name](buf)
    fade = int(0.3 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade)
    buf = np.tanh(buf * 1.2) / np.tanh(1.2) * 0.8  # soft limiter
    pcm = (buf * 32767).astype(np.int16)
    with wave.open(out, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main()
