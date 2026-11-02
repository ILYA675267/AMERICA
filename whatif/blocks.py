# Shared prompt blocks for every Google Vids prompt. Edit here, then run `python3 build_ep01.py`.
# Look: flat 2D hand-drawn doodle (like A Better Mind / BetterU), black marker on off-white paper, few color accents.
STYLE = ("Flat 2D hand-drawn doodle animation, like a simple whiteboard explainer video: clean thick black marker "
         "outlines on a plain off-white paper background, flat colors, no shading, no gradients, no 3D, no realistic "
         "textures, minimal sketchy backgrounds drawn with only a few simple lines, lots of empty space, only small "
         "accents of color, slightly wobbly hand-drawn line boil, simple smooth movements, 16:9. No text, no letters, "
         "no numbers, no subtitles, no logos, no speech, no lip movement. Sound: no music, no dialogue, quiet ambient "
         "sound only.")

# The channel's character (reference: hero_reference.jpg).
HERO = ("a simple hand-drawn doodle character: a very large round white head, slightly wider than tall and about as "
        "big as the whole body, two small solid black dot eyes set wide apart, a thin curved black smile line, no nose, "
        "no ears, no hair, no eyebrows, no neck, a small simple white body with no clothes, short thin arms with rounded "
        "mitten hands, short straight legs with small rounded feet, drawn with thick black marker outlines and filled "
        "with plain white.")

_SAME = "a doodle character in the same style (big round white head, black dot eyes, simple line mouth, no nose, thick black marker outlines)"
CAST = {
    "MOM": f"{_SAME}, a bit taller, with a small brown hair bun on top of her head and a mustard-yellow scarf.",
    "JAKE": f"{_SAME}, the main character's best friend, wearing a red baseball cap backwards.",
    "EMMA": f"{_SAME}, a girl with a short dark bob haircut and a yellow headband.",
    "LEO": f"{_SAME}, with big round black glasses and a tiny blue bow tie.",
    "TEACHER": f"{_SAME}, taller, with a green cardigan and a small grey beard.",
    "OLDMAN": f"{_SAME}, an old man with a knitted orange hat and a walking cane.",
    "GRANDMA": f"{_SAME}, an old woman with a grey hair bun, round glasses and a purple shawl, lying in a hospital bed.",
    "DOCTOR": f"{_SAME}, wearing a white coat and a light-blue stethoscope.",
    "SALESMAN": f"{_SAME}, wearing a bright orange shirt and a name badge with no readable text.",
    "KID": f"{_SAME}, a small child with a green beanie.",
    "NEIGHBOR": f"{_SAME}, with curly brown hair and a pink apron.",
    "POLITICIAN": f"{_SAME}, in a dark-blue suit and a red tie, standing at a podium with microphones.",
    "CROWD": "several doodle characters in the same style (big round white heads, black dot eyes, no noses), each with one small colored accessory like a hat, scarf or glasses.",
}

THOUGHT = ("other people's ordinary thoughts are small pale-blue scribbled thought clouds drawn with a marker that float "
           "from their heads; dark intrusive thoughts are messy dark-red scribbles; the main character's own thoughts "
           "are a small yellow scribble above his head.")
