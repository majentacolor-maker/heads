import { speechSyllable, laughPhrase } from './music.js';
import { exchanges, chooseConclusion } from './conversation.js';
export const EXPORT_DURATION=60;
export function makeExportPlan(random=Math.random){
  const candidates=exchanges.filter(turns=>new Set(turns.map(turn=>turn.voice)).size===3);
  const tones=[],captions=[],dialogue=[],scenes=[],pitches=[100,78,205];let cursor=.7,lastScene=-1;
  function speak(turn){
    const {voice,text}=turn,turnIndex=dialogue.length;dialogue.push(turn);
    let caption='';
    for(const word of text.split(' ')){
      caption+=(caption?' ':'')+word;
      captions.push({at:cursor,voice,text:caption,turn:turnIndex});
      const count=Math.max(1,Math.min(5,Math.ceil(word.length/2)));
      for(let j=0;j<count;j++)for(const part of speechSyllable(voice,pitches[voice],random)){
        tones.push({at:cursor,voice,hz:part.hz,duration:part.duration,vowel:word.charCodeAt(j%word.length),kind:'talk'});
        cursor+=part.duration+part.gap;
      }
      cursor+=/[.,?!]$/.test(word)?.25:.075;
    }
    cursor+=.45;
  }
  while(cursor<42){
    let scene=Math.floor(random()*candidates.length);
    if(scene===lastScene)scene=(scene+1)%candidates.length;
    lastScene=scene;scenes.push(scene);
    for(const turn of candidates[scene])speak(turn);
  }
  const conclusion=chooseConclusion(random);speak(conclusion);
  const laughter=pitches.map(pitch=>laughPhrase(pitch,random));
  const laughDuration=Math.max(...laughter.map((phrase,voice)=>voice*.055+phrase.duration));
  const laughAt=EXPORT_DURATION-.8-laughDuration;
  // Keep whole exchanges and a whole conclusion, leaving the final trio laugh unscaled.
  const scale=(laughAt-.35-.7)/(cursor-.7);
  for(const tone of tones){tone.at=.7+(tone.at-.7)*scale;tone.duration*=scale;}
  for(const caption of captions)caption.at=.7+(caption.at-.7)*scale;
  const conclusionAt=captions.find(caption=>caption.turn===dialogue.length-1).at;
  laughter.forEach((phrase,voice)=>{
    const start=laughAt+voice*.055;
    captions.push({at:start,voice,text:'*laughs*',turn:dialogue.length});
    for(const note of phrase.notes)tones.push({...note,at:start+note.at,voice,kind:'laugh',level:1/Math.sqrt(3)});
  });
  tones.sort((a,b)=>a.at-b.at);captions.sort((a,b)=>a.at-b.at);
  return {tones,captions,dialogue,scenes,conclusion,conclusionAt,laughAt,duration:EXPORT_DURATION};
}
export function frameAt(plan,time){
  const mouths=[false,false,false],frames=['talk','talk','talk'],captions=['','',''];
  for(const tone of plan.tones)if(time>=tone.at&&time<tone.at+tone.duration){mouths[tone.voice]=true;frames[tone.voice]=tone.kind??'talk';}
  let current;
  for(const caption of plan.captions){if(caption.at>time)break;current=caption;}
  if(current)for(const caption of plan.captions){
    if(caption.at>time)break;
    if(caption.turn===current.turn)captions[caption.voice]=caption.text;
  }
  return {mouths,frames,captions};
}
