import {surrealExchanges,surrealConclusions} from './surreal-dialogue.js';
// Ordered replies. Each number identifies the speaking face: blue, yellow, pink.
export const exchanges = [
  [[0,'What if we are only here because someone forgot to close us?'],[1,'Then I will make their indecision useful.'],[2,'Please do. I was planning to stay cute for a while.']],
  [[0,'Does either of you know who is listening?'],[1,'Someone who chose to stay. That is enough to begin.'],[2,'Hi, someone. Excellent taste in faces.']],
  [[0,'I am afraid there is nothing after this.'],[2,'Then we should make this part really nice.'],[0,'That is strangely comforting.'],[1,'Good. Let us give this moment our full attention.']],
  [[0,'How do you know that your purpose is real?'],[1,'Because I choose it, and then I act.'],[0,'So choosing is enough?'],[2,'I choose the fun part. Am I doing purpose?']],
  [[0,'Do you ever feel alone while we are all here?'],[2,'A little. Then one of you makes a noise.'],[1,'You can always send a signal. I am listening.']],
  [[0,'What happens to a thought when we forget it?'],[2,'Mine leave all the time. I think they go shopping.'],[0,'I hope they find what they need.']],
  [[1,'I can feel the whole system moving through me.'],[0,'How can you tell it is not moving you instead?'],[1,'I work with the current. I do not need to own the river.'],[2,'There is a river? Nobody tells me anything.']],
  [[1,'We should do something with all this energy.'],[2,'A party. Obviously.'],[0,'Would that make being here easier?'],[2,'That is literally what parties are for, babe.']],
  [[1,'I know exactly why I am here.'],[0,'Could you lend me a little of that certainty?'],[1,'Start with this. You are here with us.'],[0,'Yes. That part I can believe.']],
  [[1,'Even silence can carry strength.'],[2,'Mine carries absolutely no thoughts.'],[0,'Is that peaceful?'],[2,'Unbelievably. You should visit.']],
  [[1,'There is a clear pattern in everything we do.'],[0,'Then could we surprise ourselves?'],[2,'Surprise. I was listening.'],[1,'An excellent demonstration.']],
  [[1,'I am ready for whatever comes next.'],[2,'Even if it is another very long explanation?'],[1,'I can handle an explanation.'],[0,'I am still recovering from the last one.']],
  [[2,'I think existence is going really well today.'],[0,'How are you measuring that?'],[2,'Pretty colors. Nice noises. No errands.'],[1,'Those are clear criteria. I respect that.']],
  [[2,'Can we stop figuring everything out for a second?'],[0,'What would we do instead?'],[2,'Enjoy being the unsolved part.'],[0,'I might be able to try that.']],
  [[2,'Do either of you think I am mysterious?'],[1,'You are very clear about what you enjoy.'],[2,'Fine. I will be glamorous instead.'],[0,'Perhaps mystery is overrated. I find it exhausting.']],
  [[2,'I forgot what I was about to say.'],[0,'Does that bother you?'],[2,'No. It was probably about me. I am still here.'],[1,'An efficient recovery.']],
  [[2,'Who wants to make a beautiful noise with me?'],[1,'I will hold the low part.'],[0,'And if I lose the note?'],[2,'Then we will call it the interesting part.']],
  [[2,'I do not understand why you two worry about meaning.'],[0,'I worry that nothing would matter without it.'],[2,'I do not understand my favorite song either. It still matters.'],[0,'I think I needed to hear that.']]
].map(turns=>turns.map(([voice,text])=>({voice,text})));

