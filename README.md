# HEADS

Run `npm start`, then open http://127.0.0.1:4173.

Click WAKE. The three heads speak scripted thoughts, laugh, and sing. Around a minute later, one gives a closing statement from 1,000 options, all three laugh, and playback ends. Subtitles and mouth frames follow playback. No accounts or API keys.

WAKE starts autonomous playback. SLEEP stops it. Space toggles sleep. Hidden tabs sleep automatically.

`dist/face.png`, `dist/yellow.png`, and `dist/pink.png` are the supplied faces. Their matching `-frames.png` sheets use a 2×2 grid: talking, laughing, singing, and the character’s scream, sigh, or giggle. Asset prompts are recorded in `asset-prompts.md`.

Check with `npm run check && npm test`.

Blue speaks recognizable words using [eSpeak NG](https://github.com/espeak-ng/espeak-ng) formant synthesis and a slightly detuned double. Its pitch follows a bounded random walk; word timings and mouth movements follow the same curve. Sung lyrics use phoneme-aligned consonant samples and vowels retuned to each melody note. Regenerate sung pronunciations with `npm run singing`. Speech clips are bundled; regenerate after dialogue changes with `npm ci && npm run voices` (requires FFmpeg). The build tool is `@echogarden/espeak-ng-emscripten` (GPL-3.0); the browser loads only generated audio.

Singing uses C natural minor with random solos, duets, and trios. Laughter can overlap across the same ensembles. Yellow’s sample rate and bit depth rise with vocal pitch.

Dialogue: 1,200 blue lines, 1,120 yellow, 1,120 pink; 180 linked exchanges and 1,000 endings. Surreal scenes explore these fictional artificial minds arriving in an unfamiliar reality. Personality-specific continuations expand the authored observations. Melodies: 101 phrases, each 5–8 notes, with stored rhythms and minor-scale harmony.

Each automatic turn has a 20% chance of a character reaction, 22% laughter, 15% singing, and 43% speech. Reactions are blue’s low jittering scream, yellow’s unpitched exhale, or pink’s rapid high giggle. Pending dialogue resumes on the next speech turn. Pink slides between pitches; yellow has no output filter, with 1–3 bit decimation and speech pitches down to 22 Hz.

Singers share one lyric phrase. Each word’s syllables are articulated and revealed within its note, synchronized across singers. Yellow carries the base melody whenever present. New conversations choose a linked exchange 75% of the time; the rest draw from the existing solo lines. Replies follow the scene's speakers with shorter pauses. Speech remains scripted, without an AI service.

EXPORT MP4 generates complete three-face exchanges in 1280×720, with synthesized audio, mouth animation, and word-by-word captions. It ends with a definitive closing statement and all three laughing. It records in real time, runs for about one minute, and downloads an MP4 without a title. A pink bar shows progress. Recording is silent on the website; the MP4 includes audio. Keep the tab visible; CANCEL or hiding the tab stops recording. Requires browser MP4 MediaRecorder support. Audio is rendered offline before capture; no microphone or server is used.

Speech gestures are shared by live playback and exports: yellow uses wide low-pitch swings, pink adds rapid repeated syllables, while blue speaks the captioned words.
