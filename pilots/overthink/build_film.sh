#!/bin/bash
# Build the full "Stop Overthinking" film (no voice): 1440p video + barely-audible music (~-39 LUFS) + faint whooshes.
set -e
cd "$(dirname "$0")/.."
OUT=out/overthink; mkdir -p $OUT
NODE_PATH=$(npm root -g) node render_hq.js overthink/metrics.js,overthink/film.js $OUT/film_v.mp4 --scale 2 --jobs 4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT/film_v.mp4)
# shot change times for whooshes
CUTS=$(cat lib.js style.js overthink/metrics.js overthink/film.js | node -e "global.W=1280;global.H=720;let c='';process.stdin.on('data',d=>c+=d).on('end',()=>{eval(c+';console.log(TIMELINE.slice(1).map(s=>s.a.toFixed(2)).join(\" \"))')})")
python3 - "$DUR" $CUTS <<'PY'
import sys, wave, numpy as np
sys.path.insert(0, 'nothing'); import audio as A
dur = float(sys.argv[1]); tr = A.Track(dur)
for c in sys.argv[2:]: tr.add(float(c) - 0.45, A.whoosh(0.8), 0.5, send=0.4)
x = tr.dry + 0.5 * A.reverb(tr.wet); x = x / (np.abs(x).max() + 1e-9) * 0.9
w = wave.open('out/overthink/wh.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(A.SR)
w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
PY
M=music/emotional-piano-music-with-light-texture.mp3
ffmpeg -loglevel error -y -i $M -i $M -i $M -i $OUT/wh.wav -filter_complex \
 "[0][1]acrossfade=d=6:c1=qsin:c2=qsin[a];[a][2]acrossfade=d=6:c1=qsin:c2=qsin,atrim=0:$DUR,highpass=f=35,equalizer=f=3200:t=q:w=1.4:g=-2.5,treble=g=-4:f=7000,acompressor=threshold=-22dB:ratio=2:attack=40:release=400,afade=t=in:d=2,afade=t=out:st=$(python3 -c "print($DUR-5)"):d=5,loudnorm=I=-39:TP=-9:LRA=8,aresample=48000[m];[3]aresample=48000,volume=-44dB[w];[m][w]amix=inputs=2:normalize=0:duration=first,aresample=48000" \
 -c:a aac -b:a 320k $OUT/film_a.m4a
ffmpeg -loglevel error -y -i $OUT/film_v.mp4 -i $OUT/film_a.m4a -map 0:v -map 1:a -c copy -shortest $OUT/stop_overthinking_full_1440p.mp4
rm $OUT/film_v.mp4 $OUT/film_a.m4a $OUT/wh.wav
echo "done $DUR"
