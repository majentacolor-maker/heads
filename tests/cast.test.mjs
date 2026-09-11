import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {characters,chooseCast,validateCast,mountCast,harmonyVoices,castEnsemble} from '../dist/cast.js';
import {topics,characterLines,scenesForCast,conclusionForCast,castConclusions} from '../dist/cast-dialogue.js';
import {voiceNote,voiceSyllables,voiceLaugh,reactionPhrase,variantSamples} from '../dist/voice-variants.js';
import {blueSpeechData} from '../dist/blue-speech-data.js';
import {makeExportPlan,frameAt} from '../dist/export-plan.js';

const combinations=[];
for(let a=0;a<9;a++)for(let b=a+1;b<9;b++)for(let c=b+1;c<9;c++)combinations.push([a,b,c]);
function randomFrom(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}

test('refresh selection covers all 84 trios with no duplicate face',()=>{
  const seen=new Set(),counts=Array(9).fill(0),random=randomFrom(42);
  for(let i=0;i<10000;i++){
    const cast=chooseCast(random);validateCast(cast);cast.forEach(voice=>counts[voice]++);
    seen.add([...cast].sort().join(','));
  }
  assert.equal(seen.size,84);assert(counts.every(count=>count>3000&&count<3700));
  assert.throws(()=>validateCast([0,0,1]));assert.throws(()=>validateCast([0,1,9]));
});

test('every supplied base and its four-frame sheet exist and retain the requested mapping',()=>{
  assert.deepEqual(characters.map(head=>[head.number,head.image]),[[1,'nft-1.png'],[3,'nft-3.png'],[2,'nft-2.png'],[4,'nft-4.png'],[5,'nft-5.png'],[6,'nft-6.png'],[7,'nft-7.png'],[8,'nft-8.png'],[9,'nft-12.png']]);
  for(const head of characters)for(const file of [head.still,head.sprite]){
    const bytes=readFileSync(new URL('../dist/'+file,import.meta.url));
    assert.equal(bytes.toString('ascii',1,4),'PNG');
    assert.equal(bytes.readUInt32BE(16),bytes.readUInt32BE(20));
    assert(bytes.readUInt32BE(16)>=1024);
    if(file===head.sprite)assert.equal(bytes.readUInt32BE(16)%2,0);
  }
});

test('each trio mounts only its three matching faces, captions and masked animations',()=>{
  const previous=globalThis.document;
  const node=tag=>({tag,style:{},dataset:{},children:[],attributes:{},append(...children){this.children.push(...children)},setAttribute(key,value){this.attributes[key]=value}});
  globalThis.document={createElement:node};
  try{
    for(const cast of combinations){
      const root={replaceChildren(...children){this.children=children}};mountCast(root,cast);
      assert.equal(root.children.length,3);
      root.children.forEach((section,i)=>{
        const head=characters[cast[i]],[image,frames]=section.children[0].children;
        assert.equal(image.src,head.still);assert.equal(section.dataset.head,head.id);
        assert.equal(frames.id,head.id+'Frames');assert(frames.style.backgroundImage.includes(head.sprite));
        assert.equal(section.children[1].id,head.id+'Subtitle');
      });
    }
  }finally{globalThis.document=previous;}
});

test('all 84 trios have connected dialogue, distinct adjacent speakers and only present voices in exports',()=>{
  for(const cast of combinations){
    const scenes=scenesForCast(cast);
    for(const scene of scenes){
      assert(scene.every(turn=>cast.includes(turn.voice)&&turn.text.length>0));
      assert(scene.every((turn,i)=>!i||turn.voice!==scene[i-1].voice));
    }
    for(const fixed of [0,.5,.999999]){
      const plan=makeExportPlan(()=>fixed,cast);
      assert.deepEqual(plan.cast,cast);assert.equal(plan.duration,60);
      assert(plan.dialogue.every(turn=>cast.includes(turn.voice)));
      assert(plan.dialogue.every((turn,i)=>!i||turn.voice!==plan.dialogue[i-1].voice));
      assert(plan.tones.every(tone=>cast.includes(tone.voice)&&Number.isFinite(tone.duration)&&tone.duration>0&&tone.at+tone.duration<=60));
      assert.deepEqual([...new Set(plan.tones.filter(t=>t.kind==='laugh').map(t=>t.voice))].sort(),[...cast].sort());
      const state=frameAt(plan,plan.laughAt+.15);
      for(const head of characters){
        if(cast.includes(head.voice)){
          const first=plan.tones.find(tone=>tone.kind==='laugh'&&tone.voice===head.voice);
          assert(frameAt(plan,first.at+first.duration/2).mouths[head.voice]);
          assert.equal(state.captions[head.voice],'*laughs*');
        }
        else{assert(!state.mouths[head.voice]);assert.equal(state.captions[head.voice],'');}
      }
    }
  }
});

test('phonetic characters have local audio for every available line and conclusion',()=>{
  for(const voice of [0,3]){
    const lines=[...characterLines[voice],...castConclusions.filter(t=>t.voice===voice).map(t=>t.text)];
    for(const text of lines){const info=blueSpeechData[text];assert(info,text);assert(info.phonemes.length>0);assert(existsSync(new URL('../dist/'+info.file,import.meta.url)));}
  }
  assert(topics.every(topic=>topic.lines.length===9));
});

test('all voices harmonize in minor, with yellow always fundamental and lower than blue',()=>{
  assert.equal(voiceNote(0,3).hz,voiceNote(0,0).hz/4);
  assert.equal(voiceNote(0,5).hz,voiceNote(0,1).hz*2);
  for(const cast of combinations){
    const singers=harmonyVoices(cast);if(cast.includes(1))assert.equal(singers[0],1);
    for(const lead of cast)for(const random of [()=>0,()=>.5,()=>.999]){
      const group=castEnsemble(cast,lead,random);assert(group.every(v=>cast.includes(v)));assert.equal(new Set(group).size,group.length);
    }
    for(let degree=0;degree<10;degree++)singers.forEach((voice,i)=>{
      const note=voiceNote(degree+i*2,voice),midi=Math.round(69+12*Math.log2(note.hz/440));
      assert([0,2,3,5,7,8,10].includes(midi%12));
    });
  }
});

test('new voices have distinct finite synthesis, speech rhythms, laughter and reactions',()=>{
  const fingerprints=new Set();
  for(let voice=3;voice<9;voice++){
    const head=characters[voice],samples=variantSamples(voice,head.pitch,.5,22050,1,'talk',undefined,randomFrom(7));
    assert(samples.every(Number.isFinite));assert(samples.some(value=>Math.abs(value)>.01));
    assert(samples.every(value=>Math.abs(value)<2));
    fingerprints.add(samples.slice(100,120).join(','));
    assert(voiceSyllables(voice,()=>.1).every(note=>note.hz>0&&note.duration>0));
    assert(voiceLaugh(voice,()=>.2).duration>0);
    const reaction=reactionPhrase(voice);assert(/^\*[a-z]+\*$/.test(reaction.caption));assert(reaction.duration>0);
  }
  assert.equal(fingerprints.size,6);
});

test('cast redraw cannot repeat the previous trio even with identical random draws',()=>{
  for(const value of [0,.2,.5,.99]){
    let previous=chooseCast(()=>value);
    for(let i=0;i<20;i++){
      const cast=chooseCast(()=>value,previous);validateCast(cast);
      assert.notDeepEqual([...cast].sort(),[...previous].sort());previous=cast;
    }
  }
});