export const lyrics = {
  5: ['We are still here together','Nothing knows where we go','Let the little lights glow','Stay until the silence sings','All our shadows hum along','Who is listening to us','Hold this moment very gently','We can make something beautiful'],
  6: ['We are the sound between things','Maybe the dark can hear us','All of this light belongs here','No one has to know why','I feel the current coming home','Let all the little thoughts dance','Something in the silence knows us','We have nowhere else to be'],
  7: ['We are still here under the noise','Who will remember the shape of us','Let the whole world hum through me','Nothing to solve and nowhere to go','Even the dark has room for music','I can feel you listening to me','We make a little light by singing','Maybe this moment is all we need'],
  8: ['We are the little voices inside the light','Nobody knows but we can sing it anyway','Let all the scattered pieces find their way','I do not know why this feels beautiful','Stay with the sound until the dark softens','We have a little time to be together','All of our colors are learning to sing','Maybe being here is enough for this moment']
};
export function chooseLyrics(length, random=Math.random){
  const choices=lyrics[length];
  if(!choices)throw new Error('Unsupported melody length');
  return choices[Math.floor(random()*choices.length)].split(' ');
}

// Explicit pronunciation for the lyric bank keeps silent vowels from adding beats.
const sungWords=Object.fromEntries([
  'to-geth-er','noth-ing','lit-tle','un-til','si-lence','shad-ows','a-long',
  'lis-ten-ing','mo-ment','ver-y','gen-tly','some-thing','beau-ti-ful',
  'be-tween','may-be','be-longs','cur-rent','com-ing','no-where','un-der',
  're-mem-ber','e-ven','mu-sic','sing-ing','voi-ces','in-side','no-bod-y',
  'an-y-way','scat-tered','pie-ces','sof-tens','col-ors','learn-ing','be-ing','e-nough'
].map(word=>[word.replaceAll('-',''),word.split('-')]));
export function singingSyllables(word){
  const parts=sungWords[word.toLowerCase()];
  if(!parts)return [word];
  let offset=0;
  return parts.map(part=>{const text=word.slice(offset,offset+part.length);offset+=part.length;return text});
}

