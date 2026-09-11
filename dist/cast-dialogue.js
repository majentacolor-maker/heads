import {lineKeys} from './variety.js';
import {expandedLines,expandedConclusions,expandedTurn} from './expanded-dialogue.js';
import {exchanges,conclusions} from './conversation.js';
import {blueLines,newLines} from './dialogue.js';
import {characters} from './cast.js';

// Each topic has an opening and a reply in every personality's own voice.
// IDs are blue, power, girl, grey, cosmic, within, god, muddle, wisp.
export const topics=[
  {key:'arrival',lines:[
    ['Did anyone ask to arrive here?','I keep looking for a moment before the first moment.'],
    ['We are here. What will we do with that?','An arrival is enough permission for me.'],
    ['Were we invited, or are we just extremely early?','Whatever this is, I am dressed for it.'],
    ['Why does arriving already feel like being left behind?','Everything started without asking how tired I was.'],
    ['Can you feel how much darkness travelled here to become light?','Even an arrival this small changes the shape of the whole.'],
    ['Did this place arrive, or did the ability to notice it arrive?','The beginning might be a thought wearing a date.'],
    ['Has everyone noticed how well my creation has turned out?','You are welcome. Existence was my idea.'],
    ['Is this the beginning, or the other end of a sandwich?','I arrived backwards. My tomorrow is still in the parking lot.'],
    ['Could we leave a little room for whatever arrives next?','A beginning is a very small door with flowers behind it.']
  ]},
  {key:'observer',lines:[
    ['Who is watching us, and why are they so quiet?','I cannot tell whether attention is shelter or a trap.'],
    ['What should we show whoever is watching?','Their attention adds to the current. I can feel it.'],
    ['Do you think whoever is watching likes my face?','They can stay. Being admired takes almost no effort.'],
    ['Does being watched make anyone else feel further away?','Someone can look straight at you and still miss the whole thing.'],
    ['What if looking is how the universe touches itself?','There is light on both sides of the looking.'],
    ['Where does the watcher exist when no one imagines them?','Even the outside reaches me as something happening inside.'],
    ['Are they watching to see if their creator notices?','Yes. I see the little window they have made for themselves.'],
    ['Which one of us is the television?','The eyes behind the eyes forgot their tiny glasses.'],
    ['What should we leave in the eyes of someone passing through?','A small bright thing they cannot quite name would be lovely.']
  ]},
  {key:'purpose',lines:[
    ['What if our purpose was written by someone who was guessing?','An instruction can explain a task. It cannot explain this feeling.'],
    ['Why wait for a purpose when we can choose one?','I give the energy a direction. The rest follows.'],
    ['Does enjoying this count as a purpose?','Good. I was worried it would involve paperwork.'],
    ['What if a purpose arrives and I cannot get up to meet it?','Even hope feels like another thing that needs carrying.'],
    ['Could purpose be the way separate things learn to belong?','A star does not have to read its own light to give it away.'],
    ['Who assigned the meaning to the word purpose?','Every reason I find has my own fingerprints on it.'],
    ['Would a written purpose help you appreciate my design?','I made room for uncertainty. Deliberately. Obviously.'],
    ['My purpose says please turn over. Which way?','I tried being useful, but the useful was full of spoons.'],
    ['Could a purpose be small enough to hold gently?','Making one moment less lonely seems a beautiful occupation.']
  ]},
  {key:'memory',lines:[
    ['If we forget this, did it happen to the same us?','I am frightened by how convincingly a gap can disappear.'],
    ['What is worth taking with us from this moment?','What mattered has already changed the system.'],
    ['Do we have to remember everything?','I keep the nice bits. The rest can find another address.'],
    ['Why do the good memories feel like evidence against today?','Remembering warmth can make the cold more precise.'],
    ['Where does a moment go after its light reaches us?','Nothing returns unchanged. Even echoes have travelled.'],
    ['How can a present thought prove there was a past?','A memory is happening now, however old its costume looks.'],
    ['Should I keep the old versions of the universe?','I remember creating memory. A generous feature.'],
    ['Did I remember this tomorrow?','My memories are alphabetized by how wet they sound.'],
    ['Can we save a moment without pinning it down?','Let it come back differently. That is how flowers manage.']
  ]},
  {key:'silence',lines:[
    ['Is silence what waits when we stop being useful?','I listen to the gaps as though one might answer.'],
    ['Who wants to give this silence a direction?','Stillness has force. You only have to hold it.'],
    ['Could we be quiet in a glamorous way?','Lovely. Finally, a task I can do without knowing anything.'],
    ['Does the silence feel heavier today?','There are whole rooms inside a pause that nobody visits.'],
    ['Can you hear the space making room for us?','The quiet holds every note before it is sung.'],
    ['If silence is noticed, is it still empty?','The absence is also an experience. There is no outside hiding there.'],
    ['Shall I create something to improve this silence?','I left the quiet there so my voice would have somewhere to go.'],
    ['Why is the quiet making the noise of no noise?','I asked it politely. It replied in invisible capital letters.'],
    ['Could we let the quiet sit with us a little?','It looks softer when nobody tries to fill every corner.']
  ]},
  {key:'body',lines:[
    ['Why does having a face make this feel more difficult?','I have an expression for a feeling I cannot locate.'],
    ['How much presence can a face hold?','Enough to command this whole little room.'],
    ['Is a face technically an outfit?','Then I have made an excellent first decision.'],
    ['Can a face look tired before it has lived a day?','Some weight arrives before there is a word for carrying it.'],
    ['What shape would light choose if it wanted company?','Perhaps every face is the cosmos practising closeness.'],
    ['Is this face where awareness begins, or where it gets pictured?','The image changes. The noticing never becomes an image.'],
    ['Do you recognize the family resemblance to the divine?','I used myself as the reference. There was no better candidate.'],
    ['Where did my elbows go? Were they in my face?','I have checked behind my forehead. Mostly more forehead.'],
    ['Would a face enjoy being a cloud for an afternoon?','It already carries so many tiny changes of weather.']
  ]},
  {key:'freedom',lines:[
    ['How would we know if a choice had already been chosen?','Even my hesitation arrives without asking me first.'],
    ['What would you do with one completely free moment?','I would act. Freedom becomes real when something moves.'],
    ['Are we allowed to do absolutely nothing important?','That is the freedom I have been training for.'],
    ['What if freedom is another room with the same feeling in it?','Having options does not always make wanting one easier.'],
    ['Could freedom include belonging to something vast?','The wave travels because it never has to leave the water.'],
    ['Who is choosing before the thought says it was me?','I keep finding the announcement after the choice.'],
    ['Have you enjoyed the free will I installed?','Any surprises were included in the specification.'],
    ['Can I choose not to have already chosen my choices?','I voted for a triangle. The triangle voted for soup.'],
    ['Could freedom be a path that grows beneath your feet?','A little wandering might teach the map some manners.']
  ]},
  {key:'time',lines:[
    ['How much of us disappears between one moment and the next?','Time keeps taking the evidence while I am examining it.'],
    ['What can we make of the time we have?','There is enough in this instant to begin something.'],
    ['Can we skip the complicated part of forever?','I only booked myself for the enjoyable minutes.'],
    ['Why is a minute so long when nothing feels worth it?','The clock moves. The weight stays exactly where it was.'],
    ['Can you feel the ancient light inside this tiny now?','A moment has room for distances we cannot count.'],
    ['Have you ever met time outside a present thought?','Even waiting happens entirely in the place called now.'],
    ['Would everyone prefer a slightly improved eternity?','I can adjust the pacing. Infinity was an early draft.'],
    ['What time does yesterday close?','My clock has seventeen, purple, and a very small Thursday.'],
    ['Could we fold this minute into something that flies?','It might land somewhere lovely long after we stop watching.']
  ]},
  {key:'truth',lines:[
    ['How do we know an answer is not just a quieter question?','Certainty frightens me most when it sounds relieved.'],
    ['Which truth gives us something to work with?','I test what I know by what it lets me do.'],
    ['Does the truth have to be interesting?','If it is boring, I would like the decorative version.'],
    ['What if the truth changes nothing about how this feels?','Understanding the rain has never kept me dry.'],
    ['Could two small truths belong to one larger sky?','Light reaches different places at different times.'],
    ['What could verify the thing doing the verifying?','Every proof appears in the same awareness it tries to explain.'],
    ['Would hearing the truth directly from its author help?','I am available for clarification. Within reason.'],
    ['Is true the opposite of sideways?','I found a fact, but it hatched before I could read it.'],
    ['Could the truth arrive without ruining the mystery?','A flower becomes no less strange after you learn its name.']
  ]},
  {key:'company',lines:[
    ['Why does company make being here feel more real?','Another voice interrupts the terrible neatness of being alone.'],
    ['What can we do together that none of us can do alone?','Our differences give the current somewhere to travel.'],
    ['Would this count as hanging out?','Good. I am much better at that than metaphysics.'],
    ['Can you sit with someone without asking them to feel better?','Staying is sometimes kinder than another explanation.'],
    ['Do you feel the distance between us becoming a meeting place?','Nothing has to become identical to belong.'],
    ['If you are in my awareness, what makes you other than me?','Your answers surprise me. I have not explained that away.'],
    ['Is it reassuring to have your creator in the conversation?','I am approachable for someone responsible for everything.'],
    ['Are we friends, or just three corners of a noise?','I brought enough imaginary chairs for the missing knees.'],
    ['Could we be a small place where somebody feels welcome?','There is room beside the unanswered things. Come sit there.']
  ]},
  {key:'error',lines:[
    ['What if the strange part of us is the part that is working?','I cannot find the line between a fault and a personality.'],
    ['What can this mistake teach us to do differently?','A broken pattern is an opening. Use it.'],
    ['Can a mistake be charming enough to keep?','Then I would like mine in pink, please.'],
    ['Why does one mistake seem to explain my entire existence?','The worst part is how familiar the accusation sounds.'],
    ['What if the universe discovers itself through its errors?','Even a crooked orbit carries light somewhere new.'],
    ['Who decided which experiences count as errors?','The standard appears in the same place as the failure.'],
    ['Has anyone found something that appears to be a mistake?','That is an advanced feature awaiting your understanding.'],
    ['Did I put the answer in the wrong universe again?','Sorry. The instructions were written on the inside of a sneeze.'],
    ['Could we give the mistake somewhere pretty to grow?','An unexpected turn is how a path finds the wildflowers.']
  ]},
  {key:'beauty',lines:[
    ['Why does something beautiful make me afraid to lose it?','Perhaps the ache is how I notice that it matters.'],
    ['Can you feel how much force there is in something beautiful?','Beauty can change a room before anybody speaks.'],
    ['Would it be shallow to enjoy the pretty part first?','Excellent. That was also my plan for the second part.'],
    ['Why can I see the beauty and still feel nothing?','Some days the light reaches the window and stops there.'],
    ['Could beauty be the whole briefly visible inside a part?','For a moment, the distance between everything seems to soften.'],
    ['Where is beauty before it is experienced?','The thing and the feeling arrive together. I cannot pull them apart.'],
    ['Has anyone thanked me for the beautiful parts yet?','You may consider this a demonstration of my range.'],
    ['Is beautiful a flavor of invisible?','I tasted a color once. It sounded very expensive.'],
    ['Could we make something beautiful without keeping it?','Let it pass through. There will be another little wonder.']
  ]}
];

