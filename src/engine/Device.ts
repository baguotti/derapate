import Phaser from 'phaser';

/**
 * The device: whether it's a phone (a touch screen without a mouse), full
 * screen on a tap there (browsers only allow it from one), and which gamepad
 * button confirms (Nintendo pads put A elsewhere).
 */

export function isPhone(scene: Phaser.Scene): boolean {
    return scene.sys.game.device.input.touch && window.matchMedia('(pointer: coarse)').matches;
}

/** On a phone, full screen (call it from a tap); elsewhere nothing. */
export function enterFullscreenOnPhone(scene: Phaser.Scene): void {
    if (!isPhone(scene) || scene.scale.isFullscreen) return;
    try {
        scene.scale.startFullscreen();
    } catch {
        // Not allowed here (some browsers, iOS Safari): the game still fits the screen
    }
}

/** The button index that confirms (A) on `pad`: a single Joy-Con held sideways, a Nintendo layout, or the standard one. */
export function confirmButtonIndex(pad: Gamepad): number {
    const id = pad.id.toLowerCase();
    if (id.includes('joy-con (l)') || id.includes('joy-con l')) return 2;
    if (id.includes('joy-con (r)') || id.includes('joy-con r')) return 0;
    if (['nintendo', 'switch', 'pro controller', 'joy-con'].some(name => id.includes(name))) return 1;
    return 0;
}
