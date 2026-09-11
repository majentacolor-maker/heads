import {makeExportPlan,frameAt} from './export-plan.js';
import {characters,originalCast} from './cast.js';
const WIDTH=1280,HEIGHT=720,SIZE=384,TOP=106;
export function mp4Mime(Recorder=globalThis.MediaRecorder){
  if(!Recorder)return null;
  return ['video/mp4;codecs=avc1.424028,mp4a.40.2','video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4'].find(type=>Recorder.isTypeSupported(type))??null;
}
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Could not load the face images. Try again.'));img.src=src})}
function surface(){const canvas=document.createElement('canvas');canvas.width=SIZE;canvas.height=SIZE;return canvas}
async function artwork(cast){
  const images=await Promise.all(cast.map(async voice=>{
    const {still,sprite,mask:shape,shift}=characters[voice];
    const [image,sheet]=await Promise.all([loadImage(still),loadImage(sprite)]);
    const mouths={};
    for(const [kind,column,row] of [['talk',0,0],['laugh',1,0],['sing',0,1],['reaction',1,1]]){
      const mouth=surface(),pen=mouth.getContext('2d');
      pen.drawImage(sheet,column*sheet.width/2,row*sheet.height/2,sheet.width/2,sheet.height/2,shift[0]*SIZE,shift[1]*SIZE,SIZE,SIZE);
      pen.globalCompositeOperation='destination-in';
      const [x,y,rx,ry]=shape;
      pen.save();pen.translate(SIZE*x,SIZE*y);pen.scale(SIZE*rx,SIZE*ry);
      const mask=pen.createRadialGradient(0,0,.55,0,0,1);mask.addColorStop(0,'#fff');mask.addColorStop(1,'transparent');pen.fillStyle=mask;pen.fillRect(-2,-2,4,4);pen.restore();
      mouths[kind]=mouth;
    }
    return [voice,{image,mouths}];
  }));
  return Object.fromEntries(images);
}
function wrappedLines(pen,text,width){
  const lines=[];let line='';
  for(const word of text.split(' ')){const candidate=line?line+' '+word:word;if(line&&pen.measureText(candidate).width>width){lines.push(line);line=word}else line=candidate;}
  if(line)lines.push(line);return lines;
}
function draw(pen,art,plan,time){
  pen.fillStyle='#000';pen.fillRect(0,0,WIDTH,HEIGHT);
  const state=frameAt(plan,time);
  for(const [position,voice] of plan.cast.entries()){
    const x=40+position*408;
    pen.drawImage(art[voice].image,x,TOP,SIZE,SIZE);
    if(state.mouths[voice])pen.drawImage(art[voice].mouths[state.frames[voice]],x,TOP);
    pen.fillStyle='#fff';pen.font='16px Menlo, Monaco, monospace';pen.textAlign='center';pen.textBaseline='top';
    wrappedLines(pen,state.captions[voice],SIZE-20).forEach((line,i)=>pen.fillText(line,x+SIZE/2,TOP+SIZE+26+i*23));
  }
}
export async function exportVideo({context,renderAudio,stop,signal,onProgress,cast=originalCast}){
  const mime=mp4Mime();
  if(!mime)throw new Error('MP4 recording is unavailable in this browser. Try current Safari or Chrome.');
  if(typeof HTMLCanvasElement.prototype.captureStream!=='function')throw new Error('Video recording is unavailable in this browser.');
  const plan=makeExportPlan(Math.random,cast);
  const [art,sound]=await Promise.all([artwork(cast),renderAudio(plan)]);
  if(signal.aborted)throw new DOMException('Cancelled','AbortError');
  const canvas=document.createElement('canvas');canvas.width=WIDTH;canvas.height=HEIGHT;
  const pen=canvas.getContext('2d');draw(pen,art,plan,0);
  const video=canvas.captureStream(30),audio=context.createMediaStreamDestination();
  let recorder,animation,watchdog,playback,playbackGain,tracks=[],error;
  const chunks=[];
  try{

    tracks=[...video.getVideoTracks(),...audio.stream.getAudioTracks()];
    const stream=new MediaStream(tracks);
    recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5000000,audioBitsPerSecond:128000});
    const result=new Promise((resolve,reject)=>{
      recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)};
      recorder.onerror=event=>{error=event.error??new Error('Video recording failed.');if(recorder.state!=='inactive')recorder.stop();else reject(error)};
      recorder.onstop=()=>{if(error)reject(error);else if(signal.aborted)reject(new DOMException('Cancelled','AbortError'));else if(!chunks.length)reject(new Error('The recording was empty. Try again.'));else resolve(new Blob(chunks,{type:'video/mp4'}))};
    });
    const abort=()=>{if(recorder.state!=='inactive')recorder.stop()};
    signal.addEventListener('abort',abort,{once:true});
    try{
      recorder.start(1000);
      const base=context.currentTime;
      playback=context.createBufferSource();playback.buffer=sound;playbackGain=context.createGain();playback.connect(playbackGain);playbackGain.connect(audio);playback.onended=()=>{if(recorder.state!=='inactive')recorder.stop()};playback.start(base);
      const tick=()=>{
        const elapsed=Math.max(0,context.currentTime-base);
        draw(pen,art,plan,elapsed);onProgress(Math.min(99,Math.floor(elapsed/plan.duration*100)));
        if(elapsed>=plan.duration){recorder.stop();return}animation=requestAnimationFrame(tick);
      };
      animation=requestAnimationFrame(tick);
      watchdog=setTimeout(()=>{error=new Error('Recording paused. Keep this tab open and try again.');abort()},(plan.duration+15)*1000);
      const blob=await result;
      // Never save a WebM file with an MP4 extension.
      const signature=new Uint8Array(await blob.slice(4,8).arrayBuffer());
      if(String.fromCharCode(...signature)!=='ftyp')throw new Error('The browser did not produce a valid MP4.');
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='heads-'+Date.now()+'.mp4';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    }finally{signal.removeEventListener('abort',abort)}
  }finally{
    cancelAnimationFrame(animation);clearTimeout(watchdog);
    if(recorder&&recorder.state!=='inactive')recorder.stop();
    if(playback){
      if(playbackGain){playbackGain.gain.setValueAtTime(playbackGain.gain.value,context.currentTime);playbackGain.gain.linearRampToValueAtTime(0,context.currentTime+.015);}
      try{playback.stop(context.currentTime+.02)}catch{}
      await new Promise(resolve=>setTimeout(resolve,25));playback.disconnect();playbackGain?.disconnect();
    }
    for(const track of tracks)track.stop();
    for(const track of video.getTracks())track.stop();
    stop();
  }
}
