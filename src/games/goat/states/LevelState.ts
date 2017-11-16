import { PauseMenu } from './PauseMenu';
import { Player } from '../entities/player';
import levels, { LevelConfig } from '../levels';
import * as Utils from '../utils';
import { GameStates } from './stateUtils';

export class LevelState extends Phaser.State {
  game: Phaser.Game;
  config: LevelConfig;
  walls: Phaser.Group;
  bananas: Phaser.Group;
  enemies: Phaser.Group;
  player: Player;
  header: GameHeaderText;
  levelIndex = 0;
  stats: LevelStats;
  keys: Utils.Input.KeyMap;
  success: boolean;
  isPaused: boolean;
  pauseMenu: PauseMenu;
  backgroundMusic: Phaser.Sound;
  bananaSound: Phaser.Sound;
  deathSound: Phaser.Sound;

  preload() {
    this.config = levels[this.levelIndex];
    this.walls = this.add.group();
    this.bananas = this.add.group();
    this.enemies = this.add.group();
    this.loadTiles();
  }

  private loadTiles() {
    const loadedTiles: { [key: string]: boolean } = {};

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileChar = this.config.tileData[row][col];
        const tileConfig = Utils.Assets.getTileConfig(tileChar);

        if (!tileConfig) {
          continue;
        }

        const tileKey = tileConfig.key;
        if (!loadedTiles[tileKey]) {
          this.game.load.image(tileKey, tileConfig.imgPath);
          loadedTiles[tileKey] = true;
        }
      }
    }
  }

  create() {
    this.game.stage.backgroundColor = this.config.backgroundColor;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.world.setBounds(0, 0, this.config.tileData[0].length * 16, this.config.tileData.length * 16);
    this.game.world.enableBody = true;
    this.game.stage.smoothed = false;
    this.bananaSound = this.game.add.audio(Utils.Assets.SoundFX.BANANA);
    this.deathSound = this.game.add.audio(Utils.Assets.SoundFX.DEATH);

    this.keys = new Utils.Input.KeyMap(this.game);
    this.pauseMenu = new PauseMenu(this.game, this);

    this.player = new Player(this.game, this.keys);
    this.player.sprite.position.x = this.config.startX * 16;
    this.player.sprite.position.y = this.config.startY * 16;
    this.header = new GameHeaderText(this.game);

    this.createMap();
    this.pauseLevel(false);

    if (this.backgroundMusic) {
      this.backgroundMusic.destroy();
    }

    this.backgroundMusic = this.game.add.audio(this.config.song);
    this.backgroundMusic.play();

    Utils.Label.fadeText(this.game, 0, 100, `Level ${this.levelIndex + 1}`, 16, Utils.Label.TextAlign.Center);
    Utils.Label.fadeText(this.game, 400, 120, this.config.name, 8, Utils.Label.TextAlign.Center);
  }

  private createMap() {
    this.success = false;
    this.stats = Object.assign({ score: 0 }, this.stats, { bananasCollected: 0, bananasTotal: 0 });

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileChar = this.config.tileData[row][col];
        const tileConfig = Utils.Assets.getTileConfig(tileChar);

        if (!tileConfig) {
          continue;
        }

        const tileKey = tileConfig.key;

        if (tileKey === Utils.Assets.Sprites.BANANA) {
          this.stats.bananasTotal++;
        }

        const x = col * 16;
        const y = row * 16;
        const sprite = this.game.add.sprite(x, y, tileKey);
        tileConfig.addToLevel(this, sprite);
      }
    }
  }

  isLevelComplete() {
    return this.stats.bananasCollected === this.stats.bananasTotal;
  }

  pauseLevel(paused: boolean) {
    if (this.backgroundMusic) {
      if (paused) {
        this.backgroundMusic.pause();
      } else {
        this.backgroundMusic.resume();
      }
    }

    this.game.physics.arcade.isPaused = paused;
    this.isPaused = paused;
    this.player.sprite.animations.paused = paused;
  }

  showPauseMenu() {
    this.pauseLevel(true);
    const graphics = this.game.add.graphics(0, 0);
    graphics.beginFill(0x000000, 0.3);
    graphics.drawRect(0, 0, this.game.width, this.game.height);
  }

  hidePauseMenu() {
    this.pauseLevel(false);
  }

  levelSuccess() {
    this.success = true;
    const successTextChoices = [
      'Woohoo!',
      'Great Success!',
      'Go, Monkey, Go!',
    ];
    this.pauseLevel(true);
    const text = successTextChoices[this.game.rnd.integerInRange(0, successTextChoices.length - 1)];
    Utils.Label.fadeText(this.game, 0, 104, text, 16, Utils.Label.TextAlign.Center).then(() => {
      this.goToLevel(this.levelIndex + 1);
    });
  }

  die() {
    this.backgroundMusic.stop();
    this.deathSound.play();
    const failureTextChoices = [
      'Oh poop',
      'You made baby monkey sad :(',
      'Nooooooooooooooo!!!',
    ];
    this.pauseLevel(true);
    const text = failureTextChoices[this.game.rnd.integerInRange(0, failureTextChoices.length - 1)];
    Utils.Label.fadeText(this.game, 0, 104, text, 8, Utils.Label.TextAlign.Center).then(() => {
      setTimeout(() => {
        this.restart();
      }, 500);
    });
  }

  update() {
    if (this.keys.justDown(Utils.Input.Action.OpenPauseMenu)) {
      this.pauseMenu.toggle();
    }

    if (this.pauseMenu.isOpen) {
      this.pauseMenu.update();
    }

    if (this.isPaused) {
      return;
    }

    this.game.physics.arcade.collide(this.player.sprite, this.walls);
    this.game.physics.arcade.overlap(this.player.sprite, this.bananas, this.eatBanana, undefined, this);
    this.game.physics.arcade.overlap(this.player.sprite, this.enemies, this.restart, undefined, this);

    this.player.update();

    if (this.player.body.position.y > this.world.height) {
      this.die();
    }

    if (!this.success && this.isLevelComplete()) {
      this.levelSuccess();
    }

    this.header.update(this.stats);
  }

  goToLevel(index: number) {
    this.levelIndex = index % levels.length;
    this.game.state.start(GameStates.Dungeon);
  }

  private eatBanana(__player: Phaser.Sprite, banana: Phaser.Sprite) {
    banana.kill();
    this.bananaSound.play();
    this.stats.bananasCollected++;
    this.stats.score += 10;
  }

  restart() {
    this.goToLevel(this.levelIndex);
  }

  paused() {
    if (!this.isPaused) {
      this.pauseMenu.open();
    }
  }
}

interface LevelStats {
  bananasCollected: number;
  bananasTotal: number;
  score: number;
}

export class GameHeaderText {
  private scoreLabel: Phaser.BitmapText;
  private bananaLabel: Phaser.BitmapText;

  constructor(game: Phaser.Game) {
    this.scoreLabel = Utils.Label.addFixedLabel(game, 2, 'Score:', 8, Utils.Label.TextAlign.Left, 2);
    this.bananaLabel = Utils.Label.addFixedLabel(game, 2, '00/00', 8, Utils.Label.TextAlign.Right, 2);
  }

  update(stats: LevelStats) {
    this.scoreLabel.text = 'Score:' + stats.score;
    this.bananaLabel.text = `${Utils.Label.leftPad(stats.bananasCollected)}/${Utils.Label.leftPad(stats.bananasTotal)}`;
  }
}
