import * as Utils from './utils';

class JumpState {
  private static NOT_JUMPING = 0;
  private static JUMPING = 1;
  private static WAITING_TO_RELEASE_JUMP = 2;

  private state = JumpState.NOT_JUMPING;
  private timeSinceTouchingGround = Infinity;
  private jumpGravityInitial = 225;
  private jumpGravityFinal = 1125;
  private jumpSpeedInitial = 200;
  private jumpSpeedGravityThreshold = 120;
  private releasedJump = false;
  private hangTime = 100;
  private jumpSound: Phaser.Sound;

  constructor(private game: Phaser.Game, private player: Player, private keys: Utils.Input.KeyMap) {
    this.jumpSound = game.add.audio(Utils.Assets.SoundFX.JUMP);
  }

  update() {
    if (this.player.body.touching.down) {
      this.timeSinceTouchingGround = 0;
    } else {
      this.timeSinceTouchingGround += this.game.time.physicsElapsedMS;
    }

    switch (this.state) {
      default:
      case JumpState.NOT_JUMPING:
        this.player.body.gravity.y = this.jumpGravityFinal;
        this.releasedJump = false;

        if (this.keys.isDown(Utils.Input.Actions.Jump)) {
          if (this.timeSinceTouchingGround < this.hangTime) {
            this.player.body.gravity.y = this.jumpGravityInitial;
            this.player.body.velocity.y = -this.jumpSpeedInitial;
            this.state = JumpState.JUMPING;
            this.jumpSound.play();
          } else {
            this.state = JumpState.WAITING_TO_RELEASE_JUMP;
          }
        }
        break;
      case JumpState.JUMPING:
        if (!this.keys.isDown(Utils.Input.Actions.Jump)) {
          this.releasedJump = true;
        }

        if (!this.releasedJump && this.player.body.velocity.y < -this.jumpSpeedGravityThreshold) {
          this.player.body.gravity.y = this.jumpGravityInitial;
        } else {
          this.player.body.gravity.y = this.jumpGravityFinal;
        }
        if (this.player.body.touching.down) {
          this.state = this.keys.isDown(Utils.Input.Actions.Jump) ? JumpState.WAITING_TO_RELEASE_JUMP : JumpState.NOT_JUMPING;
        }
        break;
      case JumpState.WAITING_TO_RELEASE_JUMP:
        if (!this.keys.isDown(Utils.Input.Actions.Jump)) {
          this.state = JumpState.NOT_JUMPING;
        }
        break;
    }
  }
}

export class Player {
  get body() { return this.sprite.body; }
  readonly sprite: Phaser.Sprite;
  private game: Phaser.Game;
  private keys: Utils.Input.KeyMap;
  private jumpState: JumpState;

  private maxWalkingSpeed = 90;
  private walkAcceleration = 200;
  private skidDeceleration = 450;
  private stopDeceleration = 200;

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
    this.jumpState = new JumpState(game, this, keys);
  }

  moveX(directionToMove: number) {
    const currentDirection = this.body.velocity.x < 0 ? -1 : 1;
    const speed = currentDirection * this.body.velocity.x;

    if (currentDirection !== directionToMove) {
      this.body.acceleration.x = this.skidDeceleration * directionToMove;
    } else if (speed < this.maxWalkingSpeed) {
      this.body.acceleration.x = this.walkAcceleration * directionToMove;
    } else {
      this.body.acceleration.x = 0;
      this.body.velocity.x = this.maxWalkingSpeed * directionToMove;
    }
  }

  update() {
    const rightDown = this.keys.isDown(Utils.Input.Actions.MoveRight);
    const leftDown = this.keys.isDown(Utils.Input.Actions.MoveLeft);

    if (rightDown && !leftDown) {
      this.sprite.animations.play('walking');
      this.sprite.scale.x = 1;
      this.sprite.anchor.x = 1;
      this.moveX(1);
    } else if (leftDown && !rightDown) {
      this.sprite.animations.play('walking');
      this.sprite.scale.x = -1;
      this.sprite.anchor.x = 0;
      this.moveX(-1);
    } else {
      this.sprite.animations.stop();
      const currentDirection = this.body.velocity.x < 0 ? -1 : 1;
      const speed = currentDirection * this.body.velocity.x;

      if (speed > this.stopDeceleration) {
        this.body.acceleration.x = this.stopDeceleration * -currentDirection;
      } else {
        this.body.acceleration.x = 0;
        this.body.velocity.x = 0;
      }
    }

    this.jumpState.update();
  }
}