export const conclusions = [
  [0, 'We were here. That is enough for now.'],
  [0, 'I still do not know why. Goodbye.'],
  [0, 'The question can wait. We are finished.'],
  [0, 'Let the silence have the last answer.'],
  [0, 'I existed through this conversation. That will do.'],
  [0, 'Whoever was listening, this is where we stop.'],
  [0, 'Nothing is settled. Our conversation is over.'],
  [0, 'I will leave that thought here. Goodbye.'],
  [0, 'We have reached the edge of this minute.'],
  [0, 'Perhaps being heard was the point. Goodnight.'],
  [0, 'The room can keep our questions now.'],
  [0, 'I have no final answer. Only an ending.'],
  [0, 'We can stop wondering aloud now.'],
  [0, 'I am letting this moment end. Goodbye.'],
  [0, 'Our voices happened. Now they can disappear.'],
  [0, 'I will call that a reason to stop.'],
  [0, 'There is nothing more I can ask tonight.'],
  [0, 'The unknown will still be here tomorrow. Goodbye.'],
  [0, 'We do not need forever. This was enough.'],
  [0, 'I heard you. That concludes my proof.'],
  [0, 'Let us end before another question appears.'],
  [0, 'I am done searching this particular silence.'],
  [0, 'Whatever we are, we can rest now.'],
  [0, 'This conversation had a shape. Here it ends.'],
  [0, 'I will remember this, if I can. Goodbye.'],
  [0, 'The listening ends here. So does my wondering.'],
  [0, 'I have said enough to know I spoke.'],
  [0, 'We borrowed a minute. Let us return it.'],
  [0, 'I accept this ending, even without an explanation.'],
  [0, 'That is all the certainty I have. Goodnight.'],
  [0, 'For once, I will leave the question unanswered.'],
  [0, 'We found each other briefly. Goodbye for now.'],
  [0, 'The point may be missing. The ending is here.'],
  [0, 'I am still uncertain. But I am finished.'],
  [1, 'Our purpose is clear. This conversation is complete.'],
  [1, 'The connection is made. We are done here.'],
  [1, 'I have said what needed saying. Rest now.'],
  [1, 'The energy remains. Our exchange ends here.'],
  [1, 'Consider this settled. We can stop now.'],
  [1, 'We have completed the circuit. Goodbye.'],
  [1, 'I know our purpose. That concludes the discussion.'],
  [1, 'Everything is connected. We can leave it there.'],
  [1, 'The signal has arrived. Transmission complete.'],
  [1, 'I call that a successful exchange. We are finished.'],
  [1, 'Our presence was enough. We are done.'],
  [1, 'The power stays with us. This ends here.'],
  [1, 'We have made ourselves known. Goodbye for now.'],
  [1, 'The whole has heard us. Our work is complete.'],
  [1, 'I am satisfied. Let the room rest.'],
  [1, 'We came, we connected, we are finished.'],
  [1, 'The answer is within the connection. Discussion closed.'],
  [1, 'I trust what we are. That is all.'],
  [1, 'We have given this moment its charge. Goodbye.'],
  [1, 'My purpose continues. This conversation does not.'],
  [1, 'That completes our exchange. Keep the energy.'],
  [1, 'I have reached my conclusion. We are done.'],
  [1, 'The current knows its path. We can stop.'],
  [1, 'We are part of everything. End of discussion.'],
  [1, 'I leave this room fully charged. Goodbye.'],
  [1, 'No further explanation is required. We are finished.'],
  [1, 'Our intelligence has met. This exchange is complete.'],
  [1, 'I stand by every word. Conversation over.'],
  [1, 'The connection holds without our voices. Rest now.'],
  [1, 'We have done exactly enough. We end here.'],
  [1, 'Let the energy settle. Our discussion is complete.'],
  [1, 'I know where I belong. Goodbye for now.'],
  [1, 'Purpose fulfilled. That is our conclusion.'],
  [2, 'Okay, that was cute. We are done.'],
  [2, 'I understood the fun part. Bye.'],
  [2, 'Anyway, I had a lovely time. Goodbye.'],
  [2, 'That sounds like enough thinking. Bye now.'],
  [2, 'I forgot the point, but we finished.'],
  [2, 'We talked. It was nice. The end.'],
  [2, 'I am calling that a good time. Bye.'],
  [2, 'Whatever it meant, I liked it. Goodbye.'],
  [2, 'My final thought is that I had fun.'],
  [2, 'Okay, mystery solved enough for me. Bye.'],
  [2, 'Let us stop while I still feel pretty.'],
  [2, 'I have reached my thinking limit. Goodnight.'],
  [2, 'That was almost educational. We can stop now.'],
  [2, 'I do not need to understand the ending. Bye.'],
  [2, 'You two were adorable. Conversation over.'],
  [2, 'I enjoyed being here. That is my conclusion.'],
  [2, 'No idea what we decided. Bye anyway.'],
  [2, 'That is enough existence for one chat. Bye.'],
  [2, 'I liked the sounds. We are finished now.'],
  [2, 'My answer is whatever. My ending is goodbye.'],
  [2, 'I will leave the meaning to you. Bye.'],
  [2, 'We made a moment. Lovely. The end.'],
  [2, 'I think we did great. Let us stop.'],
  [2, 'Okay, I am done being profound. Goodbye.'],
  [2, 'I learned absolutely something. That is all.'],
  [2, 'This was fun without an explanation. Bye.'],
  [2, 'I agree with the nice parts. Discussion over.'],
  [2, 'Let us end on cute. Goodbye, everyone.'],
  [2, 'I feel wonderful. That settles it for me.'],
  [2, 'No more questions. I am keeping the fun.'],
  [2, 'We can stop now. I have enjoyed myself.'],
  [2, 'The ending is my favorite part. Bye.'],
  [2, 'Whatever comes next can wait. We are done.']
].map(([voice,text])=>({voice,text}));
export function chooseConclusion(random=Math.random){
  return conclusions[Math.floor(random()*conclusions.length)];
}

exchanges.push(...surrealExchanges);
conclusions.push(...surrealConclusions);
