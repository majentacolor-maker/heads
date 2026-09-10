import test from 'node:test';
import assert from 'node:assert/strict';
import { makeExportPlan, frameAt } from '../dist/export-plan.js';
import { exchanges, conclusions } from '../dist/conversation.js';
import { mp4Mime } from '../dist/export-video.js';

test('every minute-long export ends with a complete conclusion followed by all three laughing',()=>{
  const candidates=exchanges.filter(turns=>new Set(turns.map(turn=>turn.voice)).size===3);
  for(let i=0;i<candidates.length;i++)for(const pace of [0,.999999]){
    let first=true;const plan=makeExportPlan(()=>{if(first){first=false;return(i+.5)/candidates.length}return pace});
    assert.equal(plan.duration,60);
    assert(plan.scenes.length>=1);
    assert(plan.scenes.every((scene,n)=>n===0||scene!==plan.scenes[n-1]));
    assert.equal(new Set(plan.tones.map(t=>t.voice)).size,3);
    const spokenCaptions=plan.captions.filter(c=>c.turn<plan.dialogue.length);
    const finalCaptions=spokenCaptions.filter((c,n)=>!spokenCaptions[n+1]||spokenCaptions[n+1].turn!==c.turn);
    assert.deepEqual(finalCaptions.map(c=>c.text),plan.dialogue.map(t=>t.text));
    assert(conclusions.includes(plan.conclusion));
    assert.equal(plan.dialogue.at(-1),plan.conclusion);
    assert(plan.conclusionAt<plan.laughAt);
    assert(plan.tones.filter(t=>t.kind==='talk').every(t=>t.at+t.duration<plan.laughAt));
    const laughter=plan.tones.filter(t=>t.kind==='laugh');
    assert.equal(new Set(laughter.map(t=>t.voice)).size,3);
    assert(laughter.every(t=>t.at>=plan.laughAt));
    assert(plan.tones.every(t=>t.at+t.duration<plan.duration));
    assert(plan.tones.at(-1).at>57);
    assert.deepEqual(frameAt(plan,plan.duration).captions,['*laughs*','*laughs*','*laughs*']);
  }
});
test('export mouth frames and captions follow speech and the overlapping final laugh',()=>{
  const plan=makeExportPlan(()=>.5),first=plan.tones[0];
  assert.deepEqual(frameAt(plan,0).mouths,[false,false,false]);
  assert(frameAt(plan,first.at+.001).mouths[first.voice]);
  assert(frameAt(plan,first.at).captions[first.voice].length>0);
  const laughing=frameAt(plan,plan.laughAt+.115);
  assert.deepEqual(laughing.mouths,[true,true,true]);
  assert.deepEqual(laughing.frames,['laugh','laugh','laugh']);
  assert.deepEqual(laughing.captions,['*laughs*','*laughs*','*laughs*']);
  assert.deepEqual(frameAt(plan,plan.duration).mouths,[false,false,false]);
});
test('export chooses MP4 and rejects a WebM-only recorder',()=>{
  assert.equal(mp4Mime({isTypeSupported:type=>type==='video/mp4'}),'video/mp4');
  assert.equal(mp4Mime({isTypeSupported:type=>type.startsWith('video/webm')}),null);
  assert.equal(mp4Mime(null),null);
});
