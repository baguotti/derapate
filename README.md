# DERAPATE

A car doing donuts in the middle of a junction at dusk, seen from a fixed isometric camera. Hold the pedal to climb the revs through the white into the green, where the points double but the engine heats up; keep the balance with the steering wheel; hit the white people for a boost, dodge the blue ones. Made with Phaser 3 and TypeScript.

## Play

```bash
npm install
npm run dev
```

Then open http://localhost:5180.

| | Keyboard | Gamepad | Phone |
|---|---|---|---|
| Pedal | Space / ↑ / W / J | RT or A | right thumb |
| Steer | ← → / A D | left stick, d-pad | slide the left thumb |
| Start again | R | | ↻ |
| Back to the title | ESC | | ✕ |
| Lights on / off | G (in the Lab) | | LUCI |

**L** opens the DERAPATE Lab: every setting live, in two tabs. **LOOK** holds the lights, camera, car, effects, HUD and sound; **FEEL** holds how it plays. TAB switches tabs. Changes are kept in the browser; *Copy changes* gives the JSON to bake in as defaults.

## Scripts

- `npm run dev`: the dev server (port 5180).
- `npm test`: type-check the tests, then run them (the rules, the Lab's settings, the light maths).
- `npm run build`: type-check and build into `dist/` (relative paths, so it runs from any folder on a server).
- `python3 scripts/car-sprites.py <Main-body folder> <Wheels folder>`: packs Riccardo's car renders into `public/assets/car` (needs Pillow and numpy).

## Layout

- `src/game`: the rules (`DonutSim`) and every setting (`DonutLook`, `DonutLight`, `DonutTuning`), plain data with no Phaser, so they're tested.
- `src/view`: what's on screen and heard (`DonutRenderer`, `DonutLighting`, `DonutHud`, `DonutAudio`, `DonutTouch`).
- `src/lab`: the Lab.
- `src/engine`: the lit and atmosphere shaders, glow textures, the fixed-step clock, device helpers.
- `src/scenes`: the title and the game.
- `docs/LLM_CONTEXT.md` explains how it fits together; `docs/DEVELOPMENT_LOG.md` has the history.
