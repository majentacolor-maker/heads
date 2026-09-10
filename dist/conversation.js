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
