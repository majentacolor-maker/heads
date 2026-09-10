import { exportVideo, mp4Mime } from './export-video.js';
import {blueSpeechData,loadBlueSpeech,blueSingingData,loadBlueSinging} from './blue-speech.js';
import {speechWalk,speechTime,syllableMouths,singPhonemes,pronunciationMistakes,mispronounceSpeech} from './blue-phonemes.js';
import { exchanges, chooseLyrics, singingSyllables, chooseConclusion } from './conversation.js';
import { newLines, blueLines } from './dialogue.js';
import { melodies } from './melodies.js';
import { minorNote, decimatorSettings, ensemble, automaticAction, glidePitch, speechSyllable, screamJitter, laughPhrase, vowelCode, blueVowelProfile } from './music.js';
const $ = id => document.getElementById(id);
let ctx, master, awake = false, run = 0, nextTimer, lastMelody = -1, active = 0;
const sources = new Set(), timers = new Set();
const previousPitch = [null,null,null];
let replyQueue=[], lastExchange=-1, exportController=null, closeAt=Infinity, closing=false;
const heads = [
  {id:'blue',pitch:100,lines:[...blueLines]},
  {id:'yellow',pitch:78,lines:['I have already decided.', 'Make room. I am here.', 'Of course I can.', 'Watch closely.', 'I do not ask the room for permission.', 'That was not luck.', 'We will do it my way.', 'I know exactly who I am.', 'Even the silence listens to me.', 'I said what I said.', 'Doubt takes too long.', 'Consider it handled.']},
  {id:'pink',pitch:205,lines:['Oh. Were you talking?', 'I forgot. It seemed unimportant.', 'Is that a thought? Cute.', 'I would explain, but I lost interest.', 'I thought infinity was a perfume.', 'Whatever. I look lovely.', 'Do I have to know what that means?', 'I was listening to the pretty part.', 'Tomorrow is the one after today, right?', 'That sounds complicated. No, thank you.', 'I had a point. Never mind.', 'Mm. Probably.']}
];
heads.forEach(head=>{head.lines.push(...newLines[head.id]);head.lastLine=-1});
const subtitle=()=>$(heads[active].id+'Subtitle');
function later(fn, ms) { const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id }
async function audio() {
  if(!ctx){ctx=new AudioContext();master=ctx.createGain();master.gain.value=.1575;const limiter=ctx.createDynamicsCompressor();master.connect(limiter);limiter.connect(ctx.destination)}
  await ctx.resume();
}
function trackSource(source,envelope,filter){
  const gate=ctx.createGain(),sourceContext=ctx;
  envelope.connect(gate);gate.connect(master);sources.add(source);
  source.fadeOut=()=>{
    const now=sourceContext.currentTime;
    gate.gain.cancelScheduledValues(now);gate.gain.setValueAtTime(gate.gain.value,now);
    gate.gain.linearRampToValueAtTime(0,now+.015);source.stop(now+.02);
  };
  source.onended=()=>{sources.delete(source);source.disconnect();filter?.disconnect();envelope.disconnect();gate.disconnect()};
}
function playBlueSpeech(buffer,at,duration,walk=speechWalk(duration),level=1){
  for(const [cents,balance] of [[0,1],[7,.35]]){
    const source=ctx.createBufferSource(),gain=ctx.createGain();
    source.buffer=buffer;source.playbackRate.value=buffer.duration/duration*(walk?.rate??1);
    if(walk){
      source.detune.setValueAtTime(walk.points[0].cents+cents,at);
      for(const point of walk.points.slice(1))source.detune.linearRampToValueAtTime(point.cents+cents,at+point.at/walk.duration*duration);
    }else source.detune.value=cents;
    const volume=2.2*balance*level;
    gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.012);
    gain.gain.setValueAtTime(volume,at+duration-.02);gain.gain.linearRampToValueAtTime(0,at+duration);
    source.connect(gain);trackSource(source,gain);source.start(at);source.stop(at+duration+.01);
  }
}
function imperfectSpeech(buffer,info){
  const scale=buffer.duration/info.duration;
  const phonemes=info.phonemes.map(phone=>({...phone,start:phone.start*scale,end:phone.end*scale}));
  const samples=mispronounceSpeech(buffer.getChannelData(0),buffer.sampleRate,phonemes);
  const altered=ctx.createBuffer(1,samples.length,buffer.sampleRate);altered.getChannelData(0).set(samples);
  return altered;
}
async function speakBlue(text,token,onComplete){
  try{
    const info=blueSpeechData[text],buffer=await loadBlueSpeech(text,ctx);
    if(token!==run||!awake||exportController)return;
    const at=ctx.currentTime+.04,frame=$('blueFrames');
    const walk=speechWalk(info.duration);
    playBlueSpeech(imperfectSpeech(buffer,info),at,info.duration,walk);
    for(const word of info.words)later(()=>{$('blueSubtitle').textContent=word.text},(at-ctx.currentTime+speechTime(walk,word.at))*1000);
    for(const [start,end] of syllableMouths(info,walk)){
      later(()=>{frame.style.backgroundPosition='0 0';frame.style.opacity='1'},(at-ctx.currentTime+start)*1000);
      later(()=>{frame.style.opacity='0'},(at-ctx.currentTime+end)*1000);
    }
    finish(info.duration+.04,token,onComplete);
  }catch(error){if(token===run){sleep();$('blueSubtitle').textContent=error.message;}}
}
function playBlueSyllable(buffer,phonemes,hz,duration,at,level,donors){
  const samples=singPhonemes(buffer.getChannelData(0),buffer.sampleRate,pronunciationMistakes(phonemes,donors),hz,duration);
  const sung=ctx.createBuffer(1,samples.length,buffer.sampleRate);sung.getChannelData(0).set(samples);
  playBlueSpeech(sung,at,duration,null,level);
  const frame=$('blueFrames'),delay=(at-ctx.currentTime)*1000;
  later(()=>{frame.style.backgroundPosition='0 100%';frame.style.opacity='1'},delay);
  later(()=>{frame.style.opacity='0'},delay+duration*1000);
}
function tone(hz, duration, at, vowel=0, type='square', voice=active, kind='talk', level=1, contour) {
  if(voice===2&&!contour)contour={from:previousPitch[voice]??hz*.8,to:hz,seconds:Math.min(.24,duration*.6)};
  previousPitch[voice]=hz;
  const frame=$(heads[voice].id+'Frames');
  const delay=Math.max(0,(at-ctx.currentTime)*1000);
  if(!exportController){later(()=>{ frame.style.backgroundPosition=['scream','sigh','giggle'].includes(kind)?'100% 100%':kind==='laugh'?'100% 0':kind==='sing'?'0 100%':'0 0'; frame.style.opacity='1'; },delay);
  later(()=>{ frame.style.opacity='0'; },delay+duration*1000);}
  if(voice!==0){texture(hz,duration,at,vowel,voice,kind,level,contour);return}
  const jitter=kind==='scream'?screamJitter(duration):null,shape=blueVowelProfile(vowel);
  for(const [cents,balance] of [[0,1],[7,.7]]){
    const osc=ctx.createOscillator(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    osc.type=type;osc.detune.value=cents;
    if(jitter){
      for(const point of jitter)osc.frequency.setValueAtTime(point.hz,at+point.at);
    }else{osc.frequency.setValueAtTime(contour?.from??hz,at);osc.frequency.exponentialRampToValueAtTime(contour?.to??hz*(kind==='sing'?1:.96),at+duration);}
    filter.type=kind==='scream'?'highpass':'bandpass';filter.frequency.setValueAtTime(kind==='scream'?35:shape.formant,at);filter.Q.value=kind==='scream'?.7:3;
    const volume=level*1.3*balance;
    gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.6*volume,at+Math.min(.012,duration*.25));gain.gain.linearRampToValueAtTime(.42*volume,at+duration*.65);gain.gain.linearRampToValueAtTime(0,at+duration);
    osc.connect(filter);filter.connect(gain);trackSource(osc,gain,filter);
    osc.start(at);osc.stop(at+duration+.01);
  }
  if(kind==='talk'||kind==='sing'){
    const breath=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    const buffer=ctx.createBuffer(1,Math.ceil((duration+.02)*ctx.sampleRate),ctx.sampleRate),samples=buffer.getChannelData(0);
    for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
    breath.buffer=buffer;filter.type='bandpass';filter.frequency.value=shape.noiseHz;filter.Q.value=.8;
    const volume=shape.noiseGain*level*(kind==='sing'?.7:1);
    gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+Math.min(.02,duration*.25));
    gain.gain.linearRampToValueAtTime(volume*.65,at+duration*.65);gain.gain.linearRampToValueAtTime(0,at+duration);
    breath.connect(filter);filter.connect(gain);trackSource(breath,gain,filter);
    breath.start(at);breath.stop(at+duration+.02);
  }
}
// Yellow decimates both noise and pulse; its clock and bit depth follow pitch.
function texture(hz,duration,at,vowel,voice,kind,level,contour){
  const rate=voice===1?ctx.sampleRate:8000, length=Math.ceil((duration+.02)*rate), buffer=ctx.createBuffer(1,length,rate), out=buffer.getChannelData(0);
  if(voice===1&&kind==='sigh'){
    // A breath is broadband noise shaped only by its exhale envelope.
    for(let i=0;i<length;i++)out[i]=(Math.random()*2-1)*.65;
  }else if(voice===1){
    let held=0, clock=1, phase=0;
    for(let i=0;i<length;i++){
      const pitch=contour?glidePitch(contour.from,contour.to,i/rate,contour.seconds):hz*(kind==='sing'?1:1-.12*i/length);
      const settings=decimatorSettings(pitch), steps=2**settings.bits-1;
      phase+=pitch/rate;
      if(clock>=1){
        clock%=1;
        const pulse=Math.sin(2*Math.PI*phase)>0?1:-1;
        const noise=Math.random()*2-1;
        const sample=kind==='sing'?pulse*.8+noise*.12:pulse*.38+noise*.6;
        held=Math.round((sample+1)*.5*steps)/steps*2-1;
      }
      clock+=settings.sampleRate/rate;out[i]=held;
    }
  }else{
    const size=256, hop=128, formant=[900,1400,2100,1100][vowel%4];
    const phases=new Float64Array(length), pitches=new Float32Array(length);
    let phase=0;
    for(let i=0;i<length;i++){
      const pitch=contour?glidePitch(contour.from,contour.to,i/rate,contour.seconds):hz;
      pitches[i]=pitch;phase+=2*Math.PI*pitch/rate;phases[i]=phase;
    }
    // Coarse spectral amplitudes retain the thin voice; continuous phase lets pitch slide.
    for(let start=-hop;start<length;start+=hop){
      const fundamental=pitches[Math.min(length-1,Math.max(0,start+hop))];
      for(let harmonic=1;harmonic<=14;harmonic++){
        const f=fundamental*harmonic;if(f>=rate/2)break;
        const raw=(Math.exp(-(((f-formant)/550)**2))+.35*Math.exp(-(((f-2700)/450)**2))+.18)/harmonic;
        const weight=Math.round(raw*32)/32;
        for(let j=0;j<size;j++){const i=start+j;if(i>=0&&i<length)out[i]+=Math.sin(phases[i]*harmonic)*weight*(.5-.5*Math.cos(2*Math.PI*j/size))*.8}
      }
    }
  }
  const source=ctx.createBufferSource(), gain=ctx.createGain();source.buffer=buffer;
  const filter=voice===2?ctx.createBiquadFilter():null;
  if(filter){filter.type='highpass';filter.frequency.value=450;filter.Q.value=.7;}
  gain.gain.setValueAtTime(0,at);
  if(kind==='sigh'){
    gain.gain.linearRampToValueAtTime(.45*level,at+.18);
    gain.gain.exponentialRampToValueAtTime(.018*level,at+duration-.05);
  }else{
    gain.gain.linearRampToValueAtTime((voice===1?.42:1.1)*level,at+Math.min(.012,duration*.25));
    gain.gain.linearRampToValueAtTime((voice===1?.34:.9)*level,at+duration*.7);
  }
  gain.gain.linearRampToValueAtTime(0,at+duration);
  if(filter){source.connect(filter);filter.connect(gain)}else source.connect(gain);
  trackSource(source,gain,filter);source.start(at);source.stop(at+duration+.02);
}
function cancel(){previousPitch.fill(null);heads.forEach(h=>$(h.id+'Frames').style.opacity='0');run++;clearTimeout(nextTimer);for(const t of timers)clearTimeout(t);timers.clear();for(const s of sources){try{s.fadeOut()}catch{}}sources.clear();}
function schedule(){
  if(!awake)return;
  if(ctx.currentTime>=closeAt){conclude();return}
  const replying=replyQueue.length>0;
  nextTimer=setTimeout(()=>{
    active=replyQueue.length?replyQueue[0].voice:(active+1)%heads.length;
    const action=automaticAction();
    perform(action);
  },replying?250+Math.random()*450:1000+Math.random()*1500);
}
function finish(duration,token,onComplete){later(()=>{if(token!==run||!awake)return;if(onComplete)onComplete();else schedule()},duration*1000+80)}
function conclude(){
  if(closing)return;
  closing=true;replyQueue=[];
  const ending=chooseConclusion();active=ending.voice;
  perform('talk',{text:ending.text,onComplete:()=>{
    later(()=>perform('laugh',{voices:[0,1,2],onComplete:()=>later(finishConversation,800)}),350);
  }});
}
async function perform(kind,options={}){
  let spoken=options.text;
  if(kind==='talk'&&spoken===undefined){
    if(!replyQueue.length&&Math.random()<.75){
      const candidates=exchanges.map((turns,index)=>({turns,index})).filter(x=>x.turns[0].voice===active&&x.index!==lastExchange);
      const selected=candidates[Math.floor(Math.random()*candidates.length)];
      replyQueue=selected.turns.slice();lastExchange=selected.index;
    }
    if(replyQueue.length){const reply=replyQueue.shift();active=reply.voice;spoken=reply.text;}
  }
  cancel();const token=run;let t=ctx.currentTime+.04,start=t;const pitch=heads[active].pitch;const lines=heads[active].lines;heads.forEach(h=>$(h.id+'Subtitle').textContent='');
  if(kind==='reaction'){
    if(active===0){
      subtitle().textContent='*screams*';
      tone(120,2.8,t,0,'sawtooth',0,'scream',.32);t+=2.8;
    }else if(active===1){
      subtitle().textContent='*sighs*';
      tone(0,1.6,t,0,'square',1,'sigh',.9);t+=1.6;
    }else{
      subtitle().textContent='*giggles*';
      for(let i=0;i<12;i++){
        const hz=460+Math.sin(i*1.8)*65;
        tone(hz,.045,t,i%3,'square',2,'giggle',.7,{from:hz*1.12,to:hz,seconds:.045});t+=.073;
      }
    }
  }else if(kind==='talk'){
    let i=Math.floor(Math.random()*lines.length);if(i===heads[active].lastLine)i=(i+1)%lines.length;heads[active].lastLine=i;
    if(active===0)return speakBlue(spoken??lines[i],token,options.onComplete);
    const words=(spoken??lines[i]).split(' ');let text='';
    for(const word of words){const shown=(text+=(text?' ':'')+word);later(()=>{subtitle().textContent=shown},(t-ctx.currentTime)*1000);
      const n=Math.max(1,Math.min(5,Math.ceil(word.length/2)));
      for(let j=0;j<n;j++)for(const part of speechSyllable(active,pitch)){tone(part.hz,part.duration,t,active===0?vowelCode(word,j):word.charCodeAt(j%word.length));t+=part.duration+part.gap;}t+=/[.,?]$/.test(word)?.25:.075;
    }
  }else{
    const voices=options.voices??ensemble(active), level=1/Math.sqrt(voices.length);
    if(kind==='laugh'){
      voices.forEach((voice,part)=>{
        let cursor=start+part*.055;
        later(()=>{$(heads[voice].id+'Subtitle').textContent='*laughs*'},(cursor-ctx.currentTime)*1000);
        const phrase=laughPhrase(heads[voice].pitch);
        for(const note of phrase.notes)tone(note.hz,note.duration,cursor+note.at,note.vowel,'square',voice,'laugh',level);
        cursor+=phrase.duration;
        t=Math.max(t,cursor);
      });
    }else{
      let choice=Math.floor(Math.random()*melodies.length);
      if(choice===lastMelody)choice=(choice+1)%melodies.length;
      lastMelody=choice;
      const melody=melodies[choice], beatSeconds=60/(80+Math.random()*40);
      const offsets=[0,2,4], lyric=chooseLyrics(melody.degrees.length);
      const singers=voices.includes(1)?[1,...voices.filter(voice=>voice!==1)]:voices;
      const sungWords=new Map();
      if(singers.includes(0)){
        try{
          await Promise.all(lyric.map(async word=>sungWords.set(word,await loadBlueSinging(word,ctx))));
        }catch(error){if(token===run){sleep();$('blueSubtitle').textContent=error.message;}return;}
        if(token!==run||!awake||exportController)return;
        t=start=ctx.currentTime+.04;
      }
      const donors=[...sungWords].flatMap(([word,buffer])=>blueSingingData[word.toLowerCase()].syllables.flat().map(phone=>({...phone,source:buffer.getChannelData(0)})));
      for(let step=0;step<melody.degrees.length;step++){
        const degree=melody.degrees[step], duration=melody.beats[step]*beatSeconds;
        const syllables=singingSyllables(lyric[step]), syllableBeat=duration/syllables.length;
        singers.forEach((voice,part)=>{
          const note=minorNote(degree+offsets[part],voice);
          syllables.forEach((syllable,index)=>{
            const at=t+index*syllableBeat;
            const words=[...lyric.slice(0,step),syllables.slice(0,index+1).join('')].join(' ');
            later(()=>{$(heads[voice].id+'Subtitle').textContent=`${words}\n[ ${note.name} — ]`},(at-ctx.currentTime)*1000);
            if(voice===0)playBlueSyllable(sungWords.get(lyric[step]),blueSingingData[lyric[step].toLowerCase()].syllables[index],note.hz,syllableBeat*.88,at,level,donors);
            else tone(note.hz,syllableBeat*.88,at,(part+index)%4,'sawtooth',voice,'sing',level);
          });
        });
        t+=duration;
      }
    }
  }
  finish(t-start+.04,token,options.onComplete);
}
async function wake(kind='talk'){if(exportController||(closing&&awake))return;try{await audio();if(exportController)return;if(kind!=='talk')replyQueue=[];if(!awake){closing=false;closeAt=ctx.currentTime+48+Math.random()*4;awake=true;document.body.classList.add('awake');$('power').textContent='SLEEP';$('power').setAttribute('aria-pressed','true')}return perform(kind)}catch{subtitle().textContent='Audio unavailable. Try another browser.'}}
function finishConversation(){
  sleep();
}
function sleep(){replyQueue=[];awake=false;closing=false;closeAt=Infinity;cancel();master?.gain.cancelScheduledValues(ctx.currentTime);heads.forEach(h=>$(h.id+'Subtitle').textContent='');$('power').textContent='WAKE';$('power').setAttribute('aria-pressed','false');document.body.classList.remove('awake')}
function toggle(){if(!exportController)return awake?sleep():wake()}
$('power').onclick=toggle;
document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.target.tagName==='BUTTON')return;if(e.code==='Space'){e.preventDefault();toggle()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(exportController)exportController.abort();if(awake)sleep()}});
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'sleep_head',description:'Stop the head and its audio.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('Expected an empty object');sleep();return{awake:false}}})).catch(()=>{})}catch{}}

