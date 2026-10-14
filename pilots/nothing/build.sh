#!/bin/bash
# Build acts of "NOTHING". Usage: nothing/build.sh <scale> <act...>   (scale 2 = 1440p final, 1 = 720p preview)
# Output: out/nothing/<act>_<height>p.mp4 and, when several acts are given, out/nothing/part_<height>p.mp4
set -e
cd "$(dirname "$0")/.."
SCALE=$1; shift
H=$(python3 -c "print(int(720*$SCALE))")
mkdir -p out/nothing
declare -A FILE=([hook]=a0_hook.js [minute]=a3_minute.js)
LIST=out/nothing/list_${H}.txt; : > $LIST
for ACT in "$@"; do
  NODE_PATH=$(npm root -g) node render_hq.js nothing/common.js,nothing/${FILE[$ACT]} out/nothing/${ACT}_v.mp4 --scale $SCALE --jobs 4
  python3 nothing/audio.py $ACT out/nothing/${ACT}.wav
  ffmpeg -loglevel error -y -i out/nothing/${ACT}_v.mp4 -i out/nothing/${ACT}.wav -c:v copy \
    -af "loudnorm=I=-15:TP=-1.5:LRA=11,aresample=48000" -c:a aac -b:a 320k -shortest out/nothing/${ACT}_${H}p.mp4
  rm out/nothing/${ACT}_v.mp4 out/nothing/${ACT}.wav
  echo "file '${ACT}_${H}p.mp4'" >> $LIST
done
if [ $# -gt 1 ]; then ffmpeg -loglevel error -y -f concat -safe 0 -i $LIST -c copy out/nothing/part_${H}p.mp4; fi
rm $LIST
