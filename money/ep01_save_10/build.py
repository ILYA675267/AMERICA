# Episode 01 of the money series: "What If You Saved $10 a Day for 10 Years?" (~9 min).
# Builds script.md (scenes: voiceover + what to animate + on-screen text) and fish_audio.md
# (voiceover split into chunks of at most 500 characters for Fish Audio).
# All money figures: $10/day deposited monthly, compounded monthly (see numbers.md).
import re

# (chapter, voiceover EN, animation plan RU, on-screen text)
P = [
 ("INTRO", "Ten dollars. That's one fancy coffee and a muffin. A delivery fee and a tip. Two streaming subscriptions you forgot you even had. You probably spend it every day without thinking.",
  "Герой у кофейни: в руке купюра $10, она по очереди превращается в кофе с маффином, в пакет доставки, в два экрана подписок.", "$10"),
 ("INTRO", "But what if, starting today, you didn't? What if you put away just ten dollars a day, every single day, for ten years? No lottery. No crypto. No secret trick. Just ten boring dollars.",
  "Герой останавливается, смотрит на купюру. Рядом появляются и зачёркиваются лотерейный билет, монета крипты, «волшебная палочка».", "10 YEARS"),
 ("INTRO", "By the end of this video, you'll see why that boring little habit could grow into more than fifty thousand dollars. Stick around, because in year five something happens that makes most people quit… and there's one mistake that could cost you over four hundred thousand dollars.",
  "Купюра падает в банку, банка быстро растёт до гигантской, герой задирает голову.", "$50,000+"),
 ("INTRO", "Quick note: this is for entertainment and education, not financial advice. Now… let's run the experiment.",
  "Короткая плашка-дисклеймер, герой кивает и закатывает рукава.", "NOT FINANCIAL ADVICE"),

 ("DAY ONE", "Day one. Morning. You're standing in line at the coffee shop. Normally, you'd order the giant caramel thing. Today, you turn around, walk out… and drop a ten-dollar bill into a glass jar on your desk.",
  "Очередь в кофейне, герой разворачивается, выходит. Дома кладёт купюру в стеклянную банку на столе.", "DAY 1"),
 ("DAY ONE", "It feels a little silly. Ten dollars won't change your life. And honestly? For a while, it really won't.",
  "Герой смотрит на одинокую купюру на дне банки и пожимает плечами.", ""),
 ("DAY ONE", "Ten dollars a day is seventy dollars a week. About three hundred dollars a month. Three thousand six hundred fifty dollars a year. That's the whole plan. No magic yet. Just math.",
  "Рядом с героем появляются и складываются цифры: $70 / неделя → $300 / месяц → $3,650 / год.", "$3,650 / YEAR"),

 ("OPTION 1: THE JAR", "Option one: you keep everything in that jar. After ten years, you'd have thirty-six thousand five hundred dollars. Not bad! Except… there's a thief in your room.",
  "Банка доверху. Из тени у шкафа выглядывает воришка с мешком.", "$36,500"),
 ("OPTION 1: THE JAR", "The thief is called inflation. Over the long run, prices in America have gone up about three percent a year on average. So every year, each dollar in your jar buys a little less.",
  "Воришка-инфляция с надписью на мешке «3%» понемногу вытаскивает купюры. Рядом бургер, на ценнике растёт цена.", "INFLATION ≈ 3% / YEAR"),
 ("OPTION 1: THE JAR", "After ten years, your thirty-six thousand dollars would only buy about what thirty-one thousand buys today. Your money didn't disappear. It just quietly shrank.",
  "Банка с купюрами медленно сжимается. Герой грустно смотрит.", "$36,500 → ≈ $31,500"),

 ("OPTION 2: THE BANK", "Option two: a savings account. Let's say it pays four percent interest a year. Now the bank pays you for keeping your money there. After ten years, you'd have around forty-five thousand dollars.",
  "Герой приносит банку в банк; кассир возвращает ему чуть больше купюр. Счётчик растёт.", "4% → ≈ $44,800"),
 ("OPTION 2: THE BANK", "That's more than eight thousand dollars you never had to work for. But savings rates go up and down, and four percent isn't guaranteed. So let's look at the option most long-term investors choose.",
  "Стрелка ставки качается вверх-вниз. Герой переводит взгляд на дверь с надписью «Option 3».", ""),

 ("OPTION 3: THE INDEX FUND", "Option three: an index fund. Instead of betting on one company, you buy a tiny slice of hundreds of big companies at once. When the whole economy grows over time, your slice grows with it.",
  "Огромный пирог из сотен маленьких зданий-компаний; герой отрезает себе тонкий кусочек.", "INDEX FUND"),
 ("OPTION 3: THE INDEX FUND", "Historically, the U.S. stock market has averaged around ten percent a year, or roughly seven percent after inflation. Not every year. Some years it falls hard. But over long stretches, that's been the average.",
  "Рисованный график: зигзаг с падениями, но общая линия идёт вверх.", "≈ 10% / YEAR (≈ 7% AFTER INFLATION)"),
 ("OPTION 3: THE INDEX FUND", "Quick guess before I tell you. How much would you have? Thirty-six thousand? Fifty? A hundred? Write your guess in the comments. Okay… if your ten dollars a day earned seven percent a year, after ten years you'd have about fifty-two thousand six hundred dollars. You only put in thirty-six thousand five hundred. The other sixteen thousand? Your money made that by itself.",
  "Две стопки: «Ты вложил $36,500» и сверху зелёная стопка «Деньги заработали сами $16,100».", "$52,600"),

 ("OPTION 3: THE INDEX FUND", "One warning: fees. A fund that charges one percent a year sounds tiny. But over thirty years, a one percent fee on your ten dollars a day could eat around sixty-five thousand dollars. That's why many long-term investors look for low-cost index funds.",
  "Маленький жучок-«комиссия 1%» потихоньку откусывает от растущей стопки денег.", "1% FEE ≈ -$65,000 / 30 YEARS"),

 ("THE SNOWBALL", "This is compound interest. Your money earns money. Then that money earns money too. It's like a snowball rolling downhill: tiny at first, then bigger… until it grows faster than you can push it.",
  "Герой толкает маленький снежок из монет с горки, снежок растёт и обгоняет героя.", "COMPOUND INTEREST"),
 ("THE SNOWBALL", "There's a famous quote, often credited to Albert Einstein, calling compound interest the eighth wonder of the world. There's no proof he ever said it. But the math is very real.",
  "Рисованный портрет учёного с растрёпанными волосами, рядом знак вопроса.", "\"8TH WONDER OF THE WORLD\""),
 ("THE SNOWBALL", "Here's a handy trick called the Rule of 72. Divide 72 by your yearly return, and you get roughly how many years it takes your money to double. At seven percent, that's about ten years.",
  "На доске пишется 72 ÷ 7 ≈ 10, стопка денег удваивается.", "RULE OF 72"),

 ("THE BORING YEARS", "Knowing the math is easy. Living through it is hard. So let's watch your jar, year by year. Year one. You've saved three thousand six hundred fifty dollars, and your investments earned you… about a hundred and twenty. That's it. It feels like nothing is happening.",
  "Календарь «YEAR 1». Герой разглядывает крошечную монетку прибыли через лупу.", "YEAR 1: +$120"),
 ("THE BORING YEARS", "Year three. Twelve thousand dollars. Your friends are buying new phones and flying to Miami. You're still dropping ten dollars into a jar. This is the part where most people quit.",
  "Друзья с новыми телефонами и чемоданами машут на прощание; герой с банкой.", "YEAR 3: $12,100"),
 ("THE BORING YEARS", "Year five. The market suddenly crashes. In a few weeks, your account drops about thirty percent, from twenty-two thousand to around fifteen. Every news channel is screaming. And your brain screams: sell!",
  "График резко падает, вокруг героя мигают экраны новостей с красными стрелками.", "-30%"),
 ("THE BORING YEARS", "But here's what history shows. The U.S. market has crashed many times, and every time so far, it eventually recovered, sometimes after years. People who panicked and sold locked in their losses. People who kept going were buying at a discount.",
  "Длинный график с несколькими провалами, после каждого линия снова выше.", ""),
 ("THE BORING YEARS", "So you keep going. Ten dollars a day. Year seven: about thirty-three thousand. Year nine: you notice the numbers are starting to move faster.",
  "Календарь листается, банка/счётчик растёт всё быстрее.", "YEAR 7: $32,900"),
 ("THE BORING YEARS", "And in year ten, something wild happens. Your money earns about three thousand four hundred dollars in a single year. Almost as much as you put in yourself. The snowball is finally rolling on its own.",
  "Снежок из монет катится сам, герой просто идёт рядом и улыбается.", "YEAR 10: +$3,400"),

 ("TIME BEATS MONEY", "Now, remember that four-hundred-thousand-dollar mistake? Here it comes. Don't stop at ten years. Keep the same ten dollars a day for thirty years, and at seven percent you'd have around three hundred seventy thousand dollars.",
  "Банка вырастает до размеров дома.", "30 YEARS: ≈ $371,000"),
 ("TIME BEATS MONEY", "Keep going for forty years, say from age twenty-five to sixty-five, and it's close to eight hundred thousand dollars. From ten dollars a day.",
  "Банка размером с небоскрёб, герой-старичок с тростью (та же фигура + очки) смотрит снизу вверх.", "40 YEARS: ≈ $800,000"),
 ("TIME BEATS MONEY", "But if you wait and start at thirty-five instead of twenty-five, you'd end up with less than half of that. Ten years of waiting would cost you over four hundred thousand dollars.",
  "Два героя-бегуна стартуют в разное время; второй отстаёт, его банка вдвое меньше.", "START AT 25: $798K · AT 35: $371K"),
 ("TIME BEATS MONEY", "Even Warren Buffett, one of the most successful investors in history, made about ninety-five percent of his fortune after his sixty-fifth birthday. His skill was investing. His secret was time.",
  "Рисованный старичок в очках с газетой; за ним вырастает гора денег на последнем отрезке временной линии.", "≈ 95% AFTER AGE 65"),

 ("WHY IT'S SO HARD", "So if it's this simple, why doesn't everyone do it? Because your brain is wired to love now. Psychologists call it present bias: a reward today feels bigger than a larger reward later.",
  "Над героем две картинки: кофе прямо перед носом и маленькая далёкая банка на горизонте.", "PRESENT BIAS"),
 ("WHY IT'S SO HARD", "A coffee is right there, warm and real. Fifty thousand dollars is ten years away and invisible. So your brain picks the coffee almost every time.",
  "Рука героя сама тянется к кофе, он ловит её второй рукой.", ""),
 ("WHY IT'S SO HARD", "The fix? Don't rely on willpower. In a famous program called Save More Tomorrow, economists Richard Thaler and Shlomo Benartzi let workers commit in advance to save part of their future raises automatically.",
  "Двое учёных-человечков у доски, рисуют стрелку от «будущей зарплаты» в копилку.", "SAVE MORE TOMORROW"),
 ("WHY IT'S SO HARD", "At the first company that tried it, average savings rates for people in the program jumped from three and a half percent to thirteen point six percent in about forty months. Not because they got more disciplined. Because saving happened automatically.",
  "Столбик сбережений растёт от маленького к большому.", "3.5% → 13.6%"),
 ("WHY IT'S SO HARD", "And no, this isn't really about coffee. Some experts say skipping lattes matters less than big choices like rent, cars and food. Fair point. Your ten dollars can come from anywhere: a subscription you never use, cooking one more dinner at home, or selling stuff you don't need.",
  "Перечёркнутая чашка кофе превращается в иконки: отменённая подписка, сковородка, коробка с вещами на продажу.", "IT'S NOT ABOUT COFFEE"),
 ("WHY IT'S SO HARD", "One rule before you invest: build a small emergency fund first, and pay off high-interest debt like credit cards. Paying off a card that charges around twenty percent is like earning twenty percent, guaranteed.",
  "Герой сначала наполняет маленькую копилку «на всякий случай», потом разрезает кредитку.", "EMERGENCY FUND → DEBT → INVEST"),
 ("WHY IT'S SO HARD", "So set up an automatic transfer. Ten dollars a day, or seventy a week, moved before you even see it. Out of sight, out of mind… and into your future.",
  "Телефон героя: деньги сами улетают с одной иконки в другую, герой спокойно пьёт чай дома.", "AUTOMATE IT"),

 ("WHAT IT REALLY BUYS", "And this isn't just about getting rich. According to the Federal Reserve, more than one in three American adults say they couldn't cover a surprise four-hundred-dollar expense with cash.",
  "Три человечка в ряд, у одного из них над головой появляется счёт на $400 и он хватается за голову.", "1 IN 3 CAN'T COVER $400"),
 ("WHAT IT REALLY BUYS", "With your ten-dollar habit, you could after about six weeks. After a year, a broken car or a surprise bill stops being a crisis. It's just an annoying Tuesday.",
  "У героя ломается машина (пар из капота), он спокойно достаёт деньги из банки.", ""),
 ("WHAT IT REALLY BUYS", "And after ten years, fifty thousand dollars means choices. Leaving a job you hate. Moving to a new city. Starting a business. Saying no. That's what money really buys: freedom.",
  "Герой открывает двери одну за другой: офис, другой город, своя маленькая лавка.", "FREEDOM"),

 ("ENDING", "So, what if you saved ten dollars a day for ten years? You wouldn't become a millionaire overnight. But you'd turn a coffee into a safety net, and a boring habit into real freedom.",
  "Герой у окна вечером, рядом полная банка, тёплый свет лампы.", ""),
 ("ENDING", "The best time to start was ten years ago. The second best time is today. And your first ten dollars is always the hardest one.",
  "Герой кладёт новую купюру в пустую банку: начало нового цикла.", "START TODAY"),
 ("ENDING", "So tell me in the comments: what would you give up to save ten dollars a day? And if you want to see the dark side of money, watch this next: what happens if you never pay off your credit card.",
  "Герой машет зрителю; за его спиной из тени вырастает долг-монстр (анонс следующего ролика).", "NEXT: CREDIT CARD DEBT"),
]

