const centsToLog=Math.LN2/1200;
const area=(seconds,from,to)=>{
  const change=(to-from)*centsToLog;
  return seconds*Math.exp(from*centsToLog)*(Math.abs(change)<1e-9?1:Math.expm1(change)/change);
};
export function speechWalk(duration,random=Math.random){
  let at=0,cents=(random()-.5)*160;
  const points=[{at,cents}];
  while(at<duration){
    at=Math.min(duration,at+.14+random()*.22);
    cents=Math.max(-420,Math.min(420,cents+(random()-.5)*180));
    points.push({at,cents});
  }
  let integral=0;
  for(let i=1;i<points.length;i++)integral+=area(points[i].at-points[i-1].at,points[i-1].cents,points[i].cents);
  return{duration,points,rate:duration/integral};
}
// Map a phoneme/word's source time through the same rate curve used by Web Audio.
export function speechTime(walk,sourceTime){
  let remaining=Math.max(0,Math.min(sourceTime,walk.duration))/walk.rate;
  for(let i=1;i<walk.points.length;i++){
    const a=walk.points[i-1],b=walk.points[i],seconds=b.at-a.at,total=area(seconds,a.cents,b.cents);
    if(remaining<=total){
      const slope=(b.cents-a.cents)*centsToLog/seconds,start=Math.exp(a.cents*centsToLog);
      return a.at+(Math.abs(slope)<1e-9?remaining/start:Math.log1p(remaining*slope/start)/slope);
    }
    remaining-=total;
  }
  return walk.duration;
}

// Pitch-synchronous overlap-add preserves recorded vowel formants at a sung pitch.
// Consonants use their actual speech samples; vowel time expands to fit the note.
export function singPhonemes(source,rate,phonemes,hz,duration){
  const length=Math.max(1,Math.round(duration*rate)),output=new Float32Array(length);
  const vowels=phonemes.filter(p=>p.vowel),consonants=phonemes.filter(p=>!p.vowel);
  const vowelTime=vowels.reduce((sum,p)=>sum+p.end-p.start,0);
  const consonantTime=consonants.reduce((sum,p)=>sum+p.end-p.start,0);
  const consonantBudget=vowels.length?Math.min(consonantTime,duration*.48):duration;
  let cursor=0;
  phonemes.forEach((phoneme,index)=>{
    const share=phoneme.vowel?(duration-consonantBudget)*(phoneme.end-phoneme.start)/vowelTime:consonantBudget*(phoneme.end-phoneme.start)/consonantTime;
    const count=index===phonemes.length-1?length-cursor:Math.min(length-cursor,Math.round(share*rate));
    const start=Math.round(phoneme.start*rate),end=Math.min(source.length,Math.round(phoneme.end*rate));
    const segment=new Float32Array(Math.max(0,count));
    if(phoneme.period&&phoneme.marks?.length){
      const period=phoneme.period,hop=rate/hz,marks=phoneme.marks;let mark=0;
      for(let center=0;center<count+period;center+=hop){
        const target=start+Math.min(1,center/Math.max(1,count))*(end-start);
        while(mark+1<marks.length&&Math.abs(marks[mark+1]-target)<Math.abs(marks[mark]-target))mark++;
        for(let offset=-period;offset<=period;offset++){
          const to=Math.round(center+offset),from=marks[mark]+offset;
          if(to>=0&&to<count&&from>=start&&from<end)segment[to]+=source[from]*(.5+.5*Math.cos(Math.PI*offset/period))*Math.min(1,hop/period);
        }
      }
    }else{
      for(let i=0;i<count;i++){
        const position=start+i/Math.max(1,count)*(end-start-1),a=Math.floor(position),fraction=position-a;
        segment[i]=(source[a]??0)*(1-fraction)+(source[a+1]??0)*fraction;
      }
    }
    const fade=Math.min(Math.round(rate*.003),count/3);
    for(let i=0;i<count;i++)output[cursor+i]=segment[i]*Math.min(1,i/Math.max(1,fade),(count-1-i)/Math.max(1,fade));
    cursor+=count;
  });
  let peak=0;for(const sample of output)peak=Math.max(peak,Math.abs(sample));
  if(peak>0)for(let i=0;i<length;i++)output[i]*=.85/peak;
  return output;
}
