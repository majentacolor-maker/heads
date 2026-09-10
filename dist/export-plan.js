import { exchanges } from './conversation.js';
export function makeExportPlan(random=Math.random){
  const candidates=exchanges.filter(turns=>new Set(turns.map(turn=>turn.voice)).size===3);
  const dialogue=candidates[Math.floor(random()*candidates.length)];
  const tones=[], captions=[], pitches=[100,78,205];let cursor=.7;
  for(const {voice,text} of dialogue){
    let caption='';
    for(const word of text.split(' ')){
      caption+=(caption?' ':'')+word;
      captions.push({at:cursor,voice,text:caption});
      const count=Math.max(1,Math.min(5,Math.ceil(word.length/2)));
      for(let j=0;j<count;j++){
        const duration=.065+random()*.075;
        tones.push({at:cursor,voice,hz:pitches[voice]*(.8+random()*.65),duration,vowel:word.charCodeAt(j%word.length)});
        cursor+=duration+.025;
      }
      cursor+=/[.,?!]$/.test(word)?.25:.075;
    }
    cursor+=.8;
  }
  const duration=cursor+1;
  if(duration>=59)throw new Error('This conversation is too long to export. Try again.');
  return {tones,captions,duration};
}
export function frameAt(plan,time){
  const mouths=[false,false,false],captions=['','',''];
  for(const tone of plan.tones)if(time>=tone.at&&time<tone.at+tone.duration)mouths[tone.voice]=true;
  let current;
  for(const caption of plan.captions){if(caption.at>time)break;current=caption;}
  if(current)captions[current.voice]=current.text;
  return {mouths,captions};
}