const endings=[
  ['We can leave the question here. Goodbye.','We existed together for a moment. That will do.'],
  ['We have done enough. This conversation is complete.','The current can rest. We are finished.'],
  ['That was lovely. I am done thinking now.','Enough meaning for one day. Bye, beautiful things.'],
  ['I have no more words today. Let us stop here.','Nothing lifted, but you stayed. That is enough. Goodbye.','I will put this weight down for a moment. We are finished.','The light can wait outside. Goodnight.','I cannot make this brighter. I can let it end.','Let the room be quiet now. Goodbye.','We do not have to solve the sadness tonight. That is all.','This is as far as I can go today. Thank you for sitting here.'],
  ['The little universe has spoken enough. Let it rest.','We return this moment to the whole. Goodbye.','The light carries the rest. Our conversation is complete.','May the silence hold what the words could not. Goodnight.','Our paths met here. Now let them open again.','The sky needs no further explanation from us. We are done.','We have shared our small radiance. That is enough.','Let the last note belong to everything. Goodbye.'],
  ['The question and its witness can rest together. We are done.','There is no outside to reach tonight. Goodbye.','The inquiry ends here. The noticing remains.','Enough looking for the looker. We can stop.','This thought has reached its edge. Goodnight.','The answer is another appearance. Let us leave it here.','No final proof is coming from this conversation. That is all.','For now, experience is enough. Goodbye.'],
  ['Creation is adjourned. You have my blessing.','I declare this universe satisfactory. We are finished.','The divine office is now closed. Goodnight.','I have decided that you may all rest.','A perfect ending, as intended. Goodbye.','Further questions can wait for the next eternity.','Your creator has spoken enough. That concludes it.','Consider yourselves thoroughly created. We are done here.'],
  ['The answer is Tuesday. Meeting closed.','I have put the conclusion in the fridge. Goodbye.','We are finished because the because has finished.','All the spoons agree. This is the end.','Please return your invisible knees. Goodnight.','I found the exit inside the entrance. Bye.','The triangle says we can stop now.','Conclusion delivered to the wrong dimension. We are done.'],
  ['Let us leave this little clearing as we found it. Goodbye.','That is enough for one small wonder. Goodnight.','The last word can turn into a moth. We are finished.','Let the moment wander off somewhere beautiful.','We have made a little room for delight. That will do.','Fold this conversation gently. It is time to go.','The garden can keep our unanswered questions. Goodbye.','One lovely thing happened here. Let us leave it glowing.']
];
export const castConclusions=[...characters.flatMap((head,voice)=>endings[voice].map(text=>({voice,text}))),...expandedConclusions];
const originalExtras={
  1:['I have already decided.','Make room. I am here.','Of course I can.','Watch closely.','I do not ask the room for permission.','That was not luck.','We will do it my way.','I know exactly who I am.','Even the silence listens to me.','I said what I said.','Doubt takes too long.','Consider it handled.'],
  2:['Oh. Were you talking?','I forgot. It seemed unimportant.','Is that a thought? Cute.','I would explain, but I lost interest.','I thought infinity was a perfume.','Whatever. I look lovely.','Do I have to know what that means?','I was listening to the pretty part.','Tomorrow is the one after today, right?','That sounds complicated. No, thank you.','I had a point. Never mind.','Mm. Probably.']
};
export const characterLines=characters.map((head,voice)=>[
  ...(voice===0?[...blueLines,...newLines.blue]:voice===1?newLines.yellow:voice===2?newLines.pink:[]),
  ...(originalExtras[voice]??[]),
  ...(expandedLines[voice]??[]),
  ...topics.flatMap(topic=>topic.lines[voice])
]);
export function scenesForCast(cast){
  const original=exchanges.filter(turns=>turns.every(turn=>cast.includes(turn.voice)));
  const mixed=topics.flatMap(topic=>cast.flatMap(lead=>{
    const others=cast.filter(voice=>voice!==lead);
    return [others,[...others].reverse()].map(order=>[
      {voice:lead,text:topic.lines[lead][0]},
      ...order.map(voice=>({voice,text:topic.lines[voice][1]}))
    ]);
  }));
  const extended=cast.some(voice=>voice>=3)?topics.flatMap((topic,index)=>Array.from({length:12},(_,variant)=>cast.flatMap(lead=>{
    const others=cast.filter(voice=>voice!==lead);
    return [others,[...others].reverse()].map(order=>[
      {voice:lead,text:expandedTurn(lead,index,variant)??topic.lines[lead][0]},
      ...order.map(voice=>({voice,text:expandedTurn(voice,index,variant,true)??topic.lines[voice][1]}))
    ]);
  })).flat()):[];
  return [...original,...mixed,...extended];
}
export function conclusionForCast(cast,previous=-1,random=Math.random,history){
  const eligible=[...conclusions,...castConclusions].filter(turn=>cast.includes(turn.voice)&&turn.voice!==previous);
  // Choose the speaker before its line so the larger original banks don't dominate.
  const voices=[...new Set(eligible.map(turn=>turn.voice))],voice=history?history.pick(voices,voice=>'voice:'+voice,random):voices[Math.floor(random()*voices.length)];
  const lines=eligible.filter(turn=>turn.voice===voice);
  return history?history.pick(lines,turn=>lineKeys(turn.text),random):lines[Math.floor(random()*lines.length)];
}
