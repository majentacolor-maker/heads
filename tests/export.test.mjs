import test from 'node:test';
import assert from 'node:assert/strict';
import { makeExportPlan, frameAt } from '../dist/export-plan.js';
import { exchanges } from '../dist/conversation.js';
import { mp4Mime } from '../dist/export-video.js';

test('every export is a complete three-face conversation under one minute',()=>{
  const candidates=exchanges.filter(turns=>new Set(turns.map(turn=>turn.voice)).size===3);
  for(let i=0;i<candidates.length;i++)for(const pace of [0,.999999]){
    let first=true;const plan=makeExportPlan(()=>{if(first){first=false;return(i+.5)/candidates.length}return pace});
    assert(plan.duration<59);assert(plan.duration>5);
    assert.equal(new Set(plan.tones.map(t=>t.voice)).size,3);
    const finalCaptions=plan.captions.filter((c,n)=>!plan.captions[n+1]||plan.captions[n+1].voice!==c.voice);
    assert.deepEqual(finalCaptions.map(c=>c.text),candidates[i].map(t=>t.text));
    assert(plan.tones.every(t=>t.at+t.duration<plan.duration));
  }
});
test('export mouth frames and captions follow the same audio timeline',()=>{
  const plan=makeExportPlan(()=>.5),first=plan.tones[0];
  assert.deepEqual(frameAt(plan,0).mouths,[false,false,false]);
  assert(frameAt(plan,first.at+.001).mouths[first.voice]);
  assert(frameAt(plan,first.at).captions[first.voice].length>0);
  assert.deepEqual(frameAt(plan,plan.duration).mouths,[false,false,false]);
});
test('export chooses MP4 and rejects a WebM-only recorder',()=>{
  assert.equal(mp4Mime({isTypeSupported:type=>type==='video/mp4'}),'video/mp4');
  assert.equal(mp4Mime({isTypeSupported:type=>type.startsWith('video/webm')}),null);
  assert.equal(mp4Mime(null),null);
});
