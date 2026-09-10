const $ = id => document.getElementById(id);
let ctx, master, awake = false, run = 0, nextTimer, lastLine = -1, expression = 'talk', active = 0;
const sources = new Set(), timers = new Set();
const blueLines = ['Oh. You are here.', 'I was thinking about nothing.', 'There is a small sound inside my head.', 'I have been here the whole time.', 'Do you think the room can hear us?', 'I almost remembered something.', 'That was a thought. It has gone now.', 'I like the space between the notes.', 'This is my face. It does this.', 'Sometimes I count the quiet.', 'One. Two. No, start again.', 'I wonder what blue sounds like.', 'I could stay like this for a while.', 'Something is humming. It might be me.', 'I had a dream about a very small door.', 'Hello again, probably.', 'I am practicing being here.', 'A little noise. For no reason.', 'I do not have anywhere to be.', 'Was that a joke?'];
const heads = [
  {id:'blue',pitch:100,lines:blueLines},
  {id:'yellow',pitch:78,lines:['I have already decided.', 'Make room. I am here.', 'Of course I can.', 'Watch closely.', 'I do not ask the room for permission.', 'That was not luck.', 'We will do it my way.', 'I know exactly who I am.', 'Even the silence listens to me.', 'I said what I said.', 'Doubt takes too long.', 'Consider it handled.']},
  {id:'pink',pitch:205,lines:['Oh. Were you talking?', 'I forgot. It seemed unimportant.', 'Is that a thought? Cute.', 'I would explain, but I lost interest.', 'I thought infinity was a perfume.', 'Whatever. I look lovely.', 'Do I have to know what that means?', 'I was listening to the pretty part.', 'Tomorrow is the one after today, right?', 'That sounds complicated. No, thank you.', 'I had a point. Never mind.', 'Mm. Probably.']}
];
const subtitle=()=>$(heads[active].id+'Subtitle');
const frames=()=>$(heads[active].id+'Frames');
const notes = [261.63,293.66,329.63,349.23,392,440,493.88,523.25];
const names = ['C','D','E','F','G','A','B','C↑'];
function later(fn, ms) { const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id }
async function audio() {
  if(!ctx){ctx=new AudioContext();master=ctx.createGain();master.gain.value=.1575;const limiter=ctx.createDynamicsCompressor();master.connect(limiter);limiter.connect(ctx.destination)}
  await ctx.resume();
}
function tone(hz, duration, at, vowel=0, type='square') {
  const delay=Math.max(0,(at-ctx.currentTime)*1000);
  later(()=>{ frames().style.backgroundPosition=expression==='laugh'?'50% 0':expression==='sing'?'100% 0':'0 0'; frames().style.opacity='1'; },delay);
  later(()=>{ frames().style.opacity='0'; },delay+duration*1000);
  if(active!==0){texture(hz,duration,at,vowel);return}
  const osc=ctx.createOscillator(), filter=ctx.createBiquadFilter(), gain=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(hz,at);osc.frequency.linearRampToValueAtTime(hz*.96,at+duration);
  filter.type='bandpass';filter.frequency.setValueAtTime([650,1100,1800,850][vowel%4],at);filter.Q.value=3;
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.6,at+.009);gain.gain.setValueAtTime(.42,at+duration*.65);gain.gain.linearRampToValueAtTime(0,at+duration);
  osc.connect(filter);filter.connect(gain);gain.connect(master);sources.add(osc);
  osc.onended=()=>{sources.delete(osc);osc.disconnect();filter.disconnect();gain.disconnect()};osc.start(at);osc.stop(at+duration+.01);
}
// Yellow: 3-bit sample-and-hold noise. Pink: sparse, quantized spectral frames.
function texture(hz,duration,at,vowel){
  const rate=8000, length=Math.ceil((duration+.02)*rate), buffer=ctx.createBuffer(1,length,rate), out=buffer.getChannelData(0);
  if(active===1){
    let held=0;for(let i=0;i<length;i++){if(i%3===0)held=Math.round((Math.random()*2-1)*3)/3;const pulse=Math.sin(2*Math.PI*hz*i/rate)>0?1:-1;out[i]=held*.65+pulse*.25}
  }else{
    const size=256, hop=128, formant=[900,1400,2100,1100][vowel%4];
    // Inverse spectral synthesis: only coarse harmonic bins survive each window.
    for(let start=-hop;start<length;start+=hop){
      const fundamental=hz*(1+.025*Math.sin(start/rate*28));
      for(let harmonic=1;harmonic<=14;harmonic++){
        const bin=Math.round(fundamental*harmonic/(rate/size));if(bin>=size/2)break;
        const f=bin*rate/size;const weight=(Math.exp(-(((f-formant)/550)**2))+.35*Math.exp(-(((f-2700)/450)**2))+.18)/harmonic;
        for(let j=0;j<size;j++){const i=start+j;if(i>=0&&i<length)out[i]+=Math.sin(2*Math.PI*bin*i/size)*weight*(.5-.5*Math.cos(2*Math.PI*j/size))*.8}
      }
    }
  }
  const source=ctx.createBufferSource(), gain=ctx.createGain(), filter=ctx.createBiquadFilter();source.buffer=buffer;
  filter.type=active===1?'lowpass':'highpass';filter.frequency.value=active===1?2300:450;
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(active===1?.5:1.1,at+.008);gain.gain.setValueAtTime(active===1?.4:.9,at+duration*.7);gain.gain.linearRampToValueAtTime(0,at+duration);
  source.connect(filter);filter.connect(gain);gain.connect(master);sources.add(source);source.onended=()=>{sources.delete(source);source.disconnect();filter.disconnect();gain.disconnect()};source.start(at);source.stop(at+duration+.02);
}
function cancel(){heads.forEach(h=>$(h.id+'Frames').style.opacity='0');run++;clearTimeout(nextTimer);for(const t of timers)clearTimeout(t);timers.clear();for(const s of sources){try{s.stop()}catch{}}sources.clear();}
function schedule(){if(awake)nextTimer=setTimeout(()=>{active=(active+1)%heads.length;perform(Math.random()<.13?'laugh':Math.random()<.15?'sing':'talk')},1800+Math.random()*2600)}
function finish(duration,token){later(()=>{if(token!==run)return;schedule()},duration*1000+80)}
function perform(kind,index){
  cancel();expression=kind;const token=run;let t=ctx.currentTime+.04;const start=t;const pitch=heads[active].pitch;const lines=heads[active].lines;heads.forEach(h=>$(h.id+'Subtitle').textContent='');
  if(kind==='talk'){
    let i=Math.floor(Math.random()*lines.length);if(i===lastLine)i=(i+1)%lines.length;lastLine=i;
    const words=lines[i].split(' ');let text='';
    for(const word of words){const shown=(text+=(text?' ':'')+word);later(()=>{subtitle().textContent=shown},(t-ctx.currentTime)*1000);
      const n=Math.max(1,Math.min(5,Math.ceil(word.length/2)));
      for(let j=0;j<n;j++){const d=.065+Math.random()*.075;tone(pitch*(.8+Math.random()*.65),d,t,word.charCodeAt(j%word.length));t+=d+.025}t+=/[.,?]$/.test(word)?.25:.075;
    }
  }else if(kind==='laugh'){
    subtitle().textContent='[ ha. ha. ha. ]';
    for(let i=0;i<7;i++){tone(pitch*(1.7-i*.1),.105,t,i%2);t+=.15+i*.008}
  }else{
    const melody=index===undefined?[0,2,4,2,1,0].map(n=>Math.random()<.2?3:n):[index];
    for(const n of melody){const d=index===undefined?.36+Math.random()*.25:.55;const delay=(t-ctx.currentTime)*1000;
      later(()=>{subtitle().textContent=`[ ${names[n]} — ]`},delay);
      tone(notes[n]*pitch/100,d,t,0,'sawtooth');t+=d+.065;
    }
  }
  finish(t-start+.04,token);
}
async function wake(kind='talk',index){try{await audio();if(!awake){awake=true;document.body.classList.add('awake');$('power').textContent='Sleep';$('power').setAttribute('aria-pressed','true')}perform(kind,index)}catch{subtitle().textContent='Audio unavailable. Try another browser.'}}
function sleep(){awake=false;cancel();master?.gain.cancelScheduledValues(ctx.currentTime);heads.forEach(h=>$(h.id+'Subtitle').textContent='');$('power').textContent='Wake';$('power').setAttribute('aria-pressed','false');document.body.classList.remove('awake')}
function toggle(){awake?sleep():wake()}
$('power').onclick=toggle;$('laugh').onclick=()=>wake('laugh');$('sing').onclick=()=>wake('sing');
document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.target.tagName==='BUTTON')return;if(e.code==='Space'){e.preventDefault();toggle()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&awake)sleep()});
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'sleep_head',description:'Stop the head and its audio.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('Expected an empty object');sleep();return{awake:false}}})).catch(()=>{})}catch{}}
