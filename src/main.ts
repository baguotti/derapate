import Phaser from 'phaser';
import { DonutScene } from './scenes/DonutScene';
import { TitleScene } from './scenes/TitleScene';
import './style.css';

new Phaser.Game({
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#000000',
    fps: { target: 60, smoothStep: true },
    scene: [TitleScene, DonutScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { gamepad: true },
});
