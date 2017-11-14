import { LevelState } from '../states/LevelState';

export const Fonts = {
  PRESS_START: 'press_start',
};

export const SoundFX = {
  JUMP: 'jump',
  DEATH: 'death',
  BANANA: 'bananaSound',
};

export const Music = {
  SONG2: 'baby_monkey',
  SONG1: 'song1',
};

export const Sprites = {
  BANANA: 'banana',
  GRASS: 'grass',
  GROUND1: 'ground1',
  MONKEY: 'monkey',
};

type AddToLevel = (level: LevelState, sprite: Phaser.Sprite) => void;

interface TileConfig {
  key: string;
  imgPath: string;
  addToLevel: AddToLevel;
}

const TileTypes = {
  BANANA: 'banana',
  WALL: 'wall',
};

const defaultTileTypeBehavior: { [key: string]: AddToLevel } = {
  [TileTypes.BANANA]: (level, sprite) => level.bananas.add(sprite),
  [TileTypes.WALL]: (level, sprite) => {
    level.walls.add(sprite);
    sprite.body.immovable = true;
  },
};

function tile(key: string, imgPath: string, addToLevel: string | AddToLevel): TileConfig {
  if (typeof addToLevel === 'string') {
    const tileType = addToLevel;

    addToLevel = defaultTileTypeBehavior[tileType];

    if (!addToLevel) {
      throw new Error('no default behavior for TileType: ' + tileType);
    }
  }

  return { key, imgPath, addToLevel };
}

const tileMap: { [key: string]: TileConfig } = {
  b: tile(Sprites.BANANA, require('../assets/sprites/tiles/banana.png'), TileTypes.BANANA),
  s: tile(Sprites.GRASS, require('../assets/sprites/tiles/grass.png'), TileTypes.WALL),
  g: tile(Sprites.GROUND1, require('../assets/sprites/tiles/ground1.png'), TileTypes.WALL),
};

export function getTileConfig(tileKey: string) {
  return tileMap[tileKey];
}
