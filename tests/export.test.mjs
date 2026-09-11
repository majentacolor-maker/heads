import {captionLayout} from '../dist/export-video.js';
import {sharedCaption} from '../dist/cast.js';
import {characters,originalCast} from '../dist/cast.js';
import {scenesForCast,castConclusions} from '../dist/cast-dialogue.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeExportPlan, frameAt } from '../dist/export-plan.js';
import { exchanges, conclusions } from '../dist/conversation.js';
import { mp4Mime } from '../dist/export-video.js';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('every minute-long export ends with a complete conclusion followed by all three laughing',()=>{
  const candidates=scenesForCast(originalCast).filter(turns=>new Set(turns.map(turn=>turn.voice)).size===3);
  for(let i=0;i<candidates.length;i++)for(const pace of [0,.999999]){
    let first=true;const plan=makeExportPlan(()=>{if(first){first=false;return(i+.5)/candidates.length}return pace});
    assert.equal(plan.duration,60);
    assert(plan.scenes.length>=1);
    assert(plan.scenes.every((scene,n)=>n===0||scene!==plan.scenes[n-1]));
    assert.equal(new Set(plan.tones.map(t=>t.voice)).size,3);
    const spokenCaptions=plan.captions.filter(c=>c.turn<plan.dialogue.length);
    const finalCaptions=spokenCaptions.filter((c,n)=>!spokenCaptions[n+1]||spokenCaptions[n+1].turn!==c.turn);
    assert.deepEqual(finalCaptions.map(c=>c.text),plan.dialogue.map(t=>t.text));
    assert([...conclusions,...castConclusions].includes(plan.conclusion));
    assert.equal(plan.dialogue.at(-1),plan.conclusion);
    assert(plan.dialogue.every((turn,index)=>index===0||turn.voice!==plan.dialogue[index-1].voice));
    assert(plan.conclusionAt<plan.laughAt);
    assert(plan.tones.filter(t=>t.kind!=='laugh').every(t=>t.at+t.duration<plan.laughAt));
    const laughter=plan.tones.filter(t=>t.kind==='laugh');
    assert.equal(new Set(laughter.map(t=>t.voice)).size,3);
    assert(laughter.every(t=>t.at>=plan.laughAt));
    assert(plan.tones.every(t=>t.at+t.duration<plan.duration));
    assert(plan.tones.at(-1).at>57);
    assert.deepEqual(frameAt(plan,plan.duration).captions.slice(0,3),['*laughs*','*laughs*','*laughs*']);
  }
});
test('export mouth frames and captions follow speech and the overlapping final laugh',()=>{
  const plan=makeExportPlan(()=>.5),first=plan.tones[0];
  assert.deepEqual(frameAt(plan,0).mouths.slice(0,3),[false,false,false]);
  const firstSound=first.kind==='speech'?first.activity[0][0]*first.duration/first.sourceDuration:0;
  assert(frameAt(plan,first.at+firstSound+.001).mouths[first.voice]);
  assert(frameAt(plan,first.at).captions[first.voice].length>0);
  const laughing=frameAt(plan,plan.laughAt+.115);
  assert.deepEqual(laughing.mouths.slice(0,3),[true,true,true]);
  assert.deepEqual(laughing.frames.slice(0,3),['laugh','laugh','laugh']);
  assert.deepEqual(laughing.captions.slice(0,3),['*laughs*','*laughs*','*laughs*']);
  assert.deepEqual(frameAt(plan,plan.duration).mouths.slice(0,3),[false,false,false]);
});
test('export chooses MP4 and rejects a WebM-only recorder',()=>{
  assert.equal(mp4Mime({isTypeSupported:type=>type==='video/mp4'}),'video/mp4');
  assert.equal(mp4Mime({isTypeSupported:type=>type.startsWith('video/webm')}),null);
  assert.equal(mp4Mime(null),null);
});

