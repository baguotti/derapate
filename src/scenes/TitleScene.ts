import Phaser from 'phaser';
import { enterFullscreenOnPhone, isPhone } from '../engine/Device';

/**
 * The title: DERAPATE and how to play, until a key, a tap or a gamepad
 * button starts it (the browser lets sound play only after one). It waits for
 * the font so the writing never flashes in another one. ESC in the game comes
 * back here.
 */

const FONT = '"Pixeloid Sans"';

export class TitleScene extends Phaser.Scene {
    private started = false;

    constructor() {
        super({ key: 'TitleScene' });
    }

    create(): void {
        this.started = false;
        this.cameras.main.setBackgroundColor('#0f0f0f');
        const show = () => this.showTitle();
        // Wait for the font (or give up after a moment and use it once it's there)
        Promise.race([
            Promise.all([document.fonts.load(`400 1em ${FONT}`), document.fonts.load(`700 1em ${FONT}`)]),
            new Promise(resolve => setTimeout(resolve, 1500)),
        ]).then(show, show);
    }

    update(): void {
        if (this.started) return;
        for (const pad of navigator.getGamepads()) {
            if (pad?.buttons.some(button => button.pressed)) this.start();
        }
    }

    private showTitle(): void {
        if (!this.sys.isActive()) return;
        const { width, height } = this.scale;
        const phone = isPhone(this);
        const style = { fontFamily: FONT, color: '#e8e2cf', stroke: '#000000', strokeThickness: 6 };
        this.add.text(width / 2, height * 0.36, 'DERAPATE', { ...style, fontSize: '140px', color: '#ffdd66', strokeThickness: 10 }).setOrigin(0.5);
        const prompt = this.add.text(width / 2, height * 0.58, phone ? 'TOCCA PER INIZIARE' : 'PREMI UN TASTO', { ...style, fontSize: '40px' }).setOrigin(0.5);
        this.tweens.add({ targets: prompt, alpha: 0.35, duration: 700, yoyo: true, repeat: -1 });
        const help = phone
            ? 'POLLICE SINISTRO STERZA · DESTRO ACCELERA'
            : 'SPAZIO / ↑ ACCELERA · ← → STERZA · R RICOMINCIA · L LAB';
        this.add.text(width / 2, height * 0.86, help, { ...style, fontSize: '24px', color: '#9e9e9e', strokeThickness: 4 }).setOrigin(0.5);

        this.input.keyboard?.once('keydown', () => this.start());
        this.input.once('pointerup', () => {
            // Full screen only from a tap: the browser refuses it otherwise
            enterFullscreenOnPhone(this);
            this.start();
        });
    }

    private start(): void {
        if (this.started) return;
        this.started = true;
        this.scene.start('DonutScene');
    }
}
