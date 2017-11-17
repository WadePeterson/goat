import * as Components from './components';
import { Entity, EntityMap } from './entities';
import * as Systems from './systems';
import * as Utils from './utils';
import { PauseMenu } from './PauseMenu';
import levels, { LevelConfig } from './levels';

export enum GameStates {
  Boot = 'boot',
  Dungeon = 'dungeon'
}

export class MainState extends Phaser.State {
  game: Phaser.Game;
  config: LevelConfig;
  header: GameHeaderText;
  levelIndex = 0;
  stats: LevelStats;
  success: boolean;
  isPaused: boolean;
  pauseMenu: PauseMenu;

  keys: Utils.Input.KeyMap;
  onEntityAdded: Phaser.Signal;
  entities: EntityMap;
  sprites: { [key: string]: Phaser.Sprite };
  systems: Systems.System[];

  preload() {
    this.config = levels[this.levelIndex];
    const loadedTiles: { [key: string]: boolean } = {};

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileConfig = Utils.Assets.getTileConfig(this.config.tileData[row][col]);
        if (tileConfig && !loadedTiles[tileConfig.key]) {
          this.game.load.image(tileConfig.key, tileConfig.imgPath);
          loadedTiles[tileConfig.key] = true;
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

    this.keys = new Utils.Input.KeyMap(this.game);
    this.pauseMenu = new PauseMenu(this.game, this);

    this.sprites = {};
    this.entities = {};
    this.onEntityAdded = new Phaser.Signal();

    this.systems = [
      new Systems.Render(this.game, this)
    ];

    this.addEntity(new Entity()
      .addComponent(Components.PlayerControllable())
      .addComponent(Components.Position({ x: this.config.startX * 16, y: this.config.startY * 16 }))
      .addComponent(Components.Velocity())
      .addComponent(Components.Health({ max: 100 }))
      .addComponent(Components.Sprite({ key: Utils.Assets.Sprites.MONKEY })));

    this.header = new GameHeaderText(this.game);

    this.createMap();
    this.pauseLevel(false);
  }

  private addEntity(entity: Entity) {
    this.entities[entity.id] = entity;
    this.onEntityAdded.dispatch(entity);
  }

  private createMap() {
    this.success = false;
    this.stats = Object.assign({ score: 0 }, this.stats, { bananasCollected: 0, bananasTotal: 0 });

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileConfig = Utils.Assets.getTileConfig(this.config.tileData[row][col]);
        if (!tileConfig) {
          continue;
        }

        const tileKey = tileConfig.key;
        if (tileKey === Utils.Assets.Sprites.BANANA) {
          this.stats.bananasTotal++;
        }

        this.addEntity(new Entity()
          .addComponent(Components.Sprite({ key: tileKey }))
          .addComponent(Components.Position({ x: col * 16, y: row * 16 })));
      }
    }
  }

  isLevelComplete() {
    return this.stats.bananasCollected === this.stats.bananasTotal;
  }

  pauseLevel(paused: boolean) {
    this.game.physics.arcade.isPaused = paused;
    this.isPaused = paused;
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

    // this.renderSystem.update(this.entities);

    // this.game.physics.arcade.collide(this.player.sprite, this.walls);
    // this.game.physics.arcade.overlap(this.player.sprite, this.bananas, this.eatBanana, undefined, this);
    // this.game.physics.arcade.overlap(this.player.sprite, this.enemies, this.restart, undefined, this);

    // this.player.update();

    // if (this.player.body.position.y > this.world.height) {
    //   this.die();
    // }

    // if (!this.success && this.isLevelComplete()) {
    //   this.levelSuccess();
    // }

    // this.header.update(this.stats);
  }

  goToLevel(index: number) {
    this.levelIndex = index % levels.length;
    this.game.state.start(GameStates.Dungeon);
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
