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
  BULLET: 'bullet',
  BANANA: 'banana',
  GRASS: 'grass',
  GROUND1: 'ground1',
  MONKEY: 'monkey',
};

interface TileConfig {
  key: string;
  imgPath: string;
}

export interface AnimationConfig {
  name: string;
  frames: number[];
  frameRate: number;
  loop: boolean;
  autoPlay?: boolean;
}

function tile(key: string, imgPath: string): TileConfig {
  return { key, imgPath };
}

const tileMap: { [key: string]: TileConfig } = {
  b: tile(Sprites.BANANA, require('../assets/sprites/tiles/banana.png')),
  s: tile(Sprites.GRASS, require('../assets/sprites/tiles/grass.png')),
  g: tile(Sprites.GROUND1, require('../assets/sprites/tiles/ground1.png')),
};

export function getTileConfig(tileKey: string) {
  return tileMap[tileKey];
}