SOURCES = [
    "Расчёты: $10 в день вносятся ежемесячно, капитализация ежемесячная. 10 лет: банка $36,500; 4% → $44,788; 7% → $52,647; 6% (7% минус комиссия 1%) → $49,847. 30 лет: 7% → $371,075, 6% → $305,540. 40 лет: 7% → $798,381.",
    "Инфляция в США в долгосрочной перспективе ≈ 3% в год (BLS CPI, среднее за столетие).",
    "Средняя доходность рынка США ≈ 10% в год номинально, ≈ 7% с учётом инфляции (S&P 500, исторические данные).",
    "Цитата про «восьмое чудо света» приписывается Эйнштейну без доказательств (Quote Investigator).",
    "Баффет: ≈ 95% состояния после 65 лет — https://www.entrepreneur.com/business-news/warren-buffetts-wealth-grew-more-after-turning-65/495874 (оценки 95–98% в зависимости от даты).",
    "Save More Tomorrow: Thaler & Benartzi, 2004, Journal of Political Economy — https://econpapers.repec.org/RePEc:ucp:jpolec:v:112:y:2004:i:s1:p:s164-s187",
    "Средняя ставка по кредиткам в США ≈ 20%+ (Federal Reserve G.19).",
    "Fed SHED 2025: 63% могут покрыть $400 наличными (т. е. ≈37% нет) — https://www.federalreserve.gov/consumerscommunities/shed.htm",
]


