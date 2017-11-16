import { Entity } from './entityUtils';
import { Components } from '../components';

export function createPlayer(): Entity {
  return new Entity()
    .addComponent(Components.Position({ x: 1, y: 1 }));
}

import * as Utils from '../utils';

export class Player {
  get body() { return this.sprite.body; }
  readonly sprite: Phaser.Sprite;
  private game: Phaser.Game;
  private keys: Utils.Input.KeyMap;

  private maxWalkingSpeed = 90;

  constructor(game: Phaser.Game, keys: Utils.Input.KeyMap) {
    this.game = game;
    this.keys = keys;
    this.sprite = game.add.sprite(game.world.top, game.world.left, Utils.Assets.Sprites.MONKEY);
    this.body.collideWorldBounds = true;
    this.body.setSize(14, 13, 1, 3);
    this.game.camera.follow(this.sprite);
    this.sprite.checkWorldBounds = true;
    this.sprite.animations.add('walking', [0, 1, 2, 3], 10, true);
    this.sprite.anchor.x = 1;
    this.sprite.anchor.y = 0;
  }

  update() {
    const pressingUp = this.keys.isDown(Utils.Input.Action.MoveUp);
    const pressingDown = this.keys.isDown(Utils.Input.Action.MoveDown);
    const pressingRight = this.keys.isDown(Utils.Input.Action.MoveRight);
    const pressingLeft = this.keys.isDown(Utils.Input.Action.MoveLeft);

    let xDirection = (pressingRight ? 1 : 0) - (pressingLeft ? 1 : 0);
    let yDirection = (pressingDown ? 1 : 0) - (pressingUp ? 1 : 0);

    if (xDirection || yDirection) {
      this.sprite.animations.play('walking');

      if (xDirection && yDirection) {
        xDirection = xDirection * Utils.Math.sinPiOver4;
        yDirection = yDirection * Utils.Math.sinPiOver4;
      }

      if (xDirection > 0) {
        this.sprite.scale.x = 1;
        this.sprite.anchor.x = 1;

      } else if (xDirection < 0) {
        this.sprite.scale.x = -1;
        this.sprite.anchor.x = 0;
      }

      this.body.velocity.x = this.maxWalkingSpeed * xDirection;
      this.body.velocity.y = this.maxWalkingSpeed * yDirection;
    } else {
      this.sprite.animations.stop();
      this.body.velocity.y = 0;
      this.body.velocity.x = 0;
    }
  }
}
