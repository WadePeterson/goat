const flappyBirdCat = require('images/gamifly/spritesheets/flappybirdcat.png');

export const key = 'flappybirdcat';

export function createSpriteSheet(game: Phaser.Game) {
  game.load.spritesheet(key, flappyBirdCat, 16, 16, 3);
}