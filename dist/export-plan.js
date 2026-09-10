import { speechSyllable } from './music.js';
import { exchanges } from './conversation.js';
export const EXPORT_DURATION=90;
export function makeExportPlan(random=Math.random){
  const candidates=exchanges.filter(turns=>new Set(turns.map(turn=>turn.voice)).size===3);
  const tones=[], captions=[], dialogue=[], scenes=[], pitches=[100,78,205];let cursor=.7,lastScene=-1;
  while(cursor<80){
    let scene=Math.floor(random()*candidates.length);
    if(scene===lastScene)scene=(scene+1)%candidates.length;
    lastScene=scene;scenes.push(scene);
    for(const turn of candidates[scene]){
      const {voice,text}=turn,turnIndex=dialogue.length;dialogue.push(turn);
      let caption='';
      for(const word of text.split(' ')){
        caption+=(caption?' ':'')+word;
        captions.push({at:cursor,voice,text:caption,turn:turnIndex});
        const count=Math.max(1,Math.min(5,Math.ceil(word.length/2)));
        for(let j=0;j<count;j++){
          for(const part of speechSyllable(voice,pitches[voice],random)){
            tones.push({at:cursor,voice,hz:part.hz,duration:part.duration,vowel:word.charCodeAt(j%word.length)});
            cursor+=part.duration+part.gap;
          }
        }
        cursor+=/[.,?!]$/.test(word)?.25:.075;
      }
      cursor+=.8;
    }
  }
  // Fit complete exchanges between a short lead-in and the final hold.
  const scale=(EXPORT_DURATION-1-.7)/(cursor-.7);
  for(const tone of tones){tone.at=.7+(tone.at-.7)*scale;tone.duration*=scale;}
  for(const caption of captions)caption.at=.7+(caption.at-.7)*scale;
  return {tones,captions,dialogue,scenes,duration:EXPORT_DURATION};
}
export function frameAt(plan,time){
  const mouths=[false,false,false],captions=['','',''];
  for(const tone of plan.tones)if(time>=tone.at&&time<tone.at+tone.duration)mouths[tone.voice]=true;
  let current;
  for(const caption of plan.captions){if(caption.at>time)break;current=caption;}
  if(current)captions[current.voice]=current.text;
  return {mouths,captions};
}
