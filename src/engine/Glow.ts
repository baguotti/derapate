import Phaser from 'phaser';

/** Glow textures tinted per light: a bright orb with a hot centre, and a soft glow fading out to its edge. */
export const GLOW_TEXTURES = { orb: 'light_orb', halo: 'light_halo', size: 256 } as const;

/** Makes them (once per game). */
export function createGlowTextures(scene: Phaser.Scene): void {
    radialTexture(scene, GLOW_TEXTURES.orb, [[0, 1], [0.12, 0.95], [0.35, 0.3], [1, 0]]);
    radialTexture(scene, GLOW_TEXTURES.halo, [[0, 1], [0.25, 0.42], [0.5, 0.125], [0.75, 0.016], [1, 0]]);
}

function radialTexture(scene: Phaser.Scene, key: string, stops: readonly [number, number][]): void {
    if (scene.textures.exists(key)) return;
    const size = GLOW_TEXTURES.size;
    const texture = scene.textures.createCanvas(key, size, size);
    if (!texture) return;
    const context = texture.getContext();
    const middle = size / 2;
    const gradient = context.createRadialGradient(middle, middle, 0, middle, middle, middle);
    for (const [offset, alpha] of stops) gradient.addColorStop(offset, `rgba(255, 255, 255, ${alpha})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    texture.refresh();
}
