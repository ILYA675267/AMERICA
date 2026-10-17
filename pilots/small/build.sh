#!/bin/bash
# Build "The Small Things" (4:32). Usage: small/build.sh [scale]   (2 = 1440p, 1 = 720p preview)
set -e
cd "$(dirname "$0")/.."
SCALE=${1:-2}; H=$(python3 -c "print(int(720*$SCALE))")
NODE_PATH=$(npm root -g) node render_hq.js small/common.js,small/film.js out/small/v.mp4 --scale $SCALE --jobs 4
python3 nothing/audio.py small out/small/wh.wav
# music bed (soft, -21 LUFS) + very quiet whooshes (peak ~ -26 dBFS); no loudness boost afterwards
ffmpeg -loglevel error -y -i music/bed_small_things_soft_4m32.mp3 -i out/small/wh.wav \
  -filter_complex "[1]volume=-24dB[w];[0][w]amix=inputs=2:normalize=0:duration=first,aresample=48000" -c:a aac -b:a 320k out/small/a.m4a
ffmpeg -loglevel error -y -i out/small/v.mp4 -i out/small/a.m4a -map 0:v -map 1:a -c copy -shortest out/small/the_small_things_${H}p.mp4
rm out/small/v.mp4 out/small/wh.wav out/small/a.m4a
echo "done out/small/the_small_things_${H}p.mp4"
