export const minorScale = [0, 2, 3, 5, 7, 8, 10];
const noteNames = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
export function minorNote(degree, voice) {
  const step = ((degree % 7) + 7) % 7;
  const midi = 48 + minorScale[step] + 12 * Math.floor(degree / 7) + [0, -12, 12][voice];
  return { hz: 440 * 2 ** ((midi - 69) / 12), name: noteNames[midi % 12] };
}
export function decimatorSettings(hz) {
  const pitch = Math.max(40, Math.min(1000, hz));
  return { sampleRate: Math.min(12000, pitch * 12), bits: Math.max(2, Math.min(6, Math.round(2 + Math.log2(pitch / 55)))) };
}
export function ensemble(lead, random = Math.random) {
  const count = 1 + Math.floor(random() * 3);
  const others = [0, 1, 2].filter(v => v !== lead);
  if (random() < .5) others.reverse();
  return [lead, ...others.slice(0, count - 1)];
}
export function automaticAction(random = Math.random) {
  const roll = random();
  return roll < .05 ? 'reaction' : roll < .18 ? 'laugh' : roll < .31 ? 'sing' : 'talk';
}
export function glidePitch(from, to, time, duration) {
  const fraction = Math.max(0, Math.min(1, time / duration));
  const smooth = fraction * fraction * (3 - 2 * fraction);
  return from * (to / from) ** smooth;
}
