import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {expandedLyrics,expandedTurn} from '../dist/expanded-dialogue.js';
import {characterLines,castConclusions,scenesForCast} from '../dist/cast-dialogue.js';
import {chooseLyrics,singingSyllables} from '../dist/conversation.js';
import {blueSingingData} from '../dist/blue-singing-data.js';
import {createVariety,lineKeys,openingVoice} from '../dist/variety.js';

test('each new personality matches the original dialogue depth with usable replies and lyrics',()=>{
  for(let voice=3;voice<9;voice++){
    const lines=new Set(characterLines[voice]);assert.equal(lines.size,1224);
    const endings=castConclusions.filter(turn=>turn.voice===voice).map(turn=>turn.text);
    assert.equal(new Set(endings).size,336);assert(endings.every(text=>!lines.has(text)));
    const replies=new Set();
    for(let topic=0;topic<12;topic++)for(let variant=0;variant<12;variant++){
      const reply=expandedTurn(voice,topic,variant,true);replies.add(reply);assert(lines.has(reply));
      assert(lines.has(expandedTurn(voice,topic,variant)));
    }
    assert.equal(replies.size,144);
    const bank=expandedLyrics[voice];assert.equal(new Set(Object.values(bank).flat()).size,32);
    for(const [length,phrases] of Object.entries(bank)){
      assert.equal(phrases.length,8);
      for(let index=0;index<phrases.length;index++){
        const words=chooseLyrics(Number(length),()=>index/8,voice);
        assert.equal(words.length,Number(length));assert.equal(words.join(' '),phrases[index]);
        for(const word of words){
          const info=blueSingingData[word.toLowerCase()];assert(info,word);
          assert.equal(info.syllables.length,singingSyllables(word).length);
          assert(existsSync(new URL('../dist/'+info.file,import.meta.url)));
        }
      }
    }
  }
});

test('expanded replies are wired into mixed casts in both directions',()=>{
  for(let voice=3;voice<9;voice++){
    const scenes=scenesForCast([0,1,voice]);
    const replies=new Set(scenes.flatMap(scene=>scene.slice(1)).filter(turn=>turn.voice===voice).map(turn=>turn.text));
    for(let topic=0;topic<12;topic++)for(let variant=0;variant<12;variant++)assert(replies.has(expandedTurn(voice,topic,variant,true)));
  }
});

test('variety selection uses all fresh ideas before repeating and then prefers the oldest',()=>{
  const choices=['A thought. One ending.','A thought. Another ending.','B thought. One ending.','C thought. One ending.'];
  const history=createVariety(),seen=[];
  for(let i=0;i<3;i++){
    const text=history.pick(choices,lineKeys,()=>0);seen.push(text);history.record(lineKeys(text));
  }
  assert.deepEqual(seen.map(text=>text[0]),['A','B','C']);
  assert.equal(history.pick(choices,lineKeys,()=>0),'A thought. Another ending.');
  const voices=createVariety();
  for(const expected of [3,4,5,3]){
    const voice=openingVoice([3,4,5],voices,()=>0);assert.equal(voice,expected);voices.record(['voice:'+voice]);
  }
  assert.deepEqual([0,.4,.99].map(value=>openingVoice([3,4,5],createVariety(),()=>value)),[3,4,5]);
});

test('personality lyric selection avoids repeats until its bank is exhausted',()=>{
  for(let voice=3;voice<9;voice++)for(const length of [5,6,7,8]){
    const history=createVariety(),seen=new Set();
    for(let i=0;i<8;i++)seen.add(chooseLyrics(length,()=>0,voice,history).join(' '));
    assert.equal(seen.size,8);
  }
});
