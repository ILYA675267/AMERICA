#!/bin/bash
# Build the 50 s trial: video (1440p) + soft music bed (-21 LUFS) + a few very quiet whooshes at shot changes.
set -e
cd "$(dirname "$0")/.."
NODE_PATH=$(npm root -g) node render_hq.js overthink/trial.js out/overthink/trial_v.mp4 --scale 2 --jobs 4
python3 - <<'PY'
import sys, wave, numpy as np
sys.path.insert(0, 'nothing'); import audio as A
tr = A.Track(50)
for c in [9, 15, 21, 28, 36, 44]:
    tr.add(c - 0.45, A.whoosh(0.8), 0.5, send=0.4)
w = wave.open('out/overthink/wh.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(A.SR)
x = tr.dry + 0.5 * A.reverb(tr.wet); x = x / (np.abs(x).max() + 1e-9) * 0.9
w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
PY
ffmpeg -loglevel error -y -i music/emotional-piano-music-with-light-texture.mp3 -i out/overthink/wh.wav -filter_complex \
 "[0]atrim=0:50,highpass=f=35,equalizer=f=3200:t=q:w=1.4:g=-2.5,treble=g=-4:f=7000,acompressor=threshold=-22dB:ratio=2:attack=40:release=400,afade=t=in:d=2,afade=t=out:st=46:d=4,loudnorm=I=-31:TP=-9:LRA=8,aresample=48000[m];[1]volume=-36dB[w];[m][w]amix=inputs=2:normalize=0:duration=first,aresample=48000" \
 -c:a aac -b:a 320k out/overthink/trial_a.m4a
ffmpeg -loglevel error -y -i out/overthink/trial_v.mp4 -i out/overthink/trial_a.m4a -map 0:v -map 1:a -c copy -shortest out/overthink/stop_overthinking_trial_1440p.mp4
rm out/overthink/trial_v.mp4 out/overthink/trial_a.m4a out/overthink/wh.wav
echo done
