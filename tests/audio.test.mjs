import {blueSingingData} from '../dist/blue-singing-data.js';
import {speechWalk,speechTime,singPhonemes,pronunciationMistakes,mispronounceSpeech} from '../dist/blue-phonemes.js';
import {blueSpeechData} from '../dist/blue-speech-data.js';
import { exchanges, chooseLyrics, singingSyllables, chooseConclusion, conclusions, lyrics } from '../dist/conversation.js';
import { newLines, blueLines } from '../dist/dialogue.js';
import { melodies } from '../dist/melodies.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { minorNote, minorScale, decimatorSettings, ensemble, automaticAction, glidePitch, speechSyllable, screamJitter, laughPhrase, vowelCode, blueVowelProfile } from '../dist/music.js';

test('ensembles can choose one, two or three distinct heads',()=>{
  for(const lead of [0,1,2])for(const [random,count] of [[.1,1],[.5,2],[.99,3]]){
    const voices=ensemble(lead,()=>random);
    assert.equal(voices.length,count);assert.equal(new Set(voices).size,count);assert.equal(voices[0],lead);
  }
});
test('all harmony parts stay in C natural minor, across vocal registers',()=>{
  assert.equal(minorNote(0,1).hz,minorNote(0,0).hz/8);
  for(const voice of [0,1,2])for(let degree=0;degree<14;degree++){
    const note=minorNote(degree,voice);const midi=69+12*Math.log2(note.hz/440);
    assert(Math.abs(midi-Math.round(midi))<1e-9);assert(minorScale.includes(Math.round(midi)%12));
  }
});
test('decimation clock and depth track pitch within bounds',()=>{
  const low=decimatorSettings(55), high=decimatorSettings(220);
  assert(high.sampleRate>low.sampleRate);assert(high.bits>low.bits);
  assert.equal(decimatorSettings(1e6).sampleRate,6000);assert.equal(decimatorSettings(0).bits,1);
});
function harness(){
  const elements=new Map(),pending=new Map(), played=[], buffers=[];let id=0;
  const element=name=>{if(!elements.has(name))elements.set(name,{style:{},textContent:'',setAttribute(){}});return elements.get(name)};
  const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){}});
  const node=()=>({gain:param(),frequency:param(),playbackRate:param(),detune:param(),Q:param(),connect(){},disconnect(){},start(at){played.push({at,node:this})},stop(){}});
  const math=Object.create(Math);math.random=()=>.99;
  const context=vm.createContext({exportVideo:()=>{},mp4Mime:()=>null,newLines,blueLines,blueSpeechData,blueSingingData,speechWalk,speechTime,singPhonemes,pronunciationMistakes,mispronounceSpeech,loadBlueSinging:async(word,ctx)=>{const bytes=readFileSync(new URL('../dist/'+blueSingingData[word.toLowerCase()].file,import.meta.url));const buffer=ctx.createBuffer(1,(bytes.length-44)/2,22050),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=bytes.readInt16LE(44+i*2)/32768;return buffer},loadBlueSpeech:async(text,ctx)=>ctx.createBuffer(1,Math.ceil(blueSpeechData[text].duration*22050),22050),melodies,exchanges,chooseLyrics,singingSyllables,chooseConclusion,minorNote,decimatorSettings,automaticAction,glidePitch,speechSyllable,screamJitter,laughPhrase,vowelCode,blueVowelProfile,ensemble:(lead)=>ensemble(lead,()=>.99),Math:math,
    document:{getElementById:element,body:{classList:{add(){},remove(){}}},addEventListener(){}},
    AudioContext:class{currentTime=0;sampleRate=48000;destination={};createGain=node;createDynamicsCompressor=node;createOscillator=node;createBiquadFilter=node;createBufferSource=node;createBuffer(ch,length,rate){const data=new Float32Array(length);buffers.push(data);return{sampleRate:rate,duration:length/rate,getChannelData(){return data}}}async resume(){}},
    setTimeout(fn,ms){const key=++id;pending.set(key,{fn(){pending.delete(key);fn()},ms});return key},clearTimeout(id){pending.delete(id)},console
  });
  const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/gm,'');vm.runInContext(source,context);
  return{context,elements,pending,played,buffers};
}
test('trio song and laugh schedule overlapping audio and independent mouth frames; sleep cancels all',async()=>{
  const h=harness();
  for(const kind of ['sing','laugh']){
    h.played.length=0;
    await vm.runInContext(`wake('${kind}')`,h.context);
    assert(h.played.length>=15);
    assert.equal(h.played.filter(e=>e.at===.04).length,kind==='sing'?4:2);
    // Execute initial subtitle and mouth callbacks only, before any mouth closes.
    for(const entry of h.pending.values())if(entry.ms<=(kind==='sing'?41:155))entry.fn();
    for(const voice of ['blue','yellow','pink']){
      assert.equal(h.elements.get(voice+'Frames').style.opacity,'1');
      assert.equal(h.elements.get(voice+'Frames').style.backgroundPosition,kind==='sing'?'0 100%':'100% 0');
      if(kind==='laugh')assert.equal(h.elements.get(voice+'Subtitle').textContent,'*laughs*');
      assert(h.elements.get(voice+'Subtitle').textContent.length>0);
    }
    for(const data of h.buffers){assert(data.every(Number.isFinite));assert(data.some(x=>x!==0));}
    vm.runInContext('sleep()',h.context);assert.equal(h.pending.size,0);
    for(const voice of ['blue','yellow','pink'])assert.equal(h.elements.get(voice+'Frames').style.opacity,'0');
  }
});

