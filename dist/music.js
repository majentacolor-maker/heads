export const minorScale = [0, 2, 3, 5, 7, 8, 10];
const noteNames = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
export function minorNote(degree, voice) {
  const step = ((degree % 7) + 7) % 7;
  const midi = 48 + minorScale[step] + 12 * Math.floor(degree / 7) + [0, -36, 12][voice];
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

export function laughPhrase(pitch,random=Math.random){
  const count=5+Math.floor(random()*6),beat=.18+random()*.05;
  const register=(random()-.5)*8,bend=(random()-.5)*10;
  const bounce=random()*3,phase=random()*Math.PI*2;
  const rhythm=[[1,.95,.95,1.05],[1,1,.9,.9],[1,.95,1.1,.95],[1,.9,1,1.1]][Math.floor(random()*4)];
  const notes=[];let at=0;
  for(let i=0;i<count;i++){
    const interval=beat*rhythm[i%rhythm.length]*(.97+random()*.06);
    const duration=Math.max(.045,interval*(.7+random()*.08));
    const semitones=register+bend*i/(count-1)+Math.sin(i*1.7+phase)*bounce+(random()-.5)*3;
    notes.push({at,duration,hz:pitch*1.5*2**(semitones/12),vowel:i%2});
    at+=interval+(i>0&&i<count-1&&random()<.06?.04+random()*.04:0);
  }
  return {notes,duration:at};
}
