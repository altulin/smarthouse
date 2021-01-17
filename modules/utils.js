export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const emoji = {
  tree: `\u{1F332}`,
  therm: `\u{1F321}`,
  lamp: `\u{1F4A1}`,
  man: `\u{1f3cb}`,
  house: `\u{1F3E1}`,
  umbrella: `\u{2602}`,
  envelope: `\u{2709}`,
  backhand: `\u{1F447}`,
  hot: `\u{2668}`,
  gear: `\u{2699}`,
  hammer: `\u{1f6e0}`,
  clock: `\u{1f55b}`,
  proc: `\u{1F4BB}`,
  face: `\u{1F636}`,
  pouting: `\u{1F621}`
};
