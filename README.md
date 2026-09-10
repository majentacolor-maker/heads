# HEADS

Run `npm start`, then open http://127.0.0.1:4173.

Click Wake. The head autonomously speaks scripted thoughts, laughs, and sings using Web Audio oscillators. Subtitles and mouth frames follow playback. No accounts, API keys, recordings, or dependencies.

WAKE starts autonomous playback. SLEEP stops it. Space toggles sleep. Hidden tabs sleep automatically.

`dist/face.png` is the supplied reference. `dist/face-frames.png` contains edited talking, laughter, and singing frames.

Check syntax with `npm run check`.

Singing uses C natural minor with random solos, duets, and trios. Laughter can overlap across the same ensembles. Yellow’s sample rate and bit depth rise with vocal pitch.

Dialogue: 120 blue lines, 112 yellow, 112 pink. Melodies: 101 phrases, each 5–8 notes, with stored rhythms and minor-scale harmony.

Each automatic turn has a 5% chance of a character reaction: blue’s descending scream, yellow’s rising sigh, or pink’s rapid high giggle. Pink slides between pitches; yellow has no output filter, with 1–3 bit decimation and speech pitches down to 22 Hz.

Singers share one lyric phrase, revealing a word per note above their individual note names. New conversations choose a linked exchange 75% of the time; the rest draw from the existing solo lines. Replies follow the scene's speakers with shorter pauses. Speech remains scripted, without an AI service.

EXPORT MP4 generates complete three-face exchanges in 1280×720, with synthesized audio, mouth animation, and word-by-word captions. It records in real time, runs for 90 seconds, and downloads an MP4. Keep the tab visible; CANCEL or hiding the tab stops recording. Requires browser MP4 MediaRecorder support. Audio is rendered offline before capture; no microphone or server is used.

Speech gestures are shared by live playback and exports: yellow uses wide low-pitch swings, pink adds rapid repeated syllables, and blue occasionally holds a sound longer.
