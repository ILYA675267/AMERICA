# Shared prompt blocks. Edit HERO once, then run `python3 build_ep01.py` to regenerate every prompt.
STYLE = ("Stylized 3D animated film look, high-quality 3D render, soft rounded shapes, detailed three-dimensional "
         "environment with real depth and perspective, cinematic volumetric lighting with soft shadows, gentle dust "
         "particles floating in light beams, shallow depth of field, rich but slightly moody color grading, 16:9. "
         "No text, no subtitles, no logos, no speech, no lip movement. Sound: soft ambient sound only, no dialogue, no music.")

# The channel's character (reference: hero_reference.jpg).
HERO = ("a cute minimalist 3D cartoon character: a very large, perfectly smooth round head, slightly wider than tall, "
        "about as big as the whole body, made of matte off-white material like a soft vinyl toy; two small solid black "
        "dot eyes set wide apart, a thin simple curved black smile line, no nose, no ears, no hair, no eyebrows; "
        "no neck, a small simple off-white body with no clothes, short thin arms with rounded mitten hands, short "
        "straight legs with small rounded feet; a subtle thin dark outline around the silhouette, like a simple "
        "hand-drawn doodle brought to life in 3D.")

CAST = {
    "MOM": "a taller character of the same minimalist style (big round matte off-white head, black dot eyes, simple line mouth, no nose) with a small brown hair bun on top of her head and a mustard-yellow scarf.",
    "DAD": "a taller character of the same minimalist style (big round matte off-white head, black dot eyes, simple line mouth, no nose) with round black glasses and a small brown mustache.",
    "JAKE": "a character of the same minimalist style (big round matte off-white head, black dot eyes, simple line mouth, no nose), HERO's best friend, wearing a red baseball cap backwards.",
    "EMMA": "a character of the same minimalist style (big round matte off-white head, black dot eyes, simple line mouth, no nose) with a short dark bob haircut and a yellow headband.",
    "LEO": "a character of the same minimalist style (big round matte off-white head, black dot eyes, simple line mouth, no nose) with big round black glasses and a tiny blue bow tie.",
    "CROWD": "many characters of the same minimalist style (big round matte off-white heads, black dot eyes, no noses), each with one small colorful accessory like a hat, scarf or glasses, slightly out of focus.",
}

THOUGHT = "soft glowing pale-blue translucent wisps of light that float from a person's head toward HERO."
