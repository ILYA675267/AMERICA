# Shared prompt blocks. Edit HERO once, then run `python3 build_ep01.py` to regenerate every prompt.
STYLE = ("Stylized 3D animated film look, high-quality 3D render, soft rounded shapes, detailed three-dimensional "
         "environment with real depth and perspective, cinematic volumetric lighting with soft shadows, gentle dust "
         "particles floating in light beams, shallow depth of field, rich but slightly moody color grading, 16:9. "
         "No text, no subtitles, no logos, no speech, no lip movement. Sound: soft ambient sound only, no dialogue, no music.")

# TODO: replace with the description of the channel's own character.
HERO = "[HERO — paste the full description of your character here: age, face, hair, clothes, colors, signature detail]"

CAST = {
    "MOM": "a friendly woman in her forties with a warm smile, shoulder-length brown hair, a mustard-yellow scarf and a soft beige cardigan.",
    "DAD": "a kind man in his forties with round glasses, a short brown mustache and a navy-blue sweater.",
    "JAKE": "a teenage boy, HERO's best friend, with messy blond hair, a red baseball cap worn backwards and a grey hoodie.",
    "EMMA": "a teenage girl with a short dark bob haircut, a yellow headband and a teal jacket.",
    "LEO": "a skinny teenage boy with big round glasses, neat side-parted hair and a white collared shirt.",
    "CROWD": "many stylized 3D cartoon people of different ages and looks with simplified faces, slightly out of focus.",
}

THOUGHT = "soft glowing pale-blue translucent wisps of light that float from a person's head toward HERO."
