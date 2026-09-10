import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {speechWalk,speechTime,singPhonemes} from '../dist/blue-phonemes.js';
import {blueSingingData} from '../dist/blue-singing-data.js';
import {lyrics,singingSyllables,exchanges,conclusions} from '../dist/conversation.js';
import {blueLines,newLines} from '../dist/dialogue.js';

test('dialogue banks are tenfold larger, unique, and retain connected three-person scenes',()=>{
  for(const [voice,total,base] of [['blue',1200,blueLines.length],['yellow',1120,12],['pink',1120,12]]){
    assert.equal(newLines[voice].length+base,total);
    assert.equal(new Set(newLines[voice]).size,newLines[voice].length);
  }
  assert.equal(exchanges.length,180);assert.equal(conclusions.length,1000);
  assert.equal(new Set(exchanges.map(scene=>JSON.stringify(scene))).size,180);
  assert(exchanges.slice(18).every(scene=>new Set(scene.map(t=>t.voice)).size===3));
  assert.deepEqual([...new Set(exchanges.slice(18).map(scene=>scene[0].voice))].sort(),[0,1,2]);
});

test('random walks drift smoothly, preserve duration, and map source time monotonically',()=>{
  let seed=17;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const walk=speechWalk(9,random),other=speechWalk(9,random);
  assert.notDeepEqual(walk.points,other.points);
  assert.equal(walk.points[0].at,0);assert.equal(walk.points.at(-1).at,9);
  assert(walk.points.every(p=>Math.abs(p.cents)<=420));
  for(let i=1;i<walk.points.length;i++)assert(Math.abs(walk.points[i].cents-walk.points[i-1].cents)<=90);
  assert.equal(speechTime(walk,0),0);assert(Math.abs(speechTime(walk,9)-9)<1e-8);
  let previous=-1;for(let i=0;i<=90;i++){const time=speechTime(walk,i/10);assert(time>previous);previous=time;}
  // Numerical integration independently checks the caption-to-audio mapping.
  for(const sourceTime of [1,3,6,8]){
    const end=speechTime(walk,sourceTime);let integral=0,index=1;
    for(let t=0;t<end;t+=.0005){
      while(walk.points[index].at<t&&index<walk.points.length-1)index++;
      const a=walk.points[index-1],b=walk.points[index],cents=a.cents+(b.cents-a.cents)*(t-a.at)/(b.at-a.at);
      integral+=Math.min(.0005,end-t)*walk.rate*2**(cents/1200);
    }
    assert(Math.abs(integral-sourceTime)<.002);
  }
});

test('every lyric has full phonemes and pitched vowel samples for each written syllable',()=>{
  for(const word of new Set(Object.values(lyrics).flat().flatMap(line=>line.toLowerCase().split(' ')))){
    const clip=blueSingingData[word];assert(clip,word);
    assert.equal(clip.syllables.length,singingSyllables(word).length,word);
    const bytes=readFileSync(new URL('../dist/'+clip.file,import.meta.url)),rate=bytes.readUInt32LE(24),pcm=new Float32Array((bytes.length-44)/2);
    for(let i=0;i<pcm.length;i++)pcm[i]=bytes.readInt16LE(44+i*2)/32768;
    for(const phonemes of clip.syllables){
      assert(phonemes.some(p=>p.vowel));assert(phonemes.filter(p=>p.vowel).every(p=>p.period&&p.marks.length));
      for(const duration of [.11,.55]){
        const rendered=singPhonemes(pcm,rate,phonemes,196,duration);
        assert.equal(rendered.length,Math.round(duration*rate));assert(rendered.every(Number.isFinite));
        assert(rendered.some(value=>Math.abs(value)>.1));assert(rendered[0]===0);assert(rendered.at(-1)===0);
      }
    }
  }
});

test('vowel retuning changes pitch without changing the note length',()=>{
  const rate=22050,source=Float32Array.from({length:rate},(_,i)=>Array.from({length:10},(_,harmonic)=>Math.cos(2*Math.PI*i*(harmonic+1)/220)/(harmonic+1)).reduce((a,b)=>a+b));
  const phonemes=[{start:0,end:1,vowel:true,period:220,marks:Array.from({length:100},(_,i)=>i*220)}];
  for(const hz of [130.8128,196,261.6256]){
    const output=singPhonemes(source,rate,phonemes,hz,.8);
    let best=0,lagBest=0;
    for(let lag=Math.floor(rate/hz*.85);lag<rate/hz*1.15;lag++){
      let cross=0,energy=0;for(let i=3000;i<12000;i++){cross+=output[i]*output[i+lag];energy+=output[i]**2;}
      if(cross/energy>best){best=cross/energy;lagBest=lag}
    }
    assert(Math.abs(rate/lagBest-hz)/hz<.015);assert(best>.97);assert.equal(output.length,Math.round(rate*.8));
  }
});