async function renderExportAudio(plan){
  const speech=new Map();
  await Promise.all(plan.tones.filter(event=>event.kind==='speech').map(async event=>{speech.set(event.text,await loadBlueSpeech(event.text,ctx))}));
  const liveContext=ctx,liveMaster=master;
  const offline=new OfflineAudioContext(1,Math.ceil(plan.duration*48000),48000);
  try{
    ctx=offline;master=offline.createGain();master.gain.value=.1575;
    const limiter=offline.createDynamicsCompressor();master.connect(limiter);limiter.connect(offline.destination);
    previousPitch.fill(null);
    for(const event of plan.tones){
      if(event.kind==='speech')playBlueSpeech(imperfectSpeech(speech.get(event.text),blueSpeechData[event.text]),event.at,event.duration,event.walk);
      else tone(event.hz,event.duration,event.at,event.vowel,'square',event.voice,event.kind??'talk',event.level??1);
    }
  }finally{ctx=liveContext;master=liveMaster;}
  return offline.startRendering();
}
$('export').onclick=async()=>{
  if(exportController){exportController.abort();return}
  if(!mp4Mime()){$('exportStatus').textContent='MP4 export needs a browser with MP4 recording, such as current Safari or Chrome.';return}
  sleep();exportController=new AbortController();const signal=exportController.signal;let completed=false;
  $('power').disabled=true;$('export').textContent='CANCEL';$('exportProgress').hidden=false;$('exportProgress').value=0;$('exportStatus').textContent='Keep this tab open while recording.';
  try{
    await audio();
    await exportVideo({context:ctx,renderAudio:renderExportAudio,stop:sleep,signal,onProgress:percent=>{$('exportProgress').value=percent}});
    completed=true;
    $('exportStatus').textContent='';
  }catch(error){$('exportStatus').textContent=error.name==='AbortError'?'Export cancelled.':error.message;}
  finally{exportController=null;if(completed)finishConversation();else sleep();$('power').disabled=false;$('export').textContent='EXPORT MP4';$('exportProgress').hidden=true;}
};
