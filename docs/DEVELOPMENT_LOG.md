# DERAPATE: development log

DERAPATE began as a mini-game inside Super Smash Fioi (the `experimental-branch` of `sgalalla`, 2026-09-30 to 2026-10-05). Its entries from there are kept below, oldest first, then this project's own. Paths in the older entries are the old ones (`src/minigames/donut/`, `src/scenes/DonutScene.ts`).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-09-30] DERAPATE: donut mini-game prototype (branch `experimental-branch`)
- **[Feat]** **DERAPATE** in the main menu, a first prototype in plain blocks (no sound): a car doing donuts in the middle of a junction, seen from a fixed isometric camera, after Riccardo's sketch and the Audi reference frames. Roads crossing, zebra crossings on the four arms, pavements, corner buildings; the car leaves tyre marks, and a faint ring shows the loop it's on.
- **[Gameplay]** The throttle (Up/W/J/Space, RT/A) widens and speeds up the donut, letting go tightens it, the brake (Down/S/K, LT/X) tightens it hard. The drift has to be balanced with left/right (or the stick): it tips further by itself, wobbles, and the throttle swings the tail out; past the edge the car spins out (-150, speed lost). People cross on the zebra crossings: red ones cost 300 points, most of the speed and the combo; green ones give +50 and a burst of speed. Points grow with the donut's width and speed, 1.5x while the balance is clean, and wide loops build a combo up to x3. Measured over a minute: tight and safe 70, flat out through the crowd 480, wide but tightening when a red walker is crossing 1,720. R restarts, ESC back to the menu.
- **[Arch]** `src/minigames/donut/DonutSim.ts` (plain data, 60 Hz, its own seeded random numbers), `DonutRenderer.ts` (isometric blocks), `src/scenes/DonutScene.ts`. `tests/donut.test.ts`: the throttle sizes the donut, unbalanced it spins out and balanced it holds, and both kinds of pedestrian do what they should.
- **[S]** Verified: typecheck, 58 tests, build; in the browser, driving with throttle and balance, people crossing and being hit, no errors.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-09-30] DERAPATE: more forgiving balance (branch `experimental-branch`)
- **[Change]** The drift tips over far more slowly (TIP 1.1 → 0.35), wobbles less (1.6 → 0.8), the throttle pushes the tail out less (0.9 → 0.35), counter-steering is gentler so it's hard to overcorrect (4.2 → 3), and the swing settles sooner (damping 2.2 → 4). Left alone, the car now spins out after about 11 s instead of 3.
- **[Feat]** A grace moment at the edge: past it, the car spins out only after staying there 0.35 s, and the needle flashes red, so a quick correction saves it.
- **[S]** 58 tests, build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-09-30] DERAPATE: the Audi reference as the car (branch `experimental-branch`)
- **[Art]** The car is the Audi reference render until the real sprites come: `scripts/donut-car.py` keys out the grey background of the 45 frames (background joined to the frame's edge only, so the car's grey parts stay), crops each round the car and packs them into `public/assets/donut/car_temp.png` (9x5 frames of 243 px). The frame is picked from the car's heading (frame 6 faces the camera, 8° per frame), checked against a heading arrow; drawn at 1.6x, in scale with the people, between those behind and in front of it.
- **[Feel]** Locked into the donut: the nose now points about 70° into the circle (the tail swinging round the centre) instead of 55°, rocked by the balance; the throttle, eased in and out, swings the tail out a further 17°. Tyre smoke pours from the rear wheels, lightly all the time, billowing under throttle and in spin-outs.
- **[S]** 58 tests, build; checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-09-30] DERAPATE: back to the block car (branch `experimental-branch`)
- **[Revert]** The Audi reference didn't suit the game: it spins round a point on its own circle, so as a sprite the car did its donuts round a moving point rather than widening from the junction's centre. Tried a pivot model to match it (the car spinning tightly round a pivot that the throttle moves outwards); it felt worse, so the car is the red block car again, circling the centre with the throttle widening the donut, as before the sprites.
- **[Change]** The block car is drawn 1.75x (the Audi sprite's size next to the people), with wider tyre marks; the hit distance follows it (1.7 → 2.8 m) and a red walker now costs 500, so driving through the crowd doesn't pay (a minute of bots: careful 803, reckless 203).
- **[Note]** `scripts/donut-car.py` and `public/assets/donut/` are still there but nothing loads them.
- **[S]** 58 tests, build; checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-09-30] v3.0.6e (branch `experimental-branch`)
- **[Release]** DERAPATE, the donut mini-game prototype (main menu), with the block car. Version 3.0.6-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: a pedal you blip (branch `experimental-branch`)
- **[Feel]** The pedal snaps down and up in 0.1 s and the engine's revs follow it fast; the revs set the speed and the donut's width (about 3x quicker than before). Each stab kicks the tail out, harder the faster the car goes (0.85 of the edge at top speed, about 0.4 slow), with the tyres biting a little differently every time; each lift brings it part of the way back. Kept moderate on purpose: stronger and tapping without steering would balance itself.
- **[Feat]** Rev meter (GIRI) above the balance bar: revs between 0.55 and the red line (0.88) score double (`GIRI x2`); past the red line the engine bounces off the limiter, the bar flashes red and the push on the tail builds over 3 s until steering can't hold it. Blipping in rhythm (about 0.3 s on, 0.2 off) keeps the revs in the sweet spot nearly all the time; flat out spins about every 7 s even with perfect steering.
- **[Change]** Random gusts down to a light wobble (0.8 → 0.3, more at the limiter): the chaos now comes from your pedal.
- **[Look]** The car's body swings with every stab and lift (balance drawn between steps), wheelspin swings the tail out a little more and lays darker rubber, and a stab at speed shakes the camera slightly.
- **[Balance]** One minute of test drivers: blipping and balancing 16,700 vs flat out 3,400; with people, careful blipping 752, careful flat out 281, blipping through the crowd 151.
- **[S]** 60 tests (new: the kick and lift, the sweet spot vs the limiter), build; checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: the balance rises slower, room to rev (branch `experimental-branch`)
- **[Feel]** A stab of the pedal no longer jolts the balance: its kick is a push that builds and fades over half a second (`KICK_TIME`), and it's gentler (KICK 4.5 → 2.5, the revs' steady push 1 → 0.6). Pedal down at speed with no steering, the balance takes 0.8 s to reach halfway instead of 0.4, so there's time to catch it and to hold the pedal long enough to get the revs up.
- **[Change]** Lifting now mainly stops the push (the kick ends); it only pulls the tail back once it's past 0.6 (SNAP 4 → 2). A strong pull-back balanced the car by itself when tapping, which made steering optional.
- **[Change]** The limiter's push builds over 4 s instead of 3: a moment in the red is fine, staying there isn't.
- **[Balance]** A keyboard player who reacts 0.2 s late: holding 1.2 s / lifting 0.4 s now never spins (it spun 5.6 times a minute) and spends 44% of the time in the red; flat out still spins about every 8 s; without steering every pedal style spins. With people: careful 1,441, reckless 260.
- **[S]** 60 tests, build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: the Lab, hit shakes, nose into the circle (branch `experimental-branch`)
- **[Feat]** The **DERAPATE Lab** (L in the game, L again closes it): every number of the mini-game live, in the Studio Lab's style and windowed by default (the game in the middle, panels docked either side; FULL SCREEN floats them). DRIVING (pedal, revs, speed, size, the donut's centre), BALANCE (kick, lift, limiter, tipping, steering, spin-outs, combo), PEOPLE AND ROAD (people, junction size), CAR AND CAMERA (car size, nose angle, swings, tyre marks, zoom, junction on screen, every shake), and TEST: restart, freeze (F), next step (N), slow motion, test shakes, live readouts, the car's live values (radius, angle, speed, revs, balance) to put it anywhere, a find box, Copy changes / Copy all / Paste / Reset all. H hides the panels. Changes are kept in this browser and used whenever DERAPATE runs here.
- **[Feat]** Two camera shakes: a hard short jolt for a red walker (1% of the screen, 250 ms), a lighter longer rumble with a 5% zoom punch for a green boost. The pedal-stab shake is off by default (a Lab slider). The HUD has its own camera, so only the junction shakes and zooms.
- **[Look]** The car's nose points further into the circle: 70° from straight ahead instead of 54°.
- **[Code]** The settings are plain objects (`DONUT`, `PEDESTRIANS`, `JUNCTION`, new `LOOK` in `DonutLook.ts`); `DonutTuning.ts` lists them with ranges, keeps the defaults, applies/copies changes; `DonutLab.ts` builds the panels from `LabUi`/`FeelUi`; the Studio Lab's `WindowedView` is exported with a configurable top band. R now starts again without restarting the scene, so the Lab stays open.
- **[S]** 62 tests (new: every setting is in the Lab, changes copy out and paste back), build; checked in the browser (windowed and full screen, shakes on the world camera only, the junction redrawn live, freeze and step, closing).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] v3.0.7e (branch `experimental-branch`)
- **[Release]** DERAPATE: a pedal you blip (revs, sweet spot, limiter), slower balance rise, hit and boost shakes, nose further into the circle, and the DERAPATE Lab (L). Version 3.0.7-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: the speed lock, no brakes, no testacoda, fewer people (branch `experimental-branch`)
- **[Feat]** The speed lock: reaching the green revs locks them there. Locked, the pedal moves the revs only 15% as much and its kick is a quarter, and they can't leave the green (no red line); steering bites twice as hard while the drift tips over 6.5x more, wobbles 7x more and settles less: livelier and harder. A red hit ends it (and losing the balance, see below); the revs drop back into the white to be built up again. The GIRI bar gets an outline round the green and reads `BLOCCATO x2`.
- **[Change]** Below the green (white revs) it's more forgiving: the pedal's push on the tail ×0.7, steering ×1.3.
- **[Change]** Testacoda is off by default (`SPIN_OUTS`, a checkbox in the Lab under BALANCE → SPIN-OUTS AND COMBO): the balance stops at 1.15 instead. With it off, staying past the edge for the grace time ends the lock and keeps 60% of the speed (switch in SPEED LOCK).
- **[Change]** No brakes: only the pedal and steering (keys and gamepad).
- **[Change]** Letting go slows the car gently: revs fall at 0.5/s (was 1.5), speed follows them down at 1/s (was 3), the donut tightens at 2 m/s (was 4).
- **[Change]** Far fewer people: one every 2.5–5 s (was 0.9–2.2), and at most one on each crossing (`PER_CROSSING`).
- **[Lab]** New SPEED LOCK panel (the lock and the white zone); on/off settings are checkboxes; the readout shows the lock.
- **[Balance]** One minute of test drivers holding the pedal (1.2 s on, 0.4 off): attentive players stay locked the whole time; a sloppy one loses the lock about 5 times a minute; nobody steering loses it constantly.
- **[S]** 68 tests (new: the lock, the gentle slow-down, losing the balance with testacoda off, one person per crossing), build; checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: no pedal, no movement (branch `experimental-branch`)
- **[Change]** The slowest speed is now 0 (was 4 m/s): without the pedal the car stands still (and starts at the tightest radius, so it doesn't slide in). Standing still nothing pushes the tail about and the balance settles back to the middle. A spin-out whirls on the spot.
- **[Note]** Locked in the green, the revs can't fall out of it, so letting go keeps the car moving until a red hit or losing the balance ends the lock.
- **[S]** 69 tests (new: no pedal, no movement), build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: off the pedal, it stops (branch `experimental-branch`)
- **[Fix]** The car kept going with nothing pressed: once locked in the green, the revs couldn't fall. Now, off the pedal, the revs fall as usual and the lock ends once they leave the green; revs under 0.1 (`REV_IDLE`) drive nothing, and a rolling friction (1.5 m/s², `ROLL_FRICTION`) brings it to a full stop: from top speed it rolls about 4 s and stands still. With any pedal down, the lock works as before.
- **[Fix]** A gamepad trigger resting a little above 0 no longer counts as throttle (dead zone 0.1).
- **[S]** 70 tests (new: off the pedal the lock ends and the car stops), build; checked in the browser (standing still at the start).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: quicker stop, heavier edges (branch `experimental-branch`)
- **[Change]** Off the pedal the car stops in about 1.7 s from top speed (was about 4): revs fall at 1.2/s (was 0.5), speed follows at 2/s (was 1.5), rolling friction 6 m/s² (was 1.5). A blip off the pedal shorter than 0.3 s (`LOCK_LIFT_GRACE`) keeps the speed lock; longer and it starts to go.
- **[Feel]** The balance isn't linear any more: the drag on its swing is ×0.65 in the middle of the bar (light, responsive) rising to ×2.6 at the edges (heavy, forgiving), growing with the square of the distance (`CENTRE_DRAG`, `EDGE_DRAG`, in the Lab under BALANCE). A sloppy test driver loses the lock about 2.6 times a minute (was about 5); attentive ones never.
- **[S]** 71 tests (new: the stop within two seconds, light middle / heavy edges), build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: rethink, the pedal and the heat (branch `experimental-branch`)
- **[Change]** The rules started again, simpler and forgiving, pedal only: steering and the balance are gone for now (they come back once this stage feels right). The rev bar is 90% white and 10% green. Pedal down, the white fills steadily (0.3 of the bar a second: about 3 s to the green); pedal up, it empties (0.6 a second) and the car rolls to a stop. The speed follows the revs and the donut's width follows the speed (tight standing still, widest at top speed).
- **[Feat]** The green: top speed holds while the pedal stays down, but the engine heats up (the green part of the bar fills, orange then flashing red, `MOTORE CALDO!`). About 4 s of pedal overheats it: the car is sent back to the start (stopped, tightest circle) and does a testacoda on the spot (`MOTORE FUSO!`, -300 points, combo reset), then builds up again. Lifting cools the engine (1 s to cool fully); a lift shorter than 0.5 s keeps the green, longer drops back into the white. Points in the green count double.
- **[Change]** A red hit costs 500 points and knocks you out of the green (40% of the revs kept); a green person gives 50 points and a little revs. Standing still or spinning, the car hits no one.
- **[Lab]** Panels follow the new rules: DRIVING (the white, speed and size), GREEN AND HEAT (overheating, cooling, lift grace, testacoda, combo), PEOPLE AND ROAD, CAR AND CAMERA; readouts show revs, heat and pedal-up time; live values include the heat. The old balance, kick, limiter, lock and testacoda settings are gone with the rules they tuned.
- **[S]** 64 tests (rewritten for the new rules), build; checked in the browser (green after 3.0 s, heat warning, overheat back to the start).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: quicker to the green, 3 s in it (branch `experimental-branch`)
- **[Change]** The white fills twice as fast (0.6 of the bar a second, was 0.3): about 1.5 s from standing to the green.
- **[Change]** The engine overheats after 3 s of pedal in the green (was 4). Cooling is unchanged (1 s to cool fully), so staying in the green takes a rhythm of about 1 s down, 0.4 s up.
- **[S]** 64 tests (now following the timing settings), build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: steering back, as forgiving flair (branch `experimental-branch`)
- **[Feat]** The balance is back, light: it drifts slowly by itself while the car moves (twice as much in the green), left/right (A/D, the stick) nudge it, a gentle pull brings it home, and it simply stops at the edges: nothing is ever lost to it (no testacoda, no leaving the green). Inside the middle band points count ×1.25. A small balance bar sits above the rev bar; the car's nose rocks with the balance (±25°).
- **[Balance]** One minute of test drivers: left alone, the balance stays clean 56% of the time; tapping when it leaves the band keeps it clean 100% of the time and scores about 11% more.
- **[Lab]** New STEERING panel (drift, drift in the green, steering, settling, pull to the middle, clean band and bonus); balance swing in CAR AND CAMERA; readout and live value for the balance.
- **[S]** 66 tests (new: the balance costs nothing and rewards a little; it settles standing still), build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: the revs on the car, and a testacoda for the balance in the green (branch `experimental-branch`)
- **[Look]** The rev bar is shown on the car itself, so you can watch the car instead of the bar: the car is black at rest and takes a white tint as the white fills; reaching the green it flashes bright, then glows green with a slow pulse, turns orange as the engine heats and flashes red, faster and faster, before overheating; it flashes red fast at the edge of the balance in the green, and in the testacoda (`LOOK.TINT`, `LOOK.HOT_FLASH` in the Lab).
- **[Feat]** The balance can now cost you, but only in the green: staying at an edge (past 0.97) for 0.5 s there is a testacoda, back to the start like overheating (`TESTACODA!`, -300). In the white the edges stay safe. The drift grows with the speed and is 3.2x stronger in the green (was 2x). In the green the bar's ends turn red and the needle flashes red at an edge.
- **[Balance]** One minute of test drivers: never steering, about 3 testacodas a minute; steering a little whenever it leaves the middle band, none; steering late and lazily, about one every five minutes.
- **[S]** 67 tests (new: the edge is safe in the white and a testacoda in the green; steering avoids it), build; the tint checked in the browser (black, white, green).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: testacoda on the spot, a smooth stall, losing control shows (branch `experimental-branch`)
- **[Change]** The testacoda is only for the steering (at an edge of the balance in the green), and it happens on the spot: the car stops and spins where it is, keeps 40% of the white's revs, and carries on from there (-300).
- **[Change]** Overheating no longer spins the car or puts it back at the start: the engine stalls (`MOTORE FUSO!`, -300), the pedal does nothing, and the car coasts back to the middle as the revs and the speed run down and the donut tightens; once the revs are gone it can start again. The car glows a dull, throbbing red while stalled.
- **[Change]** Off the pedal the donut starts tightening towards the middle straight away (at least 3 m/s, `RETURN`), even during a short lift in the green.
- **[Look]** Losing control shows more: the balance rocks the car twice as far (±50°) and pushes it out of (or into) its circle by up to 1.5 m (`SLIP_SHIFT`; collisions follow it).
- **[S]** 68 tests (new: the stall coasts home smoothly; tightening off the pedal; the testacoda stays on the spot), build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: quicker steering, tint opacities, a clearer steering bar (branch `experimental-branch`)
- **[Feel]** The steering reacts much quicker and grows with the speed: its push is 12 at top speed (was 2.5 at any speed), 15% of that standing still (`STEER_SLOW`), with a little more settling (4, was 3). Full lock moves the balance halfway in 0.35 s at top speed (was 0.93 s), 0.5 s at half speed. The drift in the green is up to 3.8x (was 3.2x) to keep the same challenge: never steering, about 3 testacodas a minute; steering a little, none.
- **[Lab]** Every tint on the car has its own opacity, in CAR AND CAMERA → CAR TINTS: white, green, orange, red, the stall's dull red, the flash on reaching the green, and the overheat flashing speed (replacing the single `TINT`).
- **[Look]** The steering bar (STERZO) is bigger and colour-coded: green in the middle (clean), then yellow, orange, and red at the edges, with a centre mark and a needle outlined in black. In the white (edges safe) the colours are dimmed; in the green they're bright and the needle takes the colour of the zone it's in, flashing red at an edge.
- **[S]** 69 tests (new: the steering reacts quicker at speed), build; the bar checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-01] DERAPATE: the car shows only the revs and the heat (branch `experimental-branch`)
- **[Look]** The car no longer flashes red for the steering (at the edge of the balance, or in the testacoda): its tint is only the rev bar and the engine (white, green, orange, the red flashes before overheating, the stall's dull red). The steering shows only on the STERZO bar.
- **[S]** 69 tests, build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] v3.0.8e: the Lab settings as defaults (branch `experimental-branch`)
- **[Tuning]** Riccardo's DERAPATE Lab settings are now the defaults: the donut widens at 2.8 m/s (was 6), overheating after 3.5 s in the green (was 3), 91% of people are green (was 30%), a wider junction (road half width 10.2 m, crossings at 12.8 m and 4.4 m wide), the camera zoomed out (30 px/m, was 40), and the car's tints: no white or green tint and no green flash, orange at 0.35, red at 0.37, no stall tint, red flashing at 7.5 a second.
- **[Release]** DERAPATE rebuilt around the pedal and the engine's heat, forgiving steering with a testacoda only in the green, the revs shown on the car. Version 3.0.8-e.
- **[S]** 69 tests, build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE on phones (branch `experimental-branch`)
- **[Feat]** The main menu works by touch (and mouse): tap an entry to pick it (rows a thumb wide; bigger and further apart on a phone). Only DERAPATE has touch controls; the fighting modes still need a keyboard or gamepad.
- **[Feat]** DERAPATE's thumb controls on a phone (`src/minigames/donut/DonutTouch.ts`): a left/right steering stick under the left thumb (put it down anywhere in the left half and slide sideways: further is harder, a small dead zone in the middle), the accelerator under the right (hold anywhere in the right half), several fingers at once, and two buttons top right (start again, back to the menu). The score, speed and the two bars are drawn bigger on a phone; the keyboard help line is hidden.
- **[Feat]** Phones: full screen on the first tap (in the menu and in DERAPATE; `src/input/Touch.ts`), and a "RUOTA IL TELEFONO" screen while the phone is held upright (CSS, `#rotate-phone`).
- **[S]** 69 tests, build; checked in the browser's phone view: the rotate screen upright; in landscape the menu tap reaches DERAPATE, the controls show, gas and steering together drive the car, restart works.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] v3.0.9e (branch `experimental-branch`)
- **[Release]** DERAPATE on phones: touch menu, thumb controls, full screen, rotate prompt. Version 3.0.9-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: greens raise the top speed (branch `experimental-branch`)
- **[Feat]** The base top speed stays 18 m/s (65 km/h). Every green person hit raises it for the rest of the run, with diminishing returns so it stays in check: top = base × (1 + 0.5 × (1 − e^(−greens/19))). One green +1.3%, a minute's worth (about 13 for a steady driver, measured) +25% (81 km/h), three minutes' +44% (93 km/h), never past +50% (97 km/h). `SPEED_BONUS_MAX`, `SPEED_BONUS_SCALE` in the Lab.
- **[Feat]** A green also gives a burst of speed above the top: +30% of the base (about +19 km/h), fading over 1.5 s (`BOOST_SPEED`, `BOOST_SECONDS`). The HUD shows `KM/H   MAX …` and `BOOST!` during a burst.
- **[Change]** Past the base top speed the balance keeps getting livelier (drift and steering scale up to 1.5x), so the extra speed is felt.
- **[S]** 70 tests (new: diminishing returns, the cap, the burst and its fade), build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: the combo raises the speed, a shaped burst, white and blue people (branch `experimental-branch`)
- **[Change]** The combo multiplier now comes from white (boost) people hit in a row: each adds ×0.25 (up to ×5); a blue hit, overheating or a testacoda ends the run (wide loops no longer build it). The run also raises the top speed past the base, with diminishing returns: top = base × (1 + 0.5 × (1 − e^(−in a row/8))): 3 in a row +15%, 5 +23%, 10 +36%, never past +50%. Back to the base when the run ends.
- **[Feel]** The burst from a white person follows Riccardo's sketch: straight up to its peak (+30% of the base top speed) in 0.25 s, a moment held at the top, then down and easing out over 1.5 s (a cosine), back to the speed the car should be at (`BOOST_RISE`, `BOOST_FALL`). It rides on top of the cruising speed instead of being smoothed by it, so the shape shows.
- **[Look]** The people: boost ones are white (were green), costly ones navy blue (were red); the score pop-ups match (white, and blue outlined in white). Lab labels follow.
- **[S]** 71 tests (new: the run in a row and its end, the burst's shape and return), build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: exhaust backfires (branch `experimental-branch`)
- **[Look]** Flame pops from the exhaust when you lift off with the revs at least 0.6 of the bar (bigger the higher they were) and when you reach the green: a hot yellow core and orange tongues behind the car, flickering and shrinking over 0.22 s. `BACKFIRE_FROM`, `BACKFIRE_SIZE`, `BACKFIRE_MS` (0 turns it off) in the Lab under CAR AND CAMERA.
- **[S]** 71 tests, build; checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: Lab settings as defaults, STERZO bar hidden (branch `experimental-branch`)
- **[Tuning]** Riccardo's Lab settings baked in: camera zoom 26 px/m (was 30), junction 470 px down the screen (was 530), backfires smaller (×0.35) and 200 ms, and the pedal-stab shake on at 0.002.
- **[Change]** The STERZO bar is hidden (`SHOW_STEER_BAR` in DonutScene); the balance still plays and the steering still works.
- **[S]** 71 tests, build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] v3.1.0e (branch `experimental-branch`)
- **[Release]** DERAPATE: white boosts in a row build the combo and raise the top speed, the shaped boost burst, white and navy people, exhaust backfires, Riccardo's camera and effect settings, the STERZO bar hidden. Version 3.1.0-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: a steering wheel, an upright rev bar (branch `experimental-branch`)
- **[Art]** Riccardo's steering wheel (`public/assets/donut/wheel.png`, from `assets/Derapate/UI/wheel_000.png`) sits at the bottom of the screen, its centre below the bottom edge so only the top shows; it turns round its rim's centre with the steering (up to 90° at full lock, eased).
- **[Change]** The rev bar stands upright beside the wheel: the white fills from the bottom, the green is the top; in the green the fill is the engine's heat (green, orange, flashing red). The label (GIRI, IN VERDE x2, MOTORE CALDO!, MOTORE FUSO, TESTACODA) sits on top of it.
- **[Change]** The keyboard help line is gone.
- **[Lab]** CAR AND CAMERA → HUD: WHEEL AND REV BAR: the wheel's place (across, down), size, turn at full lock and how quickly it follows; the rev bar's place, height and width.
- **[S]** 71 tests, build; checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: the wheel is the balance (branch `experimental-branch`)
- **[Change]** The steering wheel now shows the balance, as the STERZO bar did: it turns by itself as the drift pulls it (up to 90° at the edge) and you counter-steer to bring it back to straight: turned right, steer left; turned left, steer right. In the green it goes orange near the edge and flashes red at it (staying there is a testacoda).
- **[S]** 71 tests, build; checked in the browser (left alone it drifted to 16°, a short counter-steer brought it back).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: the wheel with the driver's arm, people walking in (branch `experimental-branch`)
- **[Art]** The steering wheel is Riccardo's new sprite with the driver's arm (`public/assets/donut/wheel_v3.webp`), turning round the rim's centre; placed lower and bigger (centre 1060 px down, ×0.85) and turning up to 60° at the edge (was 90°, so the arm doesn't swing too far).
- **[Change]** People appear 14 m up the pavement and walk to their crossing before stepping onto it, so you see them coming (`PEDESTRIANS.APPROACH`, "People walk in from" in the Lab).
- **[S]** 71 tests, build; checked in the browser.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: the wheel without the arm again (branch `experimental-branch`)
- **[Art]** The steering wheel is Riccardo's `wheel_000.webp` (the wheel alone, as WebP): `public/assets/donut/wheel.webp`, replacing the version with the arm and the earlier PNG. Back to centre 1150 px down, ×0.7, 90° at the edge.
- **[S]** 71 tests, build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: the car is Riccardo's renders (branch `experimental-branch`)
- **[Art]** The car is drawn from Riccardo's renders of the full car (`assets/Derapate/Sprite macchina/Completo`, 90 frames turning on the spot, 4° apart). `scripts/donut-car-sprites.py` cuts every frame with the same window, scales them to 0.4 (320x230) and packs them into `public/assets/donut/car_full.webp` (10 columns, 2.3 MB, lossless) with `car_full.json`: the pivot (the car's centre on the ground, worked out from the frames: across, the middle of all of them; down, from the nose-on frame's bumper), the frame facing straight down the screen (12th, heading 45°; the frames turn the other way round as they go), and the car's length in pixels (side on, half the width over 0.6124 for the isometric squash). The game picks the frame for the car's heading, and draws it as long as the block car was (4.4 m × car size × zoom).
- **[Look]** People and the exhaust flame nearer the camera than the car are drawn over it, the others behind; the car keeps a soft shadow. The revs' tints are a copy of the sprite filled with the tint's colour at its opacity over the car.
- **[Lab]** CAR AND CAMERA → CAR: Car sprites (off: the old block car), Sprite size ×, Sprite down (to sit it on its shadow), Car shadow.
- **[Note]** The separate body, wheels and wheel-mask renders aren't used yet.
- **[S]** 71 tests, build; checked in the browser (the right frames as it goes round).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: the car in two layers, on springs (branch `experimental-branch`)
- **[Art]** The car is drawn from Riccardo's separate renders: the wheels (`car_wheels.webp`, 0.6 MB) under the body (`car_body.webp`, 2.1 MB), which gives back the full car. `scripts/donut-car-sprites.py` now packs both with the same window and pivot (found from the full renders, `car.json`), and drops a frame identical to the one before it: the body folder's frame 59 repeats frame 58, which had shifted every later body frame by one. The full-car sheet is gone.
- **[Feat]** A first suspension: the body rides on a damped spring over the wheels (render only, not the rules): it leans out of the turn and tilts a little with the cornering, squats back speeding up and dips forward slowing, rumbles at speed, and bounces when hitting someone or in a testacoda. Lab, CAR AND CAMERA → CAR: lean, tilt, squat, bump, rumble, bounce (springs' frequency), damping; 0 turns each off.
- **[Note]** The Wheels-mask renders (the near-side wheels) aren't used: the wheels under the body already match the full car.
- **[S]** 71 tests, build; checked in the browser (layers line up; the body leans up to about 9 px and 2° at full cornering).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: the body stays on its wheels (branch `experimental-branch`)
- **[Fix]** The wheels looked off the car: the suspension slid the body sideways (up to about 9 px) and tilted it, pulling the arches off the wheels. (The layers themselves line up in every frame: checked against the full renders.) The body now only travels straight up and down over the wheels, at most 3 px (`SUSP_TRAVEL`): it sits a little lower loaded in the turn, lifts speeding up and dips slowing, rumbles at speed, bounces on hits. The sideways lean and the tilt are gone.
- **[S]** 71 tests, build; checked in the browser (body and wheels never more than 0 px apart sideways, about 2 px up and down, no tilt).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: voxel tyre smoke (branch `experimental-branch`)
- **[Look]** Smoke from the two rear tyres as little grey cubes (drawn like the junction's blocks: two shaded sides and a top): they kick back off the tyre, rise, grow to four times their size and fade, thickest just after they appear. More the harder the wheels spin: with the pedal down and the revs up, the most in a testacoda, a wisp coasting off the pedal or stalled, none standing still. Nearer the camera than the car they're drawn over it. Render only. Lab, CAR AND CAMERA → CAR: Tyre smoke (cubes a second, 80; 0 off), size, how long it lasts, how fast it rises, thickness.
- **[S]** 71 tests, build; checked in the browser (a trail of rising cubes behind the car at speed).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] DERAPATE: tyre marks from the rear tyres, finer smoke (branch `experimental-branch`)
- **[Fix]** The tyre marks came from the car's centre. They now come from the two rear tyres, placed from Riccardo's wheel renders: the rear axle 1.29 m behind the centre and the tyres 0.77 m either side (both times the car size; `REAR_AXLE`, `HALF_TRACK` in the Lab). The same measurements put the car's centre on the ground within a pixel of the sprite's pivot. The smoke comes from the same two tyres.
- **[Look]** Better marks: rubber is laid on a texture over the road, a strip as wide as the tyre on the ground (0.26 m × car size, drawn in perspective, a little ragged, with a darker core), darker with the pedal down and the revs up, a trace when coasting; laps over the same place build up darker, and it fades slowly (3% a second) instead of the trail being cut off. Drawn once per step instead of redrawing the whole trail every frame. Cleared on a restart or when the Lab moves the camera or the junction.
- **[Look]** The smoke is made of cubes about half the size, three and a half times as many (260 a second at full wheelspin, up to 800 at once), the same amount of smoke.
- **[S]** 71 tests, build; checked in the browser (the strip starts under the near rear tyre; frames about 0.6 ms median with the smoke).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-02] v3.1.1e (branch `experimental-branch`)
- **[Release]** DERAPATE: the steering wheel HUD (the balance) and the upright rev bar, people walking in, Riccardo's car renders in two layers on springs, voxel tyre smoke, tyre marks from the rear tyres. Version 3.1.1-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-03] DERAPATE: sound (branch `experimental-branch`)
- **[Audio]** Riccardo's recordings (`assets/Audio/SFX/Derapate`), 14 of them picked and converted to mono 44.1 kHz WAV in `public/assets/audio/derapate` (1.6 MB); the four engine loops and the hot whine crossfaded over 60 ms at their loop point so they loop without a click.
- **[Audio]** `DonutAudio`: the engine is four loops recorded at rising revs, blended by the rev bar (each loudest at its own revs, pitched up past them, still climbing during a white burst), louder with the pedal down, bouncing at the top in the green, a hot whine rising under it as the engine nears overheating, cut out when it stalls. The tyres' screech loop grows with wheelspin under power, the balance being out and the steering, loud in a testacoda. One-shots: nitrous on a white person; a thud and a short horn on a blue one; a screech for the testacoda; the overheat when the engine gives out; exhaust pops on reaching the green and, lifting off at high revs, pops plus the turbo's blow-off. The game's music drops to 35% while driving and comes back after.
- **[Lab]** CAR AND CAMERA → SOUND: engine, tyre screech, effects, music under the engine (on top of Settings' volumes).
- **[S]** 71 tests, build; checked in the browser (all 14 loaded, the engine layers handing over as the revs climb).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-03] DERAPATE: green whoosh, louder screech, a deeper engine (branch `experimental-branch`)
- **[Audio]** Reaching the green plays Riccardo's whoosh (`Boost/00000000_6474.wav` → `green.wav`) instead of the exhaust pops (the flame stays).
- **[Audio]** The tyre screech is much louder: both screech recordings raised by about 10 dB (limited) and the screech volume at 1 (was 0.45); at speed in the green it now plays at about 0.8 (was 0.34) of a louder file.
- **[Audio]** A deeper engine: the two high loops are gone; the engine is the low loop Riccardo liked, then a deep exhaust (`car_11_exh` → `engine_mid.wav`, crossfaded to loop) and the second engine loop only at the very top, climbing in pitch more gently (`ENGINE_PITCH` 0.35 a bar, was 0.7; at the top the loudest loop plays at 0.96 of its pitch).
- **[S]** 71 tests, build; checked in the browser (all loaded; at the top the deep layers carry it).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-03] DERAPATE: motore caldo crackle, a proper overheat, occasional revs (branch `experimental-branch`)
- **[Audio]** MOTORE CALDO is the straight-pipe crackle (`car_01_exh_mb_ee_smarmittata` → `engine_hot.wav`, looped): it comes in as the heat passes three quarters and climbs in pitch towards overheating (0.85 → 1.45). No longer used for the backfire pops.
- **[Audio]** Overheating plays `Engine_overheat.mp3` (trimmed to 3.8 s, faded) and, overlapping as it fades, `Car_Down.mp3` 2.4 s in (louder, limited).
- **[Audio]** Revs from `Revving.wav`: three revs cut out of it (`rev_1`–`rev_3`, faded, limited) play now and then on a fresh stab of the pedal after a lift: 40% of the time, at least 4 s apart.
- **[Lab]** SOUND: motore caldo crackle, car dies after, rev on a stab (chance), revs at least apart.
- **[S]** 71 tests, build; checked in the browser (a rev on a stab, the whoosh into the green, the crackle rising, the overheat then the car dying 2.4 s later).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-03] DERAPATE: vroom, quieter flame, a new stall, a soundtrack (branch `experimental-branch`)
- **[Audio]** The engine dipped when accelerating: the blend handed over to a recording lower in pitch than the one before. Now it's one engine (the low loop Riccardo liked) whose pitch climbs all the way with the revs (0.75 at rest, +0.75 at the top of the white), with the deep exhaust growing under it; every fresh stab of the pedal surges it (louder, a quick jump in pitch, fading over 0.6 s) and most times (85%, at least 0.8 s apart) a rev from the revving recording rips over it. The second engine loop is gone.
- **[Audio]** The flame's pops and blow-off are much quieter (`FLAME_VOLUME` 0.3; were 0.8 and 0.55).
- **[Audio]** Overheating redone as one event with the stall: the engine loops cut at once, the engine winds down and dies (`Car_Down`) with the overheat's hiss over it (trimmed to 2.4 s, at half volume) while the car coasts back to the middle; a restart stops them. The delayed car-dying sound is gone.
- **[Audio]** DERAPATE's soundtrack: Zutomayo_001 (re-encoded to 128 kbps, 3.9 MB) loops while driving, loaded in the background so the game starts at once; the game's music fades out and pauses, and comes back after. Follows Settings' music volume × `MUSIC_VOLUME` (0.7).
- **[Lab]** SOUND: engine pitch climb, overheat hiss, flame pops, rev on a stab (volume, chance, gap), soundtrack.
- **[S]** 71 tests, build; checked in the browser (the pitch climbing press after press with a surge on each, a rev on every stab, the whoosh into the green, the dying sounds at the stall, the game's music paused and the song playing).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-03] DERAPATE: revs on the beat, the song keeps going (branch `experimental-branch`)
- **[Fix]** The revs came late: each clip cut from the revving recording began with 0.4–1.4 s of build-up before the actual rev. They're re-cut to start on their attack (loud within 10–30 ms, peaking at about 0.2 s), so the vroom lands on the press; and each plays pitched to the engine's revs at that moment instead of at random.
- **[Fix]** The soundtrack stopped right after starting on Riccardo's side (it plays on here through the real flow: start screen, menu, DERAPATE). Whatever stops it (focus, full screen, the browser), it now picks up again by itself while DERAPATE is showing.
- **[S]** 71 tests, build.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-03] v3.1.2e (branch `experimental-branch`)
- **[Release]** DERAPATE sound: engine with vroom surges and revs, tyre screech, motore caldo crackle, the overheat and the engine dying, boosts, hits, green whoosh, quiet flame pops, and the Zutomayo soundtrack. Version 3.1.2-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-05] DERAPATE: deep clean (branch `experimental-branch`)
- **[Refactor]** `DonutScene` split (483 → 334 lines): the HUD (texts, steering wheel, rev bar, the big message) is its own `DonutHud`; the soundtrack moved into `DonutAudio`; the Lab remembers by itself whether it was open (`donutLabWasOpen`, `close()`). One frame time per frame, the sim's events in a switch, hits read the person's kind (not the sign of the points), typed keys, the controls object reused. The hidden STERZO bar's code is gone.
- **[Refactor]** `DonutSim` split into revs, speed, balance and people steps, people cleared in place; bit-identical to before (5 seeds × 2 minutes compared step by step).
- **[Refactor]** `DonutRenderer`: the block car is gone (the sprites are the car, `CAR_SPRITES` removed); it loads its own sheets and cuts the frames as `car.json` says (frame size, columns: no copy in the code); `reset()` clears rubber, smoke, flame and springs on a restart; the flame times itself.
- **[Perf]** Everything drawn every frame goes in as triangles (quads as two, shadows as fans) instead of filled paths, which Phaser cuts into triangles again every frame, leaving garbage; no throwaway point objects in the drawing; smoke cubes recycled. In the same tab, the switch to triangles took the heap churn with the smoke from about 50 to 5–8 MB per 600 frames.
- **[Perf]** The HUD rewrites a text only when it changes (Phaser redraws and re-uploads a text even when only its colour is set: the rev bar's label was redrawn every frame); the score formatter is made once.
- **[Perf]** `DonutAudio`: loop volume and pitch go to Web Audio only when they change (to the thousandth); the song and nine one-shots (1.1 MB) load in the background, so DERAPATE starts sooner (a sound not in yet is skipped). Named events (`lock`, `spin`, `hit`, `backfire`, `overheat`) instead of sound names in the scene.
- **[Fix]** Phones: re-entering DERAPATE no longer adds two more touch points each time; the touch controls redraw only when a finger comes, goes or steers.
- **[Cleanup]** Red/green → blue/white in comments, the Lab's shake button and the tests; the Lab's unused switch rows and DonutTouch's unused getter removed; LLM_CONTEXT's DERAPATE section rewritten (it still described the pedal-only prototype).
- **[Tests]** The same seed and controls replay identically; the crowd never builds up over ten minutes.
- **[S]** tsc, 73 tests, build. In the browser, the same scripted drive on the committed and the cleaned version: in the game's real loop (120 Hz) per frame median 1.1 → 1.0–1.1 ms, p99 2.2–2.3 → 1.9–2.0 ms, worst 2.9–3.0 → 2.5–2.8 ms, no frames dropped; stepped at 60 Hz by hand, median 2.0 → 0.7 ms, p99 2.9 → 1.9 ms. Phone view: thumb controls and the bigger HUD work, nothing piles up over restarts.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-05] v3.1.3e (branch `experimental-branch`)
- **[Release]** DERAPATE deep clean: scene split (HUD, audio, Lab flag), lighter drawing (triangles, no per-frame garbage), HUD texts only on change, background sound loading, phone pointer fix, new tests. Version 3.1.3-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-05] DERAPATE: lighting, and the Lab in LOOK and FEEL tabs (branch `experimental-branch`)
- **[Cleanup]** Deleted the unused `public/assets/donut/car_temp.png`/`.json` and `scripts/donut-car.py`.
- **[Look]** Lighting like the Studio Lab's, always on (where WebGL has shader derivatives): dusk over the junction, four sodium street lamps on the corners (posts, glowing heads, orbs and glows), their light pooling on the ground as isometric ellipses; the car's renders lit with a rim from the lamps' heads as it swings past; headlights ahead of the car and a red tail-light glow; the exhaust flame lights what's round it; a flash of light where a white or blue person is hit; people, smoke and lamp posts lit per face on the CPU; the camera's pass (bloom, grading, vignette, grain, colour fringes, tilt-shift, CRT) on the junction only, the HUD crisp. New `DonutLight.ts` (settings, lamps, maths), `DonutLighting.ts` (on screen), `DonutIso.ts` (the projection).
- **[Shared]** `LitPipeline`: an optional falloff scale (isometric ground) and per-light rim offsets, both defaulting to the fighting game's behaviour; `AtmospherePipeline` takes a narrower settings type and skips its rays pass when there are no rays (saves a 32-sample pass at quarter size in both games); the glow textures are exported. The Studio Lab checked: unchanged.
- **[Perf]** The junction is painted once into a texture instead of re-batching hundreds of Graphics commands every frame; the CPU time per frame is the same lit or not (median 0.5–0.9 ms in the real loop at 120 Hz).
- **[Lab]** Always windowed (no full screen), in two tabs (TAB, or the buttons): LOOK has everything you see or hear (LIGHTS with a lamp editor and rings on screen to drag lamps, CAMERA, CAR, EFFECTS, HUD, SOUND), FEEL how it plays; TEST (restart, freeze, step, slow motion, readouts, live values, find, copy/paste/reset) in both. G switches the lighting off and on to compare. H is gone (L closes the Lab).
- **[Lab]** FEEL simplified from about 50 settings to 19, in plain words and clear units: seconds to the green, seconds to stop, top speed in km/h, tightest and widest donut, seconds in the green, short lift keeps it; how much the wheel wanders (and ×in the green), steering strength, seconds at the edge; a person about every N s, white people %, boost burst %, combo top speed %; points. The rest are hidden on purpose (`HIDDEN`, with reasons) and keep their values; saved or pasted changes to them are skipped.
- **[Fix]** Leaving DERAPATE with the lights switched off in the Lab crashed (the Lab turned them back on after the scene's objects were gone); they now come back on only when the Lab is closed with L.
- **[Tests]** The catalogue: every number shown once or hidden on purpose, ranges hold the defaults, FEEL at most 20; the worked-out settings go both ways; copy/paste with the lamps; the light maths (falloff, lit colours, lamps from JSON, the isometric falloff measuring ground metres). 78 tests.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-05] DERAPATE: times of day, headlight cones, lights off on phones (branch `experimental-branch`)
- **[Look]** Five lighting presets for the times of day, picked in the Lab (LOOK → LIGHTS → TIME OF DAY): dawn (pink first light, lamps going off), daylight (the colours as drawn, no lamps, lamp heads grey), sunset (a warm low light, lamps coming on), blue hour (the defaults) and night (deep blue, strong lamps and headlights). Each sets the same settings (ambient, lamps, glow, car lights, rim, bloom, grading) so a day cycle can fade from one to the next later; the button of the time the light is set to lights up.
- **[Look]** Headlights as two cones of light from the car's front corners, along the way it points (reach and spread in the Lab); people and smoke in the beams are lit too. Lights go to the shaders most important first (lamps, headlights, flame, flashes, then the tail-light glow).
- **[Shared]** `LitPipeline`: optional cone lights (a direction and inner/outer angles per light; none for the fighting game, which looks the same).
- **[Phones]** A LUCI button next to restart and menu switches the lighting off (and back on), remembered on that phone; the Lab no longer opens by itself on a phone (no L key to close it).
- **[Fix]** Opening the Lab twice (L while it was already opening) left a second one behind; the scene now ignores it.
- **[Tests]** Cones (full ahead, fading to the edge, nothing behind), the times of day (same settings each, the blue hour is the defaults, recognised when set). 80 tests.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-05] v3.1.4e (branch `experimental-branch`)
- **[Release]** DERAPATE lighting (dusk street lamps, rim-lit car, headlight cones, flashes, camera effects), five time-of-day presets, a LUCI button on phones, and the Lab in windowed LOOK and FEEL tabs with a short FEEL list. Version 3.1.4-e.

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-11] Its own project (v0.1.0)
- **[Arch]** Moved out of Super Smash Fioi into this repository, self-contained: Vite + TypeScript + Phaser 3.90, its own title scene (waits for the font, starts on a key, tap or gamepad button, which also unlocks sound; ESC in the game comes back to it).
- **[Arch]** Laid out by role: `src/game` (the rules and settings, plain data, tested), `src/view` (drawing, lighting, HUD, sound, touch), `src/lab` (the Lab and its controls), `src/engine` (the lit and atmosphere shaders, glow textures, the fixed-step clock, device helpers), `src/scenes` (title, game).
- **[Cleanup]** The shared pieces brought along were trimmed to what DERAPATE uses: the lit shader without the fighting game's backlit scenery and per-object rim; the atmosphere pass without sun rays and mist; the Lab's controls without the fighting game's frame counts. The game's AudioManager is gone: one-shots play with their own pitch variety, every volume is the Lab's (the soundtrack's default 0.56 keeps it as loud as before, which was Settings' 0.8 × the Lab's 0.7).
- **[Assets]** `public/assets/car` (the sheets and `car.json`, from `scripts/car-sprites.py`), `public/assets/ui/wheel.webp`, `public/assets/audio` (the effects), `public/assets/music/zutomayo_001.mp3`, `public/fonts` (Pixeloid Sans).
- **[S]** tsc, 25 tests, build; checked in the browser (title, the game lit with sound and soundtrack, the Lab opening and closing, ESC to the title with every sound stopped; the phone view with its thumb controls and LUCI).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-11] Online at :8080
- **[Deploy]** `npm run deploy` (`deploy.sh`): builds and uploads to `/var/www/derapate` on the droplet and serves it at http://138.68.126.112:8080, taking that port over from Super Smash Fioi's experimental build (its nginx site `sgalalla-experimental` is switched off; its files in `/var/www/sgalalla-experimental` and its game server stay, so it can come back).

------------------------------------------------------------------------------------------------------------------------------------
### [2026-10-15] Deploy alongside Super Smash Fioi's experimental build
- **[Deploy]** That build moved to port 8081, so `deploy.sh` no longer switches its site off.