# ---- kinetic words: numbers said in words -> "$3,650", "7%", "YEAR 3"; plus key terms. Each gets its position (0..1) in the scene.
UNITS = {w: i for i, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split())}
TENS = {w: 10 * (i + 2) for i, w in enumerate("twenty thirty forty fifty sixty seventy eighty ninety".split())}
SCALES = {"hundred": 100, "thousand": 1000, "million": 1000000}
KEYS = {"inflation": "INFLATION", "compound interest": "COMPOUND INTEREST", "index fund": "INDEX FUND", "fees": "FEES", "crashes": "CRASH!",
        "sell!": "SELL!", "freedom": "FREEDOM", "automatically": "AUTOMATIC", "present bias": "PRESENT BIAS", "snowball": "SNOWBALL",
        "rule of 72": "RULE OF 72", "warren buffett": "BUFFETT", "emergency fund": "EMERGENCY FUND", "lottery": "LOTTERY", "crypto": "CRYPTO",
        "thief": "THIEF!", "time": None, "quit": "QUIT?", "mistake": "MISTAKE", "willpower": "WILLPOWER", "millionaire": "MILLIONAIRE"}


def kinetic(text):
    toks = [(m.group(0), m.start()) for m in re.finditer(r"[A-Za-z0-9!'-]+", text)]
    stop = {k for k, (w, p) in enumerate(toks) if p + len(w) < len(text) and text[p + len(w)] in ".?!:;,…"}
    out, i, low = [], 0, text.lower()
    while i < len(toks):
        w, pos = toks[i]; lw = w.lower().strip("!")
        parts = lw.split("-")
        if lw in UNITS or lw in TENS or all(x in UNITS or x in TENS for x in parts) and len(parts) > 1 or (lw == "a" and i + 1 < len(toks) and toks[i + 1][0].lower().startswith("hundred")):
            total, cur, j = 0, 0, i
            while j < len(toks):
                x = toks[j][0].lower().strip(".,!?")
                ps = x.split("-")
                if x == "a" and j == i: cur = 1
                elif all(p in UNITS or p in TENS for p in ps): cur += sum(UNITS.get(p, TENS.get(p, 0)) for p in ps)
                elif x in ("hundred",) or x.startswith("hundred"): cur = max(cur, 1) * 100
                elif x in ("thousand", "million") or x.split("-")[0] in ("thousand", "million"):
                    total += max(cur, 1) * SCALES[x.split("-")[0]]; cur = 0
                elif x == "and" and j + 1 < len(toks) and toks[j + 1][0].lower() in UNITS: pass
                else: break
                j += 1
                if j - 1 in stop: break
            val = total + cur
            nxt = toks[j][0].lower() if j < len(toks) else ""
            dec = ""
            if nxt == "point" and j + 1 < len(toks) and toks[j + 1][0].lower() in UNITS:
                dec = "." + str(UNITS[toks[j + 1][0].lower()]); j += 2; nxt = toks[j][0].lower() if j < len(toks) else ""
            prev = toks[i - 1][0].lower() if i else ""
            if nxt.startswith("dollar") or toks[j - 1][0].lower().endswith("dollar"):
                out.append((f"${val:,}{dec}", pos))
            elif nxt.startswith("percent"):
                out.append((f"{val}{dec}%", pos))
            elif prev == "year" and val <= 40:
                out.append((f"YEAR {val}", toks[i - 1][1]))
            elif nxt in ("years", "days", "months", "weeks") and val >= 5:
                out.append((f"{val} {nxt.upper()}", pos))
            i = max(j, i + 1); continue
        i += 1
    for k, v in KEYS.items():
        if v and k in low: out.append((v, low.index(k)))
    out.sort(key=lambda x: x[1])
    res, last = [], -1
    for w, pos in out:
        f = pos / max(1, len(text))
        if res and (w == res[-1]["w"] or f - last < 0.08): continue
        res.append({"w": w, "f": round(f, 3)}); last = f
    return res


