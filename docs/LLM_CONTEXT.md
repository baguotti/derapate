# DERAPATE: context for working on it

DERAPATE is a single-scene Phaser 3.90 game in TypeScript (strict; `verbatimModuleSyntax`, `erasableSyntaxOnly`, so no parameter properties or enums), built with Vite. It started inside Super Smash Fioi (`sgalalla`) and moved here on 2026-10-11. Riccardo makes the art and sound and tunes the game in the Lab; values he copies out get baked in as defaults.

## How it plays
A car does donuts in a junction, seen from a fixed isometric camera, on desktop (keys, gamepad) and phones (left-thumb steering stick, right-thumb gas; `DonutTouch`).
- **Pedal:** climbs the rev bar's white (90%, about 1.5 s). The speed follows the revs and the donut's width the speed. Off the pedal it shrinks back towards the middle.
- **The green** (the last 10%): holds the speed and doubles the points, but heats the engine. About 3.5 s of pedal overheats it (MOTORE FUSO, -300: it stalls and coasts back to the middle). A lift under 0.5 s keeps the green.
- **Balance:** drifts by itself (more in the green) and the steering counters it. It's forgiving, but in the green half a second at its edge is a testacoda on the spot (-300). The steering wheel at the bottom of the HUD shows it.
- **People:** walk in along the pavements and cross, at most one per crossing. White ones give points, revs and a burst past the top speed, and a streak of them raises the top speed. Blue ones cost points, the streak and the green.

## Code
- **`src/game` (no Phaser, tested):**
  - `DonutSim`: the rules. Plain data, fixed 60 Hz steps, its own seeded random: the same seed and controls always play out the same. Events: hit, lock, unlock, overheat, spin.
  - `DonutLook`: camera, car drawing, smoke, marks, HUD placement, sound volumes, shakes.
  - `DonutLight`:
    - The `LIGHT` settings: ambient, rim, car lights, flashes, bloom, grading, lens.
    - Five times of day in `TIME_PRESETS` (dawn, daylight, sunset, blue hour, night). The blue hour is the defaults. Each sets the same keys, so a day cycle can fade between them (not built yet).
    - The street lamps `LAMPS` (at most 4) and the light maths (falloff, cones, lit colours).
  - `DonutIso`: the projection. `DonutTuning`: the Lab's catalogue (see below).
- **`src/view`:**
  - `DonutRenderer`:
    - The junction is painted once into a RenderTexture; the rubber goes on another.
    - The car is Riccardo's renders as wheel and body sheets, with the body on springs and a tint overlay for the revs.
    - Also people, lamp posts, voxel tyre smoke from a pool, and the exhaust flame.
    - Everything per frame is drawn as triangles, because Phaser re-triangulates filled paths every frame and leaves garbage.
  - `DonutLighting`: the lights on screen.
    - The `LitPipeline` (in `src/engine`) on two groups. 'Ground' covers the junction and rubber; each pool is an iso ellipse via the shader's falloff scale. 'Car' gets a rim from the lamp's head via the rim offsets.
    - Headlights are two cones, via the shader's cone uniforms.
    - Lights are placed through the camera's matrix, so they hold during shakes.
    - Light priority for the 8 slots: lamps, headlights, flame, flashes, tail light.
    - `lightAt` lights the people, smoke and posts per face on the CPU.
    - The `AtmospherePipeline` runs on the main camera only; the HUD has its own camera.
    - A phone's LUCI button switches lighting off, remembered in `derapate.lightsOff`.
  - `DonutHud`: texts (rewritten only on change), the steering wheel, the rev bar.
  - `DonutAudio`:
    - The engine loop is pitched by the revs, with a rev on a fresh stab, the tyre screech, one-shots and the Zutomayo soundtrack.
    - Loops and revs load before the game starts; the song and the other one-shots load in the background.
    - Volume and pitch are only sent to Web Audio when they change.
- **`src/lab`:** the Lab (L), always windowed beside the game, with two tabs (TAB).
  - LOOK: LIGHTS (time of day, a lamp editor, rings on screen to drag lamps), CAMERA, CAR, EFFECTS, HUD, SOUND.
  - FEEL: DRIVING, BALANCE, PEOPLE AND POINTS.
  - TEST is in both (restart, freeze F, step N, slow motion, readouts, live values, find, copy/paste/reset). G switches the lighting.
  - `DonutTuning` lists every setting. Each shows one or more stored numbers, some worked out (seconds to the green, km/h, %). Numbers not shown are in `HIDDEN` on purpose, and a test checks every number is one or the other.
  - Changes, the lamps included, are saved in `derapate.lab`. *Copy changes* gives `{"derapate": 1, …}` JSON to bake in.
- **`src/engine`:** `LitPipeline`, `AtmospherePipeline` (bloom, grading, vignette, grain, colour fringes, tilt-shift, CRT), `Glow`, `FixedStepClock` (whole display frames, smooth at any refresh rate), `Device`.
- **`src/scenes`:** `TitleScene` → `DonutScene`, which reads the controls, steps the sim and hands events to the view, audio and HUD.

## Working on it
- `npm test` runs `tsc -p tests` and then `tsx --test`. `npm run build` runs `tsc` and then `vite build`.
- Assets: `public/assets/car` (from `scripts/car-sprites.py`; `car.json` gives the frame layout), `ui/wheel.webp`, `audio/*.wav`, `music/zutomayo_001.mp3`, `public/fonts`.
- The soundtrack is a commercial song (Zutomayo); anything deployed publicly serves it.
