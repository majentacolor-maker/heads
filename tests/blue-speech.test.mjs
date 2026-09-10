import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {blueLines,newLines} from '../dist/dialogue.js';
import {exchanges,conclusions} from '../dist/conversation.js';
import {blueSpeechData,loadBlueSpeech} from '../dist/blue-speech.js';

test('every blue line has a speech asset and ordered word/mouth timings',async()=>{
  const texts=new Set([...blueLines,...newLines.blue,...exchanges.flat().filter(t=>t.voice===0).map(t=>t.text),...conclusions.filter(t=>t.voice===0).map(t=>t.text)]);
  for(const text of texts){
    const clip=blueSpeechData[text];assert(clip,text);
    const bytes=await readFile(new URL('../dist/'+clip.file,import.meta.url));
    assert.equal(bytes.toString('ascii',0,3),'ID3');assert(bytes.length>1000);
    const duration=clip.duration;assert(duration>0);
    assert.equal(clip.words.at(-1).text,text);
    clip.words.forEach((word,i)=>{assert(text.startsWith(word.text));assert(word.at>=0&&word.at<duration);if(i)assert(word.at>=clip.words[i-1].at)});
    assert(clip.activity.length>0);
    clip.activity.forEach(([start,end],i)=>{assert(start>=0&&end>start&&end<=duration+.001);if(i)assert(start>clip.activity[i-1][1])});
  }
});

test('speech loader uses browser decoding, caches it, and retries failed requests',async t=>{
  let calls=0;
  t.mock.method(globalThis,'fetch',async file=>{
    calls++;if(calls===1)return{ok:false};
    const bytes=await readFile(new URL('../dist/'+file,import.meta.url));
    return{ok:true,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};
  });
  const decoded={duration:blueSpeechData[blueLines[0]].duration};
  const context={async decodeAudioData(bytes){assert.equal(Buffer.from(bytes).toString('ascii',0,3),'ID3');return decoded}};
  await assert.rejects(loadBlueSpeech(blueLines[0],context),/Could not load/);
  const buffer=await loadBlueSpeech(blueLines[0],context);
  assert.equal(buffer.duration,blueSpeechData[blueLines[0]].duration);
  assert.equal(buffer,decoded);
  assert.equal(await loadBlueSpeech(blueLines[0],context),buffer);assert.equal(calls,2);
});
