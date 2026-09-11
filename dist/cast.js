// Stable voice IDs retain the original blue/yellow/pink audio mappings.
export const characters = [
  {id:'blue',number:1,name:'Blue',description:'Existential and uneasy',image:'nft-1.png',family:0,pitch:100,phonetic:true,octave:0,mask:[.5,.75,.28,.20],reaction:'scream'},
  {id:'yellow',number:3,name:'Power',description:'Powerful and certain',image:'nft-3.png',family:1,pitch:78,octave:-3,mask:[.5,.79,.29,.18],reaction:'sigh'},
  {id:'pink',number:2,name:'Girl',description:'Aloof and pleasure seeking',image:'nft-2.png',family:2,pitch:205,octave:1,mask:[.5,.82,.30,.17],reaction:'giggle'},
  {id:'grey',number:4,name:'Grey',description:'Heavy with sadness',image:'nft-4.png',family:0,pitch:25,phonetic:true,octave:-2,mask:[.45,.77,.29,.20],reaction:'groan'},
  {id:'cosmic',number:5,name:'Cosmic',description:'Cosmic and divine',image:'nft-5.png',family:2,pitch:290,octave:2,mask:[.5,.81,.28,.17],reaction:'chime',wobble:7},
  {id:'within',number:6,name:'Within',description:'Introspective and solipsistic',image:'nft-6.png',family:1,pitch:156,octave:-2,mask:[.49,.77,.29,.19],reaction:'gasp',bits:8,jitter:.18},
  {id:'god',number:7,name:'God',description:'Convinced it made everything',image:'nft-7.png',family:0,pitch:72,octave:-1,mask:[.50,.69,.23,.19],reaction:'bellow'},
  {id:'muddle',number:8,name:'Muddle',description:'Confused and nonsensical',image:'nft-8.png',family:1,pitch:118,octave:0,mask:[.51,.70,.28,.19],reaction:'sputter',bits:4,jitter:.32},
  {id:'wisp',number:9,name:'Wisp',description:'Whimsical and enchanted',image:'nft-12.png',family:2,pitch:370,octave:2,mask:[.5,.77,.28,.19],reaction:'trill',wobble:4}
].map((character,voice)=>({...character,voice,shift:[0,[.025,.08,.065,.04,.065,.035,.075,.07,.06][voice]],still:'faces/'+character.image,sprite:'faces/'+character.image.replace('.png','-frames.png')}));
export const originalCast=[0,2,1];
export function validateCast(cast){
  if(!Array.isArray(cast)||cast.length!==3||new Set(cast).size!==3||cast.some(v=>!Number.isInteger(v)||!characters[v]))throw new Error('Choose three distinct faces.');
  return cast;
}
export function chooseCast(random=Math.random,previous=[]){
  const pool=characters.map(head=>head.voice);
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  const chosen=pool.slice(0,3);
  if(chosen.every(voice=>previous.includes(voice)))chosen[2]=pool[3+Math.floor(random()*(pool.length-3))];
  return chosen;
}
export function nextVoice(cast,previous,preferred){
  const choices=cast.filter(voice=>voice!==previous);
  return choices.includes(preferred)?preferred:choices[0];
}
export function castEnsemble(cast,lead,random=Math.random){
  const others=cast.filter(v=>v!==lead);
  if(random()<.5)others.reverse();
  return [lead,...others.slice(0,Math.floor(random()*3))];
}
export function harmonyVoices(voices){
  return [...voices].sort((a,b)=>a===1?-1:b===1?1:characters[a].octave-characters[b].octave||a-b);
}
export function mountCast(container,cast){
  container.replaceChildren(...cast.map(voice=>{
    const head=characters[voice],section=document.createElement('section'),stack=document.createElement('div');
    section.dataset.head=head.id;stack.className='face-stack';
    const image=document.createElement('img');image.src=head.still;image.alt=head.description+' face';image.width=1024;image.height=1024;
    const frames=document.createElement('div');frames.className='frames';frames.id=head.id+'Frames';frames.setAttribute('aria-hidden','true');
    frames.style.backgroundImage=`url("${head.sprite}")`;
    const [x,y,rx,ry]=head.mask,[dx,dy]=head.shift;
    frames.style.transform=`translate(${dx*100}%,${dy*100}%)`;
    frames.style.maskImage=`radial-gradient(ellipse ${rx*100}% ${ry*100}% at ${(x-dx)*100}% ${(y-dy)*100}%,#000 55%,transparent 100%)`;
    const caption=document.createElement('p');caption.id=head.id+'Subtitle';caption.setAttribute('aria-live','polite');
    stack.append(image,frames);section.append(stack,caption);return section;
  }));
}
