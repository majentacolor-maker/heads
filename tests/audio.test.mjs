import { newLines } from '../dist/dialogue.js';
import { melodies } from '../dist/melodies.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { minorNote, minorScale, decimatorSettings, ensemble } from '../dist/music.js';

test('ensembles can choose one, two or three distinct heads',()=>{
  for(const lead of [0,1,2])for(const [random,count] of [[.1,1],[.5,2],[.99,3]]){
    const voices=ensemble(lead,()=>random);
    assert.equal(voices.length,count);assert.equal(new Set(voices).size,count);assert.equal(voices[0],lead);
  }
});
test('all harmony parts stay in C natural minor, across vocal registers',()=>{
  for(const voice of [0,1,2])for(let degree=0;degree<14;degree++){
    const note=minorNote(degree,voice);const midi=69+12*Math.log2(note.hz/440);
    assert(Math.abs(midi-Math.round(midi))<1e-9);assert(minorScale.includes(Math.round(midi)%12));
  }
});
test('decimation clock and depth track pitch within bounds',()=>{
  const low=decimatorSettings(55), high=decimatorSettings(220);
  assert(high.sampleRate>low.sampleRate);assert(high.bits>low.bits);
  assert.equal(decimatorSettings(1e6).sampleRate,12000);assert.equal(decimatorSettings(0).bits,2);
});
function harness(){
  const elements=new Map(),pending=new Map(), played=[], buffers=[];let id=0;
  const element=name=>{if(!elements.has(name))elements.set(name,{style:{},textContent:'',setAttribute(){}});return elements.get(name)};
  const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}});
  const node=()=>({gain:param(),frequency:param(),Q:param(),connect(){},disconnect(){},start(at){played.push({at,node:this})},stop(){}});
  const math=Object.create(Math);math.random=()=>.99;
  const context=vm.createContext({newLines,melodies,minorNote,decimatorSettings,ensemble:(lead)=>ensemble(lead,()=>.99),Math:math,
    document:{getElementById:element,body:{classList:{add(){},remove(){}}},addEventListener(){}},
    AudioContext:class{currentTime=0;sampleRate=48000;destination={};createGain=node;createDynamicsCompressor=node;createOscillator=node;createBiquadFilter=node;createBufferSource=node;createBuffer(ch,length,rate){const data=new Float32Array(length);buffers.push(data);return{sampleRate:rate,getChannelData(){return data}}}async resume(){}},
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
    const firstThree=h.played.slice(0,kind==='sing'?3:1);assert(firstThree.every(e=>e.at===.04));
    // Execute initial subtitle and mouth callbacks only, before any mouth closes.
    for(const entry of h.pending.values())if(entry.ms<=155)entry.fn();
    for(const voice of ['blue','yellow','pink']){
      assert.equal(h.elements.get(voice+'Frames').style.opacity,'1');
      assert(h.elements.get(voice+'Subtitle').textContent.length>0);
    }
    for(const data of h.buffers){assert(data.every(Number.isFinite));assert(data.some(x=>x!==0));}
    vm.runInContext('sleep()',h.context);assert.equal(h.pending.size,0);
    for(const voice of ['blue','yellow','pink'])assert.equal(h.elements.get(voice+'Frames').style.opacity,'0');
  }
});