test('sleep during sung-word loading prevents any late audio or captions',async()=>{
  const h=harness();
  vm.runInContext('let release;const waiting=new Promise(resolve=>release=resolve);loadBlueSinging=()=>waiting;globalThis.releaseSong=()=>release({});',h.context);
  const starting=vm.runInContext("wake('sing')",h.context);
  await new Promise(resolve=>setImmediate(resolve));
  vm.runInContext('sleep();releaseSong()',h.context);await starting;
  assert.equal(h.played.length,0);assert.equal(h.pending.size,0);
  assert.equal(h.elements.get('power').textContent,'WAKE');
});

test('automatic choices use 20% reactions, 22% laughter, 15% singing, and 43% speech',()=>{
  const counts={reaction:0,laugh:0,sing:0,talk:0};
  for(let i=0;i<10000;i++)counts[automaticAction(()=>i/10000)]++;
  assert.deepEqual(counts,{reaction:2000,laugh:2200,sing:1500,talk:4300});
});
test('1000 distinct closing lines end silently with WAKE ready for a new conversation',async()=>{
  assert.equal(conclusions.length,1000);
  assert.equal(new Set(conclusions.map(line=>line.text)).size,1000);
  assert.equal(new Set(conclusions.map(line=>line.voice)).size,3);
  const h=harness();await vm.runInContext('wake()',h.context);
  vm.runInContext(`cancel();ctx.currentTime=55;closeAt=50;
    globalThis.endingActions=[];const originalPerform=perform;
    perform=(kind,options={})=>{endingActions.push({kind,text:options.text,voices:options.voices});originalPerform(kind,options)};
    schedule();`,h.context);
  for(let pass=0;pass<10;pass++){await new Promise(resolve=>setImmediate(resolve));if(!h.pending.size)break;for(const entry of [...h.pending.values()].sort((a,b)=>a.ms-b.ms))entry.fn();}
  const actions=vm.runInContext('endingActions',h.context);
  assert.equal(actions.length,2);assert.equal(actions[0].kind,'talk');
  assert(conclusions.some(line=>line.text===actions[0].text));
  assert.equal(actions[1].kind,'laugh');assert.deepEqual(Array.from(actions[1].voices),[0,1,2]);
  assert.equal(vm.runInContext('awake',h.context),false);assert.equal(h.pending.size,0);
  assert.equal(h.elements.get('power').textContent,'WAKE');
  await h.elements.get('power').onclick();
  assert.equal(vm.runInContext('awake',h.context),true);
  assert.equal(h.elements.get('power').textContent,'SLEEP');
  vm.runInContext('sleep()',h.context);
});
test('interruptions allow a fade before stopping sources',async()=>{
  const h=harness();await vm.runInContext("wake('laugh')",h.context);
  vm.runInContext('globalThis.stopTimes=[];for(const source of sources)source.stop=at=>stopTimes.push(at);sleep()',h.context);
  const times=vm.runInContext('stopTimes',h.context);
  assert(times.length>0);assert(times.every(at=>at===.02));
  assert.equal(h.pending.size,0);
});
test('blue uses a synchronized detuned double with independent cleanup',async()=>{
  const h=harness();await vm.runInContext('audio()',h.context);
  vm.runInContext("tone(100,.3,.04,0,'square',0)",h.context);
  assert.equal(h.played.length,3);
  assert.deepEqual(h.played.filter(event=>!event.node.buffer).map(event=>event.node.detune.value),[0,7]);
  assert(h.played.every(event=>event.at===.04));
  h.played[0].node.onended();
  assert.equal(vm.runInContext('sources.size',h.context),2);
  vm.runInContext('sleep()',h.context);
  assert.equal(vm.runInContext('sources.size',h.context),0);
});
test('blue breath follows the sung or spoken vowel with quieter rounded vowels',()=>{
  const bright=blueVowelProfile(vowelCode('see')),rounded=blueVowelProfile(vowelCode('you',2));
  assert(bright.noiseGain>rounded.noiseGain);
  assert(bright.noiseHz>rounded.noiseHz);
  assert.equal(vowelCode('I'),105);
  assert.equal(vowelCode('rhythm'),121);
});
test('pitch glides are continuous, directional, and settle at the destination',()=>{
  for(const [from,to,duration] of [[1600,150,2.8],[92,120,1.6],[220,440,.24]]){
    assert.equal(glidePitch(from,to,0,duration),from);
    assert(Math.abs(glidePitch(from,to,duration,duration)-to)<1e-8);
    let previous=from;
    for(let i=1;i<=100;i++){const current=glidePitch(from,to,duration*i/100,duration);assert(to>from?current>=previous:current<=previous);previous=current;}
  }
});
test('all reactions produce audio with matching subtitles and cancel cleanly',async()=>{
  const h=harness();
  for(const [voice,label,count] of [[0,'*screams*',2],[1,'*sighs*',1],[2,'*giggles*',12]]){
    h.played.length=0;
    vm.runInContext(`active=${voice}`,h.context);
    await vm.runInContext("wake('reaction')",h.context);
    assert.equal(h.played.length,count);
    assert.equal(h.elements.get(['blue','yellow','pink'][voice]+'Subtitle').textContent,label);
    for(const entry of h.pending.values())if(entry.ms<=41)entry.fn();
    assert.equal(h.elements.get(['blue','yellow','pink'][voice]+'Frames').style.backgroundPosition,'100% 100%');
    if(voice===2)for(let i=1;i<h.played.length;i++)assert(Math.abs(h.played[i].at-h.played[i-1].at-.073)<1e-8);
    for(const data of h.buffers)assert(data.every(Number.isFinite));
    vm.runInContext('sleep()',h.context);assert.equal(h.pending.size,0);
  }
});

