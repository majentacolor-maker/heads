export const minorScale = [0, 2, 3, 5, 7, 8, 10];
const noteNames = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
export function minorNote(degree, voice) {
  const step = ((degree % 7) + 7) % 7;
  const midi = 48 + minorScale[step] + 12 * Math.floor(degree / 7) + [0, -12, 12][voice];
  return { hz: 440 * 2 ** ((midi - 69) / 12), name: noteNames[midi % 12] };
}
export function decimatorSettings(hz) {
  const pitch = Math.max(20, Math.min(1000, hz));
  return { sampleRate: pitch * 6, bits: pitch < 60 ? 1 : pitch < 180 ? 2 : 3 };
}
export function ensemble(lead, random = Math.random) {
  const count = 1 + Math.floor(random() * 3);
  const others = [0, 1, 2].filter(v => v !== lead);
  if (random() < .5) others.reverse();
  return [lead, ...others.slice(0, count - 1)];
}
export function automaticAction(random = Math.random) {
  const roll = random();
  return roll < .20 ? 'reaction' : roll < .42 ? 'laugh' : roll < .57 ? 'sing' : 'talk';
}
export function glidePitch(from, to, time, duration) {
  const fraction = Math.max(0, Math.min(1, time / duration));
  const smooth = fraction * fraction * (3 - 2 * fraction);
  return from * (to / from) ** smooth;
}

// Shared speech gestures keep live playback and MP4 exports in sync.
export function speechSyllable(voice,basePitch,random=Math.random){
  if(voice===1){
    return [{hz:22*(180/22)**random(),duration:.085+random()*.12,gap:.025}];
  }
  const hz=basePitch*(.8+random()*.65);
  if(voice===2&&random()<.5){
    const count=3+Math.floor(random()*3),duration=.019+random()*.013;
    return Array.from({length:count},()=>({hz,duration,gap:.012}));
  }
  const duration=voice===0&&random()<.3?.22+random()*.24:.065+random()*.075;
  return [{hz,duration,gap:.025}];
}
export function screamJitter(duration,random=Math.random){
  const points=[{at:0,hz:120}];
  for(let at=.04;at<duration;at+=.03+random()*.075){
    const center=120-60*at/duration;
    points.push({at,hz:Math.max(35,Math.min(210,center*(.55+random()*1.2)))});
  }
  points.push({at:duration,hz:50});
  return points;
}
