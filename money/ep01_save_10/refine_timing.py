# Refine scene durations with word timestamps (audio/words.json from a speech recognizer):
# each scene boundary inside a voice chunk is placed at the moment its first word is actually spoken.
import json, re, difflib, subprocess, importlib.util
spec = importlib.util.spec_from_file_location("build", "build.py"); B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
words = json.load(open("audio/words.json"))
norm = lambda t: re.sub(r"[^a-z0-9 ]", " ", t.lower()).split()
data = json.load(open("scenes.json"))
starts = {}                     # scene index -> absolute start time (s, from the start of the voice track)
offset, idx = 0.0, 0
for ch, text, spans in B.blocks_of(B.P):
    pos = 0
    for part in B.chunks(text):
        idx += 1; n = f"{idx:02d}"
        a = text.index(part, pos); pos = a + len(part)
        dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"audio/{n}.mp3"]))
        sw = norm(part); hw = [(norm(w)[0] if norm(w) else "", s0) for w, s0, _ in words[n]]
        sm = difflib.SequenceMatcher(None, sw, [w for w, _ in hw], autojunk=False)
        pairs = [(i1 + k, hw[j1 + k][1]) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag == "equal" for k in range(i2 - i1)]
        def t_at(wi):           # time of script word wi: nearest matched word, else proportional
            if not pairs: return dur * wi / max(1, len(sw))
            before = [p for p in pairs if p[0] <= wi]; after = [p for p in pairs if p[0] >= wi]
            if before and before[-1][0] == wi: return before[-1][1]
            if before and after: (w0, t0), (w1, t1) = before[-1], after[0]; return t0 + (t1 - t0) * (wi - w0) / (w1 - w0)
            return (after[0][1] if after else before[-1][1])
        for i, s0, s1 in spans:
            if s0 >= a and s0 < a + len(part) and i not in starts:
                wi = len(norm(part[: s0 - a]))
                starts[i] = offset + (0.0 if s0 == a else max(0.0, t_at(wi) - 0.15))
        offset += dur
order = sorted(starts)
for k, i in enumerate(order):
    end = starts[order[k + 1]] if k + 1 < len(order) else offset
    data[i]["dur"] = round(end - starts[i], 3)
json.dump(data, open("scenes.json", "w"), ensure_ascii=False, indent=1)
print(len(order), "scenes,", round(offset, 1), "s; shortest", min(x["dur"] for x in data))
