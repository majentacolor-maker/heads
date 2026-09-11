// Random ties; otherwise favor unused items, then the least recently used.
export function createVariety(){
  const counts=new Map(),recent=new Map();let clock=0;
  return {
    record(keys){for(const key of new Set(keys)){counts.set(key,(counts.get(key)??0)+1);recent.set(key,++clock)}},
    pick(items,keyFor=String,random=Math.random){
      if(!items.length)throw new Error('No eligible choices');
      let bestCount=Infinity,bestRecent=Infinity,choices=[];
      for(const item of items){
        const raw=keyFor(item),keys=Array.isArray(raw)?raw:[raw];
        const count=keys.reduce((sum,key)=>sum+(counts.get(key)??0),0);
        const last=Math.max(0,...keys.map(key=>recent.get(key)??0));
        if(count<bestCount||(count===bestCount&&last<bestRecent)){bestCount=count;bestRecent=last;choices=[item]}
        else if(count===bestCount&&last===bestRecent)choices.push(item);
      }
      return choices[Math.floor(random()*choices.length)];
    }
  };
}
export const lineKeys=text=>['line:'+text,'idea:'+(text.match(/^[^.!?]+[.!?]?/)?.[0]??text)];
export const openingVoice=(cast,history,random=Math.random)=>history.pick(cast,voice=>'voice:'+voice,random);
