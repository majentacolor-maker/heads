import {characters} from './cast.js';
import {speechSyllable,minorNote,laughPhrase,glidePitch} from './music.js';

export function voiceNote(degree,voice){
  const note=minorNote(degree,0);
  return {...note,hz:note.hz*2**characters[voice].octave};
}
export function voiceSyllables(voice,random=Math.random){
  const head=characters[voice];
  if(voice<3)return speechSyllable(voice,head.pitch,random);
  const range=[0,0,0,5,28,26,12,32,19][voice];
  const hz=head.pitch*2**((random()-.5)*range/12);
  const duration=voice===3?.23+random()*.22:voice===6?.13+random()*.16:voice===8?.10+random()*.18:.055+random()*.13;
  const count=voice===7&&random()<.55?3+Math.floor(random()*4):voice===5&&random()<.2?2:1;
  return Array.from({length:count},(_,i)=>({hz:hz*(voice===7?1+Math.sin(i*2)*.3:1),duration:count>1?.025+random()*.018:duration,gap:count>1?.012:voice===3?.07:.025}));
}
export function voiceLaugh(voice,random=Math.random){
  const phrase=laughPhrase(characters[voice].pitch,random),speed=[1,1,1,.72,1.18,1.08,.84,1.3,1.2][voice];
  return {duration:phrase.duration/speed,notes:phrase.notes.map(note=>({...note,at:note.at/speed,duration:note.duration/speed}))};
}
export function reactionPhrase(voice){
  const rows=[
    {caption:'*screams*',kind:'scream',duration:2.8,hz:120,level:.32},
    {caption:'*sighs*',kind:'sigh',duration:1.6,hz:0,level:.9},
    {caption:'*giggles*',kind:'giggle',count:12,beat:.073,duration:.045,hz:460,level:.7},
    {caption:'*groans*',kind:'groan',duration:2.1,hz:24,level:1.4},
    {caption:'*gasps*',kind:'chime',count:3,beat:.22,duration:.4,hz:620,level:.9},
    {caption:'*gasps*',kind:'gasp',duration:.65,hz:290,level:.8},
    {caption:'*bellows*',kind:'bellow',duration:1.6,hz:60,level:1},
    {caption:'*sputters*',kind:'sputter',count:9,beat:.10,duration:.055,hz:170,level:.8},
    {caption:'*trills*',kind:'trill',count:8,beat:.09,duration:.13,hz:640,level:.65}
  ];
  const row=rows[voice],notes=Array.from({length:row.count??1},(_,i)=>({
    at:i*(row.beat??0),duration:row.duration,hz:row.hz*(1+Math.sin(i*1.8)*.14),level:row.level,kind:row.kind,vowel:i%3
  }));
  return {caption:row.caption,notes,duration:Math.max(...notes.map(note=>note.at+note.duration))};
}

// Distinct crude voices, with continuous phase and enveloped onsets/ends.
export function variantSamples(voice,hz,duration,rate,vowel,kind,contour,random=Math.random){
  const head=characters[voice],out=new Float32Array(Math.ceil((duration+.02)*rate));
  let phase=0,clock=1,held=0,jitter=0;
  for(let i=0;i<out.length;i++){
    const time=i/rate;
    if(i%Math.max(1,Math.round(rate*.027))===0)jitter=(random()-.5)*(head.jitter??0);
    const target=contour?glidePitch(contour.from,contour.to,time,contour.seconds):hz;
    const wobble=(head.wobble??0)/1200*Math.sin(2*Math.PI*(voice===4?4.1:5.6)*time);
    const pitch=target*2**wobble*(1+jitter);phase+=pitch/rate;
    if(head.family===1){
      if(clock>=1){clock%=1;const pulse=Math.sin(2*Math.PI*phase)>0?1:-1;
        const signal=pulse*(kind==='sing'?.83:.55)+(random()*2-1)*(kind==='sing'?.1:.4),steps=2**head.bits-1;
        held=Math.round((signal+1)*.5*steps)/steps*2-1;
      }
      clock+=Math.min(11000,Math.max(180,pitch*(voice===5?7:4)))/rate;out[i]=held*.6;
    }else if(head.family===2){
      const formant=[900,1400,2100,1100][vowel%4];let sample=0;
      for(let harmonic=1;harmonic<=16&&harmonic*pitch<rate/2;harmonic++){
        const f=harmonic*pitch,weight=(.25+Math.exp(-(((f-formant)/800)**2)))/harmonic;
        sample+=Math.sin(2*Math.PI*phase*harmonic)*weight;
      }
      // A restrained saw layer distinguishes Cosmic from the original spectral girl.
      const saw=2*(phase%1)-1,breath=(random()*2-1)*.035;
      out[i]=(sample*.6+saw*(voice===4?.16:.025)+breath)*.65;
    }else{
      const pulse=Math.sin(2*Math.PI*phase),double=Math.sin(2*Math.PI*phase*1.003);
      const formant=voice===6?550+(vowel%4)*230:450;
      const carrier=Math.sin(2*Math.PI*phase*Math.max(1,Math.round(formant/Math.max(20,pitch))));
      out[i]=(.45*pulse+.25*double+.2*carrier)*(.85+.15*Math.sin(2*Math.PI*phase));
    }
  }
  return out;
}
