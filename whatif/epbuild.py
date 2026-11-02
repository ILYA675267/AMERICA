# Shared builder for episode files: prompt assembly, chapters, markdown + voiceover output.
from blocks import STYLE, HERO, CAST, THOUGHT


def TC(i):
    return f"{(i * 10) // 60}:{(i * 10) % 60:02d}"


def chapters(S):
    out = []
    for i, s in enumerate(S):
        if not out or out[-1][1] != s[0]:
            out.append((i, s[0]))
    return out


def prompt(S, LOC, i, visuals=THOUGHT):
    ch, loc, en, ru, cast, action, ons = S[i]
    same = i > 0 and S[i - 1][1] == loc
    cont = ("This shot continues directly from the previous one, in the same place, with the same framing. " if same
            else ("This shot follows directly after the previous one. " if i > 0 else ""))
    chars = [f"Main character: {HERO}"] + [f"{k.title()}: {CAST[k]}" for k in cast]
    return (f"10-second shot. {cont}Location: {LOC[loc]}\n\nAction: {action}\n\n" + "\n".join(chars) +
            f"\n\nVisual code: {visuals}\n\nStyle: {STYLE}")


def write(S, LOC, num, title, intro, thumb, sources, visuals=THOUGHT):
    chs = chapters(S)
    ep = [f"# Ep. {num} — {title} ({TC(len(S))})\n",
          f"{len(S)} клипов × 10 с. Плоская рисовка, одна непрерывная история: каждый клип начинается там, где закончился предыдущий. {intro}\n",
          f"**Название:** {title}  \n**Обложка:** {thumb}  \n"
          "**Главы для описания:** " + " · ".join(f"{TC(i)} {c.title()}" for i, c in chs) + "\n",
          f"**Как пользоваться:** «Промпт» → Google Vids целиком. «Озвучка» → Fish Audio (весь текст подряд — `ep{num}_voiceover.md`). "
          "«Надпись» — добавить в монтаже. Для связности: если Vids умеет начинать видео с картинки, давайте ему последний кадр предыдущего клипа.\n"]
    vo = [f"# Ep. {num} — текст для озвучки (Fish Audio)\n",
          f"Один голос рассказчика. Каждый блок = 10 секунд. Файлы: `ep{num}_01.mp3`, `ep{num}_02.mp3` … по номеру клипа.\n"]
    starts = dict(chs)
    for i, (ch, loc, en, ru, cast, action, ons) in enumerate(S):
        if i in starts:
            ep.append(f"\n# Глава: {ch}\n")
            vo.append(f"\n## {ch}\n")
        ep.append(f"---\n\n## Клип {i + 1:02d} · {TC(i)}–{TC(i + 1)}\n\n**Озвучка:**\n> {en}\n\n_Смысл:_ {ru}\n" +
                  (f"\n**Надпись на экране:** `{ons}`\n" if ons else "") +
                  f"\n**Промпт для Google Vids:**\n```\n{prompt(S, LOC, i, visuals)}\n```\n")
        vo.append(f"**{i + 1:02d}** ({TC(i)})  \n{en}\n")
    ep.append("---\n\n## Источники фактов (для описания под видео)\n" + "\n".join(f"- {x}" for x in sources) + "\n")
    open(f"ep{num}_{SLUG[num]}.md", "w").write("\n".join(ep))
    open(f"ep{num}_voiceover.md", "w").write("\n".join(vo))
    words = [len([w for w in s[2].split() if not w.startswith("(")]) for s in S]
    print(len(S), "clips,", sum(words), "words; over 27:", [(i + 1, n) for i, n in enumerate(words) if n > 27])


SLUG = {"01": "read_minds", "02": "everyone_tells_truth"}