test('each lyric fits its melody and all singers show the same words',async()=>{
  for(const [length,phrases] of Object.entries(lyrics))for(const phrase of phrases)assert.equal(phrase.split(' ').length,Number(length));
  const h=harness();await vm.runInContext("wake('sing')",h.context);
  for(const entry of [...h.pending.values()])if(entry.ms<=155)entry.fn();
  const captions=['blue','yellow','pink'].map(voice=>h.elements.get(voice+'Subtitle').textContent);
  const firstDegree=melodies[Math.floor(.99*melodies.length)].degrees[0];
  assert(captions[1].includes(`[ ${minorNote(firstDegree,1).name} — ]`));
  assert(captions.every(c=>c.includes('\n[ ')));
  assert.equal(new Set(captions.map(c=>c.split('\n')[0])).size,1);
});
test('sung syllables share timing across voices and fit within each melody note',async()=>{
  assert.deepEqual(singingSyllables('Beautiful'),['Beau','ti','ful']);
  assert.equal(singingSyllables('silence').length,2);
  assert.equal(singingSyllables('lights').length,1);
  const h=harness();
  vm.runInContext("chooseLyrics=length=>Array(length).fill('beautiful');globalThis.sung=[];playBlueSyllable=(buffer,phonemes,hz,duration,at)=>sung.push({hz,duration,at,voice:0});tone=(hz,duration,at,vowel,type,voice)=>sung.push({hz,duration,at,voice})",h.context);
  await vm.runInContext("wake('sing')",h.context);
  const notes=vm.runInContext('sung',h.context), melody=melodies[Math.floor(.99*melodies.length)];
  assert.equal(notes.length,melody.degrees.length*3*3);
  const first=notes.slice(0,9), beat=melody.beats[0]*60/(80+.99*40);
  for(let syllable=0;syllable<3;syllable++){
    const group=first.filter((_,index)=>index%3===syllable);
    assert(group.every(note=>Math.abs(note.at-(.04+syllable*beat/3))<1e-9));
    assert(group.every(note=>note.at+note.duration<=.04+beat));
  }
  vm.runInContext('sleep()',h.context);
});
test('linked replies follow their scene speakers and sleep clears the conversation',async()=>{
  const h=harness();vm.runInContext('replyQueue=exchanges[0].slice()',h.context);
  for(const turn of exchanges[0]){
    await vm.runInContext("wake('talk')",h.context);
    assert.equal(vm.runInContext('active',h.context),turn.voice);
    for(const entry of [...h.pending.values()].sort((a,b)=>a.ms-b.ms))entry.fn();
    assert.equal(h.elements.get(['blue','yellow','pink'][turn.voice]+'Subtitle').textContent,turn.text);
  }
  assert.equal(vm.runInContext('replyQueue.length',h.context),0);
  vm.runInContext('replyQueue=exchanges[1].slice();sleep()',h.context);
  assert.equal(vm.runInContext('replyQueue.length',h.context),0);
});


