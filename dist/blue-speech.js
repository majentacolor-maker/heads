import {blueSpeechData} from './blue-speech-data.js';
export {blueSpeechData};
import {blueSingingData} from './blue-singing-data.js';
export {blueSingingData};
const clips=new Map();
export function loadBlueSinging(word,context){return loadClip(blueSingingData[word.toLowerCase()],context)}
export async function loadBlueSpeech(text,context){
  const clip=blueSpeechData[text];
  if(!clip)throw new Error('Blue speech is unavailable for this line.');
  return loadClip(clip,context);
}
async function loadClip(clip,context){
  if(!clip)throw new Error('Blue pronunciation is unavailable.');
  if(!clips.has(clip.file))clips.set(clip.file,(async()=>{
    const response=await fetch(clip.file);
    if(!response.ok)throw new Error('Could not load blue’s voice. Try again.');
    const bytes=await response.arrayBuffer();
    if(clip.file.endsWith('.mp3'))return context.decodeAudioData(bytes);
    const view=new DataView(bytes);
    if(view.getUint32(0)!==0x52494646||view.getUint16(34,true)!==16)throw new Error('Invalid blue speech clip.');
    const length=view.getUint32(40,true)/2,rate=view.getUint32(24,true),buffer=context.createBuffer(1,length,rate);
    const samples=buffer.getChannelData(0);
    for(let i=0;i<length;i++)samples[i]=view.getInt16(44+i*2,true)/32768;
    return buffer;
  })().catch(error=>{clips.delete(clip.file);throw error}));
  if(clips.size>96)clips.delete(clips.keys().next().value);
  return clips.get(clip.file);
}
