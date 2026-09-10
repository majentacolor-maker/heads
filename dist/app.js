import { newLines } from './dialogue.js';
import { melodies } from './melodies.js';
import { minorNote, decimatorSettings, ensemble } from './music.js';
const $ = id => document.getElementById(id);
let ctx, master, awake = false, run = 0, nextTimer, lastMelody = -1, active = 0;
const sources = new Set(), timers = new Set();
const blueLines = ['Oh. You are here.', 'I was thinking about nothing.', 'There is a small sound inside my head.', 'I have been here the whole time.', 'Do you think the room can hear us?', 'I almost remembered something.', 'That was a thought. It has gone now.', 'I like the space between the notes.', 'This is my face. It does this.', 'Sometimes I count the quiet.', 'One. Two. No, start again.', 'I wonder what blue sounds like.', 'I could stay like this for a while.', 'Something is humming. It might be me.', 'I had a dream about a very small door.', 'Hello again, probably.', 'I am practicing being here.', 'A little noise. For no reason.', 'I do not have anywhere to be.', 'Was that a joke?'];
const heads = [
  {id:'blue',pitch:100,lines:blueLines},
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
function tone(hz, duration, at, vowel=0, type='square', voice=active, kind='talk', level=1) {
  const frame=$(heads[voice].id+'Frames');
  const delay=Math.max(0,(at-ctx.currentTime)*1000);
  later(()=>{ frame.style.backgroundPosition=kind==='laugh'?'50% 0':kind==='sing'?'100% 0':'0 0'; frame.style.opacity='1'; },delay);
  later(()=>{ frame.style.opacity='0'; },delay+duration*1000);
  if(voice!==0){texture(hz,duration,at,vowel,voice,kind,level);return}
  const osc=ctx.createOscillator(), filter=ctx.createBiquadFilter(), gain=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(hz,at);osc.frequency.linearRampToValueAtTime(hz*(kind==='sing'?1:.96),at+duration);
  filter.type='bandpass';filter.frequency.setValueAtTime([650,1100,1800,850][vowel%4],at);filter.Q.value=3;
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.6*level,at+.009);gain.gain.setValueAtTime(.42*level,at+duration*.65);gain.gain.linearRampToValueAtTime(0,at+duration);
  osc.connect(filter);filter.connect(gain);gain.connect(master);sources.add(osc);
  osc.onended=()=>{sources.delete(osc);osc.disconnect();filter.disconnect();gain.disconnect()};osc.start(at);osc.stop(at+duration+.01);
}
// Yellow decimates both noise and pulse; its clock and bit depth follow pitch.
function texture(hz,duration,at,vowel,voice,kind,level){
  const rate=voice===1?ctx.sampleRate:8000, length=Math.ceil((duration+.02)*rate), buffer=ctx.createBuffer(1,length,rate), out=buffer.getChannelData(0);
  if(voice===1){
    let held=0, clock=1, phase=0;
    for(let i=0;i<length;i++){
      const pitch=hz*(kind==='sing'?1:1-.12*i/length);
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
    // Inverse spectral synthesis: only coarse harmonic bins survive each window.
    for(let start=-hop;start<length;start+=hop){
      const fundamental=kind==='sing'?hz:hz*(1+.025*Math.sin(start/rate*28));
      for(let harmonic=1;harmonic<=14;harmonic++){
        const bin=kind==='sing'?fundamental*harmonic/(rate/size):Math.round(fundamental*harmonic/(rate/size));if(bin>=size/2)break;
        const f=bin*rate/size;const weight=(Math.exp(-(((f-formant)/550)**2))+.35*Math.exp(-(((f-2700)/450)**2))+.18)/harmonic;
        for(let j=0;j<size;j++){const i=start+j;if(i>=0&&i<length)out[i]+=Math.sin(2*Math.PI*bin*i/size)*weight*(.5-.5*Math.cos(2*Math.PI*j/size))*.8}
      }
    }
  }
  const source=ctx.createBufferSource(), gain=ctx.createGain(), filter=ctx.createBiquadFilter();source.buffer=buffer;
  filter.type=voice===1?'lowpass':'highpass';filter.frequency.value=voice===1?Math.min(6000,decimatorSettings(hz).sampleRate*.6):450;
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime((voice===1?.5:1.1)*level,at+.008);gain.gain.setValueAtTime((voice===1?.4:.9)*level,at+duration*.7);gain.gain.linearRampToValueAtTime(0,at+duration);
  source.connect(filter);filter.connect(gain);gain.connect(master);sources.add(source);source.onended=()=>{sources.delete(source);source.disconnect();filter.disconnect();gain.disconnect()};source.start(at);source.stop(at+duration+.02);
}
function cancel(){heads.forEach(h=>$(h.id+'Frames').style.opacity='0');run++;clearTimeout(nextTimer);for(const t of timers)clearTimeout(t);timers.clear();for(const s of sources){try{s.stop()}catch{}}sources.clear();}
function schedule(){if(awake)nextTimer=setTimeout(()=>{active=(active+1)%heads.length;perform(Math.random()<.13?'laugh':Math.random()<.15?'sing':'talk')},1800+Math.random()*2600)}
function finish(duration,token){later(()=>{if(token!==run)return;schedule()},duration*1000+80)}
function perform(kind){
  cancel();const token=run;let t=ctx.currentTime+.04;const start=t;const pitch=heads[active].pitch;const lines=heads[active].lines;heads.forEach(h=>$(h.id+'Subtitle').textContent='');
  if(kind==='talk'){
    let i=Math.floor(Math.random()*lines.length);if(i===heads[active].lastLine)i=(i+1)%lines.length;heads[active].lastLine=i;
    const words=lines[i].split(' ');let text='';
    for(const word of words){const shown=(text+=(text?' ':'')+word);later(()=>{subtitle().textContent=shown},(t-ctx.currentTime)*1000);
      const n=Math.max(1,Math.min(5,Math.ceil(word.length/2)));
      for(let j=0;j<n;j++){const d=.065+Math.random()*.075;tone(pitch*(.8+Math.random()*.65),d,t,word.charCodeAt(j%word.length));t+=d+.025}t+=/[.,?]$/.test(word)?.25:.075;
    }
  }else{
    const voices=ensemble(active), level=1/Math.sqrt(voices.length);
    if(kind==='laugh'){
      voices.forEach((voice,part)=>{
        let cursor=start+part*.055;
        later(()=>{$(heads[voice].id+'Subtitle').textContent='[ ha. ha. ha. ]'},(cursor-ctx.currentTime)*1000);
        const count=5+Math.floor(Math.random()*4);
        for(let i=0;i<count;i++){
          const d=.085+Math.random()*.045;
          tone(heads[voice].pitch*(1.65-i*.075),d,cursor,i%2,'square',voice,'laugh',level);
          cursor+=d+.045+Math.random()*.035;
        }
        t=Math.max(t,cursor);
      });
    }else{
      let choice=Math.floor(Math.random()*melodies.length);
      if(choice===lastMelody)choice=(choice+1)%melodies.length;
      lastMelody=choice;
      const melody=melodies[choice], beatSeconds=60/(80+Math.random()*40);
      const offsets=[0,2,4];
      for(let step=0;step<melody.degrees.length;step++){
        const degree=melody.degrees[step], duration=melody.beats[step]*beatSeconds;
        const d=duration*.88;
        voices.forEach((voice,part)=>{
          const note=minorNote(degree+offsets[part],voice);
          later(()=>{$(heads[voice].id+'Subtitle').textContent=`[ ${note.name} — ]`},(t-ctx.currentTime)*1000);
          tone(note.hz,d,t,part,'sawtooth',voice,'sing',level);
        });
        t+=duration;
      }
    }
  }
  finish(t-start+.04,token);
}
async function wake(kind='talk'){try{await audio();if(!awake){awake=true;document.body.classList.add('awake');$('power').textContent='Sleep';$('power').setAttribute('aria-pressed','true')}perform(kind)}catch{subtitle().textContent='Audio unavailable. Try another browser.'}}
function sleep(){awake=false;cancel();master?.gain.cancelScheduledValues(ctx.currentTime);heads.forEach(h=>$(h.id+'Subtitle').textContent='');$('power').textContent='Wake';$('power').setAttribute('aria-pressed','false');document.body.classList.remove('awake')}
function toggle(){awake?sleep():wake()}
$('power').onclick=toggle;$('laugh').onclick=()=>wake('laugh');$('sing').onclick=()=>wake('sing');
document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.target.tagName==='BUTTON')return;if(e.code==='Space'){e.preventDefault();toggle()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&awake)sleep()});
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'sleep_head',description:'Stop the head and its audio.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('Expected an empty object');sleep();return{awake:false}}})).catch(()=>{})}catch{}}
