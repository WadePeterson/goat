import { LevelConfig } from '../levels/utils';
import * as Utils from '../utils';

export enum GameStates {
  Boot = 'boot',
  Dungeon = 'dungeon'
}

export function preloadLevel(game: Phaser.Game, config: LevelConfig) {
  const loadedTiles: { [key: string]: boolean } = {};

  for (let row = 0; row < config.tileData.length; row++) {
    for (let col = 0; col < config.tileData[row].length; col++) {
      const tileChar = config.tileData[row][col];
      const tileConfig = Utils.Assets.getTileConfig(tileChar);

      if (!tileConfig) {
        continue;
      }

      const tileKey = tileConfig.key;
      if (!loadedTiles[tileKey]) {
        game.load.image(tileKey, tileConfig.imgPath);
        loadedTiles[tileKey] = true;
      }
    }
  }
}