test('recording routes audio only to the MP4 stream and draws no title',async()=>{
  const connections=[],text=[],textPositions=[],progress=[];let downloaded=false,stopped=false;
  const track={stop(){}},stream={getVideoTracks:()=>[track],getAudioTracks:()=>[track],getTracks:()=>[track]};
  const destination={name:'speakers'},recording={stream};
  const context={currentTime:0,destination,createMediaStreamDestination:()=>recording,
    createBufferSource:()=>({connect(to){connections.push(['source',to])},start(){},stop(){},disconnect(){}}),
    createGain:()=>({gain:{value:1,setValueAtTime(){},linearRampToValueAtTime(){}},connect(to){connections.push(['gain',to])},disconnect(){}})};
  const pen={fillRect(){},drawImage(){},save(){},restore(){},translate(){},scale(){},createRadialGradient:()=>({addColorStop(){}}),measureText:value=>({width:value.length*10}),fillText:(value,x,y)=>{text.push(value);textPositions.push({value,x,y,font:pen.font})}};
  class Canvas{getContext(){return pen}captureStream(){return stream}}
  class Recorder{
    static isTypeSupported(){return true}state='inactive';
    start(){this.state='recording'}
    stop(){if(this.state==='inactive')return;this.state='inactive';this.ondataavailable({data:new Blob([new Uint8Array([0,0,0,12,102,116,121,112,0,0,0,0])])});this.onstop()}
  }
  const runtime=vm.createContext({makeExportPlan,frameAt,characters,originalCast,sharedCaption,Image:class{width=100;height=100;set src(value){queueMicrotask(()=>this.onload())}},
    document:{body:{append(){}},createElement:tag=>tag==='canvas'?new Canvas():{click(){downloaded=true},remove(){}}},
    HTMLCanvasElement:Canvas,MediaRecorder:Recorder,MediaStream:class{},Blob,DOMException,
    URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout:fn=>{queueMicrotask(fn);return 1},clearTimeout(){},
    requestAnimationFrame:fn=>{queueMicrotask(()=>{context.currentTime=60;fn()});return 1},cancelAnimationFrame(){},
    context,signal:new AbortController().signal,onProgress:value=>progress.push(value),stop:()=>{stopped=true}});
  // Only the cleanup delay runs; a real watchdog or URL expiry must not fire immediately.
  runtime.setTimeout=(fn,ms)=>{if(ms===25)queueMicrotask(fn);return 1};
  const source=readFileSync(new URL('../dist/export-video.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/gm,'').replace(/export /g,'');
  vm.runInContext(source,runtime);
  await vm.runInContext('exportVideo({context,renderAudio:async()=>({}),signal,onProgress,stop})',runtime);
  assert(connections.some(([from,to])=>from==='gain'&&to===recording));
  assert(connections.every(([,to])=>to!==destination));
  assert(!text.includes('HEADS'));assert.equal(text.filter(value=>value==='*laughs*').length,1);
  const laugh=textPositions.find(item=>item.value==='*laughs*');
  assert.equal(laugh.x,600);assert.equal(laugh.y,605);assert(laugh.font.startsWith('24px'));
  assert(progress.length);assert(downloaded);assert(stopped);
});

test('export reserves the final sentence layout while revealing each word',()=>{
  const pen={measureText:text=>({width:text.length*15})};
  const full='We are looking for something that might explain why this room exists and why we have been invited to notice it.';
  const finished=captionLayout(pen,full,full);assert(finished.lines.length>1);
  let visible='';
  for(const word of full.split(' ')){
    visible+=(visible?' ':'')+word;
    const layout=captionLayout(pen,full,visible);
    assert.equal(layout.size,finished.size);
    assert.deepEqual(layout.lines.map(({x,y})=>[x,y]),finished.lines.map(({x,y})=>[x,y]));
    assert.equal(layout.lines.map(line=>line.text).filter(Boolean).join(' ').trim(),visible);
  }
});
