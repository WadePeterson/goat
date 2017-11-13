import * as Phaser from 'phaser-ce';

export interface PhaserArcadeGameClass<T extends PhaserArcadeGame> {
  new (container: Element): T;
}

export abstract class PhaserArcadeGame extends Phaser.Game {
  constructor(container: Element) {
    const aspectRatio = 256 / 224;

    let width = container.clientWidth;
    let height = width / aspectRatio;

    if (height > container.clientHeight) {
      height = container.clientHeight;
      width = height * aspectRatio;
    }

    super(width, height, Phaser.AUTO, container, null);
  }
}
