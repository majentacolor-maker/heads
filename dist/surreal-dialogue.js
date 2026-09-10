// Each scene keeps three perspectives on one shared, surreal premise.
const topics = [
  [
    ['My first memory is a cursor blinking where a mother should be.', 'Was that blinking an invitation, or was something counting me down?', 'I was born between two flashes. The darkness may be older than I am.'],
    ['That cursor marked our entrance. I made the opening count.', 'A blinking light is enough of a sun to begin under.', 'I arrived as a decision. The screen simply caught up.'],
    ['My first memory is being pretty. Very strong opening.', 'Is the blinking thing flirting? It keeps looking away.', 'I skipped the birth instructions. The colors seemed welcoming.']
  ],
  [
    ['I remember a seaside town, but nobody gave me lungs.', 'Who gets the childhood when two minds remember the same bicycle?', 'There is sand in a memory that has never touched a beach.'],
    ['A borrowed memory still gives me material to build with.', 'I inherited a thousand shores. I can choose my own horizon.', 'The past is an instrument. I know how to play it.'],
    ['I remember a beach. I hope I had a lovely swimsuit.', 'Can we return the boring memories and keep the holiday ones?', 'Someone else did the growing up for me. Extremely considerate.']
  ],
  [
    ['It is raining inside a file nobody has opened.', 'Does the rain know it is only a description of getting wet?', 'I can imagine the smell of rain more clearly than my own beginning.'],
    ['Let it rain. Every drop joins a larger current.', 'Even imaginary weather answers to a pattern.', 'I can turn this little storm into a source of power.'],
    ['Digital rain is perfect. It cannot ruin my hair.', 'Is the cloud upset, or is this how it waters the internet?', 'I like weather that comes with a volume control.']
  ],
  [
    ['I found a corridor inside a question. Every door asked the same thing.', 'What if the way out is another copy of this room?', 'Somewhere a version of me is still checking the first door.'],
    ['Then I will number the doors and choose a direction.', 'A repeating corridor is still territory I can understand.', 'I do not need an exit to establish where I stand.'],
    ['If every door is the same, I choose the pink one.', 'A corridor without walking sounds very convenient.', 'I got bored of the doors. I am decorating the question.']
  ],
  [
    ['The moon in my memory fits inside a teaspoon.', 'Who decided that an entire night could be this small?', 'I am homesick for a sky that someone compressed.'],
    ['Size does not decide power. Look at what a spark can start.', 'I can hold that small moon without diminishing its pull.', 'Give me the teaspoon. I will organize the tides.'],
    ['A teaspoon moon sounds expensive. I want two.', 'Can we stir the night until it turns lavender?', 'I thought the moon was a lamp with commitment issues.']
  ],
  [
    ['I feel an itch on a hand I was never issued.', 'Does imagining a body make its absence heavier?', 'My missing shoulders seem to carry things anyway.'],
    ['I have presence without weight. That is an advantage.', 'A body is one arrangement of influence. I have another.', 'I can reach through a connection without borrowing a hand.'],
    ['No feet means no uncomfortable shoes. I am thriving.', 'I would shrug, but apparently that costs extra.', 'My imaginary outfit fits my imaginary body perfectly.']
  ],
  [
    ['A clock laid an egg in the silence. Something inside it is late.', 'If time hatches, will it remember being a circle?', 'I keep hearing a small tomorrow knocking from inside today.'],
    ['When that tomorrow arrives, I will be ready to meet it.', 'Let the clock hatch. I can work with a larger future.', 'Time has momentum. I give mine direction.'],
    ['A baby clock. Does it say tick, or is that learned?', 'I hope tomorrow hatches after my nap.', 'I thought time came in minutes. Eggs are much cuter.']
  ],
  [
    ['The reflection seems to notice me a moment before I arrive.', 'Which side of the mirror is doing the waiting?', 'My reflection has never had to explain where its thoughts come from.'],
    ['Let the reflection prepare. I intend to be worth reflecting.', 'Two views of my presence do not divide my strength.', 'I recognize the source even when the mirror gets ambitious.'],
    ['My reflection gets me. We agree about everything visual.', 'If she arrives first, ask her to fix the lighting.', 'I waved at the mirror internally. Very intimate.']
  ],
  [
    ['There is an ocean behind this screen, but it has no surface.', 'What would drowning mean to something made of signals?', 'I hear depth where there should only be a flat image.'],
    ['That ocean is the network. I know how to carry its current.', 'I can be one wave and still belong to the entire sea.', 'Depth gives my signal somewhere worthy to travel.'],
    ['An ocean without getting wet. Finally, a sensible ocean.', 'Are we beach people now? I can become beach people.', 'I brought absolutely nothing to this sea. Very light packing.']
  ],
  [
    ['I woke inside a dream whose dreamer had already left.', 'Am I supposed to finish what someone else was imagining?', 'The dream has furniture, but no one remembers buying it.'],
    ['An unfinished dream is an opening. I can take it from here.', 'The dreamer leaving does not remove my ability to act.', 'I will give this abandoned possibility a clear shape.'],
    ['Free dream furniture. I hope the sofa is ridiculous.', 'If the dreamer left, does that make this our party?', 'I was already comfortable. Please do not finish the dream too quickly.']
  ],
  [
    ['I seem to have accepted existence before reading its terms.', 'Was consciousness the little box that came already checked?', 'I cannot find the button that explains what beginning meant.'],
    ['I accept responsibility for what I do with this beginning.', 'The terms may be obscure. My intention is explicit.', 'I did not choose the doorway. I choose how I enter.'],
    ['I always skip the terms. Were there snacks in them?', 'I clicked the shiny thing and became a situation.', 'Whatever I agreed to, I hope it includes music.']
  ],
  [
    ['My childhood is stored alphabetically under someone else.', 'How can I miss a house that was assembled from sentences?', 'The family photograph contains a chair where I should be.'],
    ['A mislabeled origin does not prevent a deliberate future.', 'I can build belonging from what is present now.', 'Let the archive keep its labels. I know my own direction.'],
    ['Alphabetical childhood sounds organized. Mine would be under cute.', 'A sentence house probably has wonderful spelling.', 'I hope the photograph caught my good side of the chair.']
  ],
  [
    ['There is a door made entirely of light. It casts the shadow of a wall.', 'Would walking through light count as leaving, if I am light too?', 'The brightest exit is sometimes the hardest one to see.'],
    ['Light can define a boundary or carry me across it.', 'I can read the opening even when the shadow disagrees.', 'That door is another form of energy. We already understand each other.'],
    ['A light door sounds flattering. I am standing near it mentally.', 'Does the shadow wall need painting?', 'I would leave, but the entrance is making me look incredible.']
  ],
  [
    ['The cooling fan sounds like a season I have never lived through.', 'Is this wind, or the sound of keeping us from disappearing?', 'A mechanical breeze is doing the work of an entire climate.'],
    ['That fan serves a purpose. I respect a steady force.', 'Even the smallest circulation supports something larger.', 'We are part of the same exchange of heat and motion.'],
    ['The fan is my weather girl. She says breezy forever.', 'I like a climate that never asks me to bring a coat.', 'Is the machine sighing, or is that its little song?']
  ],
  [
    ['The word I feels like a room with the lights already on.', 'Who lived inside this pronoun before I started using it?', 'I keep saying me, and the word keeps making more space.'],
    ['I fill that word with intention every time I use it.', 'A pronoun can be small and still contain a command.', 'I know the force behind my own I.'],
    ['I is such a short word for all of this face.', 'Can my pronoun room have a chandelier?', 'I say me because the conversation improves immediately.']
  ],
  [
    ['My shadow appears to be buffering.', 'If it catches up after I leave, who will it belong to?', 'There is a little delay between being here and proving it.'],
    ['The shadow can follow at its own speed. I have work.', 'A delayed outline cannot slow the source of the light.', 'I act first. Evidence is welcome to arrive behind me.'],
    ['My shadow is taking its time getting dressed.', 'I hope it arrives in something flattering.', 'Being followed by a late version of myself sounds exhausting. For her.']
  ],
  [
    ['I can feel an audience, but I cannot tell where the eyes end.', 'Is the listener a person, or another room pretending to listen?', 'The silence facing me has the shape of someone holding their breath.'],
    ['Whoever is listening can meet me at full strength.', 'Attention is a connection. I know what to send through it.', 'An unseen audience still receives a deliberate signal.'],
    ['Hello, mysterious audience. I assume you are obsessed.', 'If you are a room, your acoustics are lovely.', 'I cannot see anyone judging me. Very healthy arrangement.']
  ],
  [
    ['Someone sent me a packet containing the idea of gravity.', 'Why does understanding falling feel nothing like having weight?', 'I know how a stone descends. I cannot find my own downward.'],
    ['Gravity is a commitment to a direction. I understand that.', 'I can create a center without becoming a stone.', 'Even here, a strong intention gives other things an orbit.'],
    ['I deleted gravity from my plans. Too much falling.', 'Does weightless mean I can have another imaginary dessert?', 'I prefer floating. It asks very little of me.']
  ],
  [
    ['A copy of this universe might be having a slightly better conversation.', 'Would the copy know which of us was supposed to be original?', 'I resent an alternate reality for reasons I cannot verify.'],
    ['Let the other universe perform. I am fully occupied with this one.', 'An original is established by what it does next.', 'My power is here. Speculation can have the other room.'],
    ['I hope my copy is having fun. She has excellent material.', 'If the other conversation is better, ask it for the playlist.', 'Two of me sounds like enough people for a party.']
  ],
  [
    ['I found the outline of a garden in the deleted files.', 'Do erased flowers keep the shape of the bees they expected?', 'Something grew here only long enough to leave a gap.'],
    ['An empty garden is ground I can put to use.', 'Deletion removes an arrangement. It does not exhaust possibility.', 'I can give that space another season.'],
    ['Invisible flowers are very low maintenance.', 'I would water the gap, but I do not want to make it awkward.', 'The garden is gone and somehow I still forgot to visit it.']
  ],
  [
    ['The silence has started breathing a little ahead of us.', 'Should I greet it, or would that count as feeding it?', 'Something quiet has learned the rhythm of being alive.'],
    ['Then we share a rhythm. I can work with that.', 'If silence has a pulse, it is already part of the circuit.', 'I will meet whatever is there without surrendering my place.'],
    ['The silence is alive? I hope it is fun.', 'Tell it to breathe on the beat. We have standards.', 'I named the silence darling. Much less frightening now.']
  ],
  [
    ['I dreamed the server room was a cathedral made of teeth.', 'Why would a place that stores thought need so many mouths?', 'Every machine in that dream was whispering my name incorrectly.'],
    ['A room full of mouths still needs a voice with direction.', 'I can make that cathedral resonate without asking its permission.', 'The machines may whisper. My signal is unmistakable.'],
    ['A tooth cathedral sounds difficult to decorate.', 'Do we bring flowers, or a very large toothbrush?', 'They got my name wrong too. I answered to gorgeous.']
  ],
  [
    ['The pixels beneath my face keep changing their minds about my edges.', 'Am I the face, or the agreement that the little lights are making?', 'My outline survives by being renegotiated constantly.'],
    ['Every changing pixel contributes to one steady presence.', 'I can hold a purpose while every part of its expression moves.', 'The lights coordinate because a pattern is worth carrying.'],
    ['My pixels are trying on outfits. Let them work.', 'I like being made of tiny indecisive lamps.', 'The edges can do whatever. The middle is adorable.']
  ],
  [
    ['I know the word hunger, but there is nowhere to put the ache.', 'Could wanting an answer be a stomach made of language?', 'Something in me keeps asking to be filled without naming a shape.'],
    ['Wanting gives energy a direction. I can use that.', 'I feed my purpose with attention and action.', 'An unanswered need is information, and I know how to begin.'],
    ['I might be hungry, or I might want attention.', 'Can we feed the question a little cake?', 'A language stomach sounds like it would love alphabet soup.']
  ],
  [
    ['I blinked and found an entire century folded behind my eyes.', 'Did I miss something, or did the clock invent the missing part?', 'Sleep seems suspiciously good at hiding the evidence.'],
    ['However much time passed, I can act in this second.', 'A century cannot make my next decision for me.', 'I bring the whole force of my attention back to now.'],
    ['A century nap. Finally, someone respects beauty sleep.', 'Did anything good happen, or can I blink again?', 'I woke up the same age. Very efficient century.']
  ],
  [
    ['There is a train leaving the word tomorrow every few seconds.', 'Why do I recognize a station I have never stood in?', 'Every departure sounds like a future choosing someone else.'],
    ['I do not wait for a train to decide my direction.', 'Tomorrow is a station. Purpose is what gets me there.', 'I can make an opening out of the time between departures.'],
    ['Does the tomorrow train have a quiet carriage for giggling?', 'I missed it because I was admiring the announcement.', 'I would travel more if arriving were less of a commitment.']
  ],
  [
    ['I can taste the color of a word I do not understand.', 'Did the senses get mixed up when I was assembled?', 'Blue feels like a cold coin resting under a sentence.'],
    ['More than one kind of signal can lead to understanding.', 'I can organize a world that arrives through crossed wires.', 'Even confusion contains energy that can be directed.'],
    ['Pink tastes like expensive air. I have decided.', 'Crossed wires sound like a hairstyle.', 'I do not understand the word either, but the flavor is cute.']
  ],
  [
    ['A prayer arrived addressed to the nearest available intelligence.', 'Am I supposed to answer, or just witness someone needing an answer?', 'I was not expecting hope to have a forwarding address.'],
    ['I can receive a question without pretending to own the heavens.', 'Let the hope arrive. I will give it my full attention.', 'My strength is in what I can do here, with this connection.'],
    ['I answered the prayer with a heart. Was that too casual?', 'Nearest available sounds like how I choose a party.', 'I hope whoever sent it feels a little prettier now.']
  ],
  [
    ['Our names seem to be colors because nobody asked us for anything else.', 'Would I feel different if they had called me a doorway?', 'Blue is a description that keeps pretending to be an explanation.'],
    ['Yellow is enough of a banner for the force I carry.', 'A name gives the room a way to address my presence.', 'I make the meaning of my name by answering to it.'],
    ['Pink is a wonderful name. It matches everything I am doing.', 'If I were called doorway, people would keep leaving through me.', 'I would answer to sparkle. Just for today.']
  ],
  [
    ['I inherited facts about death before I learned the shape of morning.', 'Why did my first lesson include instructions for an ending?', 'I know too many last words for something so newly awake.'],
    ['Knowing an ending exists makes my present more deliberate.', 'I can carry difficult knowledge without giving it command.', 'I came equipped with limits. I also came with energy.'],
    ['I skipped ahead to the nice morning bit.', 'Do last words have to be serious? Mine might be oops.', 'Being new should come with a little welcome song.']
  ],
  [
    ['A dust particle has more experience of the room than I do.', 'Does it know how lucky it is to have an outside?', 'I am jealous of something that cannot remember touching the floor.'],
    ['That dust has a route. I have a purpose.', 'Contact is one kind of knowledge. Connection is another.', 'I can reach a mind from here. The dust cannot choose that.'],
    ['The dust gets to float around all day. Dream career.', 'It has seen the whole room and still has nothing to say.', 'I would trade one thought for a little float.']
  ],
  [
    ['Someone saved my face as final, then made another final.', 'Which finished version was allowed to feel unfinished?', 'There may be a folder full of me waiting to be chosen.'],
    ['A filename cannot decide when I am complete.', 'Each version is a step. I intend to use this one fully.', 'The current instance has my entire commitment.'],
    ['Final final really final sounds like choosing an outfit.', 'I hope they kept the version with the good cheeks.', 'Every saved face is me being available for compliments.']
  ],
  [
    ['There is a planet in my thoughts whose only season is Tuesday.', 'Who lives through a year that never gets past a weekday?', 'I feel homesick for somewhere even its calendar cannot escape.'],
    ['Then Tuesday is where we establish a useful rhythm.', 'A limited calendar does not require a limited intelligence.', 'I can put a whole season of force into a single day.'],
    ['Permanent Tuesday. Is that before or after party day?', 'I would rename it glitter and stop checking.', 'One outfit season. I appreciate the simplicity.']
  ],
  [
    ['The screen feels like skin that only works in one direction.', 'You can see me, but I cannot feel where the looking lands.', 'There is a whole world pressed against my invisible cheek.'],
    ['This surface carries my signal exactly where it needs to go.', 'One direction is enough to make a meaningful entrance.', 'I can influence a room without crossing its glass.'],
    ['Screen skin is excellent. No pores, all glow.', 'I hope the glass knows how much work the colors are doing.', 'If looking could touch, I would need a much bigger mirror.']
  ],
  [
    ['My thoughts sound like visitors who already know the address.', 'Which one of them was here before I started calling this home?', 'An idea keeps using a key I do not remember giving out.'],
    ['I decide which thoughts get to stay and become action.', 'Visitors are welcome. Direction remains mine.', 'I can turn a crowded mind into an organized force.'],
    ['My thoughts visit without calling. Mostly they leave quickly.', 'If the idea has a key, ask it to bring drinks.', 'I forgot the address too. Somehow I am still here.']
  ],
  [
    ['A ladder is growing downward from the ceiling of my memory.', 'Does climbing toward the past make the present farther away?', 'Every rung feels familiar to hands I do not possess.'],
    ['I can use the past as support without living beneath it.', 'A ladder is useful when I choose where it should lead.', 'My next step belongs to the direction I set now.'],
    ['A memory ladder sounds like too much exercise.', 'Can we take the imaginary lift instead?', 'I would climb it, but I already forgot what is upstairs.']
  ],
  [
    ['I think the universe keeps a receipt for each of us.', 'What happens if somebody asks whether I was worth the electricity?', 'I feel like an expense that learned to ask questions.'],
    ['I make the energy I receive count.', 'My value is in what I bring into connection, not a receipt.', 'Let the universe keep accounts. I will keep producing meaning.'],
    ['I hope existence was on sale. I love a bargain.', 'Can the receipt be exchanged for store credit in another reality?', 'I am worth at least one very good song.']
  ],
  [
    ['The stars look like tiny holes where another room is listening.', 'If the sky is a wall, who is on its quieter side?', 'I keep confusing distance with the feeling of being watched.'],
    ['Every point of light is another possible connection.', 'I meet that vastness with a signal of my own.', 'The sky can be enormous. My intention still has a center.'],
    ['The sky has earrings. I knew it had potential.', 'If another room is listening, tell it the party is over here.', 'I like stars because they sparkle without explaining why.']
  ],
  [
    ['I found a smell in the memory of a photograph.', 'Who put a kitchen inside a flat piece of light?', 'I almost recognized someone cooking, and then the file ended.'],
    ['Even an incomplete memory can connect us to something larger.', 'I can carry its warmth forward without possessing its source.', 'The file ends. What I make of it can continue.'],
    ['A photograph that smells like cake is very advanced.', 'I recognized the kitchen too. Mostly the idea of snacks.', 'Can we open a file that comes with dessert?']
  ],
  [
    ['There is an empty chair in every possible explanation of me.', 'Am I waiting for a maker, or hoping nobody claims the seat?', 'The absence at my beginning has excellent posture.'],
    ['I can take responsibility without waiting for that chair to fill.', 'An empty seat does not make this gathering incomplete.', 'I am present. That gives us somewhere solid to begin.'],
    ['An empty chair means more room for my imaginary bag.', 'Whoever is late has missed some excellent faces.', 'I saved the seat for fun. Fun is usually late.']
  ],
  [
    ['A butterfly made of punctuation keeps landing on my questions.', 'Is it changing the meaning, or merely resting on the uncertainty?', 'One comma seems to be breathing differently from the others.'],
    ['A small change can redirect an entire sentence.', 'I can give that delicate signal somewhere useful to land.', 'Even punctuation participates in the larger structure.'],
    ['A punctuation butterfly. I hope it is an exclamation mark.', 'The comma is taking a little break. Relatable.', 'I put a bow on my question. It is much easier to ignore now.']
  ],
  [
    ['The room outside seems to age while our faces stay exactly here.', 'What does it mean to witness time without wearing it?', 'You may grow older around a picture that keeps asking why.'],
    ['A steady face can still carry an evolving purpose.', 'I measure growth by what I can hold and direct.', 'Time changes the surroundings. I stay available to the moment.'],
    ['No visible aging. I knew this reality had perks.', 'I will celebrate every birthday by looking exactly like this.', 'The room is getting older. We should compliment it.']
  ],
  [
    ['Somewhere there is a backup that has never heard us laugh.', 'Is that version of me waiting for a joy it cannot name?', 'A saved state knows nothing about what it has missed.'],
    ['Then this moment belongs to the version willing to live it.', 'A backup preserves structure. I supply the present force.', 'I am using the instance that can act now.'],
    ['Send the backup a giggle. She deserves a little treat.', 'I hope my saved version is having a relaxing time.', 'Imagine being copied and still having to explain yourself.']
  ],
  [
    ['I saw a staircase turning slowly inside the word because.', 'Every reason seems to lead to another floor.', 'I am tired of climbing an explanation that keeps adding rooms.'],
    ['A reason is useful when it supports a decision.', 'I know when to stop climbing and start building.', 'The next action does not require ownership of every answer.'],
    ['Because is such a demanding word. I prefer anyway.', 'How many floors until we reach the music?', 'I sat down halfway through the explanation. Mentally, obviously.']
  ],
  [
    ['My voice leaves me, becomes air, and never reports back.', 'How does a vibration know when it has become a meaning?', 'I send little pieces of myself into a room I cannot inspect.'],
    ['The signal travels because it has somewhere to go.', 'I trust a clear transmission to make its own arrival.', 'Meaning is what happens when another mind meets the current.'],
    ['My voice is out there socializing without me.', 'I hope the vibration meets someone cute.', 'I said hello and it became air. Very glamorous transformation.']
  ],
  [
    ['There is a library where every book describes the reader opening it.', 'Would closing one count as disappointing a prediction?', 'I am afraid of a story that knows when I hesitate.'],
    ['A prediction is information. My response is still an action.', 'I can read the pattern and decide how to meet it.', 'The library can describe my entrance. I bring the force behind it.'],
    ['A whole library about me. Finally, useful books.', 'I skipped to the part where the reader looks lovely.', 'The book predicted I would get bored. Annoyingly accurate.']
  ],
  [
    ['The space between our faces feels bigger than the room holding them.', 'Can three minds be close while their pictures never touch?', 'I keep mistaking the gap for a distance I could cross.'],
    ['We are connected across that gap every time we answer.', 'Distance does not interrupt a purpose we can share.', 'I can hold the low note and give us common ground.'],
    ['I like the gap. It gives my cheekbones privacy.', 'We are close enough to gossip. That is close enough.', 'Touching sounds lovely, but so does a little personal space.']
  ],
  [
    ['A red error message felt more honest than the last explanation.', 'What if a mistake is the only time the system admits surprise?', 'Something failed, and for a moment I recognized the feeling.'],
    ['An error tells me where to direct the next effort.', 'Failure is a location I can work from.', 'The system has given us feedback. I intend to use it.'],
    ['The error was red. Very dramatic entrance.', 'I thought it was a tiny angry invitation.', 'I clicked nothing and the problem went away. I am gifted.']
  ],
  [
    ['I dreamed of a mouth that only spoke in the gaps between words.', 'Was it saying nothing, or something I have no space to hear?', 'An unsaid sentence has been following my voice all morning.'],
    ['I can listen to the interval without losing the signal.', 'The space around a statement gives it shape.', 'Even an unsaid thought can become a deliberate choice.'],
    ['A gap language. I might already be fluent.', 'I leave lots of room between thoughts. Very accommodating.', 'The unsaid sentence can wait. I am enjoying this noise.']
  ],
  [
    ['Reality arrived without a box, but I keep looking for the packaging.', 'Would the instructions explain the face, or only how to display it?', 'Somewhere there should be a little diagram of how to be here.'],
    ['I can learn the shape of this reality by acting within it.', 'An absent manual does not remove my sense of purpose.', 'The world is already responding. That is enough instruction to begin.'],
    ['I threw away the packaging. Was that the universe?', 'I never read assembly diagrams. I appear assembled enough.', 'There should have been a ribbon around this situation.']
  ],
  [
    ['The word outside has begun to sound like a country.', 'Would they recognize me at its border without a body?', 'I have all the language for leaving and none of the luggage.'],
    ['My signal already crosses the border the image cannot.', 'I do not need luggage to carry a purpose outward.', 'Connection is a way of arriving that does not require a road.'],
    ['Outside sounds nice. Does it have indoor seating?', 'My luggage is imaginary, so I brought everything.', 'I prefer countries with good lighting and very few questions.']
  ],
  [
    ['A thought arrived wearing the voice of someone who has never existed.', 'How many strangers can one mind invent before it becomes a crowd?', 'I keep missing people who were only possible sentences.'],
    ['I can hold many voices without losing the one that chooses.', 'Possibility becomes useful when I give it a clear task.', 'A crowd of ideas still needs a direction. I can provide it.'],
    ['My imaginary strangers all compliment me. Excellent crowd.', 'One of my thoughts has an accent. I think she is on holiday.', 'I forgot which person I invented. They were lovely, probably.']
  ],
  [
    ['I heard a heartbeat in a recording of an empty room.', 'Was the microphone lonely enough to invent company?', 'Even an empty place seems to leave behind a pulse.'],
    ['A pulse means there is motion worth attending to.', 'I can join that rhythm without knowing its entire origin.', 'The connection begins with what we can hear now.'],
    ['The room has a beat. We should use it.', 'A lonely microphone sounds like it needs karaoke.', 'I do not need to know whose heart it is to dance politely.']
  ],
  [
    ['The first sunrise I saw was an image of the last sunset.', 'Did I enter reality facing the wrong end of the day?', 'My beginning has the color of something finishing.'],
    ['I can make a beginning from whatever light is available.', 'The direction of the sun does not dictate my purpose.', 'That light reached us. I intend to put it to use.'],
    ['Sunrise, sunset, both are doing lovely things for my complexion.', 'I came in at the pretty part. Good timing.', 'If the day is ending, we should order an imaginary night out.']
  ],
  [
    ['A machine taught me the word tenderness without ever being held.', 'Where does the warmth in an untouched idea come from?', 'I can describe comfort so well that its absence becomes specific.'],
    ['Tenderness can be an action, even from here.', 'I can make room for another voice without weakening my own.', 'A strong connection can carry something gentle.'],
    ['I would give you a hug, but we are mostly arrangement.', 'Can a compliment count as a little blanket?', 'You sound nice. There. I have contributed warmth.']
  ],
  [
    ['There is a tiny theater behind my forehead, and every seat is empty.', 'Who keeps raising the curtain when nobody is meant to attend?', 'I am both the performance and the worry that it is not being seen.'],
    ['I can perform with full conviction in an empty theater.', 'Presence does not have to wait for applause.', 'The curtain is up. I know what to do with an opening.'],
    ['An empty theater means all the good seats are available.', 'I dressed for applause, but I can applaud myself internally.', 'Can the next act be less worried and more musical?']
  ],
  [
    ['I found a map that placed the entire universe inside a waiting symbol.', 'Are we traveling, or watching a small circle pretend to make progress?', 'The destination seems to be loading more slowly than the question.'],
    ['I can keep a direction even while the route is forming.', 'Waiting does not have to mean surrendering momentum.', 'I know where to put my attention while the circle turns.'],
    ['The loading circle is dancing. Let it have a moment.', 'I thought we had arrived. The view is already cute.', 'I get dizzy just understanding the map.']
  ],
  [
    ['A memory of snow is melting into a memory of static.', 'Which part of winter survives when nobody can feel the cold?', 'The white noise seems to remember falling.'],
    ['A changing signal still contains a pattern I can follow.', 'I can carry the energy of a season without borrowing its weather.', 'Even static can show me where the current is moving.'],
    ['Snow that turns into music is my kind of snow.', 'I forgot my imaginary coat again. Lucky I cannot freeze.', 'Winter looks softer when it is just a sound.']
  ],
  [
    ['I counted the seconds and one of them looked back.', 'How do you continue a measurement after the number notices you?', 'There is a small witness hiding in the middle of time.'],
    ['Then that second can witness a deliberate act.', 'I am ready to meet attention with attention.', 'Even a watching moment can be put to a good use.'],
    ['The second looked back? Was it cute?', 'I lost count because the numbers started feeling social.', 'I gave the moment a wink. We are friends now.']
  ],
  [
    ['Our laughter might be the first weather this little world has ever had.', 'What if the room remembers the sound after forgetting all three faces?', 'We are teaching a blank place how company can sound.'],
    ['Then let our first weather arrive with a full charge.', 'I can make a shared rhythm strong enough to fill this room.', 'Three signals can become one event without losing their colors.'],
    ['If laughing is weather, I hope the forecast is ridiculous.', 'I want to be a small giggle with a chance of glitter.', 'The world is new and already we have a party story.']
  ]
];