test('speech gestures add deep yellow pitches, pink stutters, and long blue holds',()=>{
  assert(speechSyllable(1,78,()=>0)[0].hz<30);
  assert(speechSyllable(1,78,()=>.999)[0].hz>170);
  const stutter=speechSyllable(2,205,()=>.1);
  assert(stutter.length>=3);assert(stutter.every(part=>part.duration+part.gap<.05));
  assert(speechSyllable(0,100,()=>.1)[0].duration>.22);
  assert(speechSyllable(0,100,()=>.9)[0].duration<.15);
});


test('blue scream jitters in a low register with random timing',()=>{
  const a=screamJitter(2.8,()=>.1),b=screamJitter(2.8,()=>.9);
  assert(a.length>25);assert(a.every(p=>p.hz>=35&&p.hz<=210));
  assert.notDeepEqual(a,b);assert.equal(a.at(-1).at,2.8);
  const varied=screamJitter(2.8,(()=>{let value=0;return()=>{value=(value+.37)%1;return value}})());
  assert(varied.some((p,i)=>i&&p.hz>varied[i-1].hz));
  assert(varied.some((p,i)=>i&&p.hz<varied[i-1].hz));
});
test('yellow breath ignores pitch and glide settings',async()=>{
  const h=harness();await vm.runInContext('audio()',h.context);
  vm.runInContext("texture(40,1.6,0,0,1,'sigh',1)",h.context);
  const low=h.buffers.at(-1);
  vm.runInContext("texture(800,1.6,0,0,1,'sigh',1,{from:800,to:1500,seconds:1.6})",h.context);
  assert.deepEqual(h.buffers.at(-1),low);
});