# dramatic zoom onto the hero's face: scene index -> moment (fraction of the scene)
DRAMA = {2: 0.45, 9: 0.7, 14: 0.75, 21: 0.5, 26: 0.6}


def chunks(text, limit=500):
    """Split at sentence ends into as few chunks as possible, balanced in length, each <= limit."""
    sents = re.split(r'(?<=[.!?…])\s+(?=[A-Z"])', text)
    k = -(-len(text) // (limit - 30))
    while True:
        target, out, cur = len(text) / k, [], ""
        for s in sents:
            if cur and (len(cur) + 1 + len(s) > limit or (len(cur) >= target and len(out) < k - 1)):
                out.append(cur); cur = s
            else:
                cur = (cur + " " + s).strip()
        out.append(cur)
        if all(len(c) <= limit for c in out):
            return out
        k += 1


def blocks_of(P):
    """Chapter blocks of concatenated scene texts, with (scene index, start, end) char spans."""
    out, ch, buf, spans = [], None, "", []
    for i, (c, en, _, _) in enumerate(P):
        if c != ch and buf:
            out.append((ch, buf, spans)); buf, spans = "", []
        ch = c
        start = len(buf) + (1 if buf else 0)
        buf = (buf + " " + en).strip()
        spans.append((i, start, len(buf)))
    out.append((ch, buf, spans))
    return out


def retime(audio_dir):
    """Measure Fish Audio files 01.mp3..NN.mp3, give each scene its share of the audio, and join the voice track."""
    import json, subprocess, os
    files, durs, idx = [], [0.0] * len(P), 0
    for ch, text, spans in blocks_of(P):
        pos = 0
        for part in chunks(text):
            idx += 1
            f = next((os.path.join(audio_dir, f"{idx:02d}.{e}") for e in ("mp3", "wav", "m4a") if os.path.exists(os.path.join(audio_dir, f"{idx:02d}.{e}"))), None)
            if not f: raise SystemExit(f"missing audio file {idx:02d}.mp3 in {audio_dir}")
            files.append(f)
            dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
            a = text.index(part, pos); b = a + len(part); pos = b
            for i, s0, s1 in spans:
                ov = max(0, min(b, s1) - max(a, s0))
                durs[i] += dur * ov / len(part)
    data = json.load(open("scenes.json"))
    for d, x in zip(durs, data): d and x.update(dur=round(d, 3))
    open("scenes.json", "w").write(json.dumps(data, ensure_ascii=False, indent=1))
    open("concat.txt", "w").write("".join(f"file '{os.path.abspath(f)}'\n" for f in files))
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "concat.txt", "-af", "adelay=2500|2500", "-ar", "48000", "-ac", "2", "voice.wav"])
    print(f"{len(files)} audio files, total {sum(durs):.1f} s -> scenes.json retimed, voice.wav written")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2 and sys.argv[1] == "--audio":
        retime(sys.argv[2]); raise SystemExit
    words = sum(len(p[1].split()) for p in P)
    mins = words / 150
    # script.md
    md = ["# Ep. 01 — What If You Saved $10 a Day for 10 Years?\n",
          f"{len(P)} сцен · {words} слов озвучки · ≈ {mins:.1f} мин при спокойном темпе 150 слов/мин.\n",
          "**Название:** What If You Saved $10 a Day for 10 Years?  \n**Обложка:** `thumbnail.png`  \n"
          "**Описание (начало):** What happens if you put away just $10 a day for 10 years? We run the numbers: a jar, a savings account and an index fund — "
          "plus compound interest, the Rule of 72, and why your brain makes saving so hard. Not financial advice.\n"]
    ch = None; t = 0.0; chapters = []
    for i, (c, en, ru, ons) in enumerate(P, 1):
        if c != ch:
            md.append(f"\n## {c}\n"); ch = c; chapters.append((t, c))
        md.append(f"**{i:02d}.** {en}  \n_Анимация:_ {ru}" + (f"  \n_Надпись:_ `{ons}`" if ons else "") + "\n")
        t += len(en.split()) / 150 * 60
    md.insert(3, "**Главы (для описания):** " + " · ".join(f"{int(s // 60)}:{int(s % 60):02d} {c.title()}" for s, c in chapters) + "\n")
    md.append("\n## Источники\n" + "\n".join(f"- {s}" for s in SOURCES) + "\n")
    open("script.md", "w").write("\n".join(md))
    # fish_audio.md: one chunk per block of consecutive scenes within a chapter, each <= 500 chars
    fa = ["# Текст для Fish Audio — Ep. 01 ($10 a day)\n",
          "Каждый блок ≤ 500 символов = одна генерация. Копируйте блок целиком, называйте файл по номеру: `01.mp3`, `02.mp3`…  \n"
          "Голос: тёплый, уверенный, слегка дружелюбный американский. Скорость 1.0. Многоточия — паузы.\n"]
    n = 0; ch = None; buf = ""
    blocks = []
    for c, en, _, _ in P:
        if c != ch and buf:
            blocks.append((ch, buf)); buf = ""
        ch = c
        buf = (buf + " " + en).strip()
    blocks.append((ch, buf))
    for c, text in blocks:
        fa.append(f"\n## {c}\n")
        for part in chunks(text):
            n += 1
            fa.append(f"**{n:02d}** · {len(part)} симв.\n```\n{part}\n```\n")
    open("fish_audio.md", "w").write("\n".join(fa))
    # scenes.json for the animation (durations estimated at ~156 words/min until real voiceover timings exist)
    import json
    open("scenes.json", "w").write(json.dumps([{"ch": c, "en": en, "ons": ons.replace("≈ ", "~").replace("≈", "~"), "kw": [k for k in kinetic(en) if k["w"] not in ons], "drama": DRAMA.get(i), "words": len(en.split()),
        "dur": round(len(en.split()) / 2.6 + 0.6, 2)} for i, (c, en, _, ons) in enumerate(P)], ensure_ascii=False, indent=1))
    print(f"{len(P)} scenes, {words} words ≈ {mins:.1f} min, {n} Fish Audio chunks")