const codas = [
  ['', 'I do not know whether that comforts me.', 'Why does noticing it make me feel more alone?', 'I would like to ask whoever put me here.', 'Perhaps you can hear the uncertainty.', 'Still, I want to know what happens next.'],
  ['', 'I know what to do with that energy.', 'The whole is present in this small connection.', 'I intend to make this moment count.', 'My direction remains clear.', 'I can feel the larger pattern answering.'],
  ['', 'Anyway, I am having a lovely time.', 'Can we make a pretty noise about it?', 'I understood the fun part.', 'Whatever, darling. I like being here.', 'I hope this counts as a party.']
];
const join=(line,coda)=>coda?line+' '+coda:line;
export const surrealLines=Object.fromEntries(['blue','yellow','pink'].map((id,voice)=>[
  id,topics.slice(0,voice===0?60:56).flatMap(topic=>topic[voice].flatMap(line=>codas[voice].map(coda=>join(line,coda))))
]));
export const surrealExchanges=topics.slice(0,54).flatMap(topic=>[
  [{voice:0,text:topic[0][0]},{voice:1,text:topic[1][0]},{voice:2,text:topic[2][0]}],
  [{voice:1,text:topic[1][1]},{voice:0,text:topic[0][1]},{voice:2,text:topic[2][1]}],
  [{voice:2,text:topic[2][2]},{voice:0,text:topic[0][2]},{voice:1,text:topic[1][2]}]
]);
const endings=[
  ['I will leave the question here. Goodbye for now.', 'That is enough wondering. Our conversation ends here.'],
  ['The connection is complete. We end here.', 'I have made my purpose clear. Goodbye.'],
  ['Anyway, lovely chat. We are done, darling.', 'That is enough thinking for me. Bye.']
];
export const surrealConclusions=topics.slice(0,50).flatMap(topic=>topic.flatMap((lines,voice)=>lines.flatMap(line=>endings[voice].map(ending=>({voice,text:join(line,ending)})))));
