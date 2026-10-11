import Phaser from 'phaser';
import { DOCK_WIDTH, element, type LabPanelBox } from './LabUi';

/**
 * The Lab's view: the game's container narrowed to the middle of the page
 * (Phaser fits the game into it), and the panels moved into a column either
 * side. Destroyed, the game has the whole page again.
 */
export class WindowedView {
    private readonly scene: Phaser.Scene;
    private readonly groups: { left: LabPanelBox[]; right: LabPanelBox[] }[];
    private readonly container: HTMLElement | null;
    private columns: { left: HTMLElement; right: HTMLElement } | null = null;

    constructor(scene: Phaser.Scene, groups: { left: LabPanelBox[]; right: LabPanelBox[] }[]) {
        this.scene = scene;
        this.groups = groups;
        this.container = scene.game.canvas.parentElement;
        const left = element('div');
        left.className = 'lab-dock left';
        const right = element('div');
        right.className = 'lab-dock right';
        document.body.append(left, right);
        this.columns = { left, right };
        for (const group of this.groups) {
            for (const box of group.left) box.dock(left);
            for (const box of group.right) box.dock(right);
        }
        this.fitGame();
    }

    destroy(): void {
        if (!this.columns) return;
        this.columns.left.remove();
        this.columns.right.remove();
        this.columns = null;
        this.fitGame();
    }

    private fitGame(): void {
        const style = this.container?.style;
        const on = this.columns !== null;
        if (style) {
            // The page's stylesheet makes the container 100% wide: the width is set outright
            style.position = on ? 'fixed' : '';
            style.top = on ? '0' : '';
            style.left = on ? `${DOCK_WIDTH}px` : '';
            style.width = on ? `calc(100% - ${2 * DOCK_WIDTH}px)` : '';
            style.height = on ? '100%' : '';
        }
        // Once now and once the next frame: a refresh during the scene's start doesn't stick
        const scale = this.scene.scale;
        scale.refresh();
        requestAnimationFrame(() => scale.refresh());
    }
}
