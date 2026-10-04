# HEADS

heads.computer is live

Run `npm start`, then open http://127.0.0.1:4173.

Click WAKE. The three heads speak scripted thoughts, laugh, and sing. Around a minute later, one gives a closing statement from 3,022 options, all three laugh, and playback ends. Subtitles and mouth frames follow playback. No accounts or API keys.

Each page load selects three of nine faces. REFRESH CAST changes the trio; WAKE starts a new conversation with the current cast. SLEEP stops it. Space toggles sleep. Hidden tabs sleep automatically.

The opening speaker is chosen from the least-used voices, with random ties. Selection favors unused dialogue ideas, then the least recently used, while preserving connected replies. This history lasts until the page reloads. Melody and lyric choices also favor unused options; exports use the same selection rules within each recording.

`dist/faces/` contains the nine supplied faces and matching four-frame reaction sheets. Voice/image mappings are in `dist/cast.js`; image prompts are in `scripts/face-prompts.json`.

Check with `npm run check && npm test`.

Blue speaks recognizable words using [eSpeak NG](https://github.com/espeak-ng/espeak-ng) formant synthesis and a slightly detuned double. Its pitch follows a bounded random walk; word timings and mouth movements follow the same curve. Speech and singing give each phoneme a 12.5% chance of a softened consonant or a borrowed vowel. Timing and sung pitches stay intact. Sung lyrics use phoneme-aligned consonant samples and vowels retuned to each melody note. Regenerate sung pronunciations with `npm run singing`. Speech clips are bundled; regenerate after dialogue changes with `npm ci && npm run voices` (requires FFmpeg). The build tool is `@echogarden/espeak-ng-emscripten` (GPL-3.0); the browser loads only generated audio.

Singing uses C natural minor with random solos, duets, and trios. Laughter can overlap across the same ensembles. Yellow’s sample rate and bit depth rise with vocal pitch.

Dialogue: 10,924 unique spoken lines and replies, 3,022 endings, and 224 lyric phrases. Each of the six newer personalities has 1,224 spoken lines (including its connected replies), 336 endings, and 32 lyrics. The new banks combine 60 topic-specific observations per character with authored continuations, following the original dialogue structure. The song leader chooses its personality’s lyrics, shared by all singers. Melodies: 101 phrases of 5–8 notes.

Automatic turns use base weights of 25% character reactions, 28% laughter, 22% singing, and 25% speech. The previous special action is excluded and the remaining weights are normalized, preventing consecutive repeats. Reactions are blue’s low jittering scream, yellow’s unpitched exhale, or pink’s rapid high giggle. Pending dialogue resumes on the next speech turn. Pink slides between pitches; yellow has no output filter, with 1–3 bit decimation and speech pitches down to 22 Hz.

Singers share one lyric phrase. Each word’s syllables are articulated and revealed within its note, synchronized across singers. Yellow carries the base melody whenever present. New conversations choose a linked exchange 75% of the time; the rest draw from the existing solo lines. Replies follow the scene's speakers with shorter pauses. Speech remains scripted, without an AI service.

EXPORT MP4 generates complete three-face exchanges in 1280×720, with synthesized audio, mouth animation, and word-by-word captions. It ends with a definitive closing statement and all three laughing. It records in real time, runs for about one minute, and downloads an MP4 without a title. A pink bar shows progress. Recording is silent on the website; the MP4 includes audio. Keep the tab visible; CANCEL or hiding the tab stops recording. Requires browser MP4 MediaRecorder support. Audio is rendered offline before capture; no microphone or server is used.

Speech gestures are shared by live playback and exports: yellow uses wide low-pitch swings, pink adds rapid repeated syllables, while blue speaks the captioned words.
